import TaskRenderer from "./TaskRenderer";
import ToDoList from "../core/ToDoList";
import LocalStorageRepo from "../storage/LocalStorageRepo";
import ProjectsList from "../core/ProjectsList";
import FormHandler from "./FormHandler";
import EventManager from "./EventManager";

export default class Application {
    constructor() {
        this.render = new TaskRenderer(this);
        this.todo = new ToDoList();
        this.projects = new ProjectsList();
        this.storage = new LocalStorageRepo(this.todo, this.projects);
        this.taskContainer = document.getElementById("task-container");
        this.formHandler = new FormHandler(this);
        this.eventManager = new EventManager(this);
        this.currentTaskId = undefined;
    }

    handleToggleTask(taskId) {
        this.todo.changeTaskStatus(taskId);
        this.storage.saveTasks();
    }

    renderAllTasks(filter = null) {
        this.storage.loadTasks();
        let taskArray;
        if (filter === null) {
            taskArray = this.todo.taskStorage;
        } else {
            taskArray = filter;
        }
        this.taskContainer.innerHTML = "";
        if (taskArray.length === 0) return;

        taskArray.forEach((task) => {
            const taskCard = this.render.renderTask(
                task,
                this.handleToggleTask.bind(this),
                this.eventManager.expandTaskEvent,
                this.projects,
            );
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
        this.eventManager.filterEvents();
        this.eventManager.projectFilterEvents();
        this.eventManager.priorityFilter();
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

    updateTask(currentTaskId, taskData) {
        this.todo.updateTask(currentTaskId, taskData);
        this.storage.saveTasks();
        this.renderAllTasks();
    }
}
