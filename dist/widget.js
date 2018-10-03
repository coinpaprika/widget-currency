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
        var url = (isPreciseRange ? _this17.getNavigatorExtremesUrl(minDate, maxDate) : _this17.asyncUrl.replace('_range_', _this17.getRange())) + _this17.asyncParams;
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
        _this18.hideChart();
        return console.log('Fetch Error', error);
      });
      return promise;
    }
  }, {
    key: 'hideChart',
    value: function hideChart() {
      var _this19 = this;

      var bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var classFunc = bool ? 'add' : 'remove';
      console.log({ container: this.container });
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
        return _this19.container.classList[classFunc]('cp-chart-no-data');
      });
      return promise;
    }
  }, {
    key: 'setRangeSwitcher',
    value: function setRangeSwitcher() {
      var _this20 = this;

      document.addEventListener(this.id + '-switch-range', function (event) {
        _this20.defaultRange = event.detail.data;
        return _this20.fetchDataPackage();
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
      var _this21 = this;

      var promise = Promise.resolve();
      if (this.options.cpEvents) {
        promise = promise.then(function () {
          return document.getElementsByClassName('highcharts-annotation');
        });
        promise = promise.then(function (elements) {
          return cpBootstrap.loop(elements, function (element) {
            if (_this21.isEventsHidden) {
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
            if (_this21.isEventsHidden) {
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
      var _this22 = this;

      var dataType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'data';

      switch (dataType) {
        case 'data':
          var promiseData = Promise.resolve();
          promiseData = promiseData.then(function () {
            return _this22.chartDataParser ? _this22.chartDataParser(data) : {
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
      var _this23 = this;

      var newData = void 0;
      var promise = Promise.resolve();
      promise = promise.then(function () {
        switch (dataType) {
          case 'data':
            newData = {};
            return cpBootstrap.loop(Object.entries(data), function (value) {
              if (_this23.isExcluded(value[0])) return;
              var oldData = _this23.getOldData(dataType)[value[0]];
              newData[value[0]] = oldData.filter(function (element) {
                return value[1].findIndex(function (findElement) {
                  return _this23.isTheSameElement(element, findElement, dataType);
                }) === -1;
              }).concat(value[1]).sort(function (data1, data2) {
                return _this23.sortCondition(data1, data2, dataType);
              });
            });
          case 'events':
            newData = [];
            var oldData = _this23.getOldData(dataType);
            return newData = oldData.filter(function (element) {
              data.findIndex(function (findElement) {
                return _this23.isTheSameElement(element, findElement, dataType);
              }) === -1;
            }).concat(data).sort(function (data1, data2) {
              return _this23.sortCondition(data1, data2, dataType);
            });
          default:
            return false;
        }
      });
      promise = promise.then(function () {
        return _this23.replaceData(newData, dataType);
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
      var _this24 = this;

      var promise = Promise.resolve();
      promise = promise.then(function () {
        return _this24['chart_' + dataType.toLowerCase()] = data;
      });
      promise = promise.then(function () {
        return _this24.replaceDataType(data, dataType);
      });
      promise = promise.then(function () {
        return _this24.replaceCallback ? _this24.replaceCallback(_this24.chart, data, _this24.isLoaded, dataType) : null;
      });
      return promise;
    }
  }, {
    key: 'replaceDataType',
    value: function replaceDataType(data, dataType) {
      var _this25 = this;

      switch (dataType) {
        case 'data':
          if (this.asyncUrl) {
            cpBootstrap.loop(['btc-bitcoin', 'eth-ethereum'], function (coinName) {
              var coinShort = coinName.split('-')[0];
              if (_this25.asyncUrl.search(coinName) > -1 && data[coinShort]) {
                data[coinShort] = [];
                cpBootstrap.loop(_this25.chart.series, function (series) {
                  if (series.userOptions.id === coinShort) series.update({ visible: false });
                });
              }
            });
          }
          return cpBootstrap.loop(Object.entries(data), function (value) {
            if (_this25.isExcluded(value[0])) return;
            return _this25.chart.get(value[0]) ? _this25.chart.get(value[0]).setData(value[1], false, false, false) : _this25.chart.addSeries({ id: value[0], data: value[1], showInNavigator: true });
          });
        case 'events':
          var promise = Promise.resolve();
          promise = promise.then(function () {
            return cpBootstrap.loop(_this25.chart.annotations.allItems, function (annotation) {
              return annotation.destroy();
            });
          });
          promise = promise.then(function () {
            return _this25.setAnnotationsObjects(data);
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
      var _this26 = this;

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
              color: _this26.getEventTagParams().color
            });
          });
          promise = promise.then(function () {
            return _this26.chart.addAnnotation({
              xValue: element.ts,
              y: 0,
              title: '<span title="Click to open" class="cp-chart-annotation__text">' + _this26.getEventTagParams(element.tag).label + '</span><span class="cp-chart-annotation__dataElement" style="display: none;">' + JSON.stringify(element) + '</span>',
              shape: {
                type: 'circle',
                params: {
                  r: 11,
                  cx: 9,
                  cy: 10.5,
                  'stroke-width': 1.5,
                  fill: _this26.getEventTagParams().color
                }
              },
              events: {
                mouseover: function mouseover(event) {
                  if (MobileDetect.isMobile()) return;
                  var data = _this26.getEventDataFromAnnotationEvent(event);
                  _this26.openEventContainer(data, event);
                },
                mouseout: function mouseout() {
                  if (MobileDetect.isMobile()) return;
                  _this26.closeEventContainer(event);
                },
                click: function click(event) {
                  var data = _this26.getEventDataFromAnnotationEvent(event);
                  if (MobileDetect.isMobile()) {
                    _this26.openEventContainer(data, event);
                  } else {
                    _this26.openEventPage(data);
                  }
                }
              }
            });
          });
          return promise;
        });
      });
      promise = promise.then(function () {
        return _this26.chart.series[0].xAxis.update({
          plotLines: plotLines
        }, false);
      });
      return promise;
    }
  }, {
    key: 'setNavigator',
    value: function setNavigator(options) {
      var _this27 = this;

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
                    document.dispatchEvent(new CustomEvent(_this27.id + 'SetExtremes', {
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
          _this27.navigatorExtremesListener();
          _this27.setResetZoomButton();
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
      var _this28 = this;

      // return Promise.resolve(); // cant be positioned properly in plotBox, so its disabled
      var promise = Promise.resolve();
      promise = promise.then(function () {
        return _this28.addContainer(_this28.id, 'ResetZoom', 'cp-chart-reset-zoom', 'button');
      });
      promise = promise.then(function () {
        return _this28.getContainer('ResetZoom');
      });
      promise = promise.then(function (element) {
        element.classList.add('uk-button');
        element.innerText = 'Reset zoom';
        return element.addEventListener('click', function () {
          _this28.chart.zoomOut();
        });
      });
      return promise;
    }
  }, {
    key: 'navigatorExtremesListener',
    value: function navigatorExtremesListener() {
      var _this29 = this;

      var promise = Promise.resolve();
      promise = promise.then(function () {
        return document.addEventListener(_this29.id + 'SetExtremes', function (e) {
          var minDate = cpBootstrap.round(e.detail.minDate / 1000, 0);
          var maxDate = cpBootstrap.round(e.detail.maxDate / 1000, 0);
          var promise = Promise.resolve();
          promise = promise.then(function () {
            return _this29.fetchDataPackage(minDate, maxDate);
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
      var _this30 = this;

      var result = obj;
      var promise = Promise.resolve();
      promise = promise.then(function () {
        return cpBootstrap.loop(Object.keys(newObj), function (key) {
          if (result.hasOwnProperty(key) && _typeof(result[key]) === 'object') {
            return _this30.updateObject(result[key], newObj[key]).then(function (updateResult) {
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
      var _this31 = this;

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
          return _this31.loop(arr, fn, ok, er, ++i);
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
      var _this32 = this;

      if (this.state[url]) return Promise.resolve(null);
      this.state[url] = 'pending';
      return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        document.body.appendChild(script);
        script.addEventListener('load', function () {
          if (_this32.state) _this32.state[url] = 'downloaded';
          resolve();
        });
        script.addEventListener('error', function () {
          if (_this32.state) delete _this32.state[url];
          reject(new Error('Failed to load image\'s URL: ' + url));
        });
        script.async = true;
        script.src = url;
      });
    }
  }, {
    key: 'fetchStyle',
    value: function fetchStyle(url) {
      var _this33 = this;

      if (this.state[url]) return Promise.resolve(null);
      this.state[url] = 'pending';
      return new Promise(function (resolve, reject) {
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        document.body.appendChild(link);
        link.setAttribute('href', url);
        link.addEventListener('load', function () {
          if (_this33.state) _this33.state[url] = 'downloaded';
          resolve();
        });
        link.addEventListener('error', function () {
          if (_this33.state) delete _this33.state[url];
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
      var _this34 = this;

      var promise = Promise.resolve();
      promise = promise.then(function () {
        if (fromState) {
          if (_this34.state[url] === 'pending') {
            var promiseTimeout = new Promise(function (resolve, reject) {
              setTimeout(function () {
                resolve(_this34.fetchData(url, fromState));
              }, 100);
            });
            return promiseTimeout;
          }
          if (!!_this34.state[url]) {
            return Promise.resolve(_this34.state[url].clone());
          }
        }
        var promiseFetch = Promise.resolve();
        promiseFetch = promiseFetch.then(function () {
          _this34.state[url] = 'pending';
          return fetch(url);
        });
        promiseFetch = promiseFetch.then(function (response) {
          _this34.state[url] = response;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7SUNBTSxpQjtBQUNKLCtCQUFjO0FBQUE7O0FBQ1osU0FBSyxPQUFMLEdBQWUsSUFBSSxZQUFKLEVBQWY7QUFDQSxTQUFLLElBQUw7QUFDRDs7OzsyQkFFSztBQUFBOztBQUNKLGFBQU8sS0FBSyxPQUFMLENBQWEsUUFBYixDQUFzQixVQUE3QixJQUEyQyxFQUEzQztBQUNBLGVBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDO0FBQUEsZUFBTSxNQUFLLFdBQUwsRUFBTjtBQUFBLE9BQTlDLEVBQXdFLEtBQXhFO0FBQ0EsYUFBTyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLFVBQXpDLEdBQXNELFlBQU07QUFDMUQsZUFBTyxNQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLElBQXpDLEdBQWdELEtBQWhEO0FBQ0EsY0FBSyxXQUFMO0FBQ0QsT0FIRDtBQUlEOzs7a0NBRVk7QUFBQTs7QUFDWCxVQUFJLENBQUMsT0FBTyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLElBQTlDLEVBQW1EO0FBQ2pELGVBQU8sS0FBSyxPQUFMLENBQWEsUUFBYixDQUFzQixVQUE3QixFQUF5QyxJQUF6QyxHQUFnRCxJQUFoRDtBQUNBLFlBQUksZUFBZSxNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsU0FBUyxzQkFBVCxDQUFnQyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFNBQXRELENBQTNCLENBQW5CO0FBQ0EsYUFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixZQUE1QjtBQUNBLGVBQU8sZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsWUFBTTtBQUN0QyxpQkFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixZQUE1QjtBQUNBLGVB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LENBQVcsR0FBWCxJQUFrQixRQUFsQjtBQUNBLGlCQUFPLFNBQVMsS0FBVCxFQUFQO0FBQ0QsU0FIYyxDQUFmO0FBSUEsZUFBTyxZQUFQO0FBQ0QsT0F4QlMsQ0FBVjtBQXlCQSxhQUFPLE9BQVA7QUFDRDs7Ozs7O0FBR0gsSUFBSSxpQkFBSjtBQUNBLElBQU0sY0FBYyxJQUFJLGNBQUosRUFBcEI7QUFDQSxJQUFNLGVBQWUsSUFBSSxVQUFKLEVBQXJCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY2xhc3Mgd2lkZ2V0c0NvbnRyb2xsZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLndpZGdldHMgPSBuZXcgd2lkZ2V0c0NsYXNzKCk7XG4gICAgdGhpcy5iaW5kKCk7XG4gIH1cbiAgXG4gIGJpbmQoKXtcbiAgICB3aW5kb3dbdGhpcy53aWRnZXRzLmRlZmF1bHRzLm9iamVjdE5hbWVdID0ge307XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHRoaXMuaW5pdFdpZGdldHMoKSwgZmFsc2UpO1xuICAgIHdpbmRvd1t0aGlzLndpZGdldHMuZGVmYXVsdHMub2JqZWN0TmFtZV0uYmluZFdpZGdldCA9ICgpID0+IHtcbiAgICAgIHdpbmRvd1t0aGlzLndpZGdldHMuZGVmYXVsdHMub2JqZWN0TmFtZV0uaW5pdCA9IGZhbHNlO1xuICAgICAgdGhpcy5pbml0V2lkZ2V0cygpO1xuICAgIH07XG4gIH1cbiAgXG4gIGluaXRXaWRnZXRzKCl7XG4gICAgaWYgKCF3aW5kb3dbdGhpcy53aWRnZXRzLmRlZmF1bHRzLm9iamVjdE5hbWVdLmluaXQpe1xuICAgICAgd2luZG93W3RoaXMud2lkZ2V0cy5kZWZhdWx0cy5vYmplY3ROYW1lXS5pbml0ID0gdHJ1ZTtcbiAgICAgIGxldCBtYWluRWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMud2lkZ2V0cy5kZWZhdWx0cy5jbGFzc05hbWUpKTtcbiAgICAgIHRoaXMud2lkZ2V0cy5zZXRXaWRnZXRDbGFzcyhtYWluRWxlbWVudHMpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgICAgdGhpcy53aWRnZXRzLnNldFdpZGdldENsYXNzKG1haW5FbGVtZW50cyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFpbkVsZW1lbnRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICB0aGlzLndpZGdldHMuc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKGkpO1xuICAgICAgICB9XG4gICAgICB9LCBmYWxzZSk7XG4gICAgICBsZXQgc2NyaXB0RWxlbWVudCA9IHRoaXMud2lkZ2V0cy5nZXRTY3JpcHRFbGVtZW50KCk7XG4gICAgICBpZiAoc2NyaXB0RWxlbWVudCAmJiBzY3JpcHRFbGVtZW50LmRhdGFzZXQgJiYgc2NyaXB0RWxlbWVudC5kYXRhc2V0LmNwQ3VycmVuY3lXaWRnZXQpe1xuICAgICAgICBsZXQgZGF0YXNldCA9IEpTT04ucGFyc2Uoc2NyaXB0RWxlbWVudC5kYXRhc2V0LmNwQ3VycmVuY3lXaWRnZXQpO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoZGF0YXNldCkpe1xuICAgICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMoZGF0YXNldCk7XG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBrZXlzLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICAgIGxldCBrZXkgPSBrZXlzW2pdLnJlcGxhY2UoJy0nLCAnXycpO1xuICAgICAgICAgICAgdGhpcy53aWRnZXRzLmRlZmF1bHRzW2tleV0gPSBkYXRhc2V0W2tleXNbal1dO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMud2lkZ2V0cy5zdGF0ZXMgPSBbXTtcbiAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AobWFpbkVsZW1lbnRzLCAoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgICBsZXQgbmV3U2V0dGluZ3MgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMud2lkZ2V0cy5kZWZhdWx0cykpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLmlzV29yZHByZXNzID0gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3dvcmRwcmVzcycpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLmlzTmlnaHRNb2RlID0gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NwLXdpZGdldF9fbmlnaHQtbW9kZScpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLm1haW5FbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgICB0aGlzLndpZGdldHMuc3RhdGVzLnB1c2gobmV3U2V0dGluZ3MpO1xuICAgICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBsZXQgY2hhcnRTY3JpcHRzID0gW1xuICAgICAgICAgICAgICAnLy9jb2RlLmhpZ2hjaGFydHMuY29tL3N0b2NrL2hpZ2hzdG9jay5qcycsXG4gICAgICAgICAgICAgICcvL2NvZGUuaGlnaGNoYXJ0cy5jb20vbW9kdWxlcy9leHBvcnRpbmcuanMnLFxuICAgICAgICAgICAgICAnLy9jb2RlLmhpZ2hjaGFydHMuY29tL21vZHVsZXMvbm8tZGF0YS10by1kaXNwbGF5LmpzJyxcbiAgICAgICAgICAgICAgJy8vaGlnaGNoYXJ0cy5naXRodWIuaW8vcGF0dGVybi1maWxsL3BhdHRlcm4tZmlsbC12Mi5qcycsXG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgcmV0dXJuIChuZXdTZXR0aW5ncy5tb2R1bGVzLmluZGV4T2YoJ2NoYXJ0JykgPiAtMSAmJiAhd2luZG93LkhpZ2hjaGFydHMpXG4gICAgICAgICAgICAgID8gY3BCb290c3RyYXAubG9vcChjaGFydFNjcmlwdHMsIGxpbmsgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZldGNoU2VydmljZS5mZXRjaFNjcmlwdChsaW5rKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICA6IG51bGw7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53aWRnZXRzLmluaXQoaW5kZXgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9KTtcbiAgICAgIH0sIDUwKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3Mgd2lkZ2V0c0NsYXNzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zdGF0ZXMgPSBbXTtcbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgb2JqZWN0TmFtZTogJ2NwQ3VycmVuY3lXaWRnZXRzJyxcbiAgICAgIGNsYXNzTmFtZTogJ2NvaW5wYXByaWthLWN1cnJlbmN5LXdpZGdldCcsXG4gICAgICBjc3NGaWxlTmFtZTogJ3dpZGdldC5taW4uY3NzJyxcbiAgICAgIGN1cnJlbmN5OiAnYnRjLWJpdGNvaW4nLFxuICAgICAgcHJpbWFyeV9jdXJyZW5jeTogJ1VTRCcsXG4gICAgICByYW5nZV9saXN0OiBbJzI0aCcsICc3ZCcsICczMGQnLCAnMXEnLCAnMXknLCAneXRkJywgJ2FsbCddLFxuICAgICAgcmFuZ2U6ICc3ZCcsXG4gICAgICBtb2R1bGVzOiBbJ21hcmtldF9kZXRhaWxzJywgJ2NoYXJ0J10sXG4gICAgICB1cGRhdGVfYWN0aXZlOiBmYWxzZSxcbiAgICAgIHVwZGF0ZV90aW1lb3V0OiAnMzBzJyxcbiAgICAgIGxhbmd1YWdlOiAnZW4nLFxuICAgICAgc3R5bGVfc3JjOiBudWxsLFxuICAgICAgaW1nX3NyYzogbnVsbCxcbiAgICAgIGxhbmdfc3JjOiBudWxsLFxuICAgICAgb3JpZ2luX3NyYzogJ2h0dHBzOi8vdW5wa2cuY29tL0Bjb2lucGFwcmlrYS93aWRnZXQtY3VycmVuY3knLFxuICAgICAgc2hvd19kZXRhaWxzX2N1cnJlbmN5OiBmYWxzZSxcbiAgICAgIHRpY2tlcjoge1xuICAgICAgICBuYW1lOiB1bmRlZmluZWQsXG4gICAgICAgIHN5bWJvbDogdW5kZWZpbmVkLFxuICAgICAgICBwcmljZTogdW5kZWZpbmVkLFxuICAgICAgICBwcmljZV9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgICAgIHJhbms6IHVuZGVmaW5lZCxcbiAgICAgICAgcHJpY2VfYXRoOiB1bmRlZmluZWQsXG4gICAgICAgIHZvbHVtZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgICAgbWFya2V0X2NhcDogdW5kZWZpbmVkLFxuICAgICAgICBwZXJjZW50X2Zyb21fcHJpY2VfYXRoOiB1bmRlZmluZWQsXG4gICAgICAgIHZvbHVtZV8yNGhfY2hhbmdlXzI0aDogdW5kZWZpbmVkLFxuICAgICAgICBtYXJrZXRfY2FwX2NoYW5nZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgICBpbnRlcnZhbDogbnVsbCxcbiAgICAgIGlzV29yZHByZXNzOiBmYWxzZSxcbiAgICAgIGlzTmlnaHRNb2RlOiBmYWxzZSxcbiAgICAgIGlzRGF0YTogZmFsc2UsXG4gICAgICBhdmFpbGFibGVNb2R1bGVzOiBbJ3ByaWNlJywgJ2NoYXJ0JywgJ21hcmtldF9kZXRhaWxzJ10sXG4gICAgICBtZXNzYWdlOiAnZGF0YV9sb2FkaW5nJyxcbiAgICAgIHRyYW5zbGF0aW9uczoge30sXG4gICAgICBtYWluRWxlbWVudDogbnVsbCxcbiAgICAgIG5vVHJhbnNsYXRpb25MYWJlbHM6IFtdLFxuICAgICAgc2NyaXB0c0Rvd25sb2FkZWQ6IHt9LFxuICAgICAgY2hhcnQ6IG51bGwsXG4gICAgICByd2Q6IHtcbiAgICAgICAgeHM6IDI4MCxcbiAgICAgICAgczogMzIwLFxuICAgICAgICBtOiAzNzAsXG4gICAgICAgIGw6IDQ2MixcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuICBcbiAgaW5pdChpbmRleCkge1xuICAgIGlmICghdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCkpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKCdCaW5kIGZhaWxlZCwgbm8gZWxlbWVudCB3aXRoIGNsYXNzID0gXCInICsgdGhpcy5kZWZhdWx0cy5jbGFzc05hbWUgKyAnXCInKTtcbiAgICB9XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdldERlZmF1bHRzKGluZGV4KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnNldE9yaWdpbkxpbmsoaW5kZXgpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBzZXRXaWRnZXRDbGFzcyhlbGVtZW50cykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCB3aWR0aCA9IGVsZW1lbnRzW2ldLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgbGV0IHJ3ZEtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmRlZmF1bHRzLnJ3ZCk7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHJ3ZEtleXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgbGV0IHJ3ZEtleSA9IHJ3ZEtleXNbal07XG4gICAgICAgIGxldCByd2RQYXJhbSA9IHRoaXMuZGVmYXVsdHMucndkW3J3ZEtleV07XG4gICAgICAgIGxldCBjbGFzc05hbWUgPSB0aGlzLmRlZmF1bHRzLmNsYXNzTmFtZSArICdfXycgKyByd2RLZXk7XG4gICAgICAgIGlmICh3aWR0aCA8PSByd2RQYXJhbSkgZWxlbWVudHNbaV0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICBpZiAod2lkdGggPiByd2RQYXJhbSkgZWxlbWVudHNbaV0uY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgZ2V0TWFpbkVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gKHRoaXMuc3RhdGVzW2luZGV4XSkgPyB0aGlzLnN0YXRlc1tpbmRleF0ubWFpbkVsZW1lbnQgOiBudWxsO1xuICB9XG4gIFxuICBnZXREZWZhdWx0cyhpbmRleCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgaWYgKG1haW5FbGVtZW50ICYmIG1haW5FbGVtZW50LmRhdGFzZXQpIHtcbiAgICAgICAgaWYgKCFtYWluRWxlbWVudC5kYXRhc2V0Lm1vZHVsZXMgJiYgbWFpbkVsZW1lbnQuZGF0YXNldC52ZXJzaW9uID09PSAnZXh0ZW5kZWQnKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdtb2R1bGVzJywgWydtYXJrZXRfZGV0YWlscyddKTtcbiAgICAgICAgaWYgKCFtYWluRWxlbWVudC5kYXRhc2V0Lm1vZHVsZXMgJiYgbWFpbkVsZW1lbnQuZGF0YXNldC52ZXJzaW9uID09PSAnc3RhbmRhcmQnKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdtb2R1bGVzJywgW10pO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5tb2R1bGVzKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdtb2R1bGVzJywgSlNPTi5wYXJzZShtYWluRWxlbWVudC5kYXRhc2V0Lm1vZHVsZXMpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQucHJpbWFyeUN1cnJlbmN5KSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdwcmltYXJ5X2N1cnJlbmN5JywgbWFpbkVsZW1lbnQuZGF0YXNldC5wcmltYXJ5Q3VycmVuY3kpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5jdXJyZW5jeSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnY3VycmVuY3knLCBtYWluRWxlbWVudC5kYXRhc2V0LmN1cnJlbmN5KTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQucmFuZ2UpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3JhbmdlJywgbWFpbkVsZW1lbnQuZGF0YXNldC5yYW5nZSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnNob3dEZXRhaWxzQ3VycmVuY3kpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3Nob3dfZGV0YWlsc19jdXJyZW5jeScsIChtYWluRWxlbWVudC5kYXRhc2V0LnNob3dEZXRhaWxzQ3VycmVuY3kgPT09ICd0cnVlJykpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVBY3RpdmUpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3VwZGF0ZV9hY3RpdmUnLCAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVBY3RpdmUgPT09ICd0cnVlJykpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVUaW1lb3V0KSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICd1cGRhdGVfdGltZW91dCcsIGNwQm9vdHN0cmFwLnBhcnNlSW50ZXJ2YWxWYWx1ZShtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZVRpbWVvdXQpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ3VhZ2UpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2xhbmd1YWdlJywgbWFpbkVsZW1lbnQuZGF0YXNldC5sYW5ndWFnZSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lm9yaWdpblNyYykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnb3JpZ2luX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQub3JpZ2luU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubm9kZU1vZHVsZXNTcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ25vZGVfbW9kdWxlc19zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0Lm5vZGVNb2R1bGVzU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuYm93ZXJTcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2Jvd2VyX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQuYm93ZXJTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5zdHlsZVNyYykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnc3R5bGVfc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5zdHlsZVNyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmxhbmdTcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2xvZ29fc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5sYW5nU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuaW1nU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdsb2dvX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQuaW1nU3JjKTtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgfSk7XG4gIH1cbiAgXG4gIHNldE9yaWdpbkxpbmsoaW5kZXgpIHtcbiAgICBpZiAoT2JqZWN0LmtleXModGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnMpLmxlbmd0aCA9PT0gMCkgdGhpcy5nZXRUcmFuc2xhdGlvbnModGhpcy5kZWZhdWx0cy5sYW5ndWFnZSk7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnN0eWxlc2hlZXQoKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmFkZFdpZGdldEVsZW1lbnQoaW5kZXgpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaW5pdEludGVydmFsKGluZGV4KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgYWRkV2lkZ2V0RWxlbWVudChpbmRleCkge1xuICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgIGxldCBtb2R1bGVzID0gJyc7XG4gICAgbGV0IG1vZHVsZXNBcnJheSA9IFtdO1xuICAgIGxldCBjaGFydENvbnRhaW5lciA9IG51bGw7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKHRoaXMuZGVmYXVsdHMuYXZhaWxhYmxlTW9kdWxlcywgbW9kdWxlID0+IHtcbiAgICAgICAgcmV0dXJuICh0aGlzLnN0YXRlc1tpbmRleF0ubW9kdWxlcy5pbmRleE9mKG1vZHVsZSkgPiAtMSkgPyBtb2R1bGVzQXJyYXkucHVzaChtb2R1bGUpIDogbnVsbDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AobW9kdWxlc0FycmF5LCBtb2R1bGUgPT4ge1xuICAgICAgICBsZXQgbGFiZWwgPSBudWxsO1xuICAgICAgICBpZiAobW9kdWxlID09PSAnY2hhcnQnKSBsYWJlbCA9ICdDaGFydCc7XG4gICAgICAgIGlmIChtb2R1bGUgPT09ICdtYXJrZXRfZGV0YWlscycpIGxhYmVsID0gJ01hcmtldERldGFpbHMnO1xuICAgICAgICByZXR1cm4gKGxhYmVsKSA/IHRoaXNbYHdpZGdldCR7IGxhYmVsIH1FbGVtZW50YF0oaW5kZXgpLnRoZW4ocmVzdWx0ID0+IG1vZHVsZXMgKz0gcmVzdWx0KSA6IG51bGw7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBtYWluRWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLndpZGdldE1haW5FbGVtZW50KGluZGV4KSArIG1vZHVsZXMgKyB0aGlzLndpZGdldEZvb3RlcihpbmRleCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBjaGFydENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAkeyB0aGlzLmRlZmF1bHRzLmNsYXNzTmFtZSB9LXByaWNlLWNoYXJ0LSR7IGluZGV4IH1gKTtcbiAgICAgIHJldHVybiAoY2hhcnRDb250YWluZXIpID8gY2hhcnRDb250YWluZXIucGFyZW50RWxlbWVudC5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIHRoaXMud2lkZ2V0U2VsZWN0RWxlbWVudChpbmRleCwgJ3JhbmdlJykpIDogbnVsbDtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGlmIChjaGFydENvbnRhaW5lcil7XG4gICAgICAgIHRoaXMuc3RhdGVzW2luZGV4XS5jaGFydCA9IG5ldyBjaGFydENsYXNzKGNoYXJ0Q29udGFpbmVyLCB0aGlzLnN0YXRlc1tpbmRleF0pO1xuICAgICAgICB0aGlzLnNldFNlbGVjdExpc3RlbmVycyhpbmRleCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgICBcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnNldEJlZm9yZUVsZW1lbnRJbkZvb3RlcihpbmRleCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5nZXREYXRhKGluZGV4KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgc2V0U2VsZWN0TGlzdGVuZXJzKGluZGV4KXtcbiAgICBsZXQgbWFpbkVsZW1lbnQgPSB0aGlzLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICBsZXQgc2VsZWN0RWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0LXNlbGVjdCcpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0RWxlbWVudHMubGVuZ3RoOyBpKyspe1xuICAgICAgbGV0IGJ1dHRvbnMgPSBzZWxlY3RFbGVtZW50c1tpXS5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0LXNlbGVjdF9fb3B0aW9ucyBidXR0b24nKTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYnV0dG9ucy5sZW5ndGg7IGorKyl7XG4gICAgICAgIGJ1dHRvbnNbal0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFNlbGVjdE9wdGlvbihldmVudCwgaW5kZXgpO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICBzZXRTZWxlY3RPcHRpb24oZXZlbnQsIGluZGV4KXtcbiAgICBsZXQgY2xhc3NOYW1lID0gJ2NwLXdpZGdldC1hY3RpdmUnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKyl7XG4gICAgICBsZXQgc2libGluZyA9IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmNoaWxkTm9kZXNbaV07XG4gICAgICBpZiAoc2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkgc2libGluZy5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgfVxuICAgIGxldCBwYXJlbnQgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLmNwLXdpZGdldC1zZWxlY3QnKTtcbiAgICBsZXQgdHlwZSA9IHBhcmVudC5kYXRhc2V0LnR5cGU7XG4gICAgbGV0IHBpY2tlZFZhbHVlRWxlbWVudCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuY3Atd2lkZ2V0LXNlbGVjdF9fb3B0aW9ucyA+IHNwYW4nKTtcbiAgICBsZXQgdmFsdWUgPSBldmVudC50YXJnZXQuZGF0YXNldC5vcHRpb247XG4gICAgcGlja2VkVmFsdWVFbGVtZW50LmlubmVyVGV4dCA9IHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIHZhbHVlLnRvTG93ZXJDYXNlKCkpO1xuICAgIHRoaXMudXBkYXRlRGF0YShpbmRleCwgdHlwZSwgdmFsdWUpO1xuICAgIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgdGhpcy5kaXNwYXRjaEV2ZW50KGluZGV4LCAnLXN3aXRjaC1yYW5nZScsIHZhbHVlKTtcbiAgfVxuICBcbiAgZGlzcGF0Y2hFdmVudChpbmRleCwgbmFtZSwgZGF0YSl7XG4gICAgbGV0IGlkID0gYCR7IHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lIH0tcHJpY2UtY2hhcnQtJHsgaW5kZXggfWA7XG4gICAgcmV0dXJuIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGAke2lkfSR7bmFtZX1gLCB7IGRldGFpbDogeyBkYXRhIH0gfSkpO1xuICB9XG4gIFxuICBnZXREYXRhKGluZGV4KSB7XG4gICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vYXBpLmNvaW5wYXByaWthLmNvbS92MS93aWRnZXQvJyArIHRoaXMuc3RhdGVzW2luZGV4XS5jdXJyZW5jeSArICc/cXVvdGU9JyArIHRoaXMuc3RhdGVzW2luZGV4XS5wcmltYXJ5X2N1cnJlbmN5O1xuICAgIHJldHVybiBmZXRjaFNlcnZpY2UuZmV0Y2hEYXRhKHVybCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGVzW2luZGV4XS5pc0RhdGEpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2lzRGF0YScsIHRydWUpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRpY2tlcihpbmRleCwgcmVzdWx0KTtcbiAgICAgIH0pXG4gICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMub25FcnJvclJlcXVlc3QoaW5kZXgsIGVycm9yKTtcbiAgICB9KTtcbiAgfVxuICBcbiAgb25FcnJvclJlcXVlc3QoaW5kZXgsIHhocikge1xuICAgIGlmICh0aGlzLnN0YXRlc1tpbmRleF0uaXNEYXRhKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdpc0RhdGEnLCBmYWxzZSk7XG4gICAgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbWVzc2FnZScsICdkYXRhX3VuYXZhaWxhYmxlJyk7XG4gICAgY29uc29sZS5lcnJvcignUmVxdWVzdCBmYWlsZWQuICBSZXR1cm5lZCBzdGF0dXMgb2YgJyArIHhociwgdGhpcy5zdGF0ZXNbaW5kZXhdKTtcbiAgfVxuICBcbiAgaW5pdEludGVydmFsKGluZGV4KSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLnN0YXRlc1tpbmRleF0uaW50ZXJ2YWwpO1xuICAgIGlmICh0aGlzLnN0YXRlc1tpbmRleF0udXBkYXRlX2FjdGl2ZSAmJiB0aGlzLnN0YXRlc1tpbmRleF0udXBkYXRlX3RpbWVvdXQgPiAxMDAwKSB7XG4gICAgICB0aGlzLnN0YXRlc1tpbmRleF0uaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIHRoaXMuZ2V0RGF0YShpbmRleCk7XG4gICAgICB9LCB0aGlzLnN0YXRlc1tpbmRleF0udXBkYXRlX3RpbWVvdXQpO1xuICAgIH1cbiAgfVxuICBcbiAgc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKGluZGV4KSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlc1tpbmRleF0uaXNXb3JkcHJlc3MpIHtcbiAgICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgaWYgKG1haW5FbGVtZW50KSB7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5jaGlsZHJlblswXS5sb2NhbE5hbWUgPT09ICdzdHlsZScpIHtcbiAgICAgICAgICBtYWluRWxlbWVudC5yZW1vdmVDaGlsZChtYWluRWxlbWVudC5jaGlsZE5vZGVzWzBdKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZm9vdGVyRWxlbWVudCA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jcC13aWRnZXRfX2Zvb3RlcicpO1xuICAgICAgICBsZXQgdmFsdWUgPSBmb290ZXJFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gNDM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZm9vdGVyRWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFsdWUgLT0gZm9vdGVyRWxlbWVudC5jaGlsZE5vZGVzW2ldLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHN0eWxlLmlubmVySFRNTCA9ICcuY3Atd2lkZ2V0X19mb290ZXItLScgKyBpbmRleCArICc6OmJlZm9yZXt3aWR0aDonICsgdmFsdWUudG9GaXhlZCgwKSArICdweDt9JztcbiAgICAgICAgbWFpbkVsZW1lbnQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBtYWluRWxlbWVudC5jaGlsZHJlblswXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICB1cGRhdGVXaWRnZXRFbGVtZW50KGluZGV4LCBrZXksIHZhbHVlLCB0aWNrZXIpIHtcbiAgICBsZXQgc3RhdGUgPSB0aGlzLnN0YXRlc1tpbmRleF07XG4gICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgaWYgKG1haW5FbGVtZW50KSB7XG4gICAgICBsZXQgdGlja2VyQ2xhc3MgPSAodGlja2VyKSA/ICdUaWNrZXInIDogJyc7XG4gICAgICBpZiAoa2V5ID09PSAnbmFtZScgfHwga2V5ID09PSAnY3VycmVuY3knKSB7XG4gICAgICAgIGlmIChrZXkgPT09ICdjdXJyZW5jeScpIHtcbiAgICAgICAgICBsZXQgYUVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNwLXdpZGdldF9fZm9vdGVyID4gYScpO1xuICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYUVsZW1lbnRzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICBhRWxlbWVudHNba10uaHJlZiA9IHRoaXMuY29pbl9saW5rKHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nZXRJbWFnZShpbmRleCk7XG4gICAgICB9XG4gICAgICBpZiAoa2V5ID09PSAnaXNEYXRhJyB8fCBrZXkgPT09ICdtZXNzYWdlJykge1xuICAgICAgICBsZXQgaGVhZGVyRWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0X19tYWluJyk7XG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgaGVhZGVyRWxlbWVudHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICBoZWFkZXJFbGVtZW50c1trXS5pbm5lckhUTUwgPSAoIXN0YXRlLmlzRGF0YSkgPyB0aGlzLndpZGdldE1haW5FbGVtZW50TWVzc2FnZShpbmRleCkgOiB0aGlzLndpZGdldE1haW5FbGVtZW50RGF0YShpbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB1cGRhdGVFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsga2V5ICsgdGlja2VyQ2xhc3MpO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHVwZGF0ZUVsZW1lbnRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgbGV0IHVwZGF0ZUVsZW1lbnQgPSB1cGRhdGVFbGVtZW50c1tqXTtcbiAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NwLXdpZGdldF9fcmFuaycpKSB7XG4gICAgICAgICAgICBsZXQgY2xhc3NOYW1lID0gKHBhcnNlRmxvYXQodmFsdWUpID4gMCkgPyBcImNwLXdpZGdldF9fcmFuay11cFwiIDogKChwYXJzZUZsb2F0KHZhbHVlKSA8IDApID8gXCJjcC13aWRnZXRfX3JhbmstZG93blwiIDogXCJjcC13aWRnZXRfX3JhbmstbmV1dHJhbFwiKTtcbiAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLWRvd24nKTtcbiAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLXVwJyk7XG4gICAgICAgICAgICB1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9fcmFuay1uZXV0cmFsJyk7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IGNwQm9vdHN0cmFwLmVtcHR5RGF0YTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICAgICAgICB2YWx1ZSA9IChrZXkgPT09ICdwcmljZV9jaGFuZ2VfMjRoJykgPyAnKCcgKyBjcEJvb3RzdHJhcC5yb3VuZCh2YWx1ZSwgMikgKyAnJSknIDogY3BCb290c3RyYXAucm91bmQodmFsdWUsIDIpICsgJyUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3dEZXRhaWxzQ3VycmVuY3knKSAmJiAhc3RhdGUuc2hvd19kZXRhaWxzX2N1cnJlbmN5KSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICcgJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwYXJzZU51bWJlcicpKSB7XG4gICAgICAgICAgICB1cGRhdGVFbGVtZW50LmlubmVyVGV4dCA9IGNwQm9vdHN0cmFwLnBhcnNlTnVtYmVyKHZhbHVlKSB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuaW5uZXJUZXh0ID0gdmFsdWUgfHwgY3BCb290c3RyYXAuZW1wdHlEYXRhO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgdXBkYXRlRGF0YShpbmRleCwga2V5LCB2YWx1ZSwgdGlja2VyKSB7XG4gICAgaWYgKHRpY2tlcikge1xuICAgICAgdGhpcy5zdGF0ZXNbaW5kZXhdLnRpY2tlcltrZXldID0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdGVzW2luZGV4XVtrZXldID0gdmFsdWU7XG4gICAgfVxuICAgIGlmIChrZXkgPT09ICdsYW5ndWFnZScpIHtcbiAgICAgIHRoaXMuZ2V0VHJhbnNsYXRpb25zKHZhbHVlKTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVXaWRnZXRFbGVtZW50KGluZGV4LCBrZXksIHZhbHVlLCB0aWNrZXIpO1xuICB9XG4gIFxuICB1cGRhdGVXaWRnZXRUcmFuc2xhdGlvbnMobGFuZywgZGF0YSkge1xuICAgIHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddID0gZGF0YTtcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuc3RhdGVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICBsZXQgaXNOb1RyYW5zbGF0aW9uTGFiZWxzVXBkYXRlID0gdGhpcy5zdGF0ZXNbeF0ubm9UcmFuc2xhdGlvbkxhYmVscy5sZW5ndGggPiAwICYmIGxhbmcgPT09ICdlbic7XG4gICAgICBpZiAodGhpcy5zdGF0ZXNbeF0ubGFuZ3VhZ2UgPT09IGxhbmcgfHwgaXNOb1RyYW5zbGF0aW9uTGFiZWxzVXBkYXRlKSB7XG4gICAgICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuc3RhdGVzW3hdLm1haW5FbGVtZW50O1xuICAgICAgICBsZXQgdHJhbnNhbHRlRWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3AtdHJhbnNsYXRpb24nKSk7XG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdHJhbnNhbHRlRWxlbWVudHMubGVuZ3RoOyB5KyspIHtcbiAgICAgICAgICB0cmFuc2FsdGVFbGVtZW50c1t5XS5jbGFzc0xpc3QuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoY2xhc3NOYW1lLnNlYXJjaCgndHJhbnNsYXRpb25fJykgPiAtMSkge1xuICAgICAgICAgICAgICBsZXQgdHJhbnNsYXRlS2V5ID0gY2xhc3NOYW1lLnJlcGxhY2UoJ3RyYW5zbGF0aW9uXycsICcnKTtcbiAgICAgICAgICAgICAgaWYgKHRyYW5zbGF0ZUtleSA9PT0gJ21lc3NhZ2UnKSB0cmFuc2xhdGVLZXkgPSB0aGlzLnN0YXRlc1t4XS5tZXNzYWdlO1xuICAgICAgICAgICAgICBsZXQgbGFiZWxJbmRleCA9IHRoaXMuc3RhdGVzW3hdLm5vVHJhbnNsYXRpb25MYWJlbHMuaW5kZXhPZih0cmFuc2xhdGVLZXkpO1xuICAgICAgICAgICAgICBsZXQgdGV4dCA9IHRoaXMuZ2V0VHJhbnNsYXRpb24oeCwgdHJhbnNsYXRlS2V5KTtcbiAgICAgICAgICAgICAgaWYgKGxhYmVsSW5kZXggPiAtMSAmJiB0ZXh0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZXNbeF0ubm9UcmFuc2xhdGlvbkxhYmVscy5zcGxpY2UobGFiZWxJbmRleCwgMSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0cmFuc2FsdGVFbGVtZW50c1t5XS5pbm5lclRleHQgPSB0ZXh0O1xuICAgICAgICAgICAgICBpZiAodHJhbnNhbHRlRWxlbWVudHNbeV0uY2xvc2VzdCgnLmNwLXdpZGdldF9fZm9vdGVyJykpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKHgpLCA1MCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICB1cGRhdGVUaWNrZXIoaW5kZXgsIGRhdGEpIHtcbiAgICBsZXQgZGF0YUtleXMgPSBPYmplY3Qua2V5cyhkYXRhKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsIGRhdGFLZXlzW2ldLCBkYXRhW2RhdGFLZXlzW2ldXSwgdHJ1ZSk7XG4gICAgfVxuICB9XG4gIFxuICBzdHlsZXNoZWV0KCkge1xuICAgIGlmICh0aGlzLmRlZmF1bHRzLnN0eWxlX3NyYyAhPT0gZmFsc2UpIHtcbiAgICAgIGxldCB1cmwgPSB0aGlzLmRlZmF1bHRzLnN0eWxlX3NyYyB8fCB0aGlzLmRlZmF1bHRzLm9yaWdpbl9zcmMgKyAnL2Rpc3QvJyArIHRoaXMuZGVmYXVsdHMuY3NzRmlsZU5hbWU7XG4gICAgICBpZiAoIWRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignbGlua1tocmVmPVwiJyArIHVybCArICdcIl0nKSl7XG4gICAgICAgIHJldHVybiBmZXRjaFNlcnZpY2UuZmV0Y2hTdHlsZSh1cmwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cbiAgXG4gIHdpZGdldE1haW5FbGVtZW50KGluZGV4KSB7XG4gICAgbGV0IGRhdGEgPSB0aGlzLnN0YXRlc1tpbmRleF07XG4gICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19oZWFkZXJcIj4nICtcbiAgICAgICc8ZGl2IGNsYXNzPVwiJyArICdjcC13aWRnZXRfX2ltZyBjcC13aWRnZXRfX2ltZy0nICsgZGF0YS5jdXJyZW5jeSArICdcIj4nICtcbiAgICAgICc8aW1nLz4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19tYWluXCI+JyArXG4gICAgICAoKGRhdGEuaXNEYXRhKSA/IHRoaXMud2lkZ2V0TWFpbkVsZW1lbnREYXRhKGluZGV4KSA6IHRoaXMud2lkZ2V0TWFpbkVsZW1lbnRNZXNzYWdlKGluZGV4KSkgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzwvZGl2Pic7XG4gIH1cbiAgXG4gIHdpZGdldE1haW5FbGVtZW50RGF0YShpbmRleCkge1xuICAgIGxldCBkYXRhID0gdGhpcy5zdGF0ZXNbaW5kZXhdO1xuICAgIHJldHVybiAnPGgzPjxhIGhyZWY9XCInICsgdGhpcy5jb2luX2xpbmsoZGF0YS5jdXJyZW5jeSkgKyAnXCI+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJuYW1lVGlja2VyXCI+JyArIChkYXRhLnRpY2tlci5uYW1lIHx8IGNwQm9vdHN0cmFwLmVtcHR5RGF0YSkgKyAnPC9zcGFuPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwic3ltYm9sVGlja2VyXCI+JyArIChkYXRhLnRpY2tlci5zeW1ib2wgfHwgY3BCb290c3RyYXAuZW1wdHlEYXRhKSArICc8L3NwYW4+JyArXG4gICAgICAnPC9hPjwvaDM+JyArXG4gICAgICAnPHN0cm9uZz4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInByaWNlVGlja2VyIHBhcnNlTnVtYmVyXCI+JyArIChjcEJvb3RzdHJhcC5wYXJzZU51bWJlcihkYXRhLnRpY2tlci5wcmljZSkgfHwgY3BCb290c3RyYXAuZW1wdHlEYXRhKSArICc8L3NwYW4+ICcgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwicHJpbWFyeUN1cnJlbmN5XCI+JyArIGRhdGEucHJpbWFyeV9jdXJyZW5jeSArICcgPC9zcGFuPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwicHJpY2VfY2hhbmdlXzI0aFRpY2tlciBjcC13aWRnZXRfX3JhbmsgY3Atd2lkZ2V0X19yYW5rLScgKyAoKGRhdGEudGlja2VyLnByaWNlX2NoYW5nZV8yNGggPiAwKSA/IFwidXBcIiA6ICgoZGF0YS50aWNrZXIucHJpY2VfY2hhbmdlXzI0aCA8IDApID8gXCJkb3duXCIgOiBcIm5ldXRyYWxcIikpICsgJ1wiPignICsgKGNwQm9vdHN0cmFwLnJvdW5kKGRhdGEudGlja2VyLnByaWNlX2NoYW5nZV8yNGgsIDIpIHx8IGNwQm9vdHN0cmFwLmVtcHR5VmFsdWUpICsgJyUpPC9zcGFuPicgK1xuICAgICAgJzwvc3Ryb25nPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0X19yYW5rLWxhYmVsXCI+PHNwYW4gY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9yYW5rXCI+JyArIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwicmFua1wiKSArICc8L3NwYW4+IDxzcGFuIGNsYXNzPVwicmFua1RpY2tlclwiPicgKyAoZGF0YS50aWNrZXIucmFuayB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGEpICsgJzwvc3Bhbj48L3NwYW4+JztcbiAgfVxuICBcbiAgd2lkZ2V0TWFpbkVsZW1lbnRNZXNzYWdlKGluZGV4KSB7XG4gICAgbGV0IG1lc3NhZ2UgPSB0aGlzLnN0YXRlc1tpbmRleF0ubWVzc2FnZTtcbiAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX21haW4tbm8tZGF0YSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9tZXNzYWdlXCI+JyArICh0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBtZXNzYWdlKSkgKyAnPC9kaXY+JztcbiAgfVxuICBcbiAgd2lkZ2V0TWFya2V0RGV0YWlsc0VsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCh0aGlzLnN0YXRlc1tpbmRleF0ubW9kdWxlcy5pbmRleE9mKCdtYXJrZXRfZGV0YWlscycpID4gLTEpID8gJzxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX2RldGFpbHNcIj4nICtcbiAgICAgIHRoaXMud2lkZ2V0QXRoRWxlbWVudChpbmRleCkgK1xuICAgICAgdGhpcy53aWRnZXRWb2x1bWUyNGhFbGVtZW50KGluZGV4KSArXG4gICAgICB0aGlzLndpZGdldE1hcmtldENhcEVsZW1lbnQoaW5kZXgpICtcbiAgICAgICc8L2Rpdj4nIDogJycpO1xuICB9XG4gIFxuICB3aWRnZXRBdGhFbGVtZW50KGluZGV4KSB7XG4gICAgcmV0dXJuICc8ZGl2PicgK1xuICAgICAgJzxzbWFsbCBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX2F0aFwiPicgKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcImF0aFwiKSArICc8L3NtYWxsPicgK1xuICAgICAgJzxkaXY+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJwcmljZV9hdGhUaWNrZXIgcGFyc2VOdW1iZXJcIj4nICsgY3BCb290c3RyYXAuZW1wdHlEYXRhICsgJyA8L3NwYW4+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzeW1ib2xUaWNrZXIgc2hvd0RldGFpbHNDdXJyZW5jeVwiPjwvc3Bhbj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInBlcmNlbnRfZnJvbV9wcmljZV9hdGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rXCI+JyArIGNwQm9vdHN0cmFwLmVtcHR5RGF0YSArICc8L3NwYW4+JyArXG4gICAgICAnPC9kaXY+J1xuICB9XG4gIFxuICB3aWRnZXRWb2x1bWUyNGhFbGVtZW50KGluZGV4KSB7XG4gICAgcmV0dXJuICc8ZGl2PicgK1xuICAgICAgJzxzbWFsbCBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX3ZvbHVtZV8yNGhcIj4nICsgdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJ2b2x1bWVfMjRoXCIpICsgJzwvc21hbGw+JyArXG4gICAgICAnPGRpdj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInZvbHVtZV8yNGhUaWNrZXIgcGFyc2VOdW1iZXJcIj4nICsgY3BCb290c3RyYXAuZW1wdHlEYXRhICsgJyA8L3NwYW4+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzeW1ib2xUaWNrZXIgc2hvd0RldGFpbHNDdXJyZW5jeVwiPjwvc3Bhbj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInZvbHVtZV8yNGhfY2hhbmdlXzI0aFRpY2tlciBjcC13aWRnZXRfX3JhbmtcIj4nICsgY3BCb290c3RyYXAuZW1wdHlEYXRhICsgJzwvc3Bhbj4nICtcbiAgICAgICc8L2Rpdj4nO1xuICB9XG4gIFxuICB3aWRnZXRNYXJrZXRDYXBFbGVtZW50KGluZGV4KSB7XG4gICAgcmV0dXJuICc8ZGl2PicgK1xuICAgICAgJzxzbWFsbCBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX21hcmtldF9jYXBcIj4nICsgdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJtYXJrZXRfY2FwXCIpICsgJzwvc21hbGw+JyArXG4gICAgICAnPGRpdj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cIm1hcmtldF9jYXBUaWNrZXIgcGFyc2VOdW1iZXJcIj4nICsgY3BCb290c3RyYXAuZW1wdHlEYXRhICsgJyA8L3NwYW4+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzeW1ib2xUaWNrZXIgc2hvd0RldGFpbHNDdXJyZW5jeVwiPjwvc3Bhbj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cIm1hcmtldF9jYXBfY2hhbmdlXzI0aFRpY2tlciBjcC13aWRnZXRfX3JhbmtcIj4nICsgY3BCb290c3RyYXAuZW1wdHlEYXRhICsgJzwvc3Bhbj4nICtcbiAgICAgICc8L2Rpdj4nO1xuICB9XG4gIFxuICB3aWRnZXRDaGFydEVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFxuICAgICAgYDxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX2NoYXJ0XCI+PGRpdiBpZD1cIiR7IHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lIH0tcHJpY2UtY2hhcnQtJHsgaW5kZXggfVwiPjwvZGl2PjwvZGl2PmBcbiAgICApO1xuICB9XG4gIFxuICB3aWRnZXRTZWxlY3RFbGVtZW50KGluZGV4LCBsYWJlbCl7XG4gICAgbGV0IGJ1dHRvbnMgPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3RhdGVzW2luZGV4XVtsYWJlbCsnX2xpc3QnXS5sZW5ndGg7IGkrKyl7XG4gICAgICBsZXQgZGF0YSA9IHRoaXMuc3RhdGVzW2luZGV4XVtsYWJlbCsnX2xpc3QnXVtpXTtcbiAgICAgIGJ1dHRvbnMgKz0gJzxidXR0b24gY2xhc3M9XCInKyAoKGRhdGEudG9Mb3dlckNhc2UoKSA9PT0gdGhpcy5zdGF0ZXNbaW5kZXhdW2xhYmVsXS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICA/ICdjcC13aWRnZXQtYWN0aXZlICdcbiAgICAgICAgOiAnJykgKyAoKGxhYmVsID09PSAncHJpbWFyeV9jdXJyZW5jeScpID8gJycgOiAnY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fJyArIGRhdGEudG9Mb3dlckNhc2UoKSkgKydcIiBkYXRhLW9wdGlvbj1cIicrZGF0YSsnXCI+Jyt0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBkYXRhLnRvTG93ZXJDYXNlKCkpKyc8L2J1dHRvbj4nXG4gICAgfVxuICAgIGlmIChsYWJlbCA9PT0gJ3JhbmdlJykgO1xuICAgIGxldCB0aXRsZSA9IHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwiem9vbV9pblwiKTtcbiAgICByZXR1cm4gJzxkaXYgZGF0YS10eXBlPVwiJytsYWJlbCsnXCIgY2xhc3M9XCJjcC13aWRnZXQtc2VsZWN0XCI+JyArXG4gICAgICAnPGxhYmVsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fJysgbGFiZWwgKydcIj4nK3RpdGxlKyc8L2xhYmVsPicgK1xuICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtc2VsZWN0X19vcHRpb25zXCI+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJhcnJvdy1kb3duICcrICdjcC13aWRnZXRfX2NhcGl0YWxpemUgY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fJyArIHRoaXMuc3RhdGVzW2luZGV4XVtsYWJlbF0udG9Mb3dlckNhc2UoKSArJ1wiPicrIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIHRoaXMuc3RhdGVzW2luZGV4XVtsYWJlbF0udG9Mb3dlckNhc2UoKSkgKyc8L3NwYW4+JyArXG4gICAgICAnPGRpdiBjbGFzcz1cImNwLXdpZGdldC1zZWxlY3RfX2Ryb3Bkb3duXCI+JyArXG4gICAgICBidXR0b25zICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nO1xuICB9XG4gIFxuICB3aWRnZXRGb290ZXIoaW5kZXgpIHtcbiAgICBsZXQgY3VycmVuY3kgPSB0aGlzLnN0YXRlc1tpbmRleF0uY3VycmVuY3k7XG4gICAgcmV0dXJuICghdGhpcy5zdGF0ZXNbaW5kZXhdLmlzV29yZHByZXNzKVxuICAgICAgPyAnPHAgY2xhc3M9XCJjcC13aWRnZXRfX2Zvb3RlciBjcC13aWRnZXRfX2Zvb3Rlci0tJyArIGluZGV4ICsgJ1wiPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fcG93ZXJlZF9ieVwiPicgKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInBvd2VyZWRfYnlcIikgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8aW1nIHN0eWxlPVwid2lkdGg6IDE2cHhcIiBzcmM9XCInICsgdGhpcy5tYWluX2xvZ29fbGluaygpICsgJ1wiIGFsdD1cIlwiLz4nICtcbiAgICAgICc8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJyArIHRoaXMuY29pbl9saW5rKGN1cnJlbmN5KSArICdcIj5jb2lucGFwcmlrYS5jb208L2E+JyArXG4gICAgICAnPC9wPidcbiAgICAgIDogJyc7XG4gIH1cbiAgXG4gIGdldEltYWdlKGluZGV4KSB7XG4gICAgbGV0IGRhdGEgPSB0aGlzLnN0YXRlc1tpbmRleF07XG4gICAgbGV0IGltZ0NvbnRhaW5lcnMgPSBkYXRhLm1haW5FbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NwLXdpZGdldF9faW1nJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbWdDb250YWluZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgaW1nQ29udGFpbmVyID0gaW1nQ29udGFpbmVyc1tpXTtcbiAgICAgIGltZ0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjcC13aWRnZXRfX2ltZy0taGlkZGVuJyk7XG4gICAgICBsZXQgaW1nID0gaW1nQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpO1xuICAgICAgbGV0IG5ld0ltZyA9IG5ldyBJbWFnZTtcbiAgICAgIG5ld0ltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIGltZy5zcmMgPSBuZXdJbWcuc3JjO1xuICAgICAgICBpbWdDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19pbWctLWhpZGRlbicpO1xuICAgICAgfTtcbiAgICAgIG5ld0ltZy5zcmMgPSB0aGlzLmltZ19zcmMoZGF0YS5jdXJyZW5jeSk7XG4gICAgfVxuICB9XG4gIFxuICBpbWdfc3JjKGlkKSB7XG4gICAgcmV0dXJuICdodHRwczovL2NvaW5wYXByaWthLmNvbS9jb2luLycgKyBpZCArICcvbG9nby5wbmcnO1xuICB9XG4gIFxuICBjb2luX2xpbmsoaWQpIHtcbiAgICByZXR1cm4gJ2h0dHBzOi8vY29pbnBhcHJpa2EuY29tL2NvaW4vJyArIGlkXG4gIH1cbiAgXG4gIG1haW5fbG9nb19saW5rKCkge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRzLmltZ19zcmMgfHwgdGhpcy5kZWZhdWx0cy5vcmlnaW5fc3JjICsgJy9kaXN0L2ltZy9sb2dvX3dpZGdldC5zdmcnXG4gIH1cbiAgXG4gIGdldFNjcmlwdEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NjcmlwdFtkYXRhLWNwLWN1cnJlbmN5LXdpZGdldF0nKTtcbiAgfVxuICBcbiAgZ2V0VHJhbnNsYXRpb24oaW5kZXgsIGxhYmVsKSB7XG4gICAgbGV0IHRleHQgPSAodGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbdGhpcy5zdGF0ZXNbaW5kZXhdLmxhbmd1YWdlXSkgPyB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1t0aGlzLnN0YXRlc1tpbmRleF0ubGFuZ3VhZ2VdW2xhYmVsXSA6IG51bGw7XG4gICAgaWYgKCF0ZXh0ICYmIHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zWydlbiddKSB7XG4gICAgICB0ZXh0ID0gdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbJ2VuJ11bbGFiZWxdO1xuICAgIH1cbiAgICBpZiAoIXRleHQpIHtcbiAgICAgIHJldHVybiB0aGlzLmFkZExhYmVsV2l0aG91dFRyYW5zbGF0aW9uKGluZGV4LCBsYWJlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuICBcbiAgYWRkTGFiZWxXaXRob3V0VHJhbnNsYXRpb24oaW5kZXgsIGxhYmVsKSB7XG4gICAgaWYgKCF0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1snZW4nXSkgdGhpcy5nZXRUcmFuc2xhdGlvbnMoJ2VuJyk7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGVzW2luZGV4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLnB1c2gobGFiZWwpO1xuICB9XG4gIFxuICBnZXRUcmFuc2xhdGlvbnMobGFuZykge1xuICAgIGlmICghdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ10pIHtcbiAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIGxldCB1cmwgPSB0aGlzLmRlZmF1bHRzLmxhbmdfc3JjIHx8IHRoaXMuZGVmYXVsdHMub3JpZ2luX3NyYyArICcvZGlzdC9sYW5nJztcbiAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwgKyAnLycgKyBsYW5nICsgJy5qc29uJyk7XG4gICAgICB4aHIub25sb2FkID0gKCkgPT4ge1xuICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVXaWRnZXRUcmFuc2xhdGlvbnMobGFuZywgSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5vbkVycm9yUmVxdWVzdCgwLCB4aHIpO1xuICAgICAgICAgIHRoaXMuZ2V0VHJhbnNsYXRpb25zKCdlbicpO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHhoci5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICB0aGlzLm9uRXJyb3JSZXF1ZXN0KDAsIHhocik7XG4gICAgICAgIHRoaXMuZ2V0VHJhbnNsYXRpb25zKCdlbicpO1xuICAgICAgICBkZWxldGUgdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ107XG4gICAgICB9O1xuICAgICAgeGhyLnNlbmQoKTtcbiAgICAgIHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddID0ge307XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIGNoYXJ0Q2xhc3Mge1xuICBjb25zdHJ1Y3Rvcihjb250YWluZXIsIHN0YXRlKXtcbiAgICBpZiAoIWNvbnRhaW5lcikgcmV0dXJuO1xuICAgIHRoaXMuaWQgPSBjb250YWluZXIuaWQ7XG4gICAgdGhpcy5pc05pZ2h0TW9kZSA9IHN0YXRlLmlzTmlnaHRNb2RlO1xuICAgIHRoaXMuY2hhcnRzV2l0aEFjdGl2ZVNlcmllc0Nvb2tpZXMgPSBbXTtcbiAgICB0aGlzLmNoYXJ0ID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbmN5ID0gc3RhdGUuY3VycmVuY3k7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5vcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKCk7XG4gICAgdGhpcy5kZWZhdWx0UmFuZ2UgPSBzdGF0ZS5yYW5nZSB8fCAnN2QnO1xuICAgIHRoaXMuY2FsbGJhY2sgPSBudWxsO1xuICAgIHRoaXMucmVwbGFjZUNhbGxiYWNrID0gbnVsbDtcbiAgICB0aGlzLmV4dHJlbWVzRGF0YVVybCA9IHRoaXMuZ2V0RXh0cmVtZXNEYXRhVXJsKGNvbnRhaW5lci5pZCk7XG4gICAgdGhpcy5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIGNoYXJ0OiB7XG4gICAgICAgIGFsaWduVGlja3M6IGZhbHNlLFxuICAgICAgICBtYXJnaW5Ub3A6IDUwLFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIGZvbnRGYW1pbHk6ICdzYW5zLXNlcmlmJyxcbiAgICAgICAgfSxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgcmVuZGVyOiAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGUudGFyZ2V0LmFubm90YXRpb25zKSB7XG4gICAgICAgICAgICAgIGxldCBjaGFydCA9IGUudGFyZ2V0LmFubm90YXRpb25zLmNoYXJ0O1xuICAgICAgICAgICAgICBjcEJvb3RzdHJhcC5sb29wKGNoYXJ0LmFubm90YXRpb25zLmFsbEl0ZW1zLCBhbm5vdGF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgeSA9IGNoYXJ0LnBsb3RIZWlnaHQgKyBjaGFydC5wbG90VG9wIC0gY2hhcnQuc3BhY2luZ1swXSAtIDIgLSAoKHRoaXMuaXNSZXNwb25zaXZlTW9kZUFjdGl2ZShjaGFydCkpID8gMTAgOiAwKTtcbiAgICAgICAgICAgICAgICBhbm5vdGF0aW9uLnVwZGF0ZSh7eX0sIHRydWUpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHNjcm9sbGJhcjoge1xuICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICBhbm5vdGF0aW9uc09wdGlvbnM6IHtcbiAgICAgICAgZW5hYmxlZEJ1dHRvbnM6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHJhbmdlU2VsZWN0b3I6IHtcbiAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICB9LFxuICAgICAgcGxvdE9wdGlvbnM6IHtcbiAgICAgICAgbGluZToge1xuICAgICAgICAgIHNlcmllczoge1xuICAgICAgICAgICAgc3RhdGVzOiB7XG4gICAgICAgICAgICAgIGhvdmVyOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHNlcmllczoge1xuICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgbGVnZW5kSXRlbUNsaWNrOiAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGV2ZW50LmJyb3dzZXJFdmVudC5pc1RydXN0ZWQpe1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXJ0c1dpdGhBY3RpdmVTZXJpZXNDb29raWVzLmluZGV4T2YoZXZlbnQudGFyZ2V0LmNoYXJ0LnJlbmRlclRvLmlkKSA+IC0xKSB0aGlzLnNldFZpc2libGVDaGFydENvb2tpZXMoZXZlbnQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIE9uIGlPUyB0b3VjaCBldmVudCBmaXJlcyBzZWNvbmQgY2FsbGJhY2sgZnJvbSBKUyAoaXNUcnVzdGVkOiBmYWxzZSkgd2hpY2hcbiAgICAgICAgICAgICAgLy8gcmVzdWx0cyB3aXRoIHRvZ2dsZSBiYWNrIHRoZSBjaGFydCAocHJvYmFibHkgaXRzIGEgcHJvYmxlbSB3aXRoIFVJS2l0LCBidXQgbm90IHN1cmUpXG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdsZWdlbmRJdGVtQ2xpY2snLCB7ZXZlbnQsIGlzVHJ1c3RlZDogZXZlbnQuYnJvd3NlckV2ZW50LmlzVHJ1c3RlZH0pO1xuICAgICAgICAgICAgICByZXR1cm4gZXZlbnQuYnJvd3NlckV2ZW50LmlzVHJ1c3RlZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHhBeGlzOiB7XG4gICAgICAgIG9yZGluYWw6IGZhbHNlXG4gICAgICB9XG4gICAgfTtcbiAgICB0aGlzLmNoYXJ0RGF0YVBhcnNlciA9IChkYXRhKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgZGF0YSA9IGRhdGFbMF07XG4gICAgICAgIGNvbnN0IHByaWNlQ3VycmVuY3kgPSBzdGF0ZS5wcmltYXJ5X2N1cnJlbmN5LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHJldHVybiByZXNvbHZlKHtcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBwcmljZTogKGRhdGEucHJpY2UpXG4gICAgICAgICAgICAgID8gZGF0YS5wcmljZVxuICAgICAgICAgICAgICA6ICgoZGF0YVtwcmljZUN1cnJlbmN5XSlcbiAgICAgICAgICAgICAgICA/IGRhdGFbcHJpY2VDdXJyZW5jeV1cbiAgICAgICAgICAgICAgICA6IFtdKSxcbiAgICAgICAgICAgIHZvbHVtZTogZGF0YS52b2x1bWUgfHwgW10sXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdGhpcy5pc0V2ZW50c0hpZGRlbiA9IGZhbHNlO1xuICAgIHRoaXMuZXhjbHVkZVNlcmllc0lkcyA9IFtdO1xuICAgIHRoaXMuYXN5bmNVcmwgPSBgL2N1cnJlbmN5L2RhdGEvJHsgc3RhdGUuY3VycmVuY3kgfS9fcmFuZ2VfL2A7XG4gICAgdGhpcy5hc3luY1BhcmFtcyA9IGA/cXVvdGU9JHsgc3RhdGUucHJpbWFyeV9jdXJyZW5jeS50b1VwcGVyQ2FzZSgpIH0mZmllbGRzPXByaWNlLHZvbHVtZWA7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cbiAgXG4gIHNldE9wdGlvbnMoKXtcbiAgICBjb25zdCBjaGFydFNlcnZpY2UgPSBuZXcgY2hhcnRDbGFzcygpO1xuICAgIHJldHVybiB7XG4gICAgICByZXNwb25zaXZlOiB7XG4gICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgIG1heFdpZHRoOiAxNTAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoYXJ0T3B0aW9uczoge1xuICAgICAgICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgICAgICBhbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJyxcbiAgICAgICAgICAgICAgICB5OiA5MixcbiAgICAgICAgICAgICAgICBzeW1ib2xSYWRpdXM6IDAsXG4gICAgICAgICAgICAgICAgaXRlbURpc3RhbmNlOiAyMCxcbiAgICAgICAgICAgICAgICBpdGVtU3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDQwMCxcbiAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IDM1LFxuICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogMCxcbiAgICAgICAgICAgICAgICBzcGFjaW5nVG9wOiAwLFxuICAgICAgICAgICAgICAgIHNwYWNpbmdCb3R0b206IDAsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG5hdmlnYXRvcjoge1xuICAgICAgICAgICAgICAgIGhlaWdodDogNTAsXG4gICAgICAgICAgICAgICAgbWFyZ2luOiA3MCxcbiAgICAgICAgICAgICAgICBoYW5kbGVzOiB7XG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6IDI1LFxuICAgICAgICAgICAgICAgICAgd2lkdGg6IDE3LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgIG1heFdpZHRoOiA2MDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hhcnRPcHRpb25zOiB7XG4gICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgbWFyZ2luVG9wOiAwLFxuICAgICAgICAgICAgICAgIHpvb21UeXBlOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICBtYXJnaW5MZWZ0OiAxMCxcbiAgICAgICAgICAgICAgICBtYXJnaW5SaWdodDogMTAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzNTAsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHlBeGlzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgZmxvb3I6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrQW1vdW50OiA3LFxuICAgICAgICAgICAgICAgICAgdGlja1dpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0xlbmd0aDogMCxcbiAgICAgICAgICAgICAgICAgIGxpbmVXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgICAgICAgICAgIGFsaWduOiBcImxlZnRcIixcbiAgICAgICAgICAgICAgICAgICAgeDogMSxcbiAgICAgICAgICAgICAgICAgICAgeTogLTIsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjOWU5ZTllJyxcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzlweCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tBbW91bnQ6IDcsXG4gICAgICAgICAgICAgICAgICB0aWNrV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrTGVuZ3RoOiAwLFxuICAgICAgICAgICAgICAgICAgbGluZVdpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgYWxpZ246IFwicmlnaHRcIixcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IFwianVzdGlmeVwiLFxuICAgICAgICAgICAgICAgICAgICB4OiAxLFxuICAgICAgICAgICAgICAgICAgICB5OiAtMixcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM1MDg1ZWMnLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnOXB4JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbmRpdGlvbjoge1xuICAgICAgICAgICAgICBtYXhXaWR0aDogNDUwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hhcnRPcHRpb25zOiB7XG4gICAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgIGFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuICAgICAgICAgICAgICAgIHk6IDgyLFxuICAgICAgICAgICAgICAgIHN5bWJvbFJhZGl1czogMCxcbiAgICAgICAgICAgICAgICBpdGVtRGlzdGFuY2U6IDIwLFxuICAgICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBuYXZpZ2F0b3I6IHtcbiAgICAgICAgICAgICAgICBtYXJnaW46IDYwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogNDAsXG4gICAgICAgICAgICAgICAgaGFuZGxlczoge1xuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMDAsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHlBeGlzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgZmxvb3I6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrQW1vdW50OiA3LFxuICAgICAgICAgICAgICAgICAgdGlja1dpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0xlbmd0aDogMCxcbiAgICAgICAgICAgICAgICAgIGxpbmVXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgICAgICAgICAgIGFsaWduOiBcImxlZnRcIixcbiAgICAgICAgICAgICAgICAgICAgeDogMSxcbiAgICAgICAgICAgICAgICAgICAgeTogLTIsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjOWU5ZTllJyxcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzlweCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tBbW91bnQ6IDcsXG4gICAgICAgICAgICAgICAgICB0aWNrV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrTGVuZ3RoOiAwLFxuICAgICAgICAgICAgICAgICAgbGluZVdpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgYWxpZ246IFwicmlnaHRcIixcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IFwianVzdGlmeVwiLFxuICAgICAgICAgICAgICAgICAgICB4OiAxLFxuICAgICAgICAgICAgICAgICAgICB5OiAtMixcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM1MDg1ZWMnLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnOXB4JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB0aXRsZToge1xuICAgICAgICB0ZXh0OiB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgICAgY2hhcnQ6IHtcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnbm9uZScsXG4gICAgICAgIG1hcmdpblRvcDogNTAsXG4gICAgICAgIHBsb3RCb3JkZXJXaWR0aDogMCxcbiAgICAgIH0sXG4gICAgICBjcEV2ZW50czogZmFsc2UsXG4gICAgICBjb2xvcnM6IFtcbiAgICAgICAgJyM1MDg1ZWMnLFxuICAgICAgICAnIzFmOTgwOScsXG4gICAgICAgICcjOTg1ZDY1JyxcbiAgICAgICAgJyNlZTk4M2InLFxuICAgICAgICAnIzRjNGM0YycsXG4gICAgICBdLFxuICAgICAgbGVnZW5kOiB7XG4gICAgICAgIG1hcmdpbjogMCxcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgYWxpZ246ICdyaWdodCcsXG4gICAgICAgIHN5bWJvbFJhZGl1czogMCxcbiAgICAgICAgaXRlbURpc3RhbmNlOiA0MCxcbiAgICAgICAgaXRlbVN0eWxlOiB7XG4gICAgICAgICAgZm9udFdlaWdodDogJ25vcm1hbCcsXG4gICAgICAgICAgY29sb3I6ICh0aGlzLmlzTmlnaHRNb2RlKSA/ICcjODBhNmU1JyA6ICcjMDY0NWFkJyxcbiAgICAgICAgfSxcbiAgICAgICAgaXRlbU1hcmdpblRvcDogOCxcbiAgICAgIH0sXG4gICAgICBuYXZpZ2F0b3I6IHRydWUsXG4gICAgICB0b29sdGlwOiB7XG4gICAgICAgIHNoYXJlZDogdHJ1ZSxcbiAgICAgICAgc3BsaXQ6IGZhbHNlLFxuICAgICAgICBhbmltYXRpb246IGZhbHNlLFxuICAgICAgICBib3JkZXJXaWR0aDogMSxcbiAgICAgICAgYm9yZGVyQ29sb3I6ICh0aGlzLmlzTmlnaHRNb2RlKSA/ICcjNGM0YzRjJyA6ICcjZTNlM2UzJyxcbiAgICAgICAgaGlkZURlbGF5OiAxMDAsXG4gICAgICAgIHNoYWRvdzogZmFsc2UsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIGNvbG9yOiAnIzRjNGM0YycsXG4gICAgICAgICAgZm9udFNpemU6ICcxMHB4JyxcbiAgICAgICAgfSxcbiAgICAgICAgdXNlSFRNTDogdHJ1ZSxcbiAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiBjaGFydFNlcnZpY2UudG9vbHRpcEZvcm1hdHRlcih0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBcbiAgICAgIGV4cG9ydGluZzoge1xuICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgY29udGV4dEJ1dHRvbjoge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcbiAgICAgIHhBeGlzOiB7XG4gICAgICAgIGxpbmVDb2xvcjogKHRoaXMuaXNOaWdodE1vZGUpID8gJyM1MDUwNTAnIDogJyNlM2UzZTMnLFxuICAgICAgICB0aWNrQ29sb3I6ICh0aGlzLmlzTmlnaHRNb2RlKSA/ICcjNTA1MDUwJyA6ICcjZTNlM2UzJyxcbiAgICAgICAgdGlja0xlbmd0aDogNyxcbiAgICAgIH0sXG4gICAgICBcbiAgICAgIHlBeGlzOiBbeyAvLyBWb2x1bWUgeUF4aXNcbiAgICAgICAgbGluZVdpZHRoOiAxLFxuICAgICAgICBsaW5lQ29sb3I6ICcjZGVkZWRlJyxcbiAgICAgICAgdGlja1dpZHRoOiAxLFxuICAgICAgICB0aWNrTGVuZ3RoOiA0LFxuICAgICAgICBncmlkTGluZURhc2hTdHlsZTogJ2Rhc2gnLFxuICAgICAgICBncmlkTGluZVdpZHRoOiAwLFxuICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgbWluUGFkZGluZzogMCxcbiAgICAgICAgb3Bwb3NpdGU6IGZhbHNlLFxuICAgICAgICBzaG93RW1wdHk6IGZhbHNlLFxuICAgICAgICBzaG93TGFzdExhYmVsOiBmYWxzZSxcbiAgICAgICAgc2hvd0ZpcnN0TGFiZWw6IGZhbHNlLFxuICAgICAgfSwge1xuICAgICAgICBncmlkTGluZUNvbG9yOiAodGhpcy5pc05pZ2h0TW9kZSkgPyAnIzUwNTA1MCcgOiAnI2UzZTNlMycsXG4gICAgICAgIGdyaWRMaW5lRGFzaFN0eWxlOiAnZGFzaCcsXG4gICAgICAgIGxpbmVXaWR0aDogMSxcbiAgICAgICAgdGlja1dpZHRoOiAxLFxuICAgICAgICB0aWNrTGVuZ3RoOiA0LFxuICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgbWluUGFkZGluZzogMCxcbiAgICAgICAgc2hvd0VtcHR5OiBmYWxzZSxcbiAgICAgICAgb3Bwb3NpdGU6IHRydWUsXG4gICAgICAgIGdyaWRaSW5kZXg6IDQsXG4gICAgICAgIHNob3dMYXN0TGFiZWw6IGZhbHNlLFxuICAgICAgICBzaG93Rmlyc3RMYWJlbDogZmFsc2UsXG4gICAgICB9XSxcbiAgICAgIFxuICAgICAgc2VyaWVzOiBbXG4gICAgICAgIHsgLy9vcmRlciBvZiB0aGUgc2VyaWVzIG1hdHRlcnNcbiAgICAgICAgICBjb2xvcjogJyM1MDg1ZWMnLFxuICAgICAgICAgIG5hbWU6ICdQcmljZScsXG4gICAgICAgICAgaWQ6ICdwcmljZScsXG4gICAgICAgICAgZGF0YTogW10sXG4gICAgICAgICAgdHlwZTogJ2FyZWEnLFxuICAgICAgICAgIGZpbGxPcGFjaXR5OiAwLjE1LFxuICAgICAgICAgIGxpbmVXaWR0aDogMixcbiAgICAgICAgICB5QXhpczogMSxcbiAgICAgICAgICB6SW5kZXg6IDIsXG4gICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICBjbGlja2FibGU6IHRydWUsXG4gICAgICAgICAgdGhyZXNob2xkOiBudWxsLFxuICAgICAgICAgIHRvb2x0aXA6IHtcbiAgICAgICAgICAgIHZhbHVlRGVjaW1hbHM6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNob3dJbk5hdmlnYXRvcjogdHJ1ZSxcbiAgICAgICAgICBzaG93SW5MZWdlbmQ6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgY29sb3I6IGB1cmwoI2ZpbGwtcGF0dGVybiR7KHRoaXMuaXNOaWdodE1vZGUpID8gJy1uaWdodCcgOiAnJ30pYCxcbiAgICAgICAgICBuYW1lOiAnVm9sdW1lJyxcbiAgICAgICAgICBpZDogJ3ZvbHVtZScsXG4gICAgICAgICAgZGF0YTogW10sXG4gICAgICAgICAgdHlwZTogJ2FyZWEnLFxuICAgICAgICAgIGZpbGxPcGFjaXR5OiAwLjUsXG4gICAgICAgICAgbGluZVdpZHRoOiAwLFxuICAgICAgICAgIHlBeGlzOiAwLFxuICAgICAgICAgIHpJbmRleDogMCxcbiAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgIGNsaWNrYWJsZTogdHJ1ZSxcbiAgICAgICAgICB0aHJlc2hvbGQ6IG51bGwsXG4gICAgICAgICAgdG9vbHRpcDoge1xuICAgICAgICAgICAgdmFsdWVEZWNpbWFsczogMCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNob3dJbk5hdmlnYXRvcjogdHJ1ZSxcbiAgICAgICAgfV1cbiAgICB9XG4gIH1cbiAgXG4gIGluaXQoKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2VPcHRpb25zKHRoaXMub3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigob3B0aW9ucykgPT4ge1xuICAgICAgcmV0dXJuICh3aW5kb3cuSGlnaGNoYXJ0cykgPyBIaWdoY2hhcnRzLnN0b2NrQ2hhcnQodGhpcy5jb250YWluZXIuaWQsIG9wdGlvbnMsIChjaGFydCkgPT4gdGhpcy5iaW5kKGNoYXJ0KSkgOiBudWxsO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBwYXJzZU9wdGlvbnMob3B0aW9ucyl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC51cGRhdGVPYmplY3QodGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigobmV3T3B0aW9ucykgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLnVwZGF0ZU9iamVjdCh0aGlzLmdldFZvbHVtZVBhdHRlcm4oKSwgbmV3T3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigobmV3T3B0aW9ucykgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0TmF2aWdhdG9yKG5ld09wdGlvbnMpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKG5ld09wdGlvbnMpID0+IHtcbiAgICAgIHJldHVybiAobmV3T3B0aW9ucy5ub0RhdGEpID8gdGhpcy5zZXROb0RhdGFMYWJlbChuZXdPcHRpb25zKSA6IG5ld09wdGlvbnM7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigobmV3T3B0aW9ucykgPT4ge1xuICAgICAgcmV0dXJuIG5ld09wdGlvbnM7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGJpbmQoY2hhcnQpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFydCA9IGNoYXJ0O1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hEYXRhUGFja2FnZSgpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0UmFuZ2VTd2l0Y2hlcigpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuICh0aGlzLmNhbGxiYWNrKSA/IHRoaXMuY2FsbGJhY2sodGhpcy5jaGFydCwgdGhpcy5kZWZhdWx0UmFuZ2UpIDogbnVsbDtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgZmV0Y2hEYXRhUGFja2FnZShtaW5EYXRlLCBtYXhEYXRlKXtcbiAgICBsZXQgaXNQcmVjaXNlUmFuZ2UgPSAobWluRGF0ZSAmJiBtYXhEYXRlKTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5jcEV2ZW50cyl7XG4gICAgICAgIGxldCB1cmwgPSAoaXNQcmVjaXNlUmFuZ2UpID8gdGhpcy5nZXROYXZpZ2F0b3JFeHRyZW1lc1VybChtaW5EYXRlLCBtYXhEYXRlLCAnZXZlbnRzJykgOiB0aGlzLmdldEV4dHJlbWVzRGF0YVVybCh0aGlzLmlkLCAnZXZlbnRzJykgKyAnLycgKyB0aGlzLmdldFJhbmdlKCkgKyAnLyc7XG4gICAgICAgIHJldHVybiAodXJsKSA/IHRoaXMuZmV0Y2hEYXRhKHVybCwgJ2V2ZW50cycsICFpc1ByZWNpc2VSYW5nZSkgOiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBsZXQgdXJsID0gKChpc1ByZWNpc2VSYW5nZSkgPyB0aGlzLmdldE5hdmlnYXRvckV4dHJlbWVzVXJsKG1pbkRhdGUsIG1heERhdGUpIDogdGhpcy5hc3luY1VybC5yZXBsYWNlKCdfcmFuZ2VfJywgdGhpcy5nZXRSYW5nZSgpKSkgKyB0aGlzLmFzeW5jUGFyYW1zO1xuICAgICAgcmV0dXJuICh1cmwpID8gdGhpcy5mZXRjaERhdGEodXJsLCAnZGF0YScsICFpc1ByZWNpc2VSYW5nZSkgOiBudWxsO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhcnQucmVkcmF3KGZhbHNlKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiAoIWlzUHJlY2lzZVJhbmdlKSA/IHRoaXMuY2hhcnQuem9vbU91dCgpIDogbnVsbDtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmlzTG9hZGVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnRvZ2dsZUV2ZW50cygpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBmZXRjaERhdGEodXJsLCBkYXRhVHlwZSA9ICdkYXRhJywgcmVwbGFjZSA9IHRydWUpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLmNoYXJ0LnNob3dMb2FkaW5nKCk7XG4gICAgICByZXR1cm4gZmV0Y2hTZXJ2aWNlLmZldGNoQ2hhcnREYXRhKHVybCwgIXRoaXMuaXNMb2FkZWQpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICB0aGlzLmNoYXJ0LmhpZGVMb2FkaW5nKCk7XG4gICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGBMb29rcyBsaWtlIHRoZXJlIHdhcyBhIHByb2JsZW0uIFN0YXR1cyBDb2RlOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihkYXRhID0+IHtcbiAgICAgICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVBhcnNlcihkYXRhLCBkYXRhVHlwZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChjb250ZW50KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChyZXBsYWNlKSA/IHRoaXMucmVwbGFjZURhdGEoY29udGVudC5kYXRhLCBkYXRhVHlwZSkgOiB0aGlzLnVwZGF0ZURhdGEoY29udGVudC5kYXRhLCBkYXRhVHlwZSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgdGhpcy5jaGFydC5oaWRlTG9hZGluZygpO1xuICAgICAgdGhpcy5oaWRlQ2hhcnQoKTtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygnRmV0Y2ggRXJyb3InLCBlcnJvcik7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGhpZGVDaGFydChib29sID0gdHJ1ZSl7XG4gICAgY29uc3QgY2xhc3NGdW5jID0gKGJvb2wpID8gJ2FkZCcgOiAncmVtb3ZlJztcbiAgICBjb25zb2xlLmxvZyh7Y29udGFpbmVyOiB0aGlzLmNvbnRhaW5lcn0pO1xuICAgIGNvbnN0IHNpYmxpbmdzID0gY3BCb290c3RyYXAubm9kZUxpc3RUb0FycmF5KHRoaXMuY29udGFpbmVyLnBhcmVudEVsZW1lbnQuY2hpbGROb2Rlcyk7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBzaWJsaW5ncy5maWx0ZXIoZWxlbWVudCA9PiBlbGVtZW50LmlkLnNlYXJjaCgnY2hhcnQnKSA9PT0gLTEpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AocmVzdWx0LCBlbGVtZW50ID0+IGVsZW1lbnQuY2xhc3NMaXN0W2NsYXNzRnVuY10oJ2NwLWhpZGRlbicpKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3RbY2xhc3NGdW5jXSgnY3AtY2hhcnQtbm8tZGF0YScpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBzZXRSYW5nZVN3aXRjaGVyKCl7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihgJHsgdGhpcy5pZCB9LXN3aXRjaC1yYW5nZWAsIChldmVudCkgPT4ge1xuICAgICAgdGhpcy5kZWZhdWx0UmFuZ2UgPSBldmVudC5kZXRhaWwuZGF0YTtcbiAgICAgIHJldHVybiB0aGlzLmZldGNoRGF0YVBhY2thZ2UoKTtcbiAgICB9KTtcbiAgfVxuICBcbiAgZ2V0UmFuZ2UoKXtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0UmFuZ2UgfHwgJzFxJztcbiAgfVxuICBcbiAgdG9nZ2xlRXZlbnRzKCl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBpZiAodGhpcy5vcHRpb25zLmNwRXZlbnRzKXtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaGlnaGNoYXJ0cy1hbm5vdGF0aW9uJyk7XG4gICAgICB9KTtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGVsZW1lbnRzKSA9PiB7XG4gICAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKGVsZW1lbnRzLCBlbGVtZW50ID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5pc0V2ZW50c0hpZGRlbil7XG4gICAgICAgICAgICByZXR1cm4gKCFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaGlnaGNoYXJ0cy1hbm5vdGF0aW9uX19oaWRkZW4nKSkgPyBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZ2hjaGFydHMtYW5ub3RhdGlvbl9faGlkZGVuJykgOiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWdoY2hhcnRzLWFubm90YXRpb25fX2hpZGRlbicpKSA/IGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGNoYXJ0cy1hbm5vdGF0aW9uX19oaWRkZW4nKSA6IG51bGw7XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaGlnaGNoYXJ0cy1wbG90LWxpbmUnKTtcbiAgICAgIH0pO1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoZWxlbWVudHMpID0+IHtcbiAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AoZWxlbWVudHMsIGVsZW1lbnQgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmlzRXZlbnRzSGlkZGVuKXtcbiAgICAgICAgICAgIHJldHVybiAoIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWdoY2hhcnRzLXBsb3QtbGluZV9faGlkZGVuJykpID8gZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWdoY2hhcnRzLXBsb3QtbGluZV9faGlkZGVuJykgOiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWdoY2hhcnRzLXBsb3QtbGluZV9faGlkZGVuJykpID8gZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdoY2hhcnRzLXBsb3QtbGluZV9faGlkZGVuJykgOiBudWxsO1xuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBkYXRhUGFyc2VyKGRhdGEsIGRhdGFUeXBlID0gJ2RhdGEnKXtcbiAgICBzd2l0Y2ggKGRhdGFUeXBlKXtcbiAgICAgIGNhc2UgJ2RhdGEnOlxuICAgICAgICBsZXQgcHJvbWlzZURhdGEgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgcHJvbWlzZURhdGEgPSBwcm9taXNlRGF0YS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gKHRoaXMuY2hhcnREYXRhUGFyc2VyKSA/IHRoaXMuY2hhcnREYXRhUGFyc2VyKGRhdGEpIDoge1xuICAgICAgICAgICAgZGF0YTogZGF0YVswXSxcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2VEYXRhO1xuICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShkYXRhKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuICBcbiAgdXBkYXRlRGF0YShkYXRhLCBkYXRhVHlwZSkge1xuICAgIGxldCBuZXdEYXRhO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBzd2l0Y2ggKGRhdGFUeXBlKSB7XG4gICAgICAgIGNhc2UgJ2RhdGEnOlxuICAgICAgICAgIG5ld0RhdGEgPSB7fTtcbiAgICAgICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChPYmplY3QuZW50cmllcyhkYXRhKSwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0V4Y2x1ZGVkKHZhbHVlWzBdKSkgcmV0dXJuO1xuICAgICAgICAgICAgbGV0IG9sZERhdGEgPSB0aGlzLmdldE9sZERhdGEoZGF0YVR5cGUpW3ZhbHVlWzBdXTtcbiAgICAgICAgICAgIG5ld0RhdGFbdmFsdWVbMF1dID0gb2xkRGF0YVxuICAgICAgICAgICAgICAuZmlsdGVyKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlWzFdLmZpbmRJbmRleChmaW5kRWxlbWVudCA9PiB0aGlzLmlzVGhlU2FtZUVsZW1lbnQoZWxlbWVudCwgZmluZEVsZW1lbnQsIGRhdGFUeXBlKSkgPT09IC0xO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuY29uY2F0KHZhbHVlWzFdKVxuICAgICAgICAgICAgICAuc29ydCgoZGF0YTEsIGRhdGEyKSA9PiB0aGlzLnNvcnRDb25kaXRpb24oZGF0YTEsIGRhdGEyLCBkYXRhVHlwZSkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICAgIG5ld0RhdGEgPSBbXTtcbiAgICAgICAgICBsZXQgb2xkRGF0YSA9IHRoaXMuZ2V0T2xkRGF0YShkYXRhVHlwZSk7XG4gICAgICAgICAgcmV0dXJuIG5ld0RhdGEgPSBvbGREYXRhXG4gICAgICAgICAgICAuZmlsdGVyKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgIGRhdGEuZmluZEluZGV4KGZpbmRFbGVtZW50ID0+IHRoaXMuaXNUaGVTYW1lRWxlbWVudChlbGVtZW50LCBmaW5kRWxlbWVudCwgZGF0YVR5cGUpKSA9PT0gLTE7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNvbmNhdChkYXRhKVxuICAgICAgICAgICAgLnNvcnQoKGRhdGExLCBkYXRhMikgPT4gdGhpcy5zb3J0Q29uZGl0aW9uKGRhdGExLCBkYXRhMiwgZGF0YVR5cGUpKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5yZXBsYWNlRGF0YShuZXdEYXRhLCBkYXRhVHlwZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGlzVGhlU2FtZUVsZW1lbnQoZWxlbWVudEEsIGVsZW1lbnRCLCBkYXRhVHlwZSl7XG4gICAgc3dpdGNoIChkYXRhVHlwZSl7XG4gICAgICBjYXNlICdkYXRhJzpcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRBWzBdID09PSBlbGVtZW50QlswXTtcbiAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgIHJldHVybiBlbGVtZW50QS50cyA9PT0gZWxlbWVudEIudHM7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIFxuICBzb3J0Q29uZGl0aW9uKGVsZW1lbnRBLCBlbGVtZW50QiwgZGF0YVR5cGUpe1xuICAgIHN3aXRjaCAoZGF0YVR5cGUpe1xuICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgIHJldHVybiBlbGVtZW50QVswXSAtIGVsZW1lbnRCWzBdO1xuICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRBLnRzIC0gZWxlbWVudEIudHM7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIFxuICBnZXRPbGREYXRhKGRhdGFUeXBlKXtcbiAgICByZXR1cm4gdGhpc1snY2hhcnRfJytkYXRhVHlwZS50b0xvd2VyQ2FzZSgpXTtcbiAgfVxuICBcbiAgcmVwbGFjZURhdGEoZGF0YSwgZGF0YVR5cGUpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpc1snY2hhcnRfJytkYXRhVHlwZS50b0xvd2VyQ2FzZSgpXSA9IGRhdGE7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5yZXBsYWNlRGF0YVR5cGUoZGF0YSwgZGF0YVR5cGUpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuICh0aGlzLnJlcGxhY2VDYWxsYmFjaykgPyB0aGlzLnJlcGxhY2VDYWxsYmFjayh0aGlzLmNoYXJ0LCBkYXRhLCB0aGlzLmlzTG9hZGVkLCBkYXRhVHlwZSkgOiBudWxsO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICByZXBsYWNlRGF0YVR5cGUoZGF0YSwgZGF0YVR5cGUpe1xuICAgIHN3aXRjaCAoZGF0YVR5cGUpe1xuICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgIGlmICh0aGlzLmFzeW5jVXJsKXtcbiAgICAgICAgICBjcEJvb3RzdHJhcC5sb29wKFsnYnRjLWJpdGNvaW4nLCAnZXRoLWV0aGVyZXVtJ10sIGNvaW5OYW1lID0+IHtcbiAgICAgICAgICAgIGxldCBjb2luU2hvcnQgPSBjb2luTmFtZS5zcGxpdCgnLScpWzBdO1xuICAgICAgICAgICAgaWYgKHRoaXMuYXN5bmNVcmwuc2VhcmNoKGNvaW5OYW1lKSA+IC0xICYmIGRhdGFbY29pblNob3J0XSkge1xuICAgICAgICAgICAgICBkYXRhW2NvaW5TaG9ydF0gPSBbXTtcbiAgICAgICAgICAgICAgY3BCb290c3RyYXAubG9vcCh0aGlzLmNoYXJ0LnNlcmllcywgc2VyaWVzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc2VyaWVzLnVzZXJPcHRpb25zLmlkID09PSBjb2luU2hvcnQpIHNlcmllcy51cGRhdGUoeyB2aXNpYmxlOiBmYWxzZSB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AoT2JqZWN0LmVudHJpZXMoZGF0YSksICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmlzRXhjbHVkZWQodmFsdWVbMF0pKSByZXR1cm47XG4gICAgICAgICAgcmV0dXJuICh0aGlzLmNoYXJ0LmdldCh2YWx1ZVswXSkpID8gdGhpcy5jaGFydC5nZXQodmFsdWVbMF0pLnNldERhdGEodmFsdWVbMV0sIGZhbHNlLCBmYWxzZSwgZmFsc2UpIDogdGhpcy5jaGFydC5hZGRTZXJpZXMoe2lkOiB2YWx1ZVswXSwgZGF0YTogdmFsdWVbMV0sIHNob3dJbk5hdmlnYXRvcjogdHJ1ZX0pO1xuICAgICAgICB9KTtcbiAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKHRoaXMuY2hhcnQuYW5ub3RhdGlvbnMuYWxsSXRlbXMsIGFubm90YXRpb24gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGFubm90YXRpb24uZGVzdHJveSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2V0QW5ub3RhdGlvbnNPYmplY3RzKGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbiAgXG4gIGlzRXhjbHVkZWQobGFiZWwpe1xuICAgIHJldHVybiB0aGlzLmV4Y2x1ZGVTZXJpZXNJZHMuaW5kZXhPZihsYWJlbCkgPiAtMTtcbiAgfVxuICBcbiAgdG9vbHRpcEZvcm1hdHRlcihwb2ludGVyLCBsYWJlbCA9ICcnLCBzZWFyY2gpe1xuICAgIGlmICghc2VhcmNoKSBzZWFyY2ggPSBsYWJlbDtcbiAgICBjb25zdCBoZWFkZXIgPSAnPGRpdiBjbGFzcz1cImNwLWNoYXJ0LXRvb2x0aXAtY3VycmVuY3lcIj48c21hbGw+JytuZXcgRGF0ZShwb2ludGVyLngpLnRvVVRDU3RyaW5nKCkrJzwvc21hbGw+PHRhYmxlPic7XG4gICAgY29uc3QgZm9vdGVyID0gJzwvdGFibGU+PC9kaXY+JztcbiAgICBsZXQgY29udGVudCA9ICcnO1xuICAgIHBvaW50ZXIucG9pbnRzLmZvckVhY2gocG9pbnQgPT4ge1xuICAgICAgY29udGVudCArPSAnPHRyPicgK1xuICAgICAgICAnPHRkPicgK1xuICAgICAgICAnPHN2ZyB3aWR0aD1cIjVcIiBoZWlnaHQ9XCI1XCI+PHJlY3QgeD1cIjBcIiB5PVwiMFwiIHdpZHRoPVwiNVwiIGhlaWdodD1cIjVcIiBmaWxsPVwiJytwb2ludC5zZXJpZXMuY29sb3IrJ1wiIGZpbGwtb3BhY2l0eT1cIjFcIj48L3JlY3Q+PC9zdmc+JyArXG4gICAgICAgIHBvaW50LnNlcmllcy5uYW1lICsgJzogJyArIHBvaW50LnkudG9Mb2NhbGVTdHJpbmcoJ3J1LVJVJywgeyBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDggfSkgKyAnICcgKyAoKHBvaW50LnNlcmllcy5uYW1lLnRvTG93ZXJDYXNlKCkuc2VhcmNoKHNlYXJjaC50b0xvd2VyQ2FzZSgpKSA+IC0xKSA/IFwiXCIgOiBsYWJlbCkgK1xuICAgICAgICAnPC90ZD4nICtcbiAgICAgICAgJzwvdHI+JztcbiAgICB9KTtcbiAgICByZXR1cm4gaGVhZGVyICsgY29udGVudCArIGZvb3RlcjtcbiAgfVxuICBcbiAgc2V0QW5ub3RhdGlvbnNPYmplY3RzKGRhdGEpe1xuICAgIHRoaXMuY2hhcnQuc2VyaWVzWzBdLnhBeGlzLnJlbW92ZVBsb3RMaW5lKCk7XG4gICAgbGV0IHBsb3RMaW5lcyA9IFtdO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gZGF0YS5zb3J0KChkYXRhMSwgZGF0YTIpID0+IHtcbiAgICAgICAgcmV0dXJuIGRhdGEyLnRzIC0gZGF0YTEudHM7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKGRhdGEsIGVsZW1lbnQgPT4ge1xuICAgICAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gcGxvdExpbmVzLnB1c2goe1xuICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICB2YWx1ZTogZWxlbWVudC50cyxcbiAgICAgICAgICAgIGRhc2hTdHlsZTogJ3NvbGlkJyxcbiAgICAgICAgICAgIHpJbmRleDogNCxcbiAgICAgICAgICAgIGNvbG9yOiB0aGlzLmdldEV2ZW50VGFnUGFyYW1zKCkuY29sb3IsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jaGFydC5hZGRBbm5vdGF0aW9uKHtcbiAgICAgICAgICAgIHhWYWx1ZTogZWxlbWVudC50cyxcbiAgICAgICAgICAgIHk6IDAsXG4gICAgICAgICAgICB0aXRsZTogYDxzcGFuIHRpdGxlPVwiQ2xpY2sgdG8gb3BlblwiIGNsYXNzPVwiY3AtY2hhcnQtYW5ub3RhdGlvbl9fdGV4dFwiPiR7IHRoaXMuZ2V0RXZlbnRUYWdQYXJhbXMoZWxlbWVudC50YWcpLmxhYmVsIH08L3NwYW4+PHNwYW4gY2xhc3M9XCJjcC1jaGFydC1hbm5vdGF0aW9uX19kYXRhRWxlbWVudFwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj4keyBKU09OLnN0cmluZ2lmeShlbGVtZW50KSB9PC9zcGFuPmAsXG4gICAgICAgICAgICBzaGFwZToge1xuICAgICAgICAgICAgICB0eXBlOiAnY2lyY2xlJyxcbiAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgcjogMTEsXG4gICAgICAgICAgICAgICAgY3g6IDksXG4gICAgICAgICAgICAgICAgY3k6IDEwLjUsXG4gICAgICAgICAgICAgICAgJ3N0cm9rZS13aWR0aCc6IDEuNSxcbiAgICAgICAgICAgICAgICBmaWxsOiB0aGlzLmdldEV2ZW50VGFnUGFyYW1zKCkuY29sb3IsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgIG1vdXNlb3ZlcjogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKE1vYmlsZURldGVjdC5pc01vYmlsZSgpKSByZXR1cm47XG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmdldEV2ZW50RGF0YUZyb21Bbm5vdGF0aW9uRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMub3BlbkV2ZW50Q29udGFpbmVyKGRhdGEsIGV2ZW50KTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbW91c2VvdXQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoTW9iaWxlRGV0ZWN0LmlzTW9iaWxlKCkpIHJldHVybjtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlRXZlbnRDb250YWluZXIoZXZlbnQpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmdldEV2ZW50RGF0YUZyb21Bbm5vdGF0aW9uRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIGlmIChNb2JpbGVEZXRlY3QuaXNNb2JpbGUoKSkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuRXZlbnRDb250YWluZXIoZGF0YSwgZXZlbnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLm9wZW5FdmVudFBhZ2UoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhcnQuc2VyaWVzWzBdLnhBeGlzLnVwZGF0ZSh7XG4gICAgICAgIHBsb3RMaW5lcyxcbiAgICAgIH0sIGZhbHNlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgc2V0TmF2aWdhdG9yKG9wdGlvbnMpe1xuICAgIGxldCBuYXZpZ2F0b3JPcHRpb25zID0ge307XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGlmIChvcHRpb25zLm5hdmlnYXRvciA9PT0gdHJ1ZSl7XG4gICAgICAgIG5hdmlnYXRvck9wdGlvbnMgPSB7XG4gICAgICAgICAgbmF2aWdhdG9yOiB7XG4gICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICBtYXJnaW46IDIwLFxuICAgICAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgICAgIGxpbmVXaWR0aDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtYXNrRmlsbDogJ3JnYmEoMTAyLDEzMywxOTQsMC4xNSknLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgIHpvb21UeXBlOiAneCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgIHNldEV4dHJlbWVzOiAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICgoZS50cmlnZ2VyID09PSAnbmF2aWdhdG9yJyB8fCBlLnRyaWdnZXIgPT09ICd6b29tJykgJiYgZS5taW4gJiYgZS5tYXgpIHtcbiAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KHRoaXMuaWQrJ1NldEV4dHJlbWVzJywge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgICAgICAgICBtaW5EYXRlOiBlLm1pbixcbiAgICAgICAgICAgICAgICAgICAgICBtYXhEYXRlOiBlLm1heCxcbiAgICAgICAgICAgICAgICAgICAgICBlLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm5hdmlnYXRvckV4dHJlbWVzTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5zZXRSZXNldFpvb21CdXR0b24oKTtcbiAgICAgIH0gZWxzZSBpZiAoIW9wdGlvbnMubmF2aWdhdG9yKSB7XG4gICAgICAgIG5hdmlnYXRvck9wdGlvbnMgPSB7XG4gICAgICAgICAgbmF2aWdhdG9yOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLnVwZGF0ZU9iamVjdChvcHRpb25zLCBuYXZpZ2F0b3JPcHRpb25zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgc2V0UmVzZXRab29tQnV0dG9uKCl7XG4gICAgLy8gcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpOyAvLyBjYW50IGJlIHBvc2l0aW9uZWQgcHJvcGVybHkgaW4gcGxvdEJveCwgc28gaXRzIGRpc2FibGVkXG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmFkZENvbnRhaW5lcih0aGlzLmlkLCAnUmVzZXRab29tJywgJ2NwLWNoYXJ0LXJlc2V0LXpvb20nLCAnYnV0dG9uJylcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdldENvbnRhaW5lcignUmVzZXRab29tJyk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoZWxlbWVudCkgPT4ge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd1ay1idXR0b24nKTtcbiAgICAgIGVsZW1lbnQuaW5uZXJUZXh0ID0gJ1Jlc2V0IHpvb20nO1xuICAgICAgcmV0dXJuIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuY2hhcnQuem9vbU91dCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIG5hdmlnYXRvckV4dHJlbWVzTGlzdGVuZXIoKSB7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKHRoaXMuaWQgKyAnU2V0RXh0cmVtZXMnLCAoZSkgPT4ge1xuICAgICAgICBsZXQgbWluRGF0ZSA9IGNwQm9vdHN0cmFwLnJvdW5kKGUuZGV0YWlsLm1pbkRhdGUgLyAxMDAwLCAwKTtcbiAgICAgICAgbGV0IG1heERhdGUgPSBjcEJvb3RzdHJhcC5yb3VuZChlLmRldGFpbC5tYXhEYXRlIC8gMTAwMCwgMCk7XG4gICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLmZldGNoRGF0YVBhY2thZ2UobWluRGF0ZSwgbWF4RGF0ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBnZXROYXZpZ2F0b3JFeHRyZW1lc1VybChtaW5EYXRlLCBtYXhEYXRlLCBkYXRhVHlwZSl7XG4gICAgbGV0IGV4dHJlbWVzRGF0YVVybCA9IChkYXRhVHlwZSkgPyB0aGlzLmdldEV4dHJlbWVzRGF0YVVybCh0aGlzLmlkLCBkYXRhVHlwZSkgOiB0aGlzLmV4dHJlbWVzRGF0YVVybDtcbiAgICByZXR1cm4gKG1pbkRhdGUgJiYgbWF4RGF0ZSAmJiBleHRyZW1lc0RhdGFVcmwpID8gZXh0cmVtZXNEYXRhVXJsICsnL2RhdGVzLycrbWluRGF0ZSsnLycrbWF4RGF0ZSsnLycgOiBudWxsO1xuICB9XG4gIFxuICBzZXROb0RhdGFMYWJlbChvcHRpb25zKXtcbiAgICBsZXQgbm9EYXRhT3B0aW9ucyA9IHt9O1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBub0RhdGFPcHRpb25zID0ge1xuICAgICAgICBsYW5nOiB7XG4gICAgICAgICAgbm9EYXRhOiAnV2UgZG9uXFwndCBoYXZlIGRhdGEgZm9yIHRoaXMgdGltZSBwZXJpb2QnXG4gICAgICAgIH0sXG4gICAgICAgIG5vRGF0YToge1xuICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICBmb250RmFtaWx5OiAnQXJpYWwnLFxuICAgICAgICAgICAgZm9udFNpemU6ICcxNHB4JyxcbiAgICAgICAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAudXBkYXRlT2JqZWN0KG9wdGlvbnMsIG5vRGF0YU9wdGlvbnMpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBhZGRDb250YWluZXIoaWQsIGxhYmVsLCBjbGFzc05hbWUsIHRhZ05hbWUgPSAnZGl2Jyl7XG4gICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG4gICAgbGV0IGNoYXJ0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgIGNvbnRhaW5lci5pZCA9IGlkICsgbGFiZWw7XG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICBjaGFydENvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICB9XG4gIFxuICBnZXRDb250YWluZXIobGFiZWwpe1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkK2xhYmVsKTtcbiAgfVxuICBcbiAgZ2V0RXh0cmVtZXNEYXRhVXJsKGlkLCBkYXRhVHlwZSA9ICdkYXRhJyl7XG4gICAgcmV0dXJuICcvY3VycmVuY3kvJysgZGF0YVR5cGUgKycvJysgdGhpcy5jdXJyZW5jeTtcbiAgfVxuICBcbiAgZ2V0Vm9sdW1lUGF0dGVybigpe1xuICAgIHJldHVybiB7XG4gICAgICBkZWZzOiB7XG4gICAgICAgIHBhdHRlcm5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ2lkJzogJ2ZpbGwtcGF0dGVybicsXG4gICAgICAgICAgICAncGF0aCc6IHtcbiAgICAgICAgICAgICAgZDogJ00gMyAwIEwgMyAxMCBNIDggMCBMIDggMTAnLFxuICAgICAgICAgICAgICBzdHJva2U6IFwiI2UzZTNlM1wiLFxuICAgICAgICAgICAgICBmaWxsOiAnI2YxZjFmMScsXG4gICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdpZCc6ICdmaWxsLXBhdHRlcm4tbmlnaHQnLFxuICAgICAgICAgICAgJ3BhdGgnOiB7XG4gICAgICAgICAgICAgIGQ6ICdNIDMgMCBMIDMgMTAgTSA4IDAgTCA4IDEwJyxcbiAgICAgICAgICAgICAgc3Ryb2tlOiBcIiM5YjliOWJcIixcbiAgICAgICAgICAgICAgZmlsbDogJyMzODM4MzgnLFxuICAgICAgICAgICAgICBzdHJva2VXaWR0aDogMixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuXG5jbGFzcyBib290c3RyYXBDbGFzcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1wdHlWYWx1ZSA9IDA7XG4gICAgdGhpcy5lbXB0eURhdGEgPSAnLSc7XG4gIH1cbiAgXG4gIG5vZGVMaXN0VG9BcnJheShub2RlTGlzdCkge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChub2RlTGlzdCk7XG4gIH1cbiAgXG4gIHBhcnNlSW50ZXJ2YWxWYWx1ZSh2YWx1ZSkge1xuICAgIGxldCB0aW1lU3ltYm9sID0gJycsIG11bHRpcGxpZXIgPSAxO1xuICAgIGlmICh2YWx1ZS5zZWFyY2goJ3MnKSA+IC0xKSB7XG4gICAgICB0aW1lU3ltYm9sID0gJ3MnO1xuICAgICAgbXVsdGlwbGllciA9IDEwMDA7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5zZWFyY2goJ20nKSA+IC0xKSB7XG4gICAgICB0aW1lU3ltYm9sID0gJ20nO1xuICAgICAgbXVsdGlwbGllciA9IDYwICogMTAwMDtcbiAgICB9XG4gICAgaWYgKHZhbHVlLnNlYXJjaCgnaCcpID4gLTEpIHtcbiAgICAgIHRpbWVTeW1ib2wgPSAnaCc7XG4gICAgICBtdWx0aXBsaWVyID0gNjAgKiA2MCAqIDEwMDA7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5zZWFyY2goJ2QnKSA+IC0xKSB7XG4gICAgICB0aW1lU3ltYm9sID0gJ2QnO1xuICAgICAgbXVsdGlwbGllciA9IDI0ICogNjAgKiA2MCAqIDEwMDA7XG4gICAgfVxuICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlLnJlcGxhY2UodGltZVN5bWJvbCwgJycpKSAqIG11bHRpcGxpZXI7XG4gIH1cbiAgXG4gIHVwZGF0ZU9iamVjdChvYmosIG5ld09iaikge1xuICAgIGxldCByZXN1bHQgPSBvYmo7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKE9iamVjdC5rZXlzKG5ld09iaiksIGtleSA9PiB7XG4gICAgICAgIGlmIChyZXN1bHQuaGFzT3duUHJvcGVydHkoa2V5KSAmJiB0eXBlb2YgcmVzdWx0W2tleV0gPT09ICdvYmplY3QnKXtcbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVPYmplY3QocmVzdWx0W2tleV0sIG5ld09ialtrZXldKS50aGVuKCh1cGRhdGVSZXN1bHQpID0+IHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdXBkYXRlUmVzdWx0O1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRba2V5XSA9IG5ld09ialtrZXldO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHBhcnNlTnVtYmVyKG51bWJlcikge1xuICAgIGlmICghbnVtYmVyICYmIG51bWJlciAhPT0gMCkgcmV0dXJuIG51bWJlcjtcbiAgICBpZiAobnVtYmVyID09PSB0aGlzLmVtcHR5VmFsdWUgfHwgbnVtYmVyID09PSB0aGlzLmVtcHR5RGF0YSkgcmV0dXJuIG51bWJlcjtcbiAgICBudW1iZXIgPSBwYXJzZUZsb2F0KG51bWJlcik7XG4gICAgaWYgKG51bWJlciA+IDEwMDAwMCkge1xuICAgICAgbGV0IG51bWJlclN0ciA9IG51bWJlci50b0ZpeGVkKDApO1xuICAgICAgbGV0IHBhcmFtZXRlciA9ICdLJyxcbiAgICAgICAgc3BsaWNlZCA9IG51bWJlclN0ci5zbGljZSgwLCBudW1iZXJTdHIubGVuZ3RoIC0gMSk7XG4gICAgICBpZiAobnVtYmVyID4gMTAwMDAwMDAwMCkge1xuICAgICAgICBzcGxpY2VkID0gbnVtYmVyU3RyLnNsaWNlKDAsIG51bWJlclN0ci5sZW5ndGggLSA3KTtcbiAgICAgICAgcGFyYW1ldGVyID0gJ0InO1xuICAgICAgfSBlbHNlIGlmIChudW1iZXIgPiAxMDAwMDAwKSB7XG4gICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDQpO1xuICAgICAgICBwYXJhbWV0ZXIgPSAnTSc7XG4gICAgICB9XG4gICAgICBsZXQgbmF0dXJhbCA9IHNwbGljZWQuc2xpY2UoMCwgc3BsaWNlZC5sZW5ndGggLSAyKTtcbiAgICAgIGxldCBkZWNpbWFsID0gc3BsaWNlZC5zbGljZShzcGxpY2VkLmxlbmd0aCAtIDIpO1xuICAgICAgcmV0dXJuIG5hdHVyYWwgKyAnLicgKyBkZWNpbWFsICsgJyAnICsgcGFyYW1ldGVyO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgaXNEZWNpbWFsID0gKG51bWJlciAlIDEpID4gMDtcbiAgICAgIGlmIChpc0RlY2ltYWwpIHtcbiAgICAgICAgbGV0IHByZWNpc2lvbiA9IDI7XG4gICAgICAgIGlmIChudW1iZXIgPCAxKSB7XG4gICAgICAgICAgcHJlY2lzaW9uID0gODtcbiAgICAgICAgfSBlbHNlIGlmIChudW1iZXIgPCAxMCkge1xuICAgICAgICAgIHByZWNpc2lvbiA9IDY7XG4gICAgICAgIH0gZWxzZSBpZiAobnVtYmVyIDwgMTAwMCkge1xuICAgICAgICAgIHByZWNpc2lvbiA9IDQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucm91bmQobnVtYmVyLCBwcmVjaXNpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bWJlci50b0ZpeGVkKDIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgcm91bmQoYW1vdW50LCBkZWNpbWFsID0gOCwgZGlyZWN0aW9uKSB7XG4gICAgYW1vdW50ID0gcGFyc2VGbG9hdChhbW91bnQpO1xuICAgIGlmICghZGlyZWN0aW9uKSBkaXJlY3Rpb24gPSAncm91bmQnO1xuICAgIGRlY2ltYWwgPSBNYXRoLnBvdygxMCwgZGVjaW1hbCk7XG4gICAgcmV0dXJuIE1hdGhbZGlyZWN0aW9uXShhbW91bnQgKiBkZWNpbWFsKSAvIGRlY2ltYWw7XG4gIH1cbiAgXG4gIGxvb3AoYXJyLCBmbiwgYnVzeSwgZXJyLCBpID0gMCkge1xuICAgIGNvbnN0IGJvZHkgPSAob2ssIGVyKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByID0gZm4oYXJyW2ldLCBpLCBhcnIpO1xuICAgICAgICByICYmIHIudGhlbiA/IHIudGhlbihvaykuY2F0Y2goZXIpIDogb2socilcbiAgICAgIH1cbiAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGVyKGUpXG4gICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBuZXh0ID0gKG9rLCBlcikgPT4gKCkgPT4gdGhpcy5sb29wKGFyciwgZm4sIG9rLCBlciwgKytpKTtcbiAgICBjb25zdCBydW4gPSAob2ssIGVyKSA9PiBpIDwgYXJyLmxlbmd0aCA/IG5ldyBQcm9taXNlKGJvZHkpLnRoZW4obmV4dChvaywgZXIpKS5jYXRjaChlcikgOiBvaygpO1xuICAgIHJldHVybiBidXN5ID8gcnVuKGJ1c3ksIGVycikgOiBuZXcgUHJvbWlzZShydW4pXG4gIH1cbn1cblxuY2xhc3MgZmV0Y2hDbGFzcyB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5zdGF0ZSA9IHt9O1xuICB9XG4gIFxuICBmZXRjaFNjcmlwdCh1cmwpIHtcbiAgICBpZiAodGhpcy5zdGF0ZVt1cmxdKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgIHRoaXMuc3RhdGVbdXJsXSA9ICdwZW5kaW5nJztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUpIHRoaXMuc3RhdGVbdXJsXSA9ICdkb3dubG9hZGVkJztcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlKSBkZWxldGUgdGhpcy5zdGF0ZVt1cmxdO1xuICAgICAgICByZWplY3QobmV3IEVycm9yKGBGYWlsZWQgdG8gbG9hZCBpbWFnZSdzIFVSTDogJHt1cmx9YCkpO1xuICAgICAgfSk7XG4gICAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xuICAgICAgc2NyaXB0LnNyYyA9IHVybDtcbiAgICB9KTtcbiAgfVxuICBcbiAgZmV0Y2hTdHlsZSh1cmwpIHtcbiAgICBpZiAodGhpcy5zdGF0ZVt1cmxdKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgIHRoaXMuc3RhdGVbdXJsXSA9ICdwZW5kaW5nJztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdyZWwnLCAnc3R5bGVzaGVldCcpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgdXJsKTtcbiAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUpIHRoaXMuc3RhdGVbdXJsXSA9ICdkb3dubG9hZGVkJztcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSkgZGVsZXRlIHRoaXMuc3RhdGVbdXJsXTtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgRmFpbGVkIHRvIGxvYWQgc3R5bGUgVVJMOiAke3VybH1gKSk7XG4gICAgICB9KTtcbiAgICAgIGxpbmsuaHJlZiA9IHVybDtcbiAgICB9KTtcbiAgfVxuICBcbiAgZmV0Y2hDaGFydERhdGEodXJpLCBmcm9tU3RhdGUgPSBmYWxzZSl7XG4gICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vZ3JhcGhzLmNvaW5wYXByaWthLmNvbScgKyB1cmk7XG4gICAgcmV0dXJuIHRoaXMuZmV0Y2hEYXRhKHVybCwgZnJvbVN0YXRlKTtcbiAgfVxuICBcbiAgZmV0Y2hEYXRhKHVybCwgZnJvbVN0YXRlKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKGZyb21TdGF0ZSl7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlW3VybF0gPT09ICdwZW5kaW5nJyl7XG4gICAgICAgICAgbGV0IHByb21pc2VUaW1lb3V0ID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIHJlc29sdmUodGhpcy5mZXRjaERhdGEodXJsLCBmcm9tU3RhdGUpKTtcbiAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHByb21pc2VUaW1lb3V0O1xuICAgICAgICB9XG4gICAgICAgIGlmICghIXRoaXMuc3RhdGVbdXJsXSl7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLnN0YXRlW3VybF0uY2xvbmUoKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBwcm9taXNlRmV0Y2ggPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIHByb21pc2VGZXRjaCA9IHByb21pc2VGZXRjaC50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5zdGF0ZVt1cmxdID0gJ3BlbmRpbmcnO1xuICAgICAgICByZXR1cm4gZmV0Y2godXJsKTtcbiAgICAgIH0pO1xuICAgICAgcHJvbWlzZUZldGNoID0gcHJvbWlzZUZldGNoLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIHRoaXMuc3RhdGVbdXJsXSA9IHJlc3BvbnNlO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuY2xvbmUoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHByb21pc2VGZXRjaDtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxufVxuXG5uZXcgd2lkZ2V0c0NvbnRyb2xsZXIoKTtcbmNvbnN0IGNwQm9vdHN0cmFwID0gbmV3IGJvb3RzdHJhcENsYXNzKCk7XG5jb25zdCBmZXRjaFNlcnZpY2UgPSBuZXcgZmV0Y2hDbGFzcygpO1xuIl19
