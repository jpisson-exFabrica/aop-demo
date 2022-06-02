<script>
import Task from "../components/Task.vue";
import currentTask from "../components/currentTask.vue";

export default {
    components: {
        Task,
        currentTask,
    },
    props: {
        taskManager: Object,
    },
    computed: {
        orderedTaskList() {
            return this.taskManager.getTasks();
        },
        runningId () {
            return this.taskManager.getRunningId();
        }
    },
    methods: {
        async handleDelete(taskId) {
            try {
                this.taskManager.delete(taskId);
            } catch (error) {
                alert(error?.message);
            }
        },
        async handleStart(taskId) {
            try {
                this.taskManager.start(taskId);
            } catch (error) {
                alert(error?.message);
            }
        },
        async handleStop(taskId) {
            try {
                this.taskManager.stop(taskId);
            } catch (error) {
                alert(error?.message);
            }
        },
        async handleAddTime(taskId, delay) {
            try {
                this.taskManager.addTime(taskId, delay);
            } catch (error) {
                alert(error?.message);
            }
        },
        async handleNuke() {
            try {
                this.taskManager.clear();
            } catch (error) {
                alert(error?.message);
            }
        },
        async handleReassign(taskId, userId){
            try {
                this.taskManager.assignTo(taskId, userId);
                return true;
            } catch (error) {
                alert(error?.message);
                return false;
            }
        }
    }
}
</script>

<template>
    <div v-if="orderedTaskList.length > 0" class="task-list">
        <ol>
            <li v-for="(task, index) in orderedTaskList" :key="task.id">
                <currentTask v-if="index === 0" :key="`current${index}`" :id="task.id" :description="task.description" :descriptionHTML="task.descriptionHTML ?? null"
                    :duration="task.duration" :assignTo="task.assignTo" :priority="task.priority" :runningId="runningId"
                    :handleDelete="handleDelete" :handleStart="handleStart" :handleStop="handleStop" :handleAddTime="handleAddTime" :handleReassign="handleReassign">
                </currentTask>
                <Task v-else :id="task.id" :key="`next${index}`" :description="task.description" :duration="task.duration"
                    :assignTo="task.assignTo" :priority="task.priority"
                    :handleDelete="handleDelete">
                </Task>
            </li>
        </ol>
        <button @click="handleNuke" class="nuke-tasks" title="Nuke my tasks">☢️</button>
    </div>
    <div v-else class="no-task">
        <h2>✨Great work today !✨</h2>
    </div>
</template>

<style lang="scss">
.page-container {
    display: flex;
    width: 100%;
    padding: 1rem 0.5rem;
}

.task-list {
    display: flex;
    justify-content: center;
}

.no-task {
    margin-top: 10vh;
    font-size: larger;
}

ul,
ol {
    margin: 0;
    padding: 0;
    align-items: center;
}

li {
    list-style: none;
    margin: 10px 0px;
}

.card,
.main-task-card {
    display: inline-flex;
    flex-direction: column;
    width: 20rem;
    height: fit-content;
    justify-content: center;
    align-items: center;
    border: solid 2px;
    border-radius: 2.5%;

    & button {
        appearance: none;
        border: none;
        width: fit-content;
        height: fit-content;
        font-size: 1.4rem;

        &.time {
            font-size: 1rem;
        }
    }

    .task-header {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        margin: 2px 0px;

        .tag.assign {
            padding-left: 0.5rem;
        }

        .tag.priority {
            margin-top: 2px;
            padding: 0.175rem;
            border-radius: 20%;
            border-color: rgba($color: (#000000), $alpha: 0.4);
            border-width: 3px;
            border-style: solid;
            font-weight: 700;
            font-size: large;
        }

        button {
            background-color: rgba(255, 255, 255, 0);
            margin: 0px 0.5rem;
            padding: 0px;
        }
    }

    .task-principal {
        margin: 1rem 0rem;
    }

    .description {
        p {
            display: flex;
            margin: 8px;
        }
    }
}



.actions {
    padding: 0.25rem 0px;
    &.state {
        width: 5rem;
        display: flex;
        justify-content: space-between;
        margin: 0.25rem 0;
        padding-left: 0.85rem;
    }

    &.delay {
        width: 16rem;
        display: flex;
        justify-content: space-between;

        & button {
            background-color: #017ad7;
            color: white;
            padding: 4px;
            border: solid 2px #010251;
        }
    }
    
}

.nuke-tasks {
    margin: 0.6rem 2rem;
    appearance: none;
    border: none;
    border-radius: 50%;
    width: fit-content;
    height: fit-content;
    font-size: 2rem;
    padding: 0;
    background-color: rgba(255, 255, 255, 0);
}
</style>
