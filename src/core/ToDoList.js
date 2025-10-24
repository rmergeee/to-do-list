import Task from "./Task";

export default class ToDoList {
    constructor() {
        this.taskStorage = [];
    }

    addTask(title, description, deadline, priority, project) {
        this.taskStorage.push(new Task(title, description, deadline, priority, project));
    }

    updateTask(id, updates) {
        const task = this.getTask(id);
        if (task) {
            task.title = updates.title ?? task.title;
            task.description = updates.description ?? task.description;
            task.deadline = updates.deadline ?? task.deadline;
            task.priority = updates.priority ?? task.priority;
        }
        return null;
    }

    getTask(id) {
        return this.taskStorage.find((task) => task.id === id);
    }

    deleteTask(id) {
        const taskIndex = this.taskStorage.findIndex((task) => task.id === id);
        if (taskIndex !== -1) {
            this.taskStorage.splice(taskIndex, 1);
        }
    }

    changeTaskStatus(id) {
        const task = this.taskStorage.find((task) => task.id === id);
        task.isCompleted = task.isCompleted ? false : true;
    }

    getTasksByStatus(isCompleted) {
        return this.taskStorage.filter((task) => task.isCompleted === isCompleted);
    }

    getTasksByProject(projectId) {
        return this.taskStorage.filter((task) => task.project === projectId);
    }

    getTasksByPriority(priority) {
        return this.taskStorage.filter((task) => task.priority === priority);
    }
}
