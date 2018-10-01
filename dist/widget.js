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
      modules: ['chart', 'market_details'],
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
      message: 'data_loading',
      translations: {},
      mainElement: null,
      noTranslationLabels: [],
      scriptsDownloaded: {},
      chart: null,
      rwd: {
        xs: 280,
        s: 320,
        m: 370
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
      var chartContainer = null;
      var promise = Promise.resolve();
      promise = promise.then(function () {
        return cpBootstrap.loop(_this6.states[index].modules, function (module) {
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
              maxWidth: 768
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
                marginTop: 15,
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
              maxWidth: 374
            },
            chartOptions: {
              navigator: {
                margin: 90,
                height: 40,
                handles: {
                  height: 20
                }
              }
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
    value: function round(amount, decimal, direction) {
      amount = parseFloat(amount);
      if (!decimal) decimal = 8;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7SUNBTSxpQjtBQUNKLCtCQUFjO0FBQUE7O0FBQ1osU0FBSyxPQUFMLEdBQWUsSUFBSSxZQUFKLEVBQWY7QUFDQSxTQUFLLElBQUw7QUFDRDs7OzsyQkFFSztBQUFBOztBQUNKLGFBQU8sS0FBSyxPQUFMLENBQWEsUUFBYixDQUFzQixVQUE3QixJQUEyQyxFQUEzQztBQUNBLGVBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDO0FBQUEsZUFBTSxNQUFLLFdBQUwsRUFBTjtBQUFBLE9BQTlDLEVBQXdFLEtBQXhFO0FBQ0EsYUFBTyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLFVBQXpDLEdBQXNELFlBQU07QUFDMUQsZUFBTyxNQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLElBQXpDLEdBQWdELEtBQWhEO0FBQ0EsY0FBSyxXQUFMO0FBQ0QsT0FIRDtBQUlEOzs7a0NBRVk7QUFBQTs7QUFDWCxVQUFJLENBQUMsT0FBTyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLElBQTlDLEVBQW1EO0FBQ2pELGVBQU8sS0FBSyxPQUFMLENBQWEsUUFBYixDQUFzQixVQUE3QixFQUF5QyxJQUF6QyxHQUFnRCxJQUFoRDtBQUNBLFlBQUksZUFBZSxNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsU0FBUyxzQkFBVCxDQUFnQyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFNBQXRELENBQTNCLENBQW5CO0FBQ0EsYUFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixZQUE1QjtBQUNBLGVBQU8sZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsWUFBTTtBQUN0QyxpQkFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixZQUE1QjtBQUNBLGVB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QSxhQUFPLE9BQVA7QUFDRDs7Ozs7O0FBR0gsSUFBSSxpQkFBSjtBQUNBLElBQU0sY0FBYyxJQUFJLGNBQUosRUFBcEI7QUFDQSxJQUFNLGVBQWUsSUFBSSxVQUFKLEVBQXJCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY2xhc3Mgd2lkZ2V0c0NvbnRyb2xsZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLndpZGdldHMgPSBuZXcgd2lkZ2V0c0NsYXNzKCk7XG4gICAgdGhpcy5iaW5kKCk7XG4gIH1cbiAgXG4gIGJpbmQoKXtcbiAgICB3aW5kb3dbdGhpcy53aWRnZXRzLmRlZmF1bHRzLm9iamVjdE5hbWVdID0ge307XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHRoaXMuaW5pdFdpZGdldHMoKSwgZmFsc2UpO1xuICAgIHdpbmRvd1t0aGlzLndpZGdldHMuZGVmYXVsdHMub2JqZWN0TmFtZV0uYmluZFdpZGdldCA9ICgpID0+IHtcbiAgICAgIHdpbmRvd1t0aGlzLndpZGdldHMuZGVmYXVsdHMub2JqZWN0TmFtZV0uaW5pdCA9IGZhbHNlO1xuICAgICAgdGhpcy5pbml0V2lkZ2V0cygpO1xuICAgIH07XG4gIH1cbiAgXG4gIGluaXRXaWRnZXRzKCl7XG4gICAgaWYgKCF3aW5kb3dbdGhpcy53aWRnZXRzLmRlZmF1bHRzLm9iamVjdE5hbWVdLmluaXQpe1xuICAgICAgd2luZG93W3RoaXMud2lkZ2V0cy5kZWZhdWx0cy5vYmplY3ROYW1lXS5pbml0ID0gdHJ1ZTtcbiAgICAgIGxldCBtYWluRWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMud2lkZ2V0cy5kZWZhdWx0cy5jbGFzc05hbWUpKTtcbiAgICAgIHRoaXMud2lkZ2V0cy5zZXRXaWRnZXRDbGFzcyhtYWluRWxlbWVudHMpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgICAgdGhpcy53aWRnZXRzLnNldFdpZGdldENsYXNzKG1haW5FbGVtZW50cyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFpbkVsZW1lbnRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICB0aGlzLndpZGdldHMuc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKGkpO1xuICAgICAgICB9XG4gICAgICB9LCBmYWxzZSk7XG4gICAgICBsZXQgc2NyaXB0RWxlbWVudCA9IHRoaXMud2lkZ2V0cy5nZXRTY3JpcHRFbGVtZW50KCk7XG4gICAgICBpZiAoc2NyaXB0RWxlbWVudCAmJiBzY3JpcHRFbGVtZW50LmRhdGFzZXQgJiYgc2NyaXB0RWxlbWVudC5kYXRhc2V0LmNwQ3VycmVuY3lXaWRnZXQpe1xuICAgICAgICBsZXQgZGF0YXNldCA9IEpTT04ucGFyc2Uoc2NyaXB0RWxlbWVudC5kYXRhc2V0LmNwQ3VycmVuY3lXaWRnZXQpO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoZGF0YXNldCkpe1xuICAgICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMoZGF0YXNldCk7XG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBrZXlzLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICAgIGxldCBrZXkgPSBrZXlzW2pdLnJlcGxhY2UoJy0nLCAnXycpO1xuICAgICAgICAgICAgdGhpcy53aWRnZXRzLmRlZmF1bHRzW2tleV0gPSBkYXRhc2V0W2tleXNbal1dO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMud2lkZ2V0cy5zdGF0ZXMgPSBbXTtcbiAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AobWFpbkVsZW1lbnRzLCAoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgICBsZXQgbmV3U2V0dGluZ3MgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMud2lkZ2V0cy5kZWZhdWx0cykpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLmlzV29yZHByZXNzID0gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3dvcmRwcmVzcycpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLmlzTmlnaHRNb2RlID0gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NwLXdpZGdldF9fbmlnaHQtbW9kZScpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLm1haW5FbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgICB0aGlzLndpZGdldHMuc3RhdGVzLnB1c2gobmV3U2V0dGluZ3MpO1xuICAgICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBsZXQgY2hhcnRTY3JpcHRzID0gW1xuICAgICAgICAgICAgICAnaHR0cDovL2NvZGUuaGlnaGNoYXJ0cy5jb20vc3RvY2svaGlnaHN0b2NrLmpzJyxcbiAgICAgICAgICAgICAgJ2h0dHBzOi8vY29kZS5oaWdoY2hhcnRzLmNvbS9tb2R1bGVzL2V4cG9ydGluZy5qcycsXG4gICAgICAgICAgICAgICdodHRwczovL2NvZGUuaGlnaGNoYXJ0cy5jb20vbW9kdWxlcy9uby1kYXRhLXRvLWRpc3BsYXkuanMnLFxuICAgICAgICAgICAgICAnaHR0cHM6Ly9oaWdoY2hhcnRzLmdpdGh1Yi5pby9wYXR0ZXJuLWZpbGwvcGF0dGVybi1maWxsLXYyLmpzJyxcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICByZXR1cm4gKG5ld1NldHRpbmdzLm1vZHVsZXMuaW5kZXhPZignY2hhcnQnKSA+IC0xICYmICF3aW5kb3cuSGlnaGNoYXJ0cylcbiAgICAgICAgICAgICAgPyBjcEJvb3RzdHJhcC5sb29wKGNoYXJ0U2NyaXB0cywgbGluayA9PiB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmV0Y2hTZXJ2aWNlLmZldGNoU2NyaXB0KGxpbmspO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndpZGdldHMuaW5pdChpbmRleCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH0pO1xuICAgICAgfSwgNTApO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyB3aWRnZXRzQ2xhc3Mge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnN0YXRlcyA9IFtdO1xuICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICBvYmplY3ROYW1lOiAnY3BDdXJyZW5jeVdpZGdldHMnLFxuICAgICAgY2xhc3NOYW1lOiAnY29pbnBhcHJpa2EtY3VycmVuY3ktd2lkZ2V0JyxcbiAgICAgIGNzc0ZpbGVOYW1lOiAnd2lkZ2V0Lm1pbi5jc3MnLFxuICAgICAgY3VycmVuY3k6ICdidGMtYml0Y29pbicsXG4gICAgICBwcmltYXJ5X2N1cnJlbmN5OiAnVVNEJyxcbiAgICAgIHJhbmdlX2xpc3Q6IFsnMjRoJywgJzdkJywgJzMwZCcsICcxcScsICcxeScsICd5dGQnLCAnYWxsJ10sXG4gICAgICByYW5nZTogJzdkJyxcbiAgICAgIG1vZHVsZXM6IFsnY2hhcnQnLCAnbWFya2V0X2RldGFpbHMnXSxcbiAgICAgIHVwZGF0ZV9hY3RpdmU6IGZhbHNlLFxuICAgICAgdXBkYXRlX3RpbWVvdXQ6ICczMHMnLFxuICAgICAgbGFuZ3VhZ2U6ICdlbicsXG4gICAgICBzdHlsZV9zcmM6IG51bGwsXG4gICAgICBpbWdfc3JjOiBudWxsLFxuICAgICAgbGFuZ19zcmM6IG51bGwsXG4gICAgICBvcmlnaW5fc3JjOiAnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9AY29pbnBhcHJpa2Evd2lkZ2V0LWN1cnJlbmN5JyxcbiAgICAgIHNob3dfZGV0YWlsc19jdXJyZW5jeTogZmFsc2UsXG4gICAgICB0aWNrZXI6IHtcbiAgICAgICAgbmFtZTogdW5kZWZpbmVkLFxuICAgICAgICBzeW1ib2w6IHVuZGVmaW5lZCxcbiAgICAgICAgcHJpY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgcHJpY2VfY2hhbmdlXzI0aDogdW5kZWZpbmVkLFxuICAgICAgICByYW5rOiB1bmRlZmluZWQsXG4gICAgICAgIHByaWNlX2F0aDogdW5kZWZpbmVkLFxuICAgICAgICB2b2x1bWVfMjRoOiB1bmRlZmluZWQsXG4gICAgICAgIG1hcmtldF9jYXA6IHVuZGVmaW5lZCxcbiAgICAgICAgcGVyY2VudF9mcm9tX3ByaWNlX2F0aDogdW5kZWZpbmVkLFxuICAgICAgICB2b2x1bWVfMjRoX2NoYW5nZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgICAgbWFya2V0X2NhcF9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgICAgaW50ZXJ2YWw6IG51bGwsXG4gICAgICBpc1dvcmRwcmVzczogZmFsc2UsXG4gICAgICBpc05pZ2h0TW9kZTogZmFsc2UsXG4gICAgICBpc0RhdGE6IGZhbHNlLFxuICAgICAgbWVzc2FnZTogJ2RhdGFfbG9hZGluZycsXG4gICAgICB0cmFuc2xhdGlvbnM6IHt9LFxuICAgICAgbWFpbkVsZW1lbnQ6IG51bGwsXG4gICAgICBub1RyYW5zbGF0aW9uTGFiZWxzOiBbXSxcbiAgICAgIHNjcmlwdHNEb3dubG9hZGVkOiB7fSxcbiAgICAgIGNoYXJ0OiBudWxsLFxuICAgICAgcndkOiB7XG4gICAgICAgIHhzOiAyODAsXG4gICAgICAgIHM6IDMyMCxcbiAgICAgICAgbTogMzcwLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG4gIFxuICBpbml0KGluZGV4KSB7XG4gICAgaWYgKCF0aGlzLmdldE1haW5FbGVtZW50KGluZGV4KSkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ0JpbmQgZmFpbGVkLCBubyBlbGVtZW50IHdpdGggY2xhc3MgPSBcIicgKyB0aGlzLmRlZmF1bHRzLmNsYXNzTmFtZSArICdcIicpO1xuICAgIH1cbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RGVmYXVsdHMoaW5kZXgpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0T3JpZ2luTGluayhpbmRleCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHNldFdpZGdldENsYXNzKGVsZW1lbnRzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHdpZHRoID0gZWxlbWVudHNbaV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgICBsZXQgcndkS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuZGVmYXVsdHMucndkKTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcndkS2V5cy5sZW5ndGg7IGorKykge1xuICAgICAgICBsZXQgcndkS2V5ID0gcndkS2V5c1tqXTtcbiAgICAgICAgbGV0IHJ3ZFBhcmFtID0gdGhpcy5kZWZhdWx0cy5yd2RbcndkS2V5XTtcbiAgICAgICAgbGV0IGNsYXNzTmFtZSA9IHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lICsgJ19fJyArIHJ3ZEtleTtcbiAgICAgICAgaWYgKHdpZHRoIDw9IHJ3ZFBhcmFtKSBlbGVtZW50c1tpXS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICAgIGlmICh3aWR0aCA+IHJ3ZFBhcmFtKSBlbGVtZW50c1tpXS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICBnZXRNYWluRWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiAodGhpcy5zdGF0ZXNbaW5kZXhdKSA/IHRoaXMuc3RhdGVzW2luZGV4XS5tYWluRWxlbWVudCA6IG51bGw7XG4gIH1cbiAgXG4gIGdldERlZmF1bHRzKGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgICBpZiAobWFpbkVsZW1lbnQgJiYgbWFpbkVsZW1lbnQuZGF0YXNldCkge1xuICAgICAgICBpZiAoIW1haW5FbGVtZW50LmRhdGFzZXQubW9kdWxlcyAmJiBtYWluRWxlbWVudC5kYXRhc2V0LnZlcnNpb24gPT09ICdleHRlbmRlZCcpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ21vZHVsZXMnLCBbJ21hcmtldF9kZXRhaWxzJ10pO1xuICAgICAgICBpZiAoIW1haW5FbGVtZW50LmRhdGFzZXQubW9kdWxlcyAmJiBtYWluRWxlbWVudC5kYXRhc2V0LnZlcnNpb24gPT09ICdzdGFuZGFyZCcpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ21vZHVsZXMnLCBbXSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lm1vZHVsZXMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ21vZHVsZXMnLCBKU09OLnBhcnNlKG1haW5FbGVtZW50LmRhdGFzZXQubW9kdWxlcykpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5wcmltYXJ5Q3VycmVuY3kpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3ByaW1hcnlfY3VycmVuY3knLCBtYWluRWxlbWVudC5kYXRhc2V0LnByaW1hcnlDdXJyZW5jeSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmN1cnJlbmN5KSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdjdXJyZW5jeScsIG1haW5FbGVtZW50LmRhdGFzZXQuY3VycmVuY3kpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5zaG93RGV0YWlsc0N1cnJlbmN5KSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdzaG93X2RldGFpbHNfY3VycmVuY3knLCAobWFpbkVsZW1lbnQuZGF0YXNldC5zaG93RGV0YWlsc0N1cnJlbmN5ID09PSAndHJ1ZScpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlQWN0aXZlKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICd1cGRhdGVfYWN0aXZlJywgKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlQWN0aXZlID09PSAndHJ1ZScpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlVGltZW91dCkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAndXBkYXRlX3RpbWVvdXQnLCBjcEJvb3RzdHJhcC5wYXJzZUludGVydmFsVmFsdWUobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVUaW1lb3V0KSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lmxhbmd1YWdlKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdsYW5ndWFnZScsIG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ3VhZ2UpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5vcmlnaW5TcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ29yaWdpbl9zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0Lm9yaWdpblNyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lm5vZGVNb2R1bGVzU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdub2RlX21vZHVsZXNfc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5ub2RlTW9kdWxlc1NyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmJvd2VyU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdib3dlcl9zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LmJvd2VyU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuc3R5bGVTcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3N0eWxlX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQuc3R5bGVTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5sYW5nU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdsb2dvX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ1NyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmltZ1NyYykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbG9nb19zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LmltZ1NyYyk7XG4gICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgIH0pO1xuICB9XG4gIFxuICBzZXRPcmlnaW5MaW5rKGluZGV4KSB7XG4gICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zKS5sZW5ndGggPT09IDApIHRoaXMuZ2V0VHJhbnNsYXRpb25zKHRoaXMuZGVmYXVsdHMubGFuZ3VhZ2UpO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zdHlsZXNoZWV0KCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hZGRXaWRnZXRFbGVtZW50KGluZGV4KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmluaXRJbnRlcnZhbChpbmRleCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGFkZFdpZGdldEVsZW1lbnQoaW5kZXgpIHtcbiAgICBsZXQgbWFpbkVsZW1lbnQgPSB0aGlzLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICBsZXQgbW9kdWxlcyA9ICcnO1xuICAgIGxldCBjaGFydENvbnRhaW5lciA9IG51bGw7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKHRoaXMuc3RhdGVzW2luZGV4XS5tb2R1bGVzLCBtb2R1bGUgPT4ge1xuICAgICAgICBsZXQgbGFiZWwgPSBudWxsO1xuICAgICAgICBpZiAobW9kdWxlID09PSAnY2hhcnQnKSBsYWJlbCA9ICdDaGFydCc7XG4gICAgICAgIGlmIChtb2R1bGUgPT09ICdtYXJrZXRfZGV0YWlscycpIGxhYmVsID0gJ01hcmtldERldGFpbHMnO1xuICAgICAgICByZXR1cm4gKGxhYmVsKSA/IHRoaXNbYHdpZGdldCR7IGxhYmVsIH1FbGVtZW50YF0oaW5kZXgpLnRoZW4ocmVzdWx0ID0+IG1vZHVsZXMgKz0gcmVzdWx0KSA6IG51bGw7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBtYWluRWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLndpZGdldE1haW5FbGVtZW50KGluZGV4KSArIG1vZHVsZXMgKyB0aGlzLndpZGdldEZvb3RlcihpbmRleCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBjaGFydENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAkeyB0aGlzLmRlZmF1bHRzLmNsYXNzTmFtZSB9LXByaWNlLWNoYXJ0LSR7IGluZGV4IH1gKTtcbiAgICAgIHJldHVybiAoY2hhcnRDb250YWluZXIpID8gY2hhcnRDb250YWluZXIucGFyZW50RWxlbWVudC5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIHRoaXMud2lkZ2V0U2VsZWN0RWxlbWVudChpbmRleCwgJ3JhbmdlJykpIDogbnVsbDtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGlmIChjaGFydENvbnRhaW5lcil7XG4gICAgICAgIHRoaXMuc3RhdGVzW2luZGV4XS5jaGFydCA9IG5ldyBjaGFydENsYXNzKGNoYXJ0Q29udGFpbmVyLCB0aGlzLnN0YXRlc1tpbmRleF0pO1xuICAgICAgICB0aGlzLnNldFNlbGVjdExpc3RlbmVycyhpbmRleCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgICBcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnNldEJlZm9yZUVsZW1lbnRJbkZvb3RlcihpbmRleCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5nZXREYXRhKGluZGV4KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgc2V0U2VsZWN0TGlzdGVuZXJzKGluZGV4KXtcbiAgICBsZXQgbWFpbkVsZW1lbnQgPSB0aGlzLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICBsZXQgc2VsZWN0RWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0LXNlbGVjdCcpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0RWxlbWVudHMubGVuZ3RoOyBpKyspe1xuICAgICAgbGV0IGJ1dHRvbnMgPSBzZWxlY3RFbGVtZW50c1tpXS5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0LXNlbGVjdF9fb3B0aW9ucyBidXR0b24nKTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYnV0dG9ucy5sZW5ndGg7IGorKyl7XG4gICAgICAgIGJ1dHRvbnNbal0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFNlbGVjdE9wdGlvbihldmVudCwgaW5kZXgpO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICBzZXRTZWxlY3RPcHRpb24oZXZlbnQsIGluZGV4KXtcbiAgICBsZXQgY2xhc3NOYW1lID0gJ2NwLXdpZGdldC1hY3RpdmUnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKyl7XG4gICAgICBsZXQgc2libGluZyA9IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmNoaWxkTm9kZXNbaV07XG4gICAgICBpZiAoc2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkgc2libGluZy5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgfVxuICAgIGxldCBwYXJlbnQgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLmNwLXdpZGdldC1zZWxlY3QnKTtcbiAgICBsZXQgdHlwZSA9IHBhcmVudC5kYXRhc2V0LnR5cGU7XG4gICAgbGV0IHBpY2tlZFZhbHVlRWxlbWVudCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuY3Atd2lkZ2V0LXNlbGVjdF9fb3B0aW9ucyA+IHNwYW4nKTtcbiAgICBsZXQgdmFsdWUgPSBldmVudC50YXJnZXQuZGF0YXNldC5vcHRpb247XG4gICAgcGlja2VkVmFsdWVFbGVtZW50LmlubmVyVGV4dCA9IHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIHZhbHVlLnRvTG93ZXJDYXNlKCkpO1xuICAgIHRoaXMudXBkYXRlRGF0YShpbmRleCwgdHlwZSwgdmFsdWUpO1xuICAgIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgdGhpcy5kaXNwYXRjaEV2ZW50KGluZGV4LCAnLXN3aXRjaC1yYW5nZScsIHZhbHVlKTtcbiAgfVxuICBcbiAgZGlzcGF0Y2hFdmVudChpbmRleCwgbmFtZSwgZGF0YSl7XG4gICAgbGV0IGlkID0gYCR7IHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lIH0tcHJpY2UtY2hhcnQtJHsgaW5kZXggfWA7XG4gICAgcmV0dXJuIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGAke2lkfSR7bmFtZX1gLCB7IGRldGFpbDogeyBkYXRhIH0gfSkpO1xuICB9XG4gIFxuICBnZXREYXRhKGluZGV4KSB7XG4gICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vYXBpLmNvaW5wYXByaWthLmNvbS92MS93aWRnZXQvJyArIHRoaXMuc3RhdGVzW2luZGV4XS5jdXJyZW5jeSArICc/cXVvdGU9JyArIHRoaXMuc3RhdGVzW2luZGV4XS5wcmltYXJ5X2N1cnJlbmN5O1xuICAgIHJldHVybiBmZXRjaFNlcnZpY2UuZmV0Y2hEYXRhKHVybCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGVzW2luZGV4XS5pc0RhdGEpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2lzRGF0YScsIHRydWUpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRpY2tlcihpbmRleCwgcmVzdWx0KTtcbiAgICAgIH0pXG4gICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMub25FcnJvclJlcXVlc3QoaW5kZXgsIGVycm9yKTtcbiAgICB9KTtcbiAgfVxuICBcbiAgb25FcnJvclJlcXVlc3QoaW5kZXgsIHhocikge1xuICAgIGlmICh0aGlzLnN0YXRlc1tpbmRleF0uaXNEYXRhKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdpc0RhdGEnLCBmYWxzZSk7XG4gICAgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbWVzc2FnZScsICdkYXRhX3VuYXZhaWxhYmxlJyk7XG4gICAgY29uc29sZS5lcnJvcignUmVxdWVzdCBmYWlsZWQuICBSZXR1cm5lZCBzdGF0dXMgb2YgJyArIHhociwgdGhpcy5zdGF0ZXNbaW5kZXhdKTtcbiAgfVxuICBcbiAgaW5pdEludGVydmFsKGluZGV4KSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLnN0YXRlc1tpbmRleF0uaW50ZXJ2YWwpO1xuICAgIGlmICh0aGlzLnN0YXRlc1tpbmRleF0udXBkYXRlX2FjdGl2ZSAmJiB0aGlzLnN0YXRlc1tpbmRleF0udXBkYXRlX3RpbWVvdXQgPiAxMDAwKSB7XG4gICAgICB0aGlzLnN0YXRlc1tpbmRleF0uaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIHRoaXMuZ2V0RGF0YShpbmRleCk7XG4gICAgICB9LCB0aGlzLnN0YXRlc1tpbmRleF0udXBkYXRlX3RpbWVvdXQpO1xuICAgIH1cbiAgfVxuICBcbiAgc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKGluZGV4KSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlc1tpbmRleF0uaXNXb3JkcHJlc3MpIHtcbiAgICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgaWYgKG1haW5FbGVtZW50KSB7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5jaGlsZHJlblswXS5sb2NhbE5hbWUgPT09ICdzdHlsZScpIHtcbiAgICAgICAgICBtYWluRWxlbWVudC5yZW1vdmVDaGlsZChtYWluRWxlbWVudC5jaGlsZE5vZGVzWzBdKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZm9vdGVyRWxlbWVudCA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jcC13aWRnZXRfX2Zvb3RlcicpO1xuICAgICAgICBsZXQgdmFsdWUgPSBmb290ZXJFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gNDM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZm9vdGVyRWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFsdWUgLT0gZm9vdGVyRWxlbWVudC5jaGlsZE5vZGVzW2ldLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHN0eWxlLmlubmVySFRNTCA9ICcuY3Atd2lkZ2V0X19mb290ZXItLScgKyBpbmRleCArICc6OmJlZm9yZXt3aWR0aDonICsgdmFsdWUudG9GaXhlZCgwKSArICdweDt9JztcbiAgICAgICAgbWFpbkVsZW1lbnQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBtYWluRWxlbWVudC5jaGlsZHJlblswXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICB1cGRhdGVXaWRnZXRFbGVtZW50KGluZGV4LCBrZXksIHZhbHVlLCB0aWNrZXIpIHtcbiAgICBsZXQgc3RhdGUgPSB0aGlzLnN0YXRlc1tpbmRleF07XG4gICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgaWYgKG1haW5FbGVtZW50KSB7XG4gICAgICBsZXQgdGlja2VyQ2xhc3MgPSAodGlja2VyKSA/ICdUaWNrZXInIDogJyc7XG4gICAgICBpZiAoa2V5ID09PSAnbmFtZScgfHwga2V5ID09PSAnY3VycmVuY3knKSB7XG4gICAgICAgIGlmIChrZXkgPT09ICdjdXJyZW5jeScpIHtcbiAgICAgICAgICBsZXQgYUVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNwLXdpZGdldF9fZm9vdGVyID4gYScpO1xuICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYUVsZW1lbnRzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICBhRWxlbWVudHNba10uaHJlZiA9IHRoaXMuY29pbl9saW5rKHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nZXRJbWFnZShpbmRleCk7XG4gICAgICB9XG4gICAgICBpZiAoa2V5ID09PSAnaXNEYXRhJyB8fCBrZXkgPT09ICdtZXNzYWdlJykge1xuICAgICAgICBsZXQgaGVhZGVyRWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0X19tYWluJyk7XG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgaGVhZGVyRWxlbWVudHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICBoZWFkZXJFbGVtZW50c1trXS5pbm5lckhUTUwgPSAoIXN0YXRlLmlzRGF0YSkgPyB0aGlzLndpZGdldE1haW5FbGVtZW50TWVzc2FnZShpbmRleCkgOiB0aGlzLndpZGdldE1haW5FbGVtZW50RGF0YShpbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB1cGRhdGVFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsga2V5ICsgdGlja2VyQ2xhc3MpO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHVwZGF0ZUVsZW1lbnRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgbGV0IHVwZGF0ZUVsZW1lbnQgPSB1cGRhdGVFbGVtZW50c1tqXTtcbiAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NwLXdpZGdldF9fcmFuaycpKSB7XG4gICAgICAgICAgICBsZXQgY2xhc3NOYW1lID0gKHBhcnNlRmxvYXQodmFsdWUpID4gMCkgPyBcImNwLXdpZGdldF9fcmFuay11cFwiIDogKChwYXJzZUZsb2F0KHZhbHVlKSA8IDApID8gXCJjcC13aWRnZXRfX3JhbmstZG93blwiIDogXCJjcC13aWRnZXRfX3JhbmstbmV1dHJhbFwiKTtcbiAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLWRvd24nKTtcbiAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLXVwJyk7XG4gICAgICAgICAgICB1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9fcmFuay1uZXV0cmFsJyk7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IGNwQm9vdHN0cmFwLmVtcHR5RGF0YTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICAgICAgICB2YWx1ZSA9IChrZXkgPT09ICdwcmljZV9jaGFuZ2VfMjRoJykgPyAnKCcgKyBjcEJvb3RzdHJhcC5yb3VuZCh2YWx1ZSwgMikgKyAnJSknIDogY3BCb290c3RyYXAucm91bmQodmFsdWUsIDIpICsgJyUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3dEZXRhaWxzQ3VycmVuY3knKSAmJiAhc3RhdGUuc2hvd19kZXRhaWxzX2N1cnJlbmN5KSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICcgJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwYXJzZU51bWJlcicpKSB7XG4gICAgICAgICAgICB1cGRhdGVFbGVtZW50LmlubmVyVGV4dCA9IGNwQm9vdHN0cmFwLnBhcnNlTnVtYmVyKHZhbHVlKSB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuaW5uZXJUZXh0ID0gdmFsdWUgfHwgY3BCb290c3RyYXAuZW1wdHlEYXRhO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgdXBkYXRlRGF0YShpbmRleCwga2V5LCB2YWx1ZSwgdGlja2VyKSB7XG4gICAgaWYgKHRpY2tlcikge1xuICAgICAgdGhpcy5zdGF0ZXNbaW5kZXhdLnRpY2tlcltrZXldID0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdGVzW2luZGV4XVtrZXldID0gdmFsdWU7XG4gICAgfVxuICAgIGlmIChrZXkgPT09ICdsYW5ndWFnZScpIHtcbiAgICAgIHRoaXMuZ2V0VHJhbnNsYXRpb25zKHZhbHVlKTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVXaWRnZXRFbGVtZW50KGluZGV4LCBrZXksIHZhbHVlLCB0aWNrZXIpO1xuICB9XG4gIFxuICB1cGRhdGVXaWRnZXRUcmFuc2xhdGlvbnMobGFuZywgZGF0YSkge1xuICAgIHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddID0gZGF0YTtcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuc3RhdGVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICBsZXQgaXNOb1RyYW5zbGF0aW9uTGFiZWxzVXBkYXRlID0gdGhpcy5zdGF0ZXNbeF0ubm9UcmFuc2xhdGlvbkxhYmVscy5sZW5ndGggPiAwICYmIGxhbmcgPT09ICdlbic7XG4gICAgICBpZiAodGhpcy5zdGF0ZXNbeF0ubGFuZ3VhZ2UgPT09IGxhbmcgfHwgaXNOb1RyYW5zbGF0aW9uTGFiZWxzVXBkYXRlKSB7XG4gICAgICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuc3RhdGVzW3hdLm1haW5FbGVtZW50O1xuICAgICAgICBsZXQgdHJhbnNhbHRlRWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3AtdHJhbnNsYXRpb24nKSk7XG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdHJhbnNhbHRlRWxlbWVudHMubGVuZ3RoOyB5KyspIHtcbiAgICAgICAgICB0cmFuc2FsdGVFbGVtZW50c1t5XS5jbGFzc0xpc3QuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoY2xhc3NOYW1lLnNlYXJjaCgndHJhbnNsYXRpb25fJykgPiAtMSkge1xuICAgICAgICAgICAgICBsZXQgdHJhbnNsYXRlS2V5ID0gY2xhc3NOYW1lLnJlcGxhY2UoJ3RyYW5zbGF0aW9uXycsICcnKTtcbiAgICAgICAgICAgICAgaWYgKHRyYW5zbGF0ZUtleSA9PT0gJ21lc3NhZ2UnKSB0cmFuc2xhdGVLZXkgPSB0aGlzLnN0YXRlc1t4XS5tZXNzYWdlO1xuICAgICAgICAgICAgICBsZXQgbGFiZWxJbmRleCA9IHRoaXMuc3RhdGVzW3hdLm5vVHJhbnNsYXRpb25MYWJlbHMuaW5kZXhPZih0cmFuc2xhdGVLZXkpO1xuICAgICAgICAgICAgICBsZXQgdGV4dCA9IHRoaXMuZ2V0VHJhbnNsYXRpb24oeCwgdHJhbnNsYXRlS2V5KTtcbiAgICAgICAgICAgICAgaWYgKGxhYmVsSW5kZXggPiAtMSAmJiB0ZXh0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZXNbeF0ubm9UcmFuc2xhdGlvbkxhYmVscy5zcGxpY2UobGFiZWxJbmRleCwgMSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0cmFuc2FsdGVFbGVtZW50c1t5XS5pbm5lclRleHQgPSB0ZXh0O1xuICAgICAgICAgICAgICBpZiAodHJhbnNhbHRlRWxlbWVudHNbeV0uY2xvc2VzdCgnLmNwLXdpZGdldF9fZm9vdGVyJykpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKHgpLCA1MCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICB1cGRhdGVUaWNrZXIoaW5kZXgsIGRhdGEpIHtcbiAgICBsZXQgZGF0YUtleXMgPSBPYmplY3Qua2V5cyhkYXRhKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsIGRhdGFLZXlzW2ldLCBkYXRhW2RhdGFLZXlzW2ldXSwgdHJ1ZSk7XG4gICAgfVxuICB9XG4gIFxuICBzdHlsZXNoZWV0KCkge1xuICAgIGlmICh0aGlzLmRlZmF1bHRzLnN0eWxlX3NyYyAhPT0gZmFsc2UpIHtcbiAgICAgIGxldCB1cmwgPSB0aGlzLmRlZmF1bHRzLnN0eWxlX3NyYyB8fCB0aGlzLmRlZmF1bHRzLm9yaWdpbl9zcmMgKyAnL2Rpc3QvJyArIHRoaXMuZGVmYXVsdHMuY3NzRmlsZU5hbWU7XG4gICAgICBpZiAoIWRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignbGlua1tocmVmPVwiJyArIHVybCArICdcIl0nKSl7XG4gICAgICAgIHJldHVybiBmZXRjaFNlcnZpY2UuZmV0Y2hTdHlsZSh1cmwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cbiAgXG4gIHdpZGdldE1haW5FbGVtZW50KGluZGV4KSB7XG4gICAgbGV0IGRhdGEgPSB0aGlzLnN0YXRlc1tpbmRleF07XG4gICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19oZWFkZXJcIj4nICtcbiAgICAgICc8ZGl2IGNsYXNzPVwiJyArICdjcC13aWRnZXRfX2ltZyBjcC13aWRnZXRfX2ltZy0nICsgZGF0YS5jdXJyZW5jeSArICdcIj4nICtcbiAgICAgICc8aW1nLz4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19tYWluXCI+JyArXG4gICAgICAoKGRhdGEuaXNEYXRhKSA/IHRoaXMud2lkZ2V0TWFpbkVsZW1lbnREYXRhKGluZGV4KSA6IHRoaXMud2lkZ2V0TWFpbkVsZW1lbnRNZXNzYWdlKGluZGV4KSkgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzwvZGl2Pic7XG4gIH1cbiAgXG4gIHdpZGdldE1haW5FbGVtZW50RGF0YShpbmRleCkge1xuICAgIGxldCBkYXRhID0gdGhpcy5zdGF0ZXNbaW5kZXhdO1xuICAgIHJldHVybiAnPGgzPjxhIGhyZWY9XCInICsgdGhpcy5jb2luX2xpbmsoZGF0YS5jdXJyZW5jeSkgKyAnXCI+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJuYW1lVGlja2VyXCI+JyArIChkYXRhLnRpY2tlci5uYW1lIHx8IGNwQm9vdHN0cmFwLmVtcHR5RGF0YSkgKyAnPC9zcGFuPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwic3ltYm9sVGlja2VyXCI+JyArIChkYXRhLnRpY2tlci5zeW1ib2wgfHwgY3BCb290c3RyYXAuZW1wdHlEYXRhKSArICc8L3NwYW4+JyArXG4gICAgICAnPC9hPjwvaDM+JyArXG4gICAgICAnPHN0cm9uZz4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInByaWNlVGlja2VyIHBhcnNlTnVtYmVyXCI+JyArIChjcEJvb3RzdHJhcC5wYXJzZU51bWJlcihkYXRhLnRpY2tlci5wcmljZSkgfHwgY3BCb290c3RyYXAuZW1wdHlEYXRhKSArICc8L3NwYW4+ICcgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwicHJpbWFyeUN1cnJlbmN5XCI+JyArIGRhdGEucHJpbWFyeV9jdXJyZW5jeSArICcgPC9zcGFuPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwicHJpY2VfY2hhbmdlXzI0aFRpY2tlciBjcC13aWRnZXRfX3JhbmsgY3Atd2lkZ2V0X19yYW5rLScgKyAoKGRhdGEudGlja2VyLnByaWNlX2NoYW5nZV8yNGggPiAwKSA/IFwidXBcIiA6ICgoZGF0YS50aWNrZXIucHJpY2VfY2hhbmdlXzI0aCA8IDApID8gXCJkb3duXCIgOiBcIm5ldXRyYWxcIikpICsgJ1wiPignICsgKGNwQm9vdHN0cmFwLnJvdW5kKGRhdGEudGlja2VyLnByaWNlX2NoYW5nZV8yNGgsIDIpIHx8IGNwQm9vdHN0cmFwLmVtcHR5VmFsdWUpICsgJyUpPC9zcGFuPicgK1xuICAgICAgJzwvc3Ryb25nPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0X19yYW5rLWxhYmVsXCI+PHNwYW4gY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9yYW5rXCI+JyArIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwicmFua1wiKSArICc8L3NwYW4+IDxzcGFuIGNsYXNzPVwicmFua1RpY2tlclwiPicgKyAoZGF0YS50aWNrZXIucmFuayB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGEpICsgJzwvc3Bhbj48L3NwYW4+JztcbiAgfVxuICBcbiAgd2lkZ2V0TWFpbkVsZW1lbnRNZXNzYWdlKGluZGV4KSB7XG4gICAgbGV0IG1lc3NhZ2UgPSB0aGlzLnN0YXRlc1tpbmRleF0ubWVzc2FnZTtcbiAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX21haW4tbm8tZGF0YSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9tZXNzYWdlXCI+JyArICh0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBtZXNzYWdlKSkgKyAnPC9kaXY+JztcbiAgfVxuICBcbiAgd2lkZ2V0TWFya2V0RGV0YWlsc0VsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCh0aGlzLnN0YXRlc1tpbmRleF0ubW9kdWxlcy5pbmRleE9mKCdtYXJrZXRfZGV0YWlscycpID4gLTEpID8gJzxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX2RldGFpbHNcIj4nICtcbiAgICAgIHRoaXMud2lkZ2V0QXRoRWxlbWVudChpbmRleCkgK1xuICAgICAgdGhpcy53aWRnZXRWb2x1bWUyNGhFbGVtZW50KGluZGV4KSArXG4gICAgICB0aGlzLndpZGdldE1hcmtldENhcEVsZW1lbnQoaW5kZXgpICtcbiAgICAgICc8L2Rpdj4nIDogJycpO1xuICB9XG4gIFxuICB3aWRnZXRBdGhFbGVtZW50KGluZGV4KSB7XG4gICAgcmV0dXJuICc8ZGl2PicgK1xuICAgICAgJzxzbWFsbCBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX2F0aFwiPicgKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcImF0aFwiKSArICc8L3NtYWxsPicgK1xuICAgICAgJzxkaXY+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJwcmljZV9hdGhUaWNrZXIgcGFyc2VOdW1iZXJcIj4nICsgY3BCb290c3RyYXAuZW1wdHlEYXRhICsgJyA8L3NwYW4+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzeW1ib2xUaWNrZXIgc2hvd0RldGFpbHNDdXJyZW5jeVwiPjwvc3Bhbj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInBlcmNlbnRfZnJvbV9wcmljZV9hdGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rXCI+JyArIGNwQm9vdHN0cmFwLmVtcHR5RGF0YSArICc8L3NwYW4+JyArXG4gICAgICAnPC9kaXY+J1xuICB9XG4gIFxuICB3aWRnZXRWb2x1bWUyNGhFbGVtZW50KGluZGV4KSB7XG4gICAgcmV0dXJuICc8ZGl2PicgK1xuICAgICAgJzxzbWFsbCBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX3ZvbHVtZV8yNGhcIj4nICsgdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJ2b2x1bWVfMjRoXCIpICsgJzwvc21hbGw+JyArXG4gICAgICAnPGRpdj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInZvbHVtZV8yNGhUaWNrZXIgcGFyc2VOdW1iZXJcIj4nICsgY3BCb290c3RyYXAuZW1wdHlEYXRhICsgJyA8L3NwYW4+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzeW1ib2xUaWNrZXIgc2hvd0RldGFpbHNDdXJyZW5jeVwiPjwvc3Bhbj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInZvbHVtZV8yNGhfY2hhbmdlXzI0aFRpY2tlciBjcC13aWRnZXRfX3JhbmtcIj4nICsgY3BCb290c3RyYXAuZW1wdHlEYXRhICsgJzwvc3Bhbj4nICtcbiAgICAgICc8L2Rpdj4nO1xuICB9XG4gIFxuICB3aWRnZXRNYXJrZXRDYXBFbGVtZW50KGluZGV4KSB7XG4gICAgcmV0dXJuICc8ZGl2PicgK1xuICAgICAgJzxzbWFsbCBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX21hcmtldF9jYXBcIj4nICsgdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJtYXJrZXRfY2FwXCIpICsgJzwvc21hbGw+JyArXG4gICAgICAnPGRpdj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cIm1hcmtldF9jYXBUaWNrZXIgcGFyc2VOdW1iZXJcIj4nICsgY3BCb290c3RyYXAuZW1wdHlEYXRhICsgJyA8L3NwYW4+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzeW1ib2xUaWNrZXIgc2hvd0RldGFpbHNDdXJyZW5jeVwiPjwvc3Bhbj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cIm1hcmtldF9jYXBfY2hhbmdlXzI0aFRpY2tlciBjcC13aWRnZXRfX3JhbmtcIj4nICsgY3BCb290c3RyYXAuZW1wdHlEYXRhICsgJzwvc3Bhbj4nICtcbiAgICAgICc8L2Rpdj4nO1xuICB9XG4gIFxuICB3aWRnZXRDaGFydEVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFxuICAgICAgYDxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX2NoYXJ0XCI+PGRpdiBpZD1cIiR7IHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lIH0tcHJpY2UtY2hhcnQtJHsgaW5kZXggfVwiPjwvZGl2PjwvZGl2PmBcbiAgICApO1xuICB9XG4gIFxuICB3aWRnZXRTZWxlY3RFbGVtZW50KGluZGV4LCBsYWJlbCl7XG4gICAgbGV0IGJ1dHRvbnMgPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3RhdGVzW2luZGV4XVtsYWJlbCsnX2xpc3QnXS5sZW5ndGg7IGkrKyl7XG4gICAgICBsZXQgZGF0YSA9IHRoaXMuc3RhdGVzW2luZGV4XVtsYWJlbCsnX2xpc3QnXVtpXTtcbiAgICAgIGJ1dHRvbnMgKz0gJzxidXR0b24gY2xhc3M9XCInKyAoKGRhdGEudG9Mb3dlckNhc2UoKSA9PT0gdGhpcy5zdGF0ZXNbaW5kZXhdW2xhYmVsXS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICA/ICdjcC13aWRnZXQtYWN0aXZlICdcbiAgICAgICAgOiAnJykgKyAoKGxhYmVsID09PSAncHJpbWFyeV9jdXJyZW5jeScpID8gJycgOiAnY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fJyArIGRhdGEudG9Mb3dlckNhc2UoKSkgKydcIiBkYXRhLW9wdGlvbj1cIicrZGF0YSsnXCI+Jyt0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBkYXRhLnRvTG93ZXJDYXNlKCkpKyc8L2J1dHRvbj4nXG4gICAgfVxuICAgIGlmIChsYWJlbCA9PT0gJ3JhbmdlJykgO1xuICAgIGxldCB0aXRsZSA9IHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwiem9vbV9pblwiKTtcbiAgICByZXR1cm4gJzxkaXYgZGF0YS10eXBlPVwiJytsYWJlbCsnXCIgY2xhc3M9XCJjcC13aWRnZXQtc2VsZWN0XCI+JyArXG4gICAgICAnPGxhYmVsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fJysgbGFiZWwgKydcIj4nK3RpdGxlKyc8L2xhYmVsPicgK1xuICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtc2VsZWN0X19vcHRpb25zXCI+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJhcnJvdy1kb3duICcrICdjcC13aWRnZXRfX2NhcGl0YWxpemUgY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fJyArIHRoaXMuc3RhdGVzW2luZGV4XVtsYWJlbF0udG9Mb3dlckNhc2UoKSArJ1wiPicrIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIHRoaXMuc3RhdGVzW2luZGV4XVtsYWJlbF0udG9Mb3dlckNhc2UoKSkgKyc8L3NwYW4+JyArXG4gICAgICAnPGRpdiBjbGFzcz1cImNwLXdpZGdldC1zZWxlY3RfX2Ryb3Bkb3duXCI+JyArXG4gICAgICBidXR0b25zICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nO1xuICB9XG4gIFxuICB3aWRnZXRGb290ZXIoaW5kZXgpIHtcbiAgICBsZXQgY3VycmVuY3kgPSB0aGlzLnN0YXRlc1tpbmRleF0uY3VycmVuY3k7XG4gICAgcmV0dXJuICghdGhpcy5zdGF0ZXNbaW5kZXhdLmlzV29yZHByZXNzKVxuICAgICAgPyAnPHAgY2xhc3M9XCJjcC13aWRnZXRfX2Zvb3RlciBjcC13aWRnZXRfX2Zvb3Rlci0tJyArIGluZGV4ICsgJ1wiPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fcG93ZXJlZF9ieVwiPicgKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInBvd2VyZWRfYnlcIikgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8aW1nIHN0eWxlPVwid2lkdGg6IDE2cHhcIiBzcmM9XCInICsgdGhpcy5tYWluX2xvZ29fbGluaygpICsgJ1wiIGFsdD1cIlwiLz4nICtcbiAgICAgICc8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJyArIHRoaXMuY29pbl9saW5rKGN1cnJlbmN5KSArICdcIj5jb2lucGFwcmlrYS5jb208L2E+JyArXG4gICAgICAnPC9wPidcbiAgICAgIDogJyc7XG4gIH1cbiAgXG4gIGdldEltYWdlKGluZGV4KSB7XG4gICAgbGV0IGRhdGEgPSB0aGlzLnN0YXRlc1tpbmRleF07XG4gICAgbGV0IGltZ0NvbnRhaW5lcnMgPSBkYXRhLm1haW5FbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NwLXdpZGdldF9faW1nJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbWdDb250YWluZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgaW1nQ29udGFpbmVyID0gaW1nQ29udGFpbmVyc1tpXTtcbiAgICAgIGltZ0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjcC13aWRnZXRfX2ltZy0taGlkZGVuJyk7XG4gICAgICBsZXQgaW1nID0gaW1nQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpO1xuICAgICAgbGV0IG5ld0ltZyA9IG5ldyBJbWFnZTtcbiAgICAgIG5ld0ltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIGltZy5zcmMgPSBuZXdJbWcuc3JjO1xuICAgICAgICBpbWdDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19pbWctLWhpZGRlbicpO1xuICAgICAgfTtcbiAgICAgIG5ld0ltZy5zcmMgPSB0aGlzLmltZ19zcmMoZGF0YS5jdXJyZW5jeSk7XG4gICAgfVxuICB9XG4gIFxuICBpbWdfc3JjKGlkKSB7XG4gICAgcmV0dXJuICdodHRwczovL2NvaW5wYXByaWthLmNvbS9jb2luLycgKyBpZCArICcvbG9nby5wbmcnO1xuICB9XG4gIFxuICBjb2luX2xpbmsoaWQpIHtcbiAgICByZXR1cm4gJ2h0dHBzOi8vY29pbnBhcHJpa2EuY29tL2NvaW4vJyArIGlkXG4gIH1cbiAgXG4gIG1haW5fbG9nb19saW5rKCkge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRzLmltZ19zcmMgfHwgdGhpcy5kZWZhdWx0cy5vcmlnaW5fc3JjICsgJy9kaXN0L2ltZy9sb2dvX3dpZGdldC5zdmcnXG4gIH1cbiAgXG4gIGdldFNjcmlwdEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NjcmlwdFtkYXRhLWNwLWN1cnJlbmN5LXdpZGdldF0nKTtcbiAgfVxuICBcbiAgZ2V0VHJhbnNsYXRpb24oaW5kZXgsIGxhYmVsKSB7XG4gICAgbGV0IHRleHQgPSAodGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbdGhpcy5zdGF0ZXNbaW5kZXhdLmxhbmd1YWdlXSkgPyB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1t0aGlzLnN0YXRlc1tpbmRleF0ubGFuZ3VhZ2VdW2xhYmVsXSA6IG51bGw7XG4gICAgaWYgKCF0ZXh0ICYmIHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zWydlbiddKSB7XG4gICAgICB0ZXh0ID0gdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbJ2VuJ11bbGFiZWxdO1xuICAgIH1cbiAgICBpZiAoIXRleHQpIHtcbiAgICAgIHJldHVybiB0aGlzLmFkZExhYmVsV2l0aG91dFRyYW5zbGF0aW9uKGluZGV4LCBsYWJlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgfVxuICBcbiAgYWRkTGFiZWxXaXRob3V0VHJhbnNsYXRpb24oaW5kZXgsIGxhYmVsKSB7XG4gICAgaWYgKCF0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1snZW4nXSkgdGhpcy5nZXRUcmFuc2xhdGlvbnMoJ2VuJyk7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGVzW2luZGV4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLnB1c2gobGFiZWwpO1xuICB9XG4gIFxuICBnZXRUcmFuc2xhdGlvbnMobGFuZykge1xuICAgIGlmICghdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ10pIHtcbiAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIGxldCB1cmwgPSB0aGlzLmRlZmF1bHRzLmxhbmdfc3JjIHx8IHRoaXMuZGVmYXVsdHMub3JpZ2luX3NyYyArICcvZGlzdC9sYW5nJztcbiAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwgKyAnLycgKyBsYW5nICsgJy5qc29uJyk7XG4gICAgICB4aHIub25sb2FkID0gKCkgPT4ge1xuICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVXaWRnZXRUcmFuc2xhdGlvbnMobGFuZywgSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5vbkVycm9yUmVxdWVzdCgwLCB4aHIpO1xuICAgICAgICAgIHRoaXMuZ2V0VHJhbnNsYXRpb25zKCdlbicpO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHhoci5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICB0aGlzLm9uRXJyb3JSZXF1ZXN0KDAsIHhocik7XG4gICAgICAgIHRoaXMuZ2V0VHJhbnNsYXRpb25zKCdlbicpO1xuICAgICAgICBkZWxldGUgdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ107XG4gICAgICB9O1xuICAgICAgeGhyLnNlbmQoKTtcbiAgICAgIHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddID0ge307XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIGNoYXJ0Q2xhc3Mge1xuICBjb25zdHJ1Y3Rvcihjb250YWluZXIsIHN0YXRlKXtcbiAgICBpZiAoIWNvbnRhaW5lcikgcmV0dXJuO1xuICAgIHRoaXMuaWQgPSBjb250YWluZXIuaWQ7XG4gICAgdGhpcy5pc05pZ2h0TW9kZSA9IHN0YXRlLmlzTmlnaHRNb2RlO1xuICAgIHRoaXMuY2hhcnRzV2l0aEFjdGl2ZVNlcmllc0Nvb2tpZXMgPSBbXTtcbiAgICB0aGlzLmNoYXJ0ID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbmN5ID0gc3RhdGUuY3VycmVuY3k7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5vcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKCk7XG4gICAgdGhpcy5kZWZhdWx0UmFuZ2UgPSBzdGF0ZS5yYW5nZSB8fCAnN2QnO1xuICAgIHRoaXMuY2FsbGJhY2sgPSBudWxsO1xuICAgIHRoaXMucmVwbGFjZUNhbGxiYWNrID0gbnVsbDtcbiAgICB0aGlzLmV4dHJlbWVzRGF0YVVybCA9IHRoaXMuZ2V0RXh0cmVtZXNEYXRhVXJsKGNvbnRhaW5lci5pZCk7XG4gICAgdGhpcy5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIGNoYXJ0OiB7XG4gICAgICAgIGFsaWduVGlja3M6IGZhbHNlLFxuICAgICAgICBtYXJnaW5Ub3A6IDUwLFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIGZvbnRGYW1pbHk6ICdzYW5zLXNlcmlmJyxcbiAgICAgICAgfSxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgcmVuZGVyOiAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGUudGFyZ2V0LmFubm90YXRpb25zKSB7XG4gICAgICAgICAgICAgIGxldCBjaGFydCA9IGUudGFyZ2V0LmFubm90YXRpb25zLmNoYXJ0O1xuICAgICAgICAgICAgICBjcEJvb3RzdHJhcC5sb29wKGNoYXJ0LmFubm90YXRpb25zLmFsbEl0ZW1zLCBhbm5vdGF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgeSA9IGNoYXJ0LnBsb3RIZWlnaHQgKyBjaGFydC5wbG90VG9wIC0gY2hhcnQuc3BhY2luZ1swXSAtIDIgLSAoKHRoaXMuaXNSZXNwb25zaXZlTW9kZUFjdGl2ZShjaGFydCkpID8gMTAgOiAwKTtcbiAgICAgICAgICAgICAgICBhbm5vdGF0aW9uLnVwZGF0ZSh7eX0sIHRydWUpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHNjcm9sbGJhcjoge1xuICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICBhbm5vdGF0aW9uc09wdGlvbnM6IHtcbiAgICAgICAgZW5hYmxlZEJ1dHRvbnM6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHJhbmdlU2VsZWN0b3I6IHtcbiAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICB9LFxuICAgICAgcGxvdE9wdGlvbnM6IHtcbiAgICAgICAgbGluZToge1xuICAgICAgICAgIHNlcmllczoge1xuICAgICAgICAgICAgc3RhdGVzOiB7XG4gICAgICAgICAgICAgIGhvdmVyOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHNlcmllczoge1xuICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgbGVnZW5kSXRlbUNsaWNrOiAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGV2ZW50LmJyb3dzZXJFdmVudC5pc1RydXN0ZWQpe1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXJ0c1dpdGhBY3RpdmVTZXJpZXNDb29raWVzLmluZGV4T2YoZXZlbnQudGFyZ2V0LmNoYXJ0LnJlbmRlclRvLmlkKSA+IC0xKSB0aGlzLnNldFZpc2libGVDaGFydENvb2tpZXMoZXZlbnQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIE9uIGlPUyB0b3VjaCBldmVudCBmaXJlcyBzZWNvbmQgY2FsbGJhY2sgZnJvbSBKUyAoaXNUcnVzdGVkOiBmYWxzZSkgd2hpY2hcbiAgICAgICAgICAgICAgLy8gcmVzdWx0cyB3aXRoIHRvZ2dsZSBiYWNrIHRoZSBjaGFydCAocHJvYmFibHkgaXRzIGEgcHJvYmxlbSB3aXRoIFVJS2l0LCBidXQgbm90IHN1cmUpXG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdsZWdlbmRJdGVtQ2xpY2snLCB7ZXZlbnQsIGlzVHJ1c3RlZDogZXZlbnQuYnJvd3NlckV2ZW50LmlzVHJ1c3RlZH0pO1xuICAgICAgICAgICAgICByZXR1cm4gZXZlbnQuYnJvd3NlckV2ZW50LmlzVHJ1c3RlZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHhBeGlzOiB7XG4gICAgICAgIG9yZGluYWw6IGZhbHNlXG4gICAgICB9XG4gICAgfTtcbiAgICB0aGlzLmNoYXJ0RGF0YVBhcnNlciA9IChkYXRhLCBkYXRhVHlwZSkgPT4ge1xuICAgICAgbGV0IHByaWNlQ3VycmVuY3kgPSBzdGF0ZS5wcmltYXJ5X2N1cnJlbmN5LnRvTG93ZXJDYXNlKCk7XG4gICAgICBkYXRhID0gZGF0YVswXTtcbiAgICAgIGxldCBuZXdEYXRhID0ge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcHJpY2U6IChkYXRhW3ByaWNlQ3VycmVuY3ldKSA/IGRhdGFbcHJpY2VDdXJyZW5jeV0gOiBbXSxcbiAgICAgICAgICB2b2x1bWU6IGRhdGEudm9sdW1lLFxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXdEYXRhKTtcbiAgICB9O1xuICAgIHRoaXMuaXNFdmVudHNIaWRkZW4gPSBmYWxzZTtcbiAgICB0aGlzLmV4Y2x1ZGVTZXJpZXNJZHMgPSBbXTtcbiAgICB0aGlzLmFzeW5jVXJsID0gYC9jdXJyZW5jeS9kYXRhLyR7IHN0YXRlLmN1cnJlbmN5IH0vX3JhbmdlXy9gO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG4gIFxuICBzZXRPcHRpb25zKCl7XG4gICAgY29uc3QgY2hhcnRTZXJ2aWNlID0gbmV3IGNoYXJ0Q2xhc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzcG9uc2l2ZToge1xuICAgICAgICBydWxlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbmRpdGlvbjoge1xuICAgICAgICAgICAgICBtYXhXaWR0aDogNzY4XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hhcnRPcHRpb25zOiB7XG4gICAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgIGFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuICAgICAgICAgICAgICAgIHk6IDkyLFxuICAgICAgICAgICAgICAgIHN5bWJvbFJhZGl1czogMCxcbiAgICAgICAgICAgICAgICBpdGVtRGlzdGFuY2U6IDIwLFxuICAgICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgIGhlaWdodDogNDAwLFxuICAgICAgICAgICAgICAgIG1hcmdpblRvcDogMzUsXG4gICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAwLFxuICAgICAgICAgICAgICAgIHNwYWNpbmdUb3A6IDAsXG4gICAgICAgICAgICAgICAgc3BhY2luZ0JvdHRvbTogMCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbmF2aWdhdG9yOiB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA1MCxcbiAgICAgICAgICAgICAgICBtYXJnaW46IDcwLFxuICAgICAgICAgICAgICAgIGhhbmRsZXM6IHtcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogMjUsXG4gICAgICAgICAgICAgICAgICB3aWR0aDogMTcsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb25kaXRpb246IHtcbiAgICAgICAgICAgICAgbWF4V2lkdGg6IDYwMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoYXJ0T3B0aW9uczoge1xuICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgIG1hcmdpblRvcDogMTUsXG4gICAgICAgICAgICAgICAgem9vbVR5cGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IDEwLFxuICAgICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiAxMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM1MCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgeUF4aXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tBbW91bnQ6IDcsXG4gICAgICAgICAgICAgICAgICB0aWNrV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrTGVuZ3RoOiAwLFxuICAgICAgICAgICAgICAgICAgbGluZVdpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgYWxpZ246IFwibGVmdFwiLFxuICAgICAgICAgICAgICAgICAgICB4OiAxLFxuICAgICAgICAgICAgICAgICAgICB5OiAtMixcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM5ZTllOWUnLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnOXB4JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGZsb29yOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0Ftb3VudDogNyxcbiAgICAgICAgICAgICAgICAgIHRpY2tXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tMZW5ndGg6IDAsXG4gICAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICAgICAgICBhbGlnbjogXCJyaWdodFwiLFxuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogXCJqdXN0aWZ5XCIsXG4gICAgICAgICAgICAgICAgICAgIHg6IDEsXG4gICAgICAgICAgICAgICAgICAgIHk6IC0yLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzUwODVlYycsXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICc5cHgnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgIG1heFdpZHRoOiAzNzRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGFydE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgbmF2aWdhdG9yOiB7XG4gICAgICAgICAgICAgICAgbWFyZ2luOiA5MCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDQwLFxuICAgICAgICAgICAgICAgIGhhbmRsZXM6IHtcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHRpdGxlOiB7XG4gICAgICAgIHRleHQ6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgICBjaGFydDoge1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdub25lJyxcbiAgICAgICAgbWFyZ2luVG9wOiA1MCxcbiAgICAgICAgcGxvdEJvcmRlcldpZHRoOiAwLFxuICAgICAgfSxcbiAgICAgIGNwRXZlbnRzOiBmYWxzZSxcbiAgICAgIGNvbG9yczogW1xuICAgICAgICAnIzUwODVlYycsXG4gICAgICAgICcjMWY5ODA5JyxcbiAgICAgICAgJyM5ODVkNjUnLFxuICAgICAgICAnI2VlOTgzYicsXG4gICAgICAgICcjNGM0YzRjJyxcbiAgICAgIF0sXG4gICAgICBsZWdlbmQ6IHtcbiAgICAgICAgbWFyZ2luOiAwLFxuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICBhbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgc3ltYm9sUmFkaXVzOiAwLFxuICAgICAgICBpdGVtRGlzdGFuY2U6IDQwLFxuICAgICAgICBpdGVtU3R5bGU6IHtcbiAgICAgICAgICBmb250V2VpZ2h0OiAnbm9ybWFsJyxcbiAgICAgICAgICBjb2xvcjogKHRoaXMuaXNOaWdodE1vZGUpID8gJyM4MGE2ZTUnIDogJyMwNjQ1YWQnLFxuICAgICAgICB9LFxuICAgICAgICBpdGVtTWFyZ2luVG9wOiA4LFxuICAgICAgfSxcbiAgICAgIG5hdmlnYXRvcjogdHJ1ZSxcbiAgICAgIHRvb2x0aXA6IHtcbiAgICAgICAgc2hhcmVkOiB0cnVlLFxuICAgICAgICBzcGxpdDogZmFsc2UsXG4gICAgICAgIGFuaW1hdGlvbjogZmFsc2UsXG4gICAgICAgIGJvcmRlcldpZHRoOiAxLFxuICAgICAgICBib3JkZXJDb2xvcjogKHRoaXMuaXNOaWdodE1vZGUpID8gJyM0YzRjNGMnIDogJyNlM2UzZTMnLFxuICAgICAgICBoaWRlRGVsYXk6IDEwMCxcbiAgICAgICAgc2hhZG93OiBmYWxzZSxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgY29sb3I6ICcjNGM0YzRjJyxcbiAgICAgICAgICBmb250U2l6ZTogJzEwcHgnLFxuICAgICAgICB9LFxuICAgICAgICB1c2VIVE1MOiB0cnVlLFxuICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuIGNoYXJ0U2VydmljZS50b29sdGlwRm9ybWF0dGVyKHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIFxuICAgICAgZXhwb3J0aW5nOiB7XG4gICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICBjb250ZXh0QnV0dG9uOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFxuICAgICAgeEF4aXM6IHtcbiAgICAgICAgbGluZUNvbG9yOiAodGhpcy5pc05pZ2h0TW9kZSkgPyAnIzUwNTA1MCcgOiAnI2UzZTNlMycsXG4gICAgICAgIHRpY2tDb2xvcjogKHRoaXMuaXNOaWdodE1vZGUpID8gJyM1MDUwNTAnIDogJyNlM2UzZTMnLFxuICAgICAgICB0aWNrTGVuZ3RoOiA3LFxuICAgICAgfSxcbiAgICAgIFxuICAgICAgeUF4aXM6IFt7IC8vIFZvbHVtZSB5QXhpc1xuICAgICAgICBsaW5lV2lkdGg6IDEsXG4gICAgICAgIGxpbmVDb2xvcjogJyNkZWRlZGUnLFxuICAgICAgICB0aWNrV2lkdGg6IDEsXG4gICAgICAgIHRpY2tMZW5ndGg6IDQsXG4gICAgICAgIGdyaWRMaW5lRGFzaFN0eWxlOiAnZGFzaCcsXG4gICAgICAgIGdyaWRMaW5lV2lkdGg6IDAsXG4gICAgICAgIGZsb29yOiAwLFxuICAgICAgICBtaW5QYWRkaW5nOiAwLFxuICAgICAgICBvcHBvc2l0ZTogZmFsc2UsXG4gICAgICAgIHNob3dFbXB0eTogZmFsc2UsXG4gICAgICAgIHNob3dMYXN0TGFiZWw6IGZhbHNlLFxuICAgICAgICBzaG93Rmlyc3RMYWJlbDogZmFsc2UsXG4gICAgICB9LCB7XG4gICAgICAgIGdyaWRMaW5lQ29sb3I6ICh0aGlzLmlzTmlnaHRNb2RlKSA/ICcjNTA1MDUwJyA6ICcjZTNlM2UzJyxcbiAgICAgICAgZ3JpZExpbmVEYXNoU3R5bGU6ICdkYXNoJyxcbiAgICAgICAgbGluZVdpZHRoOiAxLFxuICAgICAgICB0aWNrV2lkdGg6IDEsXG4gICAgICAgIHRpY2tMZW5ndGg6IDQsXG4gICAgICAgIGZsb29yOiAwLFxuICAgICAgICBtaW5QYWRkaW5nOiAwLFxuICAgICAgICBzaG93RW1wdHk6IGZhbHNlLFxuICAgICAgICBvcHBvc2l0ZTogdHJ1ZSxcbiAgICAgICAgZ3JpZFpJbmRleDogNCxcbiAgICAgICAgc2hvd0xhc3RMYWJlbDogZmFsc2UsXG4gICAgICAgIHNob3dGaXJzdExhYmVsOiBmYWxzZSxcbiAgICAgIH1dLFxuICAgICAgXG4gICAgICBzZXJpZXM6IFtcbiAgICAgICAgeyAvL29yZGVyIG9mIHRoZSBzZXJpZXMgbWF0dGVyc1xuICAgICAgICAgIGNvbG9yOiAnIzUwODVlYycsXG4gICAgICAgICAgbmFtZTogJ1ByaWNlJyxcbiAgICAgICAgICBpZDogJ3ByaWNlJyxcbiAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgICB0eXBlOiAnYXJlYScsXG4gICAgICAgICAgZmlsbE9wYWNpdHk6IDAuMTUsXG4gICAgICAgICAgbGluZVdpZHRoOiAyLFxuICAgICAgICAgIHlBeGlzOiAxLFxuICAgICAgICAgIHpJbmRleDogMixcbiAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgIGNsaWNrYWJsZTogdHJ1ZSxcbiAgICAgICAgICB0aHJlc2hvbGQ6IG51bGwsXG4gICAgICAgICAgdG9vbHRpcDoge1xuICAgICAgICAgICAgdmFsdWVEZWNpbWFsczogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2hvd0luTmF2aWdhdG9yOiB0cnVlLFxuICAgICAgICAgIHNob3dJbkxlZ2VuZDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjb2xvcjogYHVybCgjZmlsbC1wYXR0ZXJuJHsodGhpcy5pc05pZ2h0TW9kZSkgPyAnLW5pZ2h0JyA6ICcnfSlgLFxuICAgICAgICAgIG5hbWU6ICdWb2x1bWUnLFxuICAgICAgICAgIGlkOiAndm9sdW1lJyxcbiAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgICB0eXBlOiAnYXJlYScsXG4gICAgICAgICAgZmlsbE9wYWNpdHk6IDAuNSxcbiAgICAgICAgICBsaW5lV2lkdGg6IDAsXG4gICAgICAgICAgeUF4aXM6IDAsXG4gICAgICAgICAgekluZGV4OiAwLFxuICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgY2xpY2thYmxlOiB0cnVlLFxuICAgICAgICAgIHRocmVzaG9sZDogbnVsbCxcbiAgICAgICAgICB0b29sdGlwOiB7XG4gICAgICAgICAgICB2YWx1ZURlY2ltYWxzOiAwLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2hvd0luTmF2aWdhdG9yOiB0cnVlLFxuICAgICAgICB9XVxuICAgIH1cbiAgfVxuICBcbiAgaW5pdCgpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZU9wdGlvbnModGhpcy5vcHRpb25zKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChvcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gKHdpbmRvdy5IaWdoY2hhcnRzKSA/IEhpZ2hjaGFydHMuc3RvY2tDaGFydCh0aGlzLmNvbnRhaW5lci5pZCwgb3B0aW9ucywgKGNoYXJ0KSA9PiB0aGlzLmJpbmQoY2hhcnQpKSA6IG51bGw7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHBhcnNlT3B0aW9ucyhvcHRpb25zKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLnVwZGF0ZU9iamVjdCh0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChuZXdPcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAudXBkYXRlT2JqZWN0KHRoaXMuZ2V0Vm9sdW1lUGF0dGVybigpLCBuZXdPcHRpb25zKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChuZXdPcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zZXROYXZpZ2F0b3IobmV3T3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigobmV3T3B0aW9ucykgPT4ge1xuICAgICAgcmV0dXJuIChuZXdPcHRpb25zLm5vRGF0YSkgPyB0aGlzLnNldE5vRGF0YUxhYmVsKG5ld09wdGlvbnMpIDogbmV3T3B0aW9ucztcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChuZXdPcHRpb25zKSA9PiB7XG4gICAgICByZXR1cm4gbmV3T3B0aW9ucztcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgYmluZChjaGFydCl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNoYXJ0ID0gY2hhcnQ7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5mZXRjaERhdGFQYWNrYWdlKCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRSYW5nZVN3aXRjaGVyKCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gKHRoaXMuY2FsbGJhY2spID8gdGhpcy5jYWxsYmFjayh0aGlzLmNoYXJ0LCB0aGlzLmRlZmF1bHRSYW5nZSkgOiBudWxsO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBmZXRjaERhdGFQYWNrYWdlKG1pbkRhdGUsIG1heERhdGUpe1xuICAgIGxldCBpc1ByZWNpc2VSYW5nZSA9IChtaW5EYXRlICYmIG1heERhdGUpO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNwRXZlbnRzKXtcbiAgICAgICAgbGV0IHVybCA9IChpc1ByZWNpc2VSYW5nZSkgPyB0aGlzLmdldE5hdmlnYXRvckV4dHJlbWVzVXJsKG1pbkRhdGUsIG1heERhdGUsICdldmVudHMnKSA6IHRoaXMuZ2V0RXh0cmVtZXNEYXRhVXJsKHRoaXMuaWQsICdldmVudHMnKSArICcvJyArIHRoaXMuZ2V0UmFuZ2UoKSArICcvJztcbiAgICAgICAgcmV0dXJuICh1cmwpID8gdGhpcy5mZXRjaERhdGEodXJsLCAnZXZlbnRzJywgIWlzUHJlY2lzZVJhbmdlKSA6IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGxldCB1cmwgPSAoaXNQcmVjaXNlUmFuZ2UpID8gdGhpcy5nZXROYXZpZ2F0b3JFeHRyZW1lc1VybChtaW5EYXRlLCBtYXhEYXRlKSA6IHRoaXMuYXN5bmNVcmwucmVwbGFjZSgnX3JhbmdlXycsIHRoaXMuZ2V0UmFuZ2UoKSk7XG4gICAgICByZXR1cm4gKHVybCkgPyB0aGlzLmZldGNoRGF0YSh1cmwsICdkYXRhJywgIWlzUHJlY2lzZVJhbmdlKSA6IG51bGw7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFydC5yZWRyYXcoZmFsc2UpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuICghaXNQcmVjaXNlUmFuZ2UpID8gdGhpcy5jaGFydC56b29tT3V0KCkgOiBudWxsO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaXNMb2FkZWQgPSB0cnVlO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMudG9nZ2xlRXZlbnRzKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGZldGNoRGF0YSh1cmwsIGRhdGFUeXBlID0gJ2RhdGEnLCByZXBsYWNlID0gdHJ1ZSl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuY2hhcnQuc2hvd0xvYWRpbmcoKTtcbiAgICAgIHJldHVybiBmZXRjaFNlcnZpY2UuZmV0Y2hDaGFydERhdGEodXJsLCAhdGhpcy5pc0xvYWRlZCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHRoaXMuY2hhcnQuaGlkZUxvYWRpbmcoKTtcbiAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICByZXR1cm4gY29uc29sZS5sb2coYExvb2tzIGxpa2UgdGhlcmUgd2FzIGEgcHJvYmxlbS4gU3RhdHVzIENvZGU6ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhUGFyc2VyKGRhdGEsIGRhdGFUeXBlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGNvbnRlbnQpID0+IHtcbiAgICAgICAgICByZXR1cm4gKHJlcGxhY2UpID8gdGhpcy5yZXBsYWNlRGF0YShjb250ZW50LmRhdGEsIGRhdGFUeXBlKSA6IHRoaXMudXBkYXRlRGF0YShjb250ZW50LmRhdGEsIGRhdGFUeXBlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICB0aGlzLmNoYXJ0LmhpZGVMb2FkaW5nKCk7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ0ZldGNoIEVycm9yJywgZXJyb3IpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBzZXRSYW5nZVN3aXRjaGVyKCl7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihgJHsgdGhpcy5pZCB9LXN3aXRjaC1yYW5nZWAsIChldmVudCkgPT4ge1xuICAgICAgdGhpcy5kZWZhdWx0UmFuZ2UgPSBldmVudC5kZXRhaWwuZGF0YTtcbiAgICAgIHJldHVybiB0aGlzLmZldGNoRGF0YVBhY2thZ2UoKTtcbiAgICB9KTtcbiAgfVxuICBcbiAgZ2V0UmFuZ2UoKXtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0UmFuZ2UgfHwgJzFxJztcbiAgfVxuICBcbiAgdG9nZ2xlRXZlbnRzKCl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBpZiAodGhpcy5vcHRpb25zLmNwRXZlbnRzKXtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaGlnaGNoYXJ0cy1hbm5vdGF0aW9uJyk7XG4gICAgICB9KTtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGVsZW1lbnRzKSA9PiB7XG4gICAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKGVsZW1lbnRzLCBlbGVtZW50ID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5pc0V2ZW50c0hpZGRlbil7XG4gICAgICAgICAgICByZXR1cm4gKCFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaGlnaGNoYXJ0cy1hbm5vdGF0aW9uX19oaWRkZW4nKSkgPyBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZ2hjaGFydHMtYW5ub3RhdGlvbl9faGlkZGVuJykgOiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWdoY2hhcnRzLWFubm90YXRpb25fX2hpZGRlbicpKSA/IGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGNoYXJ0cy1hbm5vdGF0aW9uX19oaWRkZW4nKSA6IG51bGw7XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaGlnaGNoYXJ0cy1wbG90LWxpbmUnKTtcbiAgICAgIH0pO1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoZWxlbWVudHMpID0+IHtcbiAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AoZWxlbWVudHMsIGVsZW1lbnQgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmlzRXZlbnRzSGlkZGVuKXtcbiAgICAgICAgICAgIHJldHVybiAoIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWdoY2hhcnRzLXBsb3QtbGluZV9faGlkZGVuJykpID8gZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWdoY2hhcnRzLXBsb3QtbGluZV9faGlkZGVuJykgOiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWdoY2hhcnRzLXBsb3QtbGluZV9faGlkZGVuJykpID8gZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdoY2hhcnRzLXBsb3QtbGluZV9faGlkZGVuJykgOiBudWxsO1xuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBkYXRhUGFyc2VyKGRhdGEsIGRhdGFUeXBlID0gJ2RhdGEnKXtcbiAgICBzd2l0Y2ggKGRhdGFUeXBlKXtcbiAgICAgIGNhc2UgJ2RhdGEnOlxuICAgICAgICBsZXQgcHJvbWlzZURhdGEgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgcHJvbWlzZURhdGEgPSBwcm9taXNlRGF0YS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gKHRoaXMuY2hhcnREYXRhUGFyc2VyKSA/IHRoaXMuY2hhcnREYXRhUGFyc2VyKGRhdGEpIDoge1xuICAgICAgICAgICAgZGF0YTogZGF0YVswXSxcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2VEYXRhO1xuICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShkYXRhKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuICBcbiAgdXBkYXRlRGF0YShkYXRhLCBkYXRhVHlwZSkge1xuICAgIGxldCBuZXdEYXRhO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBzd2l0Y2ggKGRhdGFUeXBlKSB7XG4gICAgICAgIGNhc2UgJ2RhdGEnOlxuICAgICAgICAgIG5ld0RhdGEgPSB7fTtcbiAgICAgICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChPYmplY3QuZW50cmllcyhkYXRhKSwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0V4Y2x1ZGVkKHZhbHVlWzBdKSkgcmV0dXJuO1xuICAgICAgICAgICAgbGV0IG9sZERhdGEgPSB0aGlzLmdldE9sZERhdGEoZGF0YVR5cGUpW3ZhbHVlWzBdXTtcbiAgICAgICAgICAgIG5ld0RhdGFbdmFsdWVbMF1dID0gb2xkRGF0YVxuICAgICAgICAgICAgICAuZmlsdGVyKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlWzFdLmZpbmRJbmRleChmaW5kRWxlbWVudCA9PiB0aGlzLmlzVGhlU2FtZUVsZW1lbnQoZWxlbWVudCwgZmluZEVsZW1lbnQsIGRhdGFUeXBlKSkgPT09IC0xO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuY29uY2F0KHZhbHVlWzFdKVxuICAgICAgICAgICAgICAuc29ydCgoZGF0YTEsIGRhdGEyKSA9PiB0aGlzLnNvcnRDb25kaXRpb24oZGF0YTEsIGRhdGEyLCBkYXRhVHlwZSkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICAgIG5ld0RhdGEgPSBbXTtcbiAgICAgICAgICBsZXQgb2xkRGF0YSA9IHRoaXMuZ2V0T2xkRGF0YShkYXRhVHlwZSk7XG4gICAgICAgICAgcmV0dXJuIG5ld0RhdGEgPSBvbGREYXRhXG4gICAgICAgICAgICAuZmlsdGVyKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgIGRhdGEuZmluZEluZGV4KGZpbmRFbGVtZW50ID0+IHRoaXMuaXNUaGVTYW1lRWxlbWVudChlbGVtZW50LCBmaW5kRWxlbWVudCwgZGF0YVR5cGUpKSA9PT0gLTE7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNvbmNhdChkYXRhKVxuICAgICAgICAgICAgLnNvcnQoKGRhdGExLCBkYXRhMikgPT4gdGhpcy5zb3J0Q29uZGl0aW9uKGRhdGExLCBkYXRhMiwgZGF0YVR5cGUpKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5yZXBsYWNlRGF0YShuZXdEYXRhLCBkYXRhVHlwZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGlzVGhlU2FtZUVsZW1lbnQoZWxlbWVudEEsIGVsZW1lbnRCLCBkYXRhVHlwZSl7XG4gICAgc3dpdGNoIChkYXRhVHlwZSl7XG4gICAgICBjYXNlICdkYXRhJzpcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRBWzBdID09PSBlbGVtZW50QlswXTtcbiAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgIHJldHVybiBlbGVtZW50QS50cyA9PT0gZWxlbWVudEIudHM7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIFxuICBzb3J0Q29uZGl0aW9uKGVsZW1lbnRBLCBlbGVtZW50QiwgZGF0YVR5cGUpe1xuICAgIHN3aXRjaCAoZGF0YVR5cGUpe1xuICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgIHJldHVybiBlbGVtZW50QVswXSAtIGVsZW1lbnRCWzBdO1xuICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRBLnRzIC0gZWxlbWVudEIudHM7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIFxuICBnZXRPbGREYXRhKGRhdGFUeXBlKXtcbiAgICByZXR1cm4gdGhpc1snY2hhcnRfJytkYXRhVHlwZS50b0xvd2VyQ2FzZSgpXTtcbiAgfVxuICBcbiAgcmVwbGFjZURhdGEoZGF0YSwgZGF0YVR5cGUpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpc1snY2hhcnRfJytkYXRhVHlwZS50b0xvd2VyQ2FzZSgpXSA9IGRhdGE7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5yZXBsYWNlRGF0YVR5cGUoZGF0YSwgZGF0YVR5cGUpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuICh0aGlzLnJlcGxhY2VDYWxsYmFjaykgPyB0aGlzLnJlcGxhY2VDYWxsYmFjayh0aGlzLmNoYXJ0LCBkYXRhLCB0aGlzLmlzTG9hZGVkLCBkYXRhVHlwZSkgOiBudWxsO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICByZXBsYWNlRGF0YVR5cGUoZGF0YSwgZGF0YVR5cGUpe1xuICAgIHN3aXRjaCAoZGF0YVR5cGUpe1xuICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgIGlmICh0aGlzLmFzeW5jVXJsKXtcbiAgICAgICAgICBjcEJvb3RzdHJhcC5sb29wKFsnYnRjLWJpdGNvaW4nLCAnZXRoLWV0aGVyZXVtJ10sIGNvaW5OYW1lID0+IHtcbiAgICAgICAgICAgIGxldCBjb2luU2hvcnQgPSBjb2luTmFtZS5zcGxpdCgnLScpWzBdO1xuICAgICAgICAgICAgaWYgKHRoaXMuYXN5bmNVcmwuc2VhcmNoKGNvaW5OYW1lKSA+IC0xICYmIGRhdGFbY29pblNob3J0XSkge1xuICAgICAgICAgICAgICBkYXRhW2NvaW5TaG9ydF0gPSBbXTtcbiAgICAgICAgICAgICAgY3BCb290c3RyYXAubG9vcCh0aGlzLmNoYXJ0LnNlcmllcywgc2VyaWVzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc2VyaWVzLnVzZXJPcHRpb25zLmlkID09PSBjb2luU2hvcnQpIHNlcmllcy51cGRhdGUoeyB2aXNpYmxlOiBmYWxzZSB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AoT2JqZWN0LmVudHJpZXMoZGF0YSksICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmlzRXhjbHVkZWQodmFsdWVbMF0pKSByZXR1cm47XG4gICAgICAgICAgcmV0dXJuICh0aGlzLmNoYXJ0LmdldCh2YWx1ZVswXSkpID8gdGhpcy5jaGFydC5nZXQodmFsdWVbMF0pLnNldERhdGEodmFsdWVbMV0sIGZhbHNlLCBmYWxzZSwgZmFsc2UpIDogdGhpcy5jaGFydC5hZGRTZXJpZXMoe2lkOiB2YWx1ZVswXSwgZGF0YTogdmFsdWVbMV0sIHNob3dJbk5hdmlnYXRvcjogdHJ1ZX0pO1xuICAgICAgICB9KTtcbiAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKHRoaXMuY2hhcnQuYW5ub3RhdGlvbnMuYWxsSXRlbXMsIGFubm90YXRpb24gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGFubm90YXRpb24uZGVzdHJveSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2V0QW5ub3RhdGlvbnNPYmplY3RzKGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbiAgXG4gIGlzRXhjbHVkZWQobGFiZWwpe1xuICAgIHJldHVybiB0aGlzLmV4Y2x1ZGVTZXJpZXNJZHMuaW5kZXhPZihsYWJlbCkgPiAtMTtcbiAgfVxuICBcbiAgdG9vbHRpcEZvcm1hdHRlcihwb2ludGVyLCBsYWJlbCA9ICcnLCBzZWFyY2gpe1xuICAgIGlmICghc2VhcmNoKSBzZWFyY2ggPSBsYWJlbDtcbiAgICBjb25zdCBoZWFkZXIgPSAnPGRpdiBjbGFzcz1cImNwLWNoYXJ0LXRvb2x0aXAtY3VycmVuY3lcIj48c21hbGw+JytuZXcgRGF0ZShwb2ludGVyLngpLnRvVVRDU3RyaW5nKCkrJzwvc21hbGw+PHRhYmxlPic7XG4gICAgY29uc3QgZm9vdGVyID0gJzwvdGFibGU+PC9kaXY+JztcbiAgICBsZXQgY29udGVudCA9ICcnO1xuICAgIHBvaW50ZXIucG9pbnRzLmZvckVhY2gocG9pbnQgPT4ge1xuICAgICAgY29udGVudCArPSAnPHRyPicgK1xuICAgICAgICAnPHRkPicgK1xuICAgICAgICAnPHN2ZyB3aWR0aD1cIjVcIiBoZWlnaHQ9XCI1XCI+PHJlY3QgeD1cIjBcIiB5PVwiMFwiIHdpZHRoPVwiNVwiIGhlaWdodD1cIjVcIiBmaWxsPVwiJytwb2ludC5zZXJpZXMuY29sb3IrJ1wiIGZpbGwtb3BhY2l0eT1cIjFcIj48L3JlY3Q+PC9zdmc+JyArXG4gICAgICAgIHBvaW50LnNlcmllcy5uYW1lICsgJzogJyArIHBvaW50LnkudG9Mb2NhbGVTdHJpbmcoJ3J1LVJVJywgeyBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDggfSkgKyAnICcgKyAoKHBvaW50LnNlcmllcy5uYW1lLnRvTG93ZXJDYXNlKCkuc2VhcmNoKHNlYXJjaC50b0xvd2VyQ2FzZSgpKSA+IC0xKSA/IFwiXCIgOiBsYWJlbCkgK1xuICAgICAgICAnPC90ZD4nICtcbiAgICAgICAgJzwvdHI+JztcbiAgICB9KTtcbiAgICByZXR1cm4gaGVhZGVyICsgY29udGVudCArIGZvb3RlcjtcbiAgfVxuICBcbiAgc2V0QW5ub3RhdGlvbnNPYmplY3RzKGRhdGEpe1xuICAgIHRoaXMuY2hhcnQuc2VyaWVzWzBdLnhBeGlzLnJlbW92ZVBsb3RMaW5lKCk7XG4gICAgbGV0IHBsb3RMaW5lcyA9IFtdO1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gZGF0YS5zb3J0KChkYXRhMSwgZGF0YTIpID0+IHtcbiAgICAgICAgcmV0dXJuIGRhdGEyLnRzIC0gZGF0YTEudHM7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKGRhdGEsIGVsZW1lbnQgPT4ge1xuICAgICAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gcGxvdExpbmVzLnB1c2goe1xuICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICB2YWx1ZTogZWxlbWVudC50cyxcbiAgICAgICAgICAgIGRhc2hTdHlsZTogJ3NvbGlkJyxcbiAgICAgICAgICAgIHpJbmRleDogNCxcbiAgICAgICAgICAgIGNvbG9yOiB0aGlzLmdldEV2ZW50VGFnUGFyYW1zKCkuY29sb3IsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jaGFydC5hZGRBbm5vdGF0aW9uKHtcbiAgICAgICAgICAgIHhWYWx1ZTogZWxlbWVudC50cyxcbiAgICAgICAgICAgIHk6IDAsXG4gICAgICAgICAgICB0aXRsZTogYDxzcGFuIHRpdGxlPVwiQ2xpY2sgdG8gb3BlblwiIGNsYXNzPVwiY3AtY2hhcnQtYW5ub3RhdGlvbl9fdGV4dFwiPiR7IHRoaXMuZ2V0RXZlbnRUYWdQYXJhbXMoZWxlbWVudC50YWcpLmxhYmVsIH08L3NwYW4+PHNwYW4gY2xhc3M9XCJjcC1jaGFydC1hbm5vdGF0aW9uX19kYXRhRWxlbWVudFwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj4keyBKU09OLnN0cmluZ2lmeShlbGVtZW50KSB9PC9zcGFuPmAsXG4gICAgICAgICAgICBzaGFwZToge1xuICAgICAgICAgICAgICB0eXBlOiAnY2lyY2xlJyxcbiAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgcjogMTEsXG4gICAgICAgICAgICAgICAgY3g6IDksXG4gICAgICAgICAgICAgICAgY3k6IDEwLjUsXG4gICAgICAgICAgICAgICAgJ3N0cm9rZS13aWR0aCc6IDEuNSxcbiAgICAgICAgICAgICAgICBmaWxsOiB0aGlzLmdldEV2ZW50VGFnUGFyYW1zKCkuY29sb3IsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgIG1vdXNlb3ZlcjogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKE1vYmlsZURldGVjdC5pc01vYmlsZSgpKSByZXR1cm47XG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmdldEV2ZW50RGF0YUZyb21Bbm5vdGF0aW9uRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMub3BlbkV2ZW50Q29udGFpbmVyKGRhdGEsIGV2ZW50KTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbW91c2VvdXQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoTW9iaWxlRGV0ZWN0LmlzTW9iaWxlKCkpIHJldHVybjtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlRXZlbnRDb250YWluZXIoZXZlbnQpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmdldEV2ZW50RGF0YUZyb21Bbm5vdGF0aW9uRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIGlmIChNb2JpbGVEZXRlY3QuaXNNb2JpbGUoKSkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuRXZlbnRDb250YWluZXIoZGF0YSwgZXZlbnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLm9wZW5FdmVudFBhZ2UoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhcnQuc2VyaWVzWzBdLnhBeGlzLnVwZGF0ZSh7XG4gICAgICAgIHBsb3RMaW5lcyxcbiAgICAgIH0sIGZhbHNlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgc2V0TmF2aWdhdG9yKG9wdGlvbnMpe1xuICAgIGxldCBuYXZpZ2F0b3JPcHRpb25zID0ge307XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGlmIChvcHRpb25zLm5hdmlnYXRvciA9PT0gdHJ1ZSl7XG4gICAgICAgIG5hdmlnYXRvck9wdGlvbnMgPSB7XG4gICAgICAgICAgbmF2aWdhdG9yOiB7XG4gICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICBtYXJnaW46IDIwLFxuICAgICAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgICAgIGxpbmVXaWR0aDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtYXNrRmlsbDogJ3JnYmEoMTAyLDEzMywxOTQsMC4xNSknLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgIHpvb21UeXBlOiAneCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgIHNldEV4dHJlbWVzOiAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICgoZS50cmlnZ2VyID09PSAnbmF2aWdhdG9yJyB8fCBlLnRyaWdnZXIgPT09ICd6b29tJykgJiYgZS5taW4gJiYgZS5tYXgpIHtcbiAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KHRoaXMuaWQrJ1NldEV4dHJlbWVzJywge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgICAgICAgICBtaW5EYXRlOiBlLm1pbixcbiAgICAgICAgICAgICAgICAgICAgICBtYXhEYXRlOiBlLm1heCxcbiAgICAgICAgICAgICAgICAgICAgICBlLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm5hdmlnYXRvckV4dHJlbWVzTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5zZXRSZXNldFpvb21CdXR0b24oKTtcbiAgICAgIH0gZWxzZSBpZiAoIW9wdGlvbnMubmF2aWdhdG9yKSB7XG4gICAgICAgIG5hdmlnYXRvck9wdGlvbnMgPSB7XG4gICAgICAgICAgbmF2aWdhdG9yOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLnVwZGF0ZU9iamVjdChvcHRpb25zLCBuYXZpZ2F0b3JPcHRpb25zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgc2V0UmVzZXRab29tQnV0dG9uKCl7XG4gICAgLy8gcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpOyAvLyBjYW50IGJlIHBvc2l0aW9uZWQgcHJvcGVybHkgaW4gcGxvdEJveCwgc28gaXRzIGRpc2FibGVkXG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmFkZENvbnRhaW5lcih0aGlzLmlkLCAnUmVzZXRab29tJywgJ2NwLWNoYXJ0LXJlc2V0LXpvb20nLCAnYnV0dG9uJylcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdldENvbnRhaW5lcignUmVzZXRab29tJyk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoZWxlbWVudCkgPT4ge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd1ay1idXR0b24nKTtcbiAgICAgIGVsZW1lbnQuaW5uZXJUZXh0ID0gJ1Jlc2V0IHpvb20nO1xuICAgICAgcmV0dXJuIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuY2hhcnQuem9vbU91dCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIG5hdmlnYXRvckV4dHJlbWVzTGlzdGVuZXIoKSB7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKHRoaXMuaWQgKyAnU2V0RXh0cmVtZXMnLCAoZSkgPT4ge1xuICAgICAgICBsZXQgbWluRGF0ZSA9IGNwQm9vdHN0cmFwLnJvdW5kKGUuZGV0YWlsLm1pbkRhdGUgLyAxMDAwLCAwKTtcbiAgICAgICAgbGV0IG1heERhdGUgPSBjcEJvb3RzdHJhcC5yb3VuZChlLmRldGFpbC5tYXhEYXRlIC8gMTAwMCwgMCk7XG4gICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLmZldGNoRGF0YVBhY2thZ2UobWluRGF0ZSwgbWF4RGF0ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBnZXROYXZpZ2F0b3JFeHRyZW1lc1VybChtaW5EYXRlLCBtYXhEYXRlLCBkYXRhVHlwZSl7XG4gICAgbGV0IGV4dHJlbWVzRGF0YVVybCA9IChkYXRhVHlwZSkgPyB0aGlzLmdldEV4dHJlbWVzRGF0YVVybCh0aGlzLmlkLCBkYXRhVHlwZSkgOiB0aGlzLmV4dHJlbWVzRGF0YVVybDtcbiAgICByZXR1cm4gKG1pbkRhdGUgJiYgbWF4RGF0ZSAmJiBleHRyZW1lc0RhdGFVcmwpID8gZXh0cmVtZXNEYXRhVXJsICsnL2RhdGVzLycrbWluRGF0ZSsnLycrbWF4RGF0ZSsnLycgOiBudWxsO1xuICB9XG4gIFxuICBzZXROb0RhdGFMYWJlbChvcHRpb25zKXtcbiAgICBsZXQgbm9EYXRhT3B0aW9ucyA9IHt9O1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBub0RhdGFPcHRpb25zID0ge1xuICAgICAgICBsYW5nOiB7XG4gICAgICAgICAgbm9EYXRhOiAnV2UgZG9uXFwndCBoYXZlIGRhdGEgZm9yIHRoaXMgdGltZSBwZXJpb2QnXG4gICAgICAgIH0sXG4gICAgICAgIG5vRGF0YToge1xuICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICBmb250RmFtaWx5OiAnQXJpYWwnLFxuICAgICAgICAgICAgZm9udFNpemU6ICcxNHB4JyxcbiAgICAgICAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAudXBkYXRlT2JqZWN0KG9wdGlvbnMsIG5vRGF0YU9wdGlvbnMpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBhZGRDb250YWluZXIoaWQsIGxhYmVsLCBjbGFzc05hbWUsIHRhZ05hbWUgPSAnZGl2Jyl7XG4gICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG4gICAgbGV0IGNoYXJ0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgIGNvbnRhaW5lci5pZCA9IGlkICsgbGFiZWw7XG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICBjaGFydENvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICB9XG4gIFxuICBnZXRDb250YWluZXIobGFiZWwpe1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkK2xhYmVsKTtcbiAgfVxuICBcbiAgZ2V0RXh0cmVtZXNEYXRhVXJsKGlkLCBkYXRhVHlwZSA9ICdkYXRhJyl7XG4gICAgcmV0dXJuICcvY3VycmVuY3kvJysgZGF0YVR5cGUgKycvJysgdGhpcy5jdXJyZW5jeTtcbiAgfVxuICBcbiAgZ2V0Vm9sdW1lUGF0dGVybigpe1xuICAgIHJldHVybiB7XG4gICAgICBkZWZzOiB7XG4gICAgICAgIHBhdHRlcm5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ2lkJzogJ2ZpbGwtcGF0dGVybicsXG4gICAgICAgICAgICAncGF0aCc6IHtcbiAgICAgICAgICAgICAgZDogJ00gMyAwIEwgMyAxMCBNIDggMCBMIDggMTAnLFxuICAgICAgICAgICAgICBzdHJva2U6IFwiI2UzZTNlM1wiLFxuICAgICAgICAgICAgICBmaWxsOiAnI2YxZjFmMScsXG4gICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdpZCc6ICdmaWxsLXBhdHRlcm4tbmlnaHQnLFxuICAgICAgICAgICAgJ3BhdGgnOiB7XG4gICAgICAgICAgICAgIGQ6ICdNIDMgMCBMIDMgMTAgTSA4IDAgTCA4IDEwJyxcbiAgICAgICAgICAgICAgc3Ryb2tlOiBcIiM5YjliOWJcIixcbiAgICAgICAgICAgICAgZmlsbDogJyMzODM4MzgnLFxuICAgICAgICAgICAgICBzdHJva2VXaWR0aDogMixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuXG5jbGFzcyBib290c3RyYXBDbGFzcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1wdHlWYWx1ZSA9IDA7XG4gICAgdGhpcy5lbXB0eURhdGEgPSAnLSc7XG4gIH1cbiAgXG4gIG5vZGVMaXN0VG9BcnJheShub2RlTGlzdCkge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChub2RlTGlzdCk7XG4gIH1cbiAgXG4gIHBhcnNlSW50ZXJ2YWxWYWx1ZSh2YWx1ZSkge1xuICAgIGxldCB0aW1lU3ltYm9sID0gJycsIG11bHRpcGxpZXIgPSAxO1xuICAgIGlmICh2YWx1ZS5zZWFyY2goJ3MnKSA+IC0xKSB7XG4gICAgICB0aW1lU3ltYm9sID0gJ3MnO1xuICAgICAgbXVsdGlwbGllciA9IDEwMDA7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5zZWFyY2goJ20nKSA+IC0xKSB7XG4gICAgICB0aW1lU3ltYm9sID0gJ20nO1xuICAgICAgbXVsdGlwbGllciA9IDYwICogMTAwMDtcbiAgICB9XG4gICAgaWYgKHZhbHVlLnNlYXJjaCgnaCcpID4gLTEpIHtcbiAgICAgIHRpbWVTeW1ib2wgPSAnaCc7XG4gICAgICBtdWx0aXBsaWVyID0gNjAgKiA2MCAqIDEwMDA7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5zZWFyY2goJ2QnKSA+IC0xKSB7XG4gICAgICB0aW1lU3ltYm9sID0gJ2QnO1xuICAgICAgbXVsdGlwbGllciA9IDI0ICogNjAgKiA2MCAqIDEwMDA7XG4gICAgfVxuICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlLnJlcGxhY2UodGltZVN5bWJvbCwgJycpKSAqIG11bHRpcGxpZXI7XG4gIH1cbiAgXG4gIHVwZGF0ZU9iamVjdChvYmosIG5ld09iaikge1xuICAgIGxldCByZXN1bHQgPSBvYmo7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKE9iamVjdC5rZXlzKG5ld09iaiksIGtleSA9PiB7XG4gICAgICAgIGlmIChyZXN1bHQuaGFzT3duUHJvcGVydHkoa2V5KSAmJiB0eXBlb2YgcmVzdWx0W2tleV0gPT09ICdvYmplY3QnKXtcbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVPYmplY3QocmVzdWx0W2tleV0sIG5ld09ialtrZXldKS50aGVuKCh1cGRhdGVSZXN1bHQpID0+IHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdXBkYXRlUmVzdWx0O1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRba2V5XSA9IG5ld09ialtrZXldO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHBhcnNlTnVtYmVyKG51bWJlcikge1xuICAgIGlmICghbnVtYmVyICYmIG51bWJlciAhPT0gMCkgcmV0dXJuIG51bWJlcjtcbiAgICBpZiAobnVtYmVyID09PSB0aGlzLmVtcHR5VmFsdWUgfHwgbnVtYmVyID09PSB0aGlzLmVtcHR5RGF0YSkgcmV0dXJuIG51bWJlcjtcbiAgICBudW1iZXIgPSBwYXJzZUZsb2F0KG51bWJlcik7XG4gICAgaWYgKG51bWJlciA+IDEwMDAwMCkge1xuICAgICAgbGV0IG51bWJlclN0ciA9IG51bWJlci50b0ZpeGVkKDApO1xuICAgICAgbGV0IHBhcmFtZXRlciA9ICdLJyxcbiAgICAgICAgc3BsaWNlZCA9IG51bWJlclN0ci5zbGljZSgwLCBudW1iZXJTdHIubGVuZ3RoIC0gMSk7XG4gICAgICBpZiAobnVtYmVyID4gMTAwMDAwMDAwMCkge1xuICAgICAgICBzcGxpY2VkID0gbnVtYmVyU3RyLnNsaWNlKDAsIG51bWJlclN0ci5sZW5ndGggLSA3KTtcbiAgICAgICAgcGFyYW1ldGVyID0gJ0InO1xuICAgICAgfSBlbHNlIGlmIChudW1iZXIgPiAxMDAwMDAwKSB7XG4gICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDQpO1xuICAgICAgICBwYXJhbWV0ZXIgPSAnTSc7XG4gICAgICB9XG4gICAgICBsZXQgbmF0dXJhbCA9IHNwbGljZWQuc2xpY2UoMCwgc3BsaWNlZC5sZW5ndGggLSAyKTtcbiAgICAgIGxldCBkZWNpbWFsID0gc3BsaWNlZC5zbGljZShzcGxpY2VkLmxlbmd0aCAtIDIpO1xuICAgICAgcmV0dXJuIG5hdHVyYWwgKyAnLicgKyBkZWNpbWFsICsgJyAnICsgcGFyYW1ldGVyO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgaXNEZWNpbWFsID0gKG51bWJlciAlIDEpID4gMDtcbiAgICAgIGlmIChpc0RlY2ltYWwpIHtcbiAgICAgICAgbGV0IHByZWNpc2lvbiA9IDI7XG4gICAgICAgIGlmIChudW1iZXIgPCAxKSB7XG4gICAgICAgICAgcHJlY2lzaW9uID0gODtcbiAgICAgICAgfSBlbHNlIGlmIChudW1iZXIgPCAxMCkge1xuICAgICAgICAgIHByZWNpc2lvbiA9IDY7XG4gICAgICAgIH0gZWxzZSBpZiAobnVtYmVyIDwgMTAwMCkge1xuICAgICAgICAgIHByZWNpc2lvbiA9IDQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucm91bmQobnVtYmVyLCBwcmVjaXNpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bWJlci50b0ZpeGVkKDIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgcm91bmQoYW1vdW50LCBkZWNpbWFsLCBkaXJlY3Rpb24pIHtcbiAgICBhbW91bnQgPSBwYXJzZUZsb2F0KGFtb3VudCk7XG4gICAgaWYgKCFkZWNpbWFsKSBkZWNpbWFsID0gODtcbiAgICBpZiAoIWRpcmVjdGlvbikgZGlyZWN0aW9uID0gJ3JvdW5kJztcbiAgICBkZWNpbWFsID0gTWF0aC5wb3coMTAsIGRlY2ltYWwpO1xuICAgIHJldHVybiBNYXRoW2RpcmVjdGlvbl0oYW1vdW50ICogZGVjaW1hbCkgLyBkZWNpbWFsO1xuICB9XG4gIFxuICBsb29wKGFyciwgZm4sIGJ1c3ksIGVyciwgaSA9IDApIHtcbiAgICBjb25zdCBib2R5ID0gKG9rLCBlcikgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgciA9IGZuKGFycltpXSwgaSwgYXJyKTtcbiAgICAgICAgciAmJiByLnRoZW4gPyByLnRoZW4ob2spLmNhdGNoKGVyKSA6IG9rKHIpXG4gICAgICB9XG4gICAgICBjYXRjaCAoZSkge1xuICAgICAgICBlcihlKVxuICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgbmV4dCA9IChvaywgZXIpID0+ICgpID0+IHRoaXMubG9vcChhcnIsIGZuLCBvaywgZXIsICsraSk7XG4gICAgY29uc3QgcnVuID0gKG9rLCBlcikgPT4gaSA8IGFyci5sZW5ndGggPyBuZXcgUHJvbWlzZShib2R5KS50aGVuKG5leHQob2ssIGVyKSkuY2F0Y2goZXIpIDogb2soKTtcbiAgICByZXR1cm4gYnVzeSA/IHJ1bihidXN5LCBlcnIpIDogbmV3IFByb21pc2UocnVuKVxuICB9XG59XG5cbmNsYXNzIGZldGNoQ2xhc3Mge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMuc3RhdGUgPSB7fTtcbiAgfVxuICBcbiAgZmV0Y2hTY3JpcHQodXJsKSB7XG4gICAgaWYgKHRoaXMuc3RhdGVbdXJsXSkgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICB0aGlzLnN0YXRlW3VybF0gPSAncGVuZGluZyc7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlKSB0aGlzLnN0YXRlW3VybF0gPSAnZG93bmxvYWRlZCc7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgICAgc2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSkgZGVsZXRlIHRoaXMuc3RhdGVbdXJsXTtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgRmFpbGVkIHRvIGxvYWQgaW1hZ2UncyBVUkw6ICR7dXJsfWApKTtcbiAgICAgIH0pO1xuICAgICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcbiAgICAgIHNjcmlwdC5zcmMgPSB1cmw7XG4gICAgfSk7XG4gIH1cbiAgXG4gIGZldGNoU3R5bGUodXJsKSB7XG4gICAgaWYgKHRoaXMuc3RhdGVbdXJsXSkgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICB0aGlzLnN0YXRlW3VybF0gPSAncGVuZGluZyc7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG4gICAgICBsaW5rLnNldEF0dHJpYnV0ZSgncmVsJywgJ3N0eWxlc2hlZXQnKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnaHJlZicsIHVybCk7XG4gICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlKSB0aGlzLnN0YXRlW3VybF0gPSAnZG93bmxvYWRlZCc7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUpIGRlbGV0ZSB0aGlzLnN0YXRlW3VybF07XG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYEZhaWxlZCB0byBsb2FkIHN0eWxlIFVSTDogJHt1cmx9YCkpO1xuICAgICAgfSk7XG4gICAgICBsaW5rLmhyZWYgPSB1cmw7XG4gICAgfSk7XG4gIH1cbiAgXG4gIGZldGNoQ2hhcnREYXRhKHVyaSwgZnJvbVN0YXRlID0gZmFsc2Upe1xuICAgIGNvbnN0IHVybCA9ICdodHRwczovL2dyYXBocy5jb2lucGFwcmlrYS5jb20nICsgdXJpO1xuICAgIHJldHVybiB0aGlzLmZldGNoRGF0YSh1cmwsIGZyb21TdGF0ZSk7XG4gIH1cbiAgXG4gIGZldGNoRGF0YSh1cmwsIGZyb21TdGF0ZSl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGlmIChmcm9tU3RhdGUpe1xuICAgICAgICBpZiAodGhpcy5zdGF0ZVt1cmxdID09PSAncGVuZGluZycpe1xuICAgICAgICAgIGxldCBwcm9taXNlVGltZW91dCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuZmV0Y2hEYXRhKHVybCwgZnJvbVN0YXRlKSk7XG4gICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBwcm9taXNlVGltZW91dDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoISF0aGlzLnN0YXRlW3VybF0pe1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5zdGF0ZVt1cmxdLmNsb25lKCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsZXQgcHJvbWlzZUZldGNoID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICBwcm9taXNlRmV0Y2ggPSBwcm9taXNlRmV0Y2gudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuc3RhdGVbdXJsXSA9ICdwZW5kaW5nJztcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCk7XG4gICAgICB9KTtcbiAgICAgIHByb21pc2VGZXRjaCA9IHByb21pc2VGZXRjaC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICB0aGlzLnN0YXRlW3VybF0gPSByZXNwb25zZTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmNsb25lKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwcm9taXNlRmV0Y2g7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbn1cblxubmV3IHdpZGdldHNDb250cm9sbGVyKCk7XG5jb25zdCBjcEJvb3RzdHJhcCA9IG5ldyBib290c3RyYXBDbGFzcygpO1xuY29uc3QgZmV0Y2hTZXJ2aWNlID0gbmV3IGZldGNoQ2xhc3MoKTsiXX0=
