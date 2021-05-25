class Task {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }

    get taskName() {
        return this.title;
    }
    
    set taskName(title) {
        this.name = title;
    }
}

