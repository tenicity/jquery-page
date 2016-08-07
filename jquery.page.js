/*!
**  jQuery Page -- jQuery Page Transitions for HTML5 Single-Page-Apps
**  Copyright (c) 2016 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/* global jQuery: false */
(function ($) {
    /*  internal class  */
    var Page = function (root, options) {
        this.root    = root;
        this.options = options;
        if (this.options.dataName === undefined)
            this.options.dataName = "page";
    };
    Page.prototype = {
        transit: function (pageId, transition) {
            var self = this;

            /*  sanity check arguments  */
            if (arguments.length === 0)
                throw new Error("missing page id");
            else if (arguments.length === 1 && typeof pageId !== "string")
                throw new Error("invalid page id argument (string expected)");
            else if (arguments.length === 2 && typeof transition !== "string")
                throw new Error("invalid transition type argument (string expected)");

            /*  get page container  */
            var pageCo = $(".jquery-page-container", self.root);

            /*  get from/to pages  */
            var pageFr = $(".jquery-page-container > .jquery-page-active", self.root);
            var pageTo = $(".jquery-page-container > *", self.root).filter(function (idx, el) {
                return $(el).attr("data-" + self.options.dataName) === pageId;
            });

            /*  determine page dimensions  */
            var pageWidth  = $(self.root).width();
            var pageHeight = $(self.root).height();

            /*  dispatch according to transition type  */
            var m, to;
            if (transition === "none") {
                /*  TRANSITION: none at all (just switch instantly)  */
                $(pageFr)
                    .removeClass("jquery-page-active")
                    .addClass("jquery-page-disabled");
                $(pageTo)
                    .removeClass("jquery-page-disabled")
                    .addClass("jquery-page-active");
            }
            else if ((m = transition.match(/^slide-in-from-(left|right)$/)) !== null) {
                /*  TRANSITION: slide in from left/right  */
                to = m[1];
                $(pageCo)
                    .width(pageWidth * 2)
                    .css("left", to === "left" ? -pageWidth : 0)
                    .addClass("jquery-page-horizontal");
                $(pageFr)
                    .width(pageWidth)
                    .addClass(to === "left" ? "jquery-page-right" : "jquery-page-left");
                $(pageTo)
                    .width(pageWidth)
                    .addClass(to === "left" ? "jquery-page-left" : "jquery-page-right")
                    .removeClass("jquery-page-disabled");
                $(pageCo)
                    .addClass("jquery-page-slide")
                    .css("transform", "translate(" + (to === "left" ? "" : "-") + pageWidth + "px,0)")
                    .one("transitionend", function () {
                        $(pageFr)
                            .addClass("jquery-page-disabled")
                            .removeClass(to === "left" ? "jquery-page-right" : "jquery-page-left")
                            .removeClass("jquery-page-active")
                            .css("width", "");
                        $(pageTo)
                            .removeClass(to === "left" ? "jquery-page-left" : "jquery-page-right")
                            .addClass("jquery-page-active")
                            .css("width", "");
                        $(pageCo)
                            .css("width", "")
                            .css("transform", "")
                            .css("left", "")
                            .removeClass("jquery-page-horizontal")
                            .removeClass("jquery-page-slide");
                    });
            }
            else if ((m = transition.match(/^slide-in-from-(top|bottom)$/)) !== null) {
                /*  TRANSITION: slide in from top/bottom  */
                to = m[1];
                $(pageCo)
                    .height(pageHeight * 2)
                    .css("top", to === "top" ? -pageHeight : 0)
                    .addClass("jquery-page-vertical");
                $(pageFr)
                    .addClass(to === "top" ? "jquery-page-bottom" : "jquery-page-top")
                    .height(pageHeight);
                $(pageTo)
                    .addClass(to === "top" ? "jquery-page-top" : "jquery-page-bottom")
                    .removeClass("jquery-page-disabled")
                    .height(pageHeight);
                $(pageCo)
                    .addClass("jquery-page-slide")
                    .css("transform", "translate(0," + (to === "top" ? "" : "-") + pageHeight + "px)")
                    .one("transitionend", function () {
                        $(pageFr)
                            .addClass("jquery-page-disabled")
                            .removeClass(to === "top" ? "jquery-page-bottom" : "jquery-page-top")
                            .removeClass("jquery-page-active")
                            .css("height", "");
                        $(pageTo)
                            .removeClass(to === "top" ? "jquery-page-top" : "jquery-page-bottom")
                            .addClass("jquery-page-active")
                            .css("height", "");
                        $(pageCo)
                            .css("height", "")
                            .removeClass("jquery-page-vertical")
                            .removeClass("jquery-page-slide")
                            .css("transform", "")
                            .css("top", 0);
                    });
            }
            else if ((m = transition.match(/^flip-towards-(left|right)$/)) !== null) {
                /*  TRANSITION: flop towards left/right  */
                to = m[1];
                $(pageCo)
                    .addClass("jquery-page-stacked")
                    .width(pageWidth);
                $(pageFr)
                    .addClass("jquery-page-front")
                    .width(pageWidth);
                $(pageTo)
                    .addClass("jquery-page-back")
                    .removeClass("jquery-page-disabled")
                    .width(pageWidth);
                $(pageCo)
                    .addClass("jquery-page-flip-" + to)
                    .one("transitionend", function () {
                        $(pageFr)
                            .addClass("jquery-page-disabled")
                            .removeClass("jquery-page-front")
                            .removeClass("jquery-page-active")
                            .css("width", "");
                        $(pageTo)
                            .removeClass("jquery-page-back")
                            .addClass("jquery-page-active")
                            .css("width", "");
                        $(pageCo)
                            .css("width", "")
                            .removeClass("jquery-page-stacked")
                            .removeClass("jquery-page-flip-" + to);
                    });
            }
            else
                throw new Error("invalid transition type");
        }
    };

    /*  hook into jQuery (locally)  */
    $.fn.extend({
        /*  API method  */
        page: function (options) {
            if (arguments.length === 1 && typeof options === "object") {
                /*   case 1: apply Page functionality  */
                this.each(function () {
                    var page = new Page(this, options);
                    $(this)
                        .data("jquery-page", page)
                        .addClass("jquery-page");
                    $("> *", this)
                        .addClass("jquery-page-container");
                    $("> * > *", this)
                        .addClass("jquery-page-disabled");
                    $("> * > *:first", this)
                        .removeClass("jquery-page-disabled")
                        .addClass("jquery-page-active");
                });
                return this;
            }
            else if (arguments.length === 0)
                /*  case 2: find Page API  */
                return $(this).data("jquery-page");
            else
                throw new Error("invalid arguments");
        }
    });
})(jQuery);

