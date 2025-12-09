<script lang="ts">
    import { onMount } from 'svelte';
    
    onMount(() => {
        // Load the ElevenLabs widget script if not already loaded
        if (!document.querySelector('script[src*="convai-widget-embed"]')) {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
            script.async = true;
            script.type = 'text/javascript';
            document.head.appendChild(script);
        }
    });
</script>

<svelte:head>
    <title>AI Agent - Visualization Assistant</title>
    <meta name="description" content="Chat with our AI Agent powered by ElevenLabs" />
</svelte:head>

<div class="min-h-screen bg-black text-white font-mono">
    <!-- Navigation -->
    <nav class="p-4 border-b border-gray-800">
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold">AI Agent</h1>
            <a href="/" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors">
                ← Back to Home
            </a>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <div class="text-center mb-8">
            <h2 class="text-3xl font-bold mb-4">Chat with Our AI Agent</h2>
            <p class="text-gray-400 max-w-2xl mx-auto">
                Experience our advanced AI agent powered by ElevenLabs. 
                Start a conversation and explore the capabilities of our intelligent assistant.
            </p>
        </div>

        <!-- ElevenLabs Widget Container -->
        <div class="flex justify-center items-center min-h-[500px]">
            <div class="w-full max-w-4xl">
                <elevenlabs-convai agent-id="agent_2401kbxsmcskf5qr8fgc4merd25a"></elevenlabs-convai>
            </div>
        </div>

        <!-- Additional Info -->
        <div class="mt-12 text-center">
            <div class="bg-gray-900 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 class="text-xl font-semibold mb-3">About This Agent</h3>
                <p class="text-gray-300">
                    This AI agent utilizes advanced natural language processing to provide 
                    intelligent responses and assistance. Powered by ElevenLabs technology 
                    for natural conversation experiences.
                </p>
            </div>
        </div>
    </main>
</div>

<style>
    /* Custom styles for the ElevenLabs widget if needed */
    elevenlabs-convai {
        display: block;
        width: 100%;
        min-height: 400px;
    }
</style>
