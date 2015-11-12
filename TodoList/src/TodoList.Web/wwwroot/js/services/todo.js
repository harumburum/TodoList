(function () {
    'use strict';

    angular
        .module('app')
        .factory('Todo', ['$resource', 'config', Todo]);

    function Todo(resource, config) {
        return resource(config.remoteResourceName, null,
        {
            'update': { method: 'PUT' }
        });
    }
})();