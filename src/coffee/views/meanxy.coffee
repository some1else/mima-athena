window.MM ||= {}
MM.Views ||= {}

# #MeanXY
#
# MeanXY is a `Tile`-based interface to `Concepts` that enables the user to explore the `Concepts` they created by building up `Queries`, expressed in the `Breadcrumbs` view. A new `Query` is created every time a user clicks a `Tile`. `Tiles` are then filtered to show new `Concepts` related to the current `Queries`

class MM.Views.MeanXY extends Backbone.View
  template: _.template("")
  id: 'views-meanxy'

  # We start by creating the `Queries`, `Breadcrumbs` and `Concepts` that will drive the `Tiles` view
  initialize: ->
    queries = new MM.MeanXY.Queries()
    # `Breadcrumbs` display `Queries`
    @breadcrumbs = new MM.MeanXY.Views.Breadcrumbs(collection: queries)
    # `Concepts` are filtered by those same `Queries`
    concepts = new MM.MeanXY.Concepts(queries: queries)
    # The `Tiles` view displays `Concepts` relevant to `Queries`
    @tiles = new MM.MeanXY.Views.Tiles(queries: queries, collection: concepts)
    console.log @, "#init"

  # Rendering involves clearing the containing `el` and appending `Tiles` and `Breadcrumbs` to it
  render: =>
    @$el.html @template()
    @$el.append @breadcrumbs.render().el
    @$el.append @tiles.render().el
    console.log @, "#render"
    @
