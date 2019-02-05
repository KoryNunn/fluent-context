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
})

test('test api works', t => {
    t.plan(3);

    var api = createApi();

    t.equal(api.foo(), 0);
    t.equal(api.bar().foo(), 1);
    t.equal(api.bar().bar().foo(), 2);
})

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