!function(){"use strict";var e=angular.module("watchmenApp",["ngRoute","angularSpinner","ngTable","angularMoment","watchmenControllers","watchmenServices"]);e.config(["$routeProvider",function(e){e.when("/details/:host/:service",{templateUrl:"service-detail.html",controller:"ServiceDetailCtrl"}).otherwise({templateUrl:"service-list.html",controller:"ServiceListCtrl"})}])}();
!function(){"use strict";function e(e,t){var n={page:1,count:t||10,debugMode:!0};return window.localStorage&&window.localStorage.getItem(e)?JSON.parse(window.localStorage.getItem(e)):n}function t(t,n,r,a,o){return new n(e(t,o),{total:r[t].length,getData:function(e,n){var o=r[t];n.total(o.length);var i=n.sorting()?a("orderBy")(o,n.orderBy()):o,l=i.slice((n.page()-1)*n.count(),n.page()*n.count());e.resolve(l);var c={sorting:n.sorting(),count:n.count(),page:n.page()};window.localStorage&&window.localStorage.setItem(t,JSON.stringify(c))}})}var n,r=3e3,a=angular.module("watchmenControllers",[]);a.controller("ServiceListCtrl",["$scope","$filter","$timeout","Service","ngTableParams","usSpinnerService",function(e,a,o,i,l,c){var s={loading:function(){c.spin("spinner-1"),e.loading=!0},loaded:function(){c.stop("spinner-1"),e.loading=!1}},g="tableServicesData";s.loading(),e[g]=[],e.tableParams=t(g,l,e,a,25),function u(e,t){function a(){o.cancel(n),n=o(function(){u(e,t)},r)}function i(t){e.errorLoadingServices="Error loading data from remote server",console.error(t),a()}e.services=t.getAll(function(t){e.errorLoadingServices=null,e[g]=t,e.tableParams.reload(),e.servicesDown=t.filter(function(e){return e.data&&"error"===e.data.status}).length,s.loaded(),a()},i)}(e,i)}]),a.controller("ServiceDetailCtrl",["$scope","$filter","$routeParams","Service","ngTableParams","usSpinnerService",function(e,n,r,a,o,i){i.spin("spinner-1"),e.loading=!0,e.serviceDetails=a.getDetails({serviceId:r.host+","+r.service},function(r){i.stop("spinner-1"),e.loading=!1,e.tableCriticalLogsData=r.critical_events,e.tableWarningLogsData=r.warning_events,e.tableCriticalLogs=t("tableCriticalLogsData",o,e,n,10),e.tableWarningLogs=t("tableWarningLogsData",o,e,n,10)})}])}();
!function(){"use strict";var e=1e4,r="services-cache",t=angular.module("watchmenServices",["ngResource"]);t.factory("Service",["$resource","$cacheFactory",function(t,c){var a=c("watchmen-Services");return{getAll:function(c){var i=a.get(r);if(i){if(!(i.expiration<+new Date))return c(i.data);i=null}return i||(i=t("services",{},{query:{method:"GET",isArray:!0}}).query(c),a.put(r,{data:i,expiration:+new Date+e})),i},getDetails:function(e,r){return t("services?host=:host&service=:service",{},{query:{method:"GET",isArray:!0,cache:c.get("$http")}}).get(e,r)}}}])}();