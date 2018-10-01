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
              var chartScripts = ['http://code.highcharts.com/stock/highstock.js', 'https://code.highcharts.com/modules/exporting.js', 'https://code.highcharts.com/modules/no-data-to-display.js', 'https://highcharts.github.io/pattern-fill/pattern-fill-v2.js'];
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
      origin_src: 'https://cdn.jsdelivr.net/npm/@coinpaprika/widget-currency',
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
          for (var j = 0; j < updateElements.length; j++) {
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
              updateElement.innerText = cpBootstrap.parseNumber(value) || cpBootstrap.emptyData;
            } else {
              updateElement.innerText = value || cpBootstrap.emptyData;
            }
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
      var _this10 = this;

      this.defaults.translations[lang] = data;

      var _loop = function _loop(x) {
        var isNoTranslationLabelsUpdate = _this10.states[x].noTranslationLabels.length > 0 && lang === 'en';
        if (_this10.states[x].language === lang || isNoTranslationLabelsUpdate) {
          (function () {
            var mainElement = _this10.states[x].mainElement;
            var transalteElements = Array.prototype.slice.call(mainElement.querySelectorAll('.cp-translation'));

            var _loop2 = function _loop2(y) {
              transalteElements[y].classList.forEach(function (className) {
                if (className.search('translation_') > -1) {
                  var translateKey = className.replace('translation_', '');
                  if (translateKey === 'message') translateKey = _this10.states[x].message;
                  var labelIndex = _this10.states[x].noTranslationLabels.indexOf(translateKey);
                  var text = _this10.getTranslation(x, translateKey);
                  if (labelIndex > -1 && text) {
                    _this10.states[x].noTranslationLabels.splice(labelIndex, 1);
                  }
                  transalteElements[y].innerText = text;
                  if (transalteElements[y].closest('.cp-widget__footer')) {
                    setTimeout(function () {
                      return _this10.setBeforeElementInFooter(x);
                    }, 50);
                  }
                }
              });
            };

            for (var y = 0; y < transalteElements.length; y++) {
              _loop2(y);
            }
          })();
        }
      };

      for (var x = 0; x < this.states.length; x++) {
        _loop(x);
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
      var _this11 = this;

      var data = this.states[index];
      var imgContainers = data.mainElement.getElementsByClassName('cp-widget__img');

      var _loop3 = function _loop3(i) {
        var imgContainer = imgContainers[i];
        imgContainer.classList.add('cp-widget__img--hidden');
        var img = imgContainer.querySelector('img');
        var newImg = new Image();
        newImg.onload = function () {
          img.src = newImg.src;
          imgContainer.classList.remove('cp-widget__img--hidden');
        };
        newImg.src = _this11.img_src(data.currency);
      };

      for (var i = 0; i < imgContainers.length; i++) {
        _loop3(i);
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
      var _this12 = this;

      if (!this.defaults.translations[lang]) {
        var xhr = new XMLHttpRequest();
        var url = this.defaults.lang_src || this.defaults.origin_src + '/dist/lang';
        xhr.open('GET', url + '/' + lang + '.json');
        xhr.onload = function () {
          if (xhr.status === 200) {
            _this12.updateWidgetTranslations(lang, JSON.parse(xhr.responseText));
          } else {
            _this12.onErrorRequest(0, xhr);
            _this12.getTranslations('en');
            delete _this12.defaults.translations[lang];
          }
        };
        xhr.onerror = function () {
          _this12.onErrorRequest(0, xhr);
          _this12.getTranslations('en');
          delete _this12.defaults.translations[lang];
        };
        xhr.send();
        this.defaults.translations[lang] = {};
      }
    }
  }]);

  return widgetsClass;
}();

var chartClass = function () {
  function chartClass(container, state) {
    var _this13 = this;

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
                var y = chart.plotHeight + chart.plotTop - chart.spacing[0] - 2 - (_this13.isResponsiveModeActive(chart) ? 10 : 0);
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
                if (_this13.chartsWithActiveSeriesCookies.indexOf(event.target.chart.renderTo.id) > -1) _this13.setVisibleChartCookies(event);
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
    this.chartDataParser = function (data, dataType) {
      var priceCurrency = state.primary_currency.toLowerCase();
      data = data[0];
      var newData = {
        data: {
          price: data[priceCurrency] ? data[priceCurrency] : [],
          volume: data.volume
        }
      };
      return Promise.resolve(newData);
    };
    this.isEventsHidden = false;
    this.excludeSeriesIds = [];
    this.asyncUrl = '/currency/data/' + state.currency + '/_range_/';
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
      var _this14 = this;

      var promise = Promise.resolve();
      promise = promise.then(function () {
        return _this14.parseOptions(_this14.options);
      });
      promise = promise.then(function (options) {
        return window.Highcharts ? Highcharts.stockChart(_this14.container.id, options, function (chart) {
          return _this14.bind(chart);
        }) : null;
      });
      return promise;
    }
  }, {
    key: 'parseOptions',
    value: function parseOptions(options) {
      var _this15 = this;

      var promise = Promise.resolve();
      promise = promise.then(function () {
        return cpBootstrap.updateObject(_this15.defaultOptions, options);
      });
      promise = promise.then(function (newOptions) {
        return cpBootstrap.updateObject(_this15.getVolumePattern(), newOptions);
      });
      promise = promise.then(function (newOptions) {
        return _this15.setNavigator(newOptions);
      });
      promise = promise.then(function (newOptions) {
        return newOptions.noData ? _this15.setNoDataLabel(newOptions) : newOptions;
      });
      promise = promise.then(function (newOptions) {
        return newOptions;
      });
      return promise;
    }
  }, {
    key: 'bind',
    value: function bind(chart) {
      var _this16 = this;

      var promise = Promise.resolve();
      promise = promise.then(function () {
        return _this16.chart = chart;
      });
      promise = promise.then(function () {
        return _this16.fetchDataPackage();
      });
      promise = promise.then(function () {
        return _this16.setRangeSwitcher();
      });
      promise = promise.then(function () {
        return _this16.callback ? _this16.callback(_this16.chart, _this16.defaultRange) : null;
      });
      return promise;
    }
  }, {
    key: 'fetchDataPackage',
    value: function fetchDataPackage(minDate, maxDate) {
      var _this17 = this;

      var isPreciseRange = minDate && maxDate;
      var promise = Promise.resolve();
      promise = promise.then(function () {
        if (_this17.options.cpEvents) {
          var url = isPreciseRange ? _this17.getNavigatorExtremesUrl(minDate, maxDate, 'events') : _this17.getExtremesDataUrl(_this17.id, 'events') + '/' + _this17.getRange() + '/';
          return url ? _this17.fetchData(url, 'events', !isPreciseRange) : null;
        }
        return null;
      });
      promise = promise.then(function () {
        var url = isPreciseRange ? _this17.getNavigatorExtremesUrl(minDate, maxDate) : _this17.asyncUrl.replace('_range_', _this17.getRange());
        return url ? _this17.fetchData(url, 'data', !isPreciseRange) : null;
      });
      promise = promise.then(function () {
        return _this17.chart.redraw(false);
      });
      promise = promise.then(function () {
        return !isPreciseRange ? _this17.chart.zoomOut() : null;
      });
      promise = promise.then(function () {
        return _this17.isLoaded = true;
      });
      promise = promise.then(function () {
        return _this17.toggleEvents();
      });
      return promise;
    }
  }, {
    key: 'fetchData',
    value: function fetchData(url) {
      var _this18 = this;

      var dataType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'data';
      var replace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var promise = Promise.resolve();
      promise = promise.then(function () {
        _this18.chart.showLoading();
        return fetchService.fetchChartData(url, !_this18.isLoaded);
      });
      promise = promise.then(function (response) {
        _this18.chart.hideLoading();
        if (response.status !== 200) {
          return console.log('Looks like there was a problem. Status Code: ' + response.status);
        }
        return response.json().then(function (data) {
          var promise = Promise.resolve();
          promise = promise.then(function () {
            return _this18.dataParser(data, dataType);
          });
          promise = promise.then(function (content) {
            return replace ? _this18.replaceData(content.data, dataType) : _this18.updateData(content.data, dataType);
          });
          return promise;
        });
      }).catch(function (error) {
        _this18.chart.hideLoading();
        return console.log('Fetch Error', error);
      });
      return promise;
    }
  }, {
    key: 'setRangeSwitcher',
    value: function setRangeSwitcher() {
      var _this19 = this;

      document.addEventListener(this.id + '-switch-range', function (event) {
        _this19.defaultRange = event.detail.data;
        return _this19.fetchDataPackage();
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
      var _this20 = this;

      var promise = Promise.resolve();
      if (this.options.cpEvents) {
        promise = promise.then(function () {
          return document.getElementsByClassName('highcharts-annotation');
        });
        promise = promise.then(function (elements) {
          return cpBootstrap.loop(elements, function (element) {
            if (_this20.isEventsHidden) {
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
            if (_this20.isEventsHidden) {
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
      var _this21 = this;

      var dataType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'data';

      switch (dataType) {
        case 'data':
          var promiseData = Promise.resolve();
          promiseData = promiseData.then(function () {
            return _this21.chartDataParser ? _this21.chartDataParser(data) : {
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
      var _this22 = this;

      var newData = void 0;
      var promise = Promise.resolve();
      promise = promise.then(function () {
        switch (dataType) {
          case 'data':
            newData = {};
            return cpBootstrap.loop(Object.entries(data), function (value) {
              if (_this22.isExcluded(value[0])) return;
              var oldData = _this22.getOldData(dataType)[value[0]];
              newData[value[0]] = oldData.filter(function (element) {
                return value[1].findIndex(function (findElement) {
                  return _this22.isTheSameElement(element, findElement, dataType);
                }) === -1;
              }).concat(value[1]).sort(function (data1, data2) {
                return _this22.sortCondition(data1, data2, dataType);
              });
            });
          case 'events':
            newData = [];
            var oldData = _this22.getOldData(dataType);
            return newData = oldData.filter(function (element) {
              data.findIndex(function (findElement) {
                return _this22.isTheSameElement(element, findElement, dataType);
              }) === -1;
            }).concat(data).sort(function (data1, data2) {
              return _this22.sortCondition(data1, data2, dataType);
            });
          default:
            return false;
        }
      });
      promise = promise.then(function () {
        return _this22.replaceData(newData, dataType);
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
      var _this23 = this;

      var promise = Promise.resolve();
      promise = promise.then(function () {
        return _this23['chart_' + dataType.toLowerCase()] = data;
      });
      promise = promise.then(function () {
        return _this23.replaceDataType(data, dataType);
      });
      promise = promise.then(function () {
        return _this23.replaceCallback ? _this23.replaceCallback(_this23.chart, data, _this23.isLoaded, dataType) : null;
      });
      return promise;
    }
  }, {
    key: 'replaceDataType',
    value: function replaceDataType(data, dataType) {
      var _this24 = this;

      switch (dataType) {
        case 'data':
          if (this.asyncUrl) {
            cpBootstrap.loop(['btc-bitcoin', 'eth-ethereum'], function (coinName) {
              var coinShort = coinName.split('-')[0];
              if (_this24.asyncUrl.search(coinName) > -1 && data[coinShort]) {
                data[coinShort] = [];
                cpBootstrap.loop(_this24.chart.series, function (series) {
                  if (series.userOptions.id === coinShort) series.update({ visible: false });
                });
              }
            });
          }
          return cpBootstrap.loop(Object.entries(data), function (value) {
            if (_this24.isExcluded(value[0])) return;
            return _this24.chart.get(value[0]) ? _this24.chart.get(value[0]).setData(value[1], false, false, false) : _this24.chart.addSeries({ id: value[0], data: value[1], showInNavigator: true });
          });
        case 'events':
          var promise = Promise.resolve();
          promise = promise.then(function () {
            return cpBootstrap.loop(_this24.chart.annotations.allItems, function (annotation) {
              return annotation.destroy();
            });
          });
          promise = promise.then(function () {
            return _this24.setAnnotationsObjects(data);
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
        content += '<tr>' + '<td>' + '<svg width="5" height="5"><rect x="0" y="0" width="5" height="5" fill="' + point.series.color + '" fill-opacity="1"></rect></svg>' + point.series.name + ': ' + point.y.toLocaleString('ru-RU', { maximumFractionDigits: 8 }) + ' ' + (point.series.name.toLowerCase().search(search.toLowerCase()) > -1 ? "" : label) + '</td>' + '</tr>';
      });
      return header + content + footer;
    }
  }, {
    key: 'setAnnotationsObjects',
    value: function setAnnotationsObjects(data) {
      var _this25 = this;

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
              color: _this25.getEventTagParams().color
            });
          });
          promise = promise.then(function () {
            return _this25.chart.addAnnotation({
              xValue: element.ts,
              y: 0,
              title: '<span title="Click to open" class="cp-chart-annotation__text">' + _this25.getEventTagParams(element.tag).label + '</span><span class="cp-chart-annotation__dataElement" style="display: none;">' + JSON.stringify(element) + '</span>',
              shape: {
                type: 'circle',
                params: {
                  r: 11,
                  cx: 9,
                  cy: 10.5,
                  'stroke-width': 1.5,
                  fill: _this25.getEventTagParams().color
                }
              },
              events: {
                mouseover: function mouseover(event) {
                  if (MobileDetect.isMobile()) return;
                  var data = _this25.getEventDataFromAnnotationEvent(event);
                  _this25.openEventContainer(data, event);
                },
                mouseout: function mouseout() {
                  if (MobileDetect.isMobile()) return;
                  _this25.closeEventContainer(event);
                },
                click: function click(event) {
                  var data = _this25.getEventDataFromAnnotationEvent(event);
                  if (MobileDetect.isMobile()) {
                    _this25.openEventContainer(data, event);
                  } else {
                    _this25.openEventPage(data);
                  }
                }
              }
            });
          });
          return promise;
        });
      });
      promise = promise.then(function () {
        return _this25.chart.series[0].xAxis.update({
          plotLines: plotLines
        }, false);
      });
      return promise;
    }
  }, {
    key: 'setNavigator',
    value: function setNavigator(options) {
      var _this26 = this;

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
                    document.dispatchEvent(new CustomEvent(_this26.id + 'SetExtremes', {
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
          _this26.navigatorExtremesListener();
          _this26.setResetZoomButton();
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
      var _this27 = this;

      // return Promise.resolve(); // cant be positioned properly in plotBox, so its disabled
      var promise = Promise.resolve();
      promise = promise.then(function () {
        return _this27.addContainer(_this27.id, 'ResetZoom', 'cp-chart-reset-zoom', 'button');
      });
      promise = promise.then(function () {
        return _this27.getContainer('ResetZoom');
      });
      promise = promise.then(function (element) {
        element.classList.add('uk-button');
        element.innerText = 'Reset zoom';
        return element.addEventListener('click', function () {
          _this27.chart.zoomOut();
        });
      });
      return promise;
    }
  }, {
    key: 'navigatorExtremesListener',
    value: function navigatorExtremesListener() {
      var _this28 = this;

      var promise = Promise.resolve();
      promise = promise.then(function () {
        return document.addEventListener(_this28.id + 'SetExtremes', function (e) {
          var minDate = cpBootstrap.round(e.detail.minDate / 1000, 0);
          var maxDate = cpBootstrap.round(e.detail.maxDate / 1000, 0);
          var promise = Promise.resolve();
          promise = promise.then(function () {
            return _this28.fetchDataPackage(minDate, maxDate);
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
    key: 'updateObject',
    value: function updateObject(obj, newObj) {
      var _this29 = this;

      var result = obj;
      var promise = Promise.resolve();
      promise = promise.then(function () {
        return cpBootstrap.loop(Object.keys(newObj), function (key) {
          if (result.hasOwnProperty(key) && _typeof(result[key]) === 'object') {
            return _this29.updateObject(result[key], newObj[key]).then(function (updateResult) {
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
    key: 'parseNumber',
    value: function parseNumber(number) {
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
          var precision = 2;
          if (number < 1) {
            precision = 8;
          } else if (number < 10) {
            precision = 6;
          } else if (number < 1000) {
            precision = 4;
          }
          return this.round(number, precision);
        } else {
          return number.toFixed(2);
        }
      }
    }
  }, {
    key: 'round',
    value: function round(amount) {
      var decimal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
      var direction = arguments[2];

      amount = parseFloat(amount);
      if (!direction) direction = 'round';
      decimal = Math.pow(10, decimal);
      return Math[direction](amount * decimal) / decimal;
    }
  }, {
    key: 'loop',
    value: function loop(arr, fn, busy, err) {
      var _this30 = this;

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
          return _this30.loop(arr, fn, ok, er, ++i);
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
      var _this31 = this;

      if (this.state[url]) return Promise.resolve(null);
      this.state[url] = 'pending';
      return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        document.body.appendChild(script);
        script.addEventListener('load', function () {
          if (_this31.state) _this31.state[url] = 'downloaded';
          resolve();
        });
        script.addEventListener('error', function () {
          if (_this31.state) delete _this31.state[url];
          reject(new Error('Failed to load image\'s URL: ' + url));
        });
        script.async = true;
        script.src = url;
      });
    }
  }, {
    key: 'fetchStyle',
    value: function fetchStyle(url) {
      var _this32 = this;

      if (this.state[url]) return Promise.resolve(null);
      this.state[url] = 'pending';
      return new Promise(function (resolve, reject) {
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        document.body.appendChild(link);
        link.setAttribute('href', url);
        link.addEventListener('load', function () {
          if (_this32.state) _this32.state[url] = 'downloaded';
          resolve();
        });
        link.addEventListener('error', function () {
          if (_this32.state) delete _this32.state[url];
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
    value: function fetchData(url, fromState) {
      var _this33 = this;

      var promise = Promise.resolve();
      promise = promise.then(function () {
        if (fromState) {
          if (_this33.state[url] === 'pending') {
            var promiseTimeout = new Promise(function (resolve, reject) {
              setTimeout(function () {
                resolve(_this33.fetchData(url, fromState));
              }, 100);
            });
            return promiseTimeout;
          }
          if (!!_this33.state[url]) {
            return Promise.resolve(_this33.state[url].clone());
          }
        }
        var promiseFetch = Promise.resolve();
        promiseFetch = promiseFetch.then(function () {
          _this33.state[url] = 'pending';
          return fetch(url);
        });
        promiseFetch = promiseFetch.then(function (response) {
          _this33.state[url] = response;
          return response.clone();
        });
        return promiseFetch;
      });
      return promise;
    }
  }]);

  return fetchClass;
}();

new widgetsController();
var cpBootstrap = new bootstrapClass();
var fetchService = new fetchClass();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7SUNBTSxpQjtBQUNKLCtCQUFjO0FBQUE7O0FBQ1osU0FBSyxPQUFMLEdBQWUsSUFBSSxZQUFKLEVBQWY7QUFDQSxTQUFLLElBQUw7QUFDRDs7OzsyQkFFSztBQUFBOztBQUNKLGFBQU8sS0FBSyxPQUFMLENBQWEsUUFBYixDQUFzQixVQUE3QixJQUEyQyxFQUEzQztBQUNBLGVBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDO0FBQUEsZUFBTSxNQUFLLFdBQUwsRUFBTjtBQUFBLE9BQTlDLEVBQXdFLEtBQXhFO0FBQ0EsYUFBTyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLFVBQXpDLEdBQXNELFlBQU07QUFDMUQsZUFBTyxNQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLElBQXpDLEdBQWdELEtBQWhEO0FBQ0EsY0FBSyxXQUFMO0FBQ0QsT0FIRDtBQUlEOzs7a0NBRVk7QUFBQTs7QUFDWCxVQUFJLENBQUMsT0FBTyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLElBQTlDLEVBQW1EO0FBQ2pELGVBQU8sS0FBSyxPQUFMLENBQWEsUUFBYixDQUFzQixVQUE3QixFQUF5QyxJQUF6QyxHQUFnRCxJQUFoRDtBQUNBLFlBQUksZUFBZSxNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsU0FBUyxzQkFBVCxDQUFnQyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFNBQXRELENBQTNCLENBQW5CO0FBQ0EsYUFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixZQUE1QjtBQUNBLGVBQU8sZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsWUFBTTtBQUN0QyxpQkFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixZQUE1QjtBQUNBLGVB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QkFBTyxNQUFNLEdBQU4sQ0FBUDtBQUNELFNBSGMsQ0FBZjtBQUlBLHVCQUFlLGFBQWEsSUFBYixDQUFrQixVQUFDLFFBQUQsRUFBYztBQUM3QyxrQkFBSyxLQUFMLENBQVcsR0FBWCxJQUFrQixRQUFsQjtBQUNBLGlCQUFPLFNBQVMsS0FBVCxFQUFQO0FBQ0QsU0FIYyxDQUFmO0FBSUEsZUFBTyxZQUFQO0FBQ0QsT0F4QlMsQ0FBVjtBQXlCQSxhQUFPLE9BQVA7QUFDRDs7Ozs7O0FBR0gsSUFBSSxpQkFBSjtBQUNBLElBQU0sY0FBYyxJQUFJLGNBQUosRUFBcEI7QUFDQSxJQUFNLGVBQWUsSUFBSSxVQUFKLEVBQXJCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY2xhc3Mgd2lkZ2V0c0NvbnRyb2xsZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLndpZGdldHMgPSBuZXcgd2lkZ2V0c0NsYXNzKCk7XG4gICAgdGhpcy5iaW5kKCk7XG4gIH1cbiAgXG4gIGJpbmQoKXtcbiAgICB3aW5kb3dbdGhpcy53aWRnZXRzLmRlZmF1bHRzLm9iamVjdE5hbWVdID0ge307XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHRoaXMuaW5pdFdpZGdldHMoKSwgZmFsc2UpO1xuICAgIHdpbmRvd1t0aGlzLndpZGdldHMuZGVmYXVsdHMub2JqZWN0TmFtZV0uYmluZFdpZGdldCA9ICgpID0+IHtcbiAgICAgIHdpbmRvd1t0aGlzLndpZGdldHMuZGVmYXVsdHMub2JqZWN0TmFtZV0uaW5pdCA9IGZhbHNlO1xuICAgICAgdGhpcy5pbml0V2lkZ2V0cygpO1xuICAgIH07XG4gIH1cbiAgXG4gIGluaXRXaWRnZXRzKCl7XG4gICAgaWYgKCF3aW5kb3dbdGhpcy53aWRnZXRzLmRlZmF1bHRzLm9iamVjdE5hbWVdLmluaXQpe1xuICAgICAgd2luZG93W3RoaXMud2lkZ2V0cy5kZWZhdWx0cy5vYmplY3ROYW1lXS5pbml0ID0gdHJ1ZTtcbiAgICAgIGxldCBtYWluRWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMud2lkZ2V0cy5kZWZhdWx0cy5jbGFzc05hbWUpKTtcbiAgICAgIHRoaXMud2lkZ2V0cy5zZXRXaWRnZXRDbGFzcyhtYWluRWxlbWVudHMpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgICAgdGhpcy53aWRnZXRzLnNldFdpZGdldENsYXNzKG1haW5FbGVtZW50cyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFpbkVsZW1lbnRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICB0aGlzLndpZGdldHMuc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKGkpO1xuICAgICAgICB9XG4gICAgICB9LCBmYWxzZSk7XG4gICAgICBsZXQgc2NyaXB0RWxlbWVudCA9IHRoaXMud2lkZ2V0cy5nZXRTY3JpcHRFbGVtZW50KCk7XG4gICAgICBpZiAoc2NyaXB0RWxlbWVudCAmJiBzY3JpcHRFbGVtZW50LmRhdGFzZXQgJiYgc2NyaXB0RWxlbWVudC5kYXRhc2V0LmNwQ3VycmVuY3lXaWRnZXQpe1xuICAgICAgICBsZXQgZGF0YXNldCA9IEpTT04ucGFyc2Uoc2NyaXB0RWxlbWVudC5kYXRhc2V0LmNwQ3VycmVuY3lXaWRnZXQpO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoZGF0YXNldCkpe1xuICAgICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMoZGF0YXNldCk7XG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBrZXlzLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICAgIGxldCBrZXkgPSBrZXlzW2pdLnJlcGxhY2UoJy0nLCAnXycpO1xuICAgICAgICAgICAgdGhpcy53aWRnZXRzLmRlZmF1bHRzW2tleV0gPSBkYXRhc2V0W2tleXNbal1dO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMud2lkZ2V0cy5zdGF0ZXMgPSBbXTtcbiAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AobWFpbkVsZW1lbnRzLCAoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgICBsZXQgbmV3U2V0dGluZ3MgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMud2lkZ2V0cy5kZWZhdWx0cykpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLmlzV29yZHByZXNzID0gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3dvcmRwcmVzcycpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLmlzTmlnaHRNb2RlID0gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NwLXdpZGdldF9fbmlnaHQtbW9kZScpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLm1haW5FbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgICB0aGlzLndpZGdldHMuc3RhdGVzLnB1c2gobmV3U2V0dGluZ3MpO1xuICAgICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBsZXQgY2hhcnRTY3JpcHRzID0gW1xuICAgICAgICAgICAgICAnaHR0cDovL2NvZGUuaGlnaGNoYXJ0cy5jb20vc3RvY2svaGlnaHN0b2NrLmpzJyxcbiAgICAgICAgICAgICAgJ2h0dHBzOi8vY29kZS5oaWdoY2hhcnRzLmNvbS9tb2R1bGVzL2V4cG9ydGluZy5qcycsXG4gICAgICAgICAgICAgICdodHRwczovL2NvZGUuaGlnaGNoYXJ0cy5jb20vbW9kdWxlcy9uby1kYXRhLXRvLWRpc3BsYXkuanMnLFxuICAgICAgICAgICAgICAnaHR0cHM6Ly9oaWdoY2hhcnRzLmdpdGh1Yi5pby9wYXR0ZXJuLWZpbGwvcGF0dGVybi1maWxsLXYyLmpzJyxcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICByZXR1cm4gKG5ld1NldHRpbmdzLm1vZHVsZXMuaW5kZXhPZignY2hhcnQnKSA+IC0xICYmICF3aW5kb3cuSGlnaGNoYXJ0cylcbiAgICAgICAgICAgICAgPyBjcEJvb3RzdHJhcC5sb29wKGNoYXJ0U2NyaXB0cywgbGluayA9PiB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmV0Y2hTZXJ2aWNlLmZldGNoU2NyaXB0KGxpbmspO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndpZGdldHMuaW5pdChpbmRleCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH0pO1xuICAgICAgfSwgNTApO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyB3aWRnZXRzQ2xhc3Mge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnN0YXRlcyA9IFtdO1xuICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICBvYmplY3ROYW1lOiAnY3BDdXJyZW5jeVdpZGdldHMnLFxuICAgICAgY2xhc3NOYW1lOiAnY29pbnBhcHJpa2EtY3VycmVuY3ktd2lkZ2V0JyxcbiAgICAgIGNzc0ZpbGVOYW1lOiAnd2lkZ2V0Lm1pbi5jc3MnLFxuICAgICAgY3VycmVuY3k6ICdidGMtYml0Y29pbicsXG4gICAgICBwcmltYXJ5X2N1cnJlbmN5OiAnVVNEJyxcbiAgICAgIHJhbmdlX2xpc3Q6IFsnMjRoJywgJzdkJywgJzMwZCcsICcxcScsICcxeScsICd5dGQnLCAnYWxsJ10sXG4gICAgICByYW5nZTogJzdkJyxcbiAgICAgIG1vZHVsZXM6IFsnbWFya2V0X2RldGFpbHMnLCAnY2hhcnQnXSxcbiAgICAgIHVwZGF0ZV9hY3RpdmU6IGZhbHNlLFxuICAgICAgdXBkYXRlX3RpbWVvdXQ6ICczMHMnLFxuICAgICAgbGFuZ3VhZ2U6ICdlbicsXG4gICAgICBzdHlsZV9zcmM6IG51bGwsXG4gICAgICBpbWdfc3JjOiBudWxsLFxuICAgICAgbGFuZ19zcmM6IG51bGwsXG4gICAgICBvcmlnaW5fc3JjOiAnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9AY29pbnBhcHJpa2Evd2lkZ2V0LWN1cnJlbmN5JyxcbiAgICAgIHNob3dfZGV0YWlsc19jdXJyZW5jeTogZmFsc2UsXG4gICAgICB0aWNrZXI6IHtcbiAgICAgICAgbmFtZTogdW5kZWZpbmVkLFxuICAgICAgICBzeW1ib2w6IHVuZGVmaW5lZCxcbiAgICAgICAgcHJpY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgcHJpY2VfY2hhbmdlXzI0aDogdW5kZWZpbmVkLFxuICAgICAgICByYW5rOiB1bmRlZmluZWQsXG4gICAgICAgIHByaWNlX2F0aDogdW5kZWZpbmVkLFxuICAgICAgICB2b2x1bWVfMjRoOiB1bmRlZmluZWQsXG4gICAgICAgIG1hcmtldF9jYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgcGVyY2VudF9mcm9tX3ByaWNlX2F0aDogdW5kZWZpbmVkLFxuICAgICAgICB2b2x1bWVfMjRoX2NoYW5nZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgICAgbWFya2V0X2NhcF9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgICAgaW50ZXJ2YWw6IG51bGwsXG4gICAgICBpc1dvcmRwcmVzczogZmFsc2UsXG4gICAgICBpc05pZ2h0TW9kZTogZmFsc2UsXG4gICAgICBpc0RhdGE6IGZhbHNlLFxuICAgICAgYXZhaWxhYmxlTW9kdWxlczogWydwcmljZScsICdjaGFydCcsICdtYXJrZXRfZGV0YWlscyddLFxuICAgICAgbWVzc2FnZTogJ2RhdGFfbG9hZGluZycsXG4gICAgICB0cmFuc2xhdGlvbnM6IHt9LFxuICAgICAgbWFpbkVsZW1lbnQ6IG51bGwsXG4gICAgICBub1RyYW5zbGF0aW9uTGFiZWxzOiBbXSxcbiAgICAgIHNjcmlwdHNEb3dubG9hZGVkOiB7fSxcbiAgICAgIGNoYXJ0OiBudWxsLFxuICAgICAgcndkOiB7XG4gICAgICAgIHhzOiAyODAsXG4gICAgICAgIHM6IDMyMCxcbiAgICAgICAgbTogMzcwLFxuICAgICAgICBsOiA0NjIsXG4gICAgICB9LFxuICAgIH07XG4gIH1cbiAgXG4gIGluaXQoaW5kZXgpIHtcbiAgICBpZiAoIXRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5lcnJvcignQmluZCBmYWlsZWQsIG5vIGVsZW1lbnQgd2l0aCBjbGFzcyA9IFwiJyArIHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lICsgJ1wiJyk7XG4gICAgfVxuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5nZXREZWZhdWx0cyhpbmRleCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRPcmlnaW5MaW5rKGluZGV4KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgc2V0V2lkZ2V0Q2xhc3MoZWxlbWVudHMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgd2lkdGggPSBlbGVtZW50c1tpXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICAgIGxldCByd2RLZXlzID0gT2JqZWN0LmtleXModGhpcy5kZWZhdWx0cy5yd2QpO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCByd2RLZXlzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGxldCByd2RLZXkgPSByd2RLZXlzW2pdO1xuICAgICAgICBsZXQgcndkUGFyYW0gPSB0aGlzLmRlZmF1bHRzLnJ3ZFtyd2RLZXldO1xuICAgICAgICBsZXQgY2xhc3NOYW1lID0gdGhpcy5kZWZhdWx0cy5jbGFzc05hbWUgKyAnX18nICsgcndkS2V5O1xuICAgICAgICBpZiAod2lkdGggPD0gcndkUGFyYW0pIGVsZW1lbnRzW2ldLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgICAgaWYgKHdpZHRoID4gcndkUGFyYW0pIGVsZW1lbnRzW2ldLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIGdldE1haW5FbGVtZW50KGluZGV4KSB7XG4gICAgcmV0dXJuICh0aGlzLnN0YXRlc1tpbmRleF0pID8gdGhpcy5zdGF0ZXNbaW5kZXhdLm1haW5FbGVtZW50IDogbnVsbDtcbiAgfVxuICBcbiAgZ2V0RGVmYXVsdHMoaW5kZXgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBsZXQgbWFpbkVsZW1lbnQgPSB0aGlzLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICAgIGlmIChtYWluRWxlbWVudCAmJiBtYWluRWxlbWVudC5kYXRhc2V0KSB7XG4gICAgICAgIGlmICghbWFpbkVsZW1lbnQuZGF0YXNldC5tb2R1bGVzICYmIG1haW5FbGVtZW50LmRhdGFzZXQudmVyc2lvbiA9PT0gJ2V4dGVuZGVkJykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbW9kdWxlcycsIFsnbWFya2V0X2RldGFpbHMnXSk7XG4gICAgICAgIGlmICghbWFpbkVsZW1lbnQuZGF0YXNldC5tb2R1bGVzICYmIG1haW5FbGVtZW50LmRhdGFzZXQudmVyc2lvbiA9PT0gJ3N0YW5kYXJkJykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbW9kdWxlcycsIFtdKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubW9kdWxlcykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbW9kdWxlcycsIEpTT04ucGFyc2UobWFpbkVsZW1lbnQuZGF0YXNldC5tb2R1bGVzKSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnByaW1hcnlDdXJyZW5jeSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAncHJpbWFyeV9jdXJyZW5jeScsIG1haW5FbGVtZW50LmRhdGFzZXQucHJpbWFyeUN1cnJlbmN5KTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuY3VycmVuY3kpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2N1cnJlbmN5JywgbWFpbkVsZW1lbnQuZGF0YXNldC5jdXJyZW5jeSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnJhbmdlKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdyYW5nZScsIG1haW5FbGVtZW50LmRhdGFzZXQucmFuZ2UpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5zaG93RGV0YWlsc0N1cnJlbmN5KSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdzaG93X2RldGFpbHNfY3VycmVuY3knLCAobWFpbkVsZW1lbnQuZGF0YXNldC5zaG93RGV0YWlsc0N1cnJlbmN5ID09PSAndHJ1ZScpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlQWN0aXZlKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICd1cGRhdGVfYWN0aXZlJywgKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlQWN0aXZlID09PSAndHJ1ZScpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlVGltZW91dCkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAndXBkYXRlX3RpbWVvdXQnLCBjcEJvb3RzdHJhcC5wYXJzZUludGVydmFsVmFsdWUobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVUaW1lb3V0KSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lmxhbmd1YWdlKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdsYW5ndWFnZScsIG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ3VhZ2UpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5vcmlnaW5TcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ29yaWdpbl9zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0Lm9yaWdpblNyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lm5vZGVNb2R1bGVzU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdub2RlX21vZHVsZXNfc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5ub2RlTW9kdWxlc1NyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmJvd2VyU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdib3dlcl9zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LmJvd2VyU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuc3R5bGVTcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3N0eWxlX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQuc3R5bGVTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5sYW5nU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdsb2dvX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ1NyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmltZ1NyYykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbG9nb19zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LmltZ1NyYyk7XG4gICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgIH0pO1xuICB9XG4gIFxuICBzZXRPcmlnaW5MaW5rKGluZGV4KSB7XG4gICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zKS5sZW5ndGggPT09IDApIHRoaXMuZ2V0VHJhbnNsYXRpb25zKHRoaXMuZGVmYXVsdHMubGFuZ3VhZ2UpO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zdHlsZXNoZWV0KCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hZGRXaWRnZXRFbGVtZW50KGluZGV4KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmluaXRJbnRlcnZhbChpbmRleCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGFkZFdpZGdldEVsZW1lbnQoaW5kZXgpIHtcbiAgICBsZXQgbWFpbkVsZW1lbnQgPSB0aGlzLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICBsZXQgbW9kdWxlcyA9ICcnO1xuICAgIGxldCBtb2R1bGVzQXJyYXkgPSBbXTtcbiAgICBsZXQgY2hhcnRDb250YWluZXIgPSBudWxsO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcCh0aGlzLmRlZmF1bHRzLmF2YWlsYWJsZU1vZHVsZXMsIG1vZHVsZSA9PiB7XG4gICAgICAgIHJldHVybiAodGhpcy5zdGF0ZXNbaW5kZXhdLm1vZHVsZXMuaW5kZXhPZihtb2R1bGUpID4gLTEpID8gbW9kdWxlc0FycmF5LnB1c2gobW9kdWxlKSA6IG51bGw7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKG1vZHVsZXNBcnJheSwgbW9kdWxlID0+IHtcbiAgICAgICAgbGV0IGxhYmVsID0gbnVsbDtcbiAgICAgICAgaWYgKG1vZHVsZSA9PT0gJ2NoYXJ0JykgbGFiZWwgPSAnQ2hhcnQnO1xuICAgICAgICBpZiAobW9kdWxlID09PSAnbWFya2V0X2RldGFpbHMnKSBsYWJlbCA9ICdNYXJrZXREZXRhaWxzJztcbiAgICAgICAgcmV0dXJuIChsYWJlbCkgPyB0aGlzW2B3aWRnZXQkeyBsYWJlbCB9RWxlbWVudGBdKGluZGV4KS50aGVuKHJlc3VsdCA9PiBtb2R1bGVzICs9IHJlc3VsdCkgOiBudWxsO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gbWFpbkVsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy53aWRnZXRNYWluRWxlbWVudChpbmRleCkgKyBtb2R1bGVzICsgdGhpcy53aWRnZXRGb290ZXIoaW5kZXgpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgY2hhcnRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgJHsgdGhpcy5kZWZhdWx0cy5jbGFzc05hbWUgfS1wcmljZS1jaGFydC0keyBpbmRleCB9YCk7XG4gICAgICByZXR1cm4gKGNoYXJ0Q29udGFpbmVyKSA/IGNoYXJ0Q29udGFpbmVyLnBhcmVudEVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCB0aGlzLndpZGdldFNlbGVjdEVsZW1lbnQoaW5kZXgsICdyYW5nZScpKSA6IG51bGw7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBpZiAoY2hhcnRDb250YWluZXIpe1xuICAgICAgICB0aGlzLnN0YXRlc1tpbmRleF0uY2hhcnQgPSBuZXcgY2hhcnRDbGFzcyhjaGFydENvbnRhaW5lciwgdGhpcy5zdGF0ZXNbaW5kZXhdKTtcbiAgICAgICAgdGhpcy5zZXRTZWxlY3RMaXN0ZW5lcnMoaW5kZXgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG4gICAgXG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRCZWZvcmVFbGVtZW50SW5Gb290ZXIoaW5kZXgpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RGF0YShpbmRleCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHNldFNlbGVjdExpc3RlbmVycyhpbmRleCl7XG4gICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgbGV0IHNlbGVjdEVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNwLXdpZGdldC1zZWxlY3QnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdEVsZW1lbnRzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGxldCBidXR0b25zID0gc2VsZWN0RWxlbWVudHNbaV0ucXVlcnlTZWxlY3RvckFsbCgnLmNwLXdpZGdldC1zZWxlY3RfX29wdGlvbnMgYnV0dG9uJyk7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJ1dHRvbnMubGVuZ3RoOyBqKyspe1xuICAgICAgICBidXR0b25zW2pdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRTZWxlY3RPcHRpb24oZXZlbnQsIGluZGV4KTtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgc2V0U2VsZWN0T3B0aW9uKGV2ZW50LCBpbmRleCl7XG4gICAgbGV0IGNsYXNzTmFtZSA9ICdjcC13aWRnZXQtYWN0aXZlJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspe1xuICAgICAgbGV0IHNpYmxpbmcgPSBldmVudC50YXJnZXQucGFyZW50Tm9kZS5jaGlsZE5vZGVzW2ldO1xuICAgICAgaWYgKHNpYmxpbmcuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpIHNpYmxpbmcuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgIH1cbiAgICBsZXQgcGFyZW50ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5jcC13aWRnZXQtc2VsZWN0Jyk7XG4gICAgbGV0IHR5cGUgPSBwYXJlbnQuZGF0YXNldC50eXBlO1xuICAgIGxldCBwaWNrZWRWYWx1ZUVsZW1lbnQgPSBwYXJlbnQucXVlcnlTZWxlY3RvcignLmNwLXdpZGdldC1zZWxlY3RfX29wdGlvbnMgPiBzcGFuJyk7XG4gICAgbGV0IHZhbHVlID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQub3B0aW9uO1xuICAgIHBpY2tlZFZhbHVlRWxlbWVudC5pbm5lclRleHQgPSB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCB2YWx1ZS50b0xvd2VyQ2FzZSgpKTtcbiAgICB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsIHR5cGUsIHZhbHVlKTtcbiAgICBldmVudC50YXJnZXQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgIHRoaXMuZGlzcGF0Y2hFdmVudChpbmRleCwgJy1zd2l0Y2gtcmFuZ2UnLCB2YWx1ZSk7XG4gIH1cbiAgXG4gIGRpc3BhdGNoRXZlbnQoaW5kZXgsIG5hbWUsIGRhdGEpe1xuICAgIGxldCBpZCA9IGAkeyB0aGlzLmRlZmF1bHRzLmNsYXNzTmFtZSB9LXByaWNlLWNoYXJ0LSR7IGluZGV4IH1gO1xuICAgIHJldHVybiBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChgJHtpZH0ke25hbWV9YCwgeyBkZXRhaWw6IHsgZGF0YSB9IH0pKTtcbiAgfVxuICBcbiAgZ2V0RGF0YShpbmRleCkge1xuICAgIGNvbnN0IHVybCA9ICdodHRwczovL2FwaS5jb2lucGFwcmlrYS5jb20vdjEvd2lkZ2V0LycgKyB0aGlzLnN0YXRlc1tpbmRleF0uY3VycmVuY3kgKyAnP3F1b3RlPScgKyB0aGlzLnN0YXRlc1tpbmRleF0ucHJpbWFyeV9jdXJyZW5jeTtcbiAgICByZXR1cm4gZmV0Y2hTZXJ2aWNlLmZldGNoRGF0YSh1cmwpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlc1tpbmRleF0uaXNEYXRhKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdpc0RhdGEnLCB0cnVlKTtcbiAgICAgICAgdGhpcy51cGRhdGVUaWNrZXIoaW5kZXgsIHJlc3VsdCk7XG4gICAgICB9KVxuICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgIHJldHVybiB0aGlzLm9uRXJyb3JSZXF1ZXN0KGluZGV4LCBlcnJvcik7XG4gICAgfSk7XG4gIH1cbiAgXG4gIG9uRXJyb3JSZXF1ZXN0KGluZGV4LCB4aHIpIHtcbiAgICBpZiAodGhpcy5zdGF0ZXNbaW5kZXhdLmlzRGF0YSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnaXNEYXRhJywgZmFsc2UpO1xuICAgIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ21lc3NhZ2UnLCAnZGF0YV91bmF2YWlsYWJsZScpO1xuICAgIGNvbnNvbGUuZXJyb3IoJ1JlcXVlc3QgZmFpbGVkLiAgUmV0dXJuZWQgc3RhdHVzIG9mICcgKyB4aHIsIHRoaXMuc3RhdGVzW2luZGV4XSk7XG4gIH1cbiAgXG4gIGluaXRJbnRlcnZhbChpbmRleCkge1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5zdGF0ZXNbaW5kZXhdLmludGVydmFsKTtcbiAgICBpZiAodGhpcy5zdGF0ZXNbaW5kZXhdLnVwZGF0ZV9hY3RpdmUgJiYgdGhpcy5zdGF0ZXNbaW5kZXhdLnVwZGF0ZV90aW1lb3V0ID4gMTAwMCkge1xuICAgICAgdGhpcy5zdGF0ZXNbaW5kZXhdLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICB0aGlzLmdldERhdGEoaW5kZXgpO1xuICAgICAgfSwgdGhpcy5zdGF0ZXNbaW5kZXhdLnVwZGF0ZV90aW1lb3V0KTtcbiAgICB9XG4gIH1cbiAgXG4gIHNldEJlZm9yZUVsZW1lbnRJbkZvb3RlcihpbmRleCkge1xuICAgIGlmICghdGhpcy5zdGF0ZXNbaW5kZXhdLmlzV29yZHByZXNzKSB7XG4gICAgICBsZXQgbWFpbkVsZW1lbnQgPSB0aGlzLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICAgIGlmIChtYWluRWxlbWVudCkge1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuY2hpbGRyZW5bMF0ubG9jYWxOYW1lID09PSAnc3R5bGUnKSB7XG4gICAgICAgICAgbWFpbkVsZW1lbnQucmVtb3ZlQ2hpbGQobWFpbkVsZW1lbnQuY2hpbGROb2Rlc1swXSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGZvb3RlckVsZW1lbnQgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuY3Atd2lkZ2V0X19mb290ZXInKTtcbiAgICAgICAgbGV0IHZhbHVlID0gZm9vdGVyRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAtIDQzO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvb3RlckVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhbHVlIC09IGZvb3RlckVsZW1lbnQuY2hpbGROb2Rlc1tpXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSAnLmNwLXdpZGdldF9fZm9vdGVyLS0nICsgaW5kZXggKyAnOjpiZWZvcmV7d2lkdGg6JyArIHZhbHVlLnRvRml4ZWQoMCkgKyAncHg7fSc7XG4gICAgICAgIG1haW5FbGVtZW50Lmluc2VydEJlZm9yZShzdHlsZSwgbWFpbkVsZW1lbnQuY2hpbGRyZW5bMF0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgdXBkYXRlV2lkZ2V0RWxlbWVudChpbmRleCwga2V5LCB2YWx1ZSwgdGlja2VyKSB7XG4gICAgbGV0IHN0YXRlID0gdGhpcy5zdGF0ZXNbaW5kZXhdO1xuICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgIGlmIChtYWluRWxlbWVudCkge1xuICAgICAgbGV0IHRpY2tlckNsYXNzID0gKHRpY2tlcikgPyAnVGlja2VyJyA6ICcnO1xuICAgICAgaWYgKGtleSA9PT0gJ25hbWUnIHx8IGtleSA9PT0gJ2N1cnJlbmN5Jykge1xuICAgICAgICBpZiAoa2V5ID09PSAnY3VycmVuY3knKSB7XG4gICAgICAgICAgbGV0IGFFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXRfX2Zvb3RlciA+IGEnKTtcbiAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGFFbGVtZW50cy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgYUVsZW1lbnRzW2tdLmhyZWYgPSB0aGlzLmNvaW5fbGluayh2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2V0SW1hZ2UoaW5kZXgpO1xuICAgICAgfVxuICAgICAgaWYgKGtleSA9PT0gJ2lzRGF0YScgfHwga2V5ID09PSAnbWVzc2FnZScpIHtcbiAgICAgICAgbGV0IGhlYWRlckVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNwLXdpZGdldF9fbWFpbicpO1xuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGhlYWRlckVsZW1lbnRzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgaGVhZGVyRWxlbWVudHNba10uaW5uZXJIVE1MID0gKCFzdGF0ZS5pc0RhdGEpID8gdGhpcy53aWRnZXRNYWluRWxlbWVudE1lc3NhZ2UoaW5kZXgpIDogdGhpcy53aWRnZXRNYWluRWxlbWVudERhdGEoaW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgdXBkYXRlRWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIGtleSArIHRpY2tlckNsYXNzKTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB1cGRhdGVFbGVtZW50cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGxldCB1cGRhdGVFbGVtZW50ID0gdXBkYXRlRWxlbWVudHNbal07XG4gICAgICAgICAgaWYgKHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjcC13aWRnZXRfX3JhbmsnKSkge1xuICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9IChwYXJzZUZsb2F0KHZhbHVlKSA+IDApID8gXCJjcC13aWRnZXRfX3JhbmstdXBcIiA6ICgocGFyc2VGbG9hdCh2YWx1ZSkgPCAwKSA/IFwiY3Atd2lkZ2V0X19yYW5rLWRvd25cIiA6IFwiY3Atd2lkZ2V0X19yYW5rLW5ldXRyYWxcIik7XG4gICAgICAgICAgICB1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9fcmFuay1kb3duJyk7XG4gICAgICAgICAgICB1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9fcmFuay11cCcpO1xuICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX3JhbmstbmV1dHJhbCcpO1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSBjcEJvb3RzdHJhcC5lbXB0eURhdGE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgdmFsdWUgPSAoa2V5ID09PSAncHJpY2VfY2hhbmdlXzI0aCcpID8gJygnICsgY3BCb290c3RyYXAucm91bmQodmFsdWUsIDIpICsgJyUpJyA6IGNwQm9vdHN0cmFwLnJvdW5kKHZhbHVlLCAyKSArICclJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93RGV0YWlsc0N1cnJlbmN5JykgJiYgIXN0YXRlLnNob3dfZGV0YWlsc19jdXJyZW5jeSkge1xuICAgICAgICAgICAgdmFsdWUgPSAnICc7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncGFyc2VOdW1iZXInKSkge1xuICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5pbm5lclRleHQgPSBjcEJvb3RzdHJhcC5wYXJzZU51bWJlcih2YWx1ZSkgfHwgY3BCb290c3RyYXAuZW1wdHlEYXRhO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1cGRhdGVFbGVtZW50LmlubmVyVGV4dCA9IHZhbHVlIHx8IGNwQm9vdHN0cmFwLmVtcHR5RGF0YTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHVwZGF0ZURhdGEoaW5kZXgsIGtleSwgdmFsdWUsIHRpY2tlcikge1xuICAgIGlmICh0aWNrZXIpIHtcbiAgICAgIHRoaXMuc3RhdGVzW2luZGV4XS50aWNrZXJba2V5XSA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlc1tpbmRleF1ba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgICBpZiAoa2V5ID09PSAnbGFuZ3VhZ2UnKSB7XG4gICAgICB0aGlzLmdldFRyYW5zbGF0aW9ucyh2YWx1ZSk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlV2lkZ2V0RWxlbWVudChpbmRleCwga2V5LCB2YWx1ZSwgdGlja2VyKTtcbiAgfVxuICBcbiAgdXBkYXRlV2lkZ2V0VHJhbnNsYXRpb25zKGxhbmcsIGRhdGEpIHtcbiAgICB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXSA9IGRhdGE7XG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLnN0YXRlcy5sZW5ndGg7IHgrKykge1xuICAgICAgbGV0IGlzTm9UcmFuc2xhdGlvbkxhYmVsc1VwZGF0ZSA9IHRoaXMuc3RhdGVzW3hdLm5vVHJhbnNsYXRpb25MYWJlbHMubGVuZ3RoID4gMCAmJiBsYW5nID09PSAnZW4nO1xuICAgICAgaWYgKHRoaXMuc3RhdGVzW3hdLmxhbmd1YWdlID09PSBsYW5nIHx8IGlzTm9UcmFuc2xhdGlvbkxhYmVsc1VwZGF0ZSkge1xuICAgICAgICBsZXQgbWFpbkVsZW1lbnQgPSB0aGlzLnN0YXRlc1t4XS5tYWluRWxlbWVudDtcbiAgICAgICAgbGV0IHRyYW5zYWx0ZUVsZW1lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNwLXRyYW5zbGF0aW9uJykpO1xuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRyYW5zYWx0ZUVsZW1lbnRzLmxlbmd0aDsgeSsrKSB7XG4gICAgICAgICAgdHJhbnNhbHRlRWxlbWVudHNbeV0uY2xhc3NMaXN0LmZvckVhY2goKGNsYXNzTmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGNsYXNzTmFtZS5zZWFyY2goJ3RyYW5zbGF0aW9uXycpID4gLTEpIHtcbiAgICAgICAgICAgICAgbGV0IHRyYW5zbGF0ZUtleSA9IGNsYXNzTmFtZS5yZXBsYWNlKCd0cmFuc2xhdGlvbl8nLCAnJyk7XG4gICAgICAgICAgICAgIGlmICh0cmFuc2xhdGVLZXkgPT09ICdtZXNzYWdlJykgdHJhbnNsYXRlS2V5ID0gdGhpcy5zdGF0ZXNbeF0ubWVzc2FnZTtcbiAgICAgICAgICAgICAgbGV0IGxhYmVsSW5kZXggPSB0aGlzLnN0YXRlc1t4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLmluZGV4T2YodHJhbnNsYXRlS2V5KTtcbiAgICAgICAgICAgICAgbGV0IHRleHQgPSB0aGlzLmdldFRyYW5zbGF0aW9uKHgsIHRyYW5zbGF0ZUtleSk7XG4gICAgICAgICAgICAgIGlmIChsYWJlbEluZGV4ID4gLTEgJiYgdGV4dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzW3hdLm5vVHJhbnNsYXRpb25MYWJlbHMuc3BsaWNlKGxhYmVsSW5kZXgsIDEpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdHJhbnNhbHRlRWxlbWVudHNbeV0uaW5uZXJUZXh0ID0gdGV4dDtcbiAgICAgICAgICAgICAgaWYgKHRyYW5zYWx0ZUVsZW1lbnRzW3ldLmNsb3Nlc3QoJy5jcC13aWRnZXRfX2Zvb3RlcicpKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnNldEJlZm9yZUVsZW1lbnRJbkZvb3Rlcih4KSwgNTApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgdXBkYXRlVGlja2VyKGluZGV4LCBkYXRhKSB7XG4gICAgbGV0IGRhdGFLZXlzID0gT2JqZWN0LmtleXMoZGF0YSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhS2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy51cGRhdGVEYXRhKGluZGV4LCBkYXRhS2V5c1tpXSwgZGF0YVtkYXRhS2V5c1tpXV0sIHRydWUpO1xuICAgIH1cbiAgfVxuICBcbiAgc3R5bGVzaGVldCgpIHtcbiAgICBpZiAodGhpcy5kZWZhdWx0cy5zdHlsZV9zcmMgIT09IGZhbHNlKSB7XG4gICAgICBsZXQgdXJsID0gdGhpcy5kZWZhdWx0cy5zdHlsZV9zcmMgfHwgdGhpcy5kZWZhdWx0cy5vcmlnaW5fc3JjICsgJy9kaXN0LycgKyB0aGlzLmRlZmF1bHRzLmNzc0ZpbGVOYW1lO1xuICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJ2xpbmtbaHJlZj1cIicgKyB1cmwgKyAnXCJdJykpe1xuICAgICAgICByZXR1cm4gZmV0Y2hTZXJ2aWNlLmZldGNoU3R5bGUodXJsKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG4gIFxuICB3aWRnZXRNYWluRWxlbWVudChpbmRleCkge1xuICAgIGxldCBkYXRhID0gdGhpcy5zdGF0ZXNbaW5kZXhdO1xuICAgIHJldHVybiAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9faGVhZGVyXCI+JyArXG4gICAgICAnPGRpdiBjbGFzcz1cIicgKyAnY3Atd2lkZ2V0X19pbWcgY3Atd2lkZ2V0X19pbWctJyArIGRhdGEuY3VycmVuY3kgKyAnXCI+JyArXG4gICAgICAnPGltZy8+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9fbWFpblwiPicgK1xuICAgICAgKChkYXRhLmlzRGF0YSkgPyB0aGlzLndpZGdldE1haW5FbGVtZW50RGF0YShpbmRleCkgOiB0aGlzLndpZGdldE1haW5FbGVtZW50TWVzc2FnZShpbmRleCkpICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nO1xuICB9XG4gIFxuICB3aWRnZXRNYWluRWxlbWVudERhdGEoaW5kZXgpIHtcbiAgICBsZXQgZGF0YSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcbiAgICByZXR1cm4gJzxoMz48YSBocmVmPVwiJyArIHRoaXMuY29pbl9saW5rKGRhdGEuY3VycmVuY3kpICsgJ1wiPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwibmFtZVRpY2tlclwiPicgKyAoZGF0YS50aWNrZXIubmFtZSB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGEpICsgJzwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlclwiPicgKyAoZGF0YS50aWNrZXIuc3ltYm9sIHx8IGNwQm9vdHN0cmFwLmVtcHR5RGF0YSkgKyAnPC9zcGFuPicgK1xuICAgICAgJzwvYT48L2gzPicgK1xuICAgICAgJzxzdHJvbmc+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJwcmljZVRpY2tlciBwYXJzZU51bWJlclwiPicgKyAoY3BCb290c3RyYXAucGFyc2VOdW1iZXIoZGF0YS50aWNrZXIucHJpY2UpIHx8IGNwQm9vdHN0cmFwLmVtcHR5RGF0YSkgKyAnPC9zcGFuPiAnICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInByaW1hcnlDdXJyZW5jeVwiPicgKyBkYXRhLnByaW1hcnlfY3VycmVuY3kgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInByaWNlX2NoYW5nZV8yNGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rIGNwLXdpZGdldF9fcmFuay0nICsgKChkYXRhLnRpY2tlci5wcmljZV9jaGFuZ2VfMjRoID4gMCkgPyBcInVwXCIgOiAoKGRhdGEudGlja2VyLnByaWNlX2NoYW5nZV8yNGggPCAwKSA/IFwiZG93blwiIDogXCJuZXV0cmFsXCIpKSArICdcIj4oJyArIChjcEJvb3RzdHJhcC5yb3VuZChkYXRhLnRpY2tlci5wcmljZV9jaGFuZ2VfMjRoLCAyKSB8fCBjcEJvb3RzdHJhcC5lbXB0eVZhbHVlKSArICclKTwvc3Bhbj4nICtcbiAgICAgICc8L3N0cm9uZz4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldF9fcmFuay1sYWJlbFwiPjxzcGFuIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fcmFua1wiPicgKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInJhbmtcIikgKyAnPC9zcGFuPiA8c3BhbiBjbGFzcz1cInJhbmtUaWNrZXJcIj4nICsgKGRhdGEudGlja2VyLnJhbmsgfHwgY3BCb290c3RyYXAuZW1wdHlEYXRhKSArICc8L3NwYW4+PC9zcGFuPic7XG4gIH1cbiAgXG4gIHdpZGdldE1haW5FbGVtZW50TWVzc2FnZShpbmRleCkge1xuICAgIGxldCBtZXNzYWdlID0gdGhpcy5zdGF0ZXNbaW5kZXhdLm1lc3NhZ2U7XG4gICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19tYWluLW5vLWRhdGEgY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fbWVzc2FnZVwiPicgKyAodGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgbWVzc2FnZSkpICsgJzwvZGl2Pic7XG4gIH1cbiAgXG4gIHdpZGdldE1hcmtldERldGFpbHNFbGVtZW50KGluZGV4KSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgodGhpcy5zdGF0ZXNbaW5kZXhdLm1vZHVsZXMuaW5kZXhPZignbWFya2V0X2RldGFpbHMnKSA+IC0xKSA/ICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19kZXRhaWxzXCI+JyArXG4gICAgICB0aGlzLndpZGdldEF0aEVsZW1lbnQoaW5kZXgpICtcbiAgICAgIHRoaXMud2lkZ2V0Vm9sdW1lMjRoRWxlbWVudChpbmRleCkgK1xuICAgICAgdGhpcy53aWRnZXRNYXJrZXRDYXBFbGVtZW50KGluZGV4KSArXG4gICAgICAnPC9kaXY+JyA6ICcnKTtcbiAgfVxuICBcbiAgd2lkZ2V0QXRoRWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiAnPGRpdj4nICtcbiAgICAgICc8c21hbGwgY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9hdGhcIj4nICsgdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJhdGhcIikgKyAnPC9zbWFsbD4nICtcbiAgICAgICc8ZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwicHJpY2VfYXRoVGlja2VyIHBhcnNlTnVtYmVyXCI+JyArIGNwQm9vdHN0cmFwLmVtcHR5RGF0YSArICcgPC9zcGFuPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwic3ltYm9sVGlja2VyIHNob3dEZXRhaWxzQ3VycmVuY3lcIj48L3NwYW4+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJwZXJjZW50X2Zyb21fcHJpY2VfYXRoVGlja2VyIGNwLXdpZGdldF9fcmFua1wiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnPC9zcGFuPicgK1xuICAgICAgJzwvZGl2PidcbiAgfVxuICBcbiAgd2lkZ2V0Vm9sdW1lMjRoRWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiAnPGRpdj4nICtcbiAgICAgICc8c21hbGwgY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl92b2x1bWVfMjRoXCI+JyArIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwidm9sdW1lXzI0aFwiKSArICc8L3NtYWxsPicgK1xuICAgICAgJzxkaXY+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJ2b2x1bWVfMjRoVGlja2VyIHBhcnNlTnVtYmVyXCI+JyArIGNwQm9vdHN0cmFwLmVtcHR5RGF0YSArICcgPC9zcGFuPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwic3ltYm9sVGlja2VyIHNob3dEZXRhaWxzQ3VycmVuY3lcIj48L3NwYW4+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJ2b2x1bWVfMjRoX2NoYW5nZV8yNGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rXCI+JyArIGNwQm9vdHN0cmFwLmVtcHR5RGF0YSArICc8L3NwYW4+JyArXG4gICAgICAnPC9kaXY+JztcbiAgfVxuICBcbiAgd2lkZ2V0TWFya2V0Q2FwRWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiAnPGRpdj4nICtcbiAgICAgICc8c21hbGwgY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9tYXJrZXRfY2FwXCI+JyArIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwibWFya2V0X2NhcFwiKSArICc8L3NtYWxsPicgK1xuICAgICAgJzxkaXY+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJtYXJrZXRfY2FwVGlja2VyIHBhcnNlTnVtYmVyXCI+JyArIGNwQm9vdHN0cmFwLmVtcHR5RGF0YSArICcgPC9zcGFuPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwic3ltYm9sVGlja2VyIHNob3dEZXRhaWxzQ3VycmVuY3lcIj48L3NwYW4+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJtYXJrZXRfY2FwX2NoYW5nZV8yNGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rXCI+JyArIGNwQm9vdHN0cmFwLmVtcHR5RGF0YSArICc8L3NwYW4+JyArXG4gICAgICAnPC9kaXY+JztcbiAgfVxuICBcbiAgd2lkZ2V0Q2hhcnRFbGVtZW50KGluZGV4KSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShcbiAgICAgIGA8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19jaGFydFwiPjxkaXYgaWQ9XCIkeyB0aGlzLmRlZmF1bHRzLmNsYXNzTmFtZSB9LXByaWNlLWNoYXJ0LSR7IGluZGV4IH1cIj48L2Rpdj48L2Rpdj5gXG4gICAgKTtcbiAgfVxuICBcbiAgd2lkZ2V0U2VsZWN0RWxlbWVudChpbmRleCwgbGFiZWwpe1xuICAgIGxldCBidXR0b25zID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnN0YXRlc1tpbmRleF1bbGFiZWwrJ19saXN0J10ubGVuZ3RoOyBpKyspe1xuICAgICAgbGV0IGRhdGEgPSB0aGlzLnN0YXRlc1tpbmRleF1bbGFiZWwrJ19saXN0J11baV07XG4gICAgICBidXR0b25zICs9ICc8YnV0dG9uIGNsYXNzPVwiJysgKChkYXRhLnRvTG93ZXJDYXNlKCkgPT09IHRoaXMuc3RhdGVzW2luZGV4XVtsYWJlbF0udG9Mb3dlckNhc2UoKSlcbiAgICAgICAgPyAnY3Atd2lkZ2V0LWFjdGl2ZSAnXG4gICAgICAgIDogJycpICsgKChsYWJlbCA9PT0gJ3ByaW1hcnlfY3VycmVuY3knKSA/ICcnIDogJ2NwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uXycgKyBkYXRhLnRvTG93ZXJDYXNlKCkpICsnXCIgZGF0YS1vcHRpb249XCInK2RhdGErJ1wiPicrdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgZGF0YS50b0xvd2VyQ2FzZSgpKSsnPC9idXR0b24+J1xuICAgIH1cbiAgICBpZiAobGFiZWwgPT09ICdyYW5nZScpIDtcbiAgICBsZXQgdGl0bGUgPSB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInpvb21faW5cIik7XG4gICAgcmV0dXJuICc8ZGl2IGRhdGEtdHlwZT1cIicrbGFiZWwrJ1wiIGNsYXNzPVwiY3Atd2lkZ2V0LXNlbGVjdFwiPicgK1xuICAgICAgJzxsYWJlbCBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uXycrIGxhYmVsICsnXCI+Jyt0aXRsZSsnPC9sYWJlbD4nICtcbiAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0LXNlbGVjdF9fb3B0aW9uc1wiPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwiYXJyb3ctZG93biAnKyAnY3Atd2lkZ2V0X19jYXBpdGFsaXplIGNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uXycgKyB0aGlzLnN0YXRlc1tpbmRleF1bbGFiZWxdLnRvTG93ZXJDYXNlKCkgKydcIj4nKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCB0aGlzLnN0YXRlc1tpbmRleF1bbGFiZWxdLnRvTG93ZXJDYXNlKCkpICsnPC9zcGFuPicgK1xuICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtc2VsZWN0X19kcm9wZG93blwiPicgK1xuICAgICAgYnV0dG9ucyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+JztcbiAgfVxuICBcbiAgd2lkZ2V0Rm9vdGVyKGluZGV4KSB7XG4gICAgbGV0IGN1cnJlbmN5ID0gdGhpcy5zdGF0ZXNbaW5kZXhdLmN1cnJlbmN5O1xuICAgIHJldHVybiAoIXRoaXMuc3RhdGVzW2luZGV4XS5pc1dvcmRwcmVzcylcbiAgICAgID8gJzxwIGNsYXNzPVwiY3Atd2lkZ2V0X19mb290ZXIgY3Atd2lkZ2V0X19mb290ZXItLScgKyBpbmRleCArICdcIj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX3Bvd2VyZWRfYnlcIj4nICsgdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJwb3dlcmVkX2J5XCIpICsgJyA8L3NwYW4+JyArXG4gICAgICAnPGltZyBzdHlsZT1cIndpZHRoOiAxNnB4XCIgc3JjPVwiJyArIHRoaXMubWFpbl9sb2dvX2xpbmsoKSArICdcIiBhbHQ9XCJcIi8+JyArXG4gICAgICAnPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIicgKyB0aGlzLmNvaW5fbGluayhjdXJyZW5jeSkgKyAnXCI+Y29pbnBhcHJpa2EuY29tPC9hPicgK1xuICAgICAgJzwvcD4nXG4gICAgICA6ICcnO1xuICB9XG4gIFxuICBnZXRJbWFnZShpbmRleCkge1xuICAgIGxldCBkYXRhID0gdGhpcy5zdGF0ZXNbaW5kZXhdO1xuICAgIGxldCBpbWdDb250YWluZXJzID0gZGF0YS5tYWluRWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjcC13aWRnZXRfX2ltZycpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW1nQ29udGFpbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGltZ0NvbnRhaW5lciA9IGltZ0NvbnRhaW5lcnNbaV07XG4gICAgICBpbWdDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY3Atd2lkZ2V0X19pbWctLWhpZGRlbicpO1xuICAgICAgbGV0IGltZyA9IGltZ0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdpbWcnKTtcbiAgICAgIGxldCBuZXdJbWcgPSBuZXcgSW1hZ2U7XG4gICAgICBuZXdJbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICBpbWcuc3JjID0gbmV3SW1nLnNyYztcbiAgICAgICAgaW1nQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9faW1nLS1oaWRkZW4nKTtcbiAgICAgIH07XG4gICAgICBuZXdJbWcuc3JjID0gdGhpcy5pbWdfc3JjKGRhdGEuY3VycmVuY3kpO1xuICAgIH1cbiAgfVxuICBcbiAgaW1nX3NyYyhpZCkge1xuICAgIHJldHVybiAnaHR0cHM6Ly9jb2lucGFwcmlrYS5jb20vY29pbi8nICsgaWQgKyAnL2xvZ28ucG5nJztcbiAgfVxuICBcbiAgY29pbl9saW5rKGlkKSB7XG4gICAgcmV0dXJuICdodHRwczovL2NvaW5wYXByaWthLmNvbS9jb2luLycgKyBpZFxuICB9XG4gIFxuICBtYWluX2xvZ29fbGluaygpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0cy5pbWdfc3JjIHx8IHRoaXMuZGVmYXVsdHMub3JpZ2luX3NyYyArICcvZGlzdC9pbWcvbG9nb193aWRnZXQuc3ZnJ1xuICB9XG4gIFxuICBnZXRTY3JpcHRFbGVtZW50KCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzY3JpcHRbZGF0YS1jcC1jdXJyZW5jeS13aWRnZXRdJyk7XG4gIH1cbiAgXG4gIGdldFRyYW5zbGF0aW9uKGluZGV4LCBsYWJlbCkge1xuICAgIGxldCB0ZXh0ID0gKHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW3RoaXMuc3RhdGVzW2luZGV4XS5sYW5ndWFnZV0pID8gdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbdGhpcy5zdGF0ZXNbaW5kZXhdLmxhbmd1YWdlXVtsYWJlbF0gOiBudWxsO1xuICAgIGlmICghdGV4dCAmJiB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1snZW4nXSkge1xuICAgICAgdGV4dCA9IHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zWydlbiddW2xhYmVsXTtcbiAgICB9XG4gICAgaWYgKCF0ZXh0KSB7XG4gICAgICByZXR1cm4gdGhpcy5hZGRMYWJlbFdpdGhvdXRUcmFuc2xhdGlvbihpbmRleCwgbGFiZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH1cbiAgXG4gIGFkZExhYmVsV2l0aG91dFRyYW5zbGF0aW9uKGluZGV4LCBsYWJlbCkge1xuICAgIGlmICghdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbJ2VuJ10pIHRoaXMuZ2V0VHJhbnNsYXRpb25zKCdlbicpO1xuICAgIHJldHVybiB0aGlzLnN0YXRlc1tpbmRleF0ubm9UcmFuc2xhdGlvbkxhYmVscy5wdXNoKGxhYmVsKTtcbiAgfVxuICBcbiAgZ2V0VHJhbnNsYXRpb25zKGxhbmcpIHtcbiAgICBpZiAoIXRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddKSB7XG4gICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICBsZXQgdXJsID0gdGhpcy5kZWZhdWx0cy5sYW5nX3NyYyB8fCB0aGlzLmRlZmF1bHRzLm9yaWdpbl9zcmMgKyAnL2Rpc3QvbGFuZyc7XG4gICAgICB4aHIub3BlbignR0VUJywgdXJsICsgJy8nICsgbGFuZyArICcuanNvbicpO1xuICAgICAgeGhyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIHRoaXMudXBkYXRlV2lkZ2V0VHJhbnNsYXRpb25zKGxhbmcsIEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMub25FcnJvclJlcXVlc3QoMCwgeGhyKTtcbiAgICAgICAgICB0aGlzLmdldFRyYW5zbGF0aW9ucygnZW4nKTtcbiAgICAgICAgICBkZWxldGUgdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ107XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB4aHIub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5vbkVycm9yUmVxdWVzdCgwLCB4aHIpO1xuICAgICAgICB0aGlzLmdldFRyYW5zbGF0aW9ucygnZW4nKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddO1xuICAgICAgfTtcbiAgICAgIHhoci5zZW5kKCk7XG4gICAgICB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXSA9IHt9O1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBjaGFydENsYXNzIHtcbiAgY29uc3RydWN0b3IoY29udGFpbmVyLCBzdGF0ZSl7XG4gICAgaWYgKCFjb250YWluZXIpIHJldHVybjtcbiAgICB0aGlzLmlkID0gY29udGFpbmVyLmlkO1xuICAgIHRoaXMuaXNOaWdodE1vZGUgPSBzdGF0ZS5pc05pZ2h0TW9kZTtcbiAgICB0aGlzLmNoYXJ0c1dpdGhBY3RpdmVTZXJpZXNDb29raWVzID0gW107XG4gICAgdGhpcy5jaGFydCA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW5jeSA9IHN0YXRlLmN1cnJlbmN5O1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucygpO1xuICAgIHRoaXMuZGVmYXVsdFJhbmdlID0gc3RhdGUucmFuZ2UgfHwgJzdkJztcbiAgICB0aGlzLmNhbGxiYWNrID0gbnVsbDtcbiAgICB0aGlzLnJlcGxhY2VDYWxsYmFjayA9IG51bGw7XG4gICAgdGhpcy5leHRyZW1lc0RhdGFVcmwgPSB0aGlzLmdldEV4dHJlbWVzRGF0YVVybChjb250YWluZXIuaWQpO1xuICAgIHRoaXMuZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICBjaGFydDoge1xuICAgICAgICBhbGlnblRpY2tzOiBmYWxzZSxcbiAgICAgICAgbWFyZ2luVG9wOiA1MCxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBmb250RmFtaWx5OiAnc2Fucy1zZXJpZicsXG4gICAgICAgIH0sXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgIHJlbmRlcjogKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC5hbm5vdGF0aW9ucykge1xuICAgICAgICAgICAgICBsZXQgY2hhcnQgPSBlLnRhcmdldC5hbm5vdGF0aW9ucy5jaGFydDtcbiAgICAgICAgICAgICAgY3BCb290c3RyYXAubG9vcChjaGFydC5hbm5vdGF0aW9ucy5hbGxJdGVtcywgYW5ub3RhdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHkgPSBjaGFydC5wbG90SGVpZ2h0ICsgY2hhcnQucGxvdFRvcCAtIGNoYXJ0LnNwYWNpbmdbMF0gLSAyIC0gKCh0aGlzLmlzUmVzcG9uc2l2ZU1vZGVBY3RpdmUoY2hhcnQpKSA/IDEwIDogMCk7XG4gICAgICAgICAgICAgICAgYW5ub3RhdGlvbi51cGRhdGUoe3l9LCB0cnVlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBzY3JvbGxiYXI6IHtcbiAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICB9LFxuICAgICAgYW5ub3RhdGlvbnNPcHRpb25zOiB7XG4gICAgICAgIGVuYWJsZWRCdXR0b25zOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICByYW5nZVNlbGVjdG9yOiB7XG4gICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHBsb3RPcHRpb25zOiB7XG4gICAgICAgIGxpbmU6IHtcbiAgICAgICAgICBzZXJpZXM6IHtcbiAgICAgICAgICAgIHN0YXRlczoge1xuICAgICAgICAgICAgICBob3Zlcjoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBzZXJpZXM6IHtcbiAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgIGxlZ2VuZEl0ZW1DbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChldmVudC5icm93c2VyRXZlbnQuaXNUcnVzdGVkKXtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGFydHNXaXRoQWN0aXZlU2VyaWVzQ29va2llcy5pbmRleE9mKGV2ZW50LnRhcmdldC5jaGFydC5yZW5kZXJUby5pZCkgPiAtMSkgdGhpcy5zZXRWaXNpYmxlQ2hhcnRDb29raWVzKGV2ZW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyBPbiBpT1MgdG91Y2ggZXZlbnQgZmlyZXMgc2Vjb25kIGNhbGxiYWNrIGZyb20gSlMgKGlzVHJ1c3RlZDogZmFsc2UpIHdoaWNoXG4gICAgICAgICAgICAgIC8vIHJlc3VsdHMgd2l0aCB0b2dnbGUgYmFjayB0aGUgY2hhcnQgKHByb2JhYmx5IGl0cyBhIHByb2JsZW0gd2l0aCBVSUtpdCwgYnV0IG5vdCBzdXJlKVxuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbGVnZW5kSXRlbUNsaWNrJywge2V2ZW50LCBpc1RydXN0ZWQ6IGV2ZW50LmJyb3dzZXJFdmVudC5pc1RydXN0ZWR9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50LmJyb3dzZXJFdmVudC5pc1RydXN0ZWQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB4QXhpczoge1xuICAgICAgICBvcmRpbmFsOiBmYWxzZVxuICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5jaGFydERhdGFQYXJzZXIgPSAoZGF0YSwgZGF0YVR5cGUpID0+IHtcbiAgICAgIGxldCBwcmljZUN1cnJlbmN5ID0gc3RhdGUucHJpbWFyeV9jdXJyZW5jeS50b0xvd2VyQ2FzZSgpO1xuICAgICAgZGF0YSA9IGRhdGFbMF07XG4gICAgICBsZXQgbmV3RGF0YSA9IHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHByaWNlOiAoZGF0YVtwcmljZUN1cnJlbmN5XSkgPyBkYXRhW3ByaWNlQ3VycmVuY3ldIDogW10sXG4gICAgICAgICAgdm9sdW1lOiBkYXRhLnZvbHVtZSxcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3RGF0YSk7XG4gICAgfTtcbiAgICB0aGlzLmlzRXZlbnRzSGlkZGVuID0gZmFsc2U7XG4gICAgdGhpcy5leGNsdWRlU2VyaWVzSWRzID0gW107XG4gICAgdGhpcy5hc3luY1VybCA9IGAvY3VycmVuY3kvZGF0YS8keyBzdGF0ZS5jdXJyZW5jeSB9L19yYW5nZV8vYDtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuICBcbiAgc2V0T3B0aW9ucygpe1xuICAgIGNvbnN0IGNoYXJ0U2VydmljZSA9IG5ldyBjaGFydENsYXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3BvbnNpdmU6IHtcbiAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb25kaXRpb246IHtcbiAgICAgICAgICAgICAgbWF4V2lkdGg6IDE1MDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hhcnRPcHRpb25zOiB7XG4gICAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgIGFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuICAgICAgICAgICAgICAgIHk6IDkyLFxuICAgICAgICAgICAgICAgIHN5bWJvbFJhZGl1czogMCxcbiAgICAgICAgICAgICAgICBpdGVtRGlzdGFuY2U6IDIwLFxuICAgICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgIGhlaWdodDogNDAwLFxuICAgICAgICAgICAgICAgIG1hcmdpblRvcDogMzUsXG4gICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAwLFxuICAgICAgICAgICAgICAgIHNwYWNpbmdUb3A6IDAsXG4gICAgICAgICAgICAgICAgc3BhY2luZ0JvdHRvbTogMCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbmF2aWdhdG9yOiB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgICAgICAgICAgICBtYXJnaW46IDcwLFxuICAgICAgICAgICAgICAgIGhhbmRsZXM6IHtcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogMjUsXG4gICAgICAgICAgICAgICAgICB3aWR0aDogMTcsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb25kaXRpb246IHtcbiAgICAgICAgICAgICAgbWF4V2lkdGg6IDYwMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGFydE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IDAsXG4gICAgICAgICAgICAgICAgem9vbVR5cGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IDEwLFxuICAgICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiAxMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM1MCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgeUF4aXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tBbW91bnQ6IDcsXG4gICAgICAgICAgICAgICAgICB0aWNrV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrTGVuZ3RoOiAwLFxuICAgICAgICAgICAgICAgICAgbGluZVdpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgYWxpZ246IFwibGVmdFwiLFxuICAgICAgICAgICAgICAgICAgICB4OiAxLFxuICAgICAgICAgICAgICAgICAgICB5OiAtMixcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM5ZTllOWUnLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnOXB4JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGZsb29yOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0Ftb3VudDogNyxcbiAgICAgICAgICAgICAgICAgIHRpY2tXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tMZW5ndGg6IDAsXG4gICAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICAgICAgICBhbGlnbjogXCJyaWdodFwiLFxuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogXCJqdXN0aWZ5XCIsXG4gICAgICAgICAgICAgICAgICAgIHg6IDEsXG4gICAgICAgICAgICAgICAgICAgIHk6IC0yLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzUwODVlYycsXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICc5cHgnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgIG1heFdpZHRoOiA0NTBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGFydE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgYWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ21pZGRsZScsXG4gICAgICAgICAgICAgICAgeTogODIsXG4gICAgICAgICAgICAgICAgc3ltYm9sUmFkaXVzOiAwLFxuICAgICAgICAgICAgICAgIGl0ZW1EaXN0YW5jZTogMjAsXG4gICAgICAgICAgICAgICAgaXRlbVN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG5hdmlnYXRvcjoge1xuICAgICAgICAgICAgICAgIG1hcmdpbjogNjAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA0MCxcbiAgICAgICAgICAgICAgICBoYW5kbGVzOiB7XG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6IDIwLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwMCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgeUF4aXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tBbW91bnQ6IDcsXG4gICAgICAgICAgICAgICAgICB0aWNrV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrTGVuZ3RoOiAwLFxuICAgICAgICAgICAgICAgICAgbGluZVdpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgYWxpZ246IFwibGVmdFwiLFxuICAgICAgICAgICAgICAgICAgICB4OiAxLFxuICAgICAgICAgICAgICAgICAgICB5OiAtMixcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM5ZTllOWUnLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnOXB4JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGZsb29yOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0Ftb3VudDogNyxcbiAgICAgICAgICAgICAgICAgIHRpY2tXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tMZW5ndGg6IDAsXG4gICAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICAgICAgICBhbGlnbjogXCJyaWdodFwiLFxuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogXCJqdXN0aWZ5XCIsXG4gICAgICAgICAgICAgICAgICAgIHg6IDEsXG4gICAgICAgICAgICAgICAgICAgIHk6IC0yLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzUwODVlYycsXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICc5cHgnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHRpdGxlOiB7XG4gICAgICAgIHRleHQ6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgICBjaGFydDoge1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdub25lJyxcbiAgICAgICAgbWFyZ2luVG9wOiA1MCxcbiAgICAgICAgcGxvdEJvcmRlcldpZHRoOiAwLFxuICAgICAgfSxcbiAgICAgIGNwRXZlbnRzOiBmYWxzZSxcbiAgICAgIGNvbG9yczogW1xuICAgICAgICAnIzUwODVlYycsXG4gICAgICAgICcjMWY5ODA5JyxcbiAgICAgICAgJyM5ODVkNjUnLFxuICAgICAgICAnI2VlOTgzYicsXG4gICAgICAgICcjNGM0YzRjJyxcbiAgICAgIF0sXG4gICAgICBsZWdlbmQ6IHtcbiAgICAgICAgbWFyZ2luOiAwLFxuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICBhbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgc3ltYm9sUmFkaXVzOiAwLFxuICAgICAgICBpdGVtRGlzdGFuY2U6IDQwLFxuICAgICAgICBpdGVtU3R5bGU6IHtcbiAgICAgICAgICBmb250V2VpZ2h0OiAnbm9ybWFsJyxcbiAgICAgICAgICBjb2xvcjogKHRoaXMuaXNOaWdodE1vZGUpID8gJyM4MGE2ZTUnIDogJyMwNjQ1YWQnLFxuICAgICAgICB9LFxuICAgICAgICBpdGVtTWFyZ2luVG9wOiA4LFxuICAgICAgfSxcbiAgICAgIG5hdmlnYXRvcjogdHJ1ZSxcbiAgICAgIHRvb2x0aXA6IHtcbiAgICAgICAgc2hhcmVkOiB0cnVlLFxuICAgICAgICBzcGxpdDogZmFsc2UsXG4gICAgICAgIGFuaW1hdGlvbjogZmFsc2UsXG4gICAgICAgIGJvcmRlcldpZHRoOiAxLFxuICAgICAgICBib3JkZXJDb2xvcjogKHRoaXMuaXNOaWdodE1vZGUpID8gJyM0YzRjNGMnIDogJyNlM2UzZTMnLFxuICAgICAgICBoaWRlRGVsYXk6IDEwMCxcbiAgICAgICAgc2hhZG93OiBmYWxzZSxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgY29sb3I6ICcjNGM0YzRjJyxcbiAgICAgICAgICBmb250U2l6ZTogJzEwcHgnLFxuICAgICAgICB9LFxuICAgICAgICB1c2VIVE1MOiB0cnVlLFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuIGNoYXJ0U2VydmljZS50b29sdGlwRm9ybWF0dGVyKHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIFxuICAgICAgZXhwb3J0aW5nOiB7XG4gICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICBjb250ZXh0QnV0dG9uOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFxuICAgICAgeEF4aXM6IHtcbiAgICAgICAgbGluZUNvbG9yOiAodGhpcy5pc05pZ2h0TW9kZSkgPyAnIzUwNTA1MCcgOiAnI2UzZTNlMycsXG4gICAgICAgIHRpY2tDb2xvcjogKHRoaXMuaXNOaWdodE1vZGUpID8gJyM1MDUwNTAnIDogJyNlM2UzZTMnLFxuICAgICAgICB0aWNrTGVuZ3RoOiA3LFxuICAgICAgfSxcbiAgICAgIFxuICAgICAgeUF4aXM6IFt7IC8vIFZvbHVtZSB5QXhpc1xuICAgICAgICBsaW5lV2lkdGg6IDEsXG4gICAgICAgIGxpbmVDb2xvcjogJyNkZWRlZGUnLFxuICAgICAgICB0aWNrV2lkdGg6IDEsXG4gICAgICAgIHRpY2tMZW5ndGg6IDQsXG4gICAgICAgIGdyaWRMaW5lRGFzaFN0eWxlOiAnZGFzaCcsXG4gICAgICAgIGdyaWRMaW5lV2lkdGg6IDAsXG4gICAgICAgIGZsb29yOiAwLFxuICAgICAgICBtaW5QYWRkaW5nOiAwLFxuICAgICAgICBvcHBvc2l0ZTogZmFsc2UsXG4gICAgICAgIHNob3dFbXB0eTogZmFsc2UsXG4gICAgICAgIHNob3dMYXN0TGFiZWw6IGZhbHNlLFxuICAgICAgICBzaG93Rmlyc3RMYWJlbDogZmFsc2UsXG4gICAgICB9LCB7XG4gICAgICAgIGdyaWRMaW5lQ29sb3I6ICh0aGlzLmlzTmlnaHRNb2RlKSA/ICcjNTA1MDUwJyA6ICcjZTNlM2UzJyxcbiAgICAgICAgZ3JpZExpbmVEYXNoU3R5bGU6ICdkYXNoJyxcbiAgICAgICAgbGluZVdpZHRoOiAxLFxuICAgICAgICB0aWNrV2lkdGg6IDEsXG4gICAgICAgIHRpY2tMZW5ndGg6IDQsXG4gICAgICAgIGZsb29yOiAwLFxuICAgICAgICBtaW5QYWRkaW5nOiAwLFxuICAgICAgICBzaG93RW1wdHk6IGZhbHNlLFxuICAgICAgICBvcHBvc2l0ZTogdHJ1ZSxcbiAgICAgICAgZ3JpZFpJbmRleDogNCxcbiAgICAgICAgc2hvd0xhc3RMYWJlbDogZmFsc2UsXG4gICAgICAgIHNob3dGaXJzdExhYmVsOiBmYWxzZSxcbiAgICAgIH1dLFxuICAgICAgXG4gICAgICBzZXJpZXM6IFtcbiAgICAgICAgeyAvL29yZGVyIG9mIHRoZSBzZXJpZXMgbWF0dGVyc1xuICAgICAgICAgIGNvbG9yOiAnIzUwODVlYycsXG4gICAgICAgICAgbmFtZTogJ1ByaWNlJyxcbiAgICAgICAgICBpZDogJ3ByaWNlJyxcbiAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgICB0eXBlOiAnYXJlYScsXG4gICAgICAgICAgZmlsbE9wYWNpdHk6IDAuMTUsXG4gICAgICAgICAgbGluZVdpZHRoOiAyLFxuICAgICAgICAgIHlBeGlzOiAxLFxuICAgICAgICAgIHpJbmRleDogMixcbiAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgIGNsaWNrYWJsZTogdHJ1ZSxcbiAgICAgICAgICB0aHJlc2hvbGQ6IG51bGwsXG4gICAgICAgICAgdG9vbHRpcDoge1xuICAgICAgICAgICAgdmFsdWVEZWNpbWFsczogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2hvd0luTmF2aWdhdG9yOiB0cnVlLFxuICAgICAgICAgIHNob3dJbkxlZ2VuZDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjb2xvcjogYHVybCgjZmlsbC1wYXR0ZXJuJHsodGhpcy5pc05pZ2h0TW9kZSkgPyAnLW5pZ2h0JyA6ICcnfSlgLFxuICAgICAgICAgIG5hbWU6ICdWb2x1bWUnLFxuICAgICAgICAgIGlkOiAndm9sdW1lJyxcbiAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgICB0eXBlOiAnYXJlYScsXG4gICAgICAgICAgZmlsbE9wYWNpdHk6IDAuNSxcbiAgICAgICAgICBsaW5lV2lkdGg6IDAsXG4gICAgICAgICAgeUF4aXM6IDAsXG4gICAgICAgICAgekluZGV4OiAwLFxuICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgY2xpY2thYmxlOiB0cnVlLFxuICAgICAgICAgIHRocmVzaG9sZDogbnVsbCxcbiAgICAgICAgICB0b29sdGlwOiB7XG4gICAgICAgICAgICB2YWx1ZURlY2ltYWxzOiAwLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2hvd0luTmF2aWdhdG9yOiB0cnVlLFxuICAgICAgICB9XVxuICAgIH1cbiAgfVxuICBcbiAgaW5pdCgpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZU9wdGlvbnModGhpcy5vcHRpb25zKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChvcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gKHdpbmRvdy5IaWdoY2hhcnRzKSA/IEhpZ2hjaGFydHMuc3RvY2tDaGFydCh0aGlzLmNvbnRhaW5lci5pZCwgb3B0aW9ucywgKGNoYXJ0KSA9PiB0aGlzLmJpbmQoY2hhcnQpKSA6IG51bGw7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHBhcnNlT3B0aW9ucyhvcHRpb25zKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLnVwZGF0ZU9iamVjdCh0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChuZXdPcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAudXBkYXRlT2JqZWN0KHRoaXMuZ2V0Vm9sdW1lUGF0dGVybigpLCBuZXdPcHRpb25zKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChuZXdPcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zZXROYXZpZ2F0b3IobmV3T3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigobmV3T3B0aW9ucykgPT4ge1xuICAgICAgcmV0dXJuIChuZXdPcHRpb25zLm5vRGF0YSkgPyB0aGlzLnNldE5vRGF0YUxhYmVsKG5ld09wdGlvbnMpIDogbmV3T3B0aW9ucztcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChuZXdPcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gbmV3T3B0aW9ucztcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgYmluZChjaGFydCl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNoYXJ0ID0gY2hhcnQ7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5mZXRjaERhdGFQYWNrYWdlKCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRSYW5nZVN3aXRjaGVyKCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gKHRoaXMuY2FsbGJhY2spID8gdGhpcy5jYWxsYmFjayh0aGlzLmNoYXJ0LCB0aGlzLmRlZmF1bHRSYW5nZSkgOiBudWxsO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBmZXRjaERhdGFQYWNrYWdlKG1pbkRhdGUsIG1heERhdGUpe1xuICAgIGxldCBpc1ByZWNpc2VSYW5nZSA9IChtaW5EYXRlICYmIG1heERhdGUpO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNwRXZlbnRzKXtcbiAgICAgICAgbGV0IHVybCA9IChpc1ByZWNpc2VSYW5nZSkgPyB0aGlzLmdldE5hdmlnYXRvckV4dHJlbWVzVXJsKG1pbkRhdGUsIG1heERhdGUsICdldmVudHMnKSA6IHRoaXMuZ2V0RXh0cmVtZXNEYXRhVXJsKHRoaXMuaWQsICdldmVudHMnKSArICcvJyArIHRoaXMuZ2V0UmFuZ2UoKSArICcvJztcbiAgICAgICAgcmV0dXJuICh1cmwpID8gdGhpcy5mZXRjaERhdGEodXJsLCAnZXZlbnRzJywgIWlzUHJlY2lzZVJhbmdlKSA6IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGxldCB1cmwgPSAoaXNQcmVjaXNlUmFuZ2UpID8gdGhpcy5nZXROYXZpZ2F0b3JFeHRyZW1lc1VybChtaW5EYXRlLCBtYXhEYXRlKSA6IHRoaXMuYXN5bmNVcmwucmVwbGFjZSgnX3JhbmdlXycsIHRoaXMuZ2V0UmFuZ2UoKSk7XG4gICAgICByZXR1cm4gKHVybCkgPyB0aGlzLmZldGNoRGF0YSh1cmwsICdkYXRhJywgIWlzUHJlY2lzZVJhbmdlKSA6IG51bGw7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFydC5yZWRyYXcoZmFsc2UpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuICghaXNQcmVjaXNlUmFuZ2UpID8gdGhpcy5jaGFydC56b29tT3V0KCkgOiBudWxsO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaXNMb2FkZWQgPSB0cnVlO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMudG9nZ2xlRXZlbnRzKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGZldGNoRGF0YSh1cmwsIGRhdGFUeXBlID0gJ2RhdGEnLCByZXBsYWNlID0gdHJ1ZSl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuY2hhcnQuc2hvd0xvYWRpbmcoKTtcbiAgICAgIHJldHVybiBmZXRjaFNlcnZpY2UuZmV0Y2hDaGFydERhdGEodXJsLCAhdGhpcy5pc0xvYWRlZCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHRoaXMuY2hhcnQuaGlkZUxvYWRpbmcoKTtcbiAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICByZXR1cm4gY29uc29sZS5sb2coYExvb2tzIGxpa2UgdGhlcmUgd2FzIGEgcHJvYmxlbS4gU3RhdHVzIENvZGU6ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhUGFyc2VyKGRhdGEsIGRhdGFUeXBlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGNvbnRlbnQpID0+IHtcbiAgICAgICAgICByZXR1cm4gKHJlcGxhY2UpID8gdGhpcy5yZXBsYWNlRGF0YShjb250ZW50LmRhdGEsIGRhdGFUeXBlKSA6IHRoaXMudXBkYXRlRGF0YShjb250ZW50LmRhdGEsIGRhdGFUeXBlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICB0aGlzLmNoYXJ0LmhpZGVMb2FkaW5nKCk7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ0ZldGNoIEVycm9yJywgZXJyb3IpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBzZXRSYW5nZVN3aXRjaGVyKCl7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihgJHsgdGhpcy5pZCB9LXN3aXRjaC1yYW5nZWAsIChldmVudCkgPT4ge1xuICAgICAgdGhpcy5kZWZhdWx0UmFuZ2UgPSBldmVudC5kZXRhaWwuZGF0YTtcbiAgICAgIHJldHVybiB0aGlzLmZldGNoRGF0YVBhY2thZ2UoKTtcbiAgICB9KTtcbiAgfVxuICBcbiAgZ2V0UmFuZ2UoKXtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0UmFuZ2UgfHwgJzFxJztcbiAgfVxuICBcbiAgdG9nZ2xlRXZlbnRzKCl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBpZiAodGhpcy5vcHRpb25zLmNwRXZlbnRzKXtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaGlnaGNoYXJ0cy1hbm5vdGF0aW9uJyk7XG4gICAgICB9KTtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGVsZW1lbnRzKSA9PiB7XG4gICAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKGVsZW1lbnRzLCBlbGVtZW50ID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5pc0V2ZW50c0hpZGRlbil7XG4gICAgICAgICAgICByZXR1cm4gKCFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaGlnaGNoYXJ0cy1hbm5vdGF0aW9uX19oaWRkZW4nKSkgPyBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZ2hjaGFydHMtYW5ub3RhdGlvbl9faGlkZGVuJykgOiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWdoY2hhcnRzLWFubm90YXRpb25fX2hpZGRlbicpKSA/IGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGNoYXJ0cy1hbm5vdGF0aW9uX19oaWRkZW4nKSA6IG51bGw7XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaGlnaGNoYXJ0cy1wbG90LWxpbmUnKTtcbiAgICAgIH0pO1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoZWxlbWVudHMpID0+IHtcbiAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AoZWxlbWVudHMsIGVsZW1lbnQgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmlzRXZlbnRzSGlkZGVuKXtcbiAgICAgICAgICAgIHJldHVybiAoIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWdoY2hhcnRzLXBsb3QtbGluZV9faGlkZGVuJykpID8gZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWdoY2hhcnRzLXBsb3QtbGluZV9faGlkZGVuJykgOiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWdoY2hhcnRzLXBsb3QtbGluZV9faGlkZGVuJykpID8gZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdoY2hhcnRzLXBsb3QtbGluZV9faGlkZGVuJykgOiBudWxsO1xuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBkYXRhUGFyc2VyKGRhdGEsIGRhdGFUeXBlID0gJ2RhdGEnKXtcbiAgICBzd2l0Y2ggKGRhdGFUeXBlKXtcbiAgICAgIGNhc2UgJ2RhdGEnOlxuICAgICAgICBsZXQgcHJvbWlzZURhdGEgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgcHJvbWlzZURhdGEgPSBwcm9taXNlRGF0YS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gKHRoaXMuY2hhcnREYXRhUGFyc2VyKSA/IHRoaXMuY2hhcnREYXRhUGFyc2VyKGRhdGEpIDoge1xuICAgICAgICAgICAgZGF0YTogZGF0YVswXSxcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2VEYXRhO1xuICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShkYXRhKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuICBcbiAgdXBkYXRlRGF0YShkYXRhLCBkYXRhVHlwZSkge1xuICAgIGxldCBuZXdEYXRhO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBzd2l0Y2ggKGRhdGFUeXBlKSB7XG4gICAgICAgIGNhc2UgJ2RhdGEnOlxuICAgICAgICAgIG5ld0RhdGEgPSB7fTtcbiAgICAgICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChPYmplY3QuZW50cmllcyhkYXRhKSwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0V4Y2x1ZGVkKHZhbHVlWzBdKSkgcmV0dXJuO1xuICAgICAgICAgICAgbGV0IG9sZERhdGEgPSB0aGlzLmdldE9sZERhdGEoZGF0YVR5cGUpW3ZhbHVlWzBdXTtcbiAgICAgICAgICAgIG5ld0RhdGFbdmFsdWVbMF1dID0gb2xkRGF0YVxuICAgICAgICAgICAgICAuZmlsdGVyKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlWzFdLmZpbmRJbmRleChmaW5kRWxlbWVudCA9PiB0aGlzLmlzVGhlU2FtZUVsZW1lbnQoZWxlbWVudCwgZmluZEVsZW1lbnQsIGRhdGFUeXBlKSkgPT09IC0xO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuY29uY2F0KHZhbHVlWzFdKVxuICAgICAgICAgICAgICAuc29ydCgoZGF0YTEsIGRhdGEyKSA9PiB0aGlzLnNvcnRDb25kaXRpb24oZGF0YTEsIGRhdGEyLCBkYXRhVHlwZSkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICAgIG5ld0RhdGEgPSBbXTtcbiAgICAgICAgICBsZXQgb2xkRGF0YSA9IHRoaXMuZ2V0T2xkRGF0YShkYXRhVHlwZSk7XG4gICAgICAgICAgcmV0dXJuIG5ld0RhdGEgPSBvbGREYXRhXG4gICAgICAgICAgICAuZmlsdGVyKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgIGRhdGEuZmluZEluZGV4KGZpbmRFbGVtZW50ID0+IHRoaXMuaXNUaGVTYW1lRWxlbWVudChlbGVtZW50LCBmaW5kRWxlbWVudCwgZGF0YVR5cGUpKSA9PT0gLTE7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNvbmNhdChkYXRhKVxuICAgICAgICAgICAgLnNvcnQoKGRhdGExLCBkYXRhMikgPT4gdGhpcy5zb3J0Q29uZGl0aW9uKGRhdGExLCBkYXRhMiwgZGF0YVR5cGUpKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5yZXBsYWNlRGF0YShuZXdEYXRhLCBkYXRhVHlwZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGlzVGhlU2FtZUVsZW1lbnQoZWxlbWVudEEsIGVsZW1lbnRCLCBkYXRhVHlwZSl7XG4gICAgc3dpdGNoIChkYXRhVHlwZSl7XG4gICAgICBjYXNlICdkYXRhJzpcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRBWzBdID09PSBlbGVtZW50QlswXTtcbiAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgIHJldHVybiBlbGVtZW50QS50cyA9PT0gZWxlbWVudEIudHM7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIFxuICBzb3J0Q29uZGl0aW9uKGVsZW1lbnRBLCBlbGVtZW50QiwgZGF0YVR5cGUpe1xuICAgIHN3aXRjaCAoZGF0YVR5cGUpe1xuICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgIHJldHVybiBlbGVtZW50QVswXSAtIGVsZW1lbnRCWzBdO1xuICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRBLnRzIC0gZWxlbWVudEIudHM7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIFxuICBnZXRPbGREYXRhKGRhdGFUeXBlKXtcbiAgICByZXR1cm4gdGhpc1snY2hhcnRfJytkYXRhVHlwZS50b0xvd2VyQ2FzZSgpXTtcbiAgfVxuICBcbiAgcmVwbGFjZURhdGEoZGF0YSwgZGF0YVR5cGUpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpc1snY2hhcnRfJytkYXRhVHlwZS50b0xvd2VyQ2FzZSgpXSA9IGRhdGE7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5yZXBsYWNlRGF0YVR5cGUoZGF0YSwgZGF0YVR5cGUpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuICh0aGlzLnJlcGxhY2VDYWxsYmFjaykgPyB0aGlzLnJlcGxhY2VDYWxsYmFjayh0aGlzLmNoYXJ0LCBkYXRhLCB0aGlzLmlzTG9hZGVkLCBkYXRhVHlwZSkgOiBudWxsO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICByZXBsYWNlRGF0YVR5cGUoZGF0YSwgZGF0YVR5cGUpe1xuICAgIHN3aXRjaCAoZGF0YVR5cGUpe1xuICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgIGlmICh0aGlzLmFzeW5jVXJsKXtcbiAgICAgICAgICBjcEJvb3RzdHJhcC5sb29wKFsnYnRjLWJpdGNvaW4nLCAnZXRoLWV0aGVyZXVtJ10sIGNvaW5OYW1lID0+IHtcbiAgICAgICAgICAgIGxldCBjb2luU2hvcnQgPSBjb2luTmFtZS5zcGxpdCgnLScpWzBdO1xuICAgICAgICAgICAgaWYgKHRoaXMuYXN5bmNVcmwuc2VhcmNoKGNvaW5OYW1lKSA+IC0xICYmIGRhdGFbY29pblNob3J0XSkge1xuICAgICAgICAgICAgICBkYXRhW2NvaW5TaG9ydF0gPSBbXTtcbiAgICAgICAgICAgICAgY3BCb290c3RyYXAubG9vcCh0aGlzLmNoYXJ0LnNlcmllcywgc2VyaWVzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc2VyaWVzLnVzZXJPcHRpb25zLmlkID09PSBjb2luU2hvcnQpIHNlcmllcy51cGRhdGUoeyB2aXNpYmxlOiBmYWxzZSB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AoT2JqZWN0LmVudHJpZXMoZGF0YSksICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmlzRXhjbHVkZWQodmFsdWVbMF0pKSByZXR1cm47XG4gICAgICAgICAgcmV0dXJuICh0aGlzLmNoYXJ0LmdldCh2YWx1ZVswXSkpID8gdGhpcy5jaGFydC5nZXQodmFsdWVbMF0pLnNldERhdGEodmFsdWVbMV0sIGZhbHNlLCBmYWxzZSwgZmFsc2UpIDogdGhpcy5jaGFydC5hZGRTZXJpZXMoe2lkOiB2YWx1ZVswXSwgZGF0YTogdmFsdWVbMV0sIHNob3dJbk5hdmlnYXRvcjogdHJ1ZX0pO1xuICAgICAgICB9KTtcbiAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKHRoaXMuY2hhcnQuYW5ub3RhdGlvbnMuYWxsSXRlbXMsIGFubm90YXRpb24gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGFubm90YXRpb24uZGVzdHJveSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2V0QW5ub3RhdGlvbnNPYmplY3RzKGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbiAgXG4gIGlzRXhjbHVkZWQobGFiZWwpe1xuICAgIHJldHVybiB0aGlzLmV4Y2x1ZGVTZXJpZXNJZHMuaW5kZXhPZihsYWJlbCkgPiAtMTtcbiAgfVxuICBcbiAgdG9vbHRpcEZvcm1hdHRlcihwb2ludGVyLCBsYWJlbCA9ICcnLCBzZWFyY2gpe1xuICAgIGlmICghc2VhcmNoKSBzZWFyY2ggPSBsYWJlbDtcbiAgICBjb25zdCBoZWFkZXIgPSAnPGRpdiBjbGFzcz1cImNwLWNoYXJ0LXRvb2x0aXAtY3VycmVuY3lcIj48c21hbGw+JytuZXcgRGF0ZShwb2ludGVyLngpLnRvVVRDU3RyaW5nKCkrJzwvc21hbGw+PHRhYmxlPic7XG4gICAgY29uc3QgZm9vdGVyID0gJzwvdGFibGU+PC9kaXY+JztcbiAgICBsZXQgY29udGVudCA9ICcnO1xuICAgIHBvaW50ZXIucG9pbnRzLmZvckVhY2gocG9pbnQgPT4ge1xuICAgICAgY29udGVudCArPSAnPHRyPicgK1xuICAgICAgICAnPHRkPicgK1xuICAgICAgICAnPHN2ZyB3aWR0aD1cIjVcIiBoZWlnaHQ9XCI1XCI+PHJlY3QgeD1cIjBcIiB5PVwiMFwiIHdpZHRoPVwiNVwiIGhlaWdodD1cIjVcIiBmaWxsPVwiJytwb2ludC5zZXJpZXMuY29sb3IrJ1wiIGZpbGwtb3BhY2l0eT1cIjFcIj48L3JlY3Q+PC9zdmc+JyArXG4gICAgICAgIHBvaW50LnNlcmllcy5uYW1lICsgJzogJyArIHBvaW50LnkudG9Mb2NhbGVTdHJpbmcoJ3J1LVJVJywgeyBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDggfSkgKyAnICcgKyAoKHBvaW50LnNlcmllcy5uYW1lLnRvTG93ZXJDYXNlKCkuc2VhcmNoKHNlYXJjaC50b0xvd2VyQ2FzZSgpKSA+IC0xKSA/IFwiXCIgOiBsYWJlbCkgK1xuICAgICAgICAnPC90ZD4nICtcbiAgICAgICAgJzwvdHI+JztcbiAgICB9KTtcbiAgICByZXR1cm4gaGVhZGVyICsgY29udGVudCArIGZvb3RlcjtcbiAgfVxuICBcbiAgc2V0QW5ub3RhdGlvbnNPYmplY3RzKGRhdGEpe1xuICAgIHRoaXMuY2hhcnQuc2VyaWVzWzBdLnhBeGlzLnJlbW92ZVBsb3RMaW5lKCk7XG4gICAgbGV0IHBsb3RMaW5lcyA9IFtdO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gZGF0YS5zb3J0KChkYXRhMSwgZGF0YTIpID0+IHtcbiAgICAgICAgcmV0dXJuIGRhdGEyLnRzIC0gZGF0YTEudHM7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKGRhdGEsIGVsZW1lbnQgPT4ge1xuICAgICAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gcGxvdExpbmVzLnB1c2goe1xuICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICB2YWx1ZTogZWxlbWVudC50cyxcbiAgICAgICAgICAgIGRhc2hTdHlsZTogJ3NvbGlkJyxcbiAgICAgICAgICAgIHpJbmRleDogNCxcbiAgICAgICAgICAgIGNvbG9yOiB0aGlzLmdldEV2ZW50VGFnUGFyYW1zKCkuY29sb3IsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jaGFydC5hZGRBbm5vdGF0aW9uKHtcbiAgICAgICAgICAgIHhWYWx1ZTogZWxlbWVudC50cyxcbiAgICAgICAgICAgIHk6IDAsXG4gICAgICAgICAgICB0aXRsZTogYDxzcGFuIHRpdGxlPVwiQ2xpY2sgdG8gb3BlblwiIGNsYXNzPVwiY3AtY2hhcnQtYW5ub3RhdGlvbl9fdGV4dFwiPiR7IHRoaXMuZ2V0RXZlbnRUYWdQYXJhbXMoZWxlbWVudC50YWcpLmxhYmVsIH08L3NwYW4+PHNwYW4gY2xhc3M9XCJjcC1jaGFydC1hbm5vdGF0aW9uX19kYXRhRWxlbWVudFwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj4keyBKU09OLnN0cmluZ2lmeShlbGVtZW50KSB9PC9zcGFuPmAsXG4gICAgICAgICAgICBzaGFwZToge1xuICAgICAgICAgICAgICB0eXBlOiAnY2lyY2xlJyxcbiAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgcjogMTEsXG4gICAgICAgICAgICAgICAgY3g6IDksXG4gICAgICAgICAgICAgICAgY3k6IDEwLjUsXG4gICAgICAgICAgICAgICAgJ3N0cm9rZS13aWR0aCc6IDEuNSxcbiAgICAgICAgICAgICAgICBmaWxsOiB0aGlzLmdldEV2ZW50VGFnUGFyYW1zKCkuY29sb3IsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgIG1vdXNlb3ZlcjogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKE1vYmlsZURldGVjdC5pc01vYmlsZSgpKSByZXR1cm47XG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmdldEV2ZW50RGF0YUZyb21Bbm5vdGF0aW9uRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMub3BlbkV2ZW50Q29udGFpbmVyKGRhdGEsIGV2ZW50KTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbW91c2VvdXQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoTW9iaWxlRGV0ZWN0LmlzTW9iaWxlKCkpIHJldHVybjtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlRXZlbnRDb250YWluZXIoZXZlbnQpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmdldEV2ZW50RGF0YUZyb21Bbm5vdGF0aW9uRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIGlmIChNb2JpbGVEZXRlY3QuaXNNb2JpbGUoKSkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuRXZlbnRDb250YWluZXIoZGF0YSwgZXZlbnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLm9wZW5FdmVudFBhZ2UoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhcnQuc2VyaWVzWzBdLnhBeGlzLnVwZGF0ZSh7XG4gICAgICAgIHBsb3RMaW5lcyxcbiAgICAgIH0sIGZhbHNlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgc2V0TmF2aWdhdG9yKG9wdGlvbnMpe1xuICAgIGxldCBuYXZpZ2F0b3JPcHRpb25zID0ge307XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGlmIChvcHRpb25zLm5hdmlnYXRvciA9PT0gdHJ1ZSl7XG4gICAgICAgIG5hdmlnYXRvck9wdGlvbnMgPSB7XG4gICAgICAgICAgbmF2aWdhdG9yOiB7XG4gICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICBtYXJnaW46IDIwLFxuICAgICAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgICAgIGxpbmVXaWR0aDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtYXNrRmlsbDogJ3JnYmEoMTAyLDEzMywxOTQsMC4xNSknLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgIHpvb21UeXBlOiAneCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgIHNldEV4dHJlbWVzOiAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICgoZS50cmlnZ2VyID09PSAnbmF2aWdhdG9yJyB8fCBlLnRyaWdnZXIgPT09ICd6b29tJykgJiYgZS5taW4gJiYgZS5tYXgpIHtcbiAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KHRoaXMuaWQrJ1NldEV4dHJlbWVzJywge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgICAgICAgICBtaW5EYXRlOiBlLm1pbixcbiAgICAgICAgICAgICAgICAgICAgICBtYXhEYXRlOiBlLm1heCxcbiAgICAgICAgICAgICAgICAgICAgICBlLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm5hdmlnYXRvckV4dHJlbWVzTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5zZXRSZXNldFpvb21CdXR0b24oKTtcbiAgICAgIH0gZWxzZSBpZiAoIW9wdGlvbnMubmF2aWdhdG9yKSB7XG4gICAgICAgIG5hdmlnYXRvck9wdGlvbnMgPSB7XG4gICAgICAgICAgbmF2aWdhdG9yOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLnVwZGF0ZU9iamVjdChvcHRpb25zLCBuYXZpZ2F0b3JPcHRpb25zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgc2V0UmVzZXRab29tQnV0dG9uKCl7XG4gICAgLy8gcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpOyAvLyBjYW50IGJlIHBvc2l0aW9uZWQgcHJvcGVybHkgaW4gcGxvdEJveCwgc28gaXRzIGRpc2FibGVkXG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmFkZENvbnRhaW5lcih0aGlzLmlkLCAnUmVzZXRab29tJywgJ2NwLWNoYXJ0LXJlc2V0LXpvb20nLCAnYnV0dG9uJylcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdldENvbnRhaW5lcignUmVzZXRab29tJyk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoZWxlbWVudCkgPT4ge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd1ay1idXR0b24nKTtcbiAgICAgIGVsZW1lbnQuaW5uZXJUZXh0ID0gJ1Jlc2V0IHpvb20nO1xuICAgICAgcmV0dXJuIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuY2hhcnQuem9vbU91dCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIG5hdmlnYXRvckV4dHJlbWVzTGlzdGVuZXIoKSB7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKHRoaXMuaWQgKyAnU2V0RXh0cmVtZXMnLCAoZSkgPT4ge1xuICAgICAgICBsZXQgbWluRGF0ZSA9IGNwQm9vdHN0cmFwLnJvdW5kKGUuZGV0YWlsLm1pbkRhdGUgLyAxMDAwLCAwKTtcbiAgICAgICAgbGV0IG1heERhdGUgPSBjcEJvb3RzdHJhcC5yb3VuZChlLmRldGFpbC5tYXhEYXRlIC8gMTAwMCwgMCk7XG4gICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLmZldGNoRGF0YVBhY2thZ2UobWluRGF0ZSwgbWF4RGF0ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBnZXROYXZpZ2F0b3JFeHRyZW1lc1VybChtaW5EYXRlLCBtYXhEYXRlLCBkYXRhVHlwZSl7XG4gICAgbGV0IGV4dHJlbWVzRGF0YVVybCA9IChkYXRhVHlwZSkgPyB0aGlzLmdldEV4dHJlbWVzRGF0YVVybCh0aGlzLmlkLCBkYXRhVHlwZSkgOiB0aGlzLmV4dHJlbWVzRGF0YVVybDtcbiAgICByZXR1cm4gKG1pbkRhdGUgJiYgbWF4RGF0ZSAmJiBleHRyZW1lc0RhdGFVcmwpID8gZXh0cmVtZXNEYXRhVXJsICsnL2RhdGVzLycrbWluRGF0ZSsnLycrbWF4RGF0ZSsnLycgOiBudWxsO1xuICB9XG4gIFxuICBzZXROb0RhdGFMYWJlbChvcHRpb25zKXtcbiAgICBsZXQgbm9EYXRhT3B0aW9ucyA9IHt9O1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBub0RhdGFPcHRpb25zID0ge1xuICAgICAgICBsYW5nOiB7XG4gICAgICAgICAgbm9EYXRhOiAnV2UgZG9uXFwndCBoYXZlIGRhdGEgZm9yIHRoaXMgdGltZSBwZXJpb2QnXG4gICAgICAgIH0sXG4gICAgICAgIG5vRGF0YToge1xuICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICBmb250RmFtaWx5OiAnQXJpYWwnLFxuICAgICAgICAgICAgZm9udFNpemU6ICcxNHB4JyxcbiAgICAgICAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAudXBkYXRlT2JqZWN0KG9wdGlvbnMsIG5vRGF0YU9wdGlvbnMpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBhZGRDb250YWluZXIoaWQsIGxhYmVsLCBjbGFzc05hbWUsIHRhZ05hbWUgPSAnZGl2Jyl7XG4gICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG4gICAgbGV0IGNoYXJ0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgIGNvbnRhaW5lci5pZCA9IGlkICsgbGFiZWw7XG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICBjaGFydENvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICB9XG4gIFxuICBnZXRDb250YWluZXIobGFiZWwpe1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkK2xhYmVsKTtcbiAgfVxuICBcbiAgZ2V0RXh0cmVtZXNEYXRhVXJsKGlkLCBkYXRhVHlwZSA9ICdkYXRhJyl7XG4gICAgcmV0dXJuICcvY3VycmVuY3kvJysgZGF0YVR5cGUgKycvJysgdGhpcy5jdXJyZW5jeTtcbiAgfVxuICBcbiAgZ2V0Vm9sdW1lUGF0dGVybigpe1xuICAgIHJldHVybiB7XG4gICAgICBkZWZzOiB7XG4gICAgICAgIHBhdHRlcm5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ2lkJzogJ2ZpbGwtcGF0dGVybicsXG4gICAgICAgICAgICAncGF0aCc6IHtcbiAgICAgICAgICAgICAgZDogJ00gMyAwIEwgMyAxMCBNIDggMCBMIDggMTAnLFxuICAgICAgICAgICAgICBzdHJva2U6IFwiI2UzZTNlM1wiLFxuICAgICAgICAgICAgICBmaWxsOiAnI2YxZjFmMScsXG4gICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdpZCc6ICdmaWxsLXBhdHRlcm4tbmlnaHQnLFxuICAgICAgICAgICAgJ3BhdGgnOiB7XG4gICAgICAgICAgICAgIGQ6ICdNIDMgMCBMIDMgMTAgTSA4IDAgTCA4IDEwJyxcbiAgICAgICAgICAgICAgc3Ryb2tlOiBcIiM5YjliOWJcIixcbiAgICAgICAgICAgICAgZmlsbDogJyMzODM4MzgnLFxuICAgICAgICAgICAgICBzdHJva2VXaWR0aDogMixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuXG5jbGFzcyBib290c3RyYXBDbGFzcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1wdHlWYWx1ZSA9IDA7XG4gICAgdGhpcy5lbXB0eURhdGEgPSAnLSc7XG4gIH1cbiAgXG4gIG5vZGVMaXN0VG9BcnJheShub2RlTGlzdCkge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChub2RlTGlzdCk7XG4gIH1cbiAgXG4gIHBhcnNlSW50ZXJ2YWxWYWx1ZSh2YWx1ZSkge1xuICAgIGxldCB0aW1lU3ltYm9sID0gJycsIG11bHRpcGxpZXIgPSAxO1xuICAgIGlmICh2YWx1ZS5zZWFyY2goJ3MnKSA+IC0xKSB7XG4gICAgICB0aW1lU3ltYm9sID0gJ3MnO1xuICAgICAgbXVsdGlwbGllciA9IDEwMDA7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5zZWFyY2goJ20nKSA+IC0xKSB7XG4gICAgICB0aW1lU3ltYm9sID0gJ20nO1xuICAgICAgbXVsdGlwbGllciA9IDYwICogMTAwMDtcbiAgICB9XG4gICAgaWYgKHZhbHVlLnNlYXJjaCgnaCcpID4gLTEpIHtcbiAgICAgIHRpbWVTeW1ib2wgPSAnaCc7XG4gICAgICBtdWx0aXBsaWVyID0gNjAgKiA2MCAqIDEwMDA7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5zZWFyY2goJ2QnKSA+IC0xKSB7XG4gICAgICB0aW1lU3ltYm9sID0gJ2QnO1xuICAgICAgbXVsdGlwbGllciA9IDI0ICogNjAgKiA2MCAqIDEwMDA7XG4gICAgfVxuICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlLnJlcGxhY2UodGltZVN5bWJvbCwgJycpKSAqIG11bHRpcGxpZXI7XG4gIH1cbiAgXG4gIHVwZGF0ZU9iamVjdChvYmosIG5ld09iaikge1xuICAgIGxldCByZXN1bHQgPSBvYmo7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKE9iamVjdC5rZXlzKG5ld09iaiksIGtleSA9PiB7XG4gICAgICAgIGlmIChyZXN1bHQuaGFzT3duUHJvcGVydHkoa2V5KSAmJiB0eXBlb2YgcmVzdWx0W2tleV0gPT09ICdvYmplY3QnKXtcbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVPYmplY3QocmVzdWx0W2tleV0sIG5ld09ialtrZXldKS50aGVuKCh1cGRhdGVSZXN1bHQpID0+IHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdXBkYXRlUmVzdWx0O1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRba2V5XSA9IG5ld09ialtrZXldO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHBhcnNlTnVtYmVyKG51bWJlcikge1xuICAgIGlmICghbnVtYmVyICYmIG51bWJlciAhPT0gMCkgcmV0dXJuIG51bWJlcjtcbiAgICBpZiAobnVtYmVyID09PSB0aGlzLmVtcHR5VmFsdWUgfHwgbnVtYmVyID09PSB0aGlzLmVtcHR5RGF0YSkgcmV0dXJuIG51bWJlcjtcbiAgICBudW1iZXIgPSBwYXJzZUZsb2F0KG51bWJlcik7XG4gICAgaWYgKG51bWJlciA+IDEwMDAwMCkge1xuICAgICAgbGV0IG51bWJlclN0ciA9IG51bWJlci50b0ZpeGVkKDApO1xuICAgICAgbGV0IHBhcmFtZXRlciA9ICdLJyxcbiAgICAgICAgc3BsaWNlZCA9IG51bWJlclN0ci5zbGljZSgwLCBudW1iZXJTdHIubGVuZ3RoIC0gMSk7XG4gICAgICBpZiAobnVtYmVyID4gMTAwMDAwMDAwMCkge1xuICAgICAgICBzcGxpY2VkID0gbnVtYmVyU3RyLnNsaWNlKDAsIG51bWJlclN0ci5sZW5ndGggLSA3KTtcbiAgICAgICAgcGFyYW1ldGVyID0gJ0InO1xuICAgICAgfSBlbHNlIGlmIChudW1iZXIgPiAxMDAwMDAwKSB7XG4gICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDQpO1xuICAgICAgICBwYXJhbWV0ZXIgPSAnTSc7XG4gICAgICB9XG4gICAgICBsZXQgbmF0dXJhbCA9IHNwbGljZWQuc2xpY2UoMCwgc3BsaWNlZC5sZW5ndGggLSAyKTtcbiAgICAgIGxldCBkZWNpbWFsID0gc3BsaWNlZC5zbGljZShzcGxpY2VkLmxlbmd0aCAtIDIpO1xuICAgICAgcmV0dXJuIG5hdHVyYWwgKyAnLicgKyBkZWNpbWFsICsgJyAnICsgcGFyYW1ldGVyO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgaXNEZWNpbWFsID0gKG51bWJlciAlIDEpID4gMDtcbiAgICAgIGlmIChpc0RlY2ltYWwpIHtcbiAgICAgICAgbGV0IHByZWNpc2lvbiA9IDI7XG4gICAgICAgIGlmIChudW1iZXIgPCAxKSB7XG4gICAgICAgICAgcHJlY2lzaW9uID0gODtcbiAgICAgICAgfSBlbHNlIGlmIChudW1iZXIgPCAxMCkge1xuICAgICAgICAgIHByZWNpc2lvbiA9IDY7XG4gICAgICAgIH0gZWxzZSBpZiAobnVtYmVyIDwgMTAwMCkge1xuICAgICAgICAgIHByZWNpc2lvbiA9IDQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucm91bmQobnVtYmVyLCBwcmVjaXNpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bWJlci50b0ZpeGVkKDIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgcm91bmQoYW1vdW50LCBkZWNpbWFsID0gOCwgZGlyZWN0aW9uKSB7XG4gICAgYW1vdW50ID0gcGFyc2VGbG9hdChhbW91bnQpO1xuICAgIGlmICghZGlyZWN0aW9uKSBkaXJlY3Rpb24gPSAncm91bmQnO1xuICAgIGRlY2ltYWwgPSBNYXRoLnBvdygxMCwgZGVjaW1hbCk7XG4gICAgcmV0dXJuIE1hdGhbZGlyZWN0aW9uXShhbW91bnQgKiBkZWNpbWFsKSAvIGRlY2ltYWw7XG4gIH1cbiAgXG4gIGxvb3AoYXJyLCBmbiwgYnVzeSwgZXJyLCBpID0gMCkge1xuICAgIGNvbnN0IGJvZHkgPSAob2ssIGVyKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByID0gZm4oYXJyW2ldLCBpLCBhcnIpO1xuICAgICAgICByICYmIHIudGhlbiA/IHIudGhlbihvaykuY2F0Y2goZXIpIDogb2socilcbiAgICAgIH1cbiAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGVyKGUpXG4gICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBuZXh0ID0gKG9rLCBlcikgPT4gKCkgPT4gdGhpcy5sb29wKGFyciwgZm4sIG9rLCBlciwgKytpKTtcbiAgICBjb25zdCBydW4gPSAob2ssIGVyKSA9PiBpIDwgYXJyLmxlbmd0aCA/IG5ldyBQcm9taXNlKGJvZHkpLnRoZW4obmV4dChvaywgZXIpKS5jYXRjaChlcikgOiBvaygpO1xuICAgIHJldHVybiBidXN5ID8gcnVuKGJ1c3ksIGVycikgOiBuZXcgUHJvbWlzZShydW4pXG4gIH1cbn1cblxuY2xhc3MgZmV0Y2hDbGFzcyB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5zdGF0ZSA9IHt9O1xuICB9XG4gIFxuICBmZXRjaFNjcmlwdCh1cmwpIHtcbiAgICBpZiAodGhpcy5zdGF0ZVt1cmxdKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgIHRoaXMuc3RhdGVbdXJsXSA9ICdwZW5kaW5nJztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUpIHRoaXMuc3RhdGVbdXJsXSA9ICdkb3dubG9hZGVkJztcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlKSBkZWxldGUgdGhpcy5zdGF0ZVt1cmxdO1xuICAgICAgICByZWplY3QobmV3IEVycm9yKGBGYWlsZWQgdG8gbG9hZCBpbWFnZSdzIFVSTDogJHt1cmx9YCkpO1xuICAgICAgfSk7XG4gICAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xuICAgICAgc2NyaXB0LnNyYyA9IHVybDtcbiAgICB9KTtcbiAgfVxuICBcbiAgZmV0Y2hTdHlsZSh1cmwpIHtcbiAgICBpZiAodGhpcy5zdGF0ZVt1cmxdKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgIHRoaXMuc3RhdGVbdXJsXSA9ICdwZW5kaW5nJztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdyZWwnLCAnc3R5bGVzaGVldCcpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgdXJsKTtcbiAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUpIHRoaXMuc3RhdGVbdXJsXSA9ICdkb3dubG9hZGVkJztcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSkgZGVsZXRlIHRoaXMuc3RhdGVbdXJsXTtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgRmFpbGVkIHRvIGxvYWQgc3R5bGUgVVJMOiAke3VybH1gKSk7XG4gICAgICB9KTtcbiAgICAgIGxpbmsuaHJlZiA9IHVybDtcbiAgICB9KTtcbiAgfVxuICBcbiAgZmV0Y2hDaGFydERhdGEodXJpLCBmcm9tU3RhdGUgPSBmYWxzZSl7XG4gICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vZ3JhcGhzLmNvaW5wYXByaWthLmNvbScgKyB1cmk7XG4gICAgcmV0dXJuIHRoaXMuZmV0Y2hEYXRhKHVybCwgZnJvbVN0YXRlKTtcbiAgfVxuICBcbiAgZmV0Y2hEYXRhKHVybCwgZnJvbVN0YXRlKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKGZyb21TdGF0ZSl7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlW3VybF0gPT09ICdwZW5kaW5nJyl7XG4gICAgICAgICAgbGV0IHByb21pc2VUaW1lb3V0ID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIHJlc29sdmUodGhpcy5mZXRjaERhdGEodXJsLCBmcm9tU3RhdGUpKTtcbiAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHByb21pc2VUaW1lb3V0O1xuICAgICAgICB9XG4gICAgICAgIGlmICghIXRoaXMuc3RhdGVbdXJsXSl7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLnN0YXRlW3VybF0uY2xvbmUoKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBwcm9taXNlRmV0Y2ggPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIHByb21pc2VGZXRjaCA9IHByb21pc2VGZXRjaC50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5zdGF0ZVt1cmxdID0gJ3BlbmRpbmcnO1xuICAgICAgICByZXR1cm4gZmV0Y2godXJsKTtcbiAgICAgIH0pO1xuICAgICAgcHJvbWlzZUZldGNoID0gcHJvbWlzZUZldGNoLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIHRoaXMuc3RhdGVbdXJsXSA9IHJlc3BvbnNlO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuY2xvbmUoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHByb21pc2VGZXRjaDtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxufVxuXG5uZXcgd2lkZ2V0c0NvbnRyb2xsZXIoKTtcbmNvbnN0IGNwQm9vdHN0cmFwID0gbmV3IGJvb3RzdHJhcENsYXNzKCk7XG5jb25zdCBmZXRjaFNlcnZpY2UgPSBuZXcgZmV0Y2hDbGFzcygpOyJdfQ==
