import adapter from '@sveltejs/adapter-static';
/** @type {import('@sveltejs/kit').Config} */
import sveltePreprocess from "svelte-preprocess"
const config = {
	preprocess: sveltePreprocess(),
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: adapter(),
		appDir: 'fcc/vis5_treemap/_app'
	}
};
export default config;
