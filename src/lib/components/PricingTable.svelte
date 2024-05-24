<script lang="ts">
    import { isMenuOpen, showPricingTable } from "$lib/stores";
    import { writable } from "svelte/store";
    import { blur, fade } from "svelte/transition";

    let period = writable<string>('month');

    $: if ($showPricingTable) {
        isMenuOpen.set(false);
    }

    let hello = false;

    let tiers = [
        {
            flair: null,
            name: 'Pro',
            tagline: 'Create 100 AI Visualizations and 20 AI Voice Narrations per day',
            features: [
                'Create 300 AI Visualizations/month',
                '50 AI Voice Narrations/month',
                'More AI Voice options',
                'Progress Tracking',
                'Preview of Advanced Techniques:',
                '10 Affirmations/month',
                '5 Meditations/month',
                '2 Revisions/month',
            ],
            price: {
                month: 10,
                year: 100,
                oneTime: 200,
            }
        },
        {
            flair: 'Most Popular',
            name: 'Premium',
            tagline: 'Create 1000 AI Visualizations and 200 AI Voice Narrations per month',
            features: [
                'Everything in Pro Plan Plus:',
                'Create 1000 AI Visualizations/month',
                '200 AI Voice Narrations/month',
                'Access to all AI Voices',
                'Voice Narrations can be downloaded',
                'Advanced Techniques',
                '100 Affirmations/month',
                '50 Meditations/month',
                '20 Revisions/month',
                '5 Custom Techniques/month'
            ],
            price: {
                month: 25,
                year: 250,
                oneTime: 500,
            }
        },
        {
            flair: 'Best Value',
            name: '💎 Diamond',
            tagline: 'Create Unlimited AI Visualizations and Unlimited AI Voice Narrations',
            features: [
                'Everything in Premium Plan Plus:',
                'Create Unlimited AI Visualizations',
                'Unlimited use of all Advanced Techniques',
                'Early Access to New Features',
                'Priority Support',
            ],
            price: {
                month: 99,
                year: 990,
                oneTime: 1500,
            }
        },
    ];

</script>

<!-- area outside modal -->
<button
    in:blur
    class="inset-0 bg-black p-8 w-full h-screen fixed z-40">

    <!-- modal -->
    <button
        in:fade
        out:fade
        on:click|stopPropagation={() => hello = true}
        class="max-h-[90%] h-full overflow-y-auto overflow-x-hidden p-6 bg-slate-950 border-slate-600 border-[1px] z-50 rounded-xl">

        <div class="p-1 rounded-xl border-slate-600 border-[1px] bg-slate-800 items-center justify-evenly flex max-w-[12.5rem] m-auto">
            <button 
                on:click|stopPropagation={() => period.set('month')}
                class="px-4 p-2 rounded-lg {$period === 'month' ? 'bg-lime-400 text-slate-900' : 'text-slate-600'}">Monthly</button>
            <button 
                on:click|stopPropagation={() => period.set('year')}
                class="px-4 p-2 rounded-lg {$period === 'year' ? 'bg-lime-400 text-slate-900' : 'text-slate-600'}">Yearly</button>
        </div>
        <!-- three tables -->
        <div class="m-auto w-full justify-center overflow-y-auto mt-6 flex flex-col sm:flex-row space-y-4 sm:space-x-4">
            {#each tiers as tier}
                <div class="flex even:bg-slate-800 flex-col justify-start items-start w-full sm:w-1/4 even:border-slate-600 even:border-[1px] rounded-xl p-8">

                    {#if tier.flair}
                        <p class="bg-black border-slate-400 border-[1px] rounded text-xs my-2 p-1 px-2 animate-bounce">{tier.flair}</p> 
                    {/if}

                    <h2 class="font-black text-lg my-2">{tier.name}</h2>
                    <!-- tagline -->
                    <p class="text-left text-xs text-slate-400">{tier.tagline}</p>
                    <div class="mt-8 flex space-x-1">
                        {#if $period === 'month'}
                            <p class="text-slate-200 font-black text-3xl">${tier.price.month}</p>
                            <div class="text-slate-400 text-xs text-left leading-3 justify-center flex flex-col">
                                <p>per</p>
                                <p>month</p>
                            </div>
                        {:else if $period === 'year'}
                            <p class="text-slate-200 font-black text-3xl">${tier.price.year}</p>
                            <div class="text-slate-400 text-xs text-left leading-3 justify-center flex flex-col">
                                <p>per</p>
                                <p>year</p>
                            </div>
                        {/if}
                    </div>
                    <button class="my-4 w-full p-3 bg-lime-600 hover:bg-lime-800 rounded-xl text-white">Subscribe</button>
                    <p class="text-xs my-2">This includes: </p>
                    {#each tier.features as feature}
                        <ul class="text-xs flex text-left flex-col">
                            <li class="flex space-x-4 text-sm my-1">
                                <span>✅</span> 
                                <span>{feature}</span>
                            </li>
                        </ul>
                    {/each}
                </div> 
            {/each}
        </div>
    </button>
</button>