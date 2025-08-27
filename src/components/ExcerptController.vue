<template>
    <section id="controller">
        <a v-if="index > 0" @click="$emit('navigate', index - 1)" title="上一个">
            <i class="fa-light fa-arrow-left-long"></i>
        </a>
        <a class="disabled" v-else title="已经到头了">
            <i class="fa-light fa-arrow-left-long"></i>
        </a>
        <a @click="$emit('refresh')" title="随机">
            <i class="fa-light fa-arrow-rotate-right"></i>
        </a>
        <a v-if="index < total - 1" @click="$emit('navigate', index + 1)" title="下一个">
            <i class="fa-light fa-arrow-right-long"></i>
        </a>
        <a class="disabled" v-else title="已经到头了">
            <i class="fa-light fa-arrow-right-long"></i>
        </a>
    </section>
</template>

<script setup lang="ts">
const props = defineProps<{
    index: number;
    total: number;
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
    color: black;
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