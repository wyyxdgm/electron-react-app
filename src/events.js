
const { ipcMain, app } = require('electron');
const Store = require('electron-store');
const { isNumber, isEqual, pick, extend } = require('lodash');
console = require('electron-log');
const moment = require('moment');
var mainWindow;
const store = new Store();
const V = require('./v');
const DEFAULT_DATA = require('./data.json');
const INIT_VALUE = 1;
if (store.get('inited') != INIT_VALUE) { // 首次初始化store
  console.log('首次开启，初始化数据到：', app.getPath('userData') + '/config.json');
  store.set('inited', INIT_VALUE);
  for (var key in DEFAULT_DATA) {
    store.set(key, DEFAULT_DATA[key]);
  }
}
const data = {
  'config': store.get('config') || {},
}
const FMT = { DATE: 'YYYY/MM/DD', TIME: 'HH:mm:ss' };
const saveStore = (arg) => {
  const { type, k, v } = arg;
  if (!data[type]) data[type] = {};
  Object.assign(data[type], { [k]: v });
  let storeKey = `${type}.${k}`;
  console.log('saved', storeKey, v);
  store.set(storeKey, v);
}

// 定时更新
// var clockInterval;
// if (clockInterval) clearInterval(clockInterval);
// clockInterval = setInterval(() => {
//   // console.log('定时更新');
// }, 100)

ipcMain.on('save', (event, arg) => {
  console.log('arg', arg);
  saveStore(arg);
  if (arg.type === V.SAVE_TYPE.SET_CONFIG) {
    if (mainWindow) {
      // mainWindow.webContents.send('update', {[arg.k]: arg.v});
      event.reply('saved', 'success')
    } else {
      event.reply('saved', 'fail:mainWindow closed')
      console.log('mainWindow update fail: 当前不可见', arg);
    }
  }
})

ipcMain.on('fetch', (event, arg) => {
  console.log('arg', arg);
  if (mainWindow && mainWindow.webContents) {
    // mainWindow.webContents.send('update', data);
    event.reply('update', data);
  }
})


ipcMain.on('action', (event, arg) => {
  console.log('arg', arg);
  if (arg.type === V.ACTION_TYPE.EXEC) {
    require('child_process').exec(arg.command, { cwd: null }, (err, res) => {
      console.log(res)
      if (mainWindow) {
        // mainWindow.webContents.send('update', {[arg.k]: arg.v});
        event.reply('update', { 'config.output': res })
      } else {
        console.log('mainWindow action fail: 当前不可见', arg);
      }
    });
  }
})

module.exports = function(opt) {
  if (opt.mainWindow) {
    // mainWindow
    mainWindow = opt.mainWindow;
    mainWindow.on('closed', () => { mainWindow = null; console.log('mainWindow closed') });
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.isLoaded = true;
      console.log('mainWindow.webContents.did-finish-load')
      // setTimeout(() => {
      //   mainWindow.webContents.send('update', data);
      // }, 100);
    });
  }
  // console.log(mainWindow)
} 