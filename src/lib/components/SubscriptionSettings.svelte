<script>
    import { browser } from "$app/environment";
    import { SignedIn, userStore } from "sveltefire";

    let subscriptionDetails = "pro";
</script>

{#if browser}
    <SignedIn let:user>
        <div class="px-4">
            <p>
                current plan <span class="uppercase text-white font-bold"
                    >{subscriptionDetails}</span
                >
            </p>
            {#if subscriptionDetails !== "pro"}
                <button>upgrade plan</button>
            {/if}
            <button>
                <p>manage plan</p>
            </button>
        </div>
    </SignedIn>
{/if}
