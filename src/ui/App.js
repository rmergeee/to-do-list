import ToDoList from "../core/ToDoList";
import LocalStorageRepo from "../storage/LocalStorageRepo"

export default class App {

    constructor() {
        this.todo = new ToDoList();
        this.storage = new LocalStorageRepo();
    }

    updatePage() {
        this.storage.getAll(this.todo);
        for (let tsk of this.todo.taskStorage) {
            const taskOnPage = document.createElement("article");
            const h2 = document.createElement("h2");
            h2.textContent = tsk.title;
            taskOnPage.append(
                h2
            )
            document.querySelector(".content").append(taskOnPage);
        }

    }

    init() {
        this.updatePage();
    }
}