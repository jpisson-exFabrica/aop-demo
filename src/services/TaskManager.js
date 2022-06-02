import { quota, can } from "../helpers/AOP";

//Contants
const maxTopTasks = 3;
const storageKey = "tasks";
let intervalId = null;

class TaskManager {
  //Private Fields
  tasks = null;
  runningId = null;
  //Constructor
  constructor() {
    const saveTasks = localStorage.getItem(storageKey);
    if (saveTasks != null) {
      console.log("Retrive from local storage => ", saveTasks);
      this.tasks = new Map();
      const formatSaveData = JSON.parse(saveTasks);
      formatSaveData.forEach((task) => {
        console.log("Retrived task => ", task);
        this.tasks.set(task.id, task);
      });
    } else {
      this.tasks = new Map();
    }
    console.log("Tasks are", this.tasks);
    this.runningId = null;
  }

  primarily() {
    const localTasks = [...this.tasks.values()];
    return localTasks.filter((task) => task.priority === "Top");
  }

  secondly() {
    const localTasks = [...this.tasks.values()];
    return localTasks.filter((task) => task.priority === "High");
  }

  remnant() {
    const localTasks = [...this.tasks.values()];

    return localTasks.filter((task) => task.priority === "Low");
  }

  getTasks() {
    return [...this.primarily(), ...this.secondly(), ...this.remnant()];
  }

  getIds() {
    return new Set(this.tasks.keys());
  }

  getRunningId() {
    return this.runningId;
  }

  //Methods
  @can("Eta")
  @quota("manage.add")
  add(task) {
    //guard clauses
    if (this.tasks.has(task.id)) {
      throw new Error("Task already exist");
    }
    if (task.priority === "Top" && this.primarily().length >= maxTopTasks) {
      throw new Error("Too many Top-level task registered");
    }
    if(task.assignTo === "God"){
      throw new Error("You really think you can assign something to the big guy ?");
    }
    //business
    this.tasks.set(task.id, task);
    localStorage.setItem(
      storageKey,
      JSON.stringify(Array.from(this.getTasks()))
    );
    return localStorage.getItem(storageKey);
  }

  @can("Zeta")
  @quota("manage.delete")
  async delete(taskId) {
    if(this.runningId === taskId) {
      clearInterval(intervalId);
      this.runningId = null;
      intervalId = null;
    }
    this.tasks.delete(taskId);
    localStorage.setItem(
      storageKey,
      JSON.stringify(Array.from(this.getTasks()))
    );
  }

  @can("Phi")
  @quota("manage.clear")
  async clear() {
    this.tasks.clear();
    localStorage.setItem(storageKey, JSON.stringify([]));
  }

  @can("Iota")
  @quota("interact.play")
  start(taskId) {
    this.runningId = taskId
    intervalId = setInterval(() => {
      let task = this.tasks.get(taskId);
      if (task.duration > 0) {
        task.duration--
        this.tasks.set(taskId, task);
      }
      else {
          console.log('Time is done')
          clearInterval(intervalId);
          this.runningId = null
          intervalId = null
      }
    }, 400)//1k = 1sec, 60k = 1min
  }

  @can("Gamma")
  @quota("interact.stop")
  stop(taskId) {
    if(this.runningId === taskId) {
      clearInterval(intervalId);
      this.runningId = null;
      intervalId = null;
    }
  }

  @can("Tau")
  @quota("interact.addTime")
  addTime(taskId, delay) {
    let task = this.tasks.get(taskId);
    task.duration+= delay
    this.tasks.set(taskId, task);
  }

  @can("Theta")
  assignTo(taskId, userId) {
    if(userId === "God"){
      throw new Error("You really think you can assign something to the big guy ?");
    }
    console.log("TaskManager.assignTo", taskId, userId)
    let task = this.tasks.get(taskId);
    task.assignTo = userId
    this.tasks.set(taskId, task);
  }

}

export { TaskManager };
