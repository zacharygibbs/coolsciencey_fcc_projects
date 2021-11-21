
# Installing NPM onto Clean Ubuntu

```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get nvm
nvm install 16.13
npm install -g npm@8.1.3
```

# Installing "create-react-app" (if you want to use that front end library)
```
npm install -g create-react-app
npm install react-redux
npm install redux-thunk
npm install react-helmet
npm start
```
# Installing "svelte-kit" (if you want to use svelte front end library)
## install svelte
```
npm init svelte@next my-app
cd my-app
npm install
npm install -D @sveltejs/adapter-static@next svelte-preprocess node-sass
```

## update  config.js - i just copy/paste this in, then update the appDir
```
import adapter from '@sveltejs/adapter-static';
/** @type {import('@sveltejs/kit').Config} */
import sveltePreprocess from "svelte-preprocess"
const config = {
	preprocess: sveltePreprocess(),
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: adapter(),
		appDir: 'fcc/4_calculator/_app'
	}
};
export default config;
```
## run dev server
```
npm run dev -- --open
```

## once development is complete; go ahead and build the app for deployment!
```
npm run build
```

## Optionally - install svelte material UI (or sveltestrap)
```
npm i -D @smui/icon-button
npm install --save svelte-material-ui
```
## also had to install typescript..
```
npm install --save-dev @tsconfig/svelte typescript svelte-preprocess svelte-check
npm i -D @smui/layout-grid
```
