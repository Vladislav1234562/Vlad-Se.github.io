/*
CUSTOM JS CODE
*/

$(document).ready(function(){
    /* Добавить в избранное */
    $('body').on('click', '.js_add_to_favorite', function(e){
        e.preventDefault();

        var $t = $(this);
        var id = $t.closest('.js_catalog_item').data('id');
        var type = $t.data('type');
        var quantity = $t.closest('.js_catalog_item').find('.qt input').val();
        var measure = $t.closest('.js_catalog_item').data('measure');

        if(typeof quantity == 'undefined'){
            quantity = 1;
        }

        var data = 'id='+id+'&type='+type+'&quantity='+quantity+'&measure='+measure;

        $.ajax({
            data: data,
            url: '/local/ajax/add_to_favorite.php',
            method: 'POST',
            success: function(res){
                var count = parseInt($('.js_favorite_count').text());
                if(res == 'add'){
                    $t.addClass('active');
                    count++;
                }else if(res == 'remove'){
                    $t.removeClass('active');
                    count--;
                }
                $('.js_favorite_count').text(count);
                if(count == 0){
                    $('.js_favorite_count').closest('.h-favorite').removeClass('active');
                }else{
                    $('.js_favorite_count').closest('.h-favorite').addClass('active');
                }
            }
        });
    });

    /* Удалить из избранного */
    $('body').on('click', '.js_remove_favorite', function(e){
        e.preventDefault();

        var $t = $(this);
        var id = $t.closest('.js_catalog_item').data('id');
        var type = $t.data('type');
        var data = 'id='+id+'&type='+type;

        $.ajax({
            data: data,
            url: '/local/ajax/add_to_favorite.php',
            method: 'POST',
            success: function(res){
                var count = parseInt($('.js_favorite_count').text());
                if(res == 'remove'){
                    $t.closest('.js_catalog_item').remove();
                    count--;
                }

                if(count==0){
                    location.reload();
                }

                $('.js_favorite_count').text(count);
            }
        });
    });

    /*
    Калькулятор единиц
     */
    $('body').on('change', '.js_clc_init', function(){
        var $t = $(this);
        var $parent = $(this).closest('.js_catalog_item');

        var quantity = parseFloat($parent.find('.qt input').val());
        var measure = $t.val();
        var old_measure = $parent.data('measure');

        var p61 = parseFloat($parent.data('in-pack-c')); // коэф. коробки
        var p62 = parseFloat($parent.data('in-pack-m')); // коэф. штуки

        if(typeof measure == 'undefined' || typeof old_measure == 'undefined') return false;

        if(old_measure != measure){
            var value = 1;
            if(old_measure == 'p'){
                if(measure == 'c'){
                    // p -> c
                    value = quantity*p61/p62;
                    value = Math.round10(value, 0);
                }else{
                    // p -> m
                    value = quantity*p61;
                    value = Math.round10(value, -2);
                }
            }else{
                if(measure == 'p'){
                    if(old_measure == 'c'){
                        // c -> p
                        value = quantity*p62/p61;
                        value = Math.round10(value, 0);
                    }else{
                        // m -> p
                        value = quantity/p61;
                        value = Math.round10(value, 0);
                    }
                }else{
                    if(old_measure == 'c'){
                        // c -> m
                        value = quantity*p62;
                        value = Math.round10(value, -2);
                    }else{
                        // m -> c
                        value = quantity/p62;
                        value = Math.round10(value, 0);
                    }
                }
            }

            $parent.data('measure', measure);

            $parent.find('.qt input').val(value);

            ChangeQuantity($parent.data('id'), measure, value, $parent.data('type'));
        }
    });

    // Изменить количество
    $(document).on('change', '.js_fav_quantity', function(){
        $t = $(this);
        $p = $t.closest('.js_catalog_item');

        ChangeQuantity($p.data('id'), $p.data('measure'), $t.val(), $p.data('type'));
    });

    // Инициализация поля с товарами для формы заявки
    if($('.js_form_basket').length > 0){
        $('.js_form_basket').val($('.js_basket_result').data('result'));
    }
});

function ChangeQuantity(id, m, value, type){
    var data = 'id='+id+'&type='+type+'&quantity='+value+'&measure='+m+'&action=change';

    $.ajax({
        data: data,
        url: '/local/ajax/add_to_favorite.php',
        method: 'POST',
        success: function(res){
            RefreshFavoriteList();
        }
    });
}

function RefreshFavoriteList(){
    $.ajax({
        data: 'IS_AJAX_FAVORITE=Y',
        method: 'post',
        url: '',
        success: function(html){
            $('.js_favorite_container').html(html);
            $('.js_form_basket').val($('.js_basket_result').data('result'));
        }
    });
}

function decimalAdjust(type, value, exp){
    // Если степень не определена, либо равна нулю...
    if (typeof exp === 'undefined' || +exp === 0){
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // Если значение не является числом, либо степень не является целым числом...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)){
        return NaN;
    }
    // Сдвиг разрядов
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Обратный сдвиг
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

// Десятичное округление к ближайшему
if (!Math.round10){
    Math.round10 = function(value, exp){
        return decimalAdjust('round', value, exp);
    };
}

// Форматирование числа
function number_format(number, decimals, dec_point, thousands_sep){
    if(number == parseInt(number) && decimals != 0){
        decimals = 0;
    }

    var n = number, prec = decimals;

    var toFixedFix = function (n,prec) {
        var k = Math.pow(10,prec);
        return (Math.round(n*k)/k).toString();
    };

    n = !isFinite(+n) ? 0 : +n;
    prec = !isFinite(+prec) ? 0 : Math.abs(prec);
    var sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
    var dec = (typeof dec_point === 'undefined') ? '.' : dec_point;

    var s = (prec > 0) ? toFixedFix(n, prec) : toFixedFix(Math.round(n), prec);
    // Fix for Internet Explorer parseFloat(0.55).toFixed(0) = 0;

    var abs = toFixedFix(Math.abs(n), prec);
    var _, i;

    if (abs >= 1000) {
        _ = abs.split(/\D/);
        i = _[0].length % 3 || 3;

        _[0] = s.slice(0,i + (n < 0)) +
            _[0].slice(i).replace(/(\d{3})/g, sep+'$1');
        s = _.join(dec);
    } else {
        s = s.replace('.', dec);
    }

    var decPos = s.indexOf(dec);
    if (prec >= 1 && decPos !== -1 && (s.length-decPos-1) < prec) {
        s += new Array(prec-(s.length-decPos-1)).join(0)+'0';
    }
    else if (prec >= 1 && decPos === -1) {
        s += dec+new Array(prec).join(0)+'0';
    }
    return s;
}