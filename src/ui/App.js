import ToDoList from "../core/ToDoList";
import LocalStorageRepo from "../storage/LocalStorageRepo"

export default class App {

    constructor() {
        this.todo = new ToDoList();
        this.storage = new LocalStorageRepo(this.todo);
    }

    addEvents() {
        const checkboxes = document.querySelectorAll("input[name=taskStatus]");
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener("change", () => {
                this.todo.changeStatus(checkbox.id);
                console.log(this.todo.taskStorage.find(item => item.id === checkbox.id))
            })

        });

    }

    updatePage() {
        this.storage.getAll();
        for (let tsk of this.todo.taskStorage) {
            if(tsk.status === false) return;
            const taskOnPage = document.createElement("article");
            taskOnPage.className = "task";
            taskOnPage.innerHTML = `<input type="checkbox" name="taskStatus" id="${tsk.id}">
                        <div class="taskTextContent">
                            <h3 class="taskHeader">${tsk.title}</h3>
                            <p class="taskDesc">${tsk.description}</p>
                        </div>`
            document.getElementById("task-container").append(taskOnPage);
        }

    }

    init() {
        this.storage.getAll();
        this.todo.addTask("Vety loooooooong titleeeeee!", "I love chiken and lava", "04.11.2025", "Void");
        this.storage.addAll();
        this.updatePage();
        this.addEvents();

    }
}