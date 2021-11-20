<script>
    //import IconButton from '@smui/icon-button'
    import IconButton from '../../node_modules/@smui/icon-button/dist/IconButton.svelte'
    export let value;
    export let labeltext;
    export let id;
    export let counting;
    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function increment(event) {
		if(value < 60 & !counting){
            dispatch('change', {value: value + 1, id: id});
        }
	}

    function decrement(event) {
		if(value>1 & !counting){
            dispatch('change', {value: value - 1, id: id});
        }
	}
 
    

</script>

<div id="{id}-box">
    <div id="{id}-label">{labeltext}</div>
        <IconButton class="material-icons" id="{id}-increment" on:click={increment}>arrow_upward</IconButton>
        <span id="{id}-length">{value}</span>
        <IconButton class="material-icons" id="{id}-decrement" on:click={decrement}>arrow_downward</IconButton>
</div>