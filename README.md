# SVGBar
Animated progress bars with variable widths and non-linear paths (i.e. squiggly)

## Getting started

Include the SVGBar.js file in the head of the page and then call:

```
var mySVGBar = new SVGBar();
````

This will initialise the SVGBar with the default options:

- The first `<svg>` tag on the page will be used
- The first `<path class='mask'>` inside the svg will be used as the mask
- All of the `<path class='progress_path'>` paths will be used to create progress bars with the mask

The script will take care of building the progress bars and all other masks.

### Options

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

## Usage

### setProgress(percent)
Sets the position of the progress bar as a percentage from 0 -> 1.
Useful to put inside a handler on the page for keyboard presses, AJAX calls, mouse movement etc.
```
mySVGBar.setProgress(0.4);
```

### displayPathLine(will_show)
Show or hide an outline of the path the progress bar is following (great for debugging)
```
mySVGBar.displayPathLine(true);
```

### togglePathLine()
Toggle visiblity of path line
```
mySVGBar.togglePathLine();
```

### setAnimationState(will_show)
Start or stop animating the progress bar back and forth from 0 -> 100%
```
mySVGBar.setAnimationState(true);
```

### toggleAnimationState()
Toggle play/stop state of animation
```
mySVGBar.toggleAnimationState();
```