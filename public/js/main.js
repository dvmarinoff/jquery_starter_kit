;(function () {
    'use strict';
    
    // globals: window, document, $win, initWinWidth, initWinHeight
    var $win = $(window);
    var $document = $(document);
    var initWinWidth = $win.width();
    var initWinHeight = $win.height();
    
    ////
    // ANIMATIONS
    ////
    $.fn.show = function (duration) {
        return $(this).velocity({opacity: 1}, {display: 'block', duration: duration});
    };
    $.fn.hide = function (duration) {
        return $(this).velocity({opacity: 0}, {display: 'none', duration: duration});
    };
    $.fn.slideLeft = function (duration, left) {
        return $(this).velocity({left: left}, {duration: duration});
    };
    $.fn.slideRight = function (duration, right) {
        return $(this).velocity({right: right}, {duration: duration});
    };
    $.fn.top = function (duration, top, async) {
        return $(this).velocity({top: top}, {duration: duration});
    };
    $.fn.rotateZ = function (duration, angle) {
        return $(this).velocity({rotateZ: angle+'deg'}, {duration: duration});
    };
    $.fn.topRotateZ = function (duration, top, angle) {
        return $(this).velocity({top: top, rotateZ: angle+'deg'}, {duration: duration});
    };
    
    ////
    // MENU MOBILE
    ////
    function MenuMobile (options) {
        var self = this;
        self.$el = $(options.root);
        self.width = options.width || initWinWidth;
        self.height = options.height || initWinHeight;
    }
    MenuMobile.prototype.init = function () {
        var self = this;  
        self.$el.css({width: self.width, left: -self.width});
        $document.on('menu:expand', self.expand.bind(self));
        $document.on('menu:collapse', self.collapse.bind(self));
    };
    MenuMobile.prototype.expand = function () {
        var self = this;
        self.$el.slideLeft(100,0);
    };
    MenuMobile.prototype.collapse = function () {
        var self = this;
        self.$el.slideLeft(100, - parseInt(self.width));
    };

    ////
    // MENU BTN
    ////
    var burgerExpand = function () {
        var self = this;
        var duration = 100;
        var middle = 11;
        var angle = 45;
        self.$top.top(duration, middle).rotateZ(duration, -angle);
        self.$middle.hide(duration);
        self.$bottom.top(duration, middle).rotateZ(duration, angle);
        return true;
    };
    var burgerCollapse = function () {
        var self = this;
        var duration = 100;
        var middle = 11;
        var angle = 45;
        self.$top.velocity({top: middle, rotateZ: '+='+angle+'deg'}, {duration: duration}).top(duration, 0);
        self.$middle.show(duration).velocity({top: middle,opacity: 1}, {duration: duration});
        self.$bottom.velocity({top: middle, rotateZ: '-='+angle+'deg'}, {duration: duration}).top(duration, 22);
        return false;
    };
    var arrowExpand = function () {
        var self = this;
        var duration = 50;
        var middle = 7;
        var angle = 45;
        self.$top.velocity({top: 1}, {duration: duration}).velocity({rotateZ: '-'+angle+'deg'}, {duration: duration});
        self.$middle.velocity({left: 30 }, {duration: duration}).velocity({opacity: 0}, {display: 'none', duration: duration});
        self.$bottom.velocity({top: 21}, {duration: duration}).velocity({rotateZ: angle+'deg'}, {duration: duration});
        return true;
    };
    var arrowCollapse = function () {
        var self = this;
        var duration = 50;
        var middle = 11;
        var angle = 45;
        self.$top.velocity({top: middle, rotateZ: '+='+angle+'deg'}, {duration: duration}).velocity({top: 0}, {duration: duration});
        self.$middle.velocity({left: 0, opacity: 1}, {display: 'block', duration: duration});//.velocity({top: middle,opacity: 1}, {duration: duration});
        self.$bottom.velocity({top: middle, rotateZ: '-='+angle+'deg'}, {duration: duration}).velocity({top: 22}, {duration: duration});
        return false;
    };
    function MenuBtn (options) {
        var self = this;
        self.$el = $(options.root);
        self.$top = self.$el.find('.top');
        self.$middle = self.$el.find('.middle');
        self.$bottom = self.$el.find('.bottom');
        self.expandAnimation = options.expandAnimation;
        self.collapseAnimation = options.collapseAnimation;
        self.isExpanded = false;
    }
    MenuBtn.prototype.init = function () {
        var self = this;
        self.$el.on('click', function () {
            console.log(self.isExpanded);
            if(self.isExpanded) {
                $document.trigger('menu:collapse');
            } else {
                $document.trigger('menu:expand');
            }
        });
        $document.on('menu:expand', self.expand.bind(self));
        $document.on('menu:collapse', self.collapse.bind(self));
    };
    MenuBtn.prototype.expand = function () {
        var self = this;
        self.isExpanded = self.expandAnimation.apply(self);
        self.$el.addClass('active');
    };
    MenuBtn.prototype.collapse = function () {
        var self = this;
        self.isExpanded = self.collapseAnimation.apply(self);
        self.$el.removeClass('active');
    };

    ////
    // DROP NAV
    ////
    var sum = function (array) {
        return array.reduce(function(x, y) { return x + y; });
    };
    var widths = function ($elements) {
        $elements.each(function () {
            var widths = $(this).children('li').map(function () {
                var current = $(this).width();
                return current;
            }).get();
            var totalWidth = sum(widths) + 1;
            $(this).width(totalWidth);
            return totalWidth;
        });
    };
    function DropNav (options) {
        var self = this;
        self.$el = $(options.root);
        self.outer = options.outer || 'ul > li';
        self.inner = options.inner || 'ul ul';
        self.drop = options.drop || '.drop-ul';
        self.$outerLevel = self.$el.find(self.outer);
        self.$innerLevels = self.$el.find(self.inner);
        self.$expandBtns = self.$el.find('.expand-btn');
        self.$expandable = self.$el.find('li').has('ul');
    }
    DropNav.prototype.init = function (config) {
        var self = this;
        var start = config || {hover: ($win.width() > 950), click: ($win.width() < 950)};
        if(start.hover) {
            self.initHover();
        }
        if(start.click) {
            self.initClick();
        }
    };
    DropNav.prototype.initClick = function () {
        var self = this;
        self.$expandBtns.on('click', function (e) {
            e.stopPropagation();
            var $expandBtn = $(this);
            var $nextLevel = $expandBtn.siblings('ul').first();
            $nextLevel.toggleClass('active');
            $expandBtn.toggleClass('active');
            if($expandBtn.hasClass('active')) {
                $expandBtn.html('-');
                $document.trigger('menu:expand:level');
            } else {
                $expandBtn.html('+');
                $document.trigger('menu:collapse:level');
            }
        });
        console.log('click events');
    };
    DropNav.prototype.initHover = function () {
        var self = this;
        console.log(self.$innerLevels);
        self.$expandable.on('mouseenter', function (e) {
            var $nextLevel = $(this).children('ul');
            self.expandLevel($nextLevel);
            widths(self.$innerLevels);
        });
        self.$expandable.on('mouseleave', function () {
            var $nextLevel = $(this).children('ul');
            self.collapseLevel($nextLevel);
        });
        console.log('hover events');
    };
    DropNav.prototype.expandLevel = function ($level) {
        var self = this;
        $level.addClass('active');
    };
    DropNav.prototype.collapseLevel = function ($level) {
        var self = this;
        $level.removeClass('active');
    };

    ////
    // LOADER
    ////
    function Loader (options) {
        var self = this;
        self.$el = $(options.root);
    }
    Loader.prototype.init = function () {
        var self = this;
    };
    Loader.prototype.show = function () {
        var self = this;  
    };
    Loader.prototype.hide = function () {
        var self = this;
        self.$el.velocity({opacity: 0}, {display: "none", duration: 400});
    };

    ////
    // SNIPPET
    ////
    function Snippet (options) {
        var self = this;
        self.$el = $(options.root);
    }
    Snippet.prototype.init = function () {
        var self = this;
    };
    Snippet.prototype.expand = function () {
        var self = this;  
    };
    Snippet.prototype.collapse = function () {
        var self = this;
    };

    ////
    // UTIL FUNCTIONS
    ////
    // map function for js objects
    // map :: (Function, Object) -> Object
    var map = function (f, object) {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                f(object[key], key, object);
            }
        }
        return object;
    };
    // curried map function for js objects
    // mapCurried :: Function -> (Object -> Object)
    var mapCurried = function (f, object) {
        return function (object) {
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    f(object[key], key, object);
                }
            }
            return object;
        };
    };
    var isMobile = function (queryWidth) {
        return $win.width() > queryWidth;
    };
    
    ////
    // OPTIONS
    ////
    var options = {
        slider:{
            front: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: false,
                arrows: true
            }
        },
        menu: {
            mobileBasic: { root:'nav.header.basic', width: 320 },
            mobileDrop: { root:'.mobile-nav-cont', width: 320 },
            btnBurger: { 
                root:'.menu-mobile-btn.burger', 
                expandAnimation: burgerExpand,
                collapseAnimation: burgerCollapse 
            },
            menuBtnArrow: {
                root:'.menu-mobile-btn.arrow', 
                expandAnimation: arrowExpand,
                collapseAnimation: arrowCollapse 
            }
        },
        dropNav: {root: 'nav.header.drop', hover: ($win.width() > 950), click: ($win.width() < 950)},
        loader: {root: '#loader-main-bg'},
        minWidthMobile: 951
    };
        
    var ui = {
        menu: {
            mobileBasic: new MenuMobile(options.menu.mobileBasic),
            mobileDrop: new MenuMobile(options.menuMobileDrop),
            btnBurger: new MenuBtn(options.menu.btnBurger),
            btnArrow: new MenuBtn(options.menu.btnArrow)
        },
        dropNav: new DropNav(options.dropNav),
        loader: new Loader(options.loader),
        slider: $('#slider-front')
    };

    ui.loader.init();
    
    var app = function (ui) {
        ui.dropNav.init();
        ui.slider.front.slick(options.slider.front);

        if($win.width() < options.minWidthMobile) {
            ui.menu.mobileBasic.init();
            ui.menu.btnBurger.init();

            ui.menu.mobileDrop.init();
            ui.menu.btnArrow.init();
        }
    };
    
    $document.ready(function() {
        app(ui);
    });
    $win.load(function () {
        console.log('window');
        ui.loader.hide();
    });

}());
