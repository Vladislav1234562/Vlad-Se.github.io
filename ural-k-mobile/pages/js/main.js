$(function(){
	var body = document.getElementsByTagName('body')[0];
	var bodyScrollTop = null;
	var locked = false;
	function lockScroll(){
		if(!locked){
		bodyScrollTop = ((typeof window.pageYOffset !== 'undefined') ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop)*-1;
		$('body').addClass('scroll-locked');
		$('body').css({"top":bodyScrollTop});
		locked = true;
		};
	}
	function unlockScroll(){
		if(locked){
		$('body').removeClass('scroll-locked');
		$('body').css({"top":"0"});
		window.scrollTo(0, bodyScrollTop);
		locked = false;
		}
	}
	function placeh(place_tag){
		$(place_tag).focus(function(){
			$(this).attr("placeholder", ""); 
			}).blur(function(){
					$(this).attr("placeholder", $(this).data('empty')); 
			}).each(function(){
				 $(this).attr("placeholder", $(this).data('empty'));  
		  });
	  }
	function valid(input_id){
	    input_val = $(input_id).val();
	    if(!input_val)
	      {
	      $(input_id).css('border','1px solid #e40033');
	      $(input_id).css('background-color','#fce5ea');
	      }
	    else
	      {
	      $(input_id).css('border','none');
	      $(input_id).css('background-color','#F9F9F9');
	      }
	  }
	function validChek(input_id){
	    chek = input_id.find('input').attr('checked');
	    if(chek == 'checked')
	      {
	      $(input_id).css('border','none');
	      }
	    else
	      {
	      $(input_id).css('border','1px solid #e40033');
	      }
	  }
	  function clear(input_id,border,backg){
	    if(border){$(input_id).css("border",border);}
	    if(backg){$(input_id).css("background-color",backg);}
	    $(input_id).val('');
	  }
	  function chekb(class_one,class_activ){
		if(class_one.children('input').prop('checked') == false)
			{
			class_one.addClass(class_activ);
			class_one.children('input').attr('checked','checked');
			}
		else
			{
			class_one.removeClass(class_activ);
			class_one.children('input').removeAttr('checked');
			}
	}
	function chekb_val(class_one,class_activ){
		if(class_one.children('input').prop('checked') == true)
			{
			class_one.addClass(class_activ);
			class_one.children('input').attr('checked','checked');
			}
	}
	function anchorLink(name_tag){
		$(name_tag).click(function(e){
			e.preventDefault();
			destination = $($(this).attr('href')).offset().top;
			$('html').animate( { scrollTop: destination }, 1100 );
			return false;
		});
	}
$(document).ready(function(e) {
	$(window).resize(function() {

	});
	/* табы городов */
	$(document).on('click', '.store__city-top', function(){
		if($(this).hasClass('_open')){
			$(this).removeClass('_open');
			$(this).parent().find('.store__city-bottom').slideUp(200);
		}
		else{
			$(this).addClass('_open');
			$(this).parent().find('.store__city-bottom').slideDown(200);
			$(this).parent().siblings().find('.store__city-bottom').css({"display":"none"});
			$(this).parent().siblings().find('.store__city-top').removeClass('_open');
		}
	});
	/* табы в фильтре */
	$(document).on('click', '.filter__item-top', function(){
		if($(this).hasClass('_open')){
			$(this).removeClass('_open');
			$(this).parent().find('.filter__item-bottom').slideUp(200);
		}
		else{
			$(this).addClass('_open');
			$(this).parent().find('.filter__item-bottom').slideDown(200);
			$(this).parent().siblings().find('.filter__item-bottom').css({"display":"none"});
			$(this).parent().siblings().find('.filter__item-top').removeClass('_open');
		}
	});
	/* табы в каталоге */
	$(document).on('click', '.tabs-catalog__name-item', function(){
		$(this).addClass('_active');
		$(this).siblings().removeClass('_active');
		let indTabs = $(this).index();
		$(this).closest('.tabs-catalog').find('.catalog__tovars').fadeOut(500);
		setTimeout(function(){
			$('.catalog__tovars').eq(indTabs).fadeIn(500);
		},500);
	});
	$('.novelty__list').slick({
		dots: false,
		arrows: true,
		slidesToShow: 1,
		swipe: true,
		speed: 500,
		autoplay: false,
		variableWidth: true
	});
	/* Слайдер в карточке колеекции */
	$('.cart-slider').slick({
		dots: true,
		arrows: false,
		slidesToShow: 1,
		swipe: true,
		speed: 500,
		autoplay: false,
		variableWidth: true
	});
	/* Слайдер команды */
	$('.team__slider').slick({
		dots: false,
		arrows: true,
		slidesToShow: 1,
		swipe: true,
		speed: 500,
		autoplay: false,
		variableWidth: true
	});
	/* Слайдер брендов */
	$('.brands__slider').slick({
		dots: false,
		arrows: true,
		slidesToShow: 1,
		swipe: true,
		speed: 500,
		autoplay: false,
		variableWidth: true
	});
	/* Якоря */
	anchorLink('.yak-btn');
	/* Работа с количеством */
	$(document).on('click', '.item-count__name-type', function(){
		$(this).addClass('_active');
		$(this).siblings().removeClass('_active');
	});
	$(document).on('click', '.item-count__top-btn', function(e){
		e.preventDefault();
		let valueCount = parseInt($(this).closest('.item-count__top').find('input').val());
		
		
		if($(this).hasClass('minus')){
			valueCount = valueCount - 1;
			if(valueCount <= 0){
				valueCount = 1;
			}
		}
		else{
			valueCount = valueCount + 1;
			console.log(valueCount);
		}
		$(this).closest('.item-count__top').find('input').val(valueCount)
	});
	/* Клик по избранному */
	$('.novelty__item-favorite, .tovars__item-favorite').click(function(){
		if($(this).hasClass('_active')){
			$(this).removeClass('_active');
		}
		else{
			$(this).addClass('_active');
		}
	});
	$('.cart-tovars__item-favorite').click(function(){
		if($(this).hasClass('_active')){
			$(this).removeClass('_active');
		}
		else{
			$(this).addClass('_active');
		}
	});
	$('.tovars__item-cart').click(function(){
		if($(this).hasClass('_active')){
			$(this).removeClass('_active');
		}
		else{
			$(this).addClass('_active');
		}
	});
	$('.novelty__item-cart').click(function(){
		if($(this).hasClass('_active')){
			$(this).removeClass('_active');
		}
		else{
			$(this).addClass('_active');
		}
	});
	/* модалка звонка */
	$('.header__call').click(function(e){
		lockScroll();
		e.preventDefault();
		$('.page-shadow').fadeIn(200);
		setTimeout(function(){
			$('.modal').fadeIn(200);
		},100);
		
	});
	$('.modal-close').click(function(e){
		unlockScroll();
		$('.page-shadow').fadeOut(200);
		$('.modal').fadeOut(200);
		$('.modal-cart').fadeOut(200);
		$('.modal-final').fadeOut(200);
	});
	$('.modal-btn').click(function(){
		$('.modal').fadeOut(200);
		setTimeout(function(){
			$('.modal-final').fadeIn(200);
		},200);
	});
	/* Млдалка корзины */
	$('.tovars__item-cart, .novelty__item-cart, .cart-b__item-cart').click(function(e){
		lockScroll();
		e.preventDefault();
		$('.page-shadow').fadeIn(200);
		setTimeout(function(){
			$('.modal-cart').fadeIn(200);
		},100);
	});
	/* модалка города */
	$('.header__city').click(function(){
		lockScroll();
		$('.page-shadow').fadeIn(200);
		setTimeout(function(){
			$('.city-hid').fadeIn(200);
		},100);
	});
	$(document).mouseup(function (e){ 
		var div = $('.city-hid, .modal-cart, .modal, .modal-final'); 
		if (!div.is(e.target) 
		    && div.has(e.target).length === 0) { 
			div.fadeOut(200); 
			$('.page-shadow').fadeOut(200);
			$('.modal-cart').fadeOut(200);
			$('.modal').fadeOut(200);
			unlockScroll();
		}
	});
	/* Меню */
	$('.header__butter').click(function(){
		$('.header__menu-hid').css({"transform":"translateX(0)"});
		lockScroll();
	});
	$('.header__menu-close').click(function(){
		$('.header__menu-hid').css({"transform":"translateX(-100%)"});
		unlockScroll();
	});
	$('.header__podrazdels-top').click(function(e){
		e.preventDefault();
		if($(this).hasClass('open')){
			$(this).removeClass('open');
			$(this).parent().find('.header__menu-razdels').slideUp(200);
		}
		else{
			$(this).addClass('open');
			$(this).parent().find('.header__menu-razdels').slideDown(200);
		}
		
	});
	/* Валидация */
	$('.form__inp').keyup(function(){
	      valid($(this));
	      validChek($(this));
	});
	$(document).on('click', '.form__btn', function() {
		valid('.form__inp');
	});
	$('.modal-container').find('input).keyup(function(){
	      valid($(this));
	});
	$(document).on('click', '.modal-btn', function() {
		valid('.modal-container input');
	});
	/* Остаток на складе */
	$('.tovars__item-balance').click(function(){
		if($(this).hasClass('open')){
			$(this).removeClass('open');
			$(this).find('.tovars__item-balance-hid').slideUp(200);
		}
		else{
			$(this).addClass('open');
			$(this).find('.tovars__item-balance-hid').slideDown(200);
		}
	});
	/* Чекбоксы */
	$('.form__bottom-chek, .filter__chek, .modal-chek').each(function () {
		chekb_val($(this),'_active');
		validChek($(this));
	});
	$('.form__bottom-chek, .filter__chek, .modal-chek').click(function(){
		chekb($(this),'_active');
		validChek($(this));
	});
	/* Маска на инпуты */
	$('input[name=form_phone]').mask("+7 (999) 999 - 99 - 99");
	$('input[name=modal_phone]').mask("+7 (999) 999 - 99 - 99");
	/* placeholder */
	placeh('.form__inp');
	placeh('.form_message');
	placeh('input[type="search"]');
	placeh('.modal input');
});
});
