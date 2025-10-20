export default class Project {
    constructor(name) {
        this.projectName = name;
        this.id = uuidv4();
        this.projectStorage = [];
    }
}
