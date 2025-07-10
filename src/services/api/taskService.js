import mockTasks from "@/services/mockData/tasks.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...mockTasks];
  }
  
  async getAll() {
    await delay(300);
    return [...this.tasks];
  }
  
  async getById(id) {
    await delay(200);
    const task = this.tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  }
  
  async create(taskData) {
    await delay(400);
    const newTask = {
      ...taskData,
      Id: Math.max(...this.tasks.map(t => t.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }
  
  async update(id, taskData) {
    await delay(300);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    const updatedTask = {
      ...this.tasks[index],
      ...taskData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString(),
    };
    
    this.tasks[index] = updatedTask;
    return { ...updatedTask };
  }
  
  async delete(id) {
    await delay(250);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    this.tasks.splice(index, 1);
    return { success: true };
  }
}

export const taskService = new TaskService();