(function() {
  var DataTable, csv, loadTable, utils, _,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty;

  _ = require('lodash');

  utils = require("./utils");

  csv = require('../jslibs/jquery.csv.js');

  loadTable = function(url) {
    var data, records;
    data = $.ajax({
      url: url,
      dataType: "text",
      async: false
    }).responseText;
    records = csv.toObjects(data);
    return DataTable.fromRecords(records);
  };

  DataTable = (function() {
    function DataTable(vars) {
      var key, samelen, value, varlen;
      if (vars == null) {
        vars = {};
      }
      varlen = _.map(vars, function(x) {
        return x.length;
      });
      samelen = _.all(varlen, function(x) {
        return x === varlen[0];
      });
      if (!samelen) {
        throw "arguments to DataTable must all have same length.";
      }
      for (key in vars) {
        value = vars[key];
        this[key] = value;
      }
    }

    DataTable.prototype.show = function() {
      var i, _i, _ref, _results;
      console.log("DataTable: rows: " + (this.nrow()) + " columns: " + (this.ncol()));
      _results = [];
      for (i = _i = 0, _ref = this.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(console.log(this.record(i)));
      }
      return _results;
    };

    DataTable.fromRecords = function(records, union) {
      var allkeys, key, rec, vars, _i, _j, _k, _len, _len1, _len2;
      if (union == null) {
        union = true;
      }
      if (!_.isArray(records)) {
        throw new Error("DataTable.fromRecords: 'records' arguemnt must be an array of records.");
      }
      allkeys = _.uniq(_.flatten(_.map(records, function(rec) {
        return _.keys(rec);
      })));
      vars = {};
      for (_i = 0, _len = allkeys.length; _i < _len; _i++) {
        key = allkeys[_i];
        vars[key] = [];
      }
      for (_j = 0, _len1 = records.length; _j < _len1; _j++) {
        rec = records[_j];
        for (_k = 0, _len2 = allkeys.length; _k < _len2; _k++) {
          key = allkeys[_k];
          if (rec[key] != null) {
            vars[key].push(rec[key]);
          } else {
            vars[key].push(null);
          }
        }
      }
      return new DataTable(vars);
    };

    DataTable.build = function(vars) {
      if (vars == null) {
        vars = {};
      }
      return Object.seal(new DataTable(vars));
    };

    DataTable.rbind = function() {
      var i, otab, others, _i, _ref;
      others = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      console.log("length of others", others.length);
      otab = others[0];
      for (i = _i = 1, _ref = others.length; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
        console.log("rbinding ", i);
        otab = DataTable.rbind2(otab, others[i]);
      }
      return otab;
    };

    DataTable.rbind2 = function(tab1, tab2, union) {
      var col1, col2, keys1, keys2, name, out, sharedKeys, _i, _len;
      if (union == null) {
        union = false;
      }
      keys1 = _.keys(tab1);
      keys2 = _.keys(tab2);
      sharedKeys = union ? _.union(keys1, keys2) : _.intersection(keys1, keys2);
      out = {};
      for (_i = 0, _len = sharedKeys.length; _i < _len; _i++) {
        name = sharedKeys[_i];
        col1 = tab1[name];
        col2 = tab2[name];
        if (!col1) {
          col1 = utils.repLen([null], tab1.nrow());
        }
        if (!col2) {
          col2 = utils.repLen([null], tab2.nrow());
        }
        out[name] = col1.concat(col2);
      }
      return new DataTable(out);
    };

    DataTable.cbind = function(tab1, tab2) {
      var diffkeys, key, out, _i, _len;
      if (tab1.nrow() !== tab2.nrow()) {
        throw "cbind requires arguments to have same number of rows";
      }
      out = _.cloneDeep(tab1);
      diffkeys = _.difference(_.keys(tab2), _.keys(tab1));
      for (_i = 0, _len = diffkeys.length; _i < _len; _i++) {
        key = diffkeys[_i];
        out[key] = tab2[key];
      }
      return out;
    };

    DataTable.expand = function(vars, unique, nreps) {
      var d, i, key, name, nargs, nm, nx, orep, out, r1, r2, r3, repfac, value, _i, _j, _results;
      if (vars == null) {
        vars = {};
      }
      if (unique == null) {
        unique = true;
      }
      if (nreps == null) {
        nreps = 1;
      }
      if (unique) {
        out = {};
        for (name in vars) {
          value = vars[name];
          out[name] = _.unique(value);
        }
        vars = out;
      }
      nargs = _.size(vars);
      nm = _.keys(vars);
      repfac = 1;
      d = _.map(vars, function(x) {
        return x.length;
      });
      orep = _.reduce(d, function(x, acc) {
        return x * acc;
      });
      out = {};
      for (key in vars) {
        value = vars[key];
        nx = value.length;
        orep = orep / nx;
        r1 = utils.rep([repfac], nx);
        r2 = utils.rep((function() {
          _results = [];
          for (var _i = 0; 0 <= nx ? _i < nx : _i > nx; 0 <= nx ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this), r1);
        r3 = utils.rep(r2, orep);
        out[key] = (function() {
          var _j, _len, _results1;
          _results1 = [];
          for (_j = 0, _len = r3.length; _j < _len; _j++) {
            i = r3[_j];
            _results1.push(value[i]);
          }
          return _results1;
        })();
        repfac = repfac * nx;
      }
      if (nreps > 1) {
        for (i = _j = 1; 1 <= nreps ? _j <= nreps : _j >= nreps; i = 1 <= nreps ? ++_j : --_j) {
          out = _.merge(out, out);
        }
      }
      return new DataTable(out);
    };

    DataTable.prototype.splitBy = function(fac) {
      var i, index, indexArray, lev, levs, out, rset, _i, _j, _len, _ref;
      if (fac.length !== this.nrow()) {
        throw new Error("splitBy: length 'fac' array must eqaul number of rows in data table");
      }
      levs = _.uniq(fac).sort();
      indexArray = [];
      for (i = _i = 0, _ref = this.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        lev = fac[i];
        if (indexArray[lev] != null) {
          indexArray[lev].push(i);
        } else {
          indexArray[lev] = [i];
        }
      }
      out = [];
      for (index = _j = 0, _len = levs.length; _j < _len; index = ++_j) {
        lev = levs[index];
        rset = (function() {
          var _k, _len1, _ref1, _results;
          _ref1 = indexArray[lev];
          _results = [];
          for (_k = 0, _len1 = _ref1.length; _k < _len1; _k++) {
            i = _ref1[_k];
            _results.push(this.record(i));
          }
          return _results;
        }).call(this);
        out[lev] = DataTable.fromRecords(rset);
      }
      return out;
    };

    DataTable.prototype.dropColumn = function(colname) {
      var key, out, value;
      out = {};
      for (key in this) {
        if (!__hasProp.call(this, key)) continue;
        value = this[key];
        if (key !== colname) {
          out[key] = _.clone(value);
        }
      }
      return new DataTable(out);
    };

    DataTable.prototype.subset = function(key, filter) {
      var el, i, keep, name, out, val, value;
      keep = (function() {
        var _i, _len, _ref, _results;
        _ref = this[key];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          val = _ref[_i];
          if (filter(val)) {
            _results.push(true);
          } else {
            _results.push(false);
          }
        }
        return _results;
      }).call(this);
      out = {};
      for (name in this) {
        if (!__hasProp.call(this, name)) continue;
        value = this[name];
        out[name] = (function() {
          var _i, _len, _results;
          _results = [];
          for (i = _i = 0, _len = value.length; _i < _len; i = ++_i) {
            el = value[i];
            if (keep[i] === true) {
              _results.push(el);
            }
          }
          return _results;
        })();
      }
      return new DataTable(out);
    };

    DataTable.prototype.whichRow = function(where) {
      var count, i, key, nkeys, out, rec, value, _i, _ref;
      out = [];
      nkeys = _.keys(where).length;
      for (i = _i = 0, _ref = this.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        rec = this.record(i);
        count = utils.asArray((function() {
          var _results;
          _results = [];
          for (key in where) {
            value = where[key];
            _results.push(rec[key] === value);
          }
          return _results;
        })());
        count = _.map(count, function(x) {
          if (x) {
            return 1;
          } else {
            return 0;
          }
        });
        count = _.reduce(utils.asArray(count), function(sum, num) {
          return sum + num;
        });
        if (count === nkeys) {
          out.push(i);
        }
      }
      return out;
    };

    DataTable.prototype.select = function(where) {
      var count, i, key, nkeys, out, rec, value, _i, _ref;
      out = [];
      nkeys = _.keys(where).length;
      for (i = _i = 0, _ref = this.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        rec = this.record(i);
        count = utils.asArray((function() {
          var _results;
          _results = [];
          for (key in where) {
            value = where[key];
            _results.push(rec[key] === value);
          }
          return _results;
        })());
        count = _.map(count, function(x) {
          if (x) {
            return 1;
          } else {
            return 0;
          }
        });
        count = _.reduce(utils.asArray(count), function(sum, num) {
          return sum + num;
        });
        if (count === nkeys) {
          out.push(rec);
        }
      }
      return out;
    };

    DataTable.prototype.nrow = function() {
      var lens, name, value;
      lens = (function() {
        var _results;
        _results = [];
        for (name in this) {
          if (!__hasProp.call(this, name)) continue;
          value = this[name];
          _results.push(value.length);
        }
        return _results;
      }).call(this);
      if (lens.length === 0) {
        return 0;
      } else {
        return _.max(lens);
      }
    };

    DataTable.prototype.ncol = function() {
      return Object.keys(this).length;
    };

    DataTable.prototype.colnames = function() {
      return Object.keys(this);
    };

    DataTable.prototype.rows = function() {
      return this.toRecordArray();
    };

    DataTable.prototype.mapRows = function(fun) {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(fun(this.record(i)));
      }
      return _results;
    };

    DataTable.prototype.toRecordArray = function() {
      var i, rec, _i, _ref;
      rec = [];
      for (i = _i = 0, _ref = this.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        rec.push(this.record(i));
      }
      return rec;
    };

    DataTable.prototype.record = function(index) {
      var name, rec, value;
      rec = {};
      for (name in this) {
        if (!__hasProp.call(this, name)) continue;
        value = this[name];
        rec[name] = value[index];
      }
      return rec;
    };

    DataTable.prototype.replicate = function(nreps) {
      var name, out, value;
      if (nreps < 1) {
        throw new Error("DataTable.replicate: nreps must be greater than or equal to 1");
      } else {
        out = {};
        for (name in this) {
          if (!__hasProp.call(this, name)) continue;
          value = this[name];
          out[name] = _.flatten(_.times(nreps, (function(_this) {
            return function(n) {
              return value;
            };
          })(this)));
        }
        return new DataTable(out);
      }
    };

    DataTable.prototype.bindcol = function(name, column) {
      if (column.length !== this.nrow()) {
        throw "new column must be same length as existing DataTable object: column.length is  " + column.length + " and this.length is  " + (this.nrow());
      }
      this[name] = column;
      return this;
    };

    DataTable.prototype.bindrow = function(rows) {
      var key, record, value, _i, _j, _len, _len1, _ref;
      console.log("binding row", rows);
      console.log("nrow is", this.nrow());
      if (!_.isArray(rows)) {
        rows = [rows];
      }
      if (this.nrow() === 0) {
        console.log("table has no rows");
        _ref = _.keys(rows[0]);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          console.log("adding column name", key);
          this[key] = [];
        }
      }
      for (_j = 0, _len1 = rows.length; _j < _len1; _j++) {
        record = rows[_j];
        console.log(record);
        for (key in record) {
          if (!__hasProp.call(record, key)) continue;
          value = record[key];
          if (!_.has(this, key)) {
            throw new Error("DataTable has no field named " + key);
          } else {
            this[key].push(value);
          }
        }
      }
      return this;
    };

    DataTable.prototype.shuffle = function() {
      var i, ind, nr, out, sind, _i, _j, _results;
      nr = this.nrow();
      ind = (function() {
        _results = [];
        for (var _i = 0; 0 <= nr ? _i < nr : _i > nr; 0 <= nr ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this);
      sind = _.shuffle(ind);
      out = [];
      for (i = _j = 0; 0 <= nr ? _j < nr : _j > nr; i = 0 <= nr ? ++_j : --_j) {
        out[i] = this.record(sind[i]);
      }
      return DataTable.fromRecords(out);
    };

    return DataTable;

  })();

  exports.DataTable = DataTable;

  exports.loadTable = loadTable;

}).call(this);
