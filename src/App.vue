<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import excerpts from './assets/data/excerpts.json';
import ExcerptDisplay from './components/ExcerptDisplay.vue';
import ExcerptController from './components/ExcerptController.vue';
import CommitID from './components/CommitID.vue';

// Router instance
const router = useRouter();

// State variables
const index = ref(0); // Current excerpt index
const excerpt = ref<{ content: string[]; author: string }>({ content: [], author: '' }); // Current excerpt

// Get a random excerpt index that is not the same as the current one
function getRandomExcerpt(): number {
    let _index: number;
    do {
        _index = Math.floor(Math.random() * excerpts.length);
    } while (_index === index.value);
    return _index;
}

// Update the excerpt to the specified index
function replaceToSpecifiedExcerpt(i: number) {
    router.push({ query: { index: i } });
    index.value = i;
    excerpt.value = excerpts[i];
}

// Refresh the current excerpt with a new random one
function refresh() {
    const _index = getRandomExcerpt();
    replaceToSpecifiedExcerpt(_index);
}

// Extract the "index" parameter value from the URL query string
function extractIndexParam(str: string): string {
    const match = str.match(/index=\w+/);
    return match ? match[0] : '';
}

// Initialize the excerpt based on the current state or storage
function initExcerpt() {
    const currentStateIndex = extractIndexParam(history.state.current);
    setInitialIndex(currentStateIndex);
    replaceToSpecifiedExcerpt(index.value);
}

// Set the initial index for the excerpt
function setInitialIndex(stateIndex: string) {
    if (stateIndex) {
        index.value = parseInt(stateIndex.split('=')[1]);
    } else {
        index.value = getRandomExcerpt();
    }
}

// Handle key up events for navigation and refresh
function handleKeyUp(e: KeyboardEvent) {
    switch (e.key) {
        case 'ArrowLeft':
            if (index.value > 0) replaceToSpecifiedExcerpt(index.value - 1);
            break;
        case 'ArrowRight':
            if (index.value < excerpts.length - 1) replaceToSpecifiedExcerpt(index.value + 1);
            break;
        case 'r':
            refresh();
            break;
        default:
            break;
    }
}

onMounted(() => {
    initExcerpt();
    document.addEventListener('keyup', handleKeyUp); // Register key up event
});

onBeforeUnmount(() => {
    document.removeEventListener('keyup', handleKeyUp); // Clean up the event listener
});
</script>

<template>
    <main>
        <header>
            <a href="https://github.com/Shikochin/losted"><i class="fa-light fa-pen-nib"></i> Losted</a>
        </header>
        <ExcerptDisplay :excerpt="excerpt" />
        <ExcerptController :index="index" :total="excerpts.length" @navigate="replaceToSpecifiedExcerpt"
            @refresh="refresh" />
        <footer>
            Commit ID:
            <CommitID />
            <br />
            Excerpts are attributed to the author<br />
            2024-present by <a href="https://github.com/Shikochin" target="_blank">@Shikochin</a>
        </footer>
    </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Noto+Serif+SC&display=swap');

a {
    text-decoration: none;
    color: black;
    cursor: pointer;
    user-select: none;
}

main {
    font-family: 'Instrument Serif', 'Noto Serif SC', serif;
}

header {
    font-size: 3vw;
    margin-bottom: 8vh;
}

footer {
    user-select: none;
    font-size: 2.5vw;
}

@media (max-width: 600px) {
    header {
        font-size: 7vw;
    }

    footer {
        font-size: 4.5vw;
    }
}

@media (min-width: 1200px) {
    header {
        font-size: 2vw;
    }

    footer {
        font-size: 1.5vw;
    }
}
</style>