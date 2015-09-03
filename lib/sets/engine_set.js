/**
 * Set of engines
 * @memberof module:coz/lib/sets/
 * @inner
 * @constructor EngineSet
 * @param {object} [engines] - Engines to register.
 */

"use strict";

var buildinEngines = require('../buildin/buildin_engines'),
    cozEngine = require('coz-engine'),
    extend = require('extend');

/** @lends EngineSet */
function EngineSet(engines) {
    var s = this;
    s._engines = {};
    s.registerEngines(buildinEngines);
    s.registerEngines(engines || {});
}

EngineSet.prototype = {
    /**
     * Register an engine.
     * @param {string} name - Name of engine.
     * @param {object} engine - Engine object.
     * @param {!function} engine.compile - Compile function.
     * @returns {EngineSet} - self.
     */
    registerEngine: function (name, engine) {
        var s = this;
        if (s.resolveEngine(name)) {
            throw new Error('Engine with name already registered: ' + name);
        }
        engine = EngineSet._newEngine(engine, name);
        s._engines[name] = engine;
        return s;
    },
    /**
     * Register multiple engines.
     * @param {object} engines - Engines to register.
     * @returns {EngineSet} - self.
     */
    registerEngines: function (engines) {
        var s = this;
        var names = Object.keys(engines);
        for (var i = 0, len = names.length; i < len; i++) {
            var name = names[i];
            s.registerEngine(name, engines[name]);
        }
        return s;
    },
    /**
     * Resolve an engine.
     * @param {string} name - Name to resolve.
     * @returns {function} - Resolved engine constructor.
     */
    resolveEngine: function (name) {
        if (!name) {
            return null;
        }
        var s = this;
        return s._engines[name] || null;
    },
    /**
     * @type {object}
     */
    _engines: undefined
};

EngineSet._newEngine = function (properties) {
    if (properties.$isEngine) {
        return properties;
    }
    switch (typeof(properties)) {
        case 'string':
        case 'boolean':
        case 'number':
            throw new Error('Invalid engined:' + String(properties));
    }
    properties = extend({}, properties);
    return cozEngine(properties);
};

module.exports = EngineSet;