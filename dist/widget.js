(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
      customDate: false,
      startDate: null,
      endDate: null,
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
          if (mainElement.dataset.customDate) _this4.updateData(index, 'customDate', mainElement.dataset.customDate);
          if (mainElement.dataset.startDate) _this4.updateData(index, 'startDate', mainElement.dataset.startDate);
          if (mainElement.dataset.endDate) _this4.updateData(index, 'endDate', mainElement.dataset.endDate);
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
            },
            _ret;
          for (var j = 0; j < updateElements.length; j++) {
            _ret = _loop();
            if (_ret) return _ret.v;
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
      if (key === 'customDate') {
        this.defaults.customDate = !!value;
      }
      if (key === 'startDate') {
        this.defaults.startDate = value !== null && value !== void 0 ? value : false;
      }
      if (key === 'endDate') {
        this.defaults.endDate = value !== null && value !== void 0 ? value : false;
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
    this.customDate = state.customDate || false;
    this.startDate = state.startDate || false;
    this.endDate = state.endDate || false;
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
        return _this17.customDate ? _this17.fetchDataPackage(_this17.startDate, _this17.endDate, true) : _this17.fetchDataPackage();
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
      var initial = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var isPreciseRange = !!minDate && !!maxDate;
      var showInitial = initial ? true : !isPreciseRange;
      var promise = Promise.resolve();
      promise = promise.then(function () {
        if (_this18.options.cpEvents) {
          var url = isPreciseRange ? _this18.getNavigatorExtremesUrl(minDate, maxDate, 'events') : _this18.getExtremesDataUrl(_this18.id, 'events') + '/' + _this18.getRange() + '/';
          return url ? _this18.fetchData(url, 'events', showInitial) : null;
        }
        return null;
      });
      promise = promise.then(function () {
        var url = (isPreciseRange ? _this18.getNavigatorExtremesUrl(minDate, maxDate) : _this18.asyncUrl.replace('_range_', _this18.getRange())) + _this18.asyncParams;
        return url ? _this18.fetchData(url, 'data', showInitial) : null;
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
              // document.body.innerHTML += 'old:'+`${oldData}`
              // document.body.innerHTML += 'new:'+`${newData[value[0]]}`
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7SUNBTSxpQkFBaUI7RUFDckIsU0FBQSxrQkFBQSxFQUFjO0lBQUEsZUFBQSxPQUFBLGlCQUFBO0lBQ1osSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLFlBQVksQ0FBQyxDQUFDO0lBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNiO0VBQUMsWUFBQSxDQUFBLGlCQUFBO0lBQUEsR0FBQTtJQUFBLEtBQUEsRUFFRCxTQUFBLEtBQUEsRUFBTTtNQUFBLElBQUEsS0FBQTtNQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDN0MsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFO1FBQUEsT0FBTSxLQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7TUFBQSxHQUFFLEtBQUssQ0FBQztNQUM5RSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxHQUFHLFlBQU07UUFDMUQsTUFBTSxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksR0FBRyxLQUFLO1FBQ3JELEtBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztNQUNwQixDQUFDO0lBQ0g7RUFBQztJQUFBLEdBQUE7SUFBQSxLQUFBLEVBRUQsU0FBQSxZQUFBLEVBQWE7TUFBQSxJQUFBLE1BQUE7TUFDWCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBQztRQUNqRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxH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ckIsQ0FBQyxDQUFDO01BQ0YsT0FBTyxPQUFPO0lBQ2hCO0VBQUM7SUFBQSxHQUFBO0lBQUEsS0FBQSxFQUVELFNBQUEsY0FBYyxHQUFHLEVBQW9CO01BQUEsSUFBbEIsU0FBUyxHQUFBLFNBQUEsQ0FBQSxNQUFBLFFBQUEsU0FBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLE1BQUcsS0FBSztNQUNsQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU0sRUFBSTtRQUNuRCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFO1VBQ3pCLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RCO1FBQ0EsT0FBTyxLQUFLO01BQ2QsQ0FBQyxDQUFDLFNBQU0sQ0FBQyxZQUFNO1FBQ2IsT0FBTyxLQUFLO01BQ2QsQ0FBQyxDQUFDO0lBQ0o7RUFBQztFQUFBLE9BQUEsVUFBQTtBQUFBO0FBR0gsSUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3ZDLElBQU0sV0FBVyxHQUFHLElBQUksY0FBYyxDQUFDLENBQUM7QUFDeEMsSUFBTSxZQUFZLEdBQUcsSUFBSSxVQUFVLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNsYXNzIHdpZGdldHNDb250cm9sbGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy53aWRnZXRzID0gbmV3IHdpZGdldHNDbGFzcygpO1xuICAgIHRoaXMuYmluZCgpO1xuICB9XG5cbiAgYmluZCgpe1xuICAgIHdpbmRvd1t0aGlzLndpZGdldHMuZGVmYXVsdHMub2JqZWN0TmFtZV0gPSB7fTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4gdGhpcy5pbml0V2lkZ2V0cygpLCBmYWxzZSk7XG4gICAgd2luZG93W3RoaXMud2lkZ2V0cy5kZWZhdWx0cy5vYmplY3ROYW1lXS5iaW5kV2lkZ2V0ID0gKCkgPT4ge1xuICAgICAgd2luZG93W3RoaXMud2lkZ2V0cy5kZWZhdWx0cy5vYmplY3ROYW1lXS5pbml0ID0gZmFsc2U7XG4gICAgICB0aGlzLmluaXRXaWRnZXRzKCk7XG4gICAgfTtcbiAgfVxuXG4gIGluaXRXaWRnZXRzKCl7XG4gICAgaWYgKCF3aW5kb3dbdGhpcy53aWRnZXRzLmRlZmF1bHRzLm9iamVjdE5hbWVdLmluaXQpe1xuICAgICAgd2luZG93W3RoaXMud2lkZ2V0cy5kZWZhdWx0cy5vYmplY3ROYW1lXS5pbml0ID0gdHJ1ZTtcbiAgICAgIGxldCBtYWluRWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMud2lkZ2V0cy5kZWZhdWx0cy5jbGFzc05hbWUpKTtcbiAgICAgIHRoaXMud2lkZ2V0cy5zZXRXaWRnZXRDbGFzcyhtYWluRWxlbWVudHMpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgICAgdGhpcy53aWRnZXRzLnNldFdpZGdldENsYXNzKG1haW5FbGVtZW50cyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFpbkVsZW1lbnRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICB0aGlzLndpZGdldHMuc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKGkpO1xuICAgICAgICB9XG4gICAgICB9LCBmYWxzZSk7XG4gICAgICBsZXQgc2NyaXB0RWxlbWVudCA9IHRoaXMud2lkZ2V0cy5nZXRTY3JpcHRFbGVtZW50KCk7XG4gICAgICBpZiAoc2NyaXB0RWxlbWVudCAmJiBzY3JpcHRFbGVtZW50LmRhdGFzZXQgJiYgc2NyaXB0RWxlbWVudC5kYXRhc2V0LmNwQ3VycmVuY3lXaWRnZXQpe1xuICAgICAgICBsZXQgZGF0YXNldCA9IEpTT04ucGFyc2Uoc2NyaXB0RWxlbWVudC5kYXRhc2V0LmNwQ3VycmVuY3lXaWRnZXQpO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoZGF0YXNldCkpe1xuICAgICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMoZGF0YXNldCk7XG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBrZXlzLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICAgIGxldCBrZXkgPSBrZXlzW2pdLnJlcGxhY2UoJy0nLCAnXycpO1xuICAgICAgICAgICAgdGhpcy53aWRnZXRzLmRlZmF1bHRzW2tleV0gPSBkYXRhc2V0W2tleXNbal1dO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMud2lkZ2V0cy5zdGF0ZXMgPSBbXTtcbiAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AobWFpbkVsZW1lbnRzLCAoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgICBsZXQgbmV3U2V0dGluZ3MgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMud2lkZ2V0cy5kZWZhdWx0cykpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLmlzV29yZHByZXNzID0gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3dvcmRwcmVzcycpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLmlzTmlnaHRNb2RlID0gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NwLXdpZGdldF9fbmlnaHQtbW9kZScpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLm1haW5FbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgICB0aGlzLndpZGdldHMuc3RhdGVzLnB1c2gobmV3U2V0dGluZ3MpO1xuICAgICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBsZXQgY2hhcnRTY3JpcHRzID0gW1xuICAgICAgICAgICAgICAnLy9jb2RlLmhpZ2hjaGFydHMuY29tL3N0b2NrL2hpZ2hzdG9jay5qcycsXG4gICAgICAgICAgICAgICcvL2NvZGUuaGlnaGNoYXJ0cy5jb20vbW9kdWxlcy9leHBvcnRpbmcuanMnLFxuICAgICAgICAgICAgICAnLy9jb2RlLmhpZ2hjaGFydHMuY29tL21vZHVsZXMvbm8tZGF0YS10by1kaXNwbGF5LmpzJyxcbiAgICAgICAgICAgICAgJy8vaGlnaGNoYXJ0cy5naXRodWIuaW8vcGF0dGVybi1maWxsL3BhdHRlcm4tZmlsbC12Mi5qcycsXG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgcmV0dXJuIChuZXdTZXR0aW5ncy5tb2R1bGVzLmluZGV4T2YoJ2NoYXJ0JykgPiAtMSAmJiAhd2luZG93LkhpZ2hjaGFydHMpXG4gICAgICAgICAgICAgID8gY3BCb290c3RyYXAubG9vcChjaGFydFNjcmlwdHMsIGxpbmsgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZldGNoU2VydmljZS5mZXRjaFNjcmlwdChsaW5rKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICA6IG51bGw7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53aWRnZXRzLmluaXQoaW5kZXgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9KTtcbiAgICAgIH0sIDUwKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3Mgd2lkZ2V0c0NsYXNzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zdGF0ZXMgPSBbXTtcbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgb2JqZWN0TmFtZTogJ2NwQ3VycmVuY3lXaWRnZXRzJyxcbiAgICAgIGNsYXNzTmFtZTogJ2NvaW5wYXByaWthLWN1cnJlbmN5LXdpZGdldCcsXG4gICAgICBjc3NGaWxlTmFtZTogJ3dpZGdldC5taW4uY3NzJyxcbiAgICAgIGN1cnJlbmN5OiAnYnRjLWJpdGNvaW4nLFxuICAgICAgcHJpbWFyeV9jdXJyZW5jeTogJ1VTRCcsXG4gICAgICByYW5nZV9saXN0OiBbJzI0aCcsICc3ZCcsICczMGQnLCAnMXEnLCAnMXknLCAneXRkJywgJ2FsbCddLFxuICAgICAgcmFuZ2U6ICc3ZCcsXG4gICAgICBtb2R1bGVzOiBbJ21hcmtldF9kZXRhaWxzJywgJ2NoYXJ0J10sXG4gICAgICB1cGRhdGVfYWN0aXZlOiBmYWxzZSxcbiAgICAgIHVwZGF0ZV90aW1lb3V0OiAnMzBzJyxcbiAgICAgIGxhbmd1YWdlOiAnZW4nLFxuICAgICAgY3VzdG9tRGF0ZTogZmFsc2UsXG4gICAgICBzdGFydERhdGU6IG51bGwsXG4gICAgICBlbmREYXRlOiBudWxsLFxuICAgICAgc3R5bGVfc3JjOiBudWxsLFxuICAgICAgaW1nX3NyYzogbnVsbCxcbiAgICAgIGxhbmdfc3JjOiBudWxsLFxuICAgICAgZGF0YV9zcmM6IG51bGwsXG4gICAgICBvcmlnaW5fc3JjOiAnaHR0cHM6Ly91bnBrZy5jb20vQGNvaW5wYXByaWthL3dpZGdldC1jdXJyZW5jeUBsYXRlc3QnLFxuICAgICAgc2hvd19kZXRhaWxzX2N1cnJlbmN5OiBmYWxzZSxcbiAgICAgIHRpY2tlcjoge1xuICAgICAgICBuYW1lOiB1bmRlZmluZWQsXG4gICAgICAgIHN5bWJvbDogdW5kZWZpbmVkLFxuICAgICAgICBwcmljZTogdW5kZWZpbmVkLFxuICAgICAgICBwcmljZV9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgICAgIHJhbms6IHVuZGVmaW5lZCxcbiAgICAgICAgcHJpY2VfYXRoOiB1bmRlZmluZWQsXG4gICAgICAgIHZvbHVtZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgICAgbWFya2V0X2NhcDogdW5kZWZpbmVkLFxuICAgICAgICBwZXJjZW50X2Zyb21fcHJpY2VfYXRoOiB1bmRlZmluZWQsXG4gICAgICAgIHZvbHVtZV8yNGhfY2hhbmdlXzI0aDogdW5kZWZpbmVkLFxuICAgICAgICBtYXJrZXRfY2FwX2NoYW5nZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgICBpbnRlcnZhbDogbnVsbCxcbiAgICAgIGlzV29yZHByZXNzOiBmYWxzZSxcbiAgICAgIGlzTmlnaHRNb2RlOiBmYWxzZSxcbiAgICAgIGlzRGF0YTogZmFsc2UsXG4gICAgICBhdmFpbGFibGVNb2R1bGVzOiBbJ3ByaWNlJywgJ2NoYXJ0JywgJ21hcmtldF9kZXRhaWxzJ10sXG4gICAgICBtZXNzYWdlOiAnZGF0YV9sb2FkaW5nJyxcbiAgICAgIHRyYW5zbGF0aW9uczoge30sXG4gICAgICBtYWluRWxlbWVudDogbnVsbCxcbiAgICAgIG5vVHJhbnNsYXRpb25MYWJlbHM6IFtdLFxuICAgICAgc2NyaXB0c0Rvd25sb2FkZWQ6IHt9LFxuICAgICAgY2hhcnQ6IG51bGwsXG4gICAgICByd2Q6IHtcbiAgICAgICAgeHM6IDI4MCxcbiAgICAgICAgczogMzIwLFxuICAgICAgICBtOiAzNzAsXG4gICAgICAgIGw6IDQ2MixcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGluaXQoaW5kZXgpIHtcbiAgICBpZiAoIXRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5lcnJvcignQmluZCBmYWlsZWQsIG5vIGVsZW1lbnQgd2l0aCBjbGFzcyA9IFwiJyArIHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lICsgJ1wiJyk7XG4gICAgfVxuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5nZXREZWZhdWx0cyhpbmRleCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRPcmlnaW5MaW5rKGluZGV4KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHNldFdpZGdldENsYXNzKGVsZW1lbnRzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHdpZHRoID0gZWxlbWVudHNbaV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgICBsZXQgcndkS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuZGVmYXVsdHMucndkKTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcndkS2V5cy5sZW5ndGg7IGorKykge1xuICAgICAgICBsZXQgcndkS2V5ID0gcndkS2V5c1tqXTtcbiAgICAgICAgbGV0IHJ3ZFBhcmFtID0gdGhpcy5kZWZhdWx0cy5yd2RbcndkS2V5XTtcbiAgICAgICAgbGV0IGNsYXNzTmFtZSA9IHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lICsgJ19fJyArIHJ3ZEtleTtcbiAgICAgICAgaWYgKHdpZHRoIDw9IHJ3ZFBhcmFtKSBlbGVtZW50c1tpXS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICAgIGlmICh3aWR0aCA+IHJ3ZFBhcmFtKSBlbGVtZW50c1tpXS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0TWFpbkVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gKHRoaXMuc3RhdGVzW2luZGV4XSkgPyB0aGlzLnN0YXRlc1tpbmRleF0ubWFpbkVsZW1lbnQgOiBudWxsO1xuICB9XG5cbiAgZ2V0RGVmYXVsdHMoaW5kZXgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBsZXQgbWFpbkVsZW1lbnQgPSB0aGlzLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICAgIGlmIChtYWluRWxlbWVudCAmJiBtYWluRWxlbWVudC5kYXRhc2V0KSB7XG4gICAgICAgIGlmICghbWFpbkVsZW1lbnQuZGF0YXNldC5tb2R1bGVzICYmIG1haW5FbGVtZW50LmRhdGFzZXQudmVyc2lvbiA9PT0gJ2V4dGVuZGVkJykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbW9kdWxlcycsIFsnbWFya2V0X2RldGFpbHMnXSk7XG4gICAgICAgIGlmICghbWFpbkVsZW1lbnQuZGF0YXNldC5tb2R1bGVzICYmIG1haW5FbGVtZW50LmRhdGFzZXQudmVyc2lvbiA9PT0gJ3N0YW5kYXJkJykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbW9kdWxlcycsIFtdKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubW9kdWxlcykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbW9kdWxlcycsIEpTT04ucGFyc2UobWFpbkVsZW1lbnQuZGF0YXNldC5tb2R1bGVzKSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnByaW1hcnlDdXJyZW5jeSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAncHJpbWFyeV9jdXJyZW5jeScsIG1haW5FbGVtZW50LmRhdGFzZXQucHJpbWFyeUN1cnJlbmN5KTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuY3VycmVuY3kpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2N1cnJlbmN5JywgbWFpbkVsZW1lbnQuZGF0YXNldC5jdXJyZW5jeSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmN1c3RvbURhdGUpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2N1c3RvbURhdGUnLCBtYWluRWxlbWVudC5kYXRhc2V0LmN1c3RvbURhdGUpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5zdGFydERhdGUpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3N0YXJ0RGF0ZScsIG1haW5FbGVtZW50LmRhdGFzZXQuc3RhcnREYXRlKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuZW5kRGF0ZSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnZW5kRGF0ZScsIG1haW5FbGVtZW50LmRhdGFzZXQuZW5kRGF0ZSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnJhbmdlKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdyYW5nZScsIG1haW5FbGVtZW50LmRhdGFzZXQucmFuZ2UpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5zaG93RGV0YWlsc0N1cnJlbmN5KSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdzaG93X2RldGFpbHNfY3VycmVuY3knLCAobWFpbkVsZW1lbnQuZGF0YXNldC5zaG93RGV0YWlsc0N1cnJlbmN5ID09PSAndHJ1ZScpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlQWN0aXZlKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICd1cGRhdGVfYWN0aXZlJywgKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlQWN0aXZlID09PSAndHJ1ZScpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlVGltZW91dCkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAndXBkYXRlX3RpbWVvdXQnLCBjcEJvb3RzdHJhcC5wYXJzZUludGVydmFsVmFsdWUobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVUaW1lb3V0KSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lmxhbmd1YWdlKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdsYW5ndWFnZScsIG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ3VhZ2UpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5vcmlnaW5TcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ29yaWdpbl9zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0Lm9yaWdpblNyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lm5vZGVNb2R1bGVzU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdub2RlX21vZHVsZXNfc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5ub2RlTW9kdWxlc1NyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmJvd2VyU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdib3dlcl9zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LmJvd2VyU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuc3R5bGVTcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3N0eWxlX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQuc3R5bGVTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5sYW5nU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdsb2dvX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ1NyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmltZ1NyYykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbG9nb19zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LmltZ1NyYyk7XG4gICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0T3JpZ2luTGluayhpbmRleCkge1xuICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9ucykubGVuZ3RoID09PSAwKSB0aGlzLmdldFRyYW5zbGF0aW9ucyh0aGlzLmRlZmF1bHRzLmxhbmd1YWdlKTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc3R5bGVzaGVldCgpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuYWRkV2lkZ2V0RWxlbWVudChpbmRleCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5pbml0SW50ZXJ2YWwoaW5kZXgpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgYWRkV2lkZ2V0RWxlbWVudChpbmRleCkge1xuICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgIGxldCBtb2R1bGVzID0gJyc7XG4gICAgbGV0IG1vZHVsZXNBcnJheSA9IFtdO1xuICAgIGxldCBjaGFydENvbnRhaW5lciA9IG51bGw7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKHRoaXMuZGVmYXVsdHMuYXZhaWxhYmxlTW9kdWxlcywgbW9kdWxlID0+IHtcbiAgICAgICAgcmV0dXJuICh0aGlzLnN0YXRlc1tpbmRleF0ubW9kdWxlcy5pbmRleE9mKG1vZHVsZSkgPiAtMSkgPyBtb2R1bGVzQXJyYXkucHVzaChtb2R1bGUpIDogbnVsbDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AobW9kdWxlc0FycmF5LCBtb2R1bGUgPT4ge1xuICAgICAgICBsZXQgbGFiZWwgPSBudWxsO1xuICAgICAgICBpZiAobW9kdWxlID09PSAnY2hhcnQnKSBsYWJlbCA9ICdDaGFydCc7XG4gICAgICAgIGlmIChtb2R1bGUgPT09ICdtYXJrZXRfZGV0YWlscycpIGxhYmVsID0gJ01hcmtldERldGFpbHMnO1xuICAgICAgICByZXR1cm4gKGxhYmVsKSA/IHRoaXNbYHdpZGdldCR7IGxhYmVsIH1FbGVtZW50YF0oaW5kZXgpLnRoZW4ocmVzdWx0ID0+IG1vZHVsZXMgKz0gcmVzdWx0KSA6IG51bGw7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBtYWluRWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLndpZGdldE1haW5FbGVtZW50KGluZGV4KSArIG1vZHVsZXMgKyB0aGlzLndpZGdldEZvb3RlcihpbmRleCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBjaGFydENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAkeyB0aGlzLmRlZmF1bHRzLmNsYXNzTmFtZSB9LXByaWNlLWNoYXJ0LSR7IGluZGV4IH1gKTtcbiAgICAgIHJldHVybiAoY2hhcnRDb250YWluZXIpID8gY2hhcnRDb250YWluZXIucGFyZW50RWxlbWVudC5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIHRoaXMud2lkZ2V0U2VsZWN0RWxlbWVudChpbmRleCwgJ3JhbmdlJykpIDogbnVsbDtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGlmIChjaGFydENvbnRhaW5lcil7XG4gICAgICAgIHRoaXMuc3RhdGVzW2luZGV4XS5jaGFydCA9IG5ldyBjaGFydENsYXNzKGNoYXJ0Q29udGFpbmVyLCB0aGlzLnN0YXRlc1tpbmRleF0pO1xuICAgICAgICB0aGlzLnNldFNlbGVjdExpc3RlbmVycyhpbmRleCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcblxuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKGluZGV4KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdldERhdGEoaW5kZXgpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgc2V0U2VsZWN0TGlzdGVuZXJzKGluZGV4KXtcbiAgICBsZXQgbWFpbkVsZW1lbnQgPSB0aGlzLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICBsZXQgc2VsZWN0RWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0LXNlbGVjdCcpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0RWxlbWVudHMubGVuZ3RoOyBpKyspe1xuICAgICAgbGV0IGJ1dHRvbnMgPSBzZWxlY3RFbGVtZW50c1tpXS5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0LXNlbGVjdF9fb3B0aW9ucyBidXR0b24nKTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYnV0dG9ucy5sZW5ndGg7IGorKyl7XG4gICAgICAgIGJ1dHRvbnNbal0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFNlbGVjdE9wdGlvbihldmVudCwgaW5kZXgpO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0U2VsZWN0T3B0aW9uKGV2ZW50LCBpbmRleCl7XG4gICAgbGV0IGNsYXNzTmFtZSA9ICdjcC13aWRnZXQtYWN0aXZlJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspe1xuICAgICAgbGV0IHNpYmxpbmcgPSBldmVudC50YXJnZXQucGFyZW50Tm9kZS5jaGlsZE5vZGVzW2ldO1xuICAgICAgaWYgKHNpYmxpbmcuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpIHNpYmxpbmcuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgIH1cbiAgICBsZXQgcGFyZW50ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5jcC13aWRnZXQtc2VsZWN0Jyk7XG4gICAgbGV0IHR5cGUgPSBwYXJlbnQuZGF0YXNldC50eXBlO1xuICAgIGxldCBwaWNrZWRWYWx1ZUVsZW1lbnQgPSBwYXJlbnQucXVlcnlTZWxlY3RvcignLmNwLXdpZGdldC1zZWxlY3RfX29wdGlvbnMgPiBzcGFuJyk7XG4gICAgbGV0IHZhbHVlID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQub3B0aW9uO1xuICAgIHBpY2tlZFZhbHVlRWxlbWVudC5pbm5lclRleHQgPSB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCB2YWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsIHR5cGUsIHZhbHVlKTtcbiAgICBldmVudC50YXJnZXQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgIHRoaXMuZGlzcGF0Y2hFdmVudChpbmRleCwgJy1zd2l0Y2gtcmFuZ2UnLCB2YWx1ZSk7XG4gIH1cblxuICBkaXNwYXRjaEV2ZW50KGluZGV4LCBuYW1lLCBkYXRhKXtcbiAgICBsZXQgaWQgPSBgJHsgdGhpcy5kZWZhdWx0cy5jbGFzc05hbWUgfS1wcmljZS1jaGFydC0keyBpbmRleCB9YDtcbiAgICByZXR1cm4gZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoYCR7aWR9JHtuYW1lfWAsIHsgZGV0YWlsOiB7IGRhdGEgfSB9KSk7XG4gIH1cblxuICBnZXREYXRhKGluZGV4KSB7XG4gICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vYXBpLmNvaW5wYXByaWthLmNvbS92MS93aWRnZXQvJyArIHRoaXMuc3RhdGVzW2luZGV4XS5jdXJyZW5jeSArICc/cXVvdGU9JyArIHRoaXMuc3RhdGVzW2luZGV4XS5wcmltYXJ5X2N1cnJlbmN5O1xuICAgIHJldHVybiBmZXRjaFNlcnZpY2UuZmV0Y2hEYXRhKHVybCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGVzW2luZGV4XS5pc0RhdGEpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2lzRGF0YScsIHRydWUpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRpY2tlcihpbmRleCwgcmVzdWx0KTtcbiAgICAgIH0pXG4gICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMub25FcnJvclJlcXVlc3QoaW5kZXgsIGVycm9yKTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uRXJyb3JSZXF1ZXN0KGluZGV4LCB4aHIpIHtcbiAgICBpZiAodGhpcy5zdGF0ZXNbaW5kZXhdLmlzRGF0YSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnaXNEYXRhJywgZmFsc2UpO1xuICAgIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ21lc3NhZ2UnLCAnZGF0YV91bmF2YWlsYWJsZScpO1xuICAgIGNvbnNvbGUuZXJyb3IoJ1JlcXVlc3QgZmFpbGVkLiAgUmV0dXJuZWQgc3RhdHVzIG9mICcgKyB4aHIsIHRoaXMuc3RhdGVzW2luZGV4XSk7XG4gIH1cblxuICBpbml0SW50ZXJ2YWwoaW5kZXgpIHtcbiAgICBjbGVhckludGVydmFsKHRoaXMuc3RhdGVzW2luZGV4XS5pbnRlcnZhbCk7XG4gICAgaWYgKHRoaXMuc3RhdGVzW2luZGV4XS51cGRhdGVfYWN0aXZlICYmIHRoaXMuc3RhdGVzW2luZGV4XS51cGRhdGVfdGltZW91dCA+IDEwMDApIHtcbiAgICAgIHRoaXMuc3RhdGVzW2luZGV4XS5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgdGhpcy5nZXREYXRhKGluZGV4KTtcbiAgICAgIH0sIHRoaXMuc3RhdGVzW2luZGV4XS51cGRhdGVfdGltZW91dCk7XG4gICAgfVxuICB9XG5cbiAgc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKGluZGV4KSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlc1tpbmRleF0uaXNXb3JkcHJlc3MpIHtcbiAgICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgaWYgKG1haW5FbGVtZW50KSB7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5jaGlsZHJlblswXS5sb2NhbE5hbWUgPT09ICdzdHlsZScpIHtcbiAgICAgICAgICBtYWluRWxlbWVudC5yZW1vdmVDaGlsZChtYWluRWxlbWVudC5jaGlsZE5vZGVzWzBdKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZm9vdGVyRWxlbWVudCA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jcC13aWRnZXRfX2Zvb3RlcicpO1xuICAgICAgICBsZXQgdmFsdWUgPSBmb290ZXJFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gNDM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZm9vdGVyRWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFsdWUgLT0gZm9vdGVyRWxlbWVudC5jaGlsZE5vZGVzW2ldLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHN0eWxlLmlubmVySFRNTCA9ICcuY3Atd2lkZ2V0X19mb290ZXItLScgKyBpbmRleCArICc6OmJlZm9yZXt3aWR0aDonICsgdmFsdWUudG9GaXhlZCgwKSArICdweDt9JztcbiAgICAgICAgbWFpbkVsZW1lbnQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBtYWluRWxlbWVudC5jaGlsZHJlblswXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlV2lkZ2V0RWxlbWVudChpbmRleCwga2V5LCB2YWx1ZSwgdGlja2VyKSB7XG4gICAgbGV0IHN0YXRlID0gdGhpcy5zdGF0ZXNbaW5kZXhdO1xuICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgIGlmIChtYWluRWxlbWVudCkge1xuICAgICAgbGV0IHRpY2tlckNsYXNzID0gKHRpY2tlcikgPyAnVGlja2VyJyA6ICcnO1xuICAgICAgaWYgKGtleSA9PT0gJ25hbWUnIHx8IGtleSA9PT0gJ2N1cnJlbmN5Jykge1xuICAgICAgICBpZiAoa2V5ID09PSAnY3VycmVuY3knKSB7XG4gICAgICAgICAgbGV0IGFFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXRfX2Zvb3RlciA+IGEnKTtcbiAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGFFbGVtZW50cy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgYUVsZW1lbnRzW2tdLmhyZWYgPSB0aGlzLmNvaW5fbGluayh2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2V0SW1hZ2UoaW5kZXgpO1xuICAgICAgfVxuICAgICAgaWYgKGtleSA9PT0gJ2lzRGF0YScgfHwga2V5ID09PSAnbWVzc2FnZScpIHtcbiAgICAgICAgbGV0IGhlYWRlckVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNwLXdpZGdldF9fbWFpbicpO1xuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGhlYWRlckVsZW1lbnRzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgaGVhZGVyRWxlbWVudHNba10uaW5uZXJIVE1MID0gKCFzdGF0ZS5pc0RhdGEpID8gdGhpcy53aWRnZXRNYWluRWxlbWVudE1lc3NhZ2UoaW5kZXgpIDogdGhpcy53aWRnZXRNYWluRWxlbWVudERhdGEoaW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgdXBkYXRlRWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIGtleSArIHRpY2tlckNsYXNzKTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB1cGRhdGVFbGVtZW50cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGxldCB1cGRhdGVFbGVtZW50ID0gdXBkYXRlRWxlbWVudHNbal07XG4gICAgICAgICAgaWYgKHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjcC13aWRnZXRfX3JhbmsnKSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9IChwYXJzZUZsb2F0KHZhbHVlKSA+IDApID8gXCJjcC13aWRnZXRfX3JhbmstdXBcIiA6ICgocGFyc2VGbG9hdCh2YWx1ZSkgPCAwKSA/IFwiY3Atd2lkZ2V0X19yYW5rLWRvd25cIiA6IFwiY3Atd2lkZ2V0X19yYW5rLW5ldXRyYWxcIik7XG4gICAgICAgICAgICB1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9fcmFuay1kb3duJyk7XG4gICAgICAgICAgICB1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9fcmFuay11cCcpO1xuICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX3JhbmstbmV1dHJhbCcpO1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSBjcEJvb3RzdHJhcC5lbXB0eURhdGE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgdmFsdWUgPSAoa2V5ID09PSAncHJpY2VfY2hhbmdlXzI0aCcpID8gJygnICsgY3BCb290c3RyYXAucm91bmQodmFsdWUsIDIpICsgJyUpJyA6IGNwQm9vdHN0cmFwLnJvdW5kKHZhbHVlLCAyKSArICclJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93RGV0YWlsc0N1cnJlbmN5JykgJiYgIXN0YXRlLnNob3dfZGV0YWlsc19jdXJyZW5jeSkge1xuICAgICAgICAgICAgdmFsdWUgPSAnICc7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncGFyc2VOdW1iZXInKSkge1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luID0gdGhpcy5kZWZhdWx0cy5kYXRhX3NyYyB8fCB0aGlzLmRlZmF1bHRzLm9yaWdpbl9zcmM7XG4gICAgICAgICAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5wYXJzZUN1cnJlbmN5TnVtYmVyKHZhbHVlLCBzdGF0ZS5wcmltYXJ5X2N1cnJlbmN5LCBvcmlnaW4pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZUVsZW1lbnQuaW5uZXJUZXh0ID0gcmVzdWx0IHx8IGNwQm9vdHN0cmFwLmVtcHR5RGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuaW5uZXJUZXh0ID0gdmFsdWUgfHwgY3BCb290c3RyYXAuZW1wdHlEYXRhO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZURhdGEoaW5kZXgsIGtleSwgdmFsdWUsIHRpY2tlcikge1xuICAgIGlmICh0aWNrZXIpIHtcbiAgICAgIHRoaXMuc3RhdGVzW2luZGV4XS50aWNrZXJba2V5XSA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlc1tpbmRleF1ba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgICBpZiAoa2V5ID09PSAnbGFuZ3VhZ2UnKSB7XG4gICAgICB0aGlzLmdldFRyYW5zbGF0aW9ucyh2YWx1ZSk7XG4gICAgfVxuICAgIGlmIChrZXkgPT09ICdjdXN0b21EYXRlJykge1xuICAgICAgdGhpcy5kZWZhdWx0cy5jdXN0b21EYXRlID0gISF2YWx1ZTtcbiAgICB9XG4gICAgaWYgKGtleSA9PT0gJ3N0YXJ0RGF0ZScpIHtcbiAgICAgIHRoaXMuZGVmYXVsdHMuc3RhcnREYXRlID0gdmFsdWUgPz8gZmFsc2U7XG4gICAgfVxuICAgIGlmIChrZXkgPT09ICdlbmREYXRlJykge1xuICAgICAgdGhpcy5kZWZhdWx0cy5lbmREYXRlID0gdmFsdWUgPz8gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlV2lkZ2V0RWxlbWVudChpbmRleCwga2V5LCB2YWx1ZSwgdGlja2VyKTtcbiAgfVxuXG4gIHVwZGF0ZVdpZGdldFRyYW5zbGF0aW9ucyhsYW5nLCBkYXRhKSB7XG4gICAgdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ10gPSBkYXRhO1xuICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5zdGF0ZXMubGVuZ3RoOyB4KyspIHtcbiAgICAgIGxldCBpc05vVHJhbnNsYXRpb25MYWJlbHNVcGRhdGUgPSB0aGlzLnN0YXRlc1t4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLmxlbmd0aCA+IDAgJiYgbGFuZyA9PT0gJ2VuJztcbiAgICAgIGlmICh0aGlzLnN0YXRlc1t4XS5sYW5ndWFnZSA9PT0gbGFuZyB8fCBpc05vVHJhbnNsYXRpb25MYWJlbHNVcGRhdGUpIHtcbiAgICAgICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5zdGF0ZXNbeF0ubWFpbkVsZW1lbnQ7XG4gICAgICAgIGxldCB0cmFuc2FsdGVFbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC10cmFuc2xhdGlvbicpKTtcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0cmFuc2FsdGVFbGVtZW50cy5sZW5ndGg7IHkrKykge1xuICAgICAgICAgIHRyYW5zYWx0ZUVsZW1lbnRzW3ldLmNsYXNzTGlzdC5mb3JFYWNoKChjbGFzc05hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChjbGFzc05hbWUuc2VhcmNoKCd0cmFuc2xhdGlvbl8nKSA+IC0xKSB7XG4gICAgICAgICAgICAgIGxldCB0cmFuc2xhdGVLZXkgPSBjbGFzc05hbWUucmVwbGFjZSgndHJhbnNsYXRpb25fJywgJycpO1xuICAgICAgICAgICAgICBpZiAodHJhbnNsYXRlS2V5ID09PSAnbWVzc2FnZScpIHRyYW5zbGF0ZUtleSA9IHRoaXMuc3RhdGVzW3hdLm1lc3NhZ2U7XG4gICAgICAgICAgICAgIGxldCBsYWJlbEluZGV4ID0gdGhpcy5zdGF0ZXNbeF0ubm9UcmFuc2xhdGlvbkxhYmVscy5pbmRleE9mKHRyYW5zbGF0ZUtleSk7XG4gICAgICAgICAgICAgIGxldCB0ZXh0ID0gdGhpcy5nZXRUcmFuc2xhdGlvbih4LCB0cmFuc2xhdGVLZXkpO1xuICAgICAgICAgICAgICBpZiAobGFiZWxJbmRleCA+IC0xICYmIHRleHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1t4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLnNwbGljZShsYWJlbEluZGV4LCAxKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRyYW5zYWx0ZUVsZW1lbnRzW3ldLmlubmVyVGV4dCA9IHRleHQ7XG4gICAgICAgICAgICAgIGlmICh0cmFuc2FsdGVFbGVtZW50c1t5XS5jbG9zZXN0KCcuY3Atd2lkZ2V0X19mb290ZXInKSkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZXRCZWZvcmVFbGVtZW50SW5Gb290ZXIoeCksIDUwKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGRhdGVUaWNrZXIoaW5kZXgsIGRhdGEpIHtcbiAgICBsZXQgZGF0YUtleXMgPSBPYmplY3Qua2V5cyhkYXRhKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsIGRhdGFLZXlzW2ldLCBkYXRhW2RhdGFLZXlzW2ldXSwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgc3R5bGVzaGVldCgpIHtcbiAgICBpZiAodGhpcy5kZWZhdWx0cy5zdHlsZV9zcmMgIT09IGZhbHNlKSB7XG4gICAgICBsZXQgdXJsID0gdGhpcy5kZWZhdWx0cy5zdHlsZV9zcmMgfHwgdGhpcy5kZWZhdWx0cy5vcmlnaW5fc3JjICsgJy9kaXN0LycgKyB0aGlzLmRlZmF1bHRzLmNzc0ZpbGVOYW1lO1xuICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJ2xpbmtbaHJlZj1cIicgKyB1cmwgKyAnXCJdJykpe1xuICAgICAgICByZXR1cm4gZmV0Y2hTZXJ2aWNlLmZldGNoU3R5bGUodXJsKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgd2lkZ2V0TWFpbkVsZW1lbnQoaW5kZXgpIHtcbiAgICBsZXQgZGF0YSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcbiAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX2hlYWRlclwiPicgK1xuICAgICAgJzxkaXYgY2xhc3M9XCInICsgJ2NwLXdpZGdldF9faW1nIGNwLXdpZGdldF9faW1nLScgKyBkYXRhLmN1cnJlbmN5ICsgJ1wiPicgK1xuICAgICAgJzxpbWcvPicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX21haW5cIj4nICtcbiAgICAgICgoZGF0YS5pc0RhdGEpID8gdGhpcy53aWRnZXRNYWluRWxlbWVudERhdGEoaW5kZXgpIDogdGhpcy53aWRnZXRNYWluRWxlbWVudE1lc3NhZ2UoaW5kZXgpKSArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+JztcbiAgfVxuXG4gIHdpZGdldE1haW5FbGVtZW50RGF0YShpbmRleCkge1xuICAgIGxldCBkYXRhID0gdGhpcy5zdGF0ZXNbaW5kZXhdO1xuICAgIHJldHVybiAnPGgzPjxhIGhyZWY9XCInICsgdGhpcy5jb2luX2xpbmsoZGF0YS5jdXJyZW5jeSkgKyAnXCI+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJuYW1lVGlja2VyXCI+JyArIChkYXRhLnRpY2tlci5uYW1lIHx8IGNwQm9vdHN0cmFwLmVtcHR5RGF0YSkgKyAnPC9zcGFuPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwic3ltYm9sVGlja2VyXCI+JyArIChkYXRhLnRpY2tlci5zeW1ib2wgfHwgY3BCb290c3RyYXAuZW1wdHlEYXRhKSArICc8L3NwYW4+JyArXG4gICAgICAnPC9hPjwvaDM+JyArXG4gICAgICAnPHN0cm9uZz4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInByaWNlVGlja2VyIHBhcnNlTnVtYmVyXCI+JyArIChjcEJvb3RzdHJhcC5wYXJzZU51bWJlcihkYXRhLnRpY2tlci5wcmljZSkgfHwgY3BCb290c3RyYXAuZW1wdHlEYXRhKSArICc8L3NwYW4+ICcgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwicHJpbWFyeUN1cnJlbmN5XCI+JyArIGRhdGEucHJpbWFyeV9jdXJyZW5jeSArICcgPC9zcGFuPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwicHJpY2VfY2hhbmdlXzI0aFRpY2tlciBjcC13aWRnZXRfX3JhbmsgY3Atd2lkZ2V0X19yYW5rLScgKyAoKGRhdGEudGlja2VyLnByaWNlX2NoYW5nZV8yNGggPiAwKSA/IFwidXBcIiA6ICgoZGF0YS50aWNrZXIucHJpY2VfY2hhbmdlXzI0aCA8IDApID8gXCJkb3duXCIgOiBcIm5ldXRyYWxcIikpICsgJ1wiPignICsgKGNwQm9vdHN0cmFwLnJvdW5kKGRhdGEudGlja2VyLnByaWNlX2NoYW5nZV8yNGgsIDIpIHx8IGNwQm9vdHN0cmFwLmVtcHR5VmFsdWUpICsgJyUpPC9zcGFuPicgK1xuICAgICAgJzwvc3Ryb25nPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0X19yYW5rLWxhYmVsXCI+PHNwYW4gY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9yYW5rXCI+JyArIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwicmFua1wiKSArICc8L3NwYW4+IDxzcGFuIGNsYXNzPVwicmFua1RpY2tlclwiPicgKyAoZGF0YS50aWNrZXIucmFuayB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGEpICsgJzwvc3Bhbj48L3NwYW4+JztcbiAgfVxuXG4gIHdpZGdldE1haW5FbGVtZW50TWVzc2FnZShpbmRleCkge1xuICAgIGxldCBtZXNzYWdlID0gdGhpcy5zdGF0ZXNbaW5kZXhdLm1lc3NhZ2U7XG4gICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19tYWluLW5vLWRhdGEgY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fbWVzc2FnZVwiPicgKyAodGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgbWVzc2FnZSkpICsgJzwvZGl2Pic7XG4gIH1cblxuICB3aWRnZXRNYXJrZXREZXRhaWxzRWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKHRoaXMuc3RhdGVzW2luZGV4XS5tb2R1bGVzLmluZGV4T2YoJ21hcmtldF9kZXRhaWxzJykgPiAtMSkgPyAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9fZGV0YWlsc1wiPicgK1xuICAgICAgdGhpcy53aWRnZXRBdGhFbGVtZW50KGluZGV4KSArXG4gICAgICB0aGlzLndpZGdldFZvbHVtZTI0aEVsZW1lbnQoaW5kZXgpICtcbiAgICAgIHRoaXMud2lkZ2V0TWFya2V0Q2FwRWxlbWVudChpbmRleCkgK1xuICAgICAgJzwvZGl2PicgOiAnJyk7XG4gIH1cblxuICB3aWRnZXRBdGhFbGVtZW50KGluZGV4KSB7XG4gICAgcmV0dXJuICc8ZGl2PicgK1xuICAgICAgJzxzbWFsbCBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX2F0aFwiPicgKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcImF0aFwiKSArICc8L3NtYWxsPicgK1xuICAgICAgJzxkaXY+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJwcmljZV9hdGhUaWNrZXIgcGFyc2VOdW1iZXJcIj4nICsgY3BCb290c3RyYXAuZW1wdHlEYXRhICsgJyA8L3NwYW4+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzeW1ib2xUaWNrZXIgc2hvd0RldGFpbHNDdXJyZW5jeVwiPjwvc3Bhbj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInBlcmNlbnRfZnJvbV9wcmljZV9hdGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rXCI+JyArIGNwQm9vdHN0cmFwLmVtcHR5RGF0YSArICc8L3NwYW4+JyArXG4gICAgICAnPC9kaXY+J1xuICB9XG5cbiAgd2lkZ2V0Vm9sdW1lMjRoRWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiAnPGRpdj4nICtcbiAgICAgICc8c21hbGwgY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl92b2x1bWVfMjRoXCI+JyArIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwidm9sdW1lXzI0aFwiKSArICc8L3NtYWxsPicgK1xuICAgICAgJzxkaXY+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJ2b2x1bWVfMjRoVGlja2VyIHBhcnNlTnVtYmVyXCI+JyArIGNwQm9vdHN0cmFwLmVtcHR5RGF0YSArICcgPC9zcGFuPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwic3ltYm9sVGlja2VyIHNob3dEZXRhaWxzQ3VycmVuY3lcIj48L3NwYW4+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJ2b2x1bWVfMjRoX2NoYW5nZV8yNGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rXCI+JyArIGNwQm9vdHN0cmFwLmVtcHR5RGF0YSArICc8L3NwYW4+JyArXG4gICAgICAnPC9kaXY+JztcbiAgfVxuXG4gIHdpZGdldE1hcmtldENhcEVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAnPHNtYWxsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fbWFya2V0X2NhcFwiPicgKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcIm1hcmtldF9jYXBcIikgKyAnPC9zbWFsbD4nICtcbiAgICAgICc8ZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwibWFya2V0X2NhcFRpY2tlciBwYXJzZU51bWJlclwiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlciBzaG93RGV0YWlsc0N1cnJlbmN5XCI+PC9zcGFuPicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwibWFya2V0X2NhcF9jaGFuZ2VfMjRoVGlja2VyIGNwLXdpZGdldF9fcmFua1wiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnPC9zcGFuPicgK1xuICAgICAgJzwvZGl2Pic7XG4gIH1cblxuICB3aWRnZXRDaGFydEVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFxuICAgICAgYDxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX2NoYXJ0XCI+PGRpdiBpZD1cIiR7IHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lIH0tcHJpY2UtY2hhcnQtJHsgaW5kZXggfVwiPjwvZGl2PjwvZGl2PmBcbiAgICApO1xuICB9XG5cbiAgd2lkZ2V0U2VsZWN0RWxlbWVudChpbmRleCwgbGFiZWwpe1xuICAgIGxldCBidXR0b25zID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnN0YXRlc1tpbmRleF1bbGFiZWwrJ19saXN0J10ubGVuZ3RoOyBpKyspe1xuICAgICAgbGV0IGRhdGEgPSB0aGlzLnN0YXRlc1tpbmRleF1bbGFiZWwrJ19saXN0J11baV07XG4gICAgICBidXR0b25zICs9ICc8YnV0dG9uIGNsYXNzPVwiJysgKChkYXRhLnRvTG93ZXJDYXNlKCkgPT09IHRoaXMuc3RhdGVzW2luZGV4XVtsYWJlbF0udG9Mb3dlckNhc2UoKSlcbiAgICAgICAgPyAnY3Atd2lkZ2V0LWFjdGl2ZSAnXG4gICAgICAgIDogJycpICsgKChsYWJlbCA9PT0gJ3ByaW1hcnlfY3VycmVuY3knKSA/ICcnIDogJ2NwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uXycgKyBkYXRhLnRvTG93ZXJDYXNlKCkpICsnXCIgZGF0YS1vcHRpb249XCInK2RhdGErJ1wiPicrdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgZGF0YS50b0xvd2VyQ2FzZSgpKSsnPC9idXR0b24+J1xuICAgIH1cbiAgICBpZiAobGFiZWwgPT09ICdyYW5nZScpIDtcbiAgICBsZXQgdGl0bGUgPSB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInpvb21faW5cIik7XG4gICAgcmV0dXJuICc8ZGl2IGRhdGEtdHlwZT1cIicrbGFiZWwrJ1wiIGNsYXNzPVwiY3Atd2lkZ2V0LXNlbGVjdFwiPicgK1xuICAgICAgJzxsYWJlbCBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uXycrIGxhYmVsICsnXCI+Jyt0aXRsZSsnPC9sYWJlbD4nICtcbiAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0LXNlbGVjdF9fb3B0aW9uc1wiPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwiYXJyb3ctZG93biAnKyAnY3Atd2lkZ2V0X19jYXBpdGFsaXplIGNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uXycgKyB0aGlzLnN0YXRlc1tpbmRleF1bbGFiZWxdLnRvTG93ZXJDYXNlKCkgKydcIj4nKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCB0aGlzLnN0YXRlc1tpbmRleF1bbGFiZWxdLnRvTG93ZXJDYXNlKCkpICsnPC9zcGFuPicgK1xuICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtc2VsZWN0X19kcm9wZG93blwiPicgK1xuICAgICAgYnV0dG9ucyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+JztcbiAgfVxuXG4gIHdpZGdldEZvb3RlcihpbmRleCkge1xuICAgIGxldCBjdXJyZW5jeSA9IHRoaXMuc3RhdGVzW2luZGV4XS5jdXJyZW5jeTtcbiAgICByZXR1cm4gKCF0aGlzLnN0YXRlc1tpbmRleF0uaXNXb3JkcHJlc3MpXG4gICAgICA/ICc8cCBjbGFzcz1cImNwLXdpZGdldF9fZm9vdGVyIGNwLXdpZGdldF9fZm9vdGVyLS0nICsgaW5kZXggKyAnXCI+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9wb3dlcmVkX2J5XCI+JyArIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwicG93ZXJlZF9ieVwiKSArICcgPC9zcGFuPicgK1xuICAgICAgJzxpbWcgc3R5bGU9XCJ3aWR0aDogMTZweFwiIHNyYz1cIicgKyB0aGlzLm1haW5fbG9nb19saW5rKCkgKyAnXCIgYWx0PVwiXCIvPicgK1xuICAgICAgJzxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCInICsgdGhpcy5jb2luX2xpbmsoY3VycmVuY3kpICsgJ1wiPmNvaW5wYXByaWthLmNvbTwvYT4nICtcbiAgICAgICc8L3A+J1xuICAgICAgOiAnJztcbiAgfVxuXG4gIGdldEltYWdlKGluZGV4KSB7XG4gICAgbGV0IGRhdGEgPSB0aGlzLnN0YXRlc1tpbmRleF07XG4gICAgbGV0IGltZ0NvbnRhaW5lcnMgPSBkYXRhLm1haW5FbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NwLXdpZGdldF9faW1nJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbWdDb250YWluZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgaW1nQ29udGFpbmVyID0gaW1nQ29udGFpbmVyc1tpXTtcbiAgICAgIGltZ0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjcC13aWRnZXRfX2ltZy0taGlkZGVuJyk7XG4gICAgICBsZXQgaW1nID0gaW1nQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpO1xuICAgICAgbGV0IG5ld0ltZyA9IG5ldyBJbWFnZTtcbiAgICAgIG5ld0ltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIGltZy5zcmMgPSBuZXdJbWcuc3JjO1xuICAgICAgICBpbWdDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19pbWctLWhpZGRlbicpO1xuICAgICAgfTtcbiAgICAgIG5ld0ltZy5zcmMgPSB0aGlzLmltZ19zcmMoZGF0YS5jdXJyZW5jeSk7XG4gICAgfVxuICB9XG5cbiAgaW1nX3NyYyhpZCkge1xuICAgIHJldHVybiAnaHR0cHM6Ly9jb2lucGFwcmlrYS5jb20vY29pbi8nICsgaWQgKyAnL2xvZ28ucG5nJztcbiAgfVxuXG4gIGNvaW5fbGluayhpZCkge1xuICAgIHJldHVybiAnaHR0cHM6Ly9jb2lucGFwcmlrYS5jb20vY29pbi8nICsgaWRcbiAgfVxuXG4gIG1haW5fbG9nb19saW5rKCkge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRzLmltZ19zcmMgfHwgdGhpcy5kZWZhdWx0cy5vcmlnaW5fc3JjICsgJy9kaXN0L2ltZy9sb2dvX3dpZGdldC5zdmcnXG4gIH1cblxuICBnZXRTY3JpcHRFbGVtZW50KCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzY3JpcHRbZGF0YS1jcC1jdXJyZW5jeS13aWRnZXRdJyk7XG4gIH1cblxuICBnZXRUcmFuc2xhdGlvbihpbmRleCwgbGFiZWwpIHtcbiAgICBsZXQgdGV4dCA9ICh0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1t0aGlzLnN0YXRlc1tpbmRleF0ubGFuZ3VhZ2VdKSA/IHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW3RoaXMuc3RhdGVzW2luZGV4XS5sYW5ndWFnZV1bbGFiZWxdIDogbnVsbDtcbiAgICBpZiAoIXRleHQgJiYgdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbJ2VuJ10pIHtcbiAgICAgIHRleHQgPSB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1snZW4nXVtsYWJlbF07XG4gICAgfVxuICAgIGlmICghdGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMuYWRkTGFiZWxXaXRob3V0VHJhbnNsYXRpb24oaW5kZXgsIGxhYmVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9XG5cbiAgYWRkTGFiZWxXaXRob3V0VHJhbnNsYXRpb24oaW5kZXgsIGxhYmVsKSB7XG4gICAgaWYgKCF0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1snZW4nXSkgdGhpcy5nZXRUcmFuc2xhdGlvbnMoJ2VuJyk7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGVzW2luZGV4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLnB1c2gobGFiZWwpO1xuICB9XG5cbiAgZ2V0VHJhbnNsYXRpb25zKGxhbmcpIHtcbiAgICBpZiAoIXRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddKSB7XG4gICAgICBjb25zdCB1cmwgPSB0aGlzLmRlZmF1bHRzLmxhbmdfc3JjIHx8IHRoaXMuZGVmYXVsdHMub3JpZ2luX3NyYyArICcvZGlzdC9sYW5nLycgKyBsYW5nICsgJy5qc29uJztcbiAgICAgIHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddID0ge307XG4gICAgICByZXR1cm4gZmV0Y2hTZXJ2aWNlLmZldGNoSnNvbkZpbGUodXJsLCB0cnVlKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVdpZGdldFRyYW5zbGF0aW9ucyhsYW5nLCByZXNwb25zZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5vbkVycm9yUmVxdWVzdCgwLCB1cmwgKyByZXNwb25zZSk7XG4gICAgICAgICAgdGhpcy5nZXRUcmFuc2xhdGlvbnMoJ2VuJyk7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBjaGFydENsYXNzIHtcbiAgY29uc3RydWN0b3IoY29udGFpbmVyLCBzdGF0ZSl7XG4gICAgaWYgKCFjb250YWluZXIpIHJldHVybjtcbiAgICB0aGlzLmlkID0gY29udGFpbmVyLmlkO1xuICAgIHRoaXMuaXNOaWdodE1vZGUgPSBzdGF0ZS5pc05pZ2h0TW9kZTtcbiAgICB0aGlzLmNoYXJ0c1dpdGhBY3RpdmVTZXJpZXNDb29raWVzID0gW107XG4gICAgdGhpcy5jaGFydCA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW5jeSA9IHN0YXRlLmN1cnJlbmN5O1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucygpO1xuICAgIHRoaXMuZGVmYXVsdFJhbmdlID0gc3RhdGUucmFuZ2UgfHwgJzdkJztcbiAgICB0aGlzLmN1c3RvbURhdGUgPSBzdGF0ZS5jdXN0b21EYXRlIHx8IGZhbHNlO1xuICAgIHRoaXMuc3RhcnREYXRlID0gc3RhdGUuc3RhcnREYXRlIHx8IGZhbHNlO1xuICAgIHRoaXMuZW5kRGF0ZSA9IHN0YXRlLmVuZERhdGUgfHwgZmFsc2U7XG4gICAgdGhpcy5jYWxsYmFjayA9IG51bGw7XG4gICAgdGhpcy5yZXBsYWNlQ2FsbGJhY2sgPSBudWxsO1xuICAgIHRoaXMuZXh0cmVtZXNEYXRhVXJsID0gdGhpcy5nZXRFeHRyZW1lc0RhdGFVcmwoY29udGFpbmVyLmlkKTtcbiAgICB0aGlzLmRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgY2hhcnQ6IHtcbiAgICAgICAgYWxpZ25UaWNrczogZmFsc2UsXG4gICAgICAgIG1hcmdpblRvcDogNTAsXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgZm9udEZhbWlseTogJ3NhbnMtc2VyaWYnLFxuICAgICAgICB9LFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICByZW5kZXI6IChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZS50YXJnZXQuYW5ub3RhdGlvbnMpIHtcbiAgICAgICAgICAgICAgbGV0IGNoYXJ0ID0gZS50YXJnZXQuYW5ub3RhdGlvbnMuY2hhcnQ7XG4gICAgICAgICAgICAgIGNwQm9vdHN0cmFwLmxvb3AoY2hhcnQuYW5ub3RhdGlvbnMuYWxsSXRlbXMsIGFubm90YXRpb24gPT4ge1xuICAgICAgICAgICAgICAgIGxldCB5ID0gY2hhcnQucGxvdEhlaWdodCArIGNoYXJ0LnBsb3RUb3AgLSBjaGFydC5zcGFjaW5nWzBdIC0gMiAtICgodGhpcy5pc1Jlc3BvbnNpdmVNb2RlQWN0aXZlKGNoYXJ0KSkgPyAxMCA6IDApO1xuICAgICAgICAgICAgICAgIGFubm90YXRpb24udXBkYXRlKHt5fSwgdHJ1ZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgc2Nyb2xsYmFyOiB7XG4gICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIGFubm90YXRpb25zT3B0aW9uczoge1xuICAgICAgICBlbmFibGVkQnV0dG9uczogZmFsc2UsXG4gICAgICB9LFxuICAgICAgcmFuZ2VTZWxlY3Rvcjoge1xuICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICBwbG90T3B0aW9uczoge1xuICAgICAgICBsaW5lOiB7XG4gICAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgICBzdGF0ZXM6IHtcbiAgICAgICAgICAgICAgaG92ZXI6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICBsZWdlbmRJdGVtQ2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXZlbnQuYnJvd3NlckV2ZW50LmlzVHJ1c3RlZCl7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRzV2l0aEFjdGl2ZVNlcmllc0Nvb2tpZXMuaW5kZXhPZihldmVudC50YXJnZXQuY2hhcnQucmVuZGVyVG8uaWQpID4gLTEpIHRoaXMuc2V0VmlzaWJsZUNoYXJ0Q29va2llcyhldmVudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gT24gaU9TIHRvdWNoIGV2ZW50IGZpcmVzIHNlY29uZCBjYWxsYmFjayBmcm9tIEpTIChpc1RydXN0ZWQ6IGZhbHNlKSB3aGljaFxuICAgICAgICAgICAgICAvLyByZXN1bHRzIHdpdGggdG9nZ2xlIGJhY2sgdGhlIGNoYXJ0IChwcm9iYWJseSBpdHMgYSBwcm9ibGVtIHdpdGggVUlLaXQsIGJ1dCBub3Qgc3VyZSlcbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2xlZ2VuZEl0ZW1DbGljaycsIHtldmVudCwgaXNUcnVzdGVkOiBldmVudC5icm93c2VyRXZlbnQuaXNUcnVzdGVkfSk7XG4gICAgICAgICAgICAgIHJldHVybiBldmVudC5icm93c2VyRXZlbnQuaXNUcnVzdGVkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgeEF4aXM6IHtcbiAgICAgICAgb3JkaW5hbDogZmFsc2VcbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMuY2hhcnREYXRhUGFyc2VyID0gKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBkYXRhID0gZGF0YVswXTtcbiAgICAgICAgY29uc3QgcHJpY2VDdXJyZW5jeSA9IHN0YXRlLnByaW1hcnlfY3VycmVuY3kudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoe1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHByaWNlOiAoZGF0YS5wcmljZSlcbiAgICAgICAgICAgICAgPyBkYXRhLnByaWNlXG4gICAgICAgICAgICAgIDogKChkYXRhW3ByaWNlQ3VycmVuY3ldKVxuICAgICAgICAgICAgICAgID8gZGF0YVtwcmljZUN1cnJlbmN5XVxuICAgICAgICAgICAgICAgIDogW10pLFxuICAgICAgICAgICAgdm9sdW1lOiBkYXRhLnZvbHVtZSB8fCBbXSxcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB0aGlzLmlzRXZlbnRzSGlkZGVuID0gZmFsc2U7XG4gICAgdGhpcy5leGNsdWRlU2VyaWVzSWRzID0gW107XG4gICAgdGhpcy5hc3luY1VybCA9IGAvY3VycmVuY3kvZGF0YS8keyBzdGF0ZS5jdXJyZW5jeSB9L19yYW5nZV8vYDtcbiAgICB0aGlzLmFzeW5jUGFyYW1zID0gYD9xdW90ZT0keyBzdGF0ZS5wcmltYXJ5X2N1cnJlbmN5LnRvVXBwZXJDYXNlKCkgfSZmaWVsZHM9cHJpY2Usdm9sdW1lYDtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIHNldE9wdGlvbnMoKXtcbiAgICBjb25zdCBjaGFydFNlcnZpY2UgPSBuZXcgY2hhcnRDbGFzcygpO1xuICAgIHJldHVybiB7XG4gICAgICByZXNwb25zaXZlOiB7XG4gICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgIG1heFdpZHRoOiAxNTAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoYXJ0T3B0aW9uczoge1xuICAgICAgICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgICAgICBhbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJyxcbiAgICAgICAgICAgICAgICB5OiA5MixcbiAgICAgICAgICAgICAgICBzeW1ib2xSYWRpdXM6IDAsXG4gICAgICAgICAgICAgICAgaXRlbURpc3RhbmNlOiAyMCxcbiAgICAgICAgICAgICAgICBpdGVtU3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDQwMCxcbiAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IDM1LFxuICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogMCxcbiAgICAgICAgICAgICAgICBzcGFjaW5nVG9wOiAwLFxuICAgICAgICAgICAgICAgIHNwYWNpbmdCb3R0b206IDAsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG5hdmlnYXRvcjoge1xuICAgICAgICAgICAgICAgIGhlaWdodDogNTAsXG4gICAgICAgICAgICAgICAgbWFyZ2luOiA3MCxcbiAgICAgICAgICAgICAgICBoYW5kbGVzOiB7XG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6IDI1LFxuICAgICAgICAgICAgICAgICAgd2lkdGg6IDE3LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgIG1heFdpZHRoOiA2MDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hhcnRPcHRpb25zOiB7XG4gICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgbWFyZ2luVG9wOiAwLFxuICAgICAgICAgICAgICAgIHpvb21UeXBlOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICBtYXJnaW5MZWZ0OiAxMCxcbiAgICAgICAgICAgICAgICBtYXJnaW5SaWdodDogMTAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzNTAsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHlBeGlzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgZmxvb3I6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrQW1vdW50OiA3LFxuICAgICAgICAgICAgICAgICAgdGlja1dpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0xlbmd0aDogMCxcbiAgICAgICAgICAgICAgICAgIGxpbmVXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgICAgICAgICAgIGFsaWduOiBcImxlZnRcIixcbiAgICAgICAgICAgICAgICAgICAgeDogMSxcbiAgICAgICAgICAgICAgICAgICAgeTogLTIsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjOWU5ZTllJyxcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzlweCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tBbW91bnQ6IDcsXG4gICAgICAgICAgICAgICAgICB0aWNrV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrTGVuZ3RoOiAwLFxuICAgICAgICAgICAgICAgICAgbGluZVdpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgYWxpZ246IFwicmlnaHRcIixcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IFwianVzdGlmeVwiLFxuICAgICAgICAgICAgICAgICAgICB4OiAxLFxuICAgICAgICAgICAgICAgICAgICB5OiAtMixcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM1MDg1ZWMnLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnOXB4JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbmRpdGlvbjoge1xuICAgICAgICAgICAgICBtYXhXaWR0aDogNDUwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hhcnRPcHRpb25zOiB7XG4gICAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgIGFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuICAgICAgICAgICAgICAgIHk6IDgyLFxuICAgICAgICAgICAgICAgIHN5bWJvbFJhZGl1czogMCxcbiAgICAgICAgICAgICAgICBpdGVtRGlzdGFuY2U6IDIwLFxuICAgICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBuYXZpZ2F0b3I6IHtcbiAgICAgICAgICAgICAgICBtYXJnaW46IDYwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogNDAsXG4gICAgICAgICAgICAgICAgaGFuZGxlczoge1xuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMDAsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHlBeGlzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgZmxvb3I6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrQW1vdW50OiA3LFxuICAgICAgICAgICAgICAgICAgdGlja1dpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0xlbmd0aDogMCxcbiAgICAgICAgICAgICAgICAgIGxpbmVXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgICAgICAgICAgIGFsaWduOiBcImxlZnRcIixcbiAgICAgICAgICAgICAgICAgICAgeDogMSxcbiAgICAgICAgICAgICAgICAgICAgeTogLTIsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjOWU5ZTllJyxcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzlweCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tBbW91bnQ6IDcsXG4gICAgICAgICAgICAgICAgICB0aWNrV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrTGVuZ3RoOiAwLFxuICAgICAgICAgICAgICAgICAgbGluZVdpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgYWxpZ246IFwicmlnaHRcIixcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IFwianVzdGlmeVwiLFxuICAgICAgICAgICAgICAgICAgICB4OiAxLFxuICAgICAgICAgICAgICAgICAgICB5OiAtMixcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM1MDg1ZWMnLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnOXB4JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB0aXRsZToge1xuICAgICAgICB0ZXh0OiB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgICAgY2hhcnQ6IHtcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnbm9uZScsXG4gICAgICAgIG1hcmdpblRvcDogNTAsXG4gICAgICAgIHBsb3RCb3JkZXJXaWR0aDogMCxcbiAgICAgIH0sXG4gICAgICBjcEV2ZW50czogZmFsc2UsXG4gICAgICBjb2xvcnM6IFtcbiAgICAgICAgJyM1MDg1ZWMnLFxuICAgICAgICAnIzFmOTgwOScsXG4gICAgICAgICcjOTg1ZDY1JyxcbiAgICAgICAgJyNlZTk4M2InLFxuICAgICAgICAnIzRjNGM0YycsXG4gICAgICBdLFxuICAgICAgbGVnZW5kOiB7XG4gICAgICAgIG1hcmdpbjogMCxcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgYWxpZ246ICdyaWdodCcsXG4gICAgICAgIHN5bWJvbFJhZGl1czogMCxcbiAgICAgICAgaXRlbURpc3RhbmNlOiA0MCxcbiAgICAgICAgaXRlbVN0eWxlOiB7XG4gICAgICAgICAgZm9udFdlaWdodDogJ25vcm1hbCcsXG4gICAgICAgICAgY29sb3I6ICh0aGlzLmlzTmlnaHRNb2RlKSA/ICcjODBhNmU1JyA6ICcjMDY0NWFkJyxcbiAgICAgICAgfSxcbiAgICAgICAgaXRlbU1hcmdpblRvcDogOCxcbiAgICAgIH0sXG4gICAgICBuYXZpZ2F0b3I6IHRydWUsXG4gICAgICB0b29sdGlwOiB7XG4gICAgICAgIHNoYXJlZDogdHJ1ZSxcbiAgICAgICAgc3BsaXQ6IGZhbHNlLFxuICAgICAgICBhbmltYXRpb246IGZhbHNlLFxuICAgICAgICBib3JkZXJXaWR0aDogMSxcbiAgICAgICAgYm9yZGVyQ29sb3I6ICh0aGlzLmlzTmlnaHRNb2RlKSA/ICcjNGM0YzRjJyA6ICcjZTNlM2UzJyxcbiAgICAgICAgaGlkZURlbGF5OiAxMDAsXG4gICAgICAgIHNoYWRvdzogZmFsc2UsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIGNvbG9yOiAnIzRjNGM0YycsXG4gICAgICAgICAgZm9udFNpemU6ICcxMHB4JyxcbiAgICAgICAgfSxcbiAgICAgICAgdXNlSFRNTDogdHJ1ZSxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiBjaGFydFNlcnZpY2UudG9vbHRpcEZvcm1hdHRlcih0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG5cbiAgICAgIGV4cG9ydGluZzoge1xuICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgY29udGV4dEJ1dHRvbjoge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIHhBeGlzOiB7XG4gICAgICAgIGxpbmVDb2xvcjogKHRoaXMuaXNOaWdodE1vZGUpID8gJyM1MDUwNTAnIDogJyNlM2UzZTMnLFxuICAgICAgICB0aWNrQ29sb3I6ICh0aGlzLmlzTmlnaHRNb2RlKSA/ICcjNTA1MDUwJyA6ICcjZTNlM2UzJyxcbiAgICAgICAgdGlja0xlbmd0aDogNyxcbiAgICAgIH0sXG5cbiAgICAgIHlBeGlzOiBbeyAvLyBWb2x1bWUgeUF4aXNcbiAgICAgICAgbGluZVdpZHRoOiAxLFxuICAgICAgICBsaW5lQ29sb3I6ICcjZGVkZWRlJyxcbiAgICAgICAgdGlja1dpZHRoOiAxLFxuICAgICAgICB0aWNrTGVuZ3RoOiA0LFxuICAgICAgICBncmlkTGluZURhc2hTdHlsZTogJ2Rhc2gnLFxuICAgICAgICBncmlkTGluZVdpZHRoOiAwLFxuICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgbWluUGFkZGluZzogMCxcbiAgICAgICAgb3Bwb3NpdGU6IGZhbHNlLFxuICAgICAgICBzaG93RW1wdHk6IGZhbHNlLFxuICAgICAgICBzaG93TGFzdExhYmVsOiBmYWxzZSxcbiAgICAgICAgc2hvd0ZpcnN0TGFiZWw6IGZhbHNlLFxuICAgICAgfSwge1xuICAgICAgICBncmlkTGluZUNvbG9yOiAodGhpcy5pc05pZ2h0TW9kZSkgPyAnIzUwNTA1MCcgOiAnI2UzZTNlMycsXG4gICAgICAgIGdyaWRMaW5lRGFzaFN0eWxlOiAnZGFzaCcsXG4gICAgICAgIGxpbmVXaWR0aDogMSxcbiAgICAgICAgdGlja1dpZHRoOiAxLFxuICAgICAgICB0aWNrTGVuZ3RoOiA0LFxuICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgbWluUGFkZGluZzogMCxcbiAgICAgICAgc2hvd0VtcHR5OiBmYWxzZSxcbiAgICAgICAgb3Bwb3NpdGU6IHRydWUsXG4gICAgICAgIGdyaWRaSW5kZXg6IDQsXG4gICAgICAgIHNob3dMYXN0TGFiZWw6IGZhbHNlLFxuICAgICAgICBzaG93Rmlyc3RMYWJlbDogZmFsc2UsXG4gICAgICB9XSxcblxuICAgICAgc2VyaWVzOiBbXG4gICAgICAgIHsgLy9vcmRlciBvZiB0aGUgc2VyaWVzIG1hdHRlcnNcbiAgICAgICAgICBjb2xvcjogJyM1MDg1ZWMnLFxuICAgICAgICAgIG5hbWU6ICdQcmljZScsXG4gICAgICAgICAgaWQ6ICdwcmljZScsXG4gICAgICAgICAgZGF0YTogW10sXG4gICAgICAgICAgdHlwZTogJ2FyZWEnLFxuICAgICAgICAgIGZpbGxPcGFjaXR5OiAwLjE1LFxuICAgICAgICAgIGxpbmVXaWR0aDogMixcbiAgICAgICAgICB5QXhpczogMSxcbiAgICAgICAgICB6SW5kZXg6IDIsXG4gICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICBjbGlja2FibGU6IHRydWUsXG4gICAgICAgICAgdGhyZXNob2xkOiBudWxsLFxuICAgICAgICAgIHRvb2x0aXA6IHtcbiAgICAgICAgICAgIHZhbHVlRGVjaW1hbHM6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNob3dJbk5hdmlnYXRvcjogdHJ1ZSxcbiAgICAgICAgICBzaG93SW5MZWdlbmQ6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgY29sb3I6IGB1cmwoI2ZpbGwtcGF0dGVybiR7KHRoaXMuaXNOaWdodE1vZGUpID8gJy1uaWdodCcgOiAnJ30pYCxcbiAgICAgICAgICBuYW1lOiAnVm9sdW1lJyxcbiAgICAgICAgICBpZDogJ3ZvbHVtZScsXG4gICAgICAgICAgZGF0YTogW10sXG4gICAgICAgICAgdHlwZTogJ2FyZWEnLFxuICAgICAgICAgIGZpbGxPcGFjaXR5OiAwLjUsXG4gICAgICAgICAgbGluZVdpZHRoOiAwLFxuICAgICAgICAgIHlBeGlzOiAwLFxuICAgICAgICAgIHpJbmRleDogMCxcbiAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgIGNsaWNrYWJsZTogdHJ1ZSxcbiAgICAgICAgICB0aHJlc2hvbGQ6IG51bGwsXG4gICAgICAgICAgdG9vbHRpcDoge1xuICAgICAgICAgICAgdmFsdWVEZWNpbWFsczogMCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNob3dJbk5hdmlnYXRvcjogdHJ1ZSxcbiAgICAgICAgfV1cbiAgICB9XG4gIH1cblxuICBpbml0KCl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnBhcnNlT3B0aW9ucyh0aGlzLm9wdGlvbnMpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKG9wdGlvbnMpID0+IHtcbiAgICAgIHJldHVybiAod2luZG93LkhpZ2hjaGFydHMpID8gSGlnaGNoYXJ0cy5zdG9ja0NoYXJ0KHRoaXMuY29udGFpbmVyLmlkLCBvcHRpb25zLCAoY2hhcnQpID0+IHRoaXMuYmluZChjaGFydCkpIDogbnVsbDtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHBhcnNlT3B0aW9ucyhvcHRpb25zKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLnVwZGF0ZU9iamVjdCh0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChuZXdPcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAudXBkYXRlT2JqZWN0KHRoaXMuZ2V0Vm9sdW1lUGF0dGVybigpLCBuZXdPcHRpb25zKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChuZXdPcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zZXROYXZpZ2F0b3IobmV3T3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigobmV3T3B0aW9ucykgPT4ge1xuICAgICAgcmV0dXJuIChuZXdPcHRpb25zLm5vRGF0YSkgPyB0aGlzLnNldE5vRGF0YUxhYmVsKG5ld09wdGlvbnMpIDogbmV3T3B0aW9ucztcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChuZXdPcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gbmV3T3B0aW9ucztcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGJpbmQoY2hhcnQpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFydCA9IGNoYXJ0O1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY3VzdG9tRGF0ZSA/IHRoaXMuZmV0Y2hEYXRhUGFja2FnZSh0aGlzLnN0YXJ0RGF0ZSwgdGhpcy5lbmREYXRlLCB0cnVlKSA6IHRoaXMuZmV0Y2hEYXRhUGFja2FnZSgpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0UmFuZ2VTd2l0Y2hlcigpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuICh0aGlzLmNhbGxiYWNrKSA/IHRoaXMuY2FsbGJhY2sodGhpcy5jaGFydCwgdGhpcy5kZWZhdWx0UmFuZ2UpIDogbnVsbDtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGZldGNoRGF0YVBhY2thZ2UobWluRGF0ZSwgbWF4RGF0ZSwgaW5pdGlhbCA9IGZhbHNlKXtcbiAgICBsZXQgaXNQcmVjaXNlUmFuZ2UgPSAoISFtaW5EYXRlICYmICEhbWF4RGF0ZSk7XG4gICAgbGV0IHNob3dJbml0aWFsID0gaW5pdGlhbCA/IHRydWUgOiAhaXNQcmVjaXNlUmFuZ2U7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY3BFdmVudHMpe1xuICAgICAgICBsZXQgdXJsID0gKGlzUHJlY2lzZVJhbmdlKSA/IHRoaXMuZ2V0TmF2aWdhdG9yRXh0cmVtZXNVcmwobWluRGF0ZSwgbWF4RGF0ZSwgJ2V2ZW50cycpIDogdGhpcy5nZXRFeHRyZW1lc0RhdGFVcmwodGhpcy5pZCwgJ2V2ZW50cycpICsgJy8nICsgdGhpcy5nZXRSYW5nZSgpICsgJy8nO1xuICAgICAgICByZXR1cm4gKHVybCkgPyB0aGlzLmZldGNoRGF0YSh1cmwsICdldmVudHMnLCBzaG93SW5pdGlhbCkgOiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBsZXQgdXJsID0gKChpc1ByZWNpc2VSYW5nZSkgPyB0aGlzLmdldE5hdmlnYXRvckV4dHJlbWVzVXJsKG1pbkRhdGUsIG1heERhdGUpIDogdGhpcy5hc3luY1VybC5yZXBsYWNlKCdfcmFuZ2VfJywgdGhpcy5nZXRSYW5nZSgpKSkgKyB0aGlzLmFzeW5jUGFyYW1zO1xuICAgICAgcmV0dXJuICh1cmwpID8gdGhpcy5mZXRjaERhdGEodXJsLCAnZGF0YScsIHNob3dJbml0aWFsKSA6IG51bGw7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFydC5yZWRyYXcoZmFsc2UpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuICghaXNQcmVjaXNlUmFuZ2UpID8gdGhpcy5jaGFydC56b29tT3V0KCkgOiBudWxsO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaXNMb2FkZWQgPSB0cnVlO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMudG9nZ2xlRXZlbnRzKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBmZXRjaERhdGEodXJsLCBkYXRhVHlwZSA9ICdkYXRhJywgcmVwbGFjZSA9IHRydWUpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLmNoYXJ0LnNob3dMb2FkaW5nKCk7XG4gICAgICByZXR1cm4gZmV0Y2hTZXJ2aWNlLmZldGNoQ2hhcnREYXRhKHVybCwgIXRoaXMuaXNMb2FkZWQpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICB0aGlzLmNoYXJ0LmhpZGVMb2FkaW5nKCk7XG4gICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGBMb29rcyBsaWtlIHRoZXJlIHdhcyBhIHByb2JsZW0uIFN0YXR1cyBDb2RlOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihkYXRhID0+IHtcbiAgICAgICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVBhcnNlcihkYXRhLCBkYXRhVHlwZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChjb250ZW50KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChyZXBsYWNlKSA/IHRoaXMucmVwbGFjZURhdGEoY29udGVudC5kYXRhLCBkYXRhVHlwZSkgOiB0aGlzLnVwZGF0ZURhdGEoY29udGVudC5kYXRhLCBkYXRhVHlwZSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgdGhpcy5jaGFydC5oaWRlTG9hZGluZygpO1xuICAgICAgdGhpcy5oaWRlQ2hhcnQoKTtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygnRmV0Y2ggRXJyb3InLCBlcnJvcik7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBoaWRlQ2hhcnQoYm9vbCA9IHRydWUpe1xuICAgIGNvbnN0IGNsYXNzRnVuYyA9IChib29sKSA/ICdhZGQnIDogJ3JlbW92ZSc7XG4gICAgY29uc3Qgc2libGluZ3MgPSBjcEJvb3RzdHJhcC5ub2RlTGlzdFRvQXJyYXkodGhpcy5jb250YWluZXIucGFyZW50RWxlbWVudC5jaGlsZE5vZGVzKTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHNpYmxpbmdzLmZpbHRlcihlbGVtZW50ID0+IGVsZW1lbnQuaWQuc2VhcmNoKCdjaGFydCcpID09PSAtMSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChyZXN1bHQsIGVsZW1lbnQgPT4gZWxlbWVudC5jbGFzc0xpc3RbY2xhc3NGdW5jXSgnY3AtaGlkZGVuJykpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGFpbmVyLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0W2NsYXNzRnVuY10oJ2NwLWNoYXJ0LW5vLWRhdGEnKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHNldFJhbmdlU3dpdGNoZXIoKXtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGAkeyB0aGlzLmlkIH0tc3dpdGNoLXJhbmdlYCwgKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLmRlZmF1bHRSYW5nZSA9IGV2ZW50LmRldGFpbC5kYXRhO1xuICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hEYXRhUGFja2FnZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0UmFuZ2UoKXtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0UmFuZ2UgfHwgJzFxJztcbiAgfVxuXG4gIHRvZ2dsZUV2ZW50cygpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5jcEV2ZW50cyl7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2hpZ2hjaGFydHMtYW5ub3RhdGlvbicpO1xuICAgICAgfSk7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChlbGVtZW50cykgPT4ge1xuICAgICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChlbGVtZW50cywgZWxlbWVudCA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNFdmVudHNIaWRkZW4pe1xuICAgICAgICAgICAgcmV0dXJuICghZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZ2hjaGFydHMtYW5ub3RhdGlvbl9faGlkZGVuJykpID8gZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWdoY2hhcnRzLWFubm90YXRpb25fX2hpZGRlbicpIDogbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaGlnaGNoYXJ0cy1hbm5vdGF0aW9uX19oaWRkZW4nKSkgPyBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hjaGFydHMtYW5ub3RhdGlvbl9faGlkZGVuJykgOiBudWxsO1xuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2hpZ2hjaGFydHMtcGxvdC1saW5lJyk7XG4gICAgICB9KTtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGVsZW1lbnRzKSA9PiB7XG4gICAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKGVsZW1lbnRzLCBlbGVtZW50ID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5pc0V2ZW50c0hpZGRlbil7XG4gICAgICAgICAgICByZXR1cm4gKCFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaGlnaGNoYXJ0cy1wbG90LWxpbmVfX2hpZGRlbicpKSA/IGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlnaGNoYXJ0cy1wbG90LWxpbmVfX2hpZGRlbicpIDogbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaGlnaGNoYXJ0cy1wbG90LWxpbmVfX2hpZGRlbicpKSA/IGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGNoYXJ0cy1wbG90LWxpbmVfX2hpZGRlbicpIDogbnVsbDtcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGRhdGFQYXJzZXIoZGF0YSwgZGF0YVR5cGUgPSAnZGF0YScpe1xuICAgIHN3aXRjaCAoZGF0YVR5cGUpe1xuICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgIGxldCBwcm9taXNlRGF0YSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlRGF0YSA9IHByb21pc2VEYXRhLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiAodGhpcy5jaGFydERhdGFQYXJzZXIpID8gdGhpcy5jaGFydERhdGFQYXJzZXIoZGF0YSkgOiB7XG4gICAgICAgICAgICBkYXRhOiBkYXRhWzBdLFxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZURhdGE7XG4gICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGRhdGEpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlRGF0YShkYXRhLCBkYXRhVHlwZSkge1xuICAgIGxldCBuZXdEYXRhO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBzd2l0Y2ggKGRhdGFUeXBlKSB7XG4gICAgICAgIGNhc2UgJ2RhdGEnOlxuICAgICAgICAgIG5ld0RhdGEgPSB7fTtcbiAgICAgICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChPYmplY3QuZW50cmllcyhkYXRhKSwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0V4Y2x1ZGVkKHZhbHVlWzBdKSkgcmV0dXJuO1xuICAgICAgICAgICAgbGV0IG9sZERhdGEgPSB0aGlzLmdldE9sZERhdGEoZGF0YVR5cGUpW3ZhbHVlWzBdXTtcbiAgICAgICAgICAgIC8vIGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MICs9ICdvbGQ6JytgJHtvbGREYXRhfWBcbiAgICAgICAgICAgIC8vIGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MICs9ICduZXc6JytgJHtuZXdEYXRhW3ZhbHVlWzBdXX1gXG4gICAgICAgICAgICBuZXdEYXRhW3ZhbHVlWzBdXSA9IG9sZERhdGFcbiAgICAgICAgICAgICAgLmZpbHRlcigoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZVsxXS5maW5kSW5kZXgoZmluZEVsZW1lbnQgPT4gdGhpcy5pc1RoZVNhbWVFbGVtZW50KGVsZW1lbnQsIGZpbmRFbGVtZW50LCBkYXRhVHlwZSkpID09PSAtMTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmNvbmNhdCh2YWx1ZVsxXSlcbiAgICAgICAgICAgICAgLnNvcnQoKGRhdGExLCBkYXRhMikgPT4gdGhpcy5zb3J0Q29uZGl0aW9uKGRhdGExLCBkYXRhMiwgZGF0YVR5cGUpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgICBuZXdEYXRhID0gW107XG4gICAgICAgICAgbGV0IG9sZERhdGEgPSB0aGlzLmdldE9sZERhdGEoZGF0YVR5cGUpO1xuICAgICAgICAgIHJldHVybiBuZXdEYXRhID0gb2xkRGF0YVxuICAgICAgICAgICAgLmZpbHRlcigoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICBkYXRhLmZpbmRJbmRleChmaW5kRWxlbWVudCA9PiB0aGlzLmlzVGhlU2FtZUVsZW1lbnQoZWxlbWVudCwgZmluZEVsZW1lbnQsIGRhdGFUeXBlKSkgPT09IC0xO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jb25jYXQoZGF0YSlcbiAgICAgICAgICAgIC5zb3J0KChkYXRhMSwgZGF0YTIpID0+IHRoaXMuc29ydENvbmRpdGlvbihkYXRhMSwgZGF0YTIsIGRhdGFUeXBlKSk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZURhdGEobmV3RGF0YSwgZGF0YVR5cGUpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgaXNUaGVTYW1lRWxlbWVudChlbGVtZW50QSwgZWxlbWVudEIsIGRhdGFUeXBlKXtcbiAgICBzd2l0Y2ggKGRhdGFUeXBlKXtcbiAgICAgIGNhc2UgJ2RhdGEnOlxuICAgICAgICByZXR1cm4gZWxlbWVudEFbMF0gPT09IGVsZW1lbnRCWzBdO1xuICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRBLnRzID09PSBlbGVtZW50Qi50cztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBzb3J0Q29uZGl0aW9uKGVsZW1lbnRBLCBlbGVtZW50QiwgZGF0YVR5cGUpe1xuICAgIHN3aXRjaCAoZGF0YVR5cGUpe1xuICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgIHJldHVybiBlbGVtZW50QVswXSAtIGVsZW1lbnRCWzBdO1xuICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRBLnRzIC0gZWxlbWVudEIudHM7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZ2V0T2xkRGF0YShkYXRhVHlwZSl7XG4gICAgcmV0dXJuIHRoaXNbJ2NoYXJ0XycrZGF0YVR5cGUudG9Mb3dlckNhc2UoKV07XG4gIH1cblxuICByZXBsYWNlRGF0YShkYXRhLCBkYXRhVHlwZSl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzWydjaGFydF8nK2RhdGFUeXBlLnRvTG93ZXJDYXNlKCldID0gZGF0YTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VEYXRhVHlwZShkYXRhLCBkYXRhVHlwZSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gKHRoaXMucmVwbGFjZUNhbGxiYWNrKSA/IHRoaXMucmVwbGFjZUNhbGxiYWNrKHRoaXMuY2hhcnQsIGRhdGEsIHRoaXMuaXNMb2FkZWQsIGRhdGFUeXBlKSA6IG51bGw7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICByZXBsYWNlRGF0YVR5cGUoZGF0YSwgZGF0YVR5cGUpe1xuICAgIHN3aXRjaCAoZGF0YVR5cGUpe1xuICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgIGlmICh0aGlzLmFzeW5jVXJsKXtcbiAgICAgICAgICBjcEJvb3RzdHJhcC5sb29wKFsnYnRjLWJpdGNvaW4nLCAnZXRoLWV0aGVyZXVtJ10sIGNvaW5OYW1lID0+IHtcbiAgICAgICAgICAgIGxldCBjb2luU2hvcnQgPSBjb2luTmFtZS5zcGxpdCgnLScpWzBdO1xuICAgICAgICAgICAgaWYgKHRoaXMuYXN5bmNVcmwuc2VhcmNoKGNvaW5OYW1lKSA+IC0xICYmIGRhdGFbY29pblNob3J0XSkge1xuICAgICAgICAgICAgICBkYXRhW2NvaW5TaG9ydF0gPSBbXTtcbiAgICAgICAgICAgICAgY3BCb290c3RyYXAubG9vcCh0aGlzLmNoYXJ0LnNlcmllcywgc2VyaWVzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc2VyaWVzLnVzZXJPcHRpb25zLmlkID09PSBjb2luU2hvcnQpIHNlcmllcy51cGRhdGUoeyB2aXNpYmxlOiBmYWxzZSB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AoT2JqZWN0LmVudHJpZXMoZGF0YSksICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmlzRXhjbHVkZWQodmFsdWVbMF0pKSByZXR1cm47XG4gICAgICAgICAgcmV0dXJuICh0aGlzLmNoYXJ0LmdldCh2YWx1ZVswXSkpID8gdGhpcy5jaGFydC5nZXQodmFsdWVbMF0pLnNldERhdGEodmFsdWVbMV0sIGZhbHNlLCBmYWxzZSwgZmFsc2UpIDogdGhpcy5jaGFydC5hZGRTZXJpZXMoe2lkOiB2YWx1ZVswXSwgZGF0YTogdmFsdWVbMV0sIHNob3dJbk5hdmlnYXRvcjogdHJ1ZX0pO1xuICAgICAgICB9KTtcbiAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKHRoaXMuY2hhcnQuYW5ub3RhdGlvbnMuYWxsSXRlbXMsIGFubm90YXRpb24gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGFubm90YXRpb24uZGVzdHJveSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2V0QW5ub3RhdGlvbnNPYmplY3RzKGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBpc0V4Y2x1ZGVkKGxhYmVsKXtcbiAgICByZXR1cm4gdGhpcy5leGNsdWRlU2VyaWVzSWRzLmluZGV4T2YobGFiZWwpID4gLTE7XG4gIH1cblxuICB0b29sdGlwRm9ybWF0dGVyKHBvaW50ZXIsIGxhYmVsID0gJycsIHNlYXJjaCl7XG4gICAgaWYgKCFzZWFyY2gpIHNlYXJjaCA9IGxhYmVsO1xuICAgIGNvbnN0IGhlYWRlciA9ICc8ZGl2IGNsYXNzPVwiY3AtY2hhcnQtdG9vbHRpcC1jdXJyZW5jeVwiPjxzbWFsbD4nK25ldyBEYXRlKHBvaW50ZXIueCkudG9VVENTdHJpbmcoKSsnPC9zbWFsbD48dGFibGU+JztcbiAgICBjb25zdCBmb290ZXIgPSAnPC90YWJsZT48L2Rpdj4nO1xuICAgIGxldCBjb250ZW50ID0gJyc7XG4gICAgcG9pbnRlci5wb2ludHMuZm9yRWFjaChwb2ludCA9PiB7XG4gICAgICBjb250ZW50ICs9ICc8dHI+JyArXG4gICAgICAgICc8dGQgY2xhc3M9XCJjcC1jaGFydC10b29sdGlwLWN1cnJlbmN5X19yb3dcIj4nICtcbiAgICAgICAgJzxzdmcgY2xhc3M9XCJjcC1jaGFydC10b29sdGlwLWN1cnJlbmN5X19pY29uXCIgd2lkdGg9XCI1XCIgaGVpZ2h0PVwiNVwiPjxyZWN0IHg9XCIwXCIgeT1cIjBcIiB3aWR0aD1cIjVcIiBoZWlnaHQ9XCI1XCIgZmlsbD1cIicrcG9pbnQuc2VyaWVzLmNvbG9yKydcIiBmaWxsLW9wYWNpdHk9XCIxXCI+PC9yZWN0Pjwvc3ZnPicgK1xuICAgICAgICBwb2ludC5zZXJpZXMubmFtZSArICc6ICcgKyBwb2ludC55LnRvTG9jYWxlU3RyaW5nKCdydS1SVScsIHsgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiA4IH0pLnJlcGxhY2UoJywnLCAnLicpICsgJyAnICsgKChwb2ludC5zZXJpZXMubmFtZS50b0xvd2VyQ2FzZSgpLnNlYXJjaChzZWFyY2gudG9Mb3dlckNhc2UoKSkgPiAtMSkgPyBcIlwiIDogbGFiZWwpICtcbiAgICAgICAgJzwvdGQ+JyArXG4gICAgICAgICc8L3RyPic7XG4gICAgfSk7XG4gICAgcmV0dXJuIGhlYWRlciArIGNvbnRlbnQgKyBmb290ZXI7XG4gIH1cblxuICBzZXRBbm5vdGF0aW9uc09iamVjdHMoZGF0YSl7XG4gICAgdGhpcy5jaGFydC5zZXJpZXNbMF0ueEF4aXMucmVtb3ZlUGxvdExpbmUoKTtcbiAgICBsZXQgcGxvdExpbmVzID0gW107XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBkYXRhLnNvcnQoKGRhdGExLCBkYXRhMikgPT4ge1xuICAgICAgICByZXR1cm4gZGF0YTIudHMgLSBkYXRhMS50cztcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AoZGF0YSwgZWxlbWVudCA9PiB7XG4gICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBwbG90TGluZXMucHVzaCh7XG4gICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgIHZhbHVlOiBlbGVtZW50LnRzLFxuICAgICAgICAgICAgZGFzaFN0eWxlOiAnc29saWQnLFxuICAgICAgICAgICAgekluZGV4OiA0LFxuICAgICAgICAgICAgY29sb3I6IHRoaXMuZ2V0RXZlbnRUYWdQYXJhbXMoKS5jb2xvcixcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNoYXJ0LmFkZEFubm90YXRpb24oe1xuICAgICAgICAgICAgeFZhbHVlOiBlbGVtZW50LnRzLFxuICAgICAgICAgICAgeTogMCxcbiAgICAgICAgICAgIHRpdGxlOiBgPHNwYW4gdGl0bGU9XCJDbGljayB0byBvcGVuXCIgY2xhc3M9XCJjcC1jaGFydC1hbm5vdGF0aW9uX190ZXh0XCI+JHsgdGhpcy5nZXRFdmVudFRhZ1BhcmFtcyhlbGVtZW50LnRhZykubGFiZWwgfTwvc3Bhbj48c3BhbiBjbGFzcz1cImNwLWNoYXJ0LWFubm90YXRpb25fX2RhdGFFbGVtZW50XCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPiR7IEpTT04uc3RyaW5naWZ5KGVsZW1lbnQpIH08L3NwYW4+YCxcbiAgICAgICAgICAgIHNoYXBlOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdjaXJjbGUnLFxuICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICByOiAxMSxcbiAgICAgICAgICAgICAgICBjeDogOSxcbiAgICAgICAgICAgICAgICBjeTogMTAuNSxcbiAgICAgICAgICAgICAgICAnc3Ryb2tlLXdpZHRoJzogMS41LFxuICAgICAgICAgICAgICAgIGZpbGw6IHRoaXMuZ2V0RXZlbnRUYWdQYXJhbXMoKS5jb2xvcixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICAgbW91c2VvdmVyOiAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoTW9iaWxlRGV0ZWN0LmlzTW9iaWxlKCkpIHJldHVybjtcbiAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHRoaXMuZ2V0RXZlbnREYXRhRnJvbUFubm90YXRpb25FdmVudChldmVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuRXZlbnRDb250YWluZXIoZGF0YSwgZXZlbnQpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBtb3VzZW91dDogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChNb2JpbGVEZXRlY3QuaXNNb2JpbGUoKSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VFdmVudENvbnRhaW5lcihldmVudCk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNsaWNrOiAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHRoaXMuZ2V0RXZlbnREYXRhRnJvbUFubm90YXRpb25FdmVudChldmVudCk7XG4gICAgICAgICAgICAgICAgaWYgKE1vYmlsZURldGVjdC5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLm9wZW5FdmVudENvbnRhaW5lcihkYXRhLCBldmVudCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMub3BlbkV2ZW50UGFnZShkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFydC5zZXJpZXNbMF0ueEF4aXMudXBkYXRlKHtcbiAgICAgICAgcGxvdExpbmVzLFxuICAgICAgfSwgZmFsc2UpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgc2V0TmF2aWdhdG9yKG9wdGlvbnMpe1xuICAgIGxldCBuYXZpZ2F0b3JPcHRpb25zID0ge307XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGlmIChvcHRpb25zLm5hdmlnYXRvciA9PT0gdHJ1ZSl7XG4gICAgICAgIG5hdmlnYXRvck9wdGlvbnMgPSB7XG4gICAgICAgICAgbmF2aWdhdG9yOiB7XG4gICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICBtYXJnaW46IDIwLFxuICAgICAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgICAgIGxpbmVXaWR0aDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtYXNrRmlsbDogJ3JnYmEoMTAyLDEzMywxOTQsMC4xNSknLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgIHpvb21UeXBlOiAneCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgIHNldEV4dHJlbWVzOiAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICgoZS50cmlnZ2VyID09PSAnbmF2aWdhdG9yJyB8fCBlLnRyaWdnZXIgPT09ICd6b29tJykgJiYgZS5taW4gJiYgZS5tYXgpIHtcbiAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KHRoaXMuaWQrJ1NldEV4dHJlbWVzJywge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgICAgICAgICBtaW5EYXRlOiBlLm1pbixcbiAgICAgICAgICAgICAgICAgICAgICBtYXhEYXRlOiBlLm1heCxcbiAgICAgICAgICAgICAgICAgICAgICBlLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm5hdmlnYXRvckV4dHJlbWVzTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5zZXRSZXNldFpvb21CdXR0b24oKTtcbiAgICAgIH0gZWxzZSBpZiAoIW9wdGlvbnMubmF2aWdhdG9yKSB7XG4gICAgICAgIG5hdmlnYXRvck9wdGlvbnMgPSB7XG4gICAgICAgICAgbmF2aWdhdG9yOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLnVwZGF0ZU9iamVjdChvcHRpb25zLCBuYXZpZ2F0b3JPcHRpb25zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHNldFJlc2V0Wm9vbUJ1dHRvbigpe1xuICAgIC8vIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTsgLy8gY2FudCBiZSBwb3NpdGlvbmVkIHByb3Blcmx5IGluIHBsb3RCb3gsIHNvIGl0cyBkaXNhYmxlZFxuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hZGRDb250YWluZXIodGhpcy5pZCwgJ1Jlc2V0Wm9vbScsICdjcC1jaGFydC1yZXNldC16b29tJywgJ2J1dHRvbicpXG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRDb250YWluZXIoJ1Jlc2V0Wm9vbScpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGVsZW1lbnQpID0+IHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgndWstYnV0dG9uJyk7XG4gICAgICBlbGVtZW50LmlubmVyVGV4dCA9ICdSZXNldCB6b29tJztcbiAgICAgIHJldHVybiBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICB0aGlzLmNoYXJ0Lnpvb21PdXQoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgbmF2aWdhdG9yRXh0cmVtZXNMaXN0ZW5lcigpIHtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIodGhpcy5pZCArICdTZXRFeHRyZW1lcycsIChlKSA9PiB7XG4gICAgICAgIGxldCBtaW5EYXRlID0gY3BCb290c3RyYXAucm91bmQoZS5kZXRhaWwubWluRGF0ZSAvIDEwMDAsIDApO1xuICAgICAgICBsZXQgbWF4RGF0ZSA9IGNwQm9vdHN0cmFwLnJvdW5kKGUuZGV0YWlsLm1heERhdGUgLyAxMDAwLCAwKTtcbiAgICAgICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hEYXRhUGFja2FnZShtaW5EYXRlLCBtYXhEYXRlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBnZXROYXZpZ2F0b3JFeHRyZW1lc1VybChtaW5EYXRlLCBtYXhEYXRlLCBkYXRhVHlwZSl7XG4gICAgbGV0IGV4dHJlbWVzRGF0YVVybCA9IChkYXRhVHlwZSkgPyB0aGlzLmdldEV4dHJlbWVzRGF0YVVybCh0aGlzLmlkLCBkYXRhVHlwZSkgOiB0aGlzLmV4dHJlbWVzRGF0YVVybDtcbiAgICByZXR1cm4gKG1pbkRhdGUgJiYgbWF4RGF0ZSAmJiBleHRyZW1lc0RhdGFVcmwpID8gZXh0cmVtZXNEYXRhVXJsICsnL2RhdGVzLycrbWluRGF0ZSsnLycrbWF4RGF0ZSsnLycgOiBudWxsO1xuICB9XG5cbiAgc2V0Tm9EYXRhTGFiZWwob3B0aW9ucyl7XG4gICAgbGV0IG5vRGF0YU9wdGlvbnMgPSB7fTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgbm9EYXRhT3B0aW9ucyA9IHtcbiAgICAgICAgbGFuZzoge1xuICAgICAgICAgIG5vRGF0YTogJ1dlIGRvblxcJ3QgaGF2ZSBkYXRhIGZvciB0aGlzIHRpbWUgcGVyaW9kJ1xuICAgICAgICB9LFxuICAgICAgICBub0RhdGE6IHtcbiAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgZm9udEZhbWlseTogJ0FyaWFsJyxcbiAgICAgICAgICAgIGZvbnRTaXplOiAnMTRweCcsXG4gICAgICAgICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLnVwZGF0ZU9iamVjdChvcHRpb25zLCBub0RhdGFPcHRpb25zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGFkZENvbnRhaW5lcihpZCwgbGFiZWwsIGNsYXNzTmFtZSwgdGFnTmFtZSA9ICdkaXYnKXtcbiAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcbiAgICBsZXQgY2hhcnRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgY29udGFpbmVyLmlkID0gaWQgKyBsYWJlbDtcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgIGNoYXJ0Q29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gIH1cblxuICBnZXRDb250YWluZXIobGFiZWwpe1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkK2xhYmVsKTtcbiAgfVxuXG4gIGdldEV4dHJlbWVzRGF0YVVybChpZCwgZGF0YVR5cGUgPSAnZGF0YScpe1xuICAgIHJldHVybiAnL2N1cnJlbmN5LycrIGRhdGFUeXBlICsnLycrIHRoaXMuY3VycmVuY3k7XG4gIH1cblxuICBnZXRWb2x1bWVQYXR0ZXJuKCl7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlZnM6IHtcbiAgICAgICAgcGF0dGVybnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnaWQnOiAnZmlsbC1wYXR0ZXJuJyxcbiAgICAgICAgICAgICdwYXRoJzoge1xuICAgICAgICAgICAgICBkOiAnTSAzIDAgTCAzIDEwIE0gOCAwIEwgOCAxMCcsXG4gICAgICAgICAgICAgIHN0cm9rZTogXCIjZTNlM2UzXCIsXG4gICAgICAgICAgICAgIGZpbGw6ICcjZjFmMWYxJyxcbiAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IDIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ2lkJzogJ2ZpbGwtcGF0dGVybi1uaWdodCcsXG4gICAgICAgICAgICAncGF0aCc6IHtcbiAgICAgICAgICAgICAgZDogJ00gMyAwIEwgMyAxMCBNIDggMCBMIDggMTAnLFxuICAgICAgICAgICAgICBzdHJva2U6IFwiIzliOWI5YlwiLFxuICAgICAgICAgICAgICBmaWxsOiAnIzM4MzgzOCcsXG4gICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG5cbmNsYXNzIGJvb3RzdHJhcENsYXNzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbXB0eVZhbHVlID0gMDtcbiAgICB0aGlzLmVtcHR5RGF0YSA9ICctJztcbiAgfVxuXG4gIG5vZGVMaXN0VG9BcnJheShub2RlTGlzdCkge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChub2RlTGlzdCk7XG4gIH1cblxuICBwYXJzZUludGVydmFsVmFsdWUodmFsdWUpIHtcbiAgICBsZXQgdGltZVN5bWJvbCA9ICcnLCBtdWx0aXBsaWVyID0gMTtcbiAgICBpZiAodmFsdWUuc2VhcmNoKCdzJykgPiAtMSkge1xuICAgICAgdGltZVN5bWJvbCA9ICdzJztcbiAgICAgIG11bHRpcGxpZXIgPSAxMDAwO1xuICAgIH1cbiAgICBpZiAodmFsdWUuc2VhcmNoKCdtJykgPiAtMSkge1xuICAgICAgdGltZVN5bWJvbCA9ICdtJztcbiAgICAgIG11bHRpcGxpZXIgPSA2MCAqIDEwMDA7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5zZWFyY2goJ2gnKSA+IC0xKSB7XG4gICAgICB0aW1lU3ltYm9sID0gJ2gnO1xuICAgICAgbXVsdGlwbGllciA9IDYwICogNjAgKiAxMDAwO1xuICAgIH1cbiAgICBpZiAodmFsdWUuc2VhcmNoKCdkJykgPiAtMSkge1xuICAgICAgdGltZVN5bWJvbCA9ICdkJztcbiAgICAgIG11bHRpcGxpZXIgPSAyNCAqIDYwICogNjAgKiAxMDAwO1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZS5yZXBsYWNlKHRpbWVTeW1ib2wsICcnKSkgKiBtdWx0aXBsaWVyO1xuICB9XG5cbiAgaXNGaWF0KGN1cnJlbmN5LCBvcmlnaW4pe1xuICAgIGlmICghb3JpZ2luKSBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBsZXQgdXJsID0gb3JpZ2luICsgJy9kaXN0L2RhdGEvY3VycmVuY2llcy5qc29uJztcbiAgICAgIHJldHVybiBmZXRjaFNlcnZpY2UuZmV0Y2hKc29uRmlsZSh1cmwsIHRydWUpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgcmV0dXJuIChyZXN1bHRbY3VycmVuY3kudG9VcHBlckNhc2UoKV0pO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgdXBkYXRlT2JqZWN0KG9iaiwgbmV3T2JqKSB7XG4gICAgbGV0IHJlc3VsdCA9IG9iajtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AoT2JqZWN0LmtleXMobmV3T2JqKSwga2V5ID0+IHtcbiAgICAgICAgaWYgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHR5cGVvZiByZXN1bHRba2V5XSA9PT0gJ29iamVjdCcpe1xuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZU9iamVjdChyZXN1bHRba2V5XSwgbmV3T2JqW2tleV0pLnRoZW4oKHVwZGF0ZVJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB1cGRhdGVSZXN1bHQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdFtrZXldID0gbmV3T2JqW2tleV07XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHBhcnNlQ3VycmVuY3lOdW1iZXIodmFsdWUsIGN1cnJlbmN5LCBvcmlnaW4pe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5pc0ZpYXQoY3VycmVuY3ksIG9yaWdpbik7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICByZXR1cm4gKHJlc3VsdCkgPyB0aGlzLnBhcnNlTnVtYmVyKHZhbHVlLCAyKSA6IHRoaXMucGFyc2VOdW1iZXIodmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgcGFyc2VOdW1iZXIobnVtYmVyLCBwcmVjaXNpb24pIHtcbiAgICBpZiAoIW51bWJlciAmJiBudW1iZXIgIT09IDApIHJldHVybiBudW1iZXI7XG4gICAgaWYgKG51bWJlciA9PT0gdGhpcy5lbXB0eVZhbHVlIHx8IG51bWJlciA9PT0gdGhpcy5lbXB0eURhdGEpIHJldHVybiBudW1iZXI7XG4gICAgbnVtYmVyID0gcGFyc2VGbG9hdChudW1iZXIpO1xuICAgIGlmIChudW1iZXIgPiAxMDAwMDApIHtcbiAgICAgIGxldCBudW1iZXJTdHIgPSBudW1iZXIudG9GaXhlZCgwKTtcbiAgICAgIGxldCBwYXJhbWV0ZXIgPSAnSycsXG4gICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDEpO1xuICAgICAgaWYgKG51bWJlciA+IDEwMDAwMDAwMDApIHtcbiAgICAgICAgc3BsaWNlZCA9IG51bWJlclN0ci5zbGljZSgwLCBudW1iZXJTdHIubGVuZ3RoIC0gNyk7XG4gICAgICAgIHBhcmFtZXRlciA9ICdCJztcbiAgICAgIH0gZWxzZSBpZiAobnVtYmVyID4gMTAwMDAwMCkge1xuICAgICAgICBzcGxpY2VkID0gbnVtYmVyU3RyLnNsaWNlKDAsIG51bWJlclN0ci5sZW5ndGggLSA0KTtcbiAgICAgICAgcGFyYW1ldGVyID0gJ00nO1xuICAgICAgfVxuICAgICAgbGV0IG5hdHVyYWwgPSBzcGxpY2VkLnNsaWNlKDAsIHNwbGljZWQubGVuZ3RoIC0gMik7XG4gICAgICBsZXQgZGVjaW1hbCA9IHNwbGljZWQuc2xpY2Uoc3BsaWNlZC5sZW5ndGggLSAyKTtcbiAgICAgIHJldHVybiBuYXR1cmFsICsgJy4nICsgZGVjaW1hbCArICcgJyArIHBhcmFtZXRlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGlzRGVjaW1hbCA9IChudW1iZXIgJSAxKSA+IDA7XG4gICAgICBpZiAoaXNEZWNpbWFsKSB7XG4gICAgICAgIGlmICghcHJlY2lzaW9uIHx8IG51bWJlciA8IDAuMDEpe1xuICAgICAgICAgIHByZWNpc2lvbiA9IDI7XG4gICAgICAgICAgaWYgKG51bWJlciA8IDEpIHtcbiAgICAgICAgICAgIHByZWNpc2lvbiA9IDg7XG4gICAgICAgICAgfSBlbHNlIGlmIChudW1iZXIgPCAxMCkge1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gNjtcbiAgICAgICAgICB9IGVsc2UgaWYgKG51bWJlciA8IDEwMDApIHtcbiAgICAgICAgICAgIHByZWNpc2lvbiA9IDQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnJvdW5kKG51bWJlciwgcHJlY2lzaW9uKS50b0xvY2FsZVN0cmluZygncnUtUlUnLCB7IG1heGltdW1GcmFjdGlvbkRpZ2l0czogcHJlY2lzaW9uIH0pLnJlcGxhY2UoJywnLCAnLicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bWJlci50b0xvY2FsZVN0cmluZygncnUtUlUnLCB7IG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMiB9KS5yZXBsYWNlKCcsJywgJy4nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByb3VuZChhbW91bnQsIGRlY2ltYWwgPSA4LCBkaXJlY3Rpb24gPSAncm91bmQnKSB7XG4gICAgYW1vdW50ID0gcGFyc2VGbG9hdChhbW91bnQpO1xuICAgIGRlY2ltYWwgPSBNYXRoLnBvdygxMCwgZGVjaW1hbCk7XG4gICAgcmV0dXJuIE1hdGhbZGlyZWN0aW9uXShhbW91bnQgKiBkZWNpbWFsKSAvIGRlY2ltYWw7XG4gIH1cblxuICBsb29wKGFyciwgZm4sIGJ1c3ksIGVyciwgaSA9IDApIHtcbiAgICBjb25zdCBib2R5ID0gKG9rLCBlcikgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgciA9IGZuKGFycltpXSwgaSwgYXJyKTtcbiAgICAgICAgciAmJiByLnRoZW4gPyByLnRoZW4ob2spLmNhdGNoKGVyKSA6IG9rKHIpXG4gICAgICB9XG4gICAgICBjYXRjaCAoZSkge1xuICAgICAgICBlcihlKVxuICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgbmV4dCA9IChvaywgZXIpID0+ICgpID0+IHRoaXMubG9vcChhcnIsIGZuLCBvaywgZXIsICsraSk7XG4gICAgY29uc3QgcnVuID0gKG9rLCBlcikgPT4gaSA8IGFyci5sZW5ndGggPyBuZXcgUHJvbWlzZShib2R5KS50aGVuKG5leHQob2ssIGVyKSkuY2F0Y2goZXIpIDogb2soKTtcbiAgICByZXR1cm4gYnVzeSA/IHJ1bihidXN5LCBlcnIpIDogbmV3IFByb21pc2UocnVuKVxuICB9XG59XG5cbmNsYXNzIGZldGNoQ2xhc3Mge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMuc3RhdGUgPSB7fTtcbiAgfVxuXG4gIGZldGNoU2NyaXB0KHVybCkge1xuICAgIGlmICh0aGlzLnN0YXRlW3VybF0pIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG4gICAgdGhpcy5zdGF0ZVt1cmxdID0gJ3BlbmRpbmcnO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSkgdGhpcy5zdGF0ZVt1cmxdID0gJ2Rvd25sb2FkZWQnO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUpIGRlbGV0ZSB0aGlzLnN0YXRlW3VybF07XG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYEZhaWxlZCB0byBsb2FkIGltYWdlJ3MgVVJMOiAke3VybH1gKSk7XG4gICAgICB9KTtcbiAgICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XG4gICAgICBzY3JpcHQuc3JjID0gdXJsO1xuICAgIH0pO1xuICB9XG5cbiAgZmV0Y2hTdHlsZSh1cmwpIHtcbiAgICBpZiAodGhpcy5zdGF0ZVt1cmxdKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgIHRoaXMuc3RhdGVbdXJsXSA9ICdwZW5kaW5nJztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdyZWwnLCAnc3R5bGVzaGVldCcpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgdXJsKTtcbiAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUpIHRoaXMuc3RhdGVbdXJsXSA9ICdkb3dubG9hZGVkJztcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSkgZGVsZXRlIHRoaXMuc3RhdGVbdXJsXTtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgRmFpbGVkIHRvIGxvYWQgc3R5bGUgVVJMOiAke3VybH1gKSk7XG4gICAgICB9KTtcbiAgICAgIGxpbmsuaHJlZiA9IHVybDtcbiAgICB9KTtcbiAgfVxuXG4gIGZldGNoQ2hhcnREYXRhKHVyaSwgZnJvbVN0YXRlID0gZmFsc2Upe1xuICAgIGNvbnN0IHVybCA9IGBodHRwczovL2dyYXBoc3YyLmNvaW5wYXByaWthLmNvbSR7dXJpfWA7XG4gICAgcmV0dXJuIHRoaXMuZmV0Y2hEYXRhKHVybCwgZnJvbVN0YXRlKTtcbiAgfVxuXG4gIGZldGNoRGF0YSh1cmwsIGZyb21TdGF0ZSA9IGZhbHNlKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKGZyb21TdGF0ZSl7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlW3VybF0gPT09ICdwZW5kaW5nJyl7XG4gICAgICAgICAgbGV0IHByb21pc2VUaW1lb3V0ID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIHJlc29sdmUodGhpcy5mZXRjaERhdGEodXJsLCBmcm9tU3RhdGUpKTtcbiAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHByb21pc2VUaW1lb3V0O1xuICAgICAgICB9XG4gICAgICAgIGlmICghIXRoaXMuc3RhdGVbdXJsXSl7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLnN0YXRlW3VybF0uY2xvbmUoKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuc3RhdGVbdXJsXSA9ICdwZW5kaW5nJztcbiAgICAgIGxldCBwcm9taXNlRmV0Y2ggPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIHByb21pc2VGZXRjaCA9IHByb21pc2VGZXRjaC50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCk7XG4gICAgICB9KTtcbiAgICAgIHByb21pc2VGZXRjaCA9IHByb21pc2VGZXRjaC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICB0aGlzLnN0YXRlW3VybF0gPSByZXNwb25zZTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmNsb25lKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwcm9taXNlRmV0Y2g7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBmZXRjaEpzb25GaWxlKHVybCwgZnJvbVN0YXRlID0gZmFsc2Upe1xuICAgIHJldHVybiB0aGlzLmZldGNoRGF0YSh1cmwsIGZyb21TdGF0ZSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgaWYgKHJlc3VsdC5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0Lmpzb24oKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3Qgd2lkZ2V0cyA9IG5ldyB3aWRnZXRzQ29udHJvbGxlcigpO1xuY29uc3QgY3BCb290c3RyYXAgPSBuZXcgYm9vdHN0cmFwQ2xhc3MoKTtcbmNvbnN0IGZldGNoU2VydmljZSA9IG5ldyBmZXRjaENsYXNzKCk7XG4iXX0=
