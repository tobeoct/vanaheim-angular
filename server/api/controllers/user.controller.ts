
import UtilService  from '@services/implementation/common/util';
import { IUserService } from '@services/interfaces/Iuser-service';
import { GET, POST, route,before } from 'awilix-express'; 
const expAutoSan = require('express-autosanitizer');
@route('/api/users')
export default class UserController {

   bvnList:any={
  };
   bankList:any={};
    constructor(private _utilService:UtilService, private _userService:IUserService) {

    }
    @route('/:id')
    @before([expAutoSan.route])
    @GET()
    getById =async (req:any, res:any) => {
  
        }

    @route('/')
    @before([expAutoSan.route])
    @GET()
    getAll = async (req:any, res:any,next:any) => {
          console.log("Users Controller", req.session)
          res.statusCode = 200;
          res.data = {
            status: true,
            response: "Gotten"
          }
      
          next()
      
        }

    @route('/create')
    @before([expAutoSan.route])
    @GET()
    new =async (req:any, res:any) => {

        }
}