<script lang="ts">
    import { accountType, currentTechnique, showPricingTable } from "$lib/stores";

    let showRevisionInfo = false;
    let showAffirmationInfo = false;
    let showVisualizationInfo = false;
    let showMeditationInfo = false;

    let showUpgrade: boolean[] = [];

    function chooseTechnique(technique: string) {
        currentTechnique.set(technique)
    }
</script>

<div class="p-2">
    <h2 class="text-xl">Technique</h2>

    {#if $accountType === 'paid'}
        <div class="p-2 flex flex-wrap gap-2">
            <button 
                class="w-[48%] rounded-xl px-3 p-1 bg-black bg-opacity-30 border-white text-white border-[1px]"
                on:click={() => chooseTechnique('visualization')}>
                Visualization
            </button>
            <button 
                class="rounded-xl px-3 p-1 border-white border-[1px] {$currentTechnique === 'revision' ? 'bg-white  text-black' : 'text-slate-300'}   hover:bg-white hover:text-black transform transition-all duration-300 ease-in-out"
                on:click={() => chooseTechnique('revision')}>
                Revision
            </button>
            <button 
                class="rounded-xl px-3 p-1 border-white border-[1px] {$currentTechnique === 'affirmation' ? 'bg-white  text-black' : 'text-slate-300'}   hover:bg-white hover:text-black transform transition-all duration-300 ease-in-out"
                on:click={() => chooseTechnique('affirmation')}>
                Affirmation
            </button>
            <button 
                class="rounded-xl px-3 p-1 border-white border-[1px] {$currentTechnique === 'meditation' ? 'bg-white  text-black' : 'text-slate-300'}   hover:bg-white hover:text-black transform transition-all duration-300 ease-in-out"
                on:click={() => chooseTechnique('meditation')}>
                Meditation
            </button>
            <input type="text" 
                class="bg-black rounded-xl px-3 p-1 border-white border-[1px] {$currentTechnique === 'meditation' ? 'bg-white  text-black' : 'text-slate-300'}  hover:text-black transform transition-all duration-300 ease-in-out"
                on:click={() => chooseTechnique('meditation')} placeholder="custom">
        </div> 
    {:else if $accountType === 'free'}
        <div class="-tracking-widest mt-3 relative p-2 flex flex-wrap gap-2">
            <button 
                on:click={() => showPricingTable.set(true)}
                class="text-center m-auto text-slate-500 text-sm hover:text-slate-300">Upgrade account to access advanced features</button>
            <button 
                class="w-[48%] rounded-xl px-3 p-1 bg-black bg-opacity-30 border-white text-white border-[1px]"
                on:click={() => chooseTechnique('visualization')}>
                Visualization
            </button>
            <button 
                on:mouseenter={() => showUpgrade[0] = true}
                on:mouseleave={() => showUpgrade[0] = false}
                class="w-[48%] relative rounded-xl px-3 p-1 bg-slate-800 border-slate-600 text-slate-600 border-[1px]"
                on:click={() => showPricingTable.set(true)}>
                🔒 Revision
                {#if showUpgrade[0]}
                    <span class="text-sm w-40 absolute left-1/2 bottom-10 -tracking-wide -translate-x-1/2 tooltip rounded shadow-lg p-2 bg-black text-lime-600">Upgrade account to unlock <span class="text-white">Revisions</span></span>
                {/if}
            </button>
            <button 
                on:mouseenter={() => showUpgrade[1] = true}
                on:mouseleave={() => showUpgrade[1] = false}
                class="w-[48%] relative rounded-xl px-3 p-1 bg-slate-800 border-slate-600 text-slate-600 border-[1px]"
                on:click={() => showPricingTable.set(true)}>
                🔒 Affirmation
                {#if showUpgrade[1]}
                    <span class="text-sm w-40 absolute left-1/2 bottom-10 -tracking-wide -translate-x-1/2 tooltip rounded shadow-lg p-2 bg-black text-lime-600">Upgrade account to unlock <span class="text-white">Affirmations</span></span>
                {/if}
            </button>
            <button 
                on:mouseenter={() => showUpgrade[2] = true}
                on:mouseleave={() => showUpgrade[2] = false}
                class="w-[48%] relative rounded-xl px-3 p-1 bg-slate-800 border-slate-600 text-slate-600 border-[1px]"
                on:click={() => showPricingTable.set(true)}>
                🔒 Meditation
                {#if showUpgrade[2]}
                    <span class="text-sm w-40 absolute left-1/2 bottom-10 -tracking-wide -translate-x-1/2 tooltip rounded shadow-lg p-2 bg-black text-lime-600">Upgrade account to unlock <span class="text-white">Meditations</span></span>
                {/if}
            </button>
            <input type="text" 
                on:mouseenter={() => showUpgrade[3] = true}
                on:mouseleave={() => showUpgrade[3] = false}
                class="w-full relative rounded-xl px-3 p-1 bg-slate-800 border-slate-600 text-slate-600 border-[1px]"
                placeholder="🔒 custom"
                on:click={() => showPricingTable.set(true)}>
                {#if showUpgrade[3]}
                    <span class="text-center text-sm w-40 left-1/2 -translate-x-1/2 absolute bottom-12 -tracking-wide  tooltip rounded shadow-lg p-2 bg-black  text-lime-600">Upgrade account to unlock <p class="text-white">Custom Techniques</p></span>
                {/if}
        </div>
    {/if}
    <div class="p-2 w-full flex justify-start items-end ">
        <a href="/education" class="group flex items-center space-x-2"><span class="rounded-[100%] h-5 w-5 flex items-center justify-center text-[0.5rem] bg-black border-slate-600 border-[1px] text-slate-600 group-hover:text-white group-hover:border-white">i</span><span class="text-xs text-slate-600 group-hover:text-white">LEARN MORE</span></a>
    </div>

</div>
