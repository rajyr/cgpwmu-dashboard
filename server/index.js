import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cron from 'node-cron';
import { exec } from 'child_process';
import db from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const slugify = (text) => text?.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '_').replace(/^-+|-+$/g, '') || '';
const generateId = (prefix, name) => {
  const baseId = name ? `${prefix}_${slugify(name)}` : prefix;
  return `${baseId}_${Math.random().toString(36).substring(2, 6)}`;
};

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
  console.log(`[LOGIN ATTEMPT] Email: ${email}`);
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
    console.error('[LOGIN ERROR]', error);
    try {
        fs.appendFileSync('server_error.log', `[${new Date().toISOString()}] LOGIN ERROR: ${error.message}\n${error.stack}\n`);
    } catch (e) {
        console.error('Failed to write to server_error.log:', e.message);
    }
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

authRouter.post('/signup', async (req, res) => {
  const { email, password, full_name, role, district, phone_number, registration_data } = req.body;
  try {
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    let id;
    if (role === 'PWMUManager') {
      id = generateId('pwmu', registration_data?.pwmuName || full_name);
    } else if (role === 'VillageUser') {
      id = generateId('village', full_name);
    } else {
      id = Math.random().toString(36).substring(2, 15);
    }
    const autoApprove = db.prepare('SELECT value FROM system_settings WHERE key = ?').get('auto_approve_users');
    const status = (autoApprove?.value === 'true' || autoApprove?.value === 1 || autoApprove?.value === true) ? 'approved' : 'pending';

    db.prepare(`
      INSERT INTO users (id, email, password_hash, full_name, role, status, district, phone_number, registration_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, email, passwordHash, full_name, role, status, district, phone_number, JSON.stringify(registration_data));

    // Auto-create pwmu_centers entry for PWMU Managers
    // This is critical for inventory sync — both DailyLog and MonthlyReport
    // look up the center by nodal_officer_id = user.id
    if (role === 'PWMUManager') {
      const centerName = registration_data?.pwmuName || full_name || 'Unknown PWMU';
      const centerId = id; // Use the same ID as the user for direct lookup consistency
      const existingCenter = db.prepare('SELECT id FROM pwmu_centers WHERE nodal_officer_id = ?').get(id);
      if (!existingCenter) {
        db.prepare(`
          INSERT OR IGNORE INTO pwmu_centers (id, name, district, block, gram_panchayat, village, nodal_officer_id, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'operational')
        `).run(
          centerId,
          centerName,
          registration_data?.district || district || '',
          registration_data?.block || '',
          registration_data?.gramPanchayat || '',
          registration_data?.villageName || '',
          id
        );
        console.log(`[SIGNUP] Auto-created pwmu_centers entry for ${centerName} (id: ${centerId})`);
      }
    }

    res.json({ message: 'User registered successfully', status });
  } catch (error) {
    console.error('[SIGNUP ERROR]', error);
    res.status(500).json({ error: 'Server error', details: error.message });
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

// --- Admin Database Management Endpoints ---
dataRouter.get('/admin/tables', authenticateToken, (req, res) => {
  if (req.user?.role !== 'StateAdmin') return res.status(403).json({ error: 'Unauthorized' });
  try {
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
    res.json(tables.map(t => t.name));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

dataRouter.get('/admin/schema/:table', authenticateToken, (req, res) => {
  if (req.user?.role !== 'StateAdmin') return res.status(403).json({ error: 'Unauthorized' });
  try {
    // Only allow alphanumeric table names to prevent SQL injection in PRAGMA
    if (!/^[a-zA-Z0-9_]+$/.test(req.params.table)) return res.status(400).json({ error: 'Invalid table name' });
    const schema = db.prepare(`PRAGMA table_info(${req.params.table})`).all();
    res.json(schema);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

dataRouter.post('/admin/query', authenticateToken, (req, res) => {
  if (req.user?.role !== 'StateAdmin') return res.status(403).json({ error: 'Unauthorized' });
  const { query, params = [] } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });
  
  // Basic safety: Prevent DROP tables entirely to save them from themselves
  if (/DROP\s+TABLE/i.test(query)) {
    return res.status(403).json({ error: 'DROP TABLE operations are blocked via this interface for safety. Use init-db.js to reset.' });
  }

  try {
    if (query.trim().toUpperCase().startsWith('SELECT') || query.trim().toUpperCase().startsWith('PRAGMA')) {
      const data = db.prepare(query).all(...params);
      res.json({ success: true, data });
    } else {
      const info = db.prepare(query).run(...params);
      res.json({ success: true, changes: info.changes, lastInsertRowid: info.lastInsertRowid });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

dataRouter.get('/:table', authenticateToken, (req, res) => {
  const { table } = req.params;
  if (!table || table === 'undefined' || table === 'null') {
    return res.status(400).json({ error: 'Valid table name is required' });
  }
  const { select, order, limit, ...filters } = req.query;
  
  let query = '';
  try {
    query = `SELECT ${select || '*'} FROM ${table}`;
    const params = [];
    const whereClauses = [];

    // --- Filter Parsing ---
    Object.entries(filters).forEach(([key, value]) => {
      const values = Array.isArray(value) ? value : [value];
      
      values.forEach(v => {
        if (typeof v !== 'string') return;

        const processValue = (k, filterVal) => {
          const firstDot = filterVal.indexOf('.');
          if (firstDot === -1) return null;
          
          const op = filterVal.substring(0, firstDot);
          const val = filterVal.substring(firstDot + 1);

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

        if (key === 'or' && v.startsWith('(') && v.endsWith(')')) {
          const content = v.substring(1, v.length - 1);
          const orParts = content.split(',');
          const subClauses = [];
          orParts.forEach(part => {
            const firstDot = part.indexOf('.');
            if (firstDot === -1) return;
            const k = part.substring(0, firstDot);
            const val = part.substring(firstDot + 1);
            const result = processValue(k, val);
            if (result) {
              subClauses.push(result.sql);
              if (Array.isArray(result.p)) params.push(...result.p);
              else if (result.p !== null) params.push(result.p);
            }
          });
          if (subClauses.length > 0) whereClauses.push(`(${subClauses.join(' OR ')})`);
        } else {
          const result = processValue(key, v);
          if (result) {
            whereClauses.push(result.sql);
            if (Array.isArray(result.p)) params.push(...result.p);
            else if (result.p !== null) params.push(result.p);
          }
        }
      });
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
      if (row.machine_health && typeof row.machine_health === 'string') {
        try { row.machine_health = JSON.parse(row.machine_health); } catch (e) {}
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
      if (!record.id) {
        if (table === 'pwmu_centers') record.id = generateId('pwmu', record.name);
        else if (table === 'waste_collections') record.id = generateId('waste', record.village_name);
        else record.id = Math.random().toString(36).substring(2, 15);
      }
      
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
      if (!record.id) {
        if (table === 'pwmu_centers') record.id = generateId('pwmu', record.name);
        else if (table === 'waste_collections') record.id = generateId('waste', record.village_name);
        else record.id = Math.random().toString(36).substring(2, 15);
      }

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

dataRouter.patch('/:table', authenticateToken, (req, res) => {
  const { table } = req.params;
  const data = req.body;
  const filters = req.query;
  try {
    const params = [];
    const setClauses = [];
    Object.entries(data).forEach(([key, value]) => {
      setClauses.push(`${key} = ?`);
      if (typeof value === 'boolean') params.push(value ? 1 : 0);
      else if (typeof value === 'object' && value !== null) params.push(JSON.stringify(value));
      else params.push(value);
    });

    const whereClauses = [];
    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === 'string' && value.startsWith('eq.')) {
        whereClauses.push(`${key} = ?`);
        params.push(value.split('.')[1]);
      }
    });

    if (setClauses.length > 0 && whereClauses.length > 0) {
      const query = `UPDATE ${table} SET ${setClauses.join(', ')} WHERE ${whereClauses.join(' AND ')}`;
      console.log(`[UPDATE] ${table}:`, { data, filters });
      db.prepare(query).run(...params);
      res.json({ message: 'Updated' });
    } else {
      res.status(400).json({ error: 'Data and filters (eq) required for update' });
    }
  } catch (error) {
    console.error(`Database update error in ${table}:`, error);
    res.status(500).json({ error: `Database update error in ${table}: ${error.message}` });
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

app.put('/api/users/profile', authenticateToken, handleProfileUpdate);
app.put('/cgpwmu/api/users/profile', authenticateToken, handleProfileUpdate);

function handleProfileUpdate(req, res) {
    console.log(`[PROFILE UPDATE] User: ${req.user.id} (${req.user.email})`);
    try {
        const { full_name, phone_number, registration_data } = req.body;
        console.log('[PROFILE UPDATE DATA]', { full_name, phone_number, regDataKeys: Object.keys(registration_data || {}) });
        
        db.prepare(`
            UPDATE users 
            SET full_name = ?, phone_number = ?, registration_data = ?
            WHERE id = ?
        `).run(full_name, phone_number, JSON.stringify(registration_data), req.user.id);
        
        console.log('[PROFILE UPDATE SUCCESS]');
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('[PROFILE UPDATE ERROR]', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
}

app.use('/api/auth', authRouter);
app.use('/cgpwmu/api/auth', authRouter);
app.use('/api/data', dataRouter);
app.use('/cgpwmu/api/data', dataRouter);

// --- Security: Change Password (Self) ---
app.post(['/api/auth/change-password', '/cgpwmu/api/auth/change-password'], authenticateToken, async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    try {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, req.user.id);
        console.log(`[PASSWORD CHANGE] User: ${req.user.id} (${req.user.email})`);
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('[PASSWORD CHANGE ERROR]', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// --- Admin: Reset Password (Other Users) ---
app.post(['/api/admin/reset-password', '/cgpwmu/api/admin/reset-password'], authenticateToken, async (req, res) => {
    // Check if requester is Admin or StateAdmin
    if (req.user.role !== 'Admin' && req.user.role !== 'StateAdmin') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    const { userId, newPassword } = req.body;
    if (!userId || !newPassword || newPassword.length < 8) {
        return res.status(400).json({ error: 'User ID and a 8+ character password are required' });
    }

    try {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        const result = db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, userId);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

    console.log(`[ADMIN PASSWORD RESET] Admin: ${req.user.id} reset password for User: ${userId}`);
        res.json({ message: 'User password reset successfully' });
    } catch (error) {
        console.error('[ADMIN PASSWORD RESET ERROR]', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// --- Admin: Trigger Backup ---
app.post(['/api/admin/trigger-backup', '/cgpwmu/api/admin/trigger-backup'], authenticateToken, (req, res) => {
    // Check if requester is Admin or StateAdmin
    if (req.user.role !== 'Admin' && req.user.role !== 'StateAdmin') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    console.log(`[ADMIN BACKUP] Triggered manually by Admin: ${req.user.id} (${req.user.email})`);
    
    // Execute the existing backup script
    exec('npm run backup', (error, stdout, stderr) => {
        if (error) {
            console.error(`[Admin Backup] Script Error: ${error.message}`);
            return res.status(500).json({ 
                error: 'Backup script failed to start', 
                details: error.message 
            });
        }
        
        if (stderr && stderr.includes('Error')) {
            console.warn(`[Admin Backup] Script warning/error in stderr: ${stderr}`);
        }

        console.log(`[Admin Backup] Script Output: ${stdout}`);
        res.json({ 
            message: 'Backup process initiated successfully. Data is being pushed to Google Sheets.',
            output: stdout.split('\n').slice(-3).join('\n') // Return last few lines of output
        });
    });
});

// Coverage Statistics for Map
app.get(['/api/location-stats', '/cgpwmu/api/location-stats'], (req, res) => {
    try {
        const locPath = path.join(__dirname, '../public/data/locationData.json');
        const locationData = JSON.parse(fs.readFileSync(locPath, 'utf8'));
        
        const stats = {};
        
        // 1. Calculate Total Villages from locationData.json
        Object.keys(locationData).forEach(rawDistrict => {
            const dName = rawDistrict.split(' (')[0];
            let villageCount = 0;
            const blocks = locationData[rawDistrict];
            Object.values(blocks).forEach(gps => {
                Object.values(gps).forEach(villages => {
                    villageCount += villages.length;
                });
            });
            stats[dName] = { totalVillages: villageCount, reportingVillages: 0, totalSHGs: villageCount, reportingSHGs: 0 };
        });

        // 2. Count Reporting Villages from village_waste_reports
        const reportingV = db.prepare(`
            SELECT district, COUNT(DISTINCT village_name) as count 
            FROM village_waste_reports 
            GROUP BY district
        `).all();
        reportingV.forEach(rv => {
            const d = (rv.district || '').split(' (')[0];
            if (stats[d]) stats[d].reportingVillages = rv.count;
        });

        // 3. Count Active SHGs (Village Users who have reported)
        const activeSHGs = db.prepare(`
            SELECT district, COUNT(DISTINCT user_id) as count 
            FROM village_waste_reports 
            GROUP BY district
        `).all();
        activeSHGs.forEach(as => {
            const d = (as.district || '').split(' (')[0];
            if (stats[d]) stats[d].reportingSHGs = as.count;
        });

        res.json(stats);
    } catch (error) {
        console.error('[LOCATION STATS ERROR]', error);
        res.status(500).json({ error: 'Failed to fetch location stats' });
    }
});

app.get(/\/cgpwmu\/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[GLOBAL ERROR]', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
  });
});

app.listen(PORT, () => { 
  console.log(`Server running on port ${PORT}`); 
  
  // Weekly backup (Every Sunday at 00:00)
  cron.schedule('0 0 * * 0', () => {
    console.log('[Cron] Starting weekly Google Sheets backup...');
    exec('npm run backup', (error, stdout, stderr) => {
      if (error) {
        console.error(`[Cron] Backup error: ${error.message}`);
        return;
      }
      console.log(`[Cron] Backup completed successfully.`);
    });
  });
});
