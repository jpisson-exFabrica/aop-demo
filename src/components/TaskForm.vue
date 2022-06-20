<script>

import { ref } from 'vue'
import { peoples, TaskPriorities } from "../mock/datas"
import RbacService from "../services/RbacService"

const rbacService = RbacService.getInstance();
export default {
    props: {
        isOpen: Boolean,
        addTask: Function,
        existingTaskIds: Set,
    },
    data() {
        return {
            id: ref(""),
            description: ref(""),
            durationHours: ref(0),
            durationMinutes: ref(1),
            assignTo: ref("Myself"),
            priority: ref("Low"),
            TaskPriorities,
        }
    },
    methods: {
        clearForm() {
            this.id = ""
            this.description = ""
            this.durationHours = 0
            this.durationMinutes = 1
            this.assignTo = "Myself"
            this.priority = "Low"
        },
        async submitTodo() {
            console.log("Create a task with duration => ", Number.parseInt((this.durationHours ?? 0) * 60 + this.durationMinutes ?? 0))
            try {
                const task = {
                    id: this.id,
                    description: this.description,
                    duration: Number.parseInt(this.durationHours * 60 + this.durationMinutes),
                    assignTo: this.assignTo,
                    priority: this.priority,
                }
                this.$emit('addtask', task)
            } catch (error) {
                console.error(error)
            } finally {
                this.clearForm();
            }
        },
    },
    computed: {
        isUniqId() {
            return this.existingTaskIds.has(this.id)
        },
        assignablePeoples () {
            const canAssign = rbacService.hasPerms('interact.assignToOther');
            return Array.from(peoples).map(people => { 
                if(people.id === "Myself") {
                    return {...people, assignable: true}
                }
                else {
                    return {...people, assignable: canAssign}
                }
            })
        }
    },
}

</script>

<template>
    <form class="task-form" v-if="isOpen" @submit.prevent="submitTodo" @reset.prevent="clearForm">
        <div class="form-item">
            <label for="title">Title</label>
            <input id="title" name="title" type="text" v-model="id" required />
            <span class="error-message" v-if="isUniqId">⚠️ This title is already used</span>
        </div>
        <div class="form-item">
            <label for="description">Description</label>
            <textarea id="description" name="description" v-model="description" cols="38" rows="4"></textarea>
        </div>
        <fieldset class="form-item">
            <legend>Duration</legend>
            <div class="form-duration">
                <label for="duration-hours">Hours</label>
                <input id="duration-hours" name="duration-hours" type="number" v-model="durationHours" min="0" max="8" required/>
                <label for="duration-minutes">Minutes</label>
                <input id="duration-minutes" name="duration-minutes" type="number" v-model="durationMinutes" min="0" max="59" required />
            </div>
            
        </fieldset>
        <div class="form-item">
            <label for="assignTo">AssignTo</label>
            <select id="assignTo" v-model="assignTo">
                <option v-for="({id, icon, assignable}, index) in assignablePeoples" :key="index" :value="id" :disabled="!assignable">
                    {{icon}} {{ id }}</option>
            </select>
        </div>
        <div class="form-item">
            <label for="priority">Priority</label>
            <select id="priority" v-model="priority">
                <option v-for="taskPrio in TaskPriorities" :key="taskPrio" :value="taskPrio">
                    {{ taskPrio }}</option>
            </select>
        </div>
        <ul class="form-item actions">
            <li><button type="submit">Submit</button></li>
            <li><button type="reset">Reset</button></li>
        </ul>

    </form>
</template>

<style lang="scss">
.task-form {
    padding-left: 40px;
}

.form-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 10px 0px;
    font-weight: 600;
    margin: 20px 10px 6px 0px;
    > span {
        margin-bottom: 6px;
    }

    .form-duration input {
        margin: 0px 8px;
        max-width: 42px;
    }

    &.actions {
        flex-direction: row;
        justify-content: space-around;
        button {
            color: white;
            padding: 6px;
            border-radius: 12%;
            background-color: #6b6b6d;
        }

    }

    .error-message {
        margin-top: 2px;
        color: #5D1212;
    }
}
</style>
