//******************************
// Tooltip v:1.0, 2013, jQuery plugin
// Creater: Egor Podgaiski, http://gorik.name/
// Dual licensed under the MIT and GPL licenses:
// http://www.opensource.org/licenses/mit-license.php
// http://www.gnu.org/licenses/gpl.html
// I Am ...
//******************************
(function($){
    $.fn.toolTip = function(args){

        var settings = $.extend({
            interval : 200, // интервал перед затуханием
            duration : 400, // длительность затухания
            left : 0, //смещение по горизонтали относительно центра элемента
            top : 0, // смещение по вертикали относительно верха элемента
            content : '', // jq объект содержащий контент для тултипа
            action : '' // альтернативный вызов тултипа ("","click")
        }, args);

        return this.each(function(){

            var el = $(this),
                tooltip = null;
                interval = settings.interval,
                duration = settings.duration,
                ttLeft = settings.left,
                ttTop = settings.top,
                content = settings.content,
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
                    click: function(event)
                    {
                        var el = $(this),
                            elOffset = el.offset(),
                            tooltipTop = 0,
                            tooltipLeft = 0,
                            defText = '';

                        window.clearTimeout(document.toolTipTimeout);

                        defText = el.find(".tooltip_text");

                        if (content.length && content != ''){
                            tooltip.html($(content).html());
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

                        tooltipTop = elOffset.top - tooltip.outerHeight() + ttTop;
                        tooltipLeft = elOffset.left + (el.outerWidth())/2 - (tooltip.outerWidth()/2) + ttLeft;

                        tooltip.css({
                            "top": tooltipTop + "px",
                            "left": tooltipLeft + "px"
                        })
                        .fadeIn(duration, function(){
                            el.trigger("show");
                        });

                        document.toolTipTimeout = window.setTimeout(function(){
                            tooltip.fadeOut('fast', function(){
                                el.trigger("hide");
                            });
                        },interval);

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

                        if (tooltip.fadeInStarted)
                            return;

                        defText = el.find(".tooltip_text");

                        if (content.length && content != ''){
                            tooltip.html($(content).html());
                        }
                        else if (defText.length && defText.html() != ''){
                            tooltip.html(defText.html());
                        }

                        tooltipTop = elOffset.top - tooltip.outerHeight() + ttTop;
                        tooltipLeft = elOffset.left + (el.outerWidth())/2 - (tooltip.outerWidth()/2) + ttLeft;

                        tooltip.fadeInStarted = true;
                        tooltip.css({
                            "top": tooltipTop,
                            "left": tooltipLeft
                        }).fadeIn(duration, function(){
                            tooltip.fadeInStarted = false;
                        });

                        el.trigger("show");
                    },
                    mouseleave: function(){
                        document.toolTipTimeout = window.setTimeout(function(){
                            tooltip.fadeOut('fast', function(){
                                el.trigger("hide");
                            });
                        },interval);
                    }
                });
            }

            $("body").on("mouseenter", ".tooltip", function(){
                window.clearTimeout(document.toolTipTimeout);
            });

            $("body").on("mouseleave", ".tooltip", function(){
                document.toolTipTimeout = window.setTimeout(function(){
                    tooltip.fadeOut('fast', function(){
                        el.trigger("hide");
                    });
                },interval);
            });
        });
    }
})(jQuery);