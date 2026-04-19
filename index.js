const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron/main')
const path = require('node:path')

const REPO_URL = 'https://github.com/ankit123618/RoadFighterPC'
const DOCS_URL = `${REPO_URL}#readme`
const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`

const createAppMenu = () => {
    const template = [
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Documentation',
                    click: () => shell.openExternal(DOCS_URL)
                },
                {
                    label: 'License',
                    click: () => shell.openExternal(LICENSE_URL)
                }
            ]
        }
    ]

    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile(path.join(__dirname, 'dist', 'index.html'))
}

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong')
    createAppMenu()
    createWindow()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
