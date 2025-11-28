<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import ExcerptDisplay from './components/ExcerptDisplay.vue';
import ExcerptController from './components/ExcerptController.vue';
import CommitID from './components/CommitID.vue';
import Giscus from '@giscus/vue'

// Lazy load excerpts data
const excerpts = ref<Array<{ content: string[]; author: string; source?: string }>>([]);
let excerptsLoaded = false;

// Computed property for excerpts length
const excerptsLength = computed(() => excerpts.value.length);

// Computed properties for navigation state
const canNavigateLeft = computed(() => canNavigate('left'));
const canNavigateRight = computed(() => canNavigate('right'));

// Router instance
const router = useRouter();

// Load excerpts data asynchronously
async function loadExcerpts() {
    if (!excerptsLoaded) {
        try {
            const module = await import('./assets/data/excerpts.json');
            excerpts.value = module.default;
            excerptsLoaded = true;
        } catch (error) {
            console.error('Failed to load excerpts:', error);
            excerpts.value = [];
        }
    }
}


// State variables
const index = ref(0); // Current excerpt index
const excerpt = computed(() => {
    const i = index.value

    if (i === 52) {
        return {
            content: [
                '贝莎漫游在大街上，坐在路边，阳光透过街边的玻璃窗洒在她的脸上。她的手指轻轻抚摸着路缝里钻出来的花朵，仿佛在感受它们的生命力。她的心中充满了对生活的热爱，对未来的憧憬。',
            ],
            author: '52 号记录'
        };
    } else if (i === 42) {
        return {
            content: [
                '"老爷，这些药真的可以吗，这些药还未经批准啊，您是从哪里弄来的？"',
                '"轮不到你问这些问题，你也知道，最近爱丽丝的睡眠质量越来越差了，再不进行干预，恐怕她每天都会如此浑浑噩噩了。"',
                '"可这不是因为家族......"',
                '"你他妈少给我废话！赫尔，你知道我他妈有多努力吗？！"',
                '"工厂弄的外面乌烟瘴气的，我们也很难办啊......"',
                '"可是......"',
                '"......我明白了。"'

            ],
            author: '42 号记录'
        };
    } else if (i === 46) {
        return {
            content: [
                '"蔚蓝色星球下，阳光多么灿烂，亮的人们都睁不开眼。"',
                '"只是有些人可以晒到阳光，有些人的生命只能在灯光下度过，他们望向窗外，却只能看到\'努力工作，不怕牺牲\'的标语。"',
                '"多么可笑，人这一生的命运居然不会捏在自己手中，任凭你怎么挣扎，却终究逃不出这个牢笼。"'
            ],
            author: '@kencu11en'
        };
    } else if (i === 36) {
        return {
            content: ['"I swear you won\'t lose anymore."'],
            author: 'Mysteries'
        };
    }
    if (i < excerpts.value.length) {
        return excerpts.value[i];
    }
    return { content: ['Loading...'], author: '' };
});

const specialExcerptIndices = [52, 42, 46, 36].sort((a, b) => a - b);

// Get a random excerpt index that is not the same as the current one
function getRandomExcerpt(): number {
    if (excerpts.value.length === 0) return 0;
    // Filter out current index
    const availableIndices = getAllValidIndices().filter(i => i !== index.value);

    // Return random index from available indices
    return availableIndices[Math.floor(Math.random() * availableIndices.length)];
}

// Update the excerpt to the specified index
function replaceToSpecifiedExcerpt(i: number) {
    const _index = i.toString()
    const param = new URLSearchParams(location.search)
    if (param.get("index") === _index) {
        return
    }
    param.set("index", _index)
    router.push({ query: Object.fromEntries(param.entries()) });
    index.value = i
}

// Refresh the current excerpt with a new random one
function refresh() {
    replaceToSpecifiedExcerpt(getRandomExcerpt());
}

// Handle key up events for navigation and refresh
function handleKeyUp(e: KeyboardEvent) {
    switch (e.key) {
        case 'ArrowLeft':
            navigateToNearestExcerpt('left');
            break;
        case 'ArrowRight':
            navigateToNearestExcerpt('right');
            break;
        case 'r':
            refresh();
            break;
    }
}

// Get all valid indices in sorted order
function getAllValidIndices() {
    const regularIndices = Array.from({ length: excerpts.value.length }, (_, i) => i); // [0, 1, 2, ..., 25]
    return [...regularIndices, ...specialExcerptIndices].sort((a, b) => a - b); // All valid indices sorted
}

// Check if navigation is possible in the given direction
function canNavigate(direction: 'left' | 'right'): boolean {
    const allValidIndices = getAllValidIndices();
    const currentIndex = index.value;
    const currentPosition = allValidIndices.indexOf(currentIndex);

    if (currentPosition === -1) return false;

    if (direction === 'left') {
        return currentPosition > 0;
    } else {
        return currentPosition < allValidIndices.length - 1;
    }
}

// Navigate to the nearest valid excerpt in the specified direction
function navigateToNearestExcerpt(direction: 'left' | 'right') {
    const allValidIndices = getAllValidIndices();
    const currentIndex = index.value;
    const currentPosition = allValidIndices.indexOf(currentIndex);

    if (currentPosition === -1) {
        // Current index is not in valid indices, shouldn't happen but fallback to first valid
        replaceToSpecifiedExcerpt(allValidIndices[0]);
        return;
    }

    if (direction === 'left' && currentPosition > 0) {
        // Navigate to previous valid index
        replaceToSpecifiedExcerpt(allValidIndices[currentPosition - 1]);
    } else if (direction === 'right' && currentPosition < allValidIndices.length - 1) {
        // Navigate to next valid index
        replaceToSpecifiedExcerpt(allValidIndices[currentPosition + 1]);
    }
    // If at the beginning/end, do nothing
}


// idontknowwhatisthis
const prefaceEl = ref<HTMLElement | null>(null);

function scalePrefaceText() {
    const el = prefaceEl.value;
    if (!el || !el.parentElement) return;

    // reset transform
    el.style.transform = 'scaleX(1)';
    const parentWidth = el.parentElement.clientWidth;
    const actualWidth = el.scrollWidth;

    if (actualWidth > 0) {
        const scaleX = parentWidth / actualWidth;
        el.style.transform = `scaleX(${scaleX})`;
    }
}

let resizeObserver: ResizeObserver;

onMounted(async () => {
    // Load excerpts data first
    await loadExcerpts();

    const currentStateIndex = parseInt(new URLSearchParams(location.search).get("index") || '');

    // Check if it's a valid index (either in excerpts array or a special excerpt)
    const isValidIndex = !isNaN(currentStateIndex) && getAllValidIndices().includes(currentStateIndex);

    if (isValidIndex) {
        replaceToSpecifiedExcerpt(currentStateIndex);
        // URL already has the correct index, no need to call replaceToSpecifiedExcerpt
    } else {
        refresh();
    }

    document.addEventListener('keyup', handleKeyUp); // Register key up event

    // preface text scaling
    scalePrefaceText();

    resizeObserver = new ResizeObserver(() => {
        scalePrefaceText();
    });

    if (prefaceEl.value?.parentElement) {
        resizeObserver.observe(prefaceEl.value.parentElement);
    }

    // end
});

onBeforeUnmount(() => {
    document.removeEventListener('keyup', handleKeyUp); // Clean up the event listener

    // disconnect the resize observer
    resizeObserver?.disconnect();
});
</script>

<template>
    <main>
        <header>
            <a href="https://github.com/Shikochin/losted" class="title"><i class="fa-light fa-pen-nib"></i> Losted</a>
            <span id="preface" ref="prefaceEl">我的爱，我的认同与我一切的不能忘</span>
        </header>
        <ExcerptDisplay :excerpt="excerpt" />
        <ExcerptController :index="index" :total="excerptsLength" :can-navigate-left="canNavigateLeft"
            :can-navigate-right="canNavigateRight" @navigate="navigateToNearestExcerpt" @refresh="refresh" />
        <Giscus class="giscus" repo="Shikochin/losted" repo-id="R_kgDOLG1jNA" category="Comments"
            category-id="DIC_kwDOLG1jNM4CpT6k" mapping="specific" :term="index.toString()" strict="1"
            reactions-enabled="1" emit-metadata="1" input-position="top" theme="fro" lang="en" loading="lazy"></Giscus>
        <footer>
            Commit ID:
            <CommitID />
            <br />
            Excerpts are attributed to the author<br />
            2024-present by <a id="author" href="https://github.com/Shikochin" target="_blank">@Shikochin</a>
        </footer>
    </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:wght@400&family=Noto+Serif+SC:wght@400&display=swap');

#author {
    text-decoration: underline;
}

header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 3vw;
    margin-bottom: 8vh;
}

.title {
    display: inline-block;
    text-decoration: none;
    font-size: 1em;
    margin-bottom: 0.5em;
}

#preface {
    font-size: 20px;
    white-space: nowrap;
    display: inline-block;
    transform-origin: left center;
    line-height: 0;
}

main {
    font-family: 'Instrument Serif', 'Noto Serif SC', serif;
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