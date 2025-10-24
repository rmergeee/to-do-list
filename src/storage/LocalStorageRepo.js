import Repository from "./Repository";

export default class LocalStorageRepo extends Repository {
    constructor(objToDo, projects) {
        super();
        this.projects = projects;
        this.objToDo = objToDo;
    }

    loadTasks() {
        if (JSON.parse(localStorage.getItem("allTasks")) === null) return;
        this.objToDo.taskStorage = JSON.parse(localStorage.getItem("allTasks"));
    }

    saveTasks() {
        localStorage.setItem("allTasks", JSON.stringify(this.objToDo.taskStorage));
    }

    loadProject() {
        if (JSON.parse(localStorage.getItem("allProject")) === null) return;
        this.projects.projectStorage = JSON.parse(localStorage.getItem("allProject"));
    }

    saveProject() {
        localStorage.setItem("allProject", JSON.stringify(this.projects.projectStorage));
    }
}
