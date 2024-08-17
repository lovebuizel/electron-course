const electron = require("electron")
const { BrowserWindow } = electron

class MainWindow extends BrowserWindow {
  constructor(url) {
    super({
      height: 500,
      width: 300,
      frame: false,
      resizable: false,
      show: false,
      webPreferences: {
        // 即使在背景執行也不要節省資源導致執行變慢
        backgroundThrottling: false,
      },
    })

    this.loadURL(url)
    this.on("blur", this.onBlur.bind(this))
  }

  onBlur() {
    this.hide()
  }
}

module.exports = MainWindow
