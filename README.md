# SVGBar
Animated progress bars with variable widths and non-linear paths (i.e. squiggly)

## Usage

Include the SVGBar.js file in the head of the page and then call:

```
var mySVGBar = new SVGBar();
````

This will initialise the SVGBar with the default options:

- The first `<svg>` tag on the page will be used
- The first `<path class='mask'>` inside the svg will be used as the mask
- All of the `<path class='progress_path'>` paths will be used to create progress bars with the mask

The script will take care of building the progress bars and all other masks.

## Options

To configure with some options, pass a plain object to the options argument of the constructor like this:

```
var svg_obj = document.getElementById('mysvg');
var mySVGBar = new SVGBar({
    svg: svg_obj,
    mask: svg_obj.getElementById('my_mask'),
    paths: svg_obj.getElementsByClassName('paths_for_progress'),
    animation_length: 3000
});
```
