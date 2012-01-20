/*matisse.ui*/
define(["matisse", "matisse.comm"], function (matisse, comm) {
	"use strict";
	var ui = {
		/** width and height of panels for resize */
		bodyWidth: '',
		bodyHeight: '',
		initialBodyWidth: $(window).width() > 960 ? $(window).width() : 960,
		initialBodyHeight: $(window).height() > 800 ? $(window).height() : 800,
		topPanelHeight: '',
		leftPanelWidth: '',
		leftPanelHeight: '',
		accordionContentHeight: '',
		canvasWidth: '',
		canvasHeight: '',
		/**
		 * function to initialize width and heights
		 * @method initWidthAndHeightOfPanels
		 * @param none
		 */
		initWidthAndHeightOfPanels: function () {
			this.bodyWidth = $(window).width() - 2;
			this.bodyHeight = $(window).height();
			this.topPanelHeight = 100;
			this.leftPanelWidth = 100;
			this.leftPanelHeight = this.bodyHeight - this.topPanelHeight;
			this.canvasWidth = this.bodyWidth - this.leftPanelWidth;
			this.canvasHeight = this.bodyHeight - this.topPanelHeight - 23;
		},
		/**
		 * method to resize panels on resize of browser window
		 * @method resizeWindow
		 * @param none
		 */
		resizeWindow: function () {
			this.resizeBody();
			this.resizeHeader();
			this.resizeMainPanel();
			this.resizeLeftPanel();
			this.setAccordinContentHeight();
			this.resizeCanvas();
		},
		/**
		 * method to resize the document body
		 * @method resizeBody
		 * @param none
		 */
		resizeBody: function () {
			$('#_body').width(this.bodyWidth + 2);
			$('#_body').height(this.bodyHeight);
		},

		/**
		 * method to set header width and height
		 * @method resizeHeader
		 * @param none
		 */
	    resizeHeader: function () {
			$('#header').width(this.bodyWidth);
			$('#header').height(this.topPanelHeight);
		},
		/**
		 * Set Outer panel width and height
		 * @method resizeMainPanel
		 * @param none
		 */
		resizeMainPanel: function () {
			$('#outer').height(this.leftPanelHeight);
			$('#outer').width(this.bodyWidth);
		},
		/**
		 * Set left panel width and height
		 * @method resizeLeftPanel
		 * @param none
		 */
		resizeLeftPanel: function () {
			$('#leftdiv').width(this.leftPanelWidth);
			$('#leftdiv').height(this.leftPanelHeight);
		},
		/**
		 * Set Canvas width and height
		 * @method resizeCanvas
		 * @param none
		 */
	    resizeCanvas: function () {
			$('#canvasId').height(this.canvasHeight);
			$('#canvasId').width(this.canvasWidth);
		},
		/**
		 * Set Accordian width and height
		 * @method setAccordinContentHeight
		 * @param none
		 */
	    setAccordinContentHeight: function () {
			var $accordionHeaders = $('.ui-accordion-header');
			var accordionHeaderHeight = 0;
			$accordionHeaders.each(function(i, s) {
				accordionHeaderHeight = accordionHeaderHeight + $(s).outerHeight(true);
			});
			var accordionContentHeight = (this.leftPanelHeight - (accordionHeaderHeight + 25));
			$('.ui-accordion-content').height(accordionContentHeight);
		},
		/**
		 * Bind resizing of window to panels
		 * @method bindResizeWindow
		 * @param none
		 */
		bindResizeWindow: function () {
			var thisObj = this;
			$(window).resize(function () {
				thisObj.initWidthAndHeightOfPanels();
			    thisObj.resizeWindow();
			    thisObj.setCanvasSize();
			});
		},
		/**
		 *  Reset Current seltected tool Icon when object is drawn on canvas
		 *  @method  resetIconSelection
		 *  @param none
		 */
		resetIconSelection: function () {
			if (matisse.$currActiveIcon) {
				matisse.$currActiveIcon.attr("src", matisse.$currActiveIcon.attr('data-inactive'));
				matisse.$currActiveIcon.parent().parent().removeClass('shape-active');
			}
		},
		/**
		 * Sets the Canvas width and height based on browser window size
		 * @method setCanvasSize
		 * @param none
		 *
		 */
		setCanvasSize: function () {
			var width = (this.bodyWidth > this.initialBodyWidth) ? (this.bodyWidth - 100) : ((this.initialBodyWidth > 1060) ? (this.initialBodyWidth - 100) : 960);
			var height = (this.bodyHeight > this.initialBodyHeight) ? (this.bodyHeight - 100) : ((this.initialBodyHeight > 900) ? (this.initialBodyHeight - 100) : 800);
			canvas.setDimensions({width: width, height: height});
		},
		/**
		 * Update accordion
		 * @method updateAccordian
		 * @param palette_DisplayName
		 */
		updateAccordian: function (palette_DisplayName) {
			$("#accordion").append('<h3><a href="#">' + palette_DisplayName + '</a></h3><div height="100%" id="' + palette_DisplayName + '"></div>');
		},
		/**
		* Carousal implementation 
		*
		*
		*/
		corousal: function () {
			$(".scroller-up").live("click", function () {
				var scrollerContentHolderHeight = $(this).siblings().find(".scrollerContentHolder").css('height');
				var scrollerContentHolderTop = $(this).siblings().find(".scrollerContentHolder").css('top');
				var parentHeight = $(this).parent().css('height');
				var shapeHeight = $(".scrollerContentHolder:visible>.shape-holder").height();
				scrollerContentHolderHeight = scrollerContentHolderHeight.substr(0, scrollerContentHolderHeight.indexOf('px'));
				parentHeight = parentHeight.substr(0, parentHeight.indexOf('px'));
				scrollerContentHolderTop = scrollerContentHolderTop.substr(0, scrollerContentHolderTop.indexOf('px'));
				if (scrollerContentHolderHeight > parentHeight) {
					if (scrollerContentHolderTop < -30) {
						$("#wireframe .scroller-down").css("background-color", "#8F98A6");
						var newTop = (scrollerContentHolderTop - (-shapeHeight));
						$(this).siblings().find(".scrollerContentHolder").stop().animate({
							"top": newTop
						}, "slow");
					} else {
						$("#wireframe .scroller-up").css("background-color", "#aaa");
					}
				}
			});
			$(".scroller-down").live("click", function () {
				console.log("in scroller-down click");
				var scrollerContentHolderHeight = $(this).siblings().find(".scrollerContentHolder").css('height');
				var scrollerContentHolderTop = $(this).siblings().find(".scrollerContentHolder").css('top');
				var parentHeight = $(this).parent().css('height');
				var shapeHeight = $(".scrollerContentHolder:visible>.shape-holder").height();
				scrollerContentHolderHeight = scrollerContentHolderHeight.substr(0, scrollerContentHolderHeight.indexOf('px'));
				parentHeight = parentHeight.substr(0, parentHeight.indexOf('px'));
				scrollerContentHolderTop = scrollerContentHolderTop.substr(0, scrollerContentHolderTop.indexOf('px'));
				var carouselArrowheight = 18;
				var accordianHeight = $(".ui-accordion-content").height() - (carouselArrowheight * 2);
				var sumOfShapesHeight = $(".scrollerContentHolder:visible").height();
				if (scrollerContentHolderHeight > parentHeight) {
					if (-(scrollerContentHolderTop) < (sumOfShapesHeight - accordianHeight - 30)) {
						$("#wireframe .scroller-up").css("background-color", "#8F98A6");
						var newTop = (scrollerContentHolderTop - shapeHeight);
						$(this).siblings().find(".scrollerContentHolder").stop().animate({
							"top": newTop
						}, "slow");
					} else {
						$("#wireframe .scroller-down").css("background-color", "#aaa");
					}
				}
			});
			function scrollUp(e) {
				$(this).siblings(".scrollerContentHolder").css("top", "yellow");
			}
		}
	};
	ui.corousal();
	return ui;
});