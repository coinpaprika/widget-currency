(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var widgetsController = /*#__PURE__*/function () {
  function widgetsController() {
    _classCallCheck(this, widgetsController);
    this.widgets = new widgetsClass();
    this.bind();
  }
  _createClass(widgetsController, [{
    key: "bind",
    value: function bind() {
      var _this = this;
      window[this.widgets.defaults.objectName] = {};
      document.addEventListener('DOMContentLoaded', function () {
        return _this.initWidgets();
      }, false);
      window[this.widgets.defaults.objectName].bindWidget = function () {
        window[_this.widgets.defaults.objectName].init = false;
        _this.initWidgets();
      };
    }
  }, {
    key: "initWidgets",
    value: function initWidgets() {
      var _this2 = this;
      if (!window[this.widgets.defaults.objectName].init) {
        window[this.widgets.defaults.objectName].init = true;
        var mainElements = Array.prototype.slice.call(document.getElementsByClassName(this.widgets.defaults.className));
        this.widgets.setWidgetClass(mainElements);
        window.addEventListener('resize', function () {
          _this2.widgets.setWidgetClass(mainElements);
          for (var i = 0; i < mainElements.length; i++) {
            _this2.widgets.setBeforeElementInFooter(i);
          }
        }, false);
        var scriptElement = this.widgets.getScriptElement();
        if (scriptElement && scriptElement.dataset && scriptElement.dataset.cpCurrencyWidget) {
          var dataset = JSON.parse(scriptElement.dataset.cpCurrencyWidget);
          if (Object.keys(dataset)) {
            var keys = Object.keys(dataset);
            for (var j = 0; j < keys.length; j++) {
              var key = keys[j].replace('-', '_');
              this.widgets.defaults[key] = dataset[keys[j]];
            }
          }
        }
        setTimeout(function () {
          _this2.widgets.states = [];
          return cpBootstrap.loop(mainElements, function (element, index) {
            var newSettings = JSON.parse(JSON.stringify(_this2.widgets.defaults));
            newSettings.isWordpress = element.classList.contains('wordpress');
            newSettings.isNightMode = element.classList.contains('cp-widget__night-mode');
            newSettings.mainElement = element;
            _this2.widgets.states.push(newSettings);
            var promise = Promise.resolve();
            promise = promise.then(function () {
              var chartScripts = ['//code.highcharts.com/stock/highstock.js', '//code.highcharts.com/modules/exporting.js', '//code.highcharts.com/modules/no-data-to-display.js', '//highcharts.github.io/pattern-fill/pattern-fill-v2.js'];
              return newSettings.modules.indexOf('chart') > -1 && !window.Highcharts ? cpBootstrap.loop(chartScripts, function (link) {
                return fetchService.fetchScript(link);
              }) : null;
            });
            promise = promise.then(function () {
              return _this2.widgets.init(index);
            });
            return promise;
          });
        }, 50);
      }
    }
  }]);
  return widgetsController;
}();
var widgetsClass = /*#__PURE__*/function () {
  function widgetsClass() {
    _classCallCheck(this, widgetsClass);
    this.states = [];
    this.defaults = {
      objectName: 'cpCurrencyWidgets',
      className: 'coinpaprika-currency-widget',
      cssFileName: 'widget.min.css',
      currency: 'btc-bitcoin',
      primary_currency: 'USD',
      range_list: ['24h', '7d', '30d', '1q', '1y', 'ytd', 'all'],
      range: '7d',
      modules: ['market_details', 'chart'],
      update_active: false,
      update_timeout: '30s',
      language: 'en',
      style_src: null,
      img_src: null,
      lang_src: null,
      data_src: null,
      origin_src: 'https://unpkg.com/@coinpaprika/widget-currency@latest',
      show_details_currency: false,
      ticker: {
        name: undefined,
        symbol: undefined,
        price: undefined,
        price_change_24h: undefined,
        rank: undefined,
        price_ath: undefined,
        volume_24h: undefined,
        market_cap: undefined,
        percent_from_price_ath: undefined,
        volume_24h_change_24h: undefined,
        market_cap_change_24h: undefined
      },
      interval: null,
      isWordpress: false,
      isNightMode: false,
      isData: false,
      availableModules: ['price', 'chart', 'market_details'],
      message: 'data_loading',
      translations: {},
      mainElement: null,
      noTranslationLabels: [],
      scriptsDownloaded: {},
      chart: null,
      rwd: {
        xs: 280,
        s: 320,
        m: 370,
        l: 462
      }
    };
  }
  _createClass(widgetsClass, [{
    key: "init",
    value: function init(index) {
      var _this3 = this;
      if (!this.getMainElement(index)) {
        return console.error('Bind failed, no element with class = "' + this.defaults.className + '"');
      }
      var promise = Promise.resolve();
      promise = promise.then(function () {
        return _this3.getDefaults(index);
      });
      promise = promise.then(function () {
        return _this3.setOriginLink(index);
      });
      return promise;
    }
  }, {
    key: "setWidgetClass",
    value: function setWidgetClass(elements) {
      for (var i = 0; i < elements.length; i++) {
        var width = elements[i].getBoundingClientRect().width;
        var rwdKeys = Object.keys(this.defaults.rwd);
        for (var j = 0; j < rwdKeys.length; j++) {
          var rwdKey = rwdKeys[j];
          var rwdParam = this.defaults.rwd[rwdKey];
          var className = this.defaults.className + '__' + rwdKey;
          if (width <= rwdParam) elements[i].classList.add(className);
          if (width > rwdParam) elements[i].classList.remove(className);
        }
      }
    }
  }, {
    key: "getMainElement",
    value: function getMainElement(index) {
      return this.states[index] ? this.states[index].mainElement : null;
    }
  }, {
    key: "getDefaults",
    value: function getDefaults(index) {
      var _this4 = this;
      return new Promise(function (resolve) {
        var mainElement = _this4.getMainElement(index);
        if (mainElement && mainElement.dataset) {
          if (!mainElement.dataset.modules && mainElement.dataset.version === 'extended') _this4.updateData(index, 'modules', ['market_details']);
          if (!mainElement.dataset.modules && mainElement.dataset.version === 'standard') _this4.updateData(index, 'modules', []);
          if (mainElement.dataset.modules) _this4.updateData(index, 'modules', JSON.parse(mainElement.dataset.modules));
          if (mainElement.dataset.primaryCurrency) _this4.updateData(index, 'primary_currency', mainElement.dataset.primaryCurrency);
          if (mainElement.dataset.currency) _this4.updateData(index, 'currency', mainElement.dataset.currency);
          if (mainElement.dataset.range) _this4.updateData(index, 'range', mainElement.dataset.range);
          if (mainElement.dataset.showDetailsCurrency) _this4.updateData(index, 'show_details_currency', mainElement.dataset.showDetailsCurrency === 'true');
          if (mainElement.dataset.updateActive) _this4.updateData(index, 'update_active', mainElement.dataset.updateActive === 'true');
          if (mainElement.dataset.updateTimeout) _this4.updateData(index, 'update_timeout', cpBootstrap.parseIntervalValue(mainElement.dataset.updateTimeout));
          if (mainElement.dataset.language) _this4.updateData(index, 'language', mainElement.dataset.language);
          if (mainElement.dataset.originSrc) _this4.updateData(index, 'origin_src', mainElement.dataset.originSrc);
          if (mainElement.dataset.nodeModulesSrc) _this4.updateData(index, 'node_modules_src', mainElement.dataset.nodeModulesSrc);
          if (mainElement.dataset.bowerSrc) _this4.updateData(index, 'bower_src', mainElement.dataset.bowerSrc);
          if (mainElement.dataset.styleSrc) _this4.updateData(index, 'style_src', mainElement.dataset.styleSrc);
          if (mainElement.dataset.langSrc) _this4.updateData(index, 'logo_src', mainElement.dataset.langSrc);
          if (mainElement.dataset.imgSrc) _this4.updateData(index, 'logo_src', mainElement.dataset.imgSrc);
          return resolve();
        }
        return resolve();
      });
    }
  }, {
    key: "setOriginLink",
    value: function setOriginLink(index) {
      var _this5 = this;
      if (Object.keys(this.defaults.translations).length === 0) this.getTranslations(this.defaults.language);
      var promise = Promise.resolve();
      promise = promise.then(function () {
        return _this5.stylesheet();
      });
      promise = promise.then(function () {
        return _this5.addWidgetElement(index);
      });
      promise = promise.then(function () {
        return _this5.initInterval(index);
      });
      return promise;
    }
  }, {
    key: "addWidgetElement",
    value: function addWidgetElement(index) {
      var _this6 = this;
      var mainElement = this.getMainElement(index);
      var modules = '';
      var modulesArray = [];
      var chartContainer = null;
      var promise = Promise.resolve();
      promise = promise.then(function () {
        return cpBootstrap.loop(_this6.defaults.availableModules, function (module) {
          return _this6.states[index].modules.indexOf(module) > -1 ? modulesArray.push(module) : null;
        });
      });
      promise = promise.then(function () {
        return cpBootstrap.loop(modulesArray, function (module) {
          var label = null;
          if (module === 'chart') label = 'Chart';
          if (module === 'market_details') label = 'MarketDetails';
          return label ? _this6["widget".concat(label, "Element")](index).then(function (result) {
            return modules += result;
          }) : null;
        });
      });
      promise = promise.then(function () {
        return mainElement.innerHTML = _this6.widgetMainElement(index) + modules + _this6.widgetFooter(index);
      });
      promise = promise.then(function () {
        chartContainer = document.getElementById("".concat(_this6.defaults.className, "-price-chart-").concat(index));
        return chartContainer ? chartContainer.parentElement.insertAdjacentHTML('beforeend', _this6.widgetSelectElement(index, 'range')) : null;
      });
      promise = promise.then(function () {
        if (chartContainer) {
          _this6.states[index].chart = new chartClass(chartContainer, _this6.states[index]);
          _this6.setSelectListeners(index);
        }
        return null;
      });
      promise = promise.then(function () {
        return _this6.setBeforeElementInFooter(index);
      });
      promise = promise.then(function () {
        return _this6.getData(index);
      });
      return promise;
    }
  }, {
    key: "setSelectListeners",
    value: function setSelectListeners(index) {
      var _this7 = this;
      var mainElement = this.getMainElement(index);
      var selectElements = mainElement.querySelectorAll('.cp-widget-select');
      for (var i = 0; i < selectElements.length; i++) {
        var buttons = selectElements[i].querySelectorAll('.cp-widget-select__options button');
        for (var j = 0; j < buttons.length; j++) {
          buttons[j].addEventListener('click', function (event) {
            _this7.setSelectOption(event, index);
          }, false);
        }
      }
    }
  }, {
    key: "setSelectOption",
    value: function setSelectOption(event, index) {
      var className = 'cp-widget-active';
      for (var i = 0; i < event.target.parentNode.childNodes.length; i++) {
        var sibling = event.target.parentNode.childNodes[i];
        if (sibling.classList.contains(className)) sibling.classList.remove(className);
      }
      var parent = event.target.closest('.cp-widget-select');
      var type = parent.dataset.type;
      var pickedValueElement = parent.querySelector('.cp-widget-select__options > span');
      var value = event.target.dataset.option;
      pickedValueElement.innerText = this.getTranslation(index, value.toLowerCase());
      this.updateData(index, type, value);
      event.target.classList.add(className);
      this.dispatchEvent(index, '-switch-range', value);
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(index, name, data) {
      var id = "".concat(this.defaults.className, "-price-chart-").concat(index);
      return document.dispatchEvent(new CustomEvent("".concat(id).concat(name), {
        detail: {
          data: data
        }
      }));
    }
  }, {
    key: "getData",
    value: function getData(index) {
      var _this8 = this;
      var url = 'https://api.coinpaprika.com/v1/widget/' + this.states[index].currency + '?quote=' + this.states[index].primary_currency;
      return fetchService.fetchData(url).then(function (response) {
        return response.json().then(function (result) {
          if (!_this8.states[index].isData) _this8.updateData(index, 'isData', true);
          _this8.updateTicker(index, result);
        });
      })["catch"](function (error) {
        return _this8.onErrorRequest(index, error);
      });
    }
  }, {
    key: "onErrorRequest",
    value: function onErrorRequest(index, xhr) {
      if (this.states[index].isData) this.updateData(index, 'isData', false);
      this.updateData(index, 'message', 'data_unavailable');
      console.error('Request failed.  Returned status of ' + xhr, this.states[index]);
    }
  }, {
    key: "initInterval",
    value: function initInterval(index) {
      var _this9 = this;
      clearInterval(this.states[index].interval);
      if (this.states[index].update_active && this.states[index].update_timeout > 1000) {
        this.states[index].interval = setInterval(function () {
          _this9.getData(index);
        }, this.states[index].update_timeout);
      }
    }
  }, {
    key: "setBeforeElementInFooter",
    value: function setBeforeElementInFooter(index) {
      if (!this.states[index].isWordpress) {
        var mainElement = this.getMainElement(index);
        if (mainElement) {
          if (mainElement.children[0].localName === 'style') {
            mainElement.removeChild(mainElement.childNodes[0]);
          }
          var footerElement = mainElement.querySelector('.cp-widget__footer');
          var value = footerElement.getBoundingClientRect().width - 43;
          for (var i = 0; i < footerElement.childNodes.length; i++) {
            value -= footerElement.childNodes[i].getBoundingClientRect().width;
          }
          var style = document.createElement('style');
          style.innerHTML = '.cp-widget__footer--' + index + '::before{width:' + value.toFixed(0) + 'px;}';
          mainElement.insertBefore(style, mainElement.children[0]);
        }
      }
    }
  }, {
    key: "updateWidgetElement",
    value: function updateWidgetElement(index, key, value, ticker) {
      var _this10 = this;
      var state = this.states[index];
      var mainElement = this.getMainElement(index);
      if (mainElement) {
        var tickerClass = ticker ? 'Ticker' : '';
        if (key === 'name' || key === 'currency') {
          if (key === 'currency') {
            var aElements = mainElement.querySelectorAll('.cp-widget__footer > a');
            for (var k = 0; k < aElements.length; k++) {
              aElements[k].href = this.coin_link(value);
            }
          }
          this.getImage(index);
        }
        if (key === 'isData' || key === 'message') {
          var headerElements = mainElement.querySelectorAll('.cp-widget__main');
          for (var _k = 0; _k < headerElements.length; _k++) {
            headerElements[_k].innerHTML = !state.isData ? this.widgetMainElementMessage(index) : this.widgetMainElementData(index);
          }
        } else {
          var updateElements = mainElement.querySelectorAll('.' + key + tickerClass);
          var _loop = function _loop() {
            var updateElement = updateElements[j];
            if (updateElement.classList.contains('cp-widget__rank')) {
              var className = parseFloat(value) > 0 ? "cp-widget__rank-up" : parseFloat(value) < 0 ? "cp-widget__rank-down" : "cp-widget__rank-neutral";
              updateElement.classList.remove('cp-widget__rank-down');
              updateElement.classList.remove('cp-widget__rank-up');
              updateElement.classList.remove('cp-widget__rank-neutral');
              if (value === undefined) {
                value = cpBootstrap.emptyData;
              } else {
                updateElement.classList.add(className);
                value = key === 'price_change_24h' ? '(' + cpBootstrap.round(value, 2) + '%)' : cpBootstrap.round(value, 2) + '%';
              }
            }
            if (updateElement.classList.contains('showDetailsCurrency') && !state.show_details_currency) {
              value = ' ';
            }
            if (updateElement.classList.contains('parseNumber')) {
              var origin = _this10.defaults.data_src || _this10.defaults.origin_src;
              var promise = Promise.resolve();
              promise = promise.then(function () {
                return cpBootstrap.parseCurrencyNumber(value, state.primary_currency, origin);
              });
              promise = promise.then(function (result) {
                return updateElement.innerText = result || cpBootstrap.emptyData;
              });
              return {
                v: promise
              };
            } else {
              updateElement.innerText = value || cpBootstrap.emptyData;
            }
          };
          for (var j = 0; j < updateElements.length; j++) {
            var _ret = _loop();
            if (_typeof(_ret) === "object") return _ret.v;
          }
        }
      }
    }
  }, {
    key: "updateData",
    value: function updateData(index, key, value, ticker) {
      if (ticker) {
        this.states[index].ticker[key] = value;
      } else {
        this.states[index][key] = value;
      }
      if (key === 'language') {
        this.getTranslations(value);
      }
      this.updateWidgetElement(index, key, value, ticker);
    }
  }, {
    key: "updateWidgetTranslations",
    value: function updateWidgetTranslations(lang, data) {
      var _this11 = this;
      this.defaults.translations[lang] = data;
      var _loop2 = function _loop2(x) {
        var isNoTranslationLabelsUpdate = _this11.states[x].noTranslationLabels.length > 0 && lang === 'en';
        if (_this11.states[x].language === lang || isNoTranslationLabelsUpdate) {
          var mainElement = _this11.states[x].mainElement;
          var transalteElements = Array.prototype.slice.call(mainElement.querySelectorAll('.cp-translation'));
          var _loop3 = function _loop3(y) {
            transalteElements[y].classList.forEach(function (className) {
              if (className.search('translation_') > -1) {
                var translateKey = className.replace('translation_', '');
                if (translateKey === 'message') translateKey = _this11.states[x].message;
                var labelIndex = _this11.states[x].noTranslationLabels.indexOf(translateKey);
                var text = _this11.getTranslation(x, translateKey);
                if (labelIndex > -1 && text) {
                  _this11.states[x].noTranslationLabels.splice(labelIndex, 1);
                }
                transalteElements[y].innerText = text;
                if (transalteElements[y].closest('.cp-widget__footer')) {
                  setTimeout(function () {
                    return _this11.setBeforeElementInFooter(x);
                  }, 50);
                }
              }
            });
          };
          for (var y = 0; y < transalteElements.length; y++) {
            _loop3(y);
          }
        }
      };
      for (var x = 0; x < this.states.length; x++) {
        _loop2(x);
      }
    }
  }, {
    key: "updateTicker",
    value: function updateTicker(index, data) {
      var dataKeys = Object.keys(data);
      for (var i = 0; i < dataKeys.length; i++) {
        this.updateData(index, dataKeys[i], data[dataKeys[i]], true);
      }
    }
  }, {
    key: "stylesheet",
    value: function stylesheet() {
      if (this.defaults.style_src !== false) {
        var url = this.defaults.style_src || this.defaults.origin_src + '/dist/' + this.defaults.cssFileName;
        if (!document.body.querySelector('link[href="' + url + '"]')) {
          return fetchService.fetchStyle(url);
        }
        return Promise.resolve();
      }
      return Promise.resolve();
    }
  }, {
    key: "widgetMainElement",
    value: function widgetMainElement(index) {
      var data = this.states[index];
      return '<div class="cp-widget__header">' + '<div class="' + 'cp-widget__img cp-widget__img-' + data.currency + '">' + '<img/>' + '</div>' + '<div class="cp-widget__main">' + (data.isData ? this.widgetMainElementData(index) : this.widgetMainElementMessage(index)) + '</div>' + '</div>';
    }
  }, {
    key: "widgetMainElementData",
    value: function widgetMainElementData(index) {
      var data = this.states[index];
      return '<h3><a href="' + this.coin_link(data.currency) + '">' + '<span class="nameTicker">' + (data.ticker.name || cpBootstrap.emptyData) + '</span>' + '<span class="symbolTicker">' + (data.ticker.symbol || cpBootstrap.emptyData) + '</span>' + '</a></h3>' + '<strong>' + '<span class="priceTicker parseNumber">' + (cpBootstrap.parseNumber(data.ticker.price) || cpBootstrap.emptyData) + '</span> ' + '<span class="primaryCurrency">' + data.primary_currency + ' </span>' + '<span class="price_change_24hTicker cp-widget__rank cp-widget__rank-' + (data.ticker.price_change_24h > 0 ? "up" : data.ticker.price_change_24h < 0 ? "down" : "neutral") + '">(' + (cpBootstrap.round(data.ticker.price_change_24h, 2) || cpBootstrap.emptyValue) + '%)</span>' + '</strong>' + '<span class="cp-widget__rank-label"><span class="cp-translation translation_rank">' + this.getTranslation(index, "rank") + '</span> <span class="rankTicker">' + (data.ticker.rank || cpBootstrap.emptyData) + '</span></span>';
    }
  }, {
    key: "widgetMainElementMessage",
    value: function widgetMainElementMessage(index) {
      var message = this.states[index].message;
      return '<div class="cp-widget__main-no-data cp-translation translation_message">' + this.getTranslation(index, message) + '</div>';
    }
  }, {
    key: "widgetMarketDetailsElement",
    value: function widgetMarketDetailsElement(index) {
      return Promise.resolve(this.states[index].modules.indexOf('market_details') > -1 ? '<div class="cp-widget__details">' + this.widgetAthElement(index) + this.widgetVolume24hElement(index) + this.widgetMarketCapElement(index) + '</div>' : '');
    }
  }, {
    key: "widgetAthElement",
    value: function widgetAthElement(index) {
      return '<div>' + '<small class="cp-translation translation_ath">' + this.getTranslation(index, "ath") + '</small>' + '<div>' + '<span class="price_athTicker parseNumber">' + cpBootstrap.emptyData + ' </span>' + '<span class="symbolTicker showDetailsCurrency"></span>' + '</div>' + '<span class="percent_from_price_athTicker cp-widget__rank">' + cpBootstrap.emptyData + '</span>' + '</div>';
    }
  }, {
    key: "widgetVolume24hElement",
    value: function widgetVolume24hElement(index) {
      return '<div>' + '<small class="cp-translation translation_volume_24h">' + this.getTranslation(index, "volume_24h") + '</small>' + '<div>' + '<span class="volume_24hTicker parseNumber">' + cpBootstrap.emptyData + ' </span>' + '<span class="symbolTicker showDetailsCurrency"></span>' + '</div>' + '<span class="volume_24h_change_24hTicker cp-widget__rank">' + cpBootstrap.emptyData + '</span>' + '</div>';
    }
  }, {
    key: "widgetMarketCapElement",
    value: function widgetMarketCapElement(index) {
      return '<div>' + '<small class="cp-translation translation_market_cap">' + this.getTranslation(index, "market_cap") + '</small>' + '<div>' + '<span class="market_capTicker parseNumber">' + cpBootstrap.emptyData + ' </span>' + '<span class="symbolTicker showDetailsCurrency"></span>' + '</div>' + '<span class="market_cap_change_24hTicker cp-widget__rank">' + cpBootstrap.emptyData + '</span>' + '</div>';
    }
  }, {
    key: "widgetChartElement",
    value: function widgetChartElement(index) {
      return Promise.resolve("<div class=\"cp-widget__chart\"><div id=\"".concat(this.defaults.className, "-price-chart-").concat(index, "\"></div></div>"));
    }
  }, {
    key: "widgetSelectElement",
    value: function widgetSelectElement(index, label) {
      var buttons = '';
      for (var i = 0; i < this.states[index][label + '_list'].length; i++) {
        var data = this.states[index][label + '_list'][i];
        buttons += '<button class="' + (data.toLowerCase() === this.states[index][label].toLowerCase() ? 'cp-widget-active ' : '') + (label === 'primary_currency' ? '' : 'cp-translation translation_' + data.toLowerCase()) + '" data-option="' + data + '">' + this.getTranslation(index, data.toLowerCase()) + '</button>';
      }
      if (label === 'range') ;
      var title = this.getTranslation(index, "zoom_in");
      return '<div data-type="' + label + '" class="cp-widget-select">' + '<label class="cp-translation translation_' + label + '">' + title + '</label>' + '<div class="cp-widget-select__options">' + '<span class="arrow-down ' + 'cp-widget__capitalize cp-translation translation_' + this.states[index][label].toLowerCase() + '">' + this.getTranslation(index, this.states[index][label].toLowerCase()) + '</span>' + '<div class="cp-widget-select__dropdown">' + buttons + '</div>' + '</div>' + '</div>';
    }
  }, {
    key: "widgetFooter",
    value: function widgetFooter(index) {
      var currency = this.states[index].currency;
      return !this.states[index].isWordpress ? '<p class="cp-widget__footer cp-widget__footer--' + index + '">' + '<span class="cp-translation translation_powered_by">' + this.getTranslation(index, "powered_by") + ' </span>' + '<img style="width: 16px" src="' + this.main_logo_link() + '" alt=""/>' + '<a target="_blank" href="' + this.coin_link(currency) + '">coinpaprika.com</a>' + '</p>' : '';
    }
  }, {
    key: "getImage",
    value: function getImage(index) {
      var _this12 = this;
      var data = this.states[index];
      var imgContainers = data.mainElement.getElementsByClassName('cp-widget__img');
      var _loop4 = function _loop4() {
        var imgContainer = imgContainers[i];
        imgContainer.classList.add('cp-widget__img--hidden');
        var img = imgContainer.querySelector('img');
        var newImg = new Image();
        newImg.onload = function () {
          img.src = newImg.src;
          imgContainer.classList.remove('cp-widget__img--hidden');
        };
        newImg.src = _this12.img_src(data.currency);
      };
      for (var i = 0; i < imgContainers.length; i++) {
        _loop4();
      }
    }
  }, {
    key: "img_src",
    value: function img_src(id) {
      return 'https://coinpaprika.com/coin/' + id + '/logo.png';
    }
  }, {
    key: "coin_link",
    value: function coin_link(id) {
      return 'https://coinpaprika.com/coin/' + id;
    }
  }, {
    key: "main_logo_link",
    value: function main_logo_link() {
      return this.defaults.img_src || this.defaults.origin_src + '/dist/img/logo_widget.svg';
    }
  }, {
    key: "getScriptElement",
    value: function getScriptElement() {
      return document.querySelector('script[data-cp-currency-widget]');
    }
  }, {
    key: "getTranslation",
    value: function getTranslation(index, label) {
      var text = this.defaults.translations[this.states[index].language] ? this.defaults.translations[this.states[index].language][label] : null;
      if (!text && this.defaults.translations['en']) {
        text = this.defaults.translations['en'][label];
      }
      if (!text) {
        return this.addLabelWithoutTranslation(index, label);
      } else {
        return text;
      }
    }
  }, {
    key: "addLabelWithoutTranslation",
    value: function addLabelWithoutTranslation(index, label) {
      if (!this.defaults.translations['en']) this.getTranslations('en');
      return this.states[index].noTranslationLabels.push(label);
    }
  }, {
    key: "getTranslations",
    value: function getTranslations(lang) {
      var _this13 = this;
      if (!this.defaults.translations[lang]) {
        var url = this.defaults.lang_src || this.defaults.origin_src + '/dist/lang/' + lang + '.json';
        this.defaults.translations[lang] = {};
        return fetchService.fetchJsonFile(url, true).then(function (response) {
          if (response) {
            _this13.updateWidgetTranslations(lang, response);
          } else {
            _this13.onErrorRequest(0, url + response);
            _this13.getTranslations('en');
            delete _this13.defaults.translations[lang];
          }
        });
      }
    }
  }]);
  return widgetsClass;
}();
var chartClass = /*#__PURE__*/function () {
  function chartClass(container, state) {
    var _this14 = this;
    _classCallCheck(this, chartClass);
    if (!container) return;
    this.id = container.id;
    this.isNightMode = state.isNightMode;
    this.chartsWithActiveSeriesCookies = [];
    this.chart = null;
    this.currency = state.currency;
    this.container = container;
    this.options = this.setOptions();
    this.defaultRange = state.range || '7d';
    this.callback = null;
    this.replaceCallback = null;
    this.extremesDataUrl = this.getExtremesDataUrl(container.id);
    this.defaultOptions = {
      chart: {
        alignTicks: false,
        marginTop: 50,
        style: {
          fontFamily: 'sans-serif'
        },
        events: {
          render: function render(e) {
            if (e.target.annotations) {
              var chart = e.target.annotations.chart;
              cpBootstrap.loop(chart.annotations.allItems, function (annotation) {
                var y = chart.plotHeight + chart.plotTop - chart.spacing[0] - 2 - (_this14.isResponsiveModeActive(chart) ? 10 : 0);
                annotation.update({
                  y: y
                }, true);
              });
            }
          }
        }
      },
      scrollbar: {
        enabled: false
      },
      annotationsOptions: {
        enabledButtons: false
      },
      rangeSelector: {
        enabled: false
      },
      plotOptions: {
        line: {
          series: {
            states: {
              hover: {
                enabled: false
              }
            }
          }
        },
        series: {
          events: {
            legendItemClick: function legendItemClick(event) {
              if (event.browserEvent.isTrusted) {
                if (_this14.chartsWithActiveSeriesCookies.indexOf(event.target.chart.renderTo.id) > -1) _this14.setVisibleChartCookies(event);
              }
              // On iOS touch event fires second callback from JS (isTrusted: false) which
              // results with toggle back the chart (probably its a problem with UIKit, but not sure)
              // console.log('legendItemClick', {event, isTrusted: event.browserEvent.isTrusted});
              return event.browserEvent.isTrusted;
            }
          }
        }
      },
      xAxis: {
        ordinal: false
      }
    };
    this.chartDataParser = function (data) {
      return new Promise(function (resolve) {
        data = data[0];
        var priceCurrency = state.primary_currency.toLowerCase();
        return resolve({
          data: {
            price: data.price ? data.price : data[priceCurrency] ? data[priceCurrency] : [],
            volume: data.volume || []
          }
        });
      });
    };
    this.isEventsHidden = false;
    this.excludeSeriesIds = [];
    this.asyncUrl = "/currency/data/".concat(state.currency, "/_range_/");
    this.asyncParams = "?quote=".concat(state.primary_currency.toUpperCase(), "&fields=price,volume");
    this.init();
  }
  _createClass(chartClass, [{
    key: "setOptions",
    value: function setOptions() {
      var chartService = new chartClass();
      return {
        responsive: {
          rules: [{
            condition: {
              maxWidth: 1500
            },
            chartOptions: {
              legend: {
                align: 'right',
                verticalAlign: 'middle',
                y: 92,
                symbolRadius: 0,
                itemDistance: 20,
                itemStyle: {
                  fontSize: 10
                }
              },
              chart: {
                height: 400,
                marginTop: 35,
                marginBottom: 0,
                spacingTop: 0,
                spacingBottom: 0
              },
              navigator: {
                height: 50,
                margin: 70,
                handles: {
                  height: 25,
                  width: 17
                }
              }
            }
          }, {
            condition: {
              maxWidth: 600
            },
            chartOptions: {
              chart: {
                marginTop: 0,
                zoomType: "none",
                marginLeft: 10,
                marginRight: 10,
                height: 350
              },
              yAxis: [{
                floor: 0,
                tickAmount: 7,
                tickWidth: 0,
                tickLength: 0,
                lineWidth: 0,
                title: {
                  enabled: false
                },
                labels: {
                  align: "left",
                  x: 1,
                  y: -2,
                  style: {
                    color: '#9e9e9e',
                    fontSize: '9px'
                  }
                }
              }, {
                floor: 0,
                tickAmount: 7,
                tickWidth: 0,
                tickLength: 0,
                lineWidth: 0,
                title: {
                  enabled: false
                },
                labels: {
                  align: "right",
                  overflow: "justify",
                  x: 1,
                  y: -2,
                  style: {
                    color: '#5085ec',
                    fontSize: '9px'
                  }
                }
              }]
            }
          }, {
            condition: {
              maxWidth: 450
            },
            chartOptions: {
              legend: {
                align: 'right',
                verticalAlign: 'middle',
                y: 82,
                symbolRadius: 0,
                itemDistance: 20,
                itemStyle: {
                  fontSize: 10
                }
              },
              navigator: {
                margin: 60,
                height: 40,
                handles: {
                  height: 20
                }
              },
              chart: {
                height: 300
              },
              yAxis: [{
                floor: 0,
                tickAmount: 7,
                tickWidth: 0,
                tickLength: 0,
                lineWidth: 0,
                title: {
                  enabled: false
                },
                labels: {
                  align: "left",
                  x: 1,
                  y: -2,
                  style: {
                    color: '#9e9e9e',
                    fontSize: '9px'
                  }
                }
              }, {
                floor: 0,
                tickAmount: 7,
                tickWidth: 0,
                tickLength: 0,
                lineWidth: 0,
                title: {
                  enabled: false
                },
                labels: {
                  align: "right",
                  overflow: "justify",
                  x: 1,
                  y: -2,
                  style: {
                    color: '#5085ec',
                    fontSize: '9px'
                  }
                }
              }]
            }
          }]
        },
        title: {
          text: undefined
        },
        chart: {
          backgroundColor: 'none',
          marginTop: 50,
          plotBorderWidth: 0
        },
        cpEvents: false,
        colors: ['#5085ec', '#1f9809', '#985d65', '#ee983b', '#4c4c4c'],
        legend: {
          margin: 0,
          enabled: true,
          align: 'right',
          symbolRadius: 0,
          itemDistance: 40,
          itemStyle: {
            fontWeight: 'normal',
            color: this.isNightMode ? '#80a6e5' : '#0645ad'
          },
          itemMarginTop: 8
        },
        navigator: true,
        tooltip: {
          shared: true,
          split: false,
          animation: false,
          borderWidth: 1,
          borderColor: this.isNightMode ? '#4c4c4c' : '#e3e3e3',
          hideDelay: 100,
          shadow: false,
          backgroundColor: '#ffffff',
          style: {
            color: '#4c4c4c',
            fontSize: '10px'
          },
          useHTML: true,
          formatter: function formatter() {
            return chartService.tooltipFormatter(this);
          }
        },
        exporting: {
          buttons: {
            contextButton: {
              enabled: false
            }
          }
        },
        xAxis: {
          lineColor: this.isNightMode ? '#505050' : '#e3e3e3',
          tickColor: this.isNightMode ? '#505050' : '#e3e3e3',
          tickLength: 7
        },
        yAxis: [{
          // Volume yAxis
          lineWidth: 1,
          lineColor: '#dedede',
          tickWidth: 1,
          tickLength: 4,
          gridLineDashStyle: 'dash',
          gridLineWidth: 0,
          floor: 0,
          minPadding: 0,
          opposite: false,
          showEmpty: false,
          showLastLabel: false,
          showFirstLabel: false
        }, {
          gridLineColor: this.isNightMode ? '#505050' : '#e3e3e3',
          gridLineDashStyle: 'dash',
          lineWidth: 1,
          tickWidth: 1,
          tickLength: 4,
          floor: 0,
          minPadding: 0,
          showEmpty: false,
          opposite: true,
          gridZIndex: 4,
          showLastLabel: false,
          showFirstLabel: false
        }],
        series: [{
          //order of the series matters
          color: '#5085ec',
          name: 'Price',
          id: 'price',
          data: [],
          type: 'area',
          fillOpacity: 0.15,
          lineWidth: 2,
          yAxis: 1,
          zIndex: 2,
          visible: true,
          clickable: true,
          threshold: null,
          tooltip: {
            valueDecimals: 0
          },
          showInNavigator: true,
          showInLegend: false
        }, {
          color: "url(#fill-pattern".concat(this.isNightMode ? '-night' : '', ")"),
          name: 'Volume',
          id: 'volume',
          data: [],
          type: 'area',
          fillOpacity: 0.5,
          lineWidth: 0,
          yAxis: 0,
          zIndex: 0,
          visible: true,
          clickable: true,
          threshold: null,
          tooltip: {
            valueDecimals: 0
          },
          showInNavigator: true
        }]
      };
    }
  }, {
    key: "init",
    value: function init() {
      var _this15 = this;
      var promise = Promise.resolve();
      promise = promise.then(function () {
        return _this15.parseOptions(_this15.options);
      });
      promise = promise.then(function (options) {
        return window.Highcharts ? Highcharts.stockChart(_this15.container.id, options, function (chart) {
          return _this15.bind(chart);
        }) : null;
      });
      return promise;
    }
  }, {
    key: "parseOptions",
    value: function parseOptions(options) {
      var _this16 = this;
      var promise = Promise.resolve();
      promise = promise.then(function () {
        return cpBootstrap.updateObject(_this16.defaultOptions, options);
      });
      promise = promise.then(function (newOptions) {
        return cpBootstrap.updateObject(_this16.getVolumePattern(), newOptions);
      });
      promise = promise.then(function (newOptions) {
        return _this16.setNavigator(newOptions);
      });
      promise = promise.then(function (newOptions) {
        return newOptions.noData ? _this16.setNoDataLabel(newOptions) : newOptions;
      });
      promise = promise.then(function (newOptions) {
        return newOptions;
      });
      return promise;
    }
  }, {
    key: "bind",
    value: function bind(chart) {
      var _this17 = this;
      var promise = Promise.resolve();
      promise = promise.then(function () {
        return _this17.chart = chart;
      });
      promise = promise.then(function () {
        return _this17.fetchDataPackage();
      });
      promise = promise.then(function () {
        return _this17.setRangeSwitcher();
      });
      promise = promise.then(function () {
        return _this17.callback ? _this17.callback(_this17.chart, _this17.defaultRange) : null;
      });
      return promise;
    }
  }, {
    key: "fetchDataPackage",
    value: function fetchDataPackage(minDate, maxDate) {
      var _this18 = this;
      var isPreciseRange = minDate && maxDate;
      var promise = Promise.resolve();
      promise = promise.then(function () {
        if (_this18.options.cpEvents) {
          var url = isPreciseRange ? _this18.getNavigatorExtremesUrl(minDate, maxDate, 'events') : _this18.getExtremesDataUrl(_this18.id, 'events') + '/' + _this18.getRange() + '/';
          return url ? _this18.fetchData(url, 'events', !isPreciseRange) : null;
        }
        return null;
      });
      promise = promise.then(function () {
        var url = (isPreciseRange ? _this18.getNavigatorExtremesUrl(minDate, maxDate) : _this18.asyncUrl.replace('_range_', _this18.getRange())) + _this18.asyncParams;
        return url ? _this18.fetchData(url, 'data', !isPreciseRange) : null;
      });
      promise = promise.then(function () {
        return _this18.chart.redraw(false);
      });
      promise = promise.then(function () {
        return !isPreciseRange ? _this18.chart.zoomOut() : null;
      });
      promise = promise.then(function () {
        return _this18.isLoaded = true;
      });
      promise = promise.then(function () {
        return _this18.toggleEvents();
      });
      return promise;
    }
  }, {
    key: "fetchData",
    value: function fetchData(url) {
      var _this19 = this;
      var dataType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'data';
      var replace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var promise = Promise.resolve();
      promise = promise.then(function () {
        _this19.chart.showLoading();
        return fetchService.fetchChartData(url, !_this19.isLoaded);
      });
      promise = promise.then(function (response) {
        _this19.chart.hideLoading();
        if (response.status !== 200) {
          return console.log("Looks like there was a problem. Status Code: ".concat(response.status));
        }
        return response.json().then(function (data) {
          var promise = Promise.resolve();
          promise = promise.then(function () {
            return _this19.dataParser(data, dataType);
          });
          promise = promise.then(function (content) {
            return replace ? _this19.replaceData(content.data, dataType) : _this19.updateData(content.data, dataType);
          });
          return promise;
        });
      })["catch"](function (error) {
        _this19.chart.hideLoading();
        _this19.hideChart();
        return console.log('Fetch Error', error);
      });
      return promise;
    }
  }, {
    key: "hideChart",
    value: function hideChart() {
      var _this20 = this;
      var bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var classFunc = bool ? 'add' : 'remove';
      var siblings = cpBootstrap.nodeListToArray(this.container.parentElement.childNodes);
      var promise = Promise.resolve();
      promise = promise.then(function () {
        return siblings.filter(function (element) {
          return element.id.search('chart') === -1;
        });
      });
      promise = promise.then(function (result) {
        return cpBootstrap.loop(result, function (element) {
          return element.classList[classFunc]('cp-hidden');
        });
      });
      promise = promise.then(function () {
        return _this20.container.parentElement.classList[classFunc]('cp-chart-no-data');
      });
      return promise;
    }
  }, {
    key: "setRangeSwitcher",
    value: function setRangeSwitcher() {
      var _this21 = this;
      document.addEventListener("".concat(this.id, "-switch-range"), function (event) {
        _this21.defaultRange = event.detail.data;
        return _this21.fetchDataPackage();
      });
    }
  }, {
    key: "getRange",
    value: function getRange() {
      return this.defaultRange || '1q';
    }
  }, {
    key: "toggleEvents",
    value: function toggleEvents() {
      var _this22 = this;
      var promise = Promise.resolve();
      if (this.options.cpEvents) {
        promise = promise.then(function () {
          return document.getElementsByClassName('highcharts-annotation');
        });
        promise = promise.then(function (elements) {
          return cpBootstrap.loop(elements, function (element) {
            if (_this22.isEventsHidden) {
              return !element.classList.contains('highcharts-annotation__hidden') ? element.classList.add('highcharts-annotation__hidden') : null;
            }
            return element.classList.contains('highcharts-annotation__hidden') ? element.classList.remove('highcharts-annotation__hidden') : null;
          });
        });
        promise = promise.then(function () {
          return document.getElementsByClassName('highcharts-plot-line');
        });
        promise = promise.then(function (elements) {
          return cpBootstrap.loop(elements, function (element) {
            if (_this22.isEventsHidden) {
              return !element.classList.contains('highcharts-plot-line__hidden') ? element.classList.add('highcharts-plot-line__hidden') : null;
            }
            return element.classList.contains('highcharts-plot-line__hidden') ? element.classList.remove('highcharts-plot-line__hidden') : null;
          });
        });
      }
      return promise;
    }
  }, {
    key: "dataParser",
    value: function dataParser(data) {
      var _this23 = this;
      var dataType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'data';
      switch (dataType) {
        case 'data':
          var promiseData = Promise.resolve();
          promiseData = promiseData.then(function () {
            return _this23.chartDataParser ? _this23.chartDataParser(data) : {
              data: data[0]
            };
          });
          return promiseData;
        case 'events':
          return Promise.resolve(data);
        default:
          return null;
      }
    }
  }, {
    key: "updateData",
    value: function updateData(data, dataType) {
      var _this24 = this;
      var newData;
      var promise = Promise.resolve();
      promise = promise.then(function () {
        switch (dataType) {
          case 'data':
            newData = {};
            return cpBootstrap.loop(Object.entries(data), function (value) {
              if (_this24.isExcluded(value[0])) return;
              var oldData = _this24.getOldData(dataType)[value[0]];
              newData[value[0]] = oldData.filter(function (element) {
                return value[1].findIndex(function (findElement) {
                  return _this24.isTheSameElement(element, findElement, dataType);
                }) === -1;
              }).concat(value[1]).sort(function (data1, data2) {
                return _this24.sortCondition(data1, data2, dataType);
              });
            });
          case 'events':
            newData = [];
            var oldData = _this24.getOldData(dataType);
            return newData = oldData.filter(function (element) {
              data.findIndex(function (findElement) {
                return _this24.isTheSameElement(element, findElement, dataType);
              }) === -1;
            }).concat(data).sort(function (data1, data2) {
              return _this24.sortCondition(data1, data2, dataType);
            });
          default:
            return false;
        }
      });
      promise = promise.then(function () {
        return _this24.replaceData(newData, dataType);
      });
      return promise;
    }
  }, {
    key: "isTheSameElement",
    value: function isTheSameElement(elementA, elementB, dataType) {
      switch (dataType) {
        case 'data':
          return elementA[0] === elementB[0];
        case 'events':
          return elementA.ts === elementB.ts;
        default:
          return false;
      }
    }
  }, {
    key: "sortCondition",
    value: function sortCondition(elementA, elementB, dataType) {
      switch (dataType) {
        case 'data':
          return elementA[0] - elementB[0];
        case 'events':
          return elementA.ts - elementB.ts;
        default:
          return false;
      }
    }
  }, {
    key: "getOldData",
    value: function getOldData(dataType) {
      return this['chart_' + dataType.toLowerCase()];
    }
  }, {
    key: "replaceData",
    value: function replaceData(data, dataType) {
      var _this25 = this;
      var promise = Promise.resolve();
      promise = promise.then(function () {
        return _this25['chart_' + dataType.toLowerCase()] = data;
      });
      promise = promise.then(function () {
        return _this25.replaceDataType(data, dataType);
      });
      promise = promise.then(function () {
        return _this25.replaceCallback ? _this25.replaceCallback(_this25.chart, data, _this25.isLoaded, dataType) : null;
      });
      return promise;
    }
  }, {
    key: "replaceDataType",
    value: function replaceDataType(data, dataType) {
      var _this26 = this;
      switch (dataType) {
        case 'data':
          if (this.asyncUrl) {
            cpBootstrap.loop(['btc-bitcoin', 'eth-ethereum'], function (coinName) {
              var coinShort = coinName.split('-')[0];
              if (_this26.asyncUrl.search(coinName) > -1 && data[coinShort]) {
                data[coinShort] = [];
                cpBootstrap.loop(_this26.chart.series, function (series) {
                  if (series.userOptions.id === coinShort) series.update({
                    visible: false
                  });
                });
              }
            });
          }
          return cpBootstrap.loop(Object.entries(data), function (value) {
            if (_this26.isExcluded(value[0])) return;
            return _this26.chart.get(value[0]) ? _this26.chart.get(value[0]).setData(value[1], false, false, false) : _this26.chart.addSeries({
              id: value[0],
              data: value[1],
              showInNavigator: true
            });
          });
        case 'events':
          var promise = Promise.resolve();
          promise = promise.then(function () {
            return cpBootstrap.loop(_this26.chart.annotations.allItems, function (annotation) {
              return annotation.destroy();
            });
          });
          promise = promise.then(function () {
            return _this26.setAnnotationsObjects(data);
          });
          return promise;
        default:
          return null;
      }
    }
  }, {
    key: "isExcluded",
    value: function isExcluded(label) {
      return this.excludeSeriesIds.indexOf(label) > -1;
    }
  }, {
    key: "tooltipFormatter",
    value: function tooltipFormatter(pointer) {
      var label = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var search = arguments.length > 2 ? arguments[2] : undefined;
      if (!search) search = label;
      var header = '<div class="cp-chart-tooltip-currency"><small>' + new Date(pointer.x).toUTCString() + '</small><table>';
      var footer = '</table></div>';
      var content = '';
      pointer.points.forEach(function (point) {
        content += '<tr>' + '<td class="cp-chart-tooltip-currency__row">' + '<svg class="cp-chart-tooltip-currency__icon" width="5" height="5"><rect x="0" y="0" width="5" height="5" fill="' + point.series.color + '" fill-opacity="1"></rect></svg>' + point.series.name + ': ' + point.y.toLocaleString('ru-RU', {
          maximumFractionDigits: 8
        }).replace(',', '.') + ' ' + (point.series.name.toLowerCase().search(search.toLowerCase()) > -1 ? "" : label) + '</td>' + '</tr>';
      });
      return header + content + footer;
    }
  }, {
    key: "setAnnotationsObjects",
    value: function setAnnotationsObjects(data) {
      var _this27 = this;
      this.chart.series[0].xAxis.removePlotLine();
      var plotLines = [];
      var promise = Promise.resolve();
      promise = promise.then(function () {
        return data.sort(function (data1, data2) {
          return data2.ts - data1.ts;
        });
      });
      promise = promise.then(function () {
        return cpBootstrap.loop(data, function (element) {
          var promise = Promise.resolve();
          promise = promise.then(function () {
            return plotLines.push({
              width: 1,
              value: element.ts,
              dashStyle: 'solid',
              zIndex: 4,
              color: _this27.getEventTagParams().color
            });
          });
          promise = promise.then(function () {
            return _this27.chart.addAnnotation({
              xValue: element.ts,
              y: 0,
              title: "<span title=\"Click to open\" class=\"cp-chart-annotation__text\">".concat(_this27.getEventTagParams(element.tag).label, "</span><span class=\"cp-chart-annotation__dataElement\" style=\"display: none;\">").concat(JSON.stringify(element), "</span>"),
              shape: {
                type: 'circle',
                params: {
                  r: 11,
                  cx: 9,
                  cy: 10.5,
                  'stroke-width': 1.5,
                  fill: _this27.getEventTagParams().color
                }
              },
              events: {
                mouseover: function mouseover(event) {
                  if (MobileDetect.isMobile()) return;
                  var data = _this27.getEventDataFromAnnotationEvent(event);
                  _this27.openEventContainer(data, event);
                },
                mouseout: function mouseout() {
                  if (MobileDetect.isMobile()) return;
                  _this27.closeEventContainer(event);
                },
                click: function click(event) {
                  var data = _this27.getEventDataFromAnnotationEvent(event);
                  if (MobileDetect.isMobile()) {
                    _this27.openEventContainer(data, event);
                  } else {
                    _this27.openEventPage(data);
                  }
                }
              }
            });
          });
          return promise;
        });
      });
      promise = promise.then(function () {
        return _this27.chart.series[0].xAxis.update({
          plotLines: plotLines
        }, false);
      });
      return promise;
    }
  }, {
    key: "setNavigator",
    value: function setNavigator(options) {
      var _this28 = this;
      var navigatorOptions = {};
      var promise = Promise.resolve();
      promise = promise.then(function () {
        if (options.navigator === true) {
          navigatorOptions = {
            navigator: {
              enable: true,
              margin: 20,
              series: {
                lineWidth: 1
              },
              maskFill: 'rgba(102,133,194,0.15)'
            },
            chart: {
              zoomType: 'x'
            },
            xAxis: {
              events: {
                setExtremes: function setExtremes(e) {
                  if ((e.trigger === 'navigator' || e.trigger === 'zoom') && e.min && e.max) {
                    document.dispatchEvent(new CustomEvent(_this28.id + 'SetExtremes', {
                      detail: {
                        minDate: e.min,
                        maxDate: e.max,
                        e: e
                      }
                    }));
                  }
                }
              }
            }
          };
          _this28.navigatorExtremesListener();
          _this28.setResetZoomButton();
        } else if (!options.navigator) {
          navigatorOptions = {
            navigator: {
              enabled: false
            }
          };
        }
        return cpBootstrap.updateObject(options, navigatorOptions);
      });
      return promise;
    }
  }, {
    key: "setResetZoomButton",
    value: function setResetZoomButton() {
      var _this29 = this;
      // return Promise.resolve(); // cant be positioned properly in plotBox, so its disabled
      var promise = Promise.resolve();
      promise = promise.then(function () {
        return _this29.addContainer(_this29.id, 'ResetZoom', 'cp-chart-reset-zoom', 'button');
      });
      promise = promise.then(function () {
        return _this29.getContainer('ResetZoom');
      });
      promise = promise.then(function (element) {
        element.classList.add('uk-button');
        element.innerText = 'Reset zoom';
        return element.addEventListener('click', function () {
          _this29.chart.zoomOut();
        });
      });
      return promise;
    }
  }, {
    key: "navigatorExtremesListener",
    value: function navigatorExtremesListener() {
      var _this30 = this;
      var promise = Promise.resolve();
      promise = promise.then(function () {
        return document.addEventListener(_this30.id + 'SetExtremes', function (e) {
          var minDate = cpBootstrap.round(e.detail.minDate / 1000, 0);
          var maxDate = cpBootstrap.round(e.detail.maxDate / 1000, 0);
          var promise = Promise.resolve();
          promise = promise.then(function () {
            return _this30.fetchDataPackage(minDate, maxDate);
          });
          return promise;
        });
      });
      return promise;
    }
  }, {
    key: "getNavigatorExtremesUrl",
    value: function getNavigatorExtremesUrl(minDate, maxDate, dataType) {
      var extremesDataUrl = dataType ? this.getExtremesDataUrl(this.id, dataType) : this.extremesDataUrl;
      return minDate && maxDate && extremesDataUrl ? extremesDataUrl + '/dates/' + minDate + '/' + maxDate + '/' : null;
    }
  }, {
    key: "setNoDataLabel",
    value: function setNoDataLabel(options) {
      var noDataOptions = {};
      var promise = Promise.resolve();
      promise = promise.then(function () {
        noDataOptions = {
          lang: {
            noData: 'We don\'t have data for this time period'
          },
          noData: {
            style: {
              fontFamily: 'Arial',
              fontSize: '14px',
              color: '#000000'
            }
          }
        };
        return cpBootstrap.updateObject(options, noDataOptions);
      });
      return promise;
    }
  }, {
    key: "addContainer",
    value: function addContainer(id, label, className) {
      var tagName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'div';
      var container = document.createElement(tagName);
      var chartContainer = document.getElementById(id);
      container.id = id + label;
      container.classList.add(className);
      chartContainer.appendChild(container);
    }
  }, {
    key: "getContainer",
    value: function getContainer(label) {
      return document.getElementById(this.id + label);
    }
  }, {
    key: "getExtremesDataUrl",
    value: function getExtremesDataUrl(id) {
      var dataType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'data';
      return '/currency/' + dataType + '/' + this.currency;
    }
  }, {
    key: "getVolumePattern",
    value: function getVolumePattern() {
      return {
        defs: {
          patterns: [{
            'id': 'fill-pattern',
            'path': {
              d: 'M 3 0 L 3 10 M 8 0 L 8 10',
              stroke: "#e3e3e3",
              fill: '#f1f1f1',
              strokeWidth: 2
            }
          }, {
            'id': 'fill-pattern-night',
            'path': {
              d: 'M 3 0 L 3 10 M 8 0 L 8 10',
              stroke: "#9b9b9b",
              fill: '#383838',
              strokeWidth: 2
            }
          }]
        }
      };
    }
  }]);
  return chartClass;
}();
var bootstrapClass = /*#__PURE__*/function () {
  function bootstrapClass() {
    _classCallCheck(this, bootstrapClass);
    this.emptyValue = 0;
    this.emptyData = '-';
  }
  _createClass(bootstrapClass, [{
    key: "nodeListToArray",
    value: function nodeListToArray(nodeList) {
      return Array.prototype.slice.call(nodeList);
    }
  }, {
    key: "parseIntervalValue",
    value: function parseIntervalValue(value) {
      var timeSymbol = '',
        multiplier = 1;
      if (value.search('s') > -1) {
        timeSymbol = 's';
        multiplier = 1000;
      }
      if (value.search('m') > -1) {
        timeSymbol = 'm';
        multiplier = 60 * 1000;
      }
      if (value.search('h') > -1) {
        timeSymbol = 'h';
        multiplier = 60 * 60 * 1000;
      }
      if (value.search('d') > -1) {
        timeSymbol = 'd';
        multiplier = 24 * 60 * 60 * 1000;
      }
      return parseFloat(value.replace(timeSymbol, '')) * multiplier;
    }
  }, {
    key: "isFiat",
    value: function isFiat(currency, origin) {
      if (!origin) Promise.resolve(false);
      var promise = Promise.resolve();
      promise = promise.then(function () {
        var url = origin + '/dist/data/currencies.json';
        return fetchService.fetchJsonFile(url, true);
      });
      promise = promise.then(function (result) {
        return result[currency.toUpperCase()];
      });
      return promise;
    }
  }, {
    key: "updateObject",
    value: function updateObject(obj, newObj) {
      var _this31 = this;
      var result = obj;
      var promise = Promise.resolve();
      promise = promise.then(function () {
        return cpBootstrap.loop(Object.keys(newObj), function (key) {
          if (result.hasOwnProperty(key) && _typeof(result[key]) === 'object') {
            return _this31.updateObject(result[key], newObj[key]).then(function (updateResult) {
              result[key] = updateResult;
            });
          }
          return result[key] = newObj[key];
        });
      });
      promise = promise.then(function () {
        return result;
      });
      return promise;
    }
  }, {
    key: "parseCurrencyNumber",
    value: function parseCurrencyNumber(value, currency, origin) {
      var _this32 = this;
      var promise = Promise.resolve();
      promise = promise.then(function () {
        return _this32.isFiat(currency, origin);
      });
      promise = promise.then(function (result) {
        return result ? _this32.parseNumber(value, 2) : _this32.parseNumber(value);
      });
      return promise;
    }
  }, {
    key: "parseNumber",
    value: function parseNumber(number, precision) {
      if (!number && number !== 0) return number;
      if (number === this.emptyValue || number === this.emptyData) return number;
      number = parseFloat(number);
      if (number > 100000) {
        var numberStr = number.toFixed(0);
        var parameter = 'K',
          spliced = numberStr.slice(0, numberStr.length - 1);
        if (number > 1000000000) {
          spliced = numberStr.slice(0, numberStr.length - 7);
          parameter = 'B';
        } else if (number > 1000000) {
          spliced = numberStr.slice(0, numberStr.length - 4);
          parameter = 'M';
        }
        var natural = spliced.slice(0, spliced.length - 2);
        var decimal = spliced.slice(spliced.length - 2);
        return natural + '.' + decimal + ' ' + parameter;
      } else {
        var isDecimal = number % 1 > 0;
        if (isDecimal) {
          if (!precision || number < 0.01) {
            precision = 2;
            if (number < 1) {
              precision = 8;
            } else if (number < 10) {
              precision = 6;
            } else if (number < 1000) {
              precision = 4;
            }
          }
          return this.round(number, precision).toLocaleString('ru-RU', {
            maximumFractionDigits: precision
          }).replace(',', '.');
        } else {
          return number.toLocaleString('ru-RU', {
            minimumFractionDigits: 2
          }).replace(',', '.');
        }
      }
    }
  }, {
    key: "round",
    value: function round(amount) {
      var decimal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
      var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'round';
      amount = parseFloat(amount);
      decimal = Math.pow(10, decimal);
      return Math[direction](amount * decimal) / decimal;
    }
  }, {
    key: "loop",
    value: function loop(arr, fn, busy, err) {
      var _this33 = this;
      var i = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var body = function body(ok, er) {
        try {
          var r = fn(arr[i], i, arr);
          r && r.then ? r.then(ok)["catch"](er) : ok(r);
        } catch (e) {
          er(e);
        }
      };
      var next = function next(ok, er) {
        return function () {
          return _this33.loop(arr, fn, ok, er, ++i);
        };
      };
      var run = function run(ok, er) {
        return i < arr.length ? new Promise(body).then(next(ok, er))["catch"](er) : ok();
      };
      return busy ? run(busy, err) : new Promise(run);
    }
  }]);
  return bootstrapClass;
}();
var fetchClass = /*#__PURE__*/function () {
  function fetchClass() {
    _classCallCheck(this, fetchClass);
    this.state = {};
  }
  _createClass(fetchClass, [{
    key: "fetchScript",
    value: function fetchScript(url) {
      var _this34 = this;
      if (this.state[url]) return Promise.resolve(null);
      this.state[url] = 'pending';
      return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        document.body.appendChild(script);
        script.addEventListener('load', function () {
          if (_this34.state) _this34.state[url] = 'downloaded';
          resolve();
        });
        script.addEventListener('error', function () {
          if (_this34.state) delete _this34.state[url];
          reject(new Error("Failed to load image's URL: ".concat(url)));
        });
        script.async = true;
        script.src = url;
      });
    }
  }, {
    key: "fetchStyle",
    value: function fetchStyle(url) {
      var _this35 = this;
      if (this.state[url]) return Promise.resolve(null);
      this.state[url] = 'pending';
      return new Promise(function (resolve, reject) {
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        document.body.appendChild(link);
        link.setAttribute('href', url);
        link.addEventListener('load', function () {
          if (_this35.state) _this35.state[url] = 'downloaded';
          resolve();
        });
        link.addEventListener('error', function () {
          if (_this35.state) delete _this35.state[url];
          reject(new Error("Failed to load style URL: ".concat(url)));
        });
        link.href = url;
      });
    }
  }, {
    key: "fetchChartData",
    value: function fetchChartData(uri) {
      var fromState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var url = 'https://graphs.coinpaprika.com' + uri;
      return this.fetchData(url, fromState);
    }
  }, {
    key: "fetchData",
    value: function fetchData(url) {
      var _this36 = this;
      var fromState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var promise = Promise.resolve();
      promise = promise.then(function () {
        if (fromState) {
          if (_this36.state[url] === 'pending') {
            var promiseTimeout = new Promise(function (resolve, reject) {
              setTimeout(function () {
                resolve(_this36.fetchData(url, fromState));
              }, 100);
            });
            return promiseTimeout;
          }
          if (!!_this36.state[url]) {
            return Promise.resolve(_this36.state[url].clone());
          }
        }
        _this36.state[url] = 'pending';
        var promiseFetch = Promise.resolve();
        promiseFetch = promiseFetch.then(function () {
          return fetch(url);
        });
        promiseFetch = promiseFetch.then(function (response) {
          _this36.state[url] = response;
          return response.clone();
        });
        return promiseFetch;
      });
      return promise;
    }
  }, {
    key: "fetchJsonFile",
    value: function fetchJsonFile(url) {
      var fromState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return this.fetchData(url, fromState).then(function (result) {
        if (result.status === 200) {
          return result.json();
        }
        return false;
      })["catch"](function () {
        return false;
      });
    }
  }]);
  return fetchClass;
}();
var widgets = new widgetsController();
var cpBootstrap = new bootstrapClass();
var fetchService = new fetchClass();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7SUNBTSxpQkFBaUI7RUFDckIsU0FBQSxrQkFBQSxFQUFjO0lBQUEsZUFBQSxPQUFBLGlCQUFBO0lBQ1osSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLFlBQVksRUFBRTtJQUNqQyxJQUFJLENBQUMsSUFBSSxFQUFFO0VBQ2I7RUFBQyxZQUFBLENBQUEsaUJBQUE7SUFBQSxHQUFBO0lBQUEsS0FBQSxFQUVELFNBQUEsS0FBQSxFQUFNO01BQUEsSUFBQSxLQUFBO01BQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUM3QyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUU7UUFBQSxPQUFNLEtBQUksQ0FBQyxXQUFXLEVBQUU7TUFBQSxHQUFFLEtBQUssQ0FBQztNQUM5RSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxHQUFHLFlBQU07UUFDMUQsTUFBTSxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksR0FBRyxLQUFLO1FBQ3JELEtBQUksQ0FBQyxXQUFXLEVBQUU7TUFDcEIsQ0FBQztJQUNIO0VBQUM7SUFBQSxHQUFBO0lBQUEsS0FBQSxFQUVELFNBQUEsWUFBQSxFQUFhO01BQUEsSUFBQSxNQUFBO01BQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUM7UUFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJO1FBQ3BELElBQUks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QUFLLEdBQUcsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBUztNQUFBLElBQUEsT0FBQTtNQUFBLElBQVAsQ0FBQyxHQUFBLFNBQUEsQ0FBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLE1BQUcsQ0FBQztNQUM1QixJQUFNLElBQUksR0FBRyxTQUFQLElBQUksQ0FBSSxFQUFFLEVBQUUsRUFBRSxFQUFLO1FBQ3ZCLElBQUk7VUFDRixJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUM7VUFDNUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUNELE9BQU8sQ0FBQyxFQUFFO1VBQ1IsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNQO01BQ0YsQ0FBQztNQUNELElBQU0sSUFBSSxHQUFHLFNBQVAsSUFBSSxDQUFJLEVBQUUsRUFBRSxFQUFFO1FBQUEsT0FBSztVQUFBLE9BQU0sT0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFBQTtNQUFBO01BQzlELElBQU0sR0FBRyxHQUFHLFNBQU4sR0FBRyxDQUFJLEVBQUUsRUFBRSxFQUFFO1FBQUEsT0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO01BQUE7TUFDOUYsT0FBTyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUM7SUFDakQ7RUFBQztFQUFBLE9BQUEsY0FBQTtBQUFBO0FBQUEsSUFHRyxVQUFVO0VBQ2QsU0FBQSxXQUFBLEVBQWE7SUFBQSxlQUFBLE9BQUEsVUFBQTtJQUNYLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0VBQ2pCO0VBQUMsWUFBQSxDQUFBLFVBQUE7SUFBQSxHQUFBO0lBQUEsS0FBQSxFQUVELFNBQUEsWUFBWSxHQUFHLEVBQUU7TUFBQSxJQUFBLE9BQUE7TUFDZixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztNQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVM7TUFDM0IsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7UUFDdEMsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7UUFDL0MsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsWUFBTTtVQUNwQyxJQUFJLE9BQUksQ0FBQyxLQUFLLEVBQUUsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxZQUFZO1VBQzlDLE9BQU8sRUFBRTtRQUNYLENBQUMsQ0FBQztRQUNGLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBTTtVQUNyQyxJQUFJLE9BQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxPQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztVQUN0QyxNQUFNLENBQUMsSUFBSSxLQUFLLGdDQUFBLE1BQUEsQ0FBZ0MsR0FBRyxFQUFHLENBQUM7UUFDekQsQ0FBQyxDQUFDO1FBQ0YsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJO1FBQ25CLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRztNQUNsQixDQUFDLENBQUM7SUFDSjtFQUFDO0lBQUEsR0FBQTtJQUFBLEtBQUEsRUFFRCxTQUFBLFdBQVcsR0FBRyxFQUFFO01BQUEsSUFBQSxPQUFBO01BQ2QsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7TUFDakQsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTO01BQzNCLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO1FBQ3RDLElBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO1FBQzNDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQztRQUN0QyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7UUFDL0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO1FBQzlCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsWUFBTTtVQUNsQyxJQUFJLE9BQUksQ0FBQyxLQUFLLEVBQUUsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxZQUFZO1VBQzlDLE9BQU8sRUFBRTtRQUNYLENBQUMsQ0FBQztRQUNGLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBTTtVQUNuQyxJQUFJLE9BQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxPQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztVQUN0QyxNQUFNLENBQUMsSUFBSSxLQUFLLDhCQUFBLE1BQUEsQ0FBOEIsR0FBRyxFQUFHLENBQUM7UUFDdkQsQ0FBQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHO01BQ2pCLENBQUMsQ0FBQztJQUNKO0VBQUM7SUFBQSxHQUFBO0lBQUEsS0FBQSxFQUVELFNBQUEsZUFBZSxHQUFHLEVBQW9CO01BQUEsSUFBbEIsU0FBUyxHQUFBLFNBQUEsQ0FBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLE1BQUcsS0FBSztNQUNuQyxJQUFNLEdBQUcsR0FBRyxnQ0FBZ0MsR0FBRyxHQUFHO01BQ2xELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDO0lBQ3ZDO0VBQUM7SUFBQSxHQUFBO0lBQUEsS0FBQSxFQUVELFNBQUEsVUFBVSxHQUFHLEVBQW9CO01BQUEsSUFBQSxPQUFBO01BQUEsSUFBbEIsU0FBUyxHQUFBLFNBQUEsQ0FBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLE1BQUcsS0FBSztNQUM5QixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFO01BQy9CLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQU07UUFDM0IsSUFBSSxTQUFTLEVBQUM7VUFDWixJQUFJLE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUyxFQUFDO1lBQ2hDLElBQUksY0FBYyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztjQUNwRCxVQUFVLENBQUMsWUFBTTtnQkFDZixPQUFPLENBQUMsT0FBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7Y0FDekMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztZQUNULENBQUMsQ0FBQztZQUNGLE9BQU8sY0FBYztVQUN2QjtVQUNBLElBQUksQ0FBQyxDQUFDLE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUM7WUFDcEIsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7VUFDakQ7UUFDRjtRQUNBLE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUztRQUMzQixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFO1FBQ3BDLFlBQVksR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLFlBQU07VUFDckMsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQ25CLENBQUMsQ0FBQztRQUNGLFlBQVksR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQUMsUUFBUSxFQUFLO1VBQzdDLE9BQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUTtVQUMxQixPQUFPLFFBQVEsQ0FBQyxLQUFLLEVBQUU7UUFDekIsQ0FBQyxDQUFDO1FBQ0YsT0FBTyxZQUFZO01BQ3JCLENBQUMsQ0FBQztNQUNGLE9BQU8sT0FBTztJQUNoQjtFQUFDO0lBQUEsR0FBQTtJQUFBLEtBQUEsRUFFRCxTQUFBLGNBQWMsR0FBRyxFQUFvQjtNQUFBLElBQWxCLFNBQVMsR0FBQSxTQUFBLENBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQSxTQUFBLEdBQUEsU0FBQSxNQUFHLEtBQUs7TUFDbEMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNLEVBQUk7UUFDbkQsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtVQUN6QixPQUFPLE1BQU0sQ0FBQyxJQUFJLEVBQUU7UUFDdEI7UUFDQSxPQUFPLEtBQUs7TUFDZCxDQUFDLENBQUMsU0FBTSxDQUFDLFlBQU07UUFDYixPQUFPLEtBQUs7TUFDZCxDQUFDLENBQUM7SUFDSjtFQUFDO0VBQUEsT0FBQSxVQUFBO0FBQUE7QUFHSCxJQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFpQixFQUFFO0FBQ3ZDLElBQU0sV0FBVyxHQUFHLElBQUksY0FBYyxFQUFFO0FBQ3hDLElBQU0sWUFBWSxHQUFHLElBQUksVUFBVSxFQUFFIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY2xhc3Mgd2lkZ2V0c0NvbnRyb2xsZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLndpZGdldHMgPSBuZXcgd2lkZ2V0c0NsYXNzKCk7XG4gICAgdGhpcy5iaW5kKCk7XG4gIH1cbiAgXG4gIGJpbmQoKXtcbiAgICB3aW5kb3dbdGhpcy53aWRnZXRzLmRlZmF1bHRzLm9iamVjdE5hbWVdID0ge307XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHRoaXMuaW5pdFdpZGdldHMoKSwgZmFsc2UpO1xuICAgIHdpbmRvd1t0aGlzLndpZGdldHMuZGVmYXVsdHMub2JqZWN0TmFtZV0uYmluZFdpZGdldCA9ICgpID0+IHtcbiAgICAgIHdpbmRvd1t0aGlzLndpZGdldHMuZGVmYXVsdHMub2JqZWN0TmFtZV0uaW5pdCA9IGZhbHNlO1xuICAgICAgdGhpcy5pbml0V2lkZ2V0cygpO1xuICAgIH07XG4gIH1cbiAgXG4gIGluaXRXaWRnZXRzKCl7XG4gICAgaWYgKCF3aW5kb3dbdGhpcy53aWRnZXRzLmRlZmF1bHRzLm9iamVjdE5hbWVdLmluaXQpe1xuICAgICAgd2luZG93W3RoaXMud2lkZ2V0cy5kZWZhdWx0cy5vYmplY3ROYW1lXS5pbml0ID0gdHJ1ZTtcbiAgICAgIGxldCBtYWluRWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMud2lkZ2V0cy5kZWZhdWx0cy5jbGFzc05hbWUpKTtcbiAgICAgIHRoaXMud2lkZ2V0cy5zZXRXaWRnZXRDbGFzcyhtYWluRWxlbWVudHMpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgICAgdGhpcy53aWRnZXRzLnNldFdpZGdldENsYXNzKG1haW5FbGVtZW50cyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFpbkVsZW1lbnRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICB0aGlzLndpZGdldHMuc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKGkpO1xuICAgICAgICB9XG4gICAgICB9LCBmYWxzZSk7XG4gICAgICBsZXQgc2NyaXB0RWxlbWVudCA9IHRoaXMud2lkZ2V0cy5nZXRTY3JpcHRFbGVtZW50KCk7XG4gICAgICBpZiAoc2NyaXB0RWxlbWVudCAmJiBzY3JpcHRFbGVtZW50LmRhdGFzZXQgJiYgc2NyaXB0RWxlbWVudC5kYXRhc2V0LmNwQ3VycmVuY3lXaWRnZXQpe1xuICAgICAgICBsZXQgZGF0YXNldCA9IEpTT04ucGFyc2Uoc2NyaXB0RWxlbWVudC5kYXRhc2V0LmNwQ3VycmVuY3lXaWRnZXQpO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoZGF0YXNldCkpe1xuICAgICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMoZGF0YXNldCk7XG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBrZXlzLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICAgIGxldCBrZXkgPSBrZXlzW2pdLnJlcGxhY2UoJy0nLCAnXycpO1xuICAgICAgICAgICAgdGhpcy53aWRnZXRzLmRlZmF1bHRzW2tleV0gPSBkYXRhc2V0W2tleXNbal1dO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMud2lkZ2V0cy5zdGF0ZXMgPSBbXTtcbiAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AobWFpbkVsZW1lbnRzLCAoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgICBsZXQgbmV3U2V0dGluZ3MgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMud2lkZ2V0cy5kZWZhdWx0cykpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLmlzV29yZHByZXNzID0gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3dvcmRwcmVzcycpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLmlzTmlnaHRNb2RlID0gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NwLXdpZGdldF9fbmlnaHQtbW9kZScpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLm1haW5FbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgICB0aGlzLndpZGdldHMuc3RhdGVzLnB1c2gobmV3U2V0dGluZ3MpO1xuICAgICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBsZXQgY2hhcnRTY3JpcHRzID0gW1xuICAgICAgICAgICAgICAnLy9jb2RlLmhpZ2hjaGFydHMuY29tL3N0b2NrL2hpZ2hzdG9jay5qcycsXG4gICAgICAgICAgICAgICcvL2NvZGUuaGlnaGNoYXJ0cy5jb20vbW9kdWxlcy9leHBvcnRpbmcuanMnLFxuICAgICAgICAgICAgICAnLy9jb2RlLmhpZ2hjaGFydHMuY29tL21vZHVsZXMvbm8tZGF0YS10by1kaXNwbGF5LmpzJyxcbiAgICAgICAgICAgICAgJy8vaGlnaGNoYXJ0cy5naXRodWIuaW8vcGF0dGVybi1maWxsL3BhdHRlcm4tZmlsbC12Mi5qcycsXG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgcmV0dXJuIChuZXdTZXR0aW5ncy5tb2R1bGVzLmluZGV4T2YoJ2NoYXJ0JykgPiAtMSAmJiAhd2luZG93LkhpZ2hjaGFydHMpXG4gICAgICAgICAgICAgID8gY3BCb290c3RyYXAubG9vcChjaGFydFNjcmlwdHMsIGxpbmsgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZldGNoU2VydmljZS5mZXRjaFNjcmlwdChsaW5rKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICA6IG51bGw7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53aWRnZXRzLmluaXQoaW5kZXgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9KTtcbiAgICAgIH0sIDUwKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3Mgd2lkZ2V0c0NsYXNzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zdGF0ZXMgPSBbXTtcbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgb2JqZWN0TmFtZTogJ2NwQ3VycmVuY3lXaWRnZXRzJyxcbiAgICAgIGNsYXNzTmFtZTogJ2NvaW5wYXByaWthLWN1cnJlbmN5LXdpZGdldCcsXG4gICAgICBjc3NGaWxlTmFtZTogJ3dpZGdldC5taW4uY3NzJyxcbiAgICAgIGN1cnJlbmN5OiAnYnRjLWJpdGNvaW4nLFxuICAgICAgcHJpbWFyeV9jdXJyZW5jeTogJ1VTRCcsXG4gICAgICByYW5nZV9saXN0OiBbJzI0aCcsICc3ZCcsICczMGQnLCAnMXEnLCAnMXknLCAneXRkJywgJ2FsbCddLFxuICAgICAgcmFuZ2U6ICc3ZCcsXG4gICAgICBtb2R1bGVzOiBbJ21hcmtldF9kZXRhaWxzJywgJ2NoYXJ0J10sXG4gICAgICB1cGRhdGVfYWN0aXZlOiBmYWxzZSxcbiAgICAgIHVwZGF0ZV90aW1lb3V0OiAnMzBzJyxcbiAgICAgIGxhbmd1YWdlOiAnZW4nLFxuICAgICAgc3R5bGVfc3JjOiBudWxsLFxuICAgICAgaW1nX3NyYzogbnVsbCxcbiAgICAgIGxhbmdfc3JjOiBudWxsLFxuICAgICAgZGF0YV9zcmM6IG51bGwsXG4gICAgICBvcmlnaW5fc3JjOiAnaHR0cHM6Ly91bnBrZy5jb20vQGNvaW5wYXByaWthL3dpZGdldC1jdXJyZW5jeUBsYXRlc3QnLFxuICAgICAgc2hvd19kZXRhaWxzX2N1cnJlbmN5OiBmYWxzZSxcbiAgICAgIHRpY2tlcjoge1xuICAgICAgICBuYW1lOiB1bmRlZmluZWQsXG4gICAgICAgIHN5bWJvbDogdW5kZWZpbmVkLFxuICAgICAgICBwcmljZTogdW5kZWZpbmVkLFxuICAgICAgICBwcmljZV9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgICAgIHJhbms6IHVuZGVmaW5lZCxcbiAgICAgICAgcHJpY2VfYXRoOiB1bmRlZmluZWQsXG4gICAgICAgIHZvbHVtZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgICAgbWFya2V0X2NhcDogdW5kZWZpbmVkLFxuICAgICAgICBwZXJjZW50X2Zyb21fcHJpY2VfYXRoOiB1bmRlZmluZWQsXG4gICAgICAgIHZvbHVtZV8yNGhfY2hhbmdlXzI0aDogdW5kZWZpbmVkLFxuICAgICAgICBtYXJrZXRfY2FwX2NoYW5nZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgICBpbnRlcnZhbDogbnVsbCxcbiAgICAgIGlzV29yZHByZXNzOiBmYWxzZSxcbiAgICAgIGlzTmlnaHRNb2RlOiBmYWxzZSxcbiAgICAgIGlzRGF0YTogZmFsc2UsXG4gICAgICBhdmFpbGFibGVNb2R1bGVzOiBbJ3ByaWNlJywgJ2NoYXJ0JywgJ21hcmtldF9kZXRhaWxzJ10sXG4gICAgICBtZXNzYWdlOiAnZGF0YV9sb2FkaW5nJyxcbiAgICAgIHRyYW5zbGF0aW9uczoge30sXG4gICAgICBtYWluRWxlbWVudDogbnVsbCxcbiAgICAgIG5vVHJhbnNsYXRpb25MYWJlbHM6IFtdLFxuICAgICAgc2NyaXB0c0Rvd25sb2FkZWQ6IHt9LFxuICAgICAgY2hhcnQ6IG51bGwsXG4gICAgICByd2Q6IHtcbiAgICAgICAgeHM6IDI4MCxcbiAgICAgICAgczogMzIwLFxuICAgICAgICBtOiAzNzAsXG4gICAgICAgIGw6IDQ2MixcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuICBcbiAgaW5pdChpbmRleCkge1xuICAgIGlmICghdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCkpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKCdCaW5kIGZhaWxlZCwgbm8gZWxlbWVudCB3aXRoIGNsYXNzID0gXCInICsgdGhpcy5kZWZhdWx0cy5jbGFzc05hbWUgKyAnXCInKTtcbiAgICB9XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdldERlZmF1bHRzKGluZGV4KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnNldE9yaWdpbkxpbmsoaW5kZXgpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBzZXRXaWRnZXRDbGFzcyhlbGVtZW50cykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCB3aWR0aCA9IGVsZW1lbnRzW2ldLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgbGV0IHJ3ZEtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmRlZmF1bHRzLnJ3ZCk7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHJ3ZEtleXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgbGV0IHJ3ZEtleSA9IHJ3ZEtleXNbal07XG4gICAgICAgIGxldCByd2RQYXJhbSA9IHRoaXMuZGVmYXVsdHMucndkW3J3ZEtleV07XG4gICAgICAgIGxldCBjbGFzc05hbWUgPSB0aGlzLmRlZmF1bHRzLmNsYXNzTmFtZSArICdfXycgKyByd2RLZXk7XG4gICAgICAgIGlmICh3aWR0aCA8PSByd2RQYXJhbSkgZWxlbWVudHNbaV0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICBpZiAod2lkdGggPiByd2RQYXJhbSkgZWxlbWVudHNbaV0uY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgZ2V0TWFpbkVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gKHRoaXMuc3RhdGVzW2luZGV4XSkgPyB0aGlzLnN0YXRlc1tpbmRleF0ubWFpbkVsZW1lbnQgOiBudWxsO1xuICB9XG4gIFxuICBnZXREZWZhdWx0cyhpbmRleCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgaWYgKG1haW5FbGVtZW50ICYmIG1haW5FbGVtZW50LmRhdGFzZXQpIHtcbiAgICAgICAgaWYgKCFtYWluRWxlbWVudC5kYXRhc2V0Lm1vZHVsZXMgJiYgbWFpbkVsZW1lbnQuZGF0YXNldC52ZXJzaW9uID09PSAnZXh0ZW5kZWQnKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdtb2R1bGVzJywgWydtYXJrZXRfZGV0YWlscyddKTtcbiAgICAgICAgaWYgKCFtYWluRWxlbWVudC5kYXRhc2V0Lm1vZHVsZXMgJiYgbWFpbkVsZW1lbnQuZGF0YXNldC52ZXJzaW9uID09PSAnc3RhbmRhcmQnKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdtb2R1bGVzJywgW10pO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5tb2R1bGVzKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdtb2R1bGVzJywgSlNPTi5wYXJzZShtYWluRWxlbWVudC5kYXRhc2V0Lm1vZHVsZXMpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQucHJpbWFyeUN1cnJlbmN5KSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdwcmltYXJ5X2N1cnJlbmN5JywgbWFpbkVsZW1lbnQuZGF0YXNldC5wcmltYXJ5Q3VycmVuY3kpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5jdXJyZW5jeSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnY3VycmVuY3knLCBtYWluRWxlbWVudC5kYXRhc2V0LmN1cnJlbmN5KTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQucmFuZ2UpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3JhbmdlJywgbWFpbkVsZW1lbnQuZGF0YXNldC5yYW5nZSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnNob3dEZXRhaWxzQ3VycmVuY3kpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3Nob3dfZGV0YWlsc19jdXJyZW5jeScsIChtYWluRWxlbWVudC5kYXRhc2V0LnNob3dEZXRhaWxzQ3VycmVuY3kgPT09ICd0cnVlJykpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVBY3RpdmUpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3VwZGF0ZV9hY3RpdmUnLCAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVBY3RpdmUgPT09ICd0cnVlJykpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVUaW1lb3V0KSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICd1cGRhdGVfdGltZW91dCcsIGNwQm9vdHN0cmFwLnBhcnNlSW50ZXJ2YWxWYWx1ZShtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZVRpbWVvdXQpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ3VhZ2UpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2xhbmd1YWdlJywgbWFpbkVsZW1lbnQuZGF0YXNldC5sYW5ndWFnZSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lm9yaWdpblNyYykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnb3JpZ2luX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQub3JpZ2luU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubm9kZU1vZHVsZXNTcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ25vZGVfbW9kdWxlc19zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0Lm5vZGVNb2R1bGVzU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuYm93ZXJTcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2Jvd2VyX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQuYm93ZXJTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5zdHlsZVNyYykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnc3R5bGVfc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5zdHlsZVNyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmxhbmdTcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2xvZ29fc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5sYW5nU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuaW1nU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdsb2dvX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQuaW1nU3JjKTtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgfSk7XG4gIH1cbiAgXG4gIHNldE9yaWdpbkxpbmsoaW5kZXgpIHtcbiAgICBpZiAoT2JqZWN0LmtleXModGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnMpLmxlbmd0aCA9PT0gMCkgdGhpcy5nZXRUcmFuc2xhdGlvbnModGhpcy5kZWZhdWx0cy5sYW5ndWFnZSk7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnN0eWxlc2hlZXQoKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmFkZFdpZGdldEVsZW1lbnQoaW5kZXgpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaW5pdEludGVydmFsKGluZGV4KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgYWRkV2lkZ2V0RWxlbWVudChpbmRleCkge1xuICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgIGxldCBtb2R1bGVzID0gJyc7XG4gICAgbGV0IG1vZHVsZXNBcnJheSA9IFtdO1xuICAgIGxldCBjaGFydENvbnRhaW5lciA9IG51bGw7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKHRoaXMuZGVmYXVsdHMuYXZhaWxhYmxlTW9kdWxlcywgbW9kdWxlID0+IHtcbiAgICAgICAgcmV0dXJuICh0aGlzLnN0YXRlc1tpbmRleF0ubW9kdWxlcy5pbmRleE9mKG1vZHVsZSkgPiAtMSkgPyBtb2R1bGVzQXJyYXkucHVzaChtb2R1bGUpIDogbnVsbDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AobW9kdWxlc0FycmF5LCBtb2R1bGUgPT4ge1xuICAgICAgICBsZXQgbGFiZWwgPSBudWxsO1xuICAgICAgICBpZiAobW9kdWxlID09PSAnY2hhcnQnKSBsYWJlbCA9ICdDaGFydCc7XG4gICAgICAgIGlmIChtb2R1bGUgPT09ICdtYXJrZXRfZGV0YWlscycpIGxhYmVsID0gJ01hcmtldERldGFpbHMnO1xuICAgICAgICByZXR1cm4gKGxhYmVsKSA/IHRoaXNbYHdpZGdldCR7IGxhYmVsIH1FbGVtZW50YF0oaW5kZXgpLnRoZW4ocmVzdWx0ID0+IG1vZHVsZXMgKz0gcmVzdWx0KSA6IG51bGw7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBtYWluRWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLndpZGdldE1haW5FbGVtZW50KGluZGV4KSArIG1vZHVsZXMgKyB0aGlzLndpZGdldEZvb3RlcihpbmRleCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBjaGFydENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAkeyB0aGlzLmRlZmF1bHRzLmNsYXNzTmFtZSB9LXByaWNlLWNoYXJ0LSR7IGluZGV4IH1gKTtcbiAgICAgIHJldHVybiAoY2hhcnRDb250YWluZXIpID8gY2hhcnRDb250YWluZXIucGFyZW50RWxlbWVudC5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIHRoaXMud2lkZ2V0U2VsZWN0RWxlbWVudChpbmRleCwgJ3JhbmdlJykpIDogbnVsbDtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGlmIChjaGFydENvbnRhaW5lcil7XG4gICAgICAgIHRoaXMuc3RhdGVzW2luZGV4XS5jaGFydCA9IG5ldyBjaGFydENsYXNzKGNoYXJ0Q29udGFpbmVyLCB0aGlzLnN0YXRlc1tpbmRleF0pO1xuICAgICAgICB0aGlzLnNldFNlbGVjdExpc3RlbmVycyhpbmRleCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgICBcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnNldEJlZm9yZUVsZW1lbnRJbkZvb3RlcihpbmRleCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5nZXREYXRhKGluZGV4KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgc2V0U2VsZWN0TGlzdGVuZXJzKGluZGV4KXtcbiAgICBsZXQgbWFpbkVsZW1lbnQgPSB0aGlzLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICBsZXQgc2VsZWN0RWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0LXNlbGVjdCcpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0RWxlbWVudHMubGVuZ3RoOyBpKyspe1xuICAgICAgbGV0IGJ1dHRvbnMgPSBzZWxlY3RFbGVtZW50c1tpXS5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0LXNlbGVjdF9fb3B0aW9ucyBidXR0b24nKTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYnV0dG9ucy5sZW5ndGg7IGorKyl7XG4gICAgICAgIGJ1dHRvbnNbal0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFNlbGVjdE9wdGlvbihldmVudCwgaW5kZXgpO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICBzZXRTZWxlY3RPcHRpb24oZXZlbnQsIGluZGV4KXtcbiAgICBsZXQgY2xhc3NOYW1lID0gJ2NwLXdpZGdldC1hY3RpdmUnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKyl7XG4gICAgICBsZXQgc2libGluZyA9IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmNoaWxkTm9kZXNbaV07XG4gICAgICBpZiAoc2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkgc2libGluZy5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgfVxuICAgIGxldCBwYXJlbnQgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLmNwLXdpZGdldC1zZWxlY3QnKTtcbiAgICBsZXQgdHlwZSA9IHBhcmVudC5kYXRhc2V0LnR5cGU7XG4gICAgbGV0IHBpY2tlZFZhbHVlRWxlbWVudCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuY3Atd2lkZ2V0LXNlbGVjdF9fb3B0aW9ucyA+IHNwYW4nKTtcbiAgICBsZXQgdmFsdWUgPSBldmVudC50YXJnZXQuZGF0YXNldC5vcHRpb247XG4gICAgcGlja2VkVmFsdWVFbGVtZW50LmlubmVyVGV4dCA9IHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIHZhbHVlLnRvTG93ZXJDYXNlKCkpO1xuICAgIHRoaXMudXBkYXRlRGF0YShpbmRleCwgdHlwZSwgdmFsdWUpO1xuICAgIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgdGhpcy5kaXNwYXRjaEV2ZW50KGluZGV4LCAnLXN3aXRjaC1yYW5nZScsIHZhbHVlKTtcbiAgfVxuICBcbiAgZGlzcGF0Y2hFdmVudChpbmRleCwgbmFtZSwgZGF0YSl7XG4gICAgbGV0IGlkID0gYCR7IHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lIH0tcHJpY2UtY2hhcnQtJHsgaW5kZXggfWA7XG4gICAgcmV0dXJuIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGAke2lkfSR7bmFtZX1gLCB7IGRldGFpbDogeyBkYXRhIH0gfSkpO1xuICB9XG4gIFxuICBnZXREYXRhKGluZGV4KSB7XG4gICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vYXBpLmNvaW5wYXByaWthLmNvbS92MS93aWRnZXQvJyArIHRoaXMuc3RhdGVzW2luZGV4XS5jdXJyZW5jeSArICc/cXVvdGU9JyArIHRoaXMuc3RhdGVzW2luZGV4XS5wcmltYXJ5X2N1cnJlbmN5O1xuICAgIHJldHVybiBmZXRjaFNlcnZpY2UuZmV0Y2hEYXRhKHVybCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGVzW2luZGV4XS5pc0RhdGEpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2lzRGF0YScsIHRydWUpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRpY2tlcihpbmRleCwgcmVzdWx0KTtcbiAgICAgIH0pXG4gICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMub25FcnJvclJlcXVlc3QoaW5kZXgsIGVycm9yKTtcbiAgICB9KTtcbiAgfVxuICBcbiAgb25FcnJvclJlcXVlc3QoaW5kZXgsIHhocikge1xuICAgIGlmICh0aGlzLnN0YXRlc1tpbmRleF0uaXNEYXRhKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdpc0RhdGEnLCBmYWxzZSk7XG4gICAgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbWVzc2FnZScsICdkYXRhX3VuYXZhaWxhYmxlJyk7XG4gICAgY29uc29sZS5lcnJvcignUmVxdWVzdCBmYWlsZWQuICBSZXR1cm5lZCBzdGF0dXMgb2YgJyArIHhociwgdGhpcy5zdGF0ZXNbaW5kZXhdKTtcbiAgfVxuICBcbiAgaW5pdEludGVydmFsKGluZGV4KSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLnN0YXRlc1tpbmRleF0uaW50ZXJ2YWwpO1xuICAgIGlmICh0aGlzLnN0YXRlc1tpbmRleF0udXBkYXRlX2FjdGl2ZSAmJiB0aGlzLnN0YXRlc1tpbmRleF0udXBkYXRlX3RpbWVvdXQgPiAxMDAwKSB7XG4gICAgICB0aGlzLnN0YXRlc1tpbmRleF0uaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIHRoaXMuZ2V0RGF0YShpbmRleCk7XG4gICAgICB9LCB0aGlzLnN0YXRlc1tpbmRleF0udXBkYXRlX3RpbWVvdXQpO1xuICAgIH1cbiAgfVxuICBcbiAgc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKGluZGV4KSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlc1tpbmRleF0uaXNXb3JkcHJlc3MpIHtcbiAgICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgaWYgKG1haW5FbGVtZW50KSB7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5jaGlsZHJlblswXS5sb2NhbE5hbWUgPT09ICdzdHlsZScpIHtcbiAgICAgICAgICBtYWluRWxlbWVudC5yZW1vdmVDaGlsZChtYWluRWxlbWVudC5jaGlsZE5vZGVzWzBdKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZm9vdGVyRWxlbWVudCA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jcC13aWRnZXRfX2Zvb3RlcicpO1xuICAgICAgICBsZXQgdmFsdWUgPSBmb290ZXJFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gNDM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZm9vdGVyRWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFsdWUgLT0gZm9vdGVyRWxlbWVudC5jaGlsZE5vZGVzW2ldLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHN0eWxlLmlubmVySFRNTCA9ICcuY3Atd2lkZ2V0X19mb290ZXItLScgKyBpbmRleCArICc6OmJlZm9yZXt3aWR0aDonICsgdmFsdWUudG9GaXhlZCgwKSArICdweDt9JztcbiAgICAgICAgbWFpbkVsZW1lbnQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBtYWluRWxlbWVudC5jaGlsZHJlblswXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICB1cGRhdGVXaWRnZXRFbGVtZW50KGluZGV4LCBrZXksIHZhbHVlLCB0aWNrZXIpIHtcbiAgICBsZXQgc3RhdGUgPSB0aGlzLnN0YXRlc1tpbmRleF07XG4gICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgaWYgKG1haW5FbGVtZW50KSB7XG4gICAgICBsZXQgdGlja2VyQ2xhc3MgPSAodGlja2VyKSA/ICdUaWNrZXInIDogJyc7XG4gICAgICBpZiAoa2V5ID09PSAnbmFtZScgfHwga2V5ID09PSAnY3VycmVuY3knKSB7XG4gICAgICAgIGlmIChrZXkgPT09ICdjdXJyZW5jeScpIHtcbiAgICAgICAgICBsZXQgYUVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNwLXdpZGdldF9fZm9vdGVyID4gYScpO1xuICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYUVsZW1lbnRzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICBhRWxlbWVudHNba10uaHJlZiA9IHRoaXMuY29pbl9saW5rKHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nZXRJbWFnZShpbmRleCk7XG4gICAgICB9XG4gICAgICBpZiAoa2V5ID09PSAnaXNEYXRhJyB8fCBrZXkgPT09ICdtZXNzYWdlJykge1xuICAgICAgICBsZXQgaGVhZGVyRWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0X19tYWluJyk7XG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgaGVhZGVyRWxlbWVudHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICBoZWFkZXJFbGVtZW50c1trXS5pbm5lckhUTUwgPSAoIXN0YXRlLmlzRGF0YSkgPyB0aGlzLndpZGdldE1haW5FbGVtZW50TWVzc2FnZShpbmRleCkgOiB0aGlzLndpZGdldE1haW5FbGVtZW50RGF0YShpbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB1cGRhdGVFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsga2V5ICsgdGlja2VyQ2xhc3MpO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHVwZGF0ZUVsZW1lbnRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgbGV0IHVwZGF0ZUVsZW1lbnQgPSB1cGRhdGVFbGVtZW50c1tqXTtcbiAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NwLXdpZGdldF9fcmFuaycpKSB7XG4gICAgICAgICAgICBsZXQgY2xhc3NOYW1lID0gKHBhcnNlRmxvYXQodmFsdWUpID4gMCkgPyBcImNwLXdpZGdldF9fcmFuay11cFwiIDogKChwYXJzZUZsb2F0KHZhbHVlKSA8IDApID8gXCJjcC13aWRnZXRfX3JhbmstZG93blwiIDogXCJjcC13aWRnZXRfX3JhbmstbmV1dHJhbFwiKTtcbiAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLWRvd24nKTtcbiAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLXVwJyk7XG4gICAgICAgICAgICB1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9fcmFuay1uZXV0cmFsJyk7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IGNwQm9vdHN0cmFwLmVtcHR5RGF0YTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICAgICAgICB2YWx1ZSA9IChrZXkgPT09ICdwcmljZV9jaGFuZ2VfMjRoJykgPyAnKCcgKyBjcEJvb3RzdHJhcC5yb3VuZCh2YWx1ZSwgMikgKyAnJSknIDogY3BCb290c3RyYXAucm91bmQodmFsdWUsIDIpICsgJyUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3dEZXRhaWxzQ3VycmVuY3knKSAmJiAhc3RhdGUuc2hvd19kZXRhaWxzX2N1cnJlbmN5KSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICcgJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwYXJzZU51bWJlcicpKSB7XG4gICAgICAgICAgICBjb25zdCBvcmlnaW4gPSB0aGlzLmRlZmF1bHRzLmRhdGFfc3JjIHx8IHRoaXMuZGVmYXVsdHMub3JpZ2luX3NyYztcbiAgICAgICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLnBhcnNlQ3VycmVuY3lOdW1iZXIodmFsdWUsIHN0YXRlLnByaW1hcnlfY3VycmVuY3ksIG9yaWdpbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlRWxlbWVudC5pbm5lclRleHQgPSByZXN1bHQgfHwgY3BCb290c3RyYXAuZW1wdHlEYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5pbm5lclRleHQgPSB2YWx1ZSB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICB1cGRhdGVEYXRhKGluZGV4LCBrZXksIHZhbHVlLCB0aWNrZXIpIHtcbiAgICBpZiAodGlja2VyKSB7XG4gICAgICB0aGlzLnN0YXRlc1tpbmRleF0udGlja2VyW2tleV0gPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGF0ZXNbaW5kZXhdW2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKGtleSA9PT0gJ2xhbmd1YWdlJykge1xuICAgICAgdGhpcy5nZXRUcmFuc2xhdGlvbnModmFsdWUpO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVdpZGdldEVsZW1lbnQoaW5kZXgsIGtleSwgdmFsdWUsIHRpY2tlcik7XG4gIH1cbiAgXG4gIHVwZGF0ZVdpZGdldFRyYW5zbGF0aW9ucyhsYW5nLCBkYXRhKSB7XG4gICAgdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ10gPSBkYXRhO1xuICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5zdGF0ZXMubGVuZ3RoOyB4KyspIHtcbiAgICAgIGxldCBpc05vVHJhbnNsYXRpb25MYWJlbHNVcGRhdGUgPSB0aGlzLnN0YXRlc1t4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLmxlbmd0aCA+IDAgJiYgbGFuZyA9PT0gJ2VuJztcbiAgICAgIGlmICh0aGlzLnN0YXRlc1t4XS5sYW5ndWFnZSA9PT0gbGFuZyB8fCBpc05vVHJhbnNsYXRpb25MYWJlbHNVcGRhdGUpIHtcbiAgICAgICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5zdGF0ZXNbeF0ubWFpbkVsZW1lbnQ7XG4gICAgICAgIGxldCB0cmFuc2FsdGVFbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC10cmFuc2xhdGlvbicpKTtcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0cmFuc2FsdGVFbGVtZW50cy5sZW5ndGg7IHkrKykge1xuICAgICAgICAgIHRyYW5zYWx0ZUVsZW1lbnRzW3ldLmNsYXNzTGlzdC5mb3JFYWNoKChjbGFzc05hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChjbGFzc05hbWUuc2VhcmNoKCd0cmFuc2xhdGlvbl8nKSA+IC0xKSB7XG4gICAgICAgICAgICAgIGxldCB0cmFuc2xhdGVLZXkgPSBjbGFzc05hbWUucmVwbGFjZSgndHJhbnNsYXRpb25fJywgJycpO1xuICAgICAgICAgICAgICBpZiAodHJhbnNsYXRlS2V5ID09PSAnbWVzc2FnZScpIHRyYW5zbGF0ZUtleSA9IHRoaXMuc3RhdGVzW3hdLm1lc3NhZ2U7XG4gICAgICAgICAgICAgIGxldCBsYWJlbEluZGV4ID0gdGhpcy5zdGF0ZXNbeF0ubm9UcmFuc2xhdGlvbkxhYmVscy5pbmRleE9mKHRyYW5zbGF0ZUtleSk7XG4gICAgICAgICAgICAgIGxldCB0ZXh0ID0gdGhpcy5nZXRUcmFuc2xhdGlvbih4LCB0cmFuc2xhdGVLZXkpO1xuICAgICAgICAgICAgICBpZiAobGFiZWxJbmRleCA+IC0xICYmIHRleHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1t4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLnNwbGljZShsYWJlbEluZGV4LCAxKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRyYW5zYWx0ZUVsZW1lbnRzW3ldLmlubmVyVGV4dCA9IHRleHQ7XG4gICAgICAgICAgICAgIGlmICh0cmFuc2FsdGVFbGVtZW50c1t5XS5jbG9zZXN0KCcuY3Atd2lkZ2V0X19mb290ZXInKSkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZXRCZWZvcmVFbGVtZW50SW5Gb290ZXIoeCksIDUwKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHVwZGF0ZVRpY2tlcihpbmRleCwgZGF0YSkge1xuICAgIGxldCBkYXRhS2V5cyA9IE9iamVjdC5rZXlzKGRhdGEpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMudXBkYXRlRGF0YShpbmRleCwgZGF0YUtleXNbaV0sIGRhdGFbZGF0YUtleXNbaV1dLCB0cnVlKTtcbiAgICB9XG4gIH1cbiAgXG4gIHN0eWxlc2hlZXQoKSB7XG4gICAgaWYgKHRoaXMuZGVmYXVsdHMuc3R5bGVfc3JjICE9PSBmYWxzZSkge1xuICAgICAgbGV0IHVybCA9IHRoaXMuZGVmYXVsdHMuc3R5bGVfc3JjIHx8IHRoaXMuZGVmYXVsdHMub3JpZ2luX3NyYyArICcvZGlzdC8nICsgdGhpcy5kZWZhdWx0cy5jc3NGaWxlTmFtZTtcbiAgICAgIGlmICghZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCdsaW5rW2hyZWY9XCInICsgdXJsICsgJ1wiXScpKXtcbiAgICAgICAgcmV0dXJuIGZldGNoU2VydmljZS5mZXRjaFN0eWxlKHVybCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuICBcbiAgd2lkZ2V0TWFpbkVsZW1lbnQoaW5kZXgpIHtcbiAgICBsZXQgZGF0YSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcbiAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX2hlYWRlclwiPicgK1xuICAgICAgJzxkaXYgY2xhc3M9XCInICsgJ2NwLXdpZGdldF9faW1nIGNwLXdpZGdldF9faW1nLScgKyBkYXRhLmN1cnJlbmN5ICsgJ1wiPicgK1xuICAgICAgJzxpbWcvPicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX21haW5cIj4nICtcbiAgICAgICgoZGF0YS5pc0RhdGEpID8gdGhpcy53aWRnZXRNYWluRWxlbWVudERhdGEoaW5kZXgpIDogdGhpcy53aWRnZXRNYWluRWxlbWVudE1lc3NhZ2UoaW5kZXgpKSArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+JztcbiAgfVxuICBcbiAgd2lkZ2V0TWFpbkVsZW1lbnREYXRhKGluZGV4KSB7XG4gICAgbGV0IGRhdGEgPSB0aGlzLnN0YXRlc1tpbmRleF07XG4gICAgcmV0dXJuICc8aDM+PGEgaHJlZj1cIicgKyB0aGlzLmNvaW5fbGluayhkYXRhLmN1cnJlbmN5KSArICdcIj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cIm5hbWVUaWNrZXJcIj4nICsgKGRhdGEudGlja2VyLm5hbWUgfHwgY3BCb290c3RyYXAuZW1wdHlEYXRhKSArICc8L3NwYW4+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzeW1ib2xUaWNrZXJcIj4nICsgKGRhdGEudGlja2VyLnN5bWJvbCB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGEpICsgJzwvc3Bhbj4nICtcbiAgICAgICc8L2E+PC9oMz4nICtcbiAgICAgICc8c3Ryb25nPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwicHJpY2VUaWNrZXIgcGFyc2VOdW1iZXJcIj4nICsgKGNwQm9vdHN0cmFwLnBhcnNlTnVtYmVyKGRhdGEudGlja2VyLnByaWNlKSB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGEpICsgJzwvc3Bhbj4gJyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJwcmltYXJ5Q3VycmVuY3lcIj4nICsgZGF0YS5wcmltYXJ5X2N1cnJlbmN5ICsgJyA8L3NwYW4+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJwcmljZV9jaGFuZ2VfMjRoVGlja2VyIGNwLXdpZGdldF9fcmFuayBjcC13aWRnZXRfX3JhbmstJyArICgoZGF0YS50aWNrZXIucHJpY2VfY2hhbmdlXzI0aCA+IDApID8gXCJ1cFwiIDogKChkYXRhLnRpY2tlci5wcmljZV9jaGFuZ2VfMjRoIDwgMCkgPyBcImRvd25cIiA6IFwibmV1dHJhbFwiKSkgKyAnXCI+KCcgKyAoY3BCb290c3RyYXAucm91bmQoZGF0YS50aWNrZXIucHJpY2VfY2hhbmdlXzI0aCwgMikgfHwgY3BCb290c3RyYXAuZW1wdHlWYWx1ZSkgKyAnJSk8L3NwYW4+JyArXG4gICAgICAnPC9zdHJvbmc+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJjcC13aWRnZXRfX3JhbmstbGFiZWxcIj48c3BhbiBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX3JhbmtcIj4nICsgdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJyYW5rXCIpICsgJzwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJyYW5rVGlja2VyXCI+JyArIChkYXRhLnRpY2tlci5yYW5rIHx8IGNwQm9vdHN0cmFwLmVtcHR5RGF0YSkgKyAnPC9zcGFuPjwvc3Bhbj4nO1xuICB9XG4gIFxuICB3aWRnZXRNYWluRWxlbWVudE1lc3NhZ2UoaW5kZXgpIHtcbiAgICBsZXQgbWVzc2FnZSA9IHRoaXMuc3RhdGVzW2luZGV4XS5tZXNzYWdlO1xuICAgIHJldHVybiAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9fbWFpbi1uby1kYXRhIGNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX21lc3NhZ2VcIj4nICsgKHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIG1lc3NhZ2UpKSArICc8L2Rpdj4nO1xuICB9XG4gIFxuICB3aWRnZXRNYXJrZXREZXRhaWxzRWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKHRoaXMuc3RhdGVzW2luZGV4XS5tb2R1bGVzLmluZGV4T2YoJ21hcmtldF9kZXRhaWxzJykgPiAtMSkgPyAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9fZGV0YWlsc1wiPicgK1xuICAgICAgdGhpcy53aWRnZXRBdGhFbGVtZW50KGluZGV4KSArXG4gICAgICB0aGlzLndpZGdldFZvbHVtZTI0aEVsZW1lbnQoaW5kZXgpICtcbiAgICAgIHRoaXMud2lkZ2V0TWFya2V0Q2FwRWxlbWVudChpbmRleCkgK1xuICAgICAgJzwvZGl2PicgOiAnJyk7XG4gIH1cbiAgXG4gIHdpZGdldEF0aEVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAnPHNtYWxsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fYXRoXCI+JyArIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwiYXRoXCIpICsgJzwvc21hbGw+JyArXG4gICAgICAnPGRpdj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInByaWNlX2F0aFRpY2tlciBwYXJzZU51bWJlclwiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlciBzaG93RGV0YWlsc0N1cnJlbmN5XCI+PC9zcGFuPicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwicGVyY2VudF9mcm9tX3ByaWNlX2F0aFRpY2tlciBjcC13aWRnZXRfX3JhbmtcIj4nICsgY3BCb290c3RyYXAuZW1wdHlEYXRhICsgJzwvc3Bhbj4nICtcbiAgICAgICc8L2Rpdj4nXG4gIH1cbiAgXG4gIHdpZGdldFZvbHVtZTI0aEVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAnPHNtYWxsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fdm9sdW1lXzI0aFwiPicgKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInZvbHVtZV8yNGhcIikgKyAnPC9zbWFsbD4nICtcbiAgICAgICc8ZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwidm9sdW1lXzI0aFRpY2tlciBwYXJzZU51bWJlclwiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlciBzaG93RGV0YWlsc0N1cnJlbmN5XCI+PC9zcGFuPicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwidm9sdW1lXzI0aF9jaGFuZ2VfMjRoVGlja2VyIGNwLXdpZGdldF9fcmFua1wiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnPC9zcGFuPicgK1xuICAgICAgJzwvZGl2Pic7XG4gIH1cbiAgXG4gIHdpZGdldE1hcmtldENhcEVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAnPHNtYWxsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fbWFya2V0X2NhcFwiPicgKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcIm1hcmtldF9jYXBcIikgKyAnPC9zbWFsbD4nICtcbiAgICAgICc8ZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwibWFya2V0X2NhcFRpY2tlciBwYXJzZU51bWJlclwiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlciBzaG93RGV0YWlsc0N1cnJlbmN5XCI+PC9zcGFuPicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwibWFya2V0X2NhcF9jaGFuZ2VfMjRoVGlja2VyIGNwLXdpZGdldF9fcmFua1wiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnPC9zcGFuPicgK1xuICAgICAgJzwvZGl2Pic7XG4gIH1cbiAgXG4gIHdpZGdldENoYXJ0RWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoXG4gICAgICBgPGRpdiBjbGFzcz1cImNwLXdpZGdldF9fY2hhcnRcIj48ZGl2IGlkPVwiJHsgdGhpcy5kZWZhdWx0cy5jbGFzc05hbWUgfS1wcmljZS1jaGFydC0keyBpbmRleCB9XCI+PC9kaXY+PC9kaXY+YFxuICAgICk7XG4gIH1cbiAgXG4gIHdpZGdldFNlbGVjdEVsZW1lbnQoaW5kZXgsIGxhYmVsKXtcbiAgICBsZXQgYnV0dG9ucyA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdGF0ZXNbaW5kZXhdW2xhYmVsKydfbGlzdCddLmxlbmd0aDsgaSsrKXtcbiAgICAgIGxldCBkYXRhID0gdGhpcy5zdGF0ZXNbaW5kZXhdW2xhYmVsKydfbGlzdCddW2ldO1xuICAgICAgYnV0dG9ucyArPSAnPGJ1dHRvbiBjbGFzcz1cIicrICgoZGF0YS50b0xvd2VyQ2FzZSgpID09PSB0aGlzLnN0YXRlc1tpbmRleF1bbGFiZWxdLnRvTG93ZXJDYXNlKCkpXG4gICAgICAgID8gJ2NwLXdpZGdldC1hY3RpdmUgJ1xuICAgICAgICA6ICcnKSArICgobGFiZWwgPT09ICdwcmltYXJ5X2N1cnJlbmN5JykgPyAnJyA6ICdjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl8nICsgZGF0YS50b0xvd2VyQ2FzZSgpKSArJ1wiIGRhdGEtb3B0aW9uPVwiJytkYXRhKydcIj4nK3RoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIGRhdGEudG9Mb3dlckNhc2UoKSkrJzwvYnV0dG9uPidcbiAgICB9XG4gICAgaWYgKGxhYmVsID09PSAncmFuZ2UnKSA7XG4gICAgbGV0IHRpdGxlID0gdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJ6b29tX2luXCIpO1xuICAgIHJldHVybiAnPGRpdiBkYXRhLXR5cGU9XCInK2xhYmVsKydcIiBjbGFzcz1cImNwLXdpZGdldC1zZWxlY3RcIj4nICtcbiAgICAgICc8bGFiZWwgY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl8nKyBsYWJlbCArJ1wiPicrdGl0bGUrJzwvbGFiZWw+JyArXG4gICAgICAnPGRpdiBjbGFzcz1cImNwLXdpZGdldC1zZWxlY3RfX29wdGlvbnNcIj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cImFycm93LWRvd24gJysgJ2NwLXdpZGdldF9fY2FwaXRhbGl6ZSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl8nICsgdGhpcy5zdGF0ZXNbaW5kZXhdW2xhYmVsXS50b0xvd2VyQ2FzZSgpICsnXCI+JysgdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgdGhpcy5zdGF0ZXNbaW5kZXhdW2xhYmVsXS50b0xvd2VyQ2FzZSgpKSArJzwvc3Bhbj4nICtcbiAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0LXNlbGVjdF9fZHJvcGRvd25cIj4nICtcbiAgICAgIGJ1dHRvbnMgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzwvZGl2Pic7XG4gIH1cbiAgXG4gIHdpZGdldEZvb3RlcihpbmRleCkge1xuICAgIGxldCBjdXJyZW5jeSA9IHRoaXMuc3RhdGVzW2luZGV4XS5jdXJyZW5jeTtcbiAgICByZXR1cm4gKCF0aGlzLnN0YXRlc1tpbmRleF0uaXNXb3JkcHJlc3MpXG4gICAgICA/ICc8cCBjbGFzcz1cImNwLXdpZGdldF9fZm9vdGVyIGNwLXdpZGdldF9fZm9vdGVyLS0nICsgaW5kZXggKyAnXCI+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9wb3dlcmVkX2J5XCI+JyArIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwicG93ZXJlZF9ieVwiKSArICcgPC9zcGFuPicgK1xuICAgICAgJzxpbWcgc3R5bGU9XCJ3aWR0aDogMTZweFwiIHNyYz1cIicgKyB0aGlzLm1haW5fbG9nb19saW5rKCkgKyAnXCIgYWx0PVwiXCIvPicgK1xuICAgICAgJzxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCInICsgdGhpcy5jb2luX2xpbmsoY3VycmVuY3kpICsgJ1wiPmNvaW5wYXByaWthLmNvbTwvYT4nICtcbiAgICAgICc8L3A+J1xuICAgICAgOiAnJztcbiAgfVxuICBcbiAgZ2V0SW1hZ2UoaW5kZXgpIHtcbiAgICBsZXQgZGF0YSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcbiAgICBsZXQgaW1nQ29udGFpbmVycyA9IGRhdGEubWFpbkVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY3Atd2lkZ2V0X19pbWcnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGltZ0NvbnRhaW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBpbWdDb250YWluZXIgPSBpbWdDb250YWluZXJzW2ldO1xuICAgICAgaW1nQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NwLXdpZGdldF9faW1nLS1oaWRkZW4nKTtcbiAgICAgIGxldCBpbWcgPSBpbWdDb250YWluZXIucXVlcnlTZWxlY3RvcignaW1nJyk7XG4gICAgICBsZXQgbmV3SW1nID0gbmV3IEltYWdlO1xuICAgICAgbmV3SW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgaW1nLnNyYyA9IG5ld0ltZy5zcmM7XG4gICAgICAgIGltZ0NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX2ltZy0taGlkZGVuJyk7XG4gICAgICB9O1xuICAgICAgbmV3SW1nLnNyYyA9IHRoaXMuaW1nX3NyYyhkYXRhLmN1cnJlbmN5KTtcbiAgICB9XG4gIH1cbiAgXG4gIGltZ19zcmMoaWQpIHtcbiAgICByZXR1cm4gJ2h0dHBzOi8vY29pbnBhcHJpa2EuY29tL2NvaW4vJyArIGlkICsgJy9sb2dvLnBuZyc7XG4gIH1cbiAgXG4gIGNvaW5fbGluayhpZCkge1xuICAgIHJldHVybiAnaHR0cHM6Ly9jb2lucGFwcmlrYS5jb20vY29pbi8nICsgaWRcbiAgfVxuICBcbiAgbWFpbl9sb2dvX2xpbmsoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYXVsdHMuaW1nX3NyYyB8fCB0aGlzLmRlZmF1bHRzLm9yaWdpbl9zcmMgKyAnL2Rpc3QvaW1nL2xvZ29fd2lkZ2V0LnN2ZydcbiAgfVxuICBcbiAgZ2V0U2NyaXB0RWxlbWVudCgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0W2RhdGEtY3AtY3VycmVuY3ktd2lkZ2V0XScpO1xuICB9XG4gIFxuICBnZXRUcmFuc2xhdGlvbihpbmRleCwgbGFiZWwpIHtcbiAgICBsZXQgdGV4dCA9ICh0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1t0aGlzLnN0YXRlc1tpbmRleF0ubGFuZ3VhZ2VdKSA/IHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW3RoaXMuc3RhdGVzW2luZGV4XS5sYW5ndWFnZV1bbGFiZWxdIDogbnVsbDtcbiAgICBpZiAoIXRleHQgJiYgdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbJ2VuJ10pIHtcbiAgICAgIHRleHQgPSB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1snZW4nXVtsYWJlbF07XG4gICAgfVxuICAgIGlmICghdGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMuYWRkTGFiZWxXaXRob3V0VHJhbnNsYXRpb24oaW5kZXgsIGxhYmVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9XG4gIFxuICBhZGRMYWJlbFdpdGhvdXRUcmFuc2xhdGlvbihpbmRleCwgbGFiZWwpIHtcbiAgICBpZiAoIXRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zWydlbiddKSB0aGlzLmdldFRyYW5zbGF0aW9ucygnZW4nKTtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZXNbaW5kZXhdLm5vVHJhbnNsYXRpb25MYWJlbHMucHVzaChsYWJlbCk7XG4gIH1cbiAgXG4gIGdldFRyYW5zbGF0aW9ucyhsYW5nKSB7XG4gICAgaWYgKCF0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXSkge1xuICAgICAgY29uc3QgdXJsID0gdGhpcy5kZWZhdWx0cy5sYW5nX3NyYyB8fCB0aGlzLmRlZmF1bHRzLm9yaWdpbl9zcmMgKyAnL2Rpc3QvbGFuZy8nICsgbGFuZyArICcuanNvbic7XG4gICAgICB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXSA9IHt9O1xuICAgICAgcmV0dXJuIGZldGNoU2VydmljZS5mZXRjaEpzb25GaWxlKHVybCwgdHJ1ZSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVXaWRnZXRUcmFuc2xhdGlvbnMobGFuZywgcmVzcG9uc2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMub25FcnJvclJlcXVlc3QoMCwgdXJsICsgcmVzcG9uc2UpO1xuICAgICAgICAgIHRoaXMuZ2V0VHJhbnNsYXRpb25zKCdlbicpO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgY2hhcnRDbGFzcyB7XG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgc3RhdGUpe1xuICAgIGlmICghY29udGFpbmVyKSByZXR1cm47XG4gICAgdGhpcy5pZCA9IGNvbnRhaW5lci5pZDtcbiAgICB0aGlzLmlzTmlnaHRNb2RlID0gc3RhdGUuaXNOaWdodE1vZGU7XG4gICAgdGhpcy5jaGFydHNXaXRoQWN0aXZlU2VyaWVzQ29va2llcyA9IFtdO1xuICAgIHRoaXMuY2hhcnQgPSBudWxsO1xuICAgIHRoaXMuY3VycmVuY3kgPSBzdGF0ZS5jdXJyZW5jeTtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLnNldE9wdGlvbnMoKTtcbiAgICB0aGlzLmRlZmF1bHRSYW5nZSA9IHN0YXRlLnJhbmdlIHx8ICc3ZCc7XG4gICAgdGhpcy5jYWxsYmFjayA9IG51bGw7XG4gICAgdGhpcy5yZXBsYWNlQ2FsbGJhY2sgPSBudWxsO1xuICAgIHRoaXMuZXh0cmVtZXNEYXRhVXJsID0gdGhpcy5nZXRFeHRyZW1lc0RhdGFVcmwoY29udGFpbmVyLmlkKTtcbiAgICB0aGlzLmRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgY2hhcnQ6IHtcbiAgICAgICAgYWxpZ25UaWNrczogZmFsc2UsXG4gICAgICAgIG1hcmdpblRvcDogNTAsXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgZm9udEZhbWlseTogJ3NhbnMtc2VyaWYnLFxuICAgICAgICB9LFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICByZW5kZXI6IChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZS50YXJnZXQuYW5ub3RhdGlvbnMpIHtcbiAgICAgICAgICAgICAgbGV0IGNoYXJ0ID0gZS50YXJnZXQuYW5ub3RhdGlvbnMuY2hhcnQ7XG4gICAgICAgICAgICAgIGNwQm9vdHN0cmFwLmxvb3AoY2hhcnQuYW5ub3RhdGlvbnMuYWxsSXRlbXMsIGFubm90YXRpb24gPT4ge1xuICAgICAgICAgICAgICAgIGxldCB5ID0gY2hhcnQucGxvdEhlaWdodCArIGNoYXJ0LnBsb3RUb3AgLSBjaGFydC5zcGFjaW5nWzBdIC0gMiAtICgodGhpcy5pc1Jlc3BvbnNpdmVNb2RlQWN0aXZlKGNoYXJ0KSkgPyAxMCA6IDApO1xuICAgICAgICAgICAgICAgIGFubm90YXRpb24udXBkYXRlKHt5fSwgdHJ1ZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgc2Nyb2xsYmFyOiB7XG4gICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIGFubm90YXRpb25zT3B0aW9uczoge1xuICAgICAgICBlbmFibGVkQnV0dG9uczogZmFsc2UsXG4gICAgICB9LFxuICAgICAgcmFuZ2VTZWxlY3Rvcjoge1xuICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICBwbG90T3B0aW9uczoge1xuICAgICAgICBsaW5lOiB7XG4gICAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgICBzdGF0ZXM6IHtcbiAgICAgICAgICAgICAgaG92ZXI6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICBsZWdlbmRJdGVtQ2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXZlbnQuYnJvd3NlckV2ZW50LmlzVHJ1c3RlZCl7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRzV2l0aEFjdGl2ZVNlcmllc0Nvb2tpZXMuaW5kZXhPZihldmVudC50YXJnZXQuY2hhcnQucmVuZGVyVG8uaWQpID4gLTEpIHRoaXMuc2V0VmlzaWJsZUNoYXJ0Q29va2llcyhldmVudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gT24gaU9TIHRvdWNoIGV2ZW50IGZpcmVzIHNlY29uZCBjYWxsYmFjayBmcm9tIEpTIChpc1RydXN0ZWQ6IGZhbHNlKSB3aGljaFxuICAgICAgICAgICAgICAvLyByZXN1bHRzIHdpdGggdG9nZ2xlIGJhY2sgdGhlIGNoYXJ0IChwcm9iYWJseSBpdHMgYSBwcm9ibGVtIHdpdGggVUlLaXQsIGJ1dCBub3Qgc3VyZSlcbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2xlZ2VuZEl0ZW1DbGljaycsIHtldmVudCwgaXNUcnVzdGVkOiBldmVudC5icm93c2VyRXZlbnQuaXNUcnVzdGVkfSk7XG4gICAgICAgICAgICAgIHJldHVybiBldmVudC5icm93c2VyRXZlbnQuaXNUcnVzdGVkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgeEF4aXM6IHtcbiAgICAgICAgb3JkaW5hbDogZmFsc2VcbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMuY2hhcnREYXRhUGFyc2VyID0gKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBkYXRhID0gZGF0YVswXTtcbiAgICAgICAgY29uc3QgcHJpY2VDdXJyZW5jeSA9IHN0YXRlLnByaW1hcnlfY3VycmVuY3kudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoe1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHByaWNlOiAoZGF0YS5wcmljZSlcbiAgICAgICAgICAgICAgPyBkYXRhLnByaWNlXG4gICAgICAgICAgICAgIDogKChkYXRhW3ByaWNlQ3VycmVuY3ldKVxuICAgICAgICAgICAgICAgID8gZGF0YVtwcmljZUN1cnJlbmN5XVxuICAgICAgICAgICAgICAgIDogW10pLFxuICAgICAgICAgICAgdm9sdW1lOiBkYXRhLnZvbHVtZSB8fCBbXSxcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB0aGlzLmlzRXZlbnRzSGlkZGVuID0gZmFsc2U7XG4gICAgdGhpcy5leGNsdWRlU2VyaWVzSWRzID0gW107XG4gICAgdGhpcy5hc3luY1VybCA9IGAvY3VycmVuY3kvZGF0YS8keyBzdGF0ZS5jdXJyZW5jeSB9L19yYW5nZV8vYDtcbiAgICB0aGlzLmFzeW5jUGFyYW1zID0gYD9xdW90ZT0keyBzdGF0ZS5wcmltYXJ5X2N1cnJlbmN5LnRvVXBwZXJDYXNlKCkgfSZmaWVsZHM9cHJpY2Usdm9sdW1lYDtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuICBcbiAgc2V0T3B0aW9ucygpe1xuICAgIGNvbnN0IGNoYXJ0U2VydmljZSA9IG5ldyBjaGFydENsYXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3BvbnNpdmU6IHtcbiAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb25kaXRpb246IHtcbiAgICAgICAgICAgICAgbWF4V2lkdGg6IDE1MDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hhcnRPcHRpb25zOiB7XG4gICAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgIGFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuICAgICAgICAgICAgICAgIHk6IDkyLFxuICAgICAgICAgICAgICAgIHN5bWJvbFJhZGl1czogMCxcbiAgICAgICAgICAgICAgICBpdGVtRGlzdGFuY2U6IDIwLFxuICAgICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgIGhlaWdodDogNDAwLFxuICAgICAgICAgICAgICAgIG1hcmdpblRvcDogMzUsXG4gICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAwLFxuICAgICAgICAgICAgICAgIHNwYWNpbmdUb3A6IDAsXG4gICAgICAgICAgICAgICAgc3BhY2luZ0JvdHRvbTogMCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbmF2aWdhdG9yOiB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgICAgICAgICAgICBtYXJnaW46IDcwLFxuICAgICAgICAgICAgICAgIGhhbmRsZXM6IHtcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogMjUsXG4gICAgICAgICAgICAgICAgICB3aWR0aDogMTcsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb25kaXRpb246IHtcbiAgICAgICAgICAgICAgbWF4V2lkdGg6IDYwMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGFydE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IDAsXG4gICAgICAgICAgICAgICAgem9vbVR5cGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IDEwLFxuICAgICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiAxMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM1MCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgeUF4aXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tBbW91bnQ6IDcsXG4gICAgICAgICAgICAgICAgICB0aWNrV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrTGVuZ3RoOiAwLFxuICAgICAgICAgICAgICAgICAgbGluZVdpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgYWxpZ246IFwibGVmdFwiLFxuICAgICAgICAgICAgICAgICAgICB4OiAxLFxuICAgICAgICAgICAgICAgICAgICB5OiAtMixcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM5ZTllOWUnLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnOXB4JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGZsb29yOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0Ftb3VudDogNyxcbiAgICAgICAgICAgICAgICAgIHRpY2tXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tMZW5ndGg6IDAsXG4gICAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICAgICAgICBhbGlnbjogXCJyaWdodFwiLFxuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogXCJqdXN0aWZ5XCIsXG4gICAgICAgICAgICAgICAgICAgIHg6IDEsXG4gICAgICAgICAgICAgICAgICAgIHk6IC0yLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzUwODVlYycsXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICc5cHgnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgIG1heFdpZHRoOiA0NTBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGFydE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgYWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ21pZGRsZScsXG4gICAgICAgICAgICAgICAgeTogODIsXG4gICAgICAgICAgICAgICAgc3ltYm9sUmFkaXVzOiAwLFxuICAgICAgICAgICAgICAgIGl0ZW1EaXN0YW5jZTogMjAsXG4gICAgICAgICAgICAgICAgaXRlbVN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG5hdmlnYXRvcjoge1xuICAgICAgICAgICAgICAgIG1hcmdpbjogNjAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA0MCxcbiAgICAgICAgICAgICAgICBoYW5kbGVzOiB7XG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6IDIwLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwMCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgeUF4aXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tBbW91bnQ6IDcsXG4gICAgICAgICAgICAgICAgICB0aWNrV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrTGVuZ3RoOiAwLFxuICAgICAgICAgICAgICAgICAgbGluZVdpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgYWxpZ246IFwibGVmdFwiLFxuICAgICAgICAgICAgICAgICAgICB4OiAxLFxuICAgICAgICAgICAgICAgICAgICB5OiAtMixcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM5ZTllOWUnLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnOXB4JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGZsb29yOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0Ftb3VudDogNyxcbiAgICAgICAgICAgICAgICAgIHRpY2tXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tMZW5ndGg6IDAsXG4gICAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICAgICAgICBhbGlnbjogXCJyaWdodFwiLFxuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogXCJqdXN0aWZ5XCIsXG4gICAgICAgICAgICAgICAgICAgIHg6IDEsXG4gICAgICAgICAgICAgICAgICAgIHk6IC0yLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzUwODVlYycsXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICc5cHgnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHRpdGxlOiB7XG4gICAgICAgIHRleHQ6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgICBjaGFydDoge1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdub25lJyxcbiAgICAgICAgbWFyZ2luVG9wOiA1MCxcbiAgICAgICAgcGxvdEJvcmRlcldpZHRoOiAwLFxuICAgICAgfSxcbiAgICAgIGNwRXZlbnRzOiBmYWxzZSxcbiAgICAgIGNvbG9yczogW1xuICAgICAgICAnIzUwODVlYycsXG4gICAgICAgICcjMWY5ODA5JyxcbiAgICAgICAgJyM5ODVkNjUnLFxuICAgICAgICAnI2VlOTgzYicsXG4gICAgICAgICcjNGM0YzRjJyxcbiAgICAgIF0sXG4gICAgICBsZWdlbmQ6IHtcbiAgICAgICAgbWFyZ2luOiAwLFxuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICBhbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgc3ltYm9sUmFkaXVzOiAwLFxuICAgICAgICBpdGVtRGlzdGFuY2U6IDQwLFxuICAgICAgICBpdGVtU3R5bGU6IHtcbiAgICAgICAgICBmb250V2VpZ2h0OiAnbm9ybWFsJyxcbiAgICAgICAgICBjb2xvcjogKHRoaXMuaXNOaWdodE1vZGUpID8gJyM4MGE2ZTUnIDogJyMwNjQ1YWQnLFxuICAgICAgICB9LFxuICAgICAgICBpdGVtTWFyZ2luVG9wOiA4LFxuICAgICAgfSxcbiAgICAgIG5hdmlnYXRvcjogdHJ1ZSxcbiAgICAgIHRvb2x0aXA6IHtcbiAgICAgICAgc2hhcmVkOiB0cnVlLFxuICAgICAgICBzcGxpdDogZmFsc2UsXG4gICAgICAgIGFuaW1hdGlvbjogZmFsc2UsXG4gICAgICAgIGJvcmRlcldpZHRoOiAxLFxuICAgICAgICBib3JkZXJDb2xvcjogKHRoaXMuaXNOaWdodE1vZGUpID8gJyM0YzRjNGMnIDogJyNlM2UzZTMnLFxuICAgICAgICBoaWRlRGVsYXk6IDEwMCxcbiAgICAgICAgc2hhZG93OiBmYWxzZSxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgY29sb3I6ICcjNGM0YzRjJyxcbiAgICAgICAgICBmb250U2l6ZTogJzEwcHgnLFxuICAgICAgICB9LFxuICAgICAgICB1c2VIVE1MOiB0cnVlLFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuIGNoYXJ0U2VydmljZS50b29sdGlwRm9ybWF0dGVyKHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIFxuICAgICAgZXhwb3J0aW5nOiB7XG4gICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICBjb250ZXh0QnV0dG9uOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFxuICAgICAgeEF4aXM6IHtcbiAgICAgICAgbGluZUNvbG9yOiAodGhpcy5pc05pZ2h0TW9kZSkgPyAnIzUwNTA1MCcgOiAnI2UzZTNlMycsXG4gICAgICAgIHRpY2tDb2xvcjogKHRoaXMuaXNOaWdodE1vZGUpID8gJyM1MDUwNTAnIDogJyNlM2UzZTMnLFxuICAgICAgICB0aWNrTGVuZ3RoOiA3LFxuICAgICAgfSxcbiAgICAgIFxuICAgICAgeUF4aXM6IFt7IC8vIFZvbHVtZSB5QXhpc1xuICAgICAgICBsaW5lV2lkdGg6IDEsXG4gICAgICAgIGxpbmVDb2xvcjogJyNkZWRlZGUnLFxuICAgICAgICB0aWNrV2lkdGg6IDEsXG4gICAgICAgIHRpY2tMZW5ndGg6IDQsXG4gICAgICAgIGdyaWRMaW5lRGFzaFN0eWxlOiAnZGFzaCcsXG4gICAgICAgIGdyaWRMaW5lV2lkdGg6IDAsXG4gICAgICAgIGZsb29yOiAwLFxuICAgICAgICBtaW5QYWRkaW5nOiAwLFxuICAgICAgICBvcHBvc2l0ZTogZmFsc2UsXG4gICAgICAgIHNob3dFbXB0eTogZmFsc2UsXG4gICAgICAgIHNob3dMYXN0TGFiZWw6IGZhbHNlLFxuICAgICAgICBzaG93Rmlyc3RMYWJlbDogZmFsc2UsXG4gICAgICB9LCB7XG4gICAgICAgIGdyaWRMaW5lQ29sb3I6ICh0aGlzLmlzTmlnaHRNb2RlKSA/ICcjNTA1MDUwJyA6ICcjZTNlM2UzJyxcbiAgICAgICAgZ3JpZExpbmVEYXNoU3R5bGU6ICdkYXNoJyxcbiAgICAgICAgbGluZVdpZHRoOiAxLFxuICAgICAgICB0aWNrV2lkdGg6IDEsXG4gICAgICAgIHRpY2tMZW5ndGg6IDQsXG4gICAgICAgIGZsb29yOiAwLFxuICAgICAgICBtaW5QYWRkaW5nOiAwLFxuICAgICAgICBzaG93RW1wdHk6IGZhbHNlLFxuICAgICAgICBvcHBvc2l0ZTogdHJ1ZSxcbiAgICAgICAgZ3JpZFpJbmRleDogNCxcbiAgICAgICAgc2hvd0xhc3RMYWJlbDogZmFsc2UsXG4gICAgICAgIHNob3dGaXJzdExhYmVsOiBmYWxzZSxcbiAgICAgIH1dLFxuICAgICAgXG4gICAgICBzZXJpZXM6IFtcbiAgICAgICAgeyAvL29yZGVyIG9mIHRoZSBzZXJpZXMgbWF0dGVyc1xuICAgICAgICAgIGNvbG9yOiAnIzUwODVlYycsXG4gICAgICAgICAgbmFtZTogJ1ByaWNlJyxcbiAgICAgICAgICBpZDogJ3ByaWNlJyxcbiAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgICB0eXBlOiAnYXJlYScsXG4gICAgICAgICAgZmlsbE9wYWNpdHk6IDAuMTUsXG4gICAgICAgICAgbGluZVdpZHRoOiAyLFxuICAgICAgICAgIHlBeGlzOiAxLFxuICAgICAgICAgIHpJbmRleDogMixcbiAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgIGNsaWNrYWJsZTogdHJ1ZSxcbiAgICAgICAgICB0aHJlc2hvbGQ6IG51bGwsXG4gICAgICAgICAgdG9vbHRpcDoge1xuICAgICAgICAgICAgdmFsdWVEZWNpbWFsczogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2hvd0luTmF2aWdhdG9yOiB0cnVlLFxuICAgICAgICAgIHNob3dJbkxlZ2VuZDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjb2xvcjogYHVybCgjZmlsbC1wYXR0ZXJuJHsodGhpcy5pc05pZ2h0TW9kZSkgPyAnLW5pZ2h0JyA6ICcnfSlgLFxuICAgICAgICAgIG5hbWU6ICdWb2x1bWUnLFxuICAgICAgICAgIGlkOiAndm9sdW1lJyxcbiAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgICB0eXBlOiAnYXJlYScsXG4gICAgICAgICAgZmlsbE9wYWNpdHk6IDAuNSxcbiAgICAgICAgICBsaW5lV2lkdGg6IDAsXG4gICAgICAgICAgeUF4aXM6IDAsXG4gICAgICAgICAgekluZGV4OiAwLFxuICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgY2xpY2thYmxlOiB0cnVlLFxuICAgICAgICAgIHRocmVzaG9sZDogbnVsbCxcbiAgICAgICAgICB0b29sdGlwOiB7XG4gICAgICAgICAgICB2YWx1ZURlY2ltYWxzOiAwLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2hvd0luTmF2aWdhdG9yOiB0cnVlLFxuICAgICAgICB9XVxuICAgIH1cbiAgfVxuICBcbiAgaW5pdCgpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZU9wdGlvbnModGhpcy5vcHRpb25zKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChvcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gKHdpbmRvdy5IaWdoY2hhcnRzKSA/IEhpZ2hjaGFydHMuc3RvY2tDaGFydCh0aGlzLmNvbnRhaW5lci5pZCwgb3B0aW9ucywgKGNoYXJ0KSA9PiB0aGlzLmJpbmQoY2hhcnQpKSA6IG51bGw7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHBhcnNlT3B0aW9ucyhvcHRpb25zKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLnVwZGF0ZU9iamVjdCh0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChuZXdPcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAudXBkYXRlT2JqZWN0KHRoaXMuZ2V0Vm9sdW1lUGF0dGVybigpLCBuZXdPcHRpb25zKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChuZXdPcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zZXROYXZpZ2F0b3IobmV3T3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigobmV3T3B0aW9ucykgPT4ge1xuICAgICAgcmV0dXJuIChuZXdPcHRpb25zLm5vRGF0YSkgPyB0aGlzLnNldE5vRGF0YUxhYmVsKG5ld09wdGlvbnMpIDogbmV3T3B0aW9ucztcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChuZXdPcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gbmV3T3B0aW9ucztcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgYmluZChjaGFydCl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNoYXJ0ID0gY2hhcnQ7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5mZXRjaERhdGFQYWNrYWdlKCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRSYW5nZVN3aXRjaGVyKCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gKHRoaXMuY2FsbGJhY2spID8gdGhpcy5jYWxsYmFjayh0aGlzLmNoYXJ0LCB0aGlzLmRlZmF1bHRSYW5nZSkgOiBudWxsO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBmZXRjaERhdGFQYWNrYWdlKG1pbkRhdGUsIG1heERhdGUpe1xuICAgIGxldCBpc1ByZWNpc2VSYW5nZSA9IChtaW5EYXRlICYmIG1heERhdGUpO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNwRXZlbnRzKXtcbiAgICAgICAgbGV0IHVybCA9IChpc1ByZWNpc2VSYW5nZSkgPyB0aGlzLmdldE5hdmlnYXRvckV4dHJlbWVzVXJsKG1pbkRhdGUsIG1heERhdGUsICdldmVudHMnKSA6IHRoaXMuZ2V0RXh0cmVtZXNEYXRhVXJsKHRoaXMuaWQsICdldmVudHMnKSArICcvJyArIHRoaXMuZ2V0UmFuZ2UoKSArICcvJztcbiAgICAgICAgcmV0dXJuICh1cmwpID8gdGhpcy5mZXRjaERhdGEodXJsLCAnZXZlbnRzJywgIWlzUHJlY2lzZVJhbmdlKSA6IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGxldCB1cmwgPSAoKGlzUHJlY2lzZVJhbmdlKSA/IHRoaXMuZ2V0TmF2aWdhdG9yRXh0cmVtZXNVcmwobWluRGF0ZSwgbWF4RGF0ZSkgOiB0aGlzLmFzeW5jVXJsLnJlcGxhY2UoJ19yYW5nZV8nLCB0aGlzLmdldFJhbmdlKCkpKSArIHRoaXMuYXN5bmNQYXJhbXM7XG4gICAgICByZXR1cm4gKHVybCkgPyB0aGlzLmZldGNoRGF0YSh1cmwsICdkYXRhJywgIWlzUHJlY2lzZVJhbmdlKSA6IG51bGw7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFydC5yZWRyYXcoZmFsc2UpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuICghaXNQcmVjaXNlUmFuZ2UpID8gdGhpcy5jaGFydC56b29tT3V0KCkgOiBudWxsO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaXNMb2FkZWQgPSB0cnVlO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMudG9nZ2xlRXZlbnRzKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGZldGNoRGF0YSh1cmwsIGRhdGFUeXBlID0gJ2RhdGEnLCByZXBsYWNlID0gdHJ1ZSl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuY2hhcnQuc2hvd0xvYWRpbmcoKTtcbiAgICAgIHJldHVybiBmZXRjaFNlcnZpY2UuZmV0Y2hDaGFydERhdGEodXJsLCAhdGhpcy5pc0xvYWRlZCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHRoaXMuY2hhcnQuaGlkZUxvYWRpbmcoKTtcbiAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICByZXR1cm4gY29uc29sZS5sb2coYExvb2tzIGxpa2UgdGhlcmUgd2FzIGEgcHJvYmxlbS4gU3RhdHVzIENvZGU6ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhUGFyc2VyKGRhdGEsIGRhdGFUeXBlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGNvbnRlbnQpID0+IHtcbiAgICAgICAgICByZXR1cm4gKHJlcGxhY2UpID8gdGhpcy5yZXBsYWNlRGF0YShjb250ZW50LmRhdGEsIGRhdGFUeXBlKSA6IHRoaXMudXBkYXRlRGF0YShjb250ZW50LmRhdGEsIGRhdGFUeXBlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICB0aGlzLmNoYXJ0LmhpZGVMb2FkaW5nKCk7XG4gICAgICB0aGlzLmhpZGVDaGFydCgpO1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCdGZXRjaCBFcnJvcicsIGVycm9yKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgaGlkZUNoYXJ0KGJvb2wgPSB0cnVlKXtcbiAgICBjb25zdCBjbGFzc0Z1bmMgPSAoYm9vbCkgPyAnYWRkJyA6ICdyZW1vdmUnO1xuICAgIGNvbnN0IHNpYmxpbmdzID0gY3BCb290c3RyYXAubm9kZUxpc3RUb0FycmF5KHRoaXMuY29udGFpbmVyLnBhcmVudEVsZW1lbnQuY2hpbGROb2Rlcyk7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBzaWJsaW5ncy5maWx0ZXIoZWxlbWVudCA9PiBlbGVtZW50LmlkLnNlYXJjaCgnY2hhcnQnKSA9PT0gLTEpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AocmVzdWx0LCBlbGVtZW50ID0+IGVsZW1lbnQuY2xhc3NMaXN0W2NsYXNzRnVuY10oJ2NwLWhpZGRlbicpKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRhaW5lci5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdFtjbGFzc0Z1bmNdKCdjcC1jaGFydC1uby1kYXRhJyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHNldFJhbmdlU3dpdGNoZXIoKXtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGAkeyB0aGlzLmlkIH0tc3dpdGNoLXJhbmdlYCwgKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLmRlZmF1bHRSYW5nZSA9IGV2ZW50LmRldGFpbC5kYXRhO1xuICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hEYXRhUGFja2FnZSgpO1xuICAgIH0pO1xuICB9XG4gIFxuICBnZXRSYW5nZSgpe1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRSYW5nZSB8fCAnMXEnO1xuICB9XG4gIFxuICB0b2dnbGVFdmVudHMoKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY3BFdmVudHMpe1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdoaWdoY2hhcnRzLWFubm90YXRpb24nKTtcbiAgICAgIH0pO1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoZWxlbWVudHMpID0+IHtcbiAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AoZWxlbWVudHMsIGVsZW1lbnQgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmlzRXZlbnRzSGlkZGVuKXtcbiAgICAgICAgICAgIHJldHVybiAoIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWdoY2hhcnRzLWFubm90YXRpb25fX2hpZGRlbicpKSA/IGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlnaGNoYXJ0cy1hbm5vdGF0aW9uX19oaWRkZW4nKSA6IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZ2hjaGFydHMtYW5ub3RhdGlvbl9faGlkZGVuJykpID8gZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdoY2hhcnRzLWFubm90YXRpb25fX2hpZGRlbicpIDogbnVsbDtcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdoaWdoY2hhcnRzLXBsb3QtbGluZScpO1xuICAgICAgfSk7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChlbGVtZW50cykgPT4ge1xuICAgICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChlbGVtZW50cywgZWxlbWVudCA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNFdmVudHNIaWRkZW4pe1xuICAgICAgICAgICAgcmV0dXJuICghZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZ2hjaGFydHMtcGxvdC1saW5lX19oaWRkZW4nKSkgPyBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZ2hjaGFydHMtcGxvdC1saW5lX19oaWRkZW4nKSA6IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZ2hjaGFydHMtcGxvdC1saW5lX19oaWRkZW4nKSkgPyBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hjaGFydHMtcGxvdC1saW5lX19oaWRkZW4nKSA6IG51bGw7XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGRhdGFQYXJzZXIoZGF0YSwgZGF0YVR5cGUgPSAnZGF0YScpe1xuICAgIHN3aXRjaCAoZGF0YVR5cGUpe1xuICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgIGxldCBwcm9taXNlRGF0YSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlRGF0YSA9IHByb21pc2VEYXRhLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiAodGhpcy5jaGFydERhdGFQYXJzZXIpID8gdGhpcy5jaGFydERhdGFQYXJzZXIoZGF0YSkgOiB7XG4gICAgICAgICAgICBkYXRhOiBkYXRhWzBdLFxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZURhdGE7XG4gICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGRhdGEpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIFxuICB1cGRhdGVEYXRhKGRhdGEsIGRhdGFUeXBlKSB7XG4gICAgbGV0IG5ld0RhdGE7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHN3aXRjaCAoZGF0YVR5cGUpIHtcbiAgICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgICAgbmV3RGF0YSA9IHt9O1xuICAgICAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKE9iamVjdC5lbnRyaWVzKGRhdGEpLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRXhjbHVkZWQodmFsdWVbMF0pKSByZXR1cm47XG4gICAgICAgICAgICBsZXQgb2xkRGF0YSA9IHRoaXMuZ2V0T2xkRGF0YShkYXRhVHlwZSlbdmFsdWVbMF1dO1xuICAgICAgICAgICAgbmV3RGF0YVt2YWx1ZVswXV0gPSBvbGREYXRhXG4gICAgICAgICAgICAgIC5maWx0ZXIoKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVbMV0uZmluZEluZGV4KGZpbmRFbGVtZW50ID0+IHRoaXMuaXNUaGVTYW1lRWxlbWVudChlbGVtZW50LCBmaW5kRWxlbWVudCwgZGF0YVR5cGUpKSA9PT0gLTE7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5jb25jYXQodmFsdWVbMV0pXG4gICAgICAgICAgICAgIC5zb3J0KChkYXRhMSwgZGF0YTIpID0+IHRoaXMuc29ydENvbmRpdGlvbihkYXRhMSwgZGF0YTIsIGRhdGFUeXBlKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgICAgbmV3RGF0YSA9IFtdO1xuICAgICAgICAgIGxldCBvbGREYXRhID0gdGhpcy5nZXRPbGREYXRhKGRhdGFUeXBlKTtcbiAgICAgICAgICByZXR1cm4gbmV3RGF0YSA9IG9sZERhdGFcbiAgICAgICAgICAgIC5maWx0ZXIoKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgZGF0YS5maW5kSW5kZXgoZmluZEVsZW1lbnQgPT4gdGhpcy5pc1RoZVNhbWVFbGVtZW50KGVsZW1lbnQsIGZpbmRFbGVtZW50LCBkYXRhVHlwZSkpID09PSAtMTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY29uY2F0KGRhdGEpXG4gICAgICAgICAgICAuc29ydCgoZGF0YTEsIGRhdGEyKSA9PiB0aGlzLnNvcnRDb25kaXRpb24oZGF0YTEsIGRhdGEyLCBkYXRhVHlwZSkpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VEYXRhKG5ld0RhdGEsIGRhdGFUeXBlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgaXNUaGVTYW1lRWxlbWVudChlbGVtZW50QSwgZWxlbWVudEIsIGRhdGFUeXBlKXtcbiAgICBzd2l0Y2ggKGRhdGFUeXBlKXtcbiAgICAgIGNhc2UgJ2RhdGEnOlxuICAgICAgICByZXR1cm4gZWxlbWVudEFbMF0gPT09IGVsZW1lbnRCWzBdO1xuICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRBLnRzID09PSBlbGVtZW50Qi50cztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgXG4gIHNvcnRDb25kaXRpb24oZWxlbWVudEEsIGVsZW1lbnRCLCBkYXRhVHlwZSl7XG4gICAgc3dpdGNoIChkYXRhVHlwZSl7XG4gICAgICBjYXNlICdkYXRhJzpcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRBWzBdIC0gZWxlbWVudEJbMF07XG4gICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICByZXR1cm4gZWxlbWVudEEudHMgLSBlbGVtZW50Qi50cztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgXG4gIGdldE9sZERhdGEoZGF0YVR5cGUpe1xuICAgIHJldHVybiB0aGlzWydjaGFydF8nK2RhdGFUeXBlLnRvTG93ZXJDYXNlKCldO1xuICB9XG4gIFxuICByZXBsYWNlRGF0YShkYXRhLCBkYXRhVHlwZSl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzWydjaGFydF8nK2RhdGFUeXBlLnRvTG93ZXJDYXNlKCldID0gZGF0YTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VEYXRhVHlwZShkYXRhLCBkYXRhVHlwZSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gKHRoaXMucmVwbGFjZUNhbGxiYWNrKSA/IHRoaXMucmVwbGFjZUNhbGxiYWNrKHRoaXMuY2hhcnQsIGRhdGEsIHRoaXMuaXNMb2FkZWQsIGRhdGFUeXBlKSA6IG51bGw7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHJlcGxhY2VEYXRhVHlwZShkYXRhLCBkYXRhVHlwZSl7XG4gICAgc3dpdGNoIChkYXRhVHlwZSl7XG4gICAgICBjYXNlICdkYXRhJzpcbiAgICAgICAgaWYgKHRoaXMuYXN5bmNVcmwpe1xuICAgICAgICAgIGNwQm9vdHN0cmFwLmxvb3AoWydidGMtYml0Y29pbicsICdldGgtZXRoZXJldW0nXSwgY29pbk5hbWUgPT4ge1xuICAgICAgICAgICAgbGV0IGNvaW5TaG9ydCA9IGNvaW5OYW1lLnNwbGl0KCctJylbMF07XG4gICAgICAgICAgICBpZiAodGhpcy5hc3luY1VybC5zZWFyY2goY29pbk5hbWUpID4gLTEgJiYgZGF0YVtjb2luU2hvcnRdKSB7XG4gICAgICAgICAgICAgIGRhdGFbY29pblNob3J0XSA9IFtdO1xuICAgICAgICAgICAgICBjcEJvb3RzdHJhcC5sb29wKHRoaXMuY2hhcnQuc2VyaWVzLCBzZXJpZXMgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzZXJpZXMudXNlck9wdGlvbnMuaWQgPT09IGNvaW5TaG9ydCkgc2VyaWVzLnVwZGF0ZSh7IHZpc2libGU6IGZhbHNlIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChPYmplY3QuZW50cmllcyhkYXRhKSwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNFeGNsdWRlZCh2YWx1ZVswXSkpIHJldHVybjtcbiAgICAgICAgICByZXR1cm4gKHRoaXMuY2hhcnQuZ2V0KHZhbHVlWzBdKSkgPyB0aGlzLmNoYXJ0LmdldCh2YWx1ZVswXSkuc2V0RGF0YSh2YWx1ZVsxXSwgZmFsc2UsIGZhbHNlLCBmYWxzZSkgOiB0aGlzLmNoYXJ0LmFkZFNlcmllcyh7aWQ6IHZhbHVlWzBdLCBkYXRhOiB2YWx1ZVsxXSwgc2hvd0luTmF2aWdhdG9yOiB0cnVlfSk7XG4gICAgICAgIH0pO1xuICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AodGhpcy5jaGFydC5hbm5vdGF0aW9ucy5hbGxJdGVtcywgYW5ub3RhdGlvbiA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYW5ub3RhdGlvbi5kZXN0cm95KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRBbm5vdGF0aW9uc09iamVjdHMoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuICBcbiAgaXNFeGNsdWRlZChsYWJlbCl7XG4gICAgcmV0dXJuIHRoaXMuZXhjbHVkZVNlcmllc0lkcy5pbmRleE9mKGxhYmVsKSA+IC0xO1xuICB9XG4gIFxuICB0b29sdGlwRm9ybWF0dGVyKHBvaW50ZXIsIGxhYmVsID0gJycsIHNlYXJjaCl7XG4gICAgaWYgKCFzZWFyY2gpIHNlYXJjaCA9IGxhYmVsO1xuICAgIGNvbnN0IGhlYWRlciA9ICc8ZGl2IGNsYXNzPVwiY3AtY2hhcnQtdG9vbHRpcC1jdXJyZW5jeVwiPjxzbWFsbD4nK25ldyBEYXRlKHBvaW50ZXIueCkudG9VVENTdHJpbmcoKSsnPC9zbWFsbD48dGFibGU+JztcbiAgICBjb25zdCBmb290ZXIgPSAnPC90YWJsZT48L2Rpdj4nO1xuICAgIGxldCBjb250ZW50ID0gJyc7XG4gICAgcG9pbnRlci5wb2ludHMuZm9yRWFjaChwb2ludCA9PiB7XG4gICAgICBjb250ZW50ICs9ICc8dHI+JyArXG4gICAgICAgICc8dGQgY2xhc3M9XCJjcC1jaGFydC10b29sdGlwLWN1cnJlbmN5X19yb3dcIj4nICtcbiAgICAgICAgJzxzdmcgY2xhc3M9XCJjcC1jaGFydC10b29sdGlwLWN1cnJlbmN5X19pY29uXCIgd2lkdGg9XCI1XCIgaGVpZ2h0PVwiNVwiPjxyZWN0IHg9XCIwXCIgeT1cIjBcIiB3aWR0aD1cIjVcIiBoZWlnaHQ9XCI1XCIgZmlsbD1cIicrcG9pbnQuc2VyaWVzLmNvbG9yKydcIiBmaWxsLW9wYWNpdHk9XCIxXCI+PC9yZWN0Pjwvc3ZnPicgK1xuICAgICAgICBwb2ludC5zZXJpZXMubmFtZSArICc6ICcgKyBwb2ludC55LnRvTG9jYWxlU3RyaW5nKCdydS1SVScsIHsgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiA4IH0pLnJlcGxhY2UoJywnLCAnLicpICsgJyAnICsgKChwb2ludC5zZXJpZXMubmFtZS50b0xvd2VyQ2FzZSgpLnNlYXJjaChzZWFyY2gudG9Mb3dlckNhc2UoKSkgPiAtMSkgPyBcIlwiIDogbGFiZWwpICtcbiAgICAgICAgJzwvdGQ+JyArXG4gICAgICAgICc8L3RyPic7XG4gICAgfSk7XG4gICAgcmV0dXJuIGhlYWRlciArIGNvbnRlbnQgKyBmb290ZXI7XG4gIH1cbiAgXG4gIHNldEFubm90YXRpb25zT2JqZWN0cyhkYXRhKXtcbiAgICB0aGlzLmNoYXJ0LnNlcmllc1swXS54QXhpcy5yZW1vdmVQbG90TGluZSgpO1xuICAgIGxldCBwbG90TGluZXMgPSBbXTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGRhdGEuc29ydCgoZGF0YTEsIGRhdGEyKSA9PiB7XG4gICAgICAgIHJldHVybiBkYXRhMi50cyAtIGRhdGExLnRzO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChkYXRhLCBlbGVtZW50ID0+IHtcbiAgICAgICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHBsb3RMaW5lcy5wdXNoKHtcbiAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgdmFsdWU6IGVsZW1lbnQudHMsXG4gICAgICAgICAgICBkYXNoU3R5bGU6ICdzb2xpZCcsXG4gICAgICAgICAgICB6SW5kZXg6IDQsXG4gICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRFdmVudFRhZ1BhcmFtcygpLmNvbG9yLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY2hhcnQuYWRkQW5ub3RhdGlvbih7XG4gICAgICAgICAgICB4VmFsdWU6IGVsZW1lbnQudHMsXG4gICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgdGl0bGU6IGA8c3BhbiB0aXRsZT1cIkNsaWNrIHRvIG9wZW5cIiBjbGFzcz1cImNwLWNoYXJ0LWFubm90YXRpb25fX3RleHRcIj4keyB0aGlzLmdldEV2ZW50VGFnUGFyYW1zKGVsZW1lbnQudGFnKS5sYWJlbCB9PC9zcGFuPjxzcGFuIGNsYXNzPVwiY3AtY2hhcnQtYW5ub3RhdGlvbl9fZGF0YUVsZW1lbnRcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+JHsgSlNPTi5zdHJpbmdpZnkoZWxlbWVudCkgfTwvc3Bhbj5gLFxuICAgICAgICAgICAgc2hhcGU6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ2NpcmNsZScsXG4gICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIHI6IDExLFxuICAgICAgICAgICAgICAgIGN4OiA5LFxuICAgICAgICAgICAgICAgIGN5OiAxMC41LFxuICAgICAgICAgICAgICAgICdzdHJva2Utd2lkdGgnOiAxLjUsXG4gICAgICAgICAgICAgICAgZmlsbDogdGhpcy5nZXRFdmVudFRhZ1BhcmFtcygpLmNvbG9yLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICBtb3VzZW92ZXI6IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChNb2JpbGVEZXRlY3QuaXNNb2JpbGUoKSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gdGhpcy5nZXRFdmVudERhdGFGcm9tQW5ub3RhdGlvbkV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5FdmVudENvbnRhaW5lcihkYXRhLCBldmVudCk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG1vdXNlb3V0OiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKE1vYmlsZURldGVjdC5pc01vYmlsZSgpKSByZXR1cm47XG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZUV2ZW50Q29udGFpbmVyKGV2ZW50KTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gdGhpcy5nZXRFdmVudERhdGFGcm9tQW5ub3RhdGlvbkV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgICAgICBpZiAoTW9iaWxlRGV0ZWN0LmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMub3BlbkV2ZW50Q29udGFpbmVyKGRhdGEsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuRXZlbnRQYWdlKGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNoYXJ0LnNlcmllc1swXS54QXhpcy51cGRhdGUoe1xuICAgICAgICBwbG90TGluZXMsXG4gICAgICB9LCBmYWxzZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHNldE5hdmlnYXRvcihvcHRpb25zKXtcbiAgICBsZXQgbmF2aWdhdG9yT3B0aW9ucyA9IHt9O1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBpZiAob3B0aW9ucy5uYXZpZ2F0b3IgPT09IHRydWUpe1xuICAgICAgICBuYXZpZ2F0b3JPcHRpb25zID0ge1xuICAgICAgICAgIG5hdmlnYXRvcjoge1xuICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgbWFyZ2luOiAyMCxcbiAgICAgICAgICAgIHNlcmllczoge1xuICAgICAgICAgICAgICBsaW5lV2lkdGg6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWFza0ZpbGw6ICdyZ2JhKDEwMiwxMzMsMTk0LDAuMTUpJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICB6b29tVHlwZTogJ3gnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgeEF4aXM6IHtcbiAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICBzZXRFeHRyZW1lczogKGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoKGUudHJpZ2dlciA9PT0gJ25hdmlnYXRvcicgfHwgZS50cmlnZ2VyID09PSAnem9vbScpICYmIGUubWluICYmIGUubWF4KSB7XG4gICAgICAgICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCh0aGlzLmlkKydTZXRFeHRyZW1lcycsIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgbWluRGF0ZTogZS5taW4sXG4gICAgICAgICAgICAgICAgICAgICAgbWF4RGF0ZTogZS5tYXgsXG4gICAgICAgICAgICAgICAgICAgICAgZSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5uYXZpZ2F0b3JFeHRyZW1lc0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuc2V0UmVzZXRab29tQnV0dG9uKCk7XG4gICAgICB9IGVsc2UgaWYgKCFvcHRpb25zLm5hdmlnYXRvcikge1xuICAgICAgICBuYXZpZ2F0b3JPcHRpb25zID0ge1xuICAgICAgICAgIG5hdmlnYXRvcjoge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC51cGRhdGVPYmplY3Qob3B0aW9ucywgbmF2aWdhdG9yT3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHNldFJlc2V0Wm9vbUJ1dHRvbigpe1xuICAgIC8vIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTsgLy8gY2FudCBiZSBwb3NpdGlvbmVkIHByb3Blcmx5IGluIHBsb3RCb3gsIHNvIGl0cyBkaXNhYmxlZFxuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hZGRDb250YWluZXIodGhpcy5pZCwgJ1Jlc2V0Wm9vbScsICdjcC1jaGFydC1yZXNldC16b29tJywgJ2J1dHRvbicpXG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRDb250YWluZXIoJ1Jlc2V0Wm9vbScpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGVsZW1lbnQpID0+IHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgndWstYnV0dG9uJyk7XG4gICAgICBlbGVtZW50LmlubmVyVGV4dCA9ICdSZXNldCB6b29tJztcbiAgICAgIHJldHVybiBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICB0aGlzLmNoYXJ0Lnpvb21PdXQoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBuYXZpZ2F0b3JFeHRyZW1lc0xpc3RlbmVyKCkge1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmlkICsgJ1NldEV4dHJlbWVzJywgKGUpID0+IHtcbiAgICAgICAgbGV0IG1pbkRhdGUgPSBjcEJvb3RzdHJhcC5yb3VuZChlLmRldGFpbC5taW5EYXRlIC8gMTAwMCwgMCk7XG4gICAgICAgIGxldCBtYXhEYXRlID0gY3BCb290c3RyYXAucm91bmQoZS5kZXRhaWwubWF4RGF0ZSAvIDEwMDAsIDApO1xuICAgICAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5mZXRjaERhdGFQYWNrYWdlKG1pbkRhdGUsIG1heERhdGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgZ2V0TmF2aWdhdG9yRXh0cmVtZXNVcmwobWluRGF0ZSwgbWF4RGF0ZSwgZGF0YVR5cGUpe1xuICAgIGxldCBleHRyZW1lc0RhdGFVcmwgPSAoZGF0YVR5cGUpID8gdGhpcy5nZXRFeHRyZW1lc0RhdGFVcmwodGhpcy5pZCwgZGF0YVR5cGUpIDogdGhpcy5leHRyZW1lc0RhdGFVcmw7XG4gICAgcmV0dXJuIChtaW5EYXRlICYmIG1heERhdGUgJiYgZXh0cmVtZXNEYXRhVXJsKSA/IGV4dHJlbWVzRGF0YVVybCArJy9kYXRlcy8nK21pbkRhdGUrJy8nK21heERhdGUrJy8nIDogbnVsbDtcbiAgfVxuICBcbiAgc2V0Tm9EYXRhTGFiZWwob3B0aW9ucyl7XG4gICAgbGV0IG5vRGF0YU9wdGlvbnMgPSB7fTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgbm9EYXRhT3B0aW9ucyA9IHtcbiAgICAgICAgbGFuZzoge1xuICAgICAgICAgIG5vRGF0YTogJ1dlIGRvblxcJ3QgaGF2ZSBkYXRhIGZvciB0aGlzIHRpbWUgcGVyaW9kJ1xuICAgICAgICB9LFxuICAgICAgICBub0RhdGE6IHtcbiAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgZm9udEZhbWlseTogJ0FyaWFsJyxcbiAgICAgICAgICAgIGZvbnRTaXplOiAnMTRweCcsXG4gICAgICAgICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLnVwZGF0ZU9iamVjdChvcHRpb25zLCBub0RhdGFPcHRpb25zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgYWRkQ29udGFpbmVyKGlkLCBsYWJlbCwgY2xhc3NOYW1lLCB0YWdOYW1lID0gJ2Rpdicpe1xuICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xuICAgIGxldCBjaGFydENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICBjb250YWluZXIuaWQgPSBpZCArIGxhYmVsO1xuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgY2hhcnRDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgfVxuICBcbiAgZ2V0Q29udGFpbmVyKGxhYmVsKXtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCtsYWJlbCk7XG4gIH1cbiAgXG4gIGdldEV4dHJlbWVzRGF0YVVybChpZCwgZGF0YVR5cGUgPSAnZGF0YScpe1xuICAgIHJldHVybiAnL2N1cnJlbmN5LycrIGRhdGFUeXBlICsnLycrIHRoaXMuY3VycmVuY3k7XG4gIH1cbiAgXG4gIGdldFZvbHVtZVBhdHRlcm4oKXtcbiAgICByZXR1cm4ge1xuICAgICAgZGVmczoge1xuICAgICAgICBwYXR0ZXJuczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdpZCc6ICdmaWxsLXBhdHRlcm4nLFxuICAgICAgICAgICAgJ3BhdGgnOiB7XG4gICAgICAgICAgICAgIGQ6ICdNIDMgMCBMIDMgMTAgTSA4IDAgTCA4IDEwJyxcbiAgICAgICAgICAgICAgc3Ryb2tlOiBcIiNlM2UzZTNcIixcbiAgICAgICAgICAgICAgZmlsbDogJyNmMWYxZjEnLFxuICAgICAgICAgICAgICBzdHJva2VXaWR0aDogMixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnaWQnOiAnZmlsbC1wYXR0ZXJuLW5pZ2h0JyxcbiAgICAgICAgICAgICdwYXRoJzoge1xuICAgICAgICAgICAgICBkOiAnTSAzIDAgTCAzIDEwIE0gOCAwIEwgOCAxMCcsXG4gICAgICAgICAgICAgIHN0cm9rZTogXCIjOWI5YjliXCIsXG4gICAgICAgICAgICAgIGZpbGw6ICcjMzgzODM4JyxcbiAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IDIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cblxuY2xhc3MgYm9vdHN0cmFwQ2xhc3Mge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVtcHR5VmFsdWUgPSAwO1xuICAgIHRoaXMuZW1wdHlEYXRhID0gJy0nO1xuICB9XG4gIFxuICBub2RlTGlzdFRvQXJyYXkobm9kZUxpc3QpIHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobm9kZUxpc3QpO1xuICB9XG4gIFxuICBwYXJzZUludGVydmFsVmFsdWUodmFsdWUpIHtcbiAgICBsZXQgdGltZVN5bWJvbCA9ICcnLCBtdWx0aXBsaWVyID0gMTtcbiAgICBpZiAodmFsdWUuc2VhcmNoKCdzJykgPiAtMSkge1xuICAgICAgdGltZVN5bWJvbCA9ICdzJztcbiAgICAgIG11bHRpcGxpZXIgPSAxMDAwO1xuICAgIH1cbiAgICBpZiAodmFsdWUuc2VhcmNoKCdtJykgPiAtMSkge1xuICAgICAgdGltZVN5bWJvbCA9ICdtJztcbiAgICAgIG11bHRpcGxpZXIgPSA2MCAqIDEwMDA7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5zZWFyY2goJ2gnKSA+IC0xKSB7XG4gICAgICB0aW1lU3ltYm9sID0gJ2gnO1xuICAgICAgbXVsdGlwbGllciA9IDYwICogNjAgKiAxMDAwO1xuICAgIH1cbiAgICBpZiAodmFsdWUuc2VhcmNoKCdkJykgPiAtMSkge1xuICAgICAgdGltZVN5bWJvbCA9ICdkJztcbiAgICAgIG11bHRpcGxpZXIgPSAyNCAqIDYwICogNjAgKiAxMDAwO1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZS5yZXBsYWNlKHRpbWVTeW1ib2wsICcnKSkgKiBtdWx0aXBsaWVyO1xuICB9XG4gIFxuICBpc0ZpYXQoY3VycmVuY3ksIG9yaWdpbil7XG4gICAgaWYgKCFvcmlnaW4pIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGxldCB1cmwgPSBvcmlnaW4gKyAnL2Rpc3QvZGF0YS9jdXJyZW5jaWVzLmpzb24nO1xuICAgICAgcmV0dXJuIGZldGNoU2VydmljZS5mZXRjaEpzb25GaWxlKHVybCwgdHJ1ZSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICByZXR1cm4gKHJlc3VsdFtjdXJyZW5jeS50b1VwcGVyQ2FzZSgpXSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHVwZGF0ZU9iamVjdChvYmosIG5ld09iaikge1xuICAgIGxldCByZXN1bHQgPSBvYmo7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKE9iamVjdC5rZXlzKG5ld09iaiksIGtleSA9PiB7XG4gICAgICAgIGlmIChyZXN1bHQuaGFzT3duUHJvcGVydHkoa2V5KSAmJiB0eXBlb2YgcmVzdWx0W2tleV0gPT09ICdvYmplY3QnKXtcbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVPYmplY3QocmVzdWx0W2tleV0sIG5ld09ialtrZXldKS50aGVuKCh1cGRhdGVSZXN1bHQpID0+IHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdXBkYXRlUmVzdWx0O1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRba2V5XSA9IG5ld09ialtrZXldO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHBhcnNlQ3VycmVuY3lOdW1iZXIodmFsdWUsIGN1cnJlbmN5LCBvcmlnaW4pe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5pc0ZpYXQoY3VycmVuY3ksIG9yaWdpbik7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICByZXR1cm4gKHJlc3VsdCkgPyB0aGlzLnBhcnNlTnVtYmVyKHZhbHVlLCAyKSA6IHRoaXMucGFyc2VOdW1iZXIodmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBwYXJzZU51bWJlcihudW1iZXIsIHByZWNpc2lvbikge1xuICAgIGlmICghbnVtYmVyICYmIG51bWJlciAhPT0gMCkgcmV0dXJuIG51bWJlcjtcbiAgICBpZiAobnVtYmVyID09PSB0aGlzLmVtcHR5VmFsdWUgfHwgbnVtYmVyID09PSB0aGlzLmVtcHR5RGF0YSkgcmV0dXJuIG51bWJlcjtcbiAgICBudW1iZXIgPSBwYXJzZUZsb2F0KG51bWJlcik7XG4gICAgaWYgKG51bWJlciA+IDEwMDAwMCkge1xuICAgICAgbGV0IG51bWJlclN0ciA9IG51bWJlci50b0ZpeGVkKDApO1xuICAgICAgbGV0IHBhcmFtZXRlciA9ICdLJyxcbiAgICAgICAgc3BsaWNlZCA9IG51bWJlclN0ci5zbGljZSgwLCBudW1iZXJTdHIubGVuZ3RoIC0gMSk7XG4gICAgICBpZiAobnVtYmVyID4gMTAwMDAwMDAwMCkge1xuICAgICAgICBzcGxpY2VkID0gbnVtYmVyU3RyLnNsaWNlKDAsIG51bWJlclN0ci5sZW5ndGggLSA3KTtcbiAgICAgICAgcGFyYW1ldGVyID0gJ0InO1xuICAgICAgfSBlbHNlIGlmIChudW1iZXIgPiAxMDAwMDAwKSB7XG4gICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDQpO1xuICAgICAgICBwYXJhbWV0ZXIgPSAnTSc7XG4gICAgICB9XG4gICAgICBsZXQgbmF0dXJhbCA9IHNwbGljZWQuc2xpY2UoMCwgc3BsaWNlZC5sZW5ndGggLSAyKTtcbiAgICAgIGxldCBkZWNpbWFsID0gc3BsaWNlZC5zbGljZShzcGxpY2VkLmxlbmd0aCAtIDIpO1xuICAgICAgcmV0dXJuIG5hdHVyYWwgKyAnLicgKyBkZWNpbWFsICsgJyAnICsgcGFyYW1ldGVyO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgaXNEZWNpbWFsID0gKG51bWJlciAlIDEpID4gMDtcbiAgICAgIGlmIChpc0RlY2ltYWwpIHtcbiAgICAgICAgaWYgKCFwcmVjaXNpb24gfHwgbnVtYmVyIDwgMC4wMSl7XG4gICAgICAgICAgcHJlY2lzaW9uID0gMjtcbiAgICAgICAgICBpZiAobnVtYmVyIDwgMSkge1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gODtcbiAgICAgICAgICB9IGVsc2UgaWYgKG51bWJlciA8IDEwKSB7XG4gICAgICAgICAgICBwcmVjaXNpb24gPSA2O1xuICAgICAgICAgIH0gZWxzZSBpZiAobnVtYmVyIDwgMTAwMCkge1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gNDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucm91bmQobnVtYmVyLCBwcmVjaXNpb24pLnRvTG9jYWxlU3RyaW5nKCdydS1SVScsIHsgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiBwcmVjaXNpb24gfSkucmVwbGFjZSgnLCcsICcuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVtYmVyLnRvTG9jYWxlU3RyaW5nKCdydS1SVScsIHsgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyIH0pLnJlcGxhY2UoJywnLCAnLicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgcm91bmQoYW1vdW50LCBkZWNpbWFsID0gOCwgZGlyZWN0aW9uID0gJ3JvdW5kJykge1xuICAgIGFtb3VudCA9IHBhcnNlRmxvYXQoYW1vdW50KTtcbiAgICBkZWNpbWFsID0gTWF0aC5wb3coMTAsIGRlY2ltYWwpO1xuICAgIHJldHVybiBNYXRoW2RpcmVjdGlvbl0oYW1vdW50ICogZGVjaW1hbCkgLyBkZWNpbWFsO1xuICB9XG4gIFxuICBsb29wKGFyciwgZm4sIGJ1c3ksIGVyciwgaSA9IDApIHtcbiAgICBjb25zdCBib2R5ID0gKG9rLCBlcikgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgciA9IGZuKGFycltpXSwgaSwgYXJyKTtcbiAgICAgICAgciAmJiByLnRoZW4gPyByLnRoZW4ob2spLmNhdGNoKGVyKSA6IG9rKHIpXG4gICAgICB9XG4gICAgICBjYXRjaCAoZSkge1xuICAgICAgICBlcihlKVxuICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgbmV4dCA9IChvaywgZXIpID0+ICgpID0+IHRoaXMubG9vcChhcnIsIGZuLCBvaywgZXIsICsraSk7XG4gICAgY29uc3QgcnVuID0gKG9rLCBlcikgPT4gaSA8IGFyci5sZW5ndGggPyBuZXcgUHJvbWlzZShib2R5KS50aGVuKG5leHQob2ssIGVyKSkuY2F0Y2goZXIpIDogb2soKTtcbiAgICByZXR1cm4gYnVzeSA/IHJ1bihidXN5LCBlcnIpIDogbmV3IFByb21pc2UocnVuKVxuICB9XG59XG5cbmNsYXNzIGZldGNoQ2xhc3Mge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMuc3RhdGUgPSB7fTtcbiAgfVxuICBcbiAgZmV0Y2hTY3JpcHQodXJsKSB7XG4gICAgaWYgKHRoaXMuc3RhdGVbdXJsXSkgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICB0aGlzLnN0YXRlW3VybF0gPSAncGVuZGluZyc7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlKSB0aGlzLnN0YXRlW3VybF0gPSAnZG93bmxvYWRlZCc7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgICAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSkgZGVsZXRlIHRoaXMuc3RhdGVbdXJsXTtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgRmFpbGVkIHRvIGxvYWQgaW1hZ2UncyBVUkw6ICR7dXJsfWApKTtcbiAgICAgIH0pO1xuICAgICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcbiAgICAgIHNjcmlwdC5zcmMgPSB1cmw7XG4gICAgfSk7XG4gIH1cbiAgXG4gIGZldGNoU3R5bGUodXJsKSB7XG4gICAgaWYgKHRoaXMuc3RhdGVbdXJsXSkgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICB0aGlzLnN0YXRlW3VybF0gPSAncGVuZGluZyc7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG4gICAgICBsaW5rLnNldEF0dHJpYnV0ZSgncmVsJywgJ3N0eWxlc2hlZXQnKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnaHJlZicsIHVybCk7XG4gICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlKSB0aGlzLnN0YXRlW3VybF0gPSAnZG93bmxvYWRlZCc7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUpIGRlbGV0ZSB0aGlzLnN0YXRlW3VybF07XG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYEZhaWxlZCB0byBsb2FkIHN0eWxlIFVSTDogJHt1cmx9YCkpO1xuICAgICAgfSk7XG4gICAgICBsaW5rLmhyZWYgPSB1cmw7XG4gICAgfSk7XG4gIH1cbiAgXG4gIGZldGNoQ2hhcnREYXRhKHVyaSwgZnJvbVN0YXRlID0gZmFsc2Upe1xuICAgIGNvbnN0IHVybCA9ICdodHRwczovL2dyYXBocy5jb2lucGFwcmlrYS5jb20nICsgdXJpO1xuICAgIHJldHVybiB0aGlzLmZldGNoRGF0YSh1cmwsIGZyb21TdGF0ZSk7XG4gIH1cbiAgXG4gIGZldGNoRGF0YSh1cmwsIGZyb21TdGF0ZSA9IGZhbHNlKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKGZyb21TdGF0ZSl7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlW3VybF0gPT09ICdwZW5kaW5nJyl7XG4gICAgICAgICAgbGV0IHByb21pc2VUaW1lb3V0ID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIHJlc29sdmUodGhpcy5mZXRjaERhdGEodXJsLCBmcm9tU3RhdGUpKTtcbiAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHByb21pc2VUaW1lb3V0O1xuICAgICAgICB9XG4gICAgICAgIGlmICghIXRoaXMuc3RhdGVbdXJsXSl7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLnN0YXRlW3VybF0uY2xvbmUoKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuc3RhdGVbdXJsXSA9ICdwZW5kaW5nJztcbiAgICAgIGxldCBwcm9taXNlRmV0Y2ggPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIHByb21pc2VGZXRjaCA9IHByb21pc2VGZXRjaC50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCk7XG4gICAgICB9KTtcbiAgICAgIHByb21pc2VGZXRjaCA9IHByb21pc2VGZXRjaC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICB0aGlzLnN0YXRlW3VybF0gPSByZXNwb25zZTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmNsb25lKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwcm9taXNlRmV0Y2g7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGZldGNoSnNvbkZpbGUodXJsLCBmcm9tU3RhdGUgPSBmYWxzZSl7XG4gICAgcmV0dXJuIHRoaXMuZmV0Y2hEYXRhKHVybCwgZnJvbVN0YXRlKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICBpZiAocmVzdWx0LnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQuanNvbigpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCB3aWRnZXRzID0gbmV3IHdpZGdldHNDb250cm9sbGVyKCk7XG5jb25zdCBjcEJvb3RzdHJhcCA9IG5ldyBib290c3RyYXBDbGFzcygpO1xuY29uc3QgZmV0Y2hTZXJ2aWNlID0gbmV3IGZldGNoQ2xhc3MoKTtcbiJdfQ==
