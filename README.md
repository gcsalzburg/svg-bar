# SVGBar
> Animated progress bars with variable widths and non-linear paths (i.e. squiggly).

Great for animating and controlling SVG progress bars with any of the following:
- variable widths along their profile
- non-linear paths (see the worms)
- an animation path defined separately from the progress bar shape
- multiple progress bars sharing the same mask

PlainJS - no dependencies!

![Wiggly worms](https://designedbycave.co.uk/play/svgbar/worms.gif)

## Getting started

Include the SVGBar.js file in the head of the page:
```html
<script src="/path/to/SVGBar.min.js"></script>    
```

Add your SVG to the body of your page, for example:
```html
<svg version="1.1" x="0px" y="0px" width="400px" height="200px" viewBox="0 0 400 200">
    <path class="mask" d="M375,150H25V50h350V150z"/>
    <path class="progress_path" d="M25,100h350"/>
</svg>
```

and then call:

```javascript
var mySVGBar = new SVGBar();
```

This will initialise the SVGBar with the default options:

- The first `<svg>` tag on the page will be used
- The first `<path class='mask'>` inside the svg will be used as the mask
- All of the `<path class='progress_path'>` paths will be used to create progress bars with the mask

The script will take care of building the progress bars and all other masks.

### Styling

You should add some CSS styles for the mask and progress_paths to the page so you can see something.
You can also style the '.path_line' class which will enable you to toggle on/off a view of the path line.
Here's some styles to get started:

```css
.mask{
    fill:#B5B5B5;
    stroke:none;
}
.progress_path{
    fill:none;
    stroke-linecap:butt;
    stroke-width:500;
    stroke:#5EB902;
}
.path_line{
    fill:none;
    stroke-linecap:round;
    stroke-width:2;
    stroke:#666666;
    stroke-dasharray: 5, 5;
}
```

## How it works

The progress bar uses a couple of different techniques:

- Dashed-line and dashed-offset CSS effect to create an animation along a path
- CSS clippath reference to inline SVG
- Dynamic creation and injection of CSS keyframe animations

The styling on `.progress_path` should include a stroke-width which is wider than the possible maximum width of the progress bar, to ensure the colour fill is good enough.

## Options

To configure with some options, pass a plain object to the options argument of the constructor like this:

```javascript
var svg_obj = document.getElementById('mysvg');
var mySVGBar = new SVGBar({
    svg:                svg_obj,
    mask:               svg_obj.getElementById('my_mask'),
    progress_path:      svg_obj.querySelectorAll('.paths_for_progress'),
    animation_length:   3000,
    track_mouse:        'x'
});
```

| Option | Description |
| --- | --- |
| svg | The DOM element containing the SVG |
| mask | The DOM element inside the SVG element which is the path to use for masking |
| progress_path | A NodeList or HTMLCollection all `<path>` elements in the SVG element which should be used in conjunction with the mask. Can also accept a single item. |
| animation_length | Length for the animation in milliseconds. Default is 5000. |
| track_mouse | Use this to enable a mouse handler for the svg, which will tie the movement of the mouse within the svg tag to the progress of the progress bar. Possible values are: 'x', 'y', '-x', '-y'.  |

## Methods

See **example-minimal.html** for a demo of these features.

### setProgress(percent)
Sets the position of the progress bar as a percentage from 0 -> 1.
Useful to put inside a handler on the page for keyboard presses, AJAX calls, mouse movement etc.
```javascript
mySVGBar.setProgress(0.4);
```
Chainable (returns object).

### displayPathLine(will_show)
Show or hide an outline of the path the progress bar is following (great for debugging)
```javascript
mySVGBar.displayPathLine(true);
```
Chainable (returns object).

### togglePathLine()
Toggle visiblity of path line
```javascript
mySVGBar.togglePathLine();
```
Returns true or false depending on new state of path line visibility.

### setAnimationState(will_show)
Start or stop animating the progress bar back and forth from 0 -> 100%
```javascript
mySVGBar.setAnimationState(true);
```
Chainable (returns object).

### toggleAnimationState()
Toggle play/stop state of animation
```javascript
mySVGBar.toggleAnimationState();
```
Returns true or false depending on new state of animation playback.

### setPath()
Set the visible progress bar to a given element. This element must have been passed to the constructor initially in the `progress_path` option.
```javascript
mySVGBar.setPath(document.getElementById('path1'));
```
Returns true if path could be set.

## Events

See **example-everything.html** for a demo of these features.

### progressChanged
Will fire on a progress bar `path` node every time the progress changes. Read in the `detail.progress` value to get the current progress bar position.
```javascript
document.addEventListener("progressChanged",function(e){
    console.log(e.detail.progress);
});
```

## Future extensions

- Improve passing of masks and progress paths to couple them together more closely
- Better getter/setter methods 
- Functions should return sensible values
- Colour transition for progress bar between two values
- Add function to return current animation position