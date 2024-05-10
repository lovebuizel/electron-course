const { app, BrowserWindow, Menu, ipcMain } = require("electron")
const path = require("path")

let mainWindow
let addWindow

app.on("ready", () => {
  console.log("ready")
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  })
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  // 防止子視窗還存活
  mainWindow.on("closed", () => app.quit())

  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu)
})

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "Add New Todo",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  })
  addWindow.loadURL(`file://${__dirname}/add.html`)
  addWindow.on("closed", () => (addWindow = null))
}

ipcMain.on("todo:add", (event, todo) => {
  mainWindow.webContents.send("todo:add", todo)
  addWindow.close()
})

const menuTemplate = [
  {
    label: "File",
    submenu: [
      { label: "New Todo", click: createAddWindow },
      {
        label: "Clear Todos",
        click: () => {
          mainWindow.webContents.send("todo:clear")
        },
      },
      {
        label: "Quit",
        accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
        click: () => app.quit(),
      },
    ],
  },
]

if (process.platform === "darwin") {
  menuTemplate.unshift({ label: "" })
}

if (process.env.NODE_ENV !== "production") {
  menuTemplate.push({
    label: "View",
    submenu: [
      { role: "reload" },
      {
        label: "Toggle Developer Tools",
        accelerator:
          process.platform === "darwin" ? "Command+Alt+I" : "Ctrl+Shift+I",
        click: (item, focusedWindow) => {
          focusedWindow.toggleDevTools()
        },
      },
    ],
  })
}
