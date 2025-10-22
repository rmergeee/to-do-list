import ToDoList from "../core/ToDoList";
import ProjectsList from "../core/ProjectsList";
import LocalStorageRepo from "../storage/LocalStorageRepo";

export default class App {
  constructor() {
    this.projects = new ProjectsList();
    this.todo = new ToDoList();
    this.storage = new LocalStorageRepo(this.todo, this.projects);
  }

  addEvent() {
    const createBtn = document.getElementById("createBtn");
    const modal = document.querySelector(".createTaskModal");
    const closeModalWindow = document.getElementById("closeModal");
    const createForm = document.querySelector("#tsk");
    const completedTasks = document.getElementById("completedTasks");
    const todoTasks = document.getElementById("todoTasks");
    const allTasks = document.getElementById("allTasks");
    const createProject = document.getElementById("createProject");
    const projectModal = document.querySelector(".createProjectModal");
    const closeModalProject = document.getElementById("closeModalProject");
    const projectForm = document.querySelector("#prj");

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
        this.todo.addTask(
          formData.get("taskName"),
          formData.get("taskDesc"),
          formData.get("date"),
          formData.get("taskProject"),
        );
        this.storage.saveTasks();
        this.renderTasks(true);
        createForm.reset();
        modal.close();
      }
    });

    createBtn.addEventListener("click", () => {
      modal.showModal();
    });

    closeModalWindow.addEventListener("click", () => {
      modal.close();
    });
    closeModalProject.addEventListener("click", () => {
      projectModal.close();
    });

    completedTasks.addEventListener("click", (e) => {
      e.preventDefault();
      this.renderTasks(false);
    });

    todoTasks.addEventListener("click", (e) => {
      e.preventDefault();
      this.renderTasks(true);
    });

    allTasks.addEventListener("click", (e) => {
      e.preventDefault();
      this.renderTasks(null);
    });

    createProject.addEventListener("click", () => {
      projectModal.showModal();
    });

    projectForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      const formData = new FormData(projectForm);
      const fields = projectForm.querySelectorAll("input");
      fields.forEach((field) => {
        if (!field.value) {
          field.classList.add("invalid");
          valid = false;
        } else {
          field.classList.remove("invalid");
        }
      });
      if (valid) {
        this.projects.addProject(formData.get("projectName"));
        this.storage.saveProject();
        this.renderProject();
        projectForm.reset();
        projectModal.close();
      }
    });
  }

  renderTasks(status) {
    document.getElementById("task-container").innerHTML = "";
    this.storage.loadTasks();

    this.todo.taskStorage.forEach((tsk) => {
      if (tsk.status === status || status === null) {
        this.createTaskOnPage(tsk);
      }
    });
  }

  renderProject() {
    document.getElementById("projectList").innerHTML = "";
    document.getElementById("projectSelect").innerHTML =
      `<option selected value="null">Select project...</option>`;

    this.storage.loadProject();

    this.projects.projectStorage.forEach((prj) => {
      let prjOnPage = document.createElement("li");
      prjOnPage.innerHTML = `<a href="#">${prj.name}</a>`;
      prjOnPage.id = prj.id;

      prjOnPage.addEventListener("click", (e) => {
        document.getElementById("task-container").innerHTML = "";
        e.preventDefault();
        console.log(prj.name);
        this.todo.taskStorage.forEach((tsk) => {
          if (tsk.project === prj.id) {
            this.createTaskOnPage(tsk);
          }
        });
      });
      document.getElementById("projectList").append(prjOnPage);

      let prjOption = document.createElement("option");
      prjOption.value = prj.id;
      prjOption.textContent = prj.name;

      document.getElementById("projectSelect").append(prjOption);
    });
  }

  createTaskOnPage(tsk) {
    const self = this;

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
        self.storage.saveTasks();
      } else {
        tsk.status = true;
        self.storage.saveTasks();
      }
      // if (tsk.status === false) {
      //     document
      //         .getElementById(tsk.id)
      //         .parentElement.remove();
      // }
      self.storage.setTaskById(tsk.id, tsk);
    });
  }

  init() {
    this.renderTasks(true);
    this.renderProject();
    this.addEvent();
  }
}
