/* commonjs package manager support */
if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports) {
    module.exports = 'svg-icons';
}

(function (window, angular) {

    angular.module('svg-icons', [])

        .provider('svgIconProvider', function svgIconProvider() {
            let defaults = {
                baseClass: 'icon'
            };

            let options;

            function setOpts(obj) {
                options = angular.extend(defaults, obj);
            }

            function getOpts() {
                return (angular.isObject(options) ? options : defaults);
            }

            angular.extend(this, {
                setOpts,
                getOpts,
                $get: () => this
            });
        })

        .service('svgIconService', function svgIconService() {
            var icons = __REPLACE__;

            return {
                getIcon: function(iconName) {
                    return icons[iconName];
                }
            }
        })

        .directive('icon', ['$compile', 'svgIconProvider', 'svgIconService', function icon($compile, svgIconProvider, svgIconService) {

            const opts = svgIconProvider.getOpts();

            return {
                restrict: 'E',
                compile: compileFn
            };

            function compileFn() {
                return function(scope, iElem, iAttrs) {

                    var icon = angular.element(svgIconService.getIcon(iAttrs.icon));

                    let cssClasses = [opts.baseClass, opts.baseClass + '-' + iAttrs.icon];
                    if(iAttrs.class) {
                        cssClasses.push(iAttrs.class)
                    }

                    icon.addClass(cssClasses.join(' '));

                    let e = $compile(icon)(scope);
                    iElem.replaceWith(e);
                };
            }

        }]);

})(window, window.angular);
