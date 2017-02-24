// globals: window, document, $win, initWinWidth, initWinHeight
var $win = $(window);
var $document = $(document);
var initWinWidth = $win.width();
var initWinHeight = $win.height();

var util = (function () {
    'use strict';

    /*DIMENTION HELPERS*/
    $.fn.eqHeight = function(param) {
        var self = $(this);
        var targetHeight = param.height();

        this.each(function() {
            self.height(targetHeight);
        });
    };

    $.fn.fit = function(param) {
        var self = $(this);
        var targetHeight = param.height();
        var targetWidth = param.width();

        this.each(function() {
            self.height(targetHeight);
            self.width(targetWidth);
        });
    };

    $.fn.ratioHeight = function(ratio) {
        var self = $(this);
        var ratioH = self.width() * ratio;

        this.each(function() {
            self.height(ratioH);
        });
    };
} ());

;(function () {
    var state = {};
    var ui = {};
    var expand = function () {
        var self = this;
    };
    var collapse = function () {
        var self = this;
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
        self.$el.stop().velocity({left: 0}, {duration: 100});
    };
    MenuMobile.prototype.collapse = function () {
        var self = this;
        self.$el.stop().velocity({left: - parseInt(self.mobileWidth)}, {duration: 100});
    };

    ////
    // MENU BTN
    ////
    var burgerExpand = function () {
        var self = this;
        var duration = 50;
        var top = 11;
        self.$top.velocity({top: top}, {duration: duration}).velocity({rotateZ: '-'+self.angle+'deg'}, {duration: duration});
        self.$bottom.velocity({top: top}, {duration: duration}).velocity({rotateZ: self.angle+'deg'}, {duration: duration});
        return true;
    };
    var burgerCollapse = function () {
        var self = this;
        var duration = 50;
        var middle = 11;
        self.$top.velocity({top: middle, rotateZ: '+='+self.angle+'deg'}, {duration: duration}).velocity({top: 0}, {duration: duration});
        self.$middle.velocity({opacity: 0}, {duration: duration}).velocity({top: middle,opacity: 1}, {duration: duration});
        self.$bottom.velocity({top: middle, rotateZ: '-='+self.angle+'deg'}, {duration: duration}).velocity({top: 14}, {duration: duration});
        return false;
    };
    var arrowExpand = function () {
        var self = this;
        var duration = 50;
        var top = 7;
        self.$top.velocity({top: top}, {duration: duration}).velocity({rotateZ: '-'+self.angle+'deg'}, {duration: duration});
        self.$middle.velocity({opacity: 0}, {duration: duration}).velocity({top: middle,opacity: 1}, {duration: duration});
        self.$bottom.velocity({top: top}, {duration: duration}).velocity({rotateZ: self.angle+'deg'}, {duration: duration});
        return true;
    };
    var arrowCollapse = function () {
        var self = this;
        var duration = 50;
        var middle = 11;
        self.burgerTop.velocity({top: middle, rotateZ: '+='+self.angle+'deg'}, {duration: duration}).velocity({top: 0}, {duration: duration});
        self.burgerMiddle.velocity({opacity: 0}, {duration: duration}).velocity({top: middle,opacity: 1}, {duration: duration});
        self.burgerBottom.velocity({top: middle, rotateZ: '-='+self.angle+'deg'}, {duration: duration}).velocity({top: 14}, {duration: duration});
        return false;
    };
    function MenuBtn (options) {
        var self = this;
        self.$el = $(options.root);
        self.$top = self.$el.find('.top');
        self.$middle = self.$el.find('.middle');
        self.$bottom = self.$el.find('.bottom');
        self.isExpanded = false;
    }
    MenuBtn.prototype.init = function () {
        var self = this;
        self.$el.on('click', function () {
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
        self.isExpanded = expandBtn.apply(self);
        self.$el.addClass('active');
    };
    MenuBtn.prototype.collapse = function () {
        var self = this;
        self.isExpanded = collapseBtn.apply(self);
        self.$el.removeClass('active');
    };

    ////
    // MENU DROP
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
    function MenuDrop (options) {
        var self = this;
        self.$el = $(options.root);
        self.outer = options.outer || 'ul > li';
        self.inner = options.inner || 'ul ul';
        self.drop = options.drop || '.drop-ul';
        self.outerLevel = self.$el.find(self.outer);
        self.innerLevels = self.$el.find(self.inner);
        self.expandBtns = self.$el.find('.expand');
        self.expandable = self.$el.find('li').has('ul');
    }
    MenuDrop.prototype.init = function (config) {
        var self = this;
        var start = config || {hover: ($win.width() > 950), click: ($win.width() < 950)};
        if(start.hover) {
            self.initHover();
        }
        if(start.click) {
            self.initClick();
        }
    };
    MenuDrop.prototype.initClick = function () {
        var self = this;
        self.expandLevelBtns.on('click', function (e) {
            e.stopPropagation();
            var $expandLevelBtn = $(this);
            var $nextLevel = $expandBtn.siblings('li ul').first();
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
    MenuDrop.prototype.initHover = function () {
        var self = this;
        console.log(self.innerLevels);
        widths(self.innerLevels);
        self.expandable.on('mouseenter', function (e) {
            console.log($(this));
            var $nextLevel = $(this).children('ul');//.first();
            console.log($nextLevel);
            self.expandLevel($nextLevel);
            if($nextLevel.width() < 2) {
                widths($nextLevel);
            }
        });
        self.expandable.on('mouseleave', function () {
            var $nextLevel = $(this).children('ul');
            self.collapseLevel($nextLevel);
        });
        console.log('hover events');
    };
    MenuDrop.prototype.expandLevel = function ($level) {
        var self = this;
        $level.addClass('active');
    };
    MenuDrop.prototype.collapseLevel = function ($level) {
        var self = this;
        $level.removeClass('active');
    };

    // snippet
    function Snippet (selector) {
        var self = this;
        this.el = selector;
    }
    Snippet.prototype.expand = function () {
        var self = this;  
    };
    Snippet.prototype.collapse = function () {
        var self = this;
    };

    setTimeout(function () {

    }, 1000);

    $(window).load(function () {
        console.log('window');

    });

    $(document).ready(function() {
        console.log('document');
        var $front = $('.front');
        var $sliderFront = $('#slider-front');

        var options = {
            sliderFront: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: false,
                arrows: true
            },
            menuDrop: {root: 'nav.header.drop'},
            menuMobile: {root:'.menu.mobile', width: 320},
            menuBtn: {root:'.menu-btn.burger'}
        };
        
        var menuDrop = new MenuDrop(options.menuDrop);
        menuDrop.init({hover: ($win.width() > 950), click: ($win.width() < 950)});
        var menuMobile = new MenuMobile('.menu.main');
        var menuBtn = new MenuBtn('.menu-mobile-btn.burger');

        var init = function () {
            menuBtn.init();
            $sliderFront.slick(options.sliderFront);
            
            if($win.width() < 951) {
                menuMobile.init();
            }
            if($win.width() > 950) {
            }
        };
        init();
    });

}());