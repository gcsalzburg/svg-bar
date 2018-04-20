# SVGBar
Animated progress bars with variable widths and non-linear paths (i.e. squiggly)

## Getting started

Include the SVGBar.js file in the head of the page and then call:

```javascript
var mySVGBar = new SVGBar();
```

This will initialise the SVGBar with the default options:

- The first `<svg>` tag on the page will be used
- The first `<path class='mask'>` inside the svg will be used as the mask
- All of the `<path class='progress_path'>` paths will be used to create progress bars with the mask

The script will take care of building the progress bars and all other masks.

### Styling

You should add a CSS styles for the mask and progress_paths to the page so you can see something.
Refer to these items however you want, these references won't be changed by the SVGBar.
You can also style the '.path_line' class which will enable
Here's some styles to get started:

```css
.mask{fill:#B5B5B5; stroke:none;}
.progress_path{fill:none; stroke-linecap:butt; stroke-width:500; stroke:#5EB902;}
.path_line{fill:none; stroke-linecap:round; stroke-width:2; stroke:#666666; stroke-dasharray: 5, 5; opacity: 0;}
```

## Options

To configure with some options, pass a plain object to the options argument of the constructor like this:

```javascript
var svg_obj = document.getElementById('mysvg');
var mySVGBar = new SVGBar({
    svg:                svg_obj,
    mask:               svg_obj.getElementById('my_mask'),
    paths:              svg_obj.getElementsByClassName('paths_for_progress'),
    animation_length:   3000,
    track_mouse:        'x'
});
```

### svg
A refernce to the DOM element containing the SVG

### mask
A reference to the DOM element inside the SVG element which is the path to use for masking

### paths
A NodeList of all `<path>` elements in the SVG element which should be used in conjunction with the mask.

### animation_length
Length for the animation in milliseconds. Default is 5000.

### track_mouse
Use this to enable a mouse handler for the svg, which will tie the movement of the mouse within the svg tag to the progress of the progress bar.
Possible values are: 'x', 'y', '-x', '-y' 

## Usage

### setProgress(percent)
Sets the position of the progress bar as a percentage from 0 -> 1.
Useful to put inside a handler on the page for keyboard presses, AJAX calls, mouse movement etc.
```javascript
mySVGBar.setProgress(0.4);
```

### displayPathLine(will_show)
Show or hide an outline of the path the progress bar is following (great for debugging)
```javascript
mySVGBar.displayPathLine(true);
```

### togglePathLine()
Toggle visiblity of path line
```javascript
mySVGBar.togglePathLine();
```

### setAnimationState(will_show)
Start or stop animating the progress bar back and forth from 0 -> 100%
```javascript
mySVGBar.setAnimationState(true);
```

### toggleAnimationState()
Toggle play/stop state of animation
```javascript
mySVGBar.toggleAnimationState();
```