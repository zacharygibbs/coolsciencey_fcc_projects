<script>
    import { createEventDispatcher, onMount } from 'svelte';
    //export let mounted;
    let mounted = false;
    onMount(() => {
        mounted = true;
        console.log(mounted);
    });
    export let value;
    export let ids;
    export let idSounds;
    export let key;
    let btn_class = 'btn-primary';
    const dispatch = createEventDispatcher();
    function handleClick(event){
        //alert('clicked: ' + this.id + ' and ' + this.innerText + '. filename: ' + idSounds[this.id])
        document.getElementById('audio_' + this.id).play()
        let elem = document.getElementById(this.id)
        elem.style.backgroundColor = "yellow"//('button-playing')
        dispatch('playing', {
            id: this.id,
            wav: idSounds[this.id],
            button: this.innerText
		});
    }
    function handleEnded(event) {
        let elem = document.getElementById(this.id.replace('audio_',''))
        elem.style.backgroundColor = ""//('button-playing')
        btn_class = 'btn-primary'
        dispatch('ended', {
            id: elem.id,
            wav: idSounds[elem.id],
            button: elem.innerText
        });
    }

    $: {
        key 
        console.log(mounted);
        try {
            let buttons = document.getElementsByTagName('button')//key    
            for(let i=0;i<buttons.length;i++){
                console.log(buttons[i])
                if(buttons[i].innerText.toLowerCase() == key.toLowerCase()){
                    buttons[i].click()
                }
            }
        } catch (error) {
            console.log(error) //needed to try/catch because this didn't work on first app load
        }

    }


</script>
{#each value as val, i}
    <div class='button-container'>
        <button on:click={handleClick}
                class= {btn_class}
                id={ids[i]} >
                {val}
        </button>
        <audio id={'audio_'+ids[i]} src={idSounds[ids[i]]} on:ended={handleEnded}></audio>
    </div>
{/each}
<br/>

<style>
    button { 
        height:100px;
        width: 100px;
    }
    .button-container {
        background-color: gainsboro;
        border: none;
        padding: 20px;
        display: inline-block;
    }
    
    .button-playing {
        color: red;
    }

</style>