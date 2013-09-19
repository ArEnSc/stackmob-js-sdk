describe("Unit tests for related schemas", function() {

  // Mock Ajax Calls
  var mock;

  it("should set up mock ajax", function() {

    mock = $.mockjax({
      url: 'http://api.stackmob.com/thing',
      status: 302,
      type: 'POST',
      responseText: {
        sample: 'data'
      },
      headers: {
        location: 'http://api.redirected.com/thing'
      }
    });

  });

  it("should", function() {
    // Define Parent Model
    ParentModel = StackMob.Model.extend({
      schemaName: 'parent',
      relatedSchemas: {
        "childfield": "child",
        "nonexistent": "dontcreate"
      }
    });

    // Define Child Model
    ChildModel = StackMob.Model.extend({
      schemaName: "child",
      relatedSchemas: {
        "parentfield": "parent"
      }
    });

    var id, ParentModel, ParentModelDeepSave, ChildModel;

    runs(function() {
        var parent = new ParentModel({ name: "parent1" });
        var child = new ChildModel({ name: "child1" });

        // child.set('parentfield', parent);
        parent.set('childfield', [child])
        .create().then(function(model) {
            id = parent.get('parent_id');
            return parent.save();
        }).then(function(model) {
            console.log(model);
            $("#results").html(JSON.stringify(model));
        });
    });

    runs(function() {
        var parent = new ParentModel({ 'parent_id': id });
        parent
        .fetchExpanded(1)
        .then(function() {
            return parent.save();
        }).then(function(model) {
            $("#results").html(JSON.stringify(model));
        });
    });

    runs(function() {
        var parent = new ParentModel({ 'parent_id': id });
        parent
        .fetchExpanded(1)
        .then(function() {
            parent.deepSave();
        }).then(function(model) {
            $("#results").html(JSON.stringify(model));
        });
    });

  });

  it("should clear ajax mocks", function() {
    runs(function() {
      clearAllAjaxMocks();
    });
  });

});