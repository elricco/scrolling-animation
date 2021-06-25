export function imageScrollScrubber() {
    const d = document;
    const html = document.documentElement;
    const imageAnimations = d.querySelectorAll('.image-scroll-scrubber');

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
                console.log(index);
                img.src = currentFrame(index);
                context.drawImage(img, 0, 0);
            };

            // position has to be set
            window.addEventListener('scroll', () => {
                const scrollTop = html.scrollTop;
                const maxScrollTop = html.scrollHeight - window.innerHeight;
                const scrollFraction = scrollTop / maxScrollTop;
                console.log(frameCount + ' ' + scrollTop + ' ' + maxScrollTop + ' ' + scrollFraction);
                const frameIndex = Math.min(
                    frameCount - 1,
                    Math.ceil(scrollFraction * frameCount)
                );
                console.log(frameIndex);

                requestAnimationFrame(() => updateImage(frameIndex + 1));
            });

            preloadImages();
        });
    }

/*
    const canvas = document.getElementById('hero-lightpass');

    const frameCount = 148;

    */
}
