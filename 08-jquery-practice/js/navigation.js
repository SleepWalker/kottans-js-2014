$(function() {
    'use strict';

    // TODO: on hash change
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
            $curPage.attr('class', $curPage.data('initialClassList') + ' ' + activeClass);

            if ($lastPage) {
                $lastPage.attr('class', $lastPage.data('initialClassList'));
            }
        }
    }

    function navigateTo(hash, options) {
        var id = '#' + hash;
        var $section = $(id);
        var $a = $('#nav').find('[href$="'+id+'"]');
        var $li = $a.closest('li');
        var canNavigate = $section.length && !animatingQueue.length && !$li.hasClass('active');
        if (canNavigate) {
            $('#nav').find('li').removeClass('active');
            changePage($section);
            $li.addClass('active');
        }
    }

    var defaultAction = 'login';
    var allowedActions = ['login', 'signup', 'list', 'view'];
    function getActionId() {
        var hash = location.hash.slice(1);

        if (hash && allowedActions.indexOf(hash) > -1) {
            return hash;
        } else {
            return defaultAction;
        }
    }

    function memorizeClasses($elements) {
        $elements.each(function() {
            $(this).data('initialClassList', this.className);
        });
    }

    (function initNavigation() {
        var $sections = $('.section');
        memorizeClasses($sections);


        navigateTo(getActionId());
        router.on('change', function() {
            navigateTo([].slice.call(arguments, 1));
        });
    }());
});
