(function() {
  var ArrayIterator, BlockStructure, CellTable, ConditionSet, DataTable, DependentFactorNode, ExpDesign, Factor, FactorNode, FactorSetNode, FactorSpec, ItemNode, ItemSetNode, Iterator, SamplerNode, TaskNode, TrialList, VarSpec, csv, sampler, trimWhiteSpace, utils, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  utils = require("./utils");

  DataTable = require("./datatable").DataTable;

  csv = require('../jslibs/jquery.csv.js');

  sampler = require("./samplers");

  exports.Factor = Factor = (function(_super) {
    __extends(Factor, _super);

    Factor.asFactor = function(arr) {
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Factor, arr, function(){});
    };

    function Factor(arr) {
      var arg, _i, _len;
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        arg = arr[_i];
        this.push(arg);
      }
      this.levels = _.uniq(arr).sort();
    }

    return Factor;

  })(Array);

  exports.VarSpec = VarSpec = (function() {
    function VarSpec() {}

    VarSpec.name = "";

    VarSpec.nblocks = 1;

    VarSpec.reps = 1;

    VarSpec.expanded = {};

    VarSpec.prototype.names = function() {
      return this.name;
    };

    VarSpec.prototype.ntrials = function() {
      return this.nblocks * this.reps;
    };

    VarSpec.prototype.valueAt = function(block, trial) {};

    return VarSpec;

  })();

  exports.FactorSpec = FactorSpec = (function(_super) {
    __extends(FactorSpec, _super);

    function FactorSpec(name, levels) {
      this.name = name;
      this.levels = levels;
      this.factorSet = {};
      this.factorSet[this.name] = this.levels;
      this.conditionTable = DataTable.expand(this.factorSet);
    }

    FactorSpec.prototype.cross = function(other) {
      return new CrossedFactorSpec(this.nblocks, this.reps, [this, other]);
    };

    FactorSpec.prototype.expand = function(nblocks, reps) {
      var blocks, concatBlocks, i, prop, vset, _i, _results;
      prop = {};
      prop[this.name] = this.levels;
      vset = new DataTable(prop);
      blocks = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; 1 <= nblocks ? _i <= nblocks : _i >= nblocks; i = 1 <= nblocks ? ++_i : --_i) {
          _results.push(vset.replicate(reps));
        }
        return _results;
      })();
      concatBlocks = _.reduce(blocks, function(sum, nex) {
        return DataTable.rbind(sum, nex);
      });
      concatBlocks.bindcol("$Block", utils.rep((function() {
        _results = [];
        for (var _i = 1; 1 <= nblocks ? _i <= nblocks : _i >= nblocks; 1 <= nblocks ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this), utils.rep(reps * vset.nrow(), nblocks)));
      return concatBlocks;
    };

    return FactorSpec;

  })(exports.VarSpec);

  exports.CellTable = CellTable = (function(_super) {
    __extends(CellTable, _super);

    function CellTable(parents) {
      var fac;
      this.parents = parents;
      console.log("building cell table parents", this.parents);
      this.parentNames = (function() {
        var _i, _len, _ref, _results;
        _ref = this.parents;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          fac = _ref[_i];
          _results.push(fac.name);
        }
        return _results;
      }).call(this);
      this.name = _.reduce(this.parentNames, function(n, n1) {
        return n + ":" + n1;
      });
      this.levels = (function() {
        var _i, _len, _ref, _results;
        _ref = this.parents;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          fac = _ref[_i];
          _results.push(fac.levels);
        }
        return _results;
      }).call(this);
      this.factorSet = _.zipObject(this.parentNames, this.levels);
      console.log("expanding table", this.factorSet);
      this.table = DataTable.expand(this.factorSet);
    }

    CellTable.prototype.names = function() {
      return this.parentNames;
    };

    CellTable.prototype.cells = function() {
      return this.table.toRecordArray();
    };

    CellTable.prototype.conditions = function() {
      var i, rec, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.table.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        rec = this.table.record(i);
        _results.push(_.reduce(rec, function(n, n1) {
          return n + ":" + n1;
        }));
      }
      return _results;
    };

    CellTable.prototype.expand = function(nblocks, reps) {
      var blocks, i;
      return blocks = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; 1 <= nblocks ? _i <= nblocks : _i >= nblocks; i = 1 <= nblocks ? ++_i : --_i) {
          _results.push(this.table.replicate(reps));
        }
        return _results;
      }).call(this);
    };

    return CellTable;

  })(exports.VarSpec);

  exports.BlockStructure = BlockStructure = (function() {
    function BlockStructure(nblocks, trialsPerBlock) {
      this.nblocks = nblocks;
      this.trialsPerBlock = trialsPerBlock;
    }

    return BlockStructure;

  })();

  exports.TaskNode = TaskNode = (function() {
    function TaskNode(varNodes, crossedSet) {
      var i, vname, _i, _j, _k, _len, _len1, _ref, _ref1, _ref2;
      this.varNodes = varNodes;
      this.crossedSet = crossedSet != null ? crossedSet : [];
      this.factorNames = _.map(this.varNodes, function(x) {
        return x.name;
      });
      this.varmap = {};
      for (i = _i = 0, _ref = this.factorNames.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.varmap[this.factorNames[i]] = this.varSpecs[i];
      }
      if (this.crossedSet.length > 0) {
        _ref1 = this.crossedSet;
        for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
          vname = _ref1[_j];
          this.crossedVars = this.varmap[vname];
        }
        this.crossedSpec = new CrossedFactorSpec(this.crossedVars);
      } else {
        this.crossedVars = [];
        this.crossedSpec = {};
      }
      this.uncrossedVars = _.difference(this.factorNames, this.crossedSet);
      _ref2 = this.uncrossedVars;
      for (_k = 0, _len1 = _ref2.length; _k < _len1; _k++) {
        vname = _ref2[_k];
        this.uncrossedSpec = this.varmap[vname];
      }
      ({
        expand: function(nblocks, nreps) {
          var ctable;
          if (this.crossedVars.length > 0) {
            return ctable = this.crossedSpec.expand(nblocks, nreps);
          }
        }
      });
    }

    return TaskNode;

  })();

  FactorNode = FactorNode = (function() {
    FactorNode.build = function(name, spec) {
      if ((spec.levels == null) && _.isArray(spec)) {
        return new FactorNode(name, spec);
      } else {
        return new FactorNode(name, spec.levels);
      }
    };

    function FactorNode(name, levels) {
      this.name = name;
      this.levels = levels;
      this.cellTable = new CellTable([this]);
    }

    FactorNode.prototype.choose = function() {
      return utils.oneOf(this.levels);
    };

    FactorNode.prototype.chooseK = function(k) {
      return utils.permute(this.levels, k);
    };

    FactorNode.prototype.chooseDependent = function(recArray) {
      return this.chooseK(recArray.length);
    };

    FactorNode.prototype.expand = function(nblocks, nreps) {
      return this.cellTable.expand(nblocks, nreps);
    };

    return FactorNode;

  })();

  exports.FactorNode = FactorNode;

  DependentFactorNode = DependentFactorNode = (function() {
    DependentFactorNode.build = function(name, spec) {
      return new DependentFactorNode(name, spec.levels, spec.choose);
    };

    function DependentFactorNode(name, levels, chooseFun) {
      this.name = name;
      this.levels = levels;
      this.chooseFun = chooseFun;
      this.cellTable = new CellTable([this]);
    }

    DependentFactorNode.prototype.choose = function(record) {
      return this.chooseFun(record);
    };

    DependentFactorNode.prototype.chooseDependent = function(recArray) {
      return _.map(recArray, (function(_this) {
        return function(rec) {
          return _this.choose(rec);
        };
      })(this));
    };

    DependentFactorNode.prototype.expand = function(nblocks, nreps) {
      return this.cellTable.expand(nblocks, nreps);
    };

    return DependentFactorNode;

  })();

  exports.DependentFactorNode = DependentFactorNode;

  exports.FactorSetNode = FactorSetNode = (function() {
    FactorSetNode.build = function(spec) {
      var fnodes, key, value;
      console.log("building", spec);
      fnodes = (function() {
        var _results;
        _results = [];
        for (key in spec) {
          value = spec[key];
          console.log("key is", key);
          console.log("value is", value);
          _results.push(exports.FactorNode.build(key, value));
        }
        return _results;
      })();
      console.log("fnodes", fnodes);
      return new FactorSetNode(fnodes);
    };

    function FactorSetNode(factors) {
      var i, _i, _ref;
      this.factors = factors;
      this.factorNames = _.map(this.factors, function(x) {
        return x.name;
      });
      this.varmap = {};
      for (i = _i = 0, _ref = this.factorNames.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.varmap[this.factorNames[i]] = this.factors[i];
      }
      console.log("constructing cell table of", this.factors);
      this.cellTable = new CellTable(this.factors);
      this.name = this.cellTable.name;
    }

    FactorSetNode.prototype.levels = function() {
      return this.cellTable.levels;
    };

    FactorSetNode.prototype.conditions = function() {
      return this.cellTable.conditions();
    };

    FactorSetNode.prototype.cells = function() {
      return this.cellTable.cells();
    };

    FactorSetNode.prototype.expand = function(nblocks, nreps) {
      return this.cellTable.expand(nblocks, nreps);
    };

    FactorSetNode.prototype.trialList = function(nblocks, nreps) {
      var blk, blocks, i, j, tlist, _i, _j, _len, _ref;
      if (nblocks == null) {
        nblocks = 1;
      }
      if (nreps == null) {
        nreps = 1;
      }
      blocks = this.expand(nblocks, nreps);
      tlist = new TrialList(nblocks);
      for (i = _i = 0, _len = blocks.length; _i < _len; i = ++_i) {
        blk = blocks[i];
        for (j = _j = 0, _ref = blk.nrow(); 0 <= _ref ? _j < _ref : _j > _ref; j = 0 <= _ref ? ++_j : --_j) {
          tlist.add(i, blk.record(j));
        }
      }
      return tlist;
    };

    return FactorSetNode;

  })();

  exports.Iterator = Iterator = (function() {
    function Iterator() {}

    Iterator.prototype.hasNext = function() {
      return false;
    };

    Iterator.prototype.next = function() {
      throw "empty iterator";
    };

    Iterator.prototype.map = function(fun) {
      throw "empty iterator";
    };

    return Iterator;

  })();

  exports.ArrayIterator = ArrayIterator = (function(_super) {
    __extends(ArrayIterator, _super);

    function ArrayIterator(arr) {
      this.arr = arr;
      this.cursor = 0;
      ({
        hasNext: function() {
          return this.cursor < this.arr.length;
        },
        next: function() {
          var ret;
          ret = this.arr[this.cursor];
          this.cursor = this.cursor + 1;
          return ret;
        },
        map: function(f) {
          return _.map(this.arr, function(el) {
            return f(el);
          });
        }
      });
    }

    return ArrayIterator;

  })(Iterator);

  TrialList = (function() {
    TrialList.fromBlockArray = function(blocks) {
      var i, rec, tlist, _i, _j, _len, _ref, _ref1;
      tlist = new TrialList(blocks.length);
      for (i = _i = 0, _ref = blocks.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _ref1 = blocks[i].toRecordArray();
        for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
          rec = _ref1[_j];
          tlist.add(i, rec);
        }
      }
      return tlist;
    };

    function TrialList(nblocks) {
      var i, _i;
      this.blocks = [];
      for (i = _i = 0; 0 <= nblocks ? _i < nblocks : _i > nblocks; i = 0 <= nblocks ? ++_i : --_i) {
        this.blocks.push([]);
      }
    }

    TrialList.prototype.add = function(block, trial) {
      var blen;
      if (block >= this.blocks.length) {
        blen = this.blocks.length;
        throw new Error("block index " + block + " exceeds number of blocks in TrialList " + blen);
      }
      return this.blocks[block].push(trial);
    };

    TrialList.prototype.get = function(block, trialNum) {
      return this.blocks[block][trialNum];
    };

    TrialList.prototype.getBlock = function(block) {
      return this.blocks[block];
    };

    TrialList.prototype.nblocks = function() {
      return this.blocks.length;
    };

    TrialList.prototype.ntrials = function() {
      var nt;
      nt = _.map(this.blocks, function(b) {
        return b.length;
      });
      return _.reduce(nt, function(x0, x1) {
        return x0 + x1;
      });
    };

    TrialList.prototype.shuffle = function() {
      return this.blocks = _.map(this.blocks, function(blk) {
        return _.shuffle(blk);
      });
    };

    TrialList.prototype.bind = function(fun) {
      var blk, i, out, ret, trial, _i, _j, _len, _len1, _ref;
      out = new TrialList(this.blocks.length);
      _ref = this.blocks;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        blk = _ref[i];
        for (_j = 0, _len1 = blk.length; _j < _len1; _j++) {
          trial = blk[_j];
          ret = fun(trial);
          out.add(i, _.assign(trial, ret));
        }
      }
      return out;
    };

    TrialList.prototype.blockIterator = function() {
      return new ArrayIterator(_.map(this.blocks, function(blk) {
        return new ArrayIterator(blk);
      }));
    };

    return TrialList;

  })();

  exports.TrialList = TrialList;

  trimWhiteSpace = function(records) {
    var i, key, out, record, trimmed, value, _i, _ref;
    trimmed = [];
    for (i = _i = 0, _ref = records.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      record = records[i];
      out = {};
      for (key in record) {
        value = record[key];
        out[key.trim()] = value.trim();
      }
      trimmed.push(out);
    }
    return trimmed;
  };

  exports.ItemNode = ItemNode = (function() {
    ItemNode.build = function(name, spec) {
      var attrs, dtable, inode, items, snode;
      if (spec.type == null) {
        spec.type = "text";
      }
      snode = spec.sampler != null ? SamplerNode.build(spec.sampler) : new SamplerNode("default", {});
      if (spec.data != null) {
        dtable = DataTable.fromRecords(spec.data);
        attrs = dtable.dropColumn(name);
        items = dtable[name];
        return new ItemNode(name, items, attrs, spec.type, snode.makeSampler(items));
      } else if (spec.csv != null) {
        inode = null;
        $.ajax({
          url: spec.csv.url,
          dataType: "text",
          async: false,
          success: (function(_this) {
            return function(data) {
              var records;
              records = trimWhiteSpace(csv.toObjects(data));
              dtable = DataTable.fromRecords(records);
              items = dtable[name];
              attrs = dtable.dropColumn(name);
              return inode = new ItemNode(name, items, attrs, spec.type, snode.makeSampler(items));
            };
          })(this),
          error: function(x) {
            return console.log(x);
          }
        });
        return inode;
      }
    };

    function ItemNode(name, items, attributes, type, sampler) {
      this.name = name;
      this.items = items;
      this.attributes = attributes;
      this.type = type;
      this.sampler = sampler;
      if (this.items.length !== this.attributes.nrow()) {
        throw "Number of items must equal number of attributes";
      }
    }

    ItemNode.prototype.sample = function(n) {
      return this.sampler.take(n);
    };

    return ItemNode;

  })();

  exports.ItemSetNode = ItemSetNode = (function() {
    ItemSetNode.build = function(spec) {
      var key, nodes, value;
      nodes = (function() {
        var _results;
        _results = [];
        for (key in spec) {
          value = spec[key];
          _results.push(exports.ItemNode.build(key, value));
        }
        return _results;
      })();
      return new ItemSetNode(nodes);
    };

    function ItemSetNode(itemNodes) {
      this.itemNodes = itemNodes;
      this.names = _.map(this.itemNodes, function(n) {
        return n.name;
      });
    }

    ItemSetNode.prototype.sample = function(n) {
      var i, items, j, name, out, record, _i, _j, _len, _ref;
      items = _.map(this.itemNodes, function(node) {
        return node.sample(n);
      });
      out = [];
      for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
        record = {};
        _ref = this.names;
        for (j = _j = 0, _len = _ref.length; _j < _len; j = ++_j) {
          name = _ref[j];
          record[name] = items[j][i];
        }
        out.push(record);
      }
      return out;
    };

    return ItemSetNode;

  })();

  SamplerNode = SamplerNode = (function() {
    SamplerNode.build = function(spec) {
      if (spec.type == null) {
        spec.type = "default";
      }
      return new SamplerNode(spec.type, spec);
    };

    function SamplerNode(type, params) {
      this.makeSampler = (function() {
        switch (type) {
          case "default":
            return function(items) {
              return new sampler.Sampler(items, params);
            };
          case "exhaustive":
            return function(items) {
              return new sampler.ExhaustiveSampler(items, params);
            };
          case "replacement":
            return function(items) {
              return new sampler.ReplacementSampler(items, params);
            };
          default:
            throw new Error("unrecognized sampler type", type);
        }
      })();
    }

    return SamplerNode;

  })();

  exports.SamplerNode = SamplerNode;

  exports.ConditionSet = ConditionSet = (function() {
    ConditionSet.build = function(spec) {
      var key, value, _crossed, _uncrossed;
      if ((spec.Crossed == null) && !spec.Uncrossed) {
        _crossed = exports.FactorSetNode.build(spec.Crossed);
        _uncrossed = {};
      } else {
        _crossed = exports.FactorSetNode.build(spec.Crossed);
        _uncrossed = (function() {
          var _ref, _results;
          _ref = spec.Uncrossed;
          _results = [];
          for (key in _ref) {
            value = _ref[key];
            _results.push(DependentFactorNode.build(key, value));
          }
          return _results;
        })();
      }
      return new ConditionSet(_crossed, _uncrossed);
    };

    function ConditionSet(crossed, uncrossed) {
      this.crossed = crossed;
      this.uncrossed = uncrossed;
      this.factorNames = [].concat(this.crossed.factorNames).concat(_.map(this.uncrossed, (function(_this) {
        return function(fac) {
          return fac.name;
        };
      })(this)));
      this.factorArray = _.clone(this.crossed.factors);
      _.forEach(this.uncrossed, (function(_this) {
        return function(fac) {
          return _this.factorArray.push(fac);
        };
      })(this));
      this.factorSet = _.zipObject(this.factorNames, this.factorArray);
    }

    ConditionSet.prototype.expand = function(nblocks, nreps) {
      var blk, cellTab, i, _i, _j, _len, _ref;
      cellTab = this.crossed.expand(nblocks, nreps);
      for (_i = 0, _len = cellTab.length; _i < _len; _i++) {
        blk = cellTab[_i];
        for (i = _j = 0, _ref = this.uncrossed.length; 0 <= _ref ? _j < _ref : _j > _ref; i = 0 <= _ref ? ++_j : --_j) {
          blk.bindcol(this.uncrossed[i].name, this.uncrossed[i].chooseDependent(blk.toRecordArray()));
        }
      }
      return TrialList.fromBlockArray(cellTab);
    };

    return ConditionSet;

  })();

  exports.ExpDesign = ExpDesign = (function() {
    ExpDesign.blocks = 1;

    ExpDesign.validate = function(spec) {
      var des;
      if (!("Design" in spec)) {
        throw "Design is undefined";
      }
      des = spec["Design"];
      if (!("Variables" in des)) {
        throw "Variables is undefined";
      }
      if (!("Structure" in des)) {
        throw "Structure is undefined";
      }
      if (!("Items" in spec)) {
        throw "Items is undefined";
      }
    };

    ExpDesign.splitCrossedItems = function(itemSpec, crossedVariables) {
      var attrnames, conditionTable, i, indices, itemSets, j, keySet, levs, record, values;
      attrnames = crossedVariables.colnames();
      keySet = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = crossedVariables.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          record = crossedVariables.record(i);
          levs = _.values(record);
          _results.push(_.reduce(levs, (function(a, b) {
            return a + ":" + b;
          })));
        }
        return _results;
      })();
      values = itemSpec["values"];
      conditionTable = new DataTable(_.pick(itemSpec, attrnames));
      itemSets = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = crossedVariables.nrow(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          record = crossedVariables.record(i);
          indices = conditionTable.whichRow(record);
          _results.push((function() {
            var _j, _len, _results1;
            _results1 = [];
            for (_j = 0, _len = indices.length; _j < _len; _j++) {
              j = indices[_j];
              _results1.push(values[j]);
            }
            return _results1;
          })());
        }
        return _results;
      })();
      return _.zipObject(keySet, itemSets);
    };

    ExpDesign.prototype.init = function(spec) {
      this.design = spec["Design"];
      this.variables = this.design["Variables"];
      this.itemSpec = spec["Items"];
      this.structure = this.design["Structure"];
      this.factorNames = _.keys(this.variables);
      this.crossed = this.variables["Crossed"];
      return this.auxiliary = this.variables["Auxiliary"];
    };

    ExpDesign.prototype.initStructure = function() {
      if (this.structure["type"] === "Block") {
        if (!_.has(this.structure, "reps_per_block")) {
          this.structure["reps_per_block"] = 1;
        }
        this.reps_per_block = this.structure["reps_per_block"];
        return this.blocks = this.structure["blocks"];
      } else {
        this.reps_per_block = 1;
        return this.blocks = 1;
      }
    };

    ExpDesign.prototype.makeConditionalSampler = function(crossedSpec, crossedItems) {
      var crossedItemMap, crossedItemName, key;
      crossedItemName = _.keys(crossedItems)[0];
      console.log("names:", crossedSpec.names());
      crossedItemMap = (function() {
        var _i, _len, _ref, _results;
        _ref = crossedSpec.names();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          _results.push(crossedItems[crossedItemName][key]);
        }
        return _results;
      })();
      crossedItemMap = _.zipObject(_.keys(this.crossed), crossedItemMap);
      console.log("item map: ", crossedItemMap);
      return new ConditionalSampler(crossedItems[crossedItemName].values, new DataTable(crossedItemMap), crossedSpec);
    };

    ExpDesign.prototype.makeCrossedSpec = function(crossed, nblocks, nreps) {
      var factors, key, val;
      factors = (function() {
        var _results;
        _results = [];
        for (key in crossed) {
          val = crossed[key];
          _results.push(new FactorSpec(nblocks, nreps, key, val.levels));
        }
        return _results;
      })();
      return crossed = new CrossedFactorSpec(nblocks, nreps, factors);
    };

    ExpDesign.prototype.makeFactorSpec = function(fac, nblocks, nreps) {
      return new FactorSpec(nblocks, nreps, _.keys(fac)[0], _.values(fac)[0]);
    };

    function ExpDesign(spec) {
      var crossedItems, crossedSampler;
      if (spec == null) {
        spec = {};
      }
      ExpDesign.validate(spec);
      this.init(spec);
      this.initStructure();
      this.crossedSpec = this.makeCrossedSpec(this.crossed, this.blocks, this.reps_per_block);
      crossedItems = this.itemSpec.Crossed;
      crossedSampler = this.makeConditionalSampler(this.crossedSpec, crossedItems);
      this.fullDesign = this.crossedSpec.expanded.bindcol(_.keys(crossedItems)[0], crossedSampler.take(this.crossedSpec.expanded.nrow()));
      console.log(this.crossedDesign);
    }

    return ExpDesign;

  })();

}).call(this);
