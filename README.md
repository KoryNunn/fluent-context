# fluent-context

Binds context to fluent API's so they can be used in functional programming patterns.

## Usage:

Assume a fluent API that looks like this:

```js
var createApi = (fooValue = 0) => ({
    _foo: fooValue,
    foo: function(){
        return this._foo;
    },
    bar: function(){
        return createApi(this._foo + 1);
    }
});
```

That you might use like this:

```js
var api = createApi();

api.foo(); // 0;
api.bar().foo(); // 1;
api.bar().bar().foo(); // 2;
```

Normally you wouldn't be able to call a funciton that has been taken off of the API like this:


```js
var api = createApi();

var bar = api.bar();

bar.foo(); // THROWS 'bar.foo is not a function'
```

This is because the functions on the API reference `this`, the value of which is not the API when you start passing the functions around.

`fluent-context` wraps fluent APIs in a chain of Proxy's that pass the API as context to the API's functions:

```js
var api = createApi();
var wrappedApi = fluentContext(api);

var bar = wrappedApi.bar;

bar.foo(); // 1
```