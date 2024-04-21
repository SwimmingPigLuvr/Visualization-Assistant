<script>
    import Chat from "$lib/components/Chat.svelte";
    import Settings from "$lib/components/Settings.svelte";
</script>

<body class="w-full h-screen font-mono text-neutral-100">


    <div class="z-50">
        <Settings />
    </div>
    <Chat />

    <!-- clouds -->
    <div id="video-container">
        <video id="background-video" autoplay loop muted>
            <source src="/videos/clouds.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    </div>
    <div>
        <audio id="background-audio" autoplay loop>
            <source src="/sounds/alima.mp3" type="audio/mp3">
            Your browser does not support the audio tag.
        </audio>
    </div>
    
    
</body>
