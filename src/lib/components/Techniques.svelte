<script lang="ts">
    import { accountType, currentTechnique } from "$lib/stores";

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
                class="rounded-xl px-3 p-1 border-white border-[1px] {$currentTechnique === 'visualization' ? 'bg-white  text-black' : 'text-slate-300'}   hover:bg-white hover:text-black transform transition-all duration-300 ease-in-out"
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
                class="rounded-xl px-3 p-1 border-white border-[1px] {$currentTechnique === 'meditation' ? 'bg-white  text-black' : 'text-slate-300'}  hover:bg-white hover:text-black transform transition-all duration-300 ease-in-out"
                on:click={() => chooseTechnique('meditation')} placeholder="custom">
        </div> 
    {:else if $accountType === 'free'}
        <div class="relative p-2 flex flex-wrap gap-2">
            <button class="text-left text-xs">Upgrade account to access advanced features</button>
            <button 
                class="rounded-xl px-3 p-1 bg-white border-white text-black border-[1px]"
                on:click={() => chooseTechnique('visualization')}>
                Visualization
            </button>
            <button 
                on:mouseenter={() => showUpgrade[0] = true}
                on:mouseleave={() => showUpgrade[0] = false}
                class="relative rounded-xl px-3 p-1 bg-slate-800 border-slate-600 text-slate-600 border-[1px]"
                on:click={() => chooseTechnique('revision')}>
                🔒 Revision
                {#if showUpgrade[0]}
                    <span class="text-sm w-40 absolute left-1/2 bottom-10 -tracking-wide -translate-x-1/2 tooltip rounded shadow-lg p-2 bg-lime-400 text-black mt-8">Upgrade account to unlock.</span>
                {/if}
            </button>
            <button 
                on:mouseenter={() => showUpgrade[1] = true}
                on:mouseleave={() => showUpgrade[1] = false}
                class="relative rounded-xl px-3 p-1 bg-slate-800 border-slate-600 text-slate-600 border-[1px]"
                on:click={() => chooseTechnique('affirmation')}>
                🔒 Affirmation
                {#if showUpgrade[1]}
                    <span class="text-sm w-40 absolute left-1/2 bottom-10 -tracking-wide -translate-x-1/2 tooltip rounded shadow-lg p-2 bg-lime-400 text-black mt-8">Upgrade account to unlock.</span>
                {/if}
            </button>
            <button 
                on:mouseenter={() => showUpgrade[2] = true}
                on:mouseleave={() => showUpgrade[2] = false}
                class="relative rounded-xl px-3 p-1 bg-slate-800 border-slate-600 text-slate-600 border-[1px]"
                on:click={() => chooseTechnique('meditation')}>
                🔒 Meditation
                {#if showUpgrade[2]}
                    <span class="text-sm w-40 absolute left-1/2 bottom-10 -tracking-wide -translate-x-1/2 tooltip rounded shadow-lg p-2 bg-lime-400 text-black mt-8">Upgrade account to unlock.</span>
                {/if}
            </button>
            <input type="text" 
                disabled
                on:mouseenter={() => showUpgrade[3] = true}
                on:mouseleave={() => showUpgrade[3] = false}
                class="relative rounded-xl px-3 p-1 bg-slate-800 border-slate-600 text-slate-600 border-[1px]"
                on:click={() => chooseTechnique('meditation')} placeholder="🔒 custom">
                {#if showUpgrade[3]}
                    <span class="text-sm w-40 left-10 absolute bottom-12 -tracking-wide  tooltip rounded shadow-lg p-2 bg-lime-400 text-black mt-8">Upgrade account to unlock.</span>
                {/if}
        </div>
    {/if}
    <div class="p-2 w-full flex justify-start items-end ">
        <a href="/education" class="group flex items-center space-x-2"><span class="rounded-[100%] h-5 w-5 flex items-center justify-center text-[0.5rem] bg-black border-slate-600 border-[1px] text-slate-600 group-hover:text-white group-hover:border-white">i</span><span class="text-xs text-slate-600 group-hover:text-white">LEARN MORE</span></a>
    </div>

</div>
