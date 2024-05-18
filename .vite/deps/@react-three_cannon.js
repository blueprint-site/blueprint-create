import {
  useFrame,
  useThree
} from "./chunk-3ESRNFP2.js";
import {
  require_jsx_runtime
} from "./chunk-N4P232ZE.js";
import "./chunk-PQEZCWQY.js";
import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  DynamicDrawUsage,
  Euler,
  Float32BufferAttribute,
  InstancedMesh,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
  Quaternion,
  Scene,
  SphereGeometry,
  Vector3
} from "./chunk-3IMG3JZT.js";
import {
  require_react
} from "./chunk-WFDAN2ZR.js";
import {
  __publicField,
  __toESM
} from "./chunk-624QZG55.js";

// node_modules/@react-three/cannon/dist/index.js
var import_react = __toESM(require_react());
var import_jsx_runtime = __toESM(require_jsx_runtime());
var events = { exports: {} };
var R = typeof Reflect === "object" ? Reflect : null;
var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;
if (R && typeof R.ownKeys === "function") {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys2(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys2(target) {
    return Object.getOwnPropertyNames(target);
  };
}
function ProcessEmitWarning(warning) {
  if (console && console.warn)
    console.warn(warning);
}
var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
  return value !== value;
};
function EventEmitter() {
  EventEmitter.init.call(this);
}
events.exports = EventEmitter;
events.exports.once = once2;
EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = void 0;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = void 0;
var defaultMaxListeners = 10;
function checkListener(listener) {
  if (typeof listener !== "function") {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}
Object.defineProperty(EventEmitter, "defaultMaxListeners", {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
    }
    defaultMaxListeners = arg;
  }
});
EventEmitter.init = function() {
  if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
    this._events = /* @__PURE__ */ Object.create(null);
    this._eventsCount = 0;
  }
  this._maxListeners = this._maxListeners || void 0;
};
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
  }
  this._maxListeners = n;
  return this;
};
function _getMaxListeners(that) {
  if (that._maxListeners === void 0)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}
EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};
EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++)
    args.push(arguments[i]);
  var doError = type === "error";
  var events2 = this._events;
  if (events2 !== void 0)
    doError = doError && events2.error === void 0;
  else if (!doError)
    return false;
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      throw er;
    }
    var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
    err.context = er;
    throw err;
  }
  var handler = events2[type];
  if (handler === void 0)
    return false;
  if (typeof handler === "function") {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners2 = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners2[i], this, args);
  }
  return true;
};
function _addListener(target, type, listener, prepend) {
  var m2;
  var events2;
  var existing;
  checkListener(listener);
  events2 = target._events;
  if (events2 === void 0) {
    events2 = target._events = /* @__PURE__ */ Object.create(null);
    target._eventsCount = 0;
  } else {
    if (events2.newListener !== void 0) {
      target.emit(
        "newListener",
        type,
        listener.listener ? listener.listener : listener
      );
      events2 = target._events;
    }
    existing = events2[type];
  }
  if (existing === void 0) {
    existing = events2[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === "function") {
      existing = events2[type] = prepend ? [listener, existing] : [existing, listener];
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }
    m2 = _getMaxListeners(target);
    if (m2 > 0 && existing.length > m2 && !existing.warned) {
      existing.warned = true;
      var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
      w.name = "MaxListenersExceededWarning";
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }
  return target;
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};
EventEmitter.prototype.on = EventEmitter.prototype.addListener;
EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};
function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}
function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: void 0, target, type, listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}
EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};
EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
};
EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events2, position, i, originalListener;
  checkListener(listener);
  events2 = this._events;
  if (events2 === void 0)
    return this;
  list = events2[type];
  if (list === void 0)
    return this;
  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0)
      this._events = /* @__PURE__ */ Object.create(null);
    else {
      delete events2[type];
      if (events2.removeListener)
        this.emit("removeListener", type, list.listener || listener);
    }
  } else if (typeof list !== "function") {
    position = -1;
    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }
    if (position < 0)
      return this;
    if (position === 0)
      list.shift();
    else {
      spliceOne(list, position);
    }
    if (list.length === 1)
      events2[type] = list[0];
    if (events2.removeListener !== void 0)
      this.emit("removeListener", type, originalListener || listener);
  }
  return this;
};
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners2, events2, i;
  events2 = this._events;
  if (events2 === void 0)
    return this;
  if (events2.removeListener === void 0) {
    if (arguments.length === 0) {
      this._events = /* @__PURE__ */ Object.create(null);
      this._eventsCount = 0;
    } else if (events2[type] !== void 0) {
      if (--this._eventsCount === 0)
        this._events = /* @__PURE__ */ Object.create(null);
      else
        delete events2[type];
    }
    return this;
  }
  if (arguments.length === 0) {
    var keys = Object.keys(events2);
    var key;
    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === "removeListener")
        continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners("removeListener");
    this._events = /* @__PURE__ */ Object.create(null);
    this._eventsCount = 0;
    return this;
  }
  listeners2 = events2[type];
  if (typeof listeners2 === "function") {
    this.removeListener(type, listeners2);
  } else if (listeners2 !== void 0) {
    for (i = listeners2.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners2[i]);
    }
  }
  return this;
};
function _listeners(target, type, unwrap) {
  var events2 = target._events;
  if (events2 === void 0)
    return [];
  var evlistener = events2[type];
  if (evlistener === void 0)
    return [];
  if (typeof evlistener === "function")
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}
EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};
EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};
EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === "function") {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};
EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events2 = this._events;
  if (events2 !== void 0) {
    var evlistener = events2[type];
    if (typeof evlistener === "function") {
      return 1;
    } else if (evlistener !== void 0) {
      return evlistener.length;
    }
  }
  return 0;
}
EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};
function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}
function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}
function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}
function once2(emitter, name) {
  return new Promise(function(resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }
    function resolver() {
      if (typeof emitter.removeListener === "function") {
        emitter.removeListener("error", errorListener);
      }
      resolve([].slice.call(arguments));
    }
    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== "error") {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}
function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === "function") {
    eventTargetAgnosticAddListener(emitter, "error", handler, flags);
  }
}
function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === "function") {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === "function") {
    emitter.addEventListener(name, function wrapListener(arg) {
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}
var EventEmitter$1 = events.exports;
function decodeBase64(base64, enableUnicode) {
  var binaryString = atob(base64);
  if (enableUnicode) {
    var binaryView = new Uint8Array(binaryString.length);
    for (var i = 0, n = binaryString.length; i < n; ++i) {
      binaryView[i] = binaryString.charCodeAt(i);
    }
    return String.fromCharCode.apply(null, new Uint16Array(binaryView.buffer));
  }
  return binaryString;
}
function createURL(base64, sourcemapArg, enableUnicodeArg) {
  var sourcemap = sourcemapArg === void 0 ? null : sourcemapArg;
  var enableUnicode = enableUnicodeArg === void 0 ? false : enableUnicodeArg;
  var source = decodeBase64(base64, enableUnicode);
  var start = source.indexOf("\n", 10) + 1;
  var body = source.substring(start) + (sourcemap ? "//# sourceMappingURL=" + sourcemap : "");
  var blob = new Blob([body], { type: "application/javascript" });
  return URL.createObjectURL(blob);
}
function createBase64WorkerFactory(base64, sourcemapArg, enableUnicodeArg) {
  var url;
  return function WorkerFactory2(options) {
    url = url || createURL(base64, sourcemapArg, enableUnicodeArg);
    return new Worker(url, options);
  };
}
var WorkerFactory = createBase64WorkerFactory("Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwooZnVuY3Rpb24gKCkgewogICd1c2Ugc3RyaWN0JzsKCiAgLyoqCiAgICogUmVjb3JkcyB3aGF0IG9iamVjdHMgYXJlIGNvbGxpZGluZyB3aXRoIGVhY2ggb3RoZXIKICAgKi8KCiAgLyoqCiAgICogQSAzeDMgbWF0cml4LgogICAqIEF1dGhvcmVkIGJ5IHtAbGluayBodHRwOi8vZ2l0aHViLmNvbS9zY2h0ZXBwZS8gc2NodGVwcGV9CiAgICovCiAgY2xhc3MgTWF0MyB7CiAgICAvKioKICAgICAqIEEgdmVjdG9yIG9mIGxlbmd0aCA5LCBjb250YWluaW5nIGFsbCBtYXRyaXggZWxlbWVudHMuCiAgICAgKi8KCiAgICAvKioKICAgICAqIEBwYXJhbSBlbGVtZW50cyBBIHZlY3RvciBvZiBsZW5ndGggOSwgY29udGFpbmluZyBhbGwgbWF0cml4IGVsZW1lbnRzLgogICAgICovCiAgICBjb25zdHJ1Y3RvcihlbGVtZW50cykgewogICAgICBpZiAoZWxlbWVudHMgPT09IHZvaWQgMCkgewogICAgICAgIGVsZW1lbnRzID0gWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdOwogICAgICB9CgogICAgICB0aGlzLmVsZW1lbnRzID0gZWxlbWVudHM7CiAgICB9CiAgICAvKioKICAgICAqIFNldHMgdGhlIG1hdHJpeCB0byBpZGVudGl0eQogICAgICogQHRvZG8gU2hvdWxkIHBlcmhhcHMgYmUgcmVuYW1lZCB0byBgc2V0SWRlbnRpdHkoKWAgdG8gYmUgbW9yZSBjbGVhci4KICAgICAqIEB0b2RvIENyZWF0ZSBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgaW1tZWRpYXRlbHkgY3JlYXRlcyBhbiBpZGVudGl0eSBtYXRyaXggZWcuIGBleWUoKWAKICAgICAqLwoKCiAgICBpZGVudGl0eSgpIHsKICAgICAgY29uc3QgZSA9IHRoaXMuZWxlbWVudHM7CiAgICAgIGVbMF0gPSAxOwogICAgICBlWzFdID0gMDsKICAgICAgZVsyXSA9IDA7CiAgICAgIGVbM10gPSAwOwogICAgICBlWzRdID0gMTsKICAgICAgZVs1XSA9IDA7CiAgICAgIGVbNl0gPSAwOwogICAgICBlWzddID0gMDsKICAgICAgZVs4XSA9IDE7CiAgICB9CiAgICAvKioKICAgICAqIFNldCBhbGwgZWxlbWVudHMgdG8gemVybwogICAgICovCgoKICAgIHNldFplcm8oKSB7CiAgICAgIGNvbnN0IGUgPSB0aGlzLmVsZW1lbnRzOwogICAgICBlWzBdID0gMDsKICAgICAgZVsxXSA9IDA7CiAgICAgIGVbMl0gPSAwOwogICAgICBlWzNdID0gMDsKICAgICAgZVs0XSA9IDA7CiAgICAgIGVbNV0gPSAwOwogICAgICBlWzZdID0gMDsKICAgICAgZVs3XSA9IDA7CiAgICAgIGVbOF0gPSAwOwogICAgfQogICAgLyoqCiAgICAgKiBTZXRzIHRoZSBtYXRyaXggZGlhZ29uYWwgZWxlbWVudHMgZnJvbSBhIFZlYzMKICAgICAqLwoKCiAgICBzZXRUcmFjZSh2ZWN0b3IpIHsKICAgICAgY29uc3QgZSA9IHRoaXMuZWxlbWVudHM7CiAgICAgIGVbMF0gPSB2ZWN0b3IueDsKICAgICAgZVs0XSA9IHZlY3Rvci55OwogICAgICBlWzhdID0gdmVjdG9yLno7CiAgICB9CiAgICAvKioKICAgICAqIEdldHMgdGhlIG1hdHJpeCBkaWFnb25hbCBlbGVtZW50cwogICAgICovCgoKICAgIGdldFRyYWNlKHRhcmdldCkgewogICAgICBpZiAodGFyZ2V0ID09PSB2b2lkIDApIHsKICAgICAgICB0YXJnZXQgPSBuZXcgVmVjMygpOwogICAgICB9CgogICAgICBjb25zdCBlID0gdGhpcy5lbGVtZW50czsKICAgICAgdGFyZ2V0LnggPSBlWzBdOwogICAgICB0YXJnZXQueSA9IGVbNF07CiAgICAgIHRhcmdldC56ID0gZVs4XTsKICAgICAgcmV0dXJuIHRhcmdldDsKICAgIH0KICAgIC8qKgogICAgICogTWF0cml4LVZlY3RvciBtdWx0aXBsaWNhdGlvbgogICAgICogQHBhcmFtIHYgVGhlIHZlY3RvciB0byBtdWx0aXBseSB3aXRoCiAgICAgKiBAcGFyYW0gdGFyZ2V0IE9wdGlvbmFsLCB0YXJnZXQgdG8gc2F2ZSB0aGUgcmVzdWx0IGluLgogICAgICovCgoKICAgIHZtdWx0KHYsIHRhcmdldCkgewogICAgICBpZiAodGFyZ2V0ID09PSB2b2lkIDApIHsKICAgICAgICB0YXJnZXQgPSBuZXcgVmVjMygpOwogICAgICB9CgogICAgICBjb25zdCBlID0gdGhpcy5lbGVtZW50czsKICAgICAgY29uc3QgeCA9IHYueDsKICAgICAgY29uc3QgeSA9IHYueTsKICAgICAgY29uc3QgeiA9IHYuejsKICAgICAgdGFyZ2V0LnggPSBlWzBdICogeCArIGVbMV0gKiB5ICsgZVsyXSAqIHo7CiAgICAgIHRhcmdldC55ID0gZVszXSAqIHggKyBlWzRdICogeSArIGVbNV0gKiB6OwogICAgICB0YXJnZXQueiA9IGVbNl0gKiB4ICsgZVs3XSAqIHkgKyBlWzhdICogejsKICAgICAgcmV0dXJuIHRhcmdldDsKICAgIH0KICAgIC8qKgogICAgICogTWF0cml4LXNjYWxhciBtdWx0aXBsaWNhdGlvbgogICAgICovCgoKICAgIHNtdWx0KHMpIHsKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgdGhpcy5lbGVtZW50c1tpXSAqPSBzOwogICAgICB9CiAgICB9CiAgICAvKioKICAgICAqIE1hdHJpeCBtdWx0aXBsaWNhdGlvbgogICAgICogQHBhcmFtIG1hdHJpeCBNYXRyaXggdG8gbXVsdGlwbHkgd2l0aCBmcm9tIGxlZnQgc2lkZS4KICAgICAqLwoKCiAgICBtbXVsdChtYXRyaXgsIHRhcmdldCkgewogICAgICBpZiAodGFyZ2V0ID09PSB2b2lkIDApIHsKICAgICAgICB0YXJnZXQgPSBuZXcgTWF0MygpOwogICAgICB9CgogICAgICBjb25zdCBBID0gdGhpcy5lbGVtZW50czsKICAgICAgY29uc3QgQiA9IG1hdHJpeC5lbGVtZW50czsKICAgICAgY29uc3QgVCA9IHRhcmdldC5lbGVtZW50czsKICAgICAgY29uc3QgYTExID0gQVswXSwKICAgICAgICAgICAgYTEyID0gQVsxXSwKICAgICAgICAgICAgYTEzID0gQVsyXSwKICAgICAgICAgICAgYTIxID0gQVszXSwKICAgICAgICAgICAgYTIyID0gQVs0XSwKICAgICAgICAgICAgYTIzID0gQVs1XSwKICAgICAgICAgICAgYTMxID0gQVs2XSwKICAgICAgICAgICAgYTMyID0gQVs3XSwKICAgICAgICAgICAgYTMzID0gQVs4XTsKICAgICAgY29uc3QgYjExID0gQlswXSwKICAgICAgICAgICAgYjEyID0gQlsxXSwKICAgICAgICAgICAgYjEzID0gQlsyXSwKICAgICAgICAgICAgYjIxID0gQlszXSwKICAgICAgICAgICAgYjIyID0gQls0XSwKICAgICAgICAgICAgYjIzID0gQls1XSwKICAgICAgICAgICAgYjMxID0gQls2XSwKICAgICAgICAgICAgYjMyID0gQls3XSwKICAgICAgICAgICAgYjMzID0gQls4XTsKICAgICAgVFswXSA9IGExMSAqIGIxMSArIGExMiAqIGIyMSArIGExMyAqIGIzMTsKICAgICAgVFsxXSA9IGExMSAqIGIxMiArIGExMiAqIGIyMiArIGExMyAqIGIzMjsKICAgICAgVFsyXSA9IGExMSAqIGIxMyArIGExMiAqIGIyMyArIGExMyAqIGIzMzsKICAgICAgVFszXSA9IGEyMSAqIGIxMSArIGEyMiAqIGIyMSArIGEyMyAqIGIzMTsKICAgICAgVFs0XSA9IGEyMSAqIGIxMiArIGEyMiAqIGIyMiArIGEyMyAqIGIzMjsKICAgICAgVFs1XSA9IGEyMSAqIGIxMyArIGEyMiAqIGIyMyArIGEyMyAqIGIzMzsKICAgICAgVFs2XSA9IGEzMSAqIGIxMSArIGEzMiAqIGIyMSArIGEzMyAqIGIzMTsKICAgICAgVFs3XSA9IGEzMSAqIGIxMiArIGEzMiAqIGIyMiArIGEzMyAqIGIzMjsKICAgICAgVFs4XSA9IGEzMSAqIGIxMyArIGEzMiAqIGIyMyArIGEzMyAqIGIzMzsKICAgICAgcmV0dXJuIHRhcmdldDsKICAgIH0KICAgIC8qKgogICAgICogU2NhbGUgZWFjaCBjb2x1bW4gb2YgdGhlIG1hdHJpeAogICAgICovCgoKICAgIHNjYWxlKHZlY3RvciwgdGFyZ2V0KSB7CiAgICAgIGlmICh0YXJnZXQgPT09IHZvaWQgMCkgewogICAgICAgIHRhcmdldCA9IG5ldyBNYXQzKCk7CiAgICAgIH0KCiAgICAgIGNvbnN0IGUgPSB0aGlzLmVsZW1lbnRzOwogICAgICBjb25zdCB0ID0gdGFyZ2V0LmVsZW1lbnRzOwoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgIT09IDM7IGkrKykgewogICAgICAgIHRbMyAqIGkgKyAwXSA9IHZlY3Rvci54ICogZVszICogaSArIDBdOwogICAgICAgIHRbMyAqIGkgKyAxXSA9IHZlY3Rvci55ICogZVszICogaSArIDFdOwogICAgICAgIHRbMyAqIGkgKyAyXSA9IHZlY3Rvci56ICogZVszICogaSArIDJdOwogICAgICB9CgogICAgICByZXR1cm4gdGFyZ2V0OwogICAgfQogICAgLyoqCiAgICAgKiBTb2x2ZSBBeD1iCiAgICAgKiBAcGFyYW0gYiBUaGUgcmlnaHQgaGFuZCBzaWRlCiAgICAgKiBAcGFyYW0gdGFyZ2V0IE9wdGlvbmFsLiBUYXJnZXQgdmVjdG9yIHRvIHNhdmUgaW4uCiAgICAgKiBAcmV0dXJuIFRoZSBzb2x1dGlvbiB4CiAgICAgKiBAdG9kbyBzaG91bGQgcmV1c2UgYXJyYXlzCiAgICAgKi8KCgogICAgc29sdmUoYiwgdGFyZ2V0KSB7CiAgICAgIGlmICh0YXJnZXQgPT09IHZvaWQgMCkgewogICAgICAgIHRhcmdldCA9IG5ldyBWZWMzKCk7CiAgICAgIH0KCiAgICAgIC8vIENvbnN0cnVjdCBlcXVhdGlvbnMKICAgICAgY29uc3QgbnIgPSAzOyAvLyBudW0gcm93cwoKICAgICAgY29uc3QgbmMgPSA0OyAvLyBudW0gY29scwoKICAgICAgY29uc3QgZXFucyA9IFtdOwogICAgICBsZXQgaTsKICAgICAgbGV0IGo7CgogICAgICBmb3IgKGkgPSAwOyBpIDwgbnIgKiBuYzsgaSsrKSB7CiAgICAgICAgZXFucy5wdXNoKDApOwogICAgICB9CgogICAgICBmb3IgKGkgPSAwOyBpIDwgMzsgaSsrKSB7CiAgICAgICAgZm9yIChqID0gMDsgaiA8IDM7IGorKykgewogICAgICAgICAgZXFuc1tpICsgbmMgKiBqXSA9IHRoaXMuZWxlbWVudHNbaSArIDMgKiBqXTsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIGVxbnNbMyArIDQgKiAwXSA9IGIueDsKICAgICAgZXFuc1szICsgNCAqIDFdID0gYi55OwogICAgICBlcW5zWzMgKyA0ICogMl0gPSBiLno7IC8vIENvbXB1dGUgcmlnaHQgdXBwZXIgdHJpYW5ndWxhciB2ZXJzaW9uIG9mIHRoZSBtYXRyaXggLSBHYXVzcyBlbGltaW5hdGlvbgoKICAgICAgbGV0IG4gPSAzOwogICAgICBjb25zdCBrID0gbjsKICAgICAgbGV0IG5wOwogICAgICBjb25zdCBrcCA9IDQ7IC8vIG51bSByb3dzCgogICAgICBsZXQgcDsKCiAgICAgIGRvIHsKICAgICAgICBpID0gayAtIG47CgogICAgICAgIGlmIChlcW5zW2kgKyBuYyAqIGldID09PSAwKSB7CiAgICAgICAgICAvLyB0aGUgcGl2b3QgaXMgbnVsbCwgc3dhcCBsaW5lcwogICAgICAgICAgZm9yIChqID0gaSArIDE7IGogPCBrOyBqKyspIHsKICAgICAgICAgICAgaWYgKGVxbnNbaSArIG5jICogal0gIT09IDApIHsKICAgICAgICAgICAgICBucCA9IGtwOwoKICAgICAgICAgICAgICBkbyB7CiAgICAgICAgICAgICAgICAvLyBkbyBsaWduZSggaSApID0gbGlnbmUoIGkgKSArIGxpZ25lKCBrICkKICAgICAgICAgICAgICAgIHAgPSBrcCAtIG5wOwogICAgICAgICAgICAgICAgZXFuc1twICsgbmMgKiBpXSArPSBlcW5zW3AgKyBuYyAqIGpdOwogICAgICAgICAgICAgIH0gd2hpbGUgKC0tbnApOwoKICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgfQogICAgICAgICAgfQogICAgICAgIH0KCiAgICAgICAgaWYgKGVxbnNbaSArIG5jICogaV0gIT09IDApIHsKICAgICAgICAgIGZvciAoaiA9IGkgKyAxOyBqIDwgazsgaisrKSB7CiAgICAgICAgICAgIGNvbnN0IG11bHRpcGxpZXIgPSBlcW5zW2kgKyBuYyAqIGpdIC8gZXFuc1tpICsgbmMgKiBpXTsKICAgICAgICAgICAgbnAgPSBrcDsKCiAgICAgICAgICAgIGRvIHsKICAgICAgICAgICAgICAvLyBkbyBsaWduZSggayApID0gbGlnbmUoIGsgKSAtIG11bHRpcGxpZXIgKiBsaWduZSggaSApCiAgICAgICAgICAgICAgcCA9IGtwIC0gbnA7CiAgICAgICAgICAgICAgZXFuc1twICsgbmMgKiBqXSA9IHAgPD0gaSA/IDAgOiBlcW5zW3AgKyBuYyAqIGpdIC0gZXFuc1twICsgbmMgKiBpXSAqIG11bHRpcGxpZXI7CiAgICAgICAgICAgIH0gd2hpbGUgKC0tbnApOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfSB3aGlsZSAoLS1uKTsgLy8gR2V0IHRoZSBzb2x1dGlvbgoKCiAgICAgIHRhcmdldC56ID0gZXFuc1syICogbmMgKyAzXSAvIGVxbnNbMiAqIG5jICsgMl07CiAgICAgIHRhcmdldC55ID0gKGVxbnNbMSAqIG5jICsgM10gLSBlcW5zWzEgKiBuYyArIDJdICogdGFyZ2V0LnopIC8gZXFuc1sxICogbmMgKyAxXTsKICAgICAgdGFyZ2V0LnggPSAoZXFuc1swICogbmMgKyAzXSAtIGVxbnNbMCAqIG5jICsgMl0gKiB0YXJnZXQueiAtIGVxbnNbMCAqIG5jICsgMV0gKiB0YXJnZXQueSkgLyBlcW5zWzAgKiBuYyArIDBdOwoKICAgICAgaWYgKGlzTmFOKHRhcmdldC54KSB8fCBpc05hTih0YXJnZXQueSkgfHwgaXNOYU4odGFyZ2V0LnopIHx8IHRhcmdldC54ID09PSBJbmZpbml0eSB8fCB0YXJnZXQueSA9PT0gSW5maW5pdHkgfHwgdGFyZ2V0LnogPT09IEluZmluaXR5KSB7CiAgICAgICAgdGhyb3cgYENvdWxkIG5vdCBzb2x2ZSBlcXVhdGlvbiEgR290IHg9WyR7dGFyZ2V0LnRvU3RyaW5nKCl9XSwgYj1bJHtiLnRvU3RyaW5nKCl9XSwgQT1bJHt0aGlzLnRvU3RyaW5nKCl9XWA7CiAgICAgIH0KCiAgICAgIHJldHVybiB0YXJnZXQ7CiAgICB9CiAgICAvKioKICAgICAqIEdldCBhbiBlbGVtZW50IGluIHRoZSBtYXRyaXggYnkgaW5kZXguIEluZGV4IHN0YXJ0cyBhdCAwLCBub3QgMSEhIQogICAgICogQHBhcmFtIHZhbHVlIElmIHByb3ZpZGVkLCB0aGUgbWF0cml4IGVsZW1lbnQgd2lsbCBiZSBzZXQgdG8gdGhpcyB2YWx1ZS4KICAgICAqLwoKCiAgICBlKHJvdywgY29sdW1uLCB2YWx1ZSkgewogICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkgewogICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnRzW2NvbHVtbiArIDMgKiByb3ddOwogICAgICB9IGVsc2UgewogICAgICAgIC8vIFNldCB2YWx1ZQogICAgICAgIHRoaXMuZWxlbWVudHNbY29sdW1uICsgMyAqIHJvd10gPSB2YWx1ZTsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBDb3B5IGFub3RoZXIgbWF0cml4IGludG8gdGhpcyBtYXRyaXggb2JqZWN0LgogICAgICovCgoKICAgIGNvcHkobWF0cml4KSB7CiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0cml4LmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgdGhpcy5lbGVtZW50c1tpXSA9IG1hdHJpeC5lbGVtZW50c1tpXTsKICAgICAgfQoKICAgICAgcmV0dXJuIHRoaXM7CiAgICB9CiAgICAvKioKICAgICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIG1hdHJpeC4KICAgICAqLwoKCiAgICB0b1N0cmluZygpIHsKICAgICAgbGV0IHIgPSAnJzsKICAgICAgY29uc3Qgc2VwID0gJywnOwoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHsKICAgICAgICByICs9IHRoaXMuZWxlbWVudHNbaV0gKyBzZXA7CiAgICAgIH0KCiAgICAgIHJldHVybiByOwogICAgfQogICAgLyoqCiAgICAgKiByZXZlcnNlIHRoZSBtYXRyaXgKICAgICAqIEBwYXJhbSB0YXJnZXQgVGFyZ2V0IG1hdHJpeCB0byBzYXZlIGluLgogICAgICogQHJldHVybiBUaGUgc29sdXRpb24geAogICAgICovCgoKICAgIHJldmVyc2UodGFyZ2V0KSB7CiAgICAgIGlmICh0YXJnZXQgPT09IHZvaWQgMCkgewogICAgICAgIHRhcmdldCA9IG5ldyBNYXQzKCk7CiAgICAgIH0KCiAgICAgIC8vIENvbnN0cnVjdCBlcXVhdGlvbnMKICAgICAgY29uc3QgbnIgPSAzOyAvLyBudW0gcm93cwoKICAgICAgY29uc3QgbmMgPSA2OyAvLyBudW0gY29scwoKICAgICAgY29uc3QgZXFucyA9IHJldmVyc2VfZXFuczsKICAgICAgbGV0IGk7CiAgICAgIGxldCBqOwoKICAgICAgZm9yIChpID0gMDsgaSA8IDM7IGkrKykgewogICAgICAgIGZvciAoaiA9IDA7IGogPCAzOyBqKyspIHsKICAgICAgICAgIGVxbnNbaSArIG5jICogal0gPSB0aGlzLmVsZW1lbnRzW2kgKyAzICogal07CiAgICAgICAgfQogICAgICB9CgogICAgICBlcW5zWzMgKyA2ICogMF0gPSAxOwogICAgICBlcW5zWzMgKyA2ICogMV0gPSAwOwogICAgICBlcW5zWzMgKyA2ICogMl0gPSAwOwogICAgICBlcW5zWzQgKyA2ICogMF0gPSAwOwogICAgICBlcW5zWzQgKyA2ICogMV0gPSAxOwogICAgICBlcW5zWzQgKyA2ICogMl0gPSAwOwogICAgICBlcW5zWzUgKyA2ICogMF0gPSAwOwogICAgICBlcW5zWzUgKyA2ICogMV0gPSAwOwogICAgICBlcW5zWzUgKyA2ICogMl0gPSAxOyAvLyBDb21wdXRlIHJpZ2h0IHVwcGVyIHRyaWFuZ3VsYXIgdmVyc2lvbiBvZiB0aGUgbWF0cml4IC0gR2F1c3MgZWxpbWluYXRpb24KCiAgICAgIGxldCBuID0gMzsKICAgICAgY29uc3QgayA9IG47CiAgICAgIGxldCBucDsKICAgICAgY29uc3Qga3AgPSBuYzsgLy8gbnVtIHJvd3MKCiAgICAgIGxldCBwOwoKICAgICAgZG8gewogICAgICAgIGkgPSBrIC0gbjsKCiAgICAgICAgaWYgKGVxbnNbaSArIG5jICogaV0gPT09IDApIHsKICAgICAgICAgIC8vIHRoZSBwaXZvdCBpcyBudWxsLCBzd2FwIGxpbmVzCiAgICAgICAgICBmb3IgKGogPSBpICsgMTsgaiA8IGs7IGorKykgewogICAgICAgICAgICBpZiAoZXFuc1tpICsgbmMgKiBqXSAhPT0gMCkgewogICAgICAgICAgICAgIG5wID0ga3A7CgogICAgICAgICAgICAgIGRvIHsKICAgICAgICAgICAgICAgIC8vIGRvIGxpbmUoIGkgKSA9IGxpbmUoIGkgKSArIGxpbmUoIGsgKQogICAgICAgICAgICAgICAgcCA9IGtwIC0gbnA7CiAgICAgICAgICAgICAgICBlcW5zW3AgKyBuYyAqIGldICs9IGVxbnNbcCArIG5jICogal07CiAgICAgICAgICAgICAgfSB3aGlsZSAoLS1ucCk7CgogICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgfQoKICAgICAgICBpZiAoZXFuc1tpICsgbmMgKiBpXSAhPT0gMCkgewogICAgICAgICAgZm9yIChqID0gaSArIDE7IGogPCBrOyBqKyspIHsKICAgICAgICAgICAgY29uc3QgbXVsdGlwbGllciA9IGVxbnNbaSArIG5jICogal0gLyBlcW5zW2kgKyBuYyAqIGldOwogICAgICAgICAgICBucCA9IGtwOwoKICAgICAgICAgICAgZG8gewogICAgICAgICAgICAgIC8vIGRvIGxpbmUoIGsgKSA9IGxpbmUoIGsgKSAtIG11bHRpcGxpZXIgKiBsaW5lKCBpICkKICAgICAgICAgICAgICBwID0ga3AgLSBucDsKICAgICAgICAgICAgICBlcW5zW3AgKyBuYyAqIGpdID0gcCA8PSBpID8gMCA6IGVxbnNbcCArIG5jICogal0gLSBlcW5zW3AgKyBuYyAqIGldICogbXVsdGlwbGllcjsKICAgICAgICAgICAgfSB3aGlsZSAoLS1ucCk7CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9IHdoaWxlICgtLW4pOyAvLyBlbGltaW5hdGUgdGhlIHVwcGVyIGxlZnQgdHJpYW5nbGUgb2YgdGhlIG1hdHJpeAoKCiAgICAgIGkgPSAyOwoKICAgICAgZG8gewogICAgICAgIGogPSBpIC0gMTsKCiAgICAgICAgZG8gewogICAgICAgICAgY29uc3QgbXVsdGlwbGllciA9IGVxbnNbaSArIG5jICogal0gLyBlcW5zW2kgKyBuYyAqIGldOwogICAgICAgICAgbnAgPSBuYzsKCiAgICAgICAgICBkbyB7CiAgICAgICAgICAgIHAgPSBuYyAtIG5wOwogICAgICAgICAgICBlcW5zW3AgKyBuYyAqIGpdID0gZXFuc1twICsgbmMgKiBqXSAtIGVxbnNbcCArIG5jICogaV0gKiBtdWx0aXBsaWVyOwogICAgICAgICAgfSB3aGlsZSAoLS1ucCk7CiAgICAgICAgfSB3aGlsZSAoai0tKTsKICAgICAgfSB3aGlsZSAoLS1pKTsgLy8gb3BlcmF0aW9ucyBvbiB0aGUgZGlhZ29uYWwKCgogICAgICBpID0gMjsKCiAgICAgIGRvIHsKICAgICAgICBjb25zdCBtdWx0aXBsaWVyID0gMSAvIGVxbnNbaSArIG5jICogaV07CiAgICAgICAgbnAgPSBuYzsKCiAgICAgICAgZG8gewogICAgICAgICAgcCA9IG5jIC0gbnA7CiAgICAgICAgICBlcW5zW3AgKyBuYyAqIGldID0gZXFuc1twICsgbmMgKiBpXSAqIG11bHRpcGxpZXI7CiAgICAgICAgfSB3aGlsZSAoLS1ucCk7CiAgICAgIH0gd2hpbGUgKGktLSk7CgogICAgICBpID0gMjsKCiAgICAgIGRvIHsKICAgICAgICBqID0gMjsKCiAgICAgICAgZG8gewogICAgICAgICAgcCA9IGVxbnNbbnIgKyBqICsgbmMgKiBpXTsKCiAgICAgICAgICBpZiAoaXNOYU4ocCkgfHwgcCA9PT0gSW5maW5pdHkpIHsKICAgICAgICAgICAgdGhyb3cgYENvdWxkIG5vdCByZXZlcnNlISBBPVske3RoaXMudG9TdHJpbmcoKX1dYDsKICAgICAgICAgIH0KCiAgICAgICAgICB0YXJnZXQuZShpLCBqLCBwKTsKICAgICAgICB9IHdoaWxlIChqLS0pOwogICAgICB9IHdoaWxlIChpLS0pOwoKICAgICAgcmV0dXJuIHRhcmdldDsKICAgIH0KICAgIC8qKgogICAgICogU2V0IHRoZSBtYXRyaXggZnJvbSBhIHF1YXRlcmlvbgogICAgICovCgoKICAgIHNldFJvdGF0aW9uRnJvbVF1YXRlcm5pb24ocSkgewogICAgICBjb25zdCB4ID0gcS54OwogICAgICBjb25zdCB5ID0gcS55OwogICAgICBjb25zdCB6ID0gcS56OwogICAgICBjb25zdCB3ID0gcS53OwogICAgICBjb25zdCB4MiA9IHggKyB4OwogICAgICBjb25zdCB5MiA9IHkgKyB5OwogICAgICBjb25zdCB6MiA9IHogKyB6OwogICAgICBjb25zdCB4eCA9IHggKiB4MjsKICAgICAgY29uc3QgeHkgPSB4ICogeTI7CiAgICAgIGNvbnN0IHh6ID0geCAqIHoyOwogICAgICBjb25zdCB5eSA9IHkgKiB5MjsKICAgICAgY29uc3QgeXogPSB5ICogejI7CiAgICAgIGNvbnN0IHp6ID0geiAqIHoyOwogICAgICBjb25zdCB3eCA9IHcgKiB4MjsKICAgICAgY29uc3Qgd3kgPSB3ICogeTI7CiAgICAgIGNvbnN0IHd6ID0gdyAqIHoyOwogICAgICBjb25zdCBlID0gdGhpcy5lbGVtZW50czsKICAgICAgZVszICogMCArIDBdID0gMSAtICh5eSArIHp6KTsKICAgICAgZVszICogMCArIDFdID0geHkgLSB3ejsKICAgICAgZVszICogMCArIDJdID0geHogKyB3eTsKICAgICAgZVszICogMSArIDBdID0geHkgKyB3ejsKICAgICAgZVszICogMSArIDFdID0gMSAtICh4eCArIHp6KTsKICAgICAgZVszICogMSArIDJdID0geXogLSB3eDsKICAgICAgZVszICogMiArIDBdID0geHogLSB3eTsKICAgICAgZVszICogMiArIDFdID0geXogKyB3eDsKICAgICAgZVszICogMiArIDJdID0gMSAtICh4eCArIHl5KTsKICAgICAgcmV0dXJuIHRoaXM7CiAgICB9CiAgICAvKioKICAgICAqIFRyYW5zcG9zZSB0aGUgbWF0cml4CiAgICAgKiBAcGFyYW0gdGFyZ2V0IE9wdGlvbmFsLiBXaGVyZSB0byBzdG9yZSB0aGUgcmVzdWx0LgogICAgICogQHJldHVybiBUaGUgdGFyZ2V0IE1hdDMsIG9yIGEgbmV3IE1hdDMgaWYgdGFyZ2V0IHdhcyBvbWl0dGVkLgogICAgICovCgoKICAgIHRyYW5zcG9zZSh0YXJnZXQpIHsKICAgICAgaWYgKHRhcmdldCA9PT0gdm9pZCAwKSB7CiAgICAgICAgdGFyZ2V0ID0gbmV3IE1hdDMoKTsKICAgICAgfQoKICAgICAgY29uc3QgTSA9IHRoaXMuZWxlbWVudHM7CiAgICAgIGNvbnN0IFQgPSB0YXJnZXQuZWxlbWVudHM7CiAgICAgIGxldCB0bXA7IC8vU2V0IGRpYWdvbmFscwoKICAgICAgVFswXSA9IE1bMF07CiAgICAgIFRbNF0gPSBNWzRdOwogICAgICBUWzhdID0gTVs4XTsKICAgICAgdG1wID0gTVsxXTsKICAgICAgVFsxXSA9IE1bM107CiAgICAgIFRbM10gPSB0bXA7CiAgICAgIHRtcCA9IE1bMl07CiAgICAgIFRbMl0gPSBNWzZdOwogICAgICBUWzZdID0gdG1wOwogICAgICB0bXAgPSBNWzVdOwogICAgICBUWzVdID0gTVs3XTsKICAgICAgVFs3XSA9IHRtcDsKICAgICAgcmV0dXJuIHRhcmdldDsKICAgIH0KCiAgfQogIGNvbnN0IHJldmVyc2VfZXFucyA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTsKCiAgLyoqCiAgICogMy1kaW1lbnNpb25hbCB2ZWN0b3IKICAgKiBAZXhhbXBsZQogICAqICAgICBjb25zdCB2ID0gbmV3IFZlYzMoMSwgMiwgMykKICAgKiAgICAgY29uc29sZS5sb2coJ3g9JyArIHYueCkgLy8geD0xCiAgICovCgogIGNsYXNzIFZlYzMgewogICAgY29uc3RydWN0b3IoeCwgeSwgeikgewogICAgICBpZiAoeCA9PT0gdm9pZCAwKSB7CiAgICAgICAgeCA9IDAuMDsKICAgICAgfQoKICAgICAgaWYgKHkgPT09IHZvaWQgMCkgewogICAgICAgIHkgPSAwLjA7CiAgICAgIH0KCiAgICAgIGlmICh6ID09PSB2b2lkIDApIHsKICAgICAgICB6ID0gMC4wOwogICAgICB9CgogICAgICB0aGlzLnggPSB4OwogICAgICB0aGlzLnkgPSB5OwogICAgICB0aGlzLnogPSB6OwogICAgfQogICAgLyoqCiAgICAgKiBWZWN0b3IgY3Jvc3MgcHJvZHVjdAogICAgICogQHBhcmFtIHRhcmdldCBPcHRpb25hbCB0YXJnZXQgdG8gc2F2ZSBpbi4KICAgICAqLwoKCiAgICBjcm9zcyh2ZWN0b3IsIHRhcmdldCkgewogICAgICBpZiAodGFyZ2V0ID09PSB2b2lkIDApIHsKICAgICAgICB0YXJnZXQgPSBuZXcgVmVjMygpOwogICAgICB9CgogICAgICBjb25zdCB2eCA9IHZlY3Rvci54OwogICAgICBjb25zdCB2eSA9IHZlY3Rvci55OwogICAgICBjb25zdCB2eiA9IHZlY3Rvci56OwogICAgICBjb25zdCB4ID0gdGhpcy54OwogICAgICBjb25zdCB5ID0gdGhpcy55OwogICAgICBjb25zdCB6ID0gdGhpcy56OwogICAgICB0YXJnZXQueCA9IHkgKiB2eiAtIHogKiB2eTsKICAgICAgdGFyZ2V0LnkgPSB6ICogdnggLSB4ICogdno7CiAgICAgIHRhcmdldC56ID0geCAqIHZ5IC0geSAqIHZ4OwogICAgICByZXR1cm4gdGFyZ2V0OwogICAgfQogICAgLyoqCiAgICAgKiBTZXQgdGhlIHZlY3RvcnMnIDMgZWxlbWVudHMKICAgICAqLwoKCiAgICBzZXQoeCwgeSwgeikgewogICAgICB0aGlzLnggPSB4OwogICAgICB0aGlzLnkgPSB5OwogICAgICB0aGlzLnogPSB6OwogICAgICByZXR1cm4gdGhpczsKICAgIH0KICAgIC8qKgogICAgICogU2V0IGFsbCBjb21wb25lbnRzIG9mIHRoZSB2ZWN0b3IgdG8gemVyby4KICAgICAqLwoKCiAgICBzZXRaZXJvKCkgewogICAgICB0aGlzLnggPSB0aGlzLnkgPSB0aGlzLnogPSAwOwogICAgfQogICAgLyoqCiAgICAgKiBWZWN0b3IgYWRkaXRpb24KICAgICAqLwoKCiAgICB2YWRkKHZlY3RvciwgdGFyZ2V0KSB7CiAgICAgIGlmICh0YXJnZXQpIHsKICAgICAgICB0YXJnZXQueCA9IHZlY3Rvci54ICsgdGhpcy54OwogICAgICAgIHRhcmdldC55ID0gdmVjdG9yLnkgKyB0aGlzLnk7CiAgICAgICAgdGFyZ2V0LnogPSB2ZWN0b3IueiArIHRoaXMuejsKICAgICAgfSBlbHNlIHsKICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy54ICsgdmVjdG9yLngsIHRoaXMueSArIHZlY3Rvci55LCB0aGlzLnogKyB2ZWN0b3Iueik7CiAgICAgIH0KICAgIH0KICAgIC8qKgogICAgICogVmVjdG9yIHN1YnRyYWN0aW9uCiAgICAgKiBAcGFyYW0gdGFyZ2V0IE9wdGlvbmFsIHRhcmdldCB0byBzYXZlIGluLgogICAgICovCgoKICAgIHZzdWIodmVjdG9yLCB0YXJnZXQpIHsKICAgICAgaWYgKHRhcmdldCkgewogICAgICAgIHRhcmdldC54ID0gdGhpcy54IC0gdmVjdG9yLng7CiAgICAgICAgdGFyZ2V0LnkgPSB0aGlzLnkgLSB2ZWN0b3IueTsKICAgICAgICB0YXJnZXQueiA9IHRoaXMueiAtIHZlY3Rvci56OwogICAgICB9IGVsc2UgewogICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLnggLSB2ZWN0b3IueCwgdGhpcy55IC0gdmVjdG9yLnksIHRoaXMueiAtIHZlY3Rvci56KTsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBHZXQgdGhlIGNyb3NzIHByb2R1Y3QgbWF0cml4IGFfY3Jvc3MgZnJvbSBhIHZlY3Rvciwgc3VjaCB0aGF0IGEgeCBiID0gYV9jcm9zcyAqIGIgPSBjCiAgICAgKgogICAgICogU2VlIHtAbGluayBodHRwczovL3d3dzguY3MudW11LnNlL2t1cnNlci9UREJEMjQvVlQwNi9sZWN0dXJlcy9MZWN0dXJlNi5wZGYgVW1lw6UgVW5pdmVyc2l0eSBMZWN0dXJlfQogICAgICovCgoKICAgIGNyb3NzbWF0KCkgewogICAgICByZXR1cm4gbmV3IE1hdDMoWzAsIC10aGlzLnosIHRoaXMueSwgdGhpcy56LCAwLCAtdGhpcy54LCAtdGhpcy55LCB0aGlzLngsIDBdKTsKICAgIH0KICAgIC8qKgogICAgICogTm9ybWFsaXplIHRoZSB2ZWN0b3IuIE5vdGUgdGhhdCB0aGlzIGNoYW5nZXMgdGhlIHZhbHVlcyBpbiB0aGUgdmVjdG9yLgogICAgICAqIEByZXR1cm4gUmV0dXJucyB0aGUgbm9ybSBvZiB0aGUgdmVjdG9yCiAgICAgKi8KCgogICAgbm9ybWFsaXplKCkgewogICAgICBjb25zdCB4ID0gdGhpcy54OwogICAgICBjb25zdCB5ID0gdGhpcy55OwogICAgICBjb25zdCB6ID0gdGhpcy56OwogICAgICBjb25zdCBuID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7CgogICAgICBpZiAobiA+IDAuMCkgewogICAgICAgIGNvbnN0IGludk4gPSAxIC8gbjsKICAgICAgICB0aGlzLnggKj0gaW52TjsKICAgICAgICB0aGlzLnkgKj0gaW52TjsKICAgICAgICB0aGlzLnogKj0gaW52TjsKICAgICAgfSBlbHNlIHsKICAgICAgICAvLyBNYWtlIHNvbWV0aGluZyB1cAogICAgICAgIHRoaXMueCA9IDA7CiAgICAgICAgdGhpcy55ID0gMDsKICAgICAgICB0aGlzLnogPSAwOwogICAgICB9CgogICAgICByZXR1cm4gbjsKICAgIH0KICAgIC8qKgogICAgICogR2V0IHRoZSB2ZXJzaW9uIG9mIHRoaXMgdmVjdG9yIHRoYXQgaXMgb2YgbGVuZ3RoIDEuCiAgICAgKiBAcGFyYW0gdGFyZ2V0IE9wdGlvbmFsIHRhcmdldCB0byBzYXZlIGluCiAgICAgKiBAcmV0dXJuIFJldHVybnMgdGhlIHVuaXQgdmVjdG9yCiAgICAgKi8KCgogICAgdW5pdCh0YXJnZXQpIHsKICAgICAgaWYgKHRhcmdldCA9PT0gdm9pZCAwKSB7CiAgICAgICAgdGFyZ2V0ID0gbmV3IFZlYzMoKTsKICAgICAgfQoKICAgICAgY29uc3QgeCA9IHRoaXMueDsKICAgICAgY29uc3QgeSA9IHRoaXMueTsKICAgICAgY29uc3QgeiA9IHRoaXMuejsKICAgICAgbGV0IG5pbnYgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTsKCiAgICAgIGlmIChuaW52ID4gMC4wKSB7CiAgICAgICAgbmludiA9IDEuMCAvIG5pbnY7CiAgICAgICAgdGFyZ2V0LnggPSB4ICogbmludjsKICAgICAgICB0YXJnZXQueSA9IHkgKiBuaW52OwogICAgICAgIHRhcmdldC56ID0geiAqIG5pbnY7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgdGFyZ2V0LnggPSAxOwogICAgICAgIHRhcmdldC55ID0gMDsKICAgICAgICB0YXJnZXQueiA9IDA7CiAgICAgIH0KCiAgICAgIHJldHVybiB0YXJnZXQ7CiAgICB9CiAgICAvKioKICAgICAqIEdldCB0aGUgbGVuZ3RoIG9mIHRoZSB2ZWN0b3IKICAgICAqLwoKCiAgICBsZW5ndGgoKSB7CiAgICAgIGNvbnN0IHggPSB0aGlzLng7CiAgICAgIGNvbnN0IHkgPSB0aGlzLnk7CiAgICAgIGNvbnN0IHogPSB0aGlzLno7CiAgICAgIHJldHVybiBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTsKICAgIH0KICAgIC8qKgogICAgICogR2V0IHRoZSBzcXVhcmVkIGxlbmd0aCBvZiB0aGUgdmVjdG9yLgogICAgICovCgoKICAgIGxlbmd0aFNxdWFyZWQoKSB7CiAgICAgIHJldHVybiB0aGlzLmRvdCh0aGlzKTsKICAgIH0KICAgIC8qKgogICAgICogR2V0IGRpc3RhbmNlIGZyb20gdGhpcyBwb2ludCB0byBhbm90aGVyIHBvaW50CiAgICAgKi8KCgogICAgZGlzdGFuY2VUbyhwKSB7CiAgICAgIGNvbnN0IHggPSB0aGlzLng7CiAgICAgIGNvbnN0IHkgPSB0aGlzLnk7CiAgICAgIGNvbnN0IHogPSB0aGlzLno7CiAgICAgIGNvbnN0IHB4ID0gcC54OwogICAgICBjb25zdCBweSA9IHAueTsKICAgICAgY29uc3QgcHogPSBwLno7CiAgICAgIHJldHVybiBNYXRoLnNxcnQoKHB4IC0geCkgKiAocHggLSB4KSArIChweSAtIHkpICogKHB5IC0geSkgKyAocHogLSB6KSAqIChweiAtIHopKTsKICAgIH0KICAgIC8qKgogICAgICogR2V0IHNxdWFyZWQgZGlzdGFuY2UgZnJvbSB0aGlzIHBvaW50IHRvIGFub3RoZXIgcG9pbnQKICAgICAqLwoKCiAgICBkaXN0YW5jZVNxdWFyZWQocCkgewogICAgICBjb25zdCB4ID0gdGhpcy54OwogICAgICBjb25zdCB5ID0gdGhpcy55OwogICAgICBjb25zdCB6ID0gdGhpcy56OwogICAgICBjb25zdCBweCA9IHAueDsKICAgICAgY29uc3QgcHkgPSBwLnk7CiAgICAgIGNvbnN0IHB6ID0gcC56OwogICAgICByZXR1cm4gKHB4IC0geCkgKiAocHggLSB4KSArIChweSAtIHkpICogKHB5IC0geSkgKyAocHogLSB6KSAqIChweiAtIHopOwogICAgfQogICAgLyoqCiAgICAgKiBNdWx0aXBseSBhbGwgdGhlIGNvbXBvbmVudHMgb2YgdGhlIHZlY3RvciB3aXRoIGEgc2NhbGFyLgogICAgICogQHBhcmFtIHRhcmdldCBUaGUgdmVjdG9yIHRvIHNhdmUgdGhlIHJlc3VsdCBpbi4KICAgICAqLwoKCiAgICBzY2FsZShzY2FsYXIsIHRhcmdldCkgewogICAgICBpZiAodGFyZ2V0ID09PSB2b2lkIDApIHsKICAgICAgICB0YXJnZXQgPSBuZXcgVmVjMygpOwogICAgICB9CgogICAgICBjb25zdCB4ID0gdGhpcy54OwogICAgICBjb25zdCB5ID0gdGhpcy55OwogICAgICBjb25zdCB6ID0gdGhpcy56OwogICAgICB0YXJnZXQueCA9IHNjYWxhciAqIHg7CiAgICAgIHRhcmdldC55ID0gc2NhbGFyICogeTsKICAgICAgdGFyZ2V0LnogPSBzY2FsYXIgKiB6OwogICAgICByZXR1cm4gdGFyZ2V0OwogICAgfQogICAgLyoqCiAgICAgKiBNdWx0aXBseSB0aGUgdmVjdG9yIHdpdGggYW4gb3RoZXIgdmVjdG9yLCBjb21wb25lbnQtd2lzZS4KICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIHZlY3RvciB0byBzYXZlIHRoZSByZXN1bHQgaW4uCiAgICAgKi8KCgogICAgdm11bCh2ZWN0b3IsIHRhcmdldCkgewogICAgICBpZiAodGFyZ2V0ID09PSB2b2lkIDApIHsKICAgICAgICB0YXJnZXQgPSBuZXcgVmVjMygpOwogICAgICB9CgogICAgICB0YXJnZXQueCA9IHZlY3Rvci54ICogdGhpcy54OwogICAgICB0YXJnZXQueSA9IHZlY3Rvci55ICogdGhpcy55OwogICAgICB0YXJnZXQueiA9IHZlY3Rvci56ICogdGhpcy56OwogICAgICByZXR1cm4gdGFyZ2V0OwogICAgfQogICAgLyoqCiAgICAgKiBTY2FsZSBhIHZlY3RvciBhbmQgYWRkIGl0IHRvIHRoaXMgdmVjdG9yLiBTYXZlIHRoZSByZXN1bHQgaW4gInRhcmdldCIuICh0YXJnZXQgPSB0aGlzICsgdmVjdG9yICogc2NhbGFyKQogICAgICogQHBhcmFtIHRhcmdldCBUaGUgdmVjdG9yIHRvIHNhdmUgdGhlIHJlc3VsdCBpbi4KICAgICAqLwoKCiAgICBhZGRTY2FsZWRWZWN0b3Ioc2NhbGFyLCB2ZWN0b3IsIHRhcmdldCkgewogICAgICBpZiAodGFyZ2V0ID09PSB2b2lkIDApIHsKICAgICAgICB0YXJnZXQgPSBuZXcgVmVjMygpOwogICAgICB9CgogICAgICB0YXJnZXQueCA9IHRoaXMueCArIHNjYWxhciAqIHZlY3Rvci54OwogICAgICB0YXJnZXQueSA9IHRoaXMueSArIHNjYWxhciAqIHZlY3Rvci55OwogICAgICB0YXJnZXQueiA9IHRoaXMueiArIHNjYWxhciAqIHZlY3Rvci56OwogICAgICByZXR1cm4gdGFyZ2V0OwogICAgfQogICAgLyoqCiAgICAgKiBDYWxjdWxhdGUgZG90IHByb2R1Y3QKICAgICAqIEBwYXJhbSB2ZWN0b3IKICAgICAqLwoKCiAgICBkb3QodmVjdG9yKSB7CiAgICAgIHJldHVybiB0aGlzLnggKiB2ZWN0b3IueCArIHRoaXMueSAqIHZlY3Rvci55ICsgdGhpcy56ICogdmVjdG9yLno7CiAgICB9CgogICAgaXNaZXJvKCkgewogICAgICByZXR1cm4gdGhpcy54ID09PSAwICYmIHRoaXMueSA9PT0gMCAmJiB0aGlzLnogPT09IDA7CiAgICB9CiAgICAvKioKICAgICAqIE1ha2UgdGhlIHZlY3RvciBwb2ludCBpbiB0aGUgb3Bwb3NpdGUgZGlyZWN0aW9uLgogICAgICogQHBhcmFtIHRhcmdldCBPcHRpb25hbCB0YXJnZXQgdG8gc2F2ZSBpbgogICAgICovCgoKICAgIG5lZ2F0ZSh0YXJnZXQpIHsKICAgICAgaWYgKHRhcmdldCA9PT0gdm9pZCAwKSB7CiAgICAgICAgdGFyZ2V0ID0gbmV3IFZlYzMoKTsKICAgICAgfQoKICAgICAgdGFyZ2V0LnggPSAtdGhpcy54OwogICAgICB0YXJnZXQueSA9IC10aGlzLnk7CiAgICAgIHRhcmdldC56ID0gLXRoaXMuejsKICAgICAgcmV0dXJuIHRhcmdldDsKICAgIH0KICAgIC8qKgogICAgICogQ29tcHV0ZSB0d28gYXJ0aWZpY2lhbCB0YW5nZW50cyB0byB0aGUgdmVjdG9yCiAgICAgKiBAcGFyYW0gdDEgVmVjdG9yIG9iamVjdCB0byBzYXZlIHRoZSBmaXJzdCB0YW5nZW50IGluCiAgICAgKiBAcGFyYW0gdDIgVmVjdG9yIG9iamVjdCB0byBzYXZlIHRoZSBzZWNvbmQgdGFuZ2VudCBpbgogICAgICovCgoKICAgIHRhbmdlbnRzKHQxLCB0MikgewogICAgICBjb25zdCBub3JtID0gdGhpcy5sZW5ndGgoKTsKCiAgICAgIGlmIChub3JtID4gMC4wKSB7CiAgICAgICAgY29uc3QgbiA9IFZlYzNfdGFuZ2VudHNfbjsKICAgICAgICBjb25zdCBpbm9ybSA9IDEgLyBub3JtOwogICAgICAgIG4uc2V0KHRoaXMueCAqIGlub3JtLCB0aGlzLnkgKiBpbm9ybSwgdGhpcy56ICogaW5vcm0pOwogICAgICAgIGNvbnN0IHJhbmRWZWMgPSBWZWMzX3RhbmdlbnRzX3JhbmRWZWM7CgogICAgICAgIGlmIChNYXRoLmFicyhuLngpIDwgMC45KSB7CiAgICAgICAgICByYW5kVmVjLnNldCgxLCAwLCAwKTsKICAgICAgICAgIG4uY3Jvc3MocmFuZFZlYywgdDEpOwogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICByYW5kVmVjLnNldCgwLCAxLCAwKTsKICAgICAgICAgIG4uY3Jvc3MocmFuZFZlYywgdDEpOwogICAgICAgIH0KCiAgICAgICAgbi5jcm9zcyh0MSwgdDIpOwogICAgICB9IGVsc2UgewogICAgICAgIC8vIFRoZSBub3JtYWwgbGVuZ3RoIGlzIHplcm8sIG1ha2Ugc29tZXRoaW5nIHVwCiAgICAgICAgdDEuc2V0KDEsIDAsIDApOwogICAgICAgIHQyLnNldCgwLCAxLCAwKTsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBDb252ZXJ0cyB0byBhIG1vcmUgcmVhZGFibGUgZm9ybWF0CiAgICAgKi8KCgogICAgdG9TdHJpbmcoKSB7CiAgICAgIHJldHVybiBgJHt0aGlzLnh9LCR7dGhpcy55fSwke3RoaXMuen1gOwogICAgfQogICAgLyoqCiAgICAgKiBDb252ZXJ0cyB0byBhbiBhcnJheQogICAgICovCgoKICAgIHRvQXJyYXkoKSB7CiAgICAgIHJldHVybiBbdGhpcy54LCB0aGlzLnksIHRoaXMuel07CiAgICB9CiAgICAvKioKICAgICAqIENvcGllcyB2YWx1ZSBvZiBzb3VyY2UgdG8gdGhpcyB2ZWN0b3IuCiAgICAgKi8KCgogICAgY29weSh2ZWN0b3IpIHsKICAgICAgdGhpcy54ID0gdmVjdG9yLng7CiAgICAgIHRoaXMueSA9IHZlY3Rvci55OwogICAgICB0aGlzLnogPSB2ZWN0b3IuejsKICAgICAgcmV0dXJuIHRoaXM7CiAgICB9CiAgICAvKioKICAgICAqIERvIGEgbGluZWFyIGludGVycG9sYXRpb24gYmV0d2VlbiB0d28gdmVjdG9ycwogICAgICogQHBhcmFtIHQgQSBudW1iZXIgYmV0d2VlbiAwIGFuZCAxLiAwIHdpbGwgbWFrZSB0aGlzIGZ1bmN0aW9uIHJldHVybiB1LCBhbmQgMSB3aWxsIG1ha2UgaXQgcmV0dXJuIHYuIE51bWJlcnMgaW4gYmV0d2VlbiB3aWxsIGdlbmVyYXRlIGEgdmVjdG9yIGluIGJldHdlZW4gdGhlbS4KICAgICAqLwoKCiAgICBsZXJwKHZlY3RvciwgdCwgdGFyZ2V0KSB7CiAgICAgIGNvbnN0IHggPSB0aGlzLng7CiAgICAgIGNvbnN0IHkgPSB0aGlzLnk7CiAgICAgIGNvbnN0IHogPSB0aGlzLno7CiAgICAgIHRhcmdldC54ID0geCArICh2ZWN0b3IueCAtIHgpICogdDsKICAgICAgdGFyZ2V0LnkgPSB5ICsgKHZlY3Rvci55IC0geSkgKiB0OwogICAgICB0YXJnZXQueiA9IHogKyAodmVjdG9yLnogLSB6KSAqIHQ7CiAgICB9CiAgICAvKioKICAgICAqIENoZWNrIGlmIGEgdmVjdG9yIGVxdWFscyBpcyBhbG1vc3QgZXF1YWwgdG8gYW5vdGhlciBvbmUuCiAgICAgKi8KCgogICAgYWxtb3N0RXF1YWxzKHZlY3RvciwgcHJlY2lzaW9uKSB7CiAgICAgIGlmIChwcmVjaXNpb24gPT09IHZvaWQgMCkgewogICAgICAgIHByZWNpc2lvbiA9IDFlLTY7CiAgICAgIH0KCiAgICAgIGlmIChNYXRoLmFicyh0aGlzLnggLSB2ZWN0b3IueCkgPiBwcmVjaXNpb24gfHwgTWF0aC5hYnModGhpcy55IC0gdmVjdG9yLnkpID4gcHJlY2lzaW9uIHx8IE1hdGguYWJzKHRoaXMueiAtIHZlY3Rvci56KSA+IHByZWNpc2lvbikgewogICAgICAgIHJldHVybiBmYWxzZTsKICAgICAgfQoKICAgICAgcmV0dXJuIHRydWU7CiAgICB9CiAgICAvKioKICAgICAqIENoZWNrIGlmIGEgdmVjdG9yIGlzIGFsbW9zdCB6ZXJvCiAgICAgKi8KCgogICAgYWxtb3N0WmVybyhwcmVjaXNpb24pIHsKICAgICAgaWYgKHByZWNpc2lvbiA9PT0gdm9pZCAwKSB7CiAgICAgICAgcHJlY2lzaW9uID0gMWUtNjsKICAgICAgfQoKICAgICAgaWYgKE1hdGguYWJzKHRoaXMueCkgPiBwcmVjaXNpb24gfHwgTWF0aC5hYnModGhpcy55KSA+IHByZWNpc2lvbiB8fCBNYXRoLmFicyh0aGlzLnopID4gcHJlY2lzaW9uKSB7CiAgICAgICAgcmV0dXJuIGZhbHNlOwogICAgICB9CgogICAgICByZXR1cm4gdHJ1ZTsKICAgIH0KICAgIC8qKgogICAgICogQ2hlY2sgaWYgdGhlIHZlY3RvciBpcyBhbnRpLXBhcmFsbGVsIHRvIGFub3RoZXIgdmVjdG9yLgogICAgICogQHBhcmFtIHByZWNpc2lvbiBTZXQgdG8gemVybyBmb3IgZXhhY3QgY29tcGFyaXNvbnMKICAgICAqLwoKCiAgICBpc0FudGlwYXJhbGxlbFRvKHZlY3RvciwgcHJlY2lzaW9uKSB7CiAgICAgIHRoaXMubmVnYXRlKGFudGlwX25lZyk7CiAgICAgIHJldHVybiBhbnRpcF9uZWcuYWxtb3N0RXF1YWxzKHZlY3RvciwgcHJlY2lzaW9uKTsKICAgIH0KICAgIC8qKgogICAgICogQ2xvbmUgdGhlIHZlY3RvcgogICAgICovCgoKICAgIGNsb25lKCkgewogICAgICByZXR1cm4gbmV3IFZlYzModGhpcy54LCB0aGlzLnksIHRoaXMueik7CiAgICB9CgogIH0KICBWZWMzLlpFUk8gPSBuZXcgVmVjMygwLCAwLCAwKTsKICBWZWMzLlVOSVRfWCA9IG5ldyBWZWMzKDEsIDAsIDApOwogIFZlYzMuVU5JVF9ZID0gbmV3IFZlYzMoMCwgMSwgMCk7CiAgVmVjMy5VTklUX1ogPSBuZXcgVmVjMygwLCAwLCAxKTsKICBjb25zdCBWZWMzX3RhbmdlbnRzX24gPSBuZXcgVmVjMygpOwogIGNvbnN0IFZlYzNfdGFuZ2VudHNfcmFuZFZlYyA9IG5ldyBWZWMzKCk7CiAgY29uc3QgYW50aXBfbmVnID0gbmV3IFZlYzMoKTsKCiAgLyoqCiAgICogQXhpcyBhbGlnbmVkIGJvdW5kaW5nIGJveCBjbGFzcy4KICAgKi8KICBjbGFzcyBBQUJCIHsKICAgIC8qKgogICAgICogVGhlIGxvd2VyIGJvdW5kIG9mIHRoZSBib3VuZGluZyBib3gKICAgICAqLwoKICAgIC8qKgogICAgICogVGhlIHVwcGVyIGJvdW5kIG9mIHRoZSBib3VuZGluZyBib3gKICAgICAqLwogICAgY29uc3RydWN0b3Iob3B0aW9ucykgewogICAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7CiAgICAgICAgb3B0aW9ucyA9IHt9OwogICAgICB9CgogICAgICB0aGlzLmxvd2VyQm91bmQgPSBuZXcgVmVjMygpOwogICAgICB0aGlzLnVwcGVyQm91bmQgPSBuZXcgVmVjMygpOwoKICAgICAgaWYgKG9wdGlvbnMubG93ZXJCb3VuZCkgewogICAgICAgIHRoaXMubG93ZXJCb3VuZC5jb3B5KG9wdGlvbnMubG93ZXJCb3VuZCk7CiAgICAgIH0KCiAgICAgIGlmIChvcHRpb25zLnVwcGVyQm91bmQpIHsKICAgICAgICB0aGlzLnVwcGVyQm91bmQuY29weShvcHRpb25zLnVwcGVyQm91bmQpOwogICAgICB9CiAgICB9CiAgICAvKioKICAgICAqIFNldCB0aGUgQUFCQiBib3VuZHMgZnJvbSBhIHNldCBvZiBwb2ludHMuCiAgICAgKiBAcGFyYW0gcG9pbnRzIEFuIGFycmF5IG9mIFZlYzMncy4KICAgICAqIEByZXR1cm4gVGhlIHNlbGYgb2JqZWN0CiAgICAgKi8KCgogICAgc2V0RnJvbVBvaW50cyhwb2ludHMsIHBvc2l0aW9uLCBxdWF0ZXJuaW9uLCBza2luU2l6ZSkgewogICAgICBjb25zdCBsID0gdGhpcy5sb3dlckJvdW5kOwogICAgICBjb25zdCB1ID0gdGhpcy51cHBlckJvdW5kOwogICAgICBjb25zdCBxID0gcXVhdGVybmlvbjsgLy8gU2V0IHRvIHRoZSBmaXJzdCBwb2ludAoKICAgICAgbC5jb3B5KHBvaW50c1swXSk7CgogICAgICBpZiAocSkgewogICAgICAgIHEudm11bHQobCwgbCk7CiAgICAgIH0KCiAgICAgIHUuY29weShsKTsKCiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgbGV0IHAgPSBwb2ludHNbaV07CgogICAgICAgIGlmIChxKSB7CiAgICAgICAgICBxLnZtdWx0KHAsIHRtcCQxKTsKICAgICAgICAgIHAgPSB0bXAkMTsKICAgICAgICB9CgogICAgICAgIGlmIChwLnggPiB1LngpIHsKICAgICAgICAgIHUueCA9IHAueDsKICAgICAgICB9CgogICAgICAgIGlmIChwLnggPCBsLngpIHsKICAgICAgICAgIGwueCA9IHAueDsKICAgICAgICB9CgogICAgICAgIGlmIChwLnkgPiB1LnkpIHsKICAgICAgICAgIHUueSA9IHAueTsKICAgICAgICB9CgogICAgICAgIGlmIChwLnkgPCBsLnkpIHsKICAgICAgICAgIGwueSA9IHAueTsKICAgICAgICB9CgogICAgICAgIGlmIChwLnogPiB1LnopIHsKICAgICAgICAgIHUueiA9IHAuejsKICAgICAgICB9CgogICAgICAgIGlmIChwLnogPCBsLnopIHsKICAgICAgICAgIGwueiA9IHAuejsKICAgICAgICB9CiAgICAgIH0gLy8gQWRkIG9mZnNldAoKCiAgICAgIGlmIChwb3NpdGlvbikgewogICAgICAgIHBvc2l0aW9uLnZhZGQobCwgbCk7CiAgICAgICAgcG9zaXRpb24udmFkZCh1LCB1KTsKICAgICAgfQoKICAgICAgaWYgKHNraW5TaXplKSB7CiAgICAgICAgbC54IC09IHNraW5TaXplOwogICAgICAgIGwueSAtPSBza2luU2l6ZTsKICAgICAgICBsLnogLT0gc2tpblNpemU7CiAgICAgICAgdS54ICs9IHNraW5TaXplOwogICAgICAgIHUueSArPSBza2luU2l6ZTsKICAgICAgICB1LnogKz0gc2tpblNpemU7CiAgICAgIH0KCiAgICAgIHJldHVybiB0aGlzOwogICAgfQogICAgLyoqCiAgICAgKiBDb3B5IGJvdW5kcyBmcm9tIGFuIEFBQkIgdG8gdGhpcyBBQUJCCiAgICAgKiBAcGFyYW0gYWFiYiBTb3VyY2UgdG8gY29weSBmcm9tCiAgICAgKiBAcmV0dXJuIFRoZSB0aGlzIG9iamVjdCwgZm9yIGNoYWluYWJpbGl0eQogICAgICovCgoKICAgIGNvcHkoYWFiYikgewogICAgICB0aGlzLmxvd2VyQm91bmQuY29weShhYWJiLmxvd2VyQm91bmQpOwogICAgICB0aGlzLnVwcGVyQm91bmQuY29weShhYWJiLnVwcGVyQm91bmQpOwogICAgICByZXR1cm4gdGhpczsKICAgIH0KICAgIC8qKgogICAgICogQ2xvbmUgYW4gQUFCQgogICAgICovCgoKICAgIGNsb25lKCkgewogICAgICByZXR1cm4gbmV3IEFBQkIoKS5jb3B5KHRoaXMpOwogICAgfQogICAgLyoqCiAgICAgKiBFeHRlbmQgdGhpcyBBQUJCIHNvIHRoYXQgaXQgY292ZXJzIHRoZSBnaXZlbiBBQUJCIHRvby4KICAgICAqLwoKCiAgICBleHRlbmQoYWFiYikgewogICAgICB0aGlzLmxvd2VyQm91bmQueCA9IE1hdGgubWluKHRoaXMubG93ZXJCb3VuZC54LCBhYWJiLmxvd2VyQm91bmQueCk7CiAgICAgIHRoaXMudXBwZXJCb3VuZC54ID0gTWF0aC5tYXgodGhpcy51cHBlckJvdW5kLngsIGFhYmIudXBwZXJCb3VuZC54KTsKICAgICAgdGhpcy5sb3dlckJvdW5kLnkgPSBNYXRoLm1pbih0aGlzLmxvd2VyQm91bmQueSwgYWFiYi5sb3dlckJvdW5kLnkpOwogICAgICB0aGlzLnVwcGVyQm91bmQueSA9IE1hdGgubWF4KHRoaXMudXBwZXJCb3VuZC55LCBhYWJiLnVwcGVyQm91bmQueSk7CiAgICAgIHRoaXMubG93ZXJCb3VuZC56ID0gTWF0aC5taW4odGhpcy5sb3dlckJvdW5kLnosIGFhYmIubG93ZXJCb3VuZC56KTsKICAgICAgdGhpcy51cHBlckJvdW5kLnogPSBNYXRoLm1heCh0aGlzLnVwcGVyQm91bmQueiwgYWFiYi51cHBlckJvdW5kLnopOwogICAgfQogICAgLyoqCiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIEFBQkIgb3ZlcmxhcHMgdGhpcyBBQUJCLgogICAgICovCgoKICAgIG92ZXJsYXBzKGFhYmIpIHsKICAgICAgY29uc3QgbDEgPSB0aGlzLmxvd2VyQm91bmQ7CiAgICAgIGNvbnN0IHUxID0gdGhpcy51cHBlckJvdW5kOwogICAgICBjb25zdCBsMiA9IGFhYmIubG93ZXJCb3VuZDsKICAgICAgY29uc3QgdTIgPSBhYWJiLnVwcGVyQm91bmQ7IC8vICAgICAgbDIgICAgICAgIHUyCiAgICAgIC8vICAgICAgfC0tLS0tLS0tLXwKICAgICAgLy8gfC0tLS0tLS0tfAogICAgICAvLyBsMSAgICAgICB1MQoKICAgICAgY29uc3Qgb3ZlcmxhcHNYID0gbDIueCA8PSB1MS54ICYmIHUxLnggPD0gdTIueCB8fCBsMS54IDw9IHUyLnggJiYgdTIueCA8PSB1MS54OwogICAgICBjb25zdCBvdmVybGFwc1kgPSBsMi55IDw9IHUxLnkgJiYgdTEueSA8PSB1Mi55IHx8IGwxLnkgPD0gdTIueSAmJiB1Mi55IDw9IHUxLnk7CiAgICAgIGNvbnN0IG92ZXJsYXBzWiA9IGwyLnogPD0gdTEueiAmJiB1MS56IDw9IHUyLnogfHwgbDEueiA8PSB1Mi56ICYmIHUyLnogPD0gdTEuejsKICAgICAgcmV0dXJuIG92ZXJsYXBzWCAmJiBvdmVybGFwc1kgJiYgb3ZlcmxhcHNaOwogICAgfSAvLyBNb3N0bHkgZm9yIGRlYnVnZ2luZwoKCiAgICB2b2x1bWUoKSB7CiAgICAgIGNvbnN0IGwgPSB0aGlzLmxvd2VyQm91bmQ7CiAgICAgIGNvbnN0IHUgPSB0aGlzLnVwcGVyQm91bmQ7CiAgICAgIHJldHVybiAodS54IC0gbC54KSAqICh1LnkgLSBsLnkpICogKHUueiAtIGwueik7CiAgICB9CiAgICAvKioKICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gQUFCQiBpcyBmdWxseSBjb250YWluZWQgaW4gdGhpcyBBQUJCLgogICAgICovCgoKICAgIGNvbnRhaW5zKGFhYmIpIHsKICAgICAgY29uc3QgbDEgPSB0aGlzLmxvd2VyQm91bmQ7CiAgICAgIGNvbnN0IHUxID0gdGhpcy51cHBlckJvdW5kOwogICAgICBjb25zdCBsMiA9IGFhYmIubG93ZXJCb3VuZDsKICAgICAgY29uc3QgdTIgPSBhYWJiLnVwcGVyQm91bmQ7IC8vICAgICAgbDIgICAgICAgIHUyCiAgICAgIC8vICAgICAgfC0tLS0tLS0tLXwKICAgICAgLy8gfC0tLS0tLS0tLS0tLS0tLXwKICAgICAgLy8gbDEgICAgICAgICAgICAgIHUxCgogICAgICByZXR1cm4gbDEueCA8PSBsMi54ICYmIHUxLnggPj0gdTIueCAmJiBsMS55IDw9IGwyLnkgJiYgdTEueSA+PSB1Mi55ICYmIGwxLnogPD0gbDIueiAmJiB1MS56ID49IHUyLno7CiAgICB9CgogICAgZ2V0Q29ybmVycyhhLCBiLCBjLCBkLCBlLCBmLCBnLCBoKSB7CiAgICAgIGNvbnN0IGwgPSB0aGlzLmxvd2VyQm91bmQ7CiAgICAgIGNvbnN0IHUgPSB0aGlzLnVwcGVyQm91bmQ7CiAgICAgIGEuY29weShsKTsKICAgICAgYi5zZXQodS54LCBsLnksIGwueik7CiAgICAgIGMuc2V0KHUueCwgdS55LCBsLnopOwogICAgICBkLnNldChsLngsIHUueSwgdS56KTsKICAgICAgZS5zZXQodS54LCBsLnksIHUueik7CiAgICAgIGYuc2V0KGwueCwgdS55LCBsLnopOwogICAgICBnLnNldChsLngsIGwueSwgdS56KTsKICAgICAgaC5jb3B5KHUpOwogICAgfQogICAgLyoqCiAgICAgKiBHZXQgdGhlIHJlcHJlc2VudGF0aW9uIG9mIGFuIEFBQkIgaW4gYW5vdGhlciBmcmFtZS4KICAgICAqIEByZXR1cm4gVGhlICJ0YXJnZXQiIEFBQkIgb2JqZWN0LgogICAgICovCgoKICAgIHRvTG9jYWxGcmFtZShmcmFtZSwgdGFyZ2V0KSB7CiAgICAgIGNvbnN0IGNvcm5lcnMgPSB0cmFuc2Zvcm1JbnRvRnJhbWVfY29ybmVyczsKICAgICAgY29uc3QgYSA9IGNvcm5lcnNbMF07CiAgICAgIGNvbnN0IGIgPSBjb3JuZXJzWzFdOwogICAgICBjb25zdCBjID0gY29ybmVyc1syXTsKICAgICAgY29uc3QgZCA9IGNvcm5lcnNbM107CiAgICAgIGNvbnN0IGUgPSBjb3JuZXJzWzRdOwogICAgICBjb25zdCBmID0gY29ybmVyc1s1XTsKICAgICAgY29uc3QgZyA9IGNvcm5lcnNbNl07CiAgICAgIGNvbnN0IGggPSBjb3JuZXJzWzddOyAvLyBHZXQgY29ybmVycyBpbiBjdXJyZW50IGZyYW1lCgogICAgICB0aGlzLmdldENvcm5lcnMoYSwgYiwgYywgZCwgZSwgZiwgZywgaCk7IC8vIFRyYW5zZm9ybSB0aGVtIHRvIG5ldyBsb2NhbCBmcmFtZQoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgIT09IDg7IGkrKykgewogICAgICAgIGNvbnN0IGNvcm5lciA9IGNvcm5lcnNbaV07CiAgICAgICAgZnJhbWUucG9pbnRUb0xvY2FsKGNvcm5lciwgY29ybmVyKTsKICAgICAgfQoKICAgICAgcmV0dXJuIHRhcmdldC5zZXRGcm9tUG9pbnRzKGNvcm5lcnMpOwogICAgfQogICAgLyoqCiAgICAgKiBHZXQgdGhlIHJlcHJlc2VudGF0aW9uIG9mIGFuIEFBQkIgaW4gdGhlIGdsb2JhbCBmcmFtZS4KICAgICAqIEByZXR1cm4gVGhlICJ0YXJnZXQiIEFBQkIgb2JqZWN0LgogICAgICovCgoKICAgIHRvV29ybGRGcmFtZShmcmFtZSwgdGFyZ2V0KSB7CiAgICAgIGNvbnN0IGNvcm5lcnMgPSB0cmFuc2Zvcm1JbnRvRnJhbWVfY29ybmVyczsKICAgICAgY29uc3QgYSA9IGNvcm5lcnNbMF07CiAgICAgIGNvbnN0IGIgPSBjb3JuZXJzWzFdOwogICAgICBjb25zdCBjID0gY29ybmVyc1syXTsKICAgICAgY29uc3QgZCA9IGNvcm5lcnNbM107CiAgICAgIGNvbnN0IGUgPSBjb3JuZXJzWzRdOwogICAgICBjb25zdCBmID0gY29ybmVyc1s1XTsKICAgICAgY29uc3QgZyA9IGNvcm5lcnNbNl07CiAgICAgIGNvbnN0IGggPSBjb3JuZXJzWzddOyAvLyBHZXQgY29ybmVycyBpbiBjdXJyZW50IGZyYW1lCgogICAgICB0aGlzLmdldENvcm5lcnMoYSwgYiwgYywgZCwgZSwgZiwgZywgaCk7IC8vIFRyYW5zZm9ybSB0aGVtIHRvIG5ldyBsb2NhbCBmcmFtZQoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgIT09IDg7IGkrKykgewogICAgICAgIGNvbnN0IGNvcm5lciA9IGNvcm5lcnNbaV07CiAgICAgICAgZnJhbWUucG9pbnRUb1dvcmxkKGNvcm5lciwgY29ybmVyKTsKICAgICAgfQoKICAgICAgcmV0dXJuIHRhcmdldC5zZXRGcm9tUG9pbnRzKGNvcm5lcnMpOwogICAgfQogICAgLyoqCiAgICAgKiBDaGVjayBpZiB0aGUgQUFCQiBpcyBoaXQgYnkgYSByYXkuCiAgICAgKi8KCgogICAgb3ZlcmxhcHNSYXkocmF5KSB7CiAgICAgIGNvbnN0IHsKICAgICAgICBkaXJlY3Rpb24sCiAgICAgICAgZnJvbQogICAgICB9ID0gcmF5OyAvLyBjb25zdCB0ID0gMAogICAgICAvLyByYXkuZGlyZWN0aW9uIGlzIHVuaXQgZGlyZWN0aW9uIHZlY3RvciBvZiByYXkKCiAgICAgIGNvbnN0IGRpckZyYWNYID0gMSAvIGRpcmVjdGlvbi54OwogICAgICBjb25zdCBkaXJGcmFjWSA9IDEgLyBkaXJlY3Rpb24ueTsKICAgICAgY29uc3QgZGlyRnJhY1ogPSAxIC8gZGlyZWN0aW9uLno7IC8vIHRoaXMubG93ZXJCb3VuZCBpcyB0aGUgY29ybmVyIG9mIEFBQkIgd2l0aCBtaW5pbWFsIGNvb3JkaW5hdGVzIC0gbGVmdCBib3R0b20sIHJ0IGlzIG1heGltYWwgY29ybmVyCgogICAgICBjb25zdCB0MSA9ICh0aGlzLmxvd2VyQm91bmQueCAtIGZyb20ueCkgKiBkaXJGcmFjWDsKICAgICAgY29uc3QgdDIgPSAodGhpcy51cHBlckJvdW5kLnggLSBmcm9tLngpICogZGlyRnJhY1g7CiAgICAgIGNvbnN0IHQzID0gKHRoaXMubG93ZXJCb3VuZC55IC0gZnJvbS55KSAqIGRpckZyYWNZOwogICAgICBjb25zdCB0NCA9ICh0aGlzLnVwcGVyQm91bmQueSAtIGZyb20ueSkgKiBkaXJGcmFjWTsKICAgICAgY29uc3QgdDUgPSAodGhpcy5sb3dlckJvdW5kLnogLSBmcm9tLnopICogZGlyRnJhY1o7CiAgICAgIGNvbnN0IHQ2ID0gKHRoaXMudXBwZXJCb3VuZC56IC0gZnJvbS56KSAqIGRpckZyYWNaOyAvLyBjb25zdCB0bWluID0gTWF0aC5tYXgoTWF0aC5tYXgoTWF0aC5taW4odDEsIHQyKSwgTWF0aC5taW4odDMsIHQ0KSkpOwogICAgICAvLyBjb25zdCB0bWF4ID0gTWF0aC5taW4oTWF0aC5taW4oTWF0aC5tYXgodDEsIHQyKSwgTWF0aC5tYXgodDMsIHQ0KSkpOwoKICAgICAgY29uc3QgdG1pbiA9IE1hdGgubWF4KE1hdGgubWF4KE1hdGgubWluKHQxLCB0MiksIE1hdGgubWluKHQzLCB0NCkpLCBNYXRoLm1pbih0NSwgdDYpKTsKICAgICAgY29uc3QgdG1heCA9IE1hdGgubWluKE1hdGgubWluKE1hdGgubWF4KHQxLCB0MiksIE1hdGgubWF4KHQzLCB0NCkpLCBNYXRoLm1heCh0NSwgdDYpKTsgLy8gaWYgdG1heCA8IDAsIHJheSAobGluZSkgaXMgaW50ZXJzZWN0aW5nIEFBQkIsIGJ1dCB3aG9sZSBBQUJCIGlzIGJlaGluZyB1cwoKICAgICAgaWYgKHRtYXggPCAwKSB7CiAgICAgICAgLy90ID0gdG1heDsKICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgIH0gLy8gaWYgdG1pbiA+IHRtYXgsIHJheSBkb2Vzbid0IGludGVyc2VjdCBBQUJCCgoKICAgICAgaWYgKHRtaW4gPiB0bWF4KSB7CiAgICAgICAgLy90ID0gdG1heDsKICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgIH0KCiAgICAgIHJldHVybiB0cnVlOwogICAgfQoKICB9CiAgY29uc3QgdG1wJDEgPSBuZXcgVmVjMygpOwogIGNvbnN0IHRyYW5zZm9ybUludG9GcmFtZV9jb3JuZXJzID0gW25ldyBWZWMzKCksIG5ldyBWZWMzKCksIG5ldyBWZWMzKCksIG5ldyBWZWMzKCksIG5ldyBWZWMzKCksIG5ldyBWZWMzKCksIG5ldyBWZWMzKCksIG5ldyBWZWMzKCldOwoKICAvKioKICAgKiBDb2xsaXNpb24gIm1hdHJpeCIuCiAgICogSXQncyBhY3R1YWxseSBhIHRyaWFuZ3VsYXItc2hhcGVkIGFycmF5IG9mIHdoZXRoZXIgdHdvIGJvZGllcyBhcmUgdG91Y2hpbmcgdGhpcyBzdGVwLCBmb3IgcmVmZXJlbmNlIG5leHQgc3RlcAogICAqLwogIGNsYXNzIEFycmF5Q29sbGlzaW9uTWF0cml4IHsKICAgIC8qKgogICAgICogVGhlIG1hdHJpeCBzdG9yYWdlLgogICAgICovCiAgICBjb25zdHJ1Y3RvcigpIHsKICAgICAgdGhpcy5tYXRyaXggPSBbXTsKICAgIH0KICAgIC8qKgogICAgICogR2V0IGFuIGVsZW1lbnQKICAgICAqLwoKCiAgICBnZXQoYmksIGJqKSB7CiAgICAgIGxldCB7CiAgICAgICAgaW5kZXg6IGkKICAgICAgfSA9IGJpOwogICAgICBsZXQgewogICAgICAgIGluZGV4OiBqCiAgICAgIH0gPSBiajsKCiAgICAgIGlmIChqID4gaSkgewogICAgICAgIGNvbnN0IHRlbXAgPSBqOwogICAgICAgIGogPSBpOwogICAgICAgIGkgPSB0ZW1wOwogICAgICB9CgogICAgICByZXR1cm4gdGhpcy5tYXRyaXhbKGkgKiAoaSArIDEpID4+IDEpICsgaiAtIDFdOwogICAgfQogICAgLyoqCiAgICAgKiBTZXQgYW4gZWxlbWVudAogICAgICovCgoKICAgIHNldChiaSwgYmosIHZhbHVlKSB7CiAgICAgIGxldCB7CiAgICAgICAgaW5kZXg6IGkKICAgICAgfSA9IGJpOwogICAgICBsZXQgewogICAgICAgIGluZGV4OiBqCiAgICAgIH0gPSBiajsKCiAgICAgIGlmIChqID4gaSkgewogICAgICAgIGNvbnN0IHRlbXAgPSBqOwogICAgICAgIGogPSBpOwogICAgICAgIGkgPSB0ZW1wOwogICAgICB9CgogICAgICB0aGlzLm1hdHJpeFsoaSAqIChpICsgMSkgPj4gMSkgKyBqIC0gMV0gPSB2YWx1ZSA/IDEgOiAwOwogICAgfQogICAgLyoqCiAgICAgKiBTZXRzIGFsbCBlbGVtZW50cyB0byB6ZXJvCiAgICAgKi8KCgogICAgcmVzZXQoKSB7CiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5tYXRyaXgubGVuZ3RoOyBpICE9PSBsOyBpKyspIHsKICAgICAgICB0aGlzLm1hdHJpeFtpXSA9IDA7CiAgICAgIH0KICAgIH0KICAgIC8qKgogICAgICogU2V0cyB0aGUgbWF4IG51bWJlciBvZiBvYmplY3RzCiAgICAgKi8KCgogICAgc2V0TnVtT2JqZWN0cyhuKSB7CiAgICAgIHRoaXMubWF0cml4Lmxlbmd0aCA9IG4gKiAobiAtIDEpID4+IDE7CiAgICB9CgogIH0KCiAgLyoqCiAgICogQmFzZSBjbGFzcyBmb3Igb2JqZWN0cyB0aGF0IGRpc3BhdGNoZXMgZXZlbnRzLgogICAqLwogIGNsYXNzIEV2ZW50VGFyZ2V0IHsKICAgIC8qKgogICAgICogQWRkIGFuIGV2ZW50IGxpc3RlbmVyCiAgICAgKiBAcmV0dXJuIFRoZSBzZWxmIG9iamVjdCwgZm9yIGNoYWluYWJpbGl0eS4KICAgICAqLwogICAgYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikgewogICAgICBpZiAodGhpcy5fbGlzdGVuZXJzID09PSB1bmRlZmluZWQpIHsKICAgICAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTsKICAgICAgfQoKICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzOwoKICAgICAgaWYgKGxpc3RlbmVyc1t0eXBlXSA9PT0gdW5kZWZpbmVkKSB7CiAgICAgICAgbGlzdGVuZXJzW3R5cGVdID0gW107CiAgICAgIH0KCiAgICAgIGlmICghbGlzdGVuZXJzW3R5cGVdLmluY2x1ZGVzKGxpc3RlbmVyKSkgewogICAgICAgIGxpc3RlbmVyc1t0eXBlXS5wdXNoKGxpc3RlbmVyKTsKICAgICAgfQoKICAgICAgcmV0dXJuIHRoaXM7CiAgICB9CiAgICAvKioKICAgICAqIENoZWNrIGlmIGFuIGV2ZW50IGxpc3RlbmVyIGlzIGFkZGVkCiAgICAgKi8KCgogICAgaGFzRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikgewogICAgICBpZiAodGhpcy5fbGlzdGVuZXJzID09PSB1bmRlZmluZWQpIHsKICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgIH0KCiAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyczsKCiAgICAgIGlmIChsaXN0ZW5lcnNbdHlwZV0gIT09IHVuZGVmaW5lZCAmJiBsaXN0ZW5lcnNbdHlwZV0uaW5jbHVkZXMobGlzdGVuZXIpKSB7CiAgICAgICAgcmV0dXJuIHRydWU7CiAgICAgIH0KCiAgICAgIHJldHVybiBmYWxzZTsKICAgIH0KICAgIC8qKgogICAgICogQ2hlY2sgaWYgYW55IGV2ZW50IGxpc3RlbmVyIG9mIHRoZSBnaXZlbiB0eXBlIGlzIGFkZGVkCiAgICAgKi8KCgogICAgaGFzQW55RXZlbnRMaXN0ZW5lcih0eXBlKSB7CiAgICAgIGlmICh0aGlzLl9saXN0ZW5lcnMgPT09IHVuZGVmaW5lZCkgewogICAgICAgIHJldHVybiBmYWxzZTsKICAgICAgfQoKICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzOwogICAgICByZXR1cm4gbGlzdGVuZXJzW3R5cGVdICE9PSB1bmRlZmluZWQ7CiAgICB9CiAgICAvKioKICAgICAqIFJlbW92ZSBhbiBldmVudCBsaXN0ZW5lcgogICAgICogQHJldHVybiBUaGUgc2VsZiBvYmplY3QsIGZvciBjaGFpbmFiaWxpdHkuCiAgICAgKi8KCgogICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikgewogICAgICBpZiAodGhpcy5fbGlzdGVuZXJzID09PSB1bmRlZmluZWQpIHsKICAgICAgICByZXR1cm4gdGhpczsKICAgICAgfQoKICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzOwoKICAgICAgaWYgKGxpc3RlbmVyc1t0eXBlXSA9PT0gdW5kZWZpbmVkKSB7CiAgICAgICAgcmV0dXJuIHRoaXM7CiAgICAgIH0KCiAgICAgIGNvbnN0IGluZGV4ID0gbGlzdGVuZXJzW3R5cGVdLmluZGV4T2YobGlzdGVuZXIpOwoKICAgICAgaWYgKGluZGV4ICE9PSAtMSkgewogICAgICAgIGxpc3RlbmVyc1t0eXBlXS5zcGxpY2UoaW5kZXgsIDEpOwogICAgICB9CgogICAgICByZXR1cm4gdGhpczsKICAgIH0KICAgIC8qKgogICAgICogRW1pdCBhbiBldmVudC4KICAgICAqIEByZXR1cm4gVGhlIHNlbGYgb2JqZWN0LCBmb3IgY2hhaW5hYmlsaXR5LgogICAgICovCgoKICAgIGRpc3BhdGNoRXZlbnQoZXZlbnQpIHsKICAgICAgaWYgKHRoaXMuX2xpc3RlbmVycyA9PT0gdW5kZWZpbmVkKSB7CiAgICAgICAgcmV0dXJuIHRoaXM7CiAgICAgIH0KCiAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyczsKICAgICAgY29uc3QgbGlzdGVuZXJBcnJheSA9IGxpc3RlbmVyc1tldmVudC50eXBlXTsKCiAgICAgIGlmIChsaXN0ZW5lckFycmF5ICE9PSB1bmRlZmluZWQpIHsKICAgICAgICBldmVudC50YXJnZXQgPSB0aGlzOwoKICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGxpc3RlbmVyQXJyYXkubGVuZ3RoOyBpIDwgbDsgaSsrKSB7CiAgICAgICAgICBsaXN0ZW5lckFycmF5W2ldLmNhbGwodGhpcywgZXZlbnQpOwogICAgICAgIH0KICAgICAgfQoKICAgICAgcmV0dXJuIHRoaXM7CiAgICB9CgogIH0KCiAgLyoqCiAgICogQSBRdWF0ZXJuaW9uIGRlc2NyaWJlcyBhIHJvdGF0aW9uIGluIDNEIHNwYWNlLiBUaGUgUXVhdGVybmlvbiBpcyBtYXRoZW1hdGljYWxseSBkZWZpbmVkIGFzIFEgPSB4KmkgKyB5KmogKyB6KmsgKyB3LCB3aGVyZSAoaSxqLGspIGFyZSBpbWFnaW5hcnkgYmFzaXMgdmVjdG9ycy4gKHgseSx6KSBjYW4gYmUgc2VlbiBhcyBhIHZlY3RvciByZWxhdGVkIHRvIHRoZSBheGlzIG9mIHJvdGF0aW9uLCB3aGlsZSB0aGUgcmVhbCBtdWx0aXBsaWVyLCB3LCBpcyByZWxhdGVkIHRvIHRoZSBhbW91bnQgb2Ygcm90YXRpb24uCiAgICogQHBhcmFtIHggTXVsdGlwbGllciBvZiB0aGUgaW1hZ2luYXJ5IGJhc2lzIHZlY3RvciBpLgogICAqIEBwYXJhbSB5IE11bHRpcGxpZXIgb2YgdGhlIGltYWdpbmFyeSBiYXNpcyB2ZWN0b3Igai4KICAgKiBAcGFyYW0geiBNdWx0aXBsaWVyIG9mIHRoZSBpbWFnaW5hcnkgYmFzaXMgdmVjdG9yIGsuCiAgICogQHBhcmFtIHcgTXVsdGlwbGllciBvZiB0aGUgcmVhbCBwYXJ0LgogICAqIEBzZWUgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9RdWF0ZXJuaW9uCiAgICovCgogIGNsYXNzIFF1YXRlcm5pb24gewogICAgY29uc3RydWN0b3IoeCwgeSwgeiwgdykgewogICAgICBpZiAoeCA9PT0gdm9pZCAwKSB7CiAgICAgICAgeCA9IDA7CiAgICAgIH0KCiAgICAgIGlmICh5ID09PSB2b2lkIDApIHsKICAgICAgICB5ID0gMDsKICAgICAgfQoKICAgICAgaWYgKHogPT09IHZvaWQgMCkgewogICAgICAgIHogPSAwOwogICAgICB9CgogICAgICBpZiAodyA9PT0gdm9pZCAwKSB7CiAgICAgICAgdyA9IDE7CiAgICAgIH0KCiAgICAgIHRoaXMueCA9IHg7CiAgICAgIHRoaXMueSA9IHk7CiAgICAgIHRoaXMueiA9IHo7CiAgICAgIHRoaXMudyA9IHc7CiAgICB9CiAgICAvKioKICAgICAqIFNldCB0aGUgdmFsdWUgb2YgdGhlIHF1YXRlcm5pb24uCiAgICAgKi8KCgogICAgc2V0KHgsIHksIHosIHcpIHsKICAgICAgdGhpcy54ID0geDsKICAgICAgdGhpcy55ID0geTsKICAgICAgdGhpcy56ID0gejsKICAgICAgdGhpcy53ID0gdzsKICAgICAgcmV0dXJuIHRoaXM7CiAgICB9CiAgICAvKioKICAgICAqIENvbnZlcnQgdG8gYSByZWFkYWJsZSBmb3JtYXQKICAgICAqIEByZXR1cm4gIngseSx6LHciCiAgICAgKi8KCgogICAgdG9TdHJpbmcoKSB7CiAgICAgIHJldHVybiBgJHt0aGlzLnh9LCR7dGhpcy55fSwke3RoaXMuen0sJHt0aGlzLnd9YDsKICAgIH0KICAgIC8qKgogICAgICogQ29udmVydCB0byBhbiBBcnJheQogICAgICogQHJldHVybiBbeCwgeSwgeiwgd10KICAgICAqLwoKCiAgICB0b0FycmF5KCkgewogICAgICByZXR1cm4gW3RoaXMueCwgdGhpcy55LCB0aGlzLnosIHRoaXMud107CiAgICB9CiAgICAvKioKICAgICAqIFNldCB0aGUgcXVhdGVybmlvbiBjb21wb25lbnRzIGdpdmVuIGFuIGF4aXMgYW5kIGFuIGFuZ2xlIGluIHJhZGlhbnMuCiAgICAgKi8KCgogICAgc2V0RnJvbUF4aXNBbmdsZSh2ZWN0b3IsIGFuZ2xlKSB7CiAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhbmdsZSAqIDAuNSk7CiAgICAgIHRoaXMueCA9IHZlY3Rvci54ICogczsKICAgICAgdGhpcy55ID0gdmVjdG9yLnkgKiBzOwogICAgICB0aGlzLnogPSB2ZWN0b3IueiAqIHM7CiAgICAgIHRoaXMudyA9IE1hdGguY29zKGFuZ2xlICogMC41KTsKICAgICAgcmV0dXJuIHRoaXM7CiAgICB9CiAgICAvKioKICAgICAqIENvbnZlcnRzIHRoZSBxdWF0ZXJuaW9uIHRvIFsgYXhpcywgYW5nbGUgXSByZXByZXNlbnRhdGlvbi4KICAgICAqIEBwYXJhbSB0YXJnZXRBeGlzIEEgdmVjdG9yIG9iamVjdCB0byByZXVzZSBmb3Igc3RvcmluZyB0aGUgYXhpcy4KICAgICAqIEByZXR1cm4gQW4gYXJyYXksIGZpcnN0IGVsZW1lbnQgaXMgdGhlIGF4aXMgYW5kIHRoZSBzZWNvbmQgaXMgdGhlIGFuZ2xlIGluIHJhZGlhbnMuCiAgICAgKi8KCgogICAgdG9BeGlzQW5nbGUodGFyZ2V0QXhpcykgewogICAgICBpZiAodGFyZ2V0QXhpcyA9PT0gdm9pZCAwKSB7CiAgICAgICAgdGFyZ2V0QXhpcyA9IG5ldyBWZWMzKCk7CiAgICAgIH0KCiAgICAgIHRoaXMubm9ybWFsaXplKCk7IC8vIGlmIHc+MSBhY29zIGFuZCBzcXJ0IHdpbGwgcHJvZHVjZSBlcnJvcnMsIHRoaXMgY2FudCBoYXBwZW4gaWYgcXVhdGVybmlvbiBpcyBub3JtYWxpc2VkCgogICAgICBjb25zdCBhbmdsZSA9IDIgKiBNYXRoLmFjb3ModGhpcy53KTsKICAgICAgY29uc3QgcyA9IE1hdGguc3FydCgxIC0gdGhpcy53ICogdGhpcy53KTsgLy8gYXNzdW1pbmcgcXVhdGVybmlvbiBub3JtYWxpc2VkIHRoZW4gdyBpcyBsZXNzIHRoYW4gMSwgc28gdGVybSBhbHdheXMgcG9zaXRpdmUuCgogICAgICBpZiAocyA8IDAuMDAxKSB7CiAgICAgICAgLy8gdGVzdCB0byBhdm9pZCBkaXZpZGUgYnkgemVybywgcyBpcyBhbHdheXMgcG9zaXRpdmUgZHVlIHRvIHNxcnQKICAgICAgICAvLyBpZiBzIGNsb3NlIHRvIHplcm8gdGhlbiBkaXJlY3Rpb24gb2YgYXhpcyBub3QgaW1wb3J0YW50CiAgICAgICAgdGFyZ2V0QXhpcy54ID0gdGhpcy54OyAvLyBpZiBpdCBpcyBpbXBvcnRhbnQgdGhhdCBheGlzIGlzIG5vcm1hbGlzZWQgdGhlbiByZXBsYWNlIHdpdGggeD0xOyB5PXo9MDsKCiAgICAgICAgdGFyZ2V0QXhpcy55ID0gdGhpcy55OwogICAgICAgIHRhcmdldEF4aXMueiA9IHRoaXMuejsKICAgICAgfSBlbHNlIHsKICAgICAgICB0YXJnZXRBeGlzLnggPSB0aGlzLnggLyBzOyAvLyBub3JtYWxpc2UgYXhpcwoKICAgICAgICB0YXJnZXRBeGlzLnkgPSB0aGlzLnkgLyBzOwogICAgICAgIHRhcmdldEF4aXMueiA9IHRoaXMueiAvIHM7CiAgICAgIH0KCiAgICAgIHJldHVybiBbdGFyZ2V0QXhpcywgYW5nbGVdOwogICAgfQogICAgLyoqCiAgICAgKiBTZXQgdGhlIHF1YXRlcm5pb24gdmFsdWUgZ2l2ZW4gdHdvIHZlY3RvcnMuIFRoZSByZXN1bHRpbmcgcm90YXRpb24gd2lsbCBiZSB0aGUgbmVlZGVkIHJvdGF0aW9uIHRvIHJvdGF0ZSB1IHRvIHYuCiAgICAgKi8KCgogICAgc2V0RnJvbVZlY3RvcnModSwgdikgewogICAgICBpZiAodS5pc0FudGlwYXJhbGxlbFRvKHYpKSB7CiAgICAgICAgY29uc3QgdDEgPSBzZnZfdDE7CiAgICAgICAgY29uc3QgdDIgPSBzZnZfdDI7CiAgICAgICAgdS50YW5nZW50cyh0MSwgdDIpOwogICAgICAgIHRoaXMuc2V0RnJvbUF4aXNBbmdsZSh0MSwgTWF0aC5QSSk7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgY29uc3QgYSA9IHUuY3Jvc3Modik7CiAgICAgICAgdGhpcy54ID0gYS54OwogICAgICAgIHRoaXMueSA9IGEueTsKICAgICAgICB0aGlzLnogPSBhLno7CiAgICAgICAgdGhpcy53ID0gTWF0aC5zcXJ0KHUubGVuZ3RoKCkgKiogMiAqIHYubGVuZ3RoKCkgKiogMikgKyB1LmRvdCh2KTsKICAgICAgICB0aGlzLm5vcm1hbGl6ZSgpOwogICAgICB9CgogICAgICByZXR1cm4gdGhpczsKICAgIH0KICAgIC8qKgogICAgICogTXVsdGlwbHkgdGhlIHF1YXRlcm5pb24gd2l0aCBhbiBvdGhlciBxdWF0ZXJuaW9uLgogICAgICovCgoKICAgIG11bHQocXVhdCwgdGFyZ2V0KSB7CiAgICAgIGlmICh0YXJnZXQgPT09IHZvaWQgMCkgewogICAgICAgIHRhcmdldCA9IG5ldyBRdWF0ZXJuaW9uKCk7CiAgICAgIH0KCiAgICAgIGNvbnN0IGF4ID0gdGhpcy54OwogICAgICBjb25zdCBheSA9IHRoaXMueTsKICAgICAgY29uc3QgYXogPSB0aGlzLno7CiAgICAgIGNvbnN0IGF3ID0gdGhpcy53OwogICAgICBjb25zdCBieCA9IHF1YXQueDsKICAgICAgY29uc3QgYnkgPSBxdWF0Lnk7CiAgICAgIGNvbnN0IGJ6ID0gcXVhdC56OwogICAgICBjb25zdCBidyA9IHF1YXQudzsKICAgICAgdGFyZ2V0LnggPSBheCAqIGJ3ICsgYXcgKiBieCArIGF5ICogYnogLSBheiAqIGJ5OwogICAgICB0YXJnZXQueSA9IGF5ICogYncgKyBhdyAqIGJ5ICsgYXogKiBieCAtIGF4ICogYno7CiAgICAgIHRhcmdldC56ID0gYXogKiBidyArIGF3ICogYnogKyBheCAqIGJ5IC0gYXkgKiBieDsKICAgICAgdGFyZ2V0LncgPSBhdyAqIGJ3IC0gYXggKiBieCAtIGF5ICogYnkgLSBheiAqIGJ6OwogICAgICByZXR1cm4gdGFyZ2V0OwogICAgfQogICAgLyoqCiAgICAgKiBHZXQgdGhlIGludmVyc2UgcXVhdGVybmlvbiByb3RhdGlvbi4KICAgICAqLwoKCiAgICBpbnZlcnNlKHRhcmdldCkgewogICAgICBpZiAodGFyZ2V0ID09PSB2b2lkIDApIHsKICAgICAgICB0YXJnZXQgPSBuZXcgUXVhdGVybmlvbigpOwogICAgICB9CgogICAgICBjb25zdCB4ID0gdGhpcy54OwogICAgICBjb25zdCB5ID0gdGhpcy55OwogICAgICBjb25zdCB6ID0gdGhpcy56OwogICAgICBjb25zdCB3ID0gdGhpcy53OwogICAgICB0aGlzLmNvbmp1Z2F0ZSh0YXJnZXQpOwogICAgICBjb25zdCBpbm9ybTIgPSAxIC8gKHggKiB4ICsgeSAqIHkgKyB6ICogeiArIHcgKiB3KTsKICAgICAgdGFyZ2V0LnggKj0gaW5vcm0yOwogICAgICB0YXJnZXQueSAqPSBpbm9ybTI7CiAgICAgIHRhcmdldC56ICo9IGlub3JtMjsKICAgICAgdGFyZ2V0LncgKj0gaW5vcm0yOwogICAgICByZXR1cm4gdGFyZ2V0OwogICAgfQogICAgLyoqCiAgICAgKiBHZXQgdGhlIHF1YXRlcm5pb24gY29uanVnYXRlCiAgICAgKi8KCgogICAgY29uanVnYXRlKHRhcmdldCkgewogICAgICBpZiAodGFyZ2V0ID09PSB2b2lkIDApIHsKICAgICAgICB0YXJnZXQgPSBuZXcgUXVhdGVybmlvbigpOwogICAgICB9CgogICAgICB0YXJnZXQueCA9IC10aGlzLng7CiAgICAgIHRhcmdldC55ID0gLXRoaXMueTsKICAgICAgdGFyZ2V0LnogPSAtdGhpcy56OwogICAgICB0YXJnZXQudyA9IHRoaXMudzsKICAgICAgcmV0dXJuIHRhcmdldDsKICAgIH0KICAgIC8qKgogICAgICogTm9ybWFsaXplIHRoZSBxdWF0ZXJuaW9uLiBOb3RlIHRoYXQgdGhpcyBjaGFuZ2VzIHRoZSB2YWx1ZXMgb2YgdGhlIHF1YXRlcm5pb24uCiAgICAgKi8KCgogICAgbm9ybWFsaXplKCkgewogICAgICBsZXQgbCA9IE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkgKyB0aGlzLnogKiB0aGlzLnogKyB0aGlzLncgKiB0aGlzLncpOwoKICAgICAgaWYgKGwgPT09IDApIHsKICAgICAgICB0aGlzLnggPSAwOwogICAgICAgIHRoaXMueSA9IDA7CiAgICAgICAgdGhpcy56ID0gMDsKICAgICAgICB0aGlzLncgPSAwOwogICAgICB9IGVsc2UgewogICAgICAgIGwgPSAxIC8gbDsKICAgICAgICB0aGlzLnggKj0gbDsKICAgICAgICB0aGlzLnkgKj0gbDsKICAgICAgICB0aGlzLnogKj0gbDsKICAgICAgICB0aGlzLncgKj0gbDsKICAgICAgfQoKICAgICAgcmV0dXJuIHRoaXM7CiAgICB9CiAgICAvKioKICAgICAqIEFwcHJveGltYXRpb24gb2YgcXVhdGVybmlvbiBub3JtYWxpemF0aW9uLiBXb3JrcyBiZXN0IHdoZW4gcXVhdCBpcyBhbHJlYWR5IGFsbW9zdC1ub3JtYWxpemVkLgogICAgICogQGF1dGhvciB1bnBoYXNlZCwgaHR0cHM6Ly9naXRodWIuY29tL3VucGhhc2VkCiAgICAgKi8KCgogICAgbm9ybWFsaXplRmFzdCgpIHsKICAgICAgY29uc3QgZiA9ICgzLjAgLSAodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55ICsgdGhpcy56ICogdGhpcy56ICsgdGhpcy53ICogdGhpcy53KSkgLyAyLjA7CgogICAgICBpZiAoZiA9PT0gMCkgewogICAgICAgIHRoaXMueCA9IDA7CiAgICAgICAgdGhpcy55ID0gMDsKICAgICAgICB0aGlzLnogPSAwOwogICAgICAgIHRoaXMudyA9IDA7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgdGhpcy54ICo9IGY7CiAgICAgICAgdGhpcy55ICo9IGY7CiAgICAgICAgdGhpcy56ICo9IGY7CiAgICAgICAgdGhpcy53ICo9IGY7CiAgICAgIH0KCiAgICAgIHJldHVybiB0aGlzOwogICAgfQogICAgLyoqCiAgICAgKiBNdWx0aXBseSB0aGUgcXVhdGVybmlvbiBieSBhIHZlY3RvcgogICAgICovCgoKICAgIHZtdWx0KHYsIHRhcmdldCkgewogICAgICBpZiAodGFyZ2V0ID09PSB2b2lkIDApIHsKICAgICAgICB0YXJnZXQgPSBuZXcgVmVjMygpOwogICAgICB9CgogICAgICBjb25zdCB4ID0gdi54OwogICAgICBjb25zdCB5ID0gdi55OwogICAgICBjb25zdCB6ID0gdi56OwogICAgICBjb25zdCBxeCA9IHRoaXMueDsKICAgICAgY29uc3QgcXkgPSB0aGlzLnk7CiAgICAgIGNvbnN0IHF6ID0gdGhpcy56OwogICAgICBjb25zdCBxdyA9IHRoaXMudzsgLy8gcSp2CgogICAgICBjb25zdCBpeCA9IHF3ICogeCArIHF5ICogeiAtIHF6ICogeTsKICAgICAgY29uc3QgaXkgPSBxdyAqIHkgKyBxeiAqIHggLSBxeCAqIHo7CiAgICAgIGNvbnN0IGl6ID0gcXcgKiB6ICsgcXggKiB5IC0gcXkgKiB4OwogICAgICBjb25zdCBpdyA9IC1xeCAqIHggLSBxeSAqIHkgLSBxeiAqIHo7CiAgICAgIHRhcmdldC54ID0gaXggKiBxdyArIGl3ICogLXF4ICsgaXkgKiAtcXogLSBpeiAqIC1xeTsKICAgICAgdGFyZ2V0LnkgPSBpeSAqIHF3ICsgaXcgKiAtcXkgKyBpeiAqIC1xeCAtIGl4ICogLXF6OwogICAgICB0YXJnZXQueiA9IGl6ICogcXcgKyBpdyAqIC1xeiArIGl4ICogLXF5IC0gaXkgKiAtcXg7CiAgICAgIHJldHVybiB0YXJnZXQ7CiAgICB9CiAgICAvKioKICAgICAqIENvcGllcyB2YWx1ZSBvZiBzb3VyY2UgdG8gdGhpcyBxdWF0ZXJuaW9uLgogICAgICogQHJldHVybiB0aGlzCiAgICAgKi8KCgogICAgY29weShxdWF0KSB7CiAgICAgIHRoaXMueCA9IHF1YXQueDsKICAgICAgdGhpcy55ID0gcXVhdC55OwogICAgICB0aGlzLnogPSBxdWF0Lno7CiAgICAgIHRoaXMudyA9IHF1YXQudzsKICAgICAgcmV0dXJuIHRoaXM7CiAgICB9CiAgICAvKioKICAgICAqIENvbnZlcnQgdGhlIHF1YXRlcm5pb24gdG8gZXVsZXIgYW5nbGUgcmVwcmVzZW50YXRpb24uIE9yZGVyOiBZWlgsIGFzIHRoaXMgcGFnZSBkZXNjcmliZXM6IGh0dHBzOi8vd3d3LmV1Y2xpZGVhbnNwYWNlLmNvbS9tYXRocy9zdGFuZGFyZHMvaW5kZXguaHRtCiAgICAgKiBAcGFyYW0gb3JkZXIgVGhyZWUtY2hhcmFjdGVyIHN0cmluZywgZGVmYXVsdHMgdG8gIllaWCIKICAgICAqLwoKCiAgICB0b0V1bGVyKHRhcmdldCwgb3JkZXIpIHsKICAgICAgaWYgKG9yZGVyID09PSB2b2lkIDApIHsKICAgICAgICBvcmRlciA9ICdZWlgnOwogICAgICB9CgogICAgICBsZXQgaGVhZGluZzsKICAgICAgbGV0IGF0dGl0dWRlOwogICAgICBsZXQgYmFuazsKICAgICAgY29uc3QgeCA9IHRoaXMueDsKICAgICAgY29uc3QgeSA9IHRoaXMueTsKICAgICAgY29uc3QgeiA9IHRoaXMuejsKICAgICAgY29uc3QgdyA9IHRoaXMudzsKCiAgICAgIHN3aXRjaCAob3JkZXIpIHsKICAgICAgICBjYXNlICdZWlgnOgogICAgICAgICAgY29uc3QgdGVzdCA9IHggKiB5ICsgeiAqIHc7CgogICAgICAgICAgaWYgKHRlc3QgPiAwLjQ5OSkgewogICAgICAgICAgICAvLyBzaW5ndWxhcml0eSBhdCBub3J0aCBwb2xlCiAgICAgICAgICAgIGhlYWRpbmcgPSAyICogTWF0aC5hdGFuMih4LCB3KTsKICAgICAgICAgICAgYXR0aXR1ZGUgPSBNYXRoLlBJIC8gMjsKICAgICAgICAgICAgYmFuayA9IDA7CiAgICAgICAgICB9CgogICAgICAgICAgaWYgKHRlc3QgPCAtMC40OTkpIHsKICAgICAgICAgICAgLy8gc2luZ3VsYXJpdHkgYXQgc291dGggcG9sZQogICAgICAgICAgICBoZWFkaW5nID0gLTIgKiBNYXRoLmF0YW4yKHgsIHcpOwogICAgICAgICAgICBhdHRpdHVkZSA9IC1NYXRoLlBJIC8gMjsKICAgICAgICAgICAgYmFuayA9IDA7CiAgICAgICAgICB9CgogICAgICAgICAgaWYgKGhlYWRpbmcgPT09IHVuZGVmaW5lZCkgewogICAgICAgICAgICBjb25zdCBzcXggPSB4ICogeDsKICAgICAgICAgICAgY29uc3Qgc3F5ID0geSAqIHk7CiAgICAgICAgICAgIGNvbnN0IHNxeiA9IHogKiB6OwogICAgICAgICAgICBoZWFkaW5nID0gTWF0aC5hdGFuMigyICogeSAqIHcgLSAyICogeCAqIHosIDEgLSAyICogc3F5IC0gMiAqIHNxeik7IC8vIEhlYWRpbmcKCiAgICAgICAgICAgIGF0dGl0dWRlID0gTWF0aC5hc2luKDIgKiB0ZXN0KTsgLy8gYXR0aXR1ZGUKCiAgICAgICAgICAgIGJhbmsgPSBNYXRoLmF0YW4yKDIgKiB4ICogdyAtIDIgKiB5ICogeiwgMSAtIDIgKiBzcXggLSAyICogc3F6KTsgLy8gYmFuawogICAgICAgICAgfQoKICAgICAgICAgIGJyZWFrOwoKICAgICAgICBkZWZhdWx0OgogICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFdWxlciBvcmRlciAke29yZGVyfSBub3Qgc3VwcG9ydGVkIHlldC5gKTsKICAgICAgfQoKICAgICAgdGFyZ2V0LnkgPSBoZWFkaW5nOwogICAgICB0YXJnZXQueiA9IGF0dGl0dWRlOwogICAgICB0YXJnZXQueCA9IGJhbms7CiAgICB9CiAgICAvKioKICAgICAqIFNldCB0aGUgcXVhdGVybmlvbiBjb21wb25lbnRzIGdpdmVuIEV1bGVyIGFuZ2xlIHJlcHJlc2VudGF0aW9uLgogICAgICoKICAgICAqIEBwYXJhbSBvcmRlciBUaGUgb3JkZXIgdG8gYXBwbHkgYW5nbGVzOiAnWFlaJyBvciAnWVhaJyBvciBhbnkgb3RoZXIgY29tYmluYXRpb24uCiAgICAgKgogICAgICogU2VlIHtAbGluayBodHRwczovL3d3dy5tYXRod29ya3MuY29tL21hdGxhYmNlbnRyYWwvZmlsZWV4Y2hhbmdlLzIwNjk2LWZ1bmN0aW9uLXRvLWNvbnZlcnQtYmV0d2Vlbi1kY20tZXVsZXItYW5nbGVzLXF1YXRlcm5pb25zLWFuZC1ldWxlci12ZWN0b3JzIE1hdGhXb3Jrc30gcmVmZXJlbmNlCiAgICAgKi8KCgogICAgc2V0RnJvbUV1bGVyKHgsIHksIHosIG9yZGVyKSB7CiAgICAgIGlmIChvcmRlciA9PT0gdm9pZCAwKSB7CiAgICAgICAgb3JkZXIgPSAnWFlaJzsKICAgICAgfQoKICAgICAgY29uc3QgYzEgPSBNYXRoLmNvcyh4IC8gMik7CiAgICAgIGNvbnN0IGMyID0gTWF0aC5jb3MoeSAvIDIpOwogICAgICBjb25zdCBjMyA9IE1hdGguY29zKHogLyAyKTsKICAgICAgY29uc3QgczEgPSBNYXRoLnNpbih4IC8gMik7CiAgICAgIGNvbnN0IHMyID0gTWF0aC5zaW4oeSAvIDIpOwogICAgICBjb25zdCBzMyA9IE1hdGguc2luKHogLyAyKTsKCiAgICAgIGlmIChvcmRlciA9PT0gJ1hZWicpIHsKICAgICAgICB0aGlzLnggPSBzMSAqIGMyICogYzMgKyBjMSAqIHMyICogczM7CiAgICAgICAgdGhpcy55ID0gYzEgKiBzMiAqIGMzIC0gczEgKiBjMiAqIHMzOwogICAgICAgIHRoaXMueiA9IGMxICogYzIgKiBzMyArIHMxICogczIgKiBjMzsKICAgICAgICB0aGlzLncgPSBjMSAqIGMyICogYzMgLSBzMSAqIHMyICogczM7CiAgICAgIH0gZWxzZSBpZiAob3JkZXIgPT09ICdZWFonKSB7CiAgICAgICAgdGhpcy54ID0gczEgKiBjMiAqIGMzICsgYzEgKiBzMiAqIHMzOwogICAgICAgIHRoaXMueSA9IGMxICogczIgKiBjMyAtIHMxICogYzIgKiBzMzsKICAgICAgICB0aGlzLnogPSBjMSAqIGMyICogczMgLSBzMSAqIHMyICogYzM7CiAgICAgICAgdGhpcy53ID0gYzEgKiBjMiAqIGMzICsgczEgKiBzMiAqIHMzOwogICAgICB9IGVsc2UgaWYgKG9yZGVyID09PSAnWlhZJykgewogICAgICAgIHRoaXMueCA9IHMxICogYzIgKiBjMyAtIGMxICogczIgKiBzMzsKICAgICAgICB0aGlzLnkgPSBjMSAqIHMyICogYzMgKyBzMSAqIGMyICogczM7CiAgICAgICAgdGhpcy56ID0gYzEgKiBjMiAqIHMzICsgczEgKiBzMiAqIGMzOwogICAgICAgIHRoaXMudyA9IGMxICogYzIgKiBjMyAtIHMxICogczIgKiBzMzsKICAgICAgfSBlbHNlIGlmIChvcmRlciA9PT0gJ1pZWCcpIHsKICAgICAgICB0aGlzLnggPSBzMSAqIGMyICogYzMgLSBjMSAqIHMyICogczM7CiAgICAgICAgdGhpcy55ID0gYzEgKiBzMiAqIGMzICsgczEgKiBjMiAqIHMzOwogICAgICAgIHRoaXMueiA9IGMxICogYzIgKiBzMyAtIHMxICogczIgKiBjMzsKICAgICAgICB0aGlzLncgPSBjMSAqIGMyICogYzMgKyBzMSAqIHMyICogczM7CiAgICAgIH0gZWxzZSBpZiAob3JkZXIgPT09ICdZWlgnKSB7CiAgICAgICAgdGhpcy54ID0gczEgKiBjMiAqIGMzICsgYzEgKiBzMiAqIHMzOwogICAgICAgIHRoaXMueSA9IGMxICogczIgKiBjMyArIHMxICogYzIgKiBzMzsKICAgICAgICB0aGlzLnogPSBjMSAqIGMyICogczMgLSBzMSAqIHMyICogYzM7CiAgICAgICAgdGhpcy53ID0gYzEgKiBjMiAqIGMzIC0gczEgKiBzMiAqIHMzOwogICAgICB9IGVsc2UgaWYgKG9yZGVyID09PSAnWFpZJykgewogICAgICAgIHRoaXMueCA9IHMxICogYzIgKiBjMyAtIGMxICogczIgKiBzMzsKICAgICAgICB0aGlzLnkgPSBjMSAqIHMyICogYzMgLSBzMSAqIGMyICogczM7CiAgICAgICAgdGhpcy56ID0gYzEgKiBjMiAqIHMzICsgczEgKiBzMiAqIGMzOwogICAgICAgIHRoaXMudyA9IGMxICogYzIgKiBjMyArIHMxICogczIgKiBzMzsKICAgICAgfQoKICAgICAgcmV0dXJuIHRoaXM7CiAgICB9CgogICAgY2xvbmUoKSB7CiAgICAgIHJldHVybiBuZXcgUXVhdGVybmlvbih0aGlzLngsIHRoaXMueSwgdGhpcy56LCB0aGlzLncpOwogICAgfQogICAgLyoqCiAgICAgKiBQZXJmb3JtcyBhIHNwaGVyaWNhbCBsaW5lYXIgaW50ZXJwb2xhdGlvbiBiZXR3ZWVuIHR3byBxdWF0CiAgICAgKgogICAgICogQHBhcmFtIHRvUXVhdCBzZWNvbmQgb3BlcmFuZAogICAgICogQHBhcmFtIHQgaW50ZXJwb2xhdGlvbiBhbW91bnQgYmV0d2VlbiB0aGUgc2VsZiBxdWF0ZXJuaW9uIGFuZCB0b1F1YXQKICAgICAqIEBwYXJhbSB0YXJnZXQgQSBxdWF0ZXJuaW9uIHRvIHN0b3JlIHRoZSByZXN1bHQgaW4uIElmIG5vdCBwcm92aWRlZCwgYSBuZXcgb25lIHdpbGwgYmUgY3JlYXRlZC4KICAgICAqIEByZXR1cm5zIHtRdWF0ZXJuaW9ufSBUaGUgInRhcmdldCIgb2JqZWN0CiAgICAgKi8KCgogICAgc2xlcnAodG9RdWF0LCB0LCB0YXJnZXQpIHsKICAgICAgaWYgKHRhcmdldCA9PT0gdm9pZCAwKSB7CiAgICAgICAgdGFyZ2V0ID0gbmV3IFF1YXRlcm5pb24oKTsKICAgICAgfQoKICAgICAgY29uc3QgYXggPSB0aGlzLng7CiAgICAgIGNvbnN0IGF5ID0gdGhpcy55OwogICAgICBjb25zdCBheiA9IHRoaXMuejsKICAgICAgY29uc3QgYXcgPSB0aGlzLnc7CiAgICAgIGxldCBieCA9IHRvUXVhdC54OwogICAgICBsZXQgYnkgPSB0b1F1YXQueTsKICAgICAgbGV0IGJ6ID0gdG9RdWF0Lno7CiAgICAgIGxldCBidyA9IHRvUXVhdC53OwogICAgICBsZXQgb21lZ2E7CiAgICAgIGxldCBjb3NvbTsKICAgICAgbGV0IHNpbm9tOwogICAgICBsZXQgc2NhbGUwOwogICAgICBsZXQgc2NhbGUxOyAvLyBjYWxjIGNvc2luZQoKICAgICAgY29zb20gPSBheCAqIGJ4ICsgYXkgKiBieSArIGF6ICogYnogKyBhdyAqIGJ3OyAvLyBhZGp1c3Qgc2lnbnMgKGlmIG5lY2Vzc2FyeSkKCiAgICAgIGlmIChjb3NvbSA8IDAuMCkgewogICAgICAgIGNvc29tID0gLWNvc29tOwogICAgICAgIGJ4ID0gLWJ4OwogICAgICAgIGJ5ID0gLWJ5OwogICAgICAgIGJ6ID0gLWJ6OwogICAgICAgIGJ3ID0gLWJ3OwogICAgICB9IC8vIGNhbGN1bGF0ZSBjb2VmZmljaWVudHMKCgogICAgICBpZiAoMS4wIC0gY29zb20gPiAwLjAwMDAwMSkgewogICAgICAgIC8vIHN0YW5kYXJkIGNhc2UgKHNsZXJwKQogICAgICAgIG9tZWdhID0gTWF0aC5hY29zKGNvc29tKTsKICAgICAgICBzaW5vbSA9IE1hdGguc2luKG9tZWdhKTsKICAgICAgICBzY2FsZTAgPSBNYXRoLnNpbigoMS4wIC0gdCkgKiBvbWVnYSkgLyBzaW5vbTsKICAgICAgICBzY2FsZTEgPSBNYXRoLnNpbih0ICogb21lZ2EpIC8gc2lub207CiAgICAgIH0gZWxzZSB7CiAgICAgICAgLy8gImZyb20iIGFuZCAidG8iIHF1YXRlcm5pb25zIGFyZSB2ZXJ5IGNsb3NlCiAgICAgICAgLy8gIC4uLiBzbyB3ZSBjYW4gZG8gYSBsaW5lYXIgaW50ZXJwb2xhdGlvbgogICAgICAgIHNjYWxlMCA9IDEuMCAtIHQ7CiAgICAgICAgc2NhbGUxID0gdDsKICAgICAgfSAvLyBjYWxjdWxhdGUgZmluYWwgdmFsdWVzCgoKICAgICAgdGFyZ2V0LnggPSBzY2FsZTAgKiBheCArIHNjYWxlMSAqIGJ4OwogICAgICB0YXJnZXQueSA9IHNjYWxlMCAqIGF5ICsgc2NhbGUxICogYnk7CiAgICAgIHRhcmdldC56ID0gc2NhbGUwICogYXogKyBzY2FsZTEgKiBiejsKICAgICAgdGFyZ2V0LncgPSBzY2FsZTAgKiBhdyArIHNjYWxlMSAqIGJ3OwogICAgICByZXR1cm4gdGFyZ2V0OwogICAgfQogICAgLyoqCiAgICAgKiBSb3RhdGUgYW4gYWJzb2x1dGUgb3JpZW50YXRpb24gcXVhdGVybmlvbiBnaXZlbiBhbiBhbmd1bGFyIHZlbG9jaXR5IGFuZCBhIHRpbWUgc3RlcC4KICAgICAqLwoKCiAgICBpbnRlZ3JhdGUoYW5ndWxhclZlbG9jaXR5LCBkdCwgYW5ndWxhckZhY3RvciwgdGFyZ2V0KSB7CiAgICAgIGlmICh0YXJnZXQgPT09IHZvaWQgMCkgewogICAgICAgIHRhcmdldCA9IG5ldyBRdWF0ZXJuaW9uKCk7CiAgICAgIH0KCiAgICAgIGNvbnN0IGF4ID0gYW5ndWxhclZlbG9jaXR5LnggKiBhbmd1bGFyRmFjdG9yLngsCiAgICAgICAgICAgIGF5ID0gYW5ndWxhclZlbG9jaXR5LnkgKiBhbmd1bGFyRmFjdG9yLnksCiAgICAgICAgICAgIGF6ID0gYW5ndWxhclZlbG9jaXR5LnogKiBhbmd1bGFyRmFjdG9yLnosCiAgICAgICAgICAgIGJ4ID0gdGhpcy54LAogICAgICAgICAgICBieSA9IHRoaXMueSwKICAgICAgICAgICAgYnogPSB0aGlzLnosCiAgICAgICAgICAgIGJ3ID0gdGhpcy53OwogICAgICBjb25zdCBoYWxmX2R0ID0gZHQgKiAwLjU7CiAgICAgIHRhcmdldC54ICs9IGhhbGZfZHQgKiAoYXggKiBidyArIGF5ICogYnogLSBheiAqIGJ5KTsKICAgICAgdGFyZ2V0LnkgKz0gaGFsZl9kdCAqIChheSAqIGJ3ICsgYXogKiBieCAtIGF4ICogYnopOwogICAgICB0YXJnZXQueiArPSBoYWxmX2R0ICogKGF6ICogYncgKyBheCAqIGJ5IC0gYXkgKiBieCk7CiAgICAgIHRhcmdldC53ICs9IGhhbGZfZHQgKiAoLWF4ICogYnggLSBheSAqIGJ5IC0gYXogKiBieik7CiAgICAgIHJldHVybiB0YXJnZXQ7CiAgICB9CgogIH0KICBjb25zdCBzZnZfdDEgPSBuZXcgVmVjMygpOwogIGNvbnN0IHNmdl90MiA9IG5ldyBWZWMzKCk7CgogIC8qKgogICAqIFRoZSBhdmFpbGFibGUgc2hhcGUgdHlwZXMuCiAgICovCiAgY29uc3QgU0hBUEVfVFlQRVMgPSB7CiAgICAvKiogU1BIRVJFICovCiAgICBTUEhFUkU6IDEsCgogICAgLyoqIFBMQU5FICovCiAgICBQTEFORTogMiwKCiAgICAvKiogQk9YICovCiAgICBCT1g6IDQsCgogICAgLyoqIENPTVBPVU5EICovCiAgICBDT01QT1VORDogOCwKCiAgICAvKiogQ09OVkVYUE9MWUhFRFJPTiAqLwogICAgQ09OVkVYUE9MWUhFRFJPTjogMTYsCgogICAgLyoqIEhFSUdIVEZJRUxEICovCiAgICBIRUlHSFRGSUVMRDogMzIsCgogICAgLyoqIFBBUlRJQ0xFICovCiAgICBQQVJUSUNMRTogNjQsCgogICAgLyoqIENZTElOREVSICovCiAgICBDWUxJTkRFUjogMTI4LAoKICAgIC8qKiBUUklNRVNIICovCiAgICBUUklNRVNIOiAyNTYKICB9OwogIC8qKgogICAqIFNoYXBlVHlwZQogICAqLwoKICAvKioKICAgKiBCYXNlIGNsYXNzIGZvciBzaGFwZXMKICAgKi8KICBjbGFzcyBTaGFwZSB7CiAgICAvKioKICAgICAqIElkZW50aWZpZXIgb2YgdGhlIFNoYXBlLgogICAgICovCgogICAgLyoqCiAgICAgKiBUaGUgdHlwZSBvZiB0aGlzIHNoYXBlLiBNdXN0IGJlIHNldCB0byBhbiBpbnQgPiAwIGJ5IHN1YmNsYXNzZXMuCiAgICAgKi8KCiAgICAvKioKICAgICAqIFRoZSBsb2NhbCBib3VuZGluZyBzcGhlcmUgcmFkaXVzIG9mIHRoaXMgc2hhcGUuCiAgICAgKi8KCiAgICAvKioKICAgICAqIFdoZXRoZXIgdG8gcHJvZHVjZSBjb250YWN0IGZvcmNlcyB3aGVuIGluIGNvbnRhY3Qgd2l0aCBvdGhlciBib2RpZXMuIE5vdGUgdGhhdCBjb250YWN0cyB3aWxsIGJlIGdlbmVyYXRlZCwgYnV0IHRoZXkgd2lsbCBiZSBkaXNhYmxlZC4KICAgICAqIEBkZWZhdWx0IHRydWUKICAgICAqLwoKICAgIC8qKgogICAgICogQGRlZmF1bHQgMQogICAgICovCgogICAgLyoqCiAgICAgKiBAZGVmYXVsdCAtMQogICAgICovCgogICAgLyoqCiAgICAgKiBPcHRpb25hbCBtYXRlcmlhbCBvZiB0aGUgc2hhcGUgdGhhdCByZWd1bGF0ZXMgY29udGFjdCBwcm9wZXJ0aWVzLgogICAgICovCgogICAgLyoqCiAgICAgKiBUaGUgYm9keSB0byB3aGljaCB0aGUgc2hhcGUgaXMgYWRkZWQgdG8uCiAgICAgKi8KCiAgICAvKioKICAgICAqIEFsbCB0aGUgU2hhcGUgdHlwZXMuCiAgICAgKi8KICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHsKICAgICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgewogICAgICAgIG9wdGlvbnMgPSB7fTsKICAgICAgfQoKICAgICAgdGhpcy5pZCA9IFNoYXBlLmlkQ291bnRlcisrOwogICAgICB0aGlzLnR5cGUgPSBvcHRpb25zLnR5cGUgfHwgMDsKICAgICAgdGhpcy5ib3VuZGluZ1NwaGVyZVJhZGl1cyA9IDA7CiAgICAgIHRoaXMuY29sbGlzaW9uUmVzcG9uc2UgPSBvcHRpb25zLmNvbGxpc2lvblJlc3BvbnNlID8gb3B0aW9ucy5jb2xsaXNpb25SZXNwb25zZSA6IHRydWU7CiAgICAgIHRoaXMuY29sbGlzaW9uRmlsdGVyR3JvdXAgPSBvcHRpb25zLmNvbGxpc2lvbkZpbHRlckdyb3VwICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmNvbGxpc2lvbkZpbHRlckdyb3VwIDogMTsKICAgICAgdGhpcy5jb2xsaXNpb25GaWx0ZXJNYXNrID0gb3B0aW9ucy5jb2xsaXNpb25GaWx0ZXJNYXNrICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmNvbGxpc2lvbkZpbHRlck1hc2sgOiAtMTsKICAgICAgdGhpcy5tYXRlcmlhbCA9IG9wdGlvbnMubWF0ZXJpYWwgPyBvcHRpb25zLm1hdGVyaWFsIDogbnVsbDsKICAgICAgdGhpcy5ib2R5ID0gbnVsbDsKICAgIH0KICAgIC8qKgogICAgICogQ29tcHV0ZXMgdGhlIGJvdW5kaW5nIHNwaGVyZSByYWRpdXMuCiAgICAgKiBUaGUgcmVzdWx0IGlzIHN0b3JlZCBpbiB0aGUgcHJvcGVydHkgYC5ib3VuZGluZ1NwaGVyZVJhZGl1c2AKICAgICAqLwoKCiAgICB1cGRhdGVCb3VuZGluZ1NwaGVyZVJhZGl1cygpIHsKICAgICAgdGhyb3cgYGNvbXB1dGVCb3VuZGluZ1NwaGVyZVJhZGl1cygpIG5vdCBpbXBsZW1lbnRlZCBmb3Igc2hhcGUgdHlwZSAke3RoaXMudHlwZX1gOwogICAgfQogICAgLyoqCiAgICAgKiBHZXQgdGhlIHZvbHVtZSBvZiB0aGlzIHNoYXBlCiAgICAgKi8KCgogICAgdm9sdW1lKCkgewogICAgICB0aHJvdyBgdm9sdW1lKCkgbm90IGltcGxlbWVudGVkIGZvciBzaGFwZSB0eXBlICR7dGhpcy50eXBlfWA7CiAgICB9CiAgICAvKioKICAgICAqIENhbGN1bGF0ZXMgdGhlIGluZXJ0aWEgaW4gdGhlIGxvY2FsIGZyYW1lIGZvciB0aGlzIHNoYXBlLgogICAgICogQHNlZSBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xpc3Rfb2ZfbW9tZW50c19vZl9pbmVydGlhCiAgICAgKi8KCgogICAgY2FsY3VsYXRlTG9jYWxJbmVydGlhKG1hc3MsIHRhcmdldCkgewogICAgICB0aHJvdyBgY2FsY3VsYXRlTG9jYWxJbmVydGlhKCkgbm90IGltcGxlbWVudGVkIGZvciBzaGFwZSB0eXBlICR7dGhpcy50eXBlfWA7CiAgICB9CiAgICAvKioKICAgICAqIEB0b2RvIHVzZSBhYnN0cmFjdCBmb3IgdGhlc2Uga2luZCBvZiBtZXRob2RzCiAgICAgKi8KCgogICAgY2FsY3VsYXRlV29ybGRBQUJCKHBvcywgcXVhdCwgbWluLCBtYXgpIHsKICAgICAgdGhyb3cgYGNhbGN1bGF0ZVdvcmxkQUFCQigpIG5vdCBpbXBsZW1lbnRlZCBmb3Igc2hhcGUgdHlwZSAke3RoaXMudHlwZX1gOwogICAgfQoKICB9CiAgU2hhcGUuaWRDb3VudGVyID0gMDsKICBTaGFwZS50eXBlcyA9IFNIQVBFX1RZUEVTOwoKICAvKioKICAgKiBUcmFuc2Zvcm1hdGlvbiB1dGlsaXRpZXMuCiAgICovCiAgY2xhc3MgVHJhbnNmb3JtIHsKICAgIC8qKgogICAgICogcG9zaXRpb24KICAgICAqLwoKICAgIC8qKgogICAgICogcXVhdGVybmlvbgogICAgICovCiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7CiAgICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsKICAgICAgICBvcHRpb25zID0ge307CiAgICAgIH0KCiAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVmVjMygpOwogICAgICB0aGlzLnF1YXRlcm5pb24gPSBuZXcgUXVhdGVybmlvbigpOwoKICAgICAgaWYgKG9wdGlvbnMucG9zaXRpb24pIHsKICAgICAgICB0aGlzLnBvc2l0aW9uLmNvcHkob3B0aW9ucy5wb3NpdGlvbik7CiAgICAgIH0KCiAgICAgIGlmIChvcHRpb25zLnF1YXRlcm5pb24pIHsKICAgICAgICB0aGlzLnF1YXRlcm5pb24uY29weShvcHRpb25zLnF1YXRlcm5pb24pOwogICAgICB9CiAgICB9CiAgICAvKioKICAgICAqIEdldCBhIGdsb2JhbCBwb2ludCBpbiBsb2NhbCB0cmFuc2Zvcm0gY29vcmRpbmF0ZXMuCiAgICAgKi8KCgogICAgcG9pbnRUb0xvY2FsKHdvcmxkUG9pbnQsIHJlc3VsdCkgewogICAgICByZXR1cm4gVHJhbnNmb3JtLnBvaW50VG9Mb2NhbEZyYW1lKHRoaXMucG9zaXRpb24sIHRoaXMucXVhdGVybmlvbiwgd29ybGRQb2ludCwgcmVzdWx0KTsKICAgIH0KICAgIC8qKgogICAgICogR2V0IGEgbG9jYWwgcG9pbnQgaW4gZ2xvYmFsIHRyYW5zZm9ybSBjb29yZGluYXRlcy4KICAgICAqLwoKCiAgICBwb2ludFRvV29ybGQobG9jYWxQb2ludCwgcmVzdWx0KSB7CiAgICAgIHJldHVybiBUcmFuc2Zvcm0ucG9pbnRUb1dvcmxkRnJhbWUodGhpcy5wb3NpdGlvbiwgdGhpcy5xdWF0ZXJuaW9uLCBsb2NhbFBvaW50LCByZXN1bHQpOwogICAgfQogICAgLyoqCiAgICAgKiB2ZWN0b3JUb1dvcmxkRnJhbWUKICAgICAqLwoKCiAgICB2ZWN0b3JUb1dvcmxkRnJhbWUobG9jYWxWZWN0b3IsIHJlc3VsdCkgewogICAgICBpZiAocmVzdWx0ID09PSB2b2lkIDApIHsKICAgICAgICByZXN1bHQgPSBuZXcgVmVjMygpOwogICAgICB9CgogICAgICB0aGlzLnF1YXRlcm5pb24udm11bHQobG9jYWxWZWN0b3IsIHJlc3VsdCk7CiAgICAgIHJldHVybiByZXN1bHQ7CiAgICB9CiAgICAvKioKICAgICAqIHBvaW50VG9Mb2NhbEZyYW1lCiAgICAgKi8KCgogICAgc3RhdGljIHBvaW50VG9Mb2NhbEZyYW1lKHBvc2l0aW9uLCBxdWF0ZXJuaW9uLCB3b3JsZFBvaW50LCByZXN1bHQpIHsKICAgICAgaWYgKHJlc3VsdCA9PT0gdm9pZCAwKSB7CiAgICAgICAgcmVzdWx0ID0gbmV3IFZlYzMoKTsKICAgICAgfQoKICAgICAgd29ybGRQb2ludC52c3ViKHBvc2l0aW9uLCByZXN1bHQpOwogICAgICBxdWF0ZXJuaW9uLmNvbmp1Z2F0ZSh0bXBRdWF0JDEpOwogICAgICB0bXBRdWF0JDEudm11bHQocmVzdWx0LCByZXN1bHQpOwogICAgICByZXR1cm4gcmVzdWx0OwogICAgfQogICAgLyoqCiAgICAgKiBwb2ludFRvV29ybGRGcmFtZQogICAgICovCgoKICAgIHN0YXRpYyBwb2ludFRvV29ybGRGcmFtZShwb3NpdGlvbiwgcXVhdGVybmlvbiwgbG9jYWxQb2ludCwgcmVzdWx0KSB7CiAgICAgIGlmIChyZXN1bHQgPT09IHZvaWQgMCkgewogICAgICAgIHJlc3VsdCA9IG5ldyBWZWMzKCk7CiAgICAgIH0KCiAgICAgIHF1YXRlcm5pb24udm11bHQobG9jYWxQb2ludCwgcmVzdWx0KTsKICAgICAgcmVzdWx0LnZhZGQocG9zaXRpb24sIHJlc3VsdCk7CiAgICAgIHJldHVybiByZXN1bHQ7CiAgICB9CiAgICAvKioKICAgICAqIHZlY3RvclRvV29ybGRGcmFtZQogICAgICovCgoKICAgIHN0YXRpYyB2ZWN0b3JUb1dvcmxkRnJhbWUocXVhdGVybmlvbiwgbG9jYWxWZWN0b3IsIHJlc3VsdCkgewogICAgICBpZiAocmVzdWx0ID09PSB2b2lkIDApIHsKICAgICAgICByZXN1bHQgPSBuZXcgVmVjMygpOwogICAgICB9CgogICAgICBxdWF0ZXJuaW9uLnZtdWx0KGxvY2FsVmVjdG9yLCByZXN1bHQpOwogICAgICByZXR1cm4gcmVzdWx0OwogICAgfQogICAgLyoqCiAgICAgKiB2ZWN0b3JUb0xvY2FsRnJhbWUKICAgICAqLwoKCiAgICBzdGF0aWMgdmVjdG9yVG9Mb2NhbEZyYW1lKHBvc2l0aW9uLCBxdWF0ZXJuaW9uLCB3b3JsZFZlY3RvciwgcmVzdWx0KSB7CiAgICAgIGlmIChyZXN1bHQgPT09IHZvaWQgMCkgewogICAgICAgIHJlc3VsdCA9IG5ldyBWZWMzKCk7CiAgICAgIH0KCiAgICAgIHF1YXRlcm5pb24udyAqPSAtMTsKICAgICAgcXVhdGVybmlvbi52bXVsdCh3b3JsZFZlY3RvciwgcmVzdWx0KTsKICAgICAgcXVhdGVybmlvbi53ICo9IC0xOwogICAgICByZXR1cm4gcmVzdWx0OwogICAgfQoKICB9CiAgY29uc3QgdG1wUXVhdCQxID0gbmV3IFF1YXRlcm5pb24oKTsKCiAgLyoqCiAgICogQSBzZXQgb2YgcG9seWdvbnMgZGVzY3JpYmluZyBhIGNvbnZleCBzaGFwZS4KICAgKgogICAqIFRoZSBzaGFwZSBNVVNUIGJlIGNvbnZleCBmb3IgdGhlIGNvZGUgdG8gd29yayBwcm9wZXJseS4gTm8gcG9seWdvbnMgbWF5IGJlIGNvcGxhbmFyIChjb250YWluZWQKICAgKiBpbiB0aGUgc2FtZSAzRCBwbGFuZSksIGluc3RlYWQgdGhlc2Ugc2hvdWxkIGJlIG1lcmdlZCBpbnRvIG9uZSBwb2x5Z29uLgogICAqCiAgICogQGF1dGhvciBxaWFvIC8gaHR0cHM6Ly9naXRodWIuY29tL3FpYW8gKG9yaWdpbmFsIGF1dGhvciwgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9xaWFvL3RocmVlLmpzL2NvbW1pdC84NTAyNmYwYzc2OWU0MDAwMTQ4YTY3ZDQ1YTllOWI5YzUxMDg4MzZmKQogICAqIEBhdXRob3Igc2NodGVwcGUgLyBodHRwczovL2dpdGh1Yi5jb20vc2NodGVwcGUKICAgKiBAc2VlIGh0dHBzOi8vd3d3LmFsdGRldmJsb2dhZGF5LmNvbS8yMDExLzA1LzEzL2NvbnRhY3QtZ2VuZXJhdGlvbi1iZXR3ZWVuLTNkLWNvbnZleC1tZXNoZXMvCiAgICoKICAgKiBAdG9kbyBNb3ZlIHRoZSBjbGlwcGluZyBmdW5jdGlvbnMgdG8gQ29udGFjdEdlbmVyYXRvcj8KICAgKiBAdG9kbyBBdXRvbWF0aWNhbGx5IG1lcmdlIGNvcGxhbmFyIHBvbHlnb25zIGluIGNvbnN0cnVjdG9yLgogICAqIEBleGFtcGxlCiAgICogICAgIGNvbnN0IGNvbnZleFNoYXBlID0gbmV3IENBTk5PTi5Db252ZXhQb2x5aGVkcm9uKHsgdmVydGljZXMsIGZhY2VzIH0pCiAgICogICAgIGNvbnN0IGNvbnZleEJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoeyBtYXNzOiAxLCBzaGFwZTogY29udmV4U2hhcGUgfSkKICAgKiAgICAgd29ybGQuYWRkQm9keShjb252ZXhCb2R5KQogICAqLwogIGNsYXNzIENvbnZleFBvbHloZWRyb24gZXh0ZW5kcyBTaGFwZSB7CiAgICAvKiogdmVydGljZXMgKi8KCiAgICAvKioKICAgICAqIEFycmF5IG9mIGludGVnZXIgYXJyYXlzLCBpbmRpY2F0aW5nIHdoaWNoIHZlcnRpY2VzIGVhY2ggZmFjZSBjb25zaXN0cyBvZgogICAgICovCgogICAgLyoqIGZhY2VOb3JtYWxzICovCgogICAgLyoqIHdvcmxkVmVydGljZXMgKi8KCiAgICAvKiogd29ybGRWZXJ0aWNlc05lZWRzVXBkYXRlICovCgogICAgLyoqIHdvcmxkRmFjZU5vcm1hbHMgKi8KCiAgICAvKiogd29ybGRGYWNlTm9ybWFsc05lZWRzVXBkYXRlICovCgogICAgLyoqCiAgICAgKiBJZiBnaXZlbiwgdGhlc2UgbG9jYWxseSBkZWZpbmVkLCBub3JtYWxpemVkIGF4ZXMgYXJlIHRoZSBvbmx5IG9uZXMgYmVpbmcgY2hlY2tlZCB3aGVuIGRvaW5nIHNlcGFyYXRpbmcgYXhpcyBjaGVjay4KICAgICAqLwoKICAgIC8qKiB1bmlxdWVFZGdlcyAqLwoKICAgIC8qKgogICAgICogQHBhcmFtIHZlcnRpY2VzIEFuIGFycmF5IG9mIFZlYzMncwogICAgICogQHBhcmFtIGZhY2VzIEFycmF5IG9mIGludGVnZXIgYXJyYXlzLCBkZXNjcmliaW5nIHdoaWNoIHZlcnRpY2VzIHRoYXQgaXMgaW5jbHVkZWQgaW4gZWFjaCBmYWNlLgogICAgICovCiAgICBjb25zdHJ1Y3Rvcihwcm9wcykgewogICAgICBpZiAocHJvcHMgPT09IHZvaWQgMCkgewogICAgICAgIHByb3BzID0ge307CiAgICAgIH0KCiAgICAgIGNvbnN0IHsKICAgICAgICB2ZXJ0aWNlcyA9IFtdLAogICAgICAgIGZhY2VzID0gW10sCiAgICAgICAgbm9ybWFscyA9IFtdLAogICAgICAgIGF4ZXMsCiAgICAgICAgYm91bmRpbmdTcGhlcmVSYWRpdXMKICAgICAgfSA9IHByb3BzOwogICAgICBzdXBlcih7CiAgICAgICAgdHlwZTogU2hhcGUudHlwZXMuQ09OVkVYUE9MWUhFRFJPTgogICAgICB9KTsKICAgICAgdGhpcy52ZXJ0aWNlcyA9IHZlcnRpY2VzOwogICAgICB0aGlzLmZhY2VzID0gZmFjZXM7CiAgICAgIHRoaXMuZmFjZU5vcm1hbHMgPSBub3JtYWxzOwoKICAgICAgaWYgKHRoaXMuZmFjZU5vcm1hbHMubGVuZ3RoID09PSAwKSB7CiAgICAgICAgdGhpcy5jb21wdXRlTm9ybWFscygpOwogICAgICB9CgogICAgICBpZiAoIWJvdW5kaW5nU3BoZXJlUmFkaXVzKSB7CiAgICAgICAgdGhpcy51cGRhdGVCb3VuZGluZ1NwaGVyZVJhZGl1cygpOwogICAgICB9IGVsc2UgewogICAgICAgIHRoaXMuYm91bmRpbmdTcGhlcmVSYWRpdXMgPSBib3VuZGluZ1NwaGVyZVJhZGl1czsKICAgICAgfQoKICAgICAgdGhpcy53b3JsZFZlcnRpY2VzID0gW107IC8vIFdvcmxkIHRyYW5zZm9ybWVkIHZlcnNpb24gb2YgLnZlcnRpY2VzCgogICAgICB0aGlzLndvcmxkVmVydGljZXNOZWVkc1VwZGF0ZSA9IHRydWU7CiAgICAgIHRoaXMud29ybGRGYWNlTm9ybWFscyA9IFtdOyAvLyBXb3JsZCB0cmFuc2Zvcm1lZCB2ZXJzaW9uIG9mIC5mYWNlTm9ybWFscwoKICAgICAgdGhpcy53b3JsZEZhY2VOb3JtYWxzTmVlZHNVcGRhdGUgPSB0cnVlOwogICAgICB0aGlzLnVuaXF1ZUF4ZXMgPSBheGVzID8gYXhlcy5zbGljZSgpIDogbnVsbDsKICAgICAgdGhpcy51bmlxdWVFZGdlcyA9IFtdOwogICAgICB0aGlzLmNvbXB1dGVFZGdlcygpOwogICAgfQogICAgLyoqCiAgICAgKiBDb21wdXRlcyB1bmlxdWVFZGdlcwogICAgICovCgoKICAgIGNvbXB1dGVFZGdlcygpIHsKICAgICAgY29uc3QgZmFjZXMgPSB0aGlzLmZhY2VzOwogICAgICBjb25zdCB2ZXJ0aWNlcyA9IHRoaXMudmVydGljZXM7CiAgICAgIGNvbnN0IGVkZ2VzID0gdGhpcy51bmlxdWVFZGdlczsKICAgICAgZWRnZXMubGVuZ3RoID0gMDsKICAgICAgY29uc3QgZWRnZSA9IG5ldyBWZWMzKCk7CgogICAgICBmb3IgKGxldCBpID0gMDsgaSAhPT0gZmFjZXMubGVuZ3RoOyBpKyspIHsKICAgICAgICBjb25zdCBmYWNlID0gZmFjZXNbaV07CiAgICAgICAgY29uc3QgbnVtVmVydGljZXMgPSBmYWNlLmxlbmd0aDsKCiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogIT09IG51bVZlcnRpY2VzOyBqKyspIHsKICAgICAgICAgIGNvbnN0IGsgPSAoaiArIDEpICUgbnVtVmVydGljZXM7CiAgICAgICAgICB2ZXJ0aWNlc1tmYWNlW2pdXS52c3ViKHZlcnRpY2VzW2ZhY2Vba11dLCBlZGdlKTsKICAgICAgICAgIGVkZ2Uubm9ybWFsaXplKCk7CiAgICAgICAgICBsZXQgZm91bmQgPSBmYWxzZTsKCiAgICAgICAgICBmb3IgKGxldCBwID0gMDsgcCAhPT0gZWRnZXMubGVuZ3RoOyBwKyspIHsKICAgICAgICAgICAgaWYgKGVkZ2VzW3BdLmFsbW9zdEVxdWFscyhlZGdlKSB8fCBlZGdlc1twXS5hbG1vc3RFcXVhbHMoZWRnZSkpIHsKICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7CiAgICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICAgIH0KICAgICAgICAgIH0KCiAgICAgICAgICBpZiAoIWZvdW5kKSB7CiAgICAgICAgICAgIGVkZ2VzLnB1c2goZWRnZS5jbG9uZSgpKTsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KICAgIH0KICAgIC8qKgogICAgICogQ29tcHV0ZSB0aGUgbm9ybWFscyBvZiB0aGUgZmFjZXMuCiAgICAgKiBXaWxsIHJldXNlIGV4aXN0aW5nIFZlYzMgb2JqZWN0cyBpbiB0aGUgYGZhY2VOb3JtYWxzYCBhcnJheSBpZiB0aGV5IGV4aXN0LgogICAgICovCgoKICAgIGNvbXB1dGVOb3JtYWxzKCkgewogICAgICB0aGlzLmZhY2VOb3JtYWxzLmxlbmd0aCA9IHRoaXMuZmFjZXMubGVuZ3RoOyAvLyBHZW5lcmF0ZSBub3JtYWxzCgogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZmFjZXMubGVuZ3RoOyBpKyspIHsKICAgICAgICAvLyBDaGVjayBzbyBhbGwgdmVydGljZXMgZXhpc3RzIGZvciB0aGlzIGZhY2UKICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuZmFjZXNbaV0ubGVuZ3RoOyBqKyspIHsKICAgICAgICAgIGlmICghdGhpcy52ZXJ0aWNlc1t0aGlzLmZhY2VzW2ldW2pdXSkgewogICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFZlcnRleCAke3RoaXMuZmFjZXNbaV1bal19IG5vdCBmb3VuZCFgKTsKICAgICAgICAgIH0KICAgICAgICB9CgogICAgICAgIGNvbnN0IG4gPSB0aGlzLmZhY2VOb3JtYWxzW2ldIHx8IG5ldyBWZWMzKCk7CiAgICAgICAgdGhpcy5nZXRGYWNlTm9ybWFsKGksIG4pOwogICAgICAgIG4ubmVnYXRlKG4pOwogICAgICAgIHRoaXMuZmFjZU5vcm1hbHNbaV0gPSBuOwogICAgICAgIGNvbnN0IHZlcnRleCA9IHRoaXMudmVydGljZXNbdGhpcy5mYWNlc1tpXVswXV07CgogICAgICAgIGlmIChuLmRvdCh2ZXJ0ZXgpIDwgMCkgewogICAgICAgICAgY29uc29sZS5lcnJvcihgLmZhY2VOb3JtYWxzWyR7aX1dID0gVmVjMygke24udG9TdHJpbmcoKX0pIGxvb2tzIGxpa2UgaXQgcG9pbnRzIGludG8gdGhlIHNoYXBlPyBUaGUgdmVydGljZXMgZm9sbG93LiBNYWtlIHN1cmUgdGhleSBhcmUgb3JkZXJlZCBDQ1cgYXJvdW5kIHRoZSBub3JtYWwsIHVzaW5nIHRoZSByaWdodCBoYW5kIHJ1bGUuYCk7CgogICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmZhY2VzW2ldLmxlbmd0aDsgaisrKSB7CiAgICAgICAgICAgIGNvbnNvbGUud2FybihgLnZlcnRpY2VzWyR7dGhpcy5mYWNlc1tpXVtqXX1dID0gVmVjMygke3RoaXMudmVydGljZXNbdGhpcy5mYWNlc1tpXVtqXV0udG9TdHJpbmcoKX0pYCk7CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9CiAgICB9CiAgICAvKioKICAgICAqIENvbXB1dGUgdGhlIG5vcm1hbCBvZiBhIGZhY2UgZnJvbSBpdHMgdmVydGljZXMKICAgICAqLwoKCiAgICBnZXRGYWNlTm9ybWFsKGksIHRhcmdldCkgewogICAgICBjb25zdCBmID0gdGhpcy5mYWNlc1tpXTsKICAgICAgY29uc3QgdmEgPSB0aGlzLnZlcnRpY2VzW2ZbMF1dOwogICAgICBjb25zdCB2YiA9IHRoaXMudmVydGljZXNbZlsxXV07CiAgICAgIGNvbnN0IHZjID0gdGhpcy52ZXJ0aWNlc1tmWzJdXTsKICAgICAgQ29udmV4UG9seWhlZHJvbi5jb21wdXRlTm9ybWFsKHZhLCB2YiwgdmMsIHRhcmdldCk7CiAgICB9CiAgICAvKioKICAgICAqIEdldCBmYWNlIG5vcm1hbCBnaXZlbiAzIHZlcnRpY2VzCiAgICAgKi8KCgogICAgc3RhdGljIGNvbXB1dGVOb3JtYWwodmEsIHZiLCB2YywgdGFyZ2V0KSB7CiAgICAgIGNvbnN0IGNiID0gbmV3IFZlYzMoKTsKICAgICAgY29uc3QgYWIgPSBuZXcgVmVjMygpOwogICAgICB2Yi52c3ViKHZhLCBhYik7CiAgICAgIHZjLnZzdWIodmIsIGNiKTsKICAgICAgY2IuY3Jvc3MoYWIsIHRhcmdldCk7CgogICAgICBpZiAoIXRhcmdldC5pc1plcm8oKSkgewogICAgICAgIHRhcmdldC5ub3JtYWxpemUoKTsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBAcGFyYW0gbWluRGlzdCBDbGFtcCBkaXN0YW5jZQogICAgICogQHBhcmFtIHJlc3VsdCBUaGUgYW4gYXJyYXkgb2YgY29udGFjdCBwb2ludCBvYmplY3RzLCBzZWUgY2xpcEZhY2VBZ2FpbnN0SHVsbAogICAgICovCgoKICAgIGNsaXBBZ2FpbnN0SHVsbChwb3NBLCBxdWF0QSwgaHVsbEIsIHBvc0IsIHF1YXRCLCBzZXBhcmF0aW5nTm9ybWFsLCBtaW5EaXN0LCBtYXhEaXN0LCByZXN1bHQpIHsKICAgICAgY29uc3QgV29ybGROb3JtYWwgPSBuZXcgVmVjMygpOwogICAgICBsZXQgY2xvc2VzdEZhY2VCID0gLTE7CiAgICAgIGxldCBkbWF4ID0gLU51bWJlci5NQVhfVkFMVUU7CgogICAgICBmb3IgKGxldCBmYWNlID0gMDsgZmFjZSA8IGh1bGxCLmZhY2VzLmxlbmd0aDsgZmFjZSsrKSB7CiAgICAgICAgV29ybGROb3JtYWwuY29weShodWxsQi5mYWNlTm9ybWFsc1tmYWNlXSk7CiAgICAgICAgcXVhdEIudm11bHQoV29ybGROb3JtYWwsIFdvcmxkTm9ybWFsKTsKICAgICAgICBjb25zdCBkID0gV29ybGROb3JtYWwuZG90KHNlcGFyYXRpbmdOb3JtYWwpOwoKICAgICAgICBpZiAoZCA+IGRtYXgpIHsKICAgICAgICAgIGRtYXggPSBkOwogICAgICAgICAgY2xvc2VzdEZhY2VCID0gZmFjZTsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIGNvbnN0IHdvcmxkVmVydHNCMSA9IFtdOwoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBodWxsQi5mYWNlc1tjbG9zZXN0RmFjZUJdLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgY29uc3QgYiA9IGh1bGxCLnZlcnRpY2VzW2h1bGxCLmZhY2VzW2Nsb3Nlc3RGYWNlQl1baV1dOwogICAgICAgIGNvbnN0IHdvcmxkYiA9IG5ldyBWZWMzKCk7CiAgICAgICAgd29ybGRiLmNvcHkoYik7CiAgICAgICAgcXVhdEIudm11bHQod29ybGRiLCB3b3JsZGIpOwogICAgICAgIHBvc0IudmFkZCh3b3JsZGIsIHdvcmxkYik7CiAgICAgICAgd29ybGRWZXJ0c0IxLnB1c2god29ybGRiKTsKICAgICAgfQoKICAgICAgaWYgKGNsb3Nlc3RGYWNlQiA+PSAwKSB7CiAgICAgICAgdGhpcy5jbGlwRmFjZUFnYWluc3RIdWxsKHNlcGFyYXRpbmdOb3JtYWwsIHBvc0EsIHF1YXRBLCB3b3JsZFZlcnRzQjEsIG1pbkRpc3QsIG1heERpc3QsIHJlc3VsdCk7CiAgICAgIH0KICAgIH0KICAgIC8qKgogICAgICogRmluZCB0aGUgc2VwYXJhdGluZyBheGlzIGJldHdlZW4gdGhpcyBodWxsIGFuZCBhbm90aGVyCiAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgdmVjdG9yIHRvIHNhdmUgdGhlIGF4aXMgaW4KICAgICAqIEByZXR1cm4gUmV0dXJucyBmYWxzZSBpZiBhIHNlcGFyYXRpb24gaXMgZm91bmQsIGVsc2UgdHJ1ZQogICAgICovCgoKICAgIGZpbmRTZXBhcmF0aW5nQXhpcyhodWxsQiwgcG9zQSwgcXVhdEEsIHBvc0IsIHF1YXRCLCB0YXJnZXQsIGZhY2VMaXN0QSwgZmFjZUxpc3RCKSB7CiAgICAgIGNvbnN0IGZhY2VBTm9ybWFsV1MzID0gbmV3IFZlYzMoKTsKICAgICAgY29uc3QgV29ybGRub3JtYWwxID0gbmV3IFZlYzMoKTsKICAgICAgY29uc3QgZGVsdGFDID0gbmV3IFZlYzMoKTsKICAgICAgY29uc3Qgd29ybGRFZGdlMCA9IG5ldyBWZWMzKCk7CiAgICAgIGNvbnN0IHdvcmxkRWRnZTEgPSBuZXcgVmVjMygpOwogICAgICBjb25zdCBDcm9zcyA9IG5ldyBWZWMzKCk7CiAgICAgIGxldCBkbWluID0gTnVtYmVyLk1BWF9WQUxVRTsKICAgICAgY29uc3QgaHVsbEEgPSB0aGlzOwoKICAgICAgaWYgKCFodWxsQS51bmlxdWVBeGVzKSB7CiAgICAgICAgY29uc3QgbnVtRmFjZXNBID0gZmFjZUxpc3RBID8gZmFjZUxpc3RBLmxlbmd0aCA6IGh1bGxBLmZhY2VzLmxlbmd0aDsgLy8gVGVzdCBmYWNlIG5vcm1hbHMgZnJvbSBodWxsQQoKICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bUZhY2VzQTsgaSsrKSB7CiAgICAgICAgICBjb25zdCBmaSA9IGZhY2VMaXN0QSA/IGZhY2VMaXN0QVtpXSA6IGk7IC8vIEdldCB3b3JsZCBmYWNlIG5vcm1hbAoKICAgICAgICAgIGZhY2VBTm9ybWFsV1MzLmNvcHkoaHVsbEEuZmFjZU5vcm1hbHNbZmldKTsKICAgICAgICAgIHF1YXRBLnZtdWx0KGZhY2VBTm9ybWFsV1MzLCBmYWNlQU5vcm1hbFdTMyk7CiAgICAgICAgICBjb25zdCBkID0gaHVsbEEudGVzdFNlcEF4aXMoZmFjZUFOb3JtYWxXUzMsIGh1bGxCLCBwb3NBLCBxdWF0QSwgcG9zQiwgcXVhdEIpOwoKICAgICAgICAgIGlmIChkID09PSBmYWxzZSkgewogICAgICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgICAgICB9CgogICAgICAgICAgaWYgKGQgPCBkbWluKSB7CiAgICAgICAgICAgIGRtaW4gPSBkOwogICAgICAgICAgICB0YXJnZXQuY29weShmYWNlQU5vcm1hbFdTMyk7CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9IGVsc2UgewogICAgICAgIC8vIFRlc3QgdW5pcXVlIGF4ZXMKICAgICAgICBmb3IgKGxldCBpID0gMDsgaSAhPT0gaHVsbEEudW5pcXVlQXhlcy5sZW5ndGg7IGkrKykgewogICAgICAgICAgLy8gR2V0IHdvcmxkIGF4aXMKICAgICAgICAgIHF1YXRBLnZtdWx0KGh1bGxBLnVuaXF1ZUF4ZXNbaV0sIGZhY2VBTm9ybWFsV1MzKTsKICAgICAgICAgIGNvbnN0IGQgPSBodWxsQS50ZXN0U2VwQXhpcyhmYWNlQU5vcm1hbFdTMywgaHVsbEIsIHBvc0EsIHF1YXRBLCBwb3NCLCBxdWF0Qik7CgogICAgICAgICAgaWYgKGQgPT09IGZhbHNlKSB7CiAgICAgICAgICAgIHJldHVybiBmYWxzZTsKICAgICAgICAgIH0KCiAgICAgICAgICBpZiAoZCA8IGRtaW4pIHsKICAgICAgICAgICAgZG1pbiA9IGQ7CiAgICAgICAgICAgIHRhcmdldC5jb3B5KGZhY2VBTm9ybWFsV1MzKTsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KCiAgICAgIGlmICghaHVsbEIudW5pcXVlQXhlcykgewogICAgICAgIC8vIFRlc3QgZmFjZSBub3JtYWxzIGZyb20gaHVsbEIKICAgICAgICBjb25zdCBudW1GYWNlc0IgPSBmYWNlTGlzdEIgPyBmYWNlTGlzdEIubGVuZ3RoIDogaHVsbEIuZmFjZXMubGVuZ3RoOwoKICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bUZhY2VzQjsgaSsrKSB7CiAgICAgICAgICBjb25zdCBmaSA9IGZhY2VMaXN0QiA/IGZhY2VMaXN0QltpXSA6IGk7CiAgICAgICAgICBXb3JsZG5vcm1hbDEuY29weShodWxsQi5mYWNlTm9ybWFsc1tmaV0pOwogICAgICAgICAgcXVhdEIudm11bHQoV29ybGRub3JtYWwxLCBXb3JsZG5vcm1hbDEpOwogICAgICAgICAgY29uc3QgZCA9IGh1bGxBLnRlc3RTZXBBeGlzKFdvcmxkbm9ybWFsMSwgaHVsbEIsIHBvc0EsIHF1YXRBLCBwb3NCLCBxdWF0Qik7CgogICAgICAgICAgaWYgKGQgPT09IGZhbHNlKSB7CiAgICAgICAgICAgIHJldHVybiBmYWxzZTsKICAgICAgICAgIH0KCiAgICAgICAgICBpZiAoZCA8IGRtaW4pIHsKICAgICAgICAgICAgZG1pbiA9IGQ7CiAgICAgICAgICAgIHRhcmdldC5jb3B5KFdvcmxkbm9ybWFsMSk7CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9IGVsc2UgewogICAgICAgIC8vIFRlc3QgdW5pcXVlIGF4ZXMgaW4gQgogICAgICAgIGZvciAobGV0IGkgPSAwOyBpICE9PSBodWxsQi51bmlxdWVBeGVzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgICBxdWF0Qi52bXVsdChodWxsQi51bmlxdWVBeGVzW2ldLCBXb3JsZG5vcm1hbDEpOwogICAgICAgICAgY29uc3QgZCA9IGh1bGxBLnRlc3RTZXBBeGlzKFdvcmxkbm9ybWFsMSwgaHVsbEIsIHBvc0EsIHF1YXRBLCBwb3NCLCBxdWF0Qik7CgogICAgICAgICAgaWYgKGQgPT09IGZhbHNlKSB7CiAgICAgICAgICAgIHJldHVybiBmYWxzZTsKICAgICAgICAgIH0KCiAgICAgICAgICBpZiAoZCA8IGRtaW4pIHsKICAgICAgICAgICAgZG1pbiA9IGQ7CiAgICAgICAgICAgIHRhcmdldC5jb3B5KFdvcmxkbm9ybWFsMSk7CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9IC8vIFRlc3QgZWRnZXMKCgogICAgICBmb3IgKGxldCBlMCA9IDA7IGUwICE9PSBodWxsQS51bmlxdWVFZGdlcy5sZW5ndGg7IGUwKyspIHsKICAgICAgICAvLyBHZXQgd29ybGQgZWRnZQogICAgICAgIHF1YXRBLnZtdWx0KGh1bGxBLnVuaXF1ZUVkZ2VzW2UwXSwgd29ybGRFZGdlMCk7CgogICAgICAgIGZvciAobGV0IGUxID0gMDsgZTEgIT09IGh1bGxCLnVuaXF1ZUVkZ2VzLmxlbmd0aDsgZTErKykgewogICAgICAgICAgLy8gR2V0IHdvcmxkIGVkZ2UgMgogICAgICAgICAgcXVhdEIudm11bHQoaHVsbEIudW5pcXVlRWRnZXNbZTFdLCB3b3JsZEVkZ2UxKTsKICAgICAgICAgIHdvcmxkRWRnZTAuY3Jvc3Mod29ybGRFZGdlMSwgQ3Jvc3MpOwoKICAgICAgICAgIGlmICghQ3Jvc3MuYWxtb3N0WmVybygpKSB7CiAgICAgICAgICAgIENyb3NzLm5vcm1hbGl6ZSgpOwogICAgICAgICAgICBjb25zdCBkaXN0ID0gaHVsbEEudGVzdFNlcEF4aXMoQ3Jvc3MsIGh1bGxCLCBwb3NBLCBxdWF0QSwgcG9zQiwgcXVhdEIpOwoKICAgICAgICAgICAgaWYgKGRpc3QgPT09IGZhbHNlKSB7CiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOwogICAgICAgICAgICB9CgogICAgICAgICAgICBpZiAoZGlzdCA8IGRtaW4pIHsKICAgICAgICAgICAgICBkbWluID0gZGlzdDsKICAgICAgICAgICAgICB0YXJnZXQuY29weShDcm9zcyk7CiAgICAgICAgICAgIH0KICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KCiAgICAgIHBvc0IudnN1Yihwb3NBLCBkZWx0YUMpOwoKICAgICAgaWYgKGRlbHRhQy5kb3QodGFyZ2V0KSA+IDAuMCkgewogICAgICAgIHRhcmdldC5uZWdhdGUodGFyZ2V0KTsKICAgICAgfQoKICAgICAgcmV0dXJuIHRydWU7CiAgICB9CiAgICAvKioKICAgICAqIFRlc3Qgc2VwYXJhdGluZyBheGlzIGFnYWluc3QgdHdvIGh1bGxzLiBCb3RoIGh1bGxzIGFyZSBwcm9qZWN0ZWQgb250byB0aGUgYXhpcyBhbmQgdGhlIG92ZXJsYXAgc2l6ZSBpcyByZXR1cm5lZCBpZiB0aGVyZSBpcyBvbmUuCiAgICAgKiBAcmV0dXJuIFRoZSBvdmVybGFwIGRlcHRoLCBvciBGQUxTRSBpZiBubyBwZW5ldHJhdGlvbi4KICAgICAqLwoKCiAgICB0ZXN0U2VwQXhpcyhheGlzLCBodWxsQiwgcG9zQSwgcXVhdEEsIHBvc0IsIHF1YXRCKSB7CiAgICAgIGNvbnN0IGh1bGxBID0gdGhpczsKICAgICAgQ29udmV4UG9seWhlZHJvbi5wcm9qZWN0KGh1bGxBLCBheGlzLCBwb3NBLCBxdWF0QSwgbWF4bWluQSk7CiAgICAgIENvbnZleFBvbHloZWRyb24ucHJvamVjdChodWxsQiwgYXhpcywgcG9zQiwgcXVhdEIsIG1heG1pbkIpOwogICAgICBjb25zdCBtYXhBID0gbWF4bWluQVswXTsKICAgICAgY29uc3QgbWluQSA9IG1heG1pbkFbMV07CiAgICAgIGNvbnN0IG1heEIgPSBtYXhtaW5CWzBdOwogICAgICBjb25zdCBtaW5CID0gbWF4bWluQlsxXTsKCiAgICAgIGlmIChtYXhBIDwgbWluQiB8fCBtYXhCIDwgbWluQSkgewogICAgICAgIHJldHVybiBmYWxzZTsgLy8gU2VwYXJhdGVkCiAgICAgIH0KCiAgICAgIGNvbnN0IGQwID0gbWF4QSAtIG1pbkI7CiAgICAgIGNvbnN0IGQxID0gbWF4QiAtIG1pbkE7CiAgICAgIGNvbnN0IGRlcHRoID0gZDAgPCBkMSA/IGQwIDogZDE7CiAgICAgIHJldHVybiBkZXB0aDsKICAgIH0KICAgIC8qKgogICAgICogY2FsY3VsYXRlTG9jYWxJbmVydGlhCiAgICAgKi8KCgogICAgY2FsY3VsYXRlTG9jYWxJbmVydGlhKG1hc3MsIHRhcmdldCkgewogICAgICAvLyBBcHByb3hpbWF0ZSB3aXRoIGJveCBpbmVydGlhCiAgICAgIC8vIEV4YWN0IGluZXJ0aWEgY2FsY3VsYXRpb24gaXMgb3ZlcmtpbGwsIGJ1dCBzZWUgaHR0cDovL2dlb21ldHJpY3Rvb2xzLmNvbS9Eb2N1bWVudGF0aW9uL1BvbHloZWRyYWxNYXNzUHJvcGVydGllcy5wZGYgZm9yIHRoZSBjb3JyZWN0IHdheSB0byBkbyBpdAogICAgICBjb25zdCBhYWJibWF4ID0gbmV3IFZlYzMoKTsKICAgICAgY29uc3QgYWFiYm1pbiA9IG5ldyBWZWMzKCk7CiAgICAgIHRoaXMuY29tcHV0ZUxvY2FsQUFCQihhYWJibWluLCBhYWJibWF4KTsKICAgICAgY29uc3QgeCA9IGFhYmJtYXgueCAtIGFhYmJtaW4ueDsKICAgICAgY29uc3QgeSA9IGFhYmJtYXgueSAtIGFhYmJtaW4ueTsKICAgICAgY29uc3QgeiA9IGFhYmJtYXgueiAtIGFhYmJtaW4uejsKICAgICAgdGFyZ2V0LnggPSAxLjAgLyAxMi4wICogbWFzcyAqICgyICogeSAqIDIgKiB5ICsgMiAqIHogKiAyICogeik7CiAgICAgIHRhcmdldC55ID0gMS4wIC8gMTIuMCAqIG1hc3MgKiAoMiAqIHggKiAyICogeCArIDIgKiB6ICogMiAqIHopOwogICAgICB0YXJnZXQueiA9IDEuMCAvIDEyLjAgKiBtYXNzICogKDIgKiB5ICogMiAqIHkgKyAyICogeCAqIDIgKiB4KTsKICAgIH0KICAgIC8qKgogICAgICogQHBhcmFtIGZhY2VfaSBJbmRleCBvZiB0aGUgZmFjZQogICAgICovCgoKICAgIGdldFBsYW5lQ29uc3RhbnRPZkZhY2UoZmFjZV9pKSB7CiAgICAgIGNvbnN0IGYgPSB0aGlzLmZhY2VzW2ZhY2VfaV07CiAgICAgIGNvbnN0IG4gPSB0aGlzLmZhY2VOb3JtYWxzW2ZhY2VfaV07CiAgICAgIGNvbnN0IHYgPSB0aGlzLnZlcnRpY2VzW2ZbMF1dOwogICAgICBjb25zdCBjID0gLW4uZG90KHYpOwogICAgICByZXR1cm4gYzsKICAgIH0KICAgIC8qKgogICAgICogQ2xpcCBhIGZhY2UgYWdhaW5zdCBhIGh1bGwuCiAgICAgKiBAcGFyYW0gd29ybGRWZXJ0c0IxIEFuIGFycmF5IG9mIFZlYzMgd2l0aCB2ZXJ0aWNlcyBpbiB0aGUgd29ybGQgZnJhbWUuCiAgICAgKiBAcGFyYW0gbWluRGlzdCBEaXN0YW5jZSBjbGFtcGluZwogICAgICogQHBhcmFtIEFycmF5IHJlc3VsdCBBcnJheSB0byBzdG9yZSByZXN1bHRpbmcgY29udGFjdCBwb2ludHMgaW4uIFdpbGwgYmUgb2JqZWN0cyB3aXRoIHByb3BlcnRpZXM6IHBvaW50LCBkZXB0aCwgbm9ybWFsLiBUaGVzZSBhcmUgcmVwcmVzZW50ZWQgaW4gd29ybGQgY29vcmRpbmF0ZXMuCiAgICAgKi8KCgogICAgY2xpcEZhY2VBZ2FpbnN0SHVsbChzZXBhcmF0aW5nTm9ybWFsLCBwb3NBLCBxdWF0QSwgd29ybGRWZXJ0c0IxLCBtaW5EaXN0LCBtYXhEaXN0LCByZXN1bHQpIHsKICAgICAgY29uc3QgZmFjZUFOb3JtYWxXUyA9IG5ldyBWZWMzKCk7CiAgICAgIGNvbnN0IGVkZ2UwID0gbmV3IFZlYzMoKTsKICAgICAgY29uc3QgV29ybGRFZGdlMCA9IG5ldyBWZWMzKCk7CiAgICAgIGNvbnN0IHdvcmxkUGxhbmVBbm9ybWFsMSA9IG5ldyBWZWMzKCk7CiAgICAgIGNvbnN0IHBsYW5lTm9ybWFsV1MxID0gbmV3IFZlYzMoKTsKICAgICAgY29uc3Qgd29ybGRBMSA9IG5ldyBWZWMzKCk7CiAgICAgIGNvbnN0IGxvY2FsUGxhbmVOb3JtYWwgPSBuZXcgVmVjMygpOwogICAgICBjb25zdCBwbGFuZU5vcm1hbFdTID0gbmV3IFZlYzMoKTsKICAgICAgY29uc3QgaHVsbEEgPSB0aGlzOwogICAgICBjb25zdCB3b3JsZFZlcnRzQjIgPSBbXTsKICAgICAgY29uc3QgcFZ0eEluID0gd29ybGRWZXJ0c0IxOwogICAgICBjb25zdCBwVnR4T3V0ID0gd29ybGRWZXJ0c0IyOwogICAgICBsZXQgY2xvc2VzdEZhY2VBID0gLTE7CiAgICAgIGxldCBkbWluID0gTnVtYmVyLk1BWF9WQUxVRTsgLy8gRmluZCB0aGUgZmFjZSB3aXRoIG5vcm1hbCBjbG9zZXN0IHRvIHRoZSBzZXBhcmF0aW5nIGF4aXMKCiAgICAgIGZvciAobGV0IGZhY2UgPSAwOyBmYWNlIDwgaHVsbEEuZmFjZXMubGVuZ3RoOyBmYWNlKyspIHsKICAgICAgICBmYWNlQU5vcm1hbFdTLmNvcHkoaHVsbEEuZmFjZU5vcm1hbHNbZmFjZV0pOwogICAgICAgIHF1YXRBLnZtdWx0KGZhY2VBTm9ybWFsV1MsIGZhY2VBTm9ybWFsV1MpOwogICAgICAgIGNvbnN0IGQgPSBmYWNlQU5vcm1hbFdTLmRvdChzZXBhcmF0aW5nTm9ybWFsKTsKCiAgICAgICAgaWYgKGQgPCBkbWluKSB7CiAgICAgICAgICBkbWluID0gZDsKICAgICAgICAgIGNsb3Nlc3RGYWNlQSA9IGZhY2U7CiAgICAgICAgfQogICAgICB9CgogICAgICBpZiAoY2xvc2VzdEZhY2VBIDwgMCkgewogICAgICAgIHJldHVybjsKICAgICAgfSAvLyBHZXQgdGhlIGZhY2UgYW5kIGNvbnN0cnVjdCBjb25uZWN0ZWQgZmFjZXMKCgogICAgICBjb25zdCBwb2x5QSA9IGh1bGxBLmZhY2VzW2Nsb3Nlc3RGYWNlQV07CiAgICAgIHBvbHlBLmNvbm5lY3RlZEZhY2VzID0gW107CgogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGh1bGxBLmZhY2VzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBodWxsQS5mYWNlc1tpXS5sZW5ndGg7IGorKykgewogICAgICAgICAgaWYgKAogICAgICAgICAgLyogU2hhcmluZyBhIHZlcnRleCovCiAgICAgICAgICBwb2x5QS5pbmRleE9mKGh1bGxBLmZhY2VzW2ldW2pdKSAhPT0gLTEgJiYKICAgICAgICAgIC8qIE5vdCB0aGUgb25lIHdlIGFyZSBsb29raW5nIGZvciBjb25uZWN0aW9ucyBmcm9tICovCiAgICAgICAgICBpICE9PSBjbG9zZXN0RmFjZUEgJiYKICAgICAgICAgIC8qIE5vdCBhbHJlYWR5IGFkZGVkICovCiAgICAgICAgICBwb2x5QS5jb25uZWN0ZWRGYWNlcy5pbmRleE9mKGkpID09PSAtMSkgewogICAgICAgICAgICBwb2x5QS5jb25uZWN0ZWRGYWNlcy5wdXNoKGkpOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfSAvLyBDbGlwIHRoZSBwb2x5Z29uIHRvIHRoZSBiYWNrIG9mIHRoZSBwbGFuZXMgb2YgYWxsIGZhY2VzIG9mIGh1bGwgQSwKICAgICAgLy8gdGhhdCBhcmUgYWRqYWNlbnQgdG8gdGhlIHdpdG5lc3MgZmFjZQoKCiAgICAgIGNvbnN0IG51bVZlcnRpY2VzQSA9IHBvbHlBLmxlbmd0aDsKCiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtVmVydGljZXNBOyBpKyspIHsKICAgICAgICBjb25zdCBhID0gaHVsbEEudmVydGljZXNbcG9seUFbaV1dOwogICAgICAgIGNvbnN0IGIgPSBodWxsQS52ZXJ0aWNlc1twb2x5QVsoaSArIDEpICUgbnVtVmVydGljZXNBXV07CiAgICAgICAgYS52c3ViKGIsIGVkZ2UwKTsKICAgICAgICBXb3JsZEVkZ2UwLmNvcHkoZWRnZTApOwogICAgICAgIHF1YXRBLnZtdWx0KFdvcmxkRWRnZTAsIFdvcmxkRWRnZTApOwogICAgICAgIHBvc0EudmFkZChXb3JsZEVkZ2UwLCBXb3JsZEVkZ2UwKTsKICAgICAgICB3b3JsZFBsYW5lQW5vcm1hbDEuY29weSh0aGlzLmZhY2VOb3JtYWxzW2Nsb3Nlc3RGYWNlQV0pOwogICAgICAgIHF1YXRBLnZtdWx0KHdvcmxkUGxhbmVBbm9ybWFsMSwgd29ybGRQbGFuZUFub3JtYWwxKTsKICAgICAgICBwb3NBLnZhZGQod29ybGRQbGFuZUFub3JtYWwxLCB3b3JsZFBsYW5lQW5vcm1hbDEpOwogICAgICAgIFdvcmxkRWRnZTAuY3Jvc3Mod29ybGRQbGFuZUFub3JtYWwxLCBwbGFuZU5vcm1hbFdTMSk7CiAgICAgICAgcGxhbmVOb3JtYWxXUzEubmVnYXRlKHBsYW5lTm9ybWFsV1MxKTsKICAgICAgICB3b3JsZEExLmNvcHkoYSk7CiAgICAgICAgcXVhdEEudm11bHQod29ybGRBMSwgd29ybGRBMSk7CiAgICAgICAgcG9zQS52YWRkKHdvcmxkQTEsIHdvcmxkQTEpOwogICAgICAgIGNvbnN0IG90aGVyRmFjZSA9IHBvbHlBLmNvbm5lY3RlZEZhY2VzW2ldOwogICAgICAgIGxvY2FsUGxhbmVOb3JtYWwuY29weSh0aGlzLmZhY2VOb3JtYWxzW290aGVyRmFjZV0pOwogICAgICAgIGNvbnN0IGxvY2FsUGxhbmVFcSA9IHRoaXMuZ2V0UGxhbmVDb25zdGFudE9mRmFjZShvdGhlckZhY2UpOwogICAgICAgIHBsYW5lTm9ybWFsV1MuY29weShsb2NhbFBsYW5lTm9ybWFsKTsKICAgICAgICBxdWF0QS52bXVsdChwbGFuZU5vcm1hbFdTLCBwbGFuZU5vcm1hbFdTKTsKICAgICAgICBjb25zdCBwbGFuZUVxV1MgPSBsb2NhbFBsYW5lRXEgLSBwbGFuZU5vcm1hbFdTLmRvdChwb3NBKTsgLy8gQ2xpcCBmYWNlIGFnYWluc3Qgb3VyIGNvbnN0cnVjdGVkIHBsYW5lCgogICAgICAgIHRoaXMuY2xpcEZhY2VBZ2FpbnN0UGxhbmUocFZ0eEluLCBwVnR4T3V0LCBwbGFuZU5vcm1hbFdTLCBwbGFuZUVxV1MpOyAvLyBUaHJvdyBhd2F5IGFsbCBjbGlwcGVkIHBvaW50cywgYnV0IHNhdmUgdGhlIHJlbWFpbmluZyB1bnRpbCBuZXh0IGNsaXAKCiAgICAgICAgd2hpbGUgKHBWdHhJbi5sZW5ndGgpIHsKICAgICAgICAgIHBWdHhJbi5zaGlmdCgpOwogICAgICAgIH0KCiAgICAgICAgd2hpbGUgKHBWdHhPdXQubGVuZ3RoKSB7CiAgICAgICAgICBwVnR4SW4ucHVzaChwVnR4T3V0LnNoaWZ0KCkpOwogICAgICAgIH0KICAgICAgfSAvLyBvbmx5IGtlZXAgY29udGFjdCBwb2ludHMgdGhhdCBhcmUgYmVoaW5kIHRoZSB3aXRuZXNzIGZhY2UKCgogICAgICBsb2NhbFBsYW5lTm9ybWFsLmNvcHkodGhpcy5mYWNlTm9ybWFsc1tjbG9zZXN0RmFjZUFdKTsKICAgICAgY29uc3QgbG9jYWxQbGFuZUVxID0gdGhpcy5nZXRQbGFuZUNvbnN0YW50T2ZGYWNlKGNsb3Nlc3RGYWNlQSk7CiAgICAgIHBsYW5lTm9ybWFsV1MuY29weShsb2NhbFBsYW5lTm9ybWFsKTsKICAgICAgcXVhdEEudm11bHQocGxhbmVOb3JtYWxXUywgcGxhbmVOb3JtYWxXUyk7CiAgICAgIGNvbnN0IHBsYW5lRXFXUyA9IGxvY2FsUGxhbmVFcSAtIHBsYW5lTm9ybWFsV1MuZG90KHBvc0EpOwoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwVnR4SW4ubGVuZ3RoOyBpKyspIHsKICAgICAgICBsZXQgZGVwdGggPSBwbGFuZU5vcm1hbFdTLmRvdChwVnR4SW5baV0pICsgcGxhbmVFcVdTOyAvLyA/Pz8KCiAgICAgICAgaWYgKGRlcHRoIDw9IG1pbkRpc3QpIHsKICAgICAgICAgIGNvbnNvbGUubG9nKGBjbGFtcGVkOiBkZXB0aD0ke2RlcHRofSB0byBtaW5EaXN0PSR7bWluRGlzdH1gKTsKICAgICAgICAgIGRlcHRoID0gbWluRGlzdDsKICAgICAgICB9CgogICAgICAgIGlmIChkZXB0aCA8PSBtYXhEaXN0KSB7CiAgICAgICAgICBjb25zdCBwb2ludCA9IHBWdHhJbltpXTsKCiAgICAgICAgICBpZiAoZGVwdGggPD0gMWUtNikgewogICAgICAgICAgICBjb25zdCBwID0gewogICAgICAgICAgICAgIHBvaW50LAogICAgICAgICAgICAgIG5vcm1hbDogcGxhbmVOb3JtYWxXUywKICAgICAgICAgICAgICBkZXB0aAogICAgICAgICAgICB9OwogICAgICAgICAgICByZXN1bHQucHVzaChwKTsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KICAgIH0KICAgIC8qKgogICAgICogQ2xpcCBhIGZhY2UgaW4gYSBodWxsIGFnYWluc3QgdGhlIGJhY2sgb2YgYSBwbGFuZS4KICAgICAqIEBwYXJhbSBwbGFuZUNvbnN0YW50IFRoZSBjb25zdGFudCBpbiB0aGUgbWF0aGVtYXRpY2FsIHBsYW5lIGVxdWF0aW9uCiAgICAgKi8KCgogICAgY2xpcEZhY2VBZ2FpbnN0UGxhbmUoaW5WZXJ0aWNlcywgb3V0VmVydGljZXMsIHBsYW5lTm9ybWFsLCBwbGFuZUNvbnN0YW50KSB7CiAgICAgIGxldCBuX2RvdF9maXJzdDsKICAgICAgbGV0IG5fZG90X2xhc3Q7CiAgICAgIGNvbnN0IG51bVZlcnRzID0gaW5WZXJ0aWNlcy5sZW5ndGg7CgogICAgICBpZiAobnVtVmVydHMgPCAyKSB7CiAgICAgICAgcmV0dXJuIG91dFZlcnRpY2VzOwogICAgICB9CgogICAgICBsZXQgZmlyc3RWZXJ0ZXggPSBpblZlcnRpY2VzW2luVmVydGljZXMubGVuZ3RoIC0gMV07CiAgICAgIGxldCBsYXN0VmVydGV4ID0gaW5WZXJ0aWNlc1swXTsKICAgICAgbl9kb3RfZmlyc3QgPSBwbGFuZU5vcm1hbC5kb3QoZmlyc3RWZXJ0ZXgpICsgcGxhbmVDb25zdGFudDsKCiAgICAgIGZvciAobGV0IHZpID0gMDsgdmkgPCBudW1WZXJ0czsgdmkrKykgewogICAgICAgIGxhc3RWZXJ0ZXggPSBpblZlcnRpY2VzW3ZpXTsKICAgICAgICBuX2RvdF9sYXN0ID0gcGxhbmVOb3JtYWwuZG90KGxhc3RWZXJ0ZXgpICsgcGxhbmVDb25zdGFudDsKCiAgICAgICAgaWYgKG5fZG90X2ZpcnN0IDwgMCkgewogICAgICAgICAgaWYgKG5fZG90X2xhc3QgPCAwKSB7CiAgICAgICAgICAgIC8vIFN0YXJ0IDwgMCwgZW5kIDwgMCwgc28gb3V0cHV0IGxhc3RWZXJ0ZXgKICAgICAgICAgICAgY29uc3QgbmV3diA9IG5ldyBWZWMzKCk7CiAgICAgICAgICAgIG5ld3YuY29weShsYXN0VmVydGV4KTsKICAgICAgICAgICAgb3V0VmVydGljZXMucHVzaChuZXd2KTsKICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgIC8vIFN0YXJ0IDwgMCwgZW5kID49IDAsIHNvIG91dHB1dCBpbnRlcnNlY3Rpb24KICAgICAgICAgICAgY29uc3QgbmV3diA9IG5ldyBWZWMzKCk7CiAgICAgICAgICAgIGZpcnN0VmVydGV4LmxlcnAobGFzdFZlcnRleCwgbl9kb3RfZmlyc3QgLyAobl9kb3RfZmlyc3QgLSBuX2RvdF9sYXN0KSwgbmV3dik7CiAgICAgICAgICAgIG91dFZlcnRpY2VzLnB1c2gobmV3dik7CiAgICAgICAgICB9CiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgIGlmIChuX2RvdF9sYXN0IDwgMCkgewogICAgICAgICAgICAvLyBTdGFydCA+PSAwLCBlbmQgPCAwIHNvIG91dHB1dCBpbnRlcnNlY3Rpb24gYW5kIGVuZAogICAgICAgICAgICBjb25zdCBuZXd2ID0gbmV3IFZlYzMoKTsKICAgICAgICAgICAgZmlyc3RWZXJ0ZXgubGVycChsYXN0VmVydGV4LCBuX2RvdF9maXJzdCAvIChuX2RvdF9maXJzdCAtIG5fZG90X2xhc3QpLCBuZXd2KTsKICAgICAgICAgICAgb3V0VmVydGljZXMucHVzaChuZXd2KTsKICAgICAgICAgICAgb3V0VmVydGljZXMucHVzaChsYXN0VmVydGV4KTsKICAgICAgICAgIH0KICAgICAgICB9CgogICAgICAgIGZpcnN0VmVydGV4ID0gbGFzdFZlcnRleDsKICAgICAgICBuX2RvdF9maXJzdCA9IG5fZG90X2xhc3Q7CiAgICAgIH0KCiAgICAgIHJldHVybiBvdXRWZXJ0aWNlczsKICAgIH0KICAgIC8qKgogICAgICogVXBkYXRlcyBgLndvcmxkVmVydGljZXNgIGFuZCBzZXRzIGAud29ybGRWZXJ0aWNlc05lZWRzVXBkYXRlYCB0byBmYWxzZS4KICAgICAqLwoKCiAgICBjb21wdXRlV29ybGRWZXJ0aWNlcyhwb3NpdGlvbiwgcXVhdCkgewogICAgICB3aGlsZSAodGhpcy53b3JsZFZlcnRpY2VzLmxlbmd0aCA8IHRoaXMudmVydGljZXMubGVuZ3RoKSB7CiAgICAgICAgdGhpcy53b3JsZFZlcnRpY2VzLnB1c2gobmV3IFZlYzMoKSk7CiAgICAgIH0KCiAgICAgIGNvbnN0IHZlcnRzID0gdGhpcy52ZXJ0aWNlczsKICAgICAgY29uc3Qgd29ybGRWZXJ0cyA9IHRoaXMud29ybGRWZXJ0aWNlczsKCiAgICAgIGZvciAobGV0IGkgPSAwOyBpICE9PSB0aGlzLnZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgcXVhdC52bXVsdCh2ZXJ0c1tpXSwgd29ybGRWZXJ0c1tpXSk7CiAgICAgICAgcG9zaXRpb24udmFkZCh3b3JsZFZlcnRzW2ldLCB3b3JsZFZlcnRzW2ldKTsKICAgICAgfQoKICAgICAgdGhpcy53b3JsZFZlcnRpY2VzTmVlZHNVcGRhdGUgPSBmYWxzZTsKICAgIH0KCiAgICBjb21wdXRlTG9jYWxBQUJCKGFhYmJtaW4sIGFhYmJtYXgpIHsKICAgICAgY29uc3QgdmVydGljZXMgPSB0aGlzLnZlcnRpY2VzOwogICAgICBhYWJibWluLnNldChOdW1iZXIuTUFYX1ZBTFVFLCBOdW1iZXIuTUFYX1ZBTFVFLCBOdW1iZXIuTUFYX1ZBTFVFKTsKICAgICAgYWFiYm1heC5zZXQoLU51bWJlci5NQVhfVkFMVUUsIC1OdW1iZXIuTUFYX1ZBTFVFLCAtTnVtYmVyLk1BWF9WQUxVRSk7CgogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudmVydGljZXMubGVuZ3RoOyBpKyspIHsKICAgICAgICBjb25zdCB2ID0gdmVydGljZXNbaV07CgogICAgICAgIGlmICh2LnggPCBhYWJibWluLngpIHsKICAgICAgICAgIGFhYmJtaW4ueCA9IHYueDsKICAgICAgICB9IGVsc2UgaWYgKHYueCA+IGFhYmJtYXgueCkgewogICAgICAgICAgYWFiYm1heC54ID0gdi54OwogICAgICAgIH0KCiAgICAgICAgaWYgKHYueSA8IGFhYmJtaW4ueSkgewogICAgICAgICAgYWFiYm1pbi55ID0gdi55OwogICAgICAgIH0gZWxzZSBpZiAodi55ID4gYWFiYm1heC55KSB7CiAgICAgICAgICBhYWJibWF4LnkgPSB2Lnk7CiAgICAgICAgfQoKICAgICAgICBpZiAodi56IDwgYWFiYm1pbi56KSB7CiAgICAgICAgICBhYWJibWluLnogPSB2Lno7CiAgICAgICAgfSBlbHNlIGlmICh2LnogPiBhYWJibWF4LnopIHsKICAgICAgICAgIGFhYmJtYXgueiA9IHYuejsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICAgIC8qKgogICAgICogVXBkYXRlcyBgd29ybGRWZXJ0aWNlc2AgYW5kIHNldHMgYHdvcmxkVmVydGljZXNOZWVkc1VwZGF0ZWAgdG8gZmFsc2UuCiAgICAgKi8KCgogICAgY29tcHV0ZVdvcmxkRmFjZU5vcm1hbHMocXVhdCkgewogICAgICBjb25zdCBOID0gdGhpcy5mYWNlTm9ybWFscy5sZW5ndGg7CgogICAgICB3aGlsZSAodGhpcy53b3JsZEZhY2VOb3JtYWxzLmxlbmd0aCA8IE4pIHsKICAgICAgICB0aGlzLndvcmxkRmFjZU5vcm1hbHMucHVzaChuZXcgVmVjMygpKTsKICAgICAgfQoKICAgICAgY29uc3Qgbm9ybWFscyA9IHRoaXMuZmFjZU5vcm1hbHM7CiAgICAgIGNvbnN0IHdvcmxkTm9ybWFscyA9IHRoaXMud29ybGRGYWNlTm9ybWFsczsKCiAgICAgIGZvciAobGV0IGkgPSAwOyBpICE9PSBOOyBpKyspIHsKICAgICAgICBxdWF0LnZtdWx0KG5vcm1hbHNbaV0sIHdvcmxkTm9ybWFsc1tpXSk7CiAgICAgIH0KCiAgICAgIHRoaXMud29ybGRGYWNlTm9ybWFsc05lZWRzVXBkYXRlID0gZmFsc2U7CiAgICB9CiAgICAvKioKICAgICAqIHVwZGF0ZUJvdW5kaW5nU3BoZXJlUmFkaXVzCiAgICAgKi8KCgogICAgdXBkYXRlQm91bmRpbmdTcGhlcmVSYWRpdXMoKSB7CiAgICAgIC8vIEFzc3VtZSBwb2ludHMgYXJlIGRpc3RyaWJ1dGVkIHdpdGggbG9jYWwgKDAsMCwwKSBhcyBjZW50ZXIKICAgICAgbGV0IG1heDIgPSAwOwogICAgICBjb25zdCB2ZXJ0cyA9IHRoaXMudmVydGljZXM7CgogICAgICBmb3IgKGxldCBpID0gMDsgaSAhPT0gdmVydHMubGVuZ3RoOyBpKyspIHsKICAgICAgICBjb25zdCBub3JtMiA9IHZlcnRzW2ldLmxlbmd0aFNxdWFyZWQoKTsKCiAgICAgICAgaWYgKG5vcm0yID4gbWF4MikgewogICAgICAgICAgbWF4MiA9IG5vcm0yOwogICAgICAgIH0KICAgICAgfQoKICAgICAgdGhpcy5ib3VuZGluZ1NwaGVyZVJhZGl1cyA9IE1hdGguc3FydChtYXgyKTsKICAgIH0KICAgIC8qKgogICAgICogY2FsY3VsYXRlV29ybGRBQUJCCiAgICAgKi8KCgogICAgY2FsY3VsYXRlV29ybGRBQUJCKHBvcywgcXVhdCwgbWluLCBtYXgpIHsKICAgICAgY29uc3QgdmVydHMgPSB0aGlzLnZlcnRpY2VzOwogICAgICBsZXQgbWlueDsKICAgICAgbGV0IG1pbnk7CiAgICAgIGxldCBtaW56OwogICAgICBsZXQgbWF4eDsKICAgICAgbGV0IG1heHk7CiAgICAgIGxldCBtYXh6OwogICAgICBsZXQgdGVtcFdvcmxkVmVydGV4ID0gbmV3IFZlYzMoKTsKCiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVydHMubGVuZ3RoOyBpKyspIHsKICAgICAgICB0ZW1wV29ybGRWZXJ0ZXguY29weSh2ZXJ0c1tpXSk7CiAgICAgICAgcXVhdC52bXVsdCh0ZW1wV29ybGRWZXJ0ZXgsIHRlbXBXb3JsZFZlcnRleCk7CiAgICAgICAgcG9zLnZhZGQodGVtcFdvcmxkVmVydGV4LCB0ZW1wV29ybGRWZXJ0ZXgpOwogICAgICAgIGNvbnN0IHYgPSB0ZW1wV29ybGRWZXJ0ZXg7CgogICAgICAgIGlmIChtaW54ID09PSB1bmRlZmluZWQgfHwgdi54IDwgbWlueCkgewogICAgICAgICAgbWlueCA9IHYueDsKICAgICAgICB9CgogICAgICAgIGlmIChtYXh4ID09PSB1bmRlZmluZWQgfHwgdi54ID4gbWF4eCkgewogICAgICAgICAgbWF4eCA9IHYueDsKICAgICAgICB9CgogICAgICAgIGlmIChtaW55ID09PSB1bmRlZmluZWQgfHwgdi55IDwgbWlueSkgewogICAgICAgICAgbWlueSA9IHYueTsKICAgICAgICB9CgogICAgICAgIGlmIChtYXh5ID09PSB1bmRlZmluZWQgfHwgdi55ID4gbWF4eSkgewogICAgICAgICAgbWF4eSA9IHYueTsKICAgICAgICB9CgogICAgICAgIGlmIChtaW56ID09PSB1bmRlZmluZWQgfHwgdi56IDwgbWlueikgewogICAgICAgICAgbWlueiA9IHYuejsKICAgICAgICB9CgogICAgICAgIGlmIChtYXh6ID09PSB1bmRlZmluZWQgfHwgdi56ID4gbWF4eikgewogICAgICAgICAgbWF4eiA9IHYuejsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIG1pbi5zZXQobWlueCwgbWlueSwgbWlueik7CiAgICAgIG1heC5zZXQobWF4eCwgbWF4eSwgbWF4eik7CiAgICB9CiAgICAvKioKICAgICAqIEdldCBhcHByb3hpbWF0ZSBjb252ZXggdm9sdW1lCiAgICAgKi8KCgogICAgdm9sdW1lKCkgewogICAgICByZXR1cm4gNC4wICogTWF0aC5QSSAqIHRoaXMuYm91bmRpbmdTcGhlcmVSYWRpdXMgLyAzLjA7CiAgICB9CiAgICAvKioKICAgICAqIEdldCBhbiBhdmVyYWdlIG9mIGFsbCB0aGUgdmVydGljZXMgcG9zaXRpb25zCiAgICAgKi8KCgogICAgZ2V0QXZlcmFnZVBvaW50TG9jYWwodGFyZ2V0KSB7CiAgICAgIGlmICh0YXJnZXQgPT09IHZvaWQgMCkgewogICAgICAgIHRhcmdldCA9IG5ldyBWZWMzKCk7CiAgICAgIH0KCiAgICAgIGNvbnN0IHZlcnRzID0gdGhpcy52ZXJ0aWNlczsKCiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVydHMubGVuZ3RoOyBpKyspIHsKICAgICAgICB0YXJnZXQudmFkZCh2ZXJ0c1tpXSwgdGFyZ2V0KTsKICAgICAgfQoKICAgICAgdGFyZ2V0LnNjYWxlKDEgLyB2ZXJ0cy5sZW5ndGgsIHRhcmdldCk7CiAgICAgIHJldHVybiB0YXJnZXQ7CiAgICB9CiAgICAvKioKICAgICAqIFRyYW5zZm9ybSBhbGwgbG9jYWwgcG9pbnRzLiBXaWxsIGNoYW5nZSB0aGUgLnZlcnRpY2VzCiAgICAgKi8KCgogICAgdHJhbnNmb3JtQWxsUG9pbnRzKG9mZnNldCwgcXVhdCkgewogICAgICBjb25zdCBuID0gdGhpcy52ZXJ0aWNlcy5sZW5ndGg7CiAgICAgIGNvbnN0IHZlcnRzID0gdGhpcy52ZXJ0aWNlczsgLy8gQXBwbHkgcm90YXRpb24KCiAgICAgIGlmIChxdWF0KSB7CiAgICAgICAgLy8gUm90YXRlIHZlcnRpY2VzCiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHsKICAgICAgICAgIGNvbnN0IHYgPSB2ZXJ0c1tpXTsKICAgICAgICAgIHF1YXQudm11bHQodiwgdik7CiAgICAgICAgfSAvLyBSb3RhdGUgZmFjZSBub3JtYWxzCgoKICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZmFjZU5vcm1hbHMubGVuZ3RoOyBpKyspIHsKICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLmZhY2VOb3JtYWxzW2ldOwogICAgICAgICAgcXVhdC52bXVsdCh2LCB2KTsKICAgICAgICB9CiAgICAgICAgLyoKICAgICAgICAgICAgICAvLyBSb3RhdGUgZWRnZXMKICAgICAgICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnVuaXF1ZUVkZ2VzLmxlbmd0aDsgaSsrKXsKICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMudW5pcXVlRWRnZXNbaV07CiAgICAgICAgICAgICAgICAgIHF1YXQudm11bHQodix2KTsKICAgICAgICAgICAgICB9Ki8KCiAgICAgIH0gLy8gQXBwbHkgb2Zmc2V0CgoKICAgICAgaWYgKG9mZnNldCkgewogICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7CiAgICAgICAgICBjb25zdCB2ID0gdmVydHNbaV07CiAgICAgICAgICB2LnZhZGQob2Zmc2V0LCB2KTsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICAgIC8qKgogICAgICogQ2hlY2tzIHdoZXRoZXIgcCBpcyBpbnNpZGUgdGhlIHBvbHloZWRyYS4gTXVzdCBiZSBpbiBsb2NhbCBjb29yZHMuCiAgICAgKiBUaGUgcG9pbnQgbGllcyBvdXRzaWRlIG9mIHRoZSBjb252ZXggaHVsbCBvZiB0aGUgb3RoZXIgcG9pbnRzIGlmIGFuZCBvbmx5IGlmIHRoZSBkaXJlY3Rpb24KICAgICAqIG9mIGFsbCB0aGUgdmVjdG9ycyBmcm9tIGl0IHRvIHRob3NlIG90aGVyIHBvaW50cyBhcmUgb24gbGVzcyB0aGFuIG9uZSBoYWxmIG9mIGEgc3BoZXJlIGFyb3VuZCBpdC4KICAgICAqIEBwYXJhbSBwIEEgcG9pbnQgZ2l2ZW4gaW4gbG9jYWwgY29vcmRpbmF0ZXMKICAgICAqLwoKCiAgICBwb2ludElzSW5zaWRlKHApIHsKICAgICAgY29uc3QgdmVydHMgPSB0aGlzLnZlcnRpY2VzOwogICAgICBjb25zdCBmYWNlcyA9IHRoaXMuZmFjZXM7CiAgICAgIGNvbnN0IG5vcm1hbHMgPSB0aGlzLmZhY2VOb3JtYWxzOwogICAgICBjb25zdCBwb3NpdGl2ZVJlc3VsdCA9IG51bGw7CiAgICAgIGNvbnN0IHBvaW50SW5zaWRlID0gbmV3IFZlYzMoKTsKICAgICAgdGhpcy5nZXRBdmVyYWdlUG9pbnRMb2NhbChwb2ludEluc2lkZSk7CgogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZmFjZXMubGVuZ3RoOyBpKyspIHsKICAgICAgICBsZXQgbiA9IG5vcm1hbHNbaV07CiAgICAgICAgY29uc3QgdiA9IHZlcnRzW2ZhY2VzW2ldWzBdXTsgLy8gV2Ugb25seSBuZWVkIG9uZSBwb2ludCBpbiB0aGUgZmFjZQogICAgICAgIC8vIFRoaXMgZG90IHByb2R1Y3QgZGV0ZXJtaW5lcyB3aGljaCBzaWRlIG9mIHRoZSBlZGdlIHRoZSBwb2ludCBpcwoKICAgICAgICBjb25zdCB2VG9QID0gbmV3IFZlYzMoKTsKICAgICAgICBwLnZzdWIodiwgdlRvUCk7CiAgICAgICAgY29uc3QgcjEgPSBuLmRvdCh2VG9QKTsKICAgICAgICBjb25zdCB2VG9Qb2ludEluc2lkZSA9IG5ldyBWZWMzKCk7CiAgICAgICAgcG9pbnRJbnNpZGUudnN1Yih2LCB2VG9Qb2ludEluc2lkZSk7CiAgICAgICAgY29uc3QgcjIgPSBuLmRvdCh2VG9Qb2ludEluc2lkZSk7CgogICAgICAgIGlmIChyMSA8IDAgJiYgcjIgPiAwIHx8IHIxID4gMCAmJiByMiA8IDApIHsKICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gRW5jb3VudGVyZWQgc29tZSBvdGhlciBzaWduLiBFeGl0LgogICAgICAgIH0KICAgICAgfSAvLyBJZiB3ZSBnb3QgaGVyZSwgYWxsIGRvdCBwcm9kdWN0cyB3ZXJlIG9mIHRoZSBzYW1lIHNpZ24uCgoKICAgICAgcmV0dXJuIHBvc2l0aXZlUmVzdWx0ID8gMSA6IC0xOwogICAgfQogICAgLyoqCiAgICAgKiBHZXQgbWF4IGFuZCBtaW4gZG90IHByb2R1Y3Qgb2YgYSBjb252ZXggaHVsbCBhdCBwb3NpdGlvbiAocG9zLHF1YXQpIHByb2plY3RlZCBvbnRvIGFuIGF4aXMuCiAgICAgKiBSZXN1bHRzIGFyZSBzYXZlZCBpbiB0aGUgYXJyYXkgbWF4bWluLgogICAgICogQHBhcmFtIHJlc3VsdCByZXN1bHRbMF0gYW5kIHJlc3VsdFsxXSB3aWxsIGJlIHNldCB0byBtYXhpbXVtIGFuZCBtaW5pbXVtLCByZXNwZWN0aXZlbHkuCiAgICAgKi8KCgogICAgc3RhdGljIHByb2plY3Qoc2hhcGUsIGF4aXMsIHBvcywgcXVhdCwgcmVzdWx0KSB7CiAgICAgIGNvbnN0IG4gPSBzaGFwZS52ZXJ0aWNlcy5sZW5ndGg7CiAgICAgIGNvbnN0IGxvY2FsQXhpcyA9IHByb2plY3RfbG9jYWxBeGlzOwogICAgICBsZXQgbWF4ID0gMDsKICAgICAgbGV0IG1pbiA9IDA7CiAgICAgIGNvbnN0IGxvY2FsT3JpZ2luID0gcHJvamVjdF9sb2NhbE9yaWdpbjsKICAgICAgY29uc3QgdnMgPSBzaGFwZS52ZXJ0aWNlczsKICAgICAgbG9jYWxPcmlnaW4uc2V0WmVybygpOyAvLyBUcmFuc2Zvcm0gdGhlIGF4aXMgdG8gbG9jYWwKCiAgICAgIFRyYW5zZm9ybS52ZWN0b3JUb0xvY2FsRnJhbWUocG9zLCBxdWF0LCBheGlzLCBsb2NhbEF4aXMpOwogICAgICBUcmFuc2Zvcm0ucG9pbnRUb0xvY2FsRnJhbWUocG9zLCBxdWF0LCBsb2NhbE9yaWdpbiwgbG9jYWxPcmlnaW4pOwogICAgICBjb25zdCBhZGQgPSBsb2NhbE9yaWdpbi5kb3QobG9jYWxBeGlzKTsKICAgICAgbWluID0gbWF4ID0gdnNbMF0uZG90KGxvY2FsQXhpcyk7CgogICAgICBmb3IgKGxldCBpID0gMTsgaSA8IG47IGkrKykgewogICAgICAgIGNvbnN0IHZhbCA9IHZzW2ldLmRvdChsb2NhbEF4aXMpOwoKICAgICAgICBpZiAodmFsID4gbWF4KSB7CiAgICAgICAgICBtYXggPSB2YWw7CiAgICAgICAgfQoKICAgICAgICBpZiAodmFsIDwgbWluKSB7CiAgICAgICAgICBtaW4gPSB2YWw7CiAgICAgICAgfQogICAgICB9CgogICAgICBtaW4gLT0gYWRkOwogICAgICBtYXggLT0gYWRkOwoKICAgICAgaWYgKG1pbiA+IG1heCkgewogICAgICAgIC8vIEluY29uc2lzdGVudCAtIHN3YXAKICAgICAgICBjb25zdCB0ZW1wID0gbWluOwogICAgICAgIG1pbiA9IG1heDsKICAgICAgICBtYXggPSB0ZW1wOwogICAgICB9IC8vIE91dHB1dAoKCiAgICAgIHJlc3VsdFswXSA9IG1heDsKICAgICAgcmVzdWx0WzFdID0gbWluOwogICAgfQoKICB9CiAgY29uc3QgbWF4bWluQSA9IFtdOwogIGNvbnN0IG1heG1pbkIgPSBbXTsKICBuZXcgVmVjMygpOwogIGNvbnN0IHByb2plY3RfbG9jYWxBeGlzID0gbmV3IFZlYzMoKTsKICBjb25zdCBwcm9qZWN0X2xvY2FsT3JpZ2luID0gbmV3IFZlYzMoKTsKCiAgLyoqCiAgICogQSAzZCBib3ggc2hhcGUuCiAgICogQGV4YW1wbGUKICAgKiAgICAgY29uc3Qgc2l6ZSA9IDEKICAgKiAgICAgY29uc3QgaGFsZkV4dGVudHMgPSBuZXcgQ0FOTk9OLlZlYzMoc2l6ZSwgc2l6ZSwgc2l6ZSkKICAgKiAgICAgY29uc3QgYm94U2hhcGUgPSBuZXcgQ0FOTk9OLkJveChoYWxmRXh0ZW50cykKICAgKiAgICAgY29uc3QgYm94Qm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDEsIHNoYXBlOiBib3hTaGFwZSB9KQogICAqICAgICB3b3JsZC5hZGRCb2R5KGJveEJvZHkpCiAgICovCiAgY2xhc3MgQm94IGV4dGVuZHMgU2hhcGUgewogICAgLyoqCiAgICAgKiBUaGUgaGFsZiBleHRlbnRzIG9mIHRoZSBib3guCiAgICAgKi8KCiAgICAvKioKICAgICAqIFVzZWQgYnkgdGhlIGNvbnRhY3QgZ2VuZXJhdG9yIHRvIG1ha2UgY29udGFjdHMgd2l0aCBvdGhlciBjb252ZXggcG9seWhlZHJhIGZvciBleGFtcGxlLgogICAgICovCiAgICBjb25zdHJ1Y3RvcihoYWxmRXh0ZW50cykgewogICAgICBzdXBlcih7CiAgICAgICAgdHlwZTogU2hhcGUudHlwZXMuQk9YCiAgICAgIH0pOwogICAgICB0aGlzLmhhbGZFeHRlbnRzID0gaGFsZkV4dGVudHM7CiAgICAgIHRoaXMuY29udmV4UG9seWhlZHJvblJlcHJlc2VudGF0aW9uID0gbnVsbDsKICAgICAgdGhpcy51cGRhdGVDb252ZXhQb2x5aGVkcm9uUmVwcmVzZW50YXRpb24oKTsKICAgICAgdGhpcy51cGRhdGVCb3VuZGluZ1NwaGVyZVJhZGl1cygpOwogICAgfQogICAgLyoqCiAgICAgKiBVcGRhdGVzIHRoZSBsb2NhbCBjb252ZXggcG9seWhlZHJvbiByZXByZXNlbnRhdGlvbiB1c2VkIGZvciBzb21lIGNvbGxpc2lvbnMuCiAgICAgKi8KCgogICAgdXBkYXRlQ29udmV4UG9seWhlZHJvblJlcHJlc2VudGF0aW9uKCkgewogICAgICBjb25zdCBzeCA9IHRoaXMuaGFsZkV4dGVudHMueDsKICAgICAgY29uc3Qgc3kgPSB0aGlzLmhhbGZFeHRlbnRzLnk7CiAgICAgIGNvbnN0IHN6ID0gdGhpcy5oYWxmRXh0ZW50cy56OwogICAgICBjb25zdCBWID0gVmVjMzsKICAgICAgY29uc3QgdmVydGljZXMgPSBbbmV3IFYoLXN4LCAtc3ksIC1zeiksIG5ldyBWKHN4LCAtc3ksIC1zeiksIG5ldyBWKHN4LCBzeSwgLXN6KSwgbmV3IFYoLXN4LCBzeSwgLXN6KSwgbmV3IFYoLXN4LCAtc3ksIHN6KSwgbmV3IFYoc3gsIC1zeSwgc3opLCBuZXcgVihzeCwgc3ksIHN6KSwgbmV3IFYoLXN4LCBzeSwgc3opXTsKICAgICAgY29uc3QgZmFjZXMgPSBbWzMsIDIsIDEsIDBdLCAvLyAtegogICAgICBbNCwgNSwgNiwgN10sIC8vICt6CiAgICAgIFs1LCA0LCAwLCAxXSwgLy8gLXkKICAgICAgWzIsIDMsIDcsIDZdLCAvLyAreQogICAgICBbMCwgNCwgNywgM10sIC8vIC14CiAgICAgIFsxLCAyLCA2LCA1XSAvLyAreAogICAgICBdOwogICAgICBjb25zdCBheGVzID0gW25ldyBWKDAsIDAsIDEpLCBuZXcgVigwLCAxLCAwKSwgbmV3IFYoMSwgMCwgMCldOwogICAgICBjb25zdCBoID0gbmV3IENvbnZleFBvbHloZWRyb24oewogICAgICAgIHZlcnRpY2VzLAogICAgICAgIGZhY2VzLAogICAgICAgIGF4ZXMKICAgICAgfSk7CiAgICAgIHRoaXMuY29udmV4UG9seWhlZHJvblJlcHJlc2VudGF0aW9uID0gaDsKICAgICAgaC5tYXRlcmlhbCA9IHRoaXMubWF0ZXJpYWw7CiAgICB9CiAgICAvKioKICAgICAqIENhbGN1bGF0ZSB0aGUgaW5lcnRpYSBvZiB0aGUgYm94LgogICAgICovCgoKICAgIGNhbGN1bGF0ZUxvY2FsSW5lcnRpYShtYXNzLCB0YXJnZXQpIHsKICAgICAgaWYgKHRhcmdldCA9PT0gdm9pZCAwKSB7CiAgICAgICAgdGFyZ2V0ID0gbmV3IFZlYzMoKTsKICAgICAgfQoKICAgICAgQm94LmNhbGN1bGF0ZUluZXJ0aWEodGhpcy5oYWxmRXh0ZW50cywgbWFzcywgdGFyZ2V0KTsKICAgICAgcmV0dXJuIHRhcmdldDsKICAgIH0KCiAgICBzdGF0aWMgY2FsY3VsYXRlSW5lcnRpYShoYWxmRXh0ZW50cywgbWFzcywgdGFyZ2V0KSB7CiAgICAgIGNvbnN0IGUgPSBoYWxmRXh0ZW50czsKICAgICAgdGFyZ2V0LnggPSAxLjAgLyAxMi4wICogbWFzcyAqICgyICogZS55ICogMiAqIGUueSArIDIgKiBlLnogKiAyICogZS56KTsKICAgICAgdGFyZ2V0LnkgPSAxLjAgLyAxMi4wICogbWFzcyAqICgyICogZS54ICogMiAqIGUueCArIDIgKiBlLnogKiAyICogZS56KTsKICAgICAgdGFyZ2V0LnogPSAxLjAgLyAxMi4wICogbWFzcyAqICgyICogZS55ICogMiAqIGUueSArIDIgKiBlLnggKiAyICogZS54KTsKICAgIH0KICAgIC8qKgogICAgICogR2V0IHRoZSBib3ggNiBzaWRlIG5vcm1hbHMKICAgICAqIEBwYXJhbSBzaXhUYXJnZXRWZWN0b3JzIEFuIGFycmF5IG9mIDYgdmVjdG9ycywgdG8gc3RvcmUgdGhlIHJlc3VsdGluZyBzaWRlIG5vcm1hbHMgaW4uCiAgICAgKiBAcGFyYW0gcXVhdCBPcmllbnRhdGlvbiB0byBhcHBseSB0byB0aGUgbm9ybWFsIHZlY3RvcnMuIElmIG5vdCBwcm92aWRlZCwgdGhlIHZlY3RvcnMgd2lsbCBiZSBpbiByZXNwZWN0IHRvIHRoZSBsb2NhbCBmcmFtZS4KICAgICAqLwoKCiAgICBnZXRTaWRlTm9ybWFscyhzaXhUYXJnZXRWZWN0b3JzLCBxdWF0KSB7CiAgICAgIGNvbnN0IHNpZGVzID0gc2l4VGFyZ2V0VmVjdG9yczsKICAgICAgY29uc3QgZXggPSB0aGlzLmhhbGZFeHRlbnRzOwogICAgICBzaWRlc1swXS5zZXQoZXgueCwgMCwgMCk7CiAgICAgIHNpZGVzWzFdLnNldCgwLCBleC55LCAwKTsKICAgICAgc2lkZXNbMl0uc2V0KDAsIDAsIGV4LnopOwogICAgICBzaWRlc1szXS5zZXQoLWV4LngsIDAsIDApOwogICAgICBzaWRlc1s0XS5zZXQoMCwgLWV4LnksIDApOwogICAgICBzaWRlc1s1XS5zZXQoMCwgMCwgLWV4LnopOwoKICAgICAgaWYgKHF1YXQgIT09IHVuZGVmaW5lZCkgewogICAgICAgIGZvciAobGV0IGkgPSAwOyBpICE9PSBzaWRlcy5sZW5ndGg7IGkrKykgewogICAgICAgICAgcXVhdC52bXVsdChzaWRlc1tpXSwgc2lkZXNbaV0pOwogICAgICAgIH0KICAgICAgfQoKICAgICAgcmV0dXJuIHNpZGVzOwogICAgfQogICAgLyoqCiAgICAgKiBSZXR1cm5zIHRoZSB2b2x1bWUgb2YgdGhlIGJveC4KICAgICAqLwoKCiAgICB2b2x1bWUoKSB7CiAgICAgIHJldHVybiA4LjAgKiB0aGlzLmhhbGZFeHRlbnRzLnggKiB0aGlzLmhhbGZFeHRlbnRzLnkgKiB0aGlzLmhhbGZFeHRlbnRzLno7CiAgICB9CiAgICAvKioKICAgICAqIHVwZGF0ZUJvdW5kaW5nU3BoZXJlUmFkaXVzCiAgICAgKi8KCgogICAgdXBkYXRlQm91bmRpbmdTcGhlcmVSYWRpdXMoKSB7CiAgICAgIHRoaXMuYm91bmRpbmdTcGhlcmVSYWRpdXMgPSB0aGlzLmhhbGZFeHRlbnRzLmxlbmd0aCgpOwogICAgfQogICAgLyoqCiAgICAgKiBmb3JFYWNoV29ybGRDb3JuZXIKICAgICAqLwoKCiAgICBmb3JFYWNoV29ybGRDb3JuZXIocG9zLCBxdWF0LCBjYWxsYmFjaykgewogICAgICBjb25zdCBlID0gdGhpcy5oYWxmRXh0ZW50czsKICAgICAgY29uc3QgY29ybmVycyA9IFtbZS54LCBlLnksIGUuel0sIFstZS54LCBlLnksIGUuel0sIFstZS54LCAtZS55LCBlLnpdLCBbLWUueCwgLWUueSwgLWUuel0sIFtlLngsIC1lLnksIC1lLnpdLCBbZS54LCBlLnksIC1lLnpdLCBbLWUueCwgZS55LCAtZS56XSwgW2UueCwgLWUueSwgZS56XV07CgogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvcm5lcnMubGVuZ3RoOyBpKyspIHsKICAgICAgICB3b3JsZENvcm5lclRlbXBQb3Muc2V0KGNvcm5lcnNbaV1bMF0sIGNvcm5lcnNbaV1bMV0sIGNvcm5lcnNbaV1bMl0pOwogICAgICAgIHF1YXQudm11bHQod29ybGRDb3JuZXJUZW1wUG9zLCB3b3JsZENvcm5lclRlbXBQb3MpOwogICAgICAgIHBvcy52YWRkKHdvcmxkQ29ybmVyVGVtcFBvcywgd29ybGRDb3JuZXJUZW1wUG9zKTsKICAgICAgICBjYWxsYmFjayh3b3JsZENvcm5lclRlbXBQb3MueCwgd29ybGRDb3JuZXJUZW1wUG9zLnksIHdvcmxkQ29ybmVyVGVtcFBvcy56KTsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBjYWxjdWxhdGVXb3JsZEFBQkIKICAgICAqLwoKCiAgICBjYWxjdWxhdGVXb3JsZEFBQkIocG9zLCBxdWF0LCBtaW4sIG1heCkgewogICAgICBjb25zdCBlID0gdGhpcy5oYWxmRXh0ZW50czsKICAgICAgd29ybGRDb3JuZXJzVGVtcFswXS5zZXQoZS54LCBlLnksIGUueik7CiAgICAgIHdvcmxkQ29ybmVyc1RlbXBbMV0uc2V0KC1lLngsIGUueSwgZS56KTsKICAgICAgd29ybGRDb3JuZXJzVGVtcFsyXS5zZXQoLWUueCwgLWUueSwgZS56KTsKICAgICAgd29ybGRDb3JuZXJzVGVtcFszXS5zZXQoLWUueCwgLWUueSwgLWUueik7CiAgICAgIHdvcmxkQ29ybmVyc1RlbXBbNF0uc2V0KGUueCwgLWUueSwgLWUueik7CiAgICAgIHdvcmxkQ29ybmVyc1RlbXBbNV0uc2V0KGUueCwgZS55LCAtZS56KTsKICAgICAgd29ybGRDb3JuZXJzVGVtcFs2XS5zZXQoLWUueCwgZS55LCAtZS56KTsKICAgICAgd29ybGRDb3JuZXJzVGVtcFs3XS5zZXQoZS54LCAtZS55LCBlLnopOwogICAgICBjb25zdCB3YyA9IHdvcmxkQ29ybmVyc1RlbXBbMF07CiAgICAgIHF1YXQudm11bHQod2MsIHdjKTsKICAgICAgcG9zLnZhZGQod2MsIHdjKTsKICAgICAgbWF4LmNvcHkod2MpOwogICAgICBtaW4uY29weSh3Yyk7CgogICAgICBmb3IgKGxldCBpID0gMTsgaSA8IDg7IGkrKykgewogICAgICAgIGNvbnN0IHdjID0gd29ybGRDb3JuZXJzVGVtcFtpXTsKICAgICAgICBxdWF0LnZtdWx0KHdjLCB3Yyk7CiAgICAgICAgcG9zLnZhZGQod2MsIHdjKTsKICAgICAgICBjb25zdCB4ID0gd2MueDsKICAgICAgICBjb25zdCB5ID0gd2MueTsKICAgICAgICBjb25zdCB6ID0gd2MuejsKCiAgICAgICAgaWYgKHggPiBtYXgueCkgewogICAgICAgICAgbWF4LnggPSB4OwogICAgICAgIH0KCiAgICAgICAgaWYgKHkgPiBtYXgueSkgewogICAgICAgICAgbWF4LnkgPSB5OwogICAgICAgIH0KCiAgICAgICAgaWYgKHogPiBtYXgueikgewogICAgICAgICAgbWF4LnogPSB6OwogICAgICAgIH0KCiAgICAgICAgaWYgKHggPCBtaW4ueCkgewogICAgICAgICAgbWluLnggPSB4OwogICAgICAgIH0KCiAgICAgICAgaWYgKHkgPCBtaW4ueSkgewogICAgICAgICAgbWluLnkgPSB5OwogICAgICAgIH0KCiAgICAgICAgaWYgKHogPCBtaW4ueikgewogICAgICAgICAgbWluLnogPSB6OwogICAgICAgIH0KICAgICAgfSAvLyBHZXQgZWFjaCBheGlzIG1heAogICAgICAvLyBtaW4uc2V0KEluZmluaXR5LEluZmluaXR5LEluZmluaXR5KTsKICAgICAgLy8gbWF4LnNldCgtSW5maW5pdHksLUluZmluaXR5LC1JbmZpbml0eSk7CiAgICAgIC8vIHRoaXMuZm9yRWFjaFdvcmxkQ29ybmVyKHBvcyxxdWF0LGZ1bmN0aW9uKHgseSx6KXsKICAgICAgLy8gICAgIGlmKHggPiBtYXgueCl7CiAgICAgIC8vICAgICAgICAgbWF4LnggPSB4OwogICAgICAvLyAgICAgfQogICAgICAvLyAgICAgaWYoeSA+IG1heC55KXsKICAgICAgLy8gICAgICAgICBtYXgueSA9IHk7CiAgICAgIC8vICAgICB9CiAgICAgIC8vICAgICBpZih6ID4gbWF4LnopewogICAgICAvLyAgICAgICAgIG1heC56ID0gejsKICAgICAgLy8gICAgIH0KICAgICAgLy8gICAgIGlmKHggPCBtaW4ueCl7CiAgICAgIC8vICAgICAgICAgbWluLnggPSB4OwogICAgICAvLyAgICAgfQogICAgICAvLyAgICAgaWYoeSA8IG1pbi55KXsKICAgICAgLy8gICAgICAgICBtaW4ueSA9IHk7CiAgICAgIC8vICAgICB9CiAgICAgIC8vICAgICBpZih6IDwgbWluLnopewogICAgICAvLyAgICAgICAgIG1pbi56ID0gejsKICAgICAgLy8gICAgIH0KICAgICAgLy8gfSk7CgogICAgfQoKICB9CiAgY29uc3Qgd29ybGRDb3JuZXJUZW1wUG9zID0gbmV3IFZlYzMoKTsKICBjb25zdCB3b3JsZENvcm5lcnNUZW1wID0gW25ldyBWZWMzKCksIG5ldyBWZWMzKCksIG5ldyBWZWMzKCksIG5ldyBWZWMzKCksIG5ldyBWZWMzKCksIG5ldyBWZWMzKCksIG5ldyBWZWMzKCksIG5ldyBWZWMzKCldOwoKICAvKioKICAgKiBCT0RZX1RZUEVTCiAgICovCiAgY29uc3QgQk9EWV9UWVBFUyA9IHsKICAgIC8qKiBEWU5BTUlDICovCiAgICBEWU5BTUlDOiAxLAoKICAgIC8qKiBTVEFUSUMgKi8KICAgIFNUQVRJQzogMiwKCiAgICAvKiogS0lORU1BVElDICovCiAgICBLSU5FTUFUSUM6IDQKICB9OwogIC8qKgogICAqIEJvZHlUeXBlCiAgICovCgogIC8qKgogICAqIEJPRFlfU0xFRVBfU1RBVEVTCiAgICovCiAgY29uc3QgQk9EWV9TTEVFUF9TVEFURVMgPSB7CiAgICAvKiogQVdBS0UgKi8KICAgIEFXQUtFOiAwLAoKICAgIC8qKiBTTEVFUFkgKi8KICAgIFNMRUVQWTogMSwKCiAgICAvKiogU0xFRVBJTkcgKi8KICAgIFNMRUVQSU5HOiAyCiAgfTsKICAvKioKICAgKiBCb2R5U2xlZXBTdGF0ZQogICAqLwoKICAvKioKICAgKiBCYXNlIGNsYXNzIGZvciBhbGwgYm9keSB0eXBlcy4KICAgKiBAZXhhbXBsZQogICAqICAgICBjb25zdCBzaGFwZSA9IG5ldyBDQU5OT04uU3BoZXJlKDEpCiAgICogICAgIGNvbnN0IGJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoewogICAqICAgICAgIG1hc3M6IDEsCiAgICogICAgICAgc2hhcGUsCiAgICogICAgIH0pCiAgICogICAgIHdvcmxkLmFkZEJvZHkoYm9keSkKICAgKi8KICBjbGFzcyBCb2R5IGV4dGVuZHMgRXZlbnRUYXJnZXQgewogICAgLyoqCiAgICAgKiBEaXNwYXRjaGVkIGFmdGVyIHR3byBib2RpZXMgY29sbGlkZS4gVGhpcyBldmVudCBpcyBkaXNwYXRjaGVkIG9uIGVhY2gKICAgICAqIG9mIHRoZSB0d28gYm9kaWVzIGludm9sdmVkIGluIHRoZSBjb2xsaXNpb24uCiAgICAgKiBAZXZlbnQgY29sbGlkZQogICAgICogQHBhcmFtIGJvZHkgVGhlIGJvZHkgdGhhdCB3YXMgaW52b2x2ZWQgaW4gdGhlIGNvbGxpc2lvbi4KICAgICAqIEBwYXJhbSBjb250YWN0IFRoZSBkZXRhaWxzIG9mIHRoZSBjb2xsaXNpb24uCiAgICAgKi8KCiAgICAvKioKICAgICAqIEEgZHluYW1pYyBib2R5IGlzIGZ1bGx5IHNpbXVsYXRlZC4gQ2FuIGJlIG1vdmVkIG1hbnVhbGx5IGJ5IHRoZSB1c2VyLCBidXQgbm9ybWFsbHkgdGhleSBtb3ZlIGFjY29yZGluZyB0byBmb3JjZXMuIEEgZHluYW1pYyBib2R5IGNhbiBjb2xsaWRlIHdpdGggYWxsIGJvZHkgdHlwZXMuIEEgZHluYW1pYyBib2R5IGFsd2F5cyBoYXMgZmluaXRlLCBub24temVybyBtYXNzLgogICAgICovCgogICAgLyoqCiAgICAgKiBBIHN0YXRpYyBib2R5IGRvZXMgbm90IG1vdmUgZHVyaW5nIHNpbXVsYXRpb24gYW5kIGJlaGF2ZXMgYXMgaWYgaXQgaGFzIGluZmluaXRlIG1hc3MuIFN0YXRpYyBib2RpZXMgY2FuIGJlIG1vdmVkIG1hbnVhbGx5IGJ5IHNldHRpbmcgdGhlIHBvc2l0aW9uIG9mIHRoZSBib2R5LiBUaGUgdmVsb2NpdHkgb2YgYSBzdGF0aWMgYm9keSBpcyBhbHdheXMgemVyby4gU3RhdGljIGJvZGllcyBkbyBub3QgY29sbGlkZSB3aXRoIG90aGVyIHN0YXRpYyBvciBraW5lbWF0aWMgYm9kaWVzLgogICAgICovCgogICAgLyoqCiAgICAgKiBBIGtpbmVtYXRpYyBib2R5IG1vdmVzIHVuZGVyIHNpbXVsYXRpb24gYWNjb3JkaW5nIHRvIGl0cyB2ZWxvY2l0eS4gVGhleSBkbyBub3QgcmVzcG9uZCB0byBmb3JjZXMuIFRoZXkgY2FuIGJlIG1vdmVkIG1hbnVhbGx5LCBidXQgbm9ybWFsbHkgYSBraW5lbWF0aWMgYm9keSBpcyBtb3ZlZCBieSBzZXR0aW5nIGl0cyB2ZWxvY2l0eS4gQSBraW5lbWF0aWMgYm9keSBiZWhhdmVzIGFzIGlmIGl0IGhhcyBpbmZpbml0ZSBtYXNzLiBLaW5lbWF0aWMgYm9kaWVzIGRvIG5vdCBjb2xsaWRlIHdpdGggb3RoZXIgc3RhdGljIG9yIGtpbmVtYXRpYyBib2RpZXMuCiAgICAgKi8KCiAgICAvKioKICAgICAqIEFXQUtFCiAgICAgKi8KCiAgICAvKioKICAgICAqIFNMRUVQWQogICAgICovCgogICAgLyoqCiAgICAgKiBTTEVFUElORwogICAgICovCgogICAgLyoqCiAgICAgKiBEaXNwYXRjaGVkIGFmdGVyIGEgc2xlZXBpbmcgYm9keSBoYXMgd29rZW4gdXAuCiAgICAgKiBAZXZlbnQgd2FrZXVwCiAgICAgKi8KCiAgICAvKioKICAgICAqIERpc3BhdGNoZWQgYWZ0ZXIgYSBib2R5IGhhcyBnb25lIGluIHRvIHRoZSBzbGVlcHkgc3RhdGUuCiAgICAgKiBAZXZlbnQgc2xlZXB5CiAgICAgKi8KCiAgICAvKioKICAgICAqIERpc3BhdGNoZWQgYWZ0ZXIgYSBib2R5IGhhcyBmYWxsZW4gYXNsZWVwLgogICAgICogQGV2ZW50IHNsZWVwCiAgICAgKi8KICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHsKICAgICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgewogICAgICAgIG9wdGlvbnMgPSB7fTsKICAgICAgfQoKICAgICAgc3VwZXIoKTsKICAgICAgdGhpcy5pZCA9IEJvZHkuaWRDb3VudGVyKys7CiAgICAgIHRoaXMuaW5kZXggPSAtMTsKICAgICAgdGhpcy53b3JsZCA9IG51bGw7CiAgICAgIHRoaXMudmxhbWJkYSA9IG5ldyBWZWMzKCk7CiAgICAgIHRoaXMuY29sbGlzaW9uRmlsdGVyR3JvdXAgPSB0eXBlb2Ygb3B0aW9ucy5jb2xsaXNpb25GaWx0ZXJHcm91cCA9PT0gJ251bWJlcicgPyBvcHRpb25zLmNvbGxpc2lvbkZpbHRlckdyb3VwIDogMTsKICAgICAgdGhpcy5jb2xsaXNpb25GaWx0ZXJNYXNrID0gdHlwZW9mIG9wdGlvbnMuY29sbGlzaW9uRmlsdGVyTWFzayA9PT0gJ251bWJlcicgPyBvcHRpb25zLmNvbGxpc2lvbkZpbHRlck1hc2sgOiAtMTsKICAgICAgdGhpcy5jb2xsaXNpb25SZXNwb25zZSA9IHR5cGVvZiBvcHRpb25zLmNvbGxpc2lvblJlc3BvbnNlID09PSAnYm9vbGVhbicgPyBvcHRpb25zLmNvbGxpc2lvblJlc3BvbnNlIDogdHJ1ZTsKICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBWZWMzKCk7CiAgICAgIHRoaXMucHJldmlvdXNQb3NpdGlvbiA9IG5ldyBWZWMzKCk7CiAgICAgIHRoaXMuaW50ZXJwb2xhdGVkUG9zaXRpb24gPSBuZXcgVmVjMygpOwogICAgICB0aGlzLmluaXRQb3NpdGlvbiA9IG5ldyBWZWMzKCk7CgogICAgICBpZiAob3B0aW9ucy5wb3NpdGlvbikgewogICAgICAgIHRoaXMucG9zaXRpb24uY29weShvcHRpb25zLnBvc2l0aW9uKTsKICAgICAgICB0aGlzLnByZXZpb3VzUG9zaXRpb24uY29weShvcHRpb25zLnBvc2l0aW9uKTsKICAgICAgICB0aGlzLmludGVycG9sYXRlZFBvc2l0aW9uLmNvcHkob3B0aW9ucy5wb3NpdGlvbik7CiAgICAgICAgdGhpcy5pbml0UG9zaXRpb24uY29weShvcHRpb25zLnBvc2l0aW9uKTsKICAgICAgfQoKICAgICAgdGhpcy52ZWxvY2l0eSA9IG5ldyBWZWMzKCk7CgogICAgICBpZiAob3B0aW9ucy52ZWxvY2l0eSkgewogICAgICAgIHRoaXMudmVsb2NpdHkuY29weShvcHRpb25zLnZlbG9jaXR5KTsKICAgICAgfQoKICAgICAgdGhpcy5pbml0VmVsb2NpdHkgPSBuZXcgVmVjMygpOwogICAgICB0aGlzLmZvcmNlID0gbmV3IFZlYzMoKTsKICAgICAgY29uc3QgbWFzcyA9IHR5cGVvZiBvcHRpb25zLm1hc3MgPT09ICdudW1iZXInID8gb3B0aW9ucy5tYXNzIDogMDsKICAgICAgdGhpcy5tYXNzID0gbWFzczsKICAgICAgdGhpcy5pbnZNYXNzID0gbWFzcyA+IDAgPyAxLjAgLyBtYXNzIDogMDsKICAgICAgdGhpcy5tYXRlcmlhbCA9IG9wdGlvbnMubWF0ZXJpYWwgfHwgbnVsbDsKICAgICAgdGhpcy5saW5lYXJEYW1waW5nID0gdHlwZW9mIG9wdGlvbnMubGluZWFyRGFtcGluZyA9PT0gJ251bWJlcicgPyBvcHRpb25zLmxpbmVhckRhbXBpbmcgOiAwLjAxOwogICAgICB0aGlzLnR5cGUgPSBtYXNzIDw9IDAuMCA/IEJvZHkuU1RBVElDIDogQm9keS5EWU5BTUlDOwoKICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnR5cGUgPT09IHR5cGVvZiBCb2R5LlNUQVRJQykgewogICAgICAgIHRoaXMudHlwZSA9IG9wdGlvbnMudHlwZTsKICAgICAgfQoKICAgICAgdGhpcy5hbGxvd1NsZWVwID0gdHlwZW9mIG9wdGlvbnMuYWxsb3dTbGVlcCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmFsbG93U2xlZXAgOiB0cnVlOwogICAgICB0aGlzLnNsZWVwU3RhdGUgPSBCb2R5LkFXQUtFOwogICAgICB0aGlzLnNsZWVwU3BlZWRMaW1pdCA9IHR5cGVvZiBvcHRpb25zLnNsZWVwU3BlZWRMaW1pdCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLnNsZWVwU3BlZWRMaW1pdCA6IDAuMTsKICAgICAgdGhpcy5zbGVlcFRpbWVMaW1pdCA9IHR5cGVvZiBvcHRpb25zLnNsZWVwVGltZUxpbWl0ICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuc2xlZXBUaW1lTGltaXQgOiAxOwogICAgICB0aGlzLnRpbWVMYXN0U2xlZXB5ID0gMDsKICAgICAgdGhpcy53YWtlVXBBZnRlck5hcnJvd3BoYXNlID0gZmFsc2U7CiAgICAgIHRoaXMudG9ycXVlID0gbmV3IFZlYzMoKTsKICAgICAgdGhpcy5xdWF0ZXJuaW9uID0gbmV3IFF1YXRlcm5pb24oKTsKICAgICAgdGhpcy5pbml0UXVhdGVybmlvbiA9IG5ldyBRdWF0ZXJuaW9uKCk7CiAgICAgIHRoaXMucHJldmlvdXNRdWF0ZXJuaW9uID0gbmV3IFF1YXRlcm5pb24oKTsKICAgICAgdGhpcy5pbnRlcnBvbGF0ZWRRdWF0ZXJuaW9uID0gbmV3IFF1YXRlcm5pb24oKTsKCiAgICAgIGlmIChvcHRpb25zLnF1YXRlcm5pb24pIHsKICAgICAgICB0aGlzLnF1YXRlcm5pb24uY29weShvcHRpb25zLnF1YXRlcm5pb24pOwogICAgICAgIHRoaXMuaW5pdFF1YXRlcm5pb24uY29weShvcHRpb25zLnF1YXRlcm5pb24pOwogICAgICAgIHRoaXMucHJldmlvdXNRdWF0ZXJuaW9uLmNvcHkob3B0aW9ucy5xdWF0ZXJuaW9uKTsKICAgICAgICB0aGlzLmludGVycG9sYXRlZFF1YXRlcm5pb24uY29weShvcHRpb25zLnF1YXRlcm5pb24pOwogICAgICB9CgogICAgICB0aGlzLmFuZ3VsYXJWZWxvY2l0eSA9IG5ldyBWZWMzKCk7CgogICAgICBpZiAob3B0aW9ucy5hbmd1bGFyVmVsb2NpdHkpIHsKICAgICAgICB0aGlzLmFuZ3VsYXJWZWxvY2l0eS5jb3B5KG9wdGlvbnMuYW5ndWxhclZlbG9jaXR5KTsKICAgICAgfQoKICAgICAgdGhpcy5pbml0QW5ndWxhclZlbG9jaXR5ID0gbmV3IFZlYzMoKTsKICAgICAgdGhpcy5zaGFwZXMgPSBbXTsKICAgICAgdGhpcy5zaGFwZU9mZnNldHMgPSBbXTsKICAgICAgdGhpcy5zaGFwZU9yaWVudGF0aW9ucyA9IFtdOwogICAgICB0aGlzLmluZXJ0aWEgPSBuZXcgVmVjMygpOwogICAgICB0aGlzLmludkluZXJ0aWEgPSBuZXcgVmVjMygpOwogICAgICB0aGlzLmludkluZXJ0aWFXb3JsZCA9IG5ldyBNYXQzKCk7CiAgICAgIHRoaXMuaW52TWFzc1NvbHZlID0gMDsKICAgICAgdGhpcy5pbnZJbmVydGlhU29sdmUgPSBuZXcgVmVjMygpOwogICAgICB0aGlzLmludkluZXJ0aWFXb3JsZFNvbHZlID0gbmV3IE1hdDMoKTsKICAgICAgdGhpcy5maXhlZFJvdGF0aW9uID0gdHlwZW9mIG9wdGlvbnMuZml4ZWRSb3RhdGlvbiAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmZpeGVkUm90YXRpb24gOiBmYWxzZTsKICAgICAgdGhpcy5hbmd1bGFyRGFtcGluZyA9IHR5cGVvZiBvcHRpb25zLmFuZ3VsYXJEYW1waW5nICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuYW5ndWxhckRhbXBpbmcgOiAwLjAxOwogICAgICB0aGlzLmxpbmVhckZhY3RvciA9IG5ldyBWZWMzKDEsIDEsIDEpOwoKICAgICAgaWYgKG9wdGlvbnMubGluZWFyRmFjdG9yKSB7CiAgICAgICAgdGhpcy5saW5lYXJGYWN0b3IuY29weShvcHRpb25zLmxpbmVhckZhY3Rvcik7CiAgICAgIH0KCiAgICAgIHRoaXMuYW5ndWxhckZhY3RvciA9IG5ldyBWZWMzKDEsIDEsIDEpOwoKICAgICAgaWYgKG9wdGlvbnMuYW5ndWxhckZhY3RvcikgewogICAgICAgIHRoaXMuYW5ndWxhckZhY3Rvci5jb3B5KG9wdGlvbnMuYW5ndWxhckZhY3Rvcik7CiAgICAgIH0KCiAgICAgIHRoaXMuYWFiYiA9IG5ldyBBQUJCKCk7CiAgICAgIHRoaXMuYWFiYk5lZWRzVXBkYXRlID0gdHJ1ZTsKICAgICAgdGhpcy5ib3VuZGluZ1JhZGl1cyA9IDA7CiAgICAgIHRoaXMud2xhbWJkYSA9IG5ldyBWZWMzKCk7CiAgICAgIHRoaXMuaXNUcmlnZ2VyID0gQm9vbGVhbihvcHRpb25zLmlzVHJpZ2dlcik7CgogICAgICBpZiAob3B0aW9ucy5zaGFwZSkgewogICAgICAgIHRoaXMuYWRkU2hhcGUob3B0aW9ucy5zaGFwZSk7CiAgICAgIH0KCiAgICAgIHRoaXMudXBkYXRlTWFzc1Byb3BlcnRpZXMoKTsKICAgIH0KICAgIC8qKgogICAgICogV2FrZSB0aGUgYm9keSB1cC4KICAgICAqLwoKCiAgICB3YWtlVXAoKSB7CiAgICAgIGNvbnN0IHByZXZTdGF0ZSA9IHRoaXMuc2xlZXBTdGF0ZTsKICAgICAgdGhpcy5zbGVlcFN0YXRlID0gQm9keS5BV0FLRTsKICAgICAgdGhpcy53YWtlVXBBZnRlck5hcnJvd3BoYXNlID0gZmFsc2U7CgogICAgICBpZiAocHJldlN0YXRlID09PSBCb2R5LlNMRUVQSU5HKSB7CiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KEJvZHkud2FrZXVwRXZlbnQpOwogICAgICB9CiAgICB9CiAgICAvKioKICAgICAqIEZvcmNlIGJvZHkgc2xlZXAKICAgICAqLwoKCiAgICBzbGVlcCgpIHsKICAgICAgdGhpcy5zbGVlcFN0YXRlID0gQm9keS5TTEVFUElORzsKICAgICAgdGhpcy52ZWxvY2l0eS5zZXQoMCwgMCwgMCk7CiAgICAgIHRoaXMuYW5ndWxhclZlbG9jaXR5LnNldCgwLCAwLCAwKTsKICAgICAgdGhpcy53YWtlVXBBZnRlck5hcnJvd3BoYXNlID0gZmFsc2U7CiAgICB9CiAgICAvKioKICAgICAqIENhbGxlZCBldmVyeSB0aW1lc3RlcCB0byB1cGRhdGUgaW50ZXJuYWwgc2xlZXAgdGltZXIgYW5kIGNoYW5nZSBzbGVlcCBzdGF0ZSBpZiBuZWVkZWQuCiAgICAgKiBAcGFyYW0gdGltZSBUaGUgd29ybGQgdGltZSBpbiBzZWNvbmRzCiAgICAgKi8KCgogICAgc2xlZXBUaWNrKHRpbWUpIHsKICAgICAgaWYgKHRoaXMuYWxsb3dTbGVlcCkgewogICAgICAgIGNvbnN0IHNsZWVwU3RhdGUgPSB0aGlzLnNsZWVwU3RhdGU7CiAgICAgICAgY29uc3Qgc3BlZWRTcXVhcmVkID0gdGhpcy52ZWxvY2l0eS5sZW5ndGhTcXVhcmVkKCkgKyB0aGlzLmFuZ3VsYXJWZWxvY2l0eS5sZW5ndGhTcXVhcmVkKCk7CiAgICAgICAgY29uc3Qgc3BlZWRMaW1pdFNxdWFyZWQgPSB0aGlzLnNsZWVwU3BlZWRMaW1pdCAqKiAyOwoKICAgICAgICBpZiAoc2xlZXBTdGF0ZSA9PT0gQm9keS5BV0FLRSAmJiBzcGVlZFNxdWFyZWQgPCBzcGVlZExpbWl0U3F1YXJlZCkgewogICAgICAgICAgdGhpcy5zbGVlcFN0YXRlID0gQm9keS5TTEVFUFk7IC8vIFNsZWVweQoKICAgICAgICAgIHRoaXMudGltZUxhc3RTbGVlcHkgPSB0aW1lOwogICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KEJvZHkuc2xlZXB5RXZlbnQpOwogICAgICAgIH0gZWxzZSBpZiAoc2xlZXBTdGF0ZSA9PT0gQm9keS5TTEVFUFkgJiYgc3BlZWRTcXVhcmVkID4gc3BlZWRMaW1pdFNxdWFyZWQpIHsKICAgICAgICAgIHRoaXMud2FrZVVwKCk7IC8vIFdha2UgdXAKICAgICAgICB9IGVsc2UgaWYgKHNsZWVwU3RhdGUgPT09IEJvZHkuU0xFRVBZICYmIHRpbWUgLSB0aGlzLnRpbWVMYXN0U2xlZXB5ID4gdGhpcy5zbGVlcFRpbWVMaW1pdCkgewogICAgICAgICAgdGhpcy5zbGVlcCgpOyAvLyBTbGVlcGluZwoKICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChCb2R5LnNsZWVwRXZlbnQpOwogICAgICAgIH0KICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBJZiB0aGUgYm9keSBpcyBzbGVlcGluZywgaXQgc2hvdWxkIGJlIGltbW92YWJsZSAvIGhhdmUgaW5maW5pdGUgbWFzcyBkdXJpbmcgc29sdmUuIFdlIHNvbHZlIGl0IGJ5IGhhdmluZyBhIHNlcGFyYXRlICJzb2x2ZSBtYXNzIi4KICAgICAqLwoKCiAgICB1cGRhdGVTb2x2ZU1hc3NQcm9wZXJ0aWVzKCkgewogICAgICBpZiAodGhpcy5zbGVlcFN0YXRlID09PSBCb2R5LlNMRUVQSU5HIHx8IHRoaXMudHlwZSA9PT0gQm9keS5LSU5FTUFUSUMpIHsKICAgICAgICB0aGlzLmludk1hc3NTb2x2ZSA9IDA7CiAgICAgICAgdGhpcy5pbnZJbmVydGlhU29sdmUuc2V0WmVybygpOwogICAgICAgIHRoaXMuaW52SW5lcnRpYVdvcmxkU29sdmUuc2V0WmVybygpOwogICAgICB9IGVsc2UgewogICAgICAgIHRoaXMuaW52TWFzc1NvbHZlID0gdGhpcy5pbnZNYXNzOwogICAgICAgIHRoaXMuaW52SW5lcnRpYVNvbHZlLmNvcHkodGhpcy5pbnZJbmVydGlhKTsKICAgICAgICB0aGlzLmludkluZXJ0aWFXb3JsZFNvbHZlLmNvcHkodGhpcy5pbnZJbmVydGlhV29ybGQpOwogICAgICB9CiAgICB9CiAgICAvKioKICAgICAqIENvbnZlcnQgYSB3b3JsZCBwb2ludCB0byBsb2NhbCBib2R5IGZyYW1lLgogICAgICovCgoKICAgIHBvaW50VG9Mb2NhbEZyYW1lKHdvcmxkUG9pbnQsIHJlc3VsdCkgewogICAgICBpZiAocmVzdWx0ID09PSB2b2lkIDApIHsKICAgICAgICByZXN1bHQgPSBuZXcgVmVjMygpOwogICAgICB9CgogICAgICB3b3JsZFBvaW50LnZzdWIodGhpcy5wb3NpdGlvbiwgcmVzdWx0KTsKICAgICAgdGhpcy5xdWF0ZXJuaW9uLmNvbmp1Z2F0ZSgpLnZtdWx0KHJlc3VsdCwgcmVzdWx0KTsKICAgICAgcmV0dXJuIHJlc3VsdDsKICAgIH0KICAgIC8qKgogICAgICogQ29udmVydCBhIHdvcmxkIHZlY3RvciB0byBsb2NhbCBib2R5IGZyYW1lLgogICAgICovCgoKICAgIHZlY3RvclRvTG9jYWxGcmFtZSh3b3JsZFZlY3RvciwgcmVzdWx0KSB7CiAgICAgIGlmIChyZXN1bHQgPT09IHZvaWQgMCkgewogICAgICAgIHJlc3VsdCA9IG5ldyBWZWMzKCk7CiAgICAgIH0KCiAgICAgIHRoaXMucXVhdGVybmlvbi5jb25qdWdhdGUoKS52bXVsdCh3b3JsZFZlY3RvciwgcmVzdWx0KTsKICAgICAgcmV0dXJuIHJlc3VsdDsKICAgIH0KICAgIC8qKgogICAgICogQ29udmVydCBhIGxvY2FsIGJvZHkgcG9pbnQgdG8gd29ybGQgZnJhbWUuCiAgICAgKi8KCgogICAgcG9pbnRUb1dvcmxkRnJhbWUobG9jYWxQb2ludCwgcmVzdWx0KSB7CiAgICAgIGlmIChyZXN1bHQgPT09IHZvaWQgMCkgewogICAgICAgIHJlc3VsdCA9IG5ldyBWZWMzKCk7CiAgICAgIH0KCiAgICAgIHRoaXMucXVhdGVybmlvbi52bXVsdChsb2NhbFBvaW50LCByZXN1bHQpOwogICAgICByZXN1bHQudmFkZCh0aGlzLnBvc2l0aW9uLCByZXN1bHQpOwogICAgICByZXR1cm4gcmVzdWx0OwogICAgfQogICAgLyoqCiAgICAgKiBDb252ZXJ0IGEgbG9jYWwgYm9keSBwb2ludCB0byB3b3JsZCBmcmFtZS4KICAgICAqLwoKCiAgICB2ZWN0b3JUb1dvcmxkRnJhbWUobG9jYWxWZWN0b3IsIHJlc3VsdCkgewogICAgICBpZiAocmVzdWx0ID09PSB2b2lkIDApIHsKICAgICAgICByZXN1bHQgPSBuZXcgVmVjMygpOwogICAgICB9CgogICAgICB0aGlzLnF1YXRlcm5pb24udm11bHQobG9jYWxWZWN0b3IsIHJlc3VsdCk7CiAgICAgIHJldHVybiByZXN1bHQ7CiAgICB9CiAgICAvKioKICAgICAqIEFkZCBhIHNoYXBlIHRvIHRoZSBib2R5IHdpdGggYSBsb2NhbCBvZmZzZXQgYW5kIG9yaWVudGF0aW9uLgogICAgICogQHJldHVybiBUaGUgYm9keSBvYmplY3QsIGZvciBjaGFpbmFiaWxpdHkuCiAgICAgKi8KCgogICAgYWRkU2hhcGUoc2hhcGUsIF9vZmZzZXQsIF9vcmllbnRhdGlvbikgewogICAgICBjb25zdCBvZmZzZXQgPSBuZXcgVmVjMygpOwogICAgICBjb25zdCBvcmllbnRhdGlvbiA9IG5ldyBRdWF0ZXJuaW9uKCk7CgogICAgICBpZiAoX29mZnNldCkgewogICAgICAgIG9mZnNldC5jb3B5KF9vZmZzZXQpOwogICAgICB9CgogICAgICBpZiAoX29yaWVudGF0aW9uKSB7CiAgICAgICAgb3JpZW50YXRpb24uY29weShfb3JpZW50YXRpb24pOwogICAgICB9CgogICAgICB0aGlzLnNoYXBlcy5wdXNoKHNoYXBlKTsKICAgICAgdGhpcy5zaGFwZU9mZnNldHMucHVzaChvZmZzZXQpOwogICAgICB0aGlzLnNoYXBlT3JpZW50YXRpb25zLnB1c2gob3JpZW50YXRpb24pOwogICAgICB0aGlzLnVwZGF0ZU1hc3NQcm9wZXJ0aWVzKCk7CiAgICAgIHRoaXMudXBkYXRlQm91bmRpbmdSYWRpdXMoKTsKICAgICAgdGhpcy5hYWJiTmVlZHNVcGRhdGUgPSB0cnVlOwogICAgICBzaGFwZS5ib2R5ID0gdGhpczsKICAgICAgcmV0dXJuIHRoaXM7CiAgICB9CiAgICAvKioKICAgICAqIFJlbW92ZSBhIHNoYXBlIGZyb20gdGhlIGJvZHkuCiAgICAgKiBAcmV0dXJuIFRoZSBib2R5IG9iamVjdCwgZm9yIGNoYWluYWJpbGl0eS4KICAgICAqLwoKCiAgICByZW1vdmVTaGFwZShzaGFwZSkgewogICAgICBjb25zdCBpbmRleCA9IHRoaXMuc2hhcGVzLmluZGV4T2Yoc2hhcGUpOwoKICAgICAgaWYgKGluZGV4ID09PSAtMSkgewogICAgICAgIGNvbnNvbGUud2FybignU2hhcGUgZG9lcyBub3QgYmVsb25nIHRvIHRoZSBib2R5Jyk7CiAgICAgICAgcmV0dXJuIHRoaXM7CiAgICAgIH0KCiAgICAgIHRoaXMuc2hhcGVzLnNwbGljZShpbmRleCwgMSk7CiAgICAgIHRoaXMuc2hhcGVPZmZzZXRzLnNwbGljZShpbmRleCwgMSk7CiAgICAgIHRoaXMuc2hhcGVPcmllbnRhdGlvbnMuc3BsaWNlKGluZGV4LCAxKTsKICAgICAgdGhpcy51cGRhdGVNYXNzUHJvcGVydGllcygpOwogICAgICB0aGlzLnVwZGF0ZUJvdW5kaW5nUmFkaXVzKCk7CiAgICAgIHRoaXMuYWFiYk5lZWRzVXBkYXRlID0gdHJ1ZTsKICAgICAgc2hhcGUuYm9keSA9IG51bGw7CiAgICAgIHJldHVybiB0aGlzOwogICAgfQogICAgLyoqCiAgICAgKiBVcGRhdGUgdGhlIGJvdW5kaW5nIHJhZGl1cyBvZiB0aGUgYm9keS4gU2hvdWxkIGJlIGRvbmUgaWYgYW55IG9mIHRoZSBzaGFwZXMgYXJlIGNoYW5nZWQuCiAgICAgKi8KCgogICAgdXBkYXRlQm91bmRpbmdSYWRpdXMoKSB7CiAgICAgIGNvbnN0IHNoYXBlcyA9IHRoaXMuc2hhcGVzOwogICAgICBjb25zdCBzaGFwZU9mZnNldHMgPSB0aGlzLnNoYXBlT2Zmc2V0czsKICAgICAgY29uc3QgTiA9IHNoYXBlcy5sZW5ndGg7CiAgICAgIGxldCByYWRpdXMgPSAwOwoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgIT09IE47IGkrKykgewogICAgICAgIGNvbnN0IHNoYXBlID0gc2hhcGVzW2ldOwogICAgICAgIHNoYXBlLnVwZGF0ZUJvdW5kaW5nU3BoZXJlUmFkaXVzKCk7CiAgICAgICAgY29uc3Qgb2Zmc2V0ID0gc2hhcGVPZmZzZXRzW2ldLmxlbmd0aCgpOwogICAgICAgIGNvbnN0IHIgPSBzaGFwZS5ib3VuZGluZ1NwaGVyZVJhZGl1czsKCiAgICAgICAgaWYgKG9mZnNldCArIHIgPiByYWRpdXMpIHsKICAgICAgICAgIHJhZGl1cyA9IG9mZnNldCArIHI7CiAgICAgICAgfQogICAgICB9CgogICAgICB0aGlzLmJvdW5kaW5nUmFkaXVzID0gcmFkaXVzOwogICAgfQogICAgLyoqCiAgICAgKiBVcGRhdGVzIHRoZSAuYWFiYgogICAgICovCgoKICAgIHVwZGF0ZUFBQkIoKSB7CiAgICAgIGNvbnN0IHNoYXBlcyA9IHRoaXMuc2hhcGVzOwogICAgICBjb25zdCBzaGFwZU9mZnNldHMgPSB0aGlzLnNoYXBlT2Zmc2V0czsKICAgICAgY29uc3Qgc2hhcGVPcmllbnRhdGlvbnMgPSB0aGlzLnNoYXBlT3JpZW50YXRpb25zOwogICAgICBjb25zdCBOID0gc2hhcGVzLmxlbmd0aDsKICAgICAgY29uc3Qgb2Zmc2V0ID0gdG1wVmVjOwogICAgICBjb25zdCBvcmllbnRhdGlvbiA9IHRtcFF1YXQ7CiAgICAgIGNvbnN0IGJvZHlRdWF0ID0gdGhpcy5xdWF0ZXJuaW9uOwogICAgICBjb25zdCBhYWJiID0gdGhpcy5hYWJiOwogICAgICBjb25zdCBzaGFwZUFBQkIgPSB1cGRhdGVBQUJCX3NoYXBlQUFCQjsKCiAgICAgIGZvciAobGV0IGkgPSAwOyBpICE9PSBOOyBpKyspIHsKICAgICAgICBjb25zdCBzaGFwZSA9IHNoYXBlc1tpXTsgLy8gR2V0IHNoYXBlIHdvcmxkIHBvc2l0aW9uCgogICAgICAgIGJvZHlRdWF0LnZtdWx0KHNoYXBlT2Zmc2V0c1tpXSwgb2Zmc2V0KTsKICAgICAgICBvZmZzZXQudmFkZCh0aGlzLnBvc2l0aW9uLCBvZmZzZXQpOyAvLyBHZXQgc2hhcGUgd29ybGQgcXVhdGVybmlvbgoKICAgICAgICBib2R5UXVhdC5tdWx0KHNoYXBlT3JpZW50YXRpb25zW2ldLCBvcmllbnRhdGlvbik7IC8vIEdldCBzaGFwZSBBQUJCCgogICAgICAgIHNoYXBlLmNhbGN1bGF0ZVdvcmxkQUFCQihvZmZzZXQsIG9yaWVudGF0aW9uLCBzaGFwZUFBQkIubG93ZXJCb3VuZCwgc2hhcGVBQUJCLnVwcGVyQm91bmQpOwoKICAgICAgICBpZiAoaSA9PT0gMCkgewogICAgICAgICAgYWFiYi5jb3B5KHNoYXBlQUFCQik7CiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgIGFhYmIuZXh0ZW5kKHNoYXBlQUFCQik7CiAgICAgICAgfQogICAgICB9CgogICAgICB0aGlzLmFhYmJOZWVkc1VwZGF0ZSA9IGZhbHNlOwogICAgfQogICAgLyoqCiAgICAgKiBVcGRhdGUgYC5pbmVydGlhV29ybGRgIGFuZCBgLmludkluZXJ0aWFXb3JsZGAKICAgICAqLwoKCiAgICB1cGRhdGVJbmVydGlhV29ybGQoZm9yY2UpIHsKICAgICAgY29uc3QgSSA9IHRoaXMuaW52SW5lcnRpYTsKCiAgICAgIGlmIChJLnggPT09IEkueSAmJiBJLnkgPT09IEkueiAmJiAhZm9yY2UpIDsgZWxzZSB7CiAgICAgICAgY29uc3QgbTEgPSB1aXdfbTE7CiAgICAgICAgY29uc3QgbTIgPSB1aXdfbTI7CiAgICAgICAgbTEuc2V0Um90YXRpb25Gcm9tUXVhdGVybmlvbih0aGlzLnF1YXRlcm5pb24pOwogICAgICAgIG0xLnRyYW5zcG9zZShtMik7CiAgICAgICAgbTEuc2NhbGUoSSwgbTEpOwogICAgICAgIG0xLm1tdWx0KG0yLCB0aGlzLmludkluZXJ0aWFXb3JsZCk7CiAgICAgIH0KICAgIH0KICAgIC8qKgogICAgICogQXBwbHkgZm9yY2UgdG8gYSBwb2ludCBvZiB0aGUgYm9keS4gVGhpcyBjb3VsZCBmb3IgZXhhbXBsZSBiZSBhIHBvaW50IG9uIHRoZSBCb2R5IHN1cmZhY2UuCiAgICAgKiBBcHBseWluZyBmb3JjZSB0aGlzIHdheSB3aWxsIGFkZCB0byBCb2R5LmZvcmNlIGFuZCBCb2R5LnRvcnF1ZS4KICAgICAqIEBwYXJhbSBmb3JjZSBUaGUgYW1vdW50IG9mIGZvcmNlIHRvIGFkZC4KICAgICAqIEBwYXJhbSByZWxhdGl2ZVBvaW50IEEgcG9pbnQgcmVsYXRpdmUgdG8gdGhlIGNlbnRlciBvZiBtYXNzIHRvIGFwcGx5IHRoZSBmb3JjZSBvbi4KICAgICAqLwoKCiAgICBhcHBseUZvcmNlKGZvcmNlLCByZWxhdGl2ZVBvaW50KSB7CiAgICAgIGlmIChyZWxhdGl2ZVBvaW50ID09PSB2b2lkIDApIHsKICAgICAgICByZWxhdGl2ZVBvaW50ID0gbmV3IFZlYzMoKTsKICAgICAgfQoKICAgICAgLy8gTmVlZGVkPwogICAgICBpZiAodGhpcy50eXBlICE9PSBCb2R5LkRZTkFNSUMpIHsKICAgICAgICByZXR1cm47CiAgICAgIH0KCiAgICAgIGlmICh0aGlzLnNsZWVwU3RhdGUgPT09IEJvZHkuU0xFRVBJTkcpIHsKICAgICAgICB0aGlzLndha2VVcCgpOwogICAgICB9IC8vIENvbXB1dGUgcHJvZHVjZWQgcm90YXRpb25hbCBmb3JjZQoKCiAgICAgIGNvbnN0IHJvdEZvcmNlID0gQm9keV9hcHBseUZvcmNlX3JvdEZvcmNlOwogICAgICByZWxhdGl2ZVBvaW50LmNyb3NzKGZvcmNlLCByb3RGb3JjZSk7IC8vIEFkZCBsaW5lYXIgZm9yY2UKCiAgICAgIHRoaXMuZm9yY2UudmFkZChmb3JjZSwgdGhpcy5mb3JjZSk7IC8vIEFkZCByb3RhdGlvbmFsIGZvcmNlCgogICAgICB0aGlzLnRvcnF1ZS52YWRkKHJvdEZvcmNlLCB0aGlzLnRvcnF1ZSk7CiAgICB9CiAgICAvKioKICAgICAqIEFwcGx5IGZvcmNlIHRvIGEgbG9jYWwgcG9pbnQgaW4gdGhlIGJvZHkuCiAgICAgKiBAcGFyYW0gZm9yY2UgVGhlIGZvcmNlIHZlY3RvciB0byBhcHBseSwgZGVmaW5lZCBsb2NhbGx5IGluIHRoZSBib2R5IGZyYW1lLgogICAgICogQHBhcmFtIGxvY2FsUG9pbnQgQSBsb2NhbCBwb2ludCBpbiB0aGUgYm9keSB0byBhcHBseSB0aGUgZm9yY2Ugb24uCiAgICAgKi8KCgogICAgYXBwbHlMb2NhbEZvcmNlKGxvY2FsRm9yY2UsIGxvY2FsUG9pbnQpIHsKICAgICAgaWYgKGxvY2FsUG9pbnQgPT09IHZvaWQgMCkgewogICAgICAgIGxvY2FsUG9pbnQgPSBuZXcgVmVjMygpOwogICAgICB9CgogICAgICBpZiAodGhpcy50eXBlICE9PSBCb2R5LkRZTkFNSUMpIHsKICAgICAgICByZXR1cm47CiAgICAgIH0KCiAgICAgIGNvbnN0IHdvcmxkRm9yY2UgPSBCb2R5X2FwcGx5TG9jYWxGb3JjZV93b3JsZEZvcmNlOwogICAgICBjb25zdCByZWxhdGl2ZVBvaW50V29ybGQgPSBCb2R5X2FwcGx5TG9jYWxGb3JjZV9yZWxhdGl2ZVBvaW50V29ybGQ7IC8vIFRyYW5zZm9ybSB0aGUgZm9yY2UgdmVjdG9yIHRvIHdvcmxkIHNwYWNlCgogICAgICB0aGlzLnZlY3RvclRvV29ybGRGcmFtZShsb2NhbEZvcmNlLCB3b3JsZEZvcmNlKTsKICAgICAgdGhpcy52ZWN0b3JUb1dvcmxkRnJhbWUobG9jYWxQb2ludCwgcmVsYXRpdmVQb2ludFdvcmxkKTsKICAgICAgdGhpcy5hcHBseUZvcmNlKHdvcmxkRm9yY2UsIHJlbGF0aXZlUG9pbnRXb3JsZCk7CiAgICB9CiAgICAvKioKICAgICAqIEFwcGx5IHRvcnF1ZSB0byB0aGUgYm9keS4KICAgICAqIEBwYXJhbSB0b3JxdWUgVGhlIGFtb3VudCBvZiB0b3JxdWUgdG8gYWRkLgogICAgICovCgoKICAgIGFwcGx5VG9ycXVlKHRvcnF1ZSkgewogICAgICBpZiAodGhpcy50eXBlICE9PSBCb2R5LkRZTkFNSUMpIHsKICAgICAgICByZXR1cm47CiAgICAgIH0KCiAgICAgIGlmICh0aGlzLnNsZWVwU3RhdGUgPT09IEJvZHkuU0xFRVBJTkcpIHsKICAgICAgICB0aGlzLndha2VVcCgpOwogICAgICB9IC8vIEFkZCByb3RhdGlvbmFsIGZvcmNlCgoKICAgICAgdGhpcy50b3JxdWUudmFkZCh0b3JxdWUsIHRoaXMudG9ycXVlKTsKICAgIH0KICAgIC8qKgogICAgICogQXBwbHkgaW1wdWxzZSB0byBhIHBvaW50IG9mIHRoZSBib2R5LiBUaGlzIGNvdWxkIGZvciBleGFtcGxlIGJlIGEgcG9pbnQgb24gdGhlIEJvZHkgc3VyZmFjZS4KICAgICAqIEFuIGltcHVsc2UgaXMgYSBmb3JjZSBhZGRlZCB0byBhIGJvZHkgZHVyaW5nIGEgc2hvcnQgcGVyaW9kIG9mIHRpbWUgKGltcHVsc2UgPSBmb3JjZSAqIHRpbWUpLgogICAgICogSW1wdWxzZXMgd2lsbCBiZSBhZGRlZCB0byBCb2R5LnZlbG9jaXR5IGFuZCBCb2R5LmFuZ3VsYXJWZWxvY2l0eS4KICAgICAqIEBwYXJhbSBpbXB1bHNlIFRoZSBhbW91bnQgb2YgaW1wdWxzZSB0byBhZGQuCiAgICAgKiBAcGFyYW0gcmVsYXRpdmVQb2ludCBBIHBvaW50IHJlbGF0aXZlIHRvIHRoZSBjZW50ZXIgb2YgbWFzcyB0byBhcHBseSB0aGUgZm9yY2Ugb24uCiAgICAgKi8KCgogICAgYXBwbHlJbXB1bHNlKGltcHVsc2UsIHJlbGF0aXZlUG9pbnQpIHsKICAgICAgaWYgKHJlbGF0aXZlUG9pbnQgPT09IHZvaWQgMCkgewogICAgICAgIHJlbGF0aXZlUG9pbnQgPSBuZXcgVmVjMygpOwogICAgICB9CgogICAgICBpZiAodGhpcy50eXBlICE9PSBCb2R5LkRZTkFNSUMpIHsKICAgICAgICByZXR1cm47CiAgICAgIH0KCiAgICAgIGlmICh0aGlzLnNsZWVwU3RhdGUgPT09IEJvZHkuU0xFRVBJTkcpIHsKICAgICAgICB0aGlzLndha2VVcCgpOwogICAgICB9IC8vIENvbXB1dGUgcG9pbnQgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGJvZHkgY2VudGVyCgoKICAgICAgY29uc3QgciA9IHJlbGF0aXZlUG9pbnQ7IC8vIENvbXB1dGUgcHJvZHVjZWQgY2VudHJhbCBpbXB1bHNlIHZlbG9jaXR5CgogICAgICBjb25zdCB2ZWxvID0gQm9keV9hcHBseUltcHVsc2VfdmVsbzsKICAgICAgdmVsby5jb3B5KGltcHVsc2UpOwogICAgICB2ZWxvLnNjYWxlKHRoaXMuaW52TWFzcywgdmVsbyk7IC8vIEFkZCBsaW5lYXIgaW1wdWxzZQoKICAgICAgdGhpcy52ZWxvY2l0eS52YWRkKHZlbG8sIHRoaXMudmVsb2NpdHkpOyAvLyBDb21wdXRlIHByb2R1Y2VkIHJvdGF0aW9uYWwgaW1wdWxzZSB2ZWxvY2l0eQoKICAgICAgY29uc3Qgcm90VmVsbyA9IEJvZHlfYXBwbHlJbXB1bHNlX3JvdFZlbG87CiAgICAgIHIuY3Jvc3MoaW1wdWxzZSwgcm90VmVsbyk7CiAgICAgIC8qCiAgICAgICByb3RWZWxvLnggKj0gdGhpcy5pbnZJbmVydGlhLng7CiAgICAgICByb3RWZWxvLnkgKj0gdGhpcy5pbnZJbmVydGlhLnk7CiAgICAgICByb3RWZWxvLnogKj0gdGhpcy5pbnZJbmVydGlhLno7CiAgICAgICAqLwoKICAgICAgdGhpcy5pbnZJbmVydGlhV29ybGQudm11bHQocm90VmVsbywgcm90VmVsbyk7IC8vIEFkZCByb3RhdGlvbmFsIEltcHVsc2UKCiAgICAgIHRoaXMuYW5ndWxhclZlbG9jaXR5LnZhZGQocm90VmVsbywgdGhpcy5hbmd1bGFyVmVsb2NpdHkpOwogICAgfQogICAgLyoqCiAgICAgKiBBcHBseSBsb2NhbGx5LWRlZmluZWQgaW1wdWxzZSB0byBhIGxvY2FsIHBvaW50IGluIHRoZSBib2R5LgogICAgICogQHBhcmFtIGZvcmNlIFRoZSBmb3JjZSB2ZWN0b3IgdG8gYXBwbHksIGRlZmluZWQgbG9jYWxseSBpbiB0aGUgYm9keSBmcmFtZS4KICAgICAqIEBwYXJhbSBsb2NhbFBvaW50IEEgbG9jYWwgcG9pbnQgaW4gdGhlIGJvZHkgdG8gYXBwbHkgdGhlIGZvcmNlIG9uLgogICAgICovCgoKICAgIGFwcGx5TG9jYWxJbXB1bHNlKGxvY2FsSW1wdWxzZSwgbG9jYWxQb2ludCkgewogICAgICBpZiAobG9jYWxQb2ludCA9PT0gdm9pZCAwKSB7CiAgICAgICAgbG9jYWxQb2ludCA9IG5ldyBWZWMzKCk7CiAgICAgIH0KCiAgICAgIGlmICh0aGlzLnR5cGUgIT09IEJvZHkuRFlOQU1JQykgewogICAgICAgIHJldHVybjsKICAgICAgfQoKICAgICAgY29uc3Qgd29ybGRJbXB1bHNlID0gQm9keV9hcHBseUxvY2FsSW1wdWxzZV93b3JsZEltcHVsc2U7CiAgICAgIGNvbnN0IHJlbGF0aXZlUG9pbnRXb3JsZCA9IEJvZHlfYXBwbHlMb2NhbEltcHVsc2VfcmVsYXRpdmVQb2ludDsgLy8gVHJhbnNmb3JtIHRoZSBmb3JjZSB2ZWN0b3IgdG8gd29ybGQgc3BhY2UKCiAgICAgIHRoaXMudmVjdG9yVG9Xb3JsZEZyYW1lKGxvY2FsSW1wdWxzZSwgd29ybGRJbXB1bHNlKTsKICAgICAgdGhpcy52ZWN0b3JUb1dvcmxkRnJhbWUobG9jYWxQb2ludCwgcmVsYXRpdmVQb2ludFdvcmxkKTsKICAgICAgdGhpcy5hcHBseUltcHVsc2Uod29ybGRJbXB1bHNlLCByZWxhdGl2ZVBvaW50V29ybGQpOwogICAgfQogICAgLyoqCiAgICAgKiBTaG91bGQgYmUgY2FsbGVkIHdoZW5ldmVyIHlvdSBjaGFuZ2UgdGhlIGJvZHkgc2hhcGUgb3IgbWFzcy4KICAgICAqLwoKCiAgICB1cGRhdGVNYXNzUHJvcGVydGllcygpIHsKICAgICAgY29uc3QgaGFsZkV4dGVudHMgPSBCb2R5X3VwZGF0ZU1hc3NQcm9wZXJ0aWVzX2hhbGZFeHRlbnRzOwogICAgICB0aGlzLmludk1hc3MgPSB0aGlzLm1hc3MgPiAwID8gMS4wIC8gdGhpcy5tYXNzIDogMDsKICAgICAgY29uc3QgSSA9IHRoaXMuaW5lcnRpYTsKICAgICAgY29uc3QgZml4ZWQgPSB0aGlzLmZpeGVkUm90YXRpb247IC8vIEFwcHJveGltYXRlIHdpdGggQUFCQiBib3gKCiAgICAgIHRoaXMudXBkYXRlQUFCQigpOwogICAgICBoYWxmRXh0ZW50cy5zZXQoKHRoaXMuYWFiYi51cHBlckJvdW5kLnggLSB0aGlzLmFhYmIubG93ZXJCb3VuZC54KSAvIDIsICh0aGlzLmFhYmIudXBwZXJCb3VuZC55IC0gdGhpcy5hYWJiLmxvd2VyQm91bmQueSkgLyAyLCAodGhpcy5hYWJiLnVwcGVyQm91bmQueiAtIHRoaXMuYWFiYi5sb3dlckJvdW5kLnopIC8gMik7CiAgICAgIEJveC5jYWxjdWxhdGVJbmVydGlhKGhhbGZFeHRlbnRzLCB0aGlzLm1hc3MsIEkpOwogICAgICB0aGlzLmludkluZXJ0aWEuc2V0KEkueCA+IDAgJiYgIWZpeGVkID8gMS4wIC8gSS54IDogMCwgSS55ID4gMCAmJiAhZml4ZWQgPyAxLjAgLyBJLnkgOiAwLCBJLnogPiAwICYmICFmaXhlZCA/IDEuMCAvIEkueiA6IDApOwogICAgICB0aGlzLnVwZGF0ZUluZXJ0aWFXb3JsZCh0cnVlKTsKICAgIH0KICAgIC8qKgogICAgICogR2V0IHdvcmxkIHZlbG9jaXR5IG9mIGEgcG9pbnQgaW4gdGhlIGJvZHkuCiAgICAgKiBAcGFyYW0gd29ybGRQb2ludAogICAgICogQHBhcmFtIHJlc3VsdAogICAgICogQHJldHVybiBUaGUgcmVzdWx0IHZlY3Rvci4KICAgICAqLwoKCiAgICBnZXRWZWxvY2l0eUF0V29ybGRQb2ludCh3b3JsZFBvaW50LCByZXN1bHQpIHsKICAgICAgY29uc3QgciA9IG5ldyBWZWMzKCk7CiAgICAgIHdvcmxkUG9pbnQudnN1Yih0aGlzLnBvc2l0aW9uLCByKTsKICAgICAgdGhpcy5hbmd1bGFyVmVsb2NpdHkuY3Jvc3MociwgcmVzdWx0KTsKICAgICAgdGhpcy52ZWxvY2l0eS52YWRkKHJlc3VsdCwgcmVzdWx0KTsKICAgICAgcmV0dXJuIHJlc3VsdDsKICAgIH0KICAgIC8qKgogICAgICogTW92ZSB0aGUgYm9keSBmb3J3YXJkIGluIHRpbWUuCiAgICAgKiBAcGFyYW0gZHQgVGltZSBzdGVwCiAgICAgKiBAcGFyYW0gcXVhdE5vcm1hbGl6ZSBTZXQgdG8gdHJ1ZSB0byBub3JtYWxpemUgdGhlIGJvZHkgcXVhdGVybmlvbgogICAgICogQHBhcmFtIHF1YXROb3JtYWxpemVGYXN0IElmIHRoZSBxdWF0ZXJuaW9uIHNob3VsZCBiZSBub3JtYWxpemVkIHVzaW5nICJmYXN0IiBxdWF0ZXJuaW9uIG5vcm1hbGl6YXRpb24KICAgICAqLwoKCiAgICBpbnRlZ3JhdGUoZHQsIHF1YXROb3JtYWxpemUsIHF1YXROb3JtYWxpemVGYXN0KSB7CiAgICAgIC8vIFNhdmUgcHJldmlvdXMgcG9zaXRpb24KICAgICAgdGhpcy5wcmV2aW91c1Bvc2l0aW9uLmNvcHkodGhpcy5wb3NpdGlvbik7CiAgICAgIHRoaXMucHJldmlvdXNRdWF0ZXJuaW9uLmNvcHkodGhpcy5xdWF0ZXJuaW9uKTsKCiAgICAgIGlmICghKHRoaXMudHlwZSA9PT0gQm9keS5EWU5BTUlDIHx8IHRoaXMudHlwZSA9PT0gQm9keS5LSU5FTUFUSUMpIHx8IHRoaXMuc2xlZXBTdGF0ZSA9PT0gQm9keS5TTEVFUElORykgewogICAgICAgIC8vIE9ubHkgZm9yIGR5bmFtaWMKICAgICAgICByZXR1cm47CiAgICAgIH0KCiAgICAgIGNvbnN0IHZlbG8gPSB0aGlzLnZlbG9jaXR5OwogICAgICBjb25zdCBhbmd1bGFyVmVsbyA9IHRoaXMuYW5ndWxhclZlbG9jaXR5OwogICAgICBjb25zdCBwb3MgPSB0aGlzLnBvc2l0aW9uOwogICAgICBjb25zdCBmb3JjZSA9IHRoaXMuZm9yY2U7CiAgICAgIGNvbnN0IHRvcnF1ZSA9IHRoaXMudG9ycXVlOwogICAgICBjb25zdCBxdWF0ID0gdGhpcy5xdWF0ZXJuaW9uOwogICAgICBjb25zdCBpbnZNYXNzID0gdGhpcy5pbnZNYXNzOwogICAgICBjb25zdCBpbnZJbmVydGlhID0gdGhpcy5pbnZJbmVydGlhV29ybGQ7CiAgICAgIGNvbnN0IGxpbmVhckZhY3RvciA9IHRoaXMubGluZWFyRmFjdG9yOwogICAgICBjb25zdCBpTWR0ID0gaW52TWFzcyAqIGR0OwogICAgICB2ZWxvLnggKz0gZm9yY2UueCAqIGlNZHQgKiBsaW5lYXJGYWN0b3IueDsKICAgICAgdmVsby55ICs9IGZvcmNlLnkgKiBpTWR0ICogbGluZWFyRmFjdG9yLnk7CiAgICAgIHZlbG8ueiArPSBmb3JjZS56ICogaU1kdCAqIGxpbmVhckZhY3Rvci56OwogICAgICBjb25zdCBlID0gaW52SW5lcnRpYS5lbGVtZW50czsKICAgICAgY29uc3QgYW5ndWxhckZhY3RvciA9IHRoaXMuYW5ndWxhckZhY3RvcjsKICAgICAgY29uc3QgdHggPSB0b3JxdWUueCAqIGFuZ3VsYXJGYWN0b3IueDsKICAgICAgY29uc3QgdHkgPSB0b3JxdWUueSAqIGFuZ3VsYXJGYWN0b3IueTsKICAgICAgY29uc3QgdHogPSB0b3JxdWUueiAqIGFuZ3VsYXJGYWN0b3IuejsKICAgICAgYW5ndWxhclZlbG8ueCArPSBkdCAqIChlWzBdICogdHggKyBlWzFdICogdHkgKyBlWzJdICogdHopOwogICAgICBhbmd1bGFyVmVsby55ICs9IGR0ICogKGVbM10gKiB0eCArIGVbNF0gKiB0eSArIGVbNV0gKiB0eik7CiAgICAgIGFuZ3VsYXJWZWxvLnogKz0gZHQgKiAoZVs2XSAqIHR4ICsgZVs3XSAqIHR5ICsgZVs4XSAqIHR6KTsgLy8gVXNlIG5ldyB2ZWxvY2l0eSAgLSBsZWFwIGZyb2cKCiAgICAgIHBvcy54ICs9IHZlbG8ueCAqIGR0OwogICAgICBwb3MueSArPSB2ZWxvLnkgKiBkdDsKICAgICAgcG9zLnogKz0gdmVsby56ICogZHQ7CiAgICAgIHF1YXQuaW50ZWdyYXRlKHRoaXMuYW5ndWxhclZlbG9jaXR5LCBkdCwgdGhpcy5hbmd1bGFyRmFjdG9yLCBxdWF0KTsKCiAgICAgIGlmIChxdWF0Tm9ybWFsaXplKSB7CiAgICAgICAgaWYgKHF1YXROb3JtYWxpemVGYXN0KSB7CiAgICAgICAgICBxdWF0Lm5vcm1hbGl6ZUZhc3QoKTsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgcXVhdC5ub3JtYWxpemUoKTsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIHRoaXMuYWFiYk5lZWRzVXBkYXRlID0gdHJ1ZTsgLy8gVXBkYXRlIHdvcmxkIGluZXJ0aWEKCiAgICAgIHRoaXMudXBkYXRlSW5lcnRpYVdvcmxkKCk7CiAgICB9CgogIH0KICBCb2R5LmlkQ291bnRlciA9IDA7CiAgQm9keS5DT0xMSURFX0VWRU5UX05BTUUgPSAnY29sbGlkZSc7CiAgQm9keS5EWU5BTUlDID0gQk9EWV9UWVBFUy5EWU5BTUlDOwogIEJvZHkuU1RBVElDID0gQk9EWV9UWVBFUy5TVEFUSUM7CiAgQm9keS5LSU5FTUFUSUMgPSBCT0RZX1RZUEVTLktJTkVNQVRJQzsKICBCb2R5LkFXQUtFID0gQk9EWV9TTEVFUF9TVEFURVMuQVdBS0U7CiAgQm9keS5TTEVFUFkgPSBCT0RZX1NMRUVQX1NUQVRFUy5TTEVFUFk7CiAgQm9keS5TTEVFUElORyA9IEJPRFlfU0xFRVBfU1RBVEVTLlNMRUVQSU5HOwogIEJvZHkud2FrZXVwRXZlbnQgPSB7CiAgICB0eXBlOiAnd2FrZXVwJwogIH07CiAgQm9keS5zbGVlcHlFdmVudCA9IHsKICAgIHR5cGU6ICdzbGVlcHknCiAgfTsKICBCb2R5LnNsZWVwRXZlbnQgPSB7CiAgICB0eXBlOiAnc2xlZXAnCiAgfTsKICBjb25zdCB0bXBWZWMgPSBuZXcgVmVjMygpOwogIGNvbnN0IHRtcFF1YXQgPSBuZXcgUXVhdGVybmlvbigpOwogIGNvbnN0IHVwZGF0ZUFBQkJfc2hhcGVBQUJCID0gbmV3IEFBQkIoKTsKICBjb25zdCB1aXdfbTEgPSBuZXcgTWF0MygpOwogIGNvbnN0IHVpd19tMiA9IG5ldyBNYXQzKCk7CiAgbmV3IE1hdDMoKTsKICBjb25zdCBCb2R5X2FwcGx5Rm9yY2Vfcm90Rm9yY2UgPSBuZXcgVmVjMygpOwogIGNvbnN0IEJvZHlfYXBwbHlMb2NhbEZvcmNlX3dvcmxkRm9yY2UgPSBuZXcgVmVjMygpOwogIGNvbnN0IEJvZHlfYXBwbHlMb2NhbEZvcmNlX3JlbGF0aXZlUG9pbnRXb3JsZCA9IG5ldyBWZWMzKCk7CiAgY29uc3QgQm9keV9hcHBseUltcHVsc2VfdmVsbyA9IG5ldyBWZWMzKCk7CiAgY29uc3QgQm9keV9hcHBseUltcHVsc2Vfcm90VmVsbyA9IG5ldyBWZWMzKCk7CiAgY29uc3QgQm9keV9hcHBseUxvY2FsSW1wdWxzZV93b3JsZEltcHVsc2UgPSBuZXcgVmVjMygpOwogIGNvbnN0IEJvZHlfYXBwbHlMb2NhbEltcHVsc2VfcmVsYXRpdmVQb2ludCA9IG5ldyBWZWMzKCk7CiAgY29uc3QgQm9keV91cGRhdGVNYXNzUHJvcGVydGllc19oYWxmRXh0ZW50cyA9IG5ldyBWZWMzKCk7CgogIC8qKgogICAqIEJhc2UgY2xhc3MgZm9yIGJyb2FkcGhhc2UgaW1wbGVtZW50YXRpb25zCiAgICogQGF1dGhvciBzY2h0ZXBwZQogICAqLwogIGNsYXNzIEJyb2FkcGhhc2UgewogICAgLyoqCiAgICAgKiBUaGUgd29ybGQgdG8gc2VhcmNoIGZvciBjb2xsaXNpb25zIGluLgogICAgICovCgogICAgLyoqCiAgICAgKiBJZiBzZXQgdG8gdHJ1ZSwgdGhlIGJyb2FkcGhhc2UgdXNlcyBib3VuZGluZyBib3hlcyBmb3IgaW50ZXJzZWN0aW9uIHRlc3RzLCBlbHNlIGl0IHVzZXMgYm91bmRpbmcgc3BoZXJlcy4KICAgICAqLwoKICAgIC8qKgogICAgICogU2V0IHRvIHRydWUgaWYgdGhlIG9iamVjdHMgaW4gdGhlIHdvcmxkIG1vdmVkLgogICAgICovCiAgICBjb25zdHJ1Y3RvcigpIHsKICAgICAgdGhpcy53b3JsZCA9IG51bGw7CiAgICAgIHRoaXMudXNlQm91bmRpbmdCb3hlcyA9IGZhbHNlOwogICAgICB0aGlzLmRpcnR5ID0gdHJ1ZTsKICAgIH0KICAgIC8qKgogICAgICogR2V0IHRoZSBjb2xsaXNpb24gcGFpcnMgZnJvbSB0aGUgd29ybGQKICAgICAqIEBwYXJhbSB3b3JsZCBUaGUgd29ybGQgdG8gc2VhcmNoIGluCiAgICAgKiBAcGFyYW0gcDEgRW1wdHkgYXJyYXkgdG8gYmUgZmlsbGVkIHdpdGggYm9keSBvYmplY3RzCiAgICAgKiBAcGFyYW0gcDIgRW1wdHkgYXJyYXkgdG8gYmUgZmlsbGVkIHdpdGggYm9keSBvYmplY3RzCiAgICAgKi8KCgogICAgY29sbGlzaW9uUGFpcnMod29ybGQsIHAxLCBwMikgewogICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvbGxpc2lvblBhaXJzIG5vdCBpbXBsZW1lbnRlZCBmb3IgdGhpcyBCcm9hZFBoYXNlIGNsYXNzIScpOwogICAgfQogICAgLyoqCiAgICAgKiBDaGVjayBpZiBhIGJvZHkgcGFpciBuZWVkcyB0byBiZSBpbnRlcnNlY3Rpb24gdGVzdGVkIGF0IGFsbC4KICAgICAqLwoKCiAgICBuZWVkQnJvYWRwaGFzZUNvbGxpc2lvbihib2R5QSwgYm9keUIpIHsKICAgICAgLy8gQ2hlY2sgY29sbGlzaW9uIGZpbHRlciBtYXNrcwogICAgICBpZiAoKGJvZHlBLmNvbGxpc2lvbkZpbHRlckdyb3VwICYgYm9keUIuY29sbGlzaW9uRmlsdGVyTWFzaykgPT09IDAgfHwgKGJvZHlCLmNvbGxpc2lvbkZpbHRlckdyb3VwICYgYm9keUEuY29sbGlzaW9uRmlsdGVyTWFzaykgPT09IDApIHsKICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgIH0gLy8gQ2hlY2sgdHlwZXMKCgogICAgICBpZiAoKChib2R5QS50eXBlICYgQm9keS5TVEFUSUMpICE9PSAwIHx8IGJvZHlBLnNsZWVwU3RhdGUgPT09IEJvZHkuU0xFRVBJTkcpICYmICgoYm9keUIudHlwZSAmIEJvZHkuU1RBVElDKSAhPT0gMCB8fCBib2R5Qi5zbGVlcFN0YXRlID09PSBCb2R5LlNMRUVQSU5HKSkgewogICAgICAgIC8vIEJvdGggYm9kaWVzIGFyZSBzdGF0aWMgb3Igc2xlZXBpbmcuIFNraXAuCiAgICAgICAgcmV0dXJuIGZhbHNlOwogICAgICB9CgogICAgICByZXR1cm4gdHJ1ZTsKICAgIH0KICAgIC8qKgogICAgICogQ2hlY2sgaWYgdGhlIGJvdW5kaW5nIHZvbHVtZXMgb2YgdHdvIGJvZGllcyBpbnRlcnNlY3QuCiAgICAgKi8KCgogICAgaW50ZXJzZWN0aW9uVGVzdChib2R5QSwgYm9keUIsIHBhaXJzMSwgcGFpcnMyKSB7CiAgICAgIGlmICh0aGlzLnVzZUJvdW5kaW5nQm94ZXMpIHsKICAgICAgICB0aGlzLmRvQm91bmRpbmdCb3hCcm9hZHBoYXNlKGJvZHlBLCBib2R5QiwgcGFpcnMxLCBwYWlyczIpOwogICAgICB9IGVsc2UgewogICAgICAgIHRoaXMuZG9Cb3VuZGluZ1NwaGVyZUJyb2FkcGhhc2UoYm9keUEsIGJvZHlCLCBwYWlyczEsIHBhaXJzMik7CiAgICAgIH0KICAgIH0KICAgIC8qKgogICAgICogQ2hlY2sgaWYgdGhlIGJvdW5kaW5nIHNwaGVyZXMgb2YgdHdvIGJvZGllcyBhcmUgaW50ZXJzZWN0aW5nLgogICAgICogQHBhcmFtIHBhaXJzMSBib2R5QSBpcyBhcHBlbmRlZCB0byB0aGlzIGFycmF5IGlmIGludGVyc2VjdGlvbgogICAgICogQHBhcmFtIHBhaXJzMiBib2R5QiBpcyBhcHBlbmRlZCB0byB0aGlzIGFycmF5IGlmIGludGVyc2VjdGlvbgogICAgICovCgoKICAgIGRvQm91bmRpbmdTcGhlcmVCcm9hZHBoYXNlKGJvZHlBLCBib2R5QiwgcGFpcnMxLCBwYWlyczIpIHsKICAgICAgY29uc3QgciA9IEJyb2FkcGhhc2VfY29sbGlzaW9uUGFpcnNfcjsKICAgICAgYm9keUIucG9zaXRpb24udnN1Yihib2R5QS5wb3NpdGlvbiwgcik7CiAgICAgIGNvbnN0IGJvdW5kaW5nUmFkaXVzU3VtMiA9IChib2R5QS5ib3VuZGluZ1JhZGl1cyArIGJvZHlCLmJvdW5kaW5nUmFkaXVzKSAqKiAyOwogICAgICBjb25zdCBub3JtMiA9IHIubGVuZ3RoU3F1YXJlZCgpOwoKICAgICAgaWYgKG5vcm0yIDwgYm91bmRpbmdSYWRpdXNTdW0yKSB7CiAgICAgICAgcGFpcnMxLnB1c2goYm9keUEpOwogICAgICAgIHBhaXJzMi5wdXNoKGJvZHlCKTsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBDaGVjayBpZiB0aGUgYm91bmRpbmcgYm94ZXMgb2YgdHdvIGJvZGllcyBhcmUgaW50ZXJzZWN0aW5nLgogICAgICovCgoKICAgIGRvQm91bmRpbmdCb3hCcm9hZHBoYXNlKGJvZHlBLCBib2R5QiwgcGFpcnMxLCBwYWlyczIpIHsKICAgICAgaWYgKGJvZHlBLmFhYmJOZWVkc1VwZGF0ZSkgewogICAgICAgIGJvZHlBLnVwZGF0ZUFBQkIoKTsKICAgICAgfQoKICAgICAgaWYgKGJvZHlCLmFhYmJOZWVkc1VwZGF0ZSkgewogICAgICAgIGJvZHlCLnVwZGF0ZUFBQkIoKTsKICAgICAgfSAvLyBDaGVjayBBQUJCIC8gQUFCQgoKCiAgICAgIGlmIChib2R5QS5hYWJiLm92ZXJsYXBzKGJvZHlCLmFhYmIpKSB7CiAgICAgICAgcGFpcnMxLnB1c2goYm9keUEpOwogICAgICAgIHBhaXJzMi5wdXNoKGJvZHlCKTsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBSZW1vdmVzIGR1cGxpY2F0ZSBwYWlycyBmcm9tIHRoZSBwYWlyIGFycmF5cy4KICAgICAqLwoKCiAgICBtYWtlUGFpcnNVbmlxdWUocGFpcnMxLCBwYWlyczIpIHsKICAgICAgY29uc3QgdCA9IEJyb2FkcGhhc2VfbWFrZVBhaXJzVW5pcXVlX3RlbXA7CiAgICAgIGNvbnN0IHAxID0gQnJvYWRwaGFzZV9tYWtlUGFpcnNVbmlxdWVfcDE7CiAgICAgIGNvbnN0IHAyID0gQnJvYWRwaGFzZV9tYWtlUGFpcnNVbmlxdWVfcDI7CiAgICAgIGNvbnN0IE4gPSBwYWlyczEubGVuZ3RoOwoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgIT09IE47IGkrKykgewogICAgICAgIHAxW2ldID0gcGFpcnMxW2ldOwogICAgICAgIHAyW2ldID0gcGFpcnMyW2ldOwogICAgICB9CgogICAgICBwYWlyczEubGVuZ3RoID0gMDsKICAgICAgcGFpcnMyLmxlbmd0aCA9IDA7CgogICAgICBmb3IgKGxldCBpID0gMDsgaSAhPT0gTjsgaSsrKSB7CiAgICAgICAgY29uc3QgaWQxID0gcDFbaV0uaWQ7CiAgICAgICAgY29uc3QgaWQyID0gcDJbaV0uaWQ7CiAgICAgICAgY29uc3Qga2V5ID0gaWQxIDwgaWQyID8gYCR7aWQxfSwke2lkMn1gIDogYCR7aWQyfSwke2lkMX1gOwogICAgICAgIHRba2V5XSA9IGk7CiAgICAgICAgdC5rZXlzLnB1c2goa2V5KTsKICAgICAgfQoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgIT09IHQua2V5cy5sZW5ndGg7IGkrKykgewogICAgICAgIGNvbnN0IGtleSA9IHQua2V5cy5wb3AoKTsKICAgICAgICBjb25zdCBwYWlySW5kZXggPSB0W2tleV07CiAgICAgICAgcGFpcnMxLnB1c2gocDFbcGFpckluZGV4XSk7CiAgICAgICAgcGFpcnMyLnB1c2gocDJbcGFpckluZGV4XSk7CiAgICAgICAgZGVsZXRlIHRba2V5XTsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBUbyBiZSBpbXBsZW1lbnRlZCBieSBzdWJjYXNzZXMKICAgICAqLwoKCiAgICBzZXRXb3JsZCh3b3JsZCkge30KICAgIC8qKgogICAgICogQ2hlY2sgaWYgdGhlIGJvdW5kaW5nIHNwaGVyZXMgb2YgdHdvIGJvZGllcyBvdmVybGFwLgogICAgICovCgoKICAgIHN0YXRpYyBib3VuZGluZ1NwaGVyZUNoZWNrKGJvZHlBLCBib2R5QikgewogICAgICBjb25zdCBkaXN0ID0gbmV3IFZlYzMoKTsgLy8gYnNjX2Rpc3Q7CgogICAgICBib2R5QS5wb3NpdGlvbi52c3ViKGJvZHlCLnBvc2l0aW9uLCBkaXN0KTsKICAgICAgY29uc3Qgc2EgPSBib2R5QS5zaGFwZXNbMF07CiAgICAgIGNvbnN0IHNiID0gYm9keUIuc2hhcGVzWzBdOwogICAgICByZXR1cm4gTWF0aC5wb3coc2EuYm91bmRpbmdTcGhlcmVSYWRpdXMgKyBzYi5ib3VuZGluZ1NwaGVyZVJhZGl1cywgMikgPiBkaXN0Lmxlbmd0aFNxdWFyZWQoKTsKICAgIH0KICAgIC8qKgogICAgICogUmV0dXJucyBhbGwgdGhlIGJvZGllcyB3aXRoaW4gdGhlIEFBQkIuCiAgICAgKi8KCgogICAgYWFiYlF1ZXJ5KHdvcmxkLCBhYWJiLCByZXN1bHQpIHsKICAgICAgY29uc29sZS53YXJuKCcuYWFiYlF1ZXJ5IGlzIG5vdCBpbXBsZW1lbnRlZCBpbiB0aGlzIEJyb2FkcGhhc2Ugc3ViY2xhc3MuJyk7CiAgICAgIHJldHVybiBbXTsKICAgIH0KCiAgfSAvLyBUZW1wIG9iamVjdHMKCiAgY29uc3QgQnJvYWRwaGFzZV9jb2xsaXNpb25QYWlyc19yID0gbmV3IFZlYzMoKTsKICBuZXcgVmVjMygpOwogIG5ldyBRdWF0ZXJuaW9uKCk7CiAgbmV3IFZlYzMoKTsKICBjb25zdCBCcm9hZHBoYXNlX21ha2VQYWlyc1VuaXF1ZV90ZW1wID0gewogICAga2V5czogW10KICB9OwogIGNvbnN0IEJyb2FkcGhhc2VfbWFrZVBhaXJzVW5pcXVlX3AxID0gW107CiAgY29uc3QgQnJvYWRwaGFzZV9tYWtlUGFpcnNVbmlxdWVfcDIgPSBbXTsKICBuZXcgVmVjMygpOwogIG5ldyBWZWMzKCk7CiAgbmV3IFZlYzMoKTsKCiAgLyoqCiAgICogTmFpdmUgYnJvYWRwaGFzZSBpbXBsZW1lbnRhdGlvbiwgdXNlZCBpbiBsYWNrIG9mIGJldHRlciBvbmVzLgogICAqCiAgICogVGhlIG5haXZlIGJyb2FkcGhhc2UgbG9va3MgYXQgYWxsIHBvc3NpYmxlIHBhaXJzIHdpdGhvdXQgcmVzdHJpY3Rpb24sIHRoZXJlZm9yZSBpdCBoYXMgY29tcGxleGl0eSBOXjIgXyh3aGljaCBpcyBiYWQpXwogICAqLwogIGNsYXNzIE5haXZlQnJvYWRwaGFzZSBleHRlbmRzIEJyb2FkcGhhc2UgewogICAgLyoqCiAgICAgKiBAdG9kbyBSZW1vdmUgdXNlbGVzcyBjb25zdHJ1Y3RvcgogICAgICovCiAgICBjb25zdHJ1Y3RvcigpIHsKICAgICAgc3VwZXIoKTsKICAgIH0KICAgIC8qKgogICAgICogR2V0IGFsbCB0aGUgY29sbGlzaW9uIHBhaXJzIGluIHRoZSBwaHlzaWNzIHdvcmxkCiAgICAgKi8KCgogICAgY29sbGlzaW9uUGFpcnMod29ybGQsIHBhaXJzMSwgcGFpcnMyKSB7CiAgICAgIGNvbnN0IGJvZGllcyA9IHdvcmxkLmJvZGllczsKICAgICAgY29uc3QgbiA9IGJvZGllcy5sZW5ndGg7CiAgICAgIGxldCBiaTsKICAgICAgbGV0IGJqOyAvLyBOYWl2ZSBOXjIgZnR3IQoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgIT09IG47IGkrKykgewogICAgICAgIGZvciAobGV0IGogPSAwOyBqICE9PSBpOyBqKyspIHsKICAgICAgICAgIGJpID0gYm9kaWVzW2ldOwogICAgICAgICAgYmogPSBib2RpZXNbal07CgogICAgICAgICAgaWYgKCF0aGlzLm5lZWRCcm9hZHBoYXNlQ29sbGlzaW9uKGJpLCBiaikpIHsKICAgICAgICAgICAgY29udGludWU7CiAgICAgICAgICB9CgogICAgICAgICAgdGhpcy5pbnRlcnNlY3Rpb25UZXN0KGJpLCBiaiwgcGFpcnMxLCBwYWlyczIpOwogICAgICAgIH0KICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBSZXR1cm5zIGFsbCB0aGUgYm9kaWVzIHdpdGhpbiBhbiBBQUJCLgogICAgICogQHBhcmFtIHJlc3VsdCBBbiBhcnJheSB0byBzdG9yZSByZXN1bHRpbmcgYm9kaWVzIGluLgogICAgICovCgoKICAgIGFhYmJRdWVyeSh3b3JsZCwgYWFiYiwgcmVzdWx0KSB7CiAgICAgIGlmIChyZXN1bHQgPT09IHZvaWQgMCkgewogICAgICAgIHJlc3VsdCA9IFtdOwogICAgICB9CgogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdvcmxkLmJvZGllcy5sZW5ndGg7IGkrKykgewogICAgICAgIGNvbnN0IGIgPSB3b3JsZC5ib2RpZXNbaV07CgogICAgICAgIGlmIChiLmFhYmJOZWVkc1VwZGF0ZSkgewogICAgICAgICAgYi51cGRhdGVBQUJCKCk7CiAgICAgICAgfSAvLyBVZ2x5IGhhY2sgdW50aWwgQm9keSBnZXRzIGFhYmIKCgogICAgICAgIGlmIChiLmFhYmIub3ZlcmxhcHMoYWFiYikpIHsKICAgICAgICAgIHJlc3VsdC5wdXNoKGIpOwogICAgICAgIH0KICAgICAgfQoKICAgICAgcmV0dXJuIHJlc3VsdDsKICAgIH0KCiAgfQoKICAvKioKICAgKiBTdG9yYWdlIGZvciBSYXkgY2FzdGluZyBkYXRhCiAgICovCiAgY2xhc3MgUmF5Y2FzdFJlc3VsdCB7CiAgICAvKioKICAgICAqIHJheUZyb21Xb3JsZAogICAgICovCgogICAgLyoqCiAgICAgKiByYXlUb1dvcmxkCiAgICAgKi8KCiAgICAvKioKICAgICAqIGhpdE5vcm1hbFdvcmxkCiAgICAgKi8KCiAgICAvKioKICAgICAqIGhpdFBvaW50V29ybGQKICAgICAqLwoKICAgIC8qKgogICAgICogaGFzSGl0CiAgICAgKi8KCiAgICAvKioKICAgICAqIHNoYXBlCiAgICAgKi8KCiAgICAvKioKICAgICAqIGJvZHkKICAgICAqLwoKICAgIC8qKgogICAgICogVGhlIGluZGV4IG9mIHRoZSBoaXQgdHJpYW5nbGUsIGlmIHRoZSBoaXQgc2hhcGUgd2FzIGEgdHJpbWVzaAogICAgICovCgogICAgLyoqCiAgICAgKiBEaXN0YW5jZSB0byB0aGUgaGl0LiBXaWxsIGJlIHNldCB0byAtMSBpZiB0aGVyZSB3YXMgbm8gaGl0CiAgICAgKi8KCiAgICAvKioKICAgICAqIElmIHRoZSByYXkgc2hvdWxkIHN0b3AgdHJhdmVyc2luZyB0aGUgYm9kaWVzCiAgICAgKi8KICAgIGNvbnN0cnVjdG9yKCkgewogICAgICB0aGlzLnJheUZyb21Xb3JsZCA9IG5ldyBWZWMzKCk7CiAgICAgIHRoaXMucmF5VG9Xb3JsZCA9IG5ldyBWZWMzKCk7CiAgICAgIHRoaXMuaGl0Tm9ybWFsV29ybGQgPSBuZXcgVmVjMygpOwogICAgICB0aGlzLmhpdFBvaW50V29ybGQgPSBuZXcgVmVjMygpOwogICAgICB0aGlzLmhhc0hpdCA9IGZhbHNlOwogICAgICB0aGlzLnNoYXBlID0gbnVsbDsKICAgICAgdGhpcy5ib2R5ID0gbnVsbDsKICAgICAgdGhpcy5oaXRGYWNlSW5kZXggPSAtMTsKICAgICAgdGhpcy5kaXN0YW5jZSA9IC0xOwogICAgICB0aGlzLnNob3VsZFN0b3AgPSBmYWxzZTsKICAgIH0KICAgIC8qKgogICAgICogUmVzZXQgYWxsIHJlc3VsdCBkYXRhLgogICAgICovCgoKICAgIHJlc2V0KCkgewogICAgICB0aGlzLnJheUZyb21Xb3JsZC5zZXRaZXJvKCk7CiAgICAgIHRoaXMucmF5VG9Xb3JsZC5zZXRaZXJvKCk7CiAgICAgIHRoaXMuaGl0Tm9ybWFsV29ybGQuc2V0WmVybygpOwogICAgICB0aGlzLmhpdFBvaW50V29ybGQuc2V0WmVybygpOwogICAgICB0aGlzLmhhc0hpdCA9IGZhbHNlOwogICAgICB0aGlzLnNoYXBlID0gbnVsbDsKICAgICAgdGhpcy5ib2R5ID0gbnVsbDsKICAgICAgdGhpcy5oaXRGYWNlSW5kZXggPSAtMTsKICAgICAgdGhpcy5kaXN0YW5jZSA9IC0xOwogICAgICB0aGlzLnNob3VsZFN0b3AgPSBmYWxzZTsKICAgIH0KICAgIC8qKgogICAgICogYWJvcnQKICAgICAqLwoKCiAgICBhYm9ydCgpIHsKICAgICAgdGhpcy5zaG91bGRTdG9wID0gdHJ1ZTsKICAgIH0KICAgIC8qKgogICAgICogU2V0IHJlc3VsdCBkYXRhLgogICAgICovCgoKICAgIHNldChyYXlGcm9tV29ybGQsIHJheVRvV29ybGQsIGhpdE5vcm1hbFdvcmxkLCBoaXRQb2ludFdvcmxkLCBzaGFwZSwgYm9keSwgZGlzdGFuY2UpIHsKICAgICAgdGhpcy5yYXlGcm9tV29ybGQuY29weShyYXlGcm9tV29ybGQpOwogICAgICB0aGlzLnJheVRvV29ybGQuY29weShyYXlUb1dvcmxkKTsKICAgICAgdGhpcy5oaXROb3JtYWxXb3JsZC5jb3B5KGhpdE5vcm1hbFdvcmxkKTsKICAgICAgdGhpcy5oaXRQb2ludFdvcmxkLmNvcHkoaGl0UG9pbnRXb3JsZCk7CiAgICAgIHRoaXMuc2hhcGUgPSBzaGFwZTsKICAgICAgdGhpcy5ib2R5ID0gYm9keTsKICAgICAgdGhpcy5kaXN0YW5jZSA9IGRpc3RhbmNlOwogICAgfQoKICB9CgogIGxldCBfU2hhcGUkdHlwZXMkU1BIRVJFLCBfU2hhcGUkdHlwZXMkUExBTkUsIF9TaGFwZSR0eXBlcyRCT1gsIF9TaGFwZSR0eXBlcyRDWUxJTkRFUiwgX1NoYXBlJHR5cGVzJENPTlZFWFBPLCBfU2hhcGUkdHlwZXMkSEVJR0hURkksIF9TaGFwZSR0eXBlcyRUUklNRVNIOwoKICAvKioKICAgKiBSQVlfTU9ERVMKICAgKi8KICBjb25zdCBSQVlfTU9ERVMgPSB7CiAgICAvKiogQ0xPU0VTVCAqLwogICAgQ0xPU0VTVDogMSwKCiAgICAvKiogQU5ZICovCiAgICBBTlk6IDIsCgogICAgLyoqIEFMTCAqLwogICAgQUxMOiA0CiAgfTsKICAvKioKICAgKiBSYXlNb2RlCiAgICovCgogIF9TaGFwZSR0eXBlcyRTUEhFUkUgPSBTaGFwZS50eXBlcy5TUEhFUkU7CiAgX1NoYXBlJHR5cGVzJFBMQU5FID0gU2hhcGUudHlwZXMuUExBTkU7CiAgX1NoYXBlJHR5cGVzJEJPWCA9IFNoYXBlLnR5cGVzLkJPWDsKICBfU2hhcGUkdHlwZXMkQ1lMSU5ERVIgPSBTaGFwZS50eXBlcy5DWUxJTkRFUjsKICBfU2hhcGUkdHlwZXMkQ09OVkVYUE8gPSBTaGFwZS50eXBlcy5DT05WRVhQT0xZSEVEUk9OOwogIF9TaGFwZSR0eXBlcyRIRUlHSFRGSSA9IFNoYXBlLnR5cGVzLkhFSUdIVEZJRUxEOwogIF9TaGFwZSR0eXBlcyRUUklNRVNIID0gU2hhcGUudHlwZXMuVFJJTUVTSDsKCiAgLyoqCiAgICogQSBsaW5lIGluIDNEIHNwYWNlIHRoYXQgaW50ZXJzZWN0cyBib2RpZXMgYW5kIHJldHVybiBwb2ludHMuCiAgICovCiAgY2xhc3MgUmF5IHsKICAgIC8qKgogICAgICogZnJvbQogICAgICovCgogICAgLyoqCiAgICAgKiB0bwogICAgICovCgogICAgLyoqCiAgICAgKiBkaXJlY3Rpb24KICAgICAqLwoKICAgIC8qKgogICAgICogVGhlIHByZWNpc2lvbiBvZiB0aGUgcmF5LiBVc2VkIHdoZW4gY2hlY2tpbmcgcGFyYWxsZWxpdHkgZXRjLgogICAgICogQGRlZmF1bHQgMC4wMDAxCiAgICAgKi8KCiAgICAvKioKICAgICAqIFNldCB0byBgZmFsc2VgIGlmIHlvdSBkb24ndCB3YW50IHRoZSBSYXkgdG8gdGFrZSBgY29sbGlzaW9uUmVzcG9uc2VgIGZsYWdzIGludG8gYWNjb3VudCBvbiBib2RpZXMgYW5kIHNoYXBlcy4KICAgICAqIEBkZWZhdWx0IHRydWUKICAgICAqLwoKICAgIC8qKgogICAgICogSWYgc2V0IHRvIGB0cnVlYCwgdGhlIHJheSBza2lwcyBhbnkgaGl0cyB3aXRoIG5vcm1hbC5kb3QocmF5RGlyZWN0aW9uKSA8IDAuCiAgICAgKiBAZGVmYXVsdCBmYWxzZQogICAgICovCgogICAgLyoqCiAgICAgKiBjb2xsaXNpb25GaWx0ZXJNYXNrCiAgICAgKiBAZGVmYXVsdCAtMQogICAgICovCgogICAgLyoqCiAgICAgKiBjb2xsaXNpb25GaWx0ZXJHcm91cAogICAgICogQGRlZmF1bHQgLTEKICAgICAqLwoKICAgIC8qKgogICAgICogVGhlIGludGVyc2VjdGlvbiBtb2RlLiBTaG91bGQgYmUgUmF5LkFOWSwgUmF5LkFMTCBvciBSYXkuQ0xPU0VTVC4KICAgICAqIEBkZWZhdWx0IFJBWS5BTlkKICAgICAqLwoKICAgIC8qKgogICAgICogQ3VycmVudCByZXN1bHQgb2JqZWN0LgogICAgICovCgogICAgLyoqCiAgICAgKiBXaWxsIGJlIHNldCB0byBgdHJ1ZWAgZHVyaW5nIGludGVyc2VjdFdvcmxkKCkgaWYgdGhlIHJheSBoaXQgYW55dGhpbmcuCiAgICAgKi8KCiAgICAvKioKICAgICAqIFVzZXItcHJvdmlkZWQgcmVzdWx0IGNhbGxiYWNrLiBXaWxsIGJlIHVzZWQgaWYgbW9kZSBpcyBSYXkuQUxMLgogICAgICovCgogICAgLyoqCiAgICAgKiBDTE9TRVNUCiAgICAgKi8KCiAgICAvKioKICAgICAqIEFOWQogICAgICovCgogICAgLyoqCiAgICAgKiBBTEwKICAgICAqLwogICAgZ2V0IFtfU2hhcGUkdHlwZXMkU1BIRVJFXSgpIHsKICAgICAgcmV0dXJuIHRoaXMuX2ludGVyc2VjdFNwaGVyZTsKICAgIH0KCiAgICBnZXQgW19TaGFwZSR0eXBlcyRQTEFORV0oKSB7CiAgICAgIHJldHVybiB0aGlzLl9pbnRlcnNlY3RQbGFuZTsKICAgIH0KCiAgICBnZXQgW19TaGFwZSR0eXBlcyRCT1hdKCkgewogICAgICByZXR1cm4gdGhpcy5faW50ZXJzZWN0Qm94OwogICAgfQoKICAgIGdldCBbX1NoYXBlJHR5cGVzJENZTElOREVSXSgpIHsKICAgICAgcmV0dXJuIHRoaXMuX2ludGVyc2VjdENvbnZleDsKICAgIH0KCiAgICBnZXQgW19TaGFwZSR0eXBlcyRDT05WRVhQT10oKSB7CiAgICAgIHJldHVybiB0aGlzLl9pbnRlcnNlY3RDb252ZXg7CiAgICB9CgogICAgZ2V0IFtfU2hhcGUkdHlwZXMkSEVJR0hURkldKCkgewogICAgICByZXR1cm4gdGhpcy5faW50ZXJzZWN0SGVpZ2h0ZmllbGQ7CiAgICB9CgogICAgZ2V0IFtfU2hhcGUkdHlwZXMkVFJJTUVTSF0oKSB7CiAgICAgIHJldHVybiB0aGlzLl9pbnRlcnNlY3RUcmltZXNoOwogICAgfQoKICAgIGNvbnN0cnVjdG9yKGZyb20sIHRvKSB7CiAgICAgIGlmIChmcm9tID09PSB2b2lkIDApIHsKICAgICAgICBmcm9tID0gbmV3IFZlYzMoKTsKICAgICAgfQoKICAgICAgaWYgKHRvID09PSB2b2lkIDApIHsKICAgICAgICB0byA9IG5ldyBWZWMzKCk7CiAgICAgIH0KCiAgICAgIHRoaXMuZnJvbSA9IGZyb20uY2xvbmUoKTsKICAgICAgdGhpcy50byA9IHRvLmNsb25lKCk7CiAgICAgIHRoaXMuZGlyZWN0aW9uID0gbmV3IFZlYzMoKTsKICAgICAgdGhpcy5wcmVjaXNpb24gPSAwLjAwMDE7CiAgICAgIHRoaXMuY2hlY2tDb2xsaXNpb25SZXNwb25zZSA9IHRydWU7CiAgICAgIHRoaXMuc2tpcEJhY2tmYWNlcyA9IGZhbHNlOwogICAgICB0aGlzLmNvbGxpc2lvbkZpbHRlck1hc2sgPSAtMTsKICAgICAgdGhpcy5jb2xsaXNpb25GaWx0ZXJHcm91cCA9IC0xOwogICAgICB0aGlzLm1vZGUgPSBSYXkuQU5ZOwogICAgICB0aGlzLnJlc3VsdCA9IG5ldyBSYXljYXN0UmVzdWx0KCk7CiAgICAgIHRoaXMuaGFzSGl0ID0gZmFsc2U7CgogICAgICB0aGlzLmNhbGxiYWNrID0gcmVzdWx0ID0+IHt9OwogICAgfQogICAgLyoqCiAgICAgKiBEbyBpdGVyc2VjdGlvbiBhZ2FpbnN0IGFsbCBib2RpZXMgaW4gdGhlIGdpdmVuIFdvcmxkLgogICAgICogQHJldHVybiBUcnVlIGlmIHRoZSByYXkgaGl0IGFueXRoaW5nLCBvdGhlcndpc2UgZmFsc2UuCiAgICAgKi8KCgogICAgaW50ZXJzZWN0V29ybGQod29ybGQsIG9wdGlvbnMpIHsKICAgICAgdGhpcy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8IFJheS5BTlk7CiAgICAgIHRoaXMucmVzdWx0ID0gb3B0aW9ucy5yZXN1bHQgfHwgbmV3IFJheWNhc3RSZXN1bHQoKTsKICAgICAgdGhpcy5za2lwQmFja2ZhY2VzID0gISFvcHRpb25zLnNraXBCYWNrZmFjZXM7CiAgICAgIHRoaXMuY29sbGlzaW9uRmlsdGVyTWFzayA9IHR5cGVvZiBvcHRpb25zLmNvbGxpc2lvbkZpbHRlck1hc2sgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5jb2xsaXNpb25GaWx0ZXJNYXNrIDogLTE7CiAgICAgIHRoaXMuY29sbGlzaW9uRmlsdGVyR3JvdXAgPSB0eXBlb2Ygb3B0aW9ucy5jb2xsaXNpb25GaWx0ZXJHcm91cCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmNvbGxpc2lvbkZpbHRlckdyb3VwIDogLTE7CiAgICAgIHRoaXMuY2hlY2tDb2xsaXNpb25SZXNwb25zZSA9IHR5cGVvZiBvcHRpb25zLmNoZWNrQ29sbGlzaW9uUmVzcG9uc2UgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5jaGVja0NvbGxpc2lvblJlc3BvbnNlIDogdHJ1ZTsKCiAgICAgIGlmIChvcHRpb25zLmZyb20pIHsKICAgICAgICB0aGlzLmZyb20uY29weShvcHRpb25zLmZyb20pOwogICAgICB9CgogICAgICBpZiAob3B0aW9ucy50bykgewogICAgICAgIHRoaXMudG8uY29weShvcHRpb25zLnRvKTsKICAgICAgfQoKICAgICAgdGhpcy5jYWxsYmFjayA9IG9wdGlvbnMuY2FsbGJhY2sgfHwgKCgpID0+IHt9KTsKCiAgICAgIHRoaXMuaGFzSGl0ID0gZmFsc2U7CiAgICAgIHRoaXMucmVzdWx0LnJlc2V0KCk7CiAgICAgIHRoaXMudXBkYXRlRGlyZWN0aW9uKCk7CiAgICAgIHRoaXMuZ2V0QUFCQih0bXBBQUJCJDEpOwogICAgICB0bXBBcnJheS5sZW5ndGggPSAwOwogICAgICB3b3JsZC5icm9hZHBoYXNlLmFhYmJRdWVyeSh3b3JsZCwgdG1wQUFCQiQxLCB0bXBBcnJheSk7CiAgICAgIHRoaXMuaW50ZXJzZWN0Qm9kaWVzKHRtcEFycmF5KTsKICAgICAgcmV0dXJuIHRoaXMuaGFzSGl0OwogICAgfQogICAgLyoqCiAgICAgKiBTaG9vdCBhIHJheSBhdCBhIGJvZHksIGdldCBiYWNrIGluZm9ybWF0aW9uIGFib3V0IHRoZSBoaXQuCiAgICAgKiBAZGVwcmVjYXRlZCBAcGFyYW0gcmVzdWx0IHNldCB0aGUgcmVzdWx0IHByb3BlcnR5IG9mIHRoZSBSYXkgaW5zdGVhZC4KICAgICAqLwoKCiAgICBpbnRlcnNlY3RCb2R5KGJvZHksIHJlc3VsdCkgewogICAgICBpZiAocmVzdWx0KSB7CiAgICAgICAgdGhpcy5yZXN1bHQgPSByZXN1bHQ7CiAgICAgICAgdGhpcy51cGRhdGVEaXJlY3Rpb24oKTsKICAgICAgfQoKICAgICAgY29uc3QgY2hlY2tDb2xsaXNpb25SZXNwb25zZSA9IHRoaXMuY2hlY2tDb2xsaXNpb25SZXNwb25zZTsKCiAgICAgIGlmIChjaGVja0NvbGxpc2lvblJlc3BvbnNlICYmICFib2R5LmNvbGxpc2lvblJlc3BvbnNlKSB7CiAgICAgICAgcmV0dXJuOwogICAgICB9CgogICAgICBpZiAoKHRoaXMuY29sbGlzaW9uRmlsdGVyR3JvdXAgJiBib2R5LmNvbGxpc2lvbkZpbHRlck1hc2spID09PSAwIHx8IChib2R5LmNvbGxpc2lvbkZpbHRlckdyb3VwICYgdGhpcy5jb2xsaXNpb25GaWx0ZXJNYXNrKSA9PT0gMCkgewogICAgICAgIHJldHVybjsKICAgICAgfQoKICAgICAgY29uc3QgeGkgPSBpbnRlcnNlY3RCb2R5X3hpOwogICAgICBjb25zdCBxaSA9IGludGVyc2VjdEJvZHlfcWk7CgogICAgICBmb3IgKGxldCBpID0gMCwgTiA9IGJvZHkuc2hhcGVzLmxlbmd0aDsgaSA8IE47IGkrKykgewogICAgICAgIGNvbnN0IHNoYXBlID0gYm9keS5zaGFwZXNbaV07CgogICAgICAgIGlmIChjaGVja0NvbGxpc2lvblJlc3BvbnNlICYmICFzaGFwZS5jb2xsaXNpb25SZXNwb25zZSkgewogICAgICAgICAgY29udGludWU7IC8vIFNraXAKICAgICAgICB9CgogICAgICAgIGJvZHkucXVhdGVybmlvbi5tdWx0KGJvZHkuc2hhcGVPcmllbnRhdGlvbnNbaV0sIHFpKTsKICAgICAgICBib2R5LnF1YXRlcm5pb24udm11bHQoYm9keS5zaGFwZU9mZnNldHNbaV0sIHhpKTsKICAgICAgICB4aS52YWRkKGJvZHkucG9zaXRpb24sIHhpKTsKICAgICAgICB0aGlzLmludGVyc2VjdFNoYXBlKHNoYXBlLCBxaSwgeGksIGJvZHkpOwoKICAgICAgICBpZiAodGhpcy5yZXN1bHQuc2hvdWxkU3RvcCkgewogICAgICAgICAgYnJlYWs7CiAgICAgICAgfQogICAgICB9CiAgICB9CiAgICAvKioKICAgICAqIFNob290IGEgcmF5IGF0IGFuIGFycmF5IGJvZGllcywgZ2V0IGJhY2sgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGhpdC4KICAgICAqIEBwYXJhbSBib2RpZXMgQW4gYXJyYXkgb2YgQm9keSBvYmplY3RzLgogICAgICogQGRlcHJlY2F0ZWQgQHBhcmFtIHJlc3VsdCBzZXQgdGhlIHJlc3VsdCBwcm9wZXJ0eSBvZiB0aGUgUmF5IGluc3RlYWQuCiAgICAgKgogICAgICovCgoKICAgIGludGVyc2VjdEJvZGllcyhib2RpZXMsIHJlc3VsdCkgewogICAgICBpZiAocmVzdWx0KSB7CiAgICAgICAgdGhpcy5yZXN1bHQgPSByZXN1bHQ7CiAgICAgICAgdGhpcy51cGRhdGVEaXJlY3Rpb24oKTsKICAgICAgfQoKICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBib2RpZXMubGVuZ3RoOyAhdGhpcy5yZXN1bHQuc2hvdWxkU3RvcCAmJiBpIDwgbDsgaSsrKSB7CiAgICAgICAgdGhpcy5pbnRlcnNlY3RCb2R5KGJvZGllc1tpXSk7CiAgICAgIH0KICAgIH0KICAgIC8qKgogICAgICogVXBkYXRlcyB0aGUgZGlyZWN0aW9uIHZlY3Rvci4KICAgICAqLwoKCiAgICB1cGRhdGVEaXJlY3Rpb24oKSB7CiAgICAgIHRoaXMudG8udnN1Yih0aGlzLmZyb20sIHRoaXMuZGlyZWN0aW9uKTsKICAgICAgdGhpcy5kaXJlY3Rpb24ubm9ybWFsaXplKCk7CiAgICB9CgogICAgaW50ZXJzZWN0U2hhcGUoc2hhcGUsIHF1YXQsIHBvc2l0aW9uLCBib2R5KSB7CiAgICAgIGNvbnN0IGZyb20gPSB0aGlzLmZyb207IC8vIENoZWNraW5nIGJvdW5kaW5nU3BoZXJlCgogICAgICBjb25zdCBkaXN0YW5jZSA9IGRpc3RhbmNlRnJvbUludGVyc2VjdGlvbihmcm9tLCB0aGlzLmRpcmVjdGlvbiwgcG9zaXRpb24pOwoKICAgICAgaWYgKGRpc3RhbmNlID4gc2hhcGUuYm91bmRpbmdTcGhlcmVSYWRpdXMpIHsKICAgICAgICByZXR1cm47CiAgICAgIH0KCiAgICAgIGNvbnN0IGludGVyc2VjdE1ldGhvZCA9IHRoaXNbc2hhcGUudHlwZV07CgogICAgICBpZiAoaW50ZXJzZWN0TWV0aG9kKSB7CiAgICAgICAgaW50ZXJzZWN0TWV0aG9kLmNhbGwodGhpcywgc2hhcGUsIHF1YXQsIHBvc2l0aW9uLCBib2R5LCBzaGFwZSk7CiAgICAgIH0KICAgIH0KCiAgICBfaW50ZXJzZWN0Qm94KGJveCwgcXVhdCwgcG9zaXRpb24sIGJvZHksIHJlcG9ydGVkU2hhcGUpIHsKICAgICAgcmV0dXJuIHRoaXMuX2ludGVyc2VjdENvbnZleChib3guY29udmV4UG9seWhlZHJvblJlcHJlc2VudGF0aW9uLCBxdWF0LCBwb3NpdGlvbiwgYm9keSwgcmVwb3J0ZWRTaGFwZSk7CiAgICB9CgogICAgX2ludGVyc2VjdFBsYW5lKHNoYXBlLCBxdWF0LCBwb3NpdGlvbiwgYm9keSwgcmVwb3J0ZWRTaGFwZSkgewogICAgICBjb25zdCBmcm9tID0gdGhpcy5mcm9tOwogICAgICBjb25zdCB0byA9IHRoaXMudG87CiAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHRoaXMuZGlyZWN0aW9uOyAvLyBHZXQgcGxhbmUgbm9ybWFsCgogICAgICBjb25zdCB3b3JsZE5vcm1hbCA9IG5ldyBWZWMzKDAsIDAsIDEpOwogICAgICBxdWF0LnZtdWx0KHdvcmxkTm9ybWFsLCB3b3JsZE5vcm1hbCk7CiAgICAgIGNvbnN0IGxlbiA9IG5ldyBWZWMzKCk7CiAgICAgIGZyb20udnN1Yihwb3NpdGlvbiwgbGVuKTsKICAgICAgY29uc3QgcGxhbmVUb0Zyb20gPSBsZW4uZG90KHdvcmxkTm9ybWFsKTsKICAgICAgdG8udnN1Yihwb3NpdGlvbiwgbGVuKTsKICAgICAgY29uc3QgcGxhbmVUb1RvID0gbGVuLmRvdCh3b3JsZE5vcm1hbCk7CgogICAgICBpZiAocGxhbmVUb0Zyb20gKiBwbGFuZVRvVG8gPiAwKSB7CiAgICAgICAgLy8gImZyb20iIGFuZCAidG8iIGFyZSBvbiB0aGUgc2FtZSBzaWRlIG9mIHRoZSBwbGFuZS4uLiBiYWlsIG91dAogICAgICAgIHJldHVybjsKICAgICAgfQoKICAgICAgaWYgKGZyb20uZGlzdGFuY2VUbyh0bykgPCBwbGFuZVRvRnJvbSkgewogICAgICAgIHJldHVybjsKICAgICAgfQoKICAgICAgY29uc3Qgbl9kb3RfZGlyID0gd29ybGROb3JtYWwuZG90KGRpcmVjdGlvbik7CgogICAgICBpZiAoTWF0aC5hYnMobl9kb3RfZGlyKSA8IHRoaXMucHJlY2lzaW9uKSB7CiAgICAgICAgLy8gTm8gaW50ZXJzZWN0aW9uCiAgICAgICAgcmV0dXJuOwogICAgICB9CgogICAgICBjb25zdCBwbGFuZVBvaW50VG9Gcm9tID0gbmV3IFZlYzMoKTsKICAgICAgY29uc3QgZGlyX3NjYWxlZF93aXRoX3QgPSBuZXcgVmVjMygpOwogICAgICBjb25zdCBoaXRQb2ludFdvcmxkID0gbmV3IFZlYzMoKTsKICAgICAgZnJvbS52c3ViKHBvc2l0aW9uLCBwbGFuZVBvaW50VG9Gcm9tKTsKICAgICAgY29uc3QgdCA9IC13b3JsZE5vcm1hbC5kb3QocGxhbmVQb2ludFRvRnJvbSkgLyBuX2RvdF9kaXI7CiAgICAgIGRpcmVjdGlvbi5zY2FsZSh0LCBkaXJfc2NhbGVkX3dpdGhfdCk7CiAgICAgIGZyb20udmFkZChkaXJfc2NhbGVkX3dpdGhfdCwgaGl0UG9pbnRXb3JsZCk7CiAgICAgIHRoaXMucmVwb3J0SW50ZXJzZWN0aW9uKHdvcmxkTm9ybWFsLCBoaXRQb2ludFdvcmxkLCByZXBvcnRlZFNoYXBlLCBib2R5LCAtMSk7CiAgICB9CiAgICAvKioKICAgICAqIEdldCB0aGUgd29ybGQgQUFCQiBvZiB0aGUgcmF5LgogICAgICovCgoKICAgIGdldEFBQkIoYWFiYikgewogICAgICBjb25zdCB7CiAgICAgICAgbG93ZXJCb3VuZCwKICAgICAgICB1cHBlckJvdW5kCiAgICAgIH0gPSBhYWJiOwogICAgICBjb25zdCB0byA9IHRoaXMudG87CiAgICAgIGNvbnN0IGZyb20gPSB0aGlzLmZyb207CiAgICAgIGxvd2VyQm91bmQueCA9IE1hdGgubWluKHRvLngsIGZyb20ueCk7CiAgICAgIGxvd2VyQm91bmQueSA9IE1hdGgubWluKHRvLnksIGZyb20ueSk7CiAgICAgIGxvd2VyQm91bmQueiA9IE1hdGgubWluKHRvLnosIGZyb20ueik7CiAgICAgIHVwcGVyQm91bmQueCA9IE1hdGgubWF4KHRvLngsIGZyb20ueCk7CiAgICAgIHVwcGVyQm91bmQueSA9IE1hdGgubWF4KHRvLnksIGZyb20ueSk7CiAgICAgIHVwcGVyQm91bmQueiA9IE1hdGgubWF4KHRvLnosIGZyb20ueik7CiAgICB9CgogICAgX2ludGVyc2VjdEhlaWdodGZpZWxkKHNoYXBlLCBxdWF0LCBwb3NpdGlvbiwgYm9keSwgcmVwb3J0ZWRTaGFwZSkgewogICAgICBzaGFwZS5kYXRhOwogICAgICBzaGFwZS5lbGVtZW50U2l6ZTsgLy8gQ29udmVydCB0aGUgcmF5IHRvIGxvY2FsIGhlaWdodGZpZWxkIGNvb3JkaW5hdGVzCgogICAgICBjb25zdCBsb2NhbFJheSA9IGludGVyc2VjdEhlaWdodGZpZWxkX2xvY2FsUmF5OyAvL25ldyBSYXkodGhpcy5mcm9tLCB0aGlzLnRvKTsKCiAgICAgIGxvY2FsUmF5LmZyb20uY29weSh0aGlzLmZyb20pOwogICAgICBsb2NhbFJheS50by5jb3B5KHRoaXMudG8pOwogICAgICBUcmFuc2Zvcm0ucG9pbnRUb0xvY2FsRnJhbWUocG9zaXRpb24sIHF1YXQsIGxvY2FsUmF5LmZyb20sIGxvY2FsUmF5LmZyb20pOwogICAgICBUcmFuc2Zvcm0ucG9pbnRUb0xvY2FsRnJhbWUocG9zaXRpb24sIHF1YXQsIGxvY2FsUmF5LnRvLCBsb2NhbFJheS50byk7CiAgICAgIGxvY2FsUmF5LnVwZGF0ZURpcmVjdGlvbigpOyAvLyBHZXQgdGhlIGluZGV4IG9mIHRoZSBkYXRhIHBvaW50cyB0byB0ZXN0IGFnYWluc3QKCiAgICAgIGNvbnN0IGluZGV4ID0gaW50ZXJzZWN0SGVpZ2h0ZmllbGRfaW5kZXg7CiAgICAgIGxldCBpTWluWDsKICAgICAgbGV0IGlNaW5ZOwogICAgICBsZXQgaU1heFg7CiAgICAgIGxldCBpTWF4WTsgLy8gU2V0IHRvIG1heAoKICAgICAgaU1pblggPSBpTWluWSA9IDA7CiAgICAgIGlNYXhYID0gaU1heFkgPSBzaGFwZS5kYXRhLmxlbmd0aCAtIDE7CiAgICAgIGNvbnN0IGFhYmIgPSBuZXcgQUFCQigpOwogICAgICBsb2NhbFJheS5nZXRBQUJCKGFhYmIpOwogICAgICBzaGFwZS5nZXRJbmRleE9mUG9zaXRpb24oYWFiYi5sb3dlckJvdW5kLngsIGFhYmIubG93ZXJCb3VuZC55LCBpbmRleCwgdHJ1ZSk7CiAgICAgIGlNaW5YID0gTWF0aC5tYXgoaU1pblgsIGluZGV4WzBdKTsKICAgICAgaU1pblkgPSBNYXRoLm1heChpTWluWSwgaW5kZXhbMV0pOwogICAgICBzaGFwZS5nZXRJbmRleE9mUG9zaXRpb24oYWFiYi51cHBlckJvdW5kLngsIGFhYmIudXBwZXJCb3VuZC55LCBpbmRleCwgdHJ1ZSk7CiAgICAgIGlNYXhYID0gTWF0aC5taW4oaU1heFgsIGluZGV4WzBdICsgMSk7CiAgICAgIGlNYXhZID0gTWF0aC5taW4oaU1heFksIGluZGV4WzFdICsgMSk7CgogICAgICBmb3IgKGxldCBpID0gaU1pblg7IGkgPCBpTWF4WDsgaSsrKSB7CiAgICAgICAgZm9yIChsZXQgaiA9IGlNaW5ZOyBqIDwgaU1heFk7IGorKykgewogICAgICAgICAgaWYgKHRoaXMucmVzdWx0LnNob3VsZFN0b3ApIHsKICAgICAgICAgICAgcmV0dXJuOwogICAgICAgICAgfQoKICAgICAgICAgIHNoYXBlLmdldEFhYmJBdEluZGV4KGksIGosIGFhYmIpOwoKICAgICAgICAgIGlmICghYWFiYi5vdmVybGFwc1JheShsb2NhbFJheSkpIHsKICAgICAgICAgICAgY29udGludWU7CiAgICAgICAgICB9IC8vIExvd2VyIHRyaWFuZ2xlCgoKICAgICAgICAgIHNoYXBlLmdldENvbnZleFRyaWFuZ2xlUGlsbGFyKGksIGosIGZhbHNlKTsKICAgICAgICAgIFRyYW5zZm9ybS5wb2ludFRvV29ybGRGcmFtZShwb3NpdGlvbiwgcXVhdCwgc2hhcGUucGlsbGFyT2Zmc2V0LCB3b3JsZFBpbGxhck9mZnNldCk7CgogICAgICAgICAgdGhpcy5faW50ZXJzZWN0Q29udmV4KHNoYXBlLnBpbGxhckNvbnZleCwgcXVhdCwgd29ybGRQaWxsYXJPZmZzZXQsIGJvZHksIHJlcG9ydGVkU2hhcGUsIGludGVyc2VjdENvbnZleE9wdGlvbnMpOwoKICAgICAgICAgIGlmICh0aGlzLnJlc3VsdC5zaG91bGRTdG9wKSB7CiAgICAgICAgICAgIHJldHVybjsKICAgICAgICAgIH0gLy8gVXBwZXIgdHJpYW5nbGUKCgogICAgICAgICAgc2hhcGUuZ2V0Q29udmV4VHJpYW5nbGVQaWxsYXIoaSwgaiwgdHJ1ZSk7CiAgICAgICAgICBUcmFuc2Zvcm0ucG9pbnRUb1dvcmxkRnJhbWUocG9zaXRpb24sIHF1YXQsIHNoYXBlLnBpbGxhck9mZnNldCwgd29ybGRQaWxsYXJPZmZzZXQpOwoKICAgICAgICAgIHRoaXMuX2ludGVyc2VjdENvbnZleChzaGFwZS5waWxsYXJDb252ZXgsIHF1YXQsIHdvcmxkUGlsbGFyT2Zmc2V0LCBib2R5LCByZXBvcnRlZFNoYXBlLCBpbnRlcnNlY3RDb252ZXhPcHRpb25zKTsKICAgICAgICB9CiAgICAgIH0KICAgIH0KCiAgICBfaW50ZXJzZWN0U3BoZXJlKHNwaGVyZSwgcXVhdCwgcG9zaXRpb24sIGJvZHksIHJlcG9ydGVkU2hhcGUpIHsKICAgICAgY29uc3QgZnJvbSA9IHRoaXMuZnJvbTsKICAgICAgY29uc3QgdG8gPSB0aGlzLnRvOwogICAgICBjb25zdCByID0gc3BoZXJlLnJhZGl1czsKICAgICAgY29uc3QgYSA9ICh0by54IC0gZnJvbS54KSAqKiAyICsgKHRvLnkgLSBmcm9tLnkpICoqIDIgKyAodG8ueiAtIGZyb20ueikgKiogMjsKICAgICAgY29uc3QgYiA9IDIgKiAoKHRvLnggLSBmcm9tLngpICogKGZyb20ueCAtIHBvc2l0aW9uLngpICsgKHRvLnkgLSBmcm9tLnkpICogKGZyb20ueSAtIHBvc2l0aW9uLnkpICsgKHRvLnogLSBmcm9tLnopICogKGZyb20ueiAtIHBvc2l0aW9uLnopKTsKICAgICAgY29uc3QgYyA9IChmcm9tLnggLSBwb3NpdGlvbi54KSAqKiAyICsgKGZyb20ueSAtIHBvc2l0aW9uLnkpICoqIDIgKyAoZnJvbS56IC0gcG9zaXRpb24ueikgKiogMiAtIHIgKiogMjsKICAgICAgY29uc3QgZGVsdGEgPSBiICoqIDIgLSA0ICogYSAqIGM7CiAgICAgIGNvbnN0IGludGVyc2VjdGlvblBvaW50ID0gUmF5X2ludGVyc2VjdFNwaGVyZV9pbnRlcnNlY3Rpb25Qb2ludDsKICAgICAgY29uc3Qgbm9ybWFsID0gUmF5X2ludGVyc2VjdFNwaGVyZV9ub3JtYWw7CgogICAgICBpZiAoZGVsdGEgPCAwKSB7CiAgICAgICAgLy8gTm8gaW50ZXJzZWN0aW9uCiAgICAgICAgcmV0dXJuOwogICAgICB9IGVsc2UgaWYgKGRlbHRhID09PSAwKSB7CiAgICAgICAgLy8gc2luZ2xlIGludGVyc2VjdGlvbiBwb2ludAogICAgICAgIGZyb20ubGVycCh0bywgZGVsdGEsIGludGVyc2VjdGlvblBvaW50KTsKICAgICAgICBpbnRlcnNlY3Rpb25Qb2ludC52c3ViKHBvc2l0aW9uLCBub3JtYWwpOwogICAgICAgIG5vcm1hbC5ub3JtYWxpemUoKTsKICAgICAgICB0aGlzLnJlcG9ydEludGVyc2VjdGlvbihub3JtYWwsIGludGVyc2VjdGlvblBvaW50LCByZXBvcnRlZFNoYXBlLCBib2R5LCAtMSk7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgY29uc3QgZDEgPSAoLWIgLSBNYXRoLnNxcnQoZGVsdGEpKSAvICgyICogYSk7CiAgICAgICAgY29uc3QgZDIgPSAoLWIgKyBNYXRoLnNxcnQoZGVsdGEpKSAvICgyICogYSk7CgogICAgICAgIGlmIChkMSA+PSAwICYmIGQxIDw9IDEpIHsKICAgICAgICAgIGZyb20ubGVycCh0bywgZDEsIGludGVyc2VjdGlvblBvaW50KTsKICAgICAgICAgIGludGVyc2VjdGlvblBvaW50LnZzdWIocG9zaXRpb24sIG5vcm1hbCk7CiAgICAgICAgICBub3JtYWwubm9ybWFsaXplKCk7CiAgICAgICAgICB0aGlzLnJlcG9ydEludGVyc2VjdGlvbihub3JtYWwsIGludGVyc2VjdGlvblBvaW50LCByZXBvcnRlZFNoYXBlLCBib2R5LCAtMSk7CiAgICAgICAgfQoKICAgICAgICBpZiAodGhpcy5yZXN1bHQuc2hvdWxkU3RvcCkgewogICAgICAgICAgcmV0dXJuOwogICAgICAgIH0KCiAgICAgICAgaWYgKGQyID49IDAgJiYgZDIgPD0gMSkgewogICAgICAgICAgZnJvbS5sZXJwKHRvLCBkMiwgaW50ZXJzZWN0aW9uUG9pbnQpOwogICAgICAgICAgaW50ZXJzZWN0aW9uUG9pbnQudnN1Yihwb3NpdGlvbiwgbm9ybWFsKTsKICAgICAgICAgIG5vcm1hbC5ub3JtYWxpemUoKTsKICAgICAgICAgIHRoaXMucmVwb3J0SW50ZXJzZWN0aW9uKG5vcm1hbCwgaW50ZXJzZWN0aW9uUG9pbnQsIHJlcG9ydGVkU2hhcGUsIGJvZHksIC0xKTsKICAgICAgICB9CiAgICAgIH0KICAgIH0KCiAgICBfaW50ZXJzZWN0Q29udmV4KHNoYXBlLCBxdWF0LCBwb3NpdGlvbiwgYm9keSwgcmVwb3J0ZWRTaGFwZSwgb3B0aW9ucykgewogICAgICBjb25zdCBub3JtYWwgPSBpbnRlcnNlY3RDb252ZXhfbm9ybWFsOwogICAgICBjb25zdCB2ZWN0b3IgPSBpbnRlcnNlY3RDb252ZXhfdmVjdG9yOwogICAgICBjb25zdCBmYWNlTGlzdCA9IG9wdGlvbnMgJiYgb3B0aW9ucy5mYWNlTGlzdCB8fCBudWxsOyAvLyBDaGVja2luZyBmYWNlcwoKICAgICAgY29uc3QgZmFjZXMgPSBzaGFwZS5mYWNlczsKICAgICAgY29uc3QgdmVydGljZXMgPSBzaGFwZS52ZXJ0aWNlczsKICAgICAgY29uc3Qgbm9ybWFscyA9IHNoYXBlLmZhY2VOb3JtYWxzOwogICAgICBjb25zdCBkaXJlY3Rpb24gPSB0aGlzLmRpcmVjdGlvbjsKICAgICAgY29uc3QgZnJvbSA9IHRoaXMuZnJvbTsKICAgICAgY29uc3QgdG8gPSB0aGlzLnRvOwogICAgICBjb25zdCBmcm9tVG9EaXN0YW5jZSA9IGZyb20uZGlzdGFuY2VUbyh0byk7CiAgICAgIGNvbnN0IE5mYWNlcyA9IGZhY2VMaXN0ID8gZmFjZUxpc3QubGVuZ3RoIDogZmFjZXMubGVuZ3RoOwogICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnJlc3VsdDsKCiAgICAgIGZvciAobGV0IGogPSAwOyAhcmVzdWx0LnNob3VsZFN0b3AgJiYgaiA8IE5mYWNlczsgaisrKSB7CiAgICAgICAgY29uc3QgZmkgPSBmYWNlTGlzdCA/IGZhY2VMaXN0W2pdIDogajsKICAgICAgICBjb25zdCBmYWNlID0gZmFjZXNbZmldOwogICAgICAgIGNvbnN0IGZhY2VOb3JtYWwgPSBub3JtYWxzW2ZpXTsKICAgICAgICBjb25zdCBxID0gcXVhdDsKICAgICAgICBjb25zdCB4ID0gcG9zaXRpb247IC8vIGRldGVybWluZSBpZiByYXkgaW50ZXJzZWN0cyB0aGUgcGxhbmUgb2YgdGhlIGZhY2UKICAgICAgICAvLyBub3RlOiB0aGlzIHdvcmtzIHJlZ2FyZGxlc3Mgb2YgdGhlIGRpcmVjdGlvbiBvZiB0aGUgZmFjZSBub3JtYWwKICAgICAgICAvLyBHZXQgcGxhbmUgcG9pbnQgaW4gd29ybGQgY29vcmRpbmF0ZXMuLi4KCiAgICAgICAgdmVjdG9yLmNvcHkodmVydGljZXNbZmFjZVswXV0pOwogICAgICAgIHEudm11bHQodmVjdG9yLCB2ZWN0b3IpOwogICAgICAgIHZlY3Rvci52YWRkKHgsIHZlY3Rvcik7IC8vIC4uLmJ1dCBtYWtlIGl0IHJlbGF0aXZlIHRvIHRoZSByYXkgZnJvbS4gV2UnbGwgZml4IHRoaXMgbGF0ZXIuCgogICAgICAgIHZlY3Rvci52c3ViKGZyb20sIHZlY3Rvcik7IC8vIEdldCBwbGFuZSBub3JtYWwKCiAgICAgICAgcS52bXVsdChmYWNlTm9ybWFsLCBub3JtYWwpOyAvLyBJZiB0aGlzIGRvdCBwcm9kdWN0IGlzIG5lZ2F0aXZlLCB3ZSBoYXZlIHNvbWV0aGluZyBpbnRlcmVzdGluZwoKICAgICAgICBjb25zdCBkb3QgPSBkaXJlY3Rpb24uZG90KG5vcm1hbCk7IC8vIEJhaWwgb3V0IGlmIHJheSBhbmQgcGxhbmUgYXJlIHBhcmFsbGVsCgogICAgICAgIGlmIChNYXRoLmFicyhkb3QpIDwgdGhpcy5wcmVjaXNpb24pIHsKICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgIH0gLy8gY2FsYyBkaXN0YW5jZSB0byBwbGFuZQoKCiAgICAgICAgY29uc3Qgc2NhbGFyID0gbm9ybWFsLmRvdCh2ZWN0b3IpIC8gZG90OyAvLyBpZiBuZWdhdGl2ZSBkaXN0YW5jZSwgdGhlbiBwbGFuZSBpcyBiZWhpbmQgcmF5CgogICAgICAgIGlmIChzY2FsYXIgPCAwKSB7CiAgICAgICAgICBjb250aW51ZTsKICAgICAgICB9IC8vIGlmIChkb3QgPCAwKSB7CiAgICAgICAgLy8gSW50ZXJzZWN0aW9uIHBvaW50IGlzIGZyb20gKyBkaXJlY3Rpb24gKiBzY2FsYXIKCgogICAgICAgIGRpcmVjdGlvbi5zY2FsZShzY2FsYXIsIGludGVyc2VjdFBvaW50KTsKICAgICAgICBpbnRlcnNlY3RQb2ludC52YWRkKGZyb20sIGludGVyc2VjdFBvaW50KTsgLy8gYSBpcyB0aGUgcG9pbnQgd2UgY29tcGFyZSBwb2ludHMgYiBhbmQgYyB3aXRoLgoKICAgICAgICBhLmNvcHkodmVydGljZXNbZmFjZVswXV0pOwogICAgICAgIHEudm11bHQoYSwgYSk7CiAgICAgICAgeC52YWRkKGEsIGEpOwoKICAgICAgICBmb3IgKGxldCBpID0gMTsgIXJlc3VsdC5zaG91bGRTdG9wICYmIGkgPCBmYWNlLmxlbmd0aCAtIDE7IGkrKykgewogICAgICAgICAgLy8gVHJhbnNmb3JtIDMgdmVydGljZXMgdG8gd29ybGQgY29vcmRzCiAgICAgICAgICBiLmNvcHkodmVydGljZXNbZmFjZVtpXV0pOwogICAgICAgICAgYy5jb3B5KHZlcnRpY2VzW2ZhY2VbaSArIDFdXSk7CiAgICAgICAgICBxLnZtdWx0KGIsIGIpOwogICAgICAgICAgcS52bXVsdChjLCBjKTsKICAgICAgICAgIHgudmFkZChiLCBiKTsKICAgICAgICAgIHgudmFkZChjLCBjKTsKICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gaW50ZXJzZWN0UG9pbnQuZGlzdGFuY2VUbyhmcm9tKTsKCiAgICAgICAgICBpZiAoIShSYXkucG9pbnRJblRyaWFuZ2xlKGludGVyc2VjdFBvaW50LCBhLCBiLCBjKSB8fCBSYXkucG9pbnRJblRyaWFuZ2xlKGludGVyc2VjdFBvaW50LCBiLCBhLCBjKSkgfHwgZGlzdGFuY2UgPiBmcm9tVG9EaXN0YW5jZSkgewogICAgICAgICAgICBjb250aW51ZTsKICAgICAgICAgIH0KCiAgICAgICAgICB0aGlzLnJlcG9ydEludGVyc2VjdGlvbihub3JtYWwsIGludGVyc2VjdFBvaW50LCByZXBvcnRlZFNoYXBlLCBib2R5LCBmaSk7CiAgICAgICAgfSAvLyB9CgogICAgICB9CiAgICB9CiAgICAvKioKICAgICAqIEB0b2RvIE9wdGltaXplIGJ5IHRyYW5zZm9ybWluZyB0aGUgd29ybGQgdG8gbG9jYWwgc3BhY2UgZmlyc3QuCiAgICAgKiBAdG9kbyBVc2UgT2N0cmVlIGxvb2t1cAogICAgICovCgoKICAgIF9pbnRlcnNlY3RUcmltZXNoKG1lc2gsIHF1YXQsIHBvc2l0aW9uLCBib2R5LCByZXBvcnRlZFNoYXBlLCBvcHRpb25zKSB7CiAgICAgIGNvbnN0IG5vcm1hbCA9IGludGVyc2VjdFRyaW1lc2hfbm9ybWFsOwogICAgICBjb25zdCB0cmlhbmdsZXMgPSBpbnRlcnNlY3RUcmltZXNoX3RyaWFuZ2xlczsKICAgICAgY29uc3QgdHJlZVRyYW5zZm9ybSA9IGludGVyc2VjdFRyaW1lc2hfdHJlZVRyYW5zZm9ybTsKICAgICAgY29uc3QgdmVjdG9yID0gaW50ZXJzZWN0Q29udmV4X3ZlY3RvcjsKICAgICAgY29uc3QgbG9jYWxEaXJlY3Rpb24gPSBpbnRlcnNlY3RUcmltZXNoX2xvY2FsRGlyZWN0aW9uOwogICAgICBjb25zdCBsb2NhbEZyb20gPSBpbnRlcnNlY3RUcmltZXNoX2xvY2FsRnJvbTsKICAgICAgY29uc3QgbG9jYWxUbyA9IGludGVyc2VjdFRyaW1lc2hfbG9jYWxUbzsKICAgICAgY29uc3Qgd29ybGRJbnRlcnNlY3RQb2ludCA9IGludGVyc2VjdFRyaW1lc2hfd29ybGRJbnRlcnNlY3RQb2ludDsKICAgICAgY29uc3Qgd29ybGROb3JtYWwgPSBpbnRlcnNlY3RUcmltZXNoX3dvcmxkTm9ybWFsOyAvLyBDaGVja2luZyBmYWNlcwoKICAgICAgY29uc3QgaW5kaWNlcyA9IG1lc2guaW5kaWNlczsKICAgICAgbWVzaC52ZXJ0aWNlczsgLy8gY29uc3Qgbm9ybWFscyA9IG1lc2guZmFjZU5vcm1hbHMKCiAgICAgIGNvbnN0IGZyb20gPSB0aGlzLmZyb207CiAgICAgIGNvbnN0IHRvID0gdGhpcy50bzsKICAgICAgY29uc3QgZGlyZWN0aW9uID0gdGhpcy5kaXJlY3Rpb247CiAgICAgIHRyZWVUcmFuc2Zvcm0ucG9zaXRpb24uY29weShwb3NpdGlvbik7CiAgICAgIHRyZWVUcmFuc2Zvcm0ucXVhdGVybmlvbi5jb3B5KHF1YXQpOyAvLyBUcmFuc2Zvcm0gcmF5IHRvIGxvY2FsIHNwYWNlIQoKICAgICAgVHJhbnNmb3JtLnZlY3RvclRvTG9jYWxGcmFtZShwb3NpdGlvbiwgcXVhdCwgZGlyZWN0aW9uLCBsb2NhbERpcmVjdGlvbik7CiAgICAgIFRyYW5zZm9ybS5wb2ludFRvTG9jYWxGcmFtZShwb3NpdGlvbiwgcXVhdCwgZnJvbSwgbG9jYWxGcm9tKTsKICAgICAgVHJhbnNmb3JtLnBvaW50VG9Mb2NhbEZyYW1lKHBvc2l0aW9uLCBxdWF0LCB0bywgbG9jYWxUbyk7CiAgICAgIGxvY2FsVG8ueCAqPSBtZXNoLnNjYWxlLng7CiAgICAgIGxvY2FsVG8ueSAqPSBtZXNoLnNjYWxlLnk7CiAgICAgIGxvY2FsVG8ueiAqPSBtZXNoLnNjYWxlLno7CiAgICAgIGxvY2FsRnJvbS54ICo9IG1lc2guc2NhbGUueDsKICAgICAgbG9jYWxGcm9tLnkgKj0gbWVzaC5zY2FsZS55OwogICAgICBsb2NhbEZyb20ueiAqPSBtZXNoLnNjYWxlLno7CiAgICAgIGxvY2FsVG8udnN1Yihsb2NhbEZyb20sIGxvY2FsRGlyZWN0aW9uKTsKICAgICAgbG9jYWxEaXJlY3Rpb24ubm9ybWFsaXplKCk7CiAgICAgIGNvbnN0IGZyb21Ub0Rpc3RhbmNlU3F1YXJlZCA9IGxvY2FsRnJvbS5kaXN0YW5jZVNxdWFyZWQobG9jYWxUbyk7CiAgICAgIG1lc2gudHJlZS5yYXlRdWVyeSh0aGlzLCB0cmVlVHJhbnNmb3JtLCB0cmlhbmdsZXMpOwoKICAgICAgZm9yIChsZXQgaSA9IDAsIE4gPSB0cmlhbmdsZXMubGVuZ3RoOyAhdGhpcy5yZXN1bHQuc2hvdWxkU3RvcCAmJiBpICE9PSBOOyBpKyspIHsKICAgICAgICBjb25zdCB0cmlhbmdsZXNJbmRleCA9IHRyaWFuZ2xlc1tpXTsKICAgICAgICBtZXNoLmdldE5vcm1hbCh0cmlhbmdsZXNJbmRleCwgbm9ybWFsKTsgLy8gZGV0ZXJtaW5lIGlmIHJheSBpbnRlcnNlY3RzIHRoZSBwbGFuZSBvZiB0aGUgZmFjZQogICAgICAgIC8vIG5vdGU6IHRoaXMgd29ya3MgcmVnYXJkbGVzcyBvZiB0aGUgZGlyZWN0aW9uIG9mIHRoZSBmYWNlIG5vcm1hbAogICAgICAgIC8vIEdldCBwbGFuZSBwb2ludCBpbiB3b3JsZCBjb29yZGluYXRlcy4uLgoKICAgICAgICBtZXNoLmdldFZlcnRleChpbmRpY2VzW3RyaWFuZ2xlc0luZGV4ICogM10sIGEpOyAvLyAuLi5idXQgbWFrZSBpdCByZWxhdGl2ZSB0byB0aGUgcmF5IGZyb20uIFdlJ2xsIGZpeCB0aGlzIGxhdGVyLgoKICAgICAgICBhLnZzdWIobG9jYWxGcm9tLCB2ZWN0b3IpOyAvLyBJZiB0aGlzIGRvdCBwcm9kdWN0IGlzIG5lZ2F0aXZlLCB3ZSBoYXZlIHNvbWV0aGluZyBpbnRlcmVzdGluZwoKICAgICAgICBjb25zdCBkb3QgPSBsb2NhbERpcmVjdGlvbi5kb3Qobm9ybWFsKTsgLy8gQmFpbCBvdXQgaWYgcmF5IGFuZCBwbGFuZSBhcmUgcGFyYWxsZWwKICAgICAgICAvLyBpZiAoTWF0aC5hYnMoIGRvdCApIDwgdGhpcy5wcmVjaXNpb24pewogICAgICAgIC8vICAgICBjb250aW51ZTsKICAgICAgICAvLyB9CiAgICAgICAgLy8gY2FsYyBkaXN0YW5jZSB0byBwbGFuZQoKICAgICAgICBjb25zdCBzY2FsYXIgPSBub3JtYWwuZG90KHZlY3RvcikgLyBkb3Q7IC8vIGlmIG5lZ2F0aXZlIGRpc3RhbmNlLCB0aGVuIHBsYW5lIGlzIGJlaGluZCByYXkKCiAgICAgICAgaWYgKHNjYWxhciA8IDApIHsKICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgIH0gLy8gSW50ZXJzZWN0aW9uIHBvaW50IGlzIGZyb20gKyBkaXJlY3Rpb24gKiBzY2FsYXIKCgogICAgICAgIGxvY2FsRGlyZWN0aW9uLnNjYWxlKHNjYWxhciwgaW50ZXJzZWN0UG9pbnQpOwogICAgICAgIGludGVyc2VjdFBvaW50LnZhZGQobG9jYWxGcm9tLCBpbnRlcnNlY3RQb2ludCk7IC8vIEdldCB0cmlhbmdsZSB2ZXJ0aWNlcwoKICAgICAgICBtZXNoLmdldFZlcnRleChpbmRpY2VzW3RyaWFuZ2xlc0luZGV4ICogMyArIDFdLCBiKTsKICAgICAgICBtZXNoLmdldFZlcnRleChpbmRpY2VzW3RyaWFuZ2xlc0luZGV4ICogMyArIDJdLCBjKTsKICAgICAgICBjb25zdCBzcXVhcmVkRGlzdGFuY2UgPSBpbnRlcnNlY3RQb2ludC5kaXN0YW5jZVNxdWFyZWQobG9jYWxGcm9tKTsKCiAgICAgICAgaWYgKCEoUmF5LnBvaW50SW5UcmlhbmdsZShpbnRlcnNlY3RQb2ludCwgYiwgYSwgYykgfHwgUmF5LnBvaW50SW5UcmlhbmdsZShpbnRlcnNlY3RQb2ludCwgYSwgYiwgYykpIHx8IHNxdWFyZWREaXN0YW5jZSA+IGZyb21Ub0Rpc3RhbmNlU3F1YXJlZCkgewogICAgICAgICAgY29udGludWU7CiAgICAgICAgfSAvLyB0cmFuc2Zvcm0gaW50ZXJzZWN0cG9pbnQgYW5kIG5vcm1hbCB0byB3b3JsZAoKCiAgICAgICAgVHJhbnNmb3JtLnZlY3RvclRvV29ybGRGcmFtZShxdWF0LCBub3JtYWwsIHdvcmxkTm9ybWFsKTsKICAgICAgICBUcmFuc2Zvcm0ucG9pbnRUb1dvcmxkRnJhbWUocG9zaXRpb24sIHF1YXQsIGludGVyc2VjdFBvaW50LCB3b3JsZEludGVyc2VjdFBvaW50KTsKICAgICAgICB0aGlzLnJlcG9ydEludGVyc2VjdGlvbih3b3JsZE5vcm1hbCwgd29ybGRJbnRlcnNlY3RQb2ludCwgcmVwb3J0ZWRTaGFwZSwgYm9keSwgdHJpYW5nbGVzSW5kZXgpOwogICAgICB9CgogICAgICB0cmlhbmdsZXMubGVuZ3RoID0gMDsKICAgIH0KICAgIC8qKgogICAgICogQHJldHVybiBUcnVlIGlmIHRoZSBpbnRlcnNlY3Rpb25zIHNob3VsZCBjb250aW51ZQogICAgICovCgoKICAgIHJlcG9ydEludGVyc2VjdGlvbihub3JtYWwsIGhpdFBvaW50V29ybGQsIHNoYXBlLCBib2R5LCBoaXRGYWNlSW5kZXgpIHsKICAgICAgY29uc3QgZnJvbSA9IHRoaXMuZnJvbTsKICAgICAgY29uc3QgdG8gPSB0aGlzLnRvOwogICAgICBjb25zdCBkaXN0YW5jZSA9IGZyb20uZGlzdGFuY2VUbyhoaXRQb2ludFdvcmxkKTsKICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5yZXN1bHQ7IC8vIFNraXAgYmFjayBmYWNlcz8KCiAgICAgIGlmICh0aGlzLnNraXBCYWNrZmFjZXMgJiYgbm9ybWFsLmRvdCh0aGlzLmRpcmVjdGlvbikgPiAwKSB7CiAgICAgICAgcmV0dXJuOwogICAgICB9CgogICAgICByZXN1bHQuaGl0RmFjZUluZGV4ID0gdHlwZW9mIGhpdEZhY2VJbmRleCAhPT0gJ3VuZGVmaW5lZCcgPyBoaXRGYWNlSW5kZXggOiAtMTsKCiAgICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7CiAgICAgICAgY2FzZSBSYXkuQUxMOgogICAgICAgICAgdGhpcy5oYXNIaXQgPSB0cnVlOwogICAgICAgICAgcmVzdWx0LnNldChmcm9tLCB0bywgbm9ybWFsLCBoaXRQb2ludFdvcmxkLCBzaGFwZSwgYm9keSwgZGlzdGFuY2UpOwogICAgICAgICAgcmVzdWx0Lmhhc0hpdCA9IHRydWU7CiAgICAgICAgICB0aGlzLmNhbGxiYWNrKHJlc3VsdCk7CiAgICAgICAgICBicmVhazsKCiAgICAgICAgY2FzZSBSYXkuQ0xPU0VTVDoKICAgICAgICAgIC8vIFN0b3JlIGlmIGNsb3NlciB0aGFuIGN1cnJlbnQgY2xvc2VzdAogICAgICAgICAgaWYgKGRpc3RhbmNlIDwgcmVzdWx0LmRpc3RhbmNlIHx8ICFyZXN1bHQuaGFzSGl0KSB7CiAgICAgICAgICAgIHRoaXMuaGFzSGl0ID0gdHJ1ZTsKICAgICAgICAgICAgcmVzdWx0Lmhhc0hpdCA9IHRydWU7CiAgICAgICAgICAgIHJlc3VsdC5zZXQoZnJvbSwgdG8sIG5vcm1hbCwgaGl0UG9pbnRXb3JsZCwgc2hhcGUsIGJvZHksIGRpc3RhbmNlKTsKICAgICAgICAgIH0KCiAgICAgICAgICBicmVhazsKCiAgICAgICAgY2FzZSBSYXkuQU5ZOgogICAgICAgICAgLy8gUmVwb3J0IGFuZCBzdG9wLgogICAgICAgICAgdGhpcy5oYXNIaXQgPSB0cnVlOwogICAgICAgICAgcmVzdWx0Lmhhc0hpdCA9IHRydWU7CiAgICAgICAgICByZXN1bHQuc2V0KGZyb20sIHRvLCBub3JtYWwsIGhpdFBvaW50V29ybGQsIHNoYXBlLCBib2R5LCBkaXN0YW5jZSk7CiAgICAgICAgICByZXN1bHQuc2hvdWxkU3RvcCA9IHRydWU7CiAgICAgICAgICBicmVhazsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBBcyBwZXIgIkJhcnljZW50cmljIFRlY2huaXF1ZSIgYXMgbmFtZWQKICAgICAqIHtAbGluayBodHRwczovL3d3dy5ibGFja3Bhd24uY29tL3RleHRzL3BvaW50aW5wb2x5L2RlZmF1bHQuaHRtbCBoZXJlfSBidXQgd2l0aG91dCB0aGUgZGl2aXNpb24KICAgICAqLwoKCiAgICBzdGF0aWMgcG9pbnRJblRyaWFuZ2xlKHAsIGEsIGIsIGMpIHsKICAgICAgYy52c3ViKGEsIHYwKTsKICAgICAgYi52c3ViKGEsIHYxKTsKICAgICAgcC52c3ViKGEsIHYyKTsKICAgICAgY29uc3QgZG90MDAgPSB2MC5kb3QodjApOwogICAgICBjb25zdCBkb3QwMSA9IHYwLmRvdCh2MSk7CiAgICAgIGNvbnN0IGRvdDAyID0gdjAuZG90KHYyKTsKICAgICAgY29uc3QgZG90MTEgPSB2MS5kb3QodjEpOwogICAgICBjb25zdCBkb3QxMiA9IHYxLmRvdCh2Mik7CiAgICAgIGxldCB1OwogICAgICBsZXQgdjsKICAgICAgcmV0dXJuICh1ID0gZG90MTEgKiBkb3QwMiAtIGRvdDAxICogZG90MTIpID49IDAgJiYgKHYgPSBkb3QwMCAqIGRvdDEyIC0gZG90MDEgKiBkb3QwMikgPj0gMCAmJiB1ICsgdiA8IGRvdDAwICogZG90MTEgLSBkb3QwMSAqIGRvdDAxOwogICAgfQoKICB9CiAgUmF5LkNMT1NFU1QgPSBSQVlfTU9ERVMuQ0xPU0VTVDsKICBSYXkuQU5ZID0gUkFZX01PREVTLkFOWTsKICBSYXkuQUxMID0gUkFZX01PREVTLkFMTDsKICBjb25zdCB0bXBBQUJCJDEgPSBuZXcgQUFCQigpOwogIGNvbnN0IHRtcEFycmF5ID0gW107CiAgY29uc3QgdjEgPSBuZXcgVmVjMygpOwogIGNvbnN0IHYyID0gbmV3IFZlYzMoKTsKICBjb25zdCBpbnRlcnNlY3RCb2R5X3hpID0gbmV3IFZlYzMoKTsKICBjb25zdCBpbnRlcnNlY3RCb2R5X3FpID0gbmV3IFF1YXRlcm5pb24oKTsKICBjb25zdCBpbnRlcnNlY3RQb2ludCA9IG5ldyBWZWMzKCk7CiAgY29uc3QgYSA9IG5ldyBWZWMzKCk7CiAgY29uc3QgYiA9IG5ldyBWZWMzKCk7CiAgY29uc3QgYyA9IG5ldyBWZWMzKCk7CiAgbmV3IFZlYzMoKTsKICBuZXcgUmF5Y2FzdFJlc3VsdCgpOwogIGNvbnN0IGludGVyc2VjdENvbnZleE9wdGlvbnMgPSB7CiAgICBmYWNlTGlzdDogWzBdCiAgfTsKICBjb25zdCB3b3JsZFBpbGxhck9mZnNldCA9IG5ldyBWZWMzKCk7CiAgY29uc3QgaW50ZXJzZWN0SGVpZ2h0ZmllbGRfbG9jYWxSYXkgPSBuZXcgUmF5KCk7CiAgY29uc3QgaW50ZXJzZWN0SGVpZ2h0ZmllbGRfaW5kZXggPSBbXTsKICBjb25zdCBSYXlfaW50ZXJzZWN0U3BoZXJlX2ludGVyc2VjdGlvblBvaW50ID0gbmV3IFZlYzMoKTsKICBjb25zdCBSYXlfaW50ZXJzZWN0U3BoZXJlX25vcm1hbCA9IG5ldyBWZWMzKCk7CiAgY29uc3QgaW50ZXJzZWN0Q29udmV4X25vcm1hbCA9IG5ldyBWZWMzKCk7CiAgbmV3IFZlYzMoKTsKICBuZXcgVmVjMygpOwogIGNvbnN0IGludGVyc2VjdENvbnZleF92ZWN0b3IgPSBuZXcgVmVjMygpOwogIGNvbnN0IGludGVyc2VjdFRyaW1lc2hfbm9ybWFsID0gbmV3IFZlYzMoKTsKICBjb25zdCBpbnRlcnNlY3RUcmltZXNoX2xvY2FsRGlyZWN0aW9uID0gbmV3IFZlYzMoKTsKICBjb25zdCBpbnRlcnNlY3RUcmltZXNoX2xvY2FsRnJvbSA9IG5ldyBWZWMzKCk7CiAgY29uc3QgaW50ZXJzZWN0VHJpbWVzaF9sb2NhbFRvID0gbmV3IFZlYzMoKTsKICBjb25zdCBpbnRlcnNlY3RUcmltZXNoX3dvcmxkTm9ybWFsID0gbmV3IFZlYzMoKTsKICBjb25zdCBpbnRlcnNlY3RUcmltZXNoX3dvcmxkSW50ZXJzZWN0UG9pbnQgPSBuZXcgVmVjMygpOwogIG5ldyBBQUJCKCk7CiAgY29uc3QgaW50ZXJzZWN0VHJpbWVzaF90cmlhbmdsZXMgPSBbXTsKICBjb25zdCBpbnRlcnNlY3RUcmltZXNoX3RyZWVUcmFuc2Zvcm0gPSBuZXcgVHJhbnNmb3JtKCk7CiAgY29uc3QgdjAgPSBuZXcgVmVjMygpOwogIGNvbnN0IGludGVyc2VjdCA9IG5ldyBWZWMzKCk7CgogIGZ1bmN0aW9uIGRpc3RhbmNlRnJvbUludGVyc2VjdGlvbihmcm9tLCBkaXJlY3Rpb24sIHBvc2l0aW9uKSB7CiAgICAvLyB2MCBpcyB2ZWN0b3IgZnJvbSBmcm9tIHRvIHBvc2l0aW9uCiAgICBwb3NpdGlvbi52c3ViKGZyb20sIHYwKTsKICAgIGNvbnN0IGRvdCA9IHYwLmRvdChkaXJlY3Rpb24pOyAvLyBpbnRlcnNlY3QgPSBkaXJlY3Rpb24qZG90ICsgZnJvbQoKICAgIGRpcmVjdGlvbi5zY2FsZShkb3QsIGludGVyc2VjdCk7CiAgICBpbnRlcnNlY3QudmFkZChmcm9tLCBpbnRlcnNlY3QpOwogICAgY29uc3QgZGlzdGFuY2UgPSBwb3NpdGlvbi5kaXN0YW5jZVRvKGludGVyc2VjdCk7CiAgICByZXR1cm4gZGlzdGFuY2U7CiAgfQoKICAvKioKICAgKiBTd2VlcCBhbmQgcHJ1bmUgYnJvYWRwaGFzZSBhbG9uZyBvbmUgYXhpcy4KICAgKi8KICBjbGFzcyBTQVBCcm9hZHBoYXNlIGV4dGVuZHMgQnJvYWRwaGFzZSB7CiAgICAvKioKICAgICAqIExpc3Qgb2YgYm9kaWVzIGN1cnJlbnRseSBpbiB0aGUgYnJvYWRwaGFzZS4KICAgICAqLwoKICAgIC8qKgogICAgICogVGhlIHdvcmxkIHRvIHNlYXJjaCBpbi4KICAgICAqLwoKICAgIC8qKgogICAgICogQXhpcyB0byBzb3J0IHRoZSBib2RpZXMgYWxvbmcuCiAgICAgKiBTZXQgdG8gMCBmb3IgeCBheGlzLCBhbmQgMSBmb3IgeSBheGlzLgogICAgICogRm9yIGJlc3QgcGVyZm9ybWFuY2UsIHBpY2sgdGhlIGF4aXMgd2hlcmUgYm9kaWVzIGFyZSBtb3N0IGRpc3RyaWJ1dGVkLgogICAgICovCgogICAgLyoqCiAgICAgKiBDaGVjayBpZiB0aGUgYm91bmRzIG9mIHR3byBib2RpZXMgb3ZlcmxhcCwgYWxvbmcgdGhlIGdpdmVuIFNBUCBheGlzLgogICAgICovCiAgICBzdGF0aWMgY2hlY2tCb3VuZHMoYmksIGJqLCBheGlzSW5kZXgpIHsKICAgICAgbGV0IGJpUG9zOwogICAgICBsZXQgYmpQb3M7CgogICAgICBpZiAoYXhpc0luZGV4ID09PSAwKSB7CiAgICAgICAgYmlQb3MgPSBiaS5wb3NpdGlvbi54OwogICAgICAgIGJqUG9zID0gYmoucG9zaXRpb24ueDsKICAgICAgfSBlbHNlIGlmIChheGlzSW5kZXggPT09IDEpIHsKICAgICAgICBiaVBvcyA9IGJpLnBvc2l0aW9uLnk7CiAgICAgICAgYmpQb3MgPSBiai5wb3NpdGlvbi55OwogICAgICB9IGVsc2UgaWYgKGF4aXNJbmRleCA9PT0gMikgewogICAgICAgIGJpUG9zID0gYmkucG9zaXRpb24uejsKICAgICAgICBialBvcyA9IGJqLnBvc2l0aW9uLno7CiAgICAgIH0KCiAgICAgIGNvbnN0IHJpID0gYmkuYm91bmRpbmdSYWRpdXMsCiAgICAgICAgICAgIHJqID0gYmouYm91bmRpbmdSYWRpdXMsCiAgICAgICAgICAgIGJvdW5kQTIgPSBiaVBvcyArIHJpLAogICAgICAgICAgICBib3VuZEIxID0gYmpQb3MgLSByajsKICAgICAgcmV0dXJuIGJvdW5kQjEgPCBib3VuZEEyOwogICAgfSAvLyBOb3RlOiB0aGVzZSBhcmUgaWRlbnRpY2FsLCBzYXZlIGZvciB4L3kveiBsb3dlcmJvdW5kCgogICAgLyoqCiAgICAgKiBpbnNlcnRpb25Tb3J0WAogICAgICovCgoKICAgIHN0YXRpYyBpbnNlcnRpb25Tb3J0WChhKSB7CiAgICAgIGZvciAobGV0IGkgPSAxLCBsID0gYS5sZW5ndGg7IGkgPCBsOyBpKyspIHsKICAgICAgICBjb25zdCB2ID0gYVtpXTsKICAgICAgICBsZXQgajsKCiAgICAgICAgZm9yIChqID0gaSAtIDE7IGogPj0gMDsgai0tKSB7CiAgICAgICAgICBpZiAoYVtqXS5hYWJiLmxvd2VyQm91bmQueCA8PSB2LmFhYmIubG93ZXJCb3VuZC54KSB7CiAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgfQoKICAgICAgICAgIGFbaiArIDFdID0gYVtqXTsKICAgICAgICB9CgogICAgICAgIGFbaiArIDFdID0gdjsKICAgICAgfQoKICAgICAgcmV0dXJuIGE7CiAgICB9CiAgICAvKioKICAgICAqIGluc2VydGlvblNvcnRZCiAgICAgKi8KCgogICAgc3RhdGljIGluc2VydGlvblNvcnRZKGEpIHsKICAgICAgZm9yIChsZXQgaSA9IDEsIGwgPSBhLmxlbmd0aDsgaSA8IGw7IGkrKykgewogICAgICAgIGNvbnN0IHYgPSBhW2ldOwogICAgICAgIGxldCBqOwoKICAgICAgICBmb3IgKGogPSBpIC0gMTsgaiA+PSAwOyBqLS0pIHsKICAgICAgICAgIGlmIChhW2pdLmFhYmIubG93ZXJCb3VuZC55IDw9IHYuYWFiYi5sb3dlckJvdW5kLnkpIHsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CgogICAgICAgICAgYVtqICsgMV0gPSBhW2pdOwogICAgICAgIH0KCiAgICAgICAgYVtqICsgMV0gPSB2OwogICAgICB9CgogICAgICByZXR1cm4gYTsKICAgIH0KICAgIC8qKgogICAgICogaW5zZXJ0aW9uU29ydFoKICAgICAqLwoKCiAgICBzdGF0aWMgaW5zZXJ0aW9uU29ydFooYSkgewogICAgICBmb3IgKGxldCBpID0gMSwgbCA9IGEubGVuZ3RoOyBpIDwgbDsgaSsrKSB7CiAgICAgICAgY29uc3QgdiA9IGFbaV07CiAgICAgICAgbGV0IGo7CgogICAgICAgIGZvciAoaiA9IGkgLSAxOyBqID49IDA7IGotLSkgewogICAgICAgICAgaWYgKGFbal0uYWFiYi5sb3dlckJvdW5kLnogPD0gdi5hYWJiLmxvd2VyQm91bmQueikgewogICAgICAgICAgICBicmVhazsKICAgICAgICAgIH0KCiAgICAgICAgICBhW2ogKyAxXSA9IGFbal07CiAgICAgICAgfQoKICAgICAgICBhW2ogKyAxXSA9IHY7CiAgICAgIH0KCiAgICAgIHJldHVybiBhOwogICAgfQoKICAgIGNvbnN0cnVjdG9yKHdvcmxkKSB7CiAgICAgIHN1cGVyKCk7CiAgICAgIHRoaXMuYXhpc0xpc3QgPSBbXTsKICAgICAgdGhpcy53b3JsZCA9IG51bGw7CiAgICAgIHRoaXMuYXhpc0luZGV4ID0gMDsKICAgICAgY29uc3QgYXhpc0xpc3QgPSB0aGlzLmF4aXNMaXN0OwoKICAgICAgdGhpcy5fYWRkQm9keUhhbmRsZXIgPSBldmVudCA9PiB7CiAgICAgICAgYXhpc0xpc3QucHVzaChldmVudC5ib2R5KTsKICAgICAgfTsKCiAgICAgIHRoaXMuX3JlbW92ZUJvZHlIYW5kbGVyID0gZXZlbnQgPT4gewogICAgICAgIGNvbnN0IGlkeCA9IGF4aXNMaXN0LmluZGV4T2YoZXZlbnQuYm9keSk7CgogICAgICAgIGlmIChpZHggIT09IC0xKSB7CiAgICAgICAgICBheGlzTGlzdC5zcGxpY2UoaWR4LCAxKTsKICAgICAgICB9CiAgICAgIH07CgogICAgICBpZiAod29ybGQpIHsKICAgICAgICB0aGlzLnNldFdvcmxkKHdvcmxkKTsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBDaGFuZ2UgdGhlIHdvcmxkCiAgICAgKi8KCgogICAgc2V0V29ybGQod29ybGQpIHsKICAgICAgLy8gQ2xlYXIgdGhlIG9sZCBheGlzIGFycmF5CiAgICAgIHRoaXMuYXhpc0xpc3QubGVuZ3RoID0gMDsgLy8gQWRkIGFsbCBib2RpZXMgZnJvbSB0aGUgbmV3IHdvcmxkCgogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdvcmxkLmJvZGllcy5sZW5ndGg7IGkrKykgewogICAgICAgIHRoaXMuYXhpc0xpc3QucHVzaCh3b3JsZC5ib2RpZXNbaV0pOwogICAgICB9IC8vIFJlbW92ZSBvbGQgaGFuZGxlcnMsIGlmIGFueQoKCiAgICAgIHdvcmxkLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2FkZEJvZHknLCB0aGlzLl9hZGRCb2R5SGFuZGxlcik7CiAgICAgIHdvcmxkLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3JlbW92ZUJvZHknLCB0aGlzLl9yZW1vdmVCb2R5SGFuZGxlcik7IC8vIEFkZCBoYW5kbGVycyB0byB1cGRhdGUgdGhlIGxpc3Qgb2YgYm9kaWVzLgoKICAgICAgd29ybGQuYWRkRXZlbnRMaXN0ZW5lcignYWRkQm9keScsIHRoaXMuX2FkZEJvZHlIYW5kbGVyKTsKICAgICAgd29ybGQuYWRkRXZlbnRMaXN0ZW5lcigncmVtb3ZlQm9keScsIHRoaXMuX3JlbW92ZUJvZHlIYW5kbGVyKTsKICAgICAgdGhpcy53b3JsZCA9IHdvcmxkOwogICAgICB0aGlzLmRpcnR5ID0gdHJ1ZTsKICAgIH0KICAgIC8qKgogICAgICogQ29sbGVjdCBhbGwgY29sbGlzaW9uIHBhaXJzCiAgICAgKi8KCgogICAgY29sbGlzaW9uUGFpcnMod29ybGQsIHAxLCBwMikgewogICAgICBjb25zdCBib2RpZXMgPSB0aGlzLmF4aXNMaXN0OwogICAgICBjb25zdCBOID0gYm9kaWVzLmxlbmd0aDsKICAgICAgY29uc3QgYXhpc0luZGV4ID0gdGhpcy5heGlzSW5kZXg7CiAgICAgIGxldCBpOwogICAgICBsZXQgajsKCiAgICAgIGlmICh0aGlzLmRpcnR5KSB7CiAgICAgICAgdGhpcy5zb3J0TGlzdCgpOwogICAgICAgIHRoaXMuZGlydHkgPSBmYWxzZTsKICAgICAgfSAvLyBMb29rIHRocm91Z2ggdGhlIGxpc3QKCgogICAgICBmb3IgKGkgPSAwOyBpICE9PSBOOyBpKyspIHsKICAgICAgICBjb25zdCBiaSA9IGJvZGllc1tpXTsKCiAgICAgICAgZm9yIChqID0gaSArIDE7IGogPCBOOyBqKyspIHsKICAgICAgICAgIGNvbnN0IGJqID0gYm9kaWVzW2pdOwoKICAgICAgICAgIGlmICghdGhpcy5uZWVkQnJvYWRwaGFzZUNvbGxpc2lvbihiaSwgYmopKSB7CiAgICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgICAgfQoKICAgICAgICAgIGlmICghU0FQQnJvYWRwaGFzZS5jaGVja0JvdW5kcyhiaSwgYmosIGF4aXNJbmRleCkpIHsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CgogICAgICAgICAgdGhpcy5pbnRlcnNlY3Rpb25UZXN0KGJpLCBiaiwgcDEsIHAyKTsKICAgICAgICB9CiAgICAgIH0KICAgIH0KCiAgICBzb3J0TGlzdCgpIHsKICAgICAgY29uc3QgYXhpc0xpc3QgPSB0aGlzLmF4aXNMaXN0OwogICAgICBjb25zdCBheGlzSW5kZXggPSB0aGlzLmF4aXNJbmRleDsKICAgICAgY29uc3QgTiA9IGF4aXNMaXN0Lmxlbmd0aDsgLy8gVXBkYXRlIEFBQkJzCgogICAgICBmb3IgKGxldCBpID0gMDsgaSAhPT0gTjsgaSsrKSB7CiAgICAgICAgY29uc3QgYmkgPSBheGlzTGlzdFtpXTsKCiAgICAgICAgaWYgKGJpLmFhYmJOZWVkc1VwZGF0ZSkgewogICAgICAgICAgYmkudXBkYXRlQUFCQigpOwogICAgICAgIH0KICAgICAgfSAvLyBTb3J0IHRoZSBsaXN0CgoKICAgICAgaWYgKGF4aXNJbmRleCA9PT0gMCkgewogICAgICAgIFNBUEJyb2FkcGhhc2UuaW5zZXJ0aW9uU29ydFgoYXhpc0xpc3QpOwogICAgICB9IGVsc2UgaWYgKGF4aXNJbmRleCA9PT0gMSkgewogICAgICAgIFNBUEJyb2FkcGhhc2UuaW5zZXJ0aW9uU29ydFkoYXhpc0xpc3QpOwogICAgICB9IGVsc2UgaWYgKGF4aXNJbmRleCA9PT0gMikgewogICAgICAgIFNBUEJyb2FkcGhhc2UuaW5zZXJ0aW9uU29ydFooYXhpc0xpc3QpOwogICAgICB9CiAgICB9CiAgICAvKioKICAgICAqIENvbXB1dGVzIHRoZSB2YXJpYW5jZSBvZiB0aGUgYm9keSBwb3NpdGlvbnMgYW5kIGVzdGltYXRlcyB0aGUgYmVzdCBheGlzIHRvIHVzZS4KICAgICAqIFdpbGwgYXV0b21hdGljYWxseSBzZXQgcHJvcGVydHkgYGF4aXNJbmRleGAuCiAgICAgKi8KCgogICAgYXV0b0RldGVjdEF4aXMoKSB7CiAgICAgIGxldCBzdW1YID0gMDsKICAgICAgbGV0IHN1bVgyID0gMDsKICAgICAgbGV0IHN1bVkgPSAwOwogICAgICBsZXQgc3VtWTIgPSAwOwogICAgICBsZXQgc3VtWiA9IDA7CiAgICAgIGxldCBzdW1aMiA9IDA7CiAgICAgIGNvbnN0IGJvZGllcyA9IHRoaXMuYXhpc0xpc3Q7CiAgICAgIGNvbnN0IE4gPSBib2RpZXMubGVuZ3RoOwogICAgICBjb25zdCBpbnZOID0gMSAvIE47CgogICAgICBmb3IgKGxldCBpID0gMDsgaSAhPT0gTjsgaSsrKSB7CiAgICAgICAgY29uc3QgYiA9IGJvZGllc1tpXTsKICAgICAgICBjb25zdCBjZW50ZXJYID0gYi5wb3NpdGlvbi54OwogICAgICAgIHN1bVggKz0gY2VudGVyWDsKICAgICAgICBzdW1YMiArPSBjZW50ZXJYICogY2VudGVyWDsKICAgICAgICBjb25zdCBjZW50ZXJZID0gYi5wb3NpdGlvbi55OwogICAgICAgIHN1bVkgKz0gY2VudGVyWTsKICAgICAgICBzdW1ZMiArPSBjZW50ZXJZICogY2VudGVyWTsKICAgICAgICBjb25zdCBjZW50ZXJaID0gYi5wb3NpdGlvbi56OwogICAgICAgIHN1bVogKz0gY2VudGVyWjsKICAgICAgICBzdW1aMiArPSBjZW50ZXJaICogY2VudGVyWjsKICAgICAgfQoKICAgICAgY29uc3QgdmFyaWFuY2VYID0gc3VtWDIgLSBzdW1YICogc3VtWCAqIGludk47CiAgICAgIGNvbnN0IHZhcmlhbmNlWSA9IHN1bVkyIC0gc3VtWSAqIHN1bVkgKiBpbnZOOwogICAgICBjb25zdCB2YXJpYW5jZVogPSBzdW1aMiAtIHN1bVogKiBzdW1aICogaW52TjsKCiAgICAgIGlmICh2YXJpYW5jZVggPiB2YXJpYW5jZVkpIHsKICAgICAgICBpZiAodmFyaWFuY2VYID4gdmFyaWFuY2VaKSB7CiAgICAgICAgICB0aGlzLmF4aXNJbmRleCA9IDA7CiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgIHRoaXMuYXhpc0luZGV4ID0gMjsKICAgICAgICB9CiAgICAgIH0gZWxzZSBpZiAodmFyaWFuY2VZID4gdmFyaWFuY2VaKSB7CiAgICAgICAgdGhpcy5heGlzSW5kZXggPSAxOwogICAgICB9IGVsc2UgewogICAgICAgIHRoaXMuYXhpc0luZGV4ID0gMjsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBSZXR1cm5zIGFsbCB0aGUgYm9kaWVzIHdpdGhpbiBhbiBBQUJCLgogICAgICogQHBhcmFtIHJlc3VsdCBBbiBhcnJheSB0byBzdG9yZSByZXN1bHRpbmcgYm9kaWVzIGluLgogICAgICovCgoKICAgIGFhYmJRdWVyeSh3b3JsZCwgYWFiYiwgcmVzdWx0KSB7CiAgICAgIGlmIChyZXN1bHQgPT09IHZvaWQgMCkgewogICAgICAgIHJlc3VsdCA9IFtdOwogICAgICB9CgogICAgICBpZiAodGhpcy5kaXJ0eSkgewogICAgICAgIHRoaXMuc29ydExpc3QoKTsKICAgICAgICB0aGlzLmRpcnR5ID0gZmFsc2U7CiAgICAgIH0KCiAgICAgIGNvbnN0IGF4aXNJbmRleCA9IHRoaXMuYXhpc0luZGV4OwogICAgICBsZXQgYXhpcyA9ICd4JzsKCiAgICAgIGlmIChheGlzSW5kZXggPT09IDEpIHsKICAgICAgICBheGlzID0gJ3knOwogICAgICB9CgogICAgICBpZiAoYXhpc0luZGV4ID09PSAyKSB7CiAgICAgICAgYXhpcyA9ICd6JzsKICAgICAgfQoKICAgICAgY29uc3QgYXhpc0xpc3QgPSB0aGlzLmF4aXNMaXN0OwogICAgICBhYWJiLmxvd2VyQm91bmRbYXhpc107CiAgICAgIGFhYmIudXBwZXJCb3VuZFtheGlzXTsKCiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXhpc0xpc3QubGVuZ3RoOyBpKyspIHsKICAgICAgICBjb25zdCBiID0gYXhpc0xpc3RbaV07CgogICAgICAgIGlmIChiLmFhYmJOZWVkc1VwZGF0ZSkgewogICAgICAgICAgYi51cGRhdGVBQUJCKCk7CiAgICAgICAgfQoKICAgICAgICBpZiAoYi5hYWJiLm92ZXJsYXBzKGFhYmIpKSB7CiAgICAgICAgICByZXN1bHQucHVzaChiKTsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIHJldHVybiByZXN1bHQ7CiAgICB9CgogIH0KCiAgY2xhc3MgVXRpbHMgewogICAgLyoqCiAgICAgKiBFeHRlbmQgYW4gb3B0aW9ucyBvYmplY3Qgd2l0aCBkZWZhdWx0IHZhbHVlcy4KICAgICAqIEBwYXJhbSBvcHRpb25zIFRoZSBvcHRpb25zIG9iamVjdC4gTWF5IGJlIGZhbHN5OiBpbiB0aGlzIGNhc2UsIGEgbmV3IG9iamVjdCBpcyBjcmVhdGVkIGFuZCByZXR1cm5lZC4KICAgICAqIEBwYXJhbSBkZWZhdWx0cyBBbiBvYmplY3QgY29udGFpbmluZyBkZWZhdWx0IHZhbHVlcy4KICAgICAqIEByZXR1cm4gVGhlIG1vZGlmaWVkIG9wdGlvbnMgb2JqZWN0LgogICAgICovCiAgICBzdGF0aWMgZGVmYXVsdHMob3B0aW9ucywgZGVmYXVsdHMpIHsKICAgICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgewogICAgICAgIG9wdGlvbnMgPSB7fTsKICAgICAgfQoKICAgICAgZm9yIChsZXQga2V5IGluIGRlZmF1bHRzKSB7CiAgICAgICAgaWYgKCEoa2V5IGluIG9wdGlvbnMpKSB7CiAgICAgICAgICBvcHRpb25zW2tleV0gPSBkZWZhdWx0c1trZXldOwogICAgICAgIH0KICAgICAgfQoKICAgICAgcmV0dXJuIG9wdGlvbnM7CiAgICB9CgogIH0KCiAgLyoqCiAgICogQ29uc3RyYWludCBiYXNlIGNsYXNzCiAgICovCiAgY2xhc3MgQ29uc3RyYWludCB7CiAgICAvKioKICAgICAqIEVxdWF0aW9ucyB0byBiZSBzb2x2ZWQgaW4gdGhpcyBjb25zdHJhaW50LgogICAgICovCgogICAgLyoqCiAgICAgKiBCb2R5IEEuCiAgICAgKi8KCiAgICAvKioKICAgICAqIEJvZHkgQi4KICAgICAqLwoKICAgIC8qKgogICAgICogU2V0IHRvIGZhbHNlIGlmIHlvdSBkb24ndCB3YW50IHRoZSBib2RpZXMgdG8gY29sbGlkZSB3aGVuIHRoZXkgYXJlIGNvbm5lY3RlZC4KICAgICAqLwogICAgY29uc3RydWN0b3IoYm9keUEsIGJvZHlCLCBvcHRpb25zKSB7CiAgICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsKICAgICAgICBvcHRpb25zID0ge307CiAgICAgIH0KCiAgICAgIG9wdGlvbnMgPSBVdGlscy5kZWZhdWx0cyhvcHRpb25zLCB7CiAgICAgICAgY29sbGlkZUNvbm5lY3RlZDogdHJ1ZSwKICAgICAgICB3YWtlVXBCb2RpZXM6IHRydWUKICAgICAgfSk7CiAgICAgIHRoaXMuZXF1YXRpb25zID0gW107CiAgICAgIHRoaXMuYm9keUEgPSBib2R5QTsKICAgICAgdGhpcy5ib2R5QiA9IGJvZHlCOwogICAgICB0aGlzLmlkID0gQ29uc3RyYWludC5pZENvdW50ZXIrKzsKICAgICAgdGhpcy5jb2xsaWRlQ29ubmVjdGVkID0gb3B0aW9ucy5jb2xsaWRlQ29ubmVjdGVkOwoKICAgICAgaWYgKG9wdGlvbnMud2FrZVVwQm9kaWVzKSB7CiAgICAgICAgaWYgKGJvZHlBKSB7CiAgICAgICAgICBib2R5QS53YWtlVXAoKTsKICAgICAgICB9CgogICAgICAgIGlmIChib2R5QikgewogICAgICAgICAgYm9keUIud2FrZVVwKCk7CiAgICAgICAgfQogICAgICB9CiAgICB9CiAgICAvKioKICAgICAqIFVwZGF0ZSBhbGwgdGhlIGVxdWF0aW9ucyB3aXRoIGRhdGEuCiAgICAgKi8KCgogICAgdXBkYXRlKCkgewogICAgICB0aHJvdyBuZXcgRXJyb3IoJ21ldGhvZCB1cGRhdGUoKSBub3QgaW1wbG1lbWVudGVkIGluIHRoaXMgQ29uc3RyYWludCBzdWJjbGFzcyEnKTsKICAgIH0KICAgIC8qKgogICAgICogRW5hYmxlcyBhbGwgZXF1YXRpb25zIGluIHRoZSBjb25zdHJhaW50LgogICAgICovCgoKICAgIGVuYWJsZSgpIHsKICAgICAgY29uc3QgZXFzID0gdGhpcy5lcXVhdGlvbnM7CgogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVxcy5sZW5ndGg7IGkrKykgewogICAgICAgIGVxc1tpXS5lbmFibGVkID0gdHJ1ZTsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBEaXNhYmxlcyBhbGwgZXF1YXRpb25zIGluIHRoZSBjb25zdHJhaW50LgogICAgICovCgoKICAgIGRpc2FibGUoKSB7CiAgICAgIGNvbnN0IGVxcyA9IHRoaXMuZXF1YXRpb25zOwoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlcXMubGVuZ3RoOyBpKyspIHsKICAgICAgICBlcXNbaV0uZW5hYmxlZCA9IGZhbHNlOwogICAgICB9CiAgICB9CgogIH0KICBDb25zdHJhaW50LmlkQ291bnRlciA9IDA7CgogIC8qKgogICAqIEFuIGVsZW1lbnQgY29udGFpbmluZyA2IGVudHJpZXMsIDMgc3BhdGlhbCBhbmQgMyByb3RhdGlvbmFsIGRlZ3JlZXMgb2YgZnJlZWRvbS4KICAgKi8KCiAgY2xhc3MgSmFjb2JpYW5FbGVtZW50IHsKICAgIC8qKgogICAgICogc3BhdGlhbAogICAgICovCgogICAgLyoqCiAgICAgKiByb3RhdGlvbmFsCiAgICAgKi8KICAgIGNvbnN0cnVjdG9yKCkgewogICAgICB0aGlzLnNwYXRpYWwgPSBuZXcgVmVjMygpOwogICAgICB0aGlzLnJvdGF0aW9uYWwgPSBuZXcgVmVjMygpOwogICAgfQogICAgLyoqCiAgICAgKiBNdWx0aXBseSB3aXRoIG90aGVyIEphY29iaWFuRWxlbWVudAogICAgICovCgoKICAgIG11bHRpcGx5RWxlbWVudChlbGVtZW50KSB7CiAgICAgIHJldHVybiBlbGVtZW50LnNwYXRpYWwuZG90KHRoaXMuc3BhdGlhbCkgKyBlbGVtZW50LnJvdGF0aW9uYWwuZG90KHRoaXMucm90YXRpb25hbCk7CiAgICB9CiAgICAvKioKICAgICAqIE11bHRpcGx5IHdpdGggdHdvIHZlY3RvcnMKICAgICAqLwoKCiAgICBtdWx0aXBseVZlY3RvcnMoc3BhdGlhbCwgcm90YXRpb25hbCkgewogICAgICByZXR1cm4gc3BhdGlhbC5kb3QodGhpcy5zcGF0aWFsKSArIHJvdGF0aW9uYWwuZG90KHRoaXMucm90YXRpb25hbCk7CiAgICB9CgogIH0KCiAgLyoqCiAgICogRXF1YXRpb24gYmFzZSBjbGFzcy4KICAgKgogICAqIGBhYCwgYGJgIGFuZCBgZXBzYCBhcmUge0BsaW5rIGh0dHBzOi8vd3d3OC5jcy51bXUuc2Uva3Vyc2VyLzVEVjA1OC9WVDE1L2xlY3R1cmVzL1NQT09LbGFibm90ZXMucGRmIFNQT09LfSBwYXJhbWV0ZXJzIHRoYXQgZGVmYXVsdCB0byBgMC4wYC4gU2VlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vc2NodGVwcGUvY2Fubm9uLmpzL2lzc3Vlcy8yMzgjaXNzdWVjb21tZW50LTE0NzE3MjMyNyB0aGlzIGV4Y2hhbmdlfSBmb3IgbW9yZSBkZXRhaWxzIG9uIENhbm5vbidzIHBoeXNpY3MgaW1wbGVtZW50YXRpb24uCiAgICovCiAgY2xhc3MgRXF1YXRpb24gewogICAgLyoqCiAgICAgKiBNaW5pbXVtIChyZWFkOiBuZWdhdGl2ZSBtYXgpIGZvcmNlIHRvIGJlIGFwcGxpZWQgYnkgdGhlIGNvbnN0cmFpbnQuCiAgICAgKi8KCiAgICAvKioKICAgICAqIE1heGltdW0gKHJlYWQ6IHBvc2l0aXZlIG1heCkgZm9yY2UgdG8gYmUgYXBwbGllZCBieSB0aGUgY29uc3RyYWludC4KICAgICAqLwoKICAgIC8qKgogICAgICogU1BPT0sgcGFyYW1ldGVyCiAgICAgKi8KCiAgICAvKioKICAgICAqIFNQT09LIHBhcmFtZXRlcgogICAgICovCgogICAgLyoqCiAgICAgKiBTUE9PSyBwYXJhbWV0ZXIKICAgICAqLwoKICAgIC8qKgogICAgICogQSBudW1iZXIsIHByb3BvcnRpb25hbCB0byB0aGUgZm9yY2UgYWRkZWQgdG8gdGhlIGJvZGllcy4KICAgICAqLwogICAgY29uc3RydWN0b3IoYmksIGJqLCBtaW5Gb3JjZSwgbWF4Rm9yY2UpIHsKICAgICAgaWYgKG1pbkZvcmNlID09PSB2b2lkIDApIHsKICAgICAgICBtaW5Gb3JjZSA9IC0xZTY7CiAgICAgIH0KCiAgICAgIGlmIChtYXhGb3JjZSA9PT0gdm9pZCAwKSB7CiAgICAgICAgbWF4Rm9yY2UgPSAxZTY7CiAgICAgIH0KCiAgICAgIHRoaXMuaWQgPSBFcXVhdGlvbi5pZENvdW50ZXIrKzsKICAgICAgdGhpcy5taW5Gb3JjZSA9IG1pbkZvcmNlOwogICAgICB0aGlzLm1heEZvcmNlID0gbWF4Rm9yY2U7CiAgICAgIHRoaXMuYmkgPSBiaTsKICAgICAgdGhpcy5iaiA9IGJqOwogICAgICB0aGlzLmEgPSAwLjA7IC8vIFNQT09LIHBhcmFtZXRlcgoKICAgICAgdGhpcy5iID0gMC4wOyAvLyBTUE9PSyBwYXJhbWV0ZXIKCiAgICAgIHRoaXMuZXBzID0gMC4wOyAvLyBTUE9PSyBwYXJhbWV0ZXIKCiAgICAgIHRoaXMuamFjb2JpYW5FbGVtZW50QSA9IG5ldyBKYWNvYmlhbkVsZW1lbnQoKTsKICAgICAgdGhpcy5qYWNvYmlhbkVsZW1lbnRCID0gbmV3IEphY29iaWFuRWxlbWVudCgpOwogICAgICB0aGlzLmVuYWJsZWQgPSB0cnVlOwogICAgICB0aGlzLm11bHRpcGxpZXIgPSAwOwogICAgICB0aGlzLnNldFNwb29rUGFyYW1zKDFlNywgNCwgMSAvIDYwKTsgLy8gU2V0IHR5cGljYWwgc3Bvb2sgcGFyYW1zCiAgICB9CiAgICAvKioKICAgICAqIFJlY2FsY3VsYXRlcyBhLCBiLCBhbmQgZXBzLgogICAgICoKICAgICAqIFRoZSBFcXVhdGlvbiBjb25zdHJ1Y3RvciBzZXRzIHR5cGljYWwgU1BPT0sgcGFyYW1ldGVycyBhcyBzdWNoOgogICAgICogKiBgc3RpZmZuZXNzYCA9IDFlNwogICAgICogKiBgcmVsYXhhdGlvbmAgPSA0CiAgICAgKiAqIGB0aW1lU3RlcGA9IDEgLyA2MCwgX25vdGUgdGhlIGhhcmRjb2RlZCByZWZyZXNoIHJhdGUuXwogICAgICovCgoKICAgIHNldFNwb29rUGFyYW1zKHN0aWZmbmVzcywgcmVsYXhhdGlvbiwgdGltZVN0ZXApIHsKICAgICAgY29uc3QgZCA9IHJlbGF4YXRpb247CiAgICAgIGNvbnN0IGsgPSBzdGlmZm5lc3M7CiAgICAgIGNvbnN0IGggPSB0aW1lU3RlcDsKICAgICAgdGhpcy5hID0gNC4wIC8gKGggKiAoMSArIDQgKiBkKSk7CiAgICAgIHRoaXMuYiA9IDQuMCAqIGQgLyAoMSArIDQgKiBkKTsKICAgICAgdGhpcy5lcHMgPSA0LjAgLyAoaCAqIGggKiBrICogKDEgKyA0ICogZCkpOwogICAgfQogICAgLyoqCiAgICAgKiBDb21wdXRlcyB0aGUgcmlnaHQgaGFuZCBzaWRlIG9mIHRoZSBTUE9PSyBlcXVhdGlvbgogICAgICovCgoKICAgIGNvbXB1dGVCKGEsIGIsIGgpIHsKICAgICAgY29uc3QgR1cgPSB0aGlzLmNvbXB1dGVHVygpOwogICAgICBjb25zdCBHcSA9IHRoaXMuY29tcHV0ZUdxKCk7CiAgICAgIGNvbnN0IEdpTWYgPSB0aGlzLmNvbXB1dGVHaU1mKCk7CiAgICAgIHJldHVybiAtR3EgKiBhIC0gR1cgKiBiIC0gR2lNZiAqIGg7CiAgICB9CiAgICAvKioKICAgICAqIENvbXB1dGVzIEcqcSwgd2hlcmUgcSBhcmUgdGhlIGdlbmVyYWxpemVkIGJvZHkgY29vcmRpbmF0ZXMKICAgICAqLwoKCiAgICBjb21wdXRlR3EoKSB7CiAgICAgIGNvbnN0IEdBID0gdGhpcy5qYWNvYmlhbkVsZW1lbnRBOwogICAgICBjb25zdCBHQiA9IHRoaXMuamFjb2JpYW5FbGVtZW50QjsKICAgICAgY29uc3QgYmkgPSB0aGlzLmJpOwogICAgICBjb25zdCBiaiA9IHRoaXMuYmo7CiAgICAgIGNvbnN0IHhpID0gYmkucG9zaXRpb247CiAgICAgIGNvbnN0IHhqID0gYmoucG9zaXRpb247CiAgICAgIHJldHVybiBHQS5zcGF0aWFsLmRvdCh4aSkgKyBHQi5zcGF0aWFsLmRvdCh4aik7CiAgICB9CiAgICAvKioKICAgICAqIENvbXB1dGVzIEcqVywgd2hlcmUgVyBhcmUgdGhlIGJvZHkgdmVsb2NpdGllcwogICAgICovCgoKICAgIGNvbXB1dGVHVygpIHsKICAgICAgY29uc3QgR0EgPSB0aGlzLmphY29iaWFuRWxlbWVudEE7CiAgICAgIGNvbnN0IEdCID0gdGhpcy5qYWNvYmlhbkVsZW1lbnRCOwogICAgICBjb25zdCBiaSA9IHRoaXMuYmk7CiAgICAgIGNvbnN0IGJqID0gdGhpcy5iajsKICAgICAgY29uc3QgdmkgPSBiaS52ZWxvY2l0eTsKICAgICAgY29uc3QgdmogPSBiai52ZWxvY2l0eTsKICAgICAgY29uc3Qgd2kgPSBiaS5hbmd1bGFyVmVsb2NpdHk7CiAgICAgIGNvbnN0IHdqID0gYmouYW5ndWxhclZlbG9jaXR5OwogICAgICByZXR1cm4gR0EubXVsdGlwbHlWZWN0b3JzKHZpLCB3aSkgKyBHQi5tdWx0aXBseVZlY3RvcnModmosIHdqKTsKICAgIH0KICAgIC8qKgogICAgICogQ29tcHV0ZXMgRypXbGFtYmRhLCB3aGVyZSBXIGFyZSB0aGUgYm9keSB2ZWxvY2l0aWVzCiAgICAgKi8KCgogICAgY29tcHV0ZUdXbGFtYmRhKCkgewogICAgICBjb25zdCBHQSA9IHRoaXMuamFjb2JpYW5FbGVtZW50QTsKICAgICAgY29uc3QgR0IgPSB0aGlzLmphY29iaWFuRWxlbWVudEI7CiAgICAgIGNvbnN0IGJpID0gdGhpcy5iaTsKICAgICAgY29uc3QgYmogPSB0aGlzLmJqOwogICAgICBjb25zdCB2aSA9IGJpLnZsYW1iZGE7CiAgICAgIGNvbnN0IHZqID0gYmoudmxhbWJkYTsKICAgICAgY29uc3Qgd2kgPSBiaS53bGFtYmRhOwogICAgICBjb25zdCB3aiA9IGJqLndsYW1iZGE7CiAgICAgIHJldHVybiBHQS5tdWx0aXBseVZlY3RvcnModmksIHdpKSArIEdCLm11bHRpcGx5VmVjdG9ycyh2aiwgd2opOwogICAgfQogICAgLyoqCiAgICAgKiBDb21wdXRlcyBHKmludihNKSpmLCB3aGVyZSBNIGlzIHRoZSBtYXNzIG1hdHJpeCB3aXRoIGRpYWdvbmFsIGJsb2NrcyBmb3IgZWFjaCBib2R5LCBhbmQgZiBhcmUgdGhlIGZvcmNlcyBvbiB0aGUgYm9kaWVzLgogICAgICovCgoKICAgIGNvbXB1dGVHaU1mKCkgewogICAgICBjb25zdCBHQSA9IHRoaXMuamFjb2JpYW5FbGVtZW50QTsKICAgICAgY29uc3QgR0IgPSB0aGlzLmphY29iaWFuRWxlbWVudEI7CiAgICAgIGNvbnN0IGJpID0gdGhpcy5iaTsKICAgICAgY29uc3QgYmogPSB0aGlzLmJqOwogICAgICBjb25zdCBmaSA9IGJpLmZvcmNlOwogICAgICBjb25zdCB0aSA9IGJpLnRvcnF1ZTsKICAgICAgY29uc3QgZmogPSBiai5mb3JjZTsKICAgICAgY29uc3QgdGogPSBiai50b3JxdWU7CiAgICAgIGNvbnN0IGludk1hc3NpID0gYmkuaW52TWFzc1NvbHZlOwogICAgICBjb25zdCBpbnZNYXNzaiA9IGJqLmludk1hc3NTb2x2ZTsKICAgICAgZmkuc2NhbGUoaW52TWFzc2ksIGlNZmkpOwogICAgICBmai5zY2FsZShpbnZNYXNzaiwgaU1maik7CiAgICAgIGJpLmludkluZXJ0aWFXb3JsZFNvbHZlLnZtdWx0KHRpLCBpbnZJaV92bXVsdF90YXVpKTsKICAgICAgYmouaW52SW5lcnRpYVdvcmxkU29sdmUudm11bHQodGosIGludklqX3ZtdWx0X3RhdWopOwogICAgICByZXR1cm4gR0EubXVsdGlwbHlWZWN0b3JzKGlNZmksIGludklpX3ZtdWx0X3RhdWkpICsgR0IubXVsdGlwbHlWZWN0b3JzKGlNZmosIGludklqX3ZtdWx0X3RhdWopOwogICAgfQogICAgLyoqCiAgICAgKiBDb21wdXRlcyBHKmludihNKSpHJwogICAgICovCgoKICAgIGNvbXB1dGVHaU1HdCgpIHsKICAgICAgY29uc3QgR0EgPSB0aGlzLmphY29iaWFuRWxlbWVudEE7CiAgICAgIGNvbnN0IEdCID0gdGhpcy5qYWNvYmlhbkVsZW1lbnRCOwogICAgICBjb25zdCBiaSA9IHRoaXMuYmk7CiAgICAgIGNvbnN0IGJqID0gdGhpcy5iajsKICAgICAgY29uc3QgaW52TWFzc2kgPSBiaS5pbnZNYXNzU29sdmU7CiAgICAgIGNvbnN0IGludk1hc3NqID0gYmouaW52TWFzc1NvbHZlOwogICAgICBjb25zdCBpbnZJaSA9IGJpLmludkluZXJ0aWFXb3JsZFNvbHZlOwogICAgICBjb25zdCBpbnZJaiA9IGJqLmludkluZXJ0aWFXb3JsZFNvbHZlOwogICAgICBsZXQgcmVzdWx0ID0gaW52TWFzc2kgKyBpbnZNYXNzajsKICAgICAgaW52SWkudm11bHQoR0Eucm90YXRpb25hbCwgdG1wKTsKICAgICAgcmVzdWx0ICs9IHRtcC5kb3QoR0Eucm90YXRpb25hbCk7CiAgICAgIGludklqLnZtdWx0KEdCLnJvdGF0aW9uYWwsIHRtcCk7CiAgICAgIHJlc3VsdCArPSB0bXAuZG90KEdCLnJvdGF0aW9uYWwpOwogICAgICByZXR1cm4gcmVzdWx0OwogICAgfQogICAgLyoqCiAgICAgKiBBZGQgY29uc3RyYWludCB2ZWxvY2l0eSB0byB0aGUgYm9kaWVzLgogICAgICovCgoKICAgIGFkZFRvV2xhbWJkYShkZWx0YWxhbWJkYSkgewogICAgICBjb25zdCBHQSA9IHRoaXMuamFjb2JpYW5FbGVtZW50QTsKICAgICAgY29uc3QgR0IgPSB0aGlzLmphY29iaWFuRWxlbWVudEI7CiAgICAgIGNvbnN0IGJpID0gdGhpcy5iaTsKICAgICAgY29uc3QgYmogPSB0aGlzLmJqOwogICAgICBjb25zdCB0ZW1wID0gYWRkVG9XbGFtYmRhX3RlbXA7IC8vIEFkZCB0byBsaW5lYXIgdmVsb2NpdHkKICAgICAgLy8gdl9sYW1iZGEgKz0gaW52KE0pICogZGVsdGFfbGFtYmEgKiBHCgogICAgICBiaS52bGFtYmRhLmFkZFNjYWxlZFZlY3RvcihiaS5pbnZNYXNzU29sdmUgKiBkZWx0YWxhbWJkYSwgR0Euc3BhdGlhbCwgYmkudmxhbWJkYSk7CiAgICAgIGJqLnZsYW1iZGEuYWRkU2NhbGVkVmVjdG9yKGJqLmludk1hc3NTb2x2ZSAqIGRlbHRhbGFtYmRhLCBHQi5zcGF0aWFsLCBiai52bGFtYmRhKTsgLy8gQWRkIHRvIGFuZ3VsYXIgdmVsb2NpdHkKCiAgICAgIGJpLmludkluZXJ0aWFXb3JsZFNvbHZlLnZtdWx0KEdBLnJvdGF0aW9uYWwsIHRlbXApOwogICAgICBiaS53bGFtYmRhLmFkZFNjYWxlZFZlY3RvcihkZWx0YWxhbWJkYSwgdGVtcCwgYmkud2xhbWJkYSk7CiAgICAgIGJqLmludkluZXJ0aWFXb3JsZFNvbHZlLnZtdWx0KEdCLnJvdGF0aW9uYWwsIHRlbXApOwogICAgICBiai53bGFtYmRhLmFkZFNjYWxlZFZlY3RvcihkZWx0YWxhbWJkYSwgdGVtcCwgYmoud2xhbWJkYSk7CiAgICB9CiAgICAvKioKICAgICAqIENvbXB1dGUgdGhlIGRlbm9taW5hdG9yIHBhcnQgb2YgdGhlIFNQT09LIGVxdWF0aW9uOiBDID0gRyppbnYoTSkqRycgKyBlcHMKICAgICAqLwoKCiAgICBjb21wdXRlQygpIHsKICAgICAgcmV0dXJuIHRoaXMuY29tcHV0ZUdpTUd0KCkgKyB0aGlzLmVwczsKICAgIH0KCiAgfQogIEVxdWF0aW9uLmlkQ291bnRlciA9IDA7CiAgY29uc3QgaU1maSA9IG5ldyBWZWMzKCk7CiAgY29uc3QgaU1maiA9IG5ldyBWZWMzKCk7CiAgY29uc3QgaW52SWlfdm11bHRfdGF1aSA9IG5ldyBWZWMzKCk7CiAgY29uc3QgaW52SWpfdm11bHRfdGF1aiA9IG5ldyBWZWMzKCk7CiAgY29uc3QgdG1wID0gbmV3IFZlYzMoKTsKICBjb25zdCBhZGRUb1dsYW1iZGFfdGVtcCA9IG5ldyBWZWMzKCk7CgogIC8qKgogICAqIENvbnRhY3Qvbm9uLXBlbmV0cmF0aW9uIGNvbnN0cmFpbnQgZXF1YXRpb24KICAgKi8KICBjbGFzcyBDb250YWN0RXF1YXRpb24gZXh0ZW5kcyBFcXVhdGlvbiB7CiAgICAvKioKICAgICAqICJib3VuY2luZXNzIjogdTEgPSAtZSp1MAogICAgICovCgogICAgLyoqCiAgICAgKiBXb3JsZC1vcmllbnRlZCB2ZWN0b3IgdGhhdCBnb2VzIGZyb20gdGhlIGNlbnRlciBvZiBiaSB0byB0aGUgY29udGFjdCBwb2ludC4KICAgICAqLwoKICAgIC8qKgogICAgICogV29ybGQtb3JpZW50ZWQgdmVjdG9yIHRoYXQgc3RhcnRzIGluIGJvZHkgaiBwb3NpdGlvbiBhbmQgZ29lcyB0byB0aGUgY29udGFjdCBwb2ludC4KICAgICAqLwoKICAgIC8qKgogICAgICogQ29udGFjdCBub3JtYWwsIHBvaW50aW5nIG91dCBvZiBib2R5IGkuCiAgICAgKi8KICAgIGNvbnN0cnVjdG9yKGJvZHlBLCBib2R5QiwgbWF4Rm9yY2UpIHsKICAgICAgaWYgKG1heEZvcmNlID09PSB2b2lkIDApIHsKICAgICAgICBtYXhGb3JjZSA9IDFlNjsKICAgICAgfQoKICAgICAgc3VwZXIoYm9keUEsIGJvZHlCLCAwLCBtYXhGb3JjZSk7CiAgICAgIHRoaXMucmVzdGl0dXRpb24gPSAwLjA7CiAgICAgIHRoaXMucmkgPSBuZXcgVmVjMygpOwogICAgICB0aGlzLnJqID0gbmV3IFZlYzMoKTsKICAgICAgdGhpcy5uaSA9IG5ldyBWZWMzKCk7CiAgICB9CgogICAgY29tcHV0ZUIoaCkgewogICAgICBjb25zdCBhID0gdGhpcy5hOwogICAgICBjb25zdCBiID0gdGhpcy5iOwogICAgICBjb25zdCBiaSA9IHRoaXMuYmk7CiAgICAgIGNvbnN0IGJqID0gdGhpcy5iajsKICAgICAgY29uc3QgcmkgPSB0aGlzLnJpOwogICAgICBjb25zdCByaiA9IHRoaXMucmo7CiAgICAgIGNvbnN0IHJpeG4gPSBDb250YWN0RXF1YXRpb25fY29tcHV0ZUJfdGVtcDE7CiAgICAgIGNvbnN0IHJqeG4gPSBDb250YWN0RXF1YXRpb25fY29tcHV0ZUJfdGVtcDI7CiAgICAgIGNvbnN0IHZpID0gYmkudmVsb2NpdHk7CiAgICAgIGNvbnN0IHdpID0gYmkuYW5ndWxhclZlbG9jaXR5OwogICAgICBiaS5mb3JjZTsKICAgICAgYmkudG9ycXVlOwogICAgICBjb25zdCB2aiA9IGJqLnZlbG9jaXR5OwogICAgICBjb25zdCB3aiA9IGJqLmFuZ3VsYXJWZWxvY2l0eTsKICAgICAgYmouZm9yY2U7CiAgICAgIGJqLnRvcnF1ZTsKICAgICAgY29uc3QgcGVuZXRyYXRpb25WZWMgPSBDb250YWN0RXF1YXRpb25fY29tcHV0ZUJfdGVtcDM7CiAgICAgIGNvbnN0IEdBID0gdGhpcy5qYWNvYmlhbkVsZW1lbnRBOwogICAgICBjb25zdCBHQiA9IHRoaXMuamFjb2JpYW5FbGVtZW50QjsKICAgICAgY29uc3QgbiA9IHRoaXMubmk7IC8vIENhbHVjbGF0ZSBjcm9zcyBwcm9kdWN0cwoKICAgICAgcmkuY3Jvc3Mobiwgcml4bik7CiAgICAgIHJqLmNyb3NzKG4sIHJqeG4pOyAvLyBnID0geGorcmogLSh4aStyaSkKICAgICAgLy8gRyA9IFsgLW5pICAtcml4biAgbmkgIHJqeG4gXQoKICAgICAgbi5uZWdhdGUoR0Euc3BhdGlhbCk7CiAgICAgIHJpeG4ubmVnYXRlKEdBLnJvdGF0aW9uYWwpOwogICAgICBHQi5zcGF0aWFsLmNvcHkobik7CiAgICAgIEdCLnJvdGF0aW9uYWwuY29weShyanhuKTsgLy8gQ2FsY3VsYXRlIHRoZSBwZW5ldHJhdGlvbiB2ZWN0b3IKCiAgICAgIHBlbmV0cmF0aW9uVmVjLmNvcHkoYmoucG9zaXRpb24pOwogICAgICBwZW5ldHJhdGlvblZlYy52YWRkKHJqLCBwZW5ldHJhdGlvblZlYyk7CiAgICAgIHBlbmV0cmF0aW9uVmVjLnZzdWIoYmkucG9zaXRpb24sIHBlbmV0cmF0aW9uVmVjKTsKICAgICAgcGVuZXRyYXRpb25WZWMudnN1YihyaSwgcGVuZXRyYXRpb25WZWMpOwogICAgICBjb25zdCBnID0gbi5kb3QocGVuZXRyYXRpb25WZWMpOyAvLyBDb21wdXRlIGl0ZXJhdGlvbgoKICAgICAgY29uc3QgZVBsdXNPbmUgPSB0aGlzLnJlc3RpdHV0aW9uICsgMTsKICAgICAgY29uc3QgR1cgPSBlUGx1c09uZSAqIHZqLmRvdChuKSAtIGVQbHVzT25lICogdmkuZG90KG4pICsgd2ouZG90KHJqeG4pIC0gd2kuZG90KHJpeG4pOwogICAgICBjb25zdCBHaU1mID0gdGhpcy5jb21wdXRlR2lNZigpOwogICAgICBjb25zdCBCID0gLWcgKiBhIC0gR1cgKiBiIC0gaCAqIEdpTWY7CiAgICAgIHJldHVybiBCOwogICAgfQogICAgLyoqCiAgICAgKiBHZXQgdGhlIGN1cnJlbnQgcmVsYXRpdmUgdmVsb2NpdHkgaW4gdGhlIGNvbnRhY3QgcG9pbnQuCiAgICAgKi8KCgogICAgZ2V0SW1wYWN0VmVsb2NpdHlBbG9uZ05vcm1hbCgpIHsKICAgICAgY29uc3QgdmkgPSBDb250YWN0RXF1YXRpb25fZ2V0SW1wYWN0VmVsb2NpdHlBbG9uZ05vcm1hbF92aTsKICAgICAgY29uc3QgdmogPSBDb250YWN0RXF1YXRpb25fZ2V0SW1wYWN0VmVsb2NpdHlBbG9uZ05vcm1hbF92ajsKICAgICAgY29uc3QgeGkgPSBDb250YWN0RXF1YXRpb25fZ2V0SW1wYWN0VmVsb2NpdHlBbG9uZ05vcm1hbF94aTsKICAgICAgY29uc3QgeGogPSBDb250YWN0RXF1YXRpb25fZ2V0SW1wYWN0VmVsb2NpdHlBbG9uZ05vcm1hbF94ajsKICAgICAgY29uc3QgcmVsVmVsID0gQ29udGFjdEVxdWF0aW9uX2dldEltcGFjdFZlbG9jaXR5QWxvbmdOb3JtYWxfcmVsVmVsOwogICAgICB0aGlzLmJpLnBvc2l0aW9uLnZhZGQodGhpcy5yaSwgeGkpOwogICAgICB0aGlzLmJqLnBvc2l0aW9uLnZhZGQodGhpcy5yaiwgeGopOwogICAgICB0aGlzLmJpLmdldFZlbG9jaXR5QXRXb3JsZFBvaW50KHhpLCB2aSk7CiAgICAgIHRoaXMuYmouZ2V0VmVsb2NpdHlBdFdvcmxkUG9pbnQoeGosIHZqKTsKICAgICAgdmkudnN1Yih2aiwgcmVsVmVsKTsKICAgICAgcmV0dXJuIHRoaXMubmkuZG90KHJlbFZlbCk7CiAgICB9CgogIH0KICBjb25zdCBDb250YWN0RXF1YXRpb25fY29tcHV0ZUJfdGVtcDEgPSBuZXcgVmVjMygpOyAvLyBUZW1wIHZlY3RvcnMKCiAgY29uc3QgQ29udGFjdEVxdWF0aW9uX2NvbXB1dGVCX3RlbXAyID0gbmV3IFZlYzMoKTsKICBjb25zdCBDb250YWN0RXF1YXRpb25fY29tcHV0ZUJfdGVtcDMgPSBuZXcgVmVjMygpOwogIGNvbnN0IENvbnRhY3RFcXVhdGlvbl9nZXRJbXBhY3RWZWxvY2l0eUFsb25nTm9ybWFsX3ZpID0gbmV3IFZlYzMoKTsKICBjb25zdCBDb250YWN0RXF1YXRpb25fZ2V0SW1wYWN0VmVsb2NpdHlBbG9uZ05vcm1hbF92aiA9IG5ldyBWZWMzKCk7CiAgY29uc3QgQ29udGFjdEVxdWF0aW9uX2dldEltcGFjdFZlbG9jaXR5QWxvbmdOb3JtYWxfeGkgPSBuZXcgVmVjMygpOwogIGNvbnN0IENvbnRhY3RFcXVhdGlvbl9nZXRJbXBhY3RWZWxvY2l0eUFsb25nTm9ybWFsX3hqID0gbmV3IFZlYzMoKTsKICBjb25zdCBDb250YWN0RXF1YXRpb25fZ2V0SW1wYWN0VmVsb2NpdHlBbG9uZ05vcm1hbF9yZWxWZWwgPSBuZXcgVmVjMygpOwoKICAvKioKICAgKiBDb25uZWN0cyB0d28gYm9kaWVzIGF0IGdpdmVuIG9mZnNldCBwb2ludHMuCiAgICogQGV4YW1wbGUKICAgKiAgICAgY29uc3QgYm9keUEgPSBuZXcgQm9keSh7IG1hc3M6IDEgfSkKICAgKiAgICAgY29uc3QgYm9keUIgPSBuZXcgQm9keSh7IG1hc3M6IDEgfSkKICAgKiAgICAgYm9keUEucG9zaXRpb24uc2V0KC0xLCAwLCAwKQogICAqICAgICBib2R5Qi5wb3NpdGlvbi5zZXQoMSwgMCwgMCkKICAgKiAgICAgYm9keUEuYWRkU2hhcGUoc2hhcGVBKQogICAqICAgICBib2R5Qi5hZGRTaGFwZShzaGFwZUIpCiAgICogICAgIHdvcmxkLmFkZEJvZHkoYm9keUEpCiAgICogICAgIHdvcmxkLmFkZEJvZHkoYm9keUIpCiAgICogICAgIGNvbnN0IGxvY2FsUGl2b3RBID0gbmV3IFZlYzMoMSwgMCwgMCkKICAgKiAgICAgY29uc3QgbG9jYWxQaXZvdEIgPSBuZXcgVmVjMygtMSwgMCwgMCkKICAgKiAgICAgY29uc3QgY29uc3RyYWludCA9IG5ldyBQb2ludFRvUG9pbnRDb25zdHJhaW50KGJvZHlBLCBsb2NhbFBpdm90QSwgYm9keUIsIGxvY2FsUGl2b3RCKQogICAqICAgICB3b3JsZC5hZGRDb25zdHJhaW50KGNvbnN0cmFpbnQpCiAgICovCiAgY2xhc3MgUG9pbnRUb1BvaW50Q29uc3RyYWludCBleHRlbmRzIENvbnN0cmFpbnQgewogICAgLyoqCiAgICAgKiBQaXZvdCwgZGVmaW5lZCBsb2NhbGx5IGluIGJvZHlBLgogICAgICovCgogICAgLyoqCiAgICAgKiBQaXZvdCwgZGVmaW5lZCBsb2NhbGx5IGluIGJvZHlCLgogICAgICovCgogICAgLyoqCiAgICAgKiBAcGFyYW0gcGl2b3RBIFRoZSBwb2ludCByZWxhdGl2ZSB0byB0aGUgY2VudGVyIG9mIG1hc3Mgb2YgYm9keUEgd2hpY2ggYm9keUEgaXMgY29uc3RyYWluZWQgdG8uCiAgICAgKiBAcGFyYW0gYm9keUIgQm9keSB0aGF0IHdpbGwgYmUgY29uc3RyYWluZWQgaW4gYSBzaW1pbGFyIHdheSB0byB0aGUgc2FtZSBwb2ludCBhcyBib2R5QS4gV2Ugd2lsbCB0aGVyZWZvcmUgZ2V0IGEgbGluayBiZXR3ZWVuIGJvZHlBIGFuZCBib2R5Qi4gSWYgbm90IHNwZWNpZmllZCwgYm9keUEgd2lsbCBiZSBjb25zdHJhaW5lZCB0byBhIHN0YXRpYyBwb2ludC4KICAgICAqIEBwYXJhbSBwaXZvdEIgVGhlIHBvaW50IHJlbGF0aXZlIHRvIHRoZSBjZW50ZXIgb2YgbWFzcyBvZiBib2R5QiB3aGljaCBib2R5QiBpcyBjb25zdHJhaW5lZCB0by4KICAgICAqIEBwYXJhbSBtYXhGb3JjZSBUaGUgbWF4aW11bSBmb3JjZSB0aGF0IHNob3VsZCBiZSBhcHBsaWVkIHRvIGNvbnN0cmFpbiB0aGUgYm9kaWVzLgogICAgICovCiAgICBjb25zdHJ1Y3Rvcihib2R5QSwgcGl2b3RBLCBib2R5QiwgcGl2b3RCLCBtYXhGb3JjZSkgewogICAgICBpZiAocGl2b3RBID09PSB2b2lkIDApIHsKICAgICAgICBwaXZvdEEgPSBuZXcgVmVjMygpOwogICAgICB9CgogICAgICBpZiAocGl2b3RCID09PSB2b2lkIDApIHsKICAgICAgICBwaXZvdEIgPSBuZXcgVmVjMygpOwogICAgICB9CgogICAgICBpZiAobWF4Rm9yY2UgPT09IHZvaWQgMCkgewogICAgICAgIG1heEZvcmNlID0gMWU2OwogICAgICB9CgogICAgICBzdXBlcihib2R5QSwgYm9keUIpOwogICAgICB0aGlzLnBpdm90QSA9IHBpdm90QS5jbG9uZSgpOwogICAgICB0aGlzLnBpdm90QiA9IHBpdm90Qi5jbG9uZSgpOwogICAgICBjb25zdCB4ID0gdGhpcy5lcXVhdGlvblggPSBuZXcgQ29udGFjdEVxdWF0aW9uKGJvZHlBLCBib2R5Qik7CiAgICAgIGNvbnN0IHkgPSB0aGlzLmVxdWF0aW9uWSA9IG5ldyBDb250YWN0RXF1YXRpb24oYm9keUEsIGJvZHlCKTsKICAgICAgY29uc3QgeiA9IHRoaXMuZXF1YXRpb25aID0gbmV3IENvbnRhY3RFcXVhdGlvbihib2R5QSwgYm9keUIpOyAvLyBFcXVhdGlvbnMgdG8gYmUgZmVkIHRvIHRoZSBzb2x2ZXIKCiAgICAgIHRoaXMuZXF1YXRpb25zLnB1c2goeCwgeSwgeik7IC8vIE1ha2UgdGhlIGVxdWF0aW9ucyBiaWRpcmVjdGlvbmFsCgogICAgICB4Lm1pbkZvcmNlID0geS5taW5Gb3JjZSA9IHoubWluRm9yY2UgPSAtbWF4Rm9yY2U7CiAgICAgIHgubWF4Rm9yY2UgPSB5Lm1heEZvcmNlID0gei5tYXhGb3JjZSA9IG1heEZvcmNlOwogICAgICB4Lm5pLnNldCgxLCAwLCAwKTsKICAgICAgeS5uaS5zZXQoMCwgMSwgMCk7CiAgICAgIHoubmkuc2V0KDAsIDAsIDEpOwogICAgfQoKICAgIHVwZGF0ZSgpIHsKICAgICAgY29uc3QgYm9keUEgPSB0aGlzLmJvZHlBOwogICAgICBjb25zdCBib2R5QiA9IHRoaXMuYm9keUI7CiAgICAgIGNvbnN0IHggPSB0aGlzLmVxdWF0aW9uWDsKICAgICAgY29uc3QgeSA9IHRoaXMuZXF1YXRpb25ZOwogICAgICBjb25zdCB6ID0gdGhpcy5lcXVhdGlvblo7IC8vIFJvdGF0ZSB0aGUgcGl2b3RzIHRvIHdvcmxkIHNwYWNlCgogICAgICBib2R5QS5xdWF0ZXJuaW9uLnZtdWx0KHRoaXMucGl2b3RBLCB4LnJpKTsKICAgICAgYm9keUIucXVhdGVybmlvbi52bXVsdCh0aGlzLnBpdm90QiwgeC5yaik7CiAgICAgIHkucmkuY29weSh4LnJpKTsKICAgICAgeS5yai5jb3B5KHgucmopOwogICAgICB6LnJpLmNvcHkoeC5yaSk7CiAgICAgIHoucmouY29weSh4LnJqKTsKICAgIH0KCiAgfQoKICAvKioKICAgKiBDb25lIGVxdWF0aW9uLiBXb3JrcyB0byBrZWVwIHRoZSBnaXZlbiBib2R5IHdvcmxkIHZlY3RvcnMgYWxpZ25lZCwgb3IgdGlsdGVkIHdpdGhpbiBhIGdpdmVuIGFuZ2xlIGZyb20gZWFjaCBvdGhlci4KICAgKi8KICBjbGFzcyBDb25lRXF1YXRpb24gZXh0ZW5kcyBFcXVhdGlvbiB7CiAgICAvKioKICAgICAqIExvY2FsIGF4aXMgaW4gQQogICAgICovCgogICAgLyoqCiAgICAgKiBMb2NhbCBheGlzIGluIEIKICAgICAqLwoKICAgIC8qKgogICAgICogVGhlICJjb25lIGFuZ2xlIiB0byBrZWVwCiAgICAgKi8KICAgIGNvbnN0cnVjdG9yKGJvZHlBLCBib2R5Qiwgb3B0aW9ucykgewogICAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7CiAgICAgICAgb3B0aW9ucyA9IHt9OwogICAgICB9CgogICAgICBjb25zdCBtYXhGb3JjZSA9IHR5cGVvZiBvcHRpb25zLm1heEZvcmNlICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMubWF4Rm9yY2UgOiAxZTY7CiAgICAgIHN1cGVyKGJvZHlBLCBib2R5QiwgLW1heEZvcmNlLCBtYXhGb3JjZSk7CiAgICAgIHRoaXMuYXhpc0EgPSBvcHRpb25zLmF4aXNBID8gb3B0aW9ucy5heGlzQS5jbG9uZSgpIDogbmV3IFZlYzMoMSwgMCwgMCk7CiAgICAgIHRoaXMuYXhpc0IgPSBvcHRpb25zLmF4aXNCID8gb3B0aW9ucy5heGlzQi5jbG9uZSgpIDogbmV3IFZlYzMoMCwgMSwgMCk7CiAgICAgIHRoaXMuYW5nbGUgPSB0eXBlb2Ygb3B0aW9ucy5hbmdsZSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmFuZ2xlIDogMDsKICAgIH0KCiAgICBjb21wdXRlQihoKSB7CiAgICAgIGNvbnN0IGEgPSB0aGlzLmE7CiAgICAgIGNvbnN0IGIgPSB0aGlzLmI7CiAgICAgIGNvbnN0IG5pID0gdGhpcy5heGlzQTsKICAgICAgY29uc3QgbmogPSB0aGlzLmF4aXNCOwogICAgICBjb25zdCBuaXhuaiA9IHRtcFZlYzEkMjsKICAgICAgY29uc3Qgbmp4bmkgPSB0bXBWZWMyJDI7CiAgICAgIGNvbnN0IEdBID0gdGhpcy5qYWNvYmlhbkVsZW1lbnRBOwogICAgICBjb25zdCBHQiA9IHRoaXMuamFjb2JpYW5FbGVtZW50QjsgLy8gQ2FsdWNsYXRlIGNyb3NzIHByb2R1Y3RzCgogICAgICBuaS5jcm9zcyhuaiwgbml4bmopOwogICAgICBuai5jcm9zcyhuaSwgbmp4bmkpOyAvLyBUaGUgYW5nbGUgYmV0d2VlbiB0d28gdmVjdG9yIGlzOgogICAgICAvLyBjb3ModGhldGEpID0gYSAqIGIgLyAobGVuZ3RoKGEpICogbGVuZ3RoKGIpID0geyBsZW4oYSkgPSBsZW4oYikgPSAxIH0gPSBhICogYgogICAgICAvLyBnID0gYSAqIGIKICAgICAgLy8gZ2RvdCA9IChiIHggYSkgKiB3aSArIChhIHggYikgKiB3agogICAgICAvLyBHID0gWzAgYnhhIDAgYXhiXQogICAgICAvLyBXID0gW3ZpIHdpIHZqIHdqXQoKICAgICAgR0Eucm90YXRpb25hbC5jb3B5KG5qeG5pKTsKICAgICAgR0Iucm90YXRpb25hbC5jb3B5KG5peG5qKTsKICAgICAgY29uc3QgZyA9IE1hdGguY29zKHRoaXMuYW5nbGUpIC0gbmkuZG90KG5qKTsKICAgICAgY29uc3QgR1cgPSB0aGlzLmNvbXB1dGVHVygpOwogICAgICBjb25zdCBHaU1mID0gdGhpcy5jb21wdXRlR2lNZigpOwogICAgICBjb25zdCBCID0gLWcgKiBhIC0gR1cgKiBiIC0gaCAqIEdpTWY7CiAgICAgIHJldHVybiBCOwogICAgfQoKICB9CiAgY29uc3QgdG1wVmVjMSQyID0gbmV3IFZlYzMoKTsKICBjb25zdCB0bXBWZWMyJDIgPSBuZXcgVmVjMygpOwoKICAvKioKICAgKiBSb3RhdGlvbmFsIGNvbnN0cmFpbnQuIFdvcmtzIHRvIGtlZXAgdGhlIGxvY2FsIHZlY3RvcnMgb3J0aG9nb25hbCB0byBlYWNoIG90aGVyIGluIHdvcmxkIHNwYWNlLgogICAqLwogIGNsYXNzIFJvdGF0aW9uYWxFcXVhdGlvbiBleHRlbmRzIEVxdWF0aW9uIHsKICAgIC8qKgogICAgICogV29ybGQgb3JpZW50ZWQgcm90YXRpb25hbCBheGlzLgogICAgICovCgogICAgLyoqCiAgICAgKiBXb3JsZCBvcmllbnRlZCByb3RhdGlvbmFsIGF4aXMuCiAgICAgKi8KCiAgICAvKioKICAgICAqIG1heEFuZ2xlCiAgICAgKi8KICAgIGNvbnN0cnVjdG9yKGJvZHlBLCBib2R5Qiwgb3B0aW9ucykgewogICAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7CiAgICAgICAgb3B0aW9ucyA9IHt9OwogICAgICB9CgogICAgICBjb25zdCBtYXhGb3JjZSA9IHR5cGVvZiBvcHRpb25zLm1heEZvcmNlICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMubWF4Rm9yY2UgOiAxZTY7CiAgICAgIHN1cGVyKGJvZHlBLCBib2R5QiwgLW1heEZvcmNlLCBtYXhGb3JjZSk7CiAgICAgIHRoaXMuYXhpc0EgPSBvcHRpb25zLmF4aXNBID8gb3B0aW9ucy5heGlzQS5jbG9uZSgpIDogbmV3IFZlYzMoMSwgMCwgMCk7CiAgICAgIHRoaXMuYXhpc0IgPSBvcHRpb25zLmF4aXNCID8gb3B0aW9ucy5heGlzQi5jbG9uZSgpIDogbmV3IFZlYzMoMCwgMSwgMCk7CiAgICAgIHRoaXMubWF4QW5nbGUgPSBNYXRoLlBJIC8gMjsKICAgIH0KCiAgICBjb21wdXRlQihoKSB7CiAgICAgIGNvbnN0IGEgPSB0aGlzLmE7CiAgICAgIGNvbnN0IGIgPSB0aGlzLmI7CiAgICAgIGNvbnN0IG5pID0gdGhpcy5heGlzQTsKICAgICAgY29uc3QgbmogPSB0aGlzLmF4aXNCOwogICAgICBjb25zdCBuaXhuaiA9IHRtcFZlYzEkMTsKICAgICAgY29uc3Qgbmp4bmkgPSB0bXBWZWMyJDE7CiAgICAgIGNvbnN0IEdBID0gdGhpcy5qYWNvYmlhbkVsZW1lbnRBOwogICAgICBjb25zdCBHQiA9IHRoaXMuamFjb2JpYW5FbGVtZW50QjsgLy8gQ2FsdWNsYXRlIGNyb3NzIHByb2R1Y3RzCgogICAgICBuaS5jcm9zcyhuaiwgbml4bmopOwogICAgICBuai5jcm9zcyhuaSwgbmp4bmkpOyAvLyBnID0gbmkgKiBuagogICAgICAvLyBnZG90ID0gKG5qIHggbmkpICogd2kgKyAobmkgeCBuaikgKiB3agogICAgICAvLyBHID0gWzAgbmp4bmkgMCBuaXhual0KICAgICAgLy8gVyA9IFt2aSB3aSB2aiB3al0KCiAgICAgIEdBLnJvdGF0aW9uYWwuY29weShuanhuaSk7CiAgICAgIEdCLnJvdGF0aW9uYWwuY29weShuaXhuaik7CiAgICAgIGNvbnN0IGcgPSBNYXRoLmNvcyh0aGlzLm1heEFuZ2xlKSAtIG5pLmRvdChuaik7CiAgICAgIGNvbnN0IEdXID0gdGhpcy5jb21wdXRlR1coKTsKICAgICAgY29uc3QgR2lNZiA9IHRoaXMuY29tcHV0ZUdpTWYoKTsKICAgICAgY29uc3QgQiA9IC1nICogYSAtIEdXICogYiAtIGggKiBHaU1mOwogICAgICByZXR1cm4gQjsKICAgIH0KCiAgfQogIGNvbnN0IHRtcFZlYzEkMSA9IG5ldyBWZWMzKCk7CiAgY29uc3QgdG1wVmVjMiQxID0gbmV3IFZlYzMoKTsKCiAgLyoqCiAgICogQSBDb25lIFR3aXN0IGNvbnN0cmFpbnQsIHVzZWZ1bCBmb3IgcmFnZG9sbHMuCiAgICovCiAgY2xhc3MgQ29uZVR3aXN0Q29uc3RyYWludCBleHRlbmRzIFBvaW50VG9Qb2ludENvbnN0cmFpbnQgewogICAgLyoqCiAgICAgKiBUaGUgYXhpcyBkaXJlY3Rpb24gZm9yIHRoZSBjb25zdHJhaW50IG9mIHRoZSBib2R5IEEuCiAgICAgKi8KCiAgICAvKioKICAgICAqIFRoZSBheGlzIGRpcmVjdGlvbiBmb3IgdGhlIGNvbnN0cmFpbnQgb2YgdGhlIGJvZHkgQi4KICAgICAqLwoKICAgIC8qKgogICAgICogVGhlIGFwZXJ0dXJlIGFuZ2xlIG9mIHRoZSBjb25lLgogICAgICovCgogICAgLyoqCiAgICAgKiBUaGUgdHdpc3QgYW5nbGUgb2YgdGhlIGpvaW50LgogICAgICovCiAgICBjb25zdHJ1Y3Rvcihib2R5QSwgYm9keUIsIG9wdGlvbnMpIHsKICAgICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgewogICAgICAgIG9wdGlvbnMgPSB7fTsKICAgICAgfQoKICAgICAgY29uc3QgbWF4Rm9yY2UgPSB0eXBlb2Ygb3B0aW9ucy5tYXhGb3JjZSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLm1heEZvcmNlIDogMWU2OyAvLyBTZXQgcGl2b3QgcG9pbnQgaW4gYmV0d2VlbgoKICAgICAgY29uc3QgcGl2b3RBID0gb3B0aW9ucy5waXZvdEEgPyBvcHRpb25zLnBpdm90QS5jbG9uZSgpIDogbmV3IFZlYzMoKTsKICAgICAgY29uc3QgcGl2b3RCID0gb3B0aW9ucy5waXZvdEIgPyBvcHRpb25zLnBpdm90Qi5jbG9uZSgpIDogbmV3IFZlYzMoKTsKICAgICAgc3VwZXIoYm9keUEsIHBpdm90QSwgYm9keUIsIHBpdm90QiwgbWF4Rm9yY2UpOwogICAgICB0aGlzLmF4aXNBID0gb3B0aW9ucy5heGlzQSA/IG9wdGlvbnMuYXhpc0EuY2xvbmUoKSA6IG5ldyBWZWMzKCk7CiAgICAgIHRoaXMuYXhpc0IgPSBvcHRpb25zLmF4aXNCID8gb3B0aW9ucy5heGlzQi5jbG9uZSgpIDogbmV3IFZlYzMoKTsKICAgICAgdGhpcy5jb2xsaWRlQ29ubmVjdGVkID0gISFvcHRpb25zLmNvbGxpZGVDb25uZWN0ZWQ7CiAgICAgIHRoaXMuYW5nbGUgPSB0eXBlb2Ygb3B0aW9ucy5hbmdsZSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmFuZ2xlIDogMDsKICAgICAgY29uc3QgYyA9IHRoaXMuY29uZUVxdWF0aW9uID0gbmV3IENvbmVFcXVhdGlvbihib2R5QSwgYm9keUIsIG9wdGlvbnMpOwogICAgICBjb25zdCB0ID0gdGhpcy50d2lzdEVxdWF0aW9uID0gbmV3IFJvdGF0aW9uYWxFcXVhdGlvbihib2R5QSwgYm9keUIsIG9wdGlvbnMpOwogICAgICB0aGlzLnR3aXN0QW5nbGUgPSB0eXBlb2Ygb3B0aW9ucy50d2lzdEFuZ2xlICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMudHdpc3RBbmdsZSA6IDA7IC8vIE1ha2UgdGhlIGNvbmUgZXF1YXRpb24gcHVzaCB0aGUgYm9kaWVzIHRvd2FyZCB0aGUgY29uZSBheGlzLCBub3Qgb3V0d2FyZAoKICAgICAgYy5tYXhGb3JjZSA9IDA7CiAgICAgIGMubWluRm9yY2UgPSAtbWF4Rm9yY2U7IC8vIE1ha2UgdGhlIHR3aXN0IGVxdWF0aW9uIGFkZCB0b3JxdWUgdG93YXJkIHRoZSBpbml0aWFsIHBvc2l0aW9uCgogICAgICB0Lm1heEZvcmNlID0gMDsKICAgICAgdC5taW5Gb3JjZSA9IC1tYXhGb3JjZTsKICAgICAgdGhpcy5lcXVhdGlvbnMucHVzaChjLCB0KTsKICAgIH0KCiAgICB1cGRhdGUoKSB7CiAgICAgIGNvbnN0IGJvZHlBID0gdGhpcy5ib2R5QTsKICAgICAgY29uc3QgYm9keUIgPSB0aGlzLmJvZHlCOwogICAgICBjb25zdCBjb25lID0gdGhpcy5jb25lRXF1YXRpb247CiAgICAgIGNvbnN0IHR3aXN0ID0gdGhpcy50d2lzdEVxdWF0aW9uOwogICAgICBzdXBlci51cGRhdGUoKTsgLy8gVXBkYXRlIHRoZSBheGVzIHRvIHRoZSBjb25lIGNvbnN0cmFpbnQKCiAgICAgIGJvZHlBLnZlY3RvclRvV29ybGRGcmFtZSh0aGlzLmF4aXNBLCBjb25lLmF4aXNBKTsKICAgICAgYm9keUIudmVjdG9yVG9Xb3JsZEZyYW1lKHRoaXMuYXhpc0IsIGNvbmUuYXhpc0IpOyAvLyBVcGRhdGUgdGhlIHdvcmxkIGF4ZXMgaW4gdGhlIHR3aXN0IGNvbnN0cmFpbnQKCiAgICAgIHRoaXMuYXhpc0EudGFuZ2VudHModHdpc3QuYXhpc0EsIHR3aXN0LmF4aXNBKTsKICAgICAgYm9keUEudmVjdG9yVG9Xb3JsZEZyYW1lKHR3aXN0LmF4aXNBLCB0d2lzdC5heGlzQSk7CiAgICAgIHRoaXMuYXhpc0IudGFuZ2VudHModHdpc3QuYXhpc0IsIHR3aXN0LmF4aXNCKTsKICAgICAgYm9keUIudmVjdG9yVG9Xb3JsZEZyYW1lKHR3aXN0LmF4aXNCLCB0d2lzdC5heGlzQik7CiAgICAgIGNvbmUuYW5nbGUgPSB0aGlzLmFuZ2xlOwogICAgICB0d2lzdC5tYXhBbmdsZSA9IHRoaXMudHdpc3RBbmdsZTsKICAgIH0KCiAgfQogIG5ldyBWZWMzKCk7CiAgbmV3IFZlYzMoKTsKCiAgLyoqCiAgICogQ29uc3RyYWlucyB0d28gYm9kaWVzIHRvIGJlIGF0IGEgY29uc3RhbnQgZGlzdGFuY2UgZnJvbSBlYWNoIG90aGVycyBjZW50ZXIgb2YgbWFzcy4KICAgKi8KICBjbGFzcyBEaXN0YW5jZUNvbnN0cmFpbnQgZXh0ZW5kcyBDb25zdHJhaW50IHsKICAgIC8qKgogICAgICogVGhlIGRpc3RhbmNlIHRvIGtlZXAuIElmIHVuZGVmaW5lZCwgaXQgd2lsbCBiZSBzZXQgdG8gdGhlIGN1cnJlbnQgZGlzdGFuY2UgYmV0d2VlbiBib2R5QSBhbmQgYm9keUIKICAgICAqLwoKICAgIC8qKgogICAgICogQHBhcmFtIGRpc3RhbmNlIFRoZSBkaXN0YW5jZSB0byBrZWVwLiBJZiB1bmRlZmluZWQsIGl0IHdpbGwgYmUgc2V0IHRvIHRoZSBjdXJyZW50IGRpc3RhbmNlIGJldHdlZW4gYm9keUEgYW5kIGJvZHlCLgogICAgICogQHBhcmFtIG1heEZvcmNlIFRoZSBtYXhpbXVtIGZvcmNlIHRoYXQgc2hvdWxkIGJlIGFwcGxpZWQgdG8gY29uc3RyYWluIHRoZSBib2RpZXMuCiAgICAgKi8KICAgIGNvbnN0cnVjdG9yKGJvZHlBLCBib2R5QiwgZGlzdGFuY2UsIG1heEZvcmNlKSB7CiAgICAgIGlmIChtYXhGb3JjZSA9PT0gdm9pZCAwKSB7CiAgICAgICAgbWF4Rm9yY2UgPSAxZTY7CiAgICAgIH0KCiAgICAgIHN1cGVyKGJvZHlBLCBib2R5Qik7CgogICAgICBpZiAodHlwZW9mIGRpc3RhbmNlID09PSAndW5kZWZpbmVkJykgewogICAgICAgIGRpc3RhbmNlID0gYm9keUEucG9zaXRpb24uZGlzdGFuY2VUbyhib2R5Qi5wb3NpdGlvbik7CiAgICAgIH0KCiAgICAgIHRoaXMuZGlzdGFuY2UgPSBkaXN0YW5jZTsKICAgICAgY29uc3QgZXEgPSB0aGlzLmRpc3RhbmNlRXF1YXRpb24gPSBuZXcgQ29udGFjdEVxdWF0aW9uKGJvZHlBLCBib2R5Qik7CiAgICAgIHRoaXMuZXF1YXRpb25zLnB1c2goZXEpOyAvLyBNYWtlIGl0IGJpZGlyZWN0aW9uYWwKCiAgICAgIGVxLm1pbkZvcmNlID0gLW1heEZvcmNlOwogICAgICBlcS5tYXhGb3JjZSA9IG1heEZvcmNlOwogICAgfQogICAgLyoqCiAgICAgKiB1cGRhdGUKICAgICAqLwoKCiAgICB1cGRhdGUoKSB7CiAgICAgIGNvbnN0IGJvZHlBID0gdGhpcy5ib2R5QTsKICAgICAgY29uc3QgYm9keUIgPSB0aGlzLmJvZHlCOwogICAgICBjb25zdCBlcSA9IHRoaXMuZGlzdGFuY2VFcXVhdGlvbjsKICAgICAgY29uc3QgaGFsZkRpc3QgPSB0aGlzLmRpc3RhbmNlICogMC41OwogICAgICBjb25zdCBub3JtYWwgPSBlcS5uaTsKICAgICAgYm9keUIucG9zaXRpb24udnN1Yihib2R5QS5wb3NpdGlvbiwgbm9ybWFsKTsKICAgICAgbm9ybWFsLm5vcm1hbGl6ZSgpOwogICAgICBub3JtYWwuc2NhbGUoaGFsZkRpc3QsIGVxLnJpKTsKICAgICAgbm9ybWFsLnNjYWxlKC1oYWxmRGlzdCwgZXEucmopOwogICAgfQoKICB9CgogIC8qKgogICAqIExvY2sgY29uc3RyYWludC4gV2lsbCByZW1vdmUgYWxsIGRlZ3JlZXMgb2YgZnJlZWRvbSBiZXR3ZWVuIHRoZSBib2RpZXMuCiAgICovCiAgY2xhc3MgTG9ja0NvbnN0cmFpbnQgZXh0ZW5kcyBQb2ludFRvUG9pbnRDb25zdHJhaW50IHsKICAgIGNvbnN0cnVjdG9yKGJvZHlBLCBib2R5Qiwgb3B0aW9ucykgewogICAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7CiAgICAgICAgb3B0aW9ucyA9IHt9OwogICAgICB9CgogICAgICBjb25zdCBtYXhGb3JjZSA9IHR5cGVvZiBvcHRpb25zLm1heEZvcmNlICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMubWF4Rm9yY2UgOiAxZTY7IC8vIFNldCBwaXZvdCBwb2ludCBpbiBiZXR3ZWVuCgogICAgICBjb25zdCBwaXZvdEEgPSBuZXcgVmVjMygpOwogICAgICBjb25zdCBwaXZvdEIgPSBuZXcgVmVjMygpOwogICAgICBjb25zdCBoYWxmV2F5ID0gbmV3IFZlYzMoKTsKICAgICAgYm9keUEucG9zaXRpb24udmFkZChib2R5Qi5wb3NpdGlvbiwgaGFsZldheSk7CiAgICAgIGhhbGZXYXkuc2NhbGUoMC41LCBoYWxmV2F5KTsKICAgICAgYm9keUIucG9pbnRUb0xvY2FsRnJhbWUoaGFsZldheSwgcGl2b3RCKTsKICAgICAgYm9keUEucG9pbnRUb0xvY2FsRnJhbWUoaGFsZldheSwgcGl2b3RBKTsgLy8gVGhlIHBvaW50LXRvLXBvaW50IGNvbnN0cmFpbnQgd2lsbCBrZWVwIGEgcG9pbnQgc2hhcmVkIGJldHdlZW4gdGhlIGJvZGllcwoKICAgICAgc3VwZXIoYm9keUEsIHBpdm90QSwgYm9keUIsIHBpdm90QiwgbWF4Rm9yY2UpOyAvLyBTdG9yZSBpbml0aWFsIHJvdGF0aW9uIG9mIHRoZSBib2RpZXMgYXMgdW5pdCB2ZWN0b3JzIGluIHRoZSBsb2NhbCBib2R5IHNwYWNlcwoKICAgICAgdGhpcy54QSA9IGJvZHlBLnZlY3RvclRvTG9jYWxGcmFtZShWZWMzLlVOSVRfWCk7CiAgICAgIHRoaXMueEIgPSBib2R5Qi52ZWN0b3JUb0xvY2FsRnJhbWUoVmVjMy5VTklUX1gpOwogICAgICB0aGlzLnlBID0gYm9keUEudmVjdG9yVG9Mb2NhbEZyYW1lKFZlYzMuVU5JVF9ZKTsKICAgICAgdGhpcy55QiA9IGJvZHlCLnZlY3RvclRvTG9jYWxGcmFtZShWZWMzLlVOSVRfWSk7CiAgICAgIHRoaXMuekEgPSBib2R5QS52ZWN0b3JUb0xvY2FsRnJhbWUoVmVjMy5VTklUX1opOwogICAgICB0aGlzLnpCID0gYm9keUIudmVjdG9yVG9Mb2NhbEZyYW1lKFZlYzMuVU5JVF9aKTsgLy8gLi4uYW5kIHRoZSBmb2xsb3dpbmcgcm90YXRpb25hbCBlcXVhdGlvbnMgd2lsbCBrZWVwIGFsbCByb3RhdGlvbmFsIERPRidzIGluIHBsYWNlCgogICAgICBjb25zdCByMSA9IHRoaXMucm90YXRpb25hbEVxdWF0aW9uMSA9IG5ldyBSb3RhdGlvbmFsRXF1YXRpb24oYm9keUEsIGJvZHlCLCBvcHRpb25zKTsKICAgICAgY29uc3QgcjIgPSB0aGlzLnJvdGF0aW9uYWxFcXVhdGlvbjIgPSBuZXcgUm90YXRpb25hbEVxdWF0aW9uKGJvZHlBLCBib2R5Qiwgb3B0aW9ucyk7CiAgICAgIGNvbnN0IHIzID0gdGhpcy5yb3RhdGlvbmFsRXF1YXRpb24zID0gbmV3IFJvdGF0aW9uYWxFcXVhdGlvbihib2R5QSwgYm9keUIsIG9wdGlvbnMpOwogICAgICB0aGlzLmVxdWF0aW9ucy5wdXNoKHIxLCByMiwgcjMpOwogICAgfQogICAgLyoqCiAgICAgKiB1cGRhdGUKICAgICAqLwoKCiAgICB1cGRhdGUoKSB7CiAgICAgIGNvbnN0IGJvZHlBID0gdGhpcy5ib2R5QTsKICAgICAgY29uc3QgYm9keUIgPSB0aGlzLmJvZHlCOwogICAgICB0aGlzLm1vdG9yRXF1YXRpb247CiAgICAgIGNvbnN0IHIxID0gdGhpcy5yb3RhdGlvbmFsRXF1YXRpb24xOwogICAgICBjb25zdCByMiA9IHRoaXMucm90YXRpb25hbEVxdWF0aW9uMjsKICAgICAgY29uc3QgcjMgPSB0aGlzLnJvdGF0aW9uYWxFcXVhdGlvbjM7CiAgICAgIHN1cGVyLnVwZGF0ZSgpOyAvLyBUaGVzZSB2ZWN0b3IgcGFpcnMgbXVzdCBiZSBvcnRob2dvbmFsCgogICAgICBib2R5QS52ZWN0b3JUb1dvcmxkRnJhbWUodGhpcy54QSwgcjEuYXhpc0EpOwogICAgICBib2R5Qi52ZWN0b3JUb1dvcmxkRnJhbWUodGhpcy55QiwgcjEuYXhpc0IpOwogICAgICBib2R5QS52ZWN0b3JUb1dvcmxkRnJhbWUodGhpcy55QSwgcjIuYXhpc0EpOwogICAgICBib2R5Qi52ZWN0b3JUb1dvcmxkRnJhbWUodGhpcy56QiwgcjIuYXhpc0IpOwogICAgICBib2R5QS52ZWN0b3JUb1dvcmxkRnJhbWUodGhpcy56QSwgcjMuYXhpc0EpOwogICAgICBib2R5Qi52ZWN0b3JUb1dvcmxkRnJhbWUodGhpcy54QiwgcjMuYXhpc0IpOwogICAgfQoKICB9CiAgbmV3IFZlYzMoKTsKICBuZXcgVmVjMygpOwoKICAvKioKICAgKiBSb3RhdGlvbmFsIG1vdG9yIGNvbnN0cmFpbnQuIFRyaWVzIHRvIGtlZXAgdGhlIHJlbGF0aXZlIGFuZ3VsYXIgdmVsb2NpdHkgb2YgdGhlIGJvZGllcyB0byBhIGdpdmVuIHZhbHVlLgogICAqLwogIGNsYXNzIFJvdGF0aW9uYWxNb3RvckVxdWF0aW9uIGV4dGVuZHMgRXF1YXRpb24gewogICAgLyoqCiAgICAgKiBXb3JsZCBvcmllbnRlZCByb3RhdGlvbmFsIGF4aXMuCiAgICAgKi8KCiAgICAvKioKICAgICAqIFdvcmxkIG9yaWVudGVkIHJvdGF0aW9uYWwgYXhpcy4KICAgICAqLwoKICAgIC8qKgogICAgICogTW90b3IgdmVsb2NpdHkuCiAgICAgKi8KICAgIGNvbnN0cnVjdG9yKGJvZHlBLCBib2R5QiwgbWF4Rm9yY2UpIHsKICAgICAgaWYgKG1heEZvcmNlID09PSB2b2lkIDApIHsKICAgICAgICBtYXhGb3JjZSA9IDFlNjsKICAgICAgfQoKICAgICAgc3VwZXIoYm9keUEsIGJvZHlCLCAtbWF4Rm9yY2UsIG1heEZvcmNlKTsKICAgICAgdGhpcy5heGlzQSA9IG5ldyBWZWMzKCk7CiAgICAgIHRoaXMuYXhpc0IgPSBuZXcgVmVjMygpOwogICAgICB0aGlzLnRhcmdldFZlbG9jaXR5ID0gMDsKICAgIH0KCiAgICBjb21wdXRlQihoKSB7CiAgICAgIHRoaXMuYTsKICAgICAgY29uc3QgYiA9IHRoaXMuYjsKICAgICAgdGhpcy5iaTsKICAgICAgdGhpcy5iajsKICAgICAgY29uc3QgYXhpc0EgPSB0aGlzLmF4aXNBOwogICAgICBjb25zdCBheGlzQiA9IHRoaXMuYXhpc0I7CiAgICAgIGNvbnN0IEdBID0gdGhpcy5qYWNvYmlhbkVsZW1lbnRBOwogICAgICBjb25zdCBHQiA9IHRoaXMuamFjb2JpYW5FbGVtZW50QjsgLy8gZyA9IDAKICAgICAgLy8gZ2RvdCA9IGF4aXNBICogd2kgLSBheGlzQiAqIHdqCiAgICAgIC8vIGdkb3QgPSBHICogVyA9IEcgKiBbdmkgd2kgdmogd2pdCiAgICAgIC8vID0+CiAgICAgIC8vIEcgPSBbMCBheGlzQSAwIC1heGlzQl0KCiAgICAgIEdBLnJvdGF0aW9uYWwuY29weShheGlzQSk7CiAgICAgIGF4aXNCLm5lZ2F0ZShHQi5yb3RhdGlvbmFsKTsKICAgICAgY29uc3QgR1cgPSB0aGlzLmNvbXB1dGVHVygpIC0gdGhpcy50YXJnZXRWZWxvY2l0eTsKICAgICAgY29uc3QgR2lNZiA9IHRoaXMuY29tcHV0ZUdpTWYoKTsKICAgICAgY29uc3QgQiA9IC1HVyAqIGIgLSBoICogR2lNZjsKICAgICAgcmV0dXJuIEI7CiAgICB9CgogIH0KCiAgLyoqCiAgICogSGluZ2UgY29uc3RyYWludC4gVGhpbmsgb2YgaXQgYXMgYSBkb29yIGhpbmdlLiBJdCB0cmllcyB0byBrZWVwIHRoZSBkb29yIGluIHRoZSBjb3JyZWN0IHBsYWNlIGFuZCB3aXRoIHRoZSBjb3JyZWN0IG9yaWVudGF0aW9uLgogICAqLwogIGNsYXNzIEhpbmdlQ29uc3RyYWludCBleHRlbmRzIFBvaW50VG9Qb2ludENvbnN0cmFpbnQgewogICAgLyoqCiAgICAgKiBSb3RhdGlvbiBheGlzLCBkZWZpbmVkIGxvY2FsbHkgaW4gYm9keUEuCiAgICAgKi8KCiAgICAvKioKICAgICAqIFJvdGF0aW9uIGF4aXMsIGRlZmluZWQgbG9jYWxseSBpbiBib2R5Qi4KICAgICAqLwogICAgY29uc3RydWN0b3IoYm9keUEsIGJvZHlCLCBvcHRpb25zKSB7CiAgICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsKICAgICAgICBvcHRpb25zID0ge307CiAgICAgIH0KCiAgICAgIGNvbnN0IG1heEZvcmNlID0gdHlwZW9mIG9wdGlvbnMubWF4Rm9yY2UgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5tYXhGb3JjZSA6IDFlNjsKICAgICAgY29uc3QgcGl2b3RBID0gb3B0aW9ucy5waXZvdEEgPyBvcHRpb25zLnBpdm90QS5jbG9uZSgpIDogbmV3IFZlYzMoKTsKICAgICAgY29uc3QgcGl2b3RCID0gb3B0aW9ucy5waXZvdEIgPyBvcHRpb25zLnBpdm90Qi5jbG9uZSgpIDogbmV3IFZlYzMoKTsKICAgICAgc3VwZXIoYm9keUEsIHBpdm90QSwgYm9keUIsIHBpdm90QiwgbWF4Rm9yY2UpOwogICAgICBjb25zdCBheGlzQSA9IHRoaXMuYXhpc0EgPSBvcHRpb25zLmF4aXNBID8gb3B0aW9ucy5heGlzQS5jbG9uZSgpIDogbmV3IFZlYzMoMSwgMCwgMCk7CiAgICAgIGF4aXNBLm5vcm1hbGl6ZSgpOwogICAgICBjb25zdCBheGlzQiA9IHRoaXMuYXhpc0IgPSBvcHRpb25zLmF4aXNCID8gb3B0aW9ucy5heGlzQi5jbG9uZSgpIDogbmV3IFZlYzMoMSwgMCwgMCk7CiAgICAgIGF4aXNCLm5vcm1hbGl6ZSgpOwogICAgICB0aGlzLmNvbGxpZGVDb25uZWN0ZWQgPSAhIW9wdGlvbnMuY29sbGlkZUNvbm5lY3RlZDsKICAgICAgY29uc3Qgcm90YXRpb25hbDEgPSB0aGlzLnJvdGF0aW9uYWxFcXVhdGlvbjEgPSBuZXcgUm90YXRpb25hbEVxdWF0aW9uKGJvZHlBLCBib2R5Qiwgb3B0aW9ucyk7CiAgICAgIGNvbnN0IHJvdGF0aW9uYWwyID0gdGhpcy5yb3RhdGlvbmFsRXF1YXRpb24yID0gbmV3IFJvdGF0aW9uYWxFcXVhdGlvbihib2R5QSwgYm9keUIsIG9wdGlvbnMpOwogICAgICBjb25zdCBtb3RvciA9IHRoaXMubW90b3JFcXVhdGlvbiA9IG5ldyBSb3RhdGlvbmFsTW90b3JFcXVhdGlvbihib2R5QSwgYm9keUIsIG1heEZvcmNlKTsKICAgICAgbW90b3IuZW5hYmxlZCA9IGZhbHNlOyAvLyBOb3QgZW5hYmxlZCBieSBkZWZhdWx0CiAgICAgIC8vIEVxdWF0aW9ucyB0byBiZSBmZWQgdG8gdGhlIHNvbHZlcgoKICAgICAgdGhpcy5lcXVhdGlvbnMucHVzaChyb3RhdGlvbmFsMSwgcm90YXRpb25hbDIsIG1vdG9yKTsKICAgIH0KICAgIC8qKgogICAgICogZW5hYmxlTW90b3IKICAgICAqLwoKCiAgICBlbmFibGVNb3RvcigpIHsKICAgICAgdGhpcy5tb3RvckVxdWF0aW9uLmVuYWJsZWQgPSB0cnVlOwogICAgfQogICAgLyoqCiAgICAgKiBkaXNhYmxlTW90b3IKICAgICAqLwoKCiAgICBkaXNhYmxlTW90b3IoKSB7CiAgICAgIHRoaXMubW90b3JFcXVhdGlvbi5lbmFibGVkID0gZmFsc2U7CiAgICB9CiAgICAvKioKICAgICAqIHNldE1vdG9yU3BlZWQKICAgICAqLwoKCiAgICBzZXRNb3RvclNwZWVkKHNwZWVkKSB7CiAgICAgIHRoaXMubW90b3JFcXVhdGlvbi50YXJnZXRWZWxvY2l0eSA9IHNwZWVkOwogICAgfQogICAgLyoqCiAgICAgKiBzZXRNb3Rvck1heEZvcmNlCiAgICAgKi8KCgogICAgc2V0TW90b3JNYXhGb3JjZShtYXhGb3JjZSkgewogICAgICB0aGlzLm1vdG9yRXF1YXRpb24ubWF4Rm9yY2UgPSBtYXhGb3JjZTsKICAgICAgdGhpcy5tb3RvckVxdWF0aW9uLm1pbkZvcmNlID0gLW1heEZvcmNlOwogICAgfQogICAgLyoqCiAgICAgKiB1cGRhdGUKICAgICAqLwoKCiAgICB1cGRhdGUoKSB7CiAgICAgIGNvbnN0IGJvZHlBID0gdGhpcy5ib2R5QTsKICAgICAgY29uc3QgYm9keUIgPSB0aGlzLmJvZHlCOwogICAgICBjb25zdCBtb3RvciA9IHRoaXMubW90b3JFcXVhdGlvbjsKICAgICAgY29uc3QgcjEgPSB0aGlzLnJvdGF0aW9uYWxFcXVhdGlvbjE7CiAgICAgIGNvbnN0IHIyID0gdGhpcy5yb3RhdGlvbmFsRXF1YXRpb24yOwogICAgICBjb25zdCB3b3JsZEF4aXNBID0gSGluZ2VDb25zdHJhaW50X3VwZGF0ZV90bXBWZWMxOwogICAgICBjb25zdCB3b3JsZEF4aXNCID0gSGluZ2VDb25zdHJhaW50X3VwZGF0ZV90bXBWZWMyOwogICAgICBjb25zdCBheGlzQSA9IHRoaXMuYXhpc0E7CiAgICAgIGNvbnN0IGF4aXNCID0gdGhpcy5heGlzQjsKICAgICAgc3VwZXIudXBkYXRlKCk7IC8vIEdldCB3b3JsZCBheGVzCgogICAgICBib2R5QS5xdWF0ZXJuaW9uLnZtdWx0KGF4aXNBLCB3b3JsZEF4aXNBKTsKICAgICAgYm9keUIucXVhdGVybmlvbi52bXVsdChheGlzQiwgd29ybGRBeGlzQik7CiAgICAgIHdvcmxkQXhpc0EudGFuZ2VudHMocjEuYXhpc0EsIHIyLmF4aXNBKTsKICAgICAgcjEuYXhpc0IuY29weSh3b3JsZEF4aXNCKTsKICAgICAgcjIuYXhpc0IuY29weSh3b3JsZEF4aXNCKTsKCiAgICAgIGlmICh0aGlzLm1vdG9yRXF1YXRpb24uZW5hYmxlZCkgewogICAgICAgIGJvZHlBLnF1YXRlcm5pb24udm11bHQodGhpcy5heGlzQSwgbW90b3IuYXhpc0EpOwogICAgICAgIGJvZHlCLnF1YXRlcm5pb24udm11bHQodGhpcy5heGlzQiwgbW90b3IuYXhpc0IpOwogICAgICB9CiAgICB9CgogIH0KICBjb25zdCBIaW5nZUNvbnN0cmFpbnRfdXBkYXRlX3RtcFZlYzEgPSBuZXcgVmVjMygpOwogIGNvbnN0IEhpbmdlQ29uc3RyYWludF91cGRhdGVfdG1wVmVjMiA9IG5ldyBWZWMzKCk7CgogIC8qKgogICAqIENvbnN0cmFpbnMgdGhlIHNsaXBwaW5nIGluIGEgY29udGFjdCBhbG9uZyBhIHRhbmdlbnQKICAgKi8KICBjbGFzcyBGcmljdGlvbkVxdWF0aW9uIGV4dGVuZHMgRXF1YXRpb24gewogICAgLy8gVGFuZ2VudAoKICAgIC8qKgogICAgICogQHBhcmFtIHNsaXBGb3JjZSBzaG91bGQgYmUgKy1GX2ZyaWN0aW9uID0gKy1tdSAqIEZfbm9ybWFsID0gKy1tdSAqIG0gKiBnCiAgICAgKi8KICAgIGNvbnN0cnVjdG9yKGJvZHlBLCBib2R5Qiwgc2xpcEZvcmNlKSB7CiAgICAgIHN1cGVyKGJvZHlBLCBib2R5QiwgLXNsaXBGb3JjZSwgc2xpcEZvcmNlKTsKICAgICAgdGhpcy5yaSA9IG5ldyBWZWMzKCk7CiAgICAgIHRoaXMucmogPSBuZXcgVmVjMygpOwogICAgICB0aGlzLnQgPSBuZXcgVmVjMygpOwogICAgfQoKICAgIGNvbXB1dGVCKGgpIHsKICAgICAgdGhpcy5hOwogICAgICBjb25zdCBiID0gdGhpcy5iOwogICAgICB0aGlzLmJpOwogICAgICB0aGlzLmJqOwogICAgICBjb25zdCByaSA9IHRoaXMucmk7CiAgICAgIGNvbnN0IHJqID0gdGhpcy5yajsKICAgICAgY29uc3Qgcml4dCA9IEZyaWN0aW9uRXF1YXRpb25fY29tcHV0ZUJfdGVtcDE7CiAgICAgIGNvbnN0IHJqeHQgPSBGcmljdGlvbkVxdWF0aW9uX2NvbXB1dGVCX3RlbXAyOwogICAgICBjb25zdCB0ID0gdGhpcy50OyAvLyBDYWx1Y2xhdGUgY3Jvc3MgcHJvZHVjdHMKCiAgICAgIHJpLmNyb3NzKHQsIHJpeHQpOwogICAgICByai5jcm9zcyh0LCByanh0KTsgLy8gRyA9IFstdCAtcml4dCB0IHJqeHRdCiAgICAgIC8vIEFuZCByZW1lbWJlciwgdGhpcyBpcyBhIHB1cmUgdmVsb2NpdHkgY29uc3RyYWludCwgZyBpcyBhbHdheXMgemVybyEKCiAgICAgIGNvbnN0IEdBID0gdGhpcy5qYWNvYmlhbkVsZW1lbnRBOwogICAgICBjb25zdCBHQiA9IHRoaXMuamFjb2JpYW5FbGVtZW50QjsKICAgICAgdC5uZWdhdGUoR0Euc3BhdGlhbCk7CiAgICAgIHJpeHQubmVnYXRlKEdBLnJvdGF0aW9uYWwpOwogICAgICBHQi5zcGF0aWFsLmNvcHkodCk7CiAgICAgIEdCLnJvdGF0aW9uYWwuY29weShyanh0KTsKICAgICAgY29uc3QgR1cgPSB0aGlzLmNvbXB1dGVHVygpOwogICAgICBjb25zdCBHaU1mID0gdGhpcy5jb21wdXRlR2lNZigpOwogICAgICBjb25zdCBCID0gLUdXICogYiAtIGggKiBHaU1mOwogICAgICByZXR1cm4gQjsKICAgIH0KCiAgfQogIGNvbnN0IEZyaWN0aW9uRXF1YXRpb25fY29tcHV0ZUJfdGVtcDEgPSBuZXcgVmVjMygpOwogIGNvbnN0IEZyaWN0aW9uRXF1YXRpb25fY29tcHV0ZUJfdGVtcDIgPSBuZXcgVmVjMygpOwoKICAvKioKICAgKiBEZWZpbmVzIHdoYXQgaGFwcGVucyB3aGVuIHR3byBtYXRlcmlhbHMgbWVldC4KICAgKiBAdG9kbyBSZWZhY3RvciBtYXRlcmlhbHMgdG8gbWF0ZXJpYWxBIGFuZCBtYXRlcmlhbEIKICAgKi8KICBjbGFzcyBDb250YWN0TWF0ZXJpYWwgewogICAgLyoqCiAgICAgKiBJZGVudGlmaWVyIG9mIHRoaXMgbWF0ZXJpYWwuCiAgICAgKi8KCiAgICAvKioKICAgICAqIFBhcnRpY2lwYXRpbmcgbWF0ZXJpYWxzLgogICAgICovCgogICAgLyoqCiAgICAgKiBGcmljdGlvbiBjb2VmZmljaWVudC4KICAgICAqIEBkZWZhdWx0IDAuMwogICAgICovCgogICAgLyoqCiAgICAgKiBSZXN0aXR1dGlvbiBjb2VmZmljaWVudC4KICAgICAqIEBkZWZhdWx0IDAuMwogICAgICovCgogICAgLyoqCiAgICAgKiBTdGlmZm5lc3Mgb2YgdGhlIHByb2R1Y2VkIGNvbnRhY3QgZXF1YXRpb25zLgogICAgICogQGRlZmF1bHQgMWU3CiAgICAgKi8KCiAgICAvKioKICAgICAqIFJlbGF4YXRpb24gdGltZSBvZiB0aGUgcHJvZHVjZWQgY29udGFjdCBlcXVhdGlvbnMuCiAgICAgKiBAZGVmYXVsdCAzCiAgICAgKi8KCiAgICAvKioKICAgICAqIFN0aWZmbmVzcyBvZiB0aGUgcHJvZHVjZWQgZnJpY3Rpb24gZXF1YXRpb25zLgogICAgICogQGRlZmF1bHQgMWU3CiAgICAgKi8KCiAgICAvKioKICAgICAqIFJlbGF4YXRpb24gdGltZSBvZiB0aGUgcHJvZHVjZWQgZnJpY3Rpb24gZXF1YXRpb25zCiAgICAgKiBAZGVmYXVsdCAzCiAgICAgKi8KICAgIGNvbnN0cnVjdG9yKG0xLCBtMiwgb3B0aW9ucykgewogICAgICBvcHRpb25zID0gVXRpbHMuZGVmYXVsdHMob3B0aW9ucywgewogICAgICAgIGZyaWN0aW9uOiAwLjMsCiAgICAgICAgcmVzdGl0dXRpb246IDAuMywKICAgICAgICBjb250YWN0RXF1YXRpb25TdGlmZm5lc3M6IDFlNywKICAgICAgICBjb250YWN0RXF1YXRpb25SZWxheGF0aW9uOiAzLAogICAgICAgIGZyaWN0aW9uRXF1YXRpb25TdGlmZm5lc3M6IDFlNywKICAgICAgICBmcmljdGlvbkVxdWF0aW9uUmVsYXhhdGlvbjogMwogICAgICB9KTsKICAgICAgdGhpcy5pZCA9IENvbnRhY3RNYXRlcmlhbC5pZENvdW50ZXIrKzsKICAgICAgdGhpcy5tYXRlcmlhbHMgPSBbbTEsIG0yXTsKICAgICAgdGhpcy5mcmljdGlvbiA9IG9wdGlvbnMuZnJpY3Rpb247CiAgICAgIHRoaXMucmVzdGl0dXRpb24gPSBvcHRpb25zLnJlc3RpdHV0aW9uOwogICAgICB0aGlzLmNvbnRhY3RFcXVhdGlvblN0aWZmbmVzcyA9IG9wdGlvbnMuY29udGFjdEVxdWF0aW9uU3RpZmZuZXNzOwogICAgICB0aGlzLmNvbnRhY3RFcXVhdGlvblJlbGF4YXRpb24gPSBvcHRpb25zLmNvbnRhY3RFcXVhdGlvblJlbGF4YXRpb247CiAgICAgIHRoaXMuZnJpY3Rpb25FcXVhdGlvblN0aWZmbmVzcyA9IG9wdGlvbnMuZnJpY3Rpb25FcXVhdGlvblN0aWZmbmVzczsKICAgICAgdGhpcy5mcmljdGlvbkVxdWF0aW9uUmVsYXhhdGlvbiA9IG9wdGlvbnMuZnJpY3Rpb25FcXVhdGlvblJlbGF4YXRpb247CiAgICB9CgogIH0KICBDb250YWN0TWF0ZXJpYWwuaWRDb3VudGVyID0gMDsKCiAgLyoqCiAgICogRGVmaW5lcyBhIHBoeXNpY3MgbWF0ZXJpYWwuCiAgICovCiAgY2xhc3MgTWF0ZXJpYWwgewogICAgLyoqCiAgICAgKiBNYXRlcmlhbCBuYW1lLgogICAgICogSWYgb3B0aW9ucyBpcyBhIHN0cmluZywgbmFtZSB3aWxsIGJlIHNldCB0byB0aGF0IHN0cmluZy4KICAgICAqIEB0b2RvIERlcHJlY2F0ZSB0aGlzCiAgICAgKi8KCiAgICAvKiogTWF0ZXJpYWwgaWQuICovCgogICAgLyoqCiAgICAgKiBGcmljdGlvbiBmb3IgdGhpcyBtYXRlcmlhbC4KICAgICAqIElmIG5vbi1uZWdhdGl2ZSwgaXQgd2lsbCBiZSB1c2VkIGluc3RlYWQgb2YgdGhlIGZyaWN0aW9uIGdpdmVuIGJ5IENvbnRhY3RNYXRlcmlhbHMuIElmIHRoZXJlJ3Mgbm8gbWF0Y2hpbmcgQ29udGFjdE1hdGVyaWFsLCB0aGUgdmFsdWUgZnJvbSBgZGVmYXVsdENvbnRhY3RNYXRlcmlhbGAgaW4gdGhlIFdvcmxkIHdpbGwgYmUgdXNlZC4KICAgICAqLwoKICAgIC8qKgogICAgICogUmVzdGl0dXRpb24gZm9yIHRoaXMgbWF0ZXJpYWwuCiAgICAgKiBJZiBub24tbmVnYXRpdmUsIGl0IHdpbGwgYmUgdXNlZCBpbnN0ZWFkIG9mIHRoZSByZXN0aXR1dGlvbiBnaXZlbiBieSBDb250YWN0TWF0ZXJpYWxzLiBJZiB0aGVyZSdzIG5vIG1hdGNoaW5nIENvbnRhY3RNYXRlcmlhbCwgdGhlIHZhbHVlIGZyb20gYGRlZmF1bHRDb250YWN0TWF0ZXJpYWxgIGluIHRoZSBXb3JsZCB3aWxsIGJlIHVzZWQuCiAgICAgKi8KICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHsKICAgICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgewogICAgICAgIG9wdGlvbnMgPSB7fTsKICAgICAgfQoKICAgICAgbGV0IG5hbWUgPSAnJzsgLy8gQmFja3dhcmRzIGNvbXBhdGliaWxpdHkgZml4CgogICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7CiAgICAgICAgLy9jb25zb2xlLndhcm4oYFBhc3NpbmcgYSBzdHJpbmcgdG8gTWF0ZXJpYWxPcHRpb25zIGlzIGRlcHJlY2F0ZWQsIGFuZCBoYXMgbm8gZWZmZWN0YCkKICAgICAgICBuYW1lID0gb3B0aW9uczsKICAgICAgICBvcHRpb25zID0ge307CiAgICAgIH0KCiAgICAgIHRoaXMubmFtZSA9IG5hbWU7CiAgICAgIHRoaXMuaWQgPSBNYXRlcmlhbC5pZENvdW50ZXIrKzsKICAgICAgdGhpcy5mcmljdGlvbiA9IHR5cGVvZiBvcHRpb25zLmZyaWN0aW9uICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuZnJpY3Rpb24gOiAtMTsKICAgICAgdGhpcy5yZXN0aXR1dGlvbiA9IHR5cGVvZiBvcHRpb25zLnJlc3RpdHV0aW9uICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMucmVzdGl0dXRpb24gOiAtMTsKICAgIH0KCiAgfQogIE1hdGVyaWFsLmlkQ291bnRlciA9IDA7CgogIC8qKgogICAqIEEgc3ByaW5nLCBjb25uZWN0aW5nIHR3byBib2RpZXMuCiAgICogQGV4YW1wbGUKICAgKiAgICAgY29uc3Qgc3ByaW5nID0gbmV3IFNwcmluZyhib3hCb2R5LCBzcGhlcmVCb2R5LCB7CiAgICogICAgICAgcmVzdExlbmd0aDogMCwKICAgKiAgICAgICBzdGlmZm5lc3M6IDUwLAogICAqICAgICAgIGRhbXBpbmc6IDEsCiAgICogICAgIH0pCiAgICoKICAgKiAgICAgLy8gQ29tcHV0ZSB0aGUgZm9yY2UgYWZ0ZXIgZWFjaCBzdGVwCiAgICogICAgIHdvcmxkLmFkZEV2ZW50TGlzdGVuZXIoJ3Bvc3RTdGVwJywgKGV2ZW50KSA9PiB7CiAgICogICAgICAgc3ByaW5nLmFwcGx5Rm9yY2UoKQogICAqICAgICB9KQogICAqLwogIGNsYXNzIFNwcmluZyB7CiAgICAvKioKICAgICAqIFJlc3QgbGVuZ3RoIG9mIHRoZSBzcHJpbmcuIEEgbnVtYmVyID4gMC4KICAgICAqIEBkZWZhdWx0IDEKICAgICAqLwoKICAgIC8qKgogICAgICogU3RpZmZuZXNzIG9mIHRoZSBzcHJpbmcuIEEgbnVtYmVyID49IDAuCiAgICAgKiBAZGVmYXVsdCAxMDAKICAgICAqLwoKICAgIC8qKgogICAgICogRGFtcGluZyBvZiB0aGUgc3ByaW5nLiBBIG51bWJlciA+PSAwLgogICAgICogQGRlZmF1bHQgMQogICAgICovCgogICAgLyoqCiAgICAgKiBGaXJzdCBjb25uZWN0ZWQgYm9keS4KICAgICAqLwoKICAgIC8qKgogICAgICogU2Vjb25kIGNvbm5lY3RlZCBib2R5LgogICAgICovCgogICAgLyoqCiAgICAgKiBBbmNob3IgZm9yIGJvZHlBIGluIGxvY2FsIGJvZHlBIGNvb3JkaW5hdGVzLgogICAgICogV2hlcmUgdG8gaG9vayB0aGUgc3ByaW5nIHRvIGJvZHkgQSwgaW4gbG9jYWwgYm9keSBjb29yZGluYXRlcy4KICAgICAqIEBkZWZhdWx0IG5ldyBWZWMzKCkKICAgICAqLwoKICAgIC8qKgogICAgICogQW5jaG9yIGZvciBib2R5QiBpbiBsb2NhbCBib2R5QiBjb29yZGluYXRlcy4KICAgICAqIFdoZXJlIHRvIGhvb2sgdGhlIHNwcmluZyB0byBib2R5IEIsIGluIGxvY2FsIGJvZHkgY29vcmRpbmF0ZXMuCiAgICAgKiBAZGVmYXVsdCBuZXcgVmVjMygpCiAgICAgKi8KICAgIGNvbnN0cnVjdG9yKGJvZHlBLCBib2R5Qiwgb3B0aW9ucykgewogICAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7CiAgICAgICAgb3B0aW9ucyA9IHt9OwogICAgICB9CgogICAgICB0aGlzLnJlc3RMZW5ndGggPSB0eXBlb2Ygb3B0aW9ucy5yZXN0TGVuZ3RoID09PSAnbnVtYmVyJyA/IG9wdGlvbnMucmVzdExlbmd0aCA6IDE7CiAgICAgIHRoaXMuc3RpZmZuZXNzID0gb3B0aW9ucy5zdGlmZm5lc3MgfHwgMTAwOwogICAgICB0aGlzLmRhbXBpbmcgPSBvcHRpb25zLmRhbXBpbmcgfHwgMTsKICAgICAgdGhpcy5ib2R5QSA9IGJvZHlBOwogICAgICB0aGlzLmJvZHlCID0gYm9keUI7CiAgICAgIHRoaXMubG9jYWxBbmNob3JBID0gbmV3IFZlYzMoKTsKICAgICAgdGhpcy5sb2NhbEFuY2hvckIgPSBuZXcgVmVjMygpOwoKICAgICAgaWYgKG9wdGlvbnMubG9jYWxBbmNob3JBKSB7CiAgICAgICAgdGhpcy5sb2NhbEFuY2hvckEuY29weShvcHRpb25zLmxvY2FsQW5jaG9yQSk7CiAgICAgIH0KCiAgICAgIGlmIChvcHRpb25zLmxvY2FsQW5jaG9yQikgewogICAgICAgIHRoaXMubG9jYWxBbmNob3JCLmNvcHkob3B0aW9ucy5sb2NhbEFuY2hvckIpOwogICAgICB9CgogICAgICBpZiAob3B0aW9ucy53b3JsZEFuY2hvckEpIHsKICAgICAgICB0aGlzLnNldFdvcmxkQW5jaG9yQShvcHRpb25zLndvcmxkQW5jaG9yQSk7CiAgICAgIH0KCiAgICAgIGlmIChvcHRpb25zLndvcmxkQW5jaG9yQikgewogICAgICAgIHRoaXMuc2V0V29ybGRBbmNob3JCKG9wdGlvbnMud29ybGRBbmNob3JCKTsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBTZXQgdGhlIGFuY2hvciBwb2ludCBvbiBib2R5IEEsIHVzaW5nIHdvcmxkIGNvb3JkaW5hdGVzLgogICAgICovCgoKICAgIHNldFdvcmxkQW5jaG9yQSh3b3JsZEFuY2hvckEpIHsKICAgICAgdGhpcy5ib2R5QS5wb2ludFRvTG9jYWxGcmFtZSh3b3JsZEFuY2hvckEsIHRoaXMubG9jYWxBbmNob3JBKTsKICAgIH0KICAgIC8qKgogICAgICogU2V0IHRoZSBhbmNob3IgcG9pbnQgb24gYm9keSBCLCB1c2luZyB3b3JsZCBjb29yZGluYXRlcy4KICAgICAqLwoKCiAgICBzZXRXb3JsZEFuY2hvckIod29ybGRBbmNob3JCKSB7CiAgICAgIHRoaXMuYm9keUIucG9pbnRUb0xvY2FsRnJhbWUod29ybGRBbmNob3JCLCB0aGlzLmxvY2FsQW5jaG9yQik7CiAgICB9CiAgICAvKioKICAgICAqIEdldCB0aGUgYW5jaG9yIHBvaW50IG9uIGJvZHkgQSwgaW4gd29ybGQgY29vcmRpbmF0ZXMuCiAgICAgKiBAcGFyYW0gcmVzdWx0IFRoZSB2ZWN0b3IgdG8gc3RvcmUgdGhlIHJlc3VsdCBpbi4KICAgICAqLwoKCiAgICBnZXRXb3JsZEFuY2hvckEocmVzdWx0KSB7CiAgICAgIHRoaXMuYm9keUEucG9pbnRUb1dvcmxkRnJhbWUodGhpcy5sb2NhbEFuY2hvckEsIHJlc3VsdCk7CiAgICB9CiAgICAvKioKICAgICAqIEdldCB0aGUgYW5jaG9yIHBvaW50IG9uIGJvZHkgQiwgaW4gd29ybGQgY29vcmRpbmF0ZXMuCiAgICAgKiBAcGFyYW0gcmVzdWx0IFRoZSB2ZWN0b3IgdG8gc3RvcmUgdGhlIHJlc3VsdCBpbi4KICAgICAqLwoKCiAgICBnZXRXb3JsZEFuY2hvckIocmVzdWx0KSB7CiAgICAgIHRoaXMuYm9keUIucG9pbnRUb1dvcmxkRnJhbWUodGhpcy5sb2NhbEFuY2hvckIsIHJlc3VsdCk7CiAgICB9CiAgICAvKioKICAgICAqIEFwcGx5IHRoZSBzcHJpbmcgZm9yY2UgdG8gdGhlIGNvbm5lY3RlZCBib2RpZXMuCiAgICAgKi8KCgogICAgYXBwbHlGb3JjZSgpIHsKICAgICAgY29uc3QgayA9IHRoaXMuc3RpZmZuZXNzOwogICAgICBjb25zdCBkID0gdGhpcy5kYW1waW5nOwogICAgICBjb25zdCBsID0gdGhpcy5yZXN0TGVuZ3RoOwogICAgICBjb25zdCBib2R5QSA9IHRoaXMuYm9keUE7CiAgICAgIGNvbnN0IGJvZHlCID0gdGhpcy5ib2R5QjsKICAgICAgY29uc3QgciA9IGFwcGx5Rm9yY2VfcjsKICAgICAgY29uc3Qgcl91bml0ID0gYXBwbHlGb3JjZV9yX3VuaXQ7CiAgICAgIGNvbnN0IHUgPSBhcHBseUZvcmNlX3U7CiAgICAgIGNvbnN0IGYgPSBhcHBseUZvcmNlX2Y7CiAgICAgIGNvbnN0IHRtcCA9IGFwcGx5Rm9yY2VfdG1wOwogICAgICBjb25zdCB3b3JsZEFuY2hvckEgPSBhcHBseUZvcmNlX3dvcmxkQW5jaG9yQTsKICAgICAgY29uc3Qgd29ybGRBbmNob3JCID0gYXBwbHlGb3JjZV93b3JsZEFuY2hvckI7CiAgICAgIGNvbnN0IHJpID0gYXBwbHlGb3JjZV9yaTsKICAgICAgY29uc3QgcmogPSBhcHBseUZvcmNlX3JqOwogICAgICBjb25zdCByaV94X2YgPSBhcHBseUZvcmNlX3JpX3hfZjsKICAgICAgY29uc3QgcmpfeF9mID0gYXBwbHlGb3JjZV9yal94X2Y7IC8vIEdldCB3b3JsZCBhbmNob3JzCgogICAgICB0aGlzLmdldFdvcmxkQW5jaG9yQSh3b3JsZEFuY2hvckEpOwogICAgICB0aGlzLmdldFdvcmxkQW5jaG9yQih3b3JsZEFuY2hvckIpOyAvLyBHZXQgb2Zmc2V0IHBvaW50cwoKICAgICAgd29ybGRBbmNob3JBLnZzdWIoYm9keUEucG9zaXRpb24sIHJpKTsKICAgICAgd29ybGRBbmNob3JCLnZzdWIoYm9keUIucG9zaXRpb24sIHJqKTsgLy8gQ29tcHV0ZSBkaXN0YW5jZSB2ZWN0b3IgYmV0d2VlbiB3b3JsZCBhbmNob3IgcG9pbnRzCgogICAgICB3b3JsZEFuY2hvckIudnN1Yih3b3JsZEFuY2hvckEsIHIpOwogICAgICBjb25zdCBybGVuID0gci5sZW5ndGgoKTsKICAgICAgcl91bml0LmNvcHkocik7CiAgICAgIHJfdW5pdC5ub3JtYWxpemUoKTsgLy8gQ29tcHV0ZSByZWxhdGl2ZSB2ZWxvY2l0eSBvZiB0aGUgYW5jaG9yIHBvaW50cywgdQoKICAgICAgYm9keUIudmVsb2NpdHkudnN1Yihib2R5QS52ZWxvY2l0eSwgdSk7IC8vIEFkZCByb3RhdGlvbmFsIHZlbG9jaXR5CgogICAgICBib2R5Qi5hbmd1bGFyVmVsb2NpdHkuY3Jvc3MocmosIHRtcCk7CiAgICAgIHUudmFkZCh0bXAsIHUpOwogICAgICBib2R5QS5hbmd1bGFyVmVsb2NpdHkuY3Jvc3MocmksIHRtcCk7CiAgICAgIHUudnN1Yih0bXAsIHUpOyAvLyBGID0gLSBrICogKCB4IC0gTCApIC0gRCAqICggdSApCgogICAgICByX3VuaXQuc2NhbGUoLWsgKiAocmxlbiAtIGwpIC0gZCAqIHUuZG90KHJfdW5pdCksIGYpOyAvLyBBZGQgZm9yY2VzIHRvIGJvZGllcwoKICAgICAgYm9keUEuZm9yY2UudnN1YihmLCBib2R5QS5mb3JjZSk7CiAgICAgIGJvZHlCLmZvcmNlLnZhZGQoZiwgYm9keUIuZm9yY2UpOyAvLyBBbmd1bGFyIGZvcmNlCgogICAgICByaS5jcm9zcyhmLCByaV94X2YpOwogICAgICByai5jcm9zcyhmLCByal94X2YpOwogICAgICBib2R5QS50b3JxdWUudnN1YihyaV94X2YsIGJvZHlBLnRvcnF1ZSk7CiAgICAgIGJvZHlCLnRvcnF1ZS52YWRkKHJqX3hfZiwgYm9keUIudG9ycXVlKTsKICAgIH0KCiAgfQogIGNvbnN0IGFwcGx5Rm9yY2VfciA9IG5ldyBWZWMzKCk7CiAgY29uc3QgYXBwbHlGb3JjZV9yX3VuaXQgPSBuZXcgVmVjMygpOwogIGNvbnN0IGFwcGx5Rm9yY2VfdSA9IG5ldyBWZWMzKCk7CiAgY29uc3QgYXBwbHlGb3JjZV9mID0gbmV3IFZlYzMoKTsKICBjb25zdCBhcHBseUZvcmNlX3dvcmxkQW5jaG9yQSA9IG5ldyBWZWMzKCk7CiAgY29uc3QgYXBwbHlGb3JjZV93b3JsZEFuY2hvckIgPSBuZXcgVmVjMygpOwogIGNvbnN0IGFwcGx5Rm9yY2VfcmkgPSBuZXcgVmVjMygpOwogIGNvbnN0IGFwcGx5Rm9yY2VfcmogPSBuZXcgVmVjMygpOwogIGNvbnN0IGFwcGx5Rm9yY2VfcmlfeF9mID0gbmV3IFZlYzMoKTsKICBjb25zdCBhcHBseUZvcmNlX3JqX3hfZiA9IG5ldyBWZWMzKCk7CiAgY29uc3QgYXBwbHlGb3JjZV90bXAgPSBuZXcgVmVjMygpOwoKICAvKioKICAgKiBXaGVlbEluZm8KICAgKi8KICBjbGFzcyBXaGVlbEluZm8gewogICAgLyoqCiAgICAgKiBNYXggdHJhdmVsIGRpc3RhbmNlIG9mIHRoZSBzdXNwZW5zaW9uLCBpbiBtZXRlcnMuCiAgICAgKiBAZGVmYXVsdCAxCiAgICAgKi8KCiAgICAvKioKICAgICAqIFNwZWVkIHRvIGFwcGx5IHRvIHRoZSB3aGVlbCByb3RhdGlvbiB3aGVuIHRoZSB3aGVlbCBpcyBzbGlkaW5nLgogICAgICogQGRlZmF1bHQgLTAuMQogICAgICovCgogICAgLyoqCiAgICAgKiBJZiB0aGUgY3VzdG9tU2xpZGluZ1JvdGF0aW9uYWxTcGVlZCBzaG91bGQgYmUgdXNlZC4KICAgICAqIEBkZWZhdWx0IGZhbHNlCiAgICAgKi8KCiAgICAvKioKICAgICAqIHNsaWRpbmcKICAgICAqLwoKICAgIC8qKgogICAgICogQ29ubmVjdGlvbiBwb2ludCwgZGVmaW5lZCBsb2NhbGx5IGluIHRoZSBjaGFzc2lzIGJvZHkgZnJhbWUuCiAgICAgKi8KCiAgICAvKioKICAgICAqIGNoYXNzaXNDb25uZWN0aW9uUG9pbnRXb3JsZAogICAgICovCgogICAgLyoqCiAgICAgKiBkaXJlY3Rpb25Mb2NhbAogICAgICovCgogICAgLyoqCiAgICAgKiBkaXJlY3Rpb25Xb3JsZAogICAgICovCgogICAgLyoqCiAgICAgKiBheGxlTG9jYWwKICAgICAqLwoKICAgIC8qKgogICAgICogYXhsZVdvcmxkCiAgICAgKi8KCiAgICAvKioKICAgICAqIHN1c3BlbnNpb25SZXN0TGVuZ3RoCiAgICAgKiBAZGVmYXVsdCAxCiAgICAgKi8KCiAgICAvKioKICAgICAqIHN1c3BlbnNpb25NYXhMZW5ndGgKICAgICAqIEBkZWZhdWx0IDIKICAgICAqLwoKICAgIC8qKgogICAgICogcmFkaXVzCiAgICAgKiBAZGVmYXVsdCAxCiAgICAgKi8KCiAgICAvKioKICAgICAqIHN1c3BlbnNpb25TdGlmZm5lc3MKICAgICAqIEBkZWZhdWx0IDEwMAogICAgICovCgogICAgLyoqCiAgICAgKiBkYW1waW5nQ29tcHJlc3Npb24KICAgICAqIEBkZWZhdWx0IDEwCiAgICAgKi8KCiAgICAvKioKICAgICAqIGRhbXBpbmdSZWxheGF0aW9uCiAgICAgKiBAZGVmYXVsdCAxMAogICAgICovCgogICAgLyoqCiAgICAgKiBmcmljdGlvblNsaXAKICAgICAqIEBkZWZhdWx0IDEwLjUKICAgICAqLwoKICAgIC8qKiBmb3J3YXJkQWNjZWxlcmF0aW9uICovCgogICAgLyoqIHNpZGVBY2NlbGVyYXRpb24gKi8KCiAgICAvKioKICAgICAqIHN0ZWVyaW5nCiAgICAgKiBAZGVmYXVsdCAwCiAgICAgKi8KCiAgICAvKioKICAgICAqIFJvdGF0aW9uIHZhbHVlLCBpbiByYWRpYW5zLgogICAgICogQGRlZmF1bHQgMAogICAgICovCgogICAgLyoqCiAgICAgKiBkZWx0YVJvdGF0aW9uCiAgICAgKiBAZGVmYXVsdCAwCiAgICAgKi8KCiAgICAvKioKICAgICAqIHJvbGxJbmZsdWVuY2UKICAgICAqIEBkZWZhdWx0IDAuMDEKICAgICAqLwoKICAgIC8qKgogICAgICogbWF4U3VzcGVuc2lvbkZvcmNlCiAgICAgKi8KCiAgICAvKioKICAgICAqIGVuZ2luZUZvcmNlCiAgICAgKi8KCiAgICAvKioKICAgICAqIGJyYWtlCiAgICAgKi8KCiAgICAvKioKICAgICAqIGlzRnJvbnRXaGVlbAogICAgICogQGRlZmF1bHQgdHJ1ZQogICAgICovCgogICAgLyoqCiAgICAgKiBjbGlwcGVkSW52Q29udGFjdERvdFN1c3BlbnNpb24KICAgICAqIEBkZWZhdWx0IDEKICAgICAqLwoKICAgIC8qKgogICAgICogc3VzcGVuc2lvblJlbGF0aXZlVmVsb2NpdHkKICAgICAqIEBkZWZhdWx0IDAKICAgICAqLwoKICAgIC8qKgogICAgICogc3VzcGVuc2lvbkZvcmNlCiAgICAgKiBAZGVmYXVsdCAwCiAgICAgKi8KCiAgICAvKioKICAgICAqIHNsaXBJbmZvCiAgICAgKi8KCiAgICAvKioKICAgICAqIHNraWRJbmZvCiAgICAgKiBAZGVmYXVsdCAwCiAgICAgKi8KCiAgICAvKioKICAgICAqIHN1c3BlbnNpb25MZW5ndGgKICAgICAqIEBkZWZhdWx0IDAKICAgICAqLwoKICAgIC8qKgogICAgICogc2lkZUltcHVsc2UKICAgICAqLwoKICAgIC8qKgogICAgICogZm9yd2FyZEltcHVsc2UKICAgICAqLwoKICAgIC8qKgogICAgICogVGhlIHJlc3VsdCBmcm9tIHJheWNhc3RpbmcuCiAgICAgKi8KCiAgICAvKioKICAgICAqIFdoZWVsIHdvcmxkIHRyYW5zZm9ybS4KICAgICAqLwoKICAgIC8qKgogICAgICogaXNJbkNvbnRhY3QKICAgICAqLwogICAgY29uc3RydWN0b3Iob3B0aW9ucykgewogICAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7CiAgICAgICAgb3B0aW9ucyA9IHt9OwogICAgICB9CgogICAgICBvcHRpb25zID0gVXRpbHMuZGVmYXVsdHMob3B0aW9ucywgewogICAgICAgIGNoYXNzaXNDb25uZWN0aW9uUG9pbnRMb2NhbDogbmV3IFZlYzMoKSwKICAgICAgICBjaGFzc2lzQ29ubmVjdGlvblBvaW50V29ybGQ6IG5ldyBWZWMzKCksCiAgICAgICAgZGlyZWN0aW9uTG9jYWw6IG5ldyBWZWMzKCksCiAgICAgICAgZGlyZWN0aW9uV29ybGQ6IG5ldyBWZWMzKCksCiAgICAgICAgYXhsZUxvY2FsOiBuZXcgVmVjMygpLAogICAgICAgIGF4bGVXb3JsZDogbmV3IFZlYzMoKSwKICAgICAgICBzdXNwZW5zaW9uUmVzdExlbmd0aDogMSwKICAgICAgICBzdXNwZW5zaW9uTWF4TGVuZ3RoOiAyLAogICAgICAgIHJhZGl1czogMSwKICAgICAgICBzdXNwZW5zaW9uU3RpZmZuZXNzOiAxMDAsCiAgICAgICAgZGFtcGluZ0NvbXByZXNzaW9uOiAxMCwKICAgICAgICBkYW1waW5nUmVsYXhhdGlvbjogMTAsCiAgICAgICAgZnJpY3Rpb25TbGlwOiAxMC41LAogICAgICAgIGZvcndhcmRBY2NlbGVyYXRpb246IDEsCiAgICAgICAgc2lkZUFjY2VsZXJhdGlvbjogMSwKICAgICAgICBzdGVlcmluZzogMCwKICAgICAgICByb3RhdGlvbjogMCwKICAgICAgICBkZWx0YVJvdGF0aW9uOiAwLAogICAgICAgIHJvbGxJbmZsdWVuY2U6IDAuMDEsCiAgICAgICAgbWF4U3VzcGVuc2lvbkZvcmNlOiBOdW1iZXIuTUFYX1ZBTFVFLAogICAgICAgIGlzRnJvbnRXaGVlbDogdHJ1ZSwKICAgICAgICBjbGlwcGVkSW52Q29udGFjdERvdFN1c3BlbnNpb246IDEsCiAgICAgICAgc3VzcGVuc2lvblJlbGF0aXZlVmVsb2NpdHk6IDAsCiAgICAgICAgc3VzcGVuc2lvbkZvcmNlOiAwLAogICAgICAgIHNsaXBJbmZvOiAwLAogICAgICAgIHNraWRJbmZvOiAwLAogICAgICAgIHN1c3BlbnNpb25MZW5ndGg6IDAsCiAgICAgICAgbWF4U3VzcGVuc2lvblRyYXZlbDogMSwKICAgICAgICB1c2VDdXN0b21TbGlkaW5nUm90YXRpb25hbFNwZWVkOiBmYWxzZSwKICAgICAgICBjdXN0b21TbGlkaW5nUm90YXRpb25hbFNwZWVkOiAtMC4xCiAgICAgIH0pOwogICAgICB0aGlzLm1heFN1c3BlbnNpb25UcmF2ZWwgPSBvcHRpb25zLm1heFN1c3BlbnNpb25UcmF2ZWw7CiAgICAgIHRoaXMuY3VzdG9tU2xpZGluZ1JvdGF0aW9uYWxTcGVlZCA9IG9wdGlvbnMuY3VzdG9tU2xpZGluZ1JvdGF0aW9uYWxTcGVlZDsKICAgICAgdGhpcy51c2VDdXN0b21TbGlkaW5nUm90YXRpb25hbFNwZWVkID0gb3B0aW9ucy51c2VDdXN0b21TbGlkaW5nUm90YXRpb25hbFNwZWVkOwogICAgICB0aGlzLnNsaWRpbmcgPSBmYWxzZTsKICAgICAgdGhpcy5jaGFzc2lzQ29ubmVjdGlvblBvaW50TG9jYWwgPSBvcHRpb25zLmNoYXNzaXNDb25uZWN0aW9uUG9pbnRMb2NhbC5jbG9uZSgpOwogICAgICB0aGlzLmNoYXNzaXNDb25uZWN0aW9uUG9pbnRXb3JsZCA9IG9wdGlvbnMuY2hhc3Npc0Nvbm5lY3Rpb25Qb2ludFdvcmxkLmNsb25lKCk7CiAgICAgIHRoaXMuZGlyZWN0aW9uTG9jYWwgPSBvcHRpb25zLmRpcmVjdGlvbkxvY2FsLmNsb25lKCk7CiAgICAgIHRoaXMuZGlyZWN0aW9uV29ybGQgPSBvcHRpb25zLmRpcmVjdGlvbldvcmxkLmNsb25lKCk7CiAgICAgIHRoaXMuYXhsZUxvY2FsID0gb3B0aW9ucy5heGxlTG9jYWwuY2xvbmUoKTsKICAgICAgdGhpcy5heGxlV29ybGQgPSBvcHRpb25zLmF4bGVXb3JsZC5jbG9uZSgpOwogICAgICB0aGlzLnN1c3BlbnNpb25SZXN0TGVuZ3RoID0gb3B0aW9ucy5zdXNwZW5zaW9uUmVzdExlbmd0aDsKICAgICAgdGhpcy5zdXNwZW5zaW9uTWF4TGVuZ3RoID0gb3B0aW9ucy5zdXNwZW5zaW9uTWF4TGVuZ3RoOwogICAgICB0aGlzLnJhZGl1cyA9IG9wdGlvbnMucmFkaXVzOwogICAgICB0aGlzLnN1c3BlbnNpb25TdGlmZm5lc3MgPSBvcHRpb25zLnN1c3BlbnNpb25TdGlmZm5lc3M7CiAgICAgIHRoaXMuZGFtcGluZ0NvbXByZXNzaW9uID0gb3B0aW9ucy5kYW1waW5nQ29tcHJlc3Npb247CiAgICAgIHRoaXMuZGFtcGluZ1JlbGF4YXRpb24gPSBvcHRpb25zLmRhbXBpbmdSZWxheGF0aW9uOwogICAgICB0aGlzLmZyaWN0aW9uU2xpcCA9IG9wdGlvbnMuZnJpY3Rpb25TbGlwOwogICAgICB0aGlzLmZvcndhcmRBY2NlbGVyYXRpb24gPSBvcHRpb25zLmZvcndhcmRBY2NlbGVyYXRpb247CiAgICAgIHRoaXMuc2lkZUFjY2VsZXJhdGlvbiA9IG9wdGlvbnMuc2lkZUFjY2VsZXJhdGlvbjsKICAgICAgdGhpcy5zdGVlcmluZyA9IDA7CiAgICAgIHRoaXMucm90YXRpb24gPSAwOwogICAgICB0aGlzLmRlbHRhUm90YXRpb24gPSAwOwogICAgICB0aGlzLnJvbGxJbmZsdWVuY2UgPSBvcHRpb25zLnJvbGxJbmZsdWVuY2U7CiAgICAgIHRoaXMubWF4U3VzcGVuc2lvbkZvcmNlID0gb3B0aW9ucy5tYXhTdXNwZW5zaW9uRm9yY2U7CiAgICAgIHRoaXMuZW5naW5lRm9yY2UgPSAwOwogICAgICB0aGlzLmJyYWtlID0gMDsKICAgICAgdGhpcy5pc0Zyb250V2hlZWwgPSBvcHRpb25zLmlzRnJvbnRXaGVlbDsKICAgICAgdGhpcy5jbGlwcGVkSW52Q29udGFjdERvdFN1c3BlbnNpb24gPSAxOwogICAgICB0aGlzLnN1c3BlbnNpb25SZWxhdGl2ZVZlbG9jaXR5ID0gMDsKICAgICAgdGhpcy5zdXNwZW5zaW9uRm9yY2UgPSAwOwogICAgICB0aGlzLnNsaXBJbmZvID0gMDsKICAgICAgdGhpcy5za2lkSW5mbyA9IDA7CiAgICAgIHRoaXMuc3VzcGVuc2lvbkxlbmd0aCA9IDA7CiAgICAgIHRoaXMuc2lkZUltcHVsc2UgPSAwOwogICAgICB0aGlzLmZvcndhcmRJbXB1bHNlID0gMDsKICAgICAgdGhpcy5yYXljYXN0UmVzdWx0ID0gbmV3IFJheWNhc3RSZXN1bHQoKTsKICAgICAgdGhpcy53b3JsZFRyYW5zZm9ybSA9IG5ldyBUcmFuc2Zvcm0oKTsKICAgICAgdGhpcy5pc0luQ29udGFjdCA9IGZhbHNlOwogICAgfQoKICAgIHVwZGF0ZVdoZWVsKGNoYXNzaXMpIHsKICAgICAgY29uc3QgcmF5Y2FzdFJlc3VsdCA9IHRoaXMucmF5Y2FzdFJlc3VsdDsKCiAgICAgIGlmICh0aGlzLmlzSW5Db250YWN0KSB7CiAgICAgICAgY29uc3QgcHJvamVjdCA9IHJheWNhc3RSZXN1bHQuaGl0Tm9ybWFsV29ybGQuZG90KHJheWNhc3RSZXN1bHQuZGlyZWN0aW9uV29ybGQpOwogICAgICAgIHJheWNhc3RSZXN1bHQuaGl0UG9pbnRXb3JsZC52c3ViKGNoYXNzaXMucG9zaXRpb24sIHJlbHBvcyk7CiAgICAgICAgY2hhc3Npcy5nZXRWZWxvY2l0eUF0V29ybGRQb2ludChyZWxwb3MsIGNoYXNzaXNfdmVsb2NpdHlfYXRfY29udGFjdFBvaW50KTsKICAgICAgICBjb25zdCBwcm9qVmVsID0gcmF5Y2FzdFJlc3VsdC5oaXROb3JtYWxXb3JsZC5kb3QoY2hhc3Npc192ZWxvY2l0eV9hdF9jb250YWN0UG9pbnQpOwoKICAgICAgICBpZiAocHJvamVjdCA+PSAtMC4xKSB7CiAgICAgICAgICB0aGlzLnN1c3BlbnNpb25SZWxhdGl2ZVZlbG9jaXR5ID0gMC4wOwogICAgICAgICAgdGhpcy5jbGlwcGVkSW52Q29udGFjdERvdFN1c3BlbnNpb24gPSAxLjAgLyAwLjE7CiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgIGNvbnN0IGludiA9IC0xIC8gcHJvamVjdDsKICAgICAgICAgIHRoaXMuc3VzcGVuc2lvblJlbGF0aXZlVmVsb2NpdHkgPSBwcm9qVmVsICogaW52OwogICAgICAgICAgdGhpcy5jbGlwcGVkSW52Q29udGFjdERvdFN1c3BlbnNpb24gPSBpbnY7CiAgICAgICAgfQogICAgICB9IGVsc2UgewogICAgICAgIC8vIE5vdCBpbiBjb250YWN0IDogcG9zaXRpb24gd2hlZWwgaW4gYSBuaWNlIChyZXN0IGxlbmd0aCkgcG9zaXRpb24KICAgICAgICByYXljYXN0UmVzdWx0LnN1c3BlbnNpb25MZW5ndGggPSB0aGlzLnN1c3BlbnNpb25SZXN0TGVuZ3RoOwogICAgICAgIHRoaXMuc3VzcGVuc2lvblJlbGF0aXZlVmVsb2NpdHkgPSAwLjA7CiAgICAgICAgcmF5Y2FzdFJlc3VsdC5kaXJlY3Rpb25Xb3JsZC5zY2FsZSgtMSwgcmF5Y2FzdFJlc3VsdC5oaXROb3JtYWxXb3JsZCk7CiAgICAgICAgdGhpcy5jbGlwcGVkSW52Q29udGFjdERvdFN1c3BlbnNpb24gPSAxLjA7CiAgICAgIH0KICAgIH0KCiAgfQogIGNvbnN0IGNoYXNzaXNfdmVsb2NpdHlfYXRfY29udGFjdFBvaW50ID0gbmV3IFZlYzMoKTsKICBjb25zdCByZWxwb3MgPSBuZXcgVmVjMygpOwoKICAvKioKICAgKiBWZWhpY2xlIGhlbHBlciBjbGFzcyB0aGF0IGNhc3RzIHJheXMgZnJvbSB0aGUgd2hlZWwgcG9zaXRpb25zIHRvd2FyZHMgdGhlIGdyb3VuZCBhbmQgYXBwbGllcyBmb3JjZXMuCiAgICovCiAgY2xhc3MgUmF5Y2FzdFZlaGljbGUgewogICAgLyoqIFRoZSBjYXIgY2hhc3NpcyBib2R5LiAqLwoKICAgIC8qKiBUaGUgd2hlZWxzLiAqLwoKICAgIC8qKiBXaWxsIGJlIHNldCB0byB0cnVlIGlmIHRoZSBjYXIgaXMgc2xpZGluZy4gKi8KCiAgICAvKiogSW5kZXggb2YgdGhlIHJpZ2h0IGF4aXMuIHg9MCwgeT0xLCB6PTIgKi8KCiAgICAvKiogSW5kZXggb2YgdGhlIGZvcndhcmQgYXhpcy4geD0wLCB5PTEsIHo9MiAqLwoKICAgIC8qKiBJbmRleCBvZiB0aGUgdXAgYXhpcy4geD0wLCB5PTEsIHo9MiAqLwoKICAgIC8qKiBUaGUgY29uc3RyYWludHMuICovCgogICAgLyoqIE9wdGlvbmFsIHByZS1zdGVwIGNhbGxiYWNrLiAqLwoKICAgIC8qKiBOdW1iZXIgb2Ygd2hlZWxzIG9uIHRoZSBncm91bmQuICovCiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7CiAgICAgIHRoaXMuY2hhc3Npc0JvZHkgPSBvcHRpb25zLmNoYXNzaXNCb2R5OwogICAgICB0aGlzLndoZWVsSW5mb3MgPSBbXTsKICAgICAgdGhpcy5zbGlkaW5nID0gZmFsc2U7CiAgICAgIHRoaXMud29ybGQgPSBudWxsOwogICAgICB0aGlzLmluZGV4UmlnaHRBeGlzID0gdHlwZW9mIG9wdGlvbnMuaW5kZXhSaWdodEF4aXMgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5pbmRleFJpZ2h0QXhpcyA6IDI7CiAgICAgIHRoaXMuaW5kZXhGb3J3YXJkQXhpcyA9IHR5cGVvZiBvcHRpb25zLmluZGV4Rm9yd2FyZEF4aXMgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5pbmRleEZvcndhcmRBeGlzIDogMDsKICAgICAgdGhpcy5pbmRleFVwQXhpcyA9IHR5cGVvZiBvcHRpb25zLmluZGV4VXBBeGlzICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuaW5kZXhVcEF4aXMgOiAxOwogICAgICB0aGlzLmNvbnN0cmFpbnRzID0gW107CgogICAgICB0aGlzLnByZVN0ZXBDYWxsYmFjayA9ICgpID0+IHt9OwoKICAgICAgdGhpcy5jdXJyZW50VmVoaWNsZVNwZWVkS21Ib3VyID0gMDsKICAgICAgdGhpcy5udW1XaGVlbHNPbkdyb3VuZCA9IDA7CiAgICB9CiAgICAvKioKICAgICAqIEFkZCBhIHdoZWVsLiBGb3IgaW5mb3JtYXRpb24gYWJvdXQgdGhlIG9wdGlvbnMsIHNlZSBgV2hlZWxJbmZvYC4KICAgICAqLwoKCiAgICBhZGRXaGVlbChvcHRpb25zKSB7CiAgICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsKICAgICAgICBvcHRpb25zID0ge307CiAgICAgIH0KCiAgICAgIGNvbnN0IGluZm8gPSBuZXcgV2hlZWxJbmZvKG9wdGlvbnMpOwogICAgICBjb25zdCBpbmRleCA9IHRoaXMud2hlZWxJbmZvcy5sZW5ndGg7CiAgICAgIHRoaXMud2hlZWxJbmZvcy5wdXNoKGluZm8pOwogICAgICByZXR1cm4gaW5kZXg7CiAgICB9CiAgICAvKioKICAgICAqIFNldCB0aGUgc3RlZXJpbmcgdmFsdWUgb2YgYSB3aGVlbC4KICAgICAqLwoKCiAgICBzZXRTdGVlcmluZ1ZhbHVlKHZhbHVlLCB3aGVlbEluZGV4KSB7CiAgICAgIGNvbnN0IHdoZWVsID0gdGhpcy53aGVlbEluZm9zW3doZWVsSW5kZXhdOwogICAgICB3aGVlbC5zdGVlcmluZyA9IHZhbHVlOwogICAgfQogICAgLyoqCiAgICAgKiBTZXQgdGhlIHdoZWVsIGZvcmNlIHRvIGFwcGx5IG9uIG9uZSBvZiB0aGUgd2hlZWxzIGVhY2ggdGltZSBzdGVwCiAgICAgKi8KCgogICAgYXBwbHlFbmdpbmVGb3JjZSh2YWx1ZSwgd2hlZWxJbmRleCkgewogICAgICB0aGlzLndoZWVsSW5mb3Nbd2hlZWxJbmRleF0uZW5naW5lRm9yY2UgPSB2YWx1ZTsKICAgIH0KICAgIC8qKgogICAgICogU2V0IHRoZSBicmFraW5nIGZvcmNlIG9mIGEgd2hlZWwKICAgICAqLwoKCiAgICBzZXRCcmFrZShicmFrZSwgd2hlZWxJbmRleCkgewogICAgICB0aGlzLndoZWVsSW5mb3Nbd2hlZWxJbmRleF0uYnJha2UgPSBicmFrZTsKICAgIH0KICAgIC8qKgogICAgICogQWRkIHRoZSB2ZWhpY2xlIGluY2x1ZGluZyBpdHMgY29uc3RyYWludHMgdG8gdGhlIHdvcmxkLgogICAgICovCgoKICAgIGFkZFRvV29ybGQod29ybGQpIHsKICAgICAgd29ybGQuYWRkQm9keSh0aGlzLmNoYXNzaXNCb2R5KTsKICAgICAgY29uc3QgdGhhdCA9IHRoaXM7CgogICAgICB0aGlzLnByZVN0ZXBDYWxsYmFjayA9ICgpID0+IHsKICAgICAgICB0aGF0LnVwZGF0ZVZlaGljbGUod29ybGQuZHQpOwogICAgICB9OwoKICAgICAgd29ybGQuYWRkRXZlbnRMaXN0ZW5lcigncHJlU3RlcCcsIHRoaXMucHJlU3RlcENhbGxiYWNrKTsKICAgICAgdGhpcy53b3JsZCA9IHdvcmxkOwogICAgfQogICAgLyoqCiAgICAgKiBHZXQgb25lIG9mIHRoZSB3aGVlbCBheGxlcywgd29ybGQtb3JpZW50ZWQuCiAgICAgKi8KCgogICAgZ2V0VmVoaWNsZUF4aXNXb3JsZChheGlzSW5kZXgsIHJlc3VsdCkgewogICAgICByZXN1bHQuc2V0KGF4aXNJbmRleCA9PT0gMCA/IDEgOiAwLCBheGlzSW5kZXggPT09IDEgPyAxIDogMCwgYXhpc0luZGV4ID09PSAyID8gMSA6IDApOwogICAgICB0aGlzLmNoYXNzaXNCb2R5LnZlY3RvclRvV29ybGRGcmFtZShyZXN1bHQsIHJlc3VsdCk7CiAgICB9CgogICAgdXBkYXRlVmVoaWNsZSh0aW1lU3RlcCkgewogICAgICBjb25zdCB3aGVlbEluZm9zID0gdGhpcy53aGVlbEluZm9zOwogICAgICBjb25zdCBudW1XaGVlbHMgPSB3aGVlbEluZm9zLmxlbmd0aDsKICAgICAgY29uc3QgY2hhc3Npc0JvZHkgPSB0aGlzLmNoYXNzaXNCb2R5OwoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1XaGVlbHM7IGkrKykgewogICAgICAgIHRoaXMudXBkYXRlV2hlZWxUcmFuc2Zvcm0oaSk7CiAgICAgIH0KCiAgICAgIHRoaXMuY3VycmVudFZlaGljbGVTcGVlZEttSG91ciA9IDMuNiAqIGNoYXNzaXNCb2R5LnZlbG9jaXR5Lmxlbmd0aCgpOwogICAgICBjb25zdCBmb3J3YXJkV29ybGQgPSBuZXcgVmVjMygpOwogICAgICB0aGlzLmdldFZlaGljbGVBeGlzV29ybGQodGhpcy5pbmRleEZvcndhcmRBeGlzLCBmb3J3YXJkV29ybGQpOwoKICAgICAgaWYgKGZvcndhcmRXb3JsZC5kb3QoY2hhc3Npc0JvZHkudmVsb2NpdHkpIDwgMCkgewogICAgICAgIHRoaXMuY3VycmVudFZlaGljbGVTcGVlZEttSG91ciAqPSAtMTsKICAgICAgfSAvLyBzaW11bGF0ZSBzdXNwZW5zaW9uCgoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1XaGVlbHM7IGkrKykgewogICAgICAgIHRoaXMuY2FzdFJheSh3aGVlbEluZm9zW2ldKTsKICAgICAgfQoKICAgICAgdGhpcy51cGRhdGVTdXNwZW5zaW9uKHRpbWVTdGVwKTsKICAgICAgY29uc3QgaW1wdWxzZSA9IG5ldyBWZWMzKCk7CiAgICAgIGNvbnN0IHJlbHBvcyA9IG5ldyBWZWMzKCk7CgogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVdoZWVsczsgaSsrKSB7CiAgICAgICAgLy9hcHBseSBzdXNwZW5zaW9uIGZvcmNlCiAgICAgICAgY29uc3Qgd2hlZWwgPSB3aGVlbEluZm9zW2ldOwogICAgICAgIGxldCBzdXNwZW5zaW9uRm9yY2UgPSB3aGVlbC5zdXNwZW5zaW9uRm9yY2U7CgogICAgICAgIGlmIChzdXNwZW5zaW9uRm9yY2UgPiB3aGVlbC5tYXhTdXNwZW5zaW9uRm9yY2UpIHsKICAgICAgICAgIHN1c3BlbnNpb25Gb3JjZSA9IHdoZWVsLm1heFN1c3BlbnNpb25Gb3JjZTsKICAgICAgICB9CgogICAgICAgIHdoZWVsLnJheWNhc3RSZXN1bHQuaGl0Tm9ybWFsV29ybGQuc2NhbGUoc3VzcGVuc2lvbkZvcmNlICogdGltZVN0ZXAsIGltcHVsc2UpOwogICAgICAgIHdoZWVsLnJheWNhc3RSZXN1bHQuaGl0UG9pbnRXb3JsZC52c3ViKGNoYXNzaXNCb2R5LnBvc2l0aW9uLCByZWxwb3MpOwogICAgICAgIGNoYXNzaXNCb2R5LmFwcGx5SW1wdWxzZShpbXB1bHNlLCByZWxwb3MpOwogICAgICB9CgogICAgICB0aGlzLnVwZGF0ZUZyaWN0aW9uKHRpbWVTdGVwKTsKICAgICAgY29uc3QgaGl0Tm9ybWFsV29ybGRTY2FsZWRXaXRoUHJvaiA9IG5ldyBWZWMzKCk7CiAgICAgIGNvbnN0IGZ3ZCA9IG5ldyBWZWMzKCk7CiAgICAgIGNvbnN0IHZlbCA9IG5ldyBWZWMzKCk7CgogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVdoZWVsczsgaSsrKSB7CiAgICAgICAgY29uc3Qgd2hlZWwgPSB3aGVlbEluZm9zW2ldOyAvL2NvbnN0IHJlbHBvcyA9IG5ldyBWZWMzKCk7CiAgICAgICAgLy93aGVlbC5jaGFzc2lzQ29ubmVjdGlvblBvaW50V29ybGQudnN1YihjaGFzc2lzQm9keS5wb3NpdGlvbiwgcmVscG9zKTsKCiAgICAgICAgY2hhc3Npc0JvZHkuZ2V0VmVsb2NpdHlBdFdvcmxkUG9pbnQod2hlZWwuY2hhc3Npc0Nvbm5lY3Rpb25Qb2ludFdvcmxkLCB2ZWwpOyAvLyBIYWNrIHRvIGdldCB0aGUgcm90YXRpb24gaW4gdGhlIGNvcnJlY3QgZGlyZWN0aW9uCgogICAgICAgIGxldCBtID0gMTsKCiAgICAgICAgc3dpdGNoICh0aGlzLmluZGV4VXBBeGlzKSB7CiAgICAgICAgICBjYXNlIDE6CiAgICAgICAgICAgIG0gPSAtMTsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgfQoKICAgICAgICBpZiAod2hlZWwuaXNJbkNvbnRhY3QpIHsKICAgICAgICAgIHRoaXMuZ2V0VmVoaWNsZUF4aXNXb3JsZCh0aGlzLmluZGV4Rm9yd2FyZEF4aXMsIGZ3ZCk7CiAgICAgICAgICBjb25zdCBwcm9qID0gZndkLmRvdCh3aGVlbC5yYXljYXN0UmVzdWx0LmhpdE5vcm1hbFdvcmxkKTsKICAgICAgICAgIHdoZWVsLnJheWNhc3RSZXN1bHQuaGl0Tm9ybWFsV29ybGQuc2NhbGUocHJvaiwgaGl0Tm9ybWFsV29ybGRTY2FsZWRXaXRoUHJvaik7CiAgICAgICAgICBmd2QudnN1YihoaXROb3JtYWxXb3JsZFNjYWxlZFdpdGhQcm9qLCBmd2QpOwogICAgICAgICAgY29uc3QgcHJvajIgPSBmd2QuZG90KHZlbCk7CiAgICAgICAgICB3aGVlbC5kZWx0YVJvdGF0aW9uID0gbSAqIHByb2oyICogdGltZVN0ZXAgLyB3aGVlbC5yYWRpdXM7CiAgICAgICAgfQoKICAgICAgICBpZiAoKHdoZWVsLnNsaWRpbmcgfHwgIXdoZWVsLmlzSW5Db250YWN0KSAmJiB3aGVlbC5lbmdpbmVGb3JjZSAhPT0gMCAmJiB3aGVlbC51c2VDdXN0b21TbGlkaW5nUm90YXRpb25hbFNwZWVkKSB7CiAgICAgICAgICAvLyBBcHBseSBjdXN0b20gcm90YXRpb24gd2hlbiBhY2NlbGVyYXRpbmcgYW5kIHNsaWRpbmcKICAgICAgICAgIHdoZWVsLmRlbHRhUm90YXRpb24gPSAod2hlZWwuZW5naW5lRm9yY2UgPiAwID8gMSA6IC0xKSAqIHdoZWVsLmN1c3RvbVNsaWRpbmdSb3RhdGlvbmFsU3BlZWQgKiB0aW1lU3RlcDsKICAgICAgICB9IC8vIExvY2sgd2hlZWxzCgoKICAgICAgICBpZiAoTWF0aC5hYnMod2hlZWwuYnJha2UpID4gTWF0aC5hYnMod2hlZWwuZW5naW5lRm9yY2UpKSB7CiAgICAgICAgICB3aGVlbC5kZWx0YVJvdGF0aW9uID0gMDsKICAgICAgICB9CgogICAgICAgIHdoZWVsLnJvdGF0aW9uICs9IHdoZWVsLmRlbHRhUm90YXRpb247IC8vIFVzZSB0aGUgb2xkIHZhbHVlCgogICAgICAgIHdoZWVsLmRlbHRhUm90YXRpb24gKj0gMC45OTsgLy8gZGFtcGluZyBvZiByb3RhdGlvbiB3aGVuIG5vdCBpbiBjb250YWN0CiAgICAgIH0KICAgIH0KCiAgICB1cGRhdGVTdXNwZW5zaW9uKGRlbHRhVGltZSkgewogICAgICBjb25zdCBjaGFzc2lzQm9keSA9IHRoaXMuY2hhc3Npc0JvZHk7CiAgICAgIGNvbnN0IGNoYXNzaXNNYXNzID0gY2hhc3Npc0JvZHkubWFzczsKICAgICAgY29uc3Qgd2hlZWxJbmZvcyA9IHRoaXMud2hlZWxJbmZvczsKICAgICAgY29uc3QgbnVtV2hlZWxzID0gd2hlZWxJbmZvcy5sZW5ndGg7CgogICAgICBmb3IgKGxldCB3X2l0ID0gMDsgd19pdCA8IG51bVdoZWVsczsgd19pdCsrKSB7CiAgICAgICAgY29uc3Qgd2hlZWwgPSB3aGVlbEluZm9zW3dfaXRdOwoKICAgICAgICBpZiAod2hlZWwuaXNJbkNvbnRhY3QpIHsKICAgICAgICAgIGxldCBmb3JjZTsgLy8gU3ByaW5nCgogICAgICAgICAgY29uc3Qgc3VzcF9sZW5ndGggPSB3aGVlbC5zdXNwZW5zaW9uUmVzdExlbmd0aDsKICAgICAgICAgIGNvbnN0IGN1cnJlbnRfbGVuZ3RoID0gd2hlZWwuc3VzcGVuc2lvbkxlbmd0aDsKICAgICAgICAgIGNvbnN0IGxlbmd0aF9kaWZmID0gc3VzcF9sZW5ndGggLSBjdXJyZW50X2xlbmd0aDsKICAgICAgICAgIGZvcmNlID0gd2hlZWwuc3VzcGVuc2lvblN0aWZmbmVzcyAqIGxlbmd0aF9kaWZmICogd2hlZWwuY2xpcHBlZEludkNvbnRhY3REb3RTdXNwZW5zaW9uOyAvLyBEYW1wZXIKCiAgICAgICAgICBjb25zdCBwcm9qZWN0ZWRfcmVsX3ZlbCA9IHdoZWVsLnN1c3BlbnNpb25SZWxhdGl2ZVZlbG9jaXR5OwogICAgICAgICAgbGV0IHN1c3BfZGFtcGluZzsKCiAgICAgICAgICBpZiAocHJvamVjdGVkX3JlbF92ZWwgPCAwKSB7CiAgICAgICAgICAgIHN1c3BfZGFtcGluZyA9IHdoZWVsLmRhbXBpbmdDb21wcmVzc2lvbjsKICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgIHN1c3BfZGFtcGluZyA9IHdoZWVsLmRhbXBpbmdSZWxheGF0aW9uOwogICAgICAgICAgfQoKICAgICAgICAgIGZvcmNlIC09IHN1c3BfZGFtcGluZyAqIHByb2plY3RlZF9yZWxfdmVsOwogICAgICAgICAgd2hlZWwuc3VzcGVuc2lvbkZvcmNlID0gZm9yY2UgKiBjaGFzc2lzTWFzczsKCiAgICAgICAgICBpZiAod2hlZWwuc3VzcGVuc2lvbkZvcmNlIDwgMCkgewogICAgICAgICAgICB3aGVlbC5zdXNwZW5zaW9uRm9yY2UgPSAwOwogICAgICAgICAgfQogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICB3aGVlbC5zdXNwZW5zaW9uRm9yY2UgPSAwOwogICAgICAgIH0KICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBSZW1vdmUgdGhlIHZlaGljbGUgaW5jbHVkaW5nIGl0cyBjb25zdHJhaW50cyBmcm9tIHRoZSB3b3JsZC4KICAgICAqLwoKCiAgICByZW1vdmVGcm9tV29ybGQod29ybGQpIHsKICAgICAgdGhpcy5jb25zdHJhaW50czsKICAgICAgd29ybGQucmVtb3ZlQm9keSh0aGlzLmNoYXNzaXNCb2R5KTsKICAgICAgd29ybGQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncHJlU3RlcCcsIHRoaXMucHJlU3RlcENhbGxiYWNrKTsKICAgICAgdGhpcy53b3JsZCA9IG51bGw7CiAgICB9CgogICAgY2FzdFJheSh3aGVlbCkgewogICAgICBjb25zdCByYXl2ZWN0b3IgPSBjYXN0UmF5X3JheXZlY3RvcjsKICAgICAgY29uc3QgdGFyZ2V0ID0gY2FzdFJheV90YXJnZXQ7CiAgICAgIHRoaXMudXBkYXRlV2hlZWxUcmFuc2Zvcm1Xb3JsZCh3aGVlbCk7CiAgICAgIGNvbnN0IGNoYXNzaXNCb2R5ID0gdGhpcy5jaGFzc2lzQm9keTsKICAgICAgbGV0IGRlcHRoID0gLTE7CiAgICAgIGNvbnN0IHJheWxlbiA9IHdoZWVsLnN1c3BlbnNpb25SZXN0TGVuZ3RoICsgd2hlZWwucmFkaXVzOwogICAgICB3aGVlbC5kaXJlY3Rpb25Xb3JsZC5zY2FsZShyYXlsZW4sIHJheXZlY3Rvcik7CiAgICAgIGNvbnN0IHNvdXJjZSA9IHdoZWVsLmNoYXNzaXNDb25uZWN0aW9uUG9pbnRXb3JsZDsKICAgICAgc291cmNlLnZhZGQocmF5dmVjdG9yLCB0YXJnZXQpOwogICAgICBjb25zdCByYXljYXN0UmVzdWx0ID0gd2hlZWwucmF5Y2FzdFJlc3VsdDsKICAgICAgcmF5Y2FzdFJlc3VsdC5yZXNldCgpOyAvLyBUdXJuIG9mZiByYXkgY29sbGlzaW9uIHdpdGggdGhlIGNoYXNzaXMgdGVtcG9yYXJpbHkKCiAgICAgIGNvbnN0IG9sZFN0YXRlID0gY2hhc3Npc0JvZHkuY29sbGlzaW9uUmVzcG9uc2U7CiAgICAgIGNoYXNzaXNCb2R5LmNvbGxpc2lvblJlc3BvbnNlID0gZmFsc2U7IC8vIENhc3QgcmF5IGFnYWluc3Qgd29ybGQKCiAgICAgIHRoaXMud29ybGQucmF5VGVzdChzb3VyY2UsIHRhcmdldCwgcmF5Y2FzdFJlc3VsdCk7CiAgICAgIGNoYXNzaXNCb2R5LmNvbGxpc2lvblJlc3BvbnNlID0gb2xkU3RhdGU7CiAgICAgIGNvbnN0IG9iamVjdCA9IHJheWNhc3RSZXN1bHQuYm9keTsKICAgICAgd2hlZWwucmF5Y2FzdFJlc3VsdC5ncm91bmRPYmplY3QgPSAwOwoKICAgICAgaWYgKG9iamVjdCkgewogICAgICAgIGRlcHRoID0gcmF5Y2FzdFJlc3VsdC5kaXN0YW5jZTsKICAgICAgICB3aGVlbC5yYXljYXN0UmVzdWx0LmhpdE5vcm1hbFdvcmxkID0gcmF5Y2FzdFJlc3VsdC5oaXROb3JtYWxXb3JsZDsKICAgICAgICB3aGVlbC5pc0luQ29udGFjdCA9IHRydWU7CiAgICAgICAgY29uc3QgaGl0RGlzdGFuY2UgPSByYXljYXN0UmVzdWx0LmRpc3RhbmNlOwogICAgICAgIHdoZWVsLnN1c3BlbnNpb25MZW5ndGggPSBoaXREaXN0YW5jZSAtIHdoZWVsLnJhZGl1czsgLy8gY2xhbXAgb24gbWF4IHN1c3BlbnNpb24gdHJhdmVsCgogICAgICAgIGNvbnN0IG1pblN1c3BlbnNpb25MZW5ndGggPSB3aGVlbC5zdXNwZW5zaW9uUmVzdExlbmd0aCAtIHdoZWVsLm1heFN1c3BlbnNpb25UcmF2ZWw7CiAgICAgICAgY29uc3QgbWF4U3VzcGVuc2lvbkxlbmd0aCA9IHdoZWVsLnN1c3BlbnNpb25SZXN0TGVuZ3RoICsgd2hlZWwubWF4U3VzcGVuc2lvblRyYXZlbDsKCiAgICAgICAgaWYgKHdoZWVsLnN1c3BlbnNpb25MZW5ndGggPCBtaW5TdXNwZW5zaW9uTGVuZ3RoKSB7CiAgICAgICAgICB3aGVlbC5zdXNwZW5zaW9uTGVuZ3RoID0gbWluU3VzcGVuc2lvbkxlbmd0aDsKICAgICAgICB9CgogICAgICAgIGlmICh3aGVlbC5zdXNwZW5zaW9uTGVuZ3RoID4gbWF4U3VzcGVuc2lvbkxlbmd0aCkgewogICAgICAgICAgd2hlZWwuc3VzcGVuc2lvbkxlbmd0aCA9IG1heFN1c3BlbnNpb25MZW5ndGg7CiAgICAgICAgICB3aGVlbC5yYXljYXN0UmVzdWx0LnJlc2V0KCk7CiAgICAgICAgfQoKICAgICAgICBjb25zdCBkZW5vbWluYXRvciA9IHdoZWVsLnJheWNhc3RSZXN1bHQuaGl0Tm9ybWFsV29ybGQuZG90KHdoZWVsLmRpcmVjdGlvbldvcmxkKTsKICAgICAgICBjb25zdCBjaGFzc2lzX3ZlbG9jaXR5X2F0X2NvbnRhY3RQb2ludCA9IG5ldyBWZWMzKCk7CiAgICAgICAgY2hhc3Npc0JvZHkuZ2V0VmVsb2NpdHlBdFdvcmxkUG9pbnQod2hlZWwucmF5Y2FzdFJlc3VsdC5oaXRQb2ludFdvcmxkLCBjaGFzc2lzX3ZlbG9jaXR5X2F0X2NvbnRhY3RQb2ludCk7CiAgICAgICAgY29uc3QgcHJvalZlbCA9IHdoZWVsLnJheWNhc3RSZXN1bHQuaGl0Tm9ybWFsV29ybGQuZG90KGNoYXNzaXNfdmVsb2NpdHlfYXRfY29udGFjdFBvaW50KTsKCiAgICAgICAgaWYgKGRlbm9taW5hdG9yID49IC0wLjEpIHsKICAgICAgICAgIHdoZWVsLnN1c3BlbnNpb25SZWxhdGl2ZVZlbG9jaXR5ID0gMDsKICAgICAgICAgIHdoZWVsLmNsaXBwZWRJbnZDb250YWN0RG90U3VzcGVuc2lvbiA9IDEgLyAwLjE7CiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgIGNvbnN0IGludiA9IC0xIC8gZGVub21pbmF0b3I7CiAgICAgICAgICB3aGVlbC5zdXNwZW5zaW9uUmVsYXRpdmVWZWxvY2l0eSA9IHByb2pWZWwgKiBpbnY7CiAgICAgICAgICB3aGVlbC5jbGlwcGVkSW52Q29udGFjdERvdFN1c3BlbnNpb24gPSBpbnY7CiAgICAgICAgfQogICAgICB9IGVsc2UgewogICAgICAgIC8vcHV0IHdoZWVsIGluZm8gYXMgaW4gcmVzdCBwb3NpdGlvbgogICAgICAgIHdoZWVsLnN1c3BlbnNpb25MZW5ndGggPSB3aGVlbC5zdXNwZW5zaW9uUmVzdExlbmd0aCArIDAgKiB3aGVlbC5tYXhTdXNwZW5zaW9uVHJhdmVsOwogICAgICAgIHdoZWVsLnN1c3BlbnNpb25SZWxhdGl2ZVZlbG9jaXR5ID0gMC4wOwogICAgICAgIHdoZWVsLmRpcmVjdGlvbldvcmxkLnNjYWxlKC0xLCB3aGVlbC5yYXljYXN0UmVzdWx0LmhpdE5vcm1hbFdvcmxkKTsKICAgICAgICB3aGVlbC5jbGlwcGVkSW52Q29udGFjdERvdFN1c3BlbnNpb24gPSAxLjA7CiAgICAgIH0KCiAgICAgIHJldHVybiBkZXB0aDsKICAgIH0KCiAgICB1cGRhdGVXaGVlbFRyYW5zZm9ybVdvcmxkKHdoZWVsKSB7CiAgICAgIHdoZWVsLmlzSW5Db250YWN0ID0gZmFsc2U7CiAgICAgIGNvbnN0IGNoYXNzaXNCb2R5ID0gdGhpcy5jaGFzc2lzQm9keTsKICAgICAgY2hhc3Npc0JvZHkucG9pbnRUb1dvcmxkRnJhbWUod2hlZWwuY2hhc3Npc0Nvbm5lY3Rpb25Qb2ludExvY2FsLCB3aGVlbC5jaGFzc2lzQ29ubmVjdGlvblBvaW50V29ybGQpOwogICAgICBjaGFzc2lzQm9keS52ZWN0b3JUb1dvcmxkRnJhbWUod2hlZWwuZGlyZWN0aW9uTG9jYWwsIHdoZWVsLmRpcmVjdGlvbldvcmxkKTsKICAgICAgY2hhc3Npc0JvZHkudmVjdG9yVG9Xb3JsZEZyYW1lKHdoZWVsLmF4bGVMb2NhbCwgd2hlZWwuYXhsZVdvcmxkKTsKICAgIH0KICAgIC8qKgogICAgICogVXBkYXRlIG9uZSBvZiB0aGUgd2hlZWwgdHJhbnNmb3JtLgogICAgICogTm90ZSB3aGVuIHJlbmRlcmluZyB3aGVlbHM6IGR1cmluZyBlYWNoIHN0ZXAsIHdoZWVsIHRyYW5zZm9ybXMgYXJlIHVwZGF0ZWQgQkVGT1JFIHRoZSBjaGFzc2lzOyBpZS4gdGhlaXIgcG9zaXRpb24gYmVjb21lcyBpbnZhbGlkIGFmdGVyIHRoZSBzdGVwLiBUaHVzIHdoZW4geW91IHJlbmRlciB3aGVlbHMsIHlvdSBtdXN0IHVwZGF0ZSB3aGVlbCB0cmFuc2Zvcm1zIGJlZm9yZSByZW5kZXJpbmcgdGhlbS4gU2VlIHJheWNhc3RWZWhpY2xlIGRlbW8gZm9yIGFuIGV4YW1wbGUuCiAgICAgKiBAcGFyYW0gd2hlZWxJbmRleCBUaGUgd2hlZWwgaW5kZXggdG8gdXBkYXRlLgogICAgICovCgoKICAgIHVwZGF0ZVdoZWVsVHJhbnNmb3JtKHdoZWVsSW5kZXgpIHsKICAgICAgY29uc3QgdXAgPSB0bXBWZWM0OwogICAgICBjb25zdCByaWdodCA9IHRtcFZlYzU7CiAgICAgIGNvbnN0IGZ3ZCA9IHRtcFZlYzY7CiAgICAgIGNvbnN0IHdoZWVsID0gdGhpcy53aGVlbEluZm9zW3doZWVsSW5kZXhdOwogICAgICB0aGlzLnVwZGF0ZVdoZWVsVHJhbnNmb3JtV29ybGQod2hlZWwpOwogICAgICB3aGVlbC5kaXJlY3Rpb25Mb2NhbC5zY2FsZSgtMSwgdXApOwogICAgICByaWdodC5jb3B5KHdoZWVsLmF4bGVMb2NhbCk7CiAgICAgIHVwLmNyb3NzKHJpZ2h0LCBmd2QpOwogICAgICBmd2Qubm9ybWFsaXplKCk7CiAgICAgIHJpZ2h0Lm5vcm1hbGl6ZSgpOyAvLyBSb3RhdGUgYXJvdW5kIHN0ZWVyaW5nIG92ZXIgdGhlIHdoZWVsQXhsZQoKICAgICAgY29uc3Qgc3RlZXJpbmcgPSB3aGVlbC5zdGVlcmluZzsKICAgICAgY29uc3Qgc3RlZXJpbmdPcm4gPSBuZXcgUXVhdGVybmlvbigpOwogICAgICBzdGVlcmluZ09ybi5zZXRGcm9tQXhpc0FuZ2xlKHVwLCBzdGVlcmluZyk7CiAgICAgIGNvbnN0IHJvdGF0aW5nT3JuID0gbmV3IFF1YXRlcm5pb24oKTsKICAgICAgcm90YXRpbmdPcm4uc2V0RnJvbUF4aXNBbmdsZShyaWdodCwgd2hlZWwucm90YXRpb24pOyAvLyBXb3JsZCByb3RhdGlvbiBvZiB0aGUgd2hlZWwKCiAgICAgIGNvbnN0IHEgPSB3aGVlbC53b3JsZFRyYW5zZm9ybS5xdWF0ZXJuaW9uOwogICAgICB0aGlzLmNoYXNzaXNCb2R5LnF1YXRlcm5pb24ubXVsdChzdGVlcmluZ09ybiwgcSk7CiAgICAgIHEubXVsdChyb3RhdGluZ09ybiwgcSk7CiAgICAgIHEubm9ybWFsaXplKCk7IC8vIHdvcmxkIHBvc2l0aW9uIG9mIHRoZSB3aGVlbAoKICAgICAgY29uc3QgcCA9IHdoZWVsLndvcmxkVHJhbnNmb3JtLnBvc2l0aW9uOwogICAgICBwLmNvcHkod2hlZWwuZGlyZWN0aW9uV29ybGQpOwogICAgICBwLnNjYWxlKHdoZWVsLnN1c3BlbnNpb25MZW5ndGgsIHApOwogICAgICBwLnZhZGQod2hlZWwuY2hhc3Npc0Nvbm5lY3Rpb25Qb2ludFdvcmxkLCBwKTsKICAgIH0KICAgIC8qKgogICAgICogR2V0IHRoZSB3b3JsZCB0cmFuc2Zvcm0gb2Ygb25lIG9mIHRoZSB3aGVlbHMKICAgICAqLwoKCiAgICBnZXRXaGVlbFRyYW5zZm9ybVdvcmxkKHdoZWVsSW5kZXgpIHsKICAgICAgcmV0dXJuIHRoaXMud2hlZWxJbmZvc1t3aGVlbEluZGV4XS53b3JsZFRyYW5zZm9ybTsKICAgIH0KCiAgICB1cGRhdGVGcmljdGlvbih0aW1lU3RlcCkgewogICAgICBjb25zdCBzdXJmTm9ybWFsV1Nfc2NhbGVkX3Byb2ogPSB1cGRhdGVGcmljdGlvbl9zdXJmTm9ybWFsV1Nfc2NhbGVkX3Byb2o7IC8vY2FsY3VsYXRlIHRoZSBpbXB1bHNlLCBzbyB0aGF0IHRoZSB3aGVlbHMgZG9uJ3QgbW92ZSBzaWRld2FyZHMKCiAgICAgIGNvbnN0IHdoZWVsSW5mb3MgPSB0aGlzLndoZWVsSW5mb3M7CiAgICAgIGNvbnN0IG51bVdoZWVscyA9IHdoZWVsSW5mb3MubGVuZ3RoOwogICAgICBjb25zdCBjaGFzc2lzQm9keSA9IHRoaXMuY2hhc3Npc0JvZHk7CiAgICAgIGNvbnN0IGZvcndhcmRXUyA9IHVwZGF0ZUZyaWN0aW9uX2ZvcndhcmRXUzsKICAgICAgY29uc3QgYXhsZSA9IHVwZGF0ZUZyaWN0aW9uX2F4bGU7CiAgICAgIHRoaXMubnVtV2hlZWxzT25Hcm91bmQgPSAwOwoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1XaGVlbHM7IGkrKykgewogICAgICAgIGNvbnN0IHdoZWVsID0gd2hlZWxJbmZvc1tpXTsKICAgICAgICBjb25zdCBncm91bmRPYmplY3QgPSB3aGVlbC5yYXljYXN0UmVzdWx0LmJvZHk7CgogICAgICAgIGlmIChncm91bmRPYmplY3QpIHsKICAgICAgICAgIHRoaXMubnVtV2hlZWxzT25Hcm91bmQrKzsKICAgICAgICB9CgogICAgICAgIHdoZWVsLnNpZGVJbXB1bHNlID0gMDsKICAgICAgICB3aGVlbC5mb3J3YXJkSW1wdWxzZSA9IDA7CgogICAgICAgIGlmICghZm9yd2FyZFdTW2ldKSB7CiAgICAgICAgICBmb3J3YXJkV1NbaV0gPSBuZXcgVmVjMygpOwogICAgICAgIH0KCiAgICAgICAgaWYgKCFheGxlW2ldKSB7CiAgICAgICAgICBheGxlW2ldID0gbmV3IFZlYzMoKTsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtV2hlZWxzOyBpKyspIHsKICAgICAgICBjb25zdCB3aGVlbCA9IHdoZWVsSW5mb3NbaV07CiAgICAgICAgY29uc3QgZ3JvdW5kT2JqZWN0ID0gd2hlZWwucmF5Y2FzdFJlc3VsdC5ib2R5OwoKICAgICAgICBpZiAoZ3JvdW5kT2JqZWN0KSB7CiAgICAgICAgICBjb25zdCBheGxlaSA9IGF4bGVbaV07CiAgICAgICAgICBjb25zdCB3aGVlbFRyYW5zID0gdGhpcy5nZXRXaGVlbFRyYW5zZm9ybVdvcmxkKGkpOyAvLyBHZXQgd29ybGQgYXhsZQoKICAgICAgICAgIHdoZWVsVHJhbnMudmVjdG9yVG9Xb3JsZEZyYW1lKGRpcmVjdGlvbnNbdGhpcy5pbmRleFJpZ2h0QXhpc10sIGF4bGVpKTsKICAgICAgICAgIGNvbnN0IHN1cmZOb3JtYWxXUyA9IHdoZWVsLnJheWNhc3RSZXN1bHQuaGl0Tm9ybWFsV29ybGQ7CiAgICAgICAgICBjb25zdCBwcm9qID0gYXhsZWkuZG90KHN1cmZOb3JtYWxXUyk7CiAgICAgICAgICBzdXJmTm9ybWFsV1Muc2NhbGUocHJvaiwgc3VyZk5vcm1hbFdTX3NjYWxlZF9wcm9qKTsKICAgICAgICAgIGF4bGVpLnZzdWIoc3VyZk5vcm1hbFdTX3NjYWxlZF9wcm9qLCBheGxlaSk7CiAgICAgICAgICBheGxlaS5ub3JtYWxpemUoKTsKICAgICAgICAgIHN1cmZOb3JtYWxXUy5jcm9zcyhheGxlaSwgZm9yd2FyZFdTW2ldKTsKICAgICAgICAgIGZvcndhcmRXU1tpXS5ub3JtYWxpemUoKTsKICAgICAgICAgIHdoZWVsLnNpZGVJbXB1bHNlID0gcmVzb2x2ZVNpbmdsZUJpbGF0ZXJhbChjaGFzc2lzQm9keSwgd2hlZWwucmF5Y2FzdFJlc3VsdC5oaXRQb2ludFdvcmxkLCBncm91bmRPYmplY3QsIHdoZWVsLnJheWNhc3RSZXN1bHQuaGl0UG9pbnRXb3JsZCwgYXhsZWkpOwogICAgICAgICAgd2hlZWwuc2lkZUltcHVsc2UgKj0gc2lkZUZyaWN0aW9uU3RpZmZuZXNzMjsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIGNvbnN0IHNpZGVGYWN0b3IgPSAxOwogICAgICBjb25zdCBmd2RGYWN0b3IgPSAwLjU7CiAgICAgIHRoaXMuc2xpZGluZyA9IGZhbHNlOwoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1XaGVlbHM7IGkrKykgewogICAgICAgIGNvbnN0IHdoZWVsID0gd2hlZWxJbmZvc1tpXTsKICAgICAgICBjb25zdCBncm91bmRPYmplY3QgPSB3aGVlbC5yYXljYXN0UmVzdWx0LmJvZHk7CiAgICAgICAgbGV0IHJvbGxpbmdGcmljdGlvbiA9IDA7CiAgICAgICAgd2hlZWwuc2xpcEluZm8gPSAxOwoKICAgICAgICBpZiAoZ3JvdW5kT2JqZWN0KSB7CiAgICAgICAgICBjb25zdCBkZWZhdWx0Um9sbGluZ0ZyaWN0aW9uSW1wdWxzZSA9IDA7CiAgICAgICAgICBjb25zdCBtYXhJbXB1bHNlID0gd2hlZWwuYnJha2UgPyB3aGVlbC5icmFrZSA6IGRlZmF1bHRSb2xsaW5nRnJpY3Rpb25JbXB1bHNlOyAvLyBidFdoZWVsQ29udGFjdFBvaW50IGNvbnRhY3RQdChjaGFzc2lzQm9keSxncm91bmRPYmplY3Qsd2hlZWxJbmZyYXljYXN0SW5mby5oaXRQb2ludFdvcmxkLGZvcndhcmRXU1t3aGVlbF0sbWF4SW1wdWxzZSk7CiAgICAgICAgICAvLyByb2xsaW5nRnJpY3Rpb24gPSBjYWxjUm9sbGluZ0ZyaWN0aW9uKGNvbnRhY3RQdCk7CgogICAgICAgICAgcm9sbGluZ0ZyaWN0aW9uID0gY2FsY1JvbGxpbmdGcmljdGlvbihjaGFzc2lzQm9keSwgZ3JvdW5kT2JqZWN0LCB3aGVlbC5yYXljYXN0UmVzdWx0LmhpdFBvaW50V29ybGQsIGZvcndhcmRXU1tpXSwgbWF4SW1wdWxzZSk7CiAgICAgICAgICByb2xsaW5nRnJpY3Rpb24gKz0gd2hlZWwuZW5naW5lRm9yY2UgKiB0aW1lU3RlcDsgLy8gcm9sbGluZ0ZyaWN0aW9uID0gMDsKCiAgICAgICAgICBjb25zdCBmYWN0b3IgPSBtYXhJbXB1bHNlIC8gcm9sbGluZ0ZyaWN0aW9uOwogICAgICAgICAgd2hlZWwuc2xpcEluZm8gKj0gZmFjdG9yOwogICAgICAgIH0gLy9zd2l0Y2ggYmV0d2VlbiBhY3RpdmUgcm9sbGluZyAodGhyb3R0bGUpLCBicmFraW5nIGFuZCBub24tYWN0aXZlIHJvbGxpbmcgZnJpY3Rpb24gKG50aHJvdHRsZS9icmVhaykKCgogICAgICAgIHdoZWVsLmZvcndhcmRJbXB1bHNlID0gMDsKICAgICAgICB3aGVlbC5za2lkSW5mbyA9IDE7CgogICAgICAgIGlmIChncm91bmRPYmplY3QpIHsKICAgICAgICAgIHdoZWVsLnNraWRJbmZvID0gMTsKICAgICAgICAgIGNvbnN0IG1heGltcCA9IHdoZWVsLnN1c3BlbnNpb25Gb3JjZSAqIHRpbWVTdGVwICogd2hlZWwuZnJpY3Rpb25TbGlwOwogICAgICAgICAgY29uc3QgbWF4aW1wU2lkZSA9IG1heGltcDsKICAgICAgICAgIGNvbnN0IG1heGltcFNxdWFyZWQgPSBtYXhpbXAgKiBtYXhpbXBTaWRlOwogICAgICAgICAgd2hlZWwuZm9yd2FyZEltcHVsc2UgPSByb2xsaW5nRnJpY3Rpb247IC8vd2hlZWxJbmZvLmVuZ2luZUZvcmNlKiB0aW1lU3RlcDsKCiAgICAgICAgICBjb25zdCB4ID0gd2hlZWwuZm9yd2FyZEltcHVsc2UgKiBmd2RGYWN0b3IgLyB3aGVlbC5mb3J3YXJkQWNjZWxlcmF0aW9uOwogICAgICAgICAgY29uc3QgeSA9IHdoZWVsLnNpZGVJbXB1bHNlICogc2lkZUZhY3RvciAvIHdoZWVsLnNpZGVBY2NlbGVyYXRpb247CiAgICAgICAgICBjb25zdCBpbXB1bHNlU3F1YXJlZCA9IHggKiB4ICsgeSAqIHk7CiAgICAgICAgICB3aGVlbC5zbGlkaW5nID0gZmFsc2U7CgogICAgICAgICAgaWYgKGltcHVsc2VTcXVhcmVkID4gbWF4aW1wU3F1YXJlZCkgewogICAgICAgICAgICB0aGlzLnNsaWRpbmcgPSB0cnVlOwogICAgICAgICAgICB3aGVlbC5zbGlkaW5nID0gdHJ1ZTsKICAgICAgICAgICAgY29uc3QgZmFjdG9yID0gbWF4aW1wIC8gTWF0aC5zcXJ0KGltcHVsc2VTcXVhcmVkKTsKICAgICAgICAgICAgd2hlZWwuc2tpZEluZm8gKj0gZmFjdG9yOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfQoKICAgICAgaWYgKHRoaXMuc2xpZGluZykgewogICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtV2hlZWxzOyBpKyspIHsKICAgICAgICAgIGNvbnN0IHdoZWVsID0gd2hlZWxJbmZvc1tpXTsKCiAgICAgICAgICBpZiAod2hlZWwuc2lkZUltcHVsc2UgIT09IDApIHsKICAgICAgICAgICAgaWYgKHdoZWVsLnNraWRJbmZvIDwgMSkgewogICAgICAgICAgICAgIHdoZWVsLmZvcndhcmRJbXB1bHNlICo9IHdoZWVsLnNraWRJbmZvOwogICAgICAgICAgICAgIHdoZWVsLnNpZGVJbXB1bHNlICo9IHdoZWVsLnNraWRJbmZvOwogICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9IC8vIGFwcGx5IHRoZSBpbXB1bHNlcwoKCiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtV2hlZWxzOyBpKyspIHsKICAgICAgICBjb25zdCB3aGVlbCA9IHdoZWVsSW5mb3NbaV07CiAgICAgICAgY29uc3QgcmVsX3BvcyA9IG5ldyBWZWMzKCk7CiAgICAgICAgd2hlZWwucmF5Y2FzdFJlc3VsdC5oaXRQb2ludFdvcmxkLnZzdWIoY2hhc3Npc0JvZHkucG9zaXRpb24sIHJlbF9wb3MpOyAvLyBjYW5ub25zIGFwcGx5aW1wdWxzZSBpcyB1c2luZyB3b3JsZCBjb29yZCBmb3IgdGhlIHBvc2l0aW9uCiAgICAgICAgLy9yZWxfcG9zLmNvcHkod2hlZWwucmF5Y2FzdFJlc3VsdC5oaXRQb2ludFdvcmxkKTsKCiAgICAgICAgaWYgKHdoZWVsLmZvcndhcmRJbXB1bHNlICE9PSAwKSB7CiAgICAgICAgICBjb25zdCBpbXB1bHNlID0gbmV3IFZlYzMoKTsKICAgICAgICAgIGZvcndhcmRXU1tpXS5zY2FsZSh3aGVlbC5mb3J3YXJkSW1wdWxzZSwgaW1wdWxzZSk7CiAgICAgICAgICBjaGFzc2lzQm9keS5hcHBseUltcHVsc2UoaW1wdWxzZSwgcmVsX3Bvcyk7CiAgICAgICAgfQoKICAgICAgICBpZiAod2hlZWwuc2lkZUltcHVsc2UgIT09IDApIHsKICAgICAgICAgIGNvbnN0IGdyb3VuZE9iamVjdCA9IHdoZWVsLnJheWNhc3RSZXN1bHQuYm9keTsKICAgICAgICAgIGNvbnN0IHJlbF9wb3MyID0gbmV3IFZlYzMoKTsKICAgICAgICAgIHdoZWVsLnJheWNhc3RSZXN1bHQuaGl0UG9pbnRXb3JsZC52c3ViKGdyb3VuZE9iamVjdC5wb3NpdGlvbiwgcmVsX3BvczIpOyAvL3JlbF9wb3MyLmNvcHkod2hlZWwucmF5Y2FzdFJlc3VsdC5oaXRQb2ludFdvcmxkKTsKCiAgICAgICAgICBjb25zdCBzaWRlSW1wID0gbmV3IFZlYzMoKTsKICAgICAgICAgIGF4bGVbaV0uc2NhbGUod2hlZWwuc2lkZUltcHVsc2UsIHNpZGVJbXApOyAvLyBTY2FsZSB0aGUgcmVsYXRpdmUgcG9zaXRpb24gaW4gdGhlIHVwIGRpcmVjdGlvbiB3aXRoIHJvbGxJbmZsdWVuY2UuCiAgICAgICAgICAvLyBJZiByb2xsSW5mbHVlbmNlIGlzIDEsIHRoZSBpbXB1bHNlIHdpbGwgYmUgYXBwbGllZCBvbiB0aGUgaGl0UG9pbnQgKGVhc3kgdG8gcm9sbCBvdmVyKSwgaWYgaXQgaXMgemVybyBpdCB3aWxsIGJlIGFwcGxpZWQgaW4gdGhlIHNhbWUgcGxhbmUgYXMgdGhlIGNlbnRlciBvZiBtYXNzIChub3QgZWFzeSB0byByb2xsIG92ZXIpLgoKICAgICAgICAgIGNoYXNzaXNCb2R5LnZlY3RvclRvTG9jYWxGcmFtZShyZWxfcG9zLCByZWxfcG9zKTsKICAgICAgICAgIHJlbF9wb3NbJ3h5eidbdGhpcy5pbmRleFVwQXhpc11dICo9IHdoZWVsLnJvbGxJbmZsdWVuY2U7CiAgICAgICAgICBjaGFzc2lzQm9keS52ZWN0b3JUb1dvcmxkRnJhbWUocmVsX3BvcywgcmVsX3Bvcyk7CiAgICAgICAgICBjaGFzc2lzQm9keS5hcHBseUltcHVsc2Uoc2lkZUltcCwgcmVsX3Bvcyk7IC8vYXBwbHkgZnJpY3Rpb24gaW1wdWxzZSBvbiB0aGUgZ3JvdW5kCgogICAgICAgICAgc2lkZUltcC5zY2FsZSgtMSwgc2lkZUltcCk7CiAgICAgICAgICBncm91bmRPYmplY3QuYXBwbHlJbXB1bHNlKHNpZGVJbXAsIHJlbF9wb3MyKTsKICAgICAgICB9CiAgICAgIH0KICAgIH0KCiAgfQogIG5ldyBWZWMzKCk7CiAgbmV3IFZlYzMoKTsKICBuZXcgVmVjMygpOwogIGNvbnN0IHRtcFZlYzQgPSBuZXcgVmVjMygpOwogIGNvbnN0IHRtcFZlYzUgPSBuZXcgVmVjMygpOwogIGNvbnN0IHRtcFZlYzYgPSBuZXcgVmVjMygpOwogIG5ldyBSYXkoKTsKICBuZXcgVmVjMygpOwogIGNvbnN0IGNhc3RSYXlfcmF5dmVjdG9yID0gbmV3IFZlYzMoKTsKICBjb25zdCBjYXN0UmF5X3RhcmdldCA9IG5ldyBWZWMzKCk7CiAgY29uc3QgZGlyZWN0aW9ucyA9IFtuZXcgVmVjMygxLCAwLCAwKSwgbmV3IFZlYzMoMCwgMSwgMCksIG5ldyBWZWMzKDAsIDAsIDEpXTsKICBjb25zdCB1cGRhdGVGcmljdGlvbl9zdXJmTm9ybWFsV1Nfc2NhbGVkX3Byb2ogPSBuZXcgVmVjMygpOwogIGNvbnN0IHVwZGF0ZUZyaWN0aW9uX2F4bGUgPSBbXTsKICBjb25zdCB1cGRhdGVGcmljdGlvbl9mb3J3YXJkV1MgPSBbXTsKICBjb25zdCBzaWRlRnJpY3Rpb25TdGlmZm5lc3MyID0gMTsKICBjb25zdCBjYWxjUm9sbGluZ0ZyaWN0aW9uX3ZlbDEgPSBuZXcgVmVjMygpOwogIGNvbnN0IGNhbGNSb2xsaW5nRnJpY3Rpb25fdmVsMiA9IG5ldyBWZWMzKCk7CiAgY29uc3QgY2FsY1JvbGxpbmdGcmljdGlvbl92ZWwgPSBuZXcgVmVjMygpOwoKICBmdW5jdGlvbiBjYWxjUm9sbGluZ0ZyaWN0aW9uKGJvZHkwLCBib2R5MSwgZnJpY3Rpb25Qb3NXb3JsZCwgZnJpY3Rpb25EaXJlY3Rpb25Xb3JsZCwgbWF4SW1wdWxzZSkgewogICAgbGV0IGoxID0gMDsKICAgIGNvbnN0IGNvbnRhY3RQb3NXb3JsZCA9IGZyaWN0aW9uUG9zV29ybGQ7IC8vIGNvbnN0IHJlbF9wb3MxID0gbmV3IFZlYzMoKTsKICAgIC8vIGNvbnN0IHJlbF9wb3MyID0gbmV3IFZlYzMoKTsKCiAgICBjb25zdCB2ZWwxID0gY2FsY1JvbGxpbmdGcmljdGlvbl92ZWwxOwogICAgY29uc3QgdmVsMiA9IGNhbGNSb2xsaW5nRnJpY3Rpb25fdmVsMjsKICAgIGNvbnN0IHZlbCA9IGNhbGNSb2xsaW5nRnJpY3Rpb25fdmVsOyAvLyBjb250YWN0UG9zV29ybGQudnN1Yihib2R5MC5wb3NpdGlvbiwgcmVsX3BvczEpOwogICAgLy8gY29udGFjdFBvc1dvcmxkLnZzdWIoYm9keTEucG9zaXRpb24sIHJlbF9wb3MyKTsKCiAgICBib2R5MC5nZXRWZWxvY2l0eUF0V29ybGRQb2ludChjb250YWN0UG9zV29ybGQsIHZlbDEpOwogICAgYm9keTEuZ2V0VmVsb2NpdHlBdFdvcmxkUG9pbnQoY29udGFjdFBvc1dvcmxkLCB2ZWwyKTsKICAgIHZlbDEudnN1Yih2ZWwyLCB2ZWwpOwogICAgY29uc3QgdnJlbCA9IGZyaWN0aW9uRGlyZWN0aW9uV29ybGQuZG90KHZlbCk7CiAgICBjb25zdCBkZW5vbTAgPSBjb21wdXRlSW1wdWxzZURlbm9taW5hdG9yKGJvZHkwLCBmcmljdGlvblBvc1dvcmxkLCBmcmljdGlvbkRpcmVjdGlvbldvcmxkKTsKICAgIGNvbnN0IGRlbm9tMSA9IGNvbXB1dGVJbXB1bHNlRGVub21pbmF0b3IoYm9keTEsIGZyaWN0aW9uUG9zV29ybGQsIGZyaWN0aW9uRGlyZWN0aW9uV29ybGQpOwogICAgY29uc3QgcmVsYXhhdGlvbiA9IDE7CiAgICBjb25zdCBqYWNEaWFnQUJJbnYgPSByZWxheGF0aW9uIC8gKGRlbm9tMCArIGRlbm9tMSk7IC8vIGNhbGN1bGF0ZSBqIHRoYXQgbW92ZXMgdXMgdG8gemVybyByZWxhdGl2ZSB2ZWxvY2l0eQoKICAgIGoxID0gLXZyZWwgKiBqYWNEaWFnQUJJbnY7CgogICAgaWYgKG1heEltcHVsc2UgPCBqMSkgewogICAgICBqMSA9IG1heEltcHVsc2U7CiAgICB9CgogICAgaWYgKGoxIDwgLW1heEltcHVsc2UpIHsKICAgICAgajEgPSAtbWF4SW1wdWxzZTsKICAgIH0KCiAgICByZXR1cm4gajE7CiAgfQoKICBjb25zdCBjb21wdXRlSW1wdWxzZURlbm9taW5hdG9yX3IwID0gbmV3IFZlYzMoKTsKICBjb25zdCBjb21wdXRlSW1wdWxzZURlbm9taW5hdG9yX2MwID0gbmV3IFZlYzMoKTsKICBjb25zdCBjb21wdXRlSW1wdWxzZURlbm9taW5hdG9yX3ZlYyA9IG5ldyBWZWMzKCk7CiAgY29uc3QgY29tcHV0ZUltcHVsc2VEZW5vbWluYXRvcl9tID0gbmV3IFZlYzMoKTsKCiAgZnVuY3Rpb24gY29tcHV0ZUltcHVsc2VEZW5vbWluYXRvcihib2R5LCBwb3MsIG5vcm1hbCkgewogICAgY29uc3QgcjAgPSBjb21wdXRlSW1wdWxzZURlbm9taW5hdG9yX3IwOwogICAgY29uc3QgYzAgPSBjb21wdXRlSW1wdWxzZURlbm9taW5hdG9yX2MwOwogICAgY29uc3QgdmVjID0gY29tcHV0ZUltcHVsc2VEZW5vbWluYXRvcl92ZWM7CiAgICBjb25zdCBtID0gY29tcHV0ZUltcHVsc2VEZW5vbWluYXRvcl9tOwogICAgcG9zLnZzdWIoYm9keS5wb3NpdGlvbiwgcjApOwogICAgcjAuY3Jvc3Mobm9ybWFsLCBjMCk7CiAgICBib2R5LmludkluZXJ0aWFXb3JsZC52bXVsdChjMCwgbSk7CiAgICBtLmNyb3NzKHIwLCB2ZWMpOwogICAgcmV0dXJuIGJvZHkuaW52TWFzcyArIG5vcm1hbC5kb3QodmVjKTsKICB9CgogIGNvbnN0IHJlc29sdmVTaW5nbGVCaWxhdGVyYWxfdmVsMSA9IG5ldyBWZWMzKCk7CiAgY29uc3QgcmVzb2x2ZVNpbmdsZUJpbGF0ZXJhbF92ZWwyID0gbmV3IFZlYzMoKTsKICBjb25zdCByZXNvbHZlU2luZ2xlQmlsYXRlcmFsX3ZlbCA9IG5ldyBWZWMzKCk7IC8vIGJpbGF0ZXJhbCBjb25zdHJhaW50IGJldHdlZW4gdHdvIGR5bmFtaWMgb2JqZWN0cwoKICBmdW5jdGlvbiByZXNvbHZlU2luZ2xlQmlsYXRlcmFsKGJvZHkxLCBwb3MxLCBib2R5MiwgcG9zMiwgbm9ybWFsKSB7CiAgICBjb25zdCBub3JtYWxMZW5TcXIgPSBub3JtYWwubGVuZ3RoU3F1YXJlZCgpOwoKICAgIGlmIChub3JtYWxMZW5TcXIgPiAxLjEpIHsKICAgICAgcmV0dXJuIDA7IC8vIG5vIGltcHVsc2UKICAgIH0gLy8gY29uc3QgcmVsX3BvczEgPSBuZXcgVmVjMygpOwogICAgLy8gY29uc3QgcmVsX3BvczIgPSBuZXcgVmVjMygpOwogICAgLy8gcG9zMS52c3ViKGJvZHkxLnBvc2l0aW9uLCByZWxfcG9zMSk7CiAgICAvLyBwb3MyLnZzdWIoYm9keTIucG9zaXRpb24sIHJlbF9wb3MyKTsKCgogICAgY29uc3QgdmVsMSA9IHJlc29sdmVTaW5nbGVCaWxhdGVyYWxfdmVsMTsKICAgIGNvbnN0IHZlbDIgPSByZXNvbHZlU2luZ2xlQmlsYXRlcmFsX3ZlbDI7CiAgICBjb25zdCB2ZWwgPSByZXNvbHZlU2luZ2xlQmlsYXRlcmFsX3ZlbDsKICAgIGJvZHkxLmdldFZlbG9jaXR5QXRXb3JsZFBvaW50KHBvczEsIHZlbDEpOwogICAgYm9keTIuZ2V0VmVsb2NpdHlBdFdvcmxkUG9pbnQocG9zMiwgdmVsMik7CiAgICB2ZWwxLnZzdWIodmVsMiwgdmVsKTsKICAgIGNvbnN0IHJlbF92ZWwgPSBub3JtYWwuZG90KHZlbCk7CiAgICBjb25zdCBjb250YWN0RGFtcGluZyA9IDAuMjsKICAgIGNvbnN0IG1hc3NUZXJtID0gMSAvIChib2R5MS5pbnZNYXNzICsgYm9keTIuaW52TWFzcyk7CiAgICBjb25zdCBpbXB1bHNlID0gLWNvbnRhY3REYW1waW5nICogcmVsX3ZlbCAqIG1hc3NUZXJtOwogICAgcmV0dXJuIGltcHVsc2U7CiAgfQoKICAvKioKICAgKiBTcGhlcmljYWwgc2hhcGUKICAgKiBAZXhhbXBsZQogICAqICAgICBjb25zdCByYWRpdXMgPSAxCiAgICogICAgIGNvbnN0IHNwaGVyZVNoYXBlID0gbmV3IENBTk5PTi5TcGhlcmUocmFkaXVzKQogICAqICAgICBjb25zdCBzcGhlcmVCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMSwgc2hhcGU6IHNwaGVyZVNoYXBlIH0pCiAgICogICAgIHdvcmxkLmFkZEJvZHkoc3BoZXJlQm9keSkKICAgKi8KICBjbGFzcyBTcGhlcmUgZXh0ZW5kcyBTaGFwZSB7CiAgICAvKioKICAgICAqIFRoZSByYWRpdXMgb2YgdGhlIHNwaGVyZS4KICAgICAqLwoKICAgIC8qKgogICAgICoKICAgICAqIEBwYXJhbSByYWRpdXMgVGhlIHJhZGl1cyBvZiB0aGUgc3BoZXJlLCBhIG5vbi1uZWdhdGl2ZSBudW1iZXIuCiAgICAgKi8KICAgIGNvbnN0cnVjdG9yKHJhZGl1cykgewogICAgICBzdXBlcih7CiAgICAgICAgdHlwZTogU2hhcGUudHlwZXMuU1BIRVJFCiAgICAgIH0pOwogICAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cyAhPT0gdW5kZWZpbmVkID8gcmFkaXVzIDogMS4wOwoKICAgICAgaWYgKHRoaXMucmFkaXVzIDwgMCkgewogICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHNwaGVyZSByYWRpdXMgY2Fubm90IGJlIG5lZ2F0aXZlLicpOwogICAgICB9CgogICAgICB0aGlzLnVwZGF0ZUJvdW5kaW5nU3BoZXJlUmFkaXVzKCk7CiAgICB9CiAgICAvKiogY2FsY3VsYXRlTG9jYWxJbmVydGlhICovCgoKICAgIGNhbGN1bGF0ZUxvY2FsSW5lcnRpYShtYXNzLCB0YXJnZXQpIHsKICAgICAgaWYgKHRhcmdldCA9PT0gdm9pZCAwKSB7CiAgICAgICAgdGFyZ2V0ID0gbmV3IFZlYzMoKTsKICAgICAgfQoKICAgICAgY29uc3QgSSA9IDIuMCAqIG1hc3MgKiB0aGlzLnJhZGl1cyAqIHRoaXMucmFkaXVzIC8gNS4wOwogICAgICB0YXJnZXQueCA9IEk7CiAgICAgIHRhcmdldC55ID0gSTsKICAgICAgdGFyZ2V0LnogPSBJOwogICAgICByZXR1cm4gdGFyZ2V0OwogICAgfQogICAgLyoqIHZvbHVtZSAqLwoKCiAgICB2b2x1bWUoKSB7CiAgICAgIHJldHVybiA0LjAgKiBNYXRoLlBJICogTWF0aC5wb3codGhpcy5yYWRpdXMsIDMpIC8gMy4wOwogICAgfQoKICAgIHVwZGF0ZUJvdW5kaW5nU3BoZXJlUmFkaXVzKCkgewogICAgICB0aGlzLmJvdW5kaW5nU3BoZXJlUmFkaXVzID0gdGhpcy5yYWRpdXM7CiAgICB9CgogICAgY2FsY3VsYXRlV29ybGRBQUJCKHBvcywgcXVhdCwgbWluLCBtYXgpIHsKICAgICAgY29uc3QgciA9IHRoaXMucmFkaXVzOwogICAgICBjb25zdCBheGVzID0gWyd4JywgJ3knLCAneiddOwoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBheGVzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgY29uc3QgYXggPSBheGVzW2ldOwogICAgICAgIG1pbltheF0gPSBwb3NbYXhdIC0gcjsKICAgICAgICBtYXhbYXhdID0gcG9zW2F4XSArIHI7CiAgICAgIH0KICAgIH0KCiAgfQogIG5ldyBWZWMzKCk7CiAgbmV3IFZlYzMoKTsKICBuZXcgVmVjMygpOyAvLyBUZW1wIHZlY3RvcnMgZm9yIGNhbGN1bGF0aW9uCgogIG5ldyBWZWMzKCk7IC8vIFJlbGF0aXZlIHZlbG9jaXR5CgogIG5ldyBWZWMzKCk7CiAgbmV3IFZlYzMoKTsKICBuZXcgVmVjMygpOwogIG5ldyBWZWMzKCk7CiAgbmV3IFZlYzMoKTsKCiAgLyoqCiAgICogQ3lsaW5kZXIgY2xhc3MuCiAgICogQGV4YW1wbGUKICAgKiAgICAgY29uc3QgcmFkaXVzVG9wID0gMC41CiAgICogICAgIGNvbnN0IHJhZGl1c0JvdHRvbSA9IDAuNQogICAqICAgICBjb25zdCBoZWlnaHQgPSAyCiAgICogICAgIGNvbnN0IG51bVNlZ21lbnRzID0gMTIKICAgKiAgICAgY29uc3QgY3lsaW5kZXJTaGFwZSA9IG5ldyBDQU5OT04uQ3lsaW5kZXIocmFkaXVzVG9wLCByYWRpdXNCb3R0b20sIGhlaWdodCwgbnVtU2VnbWVudHMpCiAgICogICAgIGNvbnN0IGN5bGluZGVyQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDEsIHNoYXBlOiBjeWxpbmRlclNoYXBlIH0pCiAgICogICAgIHdvcmxkLmFkZEJvZHkoY3lsaW5kZXJCb2R5KQogICAqLwoKICBjbGFzcyBDeWxpbmRlciBleHRlbmRzIENvbnZleFBvbHloZWRyb24gewogICAgLyoqIFRoZSByYWRpdXMgb2YgdGhlIHRvcCBvZiB0aGUgQ3lsaW5kZXIuICovCgogICAgLyoqIFRoZSByYWRpdXMgb2YgdGhlIGJvdHRvbSBvZiB0aGUgQ3lsaW5kZXIuICovCgogICAgLyoqIFRoZSBoZWlnaHQgb2YgdGhlIEN5bGluZGVyLiAqLwoKICAgIC8qKiBUaGUgbnVtYmVyIG9mIHNlZ21lbnRzIHRvIGJ1aWxkIHRoZSBjeWxpbmRlciBvdXQgb2YuICovCgogICAgLyoqCiAgICAgKiBAcGFyYW0gcmFkaXVzVG9wIFRoZSByYWRpdXMgb2YgdGhlIHRvcCBvZiB0aGUgQ3lsaW5kZXIuCiAgICAgKiBAcGFyYW0gcmFkaXVzQm90dG9tIFRoZSByYWRpdXMgb2YgdGhlIGJvdHRvbSBvZiB0aGUgQ3lsaW5kZXIuCiAgICAgKiBAcGFyYW0gaGVpZ2h0IFRoZSBoZWlnaHQgb2YgdGhlIEN5bGluZGVyLgogICAgICogQHBhcmFtIG51bVNlZ21lbnRzIFRoZSBudW1iZXIgb2Ygc2VnbWVudHMgdG8gYnVpbGQgdGhlIGN5bGluZGVyIG91dCBvZi4KICAgICAqLwogICAgY29uc3RydWN0b3IocmFkaXVzVG9wLCByYWRpdXNCb3R0b20sIGhlaWdodCwgbnVtU2VnbWVudHMpIHsKICAgICAgaWYgKHJhZGl1c1RvcCA9PT0gdm9pZCAwKSB7CiAgICAgICAgcmFkaXVzVG9wID0gMTsKICAgICAgfQoKICAgICAgaWYgKHJhZGl1c0JvdHRvbSA9PT0gdm9pZCAwKSB7CiAgICAgICAgcmFkaXVzQm90dG9tID0gMTsKICAgICAgfQoKICAgICAgaWYgKGhlaWdodCA9PT0gdm9pZCAwKSB7CiAgICAgICAgaGVpZ2h0ID0gMTsKICAgICAgfQoKICAgICAgaWYgKG51bVNlZ21lbnRzID09PSB2b2lkIDApIHsKICAgICAgICBudW1TZWdtZW50cyA9IDg7CiAgICAgIH0KCiAgICAgIGlmIChyYWRpdXNUb3AgPCAwKSB7CiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgY3lsaW5kZXIgcmFkaXVzVG9wIGNhbm5vdCBiZSBuZWdhdGl2ZS4nKTsKICAgICAgfQoKICAgICAgaWYgKHJhZGl1c0JvdHRvbSA8IDApIHsKICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjeWxpbmRlciByYWRpdXNCb3R0b20gY2Fubm90IGJlIG5lZ2F0aXZlLicpOwogICAgICB9CgogICAgICBjb25zdCBOID0gbnVtU2VnbWVudHM7CiAgICAgIGNvbnN0IHZlcnRpY2VzID0gW107CiAgICAgIGNvbnN0IGF4ZXMgPSBbXTsKICAgICAgY29uc3QgZmFjZXMgPSBbXTsKICAgICAgY29uc3QgYm90dG9tZmFjZSA9IFtdOwogICAgICBjb25zdCB0b3BmYWNlID0gW107CiAgICAgIGNvbnN0IGNvcyA9IE1hdGguY29zOwogICAgICBjb25zdCBzaW4gPSBNYXRoLnNpbjsgLy8gRmlyc3QgYm90dG9tIHBvaW50CgogICAgICB2ZXJ0aWNlcy5wdXNoKG5ldyBWZWMzKC1yYWRpdXNCb3R0b20gKiBzaW4oMCksIC1oZWlnaHQgKiAwLjUsIHJhZGl1c0JvdHRvbSAqIGNvcygwKSkpOwogICAgICBib3R0b21mYWNlLnB1c2goMCk7IC8vIEZpcnN0IHRvcCBwb2ludAoKICAgICAgdmVydGljZXMucHVzaChuZXcgVmVjMygtcmFkaXVzVG9wICogc2luKDApLCBoZWlnaHQgKiAwLjUsIHJhZGl1c1RvcCAqIGNvcygwKSkpOwogICAgICB0b3BmYWNlLnB1c2goMSk7CgogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE47IGkrKykgewogICAgICAgIGNvbnN0IHRoZXRhID0gMiAqIE1hdGguUEkgLyBOICogKGkgKyAxKTsKICAgICAgICBjb25zdCB0aGV0YU4gPSAyICogTWF0aC5QSSAvIE4gKiAoaSArIDAuNSk7CgogICAgICAgIGlmIChpIDwgTiAtIDEpIHsKICAgICAgICAgIC8vIEJvdHRvbQogICAgICAgICAgdmVydGljZXMucHVzaChuZXcgVmVjMygtcmFkaXVzQm90dG9tICogc2luKHRoZXRhKSwgLWhlaWdodCAqIDAuNSwgcmFkaXVzQm90dG9tICogY29zKHRoZXRhKSkpOwogICAgICAgICAgYm90dG9tZmFjZS5wdXNoKDIgKiBpICsgMik7IC8vIFRvcAoKICAgICAgICAgIHZlcnRpY2VzLnB1c2gobmV3IFZlYzMoLXJhZGl1c1RvcCAqIHNpbih0aGV0YSksIGhlaWdodCAqIDAuNSwgcmFkaXVzVG9wICogY29zKHRoZXRhKSkpOwogICAgICAgICAgdG9wZmFjZS5wdXNoKDIgKiBpICsgMyk7IC8vIEZhY2UKCiAgICAgICAgICBmYWNlcy5wdXNoKFsyICogaSwgMiAqIGkgKyAxLCAyICogaSArIDMsIDIgKiBpICsgMl0pOwogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICBmYWNlcy5wdXNoKFsyICogaSwgMiAqIGkgKyAxLCAxLCAwXSk7IC8vIENvbm5lY3QKICAgICAgICB9IC8vIEF4aXM6IHdlIGNhbiBjdXQgb2ZmIGhhbGYgb2YgdGhlbSBpZiB3ZSBoYXZlIGV2ZW4gbnVtYmVyIG9mIHNlZ21lbnRzCgoKICAgICAgICBpZiAoTiAlIDIgPT09IDEgfHwgaSA8IE4gLyAyKSB7CiAgICAgICAgICBheGVzLnB1c2gobmV3IFZlYzMoLXNpbih0aGV0YU4pLCAwLCBjb3ModGhldGFOKSkpOwogICAgICAgIH0KICAgICAgfQoKICAgICAgZmFjZXMucHVzaChib3R0b21mYWNlKTsKICAgICAgYXhlcy5wdXNoKG5ldyBWZWMzKDAsIDEsIDApKTsgLy8gUmVvcmRlciB0b3AgZmFjZQoKICAgICAgY29uc3QgdGVtcCA9IFtdOwoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3BmYWNlLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgdGVtcC5wdXNoKHRvcGZhY2VbdG9wZmFjZS5sZW5ndGggLSBpIC0gMV0pOwogICAgICB9CgogICAgICBmYWNlcy5wdXNoKHRlbXApOwogICAgICBzdXBlcih7CiAgICAgICAgdmVydGljZXMsCiAgICAgICAgZmFjZXMsCiAgICAgICAgYXhlcwogICAgICB9KTsKICAgICAgdGhpcy50eXBlID0gU2hhcGUudHlwZXMuQ1lMSU5ERVI7CiAgICAgIHRoaXMucmFkaXVzVG9wID0gcmFkaXVzVG9wOwogICAgICB0aGlzLnJhZGl1c0JvdHRvbSA9IHJhZGl1c0JvdHRvbTsKICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7CiAgICAgIHRoaXMubnVtU2VnbWVudHMgPSBudW1TZWdtZW50czsKICAgIH0KCiAgfQoKICAvKioKICAgKiBQYXJ0aWNsZSBzaGFwZS4KICAgKiBAZXhhbXBsZQogICAqICAgICBjb25zdCBwYXJ0aWNsZVNoYXBlID0gbmV3IENBTk5PTi5QYXJ0aWNsZSgpCiAgICogICAgIGNvbnN0IHBhcnRpY2xlQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDEsIHNoYXBlOiBwYXJ0aWNsZVNoYXBlIH0pCiAgICogICAgIHdvcmxkLmFkZEJvZHkocGFydGljbGVCb2R5KQogICAqLwogIGNsYXNzIFBhcnRpY2xlIGV4dGVuZHMgU2hhcGUgewogICAgY29uc3RydWN0b3IoKSB7CiAgICAgIHN1cGVyKHsKICAgICAgICB0eXBlOiBTaGFwZS50eXBlcy5QQVJUSUNMRQogICAgICB9KTsKICAgIH0KICAgIC8qKgogICAgICogY2FsY3VsYXRlTG9jYWxJbmVydGlhCiAgICAgKi8KCgogICAgY2FsY3VsYXRlTG9jYWxJbmVydGlhKG1hc3MsIHRhcmdldCkgewogICAgICBpZiAodGFyZ2V0ID09PSB2b2lkIDApIHsKICAgICAgICB0YXJnZXQgPSBuZXcgVmVjMygpOwogICAgICB9CgogICAgICB0YXJnZXQuc2V0KDAsIDAsIDApOwogICAgICByZXR1cm4gdGFyZ2V0OwogICAgfQoKICAgIHZvbHVtZSgpIHsKICAgICAgcmV0dXJuIDA7CiAgICB9CgogICAgdXBkYXRlQm91bmRpbmdTcGhlcmVSYWRpdXMoKSB7CiAgICAgIHRoaXMuYm91bmRpbmdTcGhlcmVSYWRpdXMgPSAwOwogICAgfQoKICAgIGNhbGN1bGF0ZVdvcmxkQUFCQihwb3MsIHF1YXQsIG1pbiwgbWF4KSB7CiAgICAgIC8vIEdldCBlYWNoIGF4aXMgbWF4CiAgICAgIG1pbi5jb3B5KHBvcyk7CiAgICAgIG1heC5jb3B5KHBvcyk7CiAgICB9CgogIH0KCiAgLyoqCiAgICogQSBwbGFuZSwgZmFjaW5nIGluIHRoZSBaIGRpcmVjdGlvbi4gVGhlIHBsYW5lIGhhcyBpdHMgc3VyZmFjZSBhdCB6PTAgYW5kIGV2ZXJ5dGhpbmcgYmVsb3cgej0wIGlzIGFzc3VtZWQgdG8gYmUgc29saWQgcGxhbmUuIFRvIG1ha2UgdGhlIHBsYW5lIGZhY2UgaW4gc29tZSBvdGhlciBkaXJlY3Rpb24gdGhhbiB6LCB5b3UgbXVzdCBwdXQgaXQgaW5zaWRlIGEgQm9keSBhbmQgcm90YXRlIHRoYXQgYm9keS4gU2VlIHRoZSBkZW1vcy4KICAgKiBAZXhhbXBsZQogICAqICAgICBjb25zdCBwbGFuZVNoYXBlID0gbmV3IENBTk5PTi5QbGFuZSgpCiAgICogICAgIGNvbnN0IHBsYW5lQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDAsIHNoYXBlOiAgcGxhbmVTaGFwZSB9KQogICAqICAgICBwbGFuZUJvZHkucXVhdGVybmlvbi5zZXRGcm9tRXVsZXIoLU1hdGguUEkgLyAyLCAwLCAwKSAvLyBtYWtlIGl0IGZhY2UgdXAKICAgKiAgICAgd29ybGQuYWRkQm9keShwbGFuZUJvZHkpCiAgICovCiAgY2xhc3MgUGxhbmUgZXh0ZW5kcyBTaGFwZSB7CiAgICAvKiogd29ybGROb3JtYWwgKi8KCiAgICAvKiogd29ybGROb3JtYWxOZWVkc1VwZGF0ZSAqLwogICAgY29uc3RydWN0b3IoKSB7CiAgICAgIHN1cGVyKHsKICAgICAgICB0eXBlOiBTaGFwZS50eXBlcy5QTEFORQogICAgICB9KTsgLy8gV29ybGQgb3JpZW50ZWQgbm9ybWFsCgogICAgICB0aGlzLndvcmxkTm9ybWFsID0gbmV3IFZlYzMoKTsKICAgICAgdGhpcy53b3JsZE5vcm1hbE5lZWRzVXBkYXRlID0gdHJ1ZTsKICAgICAgdGhpcy5ib3VuZGluZ1NwaGVyZVJhZGl1cyA9IE51bWJlci5NQVhfVkFMVUU7CiAgICB9CiAgICAvKiogY29tcHV0ZVdvcmxkTm9ybWFsICovCgoKICAgIGNvbXB1dGVXb3JsZE5vcm1hbChxdWF0KSB7CiAgICAgIGNvbnN0IG4gPSB0aGlzLndvcmxkTm9ybWFsOwogICAgICBuLnNldCgwLCAwLCAxKTsKICAgICAgcXVhdC52bXVsdChuLCBuKTsKICAgICAgdGhpcy53b3JsZE5vcm1hbE5lZWRzVXBkYXRlID0gZmFsc2U7CiAgICB9CgogICAgY2FsY3VsYXRlTG9jYWxJbmVydGlhKG1hc3MsIHRhcmdldCkgewogICAgICBpZiAodGFyZ2V0ID09PSB2b2lkIDApIHsKICAgICAgICB0YXJnZXQgPSBuZXcgVmVjMygpOwogICAgICB9CgogICAgICByZXR1cm4gdGFyZ2V0OwogICAgfQoKICAgIHZvbHVtZSgpIHsKICAgICAgcmV0dXJuICgvLyBUaGUgcGxhbmUgaXMgaW5maW5pdGUuLi4KICAgICAgICBOdW1iZXIuTUFYX1ZBTFVFCiAgICAgICk7CiAgICB9CgogICAgY2FsY3VsYXRlV29ybGRBQUJCKHBvcywgcXVhdCwgbWluLCBtYXgpIHsKICAgICAgLy8gVGhlIHBsYW5lIEFBQkIgaXMgaW5maW5pdGUsIGV4Y2VwdCBpZiB0aGUgbm9ybWFsIGlzIHBvaW50aW5nIGFsb25nIGFueSBheGlzCiAgICAgIHRlbXBOb3JtYWwuc2V0KDAsIDAsIDEpOyAvLyBEZWZhdWx0IHBsYW5lIG5vcm1hbCBpcyB6CgogICAgICBxdWF0LnZtdWx0KHRlbXBOb3JtYWwsIHRlbXBOb3JtYWwpOwogICAgICBjb25zdCBtYXhWYWwgPSBOdW1iZXIuTUFYX1ZBTFVFOwogICAgICBtaW4uc2V0KC1tYXhWYWwsIC1tYXhWYWwsIC1tYXhWYWwpOwogICAgICBtYXguc2V0KG1heFZhbCwgbWF4VmFsLCBtYXhWYWwpOwoKICAgICAgaWYgKHRlbXBOb3JtYWwueCA9PT0gMSkgewogICAgICAgIG1heC54ID0gcG9zLng7CiAgICAgIH0gZWxzZSBpZiAodGVtcE5vcm1hbC54ID09PSAtMSkgewogICAgICAgIG1pbi54ID0gcG9zLng7CiAgICAgIH0KCiAgICAgIGlmICh0ZW1wTm9ybWFsLnkgPT09IDEpIHsKICAgICAgICBtYXgueSA9IHBvcy55OwogICAgICB9IGVsc2UgaWYgKHRlbXBOb3JtYWwueSA9PT0gLTEpIHsKICAgICAgICBtaW4ueSA9IHBvcy55OwogICAgICB9CgogICAgICBpZiAodGVtcE5vcm1hbC56ID09PSAxKSB7CiAgICAgICAgbWF4LnogPSBwb3MuejsKICAgICAgfSBlbHNlIGlmICh0ZW1wTm9ybWFsLnogPT09IC0xKSB7CiAgICAgICAgbWluLnogPSBwb3MuejsKICAgICAgfQogICAgfQoKICAgIHVwZGF0ZUJvdW5kaW5nU3BoZXJlUmFkaXVzKCkgewogICAgICB0aGlzLmJvdW5kaW5nU3BoZXJlUmFkaXVzID0gTnVtYmVyLk1BWF9WQUxVRTsKICAgIH0KCiAgfQogIGNvbnN0IHRlbXBOb3JtYWwgPSBuZXcgVmVjMygpOwoKICAvKioKICAgKiBIZWlnaHRmaWVsZCBzaGFwZSBjbGFzcy4gSGVpZ2h0IGRhdGEgaXMgZ2l2ZW4gYXMgYW4gYXJyYXkuIFRoZXNlIGRhdGEgcG9pbnRzIGFyZSBzcHJlYWQgb3V0IGV2ZW5seSB3aXRoIGEgZ2l2ZW4gZGlzdGFuY2UuCiAgICogQHRvZG8gU2hvdWxkIGJlIHBvc3NpYmxlIHRvIHVzZSBhbG9uZyBhbGwgYXhlcywgbm90IGp1c3QgeQogICAqIEB0b2RvIHNob3VsZCBiZSBwb3NzaWJsZSB0byBzY2FsZSBhbG9uZyBhbGwgYXhlcwogICAqIEB0b2RvIFJlZmFjdG9yIGVsZW1lbnRTaXplIHRvIGVsZW1lbnRTaXplWCBhbmQgZWxlbWVudFNpemVZCiAgICoKICAgKiBAZXhhbXBsZQogICAqICAgICAvLyBHZW5lcmF0ZSBzb21lIGhlaWdodCBkYXRhICh5LXZhbHVlcykuCiAgICogICAgIGNvbnN0IGRhdGEgPSBbXQogICAqICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDA7IGkrKykgewogICAqICAgICAgICAgY29uc3QgeSA9IDAuNSAqIE1hdGguY29zKDAuMiAqIGkpCiAgICogICAgICAgICBkYXRhLnB1c2goeSkKICAgKiAgICAgfQogICAqCiAgICogICAgIC8vIENyZWF0ZSB0aGUgaGVpZ2h0ZmllbGQgc2hhcGUKICAgKiAgICAgY29uc3QgaGVpZ2h0ZmllbGRTaGFwZSA9IG5ldyBDQU5OT04uSGVpZ2h0ZmllbGQoZGF0YSwgewogICAqICAgICAgICAgZWxlbWVudFNpemU6IDEgLy8gRGlzdGFuY2UgYmV0d2VlbiB0aGUgZGF0YSBwb2ludHMgaW4gWCBhbmQgWSBkaXJlY3Rpb25zCiAgICogICAgIH0pCiAgICogICAgIGNvbnN0IGhlaWdodGZpZWxkQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IHNoYXBlOiBoZWlnaHRmaWVsZFNoYXBlIH0pCiAgICogICAgIHdvcmxkLmFkZEJvZHkoaGVpZ2h0ZmllbGRCb2R5KQogICAqLwogIGNsYXNzIEhlaWdodGZpZWxkIGV4dGVuZHMgU2hhcGUgewogICAgLyoqCiAgICAgKiBBbiBhcnJheSBvZiBudW1iZXJzLCBvciBoZWlnaHQgdmFsdWVzLCB0aGF0IGFyZSBzcHJlYWQgb3V0IGFsb25nIHRoZSB4IGF4aXMuCiAgICAgKi8KCiAgICAvKioKICAgICAqIE1heCB2YWx1ZSBvZiB0aGUgZGF0YSBwb2ludHMgaW4gdGhlIGRhdGEgYXJyYXkuCiAgICAgKi8KCiAgICAvKioKICAgICAqIE1pbmltdW0gdmFsdWUgb2YgdGhlIGRhdGEgcG9pbnRzIGluIHRoZSBkYXRhIGFycmF5LgogICAgICovCgogICAgLyoqCiAgICAgKiBXb3JsZCBzcGFjaW5nIGJldHdlZW4gdGhlIGRhdGEgcG9pbnRzIGluIFggYW5kIFkgZGlyZWN0aW9uLgogICAgICogQHRvZG8gZWxlbWVudFNpemVYIGFuZCBZCiAgICAgKiBAZGVmYXVsdCAxCiAgICAgKi8KCiAgICAvKioKICAgICAqIEBkZWZhdWx0IHRydWUKICAgICAqLwoKICAgIC8qKgogICAgICogQHBhcmFtIGRhdGEgQW4gYXJyYXkgb2YgbnVtYmVycywgb3IgaGVpZ2h0IHZhbHVlcywgdGhhdCBhcmUgc3ByZWFkIG91dCBhbG9uZyB0aGUgeCBheGlzLgogICAgICovCiAgICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zKSB7CiAgICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsKICAgICAgICBvcHRpb25zID0ge307CiAgICAgIH0KCiAgICAgIG9wdGlvbnMgPSBVdGlscy5kZWZhdWx0cyhvcHRpb25zLCB7CiAgICAgICAgbWF4VmFsdWU6IG51bGwsCiAgICAgICAgbWluVmFsdWU6IG51bGwsCiAgICAgICAgZWxlbWVudFNpemU6IDEKICAgICAgfSk7CiAgICAgIHN1cGVyKHsKICAgICAgICB0eXBlOiBTaGFwZS50eXBlcy5IRUlHSFRGSUVMRAogICAgICB9KTsKICAgICAgdGhpcy5kYXRhID0gZGF0YTsKICAgICAgdGhpcy5tYXhWYWx1ZSA9IG9wdGlvbnMubWF4VmFsdWU7CiAgICAgIHRoaXMubWluVmFsdWUgPSBvcHRpb25zLm1pblZhbHVlOwogICAgICB0aGlzLmVsZW1lbnRTaXplID0gb3B0aW9ucy5lbGVtZW50U2l6ZTsKCiAgICAgIGlmIChvcHRpb25zLm1pblZhbHVlID09PSBudWxsKSB7CiAgICAgICAgdGhpcy51cGRhdGVNaW5WYWx1ZSgpOwogICAgICB9CgogICAgICBpZiAob3B0aW9ucy5tYXhWYWx1ZSA9PT0gbnVsbCkgewogICAgICAgIHRoaXMudXBkYXRlTWF4VmFsdWUoKTsKICAgICAgfQoKICAgICAgdGhpcy5jYWNoZUVuYWJsZWQgPSB0cnVlOwogICAgICB0aGlzLnBpbGxhckNvbnZleCA9IG5ldyBDb252ZXhQb2x5aGVkcm9uKCk7CiAgICAgIHRoaXMucGlsbGFyT2Zmc2V0ID0gbmV3IFZlYzMoKTsKICAgICAgdGhpcy51cGRhdGVCb3VuZGluZ1NwaGVyZVJhZGl1cygpOyAvLyAiaV9qX2lzVXBwZXIiID0+IHsgY29udmV4OiAuLi4sIG9mZnNldDogLi4uIH0KICAgICAgLy8gZm9yIGV4YW1wbGU6CiAgICAgIC8vIF9jYWNoZWRQaWxsYXJzWyIwXzJfMSJdCgogICAgICB0aGlzLl9jYWNoZWRQaWxsYXJzID0ge307CiAgICB9CiAgICAvKioKICAgICAqIENhbGwgd2hlbmV2ZXIgeW91IGNoYW5nZSB0aGUgZGF0YSBhcnJheS4KICAgICAqLwoKCiAgICB1cGRhdGUoKSB7CiAgICAgIHRoaXMuX2NhY2hlZFBpbGxhcnMgPSB7fTsKICAgIH0KICAgIC8qKgogICAgICogVXBkYXRlIHRoZSBgbWluVmFsdWVgIHByb3BlcnR5CiAgICAgKi8KCgogICAgdXBkYXRlTWluVmFsdWUoKSB7CiAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmRhdGE7CiAgICAgIGxldCBtaW5WYWx1ZSA9IGRhdGFbMF1bMF07CgogICAgICBmb3IgKGxldCBpID0gMDsgaSAhPT0gZGF0YS5sZW5ndGg7IGkrKykgewogICAgICAgIGZvciAobGV0IGogPSAwOyBqICE9PSBkYXRhW2ldLmxlbmd0aDsgaisrKSB7CiAgICAgICAgICBjb25zdCB2ID0gZGF0YVtpXVtqXTsKCiAgICAgICAgICBpZiAodiA8IG1pblZhbHVlKSB7CiAgICAgICAgICAgIG1pblZhbHVlID0gdjsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KCiAgICAgIHRoaXMubWluVmFsdWUgPSBtaW5WYWx1ZTsKICAgIH0KICAgIC8qKgogICAgICogVXBkYXRlIHRoZSBgbWF4VmFsdWVgIHByb3BlcnR5CiAgICAgKi8KCgogICAgdXBkYXRlTWF4VmFsdWUoKSB7CiAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmRhdGE7CiAgICAgIGxldCBtYXhWYWx1ZSA9IGRhdGFbMF1bMF07CgogICAgICBmb3IgKGxldCBpID0gMDsgaSAhPT0gZGF0YS5sZW5ndGg7IGkrKykgewogICAgICAgIGZvciAobGV0IGogPSAwOyBqICE9PSBkYXRhW2ldLmxlbmd0aDsgaisrKSB7CiAgICAgICAgICBjb25zdCB2ID0gZGF0YVtpXVtqXTsKCiAgICAgICAgICBpZiAodiA+IG1heFZhbHVlKSB7CiAgICAgICAgICAgIG1heFZhbHVlID0gdjsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KCiAgICAgIHRoaXMubWF4VmFsdWUgPSBtYXhWYWx1ZTsKICAgIH0KICAgIC8qKgogICAgICogU2V0IHRoZSBoZWlnaHQgdmFsdWUgYXQgYW4gaW5kZXguIERvbid0IGZvcmdldCB0byB1cGRhdGUgbWF4VmFsdWUgYW5kIG1pblZhbHVlIGFmdGVyIHlvdSdyZSBkb25lLgogICAgICovCgoKICAgIHNldEhlaWdodFZhbHVlQXRJbmRleCh4aSwgeWksIHZhbHVlKSB7CiAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmRhdGE7CiAgICAgIGRhdGFbeGldW3lpXSA9IHZhbHVlOyAvLyBJbnZhbGlkYXRlIGNhY2hlCgogICAgICB0aGlzLmNsZWFyQ2FjaGVkQ29udmV4VHJpYW5nbGVQaWxsYXIoeGksIHlpLCBmYWxzZSk7CgogICAgICBpZiAoeGkgPiAwKSB7CiAgICAgICAgdGhpcy5jbGVhckNhY2hlZENvbnZleFRyaWFuZ2xlUGlsbGFyKHhpIC0gMSwgeWksIHRydWUpOwogICAgICAgIHRoaXMuY2xlYXJDYWNoZWRDb252ZXhUcmlhbmdsZVBpbGxhcih4aSAtIDEsIHlpLCBmYWxzZSk7CiAgICAgIH0KCiAgICAgIGlmICh5aSA+IDApIHsKICAgICAgICB0aGlzLmNsZWFyQ2FjaGVkQ29udmV4VHJpYW5nbGVQaWxsYXIoeGksIHlpIC0gMSwgdHJ1ZSk7CiAgICAgICAgdGhpcy5jbGVhckNhY2hlZENvbnZleFRyaWFuZ2xlUGlsbGFyKHhpLCB5aSAtIDEsIGZhbHNlKTsKICAgICAgfQoKICAgICAgaWYgKHlpID4gMCAmJiB4aSA+IDApIHsKICAgICAgICB0aGlzLmNsZWFyQ2FjaGVkQ29udmV4VHJpYW5nbGVQaWxsYXIoeGkgLSAxLCB5aSAtIDEsIHRydWUpOwogICAgICB9CiAgICB9CiAgICAvKioKICAgICAqIEdldCBtYXgvbWluIGluIGEgcmVjdGFuZ2xlIGluIHRoZSBtYXRyaXggZGF0YQogICAgICogQHBhcmFtIHJlc3VsdCBBbiBhcnJheSB0byBzdG9yZSB0aGUgcmVzdWx0cyBpbi4KICAgICAqIEByZXR1cm4gVGhlIHJlc3VsdCBhcnJheSwgaWYgaXQgd2FzIHBhc3NlZCBpbi4gTWluaW11bSB3aWxsIGJlIGF0IHBvc2l0aW9uIDAgYW5kIG1heCBhdCAxLgogICAgICovCgoKICAgIGdldFJlY3RNaW5NYXgoaU1pblgsIGlNaW5ZLCBpTWF4WCwgaU1heFksIHJlc3VsdCkgewogICAgICBpZiAocmVzdWx0ID09PSB2b2lkIDApIHsKICAgICAgICByZXN1bHQgPSBbXTsKICAgICAgfQoKICAgICAgLy8gR2V0IG1heCBhbmQgbWluIG9mIHRoZSBkYXRhCiAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmRhdGE7IC8vIFNldCBmaXJzdCB2YWx1ZQoKICAgICAgbGV0IG1heCA9IHRoaXMubWluVmFsdWU7CgogICAgICBmb3IgKGxldCBpID0gaU1pblg7IGkgPD0gaU1heFg7IGkrKykgewogICAgICAgIGZvciAobGV0IGogPSBpTWluWTsgaiA8PSBpTWF4WTsgaisrKSB7CiAgICAgICAgICBjb25zdCBoZWlnaHQgPSBkYXRhW2ldW2pdOwoKICAgICAgICAgIGlmIChoZWlnaHQgPiBtYXgpIHsKICAgICAgICAgICAgbWF4ID0gaGVpZ2h0OwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfQoKICAgICAgcmVzdWx0WzBdID0gdGhpcy5taW5WYWx1ZTsKICAgICAgcmVzdWx0WzFdID0gbWF4OwogICAgfQogICAgLyoqCiAgICAgKiBHZXQgdGhlIGluZGV4IG9mIGEgbG9jYWwgcG9zaXRpb24gb24gdGhlIGhlaWdodGZpZWxkLiBUaGUgaW5kZXhlcyBpbmRpY2F0ZSB0aGUgcmVjdGFuZ2xlcywgc28gaWYgeW91ciB0ZXJyYWluIGlzIG1hZGUgb2YgTiB4IE4gaGVpZ2h0IGRhdGEgcG9pbnRzLCB5b3Ugd2lsbCBoYXZlIHJlY3RhbmdsZSBpbmRleGVzIHJhbmdpbmcgZnJvbSAwIHRvIE4tMS4KICAgICAqIEBwYXJhbSByZXN1bHQgVHdvLWVsZW1lbnQgYXJyYXkKICAgICAqIEBwYXJhbSBjbGFtcCBJZiB0aGUgcG9zaXRpb24gc2hvdWxkIGJlIGNsYW1wZWQgdG8gdGhlIGhlaWdodGZpZWxkIGVkZ2UuCiAgICAgKi8KCgogICAgZ2V0SW5kZXhPZlBvc2l0aW9uKHgsIHksIHJlc3VsdCwgY2xhbXApIHsKICAgICAgLy8gR2V0IHRoZSBpbmRleCBvZiB0aGUgZGF0YSBwb2ludHMgdG8gdGVzdCBhZ2FpbnN0CiAgICAgIGNvbnN0IHcgPSB0aGlzLmVsZW1lbnRTaXplOwogICAgICBjb25zdCBkYXRhID0gdGhpcy5kYXRhOwogICAgICBsZXQgeGkgPSBNYXRoLmZsb29yKHggLyB3KTsKICAgICAgbGV0IHlpID0gTWF0aC5mbG9vcih5IC8gdyk7CiAgICAgIHJlc3VsdFswXSA9IHhpOwogICAgICByZXN1bHRbMV0gPSB5aTsKCiAgICAgIGlmIChjbGFtcCkgewogICAgICAgIC8vIENsYW1wIGluZGV4IHRvIGVkZ2VzCiAgICAgICAgaWYgKHhpIDwgMCkgewogICAgICAgICAgeGkgPSAwOwogICAgICAgIH0KCiAgICAgICAgaWYgKHlpIDwgMCkgewogICAgICAgICAgeWkgPSAwOwogICAgICAgIH0KCiAgICAgICAgaWYgKHhpID49IGRhdGEubGVuZ3RoIC0gMSkgewogICAgICAgICAgeGkgPSBkYXRhLmxlbmd0aCAtIDE7CiAgICAgICAgfQoKICAgICAgICBpZiAoeWkgPj0gZGF0YVswXS5sZW5ndGggLSAxKSB7CiAgICAgICAgICB5aSA9IGRhdGFbMF0ubGVuZ3RoIC0gMTsKICAgICAgICB9CiAgICAgIH0gLy8gQmFpbCBvdXQgaWYgd2UgYXJlIG91dCBvZiB0aGUgdGVycmFpbgoKCiAgICAgIGlmICh4aSA8IDAgfHwgeWkgPCAwIHx8IHhpID49IGRhdGEubGVuZ3RoIC0gMSB8fCB5aSA+PSBkYXRhWzBdLmxlbmd0aCAtIDEpIHsKICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgIH0KCiAgICAgIHJldHVybiB0cnVlOwogICAgfQoKICAgIGdldFRyaWFuZ2xlQXQoeCwgeSwgZWRnZUNsYW1wLCBhLCBiLCBjKSB7CiAgICAgIGNvbnN0IGlkeCA9IGdldEhlaWdodEF0X2lkeDsKICAgICAgdGhpcy5nZXRJbmRleE9mUG9zaXRpb24oeCwgeSwgaWR4LCBlZGdlQ2xhbXApOwogICAgICBsZXQgeGkgPSBpZHhbMF07CiAgICAgIGxldCB5aSA9IGlkeFsxXTsKICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZGF0YTsKCiAgICAgIGlmIChlZGdlQ2xhbXApIHsKICAgICAgICB4aSA9IE1hdGgubWluKGRhdGEubGVuZ3RoIC0gMiwgTWF0aC5tYXgoMCwgeGkpKTsKICAgICAgICB5aSA9IE1hdGgubWluKGRhdGFbMF0ubGVuZ3RoIC0gMiwgTWF0aC5tYXgoMCwgeWkpKTsKICAgICAgfQoKICAgICAgY29uc3QgZWxlbWVudFNpemUgPSB0aGlzLmVsZW1lbnRTaXplOwogICAgICBjb25zdCBsb3dlckRpc3QyID0gKHggLyBlbGVtZW50U2l6ZSAtIHhpKSAqKiAyICsgKHkgLyBlbGVtZW50U2l6ZSAtIHlpKSAqKiAyOwogICAgICBjb25zdCB1cHBlckRpc3QyID0gKHggLyBlbGVtZW50U2l6ZSAtICh4aSArIDEpKSAqKiAyICsgKHkgLyBlbGVtZW50U2l6ZSAtICh5aSArIDEpKSAqKiAyOwogICAgICBjb25zdCB1cHBlciA9IGxvd2VyRGlzdDIgPiB1cHBlckRpc3QyOwogICAgICB0aGlzLmdldFRyaWFuZ2xlKHhpLCB5aSwgdXBwZXIsIGEsIGIsIGMpOwogICAgICByZXR1cm4gdXBwZXI7CiAgICB9CgogICAgZ2V0Tm9ybWFsQXQoeCwgeSwgZWRnZUNsYW1wLCByZXN1bHQpIHsKICAgICAgY29uc3QgYSA9IGdldE5vcm1hbEF0X2E7CiAgICAgIGNvbnN0IGIgPSBnZXROb3JtYWxBdF9iOwogICAgICBjb25zdCBjID0gZ2V0Tm9ybWFsQXRfYzsKICAgICAgY29uc3QgZTAgPSBnZXROb3JtYWxBdF9lMDsKICAgICAgY29uc3QgZTEgPSBnZXROb3JtYWxBdF9lMTsKICAgICAgdGhpcy5nZXRUcmlhbmdsZUF0KHgsIHksIGVkZ2VDbGFtcCwgYSwgYiwgYyk7CiAgICAgIGIudnN1YihhLCBlMCk7CiAgICAgIGMudnN1YihhLCBlMSk7CiAgICAgIGUwLmNyb3NzKGUxLCByZXN1bHQpOwogICAgICByZXN1bHQubm9ybWFsaXplKCk7CiAgICB9CiAgICAvKioKICAgICAqIEdldCBhbiBBQUJCIG9mIGEgc3F1YXJlIGluIHRoZSBoZWlnaHRmaWVsZAogICAgICogQHBhcmFtIHhpCiAgICAgKiBAcGFyYW0geWkKICAgICAqIEBwYXJhbSByZXN1bHQKICAgICAqLwoKCiAgICBnZXRBYWJiQXRJbmRleCh4aSwgeWksIF9yZWYpIHsKICAgICAgbGV0IHsKICAgICAgICBsb3dlckJvdW5kLAogICAgICAgIHVwcGVyQm91bmQKICAgICAgfSA9IF9yZWY7CiAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmRhdGE7CiAgICAgIGNvbnN0IGVsZW1lbnRTaXplID0gdGhpcy5lbGVtZW50U2l6ZTsKICAgICAgbG93ZXJCb3VuZC5zZXQoeGkgKiBlbGVtZW50U2l6ZSwgeWkgKiBlbGVtZW50U2l6ZSwgZGF0YVt4aV1beWldKTsKICAgICAgdXBwZXJCb3VuZC5zZXQoKHhpICsgMSkgKiBlbGVtZW50U2l6ZSwgKHlpICsgMSkgKiBlbGVtZW50U2l6ZSwgZGF0YVt4aSArIDFdW3lpICsgMV0pOwogICAgfQogICAgLyoqCiAgICAgKiBHZXQgdGhlIGhlaWdodCBpbiB0aGUgaGVpZ2h0ZmllbGQgYXQgYSBnaXZlbiBwb3NpdGlvbgogICAgICovCgoKICAgIGdldEhlaWdodEF0KHgsIHksIGVkZ2VDbGFtcCkgewogICAgICBjb25zdCBkYXRhID0gdGhpcy5kYXRhOwogICAgICBjb25zdCBhID0gZ2V0SGVpZ2h0QXRfYTsKICAgICAgY29uc3QgYiA9IGdldEhlaWdodEF0X2I7CiAgICAgIGNvbnN0IGMgPSBnZXRIZWlnaHRBdF9jOwogICAgICBjb25zdCBpZHggPSBnZXRIZWlnaHRBdF9pZHg7CiAgICAgIHRoaXMuZ2V0SW5kZXhPZlBvc2l0aW9uKHgsIHksIGlkeCwgZWRnZUNsYW1wKTsKICAgICAgbGV0IHhpID0gaWR4WzBdOwogICAgICBsZXQgeWkgPSBpZHhbMV07CgogICAgICBpZiAoZWRnZUNsYW1wKSB7CiAgICAgICAgeGkgPSBNYXRoLm1pbihkYXRhLmxlbmd0aCAtIDIsIE1hdGgubWF4KDAsIHhpKSk7CiAgICAgICAgeWkgPSBNYXRoLm1pbihkYXRhWzBdLmxlbmd0aCAtIDIsIE1hdGgubWF4KDAsIHlpKSk7CiAgICAgIH0KCiAgICAgIGNvbnN0IHVwcGVyID0gdGhpcy5nZXRUcmlhbmdsZUF0KHgsIHksIGVkZ2VDbGFtcCwgYSwgYiwgYyk7CiAgICAgIGJhcnljZW50cmljV2VpZ2h0cyh4LCB5LCBhLngsIGEueSwgYi54LCBiLnksIGMueCwgYy55LCBnZXRIZWlnaHRBdF93ZWlnaHRzKTsKICAgICAgY29uc3QgdyA9IGdldEhlaWdodEF0X3dlaWdodHM7CgogICAgICBpZiAodXBwZXIpIHsKICAgICAgICAvLyBUb3AgdHJpYW5nbGUgdmVydHMKICAgICAgICByZXR1cm4gZGF0YVt4aSArIDFdW3lpICsgMV0gKiB3LnggKyBkYXRhW3hpXVt5aSArIDFdICogdy55ICsgZGF0YVt4aSArIDFdW3lpXSAqIHcuejsKICAgICAgfSBlbHNlIHsKICAgICAgICAvLyBUb3AgdHJpYW5nbGUgdmVydHMKICAgICAgICByZXR1cm4gZGF0YVt4aV1beWldICogdy54ICsgZGF0YVt4aSArIDFdW3lpXSAqIHcueSArIGRhdGFbeGldW3lpICsgMV0gKiB3Lno7CiAgICAgIH0KICAgIH0KCiAgICBnZXRDYWNoZUNvbnZleFRyaWFuZ2xlUGlsbGFyS2V5KHhpLCB5aSwgZ2V0VXBwZXJUcmlhbmdsZSkgewogICAgICByZXR1cm4gYCR7eGl9XyR7eWl9XyR7Z2V0VXBwZXJUcmlhbmdsZSA/IDEgOiAwfWA7CiAgICB9CgogICAgZ2V0Q2FjaGVkQ29udmV4VHJpYW5nbGVQaWxsYXIoeGksIHlpLCBnZXRVcHBlclRyaWFuZ2xlKSB7CiAgICAgIHJldHVybiB0aGlzLl9jYWNoZWRQaWxsYXJzW3RoaXMuZ2V0Q2FjaGVDb252ZXhUcmlhbmdsZVBpbGxhcktleSh4aSwgeWksIGdldFVwcGVyVHJpYW5nbGUpXTsKICAgIH0KCiAgICBzZXRDYWNoZWRDb252ZXhUcmlhbmdsZVBpbGxhcih4aSwgeWksIGdldFVwcGVyVHJpYW5nbGUsIGNvbnZleCwgb2Zmc2V0KSB7CiAgICAgIHRoaXMuX2NhY2hlZFBpbGxhcnNbdGhpcy5nZXRDYWNoZUNvbnZleFRyaWFuZ2xlUGlsbGFyS2V5KHhpLCB5aSwgZ2V0VXBwZXJUcmlhbmdsZSldID0gewogICAgICAgIGNvbnZleCwKICAgICAgICBvZmZzZXQKICAgICAgfTsKICAgIH0KCiAgICBjbGVhckNhY2hlZENvbnZleFRyaWFuZ2xlUGlsbGFyKHhpLCB5aSwgZ2V0VXBwZXJUcmlhbmdsZSkgewogICAgICBkZWxldGUgdGhpcy5fY2FjaGVkUGlsbGFyc1t0aGlzLmdldENhY2hlQ29udmV4VHJpYW5nbGVQaWxsYXJLZXkoeGksIHlpLCBnZXRVcHBlclRyaWFuZ2xlKV07CiAgICB9CiAgICAvKioKICAgICAqIEdldCBhIHRyaWFuZ2xlIGZyb20gdGhlIGhlaWdodGZpZWxkCiAgICAgKi8KCgogICAgZ2V0VHJpYW5nbGUoeGksIHlpLCB1cHBlciwgYSwgYiwgYykgewogICAgICBjb25zdCBkYXRhID0gdGhpcy5kYXRhOwogICAgICBjb25zdCBlbGVtZW50U2l6ZSA9IHRoaXMuZWxlbWVudFNpemU7CgogICAgICBpZiAodXBwZXIpIHsKICAgICAgICAvLyBUb3AgdHJpYW5nbGUgdmVydHMKICAgICAgICBhLnNldCgoeGkgKyAxKSAqIGVsZW1lbnRTaXplLCAoeWkgKyAxKSAqIGVsZW1lbnRTaXplLCBkYXRhW3hpICsgMV1beWkgKyAxXSk7CiAgICAgICAgYi5zZXQoeGkgKiBlbGVtZW50U2l6ZSwgKHlpICsgMSkgKiBlbGVtZW50U2l6ZSwgZGF0YVt4aV1beWkgKyAxXSk7CiAgICAgICAgYy5zZXQoKHhpICsgMSkgKiBlbGVtZW50U2l6ZSwgeWkgKiBlbGVtZW50U2l6ZSwgZGF0YVt4aSArIDFdW3lpXSk7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgLy8gVG9wIHRyaWFuZ2xlIHZlcnRzCiAgICAgICAgYS5zZXQoeGkgKiBlbGVtZW50U2l6ZSwgeWkgKiBlbGVtZW50U2l6ZSwgZGF0YVt4aV1beWldKTsKICAgICAgICBiLnNldCgoeGkgKyAxKSAqIGVsZW1lbnRTaXplLCB5aSAqIGVsZW1lbnRTaXplLCBkYXRhW3hpICsgMV1beWldKTsKICAgICAgICBjLnNldCh4aSAqIGVsZW1lbnRTaXplLCAoeWkgKyAxKSAqIGVsZW1lbnRTaXplLCBkYXRhW3hpXVt5aSArIDFdKTsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBHZXQgYSB0cmlhbmdsZSBpbiB0aGUgdGVycmFpbiBpbiB0aGUgZm9ybSBvZiBhIHRyaWFuZ3VsYXIgY29udmV4IHNoYXBlLgogICAgICovCgoKICAgIGdldENvbnZleFRyaWFuZ2xlUGlsbGFyKHhpLCB5aSwgZ2V0VXBwZXJUcmlhbmdsZSkgewogICAgICBsZXQgcmVzdWx0ID0gdGhpcy5waWxsYXJDb252ZXg7CiAgICAgIGxldCBvZmZzZXRSZXN1bHQgPSB0aGlzLnBpbGxhck9mZnNldDsKCiAgICAgIGlmICh0aGlzLmNhY2hlRW5hYmxlZCkgewogICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmdldENhY2hlZENvbnZleFRyaWFuZ2xlUGlsbGFyKHhpLCB5aSwgZ2V0VXBwZXJUcmlhbmdsZSk7CgogICAgICAgIGlmIChkYXRhKSB7CiAgICAgICAgICB0aGlzLnBpbGxhckNvbnZleCA9IGRhdGEuY29udmV4OwogICAgICAgICAgdGhpcy5waWxsYXJPZmZzZXQgPSBkYXRhLm9mZnNldDsKICAgICAgICAgIHJldHVybjsKICAgICAgICB9CgogICAgICAgIHJlc3VsdCA9IG5ldyBDb252ZXhQb2x5aGVkcm9uKCk7CiAgICAgICAgb2Zmc2V0UmVzdWx0ID0gbmV3IFZlYzMoKTsKICAgICAgICB0aGlzLnBpbGxhckNvbnZleCA9IHJlc3VsdDsKICAgICAgICB0aGlzLnBpbGxhck9mZnNldCA9IG9mZnNldFJlc3VsdDsKICAgICAgfQoKICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZGF0YTsKICAgICAgY29uc3QgZWxlbWVudFNpemUgPSB0aGlzLmVsZW1lbnRTaXplOwogICAgICBjb25zdCBmYWNlcyA9IHJlc3VsdC5mYWNlczsgLy8gUmV1c2UgdmVydHMgaWYgcG9zc2libGUKCiAgICAgIHJlc3VsdC52ZXJ0aWNlcy5sZW5ndGggPSA2OwoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2OyBpKyspIHsKICAgICAgICBpZiAoIXJlc3VsdC52ZXJ0aWNlc1tpXSkgewogICAgICAgICAgcmVzdWx0LnZlcnRpY2VzW2ldID0gbmV3IFZlYzMoKTsKICAgICAgICB9CiAgICAgIH0gLy8gUmV1c2UgZmFjZXMgaWYgcG9zc2libGUKCgogICAgICBmYWNlcy5sZW5ndGggPSA1OwoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHsKICAgICAgICBpZiAoIWZhY2VzW2ldKSB7CiAgICAgICAgICBmYWNlc1tpXSA9IFtdOwogICAgICAgIH0KICAgICAgfQoKICAgICAgY29uc3QgdmVydHMgPSByZXN1bHQudmVydGljZXM7CiAgICAgIGNvbnN0IGggPSAoTWF0aC5taW4oZGF0YVt4aV1beWldLCBkYXRhW3hpICsgMV1beWldLCBkYXRhW3hpXVt5aSArIDFdLCBkYXRhW3hpICsgMV1beWkgKyAxXSkgLSB0aGlzLm1pblZhbHVlKSAvIDIgKyB0aGlzLm1pblZhbHVlOwoKICAgICAgaWYgKCFnZXRVcHBlclRyaWFuZ2xlKSB7CiAgICAgICAgLy8gQ2VudGVyIG9mIHRoZSB0cmlhbmdsZSBwaWxsYXIgLSBhbGwgcG9seWdvbnMgYXJlIGdpdmVuIHJlbGF0aXZlIHRvIHRoaXMgb25lCiAgICAgICAgb2Zmc2V0UmVzdWx0LnNldCgoeGkgKyAwLjI1KSAqIGVsZW1lbnRTaXplLCAvLyBzb3J0IG9mIGNlbnRlciBvZiBhIHRyaWFuZ2xlCiAgICAgICAgKHlpICsgMC4yNSkgKiBlbGVtZW50U2l6ZSwgaCAvLyB2ZXJ0aWNhbCBjZW50ZXIKICAgICAgICApOyAvLyBUb3AgdHJpYW5nbGUgdmVydHMKCiAgICAgICAgdmVydHNbMF0uc2V0KC0wLjI1ICogZWxlbWVudFNpemUsIC0wLjI1ICogZWxlbWVudFNpemUsIGRhdGFbeGldW3lpXSAtIGgpOwogICAgICAgIHZlcnRzWzFdLnNldCgwLjc1ICogZWxlbWVudFNpemUsIC0wLjI1ICogZWxlbWVudFNpemUsIGRhdGFbeGkgKyAxXVt5aV0gLSBoKTsKICAgICAgICB2ZXJ0c1syXS5zZXQoLTAuMjUgKiBlbGVtZW50U2l6ZSwgMC43NSAqIGVsZW1lbnRTaXplLCBkYXRhW3hpXVt5aSArIDFdIC0gaCk7IC8vIGJvdHRvbSB0cmlhbmdsZSB2ZXJ0cwoKICAgICAgICB2ZXJ0c1szXS5zZXQoLTAuMjUgKiBlbGVtZW50U2l6ZSwgLTAuMjUgKiBlbGVtZW50U2l6ZSwgLU1hdGguYWJzKGgpIC0gMSk7CiAgICAgICAgdmVydHNbNF0uc2V0KDAuNzUgKiBlbGVtZW50U2l6ZSwgLTAuMjUgKiBlbGVtZW50U2l6ZSwgLU1hdGguYWJzKGgpIC0gMSk7CiAgICAgICAgdmVydHNbNV0uc2V0KC0wLjI1ICogZWxlbWVudFNpemUsIDAuNzUgKiBlbGVtZW50U2l6ZSwgLU1hdGguYWJzKGgpIC0gMSk7IC8vIHRvcCB0cmlhbmdsZQoKICAgICAgICBmYWNlc1swXVswXSA9IDA7CiAgICAgICAgZmFjZXNbMF1bMV0gPSAxOwogICAgICAgIGZhY2VzWzBdWzJdID0gMjsgLy8gYm90dG9tIHRyaWFuZ2xlCgogICAgICAgIGZhY2VzWzFdWzBdID0gNTsKICAgICAgICBmYWNlc1sxXVsxXSA9IDQ7CiAgICAgICAgZmFjZXNbMV1bMl0gPSAzOyAvLyAteCBmYWNpbmcgcXVhZAoKICAgICAgICBmYWNlc1syXVswXSA9IDA7CiAgICAgICAgZmFjZXNbMl1bMV0gPSAyOwogICAgICAgIGZhY2VzWzJdWzJdID0gNTsKICAgICAgICBmYWNlc1syXVszXSA9IDM7IC8vIC15IGZhY2luZyBxdWFkCgogICAgICAgIGZhY2VzWzNdWzBdID0gMTsKICAgICAgICBmYWNlc1szXVsxXSA9IDA7CiAgICAgICAgZmFjZXNbM11bMl0gPSAzOwogICAgICAgIGZhY2VzWzNdWzNdID0gNDsgLy8gK3h5IGZhY2luZyBxdWFkCgogICAgICAgIGZhY2VzWzRdWzBdID0gNDsKICAgICAgICBmYWNlc1s0XVsxXSA9IDU7CiAgICAgICAgZmFjZXNbNF1bMl0gPSAyOwogICAgICAgIGZhY2VzWzRdWzNdID0gMTsKICAgICAgfSBlbHNlIHsKICAgICAgICAvLyBDZW50ZXIgb2YgdGhlIHRyaWFuZ2xlIHBpbGxhciAtIGFsbCBwb2x5Z29ucyBhcmUgZ2l2ZW4gcmVsYXRpdmUgdG8gdGhpcyBvbmUKICAgICAgICBvZmZzZXRSZXN1bHQuc2V0KCh4aSArIDAuNzUpICogZWxlbWVudFNpemUsIC8vIHNvcnQgb2YgY2VudGVyIG9mIGEgdHJpYW5nbGUKICAgICAgICAoeWkgKyAwLjc1KSAqIGVsZW1lbnRTaXplLCBoIC8vIHZlcnRpY2FsIGNlbnRlcgogICAgICAgICk7IC8vIFRvcCB0cmlhbmdsZSB2ZXJ0cwoKICAgICAgICB2ZXJ0c1swXS5zZXQoMC4yNSAqIGVsZW1lbnRTaXplLCAwLjI1ICogZWxlbWVudFNpemUsIGRhdGFbeGkgKyAxXVt5aSArIDFdIC0gaCk7CiAgICAgICAgdmVydHNbMV0uc2V0KC0wLjc1ICogZWxlbWVudFNpemUsIDAuMjUgKiBlbGVtZW50U2l6ZSwgZGF0YVt4aV1beWkgKyAxXSAtIGgpOwogICAgICAgIHZlcnRzWzJdLnNldCgwLjI1ICogZWxlbWVudFNpemUsIC0wLjc1ICogZWxlbWVudFNpemUsIGRhdGFbeGkgKyAxXVt5aV0gLSBoKTsgLy8gYm90dG9tIHRyaWFuZ2xlIHZlcnRzCgogICAgICAgIHZlcnRzWzNdLnNldCgwLjI1ICogZWxlbWVudFNpemUsIDAuMjUgKiBlbGVtZW50U2l6ZSwgLU1hdGguYWJzKGgpIC0gMSk7CiAgICAgICAgdmVydHNbNF0uc2V0KC0wLjc1ICogZWxlbWVudFNpemUsIDAuMjUgKiBlbGVtZW50U2l6ZSwgLU1hdGguYWJzKGgpIC0gMSk7CiAgICAgICAgdmVydHNbNV0uc2V0KDAuMjUgKiBlbGVtZW50U2l6ZSwgLTAuNzUgKiBlbGVtZW50U2l6ZSwgLU1hdGguYWJzKGgpIC0gMSk7IC8vIFRvcCB0cmlhbmdsZQoKICAgICAgICBmYWNlc1swXVswXSA9IDA7CiAgICAgICAgZmFjZXNbMF1bMV0gPSAxOwogICAgICAgIGZhY2VzWzBdWzJdID0gMjsgLy8gYm90dG9tIHRyaWFuZ2xlCgogICAgICAgIGZhY2VzWzFdWzBdID0gNTsKICAgICAgICBmYWNlc1sxXVsxXSA9IDQ7CiAgICAgICAgZmFjZXNbMV1bMl0gPSAzOyAvLyAreCBmYWNpbmcgcXVhZAoKICAgICAgICBmYWNlc1syXVswXSA9IDI7CiAgICAgICAgZmFjZXNbMl1bMV0gPSA1OwogICAgICAgIGZhY2VzWzJdWzJdID0gMzsKICAgICAgICBmYWNlc1syXVszXSA9IDA7IC8vICt5IGZhY2luZyBxdWFkCgogICAgICAgIGZhY2VzWzNdWzBdID0gMzsKICAgICAgICBmYWNlc1szXVsxXSA9IDQ7CiAgICAgICAgZmFjZXNbM11bMl0gPSAxOwogICAgICAgIGZhY2VzWzNdWzNdID0gMDsgLy8gLXh5IGZhY2luZyBxdWFkCgogICAgICAgIGZhY2VzWzRdWzBdID0gMTsKICAgICAgICBmYWNlc1s0XVsxXSA9IDQ7CiAgICAgICAgZmFjZXNbNF1bMl0gPSA1OwogICAgICAgIGZhY2VzWzRdWzNdID0gMjsKICAgICAgfQoKICAgICAgcmVzdWx0LmNvbXB1dGVOb3JtYWxzKCk7CiAgICAgIHJlc3VsdC5jb21wdXRlRWRnZXMoKTsKICAgICAgcmVzdWx0LnVwZGF0ZUJvdW5kaW5nU3BoZXJlUmFkaXVzKCk7CiAgICAgIHRoaXMuc2V0Q2FjaGVkQ29udmV4VHJpYW5nbGVQaWxsYXIoeGksIHlpLCBnZXRVcHBlclRyaWFuZ2xlLCByZXN1bHQsIG9mZnNldFJlc3VsdCk7CiAgICB9CgogICAgY2FsY3VsYXRlTG9jYWxJbmVydGlhKG1hc3MsIHRhcmdldCkgewogICAgICBpZiAodGFyZ2V0ID09PSB2b2lkIDApIHsKICAgICAgICB0YXJnZXQgPSBuZXcgVmVjMygpOwogICAgICB9CgogICAgICB0YXJnZXQuc2V0KDAsIDAsIDApOwogICAgICByZXR1cm4gdGFyZ2V0OwogICAgfQoKICAgIHZvbHVtZSgpIHsKICAgICAgcmV0dXJuICgvLyBUaGUgdGVycmFpbiBpcyBpbmZpbml0ZQogICAgICAgIE51bWJlci5NQVhfVkFMVUUKICAgICAgKTsKICAgIH0KCiAgICBjYWxjdWxhdGVXb3JsZEFBQkIocG9zLCBxdWF0LCBtaW4sIG1heCkgewogICAgICAvKiogQFRPRE8gZG8gaXQgcHJvcGVybHkgKi8KICAgICAgbWluLnNldCgtTnVtYmVyLk1BWF9WQUxVRSwgLU51bWJlci5NQVhfVkFMVUUsIC1OdW1iZXIuTUFYX1ZBTFVFKTsKICAgICAgbWF4LnNldChOdW1iZXIuTUFYX1ZBTFVFLCBOdW1iZXIuTUFYX1ZBTFVFLCBOdW1iZXIuTUFYX1ZBTFVFKTsKICAgIH0KCiAgICB1cGRhdGVCb3VuZGluZ1NwaGVyZVJhZGl1cygpIHsKICAgICAgLy8gVXNlIHRoZSBib3VuZGluZyBib3ggb2YgdGhlIG1pbi9tYXggdmFsdWVzCiAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmRhdGE7CiAgICAgIGNvbnN0IHMgPSB0aGlzLmVsZW1lbnRTaXplOwogICAgICB0aGlzLmJvdW5kaW5nU3BoZXJlUmFkaXVzID0gbmV3IFZlYzMoZGF0YS5sZW5ndGggKiBzLCBkYXRhWzBdLmxlbmd0aCAqIHMsIE1hdGgubWF4KE1hdGguYWJzKHRoaXMubWF4VmFsdWUpLCBNYXRoLmFicyh0aGlzLm1pblZhbHVlKSkpLmxlbmd0aCgpOwogICAgfQogICAgLyoqCiAgICAgKiBTZXRzIHRoZSBoZWlnaHQgdmFsdWVzIGZyb20gYW4gaW1hZ2UuIEN1cnJlbnRseSBvbmx5IHN1cHBvcnRlZCBpbiBicm93c2VyLgogICAgICovCgoKICAgIHNldEhlaWdodHNGcm9tSW1hZ2UoaW1hZ2UsIHNjYWxlKSB7CiAgICAgIGNvbnN0IHsKICAgICAgICB4LAogICAgICAgIHosCiAgICAgICAgeQogICAgICB9ID0gc2NhbGU7CiAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpOwogICAgICBjYW52YXMud2lkdGggPSBpbWFnZS53aWR0aDsKICAgICAgY2FudmFzLmhlaWdodCA9IGltYWdlLmhlaWdodDsKICAgICAgY29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpOwogICAgICBjb250ZXh0LmRyYXdJbWFnZShpbWFnZSwgMCwgMCk7CiAgICAgIGNvbnN0IGltYWdlRGF0YSA9IGNvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsIDAsIGltYWdlLndpZHRoLCBpbWFnZS5oZWlnaHQpOwogICAgICBjb25zdCBtYXRyaXggPSB0aGlzLmRhdGE7CiAgICAgIG1hdHJpeC5sZW5ndGggPSAwOwogICAgICB0aGlzLmVsZW1lbnRTaXplID0gTWF0aC5hYnMoeCkgLyBpbWFnZURhdGEud2lkdGg7CgogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGltYWdlRGF0YS5oZWlnaHQ7IGkrKykgewogICAgICAgIGNvbnN0IHJvdyA9IFtdOwoKICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGltYWdlRGF0YS53aWR0aDsgaisrKSB7CiAgICAgICAgICBjb25zdCBhID0gaW1hZ2VEYXRhLmRhdGFbKGkgKiBpbWFnZURhdGEuaGVpZ2h0ICsgaikgKiA0XTsKICAgICAgICAgIGNvbnN0IGIgPSBpbWFnZURhdGEuZGF0YVsoaSAqIGltYWdlRGF0YS5oZWlnaHQgKyBqKSAqIDQgKyAxXTsKICAgICAgICAgIGNvbnN0IGMgPSBpbWFnZURhdGEuZGF0YVsoaSAqIGltYWdlRGF0YS5oZWlnaHQgKyBqKSAqIDQgKyAyXTsKICAgICAgICAgIGNvbnN0IGhlaWdodCA9IChhICsgYiArIGMpIC8gNCAvIDI1NSAqIHo7CgogICAgICAgICAgaWYgKHggPCAwKSB7CiAgICAgICAgICAgIHJvdy5wdXNoKGhlaWdodCk7CiAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICByb3cudW5zaGlmdChoZWlnaHQpOwogICAgICAgICAgfQogICAgICAgIH0KCiAgICAgICAgaWYgKHkgPCAwKSB7CiAgICAgICAgICBtYXRyaXgudW5zaGlmdChyb3cpOwogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICBtYXRyaXgucHVzaChyb3cpOwogICAgICAgIH0KICAgICAgfQoKICAgICAgdGhpcy51cGRhdGVNYXhWYWx1ZSgpOwogICAgICB0aGlzLnVwZGF0ZU1pblZhbHVlKCk7CiAgICAgIHRoaXMudXBkYXRlKCk7CiAgICB9CgogIH0KICBjb25zdCBnZXRIZWlnaHRBdF9pZHggPSBbXTsKICBjb25zdCBnZXRIZWlnaHRBdF93ZWlnaHRzID0gbmV3IFZlYzMoKTsKICBjb25zdCBnZXRIZWlnaHRBdF9hID0gbmV3IFZlYzMoKTsKICBjb25zdCBnZXRIZWlnaHRBdF9iID0gbmV3IFZlYzMoKTsKICBjb25zdCBnZXRIZWlnaHRBdF9jID0gbmV3IFZlYzMoKTsKICBjb25zdCBnZXROb3JtYWxBdF9hID0gbmV3IFZlYzMoKTsKICBjb25zdCBnZXROb3JtYWxBdF9iID0gbmV3IFZlYzMoKTsKICBjb25zdCBnZXROb3JtYWxBdF9jID0gbmV3IFZlYzMoKTsKICBjb25zdCBnZXROb3JtYWxBdF9lMCA9IG5ldyBWZWMzKCk7CiAgY29uc3QgZ2V0Tm9ybWFsQXRfZTEgPSBuZXcgVmVjMygpOyAvLyBmcm9tIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0JhcnljZW50cmljX2Nvb3JkaW5hdGVfc3lzdGVtCgogIGZ1bmN0aW9uIGJhcnljZW50cmljV2VpZ2h0cyh4LCB5LCBheCwgYXksIGJ4LCBieSwgY3gsIGN5LCByZXN1bHQpIHsKICAgIHJlc3VsdC54ID0gKChieSAtIGN5KSAqICh4IC0gY3gpICsgKGN4IC0gYngpICogKHkgLSBjeSkpIC8gKChieSAtIGN5KSAqIChheCAtIGN4KSArIChjeCAtIGJ4KSAqIChheSAtIGN5KSk7CiAgICByZXN1bHQueSA9ICgoY3kgLSBheSkgKiAoeCAtIGN4KSArIChheCAtIGN4KSAqICh5IC0gY3kpKSAvICgoYnkgLSBjeSkgKiAoYXggLSBjeCkgKyAoY3ggLSBieCkgKiAoYXkgLSBjeSkpOwogICAgcmVzdWx0LnogPSAxIC0gcmVzdWx0LnggLSByZXN1bHQueTsKICB9CgogIC8qKgogICAqIE9jdHJlZU5vZGUKICAgKi8KICBjbGFzcyBPY3RyZWVOb2RlIHsKICAgIC8qKiBUaGUgcm9vdCBub2RlICovCgogICAgLyoqIEJvdW5kYXJ5IG9mIHRoaXMgbm9kZSAqLwoKICAgIC8qKiBDb250YWluZWQgZGF0YSBhdCB0aGUgY3VycmVudCBub2RlIGxldmVsICovCgogICAgLyoqIENoaWxkcmVuIHRvIHRoaXMgbm9kZSAqLwogICAgY29uc3RydWN0b3Iob3B0aW9ucykgewogICAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7CiAgICAgICAgb3B0aW9ucyA9IHt9OwogICAgICB9CgogICAgICB0aGlzLnJvb3QgPSBvcHRpb25zLnJvb3QgfHwgbnVsbDsKICAgICAgdGhpcy5hYWJiID0gb3B0aW9ucy5hYWJiID8gb3B0aW9ucy5hYWJiLmNsb25lKCkgOiBuZXcgQUFCQigpOwogICAgICB0aGlzLmRhdGEgPSBbXTsKICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdOwogICAgfQogICAgLyoqCiAgICAgKiByZXNldAogICAgICovCgoKICAgIHJlc2V0KCkgewogICAgICB0aGlzLmNoaWxkcmVuLmxlbmd0aCA9IHRoaXMuZGF0YS5sZW5ndGggPSAwOwogICAgfQogICAgLyoqCiAgICAgKiBJbnNlcnQgZGF0YSBpbnRvIHRoaXMgbm9kZQogICAgICogQHJldHVybiBUcnVlIGlmIHN1Y2Nlc3NmdWwsIG90aGVyd2lzZSBmYWxzZQogICAgICovCgoKICAgIGluc2VydChhYWJiLCBlbGVtZW50RGF0YSwgbGV2ZWwpIHsKICAgICAgaWYgKGxldmVsID09PSB2b2lkIDApIHsKICAgICAgICBsZXZlbCA9IDA7CiAgICAgIH0KCiAgICAgIGNvbnN0IG5vZGVEYXRhID0gdGhpcy5kYXRhOyAvLyBJZ25vcmUgb2JqZWN0cyB0aGF0IGRvIG5vdCBiZWxvbmcgaW4gdGhpcyBub2RlCgogICAgICBpZiAoIXRoaXMuYWFiYi5jb250YWlucyhhYWJiKSkgewogICAgICAgIHJldHVybiBmYWxzZTsgLy8gb2JqZWN0IGNhbm5vdCBiZSBhZGRlZAogICAgICB9CgogICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47CiAgICAgIGNvbnN0IG1heERlcHRoID0gdGhpcy5tYXhEZXB0aCB8fCB0aGlzLnJvb3QubWF4RGVwdGg7CgogICAgICBpZiAobGV2ZWwgPCBtYXhEZXB0aCkgewogICAgICAgIC8vIFN1YmRpdmlkZSBpZiB0aGVyZSBhcmUgbm8gY2hpbGRyZW4geWV0CiAgICAgICAgbGV0IHN1YmRpdmlkZWQgPSBmYWxzZTsKCiAgICAgICAgaWYgKCFjaGlsZHJlbi5sZW5ndGgpIHsKICAgICAgICAgIHRoaXMuc3ViZGl2aWRlKCk7CiAgICAgICAgICBzdWJkaXZpZGVkID0gdHJ1ZTsKICAgICAgICB9IC8vIGFkZCB0byB3aGljaGV2ZXIgbm9kZSB3aWxsIGFjY2VwdCBpdAoKCiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgIT09IDg7IGkrKykgewogICAgICAgICAgaWYgKGNoaWxkcmVuW2ldLmluc2VydChhYWJiLCBlbGVtZW50RGF0YSwgbGV2ZWwgKyAxKSkgewogICAgICAgICAgICByZXR1cm4gdHJ1ZTsKICAgICAgICAgIH0KICAgICAgICB9CgogICAgICAgIGlmIChzdWJkaXZpZGVkKSB7CiAgICAgICAgICAvLyBObyBjaGlsZHJlbiBhY2NlcHRlZCEgTWlnaHQgYXMgd2VsbCBqdXN0IHJlbW92ZSBlbSBzaW5jZSB0aGV5IGNvbnRhaW4gbm9uZQogICAgICAgICAgY2hpbGRyZW4ubGVuZ3RoID0gMDsKICAgICAgICB9CiAgICAgIH0gLy8gVG9vIGRlZXAsIG9yIGNoaWxkcmVuIGRpZG50IHdhbnQgaXQuIGFkZCBpdCBpbiBjdXJyZW50IG5vZGUKCgogICAgICBub2RlRGF0YS5wdXNoKGVsZW1lbnREYXRhKTsKICAgICAgcmV0dXJuIHRydWU7CiAgICB9CiAgICAvKioKICAgICAqIENyZWF0ZSA4IGVxdWFsbHkgc2l6ZWQgY2hpbGRyZW4gbm9kZXMgYW5kIHB1dCB0aGVtIGluIHRoZSBgY2hpbGRyZW5gIGFycmF5LgogICAgICovCgoKICAgIHN1YmRpdmlkZSgpIHsKICAgICAgY29uc3QgYWFiYiA9IHRoaXMuYWFiYjsKICAgICAgY29uc3QgbCA9IGFhYmIubG93ZXJCb3VuZDsKICAgICAgY29uc3QgdSA9IGFhYmIudXBwZXJCb3VuZDsKICAgICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuOwogICAgICBjaGlsZHJlbi5wdXNoKG5ldyBPY3RyZWVOb2RlKHsKICAgICAgICBhYWJiOiBuZXcgQUFCQih7CiAgICAgICAgICBsb3dlckJvdW5kOiBuZXcgVmVjMygwLCAwLCAwKQogICAgICAgIH0pCiAgICAgIH0pLCBuZXcgT2N0cmVlTm9kZSh7CiAgICAgICAgYWFiYjogbmV3IEFBQkIoewogICAgICAgICAgbG93ZXJCb3VuZDogbmV3IFZlYzMoMSwgMCwgMCkKICAgICAgICB9KQogICAgICB9KSwgbmV3IE9jdHJlZU5vZGUoewogICAgICAgIGFhYmI6IG5ldyBBQUJCKHsKICAgICAgICAgIGxvd2VyQm91bmQ6IG5ldyBWZWMzKDEsIDEsIDApCiAgICAgICAgfSkKICAgICAgfSksIG5ldyBPY3RyZWVOb2RlKHsKICAgICAgICBhYWJiOiBuZXcgQUFCQih7CiAgICAgICAgICBsb3dlckJvdW5kOiBuZXcgVmVjMygxLCAxLCAxKQogICAgICAgIH0pCiAgICAgIH0pLCBuZXcgT2N0cmVlTm9kZSh7CiAgICAgICAgYWFiYjogbmV3IEFBQkIoewogICAgICAgICAgbG93ZXJCb3VuZDogbmV3IFZlYzMoMCwgMSwgMSkKICAgICAgICB9KQogICAgICB9KSwgbmV3IE9jdHJlZU5vZGUoewogICAgICAgIGFhYmI6IG5ldyBBQUJCKHsKICAgICAgICAgIGxvd2VyQm91bmQ6IG5ldyBWZWMzKDAsIDAsIDEpCiAgICAgICAgfSkKICAgICAgfSksIG5ldyBPY3RyZWVOb2RlKHsKICAgICAgICBhYWJiOiBuZXcgQUFCQih7CiAgICAgICAgICBsb3dlckJvdW5kOiBuZXcgVmVjMygxLCAwLCAxKQogICAgICAgIH0pCiAgICAgIH0pLCBuZXcgT2N0cmVlTm9kZSh7CiAgICAgICAgYWFiYjogbmV3IEFBQkIoewogICAgICAgICAgbG93ZXJCb3VuZDogbmV3IFZlYzMoMCwgMSwgMCkKICAgICAgICB9KQogICAgICB9KSk7CiAgICAgIHUudnN1YihsLCBoYWxmRGlhZ29uYWwpOwogICAgICBoYWxmRGlhZ29uYWwuc2NhbGUoMC41LCBoYWxmRGlhZ29uYWwpOwogICAgICBjb25zdCByb290ID0gdGhpcy5yb290IHx8IHRoaXM7CgogICAgICBmb3IgKGxldCBpID0gMDsgaSAhPT0gODsgaSsrKSB7CiAgICAgICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXTsgLy8gU2V0IGN1cnJlbnQgbm9kZSBhcyByb290CgogICAgICAgIGNoaWxkLnJvb3QgPSByb290OyAvLyBDb21wdXRlIGJvdW5kcwoKICAgICAgICBjb25zdCBsb3dlckJvdW5kID0gY2hpbGQuYWFiYi5sb3dlckJvdW5kOwogICAgICAgIGxvd2VyQm91bmQueCAqPSBoYWxmRGlhZ29uYWwueDsKICAgICAgICBsb3dlckJvdW5kLnkgKj0gaGFsZkRpYWdvbmFsLnk7CiAgICAgICAgbG93ZXJCb3VuZC56ICo9IGhhbGZEaWFnb25hbC56OwogICAgICAgIGxvd2VyQm91bmQudmFkZChsLCBsb3dlckJvdW5kKTsgLy8gVXBwZXIgYm91bmQgaXMgYWx3YXlzIGxvd2VyIGJvdW5kICsgaGFsZkRpYWdvbmFsCgogICAgICAgIGxvd2VyQm91bmQudmFkZChoYWxmRGlhZ29uYWwsIGNoaWxkLmFhYmIudXBwZXJCb3VuZCk7CiAgICAgIH0KICAgIH0KICAgIC8qKgogICAgICogR2V0IGFsbCBkYXRhLCBwb3RlbnRpYWxseSB3aXRoaW4gYW4gQUFCQgogICAgICogQHJldHVybiBUaGUgInJlc3VsdCIgb2JqZWN0CiAgICAgKi8KCgogICAgYWFiYlF1ZXJ5KGFhYmIsIHJlc3VsdCkgewogICAgICB0aGlzLmRhdGE7IC8vIGFib3J0IGlmIHRoZSByYW5nZSBkb2VzIG5vdCBpbnRlcnNlY3QgdGhpcyBub2RlCiAgICAgIC8vIGlmICghdGhpcy5hYWJiLm92ZXJsYXBzKGFhYmIpKXsKICAgICAgLy8gICAgIHJldHVybiByZXN1bHQ7CiAgICAgIC8vIH0KICAgICAgLy8gQWRkIG9iamVjdHMgYXQgdGhpcyBsZXZlbAogICAgICAvLyBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShyZXN1bHQsIG5vZGVEYXRhKTsKICAgICAgLy8gQWRkIGNoaWxkIGRhdGEKICAgICAgLy8gQHRvZG8gdW53cmFwIHJlY3Vyc2lvbiBpbnRvIGEgcXVldWUgLyBsb29wLCB0aGF0J3MgZmFzdGVyIGluIEpTCgogICAgICB0aGlzLmNoaWxkcmVuOyAvLyBmb3IgKGxldCBpID0gMCwgTiA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpICE9PSBOOyBpKyspIHsKICAgICAgLy8gICAgIGNoaWxkcmVuW2ldLmFhYmJRdWVyeShhYWJiLCByZXN1bHQpOwogICAgICAvLyB9CgogICAgICBjb25zdCBxdWV1ZSA9IFt0aGlzXTsKCiAgICAgIHdoaWxlIChxdWV1ZS5sZW5ndGgpIHsKICAgICAgICBjb25zdCBub2RlID0gcXVldWUucG9wKCk7CgogICAgICAgIGlmIChub2RlLmFhYmIub3ZlcmxhcHMoYWFiYikpIHsKICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHJlc3VsdCwgbm9kZS5kYXRhKTsKICAgICAgICB9CgogICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHF1ZXVlLCBub2RlLmNoaWxkcmVuKTsKICAgICAgfQoKICAgICAgcmV0dXJuIHJlc3VsdDsKICAgIH0KICAgIC8qKgogICAgICogR2V0IGFsbCBkYXRhLCBwb3RlbnRpYWxseSBpbnRlcnNlY3RlZCBieSBhIHJheS4KICAgICAqIEByZXR1cm4gVGhlICJyZXN1bHQiIG9iamVjdAogICAgICovCgoKICAgIHJheVF1ZXJ5KHJheSwgdHJlZVRyYW5zZm9ybSwgcmVzdWx0KSB7CiAgICAgIC8vIFVzZSBhYWJiIHF1ZXJ5IGZvciBub3cuCgogICAgICAvKiogQHRvZG8gaW1wbGVtZW50IHJlYWwgcmF5IHF1ZXJ5IHdoaWNoIG5lZWRzIGxlc3MgbG9va3VwcyAqLwogICAgICByYXkuZ2V0QUFCQih0bXBBQUJCKTsKICAgICAgdG1wQUFCQi50b0xvY2FsRnJhbWUodHJlZVRyYW5zZm9ybSwgdG1wQUFCQik7CiAgICAgIHRoaXMuYWFiYlF1ZXJ5KHRtcEFBQkIsIHJlc3VsdCk7CiAgICAgIHJldHVybiByZXN1bHQ7CiAgICB9CiAgICAvKioKICAgICAqIHJlbW92ZUVtcHR5Tm9kZXMKICAgICAqLwoKCiAgICByZW1vdmVFbXB0eU5vZGVzKCkgewogICAgICBmb3IgKGxldCBpID0gdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgewogICAgICAgIHRoaXMuY2hpbGRyZW5baV0ucmVtb3ZlRW1wdHlOb2RlcygpOwoKICAgICAgICBpZiAoIXRoaXMuY2hpbGRyZW5baV0uY2hpbGRyZW4ubGVuZ3RoICYmICF0aGlzLmNoaWxkcmVuW2ldLmRhdGEubGVuZ3RoKSB7CiAgICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpLCAxKTsKICAgICAgICB9CiAgICAgIH0KICAgIH0KCiAgfQogIC8qKgogICAqIE9jdHJlZQogICAqLwoKCiAgY2xhc3MgT2N0cmVlIGV4dGVuZHMgT2N0cmVlTm9kZSB7CiAgICAvKioKICAgICAqIE1heGltdW0gc3ViZGl2aXNpb24gZGVwdGgKICAgICAqIEBkZWZhdWx0IDgKICAgICAqLwoKICAgIC8qKgogICAgICogQHBhcmFtIGFhYmIgVGhlIHRvdGFsIEFBQkIgb2YgdGhlIHRyZWUKICAgICAqLwogICAgY29uc3RydWN0b3IoYWFiYiwgb3B0aW9ucykgewogICAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7CiAgICAgICAgb3B0aW9ucyA9IHt9OwogICAgICB9CgogICAgICBzdXBlcih7CiAgICAgICAgcm9vdDogbnVsbCwKICAgICAgICBhYWJiCiAgICAgIH0pOwogICAgICB0aGlzLm1heERlcHRoID0gdHlwZW9mIG9wdGlvbnMubWF4RGVwdGggIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5tYXhEZXB0aCA6IDg7CiAgICB9CgogIH0KICBjb25zdCBoYWxmRGlhZ29uYWwgPSBuZXcgVmVjMygpOwogIGNvbnN0IHRtcEFBQkIgPSBuZXcgQUFCQigpOwoKICAvKioKICAgKiBUcmltZXNoLgogICAqIEBleGFtcGxlCiAgICogICAgIC8vIEhvdyB0byBtYWtlIGEgbWVzaCB3aXRoIGEgc2luZ2xlIHRyaWFuZ2xlCiAgICogICAgIGNvbnN0IHZlcnRpY2VzID0gWwogICAqICAgICAgICAgMCwgMCwgMCwgLy8gdmVydGV4IDAKICAgKiAgICAgICAgIDEsIDAsIDAsIC8vIHZlcnRleCAxCiAgICogICAgICAgICAwLCAxLCAwICAvLyB2ZXJ0ZXggMgogICAqICAgICBdCiAgICogICAgIGNvbnN0IGluZGljZXMgPSBbCiAgICogICAgICAgICAwLCAxLCAyICAvLyB0cmlhbmdsZSAwCiAgICogICAgIF0KICAgKiAgICAgY29uc3QgdHJpbWVzaFNoYXBlID0gbmV3IENBTk5PTi5UcmltZXNoKHZlcnRpY2VzLCBpbmRpY2VzKQogICAqLwogIGNsYXNzIFRyaW1lc2ggZXh0ZW5kcyBTaGFwZSB7CiAgICAvKioKICAgICAqIHZlcnRpY2VzCiAgICAgKi8KCiAgICAvKioKICAgICAqIEFycmF5IG9mIGludGVnZXJzLCBpbmRpY2F0aW5nIHdoaWNoIHZlcnRpY2VzIGVhY2ggdHJpYW5nbGUgY29uc2lzdHMgb2YuIFRoZSBsZW5ndGggb2YgdGhpcyBhcnJheSBpcyB0aHVzIDMgdGltZXMgdGhlIG51bWJlciBvZiB0cmlhbmdsZXMuCiAgICAgKi8KCiAgICAvKioKICAgICAqIFRoZSBub3JtYWxzIGRhdGEuCiAgICAgKi8KCiAgICAvKioKICAgICAqIFRoZSBsb2NhbCBBQUJCIG9mIHRoZSBtZXNoLgogICAgICovCgogICAgLyoqCiAgICAgKiBSZWZlcmVuY2VzIHRvIHZlcnRleCBwYWlycywgbWFraW5nIHVwIGFsbCB1bmlxdWUgZWRnZXMgaW4gdGhlIHRyaW1lc2guCiAgICAgKi8KCiAgICAvKioKICAgICAqIExvY2FsIHNjYWxpbmcgb2YgdGhlIG1lc2guIFVzZSAuc2V0U2NhbGUoKSB0byBzZXQgaXQuCiAgICAgKi8KCiAgICAvKioKICAgICAqIFRoZSBpbmRleGVkIHRyaWFuZ2xlcy4gVXNlIC51cGRhdGVUcmVlKCkgdG8gdXBkYXRlIGl0LgogICAgICovCiAgICBjb25zdHJ1Y3Rvcih2ZXJ0aWNlcywgaW5kaWNlcykgewogICAgICBzdXBlcih7CiAgICAgICAgdHlwZTogU2hhcGUudHlwZXMuVFJJTUVTSAogICAgICB9KTsKICAgICAgdGhpcy52ZXJ0aWNlcyA9IG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpOwogICAgICB0aGlzLmluZGljZXMgPSBuZXcgSW50MTZBcnJheShpbmRpY2VzKTsKICAgICAgdGhpcy5ub3JtYWxzID0gbmV3IEZsb2F0MzJBcnJheShpbmRpY2VzLmxlbmd0aCk7CiAgICAgIHRoaXMuYWFiYiA9IG5ldyBBQUJCKCk7CiAgICAgIHRoaXMuZWRnZXMgPSBudWxsOwogICAgICB0aGlzLnNjYWxlID0gbmV3IFZlYzMoMSwgMSwgMSk7CiAgICAgIHRoaXMudHJlZSA9IG5ldyBPY3RyZWUoKTsKICAgICAgdGhpcy51cGRhdGVFZGdlcygpOwogICAgICB0aGlzLnVwZGF0ZU5vcm1hbHMoKTsKICAgICAgdGhpcy51cGRhdGVBQUJCKCk7CiAgICAgIHRoaXMudXBkYXRlQm91bmRpbmdTcGhlcmVSYWRpdXMoKTsKICAgICAgdGhpcy51cGRhdGVUcmVlKCk7CiAgICB9CiAgICAvKioKICAgICAqIHVwZGF0ZVRyZWUKICAgICAqLwoKCiAgICB1cGRhdGVUcmVlKCkgewogICAgICBjb25zdCB0cmVlID0gdGhpcy50cmVlOwogICAgICB0cmVlLnJlc2V0KCk7CiAgICAgIHRyZWUuYWFiYi5jb3B5KHRoaXMuYWFiYik7CiAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5zY2FsZTsgLy8gVGhlIGxvY2FsIG1lc2ggQUFCQiBpcyBzY2FsZWQsIGJ1dCB0aGUgb2N0cmVlIEFBQkIgc2hvdWxkIGJlIHVuc2NhbGVkCgogICAgICB0cmVlLmFhYmIubG93ZXJCb3VuZC54ICo9IDEgLyBzY2FsZS54OwogICAgICB0cmVlLmFhYmIubG93ZXJCb3VuZC55ICo9IDEgLyBzY2FsZS55OwogICAgICB0cmVlLmFhYmIubG93ZXJCb3VuZC56ICo9IDEgLyBzY2FsZS56OwogICAgICB0cmVlLmFhYmIudXBwZXJCb3VuZC54ICo9IDEgLyBzY2FsZS54OwogICAgICB0cmVlLmFhYmIudXBwZXJCb3VuZC55ICo9IDEgLyBzY2FsZS55OwogICAgICB0cmVlLmFhYmIudXBwZXJCb3VuZC56ICo9IDEgLyBzY2FsZS56OyAvLyBJbnNlcnQgYWxsIHRyaWFuZ2xlcwoKICAgICAgY29uc3QgdHJpYW5nbGVBQUJCID0gbmV3IEFBQkIoKTsKICAgICAgY29uc3QgYSA9IG5ldyBWZWMzKCk7CiAgICAgIGNvbnN0IGIgPSBuZXcgVmVjMygpOwogICAgICBjb25zdCBjID0gbmV3IFZlYzMoKTsKICAgICAgY29uc3QgcG9pbnRzID0gW2EsIGIsIGNdOwoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmluZGljZXMubGVuZ3RoIC8gMzsgaSsrKSB7CiAgICAgICAgLy90aGlzLmdldFRyaWFuZ2xlVmVydGljZXMoaSwgYSwgYiwgYyk7CiAgICAgICAgLy8gR2V0IHVuc2NhbGVkIHRyaWFuZ2xlIHZlcnRzCiAgICAgICAgY29uc3QgaTMgPSBpICogMzsKCiAgICAgICAgdGhpcy5fZ2V0VW5zY2FsZWRWZXJ0ZXgodGhpcy5pbmRpY2VzW2kzXSwgYSk7CgogICAgICAgIHRoaXMuX2dldFVuc2NhbGVkVmVydGV4KHRoaXMuaW5kaWNlc1tpMyArIDFdLCBiKTsKCiAgICAgICAgdGhpcy5fZ2V0VW5zY2FsZWRWZXJ0ZXgodGhpcy5pbmRpY2VzW2kzICsgMl0sIGMpOwoKICAgICAgICB0cmlhbmdsZUFBQkIuc2V0RnJvbVBvaW50cyhwb2ludHMpOwogICAgICAgIHRyZWUuaW5zZXJ0KHRyaWFuZ2xlQUFCQiwgaSk7CiAgICAgIH0KCiAgICAgIHRyZWUucmVtb3ZlRW1wdHlOb2RlcygpOwogICAgfQogICAgLyoqCiAgICAgKiBHZXQgdHJpYW5nbGVzIGluIGEgbG9jYWwgQUFCQiBmcm9tIHRoZSB0cmltZXNoLgogICAgICogQHBhcmFtIHJlc3VsdCBBbiBhcnJheSBvZiBpbnRlZ2VycywgcmVmZXJlbmNpbmcgdGhlIHF1ZXJpZWQgdHJpYW5nbGVzLgogICAgICovCgoKICAgIGdldFRyaWFuZ2xlc0luQUFCQihhYWJiLCByZXN1bHQpIHsKICAgICAgdW5zY2FsZWRBQUJCLmNvcHkoYWFiYik7IC8vIFNjYWxlIGl0IHRvIGxvY2FsCgogICAgICBjb25zdCBzY2FsZSA9IHRoaXMuc2NhbGU7CiAgICAgIGNvbnN0IGlzeCA9IHNjYWxlLng7CiAgICAgIGNvbnN0IGlzeSA9IHNjYWxlLnk7CiAgICAgIGNvbnN0IGlzeiA9IHNjYWxlLno7CiAgICAgIGNvbnN0IGwgPSB1bnNjYWxlZEFBQkIubG93ZXJCb3VuZDsKICAgICAgY29uc3QgdSA9IHVuc2NhbGVkQUFCQi51cHBlckJvdW5kOwogICAgICBsLnggLz0gaXN4OwogICAgICBsLnkgLz0gaXN5OwogICAgICBsLnogLz0gaXN6OwogICAgICB1LnggLz0gaXN4OwogICAgICB1LnkgLz0gaXN5OwogICAgICB1LnogLz0gaXN6OwogICAgICByZXR1cm4gdGhpcy50cmVlLmFhYmJRdWVyeSh1bnNjYWxlZEFBQkIsIHJlc3VsdCk7CiAgICB9CiAgICAvKioKICAgICAqIHNldFNjYWxlCiAgICAgKi8KCgogICAgc2V0U2NhbGUoc2NhbGUpIHsKICAgICAgY29uc3Qgd2FzVW5pZm9ybSA9IHRoaXMuc2NhbGUueCA9PT0gdGhpcy5zY2FsZS55ICYmIHRoaXMuc2NhbGUueSA9PT0gdGhpcy5zY2FsZS56OwogICAgICBjb25zdCBpc1VuaWZvcm0gPSBzY2FsZS54ID09PSBzY2FsZS55ICYmIHNjYWxlLnkgPT09IHNjYWxlLno7CgogICAgICBpZiAoISh3YXNVbmlmb3JtICYmIGlzVW5pZm9ybSkpIHsKICAgICAgICAvLyBOb24tdW5pZm9ybSBzY2FsaW5nLiBOZWVkIHRvIHVwZGF0ZSBub3JtYWxzLgogICAgICAgIHRoaXMudXBkYXRlTm9ybWFscygpOwogICAgICB9CgogICAgICB0aGlzLnNjYWxlLmNvcHkoc2NhbGUpOwogICAgICB0aGlzLnVwZGF0ZUFBQkIoKTsKICAgICAgdGhpcy51cGRhdGVCb3VuZGluZ1NwaGVyZVJhZGl1cygpOwogICAgfQogICAgLyoqCiAgICAgKiBDb21wdXRlIHRoZSBub3JtYWxzIG9mIHRoZSBmYWNlcy4gV2lsbCBzYXZlIGluIHRoZSBgLm5vcm1hbHNgIGFycmF5LgogICAgICovCgoKICAgIHVwZGF0ZU5vcm1hbHMoKSB7CiAgICAgIGNvbnN0IG4gPSBjb21wdXRlTm9ybWFsc19uOyAvLyBHZW5lcmF0ZSBub3JtYWxzCgogICAgICBjb25zdCBub3JtYWxzID0gdGhpcy5ub3JtYWxzOwoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmluZGljZXMubGVuZ3RoIC8gMzsgaSsrKSB7CiAgICAgICAgY29uc3QgaTMgPSBpICogMzsKICAgICAgICBjb25zdCBhID0gdGhpcy5pbmRpY2VzW2kzXTsKICAgICAgICBjb25zdCBiID0gdGhpcy5pbmRpY2VzW2kzICsgMV07CiAgICAgICAgY29uc3QgYyA9IHRoaXMuaW5kaWNlc1tpMyArIDJdOwogICAgICAgIHRoaXMuZ2V0VmVydGV4KGEsIHZhKTsKICAgICAgICB0aGlzLmdldFZlcnRleChiLCB2Yik7CiAgICAgICAgdGhpcy5nZXRWZXJ0ZXgoYywgdmMpOwogICAgICAgIFRyaW1lc2guY29tcHV0ZU5vcm1hbCh2YiwgdmEsIHZjLCBuKTsKICAgICAgICBub3JtYWxzW2kzXSA9IG4ueDsKICAgICAgICBub3JtYWxzW2kzICsgMV0gPSBuLnk7CiAgICAgICAgbm9ybWFsc1tpMyArIDJdID0gbi56OwogICAgICB9CiAgICB9CiAgICAvKioKICAgICAqIFVwZGF0ZSB0aGUgYC5lZGdlc2AgcHJvcGVydHkKICAgICAqLwoKCiAgICB1cGRhdGVFZGdlcygpIHsKICAgICAgY29uc3QgZWRnZXMgPSB7fTsKCiAgICAgIGNvbnN0IGFkZCA9IChhLCBiKSA9PiB7CiAgICAgICAgY29uc3Qga2V5ID0gYSA8IGIgPyBgJHthfV8ke2J9YCA6IGAke2J9XyR7YX1gOwogICAgICAgIGVkZ2VzW2tleV0gPSB0cnVlOwogICAgICB9OwoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmluZGljZXMubGVuZ3RoIC8gMzsgaSsrKSB7CiAgICAgICAgY29uc3QgaTMgPSBpICogMzsKICAgICAgICBjb25zdCBhID0gdGhpcy5pbmRpY2VzW2kzXTsKICAgICAgICBjb25zdCBiID0gdGhpcy5pbmRpY2VzW2kzICsgMV07CiAgICAgICAgY29uc3QgYyA9IHRoaXMuaW5kaWNlc1tpMyArIDJdOwogICAgICAgIGFkZChhLCBiKTsKICAgICAgICBhZGQoYiwgYyk7CiAgICAgICAgYWRkKGMsIGEpOwogICAgICB9CgogICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZWRnZXMpOwogICAgICB0aGlzLmVkZ2VzID0gbmV3IEludDE2QXJyYXkoa2V5cy5sZW5ndGggKiAyKTsKCiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykgewogICAgICAgIGNvbnN0IGluZGljZXMgPSBrZXlzW2ldLnNwbGl0KCdfJyk7CiAgICAgICAgdGhpcy5lZGdlc1syICogaV0gPSBwYXJzZUludChpbmRpY2VzWzBdLCAxMCk7CiAgICAgICAgdGhpcy5lZGdlc1syICogaSArIDFdID0gcGFyc2VJbnQoaW5kaWNlc1sxXSwgMTApOwogICAgICB9CiAgICB9CiAgICAvKioKICAgICAqIEdldCBhbiBlZGdlIHZlcnRleAogICAgICogQHBhcmFtIGZpcnN0T3JTZWNvbmQgMCBvciAxLCBkZXBlbmRpbmcgb24gd2hpY2ggb25lIG9mIHRoZSB2ZXJ0aWNlcyB5b3UgbmVlZC4KICAgICAqIEBwYXJhbSB2ZXJ0ZXhTdG9yZSBXaGVyZSB0byBzdG9yZSB0aGUgcmVzdWx0CiAgICAgKi8KCgogICAgZ2V0RWRnZVZlcnRleChlZGdlSW5kZXgsIGZpcnN0T3JTZWNvbmQsIHZlcnRleFN0b3JlKSB7CiAgICAgIGNvbnN0IHZlcnRleEluZGV4ID0gdGhpcy5lZGdlc1tlZGdlSW5kZXggKiAyICsgKGZpcnN0T3JTZWNvbmQgPyAxIDogMCldOwogICAgICB0aGlzLmdldFZlcnRleCh2ZXJ0ZXhJbmRleCwgdmVydGV4U3RvcmUpOwogICAgfQogICAgLyoqCiAgICAgKiBHZXQgYSB2ZWN0b3IgYWxvbmcgYW4gZWRnZS4KICAgICAqLwoKCiAgICBnZXRFZGdlVmVjdG9yKGVkZ2VJbmRleCwgdmVjdG9yU3RvcmUpIHsKICAgICAgY29uc3QgdmEgPSBnZXRFZGdlVmVjdG9yX3ZhOwogICAgICBjb25zdCB2YiA9IGdldEVkZ2VWZWN0b3JfdmI7CiAgICAgIHRoaXMuZ2V0RWRnZVZlcnRleChlZGdlSW5kZXgsIDAsIHZhKTsKICAgICAgdGhpcy5nZXRFZGdlVmVydGV4KGVkZ2VJbmRleCwgMSwgdmIpOwogICAgICB2Yi52c3ViKHZhLCB2ZWN0b3JTdG9yZSk7CiAgICB9CiAgICAvKioKICAgICAqIEdldCBmYWNlIG5vcm1hbCBnaXZlbiAzIHZlcnRpY2VzCiAgICAgKi8KCgogICAgc3RhdGljIGNvbXB1dGVOb3JtYWwodmEsIHZiLCB2YywgdGFyZ2V0KSB7CiAgICAgIHZiLnZzdWIodmEsIGFiKTsKICAgICAgdmMudnN1Yih2YiwgY2IpOwogICAgICBjYi5jcm9zcyhhYiwgdGFyZ2V0KTsKCiAgICAgIGlmICghdGFyZ2V0LmlzWmVybygpKSB7CiAgICAgICAgdGFyZ2V0Lm5vcm1hbGl6ZSgpOwogICAgICB9CiAgICB9CiAgICAvKioKICAgICAqIEdldCB2ZXJ0ZXggaS4KICAgICAqIEByZXR1cm4gVGhlICJvdXQiIHZlY3RvciBvYmplY3QKICAgICAqLwoKCiAgICBnZXRWZXJ0ZXgoaSwgb3V0KSB7CiAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5zY2FsZTsKCiAgICAgIHRoaXMuX2dldFVuc2NhbGVkVmVydGV4KGksIG91dCk7CgogICAgICBvdXQueCAqPSBzY2FsZS54OwogICAgICBvdXQueSAqPSBzY2FsZS55OwogICAgICBvdXQueiAqPSBzY2FsZS56OwogICAgICByZXR1cm4gb3V0OwogICAgfQogICAgLyoqCiAgICAgKiBHZXQgcmF3IHZlcnRleCBpCiAgICAgKiBAcmV0dXJuIFRoZSAib3V0IiB2ZWN0b3Igb2JqZWN0CiAgICAgKi8KCgogICAgX2dldFVuc2NhbGVkVmVydGV4KGksIG91dCkgewogICAgICBjb25zdCBpMyA9IGkgKiAzOwogICAgICBjb25zdCB2ZXJ0aWNlcyA9IHRoaXMudmVydGljZXM7CiAgICAgIHJldHVybiBvdXQuc2V0KHZlcnRpY2VzW2kzXSwgdmVydGljZXNbaTMgKyAxXSwgdmVydGljZXNbaTMgKyAyXSk7CiAgICB9CiAgICAvKioKICAgICAqIEdldCBhIHZlcnRleCBmcm9tIHRoZSB0cmltZXNoLHRyYW5zZm9ybWVkIGJ5IHRoZSBnaXZlbiBwb3NpdGlvbiBhbmQgcXVhdGVybmlvbi4KICAgICAqIEByZXR1cm4gVGhlICJvdXQiIHZlY3RvciBvYmplY3QKICAgICAqLwoKCiAgICBnZXRXb3JsZFZlcnRleChpLCBwb3MsIHF1YXQsIG91dCkgewogICAgICB0aGlzLmdldFZlcnRleChpLCBvdXQpOwogICAgICBUcmFuc2Zvcm0ucG9pbnRUb1dvcmxkRnJhbWUocG9zLCBxdWF0LCBvdXQsIG91dCk7CiAgICAgIHJldHVybiBvdXQ7CiAgICB9CiAgICAvKioKICAgICAqIEdldCB0aGUgdGhyZWUgdmVydGljZXMgZm9yIHRyaWFuZ2xlIGkuCiAgICAgKi8KCgogICAgZ2V0VHJpYW5nbGVWZXJ0aWNlcyhpLCBhLCBiLCBjKSB7CiAgICAgIGNvbnN0IGkzID0gaSAqIDM7CiAgICAgIHRoaXMuZ2V0VmVydGV4KHRoaXMuaW5kaWNlc1tpM10sIGEpOwogICAgICB0aGlzLmdldFZlcnRleCh0aGlzLmluZGljZXNbaTMgKyAxXSwgYik7CiAgICAgIHRoaXMuZ2V0VmVydGV4KHRoaXMuaW5kaWNlc1tpMyArIDJdLCBjKTsKICAgIH0KICAgIC8qKgogICAgICogQ29tcHV0ZSB0aGUgbm9ybWFsIG9mIHRyaWFuZ2xlIGkuCiAgICAgKiBAcmV0dXJuIFRoZSAidGFyZ2V0IiB2ZWN0b3Igb2JqZWN0CiAgICAgKi8KCgogICAgZ2V0Tm9ybWFsKGksIHRhcmdldCkgewogICAgICBjb25zdCBpMyA9IGkgKiAzOwogICAgICByZXR1cm4gdGFyZ2V0LnNldCh0aGlzLm5vcm1hbHNbaTNdLCB0aGlzLm5vcm1hbHNbaTMgKyAxXSwgdGhpcy5ub3JtYWxzW2kzICsgMl0pOwogICAgfQogICAgLyoqCiAgICAgKiBAcmV0dXJuIFRoZSAidGFyZ2V0IiB2ZWN0b3Igb2JqZWN0CiAgICAgKi8KCgogICAgY2FsY3VsYXRlTG9jYWxJbmVydGlhKG1hc3MsIHRhcmdldCkgewogICAgICAvLyBBcHByb3hpbWF0ZSB3aXRoIGJveCBpbmVydGlhCiAgICAgIC8vIEV4YWN0IGluZXJ0aWEgY2FsY3VsYXRpb24gaXMgb3ZlcmtpbGwsIGJ1dCBzZWUgaHR0cDovL2dlb21ldHJpY3Rvb2xzLmNvbS9Eb2N1bWVudGF0aW9uL1BvbHloZWRyYWxNYXNzUHJvcGVydGllcy5wZGYgZm9yIHRoZSBjb3JyZWN0IHdheSB0byBkbyBpdAogICAgICB0aGlzLmNvbXB1dGVMb2NhbEFBQkIoY2xpX2FhYmIpOwogICAgICBjb25zdCB4ID0gY2xpX2FhYmIudXBwZXJCb3VuZC54IC0gY2xpX2FhYmIubG93ZXJCb3VuZC54OwogICAgICBjb25zdCB5ID0gY2xpX2FhYmIudXBwZXJCb3VuZC55IC0gY2xpX2FhYmIubG93ZXJCb3VuZC55OwogICAgICBjb25zdCB6ID0gY2xpX2FhYmIudXBwZXJCb3VuZC56IC0gY2xpX2FhYmIubG93ZXJCb3VuZC56OwogICAgICByZXR1cm4gdGFyZ2V0LnNldCgxLjAgLyAxMi4wICogbWFzcyAqICgyICogeSAqIDIgKiB5ICsgMiAqIHogKiAyICogeiksIDEuMCAvIDEyLjAgKiBtYXNzICogKDIgKiB4ICogMiAqIHggKyAyICogeiAqIDIgKiB6KSwgMS4wIC8gMTIuMCAqIG1hc3MgKiAoMiAqIHkgKiAyICogeSArIDIgKiB4ICogMiAqIHgpKTsKICAgIH0KICAgIC8qKgogICAgICogQ29tcHV0ZSB0aGUgbG9jYWwgQUFCQiBmb3IgdGhlIHRyaW1lc2gKICAgICAqLwoKCiAgICBjb21wdXRlTG9jYWxBQUJCKGFhYmIpIHsKICAgICAgY29uc3QgbCA9IGFhYmIubG93ZXJCb3VuZDsKICAgICAgY29uc3QgdSA9IGFhYmIudXBwZXJCb3VuZDsKICAgICAgY29uc3QgbiA9IHRoaXMudmVydGljZXMubGVuZ3RoOwogICAgICB0aGlzLnZlcnRpY2VzOwogICAgICBjb25zdCB2ID0gY29tcHV0ZUxvY2FsQUFCQl93b3JsZFZlcnQ7CiAgICAgIHRoaXMuZ2V0VmVydGV4KDAsIHYpOwogICAgICBsLmNvcHkodik7CiAgICAgIHUuY29weSh2KTsKCiAgICAgIGZvciAobGV0IGkgPSAwOyBpICE9PSBuOyBpKyspIHsKICAgICAgICB0aGlzLmdldFZlcnRleChpLCB2KTsKCiAgICAgICAgaWYgKHYueCA8IGwueCkgewogICAgICAgICAgbC54ID0gdi54OwogICAgICAgIH0gZWxzZSBpZiAodi54ID4gdS54KSB7CiAgICAgICAgICB1LnggPSB2Lng7CiAgICAgICAgfQoKICAgICAgICBpZiAodi55IDwgbC55KSB7CiAgICAgICAgICBsLnkgPSB2Lnk7CiAgICAgICAgfSBlbHNlIGlmICh2LnkgPiB1LnkpIHsKICAgICAgICAgIHUueSA9IHYueTsKICAgICAgICB9CgogICAgICAgIGlmICh2LnogPCBsLnopIHsKICAgICAgICAgIGwueiA9IHYuejsKICAgICAgICB9IGVsc2UgaWYgKHYueiA+IHUueikgewogICAgICAgICAgdS56ID0gdi56OwogICAgICAgIH0KICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBVcGRhdGUgdGhlIGAuYWFiYmAgcHJvcGVydHkKICAgICAqLwoKCiAgICB1cGRhdGVBQUJCKCkgewogICAgICB0aGlzLmNvbXB1dGVMb2NhbEFBQkIodGhpcy5hYWJiKTsKICAgIH0KICAgIC8qKgogICAgICogV2lsbCB1cGRhdGUgdGhlIGAuYm91bmRpbmdTcGhlcmVSYWRpdXNgIHByb3BlcnR5CiAgICAgKi8KCgogICAgdXBkYXRlQm91bmRpbmdTcGhlcmVSYWRpdXMoKSB7CiAgICAgIC8vIEFzc3VtZSBwb2ludHMgYXJlIGRpc3RyaWJ1dGVkIHdpdGggbG9jYWwgKDAsMCwwKSBhcyBjZW50ZXIKICAgICAgbGV0IG1heDIgPSAwOwogICAgICBjb25zdCB2ZXJ0aWNlcyA9IHRoaXMudmVydGljZXM7CiAgICAgIGNvbnN0IHYgPSBuZXcgVmVjMygpOwoKICAgICAgZm9yIChsZXQgaSA9IDAsIE4gPSB2ZXJ0aWNlcy5sZW5ndGggLyAzOyBpICE9PSBOOyBpKyspIHsKICAgICAgICB0aGlzLmdldFZlcnRleChpLCB2KTsKICAgICAgICBjb25zdCBub3JtMiA9IHYubGVuZ3RoU3F1YXJlZCgpOwoKICAgICAgICBpZiAobm9ybTIgPiBtYXgyKSB7CiAgICAgICAgICBtYXgyID0gbm9ybTI7CiAgICAgICAgfQogICAgICB9CgogICAgICB0aGlzLmJvdW5kaW5nU3BoZXJlUmFkaXVzID0gTWF0aC5zcXJ0KG1heDIpOwogICAgfQogICAgLyoqCiAgICAgKiBjYWxjdWxhdGVXb3JsZEFBQkIKICAgICAqLwoKCiAgICBjYWxjdWxhdGVXb3JsZEFBQkIocG9zLCBxdWF0LCBtaW4sIG1heCkgewogICAgICAvKgogICAgICAgICAgY29uc3QgbiA9IHRoaXMudmVydGljZXMubGVuZ3RoIC8gMywKICAgICAgICAgICAgICB2ZXJ0cyA9IHRoaXMudmVydGljZXM7CiAgICAgICAgICBjb25zdCBtaW54LG1pbnksbWlueixtYXh4LG1heHksbWF4ejsKICAgICAgICAgICBjb25zdCB2ID0gdGVtcFdvcmxkVmVydGV4OwogICAgICAgICAgZm9yKGxldCBpPTA7IGk8bjsgaSsrKXsKICAgICAgICAgICAgICB0aGlzLmdldFZlcnRleChpLCB2KTsKICAgICAgICAgICAgICBxdWF0LnZtdWx0KHYsIHYpOwogICAgICAgICAgICAgIHBvcy52YWRkKHYsIHYpOwogICAgICAgICAgICAgIGlmICh2LnggPCBtaW54IHx8IG1pbng9PT11bmRlZmluZWQpewogICAgICAgICAgICAgICAgICBtaW54ID0gdi54OwogICAgICAgICAgICAgIH0gZWxzZSBpZih2LnggPiBtYXh4IHx8IG1heHg9PT11bmRlZmluZWQpewogICAgICAgICAgICAgICAgICBtYXh4ID0gdi54OwogICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgaWYgKHYueSA8IG1pbnkgfHwgbWlueT09PXVuZGVmaW5lZCl7CiAgICAgICAgICAgICAgICAgIG1pbnkgPSB2Lnk7CiAgICAgICAgICAgICAgfSBlbHNlIGlmKHYueSA+IG1heHkgfHwgbWF4eT09PXVuZGVmaW5lZCl7CiAgICAgICAgICAgICAgICAgIG1heHkgPSB2Lnk7CiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICBpZiAodi56IDwgbWlueiB8fCBtaW56PT09dW5kZWZpbmVkKXsKICAgICAgICAgICAgICAgICAgbWlueiA9IHYuejsKICAgICAgICAgICAgICB9IGVsc2UgaWYodi56ID4gbWF4eiB8fCBtYXh6PT09dW5kZWZpbmVkKXsKICAgICAgICAgICAgICAgICAgbWF4eiA9IHYuejsKICAgICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgICBtaW4uc2V0KG1pbngsbWlueSxtaW56KTsKICAgICAgICAgIG1heC5zZXQobWF4eCxtYXh5LG1heHopOwogICAgICAgICAgKi8KICAgICAgLy8gRmFzdGVyIGFwcHJveGltYXRpb24gdXNpbmcgbG9jYWwgQUFCQgogICAgICBjb25zdCBmcmFtZSA9IGNhbGN1bGF0ZVdvcmxkQUFCQl9mcmFtZTsKICAgICAgY29uc3QgcmVzdWx0ID0gY2FsY3VsYXRlV29ybGRBQUJCX2FhYmI7CiAgICAgIGZyYW1lLnBvc2l0aW9uID0gcG9zOwogICAgICBmcmFtZS5xdWF0ZXJuaW9uID0gcXVhdDsKICAgICAgdGhpcy5hYWJiLnRvV29ybGRGcmFtZShmcmFtZSwgcmVzdWx0KTsKICAgICAgbWluLmNvcHkocmVzdWx0Lmxvd2VyQm91bmQpOwogICAgICBtYXguY29weShyZXN1bHQudXBwZXJCb3VuZCk7CiAgICB9CiAgICAvKioKICAgICAqIEdldCBhcHByb3hpbWF0ZSB2b2x1bWUKICAgICAqLwoKCiAgICB2b2x1bWUoKSB7CiAgICAgIHJldHVybiA0LjAgKiBNYXRoLlBJICogdGhpcy5ib3VuZGluZ1NwaGVyZVJhZGl1cyAvIDMuMDsKICAgIH0KICAgIC8qKgogICAgICogQ3JlYXRlIGEgVHJpbWVzaCBpbnN0YW5jZSwgc2hhcGVkIGFzIGEgdG9ydXMuCiAgICAgKi8KCgogICAgc3RhdGljIGNyZWF0ZVRvcnVzKHJhZGl1cywgdHViZSwgcmFkaWFsU2VnbWVudHMsIHR1YnVsYXJTZWdtZW50cywgYXJjKSB7CiAgICAgIGlmIChyYWRpdXMgPT09IHZvaWQgMCkgewogICAgICAgIHJhZGl1cyA9IDE7CiAgICAgIH0KCiAgICAgIGlmICh0dWJlID09PSB2b2lkIDApIHsKICAgICAgICB0dWJlID0gMC41OwogICAgICB9CgogICAgICBpZiAocmFkaWFsU2VnbWVudHMgPT09IHZvaWQgMCkgewogICAgICAgIHJhZGlhbFNlZ21lbnRzID0gODsKICAgICAgfQoKICAgICAgaWYgKHR1YnVsYXJTZWdtZW50cyA9PT0gdm9pZCAwKSB7CiAgICAgICAgdHVidWxhclNlZ21lbnRzID0gNjsKICAgICAgfQoKICAgICAgaWYgKGFyYyA9PT0gdm9pZCAwKSB7CiAgICAgICAgYXJjID0gTWF0aC5QSSAqIDI7CiAgICAgIH0KCiAgICAgIGNvbnN0IHZlcnRpY2VzID0gW107CiAgICAgIGNvbnN0IGluZGljZXMgPSBbXTsKCiAgICAgIGZvciAobGV0IGogPSAwOyBqIDw9IHJhZGlhbFNlZ21lbnRzOyBqKyspIHsKICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSB0dWJ1bGFyU2VnbWVudHM7IGkrKykgewogICAgICAgICAgY29uc3QgdSA9IGkgLyB0dWJ1bGFyU2VnbWVudHMgKiBhcmM7CiAgICAgICAgICBjb25zdCB2ID0gaiAvIHJhZGlhbFNlZ21lbnRzICogTWF0aC5QSSAqIDI7CiAgICAgICAgICBjb25zdCB4ID0gKHJhZGl1cyArIHR1YmUgKiBNYXRoLmNvcyh2KSkgKiBNYXRoLmNvcyh1KTsKICAgICAgICAgIGNvbnN0IHkgPSAocmFkaXVzICsgdHViZSAqIE1hdGguY29zKHYpKSAqIE1hdGguc2luKHUpOwogICAgICAgICAgY29uc3QgeiA9IHR1YmUgKiBNYXRoLnNpbih2KTsKICAgICAgICAgIHZlcnRpY2VzLnB1c2goeCwgeSwgeik7CiAgICAgICAgfQogICAgICB9CgogICAgICBmb3IgKGxldCBqID0gMTsgaiA8PSByYWRpYWxTZWdtZW50czsgaisrKSB7CiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gdHVidWxhclNlZ21lbnRzOyBpKyspIHsKICAgICAgICAgIGNvbnN0IGEgPSAodHVidWxhclNlZ21lbnRzICsgMSkgKiBqICsgaSAtIDE7CiAgICAgICAgICBjb25zdCBiID0gKHR1YnVsYXJTZWdtZW50cyArIDEpICogKGogLSAxKSArIGkgLSAxOwogICAgICAgICAgY29uc3QgYyA9ICh0dWJ1bGFyU2VnbWVudHMgKyAxKSAqIChqIC0gMSkgKyBpOwogICAgICAgICAgY29uc3QgZCA9ICh0dWJ1bGFyU2VnbWVudHMgKyAxKSAqIGogKyBpOwogICAgICAgICAgaW5kaWNlcy5wdXNoKGEsIGIsIGQpOwogICAgICAgICAgaW5kaWNlcy5wdXNoKGIsIGMsIGQpOwogICAgICAgIH0KICAgICAgfQoKICAgICAgcmV0dXJuIG5ldyBUcmltZXNoKHZlcnRpY2VzLCBpbmRpY2VzKTsKICAgIH0KCiAgfQogIGNvbnN0IGNvbXB1dGVOb3JtYWxzX24gPSBuZXcgVmVjMygpOwogIGNvbnN0IHVuc2NhbGVkQUFCQiA9IG5ldyBBQUJCKCk7CiAgY29uc3QgZ2V0RWRnZVZlY3Rvcl92YSA9IG5ldyBWZWMzKCk7CiAgY29uc3QgZ2V0RWRnZVZlY3Rvcl92YiA9IG5ldyBWZWMzKCk7CiAgY29uc3QgY2IgPSBuZXcgVmVjMygpOwogIGNvbnN0IGFiID0gbmV3IFZlYzMoKTsKICBjb25zdCB2YSA9IG5ldyBWZWMzKCk7CiAgY29uc3QgdmIgPSBuZXcgVmVjMygpOwogIGNvbnN0IHZjID0gbmV3IFZlYzMoKTsKICBjb25zdCBjbGlfYWFiYiA9IG5ldyBBQUJCKCk7CiAgY29uc3QgY29tcHV0ZUxvY2FsQUFCQl93b3JsZFZlcnQgPSBuZXcgVmVjMygpOwogIGNvbnN0IGNhbGN1bGF0ZVdvcmxkQUFCQl9mcmFtZSA9IG5ldyBUcmFuc2Zvcm0oKTsKICBjb25zdCBjYWxjdWxhdGVXb3JsZEFBQkJfYWFiYiA9IG5ldyBBQUJCKCk7CgogIC8qKgogICAqIENvbnN0cmFpbnQgZXF1YXRpb24gc29sdmVyIGJhc2UgY2xhc3MuCiAgICovCiAgY2xhc3MgU29sdmVyIHsKICAgIC8qKgogICAgICogQWxsIGVxdWF0aW9ucyB0byBiZSBzb2x2ZWQKICAgICAqLwoKICAgIC8qKgogICAgICogQHRvZG8gcmVtb3ZlIHVzZWxlc3MgY29uc3RydWN0b3IKICAgICAqLwogICAgY29uc3RydWN0b3IoKSB7CiAgICAgIHRoaXMuZXF1YXRpb25zID0gW107CiAgICB9CiAgICAvKioKICAgICAqIFNob3VsZCBiZSBpbXBsZW1lbnRlZCBpbiBzdWJjbGFzc2VzIQogICAgICogQHRvZG8gdXNlIGFic3RyYWN0CiAgICAgKiBAcmV0dXJuIG51bWJlciBvZiBpdGVyYXRpb25zIHBlcmZvcm1lZAogICAgICovCgoKICAgIHNvbHZlKGR0LCB3b3JsZCkgewogICAgICByZXR1cm4gKC8vIFNob3VsZCByZXR1cm4gdGhlIG51bWJlciBvZiBpdGVyYXRpb25zIGRvbmUhCiAgICAgICAgMAogICAgICApOwogICAgfQogICAgLyoqCiAgICAgKiBBZGQgYW4gZXF1YXRpb24KICAgICAqLwoKCiAgICBhZGRFcXVhdGlvbihlcSkgewogICAgICBpZiAoZXEuZW5hYmxlZCAmJiAhZXEuYmkuaXNUcmlnZ2VyICYmICFlcS5iai5pc1RyaWdnZXIpIHsKICAgICAgICB0aGlzLmVxdWF0aW9ucy5wdXNoKGVxKTsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBSZW1vdmUgYW4gZXF1YXRpb24KICAgICAqLwoKCiAgICByZW1vdmVFcXVhdGlvbihlcSkgewogICAgICBjb25zdCBlcXMgPSB0aGlzLmVxdWF0aW9uczsKICAgICAgY29uc3QgaSA9IGVxcy5pbmRleE9mKGVxKTsKCiAgICAgIGlmIChpICE9PSAtMSkgewogICAgICAgIGVxcy5zcGxpY2UoaSwgMSk7CiAgICAgIH0KICAgIH0KICAgIC8qKgogICAgICogQWRkIGFsbCBlcXVhdGlvbnMKICAgICAqLwoKCiAgICByZW1vdmVBbGxFcXVhdGlvbnMoKSB7CiAgICAgIHRoaXMuZXF1YXRpb25zLmxlbmd0aCA9IDA7CiAgICB9CgogIH0KCiAgLyoqCiAgICogQ29uc3RyYWludCBlcXVhdGlvbiBHYXVzcy1TZWlkZWwgc29sdmVyLgogICAqIEB0b2RvIFRoZSBzcG9vayBwYXJhbWV0ZXJzIHNob3VsZCBiZSBzcGVjaWZpZWQgZm9yIGVhY2ggY29uc3RyYWludCwgbm90IGdsb2JhbGx5LgogICAqIEBzZWUgaHR0cHM6Ly93d3c4LmNzLnVtdS5zZS9rdXJzZXIvNURWMDU4L1ZUMDkvbGVjdHVyZXMvc3Bvb2tub3Rlcy5wZGYKICAgKi8KICBjbGFzcyBHU1NvbHZlciBleHRlbmRzIFNvbHZlciB7CiAgICAvKioKICAgICAqIFRoZSBudW1iZXIgb2Ygc29sdmVyIGl0ZXJhdGlvbnMgZGV0ZXJtaW5lcyBxdWFsaXR5IG9mIHRoZSBjb25zdHJhaW50cyBpbiB0aGUgd29ybGQuCiAgICAgKiBUaGUgbW9yZSBpdGVyYXRpb25zLCB0aGUgbW9yZSBjb3JyZWN0IHNpbXVsYXRpb24uIE1vcmUgaXRlcmF0aW9ucyBuZWVkIG1vcmUgY29tcHV0YXRpb25zIHRob3VnaC4gSWYgeW91IGhhdmUgYSBsYXJnZSBncmF2aXR5IGZvcmNlIGluIHlvdXIgd29ybGQsIHlvdSB3aWxsIG5lZWQgbW9yZSBpdGVyYXRpb25zLgogICAgICovCgogICAgLyoqCiAgICAgKiBXaGVuIHRvbGVyYW5jZSBpcyByZWFjaGVkLCB0aGUgc3lzdGVtIGlzIGFzc3VtZWQgdG8gYmUgY29udmVyZ2VkLgogICAgICovCgogICAgLyoqCiAgICAgKiBAdG9kbyByZW1vdmUgdXNlbGVzcyBjb25zdHJ1Y3RvcgogICAgICovCiAgICBjb25zdHJ1Y3RvcigpIHsKICAgICAgc3VwZXIoKTsKICAgICAgdGhpcy5pdGVyYXRpb25zID0gMTA7CiAgICAgIHRoaXMudG9sZXJhbmNlID0gMWUtNzsKICAgIH0KICAgIC8qKgogICAgICogU29sdmUKICAgICAqIEByZXR1cm4gbnVtYmVyIG9mIGl0ZXJhdGlvbnMgcGVyZm9ybWVkCiAgICAgKi8KCgogICAgc29sdmUoZHQsIHdvcmxkKSB7CiAgICAgIGxldCBpdGVyID0gMDsKICAgICAgY29uc3QgbWF4SXRlciA9IHRoaXMuaXRlcmF0aW9uczsKICAgICAgY29uc3QgdG9sU3F1YXJlZCA9IHRoaXMudG9sZXJhbmNlICogdGhpcy50b2xlcmFuY2U7CiAgICAgIGNvbnN0IGVxdWF0aW9ucyA9IHRoaXMuZXF1YXRpb25zOwogICAgICBjb25zdCBOZXEgPSBlcXVhdGlvbnMubGVuZ3RoOwogICAgICBjb25zdCBib2RpZXMgPSB3b3JsZC5ib2RpZXM7CiAgICAgIGNvbnN0IE5ib2RpZXMgPSBib2RpZXMubGVuZ3RoOwogICAgICBjb25zdCBoID0gZHQ7CiAgICAgIGxldCBCOwogICAgICBsZXQgaW52QzsKICAgICAgbGV0IGRlbHRhbGFtYmRhOwogICAgICBsZXQgZGVsdGFsYW1iZGFUb3Q7CiAgICAgIGxldCBHV2xhbWJkYTsKICAgICAgbGV0IGxhbWJkYWo7IC8vIFVwZGF0ZSBzb2x2ZSBtYXNzCgogICAgICBpZiAoTmVxICE9PSAwKSB7CiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgIT09IE5ib2RpZXM7IGkrKykgewogICAgICAgICAgYm9kaWVzW2ldLnVwZGF0ZVNvbHZlTWFzc1Byb3BlcnRpZXMoKTsKICAgICAgICB9CiAgICAgIH0gLy8gVGhpbmdzIHRoYXQgZG8gbm90IGNoYW5nZSBkdXJpbmcgaXRlcmF0aW9uIGNhbiBiZSBjb21wdXRlZCBvbmNlCgoKICAgICAgY29uc3QgaW52Q3MgPSBHU1NvbHZlcl9zb2x2ZV9pbnZDczsKICAgICAgY29uc3QgQnMgPSBHU1NvbHZlcl9zb2x2ZV9CczsKICAgICAgY29uc3QgbGFtYmRhID0gR1NTb2x2ZXJfc29sdmVfbGFtYmRhOwogICAgICBpbnZDcy5sZW5ndGggPSBOZXE7CiAgICAgIEJzLmxlbmd0aCA9IE5lcTsKICAgICAgbGFtYmRhLmxlbmd0aCA9IE5lcTsKCiAgICAgIGZvciAobGV0IGkgPSAwOyBpICE9PSBOZXE7IGkrKykgewogICAgICAgIGNvbnN0IGMgPSBlcXVhdGlvbnNbaV07CiAgICAgICAgbGFtYmRhW2ldID0gMC4wOwogICAgICAgIEJzW2ldID0gYy5jb21wdXRlQihoKTsKICAgICAgICBpbnZDc1tpXSA9IDEuMCAvIGMuY29tcHV0ZUMoKTsKICAgICAgfQoKICAgICAgaWYgKE5lcSAhPT0gMCkgewogICAgICAgIC8vIFJlc2V0IHZsYW1iZGEKICAgICAgICBmb3IgKGxldCBpID0gMDsgaSAhPT0gTmJvZGllczsgaSsrKSB7CiAgICAgICAgICBjb25zdCBiID0gYm9kaWVzW2ldOwogICAgICAgICAgY29uc3QgdmxhbWJkYSA9IGIudmxhbWJkYTsKICAgICAgICAgIGNvbnN0IHdsYW1iZGEgPSBiLndsYW1iZGE7CiAgICAgICAgICB2bGFtYmRhLnNldCgwLCAwLCAwKTsKICAgICAgICAgIHdsYW1iZGEuc2V0KDAsIDAsIDApOwogICAgICAgIH0gLy8gSXRlcmF0ZSBvdmVyIGVxdWF0aW9ucwoKCiAgICAgICAgZm9yIChpdGVyID0gMDsgaXRlciAhPT0gbWF4SXRlcjsgaXRlcisrKSB7CiAgICAgICAgICAvLyBBY2N1bXVsYXRlIHRoZSB0b3RhbCBlcnJvciBmb3IgZWFjaCBpdGVyYXRpb24uCiAgICAgICAgICBkZWx0YWxhbWJkYVRvdCA9IDAuMDsKCiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiAhPT0gTmVxOyBqKyspIHsKICAgICAgICAgICAgY29uc3QgYyA9IGVxdWF0aW9uc1tqXTsgLy8gQ29tcHV0ZSBpdGVyYXRpb24KCiAgICAgICAgICAgIEIgPSBCc1tqXTsKICAgICAgICAgICAgaW52QyA9IGludkNzW2pdOwogICAgICAgICAgICBsYW1iZGFqID0gbGFtYmRhW2pdOwogICAgICAgICAgICBHV2xhbWJkYSA9IGMuY29tcHV0ZUdXbGFtYmRhKCk7CiAgICAgICAgICAgIGRlbHRhbGFtYmRhID0gaW52QyAqIChCIC0gR1dsYW1iZGEgLSBjLmVwcyAqIGxhbWJkYWopOyAvLyBDbGFtcCBpZiB3ZSBhcmUgbm90IHdpdGhpbiB0aGUgbWluL21heCBpbnRlcnZhbAoKICAgICAgICAgICAgaWYgKGxhbWJkYWogKyBkZWx0YWxhbWJkYSA8IGMubWluRm9yY2UpIHsKICAgICAgICAgICAgICBkZWx0YWxhbWJkYSA9IGMubWluRm9yY2UgLSBsYW1iZGFqOwogICAgICAgICAgICB9IGVsc2UgaWYgKGxhbWJkYWogKyBkZWx0YWxhbWJkYSA+IGMubWF4Rm9yY2UpIHsKICAgICAgICAgICAgICBkZWx0YWxhbWJkYSA9IGMubWF4Rm9yY2UgLSBsYW1iZGFqOwogICAgICAgICAgICB9CgogICAgICAgICAgICBsYW1iZGFbal0gKz0gZGVsdGFsYW1iZGE7CiAgICAgICAgICAgIGRlbHRhbGFtYmRhVG90ICs9IGRlbHRhbGFtYmRhID4gMC4wID8gZGVsdGFsYW1iZGEgOiAtZGVsdGFsYW1iZGE7IC8vIGFicyhkZWx0YWxhbWJkYSkKCiAgICAgICAgICAgIGMuYWRkVG9XbGFtYmRhKGRlbHRhbGFtYmRhKTsKICAgICAgICAgIH0gLy8gSWYgdGhlIHRvdGFsIGVycm9yIGlzIHNtYWxsIGVub3VnaCAtIHN0b3AgaXRlcmF0ZQoKCiAgICAgICAgICBpZiAoZGVsdGFsYW1iZGFUb3QgKiBkZWx0YWxhbWJkYVRvdCA8IHRvbFNxdWFyZWQpIHsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CiAgICAgICAgfSAvLyBBZGQgcmVzdWx0IHRvIHZlbG9jaXR5CgoKICAgICAgICBmb3IgKGxldCBpID0gMDsgaSAhPT0gTmJvZGllczsgaSsrKSB7CiAgICAgICAgICBjb25zdCBiID0gYm9kaWVzW2ldOwogICAgICAgICAgY29uc3QgdiA9IGIudmVsb2NpdHk7CiAgICAgICAgICBjb25zdCB3ID0gYi5hbmd1bGFyVmVsb2NpdHk7CiAgICAgICAgICBiLnZsYW1iZGEudm11bChiLmxpbmVhckZhY3RvciwgYi52bGFtYmRhKTsKICAgICAgICAgIHYudmFkZChiLnZsYW1iZGEsIHYpOwogICAgICAgICAgYi53bGFtYmRhLnZtdWwoYi5hbmd1bGFyRmFjdG9yLCBiLndsYW1iZGEpOwogICAgICAgICAgdy52YWRkKGIud2xhbWJkYSwgdyk7CiAgICAgICAgfSAvLyBTZXQgdGhlIGAubXVsdGlwbGllcmAgcHJvcGVydHkgb2YgZWFjaCBlcXVhdGlvbgoKCiAgICAgICAgbGV0IGwgPSBlcXVhdGlvbnMubGVuZ3RoOwogICAgICAgIGNvbnN0IGludkR0ID0gMSAvIGg7CgogICAgICAgIHdoaWxlIChsLS0pIHsKICAgICAgICAgIGVxdWF0aW9uc1tsXS5tdWx0aXBsaWVyID0gbGFtYmRhW2xdICogaW52RHQ7CiAgICAgICAgfQogICAgICB9CgogICAgICByZXR1cm4gaXRlcjsKICAgIH0KCiAgfSAvLyBKdXN0IHRlbXBvcmFyeSBudW1iZXIgaG9sZGVycyB0aGF0IHdlIHdhbnQgdG8gcmV1c2UgZWFjaCBpdGVyYXRpb24uCgogIGNvbnN0IEdTU29sdmVyX3NvbHZlX2xhbWJkYSA9IFtdOwogIGNvbnN0IEdTU29sdmVyX3NvbHZlX2ludkNzID0gW107CiAgY29uc3QgR1NTb2x2ZXJfc29sdmVfQnMgPSBbXTsKCiAgLyoqCiAgICogU3BsaXRzIHRoZSBlcXVhdGlvbnMgaW50byBpc2xhbmRzIGFuZCBzb2x2ZXMgdGhlbSBpbmRlcGVuZGVudGx5LiBDYW4gaW1wcm92ZSBwZXJmb3JtYW5jZS4KICAgKi8KICBjbGFzcyBTcGxpdFNvbHZlciBleHRlbmRzIFNvbHZlciB7CiAgICAvKioKICAgICAqIFRoZSBudW1iZXIgb2Ygc29sdmVyIGl0ZXJhdGlvbnMgZGV0ZXJtaW5lcyBxdWFsaXR5IG9mIHRoZSBjb25zdHJhaW50cyBpbiB0aGUgd29ybGQuIFRoZSBtb3JlIGl0ZXJhdGlvbnMsIHRoZSBtb3JlIGNvcnJlY3Qgc2ltdWxhdGlvbi4gTW9yZSBpdGVyYXRpb25zIG5lZWQgbW9yZSBjb21wdXRhdGlvbnMgdGhvdWdoLiBJZiB5b3UgaGF2ZSBhIGxhcmdlIGdyYXZpdHkgZm9yY2UgaW4geW91ciB3b3JsZCwgeW91IHdpbGwgbmVlZCBtb3JlIGl0ZXJhdGlvbnMuCiAgICAgKi8KCiAgICAvKioKICAgICAqIFdoZW4gdG9sZXJhbmNlIGlzIHJlYWNoZWQsIHRoZSBzeXN0ZW0gaXMgYXNzdW1lZCB0byBiZSBjb252ZXJnZWQuCiAgICAgKi8KCiAgICAvKiogc3Vic29sdmVyICovCiAgICBjb25zdHJ1Y3RvcihzdWJzb2x2ZXIpIHsKICAgICAgc3VwZXIoKTsKICAgICAgdGhpcy5pdGVyYXRpb25zID0gMTA7CiAgICAgIHRoaXMudG9sZXJhbmNlID0gMWUtNzsKICAgICAgdGhpcy5zdWJzb2x2ZXIgPSBzdWJzb2x2ZXI7CiAgICAgIHRoaXMubm9kZXMgPSBbXTsKICAgICAgdGhpcy5ub2RlUG9vbCA9IFtdOyAvLyBDcmVhdGUgbmVlZGVkIG5vZGVzLCByZXVzZSBpZiBwb3NzaWJsZQoKICAgICAgd2hpbGUgKHRoaXMubm9kZVBvb2wubGVuZ3RoIDwgMTI4KSB7CiAgICAgICAgdGhpcy5ub2RlUG9vbC5wdXNoKHRoaXMuY3JlYXRlTm9kZSgpKTsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBjcmVhdGVOb2RlCiAgICAgKi8KCgogICAgY3JlYXRlTm9kZSgpIHsKICAgICAgcmV0dXJuIHsKICAgICAgICBib2R5OiBudWxsLAogICAgICAgIGNoaWxkcmVuOiBbXSwKICAgICAgICBlcXM6IFtdLAogICAgICAgIHZpc2l0ZWQ6IGZhbHNlCiAgICAgIH07CiAgICB9CiAgICAvKioKICAgICAqIFNvbHZlIHRoZSBzdWJzeXN0ZW1zCiAgICAgKiBAcmV0dXJuIG51bWJlciBvZiBpdGVyYXRpb25zIHBlcmZvcm1lZAogICAgICovCgoKICAgIHNvbHZlKGR0LCB3b3JsZCkgewogICAgICBjb25zdCBub2RlcyA9IFNwbGl0U29sdmVyX3NvbHZlX25vZGVzOwogICAgICBjb25zdCBub2RlUG9vbCA9IHRoaXMubm9kZVBvb2w7CiAgICAgIGNvbnN0IGJvZGllcyA9IHdvcmxkLmJvZGllczsKICAgICAgY29uc3QgZXF1YXRpb25zID0gdGhpcy5lcXVhdGlvbnM7CiAgICAgIGNvbnN0IE5lcSA9IGVxdWF0aW9ucy5sZW5ndGg7CiAgICAgIGNvbnN0IE5ib2RpZXMgPSBib2RpZXMubGVuZ3RoOwogICAgICBjb25zdCBzdWJzb2x2ZXIgPSB0aGlzLnN1YnNvbHZlcjsgLy8gQ3JlYXRlIG5lZWRlZCBub2RlcywgcmV1c2UgaWYgcG9zc2libGUKCiAgICAgIHdoaWxlIChub2RlUG9vbC5sZW5ndGggPCBOYm9kaWVzKSB7CiAgICAgICAgbm9kZVBvb2wucHVzaCh0aGlzLmNyZWF0ZU5vZGUoKSk7CiAgICAgIH0KCiAgICAgIG5vZGVzLmxlbmd0aCA9IE5ib2RpZXM7CgogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE5ib2RpZXM7IGkrKykgewogICAgICAgIG5vZGVzW2ldID0gbm9kZVBvb2xbaV07CiAgICAgIH0gLy8gUmVzZXQgbm9kZSB2YWx1ZXMKCgogICAgICBmb3IgKGxldCBpID0gMDsgaSAhPT0gTmJvZGllczsgaSsrKSB7CiAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2ldOwogICAgICAgIG5vZGUuYm9keSA9IGJvZGllc1tpXTsKICAgICAgICBub2RlLmNoaWxkcmVuLmxlbmd0aCA9IDA7CiAgICAgICAgbm9kZS5lcXMubGVuZ3RoID0gMDsKICAgICAgICBub2RlLnZpc2l0ZWQgPSBmYWxzZTsKICAgICAgfQoKICAgICAgZm9yIChsZXQgayA9IDA7IGsgIT09IE5lcTsgaysrKSB7CiAgICAgICAgY29uc3QgZXEgPSBlcXVhdGlvbnNba107CiAgICAgICAgY29uc3QgaSA9IGJvZGllcy5pbmRleE9mKGVxLmJpKTsKICAgICAgICBjb25zdCBqID0gYm9kaWVzLmluZGV4T2YoZXEuYmopOwogICAgICAgIGNvbnN0IG5pID0gbm9kZXNbaV07CiAgICAgICAgY29uc3QgbmogPSBub2Rlc1tqXTsKICAgICAgICBuaS5jaGlsZHJlbi5wdXNoKG5qKTsKICAgICAgICBuaS5lcXMucHVzaChlcSk7CiAgICAgICAgbmouY2hpbGRyZW4ucHVzaChuaSk7CiAgICAgICAgbmouZXFzLnB1c2goZXEpOwogICAgICB9CgogICAgICBsZXQgY2hpbGQ7CiAgICAgIGxldCBuID0gMDsKICAgICAgbGV0IGVxcyA9IFNwbGl0U29sdmVyX3NvbHZlX2VxczsKICAgICAgc3Vic29sdmVyLnRvbGVyYW5jZSA9IHRoaXMudG9sZXJhbmNlOwogICAgICBzdWJzb2x2ZXIuaXRlcmF0aW9ucyA9IHRoaXMuaXRlcmF0aW9uczsKICAgICAgY29uc3QgZHVtbXlXb3JsZCA9IFNwbGl0U29sdmVyX3NvbHZlX2R1bW15V29ybGQ7CgogICAgICB3aGlsZSAoY2hpbGQgPSBnZXRVbnZpc2l0ZWROb2RlKG5vZGVzKSkgewogICAgICAgIGVxcy5sZW5ndGggPSAwOwogICAgICAgIGR1bW15V29ybGQuYm9kaWVzLmxlbmd0aCA9IDA7CiAgICAgICAgYmZzKGNoaWxkLCB2aXNpdEZ1bmMsIGR1bW15V29ybGQuYm9kaWVzLCBlcXMpOwogICAgICAgIGNvbnN0IE5lcXMgPSBlcXMubGVuZ3RoOwogICAgICAgIGVxcyA9IGVxcy5zb3J0KHNvcnRCeUlkKTsKCiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgIT09IE5lcXM7IGkrKykgewogICAgICAgICAgc3Vic29sdmVyLmFkZEVxdWF0aW9uKGVxc1tpXSk7CiAgICAgICAgfQoKICAgICAgICBzdWJzb2x2ZXIuc29sdmUoZHQsIGR1bW15V29ybGQpOwogICAgICAgIHN1YnNvbHZlci5yZW1vdmVBbGxFcXVhdGlvbnMoKTsKICAgICAgICBuKys7CiAgICAgIH0KCiAgICAgIHJldHVybiBuOwogICAgfQoKICB9IC8vIFJldHVybnMgdGhlIG51bWJlciBvZiBzdWJzeXN0ZW1zCgogIGNvbnN0IFNwbGl0U29sdmVyX3NvbHZlX25vZGVzID0gW107IC8vIEFsbCBhbGxvY2F0ZWQgbm9kZSBvYmplY3RzCgogIGNvbnN0IFNwbGl0U29sdmVyX3NvbHZlX2VxcyA9IFtdOyAvLyBUZW1wIGFycmF5CgogIGNvbnN0IFNwbGl0U29sdmVyX3NvbHZlX2R1bW15V29ybGQgPSB7CiAgICBib2RpZXM6IFtdCiAgfTsgLy8gVGVtcCBvYmplY3QKCiAgY29uc3QgU1RBVElDID0gQm9keS5TVEFUSUM7CgogIGZ1bmN0aW9uIGdldFVudmlzaXRlZE5vZGUobm9kZXMpIHsKICAgIGNvbnN0IE5ub2RlcyA9IG5vZGVzLmxlbmd0aDsKCiAgICBmb3IgKGxldCBpID0gMDsgaSAhPT0gTm5vZGVzOyBpKyspIHsKICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2ldOwoKICAgICAgaWYgKCFub2RlLnZpc2l0ZWQgJiYgIShub2RlLmJvZHkudHlwZSAmIFNUQVRJQykpIHsKICAgICAgICByZXR1cm4gbm9kZTsKICAgICAgfQogICAgfQoKICAgIHJldHVybiBmYWxzZTsKICB9CgogIGNvbnN0IHF1ZXVlID0gW107CgogIGZ1bmN0aW9uIGJmcyhyb290LCB2aXNpdEZ1bmMsIGJkcywgZXFzKSB7CiAgICBxdWV1ZS5wdXNoKHJvb3QpOwogICAgcm9vdC52aXNpdGVkID0gdHJ1ZTsKICAgIHZpc2l0RnVuYyhyb290LCBiZHMsIGVxcyk7CgogICAgd2hpbGUgKHF1ZXVlLmxlbmd0aCkgewogICAgICBjb25zdCBub2RlID0gcXVldWUucG9wKCk7IC8vIExvb3Agb3ZlciB1bnZpc2l0ZWQgY2hpbGQgbm9kZXMKCiAgICAgIGxldCBjaGlsZDsKCiAgICAgIHdoaWxlIChjaGlsZCA9IGdldFVudmlzaXRlZE5vZGUobm9kZS5jaGlsZHJlbikpIHsKICAgICAgICBjaGlsZC52aXNpdGVkID0gdHJ1ZTsKICAgICAgICB2aXNpdEZ1bmMoY2hpbGQsIGJkcywgZXFzKTsKICAgICAgICBxdWV1ZS5wdXNoKGNoaWxkKTsKICAgICAgfQogICAgfQogIH0KCiAgZnVuY3Rpb24gdmlzaXRGdW5jKG5vZGUsIGJkcywgZXFzKSB7CiAgICBiZHMucHVzaChub2RlLmJvZHkpOwogICAgY29uc3QgTmVxcyA9IG5vZGUuZXFzLmxlbmd0aDsKCiAgICBmb3IgKGxldCBpID0gMDsgaSAhPT0gTmVxczsgaSsrKSB7CiAgICAgIGNvbnN0IGVxID0gbm9kZS5lcXNbaV07CgogICAgICBpZiAoIWVxcy5pbmNsdWRlcyhlcSkpIHsKICAgICAgICBlcXMucHVzaChlcSk7CiAgICAgIH0KICAgIH0KICB9CgogIGZ1bmN0aW9uIHNvcnRCeUlkKGEsIGIpIHsKICAgIHJldHVybiBiLmlkIC0gYS5pZDsKICB9CgogIC8qKgogICAqIEZvciBwb29saW5nIG9iamVjdHMgdGhhdCBjYW4gYmUgcmV1c2VkLgogICAqLwogIGNsYXNzIFBvb2wgewogICAgY29uc3RydWN0b3IoKSB7CiAgICAgIHRoaXMub2JqZWN0cyA9IFtdOwogICAgICB0aGlzLnR5cGUgPSBPYmplY3Q7CiAgICB9CgogICAgLyoqCiAgICAgKiBSZWxlYXNlIGFuIG9iamVjdCBhZnRlciB1c2UKICAgICAqLwogICAgcmVsZWFzZSgpIHsKICAgICAgY29uc3QgTmFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoOwoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgIT09IE5hcmdzOyBpKyspIHsKICAgICAgICB0aGlzLm9iamVjdHMucHVzaChpIDwgMCB8fCBhcmd1bWVudHMubGVuZ3RoIDw9IGkgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbaV0pOwogICAgICB9CgogICAgICByZXR1cm4gdGhpczsKICAgIH0KICAgIC8qKgogICAgICogR2V0IGFuIG9iamVjdAogICAgICovCgoKICAgIGdldCgpIHsKICAgICAgaWYgKHRoaXMub2JqZWN0cy5sZW5ndGggPT09IDApIHsKICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3RPYmplY3QoKTsKICAgICAgfSBlbHNlIHsKICAgICAgICByZXR1cm4gdGhpcy5vYmplY3RzLnBvcCgpOwogICAgICB9CiAgICB9CiAgICAvKioKICAgICAqIENvbnN0cnVjdCBhbiBvYmplY3QuIFNob3VsZCBiZSBpbXBsZW1lbnRlZCBpbiBlYWNoIHN1YmNsYXNzLgogICAgICovCgoKICAgIGNvbnN0cnVjdE9iamVjdCgpIHsKICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb25zdHJ1Y3RPYmplY3QoKSBub3QgaW1wbGVtZW50ZWQgaW4gdGhpcyBQb29sIHN1YmNsYXNzIHlldCEnKTsKICAgIH0KICAgIC8qKgogICAgICogQHJldHVybiBTZWxmLCBmb3IgY2hhaW5pbmcKICAgICAqLwoKCiAgICByZXNpemUoc2l6ZSkgewogICAgICBjb25zdCBvYmplY3RzID0gdGhpcy5vYmplY3RzOwoKICAgICAgd2hpbGUgKG9iamVjdHMubGVuZ3RoID4gc2l6ZSkgewogICAgICAgIG9iamVjdHMucG9wKCk7CiAgICAgIH0KCiAgICAgIHdoaWxlIChvYmplY3RzLmxlbmd0aCA8IHNpemUpIHsKICAgICAgICBvYmplY3RzLnB1c2godGhpcy5jb25zdHJ1Y3RPYmplY3QoKSk7CiAgICAgIH0KCiAgICAgIHJldHVybiB0aGlzOwogICAgfQoKICB9CgogIC8qKgogICAqIFZlYzNQb29sCiAgICovCgogIGNsYXNzIFZlYzNQb29sIGV4dGVuZHMgUG9vbCB7CiAgICBjb25zdHJ1Y3RvcigpIHsKICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTsKICAgICAgdGhpcy50eXBlID0gVmVjMzsKICAgIH0KCiAgICAvKioKICAgICAqIENvbnN0cnVjdCBhIHZlY3RvcgogICAgICovCiAgICBjb25zdHJ1Y3RPYmplY3QoKSB7CiAgICAgIHJldHVybiBuZXcgVmVjMygpOwogICAgfQoKICB9CgogIC8vIE5hbWluZyBydWxlOiBiYXNlZCBvZiB0aGUgb3JkZXIgaW4gU0hBUEVfVFlQRVMsCiAgLy8gdGhlIGZpcnN0IHBhcnQgb2YgdGhlIG1ldGhvZCBpcyBmb3JtZWQgYnkgdGhlCiAgLy8gc2hhcGUgdHlwZSB0aGF0IGNvbWVzIGJlZm9yZSwgaW4gdGhlIHNlY29uZCBwYXJ0CiAgLy8gdGhlcmUgaXMgdGhlIHNoYXBlIHR5cGUgdGhhdCBjb21lcyBhZnRlciBpbiB0aGUgU0hBUEVfVFlQRVMgbGlzdAogIGNvbnN0IENPTExJU0lPTl9UWVBFUyA9IHsKICAgIHNwaGVyZVNwaGVyZTogU2hhcGUudHlwZXMuU1BIRVJFLAogICAgc3BoZXJlUGxhbmU6IFNoYXBlLnR5cGVzLlNQSEVSRSB8IFNoYXBlLnR5cGVzLlBMQU5FLAogICAgYm94Qm94OiBTaGFwZS50eXBlcy5CT1ggfCBTaGFwZS50eXBlcy5CT1gsCiAgICBzcGhlcmVCb3g6IFNoYXBlLnR5cGVzLlNQSEVSRSB8IFNoYXBlLnR5cGVzLkJPWCwKICAgIHBsYW5lQm94OiBTaGFwZS50eXBlcy5QTEFORSB8IFNoYXBlLnR5cGVzLkJPWCwKICAgIGNvbnZleENvbnZleDogU2hhcGUudHlwZXMuQ09OVkVYUE9MWUhFRFJPTiwKICAgIHNwaGVyZUNvbnZleDogU2hhcGUudHlwZXMuU1BIRVJFIHwgU2hhcGUudHlwZXMuQ09OVkVYUE9MWUhFRFJPTiwKICAgIHBsYW5lQ29udmV4OiBTaGFwZS50eXBlcy5QTEFORSB8IFNoYXBlLnR5cGVzLkNPTlZFWFBPTFlIRURST04sCiAgICBib3hDb252ZXg6IFNoYXBlLnR5cGVzLkJPWCB8IFNoYXBlLnR5cGVzLkNPTlZFWFBPTFlIRURST04sCiAgICBzcGhlcmVIZWlnaHRmaWVsZDogU2hhcGUudHlwZXMuU1BIRVJFIHwgU2hhcGUudHlwZXMuSEVJR0hURklFTEQsCiAgICBib3hIZWlnaHRmaWVsZDogU2hhcGUudHlwZXMuQk9YIHwgU2hhcGUudHlwZXMuSEVJR0hURklFTEQsCiAgICBjb252ZXhIZWlnaHRmaWVsZDogU2hhcGUudHlwZXMuQ09OVkVYUE9MWUhFRFJPTiB8IFNoYXBlLnR5cGVzLkhFSUdIVEZJRUxELAogICAgc3BoZXJlUGFydGljbGU6IFNoYXBlLnR5cGVzLlBBUlRJQ0xFIHwgU2hhcGUudHlwZXMuU1BIRVJFLAogICAgcGxhbmVQYXJ0aWNsZTogU2hhcGUudHlwZXMuUExBTkUgfCBTaGFwZS50eXBlcy5QQVJUSUNMRSwKICAgIGJveFBhcnRpY2xlOiBTaGFwZS50eXBlcy5CT1ggfCBTaGFwZS50eXBlcy5QQVJUSUNMRSwKICAgIGNvbnZleFBhcnRpY2xlOiBTaGFwZS50eXBlcy5QQVJUSUNMRSB8IFNoYXBlLnR5cGVzLkNPTlZFWFBPTFlIRURST04sCiAgICBjeWxpbmRlckN5bGluZGVyOiBTaGFwZS50eXBlcy5DWUxJTkRFUiwKICAgIHNwaGVyZUN5bGluZGVyOiBTaGFwZS50eXBlcy5TUEhFUkUgfCBTaGFwZS50eXBlcy5DWUxJTkRFUiwKICAgIHBsYW5lQ3lsaW5kZXI6IFNoYXBlLnR5cGVzLlBMQU5FIHwgU2hhcGUudHlwZXMuQ1lMSU5ERVIsCiAgICBib3hDeWxpbmRlcjogU2hhcGUudHlwZXMuQk9YIHwgU2hhcGUudHlwZXMuQ1lMSU5ERVIsCiAgICBjb252ZXhDeWxpbmRlcjogU2hhcGUudHlwZXMuQ09OVkVYUE9MWUhFRFJPTiB8IFNoYXBlLnR5cGVzLkNZTElOREVSLAogICAgaGVpZ2h0ZmllbGRDeWxpbmRlcjogU2hhcGUudHlwZXMuSEVJR0hURklFTEQgfCBTaGFwZS50eXBlcy5DWUxJTkRFUiwKICAgIHBhcnRpY2xlQ3lsaW5kZXI6IFNoYXBlLnR5cGVzLlBBUlRJQ0xFIHwgU2hhcGUudHlwZXMuQ1lMSU5ERVIsCiAgICBzcGhlcmVUcmltZXNoOiBTaGFwZS50eXBlcy5TUEhFUkUgfCBTaGFwZS50eXBlcy5UUklNRVNILAogICAgcGxhbmVUcmltZXNoOiBTaGFwZS50eXBlcy5QTEFORSB8IFNoYXBlLnR5cGVzLlRSSU1FU0gKICB9OwoKICAvKioKICAgKiBIZWxwZXIgY2xhc3MgZm9yIHRoZSBXb3JsZC4gR2VuZXJhdGVzIENvbnRhY3RFcXVhdGlvbnMuCiAgICogQHRvZG8gU3BoZXJlLUNvbnZleFBvbHloZWRyb24gY29udGFjdHMKICAgKiBAdG9kbyBDb250YWN0IHJlZHVjdGlvbgogICAqIEB0b2RvIHNob3VsZCBtb3ZlIG1ldGhvZHMgdG8gcHJvdG90eXBlCiAgICovCiAgY2xhc3MgTmFycm93cGhhc2UgewogICAgLyoqCiAgICAgKiBJbnRlcm5hbCBzdG9yYWdlIG9mIHBvb2xlZCBjb250YWN0IHBvaW50cy4KICAgICAqLwoKICAgIC8qKgogICAgICogUG9vbGVkIHZlY3RvcnMuCiAgICAgKi8KICAgIGdldCBbQ09MTElTSU9OX1RZUEVTLnNwaGVyZVNwaGVyZV0oKSB7CiAgICAgIHJldHVybiB0aGlzLnNwaGVyZVNwaGVyZTsKICAgIH0KCiAgICBnZXQgW0NPTExJU0lPTl9UWVBFUy5zcGhlcmVQbGFuZV0oKSB7CiAgICAgIHJldHVybiB0aGlzLnNwaGVyZVBsYW5lOwogICAgfQoKICAgIGdldCBbQ09MTElTSU9OX1RZUEVTLmJveEJveF0oKSB7CiAgICAgIHJldHVybiB0aGlzLmJveEJveDsKICAgIH0KCiAgICBnZXQgW0NPTExJU0lPTl9UWVBFUy5zcGhlcmVCb3hdKCkgewogICAgICByZXR1cm4gdGhpcy5zcGhlcmVCb3g7CiAgICB9CgogICAgZ2V0IFtDT0xMSVNJT05fVFlQRVMucGxhbmVCb3hdKCkgewogICAgICByZXR1cm4gdGhpcy5wbGFuZUJveDsKICAgIH0KCiAgICBnZXQgW0NPTExJU0lPTl9UWVBFUy5jb252ZXhDb252ZXhdKCkgewogICAgICByZXR1cm4gdGhpcy5jb252ZXhDb252ZXg7CiAgICB9CgogICAgZ2V0IFtDT0xMSVNJT05fVFlQRVMuc3BoZXJlQ29udmV4XSgpIHsKICAgICAgcmV0dXJuIHRoaXMuc3BoZXJlQ29udmV4OwogICAgfQoKICAgIGdldCBbQ09MTElTSU9OX1RZUEVTLnBsYW5lQ29udmV4XSgpIHsKICAgICAgcmV0dXJuIHRoaXMucGxhbmVDb252ZXg7CiAgICB9CgogICAgZ2V0IFtDT0xMSVNJT05fVFlQRVMuYm94Q29udmV4XSgpIHsKICAgICAgcmV0dXJuIHRoaXMuYm94Q29udmV4OwogICAgfQoKICAgIGdldCBbQ09MTElTSU9OX1RZUEVTLnNwaGVyZUhlaWdodGZpZWxkXSgpIHsKICAgICAgcmV0dXJuIHRoaXMuc3BoZXJlSGVpZ2h0ZmllbGQ7CiAgICB9CgogICAgZ2V0IFtDT0xMSVNJT05fVFlQRVMuYm94SGVpZ2h0ZmllbGRdKCkgewogICAgICByZXR1cm4gdGhpcy5ib3hIZWlnaHRmaWVsZDsKICAgIH0KCiAgICBnZXQgW0NPTExJU0lPTl9UWVBFUy5jb252ZXhIZWlnaHRmaWVsZF0oKSB7CiAgICAgIHJldHVybiB0aGlzLmNvbnZleEhlaWdodGZpZWxkOwogICAgfQoKICAgIGdldCBbQ09MTElTSU9OX1RZUEVTLnNwaGVyZVBhcnRpY2xlXSgpIHsKICAgICAgcmV0dXJuIHRoaXMuc3BoZXJlUGFydGljbGU7CiAgICB9CgogICAgZ2V0IFtDT0xMSVNJT05fVFlQRVMucGxhbmVQYXJ0aWNsZV0oKSB7CiAgICAgIHJldHVybiB0aGlzLnBsYW5lUGFydGljbGU7CiAgICB9CgogICAgZ2V0IFtDT0xMSVNJT05fVFlQRVMuYm94UGFydGljbGVdKCkgewogICAgICByZXR1cm4gdGhpcy5ib3hQYXJ0aWNsZTsKICAgIH0KCiAgICBnZXQgW0NPTExJU0lPTl9UWVBFUy5jb252ZXhQYXJ0aWNsZV0oKSB7CiAgICAgIHJldHVybiB0aGlzLmNvbnZleFBhcnRpY2xlOwogICAgfQoKICAgIGdldCBbQ09MTElTSU9OX1RZUEVTLmN5bGluZGVyQ3lsaW5kZXJdKCkgewogICAgICByZXR1cm4gdGhpcy5jb252ZXhDb252ZXg7CiAgICB9CgogICAgZ2V0IFtDT0xMSVNJT05fVFlQRVMuc3BoZXJlQ3lsaW5kZXJdKCkgewogICAgICByZXR1cm4gdGhpcy5zcGhlcmVDb252ZXg7CiAgICB9CgogICAgZ2V0IFtDT0xMSVNJT05fVFlQRVMucGxhbmVDeWxpbmRlcl0oKSB7CiAgICAgIHJldHVybiB0aGlzLnBsYW5lQ29udmV4OwogICAgfQoKICAgIGdldCBbQ09MTElTSU9OX1RZUEVTLmJveEN5bGluZGVyXSgpIHsKICAgICAgcmV0dXJuIHRoaXMuYm94Q29udmV4OwogICAgfQoKICAgIGdldCBbQ09MTElTSU9OX1RZUEVTLmNvbnZleEN5bGluZGVyXSgpIHsKICAgICAgcmV0dXJuIHRoaXMuY29udmV4Q29udmV4OwogICAgfQoKICAgIGdldCBbQ09MTElTSU9OX1RZUEVTLmhlaWdodGZpZWxkQ3lsaW5kZXJdKCkgewogICAgICByZXR1cm4gdGhpcy5oZWlnaHRmaWVsZEN5bGluZGVyOwogICAgfQoKICAgIGdldCBbQ09MTElTSU9OX1RZUEVTLnBhcnRpY2xlQ3lsaW5kZXJdKCkgewogICAgICByZXR1cm4gdGhpcy5wYXJ0aWNsZUN5bGluZGVyOwogICAgfQoKICAgIGdldCBbQ09MTElTSU9OX1RZUEVTLnNwaGVyZVRyaW1lc2hdKCkgewogICAgICByZXR1cm4gdGhpcy5zcGhlcmVUcmltZXNoOwogICAgfQoKICAgIGdldCBbQ09MTElTSU9OX1RZUEVTLnBsYW5lVHJpbWVzaF0oKSB7CiAgICAgIHJldHVybiB0aGlzLnBsYW5lVHJpbWVzaDsKICAgIH0gLy8gZ2V0IFtDT0xMSVNJT05fVFlQRVMuY29udmV4VHJpbWVzaF0oKSB7CiAgICAvLyAgIHJldHVybiB0aGlzLmNvbnZleFRyaW1lc2gKICAgIC8vIH0KCgogICAgY29uc3RydWN0b3Iod29ybGQpIHsKICAgICAgdGhpcy5jb250YWN0UG9pbnRQb29sID0gW107CiAgICAgIHRoaXMuZnJpY3Rpb25FcXVhdGlvblBvb2wgPSBbXTsKICAgICAgdGhpcy5yZXN1bHQgPSBbXTsKICAgICAgdGhpcy5mcmljdGlvblJlc3VsdCA9IFtdOwogICAgICB0aGlzLnYzcG9vbCA9IG5ldyBWZWMzUG9vbCgpOwogICAgICB0aGlzLndvcmxkID0gd29ybGQ7CiAgICAgIHRoaXMuY3VycmVudENvbnRhY3RNYXRlcmlhbCA9IHdvcmxkLmRlZmF1bHRDb250YWN0TWF0ZXJpYWw7CiAgICAgIHRoaXMuZW5hYmxlRnJpY3Rpb25SZWR1Y3Rpb24gPSBmYWxzZTsKICAgIH0KICAgIC8qKgogICAgICogTWFrZSBhIGNvbnRhY3Qgb2JqZWN0LCBieSB1c2luZyB0aGUgaW50ZXJuYWwgcG9vbCBvciBjcmVhdGluZyBhIG5ldyBvbmUuCiAgICAgKi8KCgogICAgY3JlYXRlQ29udGFjdEVxdWF0aW9uKGJpLCBiaiwgc2ksIHNqLCBvdmVycmlkZVNoYXBlQSwgb3ZlcnJpZGVTaGFwZUIpIHsKICAgICAgbGV0IGM7CgogICAgICBpZiAodGhpcy5jb250YWN0UG9pbnRQb29sLmxlbmd0aCkgewogICAgICAgIGMgPSB0aGlzLmNvbnRhY3RQb2ludFBvb2wucG9wKCk7CiAgICAgICAgYy5iaSA9IGJpOwogICAgICAgIGMuYmogPSBiajsKICAgICAgfSBlbHNlIHsKICAgICAgICBjID0gbmV3IENvbnRhY3RFcXVhdGlvbihiaSwgYmopOwogICAgICB9CgogICAgICBjLmVuYWJsZWQgPSBiaS5jb2xsaXNpb25SZXNwb25zZSAmJiBiai5jb2xsaXNpb25SZXNwb25zZSAmJiBzaS5jb2xsaXNpb25SZXNwb25zZSAmJiBzai5jb2xsaXNpb25SZXNwb25zZTsKICAgICAgY29uc3QgY20gPSB0aGlzLmN1cnJlbnRDb250YWN0TWF0ZXJpYWw7CiAgICAgIGMucmVzdGl0dXRpb24gPSBjbS5yZXN0aXR1dGlvbjsKICAgICAgYy5zZXRTcG9va1BhcmFtcyhjbS5jb250YWN0RXF1YXRpb25TdGlmZm5lc3MsIGNtLmNvbnRhY3RFcXVhdGlvblJlbGF4YXRpb24sIHRoaXMud29ybGQuZHQpOwogICAgICBjb25zdCBtYXRBID0gc2kubWF0ZXJpYWwgfHwgYmkubWF0ZXJpYWw7CiAgICAgIGNvbnN0IG1hdEIgPSBzai5tYXRlcmlhbCB8fCBiai5tYXRlcmlhbDsKCiAgICAgIGlmIChtYXRBICYmIG1hdEIgJiYgbWF0QS5yZXN0aXR1dGlvbiA+PSAwICYmIG1hdEIucmVzdGl0dXRpb24gPj0gMCkgewogICAgICAgIGMucmVzdGl0dXRpb24gPSBtYXRBLnJlc3RpdHV0aW9uICogbWF0Qi5yZXN0aXR1dGlvbjsKICAgICAgfQoKICAgICAgYy5zaSA9IG92ZXJyaWRlU2hhcGVBIHx8IHNpOwogICAgICBjLnNqID0gb3ZlcnJpZGVTaGFwZUIgfHwgc2o7CiAgICAgIHJldHVybiBjOwogICAgfQoKICAgIGNyZWF0ZUZyaWN0aW9uRXF1YXRpb25zRnJvbUNvbnRhY3QoY29udGFjdEVxdWF0aW9uLCBvdXRBcnJheSkgewogICAgICBjb25zdCBib2R5QSA9IGNvbnRhY3RFcXVhdGlvbi5iaTsKICAgICAgY29uc3QgYm9keUIgPSBjb250YWN0RXF1YXRpb24uYmo7CiAgICAgIGNvbnN0IHNoYXBlQSA9IGNvbnRhY3RFcXVhdGlvbi5zaTsKICAgICAgY29uc3Qgc2hhcGVCID0gY29udGFjdEVxdWF0aW9uLnNqOwogICAgICBjb25zdCB3b3JsZCA9IHRoaXMud29ybGQ7CiAgICAgIGNvbnN0IGNtID0gdGhpcy5jdXJyZW50Q29udGFjdE1hdGVyaWFsOyAvLyBJZiBmcmljdGlvbiBvciByZXN0aXR1dGlvbiB3ZXJlIHNwZWNpZmllZCBpbiB0aGUgbWF0ZXJpYWwsIHVzZSB0aGVtCgogICAgICBsZXQgZnJpY3Rpb24gPSBjbS5mcmljdGlvbjsKICAgICAgY29uc3QgbWF0QSA9IHNoYXBlQS5tYXRlcmlhbCB8fCBib2R5QS5tYXRlcmlhbDsKICAgICAgY29uc3QgbWF0QiA9IHNoYXBlQi5tYXRlcmlhbCB8fCBib2R5Qi5tYXRlcmlhbDsKCiAgICAgIGlmIChtYXRBICYmIG1hdEIgJiYgbWF0QS5mcmljdGlvbiA+PSAwICYmIG1hdEIuZnJpY3Rpb24gPj0gMCkgewogICAgICAgIGZyaWN0aW9uID0gbWF0QS5mcmljdGlvbiAqIG1hdEIuZnJpY3Rpb247CiAgICAgIH0KCiAgICAgIGlmIChmcmljdGlvbiA+IDApIHsKICAgICAgICAvLyBDcmVhdGUgMiB0YW5nZW50IGVxdWF0aW9ucwogICAgICAgIC8vIFVzZXJzIG1heSBwcm92aWRlIGEgZm9yY2UgZGlmZmVyZW50IGZyb20gZ2xvYmFsIGdyYXZpdHkgdG8gdXNlIHdoZW4gY29tcHV0aW5nIGNvbnRhY3QgZnJpY3Rpb24uCiAgICAgICAgY29uc3QgbXVnID0gZnJpY3Rpb24gKiAod29ybGQuZnJpY3Rpb25HcmF2aXR5IHx8IHdvcmxkLmdyYXZpdHkpLmxlbmd0aCgpOwogICAgICAgIGxldCByZWR1Y2VkTWFzcyA9IGJvZHlBLmludk1hc3MgKyBib2R5Qi5pbnZNYXNzOwoKICAgICAgICBpZiAocmVkdWNlZE1hc3MgPiAwKSB7CiAgICAgICAgICByZWR1Y2VkTWFzcyA9IDEgLyByZWR1Y2VkTWFzczsKICAgICAgICB9CgogICAgICAgIGNvbnN0IHBvb2wgPSB0aGlzLmZyaWN0aW9uRXF1YXRpb25Qb29sOwogICAgICAgIGNvbnN0IGMxID0gcG9vbC5sZW5ndGggPyBwb29sLnBvcCgpIDogbmV3IEZyaWN0aW9uRXF1YXRpb24oYm9keUEsIGJvZHlCLCBtdWcgKiByZWR1Y2VkTWFzcyk7CiAgICAgICAgY29uc3QgYzIgPSBwb29sLmxlbmd0aCA/IHBvb2wucG9wKCkgOiBuZXcgRnJpY3Rpb25FcXVhdGlvbihib2R5QSwgYm9keUIsIG11ZyAqIHJlZHVjZWRNYXNzKTsKICAgICAgICBjMS5iaSA9IGMyLmJpID0gYm9keUE7CiAgICAgICAgYzEuYmogPSBjMi5iaiA9IGJvZHlCOwogICAgICAgIGMxLm1pbkZvcmNlID0gYzIubWluRm9yY2UgPSAtbXVnICogcmVkdWNlZE1hc3M7CiAgICAgICAgYzEubWF4Rm9yY2UgPSBjMi5tYXhGb3JjZSA9IG11ZyAqIHJlZHVjZWRNYXNzOyAvLyBDb3B5IG92ZXIgdGhlIHJlbGF0aXZlIHZlY3RvcnMKCiAgICAgICAgYzEucmkuY29weShjb250YWN0RXF1YXRpb24ucmkpOwogICAgICAgIGMxLnJqLmNvcHkoY29udGFjdEVxdWF0aW9uLnJqKTsKICAgICAgICBjMi5yaS5jb3B5KGNvbnRhY3RFcXVhdGlvbi5yaSk7CiAgICAgICAgYzIucmouY29weShjb250YWN0RXF1YXRpb24ucmopOyAvLyBDb25zdHJ1Y3QgdGFuZ2VudHMKCiAgICAgICAgY29udGFjdEVxdWF0aW9uLm5pLnRhbmdlbnRzKGMxLnQsIGMyLnQpOyAvLyBTZXQgc3Bvb2sgcGFyYW1zCgogICAgICAgIGMxLnNldFNwb29rUGFyYW1zKGNtLmZyaWN0aW9uRXF1YXRpb25TdGlmZm5lc3MsIGNtLmZyaWN0aW9uRXF1YXRpb25SZWxheGF0aW9uLCB3b3JsZC5kdCk7CiAgICAgICAgYzIuc2V0U3Bvb2tQYXJhbXMoY20uZnJpY3Rpb25FcXVhdGlvblN0aWZmbmVzcywgY20uZnJpY3Rpb25FcXVhdGlvblJlbGF4YXRpb24sIHdvcmxkLmR0KTsKICAgICAgICBjMS5lbmFibGVkID0gYzIuZW5hYmxlZCA9IGNvbnRhY3RFcXVhdGlvbi5lbmFibGVkOwogICAgICAgIG91dEFycmF5LnB1c2goYzEsIGMyKTsKICAgICAgICByZXR1cm4gdHJ1ZTsKICAgICAgfQoKICAgICAgcmV0dXJuIGZhbHNlOwogICAgfQogICAgLyoqCiAgICAgKiBUYWtlIHRoZSBhdmVyYWdlIE4gbGF0ZXN0IGNvbnRhY3QgcG9pbnQgb24gdGhlIHBsYW5lLgogICAgICovCgoKICAgIGNyZWF0ZUZyaWN0aW9uRnJvbUF2ZXJhZ2UobnVtQ29udGFjdHMpIHsKICAgICAgLy8gVGhlIGxhc3QgY29udGFjdEVxdWF0aW9uCiAgICAgIGxldCBjID0gdGhpcy5yZXN1bHRbdGhpcy5yZXN1bHQubGVuZ3RoIC0gMV07IC8vIENyZWF0ZSB0aGUgcmVzdWx0OiB0d28gImF2ZXJhZ2UiIGZyaWN0aW9uIGVxdWF0aW9ucwoKICAgICAgaWYgKCF0aGlzLmNyZWF0ZUZyaWN0aW9uRXF1YXRpb25zRnJvbUNvbnRhY3QoYywgdGhpcy5mcmljdGlvblJlc3VsdCkgfHwgbnVtQ29udGFjdHMgPT09IDEpIHsKICAgICAgICByZXR1cm47CiAgICAgIH0KCiAgICAgIGNvbnN0IGYxID0gdGhpcy5mcmljdGlvblJlc3VsdFt0aGlzLmZyaWN0aW9uUmVzdWx0Lmxlbmd0aCAtIDJdOwogICAgICBjb25zdCBmMiA9IHRoaXMuZnJpY3Rpb25SZXN1bHRbdGhpcy5mcmljdGlvblJlc3VsdC5sZW5ndGggLSAxXTsKICAgICAgYXZlcmFnZU5vcm1hbC5zZXRaZXJvKCk7CiAgICAgIGF2ZXJhZ2VDb250YWN0UG9pbnRBLnNldFplcm8oKTsKICAgICAgYXZlcmFnZUNvbnRhY3RQb2ludEIuc2V0WmVybygpOwogICAgICBjb25zdCBib2R5QSA9IGMuYmk7CiAgICAgIGMuYmo7CgogICAgICBmb3IgKGxldCBpID0gMDsgaSAhPT0gbnVtQ29udGFjdHM7IGkrKykgewogICAgICAgIGMgPSB0aGlzLnJlc3VsdFt0aGlzLnJlc3VsdC5sZW5ndGggLSAxIC0gaV07CgogICAgICAgIGlmIChjLmJpICE9PSBib2R5QSkgewogICAgICAgICAgYXZlcmFnZU5vcm1hbC52YWRkKGMubmksIGF2ZXJhZ2VOb3JtYWwpOwogICAgICAgICAgYXZlcmFnZUNvbnRhY3RQb2ludEEudmFkZChjLnJpLCBhdmVyYWdlQ29udGFjdFBvaW50QSk7CiAgICAgICAgICBhdmVyYWdlQ29udGFjdFBvaW50Qi52YWRkKGMucmosIGF2ZXJhZ2VDb250YWN0UG9pbnRCKTsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgYXZlcmFnZU5vcm1hbC52c3ViKGMubmksIGF2ZXJhZ2VOb3JtYWwpOwogICAgICAgICAgYXZlcmFnZUNvbnRhY3RQb2ludEEudmFkZChjLnJqLCBhdmVyYWdlQ29udGFjdFBvaW50QSk7CiAgICAgICAgICBhdmVyYWdlQ29udGFjdFBvaW50Qi52YWRkKGMucmksIGF2ZXJhZ2VDb250YWN0UG9pbnRCKTsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIGNvbnN0IGludk51bUNvbnRhY3RzID0gMSAvIG51bUNvbnRhY3RzOwogICAgICBhdmVyYWdlQ29udGFjdFBvaW50QS5zY2FsZShpbnZOdW1Db250YWN0cywgZjEucmkpOwogICAgICBhdmVyYWdlQ29udGFjdFBvaW50Qi5zY2FsZShpbnZOdW1Db250YWN0cywgZjEucmopOwogICAgICBmMi5yaS5jb3B5KGYxLnJpKTsgLy8gU2hvdWxkIGJlIHRoZSBzYW1lCgogICAgICBmMi5yai5jb3B5KGYxLnJqKTsKICAgICAgYXZlcmFnZU5vcm1hbC5ub3JtYWxpemUoKTsKICAgICAgYXZlcmFnZU5vcm1hbC50YW5nZW50cyhmMS50LCBmMi50KTsgLy8gcmV0dXJuIGVxOwogICAgfQogICAgLyoqCiAgICAgKiBHZW5lcmF0ZSBhbGwgY29udGFjdHMgYmV0d2VlbiBhIGxpc3Qgb2YgYm9keSBwYWlycwogICAgICogQHBhcmFtIHAxIEFycmF5IG9mIGJvZHkgaW5kaWNlcwogICAgICogQHBhcmFtIHAyIEFycmF5IG9mIGJvZHkgaW5kaWNlcwogICAgICogQHBhcmFtIHJlc3VsdCBBcnJheSB0byBzdG9yZSBnZW5lcmF0ZWQgY29udGFjdHMKICAgICAqIEBwYXJhbSBvbGRjb250YWN0cyBPcHRpb25hbC4gQXJyYXkgb2YgcmV1c2FibGUgY29udGFjdCBvYmplY3RzCiAgICAgKi8KCgogICAgZ2V0Q29udGFjdHMocDEsIHAyLCB3b3JsZCwgcmVzdWx0LCBvbGRjb250YWN0cywgZnJpY3Rpb25SZXN1bHQsIGZyaWN0aW9uUG9vbCkgewogICAgICAvLyBTYXZlIG9sZCBjb250YWN0IG9iamVjdHMKICAgICAgdGhpcy5jb250YWN0UG9pbnRQb29sID0gb2xkY29udGFjdHM7CiAgICAgIHRoaXMuZnJpY3Rpb25FcXVhdGlvblBvb2wgPSBmcmljdGlvblBvb2w7CiAgICAgIHRoaXMucmVzdWx0ID0gcmVzdWx0OwogICAgICB0aGlzLmZyaWN0aW9uUmVzdWx0ID0gZnJpY3Rpb25SZXN1bHQ7CiAgICAgIGNvbnN0IHFpID0gdG1wUXVhdDE7CiAgICAgIGNvbnN0IHFqID0gdG1wUXVhdDI7CiAgICAgIGNvbnN0IHhpID0gdG1wVmVjMTsKICAgICAgY29uc3QgeGogPSB0bXBWZWMyOwoKICAgICAgZm9yIChsZXQgayA9IDAsIE4gPSBwMS5sZW5ndGg7IGsgIT09IE47IGsrKykgewogICAgICAgIC8vIEdldCBjdXJyZW50IGNvbGxpc2lvbiBib2RpZXMKICAgICAgICBjb25zdCBiaSA9IHAxW2tdOwogICAgICAgIGNvbnN0IGJqID0gcDJba107IC8vIEdldCBjb250YWN0IG1hdGVyaWFsCgogICAgICAgIGxldCBib2R5Q29udGFjdE1hdGVyaWFsID0gbnVsbDsKCiAgICAgICAgaWYgKGJpLm1hdGVyaWFsICYmIGJqLm1hdGVyaWFsKSB7CiAgICAgICAgICBib2R5Q29udGFjdE1hdGVyaWFsID0gd29ybGQuZ2V0Q29udGFjdE1hdGVyaWFsKGJpLm1hdGVyaWFsLCBiai5tYXRlcmlhbCkgfHwgbnVsbDsKICAgICAgICB9CgogICAgICAgIGNvbnN0IGp1c3RUZXN0ID0gYmkudHlwZSAmIEJvZHkuS0lORU1BVElDICYmIGJqLnR5cGUgJiBCb2R5LlNUQVRJQyB8fCBiaS50eXBlICYgQm9keS5TVEFUSUMgJiYgYmoudHlwZSAmIEJvZHkuS0lORU1BVElDIHx8IGJpLnR5cGUgJiBCb2R5LktJTkVNQVRJQyAmJiBiai50eXBlICYgQm9keS5LSU5FTUFUSUM7CgogICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmkuc2hhcGVzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgICBiaS5xdWF0ZXJuaW9uLm11bHQoYmkuc2hhcGVPcmllbnRhdGlvbnNbaV0sIHFpKTsKICAgICAgICAgIGJpLnF1YXRlcm5pb24udm11bHQoYmkuc2hhcGVPZmZzZXRzW2ldLCB4aSk7CiAgICAgICAgICB4aS52YWRkKGJpLnBvc2l0aW9uLCB4aSk7CiAgICAgICAgICBjb25zdCBzaSA9IGJpLnNoYXBlc1tpXTsKCiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJqLnNoYXBlcy5sZW5ndGg7IGorKykgewogICAgICAgICAgICAvLyBDb21wdXRlIHdvcmxkIHRyYW5zZm9ybSBvZiBzaGFwZXMKICAgICAgICAgICAgYmoucXVhdGVybmlvbi5tdWx0KGJqLnNoYXBlT3JpZW50YXRpb25zW2pdLCBxaik7CiAgICAgICAgICAgIGJqLnF1YXRlcm5pb24udm11bHQoYmouc2hhcGVPZmZzZXRzW2pdLCB4aik7CiAgICAgICAgICAgIHhqLnZhZGQoYmoucG9zaXRpb24sIHhqKTsKICAgICAgICAgICAgY29uc3Qgc2ogPSBiai5zaGFwZXNbal07CgogICAgICAgICAgICBpZiAoIShzaS5jb2xsaXNpb25GaWx0ZXJNYXNrICYgc2ouY29sbGlzaW9uRmlsdGVyR3JvdXAgJiYgc2ouY29sbGlzaW9uRmlsdGVyTWFzayAmIHNpLmNvbGxpc2lvbkZpbHRlckdyb3VwKSkgewogICAgICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgICAgICB9CgogICAgICAgICAgICBpZiAoeGkuZGlzdGFuY2VUbyh4aikgPiBzaS5ib3VuZGluZ1NwaGVyZVJhZGl1cyArIHNqLmJvdW5kaW5nU3BoZXJlUmFkaXVzKSB7CiAgICAgICAgICAgICAgY29udGludWU7CiAgICAgICAgICAgIH0gLy8gR2V0IGNvbGxpc2lvbiBtYXRlcmlhbAoKCiAgICAgICAgICAgIGxldCBzaGFwZUNvbnRhY3RNYXRlcmlhbCA9IG51bGw7CgogICAgICAgICAgICBpZiAoc2kubWF0ZXJpYWwgJiYgc2oubWF0ZXJpYWwpIHsKICAgICAgICAgICAgICBzaGFwZUNvbnRhY3RNYXRlcmlhbCA9IHdvcmxkLmdldENvbnRhY3RNYXRlcmlhbChzaS5tYXRlcmlhbCwgc2oubWF0ZXJpYWwpIHx8IG51bGw7CiAgICAgICAgICAgIH0KCiAgICAgICAgICAgIHRoaXMuY3VycmVudENvbnRhY3RNYXRlcmlhbCA9IHNoYXBlQ29udGFjdE1hdGVyaWFsIHx8IGJvZHlDb250YWN0TWF0ZXJpYWwgfHwgd29ybGQuZGVmYXVsdENvbnRhY3RNYXRlcmlhbDsgLy8gR2V0IGNvbnRhY3RzCgogICAgICAgICAgICBjb25zdCByZXNvbHZlckluZGV4ID0gc2kudHlwZSB8IHNqLnR5cGU7CiAgICAgICAgICAgIGNvbnN0IHJlc29sdmVyID0gdGhpc1tyZXNvbHZlckluZGV4XTsKCiAgICAgICAgICAgIGlmIChyZXNvbHZlcikgewogICAgICAgICAgICAgIGxldCByZXR2YWwgPSBmYWxzZTsgLy8gVE8gRE86IGludmVzdGlnYXRlIHdoeSBzcGhlcmVQYXJ0aWNsZSBhbmQgY29udmV4UGFydGljbGUKICAgICAgICAgICAgICAvLyByZXNvbHZlcnMgZXhwZWN0IHNpIGFuZCBzaiBzaGFwZXMgdG8gYmUgaW4gcmV2ZXJzZSBvcmRlcgogICAgICAgICAgICAgIC8vIChpLmUuIGxhcmdlciBpbnRlZ2VyIHZhbHVlIHR5cGUgZmlyc3QgaW5zdGVhZCBvZiBzbWFsbGVyIGZpcnN0KQoKICAgICAgICAgICAgICBpZiAoc2kudHlwZSA8IHNqLnR5cGUpIHsKICAgICAgICAgICAgICAgIHJldHZhbCA9IHJlc29sdmVyLmNhbGwodGhpcywgc2ksIHNqLCB4aSwgeGosIHFpLCBxaiwgYmksIGJqLCBzaSwgc2osIGp1c3RUZXN0KTsKICAgICAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICAgICAgcmV0dmFsID0gcmVzb2x2ZXIuY2FsbCh0aGlzLCBzaiwgc2ksIHhqLCB4aSwgcWosIHFpLCBiaiwgYmksIHNpLCBzaiwganVzdFRlc3QpOwogICAgICAgICAgICAgIH0KCiAgICAgICAgICAgICAgaWYgKHJldHZhbCAmJiBqdXN0VGVzdCkgewogICAgICAgICAgICAgICAgLy8gUmVnaXN0ZXIgb3ZlcmxhcAogICAgICAgICAgICAgICAgd29ybGQuc2hhcGVPdmVybGFwS2VlcGVyLnNldChzaS5pZCwgc2ouaWQpOwogICAgICAgICAgICAgICAgd29ybGQuYm9keU92ZXJsYXBLZWVwZXIuc2V0KGJpLmlkLCBiai5pZCk7CiAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9CiAgICB9CgogICAgc3BoZXJlU3BoZXJlKHNpLCBzaiwgeGksIHhqLCBxaSwgcWosIGJpLCBiaiwgcnNpLCByc2osIGp1c3RUZXN0KSB7CiAgICAgIGlmIChqdXN0VGVzdCkgewogICAgICAgIHJldHVybiB4aS5kaXN0YW5jZVNxdWFyZWQoeGopIDwgKHNpLnJhZGl1cyArIHNqLnJhZGl1cykgKiogMjsKICAgICAgfSAvLyBXZSB3aWxsIGhhdmUgb25seSBvbmUgY29udGFjdCBpbiB0aGlzIGNhc2UKCgogICAgICBjb25zdCBjb250YWN0RXEgPSB0aGlzLmNyZWF0ZUNvbnRhY3RFcXVhdGlvbihiaSwgYmosIHNpLCBzaiwgcnNpLCByc2opOyAvLyBDb250YWN0IG5vcm1hbAoKICAgICAgeGoudnN1Yih4aSwgY29udGFjdEVxLm5pKTsKICAgICAgY29udGFjdEVxLm5pLm5vcm1hbGl6ZSgpOyAvLyBDb250YWN0IHBvaW50IGxvY2F0aW9ucwoKICAgICAgY29udGFjdEVxLnJpLmNvcHkoY29udGFjdEVxLm5pKTsKICAgICAgY29udGFjdEVxLnJqLmNvcHkoY29udGFjdEVxLm5pKTsKICAgICAgY29udGFjdEVxLnJpLnNjYWxlKHNpLnJhZGl1cywgY29udGFjdEVxLnJpKTsKICAgICAgY29udGFjdEVxLnJqLnNjYWxlKC1zai5yYWRpdXMsIGNvbnRhY3RFcS5yaik7CiAgICAgIGNvbnRhY3RFcS5yaS52YWRkKHhpLCBjb250YWN0RXEucmkpOwogICAgICBjb250YWN0RXEucmkudnN1YihiaS5wb3NpdGlvbiwgY29udGFjdEVxLnJpKTsKICAgICAgY29udGFjdEVxLnJqLnZhZGQoeGosIGNvbnRhY3RFcS5yaik7CiAgICAgIGNvbnRhY3RFcS5yai52c3ViKGJqLnBvc2l0aW9uLCBjb250YWN0RXEucmopOwogICAgICB0aGlzLnJlc3VsdC5wdXNoKGNvbnRhY3RFcSk7CiAgICAgIHRoaXMuY3JlYXRlRnJpY3Rpb25FcXVhdGlvbnNGcm9tQ29udGFjdChjb250YWN0RXEsIHRoaXMuZnJpY3Rpb25SZXN1bHQpOwogICAgfQoKICAgIHNwaGVyZVBsYW5lKHNpLCBzaiwgeGksIHhqLCBxaSwgcWosIGJpLCBiaiwgcnNpLCByc2osIGp1c3RUZXN0KSB7CiAgICAgIC8vIFdlIHdpbGwgaGF2ZSBvbmUgY29udGFjdCBpbiB0aGlzIGNhc2UKICAgICAgY29uc3QgciA9IHRoaXMuY3JlYXRlQ29udGFjdEVxdWF0aW9uKGJpLCBiaiwgc2ksIHNqLCByc2ksIHJzaik7IC8vIENvbnRhY3Qgbm9ybWFsCgogICAgICByLm5pLnNldCgwLCAwLCAxKTsKICAgICAgcWoudm11bHQoci5uaSwgci5uaSk7CiAgICAgIHIubmkubmVnYXRlKHIubmkpOyAvLyBib2R5IGkgaXMgdGhlIHNwaGVyZSwgZmxpcCBub3JtYWwKCiAgICAgIHIubmkubm9ybWFsaXplKCk7IC8vIE5lZWRlZD8KICAgICAgLy8gVmVjdG9yIGZyb20gc3BoZXJlIGNlbnRlciB0byBjb250YWN0IHBvaW50CgogICAgICByLm5pLnNjYWxlKHNpLnJhZGl1cywgci5yaSk7IC8vIFByb2plY3QgZG93biBzcGhlcmUgb24gcGxhbmUKCiAgICAgIHhpLnZzdWIoeGosIHBvaW50X29uX3BsYW5lX3RvX3NwaGVyZSk7CiAgICAgIHIubmkuc2NhbGUoci5uaS5kb3QocG9pbnRfb25fcGxhbmVfdG9fc3BoZXJlKSwgcGxhbmVfdG9fc3BoZXJlX29ydGhvKTsKICAgICAgcG9pbnRfb25fcGxhbmVfdG9fc3BoZXJlLnZzdWIocGxhbmVfdG9fc3BoZXJlX29ydGhvLCByLnJqKTsgLy8gVGhlIHNwaGVyZSBwb3NpdGlvbiBwcm9qZWN0ZWQgdG8gcGxhbmUKCiAgICAgIGlmICgtcG9pbnRfb25fcGxhbmVfdG9fc3BoZXJlLmRvdChyLm5pKSA8PSBzaS5yYWRpdXMpIHsKICAgICAgICBpZiAoanVzdFRlc3QpIHsKICAgICAgICAgIHJldHVybiB0cnVlOwogICAgICAgIH0gLy8gTWFrZSBpdCByZWxhdGl2ZSB0byB0aGUgYm9keQoKCiAgICAgICAgY29uc3QgcmkgPSByLnJpOwogICAgICAgIGNvbnN0IHJqID0gci5yajsKICAgICAgICByaS52YWRkKHhpLCByaSk7CiAgICAgICAgcmkudnN1YihiaS5wb3NpdGlvbiwgcmkpOwogICAgICAgIHJqLnZhZGQoeGosIHJqKTsKICAgICAgICByai52c3ViKGJqLnBvc2l0aW9uLCByaik7CiAgICAgICAgdGhpcy5yZXN1bHQucHVzaChyKTsKICAgICAgICB0aGlzLmNyZWF0ZUZyaWN0aW9uRXF1YXRpb25zRnJvbUNvbnRhY3QociwgdGhpcy5mcmljdGlvblJlc3VsdCk7CiAgICAgIH0KICAgIH0KCiAgICBib3hCb3goc2ksIHNqLCB4aSwgeGosIHFpLCBxaiwgYmksIGJqLCByc2ksIHJzaiwganVzdFRlc3QpIHsKICAgICAgc2kuY29udmV4UG9seWhlZHJvblJlcHJlc2VudGF0aW9uLm1hdGVyaWFsID0gc2kubWF0ZXJpYWw7CiAgICAgIHNqLmNvbnZleFBvbHloZWRyb25SZXByZXNlbnRhdGlvbi5tYXRlcmlhbCA9IHNqLm1hdGVyaWFsOwogICAgICBzaS5jb252ZXhQb2x5aGVkcm9uUmVwcmVzZW50YXRpb24uY29sbGlzaW9uUmVzcG9uc2UgPSBzaS5jb2xsaXNpb25SZXNwb25zZTsKICAgICAgc2ouY29udmV4UG9seWhlZHJvblJlcHJlc2VudGF0aW9uLmNvbGxpc2lvblJlc3BvbnNlID0gc2ouY29sbGlzaW9uUmVzcG9uc2U7CiAgICAgIHJldHVybiB0aGlzLmNvbnZleENvbnZleChzaS5jb252ZXhQb2x5aGVkcm9uUmVwcmVzZW50YXRpb24sIHNqLmNvbnZleFBvbHloZWRyb25SZXByZXNlbnRhdGlvbiwgeGksIHhqLCBxaSwgcWosIGJpLCBiaiwgc2ksIHNqLCBqdXN0VGVzdCk7CiAgICB9CgogICAgc3BoZXJlQm94KHNpLCBzaiwgeGksIHhqLCBxaSwgcWosIGJpLCBiaiwgcnNpLCByc2osIGp1c3RUZXN0KSB7CiAgICAgIGNvbnN0IHYzcG9vbCA9IHRoaXMudjNwb29sOyAvLyB3ZSByZWZlciB0byB0aGUgYm94IGFzIGJvZHkgagoKICAgICAgY29uc3Qgc2lkZXMgPSBzcGhlcmVCb3hfc2lkZXM7CiAgICAgIHhpLnZzdWIoeGosIGJveF90b19zcGhlcmUpOwogICAgICBzai5nZXRTaWRlTm9ybWFscyhzaWRlcywgcWopOwogICAgICBjb25zdCBSID0gc2kucmFkaXVzOwoKICAgICAgbGV0IGZvdW5kID0gZmFsc2U7IC8vIFN0b3JlIHRoZSByZXN1bHRpbmcgc2lkZSBwZW5ldHJhdGlvbiBpbmZvCgogICAgICBjb25zdCBzaWRlX25zID0gc3BoZXJlQm94X3NpZGVfbnM7CiAgICAgIGNvbnN0IHNpZGVfbnMxID0gc3BoZXJlQm94X3NpZGVfbnMxOwogICAgICBjb25zdCBzaWRlX25zMiA9IHNwaGVyZUJveF9zaWRlX25zMjsKICAgICAgbGV0IHNpZGVfaCA9IG51bGw7CiAgICAgIGxldCBzaWRlX3BlbmV0cmF0aW9ucyA9IDA7CiAgICAgIGxldCBzaWRlX2RvdDEgPSAwOwogICAgICBsZXQgc2lkZV9kb3QyID0gMDsKICAgICAgbGV0IHNpZGVfZGlzdGFuY2UgPSBudWxsOwoKICAgICAgZm9yIChsZXQgaWR4ID0gMCwgbnNpZGVzID0gc2lkZXMubGVuZ3RoOyBpZHggIT09IG5zaWRlcyAmJiBmb3VuZCA9PT0gZmFsc2U7IGlkeCsrKSB7CiAgICAgICAgLy8gR2V0IHRoZSBwbGFuZSBzaWRlIG5vcm1hbCAobnMpCiAgICAgICAgY29uc3QgbnMgPSBzcGhlcmVCb3hfbnM7CiAgICAgICAgbnMuY29weShzaWRlc1tpZHhdKTsKICAgICAgICBjb25zdCBoID0gbnMubGVuZ3RoKCk7CiAgICAgICAgbnMubm9ybWFsaXplKCk7IC8vIFRoZSBub3JtYWwvZGlzdGFuY2UgZG90IHByb2R1Y3QgdGVsbHMgd2hpY2ggc2lkZSBvZiB0aGUgcGxhbmUgd2UgYXJlCgogICAgICAgIGNvbnN0IGRvdCA9IGJveF90b19zcGhlcmUuZG90KG5zKTsKCiAgICAgICAgaWYgKGRvdCA8IGggKyBSICYmIGRvdCA+IDApIHsKICAgICAgICAgIC8vIEludGVyc2VjdHMgcGxhbmUuIE5vdyBjaGVjayB0aGUgb3RoZXIgdHdvIGRpbWVuc2lvbnMKICAgICAgICAgIGNvbnN0IG5zMSA9IHNwaGVyZUJveF9uczE7CiAgICAgICAgICBjb25zdCBuczIgPSBzcGhlcmVCb3hfbnMyOwogICAgICAgICAgbnMxLmNvcHkoc2lkZXNbKGlkeCArIDEpICUgM10pOwogICAgICAgICAgbnMyLmNvcHkoc2lkZXNbKGlkeCArIDIpICUgM10pOwogICAgICAgICAgY29uc3QgaDEgPSBuczEubGVuZ3RoKCk7CiAgICAgICAgICBjb25zdCBoMiA9IG5zMi5sZW5ndGgoKTsKICAgICAgICAgIG5zMS5ub3JtYWxpemUoKTsKICAgICAgICAgIG5zMi5ub3JtYWxpemUoKTsKICAgICAgICAgIGNvbnN0IGRvdDEgPSBib3hfdG9fc3BoZXJlLmRvdChuczEpOwogICAgICAgICAgY29uc3QgZG90MiA9IGJveF90b19zcGhlcmUuZG90KG5zMik7CgogICAgICAgICAgaWYgKGRvdDEgPCBoMSAmJiBkb3QxID4gLWgxICYmIGRvdDIgPCBoMiAmJiBkb3QyID4gLWgyKSB7CiAgICAgICAgICAgIGNvbnN0IGRpc3QgPSBNYXRoLmFicyhkb3QgLSBoIC0gUik7CgogICAgICAgICAgICBpZiAoc2lkZV9kaXN0YW5jZSA9PT0gbnVsbCB8fCBkaXN0IDwgc2lkZV9kaXN0YW5jZSkgewogICAgICAgICAgICAgIHNpZGVfZGlzdGFuY2UgPSBkaXN0OwogICAgICAgICAgICAgIHNpZGVfZG90MSA9IGRvdDE7CiAgICAgICAgICAgICAgc2lkZV9kb3QyID0gZG90MjsKICAgICAgICAgICAgICBzaWRlX2ggPSBoOwogICAgICAgICAgICAgIHNpZGVfbnMuY29weShucyk7CiAgICAgICAgICAgICAgc2lkZV9uczEuY29weShuczEpOwogICAgICAgICAgICAgIHNpZGVfbnMyLmNvcHkobnMyKTsKICAgICAgICAgICAgICBzaWRlX3BlbmV0cmF0aW9ucysrOwoKICAgICAgICAgICAgICBpZiAoanVzdFRlc3QpIHsKICAgICAgICAgICAgICAgIHJldHVybiB0cnVlOwogICAgICAgICAgICAgIH0KICAgICAgICAgICAgfQogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfQoKICAgICAgaWYgKHNpZGVfcGVuZXRyYXRpb25zKSB7CiAgICAgICAgZm91bmQgPSB0cnVlOwogICAgICAgIGNvbnN0IHIgPSB0aGlzLmNyZWF0ZUNvbnRhY3RFcXVhdGlvbihiaSwgYmosIHNpLCBzaiwgcnNpLCByc2opOwogICAgICAgIHNpZGVfbnMuc2NhbGUoLVIsIHIucmkpOyAvLyBTcGhlcmUgcgoKICAgICAgICByLm5pLmNvcHkoc2lkZV9ucyk7CiAgICAgICAgci5uaS5uZWdhdGUoci5uaSk7IC8vIE5vcm1hbCBzaG91bGQgYmUgb3V0IG9mIHNwaGVyZQoKICAgICAgICBzaWRlX25zLnNjYWxlKHNpZGVfaCwgc2lkZV9ucyk7CiAgICAgICAgc2lkZV9uczEuc2NhbGUoc2lkZV9kb3QxLCBzaWRlX25zMSk7CiAgICAgICAgc2lkZV9ucy52YWRkKHNpZGVfbnMxLCBzaWRlX25zKTsKICAgICAgICBzaWRlX25zMi5zY2FsZShzaWRlX2RvdDIsIHNpZGVfbnMyKTsKICAgICAgICBzaWRlX25zLnZhZGQoc2lkZV9uczIsIHIucmopOyAvLyBNYWtlIHJlbGF0aXZlIHRvIGJvZGllcwoKICAgICAgICByLnJpLnZhZGQoeGksIHIucmkpOwogICAgICAgIHIucmkudnN1YihiaS5wb3NpdGlvbiwgci5yaSk7CiAgICAgICAgci5yai52YWRkKHhqLCByLnJqKTsKICAgICAgICByLnJqLnZzdWIoYmoucG9zaXRpb24sIHIucmopOwogICAgICAgIHRoaXMucmVzdWx0LnB1c2gocik7CiAgICAgICAgdGhpcy5jcmVhdGVGcmljdGlvbkVxdWF0aW9uc0Zyb21Db250YWN0KHIsIHRoaXMuZnJpY3Rpb25SZXN1bHQpOwogICAgICB9IC8vIENoZWNrIGNvcm5lcnMKCgogICAgICBsZXQgcmogPSB2M3Bvb2wuZ2V0KCk7CiAgICAgIGNvbnN0IHNwaGVyZV90b19jb3JuZXIgPSBzcGhlcmVCb3hfc3BoZXJlX3RvX2Nvcm5lcjsKCiAgICAgIGZvciAobGV0IGogPSAwOyBqICE9PSAyICYmICFmb3VuZDsgaisrKSB7CiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgIT09IDIgJiYgIWZvdW5kOyBrKyspIHsKICAgICAgICAgIGZvciAobGV0IGwgPSAwOyBsICE9PSAyICYmICFmb3VuZDsgbCsrKSB7CiAgICAgICAgICAgIHJqLnNldCgwLCAwLCAwKTsKCiAgICAgICAgICAgIGlmIChqKSB7CiAgICAgICAgICAgICAgcmoudmFkZChzaWRlc1swXSwgcmopOwogICAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICAgIHJqLnZzdWIoc2lkZXNbMF0sIHJqKTsKICAgICAgICAgICAgfQoKICAgICAgICAgICAgaWYgKGspIHsKICAgICAgICAgICAgICByai52YWRkKHNpZGVzWzFdLCByaik7CiAgICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgICAgcmoudnN1YihzaWRlc1sxXSwgcmopOwogICAgICAgICAgICB9CgogICAgICAgICAgICBpZiAobCkgewogICAgICAgICAgICAgIHJqLnZhZGQoc2lkZXNbMl0sIHJqKTsKICAgICAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgICByai52c3ViKHNpZGVzWzJdLCByaik7CiAgICAgICAgICAgIH0gLy8gV29ybGQgcG9zaXRpb24gb2YgY29ybmVyCgoKICAgICAgICAgICAgeGoudmFkZChyaiwgc3BoZXJlX3RvX2Nvcm5lcik7CiAgICAgICAgICAgIHNwaGVyZV90b19jb3JuZXIudnN1Yih4aSwgc3BoZXJlX3RvX2Nvcm5lcik7CgogICAgICAgICAgICBpZiAoc3BoZXJlX3RvX2Nvcm5lci5sZW5ndGhTcXVhcmVkKCkgPCBSICogUikgewogICAgICAgICAgICAgIGlmIChqdXN0VGVzdCkgewogICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7CiAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7CiAgICAgICAgICAgICAgY29uc3QgciA9IHRoaXMuY3JlYXRlQ29udGFjdEVxdWF0aW9uKGJpLCBiaiwgc2ksIHNqLCByc2ksIHJzaik7CiAgICAgICAgICAgICAgci5yaS5jb3B5KHNwaGVyZV90b19jb3JuZXIpOwogICAgICAgICAgICAgIHIucmkubm9ybWFsaXplKCk7CiAgICAgICAgICAgICAgci5uaS5jb3B5KHIucmkpOwogICAgICAgICAgICAgIHIucmkuc2NhbGUoUiwgci5yaSk7CiAgICAgICAgICAgICAgci5yai5jb3B5KHJqKTsgLy8gTWFrZSByZWxhdGl2ZSB0byBib2RpZXMKCiAgICAgICAgICAgICAgci5yaS52YWRkKHhpLCByLnJpKTsKICAgICAgICAgICAgICByLnJpLnZzdWIoYmkucG9zaXRpb24sIHIucmkpOwogICAgICAgICAgICAgIHIucmoudmFkZCh4aiwgci5yaik7CiAgICAgICAgICAgICAgci5yai52c3ViKGJqLnBvc2l0aW9uLCByLnJqKTsKICAgICAgICAgICAgICB0aGlzLnJlc3VsdC5wdXNoKHIpOwogICAgICAgICAgICAgIHRoaXMuY3JlYXRlRnJpY3Rpb25FcXVhdGlvbnNGcm9tQ29udGFjdChyLCB0aGlzLmZyaWN0aW9uUmVzdWx0KTsKICAgICAgICAgICAgfQogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfQoKICAgICAgdjNwb29sLnJlbGVhc2UocmopOwogICAgICByaiA9IG51bGw7IC8vIENoZWNrIGVkZ2VzCgogICAgICBjb25zdCBlZGdlVGFuZ2VudCA9IHYzcG9vbC5nZXQoKTsKICAgICAgY29uc3QgZWRnZUNlbnRlciA9IHYzcG9vbC5nZXQoKTsKICAgICAgY29uc3QgciA9IHYzcG9vbC5nZXQoKTsgLy8gciA9IGVkZ2UgY2VudGVyIHRvIHNwaGVyZSBjZW50ZXIKCiAgICAgIGNvbnN0IG9ydGhvZ29uYWwgPSB2M3Bvb2wuZ2V0KCk7CiAgICAgIGNvbnN0IGRpc3QgPSB2M3Bvb2wuZ2V0KCk7CiAgICAgIGNvbnN0IE5zaWRlcyA9IHNpZGVzLmxlbmd0aDsKCiAgICAgIGZvciAobGV0IGogPSAwOyBqICE9PSBOc2lkZXMgJiYgIWZvdW5kOyBqKyspIHsKICAgICAgICBmb3IgKGxldCBrID0gMDsgayAhPT0gTnNpZGVzICYmICFmb3VuZDsgaysrKSB7CiAgICAgICAgICBpZiAoaiAlIDMgIT09IGsgJSAzKSB7CiAgICAgICAgICAgIC8vIEdldCBlZGdlIHRhbmdlbnQKICAgICAgICAgICAgc2lkZXNba10uY3Jvc3Moc2lkZXNbal0sIGVkZ2VUYW5nZW50KTsKICAgICAgICAgICAgZWRnZVRhbmdlbnQubm9ybWFsaXplKCk7CiAgICAgICAgICAgIHNpZGVzW2pdLnZhZGQoc2lkZXNba10sIGVkZ2VDZW50ZXIpOwogICAgICAgICAgICByLmNvcHkoeGkpOwogICAgICAgICAgICByLnZzdWIoZWRnZUNlbnRlciwgcik7CiAgICAgICAgICAgIHIudnN1Yih4aiwgcik7CiAgICAgICAgICAgIGNvbnN0IG9ydGhvbm9ybSA9IHIuZG90KGVkZ2VUYW5nZW50KTsgLy8gZGlzdGFuY2UgZnJvbSBlZGdlIGNlbnRlciB0byBzcGhlcmUgY2VudGVyIGluIHRoZSB0YW5nZW50IGRpcmVjdGlvbgoKICAgICAgICAgICAgZWRnZVRhbmdlbnQuc2NhbGUob3J0aG9ub3JtLCBvcnRob2dvbmFsKTsgLy8gVmVjdG9yIGZyb20gZWRnZSBjZW50ZXIgdG8gc3BoZXJlIGNlbnRlciBpbiB0aGUgdGFuZ2VudCBkaXJlY3Rpb24KICAgICAgICAgICAgLy8gRmluZCB0aGUgdGhpcmQgc2lkZSBvcnRob2dvbmFsIHRvIHRoaXMgb25lCgogICAgICAgICAgICBsZXQgbCA9IDA7CgogICAgICAgICAgICB3aGlsZSAobCA9PT0gaiAlIDMgfHwgbCA9PT0gayAlIDMpIHsKICAgICAgICAgICAgICBsKys7CiAgICAgICAgICAgIH0gLy8gdmVjIGZyb20gZWRnZSBjZW50ZXIgdG8gc3BoZXJlIHByb2plY3RlZCB0byB0aGUgcGxhbmUgb3J0aG9nb25hbCB0byB0aGUgZWRnZSB0YW5nZW50CgoKICAgICAgICAgICAgZGlzdC5jb3B5KHhpKTsKICAgICAgICAgICAgZGlzdC52c3ViKG9ydGhvZ29uYWwsIGRpc3QpOwogICAgICAgICAgICBkaXN0LnZzdWIoZWRnZUNlbnRlciwgZGlzdCk7CiAgICAgICAgICAgIGRpc3QudnN1Yih4aiwgZGlzdCk7IC8vIERpc3RhbmNlcyBpbiB0YW5nZW50IGRpcmVjdGlvbiBhbmQgZGlzdGFuY2UgaW4gdGhlIHBsYW5lIG9ydGhvZ29uYWwgdG8gaXQKCiAgICAgICAgICAgIGNvbnN0IHRkaXN0ID0gTWF0aC5hYnMob3J0aG9ub3JtKTsKICAgICAgICAgICAgY29uc3QgbmRpc3QgPSBkaXN0Lmxlbmd0aCgpOwoKICAgICAgICAgICAgaWYgKHRkaXN0IDwgc2lkZXNbbF0ubGVuZ3RoKCkgJiYgbmRpc3QgPCBSKSB7CiAgICAgICAgICAgICAgaWYgKGp1c3RUZXN0KSB7CiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsKICAgICAgICAgICAgICB9CgogICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTsKICAgICAgICAgICAgICBjb25zdCByZXMgPSB0aGlzLmNyZWF0ZUNvbnRhY3RFcXVhdGlvbihiaSwgYmosIHNpLCBzaiwgcnNpLCByc2opOwogICAgICAgICAgICAgIGVkZ2VDZW50ZXIudmFkZChvcnRob2dvbmFsLCByZXMucmopOyAvLyBib3ggcmoKCiAgICAgICAgICAgICAgcmVzLnJqLmNvcHkocmVzLnJqKTsKICAgICAgICAgICAgICBkaXN0Lm5lZ2F0ZShyZXMubmkpOwogICAgICAgICAgICAgIHJlcy5uaS5ub3JtYWxpemUoKTsKICAgICAgICAgICAgICByZXMucmkuY29weShyZXMucmopOwogICAgICAgICAgICAgIHJlcy5yaS52YWRkKHhqLCByZXMucmkpOwogICAgICAgICAgICAgIHJlcy5yaS52c3ViKHhpLCByZXMucmkpOwogICAgICAgICAgICAgIHJlcy5yaS5ub3JtYWxpemUoKTsKICAgICAgICAgICAgICByZXMucmkuc2NhbGUoUiwgcmVzLnJpKTsgLy8gTWFrZSByZWxhdGl2ZSB0byBib2RpZXMKCiAgICAgICAgICAgICAgcmVzLnJpLnZhZGQoeGksIHJlcy5yaSk7CiAgICAgICAgICAgICAgcmVzLnJpLnZzdWIoYmkucG9zaXRpb24sIHJlcy5yaSk7CiAgICAgICAgICAgICAgcmVzLnJqLnZhZGQoeGosIHJlcy5yaik7CiAgICAgICAgICAgICAgcmVzLnJqLnZzdWIoYmoucG9zaXRpb24sIHJlcy5yaik7CiAgICAgICAgICAgICAgdGhpcy5yZXN1bHQucHVzaChyZXMpOwogICAgICAgICAgICAgIHRoaXMuY3JlYXRlRnJpY3Rpb25FcXVhdGlvbnNGcm9tQ29udGFjdChyZXMsIHRoaXMuZnJpY3Rpb25SZXN1bHQpOwogICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9CgogICAgICB2M3Bvb2wucmVsZWFzZShlZGdlVGFuZ2VudCwgZWRnZUNlbnRlciwgciwgb3J0aG9nb25hbCwgZGlzdCk7CiAgICB9CgogICAgcGxhbmVCb3goc2ksIHNqLCB4aSwgeGosIHFpLCBxaiwgYmksIGJqLCByc2ksIHJzaiwganVzdFRlc3QpIHsKICAgICAgc2ouY29udmV4UG9seWhlZHJvblJlcHJlc2VudGF0aW9uLm1hdGVyaWFsID0gc2oubWF0ZXJpYWw7CiAgICAgIHNqLmNvbnZleFBvbHloZWRyb25SZXByZXNlbnRhdGlvbi5jb2xsaXNpb25SZXNwb25zZSA9IHNqLmNvbGxpc2lvblJlc3BvbnNlOwogICAgICBzai5jb252ZXhQb2x5aGVkcm9uUmVwcmVzZW50YXRpb24uaWQgPSBzai5pZDsKICAgICAgcmV0dXJuIHRoaXMucGxhbmVDb252ZXgoc2ksIHNqLmNvbnZleFBvbHloZWRyb25SZXByZXNlbnRhdGlvbiwgeGksIHhqLCBxaSwgcWosIGJpLCBiaiwgc2ksIHNqLCBqdXN0VGVzdCk7CiAgICB9CgogICAgY29udmV4Q29udmV4KHNpLCBzaiwgeGksIHhqLCBxaSwgcWosIGJpLCBiaiwgcnNpLCByc2osIGp1c3RUZXN0LCBmYWNlTGlzdEEsIGZhY2VMaXN0QikgewogICAgICBjb25zdCBzZXBBeGlzID0gY29udmV4Q29udmV4X3NlcEF4aXM7CgogICAgICBpZiAoeGkuZGlzdGFuY2VUbyh4aikgPiBzaS5ib3VuZGluZ1NwaGVyZVJhZGl1cyArIHNqLmJvdW5kaW5nU3BoZXJlUmFkaXVzKSB7CiAgICAgICAgcmV0dXJuOwogICAgICB9CgogICAgICBpZiAoc2kuZmluZFNlcGFyYXRpbmdBeGlzKHNqLCB4aSwgcWksIHhqLCBxaiwgc2VwQXhpcywgZmFjZUxpc3RBLCBmYWNlTGlzdEIpKSB7CiAgICAgICAgY29uc3QgcmVzID0gW107CiAgICAgICAgY29uc3QgcSA9IGNvbnZleENvbnZleF9xOwogICAgICAgIHNpLmNsaXBBZ2FpbnN0SHVsbCh4aSwgcWksIHNqLCB4aiwgcWosIHNlcEF4aXMsIC0xMDAsIDEwMCwgcmVzKTsKICAgICAgICBsZXQgbnVtQ29udGFjdHMgPSAwOwoKICAgICAgICBmb3IgKGxldCBqID0gMDsgaiAhPT0gcmVzLmxlbmd0aDsgaisrKSB7CiAgICAgICAgICBpZiAoanVzdFRlc3QpIHsKICAgICAgICAgICAgcmV0dXJuIHRydWU7CiAgICAgICAgICB9CgogICAgICAgICAgY29uc3QgciA9IHRoaXMuY3JlYXRlQ29udGFjdEVxdWF0aW9uKGJpLCBiaiwgc2ksIHNqLCByc2ksIHJzaik7CiAgICAgICAgICBjb25zdCByaSA9IHIucmk7CiAgICAgICAgICBjb25zdCByaiA9IHIucmo7CiAgICAgICAgICBzZXBBeGlzLm5lZ2F0ZShyLm5pKTsKICAgICAgICAgIHJlc1tqXS5ub3JtYWwubmVnYXRlKHEpOwogICAgICAgICAgcS5zY2FsZShyZXNbal0uZGVwdGgsIHEpOwogICAgICAgICAgcmVzW2pdLnBvaW50LnZhZGQocSwgcmkpOwogICAgICAgICAgcmouY29weShyZXNbal0ucG9pbnQpOyAvLyBDb250YWN0IHBvaW50cyBhcmUgaW4gd29ybGQgY29vcmRpbmF0ZXMuIFRyYW5zZm9ybSBiYWNrIHRvIHJlbGF0aXZlCgogICAgICAgICAgcmkudnN1Yih4aSwgcmkpOwogICAgICAgICAgcmoudnN1Yih4aiwgcmopOyAvLyBNYWtlIHJlbGF0aXZlIHRvIGJvZGllcwoKICAgICAgICAgIHJpLnZhZGQoeGksIHJpKTsKICAgICAgICAgIHJpLnZzdWIoYmkucG9zaXRpb24sIHJpKTsKICAgICAgICAgIHJqLnZhZGQoeGosIHJqKTsKICAgICAgICAgIHJqLnZzdWIoYmoucG9zaXRpb24sIHJqKTsKICAgICAgICAgIHRoaXMucmVzdWx0LnB1c2gocik7CiAgICAgICAgICBudW1Db250YWN0cysrOwoKICAgICAgICAgIGlmICghdGhpcy5lbmFibGVGcmljdGlvblJlZHVjdGlvbikgewogICAgICAgICAgICB0aGlzLmNyZWF0ZUZyaWN0aW9uRXF1YXRpb25zRnJvbUNvbnRhY3QociwgdGhpcy5mcmljdGlvblJlc3VsdCk7CiAgICAgICAgICB9CiAgICAgICAgfQoKICAgICAgICBpZiAodGhpcy5lbmFibGVGcmljdGlvblJlZHVjdGlvbiAmJiBudW1Db250YWN0cykgewogICAgICAgICAgdGhpcy5jcmVhdGVGcmljdGlvbkZyb21BdmVyYWdlKG51bUNvbnRhY3RzKTsKICAgICAgICB9CiAgICAgIH0KICAgIH0KCiAgICBzcGhlcmVDb252ZXgoc2ksIHNqLCB4aSwgeGosIHFpLCBxaiwgYmksIGJqLCByc2ksIHJzaiwganVzdFRlc3QpIHsKICAgICAgY29uc3QgdjNwb29sID0gdGhpcy52M3Bvb2w7CiAgICAgIHhpLnZzdWIoeGosIGNvbnZleF90b19zcGhlcmUpOwogICAgICBjb25zdCBub3JtYWxzID0gc2ouZmFjZU5vcm1hbHM7CiAgICAgIGNvbnN0IGZhY2VzID0gc2ouZmFjZXM7CiAgICAgIGNvbnN0IHZlcnRzID0gc2oudmVydGljZXM7CiAgICAgIGNvbnN0IFIgPSBzaS5yYWRpdXM7CiAgICAgIC8vICAgICByZXR1cm47CiAgICAgIC8vIH0KCiAgICAgIGxldCBmb3VuZCA9IGZhbHNlOyAvLyBDaGVjayBjb3JuZXJzCgogICAgICBmb3IgKGxldCBpID0gMDsgaSAhPT0gdmVydHMubGVuZ3RoOyBpKyspIHsKICAgICAgICBjb25zdCB2ID0gdmVydHNbaV07IC8vIFdvcmxkIHBvc2l0aW9uIG9mIGNvcm5lcgoKICAgICAgICBjb25zdCB3b3JsZENvcm5lciA9IHNwaGVyZUNvbnZleF93b3JsZENvcm5lcjsKICAgICAgICBxai52bXVsdCh2LCB3b3JsZENvcm5lcik7CiAgICAgICAgeGoudmFkZCh3b3JsZENvcm5lciwgd29ybGRDb3JuZXIpOwogICAgICAgIGNvbnN0IHNwaGVyZV90b19jb3JuZXIgPSBzcGhlcmVDb252ZXhfc3BoZXJlVG9Db3JuZXI7CiAgICAgICAgd29ybGRDb3JuZXIudnN1Yih4aSwgc3BoZXJlX3RvX2Nvcm5lcik7CgogICAgICAgIGlmIChzcGhlcmVfdG9fY29ybmVyLmxlbmd0aFNxdWFyZWQoKSA8IFIgKiBSKSB7CiAgICAgICAgICBpZiAoanVzdFRlc3QpIHsKICAgICAgICAgICAgcmV0dXJuIHRydWU7CiAgICAgICAgICB9CgogICAgICAgICAgZm91bmQgPSB0cnVlOwogICAgICAgICAgY29uc3QgciA9IHRoaXMuY3JlYXRlQ29udGFjdEVxdWF0aW9uKGJpLCBiaiwgc2ksIHNqLCByc2ksIHJzaik7CiAgICAgICAgICByLnJpLmNvcHkoc3BoZXJlX3RvX2Nvcm5lcik7CiAgICAgICAgICByLnJpLm5vcm1hbGl6ZSgpOwogICAgICAgICAgci5uaS5jb3B5KHIucmkpOwogICAgICAgICAgci5yaS5zY2FsZShSLCByLnJpKTsKICAgICAgICAgIHdvcmxkQ29ybmVyLnZzdWIoeGosIHIucmopOyAvLyBTaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIGJvZHkuCgogICAgICAgICAgci5yaS52YWRkKHhpLCByLnJpKTsKICAgICAgICAgIHIucmkudnN1YihiaS5wb3NpdGlvbiwgci5yaSk7IC8vIFNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgYm9keS4KCiAgICAgICAgICByLnJqLnZhZGQoeGosIHIucmopOwogICAgICAgICAgci5yai52c3ViKGJqLnBvc2l0aW9uLCByLnJqKTsKICAgICAgICAgIHRoaXMucmVzdWx0LnB1c2gocik7CiAgICAgICAgICB0aGlzLmNyZWF0ZUZyaWN0aW9uRXF1YXRpb25zRnJvbUNvbnRhY3QociwgdGhpcy5mcmljdGlvblJlc3VsdCk7CiAgICAgICAgICByZXR1cm47CiAgICAgICAgfQogICAgICB9IC8vIENoZWNrIHNpZGUgKHBsYW5lKSBpbnRlcnNlY3Rpb25zCgoKICAgICAgZm9yIChsZXQgaSA9IDAsIG5mYWNlcyA9IGZhY2VzLmxlbmd0aDsgaSAhPT0gbmZhY2VzICYmIGZvdW5kID09PSBmYWxzZTsgaSsrKSB7CiAgICAgICAgY29uc3Qgbm9ybWFsID0gbm9ybWFsc1tpXTsKICAgICAgICBjb25zdCBmYWNlID0gZmFjZXNbaV07IC8vIEdldCB3b3JsZC10cmFuc2Zvcm1lZCBub3JtYWwgb2YgdGhlIGZhY2UKCiAgICAgICAgY29uc3Qgd29ybGROb3JtYWwgPSBzcGhlcmVDb252ZXhfd29ybGROb3JtYWw7CiAgICAgICAgcWoudm11bHQobm9ybWFsLCB3b3JsZE5vcm1hbCk7IC8vIEdldCBhIHdvcmxkIHZlcnRleCBmcm9tIHRoZSBmYWNlCgogICAgICAgIGNvbnN0IHdvcmxkUG9pbnQgPSBzcGhlcmVDb252ZXhfd29ybGRQb2ludDsKICAgICAgICBxai52bXVsdCh2ZXJ0c1tmYWNlWzBdXSwgd29ybGRQb2ludCk7CiAgICAgICAgd29ybGRQb2ludC52YWRkKHhqLCB3b3JsZFBvaW50KTsgLy8gR2V0IGEgcG9pbnQgb24gdGhlIHNwaGVyZSwgY2xvc2VzdCB0byB0aGUgZmFjZSBub3JtYWwKCiAgICAgICAgY29uc3Qgd29ybGRTcGhlcmVQb2ludENsb3Nlc3RUb1BsYW5lID0gc3BoZXJlQ29udmV4X3dvcmxkU3BoZXJlUG9pbnRDbG9zZXN0VG9QbGFuZTsKICAgICAgICB3b3JsZE5vcm1hbC5zY2FsZSgtUiwgd29ybGRTcGhlcmVQb2ludENsb3Nlc3RUb1BsYW5lKTsKICAgICAgICB4aS52YWRkKHdvcmxkU3BoZXJlUG9pbnRDbG9zZXN0VG9QbGFuZSwgd29ybGRTcGhlcmVQb2ludENsb3Nlc3RUb1BsYW5lKTsgLy8gVmVjdG9yIGZyb20gYSBmYWNlIHBvaW50IHRvIHRoZSBjbG9zZXN0IHBvaW50IG9uIHRoZSBzcGhlcmUKCiAgICAgICAgY29uc3QgcGVuZXRyYXRpb25WZWMgPSBzcGhlcmVDb252ZXhfcGVuZXRyYXRpb25WZWM7CiAgICAgICAgd29ybGRTcGhlcmVQb2ludENsb3Nlc3RUb1BsYW5lLnZzdWIod29ybGRQb2ludCwgcGVuZXRyYXRpb25WZWMpOyAvLyBUaGUgcGVuZXRyYXRpb24uIE5lZ2F0aXZlIHZhbHVlIG1lYW5zIG92ZXJsYXAuCgogICAgICAgIGNvbnN0IHBlbmV0cmF0aW9uID0gcGVuZXRyYXRpb25WZWMuZG90KHdvcmxkTm9ybWFsKTsKICAgICAgICBjb25zdCB3b3JsZFBvaW50VG9TcGhlcmUgPSBzcGhlcmVDb252ZXhfc3BoZXJlVG9Xb3JsZFBvaW50OwogICAgICAgIHhpLnZzdWIod29ybGRQb2ludCwgd29ybGRQb2ludFRvU3BoZXJlKTsKCiAgICAgICAgaWYgKHBlbmV0cmF0aW9uIDwgMCAmJiB3b3JsZFBvaW50VG9TcGhlcmUuZG90KHdvcmxkTm9ybWFsKSA+IDApIHsKICAgICAgICAgIC8vIEludGVyc2VjdHMgcGxhbmUuIE5vdyBjaGVjayBpZiB0aGUgc3BoZXJlIGlzIGluc2lkZSB0aGUgZmFjZSBwb2x5Z29uCiAgICAgICAgICBjb25zdCBmYWNlVmVydHMgPSBbXTsgLy8gRmFjZSB2ZXJ0aWNlcywgaW4gd29ybGQgY29vcmRzCgogICAgICAgICAgZm9yIChsZXQgaiA9IDAsIE52ZXJ0cyA9IGZhY2UubGVuZ3RoOyBqICE9PSBOdmVydHM7IGorKykgewogICAgICAgICAgICBjb25zdCB3b3JsZFZlcnRleCA9IHYzcG9vbC5nZXQoKTsKICAgICAgICAgICAgcWoudm11bHQodmVydHNbZmFjZVtqXV0sIHdvcmxkVmVydGV4KTsKICAgICAgICAgICAgeGoudmFkZCh3b3JsZFZlcnRleCwgd29ybGRWZXJ0ZXgpOwogICAgICAgICAgICBmYWNlVmVydHMucHVzaCh3b3JsZFZlcnRleCk7CiAgICAgICAgICB9CgogICAgICAgICAgaWYgKHBvaW50SW5Qb2x5Z29uKGZhY2VWZXJ0cywgd29ybGROb3JtYWwsIHhpKSkgewogICAgICAgICAgICAvLyBJcyB0aGUgc3BoZXJlIGNlbnRlciBpbiB0aGUgZmFjZSBwb2x5Z29uPwogICAgICAgICAgICBpZiAoanVzdFRlc3QpIHsKICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsKICAgICAgICAgICAgfQoKICAgICAgICAgICAgZm91bmQgPSB0cnVlOwogICAgICAgICAgICBjb25zdCByID0gdGhpcy5jcmVhdGVDb250YWN0RXF1YXRpb24oYmksIGJqLCBzaSwgc2osIHJzaSwgcnNqKTsKICAgICAgICAgICAgd29ybGROb3JtYWwuc2NhbGUoLVIsIHIucmkpOyAvLyBDb250YWN0IG9mZnNldCwgZnJvbSBzcGhlcmUgY2VudGVyIHRvIGNvbnRhY3QKCiAgICAgICAgICAgIHdvcmxkTm9ybWFsLm5lZ2F0ZShyLm5pKTsgLy8gTm9ybWFsIHBvaW50aW5nIG91dCBvZiBzcGhlcmUKCiAgICAgICAgICAgIGNvbnN0IHBlbmV0cmF0aW9uVmVjMiA9IHYzcG9vbC5nZXQoKTsKICAgICAgICAgICAgd29ybGROb3JtYWwuc2NhbGUoLXBlbmV0cmF0aW9uLCBwZW5ldHJhdGlvblZlYzIpOwogICAgICAgICAgICBjb25zdCBwZW5ldHJhdGlvblNwaGVyZVBvaW50ID0gdjNwb29sLmdldCgpOwogICAgICAgICAgICB3b3JsZE5vcm1hbC5zY2FsZSgtUiwgcGVuZXRyYXRpb25TcGhlcmVQb2ludCk7IC8veGkudnN1Yih4aikudmFkZChwZW5ldHJhdGlvblNwaGVyZVBvaW50KS52YWRkKHBlbmV0cmF0aW9uVmVjMiAsIHIucmopOwoKICAgICAgICAgICAgeGkudnN1Yih4aiwgci5yaik7CiAgICAgICAgICAgIHIucmoudmFkZChwZW5ldHJhdGlvblNwaGVyZVBvaW50LCByLnJqKTsKICAgICAgICAgICAgci5yai52YWRkKHBlbmV0cmF0aW9uVmVjMiwgci5yaik7IC8vIFNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgYm9keS4KCiAgICAgICAgICAgIHIucmoudmFkZCh4aiwgci5yaik7CiAgICAgICAgICAgIHIucmoudnN1Yihiai5wb3NpdGlvbiwgci5yaik7IC8vIFNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgYm9keS4KCiAgICAgICAgICAgIHIucmkudmFkZCh4aSwgci5yaSk7CiAgICAgICAgICAgIHIucmkudnN1YihiaS5wb3NpdGlvbiwgci5yaSk7CiAgICAgICAgICAgIHYzcG9vbC5yZWxlYXNlKHBlbmV0cmF0aW9uVmVjMik7CiAgICAgICAgICAgIHYzcG9vbC5yZWxlYXNlKHBlbmV0cmF0aW9uU3BoZXJlUG9pbnQpOwogICAgICAgICAgICB0aGlzLnJlc3VsdC5wdXNoKHIpOwogICAgICAgICAgICB0aGlzLmNyZWF0ZUZyaWN0aW9uRXF1YXRpb25zRnJvbUNvbnRhY3QociwgdGhpcy5mcmljdGlvblJlc3VsdCk7IC8vIFJlbGVhc2Ugd29ybGQgdmVydGljZXMKCiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBOZmFjZXZlcnRzID0gZmFjZVZlcnRzLmxlbmd0aDsgaiAhPT0gTmZhY2V2ZXJ0czsgaisrKSB7CiAgICAgICAgICAgICAgdjNwb29sLnJlbGVhc2UoZmFjZVZlcnRzW2pdKTsKICAgICAgICAgICAgfQoKICAgICAgICAgICAgcmV0dXJuOyAvLyBXZSBvbmx5IGV4cGVjdCAqb25lKiBmYWNlIGNvbnRhY3QKICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgIC8vIEVkZ2U/CiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqICE9PSBmYWNlLmxlbmd0aDsgaisrKSB7CiAgICAgICAgICAgICAgLy8gR2V0IHR3byB3b3JsZCB0cmFuc2Zvcm1lZCB2ZXJ0aWNlcwogICAgICAgICAgICAgIGNvbnN0IHYxID0gdjNwb29sLmdldCgpOwogICAgICAgICAgICAgIGNvbnN0IHYyID0gdjNwb29sLmdldCgpOwogICAgICAgICAgICAgIHFqLnZtdWx0KHZlcnRzW2ZhY2VbKGogKyAxKSAlIGZhY2UubGVuZ3RoXV0sIHYxKTsKICAgICAgICAgICAgICBxai52bXVsdCh2ZXJ0c1tmYWNlWyhqICsgMikgJSBmYWNlLmxlbmd0aF1dLCB2Mik7CiAgICAgICAgICAgICAgeGoudmFkZCh2MSwgdjEpOwogICAgICAgICAgICAgIHhqLnZhZGQodjIsIHYyKTsgLy8gQ29uc3RydWN0IGVkZ2UgdmVjdG9yCgogICAgICAgICAgICAgIGNvbnN0IGVkZ2UgPSBzcGhlcmVDb252ZXhfZWRnZTsKICAgICAgICAgICAgICB2Mi52c3ViKHYxLCBlZGdlKTsgLy8gQ29uc3RydWN0IHRoZSBzYW1lIHZlY3RvciwgYnV0IG5vcm1hbGl6ZWQKCiAgICAgICAgICAgICAgY29uc3QgZWRnZVVuaXQgPSBzcGhlcmVDb252ZXhfZWRnZVVuaXQ7CiAgICAgICAgICAgICAgZWRnZS51bml0KGVkZ2VVbml0KTsgLy8gcCBpcyB4aSBwcm9qZWN0ZWQgb250byB0aGUgZWRnZQoKICAgICAgICAgICAgICBjb25zdCBwID0gdjNwb29sLmdldCgpOwogICAgICAgICAgICAgIGNvbnN0IHYxX3RvX3hpID0gdjNwb29sLmdldCgpOwogICAgICAgICAgICAgIHhpLnZzdWIodjEsIHYxX3RvX3hpKTsKICAgICAgICAgICAgICBjb25zdCBkb3QgPSB2MV90b194aS5kb3QoZWRnZVVuaXQpOwogICAgICAgICAgICAgIGVkZ2VVbml0LnNjYWxlKGRvdCwgcCk7CiAgICAgICAgICAgICAgcC52YWRkKHYxLCBwKTsgLy8gQ29tcHV0ZSBhIHZlY3RvciBmcm9tIHAgdG8gdGhlIGNlbnRlciBvZiB0aGUgc3BoZXJlCgogICAgICAgICAgICAgIGNvbnN0IHhpX3RvX3AgPSB2M3Bvb2wuZ2V0KCk7CiAgICAgICAgICAgICAgcC52c3ViKHhpLCB4aV90b19wKTsgLy8gQ29sbGlzaW9uIGlmIHRoZSBlZGdlLXNwaGVyZSBkaXN0YW5jZSBpcyBsZXNzIHRoYW4gdGhlIHJhZGl1cwogICAgICAgICAgICAgIC8vIEFORCBpZiBwIGlzIGluIGJldHdlZW4gdjEgYW5kIHYyCgogICAgICAgICAgICAgIGlmIChkb3QgPiAwICYmIGRvdCAqIGRvdCA8IGVkZ2UubGVuZ3RoU3F1YXJlZCgpICYmIHhpX3RvX3AubGVuZ3RoU3F1YXJlZCgpIDwgUiAqIFIpIHsKICAgICAgICAgICAgICAgIC8vIENvbGxpc2lvbiBpZiB0aGUgZWRnZS1zcGhlcmUgZGlzdGFuY2UgaXMgbGVzcyB0aGFuIHRoZSByYWRpdXMKICAgICAgICAgICAgICAgIC8vIEVkZ2UgY29udGFjdCEKICAgICAgICAgICAgICAgIGlmIChqdXN0VGVzdCkgewogICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsKICAgICAgICAgICAgICAgIH0KCiAgICAgICAgICAgICAgICBjb25zdCByID0gdGhpcy5jcmVhdGVDb250YWN0RXF1YXRpb24oYmksIGJqLCBzaSwgc2osIHJzaSwgcnNqKTsKICAgICAgICAgICAgICAgIHAudnN1Yih4aiwgci5yaik7CiAgICAgICAgICAgICAgICBwLnZzdWIoeGksIHIubmkpOwogICAgICAgICAgICAgICAgci5uaS5ub3JtYWxpemUoKTsKICAgICAgICAgICAgICAgIHIubmkuc2NhbGUoUiwgci5yaSk7IC8vIFNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgYm9keS4KCiAgICAgICAgICAgICAgICByLnJqLnZhZGQoeGosIHIucmopOwogICAgICAgICAgICAgICAgci5yai52c3ViKGJqLnBvc2l0aW9uLCByLnJqKTsgLy8gU2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSBib2R5LgoKICAgICAgICAgICAgICAgIHIucmkudmFkZCh4aSwgci5yaSk7CiAgICAgICAgICAgICAgICByLnJpLnZzdWIoYmkucG9zaXRpb24sIHIucmkpOwogICAgICAgICAgICAgICAgdGhpcy5yZXN1bHQucHVzaChyKTsKICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlRnJpY3Rpb25FcXVhdGlvbnNGcm9tQ29udGFjdChyLCB0aGlzLmZyaWN0aW9uUmVzdWx0KTsgLy8gUmVsZWFzZSB3b3JsZCB2ZXJ0aWNlcwoKICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBOZmFjZXZlcnRzID0gZmFjZVZlcnRzLmxlbmd0aDsgaiAhPT0gTmZhY2V2ZXJ0czsgaisrKSB7CiAgICAgICAgICAgICAgICAgIHYzcG9vbC5yZWxlYXNlKGZhY2VWZXJ0c1tqXSk7CiAgICAgICAgICAgICAgICB9CgogICAgICAgICAgICAgICAgdjNwb29sLnJlbGVhc2UodjEpOwogICAgICAgICAgICAgICAgdjNwb29sLnJlbGVhc2UodjIpOwogICAgICAgICAgICAgICAgdjNwb29sLnJlbGVhc2UocCk7CiAgICAgICAgICAgICAgICB2M3Bvb2wucmVsZWFzZSh4aV90b19wKTsKICAgICAgICAgICAgICAgIHYzcG9vbC5yZWxlYXNlKHYxX3RvX3hpKTsKICAgICAgICAgICAgICAgIHJldHVybjsKICAgICAgICAgICAgICB9CgogICAgICAgICAgICAgIHYzcG9vbC5yZWxlYXNlKHYxKTsKICAgICAgICAgICAgICB2M3Bvb2wucmVsZWFzZSh2Mik7CiAgICAgICAgICAgICAgdjNwb29sLnJlbGVhc2UocCk7CiAgICAgICAgICAgICAgdjNwb29sLnJlbGVhc2UoeGlfdG9fcCk7CiAgICAgICAgICAgICAgdjNwb29sLnJlbGVhc2UodjFfdG9feGkpOwogICAgICAgICAgICB9CiAgICAgICAgICB9IC8vIFJlbGVhc2Ugd29ybGQgdmVydGljZXMKCgogICAgICAgICAgZm9yIChsZXQgaiA9IDAsIE5mYWNldmVydHMgPSBmYWNlVmVydHMubGVuZ3RoOyBqICE9PSBOZmFjZXZlcnRzOyBqKyspIHsKICAgICAgICAgICAgdjNwb29sLnJlbGVhc2UoZmFjZVZlcnRzW2pdKTsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KICAgIH0KCiAgICBwbGFuZUNvbnZleChwbGFuZVNoYXBlLCBjb252ZXhTaGFwZSwgcGxhbmVQb3NpdGlvbiwgY29udmV4UG9zaXRpb24sIHBsYW5lUXVhdCwgY29udmV4UXVhdCwgcGxhbmVCb2R5LCBjb252ZXhCb2R5LCBzaSwgc2osIGp1c3RUZXN0KSB7CiAgICAgIC8vIFNpbXBseSByZXR1cm4gdGhlIHBvaW50cyBiZWhpbmQgdGhlIHBsYW5lLgogICAgICBjb25zdCB3b3JsZFZlcnRleCA9IHBsYW5lQ29udmV4X3Y7CiAgICAgIGNvbnN0IHdvcmxkTm9ybWFsID0gcGxhbmVDb252ZXhfbm9ybWFsOwogICAgICB3b3JsZE5vcm1hbC5zZXQoMCwgMCwgMSk7CiAgICAgIHBsYW5lUXVhdC52bXVsdCh3b3JsZE5vcm1hbCwgd29ybGROb3JtYWwpOyAvLyBUdXJuIG5vcm1hbCBhY2NvcmRpbmcgdG8gcGxhbmUgb3JpZW50YXRpb24KCiAgICAgIGxldCBudW1Db250YWN0cyA9IDA7CiAgICAgIGNvbnN0IHJlbHBvcyA9IHBsYW5lQ29udmV4X3JlbHBvczsKCiAgICAgIGZvciAobGV0IGkgPSAwOyBpICE9PSBjb252ZXhTaGFwZS52ZXJ0aWNlcy5sZW5ndGg7IGkrKykgewogICAgICAgIC8vIEdldCB3b3JsZCBjb252ZXggdmVydGV4CiAgICAgICAgd29ybGRWZXJ0ZXguY29weShjb252ZXhTaGFwZS52ZXJ0aWNlc1tpXSk7CiAgICAgICAgY29udmV4UXVhdC52bXVsdCh3b3JsZFZlcnRleCwgd29ybGRWZXJ0ZXgpOwogICAgICAgIGNvbnZleFBvc2l0aW9uLnZhZGQod29ybGRWZXJ0ZXgsIHdvcmxkVmVydGV4KTsKICAgICAgICB3b3JsZFZlcnRleC52c3ViKHBsYW5lUG9zaXRpb24sIHJlbHBvcyk7CiAgICAgICAgY29uc3QgZG90ID0gd29ybGROb3JtYWwuZG90KHJlbHBvcyk7CgogICAgICAgIGlmIChkb3QgPD0gMC4wKSB7CiAgICAgICAgICBpZiAoanVzdFRlc3QpIHsKICAgICAgICAgICAgcmV0dXJuIHRydWU7CiAgICAgICAgICB9CgogICAgICAgICAgY29uc3QgciA9IHRoaXMuY3JlYXRlQ29udGFjdEVxdWF0aW9uKHBsYW5lQm9keSwgY29udmV4Qm9keSwgcGxhbmVTaGFwZSwgY29udmV4U2hhcGUsIHNpLCBzaik7IC8vIEdldCB2ZXJ0ZXggcG9zaXRpb24gcHJvamVjdGVkIG9uIHBsYW5lCgogICAgICAgICAgY29uc3QgcHJvamVjdGVkID0gcGxhbmVDb252ZXhfcHJvamVjdGVkOwogICAgICAgICAgd29ybGROb3JtYWwuc2NhbGUod29ybGROb3JtYWwuZG90KHJlbHBvcyksIHByb2plY3RlZCk7CiAgICAgICAgICB3b3JsZFZlcnRleC52c3ViKHByb2plY3RlZCwgcHJvamVjdGVkKTsKICAgICAgICAgIHByb2plY3RlZC52c3ViKHBsYW5lUG9zaXRpb24sIHIucmkpOyAvLyBGcm9tIHBsYW5lIHRvIHZlcnRleCBwcm9qZWN0ZWQgb24gcGxhbmUKCiAgICAgICAgICByLm5pLmNvcHkod29ybGROb3JtYWwpOyAvLyBDb250YWN0IG5vcm1hbCBpcyB0aGUgcGxhbmUgbm9ybWFsIG91dCBmcm9tIHBsYW5lCiAgICAgICAgICAvLyByaiBpcyBub3cganVzdCB0aGUgdmVjdG9yIGZyb20gdGhlIGNvbnZleCBjZW50ZXIgdG8gdGhlIHZlcnRleAoKICAgICAgICAgIHdvcmxkVmVydGV4LnZzdWIoY29udmV4UG9zaXRpb24sIHIucmopOyAvLyBNYWtlIGl0IHJlbGF0aXZlIHRvIHRoZSBib2R5CgogICAgICAgICAgci5yaS52YWRkKHBsYW5lUG9zaXRpb24sIHIucmkpOwogICAgICAgICAgci5yaS52c3ViKHBsYW5lQm9keS5wb3NpdGlvbiwgci5yaSk7CiAgICAgICAgICByLnJqLnZhZGQoY29udmV4UG9zaXRpb24sIHIucmopOwogICAgICAgICAgci5yai52c3ViKGNvbnZleEJvZHkucG9zaXRpb24sIHIucmopOwogICAgICAgICAgdGhpcy5yZXN1bHQucHVzaChyKTsKICAgICAgICAgIG51bUNvbnRhY3RzKys7CgogICAgICAgICAgaWYgKCF0aGlzLmVuYWJsZUZyaWN0aW9uUmVkdWN0aW9uKSB7CiAgICAgICAgICAgIHRoaXMuY3JlYXRlRnJpY3Rpb25FcXVhdGlvbnNGcm9tQ29udGFjdChyLCB0aGlzLmZyaWN0aW9uUmVzdWx0KTsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KCiAgICAgIGlmICh0aGlzLmVuYWJsZUZyaWN0aW9uUmVkdWN0aW9uICYmIG51bUNvbnRhY3RzKSB7CiAgICAgICAgdGhpcy5jcmVhdGVGcmljdGlvbkZyb21BdmVyYWdlKG51bUNvbnRhY3RzKTsKICAgICAgfQogICAgfQoKICAgIGJveENvbnZleChzaSwgc2osIHhpLCB4aiwgcWksIHFqLCBiaSwgYmosIHJzaSwgcnNqLCBqdXN0VGVzdCkgewogICAgICBzaS5jb252ZXhQb2x5aGVkcm9uUmVwcmVzZW50YXRpb24ubWF0ZXJpYWwgPSBzaS5tYXRlcmlhbDsKICAgICAgc2kuY29udmV4UG9seWhlZHJvblJlcHJlc2VudGF0aW9uLmNvbGxpc2lvblJlc3BvbnNlID0gc2kuY29sbGlzaW9uUmVzcG9uc2U7CiAgICAgIHJldHVybiB0aGlzLmNvbnZleENvbnZleChzaS5jb252ZXhQb2x5aGVkcm9uUmVwcmVzZW50YXRpb24sIHNqLCB4aSwgeGosIHFpLCBxaiwgYmksIGJqLCBzaSwgc2osIGp1c3RUZXN0KTsKICAgIH0KCiAgICBzcGhlcmVIZWlnaHRmaWVsZChzcGhlcmVTaGFwZSwgaGZTaGFwZSwgc3BoZXJlUG9zLCBoZlBvcywgc3BoZXJlUXVhdCwgaGZRdWF0LCBzcGhlcmVCb2R5LCBoZkJvZHksIHJzaSwgcnNqLCBqdXN0VGVzdCkgewogICAgICBjb25zdCBkYXRhID0gaGZTaGFwZS5kYXRhOwogICAgICBjb25zdCByYWRpdXMgPSBzcGhlcmVTaGFwZS5yYWRpdXM7CiAgICAgIGNvbnN0IHcgPSBoZlNoYXBlLmVsZW1lbnRTaXplOwogICAgICBjb25zdCB3b3JsZFBpbGxhck9mZnNldCA9IHNwaGVyZUhlaWdodGZpZWxkX3RtcDI7IC8vIEdldCBzcGhlcmUgcG9zaXRpb24gdG8gaGVpZ2h0ZmllbGQgbG9jYWwhCgogICAgICBjb25zdCBsb2NhbFNwaGVyZVBvcyA9IHNwaGVyZUhlaWdodGZpZWxkX3RtcDE7CiAgICAgIFRyYW5zZm9ybS5wb2ludFRvTG9jYWxGcmFtZShoZlBvcywgaGZRdWF0LCBzcGhlcmVQb3MsIGxvY2FsU3BoZXJlUG9zKTsgLy8gR2V0IHRoZSBpbmRleCBvZiB0aGUgZGF0YSBwb2ludHMgdG8gdGVzdCBhZ2FpbnN0CgogICAgICBsZXQgaU1pblggPSBNYXRoLmZsb29yKChsb2NhbFNwaGVyZVBvcy54IC0gcmFkaXVzKSAvIHcpIC0gMTsKICAgICAgbGV0IGlNYXhYID0gTWF0aC5jZWlsKChsb2NhbFNwaGVyZVBvcy54ICsgcmFkaXVzKSAvIHcpICsgMTsKICAgICAgbGV0IGlNaW5ZID0gTWF0aC5mbG9vcigobG9jYWxTcGhlcmVQb3MueSAtIHJhZGl1cykgLyB3KSAtIDE7CiAgICAgIGxldCBpTWF4WSA9IE1hdGguY2VpbCgobG9jYWxTcGhlcmVQb3MueSArIHJhZGl1cykgLyB3KSArIDE7IC8vIEJhaWwgb3V0IGlmIHdlIGFyZSBvdXQgb2YgdGhlIHRlcnJhaW4KCiAgICAgIGlmIChpTWF4WCA8IDAgfHwgaU1heFkgPCAwIHx8IGlNaW5YID4gZGF0YS5sZW5ndGggfHwgaU1pblkgPiBkYXRhWzBdLmxlbmd0aCkgewogICAgICAgIHJldHVybjsKICAgICAgfSAvLyBDbGFtcCBpbmRleCB0byBlZGdlcwoKCiAgICAgIGlmIChpTWluWCA8IDApIHsKICAgICAgICBpTWluWCA9IDA7CiAgICAgIH0KCiAgICAgIGlmIChpTWF4WCA8IDApIHsKICAgICAgICBpTWF4WCA9IDA7CiAgICAgIH0KCiAgICAgIGlmIChpTWluWSA8IDApIHsKICAgICAgICBpTWluWSA9IDA7CiAgICAgIH0KCiAgICAgIGlmIChpTWF4WSA8IDApIHsKICAgICAgICBpTWF4WSA9IDA7CiAgICAgIH0KCiAgICAgIGlmIChpTWluWCA+PSBkYXRhLmxlbmd0aCkgewogICAgICAgIGlNaW5YID0gZGF0YS5sZW5ndGggLSAxOwogICAgICB9CgogICAgICBpZiAoaU1heFggPj0gZGF0YS5sZW5ndGgpIHsKICAgICAgICBpTWF4WCA9IGRhdGEubGVuZ3RoIC0gMTsKICAgICAgfQoKICAgICAgaWYgKGlNYXhZID49IGRhdGFbMF0ubGVuZ3RoKSB7CiAgICAgICAgaU1heFkgPSBkYXRhWzBdLmxlbmd0aCAtIDE7CiAgICAgIH0KCiAgICAgIGlmIChpTWluWSA+PSBkYXRhWzBdLmxlbmd0aCkgewogICAgICAgIGlNaW5ZID0gZGF0YVswXS5sZW5ndGggLSAxOwogICAgICB9CgogICAgICBjb25zdCBtaW5NYXggPSBbXTsKICAgICAgaGZTaGFwZS5nZXRSZWN0TWluTWF4KGlNaW5YLCBpTWluWSwgaU1heFgsIGlNYXhZLCBtaW5NYXgpOwogICAgICBjb25zdCBtaW4gPSBtaW5NYXhbMF07CiAgICAgIGNvbnN0IG1heCA9IG1pbk1heFsxXTsgLy8gQmFpbCBvdXQgaWYgd2UgY2FuJ3QgdG91Y2ggdGhlIGJvdW5kaW5nIGhlaWdodCBib3gKCiAgICAgIGlmIChsb2NhbFNwaGVyZVBvcy56IC0gcmFkaXVzID4gbWF4IHx8IGxvY2FsU3BoZXJlUG9zLnogKyByYWRpdXMgPCBtaW4pIHsKICAgICAgICByZXR1cm47CiAgICAgIH0KCiAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMucmVzdWx0OwoKICAgICAgZm9yIChsZXQgaSA9IGlNaW5YOyBpIDwgaU1heFg7IGkrKykgewogICAgICAgIGZvciAobGV0IGogPSBpTWluWTsgaiA8IGlNYXhZOyBqKyspIHsKICAgICAgICAgIGNvbnN0IG51bUNvbnRhY3RzQmVmb3JlID0gcmVzdWx0Lmxlbmd0aDsKICAgICAgICAgIGxldCBpbnRlcnNlY3RpbmcgPSBmYWxzZTsgLy8gTG93ZXIgdHJpYW5nbGUKCiAgICAgICAgICBoZlNoYXBlLmdldENvbnZleFRyaWFuZ2xlUGlsbGFyKGksIGosIGZhbHNlKTsKICAgICAgICAgIFRyYW5zZm9ybS5wb2ludFRvV29ybGRGcmFtZShoZlBvcywgaGZRdWF0LCBoZlNoYXBlLnBpbGxhck9mZnNldCwgd29ybGRQaWxsYXJPZmZzZXQpOwoKICAgICAgICAgIGlmIChzcGhlcmVQb3MuZGlzdGFuY2VUbyh3b3JsZFBpbGxhck9mZnNldCkgPCBoZlNoYXBlLnBpbGxhckNvbnZleC5ib3VuZGluZ1NwaGVyZVJhZGl1cyArIHNwaGVyZVNoYXBlLmJvdW5kaW5nU3BoZXJlUmFkaXVzKSB7CiAgICAgICAgICAgIGludGVyc2VjdGluZyA9IHRoaXMuc3BoZXJlQ29udmV4KHNwaGVyZVNoYXBlLCBoZlNoYXBlLnBpbGxhckNvbnZleCwgc3BoZXJlUG9zLCB3b3JsZFBpbGxhck9mZnNldCwgc3BoZXJlUXVhdCwgaGZRdWF0LCBzcGhlcmVCb2R5LCBoZkJvZHksIHNwaGVyZVNoYXBlLCBoZlNoYXBlLCBqdXN0VGVzdCk7CiAgICAgICAgICB9CgogICAgICAgICAgaWYgKGp1c3RUZXN0ICYmIGludGVyc2VjdGluZykgewogICAgICAgICAgICByZXR1cm4gdHJ1ZTsKICAgICAgICAgIH0gLy8gVXBwZXIgdHJpYW5nbGUKCgogICAgICAgICAgaGZTaGFwZS5nZXRDb252ZXhUcmlhbmdsZVBpbGxhcihpLCBqLCB0cnVlKTsKICAgICAgICAgIFRyYW5zZm9ybS5wb2ludFRvV29ybGRGcmFtZShoZlBvcywgaGZRdWF0LCBoZlNoYXBlLnBpbGxhck9mZnNldCwgd29ybGRQaWxsYXJPZmZzZXQpOwoKICAgICAgICAgIGlmIChzcGhlcmVQb3MuZGlzdGFuY2VUbyh3b3JsZFBpbGxhck9mZnNldCkgPCBoZlNoYXBlLnBpbGxhckNvbnZleC5ib3VuZGluZ1NwaGVyZVJhZGl1cyArIHNwaGVyZVNoYXBlLmJvdW5kaW5nU3BoZXJlUmFkaXVzKSB7CiAgICAgICAgICAgIGludGVyc2VjdGluZyA9IHRoaXMuc3BoZXJlQ29udmV4KHNwaGVyZVNoYXBlLCBoZlNoYXBlLnBpbGxhckNvbnZleCwgc3BoZXJlUG9zLCB3b3JsZFBpbGxhck9mZnNldCwgc3BoZXJlUXVhdCwgaGZRdWF0LCBzcGhlcmVCb2R5LCBoZkJvZHksIHNwaGVyZVNoYXBlLCBoZlNoYXBlLCBqdXN0VGVzdCk7CiAgICAgICAgICB9CgogICAgICAgICAgaWYgKGp1c3RUZXN0ICYmIGludGVyc2VjdGluZykgewogICAgICAgICAgICByZXR1cm4gdHJ1ZTsKICAgICAgICAgIH0KCiAgICAgICAgICBjb25zdCBudW1Db250YWN0cyA9IHJlc3VsdC5sZW5ndGggLSBudW1Db250YWN0c0JlZm9yZTsKCiAgICAgICAgICBpZiAobnVtQ29udGFjdHMgPiAyKSB7CiAgICAgICAgICAgIHJldHVybjsKICAgICAgICAgIH0KICAgICAgICAgIC8qCiAgICAgICAgICAgIC8vIFNraXAgYWxsIGJ1dCAxCiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbnVtQ29udGFjdHMgLSAxOyBrKyspIHsKICAgICAgICAgICAgICAgIHJlc3VsdC5wb3AoKTsKICAgICAgICAgICAgfQogICAgICAgICAgKi8KCiAgICAgICAgfQogICAgICB9CiAgICB9CgogICAgYm94SGVpZ2h0ZmllbGQoc2ksIHNqLCB4aSwgeGosIHFpLCBxaiwgYmksIGJqLCByc2ksIHJzaiwganVzdFRlc3QpIHsKICAgICAgc2kuY29udmV4UG9seWhlZHJvblJlcHJlc2VudGF0aW9uLm1hdGVyaWFsID0gc2kubWF0ZXJpYWw7CiAgICAgIHNpLmNvbnZleFBvbHloZWRyb25SZXByZXNlbnRhdGlvbi5jb2xsaXNpb25SZXNwb25zZSA9IHNpLmNvbGxpc2lvblJlc3BvbnNlOwogICAgICByZXR1cm4gdGhpcy5jb252ZXhIZWlnaHRmaWVsZChzaS5jb252ZXhQb2x5aGVkcm9uUmVwcmVzZW50YXRpb24sIHNqLCB4aSwgeGosIHFpLCBxaiwgYmksIGJqLCBzaSwgc2osIGp1c3RUZXN0KTsKICAgIH0KCiAgICBjb252ZXhIZWlnaHRmaWVsZChjb252ZXhTaGFwZSwgaGZTaGFwZSwgY29udmV4UG9zLCBoZlBvcywgY29udmV4UXVhdCwgaGZRdWF0LCBjb252ZXhCb2R5LCBoZkJvZHksIHJzaSwgcnNqLCBqdXN0VGVzdCkgewogICAgICBjb25zdCBkYXRhID0gaGZTaGFwZS5kYXRhOwogICAgICBjb25zdCB3ID0gaGZTaGFwZS5lbGVtZW50U2l6ZTsKICAgICAgY29uc3QgcmFkaXVzID0gY29udmV4U2hhcGUuYm91bmRpbmdTcGhlcmVSYWRpdXM7CiAgICAgIGNvbnN0IHdvcmxkUGlsbGFyT2Zmc2V0ID0gY29udmV4SGVpZ2h0ZmllbGRfdG1wMjsKICAgICAgY29uc3QgZmFjZUxpc3QgPSBjb252ZXhIZWlnaHRmaWVsZF9mYWNlTGlzdDsgLy8gR2V0IHNwaGVyZSBwb3NpdGlvbiB0byBoZWlnaHRmaWVsZCBsb2NhbCEKCiAgICAgIGNvbnN0IGxvY2FsQ29udmV4UG9zID0gY29udmV4SGVpZ2h0ZmllbGRfdG1wMTsKICAgICAgVHJhbnNmb3JtLnBvaW50VG9Mb2NhbEZyYW1lKGhmUG9zLCBoZlF1YXQsIGNvbnZleFBvcywgbG9jYWxDb252ZXhQb3MpOyAvLyBHZXQgdGhlIGluZGV4IG9mIHRoZSBkYXRhIHBvaW50cyB0byB0ZXN0IGFnYWluc3QKCiAgICAgIGxldCBpTWluWCA9IE1hdGguZmxvb3IoKGxvY2FsQ29udmV4UG9zLnggLSByYWRpdXMpIC8gdykgLSAxOwogICAgICBsZXQgaU1heFggPSBNYXRoLmNlaWwoKGxvY2FsQ29udmV4UG9zLnggKyByYWRpdXMpIC8gdykgKyAxOwogICAgICBsZXQgaU1pblkgPSBNYXRoLmZsb29yKChsb2NhbENvbnZleFBvcy55IC0gcmFkaXVzKSAvIHcpIC0gMTsKICAgICAgbGV0IGlNYXhZID0gTWF0aC5jZWlsKChsb2NhbENvbnZleFBvcy55ICsgcmFkaXVzKSAvIHcpICsgMTsgLy8gQmFpbCBvdXQgaWYgd2UgYXJlIG91dCBvZiB0aGUgdGVycmFpbgoKICAgICAgaWYgKGlNYXhYIDwgMCB8fCBpTWF4WSA8IDAgfHwgaU1pblggPiBkYXRhLmxlbmd0aCB8fCBpTWluWSA+IGRhdGFbMF0ubGVuZ3RoKSB7CiAgICAgICAgcmV0dXJuOwogICAgICB9IC8vIENsYW1wIGluZGV4IHRvIGVkZ2VzCgoKICAgICAgaWYgKGlNaW5YIDwgMCkgewogICAgICAgIGlNaW5YID0gMDsKICAgICAgfQoKICAgICAgaWYgKGlNYXhYIDwgMCkgewogICAgICAgIGlNYXhYID0gMDsKICAgICAgfQoKICAgICAgaWYgKGlNaW5ZIDwgMCkgewogICAgICAgIGlNaW5ZID0gMDsKICAgICAgfQoKICAgICAgaWYgKGlNYXhZIDwgMCkgewogICAgICAgIGlNYXhZID0gMDsKICAgICAgfQoKICAgICAgaWYgKGlNaW5YID49IGRhdGEubGVuZ3RoKSB7CiAgICAgICAgaU1pblggPSBkYXRhLmxlbmd0aCAtIDE7CiAgICAgIH0KCiAgICAgIGlmIChpTWF4WCA+PSBkYXRhLmxlbmd0aCkgewogICAgICAgIGlNYXhYID0gZGF0YS5sZW5ndGggLSAxOwogICAgICB9CgogICAgICBpZiAoaU1heFkgPj0gZGF0YVswXS5sZW5ndGgpIHsKICAgICAgICBpTWF4WSA9IGRhdGFbMF0ubGVuZ3RoIC0gMTsKICAgICAgfQoKICAgICAgaWYgKGlNaW5ZID49IGRhdGFbMF0ubGVuZ3RoKSB7CiAgICAgICAgaU1pblkgPSBkYXRhWzBdLmxlbmd0aCAtIDE7CiAgICAgIH0KCiAgICAgIGNvbnN0IG1pbk1heCA9IFtdOwogICAgICBoZlNoYXBlLmdldFJlY3RNaW5NYXgoaU1pblgsIGlNaW5ZLCBpTWF4WCwgaU1heFksIG1pbk1heCk7CiAgICAgIGNvbnN0IG1pbiA9IG1pbk1heFswXTsKICAgICAgY29uc3QgbWF4ID0gbWluTWF4WzFdOyAvLyBCYWlsIG91dCBpZiB3ZSdyZSBjYW50IHRvdWNoIHRoZSBib3VuZGluZyBoZWlnaHQgYm94CgogICAgICBpZiAobG9jYWxDb252ZXhQb3MueiAtIHJhZGl1cyA+IG1heCB8fCBsb2NhbENvbnZleFBvcy56ICsgcmFkaXVzIDwgbWluKSB7CiAgICAgICAgcmV0dXJuOwogICAgICB9CgogICAgICBmb3IgKGxldCBpID0gaU1pblg7IGkgPCBpTWF4WDsgaSsrKSB7CiAgICAgICAgZm9yIChsZXQgaiA9IGlNaW5ZOyBqIDwgaU1heFk7IGorKykgewogICAgICAgICAgbGV0IGludGVyc2VjdGluZyA9IGZhbHNlOyAvLyBMb3dlciB0cmlhbmdsZQoKICAgICAgICAgIGhmU2hhcGUuZ2V0Q29udmV4VHJpYW5nbGVQaWxsYXIoaSwgaiwgZmFsc2UpOwogICAgICAgICAgVHJhbnNmb3JtLnBvaW50VG9Xb3JsZEZyYW1lKGhmUG9zLCBoZlF1YXQsIGhmU2hhcGUucGlsbGFyT2Zmc2V0LCB3b3JsZFBpbGxhck9mZnNldCk7CgogICAgICAgICAgaWYgKGNvbnZleFBvcy5kaXN0YW5jZVRvKHdvcmxkUGlsbGFyT2Zmc2V0KSA8IGhmU2hhcGUucGlsbGFyQ29udmV4LmJvdW5kaW5nU3BoZXJlUmFkaXVzICsgY29udmV4U2hhcGUuYm91bmRpbmdTcGhlcmVSYWRpdXMpIHsKICAgICAgICAgICAgaW50ZXJzZWN0aW5nID0gdGhpcy5jb252ZXhDb252ZXgoY29udmV4U2hhcGUsIGhmU2hhcGUucGlsbGFyQ29udmV4LCBjb252ZXhQb3MsIHdvcmxkUGlsbGFyT2Zmc2V0LCBjb252ZXhRdWF0LCBoZlF1YXQsIGNvbnZleEJvZHksIGhmQm9keSwgbnVsbCwgbnVsbCwganVzdFRlc3QsIGZhY2VMaXN0LCBudWxsKTsKICAgICAgICAgIH0KCiAgICAgICAgICBpZiAoanVzdFRlc3QgJiYgaW50ZXJzZWN0aW5nKSB7CiAgICAgICAgICAgIHJldHVybiB0cnVlOwogICAgICAgICAgfSAvLyBVcHBlciB0cmlhbmdsZQoKCiAgICAgICAgICBoZlNoYXBlLmdldENvbnZleFRyaWFuZ2xlUGlsbGFyKGksIGosIHRydWUpOwogICAgICAgICAgVHJhbnNmb3JtLnBvaW50VG9Xb3JsZEZyYW1lKGhmUG9zLCBoZlF1YXQsIGhmU2hhcGUucGlsbGFyT2Zmc2V0LCB3b3JsZFBpbGxhck9mZnNldCk7CgogICAgICAgICAgaWYgKGNvbnZleFBvcy5kaXN0YW5jZVRvKHdvcmxkUGlsbGFyT2Zmc2V0KSA8IGhmU2hhcGUucGlsbGFyQ29udmV4LmJvdW5kaW5nU3BoZXJlUmFkaXVzICsgY29udmV4U2hhcGUuYm91bmRpbmdTcGhlcmVSYWRpdXMpIHsKICAgICAgICAgICAgaW50ZXJzZWN0aW5nID0gdGhpcy5jb252ZXhDb252ZXgoY29udmV4U2hhcGUsIGhmU2hhcGUucGlsbGFyQ29udmV4LCBjb252ZXhQb3MsIHdvcmxkUGlsbGFyT2Zmc2V0LCBjb252ZXhRdWF0LCBoZlF1YXQsIGNvbnZleEJvZHksIGhmQm9keSwgbnVsbCwgbnVsbCwganVzdFRlc3QsIGZhY2VMaXN0LCBudWxsKTsKICAgICAgICAgIH0KCiAgICAgICAgICBpZiAoanVzdFRlc3QgJiYgaW50ZXJzZWN0aW5nKSB7CiAgICAgICAgICAgIHJldHVybiB0cnVlOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfQogICAgfQoKICAgIHNwaGVyZVBhcnRpY2xlKHNqLCBzaSwgeGosIHhpLCBxaiwgcWksIGJqLCBiaSwgcnNpLCByc2osIGp1c3RUZXN0KSB7CiAgICAgIC8vIFRoZSBub3JtYWwgaXMgdGhlIHVuaXQgdmVjdG9yIGZyb20gc3BoZXJlIGNlbnRlciB0byBwYXJ0aWNsZSBjZW50ZXIKICAgICAgY29uc3Qgbm9ybWFsID0gcGFydGljbGVTcGhlcmVfbm9ybWFsOwogICAgICBub3JtYWwuc2V0KDAsIDAsIDEpOwogICAgICB4aS52c3ViKHhqLCBub3JtYWwpOwogICAgICBjb25zdCBsZW5ndGhTcXVhcmVkID0gbm9ybWFsLmxlbmd0aFNxdWFyZWQoKTsKCiAgICAgIGlmIChsZW5ndGhTcXVhcmVkIDw9IHNqLnJhZGl1cyAqIHNqLnJhZGl1cykgewogICAgICAgIGlmIChqdXN0VGVzdCkgewogICAgICAgICAgcmV0dXJuIHRydWU7CiAgICAgICAgfQoKICAgICAgICBjb25zdCByID0gdGhpcy5jcmVhdGVDb250YWN0RXF1YXRpb24oYmksIGJqLCBzaSwgc2osIHJzaSwgcnNqKTsKICAgICAgICBub3JtYWwubm9ybWFsaXplKCk7CiAgICAgICAgci5yai5jb3B5KG5vcm1hbCk7CiAgICAgICAgci5yai5zY2FsZShzai5yYWRpdXMsIHIucmopOwogICAgICAgIHIubmkuY29weShub3JtYWwpOyAvLyBDb250YWN0IG5vcm1hbAoKICAgICAgICByLm5pLm5lZ2F0ZShyLm5pKTsKICAgICAgICByLnJpLnNldCgwLCAwLCAwKTsgLy8gQ2VudGVyIG9mIHBhcnRpY2xlCgogICAgICAgIHRoaXMucmVzdWx0LnB1c2gocik7CiAgICAgICAgdGhpcy5jcmVhdGVGcmljdGlvbkVxdWF0aW9uc0Zyb21Db250YWN0KHIsIHRoaXMuZnJpY3Rpb25SZXN1bHQpOwogICAgICB9CiAgICB9CgogICAgcGxhbmVQYXJ0aWNsZShzaiwgc2ksIHhqLCB4aSwgcWosIHFpLCBiaiwgYmksIHJzaSwgcnNqLCBqdXN0VGVzdCkgewogICAgICBjb25zdCBub3JtYWwgPSBwYXJ0aWNsZVBsYW5lX25vcm1hbDsKICAgICAgbm9ybWFsLnNldCgwLCAwLCAxKTsKICAgICAgYmoucXVhdGVybmlvbi52bXVsdChub3JtYWwsIG5vcm1hbCk7IC8vIFR1cm4gbm9ybWFsIGFjY29yZGluZyB0byBwbGFuZSBvcmllbnRhdGlvbgoKICAgICAgY29uc3QgcmVscG9zID0gcGFydGljbGVQbGFuZV9yZWxwb3M7CiAgICAgIHhpLnZzdWIoYmoucG9zaXRpb24sIHJlbHBvcyk7CiAgICAgIGNvbnN0IGRvdCA9IG5vcm1hbC5kb3QocmVscG9zKTsKCiAgICAgIGlmIChkb3QgPD0gMC4wKSB7CiAgICAgICAgaWYgKGp1c3RUZXN0KSB7CiAgICAgICAgICByZXR1cm4gdHJ1ZTsKICAgICAgICB9CgogICAgICAgIGNvbnN0IHIgPSB0aGlzLmNyZWF0ZUNvbnRhY3RFcXVhdGlvbihiaSwgYmosIHNpLCBzaiwgcnNpLCByc2opOwogICAgICAgIHIubmkuY29weShub3JtYWwpOyAvLyBDb250YWN0IG5vcm1hbCBpcyB0aGUgcGxhbmUgbm9ybWFsCgogICAgICAgIHIubmkubmVnYXRlKHIubmkpOwogICAgICAgIHIucmkuc2V0KDAsIDAsIDApOyAvLyBDZW50ZXIgb2YgcGFydGljbGUKICAgICAgICAvLyBHZXQgcGFydGljbGUgcG9zaXRpb24gcHJvamVjdGVkIG9uIHBsYW5lCgogICAgICAgIGNvbnN0IHByb2plY3RlZCA9IHBhcnRpY2xlUGxhbmVfcHJvamVjdGVkOwogICAgICAgIG5vcm1hbC5zY2FsZShub3JtYWwuZG90KHhpKSwgcHJvamVjdGVkKTsKICAgICAgICB4aS52c3ViKHByb2plY3RlZCwgcHJvamVjdGVkKTsgLy9wcm9qZWN0ZWQudmFkZChiai5wb3NpdGlvbixwcm9qZWN0ZWQpOwogICAgICAgIC8vIHJqIGlzIG5vdyB0aGUgcHJvamVjdGVkIHdvcmxkIHBvc2l0aW9uIG1pbnVzIHBsYW5lIHBvc2l0aW9uCgogICAgICAgIHIucmouY29weShwcm9qZWN0ZWQpOwogICAgICAgIHRoaXMucmVzdWx0LnB1c2gocik7CiAgICAgICAgdGhpcy5jcmVhdGVGcmljdGlvbkVxdWF0aW9uc0Zyb21Db250YWN0KHIsIHRoaXMuZnJpY3Rpb25SZXN1bHQpOwogICAgICB9CiAgICB9CgogICAgYm94UGFydGljbGUoc2ksIHNqLCB4aSwgeGosIHFpLCBxaiwgYmksIGJqLCByc2ksIHJzaiwganVzdFRlc3QpIHsKICAgICAgc2kuY29udmV4UG9seWhlZHJvblJlcHJlc2VudGF0aW9uLm1hdGVyaWFsID0gc2kubWF0ZXJpYWw7CiAgICAgIHNpLmNvbnZleFBvbHloZWRyb25SZXByZXNlbnRhdGlvbi5jb2xsaXNpb25SZXNwb25zZSA9IHNpLmNvbGxpc2lvblJlc3BvbnNlOwogICAgICByZXR1cm4gdGhpcy5jb252ZXhQYXJ0aWNsZShzaS5jb252ZXhQb2x5aGVkcm9uUmVwcmVzZW50YXRpb24sIHNqLCB4aSwgeGosIHFpLCBxaiwgYmksIGJqLCBzaSwgc2osIGp1c3RUZXN0KTsKICAgIH0KCiAgICBjb252ZXhQYXJ0aWNsZShzaiwgc2ksIHhqLCB4aSwgcWosIHFpLCBiaiwgYmksIHJzaSwgcnNqLCBqdXN0VGVzdCkgewogICAgICBsZXQgcGVuZXRyYXRlZEZhY2VJbmRleCA9IC0xOwogICAgICBjb25zdCBwZW5ldHJhdGVkRmFjZU5vcm1hbCA9IGNvbnZleFBhcnRpY2xlX3BlbmV0cmF0ZWRGYWNlTm9ybWFsOwogICAgICBjb25zdCB3b3JsZFBlbmV0cmF0aW9uVmVjID0gY29udmV4UGFydGljbGVfd29ybGRQZW5ldHJhdGlvblZlYzsKICAgICAgbGV0IG1pblBlbmV0cmF0aW9uID0gbnVsbDsKCiAgICAgIGNvbnN0IGxvY2FsID0gY29udmV4UGFydGljbGVfbG9jYWw7CiAgICAgIGxvY2FsLmNvcHkoeGkpOwogICAgICBsb2NhbC52c3ViKHhqLCBsb2NhbCk7IC8vIENvbnZlcnQgcG9zaXRpb24gdG8gcmVsYXRpdmUgdGhlIGNvbnZleCBvcmlnaW4KCiAgICAgIHFqLmNvbmp1Z2F0ZShjcWopOwogICAgICBjcWoudm11bHQobG9jYWwsIGxvY2FsKTsKCiAgICAgIGlmIChzai5wb2ludElzSW5zaWRlKGxvY2FsKSkgewogICAgICAgIGlmIChzai53b3JsZFZlcnRpY2VzTmVlZHNVcGRhdGUpIHsKICAgICAgICAgIHNqLmNvbXB1dGVXb3JsZFZlcnRpY2VzKHhqLCBxaik7CiAgICAgICAgfQoKICAgICAgICBpZiAoc2oud29ybGRGYWNlTm9ybWFsc05lZWRzVXBkYXRlKSB7CiAgICAgICAgICBzai5jb21wdXRlV29ybGRGYWNlTm9ybWFscyhxaik7CiAgICAgICAgfSAvLyBGb3IgZWFjaCB3b3JsZCBwb2x5Z29uIGluIHRoZSBwb2x5aGVkcmEKCgogICAgICAgIGZvciAobGV0IGkgPSAwLCBuZmFjZXMgPSBzai5mYWNlcy5sZW5ndGg7IGkgIT09IG5mYWNlczsgaSsrKSB7CiAgICAgICAgICAvLyBDb25zdHJ1Y3Qgd29ybGQgZmFjZSB2ZXJ0aWNlcwogICAgICAgICAgY29uc3QgdmVydHMgPSBbc2oud29ybGRWZXJ0aWNlc1tzai5mYWNlc1tpXVswXV1dOwogICAgICAgICAgY29uc3Qgbm9ybWFsID0gc2oud29ybGRGYWNlTm9ybWFsc1tpXTsgLy8gQ2hlY2sgaG93IG11Y2ggdGhlIHBhcnRpY2xlIHBlbmV0cmF0ZXMgdGhlIHBvbHlnb24gcGxhbmUuCgogICAgICAgICAgeGkudnN1Yih2ZXJ0c1swXSwgY29udmV4UGFydGljbGVfdmVydGV4VG9QYXJ0aWNsZSk7CiAgICAgICAgICBjb25zdCBwZW5ldHJhdGlvbiA9IC1ub3JtYWwuZG90KGNvbnZleFBhcnRpY2xlX3ZlcnRleFRvUGFydGljbGUpOwoKICAgICAgICAgIGlmIChtaW5QZW5ldHJhdGlvbiA9PT0gbnVsbCB8fCBNYXRoLmFicyhwZW5ldHJhdGlvbikgPCBNYXRoLmFicyhtaW5QZW5ldHJhdGlvbikpIHsKICAgICAgICAgICAgaWYgKGp1c3RUZXN0KSB7CiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7CiAgICAgICAgICAgIH0KCiAgICAgICAgICAgIG1pblBlbmV0cmF0aW9uID0gcGVuZXRyYXRpb247CiAgICAgICAgICAgIHBlbmV0cmF0ZWRGYWNlSW5kZXggPSBpOwogICAgICAgICAgICBwZW5ldHJhdGVkRmFjZU5vcm1hbC5jb3B5KG5vcm1hbCk7CiAgICAgICAgICB9CiAgICAgICAgfQoKICAgICAgICBpZiAocGVuZXRyYXRlZEZhY2VJbmRleCAhPT0gLTEpIHsKICAgICAgICAgIC8vIFNldHVwIGNvbnRhY3QKICAgICAgICAgIGNvbnN0IHIgPSB0aGlzLmNyZWF0ZUNvbnRhY3RFcXVhdGlvbihiaSwgYmosIHNpLCBzaiwgcnNpLCByc2opOwogICAgICAgICAgcGVuZXRyYXRlZEZhY2VOb3JtYWwuc2NhbGUobWluUGVuZXRyYXRpb24sIHdvcmxkUGVuZXRyYXRpb25WZWMpOyAvLyByaiBpcyB0aGUgcGFydGljbGUgcG9zaXRpb24gcHJvamVjdGVkIHRvIHRoZSBmYWNlCgogICAgICAgICAgd29ybGRQZW5ldHJhdGlvblZlYy52YWRkKHhpLCB3b3JsZFBlbmV0cmF0aW9uVmVjKTsKICAgICAgICAgIHdvcmxkUGVuZXRyYXRpb25WZWMudnN1Yih4aiwgd29ybGRQZW5ldHJhdGlvblZlYyk7CiAgICAgICAgICByLnJqLmNvcHkod29ybGRQZW5ldHJhdGlvblZlYyk7IC8vY29uc3QgcHJvamVjdGVkVG9GYWNlID0geGkudnN1Yih4aikudmFkZCh3b3JsZFBlbmV0cmF0aW9uVmVjKTsKICAgICAgICAgIC8vcHJvamVjdGVkVG9GYWNlLmNvcHkoci5yaik7CiAgICAgICAgICAvL3FqLnZtdWx0KHIucmosci5yaik7CgogICAgICAgICAgcGVuZXRyYXRlZEZhY2VOb3JtYWwubmVnYXRlKHIubmkpOyAvLyBDb250YWN0IG5vcm1hbAoKICAgICAgICAgIHIucmkuc2V0KDAsIDAsIDApOyAvLyBDZW50ZXIgb2YgcGFydGljbGUKCiAgICAgICAgICBjb25zdCByaSA9IHIucmk7CiAgICAgICAgICBjb25zdCByaiA9IHIucmo7IC8vIE1ha2UgcmVsYXRpdmUgdG8gYm9kaWVzCgogICAgICAgICAgcmkudmFkZCh4aSwgcmkpOwogICAgICAgICAgcmkudnN1YihiaS5wb3NpdGlvbiwgcmkpOwogICAgICAgICAgcmoudmFkZCh4aiwgcmopOwogICAgICAgICAgcmoudnN1Yihiai5wb3NpdGlvbiwgcmopOwogICAgICAgICAgdGhpcy5yZXN1bHQucHVzaChyKTsKICAgICAgICAgIHRoaXMuY3JlYXRlRnJpY3Rpb25FcXVhdGlvbnNGcm9tQ29udGFjdChyLCB0aGlzLmZyaWN0aW9uUmVzdWx0KTsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgY29uc29sZS53YXJuKCdQb2ludCBmb3VuZCBpbnNpZGUgY29udmV4LCBidXQgZGlkIG5vdCBmaW5kIHBlbmV0cmF0aW5nIGZhY2UhJyk7CiAgICAgICAgfQogICAgICB9CiAgICB9CgogICAgaGVpZ2h0ZmllbGRDeWxpbmRlcihoZlNoYXBlLCBjb252ZXhTaGFwZSwgaGZQb3MsIGNvbnZleFBvcywgaGZRdWF0LCBjb252ZXhRdWF0LCBoZkJvZHksIGNvbnZleEJvZHksIHJzaSwgcnNqLCBqdXN0VGVzdCkgewogICAgICByZXR1cm4gdGhpcy5jb252ZXhIZWlnaHRmaWVsZChjb252ZXhTaGFwZSwgaGZTaGFwZSwgY29udmV4UG9zLCBoZlBvcywgY29udmV4UXVhdCwgaGZRdWF0LCBjb252ZXhCb2R5LCBoZkJvZHksIHJzaSwgcnNqLCBqdXN0VGVzdCk7CiAgICB9CgogICAgcGFydGljbGVDeWxpbmRlcihzaSwgc2osIHhpLCB4aiwgcWksIHFqLCBiaSwgYmosIHJzaSwgcnNqLCBqdXN0VGVzdCkgewogICAgICByZXR1cm4gdGhpcy5jb252ZXhQYXJ0aWNsZShzaiwgc2ksIHhqLCB4aSwgcWosIHFpLCBiaiwgYmksIHJzaSwgcnNqLCBqdXN0VGVzdCk7CiAgICB9CgogICAgc3BoZXJlVHJpbWVzaChzcGhlcmVTaGFwZSwgdHJpbWVzaFNoYXBlLCBzcGhlcmVQb3MsIHRyaW1lc2hQb3MsIHNwaGVyZVF1YXQsIHRyaW1lc2hRdWF0LCBzcGhlcmVCb2R5LCB0cmltZXNoQm9keSwgcnNpLCByc2osIGp1c3RUZXN0KSB7CiAgICAgIGNvbnN0IGVkZ2VWZXJ0ZXhBID0gc3BoZXJlVHJpbWVzaF9lZGdlVmVydGV4QTsKICAgICAgY29uc3QgZWRnZVZlcnRleEIgPSBzcGhlcmVUcmltZXNoX2VkZ2VWZXJ0ZXhCOwogICAgICBjb25zdCBlZGdlVmVjdG9yID0gc3BoZXJlVHJpbWVzaF9lZGdlVmVjdG9yOwogICAgICBjb25zdCBlZGdlVmVjdG9yVW5pdCA9IHNwaGVyZVRyaW1lc2hfZWRnZVZlY3RvclVuaXQ7CiAgICAgIGNvbnN0IGxvY2FsU3BoZXJlUG9zID0gc3BoZXJlVHJpbWVzaF9sb2NhbFNwaGVyZVBvczsKICAgICAgY29uc3QgdG1wID0gc3BoZXJlVHJpbWVzaF90bXA7CiAgICAgIGNvbnN0IGxvY2FsU3BoZXJlQUFCQiA9IHNwaGVyZVRyaW1lc2hfbG9jYWxTcGhlcmVBQUJCOwogICAgICBjb25zdCB2MiA9IHNwaGVyZVRyaW1lc2hfdjI7CiAgICAgIGNvbnN0IHJlbHBvcyA9IHNwaGVyZVRyaW1lc2hfcmVscG9zOwogICAgICBjb25zdCB0cmlhbmdsZXMgPSBzcGhlcmVUcmltZXNoX3RyaWFuZ2xlczsgLy8gQ29udmVydCBzcGhlcmUgcG9zaXRpb24gdG8gbG9jYWwgaW4gdGhlIHRyaW1lc2gKCiAgICAgIFRyYW5zZm9ybS5wb2ludFRvTG9jYWxGcmFtZSh0cmltZXNoUG9zLCB0cmltZXNoUXVhdCwgc3BoZXJlUG9zLCBsb2NhbFNwaGVyZVBvcyk7IC8vIEdldCB0aGUgYWFiYiBvZiB0aGUgc3BoZXJlIGxvY2FsbHkgaW4gdGhlIHRyaW1lc2gKCiAgICAgIGNvbnN0IHNwaGVyZVJhZGl1cyA9IHNwaGVyZVNoYXBlLnJhZGl1czsKICAgICAgbG9jYWxTcGhlcmVBQUJCLmxvd2VyQm91bmQuc2V0KGxvY2FsU3BoZXJlUG9zLnggLSBzcGhlcmVSYWRpdXMsIGxvY2FsU3BoZXJlUG9zLnkgLSBzcGhlcmVSYWRpdXMsIGxvY2FsU3BoZXJlUG9zLnogLSBzcGhlcmVSYWRpdXMpOwogICAgICBsb2NhbFNwaGVyZUFBQkIudXBwZXJCb3VuZC5zZXQobG9jYWxTcGhlcmVQb3MueCArIHNwaGVyZVJhZGl1cywgbG9jYWxTcGhlcmVQb3MueSArIHNwaGVyZVJhZGl1cywgbG9jYWxTcGhlcmVQb3MueiArIHNwaGVyZVJhZGl1cyk7CiAgICAgIHRyaW1lc2hTaGFwZS5nZXRUcmlhbmdsZXNJbkFBQkIobG9jYWxTcGhlcmVBQUJCLCB0cmlhbmdsZXMpOyAvL2ZvciAobGV0IGkgPSAwOyBpIDwgdHJpbWVzaFNoYXBlLmluZGljZXMubGVuZ3RoIC8gMzsgaSsrKSB0cmlhbmdsZXMucHVzaChpKTsgLy8gQWxsCiAgICAgIC8vIFZlcnRpY2VzCgogICAgICBjb25zdCB2ID0gc3BoZXJlVHJpbWVzaF92OwogICAgICBjb25zdCByYWRpdXNTcXVhcmVkID0gc3BoZXJlU2hhcGUucmFkaXVzICogc3BoZXJlU2hhcGUucmFkaXVzOwoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmlhbmdsZXMubGVuZ3RoOyBpKyspIHsKICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDM7IGorKykgewogICAgICAgICAgdHJpbWVzaFNoYXBlLmdldFZlcnRleCh0cmltZXNoU2hhcGUuaW5kaWNlc1t0cmlhbmdsZXNbaV0gKiAzICsgal0sIHYpOyAvLyBDaGVjayB2ZXJ0ZXggb3ZlcmxhcCBpbiBzcGhlcmUKCiAgICAgICAgICB2LnZzdWIobG9jYWxTcGhlcmVQb3MsIHJlbHBvcyk7CgogICAgICAgICAgaWYgKHJlbHBvcy5sZW5ndGhTcXVhcmVkKCkgPD0gcmFkaXVzU3F1YXJlZCkgewogICAgICAgICAgICAvLyBTYWZlIHVwCiAgICAgICAgICAgIHYyLmNvcHkodik7CiAgICAgICAgICAgIFRyYW5zZm9ybS5wb2ludFRvV29ybGRGcmFtZSh0cmltZXNoUG9zLCB0cmltZXNoUXVhdCwgdjIsIHYpOwogICAgICAgICAgICB2LnZzdWIoc3BoZXJlUG9zLCByZWxwb3MpOwoKICAgICAgICAgICAgaWYgKGp1c3RUZXN0KSB7CiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7CiAgICAgICAgICAgIH0KCiAgICAgICAgICAgIGxldCByID0gdGhpcy5jcmVhdGVDb250YWN0RXF1YXRpb24oc3BoZXJlQm9keSwgdHJpbWVzaEJvZHksIHNwaGVyZVNoYXBlLCB0cmltZXNoU2hhcGUsIHJzaSwgcnNqKTsKICAgICAgICAgICAgci5uaS5jb3B5KHJlbHBvcyk7CiAgICAgICAgICAgIHIubmkubm9ybWFsaXplKCk7IC8vIHJpIGlzIHRoZSB2ZWN0b3IgZnJvbSBzcGhlcmUgY2VudGVyIHRvIHRoZSBzcGhlcmUgc3VyZmFjZQoKICAgICAgICAgICAgci5yaS5jb3B5KHIubmkpOwogICAgICAgICAgICByLnJpLnNjYWxlKHNwaGVyZVNoYXBlLnJhZGl1cywgci5yaSk7CiAgICAgICAgICAgIHIucmkudmFkZChzcGhlcmVQb3MsIHIucmkpOwogICAgICAgICAgICByLnJpLnZzdWIoc3BoZXJlQm9keS5wb3NpdGlvbiwgci5yaSk7CiAgICAgICAgICAgIHIucmouY29weSh2KTsKICAgICAgICAgICAgci5yai52c3ViKHRyaW1lc2hCb2R5LnBvc2l0aW9uLCByLnJqKTsgLy8gU3RvcmUgcmVzdWx0CgogICAgICAgICAgICB0aGlzLnJlc3VsdC5wdXNoKHIpOwogICAgICAgICAgICB0aGlzLmNyZWF0ZUZyaWN0aW9uRXF1YXRpb25zRnJvbUNvbnRhY3QociwgdGhpcy5mcmljdGlvblJlc3VsdCk7CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9IC8vIENoZWNrIGFsbCBlZGdlcwoKCiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJpYW5nbGVzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAzOyBqKyspIHsKICAgICAgICAgIHRyaW1lc2hTaGFwZS5nZXRWZXJ0ZXgodHJpbWVzaFNoYXBlLmluZGljZXNbdHJpYW5nbGVzW2ldICogMyArIGpdLCBlZGdlVmVydGV4QSk7CiAgICAgICAgICB0cmltZXNoU2hhcGUuZ2V0VmVydGV4KHRyaW1lc2hTaGFwZS5pbmRpY2VzW3RyaWFuZ2xlc1tpXSAqIDMgKyAoaiArIDEpICUgM10sIGVkZ2VWZXJ0ZXhCKTsKICAgICAgICAgIGVkZ2VWZXJ0ZXhCLnZzdWIoZWRnZVZlcnRleEEsIGVkZ2VWZWN0b3IpOyAvLyBQcm9qZWN0IHNwaGVyZSBwb3NpdGlvbiB0byB0aGUgZWRnZQoKICAgICAgICAgIGxvY2FsU3BoZXJlUG9zLnZzdWIoZWRnZVZlcnRleEIsIHRtcCk7CiAgICAgICAgICBjb25zdCBwb3NpdGlvbkFsb25nRWRnZUIgPSB0bXAuZG90KGVkZ2VWZWN0b3IpOwogICAgICAgICAgbG9jYWxTcGhlcmVQb3MudnN1YihlZGdlVmVydGV4QSwgdG1wKTsKICAgICAgICAgIGxldCBwb3NpdGlvbkFsb25nRWRnZUEgPSB0bXAuZG90KGVkZ2VWZWN0b3IpOwoKICAgICAgICAgIGlmIChwb3NpdGlvbkFsb25nRWRnZUEgPiAwICYmIHBvc2l0aW9uQWxvbmdFZGdlQiA8IDApIHsKICAgICAgICAgICAgLy8gTm93IGNoZWNrIHRoZSBvcnRob2dvbmFsIGRpc3RhbmNlIGZyb20gZWRnZSB0byBzcGhlcmUgY2VudGVyCiAgICAgICAgICAgIGxvY2FsU3BoZXJlUG9zLnZzdWIoZWRnZVZlcnRleEEsIHRtcCk7CiAgICAgICAgICAgIGVkZ2VWZWN0b3JVbml0LmNvcHkoZWRnZVZlY3Rvcik7CiAgICAgICAgICAgIGVkZ2VWZWN0b3JVbml0Lm5vcm1hbGl6ZSgpOwogICAgICAgICAgICBwb3NpdGlvbkFsb25nRWRnZUEgPSB0bXAuZG90KGVkZ2VWZWN0b3JVbml0KTsKICAgICAgICAgICAgZWRnZVZlY3RvclVuaXQuc2NhbGUocG9zaXRpb25BbG9uZ0VkZ2VBLCB0bXApOwogICAgICAgICAgICB0bXAudmFkZChlZGdlVmVydGV4QSwgdG1wKTsgLy8gdG1wIGlzIG5vdyB0aGUgc3BoZXJlIGNlbnRlciBwb3NpdGlvbiBwcm9qZWN0ZWQgdG8gdGhlIGVkZ2UsIGRlZmluZWQgbG9jYWxseSBpbiB0aGUgdHJpbWVzaCBmcmFtZQoKICAgICAgICAgICAgY29uc3QgZGlzdCA9IHRtcC5kaXN0YW5jZVRvKGxvY2FsU3BoZXJlUG9zKTsKCiAgICAgICAgICAgIGlmIChkaXN0IDwgc3BoZXJlU2hhcGUucmFkaXVzKSB7CiAgICAgICAgICAgICAgaWYgKGp1c3RUZXN0KSB7CiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsKICAgICAgICAgICAgICB9CgogICAgICAgICAgICAgIGNvbnN0IHIgPSB0aGlzLmNyZWF0ZUNvbnRhY3RFcXVhdGlvbihzcGhlcmVCb2R5LCB0cmltZXNoQm9keSwgc3BoZXJlU2hhcGUsIHRyaW1lc2hTaGFwZSwgcnNpLCByc2opOwogICAgICAgICAgICAgIHRtcC52c3ViKGxvY2FsU3BoZXJlUG9zLCByLm5pKTsKICAgICAgICAgICAgICByLm5pLm5vcm1hbGl6ZSgpOwogICAgICAgICAgICAgIHIubmkuc2NhbGUoc3BoZXJlU2hhcGUucmFkaXVzLCByLnJpKTsKICAgICAgICAgICAgICByLnJpLnZhZGQoc3BoZXJlUG9zLCByLnJpKTsKICAgICAgICAgICAgICByLnJpLnZzdWIoc3BoZXJlQm9keS5wb3NpdGlvbiwgci5yaSk7CiAgICAgICAgICAgICAgVHJhbnNmb3JtLnBvaW50VG9Xb3JsZEZyYW1lKHRyaW1lc2hQb3MsIHRyaW1lc2hRdWF0LCB0bXAsIHRtcCk7CiAgICAgICAgICAgICAgdG1wLnZzdWIodHJpbWVzaEJvZHkucG9zaXRpb24sIHIucmopOwogICAgICAgICAgICAgIFRyYW5zZm9ybS52ZWN0b3JUb1dvcmxkRnJhbWUodHJpbWVzaFF1YXQsIHIubmksIHIubmkpOwogICAgICAgICAgICAgIFRyYW5zZm9ybS52ZWN0b3JUb1dvcmxkRnJhbWUodHJpbWVzaFF1YXQsIHIucmksIHIucmkpOwogICAgICAgICAgICAgIHRoaXMucmVzdWx0LnB1c2gocik7CiAgICAgICAgICAgICAgdGhpcy5jcmVhdGVGcmljdGlvbkVxdWF0aW9uc0Zyb21Db250YWN0KHIsIHRoaXMuZnJpY3Rpb25SZXN1bHQpOwogICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9IC8vIFRyaWFuZ2xlIGZhY2VzCgoKICAgICAgY29uc3QgdmEgPSBzcGhlcmVUcmltZXNoX3ZhOwogICAgICBjb25zdCB2YiA9IHNwaGVyZVRyaW1lc2hfdmI7CiAgICAgIGNvbnN0IHZjID0gc3BoZXJlVHJpbWVzaF92YzsKICAgICAgY29uc3Qgbm9ybWFsID0gc3BoZXJlVHJpbWVzaF9ub3JtYWw7CgogICAgICBmb3IgKGxldCBpID0gMCwgTiA9IHRyaWFuZ2xlcy5sZW5ndGg7IGkgIT09IE47IGkrKykgewogICAgICAgIHRyaW1lc2hTaGFwZS5nZXRUcmlhbmdsZVZlcnRpY2VzKHRyaWFuZ2xlc1tpXSwgdmEsIHZiLCB2Yyk7CiAgICAgICAgdHJpbWVzaFNoYXBlLmdldE5vcm1hbCh0cmlhbmdsZXNbaV0sIG5vcm1hbCk7CiAgICAgICAgbG9jYWxTcGhlcmVQb3MudnN1Yih2YSwgdG1wKTsKICAgICAgICBsZXQgZGlzdCA9IHRtcC5kb3Qobm9ybWFsKTsKICAgICAgICBub3JtYWwuc2NhbGUoZGlzdCwgdG1wKTsKICAgICAgICBsb2NhbFNwaGVyZVBvcy52c3ViKHRtcCwgdG1wKTsgLy8gdG1wIGlzIG5vdyB0aGUgc3BoZXJlIHBvc2l0aW9uIHByb2plY3RlZCB0byB0aGUgdHJpYW5nbGUgcGxhbmUKCiAgICAgICAgZGlzdCA9IHRtcC5kaXN0YW5jZVRvKGxvY2FsU3BoZXJlUG9zKTsKCiAgICAgICAgaWYgKFJheS5wb2ludEluVHJpYW5nbGUodG1wLCB2YSwgdmIsIHZjKSAmJiBkaXN0IDwgc3BoZXJlU2hhcGUucmFkaXVzKSB7CiAgICAgICAgICBpZiAoanVzdFRlc3QpIHsKICAgICAgICAgICAgcmV0dXJuIHRydWU7CiAgICAgICAgICB9CgogICAgICAgICAgbGV0IHIgPSB0aGlzLmNyZWF0ZUNvbnRhY3RFcXVhdGlvbihzcGhlcmVCb2R5LCB0cmltZXNoQm9keSwgc3BoZXJlU2hhcGUsIHRyaW1lc2hTaGFwZSwgcnNpLCByc2opOwogICAgICAgICAgdG1wLnZzdWIobG9jYWxTcGhlcmVQb3MsIHIubmkpOwogICAgICAgICAgci5uaS5ub3JtYWxpemUoKTsKICAgICAgICAgIHIubmkuc2NhbGUoc3BoZXJlU2hhcGUucmFkaXVzLCByLnJpKTsKICAgICAgICAgIHIucmkudmFkZChzcGhlcmVQb3MsIHIucmkpOwogICAgICAgICAgci5yaS52c3ViKHNwaGVyZUJvZHkucG9zaXRpb24sIHIucmkpOwogICAgICAgICAgVHJhbnNmb3JtLnBvaW50VG9Xb3JsZEZyYW1lKHRyaW1lc2hQb3MsIHRyaW1lc2hRdWF0LCB0bXAsIHRtcCk7CiAgICAgICAgICB0bXAudnN1Yih0cmltZXNoQm9keS5wb3NpdGlvbiwgci5yaik7CiAgICAgICAgICBUcmFuc2Zvcm0udmVjdG9yVG9Xb3JsZEZyYW1lKHRyaW1lc2hRdWF0LCByLm5pLCByLm5pKTsKICAgICAgICAgIFRyYW5zZm9ybS52ZWN0b3JUb1dvcmxkRnJhbWUodHJpbWVzaFF1YXQsIHIucmksIHIucmkpOwogICAgICAgICAgdGhpcy5yZXN1bHQucHVzaChyKTsKICAgICAgICAgIHRoaXMuY3JlYXRlRnJpY3Rpb25FcXVhdGlvbnNGcm9tQ29udGFjdChyLCB0aGlzLmZyaWN0aW9uUmVzdWx0KTsKICAgICAgICB9CiAgICAgIH0KCiAgICAgIHRyaWFuZ2xlcy5sZW5ndGggPSAwOwogICAgfQoKICAgIHBsYW5lVHJpbWVzaChwbGFuZVNoYXBlLCB0cmltZXNoU2hhcGUsIHBsYW5lUG9zLCB0cmltZXNoUG9zLCBwbGFuZVF1YXQsIHRyaW1lc2hRdWF0LCBwbGFuZUJvZHksIHRyaW1lc2hCb2R5LCByc2ksIHJzaiwganVzdFRlc3QpIHsKICAgICAgLy8gTWFrZSBjb250YWN0cyEKICAgICAgY29uc3QgdiA9IG5ldyBWZWMzKCk7CiAgICAgIGNvbnN0IG5vcm1hbCA9IHBsYW5lVHJpbWVzaF9ub3JtYWw7CiAgICAgIG5vcm1hbC5zZXQoMCwgMCwgMSk7CiAgICAgIHBsYW5lUXVhdC52bXVsdChub3JtYWwsIG5vcm1hbCk7IC8vIFR1cm4gbm9ybWFsIGFjY29yZGluZyB0byBwbGFuZQoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmltZXNoU2hhcGUudmVydGljZXMubGVuZ3RoIC8gMzsgaSsrKSB7CiAgICAgICAgLy8gR2V0IHdvcmxkIHZlcnRleCBmcm9tIHRyaW1lc2gKICAgICAgICB0cmltZXNoU2hhcGUuZ2V0VmVydGV4KGksIHYpOyAvLyBTYWZlIHVwCgogICAgICAgIGNvbnN0IHYyID0gbmV3IFZlYzMoKTsKICAgICAgICB2Mi5jb3B5KHYpOwogICAgICAgIFRyYW5zZm9ybS5wb2ludFRvV29ybGRGcmFtZSh0cmltZXNoUG9zLCB0cmltZXNoUXVhdCwgdjIsIHYpOyAvLyBDaGVjayBwbGFuZSBzaWRlCgogICAgICAgIGNvbnN0IHJlbHBvcyA9IHBsYW5lVHJpbWVzaF9yZWxwb3M7CiAgICAgICAgdi52c3ViKHBsYW5lUG9zLCByZWxwb3MpOwogICAgICAgIGNvbnN0IGRvdCA9IG5vcm1hbC5kb3QocmVscG9zKTsKCiAgICAgICAgaWYgKGRvdCA8PSAwLjApIHsKICAgICAgICAgIGlmIChqdXN0VGVzdCkgewogICAgICAgICAgICByZXR1cm4gdHJ1ZTsKICAgICAgICAgIH0KCiAgICAgICAgICBjb25zdCByID0gdGhpcy5jcmVhdGVDb250YWN0RXF1YXRpb24ocGxhbmVCb2R5LCB0cmltZXNoQm9keSwgcGxhbmVTaGFwZSwgdHJpbWVzaFNoYXBlLCByc2ksIHJzaik7CiAgICAgICAgICByLm5pLmNvcHkobm9ybWFsKTsgLy8gQ29udGFjdCBub3JtYWwgaXMgdGhlIHBsYW5lIG5vcm1hbAogICAgICAgICAgLy8gR2V0IHZlcnRleCBwb3NpdGlvbiBwcm9qZWN0ZWQgb24gcGxhbmUKCiAgICAgICAgICBjb25zdCBwcm9qZWN0ZWQgPSBwbGFuZVRyaW1lc2hfcHJvamVjdGVkOwogICAgICAgICAgbm9ybWFsLnNjYWxlKHJlbHBvcy5kb3Qobm9ybWFsKSwgcHJvamVjdGVkKTsKICAgICAgICAgIHYudnN1Yihwcm9qZWN0ZWQsIHByb2plY3RlZCk7IC8vIHJpIGlzIHRoZSBwcm9qZWN0ZWQgd29ybGQgcG9zaXRpb24gbWludXMgcGxhbmUgcG9zaXRpb24KCiAgICAgICAgICByLnJpLmNvcHkocHJvamVjdGVkKTsKICAgICAgICAgIHIucmkudnN1YihwbGFuZUJvZHkucG9zaXRpb24sIHIucmkpOwogICAgICAgICAgci5yai5jb3B5KHYpOwogICAgICAgICAgci5yai52c3ViKHRyaW1lc2hCb2R5LnBvc2l0aW9uLCByLnJqKTsgLy8gU3RvcmUgcmVzdWx0CgogICAgICAgICAgdGhpcy5yZXN1bHQucHVzaChyKTsKICAgICAgICAgIHRoaXMuY3JlYXRlRnJpY3Rpb25FcXVhdGlvbnNGcm9tQ29udGFjdChyLCB0aGlzLmZyaWN0aW9uUmVzdWx0KTsKICAgICAgICB9CiAgICAgIH0KICAgIH0gLy8gY29udmV4VHJpbWVzaCgKICAgIC8vICAgc2k6IENvbnZleFBvbHloZWRyb24sIHNqOiBUcmltZXNoLCB4aTogVmVjMywgeGo6IFZlYzMsIHFpOiBRdWF0ZXJuaW9uLCBxajogUXVhdGVybmlvbiwKICAgIC8vICAgYmk6IEJvZHksIGJqOiBCb2R5LCByc2k/OiBTaGFwZSB8IG51bGwsIHJzaj86IFNoYXBlIHwgbnVsbCwKICAgIC8vICAgZmFjZUxpc3RBPzogbnVtYmVyW10gfCBudWxsLCBmYWNlTGlzdEI/OiBudW1iZXJbXSB8IG51bGwsCiAgICAvLyApIHsKICAgIC8vICAgY29uc3Qgc2VwQXhpcyA9IGNvbnZleENvbnZleF9zZXBBeGlzOwogICAgLy8gICBpZih4aS5kaXN0YW5jZVRvKHhqKSA+IHNpLmJvdW5kaW5nU3BoZXJlUmFkaXVzICsgc2ouYm91bmRpbmdTcGhlcmVSYWRpdXMpewogICAgLy8gICAgICAgcmV0dXJuOwogICAgLy8gICB9CiAgICAvLyAgIC8vIENvbnN0cnVjdCBhIHRlbXAgaHVsbCBmb3IgZWFjaCB0cmlhbmdsZQogICAgLy8gICBjb25zdCBodWxsQiA9IG5ldyBDb252ZXhQb2x5aGVkcm9uKCk7CiAgICAvLyAgIGh1bGxCLmZhY2VzID0gW1swLDEsMl1dOwogICAgLy8gICBjb25zdCB2YSA9IG5ldyBWZWMzKCk7CiAgICAvLyAgIGNvbnN0IHZiID0gbmV3IFZlYzMoKTsKICAgIC8vICAgY29uc3QgdmMgPSBuZXcgVmVjMygpOwogICAgLy8gICBodWxsQi52ZXJ0aWNlcyA9IFsKICAgIC8vICAgICAgIHZhLAogICAgLy8gICAgICAgdmIsCiAgICAvLyAgICAgICB2YwogICAgLy8gICBdOwogICAgLy8gICBmb3IgKGxldCBpID0gMDsgaSA8IHNqLmluZGljZXMubGVuZ3RoIC8gMzsgaSsrKSB7CiAgICAvLyAgICAgICBjb25zdCB0cmlhbmdsZU5vcm1hbCA9IG5ldyBWZWMzKCk7CiAgICAvLyAgICAgICBzai5nZXROb3JtYWwoaSwgdHJpYW5nbGVOb3JtYWwpOwogICAgLy8gICAgICAgaHVsbEIuZmFjZU5vcm1hbHMgPSBbdHJpYW5nbGVOb3JtYWxdOwogICAgLy8gICAgICAgc2ouZ2V0VHJpYW5nbGVWZXJ0aWNlcyhpLCB2YSwgdmIsIHZjKTsKICAgIC8vICAgICAgIGxldCBkID0gc2kudGVzdFNlcEF4aXModHJpYW5nbGVOb3JtYWwsIGh1bGxCLCB4aSwgcWksIHhqLCBxaik7CiAgICAvLyAgICAgICBpZighZCl7CiAgICAvLyAgICAgICAgICAgdHJpYW5nbGVOb3JtYWwuc2NhbGUoLTEsIHRyaWFuZ2xlTm9ybWFsKTsKICAgIC8vICAgICAgICAgICBkID0gc2kudGVzdFNlcEF4aXModHJpYW5nbGVOb3JtYWwsIGh1bGxCLCB4aSwgcWksIHhqLCBxaik7CiAgICAvLyAgICAgICAgICAgaWYoIWQpewogICAgLy8gICAgICAgICAgICAgICBjb250aW51ZTsKICAgIC8vICAgICAgICAgICB9CiAgICAvLyAgICAgICB9CiAgICAvLyAgICAgICBjb25zdCByZXM6IENvbnZleFBvbHloZWRyb25Db250YWN0UG9pbnRbXSA9IFtdOwogICAgLy8gICAgICAgY29uc3QgcSA9IGNvbnZleENvbnZleF9xOwogICAgLy8gICAgICAgc2kuY2xpcEFnYWluc3RIdWxsKHhpLHFpLGh1bGxCLHhqLHFqLHRyaWFuZ2xlTm9ybWFsLC0xMDAsMTAwLHJlcyk7CiAgICAvLyAgICAgICBmb3IobGV0IGogPSAwOyBqICE9PSByZXMubGVuZ3RoOyBqKyspewogICAgLy8gICAgICAgICAgIGNvbnN0IHIgPSB0aGlzLmNyZWF0ZUNvbnRhY3RFcXVhdGlvbihiaSxiaixzaSxzaixyc2kscnNqKSwKICAgIC8vICAgICAgICAgICAgICAgcmkgPSByLnJpLAogICAgLy8gICAgICAgICAgICAgICByaiA9IHIucmo7CiAgICAvLyAgICAgICAgICAgci5uaS5jb3B5KHRyaWFuZ2xlTm9ybWFsKTsKICAgIC8vICAgICAgICAgICByLm5pLm5lZ2F0ZShyLm5pKTsKICAgIC8vICAgICAgICAgICByZXNbal0ubm9ybWFsLm5lZ2F0ZShxKTsKICAgIC8vICAgICAgICAgICBxLm11bHQocmVzW2pdLmRlcHRoLCBxKTsKICAgIC8vICAgICAgICAgICByZXNbal0ucG9pbnQudmFkZChxLCByaSk7CiAgICAvLyAgICAgICAgICAgcmouY29weShyZXNbal0ucG9pbnQpOwogICAgLy8gICAgICAgICAgIC8vIENvbnRhY3QgcG9pbnRzIGFyZSBpbiB3b3JsZCBjb29yZGluYXRlcy4gVHJhbnNmb3JtIGJhY2sgdG8gcmVsYXRpdmUKICAgIC8vICAgICAgICAgICByaS52c3ViKHhpLHJpKTsKICAgIC8vICAgICAgICAgICByai52c3ViKHhqLHJqKTsKICAgIC8vICAgICAgICAgICAvLyBNYWtlIHJlbGF0aXZlIHRvIGJvZGllcwogICAgLy8gICAgICAgICAgIHJpLnZhZGQoeGksIHJpKTsKICAgIC8vICAgICAgICAgICByaS52c3ViKGJpLnBvc2l0aW9uLCByaSk7CiAgICAvLyAgICAgICAgICAgcmoudmFkZCh4aiwgcmopOwogICAgLy8gICAgICAgICAgIHJqLnZzdWIoYmoucG9zaXRpb24sIHJqKTsKICAgIC8vICAgICAgICAgICByZXN1bHQucHVzaChyKTsKICAgIC8vICAgICAgIH0KICAgIC8vICAgfQogICAgLy8gfQoKCiAgfQogIGNvbnN0IGF2ZXJhZ2VOb3JtYWwgPSBuZXcgVmVjMygpOwogIGNvbnN0IGF2ZXJhZ2VDb250YWN0UG9pbnRBID0gbmV3IFZlYzMoKTsKICBjb25zdCBhdmVyYWdlQ29udGFjdFBvaW50QiA9IG5ldyBWZWMzKCk7CiAgY29uc3QgdG1wVmVjMSA9IG5ldyBWZWMzKCk7CiAgY29uc3QgdG1wVmVjMiA9IG5ldyBWZWMzKCk7CiAgY29uc3QgdG1wUXVhdDEgPSBuZXcgUXVhdGVybmlvbigpOwogIGNvbnN0IHRtcFF1YXQyID0gbmV3IFF1YXRlcm5pb24oKTsKCiAgY29uc3QgcGxhbmVUcmltZXNoX25vcm1hbCA9IG5ldyBWZWMzKCk7CiAgY29uc3QgcGxhbmVUcmltZXNoX3JlbHBvcyA9IG5ldyBWZWMzKCk7CiAgY29uc3QgcGxhbmVUcmltZXNoX3Byb2plY3RlZCA9IG5ldyBWZWMzKCk7CiAgY29uc3Qgc3BoZXJlVHJpbWVzaF9ub3JtYWwgPSBuZXcgVmVjMygpOwogIGNvbnN0IHNwaGVyZVRyaW1lc2hfcmVscG9zID0gbmV3IFZlYzMoKTsKICBuZXcgVmVjMygpOwogIGNvbnN0IHNwaGVyZVRyaW1lc2hfdiA9IG5ldyBWZWMzKCk7CiAgY29uc3Qgc3BoZXJlVHJpbWVzaF92MiA9IG5ldyBWZWMzKCk7CiAgY29uc3Qgc3BoZXJlVHJpbWVzaF9lZGdlVmVydGV4QSA9IG5ldyBWZWMzKCk7CiAgY29uc3Qgc3BoZXJlVHJpbWVzaF9lZGdlVmVydGV4QiA9IG5ldyBWZWMzKCk7CiAgY29uc3Qgc3BoZXJlVHJpbWVzaF9lZGdlVmVjdG9yID0gbmV3IFZlYzMoKTsKICBjb25zdCBzcGhlcmVUcmltZXNoX2VkZ2VWZWN0b3JVbml0ID0gbmV3IFZlYzMoKTsKICBjb25zdCBzcGhlcmVUcmltZXNoX2xvY2FsU3BoZXJlUG9zID0gbmV3IFZlYzMoKTsKICBjb25zdCBzcGhlcmVUcmltZXNoX3RtcCA9IG5ldyBWZWMzKCk7CiAgY29uc3Qgc3BoZXJlVHJpbWVzaF92YSA9IG5ldyBWZWMzKCk7CiAgY29uc3Qgc3BoZXJlVHJpbWVzaF92YiA9IG5ldyBWZWMzKCk7CiAgY29uc3Qgc3BoZXJlVHJpbWVzaF92YyA9IG5ldyBWZWMzKCk7CiAgY29uc3Qgc3BoZXJlVHJpbWVzaF9sb2NhbFNwaGVyZUFBQkIgPSBuZXcgQUFCQigpOwogIGNvbnN0IHNwaGVyZVRyaW1lc2hfdHJpYW5nbGVzID0gW107CiAgY29uc3QgcG9pbnRfb25fcGxhbmVfdG9fc3BoZXJlID0gbmV3IFZlYzMoKTsKICBjb25zdCBwbGFuZV90b19zcGhlcmVfb3J0aG8gPSBuZXcgVmVjMygpOyAvLyBTZWUgaHR0cDovL2J1bGxldHBoeXNpY3MuY29tL0J1bGxldC9CdWxsZXRGdWxsL1NwaGVyZVRyaWFuZ2xlRGV0ZWN0b3JfOGNwcF9zb3VyY2UuaHRtbAoKICBjb25zdCBwb2ludEluUG9seWdvbl9lZGdlID0gbmV3IFZlYzMoKTsKICBjb25zdCBwb2ludEluUG9seWdvbl9lZGdlX3hfbm9ybWFsID0gbmV3IFZlYzMoKTsKICBjb25zdCBwb2ludEluUG9seWdvbl92dHAgPSBuZXcgVmVjMygpOwoKICBmdW5jdGlvbiBwb2ludEluUG9seWdvbih2ZXJ0cywgbm9ybWFsLCBwKSB7CiAgICBsZXQgcG9zaXRpdmVSZXN1bHQgPSBudWxsOwogICAgY29uc3QgTiA9IHZlcnRzLmxlbmd0aDsKCiAgICBmb3IgKGxldCBpID0gMDsgaSAhPT0gTjsgaSsrKSB7CiAgICAgIGNvbnN0IHYgPSB2ZXJ0c1tpXTsgLy8gR2V0IGVkZ2UgdG8gdGhlIG5leHQgdmVydGV4CgogICAgICBjb25zdCBlZGdlID0gcG9pbnRJblBvbHlnb25fZWRnZTsKICAgICAgdmVydHNbKGkgKyAxKSAlIE5dLnZzdWIodiwgZWRnZSk7IC8vIEdldCBjcm9zcyBwcm9kdWN0IGJldHdlZW4gcG9seWdvbiBub3JtYWwgYW5kIHRoZSBlZGdlCgogICAgICBjb25zdCBlZGdlX3hfbm9ybWFsID0gcG9pbnRJblBvbHlnb25fZWRnZV94X25vcm1hbDsgLy9jb25zdCBlZGdlX3hfbm9ybWFsID0gbmV3IFZlYzMoKTsKCiAgICAgIGVkZ2UuY3Jvc3Mobm9ybWFsLCBlZGdlX3hfbm9ybWFsKTsgLy8gR2V0IHZlY3RvciBiZXR3ZWVuIHBvaW50IGFuZCBjdXJyZW50IHZlcnRleAoKICAgICAgY29uc3QgdmVydGV4X3RvX3AgPSBwb2ludEluUG9seWdvbl92dHA7CiAgICAgIHAudnN1Yih2LCB2ZXJ0ZXhfdG9fcCk7IC8vIFRoaXMgZG90IHByb2R1Y3QgZGV0ZXJtaW5lcyB3aGljaCBzaWRlIG9mIHRoZSBlZGdlIHRoZSBwb2ludCBpcwoKICAgICAgY29uc3QgciA9IGVkZ2VfeF9ub3JtYWwuZG90KHZlcnRleF90b19wKTsgLy8gSWYgYWxsIHN1Y2ggZG90IHByb2R1Y3RzIGhhdmUgc2FtZSBzaWduLCB3ZSBhcmUgaW5zaWRlIHRoZSBwb2x5Z29uLgoKICAgICAgaWYgKHBvc2l0aXZlUmVzdWx0ID09PSBudWxsIHx8IHIgPiAwICYmIHBvc2l0aXZlUmVzdWx0ID09PSB0cnVlIHx8IHIgPD0gMCAmJiBwb3NpdGl2ZVJlc3VsdCA9PT0gZmFsc2UpIHsKICAgICAgICBpZiAocG9zaXRpdmVSZXN1bHQgPT09IG51bGwpIHsKICAgICAgICAgIHBvc2l0aXZlUmVzdWx0ID0gciA+IDA7CiAgICAgICAgfQoKICAgICAgICBjb250aW51ZTsKICAgICAgfSBlbHNlIHsKICAgICAgICByZXR1cm4gZmFsc2U7IC8vIEVuY291bnRlcmVkIHNvbWUgb3RoZXIgc2lnbi4gRXhpdC4KICAgICAgfQogICAgfSAvLyBJZiB3ZSBnb3QgaGVyZSwgYWxsIGRvdCBwcm9kdWN0cyB3ZXJlIG9mIHRoZSBzYW1lIHNpZ24uCgoKICAgIHJldHVybiB0cnVlOwogIH0KCiAgY29uc3QgYm94X3RvX3NwaGVyZSA9IG5ldyBWZWMzKCk7CiAgY29uc3Qgc3BoZXJlQm94X25zID0gbmV3IFZlYzMoKTsKICBjb25zdCBzcGhlcmVCb3hfbnMxID0gbmV3IFZlYzMoKTsKICBjb25zdCBzcGhlcmVCb3hfbnMyID0gbmV3IFZlYzMoKTsKICBjb25zdCBzcGhlcmVCb3hfc2lkZXMgPSBbbmV3IFZlYzMoKSwgbmV3IFZlYzMoKSwgbmV3IFZlYzMoKSwgbmV3IFZlYzMoKSwgbmV3IFZlYzMoKSwgbmV3IFZlYzMoKV07CiAgY29uc3Qgc3BoZXJlQm94X3NwaGVyZV90b19jb3JuZXIgPSBuZXcgVmVjMygpOwogIGNvbnN0IHNwaGVyZUJveF9zaWRlX25zID0gbmV3IFZlYzMoKTsKICBjb25zdCBzcGhlcmVCb3hfc2lkZV9uczEgPSBuZXcgVmVjMygpOwogIGNvbnN0IHNwaGVyZUJveF9zaWRlX25zMiA9IG5ldyBWZWMzKCk7CiAgY29uc3QgY29udmV4X3RvX3NwaGVyZSA9IG5ldyBWZWMzKCk7CiAgY29uc3Qgc3BoZXJlQ29udmV4X2VkZ2UgPSBuZXcgVmVjMygpOwogIGNvbnN0IHNwaGVyZUNvbnZleF9lZGdlVW5pdCA9IG5ldyBWZWMzKCk7CiAgY29uc3Qgc3BoZXJlQ29udmV4X3NwaGVyZVRvQ29ybmVyID0gbmV3IFZlYzMoKTsKICBjb25zdCBzcGhlcmVDb252ZXhfd29ybGRDb3JuZXIgPSBuZXcgVmVjMygpOwogIGNvbnN0IHNwaGVyZUNvbnZleF93b3JsZE5vcm1hbCA9IG5ldyBWZWMzKCk7CiAgY29uc3Qgc3BoZXJlQ29udmV4X3dvcmxkUG9pbnQgPSBuZXcgVmVjMygpOwogIGNvbnN0IHNwaGVyZUNvbnZleF93b3JsZFNwaGVyZVBvaW50Q2xvc2VzdFRvUGxhbmUgPSBuZXcgVmVjMygpOwogIGNvbnN0IHNwaGVyZUNvbnZleF9wZW5ldHJhdGlvblZlYyA9IG5ldyBWZWMzKCk7CiAgY29uc3Qgc3BoZXJlQ29udmV4X3NwaGVyZVRvV29ybGRQb2ludCA9IG5ldyBWZWMzKCk7CiAgbmV3IFZlYzMoKTsKICBuZXcgVmVjMygpOwogIGNvbnN0IHBsYW5lQ29udmV4X3YgPSBuZXcgVmVjMygpOwogIGNvbnN0IHBsYW5lQ29udmV4X25vcm1hbCA9IG5ldyBWZWMzKCk7CiAgY29uc3QgcGxhbmVDb252ZXhfcmVscG9zID0gbmV3IFZlYzMoKTsKICBjb25zdCBwbGFuZUNvbnZleF9wcm9qZWN0ZWQgPSBuZXcgVmVjMygpOwogIGNvbnN0IGNvbnZleENvbnZleF9zZXBBeGlzID0gbmV3IFZlYzMoKTsKICBjb25zdCBjb252ZXhDb252ZXhfcSA9IG5ldyBWZWMzKCk7CiAgY29uc3QgcGFydGljbGVQbGFuZV9ub3JtYWwgPSBuZXcgVmVjMygpOwogIGNvbnN0IHBhcnRpY2xlUGxhbmVfcmVscG9zID0gbmV3IFZlYzMoKTsKICBjb25zdCBwYXJ0aWNsZVBsYW5lX3Byb2plY3RlZCA9IG5ldyBWZWMzKCk7CiAgY29uc3QgcGFydGljbGVTcGhlcmVfbm9ybWFsID0gbmV3IFZlYzMoKTsgLy8gV0lQCgogIGNvbnN0IGNxaiA9IG5ldyBRdWF0ZXJuaW9uKCk7CiAgY29uc3QgY29udmV4UGFydGljbGVfbG9jYWwgPSBuZXcgVmVjMygpOwogIG5ldyBWZWMzKCk7CiAgY29uc3QgY29udmV4UGFydGljbGVfcGVuZXRyYXRlZEZhY2VOb3JtYWwgPSBuZXcgVmVjMygpOwogIGNvbnN0IGNvbnZleFBhcnRpY2xlX3ZlcnRleFRvUGFydGljbGUgPSBuZXcgVmVjMygpOwogIGNvbnN0IGNvbnZleFBhcnRpY2xlX3dvcmxkUGVuZXRyYXRpb25WZWMgPSBuZXcgVmVjMygpOwogIGNvbnN0IGNvbnZleEhlaWdodGZpZWxkX3RtcDEgPSBuZXcgVmVjMygpOwogIGNvbnN0IGNvbnZleEhlaWdodGZpZWxkX3RtcDIgPSBuZXcgVmVjMygpOwogIGNvbnN0IGNvbnZleEhlaWdodGZpZWxkX2ZhY2VMaXN0ID0gWzBdOwogIGNvbnN0IHNwaGVyZUhlaWdodGZpZWxkX3RtcDEgPSBuZXcgVmVjMygpOwogIGNvbnN0IHNwaGVyZUhlaWdodGZpZWxkX3RtcDIgPSBuZXcgVmVjMygpOwoKICBjbGFzcyBPdmVybGFwS2VlcGVyIHsKICAgIC8qKgogICAgICogQHRvZG8gUmVtb3ZlIHVzZWxlc3MgY29uc3RydWN0b3IKICAgICAqLwogICAgY29uc3RydWN0b3IoKSB7CiAgICAgIHRoaXMuY3VycmVudCA9IFtdOwogICAgICB0aGlzLnByZXZpb3VzID0gW107CiAgICB9CiAgICAvKioKICAgICAqIGdldEtleQogICAgICovCgoKICAgIGdldEtleShpLCBqKSB7CiAgICAgIGlmIChqIDwgaSkgewogICAgICAgIGNvbnN0IHRlbXAgPSBqOwogICAgICAgIGogPSBpOwogICAgICAgIGkgPSB0ZW1wOwogICAgICB9CgogICAgICByZXR1cm4gaSA8PCAxNiB8IGo7CiAgICB9CiAgICAvKioKICAgICAqIHNldAogICAgICovCgoKICAgIHNldChpLCBqKSB7CiAgICAgIC8vIEluc2VydGlvbiBzb3J0LiBUaGlzIHdheSB0aGUgZGlmZiB3aWxsIGhhdmUgbGluZWFyIGNvbXBsZXhpdHkuCiAgICAgIGNvbnN0IGtleSA9IHRoaXMuZ2V0S2V5KGksIGopOwogICAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5jdXJyZW50OwogICAgICBsZXQgaW5kZXggPSAwOwoKICAgICAgd2hpbGUgKGtleSA+IGN1cnJlbnRbaW5kZXhdKSB7CiAgICAgICAgaW5kZXgrKzsKICAgICAgfQoKICAgICAgaWYgKGtleSA9PT0gY3VycmVudFtpbmRleF0pIHsKICAgICAgICByZXR1cm47IC8vIFBhaXIgd2FzIGFscmVhZHkgYWRkZWQKICAgICAgfQoKICAgICAgZm9yIChsZXQgaiA9IGN1cnJlbnQubGVuZ3RoIC0gMTsgaiA+PSBpbmRleDsgai0tKSB7CiAgICAgICAgY3VycmVudFtqICsgMV0gPSBjdXJyZW50W2pdOwogICAgICB9CgogICAgICBjdXJyZW50W2luZGV4XSA9IGtleTsKICAgIH0KICAgIC8qKgogICAgICogdGljawogICAgICovCgoKICAgIHRpY2soKSB7CiAgICAgIGNvbnN0IHRtcCA9IHRoaXMuY3VycmVudDsKICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5wcmV2aW91czsKICAgICAgdGhpcy5wcmV2aW91cyA9IHRtcDsKICAgICAgdGhpcy5jdXJyZW50Lmxlbmd0aCA9IDA7CiAgICB9CiAgICAvKioKICAgICAqIGdldERpZmYKICAgICAqLwoKCiAgICBnZXREaWZmKGFkZGl0aW9ucywgcmVtb3ZhbHMpIHsKICAgICAgY29uc3QgYSA9IHRoaXMuY3VycmVudDsKICAgICAgY29uc3QgYiA9IHRoaXMucHJldmlvdXM7CiAgICAgIGNvbnN0IGFsID0gYS5sZW5ndGg7CiAgICAgIGNvbnN0IGJsID0gYi5sZW5ndGg7CiAgICAgIGxldCBqID0gMDsKCiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWw7IGkrKykgewogICAgICAgIGxldCBmb3VuZCA9IGZhbHNlOwogICAgICAgIGNvbnN0IGtleUEgPSBhW2ldOwoKICAgICAgICB3aGlsZSAoa2V5QSA+IGJbal0pIHsKICAgICAgICAgIGorKzsKICAgICAgICB9CgogICAgICAgIGZvdW5kID0ga2V5QSA9PT0gYltqXTsKCiAgICAgICAgaWYgKCFmb3VuZCkgewogICAgICAgICAgdW5wYWNrQW5kUHVzaChhZGRpdGlvbnMsIGtleUEpOwogICAgICAgIH0KICAgICAgfQoKICAgICAgaiA9IDA7CgogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsOyBpKyspIHsKICAgICAgICBsZXQgZm91bmQgPSBmYWxzZTsKICAgICAgICBjb25zdCBrZXlCID0gYltpXTsKCiAgICAgICAgd2hpbGUgKGtleUIgPiBhW2pdKSB7CiAgICAgICAgICBqKys7CiAgICAgICAgfQoKICAgICAgICBmb3VuZCA9IGFbal0gPT09IGtleUI7CgogICAgICAgIGlmICghZm91bmQpIHsKICAgICAgICAgIHVucGFja0FuZFB1c2gocmVtb3ZhbHMsIGtleUIpOwogICAgICAgIH0KICAgICAgfQogICAgfQoKICB9CgogIGZ1bmN0aW9uIHVucGFja0FuZFB1c2goYXJyYXksIGtleSkgewogICAgYXJyYXkucHVzaCgoa2V5ICYgMHhmZmZmMDAwMCkgPj4gMTYsIGtleSAmIDB4MDAwMGZmZmYpOwogIH0KCiAgY29uc3QgZ2V0S2V5ID0gKGksIGopID0+IGkgPCBqID8gYCR7aX0tJHtqfWAgOiBgJHtqfS0ke2l9YDsKICAvKioKICAgKiBUdXBsZURpY3Rpb25hcnkKICAgKi8KCgogIGNsYXNzIFR1cGxlRGljdGlvbmFyeSB7CiAgICBjb25zdHJ1Y3RvcigpIHsKICAgICAgdGhpcy5kYXRhID0gewogICAgICAgIGtleXM6IFtdCiAgICAgIH07CiAgICB9CgogICAgLyoqIGdldCAqLwogICAgZ2V0KGksIGopIHsKICAgICAgY29uc3Qga2V5ID0gZ2V0S2V5KGksIGopOwogICAgICByZXR1cm4gdGhpcy5kYXRhW2tleV07CiAgICB9CiAgICAvKiogc2V0ICovCgoKICAgIHNldChpLCBqLCB2YWx1ZSkgewogICAgICBjb25zdCBrZXkgPSBnZXRLZXkoaSwgaik7IC8vIENoZWNrIGlmIGtleSBhbHJlYWR5IGV4aXN0cwoKICAgICAgaWYgKCF0aGlzLmdldChpLCBqKSkgewogICAgICAgIHRoaXMuZGF0YS5rZXlzLnB1c2goa2V5KTsKICAgICAgfQoKICAgICAgdGhpcy5kYXRhW2tleV0gPSB2YWx1ZTsKICAgIH0KICAgIC8qKiBkZWxldGUgKi8KCgogICAgZGVsZXRlKGksIGopIHsKICAgICAgY29uc3Qga2V5ID0gZ2V0S2V5KGksIGopOwogICAgICBjb25zdCBpbmRleCA9IHRoaXMuZGF0YS5rZXlzLmluZGV4T2Yoa2V5KTsKCiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHsKICAgICAgICB0aGlzLmRhdGEua2V5cy5zcGxpY2UoaW5kZXgsIDEpOwogICAgICB9CgogICAgICBkZWxldGUgdGhpcy5kYXRhW2tleV07CiAgICB9CiAgICAvKiogcmVzZXQgKi8KCgogICAgcmVzZXQoKSB7CiAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmRhdGE7CiAgICAgIGNvbnN0IGtleXMgPSBkYXRhLmtleXM7CgogICAgICB3aGlsZSAoa2V5cy5sZW5ndGggPiAwKSB7CiAgICAgICAgY29uc3Qga2V5ID0ga2V5cy5wb3AoKTsKICAgICAgICBkZWxldGUgZGF0YVtrZXldOwogICAgICB9CiAgICB9CgogIH0KCiAgLyoqCiAgICogVGhlIHBoeXNpY3Mgd29ybGQKICAgKi8KICBjbGFzcyBXb3JsZCBleHRlbmRzIEV2ZW50VGFyZ2V0IHsKICAgIC8qKgogICAgICogQ3VycmVudGx5IC8gbGFzdCB1c2VkIHRpbWVzdGVwLiBJcyBzZXQgdG8gLTEgaWYgbm90IGF2YWlsYWJsZS4gVGhpcyB2YWx1ZSBpcyB1cGRhdGVkIGJlZm9yZSBlYWNoIGludGVybmFsIHN0ZXAsIHdoaWNoIG1lYW5zIHRoYXQgaXQgaXMgImZyZXNoIiBpbnNpZGUgZXZlbnQgY2FsbGJhY2tzLgogICAgICovCgogICAgLyoqCiAgICAgKiBNYWtlcyBib2RpZXMgZ28gdG8gc2xlZXAgd2hlbiB0aGV5J3ZlIGJlZW4gaW5hY3RpdmUuCiAgICAgKiBAZGVmYXVsdCBmYWxzZQogICAgICovCgogICAgLyoqCiAgICAgKiBBbGwgdGhlIGN1cnJlbnQgY29udGFjdHMgKGluc3RhbmNlcyBvZiBDb250YWN0RXF1YXRpb24pIGluIHRoZSB3b3JsZC4KICAgICAqLwoKICAgIC8qKgogICAgICogSG93IG9mdGVuIHRvIG5vcm1hbGl6ZSBxdWF0ZXJuaW9ucy4gU2V0IHRvIDAgZm9yIGV2ZXJ5IHN0ZXAsIDEgZm9yIGV2ZXJ5IHNlY29uZCBldGMuLiBBIGxhcmdlciB2YWx1ZSBpbmNyZWFzZXMgcGVyZm9ybWFuY2UuIElmIGJvZGllcyB0ZW5kIHRvIGV4cGxvZGUsIHNldCB0byBhIHNtYWxsZXIgdmFsdWUgKHplcm8gdG8gYmUgc3VyZSBub3RoaW5nIGNhbiBnbyB3cm9uZykuCiAgICAgKiBAZGVmYXVsdCAwCiAgICAgKi8KCiAgICAvKioKICAgICAqIFNldCB0byB0cnVlIHRvIHVzZSBmYXN0IHF1YXRlcm5pb24gbm9ybWFsaXphdGlvbi4gSXQgaXMgb2Z0ZW4gZW5vdWdoIGFjY3VyYXRlIHRvIHVzZS4KICAgICAqIElmIGJvZGllcyB0ZW5kIHRvIGV4cGxvZGUsIHNldCB0byBmYWxzZS4KICAgICAqIEBkZWZhdWx0IGZhbHNlCiAgICAgKi8KCiAgICAvKioKICAgICAqIFRoZSB3YWxsLWNsb2NrIHRpbWUgc2luY2Ugc2ltdWxhdGlvbiBzdGFydC4KICAgICAqLwoKICAgIC8qKgogICAgICogTnVtYmVyIG9mIHRpbWVzdGVwcyB0YWtlbiBzaW5jZSBzdGFydC4KICAgICAqLwoKICAgIC8qKgogICAgICogRGVmYXVsdCBhbmQgbGFzdCB0aW1lc3RlcCBzaXplcy4KICAgICAqLwoKICAgIC8qKgogICAgICogVGhlIGdyYXZpdHkgb2YgdGhlIHdvcmxkLgogICAgICovCgogICAgLyoqCiAgICAgKiBHcmF2aXR5IHRvIHVzZSB3aGVuIGFwcHJveGltYXRpbmcgdGhlIGZyaWN0aW9uIG1heCBmb3JjZSAobXUqbWFzcypncmF2aXR5KS4KICAgICAqIElmIHVuZGVmaW5lZCwgZ2xvYmFsIGdyYXZpdHkgd2lsbCBiZSB1c2VkLgogICAgICogVXNlIHRvIGVuYWJsZSBmcmljdGlvbiBpbiBhIFdvcmxkIHdpdGggYSBudWxsIGdyYXZpdHkgdmVjdG9yIChubyBncmF2aXR5KS4KICAgICAqLwoKICAgIC8qKgogICAgICogVGhlIGJyb2FkcGhhc2UgYWxnb3JpdGhtIHRvIHVzZS4KICAgICAqIEBkZWZhdWx0IE5haXZlQnJvYWRwaGFzZQogICAgICovCgogICAgLyoqCiAgICAgKiBBbGwgYm9kaWVzIGluIHRoaXMgd29ybGQKICAgICAqLwoKICAgIC8qKgogICAgICogVHJ1ZSBpZiBhbnkgYm9kaWVzIGFyZSBub3Qgc2xlZXBpbmcsIGZhbHNlIGlmIGV2ZXJ5IGJvZHkgaXMgc2xlZXBpbmcuCiAgICAgKi8KCiAgICAvKioKICAgICAqIFRoZSBzb2x2ZXIgYWxnb3JpdGhtIHRvIHVzZS4KICAgICAqIEBkZWZhdWx0IEdTU29sdmVyCiAgICAgKi8KCiAgICAvKioKICAgICAqIGNvbGxpc2lvbk1hdHJpeAogICAgICovCgogICAgLyoqCiAgICAgKiBDb2xsaXNpb25NYXRyaXggZnJvbSB0aGUgcHJldmlvdXMgc3RlcC4KICAgICAqLwoKICAgIC8qKgogICAgICogQWxsIGFkZGVkIGNvbnRhY3RtYXRlcmlhbHMuCiAgICAgKi8KCiAgICAvKioKICAgICAqIFVzZWQgdG8gbG9vayB1cCBhIENvbnRhY3RNYXRlcmlhbCBnaXZlbiB0d28gaW5zdGFuY2VzIG9mIE1hdGVyaWFsLgogICAgICovCgogICAgLyoqCiAgICAgKiBUaGUgZGVmYXVsdCBtYXRlcmlhbCBvZiB0aGUgYm9kaWVzLgogICAgICovCgogICAgLyoqCiAgICAgKiBUaGlzIGNvbnRhY3QgbWF0ZXJpYWwgaXMgdXNlZCBpZiBubyBzdWl0YWJsZSBjb250YWN0bWF0ZXJpYWwgaXMgZm91bmQgZm9yIGEgY29udGFjdC4KICAgICAqLwoKICAgIC8qKgogICAgICogVGltZSBhY2N1bXVsYXRvciBmb3IgaW50ZXJwb2xhdGlvbi4KICAgICAqIEBzZWUgaHR0cHM6Ly9nYWZmZXJvbmdhbWVzLmNvbS9nYW1lLXBoeXNpY3MvZml4LXlvdXItdGltZXN0ZXAvCiAgICAgKi8KCiAgICAvKioKICAgICAqIERpc3BhdGNoZWQgYWZ0ZXIgYSBib2R5IGhhcyBiZWVuIGFkZGVkIHRvIHRoZSB3b3JsZC4KICAgICAqLwoKICAgIC8qKgogICAgICogRGlzcGF0Y2hlZCBhZnRlciBhIGJvZHkgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSB3b3JsZC4KICAgICAqLwogICAgY29uc3RydWN0b3Iob3B0aW9ucykgewogICAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7CiAgICAgICAgb3B0aW9ucyA9IHt9OwogICAgICB9CgogICAgICBzdXBlcigpOwogICAgICB0aGlzLmR0ID0gLTE7CiAgICAgIHRoaXMuYWxsb3dTbGVlcCA9ICEhb3B0aW9ucy5hbGxvd1NsZWVwOwogICAgICB0aGlzLmNvbnRhY3RzID0gW107CiAgICAgIHRoaXMuZnJpY3Rpb25FcXVhdGlvbnMgPSBbXTsKICAgICAgdGhpcy5xdWF0Tm9ybWFsaXplU2tpcCA9IG9wdGlvbnMucXVhdE5vcm1hbGl6ZVNraXAgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMucXVhdE5vcm1hbGl6ZVNraXAgOiAwOwogICAgICB0aGlzLnF1YXROb3JtYWxpemVGYXN0ID0gb3B0aW9ucy5xdWF0Tm9ybWFsaXplRmFzdCAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5xdWF0Tm9ybWFsaXplRmFzdCA6IGZhbHNlOwogICAgICB0aGlzLnRpbWUgPSAwLjA7CiAgICAgIHRoaXMuc3RlcG51bWJlciA9IDA7CiAgICAgIHRoaXMuZGVmYXVsdF9kdCA9IDEgLyA2MDsKICAgICAgdGhpcy5uZXh0SWQgPSAwOwogICAgICB0aGlzLmdyYXZpdHkgPSBuZXcgVmVjMygpOwoKICAgICAgaWYgKG9wdGlvbnMuZ3Jhdml0eSkgewogICAgICAgIHRoaXMuZ3Jhdml0eS5jb3B5KG9wdGlvbnMuZ3Jhdml0eSk7CiAgICAgIH0KCiAgICAgIGlmIChvcHRpb25zLmZyaWN0aW9uR3Jhdml0eSkgewogICAgICAgIHRoaXMuZnJpY3Rpb25HcmF2aXR5ID0gbmV3IFZlYzMoKTsKICAgICAgICB0aGlzLmZyaWN0aW9uR3Jhdml0eS5jb3B5KG9wdGlvbnMuZnJpY3Rpb25HcmF2aXR5KTsKICAgICAgfQoKICAgICAgdGhpcy5icm9hZHBoYXNlID0gb3B0aW9ucy5icm9hZHBoYXNlICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmJyb2FkcGhhc2UgOiBuZXcgTmFpdmVCcm9hZHBoYXNlKCk7CiAgICAgIHRoaXMuYm9kaWVzID0gW107CiAgICAgIHRoaXMuaGFzQWN0aXZlQm9kaWVzID0gZmFsc2U7CiAgICAgIHRoaXMuc29sdmVyID0gb3B0aW9ucy5zb2x2ZXIgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuc29sdmVyIDogbmV3IEdTU29sdmVyKCk7CiAgICAgIHRoaXMuY29uc3RyYWludHMgPSBbXTsKICAgICAgdGhpcy5uYXJyb3dwaGFzZSA9IG5ldyBOYXJyb3dwaGFzZSh0aGlzKTsKICAgICAgdGhpcy5jb2xsaXNpb25NYXRyaXggPSBuZXcgQXJyYXlDb2xsaXNpb25NYXRyaXgoKTsKICAgICAgdGhpcy5jb2xsaXNpb25NYXRyaXhQcmV2aW91cyA9IG5ldyBBcnJheUNvbGxpc2lvbk1hdHJpeCgpOwogICAgICB0aGlzLmJvZHlPdmVybGFwS2VlcGVyID0gbmV3IE92ZXJsYXBLZWVwZXIoKTsKICAgICAgdGhpcy5zaGFwZU92ZXJsYXBLZWVwZXIgPSBuZXcgT3ZlcmxhcEtlZXBlcigpOwogICAgICB0aGlzLmNvbnRhY3RtYXRlcmlhbHMgPSBbXTsKICAgICAgdGhpcy5jb250YWN0TWF0ZXJpYWxUYWJsZSA9IG5ldyBUdXBsZURpY3Rpb25hcnkoKTsKICAgICAgdGhpcy5kZWZhdWx0TWF0ZXJpYWwgPSBuZXcgTWF0ZXJpYWwoJ2RlZmF1bHQnKTsKICAgICAgdGhpcy5kZWZhdWx0Q29udGFjdE1hdGVyaWFsID0gbmV3IENvbnRhY3RNYXRlcmlhbCh0aGlzLmRlZmF1bHRNYXRlcmlhbCwgdGhpcy5kZWZhdWx0TWF0ZXJpYWwsIHsKICAgICAgICBmcmljdGlvbjogMC4zLAogICAgICAgIHJlc3RpdHV0aW9uOiAwLjAKICAgICAgfSk7CiAgICAgIHRoaXMuZG9Qcm9maWxpbmcgPSBmYWxzZTsKICAgICAgdGhpcy5wcm9maWxlID0gewogICAgICAgIHNvbHZlOiAwLAogICAgICAgIG1ha2VDb250YWN0Q29uc3RyYWludHM6IDAsCiAgICAgICAgYnJvYWRwaGFzZTogMCwKICAgICAgICBpbnRlZ3JhdGU6IDAsCiAgICAgICAgbmFycm93cGhhc2U6IDAKICAgICAgfTsKICAgICAgdGhpcy5hY2N1bXVsYXRvciA9IDA7CiAgICAgIHRoaXMuc3Vic3lzdGVtcyA9IFtdOwogICAgICB0aGlzLmFkZEJvZHlFdmVudCA9IHsKICAgICAgICB0eXBlOiAnYWRkQm9keScsCiAgICAgICAgYm9keTogbnVsbAogICAgICB9OwogICAgICB0aGlzLnJlbW92ZUJvZHlFdmVudCA9IHsKICAgICAgICB0eXBlOiAncmVtb3ZlQm9keScsCiAgICAgICAgYm9keTogbnVsbAogICAgICB9OwogICAgICB0aGlzLmlkVG9Cb2R5TWFwID0ge307CiAgICAgIHRoaXMuYnJvYWRwaGFzZS5zZXRXb3JsZCh0aGlzKTsKICAgIH0KICAgIC8qKgogICAgICogR2V0IHRoZSBjb250YWN0IG1hdGVyaWFsIGJldHdlZW4gbWF0ZXJpYWxzIG0xIGFuZCBtMgogICAgICogQHJldHVybiBUaGUgY29udGFjdCBtYXRlcmlhbCBpZiBpdCB3YXMgZm91bmQuCiAgICAgKi8KCgogICAgZ2V0Q29udGFjdE1hdGVyaWFsKG0xLCBtMikgewogICAgICByZXR1cm4gdGhpcy5jb250YWN0TWF0ZXJpYWxUYWJsZS5nZXQobTEuaWQsIG0yLmlkKTsKICAgIH0KICAgIC8qKgogICAgICogU3RvcmUgb2xkIGNvbGxpc2lvbiBzdGF0ZSBpbmZvCiAgICAgKi8KCgogICAgY29sbGlzaW9uTWF0cml4VGljaygpIHsKICAgICAgY29uc3QgdGVtcCA9IHRoaXMuY29sbGlzaW9uTWF0cml4UHJldmlvdXM7CiAgICAgIHRoaXMuY29sbGlzaW9uTWF0cml4UHJldmlvdXMgPSB0aGlzLmNvbGxpc2lvbk1hdHJpeDsKICAgICAgdGhpcy5jb2xsaXNpb25NYXRyaXggPSB0ZW1wOwogICAgICB0aGlzLmNvbGxpc2lvbk1hdHJpeC5yZXNldCgpOwogICAgICB0aGlzLmJvZHlPdmVybGFwS2VlcGVyLnRpY2soKTsKICAgICAgdGhpcy5zaGFwZU92ZXJsYXBLZWVwZXIudGljaygpOwogICAgfQogICAgLyoqCiAgICAgKiBBZGQgYSBjb25zdHJhaW50IHRvIHRoZSBzaW11bGF0aW9uLgogICAgICovCgoKICAgIGFkZENvbnN0cmFpbnQoYykgewogICAgICB0aGlzLmNvbnN0cmFpbnRzLnB1c2goYyk7CiAgICB9CiAgICAvKioKICAgICAqIFJlbW92ZXMgYSBjb25zdHJhaW50CiAgICAgKi8KCgogICAgcmVtb3ZlQ29uc3RyYWludChjKSB7CiAgICAgIGNvbnN0IGlkeCA9IHRoaXMuY29uc3RyYWludHMuaW5kZXhPZihjKTsKCiAgICAgIGlmIChpZHggIT09IC0xKSB7CiAgICAgICAgdGhpcy5jb25zdHJhaW50cy5zcGxpY2UoaWR4LCAxKTsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBSYXljYXN0IHRlc3QKICAgICAqIEBkZXByZWNhdGVkIFVzZSAucmF5Y2FzdEFsbCwgLnJheWNhc3RDbG9zZXN0IG9yIC5yYXljYXN0QW55IGluc3RlYWQuCiAgICAgKi8KCgogICAgcmF5VGVzdChmcm9tLCB0bywgcmVzdWx0KSB7CiAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBSYXljYXN0UmVzdWx0KSB7CiAgICAgICAgLy8gRG8gcmF5Y2FzdENsb3Nlc3QKICAgICAgICB0aGlzLnJheWNhc3RDbG9zZXN0KGZyb20sIHRvLCB7CiAgICAgICAgICBza2lwQmFja2ZhY2VzOiB0cnVlCiAgICAgICAgfSwgcmVzdWx0KTsKICAgICAgfSBlbHNlIHsKICAgICAgICAvLyBEbyByYXljYXN0QWxsCiAgICAgICAgdGhpcy5yYXljYXN0QWxsKGZyb20sIHRvLCB7CiAgICAgICAgICBza2lwQmFja2ZhY2VzOiB0cnVlCiAgICAgICAgfSwgcmVzdWx0KTsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBSYXkgY2FzdCBhZ2FpbnN0IGFsbCBib2RpZXMuIFRoZSBwcm92aWRlZCBjYWxsYmFjayB3aWxsIGJlIGV4ZWN1dGVkIGZvciBlYWNoIGhpdCB3aXRoIGEgUmF5Y2FzdFJlc3VsdCBhcyBzaW5nbGUgYXJndW1lbnQuCiAgICAgKiBAcmV0dXJuIFRydWUgaWYgYW55IGJvZHkgd2FzIGhpdC4KICAgICAqLwoKCiAgICByYXljYXN0QWxsKGZyb20sIHRvLCBvcHRpb25zLCBjYWxsYmFjaykgewogICAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7CiAgICAgICAgb3B0aW9ucyA9IHt9OwogICAgICB9CgogICAgICBvcHRpb25zLm1vZGUgPSBSYXkuQUxMOwogICAgICBvcHRpb25zLmZyb20gPSBmcm9tOwogICAgICBvcHRpb25zLnRvID0gdG87CiAgICAgIG9wdGlvbnMuY2FsbGJhY2sgPSBjYWxsYmFjazsKICAgICAgcmV0dXJuIHRtcFJheS5pbnRlcnNlY3RXb3JsZCh0aGlzLCBvcHRpb25zKTsKICAgIH0KICAgIC8qKgogICAgICogUmF5IGNhc3QsIGFuZCBzdG9wIGF0IHRoZSBmaXJzdCByZXN1bHQuIE5vdGUgdGhhdCB0aGUgb3JkZXIgaXMgcmFuZG9tIC0gYnV0IHRoZSBtZXRob2QgaXMgZmFzdC4KICAgICAqIEByZXR1cm4gVHJ1ZSBpZiBhbnkgYm9keSB3YXMgaGl0LgogICAgICovCgoKICAgIHJheWNhc3RBbnkoZnJvbSwgdG8sIG9wdGlvbnMsIHJlc3VsdCkgewogICAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7CiAgICAgICAgb3B0aW9ucyA9IHt9OwogICAgICB9CgogICAgICBvcHRpb25zLm1vZGUgPSBSYXkuQU5ZOwogICAgICBvcHRpb25zLmZyb20gPSBmcm9tOwogICAgICBvcHRpb25zLnRvID0gdG87CiAgICAgIG9wdGlvbnMucmVzdWx0ID0gcmVzdWx0OwogICAgICByZXR1cm4gdG1wUmF5LmludGVyc2VjdFdvcmxkKHRoaXMsIG9wdGlvbnMpOwogICAgfQogICAgLyoqCiAgICAgKiBSYXkgY2FzdCwgYW5kIHJldHVybiBpbmZvcm1hdGlvbiBvZiB0aGUgY2xvc2VzdCBoaXQuCiAgICAgKiBAcmV0dXJuIFRydWUgaWYgYW55IGJvZHkgd2FzIGhpdC4KICAgICAqLwoKCiAgICByYXljYXN0Q2xvc2VzdChmcm9tLCB0bywgb3B0aW9ucywgcmVzdWx0KSB7CiAgICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsKICAgICAgICBvcHRpb25zID0ge307CiAgICAgIH0KCiAgICAgIG9wdGlvbnMubW9kZSA9IFJheS5DTE9TRVNUOwogICAgICBvcHRpb25zLmZyb20gPSBmcm9tOwogICAgICBvcHRpb25zLnRvID0gdG87CiAgICAgIG9wdGlvbnMucmVzdWx0ID0gcmVzdWx0OwogICAgICByZXR1cm4gdG1wUmF5LmludGVyc2VjdFdvcmxkKHRoaXMsIG9wdGlvbnMpOwogICAgfQogICAgLyoqCiAgICAgKiBBZGQgYSByaWdpZCBib2R5IHRvIHRoZSBzaW11bGF0aW9uLgogICAgICogQHRvZG8gSWYgdGhlIHNpbXVsYXRpb24gaGFzIG5vdCB5ZXQgc3RhcnRlZCwgd2h5IHJlY3JldGUgYW5kIGNvcHkgYXJyYXlzIGZvciBlYWNoIGJvZHk/IEFjY3VtdWxhdGUgaW4gZHluYW1pYyBhcnJheXMgaW4gdGhpcyBjYXNlLgogICAgICogQHRvZG8gQWRkaW5nIGFuIGFycmF5IG9mIGJvZGllcyBzaG91bGQgYmUgcG9zc2libGUuIFRoaXMgd291bGQgc2F2ZSBzb21lIGxvb3BzIHRvbwogICAgICovCgoKICAgIGFkZEJvZHkoYm9keSkgewogICAgICBpZiAodGhpcy5ib2RpZXMuaW5jbHVkZXMoYm9keSkpIHsKICAgICAgICByZXR1cm47CiAgICAgIH0KCiAgICAgIGJvZHkuaW5kZXggPSB0aGlzLmJvZGllcy5sZW5ndGg7CiAgICAgIHRoaXMuYm9kaWVzLnB1c2goYm9keSk7CiAgICAgIGJvZHkud29ybGQgPSB0aGlzOwogICAgICBib2R5LmluaXRQb3NpdGlvbi5jb3B5KGJvZHkucG9zaXRpb24pOwogICAgICBib2R5LmluaXRWZWxvY2l0eS5jb3B5KGJvZHkudmVsb2NpdHkpOwogICAgICBib2R5LnRpbWVMYXN0U2xlZXB5ID0gdGhpcy50aW1lOwoKICAgICAgaWYgKGJvZHkgaW5zdGFuY2VvZiBCb2R5KSB7CiAgICAgICAgYm9keS5pbml0QW5ndWxhclZlbG9jaXR5LmNvcHkoYm9keS5hbmd1bGFyVmVsb2NpdHkpOwogICAgICAgIGJvZHkuaW5pdFF1YXRlcm5pb24uY29weShib2R5LnF1YXRlcm5pb24pOwogICAgICB9CgogICAgICB0aGlzLmNvbGxpc2lvbk1hdHJpeC5zZXROdW1PYmplY3RzKHRoaXMuYm9kaWVzLmxlbmd0aCk7CiAgICAgIHRoaXMuYWRkQm9keUV2ZW50LmJvZHkgPSBib2R5OwogICAgICB0aGlzLmlkVG9Cb2R5TWFwW2JvZHkuaWRdID0gYm9keTsKICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KHRoaXMuYWRkQm9keUV2ZW50KTsKICAgIH0KICAgIC8qKgogICAgICogUmVtb3ZlIGEgcmlnaWQgYm9keSBmcm9tIHRoZSBzaW11bGF0aW9uLgogICAgICovCgoKICAgIHJlbW92ZUJvZHkoYm9keSkgewogICAgICBib2R5LndvcmxkID0gbnVsbDsKICAgICAgY29uc3QgbiA9IHRoaXMuYm9kaWVzLmxlbmd0aCAtIDE7CiAgICAgIGNvbnN0IGJvZGllcyA9IHRoaXMuYm9kaWVzOwogICAgICBjb25zdCBpZHggPSBib2RpZXMuaW5kZXhPZihib2R5KTsKCiAgICAgIGlmIChpZHggIT09IC0xKSB7CiAgICAgICAgYm9kaWVzLnNwbGljZShpZHgsIDEpOyAvLyBUb2RvOiBzaG91bGQgdXNlIGEgZ2FyYmFnZSBmcmVlIG1ldGhvZAogICAgICAgIC8vIFJlY29tcHV0ZSBpbmRleAoKICAgICAgICBmb3IgKGxldCBpID0gMDsgaSAhPT0gYm9kaWVzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgICBib2RpZXNbaV0uaW5kZXggPSBpOwogICAgICAgIH0KCiAgICAgICAgdGhpcy5jb2xsaXNpb25NYXRyaXguc2V0TnVtT2JqZWN0cyhuKTsKICAgICAgICB0aGlzLnJlbW92ZUJvZHlFdmVudC5ib2R5ID0gYm9keTsKICAgICAgICBkZWxldGUgdGhpcy5pZFRvQm9keU1hcFtib2R5LmlkXTsKICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQodGhpcy5yZW1vdmVCb2R5RXZlbnQpOwogICAgICB9CiAgICB9CgogICAgZ2V0Qm9keUJ5SWQoaWQpIHsKICAgICAgcmV0dXJuIHRoaXMuaWRUb0JvZHlNYXBbaWRdOwogICAgfQogICAgLyoqCiAgICAgKiBAdG9kbyBNYWtlIGEgZmFzdGVyIG1hcAogICAgICovCgoKICAgIGdldFNoYXBlQnlJZChpZCkgewogICAgICBjb25zdCBib2RpZXMgPSB0aGlzLmJvZGllczsKCiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYm9kaWVzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgY29uc3Qgc2hhcGVzID0gYm9kaWVzW2ldLnNoYXBlczsKCiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaGFwZXMubGVuZ3RoOyBqKyspIHsKICAgICAgICAgIGNvbnN0IHNoYXBlID0gc2hhcGVzW2pdOwoKICAgICAgICAgIGlmIChzaGFwZS5pZCA9PT0gaWQpIHsKICAgICAgICAgICAgcmV0dXJuIHNoYXBlOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfQoKICAgICAgcmV0dXJuIG51bGw7CiAgICB9CiAgICAvKioKICAgICAqIEFkZHMgYSBjb250YWN0IG1hdGVyaWFsIHRvIHRoZSBXb3JsZAogICAgICovCgoKICAgIGFkZENvbnRhY3RNYXRlcmlhbChjbWF0KSB7CiAgICAgIC8vIEFkZCBjb250YWN0IG1hdGVyaWFsCiAgICAgIHRoaXMuY29udGFjdG1hdGVyaWFscy5wdXNoKGNtYXQpOyAvLyBBZGQgY3VycmVudCBjb250YWN0IG1hdGVyaWFsIHRvIHRoZSBtYXRlcmlhbCB0YWJsZQoKICAgICAgdGhpcy5jb250YWN0TWF0ZXJpYWxUYWJsZS5zZXQoY21hdC5tYXRlcmlhbHNbMF0uaWQsIGNtYXQubWF0ZXJpYWxzWzFdLmlkLCBjbWF0KTsKICAgIH0KICAgIC8qKgogICAgICogUmVtb3ZlcyBhIGNvbnRhY3QgbWF0ZXJpYWwgZnJvbSB0aGUgV29ybGQuCiAgICAgKi8KCgogICAgcmVtb3ZlQ29udGFjdE1hdGVyaWFsKGNtYXQpIHsKICAgICAgY29uc3QgaWR4ID0gdGhpcy5jb250YWN0bWF0ZXJpYWxzLmluZGV4T2YoY21hdCk7CgogICAgICBpZiAoaWR4ID09PSAtMSkgewogICAgICAgIHJldHVybjsKICAgICAgfQoKICAgICAgdGhpcy5jb250YWN0bWF0ZXJpYWxzLnNwbGljZShpZHgsIDEpOwogICAgICB0aGlzLmNvbnRhY3RNYXRlcmlhbFRhYmxlLmRlbGV0ZShjbWF0Lm1hdGVyaWFsc1swXS5pZCwgY21hdC5tYXRlcmlhbHNbMV0uaWQpOwogICAgfQogICAgLyoqCiAgICAgKiBTdGVwIHRoZSBzaW11bGF0aW9uIGZvcndhcmQga2VlcGluZyB0cmFjayBvZiBsYXN0IGNhbGxlZCB0aW1lCiAgICAgKiB0byBiZSBhYmxlIHRvIHN0ZXAgdGhlIHdvcmxkIGF0IGEgZml4ZWQgcmF0ZSwgaW5kZXBlbmRlbnRseSBvZiBmcmFtZXJhdGUuCiAgICAgKgogICAgICogQHBhcmFtIGR0IFRoZSBmaXhlZCB0aW1lIHN0ZXAgc2l6ZSB0byB1c2UgKGRlZmF1bHQ6IDEgLyA2MCkuCiAgICAgKiBAcGFyYW0gbWF4U3ViU3RlcHMgTWF4aW11bSBudW1iZXIgb2YgZml4ZWQgc3RlcHMgdG8gdGFrZSBwZXIgZnVuY3Rpb24gY2FsbCAoZGVmYXVsdDogMTApLgogICAgICogQHNlZSBodHRwczovL2dhZmZlcm9uZ2FtZXMuY29tL3Bvc3QvZml4X3lvdXJfdGltZXN0ZXAvCiAgICAgKiBAZXhhbXBsZQogICAgICogICAgIC8vIFJ1biB0aGUgc2ltdWxhdGlvbiBpbmRlcGVuZGVudGx5IG9mIGZyYW1lcmF0ZSBldmVyeSAxIC8gNjAgbXMKICAgICAqICAgICB3b3JsZC5maXhlZFN0ZXAoKQogICAgICovCgoKICAgIGZpeGVkU3RlcChkdCwgbWF4U3ViU3RlcHMpIHsKICAgICAgaWYgKGR0ID09PSB2b2lkIDApIHsKICAgICAgICBkdCA9IDEgLyA2MDsKICAgICAgfQoKICAgICAgaWYgKG1heFN1YlN0ZXBzID09PSB2b2lkIDApIHsKICAgICAgICBtYXhTdWJTdGVwcyA9IDEwOwogICAgICB9CgogICAgICBjb25zdCB0aW1lID0gcGVyZm9ybWFuY2Uubm93KCkgLyAxMDAwOyAvLyBzZWNvbmRzCgogICAgICBpZiAoIXRoaXMubGFzdENhbGxUaW1lKSB7CiAgICAgICAgdGhpcy5zdGVwKGR0LCB1bmRlZmluZWQsIG1heFN1YlN0ZXBzKTsKICAgICAgfSBlbHNlIHsKICAgICAgICBjb25zdCB0aW1lU2luY2VMYXN0Q2FsbGVkID0gdGltZSAtIHRoaXMubGFzdENhbGxUaW1lOwogICAgICAgIHRoaXMuc3RlcChkdCwgdGltZVNpbmNlTGFzdENhbGxlZCwgbWF4U3ViU3RlcHMpOwogICAgICB9CgogICAgICB0aGlzLmxhc3RDYWxsVGltZSA9IHRpbWU7CiAgICB9CiAgICAvKioKICAgICAqIFN0ZXAgdGhlIHBoeXNpY3Mgd29ybGQgZm9yd2FyZCBpbiB0aW1lLgogICAgICoKICAgICAqIFRoZXJlIGFyZSB0d28gbW9kZXMuIFRoZSBzaW1wbGUgbW9kZSBpcyBmaXhlZCB0aW1lc3RlcHBpbmcgd2l0aG91dCBpbnRlcnBvbGF0aW9uLiBJbiB0aGlzIGNhc2UgeW91IG9ubHkgdXNlIHRoZSBmaXJzdCBhcmd1bWVudC4gVGhlIHNlY29uZCBjYXNlIHVzZXMgaW50ZXJwb2xhdGlvbi4gSW4gdGhhdCB5b3UgYWxzbyBwcm92aWRlIHRoZSB0aW1lIHNpbmNlIHRoZSBmdW5jdGlvbiB3YXMgbGFzdCB1c2VkLCBhcyB3ZWxsIGFzIHRoZSBtYXhpbXVtIGZpeGVkIHRpbWVzdGVwcyB0byB0YWtlLgogICAgICoKICAgICAqIEBwYXJhbSBkdCBUaGUgZml4ZWQgdGltZSBzdGVwIHNpemUgdG8gdXNlLgogICAgICogQHBhcmFtIHRpbWVTaW5jZUxhc3RDYWxsZWQgVGhlIHRpbWUgZWxhcHNlZCBzaW5jZSB0aGUgZnVuY3Rpb24gd2FzIGxhc3QgY2FsbGVkLgogICAgICogQHBhcmFtIG1heFN1YlN0ZXBzIE1heGltdW0gbnVtYmVyIG9mIGZpeGVkIHN0ZXBzIHRvIHRha2UgcGVyIGZ1bmN0aW9uIGNhbGwgKGRlZmF1bHQ6IDEwKS4KICAgICAqIEBzZWUgaHR0cHM6Ly93ZWIuYXJjaGl2ZS5vcmcvd2ViLzIwMTgwNDI2MTU0NTMxL2h0dHA6Ly9idWxsZXRwaHlzaWNzLm9yZy9tZWRpYXdpa2ktMS41LjgvaW5kZXgucGhwL1N0ZXBwaW5nX1RoZV9Xb3JsZCNXaGF0X2RvX3RoZV9wYXJhbWV0ZXJzX3RvX2J0RHluYW1pY3NXb3JsZDo6c3RlcFNpbXVsYXRpb25fbWVhbi4zRgogICAgICogQGV4YW1wbGUKICAgICAqICAgICAvLyBmaXhlZCB0aW1lc3RlcHBpbmcgd2l0aG91dCBpbnRlcnBvbGF0aW9uCiAgICAgKiAgICAgd29ybGQuc3RlcCgxIC8gNjApCiAgICAgKi8KCgogICAgc3RlcChkdCwgdGltZVNpbmNlTGFzdENhbGxlZCwgbWF4U3ViU3RlcHMpIHsKICAgICAgaWYgKG1heFN1YlN0ZXBzID09PSB2b2lkIDApIHsKICAgICAgICBtYXhTdWJTdGVwcyA9IDEwOwogICAgICB9CgogICAgICBpZiAodGltZVNpbmNlTGFzdENhbGxlZCA9PT0gdW5kZWZpbmVkKSB7CiAgICAgICAgLy8gRml4ZWQsIHNpbXBsZSBzdGVwcGluZwogICAgICAgIHRoaXMuaW50ZXJuYWxTdGVwKGR0KTsgLy8gSW5jcmVtZW50IHRpbWUKCiAgICAgICAgdGhpcy50aW1lICs9IGR0OwogICAgICB9IGVsc2UgewogICAgICAgIHRoaXMuYWNjdW11bGF0b3IgKz0gdGltZVNpbmNlTGFzdENhbGxlZDsKICAgICAgICBjb25zdCB0MCA9IHBlcmZvcm1hbmNlLm5vdygpOwogICAgICAgIGxldCBzdWJzdGVwcyA9IDA7CgogICAgICAgIHdoaWxlICh0aGlzLmFjY3VtdWxhdG9yID49IGR0ICYmIHN1YnN0ZXBzIDwgbWF4U3ViU3RlcHMpIHsKICAgICAgICAgIC8vIERvIGZpeGVkIHN0ZXBzIHRvIGNhdGNoIHVwCiAgICAgICAgICB0aGlzLmludGVybmFsU3RlcChkdCk7CiAgICAgICAgICB0aGlzLmFjY3VtdWxhdG9yIC09IGR0OwogICAgICAgICAgc3Vic3RlcHMrKzsKCiAgICAgICAgICBpZiAocGVyZm9ybWFuY2Uubm93KCkgLSB0MCA+IGR0ICogMTAwMCkgewogICAgICAgICAgICAvLyBUaGUgZnJhbWVyYXRlIGlzIG5vdCBpbnRlcmFjdGl2ZSBhbnltb3JlLgogICAgICAgICAgICAvLyBXZSBhcmUgYmVsb3cgdGhlIHRhcmdldCBmcmFtZXJhdGUuCiAgICAgICAgICAgIC8vIEJldHRlciBiYWlsIG91dC4KICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CiAgICAgICAgfSAvLyBSZW1vdmUgdGhlIGV4Y2VzcyBhY2N1bXVsYXRvciwgc2luY2Ugd2UgbWF5IG5vdAogICAgICAgIC8vIGhhdmUgaGFkIGVub3VnaCBzdWJzdGVwcyBhdmFpbGFibGUgdG8gY2F0Y2ggdXAKCgogICAgICAgIHRoaXMuYWNjdW11bGF0b3IgPSB0aGlzLmFjY3VtdWxhdG9yICUgZHQ7CiAgICAgICAgY29uc3QgdCA9IHRoaXMuYWNjdW11bGF0b3IgLyBkdDsKCiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogIT09IHRoaXMuYm9kaWVzLmxlbmd0aDsgaisrKSB7CiAgICAgICAgICBjb25zdCBiID0gdGhpcy5ib2RpZXNbal07CiAgICAgICAgICBiLnByZXZpb3VzUG9zaXRpb24ubGVycChiLnBvc2l0aW9uLCB0LCBiLmludGVycG9sYXRlZFBvc2l0aW9uKTsKICAgICAgICAgIGIucHJldmlvdXNRdWF0ZXJuaW9uLnNsZXJwKGIucXVhdGVybmlvbiwgdCwgYi5pbnRlcnBvbGF0ZWRRdWF0ZXJuaW9uKTsKICAgICAgICAgIGIucHJldmlvdXNRdWF0ZXJuaW9uLm5vcm1hbGl6ZSgpOwogICAgICAgIH0KCiAgICAgICAgdGhpcy50aW1lICs9IHRpbWVTaW5jZUxhc3RDYWxsZWQ7CiAgICAgIH0KICAgIH0KCiAgICBpbnRlcm5hbFN0ZXAoZHQpIHsKICAgICAgdGhpcy5kdCA9IGR0OwogICAgICBjb25zdCBjb250YWN0cyA9IHRoaXMuY29udGFjdHM7CiAgICAgIGNvbnN0IHAxID0gV29ybGRfc3RlcF9wMTsKICAgICAgY29uc3QgcDIgPSBXb3JsZF9zdGVwX3AyOwogICAgICBjb25zdCBOID0gdGhpcy5ib2RpZXMubGVuZ3RoOwogICAgICBjb25zdCBib2RpZXMgPSB0aGlzLmJvZGllczsKICAgICAgY29uc3Qgc29sdmVyID0gdGhpcy5zb2x2ZXI7CiAgICAgIGNvbnN0IGdyYXZpdHkgPSB0aGlzLmdyYXZpdHk7CiAgICAgIGNvbnN0IGRvUHJvZmlsaW5nID0gdGhpcy5kb1Byb2ZpbGluZzsKICAgICAgY29uc3QgcHJvZmlsZSA9IHRoaXMucHJvZmlsZTsKICAgICAgY29uc3QgRFlOQU1JQyA9IEJvZHkuRFlOQU1JQzsKICAgICAgbGV0IHByb2ZpbGluZ1N0YXJ0ID0gLUluZmluaXR5OwogICAgICBjb25zdCBjb25zdHJhaW50cyA9IHRoaXMuY29uc3RyYWludHM7CiAgICAgIGNvbnN0IGZyaWN0aW9uRXF1YXRpb25Qb29sID0gV29ybGRfc3RlcF9mcmljdGlvbkVxdWF0aW9uUG9vbDsKICAgICAgZ3Jhdml0eS5sZW5ndGgoKTsKICAgICAgY29uc3QgZ3ggPSBncmF2aXR5Lng7CiAgICAgIGNvbnN0IGd5ID0gZ3Jhdml0eS55OwogICAgICBjb25zdCBneiA9IGdyYXZpdHkuejsKICAgICAgbGV0IGkgPSAwOwoKICAgICAgaWYgKGRvUHJvZmlsaW5nKSB7CiAgICAgICAgcHJvZmlsaW5nU3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTsKICAgICAgfSAvLyBBZGQgZ3Jhdml0eSB0byBhbGwgb2JqZWN0cwoKCiAgICAgIGZvciAoaSA9IDA7IGkgIT09IE47IGkrKykgewogICAgICAgIGNvbnN0IGJpID0gYm9kaWVzW2ldOwoKICAgICAgICBpZiAoYmkudHlwZSA9PT0gRFlOQU1JQykgewogICAgICAgICAgLy8gT25seSBmb3IgZHluYW1pYyBib2RpZXMKICAgICAgICAgIGNvbnN0IGYgPSBiaS5mb3JjZTsKICAgICAgICAgIGNvbnN0IG0gPSBiaS5tYXNzOwogICAgICAgICAgZi54ICs9IG0gKiBneDsKICAgICAgICAgIGYueSArPSBtICogZ3k7CiAgICAgICAgICBmLnogKz0gbSAqIGd6OwogICAgICAgIH0KICAgICAgfSAvLyBVcGRhdGUgc3Vic3lzdGVtcwoKCiAgICAgIGZvciAobGV0IGkgPSAwLCBOc3Vic3lzdGVtcyA9IHRoaXMuc3Vic3lzdGVtcy5sZW5ndGg7IGkgIT09IE5zdWJzeXN0ZW1zOyBpKyspIHsKICAgICAgICB0aGlzLnN1YnN5c3RlbXNbaV0udXBkYXRlKCk7CiAgICAgIH0gLy8gQ29sbGlzaW9uIGRldGVjdGlvbgoKCiAgICAgIGlmIChkb1Byb2ZpbGluZykgewogICAgICAgIHByb2ZpbGluZ1N0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7CiAgICAgIH0KCiAgICAgIHAxLmxlbmd0aCA9IDA7IC8vIENsZWFuIHVwIHBhaXIgYXJyYXlzIGZyb20gbGFzdCBzdGVwCgogICAgICBwMi5sZW5ndGggPSAwOwogICAgICB0aGlzLmJyb2FkcGhhc2UuY29sbGlzaW9uUGFpcnModGhpcywgcDEsIHAyKTsKCiAgICAgIGlmIChkb1Byb2ZpbGluZykgewogICAgICAgIHByb2ZpbGUuYnJvYWRwaGFzZSA9IHBlcmZvcm1hbmNlLm5vdygpIC0gcHJvZmlsaW5nU3RhcnQ7CiAgICAgIH0gLy8gUmVtb3ZlIGNvbnN0cmFpbmVkIHBhaXJzIHdpdGggY29sbGlkZUNvbm5lY3RlZCA9PSBmYWxzZQoKCiAgICAgIGxldCBOY29uc3RyYWludHMgPSBjb25zdHJhaW50cy5sZW5ndGg7CgogICAgICBmb3IgKGkgPSAwOyBpICE9PSBOY29uc3RyYWludHM7IGkrKykgewogICAgICAgIGNvbnN0IGMgPSBjb25zdHJhaW50c1tpXTsKCiAgICAgICAgaWYgKCFjLmNvbGxpZGVDb25uZWN0ZWQpIHsKICAgICAgICAgIGZvciAobGV0IGogPSBwMS5sZW5ndGggLSAxOyBqID49IDA7IGogLT0gMSkgewogICAgICAgICAgICBpZiAoYy5ib2R5QSA9PT0gcDFbal0gJiYgYy5ib2R5QiA9PT0gcDJbal0gfHwgYy5ib2R5QiA9PT0gcDFbal0gJiYgYy5ib2R5QSA9PT0gcDJbal0pIHsKICAgICAgICAgICAgICBwMS5zcGxpY2UoaiwgMSk7CiAgICAgICAgICAgICAgcDIuc3BsaWNlKGosIDEpOwogICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9CgogICAgICB0aGlzLmNvbGxpc2lvbk1hdHJpeFRpY2soKTsgLy8gR2VuZXJhdGUgY29udGFjdHMKCiAgICAgIGlmIChkb1Byb2ZpbGluZykgewogICAgICAgIHByb2ZpbGluZ1N0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7CiAgICAgIH0KCiAgICAgIGNvbnN0IG9sZGNvbnRhY3RzID0gV29ybGRfc3RlcF9vbGRDb250YWN0czsKICAgICAgY29uc3QgTm9sZENvbnRhY3RzID0gY29udGFjdHMubGVuZ3RoOwoKICAgICAgZm9yIChpID0gMDsgaSAhPT0gTm9sZENvbnRhY3RzOyBpKyspIHsKICAgICAgICBvbGRjb250YWN0cy5wdXNoKGNvbnRhY3RzW2ldKTsKICAgICAgfQoKICAgICAgY29udGFjdHMubGVuZ3RoID0gMDsgLy8gVHJhbnNmZXIgRnJpY3Rpb25FcXVhdGlvbiBmcm9tIGN1cnJlbnQgbGlzdCB0byB0aGUgcG9vbCBmb3IgcmV1c2UKCiAgICAgIGNvbnN0IE5vbGRGcmljdGlvbkVxdWF0aW9ucyA9IHRoaXMuZnJpY3Rpb25FcXVhdGlvbnMubGVuZ3RoOwoKICAgICAgZm9yIChpID0gMDsgaSAhPT0gTm9sZEZyaWN0aW9uRXF1YXRpb25zOyBpKyspIHsKICAgICAgICBmcmljdGlvbkVxdWF0aW9uUG9vbC5wdXNoKHRoaXMuZnJpY3Rpb25FcXVhdGlvbnNbaV0pOwogICAgICB9CgogICAgICB0aGlzLmZyaWN0aW9uRXF1YXRpb25zLmxlbmd0aCA9IDA7CiAgICAgIHRoaXMubmFycm93cGhhc2UuZ2V0Q29udGFjdHMocDEsIHAyLCB0aGlzLCBjb250YWN0cywgb2xkY29udGFjdHMsIC8vIFRvIGJlIHJldXNlZAogICAgICB0aGlzLmZyaWN0aW9uRXF1YXRpb25zLCBmcmljdGlvbkVxdWF0aW9uUG9vbCk7CgogICAgICBpZiAoZG9Qcm9maWxpbmcpIHsKICAgICAgICBwcm9maWxlLm5hcnJvd3BoYXNlID0gcGVyZm9ybWFuY2Uubm93KCkgLSBwcm9maWxpbmdTdGFydDsKICAgICAgfSAvLyBMb29wIG92ZXIgYWxsIGNvbGxpc2lvbnMKCgogICAgICBpZiAoZG9Qcm9maWxpbmcpIHsKICAgICAgICBwcm9maWxpbmdTdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpOwogICAgICB9IC8vIEFkZCBhbGwgZnJpY3Rpb24gZXFzCgoKICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZnJpY3Rpb25FcXVhdGlvbnMubGVuZ3RoOyBpKyspIHsKICAgICAgICBzb2x2ZXIuYWRkRXF1YXRpb24odGhpcy5mcmljdGlvbkVxdWF0aW9uc1tpXSk7CiAgICAgIH0KCiAgICAgIGNvbnN0IG5jb250YWN0cyA9IGNvbnRhY3RzLmxlbmd0aDsKCiAgICAgIGZvciAobGV0IGsgPSAwOyBrICE9PSBuY29udGFjdHM7IGsrKykgewogICAgICAgIC8vIEN1cnJlbnQgY29udGFjdAogICAgICAgIGNvbnN0IGMgPSBjb250YWN0c1trXTsgLy8gR2V0IGN1cnJlbnQgY29sbGlzaW9uIGluZGVjZXMKCiAgICAgICAgY29uc3QgYmkgPSBjLmJpOwogICAgICAgIGNvbnN0IGJqID0gYy5iajsKICAgICAgICBjb25zdCBzaSA9IGMuc2k7CiAgICAgICAgY29uc3Qgc2ogPSBjLnNqOyAvLyBHZXQgY29sbGlzaW9uIHByb3BlcnRpZXMKCiAgICAgICAgbGV0IGNtOwoKICAgICAgICBpZiAoYmkubWF0ZXJpYWwgJiYgYmoubWF0ZXJpYWwpIHsKICAgICAgICAgIGNtID0gdGhpcy5nZXRDb250YWN0TWF0ZXJpYWwoYmkubWF0ZXJpYWwsIGJqLm1hdGVyaWFsKSB8fCB0aGlzLmRlZmF1bHRDb250YWN0TWF0ZXJpYWw7CiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgIGNtID0gdGhpcy5kZWZhdWx0Q29udGFjdE1hdGVyaWFsOwogICAgICAgIH0gLy8gYy5lbmFibGVkID0gYmkuY29sbGlzaW9uUmVzcG9uc2UgJiYgYmouY29sbGlzaW9uUmVzcG9uc2UgJiYgc2kuY29sbGlzaW9uUmVzcG9uc2UgJiYgc2ouY29sbGlzaW9uUmVzcG9uc2U7CgoKICAgICAgICBjbS5mcmljdGlvbjsgLy8gYy5yZXN0aXR1dGlvbiA9IGNtLnJlc3RpdHV0aW9uOwogICAgICAgIC8vIElmIGZyaWN0aW9uIG9yIHJlc3RpdHV0aW9uIHdlcmUgc3BlY2lmaWVkIGluIHRoZSBtYXRlcmlhbCwgdXNlIHRoZW0KCiAgICAgICAgaWYgKGJpLm1hdGVyaWFsICYmIGJqLm1hdGVyaWFsKSB7CiAgICAgICAgICBpZiAoYmkubWF0ZXJpYWwuZnJpY3Rpb24gPj0gMCAmJiBiai5tYXRlcmlhbC5mcmljdGlvbiA+PSAwKSB7CiAgICAgICAgICAgIGJpLm1hdGVyaWFsLmZyaWN0aW9uICogYmoubWF0ZXJpYWwuZnJpY3Rpb247CiAgICAgICAgICB9CgogICAgICAgICAgaWYgKGJpLm1hdGVyaWFsLnJlc3RpdHV0aW9uID49IDAgJiYgYmoubWF0ZXJpYWwucmVzdGl0dXRpb24gPj0gMCkgewogICAgICAgICAgICBjLnJlc3RpdHV0aW9uID0gYmkubWF0ZXJpYWwucmVzdGl0dXRpb24gKiBiai5tYXRlcmlhbC5yZXN0aXR1dGlvbjsKICAgICAgICAgIH0KICAgICAgICB9IC8vIGMuc2V0U3Bvb2tQYXJhbXMoCiAgICAgICAgLy8gICAgICAgICAgIGNtLmNvbnRhY3RFcXVhdGlvblN0aWZmbmVzcywKICAgICAgICAvLyAgICAgICAgICAgY20uY29udGFjdEVxdWF0aW9uUmVsYXhhdGlvbiwKICAgICAgICAvLyAgICAgICAgICAgZHQKICAgICAgICAvLyAgICAgICApOwoKCiAgICAgICAgc29sdmVyLmFkZEVxdWF0aW9uKGMpOyAvLyAvLyBBZGQgZnJpY3Rpb24gY29uc3RyYWludCBlcXVhdGlvbgogICAgICAgIC8vIGlmKG11ID4gMCl7CiAgICAgICAgLy8gCS8vIENyZWF0ZSAyIHRhbmdlbnQgZXF1YXRpb25zCiAgICAgICAgLy8gCWNvbnN0IG11ZyA9IG11ICogZ25vcm07CiAgICAgICAgLy8gCWNvbnN0IHJlZHVjZWRNYXNzID0gKGJpLmludk1hc3MgKyBiai5pbnZNYXNzKTsKICAgICAgICAvLyAJaWYocmVkdWNlZE1hc3MgPiAwKXsKICAgICAgICAvLyAJCXJlZHVjZWRNYXNzID0gMS9yZWR1Y2VkTWFzczsKICAgICAgICAvLyAJfQogICAgICAgIC8vIAljb25zdCBwb29sID0gZnJpY3Rpb25FcXVhdGlvblBvb2w7CiAgICAgICAgLy8gCWNvbnN0IGMxID0gcG9vbC5sZW5ndGggPyBwb29sLnBvcCgpIDogbmV3IEZyaWN0aW9uRXF1YXRpb24oYmksYmosbXVnKnJlZHVjZWRNYXNzKTsKICAgICAgICAvLyAJY29uc3QgYzIgPSBwb29sLmxlbmd0aCA/IHBvb2wucG9wKCkgOiBuZXcgRnJpY3Rpb25FcXVhdGlvbihiaSxiaixtdWcqcmVkdWNlZE1hc3MpOwogICAgICAgIC8vIAl0aGlzLmZyaWN0aW9uRXF1YXRpb25zLnB1c2goYzEsIGMyKTsKICAgICAgICAvLyAJYzEuYmkgPSBjMi5iaSA9IGJpOwogICAgICAgIC8vIAljMS5iaiA9IGMyLmJqID0gYmo7CiAgICAgICAgLy8gCWMxLm1pbkZvcmNlID0gYzIubWluRm9yY2UgPSAtbXVnKnJlZHVjZWRNYXNzOwogICAgICAgIC8vIAljMS5tYXhGb3JjZSA9IGMyLm1heEZvcmNlID0gbXVnKnJlZHVjZWRNYXNzOwogICAgICAgIC8vIAkvLyBDb3B5IG92ZXIgdGhlIHJlbGF0aXZlIHZlY3RvcnMKICAgICAgICAvLyAJYzEucmkuY29weShjLnJpKTsKICAgICAgICAvLyAJYzEucmouY29weShjLnJqKTsKICAgICAgICAvLyAJYzIucmkuY29weShjLnJpKTsKICAgICAgICAvLyAJYzIucmouY29weShjLnJqKTsKICAgICAgICAvLyAJLy8gQ29uc3RydWN0IHRhbmdlbnRzCiAgICAgICAgLy8gCWMubmkudGFuZ2VudHMoYzEudCwgYzIudCk7CiAgICAgICAgLy8gICAgICAgICAgIC8vIFNldCBzcG9vayBwYXJhbXMKICAgICAgICAvLyAgICAgICAgICAgYzEuc2V0U3Bvb2tQYXJhbXMoY20uZnJpY3Rpb25FcXVhdGlvblN0aWZmbmVzcywgY20uZnJpY3Rpb25FcXVhdGlvblJlbGF4YXRpb24sIGR0KTsKICAgICAgICAvLyAgICAgICAgICAgYzIuc2V0U3Bvb2tQYXJhbXMoY20uZnJpY3Rpb25FcXVhdGlvblN0aWZmbmVzcywgY20uZnJpY3Rpb25FcXVhdGlvblJlbGF4YXRpb24sIGR0KTsKICAgICAgICAvLyAgICAgICAgICAgYzEuZW5hYmxlZCA9IGMyLmVuYWJsZWQgPSBjLmVuYWJsZWQ7CiAgICAgICAgLy8gCS8vIEFkZCBlcXVhdGlvbnMgdG8gc29sdmVyCiAgICAgICAgLy8gCXNvbHZlci5hZGRFcXVhdGlvbihjMSk7CiAgICAgICAgLy8gCXNvbHZlci5hZGRFcXVhdGlvbihjMik7CiAgICAgICAgLy8gfQoKICAgICAgICBpZiAoYmkuYWxsb3dTbGVlcCAmJiBiaS50eXBlID09PSBCb2R5LkRZTkFNSUMgJiYgYmkuc2xlZXBTdGF0ZSA9PT0gQm9keS5TTEVFUElORyAmJiBiai5zbGVlcFN0YXRlID09PSBCb2R5LkFXQUtFICYmIGJqLnR5cGUgIT09IEJvZHkuU1RBVElDKSB7CiAgICAgICAgICBjb25zdCBzcGVlZFNxdWFyZWRCID0gYmoudmVsb2NpdHkubGVuZ3RoU3F1YXJlZCgpICsgYmouYW5ndWxhclZlbG9jaXR5Lmxlbmd0aFNxdWFyZWQoKTsKICAgICAgICAgIGNvbnN0IHNwZWVkTGltaXRTcXVhcmVkQiA9IGJqLnNsZWVwU3BlZWRMaW1pdCAqKiAyOwoKICAgICAgICAgIGlmIChzcGVlZFNxdWFyZWRCID49IHNwZWVkTGltaXRTcXVhcmVkQiAqIDIpIHsKICAgICAgICAgICAgYmkud2FrZVVwQWZ0ZXJOYXJyb3dwaGFzZSA9IHRydWU7CiAgICAgICAgICB9CiAgICAgICAgfQoKICAgICAgICBpZiAoYmouYWxsb3dTbGVlcCAmJiBiai50eXBlID09PSBCb2R5LkRZTkFNSUMgJiYgYmouc2xlZXBTdGF0ZSA9PT0gQm9keS5TTEVFUElORyAmJiBiaS5zbGVlcFN0YXRlID09PSBCb2R5LkFXQUtFICYmIGJpLnR5cGUgIT09IEJvZHkuU1RBVElDKSB7CiAgICAgICAgICBjb25zdCBzcGVlZFNxdWFyZWRBID0gYmkudmVsb2NpdHkubGVuZ3RoU3F1YXJlZCgpICsgYmkuYW5ndWxhclZlbG9jaXR5Lmxlbmd0aFNxdWFyZWQoKTsKICAgICAgICAgIGNvbnN0IHNwZWVkTGltaXRTcXVhcmVkQSA9IGJpLnNsZWVwU3BlZWRMaW1pdCAqKiAyOwoKICAgICAgICAgIGlmIChzcGVlZFNxdWFyZWRBID49IHNwZWVkTGltaXRTcXVhcmVkQSAqIDIpIHsKICAgICAgICAgICAgYmoud2FrZVVwQWZ0ZXJOYXJyb3dwaGFzZSA9IHRydWU7CiAgICAgICAgICB9CiAgICAgICAgfSAvLyBOb3cgd2Uga25vdyB0aGF0IGkgYW5kIGogYXJlIGluIGNvbnRhY3QuIFNldCBjb2xsaXNpb24gbWF0cml4IHN0YXRlCgoKICAgICAgICB0aGlzLmNvbGxpc2lvbk1hdHJpeC5zZXQoYmksIGJqLCB0cnVlKTsKCiAgICAgICAgaWYgKCF0aGlzLmNvbGxpc2lvbk1hdHJpeFByZXZpb3VzLmdldChiaSwgYmopKSB7CiAgICAgICAgICAvLyBGaXJzdCBjb250YWN0IQogICAgICAgICAgLy8gV2UgcmV1c2UgdGhlIGNvbGxpZGVFdmVudCBvYmplY3QsIG90aGVyd2lzZSB3ZSB3aWxsIGVuZCB1cCBjcmVhdGluZyBuZXcgb2JqZWN0cyBmb3IgZWFjaCBuZXcgY29udGFjdCwgZXZlbiBpZiB0aGVyZSdzIG5vIGV2ZW50IGxpc3RlbmVyIGF0dGFjaGVkLgogICAgICAgICAgV29ybGRfc3RlcF9jb2xsaWRlRXZlbnQuYm9keSA9IGJqOwogICAgICAgICAgV29ybGRfc3RlcF9jb2xsaWRlRXZlbnQuY29udGFjdCA9IGM7CiAgICAgICAgICBiaS5kaXNwYXRjaEV2ZW50KFdvcmxkX3N0ZXBfY29sbGlkZUV2ZW50KTsKICAgICAgICAgIFdvcmxkX3N0ZXBfY29sbGlkZUV2ZW50LmJvZHkgPSBiaTsKICAgICAgICAgIGJqLmRpc3BhdGNoRXZlbnQoV29ybGRfc3RlcF9jb2xsaWRlRXZlbnQpOwogICAgICAgIH0KCiAgICAgICAgdGhpcy5ib2R5T3ZlcmxhcEtlZXBlci5zZXQoYmkuaWQsIGJqLmlkKTsKICAgICAgICB0aGlzLnNoYXBlT3ZlcmxhcEtlZXBlci5zZXQoc2kuaWQsIHNqLmlkKTsKICAgICAgfQoKICAgICAgdGhpcy5lbWl0Q29udGFjdEV2ZW50cygpOwoKICAgICAgaWYgKGRvUHJvZmlsaW5nKSB7CiAgICAgICAgcHJvZmlsZS5tYWtlQ29udGFjdENvbnN0cmFpbnRzID0gcGVyZm9ybWFuY2Uubm93KCkgLSBwcm9maWxpbmdTdGFydDsKICAgICAgICBwcm9maWxpbmdTdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpOwogICAgICB9IC8vIFdha2UgdXAgYm9kaWVzCgoKICAgICAgZm9yIChpID0gMDsgaSAhPT0gTjsgaSsrKSB7CiAgICAgICAgY29uc3QgYmkgPSBib2RpZXNbaV07CgogICAgICAgIGlmIChiaS53YWtlVXBBZnRlck5hcnJvd3BoYXNlKSB7CiAgICAgICAgICBiaS53YWtlVXAoKTsKICAgICAgICAgIGJpLndha2VVcEFmdGVyTmFycm93cGhhc2UgPSBmYWxzZTsKICAgICAgICB9CiAgICAgIH0gLy8gQWRkIHVzZXItYWRkZWQgY29uc3RyYWludHMKCgogICAgICBOY29uc3RyYWludHMgPSBjb25zdHJhaW50cy5sZW5ndGg7CgogICAgICBmb3IgKGkgPSAwOyBpICE9PSBOY29uc3RyYWludHM7IGkrKykgewogICAgICAgIGNvbnN0IGMgPSBjb25zdHJhaW50c1tpXTsKICAgICAgICBjLnVwZGF0ZSgpOwoKICAgICAgICBmb3IgKGxldCBqID0gMCwgTmVxID0gYy5lcXVhdGlvbnMubGVuZ3RoOyBqICE9PSBOZXE7IGorKykgewogICAgICAgICAgY29uc3QgZXEgPSBjLmVxdWF0aW9uc1tqXTsKICAgICAgICAgIHNvbHZlci5hZGRFcXVhdGlvbihlcSk7CiAgICAgICAgfQogICAgICB9IC8vIFNvbHZlIHRoZSBjb25zdHJhaW5lZCBzeXN0ZW0KCgogICAgICBzb2x2ZXIuc29sdmUoZHQsIHRoaXMpOwoKICAgICAgaWYgKGRvUHJvZmlsaW5nKSB7CiAgICAgICAgcHJvZmlsZS5zb2x2ZSA9IHBlcmZvcm1hbmNlLm5vdygpIC0gcHJvZmlsaW5nU3RhcnQ7CiAgICAgIH0gLy8gUmVtb3ZlIGFsbCBjb250YWN0cyBmcm9tIHNvbHZlcgoKCiAgICAgIHNvbHZlci5yZW1vdmVBbGxFcXVhdGlvbnMoKTsgLy8gQXBwbHkgZGFtcGluZywgc2VlIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9idWxsZXQvaXNzdWVzL2RldGFpbD9pZD03NCBmb3IgZGV0YWlscwoKICAgICAgY29uc3QgcG93ID0gTWF0aC5wb3c7CgogICAgICBmb3IgKGkgPSAwOyBpICE9PSBOOyBpKyspIHsKICAgICAgICBjb25zdCBiaSA9IGJvZGllc1tpXTsKCiAgICAgICAgaWYgKGJpLnR5cGUgJiBEWU5BTUlDKSB7CiAgICAgICAgICAvLyBPbmx5IGZvciBkeW5hbWljIGJvZGllcwogICAgICAgICAgY29uc3QgbGQgPSBwb3coMS4wIC0gYmkubGluZWFyRGFtcGluZywgZHQpOwogICAgICAgICAgY29uc3QgdiA9IGJpLnZlbG9jaXR5OwogICAgICAgICAgdi5zY2FsZShsZCwgdik7CiAgICAgICAgICBjb25zdCBhdiA9IGJpLmFuZ3VsYXJWZWxvY2l0eTsKCiAgICAgICAgICBpZiAoYXYpIHsKICAgICAgICAgICAgY29uc3QgYWQgPSBwb3coMS4wIC0gYmkuYW5ndWxhckRhbXBpbmcsIGR0KTsKICAgICAgICAgICAgYXYuc2NhbGUoYWQsIGF2KTsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KCiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChXb3JsZF9zdGVwX3ByZVN0ZXBFdmVudCk7IC8vIExlYXAgZnJvZwogICAgICAvLyB2bmV3ID0gdiArIGgqZi9tCiAgICAgIC8vIHhuZXcgPSB4ICsgaCp2bmV3CgogICAgICBpZiAoZG9Qcm9maWxpbmcpIHsKICAgICAgICBwcm9maWxpbmdTdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpOwogICAgICB9CgogICAgICBjb25zdCBzdGVwbnVtYmVyID0gdGhpcy5zdGVwbnVtYmVyOwogICAgICBjb25zdCBxdWF0Tm9ybWFsaXplID0gc3RlcG51bWJlciAlICh0aGlzLnF1YXROb3JtYWxpemVTa2lwICsgMSkgPT09IDA7CiAgICAgIGNvbnN0IHF1YXROb3JtYWxpemVGYXN0ID0gdGhpcy5xdWF0Tm9ybWFsaXplRmFzdDsKCiAgICAgIGZvciAoaSA9IDA7IGkgIT09IE47IGkrKykgewogICAgICAgIGJvZGllc1tpXS5pbnRlZ3JhdGUoZHQsIHF1YXROb3JtYWxpemUsIHF1YXROb3JtYWxpemVGYXN0KTsKICAgICAgfQoKICAgICAgdGhpcy5jbGVhckZvcmNlcygpOwogICAgICB0aGlzLmJyb2FkcGhhc2UuZGlydHkgPSB0cnVlOwoKICAgICAgaWYgKGRvUHJvZmlsaW5nKSB7CiAgICAgICAgcHJvZmlsZS5pbnRlZ3JhdGUgPSBwZXJmb3JtYW5jZS5ub3coKSAtIHByb2ZpbGluZ1N0YXJ0OwogICAgICB9IC8vIFVwZGF0ZSBzdGVwIG51bWJlcgoKCiAgICAgIHRoaXMuc3RlcG51bWJlciArPSAxOwogICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoV29ybGRfc3RlcF9wb3N0U3RlcEV2ZW50KTsgLy8gU2xlZXBpbmcgdXBkYXRlCgogICAgICBsZXQgaGFzQWN0aXZlQm9kaWVzID0gdHJ1ZTsKCiAgICAgIGlmICh0aGlzLmFsbG93U2xlZXApIHsKICAgICAgICBoYXNBY3RpdmVCb2RpZXMgPSBmYWxzZTsKCiAgICAgICAgZm9yIChpID0gMDsgaSAhPT0gTjsgaSsrKSB7CiAgICAgICAgICBjb25zdCBiaSA9IGJvZGllc1tpXTsKICAgICAgICAgIGJpLnNsZWVwVGljayh0aGlzLnRpbWUpOwoKICAgICAgICAgIGlmIChiaS5zbGVlcFN0YXRlICE9PSBCb2R5LlNMRUVQSU5HKSB7CiAgICAgICAgICAgIGhhc0FjdGl2ZUJvZGllcyA9IHRydWU7CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9CgogICAgICB0aGlzLmhhc0FjdGl2ZUJvZGllcyA9IGhhc0FjdGl2ZUJvZGllczsKICAgIH0KCiAgICBlbWl0Q29udGFjdEV2ZW50cygpIHsKICAgICAgY29uc3QgaGFzQmVnaW5Db250YWN0ID0gdGhpcy5oYXNBbnlFdmVudExpc3RlbmVyKCdiZWdpbkNvbnRhY3QnKTsKICAgICAgY29uc3QgaGFzRW5kQ29udGFjdCA9IHRoaXMuaGFzQW55RXZlbnRMaXN0ZW5lcignZW5kQ29udGFjdCcpOwoKICAgICAgaWYgKGhhc0JlZ2luQ29udGFjdCB8fCBoYXNFbmRDb250YWN0KSB7CiAgICAgICAgdGhpcy5ib2R5T3ZlcmxhcEtlZXBlci5nZXREaWZmKGFkZGl0aW9ucywgcmVtb3ZhbHMpOwogICAgICB9CgogICAgICBpZiAoaGFzQmVnaW5Db250YWN0KSB7CiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBhZGRpdGlvbnMubGVuZ3RoOyBpIDwgbDsgaSArPSAyKSB7CiAgICAgICAgICBiZWdpbkNvbnRhY3RFdmVudC5ib2R5QSA9IHRoaXMuZ2V0Qm9keUJ5SWQoYWRkaXRpb25zW2ldKTsKICAgICAgICAgIGJlZ2luQ29udGFjdEV2ZW50LmJvZHlCID0gdGhpcy5nZXRCb2R5QnlJZChhZGRpdGlvbnNbaSArIDFdKTsKICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChiZWdpbkNvbnRhY3RFdmVudCk7CiAgICAgICAgfQoKICAgICAgICBiZWdpbkNvbnRhY3RFdmVudC5ib2R5QSA9IGJlZ2luQ29udGFjdEV2ZW50LmJvZHlCID0gbnVsbDsKICAgICAgfQoKICAgICAgaWYgKGhhc0VuZENvbnRhY3QpIHsKICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHJlbW92YWxzLmxlbmd0aDsgaSA8IGw7IGkgKz0gMikgewogICAgICAgICAgZW5kQ29udGFjdEV2ZW50LmJvZHlBID0gdGhpcy5nZXRCb2R5QnlJZChyZW1vdmFsc1tpXSk7CiAgICAgICAgICBlbmRDb250YWN0RXZlbnQuYm9keUIgPSB0aGlzLmdldEJvZHlCeUlkKHJlbW92YWxzW2kgKyAxXSk7CiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoZW5kQ29udGFjdEV2ZW50KTsKICAgICAgICB9CgogICAgICAgIGVuZENvbnRhY3RFdmVudC5ib2R5QSA9IGVuZENvbnRhY3RFdmVudC5ib2R5QiA9IG51bGw7CiAgICAgIH0KCiAgICAgIGFkZGl0aW9ucy5sZW5ndGggPSByZW1vdmFscy5sZW5ndGggPSAwOwogICAgICBjb25zdCBoYXNCZWdpblNoYXBlQ29udGFjdCA9IHRoaXMuaGFzQW55RXZlbnRMaXN0ZW5lcignYmVnaW5TaGFwZUNvbnRhY3QnKTsKICAgICAgY29uc3QgaGFzRW5kU2hhcGVDb250YWN0ID0gdGhpcy5oYXNBbnlFdmVudExpc3RlbmVyKCdlbmRTaGFwZUNvbnRhY3QnKTsKCiAgICAgIGlmIChoYXNCZWdpblNoYXBlQ29udGFjdCB8fCBoYXNFbmRTaGFwZUNvbnRhY3QpIHsKICAgICAgICB0aGlzLnNoYXBlT3ZlcmxhcEtlZXBlci5nZXREaWZmKGFkZGl0aW9ucywgcmVtb3ZhbHMpOwogICAgICB9CgogICAgICBpZiAoaGFzQmVnaW5TaGFwZUNvbnRhY3QpIHsKICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGFkZGl0aW9ucy5sZW5ndGg7IGkgPCBsOyBpICs9IDIpIHsKICAgICAgICAgIGNvbnN0IHNoYXBlQSA9IHRoaXMuZ2V0U2hhcGVCeUlkKGFkZGl0aW9uc1tpXSk7CiAgICAgICAgICBjb25zdCBzaGFwZUIgPSB0aGlzLmdldFNoYXBlQnlJZChhZGRpdGlvbnNbaSArIDFdKTsKICAgICAgICAgIGJlZ2luU2hhcGVDb250YWN0RXZlbnQuc2hhcGVBID0gc2hhcGVBOwogICAgICAgICAgYmVnaW5TaGFwZUNvbnRhY3RFdmVudC5zaGFwZUIgPSBzaGFwZUI7CiAgICAgICAgICBpZiAoc2hhcGVBKSBiZWdpblNoYXBlQ29udGFjdEV2ZW50LmJvZHlBID0gc2hhcGVBLmJvZHk7CiAgICAgICAgICBpZiAoc2hhcGVCKSBiZWdpblNoYXBlQ29udGFjdEV2ZW50LmJvZHlCID0gc2hhcGVCLmJvZHk7CiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoYmVnaW5TaGFwZUNvbnRhY3RFdmVudCk7CiAgICAgICAgfQoKICAgICAgICBiZWdpblNoYXBlQ29udGFjdEV2ZW50LmJvZHlBID0gYmVnaW5TaGFwZUNvbnRhY3RFdmVudC5ib2R5QiA9IGJlZ2luU2hhcGVDb250YWN0RXZlbnQuc2hhcGVBID0gYmVnaW5TaGFwZUNvbnRhY3RFdmVudC5zaGFwZUIgPSBudWxsOwogICAgICB9CgogICAgICBpZiAoaGFzRW5kU2hhcGVDb250YWN0KSB7CiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSByZW1vdmFscy5sZW5ndGg7IGkgPCBsOyBpICs9IDIpIHsKICAgICAgICAgIGNvbnN0IHNoYXBlQSA9IHRoaXMuZ2V0U2hhcGVCeUlkKHJlbW92YWxzW2ldKTsKICAgICAgICAgIGNvbnN0IHNoYXBlQiA9IHRoaXMuZ2V0U2hhcGVCeUlkKHJlbW92YWxzW2kgKyAxXSk7CiAgICAgICAgICBlbmRTaGFwZUNvbnRhY3RFdmVudC5zaGFwZUEgPSBzaGFwZUE7CiAgICAgICAgICBlbmRTaGFwZUNvbnRhY3RFdmVudC5zaGFwZUIgPSBzaGFwZUI7CiAgICAgICAgICBpZiAoc2hhcGVBKSBlbmRTaGFwZUNvbnRhY3RFdmVudC5ib2R5QSA9IHNoYXBlQS5ib2R5OwogICAgICAgICAgaWYgKHNoYXBlQikgZW5kU2hhcGVDb250YWN0RXZlbnQuYm9keUIgPSBzaGFwZUIuYm9keTsKICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChlbmRTaGFwZUNvbnRhY3RFdmVudCk7CiAgICAgICAgfQoKICAgICAgICBlbmRTaGFwZUNvbnRhY3RFdmVudC5ib2R5QSA9IGVuZFNoYXBlQ29udGFjdEV2ZW50LmJvZHlCID0gZW5kU2hhcGVDb250YWN0RXZlbnQuc2hhcGVBID0gZW5kU2hhcGVDb250YWN0RXZlbnQuc2hhcGVCID0gbnVsbDsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgKiBTZXRzIGFsbCBib2R5IGZvcmNlcyBpbiB0aGUgd29ybGQgdG8gemVyby4KICAgICAqLwoKCiAgICBjbGVhckZvcmNlcygpIHsKICAgICAgY29uc3QgYm9kaWVzID0gdGhpcy5ib2RpZXM7CiAgICAgIGNvbnN0IE4gPSBib2RpZXMubGVuZ3RoOwoKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgIT09IE47IGkrKykgewogICAgICAgIGNvbnN0IGIgPSBib2RpZXNbaV07CiAgICAgICAgYi5mb3JjZTsKICAgICAgICBiLnRvcnF1ZTsKICAgICAgICBiLmZvcmNlLnNldCgwLCAwLCAwKTsKICAgICAgICBiLnRvcnF1ZS5zZXQoMCwgMCwgMCk7CiAgICAgIH0KICAgIH0KCiAgfSAvLyBUZW1wIHN0dWZmCgogIG5ldyBBQUJCKCk7CiAgY29uc3QgdG1wUmF5ID0gbmV3IFJheSgpOyAvLyBwZXJmb3JtYW5jZS5ub3coKSBmYWxsYmFjayBvbiBEYXRlLm5vdygpCgogIGNvbnN0IHBlcmZvcm1hbmNlID0gZ2xvYmFsVGhpcy5wZXJmb3JtYW5jZSB8fCB7fTsKCiAgaWYgKCFwZXJmb3JtYW5jZS5ub3cpIHsKICAgIGxldCBub3dPZmZzZXQgPSBEYXRlLm5vdygpOwoKICAgIGlmIChwZXJmb3JtYW5jZS50aW1pbmcgJiYgcGVyZm9ybWFuY2UudGltaW5nLm5hdmlnYXRpb25TdGFydCkgewogICAgICBub3dPZmZzZXQgPSBwZXJmb3JtYW5jZS50aW1pbmcubmF2aWdhdGlvblN0YXJ0OwogICAgfQoKICAgIHBlcmZvcm1hbmNlLm5vdyA9ICgpID0+IERhdGUubm93KCkgLSBub3dPZmZzZXQ7CiAgfQoKICBuZXcgVmVjMygpOyAvLyBEaXNwYXRjaGVkIGFmdGVyIHRoZSB3b3JsZCBoYXMgc3RlcHBlZCBmb3J3YXJkIGluIHRpbWUuCiAgLy8gUmV1c2FibGUgZXZlbnQgb2JqZWN0cyB0byBzYXZlIG1lbW9yeS4KCiAgY29uc3QgV29ybGRfc3RlcF9wb3N0U3RlcEV2ZW50ID0gewogICAgdHlwZTogJ3Bvc3RTdGVwJwogIH07IC8vIERpc3BhdGNoZWQgYmVmb3JlIHRoZSB3b3JsZCBzdGVwcyBmb3J3YXJkIGluIHRpbWUuCgogIGNvbnN0IFdvcmxkX3N0ZXBfcHJlU3RlcEV2ZW50ID0gewogICAgdHlwZTogJ3ByZVN0ZXAnCiAgfTsKICBjb25zdCBXb3JsZF9zdGVwX2NvbGxpZGVFdmVudCA9IHsKICAgIHR5cGU6IEJvZHkuQ09MTElERV9FVkVOVF9OQU1FLAogICAgYm9keTogbnVsbCwKICAgIGNvbnRhY3Q6IG51bGwKICB9OyAvLyBQb29scyBmb3IgdW51c2VkIG9iamVjdHMKCiAgY29uc3QgV29ybGRfc3RlcF9vbGRDb250YWN0cyA9IFtdOwogIGNvbnN0IFdvcmxkX3N0ZXBfZnJpY3Rpb25FcXVhdGlvblBvb2wgPSBbXTsgLy8gUmV1c2FibGUgYXJyYXlzIGZvciBjb2xsaXNpb24gcGFpcnMKCiAgY29uc3QgV29ybGRfc3RlcF9wMSA9IFtdOwogIGNvbnN0IFdvcmxkX3N0ZXBfcDIgPSBbXTsgLy8gU3R1ZmYgZm9yIGVtaXRDb250YWN0RXZlbnRzCgogIGNvbnN0IGFkZGl0aW9ucyA9IFtdOwogIGNvbnN0IHJlbW92YWxzID0gW107CiAgY29uc3QgYmVnaW5Db250YWN0RXZlbnQgPSB7CiAgICB0eXBlOiAnYmVnaW5Db250YWN0JywKICAgIGJvZHlBOiBudWxsLAogICAgYm9keUI6IG51bGwKICB9OwogIGNvbnN0IGVuZENvbnRhY3RFdmVudCA9IHsKICAgIHR5cGU6ICdlbmRDb250YWN0JywKICAgIGJvZHlBOiBudWxsLAogICAgYm9keUI6IG51bGwKICB9OwogIGNvbnN0IGJlZ2luU2hhcGVDb250YWN0RXZlbnQgPSB7CiAgICB0eXBlOiAnYmVnaW5TaGFwZUNvbnRhY3QnLAogICAgYm9keUE6IG51bGwsCiAgICBib2R5QjogbnVsbCwKICAgIHNoYXBlQTogbnVsbCwKICAgIHNoYXBlQjogbnVsbAogIH07CiAgY29uc3QgZW5kU2hhcGVDb250YWN0RXZlbnQgPSB7CiAgICB0eXBlOiAnZW5kU2hhcGVDb250YWN0JywKICAgIGJvZHlBOiBudWxsLAogICAgYm9keUI6IG51bGwsCiAgICBzaGFwZUE6IG51bGwsCiAgICBzaGFwZUI6IG51bGwKICB9OwoKICBjb25zdCBhZGRDb250YWN0TWF0ZXJpYWwgPSAod29ybGQsIGNyZWF0ZU1hdGVyaWFsLCBfcmVmLCB1dWlkKSA9PiB7CiAgICBsZXQgW21hdGVyaWFsQSwgbWF0ZXJpYWxCLCBvcHRpb25zXSA9IF9yZWY7CiAgICBjb25zdCBtYXRBID0gY3JlYXRlTWF0ZXJpYWwobWF0ZXJpYWxBKTsKICAgIGNvbnN0IG1hdEIgPSBjcmVhdGVNYXRlcmlhbChtYXRlcmlhbEIpOwogICAgY29uc3QgY29udGFjdE1hdGVyaWFsID0gbmV3IENvbnRhY3RNYXRlcmlhbChtYXRBLCBtYXRCLCBvcHRpb25zKTsKICAgIGNvbnRhY3RNYXRlcmlhbC51dWlkID0gdXVpZDsKICAgIHdvcmxkLmFkZENvbnRhY3RNYXRlcmlhbChjb250YWN0TWF0ZXJpYWwpOwogIH07CiAgY29uc3QgcmVtb3ZlQ29udGFjdE1hdGVyaWFsID0gKHdvcmxkLCBjbVVVSUQpID0+IHsKICAgIGNvbnN0IGluZGV4ID0gd29ybGQuY29udGFjdG1hdGVyaWFscy5maW5kSW5kZXgoX3JlZjIgPT4gewogICAgICBsZXQgewogICAgICAgIHV1aWQKICAgICAgfSA9IF9yZWYyOwogICAgICByZXR1cm4gdXVpZCA9PT0gY21VVUlEOwogICAgfSk7CiAgICBjb25zdCBbewogICAgICBpZDogaQogICAgfSwgewogICAgICBpZDogagogICAgfV0gPSB3b3JsZC5jb250YWN0bWF0ZXJpYWxzW2luZGV4XS5tYXRlcmlhbHM7CiAgICB3b3JsZC5jb250YWN0bWF0ZXJpYWxzLnNwbGljZShpbmRleCwgMSk7CiAgICBkZWxldGUgd29ybGQuY29udGFjdE1hdGVyaWFsVGFibGUuZGF0YVtpIDwgaiA/IGAke2l9LSR7an1gIDogYCR7an0tJHtpfWBdOwogIH07CgogIGxldCBtYXRlcmlhbElkID0gMDsKICBjb25zdCBjcmVhdGVNYXRlcmlhbEZhY3RvcnkgPSBtYXRlcmlhbHMgPT4gZnVuY3Rpb24gKG5hbWVPck9wdGlvbnMpIHsKICAgIGlmIChuYW1lT3JPcHRpb25zID09PSB2b2lkIDApIHsKICAgICAgbmFtZU9yT3B0aW9ucyA9IHt9OwogICAgfQogICAgY29uc3QgbWF0ZXJpYWxPcHRpb25zID0gdHlwZW9mIG5hbWVPck9wdGlvbnMgPT09ICdzdHJpbmcnID8gewogICAgICBuYW1lOiBuYW1lT3JPcHRpb25zCiAgICB9IDogewogICAgICBuYW1lOiBTeW1ib2wuZm9yKGBNYXRlcmlhbCR7bWF0ZXJpYWxJZCsrfWApLAogICAgICAuLi5uYW1lT3JPcHRpb25zCiAgICB9OwogICAgY29uc3QgewogICAgICBuYW1lCiAgICB9ID0gbWF0ZXJpYWxPcHRpb25zOwogICAgbWF0ZXJpYWxzW25hbWVdID0gbWF0ZXJpYWxzW25hbWVdIHx8IG5ldyBNYXRlcmlhbChtYXRlcmlhbE9wdGlvbnMpOwogICAgcmV0dXJuIG1hdGVyaWFsc1tuYW1lXTsKICB9OwoKICAvKioKICAgKiBAdHlwZWRlZiB7IGltcG9ydCgnY2Fubm9uLWVzJykuTWF0ZXJpYWxPcHRpb25zIH0gTWF0ZXJpYWxPcHRpb25zCiAgICovCgogIGNvbnN0IG1ha2VWZWMzID0gX3JlZiA9PiB7CiAgICBsZXQgW3gsIHksIHpdID0gX3JlZjsKICAgIHJldHVybiBuZXcgVmVjMyh4LCB5LCB6KTsKICB9OwogIGNvbnN0IHByZXBhcmVTcGhlcmUgPSBhcmdzID0+IEFycmF5LmlzQXJyYXkoYXJncykgPyBhcmdzIDogW2FyZ3NdOwogIGNvbnN0IHByZXBhcmVDb252ZXhQb2x5aGVkcm9uID0gX3JlZjIgPT4gewogICAgbGV0IFt2LCBmYWNlcywgbiwgYSwgYm91bmRpbmdTcGhlcmVSYWRpdXNdID0gX3JlZjI7CiAgICByZXR1cm4gW3sKICAgICAgYXhlczogYSA/IGEubWFwKG1ha2VWZWMzKSA6IHVuZGVmaW5lZCwKICAgICAgYm91bmRpbmdTcGhlcmVSYWRpdXMsCiAgICAgIGZhY2VzLAogICAgICBub3JtYWxzOiBuID8gbi5tYXAobWFrZVZlYzMpIDogdW5kZWZpbmVkLAogICAgICB2ZXJ0aWNlczogdiA/IHYubWFwKG1ha2VWZWMzKSA6IHVuZGVmaW5lZAogICAgfV07CiAgfTsKICBmdW5jdGlvbiBjcmVhdGVTaGFwZSh0eXBlLCBhcmdzKSB7CiAgICBzd2l0Y2ggKHR5cGUpIHsKICAgICAgY2FzZSAnQm94JzoKICAgICAgICByZXR1cm4gbmV3IEJveChuZXcgVmVjMyguLi5hcmdzLm1hcCh2ID0+IHYgLyAyKSkpOwogICAgICAvLyBleHRlbnRzID0+IGhhbGZFeHRlbnRzCiAgICAgIGNhc2UgJ0NvbnZleFBvbHloZWRyb24nOgogICAgICAgIHJldHVybiBuZXcgQ29udmV4UG9seWhlZHJvbiguLi5wcmVwYXJlQ29udmV4UG9seWhlZHJvbihhcmdzKSk7CiAgICAgIGNhc2UgJ0N5bGluZGVyJzoKICAgICAgICByZXR1cm4gbmV3IEN5bGluZGVyKC4uLmFyZ3MpOwogICAgICAvLyBbIHJhZGl1c1RvcCwgcmFkaXVzQm90dG9tLCBoZWlnaHQsIG51bVNlZ21lbnRzIF0gPSBhcmdzCiAgICAgIGNhc2UgJ0hlaWdodGZpZWxkJzoKICAgICAgICByZXR1cm4gbmV3IEhlaWdodGZpZWxkKC4uLmFyZ3MpOwogICAgICAvLyBbIEFycmF5IGRhdGEsIG9wdGlvbnM6IHttaW5WYWx1ZSwgbWF4VmFsdWUsIGVsZW1lbnRTaXplfSAgXSA9IGFyZ3MKICAgICAgY2FzZSAnUGFydGljbGUnOgogICAgICAgIHJldHVybiBuZXcgUGFydGljbGUoKTsKICAgICAgLy8gbm8gYXJncwogICAgICBjYXNlICdQbGFuZSc6CiAgICAgICAgcmV0dXJuIG5ldyBQbGFuZSgpOwogICAgICAvLyBubyBhcmdzLCBpbmZpbml0ZSB4IGFuZCB5CiAgICAgIGNhc2UgJ1NwaGVyZSc6CiAgICAgICAgcmV0dXJuIG5ldyBTcGhlcmUoLi4ucHJlcGFyZVNwaGVyZShhcmdzKSk7CiAgICAgIC8vIHJhZGl1cyA9IGFyZ3MKICAgICAgY2FzZSAnVHJpbWVzaCc6CiAgICAgICAgcmV0dXJuIG5ldyBUcmltZXNoKC4uLmFyZ3MpOwogICAgICAvLyBbdmVydGljZXMsIGluZGljZXNdID0gYXJncwogICAgfQogIH0KCiAgLyoqCiAgICogQHBhcmFtIHtUSFJFRS5RdWF0ZXJuaW9ufSB0YXJnZXQKICAgKiBAcGFyYW0ge3sgcm90YXRpb24/OiBUSFJFRS5WZWN0b3IzVHVwbGUgcXVhdGVybmlvbj86IFRIUkVFLlZlY3RvcjRUdXBsZSB9fSBwcm9wcwogICAqIEByZXR1cm5zIHtUSFJFRS5RdWF0ZXJuaW9ufQogICAqLwogIGNvbnN0IHNldFF1YXRlcm5pb24gPSAodGFyZ2V0LCBfcmVmMykgPT4gewogICAgbGV0IHsKICAgICAgcXVhdGVybmlvbiwKICAgICAgcm90YXRpb24KICAgIH0gPSBfcmVmMzsKICAgIGlmIChxdWF0ZXJuaW9uKSB7CiAgICAgIHRhcmdldC5zZXQoLi4ucXVhdGVybmlvbik7CiAgICB9IGVsc2UgaWYgKHJvdGF0aW9uKSB7CiAgICAgIHRhcmdldC5zZXRGcm9tRXVsZXIoLi4ucm90YXRpb24pOwogICAgfQogICAgcmV0dXJuIHRhcmdldDsKICB9OwoKICAvKioKICAgKiBAZnVuY3Rpb24KICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucwogICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLnV1aWQKICAgKiBAcGFyYW0ge0JvZHlQcm9wc30gb3B0aW9ucy5wcm9wcwogICAqIEBwYXJhbSB7Qm9keVNoYXBlVHlwZX0gb3B0aW9ucy50eXBlCiAgICogQHBhcmFtIHsobWF0ZXJpYWxPcHRpb25zOiBNYXRlcmlhbE9wdGlvbnMpID0+IE1hdGVyaWFsID19IG9wdGlvbnMuY3JlYXRlTWF0ZXJpYWwKICAgKiBAcmV0dXJucyB7Qm9keX0KICAgKi8KICBjb25zdCBwcm9wc1RvQm9keSA9IG9wdGlvbnMgPT4gewogICAgY29uc3QgewogICAgICB1dWlkLAogICAgICBwcm9wcywKICAgICAgdHlwZSwKICAgICAgY3JlYXRlTWF0ZXJpYWwgPSBtYXRlcmlhbE9wdGlvbnMgPT4gbmV3IE1hdGVyaWFsKG1hdGVyaWFsT3B0aW9ucykKICAgIH0gPSBvcHRpb25zOwogICAgY29uc3QgewogICAgICBhbmd1bGFyRmFjdG9yID0gWzEsIDEsIDFdLAogICAgICBhbmd1bGFyVmVsb2NpdHkgPSBbMCwgMCwgMF0sCiAgICAgIGFyZ3MgPSBbXSwKICAgICAgY29sbGlzaW9uUmVzcG9uc2UsCiAgICAgIGxpbmVhckZhY3RvciA9IFsxLCAxLCAxXSwKICAgICAgbWFzcywKICAgICAgbWF0ZXJpYWwsCiAgICAgIG9uQ29sbGlkZSwKICAgICAgcG9zaXRpb24gPSBbMCwgMCwgMF0sCiAgICAgIHJvdGF0aW9uLAogICAgICBxdWF0ZXJuaW9uLAogICAgICBzaGFwZXMsCiAgICAgIHR5cGU6IGJvZHlUeXBlLAogICAgICB2ZWxvY2l0eSA9IFswLCAwLCAwXSwKICAgICAgLi4uZXh0cmEKICAgIH0gPSBwcm9wczsKICAgIGNvbnN0IGJvZHkgPSBuZXcgQm9keSh7CiAgICAgIC4uLmV4dHJhLAogICAgICBtYXNzOiBib2R5VHlwZSA9PT0gJ1N0YXRpYycgPyAwIDogbWFzcywKICAgICAgbWF0ZXJpYWw6IG1hdGVyaWFsID8gY3JlYXRlTWF0ZXJpYWwobWF0ZXJpYWwpIDogdW5kZWZpbmVkLAogICAgICB0eXBlOiBib2R5VHlwZSA/IEJvZHlbYm9keVR5cGUudG9VcHBlckNhc2UoKV0gOiB1bmRlZmluZWQKICAgIH0pOwogICAgYm9keS51dWlkID0gdXVpZDsKICAgIGlmIChjb2xsaXNpb25SZXNwb25zZSAhPT0gdW5kZWZpbmVkKSB7CiAgICAgIGJvZHkuY29sbGlzaW9uUmVzcG9uc2UgPSBjb2xsaXNpb25SZXNwb25zZTsKICAgIH0KICAgIGlmICh0eXBlID09PSAnQ29tcG91bmQnKSB7CiAgICAgIHNoYXBlcy5mb3JFYWNoKF9yZWY0ID0+IHsKICAgICAgICBsZXQgewogICAgICAgICAgdHlwZSwKICAgICAgICAgIGFyZ3MsCiAgICAgICAgICBwb3NpdGlvbiwKICAgICAgICAgIHJvdGF0aW9uLAogICAgICAgICAgcXVhdGVybmlvbiwKICAgICAgICAgIG1hdGVyaWFsLAogICAgICAgICAgLi4uZXh0cmEKICAgICAgICB9ID0gX3JlZjQ7CiAgICAgICAgY29uc3Qgc2hhcGVCb2R5ID0gYm9keS5hZGRTaGFwZShjcmVhdGVTaGFwZSh0eXBlLCBhcmdzKSwgcG9zaXRpb24gPyBuZXcgVmVjMyguLi5wb3NpdGlvbikgOiB1bmRlZmluZWQsIHNldFF1YXRlcm5pb24obmV3IFF1YXRlcm5pb24oMCwgMCwgMCwgMSksIHsKICAgICAgICAgIHF1YXRlcm5pb24sCiAgICAgICAgICByb3RhdGlvbgogICAgICAgIH0pKTsKICAgICAgICBpZiAobWF0ZXJpYWwpIHNoYXBlQm9keS5tYXRlcmlhbCA9IGNyZWF0ZU1hdGVyaWFsKG1hdGVyaWFsKTsKICAgICAgICBPYmplY3QuYXNzaWduKHNoYXBlQm9keSwgZXh0cmEpOwogICAgICB9KTsKICAgIH0gZWxzZSB7CiAgICAgIGJvZHkuYWRkU2hhcGUoY3JlYXRlU2hhcGUodHlwZSwgYXJncykpOwogICAgfQogICAgYm9keS5wb3NpdGlvbi5zZXQocG9zaXRpb25bMF0sIHBvc2l0aW9uWzFdLCBwb3NpdGlvblsyXSk7CiAgICBib2R5LnZlbG9jaXR5LnNldCh2ZWxvY2l0eVswXSwgdmVsb2NpdHlbMV0sIHZlbG9jaXR5WzJdKTsKICAgIGJvZHkuYW5ndWxhclZlbG9jaXR5LnNldChhbmd1bGFyVmVsb2NpdHlbMF0sIGFuZ3VsYXJWZWxvY2l0eVsxXSwgYW5ndWxhclZlbG9jaXR5WzJdKTsKICAgIGJvZHkubGluZWFyRmFjdG9yLnNldChsaW5lYXJGYWN0b3JbMF0sIGxpbmVhckZhY3RvclsxXSwgbGluZWFyRmFjdG9yWzJdKTsKICAgIGJvZHkuYW5ndWxhckZhY3Rvci5zZXQoYW5ndWxhckZhY3RvclswXSwgYW5ndWxhckZhY3RvclsxXSwgYW5ndWxhckZhY3RvclsyXSk7CiAgICBzZXRRdWF0ZXJuaW9uKGJvZHkucXVhdGVybmlvbiwgewogICAgICBxdWF0ZXJuaW9uLAogICAgICByb3RhdGlvbgogICAgfSk7CiAgICByZXR1cm4gYm9keTsKICB9OwoKICBjb25zdCBhZGRCb2RpZXMgPSAoc3RhdGUsIGNyZWF0ZU1hdGVyaWFsLCBfcmVmKSA9PiB7CiAgICBsZXQgewogICAgICBwcm9wcywKICAgICAgdHlwZSwKICAgICAgdXVpZAogICAgfSA9IF9yZWY7CiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHV1aWQubGVuZ3RoOyBpKyspIHsKICAgICAgY29uc3QgYm9keSA9IHByb3BzVG9Cb2R5KHsKICAgICAgICBjcmVhdGVNYXRlcmlhbCwKICAgICAgICBwcm9wczogcHJvcHNbaV0sCiAgICAgICAgdHlwZSwKICAgICAgICB1dWlkOiB1dWlkW2ldCiAgICAgIH0pOwogICAgICBzdGF0ZS53b3JsZC5hZGRCb2R5KGJvZHkpOwogICAgICBpZiAocHJvcHNbaV0ub25Db2xsaWRlKSBib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbGxpZGUnLCBfcmVmMiA9PiB7CiAgICAgICAgbGV0IHsKICAgICAgICAgIHR5cGUsCiAgICAgICAgICBib2R5LAogICAgICAgICAgdGFyZ2V0LAogICAgICAgICAgY29udGFjdAogICAgICAgIH0gPSBfcmVmMjsKICAgICAgICBpZiAoIWJvZHkudXVpZCB8fCAhdGFyZ2V0LnV1aWQpIHJldHVybjsKICAgICAgICBjb25zdCB7CiAgICAgICAgICBuaSwKICAgICAgICAgIHJpLAogICAgICAgICAgcmosCiAgICAgICAgICBiaSwKICAgICAgICAgIGJqLAogICAgICAgICAgaWQKICAgICAgICB9ID0gY29udGFjdDsKICAgICAgICBjb25zdCBjb250YWN0UG9pbnQgPSBiaS5wb3NpdGlvbi52YWRkKHJpKTsKICAgICAgICBjb25zdCBjb250YWN0Tm9ybWFsID0gYmkgPT09IGJvZHkgPyBuaSA6IG5pLnNjYWxlKC0xKTsKICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHsKICAgICAgICAgIGJvZHk6IGJvZHkudXVpZCwKICAgICAgICAgIGNvbGxpc2lvbkZpbHRlcnM6IHsKICAgICAgICAgICAgYm9keUZpbHRlckdyb3VwOiBib2R5LmNvbGxpc2lvbkZpbHRlckdyb3VwLAogICAgICAgICAgICBib2R5RmlsdGVyTWFzazogYm9keS5jb2xsaXNpb25GaWx0ZXJNYXNrLAogICAgICAgICAgICB0YXJnZXRGaWx0ZXJHcm91cDogdGFyZ2V0LmNvbGxpc2lvbkZpbHRlckdyb3VwLAogICAgICAgICAgICB0YXJnZXRGaWx0ZXJNYXNrOiB0YXJnZXQuY29sbGlzaW9uRmlsdGVyTWFzawogICAgICAgICAgfSwKICAgICAgICAgIGNvbnRhY3Q6IHsKICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciBUT0RPOiB1c2UgaWQgaW5zdGVhZCBvZiB1dWlkCiAgICAgICAgICAgIGJpOiBiaS51dWlkLAogICAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIFRPRE86IHVzZSBpZCBpbnN0ZWFkIG9mIHV1aWQKICAgICAgICAgICAgYmo6IGJqLnV1aWQsCiAgICAgICAgICAgIC8vIE5vcm1hbCBvZiB0aGUgY29udGFjdCwgcmVsYXRpdmUgdG8gdGhlIGNvbGxpZGluZyBib2R5CiAgICAgICAgICAgIGNvbnRhY3ROb3JtYWw6IGNvbnRhY3ROb3JtYWwudG9BcnJheSgpLAogICAgICAgICAgICAvLyBXb3JsZCBwb3NpdGlvbiBvZiB0aGUgY29udGFjdAogICAgICAgICAgICBjb250YWN0UG9pbnQ6IGNvbnRhY3RQb2ludC50b0FycmF5KCksCiAgICAgICAgICAgIGlkLAogICAgICAgICAgICBpbXBhY3RWZWxvY2l0eTogY29udGFjdC5nZXRJbXBhY3RWZWxvY2l0eUFsb25nTm9ybWFsKCksCiAgICAgICAgICAgIG5pOiBuaS50b0FycmF5KCksCiAgICAgICAgICAgIHJpOiByaS50b0FycmF5KCksCiAgICAgICAgICAgIHJqOiByai50b0FycmF5KCkKICAgICAgICAgIH0sCiAgICAgICAgICBvcDogJ2V2ZW50JywKICAgICAgICAgIHRhcmdldDogdGFyZ2V0LnV1aWQsCiAgICAgICAgICB0eXBlCiAgICAgICAgfSk7CiAgICAgIH0pOwogICAgfQogIH07CgogIGNvbnN0IHRyaXBsZXRUb1ZlYzMgPSB0ID0+IHQgPyBuZXcgVmVjMyguLi50KSA6IHVuZGVmaW5lZDsKCiAgY29uc3QgYWRkQ29uc3RyYWludCA9IChzdGF0ZSwgX3JlZikgPT4gewogICAgbGV0IHsKICAgICAgcHJvcHM6IFtib2R5QSwgYm9keUIsIHsKICAgICAgICBhbmdsZSwKICAgICAgICBheGlzQSwKICAgICAgICBheGlzQiwKICAgICAgICBjb2xsaWRlQ29ubmVjdGVkLAogICAgICAgIGRpc3RhbmNlLAogICAgICAgIG1heEZvcmNlLAogICAgICAgIG1heE11bHRpcGxpZXIsCiAgICAgICAgcGl2b3RBLAogICAgICAgIHBpdm90QiwKICAgICAgICB0d2lzdEFuZ2xlLAogICAgICAgIHdha2VVcEJvZGllcwogICAgICB9XSwKICAgICAgdHlwZSwKICAgICAgdXVpZAogICAgfSA9IF9yZWY7CiAgICBsZXQgY29uc3RyYWludDsKICAgIHN3aXRjaCAodHlwZSkgewogICAgICBjYXNlICdQb2ludFRvUG9pbnQnOgogICAgICAgIGNvbnN0cmFpbnQgPSBuZXcgUG9pbnRUb1BvaW50Q29uc3RyYWludChzdGF0ZS5ib2RpZXNbYm9keUFdLCB0cmlwbGV0VG9WZWMzKHBpdm90QSksIHN0YXRlLmJvZGllc1tib2R5Ql0sIHRyaXBsZXRUb1ZlYzMocGl2b3RCKSwgbWF4Rm9yY2UpOwogICAgICAgIGJyZWFrOwogICAgICBjYXNlICdDb25lVHdpc3QnOgogICAgICAgIGNvbnN0cmFpbnQgPSBuZXcgQ29uZVR3aXN0Q29uc3RyYWludChzdGF0ZS5ib2RpZXNbYm9keUFdLCBzdGF0ZS5ib2RpZXNbYm9keUJdLCB7CiAgICAgICAgICBhbmdsZSwKICAgICAgICAgIGF4aXNBOiB0cmlwbGV0VG9WZWMzKGF4aXNBKSwKICAgICAgICAgIGF4aXNCOiB0cmlwbGV0VG9WZWMzKGF4aXNCKSwKICAgICAgICAgIGNvbGxpZGVDb25uZWN0ZWQsCiAgICAgICAgICBtYXhGb3JjZSwKICAgICAgICAgIHBpdm90QTogdHJpcGxldFRvVmVjMyhwaXZvdEEpLAogICAgICAgICAgcGl2b3RCOiB0cmlwbGV0VG9WZWMzKHBpdm90QiksCiAgICAgICAgICB0d2lzdEFuZ2xlCiAgICAgICAgfSk7CiAgICAgICAgYnJlYWs7CiAgICAgIGNhc2UgJ0hpbmdlJzoKICAgICAgICBjb25zdHJhaW50ID0gbmV3IEhpbmdlQ29uc3RyYWludChzdGF0ZS5ib2RpZXNbYm9keUFdLCBzdGF0ZS5ib2RpZXNbYm9keUJdLCB7CiAgICAgICAgICBheGlzQTogdHJpcGxldFRvVmVjMyhheGlzQSksCiAgICAgICAgICBheGlzQjogdHJpcGxldFRvVmVjMyhheGlzQiksCiAgICAgICAgICBjb2xsaWRlQ29ubmVjdGVkLAogICAgICAgICAgbWF4Rm9yY2UsCiAgICAgICAgICBwaXZvdEE6IHRyaXBsZXRUb1ZlYzMocGl2b3RBKSwKICAgICAgICAgIHBpdm90QjogdHJpcGxldFRvVmVjMyhwaXZvdEIpCiAgICAgICAgfSk7CiAgICAgICAgYnJlYWs7CiAgICAgIGNhc2UgJ0Rpc3RhbmNlJzoKICAgICAgICBjb25zdHJhaW50ID0gbmV3IERpc3RhbmNlQ29uc3RyYWludChzdGF0ZS5ib2RpZXNbYm9keUFdLCBzdGF0ZS5ib2RpZXNbYm9keUJdLCBkaXN0YW5jZSwgbWF4Rm9yY2UpOwogICAgICAgIGJyZWFrOwogICAgICBjYXNlICdMb2NrJzoKICAgICAgICBjb25zdHJhaW50ID0gbmV3IExvY2tDb25zdHJhaW50KHN0YXRlLmJvZGllc1tib2R5QV0sIHN0YXRlLmJvZGllc1tib2R5Ql0sIHsKICAgICAgICAgIG1heEZvcmNlCiAgICAgICAgfSk7CiAgICAgICAgYnJlYWs7CiAgICAgIGRlZmF1bHQ6CiAgICAgICAgY29uc3RyYWludCA9IG5ldyBDb25zdHJhaW50KHN0YXRlLmJvZGllc1tib2R5QV0sIHN0YXRlLmJvZGllc1tib2R5Ql0sIHsKICAgICAgICAgIGNvbGxpZGVDb25uZWN0ZWQsCiAgICAgICAgICB3YWtlVXBCb2RpZXMKICAgICAgICB9KTsKICAgICAgICBicmVhazsKICAgIH0KICAgIGNvbnN0cmFpbnQudXVpZCA9IHV1aWQ7CiAgICBzdGF0ZS53b3JsZC5hZGRDb25zdHJhaW50KGNvbnN0cmFpbnQpOwogICAgaWYgKG1heE11bHRpcGxpZXIgIT09IHVuZGVmaW5lZCkgewogICAgICBjb25zdCBwb3N0U3RlcENvbnN0cmFpbnQgPSAoKSA9PiB7CiAgICAgICAgLy8gVGhlIG11bHRpcGxpZXIgaXMgcHJvcG9ydGlvbmFsIHRvIGhvdyBtdWNoIGZvcmNlIGlzIGFkZGVkIHRvIHRoZSBib2RpZXMgYnkgdGhlIGNvbnN0cmFpbnQuCiAgICAgICAgLy8gSWYgdGhpcyBleGNlZWRzIGEgbGltaXQgdGhlIGNvbnN0cmFpbnQgaXMgZGlzYWJsZWQuCiAgICAgICAgY29uc3QgbXVsdGlwbGllciA9IE1hdGguYWJzKGNvbnN0cmFpbnQuZXF1YXRpb25zWzBdLm11bHRpcGxpZXIpOwogICAgICAgIGlmIChtdWx0aXBsaWVyID4gbWF4TXVsdGlwbGllcikgewogICAgICAgICAgY29uc3RyYWludC5kaXNhYmxlKCk7CiAgICAgICAgfQogICAgICB9OwogICAgICBzdGF0ZS5jb25zdHJhaW50c1t1dWlkXSA9IHBvc3RTdGVwQ29uc3RyYWludDsKICAgICAgc3RhdGUud29ybGQuYWRkRXZlbnRMaXN0ZW5lcigncG9zdFN0ZXAnLCBzdGF0ZS5jb25zdHJhaW50c1t1dWlkXSk7CiAgICB9CiAgfTsKCiAgZnVuY3Rpb24gdG9VcHBlcmNhc2Uoc3RyKSB7CiAgICByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7CiAgfQogIGNvbnN0IGFkZFJheSA9IChzdGF0ZSwgX3JlZikgPT4gewogICAgbGV0IHsKICAgICAgcHJvcHM6IHsKICAgICAgICBmcm9tLAogICAgICAgIG1vZGUsCiAgICAgICAgdG8sCiAgICAgICAgLi4ucmF5T3B0aW9ucwogICAgICB9LAogICAgICB1dWlkCiAgICB9ID0gX3JlZjsKICAgIGNvbnN0IHJheSA9IG5ldyBSYXkodHJpcGxldFRvVmVjMyhmcm9tKSwgdHJpcGxldFRvVmVjMyh0bykpOwogICAgY29uc3Qgb3B0aW9ucyA9IHsKICAgICAgbW9kZTogUkFZX01PREVTW3RvVXBwZXJjYXNlKG1vZGUpXSwKICAgICAgcmVzdWx0OiBuZXcgUmF5Y2FzdFJlc3VsdCgpLAogICAgICAuLi5yYXlPcHRpb25zCiAgICB9OwogICAgc3RhdGUucmF5c1t1dWlkXSA9ICgpID0+IHsKICAgICAgcmF5LmludGVyc2VjdFdvcmxkKHN0YXRlLndvcmxkLCBvcHRpb25zKTsKICAgICAgaWYgKCFvcHRpb25zLnJlc3VsdCB8fCAhb3B0aW9ucy5yZXN1bHQuYm9keSkgcmV0dXJuOwogICAgICBjb25zdCB7CiAgICAgICAgYm9keSwKICAgICAgICBzaGFwZSwKICAgICAgICByYXlGcm9tV29ybGQsCiAgICAgICAgcmF5VG9Xb3JsZCwKICAgICAgICBoaXROb3JtYWxXb3JsZCwKICAgICAgICBoaXRQb2ludFdvcmxkLAogICAgICAgIC4uLnJlc3QKICAgICAgfSA9IG9wdGlvbnMucmVzdWx0OwogICAgICBjb25zdCBib2R5VVVJRCA9IGJvZHkudXVpZDsKICAgICAgaWYgKCFib2R5VVVJRCkgcmV0dXJuOwogICAgICBzZWxmLnBvc3RNZXNzYWdlKHsKICAgICAgICBib2R5OiBib2R5VVVJRCwKICAgICAgICBoaXROb3JtYWxXb3JsZDogaGl0Tm9ybWFsV29ybGQudG9BcnJheSgpLAogICAgICAgIGhpdFBvaW50V29ybGQ6IGhpdFBvaW50V29ybGQudG9BcnJheSgpLAogICAgICAgIG9wOiAnZXZlbnQnLAogICAgICAgIHJheTogewogICAgICAgICAgY29sbGlzaW9uRmlsdGVyR3JvdXA6IHJheS5jb2xsaXNpb25GaWx0ZXJHcm91cCwKICAgICAgICAgIGNvbGxpc2lvbkZpbHRlck1hc2s6IHJheS5jb2xsaXNpb25GaWx0ZXJNYXNrLAogICAgICAgICAgZGlyZWN0aW9uOiByYXkuZGlyZWN0aW9uLnRvQXJyYXkoKSwKICAgICAgICAgIGZyb20sCiAgICAgICAgICB0bywKICAgICAgICAgIHV1aWQKICAgICAgICB9LAogICAgICAgIHJheUZyb21Xb3JsZDogcmF5RnJvbVdvcmxkLnRvQXJyYXkoKSwKICAgICAgICByYXlUb1dvcmxkOiByYXlUb1dvcmxkLnRvQXJyYXkoKSwKICAgICAgICBzaGFwZTogc2hhcGUgPyB7CiAgICAgICAgICAuLi5zaGFwZSwKICAgICAgICAgIGJvZHk6IGJvZHlVVUlECiAgICAgICAgfSA6IG51bGwsCiAgICAgICAgdHlwZTogJ3JheWhpdCcsCiAgICAgICAgLi4ucmVzdAogICAgICB9KTsKICAgIH07CiAgICBzdGF0ZS53b3JsZC5hZGRFdmVudExpc3RlbmVyKCdwcmVTdGVwJywgc3RhdGUucmF5c1t1dWlkXSk7CiAgfTsKCiAgY29uc3QgYWRkUmF5Y2FzdFZlaGljbGUgPSAoc3RhdGUsIGRhdGEpID0+IHsKICAgIGNvbnN0IFtjaGFzc2lzQm9keSwgd2hlZWxzLCB3aGVlbEluZm9zLCBpbmRleEZvcndhcmRBeGlzLCBpbmRleFJpZ2h0QXhpcywgaW5kZXhVcEF4aXNdID0gZGF0YS5wcm9wczsKICAgIGNvbnN0IHZlaGljbGUgPSBuZXcgUmF5Y2FzdFZlaGljbGUoewogICAgICBjaGFzc2lzQm9keTogc3RhdGUuYm9kaWVzW2NoYXNzaXNCb2R5XSwKICAgICAgaW5kZXhGb3J3YXJkQXhpcywKICAgICAgaW5kZXhSaWdodEF4aXMsCiAgICAgIGluZGV4VXBBeGlzCiAgICB9KTsKICAgIHZlaGljbGUud29ybGQgPSBzdGF0ZS53b3JsZDsKICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2hlZWxJbmZvcy5sZW5ndGg7IGkrKykgewogICAgICBjb25zdCB7CiAgICAgICAgYXhsZUxvY2FsLAogICAgICAgIGNoYXNzaXNDb25uZWN0aW9uUG9pbnRMb2NhbCwKICAgICAgICBkaXJlY3Rpb25Mb2NhbCwKICAgICAgICAuLi5yZXN0CiAgICAgIH0gPSB3aGVlbEluZm9zW2ldOwogICAgICB2ZWhpY2xlLmFkZFdoZWVsKHsKICAgICAgICBheGxlTG9jYWw6IHRyaXBsZXRUb1ZlYzMoYXhsZUxvY2FsKSwKICAgICAgICBjaGFzc2lzQ29ubmVjdGlvblBvaW50TG9jYWw6IHRyaXBsZXRUb1ZlYzMoY2hhc3Npc0Nvbm5lY3Rpb25Qb2ludExvY2FsKSwKICAgICAgICBkaXJlY3Rpb25Mb2NhbDogdHJpcGxldFRvVmVjMyhkaXJlY3Rpb25Mb2NhbCksCiAgICAgICAgLi4ucmVzdAogICAgICB9KTsKICAgIH0KICAgIGNvbnN0IHByZVN0ZXAgPSAoKSA9PiB7CiAgICAgIHZlaGljbGUudXBkYXRlVmVoaWNsZShzdGF0ZS53b3JsZC5kdCk7CiAgICB9OwogICAgY29uc3QgcG9zdFN0ZXAgPSAoKSA9PiB7CiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVoaWNsZS53aGVlbEluZm9zLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgdmVoaWNsZS51cGRhdGVXaGVlbFRyYW5zZm9ybShpKTsKICAgICAgICBjb25zdCB0ID0gdmVoaWNsZS53aGVlbEluZm9zW2ldLndvcmxkVHJhbnNmb3JtOwogICAgICAgIGNvbnN0IHdoZWVsQm9keSA9IHN0YXRlLmJvZGllc1t3aGVlbHNbaV1dOwogICAgICAgIHdoZWVsQm9keS5wb3NpdGlvbi5jb3B5KHQucG9zaXRpb24pOwogICAgICAgIHdoZWVsQm9keS5xdWF0ZXJuaW9uLmNvcHkodC5xdWF0ZXJuaW9uKTsKICAgICAgfQogICAgfTsKICAgIHN0YXRlLnZlaGljbGVzW2RhdGEudXVpZF0gPSB7CiAgICAgIHBvc3RTdGVwLAogICAgICBwcmVTdGVwLAogICAgICB2ZWhpY2xlCiAgICB9OwogICAgc3RhdGUud29ybGQuYWRkRXZlbnRMaXN0ZW5lcigncHJlU3RlcCcsIHByZVN0ZXApOwogICAgc3RhdGUud29ybGQuYWRkRXZlbnRMaXN0ZW5lcigncG9zdFN0ZXAnLCBwb3N0U3RlcCk7CiAgfTsKCiAgY29uc3QgYWRkU3ByaW5nID0gKHN0YXRlLCBfcmVmKSA9PiB7CiAgICBsZXQgewogICAgICBwcm9wczogW2JvZHlBLCBib2R5QiwgewogICAgICAgIGRhbXBpbmcsCiAgICAgICAgbG9jYWxBbmNob3JBLAogICAgICAgIGxvY2FsQW5jaG9yQiwKICAgICAgICByZXN0TGVuZ3RoLAogICAgICAgIHN0aWZmbmVzcywKICAgICAgICB3b3JsZEFuY2hvckEsCiAgICAgICAgd29ybGRBbmNob3JCCiAgICAgIH1dLAogICAgICB1dWlkCiAgICB9ID0gX3JlZjsKICAgIGNvbnN0IHNwcmluZyA9IG5ldyBTcHJpbmcoc3RhdGUuYm9kaWVzW2JvZHlBXSwgc3RhdGUuYm9kaWVzW2JvZHlCXSwgewogICAgICBkYW1waW5nLAogICAgICBsb2NhbEFuY2hvckE6IHRyaXBsZXRUb1ZlYzMobG9jYWxBbmNob3JBKSwKICAgICAgbG9jYWxBbmNob3JCOiB0cmlwbGV0VG9WZWMzKGxvY2FsQW5jaG9yQiksCiAgICAgIHJlc3RMZW5ndGgsCiAgICAgIHN0aWZmbmVzcywKICAgICAgd29ybGRBbmNob3JBOiB0cmlwbGV0VG9WZWMzKHdvcmxkQW5jaG9yQSksCiAgICAgIHdvcmxkQW5jaG9yQjogdHJpcGxldFRvVmVjMyh3b3JsZEFuY2hvckIpCiAgICB9KTsKICAgIHNwcmluZy51dWlkID0gdXVpZDsKICAgIGNvbnN0IHBvc3RTdGVwU3ByaW5nID0gKCkgPT4gc3ByaW5nLmFwcGx5Rm9yY2UoKTsKICAgIHN0YXRlLnNwcmluZ3NbdXVpZF0gPSBwb3N0U3RlcFNwcmluZzsKICAgIHN0YXRlLnNwcmluZ0luc3RhbmNlc1t1dWlkXSA9IHNwcmluZzsKCiAgICAvLyBDb21wdXRlIHRoZSBmb3JjZSBhZnRlciBlYWNoIHN0ZXAKICAgIHN0YXRlLndvcmxkLmFkZEV2ZW50TGlzdGVuZXIoJ3Bvc3RTdGVwJywgc3RhdGUuc3ByaW5nc1t1dWlkXSk7CiAgfTsKCiAgZnVuY3Rpb24gZW1pdEJlZ2luQ29udGFjdChfcmVmKSB7CiAgICBsZXQgewogICAgICBib2R5QSwKICAgICAgYm9keUIKICAgIH0gPSBfcmVmOwogICAgaWYgKCEoYm9keUEgIT0gbnVsbCAmJiBib2R5QS51dWlkKSB8fCAhKGJvZHlCICE9IG51bGwgJiYgYm9keUIudXVpZCkpIHJldHVybjsKICAgIHNlbGYucG9zdE1lc3NhZ2UoewogICAgICBib2R5QTogYm9keUEudXVpZCwKICAgICAgYm9keUI6IGJvZHlCLnV1aWQsCiAgICAgIG9wOiAnZXZlbnQnLAogICAgICB0eXBlOiAnY29sbGlkZUJlZ2luJwogICAgfSk7CiAgfQogIGZ1bmN0aW9uIGVtaXRFbmRDb250YWN0KF9yZWYyKSB7CiAgICBsZXQgewogICAgICBib2R5QSwKICAgICAgYm9keUIKICAgIH0gPSBfcmVmMjsKICAgIGlmICghKGJvZHlBICE9IG51bGwgJiYgYm9keUEudXVpZCkgfHwgIShib2R5QiAhPSBudWxsICYmIGJvZHlCLnV1aWQpKSByZXR1cm47CiAgICBzZWxmLnBvc3RNZXNzYWdlKHsKICAgICAgYm9keUE6IGJvZHlBLnV1aWQsCiAgICAgIGJvZHlCOiBib2R5Qi51dWlkLAogICAgICBvcDogJ2V2ZW50JywKICAgICAgdHlwZTogJ2NvbGxpZGVFbmQnCiAgICB9KTsKICB9CiAgY29uc3QgaW5pdCA9ICh3b3JsZCwgX3JlZjMpID0+IHsKICAgIGxldCB7CiAgICAgIGFsbG93U2xlZXAsCiAgICAgIGF4aXNJbmRleCA9IDAsCiAgICAgIGJyb2FkcGhhc2UsCiAgICAgIGRlZmF1bHRDb250YWN0TWF0ZXJpYWwsCiAgICAgIGZyaWN0aW9uR3Jhdml0eSwKICAgICAgZ3Jhdml0eSwKICAgICAgaXRlcmF0aW9ucywKICAgICAgcXVhdE5vcm1hbGl6ZUZhc3QsCiAgICAgIHF1YXROb3JtYWxpemVTa2lwLAogICAgICBzb2x2ZXIsCiAgICAgIHRvbGVyYW5jZQogICAgfSA9IF9yZWYzOwogICAgd29ybGQuYWxsb3dTbGVlcCA9IGFsbG93U2xlZXA7CiAgICB3b3JsZC5ncmF2aXR5LnNldCguLi5ncmF2aXR5KTsKICAgIHdvcmxkLmZyaWN0aW9uR3Jhdml0eSA9IGZyaWN0aW9uR3Jhdml0eSA/IG5ldyBWZWMzKC4uLmZyaWN0aW9uR3Jhdml0eSkgOiB1bmRlZmluZWQ7CiAgICB3b3JsZC5xdWF0Tm9ybWFsaXplRmFzdCA9IHF1YXROb3JtYWxpemVGYXN0OwogICAgd29ybGQucXVhdE5vcm1hbGl6ZVNraXAgPSBxdWF0Tm9ybWFsaXplU2tpcDsKICAgIGlmIChzb2x2ZXIgPT09ICdTcGxpdCcpIHsKICAgICAgd29ybGQuc29sdmVyID0gbmV3IFNwbGl0U29sdmVyKG5ldyBHU1NvbHZlcigpKTsKICAgIH0KICAgIGlmICh3b3JsZC5zb2x2ZXIgaW5zdGFuY2VvZiBHU1NvbHZlcikgewogICAgICB3b3JsZC5zb2x2ZXIudG9sZXJhbmNlID0gdG9sZXJhbmNlOwogICAgICB3b3JsZC5zb2x2ZXIuaXRlcmF0aW9ucyA9IGl0ZXJhdGlvbnM7CiAgICB9CiAgICB3b3JsZC5icm9hZHBoYXNlID0gYnJvYWRwaGFzZSA9PT0gJ1NBUCcgPyBuZXcgU0FQQnJvYWRwaGFzZSh3b3JsZCkgOiBuZXcgTmFpdmVCcm9hZHBoYXNlKCk7CiAgICBpZiAod29ybGQuYnJvYWRwaGFzZSBpbnN0YW5jZW9mIFNBUEJyb2FkcGhhc2UpIHsKICAgICAgd29ybGQuYnJvYWRwaGFzZS5heGlzSW5kZXggPSBheGlzSW5kZXg7CiAgICB9CiAgICB3b3JsZC5hZGRFdmVudExpc3RlbmVyKCdiZWdpbkNvbnRhY3QnLCBlbWl0QmVnaW5Db250YWN0KTsKICAgIHdvcmxkLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZENvbnRhY3QnLCBlbWl0RW5kQ29udGFjdCk7CiAgICBPYmplY3QuYXNzaWduKHdvcmxkLmRlZmF1bHRDb250YWN0TWF0ZXJpYWwsIGRlZmF1bHRDb250YWN0TWF0ZXJpYWwpOwogIH07CgogIGNvbnN0IGlzUW9yViA9IHYgPT4gdiBpbnN0YW5jZW9mIFF1YXRlcm5pb24gfHwgdiBpbnN0YW5jZW9mIFZlYzM7CiAgY29uc3Qgc3RlcCA9IChzdGF0ZSwgX3JlZikgPT4gewogICAgbGV0IHsKICAgICAgcG9zaXRpb25zLAogICAgICBwcm9wczogewogICAgICAgIG1heFN1YlN0ZXBzLAogICAgICAgIHN0ZXBTaXplLAogICAgICAgIHRpbWVTaW5jZUxhc3RDYWxsZWQKICAgICAgfSwKICAgICAgcXVhdGVybmlvbnMKICAgIH0gPSBfcmVmOwogICAgc3RhdGUud29ybGQuc3RlcChzdGVwU2l6ZSwgdGltZVNpbmNlTGFzdENhbGxlZCwgbWF4U3ViU3RlcHMpOwogICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGF0ZS53b3JsZC5ib2RpZXMubGVuZ3RoOyBpICs9IDEpIHsKICAgICAgY29uc3QgcCA9IHN0YXRlLndvcmxkLmJvZGllc1tpXS5wb3NpdGlvbjsKICAgICAgY29uc3QgcSA9IHN0YXRlLndvcmxkLmJvZGllc1tpXS5xdWF0ZXJuaW9uOwogICAgICBwb3NpdGlvbnNbMyAqIGkgKyAwXSA9IHAueDsKICAgICAgcG9zaXRpb25zWzMgKiBpICsgMV0gPSBwLnk7CiAgICAgIHBvc2l0aW9uc1szICogaSArIDJdID0gcC56OwogICAgICBxdWF0ZXJuaW9uc1s0ICogaSArIDBdID0gcS54OwogICAgICBxdWF0ZXJuaW9uc1s0ICogaSArIDFdID0gcS55OwogICAgICBxdWF0ZXJuaW9uc1s0ICogaSArIDJdID0gcS56OwogICAgICBxdWF0ZXJuaW9uc1s0ICogaSArIDNdID0gcS53OwogICAgfQogICAgY29uc3Qgb2JzZXJ2YXRpb25zID0gW107CiAgICBmb3IgKGNvbnN0IGlkIG9mIE9iamVjdC5rZXlzKHN0YXRlLnN1YnNjcmlwdGlvbnMpKSB7CiAgICAgIGNvbnN0IFt1dWlkLCB0eXBlLCB0YXJnZXQgPSAnYm9kaWVzJ10gPSBzdGF0ZS5zdWJzY3JpcHRpb25zW2lkXTsKICAgICAgY29uc3QgewogICAgICAgIGJvZGllcywKICAgICAgICB2ZWhpY2xlcwogICAgICB9ID0gc3RhdGU7CiAgICAgIGNvbnN0IHZhbHVlID0gdGFyZ2V0ID09PSAndmVoaWNsZXMnID8KICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciBUT0RPOiBEaWZmZXJlbnRpYXRlIHRoZXNlICJ0eXBlcyIKICAgICAgdmVoaWNsZXNbdXVpZF0udmVoaWNsZVt0eXBlXSA6CiAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgVE9ETzogRGlmZmVyZW50aWF0ZSB0aGVzZSAidHlwZXMiCiAgICAgIGJvZGllc1t1dWlkXVt0eXBlXTsKICAgICAgY29uc3Qgc2VyaWFsaXphYmxlVmFsdWUgPSBpc1FvclYodmFsdWUpID8gdmFsdWUudG9BcnJheSgpIDogdmFsdWU7CiAgICAgIG9ic2VydmF0aW9ucy5wdXNoKFtOdW1iZXIoaWQpLCBzZXJpYWxpemFibGVWYWx1ZSwKICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciBUT0RPOiBEaWZmZXJlbnRpYXRlIHRoZXNlICJ0eXBlcyIKICAgICAgdHlwZV0pOwogICAgfQogICAgY29uc3QgbWVzc2FnZSA9IHsKICAgICAgYWN0aXZlOiBzdGF0ZS53b3JsZC5oYXNBY3RpdmVCb2RpZXMsCiAgICAgIG9ic2VydmF0aW9ucywKICAgICAgb3A6ICdmcmFtZScsCiAgICAgIHBvc2l0aW9ucywKICAgICAgcXVhdGVybmlvbnMKICAgIH07CiAgICBpZiAoc3RhdGUuYm9kaWVzTmVlZFN5bmNpbmcpIHsKICAgICAgbWVzc2FnZS5ib2RpZXMgPSBzdGF0ZS53b3JsZC5ib2RpZXMucmVkdWNlKChib2RpZXMsIGJvZHkpID0+IHsKICAgICAgICBpZiAoYm9keS51dWlkKSBib2RpZXMucHVzaChib2R5LnV1aWQpOwogICAgICAgIHJldHVybiBib2RpZXM7CiAgICAgIH0sIFtdKTsKICAgICAgc3RhdGUuYm9kaWVzTmVlZFN5bmNpbmcgPSBmYWxzZTsKICAgIH0KICAgIHNlbGYucG9zdE1lc3NhZ2UobWVzc2FnZSwgW3Bvc2l0aW9ucy5idWZmZXIsIHF1YXRlcm5pb25zLmJ1ZmZlcl0pOwogIH07CgogIGNvbnN0IHN0YXRlID0gewogICAgYm9kaWVzOiB7fSwKICAgIGJvZGllc05lZWRTeW5jaW5nOiBmYWxzZSwKICAgIGNvbnN0cmFpbnRzOiB7fSwKICAgIG1hdGVyaWFsczoge30sCiAgICByYXlzOiB7fSwKICAgIHNwcmluZ0luc3RhbmNlczoge30sCiAgICBzcHJpbmdzOiB7fSwKICAgIHN1YnNjcmlwdGlvbnM6IHt9LAogICAgdmVoaWNsZXM6IHt9LAogICAgd29ybGQ6IG5ldyBXb3JsZCgpCiAgfTsKCiAgLy8vIDxyZWZlcmVuY2Ugbm8tZGVmYXVsdC1saWI9InRydWUiLz4KICBjb25zdCBpc0hpbmdlQ29uc3RyYWludCA9IGMgPT4gYyBpbnN0YW5jZW9mIEhpbmdlQ29uc3RyYWludDsKICBmdW5jdGlvbiBzeW5jQm9kaWVzKCkgewogICAgc3RhdGUuYm9kaWVzTmVlZFN5bmNpbmcgPSB0cnVlOwogICAgc3RhdGUuYm9kaWVzID0gc3RhdGUud29ybGQuYm9kaWVzLnJlZHVjZSgoYm9kaWVzLCBib2R5KSA9PiBib2R5LnV1aWQgPyB7CiAgICAgIC4uLmJvZGllcywKICAgICAgW2JvZHkudXVpZF06IGJvZHkKICAgIH0gOiBib2RpZXMsIHt9KTsKICB9CiAgY29uc3QgYnJvYWRwaGFzZXMgPSB7CiAgICBOYWl2ZUJyb2FkcGhhc2UsCiAgICBTQVBCcm9hZHBoYXNlCiAgfTsKICBjb25zdCBjcmVhdGVNYXRlcmlhbCA9IGNyZWF0ZU1hdGVyaWFsRmFjdG9yeShzdGF0ZS5tYXRlcmlhbHMpOwogIHNlbGYub25tZXNzYWdlID0gX3JlZiA9PiB7CiAgICBsZXQgewogICAgICBkYXRhCiAgICB9ID0gX3JlZjsKICAgIHN3aXRjaCAoZGF0YS5vcCkgewogICAgICBjYXNlICdpbml0JzoKICAgICAgICB7CiAgICAgICAgICBpbml0KHN0YXRlLndvcmxkLCBkYXRhLnByb3BzKTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIH0KICAgICAgY2FzZSAnc3RlcCc6CiAgICAgICAgewogICAgICAgICAgc3RlcChzdGF0ZSwgZGF0YSk7CiAgICAgICAgICBicmVhazsKICAgICAgICB9CiAgICAgIGNhc2UgJ2FkZEJvZGllcyc6CiAgICAgICAgewogICAgICAgICAgYWRkQm9kaWVzKHN0YXRlLCBjcmVhdGVNYXRlcmlhbCwgZGF0YSk7CiAgICAgICAgICBzeW5jQm9kaWVzKCk7CiAgICAgICAgICBicmVhazsKICAgICAgICB9CiAgICAgIGNhc2UgJ3JlbW92ZUJvZGllcyc6CiAgICAgICAgewogICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLnV1aWQubGVuZ3RoOyBpKyspIHsKICAgICAgICAgICAgc3RhdGUud29ybGQucmVtb3ZlQm9keShzdGF0ZS5ib2RpZXNbZGF0YS51dWlkW2ldXSk7CiAgICAgICAgICAgIGNvbnN0IGtleSA9IE9iamVjdC5rZXlzKHN0YXRlLnN1YnNjcmlwdGlvbnMpLmZpbmQoayA9PiBzdGF0ZS5zdWJzY3JpcHRpb25zW2tdWzBdID09PSBkYXRhLnV1aWRbaV0pOwogICAgICAgICAgICBpZiAoa2V5KSB7CiAgICAgICAgICAgICAgZGVsZXRlIHN0YXRlLnN1YnNjcmlwdGlvbnNba2V5XTsKICAgICAgICAgICAgfQogICAgICAgICAgfQogICAgICAgICAgc3luY0JvZGllcygpOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgfQogICAgICBjYXNlICdzdWJzY3JpYmUnOgogICAgICAgIHsKICAgICAgICAgIGNvbnN0IHsKICAgICAgICAgICAgaWQsCiAgICAgICAgICAgIHRhcmdldCwKICAgICAgICAgICAgdHlwZQogICAgICAgICAgfSA9IGRhdGEucHJvcHM7CiAgICAgICAgICBzdGF0ZS5zdWJzY3JpcHRpb25zW2lkXSA9IFtkYXRhLnV1aWQsIHR5cGUsIHRhcmdldF07CiAgICAgICAgICBicmVhazsKICAgICAgICB9CiAgICAgIGNhc2UgJ3Vuc3Vic2NyaWJlJzoKICAgICAgICB7CiAgICAgICAgICBkZWxldGUgc3RhdGUuc3Vic2NyaXB0aW9uc1tkYXRhLnByb3BzXTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIH0KICAgICAgY2FzZSAnc2V0UG9zaXRpb24nOgogICAgICAgIHN0YXRlLmJvZGllc1tkYXRhLnV1aWRdLnBvc2l0aW9uLnNldChkYXRhLnByb3BzWzBdLCBkYXRhLnByb3BzWzFdLCBkYXRhLnByb3BzWzJdKTsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAnc2V0UXVhdGVybmlvbic6CiAgICAgICAgc3RhdGUuYm9kaWVzW2RhdGEudXVpZF0ucXVhdGVybmlvbi5zZXQoZGF0YS5wcm9wc1swXSwgZGF0YS5wcm9wc1sxXSwgZGF0YS5wcm9wc1syXSwgZGF0YS5wcm9wc1szXSk7CiAgICAgICAgYnJlYWs7CiAgICAgIGNhc2UgJ3NldFJvdGF0aW9uJzoKICAgICAgICBzdGF0ZS5ib2RpZXNbZGF0YS51dWlkXS5xdWF0ZXJuaW9uLnNldEZyb21FdWxlcihkYXRhLnByb3BzWzBdLCBkYXRhLnByb3BzWzFdLCBkYXRhLnByb3BzWzJdKTsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAnc2V0VmVsb2NpdHknOgogICAgICAgIHN0YXRlLmJvZGllc1tkYXRhLnV1aWRdLnZlbG9jaXR5LnNldChkYXRhLnByb3BzWzBdLCBkYXRhLnByb3BzWzFdLCBkYXRhLnByb3BzWzJdKTsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAnc2V0QW5ndWxhclZlbG9jaXR5JzoKICAgICAgICBzdGF0ZS5ib2RpZXNbZGF0YS51dWlkXS5hbmd1bGFyVmVsb2NpdHkuc2V0KGRhdGEucHJvcHNbMF0sIGRhdGEucHJvcHNbMV0sIGRhdGEucHJvcHNbMl0pOwogICAgICAgIGJyZWFrOwogICAgICBjYXNlICdzZXRMaW5lYXJGYWN0b3InOgogICAgICAgIHN0YXRlLmJvZGllc1tkYXRhLnV1aWRdLmxpbmVhckZhY3Rvci5zZXQoZGF0YS5wcm9wc1swXSwgZGF0YS5wcm9wc1sxXSwgZGF0YS5wcm9wc1syXSk7CiAgICAgICAgYnJlYWs7CiAgICAgIGNhc2UgJ3NldEFuZ3VsYXJGYWN0b3InOgogICAgICAgIHN0YXRlLmJvZGllc1tkYXRhLnV1aWRdLmFuZ3VsYXJGYWN0b3Iuc2V0KGRhdGEucHJvcHNbMF0sIGRhdGEucHJvcHNbMV0sIGRhdGEucHJvcHNbMl0pOwogICAgICAgIGJyZWFrOwogICAgICBjYXNlICdzZXRNYXNzJzoKICAgICAgICBzdGF0ZS5ib2RpZXNbZGF0YS51dWlkXS5tYXNzID0gZGF0YS5wcm9wczsKICAgICAgICBzdGF0ZS5ib2RpZXNbZGF0YS51dWlkXS51cGRhdGVNYXNzUHJvcGVydGllcygpOwogICAgICAgIGJyZWFrOwogICAgICBjYXNlICdzZXRNYXRlcmlhbCc6CiAgICAgICAgc3RhdGUuYm9kaWVzW2RhdGEudXVpZF0ubWF0ZXJpYWwgPSBkYXRhLnByb3BzID8gY3JlYXRlTWF0ZXJpYWwoZGF0YS5wcm9wcykgOiBudWxsOwogICAgICAgIGJyZWFrOwogICAgICBjYXNlICdzZXRMaW5lYXJEYW1waW5nJzoKICAgICAgICBzdGF0ZS5ib2RpZXNbZGF0YS51dWlkXS5saW5lYXJEYW1waW5nID0gZGF0YS5wcm9wczsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAnc2V0QW5ndWxhckRhbXBpbmcnOgogICAgICAgIHN0YXRlLmJvZGllc1tkYXRhLnV1aWRdLmFuZ3VsYXJEYW1waW5nID0gZGF0YS5wcm9wczsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAnc2V0QWxsb3dTbGVlcCc6CiAgICAgICAgc3RhdGUuYm9kaWVzW2RhdGEudXVpZF0uYWxsb3dTbGVlcCA9IGRhdGEucHJvcHM7CiAgICAgICAgYnJlYWs7CiAgICAgIGNhc2UgJ3NldFNsZWVwU3BlZWRMaW1pdCc6CiAgICAgICAgc3RhdGUuYm9kaWVzW2RhdGEudXVpZF0uc2xlZXBTcGVlZExpbWl0ID0gZGF0YS5wcm9wczsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAnc2V0U2xlZXBUaW1lTGltaXQnOgogICAgICAgIHN0YXRlLmJvZGllc1tkYXRhLnV1aWRdLnNsZWVwVGltZUxpbWl0ID0gZGF0YS5wcm9wczsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAnc2V0Q29sbGlzaW9uRmlsdGVyR3JvdXAnOgogICAgICAgIHN0YXRlLmJvZGllc1tkYXRhLnV1aWRdLmNvbGxpc2lvbkZpbHRlckdyb3VwID0gZGF0YS5wcm9wczsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAnc2V0Q29sbGlzaW9uRmlsdGVyTWFzayc6CiAgICAgICAgc3RhdGUuYm9kaWVzW2RhdGEudXVpZF0uY29sbGlzaW9uRmlsdGVyTWFzayA9IGRhdGEucHJvcHM7CiAgICAgICAgYnJlYWs7CiAgICAgIGNhc2UgJ3NldENvbGxpc2lvblJlc3BvbnNlJzoKICAgICAgICBzdGF0ZS5ib2RpZXNbZGF0YS51dWlkXS5jb2xsaXNpb25SZXNwb25zZSA9IGRhdGEucHJvcHM7CiAgICAgICAgYnJlYWs7CiAgICAgIGNhc2UgJ3NldEZpeGVkUm90YXRpb24nOgogICAgICAgIHN0YXRlLmJvZGllc1tkYXRhLnV1aWRdLmZpeGVkUm90YXRpb24gPSBkYXRhLnByb3BzOwogICAgICAgIGJyZWFrOwogICAgICBjYXNlICdzZXRGcmljdGlvbkdyYXZpdHknOgogICAgICAgIHN0YXRlLndvcmxkLmZyaWN0aW9uR3Jhdml0eSA9IGRhdGEucHJvcHMgPyBuZXcgVmVjMyguLi5kYXRhLnByb3BzKSA6IHVuZGVmaW5lZDsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAnc2V0SXNUcmlnZ2VyJzoKICAgICAgICBzdGF0ZS5ib2RpZXNbZGF0YS51dWlkXS5pc1RyaWdnZXIgPSBkYXRhLnByb3BzOwogICAgICAgIGJyZWFrOwogICAgICBjYXNlICdzZXRHcmF2aXR5JzoKICAgICAgICBzdGF0ZS53b3JsZC5ncmF2aXR5LnNldChkYXRhLnByb3BzWzBdLCBkYXRhLnByb3BzWzFdLCBkYXRhLnByb3BzWzJdKTsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAnc2V0VG9sZXJhbmNlJzoKICAgICAgICBpZiAoc3RhdGUud29ybGQuc29sdmVyIGluc3RhbmNlb2YgR1NTb2x2ZXIpIHsKICAgICAgICAgIHN0YXRlLndvcmxkLnNvbHZlci50b2xlcmFuY2UgPSBkYXRhLnByb3BzOwogICAgICAgIH0KICAgICAgICBicmVhazsKICAgICAgY2FzZSAnc2V0SXRlcmF0aW9ucyc6CiAgICAgICAgaWYgKHN0YXRlLndvcmxkLnNvbHZlciBpbnN0YW5jZW9mIEdTU29sdmVyKSB7CiAgICAgICAgICBzdGF0ZS53b3JsZC5zb2x2ZXIuaXRlcmF0aW9ucyA9IGRhdGEucHJvcHM7CiAgICAgICAgfQogICAgICAgIGJyZWFrOwogICAgICBjYXNlICdzZXRCcm9hZHBoYXNlJzoKICAgICAgICBzdGF0ZS53b3JsZC5icm9hZHBoYXNlID0gbmV3IChicm9hZHBoYXNlc1tgJHtkYXRhLnByb3BzfUJyb2FkcGhhc2VgXSB8fCBOYWl2ZUJyb2FkcGhhc2UpKHN0YXRlLndvcmxkKTsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAnc2V0QXhpc0luZGV4JzoKICAgICAgICBpZiAoc3RhdGUud29ybGQuYnJvYWRwaGFzZSBpbnN0YW5jZW9mIFNBUEJyb2FkcGhhc2UpIHsKICAgICAgICAgIHN0YXRlLndvcmxkLmJyb2FkcGhhc2UuYXhpc0luZGV4ID0gZGF0YS5wcm9wcyA9PT0gdW5kZWZpbmVkIHx8IGRhdGEucHJvcHMgPT09IG51bGwgPyAwIDogZGF0YS5wcm9wczsKICAgICAgICB9CiAgICAgICAgYnJlYWs7CiAgICAgIGNhc2UgJ2FwcGx5Rm9yY2UnOgogICAgICAgIHN0YXRlLmJvZGllc1tkYXRhLnV1aWRdLmFwcGx5Rm9yY2UobmV3IFZlYzMoLi4uZGF0YS5wcm9wc1swXSksIG5ldyBWZWMzKC4uLmRhdGEucHJvcHNbMV0pKTsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAnYXBwbHlJbXB1bHNlJzoKICAgICAgICBzdGF0ZS5ib2RpZXNbZGF0YS51dWlkXS5hcHBseUltcHVsc2UobmV3IFZlYzMoLi4uZGF0YS5wcm9wc1swXSksIG5ldyBWZWMzKC4uLmRhdGEucHJvcHNbMV0pKTsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAnYXBwbHlMb2NhbEZvcmNlJzoKICAgICAgICBzdGF0ZS5ib2RpZXNbZGF0YS51dWlkXS5hcHBseUxvY2FsRm9yY2UobmV3IFZlYzMoLi4uZGF0YS5wcm9wc1swXSksIG5ldyBWZWMzKC4uLmRhdGEucHJvcHNbMV0pKTsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAnYXBwbHlMb2NhbEltcHVsc2UnOgogICAgICAgIHN0YXRlLmJvZGllc1tkYXRhLnV1aWRdLmFwcGx5TG9jYWxJbXB1bHNlKG5ldyBWZWMzKC4uLmRhdGEucHJvcHNbMF0pLCBuZXcgVmVjMyguLi5kYXRhLnByb3BzWzFdKSk7CiAgICAgICAgYnJlYWs7CiAgICAgIGNhc2UgJ2FwcGx5VG9ycXVlJzoKICAgICAgICBzdGF0ZS5ib2RpZXNbZGF0YS51dWlkXS5hcHBseVRvcnF1ZShuZXcgVmVjMyguLi5kYXRhLnByb3BzWzBdKSk7CiAgICAgICAgYnJlYWs7CiAgICAgIGNhc2UgJ2FkZENvbnN0cmFpbnQnOgogICAgICAgIHsKICAgICAgICAgIGFkZENvbnN0cmFpbnQoc3RhdGUsIGRhdGEpOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgfQogICAgICBjYXNlICdyZW1vdmVDb25zdHJhaW50JzoKICAgICAgICBzdGF0ZS53b3JsZC5jb25zdHJhaW50cy5maWx0ZXIoX3JlZjIgPT4gewogICAgICAgICAgbGV0IHsKICAgICAgICAgICAgdXVpZAogICAgICAgICAgfSA9IF9yZWYyOwogICAgICAgICAgcmV0dXJuIHV1aWQgPT09IGRhdGEudXVpZDsKICAgICAgICB9KS5tYXAoYyA9PiBzdGF0ZS53b3JsZC5yZW1vdmVDb25zdHJhaW50KGMpKTsKICAgICAgICBpZiAoc3RhdGUuY29uc3RyYWludHNbZGF0YS51dWlkXSkgewogICAgICAgICAgc3RhdGUud29ybGQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9zdFN0ZXAnLCBzdGF0ZS5jb25zdHJhaW50c1tkYXRhLnV1aWRdKTsKICAgICAgICAgIGRlbGV0ZSBzdGF0ZS5jb25zdHJhaW50c1tkYXRhLnV1aWRdOwogICAgICAgIH0KICAgICAgICBicmVhazsKICAgICAgY2FzZSAnZW5hYmxlQ29uc3RyYWludCc6CiAgICAgICAgc3RhdGUud29ybGQuY29uc3RyYWludHMuZmlsdGVyKGMgPT4gYy51dWlkID09PSBkYXRhLnV1aWQpLm1hcChjID0+IGMuZW5hYmxlKCkpOwogICAgICAgIGJyZWFrOwogICAgICBjYXNlICdkaXNhYmxlQ29uc3RyYWludCc6CiAgICAgICAgc3RhdGUud29ybGQuY29uc3RyYWludHMuZmlsdGVyKGMgPT4gYy51dWlkID09PSBkYXRhLnV1aWQpLm1hcChjID0+IGMuZGlzYWJsZSgpKTsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAnZW5hYmxlQ29uc3RyYWludE1vdG9yJzoKICAgICAgICBzdGF0ZS53b3JsZC5jb25zdHJhaW50cy5maWx0ZXIoYyA9PiBjLnV1aWQgPT09IGRhdGEudXVpZCkuZmlsdGVyKGlzSGluZ2VDb25zdHJhaW50KS5tYXAoYyA9PiBjLmVuYWJsZU1vdG9yKCkpOwogICAgICAgIGJyZWFrOwogICAgICBjYXNlICdkaXNhYmxlQ29uc3RyYWludE1vdG9yJzoKICAgICAgICBzdGF0ZS53b3JsZC5jb25zdHJhaW50cy5maWx0ZXIoYyA9PiBjLnV1aWQgPT09IGRhdGEudXVpZCkuZmlsdGVyKGlzSGluZ2VDb25zdHJhaW50KS5tYXAoYyA9PiBjLmRpc2FibGVNb3RvcigpKTsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAnc2V0Q29uc3RyYWludE1vdG9yU3BlZWQnOgogICAgICAgIHN0YXRlLndvcmxkLmNvbnN0cmFpbnRzLmZpbHRlcihjID0+IGMudXVpZCA9PT0gZGF0YS51dWlkKS5maWx0ZXIoaXNIaW5nZUNvbnN0cmFpbnQpLm1hcChjID0+IGMuc2V0TW90b3JTcGVlZChkYXRhLnByb3BzKSk7CiAgICAgICAgYnJlYWs7CiAgICAgIGNhc2UgJ3NldENvbnN0cmFpbnRNb3Rvck1heEZvcmNlJzoKICAgICAgICBzdGF0ZS53b3JsZC5jb25zdHJhaW50cy5maWx0ZXIoYyA9PiBjLnV1aWQgPT09IGRhdGEudXVpZCkuZmlsdGVyKGlzSGluZ2VDb25zdHJhaW50KS5tYXAoYyA9PiBjLnNldE1vdG9yTWF4Rm9yY2UoZGF0YS5wcm9wcykpOwogICAgICAgIGJyZWFrOwogICAgICBjYXNlICdhZGRTcHJpbmcnOgogICAgICAgIHsKICAgICAgICAgIGFkZFNwcmluZyhzdGF0ZSwgZGF0YSk7CiAgICAgICAgICBicmVhazsKICAgICAgICB9CiAgICAgIGNhc2UgJ3NldFNwcmluZ1N0aWZmbmVzcyc6CiAgICAgICAgewogICAgICAgICAgc3RhdGUuc3ByaW5nSW5zdGFuY2VzW2RhdGEudXVpZF0uc3RpZmZuZXNzID0gZGF0YS5wcm9wczsKICAgICAgICAgIGJyZWFrOwogICAgICAgIH0KICAgICAgY2FzZSAnc2V0U3ByaW5nUmVzdExlbmd0aCc6CiAgICAgICAgewogICAgICAgICAgc3RhdGUuc3ByaW5nSW5zdGFuY2VzW2RhdGEudXVpZF0ucmVzdExlbmd0aCA9IGRhdGEucHJvcHM7CiAgICAgICAgICBicmVhazsKICAgICAgICB9CiAgICAgIGNhc2UgJ3NldFNwcmluZ0RhbXBpbmcnOgogICAgICAgIHsKICAgICAgICAgIHN0YXRlLnNwcmluZ0luc3RhbmNlc1tkYXRhLnV1aWRdLmRhbXBpbmcgPSBkYXRhLnByb3BzOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgfQogICAgICBjYXNlICdyZW1vdmVTcHJpbmcnOgogICAgICAgIHsKICAgICAgICAgIHN0YXRlLndvcmxkLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Bvc3RTdGVwJywgc3RhdGUuc3ByaW5nc1tkYXRhLnV1aWRdKTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIH0KICAgICAgY2FzZSAnYWRkUmF5JzoKICAgICAgICB7CiAgICAgICAgICBhZGRSYXkoc3RhdGUsIGRhdGEpOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgfQogICAgICBjYXNlICdyZW1vdmVSYXknOgogICAgICAgIHsKICAgICAgICAgIHN0YXRlLndvcmxkLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3ByZVN0ZXAnLCBzdGF0ZS5yYXlzW2RhdGEudXVpZF0pOwogICAgICAgICAgZGVsZXRlIHN0YXRlLnJheXNbZGF0YS51dWlkXTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIH0KICAgICAgY2FzZSAnYWRkUmF5Y2FzdFZlaGljbGUnOgogICAgICAgIHsKICAgICAgICAgIGFkZFJheWNhc3RWZWhpY2xlKHN0YXRlLCBkYXRhKTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIH0KICAgICAgY2FzZSAncmVtb3ZlUmF5Y2FzdFZlaGljbGUnOgogICAgICAgIHsKICAgICAgICAgIHN0YXRlLndvcmxkLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3ByZVN0ZXAnLCBzdGF0ZS52ZWhpY2xlc1tkYXRhLnV1aWRdLnByZVN0ZXApOwogICAgICAgICAgc3RhdGUud29ybGQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9zdFN0ZXAnLCBzdGF0ZS52ZWhpY2xlc1tkYXRhLnV1aWRdLnBvc3RTdGVwKTsKICAgICAgICAgIHN0YXRlLnZlaGljbGVzW2RhdGEudXVpZF0udmVoaWNsZS53b3JsZCA9IG51bGw7CiAgICAgICAgICBkZWxldGUgc3RhdGUudmVoaWNsZXNbZGF0YS51dWlkXTsKICAgICAgICAgIGNvbnN0IGtleSA9IE9iamVjdC5rZXlzKHN0YXRlLnN1YnNjcmlwdGlvbnMpLmZpbmQoayA9PiBzdGF0ZS5zdWJzY3JpcHRpb25zW2tdWzBdID09PSBkYXRhLnV1aWQpOwogICAgICAgICAgaWYgKGtleSkgewogICAgICAgICAgICBkZWxldGUgc3RhdGUuc3Vic2NyaXB0aW9uc1trZXldOwogICAgICAgICAgfQogICAgICAgICAgYnJlYWs7CiAgICAgICAgfQogICAgICBjYXNlICdzZXRSYXljYXN0VmVoaWNsZVN0ZWVyaW5nVmFsdWUnOgogICAgICAgIHsKICAgICAgICAgIGNvbnN0IFt2YWx1ZSwgd2hlZWxJbmRleF0gPSBkYXRhLnByb3BzOwogICAgICAgICAgc3RhdGUudmVoaWNsZXNbZGF0YS51dWlkXS52ZWhpY2xlLnNldFN0ZWVyaW5nVmFsdWUodmFsdWUsIHdoZWVsSW5kZXgpOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgfQogICAgICBjYXNlICdhcHBseVJheWNhc3RWZWhpY2xlRW5naW5lRm9yY2UnOgogICAgICAgIHsKICAgICAgICAgIGNvbnN0IFt2YWx1ZSwgd2hlZWxJbmRleF0gPSBkYXRhLnByb3BzOwogICAgICAgICAgc3RhdGUudmVoaWNsZXNbZGF0YS51dWlkXS52ZWhpY2xlLmFwcGx5RW5naW5lRm9yY2UodmFsdWUsIHdoZWVsSW5kZXgpOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgfQogICAgICBjYXNlICdzZXRSYXljYXN0VmVoaWNsZUJyYWtlJzoKICAgICAgICB7CiAgICAgICAgICBjb25zdCBbYnJha2UsIHdoZWVsSW5kZXhdID0gZGF0YS5wcm9wczsKICAgICAgICAgIHN0YXRlLnZlaGljbGVzW2RhdGEudXVpZF0udmVoaWNsZS5zZXRCcmFrZShicmFrZSwgd2hlZWxJbmRleCk7CiAgICAgICAgICBicmVhazsKICAgICAgICB9CiAgICAgIGNhc2UgJ2FkZENvbnRhY3RNYXRlcmlhbCc6CiAgICAgICAgewogICAgICAgICAgYWRkQ29udGFjdE1hdGVyaWFsKHN0YXRlLndvcmxkLCBjcmVhdGVNYXRlcmlhbCwgZGF0YS5wcm9wcywgZGF0YS51dWlkKTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIH0KICAgICAgY2FzZSAncmVtb3ZlQ29udGFjdE1hdGVyaWFsJzoKICAgICAgICB7CiAgICAgICAgICByZW1vdmVDb250YWN0TWF0ZXJpYWwoc3RhdGUud29ybGQsIGRhdGEudXVpZCk7CiAgICAgICAgICBicmVhazsKICAgICAgICB9CiAgICAgIGNhc2UgJ3dha2VVcCc6CiAgICAgICAgewogICAgICAgICAgc3RhdGUuYm9kaWVzW2RhdGEudXVpZF0ud2FrZVVwKCk7CiAgICAgICAgICBicmVhazsKICAgICAgICB9CiAgICAgIGNhc2UgJ3NsZWVwJzoKICAgICAgICB7CiAgICAgICAgICBzdGF0ZS5ib2RpZXNbZGF0YS51dWlkXS5zbGVlcCgpOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgfQogICAgfQogIH07Cgp9KSgpOwoK", null, false);
var CannonWorkerAPI = class extends EventEmitter$1 {
  constructor(_ref) {
    let {
      allowSleep = false,
      axisIndex = 0,
      broadphase = "Naive",
      defaultContactMaterial = {
        contactEquationStiffness: 1e6
      },
      frictionGravity = null,
      gravity = [0, -9.81, 0],
      iterations = 5,
      quatNormalizeFast = false,
      quatNormalizeSkip = 0,
      size = 1e3,
      solver = "GS",
      tolerance = 1e-3
    } = _ref;
    super();
    __publicField(this, "messageQueue", []);
    __publicField(this, "worker", null);
    this.config = {
      allowSleep,
      axisIndex,
      broadphase,
      defaultContactMaterial,
      frictionGravity,
      gravity,
      iterations,
      quatNormalizeFast,
      quatNormalizeSkip,
      size,
      solver,
      tolerance
    };
    this.buffers = {
      positions: new Float32Array(size * 3),
      quaternions: new Float32Array(size * 4)
    };
  }
  get axisIndex() {
    return this.config.axisIndex;
  }
  set axisIndex(value) {
    this.config.axisIndex = value;
    this.postMessage({
      op: "setAxisIndex",
      props: value
    });
  }
  get broadphase() {
    return this.config.broadphase;
  }
  set broadphase(value) {
    this.config.broadphase = value;
    this.postMessage({
      op: "setBroadphase",
      props: value
    });
  }
  get frictionGravity() {
    return this.config.frictionGravity;
  }
  set frictionGravity(value) {
    this.config.frictionGravity = value;
    this.postMessage({
      op: "setFrictionGravity",
      props: value
    });
  }
  get gravity() {
    return this.config.gravity;
  }
  set gravity(value) {
    this.config.gravity = value;
    this.postMessage({
      op: "setGravity",
      props: value
    });
  }
  get iterations() {
    return this.config.iterations;
  }
  set iterations(value) {
    this.config.iterations = value;
    this.postMessage({
      op: "setIterations",
      props: value
    });
  }
  get tolerance() {
    return this.config.tolerance;
  }
  set tolerance(value) {
    this.config.tolerance = value;
    this.postMessage({
      op: "setTolerance",
      props: value
    });
  }
  addBodies(_ref2) {
    let {
      props,
      type,
      uuid
    } = _ref2;
    this.postMessage({
      op: "addBodies",
      props,
      type,
      uuid
    });
  }
  addConstraint(_ref3) {
    let {
      props: [refA, refB, optns],
      type,
      uuid
    } = _ref3;
    this.postMessage({
      op: "addConstraint",
      props: [refA, refB, optns],
      type,
      uuid
    });
  }
  addContactMaterial(_ref4) {
    let {
      props,
      uuid
    } = _ref4;
    this.postMessage({
      op: "addContactMaterial",
      props,
      uuid
    });
  }
  addRay(_ref5) {
    let {
      props,
      uuid
    } = _ref5;
    this.postMessage({
      op: "addRay",
      props,
      uuid
    });
  }
  addRaycastVehicle(_ref6) {
    let {
      props: [chassisBodyUUID, wheelUUIDs, wheelInfos, indexForwardAxis, indexRightAxis, indexUpAxis],
      uuid
    } = _ref6;
    this.postMessage({
      op: "addRaycastVehicle",
      props: [chassisBodyUUID, wheelUUIDs, wheelInfos, indexForwardAxis, indexRightAxis, indexUpAxis],
      uuid
    });
  }
  addSpring(_ref7) {
    let {
      props: [refA, refB, optns],
      uuid
    } = _ref7;
    this.postMessage({
      op: "addSpring",
      props: [refA, refB, optns],
      uuid
    });
  }
  applyForce(_ref8) {
    let {
      props,
      uuid
    } = _ref8;
    this.postMessage({
      op: "applyForce",
      props,
      uuid
    });
  }
  applyImpulse(_ref9) {
    let {
      props,
      uuid
    } = _ref9;
    this.postMessage({
      op: "applyImpulse",
      props,
      uuid
    });
  }
  applyLocalForce(_ref10) {
    let {
      props,
      uuid
    } = _ref10;
    this.postMessage({
      op: "applyLocalForce",
      props,
      uuid
    });
  }
  applyLocalImpulse(_ref11) {
    let {
      props,
      uuid
    } = _ref11;
    this.postMessage({
      op: "applyLocalImpulse",
      props,
      uuid
    });
  }
  applyRaycastVehicleEngineForce(_ref12) {
    let {
      props,
      uuid
    } = _ref12;
    this.postMessage({
      op: "applyRaycastVehicleEngineForce",
      props,
      uuid
    });
  }
  applyTorque(_ref13) {
    let {
      props,
      uuid
    } = _ref13;
    this.postMessage({
      op: "applyTorque",
      props,
      uuid
    });
  }
  connect() {
    this.worker = new WorkerFactory();
    this.worker.onmessage = (message) => {
      if (message.data.op === "frame") {
        this.buffers.positions = message.data.positions;
        this.buffers.quaternions = message.data.quaternions;
        this.emit(message.data.op, message.data);
        return;
      }
      this.emit(message.data.type, message.data);
    };
    for (const message of this.messageQueue) {
      this.worker.postMessage(message);
    }
    this.messageQueue.length = 0;
  }
  disableConstraint(_ref14) {
    let {
      uuid
    } = _ref14;
    this.postMessage({
      op: "disableConstraint",
      uuid
    });
  }
  disableConstraintMotor(_ref15) {
    let {
      uuid
    } = _ref15;
    this.postMessage({
      op: "disableConstraintMotor",
      uuid
    });
  }
  disconnect() {
    if (this.worker)
      this.worker.onmessage = null;
  }
  enableConstraint(_ref16) {
    let {
      uuid
    } = _ref16;
    this.postMessage({
      op: "enableConstraint",
      uuid
    });
  }
  enableConstraintMotor(_ref17) {
    let {
      uuid
    } = _ref17;
    this.postMessage({
      op: "enableConstraintMotor",
      uuid
    });
  }
  init() {
    const {
      allowSleep,
      axisIndex,
      broadphase,
      defaultContactMaterial,
      frictionGravity,
      gravity,
      iterations,
      quatNormalizeFast,
      quatNormalizeSkip,
      solver,
      tolerance
    } = this.config;
    this.postMessage({
      op: "init",
      props: {
        allowSleep,
        axisIndex,
        broadphase,
        defaultContactMaterial,
        frictionGravity,
        gravity,
        iterations,
        quatNormalizeFast,
        quatNormalizeSkip,
        solver,
        tolerance
      }
    });
  }
  removeBodies(_ref18) {
    let {
      uuid
    } = _ref18;
    this.postMessage({
      op: "removeBodies",
      uuid
    });
  }
  removeConstraint(_ref19) {
    let {
      uuid
    } = _ref19;
    this.postMessage({
      op: "removeConstraint",
      uuid
    });
  }
  removeContactMaterial(_ref20) {
    let {
      uuid
    } = _ref20;
    this.postMessage({
      op: "removeContactMaterial",
      uuid
    });
  }
  removeRay(_ref21) {
    let {
      uuid
    } = _ref21;
    this.postMessage({
      op: "removeRay",
      uuid
    });
  }
  removeRaycastVehicle(_ref22) {
    let {
      uuid
    } = _ref22;
    this.postMessage({
      op: "removeRaycastVehicle",
      uuid
    });
  }
  removeSpring(_ref23) {
    let {
      uuid
    } = _ref23;
    this.postMessage({
      op: "removeSpring",
      uuid
    });
  }
  setAllowSleep(_ref24) {
    let {
      props,
      uuid
    } = _ref24;
    this.postMessage({
      op: "setAllowSleep",
      props,
      uuid
    });
  }
  setAngularDamping(_ref25) {
    let {
      props,
      uuid
    } = _ref25;
    this.postMessage({
      op: "setAngularDamping",
      props,
      uuid
    });
  }
  setAngularFactor(_ref26) {
    let {
      props,
      uuid
    } = _ref26;
    this.postMessage({
      op: "setAngularFactor",
      props,
      uuid
    });
  }
  setAngularVelocity(_ref27) {
    let {
      props,
      uuid
    } = _ref27;
    this.postMessage({
      op: "setAngularVelocity",
      props,
      uuid
    });
  }
  setCollisionFilterGroup(_ref28) {
    let {
      props,
      uuid
    } = _ref28;
    this.postMessage({
      op: "setCollisionFilterGroup",
      props,
      uuid
    });
  }
  setCollisionFilterMask(_ref29) {
    let {
      props,
      uuid
    } = _ref29;
    this.postMessage({
      op: "setCollisionFilterMask",
      props,
      uuid
    });
  }
  setCollisionResponse(_ref30) {
    let {
      props,
      uuid
    } = _ref30;
    this.postMessage({
      op: "setCollisionResponse",
      props,
      uuid
    });
  }
  setConstraintMotorMaxForce(_ref31) {
    let {
      props,
      uuid
    } = _ref31;
    this.postMessage({
      op: "setConstraintMotorMaxForce",
      props,
      uuid
    });
  }
  setConstraintMotorSpeed(_ref32) {
    let {
      props,
      uuid
    } = _ref32;
    this.postMessage({
      op: "setConstraintMotorSpeed",
      props,
      uuid
    });
  }
  setFixedRotation(_ref33) {
    let {
      props,
      uuid
    } = _ref33;
    this.postMessage({
      op: "setFixedRotation",
      props,
      uuid
    });
  }
  setIsTrigger(_ref34) {
    let {
      props,
      uuid
    } = _ref34;
    this.postMessage({
      op: "setIsTrigger",
      props,
      uuid
    });
  }
  setLinearDamping(_ref35) {
    let {
      props,
      uuid
    } = _ref35;
    this.postMessage({
      op: "setLinearDamping",
      props,
      uuid
    });
  }
  setLinearFactor(_ref36) {
    let {
      props,
      uuid
    } = _ref36;
    this.postMessage({
      op: "setLinearFactor",
      props,
      uuid
    });
  }
  setMass(_ref37) {
    let {
      props,
      uuid
    } = _ref37;
    this.postMessage({
      op: "setMass",
      props,
      uuid
    });
  }
  setMaterial(_ref38) {
    let {
      props,
      uuid
    } = _ref38;
    this.postMessage({
      op: "setMaterial",
      props,
      uuid
    });
  }
  setPosition(_ref39) {
    let {
      props,
      uuid
    } = _ref39;
    this.postMessage({
      op: "setPosition",
      props,
      uuid
    });
  }
  setQuaternion(_ref40) {
    let {
      props: [x, y, z, w],
      uuid
    } = _ref40;
    this.postMessage({
      op: "setQuaternion",
      props: [x, y, z, w],
      uuid
    });
  }
  setRaycastVehicleBrake(_ref41) {
    let {
      props,
      uuid
    } = _ref41;
    this.postMessage({
      op: "setRaycastVehicleBrake",
      props,
      uuid
    });
  }
  setRaycastVehicleSteeringValue(_ref42) {
    let {
      props,
      uuid
    } = _ref42;
    this.postMessage({
      op: "setRaycastVehicleSteeringValue",
      props,
      uuid
    });
  }
  setRotation(_ref43) {
    let {
      props,
      uuid
    } = _ref43;
    this.postMessage({
      op: "setRotation",
      props,
      uuid
    });
  }
  setSleepSpeedLimit(_ref44) {
    let {
      props,
      uuid
    } = _ref44;
    this.postMessage({
      op: "setSleepSpeedLimit",
      props,
      uuid
    });
  }
  setSleepTimeLimit(_ref45) {
    let {
      props,
      uuid
    } = _ref45;
    this.postMessage({
      op: "setSleepTimeLimit",
      props,
      uuid
    });
  }
  setSpringDamping(_ref46) {
    let {
      props,
      uuid
    } = _ref46;
    this.postMessage({
      op: "setSpringDamping",
      props,
      uuid
    });
  }
  setSpringRestLength(_ref47) {
    let {
      props,
      uuid
    } = _ref47;
    this.postMessage({
      op: "setSpringRestLength",
      props,
      uuid
    });
  }
  setSpringStiffness(_ref48) {
    let {
      props,
      uuid
    } = _ref48;
    this.postMessage({
      op: "setSpringStiffness",
      props,
      uuid
    });
  }
  setUserData(_ref49) {
    let {
      props,
      uuid
    } = _ref49;
    this.postMessage({
      op: "setUserData",
      props,
      uuid
    });
  }
  setVelocity(_ref50) {
    let {
      props,
      uuid
    } = _ref50;
    this.postMessage({
      op: "setVelocity",
      props,
      uuid
    });
  }
  sleep(_ref51) {
    let {
      uuid
    } = _ref51;
    this.postMessage({
      op: "sleep",
      uuid
    });
  }
  step(props) {
    var _this$worker;
    const {
      buffers: {
        positions,
        quaternions
      }
    } = this;
    if (!positions.byteLength && !quaternions.byteLength)
      return;
    (_this$worker = this.worker) == null ? void 0 : _this$worker.postMessage({
      op: "step",
      positions,
      props,
      quaternions
    }, [positions.buffer, quaternions.buffer]);
  }
  subscribe(_ref52) {
    let {
      props: {
        id,
        target,
        type
      },
      uuid
    } = _ref52;
    this.postMessage({
      op: "subscribe",
      props: {
        id,
        target,
        type
      },
      uuid
    });
  }
  terminate() {
    var _this$worker2;
    (_this$worker2 = this.worker) == null ? void 0 : _this$worker2.terminate();
    this.worker = null;
  }
  unsubscribe(_ref53) {
    let {
      props
    } = _ref53;
    this.postMessage({
      op: "unsubscribe",
      props
    });
  }
  wakeUp(_ref54) {
    let {
      uuid
    } = _ref54;
    this.postMessage({
      op: "wakeUp",
      uuid
    });
  }
  postMessage(message) {
    if (this.worker)
      return this.worker.postMessage(message);
    this.messageQueue.push(message);
  }
};
var Mat3$1 = class _Mat3$1 {
  /**
   * A vector of length 9, containing all matrix elements.
   */
  /**
   * @param elements A vector of length 9, containing all matrix elements.
   */
  constructor(elements) {
    if (elements === void 0) {
      elements = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    this.elements = elements;
  }
  /**
   * Sets the matrix to identity
   * @todo Should perhaps be renamed to `setIdentity()` to be more clear.
   * @todo Create another function that immediately creates an identity matrix eg. `eye()`
   */
  identity() {
    const e2 = this.elements;
    e2[0] = 1;
    e2[1] = 0;
    e2[2] = 0;
    e2[3] = 0;
    e2[4] = 1;
    e2[5] = 0;
    e2[6] = 0;
    e2[7] = 0;
    e2[8] = 1;
  }
  /**
   * Set all elements to zero
   */
  setZero() {
    const e2 = this.elements;
    e2[0] = 0;
    e2[1] = 0;
    e2[2] = 0;
    e2[3] = 0;
    e2[4] = 0;
    e2[5] = 0;
    e2[6] = 0;
    e2[7] = 0;
    e2[8] = 0;
  }
  /**
   * Sets the matrix diagonal elements from a Vec3
   */
  setTrace(vector) {
    const e2 = this.elements;
    e2[0] = vector.x;
    e2[4] = vector.y;
    e2[8] = vector.z;
  }
  /**
   * Gets the matrix diagonal elements
   */
  getTrace(target) {
    if (target === void 0) {
      target = new Vec3$1();
    }
    const e2 = this.elements;
    target.x = e2[0];
    target.y = e2[4];
    target.z = e2[8];
    return target;
  }
  /**
   * Matrix-Vector multiplication
   * @param v The vector to multiply with
   * @param target Optional, target to save the result in.
   */
  vmult(v3, target) {
    if (target === void 0) {
      target = new Vec3$1();
    }
    const e2 = this.elements;
    const x = v3.x;
    const y = v3.y;
    const z = v3.z;
    target.x = e2[0] * x + e2[1] * y + e2[2] * z;
    target.y = e2[3] * x + e2[4] * y + e2[5] * z;
    target.z = e2[6] * x + e2[7] * y + e2[8] * z;
    return target;
  }
  /**
   * Matrix-scalar multiplication
   */
  smult(s2) {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i] *= s2;
    }
  }
  /**
   * Matrix multiplication
   * @param matrix Matrix to multiply with from left side.
   */
  mmult(matrix, target) {
    if (target === void 0) {
      target = new _Mat3$1();
    }
    const A = this.elements;
    const B = matrix.elements;
    const T = target.elements;
    const a11 = A[0], a12 = A[1], a13 = A[2], a21 = A[3], a22 = A[4], a23 = A[5], a31 = A[6], a32 = A[7], a33 = A[8];
    const b11 = B[0], b12 = B[1], b13 = B[2], b21 = B[3], b22 = B[4], b23 = B[5], b31 = B[6], b32 = B[7], b33 = B[8];
    T[0] = a11 * b11 + a12 * b21 + a13 * b31;
    T[1] = a11 * b12 + a12 * b22 + a13 * b32;
    T[2] = a11 * b13 + a12 * b23 + a13 * b33;
    T[3] = a21 * b11 + a22 * b21 + a23 * b31;
    T[4] = a21 * b12 + a22 * b22 + a23 * b32;
    T[5] = a21 * b13 + a22 * b23 + a23 * b33;
    T[6] = a31 * b11 + a32 * b21 + a33 * b31;
    T[7] = a31 * b12 + a32 * b22 + a33 * b32;
    T[8] = a31 * b13 + a32 * b23 + a33 * b33;
    return target;
  }
  /**
   * Scale each column of the matrix
   */
  scale(vector, target) {
    if (target === void 0) {
      target = new _Mat3$1();
    }
    const e2 = this.elements;
    const t = target.elements;
    for (let i = 0; i !== 3; i++) {
      t[3 * i + 0] = vector.x * e2[3 * i + 0];
      t[3 * i + 1] = vector.y * e2[3 * i + 1];
      t[3 * i + 2] = vector.z * e2[3 * i + 2];
    }
    return target;
  }
  /**
   * Solve Ax=b
   * @param b The right hand side
   * @param target Optional. Target vector to save in.
   * @return The solution x
   * @todo should reuse arrays
   */
  solve(b2, target) {
    if (target === void 0) {
      target = new Vec3$1();
    }
    const nr = 3;
    const nc = 4;
    const eqns = [];
    let i;
    let j;
    for (i = 0; i < nr * nc; i++) {
      eqns.push(0);
    }
    for (i = 0; i < 3; i++) {
      for (j = 0; j < 3; j++) {
        eqns[i + nc * j] = this.elements[i + 3 * j];
      }
    }
    eqns[3 + 4 * 0] = b2.x;
    eqns[3 + 4 * 1] = b2.y;
    eqns[3 + 4 * 2] = b2.z;
    let n = 3;
    const k = n;
    let np;
    const kp = 4;
    let p;
    do {
      i = k - n;
      if (eqns[i + nc * i] === 0) {
        for (j = i + 1; j < k; j++) {
          if (eqns[i + nc * j] !== 0) {
            np = kp;
            do {
              p = kp - np;
              eqns[p + nc * i] += eqns[p + nc * j];
            } while (--np);
            break;
          }
        }
      }
      if (eqns[i + nc * i] !== 0) {
        for (j = i + 1; j < k; j++) {
          const multiplier = eqns[i + nc * j] / eqns[i + nc * i];
          np = kp;
          do {
            p = kp - np;
            eqns[p + nc * j] = p <= i ? 0 : eqns[p + nc * j] - eqns[p + nc * i] * multiplier;
          } while (--np);
        }
      }
    } while (--n);
    target.z = eqns[2 * nc + 3] / eqns[2 * nc + 2];
    target.y = (eqns[1 * nc + 3] - eqns[1 * nc + 2] * target.z) / eqns[1 * nc + 1];
    target.x = (eqns[0 * nc + 3] - eqns[0 * nc + 2] * target.z - eqns[0 * nc + 1] * target.y) / eqns[0 * nc + 0];
    if (isNaN(target.x) || isNaN(target.y) || isNaN(target.z) || target.x === Infinity || target.y === Infinity || target.z === Infinity) {
      throw `Could not solve equation! Got x=[${target.toString()}], b=[${b2.toString()}], A=[${this.toString()}]`;
    }
    return target;
  }
  /**
   * Get an element in the matrix by index. Index starts at 0, not 1!!!
   * @param value If provided, the matrix element will be set to this value.
   */
  e(row, column, value) {
    if (value === void 0) {
      return this.elements[column + 3 * row];
    } else {
      this.elements[column + 3 * row] = value;
    }
  }
  /**
   * Copy another matrix into this matrix object.
   */
  copy(matrix) {
    for (let i = 0; i < matrix.elements.length; i++) {
      this.elements[i] = matrix.elements[i];
    }
    return this;
  }
  /**
   * Returns a string representation of the matrix.
   */
  toString() {
    let r = "";
    const sep = ",";
    for (let i = 0; i < 9; i++) {
      r += this.elements[i] + sep;
    }
    return r;
  }
  /**
   * reverse the matrix
   * @param target Target matrix to save in.
   * @return The solution x
   */
  reverse(target) {
    if (target === void 0) {
      target = new _Mat3$1();
    }
    const nr = 3;
    const nc = 6;
    const eqns = reverse_eqns$1;
    let i;
    let j;
    for (i = 0; i < 3; i++) {
      for (j = 0; j < 3; j++) {
        eqns[i + nc * j] = this.elements[i + 3 * j];
      }
    }
    eqns[3 + 6 * 0] = 1;
    eqns[3 + 6 * 1] = 0;
    eqns[3 + 6 * 2] = 0;
    eqns[4 + 6 * 0] = 0;
    eqns[4 + 6 * 1] = 1;
    eqns[4 + 6 * 2] = 0;
    eqns[5 + 6 * 0] = 0;
    eqns[5 + 6 * 1] = 0;
    eqns[5 + 6 * 2] = 1;
    let n = 3;
    const k = n;
    let np;
    const kp = nc;
    let p;
    do {
      i = k - n;
      if (eqns[i + nc * i] === 0) {
        for (j = i + 1; j < k; j++) {
          if (eqns[i + nc * j] !== 0) {
            np = kp;
            do {
              p = kp - np;
              eqns[p + nc * i] += eqns[p + nc * j];
            } while (--np);
            break;
          }
        }
      }
      if (eqns[i + nc * i] !== 0) {
        for (j = i + 1; j < k; j++) {
          const multiplier = eqns[i + nc * j] / eqns[i + nc * i];
          np = kp;
          do {
            p = kp - np;
            eqns[p + nc * j] = p <= i ? 0 : eqns[p + nc * j] - eqns[p + nc * i] * multiplier;
          } while (--np);
        }
      }
    } while (--n);
    i = 2;
    do {
      j = i - 1;
      do {
        const multiplier = eqns[i + nc * j] / eqns[i + nc * i];
        np = nc;
        do {
          p = nc - np;
          eqns[p + nc * j] = eqns[p + nc * j] - eqns[p + nc * i] * multiplier;
        } while (--np);
      } while (j--);
    } while (--i);
    i = 2;
    do {
      const multiplier = 1 / eqns[i + nc * i];
      np = nc;
      do {
        p = nc - np;
        eqns[p + nc * i] = eqns[p + nc * i] * multiplier;
      } while (--np);
    } while (i--);
    i = 2;
    do {
      j = 2;
      do {
        p = eqns[nr + j + nc * i];
        if (isNaN(p) || p === Infinity) {
          throw `Could not reverse! A=[${this.toString()}]`;
        }
        target.e(i, j, p);
      } while (j--);
    } while (i--);
    return target;
  }
  /**
   * Set the matrix from a quaterion
   */
  setRotationFromQuaternion(q2) {
    const x = q2.x;
    const y = q2.y;
    const z = q2.z;
    const w = q2.w;
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;
    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    const e2 = this.elements;
    e2[3 * 0 + 0] = 1 - (yy + zz);
    e2[3 * 0 + 1] = xy - wz;
    e2[3 * 0 + 2] = xz + wy;
    e2[3 * 1 + 0] = xy + wz;
    e2[3 * 1 + 1] = 1 - (xx + zz);
    e2[3 * 1 + 2] = yz - wx;
    e2[3 * 2 + 0] = xz - wy;
    e2[3 * 2 + 1] = yz + wx;
    e2[3 * 2 + 2] = 1 - (xx + yy);
    return this;
  }
  /**
   * Transpose the matrix
   * @param target Optional. Where to store the result.
   * @return The target Mat3, or a new Mat3 if target was omitted.
   */
  transpose(target) {
    if (target === void 0) {
      target = new _Mat3$1();
    }
    const M = this.elements;
    const T = target.elements;
    let tmp;
    T[0] = M[0];
    T[4] = M[4];
    T[8] = M[8];
    tmp = M[1];
    T[1] = M[3];
    T[3] = tmp;
    tmp = M[2];
    T[2] = M[6];
    T[6] = tmp;
    tmp = M[5];
    T[5] = M[7];
    T[7] = tmp;
    return target;
  }
};
var reverse_eqns$1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var Vec3$1 = class _Vec3$1 {
  constructor(x, y, z) {
    if (x === void 0) {
      x = 0;
    }
    if (y === void 0) {
      y = 0;
    }
    if (z === void 0) {
      z = 0;
    }
    this.x = x;
    this.y = y;
    this.z = z;
  }
  /**
   * Vector cross product
   * @param target Optional target to save in.
   */
  cross(vector, target) {
    if (target === void 0) {
      target = new _Vec3$1();
    }
    const vx = vector.x;
    const vy = vector.y;
    const vz = vector.z;
    const x = this.x;
    const y = this.y;
    const z = this.z;
    target.x = y * vz - z * vy;
    target.y = z * vx - x * vz;
    target.z = x * vy - y * vx;
    return target;
  }
  /**
   * Set the vectors' 3 elements
   */
  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  /**
   * Set all components of the vector to zero.
   */
  setZero() {
    this.x = this.y = this.z = 0;
  }
  /**
   * Vector addition
   */
  vadd(vector, target) {
    if (target) {
      target.x = vector.x + this.x;
      target.y = vector.y + this.y;
      target.z = vector.z + this.z;
    } else {
      return new _Vec3$1(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }
  }
  /**
   * Vector subtraction
   * @param target Optional target to save in.
   */
  vsub(vector, target) {
    if (target) {
      target.x = this.x - vector.x;
      target.y = this.y - vector.y;
      target.z = this.z - vector.z;
    } else {
      return new _Vec3$1(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }
  }
  /**
   * Get the cross product matrix a_cross from a vector, such that a x b = a_cross * b = c
   *
   * See {@link https://www8.cs.umu.se/kurser/TDBD24/VT06/lectures/Lecture6.pdf Umeå University Lecture}
   */
  crossmat() {
    return new Mat3$1([0, -this.z, this.y, this.z, 0, -this.x, -this.y, this.x, 0]);
  }
  /**
   * Normalize the vector. Note that this changes the values in the vector.
    * @return Returns the norm of the vector
   */
  normalize() {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const n = Math.sqrt(x * x + y * y + z * z);
    if (n > 0) {
      const invN = 1 / n;
      this.x *= invN;
      this.y *= invN;
      this.z *= invN;
    } else {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    }
    return n;
  }
  /**
   * Get the version of this vector that is of length 1.
   * @param target Optional target to save in
   * @return Returns the unit vector
   */
  unit(target) {
    if (target === void 0) {
      target = new _Vec3$1();
    }
    const x = this.x;
    const y = this.y;
    const z = this.z;
    let ninv = Math.sqrt(x * x + y * y + z * z);
    if (ninv > 0) {
      ninv = 1 / ninv;
      target.x = x * ninv;
      target.y = y * ninv;
      target.z = z * ninv;
    } else {
      target.x = 1;
      target.y = 0;
      target.z = 0;
    }
    return target;
  }
  /**
   * Get the length of the vector
   */
  length() {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    return Math.sqrt(x * x + y * y + z * z);
  }
  /**
   * Get the squared length of the vector.
   */
  lengthSquared() {
    return this.dot(this);
  }
  /**
   * Get distance from this point to another point
   */
  distanceTo(p) {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const px = p.x;
    const py = p.y;
    const pz = p.z;
    return Math.sqrt((px - x) * (px - x) + (py - y) * (py - y) + (pz - z) * (pz - z));
  }
  /**
   * Get squared distance from this point to another point
   */
  distanceSquared(p) {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const px = p.x;
    const py = p.y;
    const pz = p.z;
    return (px - x) * (px - x) + (py - y) * (py - y) + (pz - z) * (pz - z);
  }
  /**
   * Multiply all the components of the vector with a scalar.
   * @param target The vector to save the result in.
   */
  scale(scalar, target) {
    if (target === void 0) {
      target = new _Vec3$1();
    }
    const x = this.x;
    const y = this.y;
    const z = this.z;
    target.x = scalar * x;
    target.y = scalar * y;
    target.z = scalar * z;
    return target;
  }
  /**
   * Multiply the vector with an other vector, component-wise.
   * @param target The vector to save the result in.
   */
  vmul(vector, target) {
    if (target === void 0) {
      target = new _Vec3$1();
    }
    target.x = vector.x * this.x;
    target.y = vector.y * this.y;
    target.z = vector.z * this.z;
    return target;
  }
  /**
   * Scale a vector and add it to this vector. Save the result in "target". (target = this + vector * scalar)
   * @param target The vector to save the result in.
   */
  addScaledVector(scalar, vector, target) {
    if (target === void 0) {
      target = new _Vec3$1();
    }
    target.x = this.x + scalar * vector.x;
    target.y = this.y + scalar * vector.y;
    target.z = this.z + scalar * vector.z;
    return target;
  }
  /**
   * Calculate dot product
   * @param vector
   */
  dot(vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }
  isZero() {
    return this.x === 0 && this.y === 0 && this.z === 0;
  }
  /**
   * Make the vector point in the opposite direction.
   * @param target Optional target to save in
   */
  negate(target) {
    if (target === void 0) {
      target = new _Vec3$1();
    }
    target.x = -this.x;
    target.y = -this.y;
    target.z = -this.z;
    return target;
  }
  /**
   * Compute two artificial tangents to the vector
   * @param t1 Vector object to save the first tangent in
   * @param t2 Vector object to save the second tangent in
   */
  tangents(t1, t2) {
    const norm = this.length();
    if (norm > 0) {
      const n = Vec3_tangents_n$1;
      const inorm = 1 / norm;
      n.set(this.x * inorm, this.y * inorm, this.z * inorm);
      const randVec = Vec3_tangents_randVec$1;
      if (Math.abs(n.x) < 0.9) {
        randVec.set(1, 0, 0);
        n.cross(randVec, t1);
      } else {
        randVec.set(0, 1, 0);
        n.cross(randVec, t1);
      }
      n.cross(t1, t2);
    } else {
      t1.set(1, 0, 0);
      t2.set(0, 1, 0);
    }
  }
  /**
   * Converts to a more readable format
   */
  toString() {
    return `${this.x},${this.y},${this.z}`;
  }
  /**
   * Converts to an array
   */
  toArray() {
    return [this.x, this.y, this.z];
  }
  /**
   * Copies value of source to this vector.
   */
  copy(vector) {
    this.x = vector.x;
    this.y = vector.y;
    this.z = vector.z;
    return this;
  }
  /**
   * Do a linear interpolation between two vectors
   * @param t A number between 0 and 1. 0 will make this function return u, and 1 will make it return v. Numbers in between will generate a vector in between them.
   */
  lerp(vector, t, target) {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    target.x = x + (vector.x - x) * t;
    target.y = y + (vector.y - y) * t;
    target.z = z + (vector.z - z) * t;
  }
  /**
   * Check if a vector equals is almost equal to another one.
   */
  almostEquals(vector, precision) {
    if (precision === void 0) {
      precision = 1e-6;
    }
    if (Math.abs(this.x - vector.x) > precision || Math.abs(this.y - vector.y) > precision || Math.abs(this.z - vector.z) > precision) {
      return false;
    }
    return true;
  }
  /**
   * Check if a vector is almost zero
   */
  almostZero(precision) {
    if (precision === void 0) {
      precision = 1e-6;
    }
    if (Math.abs(this.x) > precision || Math.abs(this.y) > precision || Math.abs(this.z) > precision) {
      return false;
    }
    return true;
  }
  /**
   * Check if the vector is anti-parallel to another vector.
   * @param precision Set to zero for exact comparisons
   */
  isAntiparallelTo(vector, precision) {
    this.negate(antip_neg$1);
    return antip_neg$1.almostEquals(vector, precision);
  }
  /**
   * Clone the vector
   */
  clone() {
    return new _Vec3$1(this.x, this.y, this.z);
  }
};
Vec3$1.ZERO = new Vec3$1(0, 0, 0);
Vec3$1.UNIT_X = new Vec3$1(1, 0, 0);
Vec3$1.UNIT_Y = new Vec3$1(0, 1, 0);
Vec3$1.UNIT_Z = new Vec3$1(0, 0, 1);
var Vec3_tangents_n$1 = new Vec3$1();
var Vec3_tangents_randVec$1 = new Vec3$1();
var antip_neg$1 = new Vec3$1();
var AABB$1 = class _AABB$1 {
  /**
   * The lower bound of the bounding box
   */
  /**
   * The upper bound of the bounding box
   */
  constructor(options) {
    if (options === void 0) {
      options = {};
    }
    this.lowerBound = new Vec3$1();
    this.upperBound = new Vec3$1();
    if (options.lowerBound) {
      this.lowerBound.copy(options.lowerBound);
    }
    if (options.upperBound) {
      this.upperBound.copy(options.upperBound);
    }
  }
  /**
   * Set the AABB bounds from a set of points.
   * @param points An array of Vec3's.
   * @return The self object
   */
  setFromPoints(points, position, quaternion, skinSize) {
    const l = this.lowerBound;
    const u = this.upperBound;
    const q2 = quaternion;
    l.copy(points[0]);
    if (q2) {
      q2.vmult(l, l);
    }
    u.copy(l);
    for (let i = 1; i < points.length; i++) {
      let p = points[i];
      if (q2) {
        q2.vmult(p, tmp$1$1);
        p = tmp$1$1;
      }
      if (p.x > u.x) {
        u.x = p.x;
      }
      if (p.x < l.x) {
        l.x = p.x;
      }
      if (p.y > u.y) {
        u.y = p.y;
      }
      if (p.y < l.y) {
        l.y = p.y;
      }
      if (p.z > u.z) {
        u.z = p.z;
      }
      if (p.z < l.z) {
        l.z = p.z;
      }
    }
    if (position) {
      position.vadd(l, l);
      position.vadd(u, u);
    }
    if (skinSize) {
      l.x -= skinSize;
      l.y -= skinSize;
      l.z -= skinSize;
      u.x += skinSize;
      u.y += skinSize;
      u.z += skinSize;
    }
    return this;
  }
  /**
   * Copy bounds from an AABB to this AABB
   * @param aabb Source to copy from
   * @return The this object, for chainability
   */
  copy(aabb) {
    this.lowerBound.copy(aabb.lowerBound);
    this.upperBound.copy(aabb.upperBound);
    return this;
  }
  /**
   * Clone an AABB
   */
  clone() {
    return new _AABB$1().copy(this);
  }
  /**
   * Extend this AABB so that it covers the given AABB too.
   */
  extend(aabb) {
    this.lowerBound.x = Math.min(this.lowerBound.x, aabb.lowerBound.x);
    this.upperBound.x = Math.max(this.upperBound.x, aabb.upperBound.x);
    this.lowerBound.y = Math.min(this.lowerBound.y, aabb.lowerBound.y);
    this.upperBound.y = Math.max(this.upperBound.y, aabb.upperBound.y);
    this.lowerBound.z = Math.min(this.lowerBound.z, aabb.lowerBound.z);
    this.upperBound.z = Math.max(this.upperBound.z, aabb.upperBound.z);
  }
  /**
   * Returns true if the given AABB overlaps this AABB.
   */
  overlaps(aabb) {
    const l1 = this.lowerBound;
    const u1 = this.upperBound;
    const l2 = aabb.lowerBound;
    const u2 = aabb.upperBound;
    const overlapsX = l2.x <= u1.x && u1.x <= u2.x || l1.x <= u2.x && u2.x <= u1.x;
    const overlapsY = l2.y <= u1.y && u1.y <= u2.y || l1.y <= u2.y && u2.y <= u1.y;
    const overlapsZ = l2.z <= u1.z && u1.z <= u2.z || l1.z <= u2.z && u2.z <= u1.z;
    return overlapsX && overlapsY && overlapsZ;
  }
  // Mostly for debugging
  volume() {
    const l = this.lowerBound;
    const u = this.upperBound;
    return (u.x - l.x) * (u.y - l.y) * (u.z - l.z);
  }
  /**
   * Returns true if the given AABB is fully contained in this AABB.
   */
  contains(aabb) {
    const l1 = this.lowerBound;
    const u1 = this.upperBound;
    const l2 = aabb.lowerBound;
    const u2 = aabb.upperBound;
    return l1.x <= l2.x && u1.x >= u2.x && l1.y <= l2.y && u1.y >= u2.y && l1.z <= l2.z && u1.z >= u2.z;
  }
  getCorners(a2, b2, c2, d, e2, f, g, h) {
    const l = this.lowerBound;
    const u = this.upperBound;
    a2.copy(l);
    b2.set(u.x, l.y, l.z);
    c2.set(u.x, u.y, l.z);
    d.set(l.x, u.y, u.z);
    e2.set(u.x, l.y, u.z);
    f.set(l.x, u.y, l.z);
    g.set(l.x, l.y, u.z);
    h.copy(u);
  }
  /**
   * Get the representation of an AABB in another frame.
   * @return The "target" AABB object.
   */
  toLocalFrame(frame, target) {
    const corners = transformIntoFrame_corners$1;
    const a2 = corners[0];
    const b2 = corners[1];
    const c2 = corners[2];
    const d = corners[3];
    const e2 = corners[4];
    const f = corners[5];
    const g = corners[6];
    const h = corners[7];
    this.getCorners(a2, b2, c2, d, e2, f, g, h);
    for (let i = 0; i !== 8; i++) {
      const corner = corners[i];
      frame.pointToLocal(corner, corner);
    }
    return target.setFromPoints(corners);
  }
  /**
   * Get the representation of an AABB in the global frame.
   * @return The "target" AABB object.
   */
  toWorldFrame(frame, target) {
    const corners = transformIntoFrame_corners$1;
    const a2 = corners[0];
    const b2 = corners[1];
    const c2 = corners[2];
    const d = corners[3];
    const e2 = corners[4];
    const f = corners[5];
    const g = corners[6];
    const h = corners[7];
    this.getCorners(a2, b2, c2, d, e2, f, g, h);
    for (let i = 0; i !== 8; i++) {
      const corner = corners[i];
      frame.pointToWorld(corner, corner);
    }
    return target.setFromPoints(corners);
  }
  /**
   * Check if the AABB is hit by a ray.
   */
  overlapsRay(ray) {
    const {
      direction,
      from
    } = ray;
    const dirFracX = 1 / direction.x;
    const dirFracY = 1 / direction.y;
    const dirFracZ = 1 / direction.z;
    const t1 = (this.lowerBound.x - from.x) * dirFracX;
    const t2 = (this.upperBound.x - from.x) * dirFracX;
    const t3 = (this.lowerBound.y - from.y) * dirFracY;
    const t4 = (this.upperBound.y - from.y) * dirFracY;
    const t5 = (this.lowerBound.z - from.z) * dirFracZ;
    const t6 = (this.upperBound.z - from.z) * dirFracZ;
    const tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
    const tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));
    if (tmax < 0) {
      return false;
    }
    if (tmin > tmax) {
      return false;
    }
    return true;
  }
};
var tmp$1$1 = new Vec3$1();
var transformIntoFrame_corners$1 = [new Vec3$1(), new Vec3$1(), new Vec3$1(), new Vec3$1(), new Vec3$1(), new Vec3$1(), new Vec3$1(), new Vec3$1()];
var EventTarget = class {
  /**
   * Add an event listener
   * @return The self object, for chainability.
   */
  addEventListener(type, listener) {
    if (this._listeners === void 0) {
      this._listeners = {};
    }
    const listeners2 = this._listeners;
    if (listeners2[type] === void 0) {
      listeners2[type] = [];
    }
    if (!listeners2[type].includes(listener)) {
      listeners2[type].push(listener);
    }
    return this;
  }
  /**
   * Check if an event listener is added
   */
  hasEventListener(type, listener) {
    if (this._listeners === void 0) {
      return false;
    }
    const listeners2 = this._listeners;
    if (listeners2[type] !== void 0 && listeners2[type].includes(listener)) {
      return true;
    }
    return false;
  }
  /**
   * Check if any event listener of the given type is added
   */
  hasAnyEventListener(type) {
    if (this._listeners === void 0) {
      return false;
    }
    const listeners2 = this._listeners;
    return listeners2[type] !== void 0;
  }
  /**
   * Remove an event listener
   * @return The self object, for chainability.
   */
  removeEventListener(type, listener) {
    if (this._listeners === void 0) {
      return this;
    }
    const listeners2 = this._listeners;
    if (listeners2[type] === void 0) {
      return this;
    }
    const index = listeners2[type].indexOf(listener);
    if (index !== -1) {
      listeners2[type].splice(index, 1);
    }
    return this;
  }
  /**
   * Emit an event.
   * @return The self object, for chainability.
   */
  dispatchEvent(event) {
    if (this._listeners === void 0) {
      return this;
    }
    const listeners2 = this._listeners;
    const listenerArray = listeners2[event.type];
    if (listenerArray !== void 0) {
      event.target = this;
      for (let i = 0, l = listenerArray.length; i < l; i++) {
        listenerArray[i].call(this, event);
      }
    }
    return this;
  }
};
var Quaternion$1 = class _Quaternion$1 {
  constructor(x, y, z, w) {
    if (x === void 0) {
      x = 0;
    }
    if (y === void 0) {
      y = 0;
    }
    if (z === void 0) {
      z = 0;
    }
    if (w === void 0) {
      w = 1;
    }
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
  /**
   * Set the value of the quaternion.
   */
  set(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }
  /**
   * Convert to a readable format
   * @return "x,y,z,w"
   */
  toString() {
    return `${this.x},${this.y},${this.z},${this.w}`;
  }
  /**
   * Convert to an Array
   * @return [x, y, z, w]
   */
  toArray() {
    return [this.x, this.y, this.z, this.w];
  }
  /**
   * Set the quaternion components given an axis and an angle in radians.
   */
  setFromAxisAngle(vector, angle) {
    const s2 = Math.sin(angle * 0.5);
    this.x = vector.x * s2;
    this.y = vector.y * s2;
    this.z = vector.z * s2;
    this.w = Math.cos(angle * 0.5);
    return this;
  }
  /**
   * Converts the quaternion to [ axis, angle ] representation.
   * @param targetAxis A vector object to reuse for storing the axis.
   * @return An array, first element is the axis and the second is the angle in radians.
   */
  toAxisAngle(targetAxis) {
    if (targetAxis === void 0) {
      targetAxis = new Vec3$1();
    }
    this.normalize();
    const angle = 2 * Math.acos(this.w);
    const s2 = Math.sqrt(1 - this.w * this.w);
    if (s2 < 1e-3) {
      targetAxis.x = this.x;
      targetAxis.y = this.y;
      targetAxis.z = this.z;
    } else {
      targetAxis.x = this.x / s2;
      targetAxis.y = this.y / s2;
      targetAxis.z = this.z / s2;
    }
    return [targetAxis, angle];
  }
  /**
   * Set the quaternion value given two vectors. The resulting rotation will be the needed rotation to rotate u to v.
   */
  setFromVectors(u, v3) {
    if (u.isAntiparallelTo(v3)) {
      const t1 = sfv_t1$1;
      const t2 = sfv_t2$1;
      u.tangents(t1, t2);
      this.setFromAxisAngle(t1, Math.PI);
    } else {
      const a2 = u.cross(v3);
      this.x = a2.x;
      this.y = a2.y;
      this.z = a2.z;
      this.w = Math.sqrt(u.length() ** 2 * v3.length() ** 2) + u.dot(v3);
      this.normalize();
    }
    return this;
  }
  /**
   * Multiply the quaternion with an other quaternion.
   */
  mult(quat, target) {
    if (target === void 0) {
      target = new _Quaternion$1();
    }
    const ax = this.x;
    const ay = this.y;
    const az = this.z;
    const aw = this.w;
    const bx = quat.x;
    const by = quat.y;
    const bz = quat.z;
    const bw = quat.w;
    target.x = ax * bw + aw * bx + ay * bz - az * by;
    target.y = ay * bw + aw * by + az * bx - ax * bz;
    target.z = az * bw + aw * bz + ax * by - ay * bx;
    target.w = aw * bw - ax * bx - ay * by - az * bz;
    return target;
  }
  /**
   * Get the inverse quaternion rotation.
   */
  inverse(target) {
    if (target === void 0) {
      target = new _Quaternion$1();
    }
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const w = this.w;
    this.conjugate(target);
    const inorm2 = 1 / (x * x + y * y + z * z + w * w);
    target.x *= inorm2;
    target.y *= inorm2;
    target.z *= inorm2;
    target.w *= inorm2;
    return target;
  }
  /**
   * Get the quaternion conjugate
   */
  conjugate(target) {
    if (target === void 0) {
      target = new _Quaternion$1();
    }
    target.x = -this.x;
    target.y = -this.y;
    target.z = -this.z;
    target.w = this.w;
    return target;
  }
  /**
   * Normalize the quaternion. Note that this changes the values of the quaternion.
   */
  normalize() {
    let l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    if (l === 0) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = 0;
    } else {
      l = 1 / l;
      this.x *= l;
      this.y *= l;
      this.z *= l;
      this.w *= l;
    }
    return this;
  }
  /**
   * Approximation of quaternion normalization. Works best when quat is already almost-normalized.
   * @author unphased, https://github.com/unphased
   */
  normalizeFast() {
    const f = (3 - (this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)) / 2;
    if (f === 0) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = 0;
    } else {
      this.x *= f;
      this.y *= f;
      this.z *= f;
      this.w *= f;
    }
    return this;
  }
  /**
   * Multiply the quaternion by a vector
   */
  vmult(v3, target) {
    if (target === void 0) {
      target = new Vec3$1();
    }
    const x = v3.x;
    const y = v3.y;
    const z = v3.z;
    const qx = this.x;
    const qy = this.y;
    const qz = this.z;
    const qw = this.w;
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;
    target.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    target.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    target.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return target;
  }
  /**
   * Copies value of source to this quaternion.
   * @return this
   */
  copy(quat) {
    this.x = quat.x;
    this.y = quat.y;
    this.z = quat.z;
    this.w = quat.w;
    return this;
  }
  /**
   * Convert the quaternion to euler angle representation. Order: YZX, as this page describes: https://www.euclideanspace.com/maths/standards/index.htm
   * @param order Three-character string, defaults to "YZX"
   */
  toEuler(target, order) {
    if (order === void 0) {
      order = "YZX";
    }
    let heading;
    let attitude;
    let bank;
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const w = this.w;
    switch (order) {
      case "YZX":
        const test = x * y + z * w;
        if (test > 0.499) {
          heading = 2 * Math.atan2(x, w);
          attitude = Math.PI / 2;
          bank = 0;
        }
        if (test < -0.499) {
          heading = -2 * Math.atan2(x, w);
          attitude = -Math.PI / 2;
          bank = 0;
        }
        if (heading === void 0) {
          const sqx = x * x;
          const sqy = y * y;
          const sqz = z * z;
          heading = Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz);
          attitude = Math.asin(2 * test);
          bank = Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz);
        }
        break;
      default:
        throw new Error(`Euler order ${order} not supported yet.`);
    }
    target.y = heading;
    target.z = attitude;
    target.x = bank;
  }
  /**
   * Set the quaternion components given Euler angle representation.
   *
   * @param order The order to apply angles: 'XYZ' or 'YXZ' or any other combination.
   *
   * See {@link https://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors MathWorks} reference
   */
  setFromEuler(x, y, z, order) {
    if (order === void 0) {
      order = "XYZ";
    }
    const c1 = Math.cos(x / 2);
    const c2 = Math.cos(y / 2);
    const c3 = Math.cos(z / 2);
    const s1 = Math.sin(x / 2);
    const s2 = Math.sin(y / 2);
    const s3 = Math.sin(z / 2);
    if (order === "XYZ") {
      this.x = s1 * c2 * c3 + c1 * s2 * s3;
      this.y = c1 * s2 * c3 - s1 * c2 * s3;
      this.z = c1 * c2 * s3 + s1 * s2 * c3;
      this.w = c1 * c2 * c3 - s1 * s2 * s3;
    } else if (order === "YXZ") {
      this.x = s1 * c2 * c3 + c1 * s2 * s3;
      this.y = c1 * s2 * c3 - s1 * c2 * s3;
      this.z = c1 * c2 * s3 - s1 * s2 * c3;
      this.w = c1 * c2 * c3 + s1 * s2 * s3;
    } else if (order === "ZXY") {
      this.x = s1 * c2 * c3 - c1 * s2 * s3;
      this.y = c1 * s2 * c3 + s1 * c2 * s3;
      this.z = c1 * c2 * s3 + s1 * s2 * c3;
      this.w = c1 * c2 * c3 - s1 * s2 * s3;
    } else if (order === "ZYX") {
      this.x = s1 * c2 * c3 - c1 * s2 * s3;
      this.y = c1 * s2 * c3 + s1 * c2 * s3;
      this.z = c1 * c2 * s3 - s1 * s2 * c3;
      this.w = c1 * c2 * c3 + s1 * s2 * s3;
    } else if (order === "YZX") {
      this.x = s1 * c2 * c3 + c1 * s2 * s3;
      this.y = c1 * s2 * c3 + s1 * c2 * s3;
      this.z = c1 * c2 * s3 - s1 * s2 * c3;
      this.w = c1 * c2 * c3 - s1 * s2 * s3;
    } else if (order === "XZY") {
      this.x = s1 * c2 * c3 - c1 * s2 * s3;
      this.y = c1 * s2 * c3 - s1 * c2 * s3;
      this.z = c1 * c2 * s3 + s1 * s2 * c3;
      this.w = c1 * c2 * c3 + s1 * s2 * s3;
    }
    return this;
  }
  clone() {
    return new _Quaternion$1(this.x, this.y, this.z, this.w);
  }
  /**
   * Performs a spherical linear interpolation between two quat
   *
   * @param toQuat second operand
   * @param t interpolation amount between the self quaternion and toQuat
   * @param target A quaternion to store the result in. If not provided, a new one will be created.
   * @returns {Quaternion} The "target" object
   */
  slerp(toQuat, t, target) {
    if (target === void 0) {
      target = new _Quaternion$1();
    }
    const ax = this.x;
    const ay = this.y;
    const az = this.z;
    const aw = this.w;
    let bx = toQuat.x;
    let by = toQuat.y;
    let bz = toQuat.z;
    let bw = toQuat.w;
    let omega;
    let cosom;
    let sinom;
    let scale0;
    let scale1;
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    if (cosom < 0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    if (1 - cosom > 1e-6) {
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      scale0 = 1 - t;
      scale1 = t;
    }
    target.x = scale0 * ax + scale1 * bx;
    target.y = scale0 * ay + scale1 * by;
    target.z = scale0 * az + scale1 * bz;
    target.w = scale0 * aw + scale1 * bw;
    return target;
  }
  /**
   * Rotate an absolute orientation quaternion given an angular velocity and a time step.
   */
  integrate(angularVelocity, dt, angularFactor, target) {
    if (target === void 0) {
      target = new _Quaternion$1();
    }
    const ax = angularVelocity.x * angularFactor.x, ay = angularVelocity.y * angularFactor.y, az = angularVelocity.z * angularFactor.z, bx = this.x, by = this.y, bz = this.z, bw = this.w;
    const half_dt = dt * 0.5;
    target.x += half_dt * (ax * bw + ay * bz - az * by);
    target.y += half_dt * (ay * bw + az * bx - ax * bz);
    target.z += half_dt * (az * bw + ax * by - ay * bx);
    target.w += half_dt * (-ax * bx - ay * by - az * bz);
    return target;
  }
};
var sfv_t1$1 = new Vec3$1();
var sfv_t2$1 = new Vec3$1();
var SHAPE_TYPES$1 = {
  /** SPHERE */
  SPHERE: 1,
  /** PLANE */
  PLANE: 2,
  /** BOX */
  BOX: 4,
  /** COMPOUND */
  COMPOUND: 8,
  /** CONVEXPOLYHEDRON */
  CONVEXPOLYHEDRON: 16,
  /** HEIGHTFIELD */
  HEIGHTFIELD: 32,
  /** PARTICLE */
  PARTICLE: 64,
  /** CYLINDER */
  CYLINDER: 128,
  /** TRIMESH */
  TRIMESH: 256
};
var Shape$1 = class _Shape$1 {
  /**
   * Identifier of the Shape.
   */
  /**
   * The type of this shape. Must be set to an int > 0 by subclasses.
   */
  /**
   * The local bounding sphere radius of this shape.
   */
  /**
   * Whether to produce contact forces when in contact with other bodies. Note that contacts will be generated, but they will be disabled.
   * @default true
   */
  /**
   * @default 1
   */
  /**
   * @default -1
   */
  /**
   * Optional material of the shape that regulates contact properties.
   */
  /**
   * The body to which the shape is added to.
   */
  /**
   * All the Shape types.
   */
  constructor(options) {
    if (options === void 0) {
      options = {};
    }
    this.id = _Shape$1.idCounter++;
    this.type = options.type || 0;
    this.boundingSphereRadius = 0;
    this.collisionResponse = options.collisionResponse ? options.collisionResponse : true;
    this.collisionFilterGroup = options.collisionFilterGroup !== void 0 ? options.collisionFilterGroup : 1;
    this.collisionFilterMask = options.collisionFilterMask !== void 0 ? options.collisionFilterMask : -1;
    this.material = options.material ? options.material : null;
    this.body = null;
  }
  /**
   * Computes the bounding sphere radius.
   * The result is stored in the property `.boundingSphereRadius`
   */
  updateBoundingSphereRadius() {
    throw `computeBoundingSphereRadius() not implemented for shape type ${this.type}`;
  }
  /**
   * Get the volume of this shape
   */
  volume() {
    throw `volume() not implemented for shape type ${this.type}`;
  }
  /**
   * Calculates the inertia in the local frame for this shape.
   * @see http://en.wikipedia.org/wiki/List_of_moments_of_inertia
   */
  calculateLocalInertia(mass, target) {
    throw `calculateLocalInertia() not implemented for shape type ${this.type}`;
  }
  /**
   * @todo use abstract for these kind of methods
   */
  calculateWorldAABB(pos, quat, min, max) {
    throw `calculateWorldAABB() not implemented for shape type ${this.type}`;
  }
};
Shape$1.idCounter = 0;
Shape$1.types = SHAPE_TYPES$1;
var Transform$1 = class _Transform$1 {
  /**
   * position
   */
  /**
   * quaternion
   */
  constructor(options) {
    if (options === void 0) {
      options = {};
    }
    this.position = new Vec3$1();
    this.quaternion = new Quaternion$1();
    if (options.position) {
      this.position.copy(options.position);
    }
    if (options.quaternion) {
      this.quaternion.copy(options.quaternion);
    }
  }
  /**
   * Get a global point in local transform coordinates.
   */
  pointToLocal(worldPoint, result) {
    return _Transform$1.pointToLocalFrame(this.position, this.quaternion, worldPoint, result);
  }
  /**
   * Get a local point in global transform coordinates.
   */
  pointToWorld(localPoint, result) {
    return _Transform$1.pointToWorldFrame(this.position, this.quaternion, localPoint, result);
  }
  /**
   * vectorToWorldFrame
   */
  vectorToWorldFrame(localVector, result) {
    if (result === void 0) {
      result = new Vec3$1();
    }
    this.quaternion.vmult(localVector, result);
    return result;
  }
  /**
   * pointToLocalFrame
   */
  static pointToLocalFrame(position, quaternion, worldPoint, result) {
    if (result === void 0) {
      result = new Vec3$1();
    }
    worldPoint.vsub(position, result);
    quaternion.conjugate(tmpQuat$1$1);
    tmpQuat$1$1.vmult(result, result);
    return result;
  }
  /**
   * pointToWorldFrame
   */
  static pointToWorldFrame(position, quaternion, localPoint, result) {
    if (result === void 0) {
      result = new Vec3$1();
    }
    quaternion.vmult(localPoint, result);
    result.vadd(position, result);
    return result;
  }
  /**
   * vectorToWorldFrame
   */
  static vectorToWorldFrame(quaternion, localVector, result) {
    if (result === void 0) {
      result = new Vec3$1();
    }
    quaternion.vmult(localVector, result);
    return result;
  }
  /**
   * vectorToLocalFrame
   */
  static vectorToLocalFrame(position, quaternion, worldVector, result) {
    if (result === void 0) {
      result = new Vec3$1();
    }
    quaternion.w *= -1;
    quaternion.vmult(worldVector, result);
    quaternion.w *= -1;
    return result;
  }
};
var tmpQuat$1$1 = new Quaternion$1();
var ConvexPolyhedron = class _ConvexPolyhedron extends Shape$1 {
  /** vertices */
  /**
   * Array of integer arrays, indicating which vertices each face consists of
   */
  /** faceNormals */
  /** worldVertices */
  /** worldVerticesNeedsUpdate */
  /** worldFaceNormals */
  /** worldFaceNormalsNeedsUpdate */
  /**
   * If given, these locally defined, normalized axes are the only ones being checked when doing separating axis check.
   */
  /** uniqueEdges */
  /**
   * @param vertices An array of Vec3's
   * @param faces Array of integer arrays, describing which vertices that is included in each face.
   */
  constructor(props) {
    if (props === void 0) {
      props = {};
    }
    const {
      vertices = [],
      faces = [],
      normals = [],
      axes,
      boundingSphereRadius
    } = props;
    super({
      type: Shape$1.types.CONVEXPOLYHEDRON
    });
    this.vertices = vertices;
    this.faces = faces;
    this.faceNormals = normals;
    if (this.faceNormals.length === 0) {
      this.computeNormals();
    }
    if (!boundingSphereRadius) {
      this.updateBoundingSphereRadius();
    } else {
      this.boundingSphereRadius = boundingSphereRadius;
    }
    this.worldVertices = [];
    this.worldVerticesNeedsUpdate = true;
    this.worldFaceNormals = [];
    this.worldFaceNormalsNeedsUpdate = true;
    this.uniqueAxes = axes ? axes.slice() : null;
    this.uniqueEdges = [];
    this.computeEdges();
  }
  /**
   * Computes uniqueEdges
   */
  computeEdges() {
    const faces = this.faces;
    const vertices = this.vertices;
    const edges = this.uniqueEdges;
    edges.length = 0;
    const edge = new Vec3$1();
    for (let i = 0; i !== faces.length; i++) {
      const face = faces[i];
      const numVertices = face.length;
      for (let j = 0; j !== numVertices; j++) {
        const k = (j + 1) % numVertices;
        vertices[face[j]].vsub(vertices[face[k]], edge);
        edge.normalize();
        let found = false;
        for (let p = 0; p !== edges.length; p++) {
          if (edges[p].almostEquals(edge) || edges[p].almostEquals(edge)) {
            found = true;
            break;
          }
        }
        if (!found) {
          edges.push(edge.clone());
        }
      }
    }
  }
  /**
   * Compute the normals of the faces.
   * Will reuse existing Vec3 objects in the `faceNormals` array if they exist.
   */
  computeNormals() {
    this.faceNormals.length = this.faces.length;
    for (let i = 0; i < this.faces.length; i++) {
      for (let j = 0; j < this.faces[i].length; j++) {
        if (!this.vertices[this.faces[i][j]]) {
          throw new Error(`Vertex ${this.faces[i][j]} not found!`);
        }
      }
      const n = this.faceNormals[i] || new Vec3$1();
      this.getFaceNormal(i, n);
      n.negate(n);
      this.faceNormals[i] = n;
      const vertex = this.vertices[this.faces[i][0]];
      if (n.dot(vertex) < 0) {
        console.error(`.faceNormals[${i}] = Vec3(${n.toString()}) looks like it points into the shape? The vertices follow. Make sure they are ordered CCW around the normal, using the right hand rule.`);
        for (let j = 0; j < this.faces[i].length; j++) {
          console.warn(`.vertices[${this.faces[i][j]}] = Vec3(${this.vertices[this.faces[i][j]].toString()})`);
        }
      }
    }
  }
  /**
   * Compute the normal of a face from its vertices
   */
  getFaceNormal(i, target) {
    const f = this.faces[i];
    const va2 = this.vertices[f[0]];
    const vb2 = this.vertices[f[1]];
    const vc2 = this.vertices[f[2]];
    _ConvexPolyhedron.computeNormal(va2, vb2, vc2, target);
  }
  /**
   * Get face normal given 3 vertices
   */
  static computeNormal(va2, vb2, vc2, target) {
    const cb2 = new Vec3$1();
    const ab2 = new Vec3$1();
    vb2.vsub(va2, ab2);
    vc2.vsub(vb2, cb2);
    cb2.cross(ab2, target);
    if (!target.isZero()) {
      target.normalize();
    }
  }
  /**
   * @param minDist Clamp distance
   * @param result The an array of contact point objects, see clipFaceAgainstHull
   */
  clipAgainstHull(posA, quatA, hullB, posB, quatB, separatingNormal, minDist, maxDist, result) {
    const WorldNormal = new Vec3$1();
    let closestFaceB = -1;
    let dmax = -Number.MAX_VALUE;
    for (let face = 0; face < hullB.faces.length; face++) {
      WorldNormal.copy(hullB.faceNormals[face]);
      quatB.vmult(WorldNormal, WorldNormal);
      const d = WorldNormal.dot(separatingNormal);
      if (d > dmax) {
        dmax = d;
        closestFaceB = face;
      }
    }
    const worldVertsB1 = [];
    for (let i = 0; i < hullB.faces[closestFaceB].length; i++) {
      const b2 = hullB.vertices[hullB.faces[closestFaceB][i]];
      const worldb = new Vec3$1();
      worldb.copy(b2);
      quatB.vmult(worldb, worldb);
      posB.vadd(worldb, worldb);
      worldVertsB1.push(worldb);
    }
    if (closestFaceB >= 0) {
      this.clipFaceAgainstHull(separatingNormal, posA, quatA, worldVertsB1, minDist, maxDist, result);
    }
  }
  /**
   * Find the separating axis between this hull and another
   * @param target The target vector to save the axis in
   * @return Returns false if a separation is found, else true
   */
  findSeparatingAxis(hullB, posA, quatA, posB, quatB, target, faceListA, faceListB) {
    const faceANormalWS3 = new Vec3$1();
    const Worldnormal1 = new Vec3$1();
    const deltaC = new Vec3$1();
    const worldEdge0 = new Vec3$1();
    const worldEdge1 = new Vec3$1();
    const Cross = new Vec3$1();
    let dmin = Number.MAX_VALUE;
    const hullA = this;
    if (!hullA.uniqueAxes) {
      const numFacesA = faceListA ? faceListA.length : hullA.faces.length;
      for (let i = 0; i < numFacesA; i++) {
        const fi = faceListA ? faceListA[i] : i;
        faceANormalWS3.copy(hullA.faceNormals[fi]);
        quatA.vmult(faceANormalWS3, faceANormalWS3);
        const d = hullA.testSepAxis(faceANormalWS3, hullB, posA, quatA, posB, quatB);
        if (d === false) {
          return false;
        }
        if (d < dmin) {
          dmin = d;
          target.copy(faceANormalWS3);
        }
      }
    } else {
      for (let i = 0; i !== hullA.uniqueAxes.length; i++) {
        quatA.vmult(hullA.uniqueAxes[i], faceANormalWS3);
        const d = hullA.testSepAxis(faceANormalWS3, hullB, posA, quatA, posB, quatB);
        if (d === false) {
          return false;
        }
        if (d < dmin) {
          dmin = d;
          target.copy(faceANormalWS3);
        }
      }
    }
    if (!hullB.uniqueAxes) {
      const numFacesB = faceListB ? faceListB.length : hullB.faces.length;
      for (let i = 0; i < numFacesB; i++) {
        const fi = faceListB ? faceListB[i] : i;
        Worldnormal1.copy(hullB.faceNormals[fi]);
        quatB.vmult(Worldnormal1, Worldnormal1);
        const d = hullA.testSepAxis(Worldnormal1, hullB, posA, quatA, posB, quatB);
        if (d === false) {
          return false;
        }
        if (d < dmin) {
          dmin = d;
          target.copy(Worldnormal1);
        }
      }
    } else {
      for (let i = 0; i !== hullB.uniqueAxes.length; i++) {
        quatB.vmult(hullB.uniqueAxes[i], Worldnormal1);
        const d = hullA.testSepAxis(Worldnormal1, hullB, posA, quatA, posB, quatB);
        if (d === false) {
          return false;
        }
        if (d < dmin) {
          dmin = d;
          target.copy(Worldnormal1);
        }
      }
    }
    for (let e0 = 0; e0 !== hullA.uniqueEdges.length; e0++) {
      quatA.vmult(hullA.uniqueEdges[e0], worldEdge0);
      for (let e1 = 0; e1 !== hullB.uniqueEdges.length; e1++) {
        quatB.vmult(hullB.uniqueEdges[e1], worldEdge1);
        worldEdge0.cross(worldEdge1, Cross);
        if (!Cross.almostZero()) {
          Cross.normalize();
          const dist = hullA.testSepAxis(Cross, hullB, posA, quatA, posB, quatB);
          if (dist === false) {
            return false;
          }
          if (dist < dmin) {
            dmin = dist;
            target.copy(Cross);
          }
        }
      }
    }
    posB.vsub(posA, deltaC);
    if (deltaC.dot(target) > 0) {
      target.negate(target);
    }
    return true;
  }
  /**
   * Test separating axis against two hulls. Both hulls are projected onto the axis and the overlap size is returned if there is one.
   * @return The overlap depth, or FALSE if no penetration.
   */
  testSepAxis(axis, hullB, posA, quatA, posB, quatB) {
    const hullA = this;
    _ConvexPolyhedron.project(hullA, axis, posA, quatA, maxminA);
    _ConvexPolyhedron.project(hullB, axis, posB, quatB, maxminB);
    const maxA = maxminA[0];
    const minA = maxminA[1];
    const maxB = maxminB[0];
    const minB = maxminB[1];
    if (maxA < minB || maxB < minA) {
      return false;
    }
    const d0 = maxA - minB;
    const d1 = maxB - minA;
    const depth = d0 < d1 ? d0 : d1;
    return depth;
  }
  /**
   * calculateLocalInertia
   */
  calculateLocalInertia(mass, target) {
    const aabbmax = new Vec3$1();
    const aabbmin = new Vec3$1();
    this.computeLocalAABB(aabbmin, aabbmax);
    const x = aabbmax.x - aabbmin.x;
    const y = aabbmax.y - aabbmin.y;
    const z = aabbmax.z - aabbmin.z;
    target.x = 1 / 12 * mass * (2 * y * 2 * y + 2 * z * 2 * z);
    target.y = 1 / 12 * mass * (2 * x * 2 * x + 2 * z * 2 * z);
    target.z = 1 / 12 * mass * (2 * y * 2 * y + 2 * x * 2 * x);
  }
  /**
   * @param face_i Index of the face
   */
  getPlaneConstantOfFace(face_i) {
    const f = this.faces[face_i];
    const n = this.faceNormals[face_i];
    const v3 = this.vertices[f[0]];
    const c2 = -n.dot(v3);
    return c2;
  }
  /**
   * Clip a face against a hull.
   * @param worldVertsB1 An array of Vec3 with vertices in the world frame.
   * @param minDist Distance clamping
   * @param Array result Array to store resulting contact points in. Will be objects with properties: point, depth, normal. These are represented in world coordinates.
   */
  clipFaceAgainstHull(separatingNormal, posA, quatA, worldVertsB1, minDist, maxDist, result) {
    const faceANormalWS = new Vec3$1();
    const edge0 = new Vec3$1();
    const WorldEdge0 = new Vec3$1();
    const worldPlaneAnormal1 = new Vec3$1();
    const planeNormalWS1 = new Vec3$1();
    const worldA1 = new Vec3$1();
    const localPlaneNormal = new Vec3$1();
    const planeNormalWS = new Vec3$1();
    const hullA = this;
    const worldVertsB2 = [];
    const pVtxIn = worldVertsB1;
    const pVtxOut = worldVertsB2;
    let closestFaceA = -1;
    let dmin = Number.MAX_VALUE;
    for (let face = 0; face < hullA.faces.length; face++) {
      faceANormalWS.copy(hullA.faceNormals[face]);
      quatA.vmult(faceANormalWS, faceANormalWS);
      const d = faceANormalWS.dot(separatingNormal);
      if (d < dmin) {
        dmin = d;
        closestFaceA = face;
      }
    }
    if (closestFaceA < 0) {
      return;
    }
    const polyA = hullA.faces[closestFaceA];
    polyA.connectedFaces = [];
    for (let i = 0; i < hullA.faces.length; i++) {
      for (let j = 0; j < hullA.faces[i].length; j++) {
        if (
          /* Sharing a vertex*/
          polyA.indexOf(hullA.faces[i][j]) !== -1 && /* Not the one we are looking for connections from */
          i !== closestFaceA && /* Not already added */
          polyA.connectedFaces.indexOf(i) === -1
        ) {
          polyA.connectedFaces.push(i);
        }
      }
    }
    const numVerticesA = polyA.length;
    for (let i = 0; i < numVerticesA; i++) {
      const a2 = hullA.vertices[polyA[i]];
      const b2 = hullA.vertices[polyA[(i + 1) % numVerticesA]];
      a2.vsub(b2, edge0);
      WorldEdge0.copy(edge0);
      quatA.vmult(WorldEdge0, WorldEdge0);
      posA.vadd(WorldEdge0, WorldEdge0);
      worldPlaneAnormal1.copy(this.faceNormals[closestFaceA]);
      quatA.vmult(worldPlaneAnormal1, worldPlaneAnormal1);
      posA.vadd(worldPlaneAnormal1, worldPlaneAnormal1);
      WorldEdge0.cross(worldPlaneAnormal1, planeNormalWS1);
      planeNormalWS1.negate(planeNormalWS1);
      worldA1.copy(a2);
      quatA.vmult(worldA1, worldA1);
      posA.vadd(worldA1, worldA1);
      const otherFace = polyA.connectedFaces[i];
      localPlaneNormal.copy(this.faceNormals[otherFace]);
      const localPlaneEq2 = this.getPlaneConstantOfFace(otherFace);
      planeNormalWS.copy(localPlaneNormal);
      quatA.vmult(planeNormalWS, planeNormalWS);
      const planeEqWS2 = localPlaneEq2 - planeNormalWS.dot(posA);
      this.clipFaceAgainstPlane(pVtxIn, pVtxOut, planeNormalWS, planeEqWS2);
      while (pVtxIn.length) {
        pVtxIn.shift();
      }
      while (pVtxOut.length) {
        pVtxIn.push(pVtxOut.shift());
      }
    }
    localPlaneNormal.copy(this.faceNormals[closestFaceA]);
    const localPlaneEq = this.getPlaneConstantOfFace(closestFaceA);
    planeNormalWS.copy(localPlaneNormal);
    quatA.vmult(planeNormalWS, planeNormalWS);
    const planeEqWS = localPlaneEq - planeNormalWS.dot(posA);
    for (let i = 0; i < pVtxIn.length; i++) {
      let depth = planeNormalWS.dot(pVtxIn[i]) + planeEqWS;
      if (depth <= minDist) {
        console.log(`clamped: depth=${depth} to minDist=${minDist}`);
        depth = minDist;
      }
      if (depth <= maxDist) {
        const point = pVtxIn[i];
        if (depth <= 1e-6) {
          const p = {
            point,
            normal: planeNormalWS,
            depth
          };
          result.push(p);
        }
      }
    }
  }
  /**
   * Clip a face in a hull against the back of a plane.
   * @param planeConstant The constant in the mathematical plane equation
   */
  clipFaceAgainstPlane(inVertices, outVertices, planeNormal, planeConstant) {
    let n_dot_first;
    let n_dot_last;
    const numVerts = inVertices.length;
    if (numVerts < 2) {
      return outVertices;
    }
    let firstVertex = inVertices[inVertices.length - 1];
    let lastVertex = inVertices[0];
    n_dot_first = planeNormal.dot(firstVertex) + planeConstant;
    for (let vi = 0; vi < numVerts; vi++) {
      lastVertex = inVertices[vi];
      n_dot_last = planeNormal.dot(lastVertex) + planeConstant;
      if (n_dot_first < 0) {
        if (n_dot_last < 0) {
          const newv = new Vec3$1();
          newv.copy(lastVertex);
          outVertices.push(newv);
        } else {
          const newv = new Vec3$1();
          firstVertex.lerp(lastVertex, n_dot_first / (n_dot_first - n_dot_last), newv);
          outVertices.push(newv);
        }
      } else {
        if (n_dot_last < 0) {
          const newv = new Vec3$1();
          firstVertex.lerp(lastVertex, n_dot_first / (n_dot_first - n_dot_last), newv);
          outVertices.push(newv);
          outVertices.push(lastVertex);
        }
      }
      firstVertex = lastVertex;
      n_dot_first = n_dot_last;
    }
    return outVertices;
  }
  /**
   * Updates `.worldVertices` and sets `.worldVerticesNeedsUpdate` to false.
   */
  computeWorldVertices(position, quat) {
    while (this.worldVertices.length < this.vertices.length) {
      this.worldVertices.push(new Vec3$1());
    }
    const verts = this.vertices;
    const worldVerts = this.worldVertices;
    for (let i = 0; i !== this.vertices.length; i++) {
      quat.vmult(verts[i], worldVerts[i]);
      position.vadd(worldVerts[i], worldVerts[i]);
    }
    this.worldVerticesNeedsUpdate = false;
  }
  computeLocalAABB(aabbmin, aabbmax) {
    const vertices = this.vertices;
    aabbmin.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    aabbmax.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
    for (let i = 0; i < this.vertices.length; i++) {
      const v3 = vertices[i];
      if (v3.x < aabbmin.x) {
        aabbmin.x = v3.x;
      } else if (v3.x > aabbmax.x) {
        aabbmax.x = v3.x;
      }
      if (v3.y < aabbmin.y) {
        aabbmin.y = v3.y;
      } else if (v3.y > aabbmax.y) {
        aabbmax.y = v3.y;
      }
      if (v3.z < aabbmin.z) {
        aabbmin.z = v3.z;
      } else if (v3.z > aabbmax.z) {
        aabbmax.z = v3.z;
      }
    }
  }
  /**
   * Updates `worldVertices` and sets `worldVerticesNeedsUpdate` to false.
   */
  computeWorldFaceNormals(quat) {
    const N = this.faceNormals.length;
    while (this.worldFaceNormals.length < N) {
      this.worldFaceNormals.push(new Vec3$1());
    }
    const normals = this.faceNormals;
    const worldNormals = this.worldFaceNormals;
    for (let i = 0; i !== N; i++) {
      quat.vmult(normals[i], worldNormals[i]);
    }
    this.worldFaceNormalsNeedsUpdate = false;
  }
  /**
   * updateBoundingSphereRadius
   */
  updateBoundingSphereRadius() {
    let max2 = 0;
    const verts = this.vertices;
    for (let i = 0; i !== verts.length; i++) {
      const norm2 = verts[i].lengthSquared();
      if (norm2 > max2) {
        max2 = norm2;
      }
    }
    this.boundingSphereRadius = Math.sqrt(max2);
  }
  /**
   * calculateWorldAABB
   */
  calculateWorldAABB(pos, quat, min, max) {
    const verts = this.vertices;
    let minx;
    let miny;
    let minz;
    let maxx;
    let maxy;
    let maxz;
    let tempWorldVertex = new Vec3$1();
    for (let i = 0; i < verts.length; i++) {
      tempWorldVertex.copy(verts[i]);
      quat.vmult(tempWorldVertex, tempWorldVertex);
      pos.vadd(tempWorldVertex, tempWorldVertex);
      const v3 = tempWorldVertex;
      if (minx === void 0 || v3.x < minx) {
        minx = v3.x;
      }
      if (maxx === void 0 || v3.x > maxx) {
        maxx = v3.x;
      }
      if (miny === void 0 || v3.y < miny) {
        miny = v3.y;
      }
      if (maxy === void 0 || v3.y > maxy) {
        maxy = v3.y;
      }
      if (minz === void 0 || v3.z < minz) {
        minz = v3.z;
      }
      if (maxz === void 0 || v3.z > maxz) {
        maxz = v3.z;
      }
    }
    min.set(minx, miny, minz);
    max.set(maxx, maxy, maxz);
  }
  /**
   * Get approximate convex volume
   */
  volume() {
    return 4 * Math.PI * this.boundingSphereRadius / 3;
  }
  /**
   * Get an average of all the vertices positions
   */
  getAveragePointLocal(target) {
    if (target === void 0) {
      target = new Vec3$1();
    }
    const verts = this.vertices;
    for (let i = 0; i < verts.length; i++) {
      target.vadd(verts[i], target);
    }
    target.scale(1 / verts.length, target);
    return target;
  }
  /**
   * Transform all local points. Will change the .vertices
   */
  transformAllPoints(offset, quat) {
    const n = this.vertices.length;
    const verts = this.vertices;
    if (quat) {
      for (let i = 0; i < n; i++) {
        const v3 = verts[i];
        quat.vmult(v3, v3);
      }
      for (let i = 0; i < this.faceNormals.length; i++) {
        const v3 = this.faceNormals[i];
        quat.vmult(v3, v3);
      }
    }
    if (offset) {
      for (let i = 0; i < n; i++) {
        const v3 = verts[i];
        v3.vadd(offset, v3);
      }
    }
  }
  /**
   * Checks whether p is inside the polyhedra. Must be in local coords.
   * The point lies outside of the convex hull of the other points if and only if the direction
   * of all the vectors from it to those other points are on less than one half of a sphere around it.
   * @param p A point given in local coordinates
   */
  pointIsInside(p) {
    const verts = this.vertices;
    const faces = this.faces;
    const normals = this.faceNormals;
    const positiveResult = null;
    const pointInside = new Vec3$1();
    this.getAveragePointLocal(pointInside);
    for (let i = 0; i < this.faces.length; i++) {
      let n = normals[i];
      const v3 = verts[faces[i][0]];
      const vToP = new Vec3$1();
      p.vsub(v3, vToP);
      const r1 = n.dot(vToP);
      const vToPointInside = new Vec3$1();
      pointInside.vsub(v3, vToPointInside);
      const r2 = n.dot(vToPointInside);
      if (r1 < 0 && r2 > 0 || r1 > 0 && r2 < 0) {
        return false;
      }
    }
    return positiveResult ? 1 : -1;
  }
  /**
   * Get max and min dot product of a convex hull at position (pos,quat) projected onto an axis.
   * Results are saved in the array maxmin.
   * @param result result[0] and result[1] will be set to maximum and minimum, respectively.
   */
  static project(shape, axis, pos, quat, result) {
    const n = shape.vertices.length;
    const localAxis = project_localAxis;
    let max = 0;
    let min = 0;
    const localOrigin = project_localOrigin;
    const vs = shape.vertices;
    localOrigin.setZero();
    Transform$1.vectorToLocalFrame(pos, quat, axis, localAxis);
    Transform$1.pointToLocalFrame(pos, quat, localOrigin, localOrigin);
    const add = localOrigin.dot(localAxis);
    min = max = vs[0].dot(localAxis);
    for (let i = 1; i < n; i++) {
      const val = vs[i].dot(localAxis);
      if (val > max) {
        max = val;
      }
      if (val < min) {
        min = val;
      }
    }
    min -= add;
    max -= add;
    if (min > max) {
      const temp2 = min;
      min = max;
      max = temp2;
    }
    result[0] = max;
    result[1] = min;
  }
};
var maxminA = [];
var maxminB = [];
new Vec3$1();
var project_localAxis = new Vec3$1();
var project_localOrigin = new Vec3$1();
var Box = class _Box extends Shape$1 {
  /**
   * The half extents of the box.
   */
  /**
   * Used by the contact generator to make contacts with other convex polyhedra for example.
   */
  constructor(halfExtents) {
    super({
      type: Shape$1.types.BOX
    });
    this.halfExtents = halfExtents;
    this.convexPolyhedronRepresentation = null;
    this.updateConvexPolyhedronRepresentation();
    this.updateBoundingSphereRadius();
  }
  /**
   * Updates the local convex polyhedron representation used for some collisions.
   */
  updateConvexPolyhedronRepresentation() {
    const sx = this.halfExtents.x;
    const sy = this.halfExtents.y;
    const sz = this.halfExtents.z;
    const V = Vec3$1;
    const vertices = [new V(-sx, -sy, -sz), new V(sx, -sy, -sz), new V(sx, sy, -sz), new V(-sx, sy, -sz), new V(-sx, -sy, sz), new V(sx, -sy, sz), new V(sx, sy, sz), new V(-sx, sy, sz)];
    const faces = [
      [3, 2, 1, 0],
      // -z
      [4, 5, 6, 7],
      // +z
      [5, 4, 0, 1],
      // -y
      [2, 3, 7, 6],
      // +y
      [0, 4, 7, 3],
      // -x
      [1, 2, 6, 5]
      // +x
    ];
    const axes = [new V(0, 0, 1), new V(0, 1, 0), new V(1, 0, 0)];
    const h = new ConvexPolyhedron({
      vertices,
      faces,
      axes
    });
    this.convexPolyhedronRepresentation = h;
    h.material = this.material;
  }
  /**
   * Calculate the inertia of the box.
   */
  calculateLocalInertia(mass, target) {
    if (target === void 0) {
      target = new Vec3$1();
    }
    _Box.calculateInertia(this.halfExtents, mass, target);
    return target;
  }
  static calculateInertia(halfExtents, mass, target) {
    const e2 = halfExtents;
    target.x = 1 / 12 * mass * (2 * e2.y * 2 * e2.y + 2 * e2.z * 2 * e2.z);
    target.y = 1 / 12 * mass * (2 * e2.x * 2 * e2.x + 2 * e2.z * 2 * e2.z);
    target.z = 1 / 12 * mass * (2 * e2.y * 2 * e2.y + 2 * e2.x * 2 * e2.x);
  }
  /**
   * Get the box 6 side normals
   * @param sixTargetVectors An array of 6 vectors, to store the resulting side normals in.
   * @param quat Orientation to apply to the normal vectors. If not provided, the vectors will be in respect to the local frame.
   */
  getSideNormals(sixTargetVectors, quat) {
    const sides = sixTargetVectors;
    const ex = this.halfExtents;
    sides[0].set(ex.x, 0, 0);
    sides[1].set(0, ex.y, 0);
    sides[2].set(0, 0, ex.z);
    sides[3].set(-ex.x, 0, 0);
    sides[4].set(0, -ex.y, 0);
    sides[5].set(0, 0, -ex.z);
    if (quat !== void 0) {
      for (let i = 0; i !== sides.length; i++) {
        quat.vmult(sides[i], sides[i]);
      }
    }
    return sides;
  }
  /**
   * Returns the volume of the box.
   */
  volume() {
    return 8 * this.halfExtents.x * this.halfExtents.y * this.halfExtents.z;
  }
  /**
   * updateBoundingSphereRadius
   */
  updateBoundingSphereRadius() {
    this.boundingSphereRadius = this.halfExtents.length();
  }
  /**
   * forEachWorldCorner
   */
  forEachWorldCorner(pos, quat, callback) {
    const e2 = this.halfExtents;
    const corners = [[e2.x, e2.y, e2.z], [-e2.x, e2.y, e2.z], [-e2.x, -e2.y, e2.z], [-e2.x, -e2.y, -e2.z], [e2.x, -e2.y, -e2.z], [e2.x, e2.y, -e2.z], [-e2.x, e2.y, -e2.z], [e2.x, -e2.y, e2.z]];
    for (let i = 0; i < corners.length; i++) {
      worldCornerTempPos.set(corners[i][0], corners[i][1], corners[i][2]);
      quat.vmult(worldCornerTempPos, worldCornerTempPos);
      pos.vadd(worldCornerTempPos, worldCornerTempPos);
      callback(worldCornerTempPos.x, worldCornerTempPos.y, worldCornerTempPos.z);
    }
  }
  /**
   * calculateWorldAABB
   */
  calculateWorldAABB(pos, quat, min, max) {
    const e2 = this.halfExtents;
    worldCornersTemp[0].set(e2.x, e2.y, e2.z);
    worldCornersTemp[1].set(-e2.x, e2.y, e2.z);
    worldCornersTemp[2].set(-e2.x, -e2.y, e2.z);
    worldCornersTemp[3].set(-e2.x, -e2.y, -e2.z);
    worldCornersTemp[4].set(e2.x, -e2.y, -e2.z);
    worldCornersTemp[5].set(e2.x, e2.y, -e2.z);
    worldCornersTemp[6].set(-e2.x, e2.y, -e2.z);
    worldCornersTemp[7].set(e2.x, -e2.y, e2.z);
    const wc = worldCornersTemp[0];
    quat.vmult(wc, wc);
    pos.vadd(wc, wc);
    max.copy(wc);
    min.copy(wc);
    for (let i = 1; i < 8; i++) {
      const wc2 = worldCornersTemp[i];
      quat.vmult(wc2, wc2);
      pos.vadd(wc2, wc2);
      const x = wc2.x;
      const y = wc2.y;
      const z = wc2.z;
      if (x > max.x) {
        max.x = x;
      }
      if (y > max.y) {
        max.y = y;
      }
      if (z > max.z) {
        max.z = z;
      }
      if (x < min.x) {
        min.x = x;
      }
      if (y < min.y) {
        min.y = y;
      }
      if (z < min.z) {
        min.z = z;
      }
    }
  }
};
var worldCornerTempPos = new Vec3$1();
var worldCornersTemp = [new Vec3$1(), new Vec3$1(), new Vec3$1(), new Vec3$1(), new Vec3$1(), new Vec3$1(), new Vec3$1(), new Vec3$1()];
var BODY_TYPES = {
  /** DYNAMIC */
  DYNAMIC: 1,
  /** STATIC */
  STATIC: 2,
  /** KINEMATIC */
  KINEMATIC: 4
};
var BODY_SLEEP_STATES = {
  /** AWAKE */
  AWAKE: 0,
  /** SLEEPY */
  SLEEPY: 1,
  /** SLEEPING */
  SLEEPING: 2
};
var Body = class _Body extends EventTarget {
  /**
   * Dispatched after two bodies collide. This event is dispatched on each
   * of the two bodies involved in the collision.
   * @event collide
   * @param body The body that was involved in the collision.
   * @param contact The details of the collision.
   */
  /**
   * A dynamic body is fully simulated. Can be moved manually by the user, but normally they move according to forces. A dynamic body can collide with all body types. A dynamic body always has finite, non-zero mass.
   */
  /**
   * A static body does not move during simulation and behaves as if it has infinite mass. Static bodies can be moved manually by setting the position of the body. The velocity of a static body is always zero. Static bodies do not collide with other static or kinematic bodies.
   */
  /**
   * A kinematic body moves under simulation according to its velocity. They do not respond to forces. They can be moved manually, but normally a kinematic body is moved by setting its velocity. A kinematic body behaves as if it has infinite mass. Kinematic bodies do not collide with other static or kinematic bodies.
   */
  /**
   * AWAKE
   */
  /**
   * SLEEPY
   */
  /**
   * SLEEPING
   */
  /**
   * Dispatched after a sleeping body has woken up.
   * @event wakeup
   */
  /**
   * Dispatched after a body has gone in to the sleepy state.
   * @event sleepy
   */
  /**
   * Dispatched after a body has fallen asleep.
   * @event sleep
   */
  constructor(options) {
    if (options === void 0) {
      options = {};
    }
    super();
    this.id = _Body.idCounter++;
    this.index = -1;
    this.world = null;
    this.vlambda = new Vec3$1();
    this.collisionFilterGroup = typeof options.collisionFilterGroup === "number" ? options.collisionFilterGroup : 1;
    this.collisionFilterMask = typeof options.collisionFilterMask === "number" ? options.collisionFilterMask : -1;
    this.collisionResponse = typeof options.collisionResponse === "boolean" ? options.collisionResponse : true;
    this.position = new Vec3$1();
    this.previousPosition = new Vec3$1();
    this.interpolatedPosition = new Vec3$1();
    this.initPosition = new Vec3$1();
    if (options.position) {
      this.position.copy(options.position);
      this.previousPosition.copy(options.position);
      this.interpolatedPosition.copy(options.position);
      this.initPosition.copy(options.position);
    }
    this.velocity = new Vec3$1();
    if (options.velocity) {
      this.velocity.copy(options.velocity);
    }
    this.initVelocity = new Vec3$1();
    this.force = new Vec3$1();
    const mass = typeof options.mass === "number" ? options.mass : 0;
    this.mass = mass;
    this.invMass = mass > 0 ? 1 / mass : 0;
    this.material = options.material || null;
    this.linearDamping = typeof options.linearDamping === "number" ? options.linearDamping : 0.01;
    this.type = mass <= 0 ? _Body.STATIC : _Body.DYNAMIC;
    if (typeof options.type === typeof _Body.STATIC) {
      this.type = options.type;
    }
    this.allowSleep = typeof options.allowSleep !== "undefined" ? options.allowSleep : true;
    this.sleepState = _Body.AWAKE;
    this.sleepSpeedLimit = typeof options.sleepSpeedLimit !== "undefined" ? options.sleepSpeedLimit : 0.1;
    this.sleepTimeLimit = typeof options.sleepTimeLimit !== "undefined" ? options.sleepTimeLimit : 1;
    this.timeLastSleepy = 0;
    this.wakeUpAfterNarrowphase = false;
    this.torque = new Vec3$1();
    this.quaternion = new Quaternion$1();
    this.initQuaternion = new Quaternion$1();
    this.previousQuaternion = new Quaternion$1();
    this.interpolatedQuaternion = new Quaternion$1();
    if (options.quaternion) {
      this.quaternion.copy(options.quaternion);
      this.initQuaternion.copy(options.quaternion);
      this.previousQuaternion.copy(options.quaternion);
      this.interpolatedQuaternion.copy(options.quaternion);
    }
    this.angularVelocity = new Vec3$1();
    if (options.angularVelocity) {
      this.angularVelocity.copy(options.angularVelocity);
    }
    this.initAngularVelocity = new Vec3$1();
    this.shapes = [];
    this.shapeOffsets = [];
    this.shapeOrientations = [];
    this.inertia = new Vec3$1();
    this.invInertia = new Vec3$1();
    this.invInertiaWorld = new Mat3$1();
    this.invMassSolve = 0;
    this.invInertiaSolve = new Vec3$1();
    this.invInertiaWorldSolve = new Mat3$1();
    this.fixedRotation = typeof options.fixedRotation !== "undefined" ? options.fixedRotation : false;
    this.angularDamping = typeof options.angularDamping !== "undefined" ? options.angularDamping : 0.01;
    this.linearFactor = new Vec3$1(1, 1, 1);
    if (options.linearFactor) {
      this.linearFactor.copy(options.linearFactor);
    }
    this.angularFactor = new Vec3$1(1, 1, 1);
    if (options.angularFactor) {
      this.angularFactor.copy(options.angularFactor);
    }
    this.aabb = new AABB$1();
    this.aabbNeedsUpdate = true;
    this.boundingRadius = 0;
    this.wlambda = new Vec3$1();
    this.isTrigger = Boolean(options.isTrigger);
    if (options.shape) {
      this.addShape(options.shape);
    }
    this.updateMassProperties();
  }
  /**
   * Wake the body up.
   */
  wakeUp() {
    const prevState = this.sleepState;
    this.sleepState = _Body.AWAKE;
    this.wakeUpAfterNarrowphase = false;
    if (prevState === _Body.SLEEPING) {
      this.dispatchEvent(_Body.wakeupEvent);
    }
  }
  /**
   * Force body sleep
   */
  sleep() {
    this.sleepState = _Body.SLEEPING;
    this.velocity.set(0, 0, 0);
    this.angularVelocity.set(0, 0, 0);
    this.wakeUpAfterNarrowphase = false;
  }
  /**
   * Called every timestep to update internal sleep timer and change sleep state if needed.
   * @param time The world time in seconds
   */
  sleepTick(time) {
    if (this.allowSleep) {
      const sleepState = this.sleepState;
      const speedSquared = this.velocity.lengthSquared() + this.angularVelocity.lengthSquared();
      const speedLimitSquared = this.sleepSpeedLimit ** 2;
      if (sleepState === _Body.AWAKE && speedSquared < speedLimitSquared) {
        this.sleepState = _Body.SLEEPY;
        this.timeLastSleepy = time;
        this.dispatchEvent(_Body.sleepyEvent);
      } else if (sleepState === _Body.SLEEPY && speedSquared > speedLimitSquared) {
        this.wakeUp();
      } else if (sleepState === _Body.SLEEPY && time - this.timeLastSleepy > this.sleepTimeLimit) {
        this.sleep();
        this.dispatchEvent(_Body.sleepEvent);
      }
    }
  }
  /**
   * If the body is sleeping, it should be immovable / have infinite mass during solve. We solve it by having a separate "solve mass".
   */
  updateSolveMassProperties() {
    if (this.sleepState === _Body.SLEEPING || this.type === _Body.KINEMATIC) {
      this.invMassSolve = 0;
      this.invInertiaSolve.setZero();
      this.invInertiaWorldSolve.setZero();
    } else {
      this.invMassSolve = this.invMass;
      this.invInertiaSolve.copy(this.invInertia);
      this.invInertiaWorldSolve.copy(this.invInertiaWorld);
    }
  }
  /**
   * Convert a world point to local body frame.
   */
  pointToLocalFrame(worldPoint, result) {
    if (result === void 0) {
      result = new Vec3$1();
    }
    worldPoint.vsub(this.position, result);
    this.quaternion.conjugate().vmult(result, result);
    return result;
  }
  /**
   * Convert a world vector to local body frame.
   */
  vectorToLocalFrame(worldVector, result) {
    if (result === void 0) {
      result = new Vec3$1();
    }
    this.quaternion.conjugate().vmult(worldVector, result);
    return result;
  }
  /**
   * Convert a local body point to world frame.
   */
  pointToWorldFrame(localPoint, result) {
    if (result === void 0) {
      result = new Vec3$1();
    }
    this.quaternion.vmult(localPoint, result);
    result.vadd(this.position, result);
    return result;
  }
  /**
   * Convert a local body point to world frame.
   */
  vectorToWorldFrame(localVector, result) {
    if (result === void 0) {
      result = new Vec3$1();
    }
    this.quaternion.vmult(localVector, result);
    return result;
  }
  /**
   * Add a shape to the body with a local offset and orientation.
   * @return The body object, for chainability.
   */
  addShape(shape, _offset, _orientation) {
    const offset = new Vec3$1();
    const orientation = new Quaternion$1();
    if (_offset) {
      offset.copy(_offset);
    }
    if (_orientation) {
      orientation.copy(_orientation);
    }
    this.shapes.push(shape);
    this.shapeOffsets.push(offset);
    this.shapeOrientations.push(orientation);
    this.updateMassProperties();
    this.updateBoundingRadius();
    this.aabbNeedsUpdate = true;
    shape.body = this;
    return this;
  }
  /**
   * Remove a shape from the body.
   * @return The body object, for chainability.
   */
  removeShape(shape) {
    const index = this.shapes.indexOf(shape);
    if (index === -1) {
      console.warn("Shape does not belong to the body");
      return this;
    }
    this.shapes.splice(index, 1);
    this.shapeOffsets.splice(index, 1);
    this.shapeOrientations.splice(index, 1);
    this.updateMassProperties();
    this.updateBoundingRadius();
    this.aabbNeedsUpdate = true;
    shape.body = null;
    return this;
  }
  /**
   * Update the bounding radius of the body. Should be done if any of the shapes are changed.
   */
  updateBoundingRadius() {
    const shapes = this.shapes;
    const shapeOffsets = this.shapeOffsets;
    const N = shapes.length;
    let radius = 0;
    for (let i = 0; i !== N; i++) {
      const shape = shapes[i];
      shape.updateBoundingSphereRadius();
      const offset = shapeOffsets[i].length();
      const r = shape.boundingSphereRadius;
      if (offset + r > radius) {
        radius = offset + r;
      }
    }
    this.boundingRadius = radius;
  }
  /**
   * Updates the .aabb
   */
  updateAABB() {
    const shapes = this.shapes;
    const shapeOffsets = this.shapeOffsets;
    const shapeOrientations = this.shapeOrientations;
    const N = shapes.length;
    const offset = tmpVec;
    const orientation = tmpQuat;
    const bodyQuat = this.quaternion;
    const aabb = this.aabb;
    const shapeAABB = updateAABB_shapeAABB;
    for (let i = 0; i !== N; i++) {
      const shape = shapes[i];
      bodyQuat.vmult(shapeOffsets[i], offset);
      offset.vadd(this.position, offset);
      bodyQuat.mult(shapeOrientations[i], orientation);
      shape.calculateWorldAABB(offset, orientation, shapeAABB.lowerBound, shapeAABB.upperBound);
      if (i === 0) {
        aabb.copy(shapeAABB);
      } else {
        aabb.extend(shapeAABB);
      }
    }
    this.aabbNeedsUpdate = false;
  }
  /**
   * Update `.inertiaWorld` and `.invInertiaWorld`
   */
  updateInertiaWorld(force) {
    const I = this.invInertia;
    if (I.x === I.y && I.y === I.z && !force)
      ;
    else {
      const m1 = uiw_m1;
      const m2 = uiw_m2;
      m1.setRotationFromQuaternion(this.quaternion);
      m1.transpose(m2);
      m1.scale(I, m1);
      m1.mmult(m2, this.invInertiaWorld);
    }
  }
  /**
   * Apply force to a point of the body. This could for example be a point on the Body surface.
   * Applying force this way will add to Body.force and Body.torque.
   * @param force The amount of force to add.
   * @param relativePoint A point relative to the center of mass to apply the force on.
   */
  applyForce(force, relativePoint) {
    if (relativePoint === void 0) {
      relativePoint = new Vec3$1();
    }
    if (this.type !== _Body.DYNAMIC) {
      return;
    }
    if (this.sleepState === _Body.SLEEPING) {
      this.wakeUp();
    }
    const rotForce = Body_applyForce_rotForce;
    relativePoint.cross(force, rotForce);
    this.force.vadd(force, this.force);
    this.torque.vadd(rotForce, this.torque);
  }
  /**
   * Apply force to a local point in the body.
   * @param force The force vector to apply, defined locally in the body frame.
   * @param localPoint A local point in the body to apply the force on.
   */
  applyLocalForce(localForce, localPoint) {
    if (localPoint === void 0) {
      localPoint = new Vec3$1();
    }
    if (this.type !== _Body.DYNAMIC) {
      return;
    }
    const worldForce = Body_applyLocalForce_worldForce;
    const relativePointWorld = Body_applyLocalForce_relativePointWorld;
    this.vectorToWorldFrame(localForce, worldForce);
    this.vectorToWorldFrame(localPoint, relativePointWorld);
    this.applyForce(worldForce, relativePointWorld);
  }
  /**
   * Apply torque to the body.
   * @param torque The amount of torque to add.
   */
  applyTorque(torque) {
    if (this.type !== _Body.DYNAMIC) {
      return;
    }
    if (this.sleepState === _Body.SLEEPING) {
      this.wakeUp();
    }
    this.torque.vadd(torque, this.torque);
  }
  /**
   * Apply impulse to a point of the body. This could for example be a point on the Body surface.
   * An impulse is a force added to a body during a short period of time (impulse = force * time).
   * Impulses will be added to Body.velocity and Body.angularVelocity.
   * @param impulse The amount of impulse to add.
   * @param relativePoint A point relative to the center of mass to apply the force on.
   */
  applyImpulse(impulse, relativePoint) {
    if (relativePoint === void 0) {
      relativePoint = new Vec3$1();
    }
    if (this.type !== _Body.DYNAMIC) {
      return;
    }
    if (this.sleepState === _Body.SLEEPING) {
      this.wakeUp();
    }
    const r = relativePoint;
    const velo = Body_applyImpulse_velo;
    velo.copy(impulse);
    velo.scale(this.invMass, velo);
    this.velocity.vadd(velo, this.velocity);
    const rotVelo = Body_applyImpulse_rotVelo;
    r.cross(impulse, rotVelo);
    this.invInertiaWorld.vmult(rotVelo, rotVelo);
    this.angularVelocity.vadd(rotVelo, this.angularVelocity);
  }
  /**
   * Apply locally-defined impulse to a local point in the body.
   * @param force The force vector to apply, defined locally in the body frame.
   * @param localPoint A local point in the body to apply the force on.
   */
  applyLocalImpulse(localImpulse, localPoint) {
    if (localPoint === void 0) {
      localPoint = new Vec3$1();
    }
    if (this.type !== _Body.DYNAMIC) {
      return;
    }
    const worldImpulse = Body_applyLocalImpulse_worldImpulse;
    const relativePointWorld = Body_applyLocalImpulse_relativePoint;
    this.vectorToWorldFrame(localImpulse, worldImpulse);
    this.vectorToWorldFrame(localPoint, relativePointWorld);
    this.applyImpulse(worldImpulse, relativePointWorld);
  }
  /**
   * Should be called whenever you change the body shape or mass.
   */
  updateMassProperties() {
    const halfExtents = Body_updateMassProperties_halfExtents;
    this.invMass = this.mass > 0 ? 1 / this.mass : 0;
    const I = this.inertia;
    const fixed = this.fixedRotation;
    this.updateAABB();
    halfExtents.set((this.aabb.upperBound.x - this.aabb.lowerBound.x) / 2, (this.aabb.upperBound.y - this.aabb.lowerBound.y) / 2, (this.aabb.upperBound.z - this.aabb.lowerBound.z) / 2);
    Box.calculateInertia(halfExtents, this.mass, I);
    this.invInertia.set(I.x > 0 && !fixed ? 1 / I.x : 0, I.y > 0 && !fixed ? 1 / I.y : 0, I.z > 0 && !fixed ? 1 / I.z : 0);
    this.updateInertiaWorld(true);
  }
  /**
   * Get world velocity of a point in the body.
   * @param worldPoint
   * @param result
   * @return The result vector.
   */
  getVelocityAtWorldPoint(worldPoint, result) {
    const r = new Vec3$1();
    worldPoint.vsub(this.position, r);
    this.angularVelocity.cross(r, result);
    this.velocity.vadd(result, result);
    return result;
  }
  /**
   * Move the body forward in time.
   * @param dt Time step
   * @param quatNormalize Set to true to normalize the body quaternion
   * @param quatNormalizeFast If the quaternion should be normalized using "fast" quaternion normalization
   */
  integrate(dt, quatNormalize, quatNormalizeFast) {
    this.previousPosition.copy(this.position);
    this.previousQuaternion.copy(this.quaternion);
    if (!(this.type === _Body.DYNAMIC || this.type === _Body.KINEMATIC) || this.sleepState === _Body.SLEEPING) {
      return;
    }
    const velo = this.velocity;
    const angularVelo = this.angularVelocity;
    const pos = this.position;
    const force = this.force;
    const torque = this.torque;
    const quat = this.quaternion;
    const invMass = this.invMass;
    const invInertia = this.invInertiaWorld;
    const linearFactor = this.linearFactor;
    const iMdt = invMass * dt;
    velo.x += force.x * iMdt * linearFactor.x;
    velo.y += force.y * iMdt * linearFactor.y;
    velo.z += force.z * iMdt * linearFactor.z;
    const e2 = invInertia.elements;
    const angularFactor = this.angularFactor;
    const tx = torque.x * angularFactor.x;
    const ty = torque.y * angularFactor.y;
    const tz = torque.z * angularFactor.z;
    angularVelo.x += dt * (e2[0] * tx + e2[1] * ty + e2[2] * tz);
    angularVelo.y += dt * (e2[3] * tx + e2[4] * ty + e2[5] * tz);
    angularVelo.z += dt * (e2[6] * tx + e2[7] * ty + e2[8] * tz);
    pos.x += velo.x * dt;
    pos.y += velo.y * dt;
    pos.z += velo.z * dt;
    quat.integrate(this.angularVelocity, dt, this.angularFactor, quat);
    if (quatNormalize) {
      if (quatNormalizeFast) {
        quat.normalizeFast();
      } else {
        quat.normalize();
      }
    }
    this.aabbNeedsUpdate = true;
    this.updateInertiaWorld();
  }
};
Body.idCounter = 0;
Body.COLLIDE_EVENT_NAME = "collide";
Body.DYNAMIC = BODY_TYPES.DYNAMIC;
Body.STATIC = BODY_TYPES.STATIC;
Body.KINEMATIC = BODY_TYPES.KINEMATIC;
Body.AWAKE = BODY_SLEEP_STATES.AWAKE;
Body.SLEEPY = BODY_SLEEP_STATES.SLEEPY;
Body.SLEEPING = BODY_SLEEP_STATES.SLEEPING;
Body.wakeupEvent = {
  type: "wakeup"
};
Body.sleepyEvent = {
  type: "sleepy"
};
Body.sleepEvent = {
  type: "sleep"
};
var tmpVec = new Vec3$1();
var tmpQuat = new Quaternion$1();
var updateAABB_shapeAABB = new AABB$1();
var uiw_m1 = new Mat3$1();
var uiw_m2 = new Mat3$1();
new Mat3$1();
var Body_applyForce_rotForce = new Vec3$1();
var Body_applyLocalForce_worldForce = new Vec3$1();
var Body_applyLocalForce_relativePointWorld = new Vec3$1();
var Body_applyImpulse_velo = new Vec3$1();
var Body_applyImpulse_rotVelo = new Vec3$1();
var Body_applyLocalImpulse_worldImpulse = new Vec3$1();
var Body_applyLocalImpulse_relativePoint = new Vec3$1();
var Body_updateMassProperties_halfExtents = new Vec3$1();
new Vec3$1();
new Vec3$1();
new Quaternion$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
var RaycastResult$1 = class {
  /**
   * rayFromWorld
   */
  /**
   * rayToWorld
   */
  /**
   * hitNormalWorld
   */
  /**
   * hitPointWorld
   */
  /**
   * hasHit
   */
  /**
   * shape
   */
  /**
   * body
   */
  /**
   * The index of the hit triangle, if the hit shape was a trimesh
   */
  /**
   * Distance to the hit. Will be set to -1 if there was no hit
   */
  /**
   * If the ray should stop traversing the bodies
   */
  constructor() {
    this.rayFromWorld = new Vec3$1();
    this.rayToWorld = new Vec3$1();
    this.hitNormalWorld = new Vec3$1();
    this.hitPointWorld = new Vec3$1();
    this.hasHit = false;
    this.shape = null;
    this.body = null;
    this.hitFaceIndex = -1;
    this.distance = -1;
    this.shouldStop = false;
  }
  /**
   * Reset all result data.
   */
  reset() {
    this.rayFromWorld.setZero();
    this.rayToWorld.setZero();
    this.hitNormalWorld.setZero();
    this.hitPointWorld.setZero();
    this.hasHit = false;
    this.shape = null;
    this.body = null;
    this.hitFaceIndex = -1;
    this.distance = -1;
    this.shouldStop = false;
  }
  /**
   * abort
   */
  abort() {
    this.shouldStop = true;
  }
  /**
   * Set result data.
   */
  set(rayFromWorld, rayToWorld, hitNormalWorld, hitPointWorld, shape, body, distance) {
    this.rayFromWorld.copy(rayFromWorld);
    this.rayToWorld.copy(rayToWorld);
    this.hitNormalWorld.copy(hitNormalWorld);
    this.hitPointWorld.copy(hitPointWorld);
    this.shape = shape;
    this.body = body;
    this.distance = distance;
  }
};
var _Shape$types$SPHERE$1;
var _Shape$types$PLANE$1;
var _Shape$types$BOX$1;
var _Shape$types$CYLINDER$1;
var _Shape$types$CONVEXPO$1;
var _Shape$types$HEIGHTFI$1;
var _Shape$types$TRIMESH$1;
var RAY_MODES$1 = {
  /** CLOSEST */
  CLOSEST: 1,
  /** ANY */
  ANY: 2,
  /** ALL */
  ALL: 4
};
_Shape$types$SPHERE$1 = Shape$1.types.SPHERE;
_Shape$types$PLANE$1 = Shape$1.types.PLANE;
_Shape$types$BOX$1 = Shape$1.types.BOX;
_Shape$types$CYLINDER$1 = Shape$1.types.CYLINDER;
_Shape$types$CONVEXPO$1 = Shape$1.types.CONVEXPOLYHEDRON;
_Shape$types$HEIGHTFI$1 = Shape$1.types.HEIGHTFIELD;
_Shape$types$TRIMESH$1 = Shape$1.types.TRIMESH;
var Ray$1 = class _Ray$1 {
  /**
   * from
   */
  /**
   * to
   */
  /**
   * direction
   */
  /**
   * The precision of the ray. Used when checking parallelity etc.
   * @default 0.0001
   */
  /**
   * Set to `false` if you don't want the Ray to take `collisionResponse` flags into account on bodies and shapes.
   * @default true
   */
  /**
   * If set to `true`, the ray skips any hits with normal.dot(rayDirection) < 0.
   * @default false
   */
  /**
   * collisionFilterMask
   * @default -1
   */
  /**
   * collisionFilterGroup
   * @default -1
   */
  /**
   * The intersection mode. Should be Ray.ANY, Ray.ALL or Ray.CLOSEST.
   * @default RAY.ANY
   */
  /**
   * Current result object.
   */
  /**
   * Will be set to `true` during intersectWorld() if the ray hit anything.
   */
  /**
   * User-provided result callback. Will be used if mode is Ray.ALL.
   */
  /**
   * CLOSEST
   */
  /**
   * ANY
   */
  /**
   * ALL
   */
  get [_Shape$types$SPHERE$1]() {
    return this._intersectSphere;
  }
  get [_Shape$types$PLANE$1]() {
    return this._intersectPlane;
  }
  get [_Shape$types$BOX$1]() {
    return this._intersectBox;
  }
  get [_Shape$types$CYLINDER$1]() {
    return this._intersectConvex;
  }
  get [_Shape$types$CONVEXPO$1]() {
    return this._intersectConvex;
  }
  get [_Shape$types$HEIGHTFI$1]() {
    return this._intersectHeightfield;
  }
  get [_Shape$types$TRIMESH$1]() {
    return this._intersectTrimesh;
  }
  constructor(from, to) {
    if (from === void 0) {
      from = new Vec3$1();
    }
    if (to === void 0) {
      to = new Vec3$1();
    }
    this.from = from.clone();
    this.to = to.clone();
    this.direction = new Vec3$1();
    this.precision = 1e-4;
    this.checkCollisionResponse = true;
    this.skipBackfaces = false;
    this.collisionFilterMask = -1;
    this.collisionFilterGroup = -1;
    this.mode = _Ray$1.ANY;
    this.result = new RaycastResult$1();
    this.hasHit = false;
    this.callback = (result) => {
    };
  }
  /**
   * Do itersection against all bodies in the given World.
   * @return True if the ray hit anything, otherwise false.
   */
  intersectWorld(world, options) {
    this.mode = options.mode || _Ray$1.ANY;
    this.result = options.result || new RaycastResult$1();
    this.skipBackfaces = !!options.skipBackfaces;
    this.collisionFilterMask = typeof options.collisionFilterMask !== "undefined" ? options.collisionFilterMask : -1;
    this.collisionFilterGroup = typeof options.collisionFilterGroup !== "undefined" ? options.collisionFilterGroup : -1;
    this.checkCollisionResponse = typeof options.checkCollisionResponse !== "undefined" ? options.checkCollisionResponse : true;
    if (options.from) {
      this.from.copy(options.from);
    }
    if (options.to) {
      this.to.copy(options.to);
    }
    this.callback = options.callback || (() => {
    });
    this.hasHit = false;
    this.result.reset();
    this.updateDirection();
    this.getAABB(tmpAABB$1$1);
    tmpArray$1.length = 0;
    world.broadphase.aabbQuery(world, tmpAABB$1$1, tmpArray$1);
    this.intersectBodies(tmpArray$1);
    return this.hasHit;
  }
  /**
   * Shoot a ray at a body, get back information about the hit.
   * @deprecated @param result set the result property of the Ray instead.
   */
  intersectBody(body, result) {
    if (result) {
      this.result = result;
      this.updateDirection();
    }
    const checkCollisionResponse = this.checkCollisionResponse;
    if (checkCollisionResponse && !body.collisionResponse) {
      return;
    }
    if ((this.collisionFilterGroup & body.collisionFilterMask) === 0 || (body.collisionFilterGroup & this.collisionFilterMask) === 0) {
      return;
    }
    const xi = intersectBody_xi$1;
    const qi = intersectBody_qi$1;
    for (let i = 0, N = body.shapes.length; i < N; i++) {
      const shape = body.shapes[i];
      if (checkCollisionResponse && !shape.collisionResponse) {
        continue;
      }
      body.quaternion.mult(body.shapeOrientations[i], qi);
      body.quaternion.vmult(body.shapeOffsets[i], xi);
      xi.vadd(body.position, xi);
      this.intersectShape(shape, qi, xi, body);
      if (this.result.shouldStop) {
        break;
      }
    }
  }
  /**
   * Shoot a ray at an array bodies, get back information about the hit.
   * @param bodies An array of Body objects.
   * @deprecated @param result set the result property of the Ray instead.
   *
   */
  intersectBodies(bodies, result) {
    if (result) {
      this.result = result;
      this.updateDirection();
    }
    for (let i = 0, l = bodies.length; !this.result.shouldStop && i < l; i++) {
      this.intersectBody(bodies[i]);
    }
  }
  /**
   * Updates the direction vector.
   */
  updateDirection() {
    this.to.vsub(this.from, this.direction);
    this.direction.normalize();
  }
  intersectShape(shape, quat, position, body) {
    const from = this.from;
    const distance = distanceFromIntersection$1(from, this.direction, position);
    if (distance > shape.boundingSphereRadius) {
      return;
    }
    const intersectMethod = this[shape.type];
    if (intersectMethod) {
      intersectMethod.call(this, shape, quat, position, body, shape);
    }
  }
  _intersectBox(box, quat, position, body, reportedShape) {
    return this._intersectConvex(box.convexPolyhedronRepresentation, quat, position, body, reportedShape);
  }
  _intersectPlane(shape, quat, position, body, reportedShape) {
    const from = this.from;
    const to = this.to;
    const direction = this.direction;
    const worldNormal = new Vec3$1(0, 0, 1);
    quat.vmult(worldNormal, worldNormal);
    const len = new Vec3$1();
    from.vsub(position, len);
    const planeToFrom = len.dot(worldNormal);
    to.vsub(position, len);
    const planeToTo = len.dot(worldNormal);
    if (planeToFrom * planeToTo > 0) {
      return;
    }
    if (from.distanceTo(to) < planeToFrom) {
      return;
    }
    const n_dot_dir = worldNormal.dot(direction);
    if (Math.abs(n_dot_dir) < this.precision) {
      return;
    }
    const planePointToFrom = new Vec3$1();
    const dir_scaled_with_t = new Vec3$1();
    const hitPointWorld = new Vec3$1();
    from.vsub(position, planePointToFrom);
    const t = -worldNormal.dot(planePointToFrom) / n_dot_dir;
    direction.scale(t, dir_scaled_with_t);
    from.vadd(dir_scaled_with_t, hitPointWorld);
    this.reportIntersection(worldNormal, hitPointWorld, reportedShape, body, -1);
  }
  /**
   * Get the world AABB of the ray.
   */
  getAABB(aabb) {
    const {
      lowerBound,
      upperBound
    } = aabb;
    const to = this.to;
    const from = this.from;
    lowerBound.x = Math.min(to.x, from.x);
    lowerBound.y = Math.min(to.y, from.y);
    lowerBound.z = Math.min(to.z, from.z);
    upperBound.x = Math.max(to.x, from.x);
    upperBound.y = Math.max(to.y, from.y);
    upperBound.z = Math.max(to.z, from.z);
  }
  _intersectHeightfield(shape, quat, position, body, reportedShape) {
    shape.data;
    shape.elementSize;
    const localRay = intersectHeightfield_localRay$1;
    localRay.from.copy(this.from);
    localRay.to.copy(this.to);
    Transform$1.pointToLocalFrame(position, quat, localRay.from, localRay.from);
    Transform$1.pointToLocalFrame(position, quat, localRay.to, localRay.to);
    localRay.updateDirection();
    const index = intersectHeightfield_index$1;
    let iMinX;
    let iMinY;
    let iMaxX;
    let iMaxY;
    iMinX = iMinY = 0;
    iMaxX = iMaxY = shape.data.length - 1;
    const aabb = new AABB$1();
    localRay.getAABB(aabb);
    shape.getIndexOfPosition(aabb.lowerBound.x, aabb.lowerBound.y, index, true);
    iMinX = Math.max(iMinX, index[0]);
    iMinY = Math.max(iMinY, index[1]);
    shape.getIndexOfPosition(aabb.upperBound.x, aabb.upperBound.y, index, true);
    iMaxX = Math.min(iMaxX, index[0] + 1);
    iMaxY = Math.min(iMaxY, index[1] + 1);
    for (let i = iMinX; i < iMaxX; i++) {
      for (let j = iMinY; j < iMaxY; j++) {
        if (this.result.shouldStop) {
          return;
        }
        shape.getAabbAtIndex(i, j, aabb);
        if (!aabb.overlapsRay(localRay)) {
          continue;
        }
        shape.getConvexTrianglePillar(i, j, false);
        Transform$1.pointToWorldFrame(position, quat, shape.pillarOffset, worldPillarOffset$1);
        this._intersectConvex(shape.pillarConvex, quat, worldPillarOffset$1, body, reportedShape, intersectConvexOptions$1);
        if (this.result.shouldStop) {
          return;
        }
        shape.getConvexTrianglePillar(i, j, true);
        Transform$1.pointToWorldFrame(position, quat, shape.pillarOffset, worldPillarOffset$1);
        this._intersectConvex(shape.pillarConvex, quat, worldPillarOffset$1, body, reportedShape, intersectConvexOptions$1);
      }
    }
  }
  _intersectSphere(sphere, quat, position, body, reportedShape) {
    const from = this.from;
    const to = this.to;
    const r = sphere.radius;
    const a2 = (to.x - from.x) ** 2 + (to.y - from.y) ** 2 + (to.z - from.z) ** 2;
    const b2 = 2 * ((to.x - from.x) * (from.x - position.x) + (to.y - from.y) * (from.y - position.y) + (to.z - from.z) * (from.z - position.z));
    const c2 = (from.x - position.x) ** 2 + (from.y - position.y) ** 2 + (from.z - position.z) ** 2 - r ** 2;
    const delta = b2 ** 2 - 4 * a2 * c2;
    const intersectionPoint = Ray_intersectSphere_intersectionPoint$1;
    const normal = Ray_intersectSphere_normal$1;
    if (delta < 0) {
      return;
    } else if (delta === 0) {
      from.lerp(to, delta, intersectionPoint);
      intersectionPoint.vsub(position, normal);
      normal.normalize();
      this.reportIntersection(normal, intersectionPoint, reportedShape, body, -1);
    } else {
      const d1 = (-b2 - Math.sqrt(delta)) / (2 * a2);
      const d2 = (-b2 + Math.sqrt(delta)) / (2 * a2);
      if (d1 >= 0 && d1 <= 1) {
        from.lerp(to, d1, intersectionPoint);
        intersectionPoint.vsub(position, normal);
        normal.normalize();
        this.reportIntersection(normal, intersectionPoint, reportedShape, body, -1);
      }
      if (this.result.shouldStop) {
        return;
      }
      if (d2 >= 0 && d2 <= 1) {
        from.lerp(to, d2, intersectionPoint);
        intersectionPoint.vsub(position, normal);
        normal.normalize();
        this.reportIntersection(normal, intersectionPoint, reportedShape, body, -1);
      }
    }
  }
  _intersectConvex(shape, quat, position, body, reportedShape, options) {
    const normal = intersectConvex_normal$1;
    const vector = intersectConvex_vector$1;
    const faceList = options && options.faceList || null;
    const faces = shape.faces;
    const vertices = shape.vertices;
    const normals = shape.faceNormals;
    const direction = this.direction;
    const from = this.from;
    const to = this.to;
    const fromToDistance = from.distanceTo(to);
    const Nfaces = faceList ? faceList.length : faces.length;
    const result = this.result;
    for (let j = 0; !result.shouldStop && j < Nfaces; j++) {
      const fi = faceList ? faceList[j] : j;
      const face = faces[fi];
      const faceNormal = normals[fi];
      const q2 = quat;
      const x = position;
      vector.copy(vertices[face[0]]);
      q2.vmult(vector, vector);
      vector.vadd(x, vector);
      vector.vsub(from, vector);
      q2.vmult(faceNormal, normal);
      const dot = direction.dot(normal);
      if (Math.abs(dot) < this.precision) {
        continue;
      }
      const scalar = normal.dot(vector) / dot;
      if (scalar < 0) {
        continue;
      }
      direction.scale(scalar, intersectPoint$1);
      intersectPoint$1.vadd(from, intersectPoint$1);
      a$1.copy(vertices[face[0]]);
      q2.vmult(a$1, a$1);
      x.vadd(a$1, a$1);
      for (let i = 1; !result.shouldStop && i < face.length - 1; i++) {
        b$1.copy(vertices[face[i]]);
        c$1.copy(vertices[face[i + 1]]);
        q2.vmult(b$1, b$1);
        q2.vmult(c$1, c$1);
        x.vadd(b$1, b$1);
        x.vadd(c$1, c$1);
        const distance = intersectPoint$1.distanceTo(from);
        if (!(_Ray$1.pointInTriangle(intersectPoint$1, a$1, b$1, c$1) || _Ray$1.pointInTriangle(intersectPoint$1, b$1, a$1, c$1)) || distance > fromToDistance) {
          continue;
        }
        this.reportIntersection(normal, intersectPoint$1, reportedShape, body, fi);
      }
    }
  }
  /**
   * @todo Optimize by transforming the world to local space first.
   * @todo Use Octree lookup
   */
  _intersectTrimesh(mesh, quat, position, body, reportedShape, options) {
    const normal = intersectTrimesh_normal$1;
    const triangles = intersectTrimesh_triangles$1;
    const treeTransform = intersectTrimesh_treeTransform$1;
    const vector = intersectConvex_vector$1;
    const localDirection = intersectTrimesh_localDirection$1;
    const localFrom = intersectTrimesh_localFrom$1;
    const localTo = intersectTrimesh_localTo$1;
    const worldIntersectPoint = intersectTrimesh_worldIntersectPoint$1;
    const worldNormal = intersectTrimesh_worldNormal$1;
    const indices = mesh.indices;
    mesh.vertices;
    const from = this.from;
    const to = this.to;
    const direction = this.direction;
    treeTransform.position.copy(position);
    treeTransform.quaternion.copy(quat);
    Transform$1.vectorToLocalFrame(position, quat, direction, localDirection);
    Transform$1.pointToLocalFrame(position, quat, from, localFrom);
    Transform$1.pointToLocalFrame(position, quat, to, localTo);
    localTo.x *= mesh.scale.x;
    localTo.y *= mesh.scale.y;
    localTo.z *= mesh.scale.z;
    localFrom.x *= mesh.scale.x;
    localFrom.y *= mesh.scale.y;
    localFrom.z *= mesh.scale.z;
    localTo.vsub(localFrom, localDirection);
    localDirection.normalize();
    const fromToDistanceSquared = localFrom.distanceSquared(localTo);
    mesh.tree.rayQuery(this, treeTransform, triangles);
    for (let i = 0, N = triangles.length; !this.result.shouldStop && i !== N; i++) {
      const trianglesIndex = triangles[i];
      mesh.getNormal(trianglesIndex, normal);
      mesh.getVertex(indices[trianglesIndex * 3], a$1);
      a$1.vsub(localFrom, vector);
      const dot = localDirection.dot(normal);
      const scalar = normal.dot(vector) / dot;
      if (scalar < 0) {
        continue;
      }
      localDirection.scale(scalar, intersectPoint$1);
      intersectPoint$1.vadd(localFrom, intersectPoint$1);
      mesh.getVertex(indices[trianglesIndex * 3 + 1], b$1);
      mesh.getVertex(indices[trianglesIndex * 3 + 2], c$1);
      const squaredDistance = intersectPoint$1.distanceSquared(localFrom);
      if (!(_Ray$1.pointInTriangle(intersectPoint$1, b$1, a$1, c$1) || _Ray$1.pointInTriangle(intersectPoint$1, a$1, b$1, c$1)) || squaredDistance > fromToDistanceSquared) {
        continue;
      }
      Transform$1.vectorToWorldFrame(quat, normal, worldNormal);
      Transform$1.pointToWorldFrame(position, quat, intersectPoint$1, worldIntersectPoint);
      this.reportIntersection(worldNormal, worldIntersectPoint, reportedShape, body, trianglesIndex);
    }
    triangles.length = 0;
  }
  /**
   * @return True if the intersections should continue
   */
  reportIntersection(normal, hitPointWorld, shape, body, hitFaceIndex) {
    const from = this.from;
    const to = this.to;
    const distance = from.distanceTo(hitPointWorld);
    const result = this.result;
    if (this.skipBackfaces && normal.dot(this.direction) > 0) {
      return;
    }
    result.hitFaceIndex = typeof hitFaceIndex !== "undefined" ? hitFaceIndex : -1;
    switch (this.mode) {
      case _Ray$1.ALL:
        this.hasHit = true;
        result.set(from, to, normal, hitPointWorld, shape, body, distance);
        result.hasHit = true;
        this.callback(result);
        break;
      case _Ray$1.CLOSEST:
        if (distance < result.distance || !result.hasHit) {
          this.hasHit = true;
          result.hasHit = true;
          result.set(from, to, normal, hitPointWorld, shape, body, distance);
        }
        break;
      case _Ray$1.ANY:
        this.hasHit = true;
        result.hasHit = true;
        result.set(from, to, normal, hitPointWorld, shape, body, distance);
        result.shouldStop = true;
        break;
    }
  }
  /**
   * As per "Barycentric Technique" as named
   * {@link https://www.blackpawn.com/texts/pointinpoly/default.html here} but without the division
   */
  static pointInTriangle(p, a2, b2, c2) {
    c2.vsub(a2, v0$1);
    b2.vsub(a2, v1$1);
    p.vsub(a2, v2$1);
    const dot00 = v0$1.dot(v0$1);
    const dot01 = v0$1.dot(v1$1);
    const dot02 = v0$1.dot(v2$1);
    const dot11 = v1$1.dot(v1$1);
    const dot12 = v1$1.dot(v2$1);
    let u;
    let v3;
    return (u = dot11 * dot02 - dot01 * dot12) >= 0 && (v3 = dot00 * dot12 - dot01 * dot02) >= 0 && u + v3 < dot00 * dot11 - dot01 * dot01;
  }
};
Ray$1.CLOSEST = RAY_MODES$1.CLOSEST;
Ray$1.ANY = RAY_MODES$1.ANY;
Ray$1.ALL = RAY_MODES$1.ALL;
var tmpAABB$1$1 = new AABB$1();
var tmpArray$1 = [];
var v1$1 = new Vec3$1();
var v2$1 = new Vec3$1();
var intersectBody_xi$1 = new Vec3$1();
var intersectBody_qi$1 = new Quaternion$1();
var intersectPoint$1 = new Vec3$1();
var a$1 = new Vec3$1();
var b$1 = new Vec3$1();
var c$1 = new Vec3$1();
new Vec3$1();
new RaycastResult$1();
var intersectConvexOptions$1 = {
  faceList: [0]
};
var worldPillarOffset$1 = new Vec3$1();
var intersectHeightfield_localRay$1 = new Ray$1();
var intersectHeightfield_index$1 = [];
var Ray_intersectSphere_intersectionPoint$1 = new Vec3$1();
var Ray_intersectSphere_normal$1 = new Vec3$1();
var intersectConvex_normal$1 = new Vec3$1();
new Vec3$1();
new Vec3$1();
var intersectConvex_vector$1 = new Vec3$1();
var intersectTrimesh_normal$1 = new Vec3$1();
var intersectTrimesh_localDirection$1 = new Vec3$1();
var intersectTrimesh_localFrom$1 = new Vec3$1();
var intersectTrimesh_localTo$1 = new Vec3$1();
var intersectTrimesh_worldNormal$1 = new Vec3$1();
var intersectTrimesh_worldIntersectPoint$1 = new Vec3$1();
new AABB$1();
var intersectTrimesh_triangles$1 = [];
var intersectTrimesh_treeTransform$1 = new Transform$1();
var v0$1 = new Vec3$1();
var intersect$1 = new Vec3$1();
function distanceFromIntersection$1(from, direction, position) {
  position.vsub(from, v0$1);
  const dot = v0$1.dot(direction);
  direction.scale(dot, intersect$1);
  intersect$1.vadd(from, intersect$1);
  const distance = position.distanceTo(intersect$1);
  return distance;
}
var Utils = class {
  /**
   * Extend an options object with default values.
   * @param options The options object. May be falsy: in this case, a new object is created and returned.
   * @param defaults An object containing default values.
   * @return The modified options object.
   */
  static defaults(options, defaults) {
    if (options === void 0) {
      options = {};
    }
    for (let key in defaults) {
      if (!(key in options)) {
        options[key] = defaults[key];
      }
    }
    return options;
  }
};
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
var Material = class _Material {
  /**
   * Material name.
   * If options is a string, name will be set to that string.
   * @todo Deprecate this
   */
  /** Material id. */
  /**
   * Friction for this material.
   * If non-negative, it will be used instead of the friction given by ContactMaterials. If there's no matching ContactMaterial, the value from `defaultContactMaterial` in the World will be used.
   */
  /**
   * Restitution for this material.
   * If non-negative, it will be used instead of the restitution given by ContactMaterials. If there's no matching ContactMaterial, the value from `defaultContactMaterial` in the World will be used.
   */
  constructor(options) {
    if (options === void 0) {
      options = {};
    }
    let name = "";
    if (typeof options === "string") {
      name = options;
      options = {};
    }
    this.name = name;
    this.id = _Material.idCounter++;
    this.friction = typeof options.friction !== "undefined" ? options.friction : -1;
    this.restitution = typeof options.restitution !== "undefined" ? options.restitution : -1;
  }
};
Material.idCounter = 0;
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Ray$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
[new Vec3$1(1, 0, 0), new Vec3$1(0, 1, 0), new Vec3$1(0, 0, 1)];
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
var Sphere = class extends Shape$1 {
  /**
   * The radius of the sphere.
   */
  /**
   *
   * @param radius The radius of the sphere, a non-negative number.
   */
  constructor(radius) {
    super({
      type: Shape$1.types.SPHERE
    });
    this.radius = radius !== void 0 ? radius : 1;
    if (this.radius < 0) {
      throw new Error("The sphere radius cannot be negative.");
    }
    this.updateBoundingSphereRadius();
  }
  /** calculateLocalInertia */
  calculateLocalInertia(mass, target) {
    if (target === void 0) {
      target = new Vec3$1();
    }
    const I = 2 * mass * this.radius * this.radius / 5;
    target.x = I;
    target.y = I;
    target.z = I;
    return target;
  }
  /** volume */
  volume() {
    return 4 * Math.PI * Math.pow(this.radius, 3) / 3;
  }
  updateBoundingSphereRadius() {
    this.boundingSphereRadius = this.radius;
  }
  calculateWorldAABB(pos, quat, min, max) {
    const r = this.radius;
    const axes = ["x", "y", "z"];
    for (let i = 0; i < axes.length; i++) {
      const ax = axes[i];
      min[ax] = pos[ax] - r;
      max[ax] = pos[ax] + r;
    }
  }
};
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
var Cylinder = class extends ConvexPolyhedron {
  /** The radius of the top of the Cylinder. */
  /** The radius of the bottom of the Cylinder. */
  /** The height of the Cylinder. */
  /** The number of segments to build the cylinder out of. */
  /**
   * @param radiusTop The radius of the top of the Cylinder.
   * @param radiusBottom The radius of the bottom of the Cylinder.
   * @param height The height of the Cylinder.
   * @param numSegments The number of segments to build the cylinder out of.
   */
  constructor(radiusTop, radiusBottom, height, numSegments) {
    if (radiusTop === void 0) {
      radiusTop = 1;
    }
    if (radiusBottom === void 0) {
      radiusBottom = 1;
    }
    if (height === void 0) {
      height = 1;
    }
    if (numSegments === void 0) {
      numSegments = 8;
    }
    if (radiusTop < 0) {
      throw new Error("The cylinder radiusTop cannot be negative.");
    }
    if (radiusBottom < 0) {
      throw new Error("The cylinder radiusBottom cannot be negative.");
    }
    const N = numSegments;
    const vertices = [];
    const axes = [];
    const faces = [];
    const bottomface = [];
    const topface = [];
    const cos = Math.cos;
    const sin = Math.sin;
    vertices.push(new Vec3$1(-radiusBottom * sin(0), -height * 0.5, radiusBottom * cos(0)));
    bottomface.push(0);
    vertices.push(new Vec3$1(-radiusTop * sin(0), height * 0.5, radiusTop * cos(0)));
    topface.push(1);
    for (let i = 0; i < N; i++) {
      const theta = 2 * Math.PI / N * (i + 1);
      const thetaN = 2 * Math.PI / N * (i + 0.5);
      if (i < N - 1) {
        vertices.push(new Vec3$1(-radiusBottom * sin(theta), -height * 0.5, radiusBottom * cos(theta)));
        bottomface.push(2 * i + 2);
        vertices.push(new Vec3$1(-radiusTop * sin(theta), height * 0.5, radiusTop * cos(theta)));
        topface.push(2 * i + 3);
        faces.push([2 * i, 2 * i + 1, 2 * i + 3, 2 * i + 2]);
      } else {
        faces.push([2 * i, 2 * i + 1, 1, 0]);
      }
      if (N % 2 === 1 || i < N / 2) {
        axes.push(new Vec3$1(-sin(thetaN), 0, cos(thetaN)));
      }
    }
    faces.push(bottomface);
    axes.push(new Vec3$1(0, 1, 0));
    const temp2 = [];
    for (let i = 0; i < topface.length; i++) {
      temp2.push(topface[topface.length - i - 1]);
    }
    faces.push(temp2);
    super({
      vertices,
      faces,
      axes
    });
    this.type = Shape$1.types.CYLINDER;
    this.radiusTop = radiusTop;
    this.radiusBottom = radiusBottom;
    this.height = height;
    this.numSegments = numSegments;
  }
};
var Particle = class extends Shape$1 {
  constructor() {
    super({
      type: Shape$1.types.PARTICLE
    });
  }
  /**
   * calculateLocalInertia
   */
  calculateLocalInertia(mass, target) {
    if (target === void 0) {
      target = new Vec3$1();
    }
    target.set(0, 0, 0);
    return target;
  }
  volume() {
    return 0;
  }
  updateBoundingSphereRadius() {
    this.boundingSphereRadius = 0;
  }
  calculateWorldAABB(pos, quat, min, max) {
    min.copy(pos);
    max.copy(pos);
  }
};
var Plane = class extends Shape$1 {
  /** worldNormal */
  /** worldNormalNeedsUpdate */
  constructor() {
    super({
      type: Shape$1.types.PLANE
    });
    this.worldNormal = new Vec3$1();
    this.worldNormalNeedsUpdate = true;
    this.boundingSphereRadius = Number.MAX_VALUE;
  }
  /** computeWorldNormal */
  computeWorldNormal(quat) {
    const n = this.worldNormal;
    n.set(0, 0, 1);
    quat.vmult(n, n);
    this.worldNormalNeedsUpdate = false;
  }
  calculateLocalInertia(mass, target) {
    if (target === void 0) {
      target = new Vec3$1();
    }
    return target;
  }
  volume() {
    return (
      // The plane is infinite...
      Number.MAX_VALUE
    );
  }
  calculateWorldAABB(pos, quat, min, max) {
    tempNormal.set(0, 0, 1);
    quat.vmult(tempNormal, tempNormal);
    const maxVal = Number.MAX_VALUE;
    min.set(-maxVal, -maxVal, -maxVal);
    max.set(maxVal, maxVal, maxVal);
    if (tempNormal.x === 1) {
      max.x = pos.x;
    } else if (tempNormal.x === -1) {
      min.x = pos.x;
    }
    if (tempNormal.y === 1) {
      max.y = pos.y;
    } else if (tempNormal.y === -1) {
      min.y = pos.y;
    }
    if (tempNormal.z === 1) {
      max.z = pos.z;
    } else if (tempNormal.z === -1) {
      min.z = pos.z;
    }
  }
  updateBoundingSphereRadius() {
    this.boundingSphereRadius = Number.MAX_VALUE;
  }
};
var tempNormal = new Vec3$1();
var Heightfield = class extends Shape$1 {
  /**
   * An array of numbers, or height values, that are spread out along the x axis.
   */
  /**
   * Max value of the data points in the data array.
   */
  /**
   * Minimum value of the data points in the data array.
   */
  /**
   * World spacing between the data points in X and Y direction.
   * @todo elementSizeX and Y
   * @default 1
   */
  /**
   * @default true
   */
  /**
   * @param data An array of numbers, or height values, that are spread out along the x axis.
   */
  constructor(data, options) {
    if (options === void 0) {
      options = {};
    }
    options = Utils.defaults(options, {
      maxValue: null,
      minValue: null,
      elementSize: 1
    });
    super({
      type: Shape$1.types.HEIGHTFIELD
    });
    this.data = data;
    this.maxValue = options.maxValue;
    this.minValue = options.minValue;
    this.elementSize = options.elementSize;
    if (options.minValue === null) {
      this.updateMinValue();
    }
    if (options.maxValue === null) {
      this.updateMaxValue();
    }
    this.cacheEnabled = true;
    this.pillarConvex = new ConvexPolyhedron();
    this.pillarOffset = new Vec3$1();
    this.updateBoundingSphereRadius();
    this._cachedPillars = {};
  }
  /**
   * Call whenever you change the data array.
   */
  update() {
    this._cachedPillars = {};
  }
  /**
   * Update the `minValue` property
   */
  updateMinValue() {
    const data = this.data;
    let minValue = data[0][0];
    for (let i = 0; i !== data.length; i++) {
      for (let j = 0; j !== data[i].length; j++) {
        const v3 = data[i][j];
        if (v3 < minValue) {
          minValue = v3;
        }
      }
    }
    this.minValue = minValue;
  }
  /**
   * Update the `maxValue` property
   */
  updateMaxValue() {
    const data = this.data;
    let maxValue = data[0][0];
    for (let i = 0; i !== data.length; i++) {
      for (let j = 0; j !== data[i].length; j++) {
        const v3 = data[i][j];
        if (v3 > maxValue) {
          maxValue = v3;
        }
      }
    }
    this.maxValue = maxValue;
  }
  /**
   * Set the height value at an index. Don't forget to update maxValue and minValue after you're done.
   */
  setHeightValueAtIndex(xi, yi, value) {
    const data = this.data;
    data[xi][yi] = value;
    this.clearCachedConvexTrianglePillar(xi, yi, false);
    if (xi > 0) {
      this.clearCachedConvexTrianglePillar(xi - 1, yi, true);
      this.clearCachedConvexTrianglePillar(xi - 1, yi, false);
    }
    if (yi > 0) {
      this.clearCachedConvexTrianglePillar(xi, yi - 1, true);
      this.clearCachedConvexTrianglePillar(xi, yi - 1, false);
    }
    if (yi > 0 && xi > 0) {
      this.clearCachedConvexTrianglePillar(xi - 1, yi - 1, true);
    }
  }
  /**
   * Get max/min in a rectangle in the matrix data
   * @param result An array to store the results in.
   * @return The result array, if it was passed in. Minimum will be at position 0 and max at 1.
   */
  getRectMinMax(iMinX, iMinY, iMaxX, iMaxY, result) {
    if (result === void 0) {
      result = [];
    }
    const data = this.data;
    let max = this.minValue;
    for (let i = iMinX; i <= iMaxX; i++) {
      for (let j = iMinY; j <= iMaxY; j++) {
        const height = data[i][j];
        if (height > max) {
          max = height;
        }
      }
    }
    result[0] = this.minValue;
    result[1] = max;
  }
  /**
   * Get the index of a local position on the heightfield. The indexes indicate the rectangles, so if your terrain is made of N x N height data points, you will have rectangle indexes ranging from 0 to N-1.
   * @param result Two-element array
   * @param clamp If the position should be clamped to the heightfield edge.
   */
  getIndexOfPosition(x, y, result, clamp) {
    const w = this.elementSize;
    const data = this.data;
    let xi = Math.floor(x / w);
    let yi = Math.floor(y / w);
    result[0] = xi;
    result[1] = yi;
    if (clamp) {
      if (xi < 0) {
        xi = 0;
      }
      if (yi < 0) {
        yi = 0;
      }
      if (xi >= data.length - 1) {
        xi = data.length - 1;
      }
      if (yi >= data[0].length - 1) {
        yi = data[0].length - 1;
      }
    }
    if (xi < 0 || yi < 0 || xi >= data.length - 1 || yi >= data[0].length - 1) {
      return false;
    }
    return true;
  }
  getTriangleAt(x, y, edgeClamp, a2, b2, c2) {
    const idx = getHeightAt_idx;
    this.getIndexOfPosition(x, y, idx, edgeClamp);
    let xi = idx[0];
    let yi = idx[1];
    const data = this.data;
    if (edgeClamp) {
      xi = Math.min(data.length - 2, Math.max(0, xi));
      yi = Math.min(data[0].length - 2, Math.max(0, yi));
    }
    const elementSize = this.elementSize;
    const lowerDist2 = (x / elementSize - xi) ** 2 + (y / elementSize - yi) ** 2;
    const upperDist2 = (x / elementSize - (xi + 1)) ** 2 + (y / elementSize - (yi + 1)) ** 2;
    const upper = lowerDist2 > upperDist2;
    this.getTriangle(xi, yi, upper, a2, b2, c2);
    return upper;
  }
  getNormalAt(x, y, edgeClamp, result) {
    const a2 = getNormalAt_a;
    const b2 = getNormalAt_b;
    const c2 = getNormalAt_c;
    const e0 = getNormalAt_e0;
    const e1 = getNormalAt_e1;
    this.getTriangleAt(x, y, edgeClamp, a2, b2, c2);
    b2.vsub(a2, e0);
    c2.vsub(a2, e1);
    e0.cross(e1, result);
    result.normalize();
  }
  /**
   * Get an AABB of a square in the heightfield
   * @param xi
   * @param yi
   * @param result
   */
  getAabbAtIndex(xi, yi, _ref) {
    let {
      lowerBound,
      upperBound
    } = _ref;
    const data = this.data;
    const elementSize = this.elementSize;
    lowerBound.set(xi * elementSize, yi * elementSize, data[xi][yi]);
    upperBound.set((xi + 1) * elementSize, (yi + 1) * elementSize, data[xi + 1][yi + 1]);
  }
  /**
   * Get the height in the heightfield at a given position
   */
  getHeightAt(x, y, edgeClamp) {
    const data = this.data;
    const a2 = getHeightAt_a;
    const b2 = getHeightAt_b;
    const c2 = getHeightAt_c;
    const idx = getHeightAt_idx;
    this.getIndexOfPosition(x, y, idx, edgeClamp);
    let xi = idx[0];
    let yi = idx[1];
    if (edgeClamp) {
      xi = Math.min(data.length - 2, Math.max(0, xi));
      yi = Math.min(data[0].length - 2, Math.max(0, yi));
    }
    const upper = this.getTriangleAt(x, y, edgeClamp, a2, b2, c2);
    barycentricWeights(x, y, a2.x, a2.y, b2.x, b2.y, c2.x, c2.y, getHeightAt_weights);
    const w = getHeightAt_weights;
    if (upper) {
      return data[xi + 1][yi + 1] * w.x + data[xi][yi + 1] * w.y + data[xi + 1][yi] * w.z;
    } else {
      return data[xi][yi] * w.x + data[xi + 1][yi] * w.y + data[xi][yi + 1] * w.z;
    }
  }
  getCacheConvexTrianglePillarKey(xi, yi, getUpperTriangle) {
    return `${xi}_${yi}_${getUpperTriangle ? 1 : 0}`;
  }
  getCachedConvexTrianglePillar(xi, yi, getUpperTriangle) {
    return this._cachedPillars[this.getCacheConvexTrianglePillarKey(xi, yi, getUpperTriangle)];
  }
  setCachedConvexTrianglePillar(xi, yi, getUpperTriangle, convex, offset) {
    this._cachedPillars[this.getCacheConvexTrianglePillarKey(xi, yi, getUpperTriangle)] = {
      convex,
      offset
    };
  }
  clearCachedConvexTrianglePillar(xi, yi, getUpperTriangle) {
    delete this._cachedPillars[this.getCacheConvexTrianglePillarKey(xi, yi, getUpperTriangle)];
  }
  /**
   * Get a triangle from the heightfield
   */
  getTriangle(xi, yi, upper, a2, b2, c2) {
    const data = this.data;
    const elementSize = this.elementSize;
    if (upper) {
      a2.set((xi + 1) * elementSize, (yi + 1) * elementSize, data[xi + 1][yi + 1]);
      b2.set(xi * elementSize, (yi + 1) * elementSize, data[xi][yi + 1]);
      c2.set((xi + 1) * elementSize, yi * elementSize, data[xi + 1][yi]);
    } else {
      a2.set(xi * elementSize, yi * elementSize, data[xi][yi]);
      b2.set((xi + 1) * elementSize, yi * elementSize, data[xi + 1][yi]);
      c2.set(xi * elementSize, (yi + 1) * elementSize, data[xi][yi + 1]);
    }
  }
  /**
   * Get a triangle in the terrain in the form of a triangular convex shape.
   */
  getConvexTrianglePillar(xi, yi, getUpperTriangle) {
    let result = this.pillarConvex;
    let offsetResult = this.pillarOffset;
    if (this.cacheEnabled) {
      const data2 = this.getCachedConvexTrianglePillar(xi, yi, getUpperTriangle);
      if (data2) {
        this.pillarConvex = data2.convex;
        this.pillarOffset = data2.offset;
        return;
      }
      result = new ConvexPolyhedron();
      offsetResult = new Vec3$1();
      this.pillarConvex = result;
      this.pillarOffset = offsetResult;
    }
    const data = this.data;
    const elementSize = this.elementSize;
    const faces = result.faces;
    result.vertices.length = 6;
    for (let i = 0; i < 6; i++) {
      if (!result.vertices[i]) {
        result.vertices[i] = new Vec3$1();
      }
    }
    faces.length = 5;
    for (let i = 0; i < 5; i++) {
      if (!faces[i]) {
        faces[i] = [];
      }
    }
    const verts = result.vertices;
    const h = (Math.min(data[xi][yi], data[xi + 1][yi], data[xi][yi + 1], data[xi + 1][yi + 1]) - this.minValue) / 2 + this.minValue;
    if (!getUpperTriangle) {
      offsetResult.set(
        (xi + 0.25) * elementSize,
        // sort of center of a triangle
        (yi + 0.25) * elementSize,
        h
        // vertical center
      );
      verts[0].set(-0.25 * elementSize, -0.25 * elementSize, data[xi][yi] - h);
      verts[1].set(0.75 * elementSize, -0.25 * elementSize, data[xi + 1][yi] - h);
      verts[2].set(-0.25 * elementSize, 0.75 * elementSize, data[xi][yi + 1] - h);
      verts[3].set(-0.25 * elementSize, -0.25 * elementSize, -Math.abs(h) - 1);
      verts[4].set(0.75 * elementSize, -0.25 * elementSize, -Math.abs(h) - 1);
      verts[5].set(-0.25 * elementSize, 0.75 * elementSize, -Math.abs(h) - 1);
      faces[0][0] = 0;
      faces[0][1] = 1;
      faces[0][2] = 2;
      faces[1][0] = 5;
      faces[1][1] = 4;
      faces[1][2] = 3;
      faces[2][0] = 0;
      faces[2][1] = 2;
      faces[2][2] = 5;
      faces[2][3] = 3;
      faces[3][0] = 1;
      faces[3][1] = 0;
      faces[3][2] = 3;
      faces[3][3] = 4;
      faces[4][0] = 4;
      faces[4][1] = 5;
      faces[4][2] = 2;
      faces[4][3] = 1;
    } else {
      offsetResult.set(
        (xi + 0.75) * elementSize,
        // sort of center of a triangle
        (yi + 0.75) * elementSize,
        h
        // vertical center
      );
      verts[0].set(0.25 * elementSize, 0.25 * elementSize, data[xi + 1][yi + 1] - h);
      verts[1].set(-0.75 * elementSize, 0.25 * elementSize, data[xi][yi + 1] - h);
      verts[2].set(0.25 * elementSize, -0.75 * elementSize, data[xi + 1][yi] - h);
      verts[3].set(0.25 * elementSize, 0.25 * elementSize, -Math.abs(h) - 1);
      verts[4].set(-0.75 * elementSize, 0.25 * elementSize, -Math.abs(h) - 1);
      verts[5].set(0.25 * elementSize, -0.75 * elementSize, -Math.abs(h) - 1);
      faces[0][0] = 0;
      faces[0][1] = 1;
      faces[0][2] = 2;
      faces[1][0] = 5;
      faces[1][1] = 4;
      faces[1][2] = 3;
      faces[2][0] = 2;
      faces[2][1] = 5;
      faces[2][2] = 3;
      faces[2][3] = 0;
      faces[3][0] = 3;
      faces[3][1] = 4;
      faces[3][2] = 1;
      faces[3][3] = 0;
      faces[4][0] = 1;
      faces[4][1] = 4;
      faces[4][2] = 5;
      faces[4][3] = 2;
    }
    result.computeNormals();
    result.computeEdges();
    result.updateBoundingSphereRadius();
    this.setCachedConvexTrianglePillar(xi, yi, getUpperTriangle, result, offsetResult);
  }
  calculateLocalInertia(mass, target) {
    if (target === void 0) {
      target = new Vec3$1();
    }
    target.set(0, 0, 0);
    return target;
  }
  volume() {
    return (
      // The terrain is infinite
      Number.MAX_VALUE
    );
  }
  calculateWorldAABB(pos, quat, min, max) {
    min.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
    max.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
  }
  updateBoundingSphereRadius() {
    const data = this.data;
    const s2 = this.elementSize;
    this.boundingSphereRadius = new Vec3$1(data.length * s2, data[0].length * s2, Math.max(Math.abs(this.maxValue), Math.abs(this.minValue))).length();
  }
  /**
   * Sets the height values from an image. Currently only supported in browser.
   */
  setHeightsFromImage(image, scale) {
    const {
      x,
      z,
      y
    } = scale;
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, image.width, image.height);
    const matrix = this.data;
    matrix.length = 0;
    this.elementSize = Math.abs(x) / imageData.width;
    for (let i = 0; i < imageData.height; i++) {
      const row = [];
      for (let j = 0; j < imageData.width; j++) {
        const a2 = imageData.data[(i * imageData.height + j) * 4];
        const b2 = imageData.data[(i * imageData.height + j) * 4 + 1];
        const c2 = imageData.data[(i * imageData.height + j) * 4 + 2];
        const height = (a2 + b2 + c2) / 4 / 255 * z;
        if (x < 0) {
          row.push(height);
        } else {
          row.unshift(height);
        }
      }
      if (y < 0) {
        matrix.unshift(row);
      } else {
        matrix.push(row);
      }
    }
    this.updateMaxValue();
    this.updateMinValue();
    this.update();
  }
};
var getHeightAt_idx = [];
var getHeightAt_weights = new Vec3$1();
var getHeightAt_a = new Vec3$1();
var getHeightAt_b = new Vec3$1();
var getHeightAt_c = new Vec3$1();
var getNormalAt_a = new Vec3$1();
var getNormalAt_b = new Vec3$1();
var getNormalAt_c = new Vec3$1();
var getNormalAt_e0 = new Vec3$1();
var getNormalAt_e1 = new Vec3$1();
function barycentricWeights(x, y, ax, ay, bx, by, cx, cy, result) {
  result.x = ((by - cy) * (x - cx) + (cx - bx) * (y - cy)) / ((by - cy) * (ax - cx) + (cx - bx) * (ay - cy));
  result.y = ((cy - ay) * (x - cx) + (ax - cx) * (y - cy)) / ((by - cy) * (ax - cx) + (cx - bx) * (ay - cy));
  result.z = 1 - result.x - result.y;
}
var OctreeNode = class _OctreeNode {
  /** The root node */
  /** Boundary of this node */
  /** Contained data at the current node level */
  /** Children to this node */
  constructor(options) {
    if (options === void 0) {
      options = {};
    }
    this.root = options.root || null;
    this.aabb = options.aabb ? options.aabb.clone() : new AABB$1();
    this.data = [];
    this.children = [];
  }
  /**
   * reset
   */
  reset() {
    this.children.length = this.data.length = 0;
  }
  /**
   * Insert data into this node
   * @return True if successful, otherwise false
   */
  insert(aabb, elementData, level) {
    if (level === void 0) {
      level = 0;
    }
    const nodeData = this.data;
    if (!this.aabb.contains(aabb)) {
      return false;
    }
    const children = this.children;
    const maxDepth = this.maxDepth || this.root.maxDepth;
    if (level < maxDepth) {
      let subdivided = false;
      if (!children.length) {
        this.subdivide();
        subdivided = true;
      }
      for (let i = 0; i !== 8; i++) {
        if (children[i].insert(aabb, elementData, level + 1)) {
          return true;
        }
      }
      if (subdivided) {
        children.length = 0;
      }
    }
    nodeData.push(elementData);
    return true;
  }
  /**
   * Create 8 equally sized children nodes and put them in the `children` array.
   */
  subdivide() {
    const aabb = this.aabb;
    const l = aabb.lowerBound;
    const u = aabb.upperBound;
    const children = this.children;
    children.push(new _OctreeNode({
      aabb: new AABB$1({
        lowerBound: new Vec3$1(0, 0, 0)
      })
    }), new _OctreeNode({
      aabb: new AABB$1({
        lowerBound: new Vec3$1(1, 0, 0)
      })
    }), new _OctreeNode({
      aabb: new AABB$1({
        lowerBound: new Vec3$1(1, 1, 0)
      })
    }), new _OctreeNode({
      aabb: new AABB$1({
        lowerBound: new Vec3$1(1, 1, 1)
      })
    }), new _OctreeNode({
      aabb: new AABB$1({
        lowerBound: new Vec3$1(0, 1, 1)
      })
    }), new _OctreeNode({
      aabb: new AABB$1({
        lowerBound: new Vec3$1(0, 0, 1)
      })
    }), new _OctreeNode({
      aabb: new AABB$1({
        lowerBound: new Vec3$1(1, 0, 1)
      })
    }), new _OctreeNode({
      aabb: new AABB$1({
        lowerBound: new Vec3$1(0, 1, 0)
      })
    }));
    u.vsub(l, halfDiagonal);
    halfDiagonal.scale(0.5, halfDiagonal);
    const root = this.root || this;
    for (let i = 0; i !== 8; i++) {
      const child = children[i];
      child.root = root;
      const lowerBound = child.aabb.lowerBound;
      lowerBound.x *= halfDiagonal.x;
      lowerBound.y *= halfDiagonal.y;
      lowerBound.z *= halfDiagonal.z;
      lowerBound.vadd(l, lowerBound);
      lowerBound.vadd(halfDiagonal, child.aabb.upperBound);
    }
  }
  /**
   * Get all data, potentially within an AABB
   * @return The "result" object
   */
  aabbQuery(aabb, result) {
    this.data;
    this.children;
    const queue = [this];
    while (queue.length) {
      const node = queue.pop();
      if (node.aabb.overlaps(aabb)) {
        Array.prototype.push.apply(result, node.data);
      }
      Array.prototype.push.apply(queue, node.children);
    }
    return result;
  }
  /**
   * Get all data, potentially intersected by a ray.
   * @return The "result" object
   */
  rayQuery(ray, treeTransform, result) {
    ray.getAABB(tmpAABB);
    tmpAABB.toLocalFrame(treeTransform, tmpAABB);
    this.aabbQuery(tmpAABB, result);
    return result;
  }
  /**
   * removeEmptyNodes
   */
  removeEmptyNodes() {
    for (let i = this.children.length - 1; i >= 0; i--) {
      this.children[i].removeEmptyNodes();
      if (!this.children[i].children.length && !this.children[i].data.length) {
        this.children.splice(i, 1);
      }
    }
  }
};
var Octree = class extends OctreeNode {
  /**
   * Maximum subdivision depth
   * @default 8
   */
  /**
   * @param aabb The total AABB of the tree
   */
  constructor(aabb, options) {
    if (options === void 0) {
      options = {};
    }
    super({
      root: null,
      aabb
    });
    this.maxDepth = typeof options.maxDepth !== "undefined" ? options.maxDepth : 8;
  }
};
var halfDiagonal = new Vec3$1();
var tmpAABB = new AABB$1();
var Trimesh = class _Trimesh extends Shape$1 {
  /**
   * vertices
   */
  /**
   * Array of integers, indicating which vertices each triangle consists of. The length of this array is thus 3 times the number of triangles.
   */
  /**
   * The normals data.
   */
  /**
   * The local AABB of the mesh.
   */
  /**
   * References to vertex pairs, making up all unique edges in the trimesh.
   */
  /**
   * Local scaling of the mesh. Use .setScale() to set it.
   */
  /**
   * The indexed triangles. Use .updateTree() to update it.
   */
  constructor(vertices, indices) {
    super({
      type: Shape$1.types.TRIMESH
    });
    this.vertices = new Float32Array(vertices);
    this.indices = new Int16Array(indices);
    this.normals = new Float32Array(indices.length);
    this.aabb = new AABB$1();
    this.edges = null;
    this.scale = new Vec3$1(1, 1, 1);
    this.tree = new Octree();
    this.updateEdges();
    this.updateNormals();
    this.updateAABB();
    this.updateBoundingSphereRadius();
    this.updateTree();
  }
  /**
   * updateTree
   */
  updateTree() {
    const tree = this.tree;
    tree.reset();
    tree.aabb.copy(this.aabb);
    const scale = this.scale;
    tree.aabb.lowerBound.x *= 1 / scale.x;
    tree.aabb.lowerBound.y *= 1 / scale.y;
    tree.aabb.lowerBound.z *= 1 / scale.z;
    tree.aabb.upperBound.x *= 1 / scale.x;
    tree.aabb.upperBound.y *= 1 / scale.y;
    tree.aabb.upperBound.z *= 1 / scale.z;
    const triangleAABB = new AABB$1();
    const a2 = new Vec3$1();
    const b2 = new Vec3$1();
    const c2 = new Vec3$1();
    const points = [a2, b2, c2];
    for (let i = 0; i < this.indices.length / 3; i++) {
      const i3 = i * 3;
      this._getUnscaledVertex(this.indices[i3], a2);
      this._getUnscaledVertex(this.indices[i3 + 1], b2);
      this._getUnscaledVertex(this.indices[i3 + 2], c2);
      triangleAABB.setFromPoints(points);
      tree.insert(triangleAABB, i);
    }
    tree.removeEmptyNodes();
  }
  /**
   * Get triangles in a local AABB from the trimesh.
   * @param result An array of integers, referencing the queried triangles.
   */
  getTrianglesInAABB(aabb, result) {
    unscaledAABB.copy(aabb);
    const scale = this.scale;
    const isx = scale.x;
    const isy = scale.y;
    const isz = scale.z;
    const l = unscaledAABB.lowerBound;
    const u = unscaledAABB.upperBound;
    l.x /= isx;
    l.y /= isy;
    l.z /= isz;
    u.x /= isx;
    u.y /= isy;
    u.z /= isz;
    return this.tree.aabbQuery(unscaledAABB, result);
  }
  /**
   * setScale
   */
  setScale(scale) {
    const wasUniform = this.scale.x === this.scale.y && this.scale.y === this.scale.z;
    const isUniform = scale.x === scale.y && scale.y === scale.z;
    if (!(wasUniform && isUniform)) {
      this.updateNormals();
    }
    this.scale.copy(scale);
    this.updateAABB();
    this.updateBoundingSphereRadius();
  }
  /**
   * Compute the normals of the faces. Will save in the `.normals` array.
   */
  updateNormals() {
    const n = computeNormals_n;
    const normals = this.normals;
    for (let i = 0; i < this.indices.length / 3; i++) {
      const i3 = i * 3;
      const a2 = this.indices[i3];
      const b2 = this.indices[i3 + 1];
      const c2 = this.indices[i3 + 2];
      this.getVertex(a2, va);
      this.getVertex(b2, vb);
      this.getVertex(c2, vc);
      _Trimesh.computeNormal(vb, va, vc, n);
      normals[i3] = n.x;
      normals[i3 + 1] = n.y;
      normals[i3 + 2] = n.z;
    }
  }
  /**
   * Update the `.edges` property
   */
  updateEdges() {
    const edges = {};
    const add = (a2, b2) => {
      const key = a2 < b2 ? `${a2}_${b2}` : `${b2}_${a2}`;
      edges[key] = true;
    };
    for (let i = 0; i < this.indices.length / 3; i++) {
      const i3 = i * 3;
      const a2 = this.indices[i3];
      const b2 = this.indices[i3 + 1];
      const c2 = this.indices[i3 + 2];
      add(a2, b2);
      add(b2, c2);
      add(c2, a2);
    }
    const keys = Object.keys(edges);
    this.edges = new Int16Array(keys.length * 2);
    for (let i = 0; i < keys.length; i++) {
      const indices = keys[i].split("_");
      this.edges[2 * i] = parseInt(indices[0], 10);
      this.edges[2 * i + 1] = parseInt(indices[1], 10);
    }
  }
  /**
   * Get an edge vertex
   * @param firstOrSecond 0 or 1, depending on which one of the vertices you need.
   * @param vertexStore Where to store the result
   */
  getEdgeVertex(edgeIndex, firstOrSecond, vertexStore) {
    const vertexIndex = this.edges[edgeIndex * 2 + (firstOrSecond ? 1 : 0)];
    this.getVertex(vertexIndex, vertexStore);
  }
  /**
   * Get a vector along an edge.
   */
  getEdgeVector(edgeIndex, vectorStore) {
    const va2 = getEdgeVector_va;
    const vb2 = getEdgeVector_vb;
    this.getEdgeVertex(edgeIndex, 0, va2);
    this.getEdgeVertex(edgeIndex, 1, vb2);
    vb2.vsub(va2, vectorStore);
  }
  /**
   * Get face normal given 3 vertices
   */
  static computeNormal(va2, vb2, vc2, target) {
    vb2.vsub(va2, ab);
    vc2.vsub(vb2, cb);
    cb.cross(ab, target);
    if (!target.isZero()) {
      target.normalize();
    }
  }
  /**
   * Get vertex i.
   * @return The "out" vector object
   */
  getVertex(i, out) {
    const scale = this.scale;
    this._getUnscaledVertex(i, out);
    out.x *= scale.x;
    out.y *= scale.y;
    out.z *= scale.z;
    return out;
  }
  /**
   * Get raw vertex i
   * @return The "out" vector object
   */
  _getUnscaledVertex(i, out) {
    const i3 = i * 3;
    const vertices = this.vertices;
    return out.set(vertices[i3], vertices[i3 + 1], vertices[i3 + 2]);
  }
  /**
   * Get a vertex from the trimesh,transformed by the given position and quaternion.
   * @return The "out" vector object
   */
  getWorldVertex(i, pos, quat, out) {
    this.getVertex(i, out);
    Transform$1.pointToWorldFrame(pos, quat, out, out);
    return out;
  }
  /**
   * Get the three vertices for triangle i.
   */
  getTriangleVertices(i, a2, b2, c2) {
    const i3 = i * 3;
    this.getVertex(this.indices[i3], a2);
    this.getVertex(this.indices[i3 + 1], b2);
    this.getVertex(this.indices[i3 + 2], c2);
  }
  /**
   * Compute the normal of triangle i.
   * @return The "target" vector object
   */
  getNormal(i, target) {
    const i3 = i * 3;
    return target.set(this.normals[i3], this.normals[i3 + 1], this.normals[i3 + 2]);
  }
  /**
   * @return The "target" vector object
   */
  calculateLocalInertia(mass, target) {
    this.computeLocalAABB(cli_aabb);
    const x = cli_aabb.upperBound.x - cli_aabb.lowerBound.x;
    const y = cli_aabb.upperBound.y - cli_aabb.lowerBound.y;
    const z = cli_aabb.upperBound.z - cli_aabb.lowerBound.z;
    return target.set(1 / 12 * mass * (2 * y * 2 * y + 2 * z * 2 * z), 1 / 12 * mass * (2 * x * 2 * x + 2 * z * 2 * z), 1 / 12 * mass * (2 * y * 2 * y + 2 * x * 2 * x));
  }
  /**
   * Compute the local AABB for the trimesh
   */
  computeLocalAABB(aabb) {
    const l = aabb.lowerBound;
    const u = aabb.upperBound;
    const n = this.vertices.length;
    this.vertices;
    const v3 = computeLocalAABB_worldVert;
    this.getVertex(0, v3);
    l.copy(v3);
    u.copy(v3);
    for (let i = 0; i !== n; i++) {
      this.getVertex(i, v3);
      if (v3.x < l.x) {
        l.x = v3.x;
      } else if (v3.x > u.x) {
        u.x = v3.x;
      }
      if (v3.y < l.y) {
        l.y = v3.y;
      } else if (v3.y > u.y) {
        u.y = v3.y;
      }
      if (v3.z < l.z) {
        l.z = v3.z;
      } else if (v3.z > u.z) {
        u.z = v3.z;
      }
    }
  }
  /**
   * Update the `.aabb` property
   */
  updateAABB() {
    this.computeLocalAABB(this.aabb);
  }
  /**
   * Will update the `.boundingSphereRadius` property
   */
  updateBoundingSphereRadius() {
    let max2 = 0;
    const vertices = this.vertices;
    const v3 = new Vec3$1();
    for (let i = 0, N = vertices.length / 3; i !== N; i++) {
      this.getVertex(i, v3);
      const norm2 = v3.lengthSquared();
      if (norm2 > max2) {
        max2 = norm2;
      }
    }
    this.boundingSphereRadius = Math.sqrt(max2);
  }
  /**
   * calculateWorldAABB
   */
  calculateWorldAABB(pos, quat, min, max) {
    const frame = calculateWorldAABB_frame;
    const result = calculateWorldAABB_aabb;
    frame.position = pos;
    frame.quaternion = quat;
    this.aabb.toWorldFrame(frame, result);
    min.copy(result.lowerBound);
    max.copy(result.upperBound);
  }
  /**
   * Get approximate volume
   */
  volume() {
    return 4 * Math.PI * this.boundingSphereRadius / 3;
  }
  /**
   * Create a Trimesh instance, shaped as a torus.
   */
  static createTorus(radius, tube, radialSegments, tubularSegments, arc) {
    if (radius === void 0) {
      radius = 1;
    }
    if (tube === void 0) {
      tube = 0.5;
    }
    if (radialSegments === void 0) {
      radialSegments = 8;
    }
    if (tubularSegments === void 0) {
      tubularSegments = 6;
    }
    if (arc === void 0) {
      arc = Math.PI * 2;
    }
    const vertices = [];
    const indices = [];
    for (let j = 0; j <= radialSegments; j++) {
      for (let i = 0; i <= tubularSegments; i++) {
        const u = i / tubularSegments * arc;
        const v3 = j / radialSegments * Math.PI * 2;
        const x = (radius + tube * Math.cos(v3)) * Math.cos(u);
        const y = (radius + tube * Math.cos(v3)) * Math.sin(u);
        const z = tube * Math.sin(v3);
        vertices.push(x, y, z);
      }
    }
    for (let j = 1; j <= radialSegments; j++) {
      for (let i = 1; i <= tubularSegments; i++) {
        const a2 = (tubularSegments + 1) * j + i - 1;
        const b2 = (tubularSegments + 1) * (j - 1) + i - 1;
        const c2 = (tubularSegments + 1) * (j - 1) + i;
        const d = (tubularSegments + 1) * j + i;
        indices.push(a2, b2, d);
        indices.push(b2, c2, d);
      }
    }
    return new _Trimesh(vertices, indices);
  }
};
var computeNormals_n = new Vec3$1();
var unscaledAABB = new AABB$1();
var getEdgeVector_va = new Vec3$1();
var getEdgeVector_vb = new Vec3$1();
var cb = new Vec3$1();
var ab = new Vec3$1();
var va = new Vec3$1();
var vb = new Vec3$1();
var vc = new Vec3$1();
var cli_aabb = new AABB$1();
var computeLocalAABB_worldVert = new Vec3$1();
var calculateWorldAABB_frame = new Transform$1();
var calculateWorldAABB_aabb = new AABB$1();
({
  sphereSphere: Shape$1.types.SPHERE,
  spherePlane: Shape$1.types.SPHERE | Shape$1.types.PLANE,
  boxBox: Shape$1.types.BOX | Shape$1.types.BOX,
  sphereBox: Shape$1.types.SPHERE | Shape$1.types.BOX,
  planeBox: Shape$1.types.PLANE | Shape$1.types.BOX,
  convexConvex: Shape$1.types.CONVEXPOLYHEDRON,
  sphereConvex: Shape$1.types.SPHERE | Shape$1.types.CONVEXPOLYHEDRON,
  planeConvex: Shape$1.types.PLANE | Shape$1.types.CONVEXPOLYHEDRON,
  boxConvex: Shape$1.types.BOX | Shape$1.types.CONVEXPOLYHEDRON,
  sphereHeightfield: Shape$1.types.SPHERE | Shape$1.types.HEIGHTFIELD,
  boxHeightfield: Shape$1.types.BOX | Shape$1.types.HEIGHTFIELD,
  convexHeightfield: Shape$1.types.CONVEXPOLYHEDRON | Shape$1.types.HEIGHTFIELD,
  sphereParticle: Shape$1.types.PARTICLE | Shape$1.types.SPHERE,
  planeParticle: Shape$1.types.PLANE | Shape$1.types.PARTICLE,
  boxParticle: Shape$1.types.BOX | Shape$1.types.PARTICLE,
  convexParticle: Shape$1.types.PARTICLE | Shape$1.types.CONVEXPOLYHEDRON,
  cylinderCylinder: Shape$1.types.CYLINDER,
  sphereCylinder: Shape$1.types.SPHERE | Shape$1.types.CYLINDER,
  planeCylinder: Shape$1.types.PLANE | Shape$1.types.CYLINDER,
  boxCylinder: Shape$1.types.BOX | Shape$1.types.CYLINDER,
  convexCylinder: Shape$1.types.CONVEXPOLYHEDRON | Shape$1.types.CYLINDER,
  heightfieldCylinder: Shape$1.types.HEIGHTFIELD | Shape$1.types.CYLINDER,
  particleCylinder: Shape$1.types.PARTICLE | Shape$1.types.CYLINDER,
  sphereTrimesh: Shape$1.types.SPHERE | Shape$1.types.TRIMESH,
  planeTrimesh: Shape$1.types.PLANE | Shape$1.types.TRIMESH
});
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Quaternion$1();
new Quaternion$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new AABB$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
[new Vec3$1(), new Vec3$1(), new Vec3$1(), new Vec3$1(), new Vec3$1(), new Vec3$1()];
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Quaternion$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new Vec3$1();
new AABB$1();
new Ray$1();
var performance$1 = globalThis.performance || {};
if (!performance$1.now) {
  let nowOffset = Date.now();
  if (performance$1.timing && performance$1.timing.navigationStart) {
    nowOffset = performance$1.timing.navigationStart;
  }
  performance$1.now = () => Date.now() - nowOffset;
}
new Vec3$1();
var makeVec3 = (_ref) => {
  let [x, y, z] = _ref;
  return new Vec3$1(x, y, z);
};
var prepareSphere = (args) => Array.isArray(args) ? args : [args];
var prepareConvexPolyhedron = (_ref2) => {
  let [v3, faces, n, a2, boundingSphereRadius] = _ref2;
  return [{
    axes: a2 ? a2.map(makeVec3) : void 0,
    boundingSphereRadius,
    faces,
    normals: n ? n.map(makeVec3) : void 0,
    vertices: v3 ? v3.map(makeVec3) : void 0
  }];
};
function createShape(type, args) {
  switch (type) {
    case "Box":
      return new Box(new Vec3$1(...args.map((v3) => v3 / 2)));
    case "ConvexPolyhedron":
      return new ConvexPolyhedron(...prepareConvexPolyhedron(args));
    case "Cylinder":
      return new Cylinder(...args);
    case "Heightfield":
      return new Heightfield(...args);
    case "Particle":
      return new Particle();
    case "Plane":
      return new Plane();
    case "Sphere":
      return new Sphere(...prepareSphere(args));
    case "Trimesh":
      return new Trimesh(...args);
  }
}
var setQuaternion = (target, _ref3) => {
  let {
    quaternion,
    rotation
  } = _ref3;
  if (quaternion) {
    target.set(...quaternion);
  } else if (rotation) {
    target.setFromEuler(...rotation);
  }
  return target;
};
var propsToBody = (options) => {
  const {
    uuid,
    props,
    type,
    createMaterial = (materialOptions) => new Material(materialOptions)
  } = options;
  const {
    angularFactor = [1, 1, 1],
    angularVelocity = [0, 0, 0],
    args = [],
    collisionResponse,
    linearFactor = [1, 1, 1],
    mass,
    material,
    onCollide,
    position = [0, 0, 0],
    rotation,
    quaternion,
    shapes,
    type: bodyType,
    velocity = [0, 0, 0],
    ...extra
  } = props;
  const body = new Body({
    ...extra,
    mass: bodyType === "Static" ? 0 : mass,
    material: material ? createMaterial(material) : void 0,
    type: bodyType ? Body[bodyType.toUpperCase()] : void 0
  });
  body.uuid = uuid;
  if (collisionResponse !== void 0) {
    body.collisionResponse = collisionResponse;
  }
  if (type === "Compound") {
    shapes.forEach((_ref4) => {
      let {
        type: type2,
        args: args2,
        position: position2,
        rotation: rotation2,
        quaternion: quaternion2,
        material: material2,
        ...extra2
      } = _ref4;
      const shapeBody = body.addShape(createShape(type2, args2), position2 ? new Vec3$1(...position2) : void 0, setQuaternion(new Quaternion$1(0, 0, 0, 1), {
        quaternion: quaternion2,
        rotation: rotation2
      }));
      if (material2)
        shapeBody.material = createMaterial(material2);
      Object.assign(shapeBody, extra2);
    });
  } else {
    body.addShape(createShape(type, args));
  }
  body.position.set(position[0], position[1], position[2]);
  body.velocity.set(velocity[0], velocity[1], velocity[2]);
  body.angularVelocity.set(angularVelocity[0], angularVelocity[1], angularVelocity[2]);
  body.linearFactor.set(linearFactor[0], linearFactor[1], linearFactor[2]);
  body.angularFactor.set(angularFactor[0], angularFactor[1], angularFactor[2]);
  setQuaternion(body.quaternion, {
    quaternion,
    rotation
  });
  return body;
};
var Mat3 = class _Mat3 {
  /**
   * A vector of length 9, containing all matrix elements.
   */
  /**
   * @param elements A vector of length 9, containing all matrix elements.
   */
  constructor(elements) {
    if (elements === void 0) {
      elements = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    this.elements = elements;
  }
  /**
   * Sets the matrix to identity
   * @todo Should perhaps be renamed to `setIdentity()` to be more clear.
   * @todo Create another function that immediately creates an identity matrix eg. `eye()`
   */
  identity() {
    const e2 = this.elements;
    e2[0] = 1;
    e2[1] = 0;
    e2[2] = 0;
    e2[3] = 0;
    e2[4] = 1;
    e2[5] = 0;
    e2[6] = 0;
    e2[7] = 0;
    e2[8] = 1;
  }
  /**
   * Set all elements to zero
   */
  setZero() {
    const e2 = this.elements;
    e2[0] = 0;
    e2[1] = 0;
    e2[2] = 0;
    e2[3] = 0;
    e2[4] = 0;
    e2[5] = 0;
    e2[6] = 0;
    e2[7] = 0;
    e2[8] = 0;
  }
  /**
   * Sets the matrix diagonal elements from a Vec3
   */
  setTrace(vector) {
    const e2 = this.elements;
    e2[0] = vector.x;
    e2[4] = vector.y;
    e2[8] = vector.z;
  }
  /**
   * Gets the matrix diagonal elements
   */
  getTrace(target) {
    if (target === void 0) {
      target = new Vec3();
    }
    const e2 = this.elements;
    target.x = e2[0];
    target.y = e2[4];
    target.z = e2[8];
    return target;
  }
  /**
   * Matrix-Vector multiplication
   * @param v The vector to multiply with
   * @param target Optional, target to save the result in.
   */
  vmult(v3, target) {
    if (target === void 0) {
      target = new Vec3();
    }
    const e2 = this.elements;
    const x = v3.x;
    const y = v3.y;
    const z = v3.z;
    target.x = e2[0] * x + e2[1] * y + e2[2] * z;
    target.y = e2[3] * x + e2[4] * y + e2[5] * z;
    target.z = e2[6] * x + e2[7] * y + e2[8] * z;
    return target;
  }
  /**
   * Matrix-scalar multiplication
   */
  smult(s2) {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i] *= s2;
    }
  }
  /**
   * Matrix multiplication
   * @param matrix Matrix to multiply with from left side.
   */
  mmult(matrix, target) {
    if (target === void 0) {
      target = new _Mat3();
    }
    const A = this.elements;
    const B = matrix.elements;
    const T = target.elements;
    const a11 = A[0], a12 = A[1], a13 = A[2], a21 = A[3], a22 = A[4], a23 = A[5], a31 = A[6], a32 = A[7], a33 = A[8];
    const b11 = B[0], b12 = B[1], b13 = B[2], b21 = B[3], b22 = B[4], b23 = B[5], b31 = B[6], b32 = B[7], b33 = B[8];
    T[0] = a11 * b11 + a12 * b21 + a13 * b31;
    T[1] = a11 * b12 + a12 * b22 + a13 * b32;
    T[2] = a11 * b13 + a12 * b23 + a13 * b33;
    T[3] = a21 * b11 + a22 * b21 + a23 * b31;
    T[4] = a21 * b12 + a22 * b22 + a23 * b32;
    T[5] = a21 * b13 + a22 * b23 + a23 * b33;
    T[6] = a31 * b11 + a32 * b21 + a33 * b31;
    T[7] = a31 * b12 + a32 * b22 + a33 * b32;
    T[8] = a31 * b13 + a32 * b23 + a33 * b33;
    return target;
  }
  /**
   * Scale each column of the matrix
   */
  scale(vector, target) {
    if (target === void 0) {
      target = new _Mat3();
    }
    const e2 = this.elements;
    const t = target.elements;
    for (let i = 0; i !== 3; i++) {
      t[3 * i + 0] = vector.x * e2[3 * i + 0];
      t[3 * i + 1] = vector.y * e2[3 * i + 1];
      t[3 * i + 2] = vector.z * e2[3 * i + 2];
    }
    return target;
  }
  /**
   * Solve Ax=b
   * @param b The right hand side
   * @param target Optional. Target vector to save in.
   * @return The solution x
   * @todo should reuse arrays
   */
  solve(b2, target) {
    if (target === void 0) {
      target = new Vec3();
    }
    const nr = 3;
    const nc = 4;
    const eqns = [];
    let i;
    let j;
    for (i = 0; i < nr * nc; i++) {
      eqns.push(0);
    }
    for (i = 0; i < 3; i++) {
      for (j = 0; j < 3; j++) {
        eqns[i + nc * j] = this.elements[i + 3 * j];
      }
    }
    eqns[3 + 4 * 0] = b2.x;
    eqns[3 + 4 * 1] = b2.y;
    eqns[3 + 4 * 2] = b2.z;
    let n = 3;
    const k = n;
    let np;
    const kp = 4;
    let p;
    do {
      i = k - n;
      if (eqns[i + nc * i] === 0) {
        for (j = i + 1; j < k; j++) {
          if (eqns[i + nc * j] !== 0) {
            np = kp;
            do {
              p = kp - np;
              eqns[p + nc * i] += eqns[p + nc * j];
            } while (--np);
            break;
          }
        }
      }
      if (eqns[i + nc * i] !== 0) {
        for (j = i + 1; j < k; j++) {
          const multiplier = eqns[i + nc * j] / eqns[i + nc * i];
          np = kp;
          do {
            p = kp - np;
            eqns[p + nc * j] = p <= i ? 0 : eqns[p + nc * j] - eqns[p + nc * i] * multiplier;
          } while (--np);
        }
      }
    } while (--n);
    target.z = eqns[2 * nc + 3] / eqns[2 * nc + 2];
    target.y = (eqns[1 * nc + 3] - eqns[1 * nc + 2] * target.z) / eqns[1 * nc + 1];
    target.x = (eqns[0 * nc + 3] - eqns[0 * nc + 2] * target.z - eqns[0 * nc + 1] * target.y) / eqns[0 * nc + 0];
    if (isNaN(target.x) || isNaN(target.y) || isNaN(target.z) || target.x === Infinity || target.y === Infinity || target.z === Infinity) {
      throw `Could not solve equation! Got x=[${target.toString()}], b=[${b2.toString()}], A=[${this.toString()}]`;
    }
    return target;
  }
  /**
   * Get an element in the matrix by index. Index starts at 0, not 1!!!
   * @param value If provided, the matrix element will be set to this value.
   */
  e(row, column, value) {
    if (value === void 0) {
      return this.elements[column + 3 * row];
    } else {
      this.elements[column + 3 * row] = value;
    }
  }
  /**
   * Copy another matrix into this matrix object.
   */
  copy(matrix) {
    for (let i = 0; i < matrix.elements.length; i++) {
      this.elements[i] = matrix.elements[i];
    }
    return this;
  }
  /**
   * Returns a string representation of the matrix.
   */
  toString() {
    let r = "";
    const sep = ",";
    for (let i = 0; i < 9; i++) {
      r += this.elements[i] + sep;
    }
    return r;
  }
  /**
   * reverse the matrix
   * @param target Target matrix to save in.
   * @return The solution x
   */
  reverse(target) {
    if (target === void 0) {
      target = new _Mat3();
    }
    const nr = 3;
    const nc = 6;
    const eqns = reverse_eqns;
    let i;
    let j;
    for (i = 0; i < 3; i++) {
      for (j = 0; j < 3; j++) {
        eqns[i + nc * j] = this.elements[i + 3 * j];
      }
    }
    eqns[3 + 6 * 0] = 1;
    eqns[3 + 6 * 1] = 0;
    eqns[3 + 6 * 2] = 0;
    eqns[4 + 6 * 0] = 0;
    eqns[4 + 6 * 1] = 1;
    eqns[4 + 6 * 2] = 0;
    eqns[5 + 6 * 0] = 0;
    eqns[5 + 6 * 1] = 0;
    eqns[5 + 6 * 2] = 1;
    let n = 3;
    const k = n;
    let np;
    const kp = nc;
    let p;
    do {
      i = k - n;
      if (eqns[i + nc * i] === 0) {
        for (j = i + 1; j < k; j++) {
          if (eqns[i + nc * j] !== 0) {
            np = kp;
            do {
              p = kp - np;
              eqns[p + nc * i] += eqns[p + nc * j];
            } while (--np);
            break;
          }
        }
      }
      if (eqns[i + nc * i] !== 0) {
        for (j = i + 1; j < k; j++) {
          const multiplier = eqns[i + nc * j] / eqns[i + nc * i];
          np = kp;
          do {
            p = kp - np;
            eqns[p + nc * j] = p <= i ? 0 : eqns[p + nc * j] - eqns[p + nc * i] * multiplier;
          } while (--np);
        }
      }
    } while (--n);
    i = 2;
    do {
      j = i - 1;
      do {
        const multiplier = eqns[i + nc * j] / eqns[i + nc * i];
        np = nc;
        do {
          p = nc - np;
          eqns[p + nc * j] = eqns[p + nc * j] - eqns[p + nc * i] * multiplier;
        } while (--np);
      } while (j--);
    } while (--i);
    i = 2;
    do {
      const multiplier = 1 / eqns[i + nc * i];
      np = nc;
      do {
        p = nc - np;
        eqns[p + nc * i] = eqns[p + nc * i] * multiplier;
      } while (--np);
    } while (i--);
    i = 2;
    do {
      j = 2;
      do {
        p = eqns[nr + j + nc * i];
        if (isNaN(p) || p === Infinity) {
          throw `Could not reverse! A=[${this.toString()}]`;
        }
        target.e(i, j, p);
      } while (j--);
    } while (i--);
    return target;
  }
  /**
   * Set the matrix from a quaterion
   */
  setRotationFromQuaternion(q2) {
    const x = q2.x;
    const y = q2.y;
    const z = q2.z;
    const w = q2.w;
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;
    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    const e2 = this.elements;
    e2[3 * 0 + 0] = 1 - (yy + zz);
    e2[3 * 0 + 1] = xy - wz;
    e2[3 * 0 + 2] = xz + wy;
    e2[3 * 1 + 0] = xy + wz;
    e2[3 * 1 + 1] = 1 - (xx + zz);
    e2[3 * 1 + 2] = yz - wx;
    e2[3 * 2 + 0] = xz - wy;
    e2[3 * 2 + 1] = yz + wx;
    e2[3 * 2 + 2] = 1 - (xx + yy);
    return this;
  }
  /**
   * Transpose the matrix
   * @param target Optional. Where to store the result.
   * @return The target Mat3, or a new Mat3 if target was omitted.
   */
  transpose(target) {
    if (target === void 0) {
      target = new _Mat3();
    }
    const M = this.elements;
    const T = target.elements;
    let tmp;
    T[0] = M[0];
    T[4] = M[4];
    T[8] = M[8];
    tmp = M[1];
    T[1] = M[3];
    T[3] = tmp;
    tmp = M[2];
    T[2] = M[6];
    T[6] = tmp;
    tmp = M[5];
    T[5] = M[7];
    T[7] = tmp;
    return target;
  }
};
var reverse_eqns = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var Vec3 = class _Vec3 {
  constructor(x, y, z) {
    if (x === void 0) {
      x = 0;
    }
    if (y === void 0) {
      y = 0;
    }
    if (z === void 0) {
      z = 0;
    }
    this.x = x;
    this.y = y;
    this.z = z;
  }
  /**
   * Vector cross product
   * @param target Optional target to save in.
   */
  cross(vector, target) {
    if (target === void 0) {
      target = new _Vec3();
    }
    const vx = vector.x;
    const vy = vector.y;
    const vz = vector.z;
    const x = this.x;
    const y = this.y;
    const z = this.z;
    target.x = y * vz - z * vy;
    target.y = z * vx - x * vz;
    target.z = x * vy - y * vx;
    return target;
  }
  /**
   * Set the vectors' 3 elements
   */
  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  /**
   * Set all components of the vector to zero.
   */
  setZero() {
    this.x = this.y = this.z = 0;
  }
  /**
   * Vector addition
   */
  vadd(vector, target) {
    if (target) {
      target.x = vector.x + this.x;
      target.y = vector.y + this.y;
      target.z = vector.z + this.z;
    } else {
      return new _Vec3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }
  }
  /**
   * Vector subtraction
   * @param target Optional target to save in.
   */
  vsub(vector, target) {
    if (target) {
      target.x = this.x - vector.x;
      target.y = this.y - vector.y;
      target.z = this.z - vector.z;
    } else {
      return new _Vec3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }
  }
  /**
   * Get the cross product matrix a_cross from a vector, such that a x b = a_cross * b = c
   *
   * See {@link https://www8.cs.umu.se/kurser/TDBD24/VT06/lectures/Lecture6.pdf Umeå University Lecture}
   */
  crossmat() {
    return new Mat3([0, -this.z, this.y, this.z, 0, -this.x, -this.y, this.x, 0]);
  }
  /**
   * Normalize the vector. Note that this changes the values in the vector.
    * @return Returns the norm of the vector
   */
  normalize() {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const n = Math.sqrt(x * x + y * y + z * z);
    if (n > 0) {
      const invN = 1 / n;
      this.x *= invN;
      this.y *= invN;
      this.z *= invN;
    } else {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    }
    return n;
  }
  /**
   * Get the version of this vector that is of length 1.
   * @param target Optional target to save in
   * @return Returns the unit vector
   */
  unit(target) {
    if (target === void 0) {
      target = new _Vec3();
    }
    const x = this.x;
    const y = this.y;
    const z = this.z;
    let ninv = Math.sqrt(x * x + y * y + z * z);
    if (ninv > 0) {
      ninv = 1 / ninv;
      target.x = x * ninv;
      target.y = y * ninv;
      target.z = z * ninv;
    } else {
      target.x = 1;
      target.y = 0;
      target.z = 0;
    }
    return target;
  }
  /**
   * Get the length of the vector
   */
  length() {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    return Math.sqrt(x * x + y * y + z * z);
  }
  /**
   * Get the squared length of the vector.
   */
  lengthSquared() {
    return this.dot(this);
  }
  /**
   * Get distance from this point to another point
   */
  distanceTo(p) {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const px = p.x;
    const py = p.y;
    const pz = p.z;
    return Math.sqrt((px - x) * (px - x) + (py - y) * (py - y) + (pz - z) * (pz - z));
  }
  /**
   * Get squared distance from this point to another point
   */
  distanceSquared(p) {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const px = p.x;
    const py = p.y;
    const pz = p.z;
    return (px - x) * (px - x) + (py - y) * (py - y) + (pz - z) * (pz - z);
  }
  /**
   * Multiply all the components of the vector with a scalar.
   * @param target The vector to save the result in.
   */
  scale(scalar, target) {
    if (target === void 0) {
      target = new _Vec3();
    }
    const x = this.x;
    const y = this.y;
    const z = this.z;
    target.x = scalar * x;
    target.y = scalar * y;
    target.z = scalar * z;
    return target;
  }
  /**
   * Multiply the vector with an other vector, component-wise.
   * @param target The vector to save the result in.
   */
  vmul(vector, target) {
    if (target === void 0) {
      target = new _Vec3();
    }
    target.x = vector.x * this.x;
    target.y = vector.y * this.y;
    target.z = vector.z * this.z;
    return target;
  }
  /**
   * Scale a vector and add it to this vector. Save the result in "target". (target = this + vector * scalar)
   * @param target The vector to save the result in.
   */
  addScaledVector(scalar, vector, target) {
    if (target === void 0) {
      target = new _Vec3();
    }
    target.x = this.x + scalar * vector.x;
    target.y = this.y + scalar * vector.y;
    target.z = this.z + scalar * vector.z;
    return target;
  }
  /**
   * Calculate dot product
   * @param vector
   */
  dot(vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }
  isZero() {
    return this.x === 0 && this.y === 0 && this.z === 0;
  }
  /**
   * Make the vector point in the opposite direction.
   * @param target Optional target to save in
   */
  negate(target) {
    if (target === void 0) {
      target = new _Vec3();
    }
    target.x = -this.x;
    target.y = -this.y;
    target.z = -this.z;
    return target;
  }
  /**
   * Compute two artificial tangents to the vector
   * @param t1 Vector object to save the first tangent in
   * @param t2 Vector object to save the second tangent in
   */
  tangents(t1, t2) {
    const norm = this.length();
    if (norm > 0) {
      const n = Vec3_tangents_n;
      const inorm = 1 / norm;
      n.set(this.x * inorm, this.y * inorm, this.z * inorm);
      const randVec = Vec3_tangents_randVec;
      if (Math.abs(n.x) < 0.9) {
        randVec.set(1, 0, 0);
        n.cross(randVec, t1);
      } else {
        randVec.set(0, 1, 0);
        n.cross(randVec, t1);
      }
      n.cross(t1, t2);
    } else {
      t1.set(1, 0, 0);
      t2.set(0, 1, 0);
    }
  }
  /**
   * Converts to a more readable format
   */
  toString() {
    return `${this.x},${this.y},${this.z}`;
  }
  /**
   * Converts to an array
   */
  toArray() {
    return [this.x, this.y, this.z];
  }
  /**
   * Copies value of source to this vector.
   */
  copy(vector) {
    this.x = vector.x;
    this.y = vector.y;
    this.z = vector.z;
    return this;
  }
  /**
   * Do a linear interpolation between two vectors
   * @param t A number between 0 and 1. 0 will make this function return u, and 1 will make it return v. Numbers in between will generate a vector in between them.
   */
  lerp(vector, t, target) {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    target.x = x + (vector.x - x) * t;
    target.y = y + (vector.y - y) * t;
    target.z = z + (vector.z - z) * t;
  }
  /**
   * Check if a vector equals is almost equal to another one.
   */
  almostEquals(vector, precision) {
    if (precision === void 0) {
      precision = 1e-6;
    }
    if (Math.abs(this.x - vector.x) > precision || Math.abs(this.y - vector.y) > precision || Math.abs(this.z - vector.z) > precision) {
      return false;
    }
    return true;
  }
  /**
   * Check if a vector is almost zero
   */
  almostZero(precision) {
    if (precision === void 0) {
      precision = 1e-6;
    }
    if (Math.abs(this.x) > precision || Math.abs(this.y) > precision || Math.abs(this.z) > precision) {
      return false;
    }
    return true;
  }
  /**
   * Check if the vector is anti-parallel to another vector.
   * @param precision Set to zero for exact comparisons
   */
  isAntiparallelTo(vector, precision) {
    this.negate(antip_neg);
    return antip_neg.almostEquals(vector, precision);
  }
  /**
   * Clone the vector
   */
  clone() {
    return new _Vec3(this.x, this.y, this.z);
  }
};
Vec3.ZERO = new Vec3(0, 0, 0);
Vec3.UNIT_X = new Vec3(1, 0, 0);
Vec3.UNIT_Y = new Vec3(0, 1, 0);
Vec3.UNIT_Z = new Vec3(0, 0, 1);
var Vec3_tangents_n = new Vec3();
var Vec3_tangents_randVec = new Vec3();
var antip_neg = new Vec3();
var AABB = class _AABB {
  /**
   * The lower bound of the bounding box
   */
  /**
   * The upper bound of the bounding box
   */
  constructor(options) {
    if (options === void 0) {
      options = {};
    }
    this.lowerBound = new Vec3();
    this.upperBound = new Vec3();
    if (options.lowerBound) {
      this.lowerBound.copy(options.lowerBound);
    }
    if (options.upperBound) {
      this.upperBound.copy(options.upperBound);
    }
  }
  /**
   * Set the AABB bounds from a set of points.
   * @param points An array of Vec3's.
   * @return The self object
   */
  setFromPoints(points, position, quaternion, skinSize) {
    const l = this.lowerBound;
    const u = this.upperBound;
    const q2 = quaternion;
    l.copy(points[0]);
    if (q2) {
      q2.vmult(l, l);
    }
    u.copy(l);
    for (let i = 1; i < points.length; i++) {
      let p = points[i];
      if (q2) {
        q2.vmult(p, tmp$1);
        p = tmp$1;
      }
      if (p.x > u.x) {
        u.x = p.x;
      }
      if (p.x < l.x) {
        l.x = p.x;
      }
      if (p.y > u.y) {
        u.y = p.y;
      }
      if (p.y < l.y) {
        l.y = p.y;
      }
      if (p.z > u.z) {
        u.z = p.z;
      }
      if (p.z < l.z) {
        l.z = p.z;
      }
    }
    if (position) {
      position.vadd(l, l);
      position.vadd(u, u);
    }
    if (skinSize) {
      l.x -= skinSize;
      l.y -= skinSize;
      l.z -= skinSize;
      u.x += skinSize;
      u.y += skinSize;
      u.z += skinSize;
    }
    return this;
  }
  /**
   * Copy bounds from an AABB to this AABB
   * @param aabb Source to copy from
   * @return The this object, for chainability
   */
  copy(aabb) {
    this.lowerBound.copy(aabb.lowerBound);
    this.upperBound.copy(aabb.upperBound);
    return this;
  }
  /**
   * Clone an AABB
   */
  clone() {
    return new _AABB().copy(this);
  }
  /**
   * Extend this AABB so that it covers the given AABB too.
   */
  extend(aabb) {
    this.lowerBound.x = Math.min(this.lowerBound.x, aabb.lowerBound.x);
    this.upperBound.x = Math.max(this.upperBound.x, aabb.upperBound.x);
    this.lowerBound.y = Math.min(this.lowerBound.y, aabb.lowerBound.y);
    this.upperBound.y = Math.max(this.upperBound.y, aabb.upperBound.y);
    this.lowerBound.z = Math.min(this.lowerBound.z, aabb.lowerBound.z);
    this.upperBound.z = Math.max(this.upperBound.z, aabb.upperBound.z);
  }
  /**
   * Returns true if the given AABB overlaps this AABB.
   */
  overlaps(aabb) {
    const l1 = this.lowerBound;
    const u1 = this.upperBound;
    const l2 = aabb.lowerBound;
    const u2 = aabb.upperBound;
    const overlapsX = l2.x <= u1.x && u1.x <= u2.x || l1.x <= u2.x && u2.x <= u1.x;
    const overlapsY = l2.y <= u1.y && u1.y <= u2.y || l1.y <= u2.y && u2.y <= u1.y;
    const overlapsZ = l2.z <= u1.z && u1.z <= u2.z || l1.z <= u2.z && u2.z <= u1.z;
    return overlapsX && overlapsY && overlapsZ;
  }
  // Mostly for debugging
  volume() {
    const l = this.lowerBound;
    const u = this.upperBound;
    return (u.x - l.x) * (u.y - l.y) * (u.z - l.z);
  }
  /**
   * Returns true if the given AABB is fully contained in this AABB.
   */
  contains(aabb) {
    const l1 = this.lowerBound;
    const u1 = this.upperBound;
    const l2 = aabb.lowerBound;
    const u2 = aabb.upperBound;
    return l1.x <= l2.x && u1.x >= u2.x && l1.y <= l2.y && u1.y >= u2.y && l1.z <= l2.z && u1.z >= u2.z;
  }
  getCorners(a2, b2, c2, d, e2, f, g, h) {
    const l = this.lowerBound;
    const u = this.upperBound;
    a2.copy(l);
    b2.set(u.x, l.y, l.z);
    c2.set(u.x, u.y, l.z);
    d.set(l.x, u.y, u.z);
    e2.set(u.x, l.y, u.z);
    f.set(l.x, u.y, l.z);
    g.set(l.x, l.y, u.z);
    h.copy(u);
  }
  /**
   * Get the representation of an AABB in another frame.
   * @return The "target" AABB object.
   */
  toLocalFrame(frame, target) {
    const corners = transformIntoFrame_corners;
    const a2 = corners[0];
    const b2 = corners[1];
    const c2 = corners[2];
    const d = corners[3];
    const e2 = corners[4];
    const f = corners[5];
    const g = corners[6];
    const h = corners[7];
    this.getCorners(a2, b2, c2, d, e2, f, g, h);
    for (let i = 0; i !== 8; i++) {
      const corner = corners[i];
      frame.pointToLocal(corner, corner);
    }
    return target.setFromPoints(corners);
  }
  /**
   * Get the representation of an AABB in the global frame.
   * @return The "target" AABB object.
   */
  toWorldFrame(frame, target) {
    const corners = transformIntoFrame_corners;
    const a2 = corners[0];
    const b2 = corners[1];
    const c2 = corners[2];
    const d = corners[3];
    const e2 = corners[4];
    const f = corners[5];
    const g = corners[6];
    const h = corners[7];
    this.getCorners(a2, b2, c2, d, e2, f, g, h);
    for (let i = 0; i !== 8; i++) {
      const corner = corners[i];
      frame.pointToWorld(corner, corner);
    }
    return target.setFromPoints(corners);
  }
  /**
   * Check if the AABB is hit by a ray.
   */
  overlapsRay(ray) {
    const {
      direction,
      from
    } = ray;
    const dirFracX = 1 / direction.x;
    const dirFracY = 1 / direction.y;
    const dirFracZ = 1 / direction.z;
    const t1 = (this.lowerBound.x - from.x) * dirFracX;
    const t2 = (this.upperBound.x - from.x) * dirFracX;
    const t3 = (this.lowerBound.y - from.y) * dirFracY;
    const t4 = (this.upperBound.y - from.y) * dirFracY;
    const t5 = (this.lowerBound.z - from.z) * dirFracZ;
    const t6 = (this.upperBound.z - from.z) * dirFracZ;
    const tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
    const tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));
    if (tmax < 0) {
      return false;
    }
    if (tmin > tmax) {
      return false;
    }
    return true;
  }
};
var tmp$1 = new Vec3();
var transformIntoFrame_corners = [new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3()];
var Quaternion2 = class _Quaternion {
  constructor(x, y, z, w) {
    if (x === void 0) {
      x = 0;
    }
    if (y === void 0) {
      y = 0;
    }
    if (z === void 0) {
      z = 0;
    }
    if (w === void 0) {
      w = 1;
    }
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
  /**
   * Set the value of the quaternion.
   */
  set(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }
  /**
   * Convert to a readable format
   * @return "x,y,z,w"
   */
  toString() {
    return `${this.x},${this.y},${this.z},${this.w}`;
  }
  /**
   * Convert to an Array
   * @return [x, y, z, w]
   */
  toArray() {
    return [this.x, this.y, this.z, this.w];
  }
  /**
   * Set the quaternion components given an axis and an angle in radians.
   */
  setFromAxisAngle(vector, angle) {
    const s2 = Math.sin(angle * 0.5);
    this.x = vector.x * s2;
    this.y = vector.y * s2;
    this.z = vector.z * s2;
    this.w = Math.cos(angle * 0.5);
    return this;
  }
  /**
   * Converts the quaternion to [ axis, angle ] representation.
   * @param targetAxis A vector object to reuse for storing the axis.
   * @return An array, first element is the axis and the second is the angle in radians.
   */
  toAxisAngle(targetAxis) {
    if (targetAxis === void 0) {
      targetAxis = new Vec3();
    }
    this.normalize();
    const angle = 2 * Math.acos(this.w);
    const s2 = Math.sqrt(1 - this.w * this.w);
    if (s2 < 1e-3) {
      targetAxis.x = this.x;
      targetAxis.y = this.y;
      targetAxis.z = this.z;
    } else {
      targetAxis.x = this.x / s2;
      targetAxis.y = this.y / s2;
      targetAxis.z = this.z / s2;
    }
    return [targetAxis, angle];
  }
  /**
   * Set the quaternion value given two vectors. The resulting rotation will be the needed rotation to rotate u to v.
   */
  setFromVectors(u, v3) {
    if (u.isAntiparallelTo(v3)) {
      const t1 = sfv_t1;
      const t2 = sfv_t2;
      u.tangents(t1, t2);
      this.setFromAxisAngle(t1, Math.PI);
    } else {
      const a2 = u.cross(v3);
      this.x = a2.x;
      this.y = a2.y;
      this.z = a2.z;
      this.w = Math.sqrt(u.length() ** 2 * v3.length() ** 2) + u.dot(v3);
      this.normalize();
    }
    return this;
  }
  /**
   * Multiply the quaternion with an other quaternion.
   */
  mult(quat, target) {
    if (target === void 0) {
      target = new _Quaternion();
    }
    const ax = this.x;
    const ay = this.y;
    const az = this.z;
    const aw = this.w;
    const bx = quat.x;
    const by = quat.y;
    const bz = quat.z;
    const bw = quat.w;
    target.x = ax * bw + aw * bx + ay * bz - az * by;
    target.y = ay * bw + aw * by + az * bx - ax * bz;
    target.z = az * bw + aw * bz + ax * by - ay * bx;
    target.w = aw * bw - ax * bx - ay * by - az * bz;
    return target;
  }
  /**
   * Get the inverse quaternion rotation.
   */
  inverse(target) {
    if (target === void 0) {
      target = new _Quaternion();
    }
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const w = this.w;
    this.conjugate(target);
    const inorm2 = 1 / (x * x + y * y + z * z + w * w);
    target.x *= inorm2;
    target.y *= inorm2;
    target.z *= inorm2;
    target.w *= inorm2;
    return target;
  }
  /**
   * Get the quaternion conjugate
   */
  conjugate(target) {
    if (target === void 0) {
      target = new _Quaternion();
    }
    target.x = -this.x;
    target.y = -this.y;
    target.z = -this.z;
    target.w = this.w;
    return target;
  }
  /**
   * Normalize the quaternion. Note that this changes the values of the quaternion.
   */
  normalize() {
    let l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    if (l === 0) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = 0;
    } else {
      l = 1 / l;
      this.x *= l;
      this.y *= l;
      this.z *= l;
      this.w *= l;
    }
    return this;
  }
  /**
   * Approximation of quaternion normalization. Works best when quat is already almost-normalized.
   * @author unphased, https://github.com/unphased
   */
  normalizeFast() {
    const f = (3 - (this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)) / 2;
    if (f === 0) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = 0;
    } else {
      this.x *= f;
      this.y *= f;
      this.z *= f;
      this.w *= f;
    }
    return this;
  }
  /**
   * Multiply the quaternion by a vector
   */
  vmult(v3, target) {
    if (target === void 0) {
      target = new Vec3();
    }
    const x = v3.x;
    const y = v3.y;
    const z = v3.z;
    const qx = this.x;
    const qy = this.y;
    const qz = this.z;
    const qw = this.w;
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;
    target.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    target.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    target.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return target;
  }
  /**
   * Copies value of source to this quaternion.
   * @return this
   */
  copy(quat) {
    this.x = quat.x;
    this.y = quat.y;
    this.z = quat.z;
    this.w = quat.w;
    return this;
  }
  /**
   * Convert the quaternion to euler angle representation. Order: YZX, as this page describes: https://www.euclideanspace.com/maths/standards/index.htm
   * @param order Three-character string, defaults to "YZX"
   */
  toEuler(target, order) {
    if (order === void 0) {
      order = "YZX";
    }
    let heading;
    let attitude;
    let bank;
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const w = this.w;
    switch (order) {
      case "YZX":
        const test = x * y + z * w;
        if (test > 0.499) {
          heading = 2 * Math.atan2(x, w);
          attitude = Math.PI / 2;
          bank = 0;
        }
        if (test < -0.499) {
          heading = -2 * Math.atan2(x, w);
          attitude = -Math.PI / 2;
          bank = 0;
        }
        if (heading === void 0) {
          const sqx = x * x;
          const sqy = y * y;
          const sqz = z * z;
          heading = Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz);
          attitude = Math.asin(2 * test);
          bank = Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz);
        }
        break;
      default:
        throw new Error(`Euler order ${order} not supported yet.`);
    }
    target.y = heading;
    target.z = attitude;
    target.x = bank;
  }
  /**
   * Set the quaternion components given Euler angle representation.
   *
   * @param order The order to apply angles: 'XYZ' or 'YXZ' or any other combination.
   *
   * See {@link https://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors MathWorks} reference
   */
  setFromEuler(x, y, z, order) {
    if (order === void 0) {
      order = "XYZ";
    }
    const c1 = Math.cos(x / 2);
    const c2 = Math.cos(y / 2);
    const c3 = Math.cos(z / 2);
    const s1 = Math.sin(x / 2);
    const s2 = Math.sin(y / 2);
    const s3 = Math.sin(z / 2);
    if (order === "XYZ") {
      this.x = s1 * c2 * c3 + c1 * s2 * s3;
      this.y = c1 * s2 * c3 - s1 * c2 * s3;
      this.z = c1 * c2 * s3 + s1 * s2 * c3;
      this.w = c1 * c2 * c3 - s1 * s2 * s3;
    } else if (order === "YXZ") {
      this.x = s1 * c2 * c3 + c1 * s2 * s3;
      this.y = c1 * s2 * c3 - s1 * c2 * s3;
      this.z = c1 * c2 * s3 - s1 * s2 * c3;
      this.w = c1 * c2 * c3 + s1 * s2 * s3;
    } else if (order === "ZXY") {
      this.x = s1 * c2 * c3 - c1 * s2 * s3;
      this.y = c1 * s2 * c3 + s1 * c2 * s3;
      this.z = c1 * c2 * s3 + s1 * s2 * c3;
      this.w = c1 * c2 * c3 - s1 * s2 * s3;
    } else if (order === "ZYX") {
      this.x = s1 * c2 * c3 - c1 * s2 * s3;
      this.y = c1 * s2 * c3 + s1 * c2 * s3;
      this.z = c1 * c2 * s3 - s1 * s2 * c3;
      this.w = c1 * c2 * c3 + s1 * s2 * s3;
    } else if (order === "YZX") {
      this.x = s1 * c2 * c3 + c1 * s2 * s3;
      this.y = c1 * s2 * c3 + s1 * c2 * s3;
      this.z = c1 * c2 * s3 - s1 * s2 * c3;
      this.w = c1 * c2 * c3 - s1 * s2 * s3;
    } else if (order === "XZY") {
      this.x = s1 * c2 * c3 - c1 * s2 * s3;
      this.y = c1 * s2 * c3 - s1 * c2 * s3;
      this.z = c1 * c2 * s3 + s1 * s2 * c3;
      this.w = c1 * c2 * c3 + s1 * s2 * s3;
    }
    return this;
  }
  clone() {
    return new _Quaternion(this.x, this.y, this.z, this.w);
  }
  /**
   * Performs a spherical linear interpolation between two quat
   *
   * @param toQuat second operand
   * @param t interpolation amount between the self quaternion and toQuat
   * @param target A quaternion to store the result in. If not provided, a new one will be created.
   * @returns {Quaternion} The "target" object
   */
  slerp(toQuat, t, target) {
    if (target === void 0) {
      target = new _Quaternion();
    }
    const ax = this.x;
    const ay = this.y;
    const az = this.z;
    const aw = this.w;
    let bx = toQuat.x;
    let by = toQuat.y;
    let bz = toQuat.z;
    let bw = toQuat.w;
    let omega;
    let cosom;
    let sinom;
    let scale0;
    let scale1;
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    if (cosom < 0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    if (1 - cosom > 1e-6) {
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      scale0 = 1 - t;
      scale1 = t;
    }
    target.x = scale0 * ax + scale1 * bx;
    target.y = scale0 * ay + scale1 * by;
    target.z = scale0 * az + scale1 * bz;
    target.w = scale0 * aw + scale1 * bw;
    return target;
  }
  /**
   * Rotate an absolute orientation quaternion given an angular velocity and a time step.
   */
  integrate(angularVelocity, dt, angularFactor, target) {
    if (target === void 0) {
      target = new _Quaternion();
    }
    const ax = angularVelocity.x * angularFactor.x, ay = angularVelocity.y * angularFactor.y, az = angularVelocity.z * angularFactor.z, bx = this.x, by = this.y, bz = this.z, bw = this.w;
    const half_dt = dt * 0.5;
    target.x += half_dt * (ax * bw + ay * bz - az * by);
    target.y += half_dt * (ay * bw + az * bx - ax * bz);
    target.z += half_dt * (az * bw + ax * by - ay * bx);
    target.w += half_dt * (-ax * bx - ay * by - az * bz);
    return target;
  }
};
var sfv_t1 = new Vec3();
var sfv_t2 = new Vec3();
var SHAPE_TYPES = {
  /** SPHERE */
  SPHERE: 1,
  /** PLANE */
  PLANE: 2,
  /** BOX */
  BOX: 4,
  /** COMPOUND */
  COMPOUND: 8,
  /** CONVEXPOLYHEDRON */
  CONVEXPOLYHEDRON: 16,
  /** HEIGHTFIELD */
  HEIGHTFIELD: 32,
  /** PARTICLE */
  PARTICLE: 64,
  /** CYLINDER */
  CYLINDER: 128,
  /** TRIMESH */
  TRIMESH: 256
};
var Shape = class _Shape {
  /**
   * Identifier of the Shape.
   */
  /**
   * The type of this shape. Must be set to an int > 0 by subclasses.
   */
  /**
   * The local bounding sphere radius of this shape.
   */
  /**
   * Whether to produce contact forces when in contact with other bodies. Note that contacts will be generated, but they will be disabled.
   * @default true
   */
  /**
   * @default 1
   */
  /**
   * @default -1
   */
  /**
   * Optional material of the shape that regulates contact properties.
   */
  /**
   * The body to which the shape is added to.
   */
  /**
   * All the Shape types.
   */
  constructor(options) {
    if (options === void 0) {
      options = {};
    }
    this.id = _Shape.idCounter++;
    this.type = options.type || 0;
    this.boundingSphereRadius = 0;
    this.collisionResponse = options.collisionResponse ? options.collisionResponse : true;
    this.collisionFilterGroup = options.collisionFilterGroup !== void 0 ? options.collisionFilterGroup : 1;
    this.collisionFilterMask = options.collisionFilterMask !== void 0 ? options.collisionFilterMask : -1;
    this.material = options.material ? options.material : null;
    this.body = null;
  }
  /**
   * Computes the bounding sphere radius.
   * The result is stored in the property `.boundingSphereRadius`
   */
  updateBoundingSphereRadius() {
    throw `computeBoundingSphereRadius() not implemented for shape type ${this.type}`;
  }
  /**
   * Get the volume of this shape
   */
  volume() {
    throw `volume() not implemented for shape type ${this.type}`;
  }
  /**
   * Calculates the inertia in the local frame for this shape.
   * @see http://en.wikipedia.org/wiki/List_of_moments_of_inertia
   */
  calculateLocalInertia(mass, target) {
    throw `calculateLocalInertia() not implemented for shape type ${this.type}`;
  }
  /**
   * @todo use abstract for these kind of methods
   */
  calculateWorldAABB(pos, quat, min, max) {
    throw `calculateWorldAABB() not implemented for shape type ${this.type}`;
  }
};
Shape.idCounter = 0;
Shape.types = SHAPE_TYPES;
var Transform = class _Transform {
  /**
   * position
   */
  /**
   * quaternion
   */
  constructor(options) {
    if (options === void 0) {
      options = {};
    }
    this.position = new Vec3();
    this.quaternion = new Quaternion2();
    if (options.position) {
      this.position.copy(options.position);
    }
    if (options.quaternion) {
      this.quaternion.copy(options.quaternion);
    }
  }
  /**
   * Get a global point in local transform coordinates.
   */
  pointToLocal(worldPoint, result) {
    return _Transform.pointToLocalFrame(this.position, this.quaternion, worldPoint, result);
  }
  /**
   * Get a local point in global transform coordinates.
   */
  pointToWorld(localPoint, result) {
    return _Transform.pointToWorldFrame(this.position, this.quaternion, localPoint, result);
  }
  /**
   * vectorToWorldFrame
   */
  vectorToWorldFrame(localVector, result) {
    if (result === void 0) {
      result = new Vec3();
    }
    this.quaternion.vmult(localVector, result);
    return result;
  }
  /**
   * pointToLocalFrame
   */
  static pointToLocalFrame(position, quaternion, worldPoint, result) {
    if (result === void 0) {
      result = new Vec3();
    }
    worldPoint.vsub(position, result);
    quaternion.conjugate(tmpQuat$1);
    tmpQuat$1.vmult(result, result);
    return result;
  }
  /**
   * pointToWorldFrame
   */
  static pointToWorldFrame(position, quaternion, localPoint, result) {
    if (result === void 0) {
      result = new Vec3();
    }
    quaternion.vmult(localPoint, result);
    result.vadd(position, result);
    return result;
  }
  /**
   * vectorToWorldFrame
   */
  static vectorToWorldFrame(quaternion, localVector, result) {
    if (result === void 0) {
      result = new Vec3();
    }
    quaternion.vmult(localVector, result);
    return result;
  }
  /**
   * vectorToLocalFrame
   */
  static vectorToLocalFrame(position, quaternion, worldVector, result) {
    if (result === void 0) {
      result = new Vec3();
    }
    quaternion.w *= -1;
    quaternion.vmult(worldVector, result);
    quaternion.w *= -1;
    return result;
  }
};
var tmpQuat$1 = new Quaternion2();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
[new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3()];
new Vec3();
new Quaternion2();
new AABB();
new Mat3();
new Mat3();
new Mat3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Quaternion2();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
var RaycastResult = class {
  /**
   * rayFromWorld
   */
  /**
   * rayToWorld
   */
  /**
   * hitNormalWorld
   */
  /**
   * hitPointWorld
   */
  /**
   * hasHit
   */
  /**
   * shape
   */
  /**
   * body
   */
  /**
   * The index of the hit triangle, if the hit shape was a trimesh
   */
  /**
   * Distance to the hit. Will be set to -1 if there was no hit
   */
  /**
   * If the ray should stop traversing the bodies
   */
  constructor() {
    this.rayFromWorld = new Vec3();
    this.rayToWorld = new Vec3();
    this.hitNormalWorld = new Vec3();
    this.hitPointWorld = new Vec3();
    this.hasHit = false;
    this.shape = null;
    this.body = null;
    this.hitFaceIndex = -1;
    this.distance = -1;
    this.shouldStop = false;
  }
  /**
   * Reset all result data.
   */
  reset() {
    this.rayFromWorld.setZero();
    this.rayToWorld.setZero();
    this.hitNormalWorld.setZero();
    this.hitPointWorld.setZero();
    this.hasHit = false;
    this.shape = null;
    this.body = null;
    this.hitFaceIndex = -1;
    this.distance = -1;
    this.shouldStop = false;
  }
  /**
   * abort
   */
  abort() {
    this.shouldStop = true;
  }
  /**
   * Set result data.
   */
  set(rayFromWorld, rayToWorld, hitNormalWorld, hitPointWorld, shape, body, distance) {
    this.rayFromWorld.copy(rayFromWorld);
    this.rayToWorld.copy(rayToWorld);
    this.hitNormalWorld.copy(hitNormalWorld);
    this.hitPointWorld.copy(hitPointWorld);
    this.shape = shape;
    this.body = body;
    this.distance = distance;
  }
};
var _Shape$types$SPHERE;
var _Shape$types$PLANE;
var _Shape$types$BOX;
var _Shape$types$CYLINDER;
var _Shape$types$CONVEXPO;
var _Shape$types$HEIGHTFI;
var _Shape$types$TRIMESH;
var RAY_MODES = {
  /** CLOSEST */
  CLOSEST: 1,
  /** ANY */
  ANY: 2,
  /** ALL */
  ALL: 4
};
_Shape$types$SPHERE = Shape.types.SPHERE;
_Shape$types$PLANE = Shape.types.PLANE;
_Shape$types$BOX = Shape.types.BOX;
_Shape$types$CYLINDER = Shape.types.CYLINDER;
_Shape$types$CONVEXPO = Shape.types.CONVEXPOLYHEDRON;
_Shape$types$HEIGHTFI = Shape.types.HEIGHTFIELD;
_Shape$types$TRIMESH = Shape.types.TRIMESH;
var Ray = class _Ray {
  /**
   * from
   */
  /**
   * to
   */
  /**
   * direction
   */
  /**
   * The precision of the ray. Used when checking parallelity etc.
   * @default 0.0001
   */
  /**
   * Set to `false` if you don't want the Ray to take `collisionResponse` flags into account on bodies and shapes.
   * @default true
   */
  /**
   * If set to `true`, the ray skips any hits with normal.dot(rayDirection) < 0.
   * @default false
   */
  /**
   * collisionFilterMask
   * @default -1
   */
  /**
   * collisionFilterGroup
   * @default -1
   */
  /**
   * The intersection mode. Should be Ray.ANY, Ray.ALL or Ray.CLOSEST.
   * @default RAY.ANY
   */
  /**
   * Current result object.
   */
  /**
   * Will be set to `true` during intersectWorld() if the ray hit anything.
   */
  /**
   * User-provided result callback. Will be used if mode is Ray.ALL.
   */
  /**
   * CLOSEST
   */
  /**
   * ANY
   */
  /**
   * ALL
   */
  get [_Shape$types$SPHERE]() {
    return this._intersectSphere;
  }
  get [_Shape$types$PLANE]() {
    return this._intersectPlane;
  }
  get [_Shape$types$BOX]() {
    return this._intersectBox;
  }
  get [_Shape$types$CYLINDER]() {
    return this._intersectConvex;
  }
  get [_Shape$types$CONVEXPO]() {
    return this._intersectConvex;
  }
  get [_Shape$types$HEIGHTFI]() {
    return this._intersectHeightfield;
  }
  get [_Shape$types$TRIMESH]() {
    return this._intersectTrimesh;
  }
  constructor(from, to) {
    if (from === void 0) {
      from = new Vec3();
    }
    if (to === void 0) {
      to = new Vec3();
    }
    this.from = from.clone();
    this.to = to.clone();
    this.direction = new Vec3();
    this.precision = 1e-4;
    this.checkCollisionResponse = true;
    this.skipBackfaces = false;
    this.collisionFilterMask = -1;
    this.collisionFilterGroup = -1;
    this.mode = _Ray.ANY;
    this.result = new RaycastResult();
    this.hasHit = false;
    this.callback = (result) => {
    };
  }
  /**
   * Do itersection against all bodies in the given World.
   * @return True if the ray hit anything, otherwise false.
   */
  intersectWorld(world, options) {
    this.mode = options.mode || _Ray.ANY;
    this.result = options.result || new RaycastResult();
    this.skipBackfaces = !!options.skipBackfaces;
    this.collisionFilterMask = typeof options.collisionFilterMask !== "undefined" ? options.collisionFilterMask : -1;
    this.collisionFilterGroup = typeof options.collisionFilterGroup !== "undefined" ? options.collisionFilterGroup : -1;
    this.checkCollisionResponse = typeof options.checkCollisionResponse !== "undefined" ? options.checkCollisionResponse : true;
    if (options.from) {
      this.from.copy(options.from);
    }
    if (options.to) {
      this.to.copy(options.to);
    }
    this.callback = options.callback || (() => {
    });
    this.hasHit = false;
    this.result.reset();
    this.updateDirection();
    this.getAABB(tmpAABB$1);
    tmpArray.length = 0;
    world.broadphase.aabbQuery(world, tmpAABB$1, tmpArray);
    this.intersectBodies(tmpArray);
    return this.hasHit;
  }
  /**
   * Shoot a ray at a body, get back information about the hit.
   * @deprecated @param result set the result property of the Ray instead.
   */
  intersectBody(body, result) {
    if (result) {
      this.result = result;
      this.updateDirection();
    }
    const checkCollisionResponse = this.checkCollisionResponse;
    if (checkCollisionResponse && !body.collisionResponse) {
      return;
    }
    if ((this.collisionFilterGroup & body.collisionFilterMask) === 0 || (body.collisionFilterGroup & this.collisionFilterMask) === 0) {
      return;
    }
    const xi = intersectBody_xi;
    const qi = intersectBody_qi;
    for (let i = 0, N = body.shapes.length; i < N; i++) {
      const shape = body.shapes[i];
      if (checkCollisionResponse && !shape.collisionResponse) {
        continue;
      }
      body.quaternion.mult(body.shapeOrientations[i], qi);
      body.quaternion.vmult(body.shapeOffsets[i], xi);
      xi.vadd(body.position, xi);
      this.intersectShape(shape, qi, xi, body);
      if (this.result.shouldStop) {
        break;
      }
    }
  }
  /**
   * Shoot a ray at an array bodies, get back information about the hit.
   * @param bodies An array of Body objects.
   * @deprecated @param result set the result property of the Ray instead.
   *
   */
  intersectBodies(bodies, result) {
    if (result) {
      this.result = result;
      this.updateDirection();
    }
    for (let i = 0, l = bodies.length; !this.result.shouldStop && i < l; i++) {
      this.intersectBody(bodies[i]);
    }
  }
  /**
   * Updates the direction vector.
   */
  updateDirection() {
    this.to.vsub(this.from, this.direction);
    this.direction.normalize();
  }
  intersectShape(shape, quat, position, body) {
    const from = this.from;
    const distance = distanceFromIntersection(from, this.direction, position);
    if (distance > shape.boundingSphereRadius) {
      return;
    }
    const intersectMethod = this[shape.type];
    if (intersectMethod) {
      intersectMethod.call(this, shape, quat, position, body, shape);
    }
  }
  _intersectBox(box, quat, position, body, reportedShape) {
    return this._intersectConvex(box.convexPolyhedronRepresentation, quat, position, body, reportedShape);
  }
  _intersectPlane(shape, quat, position, body, reportedShape) {
    const from = this.from;
    const to = this.to;
    const direction = this.direction;
    const worldNormal = new Vec3(0, 0, 1);
    quat.vmult(worldNormal, worldNormal);
    const len = new Vec3();
    from.vsub(position, len);
    const planeToFrom = len.dot(worldNormal);
    to.vsub(position, len);
    const planeToTo = len.dot(worldNormal);
    if (planeToFrom * planeToTo > 0) {
      return;
    }
    if (from.distanceTo(to) < planeToFrom) {
      return;
    }
    const n_dot_dir = worldNormal.dot(direction);
    if (Math.abs(n_dot_dir) < this.precision) {
      return;
    }
    const planePointToFrom = new Vec3();
    const dir_scaled_with_t = new Vec3();
    const hitPointWorld = new Vec3();
    from.vsub(position, planePointToFrom);
    const t = -worldNormal.dot(planePointToFrom) / n_dot_dir;
    direction.scale(t, dir_scaled_with_t);
    from.vadd(dir_scaled_with_t, hitPointWorld);
    this.reportIntersection(worldNormal, hitPointWorld, reportedShape, body, -1);
  }
  /**
   * Get the world AABB of the ray.
   */
  getAABB(aabb) {
    const {
      lowerBound,
      upperBound
    } = aabb;
    const to = this.to;
    const from = this.from;
    lowerBound.x = Math.min(to.x, from.x);
    lowerBound.y = Math.min(to.y, from.y);
    lowerBound.z = Math.min(to.z, from.z);
    upperBound.x = Math.max(to.x, from.x);
    upperBound.y = Math.max(to.y, from.y);
    upperBound.z = Math.max(to.z, from.z);
  }
  _intersectHeightfield(shape, quat, position, body, reportedShape) {
    shape.data;
    shape.elementSize;
    const localRay = intersectHeightfield_localRay;
    localRay.from.copy(this.from);
    localRay.to.copy(this.to);
    Transform.pointToLocalFrame(position, quat, localRay.from, localRay.from);
    Transform.pointToLocalFrame(position, quat, localRay.to, localRay.to);
    localRay.updateDirection();
    const index = intersectHeightfield_index;
    let iMinX;
    let iMinY;
    let iMaxX;
    let iMaxY;
    iMinX = iMinY = 0;
    iMaxX = iMaxY = shape.data.length - 1;
    const aabb = new AABB();
    localRay.getAABB(aabb);
    shape.getIndexOfPosition(aabb.lowerBound.x, aabb.lowerBound.y, index, true);
    iMinX = Math.max(iMinX, index[0]);
    iMinY = Math.max(iMinY, index[1]);
    shape.getIndexOfPosition(aabb.upperBound.x, aabb.upperBound.y, index, true);
    iMaxX = Math.min(iMaxX, index[0] + 1);
    iMaxY = Math.min(iMaxY, index[1] + 1);
    for (let i = iMinX; i < iMaxX; i++) {
      for (let j = iMinY; j < iMaxY; j++) {
        if (this.result.shouldStop) {
          return;
        }
        shape.getAabbAtIndex(i, j, aabb);
        if (!aabb.overlapsRay(localRay)) {
          continue;
        }
        shape.getConvexTrianglePillar(i, j, false);
        Transform.pointToWorldFrame(position, quat, shape.pillarOffset, worldPillarOffset);
        this._intersectConvex(shape.pillarConvex, quat, worldPillarOffset, body, reportedShape, intersectConvexOptions);
        if (this.result.shouldStop) {
          return;
        }
        shape.getConvexTrianglePillar(i, j, true);
        Transform.pointToWorldFrame(position, quat, shape.pillarOffset, worldPillarOffset);
        this._intersectConvex(shape.pillarConvex, quat, worldPillarOffset, body, reportedShape, intersectConvexOptions);
      }
    }
  }
  _intersectSphere(sphere, quat, position, body, reportedShape) {
    const from = this.from;
    const to = this.to;
    const r = sphere.radius;
    const a2 = (to.x - from.x) ** 2 + (to.y - from.y) ** 2 + (to.z - from.z) ** 2;
    const b2 = 2 * ((to.x - from.x) * (from.x - position.x) + (to.y - from.y) * (from.y - position.y) + (to.z - from.z) * (from.z - position.z));
    const c2 = (from.x - position.x) ** 2 + (from.y - position.y) ** 2 + (from.z - position.z) ** 2 - r ** 2;
    const delta = b2 ** 2 - 4 * a2 * c2;
    const intersectionPoint = Ray_intersectSphere_intersectionPoint;
    const normal = Ray_intersectSphere_normal;
    if (delta < 0) {
      return;
    } else if (delta === 0) {
      from.lerp(to, delta, intersectionPoint);
      intersectionPoint.vsub(position, normal);
      normal.normalize();
      this.reportIntersection(normal, intersectionPoint, reportedShape, body, -1);
    } else {
      const d1 = (-b2 - Math.sqrt(delta)) / (2 * a2);
      const d2 = (-b2 + Math.sqrt(delta)) / (2 * a2);
      if (d1 >= 0 && d1 <= 1) {
        from.lerp(to, d1, intersectionPoint);
        intersectionPoint.vsub(position, normal);
        normal.normalize();
        this.reportIntersection(normal, intersectionPoint, reportedShape, body, -1);
      }
      if (this.result.shouldStop) {
        return;
      }
      if (d2 >= 0 && d2 <= 1) {
        from.lerp(to, d2, intersectionPoint);
        intersectionPoint.vsub(position, normal);
        normal.normalize();
        this.reportIntersection(normal, intersectionPoint, reportedShape, body, -1);
      }
    }
  }
  _intersectConvex(shape, quat, position, body, reportedShape, options) {
    const normal = intersectConvex_normal;
    const vector = intersectConvex_vector;
    const faceList = options && options.faceList || null;
    const faces = shape.faces;
    const vertices = shape.vertices;
    const normals = shape.faceNormals;
    const direction = this.direction;
    const from = this.from;
    const to = this.to;
    const fromToDistance = from.distanceTo(to);
    const Nfaces = faceList ? faceList.length : faces.length;
    const result = this.result;
    for (let j = 0; !result.shouldStop && j < Nfaces; j++) {
      const fi = faceList ? faceList[j] : j;
      const face = faces[fi];
      const faceNormal = normals[fi];
      const q2 = quat;
      const x = position;
      vector.copy(vertices[face[0]]);
      q2.vmult(vector, vector);
      vector.vadd(x, vector);
      vector.vsub(from, vector);
      q2.vmult(faceNormal, normal);
      const dot = direction.dot(normal);
      if (Math.abs(dot) < this.precision) {
        continue;
      }
      const scalar = normal.dot(vector) / dot;
      if (scalar < 0) {
        continue;
      }
      direction.scale(scalar, intersectPoint);
      intersectPoint.vadd(from, intersectPoint);
      a.copy(vertices[face[0]]);
      q2.vmult(a, a);
      x.vadd(a, a);
      for (let i = 1; !result.shouldStop && i < face.length - 1; i++) {
        b.copy(vertices[face[i]]);
        c.copy(vertices[face[i + 1]]);
        q2.vmult(b, b);
        q2.vmult(c, c);
        x.vadd(b, b);
        x.vadd(c, c);
        const distance = intersectPoint.distanceTo(from);
        if (!(_Ray.pointInTriangle(intersectPoint, a, b, c) || _Ray.pointInTriangle(intersectPoint, b, a, c)) || distance > fromToDistance) {
          continue;
        }
        this.reportIntersection(normal, intersectPoint, reportedShape, body, fi);
      }
    }
  }
  /**
   * @todo Optimize by transforming the world to local space first.
   * @todo Use Octree lookup
   */
  _intersectTrimesh(mesh, quat, position, body, reportedShape, options) {
    const normal = intersectTrimesh_normal;
    const triangles = intersectTrimesh_triangles;
    const treeTransform = intersectTrimesh_treeTransform;
    const vector = intersectConvex_vector;
    const localDirection = intersectTrimesh_localDirection;
    const localFrom = intersectTrimesh_localFrom;
    const localTo = intersectTrimesh_localTo;
    const worldIntersectPoint = intersectTrimesh_worldIntersectPoint;
    const worldNormal = intersectTrimesh_worldNormal;
    const indices = mesh.indices;
    mesh.vertices;
    const from = this.from;
    const to = this.to;
    const direction = this.direction;
    treeTransform.position.copy(position);
    treeTransform.quaternion.copy(quat);
    Transform.vectorToLocalFrame(position, quat, direction, localDirection);
    Transform.pointToLocalFrame(position, quat, from, localFrom);
    Transform.pointToLocalFrame(position, quat, to, localTo);
    localTo.x *= mesh.scale.x;
    localTo.y *= mesh.scale.y;
    localTo.z *= mesh.scale.z;
    localFrom.x *= mesh.scale.x;
    localFrom.y *= mesh.scale.y;
    localFrom.z *= mesh.scale.z;
    localTo.vsub(localFrom, localDirection);
    localDirection.normalize();
    const fromToDistanceSquared = localFrom.distanceSquared(localTo);
    mesh.tree.rayQuery(this, treeTransform, triangles);
    for (let i = 0, N = triangles.length; !this.result.shouldStop && i !== N; i++) {
      const trianglesIndex = triangles[i];
      mesh.getNormal(trianglesIndex, normal);
      mesh.getVertex(indices[trianglesIndex * 3], a);
      a.vsub(localFrom, vector);
      const dot = localDirection.dot(normal);
      const scalar = normal.dot(vector) / dot;
      if (scalar < 0) {
        continue;
      }
      localDirection.scale(scalar, intersectPoint);
      intersectPoint.vadd(localFrom, intersectPoint);
      mesh.getVertex(indices[trianglesIndex * 3 + 1], b);
      mesh.getVertex(indices[trianglesIndex * 3 + 2], c);
      const squaredDistance = intersectPoint.distanceSquared(localFrom);
      if (!(_Ray.pointInTriangle(intersectPoint, b, a, c) || _Ray.pointInTriangle(intersectPoint, a, b, c)) || squaredDistance > fromToDistanceSquared) {
        continue;
      }
      Transform.vectorToWorldFrame(quat, normal, worldNormal);
      Transform.pointToWorldFrame(position, quat, intersectPoint, worldIntersectPoint);
      this.reportIntersection(worldNormal, worldIntersectPoint, reportedShape, body, trianglesIndex);
    }
    triangles.length = 0;
  }
  /**
   * @return True if the intersections should continue
   */
  reportIntersection(normal, hitPointWorld, shape, body, hitFaceIndex) {
    const from = this.from;
    const to = this.to;
    const distance = from.distanceTo(hitPointWorld);
    const result = this.result;
    if (this.skipBackfaces && normal.dot(this.direction) > 0) {
      return;
    }
    result.hitFaceIndex = typeof hitFaceIndex !== "undefined" ? hitFaceIndex : -1;
    switch (this.mode) {
      case _Ray.ALL:
        this.hasHit = true;
        result.set(from, to, normal, hitPointWorld, shape, body, distance);
        result.hasHit = true;
        this.callback(result);
        break;
      case _Ray.CLOSEST:
        if (distance < result.distance || !result.hasHit) {
          this.hasHit = true;
          result.hasHit = true;
          result.set(from, to, normal, hitPointWorld, shape, body, distance);
        }
        break;
      case _Ray.ANY:
        this.hasHit = true;
        result.hasHit = true;
        result.set(from, to, normal, hitPointWorld, shape, body, distance);
        result.shouldStop = true;
        break;
    }
  }
  /**
   * As per "Barycentric Technique" as named
   * {@link https://www.blackpawn.com/texts/pointinpoly/default.html here} but without the division
   */
  static pointInTriangle(p, a2, b2, c2) {
    c2.vsub(a2, v0);
    b2.vsub(a2, v1);
    p.vsub(a2, v2);
    const dot00 = v0.dot(v0);
    const dot01 = v0.dot(v1);
    const dot02 = v0.dot(v2);
    const dot11 = v1.dot(v1);
    const dot12 = v1.dot(v2);
    let u;
    let v3;
    return (u = dot11 * dot02 - dot01 * dot12) >= 0 && (v3 = dot00 * dot12 - dot01 * dot02) >= 0 && u + v3 < dot00 * dot11 - dot01 * dot01;
  }
};
Ray.CLOSEST = RAY_MODES.CLOSEST;
Ray.ANY = RAY_MODES.ANY;
Ray.ALL = RAY_MODES.ALL;
var tmpAABB$1 = new AABB();
var tmpArray = [];
var v1 = new Vec3();
var v2 = new Vec3();
var intersectBody_xi = new Vec3();
var intersectBody_qi = new Quaternion2();
var intersectPoint = new Vec3();
var a = new Vec3();
var b = new Vec3();
var c = new Vec3();
new Vec3();
new RaycastResult();
var intersectConvexOptions = {
  faceList: [0]
};
var worldPillarOffset = new Vec3();
var intersectHeightfield_localRay = new Ray();
var intersectHeightfield_index = [];
var Ray_intersectSphere_intersectionPoint = new Vec3();
var Ray_intersectSphere_normal = new Vec3();
var intersectConvex_normal = new Vec3();
new Vec3();
new Vec3();
var intersectConvex_vector = new Vec3();
var intersectTrimesh_normal = new Vec3();
var intersectTrimesh_localDirection = new Vec3();
var intersectTrimesh_localFrom = new Vec3();
var intersectTrimesh_localTo = new Vec3();
var intersectTrimesh_worldNormal = new Vec3();
var intersectTrimesh_worldIntersectPoint = new Vec3();
new AABB();
var intersectTrimesh_triangles = [];
var intersectTrimesh_treeTransform = new Transform();
var v0 = new Vec3();
var intersect = new Vec3();
function distanceFromIntersection(from, direction, position) {
  position.vsub(from, v0);
  const dot = v0.dot(direction);
  direction.scale(dot, intersect);
  intersect.vadd(from, intersect);
  const distance = position.distanceTo(intersect);
  return distance;
}
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Ray();
new Vec3();
new Vec3();
new Vec3();
[new Vec3(1, 0, 0), new Vec3(0, 1, 0), new Vec3(0, 0, 1)];
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new AABB();
new Vec3();
new AABB();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new AABB();
new Vec3();
new Transform();
new AABB();
({
  sphereSphere: Shape.types.SPHERE,
  spherePlane: Shape.types.SPHERE | Shape.types.PLANE,
  boxBox: Shape.types.BOX | Shape.types.BOX,
  sphereBox: Shape.types.SPHERE | Shape.types.BOX,
  planeBox: Shape.types.PLANE | Shape.types.BOX,
  convexConvex: Shape.types.CONVEXPOLYHEDRON,
  sphereConvex: Shape.types.SPHERE | Shape.types.CONVEXPOLYHEDRON,
  planeConvex: Shape.types.PLANE | Shape.types.CONVEXPOLYHEDRON,
  boxConvex: Shape.types.BOX | Shape.types.CONVEXPOLYHEDRON,
  sphereHeightfield: Shape.types.SPHERE | Shape.types.HEIGHTFIELD,
  boxHeightfield: Shape.types.BOX | Shape.types.HEIGHTFIELD,
  convexHeightfield: Shape.types.CONVEXPOLYHEDRON | Shape.types.HEIGHTFIELD,
  sphereParticle: Shape.types.PARTICLE | Shape.types.SPHERE,
  planeParticle: Shape.types.PLANE | Shape.types.PARTICLE,
  boxParticle: Shape.types.BOX | Shape.types.PARTICLE,
  convexParticle: Shape.types.PARTICLE | Shape.types.CONVEXPOLYHEDRON,
  cylinderCylinder: Shape.types.CYLINDER,
  sphereCylinder: Shape.types.SPHERE | Shape.types.CYLINDER,
  planeCylinder: Shape.types.PLANE | Shape.types.CYLINDER,
  boxCylinder: Shape.types.BOX | Shape.types.CYLINDER,
  convexCylinder: Shape.types.CONVEXPOLYHEDRON | Shape.types.CYLINDER,
  heightfieldCylinder: Shape.types.HEIGHTFIELD | Shape.types.CYLINDER,
  particleCylinder: Shape.types.PARTICLE | Shape.types.CYLINDER,
  sphereTrimesh: Shape.types.SPHERE | Shape.types.TRIMESH,
  planeTrimesh: Shape.types.PLANE | Shape.types.TRIMESH
});
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Quaternion2();
new Quaternion2();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new AABB();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
[new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3()];
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Quaternion2();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new Vec3();
new AABB();
new Ray();
var performance = globalThis.performance || {};
if (!performance.now) {
  let nowOffset = Date.now();
  if (performance.timing && performance.timing.navigationStart) {
    nowOffset = performance.timing.navigationStart;
  }
  performance.now = () => Date.now() - nowOffset;
}
new Vec3();
function CannonDebugger(scene, world, _temp) {
  let {
    color = 65280,
    scale = 1,
    onInit,
    onUpdate
  } = _temp === void 0 ? {} : _temp;
  const _meshes = [];
  const _material = new MeshBasicMaterial({
    color: color != null ? color : 65280,
    wireframe: true
  });
  const _tempVec0 = new Vec3();
  const _tempVec1 = new Vec3();
  const _tempVec2 = new Vec3();
  const _tempQuat0 = new Quaternion2();
  const _sphereGeometry = new SphereGeometry(1);
  const _boxGeometry = new BoxGeometry(1, 1, 1);
  const _planeGeometry = new PlaneGeometry(10, 10, 10, 10);
  _planeGeometry.translate(0, 0, 1e-4);
  function createConvexPolyhedronGeometry(shape) {
    const geometry = new BufferGeometry();
    const positions = [];
    for (let i = 0; i < shape.vertices.length; i++) {
      const vertex = shape.vertices[i];
      positions.push(vertex.x, vertex.y, vertex.z);
    }
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    const indices = [];
    for (let i = 0; i < shape.faces.length; i++) {
      const face = shape.faces[i];
      const a2 = face[0];
      for (let j = 1; j < face.length - 1; j++) {
        const b2 = face[j];
        const c2 = face[j + 1];
        indices.push(a2, b2, c2);
      }
    }
    geometry.setIndex(indices);
    geometry.computeBoundingSphere();
    geometry.computeVertexNormals();
    return geometry;
  }
  function createTrimeshGeometry(shape) {
    const geometry = new BufferGeometry();
    const positions = [];
    const v02 = _tempVec0;
    const v12 = _tempVec1;
    const v22 = _tempVec2;
    for (let i = 0; i < shape.indices.length / 3; i++) {
      shape.getTriangleVertices(i, v02, v12, v22);
      positions.push(v02.x, v02.y, v02.z);
      positions.push(v12.x, v12.y, v12.z);
      positions.push(v22.x, v22.y, v22.z);
    }
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.computeBoundingSphere();
    geometry.computeVertexNormals();
    return geometry;
  }
  function createHeightfieldGeometry(shape) {
    const geometry = new BufferGeometry();
    const s2 = shape.elementSize || 1;
    const positions = shape.data.flatMap((row, i) => row.flatMap((z, j) => [i * s2, j * s2, z]));
    const indices = [];
    for (let xi = 0; xi < shape.data.length - 1; xi++) {
      for (let yi = 0; yi < shape.data[xi].length - 1; yi++) {
        const stride = shape.data[xi].length;
        const index = xi * stride + yi;
        indices.push(index + 1, index + stride, index + stride + 1);
        indices.push(index + stride, index + 1, index);
      }
    }
    geometry.setIndex(indices);
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.computeBoundingSphere();
    geometry.computeVertexNormals();
    return geometry;
  }
  function createMesh(shape) {
    let mesh = new Mesh();
    const {
      SPHERE,
      BOX,
      PLANE,
      CYLINDER,
      CONVEXPOLYHEDRON,
      TRIMESH,
      HEIGHTFIELD
    } = Shape.types;
    switch (shape.type) {
      case SPHERE: {
        mesh = new Mesh(_sphereGeometry, _material);
        break;
      }
      case BOX: {
        mesh = new Mesh(_boxGeometry, _material);
        break;
      }
      case PLANE: {
        mesh = new Mesh(_planeGeometry, _material);
        break;
      }
      case CYLINDER: {
        const geometry = new CylinderGeometry(shape.radiusTop, shape.radiusBottom, shape.height, shape.numSegments);
        mesh = new Mesh(geometry, _material);
        shape.geometryId = geometry.id;
        break;
      }
      case CONVEXPOLYHEDRON: {
        const geometry = createConvexPolyhedronGeometry(shape);
        mesh = new Mesh(geometry, _material);
        shape.geometryId = geometry.id;
        break;
      }
      case TRIMESH: {
        const geometry = createTrimeshGeometry(shape);
        mesh = new Mesh(geometry, _material);
        shape.geometryId = geometry.id;
        break;
      }
      case HEIGHTFIELD: {
        const geometry = createHeightfieldGeometry(shape);
        mesh = new Mesh(geometry, _material);
        shape.geometryId = geometry.id;
        break;
      }
    }
    scene.add(mesh);
    return mesh;
  }
  function scaleMesh(mesh, shape) {
    const {
      SPHERE,
      BOX,
      PLANE,
      CYLINDER,
      CONVEXPOLYHEDRON,
      TRIMESH,
      HEIGHTFIELD
    } = Shape.types;
    switch (shape.type) {
      case SPHERE: {
        const {
          radius
        } = shape;
        mesh.scale.set(radius * scale, radius * scale, radius * scale);
        break;
      }
      case BOX: {
        mesh.scale.copy(shape.halfExtents);
        mesh.scale.multiplyScalar(2 * scale);
        break;
      }
      case PLANE: {
        break;
      }
      case CYLINDER: {
        mesh.scale.set(1 * scale, 1 * scale, 1 * scale);
        break;
      }
      case CONVEXPOLYHEDRON: {
        mesh.scale.set(1 * scale, 1 * scale, 1 * scale);
        break;
      }
      case TRIMESH: {
        mesh.scale.copy(shape.scale).multiplyScalar(scale);
        break;
      }
      case HEIGHTFIELD: {
        mesh.scale.set(1 * scale, 1 * scale, 1 * scale);
        break;
      }
    }
  }
  function typeMatch(mesh, shape) {
    if (!mesh)
      return false;
    const {
      geometry
    } = mesh;
    return geometry instanceof SphereGeometry && shape.type === Shape.types.SPHERE || geometry instanceof BoxGeometry && shape.type === Shape.types.BOX || geometry instanceof PlaneGeometry && shape.type === Shape.types.PLANE || geometry.id === shape.geometryId && shape.type === Shape.types.CYLINDER || geometry.id === shape.geometryId && shape.type === Shape.types.CONVEXPOLYHEDRON || geometry.id === shape.geometryId && shape.type === Shape.types.TRIMESH || geometry.id === shape.geometryId && shape.type === Shape.types.HEIGHTFIELD;
  }
  function updateMesh(index, shape) {
    let mesh = _meshes[index];
    let didCreateNewMesh = false;
    if (!typeMatch(mesh, shape)) {
      if (mesh)
        scene.remove(mesh);
      _meshes[index] = mesh = createMesh(shape);
      didCreateNewMesh = true;
    }
    scaleMesh(mesh, shape);
    return didCreateNewMesh;
  }
  function update() {
    const meshes = _meshes;
    const shapeWorldPosition = _tempVec0;
    const shapeWorldQuaternion = _tempQuat0;
    let meshIndex = 0;
    for (const body of world.bodies) {
      for (let i = 0; i !== body.shapes.length; i++) {
        const shape = body.shapes[i];
        const didCreateNewMesh = updateMesh(meshIndex, shape);
        const mesh = meshes[meshIndex];
        if (mesh) {
          body.quaternion.vmult(body.shapeOffsets[i], shapeWorldPosition);
          body.position.vadd(shapeWorldPosition, shapeWorldPosition);
          body.quaternion.mult(body.shapeOrientations[i], shapeWorldQuaternion);
          mesh.position.copy(shapeWorldPosition);
          mesh.quaternion.copy(shapeWorldQuaternion);
          if (didCreateNewMesh && onInit instanceof Function)
            onInit(body, mesh, shape);
          if (!didCreateNewMesh && onUpdate instanceof Function)
            onUpdate(body, mesh, shape);
        }
        meshIndex++;
      }
    }
    for (let i = meshIndex; i < meshes.length; i++) {
      const mesh = meshes[i];
      if (mesh)
        scene.remove(mesh);
    }
    meshes.length = meshIndex;
  }
  return {
    update
  };
}
var debugContext = (0, import_react.createContext)(null);
var useDebugContext = () => (0, import_react.useContext)(debugContext);
var physicsContext = (0, import_react.createContext)(null);
var usePhysicsContext = () => {
  const context = (0, import_react.useContext)(physicsContext);
  if (!context)
    throw new Error("Physics context not found. @react-three/cannon & components can only be used within a Physics provider");
  return context;
};
var q$2 = new Quaternion();
var s$1 = new Vector3(1, 1, 1);
var v$1 = new Vector3();
var m$1 = new Matrix4();
var getMatrix = (o) => {
  if (o instanceof InstancedMesh) {
    o.getMatrixAt(parseInt(o.uuid.split("/")[1]), m$1);
    return m$1;
  }
  return o.matrix;
};
function DebugProvider(_ref) {
  let {
    children,
    color = "black",
    impl = CannonDebugger,
    scale = 1
  } = _ref;
  const [{
    bodies,
    bodyMap
  }] = (0, import_react.useState)({
    bodies: [],
    bodyMap: {}
  });
  const {
    refs
  } = usePhysicsContext();
  const [scene] = (0, import_react.useState)(() => new Scene());
  const cannonDebuggerRef = (0, import_react.useRef)(impl(scene, {
    bodies
  }, {
    color,
    scale
  }));
  useFrame(() => {
    for (const uuid in bodyMap) {
      getMatrix(refs[uuid]).decompose(v$1, q$2, s$1);
      bodyMap[uuid].position.copy(v$1);
      bodyMap[uuid].quaternion.copy(q$2);
    }
    cannonDebuggerRef.current.update();
  });
  const api = (0, import_react.useMemo)(() => ({
    add(uuid, props, type) {
      const body = propsToBody({
        props,
        type,
        uuid
      });
      bodies.push(body);
      bodyMap[uuid] = body;
    },
    remove(uuid) {
      const index = bodies.indexOf(bodyMap[uuid]);
      if (index !== -1)
        bodies.splice(index, 1);
      delete bodyMap[uuid];
    }
  }), [bodies, bodyMap]);
  return (0, import_jsx_runtime.jsxs)(debugContext.Provider, {
    value: api,
    children: [(0, import_jsx_runtime.jsx)("primitive", {
      object: scene
    }), children]
  });
}
var temp = new Object3D();
function useForwardedRef(ref) {
  const nullRef = (0, import_react.useRef)(null);
  return ref && typeof ref !== "function" ? ref : nullRef;
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function getUUID(ref, index) {
  const suffix = index === void 0 ? "" : `/${index}`;
  if (typeof ref === "function")
    return null;
  return ref && ref.current && `${ref.current.uuid}${suffix}`;
}
var e = new Euler();
var q$1 = new Quaternion();
var quaternionToRotation = (callback) => {
  return (v3) => callback(e.setFromQuaternion(q$1.fromArray(v3)).toArray());
};
var incrementingId = 0;
function subscribe(ref, worker, subscriptions, type, index, target) {
  if (target === void 0) {
    target = "bodies";
  }
  return (callback) => {
    const id = incrementingId++;
    subscriptions[id] = {
      [type]: callback
    };
    const uuid = getUUID(ref, index);
    uuid && worker.subscribe({
      props: {
        id,
        target,
        type
      },
      uuid
    });
    return () => {
      delete subscriptions[id];
      worker.unsubscribe({
        props: id
      });
    };
  };
}
function prepare(object, _ref) {
  let {
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    userData = {}
  } = _ref;
  object.userData = userData;
  object.position.set(...position);
  object.rotation.set(...rotation);
  object.updateMatrix();
}
function setupCollision(events2, _ref2, uuid) {
  let {
    onCollide,
    onCollideBegin,
    onCollideEnd
  } = _ref2;
  events2[uuid] = {
    collide: onCollide,
    collideBegin: onCollideBegin,
    collideEnd: onCollideEnd
  };
}
function useBody(type, fn, argsFn, fwdRef, deps) {
  if (fwdRef === void 0) {
    fwdRef = null;
  }
  if (deps === void 0) {
    deps = [];
  }
  const ref = useForwardedRef(fwdRef);
  const {
    events: events2,
    refs,
    scaleOverrides,
    subscriptions,
    worker
  } = usePhysicsContext();
  const debugApi = useDebugContext();
  (0, import_react.useLayoutEffect)(() => {
    if (!ref.current) {
      ref.current = new Object3D();
    }
    const object = ref.current;
    const currentWorker = worker;
    const objectCount = object instanceof InstancedMesh ? (object.instanceMatrix.setUsage(DynamicDrawUsage), object.count) : 1;
    const uuid = object instanceof InstancedMesh ? new Array(objectCount).fill(0).map((_, i) => `${object.uuid}/${i}`) : [object.uuid];
    const props = object instanceof InstancedMesh ? uuid.map((id, i) => {
      const props2 = fn(i);
      prepare(temp, props2);
      object.setMatrixAt(i, temp.matrix);
      object.instanceMatrix.needsUpdate = true;
      refs[id] = object;
      debugApi == null ? void 0 : debugApi.add(id, props2, type);
      setupCollision(events2, props2, id);
      return {
        ...props2,
        args: argsFn(props2.args)
      };
    }) : uuid.map((id, i) => {
      const props2 = fn(i);
      prepare(object, props2);
      refs[id] = object;
      debugApi == null ? void 0 : debugApi.add(id, props2, type);
      setupCollision(events2, props2, id);
      return {
        ...props2,
        args: argsFn(props2.args)
      };
    });
    currentWorker.addBodies({
      props: props.map((_ref3) => {
        let {
          onCollide,
          onCollideBegin,
          onCollideEnd,
          ...serializableProps
        } = _ref3;
        return {
          onCollide: Boolean(onCollide),
          ...serializableProps
        };
      }),
      type,
      uuid
    });
    return () => {
      uuid.forEach((id) => {
        delete refs[id];
        debugApi == null ? void 0 : debugApi.remove(id);
        delete events2[id];
      });
      currentWorker.removeBodies({
        uuid
      });
    };
  }, deps);
  const api = (0, import_react.useMemo)(() => {
    const makeAtomic = (type2, index) => {
      const op = `set${capitalize(type2)}`;
      return {
        set: (value) => {
          const uuid = getUUID(ref, index);
          uuid && worker[op]({
            props: value,
            uuid
          });
        },
        subscribe: subscribe(ref, worker, subscriptions, type2, index)
      };
    };
    const makeQuaternion = (index) => {
      const type2 = "quaternion";
      return {
        copy: (_ref4) => {
          let {
            w,
            x,
            y,
            z
          } = _ref4;
          const uuid = getUUID(ref, index);
          uuid && worker.setQuaternion({
            props: [x, y, z, w],
            uuid
          });
        },
        set: (x, y, z, w) => {
          const uuid = getUUID(ref, index);
          uuid && worker.setQuaternion({
            props: [x, y, z, w],
            uuid
          });
        },
        subscribe: subscribe(ref, worker, subscriptions, type2, index)
      };
    };
    const makeRotation = (index) => {
      return {
        copy: (_ref5) => {
          let {
            x,
            y,
            z
          } = _ref5;
          const uuid = getUUID(ref, index);
          uuid && worker.setRotation({
            props: [x, y, z],
            uuid
          });
        },
        set: (x, y, z) => {
          const uuid = getUUID(ref, index);
          uuid && worker.setRotation({
            props: [x, y, z],
            uuid
          });
        },
        subscribe: (callback) => {
          const id = incrementingId++;
          const target = "bodies";
          const type2 = "quaternion";
          const uuid = getUUID(ref, index);
          subscriptions[id] = {
            [type2]: quaternionToRotation(callback)
          };
          uuid && worker.subscribe({
            props: {
              id,
              target,
              type: type2
            },
            uuid
          });
          return () => {
            delete subscriptions[id];
            worker.unsubscribe({
              props: id
            });
          };
        }
      };
    };
    const makeVec = (type2, index) => {
      const op = `set${capitalize(type2)}`;
      return {
        copy: (_ref6) => {
          let {
            x,
            y,
            z
          } = _ref6;
          const uuid = getUUID(ref, index);
          uuid && worker[op]({
            props: [x, y, z],
            uuid
          });
        },
        set: (x, y, z) => {
          const uuid = getUUID(ref, index);
          uuid && worker[op]({
            props: [x, y, z],
            uuid
          });
        },
        subscribe: subscribe(ref, worker, subscriptions, type2, index)
      };
    };
    function makeApi(index) {
      return {
        allowSleep: makeAtomic("allowSleep", index),
        angularDamping: makeAtomic("angularDamping", index),
        angularFactor: makeVec("angularFactor", index),
        angularVelocity: makeVec("angularVelocity", index),
        applyForce(force, worldPoint) {
          const uuid = getUUID(ref, index);
          uuid && worker.applyForce({
            props: [force, worldPoint],
            uuid
          });
        },
        applyImpulse(impulse, worldPoint) {
          const uuid = getUUID(ref, index);
          uuid && worker.applyImpulse({
            props: [impulse, worldPoint],
            uuid
          });
        },
        applyLocalForce(force, localPoint) {
          const uuid = getUUID(ref, index);
          uuid && worker.applyLocalForce({
            props: [force, localPoint],
            uuid
          });
        },
        applyLocalImpulse(impulse, localPoint) {
          const uuid = getUUID(ref, index);
          uuid && worker.applyLocalImpulse({
            props: [impulse, localPoint],
            uuid
          });
        },
        applyTorque(torque) {
          const uuid = getUUID(ref, index);
          uuid && worker.applyTorque({
            props: [torque],
            uuid
          });
        },
        collisionFilterGroup: makeAtomic("collisionFilterGroup", index),
        collisionFilterMask: makeAtomic("collisionFilterMask", index),
        collisionResponse: makeAtomic("collisionResponse", index),
        fixedRotation: makeAtomic("fixedRotation", index),
        isTrigger: makeAtomic("isTrigger", index),
        linearDamping: makeAtomic("linearDamping", index),
        linearFactor: makeVec("linearFactor", index),
        mass: makeAtomic("mass", index),
        material: makeAtomic("material", index),
        position: makeVec("position", index),
        quaternion: makeQuaternion(index),
        rotation: makeRotation(index),
        scaleOverride(scale) {
          const uuid = getUUID(ref, index);
          if (uuid)
            scaleOverrides[uuid] = new Vector3(...scale);
        },
        sleep() {
          const uuid = getUUID(ref, index);
          uuid && worker.sleep({
            uuid
          });
        },
        sleepSpeedLimit: makeAtomic("sleepSpeedLimit", index),
        sleepTimeLimit: makeAtomic("sleepTimeLimit", index),
        userData: makeAtomic("userData", index),
        velocity: makeVec("velocity", index),
        wakeUp() {
          const uuid = getUUID(ref, index);
          uuid && worker.wakeUp({
            uuid
          });
        }
      };
    }
    const cache = {};
    return {
      ...makeApi(void 0),
      at: (index) => cache[index] || (cache[index] = makeApi(index))
    };
  }, []);
  return [ref, api];
}
function makeTriplet(v3) {
  return v3 instanceof Vector3 ? [v3.x, v3.y, v3.z] : v3;
}
function usePlane(fn, fwdRef, deps) {
  return useBody("Plane", fn, () => [], fwdRef, deps);
}
function useBox(fn, fwdRef, deps) {
  const defaultBoxArgs = [1, 1, 1];
  return useBody("Box", fn, function(args) {
    if (args === void 0) {
      args = defaultBoxArgs;
    }
    return args;
  }, fwdRef, deps);
}
function useCylinder(fn, fwdRef, deps) {
  return useBody("Cylinder", fn, function(args) {
    if (args === void 0) {
      args = [];
    }
    return args;
  }, fwdRef, deps);
}
function useHeightfield(fn, fwdRef, deps) {
  return useBody("Heightfield", fn, (args) => args, fwdRef, deps);
}
function useParticle(fn, fwdRef, deps) {
  return useBody("Particle", fn, () => [], fwdRef, deps);
}
function useSphere(fn, fwdRef, deps) {
  return useBody("Sphere", fn, function(args) {
    if (args === void 0) {
      args = [1];
    }
    if (!Array.isArray(args))
      throw new Error("useSphere args must be an array");
    return [args[0]];
  }, fwdRef, deps);
}
function useTrimesh(fn, fwdRef, deps) {
  return useBody("Trimesh", fn, (args) => args, fwdRef, deps);
}
function useConvexPolyhedron(fn, fwdRef, deps) {
  return useBody("ConvexPolyhedron", fn, function(_temp) {
    let [vertices, faces, normals, axes, boundingSphereRadius] = _temp === void 0 ? [] : _temp;
    return [vertices && vertices.map(makeTriplet), faces, normals && normals.map(makeTriplet), axes && axes.map(makeTriplet), boundingSphereRadius];
  }, fwdRef, deps);
}
function useCompoundBody(fn, fwdRef, deps) {
  return useBody("Compound", fn, (args) => args, fwdRef, deps);
}
function useConstraint(type, bodyA, bodyB, optns, deps) {
  if (optns === void 0) {
    optns = {};
  }
  if (deps === void 0) {
    deps = [];
  }
  const {
    worker
  } = usePhysicsContext();
  const uuid = MathUtils.generateUUID();
  const refA = useForwardedRef(bodyA);
  const refB = useForwardedRef(bodyB);
  (0, import_react.useEffect)(() => {
    if (refA.current && refB.current) {
      worker.addConstraint({
        props: [refA.current.uuid, refB.current.uuid, optns],
        type,
        uuid
      });
      return () => worker.removeConstraint({
        uuid
      });
    }
  }, deps);
  const api = (0, import_react.useMemo)(() => {
    const enableDisable = {
      disable: () => worker.disableConstraint({
        uuid
      }),
      enable: () => worker.enableConstraint({
        uuid
      })
    };
    if (type === "Hinge") {
      return {
        ...enableDisable,
        disableMotor: () => worker.disableConstraintMotor({
          uuid
        }),
        enableMotor: () => worker.enableConstraintMotor({
          uuid
        }),
        setMotorMaxForce: (value) => worker.setConstraintMotorMaxForce({
          props: value,
          uuid
        }),
        setMotorSpeed: (value) => worker.setConstraintMotorSpeed({
          props: value,
          uuid
        })
      };
    }
    return enableDisable;
  }, deps);
  return [refA, refB, api];
}
function usePointToPointConstraint(bodyA, bodyB, optns, deps) {
  if (bodyA === void 0) {
    bodyA = null;
  }
  if (bodyB === void 0) {
    bodyB = null;
  }
  if (deps === void 0) {
    deps = [];
  }
  return useConstraint("PointToPoint", bodyA, bodyB, optns, deps);
}
function useConeTwistConstraint(bodyA, bodyB, optns, deps) {
  if (bodyA === void 0) {
    bodyA = null;
  }
  if (bodyB === void 0) {
    bodyB = null;
  }
  if (deps === void 0) {
    deps = [];
  }
  return useConstraint("ConeTwist", bodyA, bodyB, optns, deps);
}
function useDistanceConstraint(bodyA, bodyB, optns, deps) {
  if (bodyA === void 0) {
    bodyA = null;
  }
  if (bodyB === void 0) {
    bodyB = null;
  }
  if (deps === void 0) {
    deps = [];
  }
  return useConstraint("Distance", bodyA, bodyB, optns, deps);
}
function useHingeConstraint(bodyA, bodyB, optns, deps) {
  if (bodyA === void 0) {
    bodyA = null;
  }
  if (bodyB === void 0) {
    bodyB = null;
  }
  if (deps === void 0) {
    deps = [];
  }
  return useConstraint("Hinge", bodyA, bodyB, optns, deps);
}
function useLockConstraint(bodyA, bodyB, optns, deps) {
  if (bodyA === void 0) {
    bodyA = null;
  }
  if (bodyB === void 0) {
    bodyB = null;
  }
  if (deps === void 0) {
    deps = [];
  }
  return useConstraint("Lock", bodyA, bodyB, optns, deps);
}
function useSpring(bodyA, bodyB, optns, deps) {
  if (bodyA === void 0) {
    bodyA = null;
  }
  if (bodyB === void 0) {
    bodyB = null;
  }
  if (deps === void 0) {
    deps = [];
  }
  const {
    worker
  } = usePhysicsContext();
  const [uuid] = (0, import_react.useState)(() => MathUtils.generateUUID());
  const refA = useForwardedRef(bodyA);
  const refB = useForwardedRef(bodyB);
  (0, import_react.useEffect)(() => {
    if (refA.current && refB.current) {
      worker.addSpring({
        props: [refA.current.uuid, refB.current.uuid, optns],
        uuid
      });
      return () => {
        worker.removeSpring({
          uuid
        });
      };
    }
  }, deps);
  const api = (0, import_react.useMemo)(() => ({
    setDamping: (value) => worker.setSpringDamping({
      props: value,
      uuid
    }),
    setRestLength: (value) => worker.setSpringRestLength({
      props: value,
      uuid
    }),
    setStiffness: (value) => worker.setSpringStiffness({
      props: value,
      uuid
    })
  }), deps);
  return [refA, refB, api];
}
function useRay(mode, options, callback, deps) {
  if (deps === void 0) {
    deps = [];
  }
  const {
    worker,
    events: events2
  } = usePhysicsContext();
  const [uuid] = (0, import_react.useState)(() => MathUtils.generateUUID());
  (0, import_react.useEffect)(() => {
    events2[uuid] = {
      rayhit: callback
    };
    worker.addRay({
      props: {
        ...options,
        mode
      },
      uuid
    });
    return () => {
      worker.removeRay({
        uuid
      });
      delete events2[uuid];
    };
  }, deps);
}
function useRaycastClosest(options, callback, deps) {
  if (deps === void 0) {
    deps = [];
  }
  useRay("Closest", options, callback, deps);
}
function useRaycastAny(options, callback, deps) {
  if (deps === void 0) {
    deps = [];
  }
  useRay("Any", options, callback, deps);
}
function useRaycastAll(options, callback, deps) {
  if (deps === void 0) {
    deps = [];
  }
  useRay("All", options, callback, deps);
}
function isString(v3) {
  return typeof v3 === "string";
}
function useRaycastVehicle(fn, fwdRef, deps) {
  if (fwdRef === void 0) {
    fwdRef = null;
  }
  if (deps === void 0) {
    deps = [];
  }
  const ref = useForwardedRef(fwdRef);
  const {
    worker,
    subscriptions
  } = usePhysicsContext();
  (0, import_react.useLayoutEffect)(() => {
    if (!ref.current) {
      ref.current = new Object3D();
    }
    const currentWorker = worker;
    const uuid = ref.current.uuid;
    const {
      chassisBody,
      indexForwardAxis = 2,
      indexRightAxis = 0,
      indexUpAxis = 1,
      wheelInfos,
      wheels
    } = fn();
    const chassisBodyUUID = getUUID(chassisBody);
    const wheelUUIDs = wheels.map((ref2) => getUUID(ref2));
    if (!chassisBodyUUID || !wheelUUIDs.every(isString))
      return;
    currentWorker.addRaycastVehicle({
      props: [chassisBodyUUID, wheelUUIDs, wheelInfos, indexForwardAxis, indexRightAxis, indexUpAxis],
      uuid
    });
    return () => {
      currentWorker.removeRaycastVehicle({
        uuid
      });
    };
  }, deps);
  const api = (0, import_react.useMemo)(() => {
    return {
      applyEngineForce(value, wheelIndex) {
        const uuid = getUUID(ref);
        uuid && worker.applyRaycastVehicleEngineForce({
          props: [value, wheelIndex],
          uuid
        });
      },
      setBrake(brake, wheelIndex) {
        const uuid = getUUID(ref);
        uuid && worker.setRaycastVehicleBrake({
          props: [brake, wheelIndex],
          uuid
        });
      },
      setSteeringValue(value, wheelIndex) {
        const uuid = getUUID(ref);
        uuid && worker.setRaycastVehicleSteeringValue({
          props: [value, wheelIndex],
          uuid
        });
      },
      sliding: {
        subscribe: subscribe(ref, worker, subscriptions, "sliding", void 0, "vehicles")
      }
    };
  }, deps);
  return [ref, api];
}
function useContactMaterial(materialA, materialB, options, deps) {
  if (deps === void 0) {
    deps = [];
  }
  const {
    worker
  } = usePhysicsContext();
  const [uuid] = (0, import_react.useState)(() => MathUtils.generateUUID());
  (0, import_react.useEffect)(() => {
    worker.addContactMaterial({
      props: [materialA, materialB, options],
      uuid
    });
    return () => {
      worker.removeContactMaterial({
        uuid
      });
    };
  }, deps);
}
var v = new Vector3();
var s = new Vector3(1, 1, 1);
var q = new Quaternion();
var m = new Matrix4();
function apply(index, positions, quaternions, scale, object) {
  if (scale === void 0) {
    scale = s;
  }
  if (index !== void 0) {
    m.compose(v.fromArray(positions, index * 3), q.fromArray(quaternions, index * 4), scale);
    if (object) {
      object.matrixAutoUpdate = false;
      object.matrix.copy(m);
    }
    return m;
  }
  return m.identity();
}
var unique = () => {
  const values = [];
  return (value) => values.includes(value) ? false : !!values.push(value);
};
function PhysicsProvider(_ref) {
  let {
    allowSleep = false,
    axisIndex = 0,
    broadphase = "Naive",
    children,
    defaultContactMaterial = {
      contactEquationStiffness: 1e6
    },
    frictionGravity = null,
    gravity = [0, -9.81, 0],
    isPaused = false,
    iterations = 5,
    maxSubSteps = 10,
    quatNormalizeFast = false,
    quatNormalizeSkip = 0,
    shouldInvalidate = true,
    size = 1e3,
    solver = "GS",
    stepSize = 1 / 60,
    tolerance = 1e-3
  } = _ref;
  const {
    invalidate
  } = useThree();
  const [{
    bodies,
    events: events2,
    refs,
    scaleOverrides,
    subscriptions,
    worker
  }] = (0, import_react.useState)(() => ({
    bodies: {},
    events: {},
    refs: {},
    scaleOverrides: {},
    subscriptions: {},
    worker: new CannonWorkerAPI({
      allowSleep,
      axisIndex,
      broadphase,
      defaultContactMaterial,
      frictionGravity,
      gravity,
      iterations,
      quatNormalizeFast,
      quatNormalizeSkip,
      size,
      solver,
      tolerance
    })
  }));
  let timeSinceLastCalled = 0;
  const loop = (0, import_react.useCallback)((_, delta) => {
    if (isPaused)
      return;
    timeSinceLastCalled += delta;
    worker.step({
      maxSubSteps,
      stepSize,
      timeSinceLastCalled
    });
    timeSinceLastCalled = 0;
  }, [isPaused, maxSubSteps, stepSize]);
  const collideHandler = (_ref2) => {
    var _events$target;
    let {
      body,
      contact: {
        bi,
        bj,
        ...contactRest
      },
      target,
      ...rest
    } = _ref2;
    const cb2 = (_events$target = events2[target]) == null ? void 0 : _events$target.collide;
    cb2 && cb2({
      body: refs[body],
      contact: {
        bi: refs[bi],
        bj: refs[bj],
        ...contactRest
      },
      target: refs[target],
      ...rest
    });
  };
  const collideBeginHandler = (_ref3) => {
    var _events$bodyA, _events$bodyB;
    let {
      bodyA,
      bodyB
    } = _ref3;
    const cbA = (_events$bodyA = events2[bodyA]) == null ? void 0 : _events$bodyA.collideBegin;
    cbA && cbA({
      body: refs[bodyB],
      op: "event",
      target: refs[bodyA],
      type: "collideBegin"
    });
    const cbB = (_events$bodyB = events2[bodyB]) == null ? void 0 : _events$bodyB.collideBegin;
    cbB && cbB({
      body: refs[bodyA],
      op: "event",
      target: refs[bodyB],
      type: "collideBegin"
    });
  };
  const collideEndHandler = (_ref4) => {
    var _events$bodyA2, _events$bodyB2;
    let {
      bodyA,
      bodyB
    } = _ref4;
    const cbA = (_events$bodyA2 = events2[bodyA]) == null ? void 0 : _events$bodyA2.collideEnd;
    cbA && cbA({
      body: refs[bodyB],
      op: "event",
      target: refs[bodyA],
      type: "collideEnd"
    });
    const cbB = (_events$bodyB2 = events2[bodyB]) == null ? void 0 : _events$bodyB2.collideEnd;
    cbB && cbB({
      body: refs[bodyA],
      op: "event",
      target: refs[bodyB],
      type: "collideEnd"
    });
  };
  const frameHandler = (_ref5) => {
    let {
      active,
      bodies: uuids = [],
      observations,
      positions,
      quaternions
    } = _ref5;
    for (let i = 0; i < uuids.length; i++) {
      bodies[uuids[i]] = i;
    }
    observations.forEach((_ref6) => {
      let [id, value2, type] = _ref6;
      const subscription = subscriptions[id] || {};
      const cb2 = subscription[type];
      cb2 && cb2(value2);
    });
    if (!active)
      return;
    for (const ref of Object.values(refs).filter(unique())) {
      if (ref instanceof InstancedMesh) {
        for (let i = 0; i < ref.count; i++) {
          const uuid = `${ref.uuid}/${i}`;
          const index = bodies[uuid];
          if (index !== void 0) {
            ref.setMatrixAt(i, apply(index, positions, quaternions, scaleOverrides[uuid]));
            ref.instanceMatrix.needsUpdate = true;
          }
        }
      } else {
        const scale = scaleOverrides[ref.uuid] || ref.scale;
        apply(bodies[ref.uuid], positions, quaternions, scale, ref);
      }
    }
    if (shouldInvalidate) {
      invalidate();
    }
  };
  const rayhitHandler = (_ref7) => {
    var _events$uuid;
    let {
      body,
      ray: {
        uuid,
        ...rayRest
      },
      ...rest
    } = _ref7;
    const cb2 = (_events$uuid = events2[uuid]) == null ? void 0 : _events$uuid.rayhit;
    cb2 && cb2({
      body: body ? refs[body] : null,
      ray: {
        uuid,
        ...rayRest
      },
      ...rest
    });
  };
  useFrame(loop);
  (0, import_react.useEffect)(() => {
    worker.connect();
    worker.init();
    worker.on("collide", collideHandler);
    worker.on("collideBegin", collideBeginHandler);
    worker.on("collideEnd", collideEndHandler);
    worker.on("frame", frameHandler);
    worker.on("rayhit", rayhitHandler);
    return () => {
      worker.terminate();
      worker.removeAllListeners();
    };
  }, []);
  (0, import_react.useEffect)(() => {
    worker.axisIndex = axisIndex;
  }, [axisIndex]);
  (0, import_react.useEffect)(() => {
    worker.broadphase = broadphase;
  }, [broadphase]);
  (0, import_react.useEffect)(() => {
    worker.gravity = gravity;
  }, [gravity]);
  (0, import_react.useEffect)(() => {
    worker.iterations = iterations;
  }, [iterations]);
  (0, import_react.useEffect)(() => {
    worker.tolerance = tolerance;
  }, [tolerance]);
  const value = (0, import_react.useMemo)(() => ({
    bodies,
    events: events2,
    refs,
    scaleOverrides,
    subscriptions,
    worker
  }), [bodies, events2, refs, subscriptions, worker]);
  return (0, import_jsx_runtime.jsx)(physicsContext.Provider, {
    value,
    children
  });
}
export {
  DebugProvider as Debug,
  PhysicsProvider as Physics,
  useBox,
  useCompoundBody,
  useConeTwistConstraint,
  useContactMaterial,
  useConvexPolyhedron,
  useCylinder,
  useDistanceConstraint,
  useHeightfield,
  useHingeConstraint,
  useLockConstraint,
  useParticle,
  usePlane,
  usePointToPointConstraint,
  useRaycastAll,
  useRaycastAny,
  useRaycastClosest,
  useRaycastVehicle,
  useSphere,
  useSpring,
  useTrimesh
};
//# sourceMappingURL=@react-three_cannon.js.map
