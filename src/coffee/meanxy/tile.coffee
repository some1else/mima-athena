window.MM ||= {}
MM.MeanXY ||= {}

class MM.MeanXY.TileView extends Backbone.View
  events:
    "click a": "query"

  render: ->
    $(@el).html @template(@model.attributes)
    this

class MM.MeanXY.TileLabelView extends MM.MeanXY.TileView
  template: _.template( "<li class='tile tile_x_<%= x %> tile_y_<%= y %> " +
                        "tile_<%= kind %> tile_<%= kind %>_<%= shade %>'>" +
                        "<a href='#'><span><%= content %>" +
                        "</span><em><%= Math.round(weight * 10) / 10 %></em></a></li>" )
  query: (e) ->
    doQuery @model
    e.preventDefault()

  initialize: ->
    _.bindAll this, "render"
    # Tiles.bind "change", @render

class MM.MeanXY.TileQueryView extends MM.MeanXY.TileView
  template: _.template( "<li class='tile tile_x_<%= x %> tile_y_<%= y %> " +
                        "query_<%= kind %>'><a href='#'><span>" +
                        "<%= content %></span></a></li>" )
  query: (e) ->
    doTypeQuery @model
    e.preventDefault()

class MM.MeanXY.TileKnotView extends MM.MeanXY.TileView
  template: _.template( "<li class='tile tile_x_<%= x %> tile_y_<%= y %> " +
                        "query_<%= kind %>'><a href='#'><span>" +
                        "<%= content %></span></a></li>" )
  query: (e) ->
    doKnotQuery()
    e.preventDefault()

class MM.MeanXY.TileCollectionView extends Backbone.View
  el: "#app"
  grid: []
  initialize: ->
    _.bindAll this, "addOne", "addAll"
    Tiles.bind "add", @addOne, this
    Tiles.bind "reset", @reset, this
    @grid = []

  addOne: (tile) ->
    view = undefined
    if tile.get("query") is true
      if tile.get("kind").toUpperCase() is "KNOT"
        view = new MM.MeanXY.TileKnotView(model: tile)
      else
        view = new MM.MeanXY.TileQueryView(model: tile)
    else
      view = new MM.MeanXY.TileLabelView(model: tile)
    @$("#tiles").append view.render().el

  addTiles: ->
    Tiles.each @addOne

  applyShade: ->
    max = 0
    min = 9007199254740992
    Tiles.each (tile) ->
      tw = tile.get("weight")
      if _.isString(tw)
        tw = parseFloat(tw)
        min = tw  if tw < min
        max = tw  if tw > max

    delta = max - min
    Tiles.each (tile) ->
      tw = tile.get("weight")
      if _.isString(tw)
        tw = parseFloat(tw)
        dif = tw - min
        val = (dif) / (delta / 5)
        val = Math.abs(5 - Math.round(val))
        tile.set
          shade: val
        ,
          silent: true

  drawGrid: ->
    @grid = []
    col = 0

    while col < columns
      @grid[col] = []
      row = 0

      while row < rows
        if _.detect(Tiles.models, (m) ->
          (m.get("x") is col) and (m.get("y") is row)
        )
          @grid[col][row] = true
        else
          @grid[col][row] = false
        row++
      col++

  spiralWalk: (pos) ->
    if pos.x < (columns - 1) / 2
      di = 1
    else
      di = -1
    dj = 0
    segment_length = 1
    i = 0
    j = 0
    segment_passed = 0
    all_tiles = _.reject(Tiles.models, (t) ->
      (t.get("query") is true) or (t.get("prompt") is true)
    )
    positioned_count = 0
    bounds =
      x:
        min: 0
        max: columns - 1

      y:
        min: 0
        max: rows - 1

    k = 0

    while (k < (columns * 8 * rows * 8)) and (positioned_count < all_tiles.length)
      p =
        x: i + pos.x
        y: j + pos.y

      if (p.x >= bounds.x.min) and (p.x <= bounds.x.max) and (p.y >= bounds.y.min) and (p.y <= bounds.y.max)
        if @grid[p.x][p.y] is false
          all_tiles[positioned_count].set
            x: p.x
            y: p.y
          ,
            silent: true

          @grid[p.x][p.y] = true
          positioned_count++
      i += di
      j += dj
      ++segment_passed
      if segment_passed is segment_length
        segment_passed = 0
        if (pos.x < (columns - 1) / 2) and (pos.y > (rows - 1) / 2) or (pos.x > (columns - 1) / 2) and (pos.y < (rows - 1) / 2)
          buffer = dj
          dj = -di
          di = buffer
        else
          buffer = di
          di = -dj
          dj = buffer
        ++segment_length  if dj is 0
      ++k

  addAll: ->
    @drawGrid()
    @spiralWalk Queries.xyPos()  if Queries.xyPos().x isnt false
    @applyShade()
    @addTiles()

  reset: ->
    @$("#tiles").empty()
    @addAll()