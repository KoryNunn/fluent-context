module.exports = function fluentContext(api){
    if(typeof Proxy === 'undefined'){
        throw new Error('This environment does not support Proxy\'s');
    }

    return new Proxy(api, {
        get: function(target, key){
            if(key in target && typeof target[key] === 'function'){
                return target[key].bind(target);
            }

            return target[key];
        }
    });
}