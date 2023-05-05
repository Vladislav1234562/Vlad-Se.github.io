$('select[name=perPage]').change(function() {
    $(this).closest('form').submit();
});



var Scrollbar = window.Scrollbar;

function anchorLink(name_tag){
	$(name_tag).click(function(e){
		e.preventDefault();
		destination = $($(this).attr('href')).offset().top;
		$('html').animate( { scrollTop: destination }, 1100 );
		return false;
	});
}

function ModalPlugin() {
	Scrollbar.ScrollbarPlugin.apply(this, arguments);
}

ModalPlugin.prototype = Object.create(Scrollbar.ScrollbarPlugin.prototype);
ModalPlugin.prototype.transformDelta = function (delta) {
	if (this.scrollbar.containerEl.classList[0] == 'custom-scroll') {
		if (app.body_scroll) {
			return delta;
		} else {
			return {
				x: 0,
				y: 0
			}
		}
	}
};
ModalPlugin.pluginName = 'modal';


let app = {
	body: $('body'),
	header: $('.header'),
	all_scrolls_obj: [],
	scrollbar_width: 0,
	init: function () {
		app.scrollbar_width = app.scrollbarWidth();
	},
	//scrollbar width
	scrollbarWidth: function () {
		var block = $('<div>').css({
				'height': '50px',
				'width': '50px'
			}),
			indicator = $('<div>').css({
				'height': '200px'
			});
		$('body').append(block.append(indicator));
		var w1 = $('div', block).innerWidth();
		block.css('overflow-y', 'scroll');
		var w2 = $('div', block).innerWidth();
		$(block).remove();
		return (w1 - w2);
	},
	fillScrollWidth: function (status, obj) {
		var container = $(obj),
			body = app.body;

		if (status == 'hide') {
			if (!body.hasClass('hide-scroll')) {
				body.addClass('hide-scroll');
				if (document.documentElement.clientWidth != window.innerWidth) {
					body.css({
						'overflow': 'hidden',
						'padding-right': app.scrollbar_width
					});

				} else {
					body.css('overflow', 'hidden');
				}


				//iOS fix
				app.scroll_position = $(document).scrollTop();
				body.css({
					'position': 'fixed',
					'top': '-' + app.scroll_position + 'px',
					'height': '100%'
				});
			}
		} else {
			body.removeClass('hide-scroll');
			body.css({
				'overflow': '',
				'padding-right': '',
				'position': '',
				'top': '',
				'height': ''
			});
			$(document).scrollTop(app.scroll_position);
		}
	},
	placeholderToggle: function (that) {
		$(that).each(function () {
			if ($(this).val() !== '') {
				$(this).parent().addClass("active");
			}
			if ($(this).is(':disabled')) {
				$(this).parent().addClass("disabled");
			}
		});
		$(that).parent().addClass('input-load');
		setTimeout(function () {
			$(that).parent().removeClass('input-load');
		}, 300);

		$(that).focus(function () {
			$(this).parent().addClass("active");
		});
		$(that).blur(function () {
			if ($(this).val() === "") {
				$(this).parent().removeClass("active");
			}
		});
	},
	headerFixed: function () {
		if (app.site_modals_open) return;
		if ($(window).scrollTop() > 0) {
			app.header.addClass('fixed');
		} else {
			if (!app.body.hasClass('hide-scroll')) {
				app.header.removeClass('fixed');
			}
		}
	},
	customScrollbar: function (that, callback) {

		$(that).each(function () {
			var that = $(this);
			Scrollbar.use(ModalPlugin);
			Scrollbar.init($(this)[0], {
				alwaysShowTracks: true,
				damping: 0.05,
				continuousScrolling: true,
				overscrollEffect: true,
				overscroll: true
			}).addListener(function (status) {
				if (typeof callback === 'function') {
					callback(that, status);
				}
			});

			new ResizeSensor(that[0], function () {
				app.scrollbarUpdate(that);
			});
			new ResizeSensor(that.find('.scroll-content')[0], function () {
				app.scrollbarUpdate(that);
			});
			app.all_scrolls_obj.push(that.find('.scroll-content'));
		});

	},
	scrollbarUpdate: function (obj) {
		$(obj).each(function () {
			if (Scrollbar.get($(this)[0]) !== undefined) {
				let size = Scrollbar.get($(this)[0]).getSize();


				if ($(this).hasClass('tg-scroll')) {
					if (size.content.height > size.container.height) {
						$(this).addClass('exclude-scroll exclude-swipe');
					} else {
						$(this).removeClass('exclude-scroll exclude-swipe');
					}
				} else {
					if (size.content.height > size.container.height) {
						$(this).addClass('scroll-active');
					} else {
						$(this).removeClass('scroll-active');
					}
				}
				Scrollbar.get($(this)[0]).update();
			}
		});
	},
	customSelect: {
		openClose: function (status, that) {
			if (status == 'open') {
				$('.custom-select:not(.select-modal)').removeClass('open');
				let container = $(that).closest('.custom-select:not(.select-modal)');
				container.addClass('open');

				//				container.outerWidth();
				//				container.find('.c-select-drop-down').css('margin-left');

				if (Scrollbar.get(container.find('.c-select-scroll')[0]) !== undefined) {
					Scrollbar.get((container.find('.c-select-scroll')[0])).update();
				}
			} else {
				$('.custom-select.open').removeClass('open');
			}
		},
		select: function (that) {
			var this_item = $(that);
			this_item.closest('.custom-select:not(.select-modal)').find('.c-select-list>li').removeClass('selected');
			this_item.parent().addClass('selected');
			this_item.closest('.custom-select:not(.select-modal)').find('input').val(this_item.attr('data-val'));

			this_item.closest('.custom-select:not(.select-modal)').find('.c-select-title span').text(this_item.text());

		},
		update: function () {
			$(".custom-select:not(.placeholder):not(.select-modal)").each(function () {
				var active = $(this).find('.c-select-list>li.selected a');
				if (!active.length) {
					active = $(this).find('.c-select-list>li:first a');
				}
				app.customSelect.select(active);
			});
		},
		selectScrollBarInit: function () {

		},
		init: function () {
			app.customSelect.update();

			$(document).on('click', '.c-select-title', function (e) {
				e.preventDefault();
				if ($(this).parent().hasClass('open')) {
					app.customSelect.openClose('close');
				} else {
					app.customSelect.openClose('open', this);
				}
			});
			$(document).on('click', '.c-select-list a', function (e) {
				/*e.preventDefault();*/
				app.customSelect.select(this);
				app.customSelect.openClose('close');
			});
			$(document).on('mousedown', function (event) {
				if ($(event.target).closest(".custom-select:not(.select-modal)").length)
					return;
				app.customSelect.openClose('close');
				event.stopPropagation();
			});
			//preventDefault for swipe
			$(document).on('dragstart', '.custom-select:not(.select-modal) a', function (event) {
				event.preventDefault();
			});
		}
	},
	zIndexFromLast: function (obj, start_index) {
		$(obj.get().reverse()).each(function () {
			$(this).css('z-index', start_index);
			start_index++;
		});
	},
	quantity: {
		init: function () {
			//all qantity
			$(document).on('focusin', '.qt input', function (event) {
				$(this).select();
			});
			$(document).on('focusout', '.qt input', function () {
				//app.quantity.prefix($(this));
			});

			$(".qt input").each(function () {
				//app.quantity.prefix($(this));
			});


			app.quantity.incrementDecrement();
		},
		prefix: function (that) {
			var this_max = +that.attr('max'),
				this_min = +that.attr('min'),
				prefix = that.attr('data-prefix') || '',
				this_val = String(that.val()).replace(/\D/g, '');
			that.parent().removeClass('min-value max-value');
			if (+this_val >= this_max) {
				that.val(this_max + prefix);
				that.parent().addClass('max-value');
			} else if (+this_val <= this_min) {
				that.val(this_min + prefix);
				that.parent().addClass('min-value');
			} else {
				that.val(this_val + prefix);
			}

		},
		incrementDecrement: function () {
			$(document).on('click', '.qt .qt-sf', function (e) {
				e.preventDefault();
				var input = $(this).siblings('input'),
					input_val = String(input.val()).replace(/\D/g, '');

				if ($(this).hasClass('minus')) {
					input.val(--input_val);
				}
				if ($(this).hasClass('plus')) {
					input.val(++input_val);
				}
				app.quantity.prefix(input);
				$(input).change();
			});
		}

	},
	toPrecent: function (precent, number) {
		return number * precent / 100;
	},
	resizeEl: function (elem, callback) {
		$(elem).each(function () {
			let obj = $(this);
			new ResizeSensor(obj[0], function (size) {
				if (typeof callback === 'function') {
					callback(size);
				}
			});
		});
	},
	resizePoint: function (size, callback) {
		var var_size,
			overpoint;
		if (window.matchMedia('(min-width: ' + size + 'px)').matches) {
			var_size = 'desktop';
			overpoint = true;
		} else {
			var_size = 'mobile';
			overpoint = false;
		}
		if (typeof callback === 'function') {
			callback(overpoint);
		}
		$(window).resize(function () {
			if (window.matchMedia('(min-width: ' + size + 'px)').matches) {
				if (var_size == 'desktop') return;
				var_size = 'desktop';
				//!target desktop
				overpoint = true;

			} else {
				if (var_size == 'mobile') return;
				var_size = 'mobile';
				//!target mobile
				overpoint = false;
			}
			if (typeof callback === 'function') {
				callback(overpoint);
			}
		});
	}
}
app.init();


$(document).ready(function () {
	//	app.headerFixed();
	//	app.placeholderToggle(".input input, .textarea textarea");
	app.customSelect.init();
	//	app.zIndexFromLast($('.custom-select:not(.select-modal)'), 3);
	app.customScrollbar('.c-select-scroll');
	app.quantity.init();
});


$(document).ready(function () {
	$(document).on('click', '.nav-btn', function (e) {
		e.preventDefault();
		$('.aside').addClass('active');
		app.fillScrollWidth('hide', 'body');
	});
	$(document).on('click', '.close-aside', function (e) {
		e.preventDefault();
		$('.aside').removeClass('active');
		setTimeout(function () {
			app.fillScrollWidth('show', 'body');
		}, 300);
	});
	/* Якоря */
	anchorLink('.yak-btn');



	$('[data-fancybox]').fancybox({
		touch: true,
		smallBtn: true,
		animationEffect: "fade",
		backFocus: false,
		beforeShow: function (instance, current) {
			app.fillScrollWidth('hide', 'body');
		},
		afterClose: function (instance, current) {
			app.fillScrollWidth('show', 'body');
		}
	});
	$(document).on('click', '[data-modal]', function (e) {
		e.preventDefault();
		var $that_attr = $(this).attr('href');
		$.fancybox.close();
		$.fancybox.open({
			touch: false,
			src: $that_attr,
			type: 'inline',
			smallBtn: true,
			animationEffect: "fade",
			backFocus: false,
			beforeShow: function (instance, current) {
				app.fillScrollWidth('hide', 'body');
			},
			afterClose: function (instance, current) {
				setTimeout(function () {
					if (!app.body.hasClass('fancybox-active')) {
						app.fillScrollWidth('show', 'body');
					}
				}, 10);
			}
		});
	});
	$(document).on('click', '.step-btn', function (e) {
		$.fancybox.close();
	});
	$(document).on('click', '.ct-balance', function(e){
		if($(this).hasClass('open')){
			$(this).removeClass('open');
			$(this).find('.ct-balance-hid').slideUp(200);
		}
		else{
			$(this).addClass('open');
			$(this).find('.ct-balance-hid').slideDown(200);
		}
	});


	//select modal
	$(document).on('click', '.custom-select.select-modal>a', function (e) {
		e.preventDefault();
		e.preventDefault();
		var $that_modal = $(this).closest('.select-modal').find('.modal');
		$.fancybox.close();
		$.fancybox.open({
			touch: false,
			src: $that_modal,
			type: 'inline',
			smallBtn: true,
			animationEffect: "fade",
			backFocus: false,
			beforeShow: function (instance, current) {
				app.fillScrollWidth('hide', 'body');
			},
			afterClose: function (instance, current) {
				setTimeout(function () {
					if (!app.body.hasClass('fancybox-active')) {
						app.fillScrollWidth('show', 'body');
					}
				}, 10);
			}
		});
	});


	$(document).on('click', '.city-search>input', function (e) {
		e.preventDefault();
		$(this).closest('.city-search').find('.city-search-autocomplete').slideDown(200);
	});

	$(document).on('focusout', '.city-search>input', function () {
		let that = $(this);
		setTimeout(function () {
			that.closest('.city-search').find('.city-search-autocomplete').slideUp(200);
		}, 200);
	});

	$(document).on('click', '.city-search-autocomplete-list a', function (e) {
		e.preventDefault();
		$(this).closest('.city-search').find('input').val($(this).text());
		setTimeout(function () {
			$.fancybox.close();
		}, 500);

	});

	$(document).on('click', '.main-city-list a', function (e) {
		e.preventDefault();
		$.fancybox.close();
	});





	$(document).on('click', '[data-modal-gallery]', function (e) {
		e.preventDefault();
		var $that_attr = '#gallery-modal';
		$.fancybox.close();
		$.fancybox.open({
			touch: false,
			src: $that_attr,
			type: 'inline',
			smallBtn: true,
			animationEffect: "fade",
			backFocus: false,
			baseClass: 'modal-gallery',
			beforeShow: function (instance, current) {
				app.fillScrollWidth('hide', 'body');
				setTimeout(function () {
					$('.gallery-modal-slider').slick({
						infinite: false,
						speed: 300,
						slidesToShow: 1,
						slidesToScroll: 1,
						arrows: true,
						dots: true,
						prevArrow: '<button type="button" class="slick-prev"><i class="icon-big-arrow-l"></i></button>',
						nextArrow: '<button type="button" class="slick-next"><i class="icon-big-arrow-r"></i></button>',
						swipeToSlide: true,
						customPaging: function (slider, i) {
							return '<button class="sl-dot"></button>';
						}
					});
				}, 50);

			},
			afterClose: function (instance, current) {
				setTimeout(function () {
					if (!app.body.hasClass('fancybox-active')) {
						app.fillScrollWidth('show', 'body');
					}
				}, 10);
			}
		});
	});


	//object-fit
	$(function () {
		objectFitImages()
	});

	//mask
	$("input[type='tel']").inputmask({
		"mask": "+7 (999) 999-99-99",
		showMaskOnFocus: true,
		showMaskOnHover: false
	});

	//form validation
	$(".validation").each(function () {
		$(this).parsley({
			excluded: '.excluded',
			classHandler: function (el) {
				return el.$element.closest('.err-target');
			}
		});
	});

	// slider
	$('.gl-slider').slick({
		infinite: false,
		speed: 300,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		dots: true,
		//        prevArrow: '<button type="button" class="slick-prev"><i class="icon-arr-l"></i></button>',
		//		nextArrow: '<button type="button" class="slick-next"><i class="icon-arr-r"></i></button>',
		swipeToSlide: true,
		customPaging: function (slider, i) {
			return '<button class="sl-dot"></button>';
		}
	});

	// slider
	$('.team-slider').each(function () {
		let that = $(this);
		that.slick({
			infinite: true,
			speed: 300,
			slidesToShow: 2,
			slidesToScroll: 1,
			autoplay: true,
			autoplaySpeed: 3000,
			arrows: true,
			dots: false,
			touchMove: false,
			prevArrow: '<button type="button" class="slick-prev"><i class="icon-big-arrow-l"></i></button>',
			nextArrow: '<button type="button" class="slick-next"><i class="icon-big-arrow-r"></i></button>',
			swipeToSlide: true,
			appendArrows: that.closest('.tm-slider-wrp').find('.tm-control'),
			responsive: [
				{
					breakpoint: 991,
					settings: {
						slidesToShow: 1,
						appendArrows: that
					}
				}
			]
		});
	});


// slider
	$('.brands-slider').each(function () {
		let that = $(this);
		that.slick({
			infinite: false,
			speed: 300,
			slidesToShow: 4,
			slidesToScroll: 1,
			rows: 2,
			arrows: true,
			dots: false,
			touchMove: false,
			prevArrow: '<button type="button" class="slick-prev"><i class="icon-big-arrow-l"></i></button>',
			nextArrow: '<button type="button" class="slick-next"><i class="icon-big-arrow-r"></i></button>',
			swipeToSlide: true,
			responsive: [
				{
					breakpoint: 991,
					settings: {
						slidesToShow: 2
					}
				}
			]
		});
	});


//$(document).on('click', '.ts-pg-item', function (e) {
//	e.preventDefault();
//	let current_index = $(this).closest('li').index(),
//		slider = $(this).closest('.top-slider-wrp').find('.top-slider');
//	if (window.matchMedia('(min-width: 992px)').matches) {
//		slider.slick('slickGoTo', current_index);
//	} else {
//		app.fillScrollWidth('hide', 'body');
//		let html_content = $(this).closest('.top-slider-wrp').find('.top-slider>div').eq(current_index).html();
//		console.log(html_content);
//		app.body.append('<div class="ts-modal">' +
//			'<div class="ts-modal-head">' +
//			'<a href="#" class="close-ts-modal">&times;</a>' +
//			'</div>' +
//			'<div class="ts-modal-scroll">' +
//			html_content +
//			'</div>' +
//			'</div>'
//		);
//
//
//		setTimeout(function () {
//			$('.ts-modal').addClass('active');
//		}, 60);
//
//	}
//});

	$(document).on({
		mouseenter: function () {

			if (window.matchMedia('(min-width: 992px)').matches) {
				let current_index = $(this).closest('li').index(),
					slider = $(this).closest('.top-slider-wrp').find('.top-slider');
				slider.slick('slickGoTo', current_index);
			}
		}
	}, '.ts-pg-list .ts-pg-item');



	$(document).on('click', '.close-ts-modal', function (e) {
		e.preventDefault();
		let ts_modal = $('.ts-modal');
		ts_modal.removeClass('active');
		setTimeout(function () {
			ts_modal.remove();
			app.fillScrollWidth('show', 'body');
		}, 600);
	});
});

/*   
    // slider
    $('.slick-slider').slick({
        infinite: false,
        speed: 300,
        slidesToShow: 6,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        prevArrow: '<button type="button" class="slick-prev"><i class="icon-arr-l"></i></button>',
		nextArrow: '<button type="button" class="slick-next"><i class="icon-arr-r"></i></button>',
        swipeToSlide: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 601,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
*/
$(document).ready(function () {
	if($(window).width()<=980){
		$('.private__btn').hover(function(){
			$(this).addClass('open');
			$('.private__info').fadeIn(200);
		},function(){
			$(this).removeClass('open');
			$('.private__info').fadeOut(200);
		});
	}
	else{
		$('.private__btn').click(function(){
			if($(this).hasClass('open')){
				$(this).removeClass('open');
				$('.private__info').fadeOut(200);
			}
			else{
				$(this).addClass('open');
				$('.private__info').fadeIn(200);
			}
		});
	}
	
	
	$(document).mouseup(function (e){ 
        var div = $('.h-private-wrp'); 
        if (!div.is(e.target) 
            && div.has(e.target).length === 0) { 
				$('.private__btn').removeClass('open');
				$('.private__info').fadeOut(200);
        }
    });
});

$(document).ready(function () {
	let fltr_i = 5;
	$($('.custom-select').get().reverse()).each(function (i) {
		$(this).css('z-index', fltr_i);
		fltr_i++;
	});
});



$(document).ready(function () {

	let slider_animation = false;
	$('.gallery-slider-wrp').each(function () {
		var that = this,
			card_slider = $(that).find('.gallery-slider'),
			card_slider_pagination = $(that).find('.gallery-pagination');
		card_slider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
			var current_slide = nextSlide++ || 0;
			card_slider_pagination.find('.slick-slide').eq(current_slide).find('.pg-item').trigger("click");
		}).slick({
			infinite: false,
			fade: true,
			speed: 300,
			touchThreshold: 100,
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: false,
			dots: false,
			swipeToSlide: true,
			responsive: [
				{
					breakpoint: 992,
					settings: {
						dots: true
					}
				}
			],
			customPaging: function (slider, i) {
				return '<button class="sl-dot"></button>';
			}
		});
		card_slider_pagination.on('init', function (event, slick, currentSlide, nextSlide) {
			$(this).find('.slick-slide:first').addClass('current');
			if (card_slider_pagination.find('.slick-slide').length <= 1) {
				card_slider_pagination.css('visibility', 'hidden');
			}
		}).on('init setPosition', function (event, slick) {
			let container_width = $(slick.$slider).find('.slick-list').outerWidth(),
				slide_show_count = slick.options.slidesToShow;
			$(slick.$slides).css('width', container_width / slide_show_count);
		}).on('beforeChange', function (event) {
			slider_animation = true;
		}).on('afterChange', function (event) {
			slider_animation = false;
		}).slick({
			infinite: false,
			speed: 300,
			slidesToShow: 5,
			slidesToScroll: 1,
			touchThreshold: 10000,
			variableWidth: true,
			touchMove: false,
			arrows: false,
			draggable: true,
			dots: false,
			swipeToSlide: true,
			responsive: [
				{
					breakpoint: 1200,
					settings: {
						slidesToShow: 4
					}
				}
			]
		});
		$(that).on('click', '.pg-item', function (e) {
			e.preventDefault();
			var this_index = $(this).closest('.slick-slide').index(),
				this_slide = card_slider_pagination.find('.slick-slide').eq(this_index);
			card_slider_pagination.find('.slick-slide').removeClass('current');
			if (this_index <= card_slider_pagination.find('.slick-slide.slick-active:first').index()) {
				card_slider_pagination.slick('slickGoTo', this_index - 1 || 0);
			}
			if (this_index >= card_slider_pagination.find('.slick-slide.slick-active:last').index()) {
				card_slider_pagination.slick('slickGoTo', this_index - card_slider_pagination.find('.slick-slide.slick-active').length + 2);
			}
			this_slide.addClass('current');
			card_slider.slick('slickGoTo', this_index);

		});
	});


});


$(window).on('load', function(){
	mapBg();
});

$(window).resize(function () {
	mapBg();
});

function mapBg() {

	$('.places').each(function () {
		let that = this,
			bg_map = $('.bg-map');


		let bg_map_top = $(that).offset().top,
			bg_map_left = $(that).offset().left,
			bg_map_width = $(that).outerWidth(),
			bg_map_height = $(that).outerHeight();

		bg_map.css({
			'width': bg_map_width,
			'height': bg_map_height,
			'top': bg_map_top,
			'left': bg_map_left,
		});
	});




}

$(document).on('click', '.pl-item-link', function (e) {
	e.preventDefault();

	if (window.matchMedia('(max-width: 991px)').matches) {
		$(this).toggleClass('active');
		$(this).siblings('.pl-h-box').slideToggle(600);
	}

});






$(document).ready(function () {
	let elems = $('.ts-item');
	if (elems.length) {
		app.resizeEl('.as-wrp', function (size) {
			elems.css('height', $('.as-wrp').outerHeight());
		});
	}
});



app.resizePoint(992, function (overpoint) {
	if (overpoint) {
		$('.m-ct-list-slider.slick-initialized').each(function () {
			$(this).slick('unslick');
		});
	} else {
		$('.m-ct-list-slider').each(function () {
			let that = $(this);
			that.on('init setPosition', function (event, slick) {
				let height = that.find('.ct-box-img:first').outerHeight();
				that.find('.slick-arrow').css('top', height / 2);
			}).slick({
				infinite: false,
				speed: 300,
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: true,
				dots: false,
				touchMove: false,
				prevArrow: '<button type="button" class="slick-prev"><i class="icon-big-arrow-l"></i></button>',
				nextArrow: '<button type="button" class="slick-next"><i class="icon-big-arrow-r"></i></button>',
				swipeToSlide: true
			});
		});
	}
});


$(document).ready(function(){
	app.resizePoint(992, function (overpoint) {
		if (overpoint) {
			// slider
			$('.top-slider').each(function () {
				let that = $(this);
				that.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
					setTimeout(function () {
						let all_li = that.closest('.top-slider-wrp').find('.ts-pg-list>li');
						all_li.removeClass('active');
						all_li.eq(that.find('.slick-slide.slick-current:first').index()).addClass('active');
					}, 50);
				}).slick({
					infinite: false,
					fade: true,
					speed: 300,
					slidesToShow: 1,
					slidesToScroll: 1,
					arrows: false,
					dots: false,
					touchMove: false,
					waitForAnimate: false,
					prevArrow: '<button type="button" class="slick-prev"><i class="icon-big-arrow-l"></i></button>',
					nextArrow: '<button type="button" class="slick-next"><i class="icon-big-arrow-r"></i></button>',
					swipeToSlide: true,
					responsive: [
						{
							breakpoint: 991,
							settings: {
								slidesToShow: 2
							}
						}
					]
				});
			});
			// remove cart
			$('.fv-remove').click(function(e){
				e.preventDefault();
				$(this).closest('li').fadeOut(500);
				let ThisItem = $(this);
				setTimeout(function(){
					ThisItem.closest('li').remove();
				},500);
			});

			// slider
			$('.ts-prt-slider').each(function () {
				let that = $(this);
				that.on('init setPosition', function (event, slick) {
					let container_width = $(slick.$slider).find('.slick-list').outerHeight(),
						slide_show_count = slick.options.slidesToShow;
					$(slick.$slides).css('height', container_width / slide_show_count);
				}).slick({
					infinite: false,
					fade: false,
					speed: 300,
					slidesToShow: 4,
					slidesToScroll: 1,
					vertical: true,
					verticalSwiping: true,
					arrows: true,
					dots: false,
					touchMove: false,
					prevArrow: '<button type="button" class="slick-prev"><i class="icon-arrow-t"></i></button>',
					nextArrow: '<button type="button" class="slick-next"><i class="icon-arrow-b"></i></button>',
					swipeToSlide: true,
					responsive: [
						{
							breakpoint: 1500,
							settings: {
								slidesToShow: 3
							}
						}
					]
				});
			});
		} else {
			$('.top-slider.slick-initialized, .ts-prt-slider.slick-initialized').each(function () {
				$(this).slick('unslick');
			});
		}
	});
});
