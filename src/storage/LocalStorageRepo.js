import Repository from "./Repository";

export default class LocalStorageRepo extends Repository {
  constructor(objToDo, storageKey = "todolist") {
    super();
    this.objToDo = objToDo;
    this.storageKey = storageKey;
  }

  getAll() {
    this.objToDo.taskStorage = JSON.parse(
      localStorage.getItem(this.storageKey),
    );
  }

  addAll() {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.objToDo.taskStorage),
    );
  }
}
