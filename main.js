// A BrowserView can be used to embed additional web content into a BrowserWindow.
// It is like a child window, except that it is positioned relative to its owning
// window. It is meant to be an alternative to the webview tag.
//
// For more info, see:
// https://electronjs.org/docs/api/browser-view

// In the main process.
const { BrowserView, BrowserWindow, app, dialog, protocol, ipcMain } = require('electron')
const Menu = require("electron-create-menu")
const Store = require('electron-store');
const prompt = require('electron-prompt');
const settings = require('electron-settings')
const storage = require('electron-json-storage');
const { file } = require('electron-settings');
storage.setDataPath(app.getPath('appData'))
var fullyLoaded = false

var currentCameraURL
var currentCameraTitle
const favorites = new Store();
var favoritesName = []
var indexPage = 'file://' + app.getAppPath() + '/html/index.htm'
console.log(app.getAppPath())
    //var textColor = 'white'aa


var transparentCameraWindow = true
var resetStoreAfterOpen = true
var win2




//Table clsss for css is tableCSS

var winOnlyNotTransFrame
    // Parameter fix
if (resetStoreAfterOpen === true) {
    favorites.clear()
}
if (process.platform == 'win32') {
    winOnlyNotTransFrame = transparentCameraWindow
} else {
    winOnlyNotTransFrame = true
}



app.whenReady().then(() => {
    setupMenu()
    let win = new BrowserWindow({ width: 1100, height: 500, webPreferences: { webSecurity: false } })

    win.on('closed', () => {
        win = null
    })

    win.loadFile('html/index.htm')
        //win.webContents.insertCSS(".tableCSS th{font-family:sans-serif;font-size:1.4em;text-align:left;padding-top:100px;padding-bottom:4px;#background-color:#9F9F9F;background-color:#767676;color:#fff;}")
    win.setIcon('icon.png')
    fullyLoaded = true
    win.on('page-title-updated', () => {
        var win2 = new BrowserWindow({ width: 310, height: 425, transparent: transparentCameraWindow, frame: winOnlyNotTransFrame, webPreferences: { webSecurity: false }, alwaysOnTop: true })
        if (win.webContents.getURL != indexPage) {

            win2.loadURL(win.webContents.getURL())

            if (win2.webContents.getURL() == indexPage) { win2.close() }

            console.log(win.webContents.getURL())

            win.loadFile('html/index.htm')
        }
        win.webContents.insertCSS(".tableCSS th{font-family:sans-serif;font-size:1.4em;text-align:left;padding-top:100px;padding-bottom:4px;#background-color:#9F9F9F;background-color:#767676;color:#fff;}")
        win2.on('page-title-updated', () => {
            try {
                if (win2.webContents.getURL() == indexPage) {
                    win2.close()
                } else {
                    win2.webContents.insertCSS('#wx{position:absolute;top:270px;width:320px;color:white}')
                }
            } catch (err) {
                console.log("If you see this, hi")
            }
        })
        win2.on('did-finish-load', () => {
            win2.webContents.insertCSS('#wx{position:absolute;top:270px;width:320px;color:white}')
                //win2.webContents.insertCSS('#wx{position:absolute;top:270px;width:320px;color:white}')
        })

    })

})

function setFavorites() {
    /*
        //var fav = Object.create()
        storage.set(String(favorites.size), { 'name': prompt({ title: 'What Do You Want To Name It?', label: 'Name:', value: currentCameraTitle, inputAttrs: { type: 'text' }, type: 'input', alwaysOnTop: true }), 'url': currentCameraURL })
        //.catch(dialog.showErrorBox("You haven't clicked on a camera yet or something's wrong"))
        console.log("Saved new favorite \n Current List of Favorites:")
        storage.keys(function(error, keys) {
           if (error) throw error;

           for (var key of keys) {
                console.log(key);
           }
        });
    */

}

function updateFavorites() {
    console.log(storage.getAll())
}

function setupMenu() {
    Menu()
    Menu((defaultMenu, separator) => {
        defaultMenu.push({
            role: 'help',
            submenu: [{
                label: 'Learn More',
                click: async() => {
                    const { shell } = require('electron')
                    await shell.openExternal('https://github.com/child-duckling/cal-cams')
                }
            }]
        }, {
            label: "Favorites",
            submenu: [{
                    label: "Add to Favorites",
                    click: setFavorites()
                },
                separator(),
                { label: "~~~under construction~~~~" }
            ]
        })

        return defaultMenu
    })
}
ipcMain.on('online-status-changed', (event, status) => {
    console.log(status)
})