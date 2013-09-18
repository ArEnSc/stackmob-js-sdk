/**
 * This suite will test the three security modes of the SDK
 * Always - All requests will be made over HTTPS
 * Never - All requests will be made over HTTP
 * Mixed - Only authentication methods will be made over HTTPS
 */

describe("Unit tests for API Redirect", function() {

  // Mock Ajax Calls
  var mockCreate, mockRedirectedCreate;

  it("should set up mock ajax", function() {

    // 302 - Temporary Redirect Mocks
    mockCreate = $.mockjax({
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

    mockRedirectedCreate = $.mockjax({
      url: 'http://api.redirected.com/thing',
      status: 201,
      type: 'POST',
      responseText: {
        sample: 'data'
      }
    });

    mockRedirectedCreate = $.mockjax({
      url: 'http://api.redirected.com/anotherthing',
      status: 200,
      type: 'GET',
      responseText: {
        sample: 'data'
      }
    });

    // 301 - Permanent Redirect Mocks
    mockPermanentCreate = $.mockjax({
      url: 'http://api.redirected.com/permanent',
      status: 301,
      type: 'GET',
      responseText: {
        sample: 'data'
      },
      headers: {
        location: 'http://api.permanent.com/permanent'
      }
    });

    mockPermanentRedirectedCreate = $.mockjax({
      url: 'http://api.permanent.com/permanent',
      status: 201,
      type: 'GET',
      responseText: {
        sample: 'data'
      }
    });

  });

  it("should redirect API on 302 response status", function() {
    var model, params, method, running = true;

    runs(function() {
      var Thing = StackMob.Model.extend({ schemaName: 'thing' });
      var thing = new Thing({ name: "testThing" });
      thing.create({
        done: function(mod,p,m){
          running = false;
          model = mod;
          params = p;
          method = m;
        }
      });

    });
    waitsFor(function() {
      return running === false;
    });

    runs(function() {
      expect(params['url']).toStartWith('http://api.redirected.com/');
    });
  });

  it("should redirect subsequent requests", function() {

    var model, params, method, running = true;

    runs(function() {
      var Thing = StackMob.Model.extend({ schemaName: 'anotherthing' });
      var thing = new Thing({ id: "id" });
      thing.fetch({
        done: function(mod,p,m){
          running = false;
          model = mod;
          params = p;
          method = m;
        }
      });

    });
    waitsFor(function() {
      return running === false;
    });

    runs(function() {
      expect(params['url']).toStartWith('http://api.redirected.com/');
    });
  });

  it("should redirect on API 301 and save domain into local storage" ,function() {
    runs(function() {
      var model, params, method, running = true;

    runs(function() {
      var Thing = StackMob.Model.extend({ schemaName: 'permanent' });
      var thing = new Thing({ id: "id" });
        thing.fetch({
          done: function(mod,p,m){
            running = false;
            model = mod;
            params = p;
            method = m;
          }
        });

      });
      waitsFor(function() {
        return running === false;
      });

      runs(function() {
        expect(params['url']).toStartWith('http://api.permanent.com/');
        expect(StackMob.getBaseURL()).toEqual('api.permanent.com/');
        expect(StackMob.Storage.retrieve("apiDomain")).toEqual('api.permanent.com/');
      });
    });
  });

  it("should clear ajax mocks", function() {
    runs(function() {
      StackMob.Storage.remove("apiDomain");
      clearAllAjaxMocks();
    });
  });

});