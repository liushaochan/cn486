/*
 Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.html or http://ckeditor.com/license
 */
(function () {
    if (!window.CKEDITOR || !window.CKEDITOR.dom)window.CKEDITOR || (window.CKEDITOR = function () {
        var c = {timestamp: "E6KH", version: "4.4.2 DEV", revision: "0", rnd: Math.floor(900 * Math.random()) + 100, _: {pending: []}, status: "unloaded", basePath: function () {
            var b = window.CKEDITOR_BASEPATH || "";
            if (!b)for (var a = document.getElementsByTagName("script"), e = 0; e < a.length; e++) {
                var c = a[e].src.match(/(^|.*[\\\/])ckeditor(?:_basic)?(?:_source)?.js(?:\?.*)?$/i);
                if (c) {
                    b = c[1];
                    break
                }
            }
            -1 == b.indexOf(":/") && "//" != b.slice(0, 2) &&
            (b = 0 === b.indexOf("/") ? location.href.match(/^.*?:\/\/[^\/]*/)[0] + b : location.href.match(/^[^\?]*\/(?:)/)[0] + b);
            if (!b)throw'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';
            return b
        }(), getUrl: function (b) {
            -1 == b.indexOf(":/") && 0 !== b.indexOf("/") && (b = this.basePath + b);
            this.timestamp && ("/" != b.charAt(b.length - 1) && !/[&?]t=/.test(b)) && (b += (0 <= b.indexOf("?") ? "&" : "?") + "t=" + this.timestamp);
            return b
        }, domReady: function () {
            function b() {
                try {
                    document.addEventListener ?
                        (document.removeEventListener("DOMContentLoaded", b, !1), a()) : document.attachEvent && "complete" === document.readyState && (document.detachEvent("onreadystatechange", b), a())
                } catch (e) {
                }
            }

            function a() {
                for (var a; a = e.shift();)a()
            }

            var e = [];
            return function (a) {
                e.push(a);
                "complete" === document.readyState && setTimeout(b, 1);
                if (1 == e.length)if (document.addEventListener)document.addEventListener("DOMContentLoaded", b, !1), window.addEventListener("load", b, !1); else if (document.attachEvent) {
                    document.attachEvent("onreadystatechange",
                        b);
                    window.attachEvent("onload", b);
                    a = !1;
                    try {
                        a = !window.frameElement
                    } catch (c) {
                    }
                    if (document.documentElement.doScroll && a) {
                        var d = function () {
                            try {
                                document.documentElement.doScroll("left")
                            } catch (a) {
                                setTimeout(d, 1);
                                return
                            }
                            b()
                        };
                        d()
                    }
                }
            }
        }()}, f = window.CKEDITOR_GETURL;
        if (f) {
            var d = c.getUrl;
            c.getUrl = function (b) {
                return f.call(c, b) || d.call(c, b)
            }
        }
        return c
    }()), CKEDITOR.event || (CKEDITOR.event = function () {
    }, CKEDITOR.event.implementOn = function (c) {
        var f = CKEDITOR.event.prototype, d;
        for (d in f)c[d] == void 0 && (c[d] = f[d])
    }, CKEDITOR.event.prototype =
        function () {
            function c(b) {
                var a = f(this);
                return a[b] || (a[b] = new d(b))
            }

            var f = function (b) {
                b = b.getPrivate && b.getPrivate() || b._ || (b._ = {});
                return b.events || (b.events = {})
            }, d = function (b) {
                this.name = b;
                this.listeners = []
            };
            d.prototype = {getListenerIndex: function (b) {
                for (var a = 0, e = this.listeners; a < e.length; a++)if (e[a].fn == b)return a;
                return-1
            }};
            return{define: function (b, a) {
                var e = c.call(this, b);
                CKEDITOR.tools.extend(e, a, true)
            }, on: function (b, a, e, h, d) {
                function g(j, c, d, n) {
                    j = {name: b, sender: this, editor: j, data: c, listenerData: h,
                        stop: d, cancel: n, removeListener: f};
                    return a.call(e, j) === false ? false : j.data
                }

                function f() {
                    n.removeListener(b, a)
                }

                var j = c.call(this, b);
                if (j.getListenerIndex(a) < 0) {
                    j = j.listeners;
                    e || (e = this);
                    isNaN(d) && (d = 10);
                    var n = this;
                    g.fn = a;
                    g.priority = d;
                    for (var o = j.length - 1; o >= 0; o--)if (j[o].priority <= d) {
                        j.splice(o + 1, 0, g);
                        return{removeListener: f}
                    }
                    j.unshift(g)
                }
                return{removeListener: f}
            }, once: function () {
                var b = arguments[1];
                arguments[1] = function (a) {
                    a.removeListener();
                    return b.apply(this, arguments)
                };
                return this.on.apply(this,
                    arguments)
            }, capture: function () {
                CKEDITOR.event.useCapture = 1;
                var b = this.on.apply(this, arguments);
                CKEDITOR.event.useCapture = 0;
                return b
            }, fire: function () {
                var b = 0, a = function () {
                    b = 1
                }, e = 0, c = function () {
                    e = 1
                };
                return function (d, g, i) {
                    var j = f(this)[d], d = b, n = e;
                    b = e = 0;
                    if (j) {
                        var o = j.listeners;
                        if (o.length)for (var o = o.slice(0), q, l = 0; l < o.length; l++) {
                            if (j.errorProof)try {
                                q = o[l].call(this, i, g, a, c)
                            } catch (m) {
                            } else q = o[l].call(this, i, g, a, c);
                            q === false ? e = 1 : typeof q != "undefined" && (g = q);
                            if (b || e)break
                        }
                    }
                    g = e ? false : typeof g == "undefined" ?
                        true : g;
                    b = d;
                    e = n;
                    return g
                }
            }(), fireOnce: function (b, a, e) {
                a = this.fire(b, a, e);
                delete f(this)[b];
                return a
            }, removeListener: function (b, a) {
                var e = f(this)[b];
                if (e) {
                    var c = e.getListenerIndex(a);
                    c >= 0 && e.listeners.splice(c, 1)
                }
            }, removeAllListeners: function () {
                var b = f(this), a;
                for (a in b)delete b[a]
            }, hasListeners: function (b) {
                return(b = f(this)[b]) && b.listeners.length > 0
            }}
        }()), CKEDITOR.editor || (CKEDITOR.editor = function () {
        CKEDITOR._.pending.push([this, arguments]);
        CKEDITOR.event.call(this)
    }, CKEDITOR.editor.prototype.fire =
        function (c, f) {
            c in{instanceReady: 1, loaded: 1} && (this[c] = true);
            return CKEDITOR.event.prototype.fire.call(this, c, f, this)
        }, CKEDITOR.editor.prototype.fireOnce = function (c, f) {
        c in{instanceReady: 1, loaded: 1} && (this[c] = true);
        return CKEDITOR.event.prototype.fireOnce.call(this, c, f, this)
    }, CKEDITOR.event.implementOn(CKEDITOR.editor.prototype)), CKEDITOR.env || (CKEDITOR.env = function () {
        var c = navigator.userAgent.toLowerCase(), f = {ie: c.indexOf("trident/") > -1, webkit: c.indexOf(" applewebkit/") > -1, air: c.indexOf(" adobeair/") > -1, mac: c.indexOf("macintosh") > -1, quirks: document.compatMode == "BackCompat" && (!document.documentMode || document.documentMode < 10), mobile: c.indexOf("mobile") > -1, iOS: /(ipad|iphone|ipod)/.test(c), isCustomDomain: function () {
            if (!this.ie)return false;
            var a = document.domain, e = window.location.hostname;
            return a != e && a != "[" + e + "]"
        }, secure: location.protocol == "https:"};
        f.gecko = navigator.product == "Gecko" && !f.webkit && !f.ie;
        if (f.webkit)c.indexOf("chrome") > -1 ? f.chrome = true : f.safari = true;
        var d = 0;
        if (f.ie) {
            d = f.quirks || !document.documentMode ?
                parseFloat(c.match(/msie (\d+)/)[1]) : document.documentMode;
            f.ie9Compat = d == 9;
            f.ie8Compat = d == 8;
            f.ie7Compat = d == 7;
            f.ie6Compat = d < 7 || f.quirks
        }
        if (f.gecko) {
            var b = c.match(/rv:([\d\.]+)/);
            if (b) {
                b = b[1].split(".");
                d = b[0] * 1E4 + (b[1] || 0) * 100 + (b[2] || 0) * 1
            }
        }
        f.air && (d = parseFloat(c.match(/ adobeair\/(\d+)/)[1]));
        f.webkit && (d = parseFloat(c.match(/ applewebkit\/(\d+)/)[1]));
        f.version = d;
        f.isCompatible = f.iOS && d >= 534 || !f.mobile && (f.ie && d > 6 || f.gecko && d >= 2E4 || f.air && d >= 1 || f.webkit && d >= 522 || false);
        f.hidpi = window.devicePixelRatio >=
            2;
        f.needsBrFiller = f.gecko || f.webkit || f.ie && d > 10;
        f.needsNbspFiller = f.ie && d < 11;
        f.cssClass = "cke_browser_" + (f.ie ? "ie" : f.gecko ? "gecko" : f.webkit ? "webkit" : "unknown");
        if (f.quirks)f.cssClass = f.cssClass + " cke_browser_quirks";
        if (f.ie)f.cssClass = f.cssClass + (" cke_browser_ie" + (f.quirks ? "6 cke_browser_iequirks" : f.version));
        if (f.air)f.cssClass = f.cssClass + " cke_browser_air";
        if (f.iOS)f.cssClass = f.cssClass + " cke_browser_ios";
        if (f.hidpi)f.cssClass = f.cssClass + " cke_hidpi";
        return f
    }()), "unloaded" == CKEDITOR.status && function () {
        CKEDITOR.event.implementOn(CKEDITOR);
        CKEDITOR.loadFullCore = function () {
            if (CKEDITOR.status != "basic_ready")CKEDITOR.loadFullCore._load = 1; else {
                delete CKEDITOR.loadFullCore;
                var c = document.createElement("script");
                c.type = "text/javascript";
                c.src = CKEDITOR.basePath + "ckeditor.js";
                document.getElementsByTagName("head")[0].appendChild(c)
            }
        };
        CKEDITOR.loadFullCoreTimeout = 0;
        CKEDITOR.add = function (c) {
            (this._.pending || (this._.pending = [])).push(c)
        };
        (function () {
            CKEDITOR.domReady(function () {
                var c = CKEDITOR.loadFullCore, f = CKEDITOR.loadFullCoreTimeout;
                if (c) {
                    CKEDITOR.status =
                        "basic_ready";
                    c && c._load ? c() : f && setTimeout(function () {
                        CKEDITOR.loadFullCore && CKEDITOR.loadFullCore()
                    }, f * 1E3)
                }
            })
        })();
        CKEDITOR.status = "basic_loaded"
    }(), CKEDITOR.dom = {}, function () {
        var c = [], f = CKEDITOR.env.gecko ? "-moz-" : CKEDITOR.env.webkit ? "-webkit-" : CKEDITOR.env.ie ? "-ms-" : "", d = /&/g, b = />/g, a = /</g, e = /"/g, h = /&amp;/g, k = /&gt;/g, g = /&lt;/g, i = /&quot;/g;
        CKEDITOR.on("reset", function () {
            c = []
        });
        CKEDITOR.tools = {arrayCompare: function (a, e) {
            if (!a && !e)return true;
            if (!a || !e || a.length != e.length)return false;
            for (var b = 0; b <
                a.length; b++)if (a[b] != e[b])return false;
            return true
        }, clone: function (a) {
            var e;
            if (a && a instanceof Array) {
                e = [];
                for (var b = 0; b < a.length; b++)e[b] = CKEDITOR.tools.clone(a[b]);
                return e
            }
            if (a === null || typeof a != "object" || a instanceof String || a instanceof Number || a instanceof Boolean || a instanceof Date || a instanceof RegExp)return a;
            e = new a.constructor;
            for (b in a)e[b] = CKEDITOR.tools.clone(a[b]);
            return e
        }, capitalize: function (a, e) {
            return a.charAt(0).toUpperCase() + (e ? a.slice(1) : a.slice(1).toLowerCase())
        }, extend: function (a) {
            var e =
                arguments.length, b, c;
            if (typeof(b = arguments[e - 1]) == "boolean")e--; else if (typeof(b = arguments[e - 2]) == "boolean") {
                c = arguments[e - 1];
                e = e - 2
            }
            for (var l = 1; l < e; l++) {
                var h = arguments[l], d;
                for (d in h)if (b === true || a[d] == void 0)if (!c || d in c)a[d] = h[d]
            }
            return a
        }, prototypedCopy: function (a) {
            var e = function () {
            };
            e.prototype = a;
            return new e
        }, copy: function (a) {
            var e = {}, b;
            for (b in a)e[b] = a[b];
            return e
        }, isArray: function (a) {
            return Object.prototype.toString.call(a) == "[object Array]"
        }, isEmpty: function (a) {
            for (var e in a)if (a.hasOwnProperty(e))return false;
            return true
        }, cssVendorPrefix: function (a, e, b) {
            if (b)return f + a + ":" + e + ";" + a + ":" + e;
            b = {};
            b[a] = e;
            b[f + a] = e;
            return b
        }, cssStyleToDomStyle: function () {
            var a = document.createElement("div").style, e = typeof a.cssFloat != "undefined" ? "cssFloat" : typeof a.styleFloat != "undefined" ? "styleFloat" : "float";
            return function (a) {
                return a == "float" ? e : a.replace(/-./g, function (a) {
                    return a.substr(1).toUpperCase()
                })
            }
        }(), buildStyleHtml: function (a) {
            for (var a = [].concat(a), e, b = [], c = 0; c < a.length; c++)if (e = a[c])/@import|[{}]/.test(e) ? b.push("<style>" +
                e + "</style>") : b.push('<link type="text/css" rel=stylesheet href="' + e + '">');
            return b.join("")
        }, htmlEncode: function (e) {
            return("" + e).replace(d, "&amp;").replace(b, "&gt;").replace(a, "&lt;")
        }, htmlDecode: function (a) {
            return a.replace(h, "&").replace(k, ">").replace(g, "<")
        }, htmlEncodeAttr: function (j) {
            return j.replace(e, "&quot;").replace(a, "&lt;").replace(b, "&gt;")
        }, htmlDecodeAttr: function (a) {
            return a.replace(i, '"').replace(g, "<").replace(k, ">")
        }, getNextNumber: function () {
            var a = 0;
            return function () {
                return++a
            }
        }(),
            getNextId: function () {
                return"cke_" + this.getNextNumber()
            }, override: function (a, e) {
                var b = e(a);
                b.prototype = a.prototype;
                return b
            }, setTimeout: function (a, e, b, c, l) {
                l || (l = window);
                b || (b = l);
                return l.setTimeout(function () {
                    c ? a.apply(b, [].concat(c)) : a.apply(b)
                }, e || 0)
            }, trim: function () {
                var a = /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g;
                return function (e) {
                    return e.replace(a, "")
                }
            }(), ltrim: function () {
                var a = /^[ \t\n\r]+/g;
                return function (e) {
                    return e.replace(a, "")
                }
            }(), rtrim: function () {
                var a = /[ \t\n\r]+$/g;
                return function (e) {
                    return e.replace(a,
                        "")
                }
            }(), indexOf: function (a, e) {
                if (typeof e == "function")for (var b = 0, c = a.length; b < c; b++) {
                    if (e(a[b]))return b
                } else {
                    if (a.indexOf)return a.indexOf(e);
                    b = 0;
                    for (c = a.length; b < c; b++)if (a[b] === e)return b
                }
                return-1
            }, search: function (a, e) {
                var b = CKEDITOR.tools.indexOf(a, e);
                return b >= 0 ? a[b] : null
            }, bind: function (a, e) {
                return function () {
                    return a.apply(e, arguments)
                }
            }, createClass: function (a) {
                var e = a.$, b = a.base, c = a.privates || a._, l = a.proto, a = a.statics;
                !e && (e = function () {
                    b && this.base.apply(this, arguments)
                });
                if (c)var h = e, e = function () {
                    var a =
                        this._ || (this._ = {}), e;
                    for (e in c) {
                        var b = c[e];
                        a[e] = typeof b == "function" ? CKEDITOR.tools.bind(b, this) : b
                    }
                    h.apply(this, arguments)
                };
                if (b) {
                    e.prototype = this.prototypedCopy(b.prototype);
                    e.prototype.constructor = e;
                    e.base = b;
                    e.baseProto = b.prototype;
                    e.prototype.base = function () {
                        this.base = b.prototype.base;
                        b.apply(this, arguments);
                        this.base = arguments.callee
                    }
                }
                l && this.extend(e.prototype, l, true);
                a && this.extend(e, a, true);
                return e
            }, addFunction: function (a, e) {
                return c.push(function () {
                    return a.apply(e || this, arguments)
                }) - 1
            },
            removeFunction: function (a) {
                c[a] = null
            }, callFunction: function (a) {
                var e = c[a];
                return e && e.apply(window, Array.prototype.slice.call(arguments, 1))
            }, cssLength: function () {
                var a = /^-?\d+\.?\d*px$/, e;
                return function (b) {
                    e = CKEDITOR.tools.trim(b + "") + "px";
                    return a.test(e) ? e : b || ""
                }
            }(), convertToPx: function () {
                var a;
                return function (e) {
                    if (!a) {
                        a = CKEDITOR.dom.element.createFromHtml('<div style="position:absolute;left:-9999px;top:-9999px;margin:0px;padding:0px;border:0px;"></div>', CKEDITOR.document);
                        CKEDITOR.document.getBody().append(a)
                    }
                    if (!/%$/.test(e)) {
                        a.setStyle("width",
                            e);
                        return a.$.clientWidth
                    }
                    return e
                }
            }(), repeat: function (a, e) {
                return Array(e + 1).join(a)
            }, tryThese: function () {
                for (var a, e = 0, b = arguments.length; e < b; e++) {
                    var c = arguments[e];
                    try {
                        a = c();
                        break
                    } catch (l) {
                    }
                }
                return a
            }, genKey: function () {
                return Array.prototype.slice.call(arguments).join("-")
            }, defer: function (a) {
                return function () {
                    var e = arguments, b = this;
                    window.setTimeout(function () {
                        a.apply(b, e)
                    }, 0)
                }
            }, normalizeCssText: function (a, e) {
                var b = [], c, l = CKEDITOR.tools.parseCssText(a, true, e);
                for (c in l)b.push(c + ":" + l[c]);
                b.sort();
                return b.length ? b.join(";") + ";" : ""
            }, convertRgbToHex: function (a) {
                return a.replace(/(?:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\))/gi, function (a, e, b, c) {
                    a = [e, b, c];
                    for (e = 0; e < 3; e++)a[e] = ("0" + parseInt(a[e], 10).toString(16)).slice(-2);
                    return"#" + a.join("")
                })
            }, parseCssText: function (a, e, b) {
                var c = {};
                if (b) {
                    b = new CKEDITOR.dom.element("span");
                    b.setAttribute("style", a);
                    a = CKEDITOR.tools.convertRgbToHex(b.getAttribute("style") || "")
                }
                if (!a || a == ";")return c;
                a.replace(/&quot;/g, '"').replace(/\s*([^:;\s]+)\s*:\s*([^;]+)\s*(?=;|$)/g,
                    function (a, b, j) {
                        if (e) {
                            b = b.toLowerCase();
                            b == "font-family" && (j = j.toLowerCase().replace(/["']/g, "").replace(/\s*,\s*/g, ","));
                            j = CKEDITOR.tools.trim(j)
                        }
                        c[b] = j
                    });
                return c
            }, writeCssText: function (a, e) {
                var b, c = [];
                for (b in a)c.push(b + ":" + a[b]);
                e && c.sort();
                return c.join("; ")
            }, objectCompare: function (a, e, b) {
                var c;
                if (!a && !e)return true;
                if (!a || !e)return false;
                for (c in a)if (a[c] != e[c])return false;
                if (!b)for (c in e)if (a[c] != e[c])return false;
                return true
            }, objectKeys: function (a) {
                var e = [], b;
                for (b in a)e.push(b);
                return e
            },
            convertArrayToObject: function (a, e) {
                var b = {};
                arguments.length == 1 && (e = true);
                for (var c = 0, l = a.length; c < l; ++c)b[a[c]] = e;
                return b
            }, fixDomain: function () {
                for (var a; ;)try {
                    a = window.parent.document.domain;
                    break
                } catch (e) {
                    a = a ? a.replace(/.+?(?:\.|$)/, "") : document.domain;
                    if (!a)break;
                    document.domain = a
                }
                return!!a
            }, eventsBuffer: function (a, e) {
                function b() {
                    l = (new Date).getTime();
                    c = false;
                    e()
                }

                var c, l = 0;
                return{input: function () {
                    if (!c) {
                        var e = (new Date).getTime() - l;
                        e < a ? c = setTimeout(b, a - e) : b()
                    }
                }, reset: function () {
                    c && clearTimeout(c);
                    c = l = 0
                }}
            }, enableHtml5Elements: function (a, e) {
                for (var b = ["abbr", "article", "aside", "audio", "bdi", "canvas", "data", "datalist", "details", "figcaption", "figure", "footer", "header", "hgroup", "mark", "meter", "nav", "output", "progress", "section", "summary", "time", "video"], c = b.length, l; c--;) {
                    l = a.createElement(b[c]);
                    e && a.appendChild(l)
                }
            }, checkIfAnyArrayItemMatches: function (a, e) {
                for (var b = 0, c = a.length; b < c; ++b)if (a[b].match(e))return true;
                return false
            }, checkIfAnyObjectPropertyMatches: function (a, e) {
                for (var b in a)if (b.match(e))return true;
                return false
            }, transparentImageData: "data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw=="}
    }(), CKEDITOR.dtd = function () {
        var c = CKEDITOR.tools.extend, f = function (a, e) {
            for (var b = CKEDITOR.tools.clone(a), c = 1; c < arguments.length; c++) {
                var e = arguments[c], h;
                for (h in e)delete b[h]
            }
            return b
        }, d = {}, b = {}, a = {address: 1, article: 1, aside: 1, blockquote: 1, details: 1, div: 1, dl: 1, fieldset: 1, figure: 1, footer: 1, form: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, header: 1, hgroup: 1, hr: 1, menu: 1, nav: 1, ol: 1, p: 1, pre: 1, section: 1,
            table: 1, ul: 1}, e = {command: 1, link: 1, meta: 1, noscript: 1, script: 1, style: 1}, h = {}, k = {"#": 1}, g = {center: 1, dir: 1, noframes: 1};
        c(d, {a: 1, abbr: 1, area: 1, audio: 1, b: 1, bdi: 1, bdo: 1, br: 1, button: 1, canvas: 1, cite: 1, code: 1, command: 1, datalist: 1, del: 1, dfn: 1, em: 1, embed: 1, i: 1, iframe: 1, img: 1, input: 1, ins: 1, kbd: 1, keygen: 1, label: 1, map: 1, mark: 1, meter: 1, noscript: 1, object: 1, output: 1, progress: 1, q: 1, ruby: 1, s: 1, samp: 1, script: 1, select: 1, small: 1, span: 1, strong: 1, sub: 1, sup: 1, textarea: 1, time: 1, u: 1, "var": 1, video: 1, wbr: 1}, k, {acronym: 1, applet: 1,
            basefont: 1, big: 1, font: 1, isindex: 1, strike: 1, style: 1, tt: 1});
        c(b, a, d, g);
        f = {a: f(d, {a: 1, button: 1}), abbr: d, address: b, area: h, article: c({style: 1}, b), aside: c({style: 1}, b), audio: c({source: 1, track: 1}, b), b: d, base: h, bdi: d, bdo: d, blockquote: b, body: b, br: h, button: f(d, {a: 1, button: 1}), canvas: d, caption: b, cite: d, code: d, col: h, colgroup: {col: 1}, command: h, datalist: c({option: 1}, d), dd: b, del: d, details: c({summary: 1}, b), dfn: d, div: c({style: 1}, b), dl: {dt: 1, dd: 1}, dt: b, em: d, embed: h, fieldset: c({legend: 1}, b), figcaption: b, figure: c({figcaption: 1},
            b), footer: b, form: b, h1: d, h2: d, h3: d, h4: d, h5: d, h6: d, head: c({title: 1, base: 1}, e), header: b, hgroup: {h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1}, hr: h, html: c({head: 1, body: 1}, b, e), i: d, iframe: k, img: h, input: h, ins: d, kbd: d, keygen: h, label: d, legend: d, li: b, link: h, map: b, mark: d, menu: c({li: 1}, b), meta: h, meter: f(d, {meter: 1}), nav: b, noscript: c({link: 1, meta: 1, style: 1}, d), object: c({param: 1}, d), ol: {li: 1}, optgroup: {option: 1}, option: k, output: d, p: d, param: h, pre: d, progress: f(d, {progress: 1}), q: d, rp: d, rt: d, ruby: c({rp: 1, rt: 1}, d), s: d, samp: d, script: k,
            section: c({style: 1}, b), select: {optgroup: 1, option: 1}, small: d, source: h, span: d, strong: d, style: k, sub: d, summary: d, sup: d, table: {caption: 1, colgroup: 1, thead: 1, tfoot: 1, tbody: 1, tr: 1}, tbody: {tr: 1}, td: b, textarea: k, tfoot: {tr: 1}, th: b, thead: {tr: 1}, time: f(d, {time: 1}), title: k, tr: {th: 1, td: 1}, track: h, u: d, ul: {li: 1}, "var": d, video: c({source: 1, track: 1}, b), wbr: h, acronym: d, applet: c({param: 1}, b), basefont: h, big: d, center: b, dialog: h, dir: {li: 1}, font: d, isindex: h, noframes: b, strike: d, tt: d};
        c(f, {$block: c({audio: 1, dd: 1, dt: 1, figcaption: 1,
            li: 1, video: 1}, a, g), $blockLimit: {article: 1, aside: 1, audio: 1, body: 1, caption: 1, details: 1, dir: 1, div: 1, dl: 1, fieldset: 1, figcaption: 1, figure: 1, footer: 1, form: 1, header: 1, hgroup: 1, menu: 1, nav: 1, ol: 1, section: 1, table: 1, td: 1, th: 1, tr: 1, ul: 1, video: 1}, $cdata: {script: 1, style: 1}, $editable: {address: 1, article: 1, aside: 1, blockquote: 1, body: 1, details: 1, div: 1, fieldset: 1, figcaption: 1, footer: 1, form: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, header: 1, hgroup: 1, nav: 1, p: 1, pre: 1, section: 1}, $empty: {area: 1, base: 1, basefont: 1, br: 1, col: 1, command: 1,
            dialog: 1, embed: 1, hr: 1, img: 1, input: 1, isindex: 1, keygen: 1, link: 1, meta: 1, param: 1, source: 1, track: 1, wbr: 1}, $inline: d, $list: {dl: 1, ol: 1, ul: 1}, $listItem: {dd: 1, dt: 1, li: 1}, $nonBodyContent: c({body: 1, head: 1, html: 1}, f.head), $nonEditable: {applet: 1, audio: 1, button: 1, embed: 1, iframe: 1, map: 1, object: 1, option: 1, param: 1, script: 1, textarea: 1, video: 1}, $object: {applet: 1, audio: 1, button: 1, hr: 1, iframe: 1, img: 1, input: 1, object: 1, select: 1, table: 1, textarea: 1, video: 1}, $removeEmpty: {abbr: 1, acronym: 1, b: 1, bdi: 1, bdo: 1, big: 1, cite: 1, code: 1,
            del: 1, dfn: 1, em: 1, font: 1, i: 1, ins: 1, label: 1, kbd: 1, mark: 1, meter: 1, output: 1, q: 1, ruby: 1, s: 1, samp: 1, small: 1, span: 1, strike: 1, strong: 1, sub: 1, sup: 1, time: 1, tt: 1, u: 1, "var": 1}, $tabIndex: {a: 1, area: 1, button: 1, input: 1, object: 1, select: 1, textarea: 1}, $tableContent: {caption: 1, col: 1, colgroup: 1, tbody: 1, td: 1, tfoot: 1, th: 1, thead: 1, tr: 1}, $transparent: {a: 1, audio: 1, canvas: 1, del: 1, ins: 1, map: 1, noscript: 1, object: 1, video: 1}, $intermediate: {caption: 1, colgroup: 1, dd: 1, dt: 1, figcaption: 1, legend: 1, li: 1, optgroup: 1, option: 1, rp: 1, rt: 1, summary: 1,
            tbody: 1, td: 1, tfoot: 1, th: 1, thead: 1, tr: 1}});
        return f
    }(), CKEDITOR.dom.event = function (c) {
        this.$ = c
    }, CKEDITOR.dom.event.prototype = {getKey: function () {
        return this.$.keyCode || this.$.which
    }, getKeystroke: function () {
        var c = this.getKey();
        if (this.$.ctrlKey || this.$.metaKey)c = c + CKEDITOR.CTRL;
        this.$.shiftKey && (c = c + CKEDITOR.SHIFT);
        this.$.altKey && (c = c + CKEDITOR.ALT);
        return c
    }, preventDefault: function (c) {
        var f = this.$;
        f.preventDefault ? f.preventDefault() : f.returnValue = false;
        c && this.stopPropagation()
    }, stopPropagation: function () {
        var c =
            this.$;
        c.stopPropagation ? c.stopPropagation() : c.cancelBubble = true
    }, getTarget: function () {
        var c = this.$.target || this.$.srcElement;
        return c ? new CKEDITOR.dom.node(c) : null
    }, getPhase: function () {
        return this.$.eventPhase || 2
    }, getPageOffset: function () {
        var c = this.getTarget().getDocument().$;
        return{x: this.$.pageX || this.$.clientX + (c.documentElement.scrollLeft || c.body.scrollLeft), y: this.$.pageY || this.$.clientY + (c.documentElement.scrollTop || c.body.scrollTop)}
    }}, CKEDITOR.CTRL = 1114112, CKEDITOR.SHIFT = 2228224, CKEDITOR.ALT =
        4456448, CKEDITOR.EVENT_PHASE_CAPTURING = 1, CKEDITOR.EVENT_PHASE_AT_TARGET = 2, CKEDITOR.EVENT_PHASE_BUBBLING = 3, CKEDITOR.dom.domObject = function (c) {
        if (c)this.$ = c
    }, CKEDITOR.dom.domObject.prototype = function () {
        var c = function (c, d) {
            return function (b) {
                typeof CKEDITOR != "undefined" && c.fire(d, new CKEDITOR.dom.event(b))
            }
        };
        return{getPrivate: function () {
            var c;
            if (!(c = this.getCustomData("_")))this.setCustomData("_", c = {});
            return c
        }, on: function (f) {
            var d = this.getCustomData("_cke_nativeListeners");
            if (!d) {
                d = {};
                this.setCustomData("_cke_nativeListeners",
                    d)
            }
            if (!d[f]) {
                d = d[f] = c(this, f);
                this.$.addEventListener ? this.$.addEventListener(f, d, !!CKEDITOR.event.useCapture) : this.$.attachEvent && this.$.attachEvent("on" + f, d)
            }
            return CKEDITOR.event.prototype.on.apply(this, arguments)
        }, removeListener: function (c) {
            CKEDITOR.event.prototype.removeListener.apply(this, arguments);
            if (!this.hasListeners(c)) {
                var d = this.getCustomData("_cke_nativeListeners"), b = d && d[c];
                if (b) {
                    this.$.removeEventListener ? this.$.removeEventListener(c, b, false) : this.$.detachEvent && this.$.detachEvent("on" +
                        c, b);
                    delete d[c]
                }
            }
        }, removeAllListeners: function () {
            var c = this.getCustomData("_cke_nativeListeners"), d;
            for (d in c) {
                var b = c[d];
                this.$.detachEvent ? this.$.detachEvent("on" + d, b) : this.$.removeEventListener && this.$.removeEventListener(d, b, false);
                delete c[d]
            }
            CKEDITOR.event.prototype.removeAllListeners.call(this)
        }}
    }(), function (c) {
        var f = {};
        CKEDITOR.on("reset", function () {
            f = {}
        });
        c.equals = function (c) {
            try {
                return c && c.$ === this.$
            } catch (b) {
                return false
            }
        };
        c.setCustomData = function (c, b) {
            var a = this.getUniqueId();
            (f[a] ||
                (f[a] = {}))[c] = b;
            return this
        };
        c.getCustomData = function (c) {
            var b = this.$["data-cke-expando"];
            return(b = b && f[b]) && c in b ? b[c] : null
        };
        c.removeCustomData = function (c) {
            var b = this.$["data-cke-expando"], b = b && f[b], a, e;
            if (b) {
                a = b[c];
                e = c in b;
                delete b[c]
            }
            return e ? a : null
        };
        c.clearCustomData = function () {
            this.removeAllListeners();
            var c = this.$["data-cke-expando"];
            c && delete f[c]
        };
        c.getUniqueId = function () {
            return this.$["data-cke-expando"] || (this.$["data-cke-expando"] = CKEDITOR.tools.getNextNumber())
        };
        CKEDITOR.event.implementOn(c)
    }(CKEDITOR.dom.domObject.prototype),
        CKEDITOR.dom.node = function (c) {
            return c ? new CKEDITOR.dom[c.nodeType == CKEDITOR.NODE_DOCUMENT ? "document" : c.nodeType == CKEDITOR.NODE_ELEMENT ? "element" : c.nodeType == CKEDITOR.NODE_TEXT ? "text" : c.nodeType == CKEDITOR.NODE_COMMENT ? "comment" : c.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT ? "documentFragment" : "domObject"](c) : this
        }, CKEDITOR.dom.node.prototype = new CKEDITOR.dom.domObject, CKEDITOR.NODE_ELEMENT = 1, CKEDITOR.NODE_DOCUMENT = 9, CKEDITOR.NODE_TEXT = 3, CKEDITOR.NODE_COMMENT = 8, CKEDITOR.NODE_DOCUMENT_FRAGMENT = 11, CKEDITOR.POSITION_IDENTICAL =
        0, CKEDITOR.POSITION_DISCONNECTED = 1, CKEDITOR.POSITION_FOLLOWING = 2, CKEDITOR.POSITION_PRECEDING = 4, CKEDITOR.POSITION_IS_CONTAINED = 8, CKEDITOR.POSITION_CONTAINS = 16, CKEDITOR.tools.extend(CKEDITOR.dom.node.prototype, {appendTo: function (c, f) {
        c.append(this, f);
        return c
    }, clone: function (c, f) {
        var d = this.$.cloneNode(c), b = function (a) {
            a["data-cke-expando"] && (a["data-cke-expando"] = false);
            if (a.nodeType == CKEDITOR.NODE_ELEMENT) {
                f || a.removeAttribute("id", false);
                if (c)for (var a = a.childNodes, e = 0; e < a.length; e++)b(a[e])
            }
        };
        b(d);
        return new CKEDITOR.dom.node(d)
    }, hasPrevious: function () {
        return!!this.$.previousSibling
    }, hasNext: function () {
        return!!this.$.nextSibling
    }, insertAfter: function (c) {
        c.$.parentNode.insertBefore(this.$, c.$.nextSibling);
        return c
    }, insertBefore: function (c) {
        c.$.parentNode.insertBefore(this.$, c.$);
        return c
    }, insertBeforeMe: function (c) {
        this.$.parentNode.insertBefore(c.$, this.$);
        return c
    }, getAddress: function (c) {
        for (var f = [], d = this.getDocument().$.documentElement, b = this.$; b && b != d;) {
            var a = b.parentNode;
            a && f.unshift(this.getIndex.call({$: b},
                c));
            b = a
        }
        return f
    }, getDocument: function () {
        return new CKEDITOR.dom.document(this.$.ownerDocument || this.$.parentNode.ownerDocument)
    }, getIndex: function (c) {
        var f = this.$, d = -1, b;
        if (!this.$.parentNode)return d;
        do if (!c || !(f != this.$ && f.nodeType == CKEDITOR.NODE_TEXT && (b || !f.nodeValue))) {
            d++;
            b = f.nodeType == CKEDITOR.NODE_TEXT
        } while (f = f.previousSibling);
        return d
    }, getNextSourceNode: function (c, f, d) {
        if (d && !d.call)var b = d, d = function (a) {
            return!a.equals(b)
        };
        var c = !c && this.getFirst && this.getFirst(), a;
        if (!c) {
            if (this.type ==
                CKEDITOR.NODE_ELEMENT && d && d(this, true) === false)return null;
            c = this.getNext()
        }
        for (; !c && (a = (a || this).getParent());) {
            if (d && d(a, true) === false)return null;
            c = a.getNext()
        }
        return!c || d && d(c) === false ? null : f && f != c.type ? c.getNextSourceNode(false, f, d) : c
    }, getPreviousSourceNode: function (c, f, d) {
        if (d && !d.call)var b = d, d = function (a) {
            return!a.equals(b)
        };
        var c = !c && this.getLast && this.getLast(), a;
        if (!c) {
            if (this.type == CKEDITOR.NODE_ELEMENT && d && d(this, true) === false)return null;
            c = this.getPrevious()
        }
        for (; !c && (a = (a || this).getParent());) {
            if (d &&
                d(a, true) === false)return null;
            c = a.getPrevious()
        }
        return!c || d && d(c) === false ? null : f && c.type != f ? c.getPreviousSourceNode(false, f, d) : c
    }, getPrevious: function (c) {
        var f = this.$, d;
        do d = (f = f.previousSibling) && f.nodeType != 10 && new CKEDITOR.dom.node(f); while (d && c && !c(d));
        return d
    }, getNext: function (c) {
        var f = this.$, d;
        do d = (f = f.nextSibling) && new CKEDITOR.dom.node(f); while (d && c && !c(d));
        return d
    }, getParent: function (c) {
        var f = this.$.parentNode;
        return f && (f.nodeType == CKEDITOR.NODE_ELEMENT || c && f.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT) ?
            new CKEDITOR.dom.node(f) : null
    }, getParents: function (c) {
        var f = this, d = [];
        do d[c ? "push" : "unshift"](f); while (f = f.getParent());
        return d
    }, getCommonAncestor: function (c) {
        if (c.equals(this))return this;
        if (c.contains && c.contains(this))return c;
        var f = this.contains ? this : this.getParent();
        do if (f.contains(c))return f; while (f = f.getParent());
        return null
    }, getPosition: function (c) {
        var f = this.$, d = c.$;
        if (f.compareDocumentPosition)return f.compareDocumentPosition(d);
        if (f == d)return CKEDITOR.POSITION_IDENTICAL;
        if (this.type ==
            CKEDITOR.NODE_ELEMENT && c.type == CKEDITOR.NODE_ELEMENT) {
            if (f.contains) {
                if (f.contains(d))return CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING;
                if (d.contains(f))return CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING
            }
            if ("sourceIndex"in f)return f.sourceIndex < 0 || d.sourceIndex < 0 ? CKEDITOR.POSITION_DISCONNECTED : f.sourceIndex < d.sourceIndex ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING
        }
        for (var f = this.getAddress(), c = c.getAddress(), d = Math.min(f.length, c.length), b = 0; b <= d - 1; b++)if (f[b] !=
            c[b]) {
            if (b < d)return f[b] < c[b] ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING;
            break
        }
        return f.length < c.length ? CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING
    }, getAscendant: function (c, f) {
        var d = this.$, b;
        if (!f)d = d.parentNode;
        for (; d;) {
            if (d.nodeName && (b = d.nodeName.toLowerCase(), typeof c == "string" ? b == c : b in c))return new CKEDITOR.dom.node(d);
            try {
                d = d.parentNode
            } catch (a) {
                d = null
            }
        }
        return null
    }, hasAscendant: function (c, f) {
        var d = this.$;
        if (!f)d =
            d.parentNode;
        for (; d;) {
            if (d.nodeName && d.nodeName.toLowerCase() == c)return true;
            d = d.parentNode
        }
        return false
    }, move: function (c, f) {
        c.append(this.remove(), f)
    }, remove: function (c) {
        var f = this.$, d = f.parentNode;
        if (d) {
            if (c)for (; c = f.firstChild;)d.insertBefore(f.removeChild(c), f);
            d.removeChild(f)
        }
        return this
    }, replace: function (c) {
        this.insertBefore(c);
        c.remove()
    }, trim: function () {
        this.ltrim();
        this.rtrim()
    }, ltrim: function () {
        for (var c; this.getFirst && (c = this.getFirst());) {
            if (c.type == CKEDITOR.NODE_TEXT) {
                var f = CKEDITOR.tools.ltrim(c.getText()),
                    d = c.getLength();
                if (f) {
                    if (f.length < d) {
                        c.split(d - f.length);
                        this.$.removeChild(this.$.firstChild)
                    }
                } else {
                    c.remove();
                    continue
                }
            }
            break
        }
    }, rtrim: function () {
        for (var c; this.getLast && (c = this.getLast());) {
            if (c.type == CKEDITOR.NODE_TEXT) {
                var f = CKEDITOR.tools.rtrim(c.getText()), d = c.getLength();
                if (f) {
                    if (f.length < d) {
                        c.split(f.length);
                        this.$.lastChild.parentNode.removeChild(this.$.lastChild)
                    }
                } else {
                    c.remove();
                    continue
                }
            }
            break
        }
        if (CKEDITOR.env.needsBrFiller)(c = this.$.lastChild) && (c.type == 1 && c.nodeName.toLowerCase() == "br") &&
        c.parentNode.removeChild(c)
    }, isReadOnly: function () {
        var c = this;
        this.type != CKEDITOR.NODE_ELEMENT && (c = this.getParent());
        if (c && typeof c.$.isContentEditable != "undefined")return!(c.$.isContentEditable || c.data("cke-editable"));
        for (; c;) {
            if (c.data("cke-editable"))break;
            if (c.getAttribute("contentEditable") == "false")return true;
            if (c.getAttribute("contentEditable") == "true")break;
            c = c.getParent()
        }
        return!c
    }}), CKEDITOR.dom.window = function (c) {
        CKEDITOR.dom.domObject.call(this, c)
    }, CKEDITOR.dom.window.prototype = new CKEDITOR.dom.domObject,
        CKEDITOR.tools.extend(CKEDITOR.dom.window.prototype, {focus: function () {
            this.$.focus()
        }, getViewPaneSize: function () {
            var c = this.$.document, f = c.compatMode == "CSS1Compat";
            return{width: (f ? c.documentElement.clientWidth : c.body.clientWidth) || 0, height: (f ? c.documentElement.clientHeight : c.body.clientHeight) || 0}
        }, getScrollPosition: function () {
            var c = this.$;
            if ("pageXOffset"in c)return{x: c.pageXOffset || 0, y: c.pageYOffset || 0};
            c = c.document;
            return{x: c.documentElement.scrollLeft || c.body.scrollLeft || 0, y: c.documentElement.scrollTop ||
                c.body.scrollTop || 0}
        }, getFrame: function () {
            var c = this.$.frameElement;
            return c ? new CKEDITOR.dom.element.get(c) : null
        }}), CKEDITOR.dom.document = function (c) {
        CKEDITOR.dom.domObject.call(this, c)
    }, CKEDITOR.dom.document.prototype = new CKEDITOR.dom.domObject, CKEDITOR.tools.extend(CKEDITOR.dom.document.prototype, {type: CKEDITOR.NODE_DOCUMENT, appendStyleSheet: function (c) {
        if (this.$.createStyleSheet)this.$.createStyleSheet(c); else {
            var f = new CKEDITOR.dom.element("link");
            f.setAttributes({rel: "stylesheet", type: "text/css",
                href: c});
            this.getHead().append(f)
        }
    }, appendStyleText: function (c) {
        if (this.$.createStyleSheet) {
            var f = this.$.createStyleSheet("");
            f.cssText = c
        } else {
            var d = new CKEDITOR.dom.element("style", this);
            d.append(new CKEDITOR.dom.text(c, this));
            this.getHead().append(d)
        }
        return f || d.$.sheet
    }, createElement: function (c, f) {
        var d = new CKEDITOR.dom.element(c, this);
        if (f) {
            f.attributes && d.setAttributes(f.attributes);
            f.styles && d.setStyles(f.styles)
        }
        return d
    }, createText: function (c) {
        return new CKEDITOR.dom.text(c, this)
    }, focus: function () {
        this.getWindow().focus()
    },
        getActive: function () {
            return new CKEDITOR.dom.element(this.$.activeElement)
        }, getById: function (c) {
            return(c = this.$.getElementById(c)) ? new CKEDITOR.dom.element(c) : null
        }, getByAddress: function (c, f) {
            for (var d = this.$.documentElement, b = 0; d && b < c.length; b++) {
                var a = c[b];
                if (f)for (var e = -1, h = 0; h < d.childNodes.length; h++) {
                    var k = d.childNodes[h];
                    if (!(f === true && k.nodeType == 3 && k.previousSibling && k.previousSibling.nodeType == 3)) {
                        e++;
                        if (e == a) {
                            d = k;
                            break
                        }
                    }
                } else d = d.childNodes[a]
            }
            return d ? new CKEDITOR.dom.node(d) : null
        }, getElementsByTag: function (c, f) {
            if ((!CKEDITOR.env.ie || document.documentMode > 8) && f)c = f + ":" + c;
            return new CKEDITOR.dom.nodeList(this.$.getElementsByTagName(c))
        }, getHead: function () {
            var c = this.$.getElementsByTagName("head")[0];
            return c = c ? new CKEDITOR.dom.element(c) : this.getDocumentElement().append(new CKEDITOR.dom.element("head"), true)
        }, getBody: function () {
            return new CKEDITOR.dom.element(this.$.body)
        }, getDocumentElement: function () {
            return new CKEDITOR.dom.element(this.$.documentElement)
        }, getWindow: function () {
            return new CKEDITOR.dom.window(this.$.parentWindow ||
                this.$.defaultView)
        }, write: function (c) {
            this.$.open("text/html", "replace");
            CKEDITOR.env.ie && (c = c.replace(/(?:^\s*<!DOCTYPE[^>]*?>)|^/i, '$&\n<script data-cke-temp="1">(' + CKEDITOR.tools.fixDomain + ")();<\/script>"));
            this.$.write(c);
            this.$.close()
        }, find: function (c) {
            return new CKEDITOR.dom.nodeList(this.$.querySelectorAll(c))
        }, findOne: function (c) {
            return(c = this.$.querySelector(c)) ? new CKEDITOR.dom.element(c) : null
        }, _getHtml5ShivFrag: function () {
            var c = this.getCustomData("html5ShivFrag");
            if (!c) {
                c = this.$.createDocumentFragment();
                CKEDITOR.tools.enableHtml5Elements(c, true);
                this.setCustomData("html5ShivFrag", c)
            }
            return c
        }}), CKEDITOR.dom.nodeList = function (c) {
        this.$ = c
    }, CKEDITOR.dom.nodeList.prototype = {count: function () {
        return this.$.length
    }, getItem: function (c) {
        if (c < 0 || c >= this.$.length)return null;
        return(c = this.$[c]) ? new CKEDITOR.dom.node(c) : null
    }}, CKEDITOR.dom.element = function (c, f) {
        typeof c == "string" && (c = (f ? f.$ : document).createElement(c));
        CKEDITOR.dom.domObject.call(this, c)
    }, CKEDITOR.dom.element.get = function (c) {
        return(c = typeof c ==
            "string" ? document.getElementById(c) || document.getElementsByName(c)[0] : c) && (c.$ ? c : new CKEDITOR.dom.element(c))
    }, CKEDITOR.dom.element.prototype = new CKEDITOR.dom.node, CKEDITOR.dom.element.createFromHtml = function (c, f) {
        var d = new CKEDITOR.dom.element("div", f);
        d.setHtml(c);
        return d.getFirst().remove()
    }, CKEDITOR.dom.element.setMarker = function (c, f, d, b) {
        var a = f.getCustomData("list_marker_id") || f.setCustomData("list_marker_id", CKEDITOR.tools.getNextNumber()).getCustomData("list_marker_id"), e = f.getCustomData("list_marker_names") ||
            f.setCustomData("list_marker_names", {}).getCustomData("list_marker_names");
        c[a] = f;
        e[d] = 1;
        return f.setCustomData(d, b)
    }, CKEDITOR.dom.element.clearAllMarkers = function (c) {
        for (var f in c)CKEDITOR.dom.element.clearMarkers(c, c[f], 1)
    }, CKEDITOR.dom.element.clearMarkers = function (c, f, d) {
        var b = f.getCustomData("list_marker_names"), a = f.getCustomData("list_marker_id"), e;
        for (e in b)f.removeCustomData(e);
        f.removeCustomData("list_marker_names");
        if (d) {
            f.removeCustomData("list_marker_id");
            delete c[a]
        }
    }, function () {
        function c(a) {
            var e =
                true;
            if (!a.$.id) {
                a.$.id = "cke_tmp_" + CKEDITOR.tools.getNextNumber();
                e = false
            }
            return function () {
                e || a.removeAttribute("id")
            }
        }

        function f(a, e) {
            return"#" + a.$.id + " " + e.split(/,\s*/).join(", #" + a.$.id + " ")
        }

        function d(a) {
            for (var e = 0, c = 0, d = b[a].length; c < d; c++)e = e + (parseInt(this.getComputedStyle(b[a][c]) || 0, 10) || 0);
            return e
        }

        CKEDITOR.tools.extend(CKEDITOR.dom.element.prototype, {type: CKEDITOR.NODE_ELEMENT, addClass: function (a) {
            var e = this.$.className;
            e && (RegExp("(?:^|\\s)" + a + "(?:\\s|$)", "").test(e) || (e = e + (" " + a)));
            this.$.className = e || a;
            return this
        }, removeClass: function (a) {
            var e = this.getAttribute("class");
            if (e) {
                a = RegExp("(?:^|\\s+)" + a + "(?=\\s|$)", "i");
                if (a.test(e))(e = e.replace(a, "").replace(/^\s+/, "")) ? this.setAttribute("class", e) : this.removeAttribute("class")
            }
            return this
        }, hasClass: function (a) {
            return RegExp("(?:^|\\s+)" + a + "(?=\\s|$)", "").test(this.getAttribute("class"))
        }, append: function (a, e) {
            typeof a == "string" && (a = this.getDocument().createElement(a));
            e ? this.$.insertBefore(a.$, this.$.firstChild) : this.$.appendChild(a.$);
            return a
        }, appendHtml: function (a) {
            if (this.$.childNodes.length) {
                var e = new CKEDITOR.dom.element("div", this.getDocument());
                e.setHtml(a);
                e.moveChildren(this)
            } else this.setHtml(a)
        }, appendText: function (a) {
            this.$.text != void 0 ? this.$.text = this.$.text + a : this.append(new CKEDITOR.dom.text(a))
        }, appendBogus: function (a) {
            if (a || CKEDITOR.env.needsBrFiller) {
                for (a = this.getLast(); a && a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.rtrim(a.getText());)a = a.getPrevious();
                if (!a || !a.is || !a.is("br")) {
                    a = this.getDocument().createElement("br");
                    CKEDITOR.env.gecko && a.setAttribute("type", "_moz");
                    this.append(a)
                }
            }
        }, breakParent: function (a) {
            var e = new CKEDITOR.dom.range(this.getDocument());
            e.setStartAfter(this);
            e.setEndAfter(a);
            a = e.extractContents();
            e.insertNode(this.remove());
            a.insertAfterNode(this)
        }, contains: CKEDITOR.env.ie || CKEDITOR.env.webkit ? function (a) {
            var e = this.$;
            return a.type != CKEDITOR.NODE_ELEMENT ? e.contains(a.getParent().$) : e != a.$ && e.contains(a.$)
        } : function (a) {
            return!!(this.$.compareDocumentPosition(a.$) & 16)
        }, focus: function () {
            function a() {
                try {
                    this.$.focus()
                } catch (a) {
                }
            }

            return function (e) {
                e ? CKEDITOR.tools.setTimeout(a, 100, this) : a.call(this)
            }
        }(), getHtml: function () {
            var a = this.$.innerHTML;
            return CKEDITOR.env.ie ? a.replace(/<\?[^>]*>/g, "") : a
        }, getOuterHtml: function () {
            if (this.$.outerHTML)return this.$.outerHTML.replace(/<\?[^>]*>/, "");
            var a = this.$.ownerDocument.createElement("div");
            a.appendChild(this.$.cloneNode(true));
            return a.innerHTML
        }, getClientRect: function () {
            var a = CKEDITOR.tools.extend({}, this.$.getBoundingClientRect());
            !a.width && (a.width = a.right - a.left);
            !a.height &&
            (a.height = a.bottom - a.top);
            return a
        }, setHtml: CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? function (a) {
            try {
                var e = this.$;
                if (this.getParent())return e.innerHTML = a;
                var b = this.getDocument()._getHtml5ShivFrag();
                b.appendChild(e);
                e.innerHTML = a;
                b.removeChild(e);
                return a
            } catch (c) {
                this.$.innerHTML = "";
                e = new CKEDITOR.dom.element("body", this.getDocument());
                e.$.innerHTML = a;
                for (e = e.getChildren(); e.count();)this.append(e.getItem(0));
                return a
            }
        } : function (a) {
            return this.$.innerHTML = a
        }, setText: function (a) {
            CKEDITOR.dom.element.prototype.setText =
                    this.$.innerText != void 0 ? function (a) {
                return this.$.innerText = a
            } : function (a) {
                return this.$.textContent = a
            };
            return this.setText(a)
        }, getAttribute: function () {
            var a = function (a) {
                return this.$.getAttribute(a, 2)
            };
            return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function (a) {
                switch (a) {
                    case "class":
                        a = "className";
                        break;
                    case "http-equiv":
                        a = "httpEquiv";
                        break;
                    case "name":
                        return this.$.name;
                    case "tabindex":
                        a = this.$.getAttribute(a, 2);
                        a !== 0 && this.$.tabIndex === 0 && (a = null);
                        return a;
                    case "checked":
                        a =
                            this.$.attributes.getNamedItem(a);
                        return(a.specified ? a.nodeValue : this.$.checked) ? "checked" : null;
                    case "hspace":
                    case "value":
                        return this.$[a];
                    case "style":
                        return this.$.style.cssText;
                    case "contenteditable":
                    case "contentEditable":
                        return this.$.attributes.getNamedItem("contentEditable").specified ? this.$.getAttribute("contentEditable") : null
                }
                return this.$.getAttribute(a, 2)
            } : a
        }(), getChildren: function () {
            return new CKEDITOR.dom.nodeList(this.$.childNodes)
        }, getComputedStyle: CKEDITOR.env.ie ? function (a) {
            return this.$.currentStyle[CKEDITOR.tools.cssStyleToDomStyle(a)]
        } :
            function (a) {
                var e = this.getWindow().$.getComputedStyle(this.$, null);
                return e ? e.getPropertyValue(a) : ""
            }, getDtd: function () {
            var a = CKEDITOR.dtd[this.getName()];
            this.getDtd = function () {
                return a
            };
            return a
        }, getElementsByTag: CKEDITOR.dom.document.prototype.getElementsByTag, getTabIndex: CKEDITOR.env.ie ? function () {
            var a = this.$.tabIndex;
            a === 0 && (!CKEDITOR.dtd.$tabIndex[this.getName()] && parseInt(this.getAttribute("tabindex"), 10) !== 0) && (a = -1);
            return a
        } : CKEDITOR.env.webkit ? function () {
            var a = this.$.tabIndex;
            if (a == void 0) {
                a =
                    parseInt(this.getAttribute("tabindex"), 10);
                isNaN(a) && (a = -1)
            }
            return a
        } : function () {
            return this.$.tabIndex
        }, getText: function () {
            return this.$.textContent || this.$.innerText || ""
        }, getWindow: function () {
            return this.getDocument().getWindow()
        }, getId: function () {
            return this.$.id || null
        }, getNameAtt: function () {
            return this.$.name || null
        }, getName: function () {
            var a = this.$.nodeName.toLowerCase();
            if (CKEDITOR.env.ie && !(document.documentMode > 8)) {
                var e = this.$.scopeName;
                e != "HTML" && (a = e.toLowerCase() + ":" + a)
            }
            return(this.getName =
                function () {
                    return a
                })()
        }, getValue: function () {
            return this.$.value
        }, getFirst: function (a) {
            var e = this.$.firstChild;
            (e = e && new CKEDITOR.dom.node(e)) && (a && !a(e)) && (e = e.getNext(a));
            return e
        }, getLast: function (a) {
            var e = this.$.lastChild;
            (e = e && new CKEDITOR.dom.node(e)) && (a && !a(e)) && (e = e.getPrevious(a));
            return e
        }, getStyle: function (a) {
            return this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)]
        }, is: function () {
            var a = this.getName();
            if (typeof arguments[0] == "object")return!!arguments[0][a];
            for (var e = 0; e < arguments.length; e++)if (arguments[e] ==
                a)return true;
            return false
        }, isEditable: function (a) {
            var e = this.getName();
            if (this.isReadOnly() || this.getComputedStyle("display") == "none" || this.getComputedStyle("visibility") == "hidden" || CKEDITOR.dtd.$nonEditable[e] || CKEDITOR.dtd.$empty[e] || this.is("a") && (this.data("cke-saved-name") || this.hasAttribute("name")) && !this.getChildCount())return false;
            if (a !== false) {
                a = CKEDITOR.dtd[e] || CKEDITOR.dtd.span;
                return!(!a || !a["#"])
            }
            return true
        }, isIdentical: function (a) {
            var e = this.clone(0, 1), a = a.clone(0, 1);
            e.removeAttributes(["_moz_dirty",
                "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]);
            a.removeAttributes(["_moz_dirty", "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]);
            if (e.$.isEqualNode) {
                e.$.style.cssText = CKEDITOR.tools.normalizeCssText(e.$.style.cssText);
                a.$.style.cssText = CKEDITOR.tools.normalizeCssText(a.$.style.cssText);
                return e.$.isEqualNode(a.$)
            }
            e = e.getOuterHtml();
            a = a.getOuterHtml();
            if (CKEDITOR.env.ie && CKEDITOR.env.version < 9 && this.is("a")) {
                var b = this.getParent();
                if (b.type == CKEDITOR.NODE_ELEMENT) {
                    b =
                        b.clone();
                    b.setHtml(e);
                    e = b.getHtml();
                    b.setHtml(a);
                    a = b.getHtml()
                }
            }
            return e == a
        }, isVisible: function () {
            var a = (this.$.offsetHeight || this.$.offsetWidth) && this.getComputedStyle("visibility") != "hidden", e, b;
            if (a && CKEDITOR.env.webkit) {
                e = this.getWindow();
                if (!e.equals(CKEDITOR.document.getWindow()) && (b = e.$.frameElement))a = (new CKEDITOR.dom.element(b)).isVisible()
            }
            return!!a
        }, isEmptyInlineRemoveable: function () {
            if (!CKEDITOR.dtd.$removeEmpty[this.getName()])return false;
            for (var a = this.getChildren(), e = 0, b = a.count(); e <
                b; e++) {
                var c = a.getItem(e);
                if (!(c.type == CKEDITOR.NODE_ELEMENT && c.data("cke-bookmark")) && (c.type == CKEDITOR.NODE_ELEMENT && !c.isEmptyInlineRemoveable() || c.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(c.getText())))return false
            }
            return true
        }, hasAttributes: CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function () {
            for (var a = this.$.attributes, e = 0; e < a.length; e++) {
                var b = a[e];
                switch (b.nodeName) {
                    case "class":
                        if (this.getAttribute("class"))return true;
                    case "data-cke-expando":
                        continue;
                    default:
                        if (b.specified)return true
                }
            }
            return false
        } :
            function () {
                var a = this.$.attributes, e = a.length, b = {"data-cke-expando": 1, _moz_dirty: 1};
                return e > 0 && (e > 2 || !b[a[0].nodeName] || e == 2 && !b[a[1].nodeName])
            }, hasAttribute: function () {
            function a(a) {
                return(a = this.$.attributes.getNamedItem(a)) ? CKEDITOR.env.ie ? a.specified : true : false
            }

            return CKEDITOR.env.ie && CKEDITOR.env.version < 8 ? function (e) {
                return e == "name" ? !!this.$.name : a.call(this, e)
            } : a
        }(), hide: function () {
            this.setStyle("display", "none")
        }, moveChildren: function (a, e) {
            var b = this.$, a = a.$;
            if (b != a) {
                var c;
                if (e)for (; c =
                                 b.lastChild;)a.insertBefore(b.removeChild(c), a.firstChild); else for (; c = b.firstChild;)a.appendChild(b.removeChild(c))
            }
        }, mergeSiblings: function () {
            function a(a, b, c) {
                if (b && b.type == CKEDITOR.NODE_ELEMENT) {
                    for (var d = []; b.data("cke-bookmark") || b.isEmptyInlineRemoveable();) {
                        d.push(b);
                        b = c ? b.getNext() : b.getPrevious();
                        if (!b || b.type != CKEDITOR.NODE_ELEMENT)return
                    }
                    if (a.isIdentical(b)) {
                        for (var f = c ? a.getLast() : a.getFirst(); d.length;)d.shift().move(a, !c);
                        b.moveChildren(a, !c);
                        b.remove();
                        f && f.type == CKEDITOR.NODE_ELEMENT &&
                        f.mergeSiblings()
                    }
                }
            }

            return function (e) {
                if (e === false || CKEDITOR.dtd.$removeEmpty[this.getName()] || this.is("a")) {
                    a(this, this.getNext(), true);
                    a(this, this.getPrevious())
                }
            }
        }(), show: function () {
            this.setStyles({display: "", visibility: ""})
        }, setAttribute: function () {
            var a = function (a, b) {
                this.$.setAttribute(a, b);
                return this
            };
            return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function (b, c) {
                b == "class" ? this.$.className = c : b == "style" ? this.$.style.cssText = c : b == "tabindex" ? this.$.tabIndex = c : b == "checked" ?
                    this.$.checked = c : b == "contenteditable" ? a.call(this, "contentEditable", c) : a.apply(this, arguments);
                return this
            } : CKEDITOR.env.ie8Compat && CKEDITOR.env.secure ? function (b, c) {
                if (b == "src" && c.match(/^http:\/\//))try {
                    a.apply(this, arguments)
                } catch (d) {
                } else a.apply(this, arguments);
                return this
            } : a
        }(), setAttributes: function (a) {
            for (var b in a)this.setAttribute(b, a[b]);
            return this
        }, setValue: function (a) {
            this.$.value = a;
            return this
        }, removeAttribute: function () {
            var a = function (a) {
                this.$.removeAttribute(a)
            };
            return CKEDITOR.env.ie &&
                (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function (a) {
                a == "class" ? a = "className" : a == "tabindex" ? a = "tabIndex" : a == "contenteditable" && (a = "contentEditable");
                this.$.removeAttribute(a)
            } : a
        }(), removeAttributes: function (a) {
            if (CKEDITOR.tools.isArray(a))for (var b = 0; b < a.length; b++)this.removeAttribute(a[b]); else for (b in a)a.hasOwnProperty(b) && this.removeAttribute(b)
        }, removeStyle: function (a) {
            var b = this.$.style;
            if (!b.removeProperty && (a == "border" || a == "margin" || a == "padding")) {
                var c = ["top", "left", "right", "bottom"],
                    d;
                a == "border" && (d = ["color", "style", "width"]);
                for (var b = [], g = 0; g < c.length; g++)if (d)for (var f = 0; f < d.length; f++)b.push([a, c[g], d[f]].join("-")); else b.push([a, c[g]].join("-"));
                for (a = 0; a < b.length; a++)this.removeStyle(b[a])
            } else {
                b.removeProperty ? b.removeProperty(a) : b.removeAttribute(CKEDITOR.tools.cssStyleToDomStyle(a));
                this.$.style.cssText || this.removeAttribute("style")
            }
        }, setStyle: function (a, b) {
            this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)] = b;
            return this
        }, setStyles: function (a) {
            for (var b in a)this.setStyle(b,
                a[b]);
            return this
        }, setOpacity: function (a) {
            if (CKEDITOR.env.ie && CKEDITOR.env.version < 9) {
                a = Math.round(a * 100);
                this.setStyle("filter", a >= 100 ? "" : "progid:DXImageTransform.Microsoft.Alpha(opacity=" + a + ")")
            } else this.setStyle("opacity", a)
        }, unselectable: function () {
            this.setStyles(CKEDITOR.tools.cssVendorPrefix("user-select", "none"));
            if (CKEDITOR.env.ie) {
                this.setAttribute("unselectable", "on");
                for (var a, b = this.getElementsByTag("*"), c = 0, d = b.count(); c < d; c++) {
                    a = b.getItem(c);
                    a.setAttribute("unselectable", "on")
                }
            }
        }, getPositionedAncestor: function () {
            for (var a =
                this; a.getName() != "html";) {
                if (a.getComputedStyle("position") != "static")return a;
                a = a.getParent()
            }
            return null
        }, getDocumentPosition: function (a) {
            var b = 0, c = 0, d = this.getDocument(), g = d.getBody(), f = d.$.compatMode == "BackCompat";
            if (document.documentElement.getBoundingClientRect) {
                var j = this.$.getBoundingClientRect(), n = d.$.documentElement, o = n.clientTop || g.$.clientTop || 0, q = n.clientLeft || g.$.clientLeft || 0, l = true;
                if (CKEDITOR.env.ie) {
                    l = d.getDocumentElement().contains(this);
                    d = d.getBody().contains(this);
                    l = f && d || !f &&
                        l
                }
                if (l) {
                    b = j.left + (!f && n.scrollLeft || g.$.scrollLeft);
                    b = b - q;
                    c = j.top + (!f && n.scrollTop || g.$.scrollTop);
                    c = c - o
                }
            } else {
                g = this;
                for (d = null; g && !(g.getName() == "body" || g.getName() == "html");) {
                    b = b + (g.$.offsetLeft - g.$.scrollLeft);
                    c = c + (g.$.offsetTop - g.$.scrollTop);
                    if (!g.equals(this)) {
                        b = b + (g.$.clientLeft || 0);
                        c = c + (g.$.clientTop || 0)
                    }
                    for (; d && !d.equals(g);) {
                        b = b - d.$.scrollLeft;
                        c = c - d.$.scrollTop;
                        d = d.getParent()
                    }
                    d = g;
                    g = (j = g.$.offsetParent) ? new CKEDITOR.dom.element(j) : null
                }
            }
            if (a) {
                g = this.getWindow();
                d = a.getWindow();
                if (!g.equals(d) &&
                    g.$.frameElement) {
                    a = (new CKEDITOR.dom.element(g.$.frameElement)).getDocumentPosition(a);
                    b = b + a.x;
                    c = c + a.y
                }
            }
            if (!document.documentElement.getBoundingClientRect && CKEDITOR.env.gecko && !f) {
                b = b + (this.$.clientLeft ? 1 : 0);
                c = c + (this.$.clientTop ? 1 : 0)
            }
            return{x: b, y: c}
        }, scrollIntoView: function (a) {
            var b = this.getParent();
            if (b) {
                do {
                    (b.$.clientWidth && b.$.clientWidth < b.$.scrollWidth || b.$.clientHeight && b.$.clientHeight < b.$.scrollHeight) && !b.is("body") && this.scrollIntoParent(b, a, 1);
                    if (b.is("html")) {
                        var c = b.getWindow();
                        try {
                            var d =
                                c.$.frameElement;
                            d && (b = new CKEDITOR.dom.element(d))
                        } catch (g) {
                        }
                    }
                } while (b = b.getParent())
            }
        }, scrollIntoParent: function (a, b, c) {
            var d, g, f, j;

            function n(b, c) {
                if (/body|html/.test(a.getName()))a.getWindow().$.scrollBy(b, c); else {
                    a.$.scrollLeft = a.$.scrollLeft + b;
                    a.$.scrollTop = a.$.scrollTop + c
                }
            }

            function o(a, b) {
                var c = {x: 0, y: 0};
                if (!a.is(l ? "body" : "html")) {
                    var e = a.$.getBoundingClientRect();
                    c.x = e.left;
                    c.y = e.top
                }
                e = a.getWindow();
                if (!e.equals(b)) {
                    e = o(CKEDITOR.dom.element.get(e.$.frameElement), b);
                    c.x = c.x + e.x;
                    c.y = c.y + e.y
                }
                return c
            }

            function q(a, b) {
                return parseInt(a.getComputedStyle("margin-" + b) || 0, 10) || 0
            }

            !a && (a = this.getWindow());
            f = a.getDocument();
            var l = f.$.compatMode == "BackCompat";
            a instanceof CKEDITOR.dom.window && (a = l ? f.getBody() : f.getDocumentElement());
            f = a.getWindow();
            g = o(this, f);
            var m = o(a, f), r = this.$.offsetHeight;
            d = this.$.offsetWidth;
            var t = a.$.clientHeight, p = a.$.clientWidth;
            f = g.x - q(this, "left") - m.x || 0;
            j = g.y - q(this, "top") - m.y || 0;
            d = g.x + d + q(this, "right") - (m.x + p) || 0;
            g = g.y + r + q(this, "bottom") - (m.y + t) || 0;
            if (j < 0 || g > 0)n(0, b === true ?
                j : b === false ? g : j < 0 ? j : g);
            if (c && (f < 0 || d > 0))n(f < 0 ? f : d, 0)
        }, setState: function (a, b, c) {
            b = b || "cke";
            switch (a) {
                case CKEDITOR.TRISTATE_ON:
                    this.addClass(b + "_on");
                    this.removeClass(b + "_off");
                    this.removeClass(b + "_disabled");
                    c && this.setAttribute("aria-pressed", true);
                    c && this.removeAttribute("aria-disabled");
                    break;
                case CKEDITOR.TRISTATE_DISABLED:
                    this.addClass(b + "_disabled");
                    this.removeClass(b + "_off");
                    this.removeClass(b + "_on");
                    c && this.setAttribute("aria-disabled", true);
                    c && this.removeAttribute("aria-pressed");
                    break;
                default:
                    this.addClass(b +
                        "_off");
                    this.removeClass(b + "_on");
                    this.removeClass(b + "_disabled");
                    c && this.removeAttribute("aria-pressed");
                    c && this.removeAttribute("aria-disabled")
            }
        }, getFrameDocument: function () {
            var a = this.$;
            try {
                a.contentWindow.document
            } catch (b) {
                a.src = a.src
            }
            return a && new CKEDITOR.dom.document(a.contentWindow.document)
        }, copyAttributes: function (a, b) {
            for (var c = this.$.attributes, b = b || {}, d = 0; d < c.length; d++) {
                var g = c[d], f = g.nodeName.toLowerCase(), j;
                if (!(f in b))if (f == "checked" && (j = this.getAttribute(f)))a.setAttribute(f, j);
                else if (!CKEDITOR.env.ie || this.hasAttribute(f)) {
                    j = this.getAttribute(f);
                    if (j === null)j = g.nodeValue;
                    a.setAttribute(f, j)
                }
            }
            if (this.$.style.cssText !== "")a.$.style.cssText = this.$.style.cssText
        }, renameNode: function (a) {
            if (this.getName() != a) {
                var b = this.getDocument(), a = new CKEDITOR.dom.element(a, b);
                this.copyAttributes(a);
                this.moveChildren(a);
                this.getParent() && this.$.parentNode.replaceChild(a.$, this.$);
                a.$["data-cke-expando"] = this.$["data-cke-expando"];
                this.$ = a.$;
                delete this.getName
            }
        }, getChild: function () {
            function a(a, b) {
                var c = a.childNodes;
                if (b >= 0 && b < c.length)return c[b]
            }

            return function (b) {
                var c = this.$;
                if (b.slice)for (; b.length > 0 && c;)c = a(c, b.shift()); else c = a(c, b);
                return c ? new CKEDITOR.dom.node(c) : null
            }
        }(), getChildCount: function () {
            return this.$.childNodes.length
        }, disableContextMenu: function () {
            this.on("contextmenu", function (a) {
                a.data.getTarget().hasClass("cke_enable_context_menu") || a.data.preventDefault()
            })
        }, getDirection: function (a) {
            return a ? this.getComputedStyle("direction") || this.getDirection() || this.getParent() &&
                this.getParent().getDirection(1) || this.getDocument().$.dir || "ltr" : this.getStyle("direction") || this.getAttribute("dir")
        }, data: function (a, b) {
            a = "data-" + a;
            if (b === void 0)return this.getAttribute(a);
            b === false ? this.removeAttribute(a) : this.setAttribute(a, b);
            return null
        }, getEditor: function () {
            var a = CKEDITOR.instances, b, c;
            for (b in a) {
                c = a[b];
                if (c.element.equals(this) && c.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO)return c
            }
            return null
        }, find: function (a) {
            var b = c(this), a = new CKEDITOR.dom.nodeList(this.$.querySelectorAll(f(this,
                a)));
            b();
            return a
        }, findOne: function (a) {
            var b = c(this), a = this.$.querySelector(f(this, a));
            b();
            return a ? new CKEDITOR.dom.element(a) : null
        }, forEach: function (a, b, c) {
            if (!c && (!b || this.type == b))var d = a(this);
            if (d !== false)for (var c = this.getChildren(), g = 0; g < c.count(); g++) {
                d = c.getItem(g);
                d.type == CKEDITOR.NODE_ELEMENT ? d.forEach(a, b) : (!b || d.type == b) && a(d)
            }
        }});
        var b = {width: ["border-left-width", "border-right-width", "padding-left", "padding-right"], height: ["border-top-width", "border-bottom-width", "padding-top", "padding-bottom"]};
        CKEDITOR.dom.element.prototype.setSize = function (a, b, c) {
            if (typeof b == "number") {
                if (c && (!CKEDITOR.env.ie || !CKEDITOR.env.quirks))b = b - d.call(this, a);
                this.setStyle(a, b + "px")
            }
        };
        CKEDITOR.dom.element.prototype.getSize = function (a, b) {
            var c = Math.max(this.$["offset" + CKEDITOR.tools.capitalize(a)], this.$["client" + CKEDITOR.tools.capitalize(a)]) || 0;
            b && (c = c - d.call(this, a));
            return c
        }
    }(), CKEDITOR.dom.documentFragment = function (c) {
        c = c || CKEDITOR.document;
        this.$ = c.type == CKEDITOR.NODE_DOCUMENT ? c.$.createDocumentFragment() :
            c
    }, CKEDITOR.tools.extend(CKEDITOR.dom.documentFragment.prototype, CKEDITOR.dom.element.prototype, {type: CKEDITOR.NODE_DOCUMENT_FRAGMENT, insertAfterNode: function (c) {
        c = c.$;
        c.parentNode.insertBefore(this.$, c.nextSibling)
    }}, !0, {append: 1, appendBogus: 1, getFirst: 1, getLast: 1, getParent: 1, getNext: 1, getPrevious: 1, appendTo: 1, moveChildren: 1, insertBefore: 1, insertAfterNode: 1, replace: 1, trim: 1, type: 1, ltrim: 1, rtrim: 1, getDocument: 1, getChildCount: 1, getChild: 1, getChildren: 1}), function () {
        function c(a, b) {
            var c = this.range;
            if (this._.end)return null;
            if (!this._.start) {
                this._.start = 1;
                if (c.collapsed) {
                    this.end();
                    return null
                }
                c.optimize()
            }
            var e, j = c.startContainer;
            e = c.endContainer;
            var d = c.startOffset, g = c.endOffset, f, h = this.guard, k = this.type, i = a ? "getPreviousSourceNode" : "getNextSourceNode";
            if (!a && !this._.guardLTR) {
                var y = e.type == CKEDITOR.NODE_ELEMENT ? e : e.getParent(), v = e.type == CKEDITOR.NODE_ELEMENT ? e.getChild(g) : e.getNext();
                this._.guardLTR = function (a, b) {
                    return(!b || !y.equals(a)) && (!v || !a.equals(v)) && (a.type != CKEDITOR.NODE_ELEMENT || !b || !a.equals(c.root))
                }
            }
            if (a && !this._.guardRTL) {
                var A = j.type == CKEDITOR.NODE_ELEMENT ? j : j.getParent(), B = j.type == CKEDITOR.NODE_ELEMENT ? d ? j.getChild(d - 1) : null : j.getPrevious();
                this._.guardRTL = function (a, b) {
                    return(!b || !A.equals(a)) && (!B || !a.equals(B)) && (a.type != CKEDITOR.NODE_ELEMENT || !b || !a.equals(c.root))
                }
            }
            var E = a ? this._.guardRTL : this._.guardLTR;
            f = h ? function (a, b) {
                return E(a, b) === false ? false : h(a, b)
            } : E;
            if (this.current)e = this.current[i](false, k, f); else {
                if (a)e.type == CKEDITOR.NODE_ELEMENT && (e = g > 0 ? e.getChild(g -
                    1) : f(e, true) === false ? null : e.getPreviousSourceNode(true, k, f)); else {
                    e = j;
                    if (e.type == CKEDITOR.NODE_ELEMENT && !(e = e.getChild(d)))e = f(j, true) === false ? null : j.getNextSourceNode(true, k, f)
                }
                e && f(e) === false && (e = null)
            }
            for (; e && !this._.end;) {
                this.current = e;
                if (!this.evaluator || this.evaluator(e) !== false) {
                    if (!b)return e
                } else if (b && this.evaluator)return false;
                e = e[i](false, k, f)
            }
            this.end();
            return this.current = null
        }

        function f(a) {
            for (var b, e = null; b = c.call(this, a);)e = b;
            return e
        }

        function d(a) {
            if (i(a))return false;
            if (a.type ==
                CKEDITOR.NODE_TEXT)return true;
            if (a.type == CKEDITOR.NODE_ELEMENT) {
                if (a.is(CKEDITOR.dtd.$inline) || a.is("hr") || a.getAttribute("contenteditable") == "false")return true;
                var b;
                if (b = !CKEDITOR.env.needsBrFiller)if (b = a.is(j))a:{
                    b = 0;
                    for (var c = a.getChildCount(); b < c; ++b)if (!i(a.getChild(b))) {
                        b = false;
                        break a
                    }
                    b = true
                }
                if (b)return true
            }
            return false
        }

        CKEDITOR.dom.walker = CKEDITOR.tools.createClass({$: function (a) {
            this.range = a;
            this._ = {}
        }, proto: {end: function () {
            this._.end = 1
        }, next: function () {
            return c.call(this)
        }, previous: function () {
            return c.call(this,
                1)
        }, checkForward: function () {
            return c.call(this, 0, 1) !== false
        }, checkBackward: function () {
            return c.call(this, 1, 1) !== false
        }, lastForward: function () {
            return f.call(this)
        }, lastBackward: function () {
            return f.call(this, 1)
        }, reset: function () {
            delete this.current;
            this._ = {}
        }}});
        var b = {block: 1, "list-item": 1, table: 1, "table-row-group": 1, "table-header-group": 1, "table-footer-group": 1, "table-row": 1, "table-column-group": 1, "table-column": 1, "table-cell": 1, "table-caption": 1}, a = {absolute: 1, fixed: 1};
        CKEDITOR.dom.element.prototype.isBlockBoundary =
            function (c) {
                return this.getComputedStyle("float") == "none" && !(this.getComputedStyle("position")in a) && b[this.getComputedStyle("display")] ? true : !!(this.is(CKEDITOR.dtd.$block) || c && this.is(c))
            };
        CKEDITOR.dom.walker.blockBoundary = function (a) {
            return function (b) {
                return!(b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary(a))
            }
        };
        CKEDITOR.dom.walker.listItemBoundary = function () {
            return this.blockBoundary({br: 1})
        };
        CKEDITOR.dom.walker.bookmark = function (a, b) {
            function c(a) {
                return a && a.getName && a.getName() == "span" &&
                    a.data("cke-bookmark")
            }

            return function (e) {
                var j, d;
                j = e && e.type != CKEDITOR.NODE_ELEMENT && (d = e.getParent()) && c(d);
                j = a ? j : j || c(e);
                return!!(b ^ j)
            }
        };
        CKEDITOR.dom.walker.whitespaces = function (a) {
            return function (b) {
                var c;
                b && b.type == CKEDITOR.NODE_TEXT && (c = !CKEDITOR.tools.trim(b.getText()) || CKEDITOR.env.webkit && b.getText() == "​");
                return!!(a ^ c)
            }
        };
        CKEDITOR.dom.walker.invisible = function (a) {
            var b = CKEDITOR.dom.walker.whitespaces();
            return function (c) {
                if (b(c))c = 1; else {
                    c.type == CKEDITOR.NODE_TEXT && (c = c.getParent());
                    c = !c.$.offsetHeight
                }
                return!!(a ^
                    c)
            }
        };
        CKEDITOR.dom.walker.nodeType = function (a, b) {
            return function (c) {
                return!!(b ^ c.type == a)
            }
        };
        CKEDITOR.dom.walker.bogus = function (a) {
            function b(a) {
                return!h(a) && !k(a)
            }

            return function (c) {
                var j = CKEDITOR.env.needsBrFiller ? c.is && c.is("br") : c.getText && e.test(c.getText());
                if (j) {
                    j = c.getParent();
                    c = c.getNext(b);
                    j = j.isBlockBoundary() && (!c || c.type == CKEDITOR.NODE_ELEMENT && c.isBlockBoundary())
                }
                return!!(a ^ j)
            }
        };
        CKEDITOR.dom.walker.temp = function (a) {
            return function (b) {
                b.type != CKEDITOR.NODE_ELEMENT && (b = b.getParent());
                b =
                    b && b.hasAttribute("data-cke-temp");
                return!!(a ^ b)
            }
        };
        var e = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/, h = CKEDITOR.dom.walker.whitespaces(), k = CKEDITOR.dom.walker.bookmark(), g = CKEDITOR.dom.walker.temp();
        CKEDITOR.dom.walker.ignored = function (a) {
            return function (b) {
                b = h(b) || k(b) || g(b);
                return!!(a ^ b)
            }
        };
        var i = CKEDITOR.dom.walker.ignored(), j = function (a) {
            var b = {}, c;
            for (c in a)CKEDITOR.dtd[c]["#"] && (b[c] = 1);
            return b
        }(CKEDITOR.dtd.$block);
        CKEDITOR.dom.walker.editable = function (a) {
            return function (b) {
                return!!(a ^ d(b))
            }
        };
        CKEDITOR.dom.element.prototype.getBogus =
            function () {
                var a = this;
                do a = a.getPreviousSourceNode(); while (k(a) || h(a) || a.type == CKEDITOR.NODE_ELEMENT && a.is(CKEDITOR.dtd.$inline) && !a.is(CKEDITOR.dtd.$empty));
                return a && (CKEDITOR.env.needsBrFiller ? a.is && a.is("br") : a.getText && e.test(a.getText())) ? a : false
            }
    }(), CKEDITOR.dom.range = function (c) {
        this.endOffset = this.endContainer = this.startOffset = this.startContainer = null;
        this.collapsed = true;
        var f = c instanceof CKEDITOR.dom.document;
        this.document = f ? c : c.getDocument();
        this.root = f ? c.getBody() : c
    }, function () {
        function c() {
            var a =
                false, b = CKEDITOR.dom.walker.whitespaces(), c = CKEDITOR.dom.walker.bookmark(true), d = CKEDITOR.dom.walker.bogus();
            return function (l) {
                if (c(l) || b(l))return true;
                if (d(l) && !a)return a = true;
                return l.type == CKEDITOR.NODE_TEXT && (l.hasAscendant("pre") || CKEDITOR.tools.trim(l.getText()).length) || l.type == CKEDITOR.NODE_ELEMENT && !l.is(e) ? false : true
            }
        }

        function f(a) {
            var b = CKEDITOR.dom.walker.whitespaces(), c = CKEDITOR.dom.walker.bookmark(1);
            return function (e) {
                return c(e) || b(e) ? true : !a && h(e) || e.type == CKEDITOR.NODE_ELEMENT &&
                    e.is(CKEDITOR.dtd.$removeEmpty)
            }
        }

        function d(a) {
            return function () {
                var b;
                return this[a ? "getPreviousNode" : "getNextNode"](function (a) {
                    !b && i(a) && (b = a);
                    return g(a) && !(h(a) && a.equals(b))
                })
            }
        }

        var b = function (a) {
            a.collapsed = a.startContainer && a.endContainer && a.startContainer.equals(a.endContainer) && a.startOffset == a.endOffset
        }, a = function (a, b, c, e) {
            a.optimizeBookmark();
            var d = a.startContainer, g = a.endContainer, f = a.startOffset, h = a.endOffset, k, i;
            if (g.type == CKEDITOR.NODE_TEXT)g = g.split(h); else if (g.getChildCount() > 0)if (h >=
                g.getChildCount()) {
                g = g.append(a.document.createText(""));
                i = true
            } else g = g.getChild(h);
            if (d.type == CKEDITOR.NODE_TEXT) {
                d.split(f);
                d.equals(g) && (g = d.getNext())
            } else if (f)if (f >= d.getChildCount()) {
                d = d.append(a.document.createText(""));
                k = true
            } else d = d.getChild(f).getPrevious(); else {
                d = d.append(a.document.createText(""), 1);
                k = true
            }
            var f = d.getParents(), h = g.getParents(), s, x, y;
            for (s = 0; s < f.length; s++) {
                x = f[s];
                y = h[s];
                if (!x.equals(y))break
            }
            for (var v = c, A, B, E, F = s; F < f.length; F++) {
                A = f[F];
                v && !A.equals(d) && (B = v.append(A.clone()));
                for (A = A.getNext(); A;) {
                    if (A.equals(h[F]) || A.equals(g))break;
                    E = A.getNext();
                    if (b == 2)v.append(A.clone(true)); else {
                        A.remove();
                        b == 1 && v.append(A)
                    }
                    A = E
                }
                v && (v = B)
            }
            v = c;
            for (c = s; c < h.length; c++) {
                A = h[c];
                b > 0 && !A.equals(g) && (B = v.append(A.clone()));
                if (!f[c] || A.$.parentNode != f[c].$.parentNode)for (A = A.getPrevious(); A;) {
                    if (A.equals(f[c]) || A.equals(d))break;
                    E = A.getPrevious();
                    if (b == 2)v.$.insertBefore(A.$.cloneNode(true), v.$.firstChild); else {
                        A.remove();
                        b == 1 && v.$.insertBefore(A.$, v.$.firstChild)
                    }
                    A = E
                }
                v && (v = B)
            }
            if (b == 2) {
                x = a.startContainer;
                if (x.type == CKEDITOR.NODE_TEXT) {
                    x.$.data = x.$.data + x.$.nextSibling.data;
                    x.$.parentNode.removeChild(x.$.nextSibling)
                }
                a = a.endContainer;
                if (a.type == CKEDITOR.NODE_TEXT && a.$.nextSibling) {
                    a.$.data = a.$.data + a.$.nextSibling.data;
                    a.$.parentNode.removeChild(a.$.nextSibling)
                }
            } else {
                if (x && y && (d.$.parentNode != x.$.parentNode || g.$.parentNode != y.$.parentNode)) {
                    b = y.getIndex();
                    k && y.$.parentNode == d.$.parentNode && b--;
                    if (e && x.type == CKEDITOR.NODE_ELEMENT) {
                        e = CKEDITOR.dom.element.createFromHtml('<span data-cke-bookmark="1" style="display:none">&nbsp;</span>',
                            a.document);
                        e.insertAfter(x);
                        x.mergeSiblings(false);
                        a.moveToBookmark({startNode: e})
                    } else a.setStart(y.getParent(), b)
                }
                a.collapse(true)
            }
            k && d.remove();
            i && g.$.parentNode && g.remove()
        }, e = {abbr: 1, acronym: 1, b: 1, bdo: 1, big: 1, cite: 1, code: 1, del: 1, dfn: 1, em: 1, font: 1, i: 1, ins: 1, label: 1, kbd: 1, q: 1, samp: 1, small: 1, span: 1, strike: 1, strong: 1, sub: 1, sup: 1, tt: 1, u: 1, "var": 1}, h = CKEDITOR.dom.walker.bogus(), k = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/, g = CKEDITOR.dom.walker.editable(), i = CKEDITOR.dom.walker.ignored(true);
        CKEDITOR.dom.range.prototype =
        {clone: function () {
            var a = new CKEDITOR.dom.range(this.root);
            a.startContainer = this.startContainer;
            a.startOffset = this.startOffset;
            a.endContainer = this.endContainer;
            a.endOffset = this.endOffset;
            a.collapsed = this.collapsed;
            return a
        }, collapse: function (a) {
            if (a) {
                this.endContainer = this.startContainer;
                this.endOffset = this.startOffset
            } else {
                this.startContainer = this.endContainer;
                this.startOffset = this.endOffset
            }
            this.collapsed = true
        }, cloneContents: function () {
            var b = new CKEDITOR.dom.documentFragment(this.document);
            this.collapsed ||
            a(this, 2, b);
            return b
        }, deleteContents: function (b) {
            this.collapsed || a(this, 0, null, b)
        }, extractContents: function (b) {
            var c = new CKEDITOR.dom.documentFragment(this.document);
            this.collapsed || a(this, 1, c, b);
            return c
        }, createBookmark: function (a) {
            var b, c, e, d, g = this.collapsed;
            b = this.document.createElement("span");
            b.data("cke-bookmark", 1);
            b.setStyle("display", "none");
            b.setHtml("&nbsp;");
            if (a) {
                e = "cke_bm_" + CKEDITOR.tools.getNextNumber();
                b.setAttribute("id", e + (g ? "C" : "S"))
            }
            if (!g) {
                c = b.clone();
                c.setHtml("&nbsp;");
                a && c.setAttribute("id",
                        e + "E");
                d = this.clone();
                d.collapse();
                d.insertNode(c)
            }
            d = this.clone();
            d.collapse(true);
            d.insertNode(b);
            if (c) {
                this.setStartAfter(b);
                this.setEndBefore(c)
            } else this.moveToPosition(b, CKEDITOR.POSITION_AFTER_END);
            return{startNode: a ? e + (g ? "C" : "S") : b, endNode: a ? e + "E" : c, serializable: a, collapsed: g}
        }, createBookmark2: function () {
            function a(b) {
                var c = b.container, e = b.offset, d;
                d = c;
                var j = e;
                d = d.type != CKEDITOR.NODE_ELEMENT || j === 0 || j == d.getChildCount() ? 0 : d.getChild(j - 1).type == CKEDITOR.NODE_TEXT && d.getChild(j).type == CKEDITOR.NODE_TEXT;
                if (d) {
                    c = c.getChild(e - 1);
                    e = c.getLength()
                }
                c.type == CKEDITOR.NODE_ELEMENT && e > 1 && (e = c.getChild(e - 1).getIndex(true) + 1);
                if (c.type == CKEDITOR.NODE_TEXT) {
                    d = c;
                    for (j = 0; (d = d.getPrevious()) && d.type == CKEDITOR.NODE_TEXT;)j = j + d.getLength();
                    e = e + j
                }
                b.container = c;
                b.offset = e
            }

            return function (b) {
                var c = this.collapsed, e = {container: this.startContainer, offset: this.startOffset}, d = {container: this.endContainer, offset: this.endOffset};
                if (b) {
                    a(e);
                    c || a(d)
                }
                return{start: e.container.getAddress(b), end: c ? null : d.container.getAddress(b),
                    startOffset: e.offset, endOffset: d.offset, normalized: b, collapsed: c, is2: true}
            }
        }(), moveToBookmark: function (a) {
            if (a.is2) {
                var b = this.document.getByAddress(a.start, a.normalized), c = a.startOffset, e = a.end && this.document.getByAddress(a.end, a.normalized), a = a.endOffset;
                this.setStart(b, c);
                e ? this.setEnd(e, a) : this.collapse(true)
            } else {
                b = (c = a.serializable) ? this.document.getById(a.startNode) : a.startNode;
                a = c ? this.document.getById(a.endNode) : a.endNode;
                this.setStartBefore(b);
                b.remove();
                if (a) {
                    this.setEndBefore(a);
                    a.remove()
                } else this.collapse(true)
            }
        },
            getBoundaryNodes: function () {
                var a = this.startContainer, b = this.endContainer, c = this.startOffset, e = this.endOffset, d;
                if (a.type == CKEDITOR.NODE_ELEMENT) {
                    d = a.getChildCount();
                    if (d > c)a = a.getChild(c); else if (d < 1)a = a.getPreviousSourceNode(); else {
                        for (a = a.$; a.lastChild;)a = a.lastChild;
                        a = new CKEDITOR.dom.node(a);
                        a = a.getNextSourceNode() || a
                    }
                }
                if (b.type == CKEDITOR.NODE_ELEMENT) {
                    d = b.getChildCount();
                    if (d > e)b = b.getChild(e).getPreviousSourceNode(true); else if (d < 1)b = b.getPreviousSourceNode(); else {
                        for (b = b.$; b.lastChild;)b =
                            b.lastChild;
                        b = new CKEDITOR.dom.node(b)
                    }
                }
                a.getPosition(b) & CKEDITOR.POSITION_FOLLOWING && (a = b);
                return{startNode: a, endNode: b}
            }, getCommonAncestor: function (a, b) {
            var c = this.startContainer, e = this.endContainer, c = c.equals(e) ? a && c.type == CKEDITOR.NODE_ELEMENT && this.startOffset == this.endOffset - 1 ? c.getChild(this.startOffset) : c : c.getCommonAncestor(e);
            return b && !c.is ? c.getParent() : c
        }, optimize: function () {
            var a = this.startContainer, b = this.startOffset;
            a.type != CKEDITOR.NODE_ELEMENT && (b ? b >= a.getLength() && this.setStartAfter(a) :
                this.setStartBefore(a));
            a = this.endContainer;
            b = this.endOffset;
            a.type != CKEDITOR.NODE_ELEMENT && (b ? b >= a.getLength() && this.setEndAfter(a) : this.setEndBefore(a))
        }, optimizeBookmark: function () {
            var a = this.startContainer, b = this.endContainer;
            a.is && (a.is("span") && a.data("cke-bookmark")) && this.setStartAt(a, CKEDITOR.POSITION_BEFORE_START);
            b && (b.is && b.is("span") && b.data("cke-bookmark")) && this.setEndAt(b, CKEDITOR.POSITION_AFTER_END)
        }, trim: function (a, b) {
            var c = this.startContainer, e = this.startOffset, d = this.collapsed;
            if ((!a || d) && c && c.type == CKEDITOR.NODE_TEXT) {
                if (e)if (e >= c.getLength()) {
                    e = c.getIndex() + 1;
                    c = c.getParent()
                } else {
                    var g = c.split(e), e = c.getIndex() + 1, c = c.getParent();
                    if (this.startContainer.equals(this.endContainer))this.setEnd(g, this.endOffset - this.startOffset); else if (c.equals(this.endContainer))this.endOffset = this.endOffset + 1
                } else {
                    e = c.getIndex();
                    c = c.getParent()
                }
                this.setStart(c, e);
                if (d) {
                    this.collapse(true);
                    return
                }
            }
            c = this.endContainer;
            e = this.endOffset;
            if (!b && !d && c && c.type == CKEDITOR.NODE_TEXT) {
                if (e) {
                    e >= c.getLength() ||
                    c.split(e);
                    e = c.getIndex() + 1
                } else e = c.getIndex();
                c = c.getParent();
                this.setEnd(c, e)
            }
        }, enlarge: function (a, b) {
            function c(a) {
                return a && a.type == CKEDITOR.NODE_ELEMENT && a.hasAttribute("contenteditable") ? null : a
            }

            var e = RegExp(/[^\s\ufeff]/);
            switch (a) {
                case CKEDITOR.ENLARGE_INLINE:
                    var d = 1;
                case CKEDITOR.ENLARGE_ELEMENT:
                    if (this.collapsed)break;
                    var g = this.getCommonAncestor(), f = this.root, h, k, i, s, x, y = false, v, A;
                    v = this.startContainer;
                    var B = this.startOffset;
                    if (v.type == CKEDITOR.NODE_TEXT) {
                        if (B) {
                            v = !CKEDITOR.tools.trim(v.substring(0,
                                B)).length && v;
                            y = !!v
                        }
                        if (v && !(s = v.getPrevious()))i = v.getParent()
                    } else {
                        B && (s = v.getChild(B - 1) || v.getLast());
                        s || (i = v)
                    }
                    for (i = c(i); i || s;) {
                        if (i && !s) {
                            !x && i.equals(g) && (x = true);
                            if (d ? i.isBlockBoundary() : !f.contains(i))break;
                            if (!y || i.getComputedStyle("display") != "inline") {
                                y = false;
                                x ? h = i : this.setStartBefore(i)
                            }
                            s = i.getPrevious()
                        }
                        for (; s;) {
                            v = false;
                            if (s.type == CKEDITOR.NODE_COMMENT)s = s.getPrevious(); else {
                                if (s.type == CKEDITOR.NODE_TEXT) {
                                    A = s.getText();
                                    e.test(A) && (s = null);
                                    v = /[\s\ufeff]$/.test(A)
                                } else if ((s.$.offsetWidth >
                                    0 || b && s.is("br")) && !s.data("cke-bookmark"))if (y && CKEDITOR.dtd.$removeEmpty[s.getName()]) {
                                    A = s.getText();
                                    if (e.test(A))s = null; else for (var B = s.$.getElementsByTagName("*"), E = 0, F; F = B[E++];)if (!CKEDITOR.dtd.$removeEmpty[F.nodeName.toLowerCase()]) {
                                        s = null;
                                        break
                                    }
                                    s && (v = !!A.length)
                                } else s = null;
                                v && (y ? x ? h = i : i && this.setStartBefore(i) : y = true);
                                if (s) {
                                    v = s.getPrevious();
                                    if (!i && !v) {
                                        i = s;
                                        s = null;
                                        break
                                    }
                                    s = v
                                } else i = null
                            }
                        }
                        i && (i = c(i.getParent()))
                    }
                    v = this.endContainer;
                    B = this.endOffset;
                    i = s = null;
                    x = y = false;
                    var J = function (a, b) {
                        var c =
                            new CKEDITOR.dom.range(f);
                        c.setStart(a, b);
                        c.setEndAt(f, CKEDITOR.POSITION_BEFORE_END);
                        var c = new CKEDITOR.dom.walker(c), d;
                        for (c.guard = function (a) {
                            return!(a.type == CKEDITOR.NODE_ELEMENT && a.isBlockBoundary())
                        }; d = c.next();) {
                            if (d.type != CKEDITOR.NODE_TEXT)return false;
                            A = d != a ? d.getText() : d.substring(b);
                            if (e.test(A))return false
                        }
                        return true
                    };
                    if (v.type == CKEDITOR.NODE_TEXT)if (CKEDITOR.tools.trim(v.substring(B)).length)y = true; else {
                        y = !v.getLength();
                        if (B == v.getLength()) {
                            if (!(s = v.getNext()))i = v.getParent()
                        } else J(v,
                            B) && (i = v.getParent())
                    } else(s = v.getChild(B)) || (i = v);
                    for (; i || s;) {
                        if (i && !s) {
                            !x && i.equals(g) && (x = true);
                            if (d ? i.isBlockBoundary() : !f.contains(i))break;
                            if (!y || i.getComputedStyle("display") != "inline") {
                                y = false;
                                x ? k = i : i && this.setEndAfter(i)
                            }
                            s = i.getNext()
                        }
                        for (; s;) {
                            v = false;
                            if (s.type == CKEDITOR.NODE_TEXT) {
                                A = s.getText();
                                J(s, 0) || (s = null);
                                v = /^[\s\ufeff]/.test(A)
                            } else if (s.type == CKEDITOR.NODE_ELEMENT) {
                                if ((s.$.offsetWidth > 0 || b && s.is("br")) && !s.data("cke-bookmark"))if (y && CKEDITOR.dtd.$removeEmpty[s.getName()]) {
                                    A = s.getText();
                                    if (e.test(A))s = null; else {
                                        B = s.$.getElementsByTagName("*");
                                        for (E = 0; F = B[E++];)if (!CKEDITOR.dtd.$removeEmpty[F.nodeName.toLowerCase()]) {
                                            s = null;
                                            break
                                        }
                                    }
                                    s && (v = !!A.length)
                                } else s = null
                            } else v = 1;
                            v && y && (x ? k = i : this.setEndAfter(i));
                            if (s) {
                                v = s.getNext();
                                if (!i && !v) {
                                    i = s;
                                    s = null;
                                    break
                                }
                                s = v
                            } else i = null
                        }
                        i && (i = c(i.getParent()))
                    }
                    if (h && k) {
                        g = h.contains(k) ? k : h;
                        this.setStartBefore(g);
                        this.setEndAfter(g)
                    }
                    break;
                case CKEDITOR.ENLARGE_BLOCK_CONTENTS:
                case CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS:
                    i = new CKEDITOR.dom.range(this.root);
                    f =
                        this.root;
                    i.setStartAt(f, CKEDITOR.POSITION_AFTER_START);
                    i.setEnd(this.startContainer, this.startOffset);
                    i = new CKEDITOR.dom.walker(i);
                    var D, z, w = CKEDITOR.dom.walker.blockBoundary(a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? {br: 1} : null), C = null, I = function (a) {
                        if (a.type == CKEDITOR.NODE_ELEMENT && a.getAttribute("contenteditable") == "false")if (C) {
                            if (C.equals(a)) {
                                C = null;
                                return
                            }
                        } else C = a; else if (C)return;
                        var b = w(a);
                        b || (D = a);
                        return b
                    }, d = function (a) {
                        var b = I(a);
                        !b && (a.is && a.is("br")) && (z = a);
                        return b
                    };
                    i.guard = I;
                    i = i.lastBackward();
                    D = D || f;
                    this.setStartAt(D, !D.is("br") && (!i && this.checkStartOfBlock() || i && D.contains(i)) ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_AFTER_END);
                    if (a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS) {
                        i = this.clone();
                        i = new CKEDITOR.dom.walker(i);
                        var H = CKEDITOR.dom.walker.whitespaces(), Q = CKEDITOR.dom.walker.bookmark();
                        i.evaluator = function (a) {
                            return!H(a) && !Q(a)
                        };
                        if ((i = i.previous()) && i.type == CKEDITOR.NODE_ELEMENT && i.is("br"))break
                    }
                    i = this.clone();
                    i.collapse();
                    i.setEndAt(f, CKEDITOR.POSITION_BEFORE_END);
                    i = new CKEDITOR.dom.walker(i);
                    i.guard = a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? d : I;
                    D = C = z = null;
                    i = i.lastForward();
                    D = D || f;
                    this.setEndAt(D, !i && this.checkEndOfBlock() || i && D.contains(i) ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_BEFORE_START);
                    z && this.setEndAfter(z)
            }
        }, shrink: function (a, b, c) {
            if (!this.collapsed) {
                var a = a || CKEDITOR.SHRINK_TEXT, e = this.clone(), d = this.startContainer, g = this.endContainer, f = this.startOffset, h = this.endOffset, i = 1, k = 1;
                if (d && d.type == CKEDITOR.NODE_TEXT)if (f)if (f >= d.getLength())e.setStartAfter(d); else {
                    e.setStartBefore(d);
                    i = 0
                } else e.setStartBefore(d);
                if (g && g.type == CKEDITOR.NODE_TEXT)if (h)if (h >= g.getLength())e.setEndAfter(g); else {
                    e.setEndAfter(g);
                    k = 0
                } else e.setEndBefore(g);
                var e = new CKEDITOR.dom.walker(e), s = CKEDITOR.dom.walker.bookmark();
                e.evaluator = function (b) {
                    return b.type == (a == CKEDITOR.SHRINK_ELEMENT ? CKEDITOR.NODE_ELEMENT : CKEDITOR.NODE_TEXT)
                };
                var x;
                e.guard = function (b, e) {
                    if (s(b))return true;
                    if (a == CKEDITOR.SHRINK_ELEMENT && b.type == CKEDITOR.NODE_TEXT || e && b.equals(x) || c === false && b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary() ||
                        b.type == CKEDITOR.NODE_ELEMENT && b.hasAttribute("contenteditable"))return false;
                    !e && b.type == CKEDITOR.NODE_ELEMENT && (x = b);
                    return true
                };
                if (i)(d = e[a == CKEDITOR.SHRINK_ELEMENT ? "lastForward" : "next"]()) && this.setStartAt(d, b ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_START);
                if (k) {
                    e.reset();
                    (e = e[a == CKEDITOR.SHRINK_ELEMENT ? "lastBackward" : "previous"]()) && this.setEndAt(e, b ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_END)
                }
                return!(!i && !k)
            }
        }, insertNode: function (a) {
            this.optimizeBookmark();
            this.trim(false,
                true);
            var b = this.startContainer, c = b.getChild(this.startOffset);
            c ? a.insertBefore(c) : b.append(a);
            a.getParent() && a.getParent().equals(this.endContainer) && this.endOffset++;
            this.setStartBefore(a)
        }, moveToPosition: function (a, b) {
            this.setStartAt(a, b);
            this.collapse(true)
        }, moveToRange: function (a) {
            this.setStart(a.startContainer, a.startOffset);
            this.setEnd(a.endContainer, a.endOffset)
        }, selectNodeContents: function (a) {
            this.setStart(a, 0);
            this.setEnd(a, a.type == CKEDITOR.NODE_TEXT ? a.getLength() : a.getChildCount())
        }, setStart: function (a, c) {
            if (a.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[a.getName()]) {
                c = a.getIndex();
                a = a.getParent()
            }
            this.startContainer = a;
            this.startOffset = c;
            if (!this.endContainer) {
                this.endContainer = a;
                this.endOffset = c
            }
            b(this)
        }, setEnd: function (a, c) {
            if (a.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[a.getName()]) {
                c = a.getIndex() + 1;
                a = a.getParent()
            }
            this.endContainer = a;
            this.endOffset = c;
            if (!this.startContainer) {
                this.startContainer = a;
                this.startOffset = c
            }
            b(this)
        }, setStartAfter: function (a) {
            this.setStart(a.getParent(), a.getIndex() +
                1)
        }, setStartBefore: function (a) {
            this.setStart(a.getParent(), a.getIndex())
        }, setEndAfter: function (a) {
            this.setEnd(a.getParent(), a.getIndex() + 1)
        }, setEndBefore: function (a) {
            this.setEnd(a.getParent(), a.getIndex())
        }, setStartAt: function (a, c) {
            switch (c) {
                case CKEDITOR.POSITION_AFTER_START:
                    this.setStart(a, 0);
                    break;
                case CKEDITOR.POSITION_BEFORE_END:
                    a.type == CKEDITOR.NODE_TEXT ? this.setStart(a, a.getLength()) : this.setStart(a, a.getChildCount());
                    break;
                case CKEDITOR.POSITION_BEFORE_START:
                    this.setStartBefore(a);
                    break;
                case CKEDITOR.POSITION_AFTER_END:
                    this.setStartAfter(a)
            }
            b(this)
        },
            setEndAt: function (a, c) {
                switch (c) {
                    case CKEDITOR.POSITION_AFTER_START:
                        this.setEnd(a, 0);
                        break;
                    case CKEDITOR.POSITION_BEFORE_END:
                        a.type == CKEDITOR.NODE_TEXT ? this.setEnd(a, a.getLength()) : this.setEnd(a, a.getChildCount());
                        break;
                    case CKEDITOR.POSITION_BEFORE_START:
                        this.setEndBefore(a);
                        break;
                    case CKEDITOR.POSITION_AFTER_END:
                        this.setEndAfter(a)
                }
                b(this)
            }, fixBlock: function (a, b) {
            var c = this.createBookmark(), e = this.document.createElement(b);
            this.collapse(a);
            this.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
            this.extractContents().appendTo(e);
            e.trim();
            e.appendBogus();
            this.insertNode(e);
            this.moveToBookmark(c);
            return e
        }, splitBlock: function (a) {
            var b = new CKEDITOR.dom.elementPath(this.startContainer, this.root), c = new CKEDITOR.dom.elementPath(this.endContainer, this.root), e = b.block, d = c.block, g = null;
            if (!b.blockLimit.equals(c.blockLimit))return null;
            if (a != "br") {
                if (!e) {
                    e = this.fixBlock(true, a);
                    d = (new CKEDITOR.dom.elementPath(this.endContainer, this.root)).block
                }
                d || (d = this.fixBlock(false, a))
            }
            a = e && this.checkStartOfBlock();
            b = d && this.checkEndOfBlock();
            this.deleteContents();
            if (e && e.equals(d))if (b) {
                g = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
                this.moveToPosition(d, CKEDITOR.POSITION_AFTER_END);
                d = null
            } else if (a) {
                g = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
                this.moveToPosition(e, CKEDITOR.POSITION_BEFORE_START);
                e = null
            } else {
                d = this.splitElement(e);
                e.is("ul", "ol") || e.appendBogus()
            }
            return{previousBlock: e, nextBlock: d, wasStartOfBlock: a, wasEndOfBlock: b, elementPath: g}
        }, splitElement: function (a) {
            if (!this.collapsed)return null;
            this.setEndAt(a, CKEDITOR.POSITION_BEFORE_END);
            var b = this.extractContents(), c = a.clone(false);
            b.appendTo(c);
            c.insertAfter(a);
            this.moveToPosition(a, CKEDITOR.POSITION_AFTER_END);
            return c
        }, removeEmptyBlocksAtEnd: function () {
            function a(e) {
                return function (a) {
                    return b(a) || (c(a) || a.type == CKEDITOR.NODE_ELEMENT && a.isEmptyInlineRemoveable()) || e.is("table") && a.is("caption") ? false : true
                }
            }

            var b = CKEDITOR.dom.walker.whitespaces(), c = CKEDITOR.dom.walker.bookmark(false);
            return function (b) {
                for (var c = this.createBookmark(),
                         e = this[b ? "endPath" : "startPath"](), d = e.block || e.blockLimit, g; d && !d.equals(e.root) && !d.getFirst(a(d));) {
                    g = d.getParent();
                    this[b ? "setEndAt" : "setStartAt"](d, CKEDITOR.POSITION_AFTER_END);
                    d.remove(1);
                    d = g
                }
                this.moveToBookmark(c)
            }
        }(), startPath: function () {
            return new CKEDITOR.dom.elementPath(this.startContainer, this.root)
        }, endPath: function () {
            return new CKEDITOR.dom.elementPath(this.endContainer, this.root)
        }, checkBoundaryOfElement: function (a, b) {
            var c = b == CKEDITOR.START, e = this.clone();
            e.collapse(c);
            e[c ? "setStartAt" :
                "setEndAt"](a, c ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END);
            e = new CKEDITOR.dom.walker(e);
            e.evaluator = f(c);
            return e[c ? "checkBackward" : "checkForward"]()
        }, checkStartOfBlock: function () {
            var a = this.startContainer, b = this.startOffset;
            if (CKEDITOR.env.ie && b && a.type == CKEDITOR.NODE_TEXT) {
                a = CKEDITOR.tools.ltrim(a.substring(0, b));
                k.test(a) && this.trim(0, 1)
            }
            this.trim();
            a = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
            b = this.clone();
            b.collapse(true);
            b.setStartAt(a.block || a.blockLimit,
                CKEDITOR.POSITION_AFTER_START);
            a = new CKEDITOR.dom.walker(b);
            a.evaluator = c();
            return a.checkBackward()
        }, checkEndOfBlock: function () {
            var a = this.endContainer, b = this.endOffset;
            if (CKEDITOR.env.ie && a.type == CKEDITOR.NODE_TEXT) {
                a = CKEDITOR.tools.rtrim(a.substring(b));
                k.test(a) && this.trim(1, 0)
            }
            this.trim();
            a = new CKEDITOR.dom.elementPath(this.endContainer, this.root);
            b = this.clone();
            b.collapse(false);
            b.setEndAt(a.block || a.blockLimit, CKEDITOR.POSITION_BEFORE_END);
            a = new CKEDITOR.dom.walker(b);
            a.evaluator = c();
            return a.checkForward()
        },
            getPreviousNode: function (a, b, c) {
                var e = this.clone();
                e.collapse(1);
                e.setStartAt(c || this.root, CKEDITOR.POSITION_AFTER_START);
                c = new CKEDITOR.dom.walker(e);
                c.evaluator = a;
                c.guard = b;
                return c.previous()
            }, getNextNode: function (a, b, c) {
            var e = this.clone();
            e.collapse();
            e.setEndAt(c || this.root, CKEDITOR.POSITION_BEFORE_END);
            c = new CKEDITOR.dom.walker(e);
            c.evaluator = a;
            c.guard = b;
            return c.next()
        }, checkReadOnly: function () {
            function a(b, c) {
                for (; b;) {
                    if (b.type == CKEDITOR.NODE_ELEMENT) {
                        if (b.getAttribute("contentEditable") ==
                            "false" && !b.data("cke-editable"))return 0;
                        if (b.is("html") || b.getAttribute("contentEditable") == "true" && (b.contains(c) || b.equals(c)))break
                    }
                    b = b.getParent()
                }
                return 1
            }

            return function () {
                var b = this.startContainer, c = this.endContainer;
                return!(a(b, c) && a(c, b))
            }
        }(), moveToElementEditablePosition: function (a, b) {
            if (a.type == CKEDITOR.NODE_ELEMENT && !a.isEditable(false)) {
                this.moveToPosition(a, b ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START);
                return true
            }
            for (var c = 0; a;) {
                if (a.type == CKEDITOR.NODE_TEXT) {
                    b && this.endContainer &&
                    this.checkEndOfBlock() && k.test(a.getText()) ? this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START) : this.moveToPosition(a, b ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START);
                    c = 1;
                    break
                }
                if (a.type == CKEDITOR.NODE_ELEMENT)if (a.isEditable()) {
                    this.moveToPosition(a, b ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_START);
                    c = 1
                } else if (b && a.is("br") && this.endContainer && this.checkEndOfBlock())this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START); else if (a.getAttribute("contenteditable") == "false" &&
                    a.is(CKEDITOR.dtd.$block)) {
                    this.setStartBefore(a);
                    this.setEndAfter(a);
                    return true
                }
                var e = a, d = c, g = void 0;
                e.type == CKEDITOR.NODE_ELEMENT && e.isEditable(false) && (g = e[b ? "getLast" : "getFirst"](i));
                !d && !g && (g = e[b ? "getPrevious" : "getNext"](i));
                a = g
            }
            return!!c
        }, moveToClosestEditablePosition: function (a, b) {
            var c = new CKEDITOR.dom.range(this.root), e = 0, d, g = [CKEDITOR.POSITION_AFTER_END, CKEDITOR.POSITION_BEFORE_START];
            c.moveToPosition(a, g[b ? 0 : 1]);
            if (a.is(CKEDITOR.dtd.$block)) {
                if (d = c[b ? "getNextEditableNode" : "getPreviousEditableNode"]()) {
                    e =
                        1;
                    if (d.type == CKEDITOR.NODE_ELEMENT && d.is(CKEDITOR.dtd.$block) && d.getAttribute("contenteditable") == "false") {
                        c.setStartAt(d, CKEDITOR.POSITION_BEFORE_START);
                        c.setEndAt(d, CKEDITOR.POSITION_AFTER_END)
                    } else c.moveToPosition(d, g[b ? 1 : 0])
                }
            } else e = 1;
            e && this.moveToRange(c);
            return!!e
        }, moveToElementEditStart: function (a) {
            return this.moveToElementEditablePosition(a)
        }, moveToElementEditEnd: function (a) {
            return this.moveToElementEditablePosition(a, true)
        }, getEnclosedNode: function () {
            var a = this.clone();
            a.optimize();
            if (a.startContainer.type !=
                CKEDITOR.NODE_ELEMENT || a.endContainer.type != CKEDITOR.NODE_ELEMENT)return null;
            var a = new CKEDITOR.dom.walker(a), b = CKEDITOR.dom.walker.bookmark(false, true), c = CKEDITOR.dom.walker.whitespaces(true);
            a.evaluator = function (a) {
                return c(a) && b(a)
            };
            var e = a.next();
            a.reset();
            return e && e.equals(a.previous()) ? e : null
        }, getTouchedStartNode: function () {
            var a = this.startContainer;
            return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.startOffset) || a
        }, getTouchedEndNode: function () {
            var a = this.endContainer;
            return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.endOffset - 1) || a
        }, getNextEditableNode: d(), getPreviousEditableNode: d(1), scrollIntoView: function () {
            var a = new CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", this.document), b, c, e, d = this.clone();
            d.optimize();
            if (e = d.startContainer.type == CKEDITOR.NODE_TEXT) {
                c = d.startContainer.getText();
                b = d.startContainer.split(d.startOffset);
                a.insertAfter(d.startContainer)
            } else d.insertNode(a);
            a.scrollIntoView();
            if (e) {
                d.startContainer.setText(c);
                b.remove()
            }
            a.remove()
        }}
    }(), CKEDITOR.POSITION_AFTER_START = 1, CKEDITOR.POSITION_BEFORE_END = 2, CKEDITOR.POSITION_BEFORE_START = 3, CKEDITOR.POSITION_AFTER_END = 4, CKEDITOR.ENLARGE_ELEMENT = 1, CKEDITOR.ENLARGE_BLOCK_CONTENTS = 2, CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS = 3, CKEDITOR.ENLARGE_INLINE = 4, CKEDITOR.START = 1, CKEDITOR.END = 2, CKEDITOR.SHRINK_ELEMENT = 1, CKEDITOR.SHRINK_TEXT = 2, "use strict", function () {
        function c(a) {
            if (!(arguments.length < 1)) {
                this.range = a;
                this.forceBrBreak = 0;
                this.enlargeBr = 1;
                this.enforceRealBlocks = 0;
                this._ ||
                (this._ = {})
            }
        }

        function f(a, b, c) {
            for (a = a.getNextSourceNode(b, null, c); !e(a);)a = a.getNextSourceNode(b, null, c);
            return a
        }

        function d(a) {
            var b = [];
            a.forEach(function (a) {
                if (a.getAttribute("contenteditable") == "true") {
                    b.push(a);
                    return false
                }
            }, CKEDITOR.NODE_ELEMENT, true);
            return b
        }

        function b(a, c, e, f) {
            a:{
                f == void 0 && (f = d(e));
                for (var h; h = f.shift();)if (h.getDtd().p) {
                    f = {element: h, remaining: f};
                    break a
                }
                f = null
            }
            if (!f)return 0;
            if ((h = CKEDITOR.filter.instances[f.element.data("cke-filter")]) && !h.check(c))return b(a, c, e, f.remaining);
            c = new CKEDITOR.dom.range(f.element);
            c.selectNodeContents(f.element);
            c = c.createIterator();
            c.enlargeBr = a.enlargeBr;
            c.enforceRealBlocks = a.enforceRealBlocks;
            c.activeFilter = c.filter = h;
            a._.nestedEditable = {element: f.element, container: e, remaining: f.remaining, iterator: c};
            return 1
        }

        var a = /^[\r\n\t ]+$/, e = CKEDITOR.dom.walker.bookmark(false, true), h = CKEDITOR.dom.walker.whitespaces(true), k = function (a) {
            return e(a) && h(a)
        };
        c.prototype = {getNextParagraph: function (c) {
            var d, h, n, o, q, c = c || "p";
            if (this._.nestedEditable) {
                if (d =
                    this._.nestedEditable.iterator.getNextParagraph(c)) {
                    this.activeFilter = this._.nestedEditable.iterator.activeFilter;
                    return d
                }
                this.activeFilter = this.filter;
                if (b(this, c, this._.nestedEditable.container, this._.nestedEditable.remaining)) {
                    this.activeFilter = this._.nestedEditable.iterator.activeFilter;
                    return this._.nestedEditable.iterator.getNextParagraph(c)
                }
                this._.nestedEditable = null
            }
            if (!this.range.root.getDtd()[c])return null;
            if (!this._.started) {
                var l = this.range.clone();
                l.shrink(CKEDITOR.SHRINK_ELEMENT, true);
                h = l.endContainer.hasAscendant("pre", true) || l.startContainer.hasAscendant("pre", true);
                l.enlarge(this.forceBrBreak && !h || !this.enlargeBr ? CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS : CKEDITOR.ENLARGE_BLOCK_CONTENTS);
                if (!l.collapsed) {
                    h = new CKEDITOR.dom.walker(l.clone());
                    var m = CKEDITOR.dom.walker.bookmark(true, true);
                    h.evaluator = m;
                    this._.nextNode = h.next();
                    h = new CKEDITOR.dom.walker(l.clone());
                    h.evaluator = m;
                    h = h.previous();
                    this._.lastNode = h.getNextSourceNode(true);
                    if (this._.lastNode && this._.lastNode.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(this._.lastNode.getText()) && this._.lastNode.getParent().isBlockBoundary()) {
                        m = this.range.clone();
                        m.moveToPosition(this._.lastNode, CKEDITOR.POSITION_AFTER_END);
                        if (m.checkEndOfBlock()) {
                            m = new CKEDITOR.dom.elementPath(m.endContainer, m.root);
                            this._.lastNode = (m.block || m.blockLimit).getNextSourceNode(true)
                        }
                    }
                    if (!this._.lastNode || !l.root.contains(this._.lastNode)) {
                        this._.lastNode = this._.docEndMarker = l.document.createText("");
                        this._.lastNode.insertAfter(h)
                    }
                    l = null
                }
                this._.started = 1;
                h = l
            }
            m =
                this._.nextNode;
            l = this._.lastNode;
            for (this._.nextNode = null; m;) {
                var r = 0, t = m.hasAscendant("pre"), p = m.type != CKEDITOR.NODE_ELEMENT, u = 0;
                if (p)m.type == CKEDITOR.NODE_TEXT && a.test(m.getText()) && (p = 0); else {
                    var s = m.getName();
                    if (CKEDITOR.dtd.$block[s] && m.getAttribute("contenteditable") == "false") {
                        d = m;
                        b(this, c, d);
                        break
                    } else if (m.isBlockBoundary(this.forceBrBreak && !t && {br: 1})) {
                        if (s == "br")p = 1; else if (!h && !m.getChildCount() && s != "hr") {
                            d = m;
                            n = m.equals(l);
                            break
                        }
                        if (h) {
                            h.setEndAt(m, CKEDITOR.POSITION_BEFORE_START);
                            if (s !=
                                "br")this._.nextNode = m
                        }
                        r = 1
                    } else {
                        if (m.getFirst()) {
                            if (!h) {
                                h = this.range.clone();
                                h.setStartAt(m, CKEDITOR.POSITION_BEFORE_START)
                            }
                            m = m.getFirst();
                            continue
                        }
                        p = 1
                    }
                }
                if (p && !h) {
                    h = this.range.clone();
                    h.setStartAt(m, CKEDITOR.POSITION_BEFORE_START)
                }
                n = (!r || p) && m.equals(l);
                if (h && !r)for (; !m.getNext(k) && !n;) {
                    s = m.getParent();
                    if (s.isBlockBoundary(this.forceBrBreak && !t && {br: 1})) {
                        r = 1;
                        p = 0;
                        n || s.equals(l);
                        h.setEndAt(s, CKEDITOR.POSITION_BEFORE_END);
                        break
                    }
                    m = s;
                    p = 1;
                    n = m.equals(l);
                    u = 1
                }
                p && h.setEndAt(m, CKEDITOR.POSITION_AFTER_END);
                m =
                    f(m, u, l);
                if ((n = !m) || r && h)break
            }
            if (!d) {
                if (!h) {
                    this._.docEndMarker && this._.docEndMarker.remove();
                    return this._.nextNode = null
                }
                d = new CKEDITOR.dom.elementPath(h.startContainer, h.root);
                m = d.blockLimit;
                r = {div: 1, th: 1, td: 1};
                d = d.block;
                if (!d && m && !this.enforceRealBlocks && r[m.getName()] && h.checkStartOfBlock() && h.checkEndOfBlock() && !m.equals(h.root))d = m; else if (!d || this.enforceRealBlocks && d.getName() == "li") {
                    d = this.range.document.createElement(c);
                    h.extractContents().appendTo(d);
                    d.trim();
                    h.insertNode(d);
                    o = q = true
                } else if (d.getName() !=
                    "li") {
                    if (!h.checkStartOfBlock() || !h.checkEndOfBlock()) {
                        d = d.clone(false);
                        h.extractContents().appendTo(d);
                        d.trim();
                        q = h.splitBlock();
                        o = !q.wasStartOfBlock;
                        q = !q.wasEndOfBlock;
                        h.insertNode(d)
                    }
                } else if (!n)this._.nextNode = d.equals(l) ? null : f(h.getBoundaryNodes().endNode, 1, l)
            }
            if (o)(o = d.getPrevious()) && o.type == CKEDITOR.NODE_ELEMENT && (o.getName() == "br" ? o.remove() : o.getLast() && o.getLast().$.nodeName.toLowerCase() == "br" && o.getLast().remove());
            if (q)(o = d.getLast()) && o.type == CKEDITOR.NODE_ELEMENT && o.getName() == "br" &&
            (!CKEDITOR.env.needsBrFiller || o.getPrevious(e) || o.getNext(e)) && o.remove();
            if (!this._.nextNode)this._.nextNode = n || d.equals(l) || !l ? null : f(d, 1, l);
            return d
        }};
        CKEDITOR.dom.range.prototype.createIterator = function () {
            return new c(this)
        }
    }(), CKEDITOR.command = function (c, f) {
        this.uiItems = [];
        this.exec = function (b) {
            if (this.state == CKEDITOR.TRISTATE_DISABLED || !this.checkAllowed())return false;
            this.editorFocus && c.focus();
            return this.fire("exec") === false ? true : f.exec.call(this, c, b) !== false
        };
        this.refresh = function (b, a) {
            if (!this.readOnly &&
                b.readOnly)return true;
            if (this.context && !a.isContextFor(this.context)) {
                this.disable();
                return true
            }
            if (!this.checkAllowed(true)) {
                this.disable();
                return true
            }
            this.startDisabled || this.enable();
            this.modes && !this.modes[b.mode] && this.disable();
            return this.fire("refresh", {editor: b, path: a}) === false ? true : f.refresh && f.refresh.apply(this, arguments) !== false
        };
        var d;
        this.checkAllowed = function (b) {
            return!b && typeof d == "boolean" ? d : d = c.activeFilter.checkFeature(this)
        };
        CKEDITOR.tools.extend(this, f, {modes: {wysiwyg: 1}, editorFocus: 1,
            contextSensitive: !!f.context, state: CKEDITOR.TRISTATE_DISABLED});
        CKEDITOR.event.call(this)
    }, CKEDITOR.command.prototype = {enable: function () {
        this.state == CKEDITOR.TRISTATE_DISABLED && this.checkAllowed() && this.setState(!this.preserveState || typeof this.previousState == "undefined" ? CKEDITOR.TRISTATE_OFF : this.previousState)
    }, disable: function () {
        this.setState(CKEDITOR.TRISTATE_DISABLED)
    }, setState: function (c) {
        if (this.state == c || c != CKEDITOR.TRISTATE_DISABLED && !this.checkAllowed())return false;
        this.previousState = this.state;
        this.state = c;
        this.fire("state");
        return true
    }, toggleState: function () {
        this.state == CKEDITOR.TRISTATE_OFF ? this.setState(CKEDITOR.TRISTATE_ON) : this.state == CKEDITOR.TRISTATE_ON && this.setState(CKEDITOR.TRISTATE_OFF)
    }}, CKEDITOR.event.implementOn(CKEDITOR.command.prototype), CKEDITOR.ENTER_P = 1, CKEDITOR.ENTER_BR = 2, CKEDITOR.ENTER_DIV = 3, CKEDITOR.config = {customConfig: "config.js", autoUpdateElement: !0, language: "", defaultLanguage: "en", contentsLangDirection: "", enterMode: CKEDITOR.ENTER_P, forceEnterMode: !1, shiftEnterMode: CKEDITOR.ENTER_BR,
        docType: "<!DOCTYPE html>", bodyId: "", bodyClass: "", fullPage: !1, height: 200, extraPlugins: "", removePlugins: "", protectedSource: [], tabIndex: 0, width: "", baseFloatZIndex: 1E4, blockedKeystrokes: [CKEDITOR.CTRL + 66, CKEDITOR.CTRL + 73, CKEDITOR.CTRL + 85]}, function () {
        function c(a, b, c, e, d) {
            var g, f, a = [];
            for (g in b) {
                f = b[g];
                f = typeof f == "boolean" ? {} : typeof f == "function" ? {match: f} : J(f);
                if (g.charAt(0) != "$")f.elements = g;
                if (c)f.featureName = c.toLowerCase();
                var l = f;
                l.elements = h(l.elements, /\s+/) || null;
                l.propertiesOnly = l.propertiesOnly ||
                    l.elements === true;
                var w = /\s*,\s*/, k = void 0;
                for (k in C) {
                    l[k] = h(l[k], w) || null;
                    var i = l, m = I[k], p = h(l[I[k]], w), j = l[k], H = [], z = true, u = void 0;
                    p ? z = false : p = {};
                    for (u in j)if (u.charAt(0) == "!") {
                        u = u.slice(1);
                        H.push(u);
                        p[u] = true;
                        z = false
                    }
                    for (; u = H.pop();) {
                        j[u] = j["!" + u];
                        delete j["!" + u]
                    }
                    i[m] = (z ? false : p) || null
                }
                l.match = l.match || null;
                e.push(f);
                a.push(f)
            }
            for (var b = d.elements, d = d.generic, r, c = 0, e = a.length; c < e; ++c) {
                g = J(a[c]);
                f = g.classes === true || g.styles === true || g.attributes === true;
                l = g;
                k = m = w = void 0;
                for (w in C)l[w] = t(l[w]);
                i = true;
                for (k in I) {
                    w = I[k];
                    m = l[w];
                    p = [];
                    j = void 0;
                    for (j in m)j.indexOf("*") > -1 ? p.push(RegExp("^" + j.replace(/\*/g, ".*") + "$")) : p.push(j);
                    m = p;
                    if (m.length) {
                        l[w] = m;
                        i = false
                    }
                }
                l.nothingRequired = i;
                l.noProperties = !(l.attributes || l.classes || l.styles);
                if (g.elements === true || g.elements === null)d[f ? "unshift" : "push"](g); else {
                    l = g.elements;
                    delete g.elements;
                    for (r in l)if (b[r])b[r][f ? "unshift" : "push"](g); else b[r] = [g]
                }
            }
        }

        function f(a, b, c, e) {
            if (!a.match || a.match(b))if (e || k(a, b)) {
                if (!a.propertiesOnly)c.valid = true;
                if (!c.allAttributes)c.allAttributes =
                    d(a.attributes, b.attributes, c.validAttributes);
                if (!c.allStyles)c.allStyles = d(a.styles, b.styles, c.validStyles);
                if (!c.allClasses) {
                    a = a.classes;
                    b = b.classes;
                    e = c.validClasses;
                    if (a)if (a === true)a = true; else {
                        for (var g = 0, h = b.length, f; g < h; ++g) {
                            f = b[g];
                            e[f] || (e[f] = a(f))
                        }
                        a = false
                    } else a = false;
                    c.allClasses = a
                }
            }
        }

        function d(a, b, c) {
            if (!a)return false;
            if (a === true)return true;
            for (var e in b)c[e] || (c[e] = a(e));
            return false
        }

        function b(b, c, e) {
            if (!b.match || b.match(c)) {
                if (b.noProperties)return false;
                e.hadInvalidAttribute = a(b.attributes,
                    c.attributes) || e.hadInvalidAttribute;
                e.hadInvalidStyle = a(b.styles, c.styles) || e.hadInvalidStyle;
                b = b.classes;
                c = c.classes;
                if (b) {
                    for (var d = false, g = b === true, h = c.length; h--;)if (g || b(c[h])) {
                        c.splice(h, 1);
                        d = true
                    }
                    b = d
                } else b = false;
                e.hadInvalidClass = b || e.hadInvalidClass
            }
        }

        function a(a, b) {
            if (!a)return false;
            var c = false, e = a === true, d;
            for (d in b)if (e || a(d)) {
                delete b[d];
                c = true
            }
            return c
        }

        function e(a, b, c) {
            if (a.disabled || a.customConfig && !c || !b)return false;
            a._.cachedChecks = {};
            return true
        }

        function h(a, b) {
            if (!a)return false;
            if (a === true)return a;
            if (typeof a == "string") {
                a = D(a);
                return a == "*" ? true : CKEDITOR.tools.convertArrayToObject(a.split(b))
            }
            if (CKEDITOR.tools.isArray(a))return a.length ? CKEDITOR.tools.convertArrayToObject(a) : false;
            var c = {}, e = 0, d;
            for (d in a) {
                c[d] = a[d];
                e++
            }
            return e ? c : false
        }

        function k(a, b) {
            if (a.nothingRequired)return true;
            var c, e, d, h;
            if (d = a.requiredClasses) {
                h = b.classes;
                for (c = 0; c < d.length; ++c) {
                    e = d[c];
                    if (typeof e == "string") {
                        if (CKEDITOR.tools.indexOf(h, e) == -1)return false
                    } else if (!CKEDITOR.tools.checkIfAnyArrayItemMatches(h,
                        e))return false
                }
            }
            return g(b.styles, a.requiredStyles) && g(b.attributes, a.requiredAttributes)
        }

        function g(a, b) {
            if (!b)return true;
            for (var c = 0, e; c < b.length; ++c) {
                e = b[c];
                if (typeof e == "string") {
                    if (!(e in a))return false
                } else if (!CKEDITOR.tools.checkIfAnyObjectPropertyMatches(a, e))return false
            }
            return true
        }

        function i(a) {
            if (!a)return{};
            for (var a = a.split(/\s*,\s*/).sort(), b = {}; a.length;)b[a.shift()] = z;
            return b
        }

        function j(a) {
            for (var b, c, e, d, g = {}, h = 1, a = D(a); b = a.match(H);) {
                if (c = b[2]) {
                    e = n(c, "styles");
                    d = n(c, "attrs");
                    c = n(c, "classes")
                } else e = d = c = null;
                g["$" + h++] = {elements: b[1], classes: c, styles: e, attributes: d};
                a = a.slice(b[0].length)
            }
            return g
        }

        function n(a, b) {
            var c = a.match(Q[b]);
            return c ? D(c[1]) : null
        }

        function o(a) {
            var b = a.styleBackup = a.attributes.style, c = a.classBackup = a.attributes["class"];
            if (!a.styles)a.styles = CKEDITOR.tools.parseCssText(b || "", 1);
            if (!a.classes)a.classes = c ? c.split(/\s+/) : []
        }

        function q(a, c, e, d) {
            var g = 0, h;
            if (d.toHtml)c.name = c.name.replace(O, "$1");
            if (d.doCallbacks && a.elementCallbacks) {
                a:for (var l = a.elementCallbacks,
                           w = 0, k = l.length, C; w < k; ++w)if (C = l[w](c)) {
                    h = C;
                    break a
                }
                if (h)return h
            }
            if (d.doTransform)if (h = a._.transformations[c.name]) {
                o(c);
                for (l = 0; l < h.length; ++l)x(a, c, h[l]);
                m(c)
            }
            if (d.doFilter) {
                a:{
                    l = c.name;
                    w = a._;
                    a = w.allowedRules.elements[l];
                    h = w.allowedRules.generic;
                    l = w.disallowedRules.elements[l];
                    w = w.disallowedRules.generic;
                    k = d.skipRequired;
                    C = {valid: false, validAttributes: {}, validClasses: {}, validStyles: {}, allAttributes: false, allClasses: false, allStyles: false, hadInvalidAttribute: false, hadInvalidClass: false, hadInvalidStyle: false};
                    var i, p;
                    if (!a && !h)a = null; else {
                        o(c);
                        if (l) {
                            i = 0;
                            for (p = l.length; i < p; ++i)if (b(l[i], c, C) === false) {
                                a = null;
                                break a
                            }
                        }
                        if (w) {
                            i = 0;
                            for (p = w.length; i < p; ++i)b(w[i], c, C)
                        }
                        if (a) {
                            i = 0;
                            for (p = a.length; i < p; ++i)f(a[i], c, C, k)
                        }
                        if (h) {
                            i = 0;
                            for (p = h.length; i < p; ++i)f(h[i], c, C, k)
                        }
                        a = C
                    }
                }
                if (!a) {
                    e.push(c);
                    return F
                }
                if (!a.valid) {
                    e.push(c);
                    return F
                }
                p = a.validAttributes;
                var j = a.validStyles;
                h = a.validClasses;
                var l = c.attributes, I = c.styles, w = c.classes, k = c.classBackup, H = c.styleBackup, z, u, n = [];
                C = [];
                var Q = /^data-cke-/;
                i = false;
                delete l.style;
                delete l["class"];
                delete c.classBackup;
                delete c.styleBackup;
                if (!a.allAttributes)for (z in l)if (!p[z])if (Q.test(z)) {
                    if (z != (u = z.replace(/^data-cke-saved-/, "")) && !p[u]) {
                        delete l[z];
                        i = true
                    }
                } else {
                    delete l[z];
                    i = true
                }
                if (!a.allStyles || a.hadInvalidStyle) {
                    for (z in I)a.allStyles || j[z] ? n.push(z + ":" + I[z]) : i = true;
                    if (n.length)l.style = n.sort().join("; ")
                } else if (H)l.style = H;
                if (!a.allClasses || a.hadInvalidClass) {
                    for (z = 0; z < w.length; ++z)(a.allClasses || h[w[z]]) && C.push(w[z]);
                    C.length && (l["class"] = C.sort().join(" "));
                    k && C.length < k.split(/\s+/).length &&
                    (i = true)
                } else k && (l["class"] = k);
                i && (g = F);
                if (!d.skipFinalValidation && !r(c)) {
                    e.push(c);
                    return F
                }
            }
            if (d.toHtml)c.name = c.name.replace(K, "cke:$1");
            return g
        }

        function l(a) {
            var b = [], c;
            for (c in a)c.indexOf("*") > -1 && b.push(c.replace(/\*/g, ".*"));
            return b.length ? RegExp("^(?:" + b.join("|") + ")$") : null
        }

        function m(a) {
            var b = a.attributes, c;
            delete b.style;
            delete b["class"];
            if (c = CKEDITOR.tools.writeCssText(a.styles, true))b.style = c;
            a.classes.length && (b["class"] = a.classes.sort().join(" "))
        }

        function r(a) {
            switch (a.name) {
                case "a":
                    if (!a.children.length && !a.attributes.name)return false;
                    break;
                case "img":
                    if (!a.attributes.src)return false
            }
            return true
        }

        function t(a) {
            if (!a)return false;
            if (a === true)return true;
            var b = l(a);
            return function (c) {
                return c in a || b && c.match(b)
            }
        }

        function p() {
            return new CKEDITOR.htmlParser.element("br")
        }

        function u(a) {
            return a.type == CKEDITOR.NODE_ELEMENT && (a.name == "br" || E.$block[a.name])
        }

        function s(a, b, c) {
            var e = a.name;
            if (E.$empty[e] || !a.children.length)if (e == "hr" && b == "br")a.replaceWith(p()); else {
                a.parent && c.push({check: "it", el: a.parent});
                a.remove()
            } else if (E.$block[e] || e == "tr")if (b == "br") {
                if (a.previous && !u(a.previous)) {
                    b = p();
                    b.insertBefore(a)
                }
                if (a.next && !u(a.next)) {
                    b = p();
                    b.insertAfter(a)
                }
                a.replaceWithChildren()
            } else {
                var e = a.children, d;
                b:{
                    d = E[b];
                    for (var g = 0, h = e.length, l; g < h; ++g) {
                        l = e[g];
                        if (l.type == CKEDITOR.NODE_ELEMENT && !d[l.name]) {
                            d = false;
                            break b
                        }
                    }
                    d = true
                }
                if (d) {
                    a.name = b;
                    a.attributes = {};
                    c.push({check: "parent-down", el: a})
                } else {
                    d = a.parent;
                    for (var g = d.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT || d.name == "body", f, h = e.length; h > 0;) {
                        l = e[--h];
                        if (g &&
                            (l.type == CKEDITOR.NODE_TEXT || l.type == CKEDITOR.NODE_ELEMENT && E.$inline[l.name])) {
                            if (!f) {
                                f = new CKEDITOR.htmlParser.element(b);
                                f.insertAfter(a);
                                c.push({check: "parent-down", el: f})
                            }
                            f.add(l, 0)
                        } else {
                            f = null;
                            l.insertAfter(a);
                            d.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT && (l.type == CKEDITOR.NODE_ELEMENT && !E[d.name][l.name]) && c.push({check: "el-up", el: l})
                        }
                    }
                    a.remove()
                }
            } else if (e == "style")a.remove(); else {
                a.parent && c.push({check: "it", el: a.parent});
                a.replaceWithChildren()
            }
        }

        function x(a, b, c) {
            var e, d;
            for (e = 0; e < c.length; ++e) {
                d =
                    c[e];
                if ((!d.check || a.check(d.check, false)) && (!d.left || d.left(b))) {
                    d.right(b, G);
                    break
                }
            }
        }

        function y(a, b) {
            var c = b.getDefinition(), e = c.attributes, d = c.styles, g, h, l, f;
            if (a.name != c.element)return false;
            for (g in e)if (g == "class") {
                c = e[g].split(/\s+/);
                for (l = a.classes.join("|"); f = c.pop();)if (l.indexOf(f) == -1)return false
            } else if (a.attributes[g] != e[g])return false;
            for (h in d)if (a.styles[h] != d[h])return false;
            return true
        }

        function v(a, b) {
            var c, e;
            if (typeof a == "string")c = a; else if (a instanceof CKEDITOR.style)e = a;
            else {
                c = a[0];
                e = a[1]
            }
            return[
                {element: c, left: e, right: function (a, c) {
                    c.transform(a, b)
                }}
            ]
        }

        function A(a) {
            return function (b) {
                return y(b, a)
            }
        }

        function B(a) {
            return function (b, c) {
                c[a](b)
            }
        }

        var E = CKEDITOR.dtd, F = 1, J = CKEDITOR.tools.copy, D = CKEDITOR.tools.trim, z = "cke-test", w = ["", "p", "br", "div"];
        CKEDITOR.FILTER_SKIP_TREE = 2;
        CKEDITOR.filter = function (a) {
            this.allowedContent = [];
            this.disallowedContent = [];
            this.elementCallbacks = null;
            this.disabled = false;
            this.editor = null;
            this.id = CKEDITOR.tools.getNextNumber();
            this._ = {allowedRules: {elements: {},
                generic: []}, disallowedRules: {elements: {}, generic: []}, transformations: {}, cachedTests: {}};
            CKEDITOR.filter.instances[this.id] = this;
            if (a instanceof CKEDITOR.editor) {
                a = this.editor = a;
                this.customConfig = true;
                var b = a.config.allowedContent;
                if (b === true)this.disabled = true; else {
                    if (!b)this.customConfig = false;
                    this.allow(b, "config", 1);
                    this.allow(a.config.extraAllowedContent, "extra", 1);
                    this.allow(w[a.enterMode] + " " + w[a.shiftEnterMode], "default", 1);
                    this.disallow(a.config.disallowedContent)
                }
            } else {
                this.customConfig =
                    false;
                this.allow(a, "default", 1)
            }
        };
        CKEDITOR.filter.instances = {};
        CKEDITOR.filter.prototype = {allow: function (a, b, d) {
            if (!e(this, a, d))return false;
            var g, h;
            if (typeof a == "string")a = j(a); else if (a instanceof CKEDITOR.style) {
                if (a.toAllowedContentRules)return this.allow(a.toAllowedContentRules(this.editor), b, d);
                g = a.getDefinition();
                a = {};
                d = g.attributes;
                a[g.element] = g = {styles: g.styles, requiredStyles: g.styles && CKEDITOR.tools.objectKeys(g.styles)};
                if (d) {
                    d = J(d);
                    g.classes = d["class"] ? d["class"].split(/\s+/) : null;
                    g.requiredClasses =
                        g.classes;
                    delete d["class"];
                    g.attributes = d;
                    g.requiredAttributes = d && CKEDITOR.tools.objectKeys(d)
                }
            } else if (CKEDITOR.tools.isArray(a)) {
                for (g = 0; g < a.length; ++g)h = this.allow(a[g], b, d);
                return h
            }
            c(this, a, b, this.allowedContent, this._.allowedRules);
            return true
        }, applyTo: function (a, b, c, e) {
            if (this.disabled)return false;
            var d = this, g = [], h = this.editor && this.editor.config.protectedSource, l, f = false, k = {doFilter: !c, doTransform: true, doCallbacks: true, toHtml: b};
            a.forEach(function (a) {
                if (a.type == CKEDITOR.NODE_ELEMENT) {
                    if (a.attributes["data-cke-filter"] ==
                        "off")return false;
                    if (!b || !(a.name == "span" && ~CKEDITOR.tools.objectKeys(a.attributes).join("|").indexOf("data-cke-"))) {
                        l = q(d, a, g, k);
                        if (l & F)f = true; else if (l & 2)return false
                    }
                } else if (a.type == CKEDITOR.NODE_COMMENT && a.value.match(/^\{cke_protected\}(?!\{C\})/)) {
                    var c;
                    a:{
                        var e = decodeURIComponent(a.value.replace(/^\{cke_protected\}/, ""));
                        c = [];
                        var w, i, C;
                        if (h)for (i = 0; i < h.length; ++i)if ((C = e.match(h[i])) && C[0].length == e.length) {
                            c = true;
                            break a
                        }
                        e = CKEDITOR.htmlParser.fragment.fromHtml(e);
                        e.children.length == 1 && (w =
                            e.children[0]).type == CKEDITOR.NODE_ELEMENT && q(d, w, c, k);
                        c = !c.length
                    }
                    c || g.push(a)
                }
            }, null, true);
            g.length && (f = true);
            for (var i, a = [], e = w[e || (this.editor ? this.editor.enterMode : CKEDITOR.ENTER_P)]; c = g.pop();)c.type == CKEDITOR.NODE_ELEMENT ? s(c, e, a) : c.remove();
            for (; i = a.pop();) {
                c = i.el;
                if (c.parent)switch (i.check) {
                    case "it":
                        E.$removeEmpty[c.name] && !c.children.length ? s(c, e, a) : r(c) || s(c, e, a);
                        break;
                    case "el-up":
                        c.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT && !E[c.parent.name][c.name] && s(c, e, a);
                        break;
                    case "parent-down":
                        c.parent.type !=
                        CKEDITOR.NODE_DOCUMENT_FRAGMENT && !E[c.parent.name][c.name] && s(c.parent, e, a)
                }
            }
            return f
        }, checkFeature: function (a) {
            if (this.disabled || !a)return true;
            a.toFeature && (a = a.toFeature(this.editor));
            return!a.requiredContent || this.check(a.requiredContent)
        }, disable: function () {
            this.disabled = true
        }, disallow: function (a) {
            if (!e(this, a, true))return false;
            typeof a == "string" && (a = j(a));
            c(this, a, null, this.disallowedContent, this._.disallowedRules);
            return true
        }, addContentForms: function (a) {
            if (!this.disabled && a) {
                var b, c, e = [],
                    d;
                for (b = 0; b < a.length && !d; ++b) {
                    c = a[b];
                    if ((typeof c == "string" || c instanceof CKEDITOR.style) && this.check(c))d = c
                }
                if (d) {
                    for (b = 0; b < a.length; ++b)e.push(v(a[b], d));
                    this.addTransformations(e)
                }
            }
        }, addElementCallback: function (a) {
            if (!this.elementCallbacks)this.elementCallbacks = [];
            this.elementCallbacks.push(a)
        }, addFeature: function (a) {
            if (this.disabled || !a)return true;
            a.toFeature && (a = a.toFeature(this.editor));
            this.allow(a.allowedContent, a.name);
            this.addTransformations(a.contentTransformations);
            this.addContentForms(a.contentForms);
            return a.requiredContent && (this.customConfig || this.disallowedContent.length) ? this.check(a.requiredContent) : true
        }, addTransformations: function (a) {
            var b, c;
            if (!this.disabled && a) {
                var e = this._.transformations, d;
                for (d = 0; d < a.length; ++d) {
                    b = a[d];
                    var g = void 0, h = void 0, l = void 0, f = void 0, w = void 0, k = void 0;
                    c = [];
                    for (h = 0; h < b.length; ++h) {
                        l = b[h];
                        if (typeof l == "string") {
                            l = l.split(/\s*:\s*/);
                            f = l[0];
                            w = null;
                            k = l[1]
                        } else {
                            f = l.check;
                            w = l.left;
                            k = l.right
                        }
                        if (!g) {
                            g = l;
                            g = g.element ? g.element : f ? f.match(/^([a-z0-9]+)/i)[0] : g.left.getDefinition().element
                        }
                        w instanceof
                        CKEDITOR.style && (w = A(w));
                        c.push({check: f == g ? null : f, left: w, right: typeof k == "string" ? B(k) : k})
                    }
                    b = g;
                    e[b] || (e[b] = []);
                    e[b].push(c)
                }
            }
        }, check: function (a, b, c) {
            if (this.disabled)return true;
            if (CKEDITOR.tools.isArray(a)) {
                for (var e = a.length; e--;)if (this.check(a[e], b, c))return true;
                return false
            }
            var d, g;
            if (typeof a == "string") {
                g = a + "<" + (b === false ? "0" : "1") + (c ? "1" : "0") + ">";
                if (g in this._.cachedChecks)return this._.cachedChecks[g];
                e = j(a).$1;
                d = e.styles;
                var l = e.classes;
                e.name = e.elements;
                e.classes = l = l ? l.split(/\s*,\s*/) :
                    [];
                e.styles = i(d);
                e.attributes = i(e.attributes);
                e.children = [];
                l.length && (e.attributes["class"] = l.join(" "));
                if (d)e.attributes.style = CKEDITOR.tools.writeCssText(e.styles);
                d = e
            } else {
                e = a.getDefinition();
                d = e.styles;
                l = e.attributes || {};
                if (d) {
                    d = J(d);
                    l.style = CKEDITOR.tools.writeCssText(d, true)
                } else d = {};
                d = {name: e.element, attributes: l, classes: l["class"] ? l["class"].split(/\s+/) : [], styles: d, children: []}
            }
            var l = CKEDITOR.tools.clone(d), h = [], f;
            if (b !== false && (f = this._.transformations[d.name])) {
                for (e = 0; e < f.length; ++e)x(this,
                    d, f[e]);
                m(d)
            }
            q(this, l, h, {doFilter: true, doTransform: b !== false, skipRequired: !c, skipFinalValidation: !c});
            b = h.length > 0 ? false : CKEDITOR.tools.objectCompare(d.attributes, l.attributes, true) ? true : false;
            typeof a == "string" && (this._.cachedChecks[g] = b);
            return b
        }, getAllowedEnterMode: function () {
            var a = ["p", "div", "br"], b = {p: CKEDITOR.ENTER_P, div: CKEDITOR.ENTER_DIV, br: CKEDITOR.ENTER_BR};
            return function (c, e) {
                var d = a.slice(), g;
                if (this.check(w[c]))return c;
                for (e || (d = d.reverse()); g = d.pop();)if (this.check(g))return b[g];
                return CKEDITOR.ENTER_BR
            }
        }()};
        var C = {styles: 1, attributes: 1, classes: 1}, I = {styles: "requiredStyles", attributes: "requiredAttributes", classes: "requiredClasses"}, H = /^([a-z0-9*\s]+)((?:\s*\{[!\w\-,\s\*]+\}\s*|\s*\[[!\w\-,\s\*]+\]\s*|\s*\([!\w\-,\s\*]+\)\s*){0,3})(?:;\s*|$)/i, Q = {styles: /{([^}]+)}/, attrs: /\[([^\]]+)\]/, classes: /\(([^\)]+)\)/}, O = /^cke:(object|embed|param)$/, K = /^(object|embed|param)$/, G = CKEDITOR.filter.transformationsTools = {sizeToStyle: function (a) {
            this.lengthToStyle(a, "width");
            this.lengthToStyle(a,
                "height")
        }, sizeToAttribute: function (a) {
            this.lengthToAttribute(a, "width");
            this.lengthToAttribute(a, "height")
        }, lengthToStyle: function (a, b, c) {
            c = c || b;
            if (!(c in a.styles)) {
                var e = a.attributes[b];
                if (e) {
                    /^\d+$/.test(e) && (e = e + "px");
                    a.styles[c] = e
                }
            }
            delete a.attributes[b]
        }, lengthToAttribute: function (a, b, c) {
            c = c || b;
            if (!(c in a.attributes)) {
                var e = a.styles[b], d = e && e.match(/^(\d+)(?:\.\d*)?px$/);
                d ? a.attributes[c] = d[1] : e == z && (a.attributes[c] = z)
            }
            delete a.styles[b]
        }, alignmentToStyle: function (a) {
            if (!("float"in a.styles)) {
                var b =
                    a.attributes.align;
                if (b == "left" || b == "right")a.styles["float"] = b
            }
            delete a.attributes.align
        }, alignmentToAttribute: function (a) {
            if (!("align"in a.attributes)) {
                var b = a.styles["float"];
                if (b == "left" || b == "right")a.attributes.align = b
            }
            delete a.styles["float"]
        }, matchesStyle: y, transform: function (a, b) {
            if (typeof b == "string")a.name = b; else {
                var c = b.getDefinition(), e = c.styles, d = c.attributes, g, l, h, f;
                a.name = c.element;
                for (g in d)if (g == "class") {
                    c = a.classes.join("|");
                    for (h = d[g].split(/\s+/); f = h.pop();)c.indexOf(f) == -1 &&
                    a.classes.push(f)
                } else a.attributes[g] = d[g];
                for (l in e)a.styles[l] = e[l]
            }
        }}
    }(), function () {
        CKEDITOR.focusManager = function (c) {
            if (c.focusManager)return c.focusManager;
            this.hasFocus = false;
            this.currentActive = null;
            this._ = {editor: c};
            return this
        };
        CKEDITOR.focusManager._ = {blurDelay: 200};
        CKEDITOR.focusManager.prototype = {focus: function (c) {
            this._.timer && clearTimeout(this._.timer);
            if (c)this.currentActive = c;
            if (!this.hasFocus && !this._.locked) {
                (c = CKEDITOR.currentInstance) && c.focusManager.blur(1);
                this.hasFocus = true;
                (c = this._.editor.container) && c.addClass("cke_focus");
                this._.editor.fire("focus")
            }
        }, lock: function () {
            this._.locked = 1
        }, unlock: function () {
            delete this._.locked
        }, blur: function (c) {
            function f() {
                if (this.hasFocus) {
                    this.hasFocus = false;
                    var b = this._.editor.container;
                    b && b.removeClass("cke_focus");
                    this._.editor.fire("blur")
                }
            }

            if (!this._.locked) {
                this._.timer && clearTimeout(this._.timer);
                var d = CKEDITOR.focusManager._.blurDelay;
                c || !d ? f.call(this) : this._.timer = CKEDITOR.tools.setTimeout(function () {
                    delete this._.timer;
                    f.call(this)
                }, d, this)
            }
        }, add: function (c, f) {
            var d = c.getCustomData("focusmanager");
            if (!d || d != this) {
                d && d.remove(c);
                var d = "focus", b = "blur";
                if (f)if (CKEDITOR.env.ie) {
                    d = "focusin";
                    b = "focusout"
                } else CKEDITOR.event.useCapture = 1;
                var a = {blur: function () {
                    c.equals(this.currentActive) && this.blur()
                }, focus: function () {
                    this.focus(c)
                }};
                c.on(d, a.focus, this);
                c.on(b, a.blur, this);
                if (f)CKEDITOR.event.useCapture = 0;
                c.setCustomData("focusmanager", this);
                c.setCustomData("focusmanager_handlers", a)
            }
        }, remove: function (c) {
            c.removeCustomData("focusmanager");
            var f = c.removeCustomData("focusmanager_handlers");
            c.removeListener("blur", f.blur);
            c.removeListener("focus", f.focus)
        }}
    }(), CKEDITOR.keystrokeHandler = function (c) {
        if (c.keystrokeHandler)return c.keystrokeHandler;
        this.keystrokes = {};
        this.blockedKeystrokes = {};
        this._ = {editor: c};
        return this
    }, function () {
        var c, f = function (b) {
            var b = b.data, a = b.getKeystroke(), e = this.keystrokes[a], d = this._.editor;
            c = d.fire("key", {keyCode: a, domEvent: b}) === false;
            if (!c) {
                e && (c = d.execCommand(e, {from: "keystrokeHandler"}) !== false);
                c || (c = !!this.blockedKeystrokes[a])
            }
            c && b.preventDefault(true);
            return!c
        }, d = function (b) {
            if (c) {
                c = false;
                b.data.preventDefault(true)
            }
        };
        CKEDITOR.keystrokeHandler.prototype = {attach: function (b) {
            b.on("keydown", f, this);
            if (CKEDITOR.env.gecko && CKEDITOR.env.mac)b.on("keypress", d, this)
        }}
    }(), function () {
        CKEDITOR.lang = {languages: {af: 1, ar: 1, bg: 1, bn: 1, bs: 1, ca: 1, cs: 1, cy: 1, da: 1, de: 1, el: 1, "en-au": 1, "en-ca": 1, "en-gb": 1, en: 1, eo: 1, es: 1, et: 1, eu: 1, fa: 1, fi: 1, fo: 1, "fr-ca": 1, fr: 1, gl: 1, gu: 1, he: 1, hi: 1, hr: 1, hu: 1, id: 1, is: 1, it: 1, ja: 1, ka: 1,
            km: 1, ko: 1, ku: 1, lt: 1, lv: 1, mk: 1, mn: 1, ms: 1, nb: 1, nl: 1, no: 1, pl: 1, "pt-br": 1, pt: 1, ro: 1, ru: 1, si: 1, sk: 1, sl: 1, sq: 1, "sr-latn": 1, sr: 1, sv: 1, th: 1, tr: 1, tt: 1, ug: 1, uk: 1, vi: 1, "zh-cn": 1, zh: 1}, rtl: {ar: 1, fa: 1, he: 1, ku: 1, ug: 1}, load: function (c, f, d) {
            if (!c || !CKEDITOR.lang.languages[c])c = this.detect(f, c);
            var b = this, f = function () {
                b[c].dir = b.rtl[c] ? "rtl" : "ltr";
                d(c, b[c])
            };
            this[c] ? f() : CKEDITOR.scriptLoader.load(CKEDITOR.getUrl("lang/" + c + ".js"), f, this)
        }, detect: function (c, f) {
            var d = this.languages, f = f || navigator.userLanguage || navigator.language ||
                c, b = f.toLowerCase().match(/([a-z]+)(?:-([a-z]+))?/), a = b[1], b = b[2];
            d[a + "-" + b] ? a = a + "-" + b : d[a] || (a = null);
            CKEDITOR.lang.detect = a ? function () {
                return a
            } : function (a) {
                return a
            };
            return a || c
        }}
    }(), CKEDITOR.scriptLoader = function () {
        var c = {}, f = {};
        return{load: function (d, b, a, e) {
            var h = typeof d == "string";
            h && (d = [d]);
            a || (a = CKEDITOR);
            var k = d.length, g = [], i = [], j = function (c) {
                b && (h ? b.call(a, c) : b.call(a, g, i))
            };
            if (k === 0)j(true); else {
                var n = function (a, b) {
                    (b ? g : i).push(a);
                    if (--k <= 0) {
                        e && CKEDITOR.document.getDocumentElement().removeStyle("cursor");
                        j(b)
                    }
                }, o = function (a, b) {
                    c[a] = 1;
                    var e = f[a];
                    delete f[a];
                    for (var d = 0; d < e.length; d++)e[d](a, b)
                }, q = function (a) {
                    if (c[a])n(a, true); else {
                        var e = f[a] || (f[a] = []);
                        e.push(n);
                        if (!(e.length > 1)) {
                            var d = new CKEDITOR.dom.element("script");
                            d.setAttributes({type: "text/javascript", src: a});
                            if (b)if (CKEDITOR.env.ie && CKEDITOR.env.version < 11)d.$.onreadystatechange = function () {
                                if (d.$.readyState == "loaded" || d.$.readyState == "complete") {
                                    d.$.onreadystatechange = null;
                                    o(a, true)
                                }
                            }; else {
                                d.$.onload = function () {
                                    setTimeout(function () {
                                            o(a, true)
                                        },
                                        0)
                                };
                                d.$.onerror = function () {
                                    o(a, false)
                                }
                            }
                            d.appendTo(CKEDITOR.document.getHead())
                        }
                    }
                };
                e && CKEDITOR.document.getDocumentElement().setStyle("cursor", "wait");
                for (var l = 0; l < k; l++)q(d[l])
            }
        }, queue: function () {
            function c() {
                var a;
                (a = b[0]) && this.load(a.scriptUrl, a.callback, CKEDITOR, 0)
            }

            var b = [];
            return function (a, e) {
                var h = this;
                b.push({scriptUrl: a, callback: function () {
                    e && e.apply(this, arguments);
                    b.shift();
                    c.call(h)
                }});
                b.length == 1 && c.call(this)
            }
        }()}
    }(), CKEDITOR.resourceManager = function (c, f) {
        this.basePath = c;
        this.fileName =
            f;
        this.registered = {};
        this.loaded = {};
        this.externals = {};
        this._ = {waitingList: {}}
    }, CKEDITOR.resourceManager.prototype = {add: function (c, f) {
        if (this.registered[c])throw'[CKEDITOR.resourceManager.add] The resource name "' + c + '" is already registered.';
        var d = this.registered[c] = f || {};
        d.name = c;
        d.path = this.getPath(c);
        CKEDITOR.fire(c + CKEDITOR.tools.capitalize(this.fileName) + "Ready", d);
        return this.get(c)
    }, get: function (c) {
        return this.registered[c] || null
    }, getPath: function (c) {
        var f = this.externals[c];
        return CKEDITOR.getUrl(f &&
            f.dir || this.basePath + c + "/")
    }, getFilePath: function (c) {
        var f = this.externals[c];
        return CKEDITOR.getUrl(this.getPath(c) + (f ? f.file : this.fileName + ".js"))
    }, addExternal: function (c, f, d) {
        for (var c = c.split(","), b = 0; b < c.length; b++) {
            var a = c[b];
            d || (f = f.replace(/[^\/]+$/, function (a) {
                d = a;
                return""
            }));
            this.externals[a] = {dir: f, file: d || this.fileName + ".js"}
        }
    }, load: function (c, f, d) {
        CKEDITOR.tools.isArray(c) || (c = c ? [c] : []);
        for (var b = this.loaded, a = this.registered, e = [], h = {}, k = {}, g = 0; g < c.length; g++) {
            var i = c[g];
            if (i)if (!b[i] && !a[i]) {
                var j = this.getFilePath(i);
                e.push(j);
                j in h || (h[j] = []);
                h[j].push(i)
            } else k[i] = this.get(i)
        }
        CKEDITOR.scriptLoader.load(e, function (a, c) {
            if (c.length)throw'[CKEDITOR.resourceManager.load] Resource name "' + h[c[0]].join(",") + '" was not found at "' + c[0] + '".';
            for (var e = 0; e < a.length; e++)for (var g = h[a[e]], i = 0; i < g.length; i++) {
                var j = g[i];
                k[j] = this.get(j);
                b[j] = 1
            }
            f.call(d, k)
        }, this)
    }}, CKEDITOR.plugins = new CKEDITOR.resourceManager("plugins/", "plugin"), CKEDITOR.plugins.load = CKEDITOR.tools.override(CKEDITOR.plugins.load,
        function (c) {
            var f = {};
            return function (d, b, a) {
                var e = {}, h = function (d) {
                    c.call(this, d, function (c) {
                        CKEDITOR.tools.extend(e, c);
                        var d = [], k;
                        for (k in c) {
                            var n = c[k], o = n && n.requires;
                            if (!f[k]) {
                                if (n.icons)for (var q = n.icons.split(","), l = q.length; l--;)CKEDITOR.skin.addIcon(q[l], n.path + "icons/" + (CKEDITOR.env.hidpi && n.hidpi ? "hidpi/" : "") + q[l] + ".png");
                                f[k] = 1
                            }
                            if (o) {
                                o.split && (o = o.split(","));
                                for (n = 0; n < o.length; n++)e[o[n]] || d.push(o[n])
                            }
                        }
                        if (d.length)h.call(this, d); else {
                            for (k in e) {
                                n = e[k];
                                if (n.onLoad && !n.onLoad._called) {
                                    n.onLoad() ===
                                    false && delete e[k];
                                    n.onLoad._called = 1
                                }
                            }
                            b && b.call(a || window, e)
                        }
                    }, this)
                };
                h.call(this, d)
            }
        }), CKEDITOR.plugins.setLang = function (c, f, d) {
        var b = this.get(c), c = b.langEntries || (b.langEntries = {}), b = b.lang || (b.lang = []);
        b.split && (b = b.split(","));
        CKEDITOR.tools.indexOf(b, f) == -1 && b.push(f);
        c[f] = d
    }, CKEDITOR.ui = function (c) {
        if (c.ui)return c.ui;
        this.items = {};
        this.instances = {};
        this.editor = c;
        this._ = {handlers: {}};
        return this
    }, CKEDITOR.ui.prototype = {add: function (c, f, d) {
        d.name = c.toLowerCase();
        var b = this.items[c] = {type: f,
            command: d.command || null, args: Array.prototype.slice.call(arguments, 2)};
        CKEDITOR.tools.extend(b, d)
    }, get: function (c) {
        return this.instances[c]
    }, create: function (c) {
        var f = this.items[c], d = f && this._.handlers[f.type], b = f && f.command && this.editor.getCommand(f.command), d = d && d.create.apply(this, f.args);
        this.instances[c] = d;
        b && b.uiItems.push(d);
        if (d && !d.type)d.type = f.type;
        return d
    }, addHandler: function (c, f) {
        this._.handlers[c] = f
    }, space: function (c) {
        return CKEDITOR.document.getById(this.spaceId(c))
    }, spaceId: function (c) {
        return this.editor.id +
            "_" + c
    }}, CKEDITOR.event.implementOn(CKEDITOR.ui), function () {
        function c(b, c, e) {
            CKEDITOR.event.call(this);
            b = b && CKEDITOR.tools.clone(b);
            if (c !== void 0) {
                if (c instanceof CKEDITOR.dom.element) {
                    if (!e)throw Error("One of the element modes must be specified.");
                } else throw Error("Expect element of type CKEDITOR.dom.element.");
                if (CKEDITOR.env.ie && CKEDITOR.env.quirks && e == CKEDITOR.ELEMENT_MODE_INLINE)throw Error("Inline element mode is not supported on IE quirks.");
                if (!(e == CKEDITOR.ELEMENT_MODE_INLINE ? c.is(CKEDITOR.dtd.$editable) ||
                    c.is("textarea") : e == CKEDITOR.ELEMENT_MODE_REPLACE ? !c.is(CKEDITOR.dtd.$nonBodyContent) : 1))throw Error('The specified element mode is not supported on element: "' + c.getName() + '".');
                this.element = c;
                this.elementMode = e;
                this.name = this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO && (c.getId() || c.getNameAtt())
            } else this.elementMode = CKEDITOR.ELEMENT_MODE_NONE;
            this._ = {};
            this.commands = {};
            this.templates = {};
            this.name = this.name || f();
            this.id = CKEDITOR.tools.getNextId();
            this.status = "unloaded";
            this.config = CKEDITOR.tools.prototypedCopy(CKEDITOR.config);
            this.ui = new CKEDITOR.ui(this);
            this.focusManager = new CKEDITOR.focusManager(this);
            this.keystrokeHandler = new CKEDITOR.keystrokeHandler(this);
            this.on("readOnly", d);
            this.on("selectionChange", function (b) {
                a(this, b.data.path)
            });
            this.on("activeFilterChange", function () {
                a(this, this.elementPath(), true)
            });
            this.on("mode", d);
            this.on("instanceReady", function () {
                this.config.startupFocus && this.focus()
            });
            CKEDITOR.fire("instanceCreated", null, this);
            CKEDITOR.add(this);
            CKEDITOR.tools.setTimeout(function () {
                h(this, b)
            }, 0, this)
        }

        function f() {
            do var a = "editor" + ++o; while (CKEDITOR.instances[a]);
            return a
        }

        function d() {
            var a = this.commands, c;
            for (c in a)b(this, a[c])
        }

        function b(a, b) {
            b[b.startDisabled ? "disable" : a.readOnly && !b.readOnly ? "disable" : b.modes[a.mode] ? "enable" : "disable"]()
        }

        function a(a, b, c) {
            if (b) {
                var e, d, g = a.commands;
                for (d in g) {
                    e = g[d];
                    (c || e.contextSensitive) && e.refresh(a, b)
                }
            }
        }

        function e(a) {
            var b = a.config.customConfig;
            if (!b)return false;
            var b = CKEDITOR.getUrl(b), c = q[b] || (q[b] = {});
            if (c.fn) {
                c.fn.call(a, a.config);
                (CKEDITOR.getUrl(a.config.customConfig) ==
                    b || !e(a)) && a.fireOnce("customConfigLoaded")
            } else CKEDITOR.scriptLoader.queue(b, function () {
                c.fn = CKEDITOR.editorConfig ? CKEDITOR.editorConfig : function () {
                };
                e(a)
            });
            return true
        }

        function h(a, b) {
            a.on("customConfigLoaded", function () {
                if (b) {
                    if (b.on)for (var c in b.on)a.on(c, b.on[c]);
                    CKEDITOR.tools.extend(a.config, b, true);
                    delete a.config.on
                }
                c = a.config;
                a.readOnly = !(!c.readOnly && !(a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.is("textarea") ? a.element.hasAttribute("disabled") : a.element.isReadOnly() : a.elementMode ==
                    CKEDITOR.ELEMENT_MODE_REPLACE && a.element.hasAttribute("disabled")));
                a.blockless = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? !(a.element.is("textarea") || CKEDITOR.dtd[a.element.getName()].p) : false;
                a.tabIndex = c.tabIndex || a.element && a.element.getAttribute("tabindex") || 0;
                a.activeEnterMode = a.enterMode = a.blockless ? CKEDITOR.ENTER_BR : c.enterMode;
                a.activeShiftEnterMode = a.shiftEnterMode = a.blockless ? CKEDITOR.ENTER_BR : c.shiftEnterMode;
                if (c.skin)CKEDITOR.skinName = c.skin;
                a.fireOnce("configLoaded");
                a.dataProcessor =
                    new CKEDITOR.htmlDataProcessor(a);
                a.filter = a.activeFilter = new CKEDITOR.filter(a);
                k(a)
            });
            if (b && b.customConfig != void 0)a.config.customConfig = b.customConfig;
            e(a) || a.fireOnce("customConfigLoaded")
        }

        function k(a) {
            CKEDITOR.skin.loadPart("editor", function () {
                g(a)
            })
        }

        function g(a) {
            CKEDITOR.lang.load(a.config.language, a.config.defaultLanguage, function (b, c) {
                var e = a.config.title;
                a.langCode = b;
                a.lang = CKEDITOR.tools.prototypedCopy(c);
                a.title = typeof e == "string" || e === false ? e : [a.lang.editor, a.name].join(", ");
                if (!a.config.contentsLangDirection)a.config.contentsLangDirection =
                        a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.getDirection(1) : a.lang.dir;
                a.fire("langLoaded");
                i(a)
            })
        }

        function i(a) {
            a.getStylesSet(function (b) {
                a.once("loaded", function () {
                    a.fire("stylesSet", {styles: b})
                }, null, null, 1);
                j(a)
            })
        }

        function j(a) {
            var b = a.config, c = b.plugins, e = b.extraPlugins, d = b.removePlugins;
            if (e)var g = RegExp("(?:^|,)(?:" + e.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g"), c = c.replace(g, ""), c = c + ("," + e);
            if (d)var h = RegExp("(?:^|,)(?:" + d.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g"), c = c.replace(h, "");
            CKEDITOR.env.air &&
            (c = c + ",adobeair");
            CKEDITOR.plugins.load(c.split(","), function (c) {
                var e = [], d = [], g = [];
                a.plugins = c;
                for (var f in c) {
                    var k = c[f], i = k.lang, p = null, j = k.requires, z;
                    CKEDITOR.tools.isArray(j) && (j = j.join(","));
                    if (j && (z = j.match(h)))for (; j = z.pop();)CKEDITOR.tools.setTimeout(function (a, b) {
                        throw Error('Plugin "' + a.replace(",", "") + '" cannot be removed from the plugins list, because it\'s required by "' + b + '" plugin.');
                    }, 0, null, [j, f]);
                    if (i && !a.lang[f]) {
                        i.split && (i = i.split(","));
                        if (CKEDITOR.tools.indexOf(i, a.langCode) >=
                            0)p = a.langCode; else {
                            p = a.langCode.replace(/-.*/, "");
                            p = p != a.langCode && CKEDITOR.tools.indexOf(i, p) >= 0 ? p : CKEDITOR.tools.indexOf(i, "en") >= 0 ? "en" : i[0]
                        }
                        if (!k.langEntries || !k.langEntries[p])g.push(CKEDITOR.getUrl(k.path + "lang/" + p + ".js")); else {
                            a.lang[f] = k.langEntries[p];
                            p = null
                        }
                    }
                    d.push(p);
                    e.push(k)
                }
                CKEDITOR.scriptLoader.load(g, function () {
                    for (var c = ["beforeInit", "init", "afterInit"], g = 0; g < c.length; g++)for (var h = 0; h < e.length; h++) {
                        var f = e[h];
                        g === 0 && (d[h] && f.lang && f.langEntries) && (a.lang[f.name] = f.langEntries[d[h]]);
                        if (f[c[g]])f[c[g]](a)
                    }
                    a.fireOnce("pluginsLoaded");
                    b.keystrokes && a.setKeystroke(a.config.keystrokes);
                    for (h = 0; h < a.config.blockedKeystrokes.length; h++)a.keystrokeHandler.blockedKeystrokes[a.config.blockedKeystrokes[h]] = 1;
                    a.status = "loaded";
                    a.fireOnce("loaded");
                    CKEDITOR.fire("instanceLoaded", null, a)
                })
            })
        }

        function n() {
            var a = this.element;
            if (a && this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO) {
                var b = this.getData();
                this.config.htmlEncodeOutput && (b = CKEDITOR.tools.htmlEncode(b));
                a.is("textarea") ? a.setValue(b) :
                    a.setHtml(b);
                return true
            }
            return false
        }

        c.prototype = CKEDITOR.editor.prototype;
        CKEDITOR.editor = c;
        var o = 0, q = {};
        CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {addCommand: function (a, c) {
            c.name = a.toLowerCase();
            var e = new CKEDITOR.command(this, c);
            this.mode && b(this, e);
            return this.commands[a] = e
        }, _attachToForm: function () {
            var a = this, b = a.element, c = new CKEDITOR.dom.element(b.$.form);
            if (b.is("textarea") && c) {
                var e = function (c) {
                    a.updateElement();
                    a._.required && (!b.getValue() && a.fire("required") === false) && c.data.preventDefault()
                };
                c.on("submit", e);
                if (c.$.submit && c.$.submit.call && c.$.submit.apply)c.$.submit = CKEDITOR.tools.override(c.$.submit, function (a) {
                    return function () {
                        e();
                        a.apply ? a.apply(this) : a()
                    }
                });
                a.on("destroy", function () {
                    c.removeListener("submit", e)
                })
            }
        }, destroy: function (a) {
            this.fire("beforeDestroy");
            !a && n.call(this);
            this.editable(null);
            this.status = "destroyed";
            this.fire("destroy");
            this.removeAllListeners();
            CKEDITOR.remove(this);
            CKEDITOR.fire("instanceDestroyed", null, this)
        }, elementPath: function (a) {
            if (!a) {
                a = this.getSelection();
                if (!a)return null;
                a = a.getStartElement()
            }
            return a ? new CKEDITOR.dom.elementPath(a, this.editable()) : null
        }, createRange: function () {
            var a = this.editable();
            return a ? new CKEDITOR.dom.range(a) : null
        }, execCommand: function (a, b) {
            var c = this.getCommand(a), e = {name: a, commandData: b, command: c};
            if (c && c.state != CKEDITOR.TRISTATE_DISABLED && this.fire("beforeCommandExec", e) !== false) {
                e.returnValue = c.exec(e.commandData);
                if (!c.async && this.fire("afterCommandExec", e) !== false)return e.returnValue
            }
            return false
        }, getCommand: function (a) {
            return this.commands[a]
        },
            getData: function (a) {
                !a && this.fire("beforeGetData");
                var b = this._.data;
                if (typeof b != "string")b = (b = this.element) && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ? b.is("textarea") ? b.getValue() : b.getHtml() : "";
                b = {dataValue: b};
                !a && this.fire("getData", b);
                return b.dataValue
            }, getSnapshot: function () {
                var a = this.fire("getSnapshot");
                if (typeof a != "string") {
                    var b = this.element;
                    b && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && (a = b.is("textarea") ? b.getValue() : b.getHtml())
                }
                return a
            }, loadSnapshot: function (a) {
                this.fire("loadSnapshot",
                    a)
            }, setData: function (a, b, c) {
                !c && this.fire("saveSnapshot");
                if (b || !c)this.once("dataReady", function (a) {
                    c || this.fire("saveSnapshot");
                    b && b.call(a.editor)
                });
                a = {dataValue: a};
                !c && this.fire("setData", a);
                this._.data = a.dataValue;
                !c && this.fire("afterSetData", a)
            }, setReadOnly: function (a) {
                a = a == void 0 || a;
                if (this.readOnly != a) {
                    this.readOnly = a;
                    this.keystrokeHandler.blockedKeystrokes[8] = +a;
                    this.editable().setReadOnly(a);
                    this.fire("readOnly")
                }
            }, insertHtml: function (a, b) {
                this.fire("insertHtml", {dataValue: a, mode: b})
            }, insertText: function (a) {
                this.fire("insertText",
                    a)
            }, insertElement: function (a) {
                this.fire("insertElement", a)
            }, focus: function () {
                this.fire("beforeFocus")
            }, checkDirty: function () {
                return this.status == "ready" && this._.previousValue !== this.getSnapshot()
            }, resetDirty: function () {
                this._.previousValue = this.getSnapshot()
            }, updateElement: function () {
                return n.call(this)
            }, setKeystroke: function () {
                for (var a = this.keystrokeHandler.keystrokes, b = CKEDITOR.tools.isArray(arguments[0]) ? arguments[0] : [[].slice.call(arguments, 0)], c, e, d = b.length; d--;) {
                    c = b[d];
                    e = 0;
                    if (CKEDITOR.tools.isArray(c)) {
                        e =
                            c[1];
                        c = c[0]
                    }
                    e ? a[c] = e : delete a[c]
                }
            }, addFeature: function (a) {
                return this.filter.addFeature(a)
            }, setActiveFilter: function (a) {
                if (!a)a = this.filter;
                if (this.activeFilter !== a) {
                    this.activeFilter = a;
                    this.fire("activeFilterChange");
                    a === this.filter ? this.setActiveEnterMode(null, null) : this.setActiveEnterMode(a.getAllowedEnterMode(this.enterMode), a.getAllowedEnterMode(this.shiftEnterMode, true))
                }
            }, setActiveEnterMode: function (a, b) {
                a = a ? this.blockless ? CKEDITOR.ENTER_BR : a : this.enterMode;
                b = b ? this.blockless ? CKEDITOR.ENTER_BR :
                    b : this.shiftEnterMode;
                if (this.activeEnterMode != a || this.activeShiftEnterMode != b) {
                    this.activeEnterMode = a;
                    this.activeShiftEnterMode = b;
                    this.fire("activeEnterModeChange")
                }
            }})
    }(), CKEDITOR.ELEMENT_MODE_NONE = 0, CKEDITOR.ELEMENT_MODE_REPLACE = 1, CKEDITOR.ELEMENT_MODE_APPENDTO = 2, CKEDITOR.ELEMENT_MODE_INLINE = 3, CKEDITOR.htmlParser = function () {
        this._ = {htmlPartsRegex: RegExp("<(?:(?:\\/([^>]+)>)|(?:!--([\\S|\\s]*?)--\>)|(?:([^\\s>]+)\\s*((?:(?:\"[^\"]*\")|(?:'[^']*')|[^\"'>])*)\\/?>))", "g")}
    }, function () {
        var c = /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g,
            f = {checked: 1, compact: 1, declare: 1, defer: 1, disabled: 1, ismap: 1, multiple: 1, nohref: 1, noresize: 1, noshade: 1, nowrap: 1, readonly: 1, selected: 1};
        CKEDITOR.htmlParser.prototype = {onTagOpen: function () {
        }, onTagClose: function () {
        }, onText: function () {
        }, onCDATA: function () {
        }, onComment: function () {
        }, parse: function (d) {
            for (var b, a, e = 0, h; b = this._.htmlPartsRegex.exec(d);) {
                a = b.index;
                if (a > e) {
                    e = d.substring(e, a);
                    if (h)h.push(e); else this.onText(e)
                }
                e = this._.htmlPartsRegex.lastIndex;
                if (a = b[1]) {
                    a = a.toLowerCase();
                    if (h && CKEDITOR.dtd.$cdata[a]) {
                        this.onCDATA(h.join(""));
                        h = null
                    }
                    if (!h) {
                        this.onTagClose(a);
                        continue
                    }
                }
                if (h)h.push(b[0]); else if (a = b[3]) {
                    a = a.toLowerCase();
                    if (!/="/.test(a)) {
                        var k = {}, g;
                        b = b[4];
                        var i = !!(b && b.charAt(b.length - 1) == "/");
                        if (b)for (; g = c.exec(b);) {
                            var j = g[1].toLowerCase();
                            g = g[2] || g[3] || g[4] || "";
                            k[j] = !g && f[j] ? j : CKEDITOR.tools.htmlDecodeAttr(g)
                        }
                        this.onTagOpen(a, k, i);
                        !h && CKEDITOR.dtd.$cdata[a] && (h = [])
                    }
                } else if (a = b[2])this.onComment(a)
            }
            if (d.length > e)this.onText(d.substring(e, d.length))
        }}
    }(), CKEDITOR.htmlParser.basicWriter = CKEDITOR.tools.createClass({$: function () {
        this._ =
        {output: []}
    }, proto: {openTag: function (c) {
        this._.output.push("<", c)
    }, openTagClose: function (c, f) {
        f ? this._.output.push(" />") : this._.output.push(">")
    }, attribute: function (c, f) {
        typeof f == "string" && (f = CKEDITOR.tools.htmlEncodeAttr(f));
        this._.output.push(" ", c, '="', f, '"')
    }, closeTag: function (c) {
        this._.output.push("</", c, ">")
    }, text: function (c) {
        this._.output.push(c)
    }, comment: function (c) {
        this._.output.push("<\!--", c, "--\>")
    }, write: function (c) {
        this._.output.push(c)
    }, reset: function () {
        this._.output = [];
        this._.indent =
            false
    }, getHtml: function (c) {
        var f = this._.output.join("");
        c && this.reset();
        return f
    }}}), "use strict", function () {
        CKEDITOR.htmlParser.node = function () {
        };
        CKEDITOR.htmlParser.node.prototype = {remove: function () {
            var c = this.parent.children, f = CKEDITOR.tools.indexOf(c, this), d = this.previous, b = this.next;
            d && (d.next = b);
            b && (b.previous = d);
            c.splice(f, 1);
            this.parent = null
        }, replaceWith: function (c) {
            var f = this.parent.children, d = CKEDITOR.tools.indexOf(f, this), b = c.previous = this.previous, a = c.next = this.next;
            b && (b.next = c);
            a && (a.previous =
                c);
            f[d] = c;
            c.parent = this.parent;
            this.parent = null
        }, insertAfter: function (c) {
            var f = c.parent.children, d = CKEDITOR.tools.indexOf(f, c), b = c.next;
            f.splice(d + 1, 0, this);
            this.next = c.next;
            this.previous = c;
            c.next = this;
            b && (b.previous = this);
            this.parent = c.parent
        }, insertBefore: function (c) {
            var f = c.parent.children, d = CKEDITOR.tools.indexOf(f, c);
            f.splice(d, 0, this);
            this.next = c;
            (this.previous = c.previous) && (c.previous.next = this);
            c.previous = this;
            this.parent = c.parent
        }, getAscendant: function (c) {
            var f = typeof c == "function" ? c : typeof c ==
                "string" ? function (b) {
                return b.name == c
            } : function (b) {
                return b.name in c
            }, d = this.parent;
            for (; d && d.type == CKEDITOR.NODE_ELEMENT;) {
                if (f(d))return d;
                d = d.parent
            }
            return null
        }, wrapWith: function (c) {
            this.replaceWith(c);
            c.add(this);
            return c
        }, getIndex: function () {
            return CKEDITOR.tools.indexOf(this.parent.children, this)
        }, getFilterContext: function (c) {
            return c || {}
        }}
    }(), "use strict", CKEDITOR.htmlParser.comment = function (c) {
        this.value = c;
        this._ = {isBlockLike: false}
    },CKEDITOR.htmlParser.comment.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node,
        {type: CKEDITOR.NODE_COMMENT, filter: function (c, f) {
            var d = this.value;
            if (!(d = c.onComment(f, d, this))) {
                this.remove();
                return false
            }
            if (typeof d != "string") {
                this.replaceWith(d);
                return false
            }
            this.value = d;
            return true
        }, writeHtml: function (c, f) {
            f && this.filter(f);
            c.comment(this.value)
        }}),"use strict",function () {
        CKEDITOR.htmlParser.text = function (c) {
            this.value = c;
            this._ = {isBlockLike: false}
        };
        CKEDITOR.htmlParser.text.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {type: CKEDITOR.NODE_TEXT, filter: function (c, f) {
            if (!(this.value = c.onText(f, this.value, this))) {
                this.remove();
                return false
            }
        }, writeHtml: function (c, f) {
            f && this.filter(f);
            c.text(this.value)
        }})
    }(),"use strict",function () {
        CKEDITOR.htmlParser.cdata = function (c) {
            this.value = c
        };
        CKEDITOR.htmlParser.cdata.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {type: CKEDITOR.NODE_TEXT, filter: function () {
        }, writeHtml: function (c) {
            c.write(this.value)
        }})
    }(),"use strict",CKEDITOR.htmlParser.fragment = function () {
        this.children = [];
        this.parent = null;
        this._ = {isBlockLike: true,
            hasInlineStarted: false}
    },function () {
        function c(a) {
            return a.attributes["data-cke-survive"] ? false : a.name == "a" && a.attributes.href || CKEDITOR.dtd.$removeEmpty[a.name]
        }

        var f = CKEDITOR.tools.extend({table: 1, ul: 1, ol: 1, dl: 1}, CKEDITOR.dtd.table, CKEDITOR.dtd.ul, CKEDITOR.dtd.ol, CKEDITOR.dtd.dl), d = {ol: 1, ul: 1}, b = CKEDITOR.tools.extend({}, {html: 1}, CKEDITOR.dtd.html, CKEDITOR.dtd.body, CKEDITOR.dtd.head, {style: 1, script: 1}), a = {ul: "li", ol: "li", dl: "dd", table: "tbody", tbody: "tr", thead: "tr", tfoot: "tr", tr: "td"};
        CKEDITOR.htmlParser.fragment.fromHtml =
            function (e, h, k) {
                function g(a) {
                    var b;
                    if (r.length > 0)for (var c = 0; c < r.length; c++) {
                        var e = r[c], d = e.name, g = CKEDITOR.dtd[d], h = p.name && CKEDITOR.dtd[p.name];
                        if ((!h || h[d]) && (!a || !g || g[a] || !CKEDITOR.dtd[a])) {
                            if (!b) {
                                i();
                                b = 1
                            }
                            e = e.clone();
                            e.parent = p;
                            p = e;
                            r.splice(c, 1);
                            c--
                        } else if (d == p.name) {
                            n(p, p.parent, 1);
                            c--
                        }
                    }
                }

                function i() {
                    for (; t.length;)n(t.shift(), p)
                }

                function j(a) {
                    if (a._.isBlockLike && a.name != "pre" && a.name != "textarea") {
                        var b = a.children.length, c = a.children[b - 1], e;
                        if (c && c.type == CKEDITOR.NODE_TEXT)(e = CKEDITOR.tools.rtrim(c.value)) ?
                            c.value = e : a.children.length = b - 1
                    }
                }

                function n(a, b, e) {
                    var b = b || p || m, d = p;
                    if (a.previous === void 0) {
                        if (o(b, a)) {
                            p = b;
                            l.onTagOpen(k, {});
                            a.returnPoint = b = p
                        }
                        j(a);
                        (!c(a) || a.children.length) && b.add(a);
                        a.name == "pre" && (s = false);
                        a.name == "textarea" && (u = false)
                    }
                    if (a.returnPoint) {
                        p = a.returnPoint;
                        delete a.returnPoint
                    } else p = e ? b : d
                }

                function o(a, b) {
                    if ((a == m || a.name == "body") && k && (!a.name || CKEDITOR.dtd[a.name][k])) {
                        var c, e;
                        return(c = b.attributes && (e = b.attributes["data-cke-real-element-type"]) ? e : b.name) && c in CKEDITOR.dtd.$inline && !(c in CKEDITOR.dtd.head) && !b.isOrphan || b.type == CKEDITOR.NODE_TEXT
                    }
                }

                function q(a, b) {
                    return a in CKEDITOR.dtd.$listItem || a in CKEDITOR.dtd.$tableContent ? a == b || a == "dt" && b == "dd" || a == "dd" && b == "dt" : false
                }

                var l = new CKEDITOR.htmlParser, m = h instanceof CKEDITOR.htmlParser.element ? h : typeof h == "string" ? new CKEDITOR.htmlParser.element(h) : new CKEDITOR.htmlParser.fragment, r = [], t = [], p = m, u = m.name == "textarea", s = m.name == "pre";
                l.onTagOpen = function (a, e, h, k) {
                    e = new CKEDITOR.htmlParser.element(a, e);
                    if (e.isUnknown && h)e.isEmpty =
                        true;
                    e.isOptionalClose = k;
                    if (c(e))r.push(e); else {
                        if (a == "pre")s = true; else {
                            if (a == "br" && s) {
                                p.add(new CKEDITOR.htmlParser.text("\n"));
                                return
                            }
                            a == "textarea" && (u = true)
                        }
                        if (a == "br")t.push(e); else {
                            for (; ;) {
                                k = (h = p.name) ? CKEDITOR.dtd[h] || (p._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : b;
                                if (!e.isUnknown && !p.isUnknown && !k[a])if (p.isOptionalClose)l.onTagClose(h); else if (a in d && h in d) {
                                    h = p.children;
                                    (h = h[h.length - 1]) && h.name == "li" || n(h = new CKEDITOR.htmlParser.element("li"), p);
                                    !e.returnPoint && (e.returnPoint = p);
                                    p = h
                                } else if (a in CKEDITOR.dtd.$listItem && !q(a, h))l.onTagOpen(a == "li" ? "ul" : "dl", {}, 0, 1); else if (h in f && !q(a, h)) {
                                    !e.returnPoint && (e.returnPoint = p);
                                    p = p.parent
                                } else {
                                    h in CKEDITOR.dtd.$inline && r.unshift(p);
                                    if (p.parent)n(p, p.parent, 1); else {
                                        e.isOrphan = 1;
                                        break
                                    }
                                } else break
                            }
                            g(a);
                            i();
                            e.parent = p;
                            e.isEmpty ? n(e) : p = e
                        }
                    }
                };
                l.onTagClose = function (a) {
                    for (var b = r.length - 1; b >= 0; b--)if (a == r[b].name) {
                        r.splice(b, 1);
                        return
                    }
                    for (var c = [], e = [], d = p; d != m && d.name != a;) {
                        d._.isBlockLike || e.unshift(d);
                        c.push(d);
                        d = d.returnPoint || d.parent
                    }
                    if (d !=
                        m) {
                        for (b = 0; b < c.length; b++) {
                            var g = c[b];
                            n(g, g.parent)
                        }
                        p = d;
                        d._.isBlockLike && i();
                        n(d, d.parent);
                        if (d == p)p = p.parent;
                        r = r.concat(e)
                    }
                    a == "body" && (k = false)
                };
                l.onText = function (c) {
                    if ((!p._.hasInlineStarted || t.length) && !s && !u) {
                        c = CKEDITOR.tools.ltrim(c);
                        if (c.length === 0)return
                    }
                    var e = p.name, d = e ? CKEDITOR.dtd[e] || (p._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : b;
                    if (!u && !d["#"] && e in f) {
                        l.onTagOpen(a[e] || "");
                        l.onText(c)
                    } else {
                        i();
                        g();
                        !s && !u && (c = c.replace(/[\t\r\n ]{2,}|[\t\r\n]/g, " "));
                        c = new CKEDITOR.htmlParser.text(c);
                        if (o(p, c))this.onTagOpen(k, {}, 0, 1);
                        p.add(c)
                    }
                };
                l.onCDATA = function (a) {
                    p.add(new CKEDITOR.htmlParser.cdata(a))
                };
                l.onComment = function (a) {
                    i();
                    g();
                    p.add(new CKEDITOR.htmlParser.comment(a))
                };
                l.parse(e);
                for (i(); p != m;)n(p, p.parent, 1);
                j(m);
                return m
            };
        CKEDITOR.htmlParser.fragment.prototype = {type: CKEDITOR.NODE_DOCUMENT_FRAGMENT, add: function (a, b) {
            isNaN(b) && (b = this.children.length);
            var c = b > 0 ? this.children[b - 1] : null;
            if (c) {
                if (a._.isBlockLike && c.type == CKEDITOR.NODE_TEXT) {
                    c.value = CKEDITOR.tools.rtrim(c.value);
                    if (c.value.length ===
                        0) {
                        this.children.pop();
                        this.add(a);
                        return
                    }
                }
                c.next = a
            }
            a.previous = c;
            a.parent = this;
            this.children.splice(b, 0, a);
            if (!this._.hasInlineStarted)this._.hasInlineStarted = a.type == CKEDITOR.NODE_TEXT || a.type == CKEDITOR.NODE_ELEMENT && !a._.isBlockLike
        }, filter: function (a, b) {
            b = this.getFilterContext(b);
            a.onRoot(b, this);
            this.filterChildren(a, false, b)
        }, filterChildren: function (a, b, c) {
            if (this.childrenFilteredBy != a.id) {
                c = this.getFilterContext(c);
                if (b && !this.parent)a.onRoot(c, this);
                this.childrenFilteredBy = a.id;
                for (b = 0; b < this.children.length; b++)this.children[b].filter(a,
                    c) === false && b--
            }
        }, writeHtml: function (a, b) {
            b && this.filter(b);
            this.writeChildrenHtml(a)
        }, writeChildrenHtml: function (a, b, c) {
            var d = this.getFilterContext();
            if (c && !this.parent && b)b.onRoot(d, this);
            b && this.filterChildren(b, false, d);
            b = 0;
            c = this.children;
            for (d = c.length; b < d; b++)c[b].writeHtml(a)
        }, forEach: function (a, b, c) {
            if (!c && (!b || this.type == b))var d = a(this);
            if (d !== false)for (var c = this.children, f = 0; f < c.length; f++) {
                d = c[f];
                d.type == CKEDITOR.NODE_ELEMENT ? d.forEach(a, b) : (!b || d.type == b) && a(d)
            }
        }, getFilterContext: function (a) {
            return a ||
            {}
        }}
    }(),"use strict",function () {
        function c() {
            this.rules = []
        }

        function f(d, b, a, e) {
            var f, k;
            for (f in b) {
                (k = d[f]) || (k = d[f] = new c);
                k.add(b[f], a, e)
            }
        }

        CKEDITOR.htmlParser.filter = CKEDITOR.tools.createClass({$: function (d) {
            this.id = CKEDITOR.tools.getNextNumber();
            this.elementNameRules = new c;
            this.attributeNameRules = new c;
            this.elementsRules = {};
            this.attributesRules = {};
            this.textRules = new c;
            this.commentRules = new c;
            this.rootRules = new c;
            d && this.addRules(d, 10)
        }, proto: {addRules: function (c, b) {
            var a;
            if (typeof b == "number")a =
                b; else if (b && "priority"in b)a = b.priority;
            typeof a != "number" && (a = 10);
            typeof b != "object" && (b = {});
            c.elementNames && this.elementNameRules.addMany(c.elementNames, a, b);
            c.attributeNames && this.attributeNameRules.addMany(c.attributeNames, a, b);
            c.elements && f(this.elementsRules, c.elements, a, b);
            c.attributes && f(this.attributesRules, c.attributes, a, b);
            c.text && this.textRules.add(c.text, a, b);
            c.comment && this.commentRules.add(c.comment, a, b);
            c.root && this.rootRules.add(c.root, a, b)
        }, applyTo: function (c) {
            c.filter(this)
        }, onElementName: function (c, b) {
            return this.elementNameRules.execOnName(c, b)
        }, onAttributeName: function (c, b) {
            return this.attributeNameRules.execOnName(c, b)
        }, onText: function (c, b, a) {
            return this.textRules.exec(c, b, a)
        }, onComment: function (c, b, a) {
            return this.commentRules.exec(c, b, a)
        }, onRoot: function (c, b) {
            return this.rootRules.exec(c, b)
        }, onElement: function (c, b) {
            for (var a = [this.elementsRules["^"], this.elementsRules[b.name], this.elementsRules.$], e, f = 0; f < 3; f++)if (e = a[f]) {
                e = e.exec(c, b, this);
                if (e === false)return null;
                if (e && e != b)return this.onNode(c,
                    e);
                if (b.parent && !b.name)break
            }
            return b
        }, onNode: function (c, b) {
            var a = b.type;
            return a == CKEDITOR.NODE_ELEMENT ? this.onElement(c, b) : a == CKEDITOR.NODE_TEXT ? new CKEDITOR.htmlParser.text(this.onText(c, b.value)) : a == CKEDITOR.NODE_COMMENT ? new CKEDITOR.htmlParser.comment(this.onComment(c, b.value)) : null
        }, onAttribute: function (c, b, a, e) {
            return(a = this.attributesRules[a]) ? a.exec(c, e, b, this) : e
        }}});
        CKEDITOR.htmlParser.filterRulesGroup = c;
        c.prototype = {add: function (c, b, a) {
            this.rules.splice(this.findIndex(b), 0, {value: c, priority: b,
                options: a})
        }, addMany: function (c, b, a) {
            for (var e = [this.findIndex(b), 0], f = 0, k = c.length; f < k; f++)e.push({value: c[f], priority: b, options: a});
            this.rules.splice.apply(this.rules, e)
        }, findIndex: function (c) {
            for (var b = this.rules, a = b.length - 1; a >= 0 && c < b[a].priority;)a--;
            return a + 1
        }, exec: function (c, b) {
            var a = b instanceof CKEDITOR.htmlParser.node || b instanceof CKEDITOR.htmlParser.fragment, e = Array.prototype.slice.call(arguments, 1), f = this.rules, k = f.length, g, i, j, n;
            for (n = 0; n < k; n++) {
                if (a) {
                    g = b.type;
                    i = b.name
                }
                j = f[n];
                if (!(c.nonEditable && !j.options.applyToAll || c.nestedEditable && j.options.excludeNestedEditable)) {
                    j = j.value.apply(null, e);
                    if (j === false || a && j && (j.name != i || j.type != g))return j;
                    j != void 0 && (e[0] = b = j)
                }
            }
            return b
        }, execOnName: function (c, b) {
            for (var a = 0, e = this.rules, f = e.length, k; b && a < f; a++) {
                k = e[a];
                !(c.nonEditable && !k.options.applyToAll || c.nestedEditable && k.options.excludeNestedEditable) && (b = b.replace(k.value[0], k.value[1]))
            }
            return b
        }}
    }(),function () {
        function c(c, g) {
            function f(a) {
                return a || CKEDITOR.env.needsNbspFiller ? new CKEDITOR.htmlParser.text(" ") :
                    new CKEDITOR.htmlParser.element("br", {"data-cke-bogus": 1})
            }

            function w(a, c) {
                return function (g) {
                    if (g.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
                        var h = [], w = d(g), i, C;
                        if (w)for (k(w, 1) && h.push(w); w;) {
                            if (e(w) && (i = b(w)) && k(i))if ((C = b(i)) && !e(C))h.push(i); else {
                                f(l).insertAfter(i);
                                i.remove()
                            }
                            w = w.previous
                        }
                        for (w = 0; w < h.length; w++)h[w].remove();
                        if (h = typeof c == "function" ? c(g) !== false : c)if (!l && !CKEDITOR.env.needsBrFiller && g.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT)h = false; else if (!l && !CKEDITOR.env.needsBrFiller && (document.documentMode >
                            7 || g.name in CKEDITOR.dtd.tr || g.name in CKEDITOR.dtd.$listItem))h = false; else {
                            h = d(g);
                            h = !h || g.name == "form" && h.name == "input"
                        }
                        h && g.add(f(a))
                    }
                }
            }

            function k(a, b) {
                if ((!l || CKEDITOR.env.needsBrFiller) && a.type == CKEDITOR.NODE_ELEMENT && a.name == "br" && !a.attributes["data-cke-eol"])return true;
                var c;
                if (a.type == CKEDITOR.NODE_TEXT && (c = a.value.match(r))) {
                    if (c.index) {
                        (new CKEDITOR.htmlParser.text(a.value.substring(0, c.index))).insertBefore(a);
                        a.value = c[0]
                    }
                    if (!CKEDITOR.env.needsBrFiller && l && (!b || a.parent.name in C))return true;
                    if (!l)if ((c = a.previous) && c.name == "br" || !c || e(c))return true
                }
                return false
            }

            var i = {elements: {}}, l = g == "html", C = CKEDITOR.tools.extend({}, s), j;
            for (j in C)"#"in p[j] || delete C[j];
            for (j in C)i.elements[j] = w(l, c.config.fillEmptyBlocks !== false);
            i.root = w(l);
            i.elements.br = function (c) {
                return function (d) {
                    if (d.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
                        var g = d.attributes;
                        if ("data-cke-bogus"in g || "data-cke-eol"in g)delete g["data-cke-bogus"]; else {
                            for (g = d.next; g && a(g);)g = g.next;
                            var w = b(d);
                            !g && e(d.parent) ? h(d.parent,
                                f(c)) : e(g) && (w && !e(w)) && f(c).insertBefore(g)
                        }
                    }
                }
            }(l);
            return i
        }

        function f(a, b) {
            return a != CKEDITOR.ENTER_BR && b !== false ? a == CKEDITOR.ENTER_DIV ? "div" : "p" : false
        }

        function d(b) {
            for (b = b.children[b.children.length - 1]; b && a(b);)b = b.previous;
            return b
        }

        function b(b) {
            for (b = b.previous; b && a(b);)b = b.previous;
            return b
        }

        function a(a) {
            return a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(a.value) || a.type == CKEDITOR.NODE_ELEMENT && a.attributes["data-cke-bookmark"]
        }

        function e(a) {
            return a && (a.type == CKEDITOR.NODE_ELEMENT && a.name in
                s || a.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT)
        }

        function h(a, b) {
            var c = a.children[a.children.length - 1];
            a.children.push(b);
            b.parent = a;
            if (c) {
                c.next = b;
                b.previous = c
            }
        }

        function k(a) {
            a = a.attributes;
            a.contenteditable != "false" && (a["data-cke-editable"] = a.contenteditable ? "true" : 1);
            a.contenteditable = "false"
        }

        function g(a) {
            a = a.attributes;
            switch (a["data-cke-editable"]) {
                case "true":
                    a.contenteditable = "true";
                    break;
                case "1":
                    delete a.contenteditable
            }
        }

        function i(a) {
            return a.replace(B, function (a, b, c) {
                return"<" + b + c.replace(E,
                    function (a, b) {
                        return F.test(b) && c.indexOf("data-cke-saved-" + b) == -1 ? " data-cke-saved-" + a + " data-cke-" + CKEDITOR.rnd + "-" + a : a
                    }) + ">"
            })
        }

        function j(a, b) {
            return a.replace(b, function (a, b, c) {
                a.indexOf("<textarea") === 0 && (a = b + q(c).replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</textarea>");
                return"<cke:encoded>" + encodeURIComponent(a) + "</cke:encoded>"
            })
        }

        function n(a) {
            return a.replace(z, function (a, b) {
                return decodeURIComponent(b)
            })
        }

        function o(a) {
            return a.replace(/<\!--(?!{cke_protected})[\s\S]+?--\>/g, function (a) {
                return"<\!--" +
                    t + "{C}" + encodeURIComponent(a).replace(/--/g, "%2D%2D") + "--\>"
            })
        }

        function q(a) {
            return a.replace(/<\!--\{cke_protected\}\{C\}([\s\S]+?)--\>/g, function (a, b) {
                return decodeURIComponent(b)
            })
        }

        function l(a, b) {
            var c = b._.dataStore;
            return a.replace(/<\!--\{cke_protected\}([\s\S]+?)--\>/g, function (a, b) {
                return decodeURIComponent(b)
            }).replace(/\{cke_protected_(\d+)\}/g, function (a, b) {
                return c && c[b] || ""
            })
        }

        function m(a, b) {
            for (var c = [], e = b.config.protectedSource, d = b._.dataStore || (b._.dataStore = {id: 1}), g = /<\!--\{cke_temp(comment)?\}(\d*?)--\>/g,
                     e = [/<script[\s\S]*?<\/script>/gi, /<noscript[\s\S]*?<\/noscript>/gi].concat(e), a = a.replace(/<\!--[\s\S]*?--\>/g, function (a) {
                    return"<\!--{cke_tempcomment}" + (c.push(a) - 1) + "--\>"
                }), f = 0; f < e.length; f++)a = a.replace(e[f], function (a) {
                a = a.replace(g, function (a, b, e) {
                    return c[e]
                });
                return/cke_temp(comment)?/.test(a) ? a : "<\!--{cke_temp}" + (c.push(a) - 1) + "--\>"
            });
            a = a.replace(g, function (a, b, e) {
                return"<\!--" + t + (b ? "{C}" : "") + encodeURIComponent(c[e]).replace(/--/g, "%2D%2D") + "--\>"
            });
            a = a.replace(/<\w+(?:\s+(?:(?:[^\s=>]+\s*=\s*(?:[^'"\s>]+|'[^']*'|"[^"]*"))|[^\s=>]+))+\s*>/g,
                function (a) {
                    return a.replace(/<\!--\{cke_protected\}([^>]*)--\>/g, function (a, b) {
                        d[d.id] = decodeURIComponent(b);
                        return"{cke_protected_" + d.id++ + "}"
                    })
                });
            return a = a.replace(/<(title|iframe|textarea)([^>]*)>([\s\S]*?)<\/\1>/g, function (a, c, e, d) {
                return"<" + c + e + ">" + l(q(d), b) + "</" + c + ">"
            })
        }

        CKEDITOR.htmlDataProcessor = function (a) {
            var b, e, d = this;
            this.editor = a;
            this.dataFilter = b = new CKEDITOR.htmlParser.filter;
            this.htmlFilter = e = new CKEDITOR.htmlParser.filter;
            this.writer = new CKEDITOR.htmlParser.basicWriter;
            b.addRules(x);
            b.addRules(y, {applyToAll: true});
            b.addRules(c(a, "data"), {applyToAll: true});
            e.addRules(v);
            e.addRules(A, {applyToAll: true});
            e.addRules(c(a, "html"), {applyToAll: true});
            a.on("toHtml", function (b) {
                var b = b.data, c = b.dataValue, c = m(c, a), c = j(c, D), c = i(c), c = j(c, J), c = c.replace(w, "$1cke:$2"), c = c.replace(I, "<cke:$1$2></cke:$1>"), c = c.replace(/(<pre\b[^>]*>)(\r\n|\n)/g, "$1$2$2"), c = c.replace(/([^a-z0-9<\-])(on\w{3,})(?!>)/gi, "$1data-cke-" + CKEDITOR.rnd + "-$2"), e = b.context || a.editable().getName(), d;
                if (CKEDITOR.env.ie && CKEDITOR.env.version <
                    9 && e == "pre") {
                    e = "div";
                    c = "<pre>" + c + "</pre>";
                    d = 1
                }
                e = a.document.createElement(e);
                e.setHtml("a" + c);
                c = e.getHtml().substr(1);
                c = c.replace(RegExp("data-cke-" + CKEDITOR.rnd + "-", "ig"), "");
                d && (c = c.replace(/^<pre>|<\/pre>$/gi, ""));
                c = c.replace(C, "$1$2");
                c = n(c);
                c = q(c);
                b.dataValue = CKEDITOR.htmlParser.fragment.fromHtml(c, b.context, b.fixForBody === false ? false : f(b.enterMode, a.config.autoParagraph))
            }, null, null, 5);
            a.on("toHtml", function (b) {
                b.data.filter.applyTo(b.data.dataValue, true, b.data.dontFilter, b.data.enterMode) &&
                a.fire("dataFiltered")
            }, null, null, 6);
            a.on("toHtml", function (a) {
                a.data.dataValue.filterChildren(d.dataFilter, true)
            }, null, null, 10);
            a.on("toHtml", function (a) {
                var a = a.data, b = a.dataValue, c = new CKEDITOR.htmlParser.basicWriter;
                b.writeChildrenHtml(c);
                b = c.getHtml(true);
                a.dataValue = o(b)
            }, null, null, 15);
            a.on("toDataFormat", function (b) {
                var c = b.data.dataValue;
                b.data.enterMode != CKEDITOR.ENTER_BR && (c = c.replace(/^<br *\/?>/i, ""));
                b.data.dataValue = CKEDITOR.htmlParser.fragment.fromHtml(c, b.data.context, f(b.data.enterMode,
                    a.config.autoParagraph))
            }, null, null, 5);
            a.on("toDataFormat", function (a) {
                a.data.dataValue.filterChildren(d.htmlFilter, true)
            }, null, null, 10);
            a.on("toDataFormat", function (a) {
                a.data.filter.applyTo(a.data.dataValue, false, true)
            }, null, null, 11);
            a.on("toDataFormat", function (b) {
                var c = b.data.dataValue, e = d.writer;
                e.reset();
                c.writeChildrenHtml(e);
                c = e.getHtml(true);
                c = q(c);
                c = l(c, a);
                b.data.dataValue = c
            }, null, null, 15)
        };
        CKEDITOR.htmlDataProcessor.prototype = {toHtml: function (a, b, c, e) {
            var d = this.editor, g, f, h;
            if (b && typeof b ==
                "object") {
                g = b.context;
                c = b.fixForBody;
                e = b.dontFilter;
                f = b.filter;
                h = b.enterMode
            } else g = b;
            !g && g !== null && (g = d.editable().getName());
            return d.fire("toHtml", {dataValue: a, context: g, fixForBody: c, dontFilter: e, filter: f || d.filter, enterMode: h || d.enterMode}).dataValue
        }, toDataFormat: function (a, b) {
            var c, e, d;
            if (b) {
                c = b.context;
                e = b.filter;
                d = b.enterMode
            }
            !c && c !== null && (c = this.editor.editable().getName());
            return this.editor.fire("toDataFormat", {dataValue: a, filter: e || this.editor.filter, context: c, enterMode: d || this.editor.enterMode}).dataValue
        }};
        var r = /(?:&nbsp;|\xa0)$/, t = "{cke_protected}", p = CKEDITOR.dtd, u = ["caption", "colgroup", "col", "thead", "tfoot", "tbody"], s = CKEDITOR.tools.extend({}, p.$blockLimit, p.$block), x = {elements: {input: k, textarea: k}}, y = {attributeNames: [
            [/^on/, "data-cke-pa-on"],
            [/^data-cke-expando$/, ""]
        ]}, v = {elements: {embed: function (a) {
            var b = a.parent;
            if (b && b.name == "object") {
                var c = b.attributes.width, b = b.attributes.height;
                if (c)a.attributes.width = c;
                if (b)a.attributes.height = b
            }
        }, a: function (a) {
            if (!a.children.length && !a.attributes.name && !a.attributes["data-cke-saved-name"])return false
        }}}, A = {elementNames: [
            [/^cke:/, ""],
            [/^\?xml:namespace$/, ""]
        ], attributeNames: [
            [/^data-cke-(saved|pa)-/, ""],
            [/^data-cke-.*/, ""],
            ["hidefocus", ""]
        ], elements: {$: function (a) {
            var b = a.attributes;
            if (b) {
                if (b["data-cke-temp"])return false;
                for (var c = ["name", "href", "src"], e, d = 0; d < c.length; d++) {
                    e = "data-cke-saved-" + c[d];
                    e in b && delete b[c[d]]
                }
            }
            return a
        }, table: function (a) {
            a.children.slice(0).sort(function (a, b) {
                var c, e;
                if (a.type == CKEDITOR.NODE_ELEMENT && b.type == a.type) {
                    c =
                        CKEDITOR.tools.indexOf(u, a.name);
                    e = CKEDITOR.tools.indexOf(u, b.name)
                }
                if (!(c > -1 && e > -1 && c != e)) {
                    c = a.parent ? a.getIndex() : -1;
                    e = b.parent ? b.getIndex() : -1
                }
                return c > e ? 1 : -1
            })
        }, param: function (a) {
            a.children = [];
            a.isEmpty = true;
            return a
        }, span: function (a) {
            a.attributes["class"] == "Apple-style-span" && delete a.name
        }, html: function (a) {
            delete a.attributes.contenteditable;
            delete a.attributes["class"]
        }, body: function (a) {
            delete a.attributes.spellcheck;
            delete a.attributes.contenteditable
        }, style: function (a) {
            var b = a.children[0];
            if (b && b.value)b.value = CKEDITOR.tools.trim(b.value);
            if (!a.attributes.type)a.attributes.type = "text/css"
        }, title: function (a) {
            var b = a.children[0];
            !b && h(a, b = new CKEDITOR.htmlParser.text);
            b.value = a.attributes["data-cke-title"] || ""
        }, input: g, textarea: g}, attributes: {"class": function (a) {
            return CKEDITOR.tools.ltrim(a.replace(/(?:^|\s+)cke_[^\s]*/g, "")) || false
        }}};
        if (CKEDITOR.env.ie)A.attributes.style = function (a) {
            return a.replace(/(^|;)([^\:]+)/g, function (a) {
                return a.toLowerCase()
            })
        };
        var B = /<(a|area|img|input|source)\b([^>]*)>/gi,
            E = /([\w-]+)\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|(?:[^ "'>]+))/gi, F = /^(href|src|name)$/i, J = /(?:<style(?=[ >])[^>]*>[\s\S]*?<\/style>)|(?:<(:?link|meta|base)[^>]*>)/gi, D = /(<textarea(?=[ >])[^>]*>)([\s\S]*?)(?:<\/textarea>)/gi, z = /<cke:encoded>([^<]*)<\/cke:encoded>/gi, w = /(<\/?)((?:object|embed|param|html|body|head|title)[^>]*>)/gi, C = /(<\/?)cke:((?:html|body|head|title)[^>]*>)/gi, I = /<cke:(param|embed)([^>]*?)\/?>(?!\s*<\/cke:\1)/gi
    }(),"use strict",CKEDITOR.htmlParser.element = function (c, f) {
        this.name = c;
        this.attributes =
            f || {};
        this.children = [];
        var d = c || "", b = d.match(/^cke:(.*)/);
        b && (d = b[1]);
        d = !(!CKEDITOR.dtd.$nonBodyContent[d] && !CKEDITOR.dtd.$block[d] && !CKEDITOR.dtd.$listItem[d] && !CKEDITOR.dtd.$tableContent[d] && !(CKEDITOR.dtd.$nonEditable[d] || d == "br"));
        this.isEmpty = !!CKEDITOR.dtd.$empty[c];
        this.isUnknown = !CKEDITOR.dtd[c];
        this._ = {isBlockLike: d, hasInlineStarted: this.isEmpty || !d}
    },CKEDITOR.htmlParser.cssStyle = function (c) {
        var f = {};
        ((c instanceof CKEDITOR.htmlParser.element ? c.attributes.style : c) || "").replace(/&quot;/g,
            '"').replace(/\s*([^ :;]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function (c, b, a) {
                b == "font-family" && (a = a.replace(/["']/g, ""));
                f[b.toLowerCase()] = a
            });
        return{rules: f, populate: function (c) {
            var b = this.toString();
            if (b)c instanceof CKEDITOR.dom.element ? c.setAttribute("style", b) : c instanceof CKEDITOR.htmlParser.element ? c.attributes.style = b : c.style = b
        }, toString: function () {
            var c = [], b;
            for (b in f)f[b] && c.push(b, ":", f[b], ";");
            return c.join("")
        }}
    },function () {
        function c(b) {
            return function (a) {
                return a.type == CKEDITOR.NODE_ELEMENT &&
                    (typeof b == "string" ? a.name == b : a.name in b)
            }
        }

        var f = function (b, a) {
            b = b[0];
            a = a[0];
            return b < a ? -1 : b > a ? 1 : 0
        }, d = CKEDITOR.htmlParser.fragment.prototype;
        CKEDITOR.htmlParser.element.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {type: CKEDITOR.NODE_ELEMENT, add: d.add, clone: function () {
            return new CKEDITOR.htmlParser.element(this.name, this.attributes)
        }, filter: function (b, a) {
            var c = this, d, f, a = c.getFilterContext(a);
            if (a.off)return true;
            if (!c.parent)b.onRoot(a, c);
            for (; ;) {
                d = c.name;
                if (!(f = b.onElementName(a,
                    d))) {
                    this.remove();
                    return false
                }
                c.name = f;
                if (!(c = b.onElement(a, c))) {
                    this.remove();
                    return false
                }
                if (c !== this) {
                    this.replaceWith(c);
                    return false
                }
                if (c.name == d)break;
                if (c.type != CKEDITOR.NODE_ELEMENT) {
                    this.replaceWith(c);
                    return false
                }
                if (!c.name) {
                    this.replaceWithChildren();
                    return false
                }
            }
            d = c.attributes;
            var g, i;
            for (g in d) {
                i = g;
                for (f = d[g]; ;)if (i = b.onAttributeName(a, g))if (i != g) {
                    delete d[g];
                    g = i
                } else break; else {
                    delete d[g];
                    break
                }
                i && ((f = b.onAttribute(a, c, i, f)) === false ? delete d[i] : d[i] = f)
            }
            c.isEmpty || this.filterChildren(b,
                false, a);
            return true
        }, filterChildren: d.filterChildren, writeHtml: function (b, a) {
            a && this.filter(a);
            var c = this.name, d = [], k = this.attributes, g, i;
            b.openTag(c, k);
            for (g in k)d.push([g, k[g]]);
            b.sortAttributes && d.sort(f);
            g = 0;
            for (i = d.length; g < i; g++) {
                k = d[g];
                b.attribute(k[0], k[1])
            }
            b.openTagClose(c, this.isEmpty);
            this.writeChildrenHtml(b);
            this.isEmpty || b.closeTag(c)
        }, writeChildrenHtml: d.writeChildrenHtml, replaceWithChildren: function () {
            for (var b = this.children, a = b.length; a;)b[--a].insertAfter(this);
            this.remove()
        },
            forEach: d.forEach, getFirst: function (b) {
                if (!b)return this.children.length ? this.children[0] : null;
                typeof b != "function" && (b = c(b));
                for (var a = 0, e = this.children.length; a < e; ++a)if (b(this.children[a]))return this.children[a];
                return null
            }, getHtml: function () {
                var b = new CKEDITOR.htmlParser.basicWriter;
                this.writeChildrenHtml(b);
                return b.getHtml()
            }, setHtml: function (b) {
                for (var b = this.children = CKEDITOR.htmlParser.fragment.fromHtml(b).children, a = 0, c = b.length; a < c; ++a)b[a].parent = this
            }, getOuterHtml: function () {
                var b =
                    new CKEDITOR.htmlParser.basicWriter;
                this.writeHtml(b);
                return b.getHtml()
            }, split: function (b) {
                for (var a = this.children.splice(b, this.children.length - b), c = this.clone(), d = 0; d < a.length; ++d)a[d].parent = c;
                c.children = a;
                if (a[0])a[0].previous = null;
                if (b > 0)this.children[b - 1].next = null;
                this.parent.add(c, this.getIndex() + 1);
                return c
            }, addClass: function (b) {
                if (!this.hasClass(b)) {
                    var a = this.attributes["class"] || "";
                    this.attributes["class"] = a + (a ? " " : "") + b
                }
            }, removeClass: function (b) {
                var a = this.attributes["class"];
                if (a)(a =
                    CKEDITOR.tools.trim(a.replace(RegExp("(?:\\s+|^)" + b + "(?:\\s+|$)"), " "))) ? this.attributes["class"] = a : delete this.attributes["class"]
            }, hasClass: function (b) {
                var a = this.attributes["class"];
                return!a ? false : RegExp("(?:^|\\s)" + b + "(?=\\s|$)").test(a)
            }, getFilterContext: function (b) {
                var a = [];
                b || (b = {off: false, nonEditable: false, nestedEditable: false});
                !b.off && this.attributes["data-cke-processor"] == "off" && a.push("off", true);
                !b.nonEditable && this.attributes.contenteditable == "false" ? a.push("nonEditable", true) : b.nonEditable &&
                    (!b.nestedEditable && this.attributes.contenteditable == "true") && a.push("nestedEditable", true);
                if (a.length)for (var b = CKEDITOR.tools.copy(b), c = 0; c < a.length; c = c + 2)b[a[c]] = a[c + 1];
                return b
            }}, true)
    }(),function () {
        var c = {}, f = /{([^}]+)}/g, d = /([\\'])/g, b = /\n/g, a = /\r/g;
        CKEDITOR.template = function (e) {
            if (c[e])this.output = c[e]; else {
                var h = e.replace(d, "\\$1").replace(b, "\\n").replace(a, "\\r").replace(f, function (a, b) {
                    return"',data['" + b + "']==undefined?'{" + b + "}':data['" + b + "'],'"
                });
                this.output = c[e] = Function("data", "buffer",
                        "return buffer?buffer.push('" + h + "'):['" + h + "'].join('');")
            }
        }
    }(),delete CKEDITOR.loadFullCore,CKEDITOR.instances = {},CKEDITOR.document = new CKEDITOR.dom.document(document),CKEDITOR.add = function (c) {
        CKEDITOR.instances[c.name] = c;
        c.on("focus", function () {
            if (CKEDITOR.currentInstance != c) {
                CKEDITOR.currentInstance = c;
                CKEDITOR.fire("currentInstance")
            }
        });
        c.on("blur", function () {
            if (CKEDITOR.currentInstance == c) {
                CKEDITOR.currentInstance = null;
                CKEDITOR.fire("currentInstance")
            }
        });
        CKEDITOR.fire("instance", null, c)
    },CKEDITOR.remove =
        function (c) {
            delete CKEDITOR.instances[c.name]
        },function () {
        var c = {};
        CKEDITOR.addTemplate = function (f, d) {
            var b = c[f];
            if (b)return b;
            b = {name: f, source: d};
            CKEDITOR.fire("template", b);
            return c[f] = new CKEDITOR.template(b.source)
        };
        CKEDITOR.getTemplate = function (f) {
            return c[f]
        }
    }(),function () {
        var c = [];
        CKEDITOR.addCss = function (f) {
            c.push(f)
        };
        CKEDITOR.getCss = function () {
            return c.join("\n")
        }
    }(),CKEDITOR.on("instanceDestroyed", function () {
        CKEDITOR.tools.isEmpty(this.instances) && CKEDITOR.fire("reset")
    }),CKEDITOR.TRISTATE_ON =
        1,CKEDITOR.TRISTATE_OFF = 2,CKEDITOR.TRISTATE_DISABLED = 0,function () {
        CKEDITOR.inline = function (c, f) {
            if (!CKEDITOR.env.isCompatible)return null;
            c = CKEDITOR.dom.element.get(c);
            if (c.getEditor())throw'The editor instance "' + c.getEditor().name + '" is already attached to the provided element.';
            var d = new CKEDITOR.editor(f, c, CKEDITOR.ELEMENT_MODE_INLINE), b = c.is("textarea") ? c : null;
            if (b) {
                d.setData(b.getValue(), null, true);
                c = CKEDITOR.dom.element.createFromHtml('<div contenteditable="' + !!d.readOnly + '" class="cke_textarea_inline">' +
                    b.getValue() + "</div>", CKEDITOR.document);
                c.insertAfter(b);
                b.hide();
                b.$.form && d._attachToForm()
            } else d.setData(c.getHtml(), null, true);
            d.on("loaded", function () {
                d.fire("uiReady");
                d.editable(c);
                d.container = c;
                d.setData(d.getData(1));
                d.resetDirty();
                d.fire("contentDom");
                d.mode = "wysiwyg";
                d.fire("mode");
                d.status = "ready";
                d.fireOnce("instanceReady");
                CKEDITOR.fire("instanceReady", null, d)
            }, null, null, 1E4);
            d.on("destroy", function () {
                if (b) {
                    d.container.clearCustomData();
                    d.container.remove();
                    b.show()
                }
                d.element.clearCustomData();
                delete d.element
            });
            return d
        };
        CKEDITOR.inlineAll = function () {
            var c, f, d;
            for (d in CKEDITOR.dtd.$editable)for (var b = CKEDITOR.document.getElementsByTag(d), a = 0, e = b.count(); a < e; a++) {
                c = b.getItem(a);
                if (c.getAttribute("contenteditable") == "true") {
                    f = {element: c, config: {}};
                    CKEDITOR.fire("inline", f) !== false && CKEDITOR.inline(c, f.config)
                }
            }
        };
        CKEDITOR.domReady(function () {
            !CKEDITOR.disableAutoInline && CKEDITOR.inlineAll()
        })
    }(),CKEDITOR.replaceClass = "ckeditor",function () {
        function c(a, b, c, k) {
            if (!CKEDITOR.env.isCompatible)return null;
            a = CKEDITOR.dom.element.get(a);
            if (a.getEditor())throw'The editor instance "' + a.getEditor().name + '" is already attached to the provided element.';
            var g = new CKEDITOR.editor(b, a, k);
            if (k == CKEDITOR.ELEMENT_MODE_REPLACE) {
                a.setStyle("visibility", "hidden");
                g._.required = a.hasAttribute("required");
                a.removeAttribute("required")
            }
            c && g.setData(c, null, true);
            g.on("loaded", function () {
                d(g);
                k == CKEDITOR.ELEMENT_MODE_REPLACE && (g.config.autoUpdateElement && a.$.form) && g._attachToForm();
                g.setMode(g.config.startupMode, function () {
                    g.resetDirty();
                    g.status = "ready";
                    g.fireOnce("instanceReady");
                    CKEDITOR.fire("instanceReady", null, g)
                })
            });
            g.on("destroy", f);
            return g
        }

        function f() {
            var a = this.container, b = this.element;
            if (a) {
                a.clearCustomData();
                a.remove()
            }
            if (b) {
                b.clearCustomData();
                if (this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE) {
                    b.show();
                    this._.required && b.setAttribute("required", "required")
                }
                delete this.element
            }
        }

        function d(a) {
            var c = a.name, d = a.element, f = a.elementMode, g = a.fire("uiSpace", {space: "top", html: ""}).html, i = a.fire("uiSpace", {space: "bottom", html: ""}).html;
            b || (b = CKEDITOR.addTemplate("maincontainer", '<{outerEl} id="cke_{name}" class="{id} cke cke_reset cke_chrome cke_editor_{name} cke_{langDir} ' + CKEDITOR.env.cssClass + '"  dir="{langDir}" lang="{langCode}" role="application" aria-labelledby="cke_{name}_arialbl"><span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span><{outerEl} class="cke_inner cke_reset" role="presentation">{topHtml}<{outerEl} id="{contentId}" class="cke_contents cke_reset" role="presentation"></{outerEl}>{bottomHtml}</{outerEl}></{outerEl}>'));
            c = CKEDITOR.dom.element.createFromHtml(b.output({id: a.id, name: c, langDir: a.lang.dir, langCode: a.langCode, voiceLabel: [a.lang.editor, a.name].join(", "), topHtml: g ? '<span id="' + a.ui.spaceId("top") + '" class="cke_top cke_reset_all" role="presentation" style="height:auto">' + g + "</span>" : "", contentId: a.ui.spaceId("contents"), bottomHtml: i ? '<span id="' + a.ui.spaceId("bottom") + '" class="cke_bottom cke_reset_all" role="presentation">' + i + "</span>" : "", outerEl: CKEDITOR.env.ie ? "span" : "div"}));
            if (f == CKEDITOR.ELEMENT_MODE_REPLACE) {
                d.hide();
                c.insertAfter(d)
            } else d.append(c);
            a.container = c;
            g && a.ui.space("top").unselectable();
            i && a.ui.space("bottom").unselectable();
            d = a.config.width;
            f = a.config.height;
            d && c.setStyle("width", CKEDITOR.tools.cssLength(d));
            f && a.ui.space("contents").setStyle("height", CKEDITOR.tools.cssLength(f));
            c.disableContextMenu();
            CKEDITOR.env.webkit && c.on("focus", function () {
                a.focus()
            });
            a.fireOnce("uiReady")
        }

        CKEDITOR.replace = function (a, b) {
            return c(a, b, null, CKEDITOR.ELEMENT_MODE_REPLACE)
        };
        CKEDITOR.appendTo = function (a, b, d) {
            return c(a,
                b, d, CKEDITOR.ELEMENT_MODE_APPENDTO)
        };
        CKEDITOR.replaceAll = function () {
            for (var a = document.getElementsByTagName("textarea"), b = 0; b < a.length; b++) {
                var c = null, d = a[b];
                if (d.name || d.id) {
                    if (typeof arguments[0] == "string") {
                        if (!RegExp("(?:^|\\s)" + arguments[0] + "(?:$|\\s)").test(d.className))continue
                    } else if (typeof arguments[0] == "function") {
                        c = {};
                        if (arguments[0](d, c) === false)continue
                    }
                    this.replace(d, c)
                }
            }
        };
        CKEDITOR.editor.prototype.addMode = function (a, b) {
            (this._.modes || (this._.modes = {}))[a] = b
        };
        CKEDITOR.editor.prototype.setMode =
            function (a, b) {
                var c = this, d = this._.modes;
                if (!(a == c.mode || !d || !d[a])) {
                    c.fire("beforeSetMode", a);
                    if (c.mode) {
                        var g = c.checkDirty(), d = c._.previousModeData, f, j = 0;
                        c.fire("beforeModeUnload");
                        c.editable(0);
                        c._.previousMode = c.mode;
                        c._.previousModeData = f = c.getData(1);
                        if (c.mode == "source" && d == f) {
                            c.fire("lockSnapshot", {forceUpdate: true});
                            j = 1
                        }
                        c.ui.space("contents").setHtml("");
                        c.mode = ""
                    } else c._.previousModeData = c.getData(1);
                    this._.modes[a](function () {
                        c.mode = a;
                        g !== void 0 && !g && c.resetDirty();
                        j ? c.fire("unlockSnapshot") :
                            a == "wysiwyg" && c.fire("saveSnapshot");
                        setTimeout(function () {
                            c.fire("mode");
                            b && b.call(c)
                        }, 0)
                    })
                }
            };
        CKEDITOR.editor.prototype.resize = function (a, b, c, d) {
            var g = this.container, f = this.ui.space("contents"), j = CKEDITOR.env.webkit && this.document && this.document.getWindow().$.frameElement, d = d ? g.getChild(1) : g;
            d.setSize("width", a, true);
            j && (j.style.width = "1%");
            f.setStyle("height", Math.max(b - (c ? 0 : (d.$.offsetHeight || 0) - (f.$.clientHeight || 0)), 0) + "px");
            j && (j.style.width = "100%");
            this.fire("resize")
        };
        CKEDITOR.editor.prototype.getResizable =
            function (a) {
                return a ? this.ui.space("contents") : this.container
            };
        var b;
        CKEDITOR.domReady(function () {
            CKEDITOR.replaceClass && CKEDITOR.replaceAll(CKEDITOR.replaceClass)
        })
    }(),CKEDITOR.config.startupMode = "wysiwyg",function () {
        function c(a) {
            var c = a.editor, e = a.data.path, d = e.blockLimit, g = a.data.selection, h = g.getRanges()[0], i;
            if (CKEDITOR.env.gecko || CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller)if (g = f(g, e)) {
                g.appendBogus();
                i = CKEDITOR.env.ie
            }
            if (c.config.autoParagraph !== false && c.activeEnterMode != CKEDITOR.ENTER_BR &&
                c.editable().equals(d) && !e.block && h.collapsed && !h.getCommonAncestor().isReadOnly()) {
                e = h.clone();
                e.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
                d = new CKEDITOR.dom.walker(e);
                d.guard = function (a) {
                    return!b(a) || a.type == CKEDITOR.NODE_COMMENT || a.isReadOnly()
                };
                if (!d.checkForward() || e.checkStartOfBlock() && e.checkEndOfBlock()) {
                    c = h.fixBlock(true, c.activeEnterMode == CKEDITOR.ENTER_DIV ? "div" : "p");
                    if (!CKEDITOR.env.needsBrFiller)(c = c.getFirst(b)) && (c.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(c.getText()).match(/^(?:&nbsp;|\xa0)$/)) &&
                    c.remove();
                    i = 1;
                    a.cancel()
                }
            }
            i && h.select()
        }

        function f(a, c) {
            if (a.isFake)return 0;
            var e = c.block || c.blockLimit, d = e && e.getLast(b);
            if (e && e.isBlockBoundary() && (!d || !(d.type == CKEDITOR.NODE_ELEMENT && d.isBlockBoundary())) && !e.is("pre") && !e.getBogus())return e
        }

        function d(a) {
            var b = a.data.getTarget();
            if (b.is("input")) {
                b = b.getAttribute("type");
                (b == "submit" || b == "reset") && a.data.preventDefault()
            }
        }

        function b(a) {
            return j(a) && n(a)
        }

        function a(a, b) {
            return function (c) {
                var e = CKEDITOR.dom.element.get(c.data.$.toElement ||
                    c.data.$.fromElement || c.data.$.relatedTarget);
                (!e || !b.equals(e) && !b.contains(e)) && a.call(this, c)
            }
        }

        function e(a) {
            var c, e = a.getRanges()[0], d = a.root, f = {table: 1, ul: 1, ol: 1, dl: 1};
            if (e.startPath().contains(f)) {
                var a = function (a) {
                    return function (e, d) {
                        d && (e.type == CKEDITOR.NODE_ELEMENT && e.is(f)) && (c = e);
                        if (!d && b(e) && (!a || !g(e)))return false
                    }
                }, h = e.clone();
                h.collapse(1);
                h.setStartAt(d, CKEDITOR.POSITION_AFTER_START);
                d = new CKEDITOR.dom.walker(h);
                d.guard = a();
                d.checkBackward();
                if (c) {
                    h = e.clone();
                    h.collapse();
                    h.setEndAt(c,
                        CKEDITOR.POSITION_AFTER_END);
                    d = new CKEDITOR.dom.walker(h);
                    d.guard = a(true);
                    c = false;
                    d.checkForward();
                    return c
                }
            }
            return null
        }

        function h(a) {
            a.editor.focus();
            a.editor.fire("saveSnapshot")
        }

        function k(a) {
            var b = a.editor;
            b.getSelection().scrollIntoView();
            setTimeout(function () {
                b.fire("saveSnapshot")
            }, 0)
        }

        CKEDITOR.editable = CKEDITOR.tools.createClass({base: CKEDITOR.dom.element, $: function (a, b) {
            this.base(b.$ || b);
            this.editor = a;
            this.status = "unloaded";
            this.hasFocus = false;
            this.setup()
        }, proto: {focus: function () {
            var a;
            if (CKEDITOR.env.webkit && !this.hasFocus) {
                a = this.editor._.previousActive || this.getDocument().getActive();
                if (this.contains(a)) {
                    a.focus();
                    return
                }
            }
            try {
                this.$[CKEDITOR.env.ie && this.getDocument().equals(CKEDITOR.document) ? "setActive" : "focus"]()
            } catch (b) {
                if (!CKEDITOR.env.ie)throw b;
            }
            if (CKEDITOR.env.safari && !this.isInline()) {
                a = CKEDITOR.document.getActive();
                a.equals(this.getWindow().getFrame()) || this.getWindow().focus()
            }
        }, on: function (b, c) {
            var e = Array.prototype.slice.call(arguments, 0);
            if (CKEDITOR.env.ie && /^focus|blur$/.exec(b)) {
                b =
                        b == "focus" ? "focusin" : "focusout";
                c = a(c, this);
                e[0] = b;
                e[1] = c
            }
            return CKEDITOR.dom.element.prototype.on.apply(this, e)
        }, attachListener: function (a, b, c, e, d, g) {
            !this._.listeners && (this._.listeners = []);
            var f = Array.prototype.slice.call(arguments, 1), f = a.on.apply(a, f);
            this._.listeners.push(f);
            return f
        }, clearListeners: function () {
            var a = this._.listeners;
            try {
                for (; a.length;)a.pop().removeListener()
            } catch (b) {
            }
        }, restoreAttrs: function () {
            var a = this._.attrChanges, b, c;
            for (c in a)if (a.hasOwnProperty(c)) {
                b = a[c];
                b !== null ? this.setAttribute(c,
                    b) : this.removeAttribute(c)
            }
        }, attachClass: function (a) {
            var b = this.getCustomData("classes");
            if (!this.hasClass(a)) {
                !b && (b = []);
                b.push(a);
                this.setCustomData("classes", b);
                this.addClass(a)
            }
        }, changeAttr: function (a, b) {
            var c = this.getAttribute(a);
            if (b !== c) {
                !this._.attrChanges && (this._.attrChanges = {});
                a in this._.attrChanges || (this._.attrChanges[a] = c);
                this.setAttribute(a, b)
            }
        }, insertHtml: function (a, b) {
            h(this);
            o(this, b || "html", a)
        }, insertText: function (a) {
            h(this);
            var b = this.editor, c = b.getSelection().getStartElement().hasAscendant("pre",
                true) ? CKEDITOR.ENTER_BR : b.activeEnterMode, b = c == CKEDITOR.ENTER_BR, e = CKEDITOR.tools, a = e.htmlEncode(a.replace(/\r\n/g, "\n")), a = a.replace(/\t/g, "&nbsp;&nbsp; &nbsp;"), c = c == CKEDITOR.ENTER_P ? "p" : "div";
            if (!b) {
                var d = /\n{2}/g;
                if (d.test(a))var g = "<" + c + ">", f = "</" + c + ">", a = g + a.replace(d, function () {
                    return f + g
                }) + f
            }
            a = a.replace(/\n/g, "<br>");
            b || (a = a.replace(RegExp("<br>(?=</" + c + ">)"), function (a) {
                return e.repeat(a, 2)
            }));
            a = a.replace(/^ | $/g, "&nbsp;");
            a = a.replace(/(>|\s) /g, function (a, b) {
                return b + "&nbsp;"
            }).replace(/ (?=<)/g,
                "&nbsp;");
            o(this, "text", a)
        }, insertElement: function (a, b) {
            b ? this.insertElementIntoRange(a, b) : this.insertElementIntoSelection(a)
        }, insertElementIntoRange: function (a, b) {
            var c = this.editor, e = c.config.enterMode, d = a.getName(), g = CKEDITOR.dtd.$block[d];
            if (b.checkReadOnly())return false;
            b.deleteContents(1);
            b.startContainer.type == CKEDITOR.NODE_ELEMENT && b.startContainer.is({tr: 1, table: 1, tbody: 1, thead: 1, tfoot: 1}) && q(b);
            var f, h;
            if (g)for (; (f = b.getCommonAncestor(0, 1)) && (h = CKEDITOR.dtd[f.getName()]) && (!h || !h[d]);)if (f.getName()in
                CKEDITOR.dtd.span)b.splitElement(f); else if (b.checkStartOfBlock() && b.checkEndOfBlock()) {
                b.setStartBefore(f);
                b.collapse(true);
                f.remove()
            } else b.splitBlock(e == CKEDITOR.ENTER_DIV ? "div" : "p", c.editable());
            b.insertNode(a);
            return true
        }, insertElementIntoSelection: function (a) {
            h(this);
            var c = this.editor, e = c.activeEnterMode, c = c.getSelection(), d = c.getRanges()[0], f = a.getName(), f = CKEDITOR.dtd.$block[f];
            if (this.insertElementIntoRange(a, d)) {
                d.moveToPosition(a, CKEDITOR.POSITION_AFTER_END);
                if (f)if ((f = a.getNext(function (a) {
                    return b(a) && !g(a)
                })) && f.type == CKEDITOR.NODE_ELEMENT && f.is(CKEDITOR.dtd.$block))f.getDtd()["#"] ? d.moveToElementEditStart(f) : d.moveToElementEditEnd(a); else if (!f && e != CKEDITOR.ENTER_BR) {
                    f = d.fixBlock(true, e == CKEDITOR.ENTER_DIV ? "div" : "p");
                    d.moveToElementEditStart(f)
                }
            }
            c.selectRanges([d]);
            k(this)
        }, setData: function (a, b) {
            b || (a = this.editor.dataProcessor.toHtml(a));
            this.setHtml(a);
            if (this.status == "unloaded")this.status = "ready";
            this.editor.fire("dataReady")
        }, getData: function (a) {
            var b = this.getHtml();
            a || (b = this.editor.dataProcessor.toDataFormat(b));
            return b
        }, setReadOnly: function (a) {
            this.setAttribute("contenteditable", !a)
        }, detach: function () {
            this.removeClass("cke_editable");
            this.status = "detached";
            var a = this.editor;
            this._.detach();
            delete a.document;
            delete a.window
        }, isInline: function () {
            return this.getDocument().equals(CKEDITOR.document)
        }, setup: function () {
            var a = this.editor;
            this.attachListener(a, "beforeGetData", function () {
                var b = this.getData();
                this.is("textarea") || a.config.ignoreEmptyParagraph !== false && (b = b.replace(i, function (a, b) {
                    return b
                }));
                a.setData(b,
                    null, 1)
            }, this);
            this.attachListener(a, "getSnapshot", function (a) {
                a.data = this.getData(1)
            }, this);
            this.attachListener(a, "afterSetData", function () {
                this.setData(a.getData(1))
            }, this);
            this.attachListener(a, "loadSnapshot", function (a) {
                this.setData(a.data, 1)
            }, this);
            this.attachListener(a, "beforeFocus", function () {
                var b = a.getSelection();
                (b = b && b.getNative()) && b.type == "Control" || this.focus()
            }, this);
            this.attachListener(a, "insertHtml", function (a) {
                this.insertHtml(a.data.dataValue, a.data.mode)
            }, this);
            this.attachListener(a,
                "insertElement", function (a) {
                    this.insertElement(a.data)
                }, this);
            this.attachListener(a, "insertText", function (a) {
                this.insertText(a.data)
            }, this);
            this.setReadOnly(a.readOnly);
            this.attachClass("cke_editable");
            this.attachClass(a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? "cke_editable_inline" : a.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE || a.elementMode == CKEDITOR.ELEMENT_MODE_APPENDTO ? "cke_editable_themed" : "");
            this.attachClass("cke_contents_" + a.config.contentsLangDirection);
            a.keystrokeHandler.blockedKeystrokes[8] = +a.readOnly;
            a.keystrokeHandler.attach(this);
            this.on("blur", function () {
                this.hasFocus = false
            }, null, null, -1);
            this.on("focus", function () {
                this.hasFocus = true
            }, null, null, -1);
            a.focusManager.add(this);
            if (this.equals(CKEDITOR.document.getActive())) {
                this.hasFocus = true;
                a.once("contentDom", function () {
                    a.focusManager.focus()
                })
            }
            this.isInline() && this.changeAttr("tabindex", a.tabIndex);
            if (!this.is("textarea")) {
                a.document = this.getDocument();
                a.window = this.getWindow();
                var c = a.document;
                this.changeAttr("spellcheck", !a.config.disableNativeSpellChecker);
                var g = a.config.contentsLangDirection;
                this.getDirection(1) != g && this.changeAttr("dir", g);
                var f = CKEDITOR.getCss();
                if (f) {
                    g = c.getHead();
                    if (!g.getCustomData("stylesheet")) {
                        f = c.appendStyleText(f);
                        f = new CKEDITOR.dom.element(f.ownerNode || f.owningElement);
                        g.setCustomData("stylesheet", f);
                        f.data("cke-temp", 1)
                    }
                }
                g = c.getCustomData("stylesheet_ref") || 0;
                c.setCustomData("stylesheet_ref", g + 1);
                this.setCustomData("cke_includeReadonly", !a.config.disableReadonlyStyling);
                this.attachListener(this, "click", function (a) {
                    var a =
                        a.data, b = (new CKEDITOR.dom.elementPath(a.getTarget(), this)).contains("a");
                    b && (a.$.button != 2 && b.isReadOnly()) && a.preventDefault()
                });
                var h = {8: 1, 46: 1};
                this.attachListener(a, "key", function (b) {
                    if (a.readOnly)return true;
                    var c = b.data.domEvent.getKey(), d;
                    if (c in h) {
                        var b = a.getSelection(), g, f = b.getRanges()[0], i = f.startPath(), k, n, m, c = c == 8;
                        if (CKEDITOR.env.ie && CKEDITOR.env.version < 11 && (g = b.getSelectedElement()) || (g = e(b))) {
                            a.fire("saveSnapshot");
                            f.moveToPosition(g, CKEDITOR.POSITION_BEFORE_START);
                            g.remove();
                            f.select();
                            a.fire("saveSnapshot");
                            d = 1
                        } else if (f.collapsed)if ((k = i.block) && (m = k[c ? "getPrevious" : "getNext"](j)) && m.type == CKEDITOR.NODE_ELEMENT && m.is("table") && f[c ? "checkStartOfBlock" : "checkEndOfBlock"]()) {
                            a.fire("saveSnapshot");
                            f[c ? "checkEndOfBlock" : "checkStartOfBlock"]() && k.remove();
                            f["moveToElementEdit" + (c ? "End" : "Start")](m);
                            f.select();
                            a.fire("saveSnapshot");
                            d = 1
                        } else if (i.blockLimit && i.blockLimit.is("td") && (n = i.blockLimit.getAscendant("table")) && f.checkBoundaryOfElement(n, c ? CKEDITOR.START : CKEDITOR.END) && (m =
                            n[c ? "getPrevious" : "getNext"](j))) {
                            a.fire("saveSnapshot");
                            f["moveToElementEdit" + (c ? "End" : "Start")](m);
                            f.checkStartOfBlock() && f.checkEndOfBlock() ? m.remove() : f.select();
                            a.fire("saveSnapshot");
                            d = 1
                        } else if ((n = i.contains(["td", "th", "caption"])) && f.checkBoundaryOfElement(n, c ? CKEDITOR.START : CKEDITOR.END))d = 1
                    }
                    return!d
                });
                a.blockless && (CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller) && this.attachListener(this, "keyup", function (c) {
                    if (c.data.getKeystroke()in h && !this.getFirst(b)) {
                        this.appendBogus();
                        c = a.createRange();
                        c.moveToPosition(this, CKEDITOR.POSITION_AFTER_START);
                        c.select()
                    }
                });
                this.attachListener(this, "dblclick", function (b) {
                    if (a.readOnly)return false;
                    b = {element: b.data.getTarget()};
                    a.fire("doubleclick", b)
                });
                CKEDITOR.env.ie && this.attachListener(this, "click", d);
                CKEDITOR.env.ie || this.attachListener(this, "mousedown", function (b) {
                    var c = b.data.getTarget();
                    if (c.is("img", "hr", "input", "textarea", "select") && !c.isReadOnly()) {
                        a.getSelection().selectElement(c);
                        c.is("input", "textarea", "select") && b.data.preventDefault()
                    }
                });
                CKEDITOR.env.gecko && this.attachListener(this, "mouseup", function (b) {
                    if (b.data.$.button == 2) {
                        b = b.data.getTarget();
                        if (!b.getOuterHtml().replace(i, "")) {
                            var c = a.createRange();
                            c.moveToElementEditStart(b);
                            c.select(true)
                        }
                    }
                });
                if (CKEDITOR.env.webkit) {
                    this.attachListener(this, "click", function (a) {
                        a.data.getTarget().is("input", "select") && a.data.preventDefault()
                    });
                    this.attachListener(this, "mouseup", function (a) {
                        a.data.getTarget().is("input", "textarea") && a.data.preventDefault()
                    })
                }
                CKEDITOR.env.webkit && this.attachListener(a,
                    "key", function (b) {
                        b = b.data.domEvent.getKey();
                        if (b in h) {
                            var b = b == 8, c = a.getSelection(), e = c.getRanges()[0], d = e.startPath(), g = d.block;
                            if (e.collapsed && g && e[b ? "checkStartOfBlock" : "checkEndOfBlock"]() && e.moveToClosestEditablePosition(g, !b) && e.collapsed) {
                                if (e.startContainer.type == CKEDITOR.NODE_ELEMENT) {
                                    var f = e.startContainer.getChild(e.startOffset - (b ? 1 : 0));
                                    if (f && f.type == CKEDITOR.NODE_ELEMENT && f.is("hr")) {
                                        a.fire("saveSnapshot");
                                        f.remove();
                                        a.fire("saveSnapshot");
                                        return false
                                    }
                                }
                                if ((e = e.startPath().block) && (!e || !e.contains(g))) {
                                    a.fire("saveSnapshot");
                                    for (var i = g.getCommonAncestor(e), k = b ? g : e, f = k; (k = k.getParent()) && !i.equals(k) && k.getChildCount() == 1;)f = k;
                                    var j;
                                    (j = (b ? e : g).getBogus()) && j.remove();
                                    j = c.createBookmarks();
                                    (b ? g : e).moveChildren(b ? e : g, false);
                                    d.lastElement.mergeSiblings();
                                    f.remove();
                                    c.selectBookmarks(j);
                                    c.scrollIntoView();
                                    a.fire("saveSnapshot");
                                    return false
                                }
                            }
                        }
                    }, this, null, 100)
            }
        }}, _: {detach: function () {
            this.editor.setData(this.editor.getData(), 0, 1);
            this.clearListeners();
            this.restoreAttrs();
            var a;
            if (a =
                this.removeCustomData("classes"))for (; a.length;)this.removeClass(a.pop());
            if (!this.is("textarea")) {
                a = this.getDocument();
                var b = a.getHead();
                if (b.getCustomData("stylesheet")) {
                    var c = a.getCustomData("stylesheet_ref");
                    if (--c)a.setCustomData("stylesheet_ref", c); else {
                        a.removeCustomData("stylesheet_ref");
                        b.removeCustomData("stylesheet").remove()
                    }
                }
            }
            this.editor.fire("contentDomUnload");
            delete this.editor
        }}});
        CKEDITOR.editor.prototype.editable = function (a) {
            var b = this._.editable;
            if (b && a)return 0;
            if (arguments.length)b =
                this._.editable = a ? a instanceof CKEDITOR.editable ? a : new CKEDITOR.editable(this, a) : (b && b.detach(), null);
            return b
        };
        var g = CKEDITOR.dom.walker.bogus(), i = /(^|<body\b[^>]*>)\s*<(p|div|address|h\d|center|pre)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\2>)?\s*(?=$|<\/body>)/gi, j = CKEDITOR.dom.walker.whitespaces(true), n = CKEDITOR.dom.walker.bookmark(false, true);
        CKEDITOR.on("instanceLoaded", function (a) {
            var b = a.editor;
            b.on("insertElement", function (a) {
                a = a.data;
                if (a.type == CKEDITOR.NODE_ELEMENT && (a.is("input") ||
                    a.is("textarea"))) {
                    a.getAttribute("contentEditable") != "false" && a.data("cke-editable", a.hasAttribute("contenteditable") ? "true" : "1");
                    a.setAttribute("contentEditable", false)
                }
            });
            b.on("selectionChange", function (a) {
                if (!b.readOnly) {
                    var e = b.getSelection();
                    if (e && !e.isLocked) {
                        e = b.checkDirty();
                        b.fire("lockSnapshot");
                        c(a);
                        b.fire("unlockSnapshot");
                        !e && b.resetDirty()
                    }
                }
            })
        });
        CKEDITOR.on("instanceCreated", function (a) {
            var b = a.editor;
            b.on("mode", function () {
                var a = b.editable();
                if (a && a.isInline()) {
                    var c = b.title;
                    a.changeAttr("role",
                        "textbox");
                    a.changeAttr("aria-label", c);
                    c && a.changeAttr("title", c);
                    if (c = this.ui.space(this.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? "top" : "contents")) {
                        var e = CKEDITOR.tools.getNextId(), d = CKEDITOR.dom.element.createFromHtml('<span id="' + e + '" class="cke_voice_label">' + this.lang.common.editorHelp + "</span>");
                        c.append(d);
                        a.changeAttr("aria-describedby", e)
                    }
                }
            })
        });
        CKEDITOR.addCss(".cke_editable{cursor:text}.cke_editable img,.cke_editable input,.cke_editable textarea{cursor:default}");
        var o = function () {
            function a(b) {
                return b.type ==
                    CKEDITOR.NODE_ELEMENT
            }

            function c(b, e) {
                var d, g, f, i, k = [], w = e.range.startContainer;
                d = e.range.startPath();
                for (var w = h[w.getName()], C = 0, j = b.getChildren(), p = j.count(), n = -1, u = -1, o = 0, v = d.contains(h.$list); C < p; ++C) {
                    d = j.getItem(C);
                    if (a(d)) {
                        f = d.getName();
                        if (v && f in CKEDITOR.dtd.$list)k = k.concat(c(d, e)); else {
                            i = !!w[f];
                            if (f == "br" && d.data("cke-eol") && (!C || C == p - 1)) {
                                o = (g = C ? k[C - 1].node : j.getItem(C + 1)) && (!a(g) || !g.is("br"));
                                g = g && a(g) && h.$block[g.getName()]
                            }
                            n == -1 && !i && (n = C);
                            i || (u = C);
                            k.push({isElement: 1, isLineBreak: o,
                                isBlock: d.isBlockBoundary(), hasBlockSibling: g, node: d, name: f, allowed: i});
                            g = o = 0
                        }
                    } else k.push({isElement: 0, node: d, allowed: 1})
                }
                if (n > -1)k[n].firstNotAllowed = 1;
                if (u > -1)k[u].lastNotAllowed = 1;
                return k
            }

            function e(b, c) {
                var d = [], g = b.getChildren(), f = g.count(), i, k = 0, w = h[c], C = !b.is(h.$inline) || b.is("br");
                for (C && d.push(" "); k < f; k++) {
                    i = g.getItem(k);
                    a(i) && !i.is(w) ? d = d.concat(e(i, c)) : d.push(i)
                }
                C && d.push(" ");
                return d
            }

            function d(b) {
                return b && a(b) && (b.is(h.$removeEmpty) || b.is("a") && !b.isBlockBoundary())
            }

            function g(b, c, e, d) {
                var f = b.clone(), h, k;
                f.setEndAt(c, CKEDITOR.POSITION_BEFORE_END);
                if ((h = (new CKEDITOR.dom.walker(f)).next()) && a(h) && i[h.getName()] && (k = h.getPrevious()) && a(k) && !k.getParent().equals(b.startContainer) && e.contains(k) && d.contains(h) && h.isIdentical(k)) {
                    h.moveChildren(k);
                    h.remove();
                    g(b, c, e, d)
                }
            }

            function f(b, c) {
                function e(b, c) {
                    if (c.isBlock && c.isElement && !c.node.is("br") && a(b) && b.is("br")) {
                        b.remove();
                        return 1
                    }
                }

                var d = c.endContainer.getChild(c.endOffset), g = c.endContainer.getChild(c.endOffset - 1);
                d && e(d, b[b.length -
                    1]);
                if (g && e(g, b[0])) {
                    c.setEnd(c.endContainer, c.endOffset - 1);
                    c.collapse()
                }
            }

            var h = CKEDITOR.dtd, i = {p: 1, div: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, ul: 1, ol: 1, li: 1, pre: 1, dl: 1, blockquote: 1}, j = {p: 1, div: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1}, n = CKEDITOR.tools.extend({}, h.$inline);
            delete n.br;
            return function (i, o, x) {
                var q = i.editor;
                i.getDocument();
                var J = q.getSelection().getRanges()[0], D = false;
                if (o == "unfiltered_html") {
                    o = "html";
                    D = true
                }
                if (!J.checkReadOnly()) {
                    var z = (new CKEDITOR.dom.elementPath(J.startContainer, J.root)).blockLimit ||
                        J.root, o = {type: o, dontFilter: D, editable: i, editor: q, range: J, blockLimit: z, mergeCandidates: [], zombies: []}, q = o.range, D = o.mergeCandidates, w, C, I, H;
                    if (o.type == "text" && q.shrink(CKEDITOR.SHRINK_ELEMENT, true, false)) {
                        w = CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", q.document);
                        q.insertNode(w);
                        q.setStartAfter(w)
                    }
                    C = new CKEDITOR.dom.elementPath(q.startContainer);
                    o.endPath = I = new CKEDITOR.dom.elementPath(q.endContainer);
                    if (!q.collapsed) {
                        var z = I.block || I.blockLimit, Q = q.getCommonAncestor();
                        z && (!z.equals(Q) && !z.contains(Q) && q.checkEndOfBlock()) && o.zombies.push(z);
                        q.deleteContents()
                    }
                    for (; (H = a(q.startContainer) && q.startContainer.getChild(q.startOffset - 1)) && a(H) && H.isBlockBoundary() && C.contains(H);)q.moveToPosition(H, CKEDITOR.POSITION_BEFORE_END);
                    g(q, o.blockLimit, C, I);
                    if (w) {
                        q.setEndBefore(w);
                        q.collapse();
                        w.remove()
                    }
                    w = q.startPath();
                    if (z = w.contains(d, false, 1)) {
                        q.splitElement(z);
                        o.inlineStylesRoot = z;
                        o.inlineStylesPeak = w.lastElement
                    }
                    w = q.createBookmark();
                    (z = w.startNode.getPrevious(b)) && a(z) && d(z) && D.push(z);
                    (z = w.startNode.getNext(b)) && a(z) && d(z) && D.push(z);
                    for (z = w.startNode; (z = z.getParent()) && d(z);)D.push(z);
                    q.moveToBookmark(w);
                    if (w = x) {
                        w = o.range;
                        if (o.type == "text" && o.inlineStylesRoot) {
                            H = o.inlineStylesPeak;
                            q = H.getDocument().createText("{cke-peak}");
                            for (D = o.inlineStylesRoot.getParent(); !H.equals(D);) {
                                q = q.appendTo(H.clone());
                                H = H.getParent()
                            }
                            x = q.getOuterHtml().split("{cke-peak}").join(x)
                        }
                        H = o.blockLimit.getName();
                        if (/^\s+|\s+$/.test(x) && "span"in CKEDITOR.dtd[H])var O = '<span data-cke-marker="1">&nbsp;</span>',
                            x = O + x + O;
                        x = o.editor.dataProcessor.toHtml(x, {context: null, fixForBody: false, dontFilter: o.dontFilter, filter: o.editor.activeFilter, enterMode: o.editor.activeEnterMode});
                        H = w.document.createElement("body");
                        H.setHtml(x);
                        if (O) {
                            H.getFirst().remove();
                            H.getLast().remove()
                        }
                        if ((O = w.startPath().block) && !(O.getChildCount() == 1 && O.getBogus()))a:{
                            var K;
                            if (H.getChildCount() == 1 && a(K = H.getFirst()) && K.is(j)) {
                                O = K.getElementsByTag("*");
                                w = 0;
                                for (D = O.count(); w < D; w++) {
                                    q = O.getItem(w);
                                    if (!q.is(n))break a
                                }
                                K.moveChildren(K.getParent(1));
                                K.remove()
                            }
                        }
                        o.dataWrapper = H;
                        w = x
                    }
                    if (w) {
                        K = o.range;
                        var O = K.document, G, x = o.blockLimit;
                        w = 0;
                        var M;
                        H = [];
                        var L, R, D = q = 0, N, T;
                        C = K.startContainer;
                        var z = o.endPath.elements[0], U;
                        I = z.getPosition(C);
                        Q = !!z.getCommonAncestor(C) && I != CKEDITOR.POSITION_IDENTICAL && !(I & CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_IS_CONTAINED);
                        C = c(o.dataWrapper, o);
                        for (f(C, K); w < C.length; w++) {
                            I = C[w];
                            if (G = I.isLineBreak) {
                                G = K;
                                N = x;
                                var P = void 0, X = void 0;
                                if (I.hasBlockSibling)G = 1; else {
                                    P = G.startContainer.getAscendant(h.$block, 1);
                                    if (!P || !P.is({div: 1,
                                        p: 1}))G = 0; else {
                                        X = P.getPosition(N);
                                        if (X == CKEDITOR.POSITION_IDENTICAL || X == CKEDITOR.POSITION_CONTAINS)G = 0; else {
                                            N = G.splitElement(P);
                                            G.moveToPosition(N, CKEDITOR.POSITION_AFTER_START);
                                            G = 1
                                        }
                                    }
                                }
                            }
                            if (G)D = w > 0; else {
                                G = K.startPath();
                                if (!I.isBlock && o.editor.config.autoParagraph !== false && (o.editor.activeEnterMode != CKEDITOR.ENTER_BR && o.editor.editable().equals(G.blockLimit) && !G.block) && (R = o.editor.activeEnterMode != CKEDITOR.ENTER_BR && o.editor.config.autoParagraph !== false ? o.editor.activeEnterMode == CKEDITOR.ENTER_DIV ?
                                    "div" : "p" : false)) {
                                    R = O.createElement(R);
                                    R.appendBogus();
                                    K.insertNode(R);
                                    CKEDITOR.env.needsBrFiller && (M = R.getBogus()) && M.remove();
                                    K.moveToPosition(R, CKEDITOR.POSITION_BEFORE_END)
                                }
                                if ((G = K.startPath().block) && !G.equals(L)) {
                                    if (M = G.getBogus()) {
                                        M.remove();
                                        H.push(G)
                                    }
                                    L = G
                                }
                                I.firstNotAllowed && (q = 1);
                                if (q && I.isElement) {
                                    G = K.startContainer;
                                    for (N = null; G && !h[G.getName()][I.name];) {
                                        if (G.equals(x)) {
                                            G = null;
                                            break
                                        }
                                        N = G;
                                        G = G.getParent()
                                    }
                                    if (G) {
                                        if (N) {
                                            T = K.splitElement(N);
                                            o.zombies.push(T);
                                            o.zombies.push(N)
                                        }
                                    } else {
                                        N = x.getName();
                                        U = !w;
                                        G = w == C.length - 1;
                                        N = e(I.node, N);
                                        for (var P = [], X = N.length, $ = 0, ba = void 0, ca = 0, Y = -1; $ < X; $++) {
                                            ba = N[$];
                                            if (ba == " ") {
                                                if (!ca && (!U || $)) {
                                                    P.push(new CKEDITOR.dom.text(" "));
                                                    Y = P.length
                                                }
                                                ca = 1
                                            } else {
                                                P.push(ba);
                                                ca = 0
                                            }
                                        }
                                        G && Y == P.length && P.pop();
                                        U = P
                                    }
                                }
                                if (U) {
                                    for (; G = U.pop();)K.insertNode(G);
                                    U = 0
                                } else K.insertNode(I.node);
                                if (I.lastNotAllowed && w < C.length - 1) {
                                    (T = Q ? z : T) && K.setEndAt(T, CKEDITOR.POSITION_AFTER_START);
                                    q = 0
                                }
                                K.collapse()
                            }
                        }
                        o.dontMoveCaret = D;
                        o.bogusNeededBlocks = H
                    }
                    M = o.range;
                    var V;
                    T = o.bogusNeededBlocks;
                    for (U = M.createBookmark(); L =
                        o.zombies.pop();)if (L.getParent()) {
                        R = M.clone();
                        R.moveToElementEditStart(L);
                        R.removeEmptyBlocksAtEnd()
                    }
                    if (T)for (; L = T.pop();)CKEDITOR.env.needsBrFiller ? L.appendBogus() : L.append(M.document.createText(" "));
                    for (; L = o.mergeCandidates.pop();)L.mergeSiblings();
                    M.moveToBookmark(U);
                    if (!o.dontMoveCaret) {
                        for (L = a(M.startContainer) && M.startContainer.getChild(M.startOffset - 1); L && a(L) && !L.is(h.$empty);) {
                            if (L.isBlockBoundary())M.moveToPosition(L, CKEDITOR.POSITION_BEFORE_END); else {
                                if (d(L) && L.getHtml().match(/(\s|&nbsp;)$/g)) {
                                    V =
                                        null;
                                    break
                                }
                                V = M.clone();
                                V.moveToPosition(L, CKEDITOR.POSITION_BEFORE_END)
                            }
                            L = L.getLast(b)
                        }
                        V && M.moveToRange(V)
                    }
                    J.select();
                    k(i)
                }
            }
        }(), q = function () {
            function a(b) {
                b = new CKEDITOR.dom.walker(b);
                b.guard = function (a, b) {
                    if (b)return false;
                    if (a.type == CKEDITOR.NODE_ELEMENT)return a.is(CKEDITOR.dtd.$tableContent)
                };
                b.evaluator = function (a) {
                    return a.type == CKEDITOR.NODE_ELEMENT
                };
                return b
            }

            function b(a, c, e) {
                c = a.getDocument().createElement(c);
                a.append(c, e);
                return c
            }

            function c(a) {
                var b = a.count(), e;
                for (b; b-- > 0;) {
                    e = a.getItem(b);
                    if (!CKEDITOR.tools.trim(e.getHtml())) {
                        e.appendBogus();
                        CKEDITOR.env.ie && (CKEDITOR.env.version < 9 && e.getChildCount()) && e.getFirst().remove()
                    }
                }
            }

            return function (e) {
                var d = e.startContainer, g = d.getAscendant("table", 1), f = false;
                c(g.getElementsByTag("td"));
                c(g.getElementsByTag("th"));
                g = e.clone();
                g.setStart(d, 0);
                g = a(g).lastBackward();
                if (!g) {
                    g = e.clone();
                    g.setEndAt(d, CKEDITOR.POSITION_BEFORE_END);
                    g = a(g).lastForward();
                    f = true
                }
                g || (g = d);
                if (g.is("table")) {
                    e.setStartAt(g, CKEDITOR.POSITION_BEFORE_START);
                    e.collapse(true);
                    g.remove()
                } else {
                    g.is({tbody: 1, thead: 1, tfoot: 1}) && (g = b(g, "tr", f));
                    g.is("tr") && (g = b(g, g.getParent().is("thead") ? "th" : "td", f));
                    (d = g.getBogus()) && d.remove();
                    e.moveToPosition(g, f ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END)
                }
            }
        }()
    }(),function () {
        function c() {
            var a = this._.fakeSelection, b;
            if (a) {
                b = this.getSelection(1);
                if (!b || !b.isHidden()) {
                    a.reset();
                    a = 0
                }
            }
            if (!a) {
                a = b || this.getSelection(1);
                if (!a || a.getType() == CKEDITOR.SELECTION_NONE)return
            }
            this.fire("selectionCheck", a);
            b = this.elementPath();
            if (!b.compare(this._.selectionPreviousPath)) {
                if (CKEDITOR.env.webkit)this._.previousActive =
                    this.document.getActive();
                this._.selectionPreviousPath = b;
                this.fire("selectionChange", {selection: a, path: b})
            }
        }

        function f() {
            o = true;
            if (!n) {
                d.call(this);
                n = CKEDITOR.tools.setTimeout(d, 200, this)
            }
        }

        function d() {
            n = null;
            if (o) {
                CKEDITOR.tools.setTimeout(c, 0, this);
                o = false
            }
        }

        function b(a) {
            function b(c, e) {
                return!c || c.type == CKEDITOR.NODE_TEXT ? false : a.clone()["moveToElementEdit" + (e ? "End" : "Start")](c)
            }

            if (!(a.root instanceof CKEDITOR.editable))return false;
            var c = a.startContainer, e = a.getPreviousNode(q, null, c), d = a.getNextNode(q,
                null, c);
            return b(e) || b(d, 1) || !e && !d && !(c.type == CKEDITOR.NODE_ELEMENT && c.isBlockBoundary() && c.getBogus()) ? true : false
        }

        function a(a) {
            return a.getCustomData("cke-fillingChar")
        }

        function e(a, b) {
            var c = a && a.removeCustomData("cke-fillingChar");
            if (c) {
                if (b !== false) {
                    var e, d = a.getDocument().getSelection().getNative(), g = d && d.type != "None" && d.getRangeAt(0);
                    if (c.getLength() > 1 && g && g.intersectsNode(c.$)) {
                        e = [d.anchorOffset, d.focusOffset];
                        g = d.focusNode == c.$ && d.focusOffset > 0;
                        d.anchorNode == c.$ && d.anchorOffset > 0 && e[0]--;
                        g && e[1]--;
                        var f;
                        g = d;
                        if (!g.isCollapsed) {
                            f = g.getRangeAt(0);
                            f.setStart(g.anchorNode, g.anchorOffset);
                            f.setEnd(g.focusNode, g.focusOffset);
                            f = f.collapsed
                        }
                        f && e.unshift(e.pop())
                    }
                }
                c.setText(h(c.getText()));
                if (e) {
                    c = d.getRangeAt(0);
                    c.setStart(c.startContainer, e[0]);
                    c.setEnd(c.startContainer, e[1]);
                    d.removeAllRanges();
                    d.addRange(c)
                }
            }
        }

        function h(a) {
            return a.replace(/\u200B( )?/g, function (a) {
                return a[1] ? " " : ""
            })
        }

        function k(a, b, c) {
            var e = a.on("focus", function (a) {
                a.cancel()
            }, null, null, -100);
            if (CKEDITOR.env.ie)var d =
                a.getDocument().on("selectionchange", function (a) {
                    a.cancel()
                }, null, null, -100); else {
                var g = new CKEDITOR.dom.range(a);
                g.moveToElementEditStart(a);
                var f = a.getDocument().$.createRange();
                f.setStart(g.startContainer.$, g.startOffset);
                f.collapse(1);
                b.removeAllRanges();
                b.addRange(f)
            }
            c && a.focus();
            e.removeListener();
            d && d.removeListener()
        }

        function g(a) {
            var b = CKEDITOR.dom.element.createFromHtml('<div data-cke-hidden-sel="1" data-cke-temp="1" style="' + (CKEDITOR.env.ie ? "display:none" : "position:fixed;top:0;left:-1000px") +
                '">&nbsp;</div>', a.document);
            a.fire("lockSnapshot");
            a.editable().append(b);
            var c = a.getSelection(1), e = a.createRange(), d = c.root.on("selectionchange", function (a) {
                a.cancel()
            }, null, null, 0);
            e.setStartAt(b, CKEDITOR.POSITION_AFTER_START);
            e.setEndAt(b, CKEDITOR.POSITION_BEFORE_END);
            c.selectRanges([e]);
            d.removeListener();
            a.fire("unlockSnapshot");
            a._.hiddenSelectionContainer = b
        }

        function i(a) {
            var b = {37: 1, 39: 1, 8: 1, 46: 1};
            return function (c) {
                var e = c.data.getKeystroke();
                if (b[e]) {
                    var d = a.getSelection().getRanges(), g =
                        d[0];
                    if (d.length == 1 && g.collapsed)if ((e = g[e < 38 ? "getPreviousEditableNode" : "getNextEditableNode"]()) && e.type == CKEDITOR.NODE_ELEMENT && e.getAttribute("contenteditable") == "false") {
                        a.getSelection().fake(e);
                        c.data.preventDefault();
                        c.cancel()
                    }
                }
            }
        }

        function j(a) {
            for (var b = 0; b < a.length; b++) {
                var c = a[b];
                c.getCommonAncestor().isReadOnly() && a.splice(b, 1);
                if (!c.collapsed) {
                    if (c.startContainer.isReadOnly())for (var e = c.startContainer, d; e;) {
                        if ((d = e.type == CKEDITOR.NODE_ELEMENT) && e.is("body") || !e.isReadOnly())break;
                        d && e.getAttribute("contentEditable") ==
                            "false" && c.setStartAfter(e);
                        e = e.getParent()
                    }
                    e = c.startContainer;
                    d = c.endContainer;
                    var g = c.startOffset, f = c.endOffset, h = c.clone();
                    e && e.type == CKEDITOR.NODE_TEXT && (g >= e.getLength() ? h.setStartAfter(e) : h.setStartBefore(e));
                    d && d.type == CKEDITOR.NODE_TEXT && (f ? h.setEndAfter(d) : h.setEndBefore(d));
                    e = new CKEDITOR.dom.walker(h);
                    e.evaluator = function (e) {
                        if (e.type == CKEDITOR.NODE_ELEMENT && e.isReadOnly()) {
                            var d = c.clone();
                            c.setEndBefore(e);
                            c.collapsed && a.splice(b--, 1);
                            if (!(e.getPosition(h.endContainer) & CKEDITOR.POSITION_CONTAINS)) {
                                d.setStartAfter(e);
                                d.collapsed || a.splice(b + 1, 0, d)
                            }
                            return true
                        }
                        return false
                    };
                    e.next()
                }
            }
            return a
        }

        var n, o, q = CKEDITOR.dom.walker.invisible(1), l = function () {
            function a(b) {
                return function (a) {
                    var c = a.editor.createRange();
                    c.moveToClosestEditablePosition(a.selected, b) && a.editor.getSelection().selectRanges([c]);
                    return false
                }
            }

            function b(a) {
                return function (b) {
                    var c = b.editor, e = c.createRange(), d;
                    if (!(d = e.moveToClosestEditablePosition(b.selected, a)))d = e.moveToClosestEditablePosition(b.selected, !a);
                    d && c.getSelection().selectRanges([e]);
                    c.fire("saveSnapshot");
                    b.selected.remove();
                    if (!d) {
                        e.moveToElementEditablePosition(c.editable());
                        c.getSelection().selectRanges([e])
                    }
                    c.fire("saveSnapshot");
                    return false
                }
            }

            var c = a(), e = a(1);
            return{37: c, 38: c, 39: e, 40: e, 8: b(), 46: b(1)}
        }();
        CKEDITOR.on("instanceCreated", function (a) {
            function b() {
                var a = d.getSelection();
                a && a.removeAllRanges()
            }

            var d = a.editor;
            d.on("contentDom", function () {
                var a = d.document, b = CKEDITOR.document, g = d.editable(), h = a.getBody(), k = a.getDocumentElement(), j = g.isInline(), l, p;
                CKEDITOR.env.gecko &&
                g.attachListener(g, "focus", function (a) {
                    a.removeListener();
                    if (l !== 0)if ((a = d.getSelection().getNative()) && a.isCollapsed && a.anchorNode == g.$) {
                        a = d.createRange();
                        a.moveToElementEditStart(g);
                        a.select()
                    }
                }, null, null, -2);
                g.attachListener(g, CKEDITOR.env.webkit ? "DOMFocusIn" : "focus", function () {
                    l && CKEDITOR.env.webkit && (l = d._.previousActive && d._.previousActive.equals(a.getActive()));
                    d.unlockSelection(l);
                    l = 0
                }, null, null, -1);
                g.attachListener(g, "mousedown", function () {
                    l = 0
                });
                if (CKEDITOR.env.ie || j) {
                    var n = function () {
                        p =
                            new CKEDITOR.dom.selection(d.getSelection());
                        p.lock()
                    };
                    m ? g.attachListener(g, "beforedeactivate", n, null, null, -1) : g.attachListener(d, "selectionCheck", n, null, null, -1);
                    g.attachListener(g, CKEDITOR.env.webkit ? "DOMFocusOut" : "blur", function () {
                        d.lockSelection(p);
                        l = 1
                    }, null, null, -1);
                    g.attachListener(g, "mousedown", function () {
                        l = 0
                    })
                }
                if (CKEDITOR.env.ie && !j) {
                    var z;
                    g.attachListener(g, "mousedown", function (a) {
                        if (a.data.$.button == 2) {
                            a = d.document.getSelection();
                            if (!a || a.getType() == CKEDITOR.SELECTION_NONE)z = d.window.getScrollPosition()
                        }
                    });
                    g.attachListener(g, "mouseup", function (a) {
                        if (a.data.$.button == 2 && z) {
                            d.document.$.documentElement.scrollLeft = z.x;
                            d.document.$.documentElement.scrollTop = z.y
                        }
                        z = null
                    });
                    if (a.$.compatMode != "BackCompat") {
                        if (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat)k.on("mousedown", function (a) {
                            function c(a) {
                                a = a.data.$;
                                if (d) {
                                    var b = h.$.createTextRange();
                                    try {
                                        b.moveToPoint(a.x, a.y)
                                    } catch (e) {
                                    }
                                    d.setEndPoint(f.compareEndPoints("StartToStart", b) < 0 ? "EndToEnd" : "StartToStart", b);
                                    d.select()
                                }
                            }

                            function e() {
                                k.removeListener("mousemove",
                                    c);
                                b.removeListener("mouseup", e);
                                k.removeListener("mouseup", e);
                                d.select()
                            }

                            a = a.data;
                            if (a.getTarget().is("html") && a.$.y < k.$.clientHeight && a.$.x < k.$.clientWidth) {
                                var d = h.$.createTextRange();
                                try {
                                    d.moveToPoint(a.$.x, a.$.y)
                                } catch (g) {
                                }
                                var f = d.duplicate();
                                k.on("mousemove", c);
                                b.on("mouseup", e);
                                k.on("mouseup", e)
                            }
                        });
                        if (CKEDITOR.env.version > 7 && CKEDITOR.env.version < 11) {
                            k.on("mousedown", function (a) {
                                if (a.data.getTarget().is("html")) {
                                    b.on("mouseup", w);
                                    k.on("mouseup", w)
                                }
                            });
                            var w = function () {
                                b.removeListener("mouseup",
                                    w);
                                k.removeListener("mouseup", w);
                                var c = CKEDITOR.document.$.selection, e = c.createRange();
                                c.type != "None" && e.parentElement().ownerDocument == a.$ && e.select()
                            }
                        }
                    }
                }
                g.attachListener(g, "selectionchange", c, d);
                g.attachListener(g, "keyup", f, d);
                g.attachListener(g, CKEDITOR.env.webkit ? "DOMFocusIn" : "focus", function () {
                    d.forceNextSelectionCheck();
                    d.selectionChange(1)
                });
                if (j && (CKEDITOR.env.webkit || CKEDITOR.env.gecko)) {
                    var C;
                    g.attachListener(g, "mousedown", function () {
                        C = 1
                    });
                    g.attachListener(a.getDocumentElement(), "mouseup",
                        function () {
                            C && f.call(d);
                            C = 0
                        })
                } else g.attachListener(CKEDITOR.env.ie ? g : a.getDocumentElement(), "mouseup", f, d);
                CKEDITOR.env.webkit && g.attachListener(a, "keydown", function (a) {
                    switch (a.data.getKey()) {
                        case 13:
                        case 33:
                        case 34:
                        case 35:
                        case 36:
                        case 37:
                        case 39:
                        case 8:
                        case 45:
                        case 46:
                            e(g)
                    }
                }, null, null, -1);
                g.attachListener(g, "keydown", i(d), null, null, -1)
            });
            d.on("setData", function () {
                d.unlockSelection();
                CKEDITOR.env.webkit && b()
            });
            d.on("contentDomUnload", function () {
                d.unlockSelection()
            });
            if (CKEDITOR.env.ie9Compat)d.on("beforeDestroy",
                b, null, null, 9);
            d.on("dataReady", function () {
                delete d._.fakeSelection;
                delete d._.hiddenSelectionContainer;
                d.selectionChange(1)
            });
            d.on("loadSnapshot", function () {
                var a = d.editable().getLast(function (a) {
                    return a.type == CKEDITOR.NODE_ELEMENT
                });
                a && a.hasAttribute("data-cke-hidden-sel") && a.remove()
            }, null, null, 100);
            d.on("key", function (a) {
                if (d.mode == "wysiwyg") {
                    var b = d.getSelection();
                    if (b.isFake) {
                        var c = l[a.data.keyCode];
                        if (c)return c({editor: d, selected: b.getSelectedElement(), selection: b, keyEvent: a})
                    }
                }
            })
        });
        CKEDITOR.on("instanceReady",
            function (b) {
                var c = b.editor;
                if (CKEDITOR.env.webkit) {
                    c.on("selectionChange", function () {
                        var b = c.editable(), d = a(b);
                        d && (d.getCustomData("ready") ? e(b) : d.setCustomData("ready", 1))
                    }, null, null, -1);
                    c.on("beforeSetMode", function () {
                        e(c.editable())
                    }, null, null, -1);
                    var d, g, b = function () {
                        var b = c.editable();
                        if (b)if (b = a(b)) {
                            var e = c.document.$.defaultView.getSelection();
                            e.type == "Caret" && e.anchorNode == b.$ && (g = 1);
                            d = b.getText();
                            b.setText(h(d))
                        }
                    }, f = function () {
                        var b = c.editable();
                        if (b)if (b = a(b)) {
                            b.setText(d);
                            if (g) {
                                c.document.$.defaultView.getSelection().setPosition(b.$,
                                    b.getLength());
                                g = 0
                            }
                        }
                    };
                    c.on("beforeUndoImage", b);
                    c.on("afterUndoImage", f);
                    c.on("beforeGetData", b, null, null, 0);
                    c.on("getData", f)
                }
            });
        CKEDITOR.editor.prototype.selectionChange = function (a) {
            (a ? c : f).call(this)
        };
        CKEDITOR.editor.prototype.getSelection = function (a) {
            if ((this._.savedSelection || this._.fakeSelection) && !a)return this._.savedSelection || this._.fakeSelection;
            return(a = this.editable()) && this.mode == "wysiwyg" ? new CKEDITOR.dom.selection(a) : null
        };
        CKEDITOR.editor.prototype.lockSelection = function (a) {
            a = a || this.getSelection(1);
            if (a.getType() != CKEDITOR.SELECTION_NONE) {
                !a.isLocked && a.lock();
                this._.savedSelection = a;
                return true
            }
            return false
        };
        CKEDITOR.editor.prototype.unlockSelection = function (a) {
            var b = this._.savedSelection;
            if (b) {
                b.unlock(a);
                delete this._.savedSelection;
                return true
            }
            return false
        };
        CKEDITOR.editor.prototype.forceNextSelectionCheck = function () {
            delete this._.selectionPreviousPath
        };
        CKEDITOR.dom.document.prototype.getSelection = function () {
            return new CKEDITOR.dom.selection(this)
        };
        CKEDITOR.dom.range.prototype.select = function () {
            var a =
                    this.root instanceof CKEDITOR.editable ? this.root.editor.getSelection() : new CKEDITOR.dom.selection(this.root);
            a.selectRanges([this]);
            return a
        };
        CKEDITOR.SELECTION_NONE = 1;
        CKEDITOR.SELECTION_TEXT = 2;
        CKEDITOR.SELECTION_ELEMENT = 3;
        var m = typeof window.getSelection != "function", r = 1;
        CKEDITOR.dom.selection = function (a) {
            if (a instanceof CKEDITOR.dom.selection)var b = a, a = a.root;
            var c = a instanceof CKEDITOR.dom.element;
            this.rev = b ? b.rev : r++;
            this.document = a instanceof CKEDITOR.dom.document ? a : a.getDocument();
            this.root =
                a = c ? a : this.document.getBody();
            this.isLocked = 0;
            this._ = {cache: {}};
            if (b) {
                CKEDITOR.tools.extend(this._.cache, b._.cache);
                this.isFake = b.isFake;
                this.isLocked = b.isLocked;
                return this
            }
            b = m ? this.document.$.selection : this.document.getWindow().$.getSelection();
            if (CKEDITOR.env.webkit)(b.type == "None" && this.document.getActive().equals(a) || b.type == "Caret" && b.anchorNode.nodeType == CKEDITOR.NODE_DOCUMENT) && k(a, b); else if (CKEDITOR.env.gecko)b && (this.document.getActive().equals(a) && b.anchorNode && b.anchorNode.nodeType ==
                CKEDITOR.NODE_DOCUMENT) && k(a, b, true); else if (CKEDITOR.env.ie) {
                var e;
                try {
                    e = this.document.getActive()
                } catch (d) {
                }
                if (m)b.type == "None" && (e && e.equals(this.document.getDocumentElement())) && k(a, null, true); else {
                    (b = b && b.anchorNode) && (b = new CKEDITOR.dom.node(b));
                    e && (e.equals(this.document.getDocumentElement()) && b && (a.equals(b) || a.contains(b))) && k(a, null, true)
                }
            }
            e = this.getNative();
            var g, f;
            if (e)if (e.getRangeAt)g = (f = e.rangeCount && e.getRangeAt(0)) && new CKEDITOR.dom.node(f.commonAncestorContainer); else {
                try {
                    f = e.createRange()
                } catch (h) {
                }
                g =
                    f && CKEDITOR.dom.element.get(f.item && f.item(0) || f.parentElement())
            }
            if (!g || !(g.type == CKEDITOR.NODE_ELEMENT || g.type == CKEDITOR.NODE_TEXT) || !this.root.equals(g) && !this.root.contains(g)) {
                this._.cache.type = CKEDITOR.SELECTION_NONE;
                this._.cache.startElement = null;
                this._.cache.selectedElement = null;
                this._.cache.selectedText = "";
                this._.cache.ranges = new CKEDITOR.dom.rangeList
            }
            return this
        };
        var t = {img: 1, hr: 1, li: 1, table: 1, tr: 1, td: 1, th: 1, embed: 1, object: 1, ol: 1, ul: 1, a: 1, input: 1, form: 1, select: 1, textarea: 1, button: 1, fieldset: 1,
            thead: 1, tfoot: 1};
        CKEDITOR.dom.selection.prototype = {getNative: function () {
            return this._.cache.nativeSel !== void 0 ? this._.cache.nativeSel : this._.cache.nativeSel = m ? this.document.$.selection : this.document.getWindow().$.getSelection()
        }, getType: m ? function () {
            var a = this._.cache;
            if (a.type)return a.type;
            var b = CKEDITOR.SELECTION_NONE;
            try {
                var c = this.getNative(), e = c.type;
                if (e == "Text")b = CKEDITOR.SELECTION_TEXT;
                if (e == "Control")b = CKEDITOR.SELECTION_ELEMENT;
                if (c.createRange().parentElement())b = CKEDITOR.SELECTION_TEXT
            } catch (d) {
            }
            return a.type =
                b
        } : function () {
            var a = this._.cache;
            if (a.type)return a.type;
            var b = CKEDITOR.SELECTION_TEXT, c = this.getNative();
            if (!c || !c.rangeCount)b = CKEDITOR.SELECTION_NONE; else if (c.rangeCount == 1) {
                var c = c.getRangeAt(0), e = c.startContainer;
                if (e == c.endContainer && e.nodeType == 1 && c.endOffset - c.startOffset == 1 && t[e.childNodes[c.startOffset].nodeName.toLowerCase()])b = CKEDITOR.SELECTION_ELEMENT
            }
            return a.type = b
        }, getRanges: function () {
            var a = m ? function () {
                function a(b) {
                    return(new CKEDITOR.dom.node(b)).getIndex()
                }

                var b = function (b, c) {
                    b = b.duplicate();
                    b.collapse(c);
                    var e = b.parentElement();
                    if (!e.hasChildNodes())return{container: e, offset: 0};
                    for (var d = e.children, g, f, h = b.duplicate(), i = 0, k = d.length - 1, j = -1, w, C; i <= k;) {
                        j = Math.floor((i + k) / 2);
                        g = d[j];
                        h.moveToElementText(g);
                        w = h.compareEndPoints("StartToStart", b);
                        if (w > 0)k = j - 1; else if (w < 0)i = j + 1; else return{container: e, offset: a(g)}
                    }
                    if (j == -1 || j == d.length - 1 && w < 0) {
                        h.moveToElementText(e);
                        h.setEndPoint("StartToStart", b);
                        h = h.text.replace(/(\r\n|\r)/g, "\n").length;
                        d = e.childNodes;
                        if (!h) {
                            g = d[d.length -
                                1];
                            return g.nodeType != CKEDITOR.NODE_TEXT ? {container: e, offset: d.length} : {container: g, offset: g.nodeValue.length}
                        }
                        for (e = d.length; h > 0 && e > 0;) {
                            f = d[--e];
                            if (f.nodeType == CKEDITOR.NODE_TEXT) {
                                C = f;
                                h = h - f.nodeValue.length
                            }
                        }
                        return{container: C, offset: -h}
                    }
                    h.collapse(w > 0 ? true : false);
                    h.setEndPoint(w > 0 ? "StartToStart" : "EndToStart", b);
                    h = h.text.replace(/(\r\n|\r)/g, "\n").length;
                    if (!h)return{container: e, offset: a(g) + (w > 0 ? 0 : 1)};
                    for (; h > 0;)try {
                        f = g[w > 0 ? "previousSibling" : "nextSibling"];
                        if (f.nodeType == CKEDITOR.NODE_TEXT) {
                            h = h - f.nodeValue.length;
                            C = f
                        }
                        g = f
                    } catch (I) {
                        return{container: e, offset: a(g)}
                    }
                    return{container: C, offset: w > 0 ? -h : C.nodeValue.length + h}
                };
                return function () {
                    var a = this.getNative(), c = a && a.createRange(), e = this.getType();
                    if (!a)return[];
                    if (e == CKEDITOR.SELECTION_TEXT) {
                        a = new CKEDITOR.dom.range(this.root);
                        e = b(c, true);
                        a.setStart(new CKEDITOR.dom.node(e.container), e.offset);
                        e = b(c);
                        a.setEnd(new CKEDITOR.dom.node(e.container), e.offset);
                        a.endContainer.getPosition(a.startContainer) & CKEDITOR.POSITION_PRECEDING && a.endOffset <= a.startContainer.getIndex() &&
                        a.collapse();
                        return[a]
                    }
                    if (e == CKEDITOR.SELECTION_ELEMENT) {
                        for (var e = [], d = 0; d < c.length; d++) {
                            for (var g = c.item(d), f = g.parentNode, h = 0, a = new CKEDITOR.dom.range(this.root); h < f.childNodes.length && f.childNodes[h] != g; h++);
                            a.setStart(new CKEDITOR.dom.node(f), h);
                            a.setEnd(new CKEDITOR.dom.node(f), h + 1);
                            e.push(a)
                        }
                        return e
                    }
                    return[]
                }
            }() : function () {
                var a = [], b, c = this.getNative();
                if (!c)return a;
                for (var e = 0; e < c.rangeCount; e++) {
                    var d = c.getRangeAt(e);
                    b = new CKEDITOR.dom.range(this.root);
                    b.setStart(new CKEDITOR.dom.node(d.startContainer),
                        d.startOffset);
                    b.setEnd(new CKEDITOR.dom.node(d.endContainer), d.endOffset);
                    a.push(b)
                }
                return a
            };
            return function (b) {
                var c = this._.cache, e = c.ranges;
                if (!e)c.ranges = e = new CKEDITOR.dom.rangeList(a.call(this));
                return!b ? e : j(new CKEDITOR.dom.rangeList(e.slice()))
            }
        }(), getStartElement: function () {
            var a = this._.cache;
            if (a.startElement !== void 0)return a.startElement;
            var b;
            switch (this.getType()) {
                case CKEDITOR.SELECTION_ELEMENT:
                    return this.getSelectedElement();
                case CKEDITOR.SELECTION_TEXT:
                    var c = this.getRanges()[0];
                    if (c) {
                        if (c.collapsed) {
                            b = c.startContainer;
                            b.type != CKEDITOR.NODE_ELEMENT && (b = b.getParent())
                        } else {
                            for (c.optimize(); ;) {
                                b = c.startContainer;
                                if (c.startOffset == (b.getChildCount ? b.getChildCount() : b.getLength()) && !b.isBlockBoundary())c.setStartAfter(b); else break
                            }
                            b = c.startContainer;
                            if (b.type != CKEDITOR.NODE_ELEMENT)return b.getParent();
                            b = b.getChild(c.startOffset);
                            if (!b || b.type != CKEDITOR.NODE_ELEMENT)b = c.startContainer; else for (c = b.getFirst(); c && c.type == CKEDITOR.NODE_ELEMENT;) {
                                b = c;
                                c = c.getFirst()
                            }
                        }
                        b = b.$
                    }
            }
            return a.startElement =
                b ? new CKEDITOR.dom.element(b) : null
        }, getSelectedElement: function () {
            var a = this._.cache;
            if (a.selectedElement !== void 0)return a.selectedElement;
            var b = this, c = CKEDITOR.tools.tryThese(function () {
                return b.getNative().createRange().item(0)
            }, function () {
                for (var a = b.getRanges()[0].clone(), c, e, d = 2; d && (!(c = a.getEnclosedNode()) || !(c.type == CKEDITOR.NODE_ELEMENT && t[c.getName()] && (e = c))); d--)a.shrink(CKEDITOR.SHRINK_ELEMENT);
                return e && e.$
            });
            return a.selectedElement = c ? new CKEDITOR.dom.element(c) : null
        }, getSelectedText: function () {
            var a =
                this._.cache;
            if (a.selectedText !== void 0)return a.selectedText;
            var b = this.getNative(), b = m ? b.type == "Control" ? "" : b.createRange().text : b.toString();
            return a.selectedText = b
        }, lock: function () {
            this.getRanges();
            this.getStartElement();
            this.getSelectedElement();
            this.getSelectedText();
            this._.cache.nativeSel = null;
            this.isLocked = 1
        }, unlock: function (a) {
            if (this.isLocked) {
                if (a)var b = this.getSelectedElement(), c = !b && this.getRanges(), e = this.isFake;
                this.isLocked = 0;
                this.reset();
                if (a)(a = b || c[0] && c[0].getCommonAncestor()) &&
                a.getAscendant("body", 1) && (e ? this.fake(b) : b ? this.selectElement(b) : this.selectRanges(c))
            }
        }, reset: function () {
            this._.cache = {};
            this.isFake = 0;
            var a = this.root.editor;
            if (a && a._.fakeSelection && this.rev == a._.fakeSelection.rev) {
                delete a._.fakeSelection;
                var b = a._.hiddenSelectionContainer;
                if (b) {
                    a.fire("lockSnapshot");
                    b.remove();
                    a.fire("unlockSnapshot")
                }
                delete a._.hiddenSelectionContainer
            }
            this.rev = r++
        }, selectElement: function (a) {
            var b = new CKEDITOR.dom.range(this.root);
            b.setStartBefore(a);
            b.setEndAfter(a);
            this.selectRanges([b])
        },
            selectRanges: function (a) {
                var c = this.root.editor, c = c && c._.hiddenSelectionContainer;
                this.reset();
                if (c)for (var c = this.root, d, g = 0; g < a.length; ++g) {
                    d = a[g];
                    if (d.endContainer.equals(c))d.endOffset = Math.min(d.endOffset, c.getChildCount())
                }
                if (a.length)if (this.isLocked) {
                    var f = CKEDITOR.document.getActive();
                    this.unlock();
                    this.selectRanges(a);
                    this.lock();
                    !f.equals(this.root) && f.focus()
                } else {
                    var h;
                    a:{
                        var i, k;
                        if (a.length == 1 && !(k = a[0]).collapsed && (h = k.getEnclosedNode()) && h.type == CKEDITOR.NODE_ELEMENT) {
                            k = k.clone();
                            k.shrink(CKEDITOR.SHRINK_ELEMENT, true);
                            if ((i = k.getEnclosedNode()) && i.type == CKEDITOR.NODE_ELEMENT)h = i;
                            if (h.getAttribute("contenteditable") == "false")break a
                        }
                        h = void 0
                    }
                    if (h)this.fake(h); else {
                        if (m) {
                            k = CKEDITOR.dom.walker.whitespaces(true);
                            i = /\ufeff|\u00a0/;
                            c = {table: 1, tbody: 1, tr: 1};
                            if (a.length > 1) {
                                h = a[a.length - 1];
                                a[0].setEnd(h.endContainer, h.endOffset)
                            }
                            h = a[0];
                            var a = h.collapsed, j, l, n;
                            if ((d = h.getEnclosedNode()) && d.type == CKEDITOR.NODE_ELEMENT && d.getName()in t && (!d.is("a") || !d.getText()))try {
                                n = d.$.createControlRange();
                                n.addElement(d.$);
                                n.select();
                                return
                            } catch (o) {
                            }
                            (h.startContainer.type == CKEDITOR.NODE_ELEMENT && h.startContainer.getName()in c || h.endContainer.type == CKEDITOR.NODE_ELEMENT && h.endContainer.getName()in c) && h.shrink(CKEDITOR.NODE_ELEMENT, true);
                            n = h.createBookmark();
                            c = n.startNode;
                            if (!a)f = n.endNode;
                            n = h.document.$.body.createTextRange();
                            n.moveToElementText(c.$);
                            n.moveStart("character", 1);
                            if (f) {
                                i = h.document.$.body.createTextRange();
                                i.moveToElementText(f.$);
                                n.setEndPoint("EndToEnd", i);
                                n.moveEnd("character", -1)
                            } else {
                                j =
                                    c.getNext(k);
                                l = c.hasAscendant("pre");
                                j = !(j && j.getText && j.getText().match(i)) && (l || !c.hasPrevious() || c.getPrevious().is && c.getPrevious().is("br"));
                                l = h.document.createElement("span");
                                l.setHtml("&#65279;");
                                l.insertBefore(c);
                                j && h.document.createText("﻿").insertBefore(c)
                            }
                            h.setStartBefore(c);
                            c.remove();
                            if (a) {
                                if (j) {
                                    n.moveStart("character", -1);
                                    n.select();
                                    h.document.$.selection.clear()
                                } else n.select();
                                h.moveToPosition(l, CKEDITOR.POSITION_BEFORE_START);
                                l.remove()
                            } else {
                                h.setEndBefore(f);
                                f.remove();
                                n.select()
                            }
                        } else {
                            f =
                                this.getNative();
                            if (!f)return;
                            this.removeAllRanges();
                            for (n = 0; n < a.length; n++) {
                                if (n < a.length - 1) {
                                    j = a[n];
                                    l = a[n + 1];
                                    i = j.clone();
                                    i.setStart(j.endContainer, j.endOffset);
                                    i.setEnd(l.startContainer, l.startOffset);
                                    if (!i.collapsed) {
                                        i.shrink(CKEDITOR.NODE_ELEMENT, true);
                                        h = i.getCommonAncestor();
                                        i = i.getEnclosedNode();
                                        if (h.isReadOnly() || i && i.isReadOnly()) {
                                            l.setStart(j.startContainer, j.startOffset);
                                            a.splice(n--, 1);
                                            continue
                                        }
                                    }
                                }
                                h = a[n];
                                l = this.document.$.createRange();
                                if (h.collapsed && CKEDITOR.env.webkit && b(h)) {
                                    j = this.root;
                                    e(j, false);
                                    i = j.getDocument().createText("​");
                                    j.setCustomData("cke-fillingChar", i);
                                    h.insertNode(i);
                                    if ((j = i.getNext()) && !i.getPrevious() && j.type == CKEDITOR.NODE_ELEMENT && j.getName() == "br") {
                                        e(this.root);
                                        h.moveToPosition(j, CKEDITOR.POSITION_BEFORE_START)
                                    } else h.moveToPosition(i, CKEDITOR.POSITION_AFTER_END)
                                }
                                l.setStart(h.startContainer.$, h.startOffset);
                                try {
                                    l.setEnd(h.endContainer.$, h.endOffset)
                                } catch (z) {
                                    if (z.toString().indexOf("NS_ERROR_ILLEGAL_VALUE") >= 0) {
                                        h.collapse(1);
                                        l.setEnd(h.endContainer.$, h.endOffset)
                                    } else throw z;
                                }
                                f.addRange(l)
                            }
                        }
                        this.reset();
                        this.root.fire("selectionchange")
                    }
                }
            }, fake: function (a) {
                var b = this.root.editor;
                this.reset();
                g(b);
                var c = this._.cache, e = new CKEDITOR.dom.range(this.root);
                e.setStartBefore(a);
                e.setEndAfter(a);
                c.ranges = new CKEDITOR.dom.rangeList(e);
                c.selectedElement = c.startElement = a;
                c.type = CKEDITOR.SELECTION_ELEMENT;
                c.selectedText = c.nativeSel = null;
                this.isFake = 1;
                this.rev = r++;
                b._.fakeSelection = this;
                this.root.fire("selectionchange")
            }, isHidden: function () {
                var a = this.getCommonAncestor();
                a && a.type ==
                    CKEDITOR.NODE_TEXT && (a = a.getParent());
                return!(!a || !a.data("cke-hidden-sel"))
            }, createBookmarks: function (a) {
                a = this.getRanges().createBookmarks(a);
                this.isFake && (a.isFake = 1);
                return a
            }, createBookmarks2: function (a) {
                a = this.getRanges().createBookmarks2(a);
                this.isFake && (a.isFake = 1);
                return a
            }, selectBookmarks: function (a) {
                for (var b = [], c = 0; c < a.length; c++) {
                    var e = new CKEDITOR.dom.range(this.root);
                    e.moveToBookmark(a[c]);
                    b.push(e)
                }
                a.isFake ? this.fake(b[0].getEnclosedNode()) : this.selectRanges(b);
                return this
            }, getCommonAncestor: function () {
                var a =
                    this.getRanges();
                return!a.length ? null : a[0].startContainer.getCommonAncestor(a[a.length - 1].endContainer)
            }, scrollIntoView: function () {
                this.type != CKEDITOR.SELECTION_NONE && this.getRanges()[0].scrollIntoView()
            }, removeAllRanges: function () {
                if (this.getType() != CKEDITOR.SELECTION_NONE) {
                    var a = this.getNative();
                    try {
                        a && a[m ? "empty" : "removeAllRanges"]()
                    } catch (b) {
                    }
                    this.reset()
                }
            }}
    }(),"use strict",CKEDITOR.STYLE_BLOCK = 1,CKEDITOR.STYLE_INLINE = 2,CKEDITOR.STYLE_OBJECT = 3,function () {
        function c(a, b) {
            for (var c, e; a = a.getParent();) {
                if (a.equals(b))break;
                if (a.getAttribute("data-nostyle"))c = a; else if (!e) {
                    var d = a.getAttribute("contentEditable");
                    d == "false" ? c = a : d == "true" && (e = 1)
                }
            }
            return c
        }

        function f(a) {
            var e = a.document;
            if (a.collapsed) {
                e = r(this, e);
                a.insertNode(e);
                a.moveToPosition(e, CKEDITOR.POSITION_BEFORE_END)
            } else {
                var d = this.element, g = this._.definition, h, i = g.ignoreReadonly, k = i || g.includeReadonly;
                k == void 0 && (k = a.root.getCustomData("cke_includeReadonly"));
                var j = CKEDITOR.dtd[d];
                if (!j) {
                    h = true;
                    j = CKEDITOR.dtd.span
                }
                a.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
                a.trim();
                var l = a.createBookmark(), n = l.startNode, o = l.endNode, m = n, p;
                if (!i) {
                    var t = a.getCommonAncestor(), i = c(n, t), t = c(o, t);
                    i && (m = i.getNextSourceNode(true));
                    t && (o = t)
                }
                for (m.getPosition(o) == CKEDITOR.POSITION_FOLLOWING && (m = 0); m;) {
                    i = false;
                    if (m.equals(o)) {
                        m = null;
                        i = true
                    } else {
                        var u = m.type == CKEDITOR.NODE_ELEMENT ? m.getName() : null, t = u && m.getAttribute("contentEditable") == "false", s = u && m.getAttribute("data-nostyle");
                        if (u && m.data("cke-bookmark")) {
                            m = m.getNextSourceNode(true);
                            continue
                        }
                        if (t && k && CKEDITOR.dtd.$block[u])for (var x =
                            m, B = b(x), y = void 0, v = B.length, A = 0, x = v && new CKEDITOR.dom.range(x.getDocument()); A < v; ++A) {
                            var y = B[A], F = CKEDITOR.filter.instances[y.data("cke-filter")];
                            if (F ? F.check(this) : 1) {
                                x.selectNodeContents(y);
                                f.call(this, x)
                            }
                        }
                        B = u ? !j[u] || s ? 0 : t && !k ? 0 : (m.getPosition(o) | J) == J && (!g.childRule || g.childRule(m)) : 1;
                        if (B)if ((B = m.getParent()) && ((B.getDtd() || CKEDITOR.dtd.span)[d] || h) && (!g.parentRule || g.parentRule(B))) {
                            if (!p && (!u || !CKEDITOR.dtd.$removeEmpty[u] || (m.getPosition(o) | J) == J)) {
                                p = a.clone();
                                p.setStartBefore(m)
                            }
                            u = m.type;
                            if (u == CKEDITOR.NODE_TEXT || t || u == CKEDITOR.NODE_ELEMENT && !m.getChildCount()) {
                                for (var u = m, Z; (i = !u.getNext(E)) && (Z = u.getParent(), j[Z.getName()]) && (Z.getPosition(n) | D) == D && (!g.childRule || g.childRule(Z));)u = Z;
                                p.setEndAfter(u)
                            }
                        } else i = true; else i = true;
                        m = m.getNextSourceNode(s || t)
                    }
                    if (i && p && !p.collapsed) {
                        for (var i = r(this, e), t = i.hasAttributes(), s = p.getCommonAncestor(), u = {}, B = {}, y = {}, v = {}, W, S, aa; i && s;) {
                            if (s.getName() == d) {
                                for (W in g.attributes)if (!v[W] && (aa = s.getAttribute(S)))i.getAttribute(W) == aa ? B[W] = 1 : v[W] =
                                    1;
                                for (S in g.styles)if (!y[S] && (aa = s.getStyle(S)))i.getStyle(S) == aa ? u[S] = 1 : y[S] = 1
                            }
                            s = s.getParent()
                        }
                        for (W in B)i.removeAttribute(W);
                        for (S in u)i.removeStyle(S);
                        t && !i.hasAttributes() && (i = null);
                        if (i) {
                            p.extractContents().appendTo(i);
                            p.insertNode(i);
                            q.call(this, i);
                            i.mergeSiblings();
                            CKEDITOR.env.ie || i.$.normalize()
                        } else {
                            i = new CKEDITOR.dom.element("span");
                            p.extractContents().appendTo(i);
                            p.insertNode(i);
                            q.call(this, i);
                            i.remove(true)
                        }
                        p = null
                    }
                }
                a.moveToBookmark(l);
                a.shrink(CKEDITOR.SHRINK_TEXT);
                a.shrink(CKEDITOR.NODE_ELEMENT,
                    true)
            }
        }

        function d(a) {
            function b() {
                for (var a = new CKEDITOR.dom.elementPath(e.getParent()), c = new CKEDITOR.dom.elementPath(k.getParent()), d = null, g = null, f = 0; f < a.elements.length; f++) {
                    var h = a.elements[f];
                    if (h == a.block || h == a.blockLimit)break;
                    j.checkElementRemovable(h) && (d = h)
                }
                for (f = 0; f < c.elements.length; f++) {
                    h = c.elements[f];
                    if (h == c.block || h == c.blockLimit)break;
                    j.checkElementRemovable(h) && (g = h)
                }
                g && k.breakParent(g);
                d && e.breakParent(d)
            }

            a.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
            var c = a.createBookmark(), e = c.startNode;
            if (a.collapsed) {
                for (var d = new CKEDITOR.dom.elementPath(e.getParent(), a.root), g, f = 0, h; f < d.elements.length && (h = d.elements[f]); f++) {
                    if (h == d.block || h == d.blockLimit)break;
                    if (this.checkElementRemovable(h)) {
                        var i;
                        if (a.collapsed && (a.checkBoundaryOfElement(h, CKEDITOR.END) || (i = a.checkBoundaryOfElement(h, CKEDITOR.START)))) {
                            g = h;
                            g.match = i ? "start" : "end"
                        } else {
                            h.mergeSiblings();
                            h.is(this.element) ? o.call(this, h) : l(h, u(this)[h.getName()])
                        }
                    }
                }
                if (g) {
                    h = e;
                    for (f = 0; ; f++) {
                        i = d.elements[f];
                        if (i.equals(g))break; else if (i.match)continue;
                        else i = i.clone();
                        i.append(h);
                        h = i
                    }
                    h[g.match == "start" ? "insertBefore" : "insertAfter"](g)
                }
            } else {
                var k = c.endNode, j = this;
                b();
                for (d = e; !d.equals(k);) {
                    g = d.getNextSourceNode();
                    if (d.type == CKEDITOR.NODE_ELEMENT && this.checkElementRemovable(d)) {
                        d.getName() == this.element ? o.call(this, d) : l(d, u(this)[d.getName()]);
                        if (g.type == CKEDITOR.NODE_ELEMENT && g.contains(e)) {
                            b();
                            g = e.getNext()
                        }
                    }
                    d = g
                }
            }
            a.moveToBookmark(c);
            a.shrink(CKEDITOR.NODE_ELEMENT, true)
        }

        function b(a) {
            var b = [];
            a.forEach(function (a) {
                if (a.getAttribute("contenteditable") ==
                    "true") {
                    b.push(a);
                    return false
                }
            }, CKEDITOR.NODE_ELEMENT, true);
            return b
        }

        function a(a) {
            var b = a.getEnclosedNode() || a.getCommonAncestor(false, true);
            (a = (new CKEDITOR.dom.elementPath(b, a.root)).contains(this.element, 1)) && !a.isReadOnly() && t(a, this)
        }

        function e(a) {
            var b = a.getCommonAncestor(true, true);
            if (a = (new CKEDITOR.dom.elementPath(b, a.root)).contains(this.element, 1)) {
                var b = this._.definition, c = b.attributes;
                if (c)for (var e in c)a.removeAttribute(e, c[e]);
                if (b.styles)for (var d in b.styles)b.styles.hasOwnProperty(d) &&
                a.removeStyle(d)
            }
        }

        function h(a) {
            var b = a.createBookmark(true), c = a.createIterator();
            c.enforceRealBlocks = true;
            if (this._.enterMode)c.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
            for (var e, d = a.document, f; e = c.getNextParagraph();)if (!e.isReadOnly() && (c.activeFilter ? c.activeFilter.check(this) : 1)) {
                f = r(this, d, e);
                g(e, f)
            }
            a.moveToBookmark(b)
        }

        function k(a) {
            var b = a.createBookmark(1), c = a.createIterator();
            c.enforceRealBlocks = true;
            c.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
            for (var e, d; e = c.getNextParagraph();)if (this.checkElementRemovable(e))if (e.is("pre")) {
                (d =
                        this._.enterMode == CKEDITOR.ENTER_BR ? null : a.document.createElement(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div")) && e.copyAttributes(d);
                g(e, d)
            } else o.call(this, e);
            a.moveToBookmark(b)
        }

        function g(a, b) {
            var c = !b;
            if (c) {
                b = a.getDocument().createElement("div");
                a.copyAttributes(b)
            }
            var e = b && b.is("pre"), d = a.is("pre"), g = !e && d;
            if (e && !d) {
                d = b;
                (g = a.getBogus()) && g.remove();
                g = a.getHtml();
                g = j(g, /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, "");
                g = g.replace(/[ \t\r\n]*(<br[^>]*>)[ \t\r\n]*/gi, "$1");
                g = g.replace(/([ \t\n\r]+|&nbsp;)/g,
                    " ");
                g = g.replace(/<br\b[^>]*>/gi, "\n");
                if (CKEDITOR.env.ie) {
                    var f = a.getDocument().createElement("div");
                    f.append(d);
                    d.$.outerHTML = "<pre>" + g + "</pre>";
                    d.copyAttributes(f.getFirst());
                    d = f.getFirst().remove()
                } else d.setHtml(g);
                b = d
            } else g ? b = n(c ? [a.getHtml()] : i(a), b) : a.moveChildren(b);
            b.replace(a);
            if (e) {
                var c = b, h;
                if ((h = c.getPrevious(F)) && h.type == CKEDITOR.NODE_ELEMENT && h.is("pre")) {
                    e = j(h.getHtml(), /\n$/, "") + "\n\n" + j(c.getHtml(), /^\n/, "");
                    CKEDITOR.env.ie ? c.$.outerHTML = "<pre>" + e + "</pre>" : c.setHtml(e);
                    h.remove()
                }
            } else c &&
            m(b)
        }

        function i(a) {
            a.getName();
            var b = [];
            j(a.getOuterHtml(), /(\S\s*)\n(?:\s|(<span[^>]+data-cke-bookmark.*?\/span>))*\n(?!$)/gi, function (a, b, c) {
                return b + "</pre>" + c + "<pre>"
            }).replace(/<pre\b.*?>([\s\S]*?)<\/pre>/gi, function (a, c) {
                b.push(c)
            });
            return b
        }

        function j(a, b, c) {
            var e = "", d = "", a = a.replace(/(^<span[^>]+data-cke-bookmark.*?\/span>)|(<span[^>]+data-cke-bookmark.*?\/span>$)/gi, function (a, b, c) {
                b && (e = b);
                c && (d = c);
                return""
            });
            return e + a.replace(b, c) + d
        }

        function n(a, b) {
            var c;
            a.length > 1 && (c = new CKEDITOR.dom.documentFragment(b.getDocument()));
            for (var e = 0; e < a.length; e++) {
                var d = a[e], d = d.replace(/(\r\n|\r)/g, "\n"), d = j(d, /^[ \t]*\n/, ""), d = j(d, /\n$/, ""), d = j(d, /^[ \t]+|[ \t]+$/g, function (a, b) {
                    return a.length == 1 ? "&nbsp;" : b ? " " + CKEDITOR.tools.repeat("&nbsp;", a.length - 1) : CKEDITOR.tools.repeat("&nbsp;", a.length - 1) + " "
                }), d = d.replace(/\n/g, "<br>"), d = d.replace(/[ \t]{2,}/g, function (a) {
                    return CKEDITOR.tools.repeat("&nbsp;", a.length - 1) + " "
                });
                if (c) {
                    var g = b.clone();
                    g.setHtml(d);
                    c.append(g)
                } else b.setHtml(d)
            }
            return c || b
        }

        function o(a, b) {
            var c = this._.definition,
                e = c.attributes, c = c.styles, d = u(this)[a.getName()], g = CKEDITOR.tools.isEmpty(e) && CKEDITOR.tools.isEmpty(c), f;
            for (f in e)if (!((f == "class" || this._.definition.fullMatch) && a.getAttribute(f) != s(f, e[f])) && !(b && f.slice(0, 5) == "data-")) {
                g = a.hasAttribute(f);
                a.removeAttribute(f)
            }
            for (var h in c)if (!(this._.definition.fullMatch && a.getStyle(h) != s(h, c[h], true))) {
                g = g || !!a.getStyle(h);
                a.removeStyle(h)
            }
            l(a, d, y[a.getName()]);
            g && (this._.definition.alwaysRemoveElement ? m(a, 1) : !CKEDITOR.dtd.$block[a.getName()] || this._.enterMode ==
                CKEDITOR.ENTER_BR && !a.hasAttributes() ? m(a) : a.renameNode(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div"))
        }

        function q(a) {
            for (var b = u(this), c = a.getElementsByTag(this.element), e, d = c.count(); --d >= 0;) {
                e = c.getItem(d);
                e.isReadOnly() || o.call(this, e, true)
            }
            for (var g in b)if (g != this.element) {
                c = a.getElementsByTag(g);
                for (d = c.count() - 1; d >= 0; d--) {
                    e = c.getItem(d);
                    e.isReadOnly() || l(e, b[g])
                }
            }
        }

        function l(a, b, c) {
            if (b = b && b.attributes)for (var e = 0; e < b.length; e++) {
                var d = b[e][0], g;
                if (g = a.getAttribute(d)) {
                    var f = b[e][1];
                    (f === null ||
                        f.test && f.test(g) || typeof f == "string" && g == f) && a.removeAttribute(d)
                }
            }
            c || m(a)
        }

        function m(a, b) {
            if (!a.hasAttributes() || b)if (CKEDITOR.dtd.$block[a.getName()]) {
                var c = a.getPrevious(F), e = a.getNext(F);
                c && (c.type == CKEDITOR.NODE_TEXT || !c.isBlockBoundary({br: 1})) && a.append("br", 1);
                e && (e.type == CKEDITOR.NODE_TEXT || !e.isBlockBoundary({br: 1})) && a.append("br");
                a.remove(true)
            } else {
                c = a.getFirst();
                e = a.getLast();
                a.remove(true);
                if (c) {
                    c.type == CKEDITOR.NODE_ELEMENT && c.mergeSiblings();
                    e && (!c.equals(e) && e.type == CKEDITOR.NODE_ELEMENT) &&
                    e.mergeSiblings()
                }
            }
        }

        function r(a, b, c) {
            var e;
            e = a.element;
            e == "*" && (e = "span");
            e = new CKEDITOR.dom.element(e, b);
            c && c.copyAttributes(e);
            e = t(e, a);
            b.getCustomData("doc_processing_style") && e.hasAttribute("id") ? e.removeAttribute("id") : b.setCustomData("doc_processing_style", 1);
            return e
        }

        function t(a, b) {
            var c = b._.definition, e = c.attributes, c = CKEDITOR.style.getStyleText(c);
            if (e)for (var d in e)a.setAttribute(d, e[d]);
            c && a.setAttribute("style", c);
            return a
        }

        function p(a, b) {
            for (var c in a)a[c] = a[c].replace(B, function (a, c) {
                return b[c]
            })
        }

        function u(a) {
            if (a._.overrides)return a._.overrides;
            var b = a._.overrides = {}, c = a._.definition.overrides;
            if (c) {
                CKEDITOR.tools.isArray(c) || (c = [c]);
                for (var e = 0; e < c.length; e++) {
                    var d = c[e], g, f;
                    if (typeof d == "string")g = d.toLowerCase(); else {
                        g = d.element ? d.element.toLowerCase() : a.element;
                        f = d.attributes
                    }
                    d = b[g] || (b[g] = {});
                    if (f) {
                        var d = d.attributes = d.attributes || [], h;
                        for (h in f)d.push([h.toLowerCase(), f[h]])
                    }
                }
            }
            return b
        }

        function s(a, b, c) {
            var e = new CKEDITOR.dom.element("span");
            e[c ? "setStyle" : "setAttribute"](a,
                b);
            return e[c ? "getStyle" : "getAttribute"](a)
        }

        function x(a, b, c) {
            for (var e = a.document, d = a.getRanges(), b = b ? this.removeFromRange : this.applyToRange, g, f = d.createIterator(); g = f.getNextRange();)b.call(this, g, c);
            a.selectRanges(d);
            e.removeCustomData("doc_processing_style")
        }

        var y = {address: 1, div: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, p: 1, pre: 1, section: 1, header: 1, footer: 1, nav: 1, article: 1, aside: 1, figure: 1, dialog: 1, hgroup: 1, time: 1, meter: 1, menu: 1, command: 1, keygen: 1, output: 1, progress: 1, details: 1, datagrid: 1, datalist: 1}, v =
        {a: 1, embed: 1, hr: 1, img: 1, li: 1, object: 1, ol: 1, table: 1, td: 1, tr: 1, th: 1, ul: 1, dl: 1, dt: 1, dd: 1, form: 1, audio: 1, video: 1}, A = /\s*(?:;\s*|$)/, B = /#\((.+?)\)/g, E = CKEDITOR.dom.walker.bookmark(0, 1), F = CKEDITOR.dom.walker.whitespaces(1);
        CKEDITOR.style = function (a, b) {
            if (typeof a.type == "string")return new CKEDITOR.style.customHandlers[a.type](a);
            var c = a.attributes;
            if (c && c.style) {
                a.styles = CKEDITOR.tools.extend({}, a.styles, CKEDITOR.tools.parseCssText(c.style));
                delete c.style
            }
            if (b) {
                a = CKEDITOR.tools.clone(a);
                p(a.attributes,
                    b);
                p(a.styles, b)
            }
            c = this.element = a.element ? typeof a.element == "string" ? a.element.toLowerCase() : a.element : "*";
            this.type = a.type || (y[c] ? CKEDITOR.STYLE_BLOCK : v[c] ? CKEDITOR.STYLE_OBJECT : CKEDITOR.STYLE_INLINE);
            if (typeof this.element == "object")this.type = CKEDITOR.STYLE_OBJECT;
            this._ = {definition: a}
        };
        CKEDITOR.style.prototype = {apply: function (a) {
            if (a instanceof CKEDITOR.dom.document)return x.call(this, a.getSelection());
            if (this.checkApplicable(a.elementPath(), a)) {
                var b = this._.enterMode;
                if (!b)this._.enterMode = a.activeEnterMode;
                x.call(this, a.getSelection(), 0, a);
                this._.enterMode = b
            }
        }, remove: function (a) {
            if (a instanceof CKEDITOR.dom.document)return x.call(this, a.getSelection(), 1);
            if (this.checkApplicable(a.elementPath(), a)) {
                var b = this._.enterMode;
                if (!b)this._.enterMode = a.activeEnterMode;
                x.call(this, a.getSelection(), 1, a);
                this._.enterMode = b
            }
        }, applyToRange: function (b) {
            this.applyToRange = this.type == CKEDITOR.STYLE_INLINE ? f : this.type == CKEDITOR.STYLE_BLOCK ? h : this.type == CKEDITOR.STYLE_OBJECT ? a : null;
            return this.applyToRange(b)
        }, removeFromRange: function (a) {
            this.removeFromRange =
                    this.type == CKEDITOR.STYLE_INLINE ? d : this.type == CKEDITOR.STYLE_BLOCK ? k : this.type == CKEDITOR.STYLE_OBJECT ? e : null;
            return this.removeFromRange(a)
        }, applyToObject: function (a) {
            t(a, this)
        }, checkActive: function (a, b) {
            switch (this.type) {
                case CKEDITOR.STYLE_BLOCK:
                    return this.checkElementRemovable(a.block || a.blockLimit, true, b);
                case CKEDITOR.STYLE_OBJECT:
                case CKEDITOR.STYLE_INLINE:
                    for (var c = a.elements, e = 0, d; e < c.length; e++) {
                        d = c[e];
                        if (!(this.type == CKEDITOR.STYLE_INLINE && (d == a.block || d == a.blockLimit))) {
                            if (this.type ==
                                CKEDITOR.STYLE_OBJECT) {
                                var g = d.getName();
                                if (!(typeof this.element == "string" ? g == this.element : g in this.element))continue
                            }
                            if (this.checkElementRemovable(d, true, b))return true
                        }
                    }
            }
            return false
        }, checkApplicable: function (a, b, c) {
            b && b instanceof CKEDITOR.filter && (c = b);
            if (c && !c.check(this))return false;
            switch (this.type) {
                case CKEDITOR.STYLE_OBJECT:
                    return!!a.contains(this.element);
                case CKEDITOR.STYLE_BLOCK:
                    return!!a.blockLimit.getDtd()[this.element]
            }
            return true
        }, checkElementMatch: function (a, b) {
            var c = this._.definition;
            if (!a || !c.ignoreReadonly && a.isReadOnly())return false;
            var e = a.getName();
            if (typeof this.element == "string" ? e == this.element : e in this.element) {
                if (!b && !a.hasAttributes())return true;
                if (e = c._AC)c = e; else {
                    var e = {}, d = 0, g = c.attributes;
                    if (g)for (var f in g) {
                        d++;
                        e[f] = g[f]
                    }
                    if (f = CKEDITOR.style.getStyleText(c)) {
                        e.style || d++;
                        e.style = f
                    }
                    e._length = d;
                    c = c._AC = e
                }
                if (c._length) {
                    for (var h in c)if (h != "_length") {
                        d = a.getAttribute(h) || "";
                        if (h == "style")a:{
                            e = c[h];
                            typeof e == "string" && (e = CKEDITOR.tools.parseCssText(e));
                            typeof d ==
                            "string" && (d = CKEDITOR.tools.parseCssText(d, true));
                            f = void 0;
                            for (f in e)if (!(f in d && (d[f] == e[f] || e[f] == "inherit" || d[f] == "inherit"))) {
                                e = false;
                                break a
                            }
                            e = true
                        } else e = c[h] == d;
                        if (e) {
                            if (!b)return true
                        } else if (b)return false
                    }
                    if (b)return true
                } else return true
            }
            return false
        }, checkElementRemovable: function (a, b, c) {
            if (this.checkElementMatch(a, b, c))return true;
            if (b = u(this)[a.getName()]) {
                var e;
                if (!(b = b.attributes))return true;
                for (c = 0; c < b.length; c++) {
                    e = b[c][0];
                    if (e = a.getAttribute(e)) {
                        var d = b[c][1];
                        if (d === null || typeof d ==
                            "string" && e == d || d.test(e))return true
                    }
                }
            }
            return false
        }, buildPreview: function (a) {
            var b = this._.definition, c = [], e = b.element;
            e == "bdo" && (e = "span");
            var c = ["<", e], d = b.attributes;
            if (d)for (var g in d)c.push(" ", g, '="', d[g], '"');
            (d = CKEDITOR.style.getStyleText(b)) && c.push(' style="', d, '"');
            c.push(">", a || b.name, "</", e, ">");
            return c.join("")
        }, getDefinition: function () {
            return this._.definition
        }};
        CKEDITOR.style.getStyleText = function (a) {
            var b = a._ST;
            if (b)return b;
            var b = a.styles, c = a.attributes && a.attributes.style || "",
                e = "";
            c.length && (c = c.replace(A, ";"));
            for (var d in b) {
                var g = b[d], f = (d + ":" + g).replace(A, ";");
                g == "inherit" ? e = e + f : c = c + f
            }
            c.length && (c = CKEDITOR.tools.normalizeCssText(c, true));
            return a._ST = c + e
        };
        CKEDITOR.style.customHandlers = {};
        CKEDITOR.style.addCustomHandler = function (a) {
            var b = function (a) {
                this._ = {definition: a};
                this.setup && this.setup(a)
            };
            b.prototype = CKEDITOR.tools.extend(CKEDITOR.tools.prototypedCopy(CKEDITOR.style.prototype), {assignedTo: CKEDITOR.STYLE_OBJECT}, a, true);
            return this.customHandlers[a.type] = b
        };
        var J = CKEDITOR.POSITION_PRECEDING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED, D = CKEDITOR.POSITION_FOLLOWING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED
    }(),CKEDITOR.styleCommand = function (c, f) {
        this.requiredContent = this.allowedContent = this.style = c;
        CKEDITOR.tools.extend(this, f, true)
    },CKEDITOR.styleCommand.prototype.exec = function (c) {
        c.focus();
        this.state == CKEDITOR.TRISTATE_OFF ? c.applyStyle(this.style) : this.state == CKEDITOR.TRISTATE_ON && c.removeStyle(this.style)
    },CKEDITOR.stylesSet =
        new CKEDITOR.resourceManager("", "stylesSet"),CKEDITOR.addStylesSet = CKEDITOR.tools.bind(CKEDITOR.stylesSet.add, CKEDITOR.stylesSet),CKEDITOR.loadStylesSet = function (c, f, d) {
        CKEDITOR.stylesSet.addExternal(c, f, "");
        CKEDITOR.stylesSet.load(c, d)
    },CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {attachStyleStateChange: function (c, f) {
        var d = this._.styleStateChangeCallbacks;
        if (!d) {
            d = this._.styleStateChangeCallbacks = [];
            this.on("selectionChange", function (b) {
                for (var a = 0; a < d.length; a++) {
                    var c = d[a], f = c.style.checkActive(b.data.path,
                        this) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
                    c.fn.call(this, f)
                }
            })
        }
        d.push({style: c, fn: f})
    }, applyStyle: function (c) {
        c.apply(this)
    }, removeStyle: function (c) {
        c.remove(this)
    }, getStylesSet: function (c) {
        if (this._.stylesDefinitions)c(this._.stylesDefinitions); else {
            var f = this, d = f.config.stylesCombo_stylesSet || f.config.stylesSet;
            if (d === false)c(null); else if (d instanceof Array) {
                f._.stylesDefinitions = d;
                c(d)
            } else {
                d || (d = "default");
                var d = d.split(":"), b = d[0];
//                CKEDITOR.stylesSet.addExternal(b, d[1] ? d.slice(1).join(":") :
//                    CKEDITOR.getUrl("/static/assets/ckeditor/styles.js"), "");
                CKEDITOR.stylesSet.load(b, function (a) {
                    f._.stylesDefinitions = a[b];
                    c(f._.stylesDefinitions)
                })
            }
        }
    }}),CKEDITOR.dom.comment = function (c, f) {
        typeof c == "string" && (c = (f ? f.$ : document).createComment(c));
        CKEDITOR.dom.domObject.call(this, c)
    },CKEDITOR.dom.comment.prototype = new CKEDITOR.dom.node,CKEDITOR.tools.extend(CKEDITOR.dom.comment.prototype, {type: CKEDITOR.NODE_COMMENT, getOuterHtml: function () {
        return"<\!--" + this.$.nodeValue + "--\>"
    }}),"use strict",function () {
        var c = {}, f = {}, d;
        for (d in CKEDITOR.dtd.$blockLimit)d in
        CKEDITOR.dtd.$list || (c[d] = 1);
        for (d in CKEDITOR.dtd.$block)d in CKEDITOR.dtd.$blockLimit || d in CKEDITOR.dtd.$empty || (f[d] = 1);
        CKEDITOR.dom.elementPath = function (b, a) {
            var e = null, d = null, k = [], g = b, i, a = a || b.getDocument().getBody();
            do if (g.type == CKEDITOR.NODE_ELEMENT) {
                k.push(g);
                if (!this.lastElement) {
                    this.lastElement = g;
                    if (g.is(CKEDITOR.dtd.$object) || g.getAttribute("contenteditable") == "false")continue
                }
                if (g.equals(a))break;
                if (!d) {
                    i = g.getName();
                    g.getAttribute("contenteditable") == "true" ? d = g : !e && f[i] && (e = g);
                    if (c[i]) {
                        var j;
                        if (j = !e) {
                            if (i = i == "div") {
                                a:{
                                    i = g.getChildren();
                                    j = 0;
                                    for (var n = i.count(); j < n; j++) {
                                        var o = i.getItem(j);
                                        if (o.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$block[o.getName()]) {
                                            i = true;
                                            break a
                                        }
                                    }
                                    i = false
                                }
                                i = !i
                            }
                            j = i
                        }
                        j ? e = g : d = g
                    }
                }
            } while (g = g.getParent());
            d || (d = a);
            this.block = e;
            this.blockLimit = d;
            this.root = a;
            this.elements = k
        }
    }(),CKEDITOR.dom.elementPath.prototype = {compare: function (c) {
        var f = this.elements, c = c && c.elements;
        if (!c || f.length != c.length)return false;
        for (var d = 0; d < f.length; d++)if (!f[d].equals(c[d]))return false;
        return true
    },
        contains: function (c, f, d) {
            var b;
            typeof c == "string" && (b = function (a) {
                return a.getName() == c
            });
            c instanceof CKEDITOR.dom.element ? b = function (a) {
                return a.equals(c)
            } : CKEDITOR.tools.isArray(c) ? b = function (a) {
                return CKEDITOR.tools.indexOf(c, a.getName()) > -1
            } : typeof c == "function" ? b = c : typeof c == "object" && (b = function (a) {
                return a.getName()in c
            });
            var a = this.elements, e = a.length;
            f && e--;
            if (d) {
                a = Array.prototype.slice.call(a, 0);
                a.reverse()
            }
            for (f = 0; f < e; f++)if (b(a[f]))return a[f];
            return null
        }, isContextFor: function (c) {
            var f;
            if (c in CKEDITOR.dtd.$block) {
                f = this.contains(CKEDITOR.dtd.$intermediate) || this.root.equals(this.block) && this.block || this.blockLimit;
                return!!f.getDtd()[c]
            }
            return true
        }, direction: function () {
            return(this.block || this.blockLimit || this.root).getDirection(1)
        }},CKEDITOR.dom.text = function (c, f) {
        typeof c == "string" && (c = (f ? f.$ : document).createTextNode(c));
        this.$ = c
    },CKEDITOR.dom.text.prototype = new CKEDITOR.dom.node,CKEDITOR.tools.extend(CKEDITOR.dom.text.prototype, {type: CKEDITOR.NODE_TEXT, getLength: function () {
        return this.$.nodeValue.length
    },
        getText: function () {
            return this.$.nodeValue
        }, setText: function (c) {
            this.$.nodeValue = c
        }, split: function (c) {
            var f = this.$.parentNode, d = f.childNodes.length, b = this.getLength(), a = this.getDocument(), e = new CKEDITOR.dom.text(this.$.splitText(c), a);
            if (f.childNodes.length == d)if (c >= b) {
                e = a.createText("");
                e.insertAfter(this)
            } else {
                c = a.createText("");
                c.insertAfter(e);
                c.remove()
            }
            return e
        }, substring: function (c, f) {
            return typeof f != "number" ? this.$.nodeValue.substr(c) : this.$.nodeValue.substring(c, f)
        }}),function () {
        function c(c, b, a) {
            var e = c.serializable, f = b[a ? "endContainer" : "startContainer"], k = a ? "endOffset" : "startOffset", g = e ? b.document.getById(c.startNode) : c.startNode, c = e ? b.document.getById(c.endNode) : c.endNode;
            if (f.equals(g.getPrevious())) {
                b.startOffset = b.startOffset - f.getLength() - c.getPrevious().getLength();
                f = c.getNext()
            } else if (f.equals(c.getPrevious())) {
                b.startOffset = b.startOffset - f.getLength();
                f = c.getNext()
            }
            f.equals(g.getParent()) && b[k]++;
            f.equals(c.getParent()) && b[k]++;
            b[a ? "endContainer" : "startContainer"] = f;
            return b
        }

        CKEDITOR.dom.rangeList = function (c) {
            if (c instanceof CKEDITOR.dom.rangeList)return c;
            c ? c instanceof CKEDITOR.dom.range && (c = [c]) : c = [];
            return CKEDITOR.tools.extend(c, f)
        };
        var f = {createIterator: function () {
            var c = this, b = CKEDITOR.dom.walker.bookmark(), a = [], e;
            return{getNextRange: function (f) {
                e = e == void 0 ? 0 : e + 1;
                var k = c[e];
                if (k && c.length > 1) {
                    if (!e)for (var g = c.length - 1; g >= 0; g--)a.unshift(c[g].createBookmark(true));
                    if (f)for (var i = 0; c[e + i + 1];) {
                        for (var j = k.document, f = 0, g = j.getById(a[i].endNode), j = j.getById(a[i + 1].startNode); ;) {
                            g =
                                g.getNextSourceNode(false);
                            if (j.equals(g))f = 1; else if (b(g) || g.type == CKEDITOR.NODE_ELEMENT && g.isBlockBoundary())continue;
                            break
                        }
                        if (!f)break;
                        i++
                    }
                    for (k.moveToBookmark(a.shift()); i--;) {
                        g = c[++e];
                        g.moveToBookmark(a.shift());
                        k.setEnd(g.endContainer, g.endOffset)
                    }
                }
                return k
            }}
        }, createBookmarks: function (d) {
            for (var b = [], a, e = 0; e < this.length; e++) {
                b.push(a = this[e].createBookmark(d, true));
                for (var f = e + 1; f < this.length; f++) {
                    this[f] = c(a, this[f]);
                    this[f] = c(a, this[f], true)
                }
            }
            return b
        }, createBookmarks2: function (c) {
            for (var b =
                [], a = 0; a < this.length; a++)b.push(this[a].createBookmark2(c));
            return b
        }, moveToBookmarks: function (c) {
            for (var b = 0; b < this.length; b++)this[b].moveToBookmark(c[b])
        }}
    }(),function () {
        function c() {
            return CKEDITOR.getUrl(CKEDITOR.skinName.split(",")[1] || "skins/" + CKEDITOR.skinName.split(",")[0] + "/")
        }

        function f(a) {
            var b = CKEDITOR.skin["ua_" + a], e = CKEDITOR.env;
            if (b)for (var b = b.split(",").sort(function (a, b) {
                return a > b ? -1 : 1
            }), d = 0, g; d < b.length; d++) {
                g = b[d];
                if (e.ie && (g.replace(/^ie/, "") == e.version || e.quirks && g == "iequirks"))g =
                    "ie";
                if (e[g]) {
                    a = a + ("_" + b[d]);
                    break
                }
            }
            return CKEDITOR.getUrl(c() + a + ".css")
        }

        function d(a, b) {
            if (!e[a]) {
                CKEDITOR.document.appendStyleSheet(f(a));
                e[a] = 1
            }
            b && b()
        }

        function b(a) {
            var b = a.getById(h);
            if (!b) {
                b = a.getHead().append("style");
                b.setAttribute("id", h);
                b.setAttribute("type", "text/css")
            }
            return b
        }

        function a(a, b, c) {
            var e, d, g;
            if (CKEDITOR.env.webkit) {
                b = b.split("}").slice(0, -1);
                for (d = 0; d < b.length; d++)b[d] = b[d].split("{")
            }
            for (var f = 0; f < a.length; f++)if (CKEDITOR.env.webkit)for (d = 0; d < b.length; d++) {
                g = b[d][1];
                for (e =
                         0; e < c.length; e++)g = g.replace(c[e][0], c[e][1]);
                a[f].$.sheet.addRule(b[d][0], g)
            } else {
                g = b;
                for (e = 0; e < c.length; e++)g = g.replace(c[e][0], c[e][1]);
                CKEDITOR.env.ie && CKEDITOR.env.version < 11 ? a[f].$.styleSheet.cssText = a[f].$.styleSheet.cssText + g : a[f].$.innerHTML = a[f].$.innerHTML + g
            }
        }

        var e = {};
        CKEDITOR.skin = {path: c, loadPart: function (a, b) {
            CKEDITOR.skin.name != CKEDITOR.skinName.split(",")[0] ? CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(c() + "skin.js"), function () {
                d(a, b)
            }) : d(a, b)
        }, getPath: function (a) {
            return CKEDITOR.getUrl(f(a))
        },
            icons: {}, addIcon: function (a, b, c, e) {
                a = a.toLowerCase();
                this.icons[a] || (this.icons[a] = {path: b, offset: c || 0, bgsize: e || "16px"})
            }, getIconStyle: function (a, b, c, e, d) {
                var g;
                if (a) {
                    a = a.toLowerCase();
                    b && (g = this.icons[a + "-rtl"]);
                    g || (g = this.icons[a])
                }
                a = c || g && g.path || "";
                e = e || g && g.offset;
                d = d || g && g.bgsize || "16px";
                return a && "background-image:url(" + CKEDITOR.getUrl(a) + ");background-position:0 " + e + "px;background-size:" + d + ";"
            }};
        CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {getUiColor: function () {
            return this.uiColor
        }, setUiColor: function (c) {
            var e =
                b(CKEDITOR.document);
            return(this.setUiColor = function (b) {
                var c = CKEDITOR.skin.chameleon, d = [
                    [g, b]
                ];
                this.uiColor = b;
                a([e], c(this, "editor"), d);
                a(k, c(this, "panel"), d)
            }).call(this, c)
        }});
        var h = "cke_ui_color", k = [], g = /\$color/g;
        CKEDITOR.on("instanceLoaded", function (c) {
            if (!CKEDITOR.env.ie || !CKEDITOR.env.quirks) {
                var e = c.editor, c = function (c) {
                    c = (c.data[0] || c.data).element.getElementsByTag("iframe").getItem(0).getFrameDocument();
                    if (!c.getById("cke_ui_color")) {
                        c = b(c);
                        k.push(c);
                        var d = e.getUiColor();
                        d && a([c], CKEDITOR.skin.chameleon(e,
                            "panel"), [
                            [g, d]
                        ])
                    }
                };
                e.on("panelShow", c);
                e.on("menuShow", c);
                e.config.uiColor && e.setUiColor(e.config.uiColor)
            }
        })
    }(),function () {
        if (CKEDITOR.env.webkit)CKEDITOR.env.hc = false; else {
            var c = CKEDITOR.dom.element.createFromHtml('<div style="width:0;height:0;position:absolute;left:-10000px;border:1px solid;border-color:red blue"></div>', CKEDITOR.document);
            c.appendTo(CKEDITOR.document.getHead());
            try {
                var f = c.getComputedStyle("border-top-color"), d = c.getComputedStyle("border-right-color");
                CKEDITOR.env.hc = !!(f && f ==
                    d)
            } catch (b) {
                CKEDITOR.env.hc = false
            }
            c.remove()
        }
        if (CKEDITOR.env.hc)CKEDITOR.env.cssClass = CKEDITOR.env.cssClass + " cke_hc";
        CKEDITOR.document.appendStyleText(".cke{visibility:hidden;}");
        CKEDITOR.status = "loaded";
        CKEDITOR.fireOnce("loaded");
        if (c = CKEDITOR._.pending) {
            delete CKEDITOR._.pending;
            for (f = 0; f < c.length; f++) {
                CKEDITOR.editor.prototype.constructor.apply(c[f][0], c[f][1]);
                CKEDITOR.add(c[f][0])
            }
        }
    }(),CKEDITOR.skin.name = "alive",CKEDITOR.skin.ua_editor = "ie,iequirks,ie7,ie8,gecko",CKEDITOR.skin.ua_dialog = "ie,iequirks,ie7,ie8",
    CKEDITOR.skin.chameleon = function () {
        var c = function () {
            return function (b, a) {
                for (var c = b.match(/[^#]./g), d = 0; d < 3; d++) {
                    var f = c, g = d, i;
                    i = parseInt(c[d], 16);
                    i = ("0" + (a < 0 ? 0 | i * (1 + a) : 0 | i + (255 - i) * a).toString(16)).slice(-2);
                    f[g] = i
                }
                return"#" + c.join("")
            }
        }(), f = function () {
            var b = new CKEDITOR.template("background:#{to};background-image:-webkit-gradient(linear,lefttop,leftbottom,from({from}),to({to}));background-image:-moz-linear-gradient(top,{from},{to});background-image:-webkit-linear-gradient(top,{from},{to});background-image:-o-linear-gradient(top,{from},{to});background-image:-ms-linear-gradient(top,{from},{to});background-image:linear-gradient(top,{from},{to});filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr='{from}',endColorstr='{to}');");
            return function (a, c) {
                return b.output({from: a, to: c})
            }
        }(), d = {editor: new CKEDITOR.template("{id}.cke_chrome [border-color:{defaultBorder};] {id} .cke_top [ {defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_bottom [{defaultGradient}border-top-color:{defaultBorder};] {id} .cke_resizer [border-right-color:{ckeResizer}] {id} .cke_dialog_title [{defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_dialog_footer [{defaultGradient}outline-color:{defaultBorder};border-top-color:{defaultBorder};] {id} .cke_dialog_tab [{lightGradient}border-color:{defaultBorder};] {id} .cke_dialog_tab:hover [{mediumGradient}] {id} .cke_dialog_contents [border-top-color:{defaultBorder};] {id} .cke_dialog_tab_selected, {id} .cke_dialog_tab_selected:hover [background:{dialogTabSelected};border-bottom-color:{dialogTabSelectedBorder};] {id} .cke_dialog_body [background:{dialogBody};border-color:{defaultBorder};] {id} .cke_toolgroup [{lightGradient}border-color:{defaultBorder};] {id} a.cke_button_off:hover, {id} a.cke_button_off:focus, {id} a.cke_button_off:active [{mediumGradient}] {id} .cke_button_on [{ckeButtonOn}] {id} .cke_toolbar_separator [background-color: {ckeToolbarSeparator};] {id} .cke_combo_button [border-color:{defaultBorder};{lightGradient}] {id} a.cke_combo_button:hover, {id} a.cke_combo_button:focus, {id} .cke_combo_on a.cke_combo_button [border-color:{defaultBorder};{mediumGradient}] {id} .cke_path_item [color:{elementsPathColor};] {id} a.cke_path_item:hover, {id} a.cke_path_item:focus, {id} a.cke_path_item:active [background-color:{elementsPathBg};] {id}.cke_panel [border-color:{defaultBorder};] "),
            panel: new CKEDITOR.template(".cke_panel_grouptitle [{lightGradient}border-color:{defaultBorder};] .cke_menubutton_icon [background-color:{menubuttonIcon};] .cke_menubutton:hover .cke_menubutton_icon, .cke_menubutton:focus .cke_menubutton_icon, .cke_menubutton:active .cke_menubutton_icon [background-color:{menubuttonIconHover};] .cke_menuseparator [background-color:{menubuttonIcon};] a:hover.cke_colorbox, a:focus.cke_colorbox, a:active.cke_colorbox [border-color:{defaultBorder};] a:hover.cke_colorauto, a:hover.cke_colormore, a:focus.cke_colorauto, a:focus.cke_colormore, a:active.cke_colorauto, a:active.cke_colormore [background-color:{ckeColorauto};border-color:{defaultBorder};] ")};
        return function (b, a) {
            var e = b.uiColor, e = {id: "." + b.id, defaultBorder: c(e, -0.1), defaultGradient: f(c(e, 0.9), e), lightGradient: f(c(e, 1), c(e, 0.7)), mediumGradient: f(c(e, 0.8), c(e, 0.5)), ckeButtonOn: f(c(e, 0.6), c(e, 0.7)), ckeResizer: c(e, -0.4), ckeToolbarSeparator: c(e, 0.5), ckeColorauto: c(e, 0.8), dialogBody: c(e, 0.7), dialogTabSelected: f("#FFFFFF", "#FFFFFF"), dialogTabSelectedBorder: "#FFF", elementsPathColor: c(e, -0.6), elementsPathBg: e, menubuttonIcon: c(e, 0.5), menubuttonIconHover: c(e, 0.3)};
            return d[a].output(e).replace(/\[/g,
                "{").replace(/\]/g, "}")
        }
    }(),CKEDITOR.plugins.add("basicstyles", {init: function (c) {
        var f = 0, d = function (a, e, d, i) {
            if (i) {
                var i = new CKEDITOR.style(i), j = b[d];
                j.unshift(i);
                c.attachStyleStateChange(i, function (a) {
                    !c.readOnly && c.getCommand(d).setState(a)
                });
                c.addCommand(d, new CKEDITOR.styleCommand(i, {contentForms: j}));
                c.ui.addButton && c.ui.addButton(a, {label: e, command: d, toolbar: "basicstyles," + (f = f + 10)})
            }
        }, b = {bold: ["strong", "b", ["span", function (a) {
            a = a.styles["font-weight"];
            return a == "bold" || +a >= 700
        }]], italic: ["em",
            "i", ["span", function (a) {
                return a.styles["font-style"] == "italic"
            }]], underline: ["u", ["span", function (a) {
            return a.styles["text-decoration"] == "underline"
        }]], strike: ["s", "strike", ["span", function (a) {
            return a.styles["text-decoration"] == "line-through"
        }]], subscript: ["sub"], superscript: ["sup"]}, a = c.config, e = c.lang.basicstyles;
        d("Bold", e.bold, "bold", a.coreStyles_bold);
        d("Italic", e.italic, "italic", a.coreStyles_italic);
        d("Underline", e.underline, "underline", a.coreStyles_underline);
        d("Strike", e.strike, "strike",
            a.coreStyles_strike);
        d("Subscript", e.subscript, "subscript", a.coreStyles_subscript);
        d("Superscript", e.superscript, "superscript", a.coreStyles_superscript);
        c.setKeystroke([
            [CKEDITOR.CTRL + 66, "bold"],
            [CKEDITOR.CTRL + 73, "italic"],
            [CKEDITOR.CTRL + 85, "underline"]
        ])
    }}),CKEDITOR.config.coreStyles_bold = {element: "strong", overrides: "b"},CKEDITOR.config.coreStyles_italic = {element: "em", overrides: "i"},CKEDITOR.config.coreStyles_underline = {element: "u"},CKEDITOR.config.coreStyles_strike = {element: "s", overrides: "strike"},
    CKEDITOR.config.coreStyles_subscript = {element: "sub"},CKEDITOR.config.coreStyles_superscript = {element: "sup"},CKEDITOR.plugins.add("dialogui", {onLoad: function () {
        var c = function (a) {
            this._ || (this._ = {});
            this._["default"] = this._.initValue = a["default"] || "";
            this._.required = a.required || false;
            for (var b = [this._], c = 1; c < arguments.length; c++)b.push(arguments[c]);
            b.push(true);
            CKEDITOR.tools.extend.apply(CKEDITOR.tools, b);
            return this._
        }, f = {build: function (a, b, c) {
            return new CKEDITOR.ui.dialog.textInput(a, b, c)
        }}, d = {build: function (a, b, c) {
            return new CKEDITOR.ui.dialog[b.type](a, b, c)
        }}, b = {isChanged: function () {
            return this.getValue() != this.getInitValue()
        }, reset: function (a) {
            this.setValue(this.getInitValue(), a)
        }, setInitValue: function () {
            this._.initValue = this.getValue()
        }, resetInitValue: function () {
            this._.initValue = this._["default"]
        }, getInitValue: function () {
            return this._.initValue
        }}, a = CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {onChange: function (a, b) {
            if (!this._.domOnChangeRegistered) {
                a.on("load", function () {
                    this.getInputElement().on("change",
                        function () {
                            a.parts.dialog.isVisible() && this.fire("change", {value: this.getValue()})
                        }, this)
                }, this);
                this._.domOnChangeRegistered = true
            }
            this.on("change", b)
        }}, true), e = /^on([A-Z]\w+)/, h = function (a) {
            for (var b in a)(e.test(b) || b == "title" || b == "type") && delete a[b];
            return a
        };
        CKEDITOR.tools.extend(CKEDITOR.ui.dialog, {labeledElement: function (a, b, e, d) {
            if (!(arguments.length < 4)) {
                var f = c.call(this, b);
                f.labelId = CKEDITOR.tools.getNextId() + "_label";
                this._.children = [];
                CKEDITOR.ui.dialog.uiElement.call(this, a, b, e, "div",
                    null, {role: "presentation"}, function () {
                        var c = [], e = b.required ? " cke_required" : "";
                        if (b.labelLayout != "horizontal")c.push('<label class="cke_dialog_ui_labeled_label' + e + '" ', ' id="' + f.labelId + '"', f.inputId ? ' for="' + f.inputId + '"' : "", (b.labelStyle ? ' style="' + b.labelStyle + '"' : "") + ">", b.label, "</label>", '<div class="cke_dialog_ui_labeled_content"', b.controlStyle ? ' style="' + b.controlStyle + '"' : "", ' role="radiogroup" aria-labelledby="' + f.labelId + '">', d.call(this, a, b), "</div>"); else {
                            e = {type: "hbox", widths: b.widths,
                                padding: 0, children: [
                                    {type: "html", html: '<label class="cke_dialog_ui_labeled_label' + e + '" id="' + f.labelId + '" for="' + f.inputId + '"' + (b.labelStyle ? ' style="' + b.labelStyle + '"' : "") + ">" + CKEDITOR.tools.htmlEncode(b.label) + "</span>"},
                                    {type: "html", html: '<span class="cke_dialog_ui_labeled_content"' + (b.controlStyle ? ' style="' + b.controlStyle + '"' : "") + ">" + d.call(this, a, b) + "</span>"}
                                ]};
                            CKEDITOR.dialog._.uiElementBuilders.hbox.build(a, e, c)
                        }
                        return c.join("")
                    })
            }
        }, textInput: function (a, b, e) {
            if (!(arguments.length < 3)) {
                c.call(this,
                    b);
                var d = this._.inputId = CKEDITOR.tools.getNextId() + "_textInput", f = {"class": "cke_dialog_ui_input_" + b.type, id: d, type: b.type};
                if (b.validate)this.validate = b.validate;
                if (b.maxLength)f.maxlength = b.maxLength;
                if (b.size)f.size = b.size;
                if (b.inputStyle)f.style = b.inputStyle;
                var h = this, q = false;
                a.on("load", function () {
                    h.getInputElement().on("keydown", function (a) {
                        a.data.getKeystroke() == 13 && (q = true)
                    });
                    h.getInputElement().on("keyup", function (b) {
                        if (b.data.getKeystroke() == 13 && q) {
                            a.getButton("ok") && setTimeout(function () {
                                    a.getButton("ok").click()
                                },
                                0);
                            q = false
                        }
                    }, null, null, 1E3)
                });
                CKEDITOR.ui.dialog.labeledElement.call(this, a, b, e, function () {
                    var a = ['<div class="cke_dialog_ui_input_', b.type, '" role="presentation"'];
                    b.width && a.push('style="width:' + b.width + '" ');
                    a.push("><input ");
                    f["aria-labelledby"] = this._.labelId;
                    this._.required && (f["aria-required"] = this._.required);
                    for (var c in f)a.push(c + '="' + f[c] + '" ');
                    a.push(" /></div>");
                    return a.join("")
                })
            }
        }, textarea: function (a, b, e) {
            if (!(arguments.length < 3)) {
                c.call(this, b);
                var d = this, f = this._.inputId = CKEDITOR.tools.getNextId() +
                    "_textarea", h = {};
                if (b.validate)this.validate = b.validate;
                h.rows = b.rows || 5;
                h.cols = b.cols || 20;
                h["class"] = "cke_dialog_ui_input_textarea " + (b["class"] || "");
                if (typeof b.inputStyle != "undefined")h.style = b.inputStyle;
                if (b.dir)h.dir = b.dir;
                CKEDITOR.ui.dialog.labeledElement.call(this, a, b, e, function () {
                    h["aria-labelledby"] = this._.labelId;
                    this._.required && (h["aria-required"] = this._.required);
                    var a = ['<div class="cke_dialog_ui_input_textarea" role="presentation"><textarea id="', f, '" '], b;
                    for (b in h)a.push(b + '="' +
                        CKEDITOR.tools.htmlEncode(h[b]) + '" ');
                    a.push(">", CKEDITOR.tools.htmlEncode(d._["default"]), "</textarea></div>");
                    return a.join("")
                })
            }
        }, checkbox: function (a, b, e) {
            if (!(arguments.length < 3)) {
                var d = c.call(this, b, {"default": !!b["default"]});
                if (b.validate)this.validate = b.validate;
                CKEDITOR.ui.dialog.uiElement.call(this, a, b, e, "span", null, null, function () {
                    var c = CKEDITOR.tools.extend({}, b, {id: b.id ? b.id + "_checkbox" : CKEDITOR.tools.getNextId() + "_checkbox"}, true), e = [], f = CKEDITOR.tools.getNextId() + "_label", i = {"class": "cke_dialog_ui_checkbox_input",
                        type: "checkbox", "aria-labelledby": f};
                    h(c);
                    if (b["default"])i.checked = "checked";
                    if (typeof c.inputStyle != "undefined")c.style = c.inputStyle;
                    d.checkbox = new CKEDITOR.ui.dialog.uiElement(a, c, e, "input", null, i);
                    e.push(' <label id="', f, '" for="', i.id, '"' + (b.labelStyle ? ' style="' + b.labelStyle + '"' : "") + ">", CKEDITOR.tools.htmlEncode(b.label), "</label>");
                    return e.join("")
                })
            }
        }, radio: function (a, b, e) {
            if (!(arguments.length < 3)) {
                c.call(this, b);
                if (!this._["default"])this._["default"] = this._.initValue = b.items[0][1];
                if (b.validate)this.validate =
                    b.valdiate;
                var d = [], f = this;
                CKEDITOR.ui.dialog.labeledElement.call(this, a, b, e, function () {
                    for (var c = [], e = [], i = (b.id ? b.id : CKEDITOR.tools.getNextId()) + "_radio", m = 0; m < b.items.length; m++) {
                        var r = b.items[m], t = r[2] !== void 0 ? r[2] : r[0], p = r[1] !== void 0 ? r[1] : r[0], u = CKEDITOR.tools.getNextId() + "_radio_input", s = u + "_label", u = CKEDITOR.tools.extend({}, b, {id: u, title: null, type: null}, true), t = CKEDITOR.tools.extend({}, u, {title: t}, true), x = {type: "radio", "class": "cke_dialog_ui_radio_input", name: i, value: p, "aria-labelledby": s},
                            y = [];
                        if (f._["default"] == p)x.checked = "checked";
                        h(u);
                        h(t);
                        if (typeof u.inputStyle != "undefined")u.style = u.inputStyle;
                        u.keyboardFocusable = true;
                        d.push(new CKEDITOR.ui.dialog.uiElement(a, u, y, "input", null, x));
                        y.push(" ");
                        new CKEDITOR.ui.dialog.uiElement(a, t, y, "label", null, {id: s, "for": x.id}, r[0]);
                        c.push(y.join(""))
                    }
                    new CKEDITOR.ui.dialog.hbox(a, d, c, e);
                    return e.join("")
                });
                this._.children = d
            }
        }, button: function (a, b, e) {
            if (arguments.length) {
                typeof b == "function" && (b = b(a.getParentEditor()));
                c.call(this, b, {disabled: b.disabled ||
                    false});
                CKEDITOR.event.implementOn(this);
                var d = this;
                a.on("load", function () {
                    var a = this.getElement();
                    (function () {
                        a.on("click", function (a) {
                            d.click();
                            a.data.preventDefault()
                        });
                        a.on("keydown", function (a) {
                            if (a.data.getKeystroke()in{32: 1}) {
                                d.click();
                                a.data.preventDefault()
                            }
                        })
                    })();
                    a.unselectable()
                }, this);
                var f = CKEDITOR.tools.extend({}, b);
                delete f.style;
                var h = CKEDITOR.tools.getNextId() + "_label";
                CKEDITOR.ui.dialog.uiElement.call(this, a, f, e, "a", null, {style: b.style, href: "javascript:void(0)", title: b.label, hidefocus: "true",
                    "class": b["class"], role: "button", "aria-labelledby": h}, '<span id="' + h + '" class="cke_dialog_ui_button">' + CKEDITOR.tools.htmlEncode(b.label) + "</span>")
            }
        }, select: function (a, b, e) {
            if (!(arguments.length < 3)) {
                var d = c.call(this, b);
                if (b.validate)this.validate = b.validate;
                d.inputId = CKEDITOR.tools.getNextId() + "_select";
                CKEDITOR.ui.dialog.labeledElement.call(this, a, b, e, function () {
                    var c = CKEDITOR.tools.extend({}, b, {id: b.id ? b.id + "_select" : CKEDITOR.tools.getNextId() + "_select"}, true), e = [], f = [], i = {id: d.inputId, "class": "cke_dialog_ui_input_select",
                        "aria-labelledby": this._.labelId};
                    e.push('<div class="cke_dialog_ui_input_', b.type, '" role="presentation"');
                    b.width && e.push('style="width:' + b.width + '" ');
                    e.push(">");
                    if (b.size != void 0)i.size = b.size;
                    if (b.multiple != void 0)i.multiple = b.multiple;
                    h(c);
                    for (var m = 0, r; m < b.items.length && (r = b.items[m]); m++)f.push('<option value="', CKEDITOR.tools.htmlEncode(r[1] !== void 0 ? r[1] : r[0]).replace(/"/g, "&quot;"), '" /> ', CKEDITOR.tools.htmlEncode(r[0]));
                    if (typeof c.inputStyle != "undefined")c.style = c.inputStyle;
                    d.select =
                        new CKEDITOR.ui.dialog.uiElement(a, c, e, "select", null, i, f.join(""));
                    e.push("</div>");
                    return e.join("")
                })
            }
        }, file: function (a, b, e) {
            if (!(arguments.length < 3)) {
                b["default"] === void 0 && (b["default"] = "");
                var d = CKEDITOR.tools.extend(c.call(this, b), {definition: b, buttons: []});
                if (b.validate)this.validate = b.validate;
                a.on("load", function () {
                    CKEDITOR.document.getById(d.frameId).getParent().addClass("cke_dialog_ui_input_file")
                });
                CKEDITOR.ui.dialog.labeledElement.call(this, a, b, e, function () {
                    d.frameId = CKEDITOR.tools.getNextId() +
                        "_fileInput";
                    var a = ['<iframe frameborder="0" allowtransparency="0" class="cke_dialog_ui_input_file" role="presentation" id="', d.frameId, '" title="', b.label, '" src="javascript:void('];
                    a.push(CKEDITOR.env.ie ? "(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "})()" : "0");
                    a.push(')"></iframe>');
                    return a.join("")
                })
            }
        }, fileButton: function (a, b, e) {
            if (!(arguments.length < 3)) {
                c.call(this, b);
                var d = this;
                if (b.validate)this.validate = b.validate;
                var f = CKEDITOR.tools.extend({},
                    b), h = f.onClick;
                f.className = (f.className ? f.className + " " : "") + "cke_dialog_ui_button";
                f.onClick = function (c) {
                    var e = b["for"];
                    if (!h || h.call(this, c) !== false) {
                        a.getContentElement(e[0], e[1]).submit();
                        this.disable()
                    }
                };
                a.on("load", function () {
                    a.getContentElement(b["for"][0], b["for"][1])._.buttons.push(d)
                });
                CKEDITOR.ui.dialog.button.call(this, a, f, e)
            }
        }, html: function () {
            var a = /^\s*<[\w:]+\s+([^>]*)?>/, b = /^(\s*<[\w:]+(?:\s+[^>]*)?)((?:.|\r|\n)+)$/, c = /\/$/;
            return function (e, d, f) {
                if (!(arguments.length < 3)) {
                    var h = [],
                        l = d.html;
                    l.charAt(0) != "<" && (l = "<span>" + l + "</span>");
                    var m = d.focus;
                    if (m) {
                        var r = this.focus;
                        this.focus = function () {
                            (typeof m == "function" ? m : r).call(this);
                            this.fire("focus")
                        };
                        if (d.isFocusable)this.isFocusable = this.isFocusable;
                        this.keyboardFocusable = true
                    }
                    CKEDITOR.ui.dialog.uiElement.call(this, e, d, h, "span", null, null, "");
                    h = h.join("").match(a);
                    l = l.match(b) || ["", "", ""];
                    if (c.test(l[1])) {
                        l[1] = l[1].slice(0, -1);
                        l[2] = "/" + l[2]
                    }
                    f.push([l[1], " ", h[1] || "", l[2]].join(""))
                }
            }
        }(), fieldset: function (a, b, c, e, d) {
            var f = d.label;
            this._ = {children: b};
            CKEDITOR.ui.dialog.uiElement.call(this, a, d, e, "fieldset", null, null, function () {
                var a = [];
                f && a.push("<legend" + (d.labelStyle ? ' style="' + d.labelStyle + '"' : "") + ">" + f + "</legend>");
                for (var b = 0; b < c.length; b++)a.push(c[b]);
                return a.join("")
            })
        }}, true);
        CKEDITOR.ui.dialog.html.prototype = new CKEDITOR.ui.dialog.uiElement;
        CKEDITOR.ui.dialog.labeledElement.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {setLabel: function (a) {
            var b = CKEDITOR.document.getById(this._.labelId);
            b.getChildCount() <
            1 ? (new CKEDITOR.dom.text(a, CKEDITOR.document)).appendTo(b) : b.getChild(0).$.nodeValue = a;
            return this
        }, getLabel: function () {
            var a = CKEDITOR.document.getById(this._.labelId);
            return!a || a.getChildCount() < 1 ? "" : a.getChild(0).getText()
        }, eventProcessors: a}, true);
        CKEDITOR.ui.dialog.button.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {click: function () {
            return!this._.disabled ? this.fire("click", {dialog: this._.dialog}) : false
        }, enable: function () {
            this._.disabled = false;
            var a = this.getElement();
            a && a.removeClass("cke_disabled")
        },
            disable: function () {
                this._.disabled = true;
                this.getElement().addClass("cke_disabled")
            }, isVisible: function () {
                return this.getElement().getFirst().isVisible()
            }, isEnabled: function () {
                return!this._.disabled
            }, eventProcessors: CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {onClick: function (a, b) {
                this.on("click", function () {
                    b.apply(this, arguments)
                })
            }}, true), accessKeyUp: function () {
                this.click()
            }, accessKeyDown: function () {
                this.focus()
            }, keyboardFocusable: true}, true);
        CKEDITOR.ui.dialog.textInput.prototype =
            CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {getInputElement: function () {
                return CKEDITOR.document.getById(this._.inputId)
            }, focus: function () {
                var a = this.selectParentTab();
                setTimeout(function () {
                    var b = a.getInputElement();
                    b && b.$.focus()
                }, 0)
            }, select: function () {
                var a = this.selectParentTab();
                setTimeout(function () {
                    var b = a.getInputElement();
                    if (b) {
                        b.$.focus();
                        b.$.select()
                    }
                }, 0)
            }, accessKeyUp: function () {
                this.select()
            }, setValue: function (a) {
                !a && (a = "");
                return CKEDITOR.ui.dialog.uiElement.prototype.setValue.apply(this,
                    arguments)
            }, keyboardFocusable: true}, b, true);
        CKEDITOR.ui.dialog.textarea.prototype = new CKEDITOR.ui.dialog.textInput;
        CKEDITOR.ui.dialog.select.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {getInputElement: function () {
            return this._.select.getElement()
        }, add: function (a, b, c) {
            var e = new CKEDITOR.dom.element("option", this.getDialog().getParentEditor().document), d = this.getInputElement().$;
            e.$.text = a;
            e.$.value = b === void 0 || b === null ? a : b;
            c === void 0 || c === null ? CKEDITOR.env.ie ? d.add(e.$) : d.add(e.$,
                null) : d.add(e.$, c);
            return this
        }, remove: function (a) {
            this.getInputElement().$.remove(a);
            return this
        }, clear: function () {
            for (var a = this.getInputElement().$; a.length > 0;)a.remove(0);
            return this
        }, keyboardFocusable: true}, b, true);
        CKEDITOR.ui.dialog.checkbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {getInputElement: function () {
            return this._.checkbox.getElement()
        }, setValue: function (a, b) {
            this.getInputElement().$.checked = a;
            !b && this.fire("change", {value: a})
        }, getValue: function () {
            return this.getInputElement().$.checked
        },
            accessKeyUp: function () {
                this.setValue(!this.getValue())
            }, eventProcessors: {onChange: function (b, c) {
                if (!CKEDITOR.env.ie || CKEDITOR.env.version > 8)return a.onChange.apply(this, arguments);
                b.on("load", function () {
                    var a = this._.checkbox.getElement();
                    a.on("propertychange", function (b) {
                        b = b.data.$;
                        b.propertyName == "checked" && this.fire("change", {value: a.$.checked})
                    }, this)
                }, this);
                this.on("change", c);
                return null
            }}, keyboardFocusable: true}, b, true);
        CKEDITOR.ui.dialog.radio.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement,
            {setValue: function (a, b) {
                for (var c = this._.children, e, d = 0; d < c.length && (e = c[d]); d++)e.getElement().$.checked = e.getValue() == a;
                !b && this.fire("change", {value: a})
            }, getValue: function () {
                for (var a = this._.children, b = 0; b < a.length; b++)if (a[b].getElement().$.checked)return a[b].getValue();
                return null
            }, accessKeyUp: function () {
                var a = this._.children, b;
                for (b = 0; b < a.length; b++)if (a[b].getElement().$.checked) {
                    a[b].getElement().focus();
                    return
                }
                a[0].getElement().focus()
            }, eventProcessors: {onChange: function (b, c) {
                if (CKEDITOR.env.ie) {
                    b.on("load",
                        function () {
                            for (var a = this._.children, b = this, c = 0; c < a.length; c++)a[c].getElement().on("propertychange", function (a) {
                                a = a.data.$;
                                a.propertyName == "checked" && this.$.checked && b.fire("change", {value: this.getAttribute("value")})
                            })
                        }, this);
                    this.on("change", c)
                } else return a.onChange.apply(this, arguments);
                return null
            }}}, b, true);
        CKEDITOR.ui.dialog.file.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, b, {getInputElement: function () {
            var a = CKEDITOR.document.getById(this._.frameId).getFrameDocument();
            return a.$.forms.length > 0 ? new CKEDITOR.dom.element(a.$.forms[0].elements[0]) : this.getElement()
        }, submit: function () {
            this.getInputElement().getParent().$.submit();
            return this
        }, getAction: function () {
            return this.getInputElement().getParent().$.action
        }, registerEvents: function (a) {
            var b = /^on([A-Z]\w+)/, c, e = function (a, b, c, e) {
                a.on("formLoaded", function () {
                    a.getInputElement().on(c, e, a)
                })
            }, d;
            for (d in a)if (c = d.match(b))this.eventProcessors[d] ? this.eventProcessors[d].call(this, this._.dialog, a[d]) : e(this, this._.dialog,
                c[1].toLowerCase(), a[d]);
            return this
        }, reset: function () {
            function a() {
                c.$.open();
                var k = "";
                e.size && (k = e.size - (CKEDITOR.env.ie ? 7 : 0));
                var t = b.frameId + "_input";
                c.$.write(['<html dir="' + l + '" lang="' + m + '"><head><title></title></head><body style="margin: 0; overflow: hidden; background: transparent;">', '<form enctype="multipart/form-data" method="POST" dir="' + l + '" lang="' + m + '" action="', CKEDITOR.tools.htmlEncode(e.action), '"><label id="', b.labelId, '" for="', t, '" style="display:none">', CKEDITOR.tools.htmlEncode(e.label),
                    '</label><input style="width:100%" id="', t, '" aria-labelledby="', b.labelId, '" type="file" name="', CKEDITOR.tools.htmlEncode(e.id || "cke_upload"), '" size="', CKEDITOR.tools.htmlEncode(k > 0 ? k : ""), '" /></form></body></html><script>', CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain + ")();" : "", "window.parent.CKEDITOR.tools.callFunction(" + f + ");", "window.onbeforeunload = function() {window.parent.CKEDITOR.tools.callFunction(" + h + ")}", "<\/script>"].join(""));
                c.$.close();
                for (k = 0; k < d.length; k++)d[k].enable()
            }

            var b =
                this._, c = CKEDITOR.document.getById(b.frameId).getFrameDocument(), e = b.definition, d = b.buttons, f = this.formLoadedNumber, h = this.formUnloadNumber, l = b.dialog._.editor.lang.dir, m = b.dialog._.editor.langCode;
            if (!f) {
                f = this.formLoadedNumber = CKEDITOR.tools.addFunction(function () {
                    this.fire("formLoaded")
                }, this);
                h = this.formUnloadNumber = CKEDITOR.tools.addFunction(function () {
                    this.getInputElement().clearCustomData()
                }, this);
                this.getDialog()._.editor.on("destroy", function () {
                    CKEDITOR.tools.removeFunction(f);
                    CKEDITOR.tools.removeFunction(h)
                })
            }
            CKEDITOR.env.gecko ?
                setTimeout(a, 500) : a()
        }, getValue: function () {
            return this.getInputElement().$.value || ""
        }, setInitValue: function () {
            this._.initValue = ""
        }, eventProcessors: {onChange: function (a, b) {
            if (!this._.domOnChangeRegistered) {
                this.on("formLoaded", function () {
                    this.getInputElement().on("change", function () {
                        this.fire("change", {value: this.getValue()})
                    }, this)
                }, this);
                this._.domOnChangeRegistered = true
            }
            this.on("change", b)
        }}, keyboardFocusable: true}, true);
        CKEDITOR.ui.dialog.fileButton.prototype = new CKEDITOR.ui.dialog.button;
        CKEDITOR.ui.dialog.fieldset.prototype =
            CKEDITOR.tools.clone(CKEDITOR.ui.dialog.hbox.prototype);
        CKEDITOR.dialog.addUIElement("text", f);
        CKEDITOR.dialog.addUIElement("password", f);
        CKEDITOR.dialog.addUIElement("textarea", d);
        CKEDITOR.dialog.addUIElement("checkbox", d);
        CKEDITOR.dialog.addUIElement("radio", d);
        CKEDITOR.dialog.addUIElement("button", d);
        CKEDITOR.dialog.addUIElement("select", d);
        CKEDITOR.dialog.addUIElement("file", d);
        CKEDITOR.dialog.addUIElement("fileButton", d);
        CKEDITOR.dialog.addUIElement("html", d);
        CKEDITOR.dialog.addUIElement("fieldset",
            {build: function (a, b, c) {
                for (var e = b.children, d, f = [], h = [], l = 0; l < e.length && (d = e[l]); l++) {
                    var m = [];
                    f.push(m);
                    h.push(CKEDITOR.dialog._.uiElementBuilders[d.type].build(a, d, m))
                }
                return new CKEDITOR.ui.dialog[b.type](a, h, f, c, b)
            }})
    }}),CKEDITOR.DIALOG_RESIZE_NONE = 0,CKEDITOR.DIALOG_RESIZE_WIDTH = 1,CKEDITOR.DIALOG_RESIZE_HEIGHT = 2,CKEDITOR.DIALOG_RESIZE_BOTH = 3,function () {
        function c() {
            for (var a = this._.tabIdList.length, b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId) + a, c = b - 1; c > b - a; c--)if (this._.tabs[this._.tabIdList[c %
                a]][0].$.offsetHeight)return this._.tabIdList[c % a];
            return null
        }

        function f() {
            for (var a = this._.tabIdList.length, b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId), c = b + 1; c < b + a; c++)if (this._.tabs[this._.tabIdList[c % a]][0].$.offsetHeight)return this._.tabIdList[c % a];
            return null
        }

        function d(a, b) {
            for (var c = a.$.getElementsByTagName("input"), e = 0, d = c.length; e < d; e++) {
                var f = new CKEDITOR.dom.element(c[e]);
                if (f.getAttribute("type").toLowerCase() == "text")if (b) {
                    f.setAttribute("value", f.getCustomData("fake_value") ||
                        "");
                    f.removeCustomData("fake_value")
                } else {
                    f.setCustomData("fake_value", f.getAttribute("value"));
                    f.setAttribute("value", "")
                }
            }
        }

        function b(a, b) {
            var c = this.getInputElement();
            c && (a ? c.removeAttribute("aria-invalid") : c.setAttribute("aria-invalid", true));
            a || (this.select ? this.select() : this.focus());
            b && alert(b);
            this.fire("validated", {valid: a, msg: b})
        }

        function a() {
            var a = this.getInputElement();
            a && a.removeAttribute("aria-invalid")
        }

        function e(a) {
            var a = CKEDITOR.dom.element.createFromHtml(CKEDITOR.addTemplate("dialog",
                m).output({id: CKEDITOR.tools.getNextNumber(), editorId: a.id, langDir: a.lang.dir, langCode: a.langCode, editorDialogClass: "cke_editor_" + a.name.replace(/\./g, "\\.") + "_dialog", closeTitle: a.lang.common.close, hidpi: CKEDITOR.env.hidpi ? "cke_hidpi" : ""})), b = a.getChild([0, 0, 0, 0, 0]), c = b.getChild(0), e = b.getChild(1);
            if (CKEDITOR.env.ie && !CKEDITOR.env.quirks) {
                var d = "javascript:void(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "}())";
                CKEDITOR.dom.element.createFromHtml('<iframe frameBorder="0" class="cke_iframe_shim" src="' +
                    d + '" tabIndex="-1"></iframe>').appendTo(b.getParent())
            }
            c.unselectable();
            e.unselectable();
            return{element: a, parts: {dialog: a.getChild(0), title: c, close: e, tabs: b.getChild(2), contents: b.getChild([3, 0, 0, 0]), footer: b.getChild([3, 0, 1, 0])}}
        }

        function h(a, b, c) {
            this.element = b;
            this.focusIndex = c;
            this.tabIndex = 0;
            this.isFocusable = function () {
                return!b.getAttribute("disabled") && b.isVisible()
            };
            this.focus = function () {
                a._.currentFocusIndex = this.focusIndex;
                this.element.focus()
            };
            b.on("keydown", function (a) {
                a.data.getKeystroke()in
                {32: 1, 13: 1} && this.fire("click")
            });
            b.on("focus", function () {
                this.fire("mouseover")
            });
            b.on("blur", function () {
                this.fire("mouseout")
            })
        }

        function k(a) {
            function b() {
                a.layout()
            }

            var c = CKEDITOR.document.getWindow();
            c.on("resize", b);
            a.on("hide", function () {
                c.removeListener("resize", b)
            })
        }

        function g(a, b) {
            this._ = {dialog: a};
            CKEDITOR.tools.extend(this, b)
        }

        function i(a) {
            function b(c) {
                var i = a.getSize(), k = CKEDITOR.document.getWindow().getViewPaneSize(), j = c.data.$.screenX, C = c.data.$.screenY, l = j - e.x, n = C - e.y;
                e = {x: j, y: C};
                d.x = d.x + l;
                d.y = d.y + n;
                a.move(d.x + h[3] < g ? -h[3] : d.x - h[1] > k.width - i.width - g ? k.width - i.width + (f.lang.dir == "rtl" ? 0 : h[1]) : d.x, d.y + h[0] < g ? -h[0] : d.y - h[2] > k.height - i.height - g ? k.height - i.height + h[2] : d.y, 1);
                c.data.preventDefault()
            }

            function c() {
                CKEDITOR.document.removeListener("mousemove", b);
                CKEDITOR.document.removeListener("mouseup", c);
                if (CKEDITOR.env.ie6Compat) {
                    var a = v.getChild(0).getFrameDocument();
                    a.removeListener("mousemove", b);
                    a.removeListener("mouseup", c)
                }
            }

            var e = null, d = null;
            a.getElement().getFirst();
            var f =
                a.getParentEditor(), g = f.config.dialog_magnetDistance, h = CKEDITOR.skin.margins || [0, 0, 0, 0];
            typeof g == "undefined" && (g = 20);
            a.parts.title.on("mousedown", function (f) {
                e = {x: f.data.$.screenX, y: f.data.$.screenY};
                CKEDITOR.document.on("mousemove", b);
                CKEDITOR.document.on("mouseup", c);
                d = a.getPosition();
                if (CKEDITOR.env.ie6Compat) {
                    var g = v.getChild(0).getFrameDocument();
                    g.on("mousemove", b);
                    g.on("mouseup", c)
                }
                f.data.preventDefault()
            }, a)
        }

        function j(a) {
            var b, c;

            function e(d) {
                var n = h.lang.dir == "rtl", m = l.width, D = l.height,
                    p = m + (d.data.$.screenX - b) * (n ? -1 : 1) * (a._.moved ? 1 : 2), z = D + (d.data.$.screenY - c) * (a._.moved ? 1 : 2), o = a._.element.getFirst(), o = n && o.getComputedStyle("right"), r = a.getPosition();
                r.y + z > j.height && (z = j.height - r.y);
                if ((n ? o : r.x) + p > j.width)p = j.width - (n ? o : r.x);
                if (g == CKEDITOR.DIALOG_RESIZE_WIDTH || g == CKEDITOR.DIALOG_RESIZE_BOTH)m = Math.max(f.minWidth || 0, p - i);
                if (g == CKEDITOR.DIALOG_RESIZE_HEIGHT || g == CKEDITOR.DIALOG_RESIZE_BOTH)D = Math.max(f.minHeight || 0, z - k);
                a.resize(m, D);
                a._.moved || a.layout();
                d.data.preventDefault()
            }

            function d() {
                CKEDITOR.document.removeListener("mouseup",
                    d);
                CKEDITOR.document.removeListener("mousemove", e);
                if (n) {
                    n.remove();
                    n = null
                }
                if (CKEDITOR.env.ie6Compat) {
                    var a = v.getChild(0).getFrameDocument();
                    a.removeListener("mouseup", d);
                    a.removeListener("mousemove", e)
                }
            }

            var f = a.definition, g = f.resizable;
            if (g != CKEDITOR.DIALOG_RESIZE_NONE) {
                var h = a.getParentEditor(), i, k, j, l, n, m = CKEDITOR.tools.addFunction(function (f) {
                    l = a.getSize();
                    var g = a.parts.contents;
                    if (g.$.getElementsByTagName("iframe").length) {
                        n = CKEDITOR.dom.element.createFromHtml('<div class="cke_dialog_resize_cover" style="height: 100%; position: absolute; width: 100%;"></div>');
                        g.append(n)
                    }
                    k = l.height - a.parts.contents.getSize("height", !(CKEDITOR.env.gecko || CKEDITOR.env.ie && CKEDITOR.env.quirks));
                    i = l.width - a.parts.contents.getSize("width", 1);
                    b = f.screenX;
                    c = f.screenY;
                    j = CKEDITOR.document.getWindow().getViewPaneSize();
                    CKEDITOR.document.on("mousemove", e);
                    CKEDITOR.document.on("mouseup", d);
                    if (CKEDITOR.env.ie6Compat) {
                        g = v.getChild(0).getFrameDocument();
                        g.on("mousemove", e);
                        g.on("mouseup", d)
                    }
                    f.preventDefault && f.preventDefault()
                });
                a.on("load", function () {
                    var b = "";
                    g == CKEDITOR.DIALOG_RESIZE_WIDTH ?
                        b = " cke_resizer_horizontal" : g == CKEDITOR.DIALOG_RESIZE_HEIGHT && (b = " cke_resizer_vertical");
                    b = CKEDITOR.dom.element.createFromHtml('<div class="cke_resizer' + b + " cke_resizer_" + h.lang.dir + '" title="' + CKEDITOR.tools.htmlEncode(h.lang.common.resize) + '" onmousedown="CKEDITOR.tools.callFunction(' + m + ', event )">' + (h.lang.dir == "ltr" ? "◢" : "◣") + "</div>");
                    a.parts.footer.append(b, 1)
                });
                h.on("destroy", function () {
                    CKEDITOR.tools.removeFunction(m)
                })
            }
        }

        function n(a) {
            a.data.preventDefault(1)
        }

        function o(a) {
            var b = CKEDITOR.document.getWindow(),
                c = a.config, e = c.dialog_backgroundCoverColor || "white", d = c.dialog_backgroundCoverOpacity, f = c.baseFloatZIndex, c = CKEDITOR.tools.genKey(e, d, f), g = y[c];
            if (g)g.show(); else {
                f = ['<div tabIndex="-1" style="position: ', CKEDITOR.env.ie6Compat ? "absolute" : "fixed", "; z-index: ", f, "; top: 0px; left: 0px; ", !CKEDITOR.env.ie6Compat ? "background-color: " + e : "", '" class="cke_dialog_background_cover">'];
                if (CKEDITOR.env.ie6Compat) {
                    e = "<html><body style=\\'background-color:" + e + ";\\'></body></html>";
                    f.push('<iframe hidefocus="true" frameborder="0" id="cke_dialog_background_iframe" src="javascript:');
                    f.push("void((function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.write( '" + e + "' );document.close();") + "})())");
                    f.push('" style="position:absolute;left:0;top:0;width:100%;height: 100%;filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0)"></iframe>')
                }
                f.push("</div>");
                g = CKEDITOR.dom.element.createFromHtml(f.join(""));
                g.setOpacity(d != void 0 ? d : 0.5);
                g.on("keydown", n);
                g.on("keypress", n);
                g.on("keyup", n);
                g.appendTo(CKEDITOR.document.getBody());
                y[c] = g
            }
            a.focusManager.add(g);
            v = g;
            var a = function () {
                var a = b.getViewPaneSize();
                g.setStyles({width: a.width + "px", height: a.height + "px"})
            }, h = function () {
                var a = b.getScrollPosition(), c = CKEDITOR.dialog._.currentTop;
                g.setStyles({left: a.x + "px", top: a.y + "px"});
                if (c) {
                    do {
                        a = c.getPosition();
                        c.move(a.x, a.y)
                    } while (c = c._.parentDialog)
                }
            };
            x = a;
            b.on("resize", a);
            a();
            (!CKEDITOR.env.mac || !CKEDITOR.env.webkit) && g.focus();
            if (CKEDITOR.env.ie6Compat) {
                var i = function () {
                    h();
                    arguments.callee.prevScrollHandler.apply(this, arguments)
                };
                b.$.setTimeout(function () {
                    i.prevScrollHandler =
                        window.onscroll || function () {
                    };
                    window.onscroll = i
                }, 0);
                h()
            }
        }

        function q(a) {
            if (v) {
                a.focusManager.remove(v);
                a = CKEDITOR.document.getWindow();
                v.hide();
                a.removeListener("resize", x);
                CKEDITOR.env.ie6Compat && a.$.setTimeout(function () {
                    window.onscroll = window.onscroll && window.onscroll.prevScrollHandler || null
                }, 0);
                x = null
            }
        }

        var l = CKEDITOR.tools.cssLength, m = '<div class="cke_reset_all {editorId} {editorDialogClass} {hidpi}" dir="{langDir}" lang="{langCode}" role="dialog" aria-labelledby="cke_dialog_title_{id}"><table class="cke_dialog ' +
            CKEDITOR.env.cssClass + ' cke_{langDir}" style="position:absolute" role="presentation"><tr><td role="presentation"><div class="cke_dialog_body" role="presentation"><div id="cke_dialog_title_{id}" class="cke_dialog_title" role="presentation"></div><a id="cke_dialog_close_button_{id}" class="cke_dialog_close_button" href="javascript:void(0)" title="{closeTitle}" role="button"><span class="cke_label">X</span></a><div id="cke_dialog_tabs_{id}" class="cke_dialog_tabs" role="tablist"></div><table class="cke_dialog_contents" role="presentation"><tr><td id="cke_dialog_contents_{id}" class="cke_dialog_contents_body" role="presentation"></td></tr><tr><td id="cke_dialog_footer_{id}" class="cke_dialog_footer" role="presentation"></td></tr></table></div></td></tr></table></div>';
        CKEDITOR.dialog = function (d, g) {
            function h() {
                var a = B._.focusList;
                a.sort(function (a, b) {
                    return a.tabIndex != b.tabIndex ? b.tabIndex - a.tabIndex : a.focusIndex - b.focusIndex
                });
                for (var b = a.length, c = 0; c < b; c++)a[c].focusIndex = c
            }

            function k(a) {
                var b = B._.focusList, a = a || 0;
                if (!(b.length < 1)) {
                    var c = B._.currentFocusIndex;
                    try {
                        b[c].getInputElement().$.blur()
                    } catch (e) {
                    }
                    for (var d = c = (c + a + b.length) % b.length; a && !b[d].isFocusable();) {
                        d = (d + a + b.length) % b.length;
                        if (d == c)break
                    }
                    b[d].focus();
                    b[d].type == "text" && b[d].select()
                }
            }

            function l(a) {
                if (B ==
                    CKEDITOR.dialog._.currentTop) {
                    var b = a.data.getKeystroke(), e = d.lang.dir == "rtl";
                    t = q = 0;
                    if (b == 9 || b == CKEDITOR.SHIFT + 9) {
                        b = b == CKEDITOR.SHIFT + 9;
                        if (B._.tabBarMode) {
                            b = b ? c.call(B) : f.call(B);
                            B.selectPage(b);
                            B._.tabs[b][0].focus()
                        } else k(b ? -1 : 1);
                        t = 1
                    } else if (b == CKEDITOR.ALT + 121 && !B._.tabBarMode && B.getPageCount() > 1) {
                        B._.tabBarMode = true;
                        B._.tabs[B._.currentTabId][0].focus();
                        t = 1
                    } else if ((b == 37 || b == 39) && B._.tabBarMode) {
                        b = b == (e ? 39 : 37) ? c.call(B) : f.call(B);
                        B.selectPage(b);
                        B._.tabs[b][0].focus();
                        t = 1
                    } else if ((b == 13 || b ==
                        32) && B._.tabBarMode) {
                        this.selectPage(this._.currentTabId);
                        this._.tabBarMode = false;
                        this._.currentFocusIndex = -1;
                        k(1);
                        t = 1
                    } else if (b == 13) {
                        b = a.data.getTarget();
                        if (!b.is("a", "button", "select", "textarea") && (!b.is("input") || b.$.type != "button")) {
                            (b = this.getButton("ok")) && CKEDITOR.tools.setTimeout(b.click, 0, b);
                            t = 1
                        }
                        q = 1
                    } else if (b == 27) {
                        (b = this.getButton("cancel")) ? CKEDITOR.tools.setTimeout(b.click, 0, b) : this.fire("cancel", {hide: true}).hide !== false && this.hide();
                        q = 1
                    } else return;
                    n(a)
                }
            }

            function n(a) {
                t ? a.data.preventDefault(1) :
                    q && a.data.stopPropagation()
            }

            var m = CKEDITOR.dialog._.dialogDefinitions[g], D = CKEDITOR.tools.clone(r), p = d.config.dialog_buttonsOrder || "OS", z = d.lang.dir, o = {}, t, q;
            (p == "OS" && CKEDITOR.env.mac || p == "rtl" && z == "ltr" || p == "ltr" && z == "rtl") && D.buttons.reverse();
            m = CKEDITOR.tools.extend(m(d), D);
            m = CKEDITOR.tools.clone(m);
            m = new s(this, m);
            D = e(d);
            this._ = {editor: d, element: D.element, name: g, contentSize: {width: 0, height: 0}, size: {width: 0, height: 0}, contents: {}, buttons: {}, accessKeyMap: {}, tabs: {}, tabIdList: [], currentTabId: null,
                currentTabIndex: null, pageCount: 0, lastTab: null, tabBarMode: false, focusList: [], currentFocusIndex: 0, hasFocus: false};
            this.parts = D.parts;
            CKEDITOR.tools.setTimeout(function () {
                d.fire("ariaWidget", this.parts.contents)
            }, 0, this);
            D = {position: CKEDITOR.env.ie6Compat ? "absolute" : "fixed", top: 0, visibility: "hidden"};
            D[z == "rtl" ? "right" : "left"] = 0;
            this.parts.dialog.setStyles(D);
            CKEDITOR.event.call(this);
            this.definition = m = CKEDITOR.fire("dialogDefinition", {name: g, definition: m}, d).definition;
            if (!("removeDialogTabs"in d._) &&
                d.config.removeDialogTabs) {
                D = d.config.removeDialogTabs.split(";");
                for (z = 0; z < D.length; z++) {
                    p = D[z].split(":");
                    if (p.length == 2) {
                        var u = p[0];
                        o[u] || (o[u] = []);
                        o[u].push(p[1])
                    }
                }
                d._.removeDialogTabs = o
            }
            if (d._.removeDialogTabs && (o = d._.removeDialogTabs[g]))for (z = 0; z < o.length; z++)m.removeContents(o[z]);
            if (m.onLoad)this.on("load", m.onLoad);
            if (m.onShow)this.on("show", m.onShow);
            if (m.onHide)this.on("hide", m.onHide);
            if (m.onOk)this.on("ok", function (a) {
                d.fire("saveSnapshot");
                setTimeout(function () {
                        d.fire("saveSnapshot")
                    },
                    0);
                if (m.onOk.call(this, a) === false)a.data.hide = false
            });
            if (m.onCancel)this.on("cancel", function (a) {
                if (m.onCancel.call(this, a) === false)a.data.hide = false
            });
            var B = this, x = function (a) {
                var b = B._.contents, c = false, e;
                for (e in b)for (var d in b[e])if (c = a.call(this, b[e][d]))return
            };
            this.on("ok", function (a) {
                x(function (c) {
                    if (c.validate) {
                        var e = c.validate(this), d = typeof e == "string" || e === false;
                        if (d) {
                            a.data.hide = false;
                            a.stop()
                        }
                        b.call(c, !d, typeof e == "string" ? e : void 0);
                        return d
                    }
                })
            }, this, null, 0);
            this.on("cancel", function (a) {
                x(function (b) {
                    if (b.isChanged()) {
                        if (!d.config.dialog_noConfirmCancel && !confirm(d.lang.common.confirmCancel))a.data.hide = false;
                        return true
                    }
                })
            }, this, null, 0);
            this.parts.close.on("click", function (a) {
                this.fire("cancel", {hide: true}).hide !== false && this.hide();
                a.data.preventDefault()
            }, this);
            this.changeFocus = k;
            var y = this._.element;
            d.focusManager.add(y, 1);
            this.on("show", function () {
                y.on("keydown", l, this);
                if (CKEDITOR.env.gecko)y.on("keypress", n, this)
            });
            this.on("hide", function () {
                y.removeListener("keydown", l);
                CKEDITOR.env.gecko && y.removeListener("keypress", n);
                x(function (b) {
                    a.apply(b)
                })
            });
            this.on("iframeAdded", function (a) {
                (new CKEDITOR.dom.document(a.data.iframe.$.contentWindow.document)).on("keydown", l, this, null, 0)
            });
            this.on("show", function () {
                h();
                if (d.config.dialog_startupFocusTab && B._.pageCount > 1) {
                    B._.tabBarMode = true;
                    B._.tabs[B._.currentTabId][0].focus()
                } else if (!this._.hasFocus) {
                    this._.currentFocusIndex = -1;
                    if (m.onFocus) {
                        var a = m.onFocus.call(this);
                        a && a.focus()
                    } else k(1)
                }
            }, this, null, 4294967295);
            if (CKEDITOR.env.ie6Compat)this.on("load", function () {
                var a = this.getElement(), b = a.getFirst();
                b.remove();
                b.appendTo(a)
            }, this);
            i(this);
            j(this);
            (new CKEDITOR.dom.text(m.title, CKEDITOR.document)).appendTo(this.parts.title);
            for (z = 0; z < m.contents.length; z++)(o = m.contents[z]) && this.addPage(o);
            this.parts.tabs.on("click", function (a) {
                var b = a.data.getTarget();
                if (b.hasClass("cke_dialog_tab")) {
                    b = b.$.id;
                    this.selectPage(b.substring(4, b.lastIndexOf("_")));
                    if (this._.tabBarMode) {
                        this._.tabBarMode = false;
                        this._.currentFocusIndex = -1;
                        k(1)
                    }
                    a.data.preventDefault()
                }
            }, this);
            z = [];
            o = CKEDITOR.dialog._.uiElementBuilders.hbox.build(this,
                {type: "hbox", className: "cke_dialog_footer_buttons", widths: [], children: m.buttons}, z).getChild();
            this.parts.footer.setHtml(z.join(""));
            for (z = 0; z < o.length; z++)this._.buttons[o[z].id] = o[z]
        };
        CKEDITOR.dialog.prototype = {destroy: function () {
            this.hide();
            this._.element.remove()
        }, resize: function () {
            return function (a, b) {
                if (!this._.contentSize || !(this._.contentSize.width == a && this._.contentSize.height == b)) {
                    CKEDITOR.dialog.fire("resize", {dialog: this, width: a, height: b}, this._.editor);
                    this.fire("resize", {width: a, height: b},
                        this._.editor);
                    this.parts.contents.setStyles({width: a + "px", height: b + "px"});
                    if (this._.editor.lang.dir == "rtl" && this._.position)this._.position.x = CKEDITOR.document.getWindow().getViewPaneSize().width - this._.contentSize.width - parseInt(this._.element.getFirst().getStyle("right"), 10);
                    this._.contentSize = {width: a, height: b}
                }
            }
        }(), getSize: function () {
            var a = this._.element.getFirst();
            return{width: a.$.offsetWidth || 0, height: a.$.offsetHeight || 0}
        }, move: function (a, b, c) {
            var e = this._.element.getFirst(), d = this._.editor.lang.dir ==
                "rtl", f = e.getComputedStyle("position") == "fixed";
            CKEDITOR.env.ie && e.setStyle("zoom", "100%");
            if (!f || !this._.position || !(this._.position.x == a && this._.position.y == b)) {
                this._.position = {x: a, y: b};
                if (!f) {
                    f = CKEDITOR.document.getWindow().getScrollPosition();
                    a = a + f.x;
                    b = b + f.y
                }
                if (d) {
                    f = this.getSize();
                    a = CKEDITOR.document.getWindow().getViewPaneSize().width - f.width - a
                }
                b = {top: (b > 0 ? b : 0) + "px"};
                b[d ? "right" : "left"] = (a > 0 ? a : 0) + "px";
                e.setStyles(b);
                c && (this._.moved = 1)
            }
        }, getPosition: function () {
            return CKEDITOR.tools.extend({},
                this._.position)
        }, show: function () {
            var a = this._.element, b = this.definition;
            !a.getParent() || !a.getParent().equals(CKEDITOR.document.getBody()) ? a.appendTo(CKEDITOR.document.getBody()) : a.setStyle("display", "block");
            this.resize(this._.contentSize && this._.contentSize.width || b.width || b.minWidth, this._.contentSize && this._.contentSize.height || b.height || b.minHeight);
            this.reset();
            this.selectPage(this.definition.contents[0].id);
            if (CKEDITOR.dialog._.currentZIndex === null)CKEDITOR.dialog._.currentZIndex = this._.editor.config.baseFloatZIndex;
            this._.element.getFirst().setStyle("z-index", CKEDITOR.dialog._.currentZIndex = CKEDITOR.dialog._.currentZIndex + 10);
            if (CKEDITOR.dialog._.currentTop === null) {
                CKEDITOR.dialog._.currentTop = this;
                this._.parentDialog = null;
                o(this._.editor)
            } else {
                this._.parentDialog = CKEDITOR.dialog._.currentTop;
                this._.parentDialog.getElement().getFirst().$.style.zIndex -= Math.floor(this._.editor.config.baseFloatZIndex / 2);
                CKEDITOR.dialog._.currentTop = this
            }
            a.on("keydown", B);
            a.on("keyup", E);
            this._.hasFocus = false;
            for (var c in b.contents)if (b.contents[c]) {
                var a =
                    b.contents[c], e = this._.tabs[a.id], d = a.requiredContent, f = 0;
                if (e) {
                    for (var g in this._.contents[a.id]) {
                        var h = this._.contents[a.id][g];
                        if (!(h.type == "hbox" || h.type == "vbox" || !h.getInputElement()))if (h.requiredContent && !this._.editor.activeFilter.check(h.requiredContent))h.disable(); else {
                            h.enable();
                            f++
                        }
                    }
                    !f || d && !this._.editor.activeFilter.check(d) ? e[0].addClass("cke_dialog_tab_disabled") : e[0].removeClass("cke_dialog_tab_disabled")
                }
            }
            CKEDITOR.tools.setTimeout(function () {
                this.layout();
                k(this);
                this.parts.dialog.setStyle("visibility",
                    "");
                this.fireOnce("load", {});
                CKEDITOR.ui.fire("ready", this);
                this.fire("show", {});
                this._.editor.fire("dialogShow", this);
                this._.parentDialog || this._.editor.focusManager.lock();
                this.foreach(function (a) {
                    a.setInitValue && a.setInitValue()
                })
            }, 100, this)
        }, layout: function () {
            var a = this.parts.dialog, b = this.getSize(), c = CKEDITOR.document.getWindow().getViewPaneSize(), e = (c.width - b.width) / 2, d = (c.height - b.height) / 2;
            CKEDITOR.env.ie6Compat || (b.height + (d > 0 ? d : 0) > c.height || b.width + (e > 0 ? e : 0) > c.width ? a.setStyle("position",
                "absolute") : a.setStyle("position", "fixed"));
            this.move(this._.moved ? this._.position.x : e, this._.moved ? this._.position.y : d)
        }, foreach: function (a) {
            for (var b in this._.contents)for (var c in this._.contents[b])a.call(this, this._.contents[b][c]);
            return this
        }, reset: function () {
            var a = function (a) {
                a.reset && a.reset(1)
            };
            return function () {
                this.foreach(a);
                return this
            }
        }(), setupContent: function () {
            var a = arguments;
            this.foreach(function (b) {
                b.setup && b.setup.apply(b, a)
            })
        }, commitContent: function () {
            var a = arguments;
            this.foreach(function (b) {
                CKEDITOR.env.ie &&
                    this._.currentFocusIndex == b.focusIndex && b.getInputElement().$.blur();
                b.commit && b.commit.apply(b, a)
            })
        }, hide: function () {
            if (this.parts.dialog.isVisible()) {
                this.fire("hide", {});
                this._.editor.fire("dialogHide", this);
                this.selectPage(this._.tabIdList[0]);
                var a = this._.element;
                a.setStyle("display", "none");
                this.parts.dialog.setStyle("visibility", "hidden");
                for (J(this); CKEDITOR.dialog._.currentTop != this;)CKEDITOR.dialog._.currentTop.hide();
                if (this._.parentDialog) {
                    var b = this._.parentDialog.getElement().getFirst();
                    b.setStyle("z-index", parseInt(b.$.style.zIndex, 10) + Math.floor(this._.editor.config.baseFloatZIndex / 2))
                } else q(this._.editor);
                if (CKEDITOR.dialog._.currentTop = this._.parentDialog)CKEDITOR.dialog._.currentZIndex = CKEDITOR.dialog._.currentZIndex - 10; else {
                    CKEDITOR.dialog._.currentZIndex = null;
                    a.removeListener("keydown", B);
                    a.removeListener("keyup", E);
                    var c = this._.editor;
                    c.focus();
                    setTimeout(function () {
                        c.focusManager.unlock()
                    }, 0)
                }
                delete this._.parentDialog;
                this.foreach(function (a) {
                    a.resetInitValue && a.resetInitValue()
                })
            }
        },
            addPage: function (a) {
                if (!a.requiredContent || this._.editor.filter.check(a.requiredContent)) {
                    for (var b = [], c = a.label ? ' title="' + CKEDITOR.tools.htmlEncode(a.label) + '"' : "", e = CKEDITOR.dialog._.uiElementBuilders.vbox.build(this, {type: "vbox", className: "cke_dialog_page_contents", children: a.elements, expand: !!a.expand, padding: a.padding, style: a.style || "width: 100%;"}, b), d = this._.contents[a.id] = {}, f = e.getChild(), g = 0; e = f.shift();) {
                        !e.notAllowed && (e.type != "hbox" && e.type != "vbox") && g++;
                        d[e.id] = e;
                        typeof e.getChild ==
                        "function" && f.push.apply(f, e.getChild())
                    }
                    if (!g)a.hidden = true;
                    b = CKEDITOR.dom.element.createFromHtml(b.join(""));
                    b.setAttribute("role", "tabpanel");
                    e = CKEDITOR.env;
                    d = "cke_" + a.id + "_" + CKEDITOR.tools.getNextNumber();
                    c = CKEDITOR.dom.element.createFromHtml(['<a class="cke_dialog_tab"', this._.pageCount > 0 ? " cke_last" : "cke_first", c, a.hidden ? ' style="display:none"' : "", ' id="', d, '"', e.gecko && !e.hc ? "" : ' href="javascript:void(0)"', ' tabIndex="-1" hidefocus="true" role="tab">', a.label, "</a>"].join(""));
                    b.setAttribute("aria-labelledby",
                        d);
                    this._.tabs[a.id] = [c, b];
                    this._.tabIdList.push(a.id);
                    !a.hidden && this._.pageCount++;
                    this._.lastTab = c;
                    this.updateStyle();
                    b.setAttribute("name", a.id);
                    b.appendTo(this.parts.contents);
                    c.unselectable();
                    this.parts.tabs.append(c);
                    if (a.accessKey) {
                        F(this, this, "CTRL+" + a.accessKey, z, D);
                        this._.accessKeyMap["CTRL+" + a.accessKey] = a.id
                    }
                }
            }, selectPage: function (a) {
                if (this._.currentTabId != a && !this._.tabs[a][0].hasClass("cke_dialog_tab_disabled") && this.fire("selectPage", {page: a, currentPage: this._.currentTabId}) !== false) {
                    for (var b in this._.tabs) {
                        var c =
                            this._.tabs[b][0], e = this._.tabs[b][1];
                        if (b != a) {
                            c.removeClass("cke_dialog_tab_selected");
                            e.hide()
                        }
                        e.setAttribute("aria-hidden", b != a)
                    }
                    var f = this._.tabs[a];
                    f[0].addClass("cke_dialog_tab_selected");
                    if (CKEDITOR.env.ie6Compat || CKEDITOR.env.ie7Compat) {
                        d(f[1]);
                        f[1].show();
                        setTimeout(function () {
                            d(f[1], 1)
                        }, 0)
                    } else f[1].show();
                    this._.currentTabId = a;
                    this._.currentTabIndex = CKEDITOR.tools.indexOf(this._.tabIdList, a)
                }
            }, updateStyle: function () {
                this.parts.dialog[(this._.pageCount === 1 ? "add" : "remove") + "Class"]("cke_single_page")
            },
            hidePage: function (a) {
                var b = this._.tabs[a] && this._.tabs[a][0];
                if (b && this._.pageCount != 1 && b.isVisible()) {
                    a == this._.currentTabId && this.selectPage(c.call(this));
                    b.hide();
                    this._.pageCount--;
                    this.updateStyle()
                }
            }, showPage: function (a) {
                if (a = this._.tabs[a] && this._.tabs[a][0]) {
                    a.show();
                    this._.pageCount++;
                    this.updateStyle()
                }
            }, getElement: function () {
                return this._.element
            }, getName: function () {
                return this._.name
            }, getContentElement: function (a, b) {
                var c = this._.contents[a];
                return c && c[b]
            }, getValueOf: function (a, b) {
                return this.getContentElement(a,
                    b).getValue()
            }, setValueOf: function (a, b, c) {
                return this.getContentElement(a, b).setValue(c)
            }, getButton: function (a) {
                return this._.buttons[a]
            }, click: function (a) {
                return this._.buttons[a].click()
            }, disableButton: function (a) {
                return this._.buttons[a].disable()
            }, enableButton: function (a) {
                return this._.buttons[a].enable()
            }, getPageCount: function () {
                return this._.pageCount
            }, getParentEditor: function () {
                return this._.editor
            }, getSelectedElement: function () {
                return this.getParentEditor().getSelection().getSelectedElement()
            },
            addFocusable: function (a, b) {
                if (typeof b == "undefined") {
                    b = this._.focusList.length;
                    this._.focusList.push(new h(this, a, b))
                } else {
                    this._.focusList.splice(b, 0, new h(this, a, b));
                    for (var c = b + 1; c < this._.focusList.length; c++)this._.focusList[c].focusIndex++
                }
            }};
        CKEDITOR.tools.extend(CKEDITOR.dialog, {add: function (a, b) {
            if (!this._.dialogDefinitions[a] || typeof b == "function")this._.dialogDefinitions[a] = b
        }, exists: function (a) {
            return!!this._.dialogDefinitions[a]
        }, getCurrent: function () {
            return CKEDITOR.dialog._.currentTop
        },
            isTabEnabled: function (a, b, c) {
                a = a.config.removeDialogTabs;
                return!(a && a.match(RegExp("(?:^|;)" + b + ":" + c + "(?:$|;)", "i")))
            }, okButton: function () {
                var a = function (a, b) {
                    b = b || {};
                    return CKEDITOR.tools.extend({id: "ok", type: "button", label: a.lang.common.ok, "class": "cke_dialog_ui_button_ok", onClick: function (a) {
                        a = a.data.dialog;
                        a.fire("ok", {hide: true}).hide !== false && a.hide()
                    }}, b, true)
                };
                a.type = "button";
                a.override = function (b) {
                    return CKEDITOR.tools.extend(function (c) {
                        return a(c, b)
                    }, {type: "button"}, true)
                };
                return a
            }(),
            cancelButton: function () {
                var a = function (a, b) {
                    b = b || {};
                    return CKEDITOR.tools.extend({id: "cancel", type: "button", label: a.lang.common.cancel, "class": "cke_dialog_ui_button_cancel", onClick: function (a) {
                        a = a.data.dialog;
                        a.fire("cancel", {hide: true}).hide !== false && a.hide()
                    }}, b, true)
                };
                a.type = "button";
                a.override = function (b) {
                    return CKEDITOR.tools.extend(function (c) {
                        return a(c, b)
                    }, {type: "button"}, true)
                };
                return a
            }(), addUIElement: function (a, b) {
                this._.uiElementBuilders[a] = b
            }});
        CKEDITOR.dialog._ = {uiElementBuilders: {},
            dialogDefinitions: {}, currentTop: null, currentZIndex: null};
        CKEDITOR.event.implementOn(CKEDITOR.dialog);
        CKEDITOR.event.implementOn(CKEDITOR.dialog.prototype);
        var r = {resizable: CKEDITOR.DIALOG_RESIZE_BOTH, minWidth: 600, minHeight: 400, buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton]}, t = function (a, b, c) {
            for (var e = 0, d; d = a[e]; e++) {
                if (d.id == b)return d;
                if (c && d[c])if (d = t(d[c], b, c))return d
            }
            return null
        }, p = function (a, b, c, e, d) {
            if (c) {
                for (var f = 0, g; g = a[f]; f++) {
                    if (g.id == c) {
                        a.splice(f, 0, b);
                        return b
                    }
                    if (e &&
                        g[e])if (g = p(g[e], b, c, e, true))return g
                }
                if (d)return null
            }
            a.push(b);
            return b
        }, u = function (a, b, c) {
            for (var e = 0, d; d = a[e]; e++) {
                if (d.id == b)return a.splice(e, 1);
                if (c && d[c])if (d = u(d[c], b, c))return d
            }
            return null
        }, s = function (a, b) {
            this.dialog = a;
            for (var c = b.contents, e = 0, d; d = c[e]; e++)c[e] = d && new g(a, d);
            CKEDITOR.tools.extend(this, b)
        };
        s.prototype = {getContents: function (a) {
            return t(this.contents, a)
        }, getButton: function (a) {
            return t(this.buttons, a)
        }, addContents: function (a, b) {
            return p(this.contents, a, b)
        }, addButton: function (a, b) {
            return p(this.buttons, a, b)
        }, removeContents: function (a) {
            u(this.contents, a)
        }, removeButton: function (a) {
            u(this.buttons, a)
        }};
        g.prototype = {get: function (a) {
            return t(this.elements, a, "children")
        }, add: function (a, b) {
            return p(this.elements, a, b, "children")
        }, remove: function (a) {
            u(this.elements, a, "children")
        }};
        var x, y = {}, v, A = {}, B = function (a) {
            var b = a.data.$.ctrlKey || a.data.$.metaKey, c = a.data.$.altKey, e = a.data.$.shiftKey, d = String.fromCharCode(a.data.$.keyCode);
            if ((b = A[(b ? "CTRL+" : "") + (c ? "ALT+" : "") + (e ? "SHIFT+" : "") +
                d]) && b.length) {
                b = b[b.length - 1];
                b.keydown && b.keydown.call(b.uiElement, b.dialog, b.key);
                a.data.preventDefault()
            }
        }, E = function (a) {
            var b = a.data.$.ctrlKey || a.data.$.metaKey, c = a.data.$.altKey, e = a.data.$.shiftKey, d = String.fromCharCode(a.data.$.keyCode);
            if ((b = A[(b ? "CTRL+" : "") + (c ? "ALT+" : "") + (e ? "SHIFT+" : "") + d]) && b.length) {
                b = b[b.length - 1];
                if (b.keyup) {
                    b.keyup.call(b.uiElement, b.dialog, b.key);
                    a.data.preventDefault()
                }
            }
        }, F = function (a, b, c, e, d) {
            (A[c] || (A[c] = [])).push({uiElement: a, dialog: b, key: c, keyup: d || a.accessKeyUp,
                keydown: e || a.accessKeyDown})
        }, J = function (a) {
            for (var b in A) {
                for (var c = A[b], e = c.length - 1; e >= 0; e--)(c[e].dialog == a || c[e].uiElement == a) && c.splice(e, 1);
                c.length === 0 && delete A[b]
            }
        }, D = function (a, b) {
            a._.accessKeyMap[b] && a.selectPage(a._.accessKeyMap[b])
        }, z = function () {
        };
        (function () {
            CKEDITOR.ui.dialog = {uiElement: function (a, b, c, e, d, f, g) {
                if (!(arguments.length < 4)) {
                    var h = (e.call ? e(b) : e) || "div", i = ["<", h, " "], k = (d && d.call ? d(b) : d) || {}, j = (f && f.call ? f(b) : f) || {}, l = (g && g.call ? g.call(this, a, b) : g) || "", m = this.domId = j.id ||
                        CKEDITOR.tools.getNextId() + "_uiElement";
                    this.id = b.id;
                    if (b.requiredContent && !a.getParentEditor().filter.check(b.requiredContent)) {
                        k.display = "none";
                        this.notAllowed = true
                    }
                    j.id = m;
                    var n = {};
                    b.type && (n["cke_dialog_ui_" + b.type] = 1);
                    b.className && (n[b.className] = 1);
                    b.disabled && (n.cke_disabled = 1);
                    for (var D = j["class"] && j["class"].split ? j["class"].split(" ") : [], m = 0; m < D.length; m++)D[m] && (n[D[m]] = 1);
                    D = [];
                    for (m in n)D.push(m);
                    j["class"] = D.join(" ");
                    if (b.title)j.title = b.title;
                    n = (b.style || "").split(";");
                    if (b.align) {
                        D =
                            b.align;
                        k["margin-left"] = D == "left" ? 0 : "auto";
                        k["margin-right"] = D == "right" ? 0 : "auto"
                    }
                    for (m in k)n.push(m + ":" + k[m]);
                    b.hidden && n.push("display:none");
                    for (m = n.length - 1; m >= 0; m--)n[m] === "" && n.splice(m, 1);
                    if (n.length > 0)j.style = (j.style ? j.style + "; " : "") + n.join("; ");
                    for (m in j)i.push(m + '="' + CKEDITOR.tools.htmlEncode(j[m]) + '" ');
                    i.push(">", l, "</", h, ">");
                    c.push(i.join(""));
                    (this._ || (this._ = {})).dialog = a;
                    if (typeof b.isChanged == "boolean")this.isChanged = function () {
                        return b.isChanged
                    };
                    if (typeof b.isChanged == "function")this.isChanged =
                        b.isChanged;
                    if (typeof b.setValue == "function")this.setValue = CKEDITOR.tools.override(this.setValue, function (a) {
                        return function (c) {
                            a.call(this, b.setValue.call(this, c))
                        }
                    });
                    if (typeof b.getValue == "function")this.getValue = CKEDITOR.tools.override(this.getValue, function (a) {
                        return function () {
                            return b.getValue.call(this, a.call(this))
                        }
                    });
                    CKEDITOR.event.implementOn(this);
                    this.registerEvents(b);
                    this.accessKeyUp && (this.accessKeyDown && b.accessKey) && F(this, a, "CTRL+" + b.accessKey);
                    var p = this;
                    a.on("load", function () {
                        var b =
                            p.getInputElement();
                        if (b) {
                            var c = p.type in{checkbox: 1, ratio: 1} && CKEDITOR.env.ie && CKEDITOR.env.version < 8 ? "cke_dialog_ui_focused" : "";
                            b.on("focus", function () {
                                a._.tabBarMode = false;
                                a._.hasFocus = true;
                                p.fire("focus");
                                c && this.addClass(c)
                            });
                            b.on("blur", function () {
                                p.fire("blur");
                                c && this.removeClass(c)
                            })
                        }
                    });
                    CKEDITOR.tools.extend(this, b);
                    if (this.keyboardFocusable) {
                        this.tabIndex = b.tabIndex || 0;
                        this.focusIndex = a._.focusList.push(this) - 1;
                        this.on("focus", function () {
                            a._.currentFocusIndex = p.focusIndex
                        })
                    }
                }
            }, hbox: function (a, b, c, e, d) {
                if (!(arguments.length < 4)) {
                    this._ || (this._ = {});
                    var f = this._.children = b, g = d && d.widths || null, h = d && d.height || null, i, k = {role: "presentation"};
                    d && d.align && (k.align = d.align);
                    CKEDITOR.ui.dialog.uiElement.call(this, a, d || {type: "hbox"}, e, "table", {}, k, function () {
                        var a = ['<tbody><tr class="cke_dialog_ui_hbox">'];
                        for (i = 0; i < c.length; i++) {
                            var b = "cke_dialog_ui_hbox_child", e = [];
                            i === 0 && (b = "cke_dialog_ui_hbox_first");
                            i == c.length - 1 && (b = "cke_dialog_ui_hbox_last");
                            a.push('<td class="', b, '" role="presentation" ');
                            g ? g[i] && e.push("width:" + l(g[i])) : e.push("width:" + Math.floor(100 / c.length) + "%");
                            h && e.push("height:" + l(h));
                            d && d.padding != void 0 && e.push("padding:" + l(d.padding));
                            CKEDITOR.env.ie && (CKEDITOR.env.quirks && f[i].align) && e.push("text-align:" + f[i].align);
                            e.length > 0 && a.push('style="' + e.join("; ") + '" ');
                            a.push(">", c[i], "</td>")
                        }
                        a.push("</tr></tbody>");
                        return a.join("")
                    })
                }
            }, vbox: function (a, b, c, e, d) {
                if (!(arguments.length < 3)) {
                    this._ || (this._ = {});
                    var f = this._.children = b, g = d && d.width || null, h = d && d.heights || null;
                    CKEDITOR.ui.dialog.uiElement.call(this,
                        a, d || {type: "vbox"}, e, "div", null, {role: "presentation"}, function () {
                            var b = ['<table role="presentation" cellspacing="0" border="0" '];
                            b.push('style="');
                            d && d.expand && b.push("height:100%;");
                            b.push("width:" + l(g || "100%"), ";");
                            CKEDITOR.env.webkit && b.push("float:none;");
                            b.push('"');
                            b.push('align="', CKEDITOR.tools.htmlEncode(d && d.align || (a.getParentEditor().lang.dir == "ltr" ? "left" : "right")), '" ');
                            b.push("><tbody>");
                            for (var e = 0; e < c.length; e++) {
                                var i = [];
                                b.push('<tr><td role="presentation" ');
                                g && i.push("width:" +
                                    l(g || "100%"));
                                h ? i.push("height:" + l(h[e])) : d && d.expand && i.push("height:" + Math.floor(100 / c.length) + "%");
                                d && d.padding != void 0 && i.push("padding:" + l(d.padding));
                                CKEDITOR.env.ie && (CKEDITOR.env.quirks && f[e].align) && i.push("text-align:" + f[e].align);
                                i.length > 0 && b.push('style="', i.join("; "), '" ');
                                b.push(' class="cke_dialog_ui_vbox_child">', c[e], "</td></tr>")
                            }
                            b.push("</tbody></table>");
                            return b.join("")
                        })
                }
            }}
        })();
        CKEDITOR.ui.dialog.uiElement.prototype = {getElement: function () {
            return CKEDITOR.document.getById(this.domId)
        },
            getInputElement: function () {
                return this.getElement()
            }, getDialog: function () {
                return this._.dialog
            }, setValue: function (a, b) {
                this.getInputElement().setValue(a);
                !b && this.fire("change", {value: a});
                return this
            }, getValue: function () {
                return this.getInputElement().getValue()
            }, isChanged: function () {
                return false
            }, selectParentTab: function () {
                for (var a = this.getInputElement(); (a = a.getParent()) && a.$.className.search("cke_dialog_page_contents") == -1;);
                if (!a)return this;
                a = a.getAttribute("name");
                this._.dialog._.currentTabId !=
                a && this._.dialog.selectPage(a);
                return this
            }, focus: function () {
                this.selectParentTab().getInputElement().focus();
                return this
            }, registerEvents: function (a) {
                var b = /^on([A-Z]\w+)/, c, e = function (a, b, c, e) {
                    b.on("load", function () {
                        a.getInputElement().on(c, e, a)
                    })
                }, d;
                for (d in a)if (c = d.match(b))this.eventProcessors[d] ? this.eventProcessors[d].call(this, this._.dialog, a[d]) : e(this, this._.dialog, c[1].toLowerCase(), a[d]);
                return this
            }, eventProcessors: {onLoad: function (a, b) {
                a.on("load", b, this)
            }, onShow: function (a, b) {
                a.on("show",
                    b, this)
            }, onHide: function (a, b) {
                a.on("hide", b, this)
            }}, accessKeyDown: function () {
                this.focus()
            }, accessKeyUp: function () {
            }, disable: function () {
                var a = this.getElement();
                this.getInputElement().setAttribute("disabled", "true");
                a.addClass("cke_disabled")
            }, enable: function () {
                var a = this.getElement();
                this.getInputElement().removeAttribute("disabled");
                a.removeClass("cke_disabled")
            }, isEnabled: function () {
                return!this.getElement().hasClass("cke_disabled")
            }, isVisible: function () {
                return this.getInputElement().isVisible()
            },
            isFocusable: function () {
                return!this.isEnabled() || !this.isVisible() ? false : true
            }};
        CKEDITOR.ui.dialog.hbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {getChild: function (a) {
            if (arguments.length < 1)return this._.children.concat();
            a.splice || (a = [a]);
            return a.length < 2 ? this._.children[a[0]] : this._.children[a[0]] && this._.children[a[0]].getChild ? this._.children[a[0]].getChild(a.slice(1, a.length)) : null
        }}, true);
        CKEDITOR.ui.dialog.vbox.prototype = new CKEDITOR.ui.dialog.hbox;
        (function () {
            var a =
            {build: function (a, b, c) {
                for (var e = b.children, d, f = [], g = [], h = 0; h < e.length && (d = e[h]); h++) {
                    var i = [];
                    f.push(i);
                    g.push(CKEDITOR.dialog._.uiElementBuilders[d.type].build(a, d, i))
                }
                return new CKEDITOR.ui.dialog[b.type](a, g, f, c, b)
            }};
            CKEDITOR.dialog.addUIElement("hbox", a);
            CKEDITOR.dialog.addUIElement("vbox", a)
        })();
        CKEDITOR.dialogCommand = function (a, b) {
            this.dialogName = a;
            CKEDITOR.tools.extend(this, b, true)
        };
        CKEDITOR.dialogCommand.prototype = {exec: function (a) {
            a.openDialog(this.dialogName)
        }, canUndo: false, editorFocus: 1};
        (function () {
            var a = /^([a]|[^a])+$/, b = /^\d*$/, c = /^\d*(?:\.\d+)?$/, e = /^(((\d*(\.\d+))|(\d*))(px|\%)?)?$/, d = /^(((\d*(\.\d+))|(\d*))(px|em|ex|in|cm|mm|pt|pc|\%)?)?$/i, f = /^(\s*[\w-]+\s*:\s*[^:;]+(?:;|$))*$/;
            CKEDITOR.VALIDATE_OR = 1;
            CKEDITOR.VALIDATE_AND = 2;
            CKEDITOR.dialog.validate = {functions: function () {
                var a = arguments;
                return function () {
                    var b = this && this.getValue ? this.getValue() : a[0], c = void 0, e = CKEDITOR.VALIDATE_AND, d = [], f;
                    for (f = 0; f < a.length; f++)if (typeof a[f] == "function")d.push(a[f]); else break;
                    if (f < a.length &&
                        typeof a[f] == "string") {
                        c = a[f];
                        f++
                    }
                    f < a.length && typeof a[f] == "number" && (e = a[f]);
                    var g = e == CKEDITOR.VALIDATE_AND ? true : false;
                    for (f = 0; f < d.length; f++)g = e == CKEDITOR.VALIDATE_AND ? g && d[f](b) : g || d[f](b);
                    return!g ? c : true
                }
            }, regex: function (a, b) {
                return function (c) {
                    c = this && this.getValue ? this.getValue() : c;
                    return!a.test(c) ? b : true
                }
            }, notEmpty: function (b) {
                return this.regex(a, b)
            }, integer: function (a) {
                return this.regex(b, a)
            }, number: function (a) {
                return this.regex(c, a)
            }, cssLength: function (a) {
                return this.functions(function (a) {
                        return d.test(CKEDITOR.tools.trim(a))
                    },
                    a)
            }, htmlLength: function (a) {
                return this.functions(function (a) {
                    return e.test(CKEDITOR.tools.trim(a))
                }, a)
            }, inlineStyle: function (a) {
                return this.functions(function (a) {
                    return f.test(CKEDITOR.tools.trim(a))
                }, a)
            }, equals: function (a, b) {
                return this.functions(function (b) {
                    return b == a
                }, b)
            }, notEqual: function (a, b) {
                return this.functions(function (b) {
                    return b != a
                }, b)
            }};
            CKEDITOR.on("instanceDestroyed", function (a) {
                if (CKEDITOR.tools.isEmpty(CKEDITOR.instances)) {
                    for (var b; b = CKEDITOR.dialog._.currentTop;)b.hide();
                    for (var c in y)y[c].remove();
                    y = {}
                }
                var a = a.editor._.storedDialogs, e;
                for (e in a)a[e].destroy()
            })
        })();
        CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {openDialog: function (a, b) {
            var c = null, e = CKEDITOR.dialog._.dialogDefinitions[a];
            CKEDITOR.dialog._.currentTop === null && o(this);
            if (typeof e == "function") {
                c = this._.storedDialogs || (this._.storedDialogs = {});
                c = c[a] || (c[a] = new CKEDITOR.dialog(this, a));
                b && b.call(c, c);
                c.show()
            } else {
                if (e == "failed") {
                    q(this);
                    throw Error('[CKEDITOR.dialog.openDialog] Dialog "' + a + '" failed when loading definition.');
                }
                typeof e == "string" && CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(e), function () {
                    typeof CKEDITOR.dialog._.dialogDefinitions[a] != "function" && (CKEDITOR.dialog._.dialogDefinitions[a] = "failed");
                    this.openDialog(a, b)
                }, this, 0, 1)
            }
            CKEDITOR.skin.loadPart("dialog");
            return c
        }})
    }(),CKEDITOR.plugins.add("dialog", {requires: "dialogui", init: function (c) {
        c.on("doubleclick", function (f) {
            f.data.dialog && c.openDialog(f.data.dialog)
        }, null, null, 999)
    }}),CKEDITOR.plugins.colordialog = {requires: "dialog", init: function (c) {
        var f = new CKEDITOR.dialogCommand("colordialog");
        f.editorFocus = false;
        c.addCommand("colordialog", f);
        CKEDITOR.dialog.add("colordialog", this.path + "dialogs/colordialog.js");
        c.getColorFromDialog = function (d, b) {
            var a = function (c) {
                this.removeListener("ok", a);
                this.removeListener("cancel", a);
                c = c.name == "ok" ? this.getValueOf("picker", "selectedColor") : null;
                d.call(b, c)
            }, e = function (b) {
                b.on("ok", a);
                b.on("cancel", a)
            };
            c.execCommand("colordialog");
            if (c._.storedDialogs && c._.storedDialogs.colordialog)e(c._.storedDialogs.colordialog); else CKEDITOR.on("dialogDefinition",
                function (a) {
                    if (a.data.name == "colordialog") {
                        var b = a.data.definition;
                        a.removeListener();
                        b.onLoad = CKEDITOR.tools.override(b.onLoad, function (a) {
                            return function () {
                                e(this);
                                b.onLoad = a;
                                typeof a == "function" && a.call(this)
                            }
                        })
                    }
                })
        }
    }},CKEDITOR.plugins.add("colordialog", CKEDITOR.plugins.colordialog),"use strict",function () {
        function c(a) {
            function b() {
                var c = a.editable();
                c.on(A, function (a) {
                    (!CKEDITOR.env.ie || !x) && p(a)
                });
                CKEDITOR.env.ie && c.on("paste", function (b) {
                    if (!y) {
                        d();
                        b.data.preventDefault();
                        p(b);
                        o("paste") || a.openDialog("paste")
                    }
                });
                if (CKEDITOR.env.ie) {
                    c.on("contextmenu", f, null, null, 0);
                    c.on("beforepaste", function (a) {
                        a.data && !a.data.$.ctrlKey && f()
                    }, null, null, 0)
                }
                c.on("beforecut", function () {
                    !x && l(a)
                });
                var e;
                c.attachListener(CKEDITOR.env.ie ? c : a.document.getDocumentElement(), "mouseup", function () {
                    e = setTimeout(function () {
                        u()
                    }, 0)
                });
                a.on("destroy", function () {
                    clearTimeout(e)
                });
                c.on("keyup", u)
            }

            function c(b) {
                return{type: b, canUndo: b == "cut", startDisabled: true, exec: function () {
                    this.type == "cut" && l();
                    var b;
                    var c = this.type;
                    if (CKEDITOR.env.ie)b =
                        o(c); else try {
                        b = a.document.$.execCommand(c, false, null)
                    } catch (e) {
                        b = false
                    }
                    b || alert(a.lang.clipboard[this.type + "Error"]);
                    return b
                }}
            }

            function e() {
                return{canUndo: false, async: true, exec: function (a, b) {
                    var c = function (b, c) {
                        b && q(b.type, b.dataValue, !!c);
                        a.fire("afterCommandExec", {name: "paste", command: e, returnValue: !!b})
                    }, e = this;
                    typeof b == "string" ? c({type: "auto", dataValue: b}, 1) : a.getClipboardData(c)
                }}
            }

            function d() {
                y = 1;
                setTimeout(function () {
                    y = 0
                }, 100)
            }

            function f() {
                x = 1;
                setTimeout(function () {
                    x = 0
                }, 10)
            }

            function o(b) {
                var c =
                    a.document, e = c.getBody(), d = false, f = function () {
                    d = true
                };
                e.on(b, f);
                (CKEDITOR.env.version > 7 ? c.$ : c.$.selection.createRange()).execCommand(b);
                e.removeListener(b, f);
                return d
            }

            function q(b, c, e) {
                b = {type: b};
                if (e && a.fire("beforePaste", b) === false || !c)return false;
                b.dataValue = c;
                return a.fire("paste", b)
            }

            function l() {
                if (CKEDITOR.env.ie && !CKEDITOR.env.quirks) {
                    var b = a.getSelection(), c, e, d;
                    if (b.getType() == CKEDITOR.SELECTION_ELEMENT && (c = b.getSelectedElement())) {
                        e = b.getRanges()[0];
                        d = a.document.createText("");
                        d.insertBefore(c);
                        e.setStartBefore(d);
                        e.setEndAfter(c);
                        b.selectRanges([e]);
                        setTimeout(function () {
                            if (c.getParent()) {
                                d.remove();
                                b.selectElement(c)
                            }
                        }, 0)
                    }
                }
            }

            function m(b, c) {
                var e = a.document, d = a.editable(), f = function (a) {
                    a.cancel()
                }, g;
                if (!e.getById("cke_pastebin")) {
                    var i = a.getSelection(), k = i.createBookmarks(), j = new CKEDITOR.dom.element((CKEDITOR.env.webkit || d.is("body")) && !CKEDITOR.env.ie ? "body" : "div", e);
                    j.setAttributes({id: "cke_pastebin", "data-cke-temp": "1"});
                    var l = 0, e = e.getWindow();
                    if (CKEDITOR.env.webkit) {
                        d.append(j);
                        j.addClass("cke_editable");
                        if (!d.is("body")) {
                            l = d.getComputedStyle("position") != "static" ? d : CKEDITOR.dom.element.get(d.$.offsetParent);
                            l = l.getDocumentPosition().y
                        }
                    } else d.getAscendant(CKEDITOR.env.ie ? "body" : "html", 1).append(j);
                    j.setStyles({position: "absolute", top: e.getScrollPosition().y - l + 10 + "px", width: "1px", height: Math.max(1, e.getViewPaneSize().height - 20) + "px", overflow: "hidden", margin: 0, padding: 0});
                    if (l = j.getParent().isReadOnly()) {
                        j.setOpacity(0);
                        j.setAttribute("contenteditable", true)
                    } else j.setStyle(a.config.contentsLangDirection ==
                        "ltr" ? "left" : "right", "-1000px");
                    a.on("selectionChange", f, null, null, 0);
                    if (CKEDITOR.env.webkit || CKEDITOR.env.gecko)g = d.once("blur", f, null, null, -100);
                    l && j.focus();
                    l = new CKEDITOR.dom.range(j);
                    l.selectNodeContents(j);
                    var m = l.select();
                    CKEDITOR.env.ie && (g = d.once("blur", function () {
                        a.lockSelection(m)
                    }));
                    var n = CKEDITOR.document.getWindow().getScrollPosition().y;
                    setTimeout(function () {
                        if (CKEDITOR.env.webkit)CKEDITOR.document.getBody().$.scrollTop = n;
                        g && g.removeListener();
                        CKEDITOR.env.ie && d.focus();
                        i.selectBookmarks(k);
                        j.remove();
                        var b;
                        if (CKEDITOR.env.webkit && (b = j.getFirst()) && b.is && b.hasClass("Apple-style-span"))j = b;
                        a.removeListener("selectionChange", f);
                        c(j.getHtml())
                    }, 0)
                }
            }

            function r() {
                if (CKEDITOR.env.ie) {
                    a.focus();
                    d();
                    var b = a.focusManager;
                    b.lock();
                    if (a.editable().fire(A) && !o("paste")) {
                        b.unlock();
                        return false
                    }
                    b.unlock()
                } else try {
                    if (a.editable().fire(A) && !a.document.$.execCommand("Paste", false, null))throw 0;
                } catch (c) {
                    return false
                }
                return true
            }

            function t(b) {
                if (a.mode == "wysiwyg")switch (b.data.keyCode) {
                    case CKEDITOR.CTRL +
                        86:
                    case CKEDITOR.SHIFT + 45:
                        b = a.editable();
                        d();
                        !CKEDITOR.env.ie && b.fire("beforepaste");
                        break;
                    case CKEDITOR.CTRL + 88:
                    case CKEDITOR.SHIFT + 46:
                        a.fire("saveSnapshot");
                        setTimeout(function () {
                            a.fire("saveSnapshot")
                        }, 50)
                }
            }

            function p(b) {
                var c = {type: "auto"}, e = a.fire("beforePaste", c);
                m(b, function (a) {
                    a = a.replace(/<span[^>]+data-cke-bookmark[^<]*?<\/span>/ig, "");
                    e && q(c.type, a, 0, 1)
                })
            }

            function u() {
                if (a.mode == "wysiwyg") {
                    var b = s("paste");
                    a.getCommand("cut").setState(s("cut"));
                    a.getCommand("copy").setState(s("copy"));
                    a.getCommand("paste").setState(b);
                    a.fire("pasteState", b)
                }
            }

            function s(b) {
                if (v && b in{paste: 1, cut: 1})return CKEDITOR.TRISTATE_DISABLED;
                if (b == "paste")return CKEDITOR.TRISTATE_OFF;
                var b = a.getSelection(), c = b.getRanges();
                return b.getType() == CKEDITOR.SELECTION_NONE || c.length == 1 && c[0].collapsed ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_OFF
            }

            var x = 0, y = 0, v = 0, A = CKEDITOR.env.ie ? "beforepaste" : "paste";
            (function () {
                a.on("key", t);
                a.on("contentDom", b);
                a.on("selectionChange", function (a) {
                    v = a.data.selection.getRanges()[0].checkReadOnly();
                    u()
                });
                a.contextMenu && a.contextMenu.addListener(function (a, b) {
                    v = b.getRanges()[0].checkReadOnly();
                    return{cut: s("cut"), copy: s("copy"), paste: s("paste")}
                })
            })();
            (function () {
                function b(c, e, d, f, g) {
                    var i = a.lang.clipboard[e];
                    a.addCommand(e, d);
                    a.ui.addButton && a.ui.addButton(c, {label: i, command: e, toolbar: "clipboard," + f});
                    a.addMenuItems && a.addMenuItem(e, {label: i, command: e, group: "clipboard", order: g})
                }

                b("Cut", "cut", c("cut"), 10, 1);
                b("Copy", "copy", c("copy"), 20, 4);
                b("Paste", "paste", e(), 30, 8)
            })();
            a.getClipboardData =
                function (b, c) {
                    function e(a) {
                        a.removeListener();
                        a.cancel();
                        c(a.data)
                    }

                    function d(a) {
                        a.removeListener();
                        a.cancel();
                        k = true;
                        c({type: i, dataValue: a.data})
                    }

                    function f() {
                        this.customTitle = b && b.title
                    }

                    var g = false, i = "auto", k = false;
                    if (!c) {
                        c = b;
                        b = null
                    }
                    a.on("paste", e, null, null, 0);
                    a.on("beforePaste", function (a) {
                        a.removeListener();
                        g = true;
                        i = a.data.type
                    }, null, null, 1E3);
                    if (r() === false) {
                        a.removeListener("paste", e);
                        if (g && a.fire("pasteDialog", f)) {
                            a.on("pasteDialogCommit", d);
                            a.on("dialogHide", function (a) {
                                a.removeListener();
                                a.data.removeListener("pasteDialogCommit", d);
                                setTimeout(function () {
                                    k || c(null)
                                }, 10)
                            })
                        } else c(null)
                    }
                }
        }

        function f(a) {
            if (CKEDITOR.env.webkit) {
                if (!a.match(/^[^<]*$/g) && !a.match(/^(<div><br( ?\/)?><\/div>|<div>[^<]*<\/div>)*$/gi))return"html"
            } else if (CKEDITOR.env.ie) {
                if (!a.match(/^([^<]|<br( ?\/)?>)*$/gi) && !a.match(/^(<p>([^<]|<br( ?\/)?>)*<\/p>|(\r\n))*$/gi))return"html"
            } else if (CKEDITOR.env.gecko) {
                if (!a.match(/^([^<]|<br( ?\/)?>)*$/gi))return"html"
            } else return"html";
            return"htmlifiedtext"
        }

        function d(a, b) {
            function c(a) {
                return CKEDITOR.tools.repeat("</p><p>", ~~(a / 2)) + (a % 2 == 1 ? "<br>" : "")
            }

            b = b.replace(/\s+/g, " ").replace(/> +</g, "><").replace(/<br ?\/>/gi, "<br>");
            b = b.replace(/<\/?[A-Z]+>/g, function (a) {
                return a.toLowerCase()
            });
            if (b.match(/^[^<]$/))return b;
            if (CKEDITOR.env.webkit && b.indexOf("<div>") > -1) {
                b = b.replace(/^(<div>(<br>|)<\/div>)(?!$|(<div>(<br>|)<\/div>))/g, "<br>").replace(/^(<div>(<br>|)<\/div>){2}(?!$)/g, "<div></div>");
                b.match(/<div>(<br>|)<\/div>/) && (b = "<p>" + b.replace(/(<div>(<br>|)<\/div>)+/g,
                    function (a) {
                        return c(a.split("</div><div>").length + 1)
                    }) + "</p>");
                b = b.replace(/<\/div><div>/g, "<br>");
                b = b.replace(/<\/?div>/g, "")
            }
            if (CKEDITOR.env.gecko && a.enterMode != CKEDITOR.ENTER_BR) {
                CKEDITOR.env.gecko && (b = b.replace(/^<br><br>$/, "<br>"));
                b.indexOf("<br><br>") > -1 && (b = "<p>" + b.replace(/(<br>){2,}/g, function (a) {
                    return c(a.length / 4)
                }) + "</p>")
            }
            return e(a, b)
        }

        function b() {
            var a = new CKEDITOR.htmlParser.filter, b = {blockquote: 1, dl: 1, fieldset: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, ol: 1, p: 1, table: 1, ul: 1}, c = CKEDITOR.tools.extend({br: 0},
                CKEDITOR.dtd.$inline), e = {p: 1, br: 1, "cke:br": 1}, d = CKEDITOR.dtd, f = CKEDITOR.tools.extend({area: 1, basefont: 1, embed: 1, iframe: 1, map: 1, object: 1, param: 1}, CKEDITOR.dtd.$nonBodyContent, CKEDITOR.dtd.$cdata), o = function (a) {
                delete a.name;
                a.add(new CKEDITOR.htmlParser.text(" "))
            }, q = function (a) {
                for (var b = a, c; (b = b.next) && b.name && b.name.match(/^h\d$/);) {
                    c = new CKEDITOR.htmlParser.element("cke:br");
                    c.isEmpty = true;
                    for (a.add(c); c = b.children.shift();)a.add(c)
                }
            };
            a.addRules({elements: {h1: q, h2: q, h3: q, h4: q, h5: q, h6: q, img: function (a) {
                var a =
                    CKEDITOR.tools.trim(a.attributes.alt || ""), b = " ";
                a && !a.match(/(^http|\.(jpe?g|gif|png))/i) && (b = " [" + a + "] ");
                return new CKEDITOR.htmlParser.text(b)
            }, td: o, th: o, $: function (a) {
                var h = a.name, o;
                if (f[h])return false;
                a.attributes = {};
                if (h == "br")return a;
                if (b[h])a.name = "p"; else if (c[h])delete a.name; else if (d[h]) {
                    o = new CKEDITOR.htmlParser.element("cke:br");
                    o.isEmpty = true;
                    if (CKEDITOR.dtd.$empty[h])return o;
                    a.add(o, 0);
                    o = o.clone();
                    o.isEmpty = true;
                    a.add(o);
                    delete a.name
                }
                e[a.name] || delete a.name;
                return a
            }}}, {applyToAll: true});
            return a
        }

        function a(a, b, c) {
            var b = new CKEDITOR.htmlParser.fragment.fromHtml(b), d = new CKEDITOR.htmlParser.basicWriter;
            b.writeHtml(d, c);
            var b = d.getHtml(), b = b.replace(/\s*(<\/?[a-z:]+ ?\/?>)\s*/g, "$1").replace(/(<cke:br \/>){2,}/g, "<cke:br />").replace(/(<cke:br \/>)(<\/?p>|<br \/>)/g, "$2").replace(/(<\/?p>|<br \/>)(<cke:br \/>)/g, "$1").replace(/<(cke:)?br( \/)?>/g, "<br>").replace(/<p><\/p>/g, ""), f = 0, b = b.replace(/<\/?p>/g, function (a) {
                if (a == "<p>") {
                    if (++f > 1)return"</p><p>"
                } else if (--f > 0)return"</p><p>";
                return a
            }).replace(/<p><\/p>/g, "");
            return e(a, b)
        }

        function e(a, b) {
            a.enterMode == CKEDITOR.ENTER_BR ? b = b.replace(/(<\/p><p>)+/g, function (a) {
                return CKEDITOR.tools.repeat("<br>", a.length / 7 * 2)
            }).replace(/<\/?p>/g, "") : a.enterMode == CKEDITOR.ENTER_DIV && (b = b.replace(/<(\/)?p>/g, "<$1div>"));
            return b
        }

        CKEDITOR.plugins.add("clipboard", {requires: "dialog", init: function (e) {
            var k;
            c(e);
            CKEDITOR.dialog.add("paste", CKEDITOR.getUrl(this.path + "dialogs/paste.js"));
            e.on("paste", function (a) {
                var b = a.data.dataValue, c = CKEDITOR.dtd.$block;
                if (b.indexOf("Apple-") > -1) {
                    b = b.replace(/<span class="Apple-converted-space">&nbsp;<\/span>/gi, " ");
                    a.data.type != "html" && (b = b.replace(/<span class="Apple-tab-span"[^>]*>([^<]*)<\/span>/gi, function (a, b) {
                        return b.replace(/\t/g, "&nbsp;&nbsp; &nbsp;")
                    }));
                    if (b.indexOf('<br class="Apple-interchange-newline">') > -1) {
                        a.data.startsWithEOL = 1;
                        a.data.preSniffing = "html";
                        b = b.replace(/<br class="Apple-interchange-newline">/, "")
                    }
                    b = b.replace(/(<[^>]+) class="Apple-[^"]*"/gi, "$1")
                }
                if (b.match(/^<[^<]+cke_(editable|contents)/i)) {
                    var e,
                        d, f = new CKEDITOR.dom.element("div");
                    for (f.setHtml(b); f.getChildCount() == 1 && (e = f.getFirst()) && e.type == CKEDITOR.NODE_ELEMENT && (e.hasClass("cke_editable") || e.hasClass("cke_contents"));)f = d = e;
                    d && (b = d.getHtml().replace(/<br>$/i, ""))
                }
                CKEDITOR.env.ie ? b = b.replace(/^&nbsp;(?: |\r\n)?<(\w+)/g, function (b, e) {
                    if (e.toLowerCase()in c) {
                        a.data.preSniffing = "html";
                        return"<" + e
                    }
                    return b
                }) : CKEDITOR.env.webkit ? b = b.replace(/<\/(\w+)><div><br><\/div>$/, function (b, e) {
                    if (e in c) {
                        a.data.endsWithEOL = 1;
                        return"</" + e + ">"
                    }
                    return b
                }) :
                    CKEDITOR.env.gecko && (b = b.replace(/(\s)<br>$/, "$1"));
                a.data.dataValue = b
            }, null, null, 3);
            e.on("paste", function (c) {
                var c = c.data, i = c.type, j = c.dataValue, n, o = e.config.clipboard_defaultContentType || "html";
                n = i == "html" || c.preSniffing == "html" ? "html" : f(j);
                n == "htmlifiedtext" ? j = d(e.config, j) : i == "text" && n == "html" && (j = a(e.config, j, k || (k = b(e))));
                c.startsWithEOL && (j = '<br data-cke-eol="1">' + j);
                c.endsWithEOL && (j = j + '<br data-cke-eol="1">');
                i == "auto" && (i = n == "html" || o == "html" ? "html" : "text");
                c.type = i;
                c.dataValue = j;
                delete c.preSniffing;
                delete c.startsWithEOL;
                delete c.endsWithEOL
            }, null, null, 6);
            e.on("paste", function (a) {
                a = a.data;
                e.insertHtml(a.dataValue, a.type);
                setTimeout(function () {
                    e.fire("afterPaste")
                }, 0)
            }, null, null, 1E3);
            e.on("pasteDialog", function (a) {
                setTimeout(function () {
                    e.openDialog("paste", a.data)
                }, 0)
            })
        }})
    }(),function () {
        CKEDITOR.plugins.add("panel", {beforeInit: function (b) {
            b.ui.addHandler(CKEDITOR.UI_PANEL, CKEDITOR.ui.panel.handler)
        }});
        CKEDITOR.UI_PANEL = "panel";
        CKEDITOR.ui.panel = function (b, a) {
            a && CKEDITOR.tools.extend(this, a);
            CKEDITOR.tools.extend(this, {className: "", css: []});
            this.id = CKEDITOR.tools.getNextId();
            this.document = b;
            this.isFramed = this.forceIFrame || this.css.length;
            this._ = {blocks: {}}
        };
        CKEDITOR.ui.panel.handler = {create: function (b) {
            return new CKEDITOR.ui.panel(b)
        }};
        var c = CKEDITOR.addTemplate("panel", '<div lang="{langCode}" id="{id}" dir={dir} class="cke cke_reset_all {editorId} cke_panel cke_panel {cls} cke_{dir}" style="z-index:{z-index}" role="presentation">{frame}</div>'), f = CKEDITOR.addTemplate("panel-frame", '<iframe id="{id}" class="cke_panel_frame" role="presentation" frameborder="0" src="{src}"></iframe>'),
            d = CKEDITOR.addTemplate("panel-frame-inner", '<!DOCTYPE html><html class="cke_panel_container {env}" dir="{dir}" lang="{langCode}"><head>{css}</head><body class="cke_{dir}" style="margin:0;padding:0" onload="{onload}"></body></html>');
        CKEDITOR.ui.panel.prototype = {render: function (b, a) {
            this.getHolderElement = function () {
                var a = this._.holder;
                if (!a) {
                    if (this.isFramed) {
                        var a = this.document.getById(this.id + "_frame"), b = a.getParent(), a = a.getFrameDocument();
                        CKEDITOR.env.iOS && b.setStyles({overflow: "scroll", "-webkit-overflow-scrolling": "touch"});
                        b = CKEDITOR.tools.addFunction(CKEDITOR.tools.bind(function () {
                            this.isLoaded = true;
                            if (this.onLoad)this.onLoad()
                        }, this));
                        a.write(d.output(CKEDITOR.tools.extend({css: CKEDITOR.tools.buildStyleHtml(this.css), onload: "window.parent.CKEDITOR.tools.callFunction(" + b + ");"}, e)));
                        a.getWindow().$.CKEDITOR = CKEDITOR;
                        a.on("keydown", function (a) {
                            var b = a.data.getKeystroke(), c = this.document.getById(this.id).getAttribute("dir");
                            this._.onKeyDown && this._.onKeyDown(b) === false ? a.data.preventDefault() : (b == 27 || b == (c == "rtl" ? 39 :
                                37)) && this.onEscape && this.onEscape(b) === false && a.data.preventDefault()
                        }, this);
                        a = a.getBody();
                        a.unselectable();
                        CKEDITOR.env.air && CKEDITOR.tools.callFunction(b)
                    } else a = this.document.getById(this.id);
                    this._.holder = a
                }
                return a
            };
            var e = {editorId: b.id, id: this.id, langCode: b.langCode, dir: b.lang.dir, cls: this.className, frame: "", env: CKEDITOR.env.cssClass, "z-index": b.config.baseFloatZIndex + 1};
            if (this.isFramed) {
                var h = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent("document.open();(" +
                    CKEDITOR.tools.fixDomain + ")();document.close();") + "}())" : "";
                e.frame = f.output({id: this.id + "_frame", src: h})
            }
            h = c.output(e);
            a && a.push(h);
            return h
        }, addBlock: function (b, a) {
            a = this._.blocks[b] = a instanceof CKEDITOR.ui.panel.block ? a : new CKEDITOR.ui.panel.block(this.getHolderElement(), a);
            this._.currentBlock || this.showBlock(b);
            return a
        }, getBlock: function (b) {
            return this._.blocks[b]
        }, showBlock: function (b) {
            var b = this._.blocks[b], a = this._.currentBlock, c = !this.forceIFrame || CKEDITOR.env.ie ? this._.holder : this.document.getById(this.id +
                "_frame");
            a && a.hide();
            this._.currentBlock = b;
            CKEDITOR.fire("ariaWidget", c);
            b._.focusIndex = -1;
            this._.onKeyDown = b.onKeyDown && CKEDITOR.tools.bind(b.onKeyDown, b);
            b.show();
            return b
        }, destroy: function () {
            this.element && this.element.remove()
        }};
        CKEDITOR.ui.panel.block = CKEDITOR.tools.createClass({$: function (b, a) {
            this.element = b.append(b.getDocument().createElement("div", {attributes: {tabindex: -1, "class": "cke_panel_block"}, styles: {display: "none"}}));
            a && CKEDITOR.tools.extend(this, a);
            this.element.setAttributes({role: this.attributes.role ||
                "presentation", "aria-label": this.attributes["aria-label"], title: this.attributes.title || this.attributes["aria-label"]});
            this.keys = {};
            this._.focusIndex = -1;
            this.element.disableContextMenu()
        }, _: {markItem: function (b) {
            if (b != -1) {
                b = this.element.getElementsByTag("a").getItem(this._.focusIndex = b);
                CKEDITOR.env.webkit && b.getDocument().getWindow().focus();
                b.focus();
                this.onMark && this.onMark(b)
            }
        }}, proto: {show: function () {
            this.element.setStyle("display", "")
        }, hide: function () {
            (!this.onHide || this.onHide.call(this) !==
                true) && this.element.setStyle("display", "none")
        }, onKeyDown: function (b, a) {
            var c = this.keys[b];
            switch (c) {
                case "next":
                    for (var d = this._.focusIndex, c = this.element.getElementsByTag("a"), f; f = c.getItem(++d);)if (f.getAttribute("_cke_focus") && f.$.offsetWidth) {
                        this._.focusIndex = d;
                        f.focus();
                        break
                    }
                    if (!f && !a) {
                        this._.focusIndex = -1;
                        return this.onKeyDown(b, 1)
                    }
                    return false;
                case "prev":
                    d = this._.focusIndex;
                    for (c = this.element.getElementsByTag("a"); d > 0 && (f = c.getItem(--d));) {
                        if (f.getAttribute("_cke_focus") && f.$.offsetWidth) {
                            this._.focusIndex =
                                d;
                            f.focus();
                            break
                        }
                        f = null
                    }
                    if (!f && !a) {
                        this._.focusIndex = c.count();
                        return this.onKeyDown(b, 1)
                    }
                    return false;
                case "click":
                case "mouseup":
                    d = this._.focusIndex;
                    (f = d >= 0 && this.element.getElementsByTag("a").getItem(d)) && (f.$[c] ? f.$[c]() : f.$["on" + c]());
                    return false
            }
            return true
        }}})
    }(),CKEDITOR.plugins.add("floatpanel", {requires: "panel"}),function () {
        function c(c, b, a, e, h) {
            var h = CKEDITOR.tools.genKey(b.getUniqueId(), a.getUniqueId(), c.lang.dir, c.uiColor || "", e.css || "", h || ""), k = f[h];
            if (!k) {
                k = f[h] = new CKEDITOR.ui.panel(b,
                    e);
                k.element = a.append(CKEDITOR.dom.element.createFromHtml(k.render(c), b));
                k.element.setStyles({display: "none", position: "absolute"})
            }
            return k
        }

        var f = {};
        CKEDITOR.ui.floatPanel = CKEDITOR.tools.createClass({$: function (d, b, a, e) {
            function f() {
                j.hide()
            }

            a.forceIFrame = 1;
            a.toolbarRelated && d.elementMode == CKEDITOR.ELEMENT_MODE_INLINE && (b = CKEDITOR.document.getById("cke_" + d.name));
            var k = b.getDocument(), e = c(d, k, b, a, e || 0), g = e.element, i = g.getFirst(), j = this;
            g.disableContextMenu();
            this.element = g;
            this._ = {editor: d, panel: e,
                parentElement: b, definition: a, document: k, iframe: i, children: [], dir: d.lang.dir};
            d.on("mode", f);
            d.on("resize", f);
            if (!CKEDITOR.env.iOS)k.getWindow().on("resize", f)
        }, proto: {addBlock: function (c, b) {
            return this._.panel.addBlock(c, b)
        }, addListBlock: function (c, b) {
            return this._.panel.addListBlock(c, b)
        }, getBlock: function (c) {
            return this._.panel.getBlock(c)
        }, showBlock: function (c, b, a, e, f, k) {
            var g = this._.panel, i = g.showBlock(c);
            this.allowBlur(false);
            c = this._.editor.editable();
            this._.returnFocus = c.hasFocus ? c : new CKEDITOR.dom.element(CKEDITOR.document.$.activeElement);
            this._.hideTimeout = 0;
            var j = this.element, c = this._.iframe, c = CKEDITOR.env.ie ? c : new CKEDITOR.dom.window(c.$.contentWindow), n = j.getDocument(), o = this._.parentElement.getPositionedAncestor(), q = b.getDocumentPosition(n), n = o ? o.getDocumentPosition(n) : {x: 0, y: 0}, l = this._.dir == "rtl", m = q.x + (e || 0) - n.x, r = q.y + (f || 0) - n.y;
            if (l && (a == 1 || a == 4))m = m + b.$.offsetWidth; else if (!l && (a == 2 || a == 3))m = m + (b.$.offsetWidth - 1);
            if (a == 3 || a == 4)r = r + (b.$.offsetHeight - 1);
            this._.panel._.offsetParentId = b.getId();
            j.setStyles({top: r + "px", left: 0,
                display: ""});
            j.setOpacity(0);
            j.getFirst().removeStyle("width");
            this._.editor.focusManager.add(c);
            if (!this._.blurSet) {
                CKEDITOR.event.useCapture = true;
                c.on("blur", function (a) {
                    function b() {
                        delete this._.returnFocus;
                        this.hide()
                    }

                    if (this.allowBlur() && a.data.getPhase() == CKEDITOR.EVENT_PHASE_AT_TARGET && this.visible && !this._.activeChild)if (CKEDITOR.env.iOS) {
                        if (!this._.hideTimeout)this._.hideTimeout = CKEDITOR.tools.setTimeout(b, 0, this)
                    } else b.call(this)
                }, this);
                c.on("focus", function () {
                    this._.focused = true;
                    this.hideChild();
                    this.allowBlur(true)
                }, this);
                if (CKEDITOR.env.iOS) {
                    c.on("touchstart", function () {
                        clearTimeout(this._.hideTimeout)
                    }, this);
                    c.on("touchend", function () {
                        this._.hideTimeout = 0;
                        this.focus()
                    }, this)
                }
                CKEDITOR.event.useCapture = false;
                this._.blurSet = 1
            }
            g.onEscape = CKEDITOR.tools.bind(function (a) {
                if (this.onEscape && this.onEscape(a) === false)return false
            }, this);
            CKEDITOR.tools.setTimeout(function () {
                var a = CKEDITOR.tools.bind(function () {
                    j.removeStyle("width");
                    if (i.autoSize) {
                        var a = i.element.getDocument(), a = (CKEDITOR.env.webkit ?
                            i.element : a.getBody()).$.scrollWidth;
                        CKEDITOR.env.ie && (CKEDITOR.env.quirks && a > 0) && (a = a + ((j.$.offsetWidth || 0) - (j.$.clientWidth || 0) + 3));
                        j.setStyle("width", a + 10 + "px");
                        a = i.element.$.scrollHeight;
                        CKEDITOR.env.ie && (CKEDITOR.env.quirks && a > 0) && (a = a + ((j.$.offsetHeight || 0) - (j.$.clientHeight || 0) + 3));
                        j.setStyle("height", a + "px");
                        g._.currentBlock.element.setStyle("display", "none").removeStyle("display")
                    } else j.removeStyle("height");
                    l && (m = m - j.$.offsetWidth);
                    j.setStyle("left", m + "px");
                    var b = g.element.getWindow(),
                        a = j.$.getBoundingClientRect(), b = b.getViewPaneSize(), c = a.width || a.right - a.left, e = a.height || a.bottom - a.top, d = l ? a.right : b.width - a.left, f = l ? b.width - a.right : a.left;
                    l ? d < c && (m = f > c ? m + c : b.width > c ? m - a.left : m - a.right + b.width) : d < c && (m = f > c ? m - c : b.width > c ? m - a.right + b.width : m - a.left);
                    c = a.top;
                    b.height - a.top < e && (r = c > e ? r - e : b.height > e ? r - a.bottom + b.height : r - a.top);
                    if (CKEDITOR.env.ie) {
                        b = a = new CKEDITOR.dom.element(j.$.offsetParent);
                        b.getName() == "html" && (b = b.getDocument().getBody());
                        b.getComputedStyle("direction") == "rtl" &&
                        (m = CKEDITOR.env.ie8Compat ? m - j.getDocument().getDocumentElement().$.scrollLeft * 2 : m - (a.$.scrollWidth - a.$.clientWidth))
                    }
                    var a = j.getFirst(), h;
                    (h = a.getCustomData("activePanel")) && h.onHide && h.onHide.call(this, 1);
                    a.setCustomData("activePanel", this);
                    j.setStyles({top: r + "px", left: m + "px"});
                    j.setOpacity(1);
                    k && k()
                }, this);
                g.isLoaded ? a() : g.onLoad = a;
                CKEDITOR.tools.setTimeout(function () {
                    var a = CKEDITOR.env.webkit && CKEDITOR.document.getWindow().getScrollPosition().y;
                    this.focus();
                    i.element.focus();
                    if (CKEDITOR.env.webkit)CKEDITOR.document.getBody().$.scrollTop =
                        a;
                    this.allowBlur(true);
                    this._.editor.fire("panelShow", this)
                }, 0, this)
            }, CKEDITOR.env.air ? 200 : 0, this);
            this.visible = 1;
            this.onShow && this.onShow.call(this)
        }, focus: function () {
            if (CKEDITOR.env.webkit) {
                var c = CKEDITOR.document.getActive();
                !c.equals(this._.iframe) && c.$.blur()
            }
            (this._.lastFocused || this._.iframe.getFrameDocument().getWindow()).focus()
        }, blur: function () {
            var c = this._.iframe.getFrameDocument().getActive();
            c.is("a") && (this._.lastFocused = c)
        }, hide: function (c) {
            if (this.visible && (!this.onHide || this.onHide.call(this) !==
                true)) {
                this.hideChild();
                CKEDITOR.env.gecko && this._.iframe.getFrameDocument().$.activeElement.blur();
                this.element.setStyle("display", "none");
                this.visible = 0;
                this.element.getFirst().removeCustomData("activePanel");
                if (c = c && this._.returnFocus) {
                    CKEDITOR.env.webkit && c.type && c.getWindow().$.focus();
                    c.focus()
                }
                delete this._.lastFocused;
                this._.editor.fire("panelHide", this)
            }
        }, allowBlur: function (c) {
            var b = this._.panel;
            if (c != void 0)b.allowBlur = c;
            return b.allowBlur
        }, showAsChild: function (c, b, a, e, f, k) {
            if (!(this._.activeChild ==
                c && c._.panel._.offsetParentId == a.getId())) {
                this.hideChild();
                c.onHide = CKEDITOR.tools.bind(function () {
                    CKEDITOR.tools.setTimeout(function () {
                        this._.focused || this.hide()
                    }, 0, this)
                }, this);
                this._.activeChild = c;
                this._.focused = false;
                c.showBlock(b, a, e, f, k);
                this.blur();
                (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) && setTimeout(function () {
                    c.element.getChild(0).$.style.cssText += ""
                }, 100)
            }
        }, hideChild: function (c) {
            var b = this._.activeChild;
            if (b) {
                delete b.onHide;
                delete this._.activeChild;
                b.hide();
                c && this.focus()
            }
        }}});
        CKEDITOR.on("instanceDestroyed", function () {
            var c = CKEDITOR.tools.isEmpty(CKEDITOR.instances), b;
            for (b in f) {
                var a = f[b];
                c ? a.destroy() : a.element.hide()
            }
            c && (f = {})
        })
    }(),CKEDITOR.plugins.add("menu", {requires: "floatpanel", beforeInit: function (c) {
        for (var f = c.config.menu_groups.split(","), d = c._.menuGroups = {}, b = c._.menuItems = {}, a = 0; a < f.length; a++)d[f[a]] = a + 1;
        c.addMenuGroup = function (a, b) {
            d[a] = b || 100
        };
        c.addMenuItem = function (a, c) {
            d[c.group] && (b[a] = new CKEDITOR.menuItem(this, a, c))
        };
        c.addMenuItems = function (a) {
            for (var b in a)this.addMenuItem(b,
                a[b])
        };
        c.getMenuItem = function (a) {
            return b[a]
        };
        c.removeMenuItem = function (a) {
            delete b[a]
        }
    }}),function () {
        function c(a) {
            a.sort(function (a, b) {
                return a.group < b.group ? -1 : a.group > b.group ? 1 : a.order < b.order ? -1 : a.order > b.order ? 1 : 0
            })
        }

        var f = '<span class="cke_menuitem"><a id="{id}" class="cke_menubutton cke_menubutton__{name} cke_menubutton_{state} {cls}" href="{href}" title="{title}" tabindex="-1"_cke_focus=1 hidefocus="true" role="{role}" aria-haspopup="{hasPopup}" aria-disabled="{disabled}" {ariaChecked}';
        CKEDITOR.env.gecko &&
        CKEDITOR.env.mac && (f = f + ' onkeypress="return false;"');
        CKEDITOR.env.gecko && (f = f + ' onblur="this.style.cssText = this.style.cssText;"');
        var f = f + (' onmouseover="CKEDITOR.tools.callFunction({hoverFn},{index});" onmouseout="CKEDITOR.tools.callFunction({moveOutFn},{index});" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},{index}); return false;">'), d = CKEDITOR.addTemplate("menuItem", f + '<span class="cke_menubutton_inner"><span class="cke_menubutton_icon"><span class="cke_button_icon cke_button__{iconName}_icon" style="{iconStyle}"></span></span><span class="cke_menubutton_label">{label}</span>{arrowHtml}</span></a></span>'),
            b = CKEDITOR.addTemplate("menuArrow", '<span class="cke_menuarrow"><span>{label}</span></span>');
        CKEDITOR.menu = CKEDITOR.tools.createClass({$: function (a, b) {
            b = this._.definition = b || {};
            this.id = CKEDITOR.tools.getNextId();
            this.editor = a;
            this.items = [];
            this._.listeners = [];
            this._.level = b.level || 1;
            var c = CKEDITOR.tools.extend({}, b.panel, {css: [CKEDITOR.skin.getPath("editor")], level: this._.level - 1, block: {}}), d = c.block.attributes = c.attributes || {};
            !d.role && (d.role = "menu");
            this._.panelDefinition = c
        }, _: {onShow: function () {
            var a =
                this.editor.getSelection(), b = a && a.getStartElement(), c = this.editor.elementPath(), d = this._.listeners;
            this.removeAll();
            for (var f = 0; f < d.length; f++) {
                var i = d[f](b, a, c);
                if (i)for (var j in i) {
                    var n = this.editor.getMenuItem(j);
                    if (n && (!n.command || this.editor.getCommand(n.command).state)) {
                        n.state = i[j];
                        this.add(n)
                    }
                }
            }
        }, onClick: function (a) {
            this.hide();
            if (a.onClick)a.onClick(); else a.command && this.editor.execCommand(a.command)
        }, onEscape: function (a) {
            var b = this.parent;
            b ? b._.panel.hideChild(1) : a == 27 && this.hide(1);
            return false
        },
            onHide: function () {
                this.onHide && this.onHide()
            }, showSubMenu: function (a) {
                var b = this._.subMenu, c = this.items[a];
                if (c = c.getItems && c.getItems()) {
                    if (b)b.removeAll(); else {
                        b = this._.subMenu = new CKEDITOR.menu(this.editor, CKEDITOR.tools.extend({}, this._.definition, {level: this._.level + 1}, true));
                        b.parent = this;
                        b._.onClick = CKEDITOR.tools.bind(this._.onClick, this)
                    }
                    for (var d in c) {
                        var f = this.editor.getMenuItem(d);
                        if (f) {
                            f.state = c[d];
                            b.add(f)
                        }
                    }
                    var i = this._.panel.getBlock(this.id).element.getDocument().getById(this.id +
                        ("" + a));
                    setTimeout(function () {
                        b.show(i, 2)
                    }, 0)
                } else this._.panel.hideChild(1)
            }}, proto: {add: function (a) {
            if (!a.order)a.order = this.items.length;
            this.items.push(a)
        }, removeAll: function () {
            this.items = []
        }, show: function (a, b, d, f) {
            if (!this.parent) {
                this._.onShow();
                if (!this.items.length)return
            }
            var b = b || (this.editor.lang.dir == "rtl" ? 2 : 1), g = this.items, i = this.editor, j = this._.panel, n = this._.element;
            if (!j) {
                j = this._.panel = new CKEDITOR.ui.floatPanel(this.editor, CKEDITOR.document.getBody(), this._.panelDefinition, this._.level);
                j.onEscape = CKEDITOR.tools.bind(function (a) {
                    if (this._.onEscape(a) === false)return false
                }, this);
                j.onShow = function () {
                    j._.panel.getHolderElement().getParent().addClass("cke cke_reset_all")
                };
                j.onHide = CKEDITOR.tools.bind(function () {
                    this._.onHide && this._.onHide()
                }, this);
                n = j.addBlock(this.id, this._.panelDefinition.block);
                n.autoSize = true;
                var o = n.keys;
                o[40] = "next";
                o[9] = "next";
                o[38] = "prev";
                o[CKEDITOR.SHIFT + 9] = "prev";
                o[i.lang.dir == "rtl" ? 37 : 39] = CKEDITOR.env.ie ? "mouseup" : "click";
                o[32] = CKEDITOR.env.ie ? "mouseup" :
                    "click";
                CKEDITOR.env.ie && (o[13] = "mouseup");
                n = this._.element = n.element;
                o = n.getDocument();
                o.getBody().setStyle("overflow", "hidden");
                o.getElementsByTag("html").getItem(0).setStyle("overflow", "hidden");
                this._.itemOverFn = CKEDITOR.tools.addFunction(function (a) {
                    clearTimeout(this._.showSubTimeout);
                    this._.showSubTimeout = CKEDITOR.tools.setTimeout(this._.showSubMenu, i.config.menu_subMenuDelay || 400, this, [a])
                }, this);
                this._.itemOutFn = CKEDITOR.tools.addFunction(function () {
                    clearTimeout(this._.showSubTimeout)
                }, this);
                this._.itemClickFn = CKEDITOR.tools.addFunction(function (a) {
                    var b = this.items[a];
                    if (b.state == CKEDITOR.TRISTATE_DISABLED)this.hide(1); else if (b.getItems)this._.showSubMenu(a); else this._.onClick(b)
                }, this)
            }
            c(g);
            for (var o = i.elementPath(), o = ['<div class="cke_menu' + (o && o.direction() != i.lang.dir ? " cke_mixed_dir_content" : "") + '" role="presentation">'], q = g.length, l = q && g[0].group, m = 0; m < q; m++) {
                var r = g[m];
                if (l != r.group) {
                    o.push('<div class="cke_menuseparator" role="separator"></div>');
                    l = r.group
                }
                r.render(this, m, o)
            }
            o.push("</div>");
            n.setHtml(o.join(""));
            CKEDITOR.ui.fire("ready", this);
            this.parent ? this.parent._.panel.showAsChild(j, this.id, a, b, d, f) : j.showBlock(this.id, a, b, d, f);
            i.fire("menuShow", [j])
        }, addListener: function (a) {
            this._.listeners.push(a)
        }, hide: function (a) {
            this._.onHide && this._.onHide();
            this._.panel && this._.panel.hide(a)
        }}});
        CKEDITOR.menuItem = CKEDITOR.tools.createClass({$: function (a, b, c) {
            CKEDITOR.tools.extend(this, c, {order: 0, className: "cke_menubutton__" + b});
            this.group = a._.menuGroups[this.group];
            this.editor = a;
            this.name =
                b
        }, proto: {render: function (a, c, f) {
            var k = a.id + ("" + c), g = typeof this.state == "undefined" ? CKEDITOR.TRISTATE_OFF : this.state, i = "", j = g == CKEDITOR.TRISTATE_ON ? "on" : g == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off";
            this.role in{menuitemcheckbox: 1, menuitemradio: 1} && (i = ' aria-checked="' + (g == CKEDITOR.TRISTATE_ON ? "true" : "false") + '"');
            var n = this.getItems, o = "&#" + (this.editor.lang.dir == "rtl" ? "9668" : "9658") + ";", q = this.name;
            if (this.icon && !/\./.test(this.icon))q = this.icon;
            a = {id: k, name: this.name, iconName: q, label: this.label,
                cls: this.className || "", state: j, hasPopup: n ? "true" : "false", disabled: g == CKEDITOR.TRISTATE_DISABLED, title: this.label, href: "javascript:void('" + (this.label || "").replace("'") + "')", hoverFn: a._.itemOverFn, moveOutFn: a._.itemOutFn, clickFn: a._.itemClickFn, index: c, iconStyle: CKEDITOR.skin.getIconStyle(q, this.editor.lang.dir == "rtl", q == this.icon ? null : this.icon, this.iconOffset), arrowHtml: n ? b.output({label: o}) : "", role: this.role ? this.role : "menuitem", ariaChecked: i};
            d.output(a, f)
        }}})
    }(),CKEDITOR.config.menu_groups = "clipboard,form,tablecell,tablecellproperties,tablerow,tablecolumn,table,anchor,link,image,flash,checkbox,radio,textfield,hiddenfield,imagebutton,button,select,textarea,div",
    CKEDITOR.plugins.add("contextmenu", {requires: "menu", onLoad: function () {
        CKEDITOR.plugins.contextMenu = CKEDITOR.tools.createClass({base: CKEDITOR.menu, $: function (c) {
            this.base.call(this, c, {panel: {className: "cke_menu_panel", attributes: {"aria-label": c.lang.contextmenu.options}}})
        }, proto: {addTarget: function (c, f) {
            c.on("contextmenu", function (a) {
                var a = a.data, b = CKEDITOR.env.webkit ? d : CKEDITOR.env.mac ? a.$.metaKey : a.$.ctrlKey;
                if (!f || !b) {
                    a.preventDefault();
                    if (CKEDITOR.env.mac && CKEDITOR.env.webkit) {
                        var b = this.editor,
                            c = (new CKEDITOR.dom.elementPath(a.getTarget(), b.editable())).contains(function (a) {
                                return a.hasAttribute("contenteditable")
                            }, true);
                        c && c.getAttribute("contenteditable") == "false" && b.getSelection().fake(c)
                    }
                    var c = a.getTarget().getDocument(), k = a.getTarget().getDocument().getDocumentElement(), b = !c.equals(CKEDITOR.document), c = c.getWindow().getScrollPosition(), g = b ? a.$.clientX : a.$.pageX || c.x + a.$.clientX, i = b ? a.$.clientY : a.$.pageY || c.y + a.$.clientY;
                    CKEDITOR.tools.setTimeout(function () {
                        this.open(k, null, g, i)
                    }, CKEDITOR.env.ie ?
                        200 : 0, this)
                }
            }, this);
            if (CKEDITOR.env.webkit) {
                var d, b = function () {
                    d = 0
                };
                c.on("keydown", function (a) {
                    d = CKEDITOR.env.mac ? a.data.$.metaKey : a.data.$.ctrlKey
                });
                c.on("keyup", b);
                c.on("contextmenu", b)
            }
        }, open: function (c, f, d, b) {
            this.editor.focus();
            c = c || CKEDITOR.document.getDocumentElement();
            this.editor.selectionChange(1);
            this.show(c, f, d, b)
        }}})
    }, beforeInit: function (c) {
        var f = c.contextMenu = new CKEDITOR.plugins.contextMenu(c);
        c.on("contentDom", function () {
            f.addTarget(c.editable(), c.config.browserContextMenuOnCtrl !==
                false)
        });
        c.addCommand("contextMenu", {exec: function () {
            c.contextMenu.open(c.document.getBody())
        }});
        c.setKeystroke(CKEDITOR.SHIFT + 121, "contextMenu");
        c.setKeystroke(CKEDITOR.CTRL + CKEDITOR.SHIFT + 121, "contextMenu")
    }}),function () {
        var c;

        function f(b, f) {
            function k(a) {
                a = n.list[a];
                if (a.equals(b.editable()) || a.getAttribute("contenteditable") == "true") {
                    var c = b.createRange();
                    c.selectNodeContents(a);
                    c.select()
                } else b.getSelection().selectElement(a);
                b.focus()
            }

            function g() {
                j && j.setHtml(d);
                delete n.list
            }

            var i = b.ui.spaceId("path"),
                j, n = b._.elementsPath, o = n.idBase;
            f.html = f.html + ('<span id="' + i + '_label" class="cke_voice_label">' + b.lang.elementspath.eleLabel + '</span><span id="' + i + '" class="cke_path" role="group" aria-labelledby="' + i + '_label">' + d + "</span>");
            b.on("uiReady", function () {
                var a = b.ui.space("path");
                a && b.focusManager.add(a, 1)
            });
            n.onClick = k;
            var q = CKEDITOR.tools.addFunction(k), l = CKEDITOR.tools.addFunction(function (a, c) {
                var d = n.idBase, f, c = new CKEDITOR.dom.event(c);
                f = b.lang.dir == "rtl";
                switch (c.getKeystroke()) {
                    case f ? 39 : 37:
                    case 9:
                        (f =
                            CKEDITOR.document.getById(d + (a + 1))) || (f = CKEDITOR.document.getById(d + "0"));
                        f.focus();
                        return false;
                    case f ? 37 : 39:
                    case CKEDITOR.SHIFT + 9:
                        (f = CKEDITOR.document.getById(d + (a - 1))) || (f = CKEDITOR.document.getById(d + (n.list.length - 1)));
                        f.focus();
                        return false;
                    case 27:
                        b.focus();
                        return false;
                    case 13:
                    case 32:
                        k(a);
                        return false
                }
                return true
            });
            b.on("selectionChange", function () {
                b.editable();
                for (var c = [], f = n.list = [], g = [], h = n.filters, k = true, s = b.elementPath().elements, x, y = s.length; y--;) {
                    var v = s[y], A = 0;
                    x = v.data("cke-display-name") ?
                        v.data("cke-display-name") : v.data("cke-real-element-type") ? v.data("cke-real-element-type") : v.getName();
                    k = v.hasAttribute("contenteditable") ? v.getAttribute("contenteditable") == "true" : k;
                    !k && !v.hasAttribute("contenteditable") && (A = 1);
                    for (var B = 0; B < h.length; B++) {
                        var E = h[B](v, x);
                        if (E === false) {
                            A = 1;
                            break
                        }
                        x = E || x
                    }
                    if (!A) {
                        f.unshift(v);
                        g.unshift(x)
                    }
                }
                f = f.length;
                for (h = 0; h < f; h++) {
                    x = g[h];
                    k = b.lang.elementspath.eleTitle.replace(/%1/, x);
                    x = a.output({id: o + h, label: k, text: x, jsTitle: "javascript:void('" + x + "')", index: h, keyDownFn: l,
                        clickFn: q});
                    c.unshift(x)
                }
                j || (j = CKEDITOR.document.getById(i));
                g = j;
                g.setHtml(c.join("") + d);
                b.fire("elementsPathUpdate", {space: g})
            });
            b.on("readOnly", g);
            b.on("contentDomUnload", g);
            b.addCommand("elementsPathFocus", c);
            b.setKeystroke(CKEDITOR.ALT + 122, "elementsPathFocus")
        }

        c = {editorFocus: false, readOnly: 1, exec: function (a) {
            (a = CKEDITOR.document.getById(a._.elementsPath.idBase + "0")) && a.focus(CKEDITOR.env.ie || CKEDITOR.env.air)
        }};
        var d = '<span class="cke_path_empty">&nbsp;</span>', b = "";
        CKEDITOR.env.gecko && CKEDITOR.env.mac &&
        (b = b + ' onkeypress="return false;"');
        CKEDITOR.env.gecko && (b = b + ' onblur="this.style.cssText = this.style.cssText;"');
        var a = CKEDITOR.addTemplate("pathItem", '<a id="{id}" href="{jsTitle}" tabindex="-1" class="cke_path_item" title="{label}"' + b + ' hidefocus="true"  onkeydown="return CKEDITOR.tools.callFunction({keyDownFn},{index}, event );" onclick="CKEDITOR.tools.callFunction({clickFn},{index}); return false;" role="button" aria-label="{label}">{text}</a>');
        CKEDITOR.plugins.add("elementspath", {init: function (a) {
            a._.elementsPath =
            {idBase: "cke_elementspath_" + CKEDITOR.tools.getNextNumber() + "_", filters: []};
            a.on("uiSpace", function (b) {
                b.data.space == "bottom" && f(a, b.data)
            })
        }})
    }(),function () {
        function c(a, b, c) {
            c = a.config.forceEnterMode || c;
            if (a.mode == "wysiwyg") {
                if (!b)b = a.activeEnterMode;
                if (!a.elementPath().isContextFor("p")) {
                    b = CKEDITOR.ENTER_BR;
                    c = 1
                }
                a.fire("saveSnapshot");
                b == CKEDITOR.ENTER_BR ? e(a, b, null, c) : h(a, b, null, c);
                a.fire("saveSnapshot")
            }
        }

        function f(a) {
            for (var a = a.getSelection().getRanges(true), b = a.length - 1; b > 0; b--)a[b].deleteContents();
            return a[0]
        }

        CKEDITOR.plugins.add("enterkey", {init: function (a) {
            a.addCommand("enter", {modes: {wysiwyg: 1}, editorFocus: false, exec: function (a) {
                c(a)
            }});
            a.addCommand("shiftEnter", {modes: {wysiwyg: 1}, editorFocus: false, exec: function (a) {
                c(a, a.activeShiftEnterMode, 1)
            }});
            a.setKeystroke([
                [13, "enter"],
                [CKEDITOR.SHIFT + 13, "shiftEnter"]
            ])
        }});
        var d = CKEDITOR.dom.walker.whitespaces(), b = CKEDITOR.dom.walker.bookmark();
        CKEDITOR.plugins.enterkey = {enterBlock: function (a, c, h, n) {
            if (h = h || f(a)) {
                var o = h.document, q = h.checkStartOfBlock(),
                    l = h.checkEndOfBlock(), m = a.elementPath(h.startContainer).block, r = c == CKEDITOR.ENTER_DIV ? "div" : "p", t;
                if (q && l) {
                    if (m && (m.is("li") || m.getParent().is("li"))) {
                        h = m.getParent();
                        t = h.getParent();
                        var n = !m.hasPrevious(), p = !m.hasNext(), r = a.getSelection(), u = r.createBookmarks(), q = m.getDirection(1), l = m.getAttribute("class"), s = m.getAttribute("style"), x = t.getDirection(1) != q, a = a.enterMode != CKEDITOR.ENTER_BR || x || s || l;
                        if (t.is("li"))if (n || p)m[n ? "insertBefore" : "insertAfter"](t); else m.breakParent(t); else {
                            if (a) {
                                t = o.createElement(c ==
                                    CKEDITOR.ENTER_P ? "p" : "div");
                                x && t.setAttribute("dir", q);
                                s && t.setAttribute("style", s);
                                l && t.setAttribute("class", l);
                                m.moveChildren(t);
                                if (n || p)t[n ? "insertBefore" : "insertAfter"](h); else {
                                    m.breakParent(h);
                                    t.insertAfter(h)
                                }
                            } else {
                                m.appendBogus(true);
                                if (n || p)for (; o = m[n ? "getFirst" : "getLast"]();)o[n ? "insertBefore" : "insertAfter"](h); else for (m.breakParent(h); o = m.getLast();)o.insertAfter(h)
                            }
                            m.remove()
                        }
                        r.selectBookmarks(u);
                        return
                    }
                    if (m && m.getParent().is("blockquote")) {
                        m.breakParent(m.getParent());
                        m.getPrevious().getFirst(CKEDITOR.dom.walker.invisible(1)) ||
                        m.getPrevious().remove();
                        m.getNext().getFirst(CKEDITOR.dom.walker.invisible(1)) || m.getNext().remove();
                        h.moveToElementEditStart(m);
                        h.select();
                        return
                    }
                } else if (m && m.is("pre") && !l) {
                    e(a, c, h, n);
                    return
                }
                if (l = h.splitBlock(r)) {
                    c = l.previousBlock;
                    m = l.nextBlock;
                    a = l.wasStartOfBlock;
                    q = l.wasEndOfBlock;
                    if (m) {
                        u = m.getParent();
                        if (u.is("li")) {
                            m.breakParent(u);
                            m.move(m.getNext(), 1)
                        }
                    } else if (c && (u = c.getParent()) && u.is("li")) {
                        c.breakParent(u);
                        u = c.getNext();
                        h.moveToElementEditStart(u);
                        c.move(c.getPrevious())
                    }
                    if (!a && !q) {
                        if (m.is("li")) {
                            t =
                                h.clone();
                            t.selectNodeContents(m);
                            t = new CKEDITOR.dom.walker(t);
                            t.evaluator = function (a) {
                                return!(b(a) || d(a) || a.type == CKEDITOR.NODE_ELEMENT && a.getName()in CKEDITOR.dtd.$inline && !(a.getName()in CKEDITOR.dtd.$empty))
                            };
                            (u = t.next()) && (u.type == CKEDITOR.NODE_ELEMENT && u.is("ul", "ol")) && (CKEDITOR.env.needsBrFiller ? o.createElement("br") : o.createText(" ")).insertBefore(u)
                        }
                        m && h.moveToElementEditStart(m)
                    } else {
                        if (c) {
                            if (c.is("li") || !k.test(c.getName()) && !c.is("pre"))t = c.clone()
                        } else m && (t = m.clone());
                        if (t)n && !t.is("li") &&
                        t.renameNode(r); else if (u && u.is("li"))t = u; else {
                            t = o.createElement(r);
                            c && (p = c.getDirection()) && t.setAttribute("dir", p)
                        }
                        if (o = l.elementPath) {
                            n = 0;
                            for (r = o.elements.length; n < r; n++) {
                                u = o.elements[n];
                                if (u.equals(o.block) || u.equals(o.blockLimit))break;
                                if (CKEDITOR.dtd.$removeEmpty[u.getName()]) {
                                    u = u.clone();
                                    t.moveChildren(u);
                                    t.append(u)
                                }
                            }
                        }
                        t.appendBogus();
                        t.getParent() || h.insertNode(t);
                        t.is("li") && t.removeAttribute("value");
                        if (CKEDITOR.env.ie && a && (!q || !c.getChildCount())) {
                            h.moveToElementEditStart(q ? c : t);
                            h.select()
                        }
                        h.moveToElementEditStart(a && !q ? m : t)
                    }
                    h.select();
                    h.scrollIntoView()
                }
            }
        }, enterBr: function (a, b, c, e) {
            if (c = c || f(a)) {
                var d = c.document, q = c.checkEndOfBlock(), l = new CKEDITOR.dom.elementPath(a.getSelection().getStartElement()), m = l.block, l = m && l.block.getName();
                if (!e && l == "li")h(a, b, c, e); else {
                    if (!e && q && k.test(l))if (q = m.getDirection()) {
                        d = d.createElement("div");
                        d.setAttribute("dir", q);
                        d.insertAfter(m);
                        c.setStart(d, 0)
                    } else {
                        d.createElement("br").insertAfter(m);
                        CKEDITOR.env.gecko && d.createText("").insertAfter(m);
                        c.setStartAt(m.getNext(), CKEDITOR.env.ie ?
                            CKEDITOR.POSITION_BEFORE_START : CKEDITOR.POSITION_AFTER_START)
                    } else {
                        m = l == "pre" && CKEDITOR.env.ie && CKEDITOR.env.version < 8 ? d.createText("\r") : d.createElement("br");
                        c.deleteContents();
                        c.insertNode(m);
                        if (CKEDITOR.env.needsBrFiller) {
                            d.createText("﻿").insertAfter(m);
                            q && m.getParent().appendBogus();
                            m.getNext().$.nodeValue = "";
                            c.setStartAt(m.getNext(), CKEDITOR.POSITION_AFTER_START)
                        } else c.setStartAt(m, CKEDITOR.POSITION_AFTER_END)
                    }
                    c.collapse(true);
                    c.select();
                    c.scrollIntoView()
                }
            }
        }};
        var a = CKEDITOR.plugins.enterkey,
            e = a.enterBr, h = a.enterBlock, k = /^h[1-6]$/
    }(),function () {
        function c(c, d) {
            var b = {}, a = [], e = {nbsp: " ", shy: "­", gt: ">", lt: "<", amp: "&", apos: "'", quot: '"'}, c = c.replace(/\b(nbsp|shy|gt|lt|amp|apos|quot)(?:,|$)/g, function (c, f) {
                var g = d ? "&" + f + ";" : e[f];
                b[g] = d ? e[f] : "&" + f + ";";
                a.push(g);
                return""
            });
            if (!d && c) {
                var c = c.split(","), h = document.createElement("div"), k;
                h.innerHTML = "&" + c.join(";&") + ";";
                k = h.innerHTML;
                h = null;
                for (h = 0; h < k.length; h++) {
                    var g = k.charAt(h);
                    b[g] = "&" + c[h] + ";";
                    a.push(g)
                }
            }
            b.regex = a.join(d ? "|" : "");
            return b
        }

        CKEDITOR.plugins.add("entities", {afterInit: function (f) {
            var d = f.config;
            if (f = (f = f.dataProcessor) && f.htmlFilter) {
                var b = [];
                d.basicEntities !== false && b.push("nbsp,gt,lt,amp");
                if (d.entities) {
                    b.length && b.push("quot,iexcl,cent,pound,curren,yen,brvbar,sect,uml,copy,ordf,laquo,not,shy,reg,macr,deg,plusmn,sup2,sup3,acute,micro,para,middot,cedil,sup1,ordm,raquo,frac14,frac12,frac34,iquest,times,divide,fnof,bull,hellip,prime,Prime,oline,frasl,weierp,image,real,trade,alefsym,larr,uarr,rarr,darr,harr,crarr,lArr,uArr,rArr,dArr,hArr,forall,part,exist,empty,nabla,isin,notin,ni,prod,sum,minus,lowast,radic,prop,infin,ang,and,or,cap,cup,int,there4,sim,cong,asymp,ne,equiv,le,ge,sub,sup,nsub,sube,supe,oplus,otimes,perp,sdot,lceil,rceil,lfloor,rfloor,lang,rang,loz,spades,clubs,hearts,diams,circ,tilde,ensp,emsp,thinsp,zwnj,zwj,lrm,rlm,ndash,mdash,lsquo,rsquo,sbquo,ldquo,rdquo,bdquo,dagger,Dagger,permil,lsaquo,rsaquo,euro");
                    d.entities_latin && b.push("Agrave,Aacute,Acirc,Atilde,Auml,Aring,AElig,Ccedil,Egrave,Eacute,Ecirc,Euml,Igrave,Iacute,Icirc,Iuml,ETH,Ntilde,Ograve,Oacute,Ocirc,Otilde,Ouml,Oslash,Ugrave,Uacute,Ucirc,Uuml,Yacute,THORN,szlig,agrave,aacute,acirc,atilde,auml,aring,aelig,ccedil,egrave,eacute,ecirc,euml,igrave,iacute,icirc,iuml,eth,ntilde,ograve,oacute,ocirc,otilde,ouml,oslash,ugrave,uacute,ucirc,uuml,yacute,thorn,yuml,OElig,oelig,Scaron,scaron,Yuml");
                    d.entities_greek && b.push("Alpha,Beta,Gamma,Delta,Epsilon,Zeta,Eta,Theta,Iota,Kappa,Lambda,Mu,Nu,Xi,Omicron,Pi,Rho,Sigma,Tau,Upsilon,Phi,Chi,Psi,Omega,alpha,beta,gamma,delta,epsilon,zeta,eta,theta,iota,kappa,lambda,mu,nu,xi,omicron,pi,rho,sigmaf,sigma,tau,upsilon,phi,chi,psi,omega,thetasym,upsih,piv");
                    d.entities_additional && b.push(d.entities_additional)
                }
                var a = c(b.join(",")), e = a.regex ? "[" + a.regex + "]" : "a^";
                delete a.regex;
                d.entities && d.entities_processNumerical && (e = "[^ -~]|" + e);
                var e = RegExp(e, "g"), h = function (b) {
                    return d.entities_processNumerical == "force" || !a[b] ? "&#" + b.charCodeAt(0) + ";" : a[b]
                }, k = c("nbsp,gt,lt,amp,shy", true), g = RegExp(k.regex, "g"), i = function (a) {
                    return k[a]
                };
                f.addRules({text: function (a) {
                    return a.replace(g, i).replace(e, h)
                }}, {applyToAll: true, excludeNestedEditable: true})
            }
        }})
    }(),CKEDITOR.config.basicEntities = !0,CKEDITOR.config.entities = !0,CKEDITOR.config.entities_latin = !0,CKEDITOR.config.entities_greek = !0,CKEDITOR.config.entities_additional = "#39",CKEDITOR.plugins.add("popup"),CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {popup: function (c, f, d, b) {
        f = f || "80%";
        d = d || "70%";
        typeof f == "string" && (f.length > 1 && f.substr(f.length - 1, 1) == "%") && (f = parseInt(window.screen.width * parseInt(f, 10) / 100, 10));
        typeof d == "string" && (d.length > 1 && d.substr(d.length - 1, 1) == "%") && (d = parseInt(window.screen.height * parseInt(d, 10) / 100, 10));
        f < 640 && (f = 640);
        d < 420 && (d = 420);
        var a = parseInt((window.screen.height - d) / 2, 10), e = parseInt((window.screen.width - f) / 2, 10), b = (b || "location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,resizable=yes,scrollbars=yes") + ",width=" + f + ",height=" + d + ",top=" + a + ",left=" + e, h = window.open("", null, b, true);
        if (!h)return false;
        try {
            if (navigator.userAgent.toLowerCase().indexOf(" chrome/") == -1) {
                h.moveTo(e, a);
                h.resizeTo(f, d)
            }
            h.focus();
            h.location.href = c
        } catch (k) {
            window.open(c, null, b, true)
        }
        return true
    }}),
    function () {
        function c(a, b) {
            var c = [];
            if (b)for (var e in b)c.push(e + "=" + encodeURIComponent(b[e])); else return a;
            return a + (a.indexOf("?") != -1 ? "&" : "?") + c.join("&")
        }

        function f(a) {
            a = a + "";
            return a.charAt(0).toUpperCase() + a.substr(1)
        }

        function d() {
            var a = this.getDialog(), b = a.getParentEditor();
            b._.filebrowserSe = this;
            var e = b.config["filebrowser" + f(a.getName()) + "WindowWidth"] || b.config.filebrowserWindowWidth || "80%", a = b.config["filebrowser" + f(a.getName()) + "WindowHeight"] || b.config.filebrowserWindowHeight || "70%",
                d = this.filebrowser.params || {};
            d.CKEditor = b.name;
            d.CKEditorFuncNum = b._.filebrowserFn;
            if (!d.langCode)d.langCode = b.langCode;
            d = c(this.filebrowser.url, d);
            b.popup(d, e, a, b.config.filebrowserWindowFeatures || b.config.fileBrowserWindowFeatures)
        }

        function b() {
            var a = this.getDialog();
            a.getParentEditor()._.filebrowserSe = this;
            return!a.getContentElement(this["for"][0], this["for"][1]).getInputElement().$.value || !a.getContentElement(this["for"][0], this["for"][1]).getAction() ? false : true
        }

        function a(a, b, e) {
            var d = e.params ||
            {};
            d.CKEditor = a.name;
            d.CKEditorFuncNum = a._.filebrowserFn;
            if (!d.langCode)d.langCode = a.langCode;
            b.action = c(e.url, d);
            b.filebrowser = e
        }

        function e(c, h, k, n) {
            if (n && n.length)for (var o, q = n.length; q--;) {
                o = n[q];
                (o.type == "hbox" || o.type == "vbox" || o.type == "fieldset") && e(c, h, k, o.children);
                if (o.filebrowser) {
                    if (typeof o.filebrowser == "string")o.filebrowser = {action: o.type == "fileButton" ? "QuickUpload" : "Browse", target: o.filebrowser};
                    if (o.filebrowser.action == "Browse") {
                        var l = o.filebrowser.url;
                        if (l === void 0) {
                            l = c.config["filebrowser" +
                                f(h) + "BrowseUrl"];
                            if (l === void 0)l = c.config.filebrowserBrowseUrl
                        }
                        if (l) {
                            o.onClick = d;
                            o.filebrowser.url = l;
                            o.hidden = false
                        }
                    } else if (o.filebrowser.action == "QuickUpload" && o["for"]) {
                        l = o.filebrowser.url;
                        if (l === void 0) {
                            l = c.config["filebrowser" + f(h) + "UploadUrl"];
                            if (l === void 0)l = c.config.filebrowserUploadUrl
                        }
                        if (l) {
                            var m = o.onClick;
                            o.onClick = function (a) {
                                var c = a.sender;
                                return m && m.call(c, a) === false ? false : b.call(c, a)
                            };
                            o.filebrowser.url = l;
                            o.hidden = false;
                            a(c, k.getContents(o["for"][0]).get(o["for"][1]), o.filebrowser)
                        }
                    }
                }
            }
        }

        function h(a, b, c) {
            if (c.indexOf(";") !== -1) {
                for (var c = c.split(";"), e = 0; e < c.length; e++)if (h(a, b, c[e]))return true;
                return false
            }
            return(a = a.getContents(b).get(c).filebrowser) && a.url
        }

        function k(a, b) {
            var c = this._.filebrowserSe.getDialog(), e = this._.filebrowserSe["for"], d = this._.filebrowserSe.filebrowser.onSelect;
            e && c.getContentElement(e[0], e[1]).reset();
            if (!(typeof b == "function" && b.call(this._.filebrowserSe) === false) && !(d && d.call(this._.filebrowserSe, a, b) === false)) {
                typeof b == "string" && b && alert(b);
                if (a) {
                    e =
                        this._.filebrowserSe;
                    c = e.getDialog();
                    if (e = e.filebrowser.target || null) {
                        e = e.split(":");
                        if (d = c.getContentElement(e[0], e[1])) {
                            d.setValue(a);
                            c.selectPage(e[0])
                        }
                    }
                }
            }
        }

        CKEDITOR.plugins.add("filebrowser", {requires: "popup", init: function (a) {
            a._.filebrowserFn = CKEDITOR.tools.addFunction(k, a);
            a.on("destroy", function () {
                CKEDITOR.tools.removeFunction(this._.filebrowserFn)
            })
        }});
        CKEDITOR.on("dialogDefinition", function (a) {
            if (a.editor.plugins.filebrowser)for (var b = a.data.definition, c, d = 0; d < b.contents.length; ++d)if (c = b.contents[d]) {
                e(a.editor,
                    a.data.name, b, c.elements);
                if (c.hidden && c.filebrowser)c.hidden = !h(b, c.id, c.filebrowser)
            }
        })
    }(),function () {
        function c(a) {
            var c = a.config, h = a.fire("uiSpace", {space: "top", html: ""}).html, k = function () {
                function f(a, c, e) {
                    g.setStyle(c, b(e));
                    g.setStyle("position", a)
                }

                function h(a) {
                    var b = j.getDocumentPosition();
                    switch (a) {
                        case "top":
                            f("absolute", "top", b.y - p - x);
                            break;
                        case "pin":
                            f("fixed", "top", v);
                            break;
                        case "bottom":
                            f("absolute", "top", b.y + (r.height || r.bottom - r.top) + x)
                    }
                    i = a
                }

                var i, j, m, r, t, p, u, s = c.floatSpaceDockedOffsetX ||
                    0, x = c.floatSpaceDockedOffsetY || 0, y = c.floatSpacePinnedOffsetX || 0, v = c.floatSpacePinnedOffsetY || 0;
                return function (c) {
                    if (j = a.editable()) {
                        c && c.name == "focus" && g.show();
                        g.removeStyle("left");
                        g.removeStyle("right");
                        m = g.getClientRect();
                        r = j.getClientRect();
                        t = d.getViewPaneSize();
                        p = m.height;
                        u = "pageXOffset"in d.$ ? d.$.pageXOffset : CKEDITOR.document.$.documentElement.scrollLeft;
                        if (i) {
                            p + x <= r.top ? h("top") : p + x > t.height - r.bottom ? h("pin") : h("bottom");
                            var c = t.width / 2, c = r.left > 0 && r.right < t.width && r.width > m.width ? a.config.contentsLangDirection ==
                                "rtl" ? "right" : "left" : c - r.left > r.right - c ? "left" : "right", e;
                            if (m.width > t.width) {
                                c = "left";
                                e = 0
                            } else {
                                e = c == "left" ? r.left > 0 ? r.left : 0 : r.right < t.width ? t.width - r.right : 0;
                                if (e + m.width > t.width) {
                                    c = c == "left" ? "right" : "left";
                                    e = 0
                                }
                            }
                            g.setStyle(c, b((i == "pin" ? y : s) + e + (i == "pin" ? 0 : c == "left" ? u : -u)))
                        } else {
                            i = "pin";
                            h("pin");
                            k(c)
                        }
                    }
                }
            }();
            if (h) {
                var g = CKEDITOR.document.getBody().append(CKEDITOR.dom.element.createFromHtml(f.output({content: h, id: a.id, langDir: a.lang.dir, langCode: a.langCode, name: a.name, style: "display:none;z-index:" + (c.baseFloatZIndex -
                    1), topId: a.ui.spaceId("top"), voiceLabel: a.lang.editorPanel + ", " + a.name}))), i = CKEDITOR.tools.eventsBuffer(500, k), j = CKEDITOR.tools.eventsBuffer(100, k);
                g.unselectable();
                g.on("mousedown", function (a) {
                    a = a.data;
                    a.getTarget().hasAscendant("a", 1) || a.preventDefault()
                });
                a.on("focus", function (b) {
                    k(b);
                    a.on("change", i.input);
                    d.on("scroll", j.input);
                    d.on("resize", j.input)
                });
                a.on("blur", function () {
                    g.hide();
                    a.removeListener("change", i.input);
                    d.removeListener("scroll", j.input);
                    d.removeListener("resize", j.input)
                });
                a.on("destroy",
                    function () {
                        d.removeListener("scroll", j.input);
                        d.removeListener("resize", j.input);
                        g.clearCustomData();
                        g.remove()
                    });
                a.focusManager.hasFocus && g.show();
                a.focusManager.add(g, 1)
            }
        }

        var f = CKEDITOR.addTemplate("floatcontainer", '<div id="cke_{name}" class="cke {id} cke_reset_all cke_chrome cke_editor_{name} cke_float cke_{langDir} ' + CKEDITOR.env.cssClass + '" dir="{langDir}" title="' + (CKEDITOR.env.gecko ? " " : "") + '" lang="{langCode}" role="application" style="{style}" aria-labelledby="cke_{name}_arialbl"><span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span><div class="cke_inner"><div id="{topId}" class="cke_top" role="presentation">{content}</div></div></div>'),
            d = CKEDITOR.document.getWindow(), b = CKEDITOR.tools.cssLength;
        CKEDITOR.plugins.add("floatingspace", {init: function (a) {
            a.on("loaded", function () {
                c(this)
            }, null, null, 20)
        }})
    }(),CKEDITOR.plugins.add("htmlwriter", {init: function (c) {
        var f = new CKEDITOR.htmlWriter;
        f.forceSimpleAmpersand = c.config.forceSimpleAmpersand;
        f.indentationChars = c.config.dataIndentationChars || "\t";
        c.dataProcessor.writer = f
    }}),CKEDITOR.htmlWriter = CKEDITOR.tools.createClass({base: CKEDITOR.htmlParser.basicWriter, $: function () {
        this.base();
        this.indentationChars =
            "\t";
        this.selfClosingEnd = " />";
        this.lineBreakChars = "\n";
        this.sortAttributes = 1;
        this._.indent = 0;
        this._.indentation = "";
        this._.inPre = 0;
        this._.rules = {};
        var c = CKEDITOR.dtd, f;
        for (f in CKEDITOR.tools.extend({}, c.$nonBodyContent, c.$block, c.$listItem, c.$tableContent))this.setRules(f, {indent: !c[f]["#"], breakBeforeOpen: 1, breakBeforeClose: !c[f]["#"], breakAfterClose: 1, needsSpace: f in c.$block && !(f in{li: 1, dt: 1, dd: 1})});
        this.setRules("br", {breakAfterOpen: 1});
        this.setRules("title", {indent: 0, breakAfterOpen: 0});
        this.setRules("style",
            {indent: 0, breakBeforeClose: 1});
        this.setRules("pre", {breakAfterOpen: 1, indent: 0})
    }, proto: {openTag: function (c) {
        var f = this._.rules[c];
        this._.afterCloser && (f && f.needsSpace && this._.needsSpace) && this._.output.push("\n");
        if (this._.indent)this.indentation(); else if (f && f.breakBeforeOpen) {
            this.lineBreak();
            this.indentation()
        }
        this._.output.push("<", c);
        this._.afterCloser = 0
    }, openTagClose: function (c, f) {
        var d = this._.rules[c];
        if (f) {
            this._.output.push(this.selfClosingEnd);
            if (d && d.breakAfterClose)this._.needsSpace = d.needsSpace
        } else {
            this._.output.push(">");
            if (d && d.indent)this._.indentation = this._.indentation + this.indentationChars
        }
        d && d.breakAfterOpen && this.lineBreak();
        c == "pre" && (this._.inPre = 1)
    }, attribute: function (c, f) {
        if (typeof f == "string") {
            this.forceSimpleAmpersand && (f = f.replace(/&amp;/g, "&"));
            f = CKEDITOR.tools.htmlEncodeAttr(f)
        }
        this._.output.push(" ", c, '="', f, '"')
    }, closeTag: function (c) {
        var f = this._.rules[c];
        if (f && f.indent)this._.indentation = this._.indentation.substr(this.indentationChars.length);
        if (this._.indent)this.indentation(); else if (f && f.breakBeforeClose) {
            this.lineBreak();
            this.indentation()
        }
        this._.output.push("</", c, ">");
        c == "pre" && (this._.inPre = 0);
        if (f && f.breakAfterClose) {
            this.lineBreak();
            this._.needsSpace = f.needsSpace
        }
        this._.afterCloser = 1
    }, text: function (c) {
        if (this._.indent) {
            this.indentation();
            !this._.inPre && (c = CKEDITOR.tools.ltrim(c))
        }
        this._.output.push(c)
    }, comment: function (c) {
        this._.indent && this.indentation();
        this._.output.push("<\!--", c, "--\>")
    }, lineBreak: function () {
        !this._.inPre && this._.output.length > 0 && this._.output.push(this.lineBreakChars);
        this._.indent = 1
    },
        indentation: function () {
            !this._.inPre && this._.indentation && this._.output.push(this._.indentation);
            this._.indent = 0
        }, reset: function () {
            this._.output = [];
            this._.indent = 0;
            this._.indentation = "";
            this._.afterCloser = 0;
            this._.inPre = 0
        }, setRules: function (c, f) {
            var d = this._.rules[c];
            d ? CKEDITOR.tools.extend(d, f, true) : this._.rules[c] = f
        }}}),function () {
        function c(c, b) {
            b || (b = c.getSelection().getSelectedElement());
            if (b && b.is("img") && !b.data("cke-realelement") && !b.isReadOnly())return b
        }

        function f(c) {
            var b = c.getStyle("float");
            if (b == "inherit" || b == "none")b = 0;
            b || (b = c.getAttribute("align"));
            return b
        }

        CKEDITOR.plugins.add("image", {requires: "dialog", init: function (d) {
            if (!d.plugins.image2) {
                CKEDITOR.dialog.add("image", this.path + "dialogs/image.js");
                var b = "img[alt,!src]{border-style,border-width,float,height,margin,margin-bottom,margin-left,margin-right,margin-top,width}";
                CKEDITOR.dialog.isTabEnabled(d, "image", "advanced") && (b = "img[alt,dir,id,lang,longdesc,!src,title]{*}(*)");
                d.addCommand("image", new CKEDITOR.dialogCommand("image",
                    {allowedContent: b, requiredContent: "img[alt,src]", contentTransformations: [
                        ["img{width}: sizeToStyle", "img[width]: sizeToAttribute"],
                        ["img{float}: alignmentToStyle", "img[align]: alignmentToAttribute"]
                    ]}));
                d.ui.addButton && d.ui.addButton("Image", {label: d.lang.common.image, command: "image", toolbar: "insert,10"});
                d.on("doubleclick", function (a) {
                    var b = a.data.element;
                    if (b.is("img") && !b.data("cke-realelement") && !b.isReadOnly())a.data.dialog = "image"
                });
                d.addMenuItems && d.addMenuItems({image: {label: d.lang.image.menu,
                    command: "image", group: "image"}});
                d.contextMenu && d.contextMenu.addListener(function (a) {
                    if (c(d, a))return{image: CKEDITOR.TRISTATE_OFF}
                })
            }
        }, afterInit: function (d) {
            function b(a) {
                var b = d.getCommand("justify" + a);
                if (b) {
                    if (a == "left" || a == "right")b.on("exec", function (b) {
                        var e = c(d), g;
                        if (e) {
                            g = f(e);
                            if (g == a) {
                                e.removeStyle("float");
                                a == f(e) && e.removeAttribute("align")
                            } else e.setStyle("float", a);
                            b.cancel()
                        }
                    });
                    b.on("refresh", function (b) {
                        var e = c(d);
                        if (e) {
                            e = f(e);
                            this.setState(e == a ? CKEDITOR.TRISTATE_ON : a == "right" || a == "left" ?
                                CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
                            b.cancel()
                        }
                    })
                }
            }

            if (!d.plugins.image2) {
                b("left");
                b("right");
                b("center");
                b("block")
            }
        }})
    }(),CKEDITOR.config.image_removeLinkByEmptyURL = !0,function () {
        function c(b, a) {
            var a = a === void 0 || a, c;
            if (a)c = b.getComputedStyle("text-align"); else {
                for (; !b.hasAttribute || !b.hasAttribute("align") && !b.getStyle("text-align");) {
                    c = b.getParent();
                    if (!c)break;
                    b = c
                }
                c = b.getStyle("text-align") || b.getAttribute("align") || ""
            }
            c && (c = c.replace(/(?:-(?:moz|webkit)-)?(?:start|auto)/i, ""));
            !c && a && (c = b.getComputedStyle("direction") == "rtl" ? "right" : "left");
            return c
        }

        function f(b, a, c) {
            this.editor = b;
            this.name = a;
            this.value = c;
            this.context = "p";
            var a = b.config.justifyClasses, d = b.config.enterMode == CKEDITOR.ENTER_P ? "p" : "div";
            if (a) {
                switch (c) {
                    case "left":
                        this.cssClassName = a[0];
                        break;
                    case "center":
                        this.cssClassName = a[1];
                        break;
                    case "right":
                        this.cssClassName = a[2];
                        break;
                    case "justify":
                        this.cssClassName = a[3]
                }
                this.cssClassRegex = RegExp("(?:^|\\s+)(?:" + a.join("|") + ")(?=$|\\s)");
                this.requiredContent = d + "(" +
                    this.cssClassName + ")"
            } else this.requiredContent = d + "{text-align}";
            this.allowedContent = {"caption div h1 h2 h3 h4 h5 h6 p pre td th li": {propertiesOnly: true, styles: this.cssClassName ? null : "text-align", classes: this.cssClassName || null}};
            if (b.config.enterMode == CKEDITOR.ENTER_BR)this.allowedContent.div = true
        }

        function d(b) {
            var a = b.editor, c = a.createRange();
            c.setStartBefore(b.data.node);
            c.setEndAfter(b.data.node);
            for (var d = new CKEDITOR.dom.walker(c), f; f = d.next();)if (f.type == CKEDITOR.NODE_ELEMENT)if (!f.equals(b.data.node) &&
                f.getDirection()) {
                c.setStartAfter(f);
                d = new CKEDITOR.dom.walker(c)
            } else {
                var g = a.config.justifyClasses;
                if (g)if (f.hasClass(g[0])) {
                    f.removeClass(g[0]);
                    f.addClass(g[2])
                } else if (f.hasClass(g[2])) {
                    f.removeClass(g[2]);
                    f.addClass(g[0])
                }
                g = f.getStyle("text-align");
                g == "left" ? f.setStyle("text-align", "right") : g == "right" && f.setStyle("text-align", "left")
            }
        }

        f.prototype = {exec: function (b) {
            var a = b.getSelection(), e = b.config.enterMode;
            if (a) {
                for (var d = a.createBookmarks(), f = a.getRanges(), g = this.cssClassName, i, j, n = b.config.useComputedState,
                         n = n === void 0 || n, o = f.length - 1; o >= 0; o--) {
                    i = f[o].createIterator();
                    for (i.enlargeBr = e != CKEDITOR.ENTER_BR; j = i.getNextParagraph(e == CKEDITOR.ENTER_P ? "p" : "div");)if (!j.isReadOnly()) {
                        j.removeAttribute("align");
                        j.removeStyle("text-align");
                        var q = g && (j.$.className = CKEDITOR.tools.ltrim(j.$.className.replace(this.cssClassRegex, ""))), l = this.state == CKEDITOR.TRISTATE_OFF && (!n || c(j, true) != this.value);
                        g ? l ? j.addClass(g) : q || j.removeAttribute("class") : l && j.setStyle("text-align", this.value)
                    }
                }
                b.focus();
                b.forceNextSelectionCheck();
                a.selectBookmarks(d)
            }
        }, refresh: function (b, a) {
            var e = a.block || a.blockLimit;
            this.setState(e.getName() != "body" && c(e, this.editor.config.useComputedState) == this.value ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF)
        }};
        CKEDITOR.plugins.add("justify", {init: function (b) {
            if (!b.blockless) {
                var a = new f(b, "justifyleft", "left"), c = new f(b, "justifycenter", "center"), h = new f(b, "justifyright", "right"), k = new f(b, "justifyblock", "justify");
                b.addCommand("justifyleft", a);
                b.addCommand("justifycenter", c);
                b.addCommand("justifyright",
                    h);
                b.addCommand("justifyblock", k);
                if (b.ui.addButton) {
                    b.ui.addButton("JustifyLeft", {label: b.lang.justify.left, command: "justifyleft", toolbar: "align,10"});
                    b.ui.addButton("JustifyCenter", {label: b.lang.justify.center, command: "justifycenter", toolbar: "align,20"});
                    b.ui.addButton("JustifyRight", {label: b.lang.justify.right, command: "justifyright", toolbar: "align,30"});
                    b.ui.addButton("JustifyBlock", {label: b.lang.justify.block, command: "justifyblock", toolbar: "align,40"})
                }
                b.on("dirChanged", d)
            }
        }})
    }(),function () {
        function c(a, c) {
            var d = b.exec(a), f = b.exec(c);
            if (d) {
                if (!d[2] && f[2] == "px")return f[1];
                if (d[2] == "px" && !f[2])return f[1] + "px"
            }
            return c
        }

        var f = CKEDITOR.htmlParser.cssStyle, d = CKEDITOR.tools.cssLength, b = /^((?:\d*(?:\.\d+))|(?:\d+))(.*)?$/i, a = {elements: {$: function (a) {
            var b = a.attributes;
            if ((b = (b = (b = b && b["data-cke-realelement"]) && new CKEDITOR.htmlParser.fragment.fromHtml(decodeURIComponent(b))) && b.children[0]) && a.attributes["data-cke-resizable"]) {
                var d = (new f(a)).rules, a = b.attributes, g = d.width, d = d.height;
                g && (a.width = c(a.width,
                    g));
                d && (a.height = c(a.height, d))
            }
            return b
        }}};
        CKEDITOR.plugins.add("fakeobjects", {init: function (a) {
            a.filter.allow("img[!data-cke-realelement,src,alt,title](*){*}", "fakeobjects")
        }, afterInit: function (b) {
            (b = (b = b.dataProcessor) && b.htmlFilter) && b.addRules(a, {applyToAll: true})
        }});
        CKEDITOR.editor.prototype.createFakeElement = function (a, b, c, g) {
            var i = this.lang.fakeobjects, i = i[c] || i.unknown, b = {"class": b, "data-cke-realelement": encodeURIComponent(a.getOuterHtml()), "data-cke-real-node-type": a.type, alt: i, title: i,
                align: a.getAttribute("align") || ""};
            if (!CKEDITOR.env.hc)b.src = CKEDITOR.tools.transparentImageData;
            c && (b["data-cke-real-element-type"] = c);
            if (g) {
                b["data-cke-resizable"] = g;
                c = new f;
                g = a.getAttribute("width");
                a = a.getAttribute("height");
                g && (c.rules.width = d(g));
                a && (c.rules.height = d(a));
                c.populate(b)
            }
            return this.document.createElement("img", {attributes: b})
        };
        CKEDITOR.editor.prototype.createFakeParserElement = function (a, b, c, g) {
            var i = this.lang.fakeobjects, i = i[c] || i.unknown, j;
            j = new CKEDITOR.htmlParser.basicWriter;
            a.writeHtml(j);
            j = j.getHtml();
            b = {"class": b, "data-cke-realelement": encodeURIComponent(j), "data-cke-real-node-type": a.type, alt: i, title: i, align: a.attributes.align || ""};
            if (!CKEDITOR.env.hc)b.src = CKEDITOR.tools.transparentImageData;
            c && (b["data-cke-real-element-type"] = c);
            if (g) {
                b["data-cke-resizable"] = g;
                g = a.attributes;
                a = new f;
                c = g.width;
                g = g.height;
                c != void 0 && (a.rules.width = d(c));
                g != void 0 && (a.rules.height = d(g));
                a.populate(b)
            }
            return new CKEDITOR.htmlParser.element("img", b)
        };
        CKEDITOR.editor.prototype.restoreRealElement =
            function (a) {
                if (a.data("cke-real-node-type") != CKEDITOR.NODE_ELEMENT)return null;
                var b = CKEDITOR.dom.element.createFromHtml(decodeURIComponent(a.data("cke-realelement")), this.document);
                if (a.data("cke-resizable")) {
                    var d = a.getStyle("width"), a = a.getStyle("height");
                    d && b.setAttribute("width", c(b.getAttribute("width"), d));
                    a && b.setAttribute("height", c(b.getAttribute("height"), a))
                }
                return b
            }
    }(),"use strict",function () {
        function c(a) {
            return a.replace(/'/g, "\\$&")
        }

        function f(a) {
            for (var b, c = a.length, e = [], d = 0; d < c; d++) {
                b =
                    a.charCodeAt(d);
                e.push(b)
            }
            return"String.fromCharCode(" + e.join(",") + ")"
        }

        function d(a, b) {
            var e = a.plugins.link, d = e.compiledProtectionFunction.params, f, g;
            g = [e.compiledProtectionFunction.name, "("];
            for (var h = 0; h < d.length; h++) {
                e = d[h].toLowerCase();
                f = b[e];
                h > 0 && g.push(",");
                g.push("'", f ? c(encodeURIComponent(b[e])) : "", "'")
            }
            g.push(")");
            return g.join("")
        }

        function b(a) {
            var a = a.config.emailProtection || "", b;
            if (a && a != "encode") {
                b = {};
                a.replace(/^([^(]+)\(([^)]+)\)$/, function (a, c, e) {
                    b.name = c;
                    b.params = [];
                    e.replace(/[^,\s]+/g,
                        function (a) {
                            b.params.push(a)
                        })
                })
            }
            return b
        }

        CKEDITOR.plugins.add("link", {requires: "dialog,fakeobjects", onLoad: function () {
            function a(b) {
                return c.replace(/%1/g, b == "rtl" ? "right" : "left").replace(/%2/g, "cke_contents_" + b)
            }

            var b = "background:url(" + CKEDITOR.getUrl(this.path + "images" + (CKEDITOR.env.hidpi ? "/hidpi" : "") + "/anchor.png") + ") no-repeat %1 center;border:1px dotted #00f;background-size:16px;", c = ".%2 a.cke_anchor,.%2 a.cke_anchor_empty,.cke_editable.%2 a[name],.cke_editable.%2 a[data-cke-saved-name]{" + b +
                "padding-%1:18px;cursor:auto;}.%2 img.cke_anchor{" + b + "width:16px;min-height:15px;height:1.15em;vertical-align:text-bottom;}";
            CKEDITOR.addCss(a("ltr") + a("rtl"))
        }, init: function (a) {
            var c = "a[!href]";
            CKEDITOR.dialog.isTabEnabled(a, "link", "advanced") && (c = c.replace("]", ",accesskey,charset,dir,id,lang,name,rel,tabindex,title,type]{*}(*)"));
            CKEDITOR.dialog.isTabEnabled(a, "link", "target") && (c = c.replace("]", ",target,onclick]"));
            a.addCommand("link", new CKEDITOR.dialogCommand("link", {allowedContent: c, requiredContent: "a[href]"}));
            a.addCommand("anchor", new CKEDITOR.dialogCommand("anchor", {allowedContent: "a[!name,id]", requiredContent: "a[name]"}));
            a.addCommand("unlink", new CKEDITOR.unlinkCommand);
            a.addCommand("removeAnchor", new CKEDITOR.removeAnchorCommand);
            a.setKeystroke(CKEDITOR.CTRL + 76, "link");
            if (a.ui.addButton) {
                a.ui.addButton("Link", {label: a.lang.link.toolbar, command: "link", toolbar: "links,10"});
                a.ui.addButton("Unlink", {label: a.lang.link.unlink, command: "unlink", toolbar: "links,20"});
                a.ui.addButton("Anchor", {label: a.lang.link.anchor.toolbar,
                    command: "anchor", toolbar: "links,30"})
            }
            CKEDITOR.dialog.add("link", this.path + "dialogs/link.js");
            CKEDITOR.dialog.add("anchor", this.path + "dialogs/anchor.js");
            a.on("doubleclick", function (b) {
                var c = CKEDITOR.plugins.link.getSelectedLink(a) || b.data.element;
                if (!c.isReadOnly())if (c.is("a")) {
                    b.data.dialog = c.getAttribute("name") && (!c.getAttribute("href") || !c.getChildCount()) ? "anchor" : "link";
                    b.data.link = c
                } else if (CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, c))b.data.dialog = "anchor"
            }, null, null, 0);
            a.on("doubleclick",
                function (b) {
                    b.data.link && a.getSelection().selectElement(b.data.link)
                }, null, null, 20);
            a.addMenuItems && a.addMenuItems({anchor: {label: a.lang.link.anchor.menu, command: "anchor", group: "anchor", order: 1}, removeAnchor: {label: a.lang.link.anchor.remove, command: "removeAnchor", group: "anchor", order: 5}, link: {label: a.lang.link.menu, command: "link", group: "link", order: 1}, unlink: {label: a.lang.link.unlink, command: "unlink", group: "link", order: 5}});
            a.contextMenu && a.contextMenu.addListener(function (b) {
                if (!b || b.isReadOnly())return null;
                b = CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, b);
                if (!b && !(b = CKEDITOR.plugins.link.getSelectedLink(a)))return null;
                var c = {};
                b.getAttribute("href") && b.getChildCount() && (c = {link: CKEDITOR.TRISTATE_OFF, unlink: CKEDITOR.TRISTATE_OFF});
                if (b && b.hasAttribute("name"))c.anchor = c.removeAnchor = CKEDITOR.TRISTATE_OFF;
                return c
            });
            this.compiledProtectionFunction = b(a)
        }, afterInit: function (a) {
            a.dataProcessor.dataFilter.addRules({elements: {a: function (b) {
                return!b.attributes.name ? null : !b.children.length ? a.createFakeParserElement(b,
                    "cke_anchor", "anchor") : null
            }}});
            var b = a._.elementsPath && a._.elementsPath.filters;
            b && b.push(function (b, c) {
                if (c == "a" && (CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, b) || b.getAttribute("name") && (!b.getAttribute("href") || !b.getChildCount())))return"anchor"
            })
        }});
        var a = /^javascript:/, e = /^mailto:([^?]+)(?:\?(.+))?$/, h = /subject=([^;?:@&=$,\/]*)/, k = /body=([^;?:@&=$,\/]*)/, g = /^#(.*)$/, i = /^((?:http|https|ftp|news):\/\/)?(.*)$/, j = /^(_(?:self|top|parent|blank))$/, n = /^javascript:void\(location\.href='mailto:'\+String\.fromCharCode\(([^)]+)\)(?:\+'(.*)')?\)$/,
            o = /^javascript:([^(]+)\(([^)]+)\)$/, q = /\s*window.open\(\s*this\.href\s*,\s*(?:'([^']*)'|null)\s*,\s*'([^']*)'\s*\)\s*;\s*return\s*false;*\s*/, l = /(?:^|,)([^=]+)=(\d+|yes|no)/gi, m = {id: "advId", dir: "advLangDir", accessKey: "advAccessKey", name: "advName", lang: "advLangCode", tabindex: "advTabIndex", title: "advTitle", type: "advContentType", "class": "advCSSClasses", charset: "advCharset", style: "advStyles", rel: "advRel"};
        CKEDITOR.plugins.link = {getSelectedLink: function (a) {
            var b = a.getSelection(), c = b.getSelectedElement();
            if (c && c.is("a"))return c;
            if (b = b.getRanges()[0]) {
                b.shrink(CKEDITOR.SHRINK_TEXT);
                return a.elementPath(b.getCommonAncestor()).contains("a", 1)
            }
            return null
        }, getEditorAnchors: function (a) {
            for (var b = a.editable(), c = b.isInline() && !a.plugins.divarea ? a.document : b, b = c.getElementsByTag("a"), c = c.getElementsByTag("img"), e = [], d = 0, f; f = b.getItem(d++);)if (f.data("cke-saved-name") || f.hasAttribute("name"))e.push({name: f.data("cke-saved-name") || f.getAttribute("name"), id: f.getAttribute("id")});
            for (d = 0; f = c.getItem(d++);)(f =
                this.tryRestoreFakeAnchor(a, f)) && e.push({name: f.getAttribute("name"), id: f.getAttribute("id")});
            return e
        }, fakeAnchor: true, tryRestoreFakeAnchor: function (a, b) {
            if (b && b.data("cke-real-element-type") && b.data("cke-real-element-type") == "anchor") {
                var c = a.restoreRealElement(b);
                if (c.data("cke-saved-name"))return c
            }
        }, parseLinkAttributes: function (b, c) {
            var d = c && (c.data("cke-saved-href") || c.getAttribute("href")) || "", f = b.plugins.link.compiledProtectionFunction, s = b.config.emailProtection, x, y = {};
            d.match(a) && (s == "encode" ?
                d = d.replace(n, function (a, b, c) {
                    return"mailto:" + String.fromCharCode.apply(String, b.split(",")) + (c && c.replace(/\\'/g, "'"))
                }) : s && d.replace(o, function (a, b, c) {
                if (b == f.name) {
                    y.type = "email";
                    for (var a = y.email = {}, b = /(^')|('$)/g, c = c.match(/[^,\s]+/g), e = c.length, d, g, h = 0; h < e; h++) {
                        d = decodeURIComponent;
                        g = c[h].replace(b, "").replace(/\\'/g, "'");
                        g = d(g);
                        d = f.params[h].toLowerCase();
                        a[d] = g
                    }
                    a.address = [a.name, a.domain].join("@")
                }
            }));
            if (!y.type)if (s = d.match(g)) {
                y.type = "anchor";
                y.anchor = {};
                y.anchor.name = y.anchor.id = s[1]
            } else if (s =
                d.match(e)) {
                x = d.match(h);
                d = d.match(k);
                y.type = "email";
                var v = y.email = {};
                v.address = s[1];
                x && (v.subject = decodeURIComponent(x[1]));
                d && (v.body = decodeURIComponent(d[1]))
            } else if (d && (x = d.match(i))) {
                y.type = "url";
                y.url = {};
                y.url.protocol = x[1];
                y.url.url = x[2]
            }
            if (c) {
                if (d = c.getAttribute("target"))y.target = {type: d.match(j) ? d : "frame", name: d}; else if (d = (d = c.data("cke-pa-onclick") || c.getAttribute("onclick")) && d.match(q))for (y.target = {type: "popup", name: d[1]}; s = l.exec(d[2]);)(s[2] == "yes" || s[2] == "1") && !(s[1]in{height: 1,
                    width: 1, top: 1, left: 1}) ? y.target[s[1]] = true : isFinite(s[2]) && (y.target[s[1]] = s[2]);
                var d = {}, A;
                for (A in m)(s = c.getAttribute(A)) && (d[m[A]] = s);
                if (A = c.data("cke-saved-name") || d.advName)d.advName = A;
                if (!CKEDITOR.tools.isEmpty(d))y.advanced = d
            }
            return y
        }, getLinkAttributes: function (a, b) {
            var e = a.config.emailProtection || "", g = {};
            switch (b.type) {
                case "url":
                    var e = b.url && b.url.protocol != void 0 ? b.url.protocol : "http://", h = b.url && CKEDITOR.tools.trim(b.url.url) || "";
                    g["data-cke-saved-href"] = h.indexOf("/") === 0 ? h : e + h;
                    break;
                case "anchor":
                    e = b.anchor && b.anchor.id;
                    g["data-cke-saved-href"] = "#" + (b.anchor && b.anchor.name || e || "");
                    break;
                case "email":
                    var i = b.email, h = i.address;
                    switch (e) {
                        case "":
                        case "encode":
                            var k = encodeURIComponent(i.subject || ""), j = encodeURIComponent(i.body || ""), i = [];
                            k && i.push("subject=" + k);
                            j && i.push("body=" + j);
                            i = i.length ? "?" + i.join("&") : "";
                            if (e == "encode") {
                                e = ["javascript:void(location.href='mailto:'+", f(h)];
                                i && e.push("+'", c(i), "'");
                                e.push(")")
                            } else e = ["mailto:", h, i];
                            break;
                        default:
                            e = h.split("@", 2);
                            i.name = e[0];
                            i.domain = e[1];
                            e = ["javascript:", d(a, i)]
                    }
                    g["data-cke-saved-href"] = e.join("")
            }
            if (b.target)if (b.target.type == "popup") {
                for (var e = ["window.open(this.href, '", b.target.name || "", "', '"], l = ["resizable", "status", "location", "toolbar", "menubar", "fullscreen", "scrollbars", "dependent"], h = l.length, k = function (a) {
                    b.target[a] && l.push(a + "=" + b.target[a])
                }, i = 0; i < h; i++)l[i] = l[i] + (b.target[l[i]] ? "=yes" : "=no");
                k("width");
                k("left");
                k("height");
                k("top");
                e.push(l.join(","), "'); return false;");
                g["data-cke-pa-onclick"] = e.join("")
            } else if (b.target.type !=
                "notSet" && b.target.name)g.target = b.target.name;
            if (b.advanced) {
                for (var n in m)(e = b.advanced[m[n]]) && (g[n] = e);
                if (g.name)g["data-cke-saved-name"] = g.name
            }
            if (g["data-cke-saved-href"])g.href = g["data-cke-saved-href"];
            n = CKEDITOR.tools.extend({target: 1, onclick: 1, "data-cke-pa-onclick": 1, "data-cke-saved-name": 1}, m);
            for (var o in g)delete n[o];
            return{set: g, removed: CKEDITOR.tools.objectKeys(n)}
        }};
        CKEDITOR.unlinkCommand = function () {
        };
        CKEDITOR.unlinkCommand.prototype = {exec: function (a) {
            var b = new CKEDITOR.style({element: "a",
                type: CKEDITOR.STYLE_INLINE, alwaysRemoveElement: 1});
            a.removeStyle(b)
        }, refresh: function (a, b) {
            var c = b.lastElement && b.lastElement.getAscendant("a", true);
            c && c.getName() == "a" && c.getAttribute("href") && c.getChildCount() ? this.setState(CKEDITOR.TRISTATE_OFF) : this.setState(CKEDITOR.TRISTATE_DISABLED)
        }, contextSensitive: 1, startDisabled: 1, requiredContent: "a[href]"};
        CKEDITOR.removeAnchorCommand = function () {
        };
        CKEDITOR.removeAnchorCommand.prototype = {exec: function (a) {
            var b = a.getSelection(), c = b.createBookmarks(), e;
            if (b &&
                (e = b.getSelectedElement()) && (!e.getChildCount() ? CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, e) : e.is("a")))e.remove(1); else if (e = CKEDITOR.plugins.link.getSelectedLink(a))if (e.hasAttribute("href")) {
                e.removeAttributes({name: 1, "data-cke-saved-name": 1});
                e.removeClass("cke_anchor")
            } else e.remove(1);
            b.selectBookmarks(c)
        }, requiredContent: "a[name]"};
        CKEDITOR.tools.extend(CKEDITOR.config, {linkShowAdvancedTab: true, linkShowTargetTab: true})
    }(),function () {
        function c(a) {
            if (!a || a.type != CKEDITOR.NODE_ELEMENT || a.getName() !=
                "form")return[];
            for (var b = [], c = ["style", "className"], d = 0; d < c.length; d++) {
                var f = a.$.elements.namedItem(c[d]);
                if (f) {
                    f = new CKEDITOR.dom.element(f);
                    b.push([f, f.nextSibling]);
                    f.remove()
                }
            }
            return b
        }

        function f(a, b) {
            if (a && !(a.type != CKEDITOR.NODE_ELEMENT || a.getName() != "form") && b.length > 0)for (var c = b.length - 1; c >= 0; c--) {
                var d = b[c][0], f = b[c][1];
                f ? d.insertBefore(f) : d.appendTo(a)
            }
        }

        function d(a, b) {
            var d = c(a), g = {}, i = a.$;
            if (!b) {
                g["class"] = i.className || "";
                i.className = ""
            }
            g.inline = i.style.cssText || "";
            if (!b)i.style.cssText =
                "position: static; overflow: visible";
            f(d);
            return g
        }

        function b(a, b) {
            var d = c(a), g = a.$;
            if ("class"in b)g.className = b["class"];
            if ("inline"in b)g.style.cssText = b.inline;
            f(d)
        }

        function a(a) {
            if (!a.editable().isInline()) {
                var b = CKEDITOR.instances, c;
                for (c in b) {
                    var d = b[c];
                    if (d.mode == "wysiwyg" && !d.readOnly) {
                        d = d.document.getBody();
                        d.setAttribute("contentEditable", false);
                        d.setAttribute("contentEditable", true)
                    }
                }
                if (a.editable().hasFocus) {
                    a.toolbox.focus();
                    a.focus()
                }
            }
        }

        CKEDITOR.plugins.add("maximize", {init: function (c) {
            function f() {
                var a =
                    i.getViewPaneSize();
                c.resize(a.width, a.height, null, true)
            }

            if (c.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                var k = c.lang, g = CKEDITOR.document, i = g.getWindow(), j, n, o, q = CKEDITOR.TRISTATE_OFF;
                c.addCommand("maximize", {modes: {wysiwyg: !CKEDITOR.env.iOS, source: !CKEDITOR.env.iOS}, readOnly: 1, editorFocus: false, exec: function () {
                    var l = c.container.getChild(1), m = c.ui.space("contents");
                    if (c.mode == "wysiwyg") {
                        var r = c.getSelection();
                        j = r && r.getRanges();
                        n = i.getScrollPosition()
                    } else {
                        var t = c.editable().$;
                        j = !CKEDITOR.env.ie &&
                            [t.selectionStart, t.selectionEnd];
                        n = [t.scrollLeft, t.scrollTop]
                    }
                    if (this.state == CKEDITOR.TRISTATE_OFF) {
                        i.on("resize", f);
                        o = i.getScrollPosition();
                        for (r = c.container; r = r.getParent();) {
                            r.setCustomData("maximize_saved_styles", d(r));
                            r.setStyle("z-index", c.config.baseFloatZIndex - 5)
                        }
                        m.setCustomData("maximize_saved_styles", d(m, true));
                        l.setCustomData("maximize_saved_styles", d(l, true));
                        m = {overflow: CKEDITOR.env.webkit ? "" : "hidden", width: 0, height: 0};
                        g.getDocumentElement().setStyles(m);
                        !CKEDITOR.env.gecko && g.getDocumentElement().setStyle("position",
                            "fixed");
                        (!CKEDITOR.env.gecko || !CKEDITOR.env.quirks) && g.getBody().setStyles(m);
                        CKEDITOR.env.ie ? setTimeout(function () {
                            i.$.scrollTo(0, 0)
                        }, 0) : i.$.scrollTo(0, 0);
                        l.setStyle("position", CKEDITOR.env.gecko && CKEDITOR.env.quirks ? "fixed" : "absolute");
                        l.$.offsetLeft;
                        l.setStyles({"z-index": c.config.baseFloatZIndex - 5, left: "0px", top: "0px"});
                        l.addClass("cke_maximized");
                        f();
                        m = l.getDocumentPosition();
                        l.setStyles({left: -1 * m.x + "px", top: -1 * m.y + "px"});
                        CKEDITOR.env.gecko && a(c)
                    } else if (this.state == CKEDITOR.TRISTATE_ON) {
                        i.removeListener("resize",
                            f);
                        m = [m, l];
                        for (r = 0; r < m.length; r++) {
                            b(m[r], m[r].getCustomData("maximize_saved_styles"));
                            m[r].removeCustomData("maximize_saved_styles")
                        }
                        for (r = c.container; r = r.getParent();) {
                            b(r, r.getCustomData("maximize_saved_styles"));
                            r.removeCustomData("maximize_saved_styles")
                        }
                        CKEDITOR.env.ie ? setTimeout(function () {
                            i.$.scrollTo(o.x, o.y)
                        }, 0) : i.$.scrollTo(o.x, o.y);
                        l.removeClass("cke_maximized");
                        if (CKEDITOR.env.webkit) {
                            l.setStyle("display", "inline");
                            setTimeout(function () {
                                l.setStyle("display", "block")
                            }, 0)
                        }
                        c.fire("resize")
                    }
                    this.toggleState();
                    if (r = this.uiItems[0]) {
                        m = this.state == CKEDITOR.TRISTATE_OFF ? k.maximize.maximize : k.maximize.minimize;
                        r = CKEDITOR.document.getById(r._.id);
                        r.getChild(1).setHtml(m);
                        r.setAttribute("title", m);
                        r.setAttribute("href", 'javascript:void("' + m + '");')
                    }
                    if (c.mode == "wysiwyg")if (j) {
                        CKEDITOR.env.gecko && a(c);
                        c.getSelection().selectRanges(j);
                        (t = c.getSelection().getStartElement()) && t.scrollIntoView(true)
                    } else i.$.scrollTo(n.x, n.y); else {
                        if (j) {
                            t.selectionStart = j[0];
                            t.selectionEnd = j[1]
                        }
                        t.scrollLeft = n[0];
                        t.scrollTop = n[1]
                    }
                    j =
                        n = null;
                    q = this.state;
                    c.fire("maximize", this.state)
                }, canUndo: false});
                c.ui.addButton && c.ui.addButton("Maximize", {label: k.maximize.maximize, command: "maximize", toolbar: "tools,10"});
                c.on("mode", function () {
                    var a = c.getCommand("maximize");
                    a.setState(a.state == CKEDITOR.TRISTATE_DISABLED ? CKEDITOR.TRISTATE_DISABLED : q)
                }, null, null, 100)
            }
        }})
    }(),function () {
        var c, f = {modes: {wysiwyg: 1, source: 1}, canUndo: false, readOnly: 1, exec: function (d) {
            var b, a = d.config, e = a.baseHref ? '<base href="' + a.baseHref + '"/>' : "";
            if (a.fullPage)b = d.getData().replace(/<head>/,
                    "$&" + e).replace(/[^>]*(?=<\/title>)/, "$& &mdash; " + d.lang.preview.preview); else {
                var a = "<body ", f = d.document && d.document.getBody();
                if (f) {
                    f.getAttribute("id") && (a = a + ('id="' + f.getAttribute("id") + '" '));
                    f.getAttribute("class") && (a = a + ('class="' + f.getAttribute("class") + '" '))
                }
                b = d.config.docType + '<html dir="' + d.config.contentsLangDirection + '"><head>' + e + "<title>" + d.lang.preview.preview + "</title>" + CKEDITOR.tools.buildStyleHtml(d.config.contentsCss) + "</head>" + (a + ">") + d.getData() + "</body></html>"
            }
            e = 640;
            a = 420;
            f = 80;
            try {
                var k = window.screen, e = Math.round(k.width * 0.8), a = Math.round(k.height * 0.7), f = Math.round(k.width * 0.1)
            } catch (g) {
            }
            if (d.fire("contentPreview", d = {dataValue: b}) === false)return false;
            var k = "", i;
            if (CKEDITOR.env.ie) {
                window._cke_htmlToLoad = d.dataValue;
                i = "javascript:void( (function(){document.open();" + ("(" + CKEDITOR.tools.fixDomain + ")();").replace(/\/\/.*?\n/g, "").replace(/parent\./g, "window.opener.") + "document.write( window.opener._cke_htmlToLoad );document.close();window.opener._cke_htmlToLoad = null;})() )";
                k = ""
            }
            if (CKEDITOR.env.gecko) {
                window._cke_htmlToLoad = d.dataValue;
                k = c + "preview.html"
            }
            k = window.open(k, null, "toolbar=yes,location=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=" + e + ",height=" + a + ",left=" + f);
            if (CKEDITOR.env.ie && k)k.location = i;
            if (!CKEDITOR.env.ie && !CKEDITOR.env.gecko) {
                i = k.document;
                i.open();
                i.write(d.dataValue);
                i.close()
            }
            return true
        }};
        CKEDITOR.plugins.add("preview", {init: function (d) {
            if (d.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                c = this.path;
                d.addCommand("preview", f);
                d.ui.addButton &&
                d.ui.addButton("Preview", {label: d.lang.preview.preview, command: "preview", toolbar: "document,40"})
            }
        }})
    }(),CKEDITOR.plugins.add("resize", {init: function (c) {
        var f, d, b, a, e = c.config, h = c.ui.spaceId("resizer"), k = c.element ? c.element.getDirection(1) : "ltr";
        !e.resize_dir && (e.resize_dir = "vertical");
        e.resize_maxWidth == void 0 && (e.resize_maxWidth = 3E3);
        e.resize_maxHeight == void 0 && (e.resize_maxHeight = 3E3);
        e.resize_minWidth == void 0 && (e.resize_minWidth = 750);
        e.resize_minHeight == void 0 && (e.resize_minHeight = 250);
        if (e.resize_enabled !==
            false) {
            var g = null, i = (e.resize_dir == "both" || e.resize_dir == "horizontal") && e.resize_minWidth != e.resize_maxWidth, j = (e.resize_dir == "both" || e.resize_dir == "vertical") && e.resize_minHeight != e.resize_maxHeight, n = function (g) {
                var h = f, n = d, o = h + (g.data.$.screenX - b) * (k == "rtl" ? -1 : 1), g = n + (g.data.$.screenY - a);
                i && (h = Math.max(e.resize_minWidth, Math.min(o, e.resize_maxWidth)));
                j && (n = Math.max(e.resize_minHeight, Math.min(g, e.resize_maxHeight)));
                c.resize(i ? h : null, n)
            }, o = function () {
                CKEDITOR.document.removeListener("mousemove",
                    n);
                CKEDITOR.document.removeListener("mouseup", o);
                if (c.document) {
                    c.document.removeListener("mousemove", n);
                    c.document.removeListener("mouseup", o)
                }
            }, q = CKEDITOR.tools.addFunction(function (h) {
                g || (g = c.getResizable());
                f = g.$.offsetWidth || 0;
                d = g.$.offsetHeight || 0;
                b = h.screenX;
                a = h.screenY;
                e.resize_minWidth > f && (e.resize_minWidth = f);
                e.resize_minHeight > d && (e.resize_minHeight = d);
                CKEDITOR.document.on("mousemove", n);
                CKEDITOR.document.on("mouseup", o);
                if (c.document) {
                    c.document.on("mousemove", n);
                    c.document.on("mouseup",
                        o)
                }
                h.preventDefault && h.preventDefault()
            });
            c.on("destroy", function () {
                CKEDITOR.tools.removeFunction(q)
            });
            c.on("uiSpace", function (a) {
                if (a.data.space == "bottom") {
                    var b = "";
                    i && !j && (b = " cke_resizer_horizontal");
                    !i && j && (b = " cke_resizer_vertical");
                    var e = '<span id="' + h + '" class="cke_resizer' + b + " cke_resizer_" + k + '" title="' + CKEDITOR.tools.htmlEncode(c.lang.common.resize) + '" onmousedown="CKEDITOR.tools.callFunction(' + q + ', event)">' + (k == "ltr" ? "◢" : "◣") + "</span>";
                    k == "ltr" && b == "ltr" ? a.data.html = a.data.html + e : a.data.html =
                        e + a.data.html
                }
            }, c, null, 100);
            c.on("maximize", function (a) {
                c.ui.space("resizer")[a.data == CKEDITOR.TRISTATE_ON ? "hide" : "show"]()
            })
        }
    }}),function () {
        CKEDITOR.plugins.add("selectall", {init: function (c) {
            c.addCommand("selectAll", {modes: {wysiwyg: 1, source: 1}, exec: function (c) {
                var d = c.editable();
                if (d.is("textarea")) {
                    c = d.$;
                    if (CKEDITOR.env.ie)c.createTextRange().execCommand("SelectAll"); else {
                        c.selectionStart = 0;
                        c.selectionEnd = c.value.length
                    }
                    c.focus()
                } else {
                    if (d.is("body"))c.document.$.execCommand("SelectAll", false, null);
                    else {
                        var b = c.createRange();
                        b.selectNodeContents(d);
                        b.select()
                    }
                    c.forceNextSelectionCheck();
                    c.selectionChange()
                }
            }, canUndo: false});
            c.ui.addButton && c.ui.addButton("SelectAll", {label: c.lang.selectall.toolbar, command: "selectAll", toolbar: "selection,10"})
        }})
    }(),function () {
        CKEDITOR.plugins.add("sourcearea", {init: function (f) {
            function d() {
                var b = a && this.equals(CKEDITOR.document.getActive());
                this.hide();
                this.setStyle("height", this.getParent().$.clientHeight + "px");
                this.setStyle("width", this.getParent().$.clientWidth +
                    "px");
                this.show();
                b && this.focus()
            }

            if (f.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                var b = CKEDITOR.plugins.sourcearea;
                f.addMode("source", function (a) {
                    var b = f.ui.space("contents").getDocument().createElement("textarea");
                    b.setStyles(CKEDITOR.tools.extend({width: CKEDITOR.env.ie7Compat ? "99%" : "100%", height: "100%", resize: "none", outline: "none", "text-align": "left"}, CKEDITOR.tools.cssVendorPrefix("tab-size", f.config.sourceAreaTabSize || 4)));
                    b.setAttribute("dir", "ltr");
                    b.addClass("cke_source cke_reset cke_enable_context_menu");
                    f.ui.space("contents").append(b);
                    b = f.editable(new c(f, b));
                    b.setData(f.getData(1));
                    if (CKEDITOR.env.ie) {
                        b.attachListener(f, "resize", d, b);
                        b.attachListener(CKEDITOR.document.getWindow(), "resize", d, b);
                        CKEDITOR.tools.setTimeout(d, 0, b)
                    }
                    f.fire("ariaWidget", this);
                    a()
                });
                f.addCommand("source", b.commands.source);
                f.ui.addButton && f.ui.addButton("Source", {label: f.lang.sourcearea.toolbar, command: "source", toolbar: "mode,10"});
                f.on("mode", function () {
                    f.getCommand("source").setState(f.mode == "source" ? CKEDITOR.TRISTATE_ON :
                        CKEDITOR.TRISTATE_OFF)
                });
                var a = CKEDITOR.env.ie && CKEDITOR.env.version == 9
            }
        }});
        var c = CKEDITOR.tools.createClass({base: CKEDITOR.editable, proto: {setData: function (c) {
            this.setValue(c);
            this.status = "ready";
            this.editor.fire("dataReady")
        }, getData: function () {
            return this.getValue()
        }, insertHtml: function () {
        }, insertElement: function () {
        }, insertText: function () {
        }, setReadOnly: function (c) {
            this[(c ? "set" : "remove") + "Attribute"]("readOnly", "readonly")
        }, detach: function () {
            c.baseProto.detach.call(this);
            this.clearCustomData();
            this.remove()
        }}})
    }(),CKEDITOR.plugins.sourcearea = {commands: {source: {modes: {wysiwyg: 1, source: 1}, editorFocus: !1, readOnly: 1, exec: function (c) {
        c.mode == "wysiwyg" && c.fire("saveSnapshot");
        c.getCommand("source").setState(CKEDITOR.TRISTATE_DISABLED);
        c.setMode(c.mode == "source" ? "wysiwyg" : "source")
    }, canUndo: !1}}},function () {
        var c = '<a id="{id}" class="cke_button cke_button__{name} cke_button_{state} {cls}"' + (CKEDITOR.env.gecko && !CKEDITOR.env.hc ? "" : " href=\"javascript:void('{titleJs}')\"") + ' title="{title}" tabindex="-1" hidefocus="true" role="button" aria-labelledby="{id}_label" aria-haspopup="{hasArrow}" aria-disabled="{ariaDisabled}"';
        CKEDITOR.env.gecko && CKEDITOR.env.mac && (c = c + ' onkeypress="return false;"');
        CKEDITOR.env.gecko && (c = c + ' onblur="this.style.cssText = this.style.cssText;"');
        var c = c + (' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event);" onfocus="return CKEDITOR.tools.callFunction({focusFn},event);" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},this);return false;"><span class="cke_button_icon cke_button__{iconName}_icon" style="{style}"'), c = c +
            '>&nbsp;</span><span id="{id}_label" class="cke_button_label cke_button__{name}_label" aria-hidden="false">{label}</span>{arrowHtml}</a>', f = CKEDITOR.addTemplate("buttonArrow", '<span class="cke_button_arrow">' + (CKEDITOR.env.hc ? "&#9660;" : "") + "</span>"), d = CKEDITOR.addTemplate("button", c);
        CKEDITOR.plugins.add("button", {beforeInit: function (b) {
            b.ui.addHandler(CKEDITOR.UI_BUTTON, CKEDITOR.ui.button.handler)
        }});
        CKEDITOR.UI_BUTTON = "button";
        CKEDITOR.ui.button = function (b) {
            CKEDITOR.tools.extend(this, b, {title: b.label,
                click: b.click || function (a) {
                    a.execCommand(b.command)
                }});
            this._ = {}
        };
        CKEDITOR.ui.button.handler = {create: function (b) {
            return new CKEDITOR.ui.button(b)
        }};
        CKEDITOR.ui.button.prototype = {render: function (b, a) {
            var c = CKEDITOR.env, h = this._.id = CKEDITOR.tools.getNextId(), k = "", g = this.command, i;
            this._.editor = b;
            var j = {id: h, button: this, editor: b, focus: function () {
                CKEDITOR.document.getById(h).focus()
            }, execute: function () {
                this.button.click(b)
            }, attach: function (a) {
                this.button.attach(a)
            }}, n = CKEDITOR.tools.addFunction(function (a) {
                if (j.onkey) {
                    a =
                        new CKEDITOR.dom.event(a);
                    return j.onkey(j, a.getKeystroke()) !== false
                }
            }), o = CKEDITOR.tools.addFunction(function (a) {
                var b;
                j.onfocus && (b = j.onfocus(j, new CKEDITOR.dom.event(a)) !== false);
                return b
            }), q = 0;
            j.clickFn = i = CKEDITOR.tools.addFunction(function () {
                if (q) {
                    b.unlockSelection(1);
                    q = 0
                }
                j.execute()
            });
            if (this.modes) {
                var l = {}, m = function () {
                    var a = b.mode;
                    if (a) {
                        a = this.modes[a] ? l[a] != void 0 ? l[a] : CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;
                        a = b.readOnly && !this.readOnly ? CKEDITOR.TRISTATE_DISABLED : a;
                        this.setState(a);
                        this.refresh && this.refresh()
                    }
                };
                b.on("beforeModeUnload", function () {
                    if (b.mode && this._.state != CKEDITOR.TRISTATE_DISABLED)l[b.mode] = this._.state
                }, this);
                b.on("activeFilterChange", m, this);
                b.on("mode", m, this);
                !this.readOnly && b.on("readOnly", m, this)
            } else if (g)if (g = b.getCommand(g)) {
                g.on("state", function () {
                    this.setState(g.state)
                }, this);
                k = k + (g.state == CKEDITOR.TRISTATE_ON ? "on" : g.state == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off")
            }
            if (this.directional)b.on("contentDirChanged", function (a) {
                var c = CKEDITOR.document.getById(this._.id),
                    e = c.getFirst(), a = a.data;
                a != b.lang.dir ? c.addClass("cke_" + a) : c.removeClass("cke_ltr").removeClass("cke_rtl");
                e.setAttribute("style", CKEDITOR.skin.getIconStyle(r, a == "rtl", this.icon, this.iconOffset))
            }, this);
            g || (k = k + "off");
            var r = m = this.name || this.command;
            if (this.icon && !/\./.test(this.icon)) {
                r = this.icon;
                this.icon = null
            }
            c = {id: h, name: m, iconName: r, label: this.label, cls: this.className || "", state: k, ariaDisabled: k == "disabled" ? "true" : "false", title: this.title, titleJs: c.gecko && !c.hc ? "" : (this.title || "").replace("'",
                ""), hasArrow: this.hasArrow ? "true" : "false", keydownFn: n, focusFn: o, clickFn: i, style: CKEDITOR.skin.getIconStyle(r, b.lang.dir == "rtl", this.icon, this.iconOffset), arrowHtml: this.hasArrow ? f.output() : ""};
            d.output(c, a);
            if (this.onRender)this.onRender();
            return j
        }, setState: function (b) {
            if (this._.state == b)return false;
            this._.state = b;
            var a = CKEDITOR.document.getById(this._.id);
            if (a) {
                a.setState(b, "cke_button");
                b == CKEDITOR.TRISTATE_DISABLED ? a.setAttribute("aria-disabled", true) : a.removeAttribute("aria-disabled");
                if (this.hasArrow) {
                    b =
                            b == CKEDITOR.TRISTATE_ON ? this._.editor.lang.button.selectedLabel.replace(/%1/g, this.label) : this.label;
                    CKEDITOR.document.getById(this._.id + "_label").setText(b)
                } else b == CKEDITOR.TRISTATE_ON ? a.setAttribute("aria-pressed", true) : a.removeAttribute("aria-pressed");
                return true
            }
            return false
        }, getState: function () {
            return this._.state
        }, toFeature: function (b) {
            if (this._.feature)return this._.feature;
            var a = this;
            !this.allowedContent && (!this.requiredContent && this.command) && (a = b.getCommand(this.command) || a);
            return this._.feature =
                a
        }};
        CKEDITOR.ui.prototype.addButton = function (b, a) {
            this.add(b, CKEDITOR.UI_BUTTON, a)
        }
    }(),function () {
        function c(a) {
            function b() {
                for (var e = c(), g = CKEDITOR.tools.clone(a.config.toolbarGroups) || f(a), i = 0; i < g.length; i++) {
                    var j = g[i];
                    if (j != "/") {
                        typeof j == "string" && (j = g[i] = {name: j});
                        var m, r = j.groups;
                        if (r)for (var t = 0; t < r.length; t++) {
                            m = r[t];
                            (m = e[m]) && d(j, m)
                        }
                        (m = e[j.name]) && d(j, m)
                    }
                }
                return g
            }

            function c() {
                var b = {}, e, d, f;
                for (e in a.ui.items) {
                    d = a.ui.items[e];
                    f = d.toolbar || "others";
                    f = f.split(",");
                    d = f[0];
                    f = parseInt(f[1] || -1, 10);
                    b[d] || (b[d] = []);
                    b[d].push({name: e, order: f})
                }
                for (d in b)b[d] = b[d].sort(function (a, b) {
                    return a.order == b.order ? 0 : b.order < 0 ? -1 : a.order < 0 ? 1 : a.order < b.order ? -1 : 1
                });
                return b
            }

            function d(b, c) {
                if (c.length) {
                    b.items ? b.items.push(a.ui.create("-")) : b.items = [];
                    for (var e; e = c.shift();) {
                        e = typeof e == "string" ? e : e.name;
                        if (!i || CKEDITOR.tools.indexOf(i, e) == -1)(e = a.ui.create(e)) && a.addFeature(e) && b.items.push(e)
                    }
                }
            }

            function g(a) {
                var b = [], c, e, f;
                for (c = 0; c < a.length; ++c) {
                    e = a[c];
                    f = {};
                    if (e == "/")b.push(e); else if (CKEDITOR.tools.isArray(e)) {
                        d(f,
                            CKEDITOR.tools.clone(e));
                        b.push(f)
                    } else if (e.items) {
                        d(f, CKEDITOR.tools.clone(e.items));
                        f.name = e.name;
                        b.push(f)
                    }
                }
                return b
            }

            var i = a.config.removeButtons, i = i && i.split(","), j = a.config.toolbar;
            typeof j == "string" && (j = a.config["toolbar_" + j]);
            return a.toolbar = j ? g(j) : b()
        }

        function f(a) {
            return a._.toolbarGroups || (a._.toolbarGroups = [
                {name: "document", groups: ["mode", "document", "doctools"]},
                {name: "clipboard", groups: ["clipboard", "undo"]},
                {name: "editing", groups: ["find", "selection", "spellchecker"]},
                {name: "forms"},
                "/",
                {name: "basicstyles", groups: ["basicstyles", "cleanup"]},
                {name: "paragraph", groups: ["list", "indent", "blocks", "align", "bidi"]},
                {name: "links"},
                {name: "insert"},
                "/",
                {name: "styles"},
                {name: "colors"},
                {name: "tools"},
                {name: "others"},
                {name: "about"}
            ])
        }

        var d = function () {
            this.toolbars = [];
            this.focusCommandExecuted = false
        };
        d.prototype.focus = function () {
            for (var a = 0, b; b = this.toolbars[a++];)for (var c = 0, d; d = b.items[c++];)if (d.focus) {
                d.focus();
                return
            }
        };
        var b = {modes: {wysiwyg: 1, source: 1}, readOnly: 1, exec: function (a) {
            if (a.toolbox) {
                a.toolbox.focusCommandExecuted =
                    true;
                CKEDITOR.env.ie || CKEDITOR.env.air ? setTimeout(function () {
                    a.toolbox.focus()
                }, 100) : a.toolbox.focus()
            }
        }};
        CKEDITOR.plugins.add("toolbar", {requires: "button", init: function (a) {
            var e, f = function (b, c) {
                var d, j = a.lang.dir == "rtl", n = a.config.toolbarGroupCycling, o = j ? 37 : 39, j = j ? 39 : 37, n = n === void 0 || n;
                switch (c) {
                    case 9:
                    case CKEDITOR.SHIFT + 9:
                        for (; !d || !d.items.length;) {
                            d = c == 9 ? (d ? d.next : b.toolbar.next) || a.toolbox.toolbars[0] : (d ? d.previous : b.toolbar.previous) || a.toolbox.toolbars[a.toolbox.toolbars.length - 1];
                            if (d.items.length)for (b =
                                                        d.items[e ? d.items.length - 1 : 0]; b && !b.focus;)(b = e ? b.previous : b.next) || (d = 0)
                        }
                        b && b.focus();
                        return false;
                    case o:
                        d = b;
                        do {
                            d = d.next;
                            !d && n && (d = b.toolbar.items[0])
                        } while (d && !d.focus);
                        d ? d.focus() : f(b, 9);
                        return false;
                    case 40:
                        if (b.button && b.button.hasArrow) {
                            a.once("panelShow", function (a) {
                                a.data._.panel._.currentBlock.onKeyDown(40)
                            });
                            b.execute()
                        } else f(b, c == 40 ? o : j);
                        return false;
                    case j:
                    case 38:
                        d = b;
                        do {
                            d = d.previous;
                            !d && n && (d = b.toolbar.items[b.toolbar.items.length - 1])
                        } while (d && !d.focus);
                        if (d)d.focus(); else {
                            e = 1;
                            f(b,
                                    CKEDITOR.SHIFT + 9);
                            e = 0
                        }
                        return false;
                    case 27:
                        a.focus();
                        return false;
                    case 13:
                    case 32:
                        b.execute();
                        return false
                }
                return true
            };
            a.on("uiSpace", function (b) {
                if (b.data.space == a.config.toolbarLocation) {
                    b.removeListener();
                    a.toolbox = new d;
                    var e = CKEDITOR.tools.getNextId(), i = ['<span id="', e, '" class="cke_voice_label">', a.lang.toolbar.toolbars, "</span>", '<span id="' + a.ui.spaceId("toolbox") + '" class="cke_toolbox" role="group" aria-labelledby="', e, '" onmousedown="return false;">'], e = a.config.toolbarStartupExpanded !==
                        false, j, n;
                    a.config.toolbarCanCollapse && a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE && i.push('<span class="cke_toolbox_main"' + (e ? ">" : ' style="display:none">'));
                    for (var o = a.toolbox.toolbars, q = c(a), l = 0; l < q.length; l++) {
                        var m, r = 0, t, p = q[l], u;
                        if (p) {
                            if (j) {
                                i.push("</span>");
                                n = j = 0
                            }
                            if (p === "/")i.push('<span class="cke_toolbar_break"></span>'); else {
                                u = p.items || p;
                                for (var s = 0; s < u.length; s++) {
                                    var x = u[s], y;
                                    if (x)if (x.type == CKEDITOR.UI_SEPARATOR)n = j && x; else {
                                        y = x.canGroup !== false;
                                        if (!r) {
                                            m = CKEDITOR.tools.getNextId();
                                            r = {id: m,
                                                items: []};
                                            t = p.name && (a.lang.toolbar.toolbarGroups[p.name] || p.name);
                                            i.push('<span id="', m, '" class="cke_toolbar"', t ? ' aria-labelledby="' + m + '_label"' : "", ' role="toolbar">');
                                            t && i.push('<span id="', m, '_label" class="cke_voice_label">', t, "</span>");
                                            i.push('<span class="cke_toolbar_start"></span>');
                                            var v = o.push(r) - 1;
                                            if (v > 0) {
                                                r.previous = o[v - 1];
                                                r.previous.next = r
                                            }
                                        }
                                        if (y) {
                                            if (!j) {
                                                i.push('<span class="cke_toolgroup" role="presentation">');
                                                j = 1
                                            }
                                        } else if (j) {
                                            i.push("</span>");
                                            j = 0
                                        }
                                        m = function (b) {
                                            b = b.render(a, i);
                                            v = r.items.push(b) -
                                                1;
                                            if (v > 0) {
                                                b.previous = r.items[v - 1];
                                                b.previous.next = b
                                            }
                                            b.toolbar = r;
                                            b.onkey = f;
                                            b.onfocus = function () {
                                                a.toolbox.focusCommandExecuted || a.focus()
                                            }
                                        };
                                        if (n) {
                                            m(n);
                                            n = 0
                                        }
                                        m(x)
                                    }
                                }
                                if (j) {
                                    i.push("</span>");
                                    n = j = 0
                                }
                                r && i.push('<span class="cke_toolbar_end"></span></span>')
                            }
                        }
                    }
                    a.config.toolbarCanCollapse && i.push("</span>");
                    if (a.config.toolbarCanCollapse && a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                        var A = CKEDITOR.tools.addFunction(function () {
                            a.execCommand("toolbarCollapse")
                        });
                        a.on("destroy", function () {
                            CKEDITOR.tools.removeFunction(A)
                        });
                        a.addCommand("toolbarCollapse", {readOnly: 1, exec: function (a) {
                            var b = a.ui.space("toolbar_collapser"), c = b.getPrevious(), d = a.ui.space("contents"), e = c.getParent(), f = parseInt(d.$.style.height, 10), g = e.$.offsetHeight, h = b.hasClass("cke_toolbox_collapser_min");
                            if (h) {
                                c.show();
                                b.removeClass("cke_toolbox_collapser_min");
                                b.setAttribute("title", a.lang.toolbar.toolbarCollapse)
                            } else {
                                c.hide();
                                b.addClass("cke_toolbox_collapser_min");
                                b.setAttribute("title", a.lang.toolbar.toolbarExpand)
                            }
                            b.getFirst().setText(h ? "▲" : "◀");
                            d.setStyle("height", f - (e.$.offsetHeight - g) + "px");
                            a.fire("resize")
                        }, modes: {wysiwyg: 1, source: 1}});
                        a.setKeystroke(CKEDITOR.ALT + (CKEDITOR.env.ie || CKEDITOR.env.webkit ? 189 : 109), "toolbarCollapse");
                        i.push('<a title="' + (e ? a.lang.toolbar.toolbarCollapse : a.lang.toolbar.toolbarExpand) + '" id="' + a.ui.spaceId("toolbar_collapser") + '" tabIndex="-1" class="cke_toolbox_collapser');
                        e || i.push(" cke_toolbox_collapser_min");
                        i.push('" onclick="CKEDITOR.tools.callFunction(' + A + ')">', '<span class="cke_arrow">&#9650;</span>',
                            "</a>")
                    }
                    i.push("</span>");
                    b.data.html = b.data.html + i.join("")
                }
            });
            a.on("destroy", function () {
                if (this.toolbox) {
                    var a, b = 0, c, d, e;
                    for (a = this.toolbox.toolbars; b < a.length; b++) {
                        d = a[b].items;
                        for (c = 0; c < d.length; c++) {
                            e = d[c];
                            e.clickFn && CKEDITOR.tools.removeFunction(e.clickFn);
                            e.keyDownFn && CKEDITOR.tools.removeFunction(e.keyDownFn)
                        }
                    }
                }
            });
            a.on("uiReady", function () {
                var b = a.ui.space("toolbox");
                b && a.focusManager.add(b, 1)
            });
            a.addCommand("toolbarFocus", b);
            a.setKeystroke(CKEDITOR.ALT + 121, "toolbarFocus");
            a.ui.add("-", CKEDITOR.UI_SEPARATOR,
                {});
            a.ui.addHandler(CKEDITOR.UI_SEPARATOR, {create: function () {
                return{render: function (a, b) {
                    b.push('<span class="cke_toolbar_separator" role="separator"></span>');
                    return{}
                }}
            }})
        }});
        CKEDITOR.ui.prototype.addToolbarGroup = function (a, b, c) {
            var d = f(this.editor), g = b === 0, i = {name: a};
            if (c) {
                if (c = CKEDITOR.tools.search(d, function (a) {
                    return a.name == c
                })) {
                    !c.groups && (c.groups = []);
                    if (b) {
                        b = CKEDITOR.tools.indexOf(c.groups, b);
                        if (b >= 0) {
                            c.groups.splice(b + 1, 0, a);
                            return
                        }
                    }
                    g ? c.groups.splice(0, 0, a) : c.groups.push(a);
                    return
                }
                b = null
            }
            b &&
            (b = CKEDITOR.tools.indexOf(d, function (a) {
                return a.name == b
            }));
            g ? d.splice(0, 0, a) : typeof b == "number" ? d.splice(b + 1, 0, i) : d.push(a)
        }
    }(),CKEDITOR.UI_SEPARATOR = "separator",CKEDITOR.config.toolbarLocation = "top",function () {
        function c(b) {
            this.editor = b;
            this.reset()
        }

        CKEDITOR.plugins.add("undo", {init: function (b) {
            function a(a) {
                f.enabled && a.data.command.canUndo !== false && f.save()
            }

            function d() {
                f.enabled = b.readOnly ? false : b.mode == "wysiwyg";
                f.onChange()
            }

            var f = b.undoManager = new c(b), k = b.addCommand("undo", {exec: function () {
                if (f.undo()) {
                    b.selectionChange();
                    this.fire("afterUndo")
                }
            }, startDisabled: true, canUndo: false}), g = b.addCommand("redo", {exec: function () {
                if (f.redo()) {
                    b.selectionChange();
                    this.fire("afterRedo")
                }
            }, startDisabled: true, canUndo: false}), i = [CKEDITOR.CTRL + 90, CKEDITOR.CTRL + 89, CKEDITOR.CTRL + CKEDITOR.SHIFT + 90];
            b.setKeystroke([
                [i[0], "undo"],
                [i[1], "redo"],
                [i[2], "redo"]
            ]);
            b.on("contentDom", function () {
                var a = b.editable();
                a.attachListener(a, "keydown", function (a) {
                    CKEDITOR.tools.indexOf(i, a.data.getKeystroke()) > -1 && a.data.preventDefault()
                })
            });
            f.onChange =
                function () {
                    k.setState(f.undoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
                    g.setState(f.redoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
                };
            b.on("beforeCommandExec", a);
            b.on("afterCommandExec", a);
            b.on("saveSnapshot", function (a) {
                f.save(a.data && a.data.contentOnly)
            });
            b.on("contentDom", function () {
                b.editable().on("keydown", function (a) {
                    a = a.data.getKey();
                    (a == 8 || a == 46) && f.type(a, 0)
                });
                b.editable().on("keypress", function (a) {
                    f.type(a.data.getKey(), 1)
                })
            });
            b.on("beforeModeUnload", function () {
                b.mode ==
                "wysiwyg" && f.save(true)
            });
            b.on("mode", d);
            b.on("readOnly", d);
            if (b.ui.addButton) {
                b.ui.addButton("Undo", {label: b.lang.undo.undo, command: "undo", toolbar: "undo,10"});
                b.ui.addButton("Redo", {label: b.lang.undo.redo, command: "redo", toolbar: "undo,20"})
            }
            b.resetUndo = function () {
                f.reset();
                b.fire("saveSnapshot")
            };
            b.on("updateSnapshot", function () {
                f.currentImage && f.update()
            });
            b.on("lockSnapshot", function (a) {
                a = a.data;
                f.lock(a && a.dontUpdate, a && a.forceUpdate)
            });
            b.on("unlockSnapshot", f.unlock, f)
        }});
        CKEDITOR.plugins.undo =
        {};
        var f = CKEDITOR.plugins.undo.Image = function (b, a) {
            this.editor = b;
            b.fire("beforeUndoImage");
            var c = b.getSnapshot();
            CKEDITOR.env.ie && c && (c = c.replace(/\s+data-cke-expando=".*?"/g, ""));
            this.contents = c;
            if (!a)this.bookmarks = (c = c && b.getSelection()) && c.createBookmarks2(true);
            b.fire("afterUndoImage")
        }, d = /\b(?:href|src|name)="[^"]*?"/gi;
        f.prototype = {equalsContent: function (b) {
            var a = this.contents, b = b.contents;
            if (CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks)) {
                a = a.replace(d, "");
                b = b.replace(d, "")
            }
            return a !=
                b ? false : true
        }, equalsSelection: function (b) {
            var a = this.bookmarks, b = b.bookmarks;
            if (a || b) {
                if (!a || !b || a.length != b.length)return false;
                for (var c = 0; c < a.length; c++) {
                    var d = a[c], f = b[c];
                    if (d.startOffset != f.startOffset || d.endOffset != f.endOffset || !CKEDITOR.tools.arrayCompare(d.start, f.start) || !CKEDITOR.tools.arrayCompare(d.end, f.end))return false
                }
            }
            return true
        }};
        c.prototype = {type: function (b, a) {
            var c = !a && b != this.lastKeystroke, d = this.editor;
            if (!this.typing || a && !this.wasCharacter || c) {
                var k = new f(d), g = this.snapshots.length;
                CKEDITOR.tools.setTimeout(function () {
                    var a = d.getSnapshot();
                    CKEDITOR.env.ie && (a = a.replace(/\s+data-cke-expando=".*?"/g, ""));
                    if (k.contents != a && g == this.snapshots.length) {
                        this.typing = true;
                        this.save(false, k, false) || this.snapshots.splice(this.index + 1, this.snapshots.length - this.index - 1);
                        this.hasUndo = true;
                        this.hasRedo = false;
                        this.modifiersCount = this.typesCount = 1;
                        this.onChange()
                    }
                }, 0, this)
            }
            this.lastKeystroke = b;
            if (this.wasCharacter = a) {
                this.modifiersCount = 0;
                this.typesCount++;
                if (this.typesCount > 25) {
                    this.save(false,
                        null, false);
                    this.typesCount = 1
                } else setTimeout(function () {
                    d.fire("change")
                }, 0)
            } else {
                this.typesCount = 0;
                this.modifiersCount++;
                if (this.modifiersCount > 25) {
                    this.save(false, null, false);
                    this.modifiersCount = 1
                } else setTimeout(function () {
                    d.fire("change")
                }, 0)
            }
        }, reset: function () {
            this.lastKeystroke = 0;
            this.snapshots = [];
            this.index = -1;
            this.limit = this.editor.config.undoStackSize || 20;
            this.currentImage = null;
            this.hasRedo = this.hasUndo = false;
            this.locked = null;
            this.resetType()
        }, resetType: function () {
            this.typing = false;
            delete this.lastKeystroke;
            this.modifiersCount = this.typesCount = 0
        }, fireChange: function () {
            this.hasUndo = !!this.getNextImage(true);
            this.hasRedo = !!this.getNextImage(false);
            this.resetType();
            this.onChange()
        }, save: function (b, a, c) {
            var d = this.editor;
            if (this.locked || d.status != "ready" || d.mode != "wysiwyg")return false;
            var k = d.editable();
            if (!k || k.status != "ready")return false;
            k = this.snapshots;
            a || (a = new f(d));
            if (a.contents === false)return false;
            if (this.currentImage)if (a.equalsContent(this.currentImage)) {
                if (b || a.equalsSelection(this.currentImage))return false
            } else d.fire("change");
            k.splice(this.index + 1, k.length - this.index - 1);
            k.length == this.limit && k.shift();
            this.index = k.push(a) - 1;
            this.currentImage = a;
            c !== false && this.fireChange();
            return true
        }, restoreImage: function (b) {
            var a = this.editor, c;
            if (b.bookmarks) {
                a.focus();
                c = a.getSelection()
            }
            this.locked = 1;
            this.editor.loadSnapshot(b.contents);
            if (b.bookmarks)c.selectBookmarks(b.bookmarks); else if (CKEDITOR.env.ie) {
                c = this.editor.document.getBody().$.createTextRange();
                c.collapse(true);
                c.select()
            }
            this.locked = 0;
            this.index = b.index;
            this.currentImage =
                this.snapshots[this.index];
            this.update();
            this.fireChange();
            a.fire("change")
        }, getNextImage: function (b) {
            var a = this.snapshots, c = this.currentImage, d;
            if (c)if (b)for (d = this.index - 1; d >= 0; d--) {
                b = a[d];
                if (!c.equalsContent(b)) {
                    b.index = d;
                    return b
                }
            } else for (d = this.index + 1; d < a.length; d++) {
                b = a[d];
                if (!c.equalsContent(b)) {
                    b.index = d;
                    return b
                }
            }
            return null
        }, redoable: function () {
            return this.enabled && this.hasRedo
        }, undoable: function () {
            return this.enabled && this.hasUndo
        }, undo: function () {
            if (this.undoable()) {
                this.save(true);
                var b = this.getNextImage(true);
                if (b)return this.restoreImage(b), true
            }
            return false
        }, redo: function () {
            if (this.redoable()) {
                this.save(true);
                if (this.redoable()) {
                    var b = this.getNextImage(false);
                    if (b)return this.restoreImage(b), true
                }
            }
            return false
        }, update: function (b) {
            if (!this.locked) {
                b || (b = new f(this.editor));
                for (var a = this.index, c = this.snapshots; a > 0 && this.currentImage.equalsContent(c[a - 1]);)a = a - 1;
                c.splice(a, this.index - a + 1, b);
                this.index = a;
                this.currentImage = b
            }
        }, lock: function (b, a) {
            if (this.locked)this.locked.level++;
            else if (b)this.locked = {level: 1}; else {
                var c = null;
                if (a)c = true; else {
                    var d = new f(this.editor, true);
                    this.currentImage && this.currentImage.equalsContent(d) && (c = d)
                }
                this.locked = {update: c, level: 1}
            }
        }, unlock: function () {
            if (this.locked && !--this.locked.level) {
                var b = this.locked.update;
                this.locked = null;
                if (b === true)this.update(); else if (b) {
                    var a = new f(this.editor, true);
                    b.equalsContent(a) || this.update()
                }
            }
        }}
    }(),function () {
        function c(b) {
            var a = this.editor, c = b.document, d = c.body, f = c.getElementById("cke_actscrpt");
            f && f.parentNode.removeChild(f);
            (f = c.getElementById("cke_shimscrpt")) && f.parentNode.removeChild(f);
            if (CKEDITOR.env.gecko) {
                d.contentEditable = false;
                if (CKEDITOR.env.version < 2E4) {
                    d.innerHTML = d.innerHTML.replace(/^.*<\!-- cke-content-start --\>/, "");
                    setTimeout(function () {
                        var b = new CKEDITOR.dom.range(new CKEDITOR.dom.document(c));
                        b.setStart(new CKEDITOR.dom.node(d), 0);
                        a.getSelection().selectRanges([b])
                    }, 0)
                }
            }
            d.contentEditable = true;
            if (CKEDITOR.env.ie) {
                d.hideFocus = true;
                d.disabled = true;
                d.removeAttribute("disabled")
            }
            delete this._.isLoadingData;
            this.$ = d;
            c = new CKEDITOR.dom.document(c);
            this.setup();
            if (CKEDITOR.env.ie) {
                c.getDocumentElement().addClass(c.$.compatMode);
                a.config.enterMode != CKEDITOR.ENTER_P && this.attachListener(c, "selectionchange", function () {
                    var b = c.getBody(), d = a.getSelection(), f = d && d.getRanges()[0];
                    f && (b.getHtml().match(/^<p>(?:&nbsp;|<br>)<\/p>$/i) && f.startContainer.equals(b)) && setTimeout(function () {
                            f = a.getSelection().getRanges()[0];
                            if (!f.startContainer.equals("body")) {
                                b.getFirst().remove(1);
                                f.moveToElementEditEnd(b);
                                f.select()
                            }
                        },
                        0)
                })
            }
            if (CKEDITOR.env.webkit || CKEDITOR.env.ie && CKEDITOR.env.version > 10)c.getDocumentElement().on("mousedown", function (b) {
                b.data.getTarget().is("html") && setTimeout(function () {
                    a.editable().focus()
                })
            });
            try {
                a.document.$.execCommand("2D-position", false, true)
            } catch (g) {
            }
            try {
                a.document.$.execCommand("enableInlineTableEditing", false, !a.config.disableNativeTableHandles)
            } catch (i) {
            }
            if (a.config.disableObjectResizing)try {
                this.getDocument().$.execCommand("enableObjectResizing", false, false)
            } catch (j) {
                this.attachListener(this,
                    CKEDITOR.env.ie ? "resizestart" : "resize", function (a) {
                        a.data.preventDefault()
                    })
            }
            (CKEDITOR.env.gecko || CKEDITOR.env.ie && a.document.$.compatMode == "CSS1Compat") && this.attachListener(this, "keydown", function (b) {
                var c = b.data.getKeystroke();
                if (c == 33 || c == 34)if (CKEDITOR.env.ie)setTimeout(function () {
                    a.getSelection().scrollIntoView()
                }, 0); else if (a.window.$.innerHeight > this.$.offsetHeight) {
                    var d = a.createRange();
                    d[c == 33 ? "moveToElementEditStart" : "moveToElementEditEnd"](this);
                    d.select();
                    b.data.preventDefault()
                }
            });
            CKEDITOR.env.ie &&
            this.attachListener(c, "blur", function () {
                try {
                    c.$.selection.empty()
                } catch (a) {
                }
            });
            CKEDITOR.env.iOS && this.attachListener(c, "touchend", function () {
                b.focus()
            });
            a.document.getElementsByTag("title").getItem(0).data("cke-title", a.document.$.title);
            if (CKEDITOR.env.ie)a.document.$.title = this._.docTitle;
            CKEDITOR.tools.setTimeout(function () {
                if (this.status == "unloaded")this.status = "ready";
                a.fire("contentDom");
                if (this._.isPendingFocus) {
                    a.focus();
                    this._.isPendingFocus = false
                }
                setTimeout(function () {
                        a.fire("dataReady")
                    },
                    0);
                CKEDITOR.env.ie && setTimeout(function () {
                    if (a.document) {
                        var b = a.document.$.body;
                        b.runtimeStyle.marginBottom = "0px";
                        b.runtimeStyle.marginBottom = ""
                    }
                }, 1E3)
            }, 0, this)
        }

        function f() {
            var b = [];
            if (CKEDITOR.document.$.documentMode >= 8) {
                b.push("html.CSS1Compat [contenteditable=false]{min-height:0 !important}");
                var a = [], c;
                for (c in CKEDITOR.dtd.$removeEmpty)a.push("html.CSS1Compat " + c + "[contenteditable=false]");
                b.push(a.join(",") + "{display:inline-block}")
            } else if (CKEDITOR.env.gecko) {
                b.push("html{height:100% !important}");
                b.push("img:-moz-broken{-moz-force-broken-image-icon:1;min-width:24px;min-height:24px}")
            }
            b.push("html{cursor:text;*cursor:auto}");
            b.push("img,input,textarea{cursor:default}");
            return b.join("\n")
        }

        CKEDITOR.plugins.add("wysiwygarea", {init: function (b) {
            b.config.fullPage && b.addFeature({allowedContent: "html head title; style [media,type]; body (*)[id]; meta link [*]", requiredContent: "body"});
            b.addMode("wysiwyg", function (a) {
                function c(e) {
                    e && e.removeListener();
                    b.editable(new d(b, k.$.contentWindow.document.body));
                    b.setData(b.getData(1), a)
                }

                var f = "document.open();" + (CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain + ")();" : "") + "document.close();", f = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent(f) + "}())" : "", k = CKEDITOR.dom.element.createFromHtml('<iframe src="' + f + '" frameBorder="0"></iframe>');
                k.setStyles({width: "100%", height: "100%"});
                k.addClass("cke_wysiwyg_frame cke_reset");
                var g = b.ui.space("contents");
                g.append(k);
                if (f = CKEDITOR.env.ie || CKEDITOR.env.gecko)k.on("load",
                    c);
                var i = b.title, j = b.lang.common.editorHelp;
                if (i) {
                    CKEDITOR.env.ie && (i = i + (", " + j));
                    k.setAttribute("title", i)
                }
                var i = CKEDITOR.tools.getNextId(), n = CKEDITOR.dom.element.createFromHtml('<span id="' + i + '" class="cke_voice_label">' + j + "</span>");
                g.append(n, 1);
                b.on("beforeModeUnload", function (a) {
                    a.removeListener();
                    n.remove()
                });
                k.setAttributes({"aria-describedby": i, tabIndex: b.tabIndex, allowTransparency: "true"});
                !f && c();
                if (CKEDITOR.env.webkit) {
                    f = function () {
                        g.setStyle("width", "100%");
                        k.hide();
                        k.setSize("width",
                            g.getSize("width"));
                        g.removeStyle("width");
                        k.show()
                    };
                    k.setCustomData("onResize", f);
                    CKEDITOR.document.getWindow().on("resize", f)
                }
                b.fire("ariaWidget", k)
            })
        }});
        CKEDITOR.editor.prototype.addContentsCss = function (b) {
            var a = this.config, c = a.contentsCss;
            if (!CKEDITOR.tools.isArray(c))a.contentsCss = c ? [c] : [];
            a.contentsCss.push(b)
        };
        var d = CKEDITOR.tools.createClass({$: function (b) {
            this.base.apply(this, arguments);
            this._.frameLoadedHandler = CKEDITOR.tools.addFunction(function (a) {
                    CKEDITOR.tools.setTimeout(c, 0, this, a)
                },
                this);
            this._.docTitle = this.getWindow().getFrame().getAttribute("title")
        }, base: CKEDITOR.editable, proto: {setData: function (b, a) {
            var c = this.editor;
            if (a) {
                this.setHtml(b);
                c.fire("dataReady")
            } else {
                this._.isLoadingData = true;
                c._.dataStore = {id: 1};
                var d = c.config, k = d.fullPage, g = d.docType, i = CKEDITOR.tools.buildStyleHtml(f()).replace(/<style>/, '<style data-cke-temp="1">');
                k || (i = i + CKEDITOR.tools.buildStyleHtml(c.config.contentsCss));
                var j = d.baseHref ? '<base href="' + d.baseHref + '" data-cke-temp="1" />' : "";
                k && (b = b.replace(/<!DOCTYPE[^>]*>/i,
                    function (a) {
                        c.docType = g = a;
                        return""
                    }).replace(/<\?xml\s[^\?]*\?>/i, function (a) {
                        c.xmlDeclaration = a;
                        return""
                    }));
                b = c.dataProcessor.toHtml(b);
                if (k) {
                    /<body[\s|>]/.test(b) || (b = "<body>" + b);
                    /<html[\s|>]/.test(b) || (b = "<html>" + b + "</html>");
                    /<head[\s|>]/.test(b) ? /<title[\s|>]/.test(b) || (b = b.replace(/<head[^>]*>/, "$&<title></title>")) : b = b.replace(/<html[^>]*>/, "$&<head><title></title></head>");
                    j && (b = b.replace(/<head>/, "$&" + j));
                    b = b.replace(/<\/head\s*>/, i + "$&");
                    b = g + b
                } else b = d.docType + '<html dir="' + d.contentsLangDirection +
                    '" lang="' + (d.contentsLanguage || c.langCode) + '"><head><title>' + this._.docTitle + "</title>" + j + i + "</head><body" + (d.bodyId ? ' id="' + d.bodyId + '"' : "") + (d.bodyClass ? ' class="' + d.bodyClass + '"' : "") + ">" + b + "</body></html>";
                if (CKEDITOR.env.gecko) {
                    b = b.replace(/<body/, '<body contenteditable="true" ');
                    CKEDITOR.env.version < 2E4 && (b = b.replace(/<body[^>]*>/, "$&<\!-- cke-content-start --\>"))
                }
                d = '<script id="cke_actscrpt" type="text/javascript"' + (CKEDITOR.env.ie ? ' defer="defer" ' : "") + ">var wasLoaded=0;function onload(){if(!wasLoaded)window.parent.CKEDITOR.tools.callFunction(" +
                    this._.frameLoadedHandler + ",window);wasLoaded=1;}" + (CKEDITOR.env.ie ? "onload();" : 'document.addEventListener("DOMContentLoaded", onload, false );') + "<\/script>";
                CKEDITOR.env.ie && CKEDITOR.env.version < 9 && (d = d + '<script id="cke_shimscrpt">window.parent.CKEDITOR.tools.enableHtml5Elements(document)<\/script>');
                b = b.replace(/(?=\s*<\/(:?head)>)/, d);
                this.clearCustomData();
                this.clearListeners();
                c.fire("contentDomUnload");
                var n = this.getDocument();
                try {
                    n.write(b)
                } catch (o) {
                    setTimeout(function () {
                        n.write(b)
                    }, 0)
                }
            }
        },
            getData: function (b) {
                if (b)return this.getHtml();
                var b = this.editor, a = b.config, c = a.fullPage, d = c && b.docType, f = c && b.xmlDeclaration, g = this.getDocument(), c = c ? g.getDocumentElement().getOuterHtml() : g.getBody().getHtml();
                CKEDITOR.env.gecko && a.enterMode != CKEDITOR.ENTER_BR && (c = c.replace(/<br>(?=\s*(:?$|<\/body>))/, ""));
                c = b.dataProcessor.toDataFormat(c);
                f && (c = f + "\n" + c);
                d && (c = d + "\n" + c);
                return c
            }, focus: function () {
                this._.isLoadingData ? this._.isPendingFocus = true : d.baseProto.focus.call(this)
            }, detach: function () {
                var b =
                    this.editor, a = b.document, b = b.window.getFrame();
                d.baseProto.detach.call(this);
                this.clearCustomData();
                a.getDocumentElement().clearCustomData();
                b.clearCustomData();
                CKEDITOR.tools.removeFunction(this._.frameLoadedHandler);
                (a = b.removeCustomData("onResize")) && a.removeListener();
                b.remove()
            }}})
    }(),CKEDITOR.config.disableObjectResizing = !1,CKEDITOR.config.disableNativeTableHandles = !0,CKEDITOR.config.disableNativeSpellChecker = !0,CKEDITOR.config.contentsCss = CKEDITOR.getUrl("contents.css"),function () {
        function c(a) {
            a =
                a.data;
            if (/\.bmp$/.test(a.name)) {
                var b = a.image, c = document.createElement("canvas");
                c.width = b.width;
                c.height = b.height;
                c.getContext("2d").drawImage(b, 0, 0);
                a.file = c.toDataURL("image/png");
                a.name = a.name.replace(/\.bmp$/, ".png")
            }
        }

        function f(a) {
            var b = a.editor, c = b.config.simpleuploads_maximumDimensions, d = a.data.image;
            if (c.width && d.width > c.width) {
                alert(b.lang.simpleuploads.imageTooWide);
                a.cancel()
            } else if (c.height && d.height > c.height) {
                alert(b.lang.simpleuploads.imageTooTall);
                a.cancel()
            }
        }

        function d(a) {
            var b =
                "span.SimpleUploadsTmpWrapper>span { top: 50%; margin-top: -0.5em; width: 100%; text-align: center; color: #fff; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); font-size: 50px; font-family: Calibri,Arial,Sans-serif; pointer-events: none; position: absolute; display: inline-block;}";
            a.simpleuploads_hideImageProgress && (b = "span.SimpleUploadsTmpWrapper { color:#333; background-color:#fff; padding:4px; border:1px solid #EEE;}");
            return".SimpleUploadsOverEditor { " + (a.simpleuploads_editorover || "box-shadow: 0 0 10px 1px #999999 inset !important;") +
                " }a.SimpleUploadsTmpWrapper { color:#333; background-color:#fff; padding:4px; border:1px solid #EEE;}.SimpleUploadsTmpWrapper { display: inline-block; position: relative; pointer-events: none;}" + b + ".uploadRect {display: inline-block;height: 0.9em;vertical-align: middle;width: 20px;}.uploadRect span {background-color: #999;display: inline-block;height: 100%;vertical-align: top;}.SimpleUploadsTmpWrapper .uploadCancel { background-color: #333333;border-radius: 0.5em;color: #FFFFFF;cursor: pointer !important;display: inline-block;height: 1em;line-height: 0.8em;margin-left: 4px;padding-left: 0.18em;pointer-events: auto;position: relative; text-decoration:none; top: -2px;width: 0.7em;}.SimpleUploadsTmpWrapper span uploadCancel { width:1em; padding-left:0}"
        }

        function b(b, c, d, f) {
            if (B)alert("Please, wait to finish the current upload"); else {
                A = !c;
                v = b;
                if (typeof FormData == "undefined") {
                    var g = document.getElementById("simpleUploadsTarget");
                    if (!g) {
                        g = document.createElement("iframe");
                        g.style.display = "none";
                        g.id = "simpleUploadsTarget";
                        document.body.appendChild(g)
                    }
                    E = d;
                    F = f;
                    J = c;
                    d = b._.simpleuploadsFormUploadFn;
                    f = b._.simpleuploadsFormInitFn;
                    if (!d) {
                        b._.simpleuploadsFormUploadFn = d = CKEDITOR.tools.addFunction(e, b);
                        b._.simpleuploadsFormInitFn = f = CKEDITOR.tools.addFunction(function () {
                            window.setTimeout(function () {
                                var a =
                                    document.getElementById("simpleUploadsTarget").contentWindow.document.getElementById("upload");
                                a.onchange = function () {
                                    var a = {name: this.value, url: this.form.action, context: E, id: "IEUpload", requiresImage: J}, b = a.name.match(/\\([^\\]*)$/);
                                    if (b)a.name = b[1];
                                    if (typeof v.fire("simpleuploads.startUpload", a) != "boolean")if (a.requiresImage && !CKEDITOR.plugins.simpleuploads.isImageExtension(v, a.name))alert(v.lang.simpleuploads.nonImageExtension); else {
                                        F && F.start && F.start(a);
                                        B = this.value;
                                        this.form.action = a.url;
                                        if (a.extraFields) {
                                            var a =
                                                a.extraFields, b = this.ownerDocument, c;
                                            for (c in a)if (a.hasOwnProperty(c)) {
                                                var d = b.createElement("input");
                                                d.type = "hidden";
                                                d.name = c;
                                                d.value = a[c];
                                                this.form.appendChild(d)
                                            }
                                        }
                                        this.form.submit()
                                    }
                                };
                                a.click()
                            }, 100)
                        }, b);
                        b.on("destroy", function () {
                            CKEDITOR.tools.removeFunction(this._.simpleuploadsFormUploadFn);
                            CKEDITOR.tools.removeFunction(this._.simpleuploadsFormInitFn)
                        })
                    }
                    b = 'document.open(); document.write("' + ("<form method='post' enctype='multipart/form-data' action='" + a(b, d, c) + "'><input type='file' name='upload' id='upload'></form>") +
                        '");document.close();window.parent.CKEDITOR.tools.callFunction(' + f + ");";
                    g.src = "javascript:void(function(){" + encodeURIComponent(b) + "}())";
                    g.onreadystatechange = function () {
                        g.readyState == "complete" && window.setTimeout(function () {
                            if (B) {
                                alert("The file upload has failed");
                                B = null
                            }
                        }, 100)
                    };
                    y = null
                } else {
                    c = {context: d, callback: f, requiresImage: c};
                    if (!y) {
                        y = document.createElement("input");
                        y.type = "file";
                        y.style.overflow = "hidden";
                        y.style.width = "1px";
                        y.style.height = "1px";
                        y.style.opacity = 0.1;
                        y.multiple = "multiple";
                        y.position =
                            "absolute";
                        y.zIndex = 1E3;
                        document.body.appendChild(y);
                        y.addEventListener("change", function () {
                            var a = y.files.length;
                            if (a) {
                                v.fire("saveSnapshot");
                                for (var b = 0; b < a; b++) {
                                    var c = y.files[b], d = CKEDITOR.tools.extend({}, y.simpleUploadData);
                                    d.file = c;
                                    d.name = c.name;
                                    d.id = CKEDITOR.plugins.simpleuploads.getTimeStampId();
                                    d.forceLink = A;
                                    d.mode = {type: "selectedFile", i: b, count: a};
                                    CKEDITOR.plugins.simpleuploads.insertSelectedFile(v, d)
                                }
                            }
                        })
                    }
                    y.value = "";
                    y.simpleUploadData = c;
                    if (CKEDITOR.env.webkit) {
                        var h = b.focusManager;
                        if (h && h.lock) {
                            h.lock();
                            setTimeout(function () {
                                h.unlock()
                            }, 500)
                        }
                    }
                    y.click()
                }
            }
        }

        function a(a, b, c) {
            c = c ? a.config.filebrowserImageUploadUrl : a.config.filebrowserUploadUrl;
            if (c == "base64")return c;
            var d = {};
            d.CKEditor = a.name;
            d.CKEditorFuncNum = b;
            d.langCode = a.langCode;
            return h(c, d)
        }

        function e(a, b) {
            typeof b == "string" && (b && !a) && alert(b);
            var c = v;
            c.fire("simpleuploads.endUpload", {name: B, ok: !!a});
            if (F) {
                F.upload(a, b, {context: E});
                F = B = null
            } else {
                if (a) {
                    var d, e;
                    if (A) {
                        d = new CKEDITOR.dom.element("a", c.document);
                        d.setText(a.match(/\/([^\/]+)$/)[1]);
                        e = "href"
                    } else {
                        d = new CKEDITOR.dom.element("img", c.document);
                        e = "src";
                        d.on("load", function (a) {
                            a.removeListener();
                            d.removeListener("error", i);
                            d.setAttribute("width", d.$.width);
                            d.setAttribute("height", d.$.height);
                            c.fire("simpleuploads.finishedUpload", {name: B, element: d})
                        });
                        d.on("error", i, null, d)
                    }
                    d.setAttribute(e, a);
                    d.data("cke-saved-" + e, a);
                    c.insertElement(d);
                    A && v.fire("simpleuploads.finishedUpload", {name: B, element: d})
                }
                B = null
            }
            E = null
        }

        function h(a, b) {
            var c = [];
            if (b)for (var d in b)c.push(d + "=" + encodeURIComponent(b[d]));
            else return a;
            return a + (a.indexOf("?") != -1 ? "&" : "?") + c.join("&")
        }

        function k(a) {
            a = a.data.$.dataTransfer;
            return!a || !a.types ? false : a.types.contains && a.types.contains("Files") && !a.types.contains("text/html") || a.types.indexOf && a.types.indexOf("Files") != -1 ? true : false
        }

        function g(a, b, c, d, e) {
            if (d.$.nodeName.toLowerCase() == "span") {
                var f;
                if (b.originalNode) {
                    f = b.originalNode.cloneNode(true);
                    f.removeAttribute("width");
                    f.removeAttribute("height");
                    f.style.width = "";
                    f.style.height = "";
                    f = new CKEDITOR.dom.element(f)
                } else f =
                    new CKEDITOR.dom.element("img", c.document);
                f.data("cke-saved-src", a);
                f.setAttribute("src", a);
                f.on("load", function (a) {
                    a.removeListener();
                    f.removeListener("error", i);
                    j(f, c, d, b.name)
                });
                f.on("error", i, null, d);
                d.data("cke-real-element-type", "img");
                d.data("cke-realelement", encodeURIComponent(f.getOuterHtml()));
                d.data("cke-real-node-type", CKEDITOR.NODE_ELEMENT)
            } else {
                if (b.originalNode) {
                    var g = b.originalNode.cloneNode(true);
                    d.$.parentNode.replaceChild(g, d.$);
                    d = new CKEDITOR.dom.element(g)
                } else {
                    d.removeAttribute("id");
                    d.removeAttribute("class");
                    d.removeAttribute("contentEditable");
                    d.setHtml(d.getFirst().getHtml())
                }
                d.data("cke-saved-" + e, a);
                d.setAttribute(e, a);
                c.fire("simpleuploads.finishedUpload", {name: b.name, element: d})
            }
        }

        function i(a) {
            a.removeListener();
            alert("Failed to load the image with the provided URL: '" + a.sender.data("cke-saved-src") + "'");
            a.listenerData.remove()
        }

        function j(a, b, c, d) {
            if (a.$.naturalWidth === 0)window.setTimeout(function () {
                j(a, b, c, d)
            }, 50); else {
                a.replace(c);
                a.setAttribute("width", a.$.width);
                a.setAttribute("height",
                    a.$.height);
                b.fire("simpleuploads.finishedUpload", {name: d, element: a});
                b.fire("updateSnapshot")
            }
        }

        function n(b, c) {
            var d = CKEDITOR.plugins.simpleuploads.isImageExtension(b, c.name), e = "href", f = false;
            if (!c.forceLink && d) {
                e = "src";
                f = true
            }
            c.callback && c.callback.setup(c);
            if (!c.url)c.url = a(b, 2, f);
            if (c.requiresImage && !d) {
                alert(b.lang.simpleuploads.nonImageExtension);
                return null
            }
            if (typeof b.fire("simpleuploads.startUpload", c) == "boolean")return null;
            if (c.url == "base64") {
                if (typeof c.file == "string")setTimeout(function () {
                    g(fileUrl,
                        c, b, el, e)
                }, 100); else {
                    var h = new FileReader;
                    h.onload = function () {
                        var a = h.result, d = b.document.getById(c.id);
                        setTimeout(function () {
                            g(a, c, b, d, e)
                        }, 100)
                    };
                    h.readAsDataURL(c.file)
                }
                return{}
            }
            var i = new XMLHttpRequest;
            if (d = i.upload)d.onprogress = function (a) {
                q(b, c.id, a)
            };
            c.xhr = i;
            i.open("POST", c.url);
            i.onload = function () {
                var a = i.responseText.match(/\((?:"|')?\d+(?:"|')?,\s*("|')(.*?[^\\]?)\1(?:,\s*(.*?))?\s*\)\s*;?/), d = a && a[2], f = a && a[3], h = c.id, j = b.document.getById(h);
                if (f) {
                    var k = f.match(/function\(\)\s*\{(.*)\}/);
                    if (k)f = new Function(k[1]); else {
                        k = f.substring(0, 1);
                        if (k == "'" || k == '"')f = f.substring(1, f.length - 1)
                    }
                }
                q(b, h, null);
                b.fire("updateSnapshot");
                b.fire("simpleuploads.endUpload", {name: c.name, ok: !!d, xhr: i, data: c});
                if (i.status != 200) {
                    i.status == 413 ? alert(b.lang.simpleuploads.fileTooBig) : alert("Error posting the file to " + c.url + "\r\nResponse status: " + i.status);
                    window.console && console.log(i)
                } else {
                    if (d) {
                        d = d.replace(/\\'/g, "'");
                        try {
                            var l = JSON.parse('{"url":"' + d + '"}');
                            if (l && l.url)d = l.url
                        } catch (m) {
                        }
                    }
                    if (!a) {
                        f = "Error posting the file to " +
                            c.url + "\r\nInvalid data returned (check console)";
                        window.console && console.log(i.responseText)
                    }
                }
                if (c.callback) {
                    !d && f && alert(f);
                    c.callback.upload(d, f, c)
                } else if (j) {
                    if (d)g(d, c, b, j, e); else {
                        c.originalNode ? j.$.parentNode.replaceChild(c.originalNode, j.$) : j.remove();
                        f && alert(f)
                    }
                    b.fire("updateSnapshot")
                }
            };
            i.onerror = function (a) {
                alert("Error posting the file to " + c.url);
                window.console && console.log(a);
                (a = b.document.getById(c.id)) && (c.originalNode ? a.$.parentNode.replaceChild(c.originalNode, a.$) : a.remove());
                b.fire("updateSnapshot")
            };
            i.onabort = function () {
                if (c.callback)c.callback.upload(null); else {
                    var a = b.document.getById(c.id);
                    a && (c.originalNode ? a.$.parentNode.replaceChild(c.originalNode, a.$) : a.remove());
                    b.fire("updateSnapshot")
                }
            };
            i.withCredentials = true;
            return i
        }

        function o(a, b) {
            if (!b.callback) {
                var c = CKEDITOR.plugins.simpleuploads.isImageExtension(a, b.name), d = !a.config.simpleuploads_hideImageProgress;
                if (!b.forceLink && c && d)c = l(b.file, b.id, a); else {
                    c = c && !b.forceLink ? new CKEDITOR.dom.element("span", a.document) : new CKEDITOR.dom.element("a",
                        a.document);
                    c.setAttribute("id", b.id);
                    c.setAttribute("class", "SimpleUploadsTmpWrapper");
                    c.setHtml("<span class='uploadName'>" + b.name + "</span> <span class='uploadRect'><span id='rect" + b.id + "'></span></span> <span id='text" + b.id + "' class='uploadText'> </span><span class='uploadCancel'>x</span>")
                }
                c.setAttribute("contentEditable", false);
                b.element = c
            }
            c = n(a, b);
            if (!c) {
                b.result = b.result || "";
                return false
            }
            if (!c.send)return true;
            b.callback && b.callback.start && b.callback.start(b);
            if (typeof b.file == "string") {
                var e =
                    "-----------------------------1966284435497298061834782736", f = b.name.match(/\.(\w+)$/)[1], e = e + ('\r\nContent-Disposition: form-data; name="upload"; filename="' + b.name + '"'), e = e + ("\r\nContent-type: image/" + f) + ("\r\n\r\n" + window.atob(b.file.split(",")[1])), e = e + "\r\n-----------------------------1966284435497298061834782736";
                if (b.extraFields) {
                    var f = b.extraFields, g;
                    for (g in f) {
                        e = e + ('\r\nContent-Disposition: form-data; name="' + unescape(encodeURIComponent(g)).replace(/=/g, "\\=") + '"');
                        e = e + ("\r\n\r\n" + unescape(encodeURIComponent(f[g])));
                        e = e + "\r\n-----------------------------1966284435497298061834782736"
                    }
                }
                e = e + "--";
                c.setRequestHeader("Content-Type", "multipart/form-data; boundary=---------------------------1966284435497298061834782736");
                g = new ArrayBuffer(e.length);
                g = new Uint8Array(g, 0);
                for (f = 0; f < e.length; f++)g[f] = e.charCodeAt(f) & 255
            } else {
                g = new FormData;
                g.append("upload", b.file, b.name);
                if (b.extraFields) {
                    d = b.extraFields;
                    for (f in d)d.hasOwnProperty(f) && g.append(f, d[f])
                }
                if (b.extraHeaders) {
                    f = b.extraHeaders;
                    for (e in f)f.hasOwnProperty(e) &&
                    c.setRequestHeader(e, f[e])
                }
            }
            c.send(g);
            return true
        }

        function q(a, b, c) {
            if (a.document && a.document.$) {
                var d = (CKEDITOR.dialog.getCurrent() ? CKEDITOR : a).document.$, e = d.getElementById("rect" + b), b = d.getElementById("text" + b);
                if (c) {
                    if (!c.lengthComputable)return;
                    d = (100 * c.loaded / c.total).toFixed(2) + "%";
                    a = (100 * c.loaded / c.total).toFixed() + "%"
                } else {
                    a = a.lang.simpleuploads.processing;
                    d = "100%"
                }
                if (e) {
                    e.setAttribute("width", d);
                    e.style.width = d;
                    if (!c)(e = e.parentNode) && e.className == "uploadRect" && e.parentNode.removeChild(e)
                }
                if (b) {
                    b.firstChild.nodeValue =
                        a;
                    if (!c)(c = b.nextSibling) && c.nodeName.toLowerCase() == "a" && c.parentNode.removeChild(c)
                }
            }
        }

        function l(a, b, c) {
            var d = new CKEDITOR.dom.element("span", c.document), e = d.$, f, g = c.document.$, c = g.createElement("span");
            d.setAttribute("id", b);
            d.setAttribute("class", "SimpleUploadsTmpWrapper");
            var h = g.createElement("span");
            h.setAttribute("id", "text" + b);
            h.appendChild(g.createTextNode("0 %"));
            e.appendChild(c);
            c.appendChild(h);
            h = g.createElement("span");
            h.appendChild(g.createTextNode("x"));
            c.appendChild(h);
            if (typeof a !=
                "string") {
                f = window.URL || window.webkitURL;
                if (!f || !f.revokeObjectURL)return d
            }
            c = g.createElementNS("http://www.w3.org/2000/svg", "svg");
            c.setAttribute("id", "svg" + b);
            h = g.createElement("img");
            if (f) {
                h.onload = function () {
                    if (this.onload) {
                        f.revokeObjectURL(this.src);
                        this.onload = null
                    }
                    var a = g.getElementById("svg" + b);
                    if (a) {
                        a.setAttribute("width", this.width + "px");
                        a.setAttribute("height", this.height + "px")
                    }
                    if (a = g.getElementById(b))a.style.width = this.width + "px"
                };
                h.src = f.createObjectURL(a)
            } else {
                h.src = a;
                h.onload = function () {
                    this.onload =
                        null;
                    var a = g.getElementById("svg" + b);
                    if (a) {
                        a.setAttribute("width", this.width + "px");
                        a.setAttribute("height", this.height + "px")
                    }
                };
                c.setAttribute("width", h.width + "px");
                c.setAttribute("height", h.height + "px")
            }
            e.appendChild(c);
            e = g.createElementNS("http://www.w3.org/2000/svg", "filter");
            e.setAttribute("id", "SVGdesaturate");
            c.appendChild(e);
            h = g.createElementNS("http://www.w3.org/2000/svg", "feColorMatrix");
            h.setAttribute("type", "saturate");
            h.setAttribute("values", "0");
            e.appendChild(h);
            e = g.createElementNS("http://www.w3.org/2000/svg",
                "clipPath");
            e.setAttribute("id", "SVGprogress" + b);
            c.appendChild(e);
            h = g.createElementNS("http://www.w3.org/2000/svg", "rect");
            h.setAttribute("id", "rect" + b);
            h.setAttribute("width", "0");
            h.setAttribute("height", "100%");
            e.appendChild(h);
            var i = g.createElementNS("http://www.w3.org/2000/svg", "image");
            i.setAttribute("width", "100%");
            i.setAttribute("height", "100%");
            if (f) {
                i.setAttributeNS("http://www.w3.org/1999/xlink", "href", f.createObjectURL(a));
                var j = function () {
                    f.revokeObjectURL(i.getAttributeNS("http://www.w3.org/1999/xlink",
                        "href"));
                    i.removeEventListener("load", j, false)
                };
                i.addEventListener("load", j, false)
            } else i.setAttributeNS("http://www.w3.org/1999/xlink", "href", a);
            a = i.cloneNode(true);
            i.setAttribute("filter", "url(#SVGdesaturate)");
            i.style.opacity = "0.5";
            c.appendChild(i);
            a.setAttribute("clip-path", "url(#SVGprogress" + b + ")");
            c.appendChild(a);
            return d
        }

        function m(a, c, d, e) {
            if (e.type != "file") {
                var f = c.substr(0, 5) == "image", g = e.filebrowser.target.split(":"), i = {setup: function (b) {
                    if (d.uploadUrl) {
                        if (f)b.requiresImage = true;
                        var c =
                        {};
                        c.CKEditor = a.name;
                        c.CKEditorFuncNum = 2;
                        c.langCode = a.langCode;
                        b.url = h(d.uploadUrl, c)
                    }
                }, start: function (a) {
                    var b = CKEDITOR.dialog.getCurrent();
                    b.showThrobber();
                    var c = b.throbber;
                    if (a.xhr) {
                        c.throbberTitle.setHtml("<span class='uploadName'>" + a.name + "</span> <span class='uploadRect'><span id='rect" + a.id + "'></span></span> <span id='text" + a.id + "' class='uploadText'> </span><a>x</a>");
                        var d = c.throbberCover, e = a.xhr;
                        if (d.timer) {
                            clearInterval(d.timer);
                            d.timer = null
                        }
                        c.throbberParent.setStyle("display", "none");
                        c.throbberTitle.getLast().on("click", function () {
                            e.abort()
                        });
                        b.on("hide", function () {
                            e.readyState == 1 && e.abort()
                        })
                    }
                    c.center()
                }, upload: function (a, b, c) {
                    var e = CKEDITOR.dialog.getCurrent();
                    e.throbber.hide();
                    if (!(typeof b == "function" && b.call(c.context.sender) === false) && !(d.onFileSelect && d.onFileSelect.call(c.context.sender, a, b) === false) && a) {
                        e.getContentElement(g[0], g[1]).setValue(a);
                        e.selectPage(g[0])
                    }
                }};
                if (e.filebrowser.action == "QuickUpload") {
                    d.hasQuickUpload = true;
                    d.onFileSelect = null;
                    if (!a.config.simpleuploads_respectDialogUploads) {
                        e.label =
                            f ? a.lang.simpleuploads.addImage : a.lang.simpleuploads.addFile;
                        e.onClick = function (c) {
                            b(a, f, c, i);
                            return false
                        };
                        d.getContents(e["for"][0]).get(e["for"][1]).hidden = true
                    }
                } else {
                    if (d.hasQuickUpload)return;
                    if (e.filebrowser.onSelect)d.onFileSelect = e.filebrowser.onSelect
                }
                if (a.plugins.fileDropHandler) {
                    if (e.filebrowser.action == "QuickUpload")d.uploadUrl = e.filebrowser.url;
                    d.onShow = CKEDITOR.tools.override(d.onShow || function () {
                    }, function (a) {
                        return function () {
                            typeof a == "function" && a.call(this);
                            if (!(e.filebrowser.action !=
                                "QuickUpload" && d.hasQuickUpload) && !this.handleFileDrop) {
                                this.handleFileDrop = true;
                                this.getParentEditor().plugins.fileDropHandler.addTarget(this.parts.contents, i)
                            }
                        }
                    })
                }
            }
        }

        function r(a, b, c, d) {
            for (var e in d) {
                var f = d[e];
                if (f) {
                    (f.type == "hbox" || f.type == "vbox" || f.type == "fieldset") && r(a, b, c, f.children);
                    f.filebrowser && f.filebrowser.url && m(a, b, c, f)
                }
            }
        }

        function t(a, b) {
            var c = a.document.getById(b.id);
            if (c) {
                var d = c.$.getElementsByTagName("a");
                if (!d || !d.length) {
                    d = c.$.getElementsByTagName("span");
                    if (!d || !d.length)return
                }
                for (c =
                         0; c < d.length; c++) {
                    var e = d[c];
                    if (e.innerHTML == "x") {
                        e.className = "uploadCancel";
                        e.onclick = function () {
                            b.xhr && b.xhr.abort()
                        }
                    }
                }
            }
        }

        function p(a) {
            var b = a.listenerData.editor, c = a.listenerData.dialog, d, e;
            if (d = a.data && a.data.$.clipboardData || b.config.forcePasteAsPlainText && window.clipboardData)if (CKEDITOR.env.gecko && b.config.forcePasteAsPlainText && d.types.length === 0)b.on("beforePaste", function (a) {
                a.removeListener();
                a.data.type = "html"
            }); else {
                var f = d.items || d.files;
                if (f && f.length) {
                    if (f[0].kind)for (d = 0; d < f.length; d++) {
                        e =
                            f[d];
                        if (e.kind == "string" && (e.type == "text/html" || e.type == "text/plain"))return
                    }
                    for (d = 0; d < f.length; d++) {
                        e = f[d];
                        if (!(e.kind && e.kind != "file")) {
                            a.data.preventDefault();
                            var g = e.getAsFile ? e.getAsFile() : e;
                            CKEDITOR.env.ie || b.config.forcePasteAsPlainText ? setTimeout(function () {
                                u(g, a)
                            }, 100) : u(g, a)
                        }
                    }
                    c && a.data.$.defaultPrevented && c.hide()
                }
            }
        }

        function u(a, b) {
            var c = b.listenerData.editor, d = b.listenerData.dialog, e = CKEDITOR.plugins.simpleuploads.getTimeStampId();
            CKEDITOR.plugins.simpleuploads.insertPastedFile(c, {context: b.data.$,
                name: a.name || e + ".png", file: a, forceLink: false, id: e, mode: {type: "pastedFile", dialog: d}})
        }

        function s(a) {
            var b = a.getFrameDocument(), c = b.getBody();
            if (!c || !c.$ || c.$.contentEditable != "true" && b.$.designMode != "on")setTimeout(function () {
                s(a)
            }, 100); else {
                c = CKEDITOR.dialog.getCurrent();
                b.on("paste", p, null, {dialog: c, editor: c.getParentEditor()})
            }
        }

        var x = {elements: {$: function (a) {
            a = a.attributes;
            if ((a && a["class"]) == "SimpleUploadsTmpWrapper")return false
        }}}, y, v, A, B, E, F, J;

        CKEDITOR.plugins.add("simpleuploads", {lang: ["en",
            "ar", "cs", "de", "es", "fr", "he", "hu", "it", "ja", "ko", "nl", "pl", "pt-br", "ru", "tr", "zh-cn"], onLoad: function () {
            CKEDITOR.addCss && CKEDITOR.addCss(d(CKEDITOR.config));
            var a = CKEDITOR.document.getHead().append("style");
            a.setAttribute("type", "text/css");
            var b = ".SimpleUploadsOverContainer {" + (CKEDITOR.config.simpleuploads_containerover || "box-shadow: 0 0 10px 1px #99DD99 !important;") + "} .SimpleUploadsOverDialog {" + (CKEDITOR.config.simpleuploads_dialogover || "box-shadow: 0 0 10px 4px #999999 inset !important;") +
                "} .SimpleUploadsOverCover {" + (CKEDITOR.config.simpleuploads_coverover || "box-shadow: 0 0 10px 4px #99DD99 !important;") + "} ", b = b + ".cke_throbber {margin: 0 auto; width: 100px;} .cke_throbber div {float: left; width: 8px; height: 9px; margin-left: 2px; margin-right: 2px; font-size: 1px;} .cke_throbber .cke_throbber_1 {background-color: #737357;} .cke_throbber .cke_throbber_2 {background-color: #8f8f73;} .cke_throbber .cke_throbber_3 {background-color: #abab8f;} .cke_throbber .cke_throbber_4 {background-color: #c7c7ab;} .cke_throbber .cke_throbber_5 {background-color: #e3e3c7;} .uploadRect {display: inline-block;height: 11px;vertical-align: middle;width: 50px;} .uploadRect span {background-color: #999;display: inline-block;height: 100%;vertical-align: top;} .uploadName {display: inline-block;max-width: 180px;overflow: hidden;text-overflow: ellipsis;vertical-align: top;white-space: pre;} .uploadText {font-size:80%;} .cke_throbberMain a {cursor: pointer; font-size: 14px; font-weight:bold; padding: 4px 5px;position: absolute;right:0; text-decoration:none; top: -2px;} .cke_throbberMain {background-color: #FFF; border:1px solid #e5e5e5; padding:4px 14px 4px 4px; min-width:250px; position:absolute;}";
            CKEDITOR.env.ie && CKEDITOR.env.version < 11 ? a.$.styleSheet.cssText = b : a.$.innerHTML = b
        }, init: function (a) {
            var e = a.config;
            if (typeof e.simpleuploads_imageExtensions == "undefined")e.simpleuploads_imageExtensions = "jpe?g|gif|png";
            a.addCss && a.addCss(d(e));
            if (!e.filebrowserImageUploadUrl)e.filebrowserImageUploadUrl = e.filebrowserUploadUrl;
            if (!e.filebrowserUploadUrl && !e.filebrowserImageUploadUrl) {
                if (window.console && console.log) {
                    console.log("The editor is missing the 'config.filebrowserUploadUrl' entry to know the url that will handle uploaded files.\r\nIt should handle the posted file as shown in Example 3: http://docs.cksource.com/CKEditor_3.x/Developers_Guide/File_Browser_%28Uploader%29/Custom_File_Browser#Example_3\r\nMore info: http://alfonsoml.blogspot.com/2009/12/using-your-own-uploader-in-ckeditor.html");
                    console[console.warn ? "warn" : "log"]("The 'SimpleUploads' plugin now is disabled.")
                }
            } else if (!(e.filebrowserImageUploadUrl == "base64" && typeof FormData == "undefined")) {
                a.addFeature && a.addFeature({allowedContent: "img[!src,width,height];a[!href];span[id](SimpleUploadsTmpWrapper);"});
                CKEDITOR.dialog.prototype.showThrobber = function () {
                    if (!this.throbber)this.throbber = {update: function () {
                        for (var a = this.throbberParent.$, b = a.childNodes, a = a.lastChild.className, c = b.length - 1; c > 0; c--)b[c].className = b[c - 1].className;
                        b[0].className = a
                    }, create: function (a) {
                        if (!this.throbberCover) {
                            var b = CKEDITOR.dom.element.createFromHtml('<div style="background-color:rgba(255,255,255,0.95);width:100%;height:100%;top:0;left:0; position:absolute; visibility:none;z-index:100;"></div>');
                            a.parts.close.setStyle("z-index", 101);
                            if (CKEDITOR.env.ie && CKEDITOR.env.version < 9) {
                                b.setStyle("zoom", 1);
                                b.setStyle("filter", "progid:DXImageTransform.Microsoft.gradient(startColorstr=#EEFFFFFF,endColorstr=#EEFFFFFF)")
                            }
                            b.appendTo(a.parts.dialog);
                            this.throbberCover =
                                b;
                            var c = new CKEDITOR.dom.element("div");
                            this.mainThrobber = c;
                            var d = new CKEDITOR.dom.element("div");
                            this.throbberParent = d;
                            var e = new CKEDITOR.dom.element("div");
                            this.throbberTitle = e;
                            b.append(c).addClass("cke_throbberMain");
                            c.append(e).addClass("cke_throbberTitle");
                            c.append(d).addClass("cke_throbber");
                            for (b = [1, 2, 3, 4, 5, 4, 3, 2]; b.length > 0;)d.append(new CKEDITOR.dom.element("div")).addClass("cke_throbber_" + b.shift());
                            this.center();
                            a.on("hide", this.hide, this)
                        }
                    }, center: function () {
                        var a = this.mainThrobber, b =
                            this.throbberCover, c = (b.$.offsetHeight - a.$.offsetHeight) / 2;
                        a.setStyle("left", ((b.$.offsetWidth - a.$.offsetWidth) / 2).toFixed() + "px");
                        a.setStyle("top", c.toFixed() + "px")
                    }, show: function () {
                        this.create(CKEDITOR.dialog.getCurrent());
                        this.throbberCover.setStyle("visibility", "");
                        this.timer = setInterval(CKEDITOR.tools.bind(this.update, this), 100)
                    }, hide: function () {
                        if (this.timer) {
                            clearInterval(this.timer);
                            this.timer = null
                        }
                        this.throbberCover && this.throbberCover.setStyle("visibility", "hidden")
                    }};
                    this.throbber.show()
                };
                a.on("simpleuploads.startUpload", function (a) {
                    var b = a.editor, c = b.config, d = a.data && a.data.file;
                    if (c.simpleuploads_maxFileSize && d && d.size && d.size > c.simpleuploads_maxFileSize) {
                        alert(b.lang.simpleuploads.fileTooBig);
                        a.cancel()
                    }
                    d = a.data.name;
                    if (c.simpleuploads_invalidExtensions && RegExp(".(?:" + c.simpleuploads_invalidExtensions + ")$", "i").test(d)) {
                        alert(b.lang.simpleuploads.invalidExtension);
                        a.cancel()
                    }
                    if (c.simpleuploads_acceptedExtensions && !RegExp(".(?:" + c.simpleuploads_acceptedExtensions + ")$", "i").test(d)) {
                        alert(b.lang.simpleuploads.nonAcceptedExtension.replace("%0",
                            c.simpleuploads_acceptedExtensions));
                        a.cancel()
                    }
                });
                a.on("simpleuploads.startUpload", function (a) {
                    var b = a.data, c = a.editor;
                    if (!b.image && !b.forceLink && CKEDITOR.plugins.simpleuploads.isImageExtension(c, b.name) && b.mode && b.mode.type && c.hasListeners("simpleuploads.localImageReady")) {
                        a.cancel();
                        if (b.mode.type == "base64paste") {
                            var d = CKEDITOR.plugins.simpleuploads.getTimeStampId();
                            b.result = "<span id='" + d + "' class='SimpleUploadsTmpWrapper' style='display:none'>&nbsp;</span>";
                            b.mode.id = d
                        }
                        var e = new Image;
                        e.onload =
                            function () {
                                var d = CKEDITOR.tools.extend({}, b);
                                d.image = e;
                                typeof c.fire("simpleuploads.localImageReady", d) != "boolean" && CKEDITOR.plugins.simpleuploads.insertProcessedFile(a.editor, d)
                            };
                        e.src = typeof b.file == "string" ? b.file : URL.createObjectURL(b.file)
                    }
                });
                if (e.simpleuploads_convertBmp)a.on("simpleuploads.localImageReady", c);
                if (e.simpleuploads_maximumDimensions)a.on("simpleuploads.localImageReady", f);
                a.on("simpleuploads.finishedUpload", function (b) {
                    if (a.widgets && a.plugins.image2) {
                        b = b.data.element;
                        if (b.getName() ==
                            "img") {
                            var c = a.widgets.getByElement(b);
                            if (c) {
                                c.data.src = b.data("cke-saved-src");
                                c.data.width = b.$.width;
                                c.data.height = b.$.height
                            } else {
                                a.widgets.initOn(b, "image2");
                                a.widgets.initOn(b, "image")
                            }
                        }
                    }
                });
                a.on("paste", function (b) {
                    var c = b.data;
                    if (c = c.html || c.type && c.type == "html" && c.dataValue) {
                        if (CKEDITOR.env.webkit && c.indexOf("webkit-fake-url") > 0) {
                            alert("Sorry, the images pasted with Safari aren't usable");
                            window.open("https://bugs.webkit.org/show_bug.cgi?id=49141");
                            c = c.replace(/<img src="webkit-fake-url:.*?">/g,
                                "")
                        }
                        e.filebrowserImageUploadUrl != "base64" && (c = c.replace(/<img(.*?) src="data:image\/.{3,4};base64,.*?"(.*?)>/g, function (b) {
                            if (!a.config.filebrowserImageUploadUrl)return"";
                            var c = b.match(/"(data:image\/(.{3,4});base64,.*?)"/), d = c[1], c = c[2].toLowerCase(), e = CKEDITOR.plugins.simpleuploads.getTimeStampId();
                            if (d.length < 128)return b;
                            c == "jpeg" && (c = "jpg");
                            var f = {context: "pastedimage", name: e + "." + c, id: e, forceLink: false, file: d, mode: {type: "base64paste"}};
                            if (!o(a, f))return f.result;
                            var b = f.element, g = b.$.innerHTML;
                            b.$.innerHTML = "&nbsp;";
                            a.on("afterPaste", function (b) {
                                b.removeListener();
                                if (b = a.document.$.getElementById(e)) {
                                    b.innerHTML = g;
                                    t(a, f)
                                }
                            });
                            return b.getOuterHtml()
                        }));
                        b.data.html ? b.data.html = c : b.data.dataValue = c
                    }
                });
                var g = function (b) {
                    if (a.mode == "wysiwyg") {
                        var c = a.document;
                        a.editable && (c = a.editable());
                        if (c.$.querySelector(".SimpleUploadsTmpWrapper")) {
                            b = b.name.substr(5).toLowerCase();
                            b == "redo" && a.getCommand(b).state == CKEDITOR.TRISTATE_DISABLED && (b = "undo");
                            a.execCommand(b)
                        }
                    }
                }, h = a.getCommand("undo");
                h && h.on("afterUndo",
                    g);
                (h = a.getCommand("redo")) && a.getCommand("redo").on("afterRedo", g);
                a.on("afterUndo", g);
                a.on("afterRedo", g);
                a.addCommand("addFile", {exec: function (a) {
                    b(a, false, this)
                }});
                a.ui.addButton("addFile", {label: a.lang.simpleuploads.addFile, command: "addFile", toolbar: "insert", allowedContent: "a[!href];span[id](SimpleUploadsTmpWrapper);", requiredContent: "a[!href]"});
                a.addCommand("addImage", {exec: function (a) {
                    b(a, true, this)
                }});
                a.ui.addButton && a.ui.addButton("addImage", {label: a.lang.simpleuploads.addImage, command: "addImage",
                    toolbar: "insert", allowedContent: "img[!src,width,height];span[id](SimpleUploadsTmpWrapper);", requiredContent: "img[!src]"});
                if (typeof FormData != "undefined") {
                    var i, j, l, m = -1, n, q, r, s = -1, u, v, x, y = function () {
                        var b = CKEDITOR.dialog.getCurrent();
                        b ? b.parts.title.getParent().removeClass("SimpleUploadsOverCover") : a.container.removeClass("SimpleUploadsOverContainer")
                    };
                    a.on("destroy", function () {
                        CKEDITOR.removeListener("simpleuploads.droppedFile", y);
                        CKEDITOR.document.removeListener("dragenter", B);
                        CKEDITOR.document.removeListener("dragleave",
                            E);
                        A()
                    });
                    var A = function () {
                        if (i && i.removeListener) {
                            l.removeListener("paste", p);
                            i.removeListener("dragenter", J);
                            i.removeListener("dragleave", Y);
                            i.removeListener("dragover", V);
                            i.removeListener("drop", F);
                            j = i = l = null
                        }
                    };
                    CKEDITOR.on("simpleuploads.droppedFile", y);
                    var B = function (b) {
                        if (s == -1 && k(b)) {
                            if (b = CKEDITOR.dialog.getCurrent()) {
                                if (!b.handleFileDrop)return;
                                b.parts.title.getParent().addClass("SimpleUploadsOverCover")
                            } else a.readOnly || a.container.addClass("SimpleUploadsOverContainer");
                            u = s = 0;
                            v = CKEDITOR.document.$.body.parentNode.clientWidth;
                            x = CKEDITOR.document.$.body.parentNode.clientHeight
                        }
                    }, E = function (a) {
                        if (s != -1) {
                            a = a.data.$;
                            if (a.clientX <= s || a.clientY <= u || a.clientX >= v || a.clientY >= x) {
                                y();
                                s = -1
                            }
                        }
                    };
                    CKEDITOR.document.on("dragenter", B);
                    CKEDITOR.document.on("dragleave", E);
                    var F = function (b) {
                        j.removeClass("SimpleUploadsOverEditor");
                        m = -1;
                        CKEDITOR.fire("simpleuploads.droppedFile");
                        s = -1;
                        if (a.readOnly) {
                            b.data.preventDefault();
                            return false
                        }
                        var c = b.data.$, d = c.dataTransfer;
                        if (d && d.files && d.files.length > 0) {
                            a.fire("saveSnapshot");
                            b.data.preventDefault();
                            for (var b = {ev: c, range: false, count: d.files.length, rangeParent: c.rangeParent, rangeOffset: c.rangeOffset}, e = 0; e < d.files.length; e++) {
                                var f = d.files[e], g = CKEDITOR.tools.getNextId();
                                CKEDITOR.plugins.simpleuploads.insertDroppedFile(a, {context: c, name: f.name, file: f, forceLink: c.shiftKey, id: g, mode: {type: "droppedFile", dropLocation: b}})
                            }
                        }
                    }, J = function (b) {
                        if (m == -1 && k(b)) {
                            a.readOnly || j.addClass("SimpleUploadsOverEditor");
                            b = j.$.getBoundingClientRect();
                            m = b.left;
                            n = b.top;
                            q = m + j.$.clientWidth;
                            r = n + j.$.clientHeight
                        }
                    }, Y = function (a) {
                        if (m != -1) {
                            a = a.data.$;
                            if (a.clientX <= m || a.clientY <= n || a.clientX >= q || a.clientY >= r) {
                                j.removeClass("SimpleUploadsOverEditor");
                                m = -1
                            }
                        }
                    }, V = function (b) {
                        if (m != -1) {
                            if (a.readOnly) {
                                b.data.$.dataTransfer.dropEffect = "none";
                                b.data.preventDefault();
                                return false
                            }
                            b.data.$.dataTransfer.dropEffect = "copy";
                            CKEDITOR.env.gecko || b.data.preventDefault()
                        }
                    };
                    a.on("contentDom", function () {
                        i = a.document;
                        j = i.getBody().getParent();
                        if (a.elementMode == 3)j = i = a.element;
                        if (a.elementMode == 1 && "divarea"in a.plugins)j = i = a.editable();
                        l = a.editable ? a.editable() :
                            i;
                        if (CKEDITOR.env.ie && CKEDITOR.env.version >= 11 && a.config.forcePasteAsPlainText && a.editable().isInline())l.attachListener(l, "beforepaste", function () {
                            a.document.on("paste", function (a) {
                                a.removeListener();
                                p(a)
                            }, null, {editor: a})
                        }); else l.on("paste", p, null, {editor: a}, 8);
                        i.on("dragenter", J);
                        i.on("dragleave", Y);
                        if (!CKEDITOR.env.gecko)i.on("dragover", V);
                        i.on("drop", F)
                    });
                    a.on("contentDomUnload", A);
                    a.plugins.fileDropHandler = {addTarget: function (b, c) {
                        b.on("dragenter", function (a) {
                            if (m == -1 && k(a)) {
                                b.addClass("SimpleUploadsOverDialog");
                                a = b.$.getBoundingClientRect();
                                m = a.left;
                                n = a.top;
                                q = m + b.$.clientWidth;
                                r = n + b.$.clientHeight
                            }
                        });
                        b.on("dragleave", function (a) {
                            if (m != -1) {
                                a = a.data.$;
                                if (a.clientX <= m || a.clientY <= n || a.clientX >= q || a.clientY >= r) {
                                    b.removeClass("SimpleUploadsOverDialog");
                                    m = -1
                                }
                            }
                        });
                        b.on("dragover", function (a) {
                            if (m != -1) {
                                a.data.$.dataTransfer.dropEffect = "copy";
                                a.data.preventDefault()
                            }
                        });
                        b.on("drop", function (d) {
                            b.removeClass("SimpleUploadsOverDialog");
                            m = -1;
                            CKEDITOR.fire("simpleuploads.droppedFile");
                            s = -1;
                            var e = d.data.$, f = e.dataTransfer;
                            if (f && f.files && f.files.length > 0) {
                                d.data.preventDefault();
                                for (d = 0; d < 1; d++) {
                                    var g = f.files[d], g = {context: e, name: g.name, file: g, id: CKEDITOR.tools.getNextId(), forceLink: false, callback: c, mode: {type: "callback"}};
                                    CKEDITOR.plugins.simpleuploads.processFileWithCallback(a, g)
                                }
                            }
                        })
                    }}
                }
            }
        }, afterInit: function (a) {
            (a = (a = a.dataProcessor) && a.htmlFilter) && a.addRules(x, {applyToAll: true})
        }});


        CKEDITOR.plugins.simpleuploads = {getTimeStampId: function () {
            var a = 0;
            return function () {
                a++;
                return(new Date).toISOString().replace(/\..*/, "").replace(/\D/g, "_") + a
            }
        }(), isImageExtension: function (a, b) {
            return!a.config.simpleuploads_imageExtensions ? false : RegExp(".(?:" + a.config.simpleuploads_imageExtensions + ")$", "i").test(b)
        }, insertProcessedFile: function (a, b) {
            b.element = null;
            b.id = this.getTimeStampId();
            switch (b.mode.type) {
                case "selectedFile":
                    var c = this;
                    window.setTimeout(function () {
                        c.insertSelectedFile(a, b)
                    }, 50);
                    break;
                case "pastedFile":
                    this.insertPastedFile(a, b);
                    break;
                case "callback":
                    c = this;
                    window.setTimeout(function () {
                        c.processFileWithCallback(a, b)
                    }, 50);
                    break;
                case "droppedFile":
                    this.insertDroppedFile(a, b);
                    break;
                case "base64paste":
                    this.insertBase64File(a, b);
                    break;
                default:
                    alert("Error, no valid type", b.mode)
            }
        }, insertSelectedFile: function (a, b) {
            var c = b.mode, d = c.i, e = c.count;
            if (o(a, b))if (c = b.element) {
                if (e == 1) {
                    var f = a.getSelection(), e = f.getSelectedElement(), g;
                    if (e && e.getName() == "img" && c.getName() == "span")g = e.$;
                    if (c.getName() == "a") {
                        var h = e, i = f.getRanges(), f = i && i[0];
                        if (!h && i && i.length == 1) {
                            h = f.startContainer.$;
                            if (h.nodeType == document.TEXT_NODE)h = h.parentNode
                        }
                        for (; h && h.nodeType == document.ELEMENT_NODE && h.nodeName.toLowerCase() != "a";)h = h.parentNode;
                        h && (h.nodeName && h.nodeName.toLowerCase() == "a") && (g = h);
                        if (!g && f && (e || !f.collapsed)) {
                            g = new CKEDITOR.style({element: "a", attributes: {href: "#"}});
                            g.type = CKEDITOR.STYLE_INLINE;
                            g.applyToRange(f);
                            h = f.startContainer.$;
                            if (h.nodeType == document.TEXT_NODE)h = h.parentNode;
                            g = h
                        }
                    }
                    if (g) {
                        g.parentNode.replaceChild(c.$, g);
                        b.originalNode = g;
                        a.fire("saveSnapshot");
                        return
                    }
                }
                d > 0 && c.getName() == "a" && a.insertHtml("&nbsp;");
                a.insertElement(c);
                t(a, b)
            }
        }, insertPastedFile: function (a, b) {
            if (o(a, b)) {
                var c = b.element;
                if (b.mode.dialog) {
                    a.fire("updateSnapshot");
                    a.insertElement(c);
                    a.fire("updateSnapshot")
                } else {
                    var d = function () {
                        if (a.getSelection().getRanges().length)if (a.editable().$.querySelector("#cke_pastebin"))window.setTimeout(d, 0); else {
                            a.fire("updateSnapshot");
                            a.insertElement(c);
                            a.fire("updateSnapshot");
                            t(a, b)
                        } else window.setTimeout(d, 0)
                    };
                    window.setTimeout(d, 0)
                }
            }
        }, processFileWithCallback: function (a, b) {
            o(a, b)
        }, insertDroppedFile: function (a, b) {
            if (o(a, b)) {
                var c = b.element, d = b.mode.dropLocation, e = d.range, f = d.ev, g = d.count;
                e && c.getName() == "a" && (e.pasteHTML ? e.pasteHTML("&nbsp;") : e.insertNode(a.document.$.createTextNode(" ")));
                var h = f.target;
                if (!e) {
                    var i = a.document.$;
                    if (d.rangeParent) {
                        var f = d.rangeParent, j = d.rangeOffset, e = i.createRange();
                        e.setStart(f, j);
                        e.collapse(true)
                    } else if (document.caretRangeFromPoint)e = i.caretRangeFromPoint(f.clientX, f.clientY); else if (h.nodeName.toLowerCase() == "img") {
                        e = i.createRange();
                        e.selectNode(h)
                    } else if (document.body.createTextRange) {
                        j =
                            i.body.createTextRange();
                        try {
                            j.moveToPoint(f.clientX, f.clientY);
                            e = j
                        } catch (k) {
                            e = i.createRange();
                            e.setStartAfter(i.body.lastChild);
                            e.collapse(true)
                        }
                    }
                    d.range = e
                }
                i = c.getName();
                d = false;
                if (g == 1) {
                    if (h.nodeName.toLowerCase() == "img" && i == "span") {
                        h.parentNode.replaceChild(c.$, h);
                        b.originalNode = h;
                        d = true
                    }
                    if (i == "a") {
                        if (e.startContainer) {
                            g = e.startContainer;
                            g.nodeType == document.TEXT_NODE ? g = g.parentNode : e.startOffset < g.childNodes.length && (g = g.childNodes[e.startOffset])
                        } else g = e.parentElement();
                        if (!g || h.nodeName.toLowerCase() ==
                            "img")g = h;
                        for (h = g; h && h.nodeType == document.ELEMENT_NODE && h.nodeName.toLowerCase() != "a";)h = h.parentNode;
                        if (h && h.nodeName && h.nodeName.toLowerCase() == "a") {
                            h.parentNode.replaceChild(c.$, h);
                            b.originalNode = h;
                            d = true
                        }
                        if (!d && g.nodeName.toLowerCase() == "img") {
                            h = g.ownerDocument.createElement("a");
                            h.href = "#";
                            g.parentNode.replaceChild(h, g);
                            h.appendChild(g);
                            h.parentNode.replaceChild(c.$, h);
                            b.originalNode = h;
                            d = true
                        }
                    }
                }
                d || (e ? e.pasteHTML ? e.pasteHTML(c.$.outerHTML) : e.insertNode(c.$) : a.insertElement(c));
                t(a, b);
                a.fire("saveSnapshot")
            }
        },
            insertBase64File: function (a, b) {
                delete b.result;
                var c = a.document.getById(b.mode.id);
                if (o(a, b)) {
                    a.getSelection().selectElement(c);
                    a.insertElement(b.element);
                    t(a, b)
                } else {
                    c.remove();
                    b.result && a.insertHTML(b.result)
                }
            }};
        if (CKEDITOR.skins)CKEDITOR.plugins.setLang = CKEDITOR.tools.override(CKEDITOR.plugins.setLang, function (a) {
            return function (b, c, d) {
                if (b != "devtools" && typeof d[b] != "object") {
                    var e = {};
                    e[b] = d;
                    d = e
                }
                a.call(this, b, c, d)
            }
        });

        CKEDITOR.on("dialogDefinition", function (a) {
            if (a.editor.plugins.simpleuploads) {
                var b =
                    a.data.definition, c;
                for (c in b.contents) {
                    var d = b.contents[c];
                    d && r(a.editor, a.data.name, b, d.elements)
                }
                if (a.data.name == "paste")b.onShow = CKEDITOR.tools.override(b.onShow, function (a) {
                    return function () {
                        typeof a == "function" && a.call(this);
                        s(this.getContentElement("general", "editing_area").getInputElement())
                    }
                })
            }
        }, null, null, 30)
    }(),CKEDITOR.config.plugins = "basicstyles,dialogui,dialog,colordialog,clipboard,panel,floatpanel,menu,contextmenu,elementspath,enterkey,entities,popup,filebrowser,floatingspace,htmlwriter,image,justify,fakeobjects,link,maximize,preview,resize,selectall,sourcearea,button,toolbar,undo,wysiwygarea,simpleuploads",
    CKEDITOR.config.skin = "alive",function () {
        var c = function (c, d) {
            for (var b = CKEDITOR.getUrl("plugins/" + d), c = c.split(","), a = 0; a < c.length; a++)CKEDITOR.skin.icons[c[a]] = {path: b, offset: -c[++a], bgsize: c[++a]}
        };
        CKEDITOR.env.hidpi ? c("bold,0,,italic,24,,strike,48,,subscript,72,,superscript,96,,underline,120,,copy-rtl,144,,copy,168,,cut-rtl,192,,cut,216,,paste-rtl,240,,paste,264,,image,288,,justifyblock,312,,justifycenter,336,,justifyleft,360,,justifyright,384,,anchor-rtl,408,,anchor,432,,link,456,,unlink,480,,maximize,504,,preview-rtl,528,,preview,552,,selectall,576,,addfile,1200,auto,addimage,1248,auto,source-rtl,648,,source,672,,redo-rtl,696,,redo,720,,undo-rtl,744,,undo,768,",
            "icons_hidpi.png") : c("bold,0,auto,italic,24,auto,strike,48,auto,subscript,72,auto,superscript,96,auto,underline,120,auto,copy-rtl,144,auto,copy,168,auto,cut-rtl,192,auto,cut,216,auto,paste-rtl,240,auto,paste,264,auto,image,288,auto,justifyblock,312,auto,justifycenter,336,auto,justifyleft,360,auto,justifyright,384,auto,anchor-rtl,408,auto,anchor,432,auto,link,456,auto,unlink,480,auto,maximize,504,auto,preview-rtl,528,auto,preview,552,auto,selectall,576,auto,addfile,600,auto,addimage,624,auto,source-rtl,648,auto,source,672,auto,redo-rtl,696,auto,redo,720,auto,undo-rtl,744,auto,undo,768,auto",
            "icons.png")
    }(),CKEDITOR.lang.languages = {en: 1, ar: 1, cs: 1, de: 1, es: 1, fr: 1, he: 1, hu: 1, it: 1, ja: 1, ko: 1, nl: 1, pl: 1, "pt-br": 1, ru: 1, tr: 1, "zh-cn": 1}
})();
CKEDITOR.editorConfig = function (c) {
    c.toolbarGroups = [
        {name: "document", groups: ["mode", "document", "doctools"]},
        {name: "clipboard", groups: ["clipboard", "undo"]},
        {name: "basicstyles", groups: ["basicstyles", "cleanup"]},
        {name: "links"},
        {name: "insert"},
        {name: "tools"},
        {name: "others"},
        {name: "about"}
    ]
};