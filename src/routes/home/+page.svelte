<script lang="ts">
    import { goto } from '$app/navigation';

    function navigateToAgent() {
        goto('/agent');
    }
</script>

<svelte:head>
    <title>Home - Visualization Assistant</title>
    <meta name="description" content="Welcome to Visualization Assistant - Your AI-powered companion" />
</svelte:head>

<div class="min-h-screen bg-black text-white font-mono">
    <!-- Hero Section -->
    <div class="container mx-auto px-4 py-16">
        <div class="text-center">
            <h1 class="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Visualization Assistant
            </h1>
            <p class="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
                Welcome to your AI-powered visualization and conversation platform.
                Explore advanced AI capabilities and interactive experiences.
            </p>

            <!-- Navigation Cards -->
            <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <!-- AI Agent Card -->
                <div class="bg-gray-900 border border-gray-700 rounded-xl p-8 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                    <div class="text-4xl mb-4">🤖</div>
                    <h3 class="text-2xl font-bold mb-4">AI Agent</h3>
                    <p class="text-gray-400 mb-6">
                        Chat with our advanced AI agent powered by ElevenLabs.
                        Experience natural conversations with intelligent responses.
                    </p>
                    <button
                        on:click={navigateToAgent}
                        class="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        Launch AI Agent
                        <span>→</span>
                    </button>
                </div>

                <!-- Visualization Tools Card -->
                <div class="bg-gray-900 border border-gray-700 rounded-xl p-8 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                    <div class="text-4xl mb-4">✨</div>
                    <h3 class="text-2xl font-bold mb-4">Visualization Tools</h3>
                    <p class="text-gray-400 mb-6">
                        Access powerful visualization and manifestation tools.
                        Explore techniques for personal development and goal achievement.
                    </p>
                    <a
                        href="/"
                        class="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 no-underline"
                    >
                        Open Visualizations
                        <span>→</span>
                    </a>
                </div>
            </div>

            <!-- Additional Features -->
            <div class="mt-16 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div class="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
                    <div class="text-2xl mb-3">🎯</div>
                    <h4 class="text-lg font-semibold mb-2">Goal Setting</h4>
                    <p class="text-gray-400 text-sm">Define and track your visualization goals</p>
                </div>

                <div class="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
                    <div class="text-2xl mb-3">🧠</div>
                    <h4 class="text-lg font-semibold mb-2">AI Insights</h4>
                    <p class="text-gray-400 text-sm">Get personalized recommendations and guidance</p>
                </div>

                <div class="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
                    <div class="text-2xl mb-3">📊</div>
                    <h4 class="text-lg font-semibold mb-2">Progress Tracking</h4>
                    <p class="text-gray-400 text-sm">Monitor your development journey</p>
                </div>
            </div>
        </div>
    </div>
</div>
