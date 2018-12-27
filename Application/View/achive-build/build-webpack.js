const webpack = require('webpack');
const ora = require('ora');

module.exports = function build(config, modulePath){
    return new Promise((resolve, reject)=>{
        const compiler = webpack(config);
        const spinner = ora(`Module [${modulePath}] Building...`);
        spinner.start();

        compiler.run((err, stats)=>{
            spinner.stop();
            if (err) throw err;
            console.log(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }));

            if (stats.hasErrors()) {
                console.error('Build failed with errors.');
                process.exit(1);
            }
            console.log(`\nModule [${modulePath}] Build Complete!\n`);
            resolve();
        });
    });
};