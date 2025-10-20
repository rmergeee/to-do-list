import { v4 as uuidv4 } from "uuid";

export default class Task {
    constructor(title, description, deadline, project = null) {
        this.id = uuidv4();
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.status = true;
        this.project = project;
    }
}
