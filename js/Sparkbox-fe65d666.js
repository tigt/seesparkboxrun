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
                }), "#nav" === window.location.hash && APP.showMenu(), "#contact" === window.location.hash && APP.toggleContact(), INIT.start()
            }
        }, $(function() {
            return APP.init()
        })
    }.call(this);
