(function ($) {
  var jQTipnav = window.jQTipnav;
  $.fn.tipnav = function (options) {
    var matchedEl = this,
     action,
     multi = matchedEl.length > 1,
     actions = {
       'clean': function () {
         var id, wrap_el, el;
         if (matchedEl.length === 1 && matchedEl.prop('nodeName').toLowerCase() === 'body'
          || matchedEl.prop('nodeName') === '#document') {
           $('body').find('[data-jqtipnav]').remove();
           $('body').find('.jqtipnav-wrap').remove();
           $('[data-jqtipnav-main]').show().removeAttr('data-jqtipnav-main');
         }
         else {
           matchedEl.each(function () {
             id = parseInt($(this).attr('data-jqtipnav-main'));
             if (typeof id !== 'undefined') {
               el = $('body').find('[data-jqtipnav=' + id + ']');
               wrap_el = el.parent('.jqtipnav-wrap');
               el.remove();
               if(wrap_el.length !== 0 && wrap_el.children().length == 0) {
                 wrap_el.remove();
               }
             }
             $(this).show();
             $(this).removeAttr('data-jqtipnav-main');
           });
         }
       }
     },
     args = Array.prototype.slice.call(arguments),
     opts,
     wrap
    ;
    if(typeof(args[0]) !== 'string') {
      let container;
      opts = options;
      action = opts.action_element;
      if(multi) {
        wrap = true;
        matchedEl.each(function() {
          container = new jQTipnav.Container(action, $(this), opts, wrap);
          if(wrap === true) wrap = container.$wrap;
        });
      } else {
        container = new jQTipnav.Container(action, $(this), opts);
      }
      return matchedEl.hide();
    } else {
      actions[args[0]]();
    }
    return matchedEl;
  };
}(jQuery));

