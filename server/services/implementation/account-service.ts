
import { BaseService } from "./base-service";
import { AccountInfo, IAccountService } from "@services/interfaces/Iaccount-service";
import { IAccountRepository } from "@repository/interface/Iaccount-repository";
import { Account } from "@entities/account";
import UtilService from "./common/util";

class AccountService extends BaseService<any> implements IAccountService {
    constructor(private _accountRepository: IAccountRepository, private _utils:UtilService) {
        super(_accountRepository)
    }
    createAccount=(customerID:number,accountInfo: AccountInfo) =>{
        return new Promise<Account>(async (resolve,reject)=>{
            let account:Account;
            let accountsInDb: Account[] = await this._accountRepository.getByCustomerID(customerID) as Account[];
            if (!accountInfo.id || accountInfo.id == 0) {
                let accountInDb = accountsInDb.find(c => c.bank == accountInfo.bank && c.number == accountInfo.accountNumber);
                if (!accountInDb) {
                    account = new Account();
                    account.bank = accountInfo.bank;
                    account.code = this._utils.autogenerate({ prefix: "ACC" });
                    account.createdAt = new Date();
                    account.customerID = customerID;
                    account.number = accountInfo.accountNumber;
                    account.name = accountInfo.accountName;
                    let accountInDb = await this._accountRepository.create(account);
                        account.id = accountInDb.id
                }
                else {

                    account = Object.assign(accountInDb, new Account());
                }
            } else {
                let a: any = await this._accountRepository.getById(accountInfo.id);
                if (!a || Object.keys(a).length == 0) throw "Invalid account";
                account = Object.assign(a.dataValues as Account, new Account());
            }

            resolve(account);
        })
    }
}

export default AccountService;