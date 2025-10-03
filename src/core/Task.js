export default class Task {
  constructor(title, description, deadline, project) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.deadline = deadline;
    this.status = true;
    this.project = project;
  }
}
