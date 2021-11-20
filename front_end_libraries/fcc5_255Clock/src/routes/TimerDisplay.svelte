<script>
    export let mode;
    export let timeleft;
    export let timeleft_seconds;

    let strTimeLeft = ''
    let strTimeLeft_seconds = ''

    const zeroPad = (num, places) => String(num).padStart(places, '0')
    //https://stackoverflow.com/questions/2998784/how-to-output-numbers-with-leading-zeros-in-javascript
    $: {
        strTimeLeft = zeroPad(timeleft, 2);
        strTimeLeft_seconds = zeroPad(timeleft_seconds, 2)
    }

</script>

<div id="timer-box">
    <div id="timer-label">{mode}</div>
    <div id="time-left">{strTimeLeft}:{strTimeLeft_seconds}</div>
</div>
