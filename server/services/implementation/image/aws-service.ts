const fs = require('fs');
const AWS = require('aws-sdk');
const customBackoff = (retryCount:any) => {
    console.log(`retry count: ${retryCount}, waiting: 1000ms`)
    return 1000
  }
const s3 = new AWS.S3({
  accessKeyId: 'AKIAS3L5FNEBI6DNNCWV',//process.env.AWS_ACCESS_KEY,
  secretAccessKey: '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',//process.env.AWS_SECRET_ACCESS_KEY
  region: 'us-east-2',
  signatureVersion: 'v4',
  maxRetries: 2,
  retryDelayOptions: { customBackoff },
  httpOptions: {
    connectTimeout: 2 * 1000, // time succeed in starting the call
    timeout: 5*60 * 1000, // time to wait for a response
    // the aws-sdk defaults to automatically retrying
    // if one of these limits are met.
  },
});
export class AWSService {
   
    constructor() {
        // this.test("server/uploads/CUST_10362021023642/a27cc300709fc621a61523c04ac65f06.png","a27cc300709fc621a61523c04ac65f06.png")
    }

    upload = (path: string,fileName:string,customerID:string) => new Promise<any>((resolve, reject) => {
        fs.readFile(path, (err:any, data:any) => {
            console.log(path,err,data,new Date())
            if (err) throw err;
            const params = {
                Bucket: 'vanaheimbucket', // pass your bucket name
                Key: `${customerID}/${fileName}`, // file will be saved as bucketname/filename
                Body: JSON.stringify(data, null, 2)
            };
            console.log("Uploading to aws",fileName);
            s3.upload(params, function(s3Err:any, data:any) {
                console.log("Uploaded",s3Err,data)
                if (s3Err) {
                    reject(s3Err)
                    return;
                }
                if(!data){
                    reject("File failed to upload")
                    return;
                }
                console.log(`File uploaded successfully at ${data?.Location}, ${new Date()}`)
                resolve(data?.Location)
            });
         });
    })

    test = (path: string, fileName:string) => {
        fs.readFile(path, (err:any, data:any) => {
            console.log(path,err,data,new Date())
            if (err) throw err;
            const params = {
                Bucket: 'vanaheimbucket', // pass your bucket name
                Key: fileName, // file will be saved as bucketname/filename
                Body: JSON.stringify(data, null, 2)
            };
            console.log("Uploading to aws");
            s3.upload(params, function(s3Err:any, data:any) {
                console.log("Uploaded ",s3Err,data)
                if (s3Err) throw s3Err
                console.log(`File uploaded successfully at ${data} ${new Date()}`)
            });
         });
    }
}