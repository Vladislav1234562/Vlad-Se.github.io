$(function(){
	function chekb(class_one,class_activ){
		if(class_one.children('input').prop('checked') == false)
			{
			class_one.addClass(class_activ);
			class_one.children('input').attr('checked','checked');
			class_one.removeClass("popup__agreement--false");
			}
		else
			{
			class_one.removeClass(class_activ);
			class_one.children('input').removeAttr('checked');
			class_one.addClass("popup__agreement--false");
			}
}
function chekb_val(class_one,class_activ){
	if(class_one.children('input').prop('checked') == true)
			{
			class_one.addClass(class_activ);
			class_one.children('input').attr('checked','checked');
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
//валидация
function valid(input_id){
	input_val = $(input_id).val();
	if(!input_val)
		{
		$(input_id).css('border','1px solid #e40033');
		$(input_id).css('background-color','#fce5ea');
		$(input_id).css('color','red');
		}
	else
		{
		$(input_id).css('border','1px solid #fff');
		$(input_id).css('background','#fff');
		$(input_id).css('color','#a7a7a7');
		}
}
function validTwo(input_id){
	input_val = $(input_id).children('input');
	if($(input_id).children('input').prop('checked')  == false)
		{
		$(input_id).addClass("popup__agreement--false");
		}
	else
		{
		$(input_id).removeClass("popup__agreement--false");
		}
}
//очистка
function clear(input_id,border,backg){
	if(border){$(input_id).css("border",border);}
	if(backg){$(input_id).css("background-color",backg);}
	$(input_id).val('');
}
$(document).ready(function(){
	$("#popup__phone").mask("+7 ( 9 9 9 ) 9 9 - 9 9 - 9 9 9");
	/* placeholder */
	placeh("#popup__phone");
	/* Чекбокс */
	$(".popup__agreement").each(function () {
		chekb_val($(this),"popup__agreement--active");
	});
	$(".popup__agreement").click(function(){
		chekb($(this),"popup__agreement--active");
	});
	/* Popup */
	$(".popup__close").click(function(){
		$(this).closest(".popup").fadeOut(300);
	});
	$(document).mouseup( function(e){
		var div = $( ".popup__window, .popup__final, .popup-pluses__window" );
		if ( !div.is(e.target)
		    && div.has(e.target).length === 0 ) {
			div.closest(".popup").fadeOut(300);
		}
	});
	$(".popup__btn").click(function(){
		if($("#popup__phone").val() !='' && $(".popup__agreement").hasClass("popup__agreement--active")){
			$(".popup__window").fadeOut(300);
			$(".popup__final").fadeIn(300);
		}
		else{
			valid("#popup__phone");
			validTwo(".popup__agreement");
		}
	});
	$(".header__btn").click(function(){
		$(".popup").fadeIn(300);
		$(".popup__window").css({"display":"block"});
		$(".popup__final").css({"display":"none"});
	});
	/* Валидация */
	$("#popup__phone").keyup(function(){
		valid($(this));
	});
	/* popup преимуществ */
	$(".content__left-plus").click(function(){
		$(".popup-pluses").fadeIn(300);
	});
	$(".popup-pluses__close").click(function(){
		$(".popup-pluses").fadeOut(300);
	});
	$(document).mouseup( function(e){
		var div = $( ".popup-pluses__window" );
		if ( !div.is(e.target)
		    && div.has(e.target).length === 0 ) {
			div.closest(".popup-pluses").fadeOut(300);
		}
	});
	/* Меню */
	$(".header__buter").click(function(){
		if($(this).hasClass("header__buter--open")){
			$(this).removeClass("header__buter--open");
			$(".header").removeClass("header--open");
		}
		else{
			$(this).addClass("header__buter--open");
			$(".header").addClass("header--open");
		}
	});
	$(window).resize(function() {
		$(".popup-pluses, .popup, .popup__window, .popup__final").fadeOut(100);
	});
});
});
	