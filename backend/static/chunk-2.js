(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[2],{

/***/ "./node_modules/@babel/runtime/helpers/arrayWithHoles.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithHoles.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _arrayWithHoles(arr) {\n  if (Array.isArray(arr)) return arr;\n}\n\nmodule.exports = _arrayWithHoles;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/arrayWithHoles.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _iterableToArrayLimit(arr, i) {\n  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === \"[object Arguments]\")) {\n    return;\n  }\n\n  var _arr = [];\n  var _n = true;\n  var _d = false;\n  var _e = undefined;\n\n  try {\n    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {\n      _arr.push(_s.value);\n\n      if (i && _arr.length === i) break;\n    }\n  } catch (err) {\n    _d = true;\n    _e = err;\n  } finally {\n    try {\n      if (!_n && _i[\"return\"] != null) _i[\"return\"]();\n    } finally {\n      if (_d) throw _e;\n    }\n  }\n\n  return _arr;\n}\n\nmodule.exports = _iterableToArrayLimit;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/nonIterableRest.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableRest.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _nonIterableRest() {\n  throw new TypeError(\"Invalid attempt to destructure non-iterable instance\");\n}\n\nmodule.exports = _nonIterableRest;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/nonIterableRest.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/slicedToArray.js":
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/slicedToArray.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var arrayWithHoles = __webpack_require__(/*! ./arrayWithHoles */ \"./node_modules/@babel/runtime/helpers/arrayWithHoles.js\");\n\nvar iterableToArrayLimit = __webpack_require__(/*! ./iterableToArrayLimit */ \"./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js\");\n\nvar nonIterableRest = __webpack_require__(/*! ./nonIterableRest */ \"./node_modules/@babel/runtime/helpers/nonIterableRest.js\");\n\nfunction _slicedToArray(arr, i) {\n  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();\n}\n\nmodule.exports = _slicedToArray;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/slicedToArray.js?");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js?!./node_modules/sass-loader/dist/cjs.js!./src/components/Auth.module.scss":
/*!********************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--5-1!./node_modules/sass-loader/dist/cjs.js!./src/components/Auth.module.scss ***!
  \********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \"._1nbqN45NKpfctSEN9JpNAs {\\n  background-color: black;\\n  color: white;\\n  height: 100vh;\\n  text-align: center; }\\n\\n.kUWjb-AdrNTFT1vVEpxJx {\\n  color: black;\\n  position: relative;\\n  text-align: center;\\n  width: 300px;\\n  height: 250px;\\n  margin: auto;\\n  top: 10%;\\n  background-color: lightgreen; }\\n\\n.rHNJHZBWnAXsnnxlln1R3 {\\n  box-shadow: inset 0px -3px 7px 0px #29bbff;\\n  background: linear-gradient(to bottom, #2dabf9 5%, #0688fa 100%);\\n  background-color: #2dabf9;\\n  border-radius: 3px;\\n  border: 1px solid #0b0e07;\\n  display: inline-block;\\n  cursor: pointer;\\n  color: #ffffff;\\n  font-family: Arial;\\n  font-size: 15px;\\n  padding: 9px 23px;\\n  text-decoration: none;\\n  text-shadow: 0px 1px 0px #263666; }\\n  .rHNJHZBWnAXsnnxlln1R3:hover {\\n    background: linear-gradient(to bottom, #0688fa 5%, #2dabf9 100%);\\n    background-color: #0688fa; }\\n  .rHNJHZBWnAXsnnxlln1R3:active {\\n    position: relative;\\n    top: 1px; }\\n\\n._2YvXXQzVj_8UQ8mV2jzPR0 {\\n  float: right;\\n  margin: 5px;\\n  box-shadow: 0px 1px 0px 0px #fff6af;\\n  background: linear-gradient(to bottom, #ffec64 5%, #ffab23 100%);\\n  background-color: #ffec64;\\n  border-radius: 6px;\\n  border: 1px solid #ffaa22;\\n  display: inline-block;\\n  cursor: pointer;\\n  color: #333333;\\n  font-family: Arial;\\n  font-size: 15px;\\n  font-weight: bold;\\n  padding: 6px 24px;\\n  text-decoration: none;\\n  text-shadow: 0px 1px 0px #ffee66; }\\n  ._2YvXXQzVj_8UQ8mV2jzPR0:hover {\\n    background: linear-gradient(to bottom, #ffab23 5%, #ffec64 100%);\\n    background-color: #ffab23; }\\n  ._2YvXXQzVj_8UQ8mV2jzPR0:active {\\n    position: relative;\\n    top: 1px; }\\n\\n._2oSH4RGlYMgKnmTm9cK0JP {\\n  height: 40px;\\n  background-color: blue; }\\n\\n._2WxNFm2aWVhUuF-4Yk0lSk {\\n  position: absolute;\\n  margin-top: 20px;\\n  left: 45px; }\\n  ._2WxNFm2aWVhUuF-4Yk0lSk input {\\n    display: block;\\n    margin: auto;\\n    padding: 10px;\\n    margin: 5px; }\\n\", \"\"]);\n// Exports\nexports.locals = {\n\t\"container\": \"_1nbqN45NKpfctSEN9JpNAs\",\n\t\"formWrapper\": \"kUWjb-AdrNTFT1vVEpxJx\",\n\t\"submitButton\": \"rHNJHZBWnAXsnnxlln1R3\",\n\t\"registerButton\": \"_2YvXXQzVj_8UQ8mV2jzPR0\",\n\t\"header\": \"_2oSH4RGlYMgKnmTm9cK0JP\",\n\t\"form\": \"_2WxNFm2aWVhUuF-4Yk0lSk\"\n};\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/components/Auth.module.scss?./node_modules/css-loader/dist/cjs.js??ref--5-1!./node_modules/sass-loader/dist/cjs.js");

/***/ }),

/***/ "./src/components/Auth.jsx":
/*!*********************************!*\
  !*** ./src/components/Auth.jsx ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ \"./node_modules/@babel/runtime/helpers/slicedToArray.js\");\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./auth */ \"./src/components/auth.js\");\n/* harmony import */ var _Auth_module_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Auth.module.scss */ \"./src/components/Auth.module.scss\");\n/* harmony import */ var _Auth_module_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_Auth_module_scss__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\n/**\n *  Component to render if the user does not have the JWT token in the local storage.\n */\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (function () {\n  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_1__[\"useState\"])(\"\"),\n      _useState2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState, 2),\n      user = _useState2[0],\n      setUser = _useState2[1];\n\n  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_1__[\"useState\"])(\"\"),\n      _useState4 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState3, 2),\n      password = _useState4[0],\n      setPassword = _useState4[1]; // at first supposes the user is  already regitered and renders the login component\n\n\n  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_1__[\"useState\"])(true),\n      _useState6 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState5, 2),\n      registered = _useState6[0],\n      setRegistered = _useState6[1];\n\n  var render = function render(form) {\n    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n      id: \"header\",\n      className: _Auth_module_scss__WEBPACK_IMPORTED_MODULE_3___default.a.header\n    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"button\", {\n      className: _Auth_module_scss__WEBPACK_IMPORTED_MODULE_3___default.a.registerButton,\n      onClick: function onClick() {\n        setRegistered(false);\n        setUser(\"\");\n        setPassword(\"\");\n      }\n    }, \"Register\")), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n      className: _Auth_module_scss__WEBPACK_IMPORTED_MODULE_3___default.a.container\n    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n      className: _Auth_module_scss__WEBPACK_IMPORTED_MODULE_3___default.a.formWrapper\n    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n      className: _Auth_module_scss__WEBPACK_IMPORTED_MODULE_3___default.a.form\n    }, form))));\n  }; // renders the login component, and verifies if the user is authorized\n\n\n  var renderLogIn = function renderLogIn() {\n    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"h3\", null, \"Login\"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"form\", {\n      onSubmit: function onSubmit(e) {\n        e.preventDefault();\n        Object(_auth__WEBPACK_IMPORTED_MODULE_2__[\"authenticate\"])(user, password).then(function (auth) {\n          if (auth) {\n            window.location.reload();\n          }\n        });\n      }\n    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"input\", {\n      value: user,\n      placeholder: \"user\",\n      onChange: function onChange(e) {\n        return setUser(e.target.value);\n      }\n    }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"input\", {\n      value: password,\n      placeholder: \"password\",\n      type: \"password\",\n      onChange: function onChange(e) {\n        return setPassword(e.target.value);\n      }\n    }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"button\", {\n      className: _Auth_module_scss__WEBPACK_IMPORTED_MODULE_3___default.a.submitButton,\n      type: \"submit\"\n    }, \"Login\")));\n  }; // renders a register component if the user is not registered yet.\n\n\n  var renderRegister = function renderRegister() {\n    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"h3\", null, \"Register\"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"form\", {\n      onSubmit: function onSubmit(e) {\n        e.preventDefault();\n        Object(_auth__WEBPACK_IMPORTED_MODULE_2__[\"register\"])(user, password).then(function (res) {\n          return console.log(res);\n        });\n        setRegistered(true);\n        setUser(\"\");\n        setPassword(\"\");\n      }\n    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"input\", {\n      value: user,\n      placeholder: \"user\",\n      onChange: function onChange(e) {\n        return setUser(e.target.value);\n      }\n    })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"input\", {\n      value: password,\n      placeholder: \"password\",\n      type: \"password\",\n      onChange: function onChange(e) {\n        return setPassword(e.target.value);\n      }\n    })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"button\", {\n      className: _Auth_module_scss__WEBPACK_IMPORTED_MODULE_3___default.a.submitButton,\n      type: \"submit\"\n    }, \"Register\")));\n  }; // if the user is not logged in renders the login or the register component\n\n\n  var login_register = render(registered ? renderLogIn() : renderRegister());\n  return login_register;\n});\n\n//# sourceURL=webpack:///./src/components/Auth.jsx?");

/***/ }),

/***/ "./src/components/Auth.module.scss":
/*!*****************************************!*\
  !*** ./src/components/Auth.module.scss ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var api = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n            var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js??ref--5-1!../../node_modules/sass-loader/dist/cjs.js!./Auth.module.scss */ \"./node_modules/css-loader/dist/cjs.js?!./node_modules/sass-loader/dist/cjs.js!./src/components/Auth.module.scss\");\n\n            content = content.__esModule ? content.default : content;\n\n            if (typeof content === 'string') {\n              content = [[module.i, content, '']];\n            }\n\nvar options = {};\n\noptions.insert = \"head\";\noptions.singleton = false;\n\nvar update = api(content, options);\n\nvar exported = content.locals ? content.locals : {};\n\n\n\nmodule.exports = exported;\n\n//# sourceURL=webpack:///./src/components/Auth.module.scss?");

/***/ })

}]);