<script>
export default {
    props: {
        id: String,
        duration: Number,
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
        }
    },
    computed: {
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
    <article class="main-task-card">
        <slot></slot>
        <ul class="actions state">
            <li><button @click="handleDelete(id)" title="stop task"><span>⏹️</span></button></li>
            <li v-if="isRunning"><button @click="handleStop(id)" title="pause task"><span>⏸️</span></button></li>
            <li v-else><button @click="handleStart(id)" title="play task"><span>▶️</span></button></li>
        </ul>
        <ul class="actions delay">
            <li><button class="time" @click="handleAddTime(id, 5)" title="add 5 minutes to task">➕ 5min</button></li>
            <li><button class="time" @click="handleAddTime(id, 15)" title="add 15 minutes to task">➕ 15min</button></li>
            <li><button class="time" @click="handleAddTime(id, 60)" title="add 1 hour to task">➕ 1H</button></li>
        </ul>
    </article>
</template>

<style lang="scss" scoped>
.main-task-card {
    border-color: v-bind(cardColorBorder);
    background-color: v-bind(priorityColor);
}
</style>