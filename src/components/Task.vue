<script>
import { peoples } from "../mock/datas"
import { formatDistanceToNow, addMinutes } from 'date-fns'

export default {
    props: {
        id: String,
        description: String,
        duration: Number,
        assignTo: String,
        category: String,
        priority: String,
        handleDelete: Function,
    },
    computed: {
        formatTimeLeft() {
            return formatDistanceToNow(addMinutes(new Date(), this.duration)
            )
        },
        iconAssignTo() {
            return Array.from(peoples).find(people => people.id === this.assignTo).icon;
        },
        canReassign() {

        }
    }
}
</script>

<template>
    <div class="card">
        <div class="task-header">
            <span class="tag priority" title="priority">{{ priority }}</span>
            <span class="tag assign" title="assign to">{{iconAssignTo}}</span>
            <button @click="handleDelete(id)" title="eject task">⏏️</button>
        </div>
        <div class="task-principal">
            <strong>{{ id }}</strong> <span class="tag time">🕑 {{ formatTimeLeft }} left</span>
        </div>
        <div v-if="description!=''" class="description">
            <p>{{ description }}</p>
        </div>
    </div>
</template>

<style  lang="scss" scoped>
.card {
    background-color: rgba(211, 211, 211, 0.92);
}
</style>