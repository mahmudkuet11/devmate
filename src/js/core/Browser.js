let Path = require('./Path');
const {BrowserWindow} = require('electron');
const url = require('url');

let Browser = function(path, width = 800, height = 400, open_dev_tools = true){
    this.path = path;
    this.width = width;
    this.height = height;
    this.open_dev_tools = open_dev_tools;
};

Browser.prototype.init = function(){
    let win = new BrowserWindow({
        width: this.width,
        height: this.height,
        webPreferences: {
            nodeIntegration: true
        }
    });

    this.window = win;

    if(this.open_dev_tools){
        win.webContents.openDevTools();
    }

    win.on('closed', () => {
        win = null;
    });

    this.loadUrl(Path.base_path('src/index.html'))
};

Browser.prototype.loadUrl = function(path){
    this.window.loadURL(url.format({
        pathname: path,
        protocol: 'file',
        slashes: true
    }));
};

module.exports = Browser;