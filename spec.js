jasmine.getFixtures().fixturesPath = '/base/';

var get_id = function($selector) {
  var id;
  _.forEach(['', '-main'], function(val) {
    id = $selector.attr('data-jqtipnav' + val);
  });
  return id;
};

describe('main application', function() {
  var $test_container_01, $notes, tipnav_func = $.fn.tipnav,
   default_options;

  beforeEach(function() {
    loadFixtures('spec.html');
    default_options = {
      'action_element': $('#link-01')
    };
    $test_container_01 = $('#test-container-01');
    $notes = $('.note');
    $test_container_01.tipnav(default_options);
  });

  it('should be present as jquery function', function() {
    spyOn($.fn, 'tipnav');
    $('<div>').tipnav(default_options);
    expect($.fn.tipnav).toHaveBeenCalled();
  });

  it('should wrap multiple tipnavs', function() {
    $notes.tipnav(default_options);
    expect($('.jqtipnav-wrap')).toExist();
    expect($('.jqtipnav-wrap')).toBeInDOM();
    expect($('.jqtipnav-wrap').find('*').length).toBeGreaterThan(0);
  });

  it('should turn original elements unvisible', function() {
    expect($test_container_01).toBeHidden();
    $notes.tipnav(default_options);
    expect($notes).toBeHidden();
  });

  it('should put div[data-jqtipbar] element into body when initialized', function() {
    expect($('body > div[data-jqtipnav]')).toExist();
    expect($('body > div[data-jqtipnav]')).toBeInDOM();
  });


  it('should have cleanup mechanism for all created elements', function() {
    // calling 'clean' on document to delete all created elements
    $(document).tipnav('clean');
    expect($('body > div[data-jqtipnav]').length).toBe(0);
    $notes.tipnav(default_options);
    $test_container_01.tipnav(default_options);
    expect($('.jqtipnav-wrap > div[data-jqtipnav]').length).toBe(4);
    expect($('body > div[data-jqtipnav]').length).toBe(1);
    $(document).tipnav('clean');
  });

  it('should create each element with different data-jqtipnav value', function() {
    var ids = [], id;
    $(document).tipnav('clean');
    $notes.tipnav(default_options);
    $test_container_01.tipnav(default_options);
    for(var i=0; i<$('body > div[data-jqtipnav]').length; i++) {
      id = $('body > div[data-jqtipnav]').eq(i).data('jqtipnav');
      expect(_.contains(ids, id)).toBe(false);
      ids.push(id);
    }
  });

  it('should add data-jqtipnav-main attribute on elements plugin is applied', function() {
    expect($test_container_01.data('jqtipnav-main')).toBeDefined();
  });

  it('should delete created elements for particular selector when calling "clean"', function() {
    var ids = [], $test_els;
    $(document).tipnav('clean');
    $notes.tipnav(default_options);
    $test_els = $('div[data-jqtipnav-main]');
    for(var i=0; i<$test_els.length; i++) {
      ids.push($test_els.eq(i).data('jqtipnav-main'));
    }
    $test_container_01.tipnav(default_options);
    $notes.tipnav('clean');
    for(var i=0; i<ids.length; i++) {
      expect($('div[data-jqtipnav=' + ids[i] + ']').length).toBe(0);
    }
    expect($('div[data-jqtipnav]').length).toBe(1); // only tipnav for $test_container_01 left

    // clean that up & test again
    $test_container_01.tipnav('clean');
    expect($('div[data-jqtipnav]').length).toBe(0); // no tipnavs left
  });

  it('should delete data-jqtipnav-main attributes from elements when "clean" is called', function() {
    $(document).tipnav('clean');
    $notes.tipnav(default_options);
    $test_container_01.tipnav(default_options);
    $notes.tipnav('clean');
    expect($('.note[data-jqtipnav-main]').length).toBe(0);
    expect($('[data-jqtipnav-main]').length).toBe(1);
    $test_container_01.tipnav('clean');
    expect($('[data-jqtipnav-main]').length).toBe(0);
  });

  it('should show original elements after "clean" is done', function() {
    $(document).tipnav('clean');
    $notes.tipnav(default_options);
    $notes.tipnav('clean');
    $test_container_01.tipnav('clean');
    expect($('.note')).toBeVisible();
    expect($('#test-container-01')).toBeVisible();
  });

  it('should create element for each matched element', function() {
    $(document).tipnav('clean');
    $notes.tipnav(default_options);
    expect($('.jqtipnav-wrap div[data-jqtipnav]').length).toBe(4);
  });

  it('should create element with data-jqtipbar set', function() {
    expect($('body > div[data-jqtipnav]').data('jqtipnav')).toBeDefined();
  });

  it('should hide created elements as well', function() {
    $(document).tipnav('clean');
    $test_container_01.tipnav(default_options);
    $notes.tipnav(default_options);
    expect($('div[data-jqtipnav]')).toBeHidden();
    $notes.tipnav('clean');
    expect($notes).toBeVisible();
    $(document).tipnav('clean');
  });

  it('should copy main elements content to tipnav elements', function() {
    var id = $test_container_01.data('jqtipnavMain');
    expect($('div[data-jqtipnav=' + id + ']').find('ul').html()).toEqual($test_container_01.html().trim());
  });
});

describe('tipnav', function() {
  var $test_container_01, $notes,
   default_options, $action_el;

  beforeEach(function() {
    loadFixtures('spec.html');
    $action_el = $('#link-01');
    default_options = {
      'action_element': $action_el
    };
    $(document).tipnav('clean');
    $test_container_01 = $('#test-container-01');
    $notes = $('.note');
    $test_container_01.tipnav(default_options);
  });

  afterEach(function() {
  });

  describe('positioning', function() {
    var $test_container_01,
     default_options, id,
     tipnav,
     $action1,
     dims,
     get_dimensions = function(tn, ac) {
       return {
         'tn': {
           'off': tn.offset(),
           'height': tn.outerHeight(),
           'width': tn.outerWidth()
         },
         'ac': {
           'off': ac.offset(),
           'height': ac.outerHeight(),
           'width': ac.outerWidth()
         }
       };
     };

    beforeEach(function() {
      loadFixtures('spec.html');
      $(document).tipnav('clean');
      $action1 = $('#link-01');
      $test_container_01 = $('#test-container-01');
    });

    it('should show in middle if the action element if smaller than it', function() {
      default_options = {
        'action_element': $action1
      };
      $test_container_01.tipnav(default_options);
      id = get_id($test_container_01);
      tipnav = $('[data-jqtipnav=' + id + ']');
      $action1.trigger('mouseenter');
      dims = get_dimensions(tipnav, $action1);
      expect(tipnav).toBeVisible();
      expect(dims.ac.width).toBeGreaterThan(dims.tn.width);
      expect(Math.floor(dims.tn.off.left)).toEqual(Math.floor(dims.ac.off.left + dims.ac.width/2 - dims.tn.width/2));
    });

  });
  describe('containers', function() {
    describe('hovering over action', function () {
      var $action, $tipnavs,
       ids
       ;
      beforeEach(function () {
        loadFixtures('spec.html');
        ids = [];
        jQuery.fx.off = true;
        $action = $('#link-02');
        $tipnavs = $('.tipnav');
        $(document).tipnav('clean');
        $tipnavs.tipnav({
          'action_element': $action
        });
        $('div[data-jqtipnav]').each(function () {
          ids.push($(this).attr('data-jqtipnav'));
        });
      });

      it('should show only first tipnav when activated', function () {
        $action.trigger('mouseenter');
        expect($('div[data-jqtipnav=' + ids[0] + ']')).toBeVisible();
        expect($('div[data-jqtipnav=' + ids[1] + ']')).toBeHidden();
        expect($('div[data-jqtipnav=' + ids[2] + ']')).toBeHidden();
        $action.trigger('mouseleave');
      });

      it('should cycle navs on arrow clicks', function() {
        var tipnav1 = $('div[data-jqtipnav=' + ids[0] + ']'),
          tipnav2 = $('div[data-jqtipnav=' + ids[1] + ']'),
          tipnav3 = $('div[data-jqtipnav=' + ids[2] + ']'),
          next_arr = tipnav1.find('.jqtipnav-next'),
          prev_arr = tipnav1.find('.jqtipnav-prev')
        ;
        $action.trigger('mouseenter');
        next_arr.click();
        expect(tipnav1).toBeHidden();
        expect(tipnav2).toBeVisible();
        expect(tipnav3).toBeHidden();
        next_arr = $(tipnav2).find('.jqtipnav-next');
        next_arr.trigger('click');
        expect(tipnav1).toBeHidden();
        expect(tipnav2).toBeHidden();
        expect(tipnav3).toBeVisible();
        next_arr = $(tipnav3).find('.jqtipnav-next');
        next_arr.trigger('click');
        expect(tipnav1).toBeVisible();
        expect(tipnav2).toBeHidden();
        expect(tipnav3).toBeHidden();
        prev_arr.click();
        expect(tipnav1).toBeHidden();
        expect(tipnav2).toBeHidden();
        expect(tipnav3).toBeVisible();
        $action.trigger('mouseleave');
      });

    });
  });
});

