<!-- DiscountOfferPopup.svelte -->
<script lang="ts">
    import { writable } from 'svelte/store';

    let email = writable<string>('');
    let showModal = writable<boolean>(true);

    function submitEmail() {
        // Add your email submission logic here
        console.log('Email submitted:', $email);
        showModal.set(false);
    }

    function closeModal() {
        showModal.set(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            closeModal();
        }
    }
</script>

{#if $showModal}
    <div 
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" 
        aria-label="Discount Offer Popup" 
        on:click={closeModal} 
        on:keydown={handleKeyDown} 
        tabindex="0"
    >
        <div class="bg-white p-8 rounded-lg text-center shadow-lg max-w-md mx-auto" on:click|stopPropagation>
            <h2 class="text-2xl font-bold mb-4">Get 20% Off Your Next Purchase!</h2>
            <p class="mb-4">Enter your email below to receive a 20% discount code.</p>
            <input 
                type="email" 
                bind:value={$email} 
                placeholder="Your email address" 
                class="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                required 
            />
            <button 
                class="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300" 
                on:click={submitEmail}
            >
                Submit
            </button>
            <button 
                class="mt-4 w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300" 
                on:click={closeModal}
            >
                Close
            </button>
        </div>
    </div>
{/if}
