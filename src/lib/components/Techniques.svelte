<script lang="ts">
    import {
        accountType,
        currentTechnique,
        showPricingTable,
    } from "$lib/stores";

    export let isDropdown = false;

    let showRevisionInfo = false;
    let showAffirmationInfo = false;
    let showVisualizationInfo = false;
    let showMeditationInfo = false;

    let showTechniqueModal = false;

    let showUpgrade: boolean[] = [];

    function chooseTechnique(technique: string) {
        currentTechnique.set(technique);
    }
</script>

{#if isDropdown}
    <button
        on:click={() => (showTechniqueModal = true)}
        class="fixed top-2 rounded-lg capitalize left-1/2 -translate-x-1/2 p-2 px-4 bg-white bg-opacity-10"
        >{$currentTechnique}</button
    >

    <!-- TODO -->
    <!-- implement modal to select the technique -->

    <!-- technique modal -->
    {#if showTechniqueModal}
        <div
            class="z-50 fixed top-20 left-1/2 -translate-x-1/2 bg-white bg-opacity-10 rounded-xl border-white border-[1px] backdrop-blur-xl w-[84vw] p-4"
        >
            <div class="flex justify-between">
                <p>Technique</p>
                <p>
                    <span
                        class="rounded-[100%] h-6 w-6 flex items-center justify-center font-black border-white border-[1px] text-white"
                        >i</span
                    >
                </p>
            </div>
            <!-- TODO -->
            <!-- list techniques -->
            <!-- add a title and subheading -->
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
