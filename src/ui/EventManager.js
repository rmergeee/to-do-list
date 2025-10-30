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

    filterEvents() {
        const todoFilter = document.querySelector("#todoTasks");
        const completedFiler = document.querySelector("#completedTasks");
        const withoutFilter = document.querySelector("#allTasks");

        todoFilter.addEventListener("click", (e) => {
            e.preventDefault();
            this.app.render.renderCurrentFilter("To do", "todoTasks");
            this.app.renderAllTasks(this.app.todo.getTasksByStatus(false));
        });
        completedFiler.addEventListener("click", (e) => {
            e.preventDefault();
            this.app.render.renderCurrentFilter("Completed tasks", "completedTasks");
            this.app.renderAllTasks(this.app.todo.getTasksByStatus(true));
        });
        withoutFilter.addEventListener("click", (e) => {
            e.preventDefault();
            this.app.render.renderCurrentFilter("All tasks", "allTask");
            this.app.renderAllTasks();
        });
    }

    projectFilterEvents() {
        const projectContainer = document.querySelector("#projectList");
        const projects = projectContainer.querySelectorAll("li");
        projects.forEach((project) => {
            project.addEventListener("click", (e) => {
                e.preventDefault();
                this.app.render.renderCurrentFilter(project.textContent, project.id);
                this.app.renderAllTasks(this.app.todo.getTasksByProject(project.id));
            });
        });
    }

    priorityFilter() {
        const currentProject = document.querySelector(".currentProject");
        const priorityButtons = document.querySelectorAll(".priority");

        priorityButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const priority = button.id;
                let filteredTasks = [];

                switch (currentProject.id) {
                    case "allTask":
                        filteredTasks = this.app.todo.getTasksByPriority(priority);
                        break;

                    case "todoTasks":
                        filteredTasks = this.app.todo.getTasksByPriority(
                            priority,
                            this.app.todo.getTasksByStatus(false),
                        );
                        break;

                    case "completedTasks":
                        filteredTasks = this.app.todo.getTasksByPriority(
                            priority,
                            this.app.todo.getTasksByStatus(true),
                        );
                        break;

                    default:
                        const projectTasks = this.app.todo.getTasksByProject(currentProject.id);
                        filteredTasks = this.app.todo.getTasksByPriority(priority, projectTasks);
                        break;
                }

                this.app.renderAllTasks(filteredTasks);

                let baseTitle = currentProject.textContent.replace(/\s*\(.*priority\)/, "");
                this.app.render.renderCurrentFilter(
                    `${baseTitle} (${priority} priority)`,
                    currentProject.id,
                );
            });
        });
    }

    expandTaskEvent(task) {
        const taskDescModal = document.querySelector(".taskDescModal");
        const editTaskButton = document.getElementById("editTaskButton");
        const closeTaskDescButton = document.getElementById("closeTaskDescButton");

        const closeModalTaskButton = document.getElementById("closeModalTaskButton");
        const taskModal = document.querySelector(".taskModal");
        const taskForm = document.getElementById("taskForm");

        const formTitle = document.querySelector('input[name="taskName"]');
        const formDesc = document.querySelector('textarea[name="taskDesc"]');
        const formDate = document.querySelector('input[name="date"]');
        const formPriority = document.querySelector('select[name="taskPriority"]');
        const formProject = document.querySelector('select[name="taskProject"]');

        formTitle.value = task.title;
        formDesc.value = task.description;
        formDate.value = task.deadline;
        formPriority.value = task.priority;
        formProject.value = task.project;

        taskDescModal.showModal();
        closeTaskDescButton.addEventListener("click", () => {
            taskDescModal.close();
        });

        editTaskButton.addEventListener("click", () => {
            taskDescModal.close();
            taskModal.showModal();
        });
    }
}
