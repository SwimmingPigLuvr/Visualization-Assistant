<script lang="ts">
    import MessageTools from './MessageTools.svelte';
    import { blur, fade, fly, slide } from "svelte/transition";
    import { currentThread, userPfp, assistantPfp, userNameStore, messagesStore, isThinking, currentRun, partialMessage, completedMessage, userThreads, inputFocused, currentTechnique, customInstruct, showPricingTable, showStats } from "$lib/stores";
    import { get, writable } from "svelte/store";
    import { cubicInOut } from 'svelte/easing';
    import { SignedIn } from 'sveltefire';
    import type { Event, Message, Delta, ContentDelta } from '$lib/types';
    import { cancelRun, createAndRun, createMessage, formatText, getThreadMessages, retrieveAndRun, run } from '$lib/api';
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
    import { text } from '@sveltejs/kit';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import PricingTable from './PricingTable.svelte';


    let textareaElement: HTMLElement | null = null;

    $: if ($inputFocused) {
        textareaElement?.focus();
    }

    onMount(() => {
        if (browser) {
            textareaElement = document.getElementById('textareaElement');
        }
        inputFocused.set(true);

        const urlThreadID = $page.url.searchParams.get('thread');
        if (urlThreadID) {
            currentThread.set(urlThreadID);
        }
    });

    let sendTooltip = false;

    $: if ($currentThread) {
        // insert thread into page params
        getThreadMessages();
        goto(`?thread=${$currentThread}`, { replaceState: true });
    }

    // $: formattedMessage = formatText($completedMessage);
    $: formattedPartial = formatText($partialMessage.content);
    
    let threadID: string | undefined = get(currentThread);
    let runID: string | undefined = get(currentRun);
    let userInput = writable<string>('');

    $: isTouched = $userInput.length > 0;
    $: inputLength = $userInput.length;

    $: rows = Math.ceil(inputLength / 71);


    // adapt these for useAssistant() (doesn't exist for svelte yet)
    // const { input, handleSubmit, messages } = useChat();


    let currentlyScrolling = false;
    $: if ($partialMessage) {
        if (browser) {
            const container = document.getElementById('chat-container');
            if (container) {
                container.addEventListener('scroll', () => {
                    currentlyScrolling = true;
                });
                if (!currentlyScrolling) {
                    container.scrollTop = container.scrollHeight;
                }
            }
        }
    }

    


    async function handleSubmit () {
        sendTooltip = false;
        if (!$userInput) return;

        // if no thread, create & run new thread
        if ($currentThread === '') {

            // set userinput as first message
            const initialMessage: Message = {
                id: 'initial message',
                content: $userInput,
                role: 'user',
                createdAt: new Date()
            }

            messagesStore.set([initialMessage, ...$messagesStore]);

            // use custom instructions
            // create & run new Thread
            createAndRun($userInput);

            // reset input
            userInput.set('');
        }

        // if thread => run
        if ($currentThread !== '') {
            // retrieve thread
            console.log('running and creating message please');
            createMessage($userInput, $currentThread);
            run($currentThread);
            userInput.set('');
        }
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    }

    // show suggested prompts
    // implement prompts on click
    function useExamplePrompt(examplePrompt: string) {
        $userInput = examplePrompt
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

    <!-- pricing table -->
    {#if $showPricingTable}
        <PricingTable />
    {/if}

    <div class=" w-full m-auto flex flex-col space-y-4 overflow-y-auto overflow-x-hidden">

        <!-- chat -->
        <div id="chat-container" class=" p-2 fixed h-[84vh] w-full my-20 pb-20 text-xl tracking-tight overflow-x-hidden overflow-y-auto">
            
            <!-- threadID & runID -->
            {#if $showStats}
                <div class="fixed top-4 left-1/4 -translate-x-1/4 flex flex-col max-w-xl text-left text-xs opacity-50">
                    {#if $currentThread !== ''}
                        <p in:blur>
                            current Thread ID: {$currentThread}
                        </p>
                    {/if}
                    
                    {#if $currentRun !== ''}
                        <p in:blur>
                            Run ID: {$currentRun}
                        </p>
                    {/if}

                    {#if $customInstruct !== ''}
                        Custom Instructions: {$customInstruct}
                    {/if}
                    
                </div>
            {/if}


            <!-- if there is at least one message -->
            {#if $messagesStore.length > 0}
                <ul class="max-w-xl sm:max-w-2xl mx-auto p-2">
                    {#each $messagesStore as message, index}
                        <div class="my-4">
                            <li class="relative px-8">

                                <!-- user / assistant pfp -->
                                <img class="transform transition-all duration-500 ease-in-out rounded-xl w-6 h-6 sm:w-10 sm:h-10 absolute border-white border-[1px] sm:border-2 -left-1 sm:-left-5" src={getImageUrl(message)} alt={message.role}>
                                
                                <!-- user / assistant title -->
                                <span class="{message.role === 'user' ? '' : ''} capitalize font-bold">
                                    {#if message.role === 'user'}
                                        {$userNameStore}
                                    {:else}
                                        {$currentTechnique} {message.role}
                                    {/if}
                                </span>
                                <br>

                                {#if message.role === 'assistant'}
                                    <div class="">
                                        <span class="font-mono text-lg leading-9">
                                            {@html formatText(message.content)}

                                            <!-- im not sure if this block even gets seen -->
                                            <!-- {#if $isThinking && index === $messagesStore.length - 1} -->
                                                <!-- incoming message -->
                                                <!-- <span class="">{@html formattedPartial}</span> -->
                                                <!-- <p class="text-5xl text-cyan-500 text-bold">TEST</p> -->

                                                <!-- thinking icon -->
                                                <!-- <img class="w-4 h-4 rounded-full animate-pulse inline-block" src="/icons/gigaBubble.png" alt=""> -->
                                            <!-- {/if} -->
                                        </span>

                                    </div>
                                {:else}

                                    <!-- user message -->
                                    <span class="font-mono text-lg leading-9">
                                        {message.content}
                                    </span>
                                {/if}

                                {#if message.role !== 'user'}
                                    <MessageTools message={formatText(message.content)}/>
                                {/if}
                            </li>
                        </div>

                        <!-- hide line under last message -->
                        {#if index !== $messagesStore.length - 1}
                            <hr class="my-4 border-white h-[0px] border-[0.5px] margin auto">
                        {/if}
                    {/each}

                    <!-- partial message -->
                    {#if $partialMessage.content !== ''}
                        
                        <div class="my-4">
                            <li class="relative px-8">
                                <img class="transform transition-all duration-500 ease-in-out rounded-xl w-6 h-6 sm:w-10 sm:h-10 absolute border-white border-[1px] sm:border-2 -left-1 sm:-left-6" src={$assistantPfp} alt="assistant">
                                <span class="capitalize font-bold">Assistant</span>
                                <br>

                                <div class="">
                                    <span class="font-mono text-lg leading-9">
                                        {#if $isThinking}
                                            <span class="">{@html formattedPartial}</span>
                                            <img class="w-4 h-4 rounded-full animate-pulse inline-block" src="/icons/gigaBubble.png" alt="">
                                        {/if}
                                    </span>

                                </div>

                            </li>

                        </div>
                    {/if}
                </ul>
            {:else}
                <div class="w-full h-screen flex flex-col items-center space-y-4">
                    <!-- <h2 class="font-mono p-8 absolute bottom-40 md:bottom-24 -tracking-widest font-black text-3xl text-center">What would you like to visualize today?</h2> -->
                </div>
                
            {/if}
        </div>
        
        

        <!-- input -->
        <div class=" max-w-3xl w-full fixed bottom-0 left-1/2 -translate-x-1/2">
            {#if $messagesStore.length === 0}
                <!-- example prompts -->
                <form on:submit={() => handleSubmit()} class="text-sm flex w-full flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0 px-2">
                    <button 
                        on:click={() => useExamplePrompt(randomSelectedPromptsAsStrings[0])} 
                        class="hover:bg-gray-900 rounded-lg p-3 border-slate-500 border-[1px] w-full md:w-1/2 text-left focus:ring-0 outline-none bg-black bg-opacity-50 flex flex-col">
                        <span class="text-white">{randomSelectedPrompts[0]?.prompt}</span>
                        <span class="text-gray-500">{randomSelectedPrompts[0]?.details}</span>
                    </button>
                    <button 
                        on:mouseenter={() => showSubmitButton = true}
                        on:mouseleave={() => showSubmitButton = false}
                        on:click={() => useExamplePrompt(randomSelectedPromptsAsStrings[1])} 
                        class="hover:bg-slate-800 rounded-lg p-3 border-slate-500 border-[1px] w-full md:w-1/2 text-left focus:ring-0 outline-none bg-black bg-opacity-50 flex flex-col items-start">
                        
                        <span class="text-white">{randomSelectedPrompts[1]?.prompt}</span>
                        <span class="text-gray-500">{randomSelectedPrompts[1]?.details}</span>

                    </button>
                </form>
            {/if}
            
            <!-- user input -->
            <!-- focus on this @textarea -->
            <form on:submit|preventDefault={() => handleSubmit()} class="flex items-center justify-between p-2 w-full">

                <!-- allow more height for long inputs stay normal height for normal inputs -->
                <textarea 
                    id="textareaElement"
                    bind:value={$userInput} 
                    placeholder="Input message..." 
                    rows={rows || 1} 
                    on:keydown={handleKeyDown}
                    class="resize-none w-full pr-12 focus:ring-0 outline-none bg-black bg-opacity-50 rounded-lg relative p-4 border-slate-500 border-[1px] overflow-y-auto max-h-40"></textarea>

                <!-- submit button -->
                {#if !$isThinking}
                    <button 
                        on:mouseenter={() => sendTooltip = true}
                        on:mouseleave={() => sendTooltip = false}
                        type="submit" class="{isTouched ? ' bg-white text-black hover:bg-neutral-400 ' : ' bg-neutral-700 text-neutral-800'} w-8 h-8 absolute bottom-5 right-5 rounded-lg text-2xl flex items-center justify-center transform transition-all duration-500 ease-in-out">
                        {#if sendTooltip && isTouched}
                            <span class="text-sm w-32 absolute left-1/2 bottom-10 -translate-x-1/2 tooltip rounded shadow-lg px-2 pt-2 p-1 bg-black bg-opacity-25 border-white border-[1px] backdrop-blur text-white mt-8">send message</span>
                        {/if}
                        ⏎
                    </button>
                {:else}
                    <!-- cancel button -->
                    {#if $currentRun !== ''}
                        <button on:click={() => cancelRun(threadID, runID)} class="text-black hover:bg-neutral-400 w-8 h-8 absolute bottom-5 right-5 rounded-lg text-2xl flex items-center justify-center transform transition-all duration-500 ease-in-out">
                            ⏹️
                        </button>
                    {/if}

                {/if}
            </form>
        </div>
       

        

        

        <!-- chat completions input -->
        <!-- <form on:submit={handleSubmit} class="flex max-w-3xl items-center justify-between p-2 fixed left-1/2 -translate-x-1/2 bottom-0 w-full my-2">
            <input bind:value={$input} placeholder="Input message..." class="w-full focus:ring-0 outline-none bg-black rounded-lg relative p-3 border-neutral-700 border-[1px] overflow-x-hidden overflow-y-auto">
            <button type="submit" class="w-8 h-8 absolute right-4 rounded-lg bg-neutral-700 text-neutral-800 text-2xl flex items-center justify-center">⏎</button>
        </form> -->
    </div>

</SignedIn>