module.exports = function fluentContext(api){
    if(typeof Proxy === 'undefined'){
        throw new Error('This environment does not support Proxy\'s');
    }

    if(!api|| typeof api !== 'object'){
        return api;
    }

    return new Proxy(api, {
        get: function(target, key){
            if(key in target && typeof target[key] === 'function'){
                return function(){
                    var result = api[key].apply(api, arguments);

                    return fluentContext(result);
                };
            }

            return fluentContext(target[key]);
        }
    });
}