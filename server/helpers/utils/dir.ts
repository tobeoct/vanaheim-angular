const path = require('path');
const fs = require('fs-extra');
const mkdirsSync = (dirname:any) => {
  if(fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
  return;
}
// module.exports = {
//   mkdirsSync
// };
export default mkdirsSync;