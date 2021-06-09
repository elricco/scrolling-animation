import $ from 'jquery';

export function smoothscroll() {
    const $root = $('html, body');

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            /*             const clickover = $(e.target);
            const _opened = $('.navbar-collapse').hasClass('show');
            if (_opened === true && !clickover.hasClass('navbar-toggler')) {
                $('button.navbar-toggler').click();
            }
 */
            var sectionTo = $(this).attr('href');
            $root.animate({
                scrollTop: $(sectionTo).offset().top
            }, 1500);
        });
    });

    // *only* if we have anchor on the url
    if (window.location.hash) {
        window.scroll(0, 0);
        // smooth scroll to the anchor id
        $root.animate({
            scrollTop: $(window.location.hash).offset().top
        }, 1500);
    }
}
