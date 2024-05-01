<script lang="ts">
    import Chat from '$lib/components/Chat.svelte';
    import { onMount } from "svelte";
    import { currentThread, messagesStore } from '$lib/stores';
    import { get } from 'svelte/store';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    let params = $page.params;

    let messages: string[] = [];

    async function getThreadMessages(threadID: string) {
        try {
            const response = await fetch('/api/threads/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    threadID: threadID,
                })
            });

            const data = await response.json();
            
            if (data.body?.data) {

                messages = data.body.data.map((message: { content: any[]; }) => message.content?.map(content => content.text?.value).join('') || 'No content');
                messagesStore.set(messages);

                console.log('All messages from threadID:', threadID, messages);

            } else {
                console.log('no messages found or invalid thread id: ', threadID);
            }  
        }
        catch (error) {
            console.error('error fetching thread messages', error);
        }

    }

    // const messages = data.body.data.map((message: { content: any[]; }) => message.content?.map(content => content.text?.value).join('') || 'No content');

    onMount(async () => {
        await getThreadMessages($page.params.threadID);
        // goto(`/chat/${threadID}`);
    });

</script>

{#if messages}
    <ul class="flex flex-col space-y-4 p-4">
        {#each messages as message}
            <li class="even:bg-black even:text-white even:ml-auto odd:bg-white odd:text-black odd:mr-auto">
                {message}
            </li>
        {/each}
    </ul>
{/if}

<Chat />