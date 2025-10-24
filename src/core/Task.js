import { v4 as uuidv4 } from "uuid";

export default class Task {
    constructor(title, description, deadline, priority, project = null) {
        this.id = uuidv4();
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.isCompleted = false;
        this.priority = priority;
        this.project = project;
    }
}
