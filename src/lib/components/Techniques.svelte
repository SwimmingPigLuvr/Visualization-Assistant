<script lang="ts">
    import {
        accountType,
        isMenuOpen,
        currentTechnique,
        showPricingTable,
    } from "$lib/stores";
    import { blur, fade, slide } from "svelte/transition";

    export let isDropdown = false;

    let showRevisionInfo = false;
    let showAffirmationInfo = false;
    let showVisualizationInfo = false;
    let showMeditationInfo = false;

    let showTechniqueModal = false;

    $: if ($isMenuOpen) {
        showTechniqueModal = false;
    }

    let showUpgrade: boolean[] = [];

    function chooseTechnique(technique: string) {
        currentTechnique.set(technique);
        showTechniqueModal = false;
    }

    function toggleTechniqueModal() {
        showTechniqueModal = !showTechniqueModal;
    }
</script>

<!-- dropdown picker  -->
{#if isDropdown}
    <button
        on:click={() => toggleTechniqueModal()}
        class="sm:left-16 z-50 sm:-translate-x-0 relative border-transparent hover:border-white border-[1px] top-3 rounded-lg capitalize left-1/2 -translate-x-1/2 p-2 px-4 bg-black bg-opacity-100 backdrop-blur-xl"
        >{$currentTechnique}
        ✦
    </button>

    <!-- TODO -->
    <!-- implement modal to select the technique -->

    <!-- technique modal -->
    {#if showTechniqueModal}
        <button
            on:click={() => (showTechniqueModal = false)}
            class="cursor-default z-40 w-full h-screen fixed top-0 left-0"
        ></button>
        <div
            in:fade out:fade={{ duration: 100 }}
            class="z-50 absolute top-16 sm:left-4 sm:-translate-x-0 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 rounded-xl border-white border-[1px] backdrop-blur-xl max-w-sm w-[87.5vw] p-2"
        >
            <div class="flex justify-between items-center p-4">
                <p>Technique</p>
                <p>
                    <a
                        href="/education"
                        class="rounded-[100%] h-4 w-4 flex items-center justify-center font-black border-white border-[1px] text-xs"
                        >i</a
                    >
                </p>
            </div>
            <!-- TODO -->
            <!-- list techniques -->
            <!-- add a title and subheading -->

            <div class="flex flex-col w-full">
                <!-- Visualization -->
                <button
                    on:click={() => chooseTechnique("visualization")}
                    class="relative flex items-center justify-start space-x-3 p-4 hover:bg-lime-700 hover:bg-opacity-100 rounded-lg group"
                >
                    <div
                        class="bg-lime-400 bg-opacity-50 group-hover:bg-opacity-100 h-8 w-8 rounded-full"
                    ></div>
                    <div class="flex flex-col text-left">
                        <p class="text-sm font-black">Visualization</p>
                        <!-- description -->
                        <p class="text-xs">Imagine living in the end</p>
                    </div>
                    {#if $currentTechnique === "visualization"}
                        <p class="absolute right-4">✅</p>
                    {/if}
                </button>

                <!-- Revision -->
                <button
                    on:click={() => chooseTechnique("revision")}
                    class="relative flex items-center justify-start space-x-3 p-4 hover:bg-rose-700 hover:bg-opacity-100 rounded-lg group"
                >
                    <div
                        class="bg-rose-400 bg-opacity-50 group-hover:bg-opacity-100 h-8 w-8 rounded-full"
                    ></div>
                    <div class="flex flex-col text-left">
                        <p class="text-sm font-black">Revision</p>
                        <!-- description -->
                        <p class="text-xs">Re-imagine past events</p>
                    </div>
                    {#if $currentTechnique === "revision"}
                        <p class="absolute right-4">✅</p>
                    {/if}
                </button>

                <!-- Affirmation -->
                <button
                    on:click={() => chooseTechnique("affirmation")}
                    class="relative flex items-center justify-start space-x-3 p-4 hover:bg-blue-700 hover:bg-opacity-100 rounded-lg group"
                >
                    <div
                        class="bg-blue-400 bg-opacity-50 group-hover:bg-opacity-100 h-8 w-8 rounded-full"
                    ></div>
                    <div class="flex flex-col text-left">
                        <p class="text-sm font-black">Affirmation</p>
                        <!-- description -->
                        <p class="text-xs">Solidify your beliefs</p>
                    </div>
                    {#if $currentTechnique === "affirmation"}
                        <p class="absolute right-4">✅</p>
                    {/if}
                </button>
            </div>

            <hr class="w-[90%] m-auto" />

            <div
                class="flex items-center text-center justify-center p-4 text-xs"
            >
                <p>More Techniques coming soon!</p>
            </div>
        </div>
    {/if}
{:else}
    <div class="p-2">
        <h2 class="text-xl">Technique</h2>

        <!-- pay now button -->
        <!-- <p>for dev purposes only</p> -->

        {#if $accountType === "paid"}
            <!-- <button class="p-4 bg-sky-700 text-sky-200" on:click={() => accountType.set('free')}>downgrade?</button> -->
            <div
                class="-tracking-widest mt-3 relative p-2 flex flex-wrap gap-2"
            >
                <button
                    class="hover:border-white hover:text-white w-[48%] rounded-xl px-4 p-2 border-[1px] {$currentTechnique ===
                    'visualization'
                        ? 'border-white bg-sky-600 text-white tracking-normal font-bold'
                        : 'border-slate-600 text-slate-600'} transform transition-all duration-300 ease-in-out"
                    on:click={() => chooseTechnique("visualization")}
                >
                    Visualization
                </button>
                <button
                    class="hover:border-white hover:text-white w-[48%] rounded-xl px-4 p-2 border-[1px] {$currentTechnique ===
                    'revision'
                        ? 'border-white bg-lime-600  text-white tracking-normal font-bold'
                        : 'border-slate-600 text-slate-600'} transform transition-all duration-300 ease-in-out"
                    on:click={() => chooseTechnique("revision")}
                >
                    Revision
                </button>
                <button
                    class="hover:border-white hover:text-white w-[48%] rounded-xl px-4 p-2 border-[1px] {$currentTechnique ===
                    'affirmation'
                        ? 'border-white bg-rose-600  text-white tracking-normal font-bold'
                        : 'border-slate-600 text-slate-600'} transform transition-all duration-300 ease-in-out"
                    on:click={() => chooseTechnique("affirmation")}
                >
                    Affirmation
                </button>
                <button
                    class="hover:border-white hover:text-white w-[48%] rounded-xl px-4 p-2 border-[1px] {$currentTechnique ===
                    'meditation'
                        ? 'border-white bg-fuchsia-600 bg-opacity-100  text-white tracking-normal font-bold'
                        : 'border-slate-600 text-slate-600'} transform transition-all duration-300 ease-in-out"
                    on:click={() => chooseTechnique("meditation")}
                >
                    Meditation
                </button>
                <input
                    type="text"
                    class="w-full rounded-xl bg-transparent px-4 p-2 border-slate-600 border-[1px] {$currentTechnique ===
                    'custom'
                        ? 'bg-white text-black'
                        : 'text-slate-300'} transform transition-all duration-300 ease-in-out"
                    on:click={() => chooseTechnique("custom")}
                    placeholder="custom"
                />
            </div>
        {:else if $accountType === "free"}
            <!-- <button on:click={() => accountType.set('paid')}>upgrade for free?</button> -->
            <div
                class="-tracking-widest mt-3 relative p-2 flex flex-wrap gap-2"
            >
                <button
                    on:click={() => showPricingTable.set(true)}
                    class="text-center m-auto text-slate-500 text-sm hover:text-slate-300"
                    >Upgrade account to access advanced features</button
                >
                <button
                    class="w-[48%] rounded-xl px-3 p-1 bg-black bg-opacity-30 border-white text-white border-[1px]"
                    on:click={() => chooseTechnique("visualization")}
                >
                    Visualization
                </button>
                <button
                    on:mouseenter={() => (showUpgrade[0] = true)}
                    on:mouseleave={() => (showUpgrade[0] = false)}
                    class="w-[48%] relative rounded-xl px-3 p-1 bg-slate-800 border-slate-600 text-slate-600 border-[1px]"
                    on:click={() => showPricingTable.set(true)}
                >
                    🔒 Revision
                    {#if showUpgrade[0]}
                        <span
                            class="text-sm w-40 absolute left-1/2 bottom-10 -tracking-wide -translate-x-1/2 tooltip rounded shadow-lg p-2 bg-black text-lime-600"
                            >Upgrade account to unlock <span class="text-white"
                                >Revisions</span
                            ></span
                        >
                    {/if}
                </button>
                <button
                    on:mouseenter={() => (showUpgrade[1] = true)}
                    on:mouseleave={() => (showUpgrade[1] = false)}
                    class="w-[48%] relative rounded-xl px-3 p-1 bg-slate-800 border-slate-600 text-slate-600 border-[1px]"
                    on:click={() => showPricingTable.set(true)}
                >
                    🔒 Affirmation
                    {#if showUpgrade[1]}
                        <span
                            class="text-sm w-40 absolute left-1/2 bottom-10 -tracking-wide -translate-x-1/2 tooltip rounded shadow-lg p-2 bg-black text-lime-600"
                            >Upgrade account to unlock <span class="text-white"
                                >Affirmations</span
                            ></span
                        >
                    {/if}
                </button>
                <button
                    on:mouseenter={() => (showUpgrade[2] = true)}
                    on:mouseleave={() => (showUpgrade[2] = false)}
                    class="w-[48%] relative rounded-xl px-3 p-1 bg-slate-800 border-slate-600 text-slate-600 border-[1px]"
                    on:click={() => showPricingTable.set(true)}
                >
                    🔒 Meditation
                    {#if showUpgrade[2]}
                        <span
                            class="text-sm w-40 absolute left-1/2 bottom-10 -tracking-wide -translate-x-1/2 tooltip rounded shadow-lg p-2 bg-black text-lime-600"
                            >Upgrade account to unlock <span class="text-white"
                                >Meditations</span
                            ></span
                        >
                    {/if}
                </button>
                <input
                    type="text"
                    on:mouseenter={() => (showUpgrade[3] = true)}
                    on:mouseleave={() => (showUpgrade[3] = false)}
                    class="w-full relative rounded-xl px-3 p-1 bg-slate-800 border-slate-600 text-slate-600 border-[1px]"
                    placeholder="🔒 custom"
                    on:click={() => showPricingTable.set(true)}
                />
                {#if showUpgrade[3]}
                    <span
                        class="text-center text-sm w-40 left-1/2 -translate-x-1/2 absolute bottom-12 -tracking-wide tooltip rounded shadow-lg p-2 bg-black text-lime-600"
                        >Upgrade account to unlock <p class="text-white">
                            Custom Techniques
                        </p></span
                    >
                {/if}
            </div>
        {/if}
        <div class="p-2 w-full flex justify-start items-end">
            <a href="/education" class="group flex items-center space-x-2"
                ><span
                    class="rounded-[100%] h-5 w-5 flex items-center justify-center text-[0.5rem] bg-black border-slate-600 border-[1px] text-slate-600 group-hover:text-white group-hover:border-white"
                    >i</span
                ><span class="text-xs text-slate-600 group-hover:text-white"
                    >LEARN MORE</span
                ></a
            >
        </div>
    </div>
{/if}
