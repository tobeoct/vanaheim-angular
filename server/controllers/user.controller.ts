
import { VanaheimBodyRequest } from '@models/express/request';
import { VanaheimTypedResponse } from '@models/express/response';
import { IUserService } from '@services/interfaces/Iuser-service';
import { GET, route } from 'awilix-express';
@route('/api/users')
export default class UserController {

    constructor(private _userService: IUserService) {

    }
    @route('/:id')
    @GET()
    getById = async (req: any, res: any) => {

    }

    @route('/')
    @GET()
    getAll = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
        console.log("Users Controller", req.session)
        let users = await this._userService.getAll();
        res.statusCode = 200;
        res.payload = {data:users};
       
        next()

    }

    @route('/create')
    @GET()
    new = async (req: any, res: any) => {

    }
}