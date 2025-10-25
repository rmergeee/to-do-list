export default class EventManager {
    constructor(app) {
        this.app = app;
    }

    taskModalEvent() {
        const createTaskButton = document.getElementById("createTaskButton");
        const closeModalTaskButton = document.getElementById("closeModalTaskButton");
        const taskModal = document.querySelector(".taskModal");
        const taskForm = document.getElementById("taskForm");

        createTaskButton.addEventListener("click", () => {
            taskModal.showModal();
        });

        closeModalTaskButton.addEventListener("click", () => {
            taskForm.reset();
            taskModal.close();
        });

        taskForm.addEventListener("submit", (e) => {
            this.app.formHandler.handleTaskSubmit(e, taskForm, taskModal);
        });
    }

    projectModalEvent() {
        const createProjectButton = document.getElementById("createProjectButton");
        const closeModalProjectButton = document.getElementById("closeModalProjectButton");
        const projectModal = document.querySelector(".projectModal");
        const projectForm = document.getElementById("projectForm");

        createProjectButton.addEventListener("click", () => {
            projectModal.showModal();
        });

        closeModalProjectButton.addEventListener("click", () => {
            projectForm.reset();
            projectModal.close();
        });

        projectForm.addEventListener("submit", (e) => {
            this.app.formHandler.handleProjectSubmit(e, projectForm, projectModal);
        });
    }
}
