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
        content += '<tr>' + '<td class="cp-chart-tooltip-currency__row">' + '<svg class="cp-chart-tooltip-currency__icon" width="5" height="5"><rect x="0" y="0" width="5" height="5" fill="' + point.series.color + '" fill-opacity="1"></rect></svg>' + point.series.name + ': ' + point.y.toLocaleString('ru-RU', { maximumFractionDigits: 8 }).replace(',', '.') + ' ' + (point.series.name.toLowerCase().search(search.toLowerCase()) > -1 ? "" : label) + '</td>' + '</tr>';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7SUNBTSxpQjtBQUNKLCtCQUFjO0FBQUE7O0FBQ1osU0FBSyxPQUFMLEdBQWUsSUFBSSxZQUFKLEVBQWY7QUFDQSxTQUFLLElBQUw7QUFDRDs7OzsyQkFFSztBQUFBOztBQUNKLGFBQU8sS0FBSyxPQUFMLENBQWEsUUFBYixDQUFzQixVQUE3QixJQUEyQyxFQUEzQztBQUNBLGVBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDO0FBQUEsZUFBTSxNQUFLLFdBQUwsRUFBTjtBQUFBLE9BQTlDLEVBQXdFLEtBQXhFO0FBQ0EsYUFBTyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLFVBQXpDLEdBQXNELFlBQU07QUFDMUQsZUFBTyxNQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLElBQXpDLEdBQWdELEtBQWhEO0FBQ0EsY0FBSyxXQUFMO0FBQ0QsT0FIRDtBQUlEOzs7a0NBRVk7QUFBQTs7QUFDWCxVQUFJLENBQUMsT0FBTyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLElBQTlDLEVBQW1EO0FBQ2pELGVBQU8sS0FBSyxPQUFMLENBQWEsUUFBYixDQUFzQixVQUE3QixFQUF5QyxJQUF6QyxHQUFnRCxJQUFoRDtBQUNBLFlBQUksZUFBZSxNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsU0FBUyxzQkFBVCxDQUFnQyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFNBQXRELENBQTNCLENBQW5CO0FBQ0EsYUFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixZQUE1QjtBQUNBLGVBQU8sZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsWUFBTTtBQUN0QyxpQkFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixZQUE1QjtBQUNBLGVB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WUFBTTtBQUNyQyxpQkFBTyxNQUFNLEdBQU4sQ0FBUDtBQUNELFNBRmMsQ0FBZjtBQUdBLHVCQUFlLGFBQWEsSUFBYixDQUFrQixVQUFDLFFBQUQsRUFBYztBQUM3QyxrQkFBSyxLQUFMLENBQVcsR0FBWCxJQUFrQixRQUFsQjtBQUNBLGlCQUFPLFNBQVMsS0FBVCxFQUFQO0FBQ0QsU0FIYyxDQUFmO0FBSUEsZUFBTyxZQUFQO0FBQ0QsT0F4QlMsQ0FBVjtBQXlCQSxhQUFPLE9BQVA7QUFDRDs7O2tDQUVhLEcsRUFBdUI7QUFBQSxVQUFsQixTQUFrQix1RUFBTixLQUFNOztBQUNuQyxhQUFPLEtBQUssU0FBTCxDQUFlLEdBQWYsRUFBb0IsU0FBcEIsRUFBK0IsSUFBL0IsQ0FBb0Msa0JBQVU7QUFDbkQsWUFBSSxPQUFPLE1BQVAsS0FBa0IsR0FBdEIsRUFBMkI7QUFDekIsaUJBQU8sT0FBTyxJQUFQLEVBQVA7QUFDRDtBQUNELGVBQU8sS0FBUDtBQUNELE9BTE0sRUFLSixLQUxJLENBS0UsWUFBTTtBQUNiLGVBQU8sS0FBUDtBQUNELE9BUE0sQ0FBUDtBQVFEOzs7Ozs7QUFHSCxJQUFNLFVBQVUsSUFBSSxpQkFBSixFQUFoQjtBQUNBLElBQU0sY0FBYyxJQUFJLGNBQUosRUFBcEI7QUFDQSxJQUFNLGVBQWUsSUFBSSxVQUFKLEVBQXJCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY2xhc3Mgd2lkZ2V0c0NvbnRyb2xsZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLndpZGdldHMgPSBuZXcgd2lkZ2V0c0NsYXNzKCk7XG4gICAgdGhpcy5iaW5kKCk7XG4gIH1cbiAgXG4gIGJpbmQoKXtcbiAgICB3aW5kb3dbdGhpcy53aWRnZXRzLmRlZmF1bHRzLm9iamVjdE5hbWVdID0ge307XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHRoaXMuaW5pdFdpZGdldHMoKSwgZmFsc2UpO1xuICAgIHdpbmRvd1t0aGlzLndpZGdldHMuZGVmYXVsdHMub2JqZWN0TmFtZV0uYmluZFdpZGdldCA9ICgpID0+IHtcbiAgICAgIHdpbmRvd1t0aGlzLndpZGdldHMuZGVmYXVsdHMub2JqZWN0TmFtZV0uaW5pdCA9IGZhbHNlO1xuICAgICAgdGhpcy5pbml0V2lkZ2V0cygpO1xuICAgIH07XG4gIH1cbiAgXG4gIGluaXRXaWRnZXRzKCl7XG4gICAgaWYgKCF3aW5kb3dbdGhpcy53aWRnZXRzLmRlZmF1bHRzLm9iamVjdE5hbWVdLmluaXQpe1xuICAgICAgd2luZG93W3RoaXMud2lkZ2V0cy5kZWZhdWx0cy5vYmplY3ROYW1lXS5pbml0ID0gdHJ1ZTtcbiAgICAgIGxldCBtYWluRWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMud2lkZ2V0cy5kZWZhdWx0cy5jbGFzc05hbWUpKTtcbiAgICAgIHRoaXMud2lkZ2V0cy5zZXRXaWRnZXRDbGFzcyhtYWluRWxlbWVudHMpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgICAgdGhpcy53aWRnZXRzLnNldFdpZGdldENsYXNzKG1haW5FbGVtZW50cyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFpbkVsZW1lbnRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICB0aGlzLndpZGdldHMuc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKGkpO1xuICAgICAgICB9XG4gICAgICB9LCBmYWxzZSk7XG4gICAgICBsZXQgc2NyaXB0RWxlbWVudCA9IHRoaXMud2lkZ2V0cy5nZXRTY3JpcHRFbGVtZW50KCk7XG4gICAgICBpZiAoc2NyaXB0RWxlbWVudCAmJiBzY3JpcHRFbGVtZW50LmRhdGFzZXQgJiYgc2NyaXB0RWxlbWVudC5kYXRhc2V0LmNwQ3VycmVuY3lXaWRnZXQpe1xuICAgICAgICBsZXQgZGF0YXNldCA9IEpTT04ucGFyc2Uoc2NyaXB0RWxlbWVudC5kYXRhc2V0LmNwQ3VycmVuY3lXaWRnZXQpO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoZGF0YXNldCkpe1xuICAgICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMoZGF0YXNldCk7XG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBrZXlzLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICAgIGxldCBrZXkgPSBrZXlzW2pdLnJlcGxhY2UoJy0nLCAnXycpO1xuICAgICAgICAgICAgdGhpcy53aWRnZXRzLmRlZmF1bHRzW2tleV0gPSBkYXRhc2V0W2tleXNbal1dO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMud2lkZ2V0cy5zdGF0ZXMgPSBbXTtcbiAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AobWFpbkVsZW1lbnRzLCAoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgICBsZXQgbmV3U2V0dGluZ3MgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMud2lkZ2V0cy5kZWZhdWx0cykpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLmlzV29yZHByZXNzID0gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3dvcmRwcmVzcycpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLmlzTmlnaHRNb2RlID0gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NwLXdpZGdldF9fbmlnaHQtbW9kZScpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLm1haW5FbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgICB0aGlzLndpZGdldHMuc3RhdGVzLnB1c2gobmV3U2V0dGluZ3MpO1xuICAgICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBsZXQgY2hhcnRTY3JpcHRzID0gW1xuICAgICAgICAgICAgICAnLy9jb2RlLmhpZ2hjaGFydHMuY29tL3N0b2NrL2hpZ2hzdG9jay5qcycsXG4gICAgICAgICAgICAgICcvL2NvZGUuaGlnaGNoYXJ0cy5jb20vbW9kdWxlcy9leHBvcnRpbmcuanMnLFxuICAgICAgICAgICAgICAnLy9jb2RlLmhpZ2hjaGFydHMuY29tL21vZHVsZXMvbm8tZGF0YS10by1kaXNwbGF5LmpzJyxcbiAgICAgICAgICAgICAgJy8vaGlnaGNoYXJ0cy5naXRodWIuaW8vcGF0dGVybi1maWxsL3BhdHRlcm4tZmlsbC12Mi5qcycsXG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgcmV0dXJuIChuZXdTZXR0aW5ncy5tb2R1bGVzLmluZGV4T2YoJ2NoYXJ0JykgPiAtMSAmJiAhd2luZG93LkhpZ2hjaGFydHMpXG4gICAgICAgICAgICAgID8gY3BCb290c3RyYXAubG9vcChjaGFydFNjcmlwdHMsIGxpbmsgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZldGNoU2VydmljZS5mZXRjaFNjcmlwdChsaW5rKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICA6IG51bGw7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53aWRnZXRzLmluaXQoaW5kZXgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9KTtcbiAgICAgIH0sIDUwKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3Mgd2lkZ2V0c0NsYXNzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zdGF0ZXMgPSBbXTtcbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgb2JqZWN0TmFtZTogJ2NwQ3VycmVuY3lXaWRnZXRzJyxcbiAgICAgIGNsYXNzTmFtZTogJ2NvaW5wYXByaWthLWN1cnJlbmN5LXdpZGdldCcsXG4gICAgICBjc3NGaWxlTmFtZTogJ3dpZGdldC5taW4uY3NzJyxcbiAgICAgIGN1cnJlbmN5OiAnYnRjLWJpdGNvaW4nLFxuICAgICAgcHJpbWFyeV9jdXJyZW5jeTogJ1VTRCcsXG4gICAgICByYW5nZV9saXN0OiBbJzI0aCcsICc3ZCcsICczMGQnLCAnMXEnLCAnMXknLCAneXRkJywgJ2FsbCddLFxuICAgICAgcmFuZ2U6ICc3ZCcsXG4gICAgICBtb2R1bGVzOiBbJ21hcmtldF9kZXRhaWxzJywgJ2NoYXJ0J10sXG4gICAgICB1cGRhdGVfYWN0aXZlOiBmYWxzZSxcbiAgICAgIHVwZGF0ZV90aW1lb3V0OiAnMzBzJyxcbiAgICAgIGxhbmd1YWdlOiAnZW4nLFxuICAgICAgc3R5bGVfc3JjOiBudWxsLFxuICAgICAgaW1nX3NyYzogbnVsbCxcbiAgICAgIGxhbmdfc3JjOiBudWxsLFxuICAgICAgZGF0YV9zcmM6IG51bGwsXG4gICAgICBvcmlnaW5fc3JjOiAnaHR0cHM6Ly91bnBrZy5jb20vQGNvaW5wYXByaWthL3dpZGdldC1jdXJyZW5jeUBsYXRlc3QnLFxuICAgICAgc2hvd19kZXRhaWxzX2N1cnJlbmN5OiBmYWxzZSxcbiAgICAgIHRpY2tlcjoge1xuICAgICAgICBuYW1lOiB1bmRlZmluZWQsXG4gICAgICAgIHN5bWJvbDogdW5kZWZpbmVkLFxuICAgICAgICBwcmljZTogdW5kZWZpbmVkLFxuICAgICAgICBwcmljZV9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgICAgIHJhbms6IHVuZGVmaW5lZCxcbiAgICAgICAgcHJpY2VfYXRoOiB1bmRlZmluZWQsXG4gICAgICAgIHZvbHVtZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgICAgbWFya2V0X2NhcDogdW5kZWZpbmVkLFxuICAgICAgICBwZXJjZW50X2Zyb21fcHJpY2VfYXRoOiB1bmRlZmluZWQsXG4gICAgICAgIHZvbHVtZV8yNGhfY2hhbmdlXzI0aDogdW5kZWZpbmVkLFxuICAgICAgICBtYXJrZXRfY2FwX2NoYW5nZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgICBpbnRlcnZhbDogbnVsbCxcbiAgICAgIGlzV29yZHByZXNzOiBmYWxzZSxcbiAgICAgIGlzTmlnaHRNb2RlOiBmYWxzZSxcbiAgICAgIGlzRGF0YTogZmFsc2UsXG4gICAgICBhdmFpbGFibGVNb2R1bGVzOiBbJ3ByaWNlJywgJ2NoYXJ0JywgJ21hcmtldF9kZXRhaWxzJ10sXG4gICAgICBtZXNzYWdlOiAnZGF0YV9sb2FkaW5nJyxcbiAgICAgIHRyYW5zbGF0aW9uczoge30sXG4gICAgICBtYWluRWxlbWVudDogbnVsbCxcbiAgICAgIG5vVHJhbnNsYXRpb25MYWJlbHM6IFtdLFxuICAgICAgc2NyaXB0c0Rvd25sb2FkZWQ6IHt9LFxuICAgICAgY2hhcnQ6IG51bGwsXG4gICAgICByd2Q6IHtcbiAgICAgICAgeHM6IDI4MCxcbiAgICAgICAgczogMzIwLFxuICAgICAgICBtOiAzNzAsXG4gICAgICAgIGw6IDQ2MixcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuICBcbiAgaW5pdChpbmRleCkge1xuICAgIGlmICghdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCkpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKCdCaW5kIGZhaWxlZCwgbm8gZWxlbWVudCB3aXRoIGNsYXNzID0gXCInICsgdGhpcy5kZWZhdWx0cy5jbGFzc05hbWUgKyAnXCInKTtcbiAgICB9XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdldERlZmF1bHRzKGluZGV4KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnNldE9yaWdpbkxpbmsoaW5kZXgpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBzZXRXaWRnZXRDbGFzcyhlbGVtZW50cykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCB3aWR0aCA9IGVsZW1lbnRzW2ldLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgbGV0IHJ3ZEtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmRlZmF1bHRzLnJ3ZCk7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHJ3ZEtleXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgbGV0IHJ3ZEtleSA9IHJ3ZEtleXNbal07XG4gICAgICAgIGxldCByd2RQYXJhbSA9IHRoaXMuZGVmYXVsdHMucndkW3J3ZEtleV07XG4gICAgICAgIGxldCBjbGFzc05hbWUgPSB0aGlzLmRlZmF1bHRzLmNsYXNzTmFtZSArICdfXycgKyByd2RLZXk7XG4gICAgICAgIGlmICh3aWR0aCA8PSByd2RQYXJhbSkgZWxlbWVudHNbaV0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICBpZiAod2lkdGggPiByd2RQYXJhbSkgZWxlbWVudHNbaV0uY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgZ2V0TWFpbkVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gKHRoaXMuc3RhdGVzW2luZGV4XSkgPyB0aGlzLnN0YXRlc1tpbmRleF0ubWFpbkVsZW1lbnQgOiBudWxsO1xuICB9XG4gIFxuICBnZXREZWZhdWx0cyhpbmRleCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgaWYgKG1haW5FbGVtZW50ICYmIG1haW5FbGVtZW50LmRhdGFzZXQpIHtcbiAgICAgICAgaWYgKCFtYWluRWxlbWVudC5kYXRhc2V0Lm1vZHVsZXMgJiYgbWFpbkVsZW1lbnQuZGF0YXNldC52ZXJzaW9uID09PSAnZXh0ZW5kZWQnKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdtb2R1bGVzJywgWydtYXJrZXRfZGV0YWlscyddKTtcbiAgICAgICAgaWYgKCFtYWluRWxlbWVudC5kYXRhc2V0Lm1vZHVsZXMgJiYgbWFpbkVsZW1lbnQuZGF0YXNldC52ZXJzaW9uID09PSAnc3RhbmRhcmQnKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdtb2R1bGVzJywgW10pO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5tb2R1bGVzKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdtb2R1bGVzJywgSlNPTi5wYXJzZShtYWluRWxlbWVudC5kYXRhc2V0Lm1vZHVsZXMpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQucHJpbWFyeUN1cnJlbmN5KSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdwcmltYXJ5X2N1cnJlbmN5JywgbWFpbkVsZW1lbnQuZGF0YXNldC5wcmltYXJ5Q3VycmVuY3kpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5jdXJyZW5jeSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnY3VycmVuY3knLCBtYWluRWxlbWVudC5kYXRhc2V0LmN1cnJlbmN5KTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQucmFuZ2UpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3JhbmdlJywgbWFpbkVsZW1lbnQuZGF0YXNldC5yYW5nZSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnNob3dEZXRhaWxzQ3VycmVuY3kpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3Nob3dfZGV0YWlsc19jdXJyZW5jeScsIChtYWluRWxlbWVudC5kYXRhc2V0LnNob3dEZXRhaWxzQ3VycmVuY3kgPT09ICd0cnVlJykpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVBY3RpdmUpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3VwZGF0ZV9hY3RpdmUnLCAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVBY3RpdmUgPT09ICd0cnVlJykpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVUaW1lb3V0KSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICd1cGRhdGVfdGltZW91dCcsIGNwQm9vdHN0cmFwLnBhcnNlSW50ZXJ2YWxWYWx1ZShtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZVRpbWVvdXQpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ3VhZ2UpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2xhbmd1YWdlJywgbWFpbkVsZW1lbnQuZGF0YXNldC5sYW5ndWFnZSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lm9yaWdpblNyYykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnb3JpZ2luX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQub3JpZ2luU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubm9kZU1vZHVsZXNTcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ25vZGVfbW9kdWxlc19zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0Lm5vZGVNb2R1bGVzU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuYm93ZXJTcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2Jvd2VyX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQuYm93ZXJTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5zdHlsZVNyYykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnc3R5bGVfc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5zdHlsZVNyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmxhbmdTcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2xvZ29fc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5sYW5nU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuaW1nU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdsb2dvX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQuaW1nU3JjKTtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgfSk7XG4gIH1cbiAgXG4gIHNldE9yaWdpbkxpbmsoaW5kZXgpIHtcbiAgICBpZiAoT2JqZWN0LmtleXModGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnMpLmxlbmd0aCA9PT0gMCkgdGhpcy5nZXRUcmFuc2xhdGlvbnModGhpcy5kZWZhdWx0cy5sYW5ndWFnZSk7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnN0eWxlc2hlZXQoKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmFkZFdpZGdldEVsZW1lbnQoaW5kZXgpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaW5pdEludGVydmFsKGluZGV4KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgYWRkV2lkZ2V0RWxlbWVudChpbmRleCkge1xuICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgIGxldCBtb2R1bGVzID0gJyc7XG4gICAgbGV0IG1vZHVsZXNBcnJheSA9IFtdO1xuICAgIGxldCBjaGFydENvbnRhaW5lciA9IG51bGw7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKHRoaXMuZGVmYXVsdHMuYXZhaWxhYmxlTW9kdWxlcywgbW9kdWxlID0+IHtcbiAgICAgICAgcmV0dXJuICh0aGlzLnN0YXRlc1tpbmRleF0ubW9kdWxlcy5pbmRleE9mKG1vZHVsZSkgPiAtMSkgPyBtb2R1bGVzQXJyYXkucHVzaChtb2R1bGUpIDogbnVsbDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AobW9kdWxlc0FycmF5LCBtb2R1bGUgPT4ge1xuICAgICAgICBsZXQgbGFiZWwgPSBudWxsO1xuICAgICAgICBpZiAobW9kdWxlID09PSAnY2hhcnQnKSBsYWJlbCA9ICdDaGFydCc7XG4gICAgICAgIGlmIChtb2R1bGUgPT09ICdtYXJrZXRfZGV0YWlscycpIGxhYmVsID0gJ01hcmtldERldGFpbHMnO1xuICAgICAgICByZXR1cm4gKGxhYmVsKSA/IHRoaXNbYHdpZGdldCR7IGxhYmVsIH1FbGVtZW50YF0oaW5kZXgpLnRoZW4ocmVzdWx0ID0+IG1vZHVsZXMgKz0gcmVzdWx0KSA6IG51bGw7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBtYWluRWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLndpZGdldE1haW5FbGVtZW50KGluZGV4KSArIG1vZHVsZXMgKyB0aGlzLndpZGdldEZvb3RlcihpbmRleCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBjaGFydENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAkeyB0aGlzLmRlZmF1bHRzLmNsYXNzTmFtZSB9LXByaWNlLWNoYXJ0LSR7IGluZGV4IH1gKTtcbiAgICAgIHJldHVybiAoY2hhcnRDb250YWluZXIpID8gY2hhcnRDb250YWluZXIucGFyZW50RWxlbWVudC5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIHRoaXMud2lkZ2V0U2VsZWN0RWxlbWVudChpbmRleCwgJ3JhbmdlJykpIDogbnVsbDtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGlmIChjaGFydENvbnRhaW5lcil7XG4gICAgICAgIHRoaXMuc3RhdGVzW2luZGV4XS5jaGFydCA9IG5ldyBjaGFydENsYXNzKGNoYXJ0Q29udGFpbmVyLCB0aGlzLnN0YXRlc1tpbmRleF0pO1xuICAgICAgICB0aGlzLnNldFNlbGVjdExpc3RlbmVycyhpbmRleCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgICBcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnNldEJlZm9yZUVsZW1lbnRJbkZvb3RlcihpbmRleCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5nZXREYXRhKGluZGV4KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgc2V0U2VsZWN0TGlzdGVuZXJzKGluZGV4KXtcbiAgICBsZXQgbWFpbkVsZW1lbnQgPSB0aGlzLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICBsZXQgc2VsZWN0RWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0LXNlbGVjdCcpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0RWxlbWVudHMubGVuZ3RoOyBpKyspe1xuICAgICAgbGV0IGJ1dHRvbnMgPSBzZWxlY3RFbGVtZW50c1tpXS5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0LXNlbGVjdF9fb3B0aW9ucyBidXR0b24nKTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYnV0dG9ucy5sZW5ndGg7IGorKyl7XG4gICAgICAgIGJ1dHRvbnNbal0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFNlbGVjdE9wdGlvbihldmVudCwgaW5kZXgpO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICBzZXRTZWxlY3RPcHRpb24oZXZlbnQsIGluZGV4KXtcbiAgICBsZXQgY2xhc3NOYW1lID0gJ2NwLXdpZGdldC1hY3RpdmUnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKyl7XG4gICAgICBsZXQgc2libGluZyA9IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmNoaWxkTm9kZXNbaV07XG4gICAgICBpZiAoc2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkgc2libGluZy5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgfVxuICAgIGxldCBwYXJlbnQgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLmNwLXdpZGdldC1zZWxlY3QnKTtcbiAgICBsZXQgdHlwZSA9IHBhcmVudC5kYXRhc2V0LnR5cGU7XG4gICAgbGV0IHBpY2tlZFZhbHVlRWxlbWVudCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuY3Atd2lkZ2V0LXNlbGVjdF9fb3B0aW9ucyA+IHNwYW4nKTtcbiAgICBsZXQgdmFsdWUgPSBldmVudC50YXJnZXQuZGF0YXNldC5vcHRpb247XG4gICAgcGlja2VkVmFsdWVFbGVtZW50LmlubmVyVGV4dCA9IHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIHZhbHVlLnRvTG93ZXJDYXNlKCkpO1xuICAgIHRoaXMudXBkYXRlRGF0YShpbmRleCwgdHlwZSwgdmFsdWUpO1xuICAgIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgdGhpcy5kaXNwYXRjaEV2ZW50KGluZGV4LCAnLXN3aXRjaC1yYW5nZScsIHZhbHVlKTtcbiAgfVxuICBcbiAgZGlzcGF0Y2hFdmVudChpbmRleCwgbmFtZSwgZGF0YSl7XG4gICAgbGV0IGlkID0gYCR7IHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lIH0tcHJpY2UtY2hhcnQtJHsgaW5kZXggfWA7XG4gICAgcmV0dXJuIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGAke2lkfSR7bmFtZX1gLCB7IGRldGFpbDogeyBkYXRhIH0gfSkpO1xuICB9XG4gIFxuICBnZXREYXRhKGluZGV4KSB7XG4gICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vYXBpLmNvaW5wYXByaWthLmNvbS92MS93aWRnZXQvJyArIHRoaXMuc3RhdGVzW2luZGV4XS5jdXJyZW5jeSArICc/cXVvdGU9JyArIHRoaXMuc3RhdGVzW2luZGV4XS5wcmltYXJ5X2N1cnJlbmN5O1xuICAgIHJldHVybiBmZXRjaFNlcnZpY2UuZmV0Y2hEYXRhKHVybCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGVzW2luZGV4XS5pc0RhdGEpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2lzRGF0YScsIHRydWUpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRpY2tlcihpbmRleCwgcmVzdWx0KTtcbiAgICAgIH0pXG4gICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMub25FcnJvclJlcXVlc3QoaW5kZXgsIGVycm9yKTtcbiAgICB9KTtcbiAgfVxuICBcbiAgb25FcnJvclJlcXVlc3QoaW5kZXgsIHhocikge1xuICAgIGlmICh0aGlzLnN0YXRlc1tpbmRleF0uaXNEYXRhKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdpc0RhdGEnLCBmYWxzZSk7XG4gICAgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbWVzc2FnZScsICdkYXRhX3VuYXZhaWxhYmxlJyk7XG4gICAgY29uc29sZS5lcnJvcignUmVxdWVzdCBmYWlsZWQuICBSZXR1cm5lZCBzdGF0dXMgb2YgJyArIHhociwgdGhpcy5zdGF0ZXNbaW5kZXhdKTtcbiAgfVxuICBcbiAgaW5pdEludGVydmFsKGluZGV4KSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLnN0YXRlc1tpbmRleF0uaW50ZXJ2YWwpO1xuICAgIGlmICh0aGlzLnN0YXRlc1tpbmRleF0udXBkYXRlX2FjdGl2ZSAmJiB0aGlzLnN0YXRlc1tpbmRleF0udXBkYXRlX3RpbWVvdXQgPiAxMDAwKSB7XG4gICAgICB0aGlzLnN0YXRlc1tpbmRleF0uaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIHRoaXMuZ2V0RGF0YShpbmRleCk7XG4gICAgICB9LCB0aGlzLnN0YXRlc1tpbmRleF0udXBkYXRlX3RpbWVvdXQpO1xuICAgIH1cbiAgfVxuICBcbiAgc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKGluZGV4KSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlc1tpbmRleF0uaXNXb3JkcHJlc3MpIHtcbiAgICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgaWYgKG1haW5FbGVtZW50KSB7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5jaGlsZHJlblswXS5sb2NhbE5hbWUgPT09ICdzdHlsZScpIHtcbiAgICAgICAgICBtYWluRWxlbWVudC5yZW1vdmVDaGlsZChtYWluRWxlbWVudC5jaGlsZE5vZGVzWzBdKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZm9vdGVyRWxlbWVudCA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jcC13aWRnZXRfX2Zvb3RlcicpO1xuICAgICAgICBsZXQgdmFsdWUgPSBmb290ZXJFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gNDM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZm9vdGVyRWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFsdWUgLT0gZm9vdGVyRWxlbWVudC5jaGlsZE5vZGVzW2ldLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHN0eWxlLmlubmVySFRNTCA9ICcuY3Atd2lkZ2V0X19mb290ZXItLScgKyBpbmRleCArICc6OmJlZm9yZXt3aWR0aDonICsgdmFsdWUudG9GaXhlZCgwKSArICdweDt9JztcbiAgICAgICAgbWFpbkVsZW1lbnQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBtYWluRWxlbWVudC5jaGlsZHJlblswXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICB1cGRhdGVXaWRnZXRFbGVtZW50KGluZGV4LCBrZXksIHZhbHVlLCB0aWNrZXIpIHtcbiAgICBsZXQgc3RhdGUgPSB0aGlzLnN0YXRlc1tpbmRleF07XG4gICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgaWYgKG1haW5FbGVtZW50KSB7XG4gICAgICBsZXQgdGlja2VyQ2xhc3MgPSAodGlja2VyKSA/ICdUaWNrZXInIDogJyc7XG4gICAgICBpZiAoa2V5ID09PSAnbmFtZScgfHwga2V5ID09PSAnY3VycmVuY3knKSB7XG4gICAgICAgIGlmIChrZXkgPT09ICdjdXJyZW5jeScpIHtcbiAgICAgICAgICBsZXQgYUVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNwLXdpZGdldF9fZm9vdGVyID4gYScpO1xuICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYUVsZW1lbnRzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICBhRWxlbWVudHNba10uaHJlZiA9IHRoaXMuY29pbl9saW5rKHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nZXRJbWFnZShpbmRleCk7XG4gICAgICB9XG4gICAgICBpZiAoa2V5ID09PSAnaXNEYXRhJyB8fCBrZXkgPT09ICdtZXNzYWdlJykge1xuICAgICAgICBsZXQgaGVhZGVyRWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0X19tYWluJyk7XG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgaGVhZGVyRWxlbWVudHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICBoZWFkZXJFbGVtZW50c1trXS5pbm5lckhUTUwgPSAoIXN0YXRlLmlzRGF0YSkgPyB0aGlzLndpZGdldE1haW5FbGVtZW50TWVzc2FnZShpbmRleCkgOiB0aGlzLndpZGdldE1haW5FbGVtZW50RGF0YShpbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB1cGRhdGVFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsga2V5ICsgdGlja2VyQ2xhc3MpO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHVwZGF0ZUVsZW1lbnRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgbGV0IHVwZGF0ZUVsZW1lbnQgPSB1cGRhdGVFbGVtZW50c1tqXTtcbiAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NwLXdpZGdldF9fcmFuaycpKSB7XG4gICAgICAgICAgICBsZXQgY2xhc3NOYW1lID0gKHBhcnNlRmxvYXQodmFsdWUpID4gMCkgPyBcImNwLXdpZGdldF9fcmFuay11cFwiIDogKChwYXJzZUZsb2F0KHZhbHVlKSA8IDApID8gXCJjcC13aWRnZXRfX3JhbmstZG93blwiIDogXCJjcC13aWRnZXRfX3JhbmstbmV1dHJhbFwiKTtcbiAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLWRvd24nKTtcbiAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLXVwJyk7XG4gICAgICAgICAgICB1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9fcmFuay1uZXV0cmFsJyk7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IGNwQm9vdHN0cmFwLmVtcHR5RGF0YTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICAgICAgICB2YWx1ZSA9IChrZXkgPT09ICdwcmljZV9jaGFuZ2VfMjRoJykgPyAnKCcgKyBjcEJvb3RzdHJhcC5yb3VuZCh2YWx1ZSwgMikgKyAnJSknIDogY3BCb290c3RyYXAucm91bmQodmFsdWUsIDIpICsgJyUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3dEZXRhaWxzQ3VycmVuY3knKSAmJiAhc3RhdGUuc2hvd19kZXRhaWxzX2N1cnJlbmN5KSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICcgJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwYXJzZU51bWJlcicpKSB7XG4gICAgICAgICAgICBjb25zdCBvcmlnaW4gPSB0aGlzLmRlZmF1bHRzLmRhdGFfc3JjIHx8IHRoaXMuZGVmYXVsdHMub3JpZ2luX3NyYztcbiAgICAgICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLnBhcnNlQ3VycmVuY3lOdW1iZXIodmFsdWUsIHN0YXRlLnByaW1hcnlfY3VycmVuY3ksIG9yaWdpbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlRWxlbWVudC5pbm5lclRleHQgPSByZXN1bHQgfHwgY3BCb290c3RyYXAuZW1wdHlEYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5pbm5lclRleHQgPSB2YWx1ZSB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICB1cGRhdGVEYXRhKGluZGV4LCBrZXksIHZhbHVlLCB0aWNrZXIpIHtcbiAgICBpZiAodGlja2VyKSB7XG4gICAgICB0aGlzLnN0YXRlc1tpbmRleF0udGlja2VyW2tleV0gPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGF0ZXNbaW5kZXhdW2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKGtleSA9PT0gJ2xhbmd1YWdlJykge1xuICAgICAgdGhpcy5nZXRUcmFuc2xhdGlvbnModmFsdWUpO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVdpZGdldEVsZW1lbnQoaW5kZXgsIGtleSwgdmFsdWUsIHRpY2tlcik7XG4gIH1cbiAgXG4gIHVwZGF0ZVdpZGdldFRyYW5zbGF0aW9ucyhsYW5nLCBkYXRhKSB7XG4gICAgdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ10gPSBkYXRhO1xuICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5zdGF0ZXMubGVuZ3RoOyB4KyspIHtcbiAgICAgIGxldCBpc05vVHJhbnNsYXRpb25MYWJlbHNVcGRhdGUgPSB0aGlzLnN0YXRlc1t4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLmxlbmd0aCA+IDAgJiYgbGFuZyA9PT0gJ2VuJztcbiAgICAgIGlmICh0aGlzLnN0YXRlc1t4XS5sYW5ndWFnZSA9PT0gbGFuZyB8fCBpc05vVHJhbnNsYXRpb25MYWJlbHNVcGRhdGUpIHtcbiAgICAgICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5zdGF0ZXNbeF0ubWFpbkVsZW1lbnQ7XG4gICAgICAgIGxldCB0cmFuc2FsdGVFbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC10cmFuc2xhdGlvbicpKTtcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0cmFuc2FsdGVFbGVtZW50cy5sZW5ndGg7IHkrKykge1xuICAgICAgICAgIHRyYW5zYWx0ZUVsZW1lbnRzW3ldLmNsYXNzTGlzdC5mb3JFYWNoKChjbGFzc05hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChjbGFzc05hbWUuc2VhcmNoKCd0cmFuc2xhdGlvbl8nKSA+IC0xKSB7XG4gICAgICAgICAgICAgIGxldCB0cmFuc2xhdGVLZXkgPSBjbGFzc05hbWUucmVwbGFjZSgndHJhbnNsYXRpb25fJywgJycpO1xuICAgICAgICAgICAgICBpZiAodHJhbnNsYXRlS2V5ID09PSAnbWVzc2FnZScpIHRyYW5zbGF0ZUtleSA9IHRoaXMuc3RhdGVzW3hdLm1lc3NhZ2U7XG4gICAgICAgICAgICAgIGxldCBsYWJlbEluZGV4ID0gdGhpcy5zdGF0ZXNbeF0ubm9UcmFuc2xhdGlvbkxhYmVscy5pbmRleE9mKHRyYW5zbGF0ZUtleSk7XG4gICAgICAgICAgICAgIGxldCB0ZXh0ID0gdGhpcy5nZXRUcmFuc2xhdGlvbih4LCB0cmFuc2xhdGVLZXkpO1xuICAgICAgICAgICAgICBpZiAobGFiZWxJbmRleCA+IC0xICYmIHRleHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1t4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLnNwbGljZShsYWJlbEluZGV4LCAxKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRyYW5zYWx0ZUVsZW1lbnRzW3ldLmlubmVyVGV4dCA9IHRleHQ7XG4gICAgICAgICAgICAgIGlmICh0cmFuc2FsdGVFbGVtZW50c1t5XS5jbG9zZXN0KCcuY3Atd2lkZ2V0X19mb290ZXInKSkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZXRCZWZvcmVFbGVtZW50SW5Gb290ZXIoeCksIDUwKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHVwZGF0ZVRpY2tlcihpbmRleCwgZGF0YSkge1xuICAgIGxldCBkYXRhS2V5cyA9IE9iamVjdC5rZXlzKGRhdGEpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMudXBkYXRlRGF0YShpbmRleCwgZGF0YUtleXNbaV0sIGRhdGFbZGF0YUtleXNbaV1dLCB0cnVlKTtcbiAgICB9XG4gIH1cbiAgXG4gIHN0eWxlc2hlZXQoKSB7XG4gICAgaWYgKHRoaXMuZGVmYXVsdHMuc3R5bGVfc3JjICE9PSBmYWxzZSkge1xuICAgICAgbGV0IHVybCA9IHRoaXMuZGVmYXVsdHMuc3R5bGVfc3JjIHx8IHRoaXMuZGVmYXVsdHMub3JpZ2luX3NyYyArICcvZGlzdC8nICsgdGhpcy5kZWZhdWx0cy5jc3NGaWxlTmFtZTtcbiAgICAgIGlmICghZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCdsaW5rW2hyZWY9XCInICsgdXJsICsgJ1wiXScpKXtcbiAgICAgICAgcmV0dXJuIGZldGNoU2VydmljZS5mZXRjaFN0eWxlKHVybCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuICBcbiAgd2lkZ2V0TWFpbkVsZW1lbnQoaW5kZXgpIHtcbiAgICBsZXQgZGF0YSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcbiAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX2hlYWRlclwiPicgK1xuICAgICAgJzxkaXYgY2xhc3M9XCInICsgJ2NwLXdpZGdldF9faW1nIGNwLXdpZGdldF9faW1nLScgKyBkYXRhLmN1cnJlbmN5ICsgJ1wiPicgK1xuICAgICAgJzxpbWcvPicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX21haW5cIj4nICtcbiAgICAgICgoZGF0YS5pc0RhdGEpID8gdGhpcy53aWRnZXRNYWluRWxlbWVudERhdGEoaW5kZXgpIDogdGhpcy53aWRnZXRNYWluRWxlbWVudE1lc3NhZ2UoaW5kZXgpKSArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+JztcbiAgfVxuICBcbiAgd2lkZ2V0TWFpbkVsZW1lbnREYXRhKGluZGV4KSB7XG4gICAgbGV0IGRhdGEgPSB0aGlzLnN0YXRlc1tpbmRleF07XG4gICAgcmV0dXJuICc8aDM+PGEgaHJlZj1cIicgKyB0aGlzLmNvaW5fbGluayhkYXRhLmN1cnJlbmN5KSArICdcIj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cIm5hbWVUaWNrZXJcIj4nICsgKGRhdGEudGlja2VyLm5hbWUgfHwgY3BCb290c3RyYXAuZW1wdHlEYXRhKSArICc8L3NwYW4+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzeW1ib2xUaWNrZXJcIj4nICsgKGRhdGEudGlja2VyLnN5bWJvbCB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGEpICsgJzwvc3Bhbj4nICtcbiAgICAgICc8L2E+PC9oMz4nICtcbiAgICAgICc8c3Ryb25nPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwicHJpY2VUaWNrZXIgcGFyc2VOdW1iZXJcIj4nICsgKGNwQm9vdHN0cmFwLnBhcnNlTnVtYmVyKGRhdGEudGlja2VyLnByaWNlKSB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGEpICsgJzwvc3Bhbj4gJyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJwcmltYXJ5Q3VycmVuY3lcIj4nICsgZGF0YS5wcmltYXJ5X2N1cnJlbmN5ICsgJyA8L3NwYW4+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJwcmljZV9jaGFuZ2VfMjRoVGlja2VyIGNwLXdpZGdldF9fcmFuayBjcC13aWRnZXRfX3JhbmstJyArICgoZGF0YS50aWNrZXIucHJpY2VfY2hhbmdlXzI0aCA+IDApID8gXCJ1cFwiIDogKChkYXRhLnRpY2tlci5wcmljZV9jaGFuZ2VfMjRoIDwgMCkgPyBcImRvd25cIiA6IFwibmV1dHJhbFwiKSkgKyAnXCI+KCcgKyAoY3BCb290c3RyYXAucm91bmQoZGF0YS50aWNrZXIucHJpY2VfY2hhbmdlXzI0aCwgMikgfHwgY3BCb290c3RyYXAuZW1wdHlWYWx1ZSkgKyAnJSk8L3NwYW4+JyArXG4gICAgICAnPC9zdHJvbmc+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJjcC13aWRnZXRfX3JhbmstbGFiZWxcIj48c3BhbiBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX3JhbmtcIj4nICsgdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJyYW5rXCIpICsgJzwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJyYW5rVGlja2VyXCI+JyArIChkYXRhLnRpY2tlci5yYW5rIHx8IGNwQm9vdHN0cmFwLmVtcHR5RGF0YSkgKyAnPC9zcGFuPjwvc3Bhbj4nO1xuICB9XG4gIFxuICB3aWRnZXRNYWluRWxlbWVudE1lc3NhZ2UoaW5kZXgpIHtcbiAgICBsZXQgbWVzc2FnZSA9IHRoaXMuc3RhdGVzW2luZGV4XS5tZXNzYWdlO1xuICAgIHJldHVybiAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9fbWFpbi1uby1kYXRhIGNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX21lc3NhZ2VcIj4nICsgKHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIG1lc3NhZ2UpKSArICc8L2Rpdj4nO1xuICB9XG4gIFxuICB3aWRnZXRNYXJrZXREZXRhaWxzRWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKHRoaXMuc3RhdGVzW2luZGV4XS5tb2R1bGVzLmluZGV4T2YoJ21hcmtldF9kZXRhaWxzJykgPiAtMSkgPyAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9fZGV0YWlsc1wiPicgK1xuICAgICAgdGhpcy53aWRnZXRBdGhFbGVtZW50KGluZGV4KSArXG4gICAgICB0aGlzLndpZGdldFZvbHVtZTI0aEVsZW1lbnQoaW5kZXgpICtcbiAgICAgIHRoaXMud2lkZ2V0TWFya2V0Q2FwRWxlbWVudChpbmRleCkgK1xuICAgICAgJzwvZGl2PicgOiAnJyk7XG4gIH1cbiAgXG4gIHdpZGdldEF0aEVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAnPHNtYWxsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fYXRoXCI+JyArIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwiYXRoXCIpICsgJzwvc21hbGw+JyArXG4gICAgICAnPGRpdj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInByaWNlX2F0aFRpY2tlciBwYXJzZU51bWJlclwiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlciBzaG93RGV0YWlsc0N1cnJlbmN5XCI+PC9zcGFuPicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwicGVyY2VudF9mcm9tX3ByaWNlX2F0aFRpY2tlciBjcC13aWRnZXRfX3JhbmtcIj4nICsgY3BCb290c3RyYXAuZW1wdHlEYXRhICsgJzwvc3Bhbj4nICtcbiAgICAgICc8L2Rpdj4nXG4gIH1cbiAgXG4gIHdpZGdldFZvbHVtZTI0aEVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAnPHNtYWxsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fdm9sdW1lXzI0aFwiPicgKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInZvbHVtZV8yNGhcIikgKyAnPC9zbWFsbD4nICtcbiAgICAgICc8ZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwidm9sdW1lXzI0aFRpY2tlciBwYXJzZU51bWJlclwiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlciBzaG93RGV0YWlsc0N1cnJlbmN5XCI+PC9zcGFuPicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwidm9sdW1lXzI0aF9jaGFuZ2VfMjRoVGlja2VyIGNwLXdpZGdldF9fcmFua1wiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnPC9zcGFuPicgK1xuICAgICAgJzwvZGl2Pic7XG4gIH1cbiAgXG4gIHdpZGdldE1hcmtldENhcEVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAnPHNtYWxsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fbWFya2V0X2NhcFwiPicgKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcIm1hcmtldF9jYXBcIikgKyAnPC9zbWFsbD4nICtcbiAgICAgICc8ZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwibWFya2V0X2NhcFRpY2tlciBwYXJzZU51bWJlclwiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlciBzaG93RGV0YWlsc0N1cnJlbmN5XCI+PC9zcGFuPicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwibWFya2V0X2NhcF9jaGFuZ2VfMjRoVGlja2VyIGNwLXdpZGdldF9fcmFua1wiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnPC9zcGFuPicgK1xuICAgICAgJzwvZGl2Pic7XG4gIH1cbiAgXG4gIHdpZGdldENoYXJ0RWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoXG4gICAgICBgPGRpdiBjbGFzcz1cImNwLXdpZGdldF9fY2hhcnRcIj48ZGl2IGlkPVwiJHsgdGhpcy5kZWZhdWx0cy5jbGFzc05hbWUgfS1wcmljZS1jaGFydC0keyBpbmRleCB9XCI+PC9kaXY+PC9kaXY+YFxuICAgICk7XG4gIH1cbiAgXG4gIHdpZGdldFNlbGVjdEVsZW1lbnQoaW5kZXgsIGxhYmVsKXtcbiAgICBsZXQgYnV0dG9ucyA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdGF0ZXNbaW5kZXhdW2xhYmVsKydfbGlzdCddLmxlbmd0aDsgaSsrKXtcbiAgICAgIGxldCBkYXRhID0gdGhpcy5zdGF0ZXNbaW5kZXhdW2xhYmVsKydfbGlzdCddW2ldO1xuICAgICAgYnV0dG9ucyArPSAnPGJ1dHRvbiBjbGFzcz1cIicrICgoZGF0YS50b0xvd2VyQ2FzZSgpID09PSB0aGlzLnN0YXRlc1tpbmRleF1bbGFiZWxdLnRvTG93ZXJDYXNlKCkpXG4gICAgICAgID8gJ2NwLXdpZGdldC1hY3RpdmUgJ1xuICAgICAgICA6ICcnKSArICgobGFiZWwgPT09ICdwcmltYXJ5X2N1cnJlbmN5JykgPyAnJyA6ICdjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl8nICsgZGF0YS50b0xvd2VyQ2FzZSgpKSArJ1wiIGRhdGEtb3B0aW9uPVwiJytkYXRhKydcIj4nK3RoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIGRhdGEudG9Mb3dlckNhc2UoKSkrJzwvYnV0dG9uPidcbiAgICB9XG4gICAgaWYgKGxhYmVsID09PSAncmFuZ2UnKSA7XG4gICAgbGV0IHRpdGxlID0gdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJ6b29tX2luXCIpO1xuICAgIHJldHVybiAnPGRpdiBkYXRhLXR5cGU9XCInK2xhYmVsKydcIiBjbGFzcz1cImNwLXdpZGdldC1zZWxlY3RcIj4nICtcbiAgICAgICc8bGFiZWwgY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl8nKyBsYWJlbCArJ1wiPicrdGl0bGUrJzwvbGFiZWw+JyArXG4gICAgICAnPGRpdiBjbGFzcz1cImNwLXdpZGdldC1zZWxlY3RfX29wdGlvbnNcIj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cImFycm93LWRvd24gJysgJ2NwLXdpZGdldF9fY2FwaXRhbGl6ZSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl8nICsgdGhpcy5zdGF0ZXNbaW5kZXhdW2xhYmVsXS50b0xvd2VyQ2FzZSgpICsnXCI+JysgdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgdGhpcy5zdGF0ZXNbaW5kZXhdW2xhYmVsXS50b0xvd2VyQ2FzZSgpKSArJzwvc3Bhbj4nICtcbiAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0LXNlbGVjdF9fZHJvcGRvd25cIj4nICtcbiAgICAgIGJ1dHRvbnMgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzwvZGl2Pic7XG4gIH1cbiAgXG4gIHdpZGdldEZvb3RlcihpbmRleCkge1xuICAgIGxldCBjdXJyZW5jeSA9IHRoaXMuc3RhdGVzW2luZGV4XS5jdXJyZW5jeTtcbiAgICByZXR1cm4gKCF0aGlzLnN0YXRlc1tpbmRleF0uaXNXb3JkcHJlc3MpXG4gICAgICA/ICc8cCBjbGFzcz1cImNwLXdpZGdldF9fZm9vdGVyIGNwLXdpZGdldF9fZm9vdGVyLS0nICsgaW5kZXggKyAnXCI+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9wb3dlcmVkX2J5XCI+JyArIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwicG93ZXJlZF9ieVwiKSArICcgPC9zcGFuPicgK1xuICAgICAgJzxpbWcgc3R5bGU9XCJ3aWR0aDogMTZweFwiIHNyYz1cIicgKyB0aGlzLm1haW5fbG9nb19saW5rKCkgKyAnXCIgYWx0PVwiXCIvPicgK1xuICAgICAgJzxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCInICsgdGhpcy5jb2luX2xpbmsoY3VycmVuY3kpICsgJ1wiPmNvaW5wYXByaWthLmNvbTwvYT4nICtcbiAgICAgICc8L3A+J1xuICAgICAgOiAnJztcbiAgfVxuICBcbiAgZ2V0SW1hZ2UoaW5kZXgpIHtcbiAgICBsZXQgZGF0YSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcbiAgICBsZXQgaW1nQ29udGFpbmVycyA9IGRhdGEubWFpbkVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY3Atd2lkZ2V0X19pbWcnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGltZ0NvbnRhaW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBpbWdDb250YWluZXIgPSBpbWdDb250YWluZXJzW2ldO1xuICAgICAgaW1nQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NwLXdpZGdldF9faW1nLS1oaWRkZW4nKTtcbiAgICAgIGxldCBpbWcgPSBpbWdDb250YWluZXIucXVlcnlTZWxlY3RvcignaW1nJyk7XG4gICAgICBsZXQgbmV3SW1nID0gbmV3IEltYWdlO1xuICAgICAgbmV3SW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgaW1nLnNyYyA9IG5ld0ltZy5zcmM7XG4gICAgICAgIGltZ0NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX2ltZy0taGlkZGVuJyk7XG4gICAgICB9O1xuICAgICAgbmV3SW1nLnNyYyA9IHRoaXMuaW1nX3NyYyhkYXRhLmN1cnJlbmN5KTtcbiAgICB9XG4gIH1cbiAgXG4gIGltZ19zcmMoaWQpIHtcbiAgICByZXR1cm4gJ2h0dHBzOi8vY29pbnBhcHJpa2EuY29tL2NvaW4vJyArIGlkICsgJy9sb2dvLnBuZyc7XG4gIH1cbiAgXG4gIGNvaW5fbGluayhpZCkge1xuICAgIHJldHVybiAnaHR0cHM6Ly9jb2lucGFwcmlrYS5jb20vY29pbi8nICsgaWRcbiAgfVxuICBcbiAgbWFpbl9sb2dvX2xpbmsoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYXVsdHMuaW1nX3NyYyB8fCB0aGlzLmRlZmF1bHRzLm9yaWdpbl9zcmMgKyAnL2Rpc3QvaW1nL2xvZ29fd2lkZ2V0LnN2ZydcbiAgfVxuICBcbiAgZ2V0U2NyaXB0RWxlbWVudCgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0W2RhdGEtY3AtY3VycmVuY3ktd2lkZ2V0XScpO1xuICB9XG4gIFxuICBnZXRUcmFuc2xhdGlvbihpbmRleCwgbGFiZWwpIHtcbiAgICBsZXQgdGV4dCA9ICh0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1t0aGlzLnN0YXRlc1tpbmRleF0ubGFuZ3VhZ2VdKSA/IHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW3RoaXMuc3RhdGVzW2luZGV4XS5sYW5ndWFnZV1bbGFiZWxdIDogbnVsbDtcbiAgICBpZiAoIXRleHQgJiYgdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbJ2VuJ10pIHtcbiAgICAgIHRleHQgPSB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1snZW4nXVtsYWJlbF07XG4gICAgfVxuICAgIGlmICghdGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMuYWRkTGFiZWxXaXRob3V0VHJhbnNsYXRpb24oaW5kZXgsIGxhYmVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9XG4gIFxuICBhZGRMYWJlbFdpdGhvdXRUcmFuc2xhdGlvbihpbmRleCwgbGFiZWwpIHtcbiAgICBpZiAoIXRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zWydlbiddKSB0aGlzLmdldFRyYW5zbGF0aW9ucygnZW4nKTtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZXNbaW5kZXhdLm5vVHJhbnNsYXRpb25MYWJlbHMucHVzaChsYWJlbCk7XG4gIH1cbiAgXG4gIGdldFRyYW5zbGF0aW9ucyhsYW5nKSB7XG4gICAgaWYgKCF0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXSkge1xuICAgICAgY29uc3QgdXJsID0gdGhpcy5kZWZhdWx0cy5sYW5nX3NyYyB8fCB0aGlzLmRlZmF1bHRzLm9yaWdpbl9zcmMgKyAnL2Rpc3QvbGFuZy8nICsgbGFuZyArICcuanNvbic7XG4gICAgICB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXSA9IHt9O1xuICAgICAgcmV0dXJuIGZldGNoU2VydmljZS5mZXRjaEpzb25GaWxlKHVybCwgdHJ1ZSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVXaWRnZXRUcmFuc2xhdGlvbnMobGFuZywgcmVzcG9uc2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMub25FcnJvclJlcXVlc3QoMCwgdXJsICsgcmVzcG9uc2UpO1xuICAgICAgICAgIHRoaXMuZ2V0VHJhbnNsYXRpb25zKCdlbicpO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgY2hhcnRDbGFzcyB7XG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgc3RhdGUpe1xuICAgIGlmICghY29udGFpbmVyKSByZXR1cm47XG4gICAgdGhpcy5pZCA9IGNvbnRhaW5lci5pZDtcbiAgICB0aGlzLmlzTmlnaHRNb2RlID0gc3RhdGUuaXNOaWdodE1vZGU7XG4gICAgdGhpcy5jaGFydHNXaXRoQWN0aXZlU2VyaWVzQ29va2llcyA9IFtdO1xuICAgIHRoaXMuY2hhcnQgPSBudWxsO1xuICAgIHRoaXMuY3VycmVuY3kgPSBzdGF0ZS5jdXJyZW5jeTtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLnNldE9wdGlvbnMoKTtcbiAgICB0aGlzLmRlZmF1bHRSYW5nZSA9IHN0YXRlLnJhbmdlIHx8ICc3ZCc7XG4gICAgdGhpcy5jYWxsYmFjayA9IG51bGw7XG4gICAgdGhpcy5yZXBsYWNlQ2FsbGJhY2sgPSBudWxsO1xuICAgIHRoaXMuZXh0cmVtZXNEYXRhVXJsID0gdGhpcy5nZXRFeHRyZW1lc0RhdGFVcmwoY29udGFpbmVyLmlkKTtcbiAgICB0aGlzLmRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgY2hhcnQ6IHtcbiAgICAgICAgYWxpZ25UaWNrczogZmFsc2UsXG4gICAgICAgIG1hcmdpblRvcDogNTAsXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgZm9udEZhbWlseTogJ3NhbnMtc2VyaWYnLFxuICAgICAgICB9LFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICByZW5kZXI6IChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZS50YXJnZXQuYW5ub3RhdGlvbnMpIHtcbiAgICAgICAgICAgICAgbGV0IGNoYXJ0ID0gZS50YXJnZXQuYW5ub3RhdGlvbnMuY2hhcnQ7XG4gICAgICAgICAgICAgIGNwQm9vdHN0cmFwLmxvb3AoY2hhcnQuYW5ub3RhdGlvbnMuYWxsSXRlbXMsIGFubm90YXRpb24gPT4ge1xuICAgICAgICAgICAgICAgIGxldCB5ID0gY2hhcnQucGxvdEhlaWdodCArIGNoYXJ0LnBsb3RUb3AgLSBjaGFydC5zcGFjaW5nWzBdIC0gMiAtICgodGhpcy5pc1Jlc3BvbnNpdmVNb2RlQWN0aXZlKGNoYXJ0KSkgPyAxMCA6IDApO1xuICAgICAgICAgICAgICAgIGFubm90YXRpb24udXBkYXRlKHt5fSwgdHJ1ZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgc2Nyb2xsYmFyOiB7XG4gICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIGFubm90YXRpb25zT3B0aW9uczoge1xuICAgICAgICBlbmFibGVkQnV0dG9uczogZmFsc2UsXG4gICAgICB9LFxuICAgICAgcmFuZ2VTZWxlY3Rvcjoge1xuICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICBwbG90T3B0aW9uczoge1xuICAgICAgICBsaW5lOiB7XG4gICAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgICBzdGF0ZXM6IHtcbiAgICAgICAgICAgICAgaG92ZXI6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICBsZWdlbmRJdGVtQ2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXZlbnQuYnJvd3NlckV2ZW50LmlzVHJ1c3RlZCl7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRzV2l0aEFjdGl2ZVNlcmllc0Nvb2tpZXMuaW5kZXhPZihldmVudC50YXJnZXQuY2hhcnQucmVuZGVyVG8uaWQpID4gLTEpIHRoaXMuc2V0VmlzaWJsZUNoYXJ0Q29va2llcyhldmVudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gT24gaU9TIHRvdWNoIGV2ZW50IGZpcmVzIHNlY29uZCBjYWxsYmFjayBmcm9tIEpTIChpc1RydXN0ZWQ6IGZhbHNlKSB3aGljaFxuICAgICAgICAgICAgICAvLyByZXN1bHRzIHdpdGggdG9nZ2xlIGJhY2sgdGhlIGNoYXJ0IChwcm9iYWJseSBpdHMgYSBwcm9ibGVtIHdpdGggVUlLaXQsIGJ1dCBub3Qgc3VyZSlcbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2xlZ2VuZEl0ZW1DbGljaycsIHtldmVudCwgaXNUcnVzdGVkOiBldmVudC5icm93c2VyRXZlbnQuaXNUcnVzdGVkfSk7XG4gICAgICAgICAgICAgIHJldHVybiBldmVudC5icm93c2VyRXZlbnQuaXNUcnVzdGVkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgeEF4aXM6IHtcbiAgICAgICAgb3JkaW5hbDogZmFsc2VcbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMuY2hhcnREYXRhUGFyc2VyID0gKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBkYXRhID0gZGF0YVswXTtcbiAgICAgICAgY29uc3QgcHJpY2VDdXJyZW5jeSA9IHN0YXRlLnByaW1hcnlfY3VycmVuY3kudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoe1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHByaWNlOiAoZGF0YS5wcmljZSlcbiAgICAgICAgICAgICAgPyBkYXRhLnByaWNlXG4gICAgICAgICAgICAgIDogKChkYXRhW3ByaWNlQ3VycmVuY3ldKVxuICAgICAgICAgICAgICAgID8gZGF0YVtwcmljZUN1cnJlbmN5XVxuICAgICAgICAgICAgICAgIDogW10pLFxuICAgICAgICAgICAgdm9sdW1lOiBkYXRhLnZvbHVtZSB8fCBbXSxcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB0aGlzLmlzRXZlbnRzSGlkZGVuID0gZmFsc2U7XG4gICAgdGhpcy5leGNsdWRlU2VyaWVzSWRzID0gW107XG4gICAgdGhpcy5hc3luY1VybCA9IGAvY3VycmVuY3kvZGF0YS8keyBzdGF0ZS5jdXJyZW5jeSB9L19yYW5nZV8vYDtcbiAgICB0aGlzLmFzeW5jUGFyYW1zID0gYD9xdW90ZT0keyBzdGF0ZS5wcmltYXJ5X2N1cnJlbmN5LnRvVXBwZXJDYXNlKCkgfSZmaWVsZHM9cHJpY2Usdm9sdW1lYDtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuICBcbiAgc2V0T3B0aW9ucygpe1xuICAgIGNvbnN0IGNoYXJ0U2VydmljZSA9IG5ldyBjaGFydENsYXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3BvbnNpdmU6IHtcbiAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb25kaXRpb246IHtcbiAgICAgICAgICAgICAgbWF4V2lkdGg6IDE1MDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hhcnRPcHRpb25zOiB7XG4gICAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgIGFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuICAgICAgICAgICAgICAgIHk6IDkyLFxuICAgICAgICAgICAgICAgIHN5bWJvbFJhZGl1czogMCxcbiAgICAgICAgICAgICAgICBpdGVtRGlzdGFuY2U6IDIwLFxuICAgICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgIGhlaWdodDogNDAwLFxuICAgICAgICAgICAgICAgIG1hcmdpblRvcDogMzUsXG4gICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAwLFxuICAgICAgICAgICAgICAgIHNwYWNpbmdUb3A6IDAsXG4gICAgICAgICAgICAgICAgc3BhY2luZ0JvdHRvbTogMCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbmF2aWdhdG9yOiB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgICAgICAgICAgICBtYXJnaW46IDcwLFxuICAgICAgICAgICAgICAgIGhhbmRsZXM6IHtcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogMjUsXG4gICAgICAgICAgICAgICAgICB3aWR0aDogMTcsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb25kaXRpb246IHtcbiAgICAgICAgICAgICAgbWF4V2lkdGg6IDYwMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGFydE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IDAsXG4gICAgICAgICAgICAgICAgem9vbVR5cGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IDEwLFxuICAgICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiAxMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM1MCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgeUF4aXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tBbW91bnQ6IDcsXG4gICAgICAgICAgICAgICAgICB0aWNrV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrTGVuZ3RoOiAwLFxuICAgICAgICAgICAgICAgICAgbGluZVdpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgYWxpZ246IFwibGVmdFwiLFxuICAgICAgICAgICAgICAgICAgICB4OiAxLFxuICAgICAgICAgICAgICAgICAgICB5OiAtMixcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM5ZTllOWUnLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnOXB4JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGZsb29yOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0Ftb3VudDogNyxcbiAgICAgICAgICAgICAgICAgIHRpY2tXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tMZW5ndGg6IDAsXG4gICAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICAgICAgICBhbGlnbjogXCJyaWdodFwiLFxuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogXCJqdXN0aWZ5XCIsXG4gICAgICAgICAgICAgICAgICAgIHg6IDEsXG4gICAgICAgICAgICAgICAgICAgIHk6IC0yLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzUwODVlYycsXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICc5cHgnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgIG1heFdpZHRoOiA0NTBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGFydE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgYWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ21pZGRsZScsXG4gICAgICAgICAgICAgICAgeTogODIsXG4gICAgICAgICAgICAgICAgc3ltYm9sUmFkaXVzOiAwLFxuICAgICAgICAgICAgICAgIGl0ZW1EaXN0YW5jZTogMjAsXG4gICAgICAgICAgICAgICAgaXRlbVN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG5hdmlnYXRvcjoge1xuICAgICAgICAgICAgICAgIG1hcmdpbjogNjAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA0MCxcbiAgICAgICAgICAgICAgICBoYW5kbGVzOiB7XG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6IDIwLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwMCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgeUF4aXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tBbW91bnQ6IDcsXG4gICAgICAgICAgICAgICAgICB0aWNrV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrTGVuZ3RoOiAwLFxuICAgICAgICAgICAgICAgICAgbGluZVdpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgYWxpZ246IFwibGVmdFwiLFxuICAgICAgICAgICAgICAgICAgICB4OiAxLFxuICAgICAgICAgICAgICAgICAgICB5OiAtMixcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM5ZTllOWUnLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnOXB4JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGZsb29yOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0Ftb3VudDogNyxcbiAgICAgICAgICAgICAgICAgIHRpY2tXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tMZW5ndGg6IDAsXG4gICAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICAgICAgICBhbGlnbjogXCJyaWdodFwiLFxuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogXCJqdXN0aWZ5XCIsXG4gICAgICAgICAgICAgICAgICAgIHg6IDEsXG4gICAgICAgICAgICAgICAgICAgIHk6IC0yLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzUwODVlYycsXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICc5cHgnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHRpdGxlOiB7XG4gICAgICAgIHRleHQ6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgICBjaGFydDoge1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdub25lJyxcbiAgICAgICAgbWFyZ2luVG9wOiA1MCxcbiAgICAgICAgcGxvdEJvcmRlcldpZHRoOiAwLFxuICAgICAgfSxcbiAgICAgIGNwRXZlbnRzOiBmYWxzZSxcbiAgICAgIGNvbG9yczogW1xuICAgICAgICAnIzUwODVlYycsXG4gICAgICAgICcjMWY5ODA5JyxcbiAgICAgICAgJyM5ODVkNjUnLFxuICAgICAgICAnI2VlOTgzYicsXG4gICAgICAgICcjNGM0YzRjJyxcbiAgICAgIF0sXG4gICAgICBsZWdlbmQ6IHtcbiAgICAgICAgbWFyZ2luOiAwLFxuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICBhbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgc3ltYm9sUmFkaXVzOiAwLFxuICAgICAgICBpdGVtRGlzdGFuY2U6IDQwLFxuICAgICAgICBpdGVtU3R5bGU6IHtcbiAgICAgICAgICBmb250V2VpZ2h0OiAnbm9ybWFsJyxcbiAgICAgICAgICBjb2xvcjogKHRoaXMuaXNOaWdodE1vZGUpID8gJyM4MGE2ZTUnIDogJyMwNjQ1YWQnLFxuICAgICAgICB9LFxuICAgICAgICBpdGVtTWFyZ2luVG9wOiA4LFxuICAgICAgfSxcbiAgICAgIG5hdmlnYXRvcjogdHJ1ZSxcbiAgICAgIHRvb2x0aXA6IHtcbiAgICAgICAgc2hhcmVkOiB0cnVlLFxuICAgICAgICBzcGxpdDogZmFsc2UsXG4gICAgICAgIGFuaW1hdGlvbjogZmFsc2UsXG4gICAgICAgIGJvcmRlcldpZHRoOiAxLFxuICAgICAgICBib3JkZXJDb2xvcjogKHRoaXMuaXNOaWdodE1vZGUpID8gJyM0YzRjNGMnIDogJyNlM2UzZTMnLFxuICAgICAgICBoaWRlRGVsYXk6IDEwMCxcbiAgICAgICAgc2hhZG93OiBmYWxzZSxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgY29sb3I6ICcjNGM0YzRjJyxcbiAgICAgICAgICBmb250U2l6ZTogJzEwcHgnLFxuICAgICAgICB9LFxuICAgICAgICB1c2VIVE1MOiB0cnVlLFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuIGNoYXJ0U2VydmljZS50b29sdGlwRm9ybWF0dGVyKHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIFxuICAgICAgZXhwb3J0aW5nOiB7XG4gICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICBjb250ZXh0QnV0dG9uOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFxuICAgICAgeEF4aXM6IHtcbiAgICAgICAgbGluZUNvbG9yOiAodGhpcy5pc05pZ2h0TW9kZSkgPyAnIzUwNTA1MCcgOiAnI2UzZTNlMycsXG4gICAgICAgIHRpY2tDb2xvcjogKHRoaXMuaXNOaWdodE1vZGUpID8gJyM1MDUwNTAnIDogJyNlM2UzZTMnLFxuICAgICAgICB0aWNrTGVuZ3RoOiA3LFxuICAgICAgfSxcbiAgICAgIFxuICAgICAgeUF4aXM6IFt7IC8vIFZvbHVtZSB5QXhpc1xuICAgICAgICBsaW5lV2lkdGg6IDEsXG4gICAgICAgIGxpbmVDb2xvcjogJyNkZWRlZGUnLFxuICAgICAgICB0aWNrV2lkdGg6IDEsXG4gICAgICAgIHRpY2tMZW5ndGg6IDQsXG4gICAgICAgIGdyaWRMaW5lRGFzaFN0eWxlOiAnZGFzaCcsXG4gICAgICAgIGdyaWRMaW5lV2lkdGg6IDAsXG4gICAgICAgIGZsb29yOiAwLFxuICAgICAgICBtaW5QYWRkaW5nOiAwLFxuICAgICAgICBvcHBvc2l0ZTogZmFsc2UsXG4gICAgICAgIHNob3dFbXB0eTogZmFsc2UsXG4gICAgICAgIHNob3dMYXN0TGFiZWw6IGZhbHNlLFxuICAgICAgICBzaG93Rmlyc3RMYWJlbDogZmFsc2UsXG4gICAgICB9LCB7XG4gICAgICAgIGdyaWRMaW5lQ29sb3I6ICh0aGlzLmlzTmlnaHRNb2RlKSA/ICcjNTA1MDUwJyA6ICcjZTNlM2UzJyxcbiAgICAgICAgZ3JpZExpbmVEYXNoU3R5bGU6ICdkYXNoJyxcbiAgICAgICAgbGluZVdpZHRoOiAxLFxuICAgICAgICB0aWNrV2lkdGg6IDEsXG4gICAgICAgIHRpY2tMZW5ndGg6IDQsXG4gICAgICAgIGZsb29yOiAwLFxuICAgICAgICBtaW5QYWRkaW5nOiAwLFxuICAgICAgICBzaG93RW1wdHk6IGZhbHNlLFxuICAgICAgICBvcHBvc2l0ZTogdHJ1ZSxcbiAgICAgICAgZ3JpZFpJbmRleDogNCxcbiAgICAgICAgc2hvd0xhc3RMYWJlbDogZmFsc2UsXG4gICAgICAgIHNob3dGaXJzdExhYmVsOiBmYWxzZSxcbiAgICAgIH1dLFxuICAgICAgXG4gICAgICBzZXJpZXM6IFtcbiAgICAgICAgeyAvL29yZGVyIG9mIHRoZSBzZXJpZXMgbWF0dGVyc1xuICAgICAgICAgIGNvbG9yOiAnIzUwODVlYycsXG4gICAgICAgICAgbmFtZTogJ1ByaWNlJyxcbiAgICAgICAgICBpZDogJ3ByaWNlJyxcbiAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgICB0eXBlOiAnYXJlYScsXG4gICAgICAgICAgZmlsbE9wYWNpdHk6IDAuMTUsXG4gICAgICAgICAgbGluZVdpZHRoOiAyLFxuICAgICAgICAgIHlBeGlzOiAxLFxuICAgICAgICAgIHpJbmRleDogMixcbiAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgIGNsaWNrYWJsZTogdHJ1ZSxcbiAgICAgICAgICB0aHJlc2hvbGQ6IG51bGwsXG4gICAgICAgICAgdG9vbHRpcDoge1xuICAgICAgICAgICAgdmFsdWVEZWNpbWFsczogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2hvd0luTmF2aWdhdG9yOiB0cnVlLFxuICAgICAgICAgIHNob3dJbkxlZ2VuZDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjb2xvcjogYHVybCgjZmlsbC1wYXR0ZXJuJHsodGhpcy5pc05pZ2h0TW9kZSkgPyAnLW5pZ2h0JyA6ICcnfSlgLFxuICAgICAgICAgIG5hbWU6ICdWb2x1bWUnLFxuICAgICAgICAgIGlkOiAndm9sdW1lJyxcbiAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgICB0eXBlOiAnYXJlYScsXG4gICAgICAgICAgZmlsbE9wYWNpdHk6IDAuNSxcbiAgICAgICAgICBsaW5lV2lkdGg6IDAsXG4gICAgICAgICAgeUF4aXM6IDAsXG4gICAgICAgICAgekluZGV4OiAwLFxuICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgY2xpY2thYmxlOiB0cnVlLFxuICAgICAgICAgIHRocmVzaG9sZDogbnVsbCxcbiAgICAgICAgICB0b29sdGlwOiB7XG4gICAgICAgICAgICB2YWx1ZURlY2ltYWxzOiAwLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2hvd0luTmF2aWdhdG9yOiB0cnVlLFxuICAgICAgICB9XVxuICAgIH1cbiAgfVxuICBcbiAgaW5pdCgpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZU9wdGlvbnModGhpcy5vcHRpb25zKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChvcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gKHdpbmRvdy5IaWdoY2hhcnRzKSA/IEhpZ2hjaGFydHMuc3RvY2tDaGFydCh0aGlzLmNvbnRhaW5lci5pZCwgb3B0aW9ucywgKGNoYXJ0KSA9PiB0aGlzLmJpbmQoY2hhcnQpKSA6IG51bGw7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHBhcnNlT3B0aW9ucyhvcHRpb25zKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLnVwZGF0ZU9iamVjdCh0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChuZXdPcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAudXBkYXRlT2JqZWN0KHRoaXMuZ2V0Vm9sdW1lUGF0dGVybigpLCBuZXdPcHRpb25zKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChuZXdPcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zZXROYXZpZ2F0b3IobmV3T3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigobmV3T3B0aW9ucykgPT4ge1xuICAgICAgcmV0dXJuIChuZXdPcHRpb25zLm5vRGF0YSkgPyB0aGlzLnNldE5vRGF0YUxhYmVsKG5ld09wdGlvbnMpIDogbmV3T3B0aW9ucztcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChuZXdPcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gbmV3T3B0aW9ucztcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgYmluZChjaGFydCl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNoYXJ0ID0gY2hhcnQ7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5mZXRjaERhdGFQYWNrYWdlKCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRSYW5nZVN3aXRjaGVyKCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gKHRoaXMuY2FsbGJhY2spID8gdGhpcy5jYWxsYmFjayh0aGlzLmNoYXJ0LCB0aGlzLmRlZmF1bHRSYW5nZSkgOiBudWxsO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBmZXRjaERhdGFQYWNrYWdlKG1pbkRhdGUsIG1heERhdGUpe1xuICAgIGxldCBpc1ByZWNpc2VSYW5nZSA9IChtaW5EYXRlICYmIG1heERhdGUpO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNwRXZlbnRzKXtcbiAgICAgICAgbGV0IHVybCA9IChpc1ByZWNpc2VSYW5nZSkgPyB0aGlzLmdldE5hdmlnYXRvckV4dHJlbWVzVXJsKG1pbkRhdGUsIG1heERhdGUsICdldmVudHMnKSA6IHRoaXMuZ2V0RXh0cmVtZXNEYXRhVXJsKHRoaXMuaWQsICdldmVudHMnKSArICcvJyArIHRoaXMuZ2V0UmFuZ2UoKSArICcvJztcbiAgICAgICAgcmV0dXJuICh1cmwpID8gdGhpcy5mZXRjaERhdGEodXJsLCAnZXZlbnRzJywgIWlzUHJlY2lzZVJhbmdlKSA6IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGxldCB1cmwgPSAoKGlzUHJlY2lzZVJhbmdlKSA/IHRoaXMuZ2V0TmF2aWdhdG9yRXh0cmVtZXNVcmwobWluRGF0ZSwgbWF4RGF0ZSkgOiB0aGlzLmFzeW5jVXJsLnJlcGxhY2UoJ19yYW5nZV8nLCB0aGlzLmdldFJhbmdlKCkpKSArIHRoaXMuYXN5bmNQYXJhbXM7XG4gICAgICByZXR1cm4gKHVybCkgPyB0aGlzLmZldGNoRGF0YSh1cmwsICdkYXRhJywgIWlzUHJlY2lzZVJhbmdlKSA6IG51bGw7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFydC5yZWRyYXcoZmFsc2UpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuICghaXNQcmVjaXNlUmFuZ2UpID8gdGhpcy5jaGFydC56b29tT3V0KCkgOiBudWxsO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaXNMb2FkZWQgPSB0cnVlO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMudG9nZ2xlRXZlbnRzKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGZldGNoRGF0YSh1cmwsIGRhdGFUeXBlID0gJ2RhdGEnLCByZXBsYWNlID0gdHJ1ZSl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuY2hhcnQuc2hvd0xvYWRpbmcoKTtcbiAgICAgIHJldHVybiBmZXRjaFNlcnZpY2UuZmV0Y2hDaGFydERhdGEodXJsLCAhdGhpcy5pc0xvYWRlZCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHRoaXMuY2hhcnQuaGlkZUxvYWRpbmcoKTtcbiAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICByZXR1cm4gY29uc29sZS5sb2coYExvb2tzIGxpa2UgdGhlcmUgd2FzIGEgcHJvYmxlbS4gU3RhdHVzIENvZGU6ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhUGFyc2VyKGRhdGEsIGRhdGFUeXBlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGNvbnRlbnQpID0+IHtcbiAgICAgICAgICByZXR1cm4gKHJlcGxhY2UpID8gdGhpcy5yZXBsYWNlRGF0YShjb250ZW50LmRhdGEsIGRhdGFUeXBlKSA6IHRoaXMudXBkYXRlRGF0YShjb250ZW50LmRhdGEsIGRhdGFUeXBlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICB0aGlzLmNoYXJ0LmhpZGVMb2FkaW5nKCk7XG4gICAgICB0aGlzLmhpZGVDaGFydCgpO1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCdGZXRjaCBFcnJvcicsIGVycm9yKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgaGlkZUNoYXJ0KGJvb2wgPSB0cnVlKXtcbiAgICBjb25zdCBjbGFzc0Z1bmMgPSAoYm9vbCkgPyAnYWRkJyA6ICdyZW1vdmUnO1xuICAgIGNvbnN0IHNpYmxpbmdzID0gY3BCb290c3RyYXAubm9kZUxpc3RUb0FycmF5KHRoaXMuY29udGFpbmVyLnBhcmVudEVsZW1lbnQuY2hpbGROb2Rlcyk7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBzaWJsaW5ncy5maWx0ZXIoZWxlbWVudCA9PiBlbGVtZW50LmlkLnNlYXJjaCgnY2hhcnQnKSA9PT0gLTEpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AocmVzdWx0LCBlbGVtZW50ID0+IGVsZW1lbnQuY2xhc3NMaXN0W2NsYXNzRnVuY10oJ2NwLWhpZGRlbicpKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRhaW5lci5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdFtjbGFzc0Z1bmNdKCdjcC1jaGFydC1uby1kYXRhJyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHNldFJhbmdlU3dpdGNoZXIoKXtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGAkeyB0aGlzLmlkIH0tc3dpdGNoLXJhbmdlYCwgKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLmRlZmF1bHRSYW5nZSA9IGV2ZW50LmRldGFpbC5kYXRhO1xuICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hEYXRhUGFja2FnZSgpO1xuICAgIH0pO1xuICB9XG4gIFxuICBnZXRSYW5nZSgpe1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRSYW5nZSB8fCAnMXEnO1xuICB9XG4gIFxuICB0b2dnbGVFdmVudHMoKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY3BFdmVudHMpe1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdoaWdoY2hhcnRzLWFubm90YXRpb24nKTtcbiAgICAgIH0pO1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoZWxlbWVudHMpID0+IHtcbiAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AoZWxlbWVudHMsIGVsZW1lbnQgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmlzRXZlbnRzSGlkZGVuKXtcbiAgICAgICAgICAgIHJldHVybiAoIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWdoY2hhcnRzLWFubm90YXRpb25fX2hpZGRlbicpKSA/IGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlnaGNoYXJ0cy1hbm5vdGF0aW9uX19oaWRkZW4nKSA6IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZ2hjaGFydHMtYW5ub3RhdGlvbl9faGlkZGVuJykpID8gZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdoY2hhcnRzLWFubm90YXRpb25fX2hpZGRlbicpIDogbnVsbDtcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdoaWdoY2hhcnRzLXBsb3QtbGluZScpO1xuICAgICAgfSk7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChlbGVtZW50cykgPT4ge1xuICAgICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChlbGVtZW50cywgZWxlbWVudCA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNFdmVudHNIaWRkZW4pe1xuICAgICAgICAgICAgcmV0dXJuICghZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZ2hjaGFydHMtcGxvdC1saW5lX19oaWRkZW4nKSkgPyBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZ2hjaGFydHMtcGxvdC1saW5lX19oaWRkZW4nKSA6IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZ2hjaGFydHMtcGxvdC1saW5lX19oaWRkZW4nKSkgPyBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hjaGFydHMtcGxvdC1saW5lX19oaWRkZW4nKSA6IG51bGw7XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGRhdGFQYXJzZXIoZGF0YSwgZGF0YVR5cGUgPSAnZGF0YScpe1xuICAgIHN3aXRjaCAoZGF0YVR5cGUpe1xuICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgIGxldCBwcm9taXNlRGF0YSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlRGF0YSA9IHByb21pc2VEYXRhLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiAodGhpcy5jaGFydERhdGFQYXJzZXIpID8gdGhpcy5jaGFydERhdGFQYXJzZXIoZGF0YSkgOiB7XG4gICAgICAgICAgICBkYXRhOiBkYXRhWzBdLFxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZURhdGE7XG4gICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGRhdGEpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIFxuICB1cGRhdGVEYXRhKGRhdGEsIGRhdGFUeXBlKSB7XG4gICAgbGV0IG5ld0RhdGE7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHN3aXRjaCAoZGF0YVR5cGUpIHtcbiAgICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgICAgbmV3RGF0YSA9IHt9O1xuICAgICAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKE9iamVjdC5lbnRyaWVzKGRhdGEpLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRXhjbHVkZWQodmFsdWVbMF0pKSByZXR1cm47XG4gICAgICAgICAgICBsZXQgb2xkRGF0YSA9IHRoaXMuZ2V0T2xkRGF0YShkYXRhVHlwZSlbdmFsdWVbMF1dO1xuICAgICAgICAgICAgbmV3RGF0YVt2YWx1ZVswXV0gPSBvbGREYXRhXG4gICAgICAgICAgICAgIC5maWx0ZXIoKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVbMV0uZmluZEluZGV4KGZpbmRFbGVtZW50ID0+IHRoaXMuaXNUaGVTYW1lRWxlbWVudChlbGVtZW50LCBmaW5kRWxlbWVudCwgZGF0YVR5cGUpKSA9PT0gLTE7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5jb25jYXQodmFsdWVbMV0pXG4gICAgICAgICAgICAgIC5zb3J0KChkYXRhMSwgZGF0YTIpID0+IHRoaXMuc29ydENvbmRpdGlvbihkYXRhMSwgZGF0YTIsIGRhdGFUeXBlKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgICAgbmV3RGF0YSA9IFtdO1xuICAgICAgICAgIGxldCBvbGREYXRhID0gdGhpcy5nZXRPbGREYXRhKGRhdGFUeXBlKTtcbiAgICAgICAgICByZXR1cm4gbmV3RGF0YSA9IG9sZERhdGFcbiAgICAgICAgICAgIC5maWx0ZXIoKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgZGF0YS5maW5kSW5kZXgoZmluZEVsZW1lbnQgPT4gdGhpcy5pc1RoZVNhbWVFbGVtZW50KGVsZW1lbnQsIGZpbmRFbGVtZW50LCBkYXRhVHlwZSkpID09PSAtMTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY29uY2F0KGRhdGEpXG4gICAgICAgICAgICAuc29ydCgoZGF0YTEsIGRhdGEyKSA9PiB0aGlzLnNvcnRDb25kaXRpb24oZGF0YTEsIGRhdGEyLCBkYXRhVHlwZSkpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VEYXRhKG5ld0RhdGEsIGRhdGFUeXBlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgaXNUaGVTYW1lRWxlbWVudChlbGVtZW50QSwgZWxlbWVudEIsIGRhdGFUeXBlKXtcbiAgICBzd2l0Y2ggKGRhdGFUeXBlKXtcbiAgICAgIGNhc2UgJ2RhdGEnOlxuICAgICAgICByZXR1cm4gZWxlbWVudEFbMF0gPT09IGVsZW1lbnRCWzBdO1xuICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRBLnRzID09PSBlbGVtZW50Qi50cztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgXG4gIHNvcnRDb25kaXRpb24oZWxlbWVudEEsIGVsZW1lbnRCLCBkYXRhVHlwZSl7XG4gICAgc3dpdGNoIChkYXRhVHlwZSl7XG4gICAgICBjYXNlICdkYXRhJzpcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRBWzBdIC0gZWxlbWVudEJbMF07XG4gICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICByZXR1cm4gZWxlbWVudEEudHMgLSBlbGVtZW50Qi50cztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgXG4gIGdldE9sZERhdGEoZGF0YVR5cGUpe1xuICAgIHJldHVybiB0aGlzWydjaGFydF8nK2RhdGFUeXBlLnRvTG93ZXJDYXNlKCldO1xuICB9XG4gIFxuICByZXBsYWNlRGF0YShkYXRhLCBkYXRhVHlwZSl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzWydjaGFydF8nK2RhdGFUeXBlLnRvTG93ZXJDYXNlKCldID0gZGF0YTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VEYXRhVHlwZShkYXRhLCBkYXRhVHlwZSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gKHRoaXMucmVwbGFjZUNhbGxiYWNrKSA/IHRoaXMucmVwbGFjZUNhbGxiYWNrKHRoaXMuY2hhcnQsIGRhdGEsIHRoaXMuaXNMb2FkZWQsIGRhdGFUeXBlKSA6IG51bGw7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHJlcGxhY2VEYXRhVHlwZShkYXRhLCBkYXRhVHlwZSl7XG4gICAgc3dpdGNoIChkYXRhVHlwZSl7XG4gICAgICBjYXNlICdkYXRhJzpcbiAgICAgICAgaWYgKHRoaXMuYXN5bmNVcmwpe1xuICAgICAgICAgIGNwQm9vdHN0cmFwLmxvb3AoWydidGMtYml0Y29pbicsICdldGgtZXRoZXJldW0nXSwgY29pbk5hbWUgPT4ge1xuICAgICAgICAgICAgbGV0IGNvaW5TaG9ydCA9IGNvaW5OYW1lLnNwbGl0KCctJylbMF07XG4gICAgICAgICAgICBpZiAodGhpcy5hc3luY1VybC5zZWFyY2goY29pbk5hbWUpID4gLTEgJiYgZGF0YVtjb2luU2hvcnRdKSB7XG4gICAgICAgICAgICAgIGRhdGFbY29pblNob3J0XSA9IFtdO1xuICAgICAgICAgICAgICBjcEJvb3RzdHJhcC5sb29wKHRoaXMuY2hhcnQuc2VyaWVzLCBzZXJpZXMgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzZXJpZXMudXNlck9wdGlvbnMuaWQgPT09IGNvaW5TaG9ydCkgc2VyaWVzLnVwZGF0ZSh7IHZpc2libGU6IGZhbHNlIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChPYmplY3QuZW50cmllcyhkYXRhKSwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNFeGNsdWRlZCh2YWx1ZVswXSkpIHJldHVybjtcbiAgICAgICAgICByZXR1cm4gKHRoaXMuY2hhcnQuZ2V0KHZhbHVlWzBdKSkgPyB0aGlzLmNoYXJ0LmdldCh2YWx1ZVswXSkuc2V0RGF0YSh2YWx1ZVsxXSwgZmFsc2UsIGZhbHNlLCBmYWxzZSkgOiB0aGlzLmNoYXJ0LmFkZFNlcmllcyh7aWQ6IHZhbHVlWzBdLCBkYXRhOiB2YWx1ZVsxXSwgc2hvd0luTmF2aWdhdG9yOiB0cnVlfSk7XG4gICAgICAgIH0pO1xuICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AodGhpcy5jaGFydC5hbm5vdGF0aW9ucy5hbGxJdGVtcywgYW5ub3RhdGlvbiA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYW5ub3RhdGlvbi5kZXN0cm95KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRBbm5vdGF0aW9uc09iamVjdHMoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuICBcbiAgaXNFeGNsdWRlZChsYWJlbCl7XG4gICAgcmV0dXJuIHRoaXMuZXhjbHVkZVNlcmllc0lkcy5pbmRleE9mKGxhYmVsKSA+IC0xO1xuICB9XG4gIFxuICB0b29sdGlwRm9ybWF0dGVyKHBvaW50ZXIsIGxhYmVsID0gJycsIHNlYXJjaCl7XG4gICAgaWYgKCFzZWFyY2gpIHNlYXJjaCA9IGxhYmVsO1xuICAgIGNvbnN0IGhlYWRlciA9ICc8ZGl2IGNsYXNzPVwiY3AtY2hhcnQtdG9vbHRpcC1jdXJyZW5jeVwiPjxzbWFsbD4nK25ldyBEYXRlKHBvaW50ZXIueCkudG9VVENTdHJpbmcoKSsnPC9zbWFsbD48dGFibGU+JztcbiAgICBjb25zdCBmb290ZXIgPSAnPC90YWJsZT48L2Rpdj4nO1xuICAgIGxldCBjb250ZW50ID0gJyc7XG4gICAgcG9pbnRlci5wb2ludHMuZm9yRWFjaChwb2ludCA9PiB7XG4gICAgICBjb250ZW50ICs9ICc8dHI+JyArXG4gICAgICAgICc8dGQgY2xhc3M9XCJjcC1jaGFydC10b29sdGlwLWN1cnJlbmN5X19yb3dcIj4nICtcbiAgICAgICAgJzxzdmcgY2xhc3M9XCJjcC1jaGFydC10b29sdGlwLWN1cnJlbmN5X19pY29uXCIgd2lkdGg9XCI1XCIgaGVpZ2h0PVwiNVwiPjxyZWN0IHg9XCIwXCIgeT1cIjBcIiB3aWR0aD1cIjVcIiBoZWlnaHQ9XCI1XCIgZmlsbD1cIicrcG9pbnQuc2VyaWVzLmNvbG9yKydcIiBmaWxsLW9wYWNpdHk9XCIxXCI+PC9yZWN0Pjwvc3ZnPicgK1xuICAgICAgICBwb2ludC5zZXJpZXMubmFtZSArICc6ICcgKyBwb2ludC55LnRvTG9jYWxlU3RyaW5nKCdydS1SVScsIHsgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiA4IH0pLnJlcGxhY2UoJywnLCAnLicpICsgJyAnICsgKChwb2ludC5zZXJpZXMubmFtZS50b0xvd2VyQ2FzZSgpLnNlYXJjaChzZWFyY2gudG9Mb3dlckNhc2UoKSkgPiAtMSkgPyBcIlwiIDogbGFiZWwpICtcbiAgICAgICAgJzwvdGQ+JyArXG4gICAgICAgICc8L3RyPic7XG4gICAgfSk7XG4gICAgcmV0dXJuIGhlYWRlciArIGNvbnRlbnQgKyBmb290ZXI7XG4gIH1cbiAgXG4gIHNldEFubm90YXRpb25zT2JqZWN0cyhkYXRhKXtcbiAgICB0aGlzLmNoYXJ0LnNlcmllc1swXS54QXhpcy5yZW1vdmVQbG90TGluZSgpO1xuICAgIGxldCBwbG90TGluZXMgPSBbXTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGRhdGEuc29ydCgoZGF0YTEsIGRhdGEyKSA9PiB7XG4gICAgICAgIHJldHVybiBkYXRhMi50cyAtIGRhdGExLnRzO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChkYXRhLCBlbGVtZW50ID0+IHtcbiAgICAgICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHBsb3RMaW5lcy5wdXNoKHtcbiAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgdmFsdWU6IGVsZW1lbnQudHMsXG4gICAgICAgICAgICBkYXNoU3R5bGU6ICdzb2xpZCcsXG4gICAgICAgICAgICB6SW5kZXg6IDQsXG4gICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRFdmVudFRhZ1BhcmFtcygpLmNvbG9yLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY2hhcnQuYWRkQW5ub3RhdGlvbih7XG4gICAgICAgICAgICB4VmFsdWU6IGVsZW1lbnQudHMsXG4gICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgdGl0bGU6IGA8c3BhbiB0aXRsZT1cIkNsaWNrIHRvIG9wZW5cIiBjbGFzcz1cImNwLWNoYXJ0LWFubm90YXRpb25fX3RleHRcIj4keyB0aGlzLmdldEV2ZW50VGFnUGFyYW1zKGVsZW1lbnQudGFnKS5sYWJlbCB9PC9zcGFuPjxzcGFuIGNsYXNzPVwiY3AtY2hhcnQtYW5ub3RhdGlvbl9fZGF0YUVsZW1lbnRcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+JHsgSlNPTi5zdHJpbmdpZnkoZWxlbWVudCkgfTwvc3Bhbj5gLFxuICAgICAgICAgICAgc2hhcGU6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ2NpcmNsZScsXG4gICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIHI6IDExLFxuICAgICAgICAgICAgICAgIGN4OiA5LFxuICAgICAgICAgICAgICAgIGN5OiAxMC41LFxuICAgICAgICAgICAgICAgICdzdHJva2Utd2lkdGgnOiAxLjUsXG4gICAgICAgICAgICAgICAgZmlsbDogdGhpcy5nZXRFdmVudFRhZ1BhcmFtcygpLmNvbG9yLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICBtb3VzZW92ZXI6IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChNb2JpbGVEZXRlY3QuaXNNb2JpbGUoKSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gdGhpcy5nZXRFdmVudERhdGFGcm9tQW5ub3RhdGlvbkV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5FdmVudENvbnRhaW5lcihkYXRhLCBldmVudCk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG1vdXNlb3V0OiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKE1vYmlsZURldGVjdC5pc01vYmlsZSgpKSByZXR1cm47XG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZUV2ZW50Q29udGFpbmVyKGV2ZW50KTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gdGhpcy5nZXRFdmVudERhdGFGcm9tQW5ub3RhdGlvbkV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgICAgICBpZiAoTW9iaWxlRGV0ZWN0LmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMub3BlbkV2ZW50Q29udGFpbmVyKGRhdGEsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuRXZlbnRQYWdlKGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNoYXJ0LnNlcmllc1swXS54QXhpcy51cGRhdGUoe1xuICAgICAgICBwbG90TGluZXMsXG4gICAgICB9LCBmYWxzZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHNldE5hdmlnYXRvcihvcHRpb25zKXtcbiAgICBsZXQgbmF2aWdhdG9yT3B0aW9ucyA9IHt9O1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBpZiAob3B0aW9ucy5uYXZpZ2F0b3IgPT09IHRydWUpe1xuICAgICAgICBuYXZpZ2F0b3JPcHRpb25zID0ge1xuICAgICAgICAgIG5hdmlnYXRvcjoge1xuICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgbWFyZ2luOiAyMCxcbiAgICAgICAgICAgIHNlcmllczoge1xuICAgICAgICAgICAgICBsaW5lV2lkdGg6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWFza0ZpbGw6ICdyZ2JhKDEwMiwxMzMsMTk0LDAuMTUpJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICB6b29tVHlwZTogJ3gnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgeEF4aXM6IHtcbiAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICBzZXRFeHRyZW1lczogKGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoKGUudHJpZ2dlciA9PT0gJ25hdmlnYXRvcicgfHwgZS50cmlnZ2VyID09PSAnem9vbScpICYmIGUubWluICYmIGUubWF4KSB7XG4gICAgICAgICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCh0aGlzLmlkKydTZXRFeHRyZW1lcycsIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgbWluRGF0ZTogZS5taW4sXG4gICAgICAgICAgICAgICAgICAgICAgbWF4RGF0ZTogZS5tYXgsXG4gICAgICAgICAgICAgICAgICAgICAgZSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5uYXZpZ2F0b3JFeHRyZW1lc0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuc2V0UmVzZXRab29tQnV0dG9uKCk7XG4gICAgICB9IGVsc2UgaWYgKCFvcHRpb25zLm5hdmlnYXRvcikge1xuICAgICAgICBuYXZpZ2F0b3JPcHRpb25zID0ge1xuICAgICAgICAgIG5hdmlnYXRvcjoge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC51cGRhdGVPYmplY3Qob3B0aW9ucywgbmF2aWdhdG9yT3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHNldFJlc2V0Wm9vbUJ1dHRvbigpe1xuICAgIC8vIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTsgLy8gY2FudCBiZSBwb3NpdGlvbmVkIHByb3Blcmx5IGluIHBsb3RCb3gsIHNvIGl0cyBkaXNhYmxlZFxuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hZGRDb250YWluZXIodGhpcy5pZCwgJ1Jlc2V0Wm9vbScsICdjcC1jaGFydC1yZXNldC16b29tJywgJ2J1dHRvbicpXG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRDb250YWluZXIoJ1Jlc2V0Wm9vbScpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGVsZW1lbnQpID0+IHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgndWstYnV0dG9uJyk7XG4gICAgICBlbGVtZW50LmlubmVyVGV4dCA9ICdSZXNldCB6b29tJztcbiAgICAgIHJldHVybiBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICB0aGlzLmNoYXJ0Lnpvb21PdXQoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBuYXZpZ2F0b3JFeHRyZW1lc0xpc3RlbmVyKCkge1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmlkICsgJ1NldEV4dHJlbWVzJywgKGUpID0+IHtcbiAgICAgICAgbGV0IG1pbkRhdGUgPSBjcEJvb3RzdHJhcC5yb3VuZChlLmRldGFpbC5taW5EYXRlIC8gMTAwMCwgMCk7XG4gICAgICAgIGxldCBtYXhEYXRlID0gY3BCb290c3RyYXAucm91bmQoZS5kZXRhaWwubWF4RGF0ZSAvIDEwMDAsIDApO1xuICAgICAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5mZXRjaERhdGFQYWNrYWdlKG1pbkRhdGUsIG1heERhdGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgZ2V0TmF2aWdhdG9yRXh0cmVtZXNVcmwobWluRGF0ZSwgbWF4RGF0ZSwgZGF0YVR5cGUpe1xuICAgIGxldCBleHRyZW1lc0RhdGFVcmwgPSAoZGF0YVR5cGUpID8gdGhpcy5nZXRFeHRyZW1lc0RhdGFVcmwodGhpcy5pZCwgZGF0YVR5cGUpIDogdGhpcy5leHRyZW1lc0RhdGFVcmw7XG4gICAgcmV0dXJuIChtaW5EYXRlICYmIG1heERhdGUgJiYgZXh0cmVtZXNEYXRhVXJsKSA/IGV4dHJlbWVzRGF0YVVybCArJy9kYXRlcy8nK21pbkRhdGUrJy8nK21heERhdGUrJy8nIDogbnVsbDtcbiAgfVxuICBcbiAgc2V0Tm9EYXRhTGFiZWwob3B0aW9ucyl7XG4gICAgbGV0IG5vRGF0YU9wdGlvbnMgPSB7fTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgbm9EYXRhT3B0aW9ucyA9IHtcbiAgICAgICAgbGFuZzoge1xuICAgICAgICAgIG5vRGF0YTogJ1dlIGRvblxcJ3QgaGF2ZSBkYXRhIGZvciB0aGlzIHRpbWUgcGVyaW9kJ1xuICAgICAgICB9LFxuICAgICAgICBub0RhdGE6IHtcbiAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgZm9udEZhbWlseTogJ0FyaWFsJyxcbiAgICAgICAgICAgIGZvbnRTaXplOiAnMTRweCcsXG4gICAgICAgICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLnVwZGF0ZU9iamVjdChvcHRpb25zLCBub0RhdGFPcHRpb25zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgYWRkQ29udGFpbmVyKGlkLCBsYWJlbCwgY2xhc3NOYW1lLCB0YWdOYW1lID0gJ2Rpdicpe1xuICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xuICAgIGxldCBjaGFydENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICBjb250YWluZXIuaWQgPSBpZCArIGxhYmVsO1xuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgY2hhcnRDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgfVxuICBcbiAgZ2V0Q29udGFpbmVyKGxhYmVsKXtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCtsYWJlbCk7XG4gIH1cbiAgXG4gIGdldEV4dHJlbWVzRGF0YVVybChpZCwgZGF0YVR5cGUgPSAnZGF0YScpe1xuICAgIHJldHVybiAnL2N1cnJlbmN5LycrIGRhdGFUeXBlICsnLycrIHRoaXMuY3VycmVuY3k7XG4gIH1cbiAgXG4gIGdldFZvbHVtZVBhdHRlcm4oKXtcbiAgICByZXR1cm4ge1xuICAgICAgZGVmczoge1xuICAgICAgICBwYXR0ZXJuczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdpZCc6ICdmaWxsLXBhdHRlcm4nLFxuICAgICAgICAgICAgJ3BhdGgnOiB7XG4gICAgICAgICAgICAgIGQ6ICdNIDMgMCBMIDMgMTAgTSA4IDAgTCA4IDEwJyxcbiAgICAgICAgICAgICAgc3Ryb2tlOiBcIiNlM2UzZTNcIixcbiAgICAgICAgICAgICAgZmlsbDogJyNmMWYxZjEnLFxuICAgICAgICAgICAgICBzdHJva2VXaWR0aDogMixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnaWQnOiAnZmlsbC1wYXR0ZXJuLW5pZ2h0JyxcbiAgICAgICAgICAgICdwYXRoJzoge1xuICAgICAgICAgICAgICBkOiAnTSAzIDAgTCAzIDEwIE0gOCAwIEwgOCAxMCcsXG4gICAgICAgICAgICAgIHN0cm9rZTogXCIjOWI5YjliXCIsXG4gICAgICAgICAgICAgIGZpbGw6ICcjMzgzODM4JyxcbiAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IDIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cblxuY2xhc3MgYm9vdHN0cmFwQ2xhc3Mge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVtcHR5VmFsdWUgPSAwO1xuICAgIHRoaXMuZW1wdHlEYXRhID0gJy0nO1xuICB9XG4gIFxuICBub2RlTGlzdFRvQXJyYXkobm9kZUxpc3QpIHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobm9kZUxpc3QpO1xuICB9XG4gIFxuICBwYXJzZUludGVydmFsVmFsdWUodmFsdWUpIHtcbiAgICBsZXQgdGltZVN5bWJvbCA9ICcnLCBtdWx0aXBsaWVyID0gMTtcbiAgICBpZiAodmFsdWUuc2VhcmNoKCdzJykgPiAtMSkge1xuICAgICAgdGltZVN5bWJvbCA9ICdzJztcbiAgICAgIG11bHRpcGxpZXIgPSAxMDAwO1xuICAgIH1cbiAgICBpZiAodmFsdWUuc2VhcmNoKCdtJykgPiAtMSkge1xuICAgICAgdGltZVN5bWJvbCA9ICdtJztcbiAgICAgIG11bHRpcGxpZXIgPSA2MCAqIDEwMDA7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5zZWFyY2goJ2gnKSA+IC0xKSB7XG4gICAgICB0aW1lU3ltYm9sID0gJ2gnO1xuICAgICAgbXVsdGlwbGllciA9IDYwICogNjAgKiAxMDAwO1xuICAgIH1cbiAgICBpZiAodmFsdWUuc2VhcmNoKCdkJykgPiAtMSkge1xuICAgICAgdGltZVN5bWJvbCA9ICdkJztcbiAgICAgIG11bHRpcGxpZXIgPSAyNCAqIDYwICogNjAgKiAxMDAwO1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZS5yZXBsYWNlKHRpbWVTeW1ib2wsICcnKSkgKiBtdWx0aXBsaWVyO1xuICB9XG4gIFxuICBpc0ZpYXQoY3VycmVuY3ksIG9yaWdpbil7XG4gICAgaWYgKCFvcmlnaW4pIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGxldCB1cmwgPSBvcmlnaW4gKyAnL2Rpc3QvZGF0YS9jdXJyZW5jaWVzLmpzb24nO1xuICAgICAgcmV0dXJuIGZldGNoU2VydmljZS5mZXRjaEpzb25GaWxlKHVybCwgdHJ1ZSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICByZXR1cm4gKHJlc3VsdFtjdXJyZW5jeS50b1VwcGVyQ2FzZSgpXSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHVwZGF0ZU9iamVjdChvYmosIG5ld09iaikge1xuICAgIGxldCByZXN1bHQgPSBvYmo7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKE9iamVjdC5rZXlzKG5ld09iaiksIGtleSA9PiB7XG4gICAgICAgIGlmIChyZXN1bHQuaGFzT3duUHJvcGVydHkoa2V5KSAmJiB0eXBlb2YgcmVzdWx0W2tleV0gPT09ICdvYmplY3QnKXtcbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVPYmplY3QocmVzdWx0W2tleV0sIG5ld09ialtrZXldKS50aGVuKCh1cGRhdGVSZXN1bHQpID0+IHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdXBkYXRlUmVzdWx0O1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRba2V5XSA9IG5ld09ialtrZXldO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHBhcnNlQ3VycmVuY3lOdW1iZXIodmFsdWUsIGN1cnJlbmN5LCBvcmlnaW4pe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5pc0ZpYXQoY3VycmVuY3ksIG9yaWdpbik7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICByZXR1cm4gKHJlc3VsdCkgPyB0aGlzLnBhcnNlTnVtYmVyKHZhbHVlLCAyKSA6IHRoaXMucGFyc2VOdW1iZXIodmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBwYXJzZU51bWJlcihudW1iZXIsIHByZWNpc2lvbikge1xuICAgIGlmICghbnVtYmVyICYmIG51bWJlciAhPT0gMCkgcmV0dXJuIG51bWJlcjtcbiAgICBpZiAobnVtYmVyID09PSB0aGlzLmVtcHR5VmFsdWUgfHwgbnVtYmVyID09PSB0aGlzLmVtcHR5RGF0YSkgcmV0dXJuIG51bWJlcjtcbiAgICBudW1iZXIgPSBwYXJzZUZsb2F0KG51bWJlcik7XG4gICAgaWYgKG51bWJlciA+IDEwMDAwMCkge1xuICAgICAgbGV0IG51bWJlclN0ciA9IG51bWJlci50b0ZpeGVkKDApO1xuICAgICAgbGV0IHBhcmFtZXRlciA9ICdLJyxcbiAgICAgICAgc3BsaWNlZCA9IG51bWJlclN0ci5zbGljZSgwLCBudW1iZXJTdHIubGVuZ3RoIC0gMSk7XG4gICAgICBpZiAobnVtYmVyID4gMTAwMDAwMDAwMCkge1xuICAgICAgICBzcGxpY2VkID0gbnVtYmVyU3RyLnNsaWNlKDAsIG51bWJlclN0ci5sZW5ndGggLSA3KTtcbiAgICAgICAgcGFyYW1ldGVyID0gJ0InO1xuICAgICAgfSBlbHNlIGlmIChudW1iZXIgPiAxMDAwMDAwKSB7XG4gICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDQpO1xuICAgICAgICBwYXJhbWV0ZXIgPSAnTSc7XG4gICAgICB9XG4gICAgICBsZXQgbmF0dXJhbCA9IHNwbGljZWQuc2xpY2UoMCwgc3BsaWNlZC5sZW5ndGggLSAyKTtcbiAgICAgIGxldCBkZWNpbWFsID0gc3BsaWNlZC5zbGljZShzcGxpY2VkLmxlbmd0aCAtIDIpO1xuICAgICAgcmV0dXJuIG5hdHVyYWwgKyAnLicgKyBkZWNpbWFsICsgJyAnICsgcGFyYW1ldGVyO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgaXNEZWNpbWFsID0gKG51bWJlciAlIDEpID4gMDtcbiAgICAgIGlmIChpc0RlY2ltYWwpIHtcbiAgICAgICAgaWYgKCFwcmVjaXNpb24gfHwgbnVtYmVyIDwgMC4wMSl7XG4gICAgICAgICAgcHJlY2lzaW9uID0gMjtcbiAgICAgICAgICBpZiAobnVtYmVyIDwgMSkge1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gODtcbiAgICAgICAgICB9IGVsc2UgaWYgKG51bWJlciA8IDEwKSB7XG4gICAgICAgICAgICBwcmVjaXNpb24gPSA2O1xuICAgICAgICAgIH0gZWxzZSBpZiAobnVtYmVyIDwgMTAwMCkge1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gNDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucm91bmQobnVtYmVyLCBwcmVjaXNpb24pLnRvTG9jYWxlU3RyaW5nKCdydS1SVScsIHsgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiBwcmVjaXNpb24gfSkucmVwbGFjZSgnLCcsICcuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVtYmVyLnRvTG9jYWxlU3RyaW5nKCdydS1SVScsIHsgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyIH0pLnJlcGxhY2UoJywnLCAnLicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgcm91bmQoYW1vdW50LCBkZWNpbWFsID0gOCwgZGlyZWN0aW9uID0gJ3JvdW5kJykge1xuICAgIGFtb3VudCA9IHBhcnNlRmxvYXQoYW1vdW50KTtcbiAgICBkZWNpbWFsID0gTWF0aC5wb3coMTAsIGRlY2ltYWwpO1xuICAgIHJldHVybiBNYXRoW2RpcmVjdGlvbl0oYW1vdW50ICogZGVjaW1hbCkgLyBkZWNpbWFsO1xuICB9XG4gIFxuICBsb29wKGFyciwgZm4sIGJ1c3ksIGVyciwgaSA9IDApIHtcbiAgICBjb25zdCBib2R5ID0gKG9rLCBlcikgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgciA9IGZuKGFycltpXSwgaSwgYXJyKTtcbiAgICAgICAgciAmJiByLnRoZW4gPyByLnRoZW4ob2spLmNhdGNoKGVyKSA6IG9rKHIpXG4gICAgICB9XG4gICAgICBjYXRjaCAoZSkge1xuICAgICAgICBlcihlKVxuICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgbmV4dCA9IChvaywgZXIpID0+ICgpID0+IHRoaXMubG9vcChhcnIsIGZuLCBvaywgZXIsICsraSk7XG4gICAgY29uc3QgcnVuID0gKG9rLCBlcikgPT4gaSA8IGFyci5sZW5ndGggPyBuZXcgUHJvbWlzZShib2R5KS50aGVuKG5leHQob2ssIGVyKSkuY2F0Y2goZXIpIDogb2soKTtcbiAgICByZXR1cm4gYnVzeSA/IHJ1bihidXN5LCBlcnIpIDogbmV3IFByb21pc2UocnVuKVxuICB9XG59XG5cbmNsYXNzIGZldGNoQ2xhc3Mge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMuc3RhdGUgPSB7fTtcbiAgfVxuICBcbiAgZmV0Y2hTY3JpcHQodXJsKSB7XG4gICAgaWYgKHRoaXMuc3RhdGVbdXJsXSkgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICB0aGlzLnN0YXRlW3VybF0gPSAncGVuZGluZyc7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlKSB0aGlzLnN0YXRlW3VybF0gPSAnZG93bmxvYWRlZCc7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgICAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSkgZGVsZXRlIHRoaXMuc3RhdGVbdXJsXTtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgRmFpbGVkIHRvIGxvYWQgaW1hZ2UncyBVUkw6ICR7dXJsfWApKTtcbiAgICAgIH0pO1xuICAgICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcbiAgICAgIHNjcmlwdC5zcmMgPSB1cmw7XG4gICAgfSk7XG4gIH1cbiAgXG4gIGZldGNoU3R5bGUodXJsKSB7XG4gICAgaWYgKHRoaXMuc3RhdGVbdXJsXSkgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICB0aGlzLnN0YXRlW3VybF0gPSAncGVuZGluZyc7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG4gICAgICBsaW5rLnNldEF0dHJpYnV0ZSgncmVsJywgJ3N0eWxlc2hlZXQnKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnaHJlZicsIHVybCk7XG4gICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlKSB0aGlzLnN0YXRlW3VybF0gPSAnZG93bmxvYWRlZCc7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUpIGRlbGV0ZSB0aGlzLnN0YXRlW3VybF07XG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYEZhaWxlZCB0byBsb2FkIHN0eWxlIFVSTDogJHt1cmx9YCkpO1xuICAgICAgfSk7XG4gICAgICBsaW5rLmhyZWYgPSB1cmw7XG4gICAgfSk7XG4gIH1cbiAgXG4gIGZldGNoQ2hhcnREYXRhKHVyaSwgZnJvbVN0YXRlID0gZmFsc2Upe1xuICAgIGNvbnN0IHVybCA9ICdodHRwczovL2dyYXBocy5jb2lucGFwcmlrYS5jb20nICsgdXJpO1xuICAgIHJldHVybiB0aGlzLmZldGNoRGF0YSh1cmwsIGZyb21TdGF0ZSk7XG4gIH1cbiAgXG4gIGZldGNoRGF0YSh1cmwsIGZyb21TdGF0ZSA9IGZhbHNlKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKGZyb21TdGF0ZSl7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlW3VybF0gPT09ICdwZW5kaW5nJyl7XG4gICAgICAgICAgbGV0IHByb21pc2VUaW1lb3V0ID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIHJlc29sdmUodGhpcy5mZXRjaERhdGEodXJsLCBmcm9tU3RhdGUpKTtcbiAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHByb21pc2VUaW1lb3V0O1xuICAgICAgICB9XG4gICAgICAgIGlmICghIXRoaXMuc3RhdGVbdXJsXSl7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLnN0YXRlW3VybF0uY2xvbmUoKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuc3RhdGVbdXJsXSA9ICdwZW5kaW5nJztcbiAgICAgIGxldCBwcm9taXNlRmV0Y2ggPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIHByb21pc2VGZXRjaCA9IHByb21pc2VGZXRjaC50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCk7XG4gICAgICB9KTtcbiAgICAgIHByb21pc2VGZXRjaCA9IHByb21pc2VGZXRjaC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICB0aGlzLnN0YXRlW3VybF0gPSByZXNwb25zZTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmNsb25lKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwcm9taXNlRmV0Y2g7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGZldGNoSnNvbkZpbGUodXJsLCBmcm9tU3RhdGUgPSBmYWxzZSl7XG4gICAgcmV0dXJuIHRoaXMuZmV0Y2hEYXRhKHVybCwgZnJvbVN0YXRlKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICBpZiAocmVzdWx0LnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQuanNvbigpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCB3aWRnZXRzID0gbmV3IHdpZGdldHNDb250cm9sbGVyKCk7XG5jb25zdCBjcEJvb3RzdHJhcCA9IG5ldyBib290c3RyYXBDbGFzcygpO1xuY29uc3QgZmV0Y2hTZXJ2aWNlID0gbmV3IGZldGNoQ2xhc3MoKTtcbiJdfQ==
