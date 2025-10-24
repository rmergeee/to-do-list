import Project from "./Project";

export default class ProjectsList {
    constructor() {
        this.projectStorage = [];
    }

    addProject(name) {
        this.projectStorage.push(new Project(name));
    }

    deleteProject(projectId) {
        const projectIndex = this.projectStorage.findIndex((project) => project.id === projectId);
        if (projectIndex !== -1) {
            this.projectStorage.splice(projectIndex, 1);
        }
    }
}
