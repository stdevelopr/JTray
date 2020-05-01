(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ "./src/components/ConnectApp.jsx":
/*!***************************************!*\
  !*** ./src/components/ConnectApp.jsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var apollo_boost__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! apollo-boost */ \"./node_modules/apollo-boost/lib/bundle.esm.js\");\n/* harmony import */ var _apollo_react_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @apollo/react-hooks */ \"./node_modules/@apollo/react-hooks/lib/react-hooks.esm.js\");\n/* harmony import */ var apollo_cache_inmemory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! apollo-cache-inmemory */ \"./node_modules/apollo-cache-inmemory/lib/bundle.esm.js\");\n\n\n\n\nvar EnterContainer = react__WEBPACK_IMPORTED_MODULE_0___default.a.lazy(function () {\n  return Promise.all(/*! import() */[__webpack_require__.e(3), __webpack_require__.e(4)]).then(__webpack_require__.bind(null, /*! ./EnterContainer.jsx */ \"./src/components/EnterContainer.jsx\"));\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (_ref) {\n  var token = _ref.token;\n  var HOST_ADDRESS = location.protocol + \"//\" + location.host + location.pathname;\n  var cache = new apollo_cache_inmemory__WEBPACK_IMPORTED_MODULE_3__[\"InMemoryCache\"]({\n    // maps ids of objects to atualize the cache after mutations\n    dataIdFromObject: function dataIdFromObject(object) {\n      switch (object.__typename) {\n        case \"Tray\":\n        case \"AddCard\":\n        case \"DeleteCard\":\n        case \"AddTray\":\n        case \"SwapCard\":\n        case \"SwapTray\":\n        case \"User\":\n        case \"Card\":\n          return object.id;\n      }\n    }\n  });\n  cache.writeData({\n    data: {\n      mainPoll: null\n    }\n  }); // set the connection with the graphql server\n\n  var client = token ? new apollo_boost__WEBPACK_IMPORTED_MODULE_1__[\"default\"]({\n    cache: cache,\n    uri: \"\".concat(HOST_ADDRESS, \"graphql\"),\n    resolvers: {},\n    request: function request(operation) {\n      // data to be sent on every request\n      operation.setContext({\n        headers: {\n          authorization: \"Bearer \".concat(token)\n        }\n      });\n    }\n  }) : {};\n  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_2__[\"ApolloProvider\"], {\n    client: client\n  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0__[\"Suspense\"], {\n    fallback: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", null, \"Loding...\")\n  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(EnterContainer, {\n    token: token\n  })));\n});\n\n//# sourceURL=webpack:///./src/components/ConnectApp.jsx?");

/***/ })

}]);