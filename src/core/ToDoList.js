import Task from "./Task";

export default class ToDoList {
  constructor() {
    this.taskStorage = [
      // new Task(
      //   "This is example",
      //   "This task is example. Please complete me.",
      //   "04.10.2025",
      // ),
    ];
  }

  addTask(title, description, deadline, project) {
    this.taskStorage.push(new Task(title, description, deadline, project));
  }

  changeStatus(id) {
    const task = this.taskStorage.find((item) => item.id === id);
    task.status = task.status ? false : true;
  }
}
