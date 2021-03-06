//  Electron stuff I might need
const { BrowserView, BrowserWindow, app, dialog, protocol, ipcMain, webContents, shell, MenuItem } = require('electron')
const screen = require('electron')
const path = require('path')
const Menu = require("electron-create-menu")
const settings = require('electron-settings')
const storage = require('electron-json-storage')
const fs = require('fs')
storage.setDataPath(app.getPath('appData'))
var fullyLoaded = false
const { fstat } = require('fs')
const { electron } = require('process')
var source = 'https://github.com/child-duckling/caltran-cameras'
var transparentCameraWindow = true

// Windows needs the frame to be transparent too
var winOnlyNotTransFrame
if (process.platform === 'win32') {
    winOnlyNotTransFrame = false
} else {
    winOnlyNotTransFrame = true
}

//==Widget Window==
class Camera {
    constructor(url) {
        this.url = url
        this.window = new BrowserWindow({ width: 310, height: 425, transparent: transparentCameraWindow, frame: winOnlyNotTransFrame, webPreferences: { webSecurity: false, contextIsolation: true }, alwaysOnTop: true, resizable: false, fullscreenable: false })
        this.jsWin = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=310,height=425,left=100,top=100`
        return this.url, this.window, this.jsWin

    }
    load() {
        this.window.loadURL(this.url)
            //var m = screen.getCursorScreenPoint()
            //console.log(m)
            //this.window.setPosition(m.x + 175, m.y / 3) ///////////////////////////////
        this.window.on('close', () => {
            console.log('\n' + this.window.getTitle() + " Closed")

        })
        console.log(this.url)
            //this.window.reload()
            //this.window.webContents.
        this.window.webContents.on('did-finish-load', () => {
            this.window.webContents.insertCSS("#wx{position:absolute;top:270px;width:320px;color: " + textColor() + "}") //Set Text Color
        })

    }
    getInfo() {
        return this.url, this.window.getTitle()
    }

}




app.whenReady().then(() => {
    //Check and install before things go wrong
    checkInstall(app)
    setupMenu()
    app.setActivationPolicy('accessory')
    let wrapper = new BrowserWindow({ title: 'CalCams' })
        //==Dissapear==
    wrapper.loadURL('about:blank')
    wrapper.blur()
    wrapper.hide()
    wrapper.setIcon('icon.png')
        //==Open List==
    shell.openExternal('https://duckling.pw/caltran-cameras/web/app-link.htm')
    fullyLoaded = true
})

app.setAsDefaultProtocolClient('cal-cam')
app.on('open-url', function(event, url) {
    event.preventDefault()
    deeplinkingUrl = url
    console.log(deeplinkingUrl)
    var link = String(deeplinkingUrl).split('cal-cam://')
    console.log(link)
    if (app.isReady() == true) {
        if (deeplinkingUrl == 'cal-cam://completed') {
            console.log('Successful Discord Auth')
            authCompleted = new BrowserWindow({ width: 170, height: 60 })
            authCompleted.loadFile(app.getAppPath() + '/discordAuth.html')
            var a = new MenuItem({ label: rpc.application.name })
            console.log(rpc.application.icon)
        } else if (deeplinkingUrl == 'cal-cam://list') {
            app.relaunch()
            app.quit()
        } else {
            console.log()
            console.log(link[1])
            var cam = new Camera(link[1])
            cam.load() ////////////////////////
        }
    } else {
        //app.relaunch()
    }



})


/*
Some people like to open the app before they drag it into the Applications folder.
Electron does not behave properly without it being in the Applications folder, so if they ignore the arrow in the .dmg,
I just do it for them, but with the cost of them having to enter their password.
*/

function checkInstall(app) {
    if (app.isPackaged == true && app.isInApplicationsFolder() == false && process.platform == 'darwin') {
        app.moveToApplicationsFolder()
        shell.openExternal(source + '/wiki/Incorrect-Installation-(macOS)')
    }
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
                    await shell.openExternal(source + '/wiki')
                }
            }]
        })

        return defaultMenu
    })
}
ipcMain.on('online-status-changed', (event, status) => {
    console.log(status)
})

function textColor() {
    //TODO: add custom user provided text color via electron-settings
    var a = "rgb( " + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")"
    console.log(a)
    return a
}