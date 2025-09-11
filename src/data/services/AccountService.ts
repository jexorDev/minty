import type Account from "../interfaces/Account";
import BaseService from "./BaseService";

export default class AccountService extends BaseService<Account> {
    constructor() {
        super("accounts");
    }
}