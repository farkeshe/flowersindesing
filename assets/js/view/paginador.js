(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define([], function() {
    var Paginador;
    return Paginador = (function() {
      function Paginador() {
        this.label = bind(this.label, this);
        this.previous = bind(this.previous, this);
        this.next = bind(this.next, this);
        this.setTotal = bind(this.setTotal, this);
        this.init = bind(this.init, this);
      }

      Paginador.prototype.init = function(start, range, total) {
        this.total = total;
        this.range = range;
        this.start = start;
        if (total < range) {
          return this.end = total;
        } else {
          return this.end = range;
        }
      };

      Paginador.prototype.setTotal = function(total) {
        this.total = total;
        if (total === 0) {
          this.start = 0;
          this.end = 0;
        }
        if (this.range <= total && this.end === 0) {
          return this.end = this.range;
        } else {
          if (this.end > total || this.end === 0) {
            this.end = total;
          }
          if (this.range >= total && (this.end - this.range) < this.start) {
            return this.end = total;
          }
        }
      };

      Paginador.prototype.next = function() {
        this.start += this.range;
        this.end += this.range;
        if (this.start >= this.total) {
          if (this.total === 0) {
            this.start = 0;
          } else {
            this.start -= this.range;
          }
        }
        if (this.end > this.total) {
          return this.end = this.total;
        }
      };

      Paginador.prototype.previous = function() {
        this.aux = this.end - this.start;
        this.start -= this.range;
        if (this.aux < this.range) {
          this.end -= this.aux;
        } else {
          this.end -= this.range;
        }
        if (this.start < 0) {
          this.start = 0;
        }
        if (this.end > 0) {
          if (this.end < this.range) {
            if (this.total === 0) {
              return this.end = 0;
            } else {
              return this.end = this.range;
            }
          }
        } else {
          if (this.total < this.range) {
            return this.end += this.total;
          } else {
            return this.end += this.range;
          }
        }
      };

      Paginador.prototype.label = function() {
        var aux;
        if ((this.start + 1) > this.total) {
          aux = this.total;
        } else {
          aux = this.start + 1;
        }
        if (this.total !== null) {
          return "<b>" + aux + " - " + this.end + "</b> de <b>" + this.total + "</b>";
        } else {
          return "<b>0 - 0</b> de <b>0</b>";
        }
      };

      return Paginador;

    })();
  });

}).call(this);
