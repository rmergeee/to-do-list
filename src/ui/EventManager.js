export default class EventManager {
    constructor(app) {
        this.app = app;
    }

    taskModalEvent() {
        const createTaskButton = document.getElementById("createTaskButton");
        const taskModal = document.querySelector(".taskModal");
        const taskForm = document.getElementById("taskForm");

        createTaskButton.addEventListener("click", () => {
            taskModal.showModal();
        });

        taskForm.addEventListener("submit", (e) => {
            this.app.formHandler.handleTaskSubmit(e, taskForm, taskModal);
        });
    }
}
