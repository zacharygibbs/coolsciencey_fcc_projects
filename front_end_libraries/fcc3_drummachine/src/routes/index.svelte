<script>

import Drumpad from './Drumpad.svelte';
//import {onMount} from 'svelte';
let mounted = true;
//onMount(() => {
//    mounted = true;
//    console.log(mounted);
//});

//let drumSounds = ['Sound 1', 'Sound 2', 'Sound 3']
    let key;

	function handleKeydown(event) {
		key = event.key;
	}

    
</script>
<link href="bootstrap.min.css" rel="stylesheet"/>
<svelte:window on:keydown={handleKeydown}/>
<h1>Free Code Camp - Front End Development Libraries </h1>
<h2>Project 3 - Drum Machine</h2>

<Drumpad key={key} mounted={mounted}/>

<br/><br/>

<style>

</style>
