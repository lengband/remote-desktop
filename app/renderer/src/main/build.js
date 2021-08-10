const fs = require('fs-extra');

const dest = '../../pages/main'

console.log(fs.removeSync, 'fs.removeSyncfs.removeSyncfs.removeSync');
console.log(fs.moveSync, 'fs.moveSync.moveSync.moveSync');

fs.removeSync(dest)
fs.moveSync('./build', '../../pages/main')
