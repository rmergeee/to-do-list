export default class Task {
  constructor(title, description, deadline) {
    this.title = title;
    this.description = description;
    this.deadline = deadline;
    this.status = true;
  }

  changeStatus() {
    this.status = this.status ? false : true;
  }
}
