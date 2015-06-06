/**
 * Load a printer from bud file.
 * @memberof module:leaf
 * @function loadPrinter
 * @param {object} config - Bud configuration.
 * @param {loadPrinterCallback} callback - Callback when done.
 */

"use strict";

var core = require('../core'),
    ext = require('../ext'),
    path = core.path,
    async = ext.async,
    glob = ext.glob,
    fallbackCopy = require('../util/copying/fallback_copy'),
    BudConfig = require('./bud_config'),
    Printer = require('./printer');

function _defaults(src) {
    var dirname = path.dirname(src),
        basename = path.basename(src, path.extname(src));
    return {
        path: path.resolve(dirname, basename.replace(/^[\._]/, '')),
        cwd: dirname,
        get tmpl() {
            return glob.sync(path.resolve(dirname, basename + '.*'))
                .filter(function (tmpl) {
                    return tmpl !== src;
                })
                .shift();
        }
    }
}


/** @lends loadPrinter */
function loadPrinter(src, callback) {
    src = path.resolve(src);
    async.waterfall([
        function (callback) {
            try {
                var data = require(src);
                callback(null, data);
            } catch (e) {
                callback(e);
            }
        },
        function (data, callback) {
            switch (typeof(data)) {
                case 'function':
                    data(function (err, data) {
                        callback(err, data)
                    });
                    break;
                default:
                    callback(null, data);
            }
        },
        function (data, callback) {
            data = fallbackCopy(_defaults(src), data);
            callback(null, new BudConfig(data));
        },
        function (config, callback) {
            callback(null, new Printer(config));
        }
    ], callback);


}

module.exports = loadPrinter;


/**
 * @callback loadPrinterCallback
 * @param {error} err - Bud error.
 * @param {Printer} - A printer
 */