<script>
	import { createEventDispatcher } from 'svelte';
    export let id;
    export let text;
    export let is_number;
    export let is_operator;
    
    let btn_class = '';
    if(String(is_number)=='true'){
        btn_class = 'number'
    }
    else if(String(is_operator)=='true'){
        btn_class = 'operator'
    }
    else {
        btn_class = id // if its ac or equals
    }
    const dispatch = createEventDispatcher();
    const handleClick = (event) => {
        dispatch('btnclick', {
            id: id,
            text: text,
            is_number: is_number,
            is_operator: is_operator
		});
    }
</script>

<button on:click={handleClick}
    class= {btn_class}
    id={id} >
    {text}
</button>

<style lang="scss">
	.red {
	  color: red;
	}

    .number {
        background-color: black;
        color: white;
    }

    .operator {
        background-color:rebeccapurple;
        color: white;
    }

    .equals {
        background-color: navy;
        color: white;
        padding-top: 32%;
        padding-bottom: 32%;
    }

    .clear {
        background-color: darkred;
        color: white;
    }

    button {
        width: 100%;
        height: 100%;
        padding-top: 10px;
        padding-bottom: 10px;
        margin: 0px;
    }
  

</style>