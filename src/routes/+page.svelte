<script lang="ts">
    import Chat from "$lib/components/Chat.svelte";
    import Profile from "$lib/components/Profile.svelte";
    import Menu from "$lib/components/Menu.svelte";
    import Test from "$lib/components/Test.svelte";
    import Login from "$lib/components/Login.svelte";
    import { wallpaper } from "$lib/stores";

    $: {
        document.body.style.backgroundImage = `url(${$wallpaper})`;
    }
    
</script>

<body class="w-full h-screen font-mono text-neutral-100">

    <div class="z-10">
        <Profile />
    </div>

    <!-- <div class="z-50">
        <Test />
    </div> -->


    <div class="z-10">
        <Menu />
    </div>
    <Chat />

    <!-- clouds -->
    <!-- <div id="video-container">
        <video id="background-video" autoplay loop muted>
            <source src="/videos/clouds.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    </div> -->
    <div>
        <audio id="background-audio" autoplay loop>
            <source src="/sounds/alima.mp3" type="audio/mp3">
            Your browser does not support the audio tag.
        </audio>
    </div>
    
    
</body>
