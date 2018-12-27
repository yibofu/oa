console.error('====');

const program = require('commander');
const _ = require('lodash');

program
    .usage('<path>')
    .option('-c, --config <path>', 'set config path. defaults to ./build-config-all.js')
    .parse(process.argv);

let [path] = program.args;
if (!path){

    program.outputHelp();
    process.exit();
}
path = genCorrectPath(path);

switch(path){
    case 'View/vendor':
    case 'view-v2/vendor':
        buildVendor(path);

        break;
    default:

        const BuildConfigMap = require(program.config || './build-config-all.js');
        const BuildConfigFlat = genBuildConfigFlat(BuildConfigMap);
        build(path, BuildConfigFlat);
}

function genCorrectPath(path){
    const viewMap = {
        v1: 'View',
        v2: 'view-v2'
    };
    return _.chain(path)
        .split(/[\/\\]/)
        .compact()
        .tap(arr => {
            const view = arr[0];
            if (_.has(viewMap, view)){
                arr[0] = viewMap[view];
            }
        })
        .join('/')
        .value();
}
function genBuildConfigFlat(config){
    const BuildModule = require('./build-module');
    const flatten = require('flat');
    const configFlat = flatten(config, {
        safe: true,
        delimiter: '/'
    });
    return _.mapValues(configFlat, (pages, module) => new BuildModule({pages, module}));
}

async function build(path, configFlat){
    for (let key of Object.keys(configFlat)){
        const module = configFlat[key];
        if (module.isInModule(path)){
            await module.build(path);
            break;
        } else if (module.belongTo(path)){
            await module.buildModule();
        }
    }
}

function buildVendor(path){
    const [view] = path.split('/');
    const genVendorConfig = require('./gen-vendor-config');
    const buildWebpack = require('./build-webpack');
    buildWebpack(genVendorConfig(view), path);
}

// npm run build:dmg view-v2/web/site