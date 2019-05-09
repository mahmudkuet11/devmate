export default class Command{
    static run(command){
        let channel = md5('command_run' + (new Date()).getTime());
        return new Promise((resolve, reject) => {
            ipcRenderer.once(channel, (event, arg) => {
                if(arg.error){
                    reject(arg.error);
                    return;
                }

                resolve(arg.output);
            });

            ipcRenderer.send('command.run', {command, channel});
        });
    }

    static runRaw(command){
        let channel = md5('command_raw_run' + (new Date()).getTime());
        return new Promise((resolve, reject) => {
            ipcRenderer.once(channel, (event, arg) => {
                if(arg.error){
                    reject(arg.error);
                    return;
                }

                resolve(arg.output);
            });

            ipcRenderer.send('command_raw.run', {command, channel});
        });
    }

    static setPassword(password){
        let channel = md5('set_password' + (new Date()).getTime());
        return new Promise((resolve, reject) => {
            ipcRenderer.once(channel, (event, arg) => {
                if(arg.valid){
                    resolve();
                }else{
                    reject();
                }
            });

            ipcRenderer.send('command.set_password', {password, channel});
        });
    }
}