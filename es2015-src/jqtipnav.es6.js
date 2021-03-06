(function(factory) {
  if(typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(window.jQuery);
  }
})(function ($) {
  var jQTipnav, _module,
    unique = (function () {
      // returns incremented numbers
      var id;
      return {
        generate: function () {
          id = typeof id === 'undefined' ? 1 : id + 1;
          return id;
        }
      };
    }())
    ;

  _module = class {
    define (name, _obj) {
      this[name] = _obj
    }
  };

  jQTipnav = new _module();

  jQTipnav.define('Action', class {
    constructor($action_el, options) {
      this.$el = $action_el;
      this.trigger_event = options.trigger_event;
      this.fade_time = options.fade_time;
    }

    get_geometry(container) {
      // returns container's and action element's dimensions and offset point
      return {
        'tn': {
          'off': container.offset(),
          'height': container.outerHeight(),
          'width': container.outerWidth()
        },
        'ac': {
          'off': this.$el.offset(),
          'height': this.$el.outerHeight(),
          'width': this.$el.outerWidth()
        }
      };
    }

    get_container_position(container) {
      // return position of the navigation container on the screen
      var geometry = this.get_geometry(container),
       full_width = $(window).width(),
       room = (geometry.tn.width - geometry.ac.width) / 2,
       ac_mid = geometry.ac.off.left + geometry.ac.width / 2,
       top = geometry.ac.off.top - geometry.tn.height,
       left
       ;
      if (geometry.tn.width <= geometry.ac.width || geometry.ac.off.left > room
          && full_width - (geometry.ac.off.left + geometry.ac.width) > room) {
        left = ac_mid - geometry.tn.width / 2;
      } else {
        if(full_width - (geometry.ac.off.left + geometry.ac.width) < room) {
          left = full_width - geometry.tn.width;
        } else {
          left = 0;
        }
      }
      if (geometry.ac.off.top < geometry.tn.height) {
        top = geometry.ac.off.top + geometry.ac.height;
      }
      return {
        'left': left,
        'top': top
      };
    }

    bind_container(container) {
      // sets up action element with basic events for displaying containers
      var set_hide_timeout = () => {
         // stores timeout to element's data attribute after
         // container fades out after timeout of 500
         container.data('hoverTimeout', setTimeout(() => {
           container.fadeOut(this.fade_time || 500, () => {
             container.data('open', false);
           })
         }, 200));
       }
       ;
      this.$el.bind(this.trigger_event, (e) => {
        // on specified trigger event container should appear
        e.preventDefault();
        container.show().css('left', 0);
        let css = this.get_container_position(container);
        container.data('open', true).css(css);
        // clear hover timeout each time element is triggered
        if (typeof container.data('hoverTimeout') !== 'undefined')
          clearTimeout(container.data('hoverTimeout'));

        if (this.trigger_event === 'click') {
          // start timeout if container visible and only on 'click'
          if (container.data('open') === true) {
            set_hide_timeout();
          }
        }
      });
      if (this.trigger_event !== 'click') {
        // runs only on 'hover'
        this.$el.mouseleave(function () {
          set_hide_timeout();
        });
        container.mouseenter(function () {
          if(container.data('fade') == true) {
            container.stop();
            container.fadeIn(100);
            container.data('fade', false);
          }
          clearTimeout($(this).data('hoverTimeout'));
        });
        container.mouseleave(function () {
          container.data('fade', true);
          set_hide_timeout();
        });
      }
    }

    setup_container(container, wrap) {
      // sets up container with additional events for navigation and positioning
      var css,
       arrows = container.find('.jqtipnav-prev, .jqtipnav-next')
       ;
      if(arrows.length > 0) {
        // show next visible element when arrows are clicked
        arrows.bind('click', (e) => {
          var $el, arrow = $(e.target);
          e.preventDefault();
          if (arrow.hasClass('jqtipnav-prev')) {
            $el = container.prev();
            if ($el.length == 0) {
              $el = container.siblings(':last');
            }
          }
          if (arrow.hasClass('jqtipnav-next')) {
            $el = container.next();
            if ($el.length == 0) {
              $el = container.siblings(':first');
            }
          }
          // hide last visible container, show next one and set tipnav container position
          wrap.css('left', 0);
          container.hide();
          $el.show();
          css = this.get_container_position($el);
          wrap.css(css);
        });
      }
    };
  });

  jQTipnav.define('Container', class {
    constructor($action_el, $copy, options, wrap) {
      var default_options = {
          'trigger_event': 'mouseenter',
          'fade_time': 500
        },
        options = $.extend({}, default_options, options || {}),
        wrap = wrap || false // wrap element? boolean or jQuery object
        ;
      this.action = new jQTipnav.Action($action_el, options);
      this.container = jQTipnav.Container.build($copy, wrap);

      this.$wrap = this.container.$wrap;

      if(wrap === true) {
        this.action.bind_container(this.$wrap);
      } else if(!wrap) {
        this.action.bind_container(this.container.$el);
      }
      this.action.setup_container(this.container.$el, this.$wrap);
    }

    static build_simple($copy, multi) {
      // bulds only container
      var id = unique.generate(),
       $el = $('<div data-jqtipnav=' + id + '><ul></ul></div>')
       ;
      $el.find('ul').append($copy.children().clone());
      $copy.attr('data-jqtipnav-main', id);
      if(!!multi) {
        let arrow_p = $('<li><a class="jqtipnav-prev" href="#">&lt;</a></li>'),
         arrow_n = $('<li><a class="jqtipnav-next" href="#">&gt;</a></li>')
         ;
        $el.find('ul').prepend(arrow_p).append(arrow_n);
      }
      return $el;
    }

    static build($copy, wrap=false) {
      // build a container element markup and return it
      // adds $copy contents and arrows if content should be wrapped (multiple matched)
      var $el, $wrap;
      if(wrap === true) {
        $wrap = $('<div class="jqtipnav-wrap"></div>');
        $wrap.css('position', 'absolute');
        $el = jQTipnav.Container.build_simple($copy, wrap);
        $el.show().appendTo($wrap);
        $wrap.appendTo('body');
        $wrap.hide();
      }
      else {
        $el = jQTipnav.Container.build_simple($copy, wrap);
        if(!!wrap) {
          $wrap = wrap;
          $el.appendTo($wrap);
          $el.hide();
        }
        else {
          $el.css('position', 'absolute');
          $el.appendTo('body');
          $el.hide();
        }
      }
      return {
        $wrap: $wrap,
        $el: $el,
        id: $el.attr('data-jqtipnav')
      };
    }
  });

  $.fn.tipnav = function (options) {
    // plugin definition
    var matchedEl = this,
     action,
     multi = matchedEl.length > 1,
     actions = {
       'clean': function () {
         // can be called on element - $jqtipnav.tipnav('clean')
         // or on whole document $(document).tipnav('clean')
         // removes all the mess plugin has done under matched element
         var id, wrap_el, el;
         if (matchedEl.length === 1 && matchedEl.prop('nodeName').toLowerCase() === 'body'
          || matchedEl.prop('nodeName') === '#document') {
           // if matched element is document or body
           $('body').find('[data-jqtipnav]').remove();
           $('body').find('.jqtipnav-wrap').remove();
           $('[data-jqtipnav-main]').show().removeAttr('data-jqtipnav-main');
         }
         else {
           matchedEl.each(function () {
             // else remove all jqtpnav mess for only matched elements
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
      opts = options;
      action = opts.action_element;
      if(multi) {
        wrap = true;
        matchedEl.each(function() {
          let container;
          container = new jQTipnav.Container(action, $(this), opts, wrap);
          if(wrap === true) wrap = container.$wrap;
        });
      } else {
        new jQTipnav.Container(action, $(this), opts);
      }
      return matchedEl.hide();
    } else {
      actions[args[0]]();
    }
    return matchedEl;
  };
});

