let init = false;
export default function userJs() {
    $('header .sitemap .bg, header .sitemap .closeBtn').on('click', function() {
        $('header .sitemap').removeClass('open')
        $('html, body').css('overflow', 'visible');
    });

    function header() {
        function headerScroll() {
            function checkWrapClass() {
                const headerHeight = $('header').outerHeight();
                if ($(window).scrollTop() > 0) {
                    $('header').addClass('scroll');
                    $('.container').css('padding-top', '16.2rem')
                } else {
                    $('header').removeClass('scroll');
                    $('.container').css('padding-top', '23.9rem')
                }
            }
            checkWrapClass();

            $(window).on('scroll', function() {
                checkWrapClass();
            });
        }
        headerScroll();

        // 메뉴 효과
        $('.tabBox').each(function () {
            const container = $(this);
            const li = container.find('li');
            const bg = container.find('.bg');
            const bgHover = container.find('.bg.hover');

            function updateBgToActive() {
                const $activeItem = li.filter('.active');
                if ($activeItem.length) {
                    bg.css({
                        width: `${$activeItem.outerWidth()}px`,
                        left: `${$activeItem.position().left}px`,
                        top: `${$activeItem.position().top}px`,
                        height: `${$activeItem.outerHeight()}px`,
                        opacity: '1',
                    });
                } else {
                    bg.css({ width: '0', height: '0', top: '0', left: '0', opacity: '0' });
                }
            }

            li.hover(
                function () {
                    const liWidth = $(this).outerWidth();
                    const liHeight = $(this).outerHeight();
                    const liLeft = $(this).position().left;
                    const liTop = $(this).position().top;

                    bgHover.css({
                        width: `${liWidth}px`,
                        height: `${liHeight}px`,
                        left: `${liLeft}px`,
                        top: `${liTop}px`,
                        opacity: '1',
                    });
                },
                function () {
                    bgHover.css({ opacity: '0' });
                    updateBgToActive();
                }
            );

            li.on('click', function () {
                li.removeClass('active');
                $(this).addClass('active');
                updateBgToActive();
            });

            $(window).on('resize', function () {
                updateBgToActive(); // 창 크기 변경 시 업데이트
            });

            updateBgToActive(); // 초기 상태 업데이트
        });

    }
    header()

    function searchBox() {
        $('.container .searchBox input').on('focus', function () {
            $(this).closest('.searchBox').addClass('focus');
        }).on('blur', function () {
            $(this).closest('.searchBox').removeClass('focus');
        });

    }
    searchBox()

    function profile() {
        var profile = $('.container .commonTop .profileWrap .profile');
        var infoWrap = $('.container .commonTop .profileWrap .infoWrap')

        profile.on('mouseenter focus', function() {
            infoWrap.addClass('open')
        }).on('mouseleave blur', function() {
            infoWrap.removeClass('open')
        })

    }
    profile()


    $(document).ready(function () {
        $('select').not('.selectGroup').niceSelect();
    });


    $( document ).ready( function() {
        AOS.init();
    });



    function tabWrap() {
        $('.tabWrap .list li').on('click', function() {
            $(this).addClass('active').siblings().removeClass('active')
        })
    }

    tabWrap();

    function tab_list() {
        $('.tab_wrap').each(function() {
            var wrap = $(this);
            var list_li = wrap.find('.tab_list li');
            var tab_boxes = wrap.find('.tab_box');

            list_li.on('click', function() {
                var index = $(this).index();
                $(this).addClass('active').siblings().removeClass('active');

                if (wrap.length > 0) {
                    tab_boxes.eq(index).addClass('active').siblings('.tab_box').removeClass('active');
                }
            });
        });

        $('.tab_list li').on('click', function() {
            if ($(this).closest('.tab_wrap').length === 0) {
                $(this).addClass('active').siblings().removeClass('active');
            }
        });

    }
    tab_list()



    function animateDelay2(selector, selector2, delayTime, delayMultiplier) {
        $(selector).each(function() {
            $(this).children(selector2).each(function(index) {
                var delay = (index + 1)  / delayTime + delayMultiplier;
                $(this).css('animation-delay', delay + 's');
            });
        });
    }



    // 모달 오픈   ------------------------------------------------------------

    function modalOpen(selector, modalSeletor) {

        $(selector).on('click', function() {
            $(modalSeletor).addClass('open');
            $('html, body').css('overflow', 'hidden');
        })
    }
    modalOpen('.admin .topBox .uploadBtn', '.uploadModal');
    modalOpen('.admin .board.type2 .tableBox table .deletBtn', '.deletModal');
    modalOpen('.admin .cms .inner .contBox .infoBox .program', '.programModal');
    modalOpen('.user header .loginBtn', '.loginModal')
    modalOpen('.user header .idBtn', '.findId')
    modalOpen('.user header .pwBtn', '.findPwd')


    // 모달 닫기  ------------------------------------------------------------

    function modalClose() {
        $('.modalCon .bg, .modalCon .close, .modalCon .closeBtn').on('click', function() {
            $(this).closest('.modalCon').removeClass('open');
            $('html, body').css('overflow', 'visible');
        })
    }
    modalClose()



    // admin  ------------------------------------------------------------


    function cms() {

        $('.cms .inner .contBox .listBox .menuBox > li').on('click', function() {
            $(this).toggleClass('open')
        })

    }
    if ($('.container').hasClass('cms')) {
        cms()
    }
    
}