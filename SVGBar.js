// Wrapper for SVGBar
(function() {
    
    // Define our constructor
    this.SVGBar = function() {

        // Global, public flags 
        this.is_pathline_visible = false;   // Flag for display of dashed centreline    
        this.is_animating = false;          // Flag for whether currently animating
        this.curr_path;

        // Define option defaults
        var defaults = {
            svg: document.getElementsByTagName('svg')[0],
            anim_length: 5000
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

        // Set the initial path reference
        this.setPath(this.options.paths[0]);

        // Do stuff!
        init_bars(this.options.paths, this.options.mask);
        
    }

    // Public Methods

    SVGBar.prototype.setPath = function(path_to_set){
        this.curr_path = path_to_set;
    }

    SVGBar.prototype.resetBars = function(){
        [].forEach.call(this.options.paths, function (path) {
            path.style.strokeDashoffset = path.getTotalLength();
            path.style.animation = 'none';

            var path = document.querySelector('#'+path.getAttribute('id')+"_path_line");
            path.style.opacity = 0;
        });
        this.displayPathLine(this.is_pathline_visible);
        this.setAnimation(this.is_animating);
    }

    // Starts or stops the animation of the rev bar
    SVGBar.prototype.setAnimation = function(is_playing){
        this.is_animating = is_playing;
        if(!is_playing){
            $(".animate").removeClass("selected");
            this.curr_path.style.animation = 'none';
        }else{
            $(".animate").addClass("selected");
            this.curr_path.style.animation = 'anim_'+this.curr_path.getAttribute('id') + ' ' + this.options.anim_length+'ms linear alternate infinite';
        }
    }
       
    // Shows or hides the centreline for the current path
    SVGBar.prototype.displayPathLine = function(will_show){
        var path = document.querySelector('#'+this.curr_path.getAttribute('id')+"_path_line");
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
        var length = this.curr_path.getTotalLength();
        this.curr_path.style.strokeDashoffset = length - (length*percent);
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
    function init_bars(paths, mask){
        
        var svgNs = 'http://www.w3.org/2000/svg';

        var svg_obj = document.querySelector('#svg_anim');

        var defs;
        if(svg_obj.getElementsByTagName('defs').length > 0){
            defs = svg_obj.getElementsByTagName('defs')[0];
        }else{
            defs = document.createElementNS(svgNs, 'defs');
            svg_obj.appendChild(defs);
        }
        var clippath = document.createElementNS(svgNs, 'clipPath'); // Needs createElementNS as per https://gist.github.com/ufologist/be47161b2f960f941259
        clippath.setAttribute('id','mask');
        defs.appendChild(clippath);

        var new_mask = mask.cloneNode(true);
        clippath.appendChild(new_mask);

        [].forEach.call(paths, function (path) {
           // var path = document.querySelector(el);
            var length = path.getTotalLength();

            var path_line = path.cloneNode(true);
            path_line.setAttribute('id', path_line.getAttribute('id')+'_path_line')
            path_line.removeAttribute('class');
            path_line.classList.add('path_line');

            svg_obj.appendChild(path_line);

            path.style.clipPath = "url(#mask)";

            // Set up the starting positions
            path.style.strokeDasharray = length + ' ' + length;
            path.style.strokeDashoffset = length;

            // Create the keyframe animation based upon the animation length
            var style = document.createElement('style');
            style.type = 'text/css';
            var keyFrames = '\
            @keyframes anim_'+path.getAttribute('id')+' {\
                0% {\
                    stroke-dashoffset: PATH_LENGTH;\
                }\
                100% {\
                    stroke-dashoffset: 0;\
                }\
            }';
            style.innerHTML = keyFrames.replace(/PATH_LENGTH/g, length);
            document.getElementsByTagName('head')[0].appendChild(style);
        });
    }

}());