# Windows Server (IIS) Deployment Guide - SQLite Edition

This guide provides instructions for hosting the **CG-PWMU Dashboard** with its local **SQLite database** on a Windows Server using IIS.

## Goal
Host the application at `https://sbmrural.cgstate.gov.in/cgpwmu`. All data is stored locally in a SQLite file, removing the need for Supabase.

---

## 1. Prerequisites
1. **Node.js** installed on the Windows Server.
2. **IIS URL Rewrite Module** installed.
3. **iisnode** installed (Recommended for running Node.js inside IIS).
   - [Download iisnode](https://github.com/tjanczuk/iisnode/releases)

---

## 2. Prepare for Build
1. Open `vite.config.js` and ensure `base: '/cgpwmu/'` is set.
2. Build the frontend:
   ```bash
   npm run build
   ```
3. This creates a `dist` folder.

---

## 3. Server Setup

### Step A: Folder Structure
Create a folder on your server (e.g., `C:\inetpub\wwwroot\cgpwmu`) and upload the following:
- The contents of your project's **root** (including `package.json`, `server/` folder, and `node_modules`).
- **Important**: Move the contents of the `dist` folder into a new folder named `public` inside the server's `cgpwmu` folder.

Your server folder should look like this:
```
cgpwmu/
├── node_modules/
├── public/ (Contents of 'dist' go here)
│   ├── index.html
│   └── assets/
├── server/
│   ├── index.js
│   ├── db.js
│   └── database.sqlite (Created after first run)
├── package.json
└── web.config
```

### Step B: IIS Configuration
1. Open **IIS Manager**.
2. Right-click your main site and select **Add Application**.
3. Alias: `cgpwmu`.
4. Physical Path: `C:\inetpub\wwwroot\cgpwmu`.
5. Ensure the Application Pool has **Read/Write permissions** for the `server/` folder (to allow SQLite to save data).

---

## 4. Database Initialization
On the server, open a terminal in your application folder and run:
```bash
node server/init-db.js
```
This will create the `database.sqlite` file with the default admin account:
- **Email**: `admin@cgpwmu.com`
- **Password**: `admin123`

---

## 5. GitHub Automation (Optional)
If using GitHub, your workflow should now:
1. `npm install`
2. `npm run build`
3. Upload the entire project (including `server/`, `package.json`, and the `dist` contents moved to `public/`) to the server.

---

## 6. Troubleshooting
- **Permission Denied**: Ensure the IIS user (usually `IIS AppPool\cgpwmu`) has "Modify" permissions on the `server` folder so it can write to `database.sqlite`.
- **404 on API**: Verify `iisnode` is installed and the `web.config` is present in the root.
