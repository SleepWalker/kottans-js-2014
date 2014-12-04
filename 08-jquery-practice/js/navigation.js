$(function() {
    'use strict';

    // TODO: on hash change
    var $lastPage = false;
    var $curPage = false;
    var animatingQueue = [];
    var activeClass = 'is-active';
    var animationEnd = 'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd';
    function memorizeClasses($elements) {
        $elements.each(function() {
            $(this).data('initialClassList', this.className);
        });
    }
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

    $('#nav').on('click', 'a', function() {
        navigateTo(this.hash);
    });

    function animationEndHandler() {
        animatingQueue.pop();
        if (animatingQueue.length == 0) {
            $curPage.attr('class', $curPage.data('initialClassList') + ' ' + activeClass);
            $lastPage.attr('class', $lastPage.data('initialClassList'));
        }
    }

    function navigateTo(hash) {
        var $section = $(hash);
        var $a = $('#nav').find('[href$="'+hash+'"]');
        var $li = $a.closest('li');
        var canNavigate = $section.length && animatingQueue.length == 0 && !$li.hasClass('active');
        if (canNavigate) {
            $('#nav').find('li').removeClass('active');
            changePage($section);
            $li.addClass('active');
        }
    }

    var $sections = $('.section');
    memorizeClasses($sections);
    navigateTo(location.hash ? location.hash : '#login');
})