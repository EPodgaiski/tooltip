//******************************
// Tooltip v:1.0, 2013, jQuery plugin
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
            content : '', // jq объект содержащий контент для тултипа
            action : '' // альтернативный вызов тултипа ("","click")
        }, options);

        return this.each(function(){

            var el = $(this),
                tooltip = {};
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

                        if (settings.content.length && settings.content != ''){
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
                        .fadeIn(settings.duration, function(){
                            el.trigger("show");
                        });

                        document.toolTipTimeout = window.setTimeout(function(){
                            tooltip.fadeOut('fast', function(){
                                el.trigger("hide");
                            });
                            console.log(settings.interval);
                        },settings.interval);

                    }
                });
            }
            else{
                el.on({
                    mouseenter: function(event){
                        var el = $(this),
                            elOffset = el.offset(),
                            tooltipTop = 0,
                            tooltipLeft = 0
                            defText = '';

                        window.clearTimeout(document.toolTipTimeout);

                        console.log('mouseenter');

                        if (tooltip.fadeInStarted)
                            return;

                        defText = el.find(".tooltip_text");

                        if (settings.content.length && settings.content != ''){
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

                        el.trigger("show");
                    },
                    mouseleave: function(){
                        console.log('mouseleave');
                        document.toolTipTimeout = window.setTimeout(function(){
                            tooltip.fadeOut('fast', function(){
                                el.trigger("hide");
                            });
                        },settings.interval);
                    }
                });
            }

            $("body").on("mouseenter", ".tooltip", function(){
                console.log('ttmouseenter');
                window.clearTimeout(document.toolTipTimeout);
            });

            $("body").on("mouseleave", ".tooltip", function(){
                console.log('ttmouseleave');
                document.toolTipTimeout = window.setTimeout(function(){
                    tooltip.fadeOut('fast', function(){
                        el.trigger("hide");
                    });
                },settings.interval);
            });
        });
    }
})(jQuery);