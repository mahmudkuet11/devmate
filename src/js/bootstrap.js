let cmd = require('node-cmd');
let file = require('read-file');
let path = require('path');
let Mustache = require('mustache');
const { exec } = require('child_process');
let sudo = require('sudo-prompt');
const { ipcRenderer, remote } = require('electron');
let md5 = require('md5');
let util = require('util');
let fs = require('fs');
//let remote = require('remote');

function base_path(){
    return path.join(__dirname, '../');
}