import ToDoList from "../core/ToDoList";
import LocalStorageRepo from "../storage/LocalStorageRepo";

export default class App {
  constructor() {
    this.todo = new ToDoList();
    this.storage = new LocalStorageRepo(this.todo);
  }

  addEvent() {
    const createBtn = document.getElementById("createBtn");
    const modal = document.querySelector("dialog");
    const closeModalWindow = document.getElementById("closeModal");
    const createForm = document.querySelector("form");
    const completedTasks = document.getElementById("completedTasks");
    const todoTasks = document.getElementById("todoTasks");

    createForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let valid = true;
      const formData = new FormData(createForm);

      const fields = createForm.querySelectorAll("input, textarea, select");
      fields.forEach((field) => {
        if (!field.value) {
          field.classList.add("invalid");
          valid = false;
        } else {
          field.classList.remove("invalid");
        }
      });

      if (valid) {
        console.log("Форма валідна, можна сабмітити через JS");
        this.todo.addTask(
          formData.get("taskName"),
          formData.get("taskDesc"),
          formData.get("date"),
          formData.get("taskProject"),
        );
        this.storage.addAllTask();
        this.uploadTaskToPage(true);
        createForm.reset();
        closeModalWindow.click();
        console.table(this.todo.taskStorage);
      }
    });

    createBtn.addEventListener("click", () => {
      modal.showModal();
    });

    closeModalWindow.addEventListener("click", () => {
      modal.close();
    });

    completedTasks.addEventListener("click", (e) => {
      e.preventDefault();
      this.uploadTaskToPage(false);
    });

    todoTasks.addEventListener("click", (e) => {
      e.preventDefault();
      this.uploadTaskToPage(true);
    });
  }

  uploadTaskToPage(status) {
    document.getElementById("task-container").innerHTML = "";

    const self = this;
    this.storage.getAllTasksToVirtualStorage();

    this.todo.taskStorage.forEach((tsk) => {
      if (tsk.status === status) {
        let taskOnPage = document.createElement("article");
        taskOnPage.innerHTML = `<input type="checkbox" name="taskStatus" id="${tsk.id}" ${tsk.status === false ? "checked" : ""}/>
        <label>
            <h3 class="taskHeader">${tsk.title}</h3>
        </label>
        <div class="taskTextContent">
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
    this.uploadTaskToPage(true);
    this.addEvent();
  }
}
