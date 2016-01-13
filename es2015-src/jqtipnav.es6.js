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
        ac_mid = geometry.ac.off.left + geometry.ac.width/2,
        top = geometry.ac.off.top - geometry.tn.height,
        left
        ;
      if(geometry.tn.width <= geometry.ac.width || geometry.ac.off.left > geometry.tn.width/2) {
        left = ac_mid - geometry.tn.width/2;
      } else {
        left = geometry.ac.off.left;
      }
      if(geometry.ac.off.top < geometry.tn.height) {
        top = geometry.ac.off.top + geometry.ac.height;
      }
      return {
        'left': left,
        'top': top
      };
    }

    bind_container(container) {
      // bind events to container
      var set_hide_timeout = () => {
        // stores timeout to element's data attribute after
        // container fades out after timeout of 200
          container.data('hoverTimeout', setTimeout(() => {
            container.fadeOut(this.fade_time || 200, () => {
              container.data('open', false);
            })
          }, 200));
        }
        ;
      this.$el.bind(this.trigger_event, (e) => {
        // on specified trigger event container should appear

        e.preventDefault();
        // clear hover timeout each time element is triggered
        if (typeof container.data('hoverTimeout') !== 'undefined')
          clearTimeout(container.data('hoverTimeout'));

        if(this.trigger_event === 'click') {
          // start timeout if container visible and only on 'click'
          if(container.data('open') === true) {
            set_hide_timeout();
          }
        }
        container.show().data('open', true);
      });
      if(this.trigger_event !== 'click') {
        // runs only on 'click'
        this.$el.mouseleave(function() {
          set_hide_timeout();
        });
        container.mouseenter((function() {
          clearTimeout($(this).data('hoverTimeout'));
        }));
        container.mouseleave(function() {
          set_hide_timeout();
        });
      }

    }

    setup_container(container, wrap) {
      // sets up container with additional events
      var css,
        arrows = container.find('.jqtipnav-prev, .jqtipnav-next')
        ;
      if(arrows.length > 0) {
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
          container.hide();
          $el.show();
          css = this.get_container_position($el);
          wrap.css(css);
        });
      }
      this.$el.bind(this.trigger_event, (e) => {
        // on trigger event calculate and set position of container
        if(!wrap) {
          css = this.get_container_position(container);
          container.show().css(css);
        } else {
          let $el = wrap.find('div[data-jqtipnav]:visible');
          css = this.get_container_position($el);
          wrap.css(css);
        }
      });
    };
  });

  jQTipnav.define('Container', class {
    constructor($action_el, $copy, options, wrap) {
      var default_options = {
          'trigger_event': 'mouseenter',
          'fade_time': 200
        },
        options = $.extend({}, default_options, options || {}),
        wrap = wrap || false // wrap element? boolean or jQuery object
        ;
      this.action = new jQTipnav.Action($action_el, options);
      this.container = jQTipnav.Container.build($copy, wrap);

      // define some properties
      Object.defineProperty(this, '$wrap', {
        'writable': false,
        'value': this.container.$wrap
      });

      Object.defineProperty(this, '$container', {
        set: (value) => {
          // setting property removes original elemnet's parent
          var els = value.children().clone();
          this.container.$el.find('ul').append(els);
        },
        get: () => {
          return this.container.$el;
        }
      });
      Object.defineProperty(this, 'id', {
        'writable': false,
        'value': this.container.id
      });

      // TODO: merge setup_container into bind_container and refactor code below
      // it should be just this.action.bind_container
      if(wrap === true) {
        this.action.bind_container(this.$wrap);
      } else if(!wrap) {
        this.action.bind_container(this.$container);
      }
      this.action.setup_container(this.$container, this.$wrap);
    }

    static build($copy, wrap=false) {
      // build a container element markup and return it
      // adds $copy contents and arrows if content should be wrapped (multiple matched)
      var $el, $wrap;
      if(typeof wrap === 'boolean' && wrap === true) {
        $wrap = $('<div class="jqtipnav-wrap"></div>');
        $wrap.css('position', 'absolute');
        $el = jQTipnav.Container.build($copy, $wrap).$el;
        $el.appendTo($wrap);
        $el.show();
        $wrap.appendTo('body');
        $wrap.hide();
      }
      else {
        // assign unique id to each container
        let id = unique.generate();
        $el = $('<div data-jqtipnav=' + id + '><ul></ul></div>');
        $el.find('ul').append($copy.children().clone());
        $copy.attr('data-jqtipnav-main', id);
        if(!!wrap) {
          // if wrapped add arrow buttons
          let arrow_p = $('<li><a class="jqtipnav-prev" href="#">&lt;</a></li>'),
            arrow_n = $('<li><a class="jqtipnav-next" href="#">&gt;</a></li>')
            ;
          $wrap = wrap;
          $el.find('ul').prepend(arrow_p).append(arrow_n);
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
});

