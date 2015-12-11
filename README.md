# jQTipnav

## what is this?

> A jQuery plugin which enables showing small navigation bars on interaction with action element.

## usage
write your HTML:

    <!-- inside head tag -->
    <link rel="stylesheet" type="text/css" href="[...]/jqtipnav.min.css">
    
    <ul id="subnav">
      <li><a href="">Apples</a> |</li>
      <li><a href="">Oranges</a> |</li>
      <li><a href="">Pinepples</a></li>
    </ul>
    <!-- ... -->
    <a href="...">Hover over!</a>
    
    <!-- before closing body tag -->
    <script src="[...]/jquery.js"></script>
    <script src="[...]/build/jqtipnav.min.js"></script>

Initialize the plugin with:

    $('#subnav').tipnav(options);

where options is an object containing at least *action_element* property

if multiple navigation lists are matched inside jquery selector the plugin will show arrows which are used to switch between lists

## options

* action_element - jQuery selector object (required)
* fade_time - set fade-out time in ms
* trigger_event - set to 'click' to trigger showing and hiding tipnav on mouse click instead hovering

## contributing

Have some ideas to make this plugin work better or want to add a feature? Following commands and grunt tasks will get you going:

* npm install - install npm development dependencies
* bower install - install bower development dependencies
* grunt babel - compile es6 to es5 inside *js-compiled* directory
* grunt watch - auto compilation when files change
* grunt build-dev - build dependencies for tests
* grunt karma - run tests

After building installing bower development dependencies example/example.html can be ran to see plugin in action.
Jasmine is used for test cases which are in spec.js file and writing some along with added code would be really helpful.

Use *grunt build* to build the binaries and *bower install* to get jQuery (it will be downloaded to vendor directory).
