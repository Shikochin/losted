<template>
    <section id="controller">
        <a v-if="canNavigateLeft" @click="$emit('navigate', 'left')" title="上一个">
            <i class="fa-thin fa-arrow-left-long"></i>
        </a>
        <a class="disabled" v-else title="已经到头了">
            <i class="fa-thin fa-arrow-left-long"></i>
        </a>
        <a @click="$emit('refresh')" title="随机">
            <i class="fa-thin fa-arrow-rotate-right"></i>
        </a>
        <a v-if="canNavigateRight" @click="$emit('navigate', 'right')" title="下一个">
            <i class="fa-thin fa-arrow-right-long"></i>
        </a>
        <a class="disabled" v-else title="已经到头了">
            <i class="fa-thin fa-arrow-right-long"></i>
        </a>
    </section>
</template>

<script setup lang="ts">
const props = defineProps<{
    index: number;
    total: number;
    canNavigateLeft: boolean;
    canNavigateRight: boolean;
}>();

const emit = defineEmits(['navigate', 'refresh']);
</script>

<style scoped>
#controller {
    font-size: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10vh;
}

a {
    opacity: 0.5;
    transition: opacity 0.3s;
    text-decoration: none;
    cursor: pointer;
    user-select: none;
}

a:hover {
    opacity: 0.8;
}

a.disabled {
    cursor: default;
    pointer-events: none;
    opacity: 0.2 !important;
}
</style>