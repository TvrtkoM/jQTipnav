# [jQTipnav](http://tvrtkom.github.io/jQTipnav)

## what is this?

> A jQuery plugin which enables showing small navigation bars on interaction with action element.

## usage

Write your HTML:

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

where options is an object containing at least *action_element* property.
If multiple navigation lists are matched inside jquery selector, plugin will show additional arrows for navigation.
Clicking on arrow will show you next/previous navigation list.

## options

* action_element - jQuery selector object (required)
* fade_time - set fade-out time in ms
* trigger_event - set to 'click' to trigger showing and hiding tipnav on mouse click instead hovering

## clean method

Plugin can be called with string 'clean' as first argument. In this case it will try to revert back to state before plugin is initialized,
removing all created html elements.

e.g

    $(document).tipnav('clean') // removes all jqtipnav elements from page and shows hidden ones
    $('#subnav').tipnav('clean') // removes all jqtipnv elements but only for matched element (#subnav)

## contributing

Have some ideas to make this plugin work better or want to add a feature? Following commands and grunt tasks will get you going:

* npm install - install npm development dependencies
* bower install - install bower development dependencies
* grunt babel - compile es6 to es5 inside *js-compiled* directory
* grunt dev-dep - build development dependencies
* grunt karma - run tests
* grunt watch - auto compilation and test when files change

Use *grunt build* to build the binaries and *bower install* to get jQuery (it will be downloaded to vendor directory).

After building, installing bower development dependencies example/example.html can be ran to see plugin in action.
Jasmine is used for test cases which are in spec.js file and writing some along with added code would be really helpful.

