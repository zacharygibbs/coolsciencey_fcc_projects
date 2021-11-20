<script>
	import { set_input_type } from "svelte/internal";
	import CalcText from "./CalcText.svelte"
	import CalcButton from "./CalcButton.svelte";
	const TEXT0 = '0'
	let text = TEXT0

	const count_decimals = (txtin) => {return (txtin.match(/\./g) || []).length}

	const allow_decimal = (txtin) => {
		let res = (txtin.split(/ [+-/*] /g) || [])
		return count_decimals(res[res.length - 1]) < 1
	}

	const allow_operator = (txtin, input) => {
		return (!!!txtin.match(/ [+-/*] $/) | (input == '-' & !!!txtin.match(/( - ){2}/)))
	}


	const parseFloat_withnegative = (txtin) => {
		let negsplit = (txtin.split('negative') || [])
		if(negsplit.length>1){
			return -1 * parseFloat(negsplit[1])
		}
		else{
			return parseFloat(txtin)
		}

		
	}

	const eval_with_operators = (val, res, ops, mult_div=false) => {
		let vals = [];
		let outval = val*1.0;
		for(let i = 0; i<ops.length; i++){
			if(mult_div){
				outval = parseFloat_withnegative(res[i]);
			}
			if(ops[i] == ' + '){
				outval += parseFloat_withnegative(res[i+1]);
			}
			else if(ops[i] == ' - '){
				outval -= parseFloat_withnegative(res[i+1]);
			}
			else if(ops[i] == ' * '){
				outval *= parseFloat_withnegative(res[i+1]);
			}
			else if(ops[i] == ' / '){
				outval /= parseFloat_withnegative(res[i+1]);
			}
			if(mult_div){
				vals = [...vals, outval];
			}
		}
		if(mult_div){
			return vals
		}
		else{	
			return outval
		}
		
	}

	const handleClick = (event) => {
		if(text==TEXT0){
			if(String(event.detail.is_number)=='true'){
				text = event.detail.text;
			}
		}
		else{
			if(String(event.detail.is_number)=='true'){
				console.log(event.detail.text=='0')
				console.log(!!!text.match(/ [+-/*] $/))
				console.log(!(
						event.detail.text=='0'
						& !!!text.match(/ [+-/*] $/)
					)		)
				if(event.detail.text != '.' 
					| (
						event.detail.text=='.'
						& allow_decimal(text)
					)	
				){
					let res = (text.split(/ [+-/*] /g) || []);
					let res2 = (res[res.length - 1].split(/^0/) || []);
					if(!(res2.length>1 & event.detail.text=='0')){
						text = text + String(event.detail.text)	
					}
					
				}			
			}
			else if(String(event.detail.is_operator)=='true'
					& allow_operator(text, event.detail.text)){
				if(!!text.match(' = ')){
					text = text.split(' = ')[1]
				}
				text = text + ' ' + String(event.detail.text) + ' ';
			}
			else if(event.detail.text=='AC'){
				text = TEXT0;
			}
			else if(event.detail.text == "="){
				
				if(!!!text.match(' = ')){
					text = text.replace(/ [+-/*] $/,'')
					let newtext = `${text}`;
					let negative = (newtext.match(/( [+-/*] ){2}/g) || []);
					if(negative.length>0){
						for(let i=0; i<negative.length; i++){
							let negativerepl = negative[i].split('  - ')[0] + ' negative'
							newtext = newtext.replaceAll( negative[i], negativerepl)
							console.log(newtext)
						}
					}

					let res = (newtext.split(/ [+-/*] /g) || []);
					let ops = (newtext.match(/ [+-/*] /g) || []);	
					console.log(res)
					console.log(ops)
					let res_mult_div = [];
					let remove_arr = [];
					let ops_mult_div = ops.filter((value, index, array)=>{
						if(value==' * ' | value ==' / '){
							res_mult_div = [...res_mult_div, res[index], res[index + 1]];
							remove_arr = [...remove_arr, 
											res[index] + value + res[index + 1]];
							return value
						} 
					})
					let vals_mult_div = eval_with_operators(null, res_mult_div, ops_mult_div, true);
					//let newtext = `${newtext}`;
					for(let i=0; i<remove_arr.length; i++){
						newtext = newtext.replace(remove_arr[i], vals_mult_div[i])
					}
					console.log(newtext);
					res = (newtext.split(/ [+-/*] /g) || []);
					ops = (newtext.match(/ [+-/*] /g) || []);
					let val = parseFloat_withnegative(res[0]);
					val = eval_with_operators(val, res, ops, false);
					console.log(val)
					text = text + ' = ' + String(val);
				}
			}
		}
	}

	$: {

	}

</script>

<main>
	<h1> Free Code Camp - Front End Development Libraries </h1>
	<h2>Project 4 - Svelte Calculator</h2>
	<div id="calculator">
	  <div class="panel panel-primary">
		<div class="panel-heading">Calculator v0.1</div>
		<div class="panel-body">
			<CalcText id="display" text={text}/>
		  <table id="calculator-table">
			<tr>
			  <td colspan=2><CalcButton id="clear" text="AC" is_number=false is_operator=false on:btnclick={handleClick} /></td>
			  <td><CalcButton id="divide" text="/" is_number=false is_operator=true on:btnclick={handleClick}/></td>
			  <td><CalcButton id="multiply" text="*" is_number=false is_operator=true on:btnclick={handleClick}/></td>
			</tr>
			<tr>
				<td><CalcButton id="seven" text="7" is_number=true is_operator=false on:btnclick={handleClick}/></td>
				<td><CalcButton id="eight" text="8" is_number=true is_operator=false on:btnclick={handleClick}/></td>
				<td><CalcButton id="nine" text="9" is_number=true is_operator=false on:btnclick={handleClick}/></td>
				<td><CalcButton id="add" text="+" is_number=false is_operator=true on:btnclick={handleClick}/></td>
			</tr>   
			<tr>
				<td><CalcButton id="four" text="4" is_number=true is_operator=false on:btnclick={handleClick}/></td>
				<td><CalcButton id="five" text="5" is_number=true is_operator=false on:btnclick={handleClick}/></td>
				<td><CalcButton id="six" text="6" is_number=true is_operator=false on:btnclick={handleClick}/></td>
				<td><CalcButton id="subtract" text="-" is_number=false is_operator=true on:btnclick={handleClick}/></td>
			</tr> 
			<tr>
				<td><CalcButton id="one" text="1" is_number=true is_operator=false on:btnclick={handleClick}/></td>
				<td><CalcButton id="two" text="2" is_number=true is_operator=false on:btnclick={handleClick}/></td>
				<td><CalcButton id="three" text="3" is_number=true is_operator=false on:btnclick={handleClick}/></td>
			  	<td rowspan=2><CalcButton id="equals" text="=" is_number=false is_operator=false on:btnclick={handleClick}/></td>
			</tr> 
			<tr>
			  <td colspan=2><CalcButton id="zero" text="0" is_number=true is_operator=false on:btnclick={handleClick}/></td>
			  <td><CalcButton id="decimal" text="." is_number=true is_operator=false on:btnclick={handleClick}/></td>
			</tr> 
		  </table>
		</div>
	  </div>
	</div>
	


</main>

<style lang="scss">
	$color: black;
	h1 {
	  color: $color;
	}
  
	#calculator {
	  background: gainsboro;
	  border: 4px solid black;
      float: left;
	  width: 50%;
	  max-width: 400px;
	}

	.panel-heading {
		font-size: large;
		font-family: Verdana, Geneva, Tahoma, sans-serif;
		color: blue;
		font-style: oblique;
	}
	#calculator-table {
		width: 100%;
	}

  </style>
  

