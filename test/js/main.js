$(function ($) {
	function placeh(place_tag){
		$(place_tag).focus(function(){
				$(this).attr("placeholder", ""); 
			}).blur(function(){
					$(this).attr("placeholder", $(this).data('empty')); 
			}).each(function(){
				 $(this).attr("placeholder", $(this).data('empty'));  
			});
	}
	function tagsFilter(count){
		var lenghtTags = $(".tags__item").length;
		var countDop = lenghtTags - count;
		$('.filter__sel-title').html("");
		$(".tags__item").each(function(ind){
			var textTags = $(this).text();
			if(ind < count){
				$(".filter__sel--category").find('.filter__sel-title').append('<span class="filter__one-title">'+textTags+'<span class="filter__one-title-close"></span></span>');
			}
			else{
				if(ind == count){
					$(".filter__sel--category").find('.filter__sel-title').append('<span class="filter__one-title filter__one-title--numb">+'+countDop+'<span class="filter__one-title-close"></span></span>');
				}
				else{
					$(".filter__sel--category").find('.filter__sel-title').find(".filter__one-title").eq(2).html("+"+countDop+'<span class="filter__one-title-close"></span>');
				}
			}
		});
	}
$(document).ready(function(e) {
	var winWidth=$(document).width(),
		countcategotyhid = 2;
		if(winWidth <= 1264){
			if(winWidth <= 980){
				if(winWidth <= 700){
					countcategotyhid = 1;
				}
				else{
					countcategotyhid = 0;
				}
			}
			else{
				countcategotyhid = 1;
			}
		}
		else{
			countcategotyhid = 2;
		}
			$('.tags').slick({
				dots: false,
				infinite: false,
				speed: 300,
				slidesToShow: 1,
				slidesToScroll: 1,
				centerMode: false,
				variableWidth: true
			});
	$(window).resize(function() {
		winWidth=$(document).width();
		if(winWidth <= 1264){
			if(winWidth <= 980){
				if(winWidth <= 700){
					countcategotyhid = 1;
				}
				else{
					countcategotyhid = 0;
				}
			}
			else{
				countcategotyhid = 1;
			}
		}
		else{
			countcategotyhid = 2;
		}
		tagsFilter(countcategotyhid);
	});
	/* Работа с меню */
	var widthLinemenu,
		leftLinemenu,
		distance;
	$(".header__nav-menu").mouseover(function(event){
		widthLinemenu = $(this).find("a").width();
		leftLinemenu = $(this).find("a");
		distance = $(this).find("a").position().left;
		if(event.relatedTarget.nodeName == "nav")
		{
			$(".header__nav-line").css({"width":widthLinemenu, "transition":"all 0.3s ease-in-out","left":distance});
		}
		else
		{
			$(".header__nav-line").css({"transition":"0", "left":distance});
			$(".header__nav-line").css({"width":widthLinemenu, "transition":"all 0.3s ease-in-out"});
		}
	});
	$(".header__nav-menu").mouseout(function(event){
		$(".header__nav-line").css({"width":"0"});
	});
	/* Работа с select в фильтре */
	$('.filter__sel').click(function(e){
		if($(this).hasClass('filter__sel--active'))
			{
				if(e.target.nodeName != 'SPAN'){
					$(this).removeClass('filter__sel--active');
					$(this).find(".filter__sel-content").slideUp();
				}
			}
		else
			{
				if(e.target.nodeName != 'SPAN'){
					$(this).addClass('filter__sel--active');
					$(this).find(".filter__sel-content").slideDown();
				}
			}
	});
	$(document).mouseup(function (e){
		var div = $('.filter__sel');
		if (!div.is(e.target)
		    && div.has(e.target).length === 0) {
			$(this).find(".filter__sel-content").slideUp();
			$(this).removeClass('filter__sel--active');
		}
	});
	var Thistind;
	$('.filter__sel').on('click', '.filter__sel-container', function() {
		if($(this).closest(".filter__sel").hasClass("filter__sel--category")){
			var valSel = $(this).find(".filter__sel-label").html();
			$("#tags").append("<div class='tags__item'>"+valSel+"<div class='tags__item-close'></div></div>");
			tagsFilter(countcategotyhid);
			$(this).remove();
		}
		else{
			$(this).parent('span').siblings().children('.filter__sel-label').removeClass('active');
			$(this).addClass('active');
			var valSel = $(this).text();
			$(this).closest('.filter__sel').attr('data-val', valSel);
			$(this).closest('.filter__sel').find('.filter__sel-title').html(valSel);
			$(this).parent('span').siblings().children('.filter__sel-input').removeAttr('checked');
			$(this).parent('span').children('.filter__sel-input').attr('checked', 'checked');
		}
	});
	$(".filter__sel--category").on('click', '.filter__one-title-close', function() {
		if($(this).closest(".filter__one-title").hasClass("filter__one-title--numb")){
			$(".tags__item").each(function(ind){
				if(ind > countcategotyhid - 1){
					var Thistext = $(this).closest(".tags__item").text();
					$(".filter__sel--category").find(".filter__sel-content").append('<span class="filter__sel-container"><input class="filter__sel-input" type="radio" name="Category" value=""><label class="filter__sel-label">'+Thistext+'</label></span>');
				}
			});
			$(".tags__item").eq(countcategotyhid - 1).nextAll().remove();
		}
		else{
			Thistind = $(this).closest(".filter__one-title").index();
			var Thistext = $(this).closest(".filter__one-title").text();
			$(this).closest(".filter__sel--category").find(".filter__sel-content").append('<span class="filter__sel-container"><input class="filter__sel-input" type="radio" name="Category" value=""><label class="filter__sel-label">'+Thistext+'</label></span>');
			$(".tags__item").eq(Thistind).remove();
		}
		tagsFilter(countcategotyhid);
	});
	$(".tags").on('click', '.tags__item-close', function() {
		var Thistext = $(this).closest(".tags__item").text();
		$(".filter__sel--category").find(".filter__sel-content").append('<span class="filter__sel-container"><input class="filter__sel-input" type="radio" name="Category" value=""><label class="filter__sel-label">'+Thistext+'</label></span>');
		$(this).closest(".tags__item").remove();
		tagsFilter(countcategotyhid);
	});
	tagsFilter(countcategotyhid);
	/* Filters mobile */
	$(".filter__mobile").click(function(){
		if($(this).hasClass("filter__mobile--open")){
			$(this).removeClass("filter__mobile--open");
			$(".filter__sel-all").slideUp();
		}
		else{
			$(this).addClass("filter__mobile--open");
			$(".filter__sel-all").slideDown();
		}
	});
	/* Аккордион */
	$(".accordions__item-top").click(function(){
		if($(this).closest(".accordions__item").hasClass("accordions__item--open")){
			$(this).closest(".accordions__item").removeClass("accordions__item--open");
			$(this).closest(".accordions__item").find(".accordions__description").slideUp();
		}
		else{
			$(this).closest(".accordions__item").siblings().removeClass("accordions__item--open");
			$(this).closest(".accordions__item").siblings().find(".accordions__description").slideUp();
			$(this).closest(".accordions__item").addClass("accordions__item--open");
			$(this).closest(".accordions__item").find(".accordions__description").slideDown();
		}
	});
	/* Add card */
	$(".add-card__btn").click(function(){
		if($(".modal-add").hasClass("modal-add--open")){
			$(".modal-add").fadeOut();
			$(".modal-add").removeClass("modal-add--open");
		}
		else{
			$(".modal-add").fadeIn();
			$(".modal-add").addClass("modal-add--open");
		}
	});
	$(".modal-add__btn").click(function(){
		var nameCard,
			descCard,
			categoryCard,
			priceCard,
			classCategory;
		nameCard = $(".modal-add__name").val();
		descCard = $(".modal-add__description").val();
		categoryCard = $(".modal-add").find(".filter__sel").attr("data-val");
		priceCard = $(".modal-add__price").val();
		classCategory = $.trim(categoryCard.toLowerCase().split(' ').join('-'));
		$(".cards__all"). prepend('<article class="card"><a class="card__link" href="#"><span class="card__img"><img src="img/card_noimg.jpg" alt="card"></span><span class="card__info"><span class="card__category card__category--'+classCategory+'">'+categoryCard+'</span><span class="card__name">'+nameCard+'</span><span class="card__raiting"><span class="card__raiting-stars"><img src="img/star.png" alt=""><img src="img/star.png" alt=""><img src="img/star.png" alt=""><img src="img/star.png" alt=""><img src="img/star.png" alt=""></span><span class="card__raiting-count">0</span></span><span class="card__anons">'+descCard+'</span><span class="card__bottom"><span class="card__price"><span class="card__price-new">$'+priceCard+'</span></span></span></span></a></article>');
		$(".modal-add").fadeOut();
		$(".modal-add").removeClass("modal-add--open");
		console.log("name "+nameCard+"; description "+descCard+"; category "+categoryCard+"; price "+priceCard);
	});
	$(document).mouseup(function (e){
		var div = $('.modal-add__window');
		if (!div.is(e.target)
		    && div.has(e.target).length === 0) {
			$(".modal-add").fadeOut();
			$(".modal-add").removeClass('modal-add--open');
		}
	});
	/* placeholder */
	placeh('.footer__form-inp');
	placeh('#search-filter');
	placeh('.modal-add__name');
	placeh('.modal-add__description');
	placeh('.modal-add__price');
	/* слайдер в Header */
	$('.header__slider').slick({
		dots: false,
		infinite: false,
		speed: 300,
		fade: true,
		cssEase: 'linear',
		autoplay: true
	  });
});
});
