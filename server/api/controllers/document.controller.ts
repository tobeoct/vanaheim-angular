
// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json({limit: '100mb'})
// const expAutoSan = require('express-autosanitizer');
// const path = require('path');
// let timeout = require('connect-timeout')
// const fs = require('fs');
// const multer = require('multer');
// const fsExtra = require('fs-extra');
// const { mkdirsSync } = require('@utils/dir');
// const uploadPath = path.join("../../../", 'uploads');
// const uploadTempPath = path.join(uploadPath, 'temp');
// const upload = multer({ dest: uploadTempPath });
// let FileAPI = require('file-api')
// , File = FileAPI.File
// , FileList = FileAPI.FileList
// , FileReader = FileAPI.FileReader,reader = new FileReader();
// const filesRouter = require('express').Router();

// // you must specify a temp upload dir and a max filesize for the chunks
// const tmpDir = './public/assets/files';
// const maxFileSize = 10;
// const maxChunkSize =10;
// const MAXFILEUPLOADSIZE =2;


// filesRouter.get('/', async (req, res) => {
//   console.log("Getting Files");
//   res.send("Hello Files")
// })
// filesRouter.post('/upload', [upload.single('file'), expAutoSan.route], async (req, res) => {
//     console.log('file upload...')
//   // console.log(req.body)
//     const body = JSON.parse(JSON.stringify(req.body))
    
//     console.log('Gotten body')
//     // console.log(body)
//     // Create a folder based on the file hash and move the default uploaded file under the current hash folder. Facilitate subsequent file merging.
//     const {
//       name,
//       total,
//       index,
//       size,
//       hash
//     } = body;
//   let fileSize = size/1024/1024;
//   console.log(name)
//   console.log(hash)
//   console.log(fileSize);
//   if(fileSize<=MAXFILEUPLOADSIZE){
//     const chunksPath = path.join(uploadPath, hash, '/');
//     console.log(chunksPath);
//     if(!fsExtra.existsSync(chunksPath)) mkdirsSync(chunksPath);
//     fsExtra.renameSync(req.file.path, chunksPath + hash + '-' + index);
//     res.status(200);
//     res.send(name);
//     console.log("Done");
//   }else{
//     console.log("Failed - File chunk too large")
//     res.status(400);
//     res.send('Failed - File size too large');
//     console.log("Done");
//   }
//   });
  
//   filesRouter.post('/merge_chunks',[jsonParser],async (req, res) => {
//     console.log("File merge...");
//     const body = JSON.parse(JSON.stringify(req.body));
//     const {
//       size, name, total, hash
//     } = body;
//     console.log(name)
//   console.log(hash)
//     try{
//   let fileSize = size/1024/1024;
//   console.log(fileSize);
//   if(fileSize<=MAXFILEUPLOADSIZE){
//     // According to the hash value, get the fragmented file.
//     // Create a storage file
//     // Merger
//     const chunksPath = path.join(uploadPath, hash, '/');
//     const filePath = path.join(uploadPath, name);
//     console.log(chunksPath);
//     // Read all chunks file names and store them in an array
//     const chunks = fsExtra.readdirSync(chunksPath);
//     // Create a storage file
//     fsExtra.writeFileSync(filePath, ''); 
//     if(chunks.length !== total || chunks.length === 0) {
//       res.status = 200;
//       res.send ('the number of sliced files does not match');
//       console.log("the number of sliced files does not match")
//       return;
//     }
//     for (let i = 0; i < total; i++) {
//       // Additional Write to File
//       fsExtra.appendFileSync(filePath, fsExtra.readFileSync(chunksPath + hash + '-' +i));
//       // Delete the chunk used this time
//       fsExtra.unlinkSync(chunksPath + hash + '-' +i);
//     }
//     fsExtra.rmdirSync(chunksPath);
//     // Successful file merging allows file information to be stored.
//     res.status(200);
//     res.send ('Merged successfully');
//   }
//   else{
//     console.log("Failed - File chunk too large");
//     res.status(400);
//     res.send('Failed - File chunk too large');
//     console.log("Done");
//   }
//     }catch(ex){
//       console.log(ex);
//       res.status(400);
//     res.send('Failed');
//     }
//   });
  
// module.exports = filesRouter;