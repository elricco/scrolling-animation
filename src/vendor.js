import { smoothscroll } from '../js/smoothscroll';
import { videoScrollScrubber } from '../js/videoscrollscrubber';
import { imageScrollScrubber } from '../js/imagescrollscrubber';

require('../scss/custom-bootstrap.scss');
require('../node_modules/jquery/dist/jquery.min');
require('../node_modules/@popperjs/core/dist/umd/popper.min');
require('../node_modules/bootstrap/dist/js/bootstrap.bundle.min');

require('../node_modules/waypoints/lib/jquery.waypoints.min');
require('../node_modules/waypoints/lib/shortcuts/inview.min');

smoothscroll();
videoScrollScrubber();
imageScrollScrubber();
