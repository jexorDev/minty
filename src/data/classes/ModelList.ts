import BaseModel from "./BaseModel";

export default class ModelList<BaseModel, T> {
    #existingModels: BaseModel[] = [];
    #deletedModels: BaseModel[] = [];
    #addedModels: AddedModel<T>[] = [];
    #addedTempIdSequence: number = 0;
    
    constructor(existingModels?: BaseModel[]) {
        if (existingModels) {
            for (var existingModel of existingModels) {
                this.#existingModels.push(existingModel);
            }
            this.#existingModels = existingModels;
        }
    }

    get currentModels() {
        return [...this.#addedModels, this.#existingModels];
    }

    public add(instance: T) {
        this.#addedTempIdSequence++;
        this.#addedModels.push(new AddedModel<T>(instance, this.#addedTempIdSequence));
    }

    public deleteModel(model: BaseModel | AddedModel<T>) {
        // if (model.isNew) {
        //     this.#addedModels = this.#addedModels.filter(x => x.tempId !== (model as AddedModel<T>).tempId);
        // } else {
        //     this.#deletedModels.push(model);
        //     this.#existingModels = this.#existingModels.filter(x => x.pk !== model.pk);
        // }
    }


}

class AddedModel<T> extends BaseModel<T> {
    tempId: number;

    get pk() {
        return this.tempId;
    }

    constructor(instance: T, tempId: number) {
        super(instance);
        this.tempId = tempId;
    }
}