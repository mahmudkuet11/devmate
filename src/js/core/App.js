const {app} = require('electron');
let Browser = require('./Browser');
let Path = require('./Path');
let Command = require('../providers/Command');

let App = {
    init: function(){
        app.on('ready', this.ready.bind(this));
    },
    ready: function(){
        (new Browser(Path.base_path('src/index.html'))).init();

        Command.init();
    }
};

module.exports = App;
