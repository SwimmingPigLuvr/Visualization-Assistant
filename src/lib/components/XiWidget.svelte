<script>
    import { onMount } from "svelte";

    let height = "90";
    let width = "100%";
    export let publicUserId =
        "63cf7df0256dd31e98932e4082453f90ac0acb3463659636bd722ba9a76c6a33";

    onMount(() => {
        const script = document.createElement("script");
        script.src = "https://elevenlabs.io/player/audioNativeHelper.js";
        script.async = true;
        script.onload = () => {};
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    });
</script>

<div
    id="elevenlabs-audionative-widget"
    data-height={height}
    data-width={width}
    data-frameborder="no"
    data-scrolling="no"
    data-publicuserid={publicUserId}
    data-playerurl="https://elevenlabs.io/player/index.html"
>
    Loading the
    <a
        href="https://elevenlabs.io/text-to-speech"
        target="_blank"
        rel="noopener">Elevenlabs tts</a
    >
    AudioNative Player
</div>
