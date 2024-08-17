const electron = require("electron")
const path = require("path")
const TimerTray = require("./app/timer_tray")
const MainWindow = require("./app/main_window")

const { app, ipcMain } = electron

let mainWindow
let tray

app.on("ready", () => {
  mainWindow = new MainWindow(`file://${__dirname}/src/index.html`)
  if (process.platform === "darwin") {
    app.dock.hide()
  } else {
    mainWindow.setSkipTaskbar(true)
  }

  const iconName =
    process.platform === "win32" ? "windows-icon.png" : "iconTemplate.png"

  const iconPath = path.join(__dirname, `./src/assets/${iconName}`)

  // 避免被Garbage Collection
  tray = new TimerTray(iconPath, mainWindow)
})

ipcMain.on("update-timer", (event, timeLeft) => {
  // 只有mac os有用
  tray.setTitle(timeLeft)
})
