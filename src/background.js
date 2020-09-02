'use strict'

import {app, protocol, BrowserWindow, Menu} from 'electron'
import {
    createProtocol,
    installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
import WebpackMigrationSource from './WebpackMigrationSource'
const isDevelopment = process.env.NODE_ENV !== 'production';
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: {secure: true, standard: true}}]);


const path = require('path')
const userDir = path.join(app.getPath('userData'), 'database.sqlite');

const fs = require('fs')
if(!fs.existsSync(userDir)){
    const sqlite3 = require('sqlite3');
    const db = new sqlite3.Database(userDir);
    db.close()
}

let knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: userDir
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: './src/db/migrations'
    },
    useNullAsDefault: true
})

const m1 = require('./db/migrations/20200823044448_users')
const m2 = require('./db/migrations/20200823045315_tpo')
const m3 = require('./db/migrations/20200823192406_class')
const m4 = require('./db/migrations/20200823192410_test')
const m5 = require('./db/migrations/20200823192413_time')
const m6 = require('./db/migrations/20200823192431_user_test')
knex.migrate.latest({
    migrationSource: new WebpackMigrationSource({
        '20200823044448_users.js': m1,
        '20200823045315_tpo.js': m2,
        '20200823192406_class.js': m3,
        '20200823192410_test.js': m4,
        '20200823192413_time.js': m5,
        '20200823192431_user_test.js': m6
    })
}).then(()=>{}).catch((err)=>{console.log(err)})

function createWindow() {
    win = new BrowserWindow({
        width: 904, height: 700,
        minWidth: 904,
        minHeight: 700,
        titleBarStyle: 'hidden',
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration:true,
        }
    });
    const template = [
        // { role: 'appMenu' }
        ...(process.platform === 'darwin' ? [{
            label: app.name,
            submenu: [
                {role: 'about'},
                {role: 'quit'}
            ]
        }] : []),
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools({mode: "detach"})
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')

    }
    win.on('closed', () => {
        win = null;
    })
    // win.setIgnoreMouseEvents(true)

}

// Create the browser window.


// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        // Devtools extensions are broken in Electron 6.0.0 and greater
        // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
        // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
        // If you are not using Windows 10 dark mode, you may uncomment these lines
        // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
        try {
            await installVueDevtools()
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()

        })
    }
}
