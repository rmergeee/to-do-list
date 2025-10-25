export default class TaskRenderer {
    renderTask(task, onToggle) {
        const taskCard = document.createElement("article");
        taskCard.className = "task";

        const taskCheckbox = document.createElement("input");
        taskCheckbox.type = "checkbox";
        taskCheckbox.name = "Task Status";
        taskCheckbox.id = task.id;
        taskCheckbox.checked = task.isCompleted;

        const label = document.createElement("label");
        const taskTitle = document.createElement("h3");
        taskTitle.className = "taskHeader";

        const taskTextContent = document.createElement("div");
        taskTextContent.className = "taskTextContent";
        const taskDescription = document.createElement("p");
        taskDescription.className = "taskDesc";
        const taskDeadline = document.createElement("p");

        taskTitle.textContent = task.title;
        taskDescription.textContent = task.description;
        taskDeadline.textContent = task.deadline;

        label.appendChild(taskTitle);
        taskTextContent.append(taskDescription, taskDeadline);
        taskCard.append(taskCheckbox, label, taskTextContent);

        taskCheckbox.addEventListener("change", () => {
            onToggle(task.id);
        });

        return taskCard;
    }

    renderProject(project) {
        const projectFilter = document.createElement("li");
        projectFilter.innerHTML = `<a href="#">${project.name}</a>`;
        projectFilter.id = project.id;

        const projectOption = document.createElement("option");
        projectOption.value = project.id;
        projectOption.textContent = project.name;

        return {
            projectFilter,
            projectOption,
        };
    }
}
