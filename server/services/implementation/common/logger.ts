// import bunyan, { RotatingFileStream } from "bunyan";
import * as bunyan from "bunyan";
import { RotatingFileStream } from "bunyan";
import { existsSync, mkdirSync } from "fs";
const root =`\\logs`;
const logPath = `${root}\\vanaheim-log`;
if(!existsSync(root)){
   mkdirSync(root,{recursive:true})
}

export const Logger = bunyan.createLogger({
   name: "vanaheim", 
   streams: [{
      stream: new RotatingFileStream({
         path:logPath,
         period:"1d",
         count:10
      })
  }]
});
