export function videoScrollScrubber() {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(document.getElementById('poster'), 0, 0, 1000, 1000);

    let hitPoint = 0;
    const settedHeight = 0;

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                var attributeValue = $(mutation.target).prop(mutation.attributeName);
                console.log('Class attribute changed to:', attributeValue);
                if ($(mutation.target).hasClass('stuck')) {
                    // window.requestAnimationFrame(scrollPlay);
                }
            }
        });
    });

    const waypoint = new Waypoint({
        element: document.getElementById('set-height'),
        handler: function() {
            console.log('Basic waypoint triggered ' + this.triggerPoint);
            hitPoint = this.triggerPoint;
            // window.requestAnimationFrame(scrollPlay);
            // document.getElementById('set-height').classList('stuck');
        },
        offset: '0'
    });

    var inview = new Waypoint.Inview({
        element: $('#set-height')[0],
        enter: function(direction) {
            console.log('Enter triggered with direction ' + direction);
            window.requestAnimationFrame(scrollPlay);
        },
        entered: function(direction) {
            console.log('Entered triggered with direction ' + direction);
        },
        exit: function(direction) {
            console.log('Exit triggered with direction ' + direction);
        },
        exited: function(direction) {
            console.log('Exited triggered with direction ' + direction);
            window.requestAnimationFrame(scrollPlay);
        }
    });

    let frameNumber = 0; // start video at frame 0
    // lower numbers = faster playback
    const playbackConst = 1000;
    // get page height from video duration
    const setHeight = document.getElementById('set-height');
    // select video element
    const vid = document.getElementById('v0');
    // var vid = $('#v0')[0]; // jquery option

    observer.observe(setHeight, {
        attributes: true
    });

    // dynamically set the page height according to video length
    vid.addEventListener('loadedmetadata', function() {
        canvas.width = vid.videoWidth;
        canvas.height = vid.videoHeight;
        setHeight.style.height = (vid.duration + 0.5) * playbackConst + 'px';
    });

    // Use requestAnimationFrame for smooth playback
    function scrollPlay() {
        const lastFrame = vid.duration;
        frameNumber = (window.pageYOffset - hitPoint) / playbackConst;
        vid.currentTime = frameNumber;
        ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
        // console.log(frameNumber + ' ' + (lastFrame - 0.5));
        // remove half a second for safari
        // so faster scrolling or overscrolling doesn't "hurt"
        // and the video is not "whitened"
        if (frameNumber < (lastFrame - 0.5)) {
            window.requestAnimationFrame(scrollPlay);
        }
    }
}
