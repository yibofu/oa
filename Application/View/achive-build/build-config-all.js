const _ = require('lodash');
// const util = require('util');

const configFiles = [
    './build-config-lize.js',
    './build-config-corly.js'
];

const configs = configFiles.map(require);

const configAll = _.mergeWith(...configs, (objValue, srcValue)=>{
    if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
    }
});
// console.log(util.inspect(configAll));

module.exports = configAll;