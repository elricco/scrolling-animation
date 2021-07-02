require('../node_modules/waypoints/lib/jquery.waypoints.min');
require('../node_modules/waypoints/lib/shortcuts/inview.min');

export function imageScrollScrubber() {
    // i'm lazy - i know
    const d = document;
    // select all canvases
    const imageAnimations = d.querySelectorAll('.image-scroll-scrubber');

    if (imageAnimations) {
        [].slice.call(imageAnimations).map(function(el) {
            // canvas context in 2d because images
            const context = el.getContext('2d');
            // canvas fillStyle
            context.fillStyle = el.dataset.fillStyle ? el.dataset.fillStyle : '#FFFFFF';
            // playbackConst determined by experimentation
            const playbackConst = 33;
            // .height-container closest (up the dom) to element (canvas)
            const heightContainer = el.closest('.height-container');
            // frameCount set as data attribute at element (canvas)
            const frameCount = el.dataset.framecount;
            // initial ratios
            let intitalRatio = window.innerWidth / window.innerHeight;
            let ratio = window.innerWidth / window.innerHeight;

            // needs to be undefined or animation will already start animating while not in view
            let hitPoint;
            // first image set as data attribute at element (canvas)
            let image = el.dataset.desktopImage;
            // if ratio is <= 1 use the 9x16 version of the animation images
            if (ratio <= 1) {
                image = el.dataset.mobileImage;
            }

            const drawFirstImageForDimensions = () => {
                // create image element in document - is needed to get the actual dimensions
                const firstImage = d.createElement('img');

                // onload event
                firstImage.onload = function() {
                    el.width = this.width;
                    el.height = this.height;
                };

                // load image
                firstImage.src = image;
            };

            // draw immediately to set dimension as soon as possible
            drawFirstImageForDimensions();

            // deconstruct string of image by last underscore _ filenames have to be name-xyz_0000.jpg,  name-xyz_0001.jpg, etc.
            let imageString = image.substr(0, image.lastIndexOf('_'));

            // set heigt of wrapping container for enought stickyness and scrolling
            heightContainer.style.height = Math.ceil((frameCount * playbackConst)) + 'px';

            // get hitPoint of wrapping container
            const waypoint = new Waypoint({
                element: heightContainer,
                handler: function() {
                    console.log('Basic waypoint triggered ' + this.triggerPoint);
                    hitPoint = this.triggerPoint;
                },
                offset: '0'
            });

            // start animating when wrapping container is stuck
            const observer = new IntersectionObserver(
                ([e]) => requestAnimationFrame(() => updateImage(currentFrame)),
                { threshold: [0] }
            );

            // start obeserving wrapping container
            observer.observe(heightContainer);

            // set current frame
            const currentFrame = index => (
                `${imageString}_${index.toString().padStart(4, '0')}.jpg`
            );

            // preload all images for smooth playback
            const preloadImages = () => {
                for (let i = 1; i < frameCount; i++) {
                    const img = new Image();
                    img.src = currentFrame(i);
                }
            };

            // draw first image so canvas is not empty
            const img = new Image();
            img.src = currentFrame(1);
            img.onload = function() {
                context.drawImage(img, 0, 0);
            };

            // constantly update image when scrolling
            const updateImage = index => {
                // only "request" images when index is greater than zero - or you get a 404 of non existent images
                if (index >= 0) {
                    img.src = currentFrame(index);
                    context.drawImage(img, 0, 0);
                }

                // start at the right start point in space
                const scrollTop = window.pageYOffset - hitPoint;
                // calculate end point in space for animation to finish while in view
                const maxScrollTop = Math.ceil((frameCount * playbackConst)) - hitPoint;
                // between 0 and 1
                const scrollFraction = scrollTop / maxScrollTop;
                // calculate frame index
                const frameIndex = Math.min(
                    frameCount - 1,
                    Math.ceil(scrollFraction * frameCount)
                );

                // repeat image update process
                requestAnimationFrame(() => updateImage(frameIndex + 1));
            };

            // debug stuff
            const heightOutput = document.querySelector('#height');
            const widthOutput = document.querySelector('#width');
            const ratioOutput = document.querySelector('#ratio');

            const reportWindowSize = () => {
                // get actual ratio here again
                ratio = window.innerWidth / window.innerHeight;

                // debug stuff
                heightOutput.textContent = window.innerHeight;
                widthOutput.textContent = window.innerWidth;
                ratioOutput.textContent = ratio;

                // only redraw everything on change of ratios
                if (ratio <= 1 && intitalRatio >= 1) {
                    // get different image set
                    image = el.dataset.mobileImage;
                    // decontruct string agoin to load right images
                    imageString = image.substr(0, image.lastIndexOf('_'));
                    // draw the first image to set new dimensions of element (canvas)
                    drawFirstImageForDimensions();
                    // start with preloading the images of the element (canvas)
                    preloadImages();
                    // set intitalRatio to actual ratio to only redraw on turnign point (1)
                    intitalRatio = ratio;
                } else if (ratio >= 1 && intitalRatio <= 1) {
                    // get different image set
                    image = el.dataset.desktopImage;
                    // decontruct string agoin to load right images
                    imageString = image.substr(0, image.lastIndexOf('_'));
                    // draw the first image to set new dimensions of element (canvas)
                    drawFirstImageForDimensions();
                    // start with preloading the images of the element (canvas)
                    preloadImages();
                    // set intitalRatio to actual ratio to only redraw on turnign point (1)
                    intitalRatio = ratio;
                }
            };

            // add event listener for resize event
            window.addEventListener('resize', reportWindowSize);

            // start with preloading the images of the element (canvas)
            preloadImages();
        });
    }
}
