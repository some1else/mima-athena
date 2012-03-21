# # Concept
#
# `Concept` is the root entity in *middlemachine*. It's extended to `Person`, `Tag`, `Place` and `Time` constructs.
# It's also used to express an `Entry`'s relations `RelevantConcepts` and `SuggestedConcepts`

MM
window.MM ||= {}

class MM.Concept extends Backbone.Model
  defaults:
    content: "", kind: ""
    weight: 0, shade: 0
    x: false, y: false
    query: false, prompt: false

  # We parse the `Concept`
  parse: (values) ->

    result = {}

    typ = values.type
    i = typ.indexOf(" ")
  
    if i > 0
      result.query = true  if typ.indexOf("query") > 0
      result.prompt = true  if typ.indexOf("prompt") > 0
      typ = typ.substr(0, i)
  
    switch typ.toUpperCase()
      when "TAG"
        result.kind = "tag"
      when "PERSON"
        result.kind = "person"
      when "DELEGATE_IN"
        result.kind = "delegate_in"
      when "DELEGATE_OUT"
        result.kind = "delegate_out"
      when "PLACE"
        result.kind = "place"
      when "TIME"
        result.kind = "time"
      when "KNOT"
        result.kind = "knot"
      else
        result.kind = "tile"

    result.content = values.label

    if _.isString(values.w) or _.isNumber(values.w)
      result.weight = values.w
    else if result.kind is "knot"
      result.weight = -Infinity
    else
      result.weight = 0

    result

  # When we add the `Concept` to `Entry.fuzz` or a `MeanXY` `Query`, we turn it to string with it's fuzztle prefix
  toString: ->
    res = ""
    switch @get("kind").toUpperCase()
      when "PERSON"
        res += "+"
      when "TAG"
        res += "#"
      when "PLACE"
        res += "@"
      when "TIME"
        res += "~"
    res += @get("content")
    res

class MM.Person extends MM.Concept
  defaults:
    name: "John Doe"
    kind: "person"
    score:
      weight: 0
      shade: 0
