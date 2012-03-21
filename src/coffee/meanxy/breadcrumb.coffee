window.MM ||= {}
MM.MeanXY ||= {}

class MM.MeanXY.BreadcrumbView extends Backbone.View
  tagName: "span"
  events:
    click: "removeQuery"

  template: _.template("<span class='breadcrumb_tile breadcrumb_<%= kind %>'><%= content %></span>")
  render: ->
    $(@el).html @template(@model.attributes)  if @model.get("kind").indexOf("query") is -1
    this

  removeQuery: ->
    Queries.remove [ @model ]
    doQuery()

class MM.MeanXY.BreadcrumbCollectionView extends Backbone.View
  el: "#breadcrumbs"
  initialize: ->
    _.bindAll this, "addOne"
    Queries.bind "add", @addOne, this
    Queries.bind "reset", @reset, this
    Queries.bind "remove", @addAll, this

  addAll: ->
    @reset()
    dis = this
    Queries.each (query) ->
      dis.addOne query

  addOne: (query) ->
    if query.get("query") isnt true
      view = new MM.MeanXY.BreadcrumbView(model: query)
      $(@el).append view.render().el

  reset: ->
    $(@el).html ""
