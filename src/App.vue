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
    if (i < excerpts.length) {
        router.push({ query: { index: i } });
        index.value = i;
        excerpt.value = excerpts[i];

    } else if (i === 52) {
        router.push({ query: { index: 52 } });
        excerpt.value = {
            content: [
                '贝莎漫游在大街上，坐在路边，阳光透过街边的玻璃窗洒在她的脸上。她的手指轻轻抚摸着路缝里钻出来的花朵，仿佛在感受它们的生命力。她的心中充满了对生活的热爱，对未来的憧憬。',
            ],
            author: '52 号记录'
        };
    } else if (i === 42) {
        router.push({ query: { index: 42 } });
        excerpt.value = {
            content: [
                '“老爷，这些药真的可以吗，这些药还未经批准啊，您是从哪里弄来的？”',
                '“轮不到你问这些问题，你也知道，最近爱丽丝的睡眠质量越来越差了，再不进行干预，恐怕她每天都会如此浑浑噩噩了。”',
                '“可这不是因为家族......”',
                '“你他妈少给我废话！赫尔，你知道我他妈有多努力吗？！”',
                '“工厂弄的外面乌烟瘴气的，我们也很难办啊......”',
                '“可是......”',
                '“......我明白了。”'

            ],
            author: '42 号记录'
        };
    }
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