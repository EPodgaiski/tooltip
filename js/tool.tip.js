//******************************
// Tooltip v:0.1.a, 2013, jQuery plugin
// Creater: Egor Podgaiski, http://gorik.name/
// Dual licensed under the MIT and GPL licenses:
// http://www.opensource.org/licenses/mit-license.php
// http://www.gnu.org/licenses/gpl.html
// I Am ...
//******************************
(function($){
    $.fn.toolTip = function(options){

        var settings = $.extend({
            interval : 500, // интервал перед затуханием
            duration : 400, // длительность затухания
            left : 0, //смещение по горизонтали относительно центра элемента
            top : 0, // смещение по вертикали относительно верха элемента
            content : null, // jq объект содержащий контент для тултипа
            action : '' // альтернативный вызов тултипа ("","click")
        }, options);

        return this.each(function(){

            var el = $(this),
                tooltip = null;
                action = settings.action;

            document.toolTipTimeout = 0;

            if (!$('#toolTipBox').length){
                tooltip = $('<div/>',{
                    'class':'tooltip',
                    id:'toolTipBox',
                    style:'position:absolute; display:none;'
                })
                $('body').append(tooltip);
            }
            else{
                tooltip = $('#toolTipBox');
                tooltip.off(); /*TODO придумать способ добавлять одиножды event*/
            }

            if (!el.hasClass('this_tooltip')){
                el.addClass('this_tooltip')
            }

            if (action != ''){
                el.on({
                    click: function(event){
                        var el = $(this),
                            elOffset = el.offset(),
                            tooltipTop = 0,
                            tooltipLeft = 0,
                            defText = '';

                        window.clearTimeout(document.toolTipTimeout);

                        defText = el.find(".tooltip_text");

                        if (settings.content && settings.content != ''){
                            tooltip.html($(settings.content).html());
                        }
                        else if (defText.length && defText.html() != ''){
                            tooltip.html(defText.html());
                        }
                        else{
                            if(tooltip.is(':visible')){
                                tooltip.hide();
                                tooltip.html('');
                            }
                            return;
                        }

                        tooltipTop = elOffset.top - tooltip.outerHeight() + settings.top;
                        tooltipLeft = elOffset.left + (el.outerWidth())/2 - (tooltip.outerWidth()/2) + settings.left;

                        tooltip.css({
                            "top": tooltipTop + "px",
                            "left": tooltipLeft + "px"
                        })
                        .fadeIn(settings.duration);

                        document.toolTipTimeout = window.setTimeout(function(){
                            tooltip.fadeOut('fast');
                        },settings.interval);

                    }
                });
            }
            else{
                el.on({
                    mouseenter: function(event){
                        var el = $(this),
                            elOffset = el.offset(),
                            tooltipTop = '',
                            tooltipLeft = '',
                            defText = '';

                        window.clearTimeout(document.toolTipTimeout);

                        if (tooltip.fadeInStarted) return;

                        defText = el.find(".tooltip_text");

                        if (settings.content && settings.content.html() != ''){
                            tooltip.html(settings.content.html());
                        }
                        else if (defText.length && defText.html() != ''){
                            tooltip.html(defText.html());
                        }

                        tooltipTop = elOffset.top - tooltip.outerHeight() + settings.top;
                        tooltipLeft = elOffset.left + (el.outerWidth())/2 - (tooltip.outerWidth()/2) + settings.left;

                        tooltip.fadeInStarted = true;
                        tooltip.css({
                            "top": tooltipTop,
                            "left": tooltipLeft
                        }).fadeIn(settings.duration, function(){
                            tooltip.fadeInStarted = false;
                        });

                    },
                    mouseleave: function(){
                        document.toolTipTimeout = window.setTimeout(function(){
                            tooltip.fadeOut('fast');
                        },settings.interval);
                    }
                });
            }

            tooltip.on("mouseenter", function(event){
                window.clearTimeout(document.toolTipTimeout);
            });

            tooltip.on("mouseleave", function(event){
                document.toolTipTimeout = window.setTimeout(function(){
                    $('#toolTipBox').fadeOut('fast');
                },settings.interval);
            });
        });
    }
})(jQuery);