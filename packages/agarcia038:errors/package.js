/*global Package*/
Package.describe({
    name: 'agarcia038:errors',
    version: '1.0.0',
    // Brief, one-line summary of the package.
    summary: 'A pattern to display application errors to the user',
    // URL to the Git repository containing the source code for this package.
    //git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    //documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.3');
    api.use(['minimongo', 'mongo-livedata', 'templating'], 'client');
    api.addFiles(['errors.js', 'errors_list.html', 'errors_list.js'], 'client');
    if (api.export)
        api.export('Errors');
});

//Package.onTest(function (api) {
//    api.use('tinytest');
//    api.use('agarcia038:errors');
//    api.addFiles('errors-tests.js');
//});

Package.onTest(function (api) {
    api.use('agarcia038:errors', 'client');
    api.use(['tinytest', 'test-helpers'], 'client');

    api.addFiles('errors-tests.js', 'client');
});