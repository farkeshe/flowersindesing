(function() {
  require.config({
    paths: {
      'jquery': 'assets/js/lib/jquery-1.7.2.min',
      'ajaxfileupload': 'assets/js/lib/ajaxfileupload',
      'backbone': 'assets/js/lib/backbone-min',
      'underscore': 'assets/js/lib/underscore-min',
      'numeric': 'assets/js/lib/jquery.numeric.min',
      'text': 'assets/js/lib/text',
      'domReady': 'assets/js/lib/domReady',
      'order': 'assets/js/lib/order',
      'bootstrap': 'assets/js/lib/bootstrap/bootstrap.min',
      'crypto': 'assets/js/lib/crypto-sha256',
      'jcookies': 'assets/js/lib/jcookies.min',
      'ui': 'assets/js/lib/jquery-ui-1.10.2.custom.min',
      'tableSorter': 'assets/js/lib/tableSorter',
      'tooltips': 'assets/js/lib/bootstrap/tooltip',
      'tpl': 'assets/templates',
      'app': 'assets/js/app'
    }
  });

  require(['order!jquery', 'order!jcookies', 'order!underscore', 'order!domReady', 'order!bootstrap', 'order!ajaxfileupload', 'order!ui', 'order!tableSorter', 'order!tooltips', 'app'], function($, J, _, domReady, Bootstrap, Ajaxfileupload, UI, Tablesorter, Tooltips, App) {
    return domReady(function() {
      window._ = _.noConflict();
      window.jQuery = window.$ = $.noConflict();
      window.jCookies = $.jCookies;
      return new App();
    });
  });

}).call(this);
