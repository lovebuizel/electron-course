const { app, BrowserWindow, ipcMain } = require("electron")
const ffmpeg = require("fluent-ffmpeg")
const path = require("path")

let mainWindow

app.on("ready", () => {
  console.log("ready")
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  })
  // mainWindow.loadFile("./index.html")
  // mainWindow.loadURL(path.join(__dirname, "index.html"))
  // mainWindow.loadFile(path.join(__dirname, "index.html"))
  mainWindow.loadURL(`file://${__dirname}/index.html`)
})

ipcMain.on("video:submit", (event, path) => {
  ffmpeg.ffprobe(path, (err, metadata) => {
    mainWindow.webContents.send("video:metadata", metadata.format.duration)
  })
})
