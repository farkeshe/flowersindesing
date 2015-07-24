(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define([], function() {
    var Usuario;
    return Usuario = (function() {
      function Usuario() {
        this.thisLogged = __bind(this.thisLogged, this);
      }

      Usuario.prototype.thisLogged = function(success) {
        return $.ajax({
          type: 'GET',
          url: "" + base_url + "/index.php/services/login",
          statusCode: {
            302: function() {
              return Singleton.get().reload();
            }
          },
          success: (function(_this) {
            return function(data) {
              return success(data);
            };
          })(this)
        });
      };

      return Usuario;

    })();
  });

}).call(this);
