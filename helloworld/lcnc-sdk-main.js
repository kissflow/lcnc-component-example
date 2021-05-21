/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _lcnc_sdk_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lcnc-sdk.js */ \"./src/lcnc-sdk.js\");\n/* harmony import */ var _lcnc_handler_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lcnc-handler.js */ \"./src/lcnc-handler.js\");\n\n\n\nif (true) {\n    window.LCNC = _lcnc_sdk_js__WEBPACK_IMPORTED_MODULE_0__.default;\n}\n\n//temp code to check handler from iframes\n(0,_lcnc_handler_js__WEBPACK_IMPORTED_MODULE_1__.default)();\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_lcnc_sdk_js__WEBPACK_IMPORTED_MODULE_0__.default);\n\n//# sourceURL=webpack://@kissflow/lcnc-sdk-js/./src/index.js?");

/***/ }),

/***/ "./src/lcnc-handler.js":
/*!*****************************!*\
  !*** ./src/lcnc-handler.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nclass LCNCHandler {\n    constructor(props) {\n        console.log(\"Initializing LCNC HANDLER\", props);\n        this._onMessage = this._onMessage.bind(this);\n        window.addEventListener(\"message\", this._onMessage, false);\n    }\n\n    _onMessage(event) {\n        console.log(\"Parent receives messsage\", event);\n        const data = event.data;\n        this.execute(event.data, event.source);\n    }\n\n    execute(data, sourceWindow) {\n        switch (data.command) {\n            case \"PARAMS\":\n                this.sendBack(sourceWindow, data, {value: \"message from parent\"});\n                break;\n            case \"API\":\n                fetch(data.url, data.args).then(async (resp) => {\n                    const json = await resp.json();\n                    this.sendBack(sourceWindow, data, json);\n                });\n                break;\n            case \"REDIRECT\":\n                window.location.href = data.url;\n                break;\n            default:\n                console.log(\"Command not specified\", data);\n          }\n    }\n\n    sendBack(sourceWindow, req, res) {\n        if(req._id) {\n            sourceWindow.postMessage({_req :req, ...res}, \"*\")\n        }\n    }\n    \n}\n\nfunction initHandler(options = {}) {\n    return new LCNCHandler(options);\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (initHandler);\n\n//# sourceURL=webpack://@kissflow/lcnc-sdk-js/./src/lcnc-handler.js?");

/***/ }),

/***/ "./src/lcnc-sdk.js":
/*!*************************!*\
  !*** ./src/lcnc-sdk.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction generateId() {\n    return Math.floor(Date.now()).toString(36);\n}\n\nfunction postMessage(args) {\n    if (window.parent !== window) {\n        window.parent.postMessage(args, \"*\");\n    }\n}\n  \nclass LcncSdk {\n    constructor(props) {\n        console.log(\"Initializing LCNC SDK\", props);\n        this._listeners = {};\n        this._onMessage = this._onMessage.bind(this);\n\n        window.addEventListener(\"message\", this._onMessage, false);\n    }\n\n    api(url, args={}) {\n        return this._fetch(\"API\", { url, args });\n    }\n\n    watchParams(args={}) {\n        return this._fetch(\"PARAMS\", args);\n    }\n\n    _addListener(_id, callback) {\n        this._listeners[_id] = this._listeners[_id] || [];\n        this._listeners[_id].push(callback);\n    }\n\n    _fetch(command, args) {\n        return new Promise((resolve, reject) => {\n            const _id = generateId();\n            postMessage({_id, command, ...args});\n            this._addListener(_id, (data) => {\n              if (data.errorMessage) {\n                reject(data);\n              } else {\n                resolve(data);\n              }\n            });\n          });\n      }\n\n    _onMessage(event) {\n        console.log(event.origin, \"!==\", window.location.origin);\n        if (event.origin !== window.location.origin) {\n            console.log(\"child receives messsage\", event);\n            const data = event.data;\n            const _req = data._req || {}\n            let listeners = this._listeners[_req._id] || [];\n\n            if (listeners) {\n                listeners.forEach(listener => {\n                    try {\n                        listener(data);\n                    } catch (err) {\n                        console.error(\"Message callback error: \", err);\n                    }\n                });\n            }\n        }\n    }\n}\n\nclass ProcessSdk extends LcncSdk {\n    \n}\n\nfunction initSDK(config = {}) {\n    if (config.flow === \"Process\") {\n        return new ProcessSdk(config);\n    }\n    return new LcncSdk(config);\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (initSDK);\n\n//# sourceURL=webpack://@kissflow/lcnc-sdk-js/./src/lcnc-sdk.js?");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;