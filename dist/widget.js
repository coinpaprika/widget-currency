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
      var url = "https://graphsv2.coinpaprika.com".concat(uri);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7SUNBTSxpQkFBaUI7RUFDckIsU0FBQSxrQkFBQSxFQUFjO0lBQUEsZUFBQSxPQUFBLGlCQUFBO0lBQ1osSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLFlBQVksRUFBRTtJQUNqQyxJQUFJLENBQUMsSUFBSSxFQUFFO0VBQ2I7RUFBQyxZQUFBLENBQUEsaUJBQUE7SUFBQSxHQUFBO0lBQUEsS0FBQSxFQUVELFNBQUEsS0FBQSxFQUFNO01BQUEsSUFBQSxLQUFBO01BQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUM3QyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUU7UUFBQSxPQUFNLEtBQUksQ0FBQyxXQUFXLEVBQUU7TUFBQSxHQUFFLEtBQUssQ0FBQztNQUM5RSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxHQUFHLFlBQU07UUFDMUQsTUFBTSxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksR0FBRyxLQUFLO1FBQ3JELEtBQUksQ0FBQyxXQUFXLEVBQUU7TUFDcEIsQ0FBQztJQUNIO0VBQUM7SUFBQSxHQUFBO0lBQUEsS0FBQSxFQUVELFNBQUEsWUFBQSxFQUFhO01BQUEsSUFBQSxNQUFBO01BQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUM7UUFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJO1FBQ3BELElBQUks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QUFLLEdBQUcsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBUztNQUFBLElBQUEsT0FBQTtNQUFBLElBQVAsQ0FBQyxHQUFBLFNBQUEsQ0FBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLE1BQUcsQ0FBQztNQUM1QixJQUFNLElBQUksR0FBRyxTQUFQLElBQUksQ0FBSSxFQUFFLEVBQUUsRUFBRSxFQUFLO1FBQ3ZCLElBQUk7VUFDRixJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUM7VUFDNUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUNELE9BQU8sQ0FBQyxFQUFFO1VBQ1IsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNQO01BQ0YsQ0FBQztNQUNELElBQU0sSUFBSSxHQUFHLFNBQVAsSUFBSSxDQUFJLEVBQUUsRUFBRSxFQUFFO1FBQUEsT0FBSztVQUFBLE9BQU0sT0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFBQTtNQUFBO01BQzlELElBQU0sR0FBRyxHQUFHLFNBQU4sR0FBRyxDQUFJLEVBQUUsRUFBRSxFQUFFO1FBQUEsT0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO01BQUE7TUFDOUYsT0FBTyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUM7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WUFBTTtVQUNyQyxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDbkIsQ0FBQyxDQUFDO1FBQ0YsWUFBWSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBQyxRQUFRLEVBQUs7VUFDN0MsT0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRO1VBQzFCLE9BQU8sUUFBUSxDQUFDLEtBQUssRUFBRTtRQUN6QixDQUFDLENBQUM7UUFDRixPQUFPLFlBQVk7TUFDckIsQ0FBQyxDQUFDO01BQ0YsT0FBTyxPQUFPO0lBQ2hCO0VBQUM7SUFBQSxHQUFBO0lBQUEsS0FBQSxFQUVELFNBQUEsY0FBYyxHQUFHLEVBQW9CO01BQUEsSUFBbEIsU0FBUyxHQUFBLFNBQUEsQ0FBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLE1BQUcsS0FBSztNQUNsQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU0sRUFBSTtRQUNuRCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFO1VBQ3pCLE9BQU8sTUFBTSxDQUFDLElBQUksRUFBRTtRQUN0QjtRQUNBLE9BQU8sS0FBSztNQUNkLENBQUMsQ0FBQyxTQUFNLENBQUMsWUFBTTtRQUNiLE9BQU8sS0FBSztNQUNkLENBQUMsQ0FBQztJQUNKO0VBQUM7RUFBQSxPQUFBLFVBQUE7QUFBQTtBQUdILElBQU0sT0FBTyxHQUFHLElBQUksaUJBQWlCLEVBQUU7QUFDdkMsSUFBTSxXQUFXLEdBQUcsSUFBSSxjQUFjLEVBQUU7QUFDeEMsSUFBTSxZQUFZLEdBQUcsSUFBSSxVQUFVLEVBQUUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjbGFzcyB3aWRnZXRzQ29udHJvbGxlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMud2lkZ2V0cyA9IG5ldyB3aWRnZXRzQ2xhc3MoKTtcbiAgICB0aGlzLmJpbmQoKTtcbiAgfVxuICBcbiAgYmluZCgpe1xuICAgIHdpbmRvd1t0aGlzLndpZGdldHMuZGVmYXVsdHMub2JqZWN0TmFtZV0gPSB7fTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4gdGhpcy5pbml0V2lkZ2V0cygpLCBmYWxzZSk7XG4gICAgd2luZG93W3RoaXMud2lkZ2V0cy5kZWZhdWx0cy5vYmplY3ROYW1lXS5iaW5kV2lkZ2V0ID0gKCkgPT4ge1xuICAgICAgd2luZG93W3RoaXMud2lkZ2V0cy5kZWZhdWx0cy5vYmplY3ROYW1lXS5pbml0ID0gZmFsc2U7XG4gICAgICB0aGlzLmluaXRXaWRnZXRzKCk7XG4gICAgfTtcbiAgfVxuICBcbiAgaW5pdFdpZGdldHMoKXtcbiAgICBpZiAoIXdpbmRvd1t0aGlzLndpZGdldHMuZGVmYXVsdHMub2JqZWN0TmFtZV0uaW5pdCl7XG4gICAgICB3aW5kb3dbdGhpcy53aWRnZXRzLmRlZmF1bHRzLm9iamVjdE5hbWVdLmluaXQgPSB0cnVlO1xuICAgICAgbGV0IG1haW5FbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy53aWRnZXRzLmRlZmF1bHRzLmNsYXNzTmFtZSkpO1xuICAgICAgdGhpcy53aWRnZXRzLnNldFdpZGdldENsYXNzKG1haW5FbGVtZW50cyk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgICB0aGlzLndpZGdldHMuc2V0V2lkZ2V0Q2xhc3MobWFpbkVsZW1lbnRzKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYWluRWxlbWVudHMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgIHRoaXMud2lkZ2V0cy5zZXRCZWZvcmVFbGVtZW50SW5Gb290ZXIoaSk7XG4gICAgICAgIH1cbiAgICAgIH0sIGZhbHNlKTtcbiAgICAgIGxldCBzY3JpcHRFbGVtZW50ID0gdGhpcy53aWRnZXRzLmdldFNjcmlwdEVsZW1lbnQoKTtcbiAgICAgIGlmIChzY3JpcHRFbGVtZW50ICYmIHNjcmlwdEVsZW1lbnQuZGF0YXNldCAmJiBzY3JpcHRFbGVtZW50LmRhdGFzZXQuY3BDdXJyZW5jeVdpZGdldCl7XG4gICAgICAgIGxldCBkYXRhc2V0ID0gSlNPTi5wYXJzZShzY3JpcHRFbGVtZW50LmRhdGFzZXQuY3BDdXJyZW5jeVdpZGdldCk7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhkYXRhc2V0KSl7XG4gICAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhkYXRhc2V0KTtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGtleXMubGVuZ3RoOyBqKyspe1xuICAgICAgICAgICAgbGV0IGtleSA9IGtleXNbal0ucmVwbGFjZSgnLScsICdfJyk7XG4gICAgICAgICAgICB0aGlzLndpZGdldHMuZGVmYXVsdHNba2V5XSA9IGRhdGFzZXRba2V5c1tqXV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy53aWRnZXRzLnN0YXRlcyA9IFtdO1xuICAgICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChtYWluRWxlbWVudHMsIChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICAgIGxldCBuZXdTZXR0aW5ncyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy53aWRnZXRzLmRlZmF1bHRzKSk7XG4gICAgICAgICAgbmV3U2V0dGluZ3MuaXNXb3JkcHJlc3MgPSBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnd29yZHByZXNzJyk7XG4gICAgICAgICAgbmV3U2V0dGluZ3MuaXNOaWdodE1vZGUgPSBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY3Atd2lkZ2V0X19uaWdodC1tb2RlJyk7XG4gICAgICAgICAgbmV3U2V0dGluZ3MubWFpbkVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICAgIHRoaXMud2lkZ2V0cy5zdGF0ZXMucHVzaChuZXdTZXR0aW5ncyk7XG4gICAgICAgICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGxldCBjaGFydFNjcmlwdHMgPSBbXG4gICAgICAgICAgICAgICcvL2NvZGUuaGlnaGNoYXJ0cy5jb20vc3RvY2svaGlnaHN0b2NrLmpzJyxcbiAgICAgICAgICAgICAgJy8vY29kZS5oaWdoY2hhcnRzLmNvbS9tb2R1bGVzL2V4cG9ydGluZy5qcycsXG4gICAgICAgICAgICAgICcvL2NvZGUuaGlnaGNoYXJ0cy5jb20vbW9kdWxlcy9uby1kYXRhLXRvLWRpc3BsYXkuanMnLFxuICAgICAgICAgICAgICAnLy9oaWdoY2hhcnRzLmdpdGh1Yi5pby9wYXR0ZXJuLWZpbGwvcGF0dGVybi1maWxsLXYyLmpzJyxcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICByZXR1cm4gKG5ld1NldHRpbmdzLm1vZHVsZXMuaW5kZXhPZignY2hhcnQnKSA+IC0xICYmICF3aW5kb3cuSGlnaGNoYXJ0cylcbiAgICAgICAgICAgICAgPyBjcEJvb3RzdHJhcC5sb29wKGNoYXJ0U2NyaXB0cywgbGluayA9PiB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmV0Y2hTZXJ2aWNlLmZldGNoU2NyaXB0KGxpbmspO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndpZGdldHMuaW5pdChpbmRleCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH0pO1xuICAgICAgfSwgNTApO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyB3aWRnZXRzQ2xhc3Mge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnN0YXRlcyA9IFtdO1xuICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICBvYmplY3ROYW1lOiAnY3BDdXJyZW5jeVdpZGdldHMnLFxuICAgICAgY2xhc3NOYW1lOiAnY29pbnBhcHJpa2EtY3VycmVuY3ktd2lkZ2V0JyxcbiAgICAgIGNzc0ZpbGVOYW1lOiAnd2lkZ2V0Lm1pbi5jc3MnLFxuICAgICAgY3VycmVuY3k6ICdidGMtYml0Y29pbicsXG4gICAgICBwcmltYXJ5X2N1cnJlbmN5OiAnVVNEJyxcbiAgICAgIHJhbmdlX2xpc3Q6IFsnMjRoJywgJzdkJywgJzMwZCcsICcxcScsICcxeScsICd5dGQnLCAnYWxsJ10sXG4gICAgICByYW5nZTogJzdkJyxcbiAgICAgIG1vZHVsZXM6IFsnbWFya2V0X2RldGFpbHMnLCAnY2hhcnQnXSxcbiAgICAgIHVwZGF0ZV9hY3RpdmU6IGZhbHNlLFxuICAgICAgdXBkYXRlX3RpbWVvdXQ6ICczMHMnLFxuICAgICAgbGFuZ3VhZ2U6ICdlbicsXG4gICAgICBzdHlsZV9zcmM6IG51bGwsXG4gICAgICBpbWdfc3JjOiBudWxsLFxuICAgICAgbGFuZ19zcmM6IG51bGwsXG4gICAgICBkYXRhX3NyYzogbnVsbCxcbiAgICAgIG9yaWdpbl9zcmM6ICdodHRwczovL3VucGtnLmNvbS9AY29pbnBhcHJpa2Evd2lkZ2V0LWN1cnJlbmN5QGxhdGVzdCcsXG4gICAgICBzaG93X2RldGFpbHNfY3VycmVuY3k6IGZhbHNlLFxuICAgICAgdGlja2VyOiB7XG4gICAgICAgIG5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgc3ltYm9sOiB1bmRlZmluZWQsXG4gICAgICAgIHByaWNlOiB1bmRlZmluZWQsXG4gICAgICAgIHByaWNlX2NoYW5nZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgICAgcmFuazogdW5kZWZpbmVkLFxuICAgICAgICBwcmljZV9hdGg6IHVuZGVmaW5lZCxcbiAgICAgICAgdm9sdW1lXzI0aDogdW5kZWZpbmVkLFxuICAgICAgICBtYXJrZXRfY2FwOiB1bmRlZmluZWQsXG4gICAgICAgIHBlcmNlbnRfZnJvbV9wcmljZV9hdGg6IHVuZGVmaW5lZCxcbiAgICAgICAgdm9sdW1lXzI0aF9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgICAgIG1hcmtldF9jYXBfY2hhbmdlXzI0aDogdW5kZWZpbmVkLFxuICAgICAgfSxcbiAgICAgIGludGVydmFsOiBudWxsLFxuICAgICAgaXNXb3JkcHJlc3M6IGZhbHNlLFxuICAgICAgaXNOaWdodE1vZGU6IGZhbHNlLFxuICAgICAgaXNEYXRhOiBmYWxzZSxcbiAgICAgIGF2YWlsYWJsZU1vZHVsZXM6IFsncHJpY2UnLCAnY2hhcnQnLCAnbWFya2V0X2RldGFpbHMnXSxcbiAgICAgIG1lc3NhZ2U6ICdkYXRhX2xvYWRpbmcnLFxuICAgICAgdHJhbnNsYXRpb25zOiB7fSxcbiAgICAgIG1haW5FbGVtZW50OiBudWxsLFxuICAgICAgbm9UcmFuc2xhdGlvbkxhYmVsczogW10sXG4gICAgICBzY3JpcHRzRG93bmxvYWRlZDoge30sXG4gICAgICBjaGFydDogbnVsbCxcbiAgICAgIHJ3ZDoge1xuICAgICAgICB4czogMjgwLFxuICAgICAgICBzOiAzMjAsXG4gICAgICAgIG06IDM3MCxcbiAgICAgICAgbDogNDYyLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG4gIFxuICBpbml0KGluZGV4KSB7XG4gICAgaWYgKCF0aGlzLmdldE1haW5FbGVtZW50KGluZGV4KSkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ0JpbmQgZmFpbGVkLCBubyBlbGVtZW50IHdpdGggY2xhc3MgPSBcIicgKyB0aGlzLmRlZmF1bHRzLmNsYXNzTmFtZSArICdcIicpO1xuICAgIH1cbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RGVmYXVsdHMoaW5kZXgpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0T3JpZ2luTGluayhpbmRleCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHNldFdpZGdldENsYXNzKGVsZW1lbnRzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHdpZHRoID0gZWxlbWVudHNbaV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgICBsZXQgcndkS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuZGVmYXVsdHMucndkKTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcndkS2V5cy5sZW5ndGg7IGorKykge1xuICAgICAgICBsZXQgcndkS2V5ID0gcndkS2V5c1tqXTtcbiAgICAgICAgbGV0IHJ3ZFBhcmFtID0gdGhpcy5kZWZhdWx0cy5yd2RbcndkS2V5XTtcbiAgICAgICAgbGV0IGNsYXNzTmFtZSA9IHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lICsgJ19fJyArIHJ3ZEtleTtcbiAgICAgICAgaWYgKHdpZHRoIDw9IHJ3ZFBhcmFtKSBlbGVtZW50c1tpXS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICAgIGlmICh3aWR0aCA+IHJ3ZFBhcmFtKSBlbGVtZW50c1tpXS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICBnZXRNYWluRWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiAodGhpcy5zdGF0ZXNbaW5kZXhdKSA/IHRoaXMuc3RhdGVzW2luZGV4XS5tYWluRWxlbWVudCA6IG51bGw7XG4gIH1cbiAgXG4gIGdldERlZmF1bHRzKGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgICBpZiAobWFpbkVsZW1lbnQgJiYgbWFpbkVsZW1lbnQuZGF0YXNldCkge1xuICAgICAgICBpZiAoIW1haW5FbGVtZW50LmRhdGFzZXQubW9kdWxlcyAmJiBtYWluRWxlbWVudC5kYXRhc2V0LnZlcnNpb24gPT09ICdleHRlbmRlZCcpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ21vZHVsZXMnLCBbJ21hcmtldF9kZXRhaWxzJ10pO1xuICAgICAgICBpZiAoIW1haW5FbGVtZW50LmRhdGFzZXQubW9kdWxlcyAmJiBtYWluRWxlbWVudC5kYXRhc2V0LnZlcnNpb24gPT09ICdzdGFuZGFyZCcpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ21vZHVsZXMnLCBbXSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lm1vZHVsZXMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ21vZHVsZXMnLCBKU09OLnBhcnNlKG1haW5FbGVtZW50LmRhdGFzZXQubW9kdWxlcykpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5wcmltYXJ5Q3VycmVuY3kpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3ByaW1hcnlfY3VycmVuY3knLCBtYWluRWxlbWVudC5kYXRhc2V0LnByaW1hcnlDdXJyZW5jeSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmN1cnJlbmN5KSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdjdXJyZW5jeScsIG1haW5FbGVtZW50LmRhdGFzZXQuY3VycmVuY3kpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5yYW5nZSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAncmFuZ2UnLCBtYWluRWxlbWVudC5kYXRhc2V0LnJhbmdlKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuc2hvd0RldGFpbHNDdXJyZW5jeSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnc2hvd19kZXRhaWxzX2N1cnJlbmN5JywgKG1haW5FbGVtZW50LmRhdGFzZXQuc2hvd0RldGFpbHNDdXJyZW5jeSA9PT0gJ3RydWUnKSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZUFjdGl2ZSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAndXBkYXRlX2FjdGl2ZScsIChtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZUFjdGl2ZSA9PT0gJ3RydWUnKSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZVRpbWVvdXQpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3VwZGF0ZV90aW1lb3V0JywgY3BCb290c3RyYXAucGFyc2VJbnRlcnZhbFZhbHVlKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlVGltZW91dCkpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5sYW5ndWFnZSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbGFuZ3VhZ2UnLCBtYWluRWxlbWVudC5kYXRhc2V0Lmxhbmd1YWdlKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQub3JpZ2luU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdvcmlnaW5fc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5vcmlnaW5TcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5ub2RlTW9kdWxlc1NyYykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbm9kZV9tb2R1bGVzX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQubm9kZU1vZHVsZXNTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5ib3dlclNyYykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnYm93ZXJfc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5ib3dlclNyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnN0eWxlU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdzdHlsZV9zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LnN0eWxlU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ1NyYykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbG9nb19zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LmxhbmdTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5pbWdTcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2xvZ29fc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5pbWdTcmMpO1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICB9KTtcbiAgfVxuICBcbiAgc2V0T3JpZ2luTGluayhpbmRleCkge1xuICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9ucykubGVuZ3RoID09PSAwKSB0aGlzLmdldFRyYW5zbGF0aW9ucyh0aGlzLmRlZmF1bHRzLmxhbmd1YWdlKTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc3R5bGVzaGVldCgpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuYWRkV2lkZ2V0RWxlbWVudChpbmRleCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5pbml0SW50ZXJ2YWwoaW5kZXgpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBhZGRXaWRnZXRFbGVtZW50KGluZGV4KSB7XG4gICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgbGV0IG1vZHVsZXMgPSAnJztcbiAgICBsZXQgbW9kdWxlc0FycmF5ID0gW107XG4gICAgbGV0IGNoYXJ0Q29udGFpbmVyID0gbnVsbDtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AodGhpcy5kZWZhdWx0cy5hdmFpbGFibGVNb2R1bGVzLCBtb2R1bGUgPT4ge1xuICAgICAgICByZXR1cm4gKHRoaXMuc3RhdGVzW2luZGV4XS5tb2R1bGVzLmluZGV4T2YobW9kdWxlKSA+IC0xKSA/IG1vZHVsZXNBcnJheS5wdXNoKG1vZHVsZSkgOiBudWxsO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChtb2R1bGVzQXJyYXksIG1vZHVsZSA9PiB7XG4gICAgICAgIGxldCBsYWJlbCA9IG51bGw7XG4gICAgICAgIGlmIChtb2R1bGUgPT09ICdjaGFydCcpIGxhYmVsID0gJ0NoYXJ0JztcbiAgICAgICAgaWYgKG1vZHVsZSA9PT0gJ21hcmtldF9kZXRhaWxzJykgbGFiZWwgPSAnTWFya2V0RGV0YWlscyc7XG4gICAgICAgIHJldHVybiAobGFiZWwpID8gdGhpc1tgd2lkZ2V0JHsgbGFiZWwgfUVsZW1lbnRgXShpbmRleCkudGhlbihyZXN1bHQgPT4gbW9kdWxlcyArPSByZXN1bHQpIDogbnVsbDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIG1haW5FbGVtZW50LmlubmVySFRNTCA9IHRoaXMud2lkZ2V0TWFpbkVsZW1lbnQoaW5kZXgpICsgbW9kdWxlcyArIHRoaXMud2lkZ2V0Rm9vdGVyKGluZGV4KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGNoYXJ0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7IHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lIH0tcHJpY2UtY2hhcnQtJHsgaW5kZXggfWApO1xuICAgICAgcmV0dXJuIChjaGFydENvbnRhaW5lcikgPyBjaGFydENvbnRhaW5lci5wYXJlbnRFbGVtZW50Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgdGhpcy53aWRnZXRTZWxlY3RFbGVtZW50KGluZGV4LCAncmFuZ2UnKSkgOiBudWxsO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKGNoYXJ0Q29udGFpbmVyKXtcbiAgICAgICAgdGhpcy5zdGF0ZXNbaW5kZXhdLmNoYXJ0ID0gbmV3IGNoYXJ0Q2xhc3MoY2hhcnRDb250YWluZXIsIHRoaXMuc3RhdGVzW2luZGV4XSk7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0TGlzdGVuZXJzKGluZGV4KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuICAgIFxuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKGluZGV4KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdldERhdGEoaW5kZXgpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBzZXRTZWxlY3RMaXN0ZW5lcnMoaW5kZXgpe1xuICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgIGxldCBzZWxlY3RFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXQtc2VsZWN0Jyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RFbGVtZW50cy5sZW5ndGg7IGkrKyl7XG4gICAgICBsZXQgYnV0dG9ucyA9IHNlbGVjdEVsZW1lbnRzW2ldLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXQtc2VsZWN0X19vcHRpb25zIGJ1dHRvbicpO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBidXR0b25zLmxlbmd0aDsgaisrKXtcbiAgICAgICAgYnV0dG9uc1tqXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0U2VsZWN0T3B0aW9uKGV2ZW50LCBpbmRleCk7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHNldFNlbGVjdE9wdGlvbihldmVudCwgaW5kZXgpe1xuICAgIGxldCBjbGFzc05hbWUgPSAnY3Atd2lkZ2V0LWFjdGl2ZSc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudC50YXJnZXQucGFyZW50Tm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGxldCBzaWJsaW5nID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuY2hpbGROb2Rlc1tpXTtcbiAgICAgIGlmIChzaWJsaW5nLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKSBzaWJsaW5nLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICB9XG4gICAgbGV0IHBhcmVudCA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcuY3Atd2lkZ2V0LXNlbGVjdCcpO1xuICAgIGxldCB0eXBlID0gcGFyZW50LmRhdGFzZXQudHlwZTtcbiAgICBsZXQgcGlja2VkVmFsdWVFbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5jcC13aWRnZXQtc2VsZWN0X19vcHRpb25zID4gc3BhbicpO1xuICAgIGxldCB2YWx1ZSA9IGV2ZW50LnRhcmdldC5kYXRhc2V0Lm9wdGlvbjtcbiAgICBwaWNrZWRWYWx1ZUVsZW1lbnQuaW5uZXJUZXh0ID0gdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgdmFsdWUudG9Mb3dlckNhc2UoKSk7XG4gICAgdGhpcy51cGRhdGVEYXRhKGluZGV4LCB0eXBlLCB2YWx1ZSk7XG4gICAgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB0aGlzLmRpc3BhdGNoRXZlbnQoaW5kZXgsICctc3dpdGNoLXJhbmdlJywgdmFsdWUpO1xuICB9XG4gIFxuICBkaXNwYXRjaEV2ZW50KGluZGV4LCBuYW1lLCBkYXRhKXtcbiAgICBsZXQgaWQgPSBgJHsgdGhpcy5kZWZhdWx0cy5jbGFzc05hbWUgfS1wcmljZS1jaGFydC0keyBpbmRleCB9YDtcbiAgICByZXR1cm4gZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoYCR7aWR9JHtuYW1lfWAsIHsgZGV0YWlsOiB7IGRhdGEgfSB9KSk7XG4gIH1cbiAgXG4gIGdldERhdGEoaW5kZXgpIHtcbiAgICBjb25zdCB1cmwgPSAnaHR0cHM6Ly9hcGkuY29pbnBhcHJpa2EuY29tL3YxL3dpZGdldC8nICsgdGhpcy5zdGF0ZXNbaW5kZXhdLmN1cnJlbmN5ICsgJz9xdW90ZT0nICsgdGhpcy5zdGF0ZXNbaW5kZXhdLnByaW1hcnlfY3VycmVuY3k7XG4gICAgcmV0dXJuIGZldGNoU2VydmljZS5mZXRjaERhdGEodXJsKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZXNbaW5kZXhdLmlzRGF0YSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnaXNEYXRhJywgdHJ1ZSk7XG4gICAgICAgIHRoaXMudXBkYXRlVGlja2VyKGluZGV4LCByZXN1bHQpO1xuICAgICAgfSlcbiAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5vbkVycm9yUmVxdWVzdChpbmRleCwgZXJyb3IpO1xuICAgIH0pO1xuICB9XG4gIFxuICBvbkVycm9yUmVxdWVzdChpbmRleCwgeGhyKSB7XG4gICAgaWYgKHRoaXMuc3RhdGVzW2luZGV4XS5pc0RhdGEpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2lzRGF0YScsIGZhbHNlKTtcbiAgICB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdtZXNzYWdlJywgJ2RhdGFfdW5hdmFpbGFibGUnKTtcbiAgICBjb25zb2xlLmVycm9yKCdSZXF1ZXN0IGZhaWxlZC4gIFJldHVybmVkIHN0YXR1cyBvZiAnICsgeGhyLCB0aGlzLnN0YXRlc1tpbmRleF0pO1xuICB9XG4gIFxuICBpbml0SW50ZXJ2YWwoaW5kZXgpIHtcbiAgICBjbGVhckludGVydmFsKHRoaXMuc3RhdGVzW2luZGV4XS5pbnRlcnZhbCk7XG4gICAgaWYgKHRoaXMuc3RhdGVzW2luZGV4XS51cGRhdGVfYWN0aXZlICYmIHRoaXMuc3RhdGVzW2luZGV4XS51cGRhdGVfdGltZW91dCA+IDEwMDApIHtcbiAgICAgIHRoaXMuc3RhdGVzW2luZGV4XS5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgdGhpcy5nZXREYXRhKGluZGV4KTtcbiAgICAgIH0sIHRoaXMuc3RhdGVzW2luZGV4XS51cGRhdGVfdGltZW91dCk7XG4gICAgfVxuICB9XG4gIFxuICBzZXRCZWZvcmVFbGVtZW50SW5Gb290ZXIoaW5kZXgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGVzW2luZGV4XS5pc1dvcmRwcmVzcykge1xuICAgICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgICBpZiAobWFpbkVsZW1lbnQpIHtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmNoaWxkcmVuWzBdLmxvY2FsTmFtZSA9PT0gJ3N0eWxlJykge1xuICAgICAgICAgIG1haW5FbGVtZW50LnJlbW92ZUNoaWxkKG1haW5FbGVtZW50LmNoaWxkTm9kZXNbMF0pO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmb290ZXJFbGVtZW50ID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNwLXdpZGdldF9fZm9vdGVyJyk7XG4gICAgICAgIGxldCB2YWx1ZSA9IGZvb3RlckVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLSA0MztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb290ZXJFbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YWx1ZSAtPSBmb290ZXJFbGVtZW50LmNoaWxkTm9kZXNbaV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgc3R5bGUuaW5uZXJIVE1MID0gJy5jcC13aWRnZXRfX2Zvb3Rlci0tJyArIGluZGV4ICsgJzo6YmVmb3Jle3dpZHRoOicgKyB2YWx1ZS50b0ZpeGVkKDApICsgJ3B4O30nO1xuICAgICAgICBtYWluRWxlbWVudC5pbnNlcnRCZWZvcmUoc3R5bGUsIG1haW5FbGVtZW50LmNoaWxkcmVuWzBdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHVwZGF0ZVdpZGdldEVsZW1lbnQoaW5kZXgsIGtleSwgdmFsdWUsIHRpY2tlcikge1xuICAgIGxldCBzdGF0ZSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcbiAgICBsZXQgbWFpbkVsZW1lbnQgPSB0aGlzLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICBpZiAobWFpbkVsZW1lbnQpIHtcbiAgICAgIGxldCB0aWNrZXJDbGFzcyA9ICh0aWNrZXIpID8gJ1RpY2tlcicgOiAnJztcbiAgICAgIGlmIChrZXkgPT09ICduYW1lJyB8fCBrZXkgPT09ICdjdXJyZW5jeScpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ2N1cnJlbmN5Jykge1xuICAgICAgICAgIGxldCBhRWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0X19mb290ZXIgPiBhJyk7XG4gICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBhRWxlbWVudHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgIGFFbGVtZW50c1trXS5ocmVmID0gdGhpcy5jb2luX2xpbmsodmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdldEltYWdlKGluZGV4KTtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09ICdpc0RhdGEnIHx8IGtleSA9PT0gJ21lc3NhZ2UnKSB7XG4gICAgICAgIGxldCBoZWFkZXJFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXRfX21haW4nKTtcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBoZWFkZXJFbGVtZW50cy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgIGhlYWRlckVsZW1lbnRzW2tdLmlubmVySFRNTCA9ICghc3RhdGUuaXNEYXRhKSA/IHRoaXMud2lkZ2V0TWFpbkVsZW1lbnRNZXNzYWdlKGluZGV4KSA6IHRoaXMud2lkZ2V0TWFpbkVsZW1lbnREYXRhKGluZGV4KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHVwZGF0ZUVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgKyBrZXkgKyB0aWNrZXJDbGFzcyk7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdXBkYXRlRWxlbWVudHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBsZXQgdXBkYXRlRWxlbWVudCA9IHVwZGF0ZUVsZW1lbnRzW2pdO1xuICAgICAgICAgIGlmICh1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY3Atd2lkZ2V0X19yYW5rJykpIHtcbiAgICAgICAgICAgIGxldCBjbGFzc05hbWUgPSAocGFyc2VGbG9hdCh2YWx1ZSkgPiAwKSA/IFwiY3Atd2lkZ2V0X19yYW5rLXVwXCIgOiAoKHBhcnNlRmxvYXQodmFsdWUpIDwgMCkgPyBcImNwLXdpZGdldF9fcmFuay1kb3duXCIgOiBcImNwLXdpZGdldF9fcmFuay1uZXV0cmFsXCIpO1xuICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX3JhbmstZG93bicpO1xuICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX3JhbmstdXAnKTtcbiAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLW5ldXRyYWwnKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHZhbHVlID0gY3BCb290c3RyYXAuZW1wdHlEYXRhO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgIHZhbHVlID0gKGtleSA9PT0gJ3ByaWNlX2NoYW5nZV8yNGgnKSA/ICcoJyArIGNwQm9vdHN0cmFwLnJvdW5kKHZhbHVlLCAyKSArICclKScgOiBjcEJvb3RzdHJhcC5yb3VuZCh2YWx1ZSwgMikgKyAnJSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvd0RldGFpbHNDdXJyZW5jeScpICYmICFzdGF0ZS5zaG93X2RldGFpbHNfY3VycmVuY3kpIHtcbiAgICAgICAgICAgIHZhbHVlID0gJyAnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BhcnNlTnVtYmVyJykpIHtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbiA9IHRoaXMuZGVmYXVsdHMuZGF0YV9zcmMgfHwgdGhpcy5kZWZhdWx0cy5vcmlnaW5fc3JjO1xuICAgICAgICAgICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gY3BCb290c3RyYXAucGFyc2VDdXJyZW5jeU51bWJlcih2YWx1ZSwgc3RhdGUucHJpbWFyeV9jdXJyZW5jeSwgb3JpZ2luKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiB1cGRhdGVFbGVtZW50LmlubmVyVGV4dCA9IHJlc3VsdCB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1cGRhdGVFbGVtZW50LmlubmVyVGV4dCA9IHZhbHVlIHx8IGNwQm9vdHN0cmFwLmVtcHR5RGF0YTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHVwZGF0ZURhdGEoaW5kZXgsIGtleSwgdmFsdWUsIHRpY2tlcikge1xuICAgIGlmICh0aWNrZXIpIHtcbiAgICAgIHRoaXMuc3RhdGVzW2luZGV4XS50aWNrZXJba2V5XSA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlc1tpbmRleF1ba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgICBpZiAoa2V5ID09PSAnbGFuZ3VhZ2UnKSB7XG4gICAgICB0aGlzLmdldFRyYW5zbGF0aW9ucyh2YWx1ZSk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlV2lkZ2V0RWxlbWVudChpbmRleCwga2V5LCB2YWx1ZSwgdGlja2VyKTtcbiAgfVxuICBcbiAgdXBkYXRlV2lkZ2V0VHJhbnNsYXRpb25zKGxhbmcsIGRhdGEpIHtcbiAgICB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXSA9IGRhdGE7XG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLnN0YXRlcy5sZW5ndGg7IHgrKykge1xuICAgICAgbGV0IGlzTm9UcmFuc2xhdGlvbkxhYmVsc1VwZGF0ZSA9IHRoaXMuc3RhdGVzW3hdLm5vVHJhbnNsYXRpb25MYWJlbHMubGVuZ3RoID4gMCAmJiBsYW5nID09PSAnZW4nO1xuICAgICAgaWYgKHRoaXMuc3RhdGVzW3hdLmxhbmd1YWdlID09PSBsYW5nIHx8IGlzTm9UcmFuc2xhdGlvbkxhYmVsc1VwZGF0ZSkge1xuICAgICAgICBsZXQgbWFpbkVsZW1lbnQgPSB0aGlzLnN0YXRlc1t4XS5tYWluRWxlbWVudDtcbiAgICAgICAgbGV0IHRyYW5zYWx0ZUVsZW1lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNwLXRyYW5zbGF0aW9uJykpO1xuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRyYW5zYWx0ZUVsZW1lbnRzLmxlbmd0aDsgeSsrKSB7XG4gICAgICAgICAgdHJhbnNhbHRlRWxlbWVudHNbeV0uY2xhc3NMaXN0LmZvckVhY2goKGNsYXNzTmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGNsYXNzTmFtZS5zZWFyY2goJ3RyYW5zbGF0aW9uXycpID4gLTEpIHtcbiAgICAgICAgICAgICAgbGV0IHRyYW5zbGF0ZUtleSA9IGNsYXNzTmFtZS5yZXBsYWNlKCd0cmFuc2xhdGlvbl8nLCAnJyk7XG4gICAgICAgICAgICAgIGlmICh0cmFuc2xhdGVLZXkgPT09ICdtZXNzYWdlJykgdHJhbnNsYXRlS2V5ID0gdGhpcy5zdGF0ZXNbeF0ubWVzc2FnZTtcbiAgICAgICAgICAgICAgbGV0IGxhYmVsSW5kZXggPSB0aGlzLnN0YXRlc1t4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLmluZGV4T2YodHJhbnNsYXRlS2V5KTtcbiAgICAgICAgICAgICAgbGV0IHRleHQgPSB0aGlzLmdldFRyYW5zbGF0aW9uKHgsIHRyYW5zbGF0ZUtleSk7XG4gICAgICAgICAgICAgIGlmIChsYWJlbEluZGV4ID4gLTEgJiYgdGV4dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzW3hdLm5vVHJhbnNsYXRpb25MYWJlbHMuc3BsaWNlKGxhYmVsSW5kZXgsIDEpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdHJhbnNhbHRlRWxlbWVudHNbeV0uaW5uZXJUZXh0ID0gdGV4dDtcbiAgICAgICAgICAgICAgaWYgKHRyYW5zYWx0ZUVsZW1lbnRzW3ldLmNsb3Nlc3QoJy5jcC13aWRnZXRfX2Zvb3RlcicpKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnNldEJlZm9yZUVsZW1lbnRJbkZvb3Rlcih4KSwgNTApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgdXBkYXRlVGlja2VyKGluZGV4LCBkYXRhKSB7XG4gICAgbGV0IGRhdGFLZXlzID0gT2JqZWN0LmtleXMoZGF0YSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhS2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy51cGRhdGVEYXRhKGluZGV4LCBkYXRhS2V5c1tpXSwgZGF0YVtkYXRhS2V5c1tpXV0sIHRydWUpO1xuICAgIH1cbiAgfVxuICBcbiAgc3R5bGVzaGVldCgpIHtcbiAgICBpZiAodGhpcy5kZWZhdWx0cy5zdHlsZV9zcmMgIT09IGZhbHNlKSB7XG4gICAgICBsZXQgdXJsID0gdGhpcy5kZWZhdWx0cy5zdHlsZV9zcmMgfHwgdGhpcy5kZWZhdWx0cy5vcmlnaW5fc3JjICsgJy9kaXN0LycgKyB0aGlzLmRlZmF1bHRzLmNzc0ZpbGVOYW1lO1xuICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJ2xpbmtbaHJlZj1cIicgKyB1cmwgKyAnXCJdJykpe1xuICAgICAgICByZXR1cm4gZmV0Y2hTZXJ2aWNlLmZldGNoU3R5bGUodXJsKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG4gIFxuICB3aWRnZXRNYWluRWxlbWVudChpbmRleCkge1xuICAgIGxldCBkYXRhID0gdGhpcy5zdGF0ZXNbaW5kZXhdO1xuICAgIHJldHVybiAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9faGVhZGVyXCI+JyArXG4gICAgICAnPGRpdiBjbGFzcz1cIicgKyAnY3Atd2lkZ2V0X19pbWcgY3Atd2lkZ2V0X19pbWctJyArIGRhdGEuY3VycmVuY3kgKyAnXCI+JyArXG4gICAgICAnPGltZy8+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9fbWFpblwiPicgK1xuICAgICAgKChkYXRhLmlzRGF0YSkgPyB0aGlzLndpZGdldE1haW5FbGVtZW50RGF0YShpbmRleCkgOiB0aGlzLndpZGdldE1haW5FbGVtZW50TWVzc2FnZShpbmRleCkpICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nO1xuICB9XG4gIFxuICB3aWRnZXRNYWluRWxlbWVudERhdGEoaW5kZXgpIHtcbiAgICBsZXQgZGF0YSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcbiAgICByZXR1cm4gJzxoMz48YSBocmVmPVwiJyArIHRoaXMuY29pbl9saW5rKGRhdGEuY3VycmVuY3kpICsgJ1wiPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwibmFtZVRpY2tlclwiPicgKyAoZGF0YS50aWNrZXIubmFtZSB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGEpICsgJzwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlclwiPicgKyAoZGF0YS50aWNrZXIuc3ltYm9sIHx8IGNwQm9vdHN0cmFwLmVtcHR5RGF0YSkgKyAnPC9zcGFuPicgK1xuICAgICAgJzwvYT48L2gzPicgK1xuICAgICAgJzxzdHJvbmc+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJwcmljZVRpY2tlciBwYXJzZU51bWJlclwiPicgKyAoY3BCb290c3RyYXAucGFyc2VOdW1iZXIoZGF0YS50aWNrZXIucHJpY2UpIHx8IGNwQm9vdHN0cmFwLmVtcHR5RGF0YSkgKyAnPC9zcGFuPiAnICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInByaW1hcnlDdXJyZW5jeVwiPicgKyBkYXRhLnByaW1hcnlfY3VycmVuY3kgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInByaWNlX2NoYW5nZV8yNGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rIGNwLXdpZGdldF9fcmFuay0nICsgKChkYXRhLnRpY2tlci5wcmljZV9jaGFuZ2VfMjRoID4gMCkgPyBcInVwXCIgOiAoKGRhdGEudGlja2VyLnByaWNlX2NoYW5nZV8yNGggPCAwKSA/IFwiZG93blwiIDogXCJuZXV0cmFsXCIpKSArICdcIj4oJyArIChjcEJvb3RzdHJhcC5yb3VuZChkYXRhLnRpY2tlci5wcmljZV9jaGFuZ2VfMjRoLCAyKSB8fCBjcEJvb3RzdHJhcC5lbXB0eVZhbHVlKSArICclKTwvc3Bhbj4nICtcbiAgICAgICc8L3N0cm9uZz4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldF9fcmFuay1sYWJlbFwiPjxzcGFuIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fcmFua1wiPicgKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInJhbmtcIikgKyAnPC9zcGFuPiA8c3BhbiBjbGFzcz1cInJhbmtUaWNrZXJcIj4nICsgKGRhdGEudGlja2VyLnJhbmsgfHwgY3BCb290c3RyYXAuZW1wdHlEYXRhKSArICc8L3NwYW4+PC9zcGFuPic7XG4gIH1cbiAgXG4gIHdpZGdldE1haW5FbGVtZW50TWVzc2FnZShpbmRleCkge1xuICAgIGxldCBtZXNzYWdlID0gdGhpcy5zdGF0ZXNbaW5kZXhdLm1lc3NhZ2U7XG4gICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19tYWluLW5vLWRhdGEgY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fbWVzc2FnZVwiPicgKyAodGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgbWVzc2FnZSkpICsgJzwvZGl2Pic7XG4gIH1cbiAgXG4gIHdpZGdldE1hcmtldERldGFpbHNFbGVtZW50KGluZGV4KSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgodGhpcy5zdGF0ZXNbaW5kZXhdLm1vZHVsZXMuaW5kZXhPZignbWFya2V0X2RldGFpbHMnKSA+IC0xKSA/ICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19kZXRhaWxzXCI+JyArXG4gICAgICB0aGlzLndpZGdldEF0aEVsZW1lbnQoaW5kZXgpICtcbiAgICAgIHRoaXMud2lkZ2V0Vm9sdW1lMjRoRWxlbWVudChpbmRleCkgK1xuICAgICAgdGhpcy53aWRnZXRNYXJrZXRDYXBFbGVtZW50KGluZGV4KSArXG4gICAgICAnPC9kaXY+JyA6ICcnKTtcbiAgfVxuICBcbiAgd2lkZ2V0QXRoRWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiAnPGRpdj4nICtcbiAgICAgICc8c21hbGwgY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9hdGhcIj4nICsgdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJhdGhcIikgKyAnPC9zbWFsbD4nICtcbiAgICAgICc8ZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwicHJpY2VfYXRoVGlja2VyIHBhcnNlTnVtYmVyXCI+JyArIGNwQm9vdHN0cmFwLmVtcHR5RGF0YSArICcgPC9zcGFuPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwic3ltYm9sVGlja2VyIHNob3dEZXRhaWxzQ3VycmVuY3lcIj48L3NwYW4+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJwZXJjZW50X2Zyb21fcHJpY2VfYXRoVGlja2VyIGNwLXdpZGdldF9fcmFua1wiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnPC9zcGFuPicgK1xuICAgICAgJzwvZGl2PidcbiAgfVxuICBcbiAgd2lkZ2V0Vm9sdW1lMjRoRWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiAnPGRpdj4nICtcbiAgICAgICc8c21hbGwgY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl92b2x1bWVfMjRoXCI+JyArIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwidm9sdW1lXzI0aFwiKSArICc8L3NtYWxsPicgK1xuICAgICAgJzxkaXY+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJ2b2x1bWVfMjRoVGlja2VyIHBhcnNlTnVtYmVyXCI+JyArIGNwQm9vdHN0cmFwLmVtcHR5RGF0YSArICcgPC9zcGFuPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwic3ltYm9sVGlja2VyIHNob3dEZXRhaWxzQ3VycmVuY3lcIj48L3NwYW4+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJ2b2x1bWVfMjRoX2NoYW5nZV8yNGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rXCI+JyArIGNwQm9vdHN0cmFwLmVtcHR5RGF0YSArICc8L3NwYW4+JyArXG4gICAgICAnPC9kaXY+JztcbiAgfVxuICBcbiAgd2lkZ2V0TWFya2V0Q2FwRWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiAnPGRpdj4nICtcbiAgICAgICc8c21hbGwgY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9tYXJrZXRfY2FwXCI+JyArIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwibWFya2V0X2NhcFwiKSArICc8L3NtYWxsPicgK1xuICAgICAgJzxkaXY+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJtYXJrZXRfY2FwVGlja2VyIHBhcnNlTnVtYmVyXCI+JyArIGNwQm9vdHN0cmFwLmVtcHR5RGF0YSArICcgPC9zcGFuPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwic3ltYm9sVGlja2VyIHNob3dEZXRhaWxzQ3VycmVuY3lcIj48L3NwYW4+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJtYXJrZXRfY2FwX2NoYW5nZV8yNGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rXCI+JyArIGNwQm9vdHN0cmFwLmVtcHR5RGF0YSArICc8L3NwYW4+JyArXG4gICAgICAnPC9kaXY+JztcbiAgfVxuICBcbiAgd2lkZ2V0Q2hhcnRFbGVtZW50KGluZGV4KSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShcbiAgICAgIGA8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19jaGFydFwiPjxkaXYgaWQ9XCIkeyB0aGlzLmRlZmF1bHRzLmNsYXNzTmFtZSB9LXByaWNlLWNoYXJ0LSR7IGluZGV4IH1cIj48L2Rpdj48L2Rpdj5gXG4gICAgKTtcbiAgfVxuICBcbiAgd2lkZ2V0U2VsZWN0RWxlbWVudChpbmRleCwgbGFiZWwpe1xuICAgIGxldCBidXR0b25zID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnN0YXRlc1tpbmRleF1bbGFiZWwrJ19saXN0J10ubGVuZ3RoOyBpKyspe1xuICAgICAgbGV0IGRhdGEgPSB0aGlzLnN0YXRlc1tpbmRleF1bbGFiZWwrJ19saXN0J11baV07XG4gICAgICBidXR0b25zICs9ICc8YnV0dG9uIGNsYXNzPVwiJysgKChkYXRhLnRvTG93ZXJDYXNlKCkgPT09IHRoaXMuc3RhdGVzW2luZGV4XVtsYWJlbF0udG9Mb3dlckNhc2UoKSlcbiAgICAgICAgPyAnY3Atd2lkZ2V0LWFjdGl2ZSAnXG4gICAgICAgIDogJycpICsgKChsYWJlbCA9PT0gJ3ByaW1hcnlfY3VycmVuY3knKSA/ICcnIDogJ2NwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uXycgKyBkYXRhLnRvTG93ZXJDYXNlKCkpICsnXCIgZGF0YS1vcHRpb249XCInK2RhdGErJ1wiPicrdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgZGF0YS50b0xvd2VyQ2FzZSgpKSsnPC9idXR0b24+J1xuICAgIH1cbiAgICBpZiAobGFiZWwgPT09ICdyYW5nZScpIDtcbiAgICBsZXQgdGl0bGUgPSB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInpvb21faW5cIik7XG4gICAgcmV0dXJuICc8ZGl2IGRhdGEtdHlwZT1cIicrbGFiZWwrJ1wiIGNsYXNzPVwiY3Atd2lkZ2V0LXNlbGVjdFwiPicgK1xuICAgICAgJzxsYWJlbCBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uXycrIGxhYmVsICsnXCI+Jyt0aXRsZSsnPC9sYWJlbD4nICtcbiAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0LXNlbGVjdF9fb3B0aW9uc1wiPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwiYXJyb3ctZG93biAnKyAnY3Atd2lkZ2V0X19jYXBpdGFsaXplIGNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uXycgKyB0aGlzLnN0YXRlc1tpbmRleF1bbGFiZWxdLnRvTG93ZXJDYXNlKCkgKydcIj4nKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCB0aGlzLnN0YXRlc1tpbmRleF1bbGFiZWxdLnRvTG93ZXJDYXNlKCkpICsnPC9zcGFuPicgK1xuICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtc2VsZWN0X19kcm9wZG93blwiPicgK1xuICAgICAgYnV0dG9ucyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+JztcbiAgfVxuICBcbiAgd2lkZ2V0Rm9vdGVyKGluZGV4KSB7XG4gICAgbGV0IGN1cnJlbmN5ID0gdGhpcy5zdGF0ZXNbaW5kZXhdLmN1cnJlbmN5O1xuICAgIHJldHVybiAoIXRoaXMuc3RhdGVzW2luZGV4XS5pc1dvcmRwcmVzcylcbiAgICAgID8gJzxwIGNsYXNzPVwiY3Atd2lkZ2V0X19mb290ZXIgY3Atd2lkZ2V0X19mb290ZXItLScgKyBpbmRleCArICdcIj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX3Bvd2VyZWRfYnlcIj4nICsgdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJwb3dlcmVkX2J5XCIpICsgJyA8L3NwYW4+JyArXG4gICAgICAnPGltZyBzdHlsZT1cIndpZHRoOiAxNnB4XCIgc3JjPVwiJyArIHRoaXMubWFpbl9sb2dvX2xpbmsoKSArICdcIiBhbHQ9XCJcIi8+JyArXG4gICAgICAnPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIicgKyB0aGlzLmNvaW5fbGluayhjdXJyZW5jeSkgKyAnXCI+Y29pbnBhcHJpa2EuY29tPC9hPicgK1xuICAgICAgJzwvcD4nXG4gICAgICA6ICcnO1xuICB9XG4gIFxuICBnZXRJbWFnZShpbmRleCkge1xuICAgIGxldCBkYXRhID0gdGhpcy5zdGF0ZXNbaW5kZXhdO1xuICAgIGxldCBpbWdDb250YWluZXJzID0gZGF0YS5tYWluRWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjcC13aWRnZXRfX2ltZycpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW1nQ29udGFpbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGltZ0NvbnRhaW5lciA9IGltZ0NvbnRhaW5lcnNbaV07XG4gICAgICBpbWdDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY3Atd2lkZ2V0X19pbWctLWhpZGRlbicpO1xuICAgICAgbGV0IGltZyA9IGltZ0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdpbWcnKTtcbiAgICAgIGxldCBuZXdJbWcgPSBuZXcgSW1hZ2U7XG4gICAgICBuZXdJbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICBpbWcuc3JjID0gbmV3SW1nLnNyYztcbiAgICAgICAgaW1nQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9faW1nLS1oaWRkZW4nKTtcbiAgICAgIH07XG4gICAgICBuZXdJbWcuc3JjID0gdGhpcy5pbWdfc3JjKGRhdGEuY3VycmVuY3kpO1xuICAgIH1cbiAgfVxuICBcbiAgaW1nX3NyYyhpZCkge1xuICAgIHJldHVybiAnaHR0cHM6Ly9jb2lucGFwcmlrYS5jb20vY29pbi8nICsgaWQgKyAnL2xvZ28ucG5nJztcbiAgfVxuICBcbiAgY29pbl9saW5rKGlkKSB7XG4gICAgcmV0dXJuICdodHRwczovL2NvaW5wYXByaWthLmNvbS9jb2luLycgKyBpZFxuICB9XG4gIFxuICBtYWluX2xvZ29fbGluaygpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0cy5pbWdfc3JjIHx8IHRoaXMuZGVmYXVsdHMub3JpZ2luX3NyYyArICcvZGlzdC9pbWcvbG9nb193aWRnZXQuc3ZnJ1xuICB9XG4gIFxuICBnZXRTY3JpcHRFbGVtZW50KCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzY3JpcHRbZGF0YS1jcC1jdXJyZW5jeS13aWRnZXRdJyk7XG4gIH1cbiAgXG4gIGdldFRyYW5zbGF0aW9uKGluZGV4LCBsYWJlbCkge1xuICAgIGxldCB0ZXh0ID0gKHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW3RoaXMuc3RhdGVzW2luZGV4XS5sYW5ndWFnZV0pID8gdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbdGhpcy5zdGF0ZXNbaW5kZXhdLmxhbmd1YWdlXVtsYWJlbF0gOiBudWxsO1xuICAgIGlmICghdGV4dCAmJiB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1snZW4nXSkge1xuICAgICAgdGV4dCA9IHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zWydlbiddW2xhYmVsXTtcbiAgICB9XG4gICAgaWYgKCF0ZXh0KSB7XG4gICAgICByZXR1cm4gdGhpcy5hZGRMYWJlbFdpdGhvdXRUcmFuc2xhdGlvbihpbmRleCwgbGFiZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH1cbiAgXG4gIGFkZExhYmVsV2l0aG91dFRyYW5zbGF0aW9uKGluZGV4LCBsYWJlbCkge1xuICAgIGlmICghdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbJ2VuJ10pIHRoaXMuZ2V0VHJhbnNsYXRpb25zKCdlbicpO1xuICAgIHJldHVybiB0aGlzLnN0YXRlc1tpbmRleF0ubm9UcmFuc2xhdGlvbkxhYmVscy5wdXNoKGxhYmVsKTtcbiAgfVxuICBcbiAgZ2V0VHJhbnNsYXRpb25zKGxhbmcpIHtcbiAgICBpZiAoIXRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddKSB7XG4gICAgICBjb25zdCB1cmwgPSB0aGlzLmRlZmF1bHRzLmxhbmdfc3JjIHx8IHRoaXMuZGVmYXVsdHMub3JpZ2luX3NyYyArICcvZGlzdC9sYW5nLycgKyBsYW5nICsgJy5qc29uJztcbiAgICAgIHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddID0ge307XG4gICAgICByZXR1cm4gZmV0Y2hTZXJ2aWNlLmZldGNoSnNvbkZpbGUodXJsLCB0cnVlKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVdpZGdldFRyYW5zbGF0aW9ucyhsYW5nLCByZXNwb25zZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5vbkVycm9yUmVxdWVzdCgwLCB1cmwgKyByZXNwb25zZSk7XG4gICAgICAgICAgdGhpcy5nZXRUcmFuc2xhdGlvbnMoJ2VuJyk7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIFxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBjaGFydENsYXNzIHtcbiAgY29uc3RydWN0b3IoY29udGFpbmVyLCBzdGF0ZSl7XG4gICAgaWYgKCFjb250YWluZXIpIHJldHVybjtcbiAgICB0aGlzLmlkID0gY29udGFpbmVyLmlkO1xuICAgIHRoaXMuaXNOaWdodE1vZGUgPSBzdGF0ZS5pc05pZ2h0TW9kZTtcbiAgICB0aGlzLmNoYXJ0c1dpdGhBY3RpdmVTZXJpZXNDb29raWVzID0gW107XG4gICAgdGhpcy5jaGFydCA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW5jeSA9IHN0YXRlLmN1cnJlbmN5O1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucygpO1xuICAgIHRoaXMuZGVmYXVsdFJhbmdlID0gc3RhdGUucmFuZ2UgfHwgJzdkJztcbiAgICB0aGlzLmNhbGxiYWNrID0gbnVsbDtcbiAgICB0aGlzLnJlcGxhY2VDYWxsYmFjayA9IG51bGw7XG4gICAgdGhpcy5leHRyZW1lc0RhdGFVcmwgPSB0aGlzLmdldEV4dHJlbWVzRGF0YVVybChjb250YWluZXIuaWQpO1xuICAgIHRoaXMuZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICBjaGFydDoge1xuICAgICAgICBhbGlnblRpY2tzOiBmYWxzZSxcbiAgICAgICAgbWFyZ2luVG9wOiA1MCxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBmb250RmFtaWx5OiAnc2Fucy1zZXJpZicsXG4gICAgICAgIH0sXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgIHJlbmRlcjogKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC5hbm5vdGF0aW9ucykge1xuICAgICAgICAgICAgICBsZXQgY2hhcnQgPSBlLnRhcmdldC5hbm5vdGF0aW9ucy5jaGFydDtcbiAgICAgICAgICAgICAgY3BCb290c3RyYXAubG9vcChjaGFydC5hbm5vdGF0aW9ucy5hbGxJdGVtcywgYW5ub3RhdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHkgPSBjaGFydC5wbG90SGVpZ2h0ICsgY2hhcnQucGxvdFRvcCAtIGNoYXJ0LnNwYWNpbmdbMF0gLSAyIC0gKCh0aGlzLmlzUmVzcG9uc2l2ZU1vZGVBY3RpdmUoY2hhcnQpKSA/IDEwIDogMCk7XG4gICAgICAgICAgICAgICAgYW5ub3RhdGlvbi51cGRhdGUoe3l9LCB0cnVlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBzY3JvbGxiYXI6IHtcbiAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICB9LFxuICAgICAgYW5ub3RhdGlvbnNPcHRpb25zOiB7XG4gICAgICAgIGVuYWJsZWRCdXR0b25zOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICByYW5nZVNlbGVjdG9yOiB7XG4gICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHBsb3RPcHRpb25zOiB7XG4gICAgICAgIGxpbmU6IHtcbiAgICAgICAgICBzZXJpZXM6IHtcbiAgICAgICAgICAgIHN0YXRlczoge1xuICAgICAgICAgICAgICBob3Zlcjoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBzZXJpZXM6IHtcbiAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgIGxlZ2VuZEl0ZW1DbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChldmVudC5icm93c2VyRXZlbnQuaXNUcnVzdGVkKXtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGFydHNXaXRoQWN0aXZlU2VyaWVzQ29va2llcy5pbmRleE9mKGV2ZW50LnRhcmdldC5jaGFydC5yZW5kZXJUby5pZCkgPiAtMSkgdGhpcy5zZXRWaXNpYmxlQ2hhcnRDb29raWVzKGV2ZW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyBPbiBpT1MgdG91Y2ggZXZlbnQgZmlyZXMgc2Vjb25kIGNhbGxiYWNrIGZyb20gSlMgKGlzVHJ1c3RlZDogZmFsc2UpIHdoaWNoXG4gICAgICAgICAgICAgIC8vIHJlc3VsdHMgd2l0aCB0b2dnbGUgYmFjayB0aGUgY2hhcnQgKHByb2JhYmx5IGl0cyBhIHByb2JsZW0gd2l0aCBVSUtpdCwgYnV0IG5vdCBzdXJlKVxuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbGVnZW5kSXRlbUNsaWNrJywge2V2ZW50LCBpc1RydXN0ZWQ6IGV2ZW50LmJyb3dzZXJFdmVudC5pc1RydXN0ZWR9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50LmJyb3dzZXJFdmVudC5pc1RydXN0ZWQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB4QXhpczoge1xuICAgICAgICBvcmRpbmFsOiBmYWxzZVxuICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5jaGFydERhdGFQYXJzZXIgPSAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGRhdGEgPSBkYXRhWzBdO1xuICAgICAgICBjb25zdCBwcmljZUN1cnJlbmN5ID0gc3RhdGUucHJpbWFyeV9jdXJyZW5jeS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSh7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgcHJpY2U6IChkYXRhLnByaWNlKVxuICAgICAgICAgICAgICA/IGRhdGEucHJpY2VcbiAgICAgICAgICAgICAgOiAoKGRhdGFbcHJpY2VDdXJyZW5jeV0pXG4gICAgICAgICAgICAgICAgPyBkYXRhW3ByaWNlQ3VycmVuY3ldXG4gICAgICAgICAgICAgICAgOiBbXSksXG4gICAgICAgICAgICB2b2x1bWU6IGRhdGEudm9sdW1lIHx8IFtdLFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHRoaXMuaXNFdmVudHNIaWRkZW4gPSBmYWxzZTtcbiAgICB0aGlzLmV4Y2x1ZGVTZXJpZXNJZHMgPSBbXTtcbiAgICB0aGlzLmFzeW5jVXJsID0gYC9jdXJyZW5jeS9kYXRhLyR7IHN0YXRlLmN1cnJlbmN5IH0vX3JhbmdlXy9gO1xuICAgIHRoaXMuYXN5bmNQYXJhbXMgPSBgP3F1b3RlPSR7IHN0YXRlLnByaW1hcnlfY3VycmVuY3kudG9VcHBlckNhc2UoKSB9JmZpZWxkcz1wcmljZSx2b2x1bWVgO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG4gIFxuICBzZXRPcHRpb25zKCl7XG4gICAgY29uc3QgY2hhcnRTZXJ2aWNlID0gbmV3IGNoYXJ0Q2xhc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzcG9uc2l2ZToge1xuICAgICAgICBydWxlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbmRpdGlvbjoge1xuICAgICAgICAgICAgICBtYXhXaWR0aDogMTUwMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGFydE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgYWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ21pZGRsZScsXG4gICAgICAgICAgICAgICAgeTogOTIsXG4gICAgICAgICAgICAgICAgc3ltYm9sUmFkaXVzOiAwLFxuICAgICAgICAgICAgICAgIGl0ZW1EaXN0YW5jZTogMjAsXG4gICAgICAgICAgICAgICAgaXRlbVN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA0MDAsXG4gICAgICAgICAgICAgICAgbWFyZ2luVG9wOiAzNSxcbiAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206IDAsXG4gICAgICAgICAgICAgICAgc3BhY2luZ1RvcDogMCxcbiAgICAgICAgICAgICAgICBzcGFjaW5nQm90dG9tOiAwLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBuYXZpZ2F0b3I6IHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDUwLFxuICAgICAgICAgICAgICAgIG1hcmdpbjogNzAsXG4gICAgICAgICAgICAgICAgaGFuZGxlczoge1xuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyNSxcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiAxNyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbmRpdGlvbjoge1xuICAgICAgICAgICAgICBtYXhXaWR0aDogNjAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoYXJ0T3B0aW9uczoge1xuICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgIG1hcmdpblRvcDogMCxcbiAgICAgICAgICAgICAgICB6b29tVHlwZTogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgbWFyZ2luTGVmdDogMTAsXG4gICAgICAgICAgICAgICAgbWFyZ2luUmlnaHQ6IDEwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzUwLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB5QXhpczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGZsb29yOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0Ftb3VudDogNyxcbiAgICAgICAgICAgICAgICAgIHRpY2tXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tMZW5ndGg6IDAsXG4gICAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICAgICAgICBhbGlnbjogXCJsZWZ0XCIsXG4gICAgICAgICAgICAgICAgICAgIHg6IDEsXG4gICAgICAgICAgICAgICAgICAgIHk6IC0yLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzllOWU5ZScsXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICc5cHgnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgZmxvb3I6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrQW1vdW50OiA3LFxuICAgICAgICAgICAgICAgICAgdGlja1dpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0xlbmd0aDogMCxcbiAgICAgICAgICAgICAgICAgIGxpbmVXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgICAgICAgICAgIGFsaWduOiBcInJpZ2h0XCIsXG4gICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiBcImp1c3RpZnlcIixcbiAgICAgICAgICAgICAgICAgICAgeDogMSxcbiAgICAgICAgICAgICAgICAgICAgeTogLTIsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNTA4NWVjJyxcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzlweCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb25kaXRpb246IHtcbiAgICAgICAgICAgICAgbWF4V2lkdGg6IDQ1MFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoYXJ0T3B0aW9uczoge1xuICAgICAgICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgICAgICBhbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJyxcbiAgICAgICAgICAgICAgICB5OiA4MixcbiAgICAgICAgICAgICAgICBzeW1ib2xSYWRpdXM6IDAsXG4gICAgICAgICAgICAgICAgaXRlbURpc3RhbmNlOiAyMCxcbiAgICAgICAgICAgICAgICBpdGVtU3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbmF2aWdhdG9yOiB7XG4gICAgICAgICAgICAgICAgbWFyZ2luOiA2MCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDQwLFxuICAgICAgICAgICAgICAgIGhhbmRsZXM6IHtcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgIGhlaWdodDogMzAwLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB5QXhpczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGZsb29yOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0Ftb3VudDogNyxcbiAgICAgICAgICAgICAgICAgIHRpY2tXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tMZW5ndGg6IDAsXG4gICAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICAgICAgICBhbGlnbjogXCJsZWZ0XCIsXG4gICAgICAgICAgICAgICAgICAgIHg6IDEsXG4gICAgICAgICAgICAgICAgICAgIHk6IC0yLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzllOWU5ZScsXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICc5cHgnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgZmxvb3I6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrQW1vdW50OiA3LFxuICAgICAgICAgICAgICAgICAgdGlja1dpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0xlbmd0aDogMCxcbiAgICAgICAgICAgICAgICAgIGxpbmVXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgICAgICAgICAgIGFsaWduOiBcInJpZ2h0XCIsXG4gICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiBcImp1c3RpZnlcIixcbiAgICAgICAgICAgICAgICAgICAgeDogMSxcbiAgICAgICAgICAgICAgICAgICAgeTogLTIsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNTA4NWVjJyxcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzlweCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgdGl0bGU6IHtcbiAgICAgICAgdGV4dDogdW5kZWZpbmVkLFxuICAgICAgfSxcbiAgICAgIGNoYXJ0OiB7XG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ25vbmUnLFxuICAgICAgICBtYXJnaW5Ub3A6IDUwLFxuICAgICAgICBwbG90Qm9yZGVyV2lkdGg6IDAsXG4gICAgICB9LFxuICAgICAgY3BFdmVudHM6IGZhbHNlLFxuICAgICAgY29sb3JzOiBbXG4gICAgICAgICcjNTA4NWVjJyxcbiAgICAgICAgJyMxZjk4MDknLFxuICAgICAgICAnIzk4NWQ2NScsXG4gICAgICAgICcjZWU5ODNiJyxcbiAgICAgICAgJyM0YzRjNGMnLFxuICAgICAgXSxcbiAgICAgIGxlZ2VuZDoge1xuICAgICAgICBtYXJnaW46IDAsXG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGFsaWduOiAncmlnaHQnLFxuICAgICAgICBzeW1ib2xSYWRpdXM6IDAsXG4gICAgICAgIGl0ZW1EaXN0YW5jZTogNDAsXG4gICAgICAgIGl0ZW1TdHlsZToge1xuICAgICAgICAgIGZvbnRXZWlnaHQ6ICdub3JtYWwnLFxuICAgICAgICAgIGNvbG9yOiAodGhpcy5pc05pZ2h0TW9kZSkgPyAnIzgwYTZlNScgOiAnIzA2NDVhZCcsXG4gICAgICAgIH0sXG4gICAgICAgIGl0ZW1NYXJnaW5Ub3A6IDgsXG4gICAgICB9LFxuICAgICAgbmF2aWdhdG9yOiB0cnVlLFxuICAgICAgdG9vbHRpcDoge1xuICAgICAgICBzaGFyZWQ6IHRydWUsXG4gICAgICAgIHNwbGl0OiBmYWxzZSxcbiAgICAgICAgYW5pbWF0aW9uOiBmYWxzZSxcbiAgICAgICAgYm9yZGVyV2lkdGg6IDEsXG4gICAgICAgIGJvcmRlckNvbG9yOiAodGhpcy5pc05pZ2h0TW9kZSkgPyAnIzRjNGM0YycgOiAnI2UzZTNlMycsXG4gICAgICAgIGhpZGVEZWxheTogMTAwLFxuICAgICAgICBzaGFkb3c6IGZhbHNlLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBjb2xvcjogJyM0YzRjNGMnLFxuICAgICAgICAgIGZvbnRTaXplOiAnMTBweCcsXG4gICAgICAgIH0sXG4gICAgICAgIHVzZUhUTUw6IHRydWUsXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gY2hhcnRTZXJ2aWNlLnRvb2x0aXBGb3JtYXR0ZXIodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgXG4gICAgICBleHBvcnRpbmc6IHtcbiAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgIGNvbnRleHRCdXR0b246IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXG4gICAgICB4QXhpczoge1xuICAgICAgICBsaW5lQ29sb3I6ICh0aGlzLmlzTmlnaHRNb2RlKSA/ICcjNTA1MDUwJyA6ICcjZTNlM2UzJyxcbiAgICAgICAgdGlja0NvbG9yOiAodGhpcy5pc05pZ2h0TW9kZSkgPyAnIzUwNTA1MCcgOiAnI2UzZTNlMycsXG4gICAgICAgIHRpY2tMZW5ndGg6IDcsXG4gICAgICB9LFxuICAgICAgXG4gICAgICB5QXhpczogW3sgLy8gVm9sdW1lIHlBeGlzXG4gICAgICAgIGxpbmVXaWR0aDogMSxcbiAgICAgICAgbGluZUNvbG9yOiAnI2RlZGVkZScsXG4gICAgICAgIHRpY2tXaWR0aDogMSxcbiAgICAgICAgdGlja0xlbmd0aDogNCxcbiAgICAgICAgZ3JpZExpbmVEYXNoU3R5bGU6ICdkYXNoJyxcbiAgICAgICAgZ3JpZExpbmVXaWR0aDogMCxcbiAgICAgICAgZmxvb3I6IDAsXG4gICAgICAgIG1pblBhZGRpbmc6IDAsXG4gICAgICAgIG9wcG9zaXRlOiBmYWxzZSxcbiAgICAgICAgc2hvd0VtcHR5OiBmYWxzZSxcbiAgICAgICAgc2hvd0xhc3RMYWJlbDogZmFsc2UsXG4gICAgICAgIHNob3dGaXJzdExhYmVsOiBmYWxzZSxcbiAgICAgIH0sIHtcbiAgICAgICAgZ3JpZExpbmVDb2xvcjogKHRoaXMuaXNOaWdodE1vZGUpID8gJyM1MDUwNTAnIDogJyNlM2UzZTMnLFxuICAgICAgICBncmlkTGluZURhc2hTdHlsZTogJ2Rhc2gnLFxuICAgICAgICBsaW5lV2lkdGg6IDEsXG4gICAgICAgIHRpY2tXaWR0aDogMSxcbiAgICAgICAgdGlja0xlbmd0aDogNCxcbiAgICAgICAgZmxvb3I6IDAsXG4gICAgICAgIG1pblBhZGRpbmc6IDAsXG4gICAgICAgIHNob3dFbXB0eTogZmFsc2UsXG4gICAgICAgIG9wcG9zaXRlOiB0cnVlLFxuICAgICAgICBncmlkWkluZGV4OiA0LFxuICAgICAgICBzaG93TGFzdExhYmVsOiBmYWxzZSxcbiAgICAgICAgc2hvd0ZpcnN0TGFiZWw6IGZhbHNlLFxuICAgICAgfV0sXG4gICAgICBcbiAgICAgIHNlcmllczogW1xuICAgICAgICB7IC8vb3JkZXIgb2YgdGhlIHNlcmllcyBtYXR0ZXJzXG4gICAgICAgICAgY29sb3I6ICcjNTA4NWVjJyxcbiAgICAgICAgICBuYW1lOiAnUHJpY2UnLFxuICAgICAgICAgIGlkOiAncHJpY2UnLFxuICAgICAgICAgIGRhdGE6IFtdLFxuICAgICAgICAgIHR5cGU6ICdhcmVhJyxcbiAgICAgICAgICBmaWxsT3BhY2l0eTogMC4xNSxcbiAgICAgICAgICBsaW5lV2lkdGg6IDIsXG4gICAgICAgICAgeUF4aXM6IDEsXG4gICAgICAgICAgekluZGV4OiAyLFxuICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgY2xpY2thYmxlOiB0cnVlLFxuICAgICAgICAgIHRocmVzaG9sZDogbnVsbCxcbiAgICAgICAgICB0b29sdGlwOiB7XG4gICAgICAgICAgICB2YWx1ZURlY2ltYWxzOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzaG93SW5OYXZpZ2F0b3I6IHRydWUsXG4gICAgICAgICAgc2hvd0luTGVnZW5kOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGNvbG9yOiBgdXJsKCNmaWxsLXBhdHRlcm4keyh0aGlzLmlzTmlnaHRNb2RlKSA/ICctbmlnaHQnIDogJyd9KWAsXG4gICAgICAgICAgbmFtZTogJ1ZvbHVtZScsXG4gICAgICAgICAgaWQ6ICd2b2x1bWUnLFxuICAgICAgICAgIGRhdGE6IFtdLFxuICAgICAgICAgIHR5cGU6ICdhcmVhJyxcbiAgICAgICAgICBmaWxsT3BhY2l0eTogMC41LFxuICAgICAgICAgIGxpbmVXaWR0aDogMCxcbiAgICAgICAgICB5QXhpczogMCxcbiAgICAgICAgICB6SW5kZXg6IDAsXG4gICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICBjbGlja2FibGU6IHRydWUsXG4gICAgICAgICAgdGhyZXNob2xkOiBudWxsLFxuICAgICAgICAgIHRvb2x0aXA6IHtcbiAgICAgICAgICAgIHZhbHVlRGVjaW1hbHM6IDAsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzaG93SW5OYXZpZ2F0b3I6IHRydWUsXG4gICAgICAgIH1dXG4gICAgfVxuICB9XG4gIFxuICBpbml0KCl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnBhcnNlT3B0aW9ucyh0aGlzLm9wdGlvbnMpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKG9wdGlvbnMpID0+IHtcbiAgICAgIHJldHVybiAod2luZG93LkhpZ2hjaGFydHMpID8gSGlnaGNoYXJ0cy5zdG9ja0NoYXJ0KHRoaXMuY29udGFpbmVyLmlkLCBvcHRpb25zLCAoY2hhcnQpID0+IHRoaXMuYmluZChjaGFydCkpIDogbnVsbDtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgcGFyc2VPcHRpb25zKG9wdGlvbnMpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAudXBkYXRlT2JqZWN0KHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKG5ld09wdGlvbnMpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC51cGRhdGVPYmplY3QodGhpcy5nZXRWb2x1bWVQYXR0ZXJuKCksIG5ld09wdGlvbnMpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKG5ld09wdGlvbnMpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnNldE5hdmlnYXRvcihuZXdPcHRpb25zKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChuZXdPcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gKG5ld09wdGlvbnMubm9EYXRhKSA/IHRoaXMuc2V0Tm9EYXRhTGFiZWwobmV3T3B0aW9ucykgOiBuZXdPcHRpb25zO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKG5ld09wdGlvbnMpID0+IHtcbiAgICAgIHJldHVybiBuZXdPcHRpb25zO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBiaW5kKGNoYXJ0KXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhcnQgPSBjaGFydDtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmZldGNoRGF0YVBhY2thZ2UoKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnNldFJhbmdlU3dpdGNoZXIoKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiAodGhpcy5jYWxsYmFjaykgPyB0aGlzLmNhbGxiYWNrKHRoaXMuY2hhcnQsIHRoaXMuZGVmYXVsdFJhbmdlKSA6IG51bGw7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGZldGNoRGF0YVBhY2thZ2UobWluRGF0ZSwgbWF4RGF0ZSl7XG4gICAgbGV0IGlzUHJlY2lzZVJhbmdlID0gKG1pbkRhdGUgJiYgbWF4RGF0ZSk7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY3BFdmVudHMpe1xuICAgICAgICBsZXQgdXJsID0gKGlzUHJlY2lzZVJhbmdlKSA/IHRoaXMuZ2V0TmF2aWdhdG9yRXh0cmVtZXNVcmwobWluRGF0ZSwgbWF4RGF0ZSwgJ2V2ZW50cycpIDogdGhpcy5nZXRFeHRyZW1lc0RhdGFVcmwodGhpcy5pZCwgJ2V2ZW50cycpICsgJy8nICsgdGhpcy5nZXRSYW5nZSgpICsgJy8nO1xuICAgICAgICByZXR1cm4gKHVybCkgPyB0aGlzLmZldGNoRGF0YSh1cmwsICdldmVudHMnLCAhaXNQcmVjaXNlUmFuZ2UpIDogbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgbGV0IHVybCA9ICgoaXNQcmVjaXNlUmFuZ2UpID8gdGhpcy5nZXROYXZpZ2F0b3JFeHRyZW1lc1VybChtaW5EYXRlLCBtYXhEYXRlKSA6IHRoaXMuYXN5bmNVcmwucmVwbGFjZSgnX3JhbmdlXycsIHRoaXMuZ2V0UmFuZ2UoKSkpICsgdGhpcy5hc3luY1BhcmFtcztcbiAgICAgIHJldHVybiAodXJsKSA/IHRoaXMuZmV0Y2hEYXRhKHVybCwgJ2RhdGEnLCAhaXNQcmVjaXNlUmFuZ2UpIDogbnVsbDtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNoYXJ0LnJlZHJhdyhmYWxzZSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gKCFpc1ByZWNpc2VSYW5nZSkgPyB0aGlzLmNoYXJ0Lnpvb21PdXQoKSA6IG51bGw7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5pc0xvYWRlZCA9IHRydWU7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy50b2dnbGVFdmVudHMoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgZmV0Y2hEYXRhKHVybCwgZGF0YVR5cGUgPSAnZGF0YScsIHJlcGxhY2UgPSB0cnVlKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5jaGFydC5zaG93TG9hZGluZygpO1xuICAgICAgcmV0dXJuIGZldGNoU2VydmljZS5mZXRjaENoYXJ0RGF0YSh1cmwsICF0aGlzLmlzTG9hZGVkKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgdGhpcy5jaGFydC5oaWRlTG9hZGluZygpO1xuICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLmxvZyhgTG9va3MgbGlrZSB0aGVyZSB3YXMgYSBwcm9ibGVtLiBTdGF0dXMgQ29kZTogJHtyZXNwb25zZS5zdGF0dXN9YCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLmRhdGFQYXJzZXIoZGF0YSwgZGF0YVR5cGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoY29udGVudCkgPT4ge1xuICAgICAgICAgIHJldHVybiAocmVwbGFjZSkgPyB0aGlzLnJlcGxhY2VEYXRhKGNvbnRlbnQuZGF0YSwgZGF0YVR5cGUpIDogdGhpcy51cGRhdGVEYXRhKGNvbnRlbnQuZGF0YSwgZGF0YVR5cGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9KTtcbiAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIHRoaXMuY2hhcnQuaGlkZUxvYWRpbmcoKTtcbiAgICAgIHRoaXMuaGlkZUNoYXJ0KCk7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ0ZldGNoIEVycm9yJywgZXJyb3IpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBoaWRlQ2hhcnQoYm9vbCA9IHRydWUpe1xuICAgIGNvbnN0IGNsYXNzRnVuYyA9IChib29sKSA/ICdhZGQnIDogJ3JlbW92ZSc7XG4gICAgY29uc3Qgc2libGluZ3MgPSBjcEJvb3RzdHJhcC5ub2RlTGlzdFRvQXJyYXkodGhpcy5jb250YWluZXIucGFyZW50RWxlbWVudC5jaGlsZE5vZGVzKTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHNpYmxpbmdzLmZpbHRlcihlbGVtZW50ID0+IGVsZW1lbnQuaWQuc2VhcmNoKCdjaGFydCcpID09PSAtMSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChyZXN1bHQsIGVsZW1lbnQgPT4gZWxlbWVudC5jbGFzc0xpc3RbY2xhc3NGdW5jXSgnY3AtaGlkZGVuJykpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGFpbmVyLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0W2NsYXNzRnVuY10oJ2NwLWNoYXJ0LW5vLWRhdGEnKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgc2V0UmFuZ2VTd2l0Y2hlcigpe1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoYCR7IHRoaXMuaWQgfS1zd2l0Y2gtcmFuZ2VgLCAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuZGVmYXVsdFJhbmdlID0gZXZlbnQuZGV0YWlsLmRhdGE7XG4gICAgICByZXR1cm4gdGhpcy5mZXRjaERhdGFQYWNrYWdlKCk7XG4gICAgfSk7XG4gIH1cbiAgXG4gIGdldFJhbmdlKCl7XG4gICAgcmV0dXJuIHRoaXMuZGVmYXVsdFJhbmdlIHx8ICcxcSc7XG4gIH1cbiAgXG4gIHRvZ2dsZUV2ZW50cygpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5jcEV2ZW50cyl7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2hpZ2hjaGFydHMtYW5ub3RhdGlvbicpO1xuICAgICAgfSk7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChlbGVtZW50cykgPT4ge1xuICAgICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChlbGVtZW50cywgZWxlbWVudCA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNFdmVudHNIaWRkZW4pe1xuICAgICAgICAgICAgcmV0dXJuICghZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZ2hjaGFydHMtYW5ub3RhdGlvbl9faGlkZGVuJykpID8gZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWdoY2hhcnRzLWFubm90YXRpb25fX2hpZGRlbicpIDogbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaGlnaGNoYXJ0cy1hbm5vdGF0aW9uX19oaWRkZW4nKSkgPyBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hjaGFydHMtYW5ub3RhdGlvbl9faGlkZGVuJykgOiBudWxsO1xuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2hpZ2hjaGFydHMtcGxvdC1saW5lJyk7XG4gICAgICB9KTtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGVsZW1lbnRzKSA9PiB7XG4gICAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKGVsZW1lbnRzLCBlbGVtZW50ID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5pc0V2ZW50c0hpZGRlbil7XG4gICAgICAgICAgICByZXR1cm4gKCFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaGlnaGNoYXJ0cy1wbG90LWxpbmVfX2hpZGRlbicpKSA/IGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlnaGNoYXJ0cy1wbG90LWxpbmVfX2hpZGRlbicpIDogbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaGlnaGNoYXJ0cy1wbG90LWxpbmVfX2hpZGRlbicpKSA/IGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGNoYXJ0cy1wbG90LWxpbmVfX2hpZGRlbicpIDogbnVsbDtcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgZGF0YVBhcnNlcihkYXRhLCBkYXRhVHlwZSA9ICdkYXRhJyl7XG4gICAgc3dpdGNoIChkYXRhVHlwZSl7XG4gICAgICBjYXNlICdkYXRhJzpcbiAgICAgICAgbGV0IHByb21pc2VEYXRhID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2VEYXRhID0gcHJvbWlzZURhdGEudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuICh0aGlzLmNoYXJ0RGF0YVBhcnNlcikgPyB0aGlzLmNoYXJ0RGF0YVBhcnNlcihkYXRhKSA6IHtcbiAgICAgICAgICAgIGRhdGE6IGRhdGFbMF0sXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlRGF0YTtcbiAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZGF0YSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbiAgXG4gIHVwZGF0ZURhdGEoZGF0YSwgZGF0YVR5cGUpIHtcbiAgICBsZXQgbmV3RGF0YTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgc3dpdGNoIChkYXRhVHlwZSkge1xuICAgICAgICBjYXNlICdkYXRhJzpcbiAgICAgICAgICBuZXdEYXRhID0ge307XG4gICAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AoT2JqZWN0LmVudHJpZXMoZGF0YSksICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNFeGNsdWRlZCh2YWx1ZVswXSkpIHJldHVybjtcbiAgICAgICAgICAgIGxldCBvbGREYXRhID0gdGhpcy5nZXRPbGREYXRhKGRhdGFUeXBlKVt2YWx1ZVswXV07XG4gICAgICAgICAgICBuZXdEYXRhW3ZhbHVlWzBdXSA9IG9sZERhdGFcbiAgICAgICAgICAgICAgLmZpbHRlcigoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZVsxXS5maW5kSW5kZXgoZmluZEVsZW1lbnQgPT4gdGhpcy5pc1RoZVNhbWVFbGVtZW50KGVsZW1lbnQsIGZpbmRFbGVtZW50LCBkYXRhVHlwZSkpID09PSAtMTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmNvbmNhdCh2YWx1ZVsxXSlcbiAgICAgICAgICAgICAgLnNvcnQoKGRhdGExLCBkYXRhMikgPT4gdGhpcy5zb3J0Q29uZGl0aW9uKGRhdGExLCBkYXRhMiwgZGF0YVR5cGUpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgICBuZXdEYXRhID0gW107XG4gICAgICAgICAgbGV0IG9sZERhdGEgPSB0aGlzLmdldE9sZERhdGEoZGF0YVR5cGUpO1xuICAgICAgICAgIHJldHVybiBuZXdEYXRhID0gb2xkRGF0YVxuICAgICAgICAgICAgLmZpbHRlcigoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICBkYXRhLmZpbmRJbmRleChmaW5kRWxlbWVudCA9PiB0aGlzLmlzVGhlU2FtZUVsZW1lbnQoZWxlbWVudCwgZmluZEVsZW1lbnQsIGRhdGFUeXBlKSkgPT09IC0xO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jb25jYXQoZGF0YSlcbiAgICAgICAgICAgIC5zb3J0KChkYXRhMSwgZGF0YTIpID0+IHRoaXMuc29ydENvbmRpdGlvbihkYXRhMSwgZGF0YTIsIGRhdGFUeXBlKSk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZURhdGEobmV3RGF0YSwgZGF0YVR5cGUpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBpc1RoZVNhbWVFbGVtZW50KGVsZW1lbnRBLCBlbGVtZW50QiwgZGF0YVR5cGUpe1xuICAgIHN3aXRjaCAoZGF0YVR5cGUpe1xuICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgIHJldHVybiBlbGVtZW50QVswXSA9PT0gZWxlbWVudEJbMF07XG4gICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICByZXR1cm4gZWxlbWVudEEudHMgPT09IGVsZW1lbnRCLnRzO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICBcbiAgc29ydENvbmRpdGlvbihlbGVtZW50QSwgZWxlbWVudEIsIGRhdGFUeXBlKXtcbiAgICBzd2l0Y2ggKGRhdGFUeXBlKXtcbiAgICAgIGNhc2UgJ2RhdGEnOlxuICAgICAgICByZXR1cm4gZWxlbWVudEFbMF0gLSBlbGVtZW50QlswXTtcbiAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgIHJldHVybiBlbGVtZW50QS50cyAtIGVsZW1lbnRCLnRzO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICBcbiAgZ2V0T2xkRGF0YShkYXRhVHlwZSl7XG4gICAgcmV0dXJuIHRoaXNbJ2NoYXJ0XycrZGF0YVR5cGUudG9Mb3dlckNhc2UoKV07XG4gIH1cbiAgXG4gIHJlcGxhY2VEYXRhKGRhdGEsIGRhdGFUeXBlKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXNbJ2NoYXJ0XycrZGF0YVR5cGUudG9Mb3dlckNhc2UoKV0gPSBkYXRhO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZURhdGFUeXBlKGRhdGEsIGRhdGFUeXBlKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiAodGhpcy5yZXBsYWNlQ2FsbGJhY2spID8gdGhpcy5yZXBsYWNlQ2FsbGJhY2sodGhpcy5jaGFydCwgZGF0YSwgdGhpcy5pc0xvYWRlZCwgZGF0YVR5cGUpIDogbnVsbDtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgcmVwbGFjZURhdGFUeXBlKGRhdGEsIGRhdGFUeXBlKXtcbiAgICBzd2l0Y2ggKGRhdGFUeXBlKXtcbiAgICAgIGNhc2UgJ2RhdGEnOlxuICAgICAgICBpZiAodGhpcy5hc3luY1VybCl7XG4gICAgICAgICAgY3BCb290c3RyYXAubG9vcChbJ2J0Yy1iaXRjb2luJywgJ2V0aC1ldGhlcmV1bSddLCBjb2luTmFtZSA9PiB7XG4gICAgICAgICAgICBsZXQgY29pblNob3J0ID0gY29pbk5hbWUuc3BsaXQoJy0nKVswXTtcbiAgICAgICAgICAgIGlmICh0aGlzLmFzeW5jVXJsLnNlYXJjaChjb2luTmFtZSkgPiAtMSAmJiBkYXRhW2NvaW5TaG9ydF0pIHtcbiAgICAgICAgICAgICAgZGF0YVtjb2luU2hvcnRdID0gW107XG4gICAgICAgICAgICAgIGNwQm9vdHN0cmFwLmxvb3AodGhpcy5jaGFydC5zZXJpZXMsIHNlcmllcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHNlcmllcy51c2VyT3B0aW9ucy5pZCA9PT0gY29pblNob3J0KSBzZXJpZXMudXBkYXRlKHsgdmlzaWJsZTogZmFsc2UgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKE9iamVjdC5lbnRyaWVzKGRhdGEpLCAodmFsdWUpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5pc0V4Y2x1ZGVkKHZhbHVlWzBdKSkgcmV0dXJuO1xuICAgICAgICAgIHJldHVybiAodGhpcy5jaGFydC5nZXQodmFsdWVbMF0pKSA/IHRoaXMuY2hhcnQuZ2V0KHZhbHVlWzBdKS5zZXREYXRhKHZhbHVlWzFdLCBmYWxzZSwgZmFsc2UsIGZhbHNlKSA6IHRoaXMuY2hhcnQuYWRkU2VyaWVzKHtpZDogdmFsdWVbMF0sIGRhdGE6IHZhbHVlWzFdLCBzaG93SW5OYXZpZ2F0b3I6IHRydWV9KTtcbiAgICAgICAgfSk7XG4gICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcCh0aGlzLmNoYXJ0LmFubm90YXRpb25zLmFsbEl0ZW1zLCBhbm5vdGF0aW9uID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhbm5vdGF0aW9uLmRlc3Ryb3koKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNldEFubm90YXRpb25zT2JqZWN0cyhkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIFxuICBpc0V4Y2x1ZGVkKGxhYmVsKXtcbiAgICByZXR1cm4gdGhpcy5leGNsdWRlU2VyaWVzSWRzLmluZGV4T2YobGFiZWwpID4gLTE7XG4gIH1cbiAgXG4gIHRvb2x0aXBGb3JtYXR0ZXIocG9pbnRlciwgbGFiZWwgPSAnJywgc2VhcmNoKXtcbiAgICBpZiAoIXNlYXJjaCkgc2VhcmNoID0gbGFiZWw7XG4gICAgY29uc3QgaGVhZGVyID0gJzxkaXYgY2xhc3M9XCJjcC1jaGFydC10b29sdGlwLWN1cnJlbmN5XCI+PHNtYWxsPicrbmV3IERhdGUocG9pbnRlci54KS50b1VUQ1N0cmluZygpKyc8L3NtYWxsPjx0YWJsZT4nO1xuICAgIGNvbnN0IGZvb3RlciA9ICc8L3RhYmxlPjwvZGl2Pic7XG4gICAgbGV0IGNvbnRlbnQgPSAnJztcbiAgICBwb2ludGVyLnBvaW50cy5mb3JFYWNoKHBvaW50ID0+IHtcbiAgICAgIGNvbnRlbnQgKz0gJzx0cj4nICtcbiAgICAgICAgJzx0ZCBjbGFzcz1cImNwLWNoYXJ0LXRvb2x0aXAtY3VycmVuY3lfX3Jvd1wiPicgK1xuICAgICAgICAnPHN2ZyBjbGFzcz1cImNwLWNoYXJ0LXRvb2x0aXAtY3VycmVuY3lfX2ljb25cIiB3aWR0aD1cIjVcIiBoZWlnaHQ9XCI1XCI+PHJlY3QgeD1cIjBcIiB5PVwiMFwiIHdpZHRoPVwiNVwiIGhlaWdodD1cIjVcIiBmaWxsPVwiJytwb2ludC5zZXJpZXMuY29sb3IrJ1wiIGZpbGwtb3BhY2l0eT1cIjFcIj48L3JlY3Q+PC9zdmc+JyArXG4gICAgICAgIHBvaW50LnNlcmllcy5uYW1lICsgJzogJyArIHBvaW50LnkudG9Mb2NhbGVTdHJpbmcoJ3J1LVJVJywgeyBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDggfSkucmVwbGFjZSgnLCcsICcuJykgKyAnICcgKyAoKHBvaW50LnNlcmllcy5uYW1lLnRvTG93ZXJDYXNlKCkuc2VhcmNoKHNlYXJjaC50b0xvd2VyQ2FzZSgpKSA+IC0xKSA/IFwiXCIgOiBsYWJlbCkgK1xuICAgICAgICAnPC90ZD4nICtcbiAgICAgICAgJzwvdHI+JztcbiAgICB9KTtcbiAgICByZXR1cm4gaGVhZGVyICsgY29udGVudCArIGZvb3RlcjtcbiAgfVxuICBcbiAgc2V0QW5ub3RhdGlvbnNPYmplY3RzKGRhdGEpe1xuICAgIHRoaXMuY2hhcnQuc2VyaWVzWzBdLnhBeGlzLnJlbW92ZVBsb3RMaW5lKCk7XG4gICAgbGV0IHBsb3RMaW5lcyA9IFtdO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gZGF0YS5zb3J0KChkYXRhMSwgZGF0YTIpID0+IHtcbiAgICAgICAgcmV0dXJuIGRhdGEyLnRzIC0gZGF0YTEudHM7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKGRhdGEsIGVsZW1lbnQgPT4ge1xuICAgICAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gcGxvdExpbmVzLnB1c2goe1xuICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICB2YWx1ZTogZWxlbWVudC50cyxcbiAgICAgICAgICAgIGRhc2hTdHlsZTogJ3NvbGlkJyxcbiAgICAgICAgICAgIHpJbmRleDogNCxcbiAgICAgICAgICAgIGNvbG9yOiB0aGlzLmdldEV2ZW50VGFnUGFyYW1zKCkuY29sb3IsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jaGFydC5hZGRBbm5vdGF0aW9uKHtcbiAgICAgICAgICAgIHhWYWx1ZTogZWxlbWVudC50cyxcbiAgICAgICAgICAgIHk6IDAsXG4gICAgICAgICAgICB0aXRsZTogYDxzcGFuIHRpdGxlPVwiQ2xpY2sgdG8gb3BlblwiIGNsYXNzPVwiY3AtY2hhcnQtYW5ub3RhdGlvbl9fdGV4dFwiPiR7IHRoaXMuZ2V0RXZlbnRUYWdQYXJhbXMoZWxlbWVudC50YWcpLmxhYmVsIH08L3NwYW4+PHNwYW4gY2xhc3M9XCJjcC1jaGFydC1hbm5vdGF0aW9uX19kYXRhRWxlbWVudFwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj4keyBKU09OLnN0cmluZ2lmeShlbGVtZW50KSB9PC9zcGFuPmAsXG4gICAgICAgICAgICBzaGFwZToge1xuICAgICAgICAgICAgICB0eXBlOiAnY2lyY2xlJyxcbiAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgcjogMTEsXG4gICAgICAgICAgICAgICAgY3g6IDksXG4gICAgICAgICAgICAgICAgY3k6IDEwLjUsXG4gICAgICAgICAgICAgICAgJ3N0cm9rZS13aWR0aCc6IDEuNSxcbiAgICAgICAgICAgICAgICBmaWxsOiB0aGlzLmdldEV2ZW50VGFnUGFyYW1zKCkuY29sb3IsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgIG1vdXNlb3ZlcjogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKE1vYmlsZURldGVjdC5pc01vYmlsZSgpKSByZXR1cm47XG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmdldEV2ZW50RGF0YUZyb21Bbm5vdGF0aW9uRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMub3BlbkV2ZW50Q29udGFpbmVyKGRhdGEsIGV2ZW50KTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbW91c2VvdXQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoTW9iaWxlRGV0ZWN0LmlzTW9iaWxlKCkpIHJldHVybjtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlRXZlbnRDb250YWluZXIoZXZlbnQpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmdldEV2ZW50RGF0YUZyb21Bbm5vdGF0aW9uRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIGlmIChNb2JpbGVEZXRlY3QuaXNNb2JpbGUoKSkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuRXZlbnRDb250YWluZXIoZGF0YSwgZXZlbnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLm9wZW5FdmVudFBhZ2UoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhcnQuc2VyaWVzWzBdLnhBeGlzLnVwZGF0ZSh7XG4gICAgICAgIHBsb3RMaW5lcyxcbiAgICAgIH0sIGZhbHNlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgc2V0TmF2aWdhdG9yKG9wdGlvbnMpe1xuICAgIGxldCBuYXZpZ2F0b3JPcHRpb25zID0ge307XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGlmIChvcHRpb25zLm5hdmlnYXRvciA9PT0gdHJ1ZSl7XG4gICAgICAgIG5hdmlnYXRvck9wdGlvbnMgPSB7XG4gICAgICAgICAgbmF2aWdhdG9yOiB7XG4gICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICBtYXJnaW46IDIwLFxuICAgICAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgICAgIGxpbmVXaWR0aDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtYXNrRmlsbDogJ3JnYmEoMTAyLDEzMywxOTQsMC4xNSknLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgIHpvb21UeXBlOiAneCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgIHNldEV4dHJlbWVzOiAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICgoZS50cmlnZ2VyID09PSAnbmF2aWdhdG9yJyB8fCBlLnRyaWdnZXIgPT09ICd6b29tJykgJiYgZS5taW4gJiYgZS5tYXgpIHtcbiAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KHRoaXMuaWQrJ1NldEV4dHJlbWVzJywge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgICAgICAgICBtaW5EYXRlOiBlLm1pbixcbiAgICAgICAgICAgICAgICAgICAgICBtYXhEYXRlOiBlLm1heCxcbiAgICAgICAgICAgICAgICAgICAgICBlLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm5hdmlnYXRvckV4dHJlbWVzTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5zZXRSZXNldFpvb21CdXR0b24oKTtcbiAgICAgIH0gZWxzZSBpZiAoIW9wdGlvbnMubmF2aWdhdG9yKSB7XG4gICAgICAgIG5hdmlnYXRvck9wdGlvbnMgPSB7XG4gICAgICAgICAgbmF2aWdhdG9yOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLnVwZGF0ZU9iamVjdChvcHRpb25zLCBuYXZpZ2F0b3JPcHRpb25zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgc2V0UmVzZXRab29tQnV0dG9uKCl7XG4gICAgLy8gcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpOyAvLyBjYW50IGJlIHBvc2l0aW9uZWQgcHJvcGVybHkgaW4gcGxvdEJveCwgc28gaXRzIGRpc2FibGVkXG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmFkZENvbnRhaW5lcih0aGlzLmlkLCAnUmVzZXRab29tJywgJ2NwLWNoYXJ0LXJlc2V0LXpvb20nLCAnYnV0dG9uJylcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdldENvbnRhaW5lcignUmVzZXRab29tJyk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoZWxlbWVudCkgPT4ge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd1ay1idXR0b24nKTtcbiAgICAgIGVsZW1lbnQuaW5uZXJUZXh0ID0gJ1Jlc2V0IHpvb20nO1xuICAgICAgcmV0dXJuIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuY2hhcnQuem9vbU91dCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIG5hdmlnYXRvckV4dHJlbWVzTGlzdGVuZXIoKSB7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKHRoaXMuaWQgKyAnU2V0RXh0cmVtZXMnLCAoZSkgPT4ge1xuICAgICAgICBsZXQgbWluRGF0ZSA9IGNwQm9vdHN0cmFwLnJvdW5kKGUuZGV0YWlsLm1pbkRhdGUgLyAxMDAwLCAwKTtcbiAgICAgICAgbGV0IG1heERhdGUgPSBjcEJvb3RzdHJhcC5yb3VuZChlLmRldGFpbC5tYXhEYXRlIC8gMTAwMCwgMCk7XG4gICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLmZldGNoRGF0YVBhY2thZ2UobWluRGF0ZSwgbWF4RGF0ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBnZXROYXZpZ2F0b3JFeHRyZW1lc1VybChtaW5EYXRlLCBtYXhEYXRlLCBkYXRhVHlwZSl7XG4gICAgbGV0IGV4dHJlbWVzRGF0YVVybCA9IChkYXRhVHlwZSkgPyB0aGlzLmdldEV4dHJlbWVzRGF0YVVybCh0aGlzLmlkLCBkYXRhVHlwZSkgOiB0aGlzLmV4dHJlbWVzRGF0YVVybDtcbiAgICByZXR1cm4gKG1pbkRhdGUgJiYgbWF4RGF0ZSAmJiBleHRyZW1lc0RhdGFVcmwpID8gZXh0cmVtZXNEYXRhVXJsICsnL2RhdGVzLycrbWluRGF0ZSsnLycrbWF4RGF0ZSsnLycgOiBudWxsO1xuICB9XG4gIFxuICBzZXROb0RhdGFMYWJlbChvcHRpb25zKXtcbiAgICBsZXQgbm9EYXRhT3B0aW9ucyA9IHt9O1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBub0RhdGFPcHRpb25zID0ge1xuICAgICAgICBsYW5nOiB7XG4gICAgICAgICAgbm9EYXRhOiAnV2UgZG9uXFwndCBoYXZlIGRhdGEgZm9yIHRoaXMgdGltZSBwZXJpb2QnXG4gICAgICAgIH0sXG4gICAgICAgIG5vRGF0YToge1xuICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICBmb250RmFtaWx5OiAnQXJpYWwnLFxuICAgICAgICAgICAgZm9udFNpemU6ICcxNHB4JyxcbiAgICAgICAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAudXBkYXRlT2JqZWN0KG9wdGlvbnMsIG5vRGF0YU9wdGlvbnMpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBhZGRDb250YWluZXIoaWQsIGxhYmVsLCBjbGFzc05hbWUsIHRhZ05hbWUgPSAnZGl2Jyl7XG4gICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG4gICAgbGV0IGNoYXJ0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgIGNvbnRhaW5lci5pZCA9IGlkICsgbGFiZWw7XG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICBjaGFydENvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICB9XG4gIFxuICBnZXRDb250YWluZXIobGFiZWwpe1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkK2xhYmVsKTtcbiAgfVxuICBcbiAgZ2V0RXh0cmVtZXNEYXRhVXJsKGlkLCBkYXRhVHlwZSA9ICdkYXRhJyl7XG4gICAgcmV0dXJuICcvY3VycmVuY3kvJysgZGF0YVR5cGUgKycvJysgdGhpcy5jdXJyZW5jeTtcbiAgfVxuICBcbiAgZ2V0Vm9sdW1lUGF0dGVybigpe1xuICAgIHJldHVybiB7XG4gICAgICBkZWZzOiB7XG4gICAgICAgIHBhdHRlcm5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ2lkJzogJ2ZpbGwtcGF0dGVybicsXG4gICAgICAgICAgICAncGF0aCc6IHtcbiAgICAgICAgICAgICAgZDogJ00gMyAwIEwgMyAxMCBNIDggMCBMIDggMTAnLFxuICAgICAgICAgICAgICBzdHJva2U6IFwiI2UzZTNlM1wiLFxuICAgICAgICAgICAgICBmaWxsOiAnI2YxZjFmMScsXG4gICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdpZCc6ICdmaWxsLXBhdHRlcm4tbmlnaHQnLFxuICAgICAgICAgICAgJ3BhdGgnOiB7XG4gICAgICAgICAgICAgIGQ6ICdNIDMgMCBMIDMgMTAgTSA4IDAgTCA4IDEwJyxcbiAgICAgICAgICAgICAgc3Ryb2tlOiBcIiM5YjliOWJcIixcbiAgICAgICAgICAgICAgZmlsbDogJyMzODM4MzgnLFxuICAgICAgICAgICAgICBzdHJva2VXaWR0aDogMixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuXG5jbGFzcyBib290c3RyYXBDbGFzcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1wdHlWYWx1ZSA9IDA7XG4gICAgdGhpcy5lbXB0eURhdGEgPSAnLSc7XG4gIH1cbiAgXG4gIG5vZGVMaXN0VG9BcnJheShub2RlTGlzdCkge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChub2RlTGlzdCk7XG4gIH1cbiAgXG4gIHBhcnNlSW50ZXJ2YWxWYWx1ZSh2YWx1ZSkge1xuICAgIGxldCB0aW1lU3ltYm9sID0gJycsIG11bHRpcGxpZXIgPSAxO1xuICAgIGlmICh2YWx1ZS5zZWFyY2goJ3MnKSA+IC0xKSB7XG4gICAgICB0aW1lU3ltYm9sID0gJ3MnO1xuICAgICAgbXVsdGlwbGllciA9IDEwMDA7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5zZWFyY2goJ20nKSA+IC0xKSB7XG4gICAgICB0aW1lU3ltYm9sID0gJ20nO1xuICAgICAgbXVsdGlwbGllciA9IDYwICogMTAwMDtcbiAgICB9XG4gICAgaWYgKHZhbHVlLnNlYXJjaCgnaCcpID4gLTEpIHtcbiAgICAgIHRpbWVTeW1ib2wgPSAnaCc7XG4gICAgICBtdWx0aXBsaWVyID0gNjAgKiA2MCAqIDEwMDA7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5zZWFyY2goJ2QnKSA+IC0xKSB7XG4gICAgICB0aW1lU3ltYm9sID0gJ2QnO1xuICAgICAgbXVsdGlwbGllciA9IDI0ICogNjAgKiA2MCAqIDEwMDA7XG4gICAgfVxuICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlLnJlcGxhY2UodGltZVN5bWJvbCwgJycpKSAqIG11bHRpcGxpZXI7XG4gIH1cbiAgXG4gIGlzRmlhdChjdXJyZW5jeSwgb3JpZ2luKXtcbiAgICBpZiAoIW9yaWdpbikgUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgbGV0IHVybCA9IG9yaWdpbiArICcvZGlzdC9kYXRhL2N1cnJlbmNpZXMuanNvbic7XG4gICAgICByZXR1cm4gZmV0Y2hTZXJ2aWNlLmZldGNoSnNvbkZpbGUodXJsLCB0cnVlKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgIHJldHVybiAocmVzdWx0W2N1cnJlbmN5LnRvVXBwZXJDYXNlKCldKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgdXBkYXRlT2JqZWN0KG9iaiwgbmV3T2JqKSB7XG4gICAgbGV0IHJlc3VsdCA9IG9iajtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AoT2JqZWN0LmtleXMobmV3T2JqKSwga2V5ID0+IHtcbiAgICAgICAgaWYgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHR5cGVvZiByZXN1bHRba2V5XSA9PT0gJ29iamVjdCcpe1xuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZU9iamVjdChyZXN1bHRba2V5XSwgbmV3T2JqW2tleV0pLnRoZW4oKHVwZGF0ZVJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB1cGRhdGVSZXN1bHQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdFtrZXldID0gbmV3T2JqW2tleV07XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgcGFyc2VDdXJyZW5jeU51bWJlcih2YWx1ZSwgY3VycmVuY3ksIG9yaWdpbil7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmlzRmlhdChjdXJyZW5jeSwgb3JpZ2luKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgIHJldHVybiAocmVzdWx0KSA/IHRoaXMucGFyc2VOdW1iZXIodmFsdWUsIDIpIDogdGhpcy5wYXJzZU51bWJlcih2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHBhcnNlTnVtYmVyKG51bWJlciwgcHJlY2lzaW9uKSB7XG4gICAgaWYgKCFudW1iZXIgJiYgbnVtYmVyICE9PSAwKSByZXR1cm4gbnVtYmVyO1xuICAgIGlmIChudW1iZXIgPT09IHRoaXMuZW1wdHlWYWx1ZSB8fCBudW1iZXIgPT09IHRoaXMuZW1wdHlEYXRhKSByZXR1cm4gbnVtYmVyO1xuICAgIG51bWJlciA9IHBhcnNlRmxvYXQobnVtYmVyKTtcbiAgICBpZiAobnVtYmVyID4gMTAwMDAwKSB7XG4gICAgICBsZXQgbnVtYmVyU3RyID0gbnVtYmVyLnRvRml4ZWQoMCk7XG4gICAgICBsZXQgcGFyYW1ldGVyID0gJ0snLFxuICAgICAgICBzcGxpY2VkID0gbnVtYmVyU3RyLnNsaWNlKDAsIG51bWJlclN0ci5sZW5ndGggLSAxKTtcbiAgICAgIGlmIChudW1iZXIgPiAxMDAwMDAwMDAwKSB7XG4gICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDcpO1xuICAgICAgICBwYXJhbWV0ZXIgPSAnQic7XG4gICAgICB9IGVsc2UgaWYgKG51bWJlciA+IDEwMDAwMDApIHtcbiAgICAgICAgc3BsaWNlZCA9IG51bWJlclN0ci5zbGljZSgwLCBudW1iZXJTdHIubGVuZ3RoIC0gNCk7XG4gICAgICAgIHBhcmFtZXRlciA9ICdNJztcbiAgICAgIH1cbiAgICAgIGxldCBuYXR1cmFsID0gc3BsaWNlZC5zbGljZSgwLCBzcGxpY2VkLmxlbmd0aCAtIDIpO1xuICAgICAgbGV0IGRlY2ltYWwgPSBzcGxpY2VkLnNsaWNlKHNwbGljZWQubGVuZ3RoIC0gMik7XG4gICAgICByZXR1cm4gbmF0dXJhbCArICcuJyArIGRlY2ltYWwgKyAnICcgKyBwYXJhbWV0ZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBpc0RlY2ltYWwgPSAobnVtYmVyICUgMSkgPiAwO1xuICAgICAgaWYgKGlzRGVjaW1hbCkge1xuICAgICAgICBpZiAoIXByZWNpc2lvbiB8fCBudW1iZXIgPCAwLjAxKXtcbiAgICAgICAgICBwcmVjaXNpb24gPSAyO1xuICAgICAgICAgIGlmIChudW1iZXIgPCAxKSB7XG4gICAgICAgICAgICBwcmVjaXNpb24gPSA4O1xuICAgICAgICAgIH0gZWxzZSBpZiAobnVtYmVyIDwgMTApIHtcbiAgICAgICAgICAgIHByZWNpc2lvbiA9IDY7XG4gICAgICAgICAgfSBlbHNlIGlmIChudW1iZXIgPCAxMDAwKSB7XG4gICAgICAgICAgICBwcmVjaXNpb24gPSA0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5yb3VuZChudW1iZXIsIHByZWNpc2lvbikudG9Mb2NhbGVTdHJpbmcoJ3J1LVJVJywgeyBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IHByZWNpc2lvbiB9KS5yZXBsYWNlKCcsJywgJy4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudW1iZXIudG9Mb2NhbGVTdHJpbmcoJ3J1LVJVJywgeyBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIgfSkucmVwbGFjZSgnLCcsICcuJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICByb3VuZChhbW91bnQsIGRlY2ltYWwgPSA4LCBkaXJlY3Rpb24gPSAncm91bmQnKSB7XG4gICAgYW1vdW50ID0gcGFyc2VGbG9hdChhbW91bnQpO1xuICAgIGRlY2ltYWwgPSBNYXRoLnBvdygxMCwgZGVjaW1hbCk7XG4gICAgcmV0dXJuIE1hdGhbZGlyZWN0aW9uXShhbW91bnQgKiBkZWNpbWFsKSAvIGRlY2ltYWw7XG4gIH1cbiAgXG4gIGxvb3AoYXJyLCBmbiwgYnVzeSwgZXJyLCBpID0gMCkge1xuICAgIGNvbnN0IGJvZHkgPSAob2ssIGVyKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByID0gZm4oYXJyW2ldLCBpLCBhcnIpO1xuICAgICAgICByICYmIHIudGhlbiA/IHIudGhlbihvaykuY2F0Y2goZXIpIDogb2socilcbiAgICAgIH1cbiAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGVyKGUpXG4gICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBuZXh0ID0gKG9rLCBlcikgPT4gKCkgPT4gdGhpcy5sb29wKGFyciwgZm4sIG9rLCBlciwgKytpKTtcbiAgICBjb25zdCBydW4gPSAob2ssIGVyKSA9PiBpIDwgYXJyLmxlbmd0aCA/IG5ldyBQcm9taXNlKGJvZHkpLnRoZW4obmV4dChvaywgZXIpKS5jYXRjaChlcikgOiBvaygpO1xuICAgIHJldHVybiBidXN5ID8gcnVuKGJ1c3ksIGVycikgOiBuZXcgUHJvbWlzZShydW4pXG4gIH1cbn1cblxuY2xhc3MgZmV0Y2hDbGFzcyB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5zdGF0ZSA9IHt9O1xuICB9XG4gIFxuICBmZXRjaFNjcmlwdCh1cmwpIHtcbiAgICBpZiAodGhpcy5zdGF0ZVt1cmxdKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgIHRoaXMuc3RhdGVbdXJsXSA9ICdwZW5kaW5nJztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUpIHRoaXMuc3RhdGVbdXJsXSA9ICdkb3dubG9hZGVkJztcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlKSBkZWxldGUgdGhpcy5zdGF0ZVt1cmxdO1xuICAgICAgICByZWplY3QobmV3IEVycm9yKGBGYWlsZWQgdG8gbG9hZCBpbWFnZSdzIFVSTDogJHt1cmx9YCkpO1xuICAgICAgfSk7XG4gICAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xuICAgICAgc2NyaXB0LnNyYyA9IHVybDtcbiAgICB9KTtcbiAgfVxuICBcbiAgZmV0Y2hTdHlsZSh1cmwpIHtcbiAgICBpZiAodGhpcy5zdGF0ZVt1cmxdKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgIHRoaXMuc3RhdGVbdXJsXSA9ICdwZW5kaW5nJztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdyZWwnLCAnc3R5bGVzaGVldCcpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgdXJsKTtcbiAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUpIHRoaXMuc3RhdGVbdXJsXSA9ICdkb3dubG9hZGVkJztcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSkgZGVsZXRlIHRoaXMuc3RhdGVbdXJsXTtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgRmFpbGVkIHRvIGxvYWQgc3R5bGUgVVJMOiAke3VybH1gKSk7XG4gICAgICB9KTtcbiAgICAgIGxpbmsuaHJlZiA9IHVybDtcbiAgICB9KTtcbiAgfVxuICBcbiAgZmV0Y2hDaGFydERhdGEodXJpLCBmcm9tU3RhdGUgPSBmYWxzZSl7XG4gICAgY29uc3QgdXJsID0gYGh0dHBzOi8vZ3JhcGhzdjIuY29pbnBhcHJpa2EuY29tJHt1cml9YDtcbiAgICByZXR1cm4gdGhpcy5mZXRjaERhdGEodXJsLCBmcm9tU3RhdGUpO1xuICB9XG4gIFxuICBmZXRjaERhdGEodXJsLCBmcm9tU3RhdGUgPSBmYWxzZSl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGlmIChmcm9tU3RhdGUpe1xuICAgICAgICBpZiAodGhpcy5zdGF0ZVt1cmxdID09PSAncGVuZGluZycpe1xuICAgICAgICAgIGxldCBwcm9taXNlVGltZW91dCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuZmV0Y2hEYXRhKHVybCwgZnJvbVN0YXRlKSk7XG4gICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBwcm9taXNlVGltZW91dDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoISF0aGlzLnN0YXRlW3VybF0pe1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5zdGF0ZVt1cmxdLmNsb25lKCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnN0YXRlW3VybF0gPSAncGVuZGluZyc7XG4gICAgICBsZXQgcHJvbWlzZUZldGNoID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICBwcm9taXNlRmV0Y2ggPSBwcm9taXNlRmV0Y2gudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwpO1xuICAgICAgfSk7XG4gICAgICBwcm9taXNlRmV0Y2ggPSBwcm9taXNlRmV0Y2gudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgdGhpcy5zdGF0ZVt1cmxdID0gcmVzcG9uc2U7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5jbG9uZSgpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcHJvbWlzZUZldGNoO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBmZXRjaEpzb25GaWxlKHVybCwgZnJvbVN0YXRlID0gZmFsc2Upe1xuICAgIHJldHVybiB0aGlzLmZldGNoRGF0YSh1cmwsIGZyb21TdGF0ZSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgaWYgKHJlc3VsdC5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0Lmpzb24oKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3Qgd2lkZ2V0cyA9IG5ldyB3aWRnZXRzQ29udHJvbGxlcigpO1xuY29uc3QgY3BCb290c3RyYXAgPSBuZXcgYm9vdHN0cmFwQ2xhc3MoKTtcbmNvbnN0IGZldGNoU2VydmljZSA9IG5ldyBmZXRjaENsYXNzKCk7XG4iXX0=
