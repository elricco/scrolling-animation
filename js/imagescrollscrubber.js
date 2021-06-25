require('../node_modules/waypoints/lib/jquery.waypoints.min');
require('../node_modules/waypoints/lib/shortcuts/inview.min');

export function imageScrollScrubber() {
    const d = document;
    const html = document.documentElement;
    const imageAnimations = d.querySelectorAll('.image-scroll-scrubber');
    let hitPoint;

    if (imageAnimations) {
        [].slice.call(imageAnimations).map(function(el) {
            const playbackConst = 33;
            const heightContainer = el.closest('.height-container');
            const context = el.getContext('2d');
            const frameCount = el.dataset.framecount;
            const image = el.dataset.firstImage;
            const imageString = image.substr(0, image.lastIndexOf('_'));
            console.log(frameCount);

            heightContainer.style.height = Math.ceil((frameCount * playbackConst)) + 'px';

            const waypoint = new Waypoint({
                element: heightContainer,
                handler: function() {
                    console.log('Basic waypoint triggered ' + this.triggerPoint);
                    hitPoint = this.triggerPoint;
                },
                offset: '0'
            });

            const observer = new IntersectionObserver(
                ([e]) => requestAnimationFrame(() => updateImage(currentFrame)),
                { threshold: [0] }
            );

            observer.observe(heightContainer);

            const currentFrame = index => (
                `${imageString}_${index.toString().padStart(4, '0')}.jpg`
            );

            const preloadImages = () => {
                for (let i = 1; i < frameCount; i++) {
                    const img = new Image();
                    img.src = currentFrame(i);
                }
            };

            const img = new Image();
            img.src = currentFrame(1);
            el.width = 1000;
            el.height = 1000;
            img.onload = function() {
                context.drawImage(img, 0, 0);
            };

            const updateImage = index => {
                if (index >= 0) {
                    img.src = currentFrame(index);
                    context.drawImage(img, 0, 0);
                }

                const scrollTop = window.pageYOffset - hitPoint;
                const maxScrollTop = Math.ceil((frameCount * playbackConst)) - hitPoint;
                const scrollFraction = scrollTop / maxScrollTop;
                const frameIndex = Math.min(
                    frameCount - 1,
                    Math.ceil(scrollFraction * frameCount)
                );

                requestAnimationFrame(() => updateImage(frameIndex + 1));
            };

            preloadImages();
        });
    }
}
