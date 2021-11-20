<script>
	import {marked} from 'marked';
	let value = `# h1 Example
## h2 Example
[link example](https://coolsciencey.com)
\`let a=5;\`
\`\`\`
function sciencey(x){
	return x*10^(x^2)
}
\`\`\`
- list item 1
- list item 2
> block quote
> multiple lines of it
> good stuff
**bolded text**
![alt text](https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.USawyCNvygATVPfkUvhabQAAAA%26pid%3DApi&f=1)

	
	
	`
	const NEWLINE = "\n"//String.fromCharCode(13, 10)
	let htmlValue = ''
	$: {
		htmlValue = marked.parse(value)//.replaceAll(NEWLINE, '<br />')
		/*htmlValue = htmlValue.replaceAll('<p>','')
							 .replaceAll('</p>','')
		*/
		console.log(htmlValue);
	}

</script>

<h1>Project 2 - Markdown Previewer</h1>
<h2> wrote this one in svelte</h2>

<textarea id='editor' bind:value style="width:75%; height:250px"/>
<br/>

<div id="preview"> 
	{@html marked.parse(htmlValue)}	
</div>

<style>

	h1 {text-align: center;}
	h2 {text-align: center;}
          

</style>


