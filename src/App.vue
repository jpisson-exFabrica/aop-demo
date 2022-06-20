<script setup>
import { computed, ref, reactive } from 'vue';
import TaskForm from './components/TaskForm.vue'
import TasksViewer from './pages/TasksViewer.vue';
import { TaskManager } from './services/TaskManager'
import { loginHandler, profilingHandler } from './helpers/AOP'
import FormDrawer from './components/FormDrawer.vue'

// let taskManager = reactive(new Proxy(new Proxy(new TaskManager(), profilingHandler), loginHandler));

let taskManager = reactive(new TaskManager());
const submitTaskForm = async (task) => {
  try {
    await taskManager.add(task)
  } catch (error) {
    alert(error?.message ?? 'Fail !')
  }
  
}

let open = ref(false)

const reactiveTaskIds = computed(() => taskManager.getIds())
const isOpen = computed(() => open.value)
try {
  if (taskManager.tasks.size === 0) {
    const firstTask = {
      id: 'First task',
      description: 'First task in the todo list',
      descriptionHTML: `<span>Hope you'll enjoy this,
      we are <a href="https://www.exfabrica.io/" target="_blank">exFabrica</a></span>`,
      duration: 10,
      assignTo: 'Myself',
      category: 'Public',
      priority: 'Low',
    }
    taskManager.add(firstTask);
  }
} catch (error) {
  console.error('Fail to add first task');
}

const handleDrawer = () => {
  open.value = !open.value
}

const title = "Timeboxed task list"

</script>

<template>
<div class="page-container">
  <h1>{{title}}</h1>
  <FormDrawer :isOpen="isOpen" @open="handleDrawer">
    <TaskForm :isOpen="isOpen" :addTask="taskManager.add" :existingTaskIds="reactiveTaskIds" @addtask="submitTaskForm">
    </TaskForm>
  </FormDrawer>
  <div class="main-content">
    <TasksViewer :taskManager="taskManager">
    </TasksViewer>
  </div>
</div>
  
</template>

<style>
body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  display: flex;
  background-image: url("../imgs/origami-brain.jpg");
  background-size: cover;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 60vw;
  width: 80vw;
  height: 90vh;
  overflow: hidden;
}

.tag button, .actions button {
  margin: 0px;
  padding: 0px;
  background-color: rgba(255, 255, 255, 0);
}

h1 {
  margin-left: 74px;
}

h2 {
  margin: 0.8rem, 0.6rem;
  padding: 0px 10px;
  font-size: 1.20rem;
  word-break: break-word;
}

h3 {
  margin: 0.6rem 0.4rem;
}

dl {
  margin: 0px;
}

dd {
    margin: 0px;
}

ul li {
  margin: 0px;
}

fieldset {
  border: none;
  margin: 0;
  padding: 0;
}
legend {
  padding: 0px;
}
</style>
