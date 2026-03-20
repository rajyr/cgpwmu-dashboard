# Windows Server Deployment Guide - IIS (Frontend) + PM2 (Backend)

This guide provides instructions for hosting the **CG-PWMU Dashboard** using IIS to serve static files and proxying API requests to a **PM2-managed Node.js process**.

## Goal
Host the application at `https://[YOUR_DOMAIN_OR_IP]/cgpwmu`.

---

## 1. Prerequisites
1. **Node.js** (v18+) and **NPM** installed.
2. **IIS URL Rewrite Module** installed.
3. **Application Request Routing (ARR) 3.0** installed.
   - **Important**: In IIS Manager -> Server Node -> **Application Request Routing Cache** -> **Server Proxy Settings**, ensure "**Enable proxy**" is checked.
4. **PM2** installed globally: `npm install -g pm2`.

---

## 2. Prepare for Build
1. **Build**: Run `npm run build` locally. This creates a `dist` folder.
2. **Transfer**: Upload the entire project folder to `C:\inetpub\wwwroot\cgpwmu`.

---

## 3. Folder Structure
Your `C:\inetpub\wwwroot\cgpwmu` folder should look like this:
```
cgpwmu/
├── node_modules/
├── public/             (Contents of 'dist/ ' go here)
│   ├── index.html
│   └── assets/
├── server/
│   ├── index.js
│   ├── db.js
│   └── database.sqlite
├── package.json
└── web.config          (Already configured for Reverse Proxy)
```

---

## 4. Backend Setup (PM2)
On the server, open a terminal in `C:\inetpub\wwwroot\cgpwmu` and run:
```bash
# Initialize database (only once)
node server/init-db.js

# Start backend with PM2
pm2 start server/index.js --name "cgpwmu-backend"

# Save PM2 list so it restarts on reboot
pm2 save
pm2 startup
```

---

## 5. IIS Setup
1. **Add Application**: Right-click your site -> **Add Application**.
   - Alias: `cgpwmu`
   - Path: `C:\inetpub\wwwroot\cgpwmu`
2. **Permissions**: Right-click `server` folder -> Properties -> Security -> Add `IIS AppPool\DefaultAppPool` (or your app pool name) and grant **Modify** permissions.

---

## 6. Troubleshooting
- **502 Bad Gateway**: Check if the PM2 process is running (`pm2 list`).
- **403 Forbidden**: Ensure IIS has permission to read the `public` folder.
- **404 on API**: Ensure ARR Proxy is enabled (Step 1.3).
