(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var widgetsController = function () {
  function widgetsController() {
    _classCallCheck(this, widgetsController);

    this.widgets = new widgetsClass();
    this.bind();
  }

  _createClass(widgetsController, [{
    key: 'bind',
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
    key: 'initWidgets',
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

var widgetsClass = function () {
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
      origin_src: 'https://unpkg.com/@coinpaprika/widget-currency',
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
    key: 'init',
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
    key: 'setWidgetClass',
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
    key: 'getMainElement',
    value: function getMainElement(index) {
      return this.states[index] ? this.states[index].mainElement : null;
    }
  }, {
    key: 'getDefaults',
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
    key: 'setOriginLink',
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
    key: 'addWidgetElement',
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
          return label ? _this6['widget' + label + 'Element'](index).then(function (result) {
            return modules += result;
          }) : null;
        });
      });
      promise = promise.then(function () {
        return mainElement.innerHTML = _this6.widgetMainElement(index) + modules + _this6.widgetFooter(index);
      });
      promise = promise.then(function () {
        chartContainer = document.getElementById(_this6.defaults.className + '-price-chart-' + index);
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
    key: 'setSelectListeners',
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
    key: 'setSelectOption',
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
    key: 'dispatchEvent',
    value: function dispatchEvent(index, name, data) {
      var id = this.defaults.className + '-price-chart-' + index;
      return document.dispatchEvent(new CustomEvent('' + id + name, { detail: { data: data } }));
    }
  }, {
    key: 'getData',
    value: function getData(index) {
      var _this8 = this;

      var url = 'https://api.coinpaprika.com/v1/widget/' + this.states[index].currency + '?quote=' + this.states[index].primary_currency;
      return fetchService.fetchData(url).then(function (response) {
        return response.json().then(function (result) {
          if (!_this8.states[index].isData) _this8.updateData(index, 'isData', true);
          _this8.updateTicker(index, result);
        });
      }).catch(function (error) {
        return _this8.onErrorRequest(index, error);
      });
    }
  }, {
    key: 'onErrorRequest',
    value: function onErrorRequest(index, xhr) {
      if (this.states[index].isData) this.updateData(index, 'isData', false);
      this.updateData(index, 'message', 'data_unavailable');
      console.error('Request failed.  Returned status of ' + xhr, this.states[index]);
    }
  }, {
    key: 'initInterval',
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
    key: 'setBeforeElementInFooter',
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
    key: 'updateWidgetElement',
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

          var _loop = function _loop(j) {
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
            var _ret = _loop(j);

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
          }
        }
      }
    }
  }, {
    key: 'updateData',
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
    key: 'updateWidgetTranslations',
    value: function updateWidgetTranslations(lang, data) {
      var _this11 = this;

      this.defaults.translations[lang] = data;

      var _loop2 = function _loop2(x) {
        var isNoTranslationLabelsUpdate = _this11.states[x].noTranslationLabels.length > 0 && lang === 'en';
        if (_this11.states[x].language === lang || isNoTranslationLabelsUpdate) {
          (function () {
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
          })();
        }
      };

      for (var x = 0; x < this.states.length; x++) {
        _loop2(x);
      }
    }
  }, {
    key: 'updateTicker',
    value: function updateTicker(index, data) {
      var dataKeys = Object.keys(data);
      for (var i = 0; i < dataKeys.length; i++) {
        this.updateData(index, dataKeys[i], data[dataKeys[i]], true);
      }
    }
  }, {
    key: 'stylesheet',
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
    key: 'widgetMainElement',
    value: function widgetMainElement(index) {
      var data = this.states[index];
      return '<div class="cp-widget__header">' + '<div class="' + 'cp-widget__img cp-widget__img-' + data.currency + '">' + '<img/>' + '</div>' + '<div class="cp-widget__main">' + (data.isData ? this.widgetMainElementData(index) : this.widgetMainElementMessage(index)) + '</div>' + '</div>';
    }
  }, {
    key: 'widgetMainElementData',
    value: function widgetMainElementData(index) {
      var data = this.states[index];
      return '<h3><a href="' + this.coin_link(data.currency) + '">' + '<span class="nameTicker">' + (data.ticker.name || cpBootstrap.emptyData) + '</span>' + '<span class="symbolTicker">' + (data.ticker.symbol || cpBootstrap.emptyData) + '</span>' + '</a></h3>' + '<strong>' + '<span class="priceTicker parseNumber">' + (cpBootstrap.parseNumber(data.ticker.price) || cpBootstrap.emptyData) + '</span> ' + '<span class="primaryCurrency">' + data.primary_currency + ' </span>' + '<span class="price_change_24hTicker cp-widget__rank cp-widget__rank-' + (data.ticker.price_change_24h > 0 ? "up" : data.ticker.price_change_24h < 0 ? "down" : "neutral") + '">(' + (cpBootstrap.round(data.ticker.price_change_24h, 2) || cpBootstrap.emptyValue) + '%)</span>' + '</strong>' + '<span class="cp-widget__rank-label"><span class="cp-translation translation_rank">' + this.getTranslation(index, "rank") + '</span> <span class="rankTicker">' + (data.ticker.rank || cpBootstrap.emptyData) + '</span></span>';
    }
  }, {
    key: 'widgetMainElementMessage',
    value: function widgetMainElementMessage(index) {
      var message = this.states[index].message;
      return '<div class="cp-widget__main-no-data cp-translation translation_message">' + this.getTranslation(index, message) + '</div>';
    }
  }, {
    key: 'widgetMarketDetailsElement',
    value: function widgetMarketDetailsElement(index) {
      return Promise.resolve(this.states[index].modules.indexOf('market_details') > -1 ? '<div class="cp-widget__details">' + this.widgetAthElement(index) + this.widgetVolume24hElement(index) + this.widgetMarketCapElement(index) + '</div>' : '');
    }
  }, {
    key: 'widgetAthElement',
    value: function widgetAthElement(index) {
      return '<div>' + '<small class="cp-translation translation_ath">' + this.getTranslation(index, "ath") + '</small>' + '<div>' + '<span class="price_athTicker parseNumber">' + cpBootstrap.emptyData + ' </span>' + '<span class="symbolTicker showDetailsCurrency"></span>' + '</div>' + '<span class="percent_from_price_athTicker cp-widget__rank">' + cpBootstrap.emptyData + '</span>' + '</div>';
    }
  }, {
    key: 'widgetVolume24hElement',
    value: function widgetVolume24hElement(index) {
      return '<div>' + '<small class="cp-translation translation_volume_24h">' + this.getTranslation(index, "volume_24h") + '</small>' + '<div>' + '<span class="volume_24hTicker parseNumber">' + cpBootstrap.emptyData + ' </span>' + '<span class="symbolTicker showDetailsCurrency"></span>' + '</div>' + '<span class="volume_24h_change_24hTicker cp-widget__rank">' + cpBootstrap.emptyData + '</span>' + '</div>';
    }
  }, {
    key: 'widgetMarketCapElement',
    value: function widgetMarketCapElement(index) {
      return '<div>' + '<small class="cp-translation translation_market_cap">' + this.getTranslation(index, "market_cap") + '</small>' + '<div>' + '<span class="market_capTicker parseNumber">' + cpBootstrap.emptyData + ' </span>' + '<span class="symbolTicker showDetailsCurrency"></span>' + '</div>' + '<span class="market_cap_change_24hTicker cp-widget__rank">' + cpBootstrap.emptyData + '</span>' + '</div>';
    }
  }, {
    key: 'widgetChartElement',
    value: function widgetChartElement(index) {
      return Promise.resolve('<div class="cp-widget__chart"><div id="' + this.defaults.className + '-price-chart-' + index + '"></div></div>');
    }
  }, {
    key: 'widgetSelectElement',
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
    key: 'widgetFooter',
    value: function widgetFooter(index) {
      var currency = this.states[index].currency;
      return !this.states[index].isWordpress ? '<p class="cp-widget__footer cp-widget__footer--' + index + '">' + '<span class="cp-translation translation_powered_by">' + this.getTranslation(index, "powered_by") + ' </span>' + '<img style="width: 16px" src="' + this.main_logo_link() + '" alt=""/>' + '<a target="_blank" href="' + this.coin_link(currency) + '">coinpaprika.com</a>' + '</p>' : '';
    }
  }, {
    key: 'getImage',
    value: function getImage(index) {
      var _this12 = this;

      var data = this.states[index];
      var imgContainers = data.mainElement.getElementsByClassName('cp-widget__img');

      var _loop4 = function _loop4(i) {
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
        _loop4(i);
      }
    }
  }, {
    key: 'img_src',
    value: function img_src(id) {
      return 'https://coinpaprika.com/coin/' + id + '/logo.png';
    }
  }, {
    key: 'coin_link',
    value: function coin_link(id) {
      return 'https://coinpaprika.com/coin/' + id;
    }
  }, {
    key: 'main_logo_link',
    value: function main_logo_link() {
      return this.defaults.img_src || this.defaults.origin_src + '/dist/img/logo_widget.svg';
    }
  }, {
    key: 'getScriptElement',
    value: function getScriptElement() {
      return document.querySelector('script[data-cp-currency-widget]');
    }
  }, {
    key: 'getTranslation',
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
    key: 'addLabelWithoutTranslation',
    value: function addLabelWithoutTranslation(index, label) {
      if (!this.defaults.translations['en']) this.getTranslations('en');
      return this.states[index].noTranslationLabels.push(label);
    }
  }, {
    key: 'getTranslations',
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

var chartClass = function () {
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
                annotation.update({ y: y }, true);
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
    this.asyncUrl = '/currency/data/' + state.currency + '/_range_/';
    this.asyncParams = '?quote=' + state.primary_currency.toUpperCase() + '&fields=price,volume';
    this.init();
  }

  _createClass(chartClass, [{
    key: 'setOptions',
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

        yAxis: [{ // Volume yAxis
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

        series: [{ //order of the series matters
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
          color: 'url(#fill-pattern' + (this.isNightMode ? '-night' : '') + ')',
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
    key: 'init',
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
    key: 'parseOptions',
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
    key: 'bind',
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
    key: 'fetchDataPackage',
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
    key: 'fetchData',
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
          return console.log('Looks like there was a problem. Status Code: ' + response.status);
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
      }).catch(function (error) {
        _this19.chart.hideLoading();
        _this19.hideChart();
        return console.log('Fetch Error', error);
      });
      return promise;
    }
  }, {
    key: 'hideChart',
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
    key: 'setRangeSwitcher',
    value: function setRangeSwitcher() {
      var _this21 = this;

      document.addEventListener(this.id + '-switch-range', function (event) {
        _this21.defaultRange = event.detail.data;
        return _this21.fetchDataPackage();
      });
    }
  }, {
    key: 'getRange',
    value: function getRange() {
      return this.defaultRange || '1q';
    }
  }, {
    key: 'toggleEvents',
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
    key: 'dataParser',
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
    key: 'updateData',
    value: function updateData(data, dataType) {
      var _this24 = this;

      var newData = void 0;
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
    key: 'isTheSameElement',
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
    key: 'sortCondition',
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
    key: 'getOldData',
    value: function getOldData(dataType) {
      return this['chart_' + dataType.toLowerCase()];
    }
  }, {
    key: 'replaceData',
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
    key: 'replaceDataType',
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
                  if (series.userOptions.id === coinShort) series.update({ visible: false });
                });
              }
            });
          }
          return cpBootstrap.loop(Object.entries(data), function (value) {
            if (_this26.isExcluded(value[0])) return;
            return _this26.chart.get(value[0]) ? _this26.chart.get(value[0]).setData(value[1], false, false, false) : _this26.chart.addSeries({ id: value[0], data: value[1], showInNavigator: true });
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
    key: 'isExcluded',
    value: function isExcluded(label) {
      return this.excludeSeriesIds.indexOf(label) > -1;
    }
  }, {
    key: 'tooltipFormatter',
    value: function tooltipFormatter(pointer) {
      var label = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var search = arguments[2];

      if (!search) search = label;
      var header = '<div class="cp-chart-tooltip-currency"><small>' + new Date(pointer.x).toUTCString() + '</small><table>';
      var footer = '</table></div>';
      var content = '';
      pointer.points.forEach(function (point) {
        content += '<tr>' + '<td>' + '<svg width="5" height="5"><rect x="0" y="0" width="5" height="5" fill="' + point.series.color + '" fill-opacity="1"></rect></svg>' + point.series.name + ': ' + point.y.toLocaleString('ru-RU', { maximumFractionDigits: 8 }).replace(',', '.') + ' ' + (point.series.name.toLowerCase().search(search.toLowerCase()) > -1 ? "" : label) + '</td>' + '</tr>';
      });
      return header + content + footer;
    }
  }, {
    key: 'setAnnotationsObjects',
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
              title: '<span title="Click to open" class="cp-chart-annotation__text">' + _this27.getEventTagParams(element.tag).label + '</span><span class="cp-chart-annotation__dataElement" style="display: none;">' + JSON.stringify(element) + '</span>',
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
    key: 'setNavigator',
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
    key: 'setResetZoomButton',
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
    key: 'navigatorExtremesListener',
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
    key: 'getNavigatorExtremesUrl',
    value: function getNavigatorExtremesUrl(minDate, maxDate, dataType) {
      var extremesDataUrl = dataType ? this.getExtremesDataUrl(this.id, dataType) : this.extremesDataUrl;
      return minDate && maxDate && extremesDataUrl ? extremesDataUrl + '/dates/' + minDate + '/' + maxDate + '/' : null;
    }
  }, {
    key: 'setNoDataLabel',
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
    key: 'addContainer',
    value: function addContainer(id, label, className) {
      var tagName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'div';

      var container = document.createElement(tagName);
      var chartContainer = document.getElementById(id);
      container.id = id + label;
      container.classList.add(className);
      chartContainer.appendChild(container);
    }
  }, {
    key: 'getContainer',
    value: function getContainer(label) {
      return document.getElementById(this.id + label);
    }
  }, {
    key: 'getExtremesDataUrl',
    value: function getExtremesDataUrl(id) {
      var dataType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'data';

      return '/currency/' + dataType + '/' + this.currency;
    }
  }, {
    key: 'getVolumePattern',
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

var bootstrapClass = function () {
  function bootstrapClass() {
    _classCallCheck(this, bootstrapClass);

    this.emptyValue = 0;
    this.emptyData = '-';
  }

  _createClass(bootstrapClass, [{
    key: 'nodeListToArray',
    value: function nodeListToArray(nodeList) {
      return Array.prototype.slice.call(nodeList);
    }
  }, {
    key: 'parseIntervalValue',
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
    key: 'isFiat',
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
    key: 'updateObject',
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
    key: 'parseCurrencyNumber',
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
    key: 'parseNumber',
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
          return this.round(number, precision).toLocaleString('ru-RU', { maximumFractionDigits: precision }).replace(',', '.');
        } else {
          return number.toLocaleString('ru-RU', { minimumFractionDigits: 2 }).replace(',', '.');
        }
      }
    }
  }, {
    key: 'round',
    value: function round(amount) {
      var decimal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
      var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'round';

      amount = parseFloat(amount);
      decimal = Math.pow(10, decimal);
      return Math[direction](amount * decimal) / decimal;
    }
  }, {
    key: 'loop',
    value: function loop(arr, fn, busy, err) {
      var _this33 = this;

      var i = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

      var body = function body(ok, er) {
        try {
          var r = fn(arr[i], i, arr);
          r && r.then ? r.then(ok).catch(er) : ok(r);
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
        return i < arr.length ? new Promise(body).then(next(ok, er)).catch(er) : ok();
      };
      return busy ? run(busy, err) : new Promise(run);
    }
  }]);

  return bootstrapClass;
}();

var fetchClass = function () {
  function fetchClass() {
    _classCallCheck(this, fetchClass);

    this.state = {};
  }

  _createClass(fetchClass, [{
    key: 'fetchScript',
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
          reject(new Error('Failed to load image\'s URL: ' + url));
        });
        script.async = true;
        script.src = url;
      });
    }
  }, {
    key: 'fetchStyle',
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
          reject(new Error('Failed to load style URL: ' + url));
        });
        link.href = url;
      });
    }
  }, {
    key: 'fetchChartData',
    value: function fetchChartData(uri) {
      var fromState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var url = 'https://graphs.coinpaprika.com' + uri;
      return this.fetchData(url, fromState);
    }
  }, {
    key: 'fetchData',
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
    key: 'fetchJsonFile',
    value: function fetchJsonFile(url) {
      var fromState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      return this.fetchData(url, fromState).then(function (result) {
        if (result.status === 200) {
          return result.json();
        }
        return false;
      }).catch(function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7SUNBTSxpQjtBQUNKLCtCQUFjO0FBQUE7O0FBQ1osU0FBSyxPQUFMLEdBQWUsSUFBSSxZQUFKLEVBQWY7QUFDQSxTQUFLLElBQUw7QUFDRDs7OzsyQkFFSztBQUFBOztBQUNKLGFBQU8sS0FBSyxPQUFMLENBQWEsUUFBYixDQUFzQixVQUE3QixJQUEyQyxFQUEzQztBQUNBLGVBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDO0FBQUEsZUFBTSxNQUFLLFdBQUwsRUFBTjtBQUFBLE9BQTlDLEVBQXdFLEtBQXhFO0FBQ0EsYUFBTyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLFVBQXpDLEdBQXNELFlBQU07QUFDMUQsZUFBTyxNQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLElBQXpDLEdBQWdELEtBQWhEO0FBQ0EsY0FBSyxXQUFMO0FBQ0QsT0FIRDtBQUlEOzs7a0NBRVk7QUFBQTs7QUFDWCxVQUFJLENBQUMsT0FBTyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLElBQTlDLEVBQW1EO0FBQ2pELGVBQU8sS0FBSyxPQUFMLENBQWEsUUFBYixDQUFzQixVQUE3QixFQUF5QyxJQUF6QyxHQUFnRCxJQUFoRDtBQUNBLFlBQUksZUFBZSxNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsU0FBUyxzQkFBVCxDQUFnQyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFNBQXRELENBQTNCLENBQW5CO0FBQ0EsYUFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixZQUE1QjtBQUNBLGVBQU8sZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsWUFBTTtBQUN0QyxpQkFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixZQUE1QjtBQUNBLGVB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QUFNO0FBQ3JDLGlCQUFPLE1BQU0sR0FBTixDQUFQO0FBQ0QsU0FGYyxDQUFmO0FBR0EsdUJBQWUsYUFBYSxJQUFiLENBQWtCLFVBQUMsUUFBRCxFQUFjO0FBQzdDLGtCQUFLLEtBQUwsQ0FBVyxHQUFYLElBQWtCLFFBQWxCO0FBQ0EsaUJBQU8sU0FBUyxLQUFULEVBQVA7QUFDRCxTQUhjLENBQWY7QUFJQSxlQUFPLFlBQVA7QUFDRCxPQXhCUyxDQUFWO0FBeUJBLGFBQU8sT0FBUDtBQUNEOzs7a0NBRWEsRyxFQUF1QjtBQUFBLFVBQWxCLFNBQWtCLHVFQUFOLEtBQU07O0FBQ25DLGFBQU8sS0FBSyxTQUFMLENBQWUsR0FBZixFQUFvQixTQUFwQixFQUErQixJQUEvQixDQUFvQyxrQkFBVTtBQUNuRCxZQUFJLE9BQU8sTUFBUCxLQUFrQixHQUF0QixFQUEyQjtBQUN6QixpQkFBTyxPQUFPLElBQVAsRUFBUDtBQUNEO0FBQ0QsZUFBTyxLQUFQO0FBQ0QsT0FMTSxFQUtKLEtBTEksQ0FLRSxZQUFNO0FBQ2IsZUFBTyxLQUFQO0FBQ0QsT0FQTSxDQUFQO0FBUUQ7Ozs7OztBQUdILElBQU0sVUFBVSxJQUFJLGlCQUFKLEVBQWhCO0FBQ0EsSUFBTSxjQUFjLElBQUksY0FBSixFQUFwQjtBQUNBLElBQU0sZUFBZSxJQUFJLFVBQUosRUFBckIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjbGFzcyB3aWRnZXRzQ29udHJvbGxlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMud2lkZ2V0cyA9IG5ldyB3aWRnZXRzQ2xhc3MoKTtcbiAgICB0aGlzLmJpbmQoKTtcbiAgfVxuICBcbiAgYmluZCgpe1xuICAgIHdpbmRvd1t0aGlzLndpZGdldHMuZGVmYXVsdHMub2JqZWN0TmFtZV0gPSB7fTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4gdGhpcy5pbml0V2lkZ2V0cygpLCBmYWxzZSk7XG4gICAgd2luZG93W3RoaXMud2lkZ2V0cy5kZWZhdWx0cy5vYmplY3ROYW1lXS5iaW5kV2lkZ2V0ID0gKCkgPT4ge1xuICAgICAgd2luZG93W3RoaXMud2lkZ2V0cy5kZWZhdWx0cy5vYmplY3ROYW1lXS5pbml0ID0gZmFsc2U7XG4gICAgICB0aGlzLmluaXRXaWRnZXRzKCk7XG4gICAgfTtcbiAgfVxuICBcbiAgaW5pdFdpZGdldHMoKXtcbiAgICBpZiAoIXdpbmRvd1t0aGlzLndpZGdldHMuZGVmYXVsdHMub2JqZWN0TmFtZV0uaW5pdCl7XG4gICAgICB3aW5kb3dbdGhpcy53aWRnZXRzLmRlZmF1bHRzLm9iamVjdE5hbWVdLmluaXQgPSB0cnVlO1xuICAgICAgbGV0IG1haW5FbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy53aWRnZXRzLmRlZmF1bHRzLmNsYXNzTmFtZSkpO1xuICAgICAgdGhpcy53aWRnZXRzLnNldFdpZGdldENsYXNzKG1haW5FbGVtZW50cyk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgICB0aGlzLndpZGdldHMuc2V0V2lkZ2V0Q2xhc3MobWFpbkVsZW1lbnRzKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYWluRWxlbWVudHMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgIHRoaXMud2lkZ2V0cy5zZXRCZWZvcmVFbGVtZW50SW5Gb290ZXIoaSk7XG4gICAgICAgIH1cbiAgICAgIH0sIGZhbHNlKTtcbiAgICAgIGxldCBzY3JpcHRFbGVtZW50ID0gdGhpcy53aWRnZXRzLmdldFNjcmlwdEVsZW1lbnQoKTtcbiAgICAgIGlmIChzY3JpcHRFbGVtZW50ICYmIHNjcmlwdEVsZW1lbnQuZGF0YXNldCAmJiBzY3JpcHRFbGVtZW50LmRhdGFzZXQuY3BDdXJyZW5jeVdpZGdldCl7XG4gICAgICAgIGxldCBkYXRhc2V0ID0gSlNPTi5wYXJzZShzY3JpcHRFbGVtZW50LmRhdGFzZXQuY3BDdXJyZW5jeVdpZGdldCk7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhkYXRhc2V0KSl7XG4gICAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhkYXRhc2V0KTtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGtleXMubGVuZ3RoOyBqKyspe1xuICAgICAgICAgICAgbGV0IGtleSA9IGtleXNbal0ucmVwbGFjZSgnLScsICdfJyk7XG4gICAgICAgICAgICB0aGlzLndpZGdldHMuZGVmYXVsdHNba2V5XSA9IGRhdGFzZXRba2V5c1tqXV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy53aWRnZXRzLnN0YXRlcyA9IFtdO1xuICAgICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChtYWluRWxlbWVudHMsIChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICAgIGxldCBuZXdTZXR0aW5ncyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy53aWRnZXRzLmRlZmF1bHRzKSk7XG4gICAgICAgICAgbmV3U2V0dGluZ3MuaXNXb3JkcHJlc3MgPSBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnd29yZHByZXNzJyk7XG4gICAgICAgICAgbmV3U2V0dGluZ3MuaXNOaWdodE1vZGUgPSBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY3Atd2lkZ2V0X19uaWdodC1tb2RlJyk7XG4gICAgICAgICAgbmV3U2V0dGluZ3MubWFpbkVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICAgIHRoaXMud2lkZ2V0cy5zdGF0ZXMucHVzaChuZXdTZXR0aW5ncyk7XG4gICAgICAgICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGxldCBjaGFydFNjcmlwdHMgPSBbXG4gICAgICAgICAgICAgICcvL2NvZGUuaGlnaGNoYXJ0cy5jb20vc3RvY2svaGlnaHN0b2NrLmpzJyxcbiAgICAgICAgICAgICAgJy8vY29kZS5oaWdoY2hhcnRzLmNvbS9tb2R1bGVzL2V4cG9ydGluZy5qcycsXG4gICAgICAgICAgICAgICcvL2NvZGUuaGlnaGNoYXJ0cy5jb20vbW9kdWxlcy9uby1kYXRhLXRvLWRpc3BsYXkuanMnLFxuICAgICAgICAgICAgICAnLy9oaWdoY2hhcnRzLmdpdGh1Yi5pby9wYXR0ZXJuLWZpbGwvcGF0dGVybi1maWxsLXYyLmpzJyxcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICByZXR1cm4gKG5ld1NldHRpbmdzLm1vZHVsZXMuaW5kZXhPZignY2hhcnQnKSA+IC0xICYmICF3aW5kb3cuSGlnaGNoYXJ0cylcbiAgICAgICAgICAgICAgPyBjcEJvb3RzdHJhcC5sb29wKGNoYXJ0U2NyaXB0cywgbGluayA9PiB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmV0Y2hTZXJ2aWNlLmZldGNoU2NyaXB0KGxpbmspO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndpZGdldHMuaW5pdChpbmRleCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH0pO1xuICAgICAgfSwgNTApO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyB3aWRnZXRzQ2xhc3Mge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnN0YXRlcyA9IFtdO1xuICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICBvYmplY3ROYW1lOiAnY3BDdXJyZW5jeVdpZGdldHMnLFxuICAgICAgY2xhc3NOYW1lOiAnY29pbnBhcHJpa2EtY3VycmVuY3ktd2lkZ2V0JyxcbiAgICAgIGNzc0ZpbGVOYW1lOiAnd2lkZ2V0Lm1pbi5jc3MnLFxuICAgICAgY3VycmVuY3k6ICdidGMtYml0Y29pbicsXG4gICAgICBwcmltYXJ5X2N1cnJlbmN5OiAnVVNEJyxcbiAgICAgIHJhbmdlX2xpc3Q6IFsnMjRoJywgJzdkJywgJzMwZCcsICcxcScsICcxeScsICd5dGQnLCAnYWxsJ10sXG4gICAgICByYW5nZTogJzdkJyxcbiAgICAgIG1vZHVsZXM6IFsnbWFya2V0X2RldGFpbHMnLCAnY2hhcnQnXSxcbiAgICAgIHVwZGF0ZV9hY3RpdmU6IGZhbHNlLFxuICAgICAgdXBkYXRlX3RpbWVvdXQ6ICczMHMnLFxuICAgICAgbGFuZ3VhZ2U6ICdlbicsXG4gICAgICBzdHlsZV9zcmM6IG51bGwsXG4gICAgICBpbWdfc3JjOiBudWxsLFxuICAgICAgbGFuZ19zcmM6IG51bGwsXG4gICAgICBkYXRhX3NyYzogbnVsbCxcbiAgICAgIG9yaWdpbl9zcmM6ICdodHRwczovL3VucGtnLmNvbS9AY29pbnBhcHJpa2Evd2lkZ2V0LWN1cnJlbmN5JyxcbiAgICAgIHNob3dfZGV0YWlsc19jdXJyZW5jeTogZmFsc2UsXG4gICAgICB0aWNrZXI6IHtcbiAgICAgICAgbmFtZTogdW5kZWZpbmVkLFxuICAgICAgICBzeW1ib2w6IHVuZGVmaW5lZCxcbiAgICAgICAgcHJpY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgcHJpY2VfY2hhbmdlXzI0aDogdW5kZWZpbmVkLFxuICAgICAgICByYW5rOiB1bmRlZmluZWQsXG4gICAgICAgIHByaWNlX2F0aDogdW5kZWZpbmVkLFxuICAgICAgICB2b2x1bWVfMjRoOiB1bmRlZmluZWQsXG4gICAgICAgIG1hcmtldF9jYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgcGVyY2VudF9mcm9tX3ByaWNlX2F0aDogdW5kZWZpbmVkLFxuICAgICAgICB2b2x1bWVfMjRoX2NoYW5nZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgICAgbWFya2V0X2NhcF9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgICAgaW50ZXJ2YWw6IG51bGwsXG4gICAgICBpc1dvcmRwcmVzczogZmFsc2UsXG4gICAgICBpc05pZ2h0TW9kZTogZmFsc2UsXG4gICAgICBpc0RhdGE6IGZhbHNlLFxuICAgICAgYXZhaWxhYmxlTW9kdWxlczogWydwcmljZScsICdjaGFydCcsICdtYXJrZXRfZGV0YWlscyddLFxuICAgICAgbWVzc2FnZTogJ2RhdGFfbG9hZGluZycsXG4gICAgICB0cmFuc2xhdGlvbnM6IHt9LFxuICAgICAgbWFpbkVsZW1lbnQ6IG51bGwsXG4gICAgICBub1RyYW5zbGF0aW9uTGFiZWxzOiBbXSxcbiAgICAgIHNjcmlwdHNEb3dubG9hZGVkOiB7fSxcbiAgICAgIGNoYXJ0OiBudWxsLFxuICAgICAgcndkOiB7XG4gICAgICAgIHhzOiAyODAsXG4gICAgICAgIHM6IDMyMCxcbiAgICAgICAgbTogMzcwLFxuICAgICAgICBsOiA0NjIsXG4gICAgICB9LFxuICAgIH07XG4gIH1cbiAgXG4gIGluaXQoaW5kZXgpIHtcbiAgICBpZiAoIXRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5lcnJvcignQmluZCBmYWlsZWQsIG5vIGVsZW1lbnQgd2l0aCBjbGFzcyA9IFwiJyArIHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lICsgJ1wiJyk7XG4gICAgfVxuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5nZXREZWZhdWx0cyhpbmRleCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRPcmlnaW5MaW5rKGluZGV4KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgc2V0V2lkZ2V0Q2xhc3MoZWxlbWVudHMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgd2lkdGggPSBlbGVtZW50c1tpXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICAgIGxldCByd2RLZXlzID0gT2JqZWN0LmtleXModGhpcy5kZWZhdWx0cy5yd2QpO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCByd2RLZXlzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGxldCByd2RLZXkgPSByd2RLZXlzW2pdO1xuICAgICAgICBsZXQgcndkUGFyYW0gPSB0aGlzLmRlZmF1bHRzLnJ3ZFtyd2RLZXldO1xuICAgICAgICBsZXQgY2xhc3NOYW1lID0gdGhpcy5kZWZhdWx0cy5jbGFzc05hbWUgKyAnX18nICsgcndkS2V5O1xuICAgICAgICBpZiAod2lkdGggPD0gcndkUGFyYW0pIGVsZW1lbnRzW2ldLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgICAgaWYgKHdpZHRoID4gcndkUGFyYW0pIGVsZW1lbnRzW2ldLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIGdldE1haW5FbGVtZW50KGluZGV4KSB7XG4gICAgcmV0dXJuICh0aGlzLnN0YXRlc1tpbmRleF0pID8gdGhpcy5zdGF0ZXNbaW5kZXhdLm1haW5FbGVtZW50IDogbnVsbDtcbiAgfVxuICBcbiAgZ2V0RGVmYXVsdHMoaW5kZXgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBsZXQgbWFpbkVsZW1lbnQgPSB0aGlzLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICAgIGlmIChtYWluRWxlbWVudCAmJiBtYWluRWxlbWVudC5kYXRhc2V0KSB7XG4gICAgICAgIGlmICghbWFpbkVsZW1lbnQuZGF0YXNldC5tb2R1bGVzICYmIG1haW5FbGVtZW50LmRhdGFzZXQudmVyc2lvbiA9PT0gJ2V4dGVuZGVkJykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbW9kdWxlcycsIFsnbWFya2V0X2RldGFpbHMnXSk7XG4gICAgICAgIGlmICghbWFpbkVsZW1lbnQuZGF0YXNldC5tb2R1bGVzICYmIG1haW5FbGVtZW50LmRhdGFzZXQudmVyc2lvbiA9PT0gJ3N0YW5kYXJkJykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbW9kdWxlcycsIFtdKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubW9kdWxlcykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbW9kdWxlcycsIEpTT04ucGFyc2UobWFpbkVsZW1lbnQuZGF0YXNldC5tb2R1bGVzKSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnByaW1hcnlDdXJyZW5jeSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAncHJpbWFyeV9jdXJyZW5jeScsIG1haW5FbGVtZW50LmRhdGFzZXQucHJpbWFyeUN1cnJlbmN5KTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuY3VycmVuY3kpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2N1cnJlbmN5JywgbWFpbkVsZW1lbnQuZGF0YXNldC5jdXJyZW5jeSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnJhbmdlKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdyYW5nZScsIG1haW5FbGVtZW50LmRhdGFzZXQucmFuZ2UpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5zaG93RGV0YWlsc0N1cnJlbmN5KSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdzaG93X2RldGFpbHNfY3VycmVuY3knLCAobWFpbkVsZW1lbnQuZGF0YXNldC5zaG93RGV0YWlsc0N1cnJlbmN5ID09PSAndHJ1ZScpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlQWN0aXZlKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICd1cGRhdGVfYWN0aXZlJywgKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlQWN0aXZlID09PSAndHJ1ZScpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlVGltZW91dCkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAndXBkYXRlX3RpbWVvdXQnLCBjcEJvb3RzdHJhcC5wYXJzZUludGVydmFsVmFsdWUobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVUaW1lb3V0KSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lmxhbmd1YWdlKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdsYW5ndWFnZScsIG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ3VhZ2UpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5vcmlnaW5TcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ29yaWdpbl9zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0Lm9yaWdpblNyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lm5vZGVNb2R1bGVzU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdub2RlX21vZHVsZXNfc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5ub2RlTW9kdWxlc1NyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmJvd2VyU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdib3dlcl9zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LmJvd2VyU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuc3R5bGVTcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3N0eWxlX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQuc3R5bGVTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5sYW5nU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdsb2dvX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ1NyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmltZ1NyYykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbG9nb19zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LmltZ1NyYyk7XG4gICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgIH0pO1xuICB9XG4gIFxuICBzZXRPcmlnaW5MaW5rKGluZGV4KSB7XG4gICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zKS5sZW5ndGggPT09IDApIHRoaXMuZ2V0VHJhbnNsYXRpb25zKHRoaXMuZGVmYXVsdHMubGFuZ3VhZ2UpO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zdHlsZXNoZWV0KCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hZGRXaWRnZXRFbGVtZW50KGluZGV4KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmluaXRJbnRlcnZhbChpbmRleCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGFkZFdpZGdldEVsZW1lbnQoaW5kZXgpIHtcbiAgICBsZXQgbWFpbkVsZW1lbnQgPSB0aGlzLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICBsZXQgbW9kdWxlcyA9ICcnO1xuICAgIGxldCBtb2R1bGVzQXJyYXkgPSBbXTtcbiAgICBsZXQgY2hhcnRDb250YWluZXIgPSBudWxsO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcCh0aGlzLmRlZmF1bHRzLmF2YWlsYWJsZU1vZHVsZXMsIG1vZHVsZSA9PiB7XG4gICAgICAgIHJldHVybiAodGhpcy5zdGF0ZXNbaW5kZXhdLm1vZHVsZXMuaW5kZXhPZihtb2R1bGUpID4gLTEpID8gbW9kdWxlc0FycmF5LnB1c2gobW9kdWxlKSA6IG51bGw7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKG1vZHVsZXNBcnJheSwgbW9kdWxlID0+IHtcbiAgICAgICAgbGV0IGxhYmVsID0gbnVsbDtcbiAgICAgICAgaWYgKG1vZHVsZSA9PT0gJ2NoYXJ0JykgbGFiZWwgPSAnQ2hhcnQnO1xuICAgICAgICBpZiAobW9kdWxlID09PSAnbWFya2V0X2RldGFpbHMnKSBsYWJlbCA9ICdNYXJrZXREZXRhaWxzJztcbiAgICAgICAgcmV0dXJuIChsYWJlbCkgPyB0aGlzW2B3aWRnZXQkeyBsYWJlbCB9RWxlbWVudGBdKGluZGV4KS50aGVuKHJlc3VsdCA9PiBtb2R1bGVzICs9IHJlc3VsdCkgOiBudWxsO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gbWFpbkVsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy53aWRnZXRNYWluRWxlbWVudChpbmRleCkgKyBtb2R1bGVzICsgdGhpcy53aWRnZXRGb290ZXIoaW5kZXgpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgY2hhcnRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgJHsgdGhpcy5kZWZhdWx0cy5jbGFzc05hbWUgfS1wcmljZS1jaGFydC0keyBpbmRleCB9YCk7XG4gICAgICByZXR1cm4gKGNoYXJ0Q29udGFpbmVyKSA/IGNoYXJ0Q29udGFpbmVyLnBhcmVudEVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCB0aGlzLndpZGdldFNlbGVjdEVsZW1lbnQoaW5kZXgsICdyYW5nZScpKSA6IG51bGw7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBpZiAoY2hhcnRDb250YWluZXIpe1xuICAgICAgICB0aGlzLnN0YXRlc1tpbmRleF0uY2hhcnQgPSBuZXcgY2hhcnRDbGFzcyhjaGFydENvbnRhaW5lciwgdGhpcy5zdGF0ZXNbaW5kZXhdKTtcbiAgICAgICAgdGhpcy5zZXRTZWxlY3RMaXN0ZW5lcnMoaW5kZXgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG4gICAgXG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRCZWZvcmVFbGVtZW50SW5Gb290ZXIoaW5kZXgpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RGF0YShpbmRleCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHNldFNlbGVjdExpc3RlbmVycyhpbmRleCl7XG4gICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgbGV0IHNlbGVjdEVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNwLXdpZGdldC1zZWxlY3QnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdEVsZW1lbnRzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGxldCBidXR0b25zID0gc2VsZWN0RWxlbWVudHNbaV0ucXVlcnlTZWxlY3RvckFsbCgnLmNwLXdpZGdldC1zZWxlY3RfX29wdGlvbnMgYnV0dG9uJyk7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJ1dHRvbnMubGVuZ3RoOyBqKyspe1xuICAgICAgICBidXR0b25zW2pdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRTZWxlY3RPcHRpb24oZXZlbnQsIGluZGV4KTtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgc2V0U2VsZWN0T3B0aW9uKGV2ZW50LCBpbmRleCl7XG4gICAgbGV0IGNsYXNzTmFtZSA9ICdjcC13aWRnZXQtYWN0aXZlJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspe1xuICAgICAgbGV0IHNpYmxpbmcgPSBldmVudC50YXJnZXQucGFyZW50Tm9kZS5jaGlsZE5vZGVzW2ldO1xuICAgICAgaWYgKHNpYmxpbmcuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpIHNpYmxpbmcuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgIH1cbiAgICBsZXQgcGFyZW50ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5jcC13aWRnZXQtc2VsZWN0Jyk7XG4gICAgbGV0IHR5cGUgPSBwYXJlbnQuZGF0YXNldC50eXBlO1xuICAgIGxldCBwaWNrZWRWYWx1ZUVsZW1lbnQgPSBwYXJlbnQucXVlcnlTZWxlY3RvcignLmNwLXdpZGdldC1zZWxlY3RfX29wdGlvbnMgPiBzcGFuJyk7XG4gICAgbGV0IHZhbHVlID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQub3B0aW9uO1xuICAgIHBpY2tlZFZhbHVlRWxlbWVudC5pbm5lclRleHQgPSB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCB2YWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsIHR5cGUsIHZhbHVlKTtcbiAgICBldmVudC50YXJnZXQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgIHRoaXMuZGlzcGF0Y2hFdmVudChpbmRleCwgJy1zd2l0Y2gtcmFuZ2UnLCB2YWx1ZSk7XG4gIH1cbiAgXG4gIGRpc3BhdGNoRXZlbnQoaW5kZXgsIG5hbWUsIGRhdGEpe1xuICAgIGxldCBpZCA9IGAkeyB0aGlzLmRlZmF1bHRzLmNsYXNzTmFtZSB9LXByaWNlLWNoYXJ0LSR7IGluZGV4IH1gO1xuICAgIHJldHVybiBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChgJHtpZH0ke25hbWV9YCwgeyBkZXRhaWw6IHsgZGF0YSB9IH0pKTtcbiAgfVxuICBcbiAgZ2V0RGF0YShpbmRleCkge1xuICAgIGNvbnN0IHVybCA9ICdodHRwczovL2FwaS5jb2lucGFwcmlrYS5jb20vdjEvd2lkZ2V0LycgKyB0aGlzLnN0YXRlc1tpbmRleF0uY3VycmVuY3kgKyAnP3F1b3RlPScgKyB0aGlzLnN0YXRlc1tpbmRleF0ucHJpbWFyeV9jdXJyZW5jeTtcbiAgICByZXR1cm4gZmV0Y2hTZXJ2aWNlLmZldGNoRGF0YSh1cmwpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlc1tpbmRleF0uaXNEYXRhKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdpc0RhdGEnLCB0cnVlKTtcbiAgICAgICAgdGhpcy51cGRhdGVUaWNrZXIoaW5kZXgsIHJlc3VsdCk7XG4gICAgICB9KVxuICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgIHJldHVybiB0aGlzLm9uRXJyb3JSZXF1ZXN0KGluZGV4LCBlcnJvcik7XG4gICAgfSk7XG4gIH1cbiAgXG4gIG9uRXJyb3JSZXF1ZXN0KGluZGV4LCB4aHIpIHtcbiAgICBpZiAodGhpcy5zdGF0ZXNbaW5kZXhdLmlzRGF0YSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnaXNEYXRhJywgZmFsc2UpO1xuICAgIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ21lc3NhZ2UnLCAnZGF0YV91bmF2YWlsYWJsZScpO1xuICAgIGNvbnNvbGUuZXJyb3IoJ1JlcXVlc3QgZmFpbGVkLiAgUmV0dXJuZWQgc3RhdHVzIG9mICcgKyB4aHIsIHRoaXMuc3RhdGVzW2luZGV4XSk7XG4gIH1cbiAgXG4gIGluaXRJbnRlcnZhbChpbmRleCkge1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5zdGF0ZXNbaW5kZXhdLmludGVydmFsKTtcbiAgICBpZiAodGhpcy5zdGF0ZXNbaW5kZXhdLnVwZGF0ZV9hY3RpdmUgJiYgdGhpcy5zdGF0ZXNbaW5kZXhdLnVwZGF0ZV90aW1lb3V0ID4gMTAwMCkge1xuICAgICAgdGhpcy5zdGF0ZXNbaW5kZXhdLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICB0aGlzLmdldERhdGEoaW5kZXgpO1xuICAgICAgfSwgdGhpcy5zdGF0ZXNbaW5kZXhdLnVwZGF0ZV90aW1lb3V0KTtcbiAgICB9XG4gIH1cbiAgXG4gIHNldEJlZm9yZUVsZW1lbnRJbkZvb3RlcihpbmRleCkge1xuICAgIGlmICghdGhpcy5zdGF0ZXNbaW5kZXhdLmlzV29yZHByZXNzKSB7XG4gICAgICBsZXQgbWFpbkVsZW1lbnQgPSB0aGlzLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICAgIGlmIChtYWluRWxlbWVudCkge1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuY2hpbGRyZW5bMF0ubG9jYWxOYW1lID09PSAnc3R5bGUnKSB7XG4gICAgICAgICAgbWFpbkVsZW1lbnQucmVtb3ZlQ2hpbGQobWFpbkVsZW1lbnQuY2hpbGROb2Rlc1swXSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGZvb3RlckVsZW1lbnQgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuY3Atd2lkZ2V0X19mb290ZXInKTtcbiAgICAgICAgbGV0IHZhbHVlID0gZm9vdGVyRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAtIDQzO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvb3RlckVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhbHVlIC09IGZvb3RlckVsZW1lbnQuY2hpbGROb2Rlc1tpXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSAnLmNwLXdpZGdldF9fZm9vdGVyLS0nICsgaW5kZXggKyAnOjpiZWZvcmV7d2lkdGg6JyArIHZhbHVlLnRvRml4ZWQoMCkgKyAncHg7fSc7XG4gICAgICAgIG1haW5FbGVtZW50Lmluc2VydEJlZm9yZShzdHlsZSwgbWFpbkVsZW1lbnQuY2hpbGRyZW5bMF0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgdXBkYXRlV2lkZ2V0RWxlbWVudChpbmRleCwga2V5LCB2YWx1ZSwgdGlja2VyKSB7XG4gICAgbGV0IHN0YXRlID0gdGhpcy5zdGF0ZXNbaW5kZXhdO1xuICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgIGlmIChtYWluRWxlbWVudCkge1xuICAgICAgbGV0IHRpY2tlckNsYXNzID0gKHRpY2tlcikgPyAnVGlja2VyJyA6ICcnO1xuICAgICAgaWYgKGtleSA9PT0gJ25hbWUnIHx8IGtleSA9PT0gJ2N1cnJlbmN5Jykge1xuICAgICAgICBpZiAoa2V5ID09PSAnY3VycmVuY3knKSB7XG4gICAgICAgICAgbGV0IGFFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXRfX2Zvb3RlciA+IGEnKTtcbiAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGFFbGVtZW50cy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgYUVsZW1lbnRzW2tdLmhyZWYgPSB0aGlzLmNvaW5fbGluayh2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2V0SW1hZ2UoaW5kZXgpO1xuICAgICAgfVxuICAgICAgaWYgKGtleSA9PT0gJ2lzRGF0YScgfHwga2V5ID09PSAnbWVzc2FnZScpIHtcbiAgICAgICAgbGV0IGhlYWRlckVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNwLXdpZGdldF9fbWFpbicpO1xuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGhlYWRlckVsZW1lbnRzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgaGVhZGVyRWxlbWVudHNba10uaW5uZXJIVE1MID0gKCFzdGF0ZS5pc0RhdGEpID8gdGhpcy53aWRnZXRNYWluRWxlbWVudE1lc3NhZ2UoaW5kZXgpIDogdGhpcy53aWRnZXRNYWluRWxlbWVudERhdGEoaW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgdXBkYXRlRWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIGtleSArIHRpY2tlckNsYXNzKTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB1cGRhdGVFbGVtZW50cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGxldCB1cGRhdGVFbGVtZW50ID0gdXBkYXRlRWxlbWVudHNbal07XG4gICAgICAgICAgaWYgKHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjcC13aWRnZXRfX3JhbmsnKSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9IChwYXJzZUZsb2F0KHZhbHVlKSA+IDApID8gXCJjcC13aWRnZXRfX3JhbmstdXBcIiA6ICgocGFyc2VGbG9hdCh2YWx1ZSkgPCAwKSA/IFwiY3Atd2lkZ2V0X19yYW5rLWRvd25cIiA6IFwiY3Atd2lkZ2V0X19yYW5rLW5ldXRyYWxcIik7XG4gICAgICAgICAgICB1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9fcmFuay1kb3duJyk7XG4gICAgICAgICAgICB1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9fcmFuay11cCcpO1xuICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX3JhbmstbmV1dHJhbCcpO1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSBjcEJvb3RzdHJhcC5lbXB0eURhdGE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgdmFsdWUgPSAoa2V5ID09PSAncHJpY2VfY2hhbmdlXzI0aCcpID8gJygnICsgY3BCb290c3RyYXAucm91bmQodmFsdWUsIDIpICsgJyUpJyA6IGNwQm9vdHN0cmFwLnJvdW5kKHZhbHVlLCAyKSArICclJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93RGV0YWlsc0N1cnJlbmN5JykgJiYgIXN0YXRlLnNob3dfZGV0YWlsc19jdXJyZW5jeSkge1xuICAgICAgICAgICAgdmFsdWUgPSAnICc7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncGFyc2VOdW1iZXInKSkge1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luID0gdGhpcy5kZWZhdWx0cy5kYXRhX3NyYyB8fCB0aGlzLmRlZmF1bHRzLm9yaWdpbl9zcmM7XG4gICAgICAgICAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5wYXJzZUN1cnJlbmN5TnVtYmVyKHZhbHVlLCBzdGF0ZS5wcmltYXJ5X2N1cnJlbmN5LCBvcmlnaW4pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZUVsZW1lbnQuaW5uZXJUZXh0ID0gcmVzdWx0IHx8IGNwQm9vdHN0cmFwLmVtcHR5RGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuaW5uZXJUZXh0ID0gdmFsdWUgfHwgY3BCb290c3RyYXAuZW1wdHlEYXRhO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgdXBkYXRlRGF0YShpbmRleCwga2V5LCB2YWx1ZSwgdGlja2VyKSB7XG4gICAgaWYgKHRpY2tlcikge1xuICAgICAgdGhpcy5zdGF0ZXNbaW5kZXhdLnRpY2tlcltrZXldID0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdGVzW2luZGV4XVtrZXldID0gdmFsdWU7XG4gICAgfVxuICAgIGlmIChrZXkgPT09ICdsYW5ndWFnZScpIHtcbiAgICAgIHRoaXMuZ2V0VHJhbnNsYXRpb25zKHZhbHVlKTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVXaWRnZXRFbGVtZW50KGluZGV4LCBrZXksIHZhbHVlLCB0aWNrZXIpO1xuICB9XG4gIFxuICB1cGRhdGVXaWRnZXRUcmFuc2xhdGlvbnMobGFuZywgZGF0YSkge1xuICAgIHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddID0gZGF0YTtcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuc3RhdGVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICBsZXQgaXNOb1RyYW5zbGF0aW9uTGFiZWxzVXBkYXRlID0gdGhpcy5zdGF0ZXNbeF0ubm9UcmFuc2xhdGlvbkxhYmVscy5sZW5ndGggPiAwICYmIGxhbmcgPT09ICdlbic7XG4gICAgICBpZiAodGhpcy5zdGF0ZXNbeF0ubGFuZ3VhZ2UgPT09IGxhbmcgfHwgaXNOb1RyYW5zbGF0aW9uTGFiZWxzVXBkYXRlKSB7XG4gICAgICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuc3RhdGVzW3hdLm1haW5FbGVtZW50O1xuICAgICAgICBsZXQgdHJhbnNhbHRlRWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3AtdHJhbnNsYXRpb24nKSk7XG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdHJhbnNhbHRlRWxlbWVudHMubGVuZ3RoOyB5KyspIHtcbiAgICAgICAgICB0cmFuc2FsdGVFbGVtZW50c1t5XS5jbGFzc0xpc3QuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoY2xhc3NOYW1lLnNlYXJjaCgndHJhbnNsYXRpb25fJykgPiAtMSkge1xuICAgICAgICAgICAgICBsZXQgdHJhbnNsYXRlS2V5ID0gY2xhc3NOYW1lLnJlcGxhY2UoJ3RyYW5zbGF0aW9uXycsICcnKTtcbiAgICAgICAgICAgICAgaWYgKHRyYW5zbGF0ZUtleSA9PT0gJ21lc3NhZ2UnKSB0cmFuc2xhdGVLZXkgPSB0aGlzLnN0YXRlc1t4XS5tZXNzYWdlO1xuICAgICAgICAgICAgICBsZXQgbGFiZWxJbmRleCA9IHRoaXMuc3RhdGVzW3hdLm5vVHJhbnNsYXRpb25MYWJlbHMuaW5kZXhPZih0cmFuc2xhdGVLZXkpO1xuICAgICAgICAgICAgICBsZXQgdGV4dCA9IHRoaXMuZ2V0VHJhbnNsYXRpb24oeCwgdHJhbnNsYXRlS2V5KTtcbiAgICAgICAgICAgICAgaWYgKGxhYmVsSW5kZXggPiAtMSAmJiB0ZXh0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZXNbeF0ubm9UcmFuc2xhdGlvbkxhYmVscy5zcGxpY2UobGFiZWxJbmRleCwgMSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0cmFuc2FsdGVFbGVtZW50c1t5XS5pbm5lclRleHQgPSB0ZXh0O1xuICAgICAgICAgICAgICBpZiAodHJhbnNhbHRlRWxlbWVudHNbeV0uY2xvc2VzdCgnLmNwLXdpZGdldF9fZm9vdGVyJykpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKHgpLCA1MCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICB1cGRhdGVUaWNrZXIoaW5kZXgsIGRhdGEpIHtcbiAgICBsZXQgZGF0YUtleXMgPSBPYmplY3Qua2V5cyhkYXRhKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsIGRhdGFLZXlzW2ldLCBkYXRhW2RhdGFLZXlzW2ldXSwgdHJ1ZSk7XG4gICAgfVxuICB9XG4gIFxuICBzdHlsZXNoZWV0KCkge1xuICAgIGlmICh0aGlzLmRlZmF1bHRzLnN0eWxlX3NyYyAhPT0gZmFsc2UpIHtcbiAgICAgIGxldCB1cmwgPSB0aGlzLmRlZmF1bHRzLnN0eWxlX3NyYyB8fCB0aGlzLmRlZmF1bHRzLm9yaWdpbl9zcmMgKyAnL2Rpc3QvJyArIHRoaXMuZGVmYXVsdHMuY3NzRmlsZU5hbWU7XG4gICAgICBpZiAoIWRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignbGlua1tocmVmPVwiJyArIHVybCArICdcIl0nKSl7XG4gICAgICAgIHJldHVybiBmZXRjaFNlcnZpY2UuZmV0Y2hTdHlsZSh1cmwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cbiAgXG4gIHdpZGdldE1haW5FbGVtZW50KGluZGV4KSB7XG4gICAgbGV0IGRhdGEgPSB0aGlzLnN0YXRlc1tpbmRleF07XG4gICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19oZWFkZXJcIj4nICtcbiAgICAgICc8ZGl2IGNsYXNzPVwiJyArICdjcC13aWRnZXRfX2ltZyBjcC13aWRnZXRfX2ltZy0nICsgZGF0YS5jdXJyZW5jeSArICdcIj4nICtcbiAgICAgICc8aW1nLz4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19tYWluXCI+JyArXG4gICAgICAoKGRhdGEuaXNEYXRhKSA/IHRoaXMud2lkZ2V0TWFpbkVsZW1lbnREYXRhKGluZGV4KSA6IHRoaXMud2lkZ2V0TWFpbkVsZW1lbnRNZXNzYWdlKGluZGV4KSkgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzwvZGl2Pic7XG4gIH1cbiAgXG4gIHdpZGdldE1haW5FbGVtZW50RGF0YShpbmRleCkge1xuICAgIGxldCBkYXRhID0gdGhpcy5zdGF0ZXNbaW5kZXhdO1xuICAgIHJldHVybiAnPGgzPjxhIGhyZWY9XCInICsgdGhpcy5jb2luX2xpbmsoZGF0YS5jdXJyZW5jeSkgKyAnXCI+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJuYW1lVGlja2VyXCI+JyArIChkYXRhLnRpY2tlci5uYW1lIHx8IGNwQm9vdHN0cmFwLmVtcHR5RGF0YSkgKyAnPC9zcGFuPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwic3ltYm9sVGlja2VyXCI+JyArIChkYXRhLnRpY2tlci5zeW1ib2wgfHwgY3BCb290c3RyYXAuZW1wdHlEYXRhKSArICc8L3NwYW4+JyArXG4gICAgICAnPC9hPjwvaDM+JyArXG4gICAgICAnPHN0cm9uZz4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInByaWNlVGlja2VyIHBhcnNlTnVtYmVyXCI+JyArIChjcEJvb3RzdHJhcC5wYXJzZU51bWJlcihkYXRhLnRpY2tlci5wcmljZSkgfHwgY3BCb290c3RyYXAuZW1wdHlEYXRhKSArICc8L3NwYW4+ICcgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwicHJpbWFyeUN1cnJlbmN5XCI+JyArIGRhdGEucHJpbWFyeV9jdXJyZW5jeSArICcgPC9zcGFuPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwicHJpY2VfY2hhbmdlXzI0aFRpY2tlciBjcC13aWRnZXRfX3JhbmsgY3Atd2lkZ2V0X19yYW5rLScgKyAoKGRhdGEudGlja2VyLnByaWNlX2NoYW5nZV8yNGggPiAwKSA/IFwidXBcIiA6ICgoZGF0YS50aWNrZXIucHJpY2VfY2hhbmdlXzI0aCA8IDApID8gXCJkb3duXCIgOiBcIm5ldXRyYWxcIikpICsgJ1wiPignICsgKGNwQm9vdHN0cmFwLnJvdW5kKGRhdGEudGlja2VyLnByaWNlX2NoYW5nZV8yNGgsIDIpIHx8IGNwQm9vdHN0cmFwLmVtcHR5VmFsdWUpICsgJyUpPC9zcGFuPicgK1xuICAgICAgJzwvc3Ryb25nPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0X19yYW5rLWxhYmVsXCI+PHNwYW4gY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9yYW5rXCI+JyArIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwicmFua1wiKSArICc8L3NwYW4+IDxzcGFuIGNsYXNzPVwicmFua1RpY2tlclwiPicgKyAoZGF0YS50aWNrZXIucmFuayB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGEpICsgJzwvc3Bhbj48L3NwYW4+JztcbiAgfVxuICBcbiAgd2lkZ2V0TWFpbkVsZW1lbnRNZXNzYWdlKGluZGV4KSB7XG4gICAgbGV0IG1lc3NhZ2UgPSB0aGlzLnN0YXRlc1tpbmRleF0ubWVzc2FnZTtcbiAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX21haW4tbm8tZGF0YSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9tZXNzYWdlXCI+JyArICh0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBtZXNzYWdlKSkgKyAnPC9kaXY+JztcbiAgfVxuICBcbiAgd2lkZ2V0TWFya2V0RGV0YWlsc0VsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCh0aGlzLnN0YXRlc1tpbmRleF0ubW9kdWxlcy5pbmRleE9mKCdtYXJrZXRfZGV0YWlscycpID4gLTEpID8gJzxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX2RldGFpbHNcIj4nICtcbiAgICAgIHRoaXMud2lkZ2V0QXRoRWxlbWVudChpbmRleCkgK1xuICAgICAgdGhpcy53aWRnZXRWb2x1bWUyNGhFbGVtZW50KGluZGV4KSArXG4gICAgICB0aGlzLndpZGdldE1hcmtldENhcEVsZW1lbnQoaW5kZXgpICtcbiAgICAgICc8L2Rpdj4nIDogJycpO1xuICB9XG4gIFxuICB3aWRnZXRBdGhFbGVtZW50KGluZGV4KSB7XG4gICAgcmV0dXJuICc8ZGl2PicgK1xuICAgICAgJzxzbWFsbCBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX2F0aFwiPicgKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcImF0aFwiKSArICc8L3NtYWxsPicgK1xuICAgICAgJzxkaXY+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJwcmljZV9hdGhUaWNrZXIgcGFyc2VOdW1iZXJcIj4nICsgY3BCb290c3RyYXAuZW1wdHlEYXRhICsgJyA8L3NwYW4+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzeW1ib2xUaWNrZXIgc2hvd0RldGFpbHNDdXJyZW5jeVwiPjwvc3Bhbj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInBlcmNlbnRfZnJvbV9wcmljZV9hdGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rXCI+JyArIGNwQm9vdHN0cmFwLmVtcHR5RGF0YSArICc8L3NwYW4+JyArXG4gICAgICAnPC9kaXY+J1xuICB9XG4gIFxuICB3aWRnZXRWb2x1bWUyNGhFbGVtZW50KGluZGV4KSB7XG4gICAgcmV0dXJuICc8ZGl2PicgK1xuICAgICAgJzxzbWFsbCBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX3ZvbHVtZV8yNGhcIj4nICsgdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJ2b2x1bWVfMjRoXCIpICsgJzwvc21hbGw+JyArXG4gICAgICAnPGRpdj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInZvbHVtZV8yNGhUaWNrZXIgcGFyc2VOdW1iZXJcIj4nICsgY3BCb290c3RyYXAuZW1wdHlEYXRhICsgJyA8L3NwYW4+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzeW1ib2xUaWNrZXIgc2hvd0RldGFpbHNDdXJyZW5jeVwiPjwvc3Bhbj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInZvbHVtZV8yNGhfY2hhbmdlXzI0aFRpY2tlciBjcC13aWRnZXRfX3JhbmtcIj4nICsgY3BCb290c3RyYXAuZW1wdHlEYXRhICsgJzwvc3Bhbj4nICtcbiAgICAgICc8L2Rpdj4nO1xuICB9XG4gIFxuICB3aWRnZXRNYXJrZXRDYXBFbGVtZW50KGluZGV4KSB7XG4gICAgcmV0dXJuICc8ZGl2PicgK1xuICAgICAgJzxzbWFsbCBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX21hcmtldF9jYXBcIj4nICsgdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJtYXJrZXRfY2FwXCIpICsgJzwvc21hbGw+JyArXG4gICAgICAnPGRpdj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cIm1hcmtldF9jYXBUaWNrZXIgcGFyc2VOdW1iZXJcIj4nICsgY3BCb290c3RyYXAuZW1wdHlEYXRhICsgJyA8L3NwYW4+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzeW1ib2xUaWNrZXIgc2hvd0RldGFpbHNDdXJyZW5jeVwiPjwvc3Bhbj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cIm1hcmtldF9jYXBfY2hhbmdlXzI0aFRpY2tlciBjcC13aWRnZXRfX3JhbmtcIj4nICsgY3BCb290c3RyYXAuZW1wdHlEYXRhICsgJzwvc3Bhbj4nICtcbiAgICAgICc8L2Rpdj4nO1xuICB9XG4gIFxuICB3aWRnZXRDaGFydEVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFxuICAgICAgYDxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX2NoYXJ0XCI+PGRpdiBpZD1cIiR7IHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lIH0tcHJpY2UtY2hhcnQtJHsgaW5kZXggfVwiPjwvZGl2PjwvZGl2PmBcbiAgICApO1xuICB9XG4gIFxuICB3aWRnZXRTZWxlY3RFbGVtZW50KGluZGV4LCBsYWJlbCl7XG4gICAgbGV0IGJ1dHRvbnMgPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3RhdGVzW2luZGV4XVtsYWJlbCsnX2xpc3QnXS5sZW5ndGg7IGkrKyl7XG4gICAgICBsZXQgZGF0YSA9IHRoaXMuc3RhdGVzW2luZGV4XVtsYWJlbCsnX2xpc3QnXVtpXTtcbiAgICAgIGJ1dHRvbnMgKz0gJzxidXR0b24gY2xhc3M9XCInKyAoKGRhdGEudG9Mb3dlckNhc2UoKSA9PT0gdGhpcy5zdGF0ZXNbaW5kZXhdW2xhYmVsXS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICA/ICdjcC13aWRnZXQtYWN0aXZlICdcbiAgICAgICAgOiAnJykgKyAoKGxhYmVsID09PSAncHJpbWFyeV9jdXJyZW5jeScpID8gJycgOiAnY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fJyArIGRhdGEudG9Mb3dlckNhc2UoKSkgKydcIiBkYXRhLW9wdGlvbj1cIicrZGF0YSsnXCI+Jyt0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBkYXRhLnRvTG93ZXJDYXNlKCkpKyc8L2J1dHRvbj4nXG4gICAgfVxuICAgIGlmIChsYWJlbCA9PT0gJ3JhbmdlJykgO1xuICAgIGxldCB0aXRsZSA9IHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwiem9vbV9pblwiKTtcbiAgICByZXR1cm4gJzxkaXYgZGF0YS10eXBlPVwiJytsYWJlbCsnXCIgY2xhc3M9XCJjcC13aWRnZXQtc2VsZWN0XCI+JyArXG4gICAgICAnPGxhYmVsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fJysgbGFiZWwgKydcIj4nK3RpdGxlKyc8L2xhYmVsPicgK1xuICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtc2VsZWN0X19vcHRpb25zXCI+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJhcnJvdy1kb3duICcrICdjcC13aWRnZXRfX2NhcGl0YWxpemUgY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fJyArIHRoaXMuc3RhdGVzW2luZGV4XVtsYWJlbF0udG9Mb3dlckNhc2UoKSArJ1wiPicrIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIHRoaXMuc3RhdGVzW2luZGV4XVtsYWJlbF0udG9Mb3dlckNhc2UoKSkgKyc8L3NwYW4+JyArXG4gICAgICAnPGRpdiBjbGFzcz1cImNwLXdpZGdldC1zZWxlY3RfX2Ryb3Bkb3duXCI+JyArXG4gICAgICBidXR0b25zICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nO1xuICB9XG4gIFxuICB3aWRnZXRGb290ZXIoaW5kZXgpIHtcbiAgICBsZXQgY3VycmVuY3kgPSB0aGlzLnN0YXRlc1tpbmRleF0uY3VycmVuY3k7XG4gICAgcmV0dXJuICghdGhpcy5zdGF0ZXNbaW5kZXhdLmlzV29yZHByZXNzKVxuICAgICAgPyAnPHAgY2xhc3M9XCJjcC13aWRnZXRfX2Zvb3RlciBjcC13aWRnZXRfX2Zvb3Rlci0tJyArIGluZGV4ICsgJ1wiPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fcG93ZXJlZF9ieVwiPicgKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInBvd2VyZWRfYnlcIikgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8aW1nIHN0eWxlPVwid2lkdGg6IDE2cHhcIiBzcmM9XCInICsgdGhpcy5tYWluX2xvZ29fbGluaygpICsgJ1wiIGFsdD1cIlwiLz4nICtcbiAgICAgICc8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJyArIHRoaXMuY29pbl9saW5rKGN1cnJlbmN5KSArICdcIj5jb2lucGFwcmlrYS5jb208L2E+JyArXG4gICAgICAnPC9wPidcbiAgICAgIDogJyc7XG4gIH1cbiAgXG4gIGdldEltYWdlKGluZGV4KSB7XG4gICAgbGV0IGRhdGEgPSB0aGlzLnN0YXRlc1tpbmRleF07XG4gICAgbGV0IGltZ0NvbnRhaW5lcnMgPSBkYXRhLm1haW5FbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NwLXdpZGdldF9faW1nJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbWdDb250YWluZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgaW1nQ29udGFpbmVyID0gaW1nQ29udGFpbmVyc1tpXTtcbiAgICAgIGltZ0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjcC13aWRnZXRfX2ltZy0taGlkZGVuJyk7XG4gICAgICBsZXQgaW1nID0gaW1nQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpO1xuICAgICAgbGV0IG5ld0ltZyA9IG5ldyBJbWFnZTtcbiAgICAgIG5ld0ltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIGltZy5zcmMgPSBuZXdJbWcuc3JjO1xuICAgICAgICBpbWdDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19pbWctLWhpZGRlbicpO1xuICAgICAgfTtcbiAgICAgIG5ld0ltZy5zcmMgPSB0aGlzLmltZ19zcmMoZGF0YS5jdXJyZW5jeSk7XG4gICAgfVxuICB9XG4gIFxuICBpbWdfc3JjKGlkKSB7XG4gICAgcmV0dXJuICdodHRwczovL2NvaW5wYXByaWthLmNvbS9jb2luLycgKyBpZCArICcvbG9nby5wbmcnO1xuICB9XG4gIFxuICBjb2luX2xpbmsoaWQpIHtcbiAgICByZXR1cm4gJ2h0dHBzOi8vY29pbnBhcHJpa2EuY29tL2NvaW4vJyArIGlkXG4gIH1cbiAgXG4gIG1haW5fbG9nb19saW5rKCkge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRzLmltZ19zcmMgfHwgdGhpcy5kZWZhdWx0cy5vcmlnaW5fc3JjICsgJy9kaXN0L2ltZy9sb2dvX3dpZGdldC5zdmcnXG4gIH1cbiAgXG4gIGdldFNjcmlwdEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NjcmlwdFtkYXRhLWNwLWN1cnJlbmN5LXdpZGdldF0nKTtcbiAgfVxuICBcbiAgZ2V0VHJhbnNsYXRpb24oaW5kZXgsIGxhYmVsKSB7XG4gICAgbGV0IHRleHQgPSAodGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbdGhpcy5zdGF0ZXNbaW5kZXhdLmxhbmd1YWdlXSkgPyB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1t0aGlzLnN0YXRlc1tpbmRleF0ubGFuZ3VhZ2VdW2xhYmVsXSA6IG51bGw7XG4gICAgaWYgKCF0ZXh0ICYmIHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zWydlbiddKSB7XG4gICAgICB0ZXh0ID0gdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbJ2VuJ11bbGFiZWxdO1xuICAgIH1cbiAgICBpZiAoIXRleHQpIHtcbiAgICAgIHJldHVybiB0aGlzLmFkZExhYmVsV2l0aG91dFRyYW5zbGF0aW9uKGluZGV4LCBsYWJlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuICBcbiAgYWRkTGFiZWxXaXRob3V0VHJhbnNsYXRpb24oaW5kZXgsIGxhYmVsKSB7XG4gICAgaWYgKCF0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1snZW4nXSkgdGhpcy5nZXRUcmFuc2xhdGlvbnMoJ2VuJyk7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGVzW2luZGV4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLnB1c2gobGFiZWwpO1xuICB9XG4gIFxuICBnZXRUcmFuc2xhdGlvbnMobGFuZykge1xuICAgIGlmICghdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ10pIHtcbiAgICAgIGNvbnN0IHVybCA9IHRoaXMuZGVmYXVsdHMubGFuZ19zcmMgfHwgdGhpcy5kZWZhdWx0cy5vcmlnaW5fc3JjICsgJy9kaXN0L2xhbmcvJyArIGxhbmcgKyAnLmpzb24nO1xuICAgICAgdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ10gPSB7fTtcbiAgICAgIHJldHVybiBmZXRjaFNlcnZpY2UuZmV0Y2hKc29uRmlsZSh1cmwsIHRydWUpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICAgIHRoaXMudXBkYXRlV2lkZ2V0VHJhbnNsYXRpb25zKGxhbmcsIHJlc3BvbnNlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9uRXJyb3JSZXF1ZXN0KDAsIHVybCArIHJlc3BvbnNlKTtcbiAgICAgICAgICB0aGlzLmdldFRyYW5zbGF0aW9ucygnZW4nKTtcbiAgICAgICAgICBkZWxldGUgdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ107XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgXG4gICAgfVxuICB9XG59XG5cbmNsYXNzIGNoYXJ0Q2xhc3Mge1xuICBjb25zdHJ1Y3Rvcihjb250YWluZXIsIHN0YXRlKXtcbiAgICBpZiAoIWNvbnRhaW5lcikgcmV0dXJuO1xuICAgIHRoaXMuaWQgPSBjb250YWluZXIuaWQ7XG4gICAgdGhpcy5pc05pZ2h0TW9kZSA9IHN0YXRlLmlzTmlnaHRNb2RlO1xuICAgIHRoaXMuY2hhcnRzV2l0aEFjdGl2ZVNlcmllc0Nvb2tpZXMgPSBbXTtcbiAgICB0aGlzLmNoYXJ0ID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbmN5ID0gc3RhdGUuY3VycmVuY3k7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5vcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKCk7XG4gICAgdGhpcy5kZWZhdWx0UmFuZ2UgPSBzdGF0ZS5yYW5nZSB8fCAnN2QnO1xuICAgIHRoaXMuY2FsbGJhY2sgPSBudWxsO1xuICAgIHRoaXMucmVwbGFjZUNhbGxiYWNrID0gbnVsbDtcbiAgICB0aGlzLmV4dHJlbWVzRGF0YVVybCA9IHRoaXMuZ2V0RXh0cmVtZXNEYXRhVXJsKGNvbnRhaW5lci5pZCk7XG4gICAgdGhpcy5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIGNoYXJ0OiB7XG4gICAgICAgIGFsaWduVGlja3M6IGZhbHNlLFxuICAgICAgICBtYXJnaW5Ub3A6IDUwLFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIGZvbnRGYW1pbHk6ICdzYW5zLXNlcmlmJyxcbiAgICAgICAgfSxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgcmVuZGVyOiAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGUudGFyZ2V0LmFubm90YXRpb25zKSB7XG4gICAgICAgICAgICAgIGxldCBjaGFydCA9IGUudGFyZ2V0LmFubm90YXRpb25zLmNoYXJ0O1xuICAgICAgICAgICAgICBjcEJvb3RzdHJhcC5sb29wKGNoYXJ0LmFubm90YXRpb25zLmFsbEl0ZW1zLCBhbm5vdGF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgeSA9IGNoYXJ0LnBsb3RIZWlnaHQgKyBjaGFydC5wbG90VG9wIC0gY2hhcnQuc3BhY2luZ1swXSAtIDIgLSAoKHRoaXMuaXNSZXNwb25zaXZlTW9kZUFjdGl2ZShjaGFydCkpID8gMTAgOiAwKTtcbiAgICAgICAgICAgICAgICBhbm5vdGF0aW9uLnVwZGF0ZSh7eX0sIHRydWUpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHNjcm9sbGJhcjoge1xuICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICBhbm5vdGF0aW9uc09wdGlvbnM6IHtcbiAgICAgICAgZW5hYmxlZEJ1dHRvbnM6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHJhbmdlU2VsZWN0b3I6IHtcbiAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICB9LFxuICAgICAgcGxvdE9wdGlvbnM6IHtcbiAgICAgICAgbGluZToge1xuICAgICAgICAgIHNlcmllczoge1xuICAgICAgICAgICAgc3RhdGVzOiB7XG4gICAgICAgICAgICAgIGhvdmVyOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHNlcmllczoge1xuICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgbGVnZW5kSXRlbUNsaWNrOiAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGV2ZW50LmJyb3dzZXJFdmVudC5pc1RydXN0ZWQpe1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXJ0c1dpdGhBY3RpdmVTZXJpZXNDb29raWVzLmluZGV4T2YoZXZlbnQudGFyZ2V0LmNoYXJ0LnJlbmRlclRvLmlkKSA+IC0xKSB0aGlzLnNldFZpc2libGVDaGFydENvb2tpZXMoZXZlbnQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIE9uIGlPUyB0b3VjaCBldmVudCBmaXJlcyBzZWNvbmQgY2FsbGJhY2sgZnJvbSBKUyAoaXNUcnVzdGVkOiBmYWxzZSkgd2hpY2hcbiAgICAgICAgICAgICAgLy8gcmVzdWx0cyB3aXRoIHRvZ2dsZSBiYWNrIHRoZSBjaGFydCAocHJvYmFibHkgaXRzIGEgcHJvYmxlbSB3aXRoIFVJS2l0LCBidXQgbm90IHN1cmUpXG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdsZWdlbmRJdGVtQ2xpY2snLCB7ZXZlbnQsIGlzVHJ1c3RlZDogZXZlbnQuYnJvd3NlckV2ZW50LmlzVHJ1c3RlZH0pO1xuICAgICAgICAgICAgICByZXR1cm4gZXZlbnQuYnJvd3NlckV2ZW50LmlzVHJ1c3RlZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHhBeGlzOiB7XG4gICAgICAgIG9yZGluYWw6IGZhbHNlXG4gICAgICB9XG4gICAgfTtcbiAgICB0aGlzLmNoYXJ0RGF0YVBhcnNlciA9IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgZGF0YSA9IGRhdGFbMF07XG4gICAgICAgIGNvbnN0IHByaWNlQ3VycmVuY3kgPSBzdGF0ZS5wcmltYXJ5X2N1cnJlbmN5LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHJldHVybiByZXNvbHZlKHtcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBwcmljZTogKGRhdGEucHJpY2UpXG4gICAgICAgICAgICAgID8gZGF0YS5wcmljZVxuICAgICAgICAgICAgICA6ICgoZGF0YVtwcmljZUN1cnJlbmN5XSlcbiAgICAgICAgICAgICAgICA/IGRhdGFbcHJpY2VDdXJyZW5jeV1cbiAgICAgICAgICAgICAgICA6IFtdKSxcbiAgICAgICAgICAgIHZvbHVtZTogZGF0YS52b2x1bWUgfHwgW10sXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdGhpcy5pc0V2ZW50c0hpZGRlbiA9IGZhbHNlO1xuICAgIHRoaXMuZXhjbHVkZVNlcmllc0lkcyA9IFtdO1xuICAgIHRoaXMuYXN5bmNVcmwgPSBgL2N1cnJlbmN5L2RhdGEvJHsgc3RhdGUuY3VycmVuY3kgfS9fcmFuZ2VfL2A7XG4gICAgdGhpcy5hc3luY1BhcmFtcyA9IGA/cXVvdGU9JHsgc3RhdGUucHJpbWFyeV9jdXJyZW5jeS50b1VwcGVyQ2FzZSgpIH0mZmllbGRzPXByaWNlLHZvbHVtZWA7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cbiAgXG4gIHNldE9wdGlvbnMoKXtcbiAgICBjb25zdCBjaGFydFNlcnZpY2UgPSBuZXcgY2hhcnRDbGFzcygpO1xuICAgIHJldHVybiB7XG4gICAgICByZXNwb25zaXZlOiB7XG4gICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgIG1heFdpZHRoOiAxNTAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoYXJ0T3B0aW9uczoge1xuICAgICAgICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgICAgICBhbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJyxcbiAgICAgICAgICAgICAgICB5OiA5MixcbiAgICAgICAgICAgICAgICBzeW1ib2xSYWRpdXM6IDAsXG4gICAgICAgICAgICAgICAgaXRlbURpc3RhbmNlOiAyMCxcbiAgICAgICAgICAgICAgICBpdGVtU3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDQwMCxcbiAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IDM1LFxuICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogMCxcbiAgICAgICAgICAgICAgICBzcGFjaW5nVG9wOiAwLFxuICAgICAgICAgICAgICAgIHNwYWNpbmdCb3R0b206IDAsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG5hdmlnYXRvcjoge1xuICAgICAgICAgICAgICAgIGhlaWdodDogNTAsXG4gICAgICAgICAgICAgICAgbWFyZ2luOiA3MCxcbiAgICAgICAgICAgICAgICBoYW5kbGVzOiB7XG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6IDI1LFxuICAgICAgICAgICAgICAgICAgd2lkdGg6IDE3LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgIG1heFdpZHRoOiA2MDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hhcnRPcHRpb25zOiB7XG4gICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgbWFyZ2luVG9wOiAwLFxuICAgICAgICAgICAgICAgIHpvb21UeXBlOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICBtYXJnaW5MZWZ0OiAxMCxcbiAgICAgICAgICAgICAgICBtYXJnaW5SaWdodDogMTAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzNTAsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHlBeGlzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgZmxvb3I6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrQW1vdW50OiA3LFxuICAgICAgICAgICAgICAgICAgdGlja1dpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0xlbmd0aDogMCxcbiAgICAgICAgICAgICAgICAgIGxpbmVXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgICAgICAgICAgIGFsaWduOiBcImxlZnRcIixcbiAgICAgICAgICAgICAgICAgICAgeDogMSxcbiAgICAgICAgICAgICAgICAgICAgeTogLTIsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjOWU5ZTllJyxcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzlweCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tBbW91bnQ6IDcsXG4gICAgICAgICAgICAgICAgICB0aWNrV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrTGVuZ3RoOiAwLFxuICAgICAgICAgICAgICAgICAgbGluZVdpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgYWxpZ246IFwicmlnaHRcIixcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IFwianVzdGlmeVwiLFxuICAgICAgICAgICAgICAgICAgICB4OiAxLFxuICAgICAgICAgICAgICAgICAgICB5OiAtMixcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM1MDg1ZWMnLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnOXB4JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbmRpdGlvbjoge1xuICAgICAgICAgICAgICBtYXhXaWR0aDogNDUwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hhcnRPcHRpb25zOiB7XG4gICAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgIGFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuICAgICAgICAgICAgICAgIHk6IDgyLFxuICAgICAgICAgICAgICAgIHN5bWJvbFJhZGl1czogMCxcbiAgICAgICAgICAgICAgICBpdGVtRGlzdGFuY2U6IDIwLFxuICAgICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBuYXZpZ2F0b3I6IHtcbiAgICAgICAgICAgICAgICBtYXJnaW46IDYwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogNDAsXG4gICAgICAgICAgICAgICAgaGFuZGxlczoge1xuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMDAsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHlBeGlzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgZmxvb3I6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrQW1vdW50OiA3LFxuICAgICAgICAgICAgICAgICAgdGlja1dpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0xlbmd0aDogMCxcbiAgICAgICAgICAgICAgICAgIGxpbmVXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgICAgICAgICAgIGFsaWduOiBcImxlZnRcIixcbiAgICAgICAgICAgICAgICAgICAgeDogMSxcbiAgICAgICAgICAgICAgICAgICAgeTogLTIsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjOWU5ZTllJyxcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzlweCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tBbW91bnQ6IDcsXG4gICAgICAgICAgICAgICAgICB0aWNrV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrTGVuZ3RoOiAwLFxuICAgICAgICAgICAgICAgICAgbGluZVdpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgYWxpZ246IFwicmlnaHRcIixcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IFwianVzdGlmeVwiLFxuICAgICAgICAgICAgICAgICAgICB4OiAxLFxuICAgICAgICAgICAgICAgICAgICB5OiAtMixcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM1MDg1ZWMnLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnOXB4JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB0aXRsZToge1xuICAgICAgICB0ZXh0OiB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgICAgY2hhcnQ6IHtcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnbm9uZScsXG4gICAgICAgIG1hcmdpblRvcDogNTAsXG4gICAgICAgIHBsb3RCb3JkZXJXaWR0aDogMCxcbiAgICAgIH0sXG4gICAgICBjcEV2ZW50czogZmFsc2UsXG4gICAgICBjb2xvcnM6IFtcbiAgICAgICAgJyM1MDg1ZWMnLFxuICAgICAgICAnIzFmOTgwOScsXG4gICAgICAgICcjOTg1ZDY1JyxcbiAgICAgICAgJyNlZTk4M2InLFxuICAgICAgICAnIzRjNGM0YycsXG4gICAgICBdLFxuICAgICAgbGVnZW5kOiB7XG4gICAgICAgIG1hcmdpbjogMCxcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgYWxpZ246ICdyaWdodCcsXG4gICAgICAgIHN5bWJvbFJhZGl1czogMCxcbiAgICAgICAgaXRlbURpc3RhbmNlOiA0MCxcbiAgICAgICAgaXRlbVN0eWxlOiB7XG4gICAgICAgICAgZm9udFdlaWdodDogJ25vcm1hbCcsXG4gICAgICAgICAgY29sb3I6ICh0aGlzLmlzTmlnaHRNb2RlKSA/ICcjODBhNmU1JyA6ICcjMDY0NWFkJyxcbiAgICAgICAgfSxcbiAgICAgICAgaXRlbU1hcmdpblRvcDogOCxcbiAgICAgIH0sXG4gICAgICBuYXZpZ2F0b3I6IHRydWUsXG4gICAgICB0b29sdGlwOiB7XG4gICAgICAgIHNoYXJlZDogdHJ1ZSxcbiAgICAgICAgc3BsaXQ6IGZhbHNlLFxuICAgICAgICBhbmltYXRpb246IGZhbHNlLFxuICAgICAgICBib3JkZXJXaWR0aDogMSxcbiAgICAgICAgYm9yZGVyQ29sb3I6ICh0aGlzLmlzTmlnaHRNb2RlKSA/ICcjNGM0YzRjJyA6ICcjZTNlM2UzJyxcbiAgICAgICAgaGlkZURlbGF5OiAxMDAsXG4gICAgICAgIHNoYWRvdzogZmFsc2UsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIGNvbG9yOiAnIzRjNGM0YycsXG4gICAgICAgICAgZm9udFNpemU6ICcxMHB4JyxcbiAgICAgICAgfSxcbiAgICAgICAgdXNlSFRNTDogdHJ1ZSxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiBjaGFydFNlcnZpY2UudG9vbHRpcEZvcm1hdHRlcih0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBcbiAgICAgIGV4cG9ydGluZzoge1xuICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgY29udGV4dEJ1dHRvbjoge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcbiAgICAgIHhBeGlzOiB7XG4gICAgICAgIGxpbmVDb2xvcjogKHRoaXMuaXNOaWdodE1vZGUpID8gJyM1MDUwNTAnIDogJyNlM2UzZTMnLFxuICAgICAgICB0aWNrQ29sb3I6ICh0aGlzLmlzTmlnaHRNb2RlKSA/ICcjNTA1MDUwJyA6ICcjZTNlM2UzJyxcbiAgICAgICAgdGlja0xlbmd0aDogNyxcbiAgICAgIH0sXG4gICAgICBcbiAgICAgIHlBeGlzOiBbeyAvLyBWb2x1bWUgeUF4aXNcbiAgICAgICAgbGluZVdpZHRoOiAxLFxuICAgICAgICBsaW5lQ29sb3I6ICcjZGVkZWRlJyxcbiAgICAgICAgdGlja1dpZHRoOiAxLFxuICAgICAgICB0aWNrTGVuZ3RoOiA0LFxuICAgICAgICBncmlkTGluZURhc2hTdHlsZTogJ2Rhc2gnLFxuICAgICAgICBncmlkTGluZVdpZHRoOiAwLFxuICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgbWluUGFkZGluZzogMCxcbiAgICAgICAgb3Bwb3NpdGU6IGZhbHNlLFxuICAgICAgICBzaG93RW1wdHk6IGZhbHNlLFxuICAgICAgICBzaG93TGFzdExhYmVsOiBmYWxzZSxcbiAgICAgICAgc2hvd0ZpcnN0TGFiZWw6IGZhbHNlLFxuICAgICAgfSwge1xuICAgICAgICBncmlkTGluZUNvbG9yOiAodGhpcy5pc05pZ2h0TW9kZSkgPyAnIzUwNTA1MCcgOiAnI2UzZTNlMycsXG4gICAgICAgIGdyaWRMaW5lRGFzaFN0eWxlOiAnZGFzaCcsXG4gICAgICAgIGxpbmVXaWR0aDogMSxcbiAgICAgICAgdGlja1dpZHRoOiAxLFxuICAgICAgICB0aWNrTGVuZ3RoOiA0LFxuICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgbWluUGFkZGluZzogMCxcbiAgICAgICAgc2hvd0VtcHR5OiBmYWxzZSxcbiAgICAgICAgb3Bwb3NpdGU6IHRydWUsXG4gICAgICAgIGdyaWRaSW5kZXg6IDQsXG4gICAgICAgIHNob3dMYXN0TGFiZWw6IGZhbHNlLFxuICAgICAgICBzaG93Rmlyc3RMYWJlbDogZmFsc2UsXG4gICAgICB9XSxcbiAgICAgIFxuICAgICAgc2VyaWVzOiBbXG4gICAgICAgIHsgLy9vcmRlciBvZiB0aGUgc2VyaWVzIG1hdHRlcnNcbiAgICAgICAgICBjb2xvcjogJyM1MDg1ZWMnLFxuICAgICAgICAgIG5hbWU6ICdQcmljZScsXG4gICAgICAgICAgaWQ6ICdwcmljZScsXG4gICAgICAgICAgZGF0YTogW10sXG4gICAgICAgICAgdHlwZTogJ2FyZWEnLFxuICAgICAgICAgIGZpbGxPcGFjaXR5OiAwLjE1LFxuICAgICAgICAgIGxpbmVXaWR0aDogMixcbiAgICAgICAgICB5QXhpczogMSxcbiAgICAgICAgICB6SW5kZXg6IDIsXG4gICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICBjbGlja2FibGU6IHRydWUsXG4gICAgICAgICAgdGhyZXNob2xkOiBudWxsLFxuICAgICAgICAgIHRvb2x0aXA6IHtcbiAgICAgICAgICAgIHZhbHVlRGVjaW1hbHM6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNob3dJbk5hdmlnYXRvcjogdHJ1ZSxcbiAgICAgICAgICBzaG93SW5MZWdlbmQ6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgY29sb3I6IGB1cmwoI2ZpbGwtcGF0dGVybiR7KHRoaXMuaXNOaWdodE1vZGUpID8gJy1uaWdodCcgOiAnJ30pYCxcbiAgICAgICAgICBuYW1lOiAnVm9sdW1lJyxcbiAgICAgICAgICBpZDogJ3ZvbHVtZScsXG4gICAgICAgICAgZGF0YTogW10sXG4gICAgICAgICAgdHlwZTogJ2FyZWEnLFxuICAgICAgICAgIGZpbGxPcGFjaXR5OiAwLjUsXG4gICAgICAgICAgbGluZVdpZHRoOiAwLFxuICAgICAgICAgIHlBeGlzOiAwLFxuICAgICAgICAgIHpJbmRleDogMCxcbiAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgIGNsaWNrYWJsZTogdHJ1ZSxcbiAgICAgICAgICB0aHJlc2hvbGQ6IG51bGwsXG4gICAgICAgICAgdG9vbHRpcDoge1xuICAgICAgICAgICAgdmFsdWVEZWNpbWFsczogMCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNob3dJbk5hdmlnYXRvcjogdHJ1ZSxcbiAgICAgICAgfV1cbiAgICB9XG4gIH1cbiAgXG4gIGluaXQoKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2VPcHRpb25zKHRoaXMub3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigob3B0aW9ucykgPT4ge1xuICAgICAgcmV0dXJuICh3aW5kb3cuSGlnaGNoYXJ0cykgPyBIaWdoY2hhcnRzLnN0b2NrQ2hhcnQodGhpcy5jb250YWluZXIuaWQsIG9wdGlvbnMsIChjaGFydCkgPT4gdGhpcy5iaW5kKGNoYXJ0KSkgOiBudWxsO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBwYXJzZU9wdGlvbnMob3B0aW9ucyl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC51cGRhdGVPYmplY3QodGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigobmV3T3B0aW9ucykgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLnVwZGF0ZU9iamVjdCh0aGlzLmdldFZvbHVtZVBhdHRlcm4oKSwgbmV3T3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigobmV3T3B0aW9ucykgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0TmF2aWdhdG9yKG5ld09wdGlvbnMpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKG5ld09wdGlvbnMpID0+IHtcbiAgICAgIHJldHVybiAobmV3T3B0aW9ucy5ub0RhdGEpID8gdGhpcy5zZXROb0RhdGFMYWJlbChuZXdPcHRpb25zKSA6IG5ld09wdGlvbnM7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigobmV3T3B0aW9ucykgPT4ge1xuICAgICAgcmV0dXJuIG5ld09wdGlvbnM7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGJpbmQoY2hhcnQpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFydCA9IGNoYXJ0O1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hEYXRhUGFja2FnZSgpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0UmFuZ2VTd2l0Y2hlcigpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuICh0aGlzLmNhbGxiYWNrKSA/IHRoaXMuY2FsbGJhY2sodGhpcy5jaGFydCwgdGhpcy5kZWZhdWx0UmFuZ2UpIDogbnVsbDtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgZmV0Y2hEYXRhUGFja2FnZShtaW5EYXRlLCBtYXhEYXRlKXtcbiAgICBsZXQgaXNQcmVjaXNlUmFuZ2UgPSAobWluRGF0ZSAmJiBtYXhEYXRlKTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5jcEV2ZW50cyl7XG4gICAgICAgIGxldCB1cmwgPSAoaXNQcmVjaXNlUmFuZ2UpID8gdGhpcy5nZXROYXZpZ2F0b3JFeHRyZW1lc1VybChtaW5EYXRlLCBtYXhEYXRlLCAnZXZlbnRzJykgOiB0aGlzLmdldEV4dHJlbWVzRGF0YVVybCh0aGlzLmlkLCAnZXZlbnRzJykgKyAnLycgKyB0aGlzLmdldFJhbmdlKCkgKyAnLyc7XG4gICAgICAgIHJldHVybiAodXJsKSA/IHRoaXMuZmV0Y2hEYXRhKHVybCwgJ2V2ZW50cycsICFpc1ByZWNpc2VSYW5nZSkgOiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBsZXQgdXJsID0gKChpc1ByZWNpc2VSYW5nZSkgPyB0aGlzLmdldE5hdmlnYXRvckV4dHJlbWVzVXJsKG1pbkRhdGUsIG1heERhdGUpIDogdGhpcy5hc3luY1VybC5yZXBsYWNlKCdfcmFuZ2VfJywgdGhpcy5nZXRSYW5nZSgpKSkgKyB0aGlzLmFzeW5jUGFyYW1zO1xuICAgICAgcmV0dXJuICh1cmwpID8gdGhpcy5mZXRjaERhdGEodXJsLCAnZGF0YScsICFpc1ByZWNpc2VSYW5nZSkgOiBudWxsO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhcnQucmVkcmF3KGZhbHNlKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiAoIWlzUHJlY2lzZVJhbmdlKSA/IHRoaXMuY2hhcnQuem9vbU91dCgpIDogbnVsbDtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmlzTG9hZGVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnRvZ2dsZUV2ZW50cygpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBmZXRjaERhdGEodXJsLCBkYXRhVHlwZSA9ICdkYXRhJywgcmVwbGFjZSA9IHRydWUpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLmNoYXJ0LnNob3dMb2FkaW5nKCk7XG4gICAgICByZXR1cm4gZmV0Y2hTZXJ2aWNlLmZldGNoQ2hhcnREYXRhKHVybCwgIXRoaXMuaXNMb2FkZWQpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICB0aGlzLmNoYXJ0LmhpZGVMb2FkaW5nKCk7XG4gICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGBMb29rcyBsaWtlIHRoZXJlIHdhcyBhIHByb2JsZW0uIFN0YXR1cyBDb2RlOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihkYXRhID0+IHtcbiAgICAgICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVBhcnNlcihkYXRhLCBkYXRhVHlwZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChjb250ZW50KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChyZXBsYWNlKSA/IHRoaXMucmVwbGFjZURhdGEoY29udGVudC5kYXRhLCBkYXRhVHlwZSkgOiB0aGlzLnVwZGF0ZURhdGEoY29udGVudC5kYXRhLCBkYXRhVHlwZSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgdGhpcy5jaGFydC5oaWRlTG9hZGluZygpO1xuICAgICAgdGhpcy5oaWRlQ2hhcnQoKTtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygnRmV0Y2ggRXJyb3InLCBlcnJvcik7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGhpZGVDaGFydChib29sID0gdHJ1ZSl7XG4gICAgY29uc3QgY2xhc3NGdW5jID0gKGJvb2wpID8gJ2FkZCcgOiAncmVtb3ZlJztcbiAgICBjb25zdCBzaWJsaW5ncyA9IGNwQm9vdHN0cmFwLm5vZGVMaXN0VG9BcnJheSh0aGlzLmNvbnRhaW5lci5wYXJlbnRFbGVtZW50LmNoaWxkTm9kZXMpO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gc2libGluZ3MuZmlsdGVyKGVsZW1lbnQgPT4gZWxlbWVudC5pZC5zZWFyY2goJ2NoYXJ0JykgPT09IC0xKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKHJlc3VsdCwgZWxlbWVudCA9PiBlbGVtZW50LmNsYXNzTGlzdFtjbGFzc0Z1bmNdKCdjcC1oaWRkZW4nKSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5jb250YWluZXIucGFyZW50RWxlbWVudC5jbGFzc0xpc3RbY2xhc3NGdW5jXSgnY3AtY2hhcnQtbm8tZGF0YScpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBzZXRSYW5nZVN3aXRjaGVyKCl7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihgJHsgdGhpcy5pZCB9LXN3aXRjaC1yYW5nZWAsIChldmVudCkgPT4ge1xuICAgICAgdGhpcy5kZWZhdWx0UmFuZ2UgPSBldmVudC5kZXRhaWwuZGF0YTtcbiAgICAgIHJldHVybiB0aGlzLmZldGNoRGF0YVBhY2thZ2UoKTtcbiAgICB9KTtcbiAgfVxuICBcbiAgZ2V0UmFuZ2UoKXtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0UmFuZ2UgfHwgJzFxJztcbiAgfVxuICBcbiAgdG9nZ2xlRXZlbnRzKCl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBpZiAodGhpcy5vcHRpb25zLmNwRXZlbnRzKXtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaGlnaGNoYXJ0cy1hbm5vdGF0aW9uJyk7XG4gICAgICB9KTtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGVsZW1lbnRzKSA9PiB7XG4gICAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKGVsZW1lbnRzLCBlbGVtZW50ID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5pc0V2ZW50c0hpZGRlbil7XG4gICAgICAgICAgICByZXR1cm4gKCFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaGlnaGNoYXJ0cy1hbm5vdGF0aW9uX19oaWRkZW4nKSkgPyBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZ2hjaGFydHMtYW5ub3RhdGlvbl9faGlkZGVuJykgOiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWdoY2hhcnRzLWFubm90YXRpb25fX2hpZGRlbicpKSA/IGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGNoYXJ0cy1hbm5vdGF0aW9uX19oaWRkZW4nKSA6IG51bGw7XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaGlnaGNoYXJ0cy1wbG90LWxpbmUnKTtcbiAgICAgIH0pO1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoZWxlbWVudHMpID0+IHtcbiAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AoZWxlbWVudHMsIGVsZW1lbnQgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmlzRXZlbnRzSGlkZGVuKXtcbiAgICAgICAgICAgIHJldHVybiAoIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWdoY2hhcnRzLXBsb3QtbGluZV9faGlkZGVuJykpID8gZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWdoY2hhcnRzLXBsb3QtbGluZV9faGlkZGVuJykgOiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWdoY2hhcnRzLXBsb3QtbGluZV9faGlkZGVuJykpID8gZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdoY2hhcnRzLXBsb3QtbGluZV9faGlkZGVuJykgOiBudWxsO1xuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBkYXRhUGFyc2VyKGRhdGEsIGRhdGFUeXBlID0gJ2RhdGEnKXtcbiAgICBzd2l0Y2ggKGRhdGFUeXBlKXtcbiAgICAgIGNhc2UgJ2RhdGEnOlxuICAgICAgICBsZXQgcHJvbWlzZURhdGEgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgcHJvbWlzZURhdGEgPSBwcm9taXNlRGF0YS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gKHRoaXMuY2hhcnREYXRhUGFyc2VyKSA/IHRoaXMuY2hhcnREYXRhUGFyc2VyKGRhdGEpIDoge1xuICAgICAgICAgICAgZGF0YTogZGF0YVswXSxcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2VEYXRhO1xuICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShkYXRhKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuICBcbiAgdXBkYXRlRGF0YShkYXRhLCBkYXRhVHlwZSkge1xuICAgIGxldCBuZXdEYXRhO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBzd2l0Y2ggKGRhdGFUeXBlKSB7XG4gICAgICAgIGNhc2UgJ2RhdGEnOlxuICAgICAgICAgIG5ld0RhdGEgPSB7fTtcbiAgICAgICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChPYmplY3QuZW50cmllcyhkYXRhKSwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0V4Y2x1ZGVkKHZhbHVlWzBdKSkgcmV0dXJuO1xuICAgICAgICAgICAgbGV0IG9sZERhdGEgPSB0aGlzLmdldE9sZERhdGEoZGF0YVR5cGUpW3ZhbHVlWzBdXTtcbiAgICAgICAgICAgIG5ld0RhdGFbdmFsdWVbMF1dID0gb2xkRGF0YVxuICAgICAgICAgICAgICAuZmlsdGVyKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlWzFdLmZpbmRJbmRleChmaW5kRWxlbWVudCA9PiB0aGlzLmlzVGhlU2FtZUVsZW1lbnQoZWxlbWVudCwgZmluZEVsZW1lbnQsIGRhdGFUeXBlKSkgPT09IC0xO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuY29uY2F0KHZhbHVlWzFdKVxuICAgICAgICAgICAgICAuc29ydCgoZGF0YTEsIGRhdGEyKSA9PiB0aGlzLnNvcnRDb25kaXRpb24oZGF0YTEsIGRhdGEyLCBkYXRhVHlwZSkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICAgIG5ld0RhdGEgPSBbXTtcbiAgICAgICAgICBsZXQgb2xkRGF0YSA9IHRoaXMuZ2V0T2xkRGF0YShkYXRhVHlwZSk7XG4gICAgICAgICAgcmV0dXJuIG5ld0RhdGEgPSBvbGREYXRhXG4gICAgICAgICAgICAuZmlsdGVyKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgIGRhdGEuZmluZEluZGV4KGZpbmRFbGVtZW50ID0+IHRoaXMuaXNUaGVTYW1lRWxlbWVudChlbGVtZW50LCBmaW5kRWxlbWVudCwgZGF0YVR5cGUpKSA9PT0gLTE7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNvbmNhdChkYXRhKVxuICAgICAgICAgICAgLnNvcnQoKGRhdGExLCBkYXRhMikgPT4gdGhpcy5zb3J0Q29uZGl0aW9uKGRhdGExLCBkYXRhMiwgZGF0YVR5cGUpKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5yZXBsYWNlRGF0YShuZXdEYXRhLCBkYXRhVHlwZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGlzVGhlU2FtZUVsZW1lbnQoZWxlbWVudEEsIGVsZW1lbnRCLCBkYXRhVHlwZSl7XG4gICAgc3dpdGNoIChkYXRhVHlwZSl7XG4gICAgICBjYXNlICdkYXRhJzpcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRBWzBdID09PSBlbGVtZW50QlswXTtcbiAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgIHJldHVybiBlbGVtZW50QS50cyA9PT0gZWxlbWVudEIudHM7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIFxuICBzb3J0Q29uZGl0aW9uKGVsZW1lbnRBLCBlbGVtZW50QiwgZGF0YVR5cGUpe1xuICAgIHN3aXRjaCAoZGF0YVR5cGUpe1xuICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgIHJldHVybiBlbGVtZW50QVswXSAtIGVsZW1lbnRCWzBdO1xuICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRBLnRzIC0gZWxlbWVudEIudHM7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIFxuICBnZXRPbGREYXRhKGRhdGFUeXBlKXtcbiAgICByZXR1cm4gdGhpc1snY2hhcnRfJytkYXRhVHlwZS50b0xvd2VyQ2FzZSgpXTtcbiAgfVxuICBcbiAgcmVwbGFjZURhdGEoZGF0YSwgZGF0YVR5cGUpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpc1snY2hhcnRfJytkYXRhVHlwZS50b0xvd2VyQ2FzZSgpXSA9IGRhdGE7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5yZXBsYWNlRGF0YVR5cGUoZGF0YSwgZGF0YVR5cGUpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuICh0aGlzLnJlcGxhY2VDYWxsYmFjaykgPyB0aGlzLnJlcGxhY2VDYWxsYmFjayh0aGlzLmNoYXJ0LCBkYXRhLCB0aGlzLmlzTG9hZGVkLCBkYXRhVHlwZSkgOiBudWxsO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICByZXBsYWNlRGF0YVR5cGUoZGF0YSwgZGF0YVR5cGUpe1xuICAgIHN3aXRjaCAoZGF0YVR5cGUpe1xuICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgIGlmICh0aGlzLmFzeW5jVXJsKXtcbiAgICAgICAgICBjcEJvb3RzdHJhcC5sb29wKFsnYnRjLWJpdGNvaW4nLCAnZXRoLWV0aGVyZXVtJ10sIGNvaW5OYW1lID0+IHtcbiAgICAgICAgICAgIGxldCBjb2luU2hvcnQgPSBjb2luTmFtZS5zcGxpdCgnLScpWzBdO1xuICAgICAgICAgICAgaWYgKHRoaXMuYXN5bmNVcmwuc2VhcmNoKGNvaW5OYW1lKSA+IC0xICYmIGRhdGFbY29pblNob3J0XSkge1xuICAgICAgICAgICAgICBkYXRhW2NvaW5TaG9ydF0gPSBbXTtcbiAgICAgICAgICAgICAgY3BCb290c3RyYXAubG9vcCh0aGlzLmNoYXJ0LnNlcmllcywgc2VyaWVzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc2VyaWVzLnVzZXJPcHRpb25zLmlkID09PSBjb2luU2hvcnQpIHNlcmllcy51cGRhdGUoeyB2aXNpYmxlOiBmYWxzZSB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AoT2JqZWN0LmVudHJpZXMoZGF0YSksICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmlzRXhjbHVkZWQodmFsdWVbMF0pKSByZXR1cm47XG4gICAgICAgICAgcmV0dXJuICh0aGlzLmNoYXJ0LmdldCh2YWx1ZVswXSkpID8gdGhpcy5jaGFydC5nZXQodmFsdWVbMF0pLnNldERhdGEodmFsdWVbMV0sIGZhbHNlLCBmYWxzZSwgZmFsc2UpIDogdGhpcy5jaGFydC5hZGRTZXJpZXMoe2lkOiB2YWx1ZVswXSwgZGF0YTogdmFsdWVbMV0sIHNob3dJbk5hdmlnYXRvcjogdHJ1ZX0pO1xuICAgICAgICB9KTtcbiAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKHRoaXMuY2hhcnQuYW5ub3RhdGlvbnMuYWxsSXRlbXMsIGFubm90YXRpb24gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGFubm90YXRpb24uZGVzdHJveSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2V0QW5ub3RhdGlvbnNPYmplY3RzKGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbiAgXG4gIGlzRXhjbHVkZWQobGFiZWwpe1xuICAgIHJldHVybiB0aGlzLmV4Y2x1ZGVTZXJpZXNJZHMuaW5kZXhPZihsYWJlbCkgPiAtMTtcbiAgfVxuICBcbiAgdG9vbHRpcEZvcm1hdHRlcihwb2ludGVyLCBsYWJlbCA9ICcnLCBzZWFyY2gpe1xuICAgIGlmICghc2VhcmNoKSBzZWFyY2ggPSBsYWJlbDtcbiAgICBjb25zdCBoZWFkZXIgPSAnPGRpdiBjbGFzcz1cImNwLWNoYXJ0LXRvb2x0aXAtY3VycmVuY3lcIj48c21hbGw+JytuZXcgRGF0ZShwb2ludGVyLngpLnRvVVRDU3RyaW5nKCkrJzwvc21hbGw+PHRhYmxlPic7XG4gICAgY29uc3QgZm9vdGVyID0gJzwvdGFibGU+PC9kaXY+JztcbiAgICBsZXQgY29udGVudCA9ICcnO1xuICAgIHBvaW50ZXIucG9pbnRzLmZvckVhY2gocG9pbnQgPT4ge1xuICAgICAgY29udGVudCArPSAnPHRyPicgK1xuICAgICAgICAnPHRkPicgK1xuICAgICAgICAnPHN2ZyB3aWR0aD1cIjVcIiBoZWlnaHQ9XCI1XCI+PHJlY3QgeD1cIjBcIiB5PVwiMFwiIHdpZHRoPVwiNVwiIGhlaWdodD1cIjVcIiBmaWxsPVwiJytwb2ludC5zZXJpZXMuY29sb3IrJ1wiIGZpbGwtb3BhY2l0eT1cIjFcIj48L3JlY3Q+PC9zdmc+JyArXG4gICAgICAgIHBvaW50LnNlcmllcy5uYW1lICsgJzogJyArIHBvaW50LnkudG9Mb2NhbGVTdHJpbmcoJ3J1LVJVJywgeyBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDggfSkucmVwbGFjZSgnLCcsICcuJykgKyAnICcgKyAoKHBvaW50LnNlcmllcy5uYW1lLnRvTG93ZXJDYXNlKCkuc2VhcmNoKHNlYXJjaC50b0xvd2VyQ2FzZSgpKSA+IC0xKSA/IFwiXCIgOiBsYWJlbCkgK1xuICAgICAgICAnPC90ZD4nICtcbiAgICAgICAgJzwvdHI+JztcbiAgICB9KTtcbiAgICByZXR1cm4gaGVhZGVyICsgY29udGVudCArIGZvb3RlcjtcbiAgfVxuICBcbiAgc2V0QW5ub3RhdGlvbnNPYmplY3RzKGRhdGEpe1xuICAgIHRoaXMuY2hhcnQuc2VyaWVzWzBdLnhBeGlzLnJlbW92ZVBsb3RMaW5lKCk7XG4gICAgbGV0IHBsb3RMaW5lcyA9IFtdO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gZGF0YS5zb3J0KChkYXRhMSwgZGF0YTIpID0+IHtcbiAgICAgICAgcmV0dXJuIGRhdGEyLnRzIC0gZGF0YTEudHM7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKGRhdGEsIGVsZW1lbnQgPT4ge1xuICAgICAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gcGxvdExpbmVzLnB1c2goe1xuICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICB2YWx1ZTogZWxlbWVudC50cyxcbiAgICAgICAgICAgIGRhc2hTdHlsZTogJ3NvbGlkJyxcbiAgICAgICAgICAgIHpJbmRleDogNCxcbiAgICAgICAgICAgIGNvbG9yOiB0aGlzLmdldEV2ZW50VGFnUGFyYW1zKCkuY29sb3IsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jaGFydC5hZGRBbm5vdGF0aW9uKHtcbiAgICAgICAgICAgIHhWYWx1ZTogZWxlbWVudC50cyxcbiAgICAgICAgICAgIHk6IDAsXG4gICAgICAgICAgICB0aXRsZTogYDxzcGFuIHRpdGxlPVwiQ2xpY2sgdG8gb3BlblwiIGNsYXNzPVwiY3AtY2hhcnQtYW5ub3RhdGlvbl9fdGV4dFwiPiR7IHRoaXMuZ2V0RXZlbnRUYWdQYXJhbXMoZWxlbWVudC50YWcpLmxhYmVsIH08L3NwYW4+PHNwYW4gY2xhc3M9XCJjcC1jaGFydC1hbm5vdGF0aW9uX19kYXRhRWxlbWVudFwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj4keyBKU09OLnN0cmluZ2lmeShlbGVtZW50KSB9PC9zcGFuPmAsXG4gICAgICAgICAgICBzaGFwZToge1xuICAgICAgICAgICAgICB0eXBlOiAnY2lyY2xlJyxcbiAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgcjogMTEsXG4gICAgICAgICAgICAgICAgY3g6IDksXG4gICAgICAgICAgICAgICAgY3k6IDEwLjUsXG4gICAgICAgICAgICAgICAgJ3N0cm9rZS13aWR0aCc6IDEuNSxcbiAgICAgICAgICAgICAgICBmaWxsOiB0aGlzLmdldEV2ZW50VGFnUGFyYW1zKCkuY29sb3IsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgIG1vdXNlb3ZlcjogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKE1vYmlsZURldGVjdC5pc01vYmlsZSgpKSByZXR1cm47XG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmdldEV2ZW50RGF0YUZyb21Bbm5vdGF0aW9uRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMub3BlbkV2ZW50Q29udGFpbmVyKGRhdGEsIGV2ZW50KTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbW91c2VvdXQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoTW9iaWxlRGV0ZWN0LmlzTW9iaWxlKCkpIHJldHVybjtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlRXZlbnRDb250YWluZXIoZXZlbnQpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmdldEV2ZW50RGF0YUZyb21Bbm5vdGF0aW9uRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIGlmIChNb2JpbGVEZXRlY3QuaXNNb2JpbGUoKSkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuRXZlbnRDb250YWluZXIoZGF0YSwgZXZlbnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLm9wZW5FdmVudFBhZ2UoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhcnQuc2VyaWVzWzBdLnhBeGlzLnVwZGF0ZSh7XG4gICAgICAgIHBsb3RMaW5lcyxcbiAgICAgIH0sIGZhbHNlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgc2V0TmF2aWdhdG9yKG9wdGlvbnMpe1xuICAgIGxldCBuYXZpZ2F0b3JPcHRpb25zID0ge307XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGlmIChvcHRpb25zLm5hdmlnYXRvciA9PT0gdHJ1ZSl7XG4gICAgICAgIG5hdmlnYXRvck9wdGlvbnMgPSB7XG4gICAgICAgICAgbmF2aWdhdG9yOiB7XG4gICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICBtYXJnaW46IDIwLFxuICAgICAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgICAgIGxpbmVXaWR0aDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtYXNrRmlsbDogJ3JnYmEoMTAyLDEzMywxOTQsMC4xNSknLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgIHpvb21UeXBlOiAneCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgIHNldEV4dHJlbWVzOiAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICgoZS50cmlnZ2VyID09PSAnbmF2aWdhdG9yJyB8fCBlLnRyaWdnZXIgPT09ICd6b29tJykgJiYgZS5taW4gJiYgZS5tYXgpIHtcbiAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KHRoaXMuaWQrJ1NldEV4dHJlbWVzJywge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgICAgICAgICBtaW5EYXRlOiBlLm1pbixcbiAgICAgICAgICAgICAgICAgICAgICBtYXhEYXRlOiBlLm1heCxcbiAgICAgICAgICAgICAgICAgICAgICBlLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm5hdmlnYXRvckV4dHJlbWVzTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5zZXRSZXNldFpvb21CdXR0b24oKTtcbiAgICAgIH0gZWxzZSBpZiAoIW9wdGlvbnMubmF2aWdhdG9yKSB7XG4gICAgICAgIG5hdmlnYXRvck9wdGlvbnMgPSB7XG4gICAgICAgICAgbmF2aWdhdG9yOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLnVwZGF0ZU9iamVjdChvcHRpb25zLCBuYXZpZ2F0b3JPcHRpb25zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgc2V0UmVzZXRab29tQnV0dG9uKCl7XG4gICAgLy8gcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpOyAvLyBjYW50IGJlIHBvc2l0aW9uZWQgcHJvcGVybHkgaW4gcGxvdEJveCwgc28gaXRzIGRpc2FibGVkXG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmFkZENvbnRhaW5lcih0aGlzLmlkLCAnUmVzZXRab29tJywgJ2NwLWNoYXJ0LXJlc2V0LXpvb20nLCAnYnV0dG9uJylcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdldENvbnRhaW5lcignUmVzZXRab29tJyk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoZWxlbWVudCkgPT4ge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd1ay1idXR0b24nKTtcbiAgICAgIGVsZW1lbnQuaW5uZXJUZXh0ID0gJ1Jlc2V0IHpvb20nO1xuICAgICAgcmV0dXJuIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuY2hhcnQuem9vbU91dCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIG5hdmlnYXRvckV4dHJlbWVzTGlzdGVuZXIoKSB7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKHRoaXMuaWQgKyAnU2V0RXh0cmVtZXMnLCAoZSkgPT4ge1xuICAgICAgICBsZXQgbWluRGF0ZSA9IGNwQm9vdHN0cmFwLnJvdW5kKGUuZGV0YWlsLm1pbkRhdGUgLyAxMDAwLCAwKTtcbiAgICAgICAgbGV0IG1heERhdGUgPSBjcEJvb3RzdHJhcC5yb3VuZChlLmRldGFpbC5tYXhEYXRlIC8gMTAwMCwgMCk7XG4gICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLmZldGNoRGF0YVBhY2thZ2UobWluRGF0ZSwgbWF4RGF0ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBnZXROYXZpZ2F0b3JFeHRyZW1lc1VybChtaW5EYXRlLCBtYXhEYXRlLCBkYXRhVHlwZSl7XG4gICAgbGV0IGV4dHJlbWVzRGF0YVVybCA9IChkYXRhVHlwZSkgPyB0aGlzLmdldEV4dHJlbWVzRGF0YVVybCh0aGlzLmlkLCBkYXRhVHlwZSkgOiB0aGlzLmV4dHJlbWVzRGF0YVVybDtcbiAgICByZXR1cm4gKG1pbkRhdGUgJiYgbWF4RGF0ZSAmJiBleHRyZW1lc0RhdGFVcmwpID8gZXh0cmVtZXNEYXRhVXJsICsnL2RhdGVzLycrbWluRGF0ZSsnLycrbWF4RGF0ZSsnLycgOiBudWxsO1xuICB9XG4gIFxuICBzZXROb0RhdGFMYWJlbChvcHRpb25zKXtcbiAgICBsZXQgbm9EYXRhT3B0aW9ucyA9IHt9O1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBub0RhdGFPcHRpb25zID0ge1xuICAgICAgICBsYW5nOiB7XG4gICAgICAgICAgbm9EYXRhOiAnV2UgZG9uXFwndCBoYXZlIGRhdGEgZm9yIHRoaXMgdGltZSBwZXJpb2QnXG4gICAgICAgIH0sXG4gICAgICAgIG5vRGF0YToge1xuICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICBmb250RmFtaWx5OiAnQXJpYWwnLFxuICAgICAgICAgICAgZm9udFNpemU6ICcxNHB4JyxcbiAgICAgICAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAudXBkYXRlT2JqZWN0KG9wdGlvbnMsIG5vRGF0YU9wdGlvbnMpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBhZGRDb250YWluZXIoaWQsIGxhYmVsLCBjbGFzc05hbWUsIHRhZ05hbWUgPSAnZGl2Jyl7XG4gICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG4gICAgbGV0IGNoYXJ0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgIGNvbnRhaW5lci5pZCA9IGlkICsgbGFiZWw7XG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICBjaGFydENvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICB9XG4gIFxuICBnZXRDb250YWluZXIobGFiZWwpe1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkK2xhYmVsKTtcbiAgfVxuICBcbiAgZ2V0RXh0cmVtZXNEYXRhVXJsKGlkLCBkYXRhVHlwZSA9ICdkYXRhJyl7XG4gICAgcmV0dXJuICcvY3VycmVuY3kvJysgZGF0YVR5cGUgKycvJysgdGhpcy5jdXJyZW5jeTtcbiAgfVxuICBcbiAgZ2V0Vm9sdW1lUGF0dGVybigpe1xuICAgIHJldHVybiB7XG4gICAgICBkZWZzOiB7XG4gICAgICAgIHBhdHRlcm5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ2lkJzogJ2ZpbGwtcGF0dGVybicsXG4gICAgICAgICAgICAncGF0aCc6IHtcbiAgICAgICAgICAgICAgZDogJ00gMyAwIEwgMyAxMCBNIDggMCBMIDggMTAnLFxuICAgICAgICAgICAgICBzdHJva2U6IFwiI2UzZTNlM1wiLFxuICAgICAgICAgICAgICBmaWxsOiAnI2YxZjFmMScsXG4gICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdpZCc6ICdmaWxsLXBhdHRlcm4tbmlnaHQnLFxuICAgICAgICAgICAgJ3BhdGgnOiB7XG4gICAgICAgICAgICAgIGQ6ICdNIDMgMCBMIDMgMTAgTSA4IDAgTCA4IDEwJyxcbiAgICAgICAgICAgICAgc3Ryb2tlOiBcIiM5YjliOWJcIixcbiAgICAgICAgICAgICAgZmlsbDogJyMzODM4MzgnLFxuICAgICAgICAgICAgICBzdHJva2VXaWR0aDogMixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuXG5jbGFzcyBib290c3RyYXBDbGFzcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1wdHlWYWx1ZSA9IDA7XG4gICAgdGhpcy5lbXB0eURhdGEgPSAnLSc7XG4gIH1cbiAgXG4gIG5vZGVMaXN0VG9BcnJheShub2RlTGlzdCkge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChub2RlTGlzdCk7XG4gIH1cbiAgXG4gIHBhcnNlSW50ZXJ2YWxWYWx1ZSh2YWx1ZSkge1xuICAgIGxldCB0aW1lU3ltYm9sID0gJycsIG11bHRpcGxpZXIgPSAxO1xuICAgIGlmICh2YWx1ZS5zZWFyY2goJ3MnKSA+IC0xKSB7XG4gICAgICB0aW1lU3ltYm9sID0gJ3MnO1xuICAgICAgbXVsdGlwbGllciA9IDEwMDA7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5zZWFyY2goJ20nKSA+IC0xKSB7XG4gICAgICB0aW1lU3ltYm9sID0gJ20nO1xuICAgICAgbXVsdGlwbGllciA9IDYwICogMTAwMDtcbiAgICB9XG4gICAgaWYgKHZhbHVlLnNlYXJjaCgnaCcpID4gLTEpIHtcbiAgICAgIHRpbWVTeW1ib2wgPSAnaCc7XG4gICAgICBtdWx0aXBsaWVyID0gNjAgKiA2MCAqIDEwMDA7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5zZWFyY2goJ2QnKSA+IC0xKSB7XG4gICAgICB0aW1lU3ltYm9sID0gJ2QnO1xuICAgICAgbXVsdGlwbGllciA9IDI0ICogNjAgKiA2MCAqIDEwMDA7XG4gICAgfVxuICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlLnJlcGxhY2UodGltZVN5bWJvbCwgJycpKSAqIG11bHRpcGxpZXI7XG4gIH1cbiAgXG4gIGlzRmlhdChjdXJyZW5jeSwgb3JpZ2luKXtcbiAgICBpZiAoIW9yaWdpbikgUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgbGV0IHVybCA9IG9yaWdpbiArICcvZGlzdC9kYXRhL2N1cnJlbmNpZXMuanNvbic7XG4gICAgICByZXR1cm4gZmV0Y2hTZXJ2aWNlLmZldGNoSnNvbkZpbGUodXJsLCB0cnVlKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgIHJldHVybiAocmVzdWx0W2N1cnJlbmN5LnRvVXBwZXJDYXNlKCldKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgdXBkYXRlT2JqZWN0KG9iaiwgbmV3T2JqKSB7XG4gICAgbGV0IHJlc3VsdCA9IG9iajtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AoT2JqZWN0LmtleXMobmV3T2JqKSwga2V5ID0+IHtcbiAgICAgICAgaWYgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHR5cGVvZiByZXN1bHRba2V5XSA9PT0gJ29iamVjdCcpe1xuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZU9iamVjdChyZXN1bHRba2V5XSwgbmV3T2JqW2tleV0pLnRoZW4oKHVwZGF0ZVJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB1cGRhdGVSZXN1bHQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdFtrZXldID0gbmV3T2JqW2tleV07XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgcGFyc2VDdXJyZW5jeU51bWJlcih2YWx1ZSwgY3VycmVuY3ksIG9yaWdpbil7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmlzRmlhdChjdXJyZW5jeSwgb3JpZ2luKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgIHJldHVybiAocmVzdWx0KSA/IHRoaXMucGFyc2VOdW1iZXIodmFsdWUsIDIpIDogdGhpcy5wYXJzZU51bWJlcih2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHBhcnNlTnVtYmVyKG51bWJlciwgcHJlY2lzaW9uKSB7XG4gICAgaWYgKCFudW1iZXIgJiYgbnVtYmVyICE9PSAwKSByZXR1cm4gbnVtYmVyO1xuICAgIGlmIChudW1iZXIgPT09IHRoaXMuZW1wdHlWYWx1ZSB8fCBudW1iZXIgPT09IHRoaXMuZW1wdHlEYXRhKSByZXR1cm4gbnVtYmVyO1xuICAgIG51bWJlciA9IHBhcnNlRmxvYXQobnVtYmVyKTtcbiAgICBpZiAobnVtYmVyID4gMTAwMDAwKSB7XG4gICAgICBsZXQgbnVtYmVyU3RyID0gbnVtYmVyLnRvRml4ZWQoMCk7XG4gICAgICBsZXQgcGFyYW1ldGVyID0gJ0snLFxuICAgICAgICBzcGxpY2VkID0gbnVtYmVyU3RyLnNsaWNlKDAsIG51bWJlclN0ci5sZW5ndGggLSAxKTtcbiAgICAgIGlmIChudW1iZXIgPiAxMDAwMDAwMDAwKSB7XG4gICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDcpO1xuICAgICAgICBwYXJhbWV0ZXIgPSAnQic7XG4gICAgICB9IGVsc2UgaWYgKG51bWJlciA+IDEwMDAwMDApIHtcbiAgICAgICAgc3BsaWNlZCA9IG51bWJlclN0ci5zbGljZSgwLCBudW1iZXJTdHIubGVuZ3RoIC0gNCk7XG4gICAgICAgIHBhcmFtZXRlciA9ICdNJztcbiAgICAgIH1cbiAgICAgIGxldCBuYXR1cmFsID0gc3BsaWNlZC5zbGljZSgwLCBzcGxpY2VkLmxlbmd0aCAtIDIpO1xuICAgICAgbGV0IGRlY2ltYWwgPSBzcGxpY2VkLnNsaWNlKHNwbGljZWQubGVuZ3RoIC0gMik7XG4gICAgICByZXR1cm4gbmF0dXJhbCArICcuJyArIGRlY2ltYWwgKyAnICcgKyBwYXJhbWV0ZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBpc0RlY2ltYWwgPSAobnVtYmVyICUgMSkgPiAwO1xuICAgICAgaWYgKGlzRGVjaW1hbCkge1xuICAgICAgICBpZiAoIXByZWNpc2lvbiB8fCBudW1iZXIgPCAwLjAxKXtcbiAgICAgICAgICBwcmVjaXNpb24gPSAyO1xuICAgICAgICAgIGlmIChudW1iZXIgPCAxKSB7XG4gICAgICAgICAgICBwcmVjaXNpb24gPSA4O1xuICAgICAgICAgIH0gZWxzZSBpZiAobnVtYmVyIDwgMTApIHtcbiAgICAgICAgICAgIHByZWNpc2lvbiA9IDY7XG4gICAgICAgICAgfSBlbHNlIGlmIChudW1iZXIgPCAxMDAwKSB7XG4gICAgICAgICAgICBwcmVjaXNpb24gPSA0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5yb3VuZChudW1iZXIsIHByZWNpc2lvbikudG9Mb2NhbGVTdHJpbmcoJ3J1LVJVJywgeyBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IHByZWNpc2lvbiB9KS5yZXBsYWNlKCcsJywgJy4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudW1iZXIudG9Mb2NhbGVTdHJpbmcoJ3J1LVJVJywgeyBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIgfSkucmVwbGFjZSgnLCcsICcuJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICByb3VuZChhbW91bnQsIGRlY2ltYWwgPSA4LCBkaXJlY3Rpb24gPSAncm91bmQnKSB7XG4gICAgYW1vdW50ID0gcGFyc2VGbG9hdChhbW91bnQpO1xuICAgIGRlY2ltYWwgPSBNYXRoLnBvdygxMCwgZGVjaW1hbCk7XG4gICAgcmV0dXJuIE1hdGhbZGlyZWN0aW9uXShhbW91bnQgKiBkZWNpbWFsKSAvIGRlY2ltYWw7XG4gIH1cbiAgXG4gIGxvb3AoYXJyLCBmbiwgYnVzeSwgZXJyLCBpID0gMCkge1xuICAgIGNvbnN0IGJvZHkgPSAob2ssIGVyKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByID0gZm4oYXJyW2ldLCBpLCBhcnIpO1xuICAgICAgICByICYmIHIudGhlbiA/IHIudGhlbihvaykuY2F0Y2goZXIpIDogb2socilcbiAgICAgIH1cbiAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGVyKGUpXG4gICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBuZXh0ID0gKG9rLCBlcikgPT4gKCkgPT4gdGhpcy5sb29wKGFyciwgZm4sIG9rLCBlciwgKytpKTtcbiAgICBjb25zdCBydW4gPSAob2ssIGVyKSA9PiBpIDwgYXJyLmxlbmd0aCA/IG5ldyBQcm9taXNlKGJvZHkpLnRoZW4obmV4dChvaywgZXIpKS5jYXRjaChlcikgOiBvaygpO1xuICAgIHJldHVybiBidXN5ID8gcnVuKGJ1c3ksIGVycikgOiBuZXcgUHJvbWlzZShydW4pXG4gIH1cbn1cblxuY2xhc3MgZmV0Y2hDbGFzcyB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5zdGF0ZSA9IHt9O1xuICB9XG4gIFxuICBmZXRjaFNjcmlwdCh1cmwpIHtcbiAgICBpZiAodGhpcy5zdGF0ZVt1cmxdKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgIHRoaXMuc3RhdGVbdXJsXSA9ICdwZW5kaW5nJztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUpIHRoaXMuc3RhdGVbdXJsXSA9ICdkb3dubG9hZGVkJztcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlKSBkZWxldGUgdGhpcy5zdGF0ZVt1cmxdO1xuICAgICAgICByZWplY3QobmV3IEVycm9yKGBGYWlsZWQgdG8gbG9hZCBpbWFnZSdzIFVSTDogJHt1cmx9YCkpO1xuICAgICAgfSk7XG4gICAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xuICAgICAgc2NyaXB0LnNyYyA9IHVybDtcbiAgICB9KTtcbiAgfVxuICBcbiAgZmV0Y2hTdHlsZSh1cmwpIHtcbiAgICBpZiAodGhpcy5zdGF0ZVt1cmxdKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgIHRoaXMuc3RhdGVbdXJsXSA9ICdwZW5kaW5nJztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdyZWwnLCAnc3R5bGVzaGVldCcpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgdXJsKTtcbiAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUpIHRoaXMuc3RhdGVbdXJsXSA9ICdkb3dubG9hZGVkJztcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSkgZGVsZXRlIHRoaXMuc3RhdGVbdXJsXTtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgRmFpbGVkIHRvIGxvYWQgc3R5bGUgVVJMOiAke3VybH1gKSk7XG4gICAgICB9KTtcbiAgICAgIGxpbmsuaHJlZiA9IHVybDtcbiAgICB9KTtcbiAgfVxuICBcbiAgZmV0Y2hDaGFydERhdGEodXJpLCBmcm9tU3RhdGUgPSBmYWxzZSl7XG4gICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vZ3JhcGhzLmNvaW5wYXByaWthLmNvbScgKyB1cmk7XG4gICAgcmV0dXJuIHRoaXMuZmV0Y2hEYXRhKHVybCwgZnJvbVN0YXRlKTtcbiAgfVxuICBcbiAgZmV0Y2hEYXRhKHVybCwgZnJvbVN0YXRlID0gZmFsc2Upe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBpZiAoZnJvbVN0YXRlKXtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGVbdXJsXSA9PT0gJ3BlbmRpbmcnKXtcbiAgICAgICAgICBsZXQgcHJvbWlzZVRpbWVvdXQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLmZldGNoRGF0YSh1cmwsIGZyb21TdGF0ZSkpO1xuICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gcHJvbWlzZVRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEhdGhpcy5zdGF0ZVt1cmxdKXtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuc3RhdGVbdXJsXS5jbG9uZSgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5zdGF0ZVt1cmxdID0gJ3BlbmRpbmcnO1xuICAgICAgbGV0IHByb21pc2VGZXRjaCA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgcHJvbWlzZUZldGNoID0gcHJvbWlzZUZldGNoLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gZmV0Y2godXJsKTtcbiAgICAgIH0pO1xuICAgICAgcHJvbWlzZUZldGNoID0gcHJvbWlzZUZldGNoLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIHRoaXMuc3RhdGVbdXJsXSA9IHJlc3BvbnNlO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuY2xvbmUoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHByb21pc2VGZXRjaDtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgZmV0Y2hKc29uRmlsZSh1cmwsIGZyb21TdGF0ZSA9IGZhbHNlKXtcbiAgICByZXR1cm4gdGhpcy5mZXRjaERhdGEodXJsLCBmcm9tU3RhdGUpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgIGlmIChyZXN1bHQuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5qc29uKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IHdpZGdldHMgPSBuZXcgd2lkZ2V0c0NvbnRyb2xsZXIoKTtcbmNvbnN0IGNwQm9vdHN0cmFwID0gbmV3IGJvb3RzdHJhcENsYXNzKCk7XG5jb25zdCBmZXRjaFNlcnZpY2UgPSBuZXcgZmV0Y2hDbGFzcygpO1xuIl19
