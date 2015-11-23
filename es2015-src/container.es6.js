(function($) {
  var jQTipnav, _module,
   unique = (function () {
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
      var set_hide_timeout = () => {
         container.data('hoverTimeout', setTimeout(() => {
           container.fadeOut(this.fade_time || 200, () => {
             container.data('open', false);
           })
         }, 200));
       }
       ;
      this.$el.bind(this.trigger_event, (e) => {
        e.preventDefault();
        if (typeof container.data('hoverTimeout') !== 'undefined')
          clearTimeout(container.data('hoverTimeout'));
        if(this.trigger_event === 'click') {
          if(container.data('open') === true) {
            set_hide_timeout();
          }
        }
        container.show().data('open', true);
      });
      if(this.trigger_event !== 'click') {
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
      Object.defineProperty(this, '$wrap', {
        'writable': false,
        'value': this.container.$wrap
      });
      Object.defineProperty(this, '$container', {
        set: (value) => {
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
      if(wrap === true) {
        this.action.bind_container(this.$wrap);
      } else if(!wrap) {
        this.action.bind_container(this.$container);
      }
      this.action.setup_container(this.$container, this.$wrap);
    }

    static build($copy, wrap=false) {
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
        let id = unique.generate();
        $el = $('<div data-jqtipnav=' + id + '><ul></ul></div>');
        $el.find('ul').append($copy.children().clone());
        $copy.attr('data-jqtipnav-main', id);
        if(!!wrap) {
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
  window.jQTipnav = jQTipnav;
}(jQuery));
