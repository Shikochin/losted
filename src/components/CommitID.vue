<script setup lang="ts">
import { ref, onMounted } from 'vue';

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

onMounted(() => {
    fetchLatestCommitID();
});
</script>

<template>
    <span v-if="commitID">
        <a :href="`https://github.com/Shikochin/losted/commit/${commitID}`" target="_blank" rel="noopener noreferrer">{{
            commitID }}</a>
    </span>
    <span v-else>Loading...</span>
</template>

<style scoped>
a {
    text-decoration: underline;
    cursor: pointer;
    user-select: none;
}
</style>
