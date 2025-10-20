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
        localStorage.setItem(
            "allTasks",
            JSON.stringify(this.objToDo.taskStorage),
        );
    }

    getTaskById() {
        return this.objToDo.taskStorage.find((t) => {
            t.id === id;
        });
    }

    setTaskById(id, tsk) {
        const taskIndex = this.objToDo.taskStorage.findIndex((t) => {
            t.id === id;
        });
        this.objToDo.taskStorage[taskIndex] = tsk;
    }

    loadProject() {
        if (JSON.parse(localStorage.getItem("allProject")) === null) return;
        this.projects.projectStorage = JSON.parse(
            localStorage.getItem("allProject"),
        );
    }

    saveProject() {
        localStorage.setItem(
            "allProject",
            JSON.stringify(this.projects.projectStorage),
        );
    }
}
