import TaskRenderer from "./TaskRenderer";
import ToDoList from "../core/ToDoList";
import LocalStorageRepo from "../storage/LocalStorageRepo";
import ProjectsList from "../core/ProjectsList";
import FormHandler from "./FormHandler";
import EventManager from "./EventManager";

export default class Application {
    constructor() {
        this.render = new TaskRenderer();
        this.todo = new ToDoList();
        this.projects = new ProjectsList();
        this.storage = new LocalStorageRepo(this.todo, this.projects);
        this.taskContainer = document.getElementById("task-container");
        this.formHandler = new FormHandler(this);
        this.eventManager = new EventManager(this);
    }

    handleToggleTask(taskId) {
        this.todo.changeTaskStatus(taskId);
        this.storage.saveTasks();
    }

    renderAllTasks() {
        this.storage.loadTasks();
        const taskArray = this.todo.taskStorage;

        if (taskArray.length === 0) return;
        this.taskContainer.innerHTML = "";

        taskArray.forEach((task) => {
            const taskCard = this.render.renderTask(task, this.handleToggleTask.bind(this));
            this.taskContainer.append(taskCard);
        });
    }

    renderAllProject() {
        this.storage.loadProject();
        const projectArray = this.projects.projectStorage;

        if (projectArray.length === 0) return;
        document.getElementById("projectList").innerHTML = "";
        document.getElementById("projectSelect").innerHTML =
            `<option selected value="null">Select project...</option>`;

        projectArray.forEach((project) => {
            const projectFilter = this.render.renderProject(project).projectFilter;
            const projectOption = this.render.renderProject(project).projectOption;

            document.getElementById("projectSelect").append(projectOption);
            document.getElementById("projectList").append(projectFilter);
        });
    }

    addEvent() {
        this.eventManager.taskModalEvent();
        this.eventManager.projectModalEvent();
    }

    createTask(taskData) {
        this.todo.addTask(
            taskData.title,
            taskData.description,
            taskData.deadline,
            taskData.priority,
            taskData.project,
        );
        this.storage.saveTasks();
        this.renderAllTasks();
    }

    createProject(projectName) {
        this.projects.addProject(projectName);
        this.storage.saveProject();
        this.renderAllProject();
    }
}
