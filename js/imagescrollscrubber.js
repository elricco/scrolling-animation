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
            // needs to be undefined or animation will already start animating while not in view
            let hitPoint;
            // playbackConst determined by experimentation
            const playbackConst = 33;
            // .height-container closest (up the dom) to element (canvas)
            const heightContainer = el.closest('.height-container');
            // frameCount set as data attribute at element (canvas)
            const frameCount = el.dataset.framecount;
            // first image set as data attribute at element (canvas)
            const image = el.dataset.desktopImage;

            const firstImage = d.createElement('img');
            firstImage.classList.add('d-none');

            firstImage.onload = function() {
                console.log(this.width + ' x ' + this.height);
                el.width = this.width;
                el.height = this.height;
            };

            firstImage.src = image;
            // deconstruct string of image by last underscore _ filenames have to be name-xyz_0000.jpg,  name-xyz_0001.jpg, etc.
            const imageString = image.substr(0, image.lastIndexOf('_'));

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

            // start with preloading the images of the element (canvas)
            preloadImages();
        });
    }
}
