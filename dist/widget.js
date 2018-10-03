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
        return _this19.container.parentElement.classList[classFunc]('cp-chart-no-data');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7SUNBTSxpQjtBQUNKLCtCQUFjO0FBQUE7O0FBQ1osU0FBSyxPQUFMLEdBQWUsSUFBSSxZQUFKLEVBQWY7QUFDQSxTQUFLLElBQUw7QUFDRDs7OzsyQkFFSztBQUFBOztBQUNKLGFBQU8sS0FBSyxPQUFMLENBQWEsUUFBYixDQUFzQixVQUE3QixJQUEyQyxFQUEzQztBQUNBLGVBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDO0FBQUEsZUFBTSxNQUFLLFdBQUwsRUFBTjtBQUFBLE9BQTlDLEVBQXdFLEtBQXhFO0FBQ0EsYUFBTyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLFVBQXpDLEdBQXNELFlBQU07QUFDMUQsZUFBTyxNQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLElBQXpDLEdBQWdELEtBQWhEO0FBQ0EsY0FBSyxXQUFMO0FBQ0QsT0FIRDtBQUlEOzs7a0NBRVk7QUFBQTs7QUFDWCxVQUFJLENBQUMsT0FBTyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLElBQTlDLEVBQW1EO0FBQ2pELGVBQU8sS0FBSyxPQUFMLENBQWEsUUFBYixDQUFzQixVQUE3QixFQUF5QyxJQUF6QyxHQUFnRCxJQUFoRDtBQUNBLFlBQUksZUFBZSxNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsU0FBUyxzQkFBVCxDQUFnQyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFNBQXRELENBQTNCLENBQW5CO0FBQ0EsYUFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixZQUE1QjtBQUNBLGVBQU8sZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsWUFBTTtBQUN0QyxpQkFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixZQUE1QjtBQUNBLGVB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U0FBUyxLQUFULEVBQVA7QUFDRCxTQUhjLENBQWY7QUFJQSxlQUFPLFlBQVA7QUFDRCxPQXhCUyxDQUFWO0FBeUJBLGFBQU8sT0FBUDtBQUNEOzs7Ozs7QUFHSCxJQUFJLGlCQUFKO0FBQ0EsSUFBTSxjQUFjLElBQUksY0FBSixFQUFwQjtBQUNBLElBQU0sZUFBZSxJQUFJLFVBQUosRUFBckIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjbGFzcyB3aWRnZXRzQ29udHJvbGxlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMud2lkZ2V0cyA9IG5ldyB3aWRnZXRzQ2xhc3MoKTtcbiAgICB0aGlzLmJpbmQoKTtcbiAgfVxuICBcbiAgYmluZCgpe1xuICAgIHdpbmRvd1t0aGlzLndpZGdldHMuZGVmYXVsdHMub2JqZWN0TmFtZV0gPSB7fTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4gdGhpcy5pbml0V2lkZ2V0cygpLCBmYWxzZSk7XG4gICAgd2luZG93W3RoaXMud2lkZ2V0cy5kZWZhdWx0cy5vYmplY3ROYW1lXS5iaW5kV2lkZ2V0ID0gKCkgPT4ge1xuICAgICAgd2luZG93W3RoaXMud2lkZ2V0cy5kZWZhdWx0cy5vYmplY3ROYW1lXS5pbml0ID0gZmFsc2U7XG4gICAgICB0aGlzLmluaXRXaWRnZXRzKCk7XG4gICAgfTtcbiAgfVxuICBcbiAgaW5pdFdpZGdldHMoKXtcbiAgICBpZiAoIXdpbmRvd1t0aGlzLndpZGdldHMuZGVmYXVsdHMub2JqZWN0TmFtZV0uaW5pdCl7XG4gICAgICB3aW5kb3dbdGhpcy53aWRnZXRzLmRlZmF1bHRzLm9iamVjdE5hbWVdLmluaXQgPSB0cnVlO1xuICAgICAgbGV0IG1haW5FbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy53aWRnZXRzLmRlZmF1bHRzLmNsYXNzTmFtZSkpO1xuICAgICAgdGhpcy53aWRnZXRzLnNldFdpZGdldENsYXNzKG1haW5FbGVtZW50cyk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgICB0aGlzLndpZGdldHMuc2V0V2lkZ2V0Q2xhc3MobWFpbkVsZW1lbnRzKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYWluRWxlbWVudHMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgIHRoaXMud2lkZ2V0cy5zZXRCZWZvcmVFbGVtZW50SW5Gb290ZXIoaSk7XG4gICAgICAgIH1cbiAgICAgIH0sIGZhbHNlKTtcbiAgICAgIGxldCBzY3JpcHRFbGVtZW50ID0gdGhpcy53aWRnZXRzLmdldFNjcmlwdEVsZW1lbnQoKTtcbiAgICAgIGlmIChzY3JpcHRFbGVtZW50ICYmIHNjcmlwdEVsZW1lbnQuZGF0YXNldCAmJiBzY3JpcHRFbGVtZW50LmRhdGFzZXQuY3BDdXJyZW5jeVdpZGdldCl7XG4gICAgICAgIGxldCBkYXRhc2V0ID0gSlNPTi5wYXJzZShzY3JpcHRFbGVtZW50LmRhdGFzZXQuY3BDdXJyZW5jeVdpZGdldCk7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhkYXRhc2V0KSl7XG4gICAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhkYXRhc2V0KTtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGtleXMubGVuZ3RoOyBqKyspe1xuICAgICAgICAgICAgbGV0IGtleSA9IGtleXNbal0ucmVwbGFjZSgnLScsICdfJyk7XG4gICAgICAgICAgICB0aGlzLndpZGdldHMuZGVmYXVsdHNba2V5XSA9IGRhdGFzZXRba2V5c1tqXV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy53aWRnZXRzLnN0YXRlcyA9IFtdO1xuICAgICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChtYWluRWxlbWVudHMsIChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICAgIGxldCBuZXdTZXR0aW5ncyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy53aWRnZXRzLmRlZmF1bHRzKSk7XG4gICAgICAgICAgbmV3U2V0dGluZ3MuaXNXb3JkcHJlc3MgPSBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnd29yZHByZXNzJyk7XG4gICAgICAgICAgbmV3U2V0dGluZ3MuaXNOaWdodE1vZGUgPSBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY3Atd2lkZ2V0X19uaWdodC1tb2RlJyk7XG4gICAgICAgICAgbmV3U2V0dGluZ3MubWFpbkVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICAgIHRoaXMud2lkZ2V0cy5zdGF0ZXMucHVzaChuZXdTZXR0aW5ncyk7XG4gICAgICAgICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGxldCBjaGFydFNjcmlwdHMgPSBbXG4gICAgICAgICAgICAgICcvL2NvZGUuaGlnaGNoYXJ0cy5jb20vc3RvY2svaGlnaHN0b2NrLmpzJyxcbiAgICAgICAgICAgICAgJy8vY29kZS5oaWdoY2hhcnRzLmNvbS9tb2R1bGVzL2V4cG9ydGluZy5qcycsXG4gICAgICAgICAgICAgICcvL2NvZGUuaGlnaGNoYXJ0cy5jb20vbW9kdWxlcy9uby1kYXRhLXRvLWRpc3BsYXkuanMnLFxuICAgICAgICAgICAgICAnLy9oaWdoY2hhcnRzLmdpdGh1Yi5pby9wYXR0ZXJuLWZpbGwvcGF0dGVybi1maWxsLXYyLmpzJyxcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICByZXR1cm4gKG5ld1NldHRpbmdzLm1vZHVsZXMuaW5kZXhPZignY2hhcnQnKSA+IC0xICYmICF3aW5kb3cuSGlnaGNoYXJ0cylcbiAgICAgICAgICAgICAgPyBjcEJvb3RzdHJhcC5sb29wKGNoYXJ0U2NyaXB0cywgbGluayA9PiB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmV0Y2hTZXJ2aWNlLmZldGNoU2NyaXB0KGxpbmspO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndpZGdldHMuaW5pdChpbmRleCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH0pO1xuICAgICAgfSwgNTApO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyB3aWRnZXRzQ2xhc3Mge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnN0YXRlcyA9IFtdO1xuICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICBvYmplY3ROYW1lOiAnY3BDdXJyZW5jeVdpZGdldHMnLFxuICAgICAgY2xhc3NOYW1lOiAnY29pbnBhcHJpa2EtY3VycmVuY3ktd2lkZ2V0JyxcbiAgICAgIGNzc0ZpbGVOYW1lOiAnd2lkZ2V0Lm1pbi5jc3MnLFxuICAgICAgY3VycmVuY3k6ICdidGMtYml0Y29pbicsXG4gICAgICBwcmltYXJ5X2N1cnJlbmN5OiAnVVNEJyxcbiAgICAgIHJhbmdlX2xpc3Q6IFsnMjRoJywgJzdkJywgJzMwZCcsICcxcScsICcxeScsICd5dGQnLCAnYWxsJ10sXG4gICAgICByYW5nZTogJzdkJyxcbiAgICAgIG1vZHVsZXM6IFsnbWFya2V0X2RldGFpbHMnLCAnY2hhcnQnXSxcbiAgICAgIHVwZGF0ZV9hY3RpdmU6IGZhbHNlLFxuICAgICAgdXBkYXRlX3RpbWVvdXQ6ICczMHMnLFxuICAgICAgbGFuZ3VhZ2U6ICdlbicsXG4gICAgICBzdHlsZV9zcmM6IG51bGwsXG4gICAgICBpbWdfc3JjOiBudWxsLFxuICAgICAgbGFuZ19zcmM6IG51bGwsXG4gICAgICBvcmlnaW5fc3JjOiAnaHR0cHM6Ly91bnBrZy5jb20vQGNvaW5wYXByaWthL3dpZGdldC1jdXJyZW5jeScsXG4gICAgICBzaG93X2RldGFpbHNfY3VycmVuY3k6IGZhbHNlLFxuICAgICAgdGlja2VyOiB7XG4gICAgICAgIG5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgc3ltYm9sOiB1bmRlZmluZWQsXG4gICAgICAgIHByaWNlOiB1bmRlZmluZWQsXG4gICAgICAgIHByaWNlX2NoYW5nZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgICAgcmFuazogdW5kZWZpbmVkLFxuICAgICAgICBwcmljZV9hdGg6IHVuZGVmaW5lZCxcbiAgICAgICAgdm9sdW1lXzI0aDogdW5kZWZpbmVkLFxuICAgICAgICBtYXJrZXRfY2FwOiB1bmRlZmluZWQsXG4gICAgICAgIHBlcmNlbnRfZnJvbV9wcmljZV9hdGg6IHVuZGVmaW5lZCxcbiAgICAgICAgdm9sdW1lXzI0aF9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgICAgIG1hcmtldF9jYXBfY2hhbmdlXzI0aDogdW5kZWZpbmVkLFxuICAgICAgfSxcbiAgICAgIGludGVydmFsOiBudWxsLFxuICAgICAgaXNXb3JkcHJlc3M6IGZhbHNlLFxuICAgICAgaXNOaWdodE1vZGU6IGZhbHNlLFxuICAgICAgaXNEYXRhOiBmYWxzZSxcbiAgICAgIGF2YWlsYWJsZU1vZHVsZXM6IFsncHJpY2UnLCAnY2hhcnQnLCAnbWFya2V0X2RldGFpbHMnXSxcbiAgICAgIG1lc3NhZ2U6ICdkYXRhX2xvYWRpbmcnLFxuICAgICAgdHJhbnNsYXRpb25zOiB7fSxcbiAgICAgIG1haW5FbGVtZW50OiBudWxsLFxuICAgICAgbm9UcmFuc2xhdGlvbkxhYmVsczogW10sXG4gICAgICBzY3JpcHRzRG93bmxvYWRlZDoge30sXG4gICAgICBjaGFydDogbnVsbCxcbiAgICAgIHJ3ZDoge1xuICAgICAgICB4czogMjgwLFxuICAgICAgICBzOiAzMjAsXG4gICAgICAgIG06IDM3MCxcbiAgICAgICAgbDogNDYyLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG4gIFxuICBpbml0KGluZGV4KSB7XG4gICAgaWYgKCF0aGlzLmdldE1haW5FbGVtZW50KGluZGV4KSkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ0JpbmQgZmFpbGVkLCBubyBlbGVtZW50IHdpdGggY2xhc3MgPSBcIicgKyB0aGlzLmRlZmF1bHRzLmNsYXNzTmFtZSArICdcIicpO1xuICAgIH1cbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RGVmYXVsdHMoaW5kZXgpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0T3JpZ2luTGluayhpbmRleCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHNldFdpZGdldENsYXNzKGVsZW1lbnRzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHdpZHRoID0gZWxlbWVudHNbaV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgICBsZXQgcndkS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuZGVmYXVsdHMucndkKTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcndkS2V5cy5sZW5ndGg7IGorKykge1xuICAgICAgICBsZXQgcndkS2V5ID0gcndkS2V5c1tqXTtcbiAgICAgICAgbGV0IHJ3ZFBhcmFtID0gdGhpcy5kZWZhdWx0cy5yd2RbcndkS2V5XTtcbiAgICAgICAgbGV0IGNsYXNzTmFtZSA9IHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lICsgJ19fJyArIHJ3ZEtleTtcbiAgICAgICAgaWYgKHdpZHRoIDw9IHJ3ZFBhcmFtKSBlbGVtZW50c1tpXS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICAgIGlmICh3aWR0aCA+IHJ3ZFBhcmFtKSBlbGVtZW50c1tpXS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICBnZXRNYWluRWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiAodGhpcy5zdGF0ZXNbaW5kZXhdKSA/IHRoaXMuc3RhdGVzW2luZGV4XS5tYWluRWxlbWVudCA6IG51bGw7XG4gIH1cbiAgXG4gIGdldERlZmF1bHRzKGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgICBpZiAobWFpbkVsZW1lbnQgJiYgbWFpbkVsZW1lbnQuZGF0YXNldCkge1xuICAgICAgICBpZiAoIW1haW5FbGVtZW50LmRhdGFzZXQubW9kdWxlcyAmJiBtYWluRWxlbWVudC5kYXRhc2V0LnZlcnNpb24gPT09ICdleHRlbmRlZCcpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ21vZHVsZXMnLCBbJ21hcmtldF9kZXRhaWxzJ10pO1xuICAgICAgICBpZiAoIW1haW5FbGVtZW50LmRhdGFzZXQubW9kdWxlcyAmJiBtYWluRWxlbWVudC5kYXRhc2V0LnZlcnNpb24gPT09ICdzdGFuZGFyZCcpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ21vZHVsZXMnLCBbXSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lm1vZHVsZXMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ21vZHVsZXMnLCBKU09OLnBhcnNlKG1haW5FbGVtZW50LmRhdGFzZXQubW9kdWxlcykpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5wcmltYXJ5Q3VycmVuY3kpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3ByaW1hcnlfY3VycmVuY3knLCBtYWluRWxlbWVudC5kYXRhc2V0LnByaW1hcnlDdXJyZW5jeSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmN1cnJlbmN5KSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdjdXJyZW5jeScsIG1haW5FbGVtZW50LmRhdGFzZXQuY3VycmVuY3kpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5yYW5nZSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAncmFuZ2UnLCBtYWluRWxlbWVudC5kYXRhc2V0LnJhbmdlKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuc2hvd0RldGFpbHNDdXJyZW5jeSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnc2hvd19kZXRhaWxzX2N1cnJlbmN5JywgKG1haW5FbGVtZW50LmRhdGFzZXQuc2hvd0RldGFpbHNDdXJyZW5jeSA9PT0gJ3RydWUnKSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZUFjdGl2ZSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAndXBkYXRlX2FjdGl2ZScsIChtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZUFjdGl2ZSA9PT0gJ3RydWUnKSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZVRpbWVvdXQpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3VwZGF0ZV90aW1lb3V0JywgY3BCb290c3RyYXAucGFyc2VJbnRlcnZhbFZhbHVlKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlVGltZW91dCkpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5sYW5ndWFnZSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbGFuZ3VhZ2UnLCBtYWluRWxlbWVudC5kYXRhc2V0Lmxhbmd1YWdlKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQub3JpZ2luU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdvcmlnaW5fc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5vcmlnaW5TcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5ub2RlTW9kdWxlc1NyYykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbm9kZV9tb2R1bGVzX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQubm9kZU1vZHVsZXNTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5ib3dlclNyYykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnYm93ZXJfc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5ib3dlclNyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnN0eWxlU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdzdHlsZV9zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LnN0eWxlU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ1NyYykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbG9nb19zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LmxhbmdTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5pbWdTcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2xvZ29fc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5pbWdTcmMpO1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICB9KTtcbiAgfVxuICBcbiAgc2V0T3JpZ2luTGluayhpbmRleCkge1xuICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9ucykubGVuZ3RoID09PSAwKSB0aGlzLmdldFRyYW5zbGF0aW9ucyh0aGlzLmRlZmF1bHRzLmxhbmd1YWdlKTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc3R5bGVzaGVldCgpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuYWRkV2lkZ2V0RWxlbWVudChpbmRleCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5pbml0SW50ZXJ2YWwoaW5kZXgpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBhZGRXaWRnZXRFbGVtZW50KGluZGV4KSB7XG4gICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgbGV0IG1vZHVsZXMgPSAnJztcbiAgICBsZXQgbW9kdWxlc0FycmF5ID0gW107XG4gICAgbGV0IGNoYXJ0Q29udGFpbmVyID0gbnVsbDtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AodGhpcy5kZWZhdWx0cy5hdmFpbGFibGVNb2R1bGVzLCBtb2R1bGUgPT4ge1xuICAgICAgICByZXR1cm4gKHRoaXMuc3RhdGVzW2luZGV4XS5tb2R1bGVzLmluZGV4T2YobW9kdWxlKSA+IC0xKSA/IG1vZHVsZXNBcnJheS5wdXNoKG1vZHVsZSkgOiBudWxsO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChtb2R1bGVzQXJyYXksIG1vZHVsZSA9PiB7XG4gICAgICAgIGxldCBsYWJlbCA9IG51bGw7XG4gICAgICAgIGlmIChtb2R1bGUgPT09ICdjaGFydCcpIGxhYmVsID0gJ0NoYXJ0JztcbiAgICAgICAgaWYgKG1vZHVsZSA9PT0gJ21hcmtldF9kZXRhaWxzJykgbGFiZWwgPSAnTWFya2V0RGV0YWlscyc7XG4gICAgICAgIHJldHVybiAobGFiZWwpID8gdGhpc1tgd2lkZ2V0JHsgbGFiZWwgfUVsZW1lbnRgXShpbmRleCkudGhlbihyZXN1bHQgPT4gbW9kdWxlcyArPSByZXN1bHQpIDogbnVsbDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIG1haW5FbGVtZW50LmlubmVySFRNTCA9IHRoaXMud2lkZ2V0TWFpbkVsZW1lbnQoaW5kZXgpICsgbW9kdWxlcyArIHRoaXMud2lkZ2V0Rm9vdGVyKGluZGV4KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGNoYXJ0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7IHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lIH0tcHJpY2UtY2hhcnQtJHsgaW5kZXggfWApO1xuICAgICAgcmV0dXJuIChjaGFydENvbnRhaW5lcikgPyBjaGFydENvbnRhaW5lci5wYXJlbnRFbGVtZW50Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgdGhpcy53aWRnZXRTZWxlY3RFbGVtZW50KGluZGV4LCAncmFuZ2UnKSkgOiBudWxsO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKGNoYXJ0Q29udGFpbmVyKXtcbiAgICAgICAgdGhpcy5zdGF0ZXNbaW5kZXhdLmNoYXJ0ID0gbmV3IGNoYXJ0Q2xhc3MoY2hhcnRDb250YWluZXIsIHRoaXMuc3RhdGVzW2luZGV4XSk7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0TGlzdGVuZXJzKGluZGV4KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuICAgIFxuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKGluZGV4KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdldERhdGEoaW5kZXgpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBzZXRTZWxlY3RMaXN0ZW5lcnMoaW5kZXgpe1xuICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgIGxldCBzZWxlY3RFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXQtc2VsZWN0Jyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RFbGVtZW50cy5sZW5ndGg7IGkrKyl7XG4gICAgICBsZXQgYnV0dG9ucyA9IHNlbGVjdEVsZW1lbnRzW2ldLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXQtc2VsZWN0X19vcHRpb25zIGJ1dHRvbicpO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBidXR0b25zLmxlbmd0aDsgaisrKXtcbiAgICAgICAgYnV0dG9uc1tqXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0U2VsZWN0T3B0aW9uKGV2ZW50LCBpbmRleCk7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHNldFNlbGVjdE9wdGlvbihldmVudCwgaW5kZXgpe1xuICAgIGxldCBjbGFzc05hbWUgPSAnY3Atd2lkZ2V0LWFjdGl2ZSc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudC50YXJnZXQucGFyZW50Tm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGxldCBzaWJsaW5nID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuY2hpbGROb2Rlc1tpXTtcbiAgICAgIGlmIChzaWJsaW5nLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKSBzaWJsaW5nLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICB9XG4gICAgbGV0IHBhcmVudCA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcuY3Atd2lkZ2V0LXNlbGVjdCcpO1xuICAgIGxldCB0eXBlID0gcGFyZW50LmRhdGFzZXQudHlwZTtcbiAgICBsZXQgcGlja2VkVmFsdWVFbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5jcC13aWRnZXQtc2VsZWN0X19vcHRpb25zID4gc3BhbicpO1xuICAgIGxldCB2YWx1ZSA9IGV2ZW50LnRhcmdldC5kYXRhc2V0Lm9wdGlvbjtcbiAgICBwaWNrZWRWYWx1ZUVsZW1lbnQuaW5uZXJUZXh0ID0gdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgdmFsdWUudG9Mb3dlckNhc2UoKSk7XG4gICAgdGhpcy51cGRhdGVEYXRhKGluZGV4LCB0eXBlLCB2YWx1ZSk7XG4gICAgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB0aGlzLmRpc3BhdGNoRXZlbnQoaW5kZXgsICctc3dpdGNoLXJhbmdlJywgdmFsdWUpO1xuICB9XG4gIFxuICBkaXNwYXRjaEV2ZW50KGluZGV4LCBuYW1lLCBkYXRhKXtcbiAgICBsZXQgaWQgPSBgJHsgdGhpcy5kZWZhdWx0cy5jbGFzc05hbWUgfS1wcmljZS1jaGFydC0keyBpbmRleCB9YDtcbiAgICByZXR1cm4gZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoYCR7aWR9JHtuYW1lfWAsIHsgZGV0YWlsOiB7IGRhdGEgfSB9KSk7XG4gIH1cbiAgXG4gIGdldERhdGEoaW5kZXgpIHtcbiAgICBjb25zdCB1cmwgPSAnaHR0cHM6Ly9hcGkuY29pbnBhcHJpa2EuY29tL3YxL3dpZGdldC8nICsgdGhpcy5zdGF0ZXNbaW5kZXhdLmN1cnJlbmN5ICsgJz9xdW90ZT0nICsgdGhpcy5zdGF0ZXNbaW5kZXhdLnByaW1hcnlfY3VycmVuY3k7XG4gICAgcmV0dXJuIGZldGNoU2VydmljZS5mZXRjaERhdGEodXJsKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZXNbaW5kZXhdLmlzRGF0YSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnaXNEYXRhJywgdHJ1ZSk7XG4gICAgICAgIHRoaXMudXBkYXRlVGlja2VyKGluZGV4LCByZXN1bHQpO1xuICAgICAgfSlcbiAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5vbkVycm9yUmVxdWVzdChpbmRleCwgZXJyb3IpO1xuICAgIH0pO1xuICB9XG4gIFxuICBvbkVycm9yUmVxdWVzdChpbmRleCwgeGhyKSB7XG4gICAgaWYgKHRoaXMuc3RhdGVzW2luZGV4XS5pc0RhdGEpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2lzRGF0YScsIGZhbHNlKTtcbiAgICB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdtZXNzYWdlJywgJ2RhdGFfdW5hdmFpbGFibGUnKTtcbiAgICBjb25zb2xlLmVycm9yKCdSZXF1ZXN0IGZhaWxlZC4gIFJldHVybmVkIHN0YXR1cyBvZiAnICsgeGhyLCB0aGlzLnN0YXRlc1tpbmRleF0pO1xuICB9XG4gIFxuICBpbml0SW50ZXJ2YWwoaW5kZXgpIHtcbiAgICBjbGVhckludGVydmFsKHRoaXMuc3RhdGVzW2luZGV4XS5pbnRlcnZhbCk7XG4gICAgaWYgKHRoaXMuc3RhdGVzW2luZGV4XS51cGRhdGVfYWN0aXZlICYmIHRoaXMuc3RhdGVzW2luZGV4XS51cGRhdGVfdGltZW91dCA+IDEwMDApIHtcbiAgICAgIHRoaXMuc3RhdGVzW2luZGV4XS5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgdGhpcy5nZXREYXRhKGluZGV4KTtcbiAgICAgIH0sIHRoaXMuc3RhdGVzW2luZGV4XS51cGRhdGVfdGltZW91dCk7XG4gICAgfVxuICB9XG4gIFxuICBzZXRCZWZvcmVFbGVtZW50SW5Gb290ZXIoaW5kZXgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGVzW2luZGV4XS5pc1dvcmRwcmVzcykge1xuICAgICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgICBpZiAobWFpbkVsZW1lbnQpIHtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmNoaWxkcmVuWzBdLmxvY2FsTmFtZSA9PT0gJ3N0eWxlJykge1xuICAgICAgICAgIG1haW5FbGVtZW50LnJlbW92ZUNoaWxkKG1haW5FbGVtZW50LmNoaWxkTm9kZXNbMF0pO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmb290ZXJFbGVtZW50ID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNwLXdpZGdldF9fZm9vdGVyJyk7XG4gICAgICAgIGxldCB2YWx1ZSA9IGZvb3RlckVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLSA0MztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb290ZXJFbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YWx1ZSAtPSBmb290ZXJFbGVtZW50LmNoaWxkTm9kZXNbaV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgc3R5bGUuaW5uZXJIVE1MID0gJy5jcC13aWRnZXRfX2Zvb3Rlci0tJyArIGluZGV4ICsgJzo6YmVmb3Jle3dpZHRoOicgKyB2YWx1ZS50b0ZpeGVkKDApICsgJ3B4O30nO1xuICAgICAgICBtYWluRWxlbWVudC5pbnNlcnRCZWZvcmUoc3R5bGUsIG1haW5FbGVtZW50LmNoaWxkcmVuWzBdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHVwZGF0ZVdpZGdldEVsZW1lbnQoaW5kZXgsIGtleSwgdmFsdWUsIHRpY2tlcikge1xuICAgIGxldCBzdGF0ZSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcbiAgICBsZXQgbWFpbkVsZW1lbnQgPSB0aGlzLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICBpZiAobWFpbkVsZW1lbnQpIHtcbiAgICAgIGxldCB0aWNrZXJDbGFzcyA9ICh0aWNrZXIpID8gJ1RpY2tlcicgOiAnJztcbiAgICAgIGlmIChrZXkgPT09ICduYW1lJyB8fCBrZXkgPT09ICdjdXJyZW5jeScpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ2N1cnJlbmN5Jykge1xuICAgICAgICAgIGxldCBhRWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0X19mb290ZXIgPiBhJyk7XG4gICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBhRWxlbWVudHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgIGFFbGVtZW50c1trXS5ocmVmID0gdGhpcy5jb2luX2xpbmsodmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdldEltYWdlKGluZGV4KTtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09ICdpc0RhdGEnIHx8IGtleSA9PT0gJ21lc3NhZ2UnKSB7XG4gICAgICAgIGxldCBoZWFkZXJFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXRfX21haW4nKTtcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBoZWFkZXJFbGVtZW50cy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgIGhlYWRlckVsZW1lbnRzW2tdLmlubmVySFRNTCA9ICghc3RhdGUuaXNEYXRhKSA/IHRoaXMud2lkZ2V0TWFpbkVsZW1lbnRNZXNzYWdlKGluZGV4KSA6IHRoaXMud2lkZ2V0TWFpbkVsZW1lbnREYXRhKGluZGV4KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHVwZGF0ZUVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgKyBrZXkgKyB0aWNrZXJDbGFzcyk7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdXBkYXRlRWxlbWVudHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBsZXQgdXBkYXRlRWxlbWVudCA9IHVwZGF0ZUVsZW1lbnRzW2pdO1xuICAgICAgICAgIGlmICh1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY3Atd2lkZ2V0X19yYW5rJykpIHtcbiAgICAgICAgICAgIGxldCBjbGFzc05hbWUgPSAocGFyc2VGbG9hdCh2YWx1ZSkgPiAwKSA/IFwiY3Atd2lkZ2V0X19yYW5rLXVwXCIgOiAoKHBhcnNlRmxvYXQodmFsdWUpIDwgMCkgPyBcImNwLXdpZGdldF9fcmFuay1kb3duXCIgOiBcImNwLXdpZGdldF9fcmFuay1uZXV0cmFsXCIpO1xuICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX3JhbmstZG93bicpO1xuICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX3JhbmstdXAnKTtcbiAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLW5ldXRyYWwnKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHZhbHVlID0gY3BCb290c3RyYXAuZW1wdHlEYXRhO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgIHZhbHVlID0gKGtleSA9PT0gJ3ByaWNlX2NoYW5nZV8yNGgnKSA/ICcoJyArIGNwQm9vdHN0cmFwLnJvdW5kKHZhbHVlLCAyKSArICclKScgOiBjcEJvb3RzdHJhcC5yb3VuZCh2YWx1ZSwgMikgKyAnJSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvd0RldGFpbHNDdXJyZW5jeScpICYmICFzdGF0ZS5zaG93X2RldGFpbHNfY3VycmVuY3kpIHtcbiAgICAgICAgICAgIHZhbHVlID0gJyAnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BhcnNlTnVtYmVyJykpIHtcbiAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuaW5uZXJUZXh0ID0gY3BCb290c3RyYXAucGFyc2VOdW1iZXIodmFsdWUpIHx8IGNwQm9vdHN0cmFwLmVtcHR5RGF0YTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5pbm5lclRleHQgPSB2YWx1ZSB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICB1cGRhdGVEYXRhKGluZGV4LCBrZXksIHZhbHVlLCB0aWNrZXIpIHtcbiAgICBpZiAodGlja2VyKSB7XG4gICAgICB0aGlzLnN0YXRlc1tpbmRleF0udGlja2VyW2tleV0gPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGF0ZXNbaW5kZXhdW2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKGtleSA9PT0gJ2xhbmd1YWdlJykge1xuICAgICAgdGhpcy5nZXRUcmFuc2xhdGlvbnModmFsdWUpO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVdpZGdldEVsZW1lbnQoaW5kZXgsIGtleSwgdmFsdWUsIHRpY2tlcik7XG4gIH1cbiAgXG4gIHVwZGF0ZVdpZGdldFRyYW5zbGF0aW9ucyhsYW5nLCBkYXRhKSB7XG4gICAgdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ10gPSBkYXRhO1xuICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5zdGF0ZXMubGVuZ3RoOyB4KyspIHtcbiAgICAgIGxldCBpc05vVHJhbnNsYXRpb25MYWJlbHNVcGRhdGUgPSB0aGlzLnN0YXRlc1t4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLmxlbmd0aCA+IDAgJiYgbGFuZyA9PT0gJ2VuJztcbiAgICAgIGlmICh0aGlzLnN0YXRlc1t4XS5sYW5ndWFnZSA9PT0gbGFuZyB8fCBpc05vVHJhbnNsYXRpb25MYWJlbHNVcGRhdGUpIHtcbiAgICAgICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5zdGF0ZXNbeF0ubWFpbkVsZW1lbnQ7XG4gICAgICAgIGxldCB0cmFuc2FsdGVFbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC10cmFuc2xhdGlvbicpKTtcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0cmFuc2FsdGVFbGVtZW50cy5sZW5ndGg7IHkrKykge1xuICAgICAgICAgIHRyYW5zYWx0ZUVsZW1lbnRzW3ldLmNsYXNzTGlzdC5mb3JFYWNoKChjbGFzc05hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChjbGFzc05hbWUuc2VhcmNoKCd0cmFuc2xhdGlvbl8nKSA+IC0xKSB7XG4gICAgICAgICAgICAgIGxldCB0cmFuc2xhdGVLZXkgPSBjbGFzc05hbWUucmVwbGFjZSgndHJhbnNsYXRpb25fJywgJycpO1xuICAgICAgICAgICAgICBpZiAodHJhbnNsYXRlS2V5ID09PSAnbWVzc2FnZScpIHRyYW5zbGF0ZUtleSA9IHRoaXMuc3RhdGVzW3hdLm1lc3NhZ2U7XG4gICAgICAgICAgICAgIGxldCBsYWJlbEluZGV4ID0gdGhpcy5zdGF0ZXNbeF0ubm9UcmFuc2xhdGlvbkxhYmVscy5pbmRleE9mKHRyYW5zbGF0ZUtleSk7XG4gICAgICAgICAgICAgIGxldCB0ZXh0ID0gdGhpcy5nZXRUcmFuc2xhdGlvbih4LCB0cmFuc2xhdGVLZXkpO1xuICAgICAgICAgICAgICBpZiAobGFiZWxJbmRleCA+IC0xICYmIHRleHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1t4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLnNwbGljZShsYWJlbEluZGV4LCAxKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRyYW5zYWx0ZUVsZW1lbnRzW3ldLmlubmVyVGV4dCA9IHRleHQ7XG4gICAgICAgICAgICAgIGlmICh0cmFuc2FsdGVFbGVtZW50c1t5XS5jbG9zZXN0KCcuY3Atd2lkZ2V0X19mb290ZXInKSkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZXRCZWZvcmVFbGVtZW50SW5Gb290ZXIoeCksIDUwKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHVwZGF0ZVRpY2tlcihpbmRleCwgZGF0YSkge1xuICAgIGxldCBkYXRhS2V5cyA9IE9iamVjdC5rZXlzKGRhdGEpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMudXBkYXRlRGF0YShpbmRleCwgZGF0YUtleXNbaV0sIGRhdGFbZGF0YUtleXNbaV1dLCB0cnVlKTtcbiAgICB9XG4gIH1cbiAgXG4gIHN0eWxlc2hlZXQoKSB7XG4gICAgaWYgKHRoaXMuZGVmYXVsdHMuc3R5bGVfc3JjICE9PSBmYWxzZSkge1xuICAgICAgbGV0IHVybCA9IHRoaXMuZGVmYXVsdHMuc3R5bGVfc3JjIHx8IHRoaXMuZGVmYXVsdHMub3JpZ2luX3NyYyArICcvZGlzdC8nICsgdGhpcy5kZWZhdWx0cy5jc3NGaWxlTmFtZTtcbiAgICAgIGlmICghZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCdsaW5rW2hyZWY9XCInICsgdXJsICsgJ1wiXScpKXtcbiAgICAgICAgcmV0dXJuIGZldGNoU2VydmljZS5mZXRjaFN0eWxlKHVybCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuICBcbiAgd2lkZ2V0TWFpbkVsZW1lbnQoaW5kZXgpIHtcbiAgICBsZXQgZGF0YSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcbiAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX2hlYWRlclwiPicgK1xuICAgICAgJzxkaXYgY2xhc3M9XCInICsgJ2NwLXdpZGdldF9faW1nIGNwLXdpZGdldF9faW1nLScgKyBkYXRhLmN1cnJlbmN5ICsgJ1wiPicgK1xuICAgICAgJzxpbWcvPicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX21haW5cIj4nICtcbiAgICAgICgoZGF0YS5pc0RhdGEpID8gdGhpcy53aWRnZXRNYWluRWxlbWVudERhdGEoaW5kZXgpIDogdGhpcy53aWRnZXRNYWluRWxlbWVudE1lc3NhZ2UoaW5kZXgpKSArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+JztcbiAgfVxuICBcbiAgd2lkZ2V0TWFpbkVsZW1lbnREYXRhKGluZGV4KSB7XG4gICAgbGV0IGRhdGEgPSB0aGlzLnN0YXRlc1tpbmRleF07XG4gICAgcmV0dXJuICc8aDM+PGEgaHJlZj1cIicgKyB0aGlzLmNvaW5fbGluayhkYXRhLmN1cnJlbmN5KSArICdcIj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cIm5hbWVUaWNrZXJcIj4nICsgKGRhdGEudGlja2VyLm5hbWUgfHwgY3BCb290c3RyYXAuZW1wdHlEYXRhKSArICc8L3NwYW4+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzeW1ib2xUaWNrZXJcIj4nICsgKGRhdGEudGlja2VyLnN5bWJvbCB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGEpICsgJzwvc3Bhbj4nICtcbiAgICAgICc8L2E+PC9oMz4nICtcbiAgICAgICc8c3Ryb25nPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwicHJpY2VUaWNrZXIgcGFyc2VOdW1iZXJcIj4nICsgKGNwQm9vdHN0cmFwLnBhcnNlTnVtYmVyKGRhdGEudGlja2VyLnByaWNlKSB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGEpICsgJzwvc3Bhbj4gJyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJwcmltYXJ5Q3VycmVuY3lcIj4nICsgZGF0YS5wcmltYXJ5X2N1cnJlbmN5ICsgJyA8L3NwYW4+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJwcmljZV9jaGFuZ2VfMjRoVGlja2VyIGNwLXdpZGdldF9fcmFuayBjcC13aWRnZXRfX3JhbmstJyArICgoZGF0YS50aWNrZXIucHJpY2VfY2hhbmdlXzI0aCA+IDApID8gXCJ1cFwiIDogKChkYXRhLnRpY2tlci5wcmljZV9jaGFuZ2VfMjRoIDwgMCkgPyBcImRvd25cIiA6IFwibmV1dHJhbFwiKSkgKyAnXCI+KCcgKyAoY3BCb290c3RyYXAucm91bmQoZGF0YS50aWNrZXIucHJpY2VfY2hhbmdlXzI0aCwgMikgfHwgY3BCb290c3RyYXAuZW1wdHlWYWx1ZSkgKyAnJSk8L3NwYW4+JyArXG4gICAgICAnPC9zdHJvbmc+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJjcC13aWRnZXRfX3JhbmstbGFiZWxcIj48c3BhbiBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX3JhbmtcIj4nICsgdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJyYW5rXCIpICsgJzwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJyYW5rVGlja2VyXCI+JyArIChkYXRhLnRpY2tlci5yYW5rIHx8IGNwQm9vdHN0cmFwLmVtcHR5RGF0YSkgKyAnPC9zcGFuPjwvc3Bhbj4nO1xuICB9XG4gIFxuICB3aWRnZXRNYWluRWxlbWVudE1lc3NhZ2UoaW5kZXgpIHtcbiAgICBsZXQgbWVzc2FnZSA9IHRoaXMuc3RhdGVzW2luZGV4XS5tZXNzYWdlO1xuICAgIHJldHVybiAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9fbWFpbi1uby1kYXRhIGNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX21lc3NhZ2VcIj4nICsgKHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIG1lc3NhZ2UpKSArICc8L2Rpdj4nO1xuICB9XG4gIFxuICB3aWRnZXRNYXJrZXREZXRhaWxzRWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKHRoaXMuc3RhdGVzW2luZGV4XS5tb2R1bGVzLmluZGV4T2YoJ21hcmtldF9kZXRhaWxzJykgPiAtMSkgPyAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9fZGV0YWlsc1wiPicgK1xuICAgICAgdGhpcy53aWRnZXRBdGhFbGVtZW50KGluZGV4KSArXG4gICAgICB0aGlzLndpZGdldFZvbHVtZTI0aEVsZW1lbnQoaW5kZXgpICtcbiAgICAgIHRoaXMud2lkZ2V0TWFya2V0Q2FwRWxlbWVudChpbmRleCkgK1xuICAgICAgJzwvZGl2PicgOiAnJyk7XG4gIH1cbiAgXG4gIHdpZGdldEF0aEVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAnPHNtYWxsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fYXRoXCI+JyArIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwiYXRoXCIpICsgJzwvc21hbGw+JyArXG4gICAgICAnPGRpdj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInByaWNlX2F0aFRpY2tlciBwYXJzZU51bWJlclwiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlciBzaG93RGV0YWlsc0N1cnJlbmN5XCI+PC9zcGFuPicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwicGVyY2VudF9mcm9tX3ByaWNlX2F0aFRpY2tlciBjcC13aWRnZXRfX3JhbmtcIj4nICsgY3BCb290c3RyYXAuZW1wdHlEYXRhICsgJzwvc3Bhbj4nICtcbiAgICAgICc8L2Rpdj4nXG4gIH1cbiAgXG4gIHdpZGdldFZvbHVtZTI0aEVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAnPHNtYWxsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fdm9sdW1lXzI0aFwiPicgKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInZvbHVtZV8yNGhcIikgKyAnPC9zbWFsbD4nICtcbiAgICAgICc8ZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwidm9sdW1lXzI0aFRpY2tlciBwYXJzZU51bWJlclwiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlciBzaG93RGV0YWlsc0N1cnJlbmN5XCI+PC9zcGFuPicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwidm9sdW1lXzI0aF9jaGFuZ2VfMjRoVGlja2VyIGNwLXdpZGdldF9fcmFua1wiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnPC9zcGFuPicgK1xuICAgICAgJzwvZGl2Pic7XG4gIH1cbiAgXG4gIHdpZGdldE1hcmtldENhcEVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAnPHNtYWxsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fbWFya2V0X2NhcFwiPicgKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcIm1hcmtldF9jYXBcIikgKyAnPC9zbWFsbD4nICtcbiAgICAgICc8ZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwibWFya2V0X2NhcFRpY2tlciBwYXJzZU51bWJlclwiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlciBzaG93RGV0YWlsc0N1cnJlbmN5XCI+PC9zcGFuPicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwibWFya2V0X2NhcF9jaGFuZ2VfMjRoVGlja2VyIGNwLXdpZGdldF9fcmFua1wiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnPC9zcGFuPicgK1xuICAgICAgJzwvZGl2Pic7XG4gIH1cbiAgXG4gIHdpZGdldENoYXJ0RWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoXG4gICAgICBgPGRpdiBjbGFzcz1cImNwLXdpZGdldF9fY2hhcnRcIj48ZGl2IGlkPVwiJHsgdGhpcy5kZWZhdWx0cy5jbGFzc05hbWUgfS1wcmljZS1jaGFydC0keyBpbmRleCB9XCI+PC9kaXY+PC9kaXY+YFxuICAgICk7XG4gIH1cbiAgXG4gIHdpZGdldFNlbGVjdEVsZW1lbnQoaW5kZXgsIGxhYmVsKXtcbiAgICBsZXQgYnV0dG9ucyA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdGF0ZXNbaW5kZXhdW2xhYmVsKydfbGlzdCddLmxlbmd0aDsgaSsrKXtcbiAgICAgIGxldCBkYXRhID0gdGhpcy5zdGF0ZXNbaW5kZXhdW2xhYmVsKydfbGlzdCddW2ldO1xuICAgICAgYnV0dG9ucyArPSAnPGJ1dHRvbiBjbGFzcz1cIicrICgoZGF0YS50b0xvd2VyQ2FzZSgpID09PSB0aGlzLnN0YXRlc1tpbmRleF1bbGFiZWxdLnRvTG93ZXJDYXNlKCkpXG4gICAgICAgID8gJ2NwLXdpZGdldC1hY3RpdmUgJ1xuICAgICAgICA6ICcnKSArICgobGFiZWwgPT09ICdwcmltYXJ5X2N1cnJlbmN5JykgPyAnJyA6ICdjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl8nICsgZGF0YS50b0xvd2VyQ2FzZSgpKSArJ1wiIGRhdGEtb3B0aW9uPVwiJytkYXRhKydcIj4nK3RoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIGRhdGEudG9Mb3dlckNhc2UoKSkrJzwvYnV0dG9uPidcbiAgICB9XG4gICAgaWYgKGxhYmVsID09PSAncmFuZ2UnKSA7XG4gICAgbGV0IHRpdGxlID0gdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJ6b29tX2luXCIpO1xuICAgIHJldHVybiAnPGRpdiBkYXRhLXR5cGU9XCInK2xhYmVsKydcIiBjbGFzcz1cImNwLXdpZGdldC1zZWxlY3RcIj4nICtcbiAgICAgICc8bGFiZWwgY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl8nKyBsYWJlbCArJ1wiPicrdGl0bGUrJzwvbGFiZWw+JyArXG4gICAgICAnPGRpdiBjbGFzcz1cImNwLXdpZGdldC1zZWxlY3RfX29wdGlvbnNcIj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cImFycm93LWRvd24gJysgJ2NwLXdpZGdldF9fY2FwaXRhbGl6ZSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl8nICsgdGhpcy5zdGF0ZXNbaW5kZXhdW2xhYmVsXS50b0xvd2VyQ2FzZSgpICsnXCI+JysgdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgdGhpcy5zdGF0ZXNbaW5kZXhdW2xhYmVsXS50b0xvd2VyQ2FzZSgpKSArJzwvc3Bhbj4nICtcbiAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0LXNlbGVjdF9fZHJvcGRvd25cIj4nICtcbiAgICAgIGJ1dHRvbnMgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzwvZGl2Pic7XG4gIH1cbiAgXG4gIHdpZGdldEZvb3RlcihpbmRleCkge1xuICAgIGxldCBjdXJyZW5jeSA9IHRoaXMuc3RhdGVzW2luZGV4XS5jdXJyZW5jeTtcbiAgICByZXR1cm4gKCF0aGlzLnN0YXRlc1tpbmRleF0uaXNXb3JkcHJlc3MpXG4gICAgICA/ICc8cCBjbGFzcz1cImNwLXdpZGdldF9fZm9vdGVyIGNwLXdpZGdldF9fZm9vdGVyLS0nICsgaW5kZXggKyAnXCI+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9wb3dlcmVkX2J5XCI+JyArIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwicG93ZXJlZF9ieVwiKSArICcgPC9zcGFuPicgK1xuICAgICAgJzxpbWcgc3R5bGU9XCJ3aWR0aDogMTZweFwiIHNyYz1cIicgKyB0aGlzLm1haW5fbG9nb19saW5rKCkgKyAnXCIgYWx0PVwiXCIvPicgK1xuICAgICAgJzxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCInICsgdGhpcy5jb2luX2xpbmsoY3VycmVuY3kpICsgJ1wiPmNvaW5wYXByaWthLmNvbTwvYT4nICtcbiAgICAgICc8L3A+J1xuICAgICAgOiAnJztcbiAgfVxuICBcbiAgZ2V0SW1hZ2UoaW5kZXgpIHtcbiAgICBsZXQgZGF0YSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcbiAgICBsZXQgaW1nQ29udGFpbmVycyA9IGRhdGEubWFpbkVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY3Atd2lkZ2V0X19pbWcnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGltZ0NvbnRhaW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBpbWdDb250YWluZXIgPSBpbWdDb250YWluZXJzW2ldO1xuICAgICAgaW1nQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NwLXdpZGdldF9faW1nLS1oaWRkZW4nKTtcbiAgICAgIGxldCBpbWcgPSBpbWdDb250YWluZXIucXVlcnlTZWxlY3RvcignaW1nJyk7XG4gICAgICBsZXQgbmV3SW1nID0gbmV3IEltYWdlO1xuICAgICAgbmV3SW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgaW1nLnNyYyA9IG5ld0ltZy5zcmM7XG4gICAgICAgIGltZ0NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX2ltZy0taGlkZGVuJyk7XG4gICAgICB9O1xuICAgICAgbmV3SW1nLnNyYyA9IHRoaXMuaW1nX3NyYyhkYXRhLmN1cnJlbmN5KTtcbiAgICB9XG4gIH1cbiAgXG4gIGltZ19zcmMoaWQpIHtcbiAgICByZXR1cm4gJ2h0dHBzOi8vY29pbnBhcHJpa2EuY29tL2NvaW4vJyArIGlkICsgJy9sb2dvLnBuZyc7XG4gIH1cbiAgXG4gIGNvaW5fbGluayhpZCkge1xuICAgIHJldHVybiAnaHR0cHM6Ly9jb2lucGFwcmlrYS5jb20vY29pbi8nICsgaWRcbiAgfVxuICBcbiAgbWFpbl9sb2dvX2xpbmsoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYXVsdHMuaW1nX3NyYyB8fCB0aGlzLmRlZmF1bHRzLm9yaWdpbl9zcmMgKyAnL2Rpc3QvaW1nL2xvZ29fd2lkZ2V0LnN2ZydcbiAgfVxuICBcbiAgZ2V0U2NyaXB0RWxlbWVudCgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0W2RhdGEtY3AtY3VycmVuY3ktd2lkZ2V0XScpO1xuICB9XG4gIFxuICBnZXRUcmFuc2xhdGlvbihpbmRleCwgbGFiZWwpIHtcbiAgICBsZXQgdGV4dCA9ICh0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1t0aGlzLnN0YXRlc1tpbmRleF0ubGFuZ3VhZ2VdKSA/IHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW3RoaXMuc3RhdGVzW2luZGV4XS5sYW5ndWFnZV1bbGFiZWxdIDogbnVsbDtcbiAgICBpZiAoIXRleHQgJiYgdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbJ2VuJ10pIHtcbiAgICAgIHRleHQgPSB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1snZW4nXVtsYWJlbF07XG4gICAgfVxuICAgIGlmICghdGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMuYWRkTGFiZWxXaXRob3V0VHJhbnNsYXRpb24oaW5kZXgsIGxhYmVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9XG4gIFxuICBhZGRMYWJlbFdpdGhvdXRUcmFuc2xhdGlvbihpbmRleCwgbGFiZWwpIHtcbiAgICBpZiAoIXRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zWydlbiddKSB0aGlzLmdldFRyYW5zbGF0aW9ucygnZW4nKTtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZXNbaW5kZXhdLm5vVHJhbnNsYXRpb25MYWJlbHMucHVzaChsYWJlbCk7XG4gIH1cbiAgXG4gIGdldFRyYW5zbGF0aW9ucyhsYW5nKSB7XG4gICAgaWYgKCF0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXSkge1xuICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgbGV0IHVybCA9IHRoaXMuZGVmYXVsdHMubGFuZ19zcmMgfHwgdGhpcy5kZWZhdWx0cy5vcmlnaW5fc3JjICsgJy9kaXN0L2xhbmcnO1xuICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCArICcvJyArIGxhbmcgKyAnLmpzb24nKTtcbiAgICAgIHhoci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVdpZGdldFRyYW5zbGF0aW9ucyhsYW5nLCBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9uRXJyb3JSZXF1ZXN0KDAsIHhocik7XG4gICAgICAgICAgdGhpcy5nZXRUcmFuc2xhdGlvbnMoJ2VuJyk7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgeGhyLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMub25FcnJvclJlcXVlc3QoMCwgeGhyKTtcbiAgICAgICAgdGhpcy5nZXRUcmFuc2xhdGlvbnMoJ2VuJyk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXTtcbiAgICAgIH07XG4gICAgICB4aHIuc2VuZCgpO1xuICAgICAgdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ10gPSB7fTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgY2hhcnRDbGFzcyB7XG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgc3RhdGUpe1xuICAgIGlmICghY29udGFpbmVyKSByZXR1cm47XG4gICAgdGhpcy5pZCA9IGNvbnRhaW5lci5pZDtcbiAgICB0aGlzLmlzTmlnaHRNb2RlID0gc3RhdGUuaXNOaWdodE1vZGU7XG4gICAgdGhpcy5jaGFydHNXaXRoQWN0aXZlU2VyaWVzQ29va2llcyA9IFtdO1xuICAgIHRoaXMuY2hhcnQgPSBudWxsO1xuICAgIHRoaXMuY3VycmVuY3kgPSBzdGF0ZS5jdXJyZW5jeTtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLnNldE9wdGlvbnMoKTtcbiAgICB0aGlzLmRlZmF1bHRSYW5nZSA9IHN0YXRlLnJhbmdlIHx8ICc3ZCc7XG4gICAgdGhpcy5jYWxsYmFjayA9IG51bGw7XG4gICAgdGhpcy5yZXBsYWNlQ2FsbGJhY2sgPSBudWxsO1xuICAgIHRoaXMuZXh0cmVtZXNEYXRhVXJsID0gdGhpcy5nZXRFeHRyZW1lc0RhdGFVcmwoY29udGFpbmVyLmlkKTtcbiAgICB0aGlzLmRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgY2hhcnQ6IHtcbiAgICAgICAgYWxpZ25UaWNrczogZmFsc2UsXG4gICAgICAgIG1hcmdpblRvcDogNTAsXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgZm9udEZhbWlseTogJ3NhbnMtc2VyaWYnLFxuICAgICAgICB9LFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICByZW5kZXI6IChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZS50YXJnZXQuYW5ub3RhdGlvbnMpIHtcbiAgICAgICAgICAgICAgbGV0IGNoYXJ0ID0gZS50YXJnZXQuYW5ub3RhdGlvbnMuY2hhcnQ7XG4gICAgICAgICAgICAgIGNwQm9vdHN0cmFwLmxvb3AoY2hhcnQuYW5ub3RhdGlvbnMuYWxsSXRlbXMsIGFubm90YXRpb24gPT4ge1xuICAgICAgICAgICAgICAgIGxldCB5ID0gY2hhcnQucGxvdEhlaWdodCArIGNoYXJ0LnBsb3RUb3AgLSBjaGFydC5zcGFjaW5nWzBdIC0gMiAtICgodGhpcy5pc1Jlc3BvbnNpdmVNb2RlQWN0aXZlKGNoYXJ0KSkgPyAxMCA6IDApO1xuICAgICAgICAgICAgICAgIGFubm90YXRpb24udXBkYXRlKHt5fSwgdHJ1ZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgc2Nyb2xsYmFyOiB7XG4gICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIGFubm90YXRpb25zT3B0aW9uczoge1xuICAgICAgICBlbmFibGVkQnV0dG9uczogZmFsc2UsXG4gICAgICB9LFxuICAgICAgcmFuZ2VTZWxlY3Rvcjoge1xuICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICBwbG90T3B0aW9uczoge1xuICAgICAgICBsaW5lOiB7XG4gICAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgICBzdGF0ZXM6IHtcbiAgICAgICAgICAgICAgaG92ZXI6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICBsZWdlbmRJdGVtQ2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXZlbnQuYnJvd3NlckV2ZW50LmlzVHJ1c3RlZCl7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhcnRzV2l0aEFjdGl2ZVNlcmllc0Nvb2tpZXMuaW5kZXhPZihldmVudC50YXJnZXQuY2hhcnQucmVuZGVyVG8uaWQpID4gLTEpIHRoaXMuc2V0VmlzaWJsZUNoYXJ0Q29va2llcyhldmVudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gT24gaU9TIHRvdWNoIGV2ZW50IGZpcmVzIHNlY29uZCBjYWxsYmFjayBmcm9tIEpTIChpc1RydXN0ZWQ6IGZhbHNlKSB3aGljaFxuICAgICAgICAgICAgICAvLyByZXN1bHRzIHdpdGggdG9nZ2xlIGJhY2sgdGhlIGNoYXJ0IChwcm9iYWJseSBpdHMgYSBwcm9ibGVtIHdpdGggVUlLaXQsIGJ1dCBub3Qgc3VyZSlcbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2xlZ2VuZEl0ZW1DbGljaycsIHtldmVudCwgaXNUcnVzdGVkOiBldmVudC5icm93c2VyRXZlbnQuaXNUcnVzdGVkfSk7XG4gICAgICAgICAgICAgIHJldHVybiBldmVudC5icm93c2VyRXZlbnQuaXNUcnVzdGVkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgeEF4aXM6IHtcbiAgICAgICAgb3JkaW5hbDogZmFsc2VcbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMuY2hhcnREYXRhUGFyc2VyID0gKGRhdGEpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBkYXRhID0gZGF0YVswXTtcbiAgICAgICAgY29uc3QgcHJpY2VDdXJyZW5jeSA9IHN0YXRlLnByaW1hcnlfY3VycmVuY3kudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoe1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHByaWNlOiAoZGF0YS5wcmljZSlcbiAgICAgICAgICAgICAgPyBkYXRhLnByaWNlXG4gICAgICAgICAgICAgIDogKChkYXRhW3ByaWNlQ3VycmVuY3ldKVxuICAgICAgICAgICAgICAgID8gZGF0YVtwcmljZUN1cnJlbmN5XVxuICAgICAgICAgICAgICAgIDogW10pLFxuICAgICAgICAgICAgdm9sdW1lOiBkYXRhLnZvbHVtZSB8fCBbXSxcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB0aGlzLmlzRXZlbnRzSGlkZGVuID0gZmFsc2U7XG4gICAgdGhpcy5leGNsdWRlU2VyaWVzSWRzID0gW107XG4gICAgdGhpcy5hc3luY1VybCA9IGAvY3VycmVuY3kvZGF0YS8keyBzdGF0ZS5jdXJyZW5jeSB9L19yYW5nZV8vYDtcbiAgICB0aGlzLmFzeW5jUGFyYW1zID0gYD9xdW90ZT0keyBzdGF0ZS5wcmltYXJ5X2N1cnJlbmN5LnRvVXBwZXJDYXNlKCkgfSZmaWVsZHM9cHJpY2Usdm9sdW1lYDtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuICBcbiAgc2V0T3B0aW9ucygpe1xuICAgIGNvbnN0IGNoYXJ0U2VydmljZSA9IG5ldyBjaGFydENsYXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3BvbnNpdmU6IHtcbiAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb25kaXRpb246IHtcbiAgICAgICAgICAgICAgbWF4V2lkdGg6IDE1MDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hhcnRPcHRpb25zOiB7XG4gICAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgIGFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuICAgICAgICAgICAgICAgIHk6IDkyLFxuICAgICAgICAgICAgICAgIHN5bWJvbFJhZGl1czogMCxcbiAgICAgICAgICAgICAgICBpdGVtRGlzdGFuY2U6IDIwLFxuICAgICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgIGhlaWdodDogNDAwLFxuICAgICAgICAgICAgICAgIG1hcmdpblRvcDogMzUsXG4gICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAwLFxuICAgICAgICAgICAgICAgIHNwYWNpbmdUb3A6IDAsXG4gICAgICAgICAgICAgICAgc3BhY2luZ0JvdHRvbTogMCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbmF2aWdhdG9yOiB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgICAgICAgICAgICBtYXJnaW46IDcwLFxuICAgICAgICAgICAgICAgIGhhbmRsZXM6IHtcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogMjUsXG4gICAgICAgICAgICAgICAgICB3aWR0aDogMTcsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb25kaXRpb246IHtcbiAgICAgICAgICAgICAgbWF4V2lkdGg6IDYwMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGFydE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IDAsXG4gICAgICAgICAgICAgICAgem9vbVR5cGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IDEwLFxuICAgICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiAxMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM1MCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgeUF4aXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tBbW91bnQ6IDcsXG4gICAgICAgICAgICAgICAgICB0aWNrV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrTGVuZ3RoOiAwLFxuICAgICAgICAgICAgICAgICAgbGluZVdpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgYWxpZ246IFwibGVmdFwiLFxuICAgICAgICAgICAgICAgICAgICB4OiAxLFxuICAgICAgICAgICAgICAgICAgICB5OiAtMixcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM5ZTllOWUnLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnOXB4JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGZsb29yOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0Ftb3VudDogNyxcbiAgICAgICAgICAgICAgICAgIHRpY2tXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tMZW5ndGg6IDAsXG4gICAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICAgICAgICBhbGlnbjogXCJyaWdodFwiLFxuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogXCJqdXN0aWZ5XCIsXG4gICAgICAgICAgICAgICAgICAgIHg6IDEsXG4gICAgICAgICAgICAgICAgICAgIHk6IC0yLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzUwODVlYycsXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICc5cHgnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgIG1heFdpZHRoOiA0NTBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGFydE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgYWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ21pZGRsZScsXG4gICAgICAgICAgICAgICAgeTogODIsXG4gICAgICAgICAgICAgICAgc3ltYm9sUmFkaXVzOiAwLFxuICAgICAgICAgICAgICAgIGl0ZW1EaXN0YW5jZTogMjAsXG4gICAgICAgICAgICAgICAgaXRlbVN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG5hdmlnYXRvcjoge1xuICAgICAgICAgICAgICAgIG1hcmdpbjogNjAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA0MCxcbiAgICAgICAgICAgICAgICBoYW5kbGVzOiB7XG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6IDIwLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwMCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgeUF4aXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tBbW91bnQ6IDcsXG4gICAgICAgICAgICAgICAgICB0aWNrV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrTGVuZ3RoOiAwLFxuICAgICAgICAgICAgICAgICAgbGluZVdpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgYWxpZ246IFwibGVmdFwiLFxuICAgICAgICAgICAgICAgICAgICB4OiAxLFxuICAgICAgICAgICAgICAgICAgICB5OiAtMixcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM5ZTllOWUnLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnOXB4JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGZsb29yOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0Ftb3VudDogNyxcbiAgICAgICAgICAgICAgICAgIHRpY2tXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tMZW5ndGg6IDAsXG4gICAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICAgICAgICBhbGlnbjogXCJyaWdodFwiLFxuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogXCJqdXN0aWZ5XCIsXG4gICAgICAgICAgICAgICAgICAgIHg6IDEsXG4gICAgICAgICAgICAgICAgICAgIHk6IC0yLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzUwODVlYycsXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICc5cHgnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHRpdGxlOiB7XG4gICAgICAgIHRleHQ6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgICBjaGFydDoge1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdub25lJyxcbiAgICAgICAgbWFyZ2luVG9wOiA1MCxcbiAgICAgICAgcGxvdEJvcmRlcldpZHRoOiAwLFxuICAgICAgfSxcbiAgICAgIGNwRXZlbnRzOiBmYWxzZSxcbiAgICAgIGNvbG9yczogW1xuICAgICAgICAnIzUwODVlYycsXG4gICAgICAgICcjMWY5ODA5JyxcbiAgICAgICAgJyM5ODVkNjUnLFxuICAgICAgICAnI2VlOTgzYicsXG4gICAgICAgICcjNGM0YzRjJyxcbiAgICAgIF0sXG4gICAgICBsZWdlbmQ6IHtcbiAgICAgICAgbWFyZ2luOiAwLFxuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICBhbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgc3ltYm9sUmFkaXVzOiAwLFxuICAgICAgICBpdGVtRGlzdGFuY2U6IDQwLFxuICAgICAgICBpdGVtU3R5bGU6IHtcbiAgICAgICAgICBmb250V2VpZ2h0OiAnbm9ybWFsJyxcbiAgICAgICAgICBjb2xvcjogKHRoaXMuaXNOaWdodE1vZGUpID8gJyM4MGE2ZTUnIDogJyMwNjQ1YWQnLFxuICAgICAgICB9LFxuICAgICAgICBpdGVtTWFyZ2luVG9wOiA4LFxuICAgICAgfSxcbiAgICAgIG5hdmlnYXRvcjogdHJ1ZSxcbiAgICAgIHRvb2x0aXA6IHtcbiAgICAgICAgc2hhcmVkOiB0cnVlLFxuICAgICAgICBzcGxpdDogZmFsc2UsXG4gICAgICAgIGFuaW1hdGlvbjogZmFsc2UsXG4gICAgICAgIGJvcmRlcldpZHRoOiAxLFxuICAgICAgICBib3JkZXJDb2xvcjogKHRoaXMuaXNOaWdodE1vZGUpID8gJyM0YzRjNGMnIDogJyNlM2UzZTMnLFxuICAgICAgICBoaWRlRGVsYXk6IDEwMCxcbiAgICAgICAgc2hhZG93OiBmYWxzZSxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgY29sb3I6ICcjNGM0YzRjJyxcbiAgICAgICAgICBmb250U2l6ZTogJzEwcHgnLFxuICAgICAgICB9LFxuICAgICAgICB1c2VIVE1MOiB0cnVlLFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuIGNoYXJ0U2VydmljZS50b29sdGlwRm9ybWF0dGVyKHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIFxuICAgICAgZXhwb3J0aW5nOiB7XG4gICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICBjb250ZXh0QnV0dG9uOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFxuICAgICAgeEF4aXM6IHtcbiAgICAgICAgbGluZUNvbG9yOiAodGhpcy5pc05pZ2h0TW9kZSkgPyAnIzUwNTA1MCcgOiAnI2UzZTNlMycsXG4gICAgICAgIHRpY2tDb2xvcjogKHRoaXMuaXNOaWdodE1vZGUpID8gJyM1MDUwNTAnIDogJyNlM2UzZTMnLFxuICAgICAgICB0aWNrTGVuZ3RoOiA3LFxuICAgICAgfSxcbiAgICAgIFxuICAgICAgeUF4aXM6IFt7IC8vIFZvbHVtZSB5QXhpc1xuICAgICAgICBsaW5lV2lkdGg6IDEsXG4gICAgICAgIGxpbmVDb2xvcjogJyNkZWRlZGUnLFxuICAgICAgICB0aWNrV2lkdGg6IDEsXG4gICAgICAgIHRpY2tMZW5ndGg6IDQsXG4gICAgICAgIGdyaWRMaW5lRGFzaFN0eWxlOiAnZGFzaCcsXG4gICAgICAgIGdyaWRMaW5lV2lkdGg6IDAsXG4gICAgICAgIGZsb29yOiAwLFxuICAgICAgICBtaW5QYWRkaW5nOiAwLFxuICAgICAgICBvcHBvc2l0ZTogZmFsc2UsXG4gICAgICAgIHNob3dFbXB0eTogZmFsc2UsXG4gICAgICAgIHNob3dMYXN0TGFiZWw6IGZhbHNlLFxuICAgICAgICBzaG93Rmlyc3RMYWJlbDogZmFsc2UsXG4gICAgICB9LCB7XG4gICAgICAgIGdyaWRMaW5lQ29sb3I6ICh0aGlzLmlzTmlnaHRNb2RlKSA/ICcjNTA1MDUwJyA6ICcjZTNlM2UzJyxcbiAgICAgICAgZ3JpZExpbmVEYXNoU3R5bGU6ICdkYXNoJyxcbiAgICAgICAgbGluZVdpZHRoOiAxLFxuICAgICAgICB0aWNrV2lkdGg6IDEsXG4gICAgICAgIHRpY2tMZW5ndGg6IDQsXG4gICAgICAgIGZsb29yOiAwLFxuICAgICAgICBtaW5QYWRkaW5nOiAwLFxuICAgICAgICBzaG93RW1wdHk6IGZhbHNlLFxuICAgICAgICBvcHBvc2l0ZTogdHJ1ZSxcbiAgICAgICAgZ3JpZFpJbmRleDogNCxcbiAgICAgICAgc2hvd0xhc3RMYWJlbDogZmFsc2UsXG4gICAgICAgIHNob3dGaXJzdExhYmVsOiBmYWxzZSxcbiAgICAgIH1dLFxuICAgICAgXG4gICAgICBzZXJpZXM6IFtcbiAgICAgICAgeyAvL29yZGVyIG9mIHRoZSBzZXJpZXMgbWF0dGVyc1xuICAgICAgICAgIGNvbG9yOiAnIzUwODVlYycsXG4gICAgICAgICAgbmFtZTogJ1ByaWNlJyxcbiAgICAgICAgICBpZDogJ3ByaWNlJyxcbiAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgICB0eXBlOiAnYXJlYScsXG4gICAgICAgICAgZmlsbE9wYWNpdHk6IDAuMTUsXG4gICAgICAgICAgbGluZVdpZHRoOiAyLFxuICAgICAgICAgIHlBeGlzOiAxLFxuICAgICAgICAgIHpJbmRleDogMixcbiAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgIGNsaWNrYWJsZTogdHJ1ZSxcbiAgICAgICAgICB0aHJlc2hvbGQ6IG51bGwsXG4gICAgICAgICAgdG9vbHRpcDoge1xuICAgICAgICAgICAgdmFsdWVEZWNpbWFsczogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2hvd0luTmF2aWdhdG9yOiB0cnVlLFxuICAgICAgICAgIHNob3dJbkxlZ2VuZDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjb2xvcjogYHVybCgjZmlsbC1wYXR0ZXJuJHsodGhpcy5pc05pZ2h0TW9kZSkgPyAnLW5pZ2h0JyA6ICcnfSlgLFxuICAgICAgICAgIG5hbWU6ICdWb2x1bWUnLFxuICAgICAgICAgIGlkOiAndm9sdW1lJyxcbiAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgICB0eXBlOiAnYXJlYScsXG4gICAgICAgICAgZmlsbE9wYWNpdHk6IDAuNSxcbiAgICAgICAgICBsaW5lV2lkdGg6IDAsXG4gICAgICAgICAgeUF4aXM6IDAsXG4gICAgICAgICAgekluZGV4OiAwLFxuICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgY2xpY2thYmxlOiB0cnVlLFxuICAgICAgICAgIHRocmVzaG9sZDogbnVsbCxcbiAgICAgICAgICB0b29sdGlwOiB7XG4gICAgICAgICAgICB2YWx1ZURlY2ltYWxzOiAwLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2hvd0luTmF2aWdhdG9yOiB0cnVlLFxuICAgICAgICB9XVxuICAgIH1cbiAgfVxuICBcbiAgaW5pdCgpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZU9wdGlvbnModGhpcy5vcHRpb25zKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChvcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gKHdpbmRvdy5IaWdoY2hhcnRzKSA/IEhpZ2hjaGFydHMuc3RvY2tDaGFydCh0aGlzLmNvbnRhaW5lci5pZCwgb3B0aW9ucywgKGNoYXJ0KSA9PiB0aGlzLmJpbmQoY2hhcnQpKSA6IG51bGw7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHBhcnNlT3B0aW9ucyhvcHRpb25zKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLnVwZGF0ZU9iamVjdCh0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChuZXdPcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAudXBkYXRlT2JqZWN0KHRoaXMuZ2V0Vm9sdW1lUGF0dGVybigpLCBuZXdPcHRpb25zKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChuZXdPcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zZXROYXZpZ2F0b3IobmV3T3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigobmV3T3B0aW9ucykgPT4ge1xuICAgICAgcmV0dXJuIChuZXdPcHRpb25zLm5vRGF0YSkgPyB0aGlzLnNldE5vRGF0YUxhYmVsKG5ld09wdGlvbnMpIDogbmV3T3B0aW9ucztcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChuZXdPcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gbmV3T3B0aW9ucztcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgYmluZChjaGFydCl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNoYXJ0ID0gY2hhcnQ7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5mZXRjaERhdGFQYWNrYWdlKCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRSYW5nZVN3aXRjaGVyKCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gKHRoaXMuY2FsbGJhY2spID8gdGhpcy5jYWxsYmFjayh0aGlzLmNoYXJ0LCB0aGlzLmRlZmF1bHRSYW5nZSkgOiBudWxsO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBmZXRjaERhdGFQYWNrYWdlKG1pbkRhdGUsIG1heERhdGUpe1xuICAgIGxldCBpc1ByZWNpc2VSYW5nZSA9IChtaW5EYXRlICYmIG1heERhdGUpO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNwRXZlbnRzKXtcbiAgICAgICAgbGV0IHVybCA9IChpc1ByZWNpc2VSYW5nZSkgPyB0aGlzLmdldE5hdmlnYXRvckV4dHJlbWVzVXJsKG1pbkRhdGUsIG1heERhdGUsICdldmVudHMnKSA6IHRoaXMuZ2V0RXh0cmVtZXNEYXRhVXJsKHRoaXMuaWQsICdldmVudHMnKSArICcvJyArIHRoaXMuZ2V0UmFuZ2UoKSArICcvJztcbiAgICAgICAgcmV0dXJuICh1cmwpID8gdGhpcy5mZXRjaERhdGEodXJsLCAnZXZlbnRzJywgIWlzUHJlY2lzZVJhbmdlKSA6IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGxldCB1cmwgPSAoKGlzUHJlY2lzZVJhbmdlKSA/IHRoaXMuZ2V0TmF2aWdhdG9yRXh0cmVtZXNVcmwobWluRGF0ZSwgbWF4RGF0ZSkgOiB0aGlzLmFzeW5jVXJsLnJlcGxhY2UoJ19yYW5nZV8nLCB0aGlzLmdldFJhbmdlKCkpKSArIHRoaXMuYXN5bmNQYXJhbXM7XG4gICAgICByZXR1cm4gKHVybCkgPyB0aGlzLmZldGNoRGF0YSh1cmwsICdkYXRhJywgIWlzUHJlY2lzZVJhbmdlKSA6IG51bGw7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFydC5yZWRyYXcoZmFsc2UpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuICghaXNQcmVjaXNlUmFuZ2UpID8gdGhpcy5jaGFydC56b29tT3V0KCkgOiBudWxsO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaXNMb2FkZWQgPSB0cnVlO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMudG9nZ2xlRXZlbnRzKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGZldGNoRGF0YSh1cmwsIGRhdGFUeXBlID0gJ2RhdGEnLCByZXBsYWNlID0gdHJ1ZSl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuY2hhcnQuc2hvd0xvYWRpbmcoKTtcbiAgICAgIHJldHVybiBmZXRjaFNlcnZpY2UuZmV0Y2hDaGFydERhdGEodXJsLCAhdGhpcy5pc0xvYWRlZCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHRoaXMuY2hhcnQuaGlkZUxvYWRpbmcoKTtcbiAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICByZXR1cm4gY29uc29sZS5sb2coYExvb2tzIGxpa2UgdGhlcmUgd2FzIGEgcHJvYmxlbS4gU3RhdHVzIENvZGU6ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhUGFyc2VyKGRhdGEsIGRhdGFUeXBlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGNvbnRlbnQpID0+IHtcbiAgICAgICAgICByZXR1cm4gKHJlcGxhY2UpID8gdGhpcy5yZXBsYWNlRGF0YShjb250ZW50LmRhdGEsIGRhdGFUeXBlKSA6IHRoaXMudXBkYXRlRGF0YShjb250ZW50LmRhdGEsIGRhdGFUeXBlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICB0aGlzLmNoYXJ0LmhpZGVMb2FkaW5nKCk7XG4gICAgICB0aGlzLmhpZGVDaGFydCgpO1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCdGZXRjaCBFcnJvcicsIGVycm9yKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgaGlkZUNoYXJ0KGJvb2wgPSB0cnVlKXtcbiAgICBjb25zdCBjbGFzc0Z1bmMgPSAoYm9vbCkgPyAnYWRkJyA6ICdyZW1vdmUnO1xuICAgIGNvbnN0IHNpYmxpbmdzID0gY3BCb290c3RyYXAubm9kZUxpc3RUb0FycmF5KHRoaXMuY29udGFpbmVyLnBhcmVudEVsZW1lbnQuY2hpbGROb2Rlcyk7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBzaWJsaW5ncy5maWx0ZXIoZWxlbWVudCA9PiBlbGVtZW50LmlkLnNlYXJjaCgnY2hhcnQnKSA9PT0gLTEpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AocmVzdWx0LCBlbGVtZW50ID0+IGVsZW1lbnQuY2xhc3NMaXN0W2NsYXNzRnVuY10oJ2NwLWhpZGRlbicpKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRhaW5lci5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdFtjbGFzc0Z1bmNdKCdjcC1jaGFydC1uby1kYXRhJyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHNldFJhbmdlU3dpdGNoZXIoKXtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGAkeyB0aGlzLmlkIH0tc3dpdGNoLXJhbmdlYCwgKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLmRlZmF1bHRSYW5nZSA9IGV2ZW50LmRldGFpbC5kYXRhO1xuICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hEYXRhUGFja2FnZSgpO1xuICAgIH0pO1xuICB9XG4gIFxuICBnZXRSYW5nZSgpe1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRSYW5nZSB8fCAnMXEnO1xuICB9XG4gIFxuICB0b2dnbGVFdmVudHMoKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY3BFdmVudHMpe1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdoaWdoY2hhcnRzLWFubm90YXRpb24nKTtcbiAgICAgIH0pO1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoZWxlbWVudHMpID0+IHtcbiAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AoZWxlbWVudHMsIGVsZW1lbnQgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmlzRXZlbnRzSGlkZGVuKXtcbiAgICAgICAgICAgIHJldHVybiAoIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWdoY2hhcnRzLWFubm90YXRpb25fX2hpZGRlbicpKSA/IGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlnaGNoYXJ0cy1hbm5vdGF0aW9uX19oaWRkZW4nKSA6IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZ2hjaGFydHMtYW5ub3RhdGlvbl9faGlkZGVuJykpID8gZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdoY2hhcnRzLWFubm90YXRpb25fX2hpZGRlbicpIDogbnVsbDtcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdoaWdoY2hhcnRzLXBsb3QtbGluZScpO1xuICAgICAgfSk7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChlbGVtZW50cykgPT4ge1xuICAgICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChlbGVtZW50cywgZWxlbWVudCA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNFdmVudHNIaWRkZW4pe1xuICAgICAgICAgICAgcmV0dXJuICghZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZ2hjaGFydHMtcGxvdC1saW5lX19oaWRkZW4nKSkgPyBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZ2hjaGFydHMtcGxvdC1saW5lX19oaWRkZW4nKSA6IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZ2hjaGFydHMtcGxvdC1saW5lX19oaWRkZW4nKSkgPyBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hjaGFydHMtcGxvdC1saW5lX19oaWRkZW4nKSA6IG51bGw7XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGRhdGFQYXJzZXIoZGF0YSwgZGF0YVR5cGUgPSAnZGF0YScpe1xuICAgIHN3aXRjaCAoZGF0YVR5cGUpe1xuICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgIGxldCBwcm9taXNlRGF0YSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlRGF0YSA9IHByb21pc2VEYXRhLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiAodGhpcy5jaGFydERhdGFQYXJzZXIpID8gdGhpcy5jaGFydERhdGFQYXJzZXIoZGF0YSkgOiB7XG4gICAgICAgICAgICBkYXRhOiBkYXRhWzBdLFxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZURhdGE7XG4gICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGRhdGEpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIFxuICB1cGRhdGVEYXRhKGRhdGEsIGRhdGFUeXBlKSB7XG4gICAgbGV0IG5ld0RhdGE7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHN3aXRjaCAoZGF0YVR5cGUpIHtcbiAgICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgICAgbmV3RGF0YSA9IHt9O1xuICAgICAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKE9iamVjdC5lbnRyaWVzKGRhdGEpLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRXhjbHVkZWQodmFsdWVbMF0pKSByZXR1cm47XG4gICAgICAgICAgICBsZXQgb2xkRGF0YSA9IHRoaXMuZ2V0T2xkRGF0YShkYXRhVHlwZSlbdmFsdWVbMF1dO1xuICAgICAgICAgICAgbmV3RGF0YVt2YWx1ZVswXV0gPSBvbGREYXRhXG4gICAgICAgICAgICAgIC5maWx0ZXIoKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVbMV0uZmluZEluZGV4KGZpbmRFbGVtZW50ID0+IHRoaXMuaXNUaGVTYW1lRWxlbWVudChlbGVtZW50LCBmaW5kRWxlbWVudCwgZGF0YVR5cGUpKSA9PT0gLTE7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5jb25jYXQodmFsdWVbMV0pXG4gICAgICAgICAgICAgIC5zb3J0KChkYXRhMSwgZGF0YTIpID0+IHRoaXMuc29ydENvbmRpdGlvbihkYXRhMSwgZGF0YTIsIGRhdGFUeXBlKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgICAgbmV3RGF0YSA9IFtdO1xuICAgICAgICAgIGxldCBvbGREYXRhID0gdGhpcy5nZXRPbGREYXRhKGRhdGFUeXBlKTtcbiAgICAgICAgICByZXR1cm4gbmV3RGF0YSA9IG9sZERhdGFcbiAgICAgICAgICAgIC5maWx0ZXIoKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgZGF0YS5maW5kSW5kZXgoZmluZEVsZW1lbnQgPT4gdGhpcy5pc1RoZVNhbWVFbGVtZW50KGVsZW1lbnQsIGZpbmRFbGVtZW50LCBkYXRhVHlwZSkpID09PSAtMTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY29uY2F0KGRhdGEpXG4gICAgICAgICAgICAuc29ydCgoZGF0YTEsIGRhdGEyKSA9PiB0aGlzLnNvcnRDb25kaXRpb24oZGF0YTEsIGRhdGEyLCBkYXRhVHlwZSkpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VEYXRhKG5ld0RhdGEsIGRhdGFUeXBlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgaXNUaGVTYW1lRWxlbWVudChlbGVtZW50QSwgZWxlbWVudEIsIGRhdGFUeXBlKXtcbiAgICBzd2l0Y2ggKGRhdGFUeXBlKXtcbiAgICAgIGNhc2UgJ2RhdGEnOlxuICAgICAgICByZXR1cm4gZWxlbWVudEFbMF0gPT09IGVsZW1lbnRCWzBdO1xuICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRBLnRzID09PSBlbGVtZW50Qi50cztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgXG4gIHNvcnRDb25kaXRpb24oZWxlbWVudEEsIGVsZW1lbnRCLCBkYXRhVHlwZSl7XG4gICAgc3dpdGNoIChkYXRhVHlwZSl7XG4gICAgICBjYXNlICdkYXRhJzpcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRBWzBdIC0gZWxlbWVudEJbMF07XG4gICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICByZXR1cm4gZWxlbWVudEEudHMgLSBlbGVtZW50Qi50cztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgXG4gIGdldE9sZERhdGEoZGF0YVR5cGUpe1xuICAgIHJldHVybiB0aGlzWydjaGFydF8nK2RhdGFUeXBlLnRvTG93ZXJDYXNlKCldO1xuICB9XG4gIFxuICByZXBsYWNlRGF0YShkYXRhLCBkYXRhVHlwZSl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzWydjaGFydF8nK2RhdGFUeXBlLnRvTG93ZXJDYXNlKCldID0gZGF0YTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VEYXRhVHlwZShkYXRhLCBkYXRhVHlwZSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gKHRoaXMucmVwbGFjZUNhbGxiYWNrKSA/IHRoaXMucmVwbGFjZUNhbGxiYWNrKHRoaXMuY2hhcnQsIGRhdGEsIHRoaXMuaXNMb2FkZWQsIGRhdGFUeXBlKSA6IG51bGw7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHJlcGxhY2VEYXRhVHlwZShkYXRhLCBkYXRhVHlwZSl7XG4gICAgc3dpdGNoIChkYXRhVHlwZSl7XG4gICAgICBjYXNlICdkYXRhJzpcbiAgICAgICAgaWYgKHRoaXMuYXN5bmNVcmwpe1xuICAgICAgICAgIGNwQm9vdHN0cmFwLmxvb3AoWydidGMtYml0Y29pbicsICdldGgtZXRoZXJldW0nXSwgY29pbk5hbWUgPT4ge1xuICAgICAgICAgICAgbGV0IGNvaW5TaG9ydCA9IGNvaW5OYW1lLnNwbGl0KCctJylbMF07XG4gICAgICAgICAgICBpZiAodGhpcy5hc3luY1VybC5zZWFyY2goY29pbk5hbWUpID4gLTEgJiYgZGF0YVtjb2luU2hvcnRdKSB7XG4gICAgICAgICAgICAgIGRhdGFbY29pblNob3J0XSA9IFtdO1xuICAgICAgICAgICAgICBjcEJvb3RzdHJhcC5sb29wKHRoaXMuY2hhcnQuc2VyaWVzLCBzZXJpZXMgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzZXJpZXMudXNlck9wdGlvbnMuaWQgPT09IGNvaW5TaG9ydCkgc2VyaWVzLnVwZGF0ZSh7IHZpc2libGU6IGZhbHNlIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChPYmplY3QuZW50cmllcyhkYXRhKSwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNFeGNsdWRlZCh2YWx1ZVswXSkpIHJldHVybjtcbiAgICAgICAgICByZXR1cm4gKHRoaXMuY2hhcnQuZ2V0KHZhbHVlWzBdKSkgPyB0aGlzLmNoYXJ0LmdldCh2YWx1ZVswXSkuc2V0RGF0YSh2YWx1ZVsxXSwgZmFsc2UsIGZhbHNlLCBmYWxzZSkgOiB0aGlzLmNoYXJ0LmFkZFNlcmllcyh7aWQ6IHZhbHVlWzBdLCBkYXRhOiB2YWx1ZVsxXSwgc2hvd0luTmF2aWdhdG9yOiB0cnVlfSk7XG4gICAgICAgIH0pO1xuICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AodGhpcy5jaGFydC5hbm5vdGF0aW9ucy5hbGxJdGVtcywgYW5ub3RhdGlvbiA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYW5ub3RhdGlvbi5kZXN0cm95KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRBbm5vdGF0aW9uc09iamVjdHMoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuICBcbiAgaXNFeGNsdWRlZChsYWJlbCl7XG4gICAgcmV0dXJuIHRoaXMuZXhjbHVkZVNlcmllc0lkcy5pbmRleE9mKGxhYmVsKSA+IC0xO1xuICB9XG4gIFxuICB0b29sdGlwRm9ybWF0dGVyKHBvaW50ZXIsIGxhYmVsID0gJycsIHNlYXJjaCl7XG4gICAgaWYgKCFzZWFyY2gpIHNlYXJjaCA9IGxhYmVsO1xuICAgIGNvbnN0IGhlYWRlciA9ICc8ZGl2IGNsYXNzPVwiY3AtY2hhcnQtdG9vbHRpcC1jdXJyZW5jeVwiPjxzbWFsbD4nK25ldyBEYXRlKHBvaW50ZXIueCkudG9VVENTdHJpbmcoKSsnPC9zbWFsbD48dGFibGU+JztcbiAgICBjb25zdCBmb290ZXIgPSAnPC90YWJsZT48L2Rpdj4nO1xuICAgIGxldCBjb250ZW50ID0gJyc7XG4gICAgcG9pbnRlci5wb2ludHMuZm9yRWFjaChwb2ludCA9PiB7XG4gICAgICBjb250ZW50ICs9ICc8dHI+JyArXG4gICAgICAgICc8dGQ+JyArXG4gICAgICAgICc8c3ZnIHdpZHRoPVwiNVwiIGhlaWdodD1cIjVcIj48cmVjdCB4PVwiMFwiIHk9XCIwXCIgd2lkdGg9XCI1XCIgaGVpZ2h0PVwiNVwiIGZpbGw9XCInK3BvaW50LnNlcmllcy5jb2xvcisnXCIgZmlsbC1vcGFjaXR5PVwiMVwiPjwvcmVjdD48L3N2Zz4nICtcbiAgICAgICAgcG9pbnQuc2VyaWVzLm5hbWUgKyAnOiAnICsgcG9pbnQueS50b0xvY2FsZVN0cmluZygncnUtUlUnLCB7IG1heGltdW1GcmFjdGlvbkRpZ2l0czogOCB9KSArICcgJyArICgocG9pbnQuc2VyaWVzLm5hbWUudG9Mb3dlckNhc2UoKS5zZWFyY2goc2VhcmNoLnRvTG93ZXJDYXNlKCkpID4gLTEpID8gXCJcIiA6IGxhYmVsKSArXG4gICAgICAgICc8L3RkPicgK1xuICAgICAgICAnPC90cj4nO1xuICAgIH0pO1xuICAgIHJldHVybiBoZWFkZXIgKyBjb250ZW50ICsgZm9vdGVyO1xuICB9XG4gIFxuICBzZXRBbm5vdGF0aW9uc09iamVjdHMoZGF0YSl7XG4gICAgdGhpcy5jaGFydC5zZXJpZXNbMF0ueEF4aXMucmVtb3ZlUGxvdExpbmUoKTtcbiAgICBsZXQgcGxvdExpbmVzID0gW107XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBkYXRhLnNvcnQoKGRhdGExLCBkYXRhMikgPT4ge1xuICAgICAgICByZXR1cm4gZGF0YTIudHMgLSBkYXRhMS50cztcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AoZGF0YSwgZWxlbWVudCA9PiB7XG4gICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBwbG90TGluZXMucHVzaCh7XG4gICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgIHZhbHVlOiBlbGVtZW50LnRzLFxuICAgICAgICAgICAgZGFzaFN0eWxlOiAnc29saWQnLFxuICAgICAgICAgICAgekluZGV4OiA0LFxuICAgICAgICAgICAgY29sb3I6IHRoaXMuZ2V0RXZlbnRUYWdQYXJhbXMoKS5jb2xvcixcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNoYXJ0LmFkZEFubm90YXRpb24oe1xuICAgICAgICAgICAgeFZhbHVlOiBlbGVtZW50LnRzLFxuICAgICAgICAgICAgeTogMCxcbiAgICAgICAgICAgIHRpdGxlOiBgPHNwYW4gdGl0bGU9XCJDbGljayB0byBvcGVuXCIgY2xhc3M9XCJjcC1jaGFydC1hbm5vdGF0aW9uX190ZXh0XCI+JHsgdGhpcy5nZXRFdmVudFRhZ1BhcmFtcyhlbGVtZW50LnRhZykubGFiZWwgfTwvc3Bhbj48c3BhbiBjbGFzcz1cImNwLWNoYXJ0LWFubm90YXRpb25fX2RhdGFFbGVtZW50XCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPiR7IEpTT04uc3RyaW5naWZ5KGVsZW1lbnQpIH08L3NwYW4+YCxcbiAgICAgICAgICAgIHNoYXBlOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdjaXJjbGUnLFxuICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICByOiAxMSxcbiAgICAgICAgICAgICAgICBjeDogOSxcbiAgICAgICAgICAgICAgICBjeTogMTAuNSxcbiAgICAgICAgICAgICAgICAnc3Ryb2tlLXdpZHRoJzogMS41LFxuICAgICAgICAgICAgICAgIGZpbGw6IHRoaXMuZ2V0RXZlbnRUYWdQYXJhbXMoKS5jb2xvcixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICAgbW91c2VvdmVyOiAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoTW9iaWxlRGV0ZWN0LmlzTW9iaWxlKCkpIHJldHVybjtcbiAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHRoaXMuZ2V0RXZlbnREYXRhRnJvbUFubm90YXRpb25FdmVudChldmVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuRXZlbnRDb250YWluZXIoZGF0YSwgZXZlbnQpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBtb3VzZW91dDogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChNb2JpbGVEZXRlY3QuaXNNb2JpbGUoKSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VFdmVudENvbnRhaW5lcihldmVudCk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNsaWNrOiAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHRoaXMuZ2V0RXZlbnREYXRhRnJvbUFubm90YXRpb25FdmVudChldmVudCk7XG4gICAgICAgICAgICAgICAgaWYgKE1vYmlsZURldGVjdC5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLm9wZW5FdmVudENvbnRhaW5lcihkYXRhLCBldmVudCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMub3BlbkV2ZW50UGFnZShkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFydC5zZXJpZXNbMF0ueEF4aXMudXBkYXRlKHtcbiAgICAgICAgcGxvdExpbmVzLFxuICAgICAgfSwgZmFsc2UpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBzZXROYXZpZ2F0b3Iob3B0aW9ucyl7XG4gICAgbGV0IG5hdmlnYXRvck9wdGlvbnMgPSB7fTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKG9wdGlvbnMubmF2aWdhdG9yID09PSB0cnVlKXtcbiAgICAgICAgbmF2aWdhdG9yT3B0aW9ucyA9IHtcbiAgICAgICAgICBuYXZpZ2F0b3I6IHtcbiAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIG1hcmdpbjogMjAsXG4gICAgICAgICAgICBzZXJpZXM6IHtcbiAgICAgICAgICAgICAgbGluZVdpZHRoOiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1hc2tGaWxsOiAncmdiYSgxMDIsMTMzLDE5NCwwLjE1KScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgem9vbVR5cGU6ICd4JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHhBeGlzOiB7XG4gICAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICAgc2V0RXh0cmVtZXM6IChlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKChlLnRyaWdnZXIgPT09ICduYXZpZ2F0b3InIHx8IGUudHJpZ2dlciA9PT0gJ3pvb20nKSAmJiBlLm1pbiAmJiBlLm1heCkge1xuICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQodGhpcy5pZCsnU2V0RXh0cmVtZXMnLCB7XG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgICAgICAgICAgIG1pbkRhdGU6IGUubWluLFxuICAgICAgICAgICAgICAgICAgICAgIG1heERhdGU6IGUubWF4LFxuICAgICAgICAgICAgICAgICAgICAgIGUsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubmF2aWdhdG9yRXh0cmVtZXNMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnNldFJlc2V0Wm9vbUJ1dHRvbigpO1xuICAgICAgfSBlbHNlIGlmICghb3B0aW9ucy5uYXZpZ2F0b3IpIHtcbiAgICAgICAgbmF2aWdhdG9yT3B0aW9ucyA9IHtcbiAgICAgICAgICBuYXZpZ2F0b3I6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAudXBkYXRlT2JqZWN0KG9wdGlvbnMsIG5hdmlnYXRvck9wdGlvbnMpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBzZXRSZXNldFpvb21CdXR0b24oKXtcbiAgICAvLyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7IC8vIGNhbnQgYmUgcG9zaXRpb25lZCBwcm9wZXJseSBpbiBwbG90Qm94LCBzbyBpdHMgZGlzYWJsZWRcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuYWRkQ29udGFpbmVyKHRoaXMuaWQsICdSZXNldFpvb20nLCAnY3AtY2hhcnQtcmVzZXQtem9vbScsICdidXR0b24nKVxuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0Q29udGFpbmVyKCdSZXNldFpvb20nKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChlbGVtZW50KSA9PiB7XG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3VrLWJ1dHRvbicpO1xuICAgICAgZWxlbWVudC5pbm5lclRleHQgPSAnUmVzZXQgem9vbSc7XG4gICAgICByZXR1cm4gZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgdGhpcy5jaGFydC56b29tT3V0KCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgbmF2aWdhdG9yRXh0cmVtZXNMaXN0ZW5lcigpIHtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIodGhpcy5pZCArICdTZXRFeHRyZW1lcycsIChlKSA9PiB7XG4gICAgICAgIGxldCBtaW5EYXRlID0gY3BCb290c3RyYXAucm91bmQoZS5kZXRhaWwubWluRGF0ZSAvIDEwMDAsIDApO1xuICAgICAgICBsZXQgbWF4RGF0ZSA9IGNwQm9vdHN0cmFwLnJvdW5kKGUuZGV0YWlsLm1heERhdGUgLyAxMDAwLCAwKTtcbiAgICAgICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hEYXRhUGFja2FnZShtaW5EYXRlLCBtYXhEYXRlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGdldE5hdmlnYXRvckV4dHJlbWVzVXJsKG1pbkRhdGUsIG1heERhdGUsIGRhdGFUeXBlKXtcbiAgICBsZXQgZXh0cmVtZXNEYXRhVXJsID0gKGRhdGFUeXBlKSA/IHRoaXMuZ2V0RXh0cmVtZXNEYXRhVXJsKHRoaXMuaWQsIGRhdGFUeXBlKSA6IHRoaXMuZXh0cmVtZXNEYXRhVXJsO1xuICAgIHJldHVybiAobWluRGF0ZSAmJiBtYXhEYXRlICYmIGV4dHJlbWVzRGF0YVVybCkgPyBleHRyZW1lc0RhdGFVcmwgKycvZGF0ZXMvJyttaW5EYXRlKycvJyttYXhEYXRlKycvJyA6IG51bGw7XG4gIH1cbiAgXG4gIHNldE5vRGF0YUxhYmVsKG9wdGlvbnMpe1xuICAgIGxldCBub0RhdGFPcHRpb25zID0ge307XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIG5vRGF0YU9wdGlvbnMgPSB7XG4gICAgICAgIGxhbmc6IHtcbiAgICAgICAgICBub0RhdGE6ICdXZSBkb25cXCd0IGhhdmUgZGF0YSBmb3IgdGhpcyB0aW1lIHBlcmlvZCdcbiAgICAgICAgfSxcbiAgICAgICAgbm9EYXRhOiB7XG4gICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdBcmlhbCcsXG4gICAgICAgICAgICBmb250U2l6ZTogJzE0cHgnLFxuICAgICAgICAgICAgY29sb3I6ICcjMDAwMDAwJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC51cGRhdGVPYmplY3Qob3B0aW9ucywgbm9EYXRhT3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGFkZENvbnRhaW5lcihpZCwgbGFiZWwsIGNsYXNzTmFtZSwgdGFnTmFtZSA9ICdkaXYnKXtcbiAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcbiAgICBsZXQgY2hhcnRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgY29udGFpbmVyLmlkID0gaWQgKyBsYWJlbDtcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgIGNoYXJ0Q29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gIH1cbiAgXG4gIGdldENvbnRhaW5lcihsYWJlbCl7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWQrbGFiZWwpO1xuICB9XG4gIFxuICBnZXRFeHRyZW1lc0RhdGFVcmwoaWQsIGRhdGFUeXBlID0gJ2RhdGEnKXtcbiAgICByZXR1cm4gJy9jdXJyZW5jeS8nKyBkYXRhVHlwZSArJy8nKyB0aGlzLmN1cnJlbmN5O1xuICB9XG4gIFxuICBnZXRWb2x1bWVQYXR0ZXJuKCl7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlZnM6IHtcbiAgICAgICAgcGF0dGVybnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnaWQnOiAnZmlsbC1wYXR0ZXJuJyxcbiAgICAgICAgICAgICdwYXRoJzoge1xuICAgICAgICAgICAgICBkOiAnTSAzIDAgTCAzIDEwIE0gOCAwIEwgOCAxMCcsXG4gICAgICAgICAgICAgIHN0cm9rZTogXCIjZTNlM2UzXCIsXG4gICAgICAgICAgICAgIGZpbGw6ICcjZjFmMWYxJyxcbiAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IDIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ2lkJzogJ2ZpbGwtcGF0dGVybi1uaWdodCcsXG4gICAgICAgICAgICAncGF0aCc6IHtcbiAgICAgICAgICAgICAgZDogJ00gMyAwIEwgMyAxMCBNIDggMCBMIDggMTAnLFxuICAgICAgICAgICAgICBzdHJva2U6IFwiIzliOWI5YlwiLFxuICAgICAgICAgICAgICBmaWxsOiAnIzM4MzgzOCcsXG4gICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG5cbmNsYXNzIGJvb3RzdHJhcENsYXNzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbXB0eVZhbHVlID0gMDtcbiAgICB0aGlzLmVtcHR5RGF0YSA9ICctJztcbiAgfVxuICBcbiAgbm9kZUxpc3RUb0FycmF5KG5vZGVMaXN0KSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG5vZGVMaXN0KTtcbiAgfVxuICBcbiAgcGFyc2VJbnRlcnZhbFZhbHVlKHZhbHVlKSB7XG4gICAgbGV0IHRpbWVTeW1ib2wgPSAnJywgbXVsdGlwbGllciA9IDE7XG4gICAgaWYgKHZhbHVlLnNlYXJjaCgncycpID4gLTEpIHtcbiAgICAgIHRpbWVTeW1ib2wgPSAncyc7XG4gICAgICBtdWx0aXBsaWVyID0gMTAwMDtcbiAgICB9XG4gICAgaWYgKHZhbHVlLnNlYXJjaCgnbScpID4gLTEpIHtcbiAgICAgIHRpbWVTeW1ib2wgPSAnbSc7XG4gICAgICBtdWx0aXBsaWVyID0gNjAgKiAxMDAwO1xuICAgIH1cbiAgICBpZiAodmFsdWUuc2VhcmNoKCdoJykgPiAtMSkge1xuICAgICAgdGltZVN5bWJvbCA9ICdoJztcbiAgICAgIG11bHRpcGxpZXIgPSA2MCAqIDYwICogMTAwMDtcbiAgICB9XG4gICAgaWYgKHZhbHVlLnNlYXJjaCgnZCcpID4gLTEpIHtcbiAgICAgIHRpbWVTeW1ib2wgPSAnZCc7XG4gICAgICBtdWx0aXBsaWVyID0gMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUucmVwbGFjZSh0aW1lU3ltYm9sLCAnJykpICogbXVsdGlwbGllcjtcbiAgfVxuICBcbiAgdXBkYXRlT2JqZWN0KG9iaiwgbmV3T2JqKSB7XG4gICAgbGV0IHJlc3VsdCA9IG9iajtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AoT2JqZWN0LmtleXMobmV3T2JqKSwga2V5ID0+IHtcbiAgICAgICAgaWYgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHR5cGVvZiByZXN1bHRba2V5XSA9PT0gJ29iamVjdCcpe1xuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZU9iamVjdChyZXN1bHRba2V5XSwgbmV3T2JqW2tleV0pLnRoZW4oKHVwZGF0ZVJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB1cGRhdGVSZXN1bHQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdFtrZXldID0gbmV3T2JqW2tleV07XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgcGFyc2VOdW1iZXIobnVtYmVyKSB7XG4gICAgaWYgKCFudW1iZXIgJiYgbnVtYmVyICE9PSAwKSByZXR1cm4gbnVtYmVyO1xuICAgIGlmIChudW1iZXIgPT09IHRoaXMuZW1wdHlWYWx1ZSB8fCBudW1iZXIgPT09IHRoaXMuZW1wdHlEYXRhKSByZXR1cm4gbnVtYmVyO1xuICAgIG51bWJlciA9IHBhcnNlRmxvYXQobnVtYmVyKTtcbiAgICBpZiAobnVtYmVyID4gMTAwMDAwKSB7XG4gICAgICBsZXQgbnVtYmVyU3RyID0gbnVtYmVyLnRvRml4ZWQoMCk7XG4gICAgICBsZXQgcGFyYW1ldGVyID0gJ0snLFxuICAgICAgICBzcGxpY2VkID0gbnVtYmVyU3RyLnNsaWNlKDAsIG51bWJlclN0ci5sZW5ndGggLSAxKTtcbiAgICAgIGlmIChudW1iZXIgPiAxMDAwMDAwMDAwKSB7XG4gICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDcpO1xuICAgICAgICBwYXJhbWV0ZXIgPSAnQic7XG4gICAgICB9IGVsc2UgaWYgKG51bWJlciA+IDEwMDAwMDApIHtcbiAgICAgICAgc3BsaWNlZCA9IG51bWJlclN0ci5zbGljZSgwLCBudW1iZXJTdHIubGVuZ3RoIC0gNCk7XG4gICAgICAgIHBhcmFtZXRlciA9ICdNJztcbiAgICAgIH1cbiAgICAgIGxldCBuYXR1cmFsID0gc3BsaWNlZC5zbGljZSgwLCBzcGxpY2VkLmxlbmd0aCAtIDIpO1xuICAgICAgbGV0IGRlY2ltYWwgPSBzcGxpY2VkLnNsaWNlKHNwbGljZWQubGVuZ3RoIC0gMik7XG4gICAgICByZXR1cm4gbmF0dXJhbCArICcuJyArIGRlY2ltYWwgKyAnICcgKyBwYXJhbWV0ZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBpc0RlY2ltYWwgPSAobnVtYmVyICUgMSkgPiAwO1xuICAgICAgaWYgKGlzRGVjaW1hbCkge1xuICAgICAgICBsZXQgcHJlY2lzaW9uID0gMjtcbiAgICAgICAgaWYgKG51bWJlciA8IDEpIHtcbiAgICAgICAgICBwcmVjaXNpb24gPSA4O1xuICAgICAgICB9IGVsc2UgaWYgKG51bWJlciA8IDEwKSB7XG4gICAgICAgICAgcHJlY2lzaW9uID0gNjtcbiAgICAgICAgfSBlbHNlIGlmIChudW1iZXIgPCAxMDAwKSB7XG4gICAgICAgICAgcHJlY2lzaW9uID0gNDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5yb3VuZChudW1iZXIsIHByZWNpc2lvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVtYmVyLnRvRml4ZWQoMik7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICByb3VuZChhbW91bnQsIGRlY2ltYWwgPSA4LCBkaXJlY3Rpb24pIHtcbiAgICBhbW91bnQgPSBwYXJzZUZsb2F0KGFtb3VudCk7XG4gICAgaWYgKCFkaXJlY3Rpb24pIGRpcmVjdGlvbiA9ICdyb3VuZCc7XG4gICAgZGVjaW1hbCA9IE1hdGgucG93KDEwLCBkZWNpbWFsKTtcbiAgICByZXR1cm4gTWF0aFtkaXJlY3Rpb25dKGFtb3VudCAqIGRlY2ltYWwpIC8gZGVjaW1hbDtcbiAgfVxuICBcbiAgbG9vcChhcnIsIGZuLCBidXN5LCBlcnIsIGkgPSAwKSB7XG4gICAgY29uc3QgYm9keSA9IChvaywgZXIpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHIgPSBmbihhcnJbaV0sIGksIGFycik7XG4gICAgICAgIHIgJiYgci50aGVuID8gci50aGVuKG9rKS5jYXRjaChlcikgOiBvayhyKVxuICAgICAgfVxuICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgZXIoZSlcbiAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IG5leHQgPSAob2ssIGVyKSA9PiAoKSA9PiB0aGlzLmxvb3AoYXJyLCBmbiwgb2ssIGVyLCArK2kpO1xuICAgIGNvbnN0IHJ1biA9IChvaywgZXIpID0+IGkgPCBhcnIubGVuZ3RoID8gbmV3IFByb21pc2UoYm9keSkudGhlbihuZXh0KG9rLCBlcikpLmNhdGNoKGVyKSA6IG9rKCk7XG4gICAgcmV0dXJuIGJ1c3kgPyBydW4oYnVzeSwgZXJyKSA6IG5ldyBQcm9taXNlKHJ1bilcbiAgfVxufVxuXG5jbGFzcyBmZXRjaENsYXNzIHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLnN0YXRlID0ge307XG4gIH1cbiAgXG4gIGZldGNoU2NyaXB0KHVybCkge1xuICAgIGlmICh0aGlzLnN0YXRlW3VybF0pIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG4gICAgdGhpcy5zdGF0ZVt1cmxdID0gJ3BlbmRpbmcnO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSkgdGhpcy5zdGF0ZVt1cmxdID0gJ2Rvd25sb2FkZWQnO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUpIGRlbGV0ZSB0aGlzLnN0YXRlW3VybF07XG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYEZhaWxlZCB0byBsb2FkIGltYWdlJ3MgVVJMOiAke3VybH1gKSk7XG4gICAgICB9KTtcbiAgICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XG4gICAgICBzY3JpcHQuc3JjID0gdXJsO1xuICAgIH0pO1xuICB9XG4gIFxuICBmZXRjaFN0eWxlKHVybCkge1xuICAgIGlmICh0aGlzLnN0YXRlW3VybF0pIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG4gICAgdGhpcy5zdGF0ZVt1cmxdID0gJ3BlbmRpbmcnO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ3JlbCcsICdzdHlsZXNoZWV0Jyk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB1cmwpO1xuICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSkgdGhpcy5zdGF0ZVt1cmxdID0gJ2Rvd25sb2FkZWQnO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlKSBkZWxldGUgdGhpcy5zdGF0ZVt1cmxdO1xuICAgICAgICByZWplY3QobmV3IEVycm9yKGBGYWlsZWQgdG8gbG9hZCBzdHlsZSBVUkw6ICR7dXJsfWApKTtcbiAgICAgIH0pO1xuICAgICAgbGluay5ocmVmID0gdXJsO1xuICAgIH0pO1xuICB9XG4gIFxuICBmZXRjaENoYXJ0RGF0YSh1cmksIGZyb21TdGF0ZSA9IGZhbHNlKXtcbiAgICBjb25zdCB1cmwgPSAnaHR0cHM6Ly9ncmFwaHMuY29pbnBhcHJpa2EuY29tJyArIHVyaTtcbiAgICByZXR1cm4gdGhpcy5mZXRjaERhdGEodXJsLCBmcm9tU3RhdGUpO1xuICB9XG4gIFxuICBmZXRjaERhdGEodXJsLCBmcm9tU3RhdGUpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBpZiAoZnJvbVN0YXRlKXtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGVbdXJsXSA9PT0gJ3BlbmRpbmcnKXtcbiAgICAgICAgICBsZXQgcHJvbWlzZVRpbWVvdXQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLmZldGNoRGF0YSh1cmwsIGZyb21TdGF0ZSkpO1xuICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gcHJvbWlzZVRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEhdGhpcy5zdGF0ZVt1cmxdKXtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuc3RhdGVbdXJsXS5jbG9uZSgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGV0IHByb21pc2VGZXRjaCA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgcHJvbWlzZUZldGNoID0gcHJvbWlzZUZldGNoLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLnN0YXRlW3VybF0gPSAncGVuZGluZyc7XG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwpO1xuICAgICAgfSk7XG4gICAgICBwcm9taXNlRmV0Y2ggPSBwcm9taXNlRmV0Y2gudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgdGhpcy5zdGF0ZVt1cmxdID0gcmVzcG9uc2U7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5jbG9uZSgpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcHJvbWlzZUZldGNoO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG59XG5cbm5ldyB3aWRnZXRzQ29udHJvbGxlcigpO1xuY29uc3QgY3BCb290c3RyYXAgPSBuZXcgYm9vdHN0cmFwQ2xhc3MoKTtcbmNvbnN0IGZldGNoU2VydmljZSA9IG5ldyBmZXRjaENsYXNzKCk7XG4iXX0=
