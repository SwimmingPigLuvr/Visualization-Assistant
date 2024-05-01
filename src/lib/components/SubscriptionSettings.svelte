<script>
    import { SignedIn } from "sveltefire";

    let subscriptionDetails = 'pro';

</script>

<SignedIn let:user>
    <div class="px-4">
        <p>current plan <span class="uppercase text-white font-bold">{subscriptionDetails}</span></p>
        {#if subscriptionDetails !== 'pro'}
            <button>upgrade plan</button>
        {/if}
        <p>manage plan</p>

    </div>
</SignedIn>