import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import $ from 'jquery';
import React, { useEffect } from "react";
import { getSessionItem, setSessionItem } from "@/utils/storage";
import URL from "@/constants/url";
import CODE from "@/constants/code";

function ManagerLeftMember() {

  const location = useLocation();
  const sessionUser = getSessionItem("loginUser");
  const sessionUserId = sessionUser?.id;
  const sessionUserName = sessionUser?.name;
  const sessionUserSe = sessionUser?.userSe;
  const sessionUserSn = sessionUser?.userSn;

  const navigate = useNavigate();

  const logInHandler = () => {
    navigate(URL.MANAGER_LOGIN);
  };

  useEffect(() => {
    const activeTag = document.getElementsByClassName('activeTag');
    if(activeTag.length){
      const parentTag = activeTag[0].parentElement;
      if(parentTag){
        parentTag.className = "active";
      }
    }


    $(function() {
      $('header .sitemap .bg, header .sitemap .closeBtn').on('click', function() {
        $('header .sitemap').removeClass('open')
        $('html, body').css('overflow', 'visible');
      })

      function header() {

        // 메뉴 효과
        $('.leftHeader .navBox, .lnbBox').each(function () {
          const container = $(this);
          const li = container.find('li');
          const bg = container.find('.bg');
          const bgHover = container.find('.bg.hover');
          function updateBgToActive() {

            const $activeItem = li.filter('.active');

            if ($activeItem.length) {
              if (container.hasClass('lnbBox')) {
                // For .lnbBox, use left and bottom
                /* 상단 메뉴 */

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
                const liLeft = $(this).position().left;
                if (container.hasClass('lnbBox')) {
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
        var profile = $('.container .commonTop .profileWrap .profile, #commonTop .profileWrap .profile');
        var infoWrap = $('.container .commonTop .profileWrap .infoWrap, #commonTop .profileWrap .infoWrapp')

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

      $.fn.niceSelect = function(method) {

        // Methods
        if (typeof method == 'string') {
          if (method == 'update') {
            this.each(function() {
              var $select = $(this);
              var $dropdown = $(this).next('.nice-select');
              var open = $dropdown.hasClass('open');

              if ($dropdown.length) {
                $dropdown.remove();
                create_nice_select($select);

                if (open) {
                  $select.next().trigger('click');
                }
              }
            });
          } else if (method == 'destroy') {
            this.each(function() {
              var $select = $(this);
              var $dropdown = $(this).next('.nice-select');

              if ($dropdown.length) {
                $dropdown.remove();
                $select.css('display', '');
              }
            });
            if ($('.nice-select').length == 0) {
              $(document).off('.nice_select');
            }
          } else {
          }
          return this;
        }

        // Hide native select
        this.hide();

        // Create custom markup
        this.each(function() {
          var $select = $(this);

          if (!$select.next().hasClass('nice-select')) {
            create_nice_select($select);
          }
        });

        function create_nice_select($select) {
          $select.after($('<div></div>')
              .addClass('nice-select')
              .addClass($select.attr('class') || '')
              .addClass($select.attr('disabled') ? 'disabled' : '')
              .attr('tabindex', $select.attr('disabled') ? null : '0')
              .html('<span className="current"></span><ul className="list"></ul>')
          );

          var $dropdown = $select.next();
          var $options = $select.find('option');
          var $selected = $select.find('option:selected');

          $dropdown.find('.current').html($selected.data('display') || $selected.text());

          $options.each(function(i) {
            var $option = $(this);
            var display = $option.data('display');

            $dropdown.find('ul').append($('<li></li>')
                .attr('data-value', $option.val())
                .attr('data-display', (display || null))
                .addClass('option' +
                    ($option.is(':selected') ? ' selected' : '') +
                    ($option.is(':disabled') ? ' disabled' : ''))
                .html($option.text())
            );
          });
        }

        /* Event listeners */

        // Unbind existing events in case that the plugin has been initialized before
        $(document).off('.nice_select');

        // Open/close
        $(document).on('click.nice_select', '.nice-select', function(event) {
          var $dropdown = $(this);

          $('.nice-select').not($dropdown).removeClass('open');
          $dropdown.toggleClass('open');

          if ($dropdown.hasClass('open')) {
            $dropdown.find('.option');
            $dropdown.find('.focus').removeClass('focus');
            $dropdown.find('.selected').addClass('focus');
          } else {
            $dropdown.focus();
          }
        });

        // Close when clicking outside
        $(document).on('click.nice_select', function(event) {
          if ($(event.target).closest('.nice-select').length === 0) {
            $('.nice-select').removeClass('open').find('.option');
          }
        });

        // Option click
        $(document).on('click.nice_select', '.nice-select .option:not(.disabled)', function(event) {
          var $option = $(this);
          var $dropdown = $option.closest('.nice-select');

          $dropdown.find('.selected').removeClass('selected');
          $option.addClass('selected');

          var text = $option.data('display') || $option.text();
          $dropdown.find('.current').text(text);

          $dropdown.prev('select').val($option.data('value')).trigger('change');
        });

        // Keyboard events
        $(document).on('keydown.nice_select', '.nice-select', function(event) {
          var $dropdown = $(this);
          var $focused_option = $($dropdown.find('.focus') || $dropdown.find('.list .option.selected'));

          // Space or Enter
          if (event.keyCode == 32 || event.keyCode == 13) {
            if ($dropdown.hasClass('open')) {
              $focused_option.trigger('click');
            } else {
              $dropdown.trigger('click');
            }
            return false;
            // Down
          } else if (event.keyCode == 40) {
            if (!$dropdown.hasClass('open')) {
              $dropdown.trigger('click');
            } else {
              var $next = $focused_option.nextAll('.option:not(.disabled)').first();
              if ($next.length > 0) {
                $dropdown.find('.focus').removeClass('focus');
                $next.addClass('focus');
              }
            }
            return false;
            // Up
          } else if (event.keyCode == 38) {
            if (!$dropdown.hasClass('open')) {
              $dropdown.trigger('click');
            } else {
              var $prev = $focused_option.prevAll('.option:not(.disabled)').first();
              if ($prev.length > 0) {
                $dropdown.find('.focus').removeClass('focus');
                $prev.addClass('focus');
              }
            }
            return false;
            // Esc
          } else if (event.keyCode == 27) {
            if ($dropdown.hasClass('open')) {
              $dropdown.trigger('click');
            }
            // Tab
          } else if (event.keyCode == 9) {
            if ($dropdown.hasClass('open')) {
              return false;
            }
          }
        });

        // Detect CSS pointer-events support, for IE <= 10. From Modernizr.
        var style = document.createElement('a').style;
        style.cssText = 'pointer-events:auto';
        if (style.pointerEvents !== 'auto') {
          $('html').addClass('no-csspointerevents');
        }

        return this;

      };


      /*$(document).ready(function () {
        $('select').niceSelect();
      });*/


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
      modalOpen('.user .header .loginBtn', '.loginModal')

      // 모달 닫기  ------------------------------------------------------------

      function modalClose() {
        $('.modalCon .bg, .modalCon .close, .modalCon .closeBtn').on('click', function() {
          $('.modalCon').removeClass('open');
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

    })

    if(sessionUser == null
    ||
        (sessionUserSn == null || sessionUserSn == "")
    ){
      logInHandler();
    }else{

    }



  }, []);
  

  return (
      <header>
        <div className="hInner leftHeader">
          <div className="title"><p>회원관리</p></div>
          <nav className="navBox">
            <div className="bg hover"></div>
            <div className="bg active"></div>
            <ul className="dep">
              <li>
                <NavLink
                    to={URL.MANAGER_NORMAL_MEMBER}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>전체회원</p>
                </NavLink>
              </li>
              <li>
                <NavLink
                    to={URL.MANAGER_APPROVAL_MEMBER}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>승인회원</p>
                </NavLink>
              </li>
              <li>
                <NavLink
                    to={URL.MANAGER_WAIT_MEMBER}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>승인대기</p>
                </NavLink>
              </li>
              <li>
                <NavLink
                    to={URL.MANAGER_REJECT_MEMBER}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>승인반려</p>
                </NavLink>
              </li>
              <li>
                <NavLink
                    to={URL.MANAGER_STOP_MEMBER}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>이용정지</p>
                </NavLink>
              </li>
              <li>
                <NavLink
                    to={URL.MANAGER_CANCEL_MEMBER}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>탈퇴회원</p>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>
  );
}

export default ManagerLeftMember;
