import Project from "./Project";

export default class ProjectsList {
    constructor() {
        this.projectStorage = [new Project("Example Project")];
    }

    addProject(name) {
        this.projectStorage.push(new Project(name));
    }
}
