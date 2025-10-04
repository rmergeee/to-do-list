import Repository from "./Repository";

export default class LocalStorageRepo extends Repository {
  constructor(objToDo) {
    super();
    this.objToDo = objToDo;
  }

  getAllTasksToVirtualStorage() {
    this.objToDo.taskStorage = []; // очистимо перед завантаженням

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const item = localStorage.getItem(key);
      try {
        this.objToDo.taskStorage.push(JSON.parse(item));
      } catch (e) {
        console.error(`Помилка при парсингу ключа ${key}:`, e);
      }
    }
  }

  addAllTask() {
    this.objToDo.taskStorage.forEach((task) => {
      localStorage.setItem(task.id, JSON.stringify(task));
    });
  }

  getTaskById(id) {
    return JSON.parse(localStorage.getItem(id));
  }

  deleteTaskById() {
    throw new Error("Not implemented");
  }
  setTaskById(id, task) {
    localStorage.setItem(id, JSON.stringify(task));
  }
}
