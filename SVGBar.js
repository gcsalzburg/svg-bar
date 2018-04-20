// Wrapper for SVGBar
(function() {
    
    // Define our constructor
    SVGBar = function() {

        // Global, public flags 
        this.is_pathline_visible = false;   // Flag for display of dashed centreline    
        this.is_animating = false;          // Flag for whether currently animating

        // Private variables
        var curr_path;                      // Current path being shown            

        // Define option defaults
        var defaults = {
            svg:                document.getElementsByTagName('svg')[0],
            animation_length:   5000
        }
        
        // Create options by extending defaults with the passed in arugments
        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = extendDefaults(defaults, arguments[0]);
        }else{
            this.options = defaults;
        }

        // Populate mask and path parameters if they were not passed in
        // We do this so that we use the svg option, in case that was passed in too
        if(!this.options.paths){
            this.options.paths = this.options.svg.getElementsByClassName('progress_path');
        }
        if(!this.options.mask){
            this.options.mask = this.options.svg.getElementsByClassName('mask')[0];
        }

        // Attach mouse handler if necessary,
        var tm = this.options.track_mouse;
        if((tm == 'x')||(tm == 'y')||(tm == '-x')||(tm == '-y')){
            addMouseHandler(this, this.options.svg, tm);
        }

        // Getter and setter for current path
        this.setPath = function(path_to_set){
           if(path_to_set.getAttribute('data-svgbar-ispath') == "true"){
                curr_path = path_to_set;
                resetBars(this.options.paths,this);
                return true;
            }
            return false;
        }
        this.getPath = function(){
            return curr_path;
        }

        // Setup all of the progress bars
        init_bars(this.options.svg, this.options.paths, this.options.mask);

        // Set the initial path
        this.setPath(this.options.paths[0]);
    }

    // Starts or stops the animation of the rev bar
    SVGBar.prototype.setAnimationState = function(will_play){
        this.is_animating = will_play;
        if(!will_play){
            this.getPath().style.animation = 'none';
        }else{
            this.getPath().style.animation = this.getPath().getAttribute('data-svgbar-anim-name') + ' ' + this.options.animation_length+'ms linear alternate infinite';
        }
        return this.is_animating;
    }

    // Toggle between playing and paused animation
    SVGBar.prototype.toggleAnimationState = function(){
        return this.setAnimationState(!this.is_animating); 
    }
       
    // Shows or hides the centreline for the current path
    SVGBar.prototype.displayPathLine = function(will_show){
        var path = document.querySelector('#'+this.getPath().getAttribute('data-svgbar-path_line-id'));
        this.is_pathline_visible = will_show;
        if(!will_show){
            $(".toggle").removeClass("selected");
            path.style.opacity = 0;
        }else{
            $(".toggle").addClass("selected");
            path.style.opacity = 1;
        }
    }

    // Toggle visible state of the path line
    SVGBar.prototype.togglePathLine = function(){
        this.displayPathLine(!this.is_pathline_visible);
    }

    
    // Sets the percentage fill of a rev bar, used for tying to mouse movement
    SVGBar.prototype.setProgress = function(percent){
        var length = this.getPath().getTotalLength();
        this.getPath().style.strokeDashoffset = length - (length*percent);
    }

    // Utility method to extend defaults with user options
    function extendDefaults(source, properties) {
        var property;
        for (property in properties){
            if (properties.hasOwnProperty(property)){
                source[property] = properties[property];
            }
        }
        return source;
    }

    // Clone and create SVG objects required for masking and path line displays
    function init_bars(svg_tag, paths, mask){
        
        // Reference to namespace
        // We need to use createElementNS later on
        // Further details found here: https://gist.github.com/ufologist/be47161b2f960f941259
        var svgNs = 'http://www.w3.org/2000/svg';

        // Create <defs> tag, if it doesn't exist
        var defs;
        if(svg_tag.getElementsByTagName('defs').length > 0){
            defs = svg_tag.getElementsByTagName('defs')[0];
        }else{
            defs = document.createElementNS(svgNs, 'defs');
            svg_tag.appendChild(defs);
        }

        // Create a unique name for the mask id to refer to it in the clippath CSS
        var clippath_name = "svgbar-mask-" + Date.now().toString().slice(-8);

        // Create a new <clippath> tag
        var clippath = document.createElementNS(svgNs, 'clipPath');
        clippath.setAttribute('id',clippath_name);
        defs.appendChild(clippath);

        // Add the mask to the <clippath> tag
        var new_mask = mask.cloneNode(true);
        clippath.appendChild(new_mask);

        // Iterate over paths
        var count = 0;
        [].forEach.call(paths, function (path) {

            // Create names for the animation and pathline
            var path_line_id = "svgbar-path-line-" + Date.now().toString().slice(-8) + count;
            var anim_name = "svgbar-anim-" + Date.now().toString().slice(-8) + count;
 
            // Calculate total length of this path
            var length = path.getTotalLength();

            // Clone to create a path line for displaying if necessary
            var path_line = path.cloneNode(true);
            path_line.setAttribute('id', path_line_id)
            path_line.removeAttribute('class');
            path_line.classList.add('path_line');
            svg_tag.appendChild(path_line);

            // Set clipping mask for the path
            path.style.clipPath = 'url(#'+clippath_name+')';

            // Set up the starting positions
            path.style.strokeDasharray = length + ' ' + length;
            path.style.strokeDashoffset = length;

            // Save names of animation and path_line for future reference
            // Save a flag that we have processed this path
            path.setAttribute('data-svgbar-anim-name',anim_name);
            path.setAttribute('data-svgbar-path_line-id',path_line_id);
            path.setAttribute('data-svgbar-ispath',true);

            // Create the keyframe animation based upon the animation length
            var style = document.createElement('style');
            style.type = 'text/css';
            var keyFrames = '\
            @keyframes '+anim_name+' {\
                0% {\
                    stroke-dashoffset: PATH_LENGTH;\
                }\
                100% {\
                    stroke-dashoffset: 0;\
                }\
            }';
            style.innerHTML = keyFrames.replace(/PATH_LENGTH/g, length);
            document.getElementsByTagName('head')[0].appendChild(style);

            count++;    // Increment counter to keep names unique
        });
    }
    
    // Put all bars back to how they were
    function resetBars(paths,svgbar){
        [].forEach.call(paths, function (path) {
            path.style.strokeDashoffset = path.getTotalLength();
            path.style.animation = 'none';

            var path = document.querySelector('#'+path.getAttribute('data-svgbar-path_line-id'));
            path.style.opacity = 0;
        });
        svgbar.displayPathLine(svgbar.is_pathline_visible);
        svgbar.setAnimationState(svgbar.is_animating);
    }

    // Attaches a handler to tie the mouse movement within the SVG to the total progress
    function addMouseHandler(svgbar, svg_tag, dir){
        if(dir.substr(-1) == 'x'){
            // Horizontal
            svg_tag.addEventListener('mousemove',function(e){
                var svg_pos = svg_tag.getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                var percent = (e.pageX - (svg_pos.left+scrollLeft)) / svg_pos.width;
                if(dir.substr(0,1) == '-'){
                    percent = 1-percent;
                }
                svgbar.setProgress(percent);
            });
        }else{
            // Vertical
            svg_tag.addEventListener('mousemove',function(e){
                var svg_pos = svg_tag.getBoundingClientRect(),
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                var percent = (e.pageY - (svg_pos.top+scrollTop)) / svg_pos.height;
                if(dir.substr(0,1) == '-'){
                    percent = 1-percent;
                }
                svgbar.setProgress(percent);
            });
        }    
    }
}());