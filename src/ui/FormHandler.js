export default class FormHandler {
    constructor(app) {
        this.app = app;
    }

    validateForm(form) {
        let valid = true;
        const fields = form.querySelectorAll("input, textarea, select");
        fields.forEach((field) => {
            if (!field.value) {
                field.classList.add("invalid");
                valid = false;
            } else {
                field.classList.remove("invalid");
            }
        });
        return valid;
    }

    handleTaskSubmit(e, form, modal) {
        e.preventDefault();
        if (!this.validateForm(form)) {
            return;
        }
        const formData = new FormData(form);
        const taskData = {
            title: formData.get("taskName"),
            description: formData.get("taskDesc"),
            deadline: formData.get("date"),
            priority: formData.get("taskPriority"),
            project: formData.get("taskProject"),
        };

        if (this.app.currentTaskId) {
            this.app.updateTask(this.app.currentTaskId, taskData);
        } else {
            this.app.createTask(taskData);
        }

        form.reset();
        modal.close();
    }

    handleProjectSubmit(e, form, modal) {
        e.preventDefault();
        if (!this.validateForm(form)) {
            return;
        }
        const formData = new FormData(form);
        const projectName = formData.get("projectName");
        if (this.app.currentProjectId) {
            this.app.updateProject(this.app.currentProjectId, projectName);
        } else {
            this.app.createProject(projectName);
        }

        form.reset();
        modal.close();
    }
}
