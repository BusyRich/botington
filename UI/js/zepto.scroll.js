//https://gist.github.com/benjamincharity/6058688
;(function ($) {
  var scrollToTimerCache,
      zeptoScroll = function (el, to, duration) {
        if (duration < 0) {
          return;
        }

        var difference = to - el.scrollTop();
        var perTick = difference / duration * 10;
        scrollToTimerCache = setTimeout(function () {
          if (!isNaN(parseInt(perTick, 10))) {
            el.scrollTop(el.scrollTop() + perTick);
            zeptoScroll(el, to, duration - 10);
          }
        }, 10);
      };

  $.fn.animateScroll = function (to, duration) {
    clearTimeout(scrollToTimerCache);
    zeptoScroll(this, to, duration || 400);
  }
})(Zepto)