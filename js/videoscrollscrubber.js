export function videoScrollScrubber() {
    let hitPoint = 0;
    const settedHeight = 0;

    const waypoint = new Waypoint({
        element: document.getElementById('v0'),
        handler: function() {
            console.log('Basic waypoint triggered ' + this.triggerPoint);
            hitPoint = this.triggerPoint;
            window.requestAnimationFrame(scrollPlay);
        },
        offset: '50%'
    });
    let frameNumber = 0; // start video at frame 0
    // lower numbers = faster playback
    const playbackConst = 1000;
    // get page height from video duration
    const setHeight = document.getElementById('set-height');
    // select video element
    const vid = document.getElementById('v0');
    // var vid = $('#v0')[0]; // jquery option

    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    // dynamically set the page height according to video length
    vid.addEventListener('loadedmetadata', function() {
        canvas.width = vid.videoWidth;
        canvas.height = vid.videoHeight;
        setHeight.style.height = (vid.duration + 0.5) * playbackConst + 'px';
    });

    vid.addEventListener('ended', captureFrame);

    function captureFrame(e) {
        const lastFrame = this.duration;
        this.currentTime = lastFrame;
        this.pause();
    }

    // Use requestAnimationFrame for smooth playback
    function scrollPlay() {
        const lastFrame = vid.duration;
        frameNumber = (window.pageYOffset - hitPoint) / playbackConst;
        vid.currentTime = frameNumber;
        ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
        console.log(frameNumber + ' ' + (lastFrame - 0.5));
        // remove half a second for safari
        // so faster scrolling or overscrolling doesn't "hurt"
        // and the video is not "whitened"
        if (frameNumber < (lastFrame - 0.5)) {
            window.requestAnimationFrame(scrollPlay);
        }
    }
}
