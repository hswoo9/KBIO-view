$(function() {


	$('header .sitemap .bg, header .sitemap .closeBtn').on('click', function() {
    $('header .sitemap').removeClass('open')
    $('html, body').css('overflow', 'visible');
	})

	function header() {

      // 메뉴 효과
      $('.navBox, .lnbBox').each(function () {
          const container = $(this);
          const li = container.find('li');
          const bg = container.find('.bg');
          const bgHover = container.find('.bg.hover');

          function updateBgToActive() {
              const $activeItem = li.filter('.active');
              if ($activeItem.length) {
                  if (container.hasClass('lnbBox')) {
                      // For .lnbBox, use left and bottom
                      bg.css({
                          width: `${$activeItem.outerWidth()}px`,
                          left: `${$activeItem.position().left}px`,
                          bottom: `${container.outerHeight() - ($activeItem.position().top + $activeItem.outerHeight())}px`,
                          opacity: '1',
                      });
                  } else {
                      // For .navBox, use top
                      bg.css({
                          width: `${$activeItem.outerWidth()}px`,
                          top: `${$activeItem.position().top}px`,
                          height: `${$activeItem.outerHeight()}px`,
                          opacity: '1',
                      });
                  }
                  bgHover.css('opacity', '0');
              } else {
                  bg.css({ width: '0', height: '0', top: '0', left: '0', opacity: '0' });
              }
          }

          li.hover(
              function () {
                  const liWidth = $(this).outerWidth();
                  const liHeight = $(this).outerHeight();
                  if (container.hasClass('lnbBox')) {
                      const liLeft = $(this).position().left;
                      const liBottom = container.outerHeight() - ($(this).position().top + liHeight);
                      bgHover.css({
                          width: `${liWidth}px`,
                          left: `${liLeft}px`,
                          bottom: `${liBottom}px`,
                          opacity: '1',
                      });
                  } else {
                      const liOffsetTop = $(this).position().top;
                      bgHover.css({
                          width: `${liWidth}px`,
                          top: `${liOffsetTop}px`,
                          height: `${liHeight}px`,
                          opacity: '1',
                      });
                  }
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

          $(window).on('resize', updateBgToActive);

          updateBgToActive();
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

  function htmlResize() {
    if ($(window).width() < 769) {
      if (!$('body').hasClass('pcOnly')) {
          $('html').css('background', '#fff');
      }
    }  else {
      if (!$('body').hasClass('pcOnly') || !$('.container').hasClass('mypage')|| !$('.container').hasClass('mypage')) {
          $('html').css('background', '#f5f5f5');

          if ($('.container').hasClass('setting') || $('.container').hasClass('mypage')) {
              $('html').css('background', '#fff');
          }
      }
    }
  }

  htmlResize();
  $(window).resize(htmlResize);

})