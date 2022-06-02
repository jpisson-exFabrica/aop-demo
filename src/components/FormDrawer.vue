<script>

export default {
    props: {
        isOpen: Boolean,
    },
    methods: {
        handleToggle() {
            this.$emit('open')
        }
    },
}
</script>

<template>
    <div class="drawer" :class="{ 'open': isOpen, 'close': !isOpen }">
        <button class="toggle-drawer" @click="handleToggle" :title="`${isOpen ? 'close' : 'open'} form`">
            <span :class="{ 'open': isOpen, 'close': !isOpen }">✖️</span>
        </button>
        <slot :isOpen="isOpen"></slot>
    </div>

</template>

<style lang="scss">
.drawer {
    position: fixed;
    z-index: 1;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    top: 0;
    left: 0;
    overflow: visible;
    background-color: #017ad7;
    color: white;
    min-height: 100vh;
    transition: 0.5s;
    padding-top: 4vh;
    padding-right: 34px;
}

.toggle-drawer {
    appearance: none;
    position: absolute;
    right: 0px;
    top: 20px;
    border: 0;
    border-radius: 50%;
    background-color: #017ad7;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1.6;
    font-size: 2rem;
    transform: translate(50%, 50%);

    >span {
        position: relative;
        min-width: 1.4rem;
        color: black;

        &.open {
            transform: rotate(0deg);
        }

        &.close {
            transform: rotate(45deg);
        }

    }

    &.open {
        min-width: 320px;
    }

    &.close {
        max-width: 34px;
    }
}

.open {
    min-width: 340px;
}

.close {
    max-width: 62px;
}
</style>