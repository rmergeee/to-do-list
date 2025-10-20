import Project from "./Project";

export default class ProjectsList {
    constructor() {
        this.projectStorage = [];
    }

    addProject(name) {
        this.projectStorage.push(new Project(name));
    }
}
