<script>
import { peoples } from "../mock/datas"
import { formatDistanceToNow, addMinutes } from 'date-fns'
import RbacService from "../services/RbacService"

const rbacService = RbacService.getInstance();

export default {
    props: {
        id: String,
        description: String,
        descriptionHTML: {
            type: String,
            required: false,
            default: null,
        },
        duration: Number,
        assignTo: String,
        category: String,
        priority: String,
        runningId: String,
        handleDelete: Function,
        handleStart: Function,
        handleStop: Function,
        handleAddTime: Function,
        handleReassign: Function,
    },
    data() {
        return {
            isRunning: false,
            localAssign: null,
        }
    },
    computed: {
        formatTimeLeft() {
            return formatDistanceToNow(addMinutes(new Date(), this.duration)
            )
        },
        iconAssignTo() {
            return Array.from(peoples).find(people => people.id === this.isAssignTo).icon;
        },
        cardColorBorder() {
            let returnValue = ''
            if (this.duration === 0) {
                returnValue = 'rgb(78, 51, 101)';
            }
            else if (this.duration > 0 && this.duration <= 10) {
                returnValue = 'rgb(175, 34, 34)';
            }
            else if (this.duration > 10 && this.duration <= 25) {
                returnValue = 'rgb(241, 102, 123)';
            }
            else if (this.duration > 25 && this.duration <= 50) {
                returnValue = 'rgb(253, 163, 41)';
            }
            else if (this.duration > 50 && this.duration <= 90) {
                returnValue = 'rgb(254, 204, 48)';
            }
            else if (this.duration > 90 && this.duration <= 120) {
                returnValue = 'rgb(64, 166, 215)';
            }
            else if (this.duration > 120) {
                returnValue = 'rgb(145, 198, 89)';
            }
            else {
                returnValue = 'rgb(12, 12, 12)';
            }
            return returnValue;
        },
        priorityColor() {
            let returnValue = ''
            switch (this.priority) {
                case "Low":
                    returnValue = 'rgb(130, 151, 166, 0.8)'
                    break;
                case "High":
                    returnValue = 'rgb(254, 165, 1, 0.8)'
                    break;
                case "Top":
                    returnValue = 'rgb(175, 34, 34, 0.8)'
                    break;
                default:
                    returnValue = 'white'
                    break;
            }
            return returnValue;
        },
        assignablePeoples () {
            const canAssign = rbacService.hasPerms('Theta');
            return Array.from(peoples).map(people => { 
                if(people.id === "Myself") {
                    return {...people, assignable: true}
                }
                else {
                    return {...people, assignable: canAssign}
                }
            })
        },
        isAssignTo: {
            get() {
                return this.localAssign ?? this.assignTo
            },
            async set(personId) {
                try {
                    const result = await this.handleReassign(this.id, personId);
                    if(!result) {
                        let selector = document.getElementById("currentAssignTo")
                        selector.options[0].selected = true
                    }else {
                        this.localAssign = personId;
                    }
                } catch (error) {
                    console.error(error);
                    
                }
            }
        }
    },
    watch: {
        runningId: {
            handler(val, oldVal) {
                this.isRunning = (this.runningId === this.id);
            },
            immediate: true
        },
    }

}
</script>

<template>
    <div class="main-task-card">
        <div class="task-header">
            <span class="tag priority" title="priority">{{ priority }}</span>
            <select id="currentAssignTo" v-model="isAssignTo">
                <option v-for="({id, icon, assignable}, index) in assignablePeoples" :key="index" :value="id" :disabled="!assignable">
                    {{icon}} {{id}}
                </option>
            </select>
            <button @click="handleDelete(id)" title="eject task"><span class="eject">⏏️</span></button>
        </div>
        <div class="task-principal">
            <strong>{{ id }}</strong> <span class="tag time">🕑 {{ formatTimeLeft }} left</span>
        </div>
        <div v-if="description!='' || descriptionHTML!=null" class="description">
            <p v-if="descriptionHTML !== null" v-html="descriptionHTML"></p><p v-else>{{ description }}</p>
        </div>
        <div class="actions state">
            <button @click="handleDelete(id)" title="stop task"><span>⏹️</span></button>
            <button v-if="isRunning" @click="handleStop(id)" title="pause task"><span>⏸️</span></button>
            <button v-else @click="handleStart(id)" title="play task"><span>▶️</span></button>
        </div>
        <div class="actions delay">
            <button class="time" @click="handleAddTime(id, 5)" title="add 5 minutes to task">➕ 5min</button>
            <button class="time" @click="handleAddTime(id, 15)" title="add 15 minutes to task">➕ 15min</button>
            <button class="time" @click="handleAddTime(id, 60)" title="add 1 hour to task">➕ 1H</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.main-task-card {
    border-color: v-bind(cardColorBorder);
    background-color: v-bind(priorityColor);
}
</style>