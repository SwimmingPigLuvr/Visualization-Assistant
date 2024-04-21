<script lang="ts">
    import { useChat, type Message } from "ai/svelte";
    import { blur, fade, fly, slide } from "svelte/transition";
    import SpeechButton from "./SpeechButton.svelte";

    const { input, handleSubmit, messages } = useChat();

    function useExamplePrompt(examplePrompt: string) {
        input.set(examplePrompt);
    }

    let isThinking = true;
    
    const userPfp = '/images/remilio.png';
    const assistantPfp = '/images/assistant.png';
    const defaultPfp = 'images/default.png';

    function getImageUrl(message: Message) {
        if (message.role === 'user') {
            return userPfp;
        } else if (message.role === 'assistant') {
            return assistantPfp;
        }
        return defaultPfp;
    }

    const randomPrompts = [
        {
            prompt: '$100,000 monthly recurring profit',
            details: 'from my online business with 0 employees'
        },
        {
            prompt: 'A feeling of gratitude',
            details: 'that I carry with me every second of every day'
        },
        {
            prompt: 'Perfect health',
            details: 'so that I can do the things I want to do'
        },
    ]

    function getRandomPrompts(numberOfPrompts: number) {
        let promptsCopy = [...randomPrompts];
        let selectedPrompts = [];

        const maxPrompts = Math.min(numberOfPrompts, randomPrompts.length);

        for (let i = 0; i < maxPrompts; i++) {
            const randomIndex = Math.floor(Math.random() * (promptsCopy.length - i));

            [promptsCopy[randomIndex], promptsCopy[promptsCopy.length - 1 - i]] =
                [promptsCopy[promptsCopy.length - 1 -i], promptsCopy[randomIndex]];

            selectedPrompts.push(promptsCopy.pop());
        }

        return selectedPrompts;
    }

    const randomSelectedPrompts = getRandomPrompts(2);
    const randomSelectedPromptsAsStrings = [
        `${randomSelectedPrompts[0]?.prompt}` + ` ` + `${randomSelectedPrompts[0]?.details}`,
        `${randomSelectedPrompts[1]?.prompt}` + ` ` + `${randomSelectedPrompts[1]?.details}`,
    ]

    let showSubmitButton = false;
    let copied = false;

    // copyButton
    function handleCopy(text: string) {
        navigator.clipboard.writeText(text);
        copied = true;
    }


</script>


<div class="w-full m-auto flex flex-col space-y-4 overflow-y-auto overflow-x-hidden">

    <!-- chat -->
    <div id="chat-container" class="p-2 pb-20">

        {#if $messages.length > 0}
            <ul class="max-w-xl mx-auto">
                {#each $messages as message, index}
                    <div class="{message.role === 'user' ? '' : ''} my-4">
                        <li class="relative px-8">
                            <img class="rounded-full w-6 h-6 absolute -left-1" src={getImageUrl(message)} alt={message.role}>
                            <span class="{message.role === 'user' ? '' : ''} capitalize font-bold">
                                {message.role}
                            </span>
                            <br>
                            {#if message.role === 'assistant'}
                                <div class="">
                                    <span class="font-mono italic leading-8">
                                        {message.content}

                                        {#if isThinking}
                                            <img class="w-4 h-4 rounded-full animate-pulse inline-block" src="/icons/gigaBubble.png" alt="">
                                        {/if}
                                    </span>

                                </div>
                            {:else}
                                <span class="font-mono leading-8">
                                    {message.content}
                                </span>
                            {/if}

                            {#if message.role !== 'user'}
                                <!-- tools -->
                                <div class="flex space-x-4 mt-2 mb-8">

                                    <!-- text to speech button -->
                                    <SpeechButton message={message.content} />
                                    
                                    <!-- copy to clipboard button -->
                                    <button on:click={() => handleCopy(message.content)} class="opacity-50 hover:opacity-100">
                                        {#if copied}
                                            ✅
                                        {:else}
                                            📋
                                        {/if}
                                    </button>

                                    <!-- regenerate button -->
                                    <button class="opacity-50 hover:opacity-100">↪</button>
                                </div>
                            {/if}
                        </li>
                    </div>

                    <!-- hide line under last message -->
                    {#if index !== $messages.length - 1}
                        <hr class="my-4 margin auto">
                    {/if}
                {/each}
            </ul>
        {:else}
            <div class="w-full flex flex-col items-center space-y-4">
                <img class="w-[50%] max-w-xl" src="/images/background.jpeg" alt="logo">
                <h2 class="font-serif -tracking-widest italic text-2xl text-center">What would you like to visualize?</h2>
            </div>
            
        {/if}
    </div>
    
    

    {#if $messages.length === 0}
        <!-- example prompts -->
        <form on:submit={handleSubmit} class="max-w-3xl left-1/2 -translate-x-1/2 text-sm flex w-full flex-col absolute bottom-16 p-2 space-y-2">
            <button 
                on:click={() => useExamplePrompt(randomSelectedPromptsAsStrings[0])} 
                class="hover:bg-gray-900 rounded-lg p-3 border-neutral-700 border-[1px] w-full focus:ring-0 outline-none bg-black flex flex-col">
                <span class="text-white">{randomSelectedPrompts[0]?.prompt}</span>
                <span class="text-gray-500">{randomSelectedPrompts[0]?.details}</span>
            </button>
            <button 
                on:mouseenter={() => showSubmitButton = true}
                on:mouseleave={() => showSubmitButton = false}
                on:click={() => useExamplePrompt(randomSelectedPromptsAsStrings[1])} 
                class="hover:bg-gray-900 rounded-lg p-3 border-neutral-700 border-[1px] w-full focus:ring-0 outline-none bg-black flex flex-col items-start">
                
                <span class="text-white">{randomSelectedPrompts[1]?.prompt}</span>
                <span class="text-gray-500">{randomSelectedPrompts[1]?.details}</span>

                <!-- submit button -->
                <button type="submit" class="w-8 h-8 absolute right-4 rounded-lg bg-neutral-700 text-neutral-800 text-2xl flex items-center justify-center">⏎</button>
            </button>
        </form>
    {/if}

    

    <!-- input -->
    <form on:submit={handleSubmit} class="flex max-w-3xl items-center justify-between p-2 fixed left-1/2 -translate-x-1/2 bottom-0 w-full my-2">
        <input bind:value={$input} placeholder="Input message..." class="w-full focus:ring-0 outline-none bg-black rounded-lg relative p-3 border-neutral-700 border-[1px]">
        <!-- submit button -->
        <button type="submit" class="w-8 h-8 absolute right-4 rounded-lg bg-neutral-700 text-neutral-800 text-2xl flex items-center justify-center">⏎</button>
    </form>
</div>