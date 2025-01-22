$(function() {	

	$(document).ready(function () {
	    $('select').niceSelect();
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