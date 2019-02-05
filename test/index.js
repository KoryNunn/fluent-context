var test = require('tape');
var fluentContext = require('../');

var createApi = (fooValue = 0) => ({
    _foo: fooValue,
    foo: function(){
        return this._foo;
    },
    bar: function(){
        return createApi(this._foo + 1);
    }
});

var createFunctionBasedApi = (fooValue = 0) => {
    var fnApi = function(){
        return fnApi._foo;
    }
    fnApi._foo = fooValue;
    fnApi.bar = function(){
        return createFunctionBasedApi(this._foo + 1);
    };

    return fnApi;
};

test('test api works', t => {
    t.plan(3);

    var api = createApi();

    t.equal(api.foo(), 0);
    t.equal(api.bar().foo(), 1);
    t.equal(api.bar().bar().foo(), 2);
});

test('test functionApi works', t => {
    t.plan(4);

    var api = createFunctionBasedApi();

    t.equal(api(), 0);
    t.equal(api.bar()(), 1);
    t.equal(api.bar().bar()(), 2);

    var bar = api.bar;

    t.notEqual(bar(), 1);
});

test('single level', t => {
    t.plan(1);

    var api = createApi();
    var wrappedApi = fluentContext(api);

    var foo = wrappedApi.foo;

    t.equal(foo(), 0);
});

test('multiple levels', t => {
    t.plan(3);

    var api = createApi();
    var wrappedApi = fluentContext(api);

    var foo = wrappedApi.foo;

    t.equal(foo(), 0);

    var bar = wrappedApi.bar;
    var barFoo = bar().foo;

    t.equal(barFoo(), 1);

    var barBarFoo = bar().bar().foo;

    t.equal(barBarFoo(), 2);
});

test('works for function-apis', t => {
    t.plan(3);

    var api = createFunctionBasedApi();
    var wrappedApi = fluentContext(api);

    t.equal(wrappedApi(), 0);

    var bar = wrappedApi.bar;

    t.equal(bar()(), 1);

    var barBar = bar().bar();

    t.equal(barBar(), 2);
});