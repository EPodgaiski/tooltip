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
            ttLeaveInterval : 500, // интервал перед затуханием после увода мыши с подсказки
            duration : 400, // длительность затухания
            left : 0, //смещение по горизонтали относительно центра элемента
            top : 0, // смещение по вертикали относительно верха элемента
            content : null, // jq объект содержащий контент для тултипа
            contentFunc : function(){return false}, // функция, возвращающая контент для тултипа
            action : '', // альтернативный вызов тултипа ("","click")
            styleClass : '' // свой класс для изменения вида тултипа
        }, options);

        return this.each(function(){

            var el = $(this),
                tooltip = null,
                interval = settings.interval,
                ttLeaveInterval = settings.ttLeaveInterval,
                duration = settings.duration,
                top = settings.top,
                left = settings.left,
                content = settings.content,
                contentFunc = settings.contentFunc.apply(el),
                action = settings.action,
                styleClass = settings.styleClass,
                contentFunc;

            if (contentFunc){
                el.data('content', contentFunc);
            }


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
                tooltip.off(); //TODO: придумать способ добавлять одиножды event
            }

            if (!el.hasClass('this_tooltip')){f
                el.addClass('this_tooltip')
            }

            if (action != ''){
                el.on(action, function(event){
                        var el = $(this),
                            elOffset = el.offset(),
                            tooltipTop = 0,
                            tooltipLeft = 0,
                            defText = '';

                        window.clearTimeout(document.toolTipTimeout);

                        defText = el.find(".tooltip_text");

                        if(el.data('content')){
                            tooltip.html(el.data('content'));
                        }
                        else if (content && content.html != ''){
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

                        tooltip.addClass(styleClass);

                        tooltipTop = elOffset.top - tooltip.outerHeight() + top;
                        tooltipLeft = elOffset.left + (el.outerWidth())/2 - (tooltip.outerWidth()/2) + left;

                        tooltip.prop('fadeInStarted',true);
                        tooltip.css({
                            "top": tooltipTop + "px",
                            "left": tooltipLeft + "px"
                        })
                        .fadeIn(duration, function(){
                            tooltip.prop('fadeInStarted',false);
                        });

                        document.toolTipTimeout = window.setTimeout(function(){
                            tooltip.fadeOut('fast', function(){
                                tooltip.attr('class', 'tooltip');
                            });
                        },interval);
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

                        if (tooltip.prop('fadeInStarted')) return;

                        defText = el.find(".tooltip_text");

                        if(el.data('content')){
                            tooltip.html(el.data('content'));
                        }
                        else if (content && content.html != ''){
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

                        tooltip.addClass(styleClass);

                        tooltipTop = elOffset.top - tooltip.outerHeight() + top;
                        tooltipLeft = elOffset.left + (el.outerWidth())/2 - (tooltip.outerWidth()/2) + left;

                        tooltip.prop('fadeInStarted',true);
                        tooltip.css({
                            "top": tooltipTop,
                            "left": tooltipLeft
                        }).fadeIn(duration, function(){
                            tooltip.prop('fadeInStarted',false);
                        });

                    },
                    mouseleave: function(){
                        document.toolTipTimeout = window.setTimeout(function(){
                            tooltip.fadeOut('fast');
                            tooltip.attr('class', 'tooltip');
                        },interval);
                    }
                });
            }

            tooltip.on("mouseenter", function(event){
                window.clearTimeout(document.toolTipTimeout);
            });

            tooltip.on("mouseleave", function(event){
                document.toolTipTimeout = window.setTimeout(function(){
                    $('#toolTipBox').fadeOut('fast', function(){
                        $('#toolTipBox').attr('class', 'tooltip');/*TODO*/
                    });
                },ttLeaveInterval);
            });
        });
    }
})(jQuery);