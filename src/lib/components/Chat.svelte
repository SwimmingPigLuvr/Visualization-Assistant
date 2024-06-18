<script lang="ts">
    import MessageTools from "./MessageTools.svelte";
    import { blur, fade } from "svelte/transition";
    import {
        currentThread,
        assistantPfp,
        messagesStore,
        isThinking,
        currentRun,
        partialMessage,
        inputFocused,
        currentTechnique,
        customInstruct,
        showPricingTable,
        showStats,
        signInModalOpen,
    } from "$lib/stores";
    import { get, writable } from "svelte/store";
    import type { Message } from "$lib/types";
    import {
        cancelRun,
        createAndRun,
        createMessage,
        formatText,
        getThreadMessages,
        run,
    } from "$lib/api";
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import PricingTable from "./PricingTable.svelte";
    import VoiceData from "./VoiceData.svelte";
    import { cubicIn, cubicInOut, cubicOut } from "svelte/easing";
    import Techniques from "./Techniques.svelte";
    import { SignedIn } from "sveltefire";

    let hTwo = false;

    let mode: string;

    const modeMap: { [key: string]: string } = {
        visualization: "Visualize your future",
        meditation: "meditate on",
        revision: "Revise an event from your past",
        affirmation: "affirm your desire has been fulfilled",
    };

    $: mode = modeMap[$currentTechnique] || "";

    let textareaElement: HTMLElement | null = null;

    $: if ($inputFocused) {
        textareaElement?.focus();
    }

    onMount(() => {
        hTwo = true;
        if (browser) {
            textareaElement = document.getElementById("textareaElement");
        }
        inputFocused.set(true);

        const urlThreadID = $page.url.searchParams.get("thread");
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
    let userInput = writable<string>("");

    $: isTouched = $userInput.length > 0;
    $: inputLength = $userInput.length;

    $: rows = Math.ceil(inputLength / 71);

    // adapt these for useAssistant() (doesn't exist for svelte yet)
    // const { input, handleSubmit, messages } = useChat();

    let currentlyScrolling = false;
    $: if ($partialMessage) {
        if (browser) {
            const container = document.getElementById("chat-container");
            if (container) {
                container.addEventListener("scroll", () => {
                    currentlyScrolling = true;
                });
                if (!currentlyScrolling) {
                    container.scrollTop = container.scrollHeight;
                }
            }
        }
    }

    async function handleSubmit() {
        sendTooltip = false;
        if (!$userInput) return;

        // if no thread, create & run new thread
        if ($currentThread === "") {
            // set userinput as first message
            const initialMessage: Message = {
                id: "initial message",
                content: $userInput,
                role: "user",
                createdAt: new Date(),
            };

            messagesStore.set([initialMessage, ...$messagesStore]);

            // use custom instructions
            // create & run new Thread
            createAndRun($userInput);

            // reset input
            userInput.set("");
        }

        // if thread => run
        if ($currentThread !== "") {
            // retrieve thread
            console.log("running and creating message please");
            createMessage($userInput, $currentThread);
            run($currentThread);
            userInput.set("");
        }
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    }

    // show suggested prompts
    // implement prompts on click
    function useExamplePrompt(examplePrompt: string) {
        $userInput = examplePrompt;
    }

    const randomPrompts = [
        {
            prompt: "$100,000 monthly recurring profit",
            details: "from my online business with 0 employees",
        },
        {
            prompt: "i want to make it into the NBA",
            details: "so i can ball out on my haters",
        },
        {
            prompt: "Perfect health",
            details: "so that I can do the things I want to do",
        },
        {
            prompt: "A fully recovered knee",
            details:
                "full flexibility and range of motion in my knee so that i can skate",
        },
    ];

    function getRandomPrompts(numberOfPrompts: number) {
        let promptsCopy = [...randomPrompts];
        let selectedPrompts = [];

        const maxPrompts = Math.min(numberOfPrompts, randomPrompts.length);

        for (let i = 0; i < maxPrompts; i++) {
            const randomIndex = Math.floor(
                Math.random() * (promptsCopy.length - i),
            );

            [
                promptsCopy[randomIndex],
                promptsCopy[promptsCopy.length - 1 - i],
            ] = [
                promptsCopy[promptsCopy.length - 1 - i],
                promptsCopy[randomIndex],
            ];

            selectedPrompts.push(promptsCopy.pop());
        }

        return selectedPrompts;
    }

    const randomSelectedPrompts = getRandomPrompts(2);
    const randomSelectedPromptsAsStrings = [
        `${randomSelectedPrompts[0]?.prompt}` +
            ` ` +
            `${randomSelectedPrompts[0]?.details}`,
        `${randomSelectedPrompts[1]?.prompt}` +
            ` ` +
            `${randomSelectedPrompts[1]?.details}`,
    ];

    let showSubmitButton = false;
</script>

<!-- <SignedIn let:user> -->

<!-- pricing table -->
{#if $showPricingTable}
    <PricingTable />
{/if}

<SignedIn>
    <Techniques isDropdown />
</SignedIn>

<div
    class="fixed top-0 left-0 py-16 w-full m-auto items-center justify-center flex flex-col h-screen"
>
    <!-- chat -->
    <div
        id="chat-container"
        class="relative h-full m-auto p-2 w-full text-xl tracking-tight overflow-x-hidden overflow-y-auto"
    >
        <!-- if there is at least one message -->
        {#if $messagesStore.length > 0}
            <ul class="max-w-xl sm:max-w-2xl mx-auto py-0">
                {#each $messagesStore as message, index}
                    <div
                        in:fade={{ duration: 1500 }}
                        class="my-4 flex justify-end"
                    >
                        <li
                            class="relative rounded-2xl p-2 {message.role ===
                            'user'
                                ? 'p-4 max-w-[80%] ml-auto bg-black bg-opacity-50 backdrop-blur-xl'
                                : 'pl-8 pt-4 mr-auto'} "
                        >
                            <div
                                class="font-mono text-[0.9rem] sm:text-[1.1rem] leading-6 sm:leading-8"
                            >
                                {#if message.role === "assistant"}
                                    <img
                                        class="transform transition-all duration-500 ease-in-out rounded-full w-8 h-8 sm:w-10 sm:h-10 absolute top-3 -left-2 sm:-left-6"
                                        src={$assistantPfp}
                                        alt="assistant"
                                    />

                                    {@html formatText(message.content)}

                                    <MessageTools
                                        message={formatText(message.content)}
                                    />
                                {:else}
                                    <!-- user message -->
                                    {message.content}
                                {/if}
                            </div>
                        </li>
                    </div>

                    <!-- hide line under last message -->
                {/each}

                <!-- incoming response -->
                {#if $partialMessage.content !== ""}
                    <div class="my-4">
                        <li class="relative px-8">
                            <!-- <span class="capitalize font-bold">Assistant</span>
                            <br /> -->

                            <div class="">
                                <span class="font-mono text-[1rem] leading-7">
                                    {#if $isThinking}
                                        <span class=""
                                            >{@html formattedPartial}</span
                                        >
                                        <img
                                            class="w-4 h-4 rounded-full animate-pulse inline-block"
                                            src="/icons/gigaBubble.png"
                                            alt=""
                                        />
                                    {/if}
                                </span>
                            </div>
                        </li>
                    </div>
                {/if}
            </ul>
        {:else if !$signInModalOpen}
            <!-- message in the middle -->
            <!-- set based on mode -->
            {#if hTwo}
                <h2
                    in:fade={{ delay: 500, duration: 1500, easing: cubicOut }}
                    class="leading-[3.3rem] text-glow uppercase my-4 text-[4rem] absolute top-1/4 left-1/2 -translate-x-1/2 font-black -tracking-widest text-center"
                >
                    {mode}
                </h2>
            {/if}
        {/if}
    </div>

    <!-- input -->
    <div class=" max-w-3xl w-full fixed bottom-0 left-1/2 -translate-x-1/2">
        {#if $messagesStore.length === 0}
            <!-- example prompts -->
            <form
                on:submit={() => handleSubmit()}
                class="text-sm flex w-full flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0 px-2"
            >
                <button
                    on:click={() =>
                        useExamplePrompt(randomSelectedPromptsAsStrings[0])}
                    class="hover:bg-gray-900 rounded-lg p-3 border-slate-500 border-[1px] w-full md:w-1/2 text-left focus:ring-0 outline-none bg-black bg-opacity-50 flex flex-col"
                >
                    <span class="text-white"
                        >{randomSelectedPrompts[0]?.prompt}</span
                    >
                    <span class="text-gray-500"
                        >{randomSelectedPrompts[0]?.details}</span
                    >
                </button>
                <button
                    on:mouseenter={() => (showSubmitButton = true)}
                    on:mouseleave={() => (showSubmitButton = false)}
                    on:click={() =>
                        useExamplePrompt(randomSelectedPromptsAsStrings[1])}
                    class="hover:bg-slate-800 rounded-lg p-3 border-slate-500 border-[1px] w-full md:w-1/2 text-left focus:ring-0 outline-none bg-black bg-opacity-50 flex flex-col items-start"
                >
                    <span class="text-white"
                        >{randomSelectedPrompts[1]?.prompt}</span
                    >
                    <span class="text-gray-500"
                        >{randomSelectedPrompts[1]?.details}</span
                    >
                </button>
            </form>
        {/if}

        <!-- user input -->
        <!-- focus on this @textarea -->
        <form
            on:submit|preventDefault={() => handleSubmit()}
            class="flex items-center justify-between p-2 w-full"
        >
            <!-- allow more height for long inputs stay normal height for normal inputs -->
            <textarea
                id="textareaElement"
                bind:value={$userInput}
                placeholder="send message"
                rows={rows || 1}
                on:keydown={handleKeyDown}
                class="resize-none w-full pr-12 focus:ring-0 outline-none bg-black bg-opacity-50 rounded-lg relative p-4 border-slate-500 border-[1px] overflow-y-auto max-h-40"
            ></textarea>

            <!-- submit button -->
            {#if !$isThinking}
                <button
                    on:mouseenter={() => (sendTooltip = true)}
                    on:mouseleave={() => (sendTooltip = false)}
                    type="submit"
                    class="{isTouched
                        ? ' bg-white text-black hover:bg-neutral-400 '
                        : ' bg-neutral-700 text-neutral-800'} w-8 h-8 absolute bottom-5 right-5 rounded-lg text-2xl flex items-center justify-center transform transition-all duration-500 ease-in-out"
                >
                    {#if sendTooltip && isTouched}
                        <span
                            class="text-sm w-32 absolute left-1/2 bottom-10 -translate-x-1/2 tooltip rounded shadow-lg px-2 pt-2 p-1 bg-black bg-opacity-25 border-white border-[1px] backdrop-blur text-white mt-8"
                            >send message</span
                        >
                    {/if}
                    ⏎
                </button>
            {:else}
                <!-- cancel button -->
                {#if $currentRun !== ""}
                    <button
                        on:click={() => cancelRun(threadID, runID)}
                        class="text-black hover:bg-neutral-400 w-8 h-8 absolute bottom-5 right-5 rounded-lg text-2xl flex items-center justify-center transform transition-all duration-500 ease-in-out"
                    >
                        ⏹️
                    </button>
                {/if}
            {/if}
        </form>
    </div>
</div>

<!-- </SignedIn> -->
