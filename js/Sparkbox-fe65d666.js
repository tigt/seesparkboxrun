! function(a, b) {
    var c = [].slice,
        d = {};
    a.amplify = {
        publish: function(a) {
            if ("string" != typeof a) throw new Error("You must provide a valid topic to publish.");
            var b, e, f, g, h = c.call(arguments, 1),
                i = 0;
            if (!d[a]) return !0;
            for (b = d[a].slice(), f = b.length; f > i && (e = b[i], g = e.callback.apply(e.context, h), g !== !1); i++);
            return g !== !1
        },
        subscribe: function(a, b, c, e) {
            if ("string" != typeof a) throw new Error("You must provide a valid topic to create a subscription.");
            3 === arguments.length && "number" == typeof c && (e = c, c = b, b = null), 2 === arguments.length && (c = b, b = null), e = e || 10;
            for (var f, g = 0, h = a.split(/\s/), i = h.length; i > g; g++) {
                a = h[g], f = !1, d[a] || (d[a] = []);
                for (var j = d[a].length - 1, k = {
                        callback: c,
                        context: b,
                        priority: e
                    }; j >= 0; j--)
                    if (d[a][j].priority <= e) {
                        d[a].splice(j + 1, 0, k), f = !0;
                        break
                    }
                f || d[a].unshift(k)
            }
            return c
        },
        unsubscribe: function(a, b, c) {
            if ("string" != typeof a) throw new Error("You must provide a valid topic to remove a subscription.");
            if (2 === arguments.length && (c = b, b = null), d[a])
                for (var e = d[a].length, f = 0; e > f; f++) d[a][f].callback === c && (b && d[a][f].context !== b || (d[a].splice(f, 1), f--, e--))
        }
    }
}(this),
function(a, b) {
    function c(a, c) {
        d.addType(a, function(f, g, h) {
            var i, j, k, l, m = g,
                n = (new Date).getTime();
            if (!f) {
                m = {}, l = [], k = 0;
                try {
                    for (f = c.length; f = c.key(k++);) e.test(f) && (j = JSON.parse(c.getItem(f)), j.expires && j.expires <= n ? l.push(f) : m[f.replace(e, "")] = j.data);
                    for (; f = l.pop();) c.removeItem(f)
                } catch (o) {}
                return m
            }
            if (f = "__amplify__" + f, g === b) {
                if (i = c.getItem(f), j = i ? JSON.parse(i) : {
                        expires: -1
                    }, !(j.expires && j.expires <= n)) return j.data;
                c.removeItem(f)
            } else if (null === g) c.removeItem(f);
            else {
                j = JSON.stringify({
                    data: g,
                    expires: h.expires ? n + h.expires : null
                });
                try {
                    c.setItem(f, j)
                } catch (o) {
                    d[a]();
                    try {
                        c.setItem(f, j)
                    } catch (o) {
                        throw d.error()
                    }
                }
            }
            return m
        })
    }
    var d = a.store = function(a, b, c) {
        var e = d.type;
        return c && c.type && c.type in d.types && (e = c.type), d.types[e](a, b, c || {})
    };
    d.types = {}, d.type = null, d.addType = function(a, b) {
        d.type || (d.type = a), d.types[a] = b, d[a] = function(b, c, e) {
            return e = e || {}, e.type = a, d(b, c, e)
        }
    }, d.error = function() {
        return "amplify.store quota exceeded"
    };
    var e = /^__amplify__/;
    for (var f in {
            localStorage: 1,
            sessionStorage: 1
        }) try {
        window[f].setItem("__amplify__", "x"), window[f].removeItem("__amplify__"), c(f, window[f])
    } catch (g) {}
    if (!d.types.localStorage && window.globalStorage) try {
            c("globalStorage", window.globalStorage[window.location.hostname]), "sessionStorage" === d.type && (d.type = "globalStorage")
        } catch (g) {}! function() {
            if (!d.types.localStorage) {
                var a = document.createElement("div"),
                    c = "amplify";
                a.style.display = "none", document.getElementsByTagName("head")[0].appendChild(a);
                try {
                    a.addBehavior("#default#userdata"), a.load(c)
                } catch (e) {
                    return void a.parentNode.removeChild(a)
                }
                d.addType("userData", function(e, f, g) {
                    a.load(c);
                    var h, i, j, k, l, m = f,
                        n = (new Date).getTime();
                    if (!e) {
                        for (m = {}, l = [], k = 0; h = a.XMLDocument.documentElement.attributes[k++];) i = JSON.parse(h.value), i.expires && i.expires <= n ? l.push(h.name) : m[h.name] = i.data;
                        for (; e = l.pop();) a.removeAttribute(e);
                        return a.save(c), m
                    }
                    if (e = e.replace(/[^\-._0-9A-Za-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c-\u200d\u203f\u2040\u2070-\u218f]/g, "-"), e = e.replace(/^-/, "_-"), f === b) {
                        if (h = a.getAttribute(e), i = h ? JSON.parse(h) : {
                                expires: -1
                            }, !(i.expires && i.expires <= n)) return i.data;
                        a.removeAttribute(e)
                    } else null === f ? a.removeAttribute(e) : (j = a.getAttribute(e), i = JSON.stringify({
                        data: f,
                        expires: g.expires ? n + g.expires : null
                    }), a.setAttribute(e, i));
                    try {
                        a.save(c)
                    } catch (o) {
                        null === j ? a.removeAttribute(e) : a.setAttribute(e, j), d.userData();
                        try {
                            a.setAttribute(e, i), a.save(c)
                        } catch (o) {
                            throw null === j ? a.removeAttribute(e) : a.setAttribute(e, j), d.error()
                        }
                    }
                    return m
                })
            }
        }(),
        function() {
            function a(a) {
                return a === b ? b : JSON.parse(JSON.stringify(a))
            }
            var c = {},
                e = {};
            d.addType("memory", function(d, f, g) {
                return d ? f === b ? a(c[d]) : (e[d] && (clearTimeout(e[d]), delete e[d]), null === f ? (delete c[d], null) : (c[d] = f, g.expires && (e[d] = setTimeout(function() {
                    delete c[d], delete e[d]
                }, g.expires)), f)) : a(c)
            })
        }()
}(this.amplify = this.amplify || {}),
function(a, b) {
    "use strict";

    function c() {}

    function d(a) {
        return "[object Function]" === {}.toString.call(a)
    }

    function e(a) {
        var b = !1;
        return setTimeout(function() {
                b = !0
            }, 1),
            function() {
                var c = this,
                    d = arguments;
                b ? a.apply(c, d) : setTimeout(function() {
                    a.apply(c, d)
                }, 1)
            }
    }
    a.request = function(b, f, g) {
        var h = b || {};
        "string" == typeof h && (d(f) && (g = f, f = {}), h = {
            resourceId: b,
            data: f || {},
            success: g
        });
        var i = {
                abort: c
            },
            j = a.request.resources[h.resourceId],
            k = h.success || c,
            l = h.error || c;
        if (h.success = e(function(b, c) {
                c = c || "success", a.publish("request.success", h, b, c), a.publish("request.complete", h, b, c), k(b, c)
            }), h.error = e(function(b, c) {
                c = c || "error", a.publish("request.error", h, b, c), a.publish("request.complete", h, b, c), l(b, c)
            }), !j) {
            if (!h.resourceId) throw "amplify.request: no resourceId provided";
            throw "amplify.request: unknown resourceId: " + h.resourceId
        }
        return a.publish("request.before", h) ? (a.request.resources[h.resourceId](h, i), i) : void h.error(null, "abort")
    }, a.request.types = {}, a.request.resources = {}, a.request.define = function(b, c, d) {
        if ("string" == typeof c) {
            if (!(c in a.request.types)) throw "amplify.request.define: unknown type: " + c;
            d.resourceId = b, a.request.resources[b] = a.request.types[c](d)
        } else a.request.resources[b] = c
    }
}(amplify),
function(a, b, c) {
    "use strict";
    var d = ["status", "statusText", "responseText", "responseXML", "readyState"],
        e = /\{([^\}]+)\}/g;
    a.request.types.ajax = function(e) {
        return e = b.extend({
                type: "GET"
            }, e),
            function(f, g) {
                var h, i, j = (e.url, g.abort),
                    k = b.extend(!0, {}, e, {
                        data: f.data
                    }),
                    l = !1,
                    m = {
                        readyState: 0,
                        setRequestHeader: function(a, b) {
                            return h.setRequestHeader(a, b)
                        },
                        getAllResponseHeaders: function() {
                            return h.getAllResponseHeaders()
                        },
                        getResponseHeader: function(a) {
                            return h.getResponseHeader(a)
                        },
                        overrideMimeType: function(a) {
                            return h.overrideMimeType(a)
                        },
                        abort: function() {
                            l = !0;
                            try {
                                h.abort()
                            } catch (a) {}
                            i(null, "abort")
                        },
                        success: function(a, b) {
                            f.success(a, b)
                        },
                        error: function(a, b) {
                            f.error(a, b)
                        }
                    };
                i = function(a, e) {
                    b.each(d, function(a, b) {
                        try {
                            m[b] = h[b]
                        } catch (c) {}
                    }), /OK$/.test(m.statusText) && (m.statusText = "success"), a === c && (a = null), l && (e = "abort"), /timeout|error|abort/.test(e) ? m.error(a, e) : m.success(a, e), i = b.noop
                }, a.publish("request.ajax.preprocess", e, f, k, m), b.extend(k, {
                    isJSONP: function() {
                        return /jsonp/gi.test(this.dataType)
                    },
                    cacheURL: function() {
                        if (!this.isJSONP()) return this.url;
                        var a = "callback";
                        this.hasOwnProperty("jsonp") && (this.jsonp !== !1 ? a = this.jsonp : this.hasOwnProperty("jsonpCallback") && (a = this.jsonpCallback));
                        var b = new RegExp("&?" + a + "=[^&]*&?", "gi");
                        return this.url.replace(b, "")
                    },
                    success: function(a, b) {
                        i(a, b)
                    },
                    error: function(a, b) {
                        i(null, b)
                    },
                    beforeSend: function(b, c) {
                        h = b, k = c;
                        var d = e.beforeSend ? e.beforeSend.call(this, m, k) : !0;
                        return d && a.publish("request.before.ajax", e, f, k, m)
                    }
                }), k.cache && k.isJSONP() && b.extend(k, {
                    cache: !0
                }), b.ajax(k), g.abort = function() {
                    m.abort(), j.call(this)
                }
            }
    }, a.subscribe("request.ajax.preprocess", function(a, c, d) {
        var f = [],
            g = d.data;
        "string" != typeof g && (g = b.extend(!0, {}, a.data, g), d.url = d.url.replace(e, function(a, b) {
            return b in g ? (f.push(b), g[b]) : void 0
        }), b.each(f, function(a, b) {
            delete g[b]
        }), d.data = g)
    }), a.subscribe("request.ajax.preprocess", function(a, c, d) {
        var e = d.data,
            f = a.dataMap;
        f && "string" != typeof e && (b.isFunction(f) ? d.data = f(e) : (b.each(a.dataMap, function(a, b) {
            a in e && (e[b] = e[a], delete e[a])
        }), d.data = e))
    });
    var f = a.request.cache = {
        _key: function(a, b, c) {
            function d() {
                return c.charCodeAt(f++) << 24 | c.charCodeAt(f++) << 16 | c.charCodeAt(f++) << 8 | c.charCodeAt(f++) << 0
            }
            c = b + c;
            for (var e = c.length, f = 0, g = d(); e > f;) g ^= d();
            return "request-" + a + "-" + g
        },
        _default: function() {
            var a = {};
            return function(b, c, d, e) {
                var g = f._key(c.resourceId, d.cacheURL(), d.data),
                    h = b.cache;
                if (g in a) return e.success(a[g]), !1;
                var i = e.success;
                e.success = function(b) {
                    a[g] = b, "number" == typeof h && setTimeout(function() {
                        delete a[g]
                    }, h), i.apply(this, arguments)
                }
            }
        }()
    };
    a.store && (b.each(a.store.types, function(b) {
        f[b] = function(c, d, e, g) {
            var h = f._key(d.resourceId, e.cacheURL(), e.data),
                i = a.store[b](h);
            if (i) return e.success(i), !1;
            var j = g.success;
            g.success = function(d) {
                a.store[b](h, d, {
                    expires: c.cache.expires
                }), j.apply(this, arguments)
            }
        }
    }), f.persist = f[a.store.type]), a.subscribe("request.before.ajax", function(a) {
        var b = a.cache;
        return b ? (b = b.type || b, f[b in f ? b : "_default"].apply(this, arguments)) : void 0
    }), a.request.decoders = {
        jsend: function(a, b, c, d, e) {
            "success" === a.status ? d(a.data) : "fail" === a.status ? e(a.data, "fail") : "error" === a.status ? (delete a.status, e(a, "error")) : e(null, "error")
        }
    }, a.subscribe("request.before.ajax", function(c, d, e, f) {
        function g(a, b) {
            i(a, b)
        }

        function h(a, b) {
            j(a, b)
        }
        var i = f.success,
            j = f.error,
            k = b.isFunction(c.decoder) ? c.decoder : c.decoder in a.request.decoders ? a.request.decoders[c.decoder] : a.request.decoders._default;
        k && (f.success = function(a, b) {
            k(a, b, f, g, h)
        }, f.error = function(a, b) {
            k(a, b, f, g, h)
        })
    })
}(amplify, jQuery);
var Handlebars = function() {
    var a = function() {
            "use strict";

            function a(a) {
                this.string = a
            }
            var b;
            return a.prototype.toString = function() {
                return "" + this.string
            }, b = a
        }(),
        b = function(a) {
            "use strict";

            function b(a) {
                return h[a] || "&amp;"
            }

            function c(a, b) {
                for (var c in b) Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c])
            }

            function d(a) {
                return a instanceof g ? a.toString() : a || 0 === a ? (a = "" + a, j.test(a) ? a.replace(i, b) : a) : ""
            }

            function e(a) {
                return a || 0 === a ? m(a) && 0 === a.length ? !0 : !1 : !0
            }
            var f = {},
                g = a,
                h = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#x27;",
                    "`": "&#x60;"
                },
                i = /[&<>"'`]/g,
                j = /[&<>"'`]/;
            f.extend = c;
            var k = Object.prototype.toString;
            f.toString = k;
            var l = function(a) {
                return "function" == typeof a
            };
            l(/x/) && (l = function(a) {
                return "function" == typeof a && "[object Function]" === k.call(a)
            });
            var l;
            f.isFunction = l;
            var m = Array.isArray || function(a) {
                return a && "object" == typeof a ? "[object Array]" === k.call(a) : !1
            };
            return f.isArray = m, f.escapeExpression = d, f.isEmpty = e, f
        }(a),
        c = function() {
            "use strict";

            function a(a, b) {
                var d;
                b && b.firstLine && (d = b.firstLine, a += " - " + d + ":" + b.firstColumn);
                for (var e = Error.prototype.constructor.call(this, a), f = 0; f < c.length; f++) this[c[f]] = e[c[f]];
                d && (this.lineNumber = d, this.column = b.firstColumn)
            }
            var b, c = ["description", "fileName", "lineNumber", "message", "name", "number", "stack"];
            return a.prototype = new Error, b = a
        }(),
        d = function(a, b) {
            "use strict";

            function c(a, b) {
                this.helpers = a || {}, this.partials = b || {}, d(this)
            }

            function d(a) {
                a.registerHelper("helperMissing", function(a) {
                    if (2 === arguments.length) return void 0;
                    throw new h("Missing helper: '" + a + "'")
                }), a.registerHelper("blockHelperMissing", function(b, c) {
                    var d = c.inverse || function() {},
                        e = c.fn;
                    return m(b) && (b = b.call(this)), b === !0 ? e(this) : b === !1 || null == b ? d(this) : l(b) ? b.length > 0 ? a.helpers.each(b, c) : d(this) : e(b)
                }), a.registerHelper("each", function(a, b) {
                    var c, d = b.fn,
                        e = b.inverse,
                        f = 0,
                        g = "";
                    if (m(a) && (a = a.call(this)), b.data && (c = q(b.data)), a && "object" == typeof a)
                        if (l(a))
                            for (var h = a.length; h > f; f++) c && (c.index = f, c.first = 0 === f, c.last = f === a.length - 1), g += d(a[f], {
                                data: c
                            });
                        else
                            for (var i in a) a.hasOwnProperty(i) && (c && (c.key = i, c.index = f, c.first = 0 === f), g += d(a[i], {
                                data: c
                            }), f++);
                    return 0 === f && (g = e(this)), g
                }), a.registerHelper("if", function(a, b) {
                    return m(a) && (a = a.call(this)), !b.hash.includeZero && !a || g.isEmpty(a) ? b.inverse(this) : b.fn(this)
                }), a.registerHelper("unless", function(b, c) {
                    return a.helpers["if"].call(this, b, {
                        fn: c.inverse,
                        inverse: c.fn,
                        hash: c.hash
                    })
                }), a.registerHelper("with", function(a, b) {
                    return m(a) && (a = a.call(this)), g.isEmpty(a) ? void 0 : b.fn(a)
                }), a.registerHelper("log", function(b, c) {
                    var d = c.data && null != c.data.level ? parseInt(c.data.level, 10) : 1;
                    a.log(d, b)
                })
            }

            function e(a, b) {
                p.log(a, b)
            }
            var f = {},
                g = a,
                h = b,
                i = "1.3.0";
            f.VERSION = i;
            var j = 4;
            f.COMPILER_REVISION = j;
            var k = {
                1: "<= 1.0.rc.2",
                2: "== 1.0.0-rc.3",
                3: "== 1.0.0-rc.4",
                4: ">= 1.0.0"
            };
            f.REVISION_CHANGES = k;
            var l = g.isArray,
                m = g.isFunction,
                n = g.toString,
                o = "[object Object]";
            f.HandlebarsEnvironment = c, c.prototype = {
                constructor: c,
                logger: p,
                log: e,
                registerHelper: function(a, b, c) {
                    if (n.call(a) === o) {
                        if (c || b) throw new h("Arg not supported with multiple helpers");
                        g.extend(this.helpers, a)
                    } else c && (b.not = c), this.helpers[a] = b
                },
                registerPartial: function(a, b) {
                    n.call(a) === o ? g.extend(this.partials, a) : this.partials[a] = b
                }
            };
            var p = {
                methodMap: {
                    0: "debug",
                    1: "info",
                    2: "warn",
                    3: "error"
                },
                DEBUG: 0,
                INFO: 1,
                WARN: 2,
                ERROR: 3,
                level: 3,
                log: function(a, b) {
                    if (p.level <= a) {
                        var c = p.methodMap[a];
                        "undefined" != typeof console && console[c] && console[c].call(console, b)
                    }
                }
            };
            f.logger = p, f.log = e;
            var q = function(a) {
                var b = {};
                return g.extend(b, a), b
            };
            return f.createFrame = q, f
        }(b, c),
        e = function(a, b, c) {
            "use strict";

            function d(a) {
                var b = a && a[0] || 1,
                    c = m;
                if (b !== c) {
                    if (c > b) {
                        var d = n[c],
                            e = n[b];
                        throw new l("Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version (" + d + ") or downgrade your runtime to an older version (" + e + ").")
                    }
                    throw new l("Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version (" + a[1] + ").")
                }
            }

            function e(a, b) {
                if (!b) throw new l("No environment passed to template");
                var c = function(a, c, d, e, f, g) {
                        var h = b.VM.invokePartial.apply(this, arguments);
                        if (null != h) return h;
                        if (b.compile) {
                            var i = {
                                helpers: e,
                                partials: f,
                                data: g
                            };
                            return f[c] = b.compile(a, {
                                data: void 0 !== g
                            }, b), f[c](d, i)
                        }
                        throw new l("The partial " + c + " could not be compiled when running in runtime-only mode")
                    },
                    d = {
                        escapeExpression: k.escapeExpression,
                        invokePartial: c,
                        programs: [],
                        program: function(a, b, c) {
                            var d = this.programs[a];
                            return c ? d = g(a, b, c) : d || (d = this.programs[a] = g(a, b)), d
                        },
                        merge: function(a, b) {
                            var c = a || b;
                            return a && b && a !== b && (c = {}, k.extend(c, b), k.extend(c, a)), c
                        },
                        programWithDepth: b.VM.programWithDepth,
                        noop: b.VM.noop,
                        compilerInfo: null
                    };
                return function(c, e) {
                    e = e || {};
                    var f, g, h = e.partial ? e : b;
                    e.partial || (f = e.helpers, g = e.partials);
                    var i = a.call(d, h, c, f, g, e.data);
                    return e.partial || b.VM.checkRevision(d.compilerInfo), i
                }
            }

            function f(a, b, c) {
                var d = Array.prototype.slice.call(arguments, 3),
                    e = function(a, e) {
                        return e = e || {}, b.apply(this, [a, e.data || c].concat(d))
                    };
                return e.program = a, e.depth = d.length, e
            }

            function g(a, b, c) {
                var d = function(a, d) {
                    return d = d || {}, b(a, d.data || c)
                };
                return d.program = a, d.depth = 0, d
            }

            function h(a, b, c, d, e, f) {
                var g = {
                    partial: !0,
                    helpers: d,
                    partials: e,
                    data: f
                };
                if (void 0 === a) throw new l("The partial " + b + " could not be found");
                return a instanceof Function ? a(c, g) : void 0
            }

            function i() {
                return ""
            }
            var j = {},
                k = a,
                l = b,
                m = c.COMPILER_REVISION,
                n = c.REVISION_CHANGES;
            return j.checkRevision = d, j.template = e, j.programWithDepth = f, j.program = g, j.invokePartial = h, j.noop = i, j
        }(b, c, d),
        f = function(a, b, c, d, e) {
            "use strict";
            var f, g = a,
                h = b,
                i = c,
                j = d,
                k = e,
                l = function() {
                    var a = new g.HandlebarsEnvironment;
                    return j.extend(a, g), a.SafeString = h, a.Exception = i, a.Utils = j, a.VM = k, a.template = function(b) {
                        return k.template(b, a)
                    }, a
                },
                m = l();
            return m.create = l, f = m
        }(d, a, c, b, e),
        g = function(a) {
            "use strict";

            function b(a) {
                a = a || {}, this.firstLine = a.first_line, this.firstColumn = a.first_column, this.lastColumn = a.last_column, this.lastLine = a.last_line
            }
            var c, d = a,
                e = {
                    ProgramNode: function(a, c, d, f) {
                        var g, h;
                        3 === arguments.length ? (f = d, d = null) : 2 === arguments.length && (f = c, c = null), b.call(this, f), this.type = "program", this.statements = a, this.strip = {}, d ? (h = d[0], h ? (g = {
                            first_line: h.firstLine,
                            last_line: h.lastLine,
                            last_column: h.lastColumn,
                            first_column: h.firstColumn
                        }, this.inverse = new e.ProgramNode(d, c, g)) : this.inverse = new e.ProgramNode(d, c), this.strip.right = c.left) : c && (this.strip.left = c.right)
                    },
                    MustacheNode: function(a, c, d, f, g) {
                        if (b.call(this, g), this.type = "mustache", this.strip = f, null != d && d.charAt) {
                            var h = d.charAt(3) || d.charAt(2);
                            this.escaped = "{" !== h && "&" !== h
                        } else this.escaped = !!d;
                        a instanceof e.SexprNode ? this.sexpr = a : this.sexpr = new e.SexprNode(a, c), this.sexpr.isRoot = !0, this.id = this.sexpr.id, this.params = this.sexpr.params, this.hash = this.sexpr.hash, this.eligibleHelper = this.sexpr.eligibleHelper, this.isHelper = this.sexpr.isHelper
                    },
                    SexprNode: function(a, c, d) {
                        b.call(this, d), this.type = "sexpr", this.hash = c;
                        var e = this.id = a[0],
                            f = this.params = a.slice(1),
                            g = this.eligibleHelper = e.isSimple;
                        this.isHelper = g && (f.length || c)
                    },
                    PartialNode: function(a, c, d, e) {
                        b.call(this, e), this.type = "partial", this.partialName = a, this.context = c, this.strip = d
                    },
                    BlockNode: function(a, c, e, f, g) {
                        if (b.call(this, g), a.sexpr.id.original !== f.path.original) throw new d(a.sexpr.id.original + " doesn't match " + f.path.original, this);
                        this.type = "block", this.mustache = a, this.program = c, this.inverse = e, this.strip = {
                            left: a.strip.left,
                            right: f.strip.right
                        }, (c || e).strip.left = a.strip.right, (e || c).strip.right = f.strip.left, e && !c && (this.isInverse = !0)
                    },
                    ContentNode: function(a, c) {
                        b.call(this, c), this.type = "content", this.string = a
                    },
                    HashNode: function(a, c) {
                        b.call(this, c), this.type = "hash", this.pairs = a
                    },
                    IdNode: function(a, c) {
                        b.call(this, c), this.type = "ID";
                        for (var e = "", f = [], g = 0, h = 0, i = a.length; i > h; h++) {
                            var j = a[h].part;
                            if (e += (a[h].separator || "") + j, ".." === j || "." === j || "this" === j) {
                                if (f.length > 0) throw new d("Invalid path: " + e, this);
                                ".." === j ? g++ : this.isScoped = !0
                            } else f.push(j)
                        }
                        this.original = e, this.parts = f, this.string = f.join("."), this.depth = g, this.isSimple = 1 === a.length && !this.isScoped && 0 === g, this.stringModeValue = this.string
                    },
                    PartialNameNode: function(a, c) {
                        b.call(this, c), this.type = "PARTIAL_NAME", this.name = a.original
                    },
                    DataNode: function(a, c) {
                        b.call(this, c), this.type = "DATA", this.id = a
                    },
                    StringNode: function(a, c) {
                        b.call(this, c), this.type = "STRING", this.original = this.string = this.stringModeValue = a
                    },
                    IntegerNode: function(a, c) {
                        b.call(this, c), this.type = "INTEGER", this.original = this.integer = a, this.stringModeValue = Number(a)
                    },
                    BooleanNode: function(a, c) {
                        b.call(this, c), this.type = "BOOLEAN", this.bool = a, this.stringModeValue = "true" === a
                    },
                    CommentNode: function(a, c) {
                        b.call(this, c), this.type = "comment", this.comment = a
                    }
                };
            return c = e
        }(c),
        h = function() {
            "use strict";
            var a, b = function() {
                function a(a, b) {
                    return {
                        left: "~" === a.charAt(2),
                        right: "~" === b.charAt(0) || "~" === b.charAt(1)
                    }
                }

                function b() {
                    this.yy = {}
                }
                var c = {
                        trace: function() {},
                        yy: {},
                        symbols_: {
                            error: 2,
                            root: 3,
                            statements: 4,
                            EOF: 5,
                            program: 6,
                            simpleInverse: 7,
                            statement: 8,
                            openInverse: 9,
                            closeBlock: 10,
                            openBlock: 11,
                            mustache: 12,
                            partial: 13,
                            CONTENT: 14,
                            COMMENT: 15,
                            OPEN_BLOCK: 16,
                            sexpr: 17,
                            CLOSE: 18,
                            OPEN_INVERSE: 19,
                            OPEN_ENDBLOCK: 20,
                            path: 21,
                            OPEN: 22,
                            OPEN_UNESCAPED: 23,
                            CLOSE_UNESCAPED: 24,
                            OPEN_PARTIAL: 25,
                            partialName: 26,
                            partial_option0: 27,
                            sexpr_repetition0: 28,
                            sexpr_option0: 29,
                            dataName: 30,
                            param: 31,
                            STRING: 32,
                            INTEGER: 33,
                            BOOLEAN: 34,
                            OPEN_SEXPR: 35,
                            CLOSE_SEXPR: 36,
                            hash: 37,
                            hash_repetition_plus0: 38,
                            hashSegment: 39,
                            ID: 40,
                            EQUALS: 41,
                            DATA: 42,
                            pathSegments: 43,
                            SEP: 44,
                            $accept: 0,
                            $end: 1
                        },
                        terminals_: {
                            2: "error",
                            5: "EOF",
                            14: "CONTENT",
                            15: "COMMENT",
                            16: "OPEN_BLOCK",
                            18: "CLOSE",
                            19: "OPEN_INVERSE",
                            20: "OPEN_ENDBLOCK",
                            22: "OPEN",
                            23: "OPEN_UNESCAPED",
                            24: "CLOSE_UNESCAPED",
                            25: "OPEN_PARTIAL",
                            32: "STRING",
                            33: "INTEGER",
                            34: "BOOLEAN",
                            35: "OPEN_SEXPR",
                            36: "CLOSE_SEXPR",
                            40: "ID",
                            41: "EQUALS",
                            42: "DATA",
                            44: "SEP"
                        },
                        productions_: [0, [3, 2],
                            [3, 1],
                            [6, 2],
                            [6, 3],
                            [6, 2],
                            [6, 1],
                            [6, 1],
                            [6, 0],
                            [4, 1],
                            [4, 2],
                            [8, 3],
                            [8, 3],
                            [8, 1],
                            [8, 1],
                            [8, 1],
                            [8, 1],
                            [11, 3],
                            [9, 3],
                            [10, 3],
                            [12, 3],
                            [12, 3],
                            [13, 4],
                            [7, 2],
                            [17, 3],
                            [17, 1],
                            [31, 1],
                            [31, 1],
                            [31, 1],
                            [31, 1],
                            [31, 1],
                            [31, 3],
                            [37, 1],
                            [39, 3],
                            [26, 1],
                            [26, 1],
                            [26, 1],
                            [30, 2],
                            [21, 1],
                            [43, 3],
                            [43, 1],
                            [27, 0],
                            [27, 1],
                            [28, 0],
                            [28, 2],
                            [29, 0],
                            [29, 1],
                            [38, 1],
                            [38, 2]
                        ],
                        performAction: function(b, c, d, e, f, g, h) {
                            var i = g.length - 1;
                            switch (f) {
                                case 1:
                                    return new e.ProgramNode(g[i - 1], this._$);
                                case 2:
                                    return new e.ProgramNode([], this._$);
                                case 3:
                                    this.$ = new e.ProgramNode([], g[i - 1], g[i], this._$);
                                    break;
                                case 4:
                                    this.$ = new e.ProgramNode(g[i - 2], g[i - 1], g[i], this._$);
                                    break;
                                case 5:
                                    this.$ = new e.ProgramNode(g[i - 1], g[i], [], this._$);
                                    break;
                                case 6:
                                    this.$ = new e.ProgramNode(g[i], this._$);
                                    break;
                                case 7:
                                    this.$ = new e.ProgramNode([], this._$);
                                    break;
                                case 8:
                                    this.$ = new e.ProgramNode([], this._$);
                                    break;
                                case 9:
                                    this.$ = [g[i]];
                                    break;
                                case 10:
                                    g[i - 1].push(g[i]), this.$ = g[i - 1];
                                    break;
                                case 11:
                                    this.$ = new e.BlockNode(g[i - 2], g[i - 1].inverse, g[i - 1], g[i], this._$);
                                    break;
                                case 12:
                                    this.$ = new e.BlockNode(g[i - 2], g[i - 1], g[i - 1].inverse, g[i], this._$);
                                    break;
                                case 13:
                                    this.$ = g[i];
                                    break;
                                case 14:
                                    this.$ = g[i];
                                    break;
                                case 15:
                                    this.$ = new e.ContentNode(g[i], this._$);
                                    break;
                                case 16:
                                    this.$ = new e.CommentNode(g[i], this._$);
                                    break;
                                case 17:
                                    this.$ = new e.MustacheNode(g[i - 1], null, g[i - 2], a(g[i - 2], g[i]), this._$);
                                    break;
                                case 18:
                                    this.$ = new e.MustacheNode(g[i - 1], null, g[i - 2], a(g[i - 2], g[i]), this._$);
                                    break;
                                case 19:
                                    this.$ = {
                                        path: g[i - 1],
                                        strip: a(g[i - 2], g[i])
                                    };
                                    break;
                                case 20:
                                    this.$ = new e.MustacheNode(g[i - 1], null, g[i - 2], a(g[i - 2], g[i]), this._$);
                                    break;
                                case 21:
                                    this.$ = new e.MustacheNode(g[i - 1], null, g[i - 2], a(g[i - 2], g[i]), this._$);
                                    break;
                                case 22:
                                    this.$ = new e.PartialNode(g[i - 2], g[i - 1], a(g[i - 3], g[i]), this._$);
                                    break;
                                case 23:
                                    this.$ = a(g[i - 1], g[i]);
                                    break;
                                case 24:
                                    this.$ = new e.SexprNode([g[i - 2]].concat(g[i - 1]), g[i], this._$);
                                    break;
                                case 25:
                                    this.$ = new e.SexprNode([g[i]], null, this._$);
                                    break;
                                case 26:
                                    this.$ = g[i];
                                    break;
                                case 27:
                                    this.$ = new e.StringNode(g[i], this._$);
                                    break;
                                case 28:
                                    this.$ = new e.IntegerNode(g[i], this._$);
                                    break;
                                case 29:
                                    this.$ = new e.BooleanNode(g[i], this._$);
                                    break;
                                case 30:
                                    this.$ = g[i];
                                    break;
                                case 31:
                                    g[i - 1].isHelper = !0, this.$ = g[i - 1];
                                    break;
                                case 32:
                                    this.$ = new e.HashNode(g[i], this._$);
                                    break;
                                case 33:
                                    this.$ = [g[i - 2], g[i]];
                                    break;
                                case 34:
                                    this.$ = new e.PartialNameNode(g[i], this._$);
                                    break;
                                case 35:
                                    this.$ = new e.PartialNameNode(new e.StringNode(g[i], this._$), this._$);
                                    break;
                                case 36:
                                    this.$ = new e.PartialNameNode(new e.IntegerNode(g[i], this._$));
                                    break;
                                case 37:
                                    this.$ = new e.DataNode(g[i], this._$);
                                    break;
                                case 38:
                                    this.$ = new e.IdNode(g[i], this._$);
                                    break;
                                case 39:
                                    g[i - 2].push({
                                        part: g[i],
                                        separator: g[i - 1]
                                    }), this.$ = g[i - 2];
                                    break;
                                case 40:
                                    this.$ = [{
                                        part: g[i]
                                    }];
                                    break;
                                case 43:
                                    this.$ = [];
                                    break;
                                case 44:
                                    g[i - 1].push(g[i]);
                                    break;
                                case 47:
                                    this.$ = [g[i]];
                                    break;
                                case 48:
                                    g[i - 1].push(g[i])
                            }
                        },
                        table: [{
                            3: 1,
                            4: 2,
                            5: [1, 3],
                            8: 4,
                            9: 5,
                            11: 6,
                            12: 7,
                            13: 8,
                            14: [1, 9],
                            15: [1, 10],
                            16: [1, 12],
                            19: [1, 11],
                            22: [1, 13],
                            23: [1, 14],
                            25: [1, 15]
                        }, {
                            1: [3]
                        }, {
                            5: [1, 16],
                            8: 17,
                            9: 5,
                            11: 6,
                            12: 7,
                            13: 8,
                            14: [1, 9],
                            15: [1, 10],
                            16: [1, 12],
                            19: [1, 11],
                            22: [1, 13],
                            23: [1, 14],
                            25: [1, 15]
                        }, {
                            1: [2, 2]
                        }, {
                            5: [2, 9],
                            14: [2, 9],
                            15: [2, 9],
                            16: [2, 9],
                            19: [2, 9],
                            20: [2, 9],
                            22: [2, 9],
                            23: [2, 9],
                            25: [2, 9]
                        }, {
                            4: 20,
                            6: 18,
                            7: 19,
                            8: 4,
                            9: 5,
                            11: 6,
                            12: 7,
                            13: 8,
                            14: [1, 9],
                            15: [1, 10],
                            16: [1, 12],
                            19: [1, 21],
                            20: [2, 8],
                            22: [1, 13],
                            23: [1, 14],
                            25: [1, 15]
                        }, {
                            4: 20,
                            6: 22,
                            7: 19,
                            8: 4,
                            9: 5,
                            11: 6,
                            12: 7,
                            13: 8,
                            14: [1, 9],
                            15: [1, 10],
                            16: [1, 12],
                            19: [1, 21],
                            20: [2, 8],
                            22: [1, 13],
                            23: [1, 14],
                            25: [1, 15]
                        }, {
                            5: [2, 13],
                            14: [2, 13],
                            15: [2, 13],
                            16: [2, 13],
                            19: [2, 13],
                            20: [2, 13],
                            22: [2, 13],
                            23: [2, 13],
                            25: [2, 13]
                        }, {
                            5: [2, 14],
                            14: [2, 14],
                            15: [2, 14],
                            16: [2, 14],
                            19: [2, 14],
                            20: [2, 14],
                            22: [2, 14],
                            23: [2, 14],
                            25: [2, 14]
                        }, {
                            5: [2, 15],
                            14: [2, 15],
                            15: [2, 15],
                            16: [2, 15],
                            19: [2, 15],
                            20: [2, 15],
                            22: [2, 15],
                            23: [2, 15],
                            25: [2, 15]
                        }, {
                            5: [2, 16],
                            14: [2, 16],
                            15: [2, 16],
                            16: [2, 16],
                            19: [2, 16],
                            20: [2, 16],
                            22: [2, 16],
                            23: [2, 16],
                            25: [2, 16]
                        }, {
                            17: 23,
                            21: 24,
                            30: 25,
                            40: [1, 28],
                            42: [1, 27],
                            43: 26
                        }, {
                            17: 29,
                            21: 24,
                            30: 25,
                            40: [1, 28],
                            42: [1, 27],
                            43: 26
                        }, {
                            17: 30,
                            21: 24,
                            30: 25,
                            40: [1, 28],
                            42: [1, 27],
                            43: 26
                        }, {
                            17: 31,
                            21: 24,
                            30: 25,
                            40: [1, 28],
                            42: [1, 27],
                            43: 26
                        }, {
                            21: 33,
                            26: 32,
                            32: [1, 34],
                            33: [1, 35],
                            40: [1, 28],
                            43: 26
                        }, {
                            1: [2, 1]
                        }, {
                            5: [2, 10],
                            14: [2, 10],
                            15: [2, 10],
                            16: [2, 10],
                            19: [2, 10],
                            20: [2, 10],
                            22: [2, 10],
                            23: [2, 10],
                            25: [2, 10]
                        }, {
                            10: 36,
                            20: [1, 37]
                        }, {
                            4: 38,
                            8: 4,
                            9: 5,
                            11: 6,
                            12: 7,
                            13: 8,
                            14: [1, 9],
                            15: [1, 10],
                            16: [1, 12],
                            19: [1, 11],
                            20: [2, 7],
                            22: [1, 13],
                            23: [1, 14],
                            25: [1, 15]
                        }, {
                            7: 39,
                            8: 17,
                            9: 5,
                            11: 6,
                            12: 7,
                            13: 8,
                            14: [1, 9],
                            15: [1, 10],
                            16: [1, 12],
                            19: [1, 21],
                            20: [2, 6],
                            22: [1, 13],
                            23: [1, 14],
                            25: [1, 15]
                        }, {
                            17: 23,
                            18: [1, 40],
                            21: 24,
                            30: 25,
                            40: [1, 28],
                            42: [1, 27],
                            43: 26
                        }, {
                            10: 41,
                            20: [1, 37]
                        }, {
                            18: [1, 42]
                        }, {
                            18: [2, 43],
                            24: [2, 43],
                            28: 43,
                            32: [2, 43],
                            33: [2, 43],
                            34: [2, 43],
                            35: [2, 43],
                            36: [2, 43],
                            40: [2, 43],
                            42: [2, 43]
                        }, {
                            18: [2, 25],
                            24: [2, 25],
                            36: [2, 25]
                        }, {
                            18: [2, 38],
                            24: [2, 38],
                            32: [2, 38],
                            33: [2, 38],
                            34: [2, 38],
                            35: [2, 38],
                            36: [2, 38],
                            40: [2, 38],
                            42: [2, 38],
                            44: [1, 44]
                        }, {
                            21: 45,
                            40: [1, 28],
                            43: 26
                        }, {
                            18: [2, 40],
                            24: [2, 40],
                            32: [2, 40],
                            33: [2, 40],
                            34: [2, 40],
                            35: [2, 40],
                            36: [2, 40],
                            40: [2, 40],
                            42: [2, 40],
                            44: [2, 40]
                        }, {
                            18: [1, 46]
                        }, {
                            18: [1, 47]
                        }, {
                            24: [1, 48]
                        }, {
                            18: [2, 41],
                            21: 50,
                            27: 49,
                            40: [1, 28],
                            43: 26
                        }, {
                            18: [2, 34],
                            40: [2, 34]
                        }, {
                            18: [2, 35],
                            40: [2, 35]
                        }, {
                            18: [2, 36],
                            40: [2, 36]
                        }, {
                            5: [2, 11],
                            14: [2, 11],
                            15: [2, 11],
                            16: [2, 11],
                            19: [2, 11],
                            20: [2, 11],
                            22: [2, 11],
                            23: [2, 11],
                            25: [2, 11]
                        }, {
                            21: 51,
                            40: [1, 28],
                            43: 26
                        }, {
                            8: 17,
                            9: 5,
                            11: 6,
                            12: 7,
                            13: 8,
                            14: [1, 9],
                            15: [1, 10],
                            16: [1, 12],
                            19: [1, 11],
                            20: [2, 3],
                            22: [1, 13],
                            23: [1, 14],
                            25: [1, 15]
                        }, {
                            4: 52,
                            8: 4,
                            9: 5,
                            11: 6,
                            12: 7,
                            13: 8,
                            14: [1, 9],
                            15: [1, 10],
                            16: [1, 12],
                            19: [1, 11],
                            20: [2, 5],
                            22: [1, 13],
                            23: [1, 14],
                            25: [1, 15]
                        }, {
                            14: [2, 23],
                            15: [2, 23],
                            16: [2, 23],
                            19: [2, 23],
                            20: [2, 23],
                            22: [2, 23],
                            23: [2, 23],
                            25: [2, 23]
                        }, {
                            5: [2, 12],
                            14: [2, 12],
                            15: [2, 12],
                            16: [2, 12],
                            19: [2, 12],
                            20: [2, 12],
                            22: [2, 12],
                            23: [2, 12],
                            25: [2, 12]
                        }, {
                            14: [2, 18],
                            15: [2, 18],
                            16: [2, 18],
                            19: [2, 18],
                            20: [2, 18],
                            22: [2, 18],
                            23: [2, 18],
                            25: [2, 18]
                        }, {
                            18: [2, 45],
                            21: 56,
                            24: [2, 45],
                            29: 53,
                            30: 60,
                            31: 54,
                            32: [1, 57],
                            33: [1, 58],
                            34: [1, 59],
                            35: [1, 61],
                            36: [2, 45],
                            37: 55,
                            38: 62,
                            39: 63,
                            40: [1, 64],
                            42: [1, 27],
                            43: 26
                        }, {
                            40: [1, 65]
                        }, {
                            18: [2, 37],
                            24: [2, 37],
                            32: [2, 37],
                            33: [2, 37],
                            34: [2, 37],
                            35: [2, 37],
                            36: [2, 37],
                            40: [2, 37],
                            42: [2, 37]
                        }, {
                            14: [2, 17],
                            15: [2, 17],
                            16: [2, 17],
                            19: [2, 17],
                            20: [2, 17],
                            22: [2, 17],
                            23: [2, 17],
                            25: [2, 17]
                        }, {
                            5: [2, 20],
                            14: [2, 20],
                            15: [2, 20],
                            16: [2, 20],
                            19: [2, 20],
                            20: [2, 20],
                            22: [2, 20],
                            23: [2, 20],
                            25: [2, 20]
                        }, {
                            5: [2, 21],
                            14: [2, 21],
                            15: [2, 21],
                            16: [2, 21],
                            19: [2, 21],
                            20: [2, 21],
                            22: [2, 21],
                            23: [2, 21],
                            25: [2, 21]
                        }, {
                            18: [1, 66]
                        }, {
                            18: [2, 42]
                        }, {
                            18: [1, 67]
                        }, {
                            8: 17,
                            9: 5,
                            11: 6,
                            12: 7,
                            13: 8,
                            14: [1, 9],
                            15: [1, 10],
                            16: [1, 12],
                            19: [1, 11],
                            20: [2, 4],
                            22: [1, 13],
                            23: [1, 14],
                            25: [1, 15]
                        }, {
                            18: [2, 24],
                            24: [2, 24],
                            36: [2, 24]
                        }, {
                            18: [2, 44],
                            24: [2, 44],
                            32: [2, 44],
                            33: [2, 44],
                            34: [2, 44],
                            35: [2, 44],
                            36: [2, 44],
                            40: [2, 44],
                            42: [2, 44]
                        }, {
                            18: [2, 46],
                            24: [2, 46],
                            36: [2, 46]
                        }, {
                            18: [2, 26],
                            24: [2, 26],
                            32: [2, 26],
                            33: [2, 26],
                            34: [2, 26],
                            35: [2, 26],
                            36: [2, 26],
                            40: [2, 26],
                            42: [2, 26]
                        }, {
                            18: [2, 27],
                            24: [2, 27],
                            32: [2, 27],
                            33: [2, 27],
                            34: [2, 27],
                            35: [2, 27],
                            36: [2, 27],
                            40: [2, 27],
                            42: [2, 27]
                        }, {
                            18: [2, 28],
                            24: [2, 28],
                            32: [2, 28],
                            33: [2, 28],
                            34: [2, 28],
                            35: [2, 28],
                            36: [2, 28],
                            40: [2, 28],
                            42: [2, 28]
                        }, {
                            18: [2, 29],
                            24: [2, 29],
                            32: [2, 29],
                            33: [2, 29],
                            34: [2, 29],
                            35: [2, 29],
                            36: [2, 29],
                            40: [2, 29],
                            42: [2, 29]
                        }, {
                            18: [2, 30],
                            24: [2, 30],
                            32: [2, 30],
                            33: [2, 30],
                            34: [2, 30],
                            35: [2, 30],
                            36: [2, 30],
                            40: [2, 30],
                            42: [2, 30]
                        }, {
                            17: 68,
                            21: 24,
                            30: 25,
                            40: [1, 28],
                            42: [1, 27],
                            43: 26
                        }, {
                            18: [2, 32],
                            24: [2, 32],
                            36: [2, 32],
                            39: 69,
                            40: [1, 70]
                        }, {
                            18: [2, 47],
                            24: [2, 47],
                            36: [2, 47],
                            40: [2, 47]
                        }, {
                            18: [2, 40],
                            24: [2, 40],
                            32: [2, 40],
                            33: [2, 40],
                            34: [2, 40],
                            35: [2, 40],
                            36: [2, 40],
                            40: [2, 40],
                            41: [1, 71],
                            42: [2, 40],
                            44: [2, 40]
                        }, {
                            18: [2, 39],
                            24: [2, 39],
                            32: [2, 39],
                            33: [2, 39],
                            34: [2, 39],
                            35: [2, 39],
                            36: [2, 39],
                            40: [2, 39],
                            42: [2, 39],
                            44: [2, 39]
                        }, {
                            5: [2, 22],
                            14: [2, 22],
                            15: [2, 22],
                            16: [2, 22],
                            19: [2, 22],
                            20: [2, 22],
                            22: [2, 22],
                            23: [2, 22],
                            25: [2, 22]
                        }, {
                            5: [2, 19],
                            14: [2, 19],
                            15: [2, 19],
                            16: [2, 19],
                            19: [2, 19],
                            20: [2, 19],
                            22: [2, 19],
                            23: [2, 19],
                            25: [2, 19]
                        }, {
                            36: [1, 72]
                        }, {
                            18: [2, 48],
                            24: [2, 48],
                            36: [2, 48],
                            40: [2, 48]
                        }, {
                            41: [1, 71]
                        }, {
                            21: 56,
                            30: 60,
                            31: 73,
                            32: [1, 57],
                            33: [1, 58],
                            34: [1, 59],
                            35: [1, 61],
                            40: [1, 28],
                            42: [1, 27],
                            43: 26
                        }, {
                            18: [2, 31],
                            24: [2, 31],
                            32: [2, 31],
                            33: [2, 31],
                            34: [2, 31],
                            35: [2, 31],
                            36: [2, 31],
                            40: [2, 31],
                            42: [2, 31]
                        }, {
                            18: [2, 33],
                            24: [2, 33],
                            36: [2, 33],
                            40: [2, 33]
                        }],
                        defaultActions: {
                            3: [2, 2],
                            16: [2, 1],
                            50: [2, 42]
                        },
                        parseError: function(a, b) {
                            throw new Error(a)
                        },
                        parse: function(a) {
                            function b() {
                                var a;
                                return a = c.lexer.lex() || 1, "number" != typeof a && (a = c.symbols_[a] || a), a
                            }
                            var c = this,
                                d = [0],
                                e = [null],
                                f = [],
                                g = this.table,
                                h = "",
                                i = 0,
                                j = 0,
                                k = 0;
                            this.lexer.setInput(a), this.lexer.yy = this.yy, this.yy.lexer = this.lexer, this.yy.parser = this, "undefined" == typeof this.lexer.yylloc && (this.lexer.yylloc = {});
                            var l = this.lexer.yylloc;
                            f.push(l);
                            var m = this.lexer.options && this.lexer.options.ranges;
                            "function" == typeof this.yy.parseError && (this.parseError = this.yy.parseError);
                            for (var n, o, p, q, r, s, t, u, v, w = {};;) {
                                if (p = d[d.length - 1], this.defaultActions[p] ? q = this.defaultActions[p] : ((null === n || "undefined" == typeof n) && (n = b()), q = g[p] && g[p][n]), "undefined" == typeof q || !q.length || !q[0]) {
                                    var x = "";
                                    if (!k) {
                                        v = [];
                                        for (s in g[p]) this.terminals_[s] && s > 2 && v.push("'" + this.terminals_[s] + "'");
                                        x = this.lexer.showPosition ? "Parse error on line " + (i + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + v.join(", ") + ", got '" + (this.terminals_[n] || n) + "'" : "Parse error on line " + (i + 1) + ": Unexpected " + (1 == n ? "end of input" : "'" + (this.terminals_[n] || n) + "'"), this.parseError(x, {
                                            text: this.lexer.match,
                                            token: this.terminals_[n] || n,
                                            line: this.lexer.yylineno,
                                            loc: l,
                                            expected: v
                                        })
                                    }
                                }
                                if (q[0] instanceof Array && q.length > 1) throw new Error("Parse Error: multiple actions possible at state: " + p + ", token: " + n);
                                switch (q[0]) {
                                    case 1:
                                        d.push(n), e.push(this.lexer.yytext), f.push(this.lexer.yylloc), d.push(q[1]), n = null, o ? (n = o, o = null) : (j = this.lexer.yyleng, h = this.lexer.yytext, i = this.lexer.yylineno, l = this.lexer.yylloc, k > 0 && k--);
                                        break;
                                    case 2:
                                        if (t = this.productions_[q[1]][1], w.$ = e[e.length - t], w._$ = {
                                                first_line: f[f.length - (t || 1)].first_line,
                                                last_line: f[f.length - 1].last_line,
                                                first_column: f[f.length - (t || 1)].first_column,
                                                last_column: f[f.length - 1].last_column
                                            }, m && (w._$.range = [f[f.length - (t || 1)].range[0], f[f.length - 1].range[1]]), r = this.performAction.call(w, h, j, i, this.yy, q[1], e, f), "undefined" != typeof r) return r;
                                        t && (d = d.slice(0, -1 * t * 2), e = e.slice(0, -1 * t), f = f.slice(0, -1 * t)), d.push(this.productions_[q[1]][0]), e.push(w.$), f.push(w._$), u = g[d[d.length - 2]][d[d.length - 1]], d.push(u);
                                        break;
                                    case 3:
                                        return !0
                                }
                            }
                            return !0
                        }
                    },
                    d = function() {
                        var a = {
                            EOF: 1,
                            parseError: function(a, b) {
                                if (!this.yy.parser) throw new Error(a);
                                this.yy.parser.parseError(a, b)
                            },
                            setInput: function(a) {
                                return this._input = a, this._more = this._less = this.done = !1, this.yylineno = this.yyleng = 0, this.yytext = this.matched = this.match = "", this.conditionStack = ["INITIAL"], this.yylloc = {
                                    first_line: 1,
                                    first_column: 0,
                                    last_line: 1,
                                    last_column: 0
                                }, this.options.ranges && (this.yylloc.range = [0, 0]), this.offset = 0, this
                            },
                            input: function() {
                                var a = this._input[0];
                                this.yytext += a, this.yyleng++, this.offset++, this.match += a, this.matched += a;
                                var b = a.match(/(?:\r\n?|\n).*/g);
                                return b ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++, this.options.ranges && this.yylloc.range[1]++, this._input = this._input.slice(1), a
                            },
                            unput: function(a) {
                                var b = a.length,
                                    c = a.split(/(?:\r\n?|\n)/g);
                                this._input = a + this._input, this.yytext = this.yytext.substr(0, this.yytext.length - b - 1), this.offset -= b;
                                var d = this.match.split(/(?:\r\n?|\n)/g);
                                this.match = this.match.substr(0, this.match.length - 1), this.matched = this.matched.substr(0, this.matched.length - 1), c.length - 1 && (this.yylineno -= c.length - 1);
                                var e = this.yylloc.range;
                                return this.yylloc = {
                                    first_line: this.yylloc.first_line,
                                    last_line: this.yylineno + 1,
                                    first_column: this.yylloc.first_column,
                                    last_column: c ? (c.length === d.length ? this.yylloc.first_column : 0) + d[d.length - c.length].length - c[0].length : this.yylloc.first_column - b
                                }, this.options.ranges && (this.yylloc.range = [e[0], e[0] + this.yyleng - b]), this
                            },
                            more: function() {
                                return this._more = !0, this
                            },
                            less: function(a) {
                                this.unput(this.match.slice(a))
                            },
                            pastInput: function() {
                                var a = this.matched.substr(0, this.matched.length - this.match.length);
                                return (a.length > 20 ? "..." : "") + a.substr(-20).replace(/\n/g, "")
                            },
                            upcomingInput: function() {
                                var a = this.match;
                                return a.length < 20 && (a += this._input.substr(0, 20 - a.length)), (a.substr(0, 20) + (a.length > 20 ? "..." : "")).replace(/\n/g, "")
                            },
                            showPosition: function() {
                                var a = this.pastInput(),
                                    b = new Array(a.length + 1).join("-");
                                return a + this.upcomingInput() + "\n" + b + "^"
                            },
                            next: function() {
                                if (this.done) return this.EOF;
                                this._input || (this.done = !0);
                                var a, b, c, d, e;
                                this._more || (this.yytext = "", this.match = "");
                                for (var f = this._currentRules(), g = 0; g < f.length && (c = this._input.match(this.rules[f[g]]), !c || b && !(c[0].length > b[0].length) || (b = c, d = g, this.options.flex)); g++);
                                return b ? (e = b[0].match(/(?:\r\n?|\n).*/g), e && (this.yylineno += e.length), this.yylloc = {
                                    first_line: this.yylloc.last_line,
                                    last_line: this.yylineno + 1,
                                    first_column: this.yylloc.last_column,
                                    last_column: e ? e[e.length - 1].length - e[e.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + b[0].length
                                }, this.yytext += b[0], this.match += b[0], this.matches = b, this.yyleng = this.yytext.length, this.options.ranges && (this.yylloc.range = [this.offset, this.offset += this.yyleng]), this._more = !1, this._input = this._input.slice(b[0].length), this.matched += b[0], a = this.performAction.call(this, this.yy, this, f[d], this.conditionStack[this.conditionStack.length - 1]), this.done && this._input && (this.done = !1), a ? a : void 0) : "" === this._input ? this.EOF : this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
                                    text: "",
                                    token: null,
                                    line: this.yylineno
                                })
                            },
                            lex: function() {
                                var a = this.next();
                                return "undefined" != typeof a ? a : this.lex()
                            },
                            begin: function(a) {
                                this.conditionStack.push(a)
                            },
                            popState: function() {
                                return this.conditionStack.pop()
                            },
                            _currentRules: function() {
                                return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
                            },
                            topState: function() {
                                return this.conditionStack[this.conditionStack.length - 2]
                            },
                            pushState: function(a) {
                                this.begin(a)
                            }
                        };
                        return a.options = {}, a.performAction = function(a, b, c, d) {
                            function e(a, c) {
                                return b.yytext = b.yytext.substr(a, b.yyleng - c)
                            }
                            switch (c) {
                                case 0:
                                    if ("\\\\" === b.yytext.slice(-2) ? (e(0, 1), this.begin("mu")) : "\\" === b.yytext.slice(-1) ? (e(0, 1), this.begin("emu")) : this.begin("mu"), b.yytext) return 14;
                                    break;
                                case 1:
                                    return 14;
                                case 2:
                                    return this.popState(), 14;
                                case 3:
                                    return e(0, 4), this.popState(), 15;
                                case 4:
                                    return 35;
                                case 5:
                                    return 36;
                                case 6:
                                    return 25;
                                case 7:
                                    return 16;
                                case 8:
                                    return 20;
                                case 9:
                                    return 19;
                                case 10:
                                    return 19;
                                case 11:
                                    return 23;
                                case 12:
                                    return 22;
                                case 13:
                                    this.popState(), this.begin("com");
                                    break;
                                case 14:
                                    return e(3, 5), this.popState(), 15;
                                case 15:
                                    return 22;
                                case 16:
                                    return 41;
                                case 17:
                                    return 40;
                                case 18:
                                    return 40;
                                case 19:
                                    return 44;
                                case 20:
                                    break;
                                case 21:
                                    return this.popState(), 24;
                                case 22:
                                    return this.popState(), 18;
                                case 23:
                                    return b.yytext = e(1, 2).replace(/\\"/g, '"'), 32;
                                case 24:
                                    return b.yytext = e(1, 2).replace(/\\'/g, "'"), 32;
                                case 25:
                                    return 42;
                                case 26:
                                    return 34;
                                case 27:
                                    return 34;
                                case 28:
                                    return 33;
                                case 29:
                                    return 40;
                                case 30:
                                    return b.yytext = e(1, 2), 40;
                                case 31:
                                    return "INVALID";
                                case 32:
                                    return 5
                            }
                        }, a.rules = [/^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/, /^(?:[\s\S]*?--\}\})/, /^(?:\()/, /^(?:\))/, /^(?:\{\{(~)?>)/, /^(?:\{\{(~)?#)/, /^(?:\{\{(~)?\/)/, /^(?:\{\{(~)?\^)/, /^(?:\{\{(~)?\s*else\b)/, /^(?:\{\{(~)?\{)/, /^(?:\{\{(~)?&)/, /^(?:\{\{!--)/, /^(?:\{\{![\s\S]*?\}\})/, /^(?:\{\{(~)?)/, /^(?:=)/, /^(?:\.\.)/, /^(?:\.(?=([=~}\s\/.)])))/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}(~)?\}\})/, /^(?:(~)?\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@)/, /^(?:true(?=([~}\s)])))/, /^(?:false(?=([~}\s)])))/, /^(?:-?[0-9]+(?=([~}\s)])))/, /^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)]))))/, /^(?:\[[^\]]*\])/, /^(?:.)/, /^(?:$)/], a.conditions = {
                            mu: {
                                rules: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
                                inclusive: !1
                            },
                            emu: {
                                rules: [2],
                                inclusive: !1
                            },
                            com: {
                                rules: [3],
                                inclusive: !1
                            },
                            INITIAL: {
                                rules: [0, 1, 32],
                                inclusive: !0
                            }
                        }, a
                    }();
                return c.lexer = d, b.prototype = c, c.Parser = b, new b
            }();
            return a = b
        }(),
        i = function(a, b) {
            "use strict";

            function c(a) {
                return a.constructor === f.ProgramNode ? a : (e.yy = f, e.parse(a))
            }
            var d = {},
                e = a,
                f = b;
            return d.parser = e, d.parse = c, d
        }(h, g),
        j = function(a) {
            "use strict";

            function b() {}

            function c(a, b, c) {
                if (null == a || "string" != typeof a && a.constructor !== c.AST.ProgramNode) throw new f("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + a);
                b = b || {}, "data" in b || (b.data = !0);
                var d = c.parse(a),
                    e = (new c.Compiler).compile(d, b);
                return (new c.JavaScriptCompiler).compile(e, b)
            }

            function d(a, b, c) {
                function d() {
                    var d = c.parse(a),
                        e = (new c.Compiler).compile(d, b),
                        f = (new c.JavaScriptCompiler).compile(e, b, void 0, !0);
                    return c.template(f)
                }
                if (null == a || "string" != typeof a && a.constructor !== c.AST.ProgramNode) throw new f("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + a);
                b = b || {}, "data" in b || (b.data = !0);
                var e;
                return function(a, b) {
                    return e || (e = d()), e.call(this, a, b)
                }
            }
            var e = {},
                f = a;
            return e.Compiler = b, b.prototype = {
                compiler: b,
                disassemble: function() {
                    for (var a, b, c, d = this.opcodes, e = [], f = 0, g = d.length; g > f; f++)
                        if (a = d[f], "DECLARE" === a.opcode) e.push("DECLARE " + a.name + "=" + a.value);
                        else {
                            b = [];
                            for (var h = 0; h < a.args.length; h++) c = a.args[h], "string" == typeof c && (c = '"' + c.replace("\n", "\\n") + '"'), b.push(c);
                            e.push(a.opcode + " " + b.join(" "))
                        }
                    return e.join("\n")
                },
                equals: function(a) {
                    var b = this.opcodes.length;
                    if (a.opcodes.length !== b) return !1;
                    for (var c = 0; b > c; c++) {
                        var d = this.opcodes[c],
                            e = a.opcodes[c];
                        if (d.opcode !== e.opcode || d.args.length !== e.args.length) return !1;
                        for (var f = 0; f < d.args.length; f++)
                            if (d.args[f] !== e.args[f]) return !1
                    }
                    if (b = this.children.length, a.children.length !== b) return !1;
                    for (c = 0; b > c; c++)
                        if (!this.children[c].equals(a.children[c])) return !1;
                    return !0
                },
                guid: 0,
                compile: function(a, b) {
                    this.opcodes = [], this.children = [], this.depths = {
                        list: []
                    }, this.options = b;
                    var c = this.options.knownHelpers;
                    if (this.options.knownHelpers = {
                            helperMissing: !0,
                            blockHelperMissing: !0,
                            each: !0,
                            "if": !0,
                            unless: !0,
                            "with": !0,
                            log: !0
                        }, c)
                        for (var d in c) this.options.knownHelpers[d] = c[d];
                    return this.accept(a)
                },
                accept: function(a) {
                    var b, c = a.strip || {};
                    return c.left && this.opcode("strip"), b = this[a.type](a), c.right && this.opcode("strip"), b
                },
                program: function(a) {
                    for (var b = a.statements, c = 0, d = b.length; d > c; c++) this.accept(b[c]);
                    return this.isSimple = 1 === d, this.depths.list = this.depths.list.sort(function(a, b) {
                        return a - b
                    }), this
                },
                compileProgram: function(a) {
                    var b, c = (new this.compiler).compile(a, this.options),
                        d = this.guid++;
                    this.usePartial = this.usePartial || c.usePartial, this.children[d] = c;
                    for (var e = 0, f = c.depths.list.length; f > e; e++) b = c.depths.list[e], 2 > b || this.addDepth(b - 1);
                    return d
                },
                block: function(a) {
                    var b = a.mustache,
                        c = a.program,
                        d = a.inverse;
                    c && (c = this.compileProgram(c)), d && (d = this.compileProgram(d));
                    var e = b.sexpr,
                        f = this.classifySexpr(e);
                    "helper" === f ? this.helperSexpr(e, c, d) : "simple" === f ? (this.simpleSexpr(e), this.opcode("pushProgram", c), this.opcode("pushProgram", d), this.opcode("emptyHash"), this.opcode("blockValue")) : (this.ambiguousSexpr(e, c, d), this.opcode("pushProgram", c), this.opcode("pushProgram", d), this.opcode("emptyHash"), this.opcode("ambiguousBlockValue")), this.opcode("append")
                },
                hash: function(a) {
                    var b, c, d = a.pairs;
                    this.opcode("pushHash");
                    for (var e = 0, f = d.length; f > e; e++) b = d[e], c = b[1], this.options.stringParams ? (c.depth && this.addDepth(c.depth), this.opcode("getContext", c.depth || 0), this.opcode("pushStringParam", c.stringModeValue, c.type), "sexpr" === c.type && this.sexpr(c)) : this.accept(c), this.opcode("assignToHash", b[0]);
                    this.opcode("popHash")
                },
                partial: function(a) {
                    var b = a.partialName;
                    this.usePartial = !0, a.context ? this.ID(a.context) : this.opcode("push", "depth0"), this.opcode("invokePartial", b.name), this.opcode("append")
                },
                content: function(a) {
                    this.opcode("appendContent", a.string)
                },
                mustache: function(a) {
                    this.sexpr(a.sexpr), a.escaped && !this.options.noEscape ? this.opcode("appendEscaped") : this.opcode("append")
                },
                ambiguousSexpr: function(a, b, c) {
                    var d = a.id,
                        e = d.parts[0],
                        f = null != b || null != c;
                    this.opcode("getContext", d.depth), this.opcode("pushProgram", b), this.opcode("pushProgram", c), this.opcode("invokeAmbiguous", e, f)
                },
                simpleSexpr: function(a) {
                    var b = a.id;
                    "DATA" === b.type ? this.DATA(b) : b.parts.length ? this.ID(b) : (this.addDepth(b.depth), this.opcode("getContext", b.depth), this.opcode("pushContext")), this.opcode("resolvePossibleLambda")
                },
                helperSexpr: function(a, b, c) {
                    var d = this.setupFullMustacheParams(a, b, c),
                        e = a.id.parts[0];
                    if (this.options.knownHelpers[e]) this.opcode("invokeKnownHelper", d.length, e);
                    else {
                        if (this.options.knownHelpersOnly) throw new f("You specified knownHelpersOnly, but used the unknown helper " + e, a);
                        this.opcode("invokeHelper", d.length, e, a.isRoot)
                    }
                },
                sexpr: function(a) {
                    var b = this.classifySexpr(a);
                    "simple" === b ? this.simpleSexpr(a) : "helper" === b ? this.helperSexpr(a) : this.ambiguousSexpr(a)
                },
                ID: function(a) {
                    this.addDepth(a.depth), this.opcode("getContext", a.depth);
                    var b = a.parts[0];
                    b ? this.opcode("lookupOnContext", a.parts[0]) : this.opcode("pushContext");
                    for (var c = 1, d = a.parts.length; d > c; c++) this.opcode("lookup", a.parts[c])
                },
                DATA: function(a) {
                    if (this.options.data = !0, a.id.isScoped || a.id.depth) throw new f("Scoped data references are not supported: " + a.original, a);
                    this.opcode("lookupData");
                    for (var b = a.id.parts, c = 0, d = b.length; d > c; c++) this.opcode("lookup", b[c])
                },
                STRING: function(a) {
                    this.opcode("pushString", a.string)
                },
                INTEGER: function(a) {
                    this.opcode("pushLiteral", a.integer)
                },
                BOOLEAN: function(a) {
                    this.opcode("pushLiteral", a.bool)
                },
                comment: function() {},
                opcode: function(a) {
                    this.opcodes.push({
                        opcode: a,
                        args: [].slice.call(arguments, 1)
                    })
                },
                declare: function(a, b) {
                    this.opcodes.push({
                        opcode: "DECLARE",
                        name: a,
                        value: b
                    })
                },
                addDepth: function(a) {
                    0 !== a && (this.depths[a] || (this.depths[a] = !0, this.depths.list.push(a)))
                },
                classifySexpr: function(a) {
                    var b = a.isHelper,
                        c = a.eligibleHelper,
                        d = this.options;
                    if (c && !b) {
                        var e = a.id.parts[0];
                        d.knownHelpers[e] ? b = !0 : d.knownHelpersOnly && (c = !1)
                    }
                    return b ? "helper" : c ? "ambiguous" : "simple"
                },
                pushParams: function(a) {
                    for (var b, c = a.length; c--;) b = a[c], this.options.stringParams ? (b.depth && this.addDepth(b.depth), this.opcode("getContext", b.depth || 0), this.opcode("pushStringParam", b.stringModeValue, b.type), "sexpr" === b.type && this.sexpr(b)) : this[b.type](b)
                },
                setupFullMustacheParams: function(a, b, c) {
                    var d = a.params;
                    return this.pushParams(d), this.opcode("pushProgram", b), this.opcode("pushProgram", c), a.hash ? this.hash(a.hash) : this.opcode("emptyHash"), d
                }
            }, e.precompile = c, e.compile = d, e
        }(c),
        k = function(a, b) {
            "use strict";

            function c(a) {
                this.value = a
            }

            function d() {}
            var e, f = a.COMPILER_REVISION,
                g = a.REVISION_CHANGES,
                h = a.log,
                i = b;
            d.prototype = {
                nameLookup: function(a, b) {
                    var c, e;
                    return 0 === a.indexOf("depth") && (c = !0), e = /^[0-9]+$/.test(b) ? a + "[" + b + "]" : d.isValidJavaScriptVariableName(b) ? a + "." + b : a + "['" + b + "']", c ? "(" + a + " && " + e + ")" : e
                },
                compilerInfo: function() {
                    var a = f,
                        b = g[a];
                    return "this.compilerInfo = [" + a + ",'" + b + "'];\n"
                },
                appendToBuffer: function(a) {
                    return this.environment.isSimple ? "return " + a + ";" : {
                        appendToBuffer: !0,
                        content: a,
                        toString: function() {
                            return "buffer += " + a + ";"
                        }
                    }
                },
                initializeBuffer: function() {
                    return this.quotedString("")
                },
                namespace: "Handlebars",
                compile: function(a, b, c, d) {
                    this.environment = a, this.options = b || {}, h("debug", this.environment.disassemble() + "\n\n"), this.name = this.environment.name, this.isChild = !!c, this.context = c || {
                        programs: [],
                        environments: [],
                        aliases: {}
                    }, this.preamble(), this.stackSlot = 0, this.stackVars = [], this.registers = {
                        list: []
                    }, this.hashes = [], this.compileStack = [], this.inlineStack = [], this.compileChildren(a, b);
                    var e, f = a.opcodes;
                    this.i = 0;
                    for (var g = f.length; this.i < g; this.i++) e = f[this.i], "DECLARE" === e.opcode ? this[e.name] = e.value : this[e.opcode].apply(this, e.args), e.opcode !== this.stripNext && (this.stripNext = !1);
                    if (this.pushSource(""), this.stackSlot || this.inlineStack.length || this.compileStack.length) throw new i("Compile completed with content left on stack");
                    return this.createFunctionContext(d)
                },
                preamble: function() {
                    var a = [];
                    if (this.isChild) a.push("");
                    else {
                        var b = this.namespace,
                            c = "helpers = this.merge(helpers, " + b + ".helpers);";
                        this.environment.usePartial && (c = c + " partials = this.merge(partials, " + b + ".partials);"), this.options.data && (c += " data = data || {};"), a.push(c)
                    }
                    this.environment.isSimple ? a.push("") : a.push(", buffer = " + this.initializeBuffer()), this.lastContext = 0, this.source = a
                },
                createFunctionContext: function(a) {
                    var b = this.stackVars.concat(this.registers.list);
                    if (b.length > 0 && (this.source[1] = this.source[1] + ", " + b.join(", ")), !this.isChild)
                        for (var c in this.context.aliases) this.context.aliases.hasOwnProperty(c) && (this.source[1] = this.source[1] + ", " + c + "=" + this.context.aliases[c]);
                    this.source[1] && (this.source[1] = "var " + this.source[1].substring(2) + ";"), this.isChild || (this.source[1] += "\n" + this.context.programs.join("\n") + "\n"), this.environment.isSimple || this.pushSource("return buffer;");
                    for (var d = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"], e = 0, f = this.environment.depths.list.length; f > e; e++) d.push("depth" + this.environment.depths.list[e]);
                    var g = this.mergeSource();
                    if (this.isChild || (g = this.compilerInfo() + g), a) return d.push(g), Function.apply(this, d);
                    var i = "function " + (this.name || "") + "(" + d.join(",") + ") {\n  " + g + "}";
                    return h("debug", i + "\n\n"), i
                },
                mergeSource: function() {
                    for (var a, b = "", c = 0, d = this.source.length; d > c; c++) {
                        var e = this.source[c];
                        e.appendToBuffer ? a = a ? a + "\n    + " + e.content : e.content : (a && (b += "buffer += " + a + ";\n  ", a = void 0), b += e + "\n  ")
                    }
                    return b
                },
                blockValue: function() {
                    this.context.aliases.blockHelperMissing = "helpers.blockHelperMissing";
                    var a = ["depth0"];
                    this.setupParams(0, a), this.replaceStack(function(b) {
                        return a.splice(1, 0, b), "blockHelperMissing.call(" + a.join(", ") + ")"
                    })
                },
                ambiguousBlockValue: function() {
                    this.context.aliases.blockHelperMissing = "helpers.blockHelperMissing";
                    var a = ["depth0"];
                    this.setupParams(0, a);
                    var b = this.topStack();
                    a.splice(1, 0, b), this.pushSource("if (!" + this.lastHelper + ") { " + b + " = blockHelperMissing.call(" + a.join(", ") + "); }")
                },
                appendContent: function(a) {
                    this.pendingContent && (a = this.pendingContent + a), this.stripNext && (a = a.replace(/^\s+/, "")), this.pendingContent = a
                },
                strip: function() {
                    this.pendingContent && (this.pendingContent = this.pendingContent.replace(/\s+$/, "")), this.stripNext = "strip"
                },
                append: function() {
                    this.flushInline();
                    var a = this.popStack();
                    this.pushSource("if(" + a + " || " + a + " === 0) { " + this.appendToBuffer(a) + " }"), this.environment.isSimple && this.pushSource("else { " + this.appendToBuffer("''") + " }")
                },
                appendEscaped: function() {
                    this.context.aliases.escapeExpression = "this.escapeExpression", this.pushSource(this.appendToBuffer("escapeExpression(" + this.popStack() + ")"))
                },
                getContext: function(a) {
                    this.lastContext !== a && (this.lastContext = a)
                },
                lookupOnContext: function(a) {
                    this.push(this.nameLookup("depth" + this.lastContext, a, "context"))
                },
                pushContext: function() {
                    this.pushStackLiteral("depth" + this.lastContext)
                },
                resolvePossibleLambda: function() {
                    this.context.aliases.functionType = '"function"', this.replaceStack(function(a) {
                        return "typeof " + a + " === functionType ? " + a + ".apply(depth0) : " + a
                    })
                },
                lookup: function(a) {
                    this.replaceStack(function(b) {
                        return b + " == null || " + b + " === false ? " + b + " : " + this.nameLookup(b, a, "context")
                    })
                },
                lookupData: function() {
                    this.pushStackLiteral("data")
                },
                pushStringParam: function(a, b) {
                    this.pushStackLiteral("depth" + this.lastContext), this.pushString(b), "sexpr" !== b && ("string" == typeof a ? this.pushString(a) : this.pushStackLiteral(a))
                },
                emptyHash: function() {
                    this.pushStackLiteral("{}"), this.options.stringParams && (this.push("{}"), this.push("{}"))
                },
                pushHash: function() {
                    this.hash && this.hashes.push(this.hash), this.hash = {
                        values: [],
                        types: [],
                        contexts: []
                    }
                },
                popHash: function() {
                    var a = this.hash;
                    this.hash = this.hashes.pop(), this.options.stringParams && (this.push("{" + a.contexts.join(",") + "}"), this.push("{" + a.types.join(",") + "}")), this.push("{\n    " + a.values.join(",\n    ") + "\n  }")
                },
                pushString: function(a) {
                    this.pushStackLiteral(this.quotedString(a))
                },
                push: function(a) {
                    return this.inlineStack.push(a), a
                },
                pushLiteral: function(a) {
                    this.pushStackLiteral(a)
                },
                pushProgram: function(a) {
                    null != a ? this.pushStackLiteral(this.programExpression(a)) : this.pushStackLiteral(null)
                },
                invokeHelper: function(a, b, c) {
                    this.context.aliases.helperMissing = "helpers.helperMissing", this.useRegister("helper");
                    var d = this.lastHelper = this.setupHelper(a, b, !0),
                        e = this.nameLookup("depth" + this.lastContext, b, "context"),
                        f = "helper = " + d.name + " || " + e;
                    d.paramsInit && (f += "," + d.paramsInit), this.push("(" + f + ",helper ? helper.call(" + d.callParams + ") : helperMissing.call(" + d.helperMissingParams + "))"), c || this.flushInline()
                },
                invokeKnownHelper: function(a, b) {
                    var c = this.setupHelper(a, b);
                    this.push(c.name + ".call(" + c.callParams + ")")
                },
                invokeAmbiguous: function(a, b) {
                    this.context.aliases.functionType = '"function"', this.useRegister("helper"), this.emptyHash();
                    var c = this.setupHelper(0, a, b),
                        d = this.lastHelper = this.nameLookup("helpers", a, "helper"),
                        e = this.nameLookup("depth" + this.lastContext, a, "context"),
                        f = this.nextStack();
                    c.paramsInit && this.pushSource(c.paramsInit), this.pushSource("if (helper = " + d + ") { " + f + " = helper.call(" + c.callParams + "); }"), this.pushSource("else { helper = " + e + "; " + f + " = typeof helper === functionType ? helper.call(" + c.callParams + ") : helper; }")
                },
                invokePartial: function(a) {
                    var b = [this.nameLookup("partials", a, "partial"), "'" + a + "'", this.popStack(), "helpers", "partials"];
                    this.options.data && b.push("data"), this.context.aliases.self = "this", this.push("self.invokePartial(" + b.join(", ") + ")")
                },
                assignToHash: function(a) {
                    var b, c, d = this.popStack();
                    this.options.stringParams && (c = this.popStack(), b = this.popStack());
                    var e = this.hash;
                    b && e.contexts.push("'" + a + "': " + b), c && e.types.push("'" + a + "': " + c), e.values.push("'" + a + "': (" + d + ")")
                },
                compiler: d,
                compileChildren: function(a, b) {
                    for (var c, d, e = a.children, f = 0, g = e.length; g > f; f++) {
                        c = e[f], d = new this.compiler;
                        var h = this.matchExistingProgram(c);
                        null == h ? (this.context.programs.push(""), h = this.context.programs.length, c.index = h, c.name = "program" + h, this.context.programs[h] = d.compile(c, b, this.context), this.context.environments[h] = c) : (c.index = h, c.name = "program" + h)
                    }
                },
                matchExistingProgram: function(a) {
                    for (var b = 0, c = this.context.environments.length; c > b; b++) {
                        var d = this.context.environments[b];
                        if (d && d.equals(a)) return b
                    }
                },
                programExpression: function(a) {
                    if (this.context.aliases.self = "this", null == a) return "self.noop";
                    for (var b, c = this.environment.children[a], d = c.depths.list, e = [c.index, c.name, "data"], f = 0, g = d.length; g > f; f++) b = d[f], 1 === b ? e.push("depth0") : e.push("depth" + (b - 1));
                    return (0 === d.length ? "self.program(" : "self.programWithDepth(") + e.join(", ") + ")"
                },
                register: function(a, b) {
                    this.useRegister(a), this.pushSource(a + " = " + b + ";")
                },
                useRegister: function(a) {
                    this.registers[a] || (this.registers[a] = !0, this.registers.list.push(a))
                },
                pushStackLiteral: function(a) {
                    return this.push(new c(a))
                },
                pushSource: function(a) {
                    this.pendingContent && (this.source.push(this.appendToBuffer(this.quotedString(this.pendingContent))), this.pendingContent = void 0), a && this.source.push(a)
                },
                pushStack: function(a) {
                    this.flushInline();
                    var b = this.incrStack();
                    return a && this.pushSource(b + " = " + a + ";"), this.compileStack.push(b), b
                },
                replaceStack: function(a) {
                    var b, d, e, f = "",
                        g = this.isInline();
                    if (g) {
                        var h = this.popStack(!0);
                        if (h instanceof c) b = h.value, e = !0;
                        else {
                            d = !this.stackSlot;
                            var i = d ? this.incrStack() : this.topStackName();
                            f = "(" + this.push(i) + " = " + h + "),", b = this.topStack()
                        }
                    } else b = this.topStack();
                    var j = a.call(this, b);
                    return g ? (e || this.popStack(), d && this.stackSlot--, this.push("(" + f + j + ")")) : (/^stack/.test(b) || (b = this.nextStack()), this.pushSource(b + " = (" + f + j + ");")), b
                },
                nextStack: function() {
                    return this.pushStack()
                },
                incrStack: function() {
                    return this.stackSlot++, this.stackSlot > this.stackVars.length && this.stackVars.push("stack" + this.stackSlot), this.topStackName()
                },
                topStackName: function() {
                    return "stack" + this.stackSlot
                },
                flushInline: function() {
                    var a = this.inlineStack;
                    if (a.length) {
                        this.inlineStack = [];
                        for (var b = 0, d = a.length; d > b; b++) {
                            var e = a[b];
                            e instanceof c ? this.compileStack.push(e) : this.pushStack(e)
                        }
                    }
                },
                isInline: function() {
                    return this.inlineStack.length
                },
                popStack: function(a) {
                    var b = this.isInline(),
                        d = (b ? this.inlineStack : this.compileStack).pop();
                    if (!a && d instanceof c) return d.value;
                    if (!b) {
                        if (!this.stackSlot) throw new i("Invalid stack pop");
                        this.stackSlot--
                    }
                    return d
                },
                topStack: function(a) {
                    var b = this.isInline() ? this.inlineStack : this.compileStack,
                        d = b[b.length - 1];
                    return !a && d instanceof c ? d.value : d
                },
                quotedString: function(a) {
                    return '"' + a.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029") + '"'
                },
                setupHelper: function(a, b, c) {
                    var d = [],
                        e = this.setupParams(a, d, c),
                        f = this.nameLookup("helpers", b, "helper");
                    return {
                        params: d,
                        paramsInit: e,
                        name: f,
                        callParams: ["depth0"].concat(d).join(", "),
                        helperMissingParams: c && ["depth0", this.quotedString(b)].concat(d).join(", ")
                    }
                },
                setupOptions: function(a, b) {
                    var c, d, e, f = [],
                        g = [],
                        h = [];
                    f.push("hash:" + this.popStack()), this.options.stringParams && (f.push("hashTypes:" + this.popStack()), f.push("hashContexts:" + this.popStack())), d = this.popStack(), e = this.popStack(), (e || d) && (e || (this.context.aliases.self = "this", e = "self.noop"), d || (this.context.aliases.self = "this", d = "self.noop"), f.push("inverse:" + d), f.push("fn:" + e));
                    for (var i = 0; a > i; i++) c = this.popStack(), b.push(c), this.options.stringParams && (h.push(this.popStack()), g.push(this.popStack()));
                    return this.options.stringParams && (f.push("contexts:[" + g.join(",") + "]"), f.push("types:[" + h.join(",") + "]")), this.options.data && f.push("data:data"), f
                },
                setupParams: function(a, b, c) {
                    var d = "{" + this.setupOptions(a, b).join(",") + "}";
                    return c ? (this.useRegister("options"), b.push("options"), "options=" + d) : (b.push(d), "")
                }
            };
            for (var j = "break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield".split(" "), k = d.RESERVED_WORDS = {}, l = 0, m = j.length; m > l; l++) k[j[l]] = !0;
            return d.isValidJavaScriptVariableName = function(a) {
                return !d.RESERVED_WORDS[a] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(a) ? !0 : !1
            }, e = d
        }(d, c),
        l = function(a, b, c, d, e) {
            "use strict";
            var f, g = a,
                h = b,
                i = c.parser,
                j = c.parse,
                k = d.Compiler,
                l = d.compile,
                m = d.precompile,
                n = e,
                o = g.create,
                p = function() {
                    var a = o();
                    return a.compile = function(b, c) {
                        return l(b, c, a)
                    }, a.precompile = function(b, c) {
                        return m(b, c, a)
                    }, a.AST = h, a.Compiler = k, a.JavaScriptCompiler = n, a.Parser = i, a.parse = j, a
                };
            return g = p(), g.create = p, f = g
        }(f, g, i, j, k);
    return l
}();
(function() {
    function a() {}

    function b(a, b) {
        for (var c = a.length; c--;)
            if (a[c].listener === b) return c;
        return -1
    }

    function c(a) {
        return function() {
            return this[a].apply(this, arguments)
        }
    }
    var d = a.prototype,
        e = this,
        f = e.EventEmitter;
    d.getListeners = function(a) {
        var b, c, d = this._getEvents();
        if ("object" == typeof a) {
            b = {};
            for (c in d) d.hasOwnProperty(c) && a.test(c) && (b[c] = d[c])
        } else b = d[a] || (d[a] = []);
        return b
    }, d.flattenListeners = function(a) {
        var b, c = [];
        for (b = 0; a.length > b; b += 1) c.push(a[b].listener);
        return c
    }, d.getListenersAsObject = function(a) {
        var b, c = this.getListeners(a);
        return c instanceof Array && (b = {}, b[a] = c), b || c
    }, d.addListener = function(a, c) {
        var d, e = this.getListenersAsObject(a),
            f = "object" == typeof c;
        for (d in e) e.hasOwnProperty(d) && -1 === b(e[d], c) && e[d].push(f ? c : {
            listener: c,
            once: !1
        });
        return this
    }, d.on = c("addListener"), d.addOnceListener = function(a, b) {
        return this.addListener(a, {
            listener: b,
            once: !0
        })
    }, d.once = c("addOnceListener"), d.defineEvent = function(a) {
        return this.getListeners(a), this
    }, d.defineEvents = function(a) {
        for (var b = 0; a.length > b; b += 1) this.defineEvent(a[b]);
        return this
    }, d.removeListener = function(a, c) {
        var d, e, f = this.getListenersAsObject(a);
        for (e in f) f.hasOwnProperty(e) && (d = b(f[e], c), -1 !== d && f[e].splice(d, 1));
        return this
    }, d.off = c("removeListener"), d.addListeners = function(a, b) {
        return this.manipulateListeners(!1, a, b)
    }, d.removeListeners = function(a, b) {
        return this.manipulateListeners(!0, a, b)
    }, d.manipulateListeners = function(a, b, c) {
        var d, e, f = a ? this.removeListener : this.addListener,
            g = a ? this.removeListeners : this.addListeners;
        if ("object" != typeof b || b instanceof RegExp)
            for (d = c.length; d--;) f.call(this, b, c[d]);
        else
            for (d in b) b.hasOwnProperty(d) && (e = b[d]) && ("function" == typeof e ? f.call(this, d, e) : g.call(this, d, e));
        return this
    }, d.removeEvent = function(a) {
        var b, c = typeof a,
            d = this._getEvents();
        if ("string" === c) delete d[a];
        else if ("object" === c)
            for (b in d) d.hasOwnProperty(b) && a.test(b) && delete d[b];
        else delete this._events;
        return this
    }, d.removeAllListeners = c("removeEvent"), d.emitEvent = function(a, b) {
        var c, d, e, f, g = this.getListenersAsObject(a);
        for (e in g)
            if (g.hasOwnProperty(e))
                for (d = g[e].length; d--;) c = g[e][d], c.once === !0 && this.removeListener(a, c.listener), f = c.listener.apply(this, b || []), f === this._getOnceReturnValue() && this.removeListener(a, c.listener);
        return this
    }, d.trigger = c("emitEvent"), d.emit = function(a) {
        var b = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(a, b)
    }, d.setOnceReturnValue = function(a) {
        return this._onceReturnValue = a, this
    }, d._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
    }, d._getEvents = function() {
        return this._events || (this._events = {})
    }, a.noConflict = function() {
        return e.EventEmitter = f, a
    }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
        return a
    }) : "object" == typeof module && module.exports ? module.exports = a : this.EventEmitter = a
}).call(this),
    function(a) {
        function b(b) {
            var c = a.event;
            return c.target = c.target || c.srcElement || b, c
        }
        var c = document.documentElement,
            d = function() {};
        c.addEventListener ? d = function(a, b, c) {
            a.addEventListener(b, c, !1)
        } : c.attachEvent && (d = function(a, c, d) {
            a[c + d] = d.handleEvent ? function() {
                var c = b(a);
                d.handleEvent.call(d, c)
            } : function() {
                var c = b(a);
                d.call(a, c)
            }, a.attachEvent("on" + c, a[c + d])
        });
        var e = function() {};
        c.removeEventListener ? e = function(a, b, c) {
            a.removeEventListener(b, c, !1)
        } : c.detachEvent && (e = function(a, b, c) {
            a.detachEvent("on" + b, a[b + c]);
            try {
                delete a[b + c]
            } catch (d) {
                a[b + c] = void 0
            }
        });
        var f = {
            bind: d,
            unbind: e
        };
        "function" == typeof define && define.amd ? define("eventie/eventie", f) : a.eventie = f
    }(this),
    function(a, b) {
        "function" == typeof define && define.amd ? define(["eventEmitter/EventEmitter", "eventie/eventie"], function(c, d) {
            return b(a, c, d)
        }) : "object" == typeof exports ? module.exports = b(a, require("wolfy87-eventemitter"), require("eventie")) : a.imagesLoaded = b(a, a.EventEmitter, a.eventie)
    }(window, function(a, b, c) {
        function d(a, b) {
            for (var c in b) a[c] = b[c];
            return a
        }

        function e(a) {
            return "[object Array]" === m.call(a)
        }

        function f(a) {
            var b = [];
            if (e(a)) b = a;
            else if ("number" == typeof a.length)
                for (var c = 0, d = a.length; d > c; c++) b.push(a[c]);
            else b.push(a);
            return b
        }

        function g(a, b, c) {
            if (!(this instanceof g)) return new g(a, b);
            "string" == typeof a && (a = document.querySelectorAll(a)), this.elements = f(a), this.options = d({}, this.options), "function" == typeof b ? c = b : d(this.options, b), c && this.on("always", c), this.getImages(), j && (this.jqDeferred = new j.Deferred);
            var e = this;
            setTimeout(function() {
                e.check()
            })
        }

        function h(a) {
            this.img = a
        }

        function i(a) {
            this.src = a, n[a] = this
        }
        var j = a.jQuery,
            k = a.console,
            l = void 0 !== k,
            m = Object.prototype.toString;
        g.prototype = new b, g.prototype.options = {}, g.prototype.getImages = function() {
            this.images = [];
            for (var a = 0, b = this.elements.length; b > a; a++) {
                var c = this.elements[a];
                "IMG" === c.nodeName && this.addImage(c);
                var d = c.nodeType;
                if (d && (1 === d || 9 === d || 11 === d))
                    for (var e = c.querySelectorAll("img"), f = 0, g = e.length; g > f; f++) {
                        var h = e[f];
                        this.addImage(h)
                    }
            }
        }, g.prototype.addImage = function(a) {
            var b = new h(a);
            this.images.push(b)
        }, g.prototype.check = function() {
            function a(a, e) {
                return b.options.debug && l && k.log("confirm", a, e), b.progress(a), c++, c === d && b.complete(), !0
            }
            var b = this,
                c = 0,
                d = this.images.length;
            if (this.hasAnyBroken = !1, !d) return void this.complete();
            for (var e = 0; d > e; e++) {
                var f = this.images[e];
                f.on("confirm", a), f.check()
            }
        }, g.prototype.progress = function(a) {
            this.hasAnyBroken = this.hasAnyBroken || !a.isLoaded;
            var b = this;
            setTimeout(function() {
                b.emit("progress", b, a), b.jqDeferred && b.jqDeferred.notify && b.jqDeferred.notify(b, a)
            })
        }, g.prototype.complete = function() {
            var a = this.hasAnyBroken ? "fail" : "done";
            this.isComplete = !0;
            var b = this;
            setTimeout(function() {
                if (b.emit(a, b), b.emit("always", b), b.jqDeferred) {
                    var c = b.hasAnyBroken ? "reject" : "resolve";
                    b.jqDeferred[c](b)
                }
            })
        }, j && (j.fn.imagesLoaded = function(a, b) {
            var c = new g(this, a, b);
            return c.jqDeferred.promise(j(this))
        }), h.prototype = new b, h.prototype.check = function() {
            var a = n[this.img.src] || new i(this.img.src);
            if (a.isConfirmed) return void this.confirm(a.isLoaded, "cached was confirmed");
            if (this.img.complete && void 0 !== this.img.naturalWidth) return void this.confirm(0 !== this.img.naturalWidth, "naturalWidth");
            var b = this;
            a.on("confirm", function(a, c) {
                return b.confirm(a.isLoaded, c), !0
            }), a.check()
        }, h.prototype.confirm = function(a, b) {
            this.isLoaded = a, this.emit("confirm", this, b)
        };
        var n = {};
        return i.prototype = new b, i.prototype.check = function() {
            if (!this.isChecked) {
                var a = new Image;
                c.bind(a, "load", this), c.bind(a, "error", this), a.src = this.src, this.isChecked = !0
            }
        }, i.prototype.handleEvent = function(a) {
            var b = "on" + a.type;
            this[b] && this[b](a)
        }, i.prototype.onload = function(a) {
            this.confirm(!0, "onload"), this.unbindProxyEvents(a)
        }, i.prototype.onerror = function(a) {
            this.confirm(!1, "onerror"), this.unbindProxyEvents(a)
        }, i.prototype.confirm = function(a, b) {
            this.isConfirmed = !0, this.isLoaded = a, this.emit("confirm", this, b)
        }, i.prototype.unbindProxyEvents = function(a) {
            c.unbind(a.target, "load", this), c.unbind(a.target, "error", this)
        }, g
    }),
    function(a) {
        a.fn.fitText = function(b, c) {
            var d = b || 1,
                e = a.extend({
                    minFontSize: Number.NEGATIVE_INFINITY,
                    maxFontSize: Number.POSITIVE_INFINITY
                }, c);
            return this.each(function() {
                var b = a(this),
                    c = function() {
                        b.css("font-size", Math.max(Math.min(b.width() / (10 * d), parseFloat(e.maxFontSize)), parseFloat(e.minFontSize)))
                    };
                c(), a(window).on("resize.fittext orientationchange.fittext", c)
            })
        }
    }(jQuery),
    function(a) {
        "use strict";
        a.fn.fitVids = function(b) {
            var c = {
                customSelector: null
            };
            if (!document.getElementById("fit-vids-style")) {
                var d = document.createElement("div"),
                    e = document.getElementsByTagName("base")[0] || document.getElementsByTagName("script")[0],
                    f = "&shy;<style>.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}</style>";
                d.className = "fit-vids-style", d.id = "fit-vids-style", d.style.display = "none", d.innerHTML = f, e.parentNode.insertBefore(d, e)
            }
            return b && a.extend(c, b), this.each(function() {
                var b = ["iframe[src*='player.vimeo.com']", "iframe[src*='youtube.com']", "iframe[src*='youtube-nocookie.com']", "iframe[src*='kickstarter.com'][src*='video.html']", "object", "embed"];
                c.customSelector && b.push(c.customSelector);
                var d = a(this).find(b.join(","));
                d = d.not("object object"), d.each(function() {
                    var b = a(this);
                    if (!("embed" === this.tagName.toLowerCase() && b.parent("object").length || b.parent(".fluid-width-video-wrapper").length)) {
                        var c = "object" === this.tagName.toLowerCase() || b.attr("height") && !isNaN(parseInt(b.attr("height"), 10)) ? parseInt(b.attr("height"), 10) : b.height(),
                            d = isNaN(parseInt(b.attr("width"), 10)) ? b.width() : parseInt(b.attr("width"), 10),
                            e = c / d;
                        if (!b.attr("id")) {
                            var f = "fitvid" + Math.floor(999999 * Math.random());
                            b.attr("id", f)
                        }
                        b.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top", 100 * e + "%"), b.removeAttr("height").removeAttr("width")
                    }
                })
            })
        }
    }(window.jQuery || window.Zepto),
    function(a) {
        function b(a) {
            if (a in l.style) return a;
            var b = ["Moz", "Webkit", "O", "ms"],
                c = a.charAt(0).toUpperCase() + a.substr(1);
            if (a in l.style) return a;
            for (var d = 0; d < b.length; ++d) {
                var e = b[d] + c;
                if (e in l.style) return e
            }
        }

        function c() {
            return l.style[m.transform] = "", l.style[m.transform] = "rotateY(90deg)", "" !== l.style[m.transform]
        }

        function d(a) {
            return "string" == typeof a && this.parse(a), this
        }

        function e(a, b, c) {
            b === !0 ? a.queue(c) : b ? a.queue(b, c) : c()
        }

        function f(b) {
            var c = [];
            return a.each(b, function(b) {
                b = a.camelCase(b), b = a.transit.propertyMap[b] || a.cssProps[b] || b, b = i(b), -1 === a.inArray(b, c) && c.push(b)
            }), c
        }

        function g(b, c, d, e) {
            var g = f(b);
            a.cssEase[d] && (d = a.cssEase[d]);
            var h = "" + k(c) + " " + d;
            parseInt(e, 10) > 0 && (h += " " + k(e));
            var i = [];
            return a.each(g, function(a, b) {
                i.push(b + " " + h)
            }), i.join(", ")
        }

        function h(b, c) {
            c || (a.cssNumber[b] = !0), a.transit.propertyMap[b] = m.transform, a.cssHooks[b] = {
                get: function(c) {
                    var d = a(c).css("transit:transform");
                    return d.get(b)
                },
                set: function(c, d) {
                    var e = a(c).css("transit:transform");
                    e.setFromString(b, d), a(c).css({
                        "transit:transform": e
                    })
                }
            }
        }

        function i(a) {
            return a.replace(/([A-Z])/g, function(a) {
                return "-" + a.toLowerCase()
            })
        }

        function j(a, b) {
            return "string" != typeof a || a.match(/^[\-0-9\.]+$/) ? "" + a + b : a
        }

        function k(b) {
            var c = b;
            return a.fx.speeds[c] && (c = a.fx.speeds[c]), j(c, "ms")
        }
        a.transit = {
            version: "0.9.9",
            propertyMap: {
                marginLeft: "margin",
                marginRight: "margin",
                marginBottom: "margin",
                marginTop: "margin",
                paddingLeft: "padding",
                paddingRight: "padding",
                paddingBottom: "padding",
                paddingTop: "padding"
            },
            enabled: !0,
            useTransitionEnd: !1
        };
        var l = document.createElement("div"),
            m = {},
            n = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
        m.transition = b("transition"), m.transitionDelay = b("transitionDelay"), m.transform = b("transform"), m.transformOrigin = b("transformOrigin"), m.transform3d = c();
        var o = {
                transition: "transitionEnd",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd",
                WebkitTransition: "webkitTransitionEnd",
                msTransition: "MSTransitionEnd"
            },
            p = m.transitionEnd = o[m.transition] || null;
        for (var q in m) m.hasOwnProperty(q) && "undefined" == typeof a.support[q] && (a.support[q] = m[q]);
        l = null, a.cssEase = {
            _default: "ease",
            "in": "ease-in",
            out: "ease-out",
            "in-out": "ease-in-out",
            snap: "cubic-bezier(0,1,.5,1)",
            easeOutCubic: "cubic-bezier(.215,.61,.355,1)",
            easeInOutCubic: "cubic-bezier(.645,.045,.355,1)",
            easeInCirc: "cubic-bezier(.6,.04,.98,.335)",
            easeOutCirc: "cubic-bezier(.075,.82,.165,1)",
            easeInOutCirc: "cubic-bezier(.785,.135,.15,.86)",
            easeInExpo: "cubic-bezier(.95,.05,.795,.035)",
            easeOutExpo: "cubic-bezier(.19,1,.22,1)",
            easeInOutExpo: "cubic-bezier(1,0,0,1)",
            easeInQuad: "cubic-bezier(.55,.085,.68,.53)",
            easeOutQuad: "cubic-bezier(.25,.46,.45,.94)",
            easeInOutQuad: "cubic-bezier(.455,.03,.515,.955)",
            easeInQuart: "cubic-bezier(.895,.03,.685,.22)",
            easeOutQuart: "cubic-bezier(.165,.84,.44,1)",
            easeInOutQuart: "cubic-bezier(.77,0,.175,1)",
            easeInQuint: "cubic-bezier(.755,.05,.855,.06)",
            easeOutQuint: "cubic-bezier(.23,1,.32,1)",
            easeInOutQuint: "cubic-bezier(.86,0,.07,1)",
            easeInSine: "cubic-bezier(.47,0,.745,.715)",
            easeOutSine: "cubic-bezier(.39,.575,.565,1)",
            easeInOutSine: "cubic-bezier(.445,.05,.55,.95)",
            easeInBack: "cubic-bezier(.6,-.28,.735,.045)",
            easeOutBack: "cubic-bezier(.175, .885,.32,1.275)",
            easeInOutBack: "cubic-bezier(.68,-.55,.265,1.55)"
        }, a.cssHooks["transit:transform"] = {
            get: function(b) {
                return a(b).data("transform") || new d
            },
            set: function(b, c) {
                var e = c;
                e instanceof d || (e = new d(e)), "WebkitTransform" !== m.transform || n ? b.style[m.transform] = e.toString() : b.style[m.transform] = e.toString(!0), a(b).data("transform", e)
            }
        }, a.cssHooks.transform = {
            set: a.cssHooks["transit:transform"].set
        }, a.fn.jquery < "1.8" && (a.cssHooks.transformOrigin = {
            get: function(a) {
                return a.style[m.transformOrigin]
            },
            set: function(a, b) {
                a.style[m.transformOrigin] = b;
            }
        }, a.cssHooks.transition = {
            get: function(a) {
                return a.style[m.transition]
            },
            set: function(a, b) {
                a.style[m.transition] = b
            }
        }), h("scale"), h("translate"), h("rotate"), h("rotateX"), h("rotateY"), h("rotate3d"), h("perspective"), h("skewX"), h("skewY"), h("x", !0), h("y", !0), d.prototype = {
            setFromString: function(a, b) {
                var c = "string" == typeof b ? b.split(",") : b.constructor === Array ? b : [b];
                c.unshift(a), d.prototype.set.apply(this, c)
            },
            set: function(a) {
                var b = Array.prototype.slice.apply(arguments, [1]);
                this.setter[a] ? this.setter[a].apply(this, b) : this[a] = b.join(",")
            },
            get: function(a) {
                return this.getter[a] ? this.getter[a].apply(this) : this[a] || 0
            },
            setter: {
                rotate: function(a) {
                    this.rotate = j(a, "deg")
                },
                rotateX: function(a) {
                    this.rotateX = j(a, "deg")
                },
                rotateY: function(a) {
                    this.rotateY = j(a, "deg")
                },
                scale: function(a, b) {
                    void 0 === b && (b = a), this.scale = a + "," + b
                },
                skewX: function(a) {
                    this.skewX = j(a, "deg")
                },
                skewY: function(a) {
                    this.skewY = j(a, "deg")
                },
                perspective: function(a) {
                    this.perspective = j(a, "px")
                },
                x: function(a) {
                    this.set("translate", a, null)
                },
                y: function(a) {
                    this.set("translate", null, a)
                },
                translate: function(a, b) {
                    void 0 === this._translateX && (this._translateX = 0), void 0 === this._translateY && (this._translateY = 0), null !== a && void 0 !== a && (this._translateX = j(a, "px")), null !== b && void 0 !== b && (this._translateY = j(b, "px")), this.translate = this._translateX + "," + this._translateY
                }
            },
            getter: {
                x: function() {
                    return this._translateX || 0
                },
                y: function() {
                    return this._translateY || 0
                },
                scale: function() {
                    var a = (this.scale || "1,1").split(",");
                    return a[0] && (a[0] = parseFloat(a[0])), a[1] && (a[1] = parseFloat(a[1])), a[0] === a[1] ? a[0] : a
                },
                rotate3d: function() {
                    for (var a = (this.rotate3d || "0,0,0,0deg").split(","), b = 0; 3 >= b; ++b) a[b] && (a[b] = parseFloat(a[b]));
                    return a[3] && (a[3] = j(a[3], "deg")), a
                }
            },
            parse: function(a) {
                var b = this;
                a.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function(a, c, d) {
                    b.setFromString(c, d)
                })
            },
            toString: function(a) {
                var b = [];
                for (var c in this)
                    if (this.hasOwnProperty(c)) {
                        if (!m.transform3d && ("rotateX" === c || "rotateY" === c || "perspective" === c || "transformOrigin" === c)) continue;
                        "_" !== c[0] && (a && "scale" === c ? b.push(c + "3d(" + this[c] + ",1)") : a && "translate" === c ? b.push(c + "3d(" + this[c] + ",0)") : b.push(c + "(" + this[c] + ")"))
                    }
                return b.join(" ")
            }
        }, a.fn.transition = a.fn.transit = function(b, c, d, f) {
            var h = this,
                i = 0,
                j = !0;
            "function" == typeof c && (f = c, c = void 0), "function" == typeof d && (f = d, d = void 0), "undefined" != typeof b.easing && (d = b.easing, delete b.easing), "undefined" != typeof b.duration && (c = b.duration, delete b.duration), "undefined" != typeof b.complete && (f = b.complete, delete b.complete), "undefined" != typeof b.queue && (j = b.queue, delete b.queue), "undefined" != typeof b.delay && (i = b.delay, delete b.delay), "undefined" == typeof c && (c = a.fx.speeds._default), "undefined" == typeof d && (d = a.cssEase._default), c = k(c);
            var l = g(b, c, d, i),
                n = a.transit.enabled && m.transition,
                o = n ? parseInt(c, 10) + parseInt(i, 10) : 0;
            if (0 === o) {
                var q = function(a) {
                    h.css(b), f && f.apply(h), a && a()
                };
                return e(h, j, q), h
            }
            var r = {},
                s = function(c) {
                    var d = !1,
                        e = function() {
                            d && h.unbind(p, e), o > 0 && h.each(function() {
                                this.style[m.transition] = r[this] || null
                            }), "function" == typeof f && f.apply(h), "function" == typeof c && c()
                        };
                    o > 0 && p && a.transit.useTransitionEnd ? (d = !0, h.bind(p, e)) : window.setTimeout(e, o), h.each(function() {
                        o > 0 && (this.style[m.transition] = l), a(this).css(b)
                    })
                },
                t = function(a) {
                    this.offsetWidth, s(a)
                };
            return e(h, j, t), this
        }, a.transit.getTransitionValue = g
    }(jQuery), ! function(a) {
        function b() {}

        function c(a) {
            function c(b) {
                b.prototype.option || (b.prototype.option = function(b) {
                    a.isPlainObject(b) && (this.options = a.extend(!0, this.options, b))
                })
            }

            function e(b, c) {
                a.fn[b] = function(e) {
                    if ("string" == typeof e) {
                        for (var g = d.call(arguments, 1), h = 0, i = this.length; i > h; h++) {
                            var j = this[h],
                                k = a.data(j, b);
                            if (k)
                                if (a.isFunction(k[e]) && "_" !== e.charAt(0)) {
                                    var l = k[e].apply(k, g);
                                    if (void 0 !== l) return l
                                } else f("no such method '" + e + "' for " + b + " instance");
                            else f("cannot call methods on " + b + " prior to initialization; attempted to call '" + e + "'")
                        }
                        return this
                    }
                    return this.each(function() {
                        var d = a.data(this, b);
                        d ? (d.option(e), d._init()) : (d = new c(this, e), a.data(this, b, d))
                    })
                }
            }
            if (a) {
                var f = "undefined" == typeof console ? b : function(a) {
                    console.error(a)
                };
                return a.bridget = function(a, b) {
                    c(b), e(a, b)
                }, a.bridget
            }
        }
        var d = Array.prototype.slice;
        "function" == typeof define && define.amd ? define("jquery-bridget/jquery.bridget", ["jquery"], c) : c("object" == typeof exports ? require("jquery") : a.jQuery)
    }(window),
    function(a) {
        function b(b) {
            var c = a.event;
            return c.target = c.target || c.srcElement || b, c
        }
        var c = document.documentElement,
            d = function() {};
        c.addEventListener ? d = function(a, b, c) {
            a.addEventListener(b, c, !1)
        } : c.attachEvent && (d = function(a, c, d) {
            a[c + d] = d.handleEvent ? function() {
                var c = b(a);
                d.handleEvent.call(d, c)
            } : function() {
                var c = b(a);
                d.call(a, c)
            }, a.attachEvent("on" + c, a[c + d])
        });
        var e = function() {};
        c.removeEventListener ? e = function(a, b, c) {
            a.removeEventListener(b, c, !1)
        } : c.detachEvent && (e = function(a, b, c) {
            a.detachEvent("on" + b, a[b + c]);
            try {
                delete a[b + c]
            } catch (d) {
                a[b + c] = void 0
            }
        });
        var f = {
            bind: d,
            unbind: e
        };
        "function" == typeof define && define.amd ? define("eventie/eventie", f) : "object" == typeof exports ? module.exports = f : a.eventie = f
    }(window),
    function() {
        function a() {}

        function b(a, b) {
            for (var c = a.length; c--;)
                if (a[c].listener === b) return c;
            return -1
        }

        function c(a) {
            return function() {
                return this[a].apply(this, arguments)
            }
        }
        var d = a.prototype,
            e = this,
            f = e.EventEmitter;
        d.getListeners = function(a) {
            var b, c, d = this._getEvents();
            if (a instanceof RegExp) {
                b = {};
                for (c in d) d.hasOwnProperty(c) && a.test(c) && (b[c] = d[c])
            } else b = d[a] || (d[a] = []);
            return b
        }, d.flattenListeners = function(a) {
            var b, c = [];
            for (b = 0; b < a.length; b += 1) c.push(a[b].listener);
            return c
        }, d.getListenersAsObject = function(a) {
            var b, c = this.getListeners(a);
            return c instanceof Array && (b = {}, b[a] = c), b || c
        }, d.addListener = function(a, c) {
            var d, e = this.getListenersAsObject(a),
                f = "object" == typeof c;
            for (d in e) e.hasOwnProperty(d) && -1 === b(e[d], c) && e[d].push(f ? c : {
                listener: c,
                once: !1
            });
            return this
        }, d.on = c("addListener"), d.addOnceListener = function(a, b) {
            return this.addListener(a, {
                listener: b,
                once: !0
            })
        }, d.once = c("addOnceListener"), d.defineEvent = function(a) {
            return this.getListeners(a), this
        }, d.defineEvents = function(a) {
            for (var b = 0; b < a.length; b += 1) this.defineEvent(a[b]);
            return this
        }, d.removeListener = function(a, c) {
            var d, e, f = this.getListenersAsObject(a);
            for (e in f) f.hasOwnProperty(e) && (d = b(f[e], c), -1 !== d && f[e].splice(d, 1));
            return this
        }, d.off = c("removeListener"), d.addListeners = function(a, b) {
            return this.manipulateListeners(!1, a, b)
        }, d.removeListeners = function(a, b) {
            return this.manipulateListeners(!0, a, b)
        }, d.manipulateListeners = function(a, b, c) {
            var d, e, f = a ? this.removeListener : this.addListener,
                g = a ? this.removeListeners : this.addListeners;
            if ("object" != typeof b || b instanceof RegExp)
                for (d = c.length; d--;) f.call(this, b, c[d]);
            else
                for (d in b) b.hasOwnProperty(d) && (e = b[d]) && ("function" == typeof e ? f.call(this, d, e) : g.call(this, d, e));
            return this
        }, d.removeEvent = function(a) {
            var b, c = typeof a,
                d = this._getEvents();
            if ("string" === c) delete d[a];
            else if (a instanceof RegExp)
                for (b in d) d.hasOwnProperty(b) && a.test(b) && delete d[b];
            else delete this._events;
            return this
        }, d.removeAllListeners = c("removeEvent"), d.emitEvent = function(a, b) {
            var c, d, e, f, g = this.getListenersAsObject(a);
            for (e in g)
                if (g.hasOwnProperty(e))
                    for (d = g[e].length; d--;) c = g[e][d], c.once === !0 && this.removeListener(a, c.listener), f = c.listener.apply(this, b || []), f === this._getOnceReturnValue() && this.removeListener(a, c.listener);
            return this
        }, d.trigger = c("emitEvent"), d.emit = function(a) {
            var b = Array.prototype.slice.call(arguments, 1);
            return this.emitEvent(a, b)
        }, d.setOnceReturnValue = function(a) {
            return this._onceReturnValue = a, this
        }, d._getOnceReturnValue = function() {
            return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
        }, d._getEvents = function() {
            return this._events || (this._events = {})
        }, a.noConflict = function() {
            return e.EventEmitter = f, a
        }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
            return a
        }) : "object" == typeof module && module.exports ? module.exports = a : e.EventEmitter = a
    }.call(this),
    function(a) {
        function b(a) {
            if (a) {
                if ("string" == typeof d[a]) return a;
                a = a.charAt(0).toUpperCase() + a.slice(1);
                for (var b, e = 0, f = c.length; f > e; e++)
                    if (b = c[e] + a, "string" == typeof d[b]) return b
            }
        }
        var c = "Webkit Moz ms Ms O".split(" "),
            d = document.documentElement.style;
        "function" == typeof define && define.amd ? define("get-style-property/get-style-property", [], function() {
            return b
        }) : "object" == typeof exports ? module.exports = b : a.getStyleProperty = b
    }(window),
    function(a) {
        function b(a) {
            var b = parseFloat(a),
                c = -1 === a.indexOf("%") && !isNaN(b);
            return c && b
        }

        function c() {}

        function d() {
            for (var a = {
                    width: 0,
                    height: 0,
                    innerWidth: 0,
                    innerHeight: 0,
                    outerWidth: 0,
                    outerHeight: 0
                }, b = 0, c = g.length; c > b; b++) {
                var d = g[b];
                a[d] = 0
            }
            return a
        }

        function e(c) {
            function e() {
                if (!m) {
                    m = !0;
                    var d = a.getComputedStyle;
                    if (j = function() {
                            var a = d ? function(a) {
                                return d(a, null)
                            } : function(a) {
                                return a.currentStyle
                            };
                            return function(b) {
                                var c = a(b);
                                return c || f("Style returned " + c + ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"), c
                            }
                        }(), k = c("boxSizing")) {
                        var e = document.createElement("div");
                        e.style.width = "200px", e.style.padding = "1px 2px 3px 4px", e.style.borderStyle = "solid", e.style.borderWidth = "1px 2px 3px 4px", e.style[k] = "border-box";
                        var g = document.body || document.documentElement;
                        g.appendChild(e);
                        var h = j(e);
                        l = 200 === b(h.width), g.removeChild(e)
                    }
                }
            }

            function h(a) {
                if (e(), "string" == typeof a && (a = document.querySelector(a)), a && "object" == typeof a && a.nodeType) {
                    var c = j(a);
                    if ("none" === c.display) return d();
                    var f = {};
                    f.width = a.offsetWidth, f.height = a.offsetHeight;
                    for (var h = f.isBorderBox = !(!k || !c[k] || "border-box" !== c[k]), m = 0, n = g.length; n > m; m++) {
                        var o = g[m],
                            p = c[o];
                        p = i(a, p);
                        var q = parseFloat(p);
                        f[o] = isNaN(q) ? 0 : q
                    }
                    var r = f.paddingLeft + f.paddingRight,
                        s = f.paddingTop + f.paddingBottom,
                        t = f.marginLeft + f.marginRight,
                        u = f.marginTop + f.marginBottom,
                        v = f.borderLeftWidth + f.borderRightWidth,
                        w = f.borderTopWidth + f.borderBottomWidth,
                        x = h && l,
                        y = b(c.width);
                    y !== !1 && (f.width = y + (x ? 0 : r + v));
                    var z = b(c.height);
                    return z !== !1 && (f.height = z + (x ? 0 : s + w)), f.innerWidth = f.width - (r + v), f.innerHeight = f.height - (s + w), f.outerWidth = f.width + t, f.outerHeight = f.height + u, f
                }
            }

            function i(b, c) {
                if (a.getComputedStyle || -1 === c.indexOf("%")) return c;
                var d = b.style,
                    e = d.left,
                    f = b.runtimeStyle,
                    g = f && f.left;
                return g && (f.left = b.currentStyle.left), d.left = c, c = d.pixelLeft, d.left = e, g && (f.left = g), c
            }
            var j, k, l, m = !1;
            return h
        }
        var f = "undefined" == typeof console ? c : function(a) {
                console.error(a)
            },
            g = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"];
        "function" == typeof define && define.amd ? define("get-size/get-size", ["get-style-property/get-style-property"], e) : "object" == typeof exports ? module.exports = e(require("desandro-get-style-property")) : a.getSize = e(a.getStyleProperty)
    }(window),
    function(a) {
        function b(a) {
            "function" == typeof a && (b.isReady ? a() : g.push(a))
        }

        function c(a) {
            var c = "readystatechange" === a.type && "complete" !== f.readyState;
            b.isReady || c || d()
        }

        function d() {
            b.isReady = !0;
            for (var a = 0, c = g.length; c > a; a++) {
                var d = g[a];
                d()
            }
        }

        function e(e) {
            return "complete" === f.readyState ? d() : (e.bind(f, "DOMContentLoaded", c), e.bind(f, "readystatechange", c), e.bind(a, "load", c)), b
        }
        var f = a.document,
            g = [];
        b.isReady = !1, "function" == typeof define && define.amd ? define("doc-ready/doc-ready", ["eventie/eventie"], e) : "object" == typeof exports ? module.exports = e(require("eventie")) : a.docReady = e(a.eventie)
    }(window),
    function(a) {
        function b(a, b) {
            return a[g](b)
        }

        function c(a) {
            if (!a.parentNode) {
                var b = document.createDocumentFragment();
                b.appendChild(a)
            }
        }

        function d(a, b) {
            c(a);
            for (var d = a.parentNode.querySelectorAll(b), e = 0, f = d.length; f > e; e++)
                if (d[e] === a) return !0;
            return !1
        }

        function e(a, d) {
            return c(a), b(a, d)
        }
        var f, g = function() {
            if (a.matches) return "matches";
            if (a.matchesSelector) return "matchesSelector";
            for (var b = ["webkit", "moz", "ms", "o"], c = 0, d = b.length; d > c; c++) {
                var e = b[c],
                    f = e + "MatchesSelector";
                if (a[f]) return f
            }
        }();
        if (g) {
            var h = document.createElement("div"),
                i = b(h, "div");
            f = i ? b : e
        } else f = d;
        "function" == typeof define && define.amd ? define("matches-selector/matches-selector", [], function() {
            return f
        }) : "object" == typeof exports ? module.exports = f : window.matchesSelector = f
    }(Element.prototype),
    function(a, b) {
        "function" == typeof define && define.amd ? define("fizzy-ui-utils/utils", ["doc-ready/doc-ready", "matches-selector/matches-selector"], function(c, d) {
            return b(a, c, d)
        }) : "object" == typeof exports ? module.exports = b(a, require("doc-ready"), require("desandro-matches-selector")) : a.fizzyUIUtils = b(a, a.docReady, a.matchesSelector)
    }(window, function(a, b, c) {
        var d = {};
        d.extend = function(a, b) {
            for (var c in b) a[c] = b[c];
            return a
        }, d.modulo = function(a, b) {
            return (a % b + b) % b
        };
        var e = Object.prototype.toString;
        d.isArray = function(a) {
            return "[object Array]" == e.call(a)
        }, d.makeArray = function(a) {
            var b = [];
            if (d.isArray(a)) b = a;
            else if (a && "number" == typeof a.length)
                for (var c = 0, e = a.length; e > c; c++) b.push(a[c]);
            else b.push(a);
            return b
        }, d.indexOf = Array.prototype.indexOf ? function(a, b) {
            return a.indexOf(b)
        } : function(a, b) {
            for (var c = 0, d = a.length; d > c; c++)
                if (a[c] === b) return c;
            return -1
        }, d.removeFrom = function(a, b) {
            var c = d.indexOf(a, b); - 1 != c && a.splice(c, 1)
        }, d.isElement = "function" == typeof HTMLElement || "object" == typeof HTMLElement ? function(a) {
            return a instanceof HTMLElement
        } : function(a) {
            return a && "object" == typeof a && 1 == a.nodeType && "string" == typeof a.nodeName
        }, d.setText = function() {
            function a(a, c) {
                b = b || (void 0 !== document.documentElement.textContent ? "textContent" : "innerText"), a[b] = c
            }
            var b;
            return a
        }(), d.getParent = function(a, b) {
            for (; a != document.body;)
                if (a = a.parentNode, c(a, b)) return a
        }, d.getQueryElement = function(a) {
            return "string" == typeof a ? document.querySelector(a) : a
        }, d.handleEvent = function(a) {
            var b = "on" + a.type;
            this[b] && this[b](a)
        }, d.filterFindElements = function(a, b) {
            a = d.makeArray(a);
            for (var e = [], f = 0, g = a.length; g > f; f++) {
                var h = a[f];
                if (d.isElement(h))
                    if (b) {
                        c(h, b) && e.push(h);
                        for (var i = h.querySelectorAll(b), j = 0, k = i.length; k > j; j++) e.push(i[j])
                    } else e.push(h)
            }
            return e
        }, d.debounceMethod = function(a, b, c) {
            var d = a.prototype[b],
                e = b + "Timeout";
            a.prototype[b] = function() {
                var a = this[e];
                a && clearTimeout(a);
                var b = arguments,
                    f = this;
                this[e] = setTimeout(function() {
                    d.apply(f, b), delete f[e]
                }, c || 100)
            }
        }, d.toDashed = function(a) {
            return a.replace(/(.)([A-Z])/g, function(a, b, c) {
                return b + "-" + c
            }).toLowerCase()
        };
        var f = a.console;
        return d.htmlInit = function(c, e) {
            b(function() {
                for (var b = d.toDashed(e), g = document.querySelectorAll(".js-" + b), h = "data-" + b + "-options", i = 0, j = g.length; j > i; i++) {
                    var k, l = g[i],
                        m = l.getAttribute(h);
                    try {
                        k = m && JSON.parse(m)
                    } catch (n) {
                        f && f.error("Error parsing " + h + " on " + l.nodeName.toLowerCase() + (l.id ? "#" + l.id : "") + ": " + n);
                        continue
                    }
                    var o = new c(l, k),
                        p = a.jQuery;
                    p && p.data(l, e, o)
                }
            })
        }, d
    }),
    function(a, b) {
        "function" == typeof define && define.amd ? define("outlayer/item", ["eventEmitter/EventEmitter", "get-size/get-size", "get-style-property/get-style-property", "fizzy-ui-utils/utils"], function(c, d, e, f) {
            return b(a, c, d, e, f)
        }) : "object" == typeof exports ? module.exports = b(a, require("wolfy87-eventemitter"), require("get-size"), require("desandro-get-style-property"), require("fizzy-ui-utils")) : (a.Outlayer = {}, a.Outlayer.Item = b(a, a.EventEmitter, a.getSize, a.getStyleProperty, a.fizzyUIUtils))
    }(window, function(a, b, c, d, e) {
        function f(a) {
            for (var b in a) return !1;
            return b = null, !0
        }

        function g(a, b) {
            a && (this.element = a, this.layout = b, this.position = {
                x: 0,
                y: 0
            }, this._create())
        }
        var h = a.getComputedStyle,
            i = h ? function(a) {
                return h(a, null)
            } : function(a) {
                return a.currentStyle
            },
            j = d("transition"),
            k = d("transform"),
            l = j && k,
            m = !!d("perspective"),
            n = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "otransitionend",
                transition: "transitionend"
            }[j],
            o = ["transform", "transition", "transitionDuration", "transitionProperty"],
            p = function() {
                for (var a = {}, b = 0, c = o.length; c > b; b++) {
                    var e = o[b],
                        f = d(e);
                    f && f !== e && (a[e] = f)
                }
                return a
            }();
        e.extend(g.prototype, b.prototype), g.prototype._create = function() {
            this._transn = {
                ingProperties: {},
                clean: {},
                onEnd: {}
            }, this.css({
                position: "absolute"
            })
        }, g.prototype.handleEvent = function(a) {
            var b = "on" + a.type;
            this[b] && this[b](a)
        }, g.prototype.getSize = function() {
            this.size = c(this.element)
        }, g.prototype.css = function(a) {
            var b = this.element.style;
            for (var c in a) {
                var d = p[c] || c;
                b[d] = a[c]
            }
        }, g.prototype.getPosition = function() {
            var a = i(this.element),
                b = this.layout.options,
                c = b.isOriginLeft,
                d = b.isOriginTop,
                e = parseInt(a[c ? "left" : "right"], 10),
                f = parseInt(a[d ? "top" : "bottom"], 10);
            e = isNaN(e) ? 0 : e, f = isNaN(f) ? 0 : f;
            var g = this.layout.size;
            e -= c ? g.paddingLeft : g.paddingRight, f -= d ? g.paddingTop : g.paddingBottom, this.position.x = e, this.position.y = f
        }, g.prototype.layoutPosition = function() {
            var a = this.layout.size,
                b = this.layout.options,
                c = {},
                d = b.isOriginLeft ? "paddingLeft" : "paddingRight",
                e = b.isOriginLeft ? "left" : "right",
                f = b.isOriginLeft ? "right" : "left",
                g = this.position.x + a[d];
            g = b.percentPosition && !b.isHorizontal ? g / a.width * 100 + "%" : g + "px", c[e] = g, c[f] = "";
            var h = b.isOriginTop ? "paddingTop" : "paddingBottom",
                i = b.isOriginTop ? "top" : "bottom",
                j = b.isOriginTop ? "bottom" : "top",
                k = this.position.y + a[h];
            k = b.percentPosition && b.isHorizontal ? k / a.height * 100 + "%" : k + "px", c[i] = k, c[j] = "", this.css(c), this.emitEvent("layout", [this])
        };
        var q = m ? function(a, b) {
            return "translate3d(" + a + "px, " + b + "px, 0)"
        } : function(a, b) {
            return "translate(" + a + "px, " + b + "px)"
        };
        g.prototype._transitionTo = function(a, b) {
            this.getPosition();
            var c = this.position.x,
                d = this.position.y,
                e = parseInt(a, 10),
                f = parseInt(b, 10),
                g = e === this.position.x && f === this.position.y;
            if (this.setPosition(a, b), g && !this.isTransitioning) return void this.layoutPosition();
            var h = a - c,
                i = b - d,
                j = {},
                k = this.layout.options;
            h = k.isOriginLeft ? h : -h, i = k.isOriginTop ? i : -i, j.transform = q(h, i), this.transition({
                to: j,
                onTransitionEnd: {
                    transform: this.layoutPosition
                },
                isCleaning: !0
            })
        }, g.prototype.goTo = function(a, b) {
            this.setPosition(a, b), this.layoutPosition()
        }, g.prototype.moveTo = l ? g.prototype._transitionTo : g.prototype.goTo, g.prototype.setPosition = function(a, b) {
            this.position.x = parseInt(a, 10), this.position.y = parseInt(b, 10)
        }, g.prototype._nonTransition = function(a) {
            this.css(a.to), a.isCleaning && this._removeStyles(a.to);
            for (var b in a.onTransitionEnd) a.onTransitionEnd[b].call(this)
        }, g.prototype._transition = function(a) {
            if (!parseFloat(this.layout.options.transitionDuration)) return void this._nonTransition(a);
            var b = this._transn;
            for (var c in a.onTransitionEnd) b.onEnd[c] = a.onTransitionEnd[c];
            for (c in a.to) b.ingProperties[c] = !0, a.isCleaning && (b.clean[c] = !0);
            if (a.from) {
                this.css(a.from);
                var d = this.element.offsetHeight;
                d = null
            }
            this.enableTransition(a.to), this.css(a.to), this.isTransitioning = !0
        };
        var r = k && e.toDashed(k) + ",opacity";
        g.prototype.enableTransition = function() {
            this.isTransitioning || (this.css({
                transitionProperty: r,
                transitionDuration: this.layout.options.transitionDuration
            }), this.element.addEventListener(n, this, !1))
        }, g.prototype.transition = g.prototype[j ? "_transition" : "_nonTransition"], g.prototype.onwebkitTransitionEnd = function(a) {
            this.ontransitionend(a)
        }, g.prototype.onotransitionend = function(a) {
            this.ontransitionend(a)
        };
        var s = {
            "-webkit-transform": "transform",
            "-moz-transform": "transform",
            "-o-transform": "transform"
        };
        g.prototype.ontransitionend = function(a) {
            if (a.target === this.element) {
                var b = this._transn,
                    c = s[a.propertyName] || a.propertyName;
                if (delete b.ingProperties[c], f(b.ingProperties) && this.disableTransition(), c in b.clean && (this.element.style[a.propertyName] = "", delete b.clean[c]), c in b.onEnd) {
                    var d = b.onEnd[c];
                    d.call(this), delete b.onEnd[c]
                }
                this.emitEvent("transitionEnd", [this])
            }
        }, g.prototype.disableTransition = function() {
            this.removeTransitionStyles(), this.element.removeEventListener(n, this, !1), this.isTransitioning = !1
        }, g.prototype._removeStyles = function(a) {
            var b = {};
            for (var c in a) b[c] = "";
            this.css(b)
        };
        var t = {
            transitionProperty: "",
            transitionDuration: ""
        };
        return g.prototype.removeTransitionStyles = function() {
            this.css(t)
        }, g.prototype.removeElem = function() {
            this.element.parentNode.removeChild(this.element), this.css({
                display: ""
            }), this.emitEvent("remove", [this])
        }, g.prototype.remove = function() {
            if (!j || !parseFloat(this.layout.options.transitionDuration)) return void this.removeElem();
            var a = this;
            this.once("transitionEnd", function() {
                a.removeElem()
            }), this.hide()
        }, g.prototype.reveal = function() {
            delete this.isHidden, this.css({
                display: ""
            });
            var a = this.layout.options,
                b = {},
                c = this.getHideRevealTransitionEndProperty("visibleStyle");
            b[c] = this.onRevealTransitionEnd, this.transition({
                from: a.hiddenStyle,
                to: a.visibleStyle,
                isCleaning: !0,
                onTransitionEnd: b
            })
        }, g.prototype.onRevealTransitionEnd = function() {
            this.isHidden || this.emitEvent("reveal")
        }, g.prototype.getHideRevealTransitionEndProperty = function(a) {
            var b = this.layout.options[a];
            if (b.opacity) return "opacity";
            for (var c in b) return c
        }, g.prototype.hide = function() {
            this.isHidden = !0, this.css({
                display: ""
            });
            var a = this.layout.options,
                b = {},
                c = this.getHideRevealTransitionEndProperty("hiddenStyle");
            b[c] = this.onHideTransitionEnd, this.transition({
                from: a.visibleStyle,
                to: a.hiddenStyle,
                isCleaning: !0,
                onTransitionEnd: b
            })
        }, g.prototype.onHideTransitionEnd = function() {
            this.isHidden && (this.css({
                display: "none"
            }), this.emitEvent("hide"))
        }, g.prototype.destroy = function() {
            this.css({
                position: "",
                left: "",
                right: "",
                top: "",
                bottom: "",
                transition: "",
                transform: ""
            })
        }, g
    }),
    function(a, b) {
        "function" == typeof define && define.amd ? define("outlayer/outlayer", ["eventie/eventie", "eventEmitter/EventEmitter", "get-size/get-size", "fizzy-ui-utils/utils", "./item"], function(c, d, e, f, g) {
            return b(a, c, d, e, f, g)
        }) : "object" == typeof exports ? module.exports = b(a, require("eventie"), require("wolfy87-eventemitter"), require("get-size"), require("fizzy-ui-utils"), require("./item")) : a.Outlayer = b(a, a.eventie, a.EventEmitter, a.getSize, a.fizzyUIUtils, a.Outlayer.Item)
    }(window, function(a, b, c, d, e, f) {
        function g(a, b) {
            var c = e.getQueryElement(a);
            if (!c) return void(h && h.error("Bad element for " + this.constructor.namespace + ": " + (c || a)));
            this.element = c, i && (this.$element = i(this.element)), this.options = e.extend({}, this.constructor.defaults), this.option(b);
            var d = ++k;
            this.element.outlayerGUID = d, l[d] = this, this._create(), this.options.isInitLayout && this.layout()
        }
        var h = a.console,
            i = a.jQuery,
            j = function() {},
            k = 0,
            l = {};
        return g.namespace = "outlayer", g.Item = f, g.defaults = {
            containerStyle: {
                position: "relative"
            },
            isInitLayout: !0,
            isOriginLeft: !0,
            isOriginTop: !0,
            isResizeBound: !0,
            isResizingContainer: !0,
            transitionDuration: "0.4s",
            hiddenStyle: {
                opacity: 0,
                transform: "scale(0.001)"
            },
            visibleStyle: {
                opacity: 1,
                transform: "scale(1)"
            }
        }, e.extend(g.prototype, c.prototype), g.prototype.option = function(a) {
            e.extend(this.options, a)
        }, g.prototype._create = function() {
            this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), e.extend(this.element.style, this.options.containerStyle), this.options.isResizeBound && this.bindResize()
        }, g.prototype.reloadItems = function() {
            this.items = this._itemize(this.element.children)
        }, g.prototype._itemize = function(a) {
            for (var b = this._filterFindItemElements(a), c = this.constructor.Item, d = [], e = 0, f = b.length; f > e; e++) {
                var g = b[e],
                    h = new c(g, this);
                d.push(h)
            }
            return d
        }, g.prototype._filterFindItemElements = function(a) {
            return e.filterFindElements(a, this.options.itemSelector)
        }, g.prototype.getItemElements = function() {
            for (var a = [], b = 0, c = this.items.length; c > b; b++) a.push(this.items[b].element);
            return a
        }, g.prototype.layout = function() {
            this._resetLayout(), this._manageStamps();
            var a = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
            this.layoutItems(this.items, a), this._isLayoutInited = !0
        }, g.prototype._init = g.prototype.layout, g.prototype._resetLayout = function() {
            this.getSize()
        }, g.prototype.getSize = function() {
            this.size = d(this.element)
        }, g.prototype._getMeasurement = function(a, b) {
            var c, f = this.options[a];
            f ? ("string" == typeof f ? c = this.element.querySelector(f) : e.isElement(f) && (c = f), this[a] = c ? d(c)[b] : f) : this[a] = 0
        }, g.prototype.layoutItems = function(a, b) {
            a = this._getItemsForLayout(a), this._layoutItems(a, b), this._postLayout()
        }, g.prototype._getItemsForLayout = function(a) {
            for (var b = [], c = 0, d = a.length; d > c; c++) {
                var e = a[c];
                e.isIgnored || b.push(e)
            }
            return b
        }, g.prototype._layoutItems = function(a, b) {
            if (this._emitCompleteOnItems("layout", a), a && a.length) {
                for (var c = [], d = 0, e = a.length; e > d; d++) {
                    var f = a[d],
                        g = this._getItemLayoutPosition(f);
                    g.item = f, g.isInstant = b || f.isLayoutInstant, c.push(g)
                }
                this._processLayoutQueue(c)
            }
        }, g.prototype._getItemLayoutPosition = function() {
            return {
                x: 0,
                y: 0
            }
        }, g.prototype._processLayoutQueue = function(a) {
            for (var b = 0, c = a.length; c > b; b++) {
                var d = a[b];
                this._positionItem(d.item, d.x, d.y, d.isInstant)
            }
        }, g.prototype._positionItem = function(a, b, c, d) {
            d ? a.goTo(b, c) : a.moveTo(b, c)
        }, g.prototype._postLayout = function() {
            this.resizeContainer()
        }, g.prototype.resizeContainer = function() {
            if (this.options.isResizingContainer) {
                var a = this._getContainerSize();
                a && (this._setContainerMeasure(a.width, !0), this._setContainerMeasure(a.height, !1))
            }
        }, g.prototype._getContainerSize = j, g.prototype._setContainerMeasure = function(a, b) {
            if (void 0 !== a) {
                var c = this.size;
                c.isBorderBox && (a += b ? c.paddingLeft + c.paddingRight + c.borderLeftWidth + c.borderRightWidth : c.paddingBottom + c.paddingTop + c.borderTopWidth + c.borderBottomWidth), a = Math.max(a, 0), this.element.style[b ? "width" : "height"] = a + "px"
            }
        }, g.prototype._emitCompleteOnItems = function(a, b) {
            function c() {
                e.emitEvent(a + "Complete", [b])
            }

            function d() {
                g++, g === f && c()
            }
            var e = this,
                f = b.length;
            if (!b || !f) return void c();
            for (var g = 0, h = 0, i = b.length; i > h; h++) {
                var j = b[h];
                j.once(a, d)
            }
        }, g.prototype.ignore = function(a) {
            var b = this.getItem(a);
            b && (b.isIgnored = !0)
        }, g.prototype.unignore = function(a) {
            var b = this.getItem(a);
            b && delete b.isIgnored
        }, g.prototype.stamp = function(a) {
            if (a = this._find(a)) {
                this.stamps = this.stamps.concat(a);
                for (var b = 0, c = a.length; c > b; b++) {
                    var d = a[b];
                    this.ignore(d)
                }
            }
        }, g.prototype.unstamp = function(a) {
            if (a = this._find(a))
                for (var b = 0, c = a.length; c > b; b++) {
                    var d = a[b];
                    e.removeFrom(this.stamps, d), this.unignore(d)
                }
        }, g.prototype._find = function(a) {
            return a ? ("string" == typeof a && (a = this.element.querySelectorAll(a)), a = e.makeArray(a)) : void 0
        }, g.prototype._manageStamps = function() {
            if (this.stamps && this.stamps.length) {
                this._getBoundingRect();
                for (var a = 0, b = this.stamps.length; b > a; a++) {
                    var c = this.stamps[a];
                    this._manageStamp(c)
                }
            }
        }, g.prototype._getBoundingRect = function() {
            var a = this.element.getBoundingClientRect(),
                b = this.size;
            this._boundingRect = {
                left: a.left + b.paddingLeft + b.borderLeftWidth,
                top: a.top + b.paddingTop + b.borderTopWidth,
                right: a.right - (b.paddingRight + b.borderRightWidth),
                bottom: a.bottom - (b.paddingBottom + b.borderBottomWidth)
            }
        }, g.prototype._manageStamp = j, g.prototype._getElementOffset = function(a) {
            var b = a.getBoundingClientRect(),
                c = this._boundingRect,
                e = d(a),
                f = {
                    left: b.left - c.left - e.marginLeft,
                    top: b.top - c.top - e.marginTop,
                    right: c.right - b.right - e.marginRight,
                    bottom: c.bottom - b.bottom - e.marginBottom
                };
            return f
        }, g.prototype.handleEvent = function(a) {
            var b = "on" + a.type;
            this[b] && this[b](a)
        }, g.prototype.bindResize = function() {
            this.isResizeBound || (b.bind(a, "resize", this), this.isResizeBound = !0)
        }, g.prototype.unbindResize = function() {
            this.isResizeBound && b.unbind(a, "resize", this), this.isResizeBound = !1
        }, g.prototype.onresize = function() {
            function a() {
                b.resize(), delete b.resizeTimeout
            }
            this.resizeTimeout && clearTimeout(this.resizeTimeout);
            var b = this;
            this.resizeTimeout = setTimeout(a, 100)
        }, g.prototype.resize = function() {
            this.isResizeBound && this.needsResizeLayout() && this.layout()
        }, g.prototype.needsResizeLayout = function() {
            var a = d(this.element),
                b = this.size && a;
            return b && a.innerWidth !== this.size.innerWidth
        }, g.prototype.addItems = function(a) {
            var b = this._itemize(a);
            return b.length && (this.items = this.items.concat(b)), b
        }, g.prototype.appended = function(a) {
            var b = this.addItems(a);
            b.length && (this.layoutItems(b, !0), this.reveal(b))
        }, g.prototype.prepended = function(a) {
            var b = this._itemize(a);
            if (b.length) {
                var c = this.items.slice(0);
                this.items = b.concat(c), this._resetLayout(), this._manageStamps(), this.layoutItems(b, !0), this.reveal(b), this.layoutItems(c)
            }
        }, g.prototype.reveal = function(a) {
            this._emitCompleteOnItems("reveal", a);
            for (var b = a && a.length, c = 0; b && b > c; c++) {
                var d = a[c];
                d.reveal()
            }
        }, g.prototype.hide = function(a) {
            this._emitCompleteOnItems("hide", a);
            for (var b = a && a.length, c = 0; b && b > c; c++) {
                var d = a[c];
                d.hide()
            }
        }, g.prototype.revealItemElements = function(a) {
            var b = this.getItems(a);
            this.reveal(b)
        }, g.prototype.hideItemElements = function(a) {
            var b = this.getItems(a);
            this.hide(b)
        }, g.prototype.getItem = function(a) {
            for (var b = 0, c = this.items.length; c > b; b++) {
                var d = this.items[b];
                if (d.element === a) return d
            }
        }, g.prototype.getItems = function(a) {
            a = e.makeArray(a);
            for (var b = [], c = 0, d = a.length; d > c; c++) {
                var f = a[c],
                    g = this.getItem(f);
                g && b.push(g)
            }
            return b
        }, g.prototype.remove = function(a) {
            var b = this.getItems(a);
            if (this._emitCompleteOnItems("remove", b), b && b.length)
                for (var c = 0, d = b.length; d > c; c++) {
                    var f = b[c];
                    f.remove(), e.removeFrom(this.items, f)
                }
        }, g.prototype.destroy = function() {
            var a = this.element.style;
            a.height = "", a.position = "", a.width = "";
            for (var b = 0, c = this.items.length; c > b; b++) {
                var d = this.items[b];
                d.destroy()
            }
            this.unbindResize();
            var e = this.element.outlayerGUID;
            delete l[e], delete this.element.outlayerGUID, i && i.removeData(this.element, this.constructor.namespace)
        }, g.data = function(a) {
            a = e.getQueryElement(a);
            var b = a && a.outlayerGUID;
            return b && l[b]
        }, g.create = function(a, b) {
            function c() {
                g.apply(this, arguments)
            }
            return Object.create ? c.prototype = Object.create(g.prototype) : e.extend(c.prototype, g.prototype), c.prototype.constructor = c, c.defaults = e.extend({}, g.defaults), e.extend(c.defaults, b), c.prototype.settings = {}, c.namespace = a, c.data = g.data, c.Item = function() {
                f.apply(this, arguments)
            }, c.Item.prototype = new f, e.htmlInit(c, a), i && i.bridget && i.bridget(a, c), c
        }, g.Item = f, g
    }),
    function(a, b) {
        "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size", "fizzy-ui-utils/utils"], b) : "object" == typeof exports ? module.exports = b(require("outlayer"), require("get-size"), require("fizzy-ui-utils")) : a.Masonry = b(a.Outlayer, a.getSize, a.fizzyUIUtils)
    }(window, function(a, b, c) {
        var d = a.create("masonry");
        return d.prototype._resetLayout = function() {
            this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns();
            var a = this.cols;
            for (this.colYs = []; a--;) this.colYs.push(0);
            this.maxY = 0
        }, d.prototype.measureColumns = function() {
            if (this.getContainerWidth(), !this.columnWidth) {
                var a = this.items[0],
                    c = a && a.element;
                this.columnWidth = c && b(c).outerWidth || this.containerWidth
            }
            var d = this.columnWidth += this.gutter,
                e = this.containerWidth + this.gutter,
                f = e / d,
                g = d - e % d,
                h = g && 1 > g ? "round" : "floor";
            f = Math[h](f), this.cols = Math.max(f, 1)
        }, d.prototype.getContainerWidth = function() {
            var a = this.options.isFitWidth ? this.element.parentNode : this.element,
                c = b(a);
            this.containerWidth = c && c.innerWidth
        }, d.prototype._getItemLayoutPosition = function(a) {
            a.getSize();
            var b = a.size.outerWidth % this.columnWidth,
                d = b && 1 > b ? "round" : "ceil",
                e = Math[d](a.size.outerWidth / this.columnWidth);
            e = Math.min(e, this.cols);
            for (var f = this._getColGroup(e), g = Math.min.apply(Math, f), h = c.indexOf(f, g), i = {
                    x: this.columnWidth * h,
                    y: g
                }, j = g + a.size.outerHeight, k = this.cols + 1 - f.length, l = 0; k > l; l++) this.colYs[h + l] = j;
            return i
        }, d.prototype._getColGroup = function(a) {
            if (2 > a) return this.colYs;
            for (var b = [], c = this.cols + 1 - a, d = 0; c > d; d++) {
                var e = this.colYs.slice(d, d + a);
                b[d] = Math.max.apply(Math, e)
            }
            return b
        }, d.prototype._manageStamp = function(a) {
            var c = b(a),
                d = this._getElementOffset(a),
                e = this.options.isOriginLeft ? d.left : d.right,
                f = e + c.outerWidth,
                g = Math.floor(e / this.columnWidth);
            g = Math.max(0, g);
            var h = Math.floor(f / this.columnWidth);
            h -= f % this.columnWidth ? 0 : 1, h = Math.min(this.cols - 1, h);
            for (var i = (this.options.isOriginTop ? d.top : d.bottom) + c.outerHeight, j = g; h >= j; j++) this.colYs[j] = Math.max(i, this.colYs[j])
        }, d.prototype._getContainerSize = function() {
            this.maxY = Math.max.apply(Math, this.colYs);
            var a = {
                height: this.maxY
            };
            return this.options.isFitWidth && (a.width = this._getContainerFitWidth()), a
        }, d.prototype._getContainerFitWidth = function() {
            for (var a = 0, b = this.cols; --b && 0 === this.colYs[b];) a++;
            return (this.cols - a) * this.columnWidth - this.gutter
        }, d.prototype.needsResizeLayout = function() {
            var a = this.containerWidth;
            return this.getContainerWidth(), a !== this.containerWidth
        }, d
    });
var mediaCheck = function(a) {
    var b, c, d, e, f, g = void 0 !== window.matchMedia;
    if (window.mediaCheckRefresh = function() {}, g) c = function(a, b) {
        a.matches ? "function" == typeof b.entry && b.entry() : "function" == typeof b.exit && b.exit()
    }, (d = function() {
        b = window.matchMedia(a.media), b.addListener(function() {
            c(b, a)
        }), c(b, a)
    })();
    else {
        var h = {};
        c = function(a, b) {
            a.matches ? "function" != typeof b.entry || h[b.media] !== !1 && null != h[b.media] || (b.entry(), h[b.media] = !0) : "function" != typeof b.exit || h[b.media] !== !0 && null != h[b.media] || (b.exit(), h[b.media] = !1)
        }, e = function(a) {
            var b;
            return b = document.createElement("div"),
                b.style.width = "1em", document.body.appendChild(b), a * b.offsetWidth
        }, f = function(a, b) {
            var c;
            switch (b) {
                case "em":
                    c = e(a);
                    break;
                default:
                    c = a
            }
            return c
        };
        for (i in a) h[a.media] = null;
        var j = function() {
            var b = a.media.match(/\((.*)-.*:\s*([\d\.]*)(.*)\)/),
                d = b[1],
                e = f(parseInt(b[2], 10), b[3]),
                g = window.outerWidth || document.documentElement.clientWidth,
                h = {};
            h.matches = "max" === d && e > g || "min" === d && g > e, c(h, a)
        };
        window.addEventListener ? window.addEventListener("resize", j) : window.attachEvent && window.attachEvent("resize", j), j(), window.mediaCheckRefresh = j
    }
};
(function() {
    window.INIT = {
        modules: [],
        register: function(a) {
            return this.modules.push(a)
        },
        start: function() {
            var a, b, c, d, e;
            for (d = this.modules, e = [], b = 0, c = d.length; c > b; b++) a = d[b], e.push(a.init.call(a));
            return e
        }
    }
}).call(this),
    function() {
        window.FOUNDRYLISTING = {
            displayImage: function() {
                var a;
                return a = $(window).width(), a > 480 ? $(".foundry--thumb-link").each(function() {
                    var a, b, c;
                    return b = $(this), c = b.data("src"), a = '<img class="foundry--thumb" src="' + c + '">', b.hasClass("featured--thumb-link") ? void 0 : b.html(a)
                }) : void 0
            },
            feedSubscribeSubmit: function(a) {
                var b;
                return ("undefined" == typeof a || "object" == typeof a) && (a = $("#newsletter--signup").val()), "" !== a ? (b = {
                    email: a,
                    json: !0
                }, $.ajax({
                    type: "post",
                    dataType: "json",
                    url: "/foundry/php/stay_tuned.php",
                    data: b,
                    success: function(a) {
                        return FOUNDRYLISTING.feedSubscribeProcessData(a)
                    }
                })) : void 0
            },
            feedSubscribeAlready: function() {
                var a;
                return "subscribed" === REMEMBER.recall("foundry-feed-status") ? ($(".foundry--newsletter").hide(), a = 'Thanks for subscribing to our email updates. Need more Sparkbox in your life? <a href="https://twitter.com/hearsparkbox" class="foundry-article--meta-link">Follow us on Twitter.</a>', FOUNDRYLISTING.feedSubscribedNotify(a), REMEMBER.recall("foundry-feed-status")) : !1
            },
            feedSubscribeHook: function() {
                return FOUNDRYLISTING.feedSubscribeAlready(), $(".foundry--form.foundry--newsletter").bind("submit", function(a) {
                    return FOUNDRYLISTING.feedSubscribeSubmit(), a.preventDefault()
                })
            },
            feedSubscribeProcessData: function(a) {
                var b;
                return $(".foundry--notify").remove(), "object" != typeof a ? b = "Sorry, it looks like there is something wrong with that email address." : a.success && "false" !== a.success ? (REMEMBER["this"]("foundry-feed-status", "subscribed"), $(".foundry--newsletter").hide(), b = "Thanks for subscribing! Check your inbox for a confirmation email.") : b = "502" === a.errorCode ? "Sorry, it looks like there is something wrong with that email address." : "You're already on our list. Thanks for subscribing!", FOUNDRYLISTING.feedSubscribedNotify(b), b
            },
            feedSubscribedNotify: function(a) {
                var b;
                return b = '<p class="foundry--notify">' + a + "</p>", $(b).insertBefore(".foundry--newsletter")
            },
            init: function() {
                return this.displayImage(), this.feedSubscribeHook()
            }
        }, INIT.register(FOUNDRYLISTING)
    }.call(this),
    function() {
        window.FOUNDRYDETAIL = {
            displayImage: function() {
                var a;
                return a = $(window).width(), a > 544 ? $(".foundry-article--noscript").replaceWith(function() {
                    return this.textContent || this.innerText
                }) : void 0
            },
            createDisplayOptions: function() {
                return $(".foundry-article--content").before('<div class="foundry-article--display-options"></div>'), $(".foundry-article--display-options").html('<ul class="display-options--list">\n  <li class="display-options--item">\n    <a class="display-options--link display-options--selected-link display-options--full-article" href="">Full Article</a>\n  </li>\n  <li class="display-options--item">\n    <a class="display-options--link display-options--quick-read" href="">Quick Read</a>\n  </li>\n</ul>')
            },
            createIntroText: function() {
                var a, b;
                return b = this.$foundryArticleContent.data("intro"), a = '<p class="foundry-article--intro"> ' + b + " </p>", $(".article-image--container").length ? $(".article-image--container").after(a) : $(a).prependTo(this.$foundryArticleContent)
            },
            findHeaders: function() {
                return this.$headerTags.addClass("foundry-article--expandable-header")
            },
            expandableContent: function() {
                return $(".foundry-article--expandable-header").each(function() {
                    return $(this).nextUntil(".foundry-article--expandable-header").wrapAll('<div class="foundry-article--expandable-content"></div>')
                })
            },
            analytics: function() {
                return $(window).on("unload", function() {
                    return ga("send", "event", "Blog Read Ending Style", REMEMBER.recall("reading-style"))
                })
            },
            init: function() {
                return this.analytics(), this.$foundryArticleContent = $(".foundry-article--content"), this.$headerTags = this.$foundryArticleContent.find("h2"), this.createDisplayOptions(), $(".display-options--link").click(function(a) {
                    return a.preventDefault(), $(".display-options--link").each(function() {
                        return $(this).removeClass("display-options--selected-link")
                    }), $(this).hasClass("display-options--quick-read") && ($(this).addClass("display-options--selected-link"), FOUNDRYDETAIL.$foundryArticleContent.removeClass("reading-style--full-article"), FOUNDRYDETAIL.$foundryArticleContent.addClass("reading-style--quick-read"), FOUNDRYDETAIL.$foundryArticleContent.addClass("article--animation"), FOUNDRYDETAIL.$headerTags.each(function() {
                        return $(this).attr("tabindex", "0")
                    }), setTimeout(function() {
                        return FOUNDRYDETAIL.$foundryArticleContent.removeClass("article--animation")
                    }, 500), REMEMBER["this"]("reading-style", "quick")), $(this).hasClass("display-options--full-article") ? ($(this).addClass("display-options--selected-link"), FOUNDRYDETAIL.$foundryArticleContent.removeClass("reading-style--quick-read"), FOUNDRYDETAIL.$foundryArticleContent.addClass("reading-style--full-article"), FOUNDRYDETAIL.$foundryArticleContent.addClass("article--animation"), FOUNDRYDETAIL.$headerTags.each(function() {
                        return $(this).removeAttr("tabindex")
                    }), setTimeout(function() {
                        return FOUNDRYDETAIL.$foundryArticleContent.removeClass("article--animation")
                    }, 500), REMEMBER["this"]("reading-style", "full")) : void 0
                }), "quick" === REMEMBER.recall("reading-style") && $(".display-options--quick-read").click(), this.displayImage(), this.createIntroText(), this.findHeaders(), this.expandableContent(), $(".foundry-article--expandable-header").click(function() {
                    return $(this).toggleClass("expandable-content--is-expanded")
                }), $(".foundry-article--expandable-header").on("keydown", function(a) {
                    var b;
                    return b = a.keyCode, 13 === b || 32 === b ? $(this).toggleClass("expandable-content--is-expanded") : void 0
                })
            }
        }, INIT.register(FOUNDRYDETAIL)
    }.call(this),
    function() {
        window.DEVICESHERO = {
            animationCount: 0,
            analyticsScrollTimeout: 3e4,
            images: [{
                imageNum: 1,
                exitAnimation: "is-animated--bounceOutLeft",
                entranceAnimation: "is-animated--enterLeft",
                enterAt: 40
            }, {
                imageNum: 2,
                exitAnimation: "is-animated--bounceOutUp",
                entranceAnimation: "is-animated--enterDown",
                enterAt: 60
            }, {
                imageNum: 3,
                exitAnimation: "is-animated--bounceOutRight",
                entranceAnimation: "is-animated--enterRight",
                enterAt: 80
            }, {
                imageNum: 4,
                exitAnimation: "is-animated--bounceOutLeft",
                entranceAnimation: "is-animated--enterLeft",
                enterAt: 110
            }, {
                imageNum: 5,
                exitAnimation: "is-animated--bounceOutUp",
                entranceAnimation: "is-animated--enterDown",
                enterAt: 140
            }, {
                imageNum: 6,
                exitAnimation: "is-animated--bounceOutRight",
                entranceAnimation: "is-animated--enterRight",
                enterAt: 180
            }, {
                imageNum: 7,
                exitAnimation: "is-animated--bounceOutLeft",
                entranceAnimation: "is-animated--enterLeft",
                enterAt: 210
            }],
            inScrollRegion: function() {
                return this.scrollTop < this.images[this.images.length - 1].enterAt + 50 ? !0 : void 0
            },
            isScrollingDown: function() {
                var a;
                return a = !1, this.scrollTop > this.scrollFlag && (a = !0), this.scrollFlag = this.scrollTop, a
            },
            doAnimate: function(a, b) {
                var c, d;
                return c = $(".devices-hero--device-" + a), d = c.attr("class").indexOf(DEVICESHERO.images[a - 1][b]), c.attr("class", "" + this.images[a - 1][b] + " is-animated devices-hero--device devices-hero--device-" + a), "exitAnimation" === b && c.attr("class").indexOf(DEVICESHERO.images[a - 1][b]) !== d ? (this.animationCount++, clearTimeout(this.scrollTimer), this.scrollTimer = setTimeout(function() {
                    return DEVICESHERO.submitScrollAnalytics()
                }, DEVICESHERO.analyticsScrollTimeout)) : void 0
            },
            animate: function() {
                var a, b, c, d, e, f, g, h, i, j, k, l;
                if (this.inScrollRegion()) {
                    if (this.isScrollingDown()) {
                        for (g = this.images, j = [], b = g.length - 1; b >= 0; b += -1) a = g[b], this.scrollTop > a.enterAt ? j.push(DEVICESHERO.doAnimate(a.imageNum, "exitAnimation")) : j.push(void 0);
                        return j
                    }
                    for (h = this.images, k = [], c = 0, e = h.length; e > c; c++) a = h[c], this.scrollTop < a.enterAt ? k.push(DEVICESHERO.doAnimate(a.imageNum, "entranceAnimation")) : k.push(void 0);
                    return k
                }
                for (i = this.images, l = [], d = 0, f = i.length; f > d; d++) a = i[d], l.push(DEVICESHERO.doAnimate(a.imageNum, "exitAnimation"));
                return l
            },
            submitScrollAnalytics: function() {
                var a;
                return a = Math.ceil((this.animationCount - this.images.length) / this.images.length), a >= 0 ? (ga("send", "event", "Playing with Device Animation", a), this.animationCount = 0) : void 0
            },
            analytics: function() {
                return $(window).on("unload", function() {
                    return DEVICESHERO.submitScrollAnalytics()
                })
            },
            init: function() {
                var a = this;
                return this.analytics(), $(".devices-hero").length ? (this.window = $(window), this.scrollFlag = $(window).scrollTop(), this.window.on("scroll", function() {
                    return a.scrollTop = $(window).scrollTop(), a.animate()
                })) : void 0
            }
        }, INIT.register(DEVICESHERO)
    }.call(this),
    function() {
        window.FEATUREGALLERY = {
            findGalleryIndex: function(a) {
                return $(".js-feature-gallery")[a]
            },
            gallery: function() {
                var a;
                return a = $(".js-feature-gallery--button"), a.on("click", function(b) {
                    var c, d, e, f;
                    return b.preventDefault(), e = $(this), f = e.data("index"), c = $(".js-feature-gallery").eq(f), d = $(".js-feature-gallery").eq(0 === f ? 1 : 0), a.removeClass("is-active"), e.addClass("is-active"), c.addClass("is_active"), d.removeClass("is_active"), ga("send", "event", "Working with Us Toggle", e.attr("title"))
                }), a.length > 0 ? a.eq(0).click() : void 0
            },
            init: function() {
                return this.gallery()
            }
        }, INIT.register(FEATUREGALLERY)
    }.call(this),
    function() {
        window.TEAM = {
            slideClosed: function(a, b) {
                return "default" === APP.getState() ? (a.addClass("is-transitioning").removeClass("is-open"), a.height(a.height() + b.height()), a.transition({
                    height: a.children(".team-listing--person-wrapper").height()
                }, function() {
                    return a.removeClass("is-transitioning"), a.height("auto")
                })) : a.removeClass("is-open")
            },
            slideOpen: function(a, b) {
                return "default" === APP.getState() ? (a.addClass("is-transitioning"), a.height(a.height()).transition({
                    height: a.height() + b.height()
                }, function() {
                    return a.addClass("is-open").removeClass("is-transitioning"), a.height("auto")
                })) : a.addClass("is-open")
            },
            toggleLinks: function(a) {
                var b, c, d, e, f, g;
                return e = $(a.target), b = e.is(".team-listing--item") ? e : e.closest(".team-listing--item"), c = b.find(".team-listing--links"), f = b.is(".is-open, .is-transitioning"), d = b.find("[tabindex]"), g = "0" === d.attr("tabindex") ? "-1" : "0", d.attr("tabindex", g), f ? TEAM.slideClosed(b, c) : TEAM.slideOpen(b, c)
            },
            init: function() {
                return $(".js_team-listing--person").on("keydown", function(a) {
                    var b;
                    return b = a.keyCode, 13 === b || 32 === b ? TEAM.toggleLinks(a) : void 0
                }), $(".js_team-listing--person").on("click", this.toggleLinks)
            }
        }, INIT.register(TEAM)
    }.call(this),
    function() {
        window.MAPDATA = {
            icons: {
                sparkbox: {
                    iconUrl: "/img/mapbox/marker--sb-hq.png",
                    iconSize: [44, 51],
                    iconAnchor: [22, 51],
                    popupAnchor: [0, -51],
                    className: "map--sb-hq"
                },
                speaking: {
                    iconUrl: "/img/mapbox/marker--speaking.png",
                    iconSize: [44, 51],
                    iconAnchor: [22, 51],
                    popupAnchor: [0, -51],
                    className: "map--speaking"
                },
                buildright: {
                    iconUrl: "/img/mapbox/marker--build-right.png",
                    iconSize: [44, 51],
                    iconAnchor: [22, 51],
                    popupAnchor: [0, -51],
                    className: "map--build-right"
                },
                attending: {
                    iconUrl: "/img/mapbox/marker--attending.png",
                    iconSize: [44, 51],
                    iconAnchor: [22, 51],
                    popupAnchor: [0, -51],
                    className: "map--sb-hq"
                }
            },
            marker: {
                type: "Feature",
                geometry: {
                    type: "Point"
                },
                properties: {}
            }
        }, window.MAP = {
            openPopup: function(a) {
                var b = this;
                return this.map.markerLayer.eachLayer(function(c) {
                    return c.feature.properties.id === a ? (b.map.setView(c.getLatLng(), 6, {
                        pan: {
                            animate: !0
                        }
                    }), c.openPopup()) : void 0
                })
            },
            linkSidebar: function() {
                return $(".map-footer--nav").on("click", ".map-footer--nav-item", function(a) {
                    var b;
                    return MAP.openPopup($(this).data("marker-id")), b = APP.getState(), ("small" === b || "default" === b) && MAP.openCloseNav(), a.preventDefault()
                })
            },
            setEventCount: function(a) {
                return $(".map-footer--event-count").html(a)
            },
            buildKey: function(a, b, c) {
                var d;
                return d = "", a && (d += a), b && (d += b), c ? d += c : void 0
            },
            validCoordinates: function(a) {
                return $.isArray(a) ? 2 !== a.length ? !1 : null === a[0] || null === a[1] || isNaN(a[0]) || isNaN(a[1]) ? !1 : !0 : !1
            },
            plotMarker: function(a) {
                var b, c;
                return a && MAP.validCoordinates(a.coordinates) && (void 0 === a.endDate || a.endDate >= this.today) && (b = a.icon || "attending", c = JSON.parse(JSON.stringify(MAPDATA.marker)), c.geometry.coordinates = a.coordinates, c.properties.icon = JSON.parse(JSON.stringify(MAPDATA.icons[b])), c.properties.description = a.description, c.properties.title = a.title, c.properties.city = a.city, c.properties.state = a.state, c.properties.country = a.country, c.properties.id = MAP.buildKey(a.city, a.state, a.country), c.properties.count = 1, c.properties.people = a.people, c.properties.startDate = a.startDateText), c
            },
            goingToCity: function(a, b) {
                var c, d, e, f, g, h;
                for (d = !1, g = this.markers, e = 0, f = g.length; f > e; e++) c = g[e], (null != c && null != (h = c.properties) ? h.city : void 0) === a && c.properties.state === b && (c.properties.count += 1, c.properties.icon.iconUrl = "/img/mapbox/marker--" + c.properties.count + ".png", d = !0);
                return d
            },
            createMarkers: function() {
                var a, b, c, d, e, f;
                for (this.markers = [], a = 0, f = this.mapLocations, d = 0, e = f.length; e > d; d++) b = f[d], ("Sparkbox Headquarters" === b.title || Date.parse(b.endDateText) > new Date) && (a++, c = this.plotMarker(b), void 0 === c || this.goingToCity(b.city, b.state) || this.markers.push(c));
                return this.map.markerLayer.setGeoJSON(this.markers), this.createPopups(), this.setEventCount(a)
            },
            listTemplate: Handlebars.compile('<ul>\n  {{#each this}}\n    <li>\n      <a href="#" title="View {{title}} on the map" class="map-footer--nav-item {{#if is-highlighted}}map-footer--nav-item_highlighted{{/if}}" data-marker-id="{{city}}{{state}}{{country}}">\n        <h4 class="map-footer--nav-title">{{title}}</h4>\n        {{#if startDate}}\n          {{toFromDate startDateText endDateText}}\n        {{/if}}\n        <span class="map-footer--nav-location">{{city}}{{#if state}}, {{state}}{{/if}}{{#isnt country "United States"}}, {{country}}{{/isnt}} </span>\n      </a>\n    </li>\n  {{/each}}\n</ul>'),
            popupTemplate: Handlebars.compile('{{#if hasMoreThanOne}}\n  <p class="map-footer--popup-title">Events in {{firstLocation.city}}</p>\n{{/if}}\n\n<ul class="map-footer--popup-multi-city--list">\n\n  {{#each locations}}\n    <li>\n      <h1 class="map-footer--popup-title{{#if ../hasMoreThanOne}}_multi-city{{/if}}">\n        <a href="{{ link }}">{{title}}</a>\n      </h1>\n      <div class="map-footer--popup-inner-content">\n\n        {{#if startDateText}}\n          <p class="map-footer--popup-date">{{startDateText}}</p>\n        {{/if}}\n\n        <p>{{{description}}}</p>\n\n        {{#if speakers}}\n          <h2 class="map-footer--popup-subheading">Speaking:</h2>\n          <ul class="map-footer--popup-twitter-listing">\n            {{#each speakers}}\n              <li>\n                <a href="//twitter.com/{{this}}">{{this}}</a>\n              </li>\n            {{/each}}\n          </ul>\n        {{/if}}\n\n        {{#if attendees}}\n          <h2 class="map-footer--popup-subheading">Attending:</h2>\n          <ul class="map-footer--popup-twitter-listing">\n            {{#each attendees}}\n              <li>\n                <a href="//twitter.com/{{this}}">{{this}}</a>\n              </li>\n            {{/each}}\n          </ul>\n        {{/if}}\n\n      </div>\n    </li>\n  {{/each}}\n\n</ul>'),
            popupContent: function(a) {
                var b, c, d, e, f, g, h, i;
                for (b = a.city, f = a.state, c = a.country, e = [], i = this.mapLocations, g = 0, h = i.length; h > g; g++) d = i[g], d.city === b && d.state === f && d.country === c && e.push(d);
                return this.popupTemplate({
                    locations: e,
                    firstLocation: e[0],
                    hasMoreThanOne: a.count > 1
                })
            },
            createPopups: function() {
                var a = this;
                return this.map.markerLayer.eachLayer(function(b) {
                    var c;
                    return c = a.popupContent(b.feature.properties), b.bindPopup(c, {
                        closeButton: !1,
                        offset: new L.Point(0, -55)
                    })
                })
            },
            openCloseNav: function() {
                var a;
                return a = $(".map-footer--map-container"), a.toggleClass("map-footer--map-container_is-open")
            },
            navToggle: function() {
                var a = this;
                return $(".js--map-footer--nav-trigger").click(function(b) {
                    return b.preventDefault(), a.openCloseNav()
                })
            },
            hbHelpers: function() {
                return Handlebars.registerHelper("isnt", function(a, b, c) {
                    return a !== b ? c.fn(this) : c.inverse(this)
                }), Handlebars.registerHelper("toFromDate", function(a, b, c) {
                    var d, e, f, g, h;
                    return d = void 0, e = void 0, f = void 0, g = void 0, h = void 0, f = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], g = new Date(a), d = new Date(b), h = g.getMonth(), e = d.getMonth(), h === e ? g.getDate() === d.getDate() ? new Handlebars.SafeString("" + f[h] + " " + g.getDate() + ", " + g.getFullYear()) : new Handlebars.SafeString("" + f[h] + " " + g.getDate() + " - " + d.getDate() + ", " + g.getFullYear()) : new Handlebars.SafeString("" + f[h].substring(0, 3) + " " + g.getDate() + "- " + f[e].substring(0, 3) + " " + d.getDate() + ", " + d.getFullYear())
                })
            },
            load: function() {
                var a = this;
                return this.today = new Date, this.hbHelpers(), $.ajax({
                    url: "/map-data.json",
                    success: function(b) {
                        var c;
                        a.mapLocations = "object" == typeof b ? b : JSON.parse(b), $(".map-footer--nav").html(a.listTemplate(a.mapLocations));
                        try {
                            return a.map = L.mapbox.map("map", "sparkbox.gig7i1dj"), a.map.markerLayer.on("layeradd", function(a) {
                                var b, c;
                                return c = a.layer, b = c.feature, c.setIcon(L.icon(b.properties.icon))
                            }), a.createMarkers(), a.map.fitBounds(a.map.markerLayer.getBounds(), {
                                padding: [5, 5]
                            }), a.navToggle(), a.map.scrollWheelZoom.disable(), a.setEventCount(), a.linkSidebar(), a.loaded = !0
                        } catch (d) {
                            c = d
                        }
                    }
                })
            }
        }
    }.call(this),
    function() {
        window.SPARKBOXMAP = {
            $map: $("#sparkbox-map"),
            $header: $(".site-header"),
            $footer: $(".site-footer"),
            $window: $(window),
            popupContent: '<p class="map-footer--popup-title">Sparkbox Headquarters</p>\n<div class="map-footer--popup-inner-content">\n  123 Webster St., Dayton, OH 45403\n</div>',
            zoomlevel: function() {
                return Math.floor(2.15 * Math.log(this.$window.width()))
            },
            sizeMap: function() {
                var a, b, c;
                return c = this.$window.height(), b = parseInt(this.$header.css("height"), 10), a = parseInt(this.$footer.css("height"), 10), this.$map.height(c - b - a + "px"), this.map.setView([39.763202, -84.182599], this.zoomlevel())
            },
            addSBPin: function() {
                var a;
                return a = [{
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [-84.182599, 39.763202]
                    },
                    properties: {
                        title: "Sparkbox Headquarters",
                        description: "123 Webster St., Dayton, OH 45403",
                        icon: {
                            iconUrl: "/img/mapbox/marker--sb-hq.png",
                            iconSize: [44, 51],
                            iconAnchor: [22, 51],
                            popupAnchor: [0, -51],
                            className: "map--sb-hq"
                        }
                    }
                }], this.map.markerLayer.setGeoJSON(a)
            },
            createPopup: function() {
                var a = this;
                return this.map.markerLayer.eachLayer(function(b) {
                    return b.bindPopup(a.popupContent, {
                        closeButton: !1,
                        offset: new L.Point(0, -55)
                    })
                })
            },
            changeLinkForAndroid: function() {
                return /Android/.test(navigator.userAgent) ? $(".native-map-link").attr("href", "geo: 39.763202, -84.182599") : void 0
            },
            init: function() {
                var a = this;
                if (this.changeLinkForAndroid(), this.$map.length) {
                    try {
                        this.map = L.mapbox.map("sparkbox-map", "sparkbox.h6e7g4i7"), this.map.markerLayer.on("layeradd", function(a) {
                            var b, c;
                            return c = a.layer, b = c.feature, c.setIcon(L.icon(b.properties.icon))
                        }), this.addSBPin(), this.createPopup(), this.sizeMap()
                    } catch (b) {}
                    return $(window).on("resize", function() {
                        return a.sizeMap()
                    })
                }
            }
        }, INIT.register(SPARKBOXMAP)
    }.call(this),
    function() {
        window.FOOTERTOGGLE = {
            toggleFooter: function() {
                var a, b, c, d = this;
                return c = 500, a = $(".js--site-footer"), b = $(".js--second-footer"), this.$moreFooterTrigger.click(function(e) {
                    return e.preventDefault(), MAP.loaded || MAP.load(), a.toggleClass("site-footer--second-footer_is-open"), b.hasClass("second-footer_is-open") ? (b.removeClass("second-footer_is-open"), d.$moreFooterTrigger.text(d.collapsedText)) : (b.addClass("second-footer_is-open"), $("html, body").animate({
                        scrollTop: $(".js--site-footer--more-trigger-container").offset().top
                    }, c), d.$moreFooterTrigger.text(d.expandedText), ga("send", "event", "More Footer", "Looking at Map"))
                })
            },
            init: function() {
                return this.$moreFooterTrigger = $(".js--site-footer--more-trigger"), this.collapsedText = this.$moreFooterTrigger.text(), this.expandedText = this.$moreFooterTrigger.data("expanded-text"), this.toggleFooter()
            }
        }, INIT.register(FOOTERTOGGLE)
    }.call(this),
    function() {
        window.REMEMBER = {
            "this": function(a, b) {
                return amplify.store(a, b)
            },
            noLonger: function(a) {
                return amplify.store(a, null)
            },
            recall: function(a) {
                return amplify.store(a)
            }
        }
    }.call(this),
    function() {
        window.abNav = {
            $navText: $(".nav-button--text"),
            currentNavVersion: "",
            sendEvent: function(a, b, c) {
                return "function" == typeof ga ? ga("send", "event", a, b, c, 1, {
                    nonInteraction: 1
                }) : void 0
            },
            getThreshold: function() {
                var a;
                return a = $(window).width(), 704 > a ? "small-" + abNav.currentNavVersion : "large-" + abNav.currentNavVersion
            },
            pageLoaded: function() {
                var a;
                return a = "impressions-" + abNav.getThreshold(), abNav.sendEvent("Page Loaded", "no-action", a)
            },
            fireAnalytics: function() {
                return abNav.pageLoaded(), $(".site-nav--item a").on("click", function(a) {
                    var b;
                    return b = "interaction-" + abNav.getThreshold() + "-navigate", abNav.sendEvent("Nav Click", "" + this, b)
                }), $(".nav-button").on("click", function(a) {
                    var b;
                    return b = "interaction-" + abNav.getThreshold() + "-toggle", abNav.sendEvent("Nav Click", "" + this, b)
                })
            },
            navObj: {
                A: "Menu",
                B: "Navigation"
            },
            coinflip: function() {
                var a;
                return a = Math.random(), a >= .5 && (abNav.currentNavVersion = "A"), .5 > a ? abNav.currentNavVersion = "B" : void 0
            },
            optOutOfAbNav: function() {
                var a;
                return a = location.href.match("noAB=true"), a ? abNav.$navText.removeClass("nav-text_hidden") : (abNav.insertRandomNav(), abNav.fireAnalytics())
            },
            createCookie: function() {
                var a, b;
                return a = new Date, a.setTime(a.getTime() + 6048e5), b = a.toUTCString(), document.cookie = "sbNav=" + abNav.currentNavVersion + "; expires=" + a + "; path=/"
            },
            insertRandomNav: function() {
                var a, b;
                return a = document.cookie.match("sbNav"), a ? $.each(document.cookie.split(";"), function(a, b) {
                    var c;
                    return c = b.split("="), c[0].match("sbNav") ? abNav.currentNavVersion = c[1] : void 0
                }) : (abNav.coinflip(), abNav.createCookie()), b = abNav.navObj["" + abNav.currentNavVersion], abNav.$navText.text(b).removeClass("nav-text_hidden")
            },
            init: function() {
                return abNav.optOutOfAbNav()
            }
        }, $(function() {
            return abNav.init()
        })
    }.call(this),
    function() {
        window.APP = {
            getState: function() {
                var a;
                return a = {
                    "10px": "default",
                    "15px": "small",
                    "17px": "largeNav",
                    "20px": "medium",
                    "30px": "large"
                }, window.getComputedStyle ? a[window.getComputedStyle(document.getElementById("sizeTest")).getPropertyValue("font-size")] : a["30px"]
            },
            showMenu: function() {
                return $(".site-nav").toggleClass("site-nav--open"), $(".site-nav--list").toggleClass("site-nav--display"), $(".nav-button").toggleClass("nav-button--open", "nav-button--close"), $(".nav-button").hasClass("nav-button--open") ? ga("send", "event", "Small Screen Navigation", "open") : ga("send", "event", "Small Screen Navigation", "close")
            },
            toggleContact: function(a) {
                var b, c, d;
                return b = $(".contact-info--container").toggleClass("contact-info--display"), $(".site-nav--contact").toggleClass("contact--open"), d = b.is(".contact-info--display") ? 2 : -1, b.find("[tabindex]").attr("tabindex", d), b.is(".contact-info--display") && "keydown" === a && APP.focusContact(), void 0 === c && (c = $.noop), $(".site-nav--contact").hasClass("contact--open") ? c("send", "event", "Contact", "open") : c("send", "event", "Contact", "close")
            },
            focusContact: function() {
                var a, b;
                return a = $(".contact-info--container"), b = a.find("[tabindex]"), b.eq(0).focus()
            },
            resizeText: function() {
                return $().fitText && $("[data-fittext-compression]").each(function() {
                    var a, b, c;
                    return a = $(this), b = a.data("fittext-compression"), c = a.data("fittext-max"), a.fitText(b, {
                        maxFontSize: c + "px"
                    })
                }), $(window).on("resize", function() {
                    return clearTimeout(APP.resizeTimer), APP.resizeTimer = setTimeout(function() {
                        var a;
                        return a = $(window), ga("send", "event", "Browser Resize To", "" + a.width() + " x " + a.height())
                    }, 1e3)
                })
            },
            masonry: function() {
                return $(function() {
                    var a;
                    return a = $(".layout--lab-grid_growing").masonry({
                        itemSelector: ".layout--lab-grid_growing--item",
                        columnWidth: ".layout--lab-grid_growing--grid-sizer",
                        transitionDuration: 0
                    }), a.imagesLoaded(function() {
                        return a.masonry()
                    })
                })
            },
            enableContactToggle: function() {
                return $(".site-nav--contact").on("click.show-contact", function(a) {
                    return APP.toggleContact(a.type), a.preventDefault()
                })
            },
            disableContactToggle: function() {
                return $(".site-nav--contact").off("click.show-contact")
            },
            init: function() {
                return $(document).on("touchstart", function() {}), $(".nav-button").click(function(a) {
                    return APP.showMenu(), a.preventDefault()
                }), $(".site-nav--contact").keydown(function(a) {
                    return 13 === a.keyCode ? (APP.toggleContact("keydown"), a.preventDefault(), a.stopPropagation()) : void 0
                }), mediaCheck({
                    media: "(min-width: 44em)",
                    entry: APP.enableContactToggle,
                    exit: APP.disableContactToggle
                }), "#nav" === window.location.hash && APP.showMenu(), "#contact" === window.location.hash && APP.toggleContact(), $(".video-container").fitVids(), $("#sizeTest").length || $("head").append('<div id="sizeTest">'), APP.resizeText(), APP.masonry(), INIT.start()
            }
        }, $(function() {
            return APP.init()
        })
    }.call(this);
