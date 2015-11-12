(function () {
    'use strict';

    var app = angular.module('app');

    var remoteResourceName = '/api/todo/:id';

    // Configure Toastr
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';

    var config = {
        remoteResourceName: remoteResourceName,
        version: '0.0.1'
    };

    app.value('config', config);

    app.config(['$logProvider', function ($logProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
    }]);

})();