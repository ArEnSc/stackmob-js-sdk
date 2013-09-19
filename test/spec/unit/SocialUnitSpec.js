/**
 * Social Unit Tests
 *
 * expectEndpoint params:
 * 1) user object
 * 2) array of params without `options`
 * 3) method name
 * 4) HTTP verb
 * 5) Endpoint
 */

describe("Social Unit Tests", function() {

  // Mock Ajax Calls
  var mockCreate, mockFetch, mockPut, mockDelete;

  it("should set up mock ajax", function() {
    mockCreate = mockCreateAsSuccess();
    mockFetch = mockFetchAsSuccess();
    mockPut = mockUpdateAsSuccess();
    mockDelete = mockDeleteAsSuccess();
    StackMob.clearOAuthCredentials();
  });

  it("should call linkUserWithFacebook", function() {

    var user = new StackMob.User({ username: "testUser", password: "testUser" });

    expectEndpoint(user, [''], 'linkUserWithFacebook', 'GET', 'user/linkUserWithFacebook');

  });

  it("should call unlinkUserFromFacebook", function() {

    var user = new StackMob.User({username: "testUser", password: "testUser"});

    expectEndpoint(user, [], 'unlinkUserFromFacebook', 'DELETE', 'user/unlinkUserFromFacebook');

  });

  it("should call facebookAccessToken", function() {

    var user = new StackMob.User({username: "testUser", password: "testUser"});

    expectEndpoint(user, ['', false], 'loginWithFacebookToken', 'POST', 'user/facebookAccessToken');

  });

  it("should call createUserWithFacebook", function() {

    var user = new StackMob.User({username: "testUser", password: "testUser"});

    expectEndpoint(user, [''], 'createUserWithFacebook', 'POST', 'user/createUserWithFacebook');

  });

  it("should call facebookAccessTokenWithCreate", function() {

    var user = new StackMob.User({username: "testUser", password: "testUser"});

    expectEndpoint(user, ['', false],'loginWithFacebookAutoCreate', 'POST', 'user/facebookAccessTokenWithCreate');

    runs(function() {
      user.loginWithFacebookAutoCreate('token', false, {
        inspectParams: function(model, params, method){
          expect(params['data']).toContain(model['loginField'] + "=testUser");
        }
      });
    });

  });

  it("should call gigyaAccessToken", function() {

    var user = new StackMob.User({ username: "testUser", password: "testUser" });

    expectEndpoint(user, ['', '', '', false], 'loginWithGigya', 'POST', 'user/gigyaAccessToken');

  });

  it("should call linkUserWithGigya", function() {

    var user = new StackMob.User({ username: "testUser", password: "testUser" });

    expectEndpoint(user, ['', '', ''], 'linkUserWithGigya', 'POST', 'user/linkUserWithGigya');

  });

  it("should call unlinkUserFromGigya", function() {

    var user = new StackMob.User({ username: "testUser", password: "testUser" });

    expectEndpoint(user, [], 'unlinkUserFromGigya', 'DELETE', 'user/unlinkUserFromGigya');

  });

  it("should clear ajax mocks", function() {
    runs(function() {
      clearAllAjaxMocks();
    });
  });

});
