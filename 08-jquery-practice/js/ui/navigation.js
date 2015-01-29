var Navigation = (function() {
    'use strict';

    var $lastPage = false;
    var $curPage = false;
    var animatingQueue = [];
    var activeClass = 'is-active';
    var animationEnd = 'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd';

    function changePage(selector) {
        animatingQueue = [];
        if ($curPage) {
            $lastPage = $curPage;

            animatingQueue.push(1);
            $lastPage
                .one(animationEnd, animationEndHandler)
                .addClass('pt--scaleDownUp');
        }

        animatingQueue.push(1);
        $curPage = $(selector)
            .one(animationEnd, animationEndHandler)
            .addClass('pt--scaleUp pt--delay300 ' + activeClass);
    }

    function animationEndHandler() {
        animatingQueue.pop();
        if (!animatingQueue.length) {
            endAnimation();
        }
    }

    function endAnimation() {
        $curPage
            .attr('class', $curPage.data('initialClassList') + ' ' + activeClass)
            .off(animationEnd) // for the case, when we need to stop animation emmidiately
            ;

        if ($lastPage) {
            $lastPage
                .attr('class', $lastPage.data('initialClassList'))
                .off(animationEnd) // for the case, when we need to stop animation emmidiately
                ;
        }
    }

    function navigateTo(hash, options) {
        var id = '#' + hash;
        var $section = $(id);
        var $a = $('#nav').find('[href*="'+id+'"]');
        var $li = $a.closest('li');
        var canNavigate = $section.length && !$li.hasClass(activeClass);
        if (!!animatingQueue.length) {
            endAnimation();
        }

        if (canNavigate) {
            $('#nav').find('li').removeClass(activeClass);
            changePage($section);
            $li.addClass(activeClass);
        }
    }

    function memorizeClasses($elements) {
        $elements.each(function() {
            $(this).data('initialClassList', this.className);
        });
    }

    function Navigation($pages) {
        memorizeClasses($pages);
    }

    Navigation.prototype.navigateTo = navigateTo;
    return Navigation;
}());
