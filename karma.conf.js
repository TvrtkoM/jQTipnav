module.exports = function(config) {
    config.set({
        basePath: '',
        'frameworks': ["jasmine"],
        'files': [
            {pattern: 'vendor/jquery/dist/jquery.js', watched: true, served: true, included: true},
            {pattern: 'node_modules/jasmine-jquery/lib/jasmine-jquery.js', watched: true, served: true, included: true},
            {pattern: 'vendor/lodash.js', watched: true, served: true, included: true},
            {pattern: 'js-compiled/jqtipnav.es6-compiled.js', watched: true, served: true, included: true},
            {pattern: 'spec.html', watched: true, served: true, included: true},
            {pattern: 'spec.js', watched: true, served: true, included: true}
        ]
    });
};