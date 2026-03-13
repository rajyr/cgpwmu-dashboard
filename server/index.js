import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-this';

app.use(cors());
app.use(express.json());

// Global Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static files from the 'public' folder
app.use('/cgpwmu', express.static(path.join(__dirname, '../public')));

// --- Auth Routes ---
const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    const { password_hash, ...userWithoutPassword } = user;
    if (userWithoutPassword.registration_data) {
        try { userWithoutPassword.registration_data = JSON.parse(userWithoutPassword.registration_data); } catch(e) {}
    }
    
    res.json({
      user: userWithoutPassword,
      access_token: token,
      expires_in: 86400
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

authRouter.post('/signup', async (req, res) => {
  const { email, password, full_name, role, district, phone_number, registration_data } = req.body;
  try {
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const id = Math.random().toString(36).substring(2, 15);
    const autoApprove = db.prepare('SELECT value FROM system_settings WHERE key = ?').get('auto_approve_users');
    const status = autoApprove?.value === 'true' ? 'approved' : 'pending';

    db.prepare(`
      INSERT INTO users (id, email, password_hash, full_name, role, status, district, phone_number, registration_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, email, passwordHash, full_name, role, status, district, phone_number, JSON.stringify(registration_data));

    res.json({ message: 'User registered successfully', status });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Middleware to verify JWT or API Key ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const apiKey = req.headers['apikey'];

  // Improved API key check (trimmed)
  const serverApiKey = (process.env.VITE_SUPABASE_ANON_KEY || '').trim();
  const requestApiKey = (apiKey || '').trim();

  if (req.method === 'GET' && requestApiKey === serverApiKey && serverApiKey !== '') {
    req.user = { role: 'Public', id: 'public' };
    return next();
  }

  if (!token) {
    console.warn(`[AUTH] Missing token for ${req.method} ${req.originalUrl}. API Key matched: ${requestApiKey === serverApiKey}`);
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error(`[AUTH] JWT Verification failed for ${req.method} ${req.originalUrl}:`, err.message);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// --- Data Routes ---
const dataRouter = express.Router();

// Safeguard against missing table names in the URL
dataRouter.get('/', (req, res) => {
  res.status(400).json({ error: 'Table name is required in the path (e.g., /api/data/users)' });
});

dataRouter.get('/:table', authenticateToken, (req, res) => {
  const { table } = req.params;
  if (!table || table === 'undefined' || table === 'null') {
    return res.status(400).json({ error: 'Valid table name is required' });
  }
  const { select, order, limit, ...filters } = req.query;
  
  try {
    let query = `SELECT ${select || '*'} FROM ${table}`;
    const params = [];
    const whereClauses = [];

    // --- Filter Parsing ---
    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value !== 'string') return;

      const processValue = (k, v) => {
        const firstDot = v.indexOf('.');
        if (firstDot === -1) return null;
        
        const op = v.substring(0, firstDot);
        const val = v.substring(firstDot + 1);

        switch (op) {
          case 'eq': return { sql: `${k} = ?`, p: val };
          case 'neq': return { sql: `${k} != ?`, p: val };
          case 'gt': return { sql: `${k} > ?`, p: val };
          case 'gte': return { sql: `${k} >= ?`, p: val };
          case 'lt': return { sql: `${k} < ?`, p: val };
          case 'lte': return { sql: `${k} <= ?`, p: val };
          case 'like': return { sql: `${k} LIKE ?`, p: val.replace(/\*/g, '%') };
          case 'ilike': return { sql: `LOWER(${k}) LIKE ?`, p: val.toLowerCase().replace(/\*/g, '%') };
          case 'is': return { sql: `${k} IS ${val === 'null' ? 'NULL' : val}`, p: null };
          case 'in': 
            const inValues = val.replace(/[()]/g, '').split(',');
            return { sql: `${k} IN (${inValues.map(() => '?').join(',')})`, p: inValues };
          default: return null;
        }
      };

      if (key === 'or' && value.startsWith('(') && value.endsWith(')')) {
        const content = value.substring(1, value.length - 1);
        const orParts = content.split(',');
        const subClauses = [];
        orParts.forEach(part => {
          const firstDot = part.indexOf('.');
          if (firstDot === -1) return;
          const k = part.substring(0, firstDot);
          const v = part.substring(firstDot + 1);
          const result = processValue(k, v);
          if (result) {
            subClauses.push(result.sql);
            if (Array.isArray(result.p)) params.push(...result.p);
            else if (result.p !== null) params.push(result.p);
          }
        });
        if (subClauses.length > 0) whereClauses.push(`(${subClauses.join(' OR ')})`);
      } else {
        const result = processValue(key, value);
        if (result) {
          whereClauses.push(result.sql);
          if (Array.isArray(result.p)) params.push(...result.p);
          else if (result.p !== null) params.push(result.p);
        }
      }
    });

    if (table === 'users' && req.user && req.user.role === 'VillageUser') {
      whereClauses.push('id = ?');
      params.push(req.user.id);
    }

    if (whereClauses.length > 0) query += ` WHERE ${whereClauses.join(' AND ')}`;
    
    if (order) {
      const parts = order.split('.');
      if (parts.length >= 2) {
        query += ` ORDER BY ${parts[0]} ${parts[1].toUpperCase()}`;
      } else {
        query += ` ORDER BY ${parts[0]} ASC`;
      }
    }
    
    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    console.log(`[QUERY] ${query} | Params:`, params);

    const data = db.prepare(query).all(...params);
    const parsedData = data.map(row => {
      if (row.registration_data && typeof row.registration_data === 'string') {
        try { row.registration_data = JSON.parse(row.registration_data); } catch (e) {}
      }
      return row;
    });
    res.json(parsedData);
  } catch (error) {
    console.error(`Database error fetching from ${table}:`, error);
    console.error(`Query was: ${query}`);
    res.status(500).json({ error: `Database error in ${table}: ${error.message}`, query });
  }
});

dataRouter.post('/:table', authenticateToken, (req, res) => {
  const { table } = req.params;
  const data = req.body;
  try {
    const records = Array.isArray(data) ? data : [data];
    const results = [];
    for (const record of records) {
      if (!record.id) record.id = Math.random().toString(36).substring(2, 15);
      
      // Sanitize data for SQLite
      const sanitized = {};
      for (const [key, value] of Object.entries(record)) {
        if (value === undefined) sanitized[key] = null;
        else if (typeof value === 'boolean') sanitized[key] = value ? 1 : 0;
        else if (typeof value === 'object' && value !== null) sanitized[key] = JSON.stringify(value);
        else sanitized[key] = value;
      }

      const columns = Object.keys(sanitized);
      const placeholders = columns.map(() => '?').join(', ');
      const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
      console.log(`[INSERT] Into ${table}:`, sanitized);
      db.prepare(query).run(...Object.values(sanitized));
      results.push(sanitized);
    }
    res.status(201).json(Array.isArray(data) ? results : results[0]);
  } catch (error) {
    console.error(`Database insert error in ${table}:`, error);
    res.status(500).json({ error: `Database insert error in ${table}: ${error.message}` });
  }
});

dataRouter.put('/:table', authenticateToken, (req, res) => {
  const { table } = req.params;
  const data = req.body;
  try {
    const records = Array.isArray(data) ? data : [data];
    const results = [];
    for (const record of records) {
      if (!record.id) record.id = Math.random().toString(36).substring(2, 15);

      // Sanitize data for SQLite
      const sanitized = {};
      for (const [key, value] of Object.entries(record)) {
        if (value === undefined) sanitized[key] = null;
        else if (typeof value === 'boolean') sanitized[key] = value ? 1 : 0;
        else if (typeof value === 'object' && value !== null) sanitized[key] = JSON.stringify(value);
        else sanitized[key] = value;
      }

      const columns = Object.keys(sanitized);
      const placeholders = columns.map(() => '?').join(', ');
      const query = `INSERT OR REPLACE INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
      console.log(`[UPSERT] Into ${table}:`, sanitized);
      db.prepare(query).run(...Object.values(sanitized));
      results.push(sanitized);
    }
    res.json(Array.isArray(data) ? results : results[0]);
  } catch (error) {
    console.error(`Database upsert error in ${table}:`, error);
    res.status(500).json({ error: `Database upsert error in ${table}: ${error.message}` });
  }
});

dataRouter.delete('/:table', authenticateToken, (req, res) => {
  const { table } = req.params;
  const filters = req.query;
  try {
    let query = `DELETE FROM ${table}`;
    const params = [];
    const whereClauses = [];
    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === 'string' && value.startsWith('eq.')) {
        whereClauses.push(`${key} = ?`);
        params.push(value.split('.')[1]);
      }
    });
    if (whereClauses.length > 0) {
      console.log(`[DELETE] From ${table} Where:`, filters);
      db.prepare(`${query} WHERE ${whereClauses.join(' AND ')}`).run(...params);
      res.json({ message: 'Deleted' });
    } else {
      res.status(400).json({ error: 'Filter required' });
    }
  } catch (error) {
    console.error(`Database delete error in ${table}:`, error);
    res.status(500).json({ error: `Database delete error in ${table}: ${error.message}` });
  }
});

app.get(['/api/users/profile', '/cgpwmu/api/users/profile'], authenticateToken, (req, res) => {
    try {
      const user = db.prepare('SELECT id, email, full_name, role, status, registration_data FROM users WHERE id = ?').get(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      if (user.registration_data && typeof user.registration_data === 'string') {
        try { user.registration_data = JSON.parse(user.registration_data); } catch (e) {}
      }
      res.json(user);
    } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

app.use('/api/auth', authRouter);
app.use('/cgpwmu/api/auth', authRouter);
app.use('/api/data', dataRouter);
app.use('/cgpwmu/api/data', dataRouter);

app.get(/\/cgpwmu\/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
