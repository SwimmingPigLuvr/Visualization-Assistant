<!-- chat.svelte -->
<script lang="ts">
    import MessageTools from "./MessageTools.svelte";
    import {
        currentThread,
        assistantPfp,
        messagesStore,
        isThinking,
        currentRun,
        partialMessage,
        inputFocused,
        currentTechnique,
        showPricingTable,
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
    import { onDestroy, onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import PricingTable from "./PricingTable.svelte";
    import { cubicInOut } from "svelte/easing";
    import Techniques from "./Techniques.svelte";
    import { tweened } from "svelte/motion";
    import XiWidget from "./XiWidget.svelte";

    let showMode = false;

    let mode: string;
    let positionStore;
    let position = 0;
    let cleanup: (() => void) | null = null;

    const modeMap: { [key: string]: string } = {
        visualize: "visualize your future.",
        revise: "revise your past.",
        script: "rehearse your future.",
        affirm: "affirm it has been done.",
        remember: "I remember when...",
        meditate: "improve your focus.",
    };

    $: mode = modeMap[$currentTechnique] || "";

    $: {
        if (cleanup) cleanup();

        positionStore = tweened(0, { easing: cubicInOut, duration: 2000 });
        cleanup = positionStore.subscribe(
            (val) => (position = Math.round(val)),
        );

        positionStore.set(mode.length);
    }

    onDestroy(() => {
        if (cleanup) cleanup();
    });

    let textareaElement: HTMLElement | null = null;

    $: if ($inputFocused) {
        textareaElement?.focus();
    }

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

    let shouldAutoScroll = true;

    function scrollToBottom() {
        if (browser && shouldAutoScroll) {
            const container = document.getElementById("chat-container");
            if (container) {
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: "instant",
                });
            }
        }
    }

    function handleManualScroll() {
        shouldAutoScroll = false;
    }

    function initializeAutoScroll() {
        if (browser) {
            const container = document.getElementById("chat-container");
            if (container) {
                container.addEventListener("scroll", handleManualScroll);
            }
        }
    }

    onMount(() => {
        setTimeout(() => {
            showMode = true;
        }, 1000);

        if (browser) {
            initializeAutoScroll();
            textareaElement = document.getElementById("textareaElement");
        }
        inputFocused.set(true);

        const urlThreadID = $page.url.searchParams.get("thread");
        if (urlThreadID) {
            currentThread.set(urlThreadID);
        }
    });

    $: if ($partialMessage.content !== "") {
        shouldAutoScroll = true;
        setTimeout(scrollToBottom, 100);
    }

    $: if ($messagesStore.length > 0) {
        shouldAutoScroll = true;
        setTimeout(scrollToBottom, 100);
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

        shouldAutoScroll = true;
        setTimeout(scrollToBottom, 100);
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

    // come up with 10 more of these ideal wishes that might appeal to people
    const randomPrompts = [
        {
            prompt: "$100,000 monthly recurring profit",
            details: "from my online business with 0 employees",
        },
        {
            prompt: "To be the #1 NBA draft pick",
            details: "so i can ball out on my haters",
        },
        {
            prompt: "Perfect health",
            details: "so that I can do the things I want to do",
        },
        {
            prompt: "A fully recovered knee",
            details: "full flexibility and range of motion",
        },
        {
            prompt: "My dream house by the ocean",
            details: "private beach and stunning sunset views",
        },
        {
            prompt: "Financial freedom and independence",
            details: "never having to worry about money again",
        },
        {
            prompt: "The perfect romantic relationship",
            details: "with my dream partner",
        },
        {
            prompt: "My own successful podcast",
            details: "with millions of listeners",
        },
        {
            prompt: "Unshakeable confidence",
            details: "feeling comfortable in any situation",
        },
        {
            prompt: "Travel the world",
            details: "for a full year",
        },
        {
            prompt: "Write a bestselling book",
            details: "that inspires people and changes lives",
        },
        {
            prompt: "Master a new language fluently",
            details: "speaking Spanish like a native speaker",
        },
        {
            prompt: "Raise $1,000,000",
            details: "for my nonprofit",
        },
        {
            prompt: "Lose 50 pounds and get in shape",
            details: "by fixing my metabolism",
        },
    ];

    // Shuffle array function
    function shuffleArray(array: any[]) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Shuffle all prompts and display them in random order
    const shuffledPrompts = shuffleArray(randomPrompts);
</script>

<!-- pricing table -->
{#if $showPricingTable}
    <PricingTable />
{/if}

<Techniques isDropdown />

<XiWidget />

<div
    class="fixed top-0 left-0 py-16 w-full m-auto items-center justify-center flex flex-col h-screen"
>
    <!-- chat -->
    <div
        id="chat-container"
        class="bg-opacity-100 relative h-full m-auto p-2 w-full text-xl tracking-tight overflow-x-hidden overflow-y-auto"
    >
        <!-- if there is at least one message -->
        {#if $messagesStore.length > 0}
            <ul class="max-w-xl sm:max-w-2xl mx-auto py-0">
                {#each $messagesStore as message, index}
                    <div class="my-4 flex justify-end">
                        <li
                            class="relative rounded-lg p-2 {message.role ===
                            'user'
                                ? 'p-2 max-w-[80%] ml-auto bg-black bg-opacity-50 backdrop-blur-xl'
                                : 'pl-8 pt-4 mr-auto'} "
                        >
                            <div
                                class="font-mono text-sm leading-6 sm:leading-loose"
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
                                        {index}
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
                    <div class="my-4 py-6">
                        <li class="relative px-8">
                            <!-- <span class="capitalize font-bold">Assistant</span>
                            <br /> -->
                            <img
                                class="rounded-full w-8 h-8 sm:w-10 sm:h-10 absolute -top-2 -left-2 sm:-left-6 transform transitino-all duration-500 ease-in-out"
                                src={$assistantPfp}
                                alt="assistant pfp"
                            />

                            <div class="">
                                <span class="font-mono text leading-10">
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

            <!-- can't see right now -->
            <h2
                class="text-opacity-90 font-mono text-dreamy leading-[1] my-4 text-[2rem] m-auto absolute -translate-x-1/2 sm:top-1/3 top-10 left-1/2 text-center"
            >
                {mode.slice(0, position)}
            </h2>
        {/if}
    </div>

    <!-- input -->
    <div class=" max-w-3xl w-full fixed bottom-2 left-1/2 -translate-x-1/2">
        {#if $messagesStore.length === 0}
            <!-- example prompts -->
            <div class="w-full">
                <div
                    class="flex space-x-2 overflow-x-auto overflow-y-hidden scroll-smooth pb-2 scrollbar-hide"
                    style="scrollbar-width: none; -ms-overflow-style: none;"
                >
                    {#each shuffledPrompts as prompt, index}
                        <button
                            type="button"
                            on:click={() =>
                                useExamplePrompt(
                                    `${prompt.prompt} ${prompt.details}`,
                                )}
                            class="flex-shrink-0 min-w-[280px] max-w-[320px]
                            hover:bg-gray-900 rounded-lg p-3 border-slate-500
                            border-[1px] text-left focus:ring-0 outline-none
                            bg-black bg-opacity-50 transition-all duration-200
                            hover:border-slate-400 flex flex-col"
                        >
                            <span class="text-white text-sm font-medium mb-1">
                                {prompt.prompt}
                            </span>
                            <span class="text-gray-400 text-xs">
                                {prompt.details}
                            </span>
                        </button>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- user input -->
        <!-- focus on this @textarea -->
        <form
            on:submit|preventDefault={() => handleSubmit()}
            class="flex items-center justify-between w-full"
        >
            <!-- allow more height for long inputs stay normal height for normal inputs -->
            <textarea
                id="textareaElement"
                bind:value={$userInput}
                placeholder="send message"
                rows={rows || 1}
                on:keydown={handleKeyDown}
                class="resize-none w-full pr-12 focus:ring-0 outline-none bg-black
                bg-opacity-50 rounded-lg relative p-4 border-slate-500 border-[1px]
                overflow-y-auto max-h-40"
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

<style>
    /* Hide scrollbar for Chrome, Safari and Opera */
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    .scrollbar-hide {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
    }
</style>
