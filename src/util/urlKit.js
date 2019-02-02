/**
 * 2019/1/31 下午3:51
 */


const getParams = function (url, seperator) {
    let pattern = new RegExp('([\\w\\d\\_\\-]+)=([^\\s\\&' + (seperator || '') + ']+)', 'ig');
    let params = {};
    url.replace(pattern, function (a, b, c) {
        params[b] = c;
    });
    return params;
}

export default {
    getParam(key) {
        let params = getParams(location.href)
        return params[key]
    }
}
