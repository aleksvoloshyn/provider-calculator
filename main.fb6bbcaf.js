// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/main.js":[function(require,module,exports) {
var orgs = [{
  name: 'backblaze',
  min: 7,
  storageRate: 0.005,
  transferRate: 0.01
}, {
  name: 'bunny',
  max: 10,
  storageRate: {
    hdd: 0.01,
    ssd: 0.02
  },
  transferRate: 0.01
}, {
  name: 'scaleway',
  storageRate: {
    multi: 0.06,
    single: 0.03
  },
  transferRate: 0.02,
  free: 75
}, {
  name: 'vultr',
  min: 5,
  storageRate: 0.01,
  transferRate: 0.01
}];
var barColors = {
  grey: '#8C92AC',
  red: '#ff3333',
  orange: '#fc7f29',
  purple: '#c06a90',
  blue: '#1ac6ff'
};
var storageInput = document.querySelector("input[name='storage']");
var transferInput = document.querySelector("input[name='transfer']");
var rateValue = document.querySelector('.rate-value');
var transferValue = document.querySelector('.transfer-value'); // total values:

var backblazeValue = document.querySelector('.backblaze-value');
var bunnyValue = document.querySelector('.bunny-value');
var scalewayValue = document.querySelector('.scaleway-value');
var vultrValue = document.querySelector('.vultr-value'); // inputs for bunny.net:

var hdd = document.querySelector("input[value='hdd']");
var ssd = document.querySelector("input[value='ssd']"); // inputs for scaleway.net:

var multi = document.querySelector("input[value='multi']");
var single = document.querySelector("input[value='single']"); // diagram bars:

var backblazeBar = document.querySelector('.diagram-bars-backblaze');
var bunnyBar = document.querySelector('.diagram-bars-bunny');
var scalewayBar = document.querySelector('.diagram-bars-scaleway');
var vultrBar = document.querySelector('.diagram-bars-vultr');
var currency = document.querySelectorAll('.currency');
var barsWrapper = document.querySelectorAll('.diagram-bars-wrapper');
var diagram = document.querySelectorAll('.diagram-bars'); // result of inputs

var diskType = 'hdd';
var quantityType = 'multi';
var storage = '0';
var transfer = '0'; // orgs total data

var backblazeStorage = 0;
var backblazeTransfer = 0;
var bunnyStorage = 0;
var bunnyTransfer = 0;
var scalewayStorage = 0;
var scalewayTransfer = 0;
var vultrStorage = 0;
var vultrTransfer = 0;

var colorSwither = function colorSwither() {
  backblazeBar.style.width = backblazeValue.innerHTML + '%';
  backblazeBar.style.backgroundColor = barColors.red;
  bunnyBar.style.width = bunnyValue.innerHTML + '%';
  bunnyBar.style.backgroundColor = barColors.orange;
  scalewayBar.style.width = scalewayValue.innerHTML + '%';
  scalewayBar.style.backgroundColor = barColors.purple;
  vultrBar.style.width = vultrValue.innerHTML + '%';
  vultrBar.style.backgroundColor = barColors.blue;
  var blackblazer = +backblazeBar.style.width.slice(0, -1);
  var bunny = +bunnyBar.style.width.slice(0, -1);
  var scaleway = +scalewayBar.style.width.slice(0, -1);
  var vultr = +vultrBar.style.width.slice(0, -1);
  var minimalPrice = Math.min(blackblazer, bunny, scaleway, vultr);

  if (blackblazer !== minimalPrice) {
    backblazeBar.style.backgroundColor = barColors.grey;
  }

  if (bunny !== minimalPrice) {
    bunnyBar.style.backgroundColor = barColors.grey;
  }

  if (scaleway !== minimalPrice) {
    scalewayBar.style.backgroundColor = barColors.grey;
  }

  if (vultr !== minimalPrice) {
    vultrBar.style.backgroundColor = barColors.grey;
  }
};

var setBarsVisibility = function setBarsVisibility(element, action) {
  if (action === 'show') {
    element.forEach(function (el) {
      return el.classList.add('visible');
    });
  }

  if (action === 'hide') {
    element.forEach(function (el) {
      return el.classList.remove('visible');
    });
  }
}; // handler  (hdd or ssd)


var diskHandler = function diskHandler(type, orgName) {
  return function (event) {
    diskType = event.target.value;
    orgs.map(function (item) {
      if (item.name === orgName && type === 'hdd') {
        bunnyStorage = storage * item.storageRate.hdd;
      }

      if (item.name === orgName && type === 'ssd') {
        bunnyStorage = storage * item.storageRate.ssd;
      }
    });
    bunnyStorage + bunnyTransfer > 10 ? bunnyValue.textContent = 10 : bunnyValue.textContent = bunnyStorage + bunnyTransfer;
    colorSwither();
  };
}; // handler (multi or single)


var rateTypeHandler = function rateTypeHandler(type, orgName) {
  return function (event) {
    quantityType = event.target.value;
    orgs.filter(function (org) {
      return org.name === orgName;
    }).map(function (org) {
      if (type === 'multi' && +storage < org.free) {
        scalewayStorage = 0;
      }

      if (type === 'multi' && +storage >= org.free) {
        scalewayStorage = (+storage - org.free) * org.storageRate.multi;
      }

      if (type === 'single' && +storage < org.free) {
        scalewayStorage = 0;
      }

      if (type === 'single' && +storage >= org.free) {
        scalewayStorage = (+storage - org.free) * org.storageRate.single;
      }
    });
    scalewayValue.textContent = scalewayStorage + scalewayTransfer;
    colorSwither();
  };
};

hdd.addEventListener('change', diskHandler('hdd', 'bunny'));
ssd.addEventListener('change', diskHandler('ssd', 'bunny'));
multi.addEventListener('change', rateTypeHandler('multi', 'scaleway'));
single.addEventListener('change', rateTypeHandler('single', 'scaleway'));
storageInput.addEventListener('input', function (e) {
  storage = e.target.value;
  setBarsVisibility(diagram, 'show');
  rateValue.textContent = storage; // backblaze

  backblazeStorage = storage * 0.005;
  backblazeStorage + backblazeTransfer < 7 ? backblazeValue.textContent = 7 : backblazeValue.textContent = (Number(backblazeStorage) + Number(backblazeTransfer)).toFixed(2); // bunnyStorage = storage * 0.01

  if (diskType === 'hdd') {
    bunnyStorage = storage * 0.01;
  }

  if (diskType === 'ssd') {
    bunnyStorage = storage * 0.02;
  }

  bunnyStorage + bunnyTransfer > 10 ? bunnyValue.textContent = 10 : bunnyValue.textContent = (Number(bunnyStorage) + Number(bunnyTransfer)).toFixed(2); // scaleway

  if (quantityType === 'multi') {
    if (storage < 75) {
      scalewayStorage = 0;
    } else {
      scalewayStorage = (storage - 75) * 0.06;
    }
  }

  if (quantityType === 'single') {
    if (storage < 75) {
      scalewayStorage = 0;
    } else {
      scalewayStorage = (storage - 75) * 0.03;
    }
  }

  scalewayValue.textContent = (Number(scalewayStorage) + Number(scalewayTransfer)).toFixed(2); // vultr

  vultrStorage = storage * 0.01;
  vultrStorage + vultrTransfer < 5 ? vultrValue.textContent = 5 : vultrValue.textContent = (Number(vultrStorage) + Number(vultrTransfer)).toFixed(2);
  colorSwither();

  if (storage === '0' && transfer === '0') {
    console.log('both zero');
    setBarsVisibility(diagram, 'hide');
  }
});
transferInput.addEventListener('input', function (e) {
  transfer = e.target.value;
  setBarsVisibility(diagram, 'show');
  transferValue.textContent = transfer; // backblaze

  backblazeTransfer = transfer * 0.01;
  backblazeStorage + backblazeTransfer < 7 ? backblazeValue.textContent = 7 : backblazeValue.textContent = (Number(backblazeStorage) + Number(backblazeTransfer)).toFixed(2); // bunny

  bunnyTransfer = transfer * 0.01;
  bunnyStorage + bunnyTransfer > 10 ? bunnyValue.textContent = 10 : bunnyValue.textContent = (Number(bunnyStorage) + Number(bunnyTransfer)).toFixed(2); // scaleway

  if (transfer < 75) {
    scalewayTransfer = 0;
  } else {
    scalewayTransfer = (transfer - 75) * 0.02;
  }

  scalewayValue.textContent = (Number(scalewayStorage) + Number(scalewayTransfer)).toFixed(2); // vultr

  vultrTransfer = transfer * 0.01;
  vultrStorage + vultrTransfer < 5 ? vultrValue.textContent = 5 : vultrValue.textContent = (Number(vultrStorage) + Number(vultrTransfer)).toFixed(2);
  colorSwither();

  if (transfer === '0' && storage === '0') {
    setBarsVisibility(diagram, 'hide');
  }
});
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58615" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/main.js"], null)
//# sourceMappingURL=/main.fb6bbcaf.js.map