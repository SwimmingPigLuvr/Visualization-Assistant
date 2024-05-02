<script lang="ts">
    import MessageTools from './MessageTools.svelte';
    import { blur, fade, fly, slide } from "svelte/transition";
    import { currentThread, userPfp, assistantPfp, userNameStore, messagesStore, isThinking } from "$lib/stores";
    import { get } from "svelte/store";
    import { cubicInOut } from 'svelte/easing';
    import { SignedIn } from 'sveltefire';
    import type { Event, Message, Events, MessageEvent, Delta, ContentDelta } from '$lib/types';
    import { createAndRun, retrieveAndRun } from '$lib/api';

    let events: Events = [];

    const username = get(userNameStore);
    let threadID: string | undefined = get(currentThread);
    let userInput: string = '';

    $: isTouched = userInput.length > 0;

    // adapt these for useAssistant() (doesn't exist for svelte yet)
    // const { input, handleSubmit, messages } = useChat();


    async function handleSubmit (userInput: string) {
        if (!userInput) return;

        // if no thread => createAndRun
        if ($currentThread === '') {

            // userInput as first message
            const initialMessage: Message = {
                id: 'initial message',
                content: userInput,
                role: 'user',
                createdAt: new Date()
            }

            // set initial message first
            messagesStore.set([initialMessage, ...$messagesStore]);

            // create & run new Thread
            createAndRun(userInput);

            // reset input
            userInput = '';
        }

        // if thread => run
        if ($currentThread !== '') {
            retrieveAndRun($currentThread, userInput);
        }
    }



    // run existing thread
    

    

    // create and run new thread
    








    // show suggested prompts
    // implement prompts on click
    function useExamplePrompt(examplePrompt: string) {
        userInput = examplePrompt
    }

    const randomPrompts = [
        {
            prompt: '$100,000 monthly recurring profit',
            details: 'from my online business with 0 employees'
        },
        {
            prompt: 'i want to make it into the NBA',
            details: 'so i can ball out on my haters'
        },
        {
            prompt: 'Perfect health',
            details: 'so that I can do the things I want to do'
        },
        {
            prompt: 'A fully recovered knee',
            details: 'full flexibility and range of motion in my knee so that i can skate'
        }
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

    
    $: userProfilePicture = get(userPfp);
    $: assistantProfilePicture = get(assistantPfp);
    const defaultPfp = 'images/default.png';

    // use correct pfp for users/assistants
    function getImageUrl(message: Message) {
        if (message.role === 'user') {
            return userProfilePicture;
        } else if (message.role === 'assistant') {
            return assistantProfilePicture;
        }
        return defaultPfp;
    }

</script>

<SignedIn let:user>
    <div class="w-full m-auto flex flex-col space-y-4 overflow-y-auto overflow-x-hidden">

        <!-- chat -->
        <div id="chat-container" class="p-2 fixed h-[84vh] w-full my-20 pb-20 text-xl tracking-tight overflow-x-hidden overflow-y-auto">
            {#if $isThinking}
               <img class="fixed left-1/2 -translate-x-1/3 top-1/2 rounded-full animate-bounce" src="/pfps/gigaBubble.png" alt=""> 
            {/if}
            {#if threadID}
                <div class="thread-id-display">
                    Thread ID: {threadID}
                </div>
            {/if}


            {#if $messagesStore.length > 0}
                <ul class="max-w-xl mx-auto p-2">
                    {#each $messagesStore as message, index}
                        <div class="{message.role === 'user' ? '' : ''} my-4">
                            <li class="relative px-8">
                                <img class="transform transition-all duration-500 ease-in-out rounded-xl w-6 h-6 sm:w-10 sm:h-10 absolute border-white border-[1px] sm:border-2 -left-1 sm:-left-6" src={getImageUrl(message)} alt={message.role}>
                                <span class="{message.role === 'user' ? '' : ''} capitalize font-bold">
                                    {#if message.role === 'user'}
                                        {username}
                                    {:else}
                                        {message.role}
                                    {/if}
                                </span>
                                <br>
                                {#if message.role === 'assistant'}
                                    <div class="">
                                        <span class="font-mono italic leading-8">
                                            {message.content}

                                            {#if $isThinking}
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

                                    <MessageTools message={message.content}/>
                                {/if}
                            </li>
                        </div>

                        <!-- hide line under last message -->
                        {#if index !== $messagesStore.length - 1}
                            <!-- <hr class="my-4 margin auto"> -->
                        {/if}
                    {/each}
                </ul>
            {:else}
                <div class="w-full h-screen flex flex-col items-center space-y-4">
                    <h2 class="font-mono p-8 absolute bottom-40 md:bottom-24 -tracking-widest font-black text-3xl text-center">What would you like to visualize today?</h2>
                </div>
                
            {/if}
        </div>
        
        

        {#if $messagesStore.length === 0}

            <!-- example prompts -->
            <form on:submit={() => handleSubmit(userInput)} class="max-w-3xl left-1/2 -translate-x-1/2 text-sm flex w-full flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0 absolute bottom-16 px-2">
                <button 
                    on:click={() => useExamplePrompt(randomSelectedPromptsAsStrings[0])} 
                    class="hover:bg-gray-900 rounded-lg p-3 border-neutral-700 border-[1px] w-full md:w-1/2 text-left focus:ring-0 outline-none bg-black flex flex-col">
                    <span class="text-white">{randomSelectedPrompts[0]?.prompt}</span>
                    <span class="text-gray-500">{randomSelectedPrompts[0]?.details}</span>
                </button>
                <button 
                    on:mouseenter={() => showSubmitButton = true}
                    on:mouseleave={() => showSubmitButton = false}
                    on:click={() => useExamplePrompt(randomSelectedPromptsAsStrings[1])} 
                    class="hover:bg-gray-900 rounded-lg p-3 border-neutral-700 border-[1px] w-full md:w-1/2 text-left focus:ring-0 outline-none bg-black flex flex-col items-start">
                    
                    <span class="text-white">{randomSelectedPrompts[1]?.prompt}</span>
                    <span class="text-gray-500">{randomSelectedPrompts[1]?.details}</span>

                </button>
            </form>
        {/if}

        

        <!-- create and run thread -->
        <form on:submit={() => createAndRun(userInput)} class="flex max-w-3xl items-center justify-between p-2 fixed left-1/2 -translate-x-1/2 bottom-0 w-full my-2">
            <input bind:value={userInput} placeholder="Input message..." class="w-full focus:ring-0 outline-none bg-black rounded-lg relative p-3 border-neutral-700 border-[1px] overflow-x-hidden overflow-y-auto">
            <!-- submit button -->
            <button type="submit" class="{isTouched ? 'bg-white text-black hover:bg-neutral-400 ' : 'bg-neutral-700 text-neutral-800'}  w-8 h-8 absolute right-4 rounded-lg text-2xl flex items-center justify-center transform transition-all duration-500 ease-in-out">⏎</button>
        </form>

        <!-- chat completions input -->
        <!-- <form on:submit={handleSubmit} class="flex max-w-3xl items-center justify-between p-2 fixed left-1/2 -translate-x-1/2 bottom-0 w-full my-2">
            <input bind:value={$input} placeholder="Input message..." class="w-full focus:ring-0 outline-none bg-black rounded-lg relative p-3 border-neutral-700 border-[1px] overflow-x-hidden overflow-y-auto">
            <button type="submit" class="w-8 h-8 absolute right-4 rounded-lg bg-neutral-700 text-neutral-800 text-2xl flex items-center justify-center">⏎</button>
        </form> -->
    </div>

</SignedIn>