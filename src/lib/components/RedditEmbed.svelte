<script lang="ts">
    import { onMount } from 'svelte';

    export let post: { url: string, title: string, author: string, subreddit: string, height: number };

    // Function to create the embed HTML without breaking the Svelte script block
    function createEmbedHtml(post) {
        return `
            <blockquote class="reddit-embed-bq" style="height:${post.height}px" data-embed-height="858">
                <a href="${post.url}">${post.title}</a><br> 
                by <a href="https://www.reddit.com/user/${post.author}/">${post.author}</a> in 
                <a href="https://www.reddit.com/r/${post.subreddit}/">${post.subreddit}</a>
            </blockquote>
        `;
    }

    onMount(() => {
        const script = document.createElement('script');
        script.src = "https://embed.reddit.com/widgets.js";
        script.async = true;
        script.charset = "UTF-8";
        document.body.appendChild(script);
    });


    function html(arg0: HTMLDivElement, arg1: string): any {
        throw new Error('Function not implemented.');
    }
</script>

<div class="reddit-embeds">
    <div class="reddit-embed" use:html={createEmbedHtml(post)}></div>
</div>

<style>
    .reddit-embeds {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
</style>
