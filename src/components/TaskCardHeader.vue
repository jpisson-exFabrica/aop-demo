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
        handleDelete: Function,
    },
    data() {
        return {
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
}
</script>

<template>
    <header class="task-header">
        <strong class="tag priority" title="priority">{{ priority }}</strong>
        <select id="currentAssignTo" v-model="isAssignTo">
            <option v-for="({id, icon, assignable}, index) in assignablePeoples" :key="index" :value="id" :disabled="!assignable">
                {{icon}} {{id}}
            </option>
        </select>
        <button @click="handleDelete(id)" title="eject task"><span class="eject">⏏️</span></button>
    </header>
    <dl class="task-principal">
        <dt>
            <h2>{{ id }}</h2>
        </dt>
        <dd class="tag time">🕑 {{ formatTimeLeft }} left</dd>
    </dl>
    <div v-if="description!='' || descriptionHTML!=null" class="description">
        <p v-if="descriptionHTML !== null" v-html="descriptionHTML"></p><p v-else>{{ description }}</p>
    </div>
</template>

<style lang="scss" scoped>
.main-task-card {
    border-color: v-bind(cardColorBorder);
    background-color: v-bind(priorityColor);
}
</style>