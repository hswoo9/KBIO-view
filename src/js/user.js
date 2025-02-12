$(function() {

    $('header .sitemap .bg, header .sitemap .closeBtn').on('click', function() {
        $('header .sitemap').removeClass('open')
        $('html, body').css('overflow', 'visible');
    })

    function header() {
        $('header .hInner .hTop .alarmWrap .alarmBtn').on('click', function() {
            $(this).parent('.alarmWrap').toggleClass('click')
        })
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

    // 탭 클릭

    function tab() {
        $(".tabContWrap .tabBox li").on('click', function () {
            let index = $(this).index();

            $(".tabCont").removeClass("active");
            $(".tabCont").eq(index).addClass("active");
        });
    }
    tab()

    function main() {

        $('.user').addClass('main');

        var helpers = {
            addZeros: function (n) {
                return (n < 10) ? n : '' + n;
            }
        };

        function sec01Slide() {
            var $slider = $('.sec01 .bgSlide');
            $slider.each(function() {
                var $sliderParent = $(this).parent();
                $(this).slick({
                    infinite: false,
                    slidesToShow : 1,
                    slidesToScroll : 1,
                    speed : 400,
                    arrows : true,
                    prevArrow : ".sec01 .prevBtn",
                    nextArrow : ".sec01 .nextBtn",
                    asNavFor: '.sec01 .textSlide',
                    fade:true,
                    autoplay : true,
                    autoplaySpeed : 8000,
                    pauseOnFocus: false,
                    pauseOnHover: false,
                    rows: 0,

                });


                $(this).on('afterChange', function(event, slick, currentSlide){
                    $('.nowPage').html(helpers.addZeros('0' + (currentSlide + 1)));

                    var $bar = $('.main .sec01 .inner .leftBox .slideControl .slideBar .bar');
                    $bar.css('animation', 'none'); // 애니메이션 초기화
                    setTimeout(function() {
                        $bar.css('animation', 'widthMove 8s linear both');
                    }, 10); // 약간의 지연을 줘야 애니메이션이 다시 실행됨
                });

                var sliderItemsNum = $(this).find('.slick-slide').not('.slick-cloned').length;
                $sliderParent.find('.totalPage').html(helpers.addZeros( '0' + sliderItemsNum));

            });
        };
        sec01Slide();

        var Slidebtn = 0;
        $('.sec01 .pauseBtn').click(function(){
            if(Slidebtn==0){
                $('.sec01 .pauseBtn').addClass('on');
                $('.sec01 .bgSlide').slick('slickPause');
                Slidebtn = 1;
            } else{
                $('.sec01 .pauseBtn').removeClass('on');
                $('.sec01 .bgSlide').slick('slickPlay');
                Slidebtn = 0;
            }
        });

        $('.sec01 .textSlide').slick({
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            asNavFor: '.sec01 .bgSlide',
            prevArrow : false,
            nextArrow : false,
            rows: 0,
            focusOnSelect: false,
            speed: 0,
            draggable: false,
        });



        // sec02
        var institutionSwiper = new Swiper(".sec02 .institution_swiper", {
            slidesPerView: "auto",
            slidesPerGroup: 1,
            // spaceBetween: "2.5%",
            loop: true,
            centeredSlides: true,
            autoplay: {
                delay: 4000,
            },
            navigation: {
                nextEl: ".sec02 .nextBtn",
                prevEl: ".sec02 .prevBtn",
            },
        });

        var slideBtn2 = 0;
        $('.sec02 .pauseBtn').click(function () {
            if (slideBtn2 === 0) {
                institutionSwiper.autoplay.stop();
                $(this).addClass('on');
                slideBtn2 = 1;
            } else {
                institutionSwiper.autoplay.start();
                $(this).removeClass('on');
                slideBtn2 = 0;
            }
        });

        // sec04
        var bannerSwiper = new Swiper(".sec04 .bannerSwiper", {
            slidesPerView: 1,
            effect: "fade",
            autoplay: {
                delay: 4000,
            },
            navigation: {
                nextEl: ".sec04 .bannerBox .nextBtn",
                prevEl: ".sec04 .bannerBox .prevBtn",
            },
            pagination: {
                el: ".sec04 .swiper-pagination",
                clickable: true,
            },
        });

        var slideBtn3 = 0;
        $('.sec04 .bannerBox .pauseBtn').click(function () {
            if (slideBtn3 === 0) {
                bannerSwiper.autoplay.stop();
                $(this).addClass('on');
                slideBtn3 = 1;
            } else {
                bannerSwiper.autoplay.start();
                $(this).removeClass('on');
                slideBtn3 = 0;
            }
        });

        function setFlowBanner() {
            const wrap = $('.rollingWrap .moveWrap');
            const list = $('.rollingWrap .moveWrap .imgMove');
            let wrapWidth = '';
            let listWidth = '';
            const speed = 15;

            let $clone = list.clone();
            wrap.append($clone);
            flowBannerAct();

            let oldWChk = window.innerWidth > 1279 ? 'pc' : window.innerWidth > 767 ? 'ta' : 'mo';
            $(window).on('resize', function() {
                let newWChk = window.innerWidth > 1279 ? 'pc' : window.innerWidth > 767 ? 'ta' : 'mo';
                if (newWChk !== oldWChk) {
                    oldWChk = newWChk;
                    flowBannerAct();
                }
            });

            function flowBannerAct() {
                if (wrapWidth !== '') {
                    wrap.find('.imgMove').css({ 'animation': 'none' });
                    wrap.find('.imgMove').slice(2).remove();
                }
                wrapWidth = wrap.width();
                listWidth = list.width();

                if (listWidth < wrapWidth) {
                    const listCount = Math.ceil(wrapWidth * 2 / listWidth);
                    for (let i = 2; i < listCount; i++) {
                        $clone = $clone.clone();
                        wrap.append($clone);
                    }
                }

                wrap.find('.imgMove').css({
                    'animation': `${listWidth / speed}s linear infinite flowRolling`
                });
            }
        }
        setFlowBanner()

    }
    if ($('.container').hasClass('main')) {
        main()
    }


})