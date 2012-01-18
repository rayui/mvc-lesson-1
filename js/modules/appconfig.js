/*
*   
*   'Settings' ex:
*   var settings = require("appconfig").settings();
*   var my_val = settings.foo;
*   author: gregory tomlinson
*
*
* */

var optimist          = require('optimist'),
    argv              = optimist.argv,
    vm                = require("vm"),
    util              = require('util'),
    fs                = require('fs');

exports.autoload_files = true;
/*
*   Manage the appcnfg
*
*   Handle methods for loading / reseting data
*
*   provide an API to Object data stores
*
* */
var appcnfg  = {
    configopts: {
        optname:"ac_config",
        defaultsname:"ac_defaults"
    },
    _settings:null,
    _defaults:null,
    debug:false,
    env:("env" in argv) ? argv.env : "dev",
    _loadopts:function( obj_name, filepath ) {
        if(!this[obj_name] && exports.autoload_files && filepath ) {
            logger("Obj not exist, create from file", filepath);
            this[obj_name] = opts_from_file.call({}, filepath);
        } else if(!this[obj_name] && !filepath) {
            this[obj_name] = {};
        }
        return this[obj_name] || {};
    },
    set settings(opts) {
        this._settings = opts;
    },
    get settings() {
        var obj_name = "_settings",
            filepath = argv[this.configopts.optname] || null;
        return this._loadopts( obj_name, filepath );
    },
    set defaults(opts) {
        this._defaults = opts;
    },
    get defaults() {
        var obj_name = "_defaults",
            filepath = argv[this.configopts.defaultsname] || null;
        return this._loadopts( obj_name, filepath );
    },
    reset:function( cmnd_args ) {
        // mostly debugging
        if(cmnd_args) argv = optimist(cmnd_args).argv;
        this.env=argv.env || this.env || "dev";
        this.settings=null;
        this.defaults=null;
    }
}
/*
*
*   External API
*
*
* */
var appSettings = {
    get env() {
        return appcnfg.env;
    },
    set env(_env) {
        if(!(_env in appcnfg.settings)) {
            logger("Set: env")
            appcnfg.settings[_env] = {};
        }
        appcnfg.env = _env;
        return appcnfg.env;
    },
    set debug(val) {
        return appcnfg.debug = !!val;
    },
    get debug() {
        return appcnfg.debug;
    },
    // @return Object   "raw" everything that is stored in appconfig
    get raw() {
        var params = {},
            default_data = appcnfg.defaults,
            config_data = appcnfg.settings;
        copy(params, default_data);
        copy(params, config_data);
        return params;
    },
    all: function( env_name ) {
        var params = {}, env_data,
            default_data = appcnfg.defaults,
            config_data = appcnfg.settings;
        logger("Check all defaults", default_data);
        copy(params, default_data);
        logger("Check All. Settings are:", config_data);
        env_data = get_env.apply(config_data, arguments);
        return copy(params, env_data);
    },
    get:function(key) {
        return get_by_key.call( get_env.call(appcnfg.settings), key, appcnfg.defaults );
    },
    set:function(key, value) {
        return set_by_key.apply(get_env.call(appcnfg.settings), arguments);
    },
    reset:function reset() {
        return appcnfg.reset.apply(appcnfg, arguments);
    },
    configureSettings: function configureSettings( opts ) {
        return copy( appcnfg.settings, opts );

    },
    /*
    *   @param  Object   opts       :: An object to override all other values
    *   @params String   env_name   :: "a string used to override the
    *                                   --env=env_name"
    *
    *   @return Object   settings   :: "READ ONLY" dot-syntax
    *
    *   usage:
    *
    *       var settings = require("appconfig").settings();
    *       console.log(settings.foo);
    *
    * */
    settings: function define_settings(_opts, env_name) {
        var _settings               = {},
            default_data            = appcnfg.defaults,
            default_conf            = appcnfg.settings,
            params                  = {},
            param_defaults          = {};

        copy(param_defaults, default_data);
        copy(params, default_conf);
        // first add defaults
        add_getter.call(_settings, param_defaults);
        // determine wich env
        add_getter.call(_settings, params[env_name || appcnfg.env]);
        // now add any overrides
        // NOTE:
        // the _opts are dropped once called
        // meaning, in other files, those values will be lost
        // this seems useful ATM for local overrides
        // but could easily be confused
        //
        // TODO
        // add a "READ ONLY" setting for this
        // dont att the seters... which I think it alread happening...
        // perhaps I should graft _opts to params[env]
        add_getter.call(_settings, _opts);
        //
        return _settings;

    },
    configureDefaults: function configureDefaults( opts ) {
        return copy( appcnfg.defaults, opts );
    }
}

// Set Public methods
copy(exports, appSettings);

function copy(a,b) {
    // supports getter/setter -- ex: http://ejohn.org/blog/javascript-getters-and-setters/
    var base;
    for(var k in b) {
        var g = b.__lookupGetter__(k),
            s = b.__lookupSetter__(k);
        if(g || s) {
            if(g) a.__defineGetter__(k, g);
            if(s) a.__defineSetter__(k, s);

        } else if(k && typeof b[k] === "object") {
            // handle getter/setters
            base = is_array(b[k]) ? [] : {};
            a[k]=copy( a[k] || base, b[k] );
        } else {
            a[k]=b[k];
        }
    }
    return a;
}
function is_array(item) {
    return !!(typeof item === "object" && item.constructor === [].constructor);
}
function get_by_key( key, fallback ) {
    if( key in this ) {
        return this[key];
    } else if (key in fallback) {
        return fallback[key];
    }
    return null;
}
function set_by_key(key, value) {
    return this[key]=value;
}
function get_env( env ) {
    return this[env || appcnfg.env] || appcnfg.defaults;
}
function logger() {
    if(!appcnfg.debug) return;
    Array.prototype.unshift.call(arguments, "[APPCONFIG-DEBUG]:");
    console.log.apply(null, arguments);
}

function add_getter( data ) {
    var d_keys = Object.keys(data || {});
    var i = d_keys.length, k, data;
    while(i--) {
        k = d_keys[i];
        if(typeof data[k] === "function") {
            this.__defineGetter__( k, data[k] );
        } else {
            this.__defineGetter__( k, (function(k,v) {
                return function() {
                    return v;
                }
            })(k, data[k]));
        }
    }
}
function opts_from_file( file_path ) {
    logger("opts from file");
    var filepaths = file_path.split(",") || [], 
        self = this;

    logger("ATTN: File paths:",filepaths);
    filepaths.forEach(function(fdata,idx) {
        if(fdata) {
            var data = load_from_file.call(self, fdata);
            copy(this || {}, data);
        }
    });
    return this;
}
function load_from_file( filepath ) {
    //logger("Loading file", filepath);
    var ext, data, filepath  = (filepath || "").trim(), filedata;
    try {
        //var filepath = fs.statSync(filepath);
        filedata = fs.readFileSync( filepath );
    } catch(e) {
        return null;
    }
    logger(filepath);
    ext = detect_filetype( filepath );
    data = process_file.call(this, filedata, ext);
    return data;
}

// Loading Files
function detect_filetype(filepath) {
    return (filepath.split(".").pop() || "").toLowerCase();
}
function process_file( data, ext ) {
    
    if(ext === "json") {
        // parse it
        var json_data = load_json_data.call(this, data);
        if(data && typeof data === "object" && !is_array(data)) {
            copy(this || {}, json_data); // 
        }
        return json_data;

    } else if (ext === "js") {
        var  params = load_script_data.call(this, data);
        if(params.defaults 
           && typeof params.defaults === "object"
           && !Array.isArray(params.defaults) ) {
            appSettings.configureDefaults(params.defaults);
            delete params.defaults;
        }
        copy(this || {}, params);
        return params;
    } else return null;
    
}
function load_script_data(filedata) {
    var params;
    try {
        params={};
        vm.runInNewContext( filedata, params );
        logger(util.inspect(params), "VM Inspection");
    } catch(e) {
        console.log("Error loading script", e);
        throw new Error("SCRIPT_PARSE_ERROR");
    }
    return params;
}
function load_json_data(filedata) {
    var data;
    try {
        data = JSON.parse(filedata);
    } catch(e) {
        console.log("Unable to parse JSON", e, filedata);
        throw new Error("INVALID_JSON");
    }
    return data;
}



/* dreamer */
/*
 *
*   just want options parsing?
*       use optimist, it handles reading process.argv
*
* */

