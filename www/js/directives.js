angular.module('starter.directives', [])

    .directive('blink', function($timeout) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        controller: function($scope, $element) {
            $element.css("animation", "blinker 2s linear infinite");
        },
        template: '<span ng-transclude></span>',
        replace: true
    };
});