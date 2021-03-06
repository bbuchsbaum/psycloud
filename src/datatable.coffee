_ = require('lodash')
utils = require("./utils")
csv = require('../jslibs/jquery.csv.js')

## replace with papa parse, looks more robust
loadTable = (url, separator=",") ->
  data = $.ajax({
    url: url
    dataType: "text"
    async: false
  }).responseText

  records = csv.toObjects(data, {separator: separator})
  DataTable.fromRecords(records)

# Class representing a tabular data set consisting of a set of fixed-length columnar variables
#
# @example How to create a DataTable
#   dt = new DataFrame({v1: [1,2,3], v2: ["a", "b", "c"])
#
class DataTable

  # @param {Object} vars a named set of column variables
  constructor: (vars = {}) ->
    varlen = _.map(vars, (x) ->
      x.length)
    samelen = _.all(varlen, (x) ->
      x == varlen[0])

    if not samelen
      throw "arguments to DataTable must all have same length."

    for key, value of vars
      this[key] = value

  # print the contents of the table record by record
  show: ->
    console.log("DataTable: rows: #{@nrow()} columns: #{@ncol()}")
    for i in [0...@nrow()]
      console.log(@record(i))

  # Create a DataTable from a set of records
  #
  # @param {Array} records the records used to construct the rows of the table
  # @param {Boolean} union take the union of all record keys
  @fromRecords: (records, union = true) ->
    if not _.isArray(records)
      throw new Error("DataTable.fromRecords: 'records' arguemnt must be an array of records.")
    allkeys = _.uniq(_.flatten(_.map(records, (rec) ->
      _.keys(rec))))

    vars = {}
    for key in allkeys
      vars[key] = []


    for rec in records
      for key in allkeys
        if rec[key]?
          vars[key].push(rec[key])
        else
          vars[key].push(null)
    new DataTable(vars)

  @build: (vars = {}) ->
    Object.seal(new DataTable(vars))


  @rbind: (others...) ->
    console.log("length of others", others.length)
    otab = others[0]
    for i in [1...others.length]
      console.log("rbinding ", i)
      otab = DataTable.rbind2(otab, others[i])
    otab

  # concatenate two tables by row
  # @param {DataTable} tab1 the first table
  # @param {DataTable} tab2 the second table
  # @param {Boolean} union if true take the union of all variables, other take intersection
  @rbind2: (tab1, tab2, union = false) ->
    keys1 = _.keys(tab1)
    keys2 = _.keys(tab2)
    sharedKeys =
      if union
        _.union(keys1, keys2)
      else
        _.intersection(keys1, keys2)


    out = {}
    for name in sharedKeys
      col1 = tab1[name]
      col2 = tab2[name]

      if not col1
        col1 = utils.repLen([null], tab1.nrow())
      if not col2
        col2 = utils.repLen([null], tab2.nrow())

      out[name] = col1.concat(col2)

    new DataTable(out)

  # concatenate two tables by column
  #
  # @param {DataTable} tab1 the first table
  # @param {DataTable} tab2 the second table
  # @note
  #   both arguments must have the same number of rows
  @cbind: (tab1, tab2) ->
    if (tab1.nrow() != tab2.nrow())
      throw "cbind requires arguments to have same number of rows"

    out = _.cloneDeep(tab1)
    diffkeys = _.difference(_.keys(tab2), _.keys(tab1))
    for key in diffkeys
      out[key] = tab2[key]

    out

  # create a table consisting of all combinations of the values in a set of variables
  # @param {Object} vars a set of variables indexed by key
  # @param {Boolean} unique ensure that all elements in any of the variables are distinct before expanding
  # @param {Integer} nreps if greater than 1 the table will be replicated *nreps* times
  @expand: (vars = {}, unique = true, nreps = 1) ->
    if unique
      out = {}
      for name, value of vars
        out[name] = _.unique(value)
      vars = out

    nargs = _.size(vars)
    nm = _.keys(vars)
    repfac = 1
    d = _.map(vars, (x) ->
      x.length)

    orep = _.reduce(d, (x, acc) ->
      x * acc)
    out = {}
    for key, value of vars
      nx = value.length
      orep = orep / nx
      r1 = utils.rep([repfac], nx)
      r2 = utils.rep([0...nx], r1)
      r3 = utils.rep(r2, orep)
      out[key] = (value[i] for i in r3)
      repfac = repfac * nx

    if (nreps > 1)
      for i in [1..nreps]
        out = _.merge(out,out)

    new DataTable(out)

  splitBy: (fac) ->
    if fac.length != this.nrow()
      throw new Error("splitBy: length 'fac' array must eqaul number of rows in data table")

    levs = _.uniq(fac).sort()
    indexArray = []

    for i in [0...this.nrow()]
      lev = fac[i]
      if indexArray[lev]?
        indexArray[lev].push(i)
      else
        indexArray[lev] = [i]


    out = []

    for lev, index in levs
      rset = for i in indexArray[lev]
        @record(i)
      out[lev] = DataTable.fromRecords(rset)

    out


  dropColumn: (colname) ->
    out = {}
    for own key, value of this
      if key != colname
        out[key] = _.clone(value)
    new DataTable(out)

  subset: (key, filter) ->
    keep = for val in this[key]
      if (filter(val)) then true else false
    out = {}

    for own name, value of this
      out[name] = (el for el, i in value when keep[i] == true)

    new DataTable(out)

  whichRow: (where) ->
    out = []
    nkeys = _.keys(where).length

    for i in [0...@nrow()]
      rec = @record(i)
      count = utils.asArray(rec[key] == value for key, value of where)
      count = _.map(count, (x) -> if x then 1 else 0)
      count = _.reduce(utils.asArray(count), (sum, num) ->
        sum + num)

      if count == nkeys
        out.push(i)

    out


  select: (where) ->
    out = []
    nkeys = _.keys(where).length

    for i in [0...@nrow()]
      rec = @record(i)
      count = utils.asArray(rec[key] == value for key, value of where)
      count = _.map(count, (x) -> if x then 1 else 0)
      count = _.reduce(utils.asArray(count), (sum, num) ->
        sum + num)

      if count == nkeys
        out.push(rec)

    out

  nrow: ->
    lens = (value.length for own name, value of this)
    if lens.length == 0
      0
    else
      _.max(lens)

  ncol: ->
    Object.keys(this).length

  colnames: ->
    Object.keys(this)

  rows: -> @toRecordArray()

  mapRows: (fun) ->
    for i in [0...@nrow()]
      fun(@record(i))

  toRecordArray: ->
    rec = []
    for i in [0...@nrow()]
      rec.push(@record(i))
    rec

  record: (index) ->
    rec = {}
    for own name, value of this
      rec[name] = value[index]
    rec

  replicate: (nreps) ->
    if nreps < 1
      throw new Error("DataTable.replicate: nreps must be greater than or equal to 1")
    #else if nreps == 1
    #  console.log("replicating once with extend")
    #  _.extend({}, this)
    else
      out = {}
      for own name, value of this
        out[name] = _.flatten(_.times(nreps, (n) =>
          value))
      new DataTable(out)

  bindcol: (name, column) ->
    if (column.length != @nrow())
      throw "new column must be same length as existing DataTable object: column.length is  #{column.length} and this.length is  #{@nrow()}"
    this[name] = column
    this

  bindrow: (rows) ->
    console.log("binding row", rows)
    console.log("nrow is", this.nrow())
    if (!_.isArray(rows))
      rows = [rows]
    if this.nrow() == 0
      ## if table is empty, take key names from first row
      console.log("table has no rows")
      for key in _.keys(rows[0])
        console.log("adding column name", key)
        this[key] = []

    for record in rows
      console.log(record)
      for own key, value of record
        if (not _.has(this, key))
          throw new Error("DataTable has no field named #{key}")
        else
          this[key].push(value)
    this

  shuffle: ->
    nr = @nrow()
    ind = [0...nr]
    sind = _.shuffle(ind)
    out = []
    for i in [0...nr]
      out[i] = @record(sind[i])
    DataTable.fromRecords(out)



exports.DataTable = DataTable
exports.loadTable = loadTable