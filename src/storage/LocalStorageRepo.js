import Repository from "./Repository";

export default class LocalStorageRepo extends Repository {
    constructor(storageKey = "todolist") {
        super();
        this.storageKey = storageKey;
    }

    getAll(objToDo) {
        objToDo.taskStorage = JSON.parse(localStorage.getItem(this.storageKey));
    }

    addAll(objToDo) {
        localStorage.setItem(this.storageKey, JSON.stringify(objToDo.taskStorage));
    }
}