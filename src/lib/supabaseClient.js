// This is a robust mock Supabase client that redirects calls to our local Node.js + SQLite backend
const API_URL = '/cgpwmu/api';

const fetchLocal = async (url, options = {}) => {
    const sessionDetail = localStorage.getItem('cgpwmu_session');
    const session = sessionDetail ? JSON.parse(sessionDetail) : {};
    const token = session.access_token;
    const headers = {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        ...options.headers
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `Request failed (${res.status})` }));
        throw new Error(err.error || `Request failed (${res.status})`);
    }
    return res.json();
};

export const supabase = {
    auth: {
        signIn: async ({ email, password }) => {
            try {
                const data = await fetchLocal(`${API_URL}/auth/login`, {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                });
                return { data, error: null };
            } catch (e) {
                return { data: null, error: e.message };
            }
        },
        signUp: async ({ email, password, options }) => {
            try {
                const data = await fetchLocal(`${API_URL}/auth/signup`, {
                    method: 'POST',
                    body: JSON.stringify({ email, password, ...options.data })
                });
                return { data, error: null };
            } catch (e) {
                return { data: null, error: e.message };
            }
        },
        signOut: async () => ({ error: null })
    },
    from: (table) => {
        let query = {
            selectStr: '*',
            filters: [],
            orderStr: null,
            limitVal: null
        };

        const builder = {
            select: function(cols) {
                query.selectStr = cols || '*';
                return this;
            },
            eq: function(col, val) {
                query.filters.push(`${col}.eq.${val}`);
                return this;
            },
            neq: function(col, val) {
                query.filters.push(`${col}.neq.${val}`);
                return this;
            },
            gt: function(col, val) {
                query.filters.push(`${col}.gt.${val}`);
                return this;
            },
            gte: function(col, val) {
                query.filters.push(`${col}.gte.${val}`);
                return this;
            },
            lt: function(col, val) {
                query.filters.push(`${col}.lt.${val}`);
                return this;
            },
            lte: function(col, val) {
                query.filters.push(`${col}.lte.${val}`);
                return this;
            },
            like: function(col, val) {
                query.filters.push(`${col}.like.${val}`);
                return this;
            },
            ilike: function(col, val) {
                query.filters.push(`${col}.ilike.${val}`);
                return this;
            },
            is: function(col, val) {
                query.filters.push(`${col}.is.${val}`);
                return this;
            },
            in: function(col, vals) {
                query.filters.push(`${col}.in.(${vals.join(',')})`);
                return this;
            },
            or: function(filters) {
                query.filters.push(`or.(${filters})`);
                return this;
            },
            order: function(col, { ascending } = { ascending: true }) {
                query.orderStr = `${col}.${ascending ? 'ASC' : 'DESC'}`;
                return this;
            },
            limit: function(val) {
                query.limitVal = val;
                return this;
            },
            maybeSingle: async () => {
                try {
                    const params = new URLSearchParams();
                    params.append('select', query.selectStr);
                    query.filters.forEach(f => {
                        // Handle simple filters (col.op.val) and complex ones (or.(...))
                        if (f.startsWith('or.(')) {
                            params.append('or', f.substring(3)); // Pass the content of or(...)
                        } else {
                            const [col, op, ...valParts] = f.split('.');
                            const val = valParts.join('.');
                            params.append(col, `${op}.${val}`);
                        }
                    });
                    if (query.orderStr) params.append('order', query.orderStr);
                    if (query.limitVal) params.append('limit', query.limitVal);

                    const data = await fetchLocal(`${API_URL}/data/${table}?${params.toString()}`);
                    return { data: data[0] || null, error: null };
                } catch (e) {
                    return { data: null, error: { message: e.message } };
                }
            },
            insert: async (dataToInsert) => {
                try {
                    const res = await fetchLocal(`${API_URL}/data/${table}`, {
                        method: 'POST',
                        body: JSON.stringify(dataToInsert)
                    });
                    return { data: res, error: null };
                } catch (e) {
                    return { data: null, error: { message: e.message } };
                }
            },
            upsert: async (dataToUpsert) => {
                try {
                    const res = await fetchLocal(`${API_URL}/data/${table}`, {
                        method: 'PUT',
                        body: JSON.stringify(dataToUpsert)
                    });
                    return { data: res, error: null };
                } catch (e) {
                    return { data: null, error: { message: e.message } };
                }
            },
            delete: async () => {
                try {
                    const params = new URLSearchParams();
                    query.filters.forEach(f => {
                        if (f.startsWith('or.(')) {
                            params.append('or', f.substring(3));
                        } else {
                            const [col, op, ...valParts] = f.split('.');
                            const val = valParts.join('.');
                            params.append(col, `${op}.${val}`);
                        }
                    });
                    const res = await fetchLocal(`${API_URL}/data/${table}?${params.toString()}`, {
                        method: 'DELETE'
                    });
                    return { data: res, error: null };
                } catch (e) {
                    return { data: null, error: { message: e.message } };
                }
            }
        };

        // Add thenable behavior for direct .from().select() usage
        builder.then = async (onfulfilled) => {
            try {
                const params = new URLSearchParams();
                params.append('select', query.selectStr);
                query.filters.forEach(f => {
                    if (f.startsWith('or.(')) {
                        params.append('or', f.substring(3));
                    } else {
                        const parts = f.split('.');
                        if (parts.length >= 2) {
                            const col = parts[0];
                            const op = parts[1];
                            const val = parts.slice(2).join('.');
                            params.append(col, `${op}.${val}`);
                        }
                    }
                });
                if (query.orderStr) params.append('order', query.orderStr);
                if (query.limitVal) params.append('limit', query.limitVal);

                const data = await fetchLocal(`${API_URL}/data/${table}?${params.toString()}`);
                return onfulfilled({ data, error: null });
            } catch (e) {
                return onfulfilled({ data: [], error: { message: e.message } });
            }
        };

        return builder;
    }
};
