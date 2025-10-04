import ToDoList from "../core/ToDoList";
import LocalStorageRepo from "../storage/LocalStorageRepo";

export default class App {
  constructor() {
    this.todo = new ToDoList();
    this.storage = new LocalStorageRepo(this.todo);
  }

  uploadTaskToPage() {
    const self = this;

    this.todo.taskStorage.forEach((tsk) => {
      if (tsk.status === true) {
        let taskOnPage = document.createElement("article");
        taskOnPage.innerHTML = `<input type="checkbox" name="taskStatus" id="${tsk.id}">
         <div class="taskTextContent">
           <h3 class="taskHeader">${tsk.title}</h3>
           <p class="taskDesc">${tsk.description}</p>
         </div>`;
        taskOnPage.className = "task";
        document.getElementById("task-container").append(taskOnPage);
        document.getElementById(tsk.id).addEventListener("change", function () {
          if (this.checked) {
            tsk.status = false;
            console.log("Checkbox is checked!");
          } else {
            tsk.status = true;
            console.log("Checkbox is unchecked!");
          }
          if (tsk.status === false) {
            document.getElementById(tsk.id).parentElement.remove();
          }
          self.storage.setTaskById(tsk.id, tsk);
        });
      }
    });
  }

  init() {
    this.storage.getAllTasksToVirtualStorage();
    this.uploadTaskToPage();
  }
}
