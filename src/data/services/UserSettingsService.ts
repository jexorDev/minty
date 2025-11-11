import type UserSettings from "../interfaces/Users/UserSettings";
import BaseService from "./BaseService";

export default class UserSettingsService extends BaseService<UserSettings> {
    constructor() {
        super("user");
    }
}