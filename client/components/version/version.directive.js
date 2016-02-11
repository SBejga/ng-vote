/**
 * Created by basti on 11.02.16.
 */
angular.module('ngvoteApp')
  .directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('appName', ['appname', function(appname) {
    return function(scope, elm, attrs) {
      elm.text(appname);
    };
  }]);
