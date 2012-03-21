window.MM ||= {}
MM.MeanXY ||= {}

class MM.MeanXY.QueryModel extends Backbone.Model
  defaults:
    x: false
    y: false

class MM.MeanXY.QueryCollection extends Backbone.Collection
  model: MM.MeanXY.QueryModel
  toString: (delimiter) ->
    res = ""
    models = _(@models).reject((m) ->
      m.get("query") is true
    )
    $.each models, (i, m) ->
      res += m.toString()
      res += delimiter  if i < models.length - 1
    return res

  asQueryParam: ->
    @toString ","

  asFuzztleText: ->
    @toString " "

  xyPos: ->
    result =
      x: Math.ceil(columns / 2)
      y: Math.floor(rows / 2)

    unless _.isEmpty(@models)
      m = @models[@models.length - 1]
      result =
        x: m.get("x")
        y: m.get("y")
    result