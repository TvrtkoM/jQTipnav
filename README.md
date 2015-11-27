# jQTipnav

## what is this?

> A jQuery plugin enabling to show small navigation lists when clicking on or hovering over action element.

## usage
write your HTML:

    <ul id="subnav">
      <li><a href="">Apples</a> |</li>
      <li><a href="">Oranges</a> |</li>
      <li><a href="">Pinepples</a></li>
    </ul>
    <!-- ... ->
    <a href="...">Hover over!</a>


inside javascript file that's included after jquery.js initialize the plugin:


    $('#subnav').tipnav(options);

where options is an object containing at least *action_element* property

if multiple navigation lists are matched inside jquery selector the plugin will show arrows which are used to switch between lists

## options

* action_element - jQuery selector object (required)
* fade_time - set fade-out time in ms
* trigger_event - set to 'click' to trigger showing and hiding tipnav on mouse click instead hovering

## contributing

Have some ideas to make this plugin work better or want to add a feature? Following grunt tasks should be used to get you going:

* grunt babel - compile es6 to es5 inside *js-compiled* directory
* grunt watch - auto compilation when files change
* grunt build-dev - build dependencies for tests
* grunt karma - run tests

Jasmine is used for test cases which are in spec.js file and writing some along with added code would be really helpful.

Use *grunt build* to build the binaries and *bower install* to get jQuery (it will be downloaded to vendor directory).
