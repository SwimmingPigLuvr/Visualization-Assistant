<script lang="ts">
    import Chat from "$lib/components/Chat.svelte";
    import Profile from "$lib/components/Profile.svelte";
    import Menu from "$lib/components/Menu.svelte";
    import Test from "$lib/components/Test.svelte";
    import Login from "$lib/components/Login.svelte";
    import { wallpaper, bgMode } from "$lib/stores";
    import { browser } from "$app/environment";
</script>

<body class="w-full h-screen font-mono text-neutral-100">
    <div class="z-50">
        <Login />
    </div>

    {#if browser}
        {#if $bgMode === "video"}
            <video autoplay muted loop playsinline class="background-video">
                <source src={$wallpaper} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        {:else if $bgMode === "image"}
            <img src={$wallpaper} alt="background" class="background-image" />
        {/if}
    {/if}

    <div class="z-20">
        <Profile />
    </div>

    <div class="z-10">
        <Menu />
    </div>
    <Chat />

    <!-- clouds -->
    <div id="video-container">
        <video id="background-video" autoplay loop muted playsinline>
            <source src="/videos/clouds.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    </div>
    <!-- <div>
        <audio id="background-audio" autoplay loop>
            <source src="/sounds/alima.mp3" type="audio/mp3">
            Your browser does not support the audio tag.
        </audio>
    </div> -->
</body>

<style>
    .background-video {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -2;
    }
</style>
