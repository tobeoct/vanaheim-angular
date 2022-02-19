
import Bootstrap from './bootstrap';

const bootstrap = new Bootstrap();
bootstrap.run((port:any) => console.log(`Server started and running on port ${port}.`));

process.on('uncaughtException', (error)  => {
    console.log('Alert! ERROR : ',  error);
    console.log(error?.stack);
  //  process.exit(1); // Exit your app 
 })


 process.on('unhandledRejection', (error:any, promise)  => {
    console.log('Alert! ERROR : ',  error);
    console.log(error?.stack);
  //  process.exit(1); // Exit your app 
 })