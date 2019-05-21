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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7SUNBTSxpQjtBQUNKLCtCQUFjO0FBQUE7O0FBQ1osU0FBSyxPQUFMLEdBQWUsSUFBSSxZQUFKLEVBQWY7QUFDQSxTQUFLLElBQUw7QUFDRDs7OzsyQkFFSztBQUFBOztBQUNKLGFBQU8sS0FBSyxPQUFMLENBQWEsUUFBYixDQUFzQixVQUE3QixJQUEyQyxFQUEzQztBQUNBLGVBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDO0FBQUEsZUFBTSxNQUFLLFdBQUwsRUFBTjtBQUFBLE9BQTlDLEVBQXdFLEtBQXhFO0FBQ0EsYUFBTyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLFVBQXpDLEdBQXNELFlBQU07QUFDMUQsZUFBTyxNQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLElBQXpDLEdBQWdELEtBQWhEO0FBQ0EsY0FBSyxXQUFMO0FBQ0QsT0FIRDtBQUlEOzs7a0NBRVk7QUFBQTs7QUFDWCxVQUFJLENBQUMsT0FBTyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLElBQTlDLEVBQW1EO0FBQ2pELGVBQU8sS0FBSyxPQUFMLENBQWEsUUFBYixDQUFzQixVQUE3QixFQUF5QyxJQUF6QyxHQUFnRCxJQUFoRDtBQUNBLFlBQUksZUFBZSxNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsU0FBUyxzQkFBVCxDQUFnQyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFNBQXRELENBQTNCLENBQW5CO0FBQ0EsYUFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixZQUE1QjtBQUNBLGVBQU8sZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsWUFBTTtBQUN0QyxpQkFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixZQUE1QjtBQUNBLGVB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QUFNO0FBQ3JDLGlCQUFPLE1BQU0sR0FBTixDQUFQO0FBQ0QsU0FGYyxDQUFmO0FBR0EsdUJBQWUsYUFBYSxJQUFiLENBQWtCLFVBQUMsUUFBRCxFQUFjO0FBQzdDLGtCQUFLLEtBQUwsQ0FBVyxHQUFYLElBQWtCLFFBQWxCO0FBQ0EsaUJBQU8sU0FBUyxLQUFULEVBQVA7QUFDRCxTQUhjLENBQWY7QUFJQSxlQUFPLFlBQVA7QUFDRCxPQXhCUyxDQUFWO0FBeUJBLGFBQU8sT0FBUDtBQUNEOzs7a0NBRWEsRyxFQUF1QjtBQUFBLFVBQWxCLFNBQWtCLHVFQUFOLEtBQU07O0FBQ25DLGFBQU8sS0FBSyxTQUFMLENBQWUsR0FBZixFQUFvQixTQUFwQixFQUErQixJQUEvQixDQUFvQyxrQkFBVTtBQUNuRCxZQUFJLE9BQU8sTUFBUCxLQUFrQixHQUF0QixFQUEyQjtBQUN6QixpQkFBTyxPQUFPLElBQVAsRUFBUDtBQUNEO0FBQ0QsZUFBTyxLQUFQO0FBQ0QsT0FMTSxFQUtKLEtBTEksQ0FLRSxZQUFNO0FBQ2IsZUFBTyxLQUFQO0FBQ0QsT0FQTSxDQUFQO0FBUUQ7Ozs7OztBQUdILElBQU0sVUFBVSxJQUFJLGlCQUFKLEVBQWhCO0FBQ0EsSUFBTSxjQUFjLElBQUksY0FBSixFQUFwQjtBQUNBLElBQU0sZUFBZSxJQUFJLFVBQUosRUFBckIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjbGFzcyB3aWRnZXRzQ29udHJvbGxlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMud2lkZ2V0cyA9IG5ldyB3aWRnZXRzQ2xhc3MoKTtcbiAgICB0aGlzLmJpbmQoKTtcbiAgfVxuICBcbiAgYmluZCgpe1xuICAgIHdpbmRvd1t0aGlzLndpZGdldHMuZGVmYXVsdHMub2JqZWN0TmFtZV0gPSB7fTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4gdGhpcy5pbml0V2lkZ2V0cygpLCBmYWxzZSk7XG4gICAgd2luZG93W3RoaXMud2lkZ2V0cy5kZWZhdWx0cy5vYmplY3ROYW1lXS5iaW5kV2lkZ2V0ID0gKCkgPT4ge1xuICAgICAgd2luZG93W3RoaXMud2lkZ2V0cy5kZWZhdWx0cy5vYmplY3ROYW1lXS5pbml0ID0gZmFsc2U7XG4gICAgICB0aGlzLmluaXRXaWRnZXRzKCk7XG4gICAgfTtcbiAgfVxuICBcbiAgaW5pdFdpZGdldHMoKXtcbiAgICBpZiAoIXdpbmRvd1t0aGlzLndpZGdldHMuZGVmYXVsdHMub2JqZWN0TmFtZV0uaW5pdCl7XG4gICAgICB3aW5kb3dbdGhpcy53aWRnZXRzLmRlZmF1bHRzLm9iamVjdE5hbWVdLmluaXQgPSB0cnVlO1xuICAgICAgbGV0IG1haW5FbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy53aWRnZXRzLmRlZmF1bHRzLmNsYXNzTmFtZSkpO1xuICAgICAgdGhpcy53aWRnZXRzLnNldFdpZGdldENsYXNzKG1haW5FbGVtZW50cyk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgICB0aGlzLndpZGdldHMuc2V0V2lkZ2V0Q2xhc3MobWFpbkVsZW1lbnRzKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYWluRWxlbWVudHMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgIHRoaXMud2lkZ2V0cy5zZXRCZWZvcmVFbGVtZW50SW5Gb290ZXIoaSk7XG4gICAgICAgIH1cbiAgICAgIH0sIGZhbHNlKTtcbiAgICAgIGxldCBzY3JpcHRFbGVtZW50ID0gdGhpcy53aWRnZXRzLmdldFNjcmlwdEVsZW1lbnQoKTtcbiAgICAgIGlmIChzY3JpcHRFbGVtZW50ICYmIHNjcmlwdEVsZW1lbnQuZGF0YXNldCAmJiBzY3JpcHRFbGVtZW50LmRhdGFzZXQuY3BDdXJyZW5jeVdpZGdldCl7XG4gICAgICAgIGxldCBkYXRhc2V0ID0gSlNPTi5wYXJzZShzY3JpcHRFbGVtZW50LmRhdGFzZXQuY3BDdXJyZW5jeVdpZGdldCk7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhkYXRhc2V0KSl7XG4gICAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhkYXRhc2V0KTtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGtleXMubGVuZ3RoOyBqKyspe1xuICAgICAgICAgICAgbGV0IGtleSA9IGtleXNbal0ucmVwbGFjZSgnLScsICdfJyk7XG4gICAgICAgICAgICB0aGlzLndpZGdldHMuZGVmYXVsdHNba2V5XSA9IGRhdGFzZXRba2V5c1tqXV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy53aWRnZXRzLnN0YXRlcyA9IFtdO1xuICAgICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChtYWluRWxlbWVudHMsIChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICAgIGxldCBuZXdTZXR0aW5ncyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy53aWRnZXRzLmRlZmF1bHRzKSk7XG4gICAgICAgICAgbmV3U2V0dGluZ3MuaXNXb3JkcHJlc3MgPSBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnd29yZHByZXNzJyk7XG4gICAgICAgICAgbmV3U2V0dGluZ3MuaXNOaWdodE1vZGUgPSBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY3Atd2lkZ2V0X19uaWdodC1tb2RlJyk7XG4gICAgICAgICAgbmV3U2V0dGluZ3MubWFpbkVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICAgIHRoaXMud2lkZ2V0cy5zdGF0ZXMucHVzaChuZXdTZXR0aW5ncyk7XG4gICAgICAgICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGxldCBjaGFydFNjcmlwdHMgPSBbXG4gICAgICAgICAgICAgICcvL2NvZGUuaGlnaGNoYXJ0cy5jb20vc3RvY2svaGlnaHN0b2NrLmpzJyxcbiAgICAgICAgICAgICAgJy8vY29kZS5oaWdoY2hhcnRzLmNvbS9tb2R1bGVzL2V4cG9ydGluZy5qcycsXG4gICAgICAgICAgICAgICcvL2NvZGUuaGlnaGNoYXJ0cy5jb20vbW9kdWxlcy9uby1kYXRhLXRvLWRpc3BsYXkuanMnLFxuICAgICAgICAgICAgICAnLy9oaWdoY2hhcnRzLmdpdGh1Yi5pby9wYXR0ZXJuLWZpbGwvcGF0dGVybi1maWxsLXYyLmpzJyxcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICByZXR1cm4gKG5ld1NldHRpbmdzLm1vZHVsZXMuaW5kZXhPZignY2hhcnQnKSA+IC0xICYmICF3aW5kb3cuSGlnaGNoYXJ0cylcbiAgICAgICAgICAgICAgPyBjcEJvb3RzdHJhcC5sb29wKGNoYXJ0U2NyaXB0cywgbGluayA9PiB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmV0Y2hTZXJ2aWNlLmZldGNoU2NyaXB0KGxpbmspO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndpZGdldHMuaW5pdChpbmRleCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH0pO1xuICAgICAgfSwgNTApO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyB3aWRnZXRzQ2xhc3Mge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnN0YXRlcyA9IFtdO1xuICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICBvYmplY3ROYW1lOiAnY3BDdXJyZW5jeVdpZGdldHMnLFxuICAgICAgY2xhc3NOYW1lOiAnY29pbnBhcHJpa2EtY3VycmVuY3ktd2lkZ2V0JyxcbiAgICAgIGNzc0ZpbGVOYW1lOiAnd2lkZ2V0Lm1pbi5jc3MnLFxuICAgICAgY3VycmVuY3k6ICdidGMtYml0Y29pbicsXG4gICAgICBwcmltYXJ5X2N1cnJlbmN5OiAnVVNEJyxcbiAgICAgIHJhbmdlX2xpc3Q6IFsnMjRoJywgJzdkJywgJzMwZCcsICcxcScsICcxeScsICd5dGQnLCAnYWxsJ10sXG4gICAgICByYW5nZTogJzdkJyxcbiAgICAgIG1vZHVsZXM6IFsnbWFya2V0X2RldGFpbHMnLCAnY2hhcnQnXSxcbiAgICAgIHVwZGF0ZV9hY3RpdmU6IGZhbHNlLFxuICAgICAgdXBkYXRlX3RpbWVvdXQ6ICczMHMnLFxuICAgICAgbGFuZ3VhZ2U6ICdlbicsXG4gICAgICBzdHlsZV9zcmM6IG51bGwsXG4gICAgICBpbWdfc3JjOiBudWxsLFxuICAgICAgbGFuZ19zcmM6IG51bGwsXG4gICAgICBkYXRhX3NyYzogbnVsbCxcbiAgICAgIG9yaWdpbl9zcmM6ICdodHRwczovL3VucGtnLmNvbS9AY29pbnBhcHJpa2Evd2lkZ2V0LWN1cnJlbmN5QGxhdGVzdCcsXG4gICAgICBzaG93X2RldGFpbHNfY3VycmVuY3k6IGZhbHNlLFxuICAgICAgdGlja2VyOiB7XG4gICAgICAgIG5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgc3ltYm9sOiB1bmRlZmluZWQsXG4gICAgICAgIHByaWNlOiB1bmRlZmluZWQsXG4gICAgICAgIHByaWNlX2NoYW5nZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgICAgcmFuazogdW5kZWZpbmVkLFxuICAgICAgICBwcmljZV9hdGg6IHVuZGVmaW5lZCxcbiAgICAgICAgdm9sdW1lXzI0aDogdW5kZWZpbmVkLFxuICAgICAgICBtYXJrZXRfY2FwOiB1bmRlZmluZWQsXG4gICAgICAgIHBlcmNlbnRfZnJvbV9wcmljZV9hdGg6IHVuZGVmaW5lZCxcbiAgICAgICAgdm9sdW1lXzI0aF9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgICAgIG1hcmtldF9jYXBfY2hhbmdlXzI0aDogdW5kZWZpbmVkLFxuICAgICAgfSxcbiAgICAgIGludGVydmFsOiBudWxsLFxuICAgICAgaXNXb3JkcHJlc3M6IGZhbHNlLFxuICAgICAgaXNOaWdodE1vZGU6IGZhbHNlLFxuICAgICAgaXNEYXRhOiBmYWxzZSxcbiAgICAgIGF2YWlsYWJsZU1vZHVsZXM6IFsncHJpY2UnLCAnY2hhcnQnLCAnbWFya2V0X2RldGFpbHMnXSxcbiAgICAgIG1lc3NhZ2U6ICdkYXRhX2xvYWRpbmcnLFxuICAgICAgdHJhbnNsYXRpb25zOiB7fSxcbiAgICAgIG1haW5FbGVtZW50OiBudWxsLFxuICAgICAgbm9UcmFuc2xhdGlvbkxhYmVsczogW10sXG4gICAgICBzY3JpcHRzRG93bmxvYWRlZDoge30sXG4gICAgICBjaGFydDogbnVsbCxcbiAgICAgIHJ3ZDoge1xuICAgICAgICB4czogMjgwLFxuICAgICAgICBzOiAzMjAsXG4gICAgICAgIG06IDM3MCxcbiAgICAgICAgbDogNDYyLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG4gIFxuICBpbml0KGluZGV4KSB7XG4gICAgaWYgKCF0aGlzLmdldE1haW5FbGVtZW50KGluZGV4KSkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ0JpbmQgZmFpbGVkLCBubyBlbGVtZW50IHdpdGggY2xhc3MgPSBcIicgKyB0aGlzLmRlZmF1bHRzLmNsYXNzTmFtZSArICdcIicpO1xuICAgIH1cbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RGVmYXVsdHMoaW5kZXgpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0T3JpZ2luTGluayhpbmRleCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHNldFdpZGdldENsYXNzKGVsZW1lbnRzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHdpZHRoID0gZWxlbWVudHNbaV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgICBsZXQgcndkS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuZGVmYXVsdHMucndkKTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcndkS2V5cy5sZW5ndGg7IGorKykge1xuICAgICAgICBsZXQgcndkS2V5ID0gcndkS2V5c1tqXTtcbiAgICAgICAgbGV0IHJ3ZFBhcmFtID0gdGhpcy5kZWZhdWx0cy5yd2RbcndkS2V5XTtcbiAgICAgICAgbGV0IGNsYXNzTmFtZSA9IHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lICsgJ19fJyArIHJ3ZEtleTtcbiAgICAgICAgaWYgKHdpZHRoIDw9IHJ3ZFBhcmFtKSBlbGVtZW50c1tpXS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICAgIGlmICh3aWR0aCA+IHJ3ZFBhcmFtKSBlbGVtZW50c1tpXS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICBnZXRNYWluRWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiAodGhpcy5zdGF0ZXNbaW5kZXhdKSA/IHRoaXMuc3RhdGVzW2luZGV4XS5tYWluRWxlbWVudCA6IG51bGw7XG4gIH1cbiAgXG4gIGdldERlZmF1bHRzKGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgICBpZiAobWFpbkVsZW1lbnQgJiYgbWFpbkVsZW1lbnQuZGF0YXNldCkge1xuICAgICAgICBpZiAoIW1haW5FbGVtZW50LmRhdGFzZXQubW9kdWxlcyAmJiBtYWluRWxlbWVudC5kYXRhc2V0LnZlcnNpb24gPT09ICdleHRlbmRlZCcpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ21vZHVsZXMnLCBbJ21hcmtldF9kZXRhaWxzJ10pO1xuICAgICAgICBpZiAoIW1haW5FbGVtZW50LmRhdGFzZXQubW9kdWxlcyAmJiBtYWluRWxlbWVudC5kYXRhc2V0LnZlcnNpb24gPT09ICdzdGFuZGFyZCcpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ21vZHVsZXMnLCBbXSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lm1vZHVsZXMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ21vZHVsZXMnLCBKU09OLnBhcnNlKG1haW5FbGVtZW50LmRhdGFzZXQubW9kdWxlcykpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5wcmltYXJ5Q3VycmVuY3kpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3ByaW1hcnlfY3VycmVuY3knLCBtYWluRWxlbWVudC5kYXRhc2V0LnByaW1hcnlDdXJyZW5jeSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmN1cnJlbmN5KSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdjdXJyZW5jeScsIG1haW5FbGVtZW50LmRhdGFzZXQuY3VycmVuY3kpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5yYW5nZSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAncmFuZ2UnLCBtYWluRWxlbWVudC5kYXRhc2V0LnJhbmdlKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuc2hvd0RldGFpbHNDdXJyZW5jeSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnc2hvd19kZXRhaWxzX2N1cnJlbmN5JywgKG1haW5FbGVtZW50LmRhdGFzZXQuc2hvd0RldGFpbHNDdXJyZW5jeSA9PT0gJ3RydWUnKSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZUFjdGl2ZSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAndXBkYXRlX2FjdGl2ZScsIChtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZUFjdGl2ZSA9PT0gJ3RydWUnKSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZVRpbWVvdXQpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3VwZGF0ZV90aW1lb3V0JywgY3BCb290c3RyYXAucGFyc2VJbnRlcnZhbFZhbHVlKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlVGltZW91dCkpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5sYW5ndWFnZSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbGFuZ3VhZ2UnLCBtYWluRWxlbWVudC5kYXRhc2V0Lmxhbmd1YWdlKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQub3JpZ2luU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdvcmlnaW5fc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5vcmlnaW5TcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5ub2RlTW9kdWxlc1NyYykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbm9kZV9tb2R1bGVzX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQubm9kZU1vZHVsZXNTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5ib3dlclNyYykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnYm93ZXJfc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5ib3dlclNyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnN0eWxlU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdzdHlsZV9zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LnN0eWxlU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ1NyYykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbG9nb19zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LmxhbmdTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5pbWdTcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2xvZ29fc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5pbWdTcmMpO1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICB9KTtcbiAgfVxuICBcbiAgc2V0T3JpZ2luTGluayhpbmRleCkge1xuICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9ucykubGVuZ3RoID09PSAwKSB0aGlzLmdldFRyYW5zbGF0aW9ucyh0aGlzLmRlZmF1bHRzLmxhbmd1YWdlKTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc3R5bGVzaGVldCgpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuYWRkV2lkZ2V0RWxlbWVudChpbmRleCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5pbml0SW50ZXJ2YWwoaW5kZXgpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBhZGRXaWRnZXRFbGVtZW50KGluZGV4KSB7XG4gICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgbGV0IG1vZHVsZXMgPSAnJztcbiAgICBsZXQgbW9kdWxlc0FycmF5ID0gW107XG4gICAgbGV0IGNoYXJ0Q29udGFpbmVyID0gbnVsbDtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AodGhpcy5kZWZhdWx0cy5hdmFpbGFibGVNb2R1bGVzLCBtb2R1bGUgPT4ge1xuICAgICAgICByZXR1cm4gKHRoaXMuc3RhdGVzW2luZGV4XS5tb2R1bGVzLmluZGV4T2YobW9kdWxlKSA+IC0xKSA/IG1vZHVsZXNBcnJheS5wdXNoKG1vZHVsZSkgOiBudWxsO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChtb2R1bGVzQXJyYXksIG1vZHVsZSA9PiB7XG4gICAgICAgIGxldCBsYWJlbCA9IG51bGw7XG4gICAgICAgIGlmIChtb2R1bGUgPT09ICdjaGFydCcpIGxhYmVsID0gJ0NoYXJ0JztcbiAgICAgICAgaWYgKG1vZHVsZSA9PT0gJ21hcmtldF9kZXRhaWxzJykgbGFiZWwgPSAnTWFya2V0RGV0YWlscyc7XG4gICAgICAgIHJldHVybiAobGFiZWwpID8gdGhpc1tgd2lkZ2V0JHsgbGFiZWwgfUVsZW1lbnRgXShpbmRleCkudGhlbihyZXN1bHQgPT4gbW9kdWxlcyArPSByZXN1bHQpIDogbnVsbDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIG1haW5FbGVtZW50LmlubmVySFRNTCA9IHRoaXMud2lkZ2V0TWFpbkVsZW1lbnQoaW5kZXgpICsgbW9kdWxlcyArIHRoaXMud2lkZ2V0Rm9vdGVyKGluZGV4KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGNoYXJ0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7IHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lIH0tcHJpY2UtY2hhcnQtJHsgaW5kZXggfWApO1xuICAgICAgcmV0dXJuIChjaGFydENvbnRhaW5lcikgPyBjaGFydENvbnRhaW5lci5wYXJlbnRFbGVtZW50Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgdGhpcy53aWRnZXRTZWxlY3RFbGVtZW50KGluZGV4LCAncmFuZ2UnKSkgOiBudWxsO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKGNoYXJ0Q29udGFpbmVyKXtcbiAgICAgICAgdGhpcy5zdGF0ZXNbaW5kZXhdLmNoYXJ0ID0gbmV3IGNoYXJ0Q2xhc3MoY2hhcnRDb250YWluZXIsIHRoaXMuc3RhdGVzW2luZGV4XSk7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0TGlzdGVuZXJzKGluZGV4KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuICAgIFxuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKGluZGV4KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdldERhdGEoaW5kZXgpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBzZXRTZWxlY3RMaXN0ZW5lcnMoaW5kZXgpe1xuICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgIGxldCBzZWxlY3RFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXQtc2VsZWN0Jyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RFbGVtZW50cy5sZW5ndGg7IGkrKyl7XG4gICAgICBsZXQgYnV0dG9ucyA9IHNlbGVjdEVsZW1lbnRzW2ldLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXQtc2VsZWN0X19vcHRpb25zIGJ1dHRvbicpO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBidXR0b25zLmxlbmd0aDsgaisrKXtcbiAgICAgICAgYnV0dG9uc1tqXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0U2VsZWN0T3B0aW9uKGV2ZW50LCBpbmRleCk7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHNldFNlbGVjdE9wdGlvbihldmVudCwgaW5kZXgpe1xuICAgIGxldCBjbGFzc05hbWUgPSAnY3Atd2lkZ2V0LWFjdGl2ZSc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudC50YXJnZXQucGFyZW50Tm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGxldCBzaWJsaW5nID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuY2hpbGROb2Rlc1tpXTtcbiAgICAgIGlmIChzaWJsaW5nLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKSBzaWJsaW5nLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICB9XG4gICAgbGV0IHBhcmVudCA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcuY3Atd2lkZ2V0LXNlbGVjdCcpO1xuICAgIGxldCB0eXBlID0gcGFyZW50LmRhdGFzZXQudHlwZTtcbiAgICBsZXQgcGlja2VkVmFsdWVFbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5jcC13aWRnZXQtc2VsZWN0X19vcHRpb25zID4gc3BhbicpO1xuICAgIGxldCB2YWx1ZSA9IGV2ZW50LnRhcmdldC5kYXRhc2V0Lm9wdGlvbjtcbiAgICBwaWNrZWRWYWx1ZUVsZW1lbnQuaW5uZXJUZXh0ID0gdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgdmFsdWUudG9Mb3dlckNhc2UoKSk7XG4gICAgdGhpcy51cGRhdGVEYXRhKGluZGV4LCB0eXBlLCB2YWx1ZSk7XG4gICAgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB0aGlzLmRpc3BhdGNoRXZlbnQoaW5kZXgsICctc3dpdGNoLXJhbmdlJywgdmFsdWUpO1xuICB9XG4gIFxuICBkaXNwYXRjaEV2ZW50KGluZGV4LCBuYW1lLCBkYXRhKXtcbiAgICBsZXQgaWQgPSBgJHsgdGhpcy5kZWZhdWx0cy5jbGFzc05hbWUgfS1wcmljZS1jaGFydC0keyBpbmRleCB9YDtcbiAgICByZXR1cm4gZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoYCR7aWR9JHtuYW1lfWAsIHsgZGV0YWlsOiB7IGRhdGEgfSB9KSk7XG4gIH1cbiAgXG4gIGdldERhdGEoaW5kZXgpIHtcbiAgICBjb25zdCB1cmwgPSAnaHR0cHM6Ly9hcGkuY29pbnBhcHJpa2EuY29tL3YxL3dpZGdldC8nICsgdGhpcy5zdGF0ZXNbaW5kZXhdLmN1cnJlbmN5ICsgJz9xdW90ZT0nICsgdGhpcy5zdGF0ZXNbaW5kZXhdLnByaW1hcnlfY3VycmVuY3k7XG4gICAgcmV0dXJuIGZldGNoU2VydmljZS5mZXRjaERhdGEodXJsKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZXNbaW5kZXhdLmlzRGF0YSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnaXNEYXRhJywgdHJ1ZSk7XG4gICAgICAgIHRoaXMudXBkYXRlVGlja2VyKGluZGV4LCByZXN1bHQpO1xuICAgICAgfSlcbiAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5vbkVycm9yUmVxdWVzdChpbmRleCwgZXJyb3IpO1xuICAgIH0pO1xuICB9XG4gIFxuICBvbkVycm9yUmVxdWVzdChpbmRleCwgeGhyKSB7XG4gICAgaWYgKHRoaXMuc3RhdGVzW2luZGV4XS5pc0RhdGEpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2lzRGF0YScsIGZhbHNlKTtcbiAgICB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdtZXNzYWdlJywgJ2RhdGFfdW5hdmFpbGFibGUnKTtcbiAgICBjb25zb2xlLmVycm9yKCdSZXF1ZXN0IGZhaWxlZC4gIFJldHVybmVkIHN0YXR1cyBvZiAnICsgeGhyLCB0aGlzLnN0YXRlc1tpbmRleF0pO1xuICB9XG4gIFxuICBpbml0SW50ZXJ2YWwoaW5kZXgpIHtcbiAgICBjbGVhckludGVydmFsKHRoaXMuc3RhdGVzW2luZGV4XS5pbnRlcnZhbCk7XG4gICAgaWYgKHRoaXMuc3RhdGVzW2luZGV4XS51cGRhdGVfYWN0aXZlICYmIHRoaXMuc3RhdGVzW2luZGV4XS51cGRhdGVfdGltZW91dCA+IDEwMDApIHtcbiAgICAgIHRoaXMuc3RhdGVzW2luZGV4XS5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgdGhpcy5nZXREYXRhKGluZGV4KTtcbiAgICAgIH0sIHRoaXMuc3RhdGVzW2luZGV4XS51cGRhdGVfdGltZW91dCk7XG4gICAgfVxuICB9XG4gIFxuICBzZXRCZWZvcmVFbGVtZW50SW5Gb290ZXIoaW5kZXgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGVzW2luZGV4XS5pc1dvcmRwcmVzcykge1xuICAgICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgICBpZiAobWFpbkVsZW1lbnQpIHtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmNoaWxkcmVuWzBdLmxvY2FsTmFtZSA9PT0gJ3N0eWxlJykge1xuICAgICAgICAgIG1haW5FbGVtZW50LnJlbW92ZUNoaWxkKG1haW5FbGVtZW50LmNoaWxkTm9kZXNbMF0pO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmb290ZXJFbGVtZW50ID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNwLXdpZGdldF9fZm9vdGVyJyk7XG4gICAgICAgIGxldCB2YWx1ZSA9IGZvb3RlckVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLSA0MztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb290ZXJFbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YWx1ZSAtPSBmb290ZXJFbGVtZW50LmNoaWxkTm9kZXNbaV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgc3R5bGUuaW5uZXJIVE1MID0gJy5jcC13aWRnZXRfX2Zvb3Rlci0tJyArIGluZGV4ICsgJzo6YmVmb3Jle3dpZHRoOicgKyB2YWx1ZS50b0ZpeGVkKDApICsgJ3B4O30nO1xuICAgICAgICBtYWluRWxlbWVudC5pbnNlcnRCZWZvcmUoc3R5bGUsIG1haW5FbGVtZW50LmNoaWxkcmVuWzBdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHVwZGF0ZVdpZGdldEVsZW1lbnQoaW5kZXgsIGtleSwgdmFsdWUsIHRpY2tlcikge1xuICAgIGxldCBzdGF0ZSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcbiAgICBsZXQgbWFpbkVsZW1lbnQgPSB0aGlzLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICBpZiAobWFpbkVsZW1lbnQpIHtcbiAgICAgIGxldCB0aWNrZXJDbGFzcyA9ICh0aWNrZXIpID8gJ1RpY2tlcicgOiAnJztcbiAgICAgIGlmIChrZXkgPT09ICduYW1lJyB8fCBrZXkgPT09ICdjdXJyZW5jeScpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ2N1cnJlbmN5Jykge1xuICAgICAgICAgIGxldCBhRWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0X19mb290ZXIgPiBhJyk7XG4gICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBhRWxlbWVudHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgIGFFbGVtZW50c1trXS5ocmVmID0gdGhpcy5jb2luX2xpbmsodmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdldEltYWdlKGluZGV4KTtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09ICdpc0RhdGEnIHx8IGtleSA9PT0gJ21lc3NhZ2UnKSB7XG4gICAgICAgIGxldCBoZWFkZXJFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXRfX21haW4nKTtcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBoZWFkZXJFbGVtZW50cy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgIGhlYWRlckVsZW1lbnRzW2tdLmlubmVySFRNTCA9ICghc3RhdGUuaXNEYXRhKSA/IHRoaXMud2lkZ2V0TWFpbkVsZW1lbnRNZXNzYWdlKGluZGV4KSA6IHRoaXMud2lkZ2V0TWFpbkVsZW1lbnREYXRhKGluZGV4KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHVwZGF0ZUVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgKyBrZXkgKyB0aWNrZXJDbGFzcyk7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdXBkYXRlRWxlbWVudHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBsZXQgdXBkYXRlRWxlbWVudCA9IHVwZGF0ZUVsZW1lbnRzW2pdO1xuICAgICAgICAgIGlmICh1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY3Atd2lkZ2V0X19yYW5rJykpIHtcbiAgICAgICAgICAgIGxldCBjbGFzc05hbWUgPSAocGFyc2VGbG9hdCh2YWx1ZSkgPiAwKSA/IFwiY3Atd2lkZ2V0X19yYW5rLXVwXCIgOiAoKHBhcnNlRmxvYXQodmFsdWUpIDwgMCkgPyBcImNwLXdpZGdldF9fcmFuay1kb3duXCIgOiBcImNwLXdpZGdldF9fcmFuay1uZXV0cmFsXCIpO1xuICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX3JhbmstZG93bicpO1xuICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX3JhbmstdXAnKTtcbiAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLW5ldXRyYWwnKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHZhbHVlID0gY3BCb290c3RyYXAuZW1wdHlEYXRhO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgIHZhbHVlID0gKGtleSA9PT0gJ3ByaWNlX2NoYW5nZV8yNGgnKSA/ICcoJyArIGNwQm9vdHN0cmFwLnJvdW5kKHZhbHVlLCAyKSArICclKScgOiBjcEJvb3RzdHJhcC5yb3VuZCh2YWx1ZSwgMikgKyAnJSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvd0RldGFpbHNDdXJyZW5jeScpICYmICFzdGF0ZS5zaG93X2RldGFpbHNfY3VycmVuY3kpIHtcbiAgICAgICAgICAgIHZhbHVlID0gJyAnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BhcnNlTnVtYmVyJykpIHtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbiA9IHRoaXMuZGVmYXVsdHMuZGF0YV9zcmMgfHwgdGhpcy5kZWZhdWx0cy5vcmlnaW5fc3JjO1xuICAgICAgICAgICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gY3BCb290c3RyYXAucGFyc2VDdXJyZW5jeU51bWJlcih2YWx1ZSwgc3RhdGUucHJpbWFyeV9jdXJyZW5jeSwgb3JpZ2luKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiB1cGRhdGVFbGVtZW50LmlubmVyVGV4dCA9IHJlc3VsdCB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1cGRhdGVFbGVtZW50LmlubmVyVGV4dCA9IHZhbHVlIHx8IGNwQm9vdHN0cmFwLmVtcHR5RGF0YTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHVwZGF0ZURhdGEoaW5kZXgsIGtleSwgdmFsdWUsIHRpY2tlcikge1xuICAgIGlmICh0aWNrZXIpIHtcbiAgICAgIHRoaXMuc3RhdGVzW2luZGV4XS50aWNrZXJba2V5XSA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlc1tpbmRleF1ba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgICBpZiAoa2V5ID09PSAnbGFuZ3VhZ2UnKSB7XG4gICAgICB0aGlzLmdldFRyYW5zbGF0aW9ucyh2YWx1ZSk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlV2lkZ2V0RWxlbWVudChpbmRleCwga2V5LCB2YWx1ZSwgdGlja2VyKTtcbiAgfVxuICBcbiAgdXBkYXRlV2lkZ2V0VHJhbnNsYXRpb25zKGxhbmcsIGRhdGEpIHtcbiAgICB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXSA9IGRhdGE7XG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLnN0YXRlcy5sZW5ndGg7IHgrKykge1xuICAgICAgbGV0IGlzTm9UcmFuc2xhdGlvbkxhYmVsc1VwZGF0ZSA9IHRoaXMuc3RhdGVzW3hdLm5vVHJhbnNsYXRpb25MYWJlbHMubGVuZ3RoID4gMCAmJiBsYW5nID09PSAnZW4nO1xuICAgICAgaWYgKHRoaXMuc3RhdGVzW3hdLmxhbmd1YWdlID09PSBsYW5nIHx8IGlzTm9UcmFuc2xhdGlvbkxhYmVsc1VwZGF0ZSkge1xuICAgICAgICBsZXQgbWFpbkVsZW1lbnQgPSB0aGlzLnN0YXRlc1t4XS5tYWluRWxlbWVudDtcbiAgICAgICAgbGV0IHRyYW5zYWx0ZUVsZW1lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNwLXRyYW5zbGF0aW9uJykpO1xuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRyYW5zYWx0ZUVsZW1lbnRzLmxlbmd0aDsgeSsrKSB7XG4gICAgICAgICAgdHJhbnNhbHRlRWxlbWVudHNbeV0uY2xhc3NMaXN0LmZvckVhY2goKGNsYXNzTmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGNsYXNzTmFtZS5zZWFyY2goJ3RyYW5zbGF0aW9uXycpID4gLTEpIHtcbiAgICAgICAgICAgICAgbGV0IHRyYW5zbGF0ZUtleSA9IGNsYXNzTmFtZS5yZXBsYWNlKCd0cmFuc2xhdGlvbl8nLCAnJyk7XG4gICAgICAgICAgICAgIGlmICh0cmFuc2xhdGVLZXkgPT09ICdtZXNzYWdlJykgdHJhbnNsYXRlS2V5ID0gdGhpcy5zdGF0ZXNbeF0ubWVzc2FnZTtcbiAgICAgICAgICAgICAgbGV0IGxhYmVsSW5kZXggPSB0aGlzLnN0YXRlc1t4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLmluZGV4T2YodHJhbnNsYXRlS2V5KTtcbiAgICAgICAgICAgICAgbGV0IHRleHQgPSB0aGlzLmdldFRyYW5zbGF0aW9uKHgsIHRyYW5zbGF0ZUtleSk7XG4gICAgICAgICAgICAgIGlmIChsYWJlbEluZGV4ID4gLTEgJiYgdGV4dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzW3hdLm5vVHJhbnNsYXRpb25MYWJlbHMuc3BsaWNlKGxhYmVsSW5kZXgsIDEpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdHJhbnNhbHRlRWxlbWVudHNbeV0uaW5uZXJUZXh0ID0gdGV4dDtcbiAgICAgICAgICAgICAgaWYgKHRyYW5zYWx0ZUVsZW1lbnRzW3ldLmNsb3Nlc3QoJy5jcC13aWRnZXRfX2Zvb3RlcicpKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnNldEJlZm9yZUVsZW1lbnRJbkZvb3Rlcih4KSwgNTApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgdXBkYXRlVGlja2VyKGluZGV4LCBkYXRhKSB7XG4gICAgbGV0IGRhdGFLZXlzID0gT2JqZWN0LmtleXMoZGF0YSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhS2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy51cGRhdGVEYXRhKGluZGV4LCBkYXRhS2V5c1tpXSwgZGF0YVtkYXRhS2V5c1tpXV0sIHRydWUpO1xuICAgIH1cbiAgfVxuICBcbiAgc3R5bGVzaGVldCgpIHtcbiAgICBpZiAodGhpcy5kZWZhdWx0cy5zdHlsZV9zcmMgIT09IGZhbHNlKSB7XG4gICAgICBsZXQgdXJsID0gdGhpcy5kZWZhdWx0cy5zdHlsZV9zcmMgfHwgdGhpcy5kZWZhdWx0cy5vcmlnaW5fc3JjICsgJy9kaXN0LycgKyB0aGlzLmRlZmF1bHRzLmNzc0ZpbGVOYW1lO1xuICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJ2xpbmtbaHJlZj1cIicgKyB1cmwgKyAnXCJdJykpe1xuICAgICAgICByZXR1cm4gZmV0Y2hTZXJ2aWNlLmZldGNoU3R5bGUodXJsKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG4gIFxuICB3aWRnZXRNYWluRWxlbWVudChpbmRleCkge1xuICAgIGxldCBkYXRhID0gdGhpcy5zdGF0ZXNbaW5kZXhdO1xuICAgIHJldHVybiAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9faGVhZGVyXCI+JyArXG4gICAgICAnPGRpdiBjbGFzcz1cIicgKyAnY3Atd2lkZ2V0X19pbWcgY3Atd2lkZ2V0X19pbWctJyArIGRhdGEuY3VycmVuY3kgKyAnXCI+JyArXG4gICAgICAnPGltZy8+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9fbWFpblwiPicgK1xuICAgICAgKChkYXRhLmlzRGF0YSkgPyB0aGlzLndpZGdldE1haW5FbGVtZW50RGF0YShpbmRleCkgOiB0aGlzLndpZGdldE1haW5FbGVtZW50TWVzc2FnZShpbmRleCkpICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nO1xuICB9XG4gIFxuICB3aWRnZXRNYWluRWxlbWVudERhdGEoaW5kZXgpIHtcbiAgICBsZXQgZGF0YSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcbiAgICByZXR1cm4gJzxoMz48YSBocmVmPVwiJyArIHRoaXMuY29pbl9saW5rKGRhdGEuY3VycmVuY3kpICsgJ1wiPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwibmFtZVRpY2tlclwiPicgKyAoZGF0YS50aWNrZXIubmFtZSB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGEpICsgJzwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlclwiPicgKyAoZGF0YS50aWNrZXIuc3ltYm9sIHx8IGNwQm9vdHN0cmFwLmVtcHR5RGF0YSkgKyAnPC9zcGFuPicgK1xuICAgICAgJzwvYT48L2gzPicgK1xuICAgICAgJzxzdHJvbmc+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJwcmljZVRpY2tlciBwYXJzZU51bWJlclwiPicgKyAoY3BCb290c3RyYXAucGFyc2VOdW1iZXIoZGF0YS50aWNrZXIucHJpY2UpIHx8IGNwQm9vdHN0cmFwLmVtcHR5RGF0YSkgKyAnPC9zcGFuPiAnICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInByaW1hcnlDdXJyZW5jeVwiPicgKyBkYXRhLnByaW1hcnlfY3VycmVuY3kgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInByaWNlX2NoYW5nZV8yNGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rIGNwLXdpZGdldF9fcmFuay0nICsgKChkYXRhLnRpY2tlci5wcmljZV9jaGFuZ2VfMjRoID4gMCkgPyBcInVwXCIgOiAoKGRhdGEudGlja2VyLnByaWNlX2NoYW5nZV8yNGggPCAwKSA/IFwiZG93blwiIDogXCJuZXV0cmFsXCIpKSArICdcIj4oJyArIChjcEJvb3RzdHJhcC5yb3VuZChkYXRhLnRpY2tlci5wcmljZV9jaGFuZ2VfMjRoLCAyKSB8fCBjcEJvb3RzdHJhcC5lbXB0eVZhbHVlKSArICclKTwvc3Bhbj4nICtcbiAgICAgICc8L3N0cm9uZz4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldF9fcmFuay1sYWJlbFwiPjxzcGFuIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fcmFua1wiPicgKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInJhbmtcIikgKyAnPC9zcGFuPiA8c3BhbiBjbGFzcz1cInJhbmtUaWNrZXJcIj4nICsgKGRhdGEudGlja2VyLnJhbmsgfHwgY3BCb290c3RyYXAuZW1wdHlEYXRhKSArICc8L3NwYW4+PC9zcGFuPic7XG4gIH1cbiAgXG4gIHdpZGdldE1haW5FbGVtZW50TWVzc2FnZShpbmRleCkge1xuICAgIGxldCBtZXNzYWdlID0gdGhpcy5zdGF0ZXNbaW5kZXhdLm1lc3NhZ2U7XG4gICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19tYWluLW5vLWRhdGEgY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fbWVzc2FnZVwiPicgKyAodGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgbWVzc2FnZSkpICsgJzwvZGl2Pic7XG4gIH1cbiAgXG4gIHdpZGdldE1hcmtldERldGFpbHNFbGVtZW50KGluZGV4KSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgodGhpcy5zdGF0ZXNbaW5kZXhdLm1vZHVsZXMuaW5kZXhPZignbWFya2V0X2RldGFpbHMnKSA+IC0xKSA/ICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19kZXRhaWxzXCI+JyArXG4gICAgICB0aGlzLndpZGdldEF0aEVsZW1lbnQoaW5kZXgpICtcbiAgICAgIHRoaXMud2lkZ2V0Vm9sdW1lMjRoRWxlbWVudChpbmRleCkgK1xuICAgICAgdGhpcy53aWRnZXRNYXJrZXRDYXBFbGVtZW50KGluZGV4KSArXG4gICAgICAnPC9kaXY+JyA6ICcnKTtcbiAgfVxuICBcbiAgd2lkZ2V0QXRoRWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiAnPGRpdj4nICtcbiAgICAgICc8c21hbGwgY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9hdGhcIj4nICsgdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJhdGhcIikgKyAnPC9zbWFsbD4nICtcbiAgICAgICc8ZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwicHJpY2VfYXRoVGlja2VyIHBhcnNlTnVtYmVyXCI+JyArIGNwQm9vdHN0cmFwLmVtcHR5RGF0YSArICcgPC9zcGFuPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwic3ltYm9sVGlja2VyIHNob3dEZXRhaWxzQ3VycmVuY3lcIj48L3NwYW4+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJwZXJjZW50X2Zyb21fcHJpY2VfYXRoVGlja2VyIGNwLXdpZGdldF9fcmFua1wiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnPC9zcGFuPicgK1xuICAgICAgJzwvZGl2PidcbiAgfVxuICBcbiAgd2lkZ2V0Vm9sdW1lMjRoRWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiAnPGRpdj4nICtcbiAgICAgICc8c21hbGwgY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl92b2x1bWVfMjRoXCI+JyArIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwidm9sdW1lXzI0aFwiKSArICc8L3NtYWxsPicgK1xuICAgICAgJzxkaXY+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJ2b2x1bWVfMjRoVGlja2VyIHBhcnNlTnVtYmVyXCI+JyArIGNwQm9vdHN0cmFwLmVtcHR5RGF0YSArICcgPC9zcGFuPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwic3ltYm9sVGlja2VyIHNob3dEZXRhaWxzQ3VycmVuY3lcIj48L3NwYW4+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJ2b2x1bWVfMjRoX2NoYW5nZV8yNGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rXCI+JyArIGNwQm9vdHN0cmFwLmVtcHR5RGF0YSArICc8L3NwYW4+JyArXG4gICAgICAnPC9kaXY+JztcbiAgfVxuICBcbiAgd2lkZ2V0TWFya2V0Q2FwRWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiAnPGRpdj4nICtcbiAgICAgICc8c21hbGwgY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9tYXJrZXRfY2FwXCI+JyArIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwibWFya2V0X2NhcFwiKSArICc8L3NtYWxsPicgK1xuICAgICAgJzxkaXY+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJtYXJrZXRfY2FwVGlja2VyIHBhcnNlTnVtYmVyXCI+JyArIGNwQm9vdHN0cmFwLmVtcHR5RGF0YSArICcgPC9zcGFuPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwic3ltYm9sVGlja2VyIHNob3dEZXRhaWxzQ3VycmVuY3lcIj48L3NwYW4+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJtYXJrZXRfY2FwX2NoYW5nZV8yNGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rXCI+JyArIGNwQm9vdHN0cmFwLmVtcHR5RGF0YSArICc8L3NwYW4+JyArXG4gICAgICAnPC9kaXY+JztcbiAgfVxuICBcbiAgd2lkZ2V0Q2hhcnRFbGVtZW50KGluZGV4KSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShcbiAgICAgIGA8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19jaGFydFwiPjxkaXYgaWQ9XCIkeyB0aGlzLmRlZmF1bHRzLmNsYXNzTmFtZSB9LXByaWNlLWNoYXJ0LSR7IGluZGV4IH1cIj48L2Rpdj48L2Rpdj5gXG4gICAgKTtcbiAgfVxuICBcbiAgd2lkZ2V0U2VsZWN0RWxlbWVudChpbmRleCwgbGFiZWwpe1xuICAgIGxldCBidXR0b25zID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnN0YXRlc1tpbmRleF1bbGFiZWwrJ19saXN0J10ubGVuZ3RoOyBpKyspe1xuICAgICAgbGV0IGRhdGEgPSB0aGlzLnN0YXRlc1tpbmRleF1bbGFiZWwrJ19saXN0J11baV07XG4gICAgICBidXR0b25zICs9ICc8YnV0dG9uIGNsYXNzPVwiJysgKChkYXRhLnRvTG93ZXJDYXNlKCkgPT09IHRoaXMuc3RhdGVzW2luZGV4XVtsYWJlbF0udG9Mb3dlckNhc2UoKSlcbiAgICAgICAgPyAnY3Atd2lkZ2V0LWFjdGl2ZSAnXG4gICAgICAgIDogJycpICsgKChsYWJlbCA9PT0gJ3ByaW1hcnlfY3VycmVuY3knKSA/ICcnIDogJ2NwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uXycgKyBkYXRhLnRvTG93ZXJDYXNlKCkpICsnXCIgZGF0YS1vcHRpb249XCInK2RhdGErJ1wiPicrdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgZGF0YS50b0xvd2VyQ2FzZSgpKSsnPC9idXR0b24+J1xuICAgIH1cbiAgICBpZiAobGFiZWwgPT09ICdyYW5nZScpIDtcbiAgICBsZXQgdGl0bGUgPSB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInpvb21faW5cIik7XG4gICAgcmV0dXJuICc8ZGl2IGRhdGEtdHlwZT1cIicrbGFiZWwrJ1wiIGNsYXNzPVwiY3Atd2lkZ2V0LXNlbGVjdFwiPicgK1xuICAgICAgJzxsYWJlbCBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uXycrIGxhYmVsICsnXCI+Jyt0aXRsZSsnPC9sYWJlbD4nICtcbiAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0LXNlbGVjdF9fb3B0aW9uc1wiPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwiYXJyb3ctZG93biAnKyAnY3Atd2lkZ2V0X19jYXBpdGFsaXplIGNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uXycgKyB0aGlzLnN0YXRlc1tpbmRleF1bbGFiZWxdLnRvTG93ZXJDYXNlKCkgKydcIj4nKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCB0aGlzLnN0YXRlc1tpbmRleF1bbGFiZWxdLnRvTG93ZXJDYXNlKCkpICsnPC9zcGFuPicgK1xuICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtc2VsZWN0X19kcm9wZG93blwiPicgK1xuICAgICAgYnV0dG9ucyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+JztcbiAgfVxuICBcbiAgd2lkZ2V0Rm9vdGVyKGluZGV4KSB7XG4gICAgbGV0IGN1cnJlbmN5ID0gdGhpcy5zdGF0ZXNbaW5kZXhdLmN1cnJlbmN5O1xuICAgIHJldHVybiAoIXRoaXMuc3RhdGVzW2luZGV4XS5pc1dvcmRwcmVzcylcbiAgICAgID8gJzxwIGNsYXNzPVwiY3Atd2lkZ2V0X19mb290ZXIgY3Atd2lkZ2V0X19mb290ZXItLScgKyBpbmRleCArICdcIj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX3Bvd2VyZWRfYnlcIj4nICsgdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJwb3dlcmVkX2J5XCIpICsgJyA8L3NwYW4+JyArXG4gICAgICAnPGltZyBzdHlsZT1cIndpZHRoOiAxNnB4XCIgc3JjPVwiJyArIHRoaXMubWFpbl9sb2dvX2xpbmsoKSArICdcIiBhbHQ9XCJcIi8+JyArXG4gICAgICAnPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIicgKyB0aGlzLmNvaW5fbGluayhjdXJyZW5jeSkgKyAnXCI+Y29pbnBhcHJpa2EuY29tPC9hPicgK1xuICAgICAgJzwvcD4nXG4gICAgICA6ICcnO1xuICB9XG4gIFxuICBnZXRJbWFnZShpbmRleCkge1xuICAgIGxldCBkYXRhID0gdGhpcy5zdGF0ZXNbaW5kZXhdO1xuICAgIGxldCBpbWdDb250YWluZXJzID0gZGF0YS5tYWluRWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjcC13aWRnZXRfX2ltZycpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW1nQ29udGFpbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGltZ0NvbnRhaW5lciA9IGltZ0NvbnRhaW5lcnNbaV07XG4gICAgICBpbWdDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY3Atd2lkZ2V0X19pbWctLWhpZGRlbicpO1xuICAgICAgbGV0IGltZyA9IGltZ0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdpbWcnKTtcbiAgICAgIGxldCBuZXdJbWcgPSBuZXcgSW1hZ2U7XG4gICAgICBuZXdJbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICBpbWcuc3JjID0gbmV3SW1nLnNyYztcbiAgICAgICAgaW1nQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9faW1nLS1oaWRkZW4nKTtcbiAgICAgIH07XG4gICAgICBuZXdJbWcuc3JjID0gdGhpcy5pbWdfc3JjKGRhdGEuY3VycmVuY3kpO1xuICAgIH1cbiAgfVxuICBcbiAgaW1nX3NyYyhpZCkge1xuICAgIHJldHVybiAnaHR0cHM6Ly9jb2lucGFwcmlrYS5jb20vY29pbi8nICsgaWQgKyAnL2xvZ28ucG5nJztcbiAgfVxuICBcbiAgY29pbl9saW5rKGlkKSB7XG4gICAgcmV0dXJuICdodHRwczovL2NvaW5wYXByaWthLmNvbS9jb2luLycgKyBpZFxuICB9XG4gIFxuICBtYWluX2xvZ29fbGluaygpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0cy5pbWdfc3JjIHx8IHRoaXMuZGVmYXVsdHMub3JpZ2luX3NyYyArICcvZGlzdC9pbWcvbG9nb193aWRnZXQuc3ZnJ1xuICB9XG4gIFxuICBnZXRTY3JpcHRFbGVtZW50KCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzY3JpcHRbZGF0YS1jcC1jdXJyZW5jeS13aWRnZXRdJyk7XG4gIH1cbiAgXG4gIGdldFRyYW5zbGF0aW9uKGluZGV4LCBsYWJlbCkge1xuICAgIGxldCB0ZXh0ID0gKHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW3RoaXMuc3RhdGVzW2luZGV4XS5sYW5ndWFnZV0pID8gdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbdGhpcy5zdGF0ZXNbaW5kZXhdLmxhbmd1YWdlXVtsYWJlbF0gOiBudWxsO1xuICAgIGlmICghdGV4dCAmJiB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1snZW4nXSkge1xuICAgICAgdGV4dCA9IHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zWydlbiddW2xhYmVsXTtcbiAgICB9XG4gICAgaWYgKCF0ZXh0KSB7XG4gICAgICByZXR1cm4gdGhpcy5hZGRMYWJlbFdpdGhvdXRUcmFuc2xhdGlvbihpbmRleCwgbGFiZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH1cbiAgXG4gIGFkZExhYmVsV2l0aG91dFRyYW5zbGF0aW9uKGluZGV4LCBsYWJlbCkge1xuICAgIGlmICghdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbJ2VuJ10pIHRoaXMuZ2V0VHJhbnNsYXRpb25zKCdlbicpO1xuICAgIHJldHVybiB0aGlzLnN0YXRlc1tpbmRleF0ubm9UcmFuc2xhdGlvbkxhYmVscy5wdXNoKGxhYmVsKTtcbiAgfVxuICBcbiAgZ2V0VHJhbnNsYXRpb25zKGxhbmcpIHtcbiAgICBpZiAoIXRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddKSB7XG4gICAgICBjb25zdCB1cmwgPSB0aGlzLmRlZmF1bHRzLmxhbmdfc3JjIHx8IHRoaXMuZGVmYXVsdHMub3JpZ2luX3NyYyArICcvZGlzdC9sYW5nLycgKyBsYW5nICsgJy5qc29uJztcbiAgICAgIHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddID0ge307XG4gICAgICByZXR1cm4gZmV0Y2hTZXJ2aWNlLmZldGNoSnNvbkZpbGUodXJsLCB0cnVlKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVdpZGdldFRyYW5zbGF0aW9ucyhsYW5nLCByZXNwb25zZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5vbkVycm9yUmVxdWVzdCgwLCB1cmwgKyByZXNwb25zZSk7XG4gICAgICAgICAgdGhpcy5nZXRUcmFuc2xhdGlvbnMoJ2VuJyk7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIFxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBjaGFydENsYXNzIHtcbiAgY29uc3RydWN0b3IoY29udGFpbmVyLCBzdGF0ZSl7XG4gICAgaWYgKCFjb250YWluZXIpIHJldHVybjtcbiAgICB0aGlzLmlkID0gY29udGFpbmVyLmlkO1xuICAgIHRoaXMuaXNOaWdodE1vZGUgPSBzdGF0ZS5pc05pZ2h0TW9kZTtcbiAgICB0aGlzLmNoYXJ0c1dpdGhBY3RpdmVTZXJpZXNDb29raWVzID0gW107XG4gICAgdGhpcy5jaGFydCA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW5jeSA9IHN0YXRlLmN1cnJlbmN5O1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucygpO1xuICAgIHRoaXMuZGVmYXVsdFJhbmdlID0gc3RhdGUucmFuZ2UgfHwgJzdkJztcbiAgICB0aGlzLmNhbGxiYWNrID0gbnVsbDtcbiAgICB0aGlzLnJlcGxhY2VDYWxsYmFjayA9IG51bGw7XG4gICAgdGhpcy5leHRyZW1lc0RhdGFVcmwgPSB0aGlzLmdldEV4dHJlbWVzRGF0YVVybChjb250YWluZXIuaWQpO1xuICAgIHRoaXMuZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICBjaGFydDoge1xuICAgICAgICBhbGlnblRpY2tzOiBmYWxzZSxcbiAgICAgICAgbWFyZ2luVG9wOiA1MCxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBmb250RmFtaWx5OiAnc2Fucy1zZXJpZicsXG4gICAgICAgIH0sXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgIHJlbmRlcjogKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC5hbm5vdGF0aW9ucykge1xuICAgICAgICAgICAgICBsZXQgY2hhcnQgPSBlLnRhcmdldC5hbm5vdGF0aW9ucy5jaGFydDtcbiAgICAgICAgICAgICAgY3BCb290c3RyYXAubG9vcChjaGFydC5hbm5vdGF0aW9ucy5hbGxJdGVtcywgYW5ub3RhdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHkgPSBjaGFydC5wbG90SGVpZ2h0ICsgY2hhcnQucGxvdFRvcCAtIGNoYXJ0LnNwYWNpbmdbMF0gLSAyIC0gKCh0aGlzLmlzUmVzcG9uc2l2ZU1vZGVBY3RpdmUoY2hhcnQpKSA/IDEwIDogMCk7XG4gICAgICAgICAgICAgICAgYW5ub3RhdGlvbi51cGRhdGUoe3l9LCB0cnVlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBzY3JvbGxiYXI6IHtcbiAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICB9LFxuICAgICAgYW5ub3RhdGlvbnNPcHRpb25zOiB7XG4gICAgICAgIGVuYWJsZWRCdXR0b25zOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICByYW5nZVNlbGVjdG9yOiB7XG4gICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHBsb3RPcHRpb25zOiB7XG4gICAgICAgIGxpbmU6IHtcbiAgICAgICAgICBzZXJpZXM6IHtcbiAgICAgICAgICAgIHN0YXRlczoge1xuICAgICAgICAgICAgICBob3Zlcjoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBzZXJpZXM6IHtcbiAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgIGxlZ2VuZEl0ZW1DbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChldmVudC5icm93c2VyRXZlbnQuaXNUcnVzdGVkKXtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGFydHNXaXRoQWN0aXZlU2VyaWVzQ29va2llcy5pbmRleE9mKGV2ZW50LnRhcmdldC5jaGFydC5yZW5kZXJUby5pZCkgPiAtMSkgdGhpcy5zZXRWaXNpYmxlQ2hhcnRDb29raWVzKGV2ZW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyBPbiBpT1MgdG91Y2ggZXZlbnQgZmlyZXMgc2Vjb25kIGNhbGxiYWNrIGZyb20gSlMgKGlzVHJ1c3RlZDogZmFsc2UpIHdoaWNoXG4gICAgICAgICAgICAgIC8vIHJlc3VsdHMgd2l0aCB0b2dnbGUgYmFjayB0aGUgY2hhcnQgKHByb2JhYmx5IGl0cyBhIHByb2JsZW0gd2l0aCBVSUtpdCwgYnV0IG5vdCBzdXJlKVxuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbGVnZW5kSXRlbUNsaWNrJywge2V2ZW50LCBpc1RydXN0ZWQ6IGV2ZW50LmJyb3dzZXJFdmVudC5pc1RydXN0ZWR9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50LmJyb3dzZXJFdmVudC5pc1RydXN0ZWQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB4QXhpczoge1xuICAgICAgICBvcmRpbmFsOiBmYWxzZVxuICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5jaGFydERhdGFQYXJzZXIgPSAoZGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGRhdGEgPSBkYXRhWzBdO1xuICAgICAgICBjb25zdCBwcmljZUN1cnJlbmN5ID0gc3RhdGUucHJpbWFyeV9jdXJyZW5jeS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSh7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgcHJpY2U6IChkYXRhLnByaWNlKVxuICAgICAgICAgICAgICA/IGRhdGEucHJpY2VcbiAgICAgICAgICAgICAgOiAoKGRhdGFbcHJpY2VDdXJyZW5jeV0pXG4gICAgICAgICAgICAgICAgPyBkYXRhW3ByaWNlQ3VycmVuY3ldXG4gICAgICAgICAgICAgICAgOiBbXSksXG4gICAgICAgICAgICB2b2x1bWU6IGRhdGEudm9sdW1lIHx8IFtdLFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHRoaXMuaXNFdmVudHNIaWRkZW4gPSBmYWxzZTtcbiAgICB0aGlzLmV4Y2x1ZGVTZXJpZXNJZHMgPSBbXTtcbiAgICB0aGlzLmFzeW5jVXJsID0gYC9jdXJyZW5jeS9kYXRhLyR7IHN0YXRlLmN1cnJlbmN5IH0vX3JhbmdlXy9gO1xuICAgIHRoaXMuYXN5bmNQYXJhbXMgPSBgP3F1b3RlPSR7IHN0YXRlLnByaW1hcnlfY3VycmVuY3kudG9VcHBlckNhc2UoKSB9JmZpZWxkcz1wcmljZSx2b2x1bWVgO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG4gIFxuICBzZXRPcHRpb25zKCl7XG4gICAgY29uc3QgY2hhcnRTZXJ2aWNlID0gbmV3IGNoYXJ0Q2xhc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzcG9uc2l2ZToge1xuICAgICAgICBydWxlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbmRpdGlvbjoge1xuICAgICAgICAgICAgICBtYXhXaWR0aDogMTUwMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGFydE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgYWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ21pZGRsZScsXG4gICAgICAgICAgICAgICAgeTogOTIsXG4gICAgICAgICAgICAgICAgc3ltYm9sUmFkaXVzOiAwLFxuICAgICAgICAgICAgICAgIGl0ZW1EaXN0YW5jZTogMjAsXG4gICAgICAgICAgICAgICAgaXRlbVN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA0MDAsXG4gICAgICAgICAgICAgICAgbWFyZ2luVG9wOiAzNSxcbiAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206IDAsXG4gICAgICAgICAgICAgICAgc3BhY2luZ1RvcDogMCxcbiAgICAgICAgICAgICAgICBzcGFjaW5nQm90dG9tOiAwLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBuYXZpZ2F0b3I6IHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDUwLFxuICAgICAgICAgICAgICAgIG1hcmdpbjogNzAsXG4gICAgICAgICAgICAgICAgaGFuZGxlczoge1xuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyNSxcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiAxNyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbmRpdGlvbjoge1xuICAgICAgICAgICAgICBtYXhXaWR0aDogNjAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoYXJ0T3B0aW9uczoge1xuICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgIG1hcmdpblRvcDogMCxcbiAgICAgICAgICAgICAgICB6b29tVHlwZTogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgbWFyZ2luTGVmdDogMTAsXG4gICAgICAgICAgICAgICAgbWFyZ2luUmlnaHQ6IDEwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzUwLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB5QXhpczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGZsb29yOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0Ftb3VudDogNyxcbiAgICAgICAgICAgICAgICAgIHRpY2tXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tMZW5ndGg6IDAsXG4gICAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICAgICAgICBhbGlnbjogXCJsZWZ0XCIsXG4gICAgICAgICAgICAgICAgICAgIHg6IDEsXG4gICAgICAgICAgICAgICAgICAgIHk6IC0yLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzllOWU5ZScsXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICc5cHgnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgZmxvb3I6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrQW1vdW50OiA3LFxuICAgICAgICAgICAgICAgICAgdGlja1dpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0xlbmd0aDogMCxcbiAgICAgICAgICAgICAgICAgIGxpbmVXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgICAgICAgICAgIGFsaWduOiBcInJpZ2h0XCIsXG4gICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiBcImp1c3RpZnlcIixcbiAgICAgICAgICAgICAgICAgICAgeDogMSxcbiAgICAgICAgICAgICAgICAgICAgeTogLTIsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNTA4NWVjJyxcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzlweCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb25kaXRpb246IHtcbiAgICAgICAgICAgICAgbWF4V2lkdGg6IDQ1MFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoYXJ0T3B0aW9uczoge1xuICAgICAgICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgICAgICBhbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJyxcbiAgICAgICAgICAgICAgICB5OiA4MixcbiAgICAgICAgICAgICAgICBzeW1ib2xSYWRpdXM6IDAsXG4gICAgICAgICAgICAgICAgaXRlbURpc3RhbmNlOiAyMCxcbiAgICAgICAgICAgICAgICBpdGVtU3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbmF2aWdhdG9yOiB7XG4gICAgICAgICAgICAgICAgbWFyZ2luOiA2MCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDQwLFxuICAgICAgICAgICAgICAgIGhhbmRsZXM6IHtcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgIGhlaWdodDogMzAwLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB5QXhpczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGZsb29yOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0Ftb3VudDogNyxcbiAgICAgICAgICAgICAgICAgIHRpY2tXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tMZW5ndGg6IDAsXG4gICAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICAgICAgICBhbGlnbjogXCJsZWZ0XCIsXG4gICAgICAgICAgICAgICAgICAgIHg6IDEsXG4gICAgICAgICAgICAgICAgICAgIHk6IC0yLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzllOWU5ZScsXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICc5cHgnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgZmxvb3I6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrQW1vdW50OiA3LFxuICAgICAgICAgICAgICAgICAgdGlja1dpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0xlbmd0aDogMCxcbiAgICAgICAgICAgICAgICAgIGxpbmVXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgICAgICAgICAgIGFsaWduOiBcInJpZ2h0XCIsXG4gICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiBcImp1c3RpZnlcIixcbiAgICAgICAgICAgICAgICAgICAgeDogMSxcbiAgICAgICAgICAgICAgICAgICAgeTogLTIsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNTA4NWVjJyxcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzlweCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgdGl0bGU6IHtcbiAgICAgICAgdGV4dDogdW5kZWZpbmVkLFxuICAgICAgfSxcbiAgICAgIGNoYXJ0OiB7XG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ25vbmUnLFxuICAgICAgICBtYXJnaW5Ub3A6IDUwLFxuICAgICAgICBwbG90Qm9yZGVyV2lkdGg6IDAsXG4gICAgICB9LFxuICAgICAgY3BFdmVudHM6IGZhbHNlLFxuICAgICAgY29sb3JzOiBbXG4gICAgICAgICcjNTA4NWVjJyxcbiAgICAgICAgJyMxZjk4MDknLFxuICAgICAgICAnIzk4NWQ2NScsXG4gICAgICAgICcjZWU5ODNiJyxcbiAgICAgICAgJyM0YzRjNGMnLFxuICAgICAgXSxcbiAgICAgIGxlZ2VuZDoge1xuICAgICAgICBtYXJnaW46IDAsXG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGFsaWduOiAncmlnaHQnLFxuICAgICAgICBzeW1ib2xSYWRpdXM6IDAsXG4gICAgICAgIGl0ZW1EaXN0YW5jZTogNDAsXG4gICAgICAgIGl0ZW1TdHlsZToge1xuICAgICAgICAgIGZvbnRXZWlnaHQ6ICdub3JtYWwnLFxuICAgICAgICAgIGNvbG9yOiAodGhpcy5pc05pZ2h0TW9kZSkgPyAnIzgwYTZlNScgOiAnIzA2NDVhZCcsXG4gICAgICAgIH0sXG4gICAgICAgIGl0ZW1NYXJnaW5Ub3A6IDgsXG4gICAgICB9LFxuICAgICAgbmF2aWdhdG9yOiB0cnVlLFxuICAgICAgdG9vbHRpcDoge1xuICAgICAgICBzaGFyZWQ6IHRydWUsXG4gICAgICAgIHNwbGl0OiBmYWxzZSxcbiAgICAgICAgYW5pbWF0aW9uOiBmYWxzZSxcbiAgICAgICAgYm9yZGVyV2lkdGg6IDEsXG4gICAgICAgIGJvcmRlckNvbG9yOiAodGhpcy5pc05pZ2h0TW9kZSkgPyAnIzRjNGM0YycgOiAnI2UzZTNlMycsXG4gICAgICAgIGhpZGVEZWxheTogMTAwLFxuICAgICAgICBzaGFkb3c6IGZhbHNlLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBjb2xvcjogJyM0YzRjNGMnLFxuICAgICAgICAgIGZvbnRTaXplOiAnMTBweCcsXG4gICAgICAgIH0sXG4gICAgICAgIHVzZUhUTUw6IHRydWUsXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gY2hhcnRTZXJ2aWNlLnRvb2x0aXBGb3JtYXR0ZXIodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgXG4gICAgICBleHBvcnRpbmc6IHtcbiAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgIGNvbnRleHRCdXR0b246IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXG4gICAgICB4QXhpczoge1xuICAgICAgICBsaW5lQ29sb3I6ICh0aGlzLmlzTmlnaHRNb2RlKSA/ICcjNTA1MDUwJyA6ICcjZTNlM2UzJyxcbiAgICAgICAgdGlja0NvbG9yOiAodGhpcy5pc05pZ2h0TW9kZSkgPyAnIzUwNTA1MCcgOiAnI2UzZTNlMycsXG4gICAgICAgIHRpY2tMZW5ndGg6IDcsXG4gICAgICB9LFxuICAgICAgXG4gICAgICB5QXhpczogW3sgLy8gVm9sdW1lIHlBeGlzXG4gICAgICAgIGxpbmVXaWR0aDogMSxcbiAgICAgICAgbGluZUNvbG9yOiAnI2RlZGVkZScsXG4gICAgICAgIHRpY2tXaWR0aDogMSxcbiAgICAgICAgdGlja0xlbmd0aDogNCxcbiAgICAgICAgZ3JpZExpbmVEYXNoU3R5bGU6ICdkYXNoJyxcbiAgICAgICAgZ3JpZExpbmVXaWR0aDogMCxcbiAgICAgICAgZmxvb3I6IDAsXG4gICAgICAgIG1pblBhZGRpbmc6IDAsXG4gICAgICAgIG9wcG9zaXRlOiBmYWxzZSxcbiAgICAgICAgc2hvd0VtcHR5OiBmYWxzZSxcbiAgICAgICAgc2hvd0xhc3RMYWJlbDogZmFsc2UsXG4gICAgICAgIHNob3dGaXJzdExhYmVsOiBmYWxzZSxcbiAgICAgIH0sIHtcbiAgICAgICAgZ3JpZExpbmVDb2xvcjogKHRoaXMuaXNOaWdodE1vZGUpID8gJyM1MDUwNTAnIDogJyNlM2UzZTMnLFxuICAgICAgICBncmlkTGluZURhc2hTdHlsZTogJ2Rhc2gnLFxuICAgICAgICBsaW5lV2lkdGg6IDEsXG4gICAgICAgIHRpY2tXaWR0aDogMSxcbiAgICAgICAgdGlja0xlbmd0aDogNCxcbiAgICAgICAgZmxvb3I6IDAsXG4gICAgICAgIG1pblBhZGRpbmc6IDAsXG4gICAgICAgIHNob3dFbXB0eTogZmFsc2UsXG4gICAgICAgIG9wcG9zaXRlOiB0cnVlLFxuICAgICAgICBncmlkWkluZGV4OiA0LFxuICAgICAgICBzaG93TGFzdExhYmVsOiBmYWxzZSxcbiAgICAgICAgc2hvd0ZpcnN0TGFiZWw6IGZhbHNlLFxuICAgICAgfV0sXG4gICAgICBcbiAgICAgIHNlcmllczogW1xuICAgICAgICB7IC8vb3JkZXIgb2YgdGhlIHNlcmllcyBtYXR0ZXJzXG4gICAgICAgICAgY29sb3I6ICcjNTA4NWVjJyxcbiAgICAgICAgICBuYW1lOiAnUHJpY2UnLFxuICAgICAgICAgIGlkOiAncHJpY2UnLFxuICAgICAgICAgIGRhdGE6IFtdLFxuICAgICAgICAgIHR5cGU6ICdhcmVhJyxcbiAgICAgICAgICBmaWxsT3BhY2l0eTogMC4xNSxcbiAgICAgICAgICBsaW5lV2lkdGg6IDIsXG4gICAgICAgICAgeUF4aXM6IDEsXG4gICAgICAgICAgekluZGV4OiAyLFxuICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgY2xpY2thYmxlOiB0cnVlLFxuICAgICAgICAgIHRocmVzaG9sZDogbnVsbCxcbiAgICAgICAgICB0b29sdGlwOiB7XG4gICAgICAgICAgICB2YWx1ZURlY2ltYWxzOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzaG93SW5OYXZpZ2F0b3I6IHRydWUsXG4gICAgICAgICAgc2hvd0luTGVnZW5kOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGNvbG9yOiBgdXJsKCNmaWxsLXBhdHRlcm4keyh0aGlzLmlzTmlnaHRNb2RlKSA/ICctbmlnaHQnIDogJyd9KWAsXG4gICAgICAgICAgbmFtZTogJ1ZvbHVtZScsXG4gICAgICAgICAgaWQ6ICd2b2x1bWUnLFxuICAgICAgICAgIGRhdGE6IFtdLFxuICAgICAgICAgIHR5cGU6ICdhcmVhJyxcbiAgICAgICAgICBmaWxsT3BhY2l0eTogMC41LFxuICAgICAgICAgIGxpbmVXaWR0aDogMCxcbiAgICAgICAgICB5QXhpczogMCxcbiAgICAgICAgICB6SW5kZXg6IDAsXG4gICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICBjbGlja2FibGU6IHRydWUsXG4gICAgICAgICAgdGhyZXNob2xkOiBudWxsLFxuICAgICAgICAgIHRvb2x0aXA6IHtcbiAgICAgICAgICAgIHZhbHVlRGVjaW1hbHM6IDAsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzaG93SW5OYXZpZ2F0b3I6IHRydWUsXG4gICAgICAgIH1dXG4gICAgfVxuICB9XG4gIFxuICBpbml0KCl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnBhcnNlT3B0aW9ucyh0aGlzLm9wdGlvbnMpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKG9wdGlvbnMpID0+IHtcbiAgICAgIHJldHVybiAod2luZG93LkhpZ2hjaGFydHMpID8gSGlnaGNoYXJ0cy5zdG9ja0NoYXJ0KHRoaXMuY29udGFpbmVyLmlkLCBvcHRpb25zLCAoY2hhcnQpID0+IHRoaXMuYmluZChjaGFydCkpIDogbnVsbDtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgcGFyc2VPcHRpb25zKG9wdGlvbnMpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAudXBkYXRlT2JqZWN0KHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKG5ld09wdGlvbnMpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC51cGRhdGVPYmplY3QodGhpcy5nZXRWb2x1bWVQYXR0ZXJuKCksIG5ld09wdGlvbnMpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKG5ld09wdGlvbnMpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnNldE5hdmlnYXRvcihuZXdPcHRpb25zKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChuZXdPcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gKG5ld09wdGlvbnMubm9EYXRhKSA/IHRoaXMuc2V0Tm9EYXRhTGFiZWwobmV3T3B0aW9ucykgOiBuZXdPcHRpb25zO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKG5ld09wdGlvbnMpID0+IHtcbiAgICAgIHJldHVybiBuZXdPcHRpb25zO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBiaW5kKGNoYXJ0KXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhcnQgPSBjaGFydDtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmZldGNoRGF0YVBhY2thZ2UoKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnNldFJhbmdlU3dpdGNoZXIoKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiAodGhpcy5jYWxsYmFjaykgPyB0aGlzLmNhbGxiYWNrKHRoaXMuY2hhcnQsIHRoaXMuZGVmYXVsdFJhbmdlKSA6IG51bGw7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGZldGNoRGF0YVBhY2thZ2UobWluRGF0ZSwgbWF4RGF0ZSl7XG4gICAgbGV0IGlzUHJlY2lzZVJhbmdlID0gKG1pbkRhdGUgJiYgbWF4RGF0ZSk7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY3BFdmVudHMpe1xuICAgICAgICBsZXQgdXJsID0gKGlzUHJlY2lzZVJhbmdlKSA/IHRoaXMuZ2V0TmF2aWdhdG9yRXh0cmVtZXNVcmwobWluRGF0ZSwgbWF4RGF0ZSwgJ2V2ZW50cycpIDogdGhpcy5nZXRFeHRyZW1lc0RhdGFVcmwodGhpcy5pZCwgJ2V2ZW50cycpICsgJy8nICsgdGhpcy5nZXRSYW5nZSgpICsgJy8nO1xuICAgICAgICByZXR1cm4gKHVybCkgPyB0aGlzLmZldGNoRGF0YSh1cmwsICdldmVudHMnLCAhaXNQcmVjaXNlUmFuZ2UpIDogbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgbGV0IHVybCA9ICgoaXNQcmVjaXNlUmFuZ2UpID8gdGhpcy5nZXROYXZpZ2F0b3JFeHRyZW1lc1VybChtaW5EYXRlLCBtYXhEYXRlKSA6IHRoaXMuYXN5bmNVcmwucmVwbGFjZSgnX3JhbmdlXycsIHRoaXMuZ2V0UmFuZ2UoKSkpICsgdGhpcy5hc3luY1BhcmFtcztcbiAgICAgIHJldHVybiAodXJsKSA/IHRoaXMuZmV0Y2hEYXRhKHVybCwgJ2RhdGEnLCAhaXNQcmVjaXNlUmFuZ2UpIDogbnVsbDtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNoYXJ0LnJlZHJhdyhmYWxzZSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gKCFpc1ByZWNpc2VSYW5nZSkgPyB0aGlzLmNoYXJ0Lnpvb21PdXQoKSA6IG51bGw7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5pc0xvYWRlZCA9IHRydWU7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy50b2dnbGVFdmVudHMoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgZmV0Y2hEYXRhKHVybCwgZGF0YVR5cGUgPSAnZGF0YScsIHJlcGxhY2UgPSB0cnVlKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5jaGFydC5zaG93TG9hZGluZygpO1xuICAgICAgcmV0dXJuIGZldGNoU2VydmljZS5mZXRjaENoYXJ0RGF0YSh1cmwsICF0aGlzLmlzTG9hZGVkKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgdGhpcy5jaGFydC5oaWRlTG9hZGluZygpO1xuICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLmxvZyhgTG9va3MgbGlrZSB0aGVyZSB3YXMgYSBwcm9ibGVtLiBTdGF0dXMgQ29kZTogJHtyZXNwb25zZS5zdGF0dXN9YCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLmRhdGFQYXJzZXIoZGF0YSwgZGF0YVR5cGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoY29udGVudCkgPT4ge1xuICAgICAgICAgIHJldHVybiAocmVwbGFjZSkgPyB0aGlzLnJlcGxhY2VEYXRhKGNvbnRlbnQuZGF0YSwgZGF0YVR5cGUpIDogdGhpcy51cGRhdGVEYXRhKGNvbnRlbnQuZGF0YSwgZGF0YVR5cGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9KTtcbiAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIHRoaXMuY2hhcnQuaGlkZUxvYWRpbmcoKTtcbiAgICAgIHRoaXMuaGlkZUNoYXJ0KCk7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ0ZldGNoIEVycm9yJywgZXJyb3IpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBoaWRlQ2hhcnQoYm9vbCA9IHRydWUpe1xuICAgIGNvbnN0IGNsYXNzRnVuYyA9IChib29sKSA/ICdhZGQnIDogJ3JlbW92ZSc7XG4gICAgY29uc3Qgc2libGluZ3MgPSBjcEJvb3RzdHJhcC5ub2RlTGlzdFRvQXJyYXkodGhpcy5jb250YWluZXIucGFyZW50RWxlbWVudC5jaGlsZE5vZGVzKTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHNpYmxpbmdzLmZpbHRlcihlbGVtZW50ID0+IGVsZW1lbnQuaWQuc2VhcmNoKCdjaGFydCcpID09PSAtMSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChyZXN1bHQsIGVsZW1lbnQgPT4gZWxlbWVudC5jbGFzc0xpc3RbY2xhc3NGdW5jXSgnY3AtaGlkZGVuJykpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGFpbmVyLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0W2NsYXNzRnVuY10oJ2NwLWNoYXJ0LW5vLWRhdGEnKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgc2V0UmFuZ2VTd2l0Y2hlcigpe1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoYCR7IHRoaXMuaWQgfS1zd2l0Y2gtcmFuZ2VgLCAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuZGVmYXVsdFJhbmdlID0gZXZlbnQuZGV0YWlsLmRhdGE7XG4gICAgICByZXR1cm4gdGhpcy5mZXRjaERhdGFQYWNrYWdlKCk7XG4gICAgfSk7XG4gIH1cbiAgXG4gIGdldFJhbmdlKCl7XG4gICAgcmV0dXJuIHRoaXMuZGVmYXVsdFJhbmdlIHx8ICcxcSc7XG4gIH1cbiAgXG4gIHRvZ2dsZUV2ZW50cygpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5jcEV2ZW50cyl7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2hpZ2hjaGFydHMtYW5ub3RhdGlvbicpO1xuICAgICAgfSk7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChlbGVtZW50cykgPT4ge1xuICAgICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChlbGVtZW50cywgZWxlbWVudCA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNFdmVudHNIaWRkZW4pe1xuICAgICAgICAgICAgcmV0dXJuICghZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZ2hjaGFydHMtYW5ub3RhdGlvbl9faGlkZGVuJykpID8gZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWdoY2hhcnRzLWFubm90YXRpb25fX2hpZGRlbicpIDogbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaGlnaGNoYXJ0cy1hbm5vdGF0aW9uX19oaWRkZW4nKSkgPyBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hjaGFydHMtYW5ub3RhdGlvbl9faGlkZGVuJykgOiBudWxsO1xuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2hpZ2hjaGFydHMtcGxvdC1saW5lJyk7XG4gICAgICB9KTtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGVsZW1lbnRzKSA9PiB7XG4gICAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKGVsZW1lbnRzLCBlbGVtZW50ID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5pc0V2ZW50c0hpZGRlbil7XG4gICAgICAgICAgICByZXR1cm4gKCFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaGlnaGNoYXJ0cy1wbG90LWxpbmVfX2hpZGRlbicpKSA/IGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlnaGNoYXJ0cy1wbG90LWxpbmVfX2hpZGRlbicpIDogbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaGlnaGNoYXJ0cy1wbG90LWxpbmVfX2hpZGRlbicpKSA/IGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGNoYXJ0cy1wbG90LWxpbmVfX2hpZGRlbicpIDogbnVsbDtcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgZGF0YVBhcnNlcihkYXRhLCBkYXRhVHlwZSA9ICdkYXRhJyl7XG4gICAgc3dpdGNoIChkYXRhVHlwZSl7XG4gICAgICBjYXNlICdkYXRhJzpcbiAgICAgICAgbGV0IHByb21pc2VEYXRhID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2VEYXRhID0gcHJvbWlzZURhdGEudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuICh0aGlzLmNoYXJ0RGF0YVBhcnNlcikgPyB0aGlzLmNoYXJ0RGF0YVBhcnNlcihkYXRhKSA6IHtcbiAgICAgICAgICAgIGRhdGE6IGRhdGFbMF0sXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlRGF0YTtcbiAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZGF0YSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbiAgXG4gIHVwZGF0ZURhdGEoZGF0YSwgZGF0YVR5cGUpIHtcbiAgICBsZXQgbmV3RGF0YTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgc3dpdGNoIChkYXRhVHlwZSkge1xuICAgICAgICBjYXNlICdkYXRhJzpcbiAgICAgICAgICBuZXdEYXRhID0ge307XG4gICAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AoT2JqZWN0LmVudHJpZXMoZGF0YSksICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNFeGNsdWRlZCh2YWx1ZVswXSkpIHJldHVybjtcbiAgICAgICAgICAgIGxldCBvbGREYXRhID0gdGhpcy5nZXRPbGREYXRhKGRhdGFUeXBlKVt2YWx1ZVswXV07XG4gICAgICAgICAgICBuZXdEYXRhW3ZhbHVlWzBdXSA9IG9sZERhdGFcbiAgICAgICAgICAgICAgLmZpbHRlcigoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZVsxXS5maW5kSW5kZXgoZmluZEVsZW1lbnQgPT4gdGhpcy5pc1RoZVNhbWVFbGVtZW50KGVsZW1lbnQsIGZpbmRFbGVtZW50LCBkYXRhVHlwZSkpID09PSAtMTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmNvbmNhdCh2YWx1ZVsxXSlcbiAgICAgICAgICAgICAgLnNvcnQoKGRhdGExLCBkYXRhMikgPT4gdGhpcy5zb3J0Q29uZGl0aW9uKGRhdGExLCBkYXRhMiwgZGF0YVR5cGUpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgICBuZXdEYXRhID0gW107XG4gICAgICAgICAgbGV0IG9sZERhdGEgPSB0aGlzLmdldE9sZERhdGEoZGF0YVR5cGUpO1xuICAgICAgICAgIHJldHVybiBuZXdEYXRhID0gb2xkRGF0YVxuICAgICAgICAgICAgLmZpbHRlcigoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICBkYXRhLmZpbmRJbmRleChmaW5kRWxlbWVudCA9PiB0aGlzLmlzVGhlU2FtZUVsZW1lbnQoZWxlbWVudCwgZmluZEVsZW1lbnQsIGRhdGFUeXBlKSkgPT09IC0xO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jb25jYXQoZGF0YSlcbiAgICAgICAgICAgIC5zb3J0KChkYXRhMSwgZGF0YTIpID0+IHRoaXMuc29ydENvbmRpdGlvbihkYXRhMSwgZGF0YTIsIGRhdGFUeXBlKSk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZURhdGEobmV3RGF0YSwgZGF0YVR5cGUpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBpc1RoZVNhbWVFbGVtZW50KGVsZW1lbnRBLCBlbGVtZW50QiwgZGF0YVR5cGUpe1xuICAgIHN3aXRjaCAoZGF0YVR5cGUpe1xuICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgIHJldHVybiBlbGVtZW50QVswXSA9PT0gZWxlbWVudEJbMF07XG4gICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICByZXR1cm4gZWxlbWVudEEudHMgPT09IGVsZW1lbnRCLnRzO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICBcbiAgc29ydENvbmRpdGlvbihlbGVtZW50QSwgZWxlbWVudEIsIGRhdGFUeXBlKXtcbiAgICBzd2l0Y2ggKGRhdGFUeXBlKXtcbiAgICAgIGNhc2UgJ2RhdGEnOlxuICAgICAgICByZXR1cm4gZWxlbWVudEFbMF0gLSBlbGVtZW50QlswXTtcbiAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgIHJldHVybiBlbGVtZW50QS50cyAtIGVsZW1lbnRCLnRzO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICBcbiAgZ2V0T2xkRGF0YShkYXRhVHlwZSl7XG4gICAgcmV0dXJuIHRoaXNbJ2NoYXJ0XycrZGF0YVR5cGUudG9Mb3dlckNhc2UoKV07XG4gIH1cbiAgXG4gIHJlcGxhY2VEYXRhKGRhdGEsIGRhdGFUeXBlKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXNbJ2NoYXJ0XycrZGF0YVR5cGUudG9Mb3dlckNhc2UoKV0gPSBkYXRhO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZURhdGFUeXBlKGRhdGEsIGRhdGFUeXBlKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiAodGhpcy5yZXBsYWNlQ2FsbGJhY2spID8gdGhpcy5yZXBsYWNlQ2FsbGJhY2sodGhpcy5jaGFydCwgZGF0YSwgdGhpcy5pc0xvYWRlZCwgZGF0YVR5cGUpIDogbnVsbDtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgcmVwbGFjZURhdGFUeXBlKGRhdGEsIGRhdGFUeXBlKXtcbiAgICBzd2l0Y2ggKGRhdGFUeXBlKXtcbiAgICAgIGNhc2UgJ2RhdGEnOlxuICAgICAgICBpZiAodGhpcy5hc3luY1VybCl7XG4gICAgICAgICAgY3BCb290c3RyYXAubG9vcChbJ2J0Yy1iaXRjb2luJywgJ2V0aC1ldGhlcmV1bSddLCBjb2luTmFtZSA9PiB7XG4gICAgICAgICAgICBsZXQgY29pblNob3J0ID0gY29pbk5hbWUuc3BsaXQoJy0nKVswXTtcbiAgICAgICAgICAgIGlmICh0aGlzLmFzeW5jVXJsLnNlYXJjaChjb2luTmFtZSkgPiAtMSAmJiBkYXRhW2NvaW5TaG9ydF0pIHtcbiAgICAgICAgICAgICAgZGF0YVtjb2luU2hvcnRdID0gW107XG4gICAgICAgICAgICAgIGNwQm9vdHN0cmFwLmxvb3AodGhpcy5jaGFydC5zZXJpZXMsIHNlcmllcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHNlcmllcy51c2VyT3B0aW9ucy5pZCA9PT0gY29pblNob3J0KSBzZXJpZXMudXBkYXRlKHsgdmlzaWJsZTogZmFsc2UgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKE9iamVjdC5lbnRyaWVzKGRhdGEpLCAodmFsdWUpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5pc0V4Y2x1ZGVkKHZhbHVlWzBdKSkgcmV0dXJuO1xuICAgICAgICAgIHJldHVybiAodGhpcy5jaGFydC5nZXQodmFsdWVbMF0pKSA/IHRoaXMuY2hhcnQuZ2V0KHZhbHVlWzBdKS5zZXREYXRhKHZhbHVlWzFdLCBmYWxzZSwgZmFsc2UsIGZhbHNlKSA6IHRoaXMuY2hhcnQuYWRkU2VyaWVzKHtpZDogdmFsdWVbMF0sIGRhdGE6IHZhbHVlWzFdLCBzaG93SW5OYXZpZ2F0b3I6IHRydWV9KTtcbiAgICAgICAgfSk7XG4gICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcCh0aGlzLmNoYXJ0LmFubm90YXRpb25zLmFsbEl0ZW1zLCBhbm5vdGF0aW9uID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhbm5vdGF0aW9uLmRlc3Ryb3koKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNldEFubm90YXRpb25zT2JqZWN0cyhkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIFxuICBpc0V4Y2x1ZGVkKGxhYmVsKXtcbiAgICByZXR1cm4gdGhpcy5leGNsdWRlU2VyaWVzSWRzLmluZGV4T2YobGFiZWwpID4gLTE7XG4gIH1cbiAgXG4gIHRvb2x0aXBGb3JtYXR0ZXIocG9pbnRlciwgbGFiZWwgPSAnJywgc2VhcmNoKXtcbiAgICBpZiAoIXNlYXJjaCkgc2VhcmNoID0gbGFiZWw7XG4gICAgY29uc3QgaGVhZGVyID0gJzxkaXYgY2xhc3M9XCJjcC1jaGFydC10b29sdGlwLWN1cnJlbmN5XCI+PHNtYWxsPicrbmV3IERhdGUocG9pbnRlci54KS50b1VUQ1N0cmluZygpKyc8L3NtYWxsPjx0YWJsZT4nO1xuICAgIGNvbnN0IGZvb3RlciA9ICc8L3RhYmxlPjwvZGl2Pic7XG4gICAgbGV0IGNvbnRlbnQgPSAnJztcbiAgICBwb2ludGVyLnBvaW50cy5mb3JFYWNoKHBvaW50ID0+IHtcbiAgICAgIGNvbnRlbnQgKz0gJzx0cj4nICtcbiAgICAgICAgJzx0ZD4nICtcbiAgICAgICAgJzxzdmcgd2lkdGg9XCI1XCIgaGVpZ2h0PVwiNVwiPjxyZWN0IHg9XCIwXCIgeT1cIjBcIiB3aWR0aD1cIjVcIiBoZWlnaHQ9XCI1XCIgZmlsbD1cIicrcG9pbnQuc2VyaWVzLmNvbG9yKydcIiBmaWxsLW9wYWNpdHk9XCIxXCI+PC9yZWN0Pjwvc3ZnPicgK1xuICAgICAgICBwb2ludC5zZXJpZXMubmFtZSArICc6ICcgKyBwb2ludC55LnRvTG9jYWxlU3RyaW5nKCdydS1SVScsIHsgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiA4IH0pLnJlcGxhY2UoJywnLCAnLicpICsgJyAnICsgKChwb2ludC5zZXJpZXMubmFtZS50b0xvd2VyQ2FzZSgpLnNlYXJjaChzZWFyY2gudG9Mb3dlckNhc2UoKSkgPiAtMSkgPyBcIlwiIDogbGFiZWwpICtcbiAgICAgICAgJzwvdGQ+JyArXG4gICAgICAgICc8L3RyPic7XG4gICAgfSk7XG4gICAgcmV0dXJuIGhlYWRlciArIGNvbnRlbnQgKyBmb290ZXI7XG4gIH1cbiAgXG4gIHNldEFubm90YXRpb25zT2JqZWN0cyhkYXRhKXtcbiAgICB0aGlzLmNoYXJ0LnNlcmllc1swXS54QXhpcy5yZW1vdmVQbG90TGluZSgpO1xuICAgIGxldCBwbG90TGluZXMgPSBbXTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGRhdGEuc29ydCgoZGF0YTEsIGRhdGEyKSA9PiB7XG4gICAgICAgIHJldHVybiBkYXRhMi50cyAtIGRhdGExLnRzO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChkYXRhLCBlbGVtZW50ID0+IHtcbiAgICAgICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHBsb3RMaW5lcy5wdXNoKHtcbiAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgdmFsdWU6IGVsZW1lbnQudHMsXG4gICAgICAgICAgICBkYXNoU3R5bGU6ICdzb2xpZCcsXG4gICAgICAgICAgICB6SW5kZXg6IDQsXG4gICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRFdmVudFRhZ1BhcmFtcygpLmNvbG9yLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY2hhcnQuYWRkQW5ub3RhdGlvbih7XG4gICAgICAgICAgICB4VmFsdWU6IGVsZW1lbnQudHMsXG4gICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgdGl0bGU6IGA8c3BhbiB0aXRsZT1cIkNsaWNrIHRvIG9wZW5cIiBjbGFzcz1cImNwLWNoYXJ0LWFubm90YXRpb25fX3RleHRcIj4keyB0aGlzLmdldEV2ZW50VGFnUGFyYW1zKGVsZW1lbnQudGFnKS5sYWJlbCB9PC9zcGFuPjxzcGFuIGNsYXNzPVwiY3AtY2hhcnQtYW5ub3RhdGlvbl9fZGF0YUVsZW1lbnRcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+JHsgSlNPTi5zdHJpbmdpZnkoZWxlbWVudCkgfTwvc3Bhbj5gLFxuICAgICAgICAgICAgc2hhcGU6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ2NpcmNsZScsXG4gICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIHI6IDExLFxuICAgICAgICAgICAgICAgIGN4OiA5LFxuICAgICAgICAgICAgICAgIGN5OiAxMC41LFxuICAgICAgICAgICAgICAgICdzdHJva2Utd2lkdGgnOiAxLjUsXG4gICAgICAgICAgICAgICAgZmlsbDogdGhpcy5nZXRFdmVudFRhZ1BhcmFtcygpLmNvbG9yLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICBtb3VzZW92ZXI6IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChNb2JpbGVEZXRlY3QuaXNNb2JpbGUoKSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gdGhpcy5nZXRFdmVudERhdGFGcm9tQW5ub3RhdGlvbkV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5FdmVudENvbnRhaW5lcihkYXRhLCBldmVudCk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG1vdXNlb3V0OiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKE1vYmlsZURldGVjdC5pc01vYmlsZSgpKSByZXR1cm47XG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZUV2ZW50Q29udGFpbmVyKGV2ZW50KTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gdGhpcy5nZXRFdmVudERhdGFGcm9tQW5ub3RhdGlvbkV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgICAgICBpZiAoTW9iaWxlRGV0ZWN0LmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMub3BlbkV2ZW50Q29udGFpbmVyKGRhdGEsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuRXZlbnRQYWdlKGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNoYXJ0LnNlcmllc1swXS54QXhpcy51cGRhdGUoe1xuICAgICAgICBwbG90TGluZXMsXG4gICAgICB9LCBmYWxzZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHNldE5hdmlnYXRvcihvcHRpb25zKXtcbiAgICBsZXQgbmF2aWdhdG9yT3B0aW9ucyA9IHt9O1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBpZiAob3B0aW9ucy5uYXZpZ2F0b3IgPT09IHRydWUpe1xuICAgICAgICBuYXZpZ2F0b3JPcHRpb25zID0ge1xuICAgICAgICAgIG5hdmlnYXRvcjoge1xuICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgbWFyZ2luOiAyMCxcbiAgICAgICAgICAgIHNlcmllczoge1xuICAgICAgICAgICAgICBsaW5lV2lkdGg6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWFza0ZpbGw6ICdyZ2JhKDEwMiwxMzMsMTk0LDAuMTUpJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICB6b29tVHlwZTogJ3gnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgeEF4aXM6IHtcbiAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICBzZXRFeHRyZW1lczogKGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoKGUudHJpZ2dlciA9PT0gJ25hdmlnYXRvcicgfHwgZS50cmlnZ2VyID09PSAnem9vbScpICYmIGUubWluICYmIGUubWF4KSB7XG4gICAgICAgICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCh0aGlzLmlkKydTZXRFeHRyZW1lcycsIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgbWluRGF0ZTogZS5taW4sXG4gICAgICAgICAgICAgICAgICAgICAgbWF4RGF0ZTogZS5tYXgsXG4gICAgICAgICAgICAgICAgICAgICAgZSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5uYXZpZ2F0b3JFeHRyZW1lc0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuc2V0UmVzZXRab29tQnV0dG9uKCk7XG4gICAgICB9IGVsc2UgaWYgKCFvcHRpb25zLm5hdmlnYXRvcikge1xuICAgICAgICBuYXZpZ2F0b3JPcHRpb25zID0ge1xuICAgICAgICAgIG5hdmlnYXRvcjoge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC51cGRhdGVPYmplY3Qob3B0aW9ucywgbmF2aWdhdG9yT3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHNldFJlc2V0Wm9vbUJ1dHRvbigpe1xuICAgIC8vIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTsgLy8gY2FudCBiZSBwb3NpdGlvbmVkIHByb3Blcmx5IGluIHBsb3RCb3gsIHNvIGl0cyBkaXNhYmxlZFxuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hZGRDb250YWluZXIodGhpcy5pZCwgJ1Jlc2V0Wm9vbScsICdjcC1jaGFydC1yZXNldC16b29tJywgJ2J1dHRvbicpXG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRDb250YWluZXIoJ1Jlc2V0Wm9vbScpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGVsZW1lbnQpID0+IHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgndWstYnV0dG9uJyk7XG4gICAgICBlbGVtZW50LmlubmVyVGV4dCA9ICdSZXNldCB6b29tJztcbiAgICAgIHJldHVybiBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICB0aGlzLmNoYXJ0Lnpvb21PdXQoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBuYXZpZ2F0b3JFeHRyZW1lc0xpc3RlbmVyKCkge1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmlkICsgJ1NldEV4dHJlbWVzJywgKGUpID0+IHtcbiAgICAgICAgbGV0IG1pbkRhdGUgPSBjcEJvb3RzdHJhcC5yb3VuZChlLmRldGFpbC5taW5EYXRlIC8gMTAwMCwgMCk7XG4gICAgICAgIGxldCBtYXhEYXRlID0gY3BCb290c3RyYXAucm91bmQoZS5kZXRhaWwubWF4RGF0ZSAvIDEwMDAsIDApO1xuICAgICAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5mZXRjaERhdGFQYWNrYWdlKG1pbkRhdGUsIG1heERhdGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgZ2V0TmF2aWdhdG9yRXh0cmVtZXNVcmwobWluRGF0ZSwgbWF4RGF0ZSwgZGF0YVR5cGUpe1xuICAgIGxldCBleHRyZW1lc0RhdGFVcmwgPSAoZGF0YVR5cGUpID8gdGhpcy5nZXRFeHRyZW1lc0RhdGFVcmwodGhpcy5pZCwgZGF0YVR5cGUpIDogdGhpcy5leHRyZW1lc0RhdGFVcmw7XG4gICAgcmV0dXJuIChtaW5EYXRlICYmIG1heERhdGUgJiYgZXh0cmVtZXNEYXRhVXJsKSA/IGV4dHJlbWVzRGF0YVVybCArJy9kYXRlcy8nK21pbkRhdGUrJy8nK21heERhdGUrJy8nIDogbnVsbDtcbiAgfVxuICBcbiAgc2V0Tm9EYXRhTGFiZWwob3B0aW9ucyl7XG4gICAgbGV0IG5vRGF0YU9wdGlvbnMgPSB7fTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgbm9EYXRhT3B0aW9ucyA9IHtcbiAgICAgICAgbGFuZzoge1xuICAgICAgICAgIG5vRGF0YTogJ1dlIGRvblxcJ3QgaGF2ZSBkYXRhIGZvciB0aGlzIHRpbWUgcGVyaW9kJ1xuICAgICAgICB9LFxuICAgICAgICBub0RhdGE6IHtcbiAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgZm9udEZhbWlseTogJ0FyaWFsJyxcbiAgICAgICAgICAgIGZvbnRTaXplOiAnMTRweCcsXG4gICAgICAgICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLnVwZGF0ZU9iamVjdChvcHRpb25zLCBub0RhdGFPcHRpb25zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgYWRkQ29udGFpbmVyKGlkLCBsYWJlbCwgY2xhc3NOYW1lLCB0YWdOYW1lID0gJ2Rpdicpe1xuICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xuICAgIGxldCBjaGFydENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICBjb250YWluZXIuaWQgPSBpZCArIGxhYmVsO1xuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgY2hhcnRDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgfVxuICBcbiAgZ2V0Q29udGFpbmVyKGxhYmVsKXtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCtsYWJlbCk7XG4gIH1cbiAgXG4gIGdldEV4dHJlbWVzRGF0YVVybChpZCwgZGF0YVR5cGUgPSAnZGF0YScpe1xuICAgIHJldHVybiAnL2N1cnJlbmN5LycrIGRhdGFUeXBlICsnLycrIHRoaXMuY3VycmVuY3k7XG4gIH1cbiAgXG4gIGdldFZvbHVtZVBhdHRlcm4oKXtcbiAgICByZXR1cm4ge1xuICAgICAgZGVmczoge1xuICAgICAgICBwYXR0ZXJuczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdpZCc6ICdmaWxsLXBhdHRlcm4nLFxuICAgICAgICAgICAgJ3BhdGgnOiB7XG4gICAgICAgICAgICAgIGQ6ICdNIDMgMCBMIDMgMTAgTSA4IDAgTCA4IDEwJyxcbiAgICAgICAgICAgICAgc3Ryb2tlOiBcIiNlM2UzZTNcIixcbiAgICAgICAgICAgICAgZmlsbDogJyNmMWYxZjEnLFxuICAgICAgICAgICAgICBzdHJva2VXaWR0aDogMixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnaWQnOiAnZmlsbC1wYXR0ZXJuLW5pZ2h0JyxcbiAgICAgICAgICAgICdwYXRoJzoge1xuICAgICAgICAgICAgICBkOiAnTSAzIDAgTCAzIDEwIE0gOCAwIEwgOCAxMCcsXG4gICAgICAgICAgICAgIHN0cm9rZTogXCIjOWI5YjliXCIsXG4gICAgICAgICAgICAgIGZpbGw6ICcjMzgzODM4JyxcbiAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IDIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cblxuY2xhc3MgYm9vdHN0cmFwQ2xhc3Mge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVtcHR5VmFsdWUgPSAwO1xuICAgIHRoaXMuZW1wdHlEYXRhID0gJy0nO1xuICB9XG4gIFxuICBub2RlTGlzdFRvQXJyYXkobm9kZUxpc3QpIHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobm9kZUxpc3QpO1xuICB9XG4gIFxuICBwYXJzZUludGVydmFsVmFsdWUodmFsdWUpIHtcbiAgICBsZXQgdGltZVN5bWJvbCA9ICcnLCBtdWx0aXBsaWVyID0gMTtcbiAgICBpZiAodmFsdWUuc2VhcmNoKCdzJykgPiAtMSkge1xuICAgICAgdGltZVN5bWJvbCA9ICdzJztcbiAgICAgIG11bHRpcGxpZXIgPSAxMDAwO1xuICAgIH1cbiAgICBpZiAodmFsdWUuc2VhcmNoKCdtJykgPiAtMSkge1xuICAgICAgdGltZVN5bWJvbCA9ICdtJztcbiAgICAgIG11bHRpcGxpZXIgPSA2MCAqIDEwMDA7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5zZWFyY2goJ2gnKSA+IC0xKSB7XG4gICAgICB0aW1lU3ltYm9sID0gJ2gnO1xuICAgICAgbXVsdGlwbGllciA9IDYwICogNjAgKiAxMDAwO1xuICAgIH1cbiAgICBpZiAodmFsdWUuc2VhcmNoKCdkJykgPiAtMSkge1xuICAgICAgdGltZVN5bWJvbCA9ICdkJztcbiAgICAgIG11bHRpcGxpZXIgPSAyNCAqIDYwICogNjAgKiAxMDAwO1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZS5yZXBsYWNlKHRpbWVTeW1ib2wsICcnKSkgKiBtdWx0aXBsaWVyO1xuICB9XG4gIFxuICBpc0ZpYXQoY3VycmVuY3ksIG9yaWdpbil7XG4gICAgaWYgKCFvcmlnaW4pIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGxldCB1cmwgPSBvcmlnaW4gKyAnL2Rpc3QvZGF0YS9jdXJyZW5jaWVzLmpzb24nO1xuICAgICAgcmV0dXJuIGZldGNoU2VydmljZS5mZXRjaEpzb25GaWxlKHVybCwgdHJ1ZSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICByZXR1cm4gKHJlc3VsdFtjdXJyZW5jeS50b1VwcGVyQ2FzZSgpXSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHVwZGF0ZU9iamVjdChvYmosIG5ld09iaikge1xuICAgIGxldCByZXN1bHQgPSBvYmo7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKE9iamVjdC5rZXlzKG5ld09iaiksIGtleSA9PiB7XG4gICAgICAgIGlmIChyZXN1bHQuaGFzT3duUHJvcGVydHkoa2V5KSAmJiB0eXBlb2YgcmVzdWx0W2tleV0gPT09ICdvYmplY3QnKXtcbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVPYmplY3QocmVzdWx0W2tleV0sIG5ld09ialtrZXldKS50aGVuKCh1cGRhdGVSZXN1bHQpID0+IHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdXBkYXRlUmVzdWx0O1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRba2V5XSA9IG5ld09ialtrZXldO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHBhcnNlQ3VycmVuY3lOdW1iZXIodmFsdWUsIGN1cnJlbmN5LCBvcmlnaW4pe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5pc0ZpYXQoY3VycmVuY3ksIG9yaWdpbik7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICByZXR1cm4gKHJlc3VsdCkgPyB0aGlzLnBhcnNlTnVtYmVyKHZhbHVlLCAyKSA6IHRoaXMucGFyc2VOdW1iZXIodmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBwYXJzZU51bWJlcihudW1iZXIsIHByZWNpc2lvbikge1xuICAgIGlmICghbnVtYmVyICYmIG51bWJlciAhPT0gMCkgcmV0dXJuIG51bWJlcjtcbiAgICBpZiAobnVtYmVyID09PSB0aGlzLmVtcHR5VmFsdWUgfHwgbnVtYmVyID09PSB0aGlzLmVtcHR5RGF0YSkgcmV0dXJuIG51bWJlcjtcbiAgICBudW1iZXIgPSBwYXJzZUZsb2F0KG51bWJlcik7XG4gICAgaWYgKG51bWJlciA+IDEwMDAwMCkge1xuICAgICAgbGV0IG51bWJlclN0ciA9IG51bWJlci50b0ZpeGVkKDApO1xuICAgICAgbGV0IHBhcmFtZXRlciA9ICdLJyxcbiAgICAgICAgc3BsaWNlZCA9IG51bWJlclN0ci5zbGljZSgwLCBudW1iZXJTdHIubGVuZ3RoIC0gMSk7XG4gICAgICBpZiAobnVtYmVyID4gMTAwMDAwMDAwMCkge1xuICAgICAgICBzcGxpY2VkID0gbnVtYmVyU3RyLnNsaWNlKDAsIG51bWJlclN0ci5sZW5ndGggLSA3KTtcbiAgICAgICAgcGFyYW1ldGVyID0gJ0InO1xuICAgICAgfSBlbHNlIGlmIChudW1iZXIgPiAxMDAwMDAwKSB7XG4gICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDQpO1xuICAgICAgICBwYXJhbWV0ZXIgPSAnTSc7XG4gICAgICB9XG4gICAgICBsZXQgbmF0dXJhbCA9IHNwbGljZWQuc2xpY2UoMCwgc3BsaWNlZC5sZW5ndGggLSAyKTtcbiAgICAgIGxldCBkZWNpbWFsID0gc3BsaWNlZC5zbGljZShzcGxpY2VkLmxlbmd0aCAtIDIpO1xuICAgICAgcmV0dXJuIG5hdHVyYWwgKyAnLicgKyBkZWNpbWFsICsgJyAnICsgcGFyYW1ldGVyO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgaXNEZWNpbWFsID0gKG51bWJlciAlIDEpID4gMDtcbiAgICAgIGlmIChpc0RlY2ltYWwpIHtcbiAgICAgICAgaWYgKCFwcmVjaXNpb24gfHwgbnVtYmVyIDwgMC4wMSl7XG4gICAgICAgICAgcHJlY2lzaW9uID0gMjtcbiAgICAgICAgICBpZiAobnVtYmVyIDwgMSkge1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gODtcbiAgICAgICAgICB9IGVsc2UgaWYgKG51bWJlciA8IDEwKSB7XG4gICAgICAgICAgICBwcmVjaXNpb24gPSA2O1xuICAgICAgICAgIH0gZWxzZSBpZiAobnVtYmVyIDwgMTAwMCkge1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gNDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucm91bmQobnVtYmVyLCBwcmVjaXNpb24pLnRvTG9jYWxlU3RyaW5nKCdydS1SVScsIHsgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiBwcmVjaXNpb24gfSkucmVwbGFjZSgnLCcsICcuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVtYmVyLnRvTG9jYWxlU3RyaW5nKCdydS1SVScsIHsgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyIH0pLnJlcGxhY2UoJywnLCAnLicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgcm91bmQoYW1vdW50LCBkZWNpbWFsID0gOCwgZGlyZWN0aW9uID0gJ3JvdW5kJykge1xuICAgIGFtb3VudCA9IHBhcnNlRmxvYXQoYW1vdW50KTtcbiAgICBkZWNpbWFsID0gTWF0aC5wb3coMTAsIGRlY2ltYWwpO1xuICAgIHJldHVybiBNYXRoW2RpcmVjdGlvbl0oYW1vdW50ICogZGVjaW1hbCkgLyBkZWNpbWFsO1xuICB9XG4gIFxuICBsb29wKGFyciwgZm4sIGJ1c3ksIGVyciwgaSA9IDApIHtcbiAgICBjb25zdCBib2R5ID0gKG9rLCBlcikgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgciA9IGZuKGFycltpXSwgaSwgYXJyKTtcbiAgICAgICAgciAmJiByLnRoZW4gPyByLnRoZW4ob2spLmNhdGNoKGVyKSA6IG9rKHIpXG4gICAgICB9XG4gICAgICBjYXRjaCAoZSkge1xuICAgICAgICBlcihlKVxuICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgbmV4dCA9IChvaywgZXIpID0+ICgpID0+IHRoaXMubG9vcChhcnIsIGZuLCBvaywgZXIsICsraSk7XG4gICAgY29uc3QgcnVuID0gKG9rLCBlcikgPT4gaSA8IGFyci5sZW5ndGggPyBuZXcgUHJvbWlzZShib2R5KS50aGVuKG5leHQob2ssIGVyKSkuY2F0Y2goZXIpIDogb2soKTtcbiAgICByZXR1cm4gYnVzeSA/IHJ1bihidXN5LCBlcnIpIDogbmV3IFByb21pc2UocnVuKVxuICB9XG59XG5cbmNsYXNzIGZldGNoQ2xhc3Mge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMuc3RhdGUgPSB7fTtcbiAgfVxuICBcbiAgZmV0Y2hTY3JpcHQodXJsKSB7XG4gICAgaWYgKHRoaXMuc3RhdGVbdXJsXSkgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICB0aGlzLnN0YXRlW3VybF0gPSAncGVuZGluZyc7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlKSB0aGlzLnN0YXRlW3VybF0gPSAnZG93bmxvYWRlZCc7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgICAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSkgZGVsZXRlIHRoaXMuc3RhdGVbdXJsXTtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgRmFpbGVkIHRvIGxvYWQgaW1hZ2UncyBVUkw6ICR7dXJsfWApKTtcbiAgICAgIH0pO1xuICAgICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcbiAgICAgIHNjcmlwdC5zcmMgPSB1cmw7XG4gICAgfSk7XG4gIH1cbiAgXG4gIGZldGNoU3R5bGUodXJsKSB7XG4gICAgaWYgKHRoaXMuc3RhdGVbdXJsXSkgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICB0aGlzLnN0YXRlW3VybF0gPSAncGVuZGluZyc7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG4gICAgICBsaW5rLnNldEF0dHJpYnV0ZSgncmVsJywgJ3N0eWxlc2hlZXQnKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnaHJlZicsIHVybCk7XG4gICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlKSB0aGlzLnN0YXRlW3VybF0gPSAnZG93bmxvYWRlZCc7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUpIGRlbGV0ZSB0aGlzLnN0YXRlW3VybF07XG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYEZhaWxlZCB0byBsb2FkIHN0eWxlIFVSTDogJHt1cmx9YCkpO1xuICAgICAgfSk7XG4gICAgICBsaW5rLmhyZWYgPSB1cmw7XG4gICAgfSk7XG4gIH1cbiAgXG4gIGZldGNoQ2hhcnREYXRhKHVyaSwgZnJvbVN0YXRlID0gZmFsc2Upe1xuICAgIGNvbnN0IHVybCA9ICdodHRwczovL2dyYXBocy5jb2lucGFwcmlrYS5jb20nICsgdXJpO1xuICAgIHJldHVybiB0aGlzLmZldGNoRGF0YSh1cmwsIGZyb21TdGF0ZSk7XG4gIH1cbiAgXG4gIGZldGNoRGF0YSh1cmwsIGZyb21TdGF0ZSA9IGZhbHNlKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKGZyb21TdGF0ZSl7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlW3VybF0gPT09ICdwZW5kaW5nJyl7XG4gICAgICAgICAgbGV0IHByb21pc2VUaW1lb3V0ID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIHJlc29sdmUodGhpcy5mZXRjaERhdGEodXJsLCBmcm9tU3RhdGUpKTtcbiAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHByb21pc2VUaW1lb3V0O1xuICAgICAgICB9XG4gICAgICAgIGlmICghIXRoaXMuc3RhdGVbdXJsXSl7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLnN0YXRlW3VybF0uY2xvbmUoKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuc3RhdGVbdXJsXSA9ICdwZW5kaW5nJztcbiAgICAgIGxldCBwcm9taXNlRmV0Y2ggPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIHByb21pc2VGZXRjaCA9IHByb21pc2VGZXRjaC50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCk7XG4gICAgICB9KTtcbiAgICAgIHByb21pc2VGZXRjaCA9IHByb21pc2VGZXRjaC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICB0aGlzLnN0YXRlW3VybF0gPSByZXNwb25zZTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmNsb25lKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwcm9taXNlRmV0Y2g7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGZldGNoSnNvbkZpbGUodXJsLCBmcm9tU3RhdGUgPSBmYWxzZSl7XG4gICAgcmV0dXJuIHRoaXMuZmV0Y2hEYXRhKHVybCwgZnJvbVN0YXRlKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICBpZiAocmVzdWx0LnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQuanNvbigpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCB3aWRnZXRzID0gbmV3IHdpZGdldHNDb250cm9sbGVyKCk7XG5jb25zdCBjcEJvb3RzdHJhcCA9IG5ldyBib290c3RyYXBDbGFzcygpO1xuY29uc3QgZmV0Y2hTZXJ2aWNlID0gbmV3IGZldGNoQ2xhc3MoKTtcbiJdfQ==
