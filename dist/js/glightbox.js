/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/core/drag.js":
/*!*****************************!*\
  !*** ./src/js/core/drag.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DragSlides)
/* harmony export */ });
/* harmony import */ var _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/helpers.js */ "./src/js/utils/helpers.js");

class DragSlides {
  constructor(config = {}) {
    let { dragEl, toleranceX = 40, toleranceY = 65, slide = null, instance = null } = config;
    this.el = dragEl;
    this.active = false;
    this.dragging = false;
    this.currentX = null;
    this.currentY = null;
    this.initialX = null;
    this.initialY = null;
    this.xOffset = 0;
    this.yOffset = 0;
    this.direction = null;
    this.lastDirection = null;
    this.toleranceX = toleranceX;
    this.toleranceY = toleranceY;
    this.toleranceReached = false;
    this.dragContainer = this.el;
    this.slide = slide;
    this.instance = instance;
    this.el.addEventListener("mousedown", (e) => this.dragStart(e), false);
    this.el.addEventListener("mouseup", (e) => this.dragEnd(e), false);
    this.el.addEventListener("mousemove", (e) => this.drag(e), false);
  }
  dragStart(e) {
    if (this.slide.classList.contains("zoomed")) {
      this.active = false;
      return;
    }
    if (e.type === "touchstart") {
      this.initialX = e.touches[0].clientX - this.xOffset;
      this.initialY = e.touches[0].clientY - this.yOffset;
    } else {
      this.initialX = e.clientX - this.xOffset;
      this.initialY = e.clientY - this.yOffset;
    }
    let clicked = e.target.nodeName.toLowerCase();
    let exludeClicks = ["input", "select", "textarea", "button", "a"];
    if (e.target.classList.contains("nodrag") || (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.closest)(e.target, ".nodrag") || exludeClicks.indexOf(clicked) !== -1) {
      this.active = false;
      return;
    }
    e.preventDefault();
    if (e.target === this.el || clicked !== "img" && (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.closest)(e.target, ".gslide-inline")) {
      this.active = true;
      this.el.classList.add("dragging");
      this.dragContainer = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.closest)(e.target, ".ginner-container");
    }
  }
  dragEnd(e) {
    e && e.preventDefault();
    this.initialX = 0;
    this.initialY = 0;
    this.currentX = null;
    this.currentY = null;
    this.initialX = null;
    this.initialY = null;
    this.xOffset = 0;
    this.yOffset = 0;
    this.active = false;
    if (this.doSlideChange) {
      this.instance.preventOutsideClick = true;
      this.doSlideChange == "right" && this.instance.prevSlide();
      this.doSlideChange == "left" && this.instance.nextSlide();
    }
    if (this.doSlideClose) {
      this.instance.close();
    }
    if (!this.toleranceReached) {
      this.setTranslate(this.dragContainer, 0, 0, true);
    }
    setTimeout(() => {
      this.instance.preventOutsideClick = false;
      this.toleranceReached = false;
      this.lastDirection = null;
      this.dragging = false;
      this.el.isDragging = false;
      this.el.classList.remove("dragging");
      this.slide.classList.remove("dragging-nav");
      this.dragContainer.style.transform = "";
      this.dragContainer.style.transition = "";
    }, 100);
  }
  drag(e) {
    if (this.active) {
      e.preventDefault();
      this.slide.classList.add("dragging-nav");
      if (e.type === "touchmove") {
        this.currentX = e.touches[0].clientX - this.initialX;
        this.currentY = e.touches[0].clientY - this.initialY;
      } else {
        this.currentX = e.clientX - this.initialX;
        this.currentY = e.clientY - this.initialY;
      }
      this.xOffset = this.currentX;
      this.yOffset = this.currentY;
      this.el.isDragging = true;
      this.dragging = true;
      this.doSlideChange = false;
      this.doSlideClose = false;
      let currentXInt = Math.abs(this.currentX);
      let currentYInt = Math.abs(this.currentY);
      if (currentXInt > 0 && currentXInt >= Math.abs(this.currentY) && (!this.lastDirection || this.lastDirection == "x")) {
        this.yOffset = 0;
        this.lastDirection = "x";
        this.setTranslate(this.dragContainer, this.currentX, 0);
        let doChange = this.shouldChange();
        if (!this.instance.settings.dragAutoSnap && doChange) {
          this.doSlideChange = doChange;
        }
        if (this.instance.settings.dragAutoSnap && doChange) {
          this.instance.preventOutsideClick = true;
          this.toleranceReached = true;
          this.active = false;
          this.instance.preventOutsideClick = true;
          this.dragEnd(null);
          doChange == "right" && this.instance.prevSlide();
          doChange == "left" && this.instance.nextSlide();
          return;
        }
      }
      if (this.toleranceY > 0 && currentYInt > 0 && currentYInt >= currentXInt && (!this.lastDirection || this.lastDirection == "y")) {
        this.xOffset = 0;
        this.lastDirection = "y";
        this.setTranslate(this.dragContainer, 0, this.currentY);
        let doClose = this.shouldClose();
        if (!this.instance.settings.dragAutoSnap && doClose) {
          this.doSlideClose = true;
        }
        if (this.instance.settings.dragAutoSnap && doClose) {
          this.instance.close();
        }
        return;
      }
    }
  }
  shouldChange() {
    let doChange = false;
    let currentXInt = Math.abs(this.currentX);
    if (currentXInt >= this.toleranceX) {
      let dragDir = this.currentX > 0 ? "right" : "left";
      if (dragDir == "left" && this.slide !== this.slide.parentNode.lastChild || dragDir == "right" && this.slide !== this.slide.parentNode.firstChild) {
        doChange = dragDir;
      }
    }
    return doChange;
  }
  shouldClose() {
    let doClose = false;
    let currentYInt = Math.abs(this.currentY);
    if (currentYInt >= this.toleranceY) {
      doClose = true;
    }
    return doClose;
  }
  setTranslate(node, xPos, yPos, animated = false) {
    if (animated) {
      node.style.transition = "all .2s ease";
    } else {
      node.style.transition = "";
    }
    node.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
  }
}


/***/ }),

/***/ "./src/js/core/keyboard-navigation.js":
/*!********************************************!*\
  !*** ./src/js/core/keyboard-navigation.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ keyboardNavigation)
/* harmony export */ });
/* harmony import */ var _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/helpers.js */ "./src/js/utils/helpers.js");

function getNextFocusElement(current = -1) {
  const btns = document.querySelectorAll(".gbtn[data-taborder]:not(.disabled)");
  if (!btns.length) {
    return false;
  }
  if (btns.length == 1) {
    return btns[0];
  }
  if (typeof current == "string") {
    current = parseInt(current);
  }
  let newIndex = current < 0 ? 1 : current + 1;
  if (newIndex > btns.length) {
    newIndex = "1";
  }
  const orders = [];
  (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.each)(btns, (btn) => {
    orders.push(btn.getAttribute("data-taborder"));
  });
  const nextOrders = orders.filter((el) => el >= parseInt(newIndex));
  const nextFocus = nextOrders.sort()[0];
  return document.querySelector(`.gbtn[data-taborder="${nextFocus}"]`);
}
function keyboardNavigation(instance) {
  if (instance.events.hasOwnProperty("keyboard")) {
    return false;
  }
  instance.events["keyboard"] = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addEvent)("keydown", {
    onElement: window,
    withCallback: (event, target) => {
      event = event || window.event;
      const key = event.keyCode;
      if (key == 9) {
        const focusedButton = document.querySelector(".gbtn.focused");
        if (!focusedButton) {
          const activeElement = document.activeElement && document.activeElement.nodeName ? document.activeElement.nodeName.toLocaleLowerCase() : false;
          if (activeElement == "input" || activeElement == "textarea" || activeElement == "button") {
            return;
          }
        }
        event.preventDefault();
        const btns = document.querySelectorAll(".gbtn[data-taborder]");
        if (!btns || btns.length <= 0) {
          return;
        }
        if (!focusedButton) {
          const first = getNextFocusElement();
          if (first) {
            first.focus();
            (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass)(first, "focused");
          }
          return;
        }
        let currentFocusOrder = focusedButton.getAttribute("data-taborder");
        let nextFocus = getNextFocusElement(currentFocusOrder);
        (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.removeClass)(focusedButton, "focused");
        if (nextFocus) {
          nextFocus.focus();
          (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass)(nextFocus, "focused");
        }
      }
      if (key == 39) {
        instance.nextSlide();
      }
      if (key == 37) {
        instance.prevSlide();
      }
      if (key == 27) {
        instance.close();
      }
    }
  });
}


/***/ }),

/***/ "./src/js/core/slide-parser.js":
/*!*************************************!*\
  !*** ./src/js/core/slide-parser.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SlideConfigParser)
/* harmony export */ });
/* harmony import */ var _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/helpers.js */ "./src/js/utils/helpers.js");

class SlideConfigParser {
  constructor(slideParamas = {}) {
    this.defaults = {
      href: "",
      sizes: "",
      srcset: "",
      title: "",
      type: "",
      description: "",
      alt: "",
      descPosition: "bottom",
      effect: "",
      width: "",
      height: "",
      content: false,
      zoomable: true,
      draggable: true
    };
    if ((0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isObject)(slideParamas)) {
      this.defaults = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.extend)(this.defaults, slideParamas);
    }
  }
  sourceType(url) {
    let origin = url;
    url = url.toLowerCase();
    if (url.match(/\.(jpeg|jpg|jpe|gif|png|apn|webp|avif|svg)/) !== null) {
      return "image";
    }
    if (url.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) || url.match(/(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/)) {
      return "video";
    }
    if (url.match(/vimeo\.com\/([0-9]*)/)) {
      return "video";
    }
    if (url.match(/\.(mp4|ogg|webm|mov)/) !== null) {
      return "video";
    }
    if (url.match(/\.(mp3|wav|wma|aac|ogg)/) !== null) {
      return "audio";
    }
    if (url.indexOf("#") > -1) {
      let hash = origin.split("#").pop();
      if (hash.trim() !== "") {
        return "inline";
      }
    }
    if (url.indexOf("goajax=true") > -1) {
      return "ajax";
    }
    return "external";
  }
  parseConfig(element, settings) {
    let data = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.extend)({ descPosition: settings.descPosition }, this.defaults);
    if ((0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isObject)(element) && !(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNode)(element)) {
      if (!(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.has)(element, "type")) {
        if ((0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.has)(element, "content") && element.content) {
          element.type = "inline";
        } else if ((0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.has)(element, "href")) {
          element.type = this.sourceType(element.href);
        }
      }
      let objectData = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.extend)(data, element);
      this.setSize(objectData, settings);
      return objectData;
    }
    let url = "";
    let config = element.getAttribute("data-glightbox");
    let nodeType = element.nodeName.toLowerCase();
    if (nodeType === "a") {
      url = element.href;
    }
    if (nodeType === "img") {
      url = element.src;
      data.alt = element.alt;
    }
    data.href = url;
    (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.each)(data, (val, key) => {
      if ((0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.has)(settings, key) && key !== "width") {
        data[key] = settings[key];
      }
      const nodeData = element.dataset[key];
      if (!(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNil)(nodeData)) {
        data[key] = this.sanitizeValue(nodeData);
      }
    });
    if (data.content) {
      data.type = "inline";
    }
    if (!data.type && url) {
      data.type = this.sourceType(url);
    }
    if (!(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNil)(config)) {
      let cleanKeys = [];
      (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.each)(data, (v, k) => {
        cleanKeys.push(";\\s?" + k);
      });
      cleanKeys = cleanKeys.join("\\s?:|");
      if (config.trim() !== "") {
        (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.each)(data, (val, key) => {
          const str = config;
          const match = "s?" + key + "s?:s?(.*?)(" + cleanKeys + "s?:|$)";
          const regex = new RegExp(match);
          const matches = str.match(regex);
          if (matches && matches.length && matches[1]) {
            const value = matches[1].trim().replace(/;\s*$/, "");
            data[key] = this.sanitizeValue(value);
          }
        });
      }
    } else {
      if (!data.title && nodeType == "a") {
        let title = element.title;
        if (!(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNil)(title) && title !== "") {
          data.title = title;
        }
      }
      if (!data.title && nodeType == "img") {
        let alt = element.alt;
        if (!(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNil)(alt) && alt !== "") {
          data.title = alt;
        }
      }
    }
    if (data.description && data.description.substring(0, 1) === ".") {
      let description;
      try {
        description = document.querySelector(data.description).innerHTML;
      } catch (error) {
        if (!(error instanceof DOMException)) {
          throw error;
        }
      }
      if (description) {
        data.description = description;
      }
    }
    if (!data.description) {
      let nodeDesc = element.querySelector(".glightbox-desc");
      if (nodeDesc) {
        data.description = nodeDesc.innerHTML;
      }
    }
    this.setSize(data, settings, element);
    this.slideConfig = data;
    return data;
  }
  setSize(data, settings, element = null) {
    const defaultWith = data.type == "video" ? this.checkSize(settings.videosWidth) : this.checkSize(settings.width);
    const defaultHeight = this.checkSize(settings.height);
    data.width = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.has)(data, "width") && data.width !== "" ? this.checkSize(data.width) : defaultWith;
    data.height = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.has)(data, "height") && data.height !== "" ? this.checkSize(data.height) : defaultHeight;
    if (element && data.type == "image") {
      data._hasCustomWidth = element.dataset.width ? true : false;
      data._hasCustomHeight = element.dataset.height ? true : false;
    }
    return data;
  }
  checkSize(size) {
    return (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNumber)(size) ? `${size}px` : size;
  }
  sanitizeValue(val) {
    if (val !== "true" && val !== "false") {
      return val;
    }
    return val === "true";
  }
}


/***/ }),

/***/ "./src/js/core/slide.js":
/*!******************************!*\
  !*** ./src/js/core/slide.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Slide)
/* harmony export */ });
/* harmony import */ var _zoom_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./zoom.js */ "./src/js/core/zoom.js");
/* harmony import */ var _drag_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./drag.js */ "./src/js/core/drag.js");
/* harmony import */ var _slides_image_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../slides/image.js */ "./src/js/slides/image.js");
/* harmony import */ var _slides_video_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../slides/video.js */ "./src/js/slides/video.js");
/* harmony import */ var _slides_inline_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../slides/inline.js */ "./src/js/slides/inline.js");
/* harmony import */ var _slides_iframe_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../slides/iframe.js */ "./src/js/slides/iframe.js");
/* harmony import */ var _slide_parser_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./slide-parser.js */ "./src/js/core/slide-parser.js");
/* harmony import */ var _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/helpers.js */ "./src/js/utils/helpers.js");








class Slide {
  constructor(el, instance, index) {
    this.element = el;
    this.instance = instance;
    this.index = index;
  }
  setContent(slide = null, callback = false) {
    if ((0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.hasClass)(slide, "loaded")) {
      return false;
    }
    const settings = this.instance.settings;
    const slideConfig = this.slideConfig;
    const isMobileDevice = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isMobile)();
    if ((0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(settings.beforeSlideLoad)) {
      settings.beforeSlideLoad({
        index: this.index,
        slide,
        player: false
      });
    }
    let type = slideConfig.type;
    let position = slideConfig.descPosition;
    let slideMedia = slide.querySelector(".gslide-media");
    let slideTitle = slide.querySelector(".gslide-title");
    let slideText = slide.querySelector(".gslide-desc");
    let slideDesc = slide.querySelector(".gdesc-inner");
    let finalCallback = callback;
    let titleID = "gSlideTitle_" + this.index;
    let textID = "gSlideDesc_" + this.index;
    if ((0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(settings.afterSlideLoad)) {
      finalCallback = () => {
        if ((0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(callback)) {
          callback();
        }
        settings.afterSlideLoad({
          index: this.index,
          slide,
          player: this.instance.getSlidePlayerInstance(this.index)
        });
      };
    }
    if (slideConfig.title == "" && slideConfig.description == "") {
      if (slideDesc) {
        slideDesc.parentNode.parentNode.removeChild(slideDesc.parentNode);
      }
    } else {
      if (slideTitle && slideConfig.title !== "") {
        slideTitle.id = titleID;
        slideTitle.innerHTML = slideConfig.title;
      } else {
        slideTitle.parentNode.removeChild(slideTitle);
      }
      if (slideText && slideConfig.description !== "") {
        slideText.id = textID;
        if (isMobileDevice && settings.moreLength > 0) {
          slideConfig.smallDescription = this.slideShortDesc(slideConfig.description, settings.moreLength, settings.moreText);
          slideText.innerHTML = slideConfig.smallDescription;
          this.descriptionEvents(slideText, slideConfig);
        } else {
          slideText.innerHTML = slideConfig.description;
        }
      } else {
        slideText.parentNode.removeChild(slideText);
      }
      (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass)(slideMedia.parentNode, `desc-${position}`);
      (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass)(slideDesc.parentNode, `description-${position}`);
    }
    (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass)(slideMedia, `gslide-${type}`);
    (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass)(slide, "loaded");
    if (type === "video") {
      _slides_video_js__WEBPACK_IMPORTED_MODULE_1__["default"].apply(this.instance, [slide, slideConfig, this.index, finalCallback]);
      return;
    }
    if (type === "external") {
      _slides_iframe_js__WEBPACK_IMPORTED_MODULE_2__["default"].apply(this, [slide, slideConfig, this.index, finalCallback]);
      return;
    }
    if (type === "inline") {
      _slides_inline_js__WEBPACK_IMPORTED_MODULE_3__["default"].apply(this.instance, [slide, slideConfig, this.index, finalCallback]);
      if (slideConfig.draggable) {
        new _drag_js__WEBPACK_IMPORTED_MODULE_4__["default"]({
          dragEl: slide.querySelector(".gslide-inline"),
          toleranceX: settings.dragToleranceX,
          toleranceY: settings.dragToleranceY,
          slide,
          instance: this.instance
        });
      }
      return;
    }
    if (type === "image") {
      (0,_slides_image_js__WEBPACK_IMPORTED_MODULE_5__["default"])(slide, slideConfig, this.index, () => {
        const img = slide.querySelector("img");
        if (slideConfig.draggable) {
          new _drag_js__WEBPACK_IMPORTED_MODULE_4__["default"]({
            dragEl: img,
            toleranceX: settings.dragToleranceX,
            toleranceY: settings.dragToleranceY,
            slide,
            instance: this.instance
          });
        }
        if (slideConfig.zoomable && img.naturalWidth > img.offsetWidth) {
          (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass)(img, "zoomable");
          new _zoom_js__WEBPACK_IMPORTED_MODULE_6__["default"](img, slide, () => {
            this.instance.resize();
          });
        }
        if ((0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(finalCallback)) {
          finalCallback();
        }
      });
      return;
    }
    if ((0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(finalCallback)) {
      finalCallback();
    }
  }
  slideShortDesc(string, n = 50, wordBoundary = false) {
    let div = document.createElement("div");
    div.innerHTML = string;
    let cleanedString = div.innerText;
    let useWordBoundary = wordBoundary;
    string = cleanedString.trim();
    if (string.length <= n) {
      return string;
    }
    let subString = string.substr(0, n - 1);
    if (!useWordBoundary) {
      return subString;
    }
    div = null;
    return subString + '... <a href="#" class="desc-more">' + wordBoundary + "</a>";
  }
  descriptionEvents(desc, data) {
    let moreLink = desc.querySelector(".desc-more");
    if (!moreLink) {
      return false;
    }
    (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addEvent)("click", {
      onElement: moreLink,
      withCallback: (event, target) => {
        event.preventDefault();
        const body = document.body;
        let desc2 = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.closest)(target, ".gslide-desc");
        if (!desc2) {
          return false;
        }
        desc2.innerHTML = data.description;
        (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass)(body, "gdesc-open");
        let shortEvent = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addEvent)("click", {
          onElement: [body, (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.closest)(desc2, ".gslide-description")],
          withCallback: (event2, target2) => {
            if (event2.target.nodeName.toLowerCase() !== "a") {
              (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.removeClass)(body, "gdesc-open");
              (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass)(body, "gdesc-closed");
              desc2.innerHTML = data.smallDescription;
              this.descriptionEvents(desc2, data);
              setTimeout(() => {
                (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.removeClass)(body, "gdesc-closed");
              }, 400);
              shortEvent.destroy();
            }
          }
        });
      }
    });
  }
  create() {
    return (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.createHTML)(this.instance.settings.slideHTML);
  }
  getConfig() {
    if (!(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNode)(this.element) && !this.element.hasOwnProperty("draggable")) {
      this.element.draggable = this.instance.settings.draggable;
    }
    const parser = new _slide_parser_js__WEBPACK_IMPORTED_MODULE_7__["default"](this.instance.settings.slideExtraAttributes);
    this.slideConfig = parser.parseConfig(this.element, this.instance.settings);
    return this.slideConfig;
  }
}


/***/ }),

/***/ "./src/js/core/touch-events.js":
/*!*************************************!*\
  !*** ./src/js/core/touch-events.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TouchEvents)
/* harmony export */ });
function getLen(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}
function dot(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
}
function getAngle(v1, v2) {
  var mr = getLen(v1) * getLen(v2);
  if (mr === 0) {
    return 0;
  }
  var r = dot(v1, v2) / mr;
  if (r > 1) {
    r = 1;
  }
  return Math.acos(r);
}
function cross(v1, v2) {
  return v1.x * v2.y - v2.x * v1.y;
}
function getRotateAngle(v1, v2) {
  var angle = getAngle(v1, v2);
  if (cross(v1, v2) > 0) {
    angle *= -1;
  }
  return angle * 180 / Math.PI;
}
class EventsHandlerAdmin {
  constructor(el) {
    this.handlers = [];
    this.el = el;
  }
  add(handler) {
    this.handlers.push(handler);
  }
  del(handler) {
    if (!handler) {
      this.handlers = [];
    }
    for (var i = this.handlers.length; i >= 0; i--) {
      if (this.handlers[i] === handler) {
        this.handlers.splice(i, 1);
      }
    }
  }
  dispatch() {
    for (var i = 0, len = this.handlers.length; i < len; i++) {
      var handler = this.handlers[i];
      if (typeof handler === "function") {
        handler.apply(this.el, arguments);
      }
    }
  }
}
function wrapFunc(el, handler) {
  var EventshandlerAdmin = new EventsHandlerAdmin(el);
  EventshandlerAdmin.add(handler);
  return EventshandlerAdmin;
}
class TouchEvents {
  constructor(el, option) {
    this.element = typeof el == "string" ? document.querySelector(el) : el;
    this.start = this.start.bind(this);
    this.move = this.move.bind(this);
    this.end = this.end.bind(this);
    this.cancel = this.cancel.bind(this);
    this.element.addEventListener("touchstart", this.start, false);
    this.element.addEventListener("touchmove", this.move, false);
    this.element.addEventListener("touchend", this.end, false);
    this.element.addEventListener("touchcancel", this.cancel, false);
    this.preV = { x: null, y: null };
    this.pinchStartLen = null;
    this.zoom = 1;
    this.isDoubleTap = false;
    var noop = function() {
    };
    this.rotate = wrapFunc(this.element, option.rotate || noop);
    this.touchStart = wrapFunc(this.element, option.touchStart || noop);
    this.multipointStart = wrapFunc(this.element, option.multipointStart || noop);
    this.multipointEnd = wrapFunc(this.element, option.multipointEnd || noop);
    this.pinch = wrapFunc(this.element, option.pinch || noop);
    this.swipe = wrapFunc(this.element, option.swipe || noop);
    this.tap = wrapFunc(this.element, option.tap || noop);
    this.doubleTap = wrapFunc(this.element, option.doubleTap || noop);
    this.longTap = wrapFunc(this.element, option.longTap || noop);
    this.singleTap = wrapFunc(this.element, option.singleTap || noop);
    this.pressMove = wrapFunc(this.element, option.pressMove || noop);
    this.twoFingerPressMove = wrapFunc(this.element, option.twoFingerPressMove || noop);
    this.touchMove = wrapFunc(this.element, option.touchMove || noop);
    this.touchEnd = wrapFunc(this.element, option.touchEnd || noop);
    this.touchCancel = wrapFunc(this.element, option.touchCancel || noop);
    this.translateContainer = this.element;
    this._cancelAllHandler = this.cancelAll.bind(this);
    window.addEventListener("scroll", this._cancelAllHandler);
    this.delta = null;
    this.last = null;
    this.now = null;
    this.tapTimeout = null;
    this.singleTapTimeout = null;
    this.longTapTimeout = null;
    this.swipeTimeout = null;
    this.x1 = this.x2 = this.y1 = this.y2 = null;
    this.preTapPosition = { x: null, y: null };
  }
  start(evt) {
    if (!evt.touches) {
      return;
    }
    const ignoreDragFor = ["a", "button", "input"];
    if (evt.target && evt.target.nodeName && ignoreDragFor.indexOf(evt.target.nodeName.toLowerCase()) >= 0) {
      console.log("ignore drag for this touched element", evt.target.nodeName.toLowerCase());
      return;
    }
    this.now = Date.now();
    this.x1 = evt.touches[0].pageX;
    this.y1 = evt.touches[0].pageY;
    this.delta = this.now - (this.last || this.now);
    this.touchStart.dispatch(evt, this.element);
    if (this.preTapPosition.x !== null) {
      this.isDoubleTap = this.delta > 0 && this.delta <= 250 && Math.abs(this.preTapPosition.x - this.x1) < 30 && Math.abs(this.preTapPosition.y - this.y1) < 30;
      if (this.isDoubleTap) {
        clearTimeout(this.singleTapTimeout);
      }
    }
    this.preTapPosition.x = this.x1;
    this.preTapPosition.y = this.y1;
    this.last = this.now;
    var preV = this.preV, len = evt.touches.length;
    if (len > 1) {
      this._cancelLongTap();
      this._cancelSingleTap();
      var v = { x: evt.touches[1].pageX - this.x1, y: evt.touches[1].pageY - this.y1 };
      preV.x = v.x;
      preV.y = v.y;
      this.pinchStartLen = getLen(preV);
      this.multipointStart.dispatch(evt, this.element);
    }
    this._preventTap = false;
    this.longTapTimeout = setTimeout(function() {
      this.longTap.dispatch(evt, this.element);
      this._preventTap = true;
    }.bind(this), 750);
  }
  move(evt) {
    if (!evt.touches) {
      return;
    }
    var preV = this.preV, len = evt.touches.length, currentX = evt.touches[0].pageX, currentY = evt.touches[0].pageY;
    this.isDoubleTap = false;
    if (len > 1) {
      var sCurrentX = evt.touches[1].pageX, sCurrentY = evt.touches[1].pageY;
      var v = { x: evt.touches[1].pageX - currentX, y: evt.touches[1].pageY - currentY };
      if (preV.x !== null) {
        if (this.pinchStartLen > 0) {
          evt.zoom = getLen(v) / this.pinchStartLen;
          this.pinch.dispatch(evt, this.element);
        }
        evt.angle = getRotateAngle(v, preV);
        this.rotate.dispatch(evt, this.element);
      }
      preV.x = v.x;
      preV.y = v.y;
      if (this.x2 !== null && this.sx2 !== null) {
        evt.deltaX = (currentX - this.x2 + sCurrentX - this.sx2) / 2;
        evt.deltaY = (currentY - this.y2 + sCurrentY - this.sy2) / 2;
      } else {
        evt.deltaX = 0;
        evt.deltaY = 0;
      }
      this.twoFingerPressMove.dispatch(evt, this.element);
      this.sx2 = sCurrentX;
      this.sy2 = sCurrentY;
    } else {
      if (this.x2 !== null) {
        evt.deltaX = currentX - this.x2;
        evt.deltaY = currentY - this.y2;
        var movedX = Math.abs(this.x1 - this.x2), movedY = Math.abs(this.y1 - this.y2);
        if (movedX > 10 || movedY > 10) {
          this._preventTap = true;
        }
      } else {
        evt.deltaX = 0;
        evt.deltaY = 0;
      }
      this.pressMove.dispatch(evt, this.element);
    }
    this.touchMove.dispatch(evt, this.element);
    this._cancelLongTap();
    this.x2 = currentX;
    this.y2 = currentY;
    if (len > 1) {
      evt.preventDefault();
    }
  }
  end(evt) {
    if (!evt.changedTouches) {
      return;
    }
    this._cancelLongTap();
    var self = this;
    if (evt.touches.length < 2) {
      this.multipointEnd.dispatch(evt, this.element);
      this.sx2 = this.sy2 = null;
    }
    if (this.x2 && Math.abs(this.x1 - this.x2) > 30 || this.y2 && Math.abs(this.y1 - this.y2) > 30) {
      evt.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2);
      this.swipeTimeout = setTimeout(function() {
        self.swipe.dispatch(evt, self.element);
      }, 0);
    } else {
      this.tapTimeout = setTimeout(function() {
        if (!self._preventTap) {
          self.tap.dispatch(evt, self.element);
        }
        if (self.isDoubleTap) {
          self.doubleTap.dispatch(evt, self.element);
          self.isDoubleTap = false;
        }
      }, 0);
      if (!self.isDoubleTap) {
        self.singleTapTimeout = setTimeout(function() {
          self.singleTap.dispatch(evt, self.element);
        }, 250);
      }
    }
    this.touchEnd.dispatch(evt, this.element);
    this.preV.x = 0;
    this.preV.y = 0;
    this.zoom = 1;
    this.pinchStartLen = null;
    this.x1 = this.x2 = this.y1 = this.y2 = null;
  }
  cancelAll() {
    this._preventTap = true;
    clearTimeout(this.singleTapTimeout);
    clearTimeout(this.tapTimeout);
    clearTimeout(this.longTapTimeout);
    clearTimeout(this.swipeTimeout);
  }
  cancel(evt) {
    this.cancelAll();
    this.touchCancel.dispatch(evt, this.element);
  }
  _cancelLongTap() {
    clearTimeout(this.longTapTimeout);
  }
  _cancelSingleTap() {
    clearTimeout(this.singleTapTimeout);
  }
  _swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? x1 - x2 > 0 ? "Left" : "Right" : y1 - y2 > 0 ? "Up" : "Down";
  }
  on(evt, handler) {
    if (this[evt]) {
      this[evt].add(handler);
    }
  }
  off(evt, handler) {
    if (this[evt]) {
      this[evt].del(handler);
    }
  }
  destroy() {
    if (this.singleTapTimeout) {
      clearTimeout(this.singleTapTimeout);
    }
    if (this.tapTimeout) {
      clearTimeout(this.tapTimeout);
    }
    if (this.longTapTimeout) {
      clearTimeout(this.longTapTimeout);
    }
    if (this.swipeTimeout) {
      clearTimeout(this.swipeTimeout);
    }
    this.element.removeEventListener("touchstart", this.start);
    this.element.removeEventListener("touchmove", this.move);
    this.element.removeEventListener("touchend", this.end);
    this.element.removeEventListener("touchcancel", this.cancel);
    this.rotate.del();
    this.touchStart.del();
    this.multipointStart.del();
    this.multipointEnd.del();
    this.pinch.del();
    this.swipe.del();
    this.tap.del();
    this.doubleTap.del();
    this.longTap.del();
    this.singleTap.del();
    this.pressMove.del();
    this.twoFingerPressMove.del();
    this.touchMove.del();
    this.touchEnd.del();
    this.touchCancel.del();
    this.preV = this.pinchStartLen = this.zoom = this.isDoubleTap = this.delta = this.last = this.now = this.tapTimeout = this.singleTapTimeout = this.longTapTimeout = this.swipeTimeout = this.x1 = this.x2 = this.y1 = this.y2 = this.preTapPosition = this.rotate = this.touchStart = this.multipointStart = this.multipointEnd = this.pinch = this.swipe = this.tap = this.doubleTap = this.longTap = this.singleTap = this.pressMove = this.touchMove = this.touchEnd = this.touchCancel = this.twoFingerPressMove = null;
    window.removeEventListener("scroll", this._cancelAllHandler);
    return null;
  }
}


/***/ }),

/***/ "./src/js/core/touch-navigation.js":
/*!*****************************************!*\
  !*** ./src/js/core/touch-navigation.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ touchNavigation)
/* harmony export */ });
/* harmony import */ var _touch_events_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./touch-events.js */ "./src/js/core/touch-events.js");
/* harmony import */ var _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/helpers.js */ "./src/js/utils/helpers.js");


function resetSlideMove(slide) {
  const transitionEnd = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.whichTransitionEvent)();
  const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  let media = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.hasClass)(slide, "gslide-media") ? slide : slide.querySelector(".gslide-media");
  let container = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.closest)(media, ".ginner-container");
  let desc = slide.querySelector(".gslide-description");
  if (windowWidth > 769) {
    media = container;
  }
  (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass)(media, "greset");
  (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.cssTransform)(media, "translate3d(0, 0, 0)");
  (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addEvent)(transitionEnd, {
    onElement: media,
    once: true,
    withCallback: (event, target) => {
      (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.removeClass)(media, "greset");
    }
  });
  media.style.opacity = "";
  if (desc) {
    desc.style.opacity = "";
  }
}
function touchNavigation(instance) {
  if (instance.events.hasOwnProperty("touch")) {
    return false;
  }
  let winSize = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.windowSize)();
  let winWidth = winSize.width;
  let winHeight = winSize.height;
  let process = false;
  let currentSlide = null;
  let media = null;
  let mediaImage = null;
  let doingMove = false;
  let initScale = 1;
  let maxScale = 4.5;
  let currentScale = 1;
  let doingZoom = false;
  let imageZoomed = false;
  let zoomedPosX = null;
  let zoomedPosY = null;
  let lastZoomedPosX = null;
  let lastZoomedPosY = null;
  let hDistance;
  let vDistance;
  let hDistancePercent = 0;
  let vDistancePercent = 0;
  let vSwipe = false;
  let hSwipe = false;
  let startCoords = {};
  let endCoords = {};
  let xDown = 0;
  let yDown = 0;
  let isInlined;
  const sliderWrapper = document.getElementById("glightbox-slider");
  const overlay = document.querySelector(".goverlay");
  const touchInstance = new _touch_events_js__WEBPACK_IMPORTED_MODULE_1__["default"](sliderWrapper, {
    touchStart: (e) => {
      process = true;
      if ((0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.hasClass)(e.targetTouches[0].target, "ginner-container") || (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.closest)(e.targetTouches[0].target, ".gslide-desc") || e.targetTouches[0].target.nodeName.toLowerCase() == "a") {
        process = false;
      }
      if ((0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.closest)(e.targetTouches[0].target, ".gslide-inline") && !(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.hasClass)(e.targetTouches[0].target.parentNode, "gslide-inline")) {
        process = false;
      }
      if (process) {
        endCoords = e.targetTouches[0];
        startCoords.pageX = e.targetTouches[0].pageX;
        startCoords.pageY = e.targetTouches[0].pageY;
        xDown = e.targetTouches[0].clientX;
        yDown = e.targetTouches[0].clientY;
        currentSlide = instance.activeSlide;
        media = currentSlide.querySelector(".gslide-media");
        isInlined = currentSlide.querySelector(".gslide-inline");
        mediaImage = null;
        if ((0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.hasClass)(media, "gslide-image")) {
          mediaImage = media.querySelector("img");
        }
        const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if (windowWidth > 769) {
          media = currentSlide.querySelector(".ginner-container");
        }
        (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.removeClass)(overlay, "greset");
        if (e.pageX > 20 && e.pageX < window.innerWidth - 20) {
          return;
        }
        e.preventDefault();
      }
    },
    touchMove: (e) => {
      if (!process) {
        return;
      }
      endCoords = e.targetTouches[0];
      if (doingZoom || imageZoomed) {
        return;
      }
      if (isInlined && isInlined.offsetHeight > winHeight) {
        const moved = startCoords.pageX - endCoords.pageX;
        if (Math.abs(moved) <= 13) {
          return false;
        }
      }
      doingMove = true;
      let xUp = e.targetTouches[0].clientX;
      let yUp = e.targetTouches[0].clientY;
      let xDiff = xDown - xUp;
      let yDiff = yDown - yUp;
      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        vSwipe = false;
        hSwipe = true;
      } else {
        hSwipe = false;
        vSwipe = true;
      }
      hDistance = endCoords.pageX - startCoords.pageX;
      hDistancePercent = hDistance * 100 / winWidth;
      vDistance = endCoords.pageY - startCoords.pageY;
      vDistancePercent = vDistance * 100 / winHeight;
      let opacity;
      if (vSwipe && mediaImage) {
        opacity = 1 - Math.abs(vDistance) / winHeight;
        overlay.style.opacity = opacity;
        if (instance.settings.touchFollowAxis) {
          hDistancePercent = 0;
        }
      }
      if (hSwipe) {
        opacity = 1 - Math.abs(hDistance) / winWidth;
        media.style.opacity = opacity;
        if (instance.settings.touchFollowAxis) {
          vDistancePercent = 0;
        }
      }
      if (!mediaImage) {
        return (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.cssTransform)(media, `translate3d(${hDistancePercent}%, 0, 0)`);
      }
      (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.cssTransform)(media, `translate3d(${hDistancePercent}%, ${vDistancePercent}%, 0)`);
    },
    touchEnd: () => {
      if (!process) {
        return;
      }
      doingMove = false;
      if (imageZoomed || doingZoom) {
        lastZoomedPosX = zoomedPosX;
        lastZoomedPosY = zoomedPosY;
        return;
      }
      const v = Math.abs(parseInt(vDistancePercent));
      const h = Math.abs(parseInt(hDistancePercent));
      if (v > 29 && mediaImage) {
        instance.close();
        return;
      }
      if (v < 29 && h < 25) {
        (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass)(overlay, "greset");
        overlay.style.opacity = 1;
        return resetSlideMove(media);
      }
    },
    multipointEnd: () => {
      setTimeout(() => {
        doingZoom = false;
      }, 50);
    },
    multipointStart: () => {
      doingZoom = true;
      initScale = currentScale ? currentScale : 1;
    },
    pinch: (evt) => {
      if (!mediaImage || doingMove) {
        return false;
      }
      doingZoom = true;
      mediaImage.scaleX = mediaImage.scaleY = initScale * evt.zoom;
      let scale = initScale * evt.zoom;
      imageZoomed = true;
      if (scale <= 1) {
        imageZoomed = false;
        scale = 1;
        lastZoomedPosY = null;
        lastZoomedPosX = null;
        zoomedPosX = null;
        zoomedPosY = null;
        mediaImage.setAttribute("style", "");
        return;
      }
      if (scale > maxScale) {
        scale = maxScale;
      }
      mediaImage.style.transform = `scale3d(${scale}, ${scale}, 1)`;
      currentScale = scale;
    },
    pressMove: (e) => {
      if (imageZoomed && !doingZoom) {
        var mhDistance = endCoords.pageX - startCoords.pageX;
        var mvDistance = endCoords.pageY - startCoords.pageY;
        if (lastZoomedPosX) {
          mhDistance = mhDistance + lastZoomedPosX;
        }
        if (lastZoomedPosY) {
          mvDistance = mvDistance + lastZoomedPosY;
        }
        zoomedPosX = mhDistance;
        zoomedPosY = mvDistance;
        let style = `translate3d(${mhDistance}px, ${mvDistance}px, 0)`;
        if (currentScale) {
          style += ` scale3d(${currentScale}, ${currentScale}, 1)`;
        }
        (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.cssTransform)(mediaImage, style);
      }
    },
    swipe: (evt) => {
      if (imageZoomed) {
        return;
      }
      if (doingZoom) {
        doingZoom = false;
        return;
      }
      if (evt.direction == "Left") {
        if (instance.index == instance.elements.length - 1) {
          return resetSlideMove(media);
        }
        instance.nextSlide();
      }
      if (evt.direction == "Right") {
        if (instance.index == 0) {
          return resetSlideMove(media);
        }
        instance.prevSlide();
      }
    }
  });
  instance.events["touch"] = touchInstance;
}


/***/ }),

/***/ "./src/js/core/zoom.js":
/*!*****************************!*\
  !*** ./src/js/core/zoom.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ZoomImages)
/* harmony export */ });
class ZoomImages {
  constructor(el, slide, onclose = null) {
    this.img = el;
    this.slide = slide;
    this.onclose = onclose;
    if (this.img.setZoomEvents) {
      return false;
    }
    this.active = false;
    this.zoomedIn = false;
    this.dragging = false;
    this.currentX = null;
    this.currentY = null;
    this.initialX = null;
    this.initialY = null;
    this.xOffset = 0;
    this.yOffset = 0;
    this.img.addEventListener("mousedown", (e) => this.dragStart(e), false);
    this.img.addEventListener("mouseup", (e) => this.dragEnd(e), false);
    this.img.addEventListener("mousemove", (e) => this.drag(e), false);
    this.img.addEventListener("click", (e) => {
      if (this.slide.classList.contains("dragging-nav")) {
        this.zoomOut();
        return false;
      }
      if (!this.zoomedIn) {
        return this.zoomIn();
      }
      if (this.zoomedIn && !this.dragging) {
        this.zoomOut();
      }
    }, false);
    this.img.setZoomEvents = true;
  }
  zoomIn() {
    let winWidth = this.widowWidth();
    if (this.zoomedIn || winWidth <= 768) {
      return;
    }
    const img = this.img;
    img.setAttribute("data-style", img.getAttribute("style"));
    img.style.maxWidth = img.naturalWidth + "px";
    img.style.maxHeight = img.naturalHeight + "px";
    if (img.naturalWidth > winWidth) {
      let centerX = winWidth / 2 - img.naturalWidth / 2;
      this.setTranslate(this.img.parentNode, centerX, 0);
    }
    this.slide.classList.add("zoomed");
    this.zoomedIn = true;
  }
  zoomOut() {
    this.img.parentNode.setAttribute("style", "");
    this.img.setAttribute("style", this.img.getAttribute("data-style"));
    this.slide.classList.remove("zoomed");
    this.zoomedIn = false;
    this.currentX = null;
    this.currentY = null;
    this.initialX = null;
    this.initialY = null;
    this.xOffset = 0;
    this.yOffset = 0;
    if (this.onclose && typeof this.onclose == "function") {
      this.onclose();
    }
  }
  dragStart(e) {
    e.preventDefault();
    if (!this.zoomedIn) {
      this.active = false;
      return;
    }
    if (e.type === "touchstart") {
      this.initialX = e.touches[0].clientX - this.xOffset;
      this.initialY = e.touches[0].clientY - this.yOffset;
    } else {
      this.initialX = e.clientX - this.xOffset;
      this.initialY = e.clientY - this.yOffset;
    }
    if (e.target === this.img) {
      this.active = true;
      this.img.classList.add("dragging");
    }
  }
  dragEnd(e) {
    e.preventDefault();
    this.initialX = this.currentX;
    this.initialY = this.currentY;
    this.active = false;
    setTimeout(() => {
      this.dragging = false;
      this.img.isDragging = false;
      this.img.classList.remove("dragging");
    }, 100);
  }
  drag(e) {
    if (this.active) {
      e.preventDefault();
      if (e.type === "touchmove") {
        this.currentX = e.touches[0].clientX - this.initialX;
        this.currentY = e.touches[0].clientY - this.initialY;
      } else {
        this.currentX = e.clientX - this.initialX;
        this.currentY = e.clientY - this.initialY;
      }
      this.xOffset = this.currentX;
      this.yOffset = this.currentY;
      this.img.isDragging = true;
      this.dragging = true;
      this.setTranslate(this.img, this.currentX, this.currentY);
    }
  }
  onMove(e) {
    if (!this.zoomedIn) {
      return;
    }
    let xOffset = e.clientX - this.img.naturalWidth / 2;
    let yOffset = e.clientY - this.img.naturalHeight / 2;
    this.setTranslate(this.img, xOffset, yOffset);
  }
  setTranslate(node, xPos, yPos) {
    node.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
  }
  widowWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }
}


/***/ }),

/***/ "./src/js/glightbox.js":
/*!*****************************!*\
  !*** ./src/js/glightbox.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GLightbox": () => (/* binding */ GLightbox)
/* harmony export */ });
/* harmony import */ var _core_keyboard_navigation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/keyboard-navigation.js */ "./src/js/core/keyboard-navigation.js");
/* harmony import */ var _core_touch_navigation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/touch-navigation.js */ "./src/js/core/touch-navigation.js");
/* harmony import */ var _core_slide_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/slide.js */ "./src/js/core/slide.js");
/* harmony import */ var _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/helpers.js */ "./src/js/utils/helpers.js");




const version = "3.1.0";
const isMobile = false;
const isTouch = true;
const html = false;
const defaults = {
  selector: ".glightbox",
  elements: null,
  skin: "clean",
  theme: "clean",
  closeButton: true,
  startAt: null,
  autoplayVideos: true,
  autofocusVideos: true,
  descPosition: "bottom",
  width: "900px",
  height: "506px",
  videosWidth: "960px",
  beforeSlideChange: null,
  afterSlideChange: null,
  beforeSlideLoad: null,
  afterSlideLoad: null,
  slideInserted: null,
  slideRemoved: null,
  slideExtraAttributes: null,
  onOpen: null,
  onClose: null,
  loop: false,
  zoomable: true,
  draggable: true,
  dragAutoSnap: false,
  dragToleranceX: 40,
  dragToleranceY: 65,
  preload: true,
  oneSlidePerOpen: false,
  touchNavigation: true,
  touchFollowAxis: true,
  keyboardNavigation: true,
  closeOnOutsideClick: true,
  plugins: false,
  plyr: {
    css: "https://cdn.plyr.io/3.6.8/plyr.css",
    js: "https://cdn.plyr.io/3.6.8/plyr.js",
    config: {
      ratio: "16:9",
      fullscreen: { enabled: true, iosNative: true },
      youtube: {
        noCookie: true,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3
      },
      vimeo: {
        byline: false,
        portrait: false,
        title: false,
        transparent: false
      }
    }
  },
  openEffect: "zoom",
  closeEffect: "zoom",
  slideEffect: "slide",
  moreText: "See more",
  moreLength: 60,
  cssEfects: {
    fade: { in: "fadeIn", out: "fadeOut" },
    zoom: { in: "zoomIn", out: "zoomOut" },
    slide: { in: "slideInRight", out: "slideOutLeft" },
    slideBack: { in: "slideInLeft", out: "slideOutRight" },
    none: { in: "none", out: "none" }
  },
  svg: {
    close: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306C514.019,27.23,514.019,14.135,505.943,6.058z"/></g></g><g><g><path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"/></g></g></svg>',
    next: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"> <g><path d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z"/></g></svg>',
    prev: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"><g><path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/></g></svg>'
  }
};
defaults.slideHTML = `<div class="gslide">
    <div class="gslide-inner-content">
        <div class="ginner-container">
            <div class="gslide-media">
            </div>
            <div class="gslide-description">
                <div class="gdesc-inner">
                    <h4 class="gslide-title"></h4>
                    <div class="gslide-desc"></div>
                </div>
            </div>
        </div>
    </div>
</div>`;
defaults.lightboxHTML = `<div id="glightbox-body" class="glightbox-container" tabindex="-1" role="dialog" aria-hidden="false">
    <div class="gloader visible"></div>
    <div class="goverlay"></div>
    <div class="gcontainer">
    <div id="glightbox-slider" class="gslider"></div>
    <button class="gclose gbtn" aria-label="Close" data-taborder="3">{closeSVG}</button>
    <button class="gprev gbtn" aria-label="Previous" data-taborder="2">{prevSVG}</button>
    <button class="gnext gbtn" aria-label="Next" data-taborder="1">{nextSVG}</button>
</div>
</div>`;
class GLightbox {
  constructor(options = {}) {
    this.customOptions = options;
    this.settings = _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.extend(defaults, options);
    this.effectsClasses = this.getAnimationClasses();
    this.videoPlayers = {};
    this.apiEvents = [];
    this.fullElementsList = false;
  }
  async processss() {
    console.log("do process");
    console.log("and also do another process yes");
    console.log("Rammstein");
    console.log("Supercool");
    console.log("onepo");
    console.log("giebelushka");
  }
  init() {
    const selector = this.getSelector();
    if (selector) {
      this.baseEvents = _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addEvent("click", {
        onElement: selector,
        withCallback: (e, target) => {
          e.preventDefault();
          this.open(target);
        }
      });
    }
    this.elements = this.getElements();
  }
  open(element = null, startAt = null) {
    if (this.elements.length == 0) {
      return false;
    }
    this.activeSlide = null;
    this.prevActiveSlideIndex = null;
    this.prevActiveSlide = null;
    let index = _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNumber(startAt) ? startAt : this.settings.startAt;
    if (_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNode(element)) {
      const gallery = element.getAttribute("data-gallery");
      if (gallery) {
        this.fullElementsList = this.elements;
        this.elements = this.getGalleryElements(this.elements, gallery);
      }
      if (_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNil(index)) {
        index = this.getElementIndex(element);
        if (index < 0) {
          index = 0;
        }
      }
    }
    if (!_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNumber(index)) {
      index = 0;
    }
    this.build();
    _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.animateElement(this.overlay, this.settings.openEffect == "none" ? "none" : this.settings.cssEfects.fade.in);
    const body = document.body;
    const scrollBar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollBar > 0) {
      var styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.className = "gcss-styles";
      styleSheet.innerText = `.gscrollbar-fixer {margin-right: ${scrollBar}px}`;
      document.head.appendChild(styleSheet);
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass(body, "gscrollbar-fixer");
    }
    _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass(body, "glightbox-open");
    _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass(html, "glightbox-open");
    if (isMobile) {
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass(document.body, "glightbox-mobile");
      this.settings.slideEffect = "slide";
    }
    this.showSlide(index, true);
    if (this.elements.length == 1) {
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass(this.prevButton, "glightbox-button-hidden");
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass(this.nextButton, "glightbox-button-hidden");
    } else {
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.removeClass(this.prevButton, "glightbox-button-hidden");
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.removeClass(this.nextButton, "glightbox-button-hidden");
    }
    this.lightboxOpen = true;
    this.trigger("open");
    if (_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isFunction(this.settings.onOpen)) {
      this.settings.onOpen();
    }
    if (isTouch && this.settings.touchNavigation) {
      (0,_core_touch_navigation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this);
    }
    if (this.settings.keyboardNavigation) {
      (0,_core_keyboard_navigation_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this);
    }
  }
  openAt(index = 0) {
    this.open(null, index);
  }
  showSlide(index = 0, first = false) {
    _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.show(this.loader);
    this.index = parseInt(index);
    let current = this.slidesContainer.querySelector(".current");
    if (current) {
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.removeClass(current, "current");
    }
    this.slideAnimateOut();
    let slideNode = this.slidesContainer.querySelectorAll(".gslide")[index];
    if (_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.hasClass(slideNode, "loaded")) {
      this.slideAnimateIn(slideNode, first);
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.hide(this.loader);
    } else {
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.show(this.loader);
      const slide = this.elements[index];
      const slideData = {
        index: this.index,
        slide: slideNode,
        slideNode,
        slideConfig: slide.slideConfig,
        slideIndex: this.index,
        trigger: slide.node,
        player: null
      };
      this.trigger("slide_before_load", slideData);
      slide.instance.setContent(slideNode, () => {
        _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.hide(this.loader);
        this.resize();
        this.slideAnimateIn(slideNode, first);
        this.trigger("slide_after_load", slideData);
      });
    }
    this.slideDescription = slideNode.querySelector(".gslide-description");
    this.slideDescriptionContained = this.slideDescription && _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.hasClass(this.slideDescription.parentNode, "gslide-media");
    if (this.settings.preload) {
      this.preloadSlide(index + 1);
      this.preloadSlide(index - 1);
    }
    this.updateNavigationClasses();
    this.activeSlide = slideNode;
  }
  preloadSlide(index) {
    if (index < 0 || index > this.elements.length - 1) {
      return false;
    }
    if (_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNil(this.elements[index])) {
      return false;
    }
    let slideNode = this.slidesContainer.querySelectorAll(".gslide")[index];
    if (_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.hasClass(slideNode, "loaded")) {
      return false;
    }
    const slide = this.elements[index];
    const type = slide.type;
    const slideData = {
      index,
      slide: slideNode,
      slideNode,
      slideConfig: slide.slideConfig,
      slideIndex: index,
      trigger: slide.node,
      player: null
    };
    this.trigger("slide_before_load", slideData);
    if (type == "video" || type == "external") {
      setTimeout(() => {
        slide.instance.setContent(slideNode, () => {
          this.trigger("slide_after_load", slideData);
        });
      }, 200);
    } else {
      slide.instance.setContent(slideNode, () => {
        this.trigger("slide_after_load", slideData);
      });
    }
  }
  prevSlide() {
    this.goToSlide(this.index - 1);
  }
  nextSlide() {
    this.goToSlide(this.index + 1);
  }
  goToSlide(index = false) {
    this.prevActiveSlide = this.activeSlide;
    this.prevActiveSlideIndex = this.index;
    if (!this.loop() && (index < 0 || index > this.elements.length - 1)) {
      return false;
    }
    if (index < 0) {
      index = this.elements.length - 1;
    } else if (index >= this.elements.length) {
      index = 0;
    }
    this.showSlide(index);
  }
  insertSlide(config = {}, index = -1) {
    if (index < 0) {
      index = this.elements.length;
    }
    const slide = new _core_slide_js__WEBPACK_IMPORTED_MODULE_3__["default"](config, this, index);
    const data = slide.getConfig();
    const slideInfo = _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.extend({}, data);
    const newSlide = slide.create();
    const totalSlides = this.elements.length - 1;
    slideInfo.index = index;
    slideInfo.node = false;
    slideInfo.instance = slide;
    slideInfo.slideConfig = data;
    this.elements.splice(index, 0, slideInfo);
    let addedSlideNode = null;
    let addedSlidePlayer = null;
    if (this.slidesContainer) {
      if (index > totalSlides) {
        this.slidesContainer.appendChild(newSlide);
      } else {
        let existingSlide = this.slidesContainer.querySelectorAll(".gslide")[index];
        this.slidesContainer.insertBefore(newSlide, existingSlide);
      }
      if (this.settings.preload && this.index == 0 && index == 0 || this.index - 1 == index || this.index + 1 == index) {
        this.preloadSlide(index);
      }
      if (this.index == 0 && index == 0) {
        this.index = 1;
      }
      this.updateNavigationClasses();
      addedSlideNode = this.slidesContainer.querySelectorAll(".gslide")[index];
      addedSlidePlayer = this.getSlidePlayerInstance(index);
      slideInfo.slideNode = addedSlideNode;
    }
    this.trigger("slide_inserted", {
      index,
      slide: addedSlideNode,
      slideNode: addedSlideNode,
      slideConfig: data,
      slideIndex: index,
      trigger: null,
      player: addedSlidePlayer
    });
    if (_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isFunction(this.settings.slideInserted)) {
      this.settings.slideInserted({
        index,
        slide: addedSlideNode,
        player: addedSlidePlayer
      });
    }
  }
  removeSlide(index = -1) {
    if (index < 0 || index > this.elements.length - 1) {
      return false;
    }
    const slide = this.slidesContainer && this.slidesContainer.querySelectorAll(".gslide")[index];
    if (slide) {
      if (this.getActiveSlideIndex() == index) {
        if (index == this.elements.length - 1) {
          this.prevSlide();
        } else {
          this.nextSlide();
        }
      }
      slide.parentNode.removeChild(slide);
    }
    this.elements.splice(index, 1);
    this.trigger("slide_removed", index);
    if (_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isFunction(this.settings.slideRemoved)) {
      this.settings.slideRemoved(index);
    }
  }
  slideAnimateIn(slide, first) {
    let slideMedia = slide.querySelector(".gslide-media");
    let slideDesc = slide.querySelector(".gslide-description");
    let prevData = {
      index: this.prevActiveSlideIndex,
      slide: this.prevActiveSlide,
      slideNode: this.prevActiveSlide,
      slideIndex: this.prevActiveSlide,
      slideConfig: _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNil(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].slideConfig,
      trigger: _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNil(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].node,
      player: this.getSlidePlayerInstance(this.prevActiveSlideIndex)
    };
    let nextData = {
      index: this.index,
      slide: this.activeSlide,
      slideNode: this.activeSlide,
      slideConfig: this.elements[this.index].slideConfig,
      slideIndex: this.index,
      trigger: this.elements[this.index].node,
      player: this.getSlidePlayerInstance(this.index)
    };
    if (slideMedia.offsetWidth > 0 && slideDesc) {
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.hide(slideDesc);
      slideDesc.style.display = "";
    }
    _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.removeClass(slide, this.effectsClasses);
    if (first) {
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.animateElement(slide, this.settings.cssEfects[this.settings.openEffect].in, () => {
        if (this.settings.autoplayVideos) {
          this.slidePlayerPlay(slide);
        }
        this.trigger("slide_changed", {
          prev: prevData,
          current: nextData
        });
        if (_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isFunction(this.settings.afterSlideChange)) {
          this.settings.afterSlideChange.apply(this, [prevData, nextData]);
        }
      });
    } else {
      let effectName = this.settings.slideEffect;
      let animIn = effectName !== "none" ? this.settings.cssEfects[effectName].in : effectName;
      if (this.prevActiveSlideIndex > this.index) {
        if (this.settings.slideEffect == "slide") {
          animIn = this.settings.cssEfects.slideBack.in;
        }
      }
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.animateElement(slide, animIn, () => {
        if (this.settings.autoplayVideos) {
          this.slidePlayerPlay(slide);
        }
        this.trigger("slide_changed", {
          prev: prevData,
          current: nextData
        });
        if (_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isFunction(this.settings.afterSlideChange)) {
          this.settings.afterSlideChange.apply(this, [prevData, nextData]);
        }
      });
    }
    setTimeout(() => {
      this.resize(slide);
    }, 100);
    _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass(slide, "current");
  }
  slideAnimateOut() {
    if (!this.prevActiveSlide) {
      return false;
    }
    let prevSlide = this.prevActiveSlide;
    _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.removeClass(prevSlide, this.effectsClasses);
    _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass(prevSlide, "prev");
    let animation = this.settings.slideEffect;
    let animOut = animation !== "none" ? this.settings.cssEfects[animation].out : animation;
    this.slidePlayerPause(prevSlide);
    this.trigger("slide_before_change", {
      prev: {
        index: this.prevActiveSlideIndex,
        slide: this.prevActiveSlide,
        slideNode: this.prevActiveSlide,
        slideIndex: this.prevActiveSlideIndex,
        slideConfig: _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNil(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].slideConfig,
        trigger: _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNil(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].node,
        player: this.getSlidePlayerInstance(this.prevActiveSlideIndex)
      },
      current: {
        index: this.index,
        slide: this.activeSlide,
        slideNode: this.activeSlide,
        slideIndex: this.index,
        slideConfig: this.elements[this.index].slideConfig,
        trigger: this.elements[this.index].node,
        player: this.getSlidePlayerInstance(this.index)
      }
    });
    if (_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isFunction(this.settings.beforeSlideChange)) {
      this.settings.beforeSlideChange.apply(this, [
        {
          index: this.prevActiveSlideIndex,
          slide: this.prevActiveSlide,
          player: this.getSlidePlayerInstance(this.prevActiveSlideIndex)
        },
        {
          index: this.index,
          slide: this.activeSlide,
          player: this.getSlidePlayerInstance(this.index)
        }
      ]);
    }
    if (this.prevActiveSlideIndex > this.index && this.settings.slideEffect == "slide") {
      animOut = this.settings.cssEfects.slideBack.out;
    }
    _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.animateElement(prevSlide, animOut, () => {
      let container = prevSlide.querySelector(".ginner-container");
      let media = prevSlide.querySelector(".gslide-media");
      let desc = prevSlide.querySelector(".gslide-description");
      container.style.transform = "";
      media.style.transform = "";
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.removeClass(media, "greset");
      media.style.opacity = "";
      if (desc) {
        desc.style.opacity = "";
      }
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.removeClass(prevSlide, "prev");
    });
  }
  getAllPlayers() {
    return this.videoPlayers;
  }
  getSlidePlayerInstance(index) {
    const id = "gvideo" + index;
    const videoPlayers = this.getAllPlayers();
    if (_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.has(videoPlayers, id) && videoPlayers[id]) {
      return videoPlayers[id];
    }
    return false;
  }
  stopSlideVideo(slide) {
    if (_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNode(slide)) {
      let node = slide.querySelector(".gvideo-wrapper");
      if (node) {
        slide = node.getAttribute("data-index");
      }
    }
    console.log("stopSlideVideo is deprecated, use slidePlayerPause");
    const player = this.getSlidePlayerInstance(slide);
    if (player && player.playing) {
      player.pause();
    }
  }
  slidePlayerPause(slide) {
    if (_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNode(slide)) {
      let node = slide.querySelector(".gvideo-wrapper");
      if (node) {
        slide = node.getAttribute("data-index");
      }
    }
    const player = this.getSlidePlayerInstance(slide);
    if (player && player.playing) {
      player.pause();
    }
  }
  playSlideVideo(slide) {
    if (_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNode(slide)) {
      let node = slide.querySelector(".gvideo-wrapper");
      if (node) {
        slide = node.getAttribute("data-index");
      }
    }
    console.log("playSlideVideo is deprecated, use slidePlayerPlay");
    const player = this.getSlidePlayerInstance(slide);
    if (player && !player.playing) {
      player.play();
    }
  }
  slidePlayerPlay(slide) {
    if (_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNode(slide)) {
      let node = slide.querySelector(".gvideo-wrapper");
      if (node) {
        slide = node.getAttribute("data-index");
      }
    }
    const player = this.getSlidePlayerInstance(slide);
    if (player && !player.playing) {
      player.play();
      if (this.settings.autofocusVideos) {
        player.elements.container.focus();
      }
    }
  }
  setElements(elements) {
    this.settings.elements = false;
    const newElements = [];
    if (elements && elements.length) {
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.each(elements, (el, i) => {
        const slide = new _core_slide_js__WEBPACK_IMPORTED_MODULE_3__["default"](el, this, i);
        const data = slide.getConfig();
        const slideInfo = _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.extend({}, data);
        slideInfo.slideConfig = data;
        slideInfo.instance = slide;
        slideInfo.index = i;
        newElements.push(slideInfo);
      });
    }
    this.elements = newElements;
    if (this.lightboxOpen) {
      this.slidesContainer.innerHTML = "";
      if (this.elements.length) {
        _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.each(this.elements, () => {
          let slide = _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.createHTML(this.settings.slideHTML);
          this.slidesContainer.appendChild(slide);
        });
        this.showSlide(0, true);
      }
    }
  }
  getElementIndex(node) {
    let index = false;
    _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.each(this.elements, (el, i) => {
      if (_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.has(el, "node") && el.node == node) {
        index = i;
        return true;
      }
    });
    return index;
  }
  getElements() {
    let list = [];
    this.elements = this.elements ? this.elements : [];
    if (!_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNil(this.settings.elements) && _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isArray(this.settings.elements) && this.settings.elements.length) {
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.each(this.settings.elements, (el, i) => {
        const slide = new _core_slide_js__WEBPACK_IMPORTED_MODULE_3__["default"](el, this, i);
        const elData = slide.getConfig();
        const slideInfo = _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.extend({}, elData);
        slideInfo.node = false;
        slideInfo.index = i;
        slideInfo.instance = slide;
        slideInfo.slideConfig = elData;
        list.push(slideInfo);
      });
    }
    let nodes = false;
    let selector = this.getSelector();
    if (selector) {
      nodes = document.querySelectorAll(this.getSelector());
    }
    if (!nodes) {
      return list;
    }
    _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.each(nodes, (el, i) => {
      const slide = new _core_slide_js__WEBPACK_IMPORTED_MODULE_3__["default"](el, this, i);
      const elData = slide.getConfig();
      const slideInfo = _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.extend({}, elData);
      slideInfo.node = el;
      slideInfo.index = i;
      slideInfo.instance = slide;
      slideInfo.slideConfig = elData;
      slideInfo.gallery = el.getAttribute("data-gallery");
      list.push(slideInfo);
    });
    return list;
  }
  getGalleryElements(list, gallery) {
    return list.filter((el) => {
      return el.gallery == gallery;
    });
  }
  getSelector() {
    if (this.settings.elements) {
      return false;
    }
    if (this.settings.selector && this.settings.selector.substring(0, 5) == "data-") {
      return `*[${this.settings.selector}]`;
    }
    return this.settings.selector;
  }
  getActiveSlide() {
    return this.slidesContainer.querySelectorAll(".gslide")[this.index];
  }
  getActiveSlideIndex() {
    return this.index;
  }
  getAnimationClasses() {
    let effects = [];
    for (let key in this.settings.cssEfects) {
      if (this.settings.cssEfects.hasOwnProperty(key)) {
        let effect = this.settings.cssEfects[key];
        effects.push(`g${effect.in}`);
        effects.push(`g${effect.out}`);
      }
    }
    return effects.join(" ");
  }
  build() {
    if (this.built) {
      return false;
    }
    const children = document.body.childNodes;
    const bodyChildElms = [];
    _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.each(children, (el) => {
      if (el.parentNode == document.body && el.nodeName.charAt(0) !== "#" && el.hasAttribute && !el.hasAttribute("aria-hidden")) {
        bodyChildElms.push(el);
        el.setAttribute("aria-hidden", "true");
      }
    });
    const nextSVG = _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.has(this.settings.svg, "next") ? this.settings.svg.next : "";
    const prevSVG = _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.has(this.settings.svg, "prev") ? this.settings.svg.prev : "";
    const closeSVG = _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.has(this.settings.svg, "close") ? this.settings.svg.close : "";
    let lightboxHTML = this.settings.lightboxHTML;
    lightboxHTML = lightboxHTML.replace(/{nextSVG}/g, nextSVG);
    lightboxHTML = lightboxHTML.replace(/{prevSVG}/g, prevSVG);
    lightboxHTML = lightboxHTML.replace(/{closeSVG}/g, closeSVG);
    lightboxHTML = _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.createHTML(lightboxHTML);
    document.body.appendChild(lightboxHTML);
    const modal = document.getElementById("glightbox-body");
    this.modal = modal;
    let closeButton = modal.querySelector(".gclose");
    this.prevButton = modal.querySelector(".gprev");
    this.nextButton = modal.querySelector(".gnext");
    this.overlay = modal.querySelector(".goverlay");
    this.loader = modal.querySelector(".gloader");
    this.slidesContainer = document.getElementById("glightbox-slider");
    this.bodyHiddenChildElms = bodyChildElms;
    this.events = {};
    _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass(this.modal, "glightbox-" + this.settings.skin);
    if (this.settings.closeButton && closeButton) {
      this.events["close"] = _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addEvent("click", {
        onElement: closeButton,
        withCallback: (e, target) => {
          e.preventDefault();
          this.close();
        }
      });
    }
    if (closeButton && !this.settings.closeButton) {
      closeButton.parentNode.removeChild(closeButton);
    }
    if (this.nextButton) {
      this.events["next"] = _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addEvent("click", {
        onElement: this.nextButton,
        withCallback: (e, target) => {
          e.preventDefault();
          this.nextSlide();
        }
      });
    }
    if (this.prevButton) {
      this.events["prev"] = _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addEvent("click", {
        onElement: this.prevButton,
        withCallback: (e, target) => {
          e.preventDefault();
          this.prevSlide();
        }
      });
    }
    if (this.settings.closeOnOutsideClick) {
      this.events["outClose"] = _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addEvent("click", {
        onElement: modal,
        withCallback: (e, target) => {
          if (!this.preventOutsideClick && !_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.hasClass(document.body, "glightbox-mobile") && !_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.closest(e.target, ".ginner-container")) {
            if (!_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.closest(e.target, ".gbtn") && !_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.hasClass(e.target, "gnext") && !_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.hasClass(e.target, "gprev")) {
              this.close();
            }
          }
        }
      });
    }
    _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.each(this.elements, (slide, i) => {
      this.slidesContainer.appendChild(slide.instance.create());
      slide.slideNode = this.slidesContainer.querySelectorAll(".gslide")[i];
    });
    if (isTouch) {
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass(document.body, "glightbox-touch");
    }
    this.events["resize"] = _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addEvent("resize", {
      onElement: window,
      withCallback: () => {
        this.resize();
      }
    });
    this.built = true;
  }
  resize(slide = null) {
    slide = !slide ? this.activeSlide : slide;
    if (!slide || _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.hasClass(slide, "zoomed")) {
      return;
    }
    const winSize = _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.windowSize();
    const video = slide.querySelector(".gvideo-wrapper");
    const image = slide.querySelector(".gslide-image");
    const description = this.slideDescription;
    let winWidth = winSize.width;
    let winHeight = winSize.height;
    if (winWidth <= 768) {
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass(document.body, "glightbox-mobile");
    } else {
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.removeClass(document.body, "glightbox-mobile");
    }
    if (!video && !image) {
      return;
    }
    let descriptionResize = false;
    if (description && (_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.hasClass(description, "description-bottom") || _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.hasClass(description, "description-top")) && !_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.hasClass(description, "gabsolute")) {
      descriptionResize = true;
    }
    if (image) {
      if (winWidth <= 768) {
      } else if (descriptionResize) {
        let descHeight = description.offsetHeight;
        let imgNode = image.querySelector("img");
        imgNode.setAttribute("style", `max-height: calc(100vh - ${descHeight}px)`);
        description.setAttribute("style", `max-width: ${imgNode.offsetWidth}px;`);
      }
    }
    if (video) {
      let ratio = _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.has(this.settings.plyr.config, "ratio") ? this.settings.plyr.config.ratio : "";
      if (!ratio) {
        const containerWidth = video.clientWidth;
        const containerHeight = video.clientHeight;
        const divisor = containerWidth / containerHeight;
        ratio = `${containerWidth / divisor}:${containerHeight / divisor}`;
      }
      let videoRatio = ratio.split(":");
      let videoWidth = this.settings.videosWidth;
      let maxWidth = this.settings.videosWidth;
      if (_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNumber(videoWidth) || videoWidth.indexOf("px") !== -1) {
        maxWidth = parseInt(videoWidth);
      } else {
        if (videoWidth.indexOf("vw") !== -1) {
          maxWidth = winWidth * parseInt(videoWidth) / 100;
        } else if (videoWidth.indexOf("vh") !== -1) {
          maxWidth = winHeight * parseInt(videoWidth) / 100;
        } else if (videoWidth.indexOf("%") !== -1) {
          maxWidth = winWidth * parseInt(videoWidth) / 100;
        } else {
          maxWidth = parseInt(video.clientWidth);
        }
      }
      let maxHeight = maxWidth / (parseInt(videoRatio[0]) / parseInt(videoRatio[1]));
      maxHeight = Math.floor(maxHeight);
      if (descriptionResize) {
        winHeight = winHeight - description.offsetHeight;
      }
      if (maxWidth > winWidth || maxHeight > winHeight || winHeight < maxHeight && winWidth > maxWidth) {
        let vwidth = video.offsetWidth;
        let vheight = video.offsetHeight;
        let ratio2 = winHeight / vheight;
        let vsize = { width: vwidth * ratio2, height: vheight * ratio2 };
        video.parentNode.setAttribute("style", `max-width: ${vsize.width}px`);
        if (descriptionResize) {
          description.setAttribute("style", `max-width: ${vsize.width}px;`);
        }
      } else {
        video.parentNode.style.maxWidth = `${videoWidth}`;
        if (descriptionResize) {
          description.setAttribute("style", `max-width: ${videoWidth};`);
        }
      }
    }
  }
  reload() {
    this.init();
  }
  updateNavigationClasses() {
    const loop = this.loop();
    _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.removeClass(this.nextButton, "disabled");
    _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.removeClass(this.prevButton, "disabled");
    if (this.index == 0 && this.elements.length - 1 == 0) {
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass(this.prevButton, "disabled");
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass(this.nextButton, "disabled");
    } else if (this.index === 0 && !loop) {
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass(this.prevButton, "disabled");
    } else if (this.index === this.elements.length - 1 && !loop) {
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass(this.nextButton, "disabled");
    }
  }
  loop() {
    let loop = _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.has(this.settings, "loopAtEnd") ? this.settings.loopAtEnd : null;
    loop = _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.has(this.settings, "loop") ? this.settings.loop : loop;
    return loop;
  }
  close() {
    if (!this.lightboxOpen) {
      if (this.events) {
        for (let key in this.events) {
          if (this.events.hasOwnProperty(key)) {
            this.events[key].destroy();
          }
        }
        this.events = null;
      }
      return false;
    }
    if (this.closing) {
      return false;
    }
    this.closing = true;
    this.slidePlayerPause(this.activeSlide);
    if (this.fullElementsList) {
      this.elements = this.fullElementsList;
    }
    if (this.bodyHiddenChildElms.length) {
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.each(this.bodyHiddenChildElms, (el) => {
        el.removeAttribute("aria-hidden");
      });
    }
    _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass(this.modal, "glightbox-closing");
    _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.animateElement(this.overlay, this.settings.openEffect == "none" ? "none" : this.settings.cssEfects.fade.out);
    _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.animateElement(this.activeSlide, this.settings.cssEfects[this.settings.closeEffect].out, () => {
      this.activeSlide = null;
      this.prevActiveSlideIndex = null;
      this.prevActiveSlide = null;
      this.built = false;
      if (this.events) {
        for (let key in this.events) {
          if (this.events.hasOwnProperty(key)) {
            this.events[key].destroy();
          }
        }
        this.events = null;
      }
      const body = document.body;
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.removeClass(html, "glightbox-open");
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.removeClass(body, "glightbox-open touching gdesc-open glightbox-touch glightbox-mobile gscrollbar-fixer");
      this.modal.parentNode.removeChild(this.modal);
      this.trigger("close");
      if (_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isFunction(this.settings.onClose)) {
        this.settings.onClose();
      }
      const styles = document.querySelector(".gcss-styles");
      if (styles) {
        styles.parentNode.removeChild(styles);
      }
      this.lightboxOpen = false;
      this.closing = null;
    });
  }
  destroy() {
    this.close();
    this.clearAllEvents();
    if (this.baseEvents) {
      this.baseEvents.destroy();
    }
  }
  on(evt, callback, once = false) {
    if (!evt || !_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isFunction(callback)) {
      throw new TypeError("Event name and callback must be defined");
    }
    this.apiEvents.push({ evt, once, callback });
  }
  once(evt, callback) {
    this.on(evt, callback, true);
  }
  trigger(eventName, data = null) {
    const onceTriggered = [];
    _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.each(this.apiEvents, (event, i) => {
      const { evt, once, callback } = event;
      if (evt == eventName) {
        callback(data);
        if (once) {
          onceTriggered.push(i);
        }
      }
    });
    if (onceTriggered.length) {
      _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.each(onceTriggered, (i) => this.apiEvents.splice(i, 1));
    }
  }
  clearAllEvents() {
    this.apiEvents.splice(0, this.apiEvents.length);
  }
  version() {
    return version;
  }
}


/***/ }),

/***/ "./src/js/slides/iframe.js":
/*!*********************************!*\
  !*** ./src/js/slides/iframe.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ slideIframe)
/* harmony export */ });
/* harmony import */ var _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/helpers.js */ "./src/js/utils/helpers.js");

function slideIframe(slide, data, index, callback) {
  const slideMedia = slide.querySelector(".gslide-media");
  const iframe = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.createIframe)({
    url: data.href,
    callback
  });
  slideMedia.parentNode.style.maxWidth = data.width;
  slideMedia.parentNode.style.height = data.height;
  slideMedia.appendChild(iframe);
  return;
}


/***/ }),

/***/ "./src/js/slides/image.js":
/*!********************************!*\
  !*** ./src/js/slides/image.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ slideImage)
/* harmony export */ });
/* harmony import */ var _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/helpers.js */ "./src/js/utils/helpers.js");

function slideImage(slide, data, index, callback) {
  const slideMedia = slide.querySelector(".gslide-media");
  let img = new Image();
  let titleID = "gSlideTitle_" + index;
  let textID = "gSlideDesc_" + index;
  img.addEventListener("load", () => {
    if ((0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(callback)) {
      callback();
    }
  }, false);
  img.src = data.href;
  if (data.sizes != "" && data.srcset != "") {
    img.sizes = data.sizes;
    img.srcset = data.srcset;
  }
  img.alt = "";
  if (!(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNil)(data.alt) && data.alt !== "") {
    img.alt = data.alt;
  }
  if (data.title !== "") {
    img.setAttribute("aria-labelledby", titleID);
  }
  if (data.description !== "") {
    img.setAttribute("aria-describedby", textID);
  }
  if (data.hasOwnProperty("_hasCustomWidth") && data._hasCustomWidth) {
    img.style.width = data.width;
  }
  if (data.hasOwnProperty("_hasCustomHeight") && data._hasCustomHeight) {
    img.style.height = data.height;
  }
  slideMedia.insertBefore(img, slideMedia.firstChild);
  return;
}


/***/ }),

/***/ "./src/js/slides/inline.js":
/*!*********************************!*\
  !*** ./src/js/slides/inline.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ slideInline)
/* harmony export */ });
/* harmony import */ var _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/helpers.js */ "./src/js/utils/helpers.js");

function slideInline(slide, data, index, callback) {
  const slideMedia = slide.querySelector(".gslide-media");
  const hash = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.has)(data, "href") && data.href ? data.href.split("#").pop().trim() : false;
  const content = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.has)(data, "content") && data.content ? data.content : false;
  let innerContent;
  if (content) {
    if ((0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isString)(content)) {
      innerContent = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.createHTML)(`<div class="ginlined-content">${content}</div>`);
    }
    if ((0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isNode)(content)) {
      if (content.style.display == "none") {
        content.style.display = "block";
      }
      const container = document.createElement("div");
      container.className = "ginlined-content";
      container.appendChild(content);
      innerContent = container;
    }
  }
  if (hash) {
    let div = document.getElementById(hash);
    if (!div) {
      return false;
    }
    const cloned = div.cloneNode(true);
    cloned.style.height = data.height;
    cloned.style.maxWidth = data.width;
    (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass)(cloned, "ginlined-content");
    innerContent = cloned;
  }
  if (!innerContent) {
    console.error("Unable to append inline slide content", data);
    return false;
  }
  slideMedia.style.height = data.height;
  slideMedia.style.width = data.width;
  slideMedia.appendChild(innerContent);
  this.events["inlineclose" + hash] = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addEvent)("click", {
    onElement: slideMedia.querySelectorAll(".gtrigger-close"),
    withCallback: (e) => {
      e.preventDefault();
      this.close();
    }
  });
  if ((0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(callback)) {
    callback();
  }
  return;
}


/***/ }),

/***/ "./src/js/slides/video.js":
/*!********************************!*\
  !*** ./src/js/slides/video.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ slideVideo)
/* harmony export */ });
/* harmony import */ var _utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/helpers.js */ "./src/js/utils/helpers.js");

function slideVideo(slide, data, index, callback) {
  const slideContainer = slide.querySelector(".ginner-container");
  const videoID = "gvideo" + index;
  const slideMedia = slide.querySelector(".gslide-media");
  const videoPlayers = this.getAllPlayers();
  (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass)(slideContainer, "gvideo-container");
  slideMedia.insertBefore((0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.createHTML)('<div class="gvideo-wrapper"></div>'), slideMedia.firstChild);
  const videoWrapper = slide.querySelector(".gvideo-wrapper");
  (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.injectAssets)(this.settings.plyr.css, "Plyr");
  let url = data.href;
  let protocol = location.protocol.replace(":", "");
  let videoSource = "";
  let embedID = "";
  let customPlaceholder = false;
  if (protocol == "file") {
    protocol = "http";
  }
  slideMedia.style.maxWidth = data.width;
  (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.injectAssets)(this.settings.plyr.js, "Plyr", () => {
    if (url.match(/vimeo\.com\/([0-9]*)/)) {
      const vimeoID = /vimeo.*\/(\d+)/i.exec(url);
      videoSource = "vimeo";
      embedID = vimeoID[1];
    }
    if (url.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) || url.match(/(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/)) {
      const youtubeID = getYoutubeID(url);
      videoSource = "youtube";
      embedID = youtubeID;
    }
    if (url.match(/\.(mp4|ogg|webm|mov)$/) !== null) {
      videoSource = "local";
      let html = '<video id="' + videoID + '" ';
      html += `style="background:#000; max-width: ${data.width};" `;
      html += 'preload="metadata" ';
      html += 'x-webkit-airplay="allow" ';
      html += "playsinline ";
      html += "controls ";
      html += 'class="gvideo-local">';
      let format = url.toLowerCase().split(".").pop();
      let sources = { mp4: "", ogg: "", webm: "" };
      format = format == "mov" ? "mp4" : format;
      sources[format] = url;
      for (let key in sources) {
        if (sources.hasOwnProperty(key)) {
          let videoFile = sources[key];
          if (data.hasOwnProperty(key)) {
            videoFile = data[key];
          }
          if (videoFile !== "") {
            html += `<source src="${videoFile}" type="video/${key}">`;
          }
        }
      }
      html += "</video>";
      customPlaceholder = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.createHTML)(html);
    }
    const placeholder = customPlaceholder ? customPlaceholder : (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.createHTML)(`<div id="${videoID}" data-plyr-provider="${videoSource}" data-plyr-embed-id="${embedID}"></div>`);
    (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass)(videoWrapper, `${videoSource}-video gvideo`);
    videoWrapper.appendChild(placeholder);
    videoWrapper.setAttribute("data-id", videoID);
    videoWrapper.setAttribute("data-index", index);
    const playerConfig = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.has)(this.settings.plyr, "config") ? this.settings.plyr.config : {};
    const player = new Plyr("#" + videoID, playerConfig);
    player.on("ready", (event) => {
      const instance = event.detail.plyr;
      videoPlayers[videoID] = instance;
      if ((0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(callback)) {
        callback();
      }
    });
    (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.waitUntil)(() => {
      return slide.querySelector("iframe") && slide.querySelector("iframe").dataset.ready == "true";
    }, () => {
      this.resize(slide);
    });
    player.on("enterfullscreen", handleMediaFullScreen);
    player.on("exitfullscreen", handleMediaFullScreen);
  });
}
function getYoutubeID(url) {
  let videoID = "";
  url = url.replace(/(>|<)/gi, "").split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (url[2] !== void 0) {
    videoID = url[2].split(/[^0-9a-z_\-]/i);
    videoID = videoID[0];
  } else {
    videoID = url;
  }
  return videoID;
}
function handleMediaFullScreen(event) {
  const media = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.closest)(event.target, ".gslide-media");
  if (event.type == "enterfullscreen") {
    (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.addClass)(media, "fullscreen");
  }
  if (event.type == "exitfullscreen") {
    (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_0__.removeClass)(media, "fullscreen");
  }
}


/***/ }),

/***/ "./src/js/utils/helpers.js":
/*!*********************************!*\
  !*** ./src/js/utils/helpers.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "extend": () => (/* binding */ extend),
/* harmony export */   "each": () => (/* binding */ each),
/* harmony export */   "getNodeEvents": () => (/* binding */ getNodeEvents),
/* harmony export */   "addEvent": () => (/* binding */ addEvent),
/* harmony export */   "addClass": () => (/* binding */ addClass),
/* harmony export */   "removeClass": () => (/* binding */ removeClass),
/* harmony export */   "hasClass": () => (/* binding */ hasClass),
/* harmony export */   "closest": () => (/* binding */ closest),
/* harmony export */   "animateElement": () => (/* binding */ animateElement),
/* harmony export */   "cssTransform": () => (/* binding */ cssTransform),
/* harmony export */   "show": () => (/* binding */ show),
/* harmony export */   "hide": () => (/* binding */ hide),
/* harmony export */   "createHTML": () => (/* binding */ createHTML),
/* harmony export */   "windowSize": () => (/* binding */ windowSize),
/* harmony export */   "whichAnimationEvent": () => (/* binding */ whichAnimationEvent),
/* harmony export */   "whichTransitionEvent": () => (/* binding */ whichTransitionEvent),
/* harmony export */   "createIframe": () => (/* binding */ createIframe),
/* harmony export */   "waitUntil": () => (/* binding */ waitUntil),
/* harmony export */   "injectAssets": () => (/* binding */ injectAssets),
/* harmony export */   "isMobile": () => (/* binding */ isMobile),
/* harmony export */   "isTouch": () => (/* binding */ isTouch),
/* harmony export */   "isFunction": () => (/* binding */ isFunction),
/* harmony export */   "isString": () => (/* binding */ isString),
/* harmony export */   "isNode": () => (/* binding */ isNode),
/* harmony export */   "isArray": () => (/* binding */ isArray),
/* harmony export */   "isArrayLike": () => (/* binding */ isArrayLike),
/* harmony export */   "isObject": () => (/* binding */ isObject),
/* harmony export */   "isNil": () => (/* binding */ isNil),
/* harmony export */   "has": () => (/* binding */ has),
/* harmony export */   "size": () => (/* binding */ size),
/* harmony export */   "isNumber": () => (/* binding */ isNumber)
/* harmony export */ });
const uid = Date.now();
function extend() {
  let extended = {};
  let deep = true;
  let i = 0;
  let length = arguments.length;
  if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
    deep = arguments[0];
    i++;
  }
  let merge = (obj) => {
    for (let prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        if (deep && Object.prototype.toString.call(obj[prop]) === "[object Object]") {
          extended[prop] = extend(true, extended[prop], obj[prop]);
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };
  for (; i < length; i++) {
    let obj = arguments[i];
    merge(obj);
  }
  return extended;
}
function each(collection, callback) {
  if (isNode(collection) || collection === window || collection === document) {
    collection = [collection];
  }
  if (!isArrayLike(collection) && !isObject(collection)) {
    collection = [collection];
  }
  if (size(collection) == 0) {
    return;
  }
  if (isArrayLike(collection) && !isObject(collection)) {
    let l = collection.length, i = 0;
    for (; i < l; i++) {
      if (callback.call(collection[i], collection[i], i, collection) === false) {
        break;
      }
    }
  } else if (isObject(collection)) {
    for (let key in collection) {
      if (has(collection, key)) {
        if (callback.call(collection[key], collection[key], key, collection) === false) {
          break;
        }
      }
    }
  }
}
function getNodeEvents(node, name = null, fn = null) {
  const cache = node[uid] = node[uid] || [];
  const data = { all: cache, evt: null, found: null };
  if (name && fn && size(cache) > 0) {
    each(cache, (cl, i) => {
      if (cl.eventName == name && cl.fn.toString() == fn.toString()) {
        data.found = true;
        data.evt = i;
        return false;
      }
    });
  }
  return data;
}
function addEvent(eventName, {
  onElement,
  withCallback,
  avoidDuplicate = true,
  once = false,
  useCapture = false
} = {}, thisArg) {
  let element = onElement || [];
  if (isString(element)) {
    element = document.querySelectorAll(element);
  }
  function handler(event) {
    if (isFunction(withCallback)) {
      withCallback.call(thisArg, event, this);
    }
    if (once) {
      handler.destroy();
    }
  }
  handler.destroy = function() {
    each(element, (el) => {
      const events = getNodeEvents(el, eventName, handler);
      if (events.found) {
        events.all.splice(events.evt, 1);
      }
      if (el.removeEventListener) {
        el.removeEventListener(eventName, handler, useCapture);
      }
    });
  };
  each(element, (el) => {
    const events = getNodeEvents(el, eventName, handler);
    if (el.addEventListener && (avoidDuplicate && !events.found) || !avoidDuplicate) {
      el.addEventListener(eventName, handler, useCapture);
      events.all.push({ eventName, fn: handler });
    }
  });
  return handler;
}
function addClass(node, name) {
  each(name.split(" "), (cl) => node.classList.add(cl));
}
function removeClass(node, name) {
  each(name.split(" "), (cl) => node.classList.remove(cl));
}
function hasClass(node, name) {
  return node.classList.contains(name);
}
function closest(elem, selector) {
  while (elem !== document.body) {
    elem = elem.parentElement;
    if (!elem) {
      return false;
    }
    const matches = typeof elem.matches == "function" ? elem.matches(selector) : elem.msMatchesSelector(selector);
    if (matches) {
      return elem;
    }
  }
}
function animateElement(element, animation = "", callback = false) {
  if (!element || animation === "") {
    return false;
  }
  if (animation == "none") {
    if (isFunction(callback)) {
      callback();
    }
    return false;
  }
  const animationEnd = whichAnimationEvent();
  const animationNames = animation.split(" ");
  each(animationNames, (name) => {
    addClass(element, "g" + name);
  });
  addEvent(animationEnd, {
    onElement: element,
    avoidDuplicate: false,
    once: true,
    withCallback: (event, target) => {
      each(animationNames, (name) => {
        removeClass(target, "g" + name);
      });
      if (isFunction(callback)) {
        callback();
      }
    }
  });
}
function cssTransform(node, translate = "") {
  if (translate == "") {
    node.style.webkitTransform = "";
    node.style.MozTransform = "";
    node.style.msTransform = "";
    node.style.OTransform = "";
    node.style.transform = "";
    return false;
  }
  node.style.webkitTransform = translate;
  node.style.MozTransform = translate;
  node.style.msTransform = translate;
  node.style.OTransform = translate;
  node.style.transform = translate;
}
function show(element) {
  element.style.display = "block";
}
function hide(element) {
  element.style.display = "none";
}
function createHTML(htmlStr) {
  let frag = document.createDocumentFragment(), temp = document.createElement("div");
  temp.innerHTML = htmlStr;
  while (temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }
  return frag;
}
function windowSize() {
  return {
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  };
}
function whichAnimationEvent() {
  let t, el = document.createElement("fakeelement");
  let animations = {
    animation: "animationend",
    OAnimation: "oAnimationEnd",
    MozAnimation: "animationend",
    WebkitAnimation: "webkitAnimationEnd"
  };
  for (t in animations) {
    if (el.style[t] !== void 0) {
      return animations[t];
    }
  }
}
function whichTransitionEvent() {
  let t, el = document.createElement("fakeelement");
  const transitions = {
    transition: "transitionend",
    OTransition: "oTransitionEnd",
    MozTransition: "transitionend",
    WebkitTransition: "webkitTransitionEnd"
  };
  for (t in transitions) {
    if (el.style[t] !== void 0) {
      return transitions[t];
    }
  }
}
function createIframe(config) {
  let { url, allow, callback, appendTo } = config;
  let iframe = document.createElement("iframe");
  iframe.className = "vimeo-video gvideo";
  iframe.src = url;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  if (allow) {
    iframe.setAttribute("allow", allow);
  }
  iframe.onload = function() {
    addClass(iframe, "node-ready");
    if (isFunction(callback)) {
      callback();
    }
  };
  if (appendTo) {
    appendTo.appendChild(iframe);
  }
  return iframe;
}
function waitUntil(check, onComplete, delay, timeout) {
  if (check()) {
    onComplete();
    return;
  }
  if (!delay) {
    delay = 100;
  }
  let timeoutPointer;
  let intervalPointer = setInterval(() => {
    if (!check()) {
      return;
    }
    clearInterval(intervalPointer);
    if (timeoutPointer) {
      clearTimeout(timeoutPointer);
    }
    onComplete();
  }, delay);
  if (timeout) {
    timeoutPointer = setTimeout(() => {
      clearInterval(intervalPointer);
    }, timeout);
  }
}
function injectAssets(url, waitFor, callback) {
  if (isNil(url)) {
    console.error("Inject assets error");
    return;
  }
  if (isFunction(waitFor)) {
    callback = waitFor;
    waitFor = false;
  }
  if (isString(waitFor) && waitFor in window) {
    if (isFunction(callback)) {
      callback();
    }
    return;
  }
  let found;
  if (url.indexOf(".css") !== -1) {
    found = document.querySelectorAll('link[href="' + url + '"]');
    if (found && found.length > 0) {
      if (isFunction(callback)) {
        callback();
      }
      return;
    }
    const head = document.getElementsByTagName("head")[0];
    const headStyles = head.querySelectorAll('link[rel="stylesheet"]');
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    link.media = "all";
    if (headStyles) {
      head.insertBefore(link, headStyles[0]);
    } else {
      head.appendChild(link);
    }
    if (isFunction(callback)) {
      callback();
    }
    return;
  }
  found = document.querySelectorAll('script[src="' + url + '"]');
  if (found && found.length > 0) {
    if (isFunction(callback)) {
      if (isString(waitFor)) {
        waitUntil(() => {
          return typeof window[waitFor] !== "undefined";
        }, () => {
          callback();
        });
        return false;
      }
      callback();
    }
    return;
  }
  let script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  script.onload = () => {
    if (isFunction(callback)) {
      if (isString(waitFor)) {
        waitUntil(() => {
          return typeof window[waitFor] !== "undefined";
        }, () => {
          callback();
        });
        return false;
      }
      callback();
    }
  };
  document.body.appendChild(script);
  return;
}
function isMobile() {
  return false;
}
function isTouch() {
  return isMobile() !== null || document.createTouch !== void 0 || "ontouchstart" in window || "onmsgesturechange" in window || navigator.msMaxTouchPoints;
}
function isFunction(f) {
  return typeof f === "function";
}
function isString(s) {
  return typeof s === "string";
}
function isNode(el) {
  return !!(el && el.nodeType && el.nodeType == 1);
}
function isArray(ar) {
  return Array.isArray(ar);
}
function isArrayLike(ar) {
  return ar && ar.length && isFinite(ar.length);
}
function isObject(o) {
  let type = typeof o;
  return type === "object" && (o != null && !isFunction(o) && !isArray(o));
}
function isNil(o) {
  return o == null;
}
function has(obj, key) {
  return obj !== null && hasOwnProperty.call(obj, key);
}
function size(o) {
  if (isObject(o)) {
    if (o.keys) {
      return o.keys().length;
    }
    let l = 0;
    for (let k in o) {
      if (has(o, k)) {
        l++;
      }
    }
    return l;
  } else {
    return o.length;
  }
}
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ glightbox)
/* harmony export */ });
/* harmony import */ var _glightbox_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./glightbox.js */ "./src/js/glightbox.js");

function glightbox(options = {}) {
  const instance = new _glightbox_js__WEBPACK_IMPORTED_MODULE_0__.GLightbox(options);
  try {
    instance.init();
  } catch (error) {
    console.error(error);
  }
  return instance;
}
if (typeof window !== "undefined") {
  window.GLightbox = glightbox;
}

})();

module.exports = __webpack_exports__["default"];
/******/ })()
;