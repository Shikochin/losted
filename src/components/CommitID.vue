<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

// State variable to store the latest commit ID
const commitID = ref('');

// Function to fetch the latest commit ID from the GitHub API
const fetchLatestCommitID = async () => {
    try {
        const response = await fetch('https://api.github.com/repos/Shikochin/losted/commits');
        const data = await response.json();
        if (data && data.length > 0) {
            commitID.value = data[0].sha.substring(0, 7);
        }
    } catch (error) {
        console.error('Failed to fetch the latest commit ID:', error);
    }
};

const rootEl = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
    const onIntersect: IntersectionObserverCallback = (entries, obs) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                fetchLatestCommitID();
                obs.disconnect();
                observer = null;
                break;
            }
        }
    };
    observer = new IntersectionObserver(onIntersect, { rootMargin: '150px 0px', threshold: 0 });
    if (rootEl.value) {
        observer.observe(rootEl.value);
    } else {
        // Fallback
        fetchLatestCommitID();
    }
});

onBeforeUnmount(() => {
    observer?.disconnect();
});
</script>

<template>
    <span ref="rootEl" v-if="commitID">
        <a :href="`https://github.com/Shikochin/losted/commit/${commitID}`" target="_blank" rel="noopener noreferrer">{{
        commitID }}</a>
    </span>
    <span v-else>Loading...</span>
</template>

<style scoped>
a {
    text-decoration: underline;
    color: black;
    cursor: pointer;
    user-select: none;
}
</style>
