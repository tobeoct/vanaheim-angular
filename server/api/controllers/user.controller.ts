
import { IUserService } from '@services/interfaces/Iuser-service';
import { GET, route } from 'awilix-express'; 
@route('/api/users')
export default class UserController {

   bvnList:any={
  };
   bankList:any={};
    constructor(private _userService:IUserService) {

    }
    @route('/:id')
    @GET()
    getById =async (req:any, res:any) => {
  
        }

    @route('/')
    @GET()
    getAll = async (req:any, res:any,next:any) => {
          console.log("Users Controller", req.session)
          let users =  await this._userService.getAll();
          res.statusCode = 200;
          res.data = users;
          // {
          //   status: true,
          //   response: users
          // }
      
          next()
      
        }

    @route('/create')
    @GET()
    new =async (req:any, res:any) => {

        }
}