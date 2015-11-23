# jQTipnav

----
## what is this?

> A jQuery plugin enabling to show small navigation lists when clicking on or hovering over action element.

----
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

where options is an object containig at least
*action_element* property

if multiple navigation lists are matched inside jquery selector the plugin will show arrows which are used to switch between lists

## options

* fade_time - set fade-out time in ms
* trigger_event - set to 'click' to trigger showing and hiding tipnav on mouse click instead hovering

