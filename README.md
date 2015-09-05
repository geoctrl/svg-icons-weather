# Svg Icons

## Install

```
bower install svg-icons
```

```
npm install svg-icons
```


## Example usage

```html

<main ng-app="exampleApp">
	<!-- use svg symbol/icon -->
	<icon icon="apps" class="my custom classes here"></icon>
	<icon icon="grid-on"></icon>
</main>

<script src="build/lib/angular/angular.min.js"></script>
<script src="dist/svg-icons.js"></script>
<script>
	//include module in app
	angular.module('exampleApp', [
		'svg-icons'
	])
	//if you want to configure options:
	.run(function(svgIconProvider) {
		svgIconProvider.setOpts({
			baseClass: 'icon-ex'
		});
	});
</script>
```

See icons-manifest.json to quickly see all available icons.

Only needed SVGs are included in the build. The `google-svgs` folder is all of Google's icons. The ones included in the Tute icon build process are in the `svg` folder.
