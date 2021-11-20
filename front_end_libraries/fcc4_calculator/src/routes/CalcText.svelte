<script>
    export let text;

</script>

<div id="calculator-text">
    <input id="calc-textbox" type="text" readonly placeholder={text}/>
  </div>

<style lang="scss">
	input[type="text"] {
		margin-left: 10px;
		margin-right: 10px;
		width: 95%;
		text-align: right;
	}
  

</style>