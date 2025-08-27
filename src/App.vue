<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import ExcerptDisplay from './components/ExcerptDisplay.vue';
import ExcerptController from './components/ExcerptController.vue';
import CommitID from './components/CommitID.vue';

// Lazy load Giscus component
const Giscus = defineAsyncComponent({
  loader: () => import('@giscus/vue').then(module => module.default),
  delay: 200,
  timeout: 10000,
  errorComponent: () => '<div>Comments failed to load</div>',
  loadingComponent: () => '<div>Loading comments...</div>'
});

// Lazy load excerpts data
const excerpts = ref<Array<{ content: string[]; author: string; source?: string }>>([]);
let excerptsLoaded = false;

// Computed property for excerpts length
const excerptsLength = computed(() => excerpts.value.length);

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

// Get a random excerpt index that is not the same as the current one
function getRandomExcerpt(): number {
    if (excerpts.value.length === 0) return 0;
    let _index: number;
    do {
        _index = Math.floor(Math.random() * excerpts.value.length);
    } while (_index === index.value);
    return _index;
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
    index.value = getRandomExcerpt();
}

// Handle key up events for navigation and refresh
function handleKeyUp(e: KeyboardEvent) {
    switch (e.key) {
        case 'ArrowLeft':
            if (index.value > 0) replaceToSpecifiedExcerpt(index.value - 1);
            break;
        case 'ArrowRight':
            if (index.value < excerpts.value.length - 1) replaceToSpecifiedExcerpt(index.value + 1);
            break;
        case 'r':
            refresh();
            break;
    }
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
    if (!isNaN(currentStateIndex) && currentStateIndex < excerpts.value.length) {
        index.value = currentStateIndex;
    } else {
        index.value = getRandomExcerpt();
    }
    replaceToSpecifiedExcerpt(index.value);

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
        <ExcerptController :index="index" :total="excerptsLength" @navigate="replaceToSpecifiedExcerpt"
            @refresh="refresh" />
        <Giscus repo="Shikochin/losted" repo-id="R_kgDOLG1jNA" category="Comments" category-id="DIC_kwDOLG1jNM4CpT6k"
            mapping="specific" :term="index.toString()" strict="1" reactions-enabled="1" emit-metadata="1"
            input-position="top" theme="fro" lang="en" loading="lazy"></Giscus>
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
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:wght@400&family=Noto+Serif+SC:wght@400&display=swap');

header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    /* 或 center 看你希望对齐方式 */
    font-size: 3vw;
    margin-bottom: 8vh;
}

.title {
    display: inline-block;
    text-decoration: none;
    color: black;
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