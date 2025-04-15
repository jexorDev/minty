import type BaseService from "../services/BaseService";

export default abstract class BaseModel<T> {
    model: T;
    isNew: boolean = false;

    constructor(instance?: T) {
        if (instance) {
            this.model = JSON.parse(JSON.stringify(instance));
            this.isNew = false;
        } else {
            this.model = {} as T;
            this.isNew = true;
        }
    }

    public save(service: BaseService<T>): void {
        if (this.isNew) {
            service.post(this.model);
        } else {
            service.put(this.model);
        }
    }
}