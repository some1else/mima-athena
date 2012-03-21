window.MM ||= {}
window.MM.MeanXY ||= {}

columns = 5
rows = 3

# Queries = BreadcrumbsView = Tiles = TilesView = Entries = EntriesView = MeanXY = null
# server = user = path = null

knot =
  type: "knot query", label: "§"

launchpad = entities: [
  type: "person query", label: "+"
  x: 0, y: 1
,
  type: "delegate_in query", label: "<"
  x: 0, y: 0
,
  type: "delegate_out query", label: ">"
  x: 1, y: 0
,
  type: "tag query", label: "#"
  x: columns - 1, y: 0
,
  type: "place query", label: "@"
  x: 2, y: rows - 1
,
  type: "time query", label: "~"
  x: columns - 2, y: rows - 2
,
  type: "knot query", label: "§"
  x: columns - 1, y: rows - 1
]

class MM.MeanXY.EntryModel extends Backbone.Model
  defaults:
    'text': "..."
    description: "..."
    prettytime: "now"
    url: "#"

  parse: (om) ->
    om =
      text: om.text
      description: om.description
      prettytime: om.prettytimecreated
      url: om.url

    om

  initialize: (obj) ->
    @set @parse(obj)

class MM.MeanXY.EntryCollection extends Backbone.Collection
  model: MM.MeanXY.EntryModel

class MM.MeanXY.EntryView extends Backbone.View
  template: _.template("<div class='entry'>" + "<h1><a href='<%= url %>'><%= text %></a></h1>" + "<p><%= description %>(<em><%= prettytime %></em>)</p>" + "</div>")
  render: ->
    $(@el).html @template(@model.attributes)
    this

class MM.MeanXY.EntryCollectionView extends Backbone.View
  el: "#entries"
  reset: ->
    $("#entries").empty()
    Entries.each (entry) ->
      view = new MM.MeanXY.EntryView(model: entry)
      $("#entries").append view.render().el

  initialize: ->
    _.bindAll this, "reset"
    Entries.bind "reset", @reset, this

jax = (path, data, silent) ->
  if window.TOKEN is `undefined`
    data.secret = "admin123"
  else
    data.access_token = window.TOKEN
  dt = ""
  unless silent is true
    dt = "jsonp"
    if path is "relevant"
      data.json_callback = "_relevant_jsonp"
    else if path is "knot"
      path = "entry"
      data.json_callback = "_knot_jsonp"
    else if path is "entries"
      data.json_callback = "_entries_jsonp"
    else if path is "type"
      data.json_callback = "_type_jsonp"
      path = "relevant"
  else
    dt = "json"
  url = "http://" + server + "/BTW/" + path + "/" + user
  $.ajax url,
    dataType: dt
    data: data

doQuery = (model) ->
  Queries.add model  if model
  data = q: Queries.asQueryParam()
  data.limit = columns * rows
  jax "relevant", data

window._relevant_jsonp = (response) ->
  if response.error
    resp = []
  else
    resp = response.entities.slice(0, columns * rows - launchpad.entities.length)
  resp = resp.concat(launchpad.entities)
  Tiles.reset resp
  $("#meta").html response.meta

doTypeQuery = (model) ->
  Queries.add model
  data =
    type: model.get("kind").toUpperCase()
    limit: columns * rows

  qs = Queries.asQueryParam()
  data.q = (if (qs.length > 0) then qs else `undefined`)
  jax "type", data

window._type_jsonp = (response) ->
  entities = undefined
  if response.error
    entities = launchpad
  else
    entities = response.entities.slice(0, (columns * rows))
  Tiles.reset entities

doKnotQuery = ->
  data = add: Queries.asFuzztleText()
  jax "knot", data

window._knot_jsonp = (response) ->
  Queries.reset()
  doQuery()

resetSession = ->
  Queries.reset()
  data = reset: "true"
  jax "relevant", data
  Tiles.reset static_launchpad.entities

$("#reset").click (e) ->
  resetSession()



MM.MeanXY.factory = ->
    Queries = new MM.MeanXY.QueryCollection()
    BreadcrumbsView = new MM.MeanXY.BreadcrumbCollectionView()
    Tiles = new MM.MeanXY.TileCollection()
    TilesView = new MM.MeanXY.TileCollectionView()
    Entries = new MM.MeanXY.EntryCollection()
    EntriesView = new MM.MeanXY.EntryCollectionView()

    doQuery()

# $ ->
#   server = (if window.SERVER_URI then window.SERVER_URI else "www.middlemachine.com/BTW")
#   if window.SERVER_URI
#     if window.SERVER_PORT
#       server = window.SERVER_URI + ":" + window.SERVER_PORT
#     else
#       server = window.SERVER_URI
#   username = (if window.USERNAME then window.USERNAME else $("#username").val())

#   meanxy = new MM.MeanXY.Factory()
  

