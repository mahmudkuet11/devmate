const { ipcMain } = require('electron');
const sudo = require('sudo-js');

let Command = {
    init: function(){
        this._listenForCommand();
        this._listenForSettingPassword();
    },
    _listenForCommand: function(){
        ipcMain.on('command.run', (event, arg) => {

            sudo.exec(arg.command.split(" "), {check: false, withResult: true}, (error, pid, result) => {
                if(error){
                    event.reply(arg.channel, {error: new Error()});
                }else{
                    event.reply(arg.channel, {output: result});
                }
            });
        });

        ipcMain.on('command_raw.run', (event, arg) => {

            sudo.exec(arg.command, {check: false, withResult: true}, (error, pid, result) => {
                console.log(error, result);
                if(error){
                    event.reply(arg.channel, {error: new Error()});
                }else{
                    event.reply(arg.channel, {output: result});
                }
            });
        });
    },
    _listenForSettingPassword: function(){
        ipcMain.on('command.set_password', (event, arg) => {
            sudo.setPassword(arg.password);

            sudo.check(valid => {
                event.reply(arg.channel, {valid});
            });
        });
    }
};

module.exports = Command;