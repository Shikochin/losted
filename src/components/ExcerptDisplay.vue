<template>
    <section id="excerpt">
        <p id="content">
            <span v-for="(sentence, idx) in excerpt.content" :key="idx">{{ sentence }}<br /></span>
        </p>
        <cite id="copyright">
            ——
            <span v-if="!excerpt.source">{{ excerpt.author }}</span>
            <a v-if="excerpt.source" :href="excerpt.source" id="source">{{ excerpt.author }}</a>
        </cite>
    </section>
</template>

<script setup lang="ts">
const props = defineProps<{
    excerpt: {
        content: string[];
        author: string;
        source?: string;
    };
}>();
</script>

<style scoped>
#excerpt {
    margin-bottom: 1vh;
}


#content {
    font-size: 4vw;
}

#copyright {
    font-size: 3vw;

}

#source {
    text-decoration-line: underline;
}

@media (max-width: 600px) {
    #content {
        font-size: 8vw;
    }

    #copyright {
        font-size: 6vw;
    }
}

@media (min-width: 1200px) {
    #content {
        font-size: 3vw;
    }

    #copyright {
        font-size: 2vw;
    }
}
</style>
