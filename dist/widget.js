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
            newSettings.mainElement = element;
            _this2.widgets.states.push(newSettings);
            var promise = Promise.resolve();
            promise = promise.then(function () {
              var chartScripts = ['http://code.highcharts.com/stock/highstock.js', 'https://code.highcharts.com/modules/exporting.js', 'https://code.highcharts.com/modules/no-data-to-display.js', 'https://code.highcharts.com/modules/offline-exporting.js'];
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
            color: '#0645ad'
          },
          itemMarginTop: 8
        },
        navigator: true,
        tooltip: {
          shared: true,
          split: false,
          animation: false,
          borderWidth: 0,
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
          lineColor: '#505050',
          tickColor: '#505050',
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
          gridLineColor: '#505050',
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
          color: '#838383' || 'url(#fill-volume-chart)',
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
            'id': 'fill-volume-chart',
            'path': {
              d: 'M 3 0 L 3 10 M 8 0 L 8 10',
              stroke: "#e3e3e3",
              fill: '#f1f1f1',
              strokeWidth: 2
            }
          }, {
            'id': 'fill-volume-chart-night',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7SUNBTSxpQjtBQUNKLCtCQUFjO0FBQUE7O0FBQ1osU0FBSyxPQUFMLEdBQWUsSUFBSSxZQUFKLEVBQWY7QUFDQSxTQUFLLElBQUw7QUFDRDs7OzsyQkFFSztBQUFBOztBQUNKLGFBQU8sS0FBSyxPQUFMLENBQWEsUUFBYixDQUFzQixVQUE3QixJQUEyQyxFQUEzQztBQUNBLGVBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDO0FBQUEsZUFBTSxNQUFLLFdBQUwsRUFBTjtBQUFBLE9BQTlDLEVBQXdFLEtBQXhFO0FBQ0EsYUFBTyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLFVBQXpDLEdBQXNELFlBQU07QUFDMUQsZUFBTyxNQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLElBQXpDLEdBQWdELEtBQWhEO0FBQ0EsY0FBSyxXQUFMO0FBQ0QsT0FIRDtBQUlEOzs7a0NBRVk7QUFBQTs7QUFDWCxVQUFJLENBQUMsT0FBTyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFVBQTdCLEVBQXlDLElBQTlDLEVBQW1EO0FBQ2pELGVBQU8sS0FBSyxPQUFMLENBQWEsUUFBYixDQUFzQixVQUE3QixFQUF5QyxJQUF6QyxHQUFnRCxJQUFoRDtBQUNBLFlBQUksZUFBZSxNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsU0FBUyxzQkFBVCxDQUFnQyxLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFNBQXRELENBQTNCLENBQW5CO0FBQ0EsYUFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixZQUE1QjtBQUNBLGVBQU8sZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsWUFBTTtBQUN0QyxpQkFBSyxPQUFMLENBQWEsY0FBYixDQUE0QixZQUE1QjtBQUNBLGVBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxhQUFhLE1BQWpDLEVBQXlDLEdBQXpDLEVBQTZDO0FBQzNDLG1CQUFLLE9BQUwsQ0FBYSx3QkFBYixDQUFzQyxDQUF0QztBQUNEO0FBQ0YsU0FMRCxFQUtHLEtBTEg7QUFNQSxZQUFJLGdCQUFnQixLQUFLLE9BQUwsQ0FBYSxnQkFBYixFQUFwQjtBQUNBLFlBQUksaUJBQWlCLGNBQWMsT0FBL0IsSUFBMEMsY0FBYyxPQUFkLENBQXNCLGdCQUFwRSxFQUFxRjtBQUNuRixjQUFJLFVBQVUsS0FBSyxLQUFMLENBQVcsY0FBYyxPQUFkLENBQXNCLGdCQUFqQyxDQUFkO0FBQ0EsY0FBSSxPQUFPLElBQVAsQ0FBWSxPQUFaLENBQUosRUFBeUI7QUFDdkIsZ0JBQUksT0FBTyxPQUFPLElBQVAsQ0FBWSxPQUFaLENBQVg7QUFDQSxpQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsR0FBakMsRUFBcUM7QUFDbkMsa0JBQUksTUFBTSxLQUFLLENBQUwsRUFBUSxPQUFSLENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLENBQVY7QUFDQSxtQkFBSyxPQUFMLENBQWEsUUFBYixDQUFzQixHQUF0QixJQUE2QixRQUFRLEtBQUssQ0FBTCxDQUFSLENBQTdCO0FBQ0Q7QUFDRjtBQUNGO0FBQ0QsbUJBQVcsWUFBTTtBQUNmLGlCQUFLLE9BQUwsQ0FBYSxNQUFiLEdBQXNCLEVBQXRCO0FBQ0EsaUJBQU8sWUFBWSxJQUFaLENBQWlCLFlBQWpCLEVBQStCLFVBQUMsT0FBRCxFQUFVLEtBQVYsRUFBb0I7QUFDeEQsZ0JBQUksY0FBYyxLQUFLLEtBQUwsQ0FBVyxLQUFLLFNBQUwsQ0FBZSxPQUFLLE9BQUwsQ0FBYSxRQUE1QixDQUFYLENBQWxCO0FBQ0Esd0JBQVksV0FBWixHQUEwQixRQUFRLFNBQVIsQ0FBa0IsUUFBbEIsQ0FBMkIsV0FBM0IsQ0FBMUI7QUFDQSx3QkFBWSxXQUFaLEdBQTBCLE9BQTFCO0FBQ0EsbUJBQUssT0FBTCxDQUFhLE1BQWIsQ0FBb0IsSUFBcEIsQ0FBeUIsV0FBekI7QUFDQSxnQkFBSSxVQUFVLFFBQVEsT0FBUixFQUFkO0FBQ0Esc0JBQVUsUUFBUSxJQUFSLENBQWEsWUFBTTtBQUMzQixrQkFBSSxlQUFlLENBQ2pCLCtDQURpQixFQUVqQixrREFGaUIsRUFHakIsMkRBSGlCLEVBSWpCLDBEQUppQixDQUFuQjtBQU1BLHFCQUFRLFlBQVksT0FBWixDQUFvQixPQUFwQixDQUE0QixPQUE1QixJQUF1QyxDQUFDLENBQXhDLElBQTZDLENBQUMsT0FBTyxVQUF0RCxHQUNILFlBQVksSUFBWixDQUFpQixZQUFqQixFQUErQixnQkFBUTtBQUNyQyx1QkFBTyxhQUFhLFdBQWIsQ0FBeUIsSUFBekIsQ0FBUDtBQUNELGVBRkQsQ0FERyxHQUlILElBSko7QUFLRCxhQVpTLENBQVY7QUFhQSxzQkFBVSxRQUFRLElBQVIsQ0FBYSxZQUFNO0FBQzNCLHFCQUFPLE9BQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsS0FBbEIsQ0FBUDtBQUNELGFBRlMsQ0FBVjtBQUdBLG1CQUFPLE9BQVA7QUFDRCxXQXZCTSxDQUFQO0FBd0JELFNBMUJELEVBMEJHLEVBMUJIO0FBMkJEO0FBQ0Y7Ozs7OztJQUdHLFk7QUFDSiwwQkFBYztBQUFBOztBQUNaLFNBQUssTUFBTCxHQUFjLEVBQWQ7QUFDQSxTQUFLLFFBQUwsR0FBZ0I7QUFDZCxrQkFBWSxtQkFERTtBQUVkLGlCQUFXLDZCQUZHO0FBR2QsbUJBQWEsZ0JBSEM7QUFJZCxnQkFBVSxhQUpJO0FBS2Qsd0JBQWtCLEtBTEo7QUFNZCxrQkFBWSxDQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWMsS0FBZCxFQUFxQixJQUFyQixFQUEyQixJQUEzQixFQUFpQyxLQUFqQyxFQUF3QyxLQUF4QyxDQU5FO0FBT2QsYUFBTyxJQVBPO0FBUWQsZUFBUyxDQUFDLE9BQUQsRUFBVSxnQkFBVixDQVJLO0FBU2QscUJBQWUsS0FURDtBQVVkLHNCQUFnQixLQVZGO0FBV2QsZ0JBQVUsSUFYSTtBQVlkLGlCQUFXLElBWkc7QUFhZCxlQUFTLElBYks7QUFjZCxnQkFBVSxJQWRJO0FBZWQsa0JBQVksMkRBZkU7QUFnQmQsNkJBQXVCLEtBaEJUO0FBaUJkLGNBQVE7QUFDTixjQUFNLFNBREE7QUFFTixnQkFBUSxTQUZGO0FBR04sZUFBTyxTQUhEO0FBSU4sMEJBQWtCLFNBSlo7QUFLTixjQUFNLFNBTEE7QUFNTixtQkFBVyxTQU5MO0FBT04sb0JBQVksU0FQTjtBQVFOLG9CQUFZLFNBUk47QUFTTixnQ0FBd0IsU0FUbEI7QUFVTiwrQkFBdUIsU0FWakI7QUFXTiwrQkFBdUI7QUFYakIsT0FqQk07QUE4QmQsZ0JBQVUsSUE5Qkk7QUErQmQsbUJBQWEsS0EvQkM7QUFnQ2QsY0FBUSxLQWhDTTtBQWlDZCxlQUFTLGNBakNLO0FBa0NkLG9CQUFjLEVBbENBO0FBbUNkLG1CQUFhLElBbkNDO0FBb0NkLDJCQUFxQixFQXBDUDtBQXFDZCx5QkFBbUIsRUFyQ0w7QUFzQ2QsYUFBTyxJQXRDTztBQXVDZCxXQUFLO0FBQ0gsWUFBSSxHQUREO0FBRUgsV0FBRyxHQUZBO0FBR0gsV0FBRztBQUhBO0FBdkNTLEtBQWhCO0FBNkNEOzs7O3lCQUVJLEssRUFBTztBQUFBOztBQUNWLFVBQUksQ0FBQyxLQUFLLGNBQUwsQ0FBb0IsS0FBcEIsQ0FBTCxFQUFpQztBQUMvQixlQUFPLFFBQVEsS0FBUixDQUFjLDJDQUEyQyxLQUFLLFFBQUwsQ0FBYyxTQUF6RCxHQUFxRSxHQUFuRixDQUFQO0FBQ0Q7QUFDRCxVQUFJLFVBQVUsUUFBUSxPQUFSLEVBQWQ7QUFDQSxnQkFBVSxRQUFRLElBQVIsQ0FBYSxZQUFNO0FBQzNCLGVBQU8sT0FBSyxXQUFMLENBQWlCLEtBQWpCLENBQVA7QUFDRCxPQUZTLENBQVY7QUFHQSxnQkFBVSxRQUFRLElBQVIsQ0FBYSxZQUFNO0FBQzNCLGVBQU8sT0FBSyxhQUFMLENBQW1CLEtBQW5CLENBQVA7QUFDRCxPQUZTLENBQVY7QUFHQSxhQUFPLE9BQVA7QUFDRDs7O21DQUVjLFEsRUFBVTtBQUN2QixXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksU0FBUyxNQUE3QixFQUFxQyxHQUFyQyxFQUEwQztBQUN4QyxZQUFJLFFBQVEsU0FBUyxDQUFULEVBQVkscUJBQVosR0FBb0MsS0FBaEQ7QUFDQSxZQUFJLFVBQVUsT0FBTyxJQUFQLENBQVksS0FBSyxRQUFMLENBQWMsR0FBMUIsQ0FBZDtBQUNBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxRQUFRLE1BQTVCLEVBQW9DLEdBQXBDLEVBQXlDO0FBQ3ZDLGNBQUksU0FBUyxRQUFRLENBQVIsQ0FBYjtBQUNBLGNBQUksV0FBVyxLQUFLLFFBQUwsQ0FBYyxHQUFkLENBQWtCLE1BQWxCLENBQWY7QUFDQSxjQUFJLFlBQVksS0FBSyxRQUFMLENBQWMsU0FBZCxHQUEwQixJQUExQixHQUFpQyxNQUFqRDtBQUNBLGNBQUksU0FBUyxRQUFiLEVBQXVCLFNBQVMsQ0FBVCxFQUFZLFNBQVosQ0FBc0IsR0FBdEIsQ0FBMEIsU0FBMUI7QUFDdkIsY0FBSSxRQUFRLFFBQVosRUFBc0IsU0FBUyxDQUFULEVBQVksU0FBWixDQUFzQixNQUF0QixDQUE2QixTQUE3QjtBQUN2QjtBQUNGO0FBQ0Y7OzttQ0FFYyxLLEVBQU87QUFDcEIsYUFBUSxLQUFLLE1BQUwsQ0FBWSxLQUFaLENBQUQsR0FBdUIsS0FBSyxNQUFMLENBQVksS0FBWixFQUFtQixXQUExQyxHQUF3RCxJQUEvRDtBQUNEOzs7Z0NBRVcsSyxFQUFPO0FBQUE7O0FBQ2pCLGFBQU8sSUFBSSxPQUFKLENBQVksbUJBQVc7QUFDNUIsWUFBSSxjQUFjLE9BQUssY0FBTCxDQUFvQixLQUFwQixDQUFsQjtBQUNBLFlBQUksZUFBZSxZQUFZLE9BQS9CLEVBQXdDO0FBQ3RDLGNBQUksQ0FBQyxZQUFZLE9BQVosQ0FBb0IsT0FBckIsSUFBZ0MsWUFBWSxPQUFaLENBQW9CLE9BQXBCLEtBQWdDLFVBQXBFLEVBQWdGLE9BQUssVUFBTCxDQUFnQixLQUFoQixFQUF1QixTQUF2QixFQUFrQyxDQUFDLGdCQUFELENBQWxDO0FBQ2hGLGNBQUksQ0FBQyxZQUFZLE9BQVosQ0FBb0IsT0FBckIsSUFBZ0MsWUFBWSxPQUFaLENBQW9CLE9BQXBCLEtBQWdDLFVBQXBFLEVBQWdGLE9BQUssVUFBTCxDQUFnQixLQUFoQixFQUF1QixTQUF2QixFQUFrQyxFQUFsQztBQUNoRixjQUFJLFlBQVksT0FBWixDQUFvQixPQUF4QixFQUFpQyxPQUFLLFVBQUwsQ0FBZ0IsS0FBaEIsRUFBdUIsU0FBdkIsRUFBa0MsS0FBSyxLQUFMLENBQVcsWUFBWSxPQUFaLENBQW9CLE9BQS9CLENBQWxDO0FBQ2pDLGNBQUksWUFBWSxPQUFaLENBQW9CLGVBQXhCLEVBQXlDLE9BQUssVUFBTCxDQUFnQixLQUFoQixFQUF1QixrQkFBdkIsRUFBMkMsWUFBWSxPQUFaLENBQW9CLGVBQS9EO0FBQ3pDLGNBQUksWUFBWSxPQUFaLENBQW9CLFFBQXhCLEVBQWtDLE9BQUssVUFBTCxDQUFnQixLQUFoQixFQUF1QixVQUF2QixFQUFtQyxZQUFZLE9BQVosQ0FBb0IsUUFBdkQ7QUFDbEMsY0FBSSxZQUFZLE9BQVosQ0FBb0IsbUJBQXhCLEVBQTZDLE9BQUssVUFBTCxDQUFnQixLQUFoQixFQUF1Qix1QkFBdkIsRUFBaUQsWUFBWSxPQUFaLENBQW9CLG1CQUFwQixLQUE0QyxNQUE3RjtBQUM3QyxjQUFJLFlBQVksT0FBWixDQUFvQixZQUF4QixFQUFzQyxPQUFLLFVBQUwsQ0FBZ0IsS0FBaEIsRUFBdUIsZUFBdkIsRUFBeUMsWUFBWSxPQUFaLENBQW9CLFlBQXBCLEtBQXFDLE1BQTlFO0FBQ3RDLGNBQUksWUFBWSxPQUFaLENBQW9CLGFBQXhCLEVBQXVDLE9BQUssVUFBTCxDQUFnQixLQUFoQixFQUF1QixnQkFBdkIsRUFBeUMsWUFBWSxrQkFBWixDQUErQixZQUFZLE9BQVosQ0FBb0IsYUFBbkQsQ0FBekM7QUFDdkMsY0FBSSxZQUFZLE9BQVosQ0FBb0IsUUFBeEIsRUFBa0MsT0FBSyxVQUFMLENBQWdCLEtBQWhCLEVBQXVCLFVBQXZCLEVBQW1DLFlBQVksT0FBWixDQUFvQixRQUF2RDtBQUNsQyxjQUFJLFlBQVksT0FBWixDQUFvQixTQUF4QixFQUFtQyxPQUFLLFVBQUwsQ0FBZ0IsS0FBaEIsRUFBdUIsWUFBdkIsRUFBcUMsWUFBWSxPQUFaLENBQW9CLFNBQXpEO0FBQ25DLGNBQUksWUFBWSxPQUFaLENBQW9CLGNBQXhCLEVBQXdDLE9BQUssVUFBTCxDQUFnQixLQUFoQixFQUF1QixrQkFBdkIsRUFBMkMsWUFBWSxPQUFaLENBQW9CLGNBQS9EO0FBQ3hDLGNBQUksWUFBWSxPQUFaLENBQW9CLFFBQXhCLEVBQWtDLE9BQUssVUFBTCxDQUFnQixLQUFoQixFQUF1QixXQUF2QixFQUFvQyxZQUFZLE9BQVosQ0FBb0IsUUFBeEQ7QUFDbEMsY0FBSSxZQUFZLE9BQVosQ0FBb0IsUUFBeEIsRUFBa0MsT0FBSyxVQUFMLENBQWdCLEtBQWhCLEVBQXVCLFdBQXZCLEVBQW9DLFlBQVksT0FBWixDQUFvQixRQUF4RDtBQUNsQyxjQUFJLFlBQVksT0FBWixDQUFvQixPQUF4QixFQUFpQyxPQUFLLFVBQUwsQ0FBZ0IsS0FBaEIsRUFBdUIsVUFBdkIsRUFBbUMsWUFBWSxPQUFaLENBQW9CLE9BQXZEO0FBQ2pDLGNBQUksWUFBWSxPQUFaLENBQW9CLE1BQXhCLEVBQWdDLE9BQUssVUFBTCxDQUFnQixLQUFoQixFQUF1QixVQUF2QixFQUFtQyxZQUFZLE9BQVosQ0FBb0IsTUFBdkQ7QUFDaEMsaUJBQU8sU0FBUDtBQUNEO0FBQ0QsZUFBTyxTQUFQO0FBQ0QsT0FyQk0sQ0FBUDtBQXNCRDs7O2tDQUVhLEssRUFBTztBQUFBOztBQUNuQixVQUFJLE9BQU8sSUFBUCxDQUFZLEtBQUssUUFBTCxDQUFjLFlBQTFCLEVBQXdDLE1BQXhDLEtBQW1ELENBQXZELEVBQTBELEtBQUssZUFBTCxDQUFxQixLQUFLLFFBQUwsQ0FBYyxRQUFuQztBQUMxRCxVQUFJLFVBQVUsUUFBUSxPQUFSLEVBQWQ7QUFDQSxnQkFBVSxRQUFRLElBQVIsQ0FBYSxZQUFNO0FBQzNCLGVBQU8sT0FBSyxVQUFMLEVBQVA7QUFDRCxPQUZTLENBQVY7QUFHQSxnQkFBVSxRQUFRLElBQVIsQ0FBYSxZQUFNO0FBQzNCLGVBQU8sT0FBSyxnQkFBTCxDQUFzQixLQUF0QixDQUFQO0FBQ0QsT0FGUyxDQUFWO0FBR0EsZ0JBQVUsUUFBUSxJQUFSLENBQWEsWUFBTTtBQUMzQixlQUFPLE9BQUssWUFBTCxDQUFrQixLQUFsQixDQUFQO0FBQ0QsT0FGUyxDQUFWO0FBR0EsYUFBTyxPQUFQO0FBQ0Q7OztxQ0FFZ0IsSyxFQUFPO0FBQUE7O0FBQ3RCLFVBQUksY0FBYyxLQUFLLGNBQUwsQ0FBb0IsS0FBcEIsQ0FBbEI7QUFDQSxVQUFJLFVBQVUsRUFBZDtBQUNBLFVBQUksaUJBQWlCLElBQXJCO0FBQ0EsVUFBSSxVQUFVLFFBQVEsT0FBUixFQUFkO0FBQ0EsZ0JBQVUsUUFBUSxJQUFSLENBQWEsWUFBTTtBQUMzQixlQUFPLFlBQVksSUFBWixDQUFpQixPQUFLLE1BQUwsQ0FBWSxLQUFaLEVBQW1CLE9BQXBDLEVBQTZDLGtCQUFVO0FBQzVELGNBQUksUUFBUSxJQUFaO0FBQ0EsY0FBSSxXQUFXLE9BQWYsRUFBd0IsUUFBUSxPQUFSO0FBQ3hCLGNBQUksV0FBVyxnQkFBZixFQUFpQyxRQUFRLGVBQVI7QUFDakMsaUJBQVEsS0FBRCxHQUFVLGtCQUFlLEtBQWYsY0FBZ0MsS0FBaEMsRUFBdUMsSUFBdkMsQ0FBNEM7QUFBQSxtQkFBVSxXQUFXLE1BQXJCO0FBQUEsV0FBNUMsQ0FBVixHQUFxRixJQUE1RjtBQUNELFNBTE0sQ0FBUDtBQU1ELE9BUFMsQ0FBVjtBQVFBLGdCQUFVLFFBQVEsSUFBUixDQUFhLFlBQU07QUFDM0IsZUFBTyxZQUFZLFNBQVosR0FBd0IsT0FBSyxpQkFBTCxDQUF1QixLQUF2QixJQUFnQyxPQUFoQyxHQUEwQyxPQUFLLFlBQUwsQ0FBa0IsS0FBbEIsQ0FBekU7QUFDRCxPQUZTLENBQVY7QUFHQSxnQkFBVSxRQUFRLElBQVIsQ0FBYSxZQUFNO0FBQzNCLHlCQUFpQixTQUFTLGNBQVQsQ0FBNEIsT0FBSyxRQUFMLENBQWMsU0FBMUMscUJBQXFFLEtBQXJFLENBQWpCO0FBQ0EsZUFBUSxjQUFELEdBQW1CLGVBQWUsYUFBZixDQUE2QixrQkFBN0IsQ0FBZ0QsV0FBaEQsRUFBNkQsT0FBSyxtQkFBTCxDQUF5QixLQUF6QixFQUFnQyxPQUFoQyxDQUE3RCxDQUFuQixHQUE0SCxJQUFuSTtBQUNELE9BSFMsQ0FBVjtBQUlBLGdCQUFVLFFBQVEsSUFBUixDQUFhLFlBQU07QUFDM0IsWUFBSSxjQUFKLEVBQW1CO0FBQ2pCLGlCQUFLLE1BQUwsQ0FBWSxLQUFaLEVBQW1CLEtBQW5CLEdBQTJCLElBQUksVUFBSixDQUFlLGNBQWYsRUFBK0IsT0FBSyxNQUFMLENBQVksS0FBWixDQUEvQixDQUEzQjtBQUNBLGlCQUFLLGtCQUFMLENBQXdCLEtBQXhCO0FBQ0Q7QUFDRCxlQUFPLElBQVA7QUFDRCxPQU5TLENBQVY7O0FBUUEsZ0JBQVUsUUFBUSxJQUFSLENBQWEsWUFBTTtBQUMzQixlQUFPLE9BQUssd0JBQUwsQ0FBOEIsS0FBOUIsQ0FBUDtBQUNELE9BRlMsQ0FBVjtBQUdBLGdCQUFVLFFBQVEsSUFBUixDQUFhLFlBQU07QUFDM0IsZUFBTyxPQUFLLE9BQUwsQ0FBYSxLQUFiLENBQVA7QUFDRCxPQUZTLENBQVY7QUFHQSxhQUFPLE9BQVA7QUFDRDs7O3VDQUVrQixLLEVBQU07QUFBQTs7QUFDdkIsVUFBSSxjQUFjLEtBQUssY0FBTCxDQUFvQixLQUFwQixDQUFsQjtBQUNBLFVBQUksaUJBQWlCLFlBQVksZ0JBQVosQ0FBNkIsbUJBQTdCLENBQXJCO0FBQ0EsV0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLGVBQWUsTUFBbkMsRUFBMkMsR0FBM0MsRUFBK0M7QUFDN0MsWUFBSSxVQUFVLGVBQWUsQ0FBZixFQUFrQixnQkFBbEIsQ0FBbUMsbUNBQW5DLENBQWQ7QUFDQSxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksUUFBUSxNQUE1QixFQUFvQyxHQUFwQyxFQUF3QztBQUN0QyxrQkFBUSxDQUFSLEVBQVcsZ0JBQVgsQ0FBNEIsT0FBNUIsRUFBcUMsVUFBQyxLQUFELEVBQVc7QUFDOUMsbUJBQUssZUFBTCxDQUFxQixLQUFyQixFQUE0QixLQUE1QjtBQUNELFdBRkQsRUFFRyxLQUZIO0FBR0Q7QUFDRjtBQUNGOzs7b0NBRWUsSyxFQUFPLEssRUFBTTtBQUMzQixVQUFJLFlBQVksa0JBQWhCO0FBQ0EsV0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQU0sTUFBTixDQUFhLFVBQWIsQ0FBd0IsVUFBeEIsQ0FBbUMsTUFBdkQsRUFBK0QsR0FBL0QsRUFBbUU7QUFDakUsWUFBSSxVQUFVLE1BQU0sTUFBTixDQUFhLFVBQWIsQ0FBd0IsVUFBeEIsQ0FBbUMsQ0FBbkMsQ0FBZDtBQUNBLFlBQUksUUFBUSxTQUFSLENBQWtCLFFBQWxCLENBQTJCLFNBQTNCLENBQUosRUFBMkMsUUFBUSxTQUFSLENBQWtCLE1BQWxCLENBQXlCLFNBQXpCO0FBQzVDO0FBQ0QsVUFBSSxTQUFTLE1BQU0sTUFBTixDQUFhLE9BQWIsQ0FBcUIsbUJBQXJCLENBQWI7QUFDQSxVQUFJLE9BQU8sT0FBTyxPQUFQLENBQWUsSUFBMUI7QUFDQSxVQUFJLHFCQUFxQixPQUFPLGFBQVAsQ0FBcUIsbUNBQXJCLENBQXpCO0FBQ0EsVUFBSSxRQUFRLE1BQU0sTUFBTixDQUFhLE9BQWIsQ0FBcUIsTUFBakM7QUFDQSx5QkFBbUIsU0FBbkIsR0FBK0IsS0FBSyxjQUFMLENBQW9CLEtBQXBCLEVBQTJCLE1BQU0sV0FBTixFQUEzQixDQUEvQjtBQUNBLFdBQUssVUFBTCxDQUFnQixLQUFoQixFQUF1QixJQUF2QixFQUE2QixLQUE3QjtBQUNBLFlBQU0sTUFBTixDQUFhLFNBQWIsQ0FBdUIsR0FBdkIsQ0FBMkIsU0FBM0I7QUFDQSxXQUFLLGFBQUwsQ0FBbUIsS0FBbkIsRUFBMEIsZUFBMUIsRUFBMkMsS0FBM0M7QUFDRDs7O2tDQUVhLEssRUFBTyxJLEVBQU0sSSxFQUFLO0FBQzlCLFVBQUksS0FBUyxLQUFLLFFBQUwsQ0FBYyxTQUF2QixxQkFBa0QsS0FBdEQ7QUFDQSxhQUFPLFNBQVMsYUFBVCxDQUF1QixJQUFJLFdBQUosTUFBbUIsRUFBbkIsR0FBd0IsSUFBeEIsRUFBZ0MsRUFBRSxRQUFRLEVBQUUsVUFBRixFQUFWLEVBQWhDLENBQXZCLENBQVA7QUFDRDs7OzRCQUVPLEssRUFBTztBQUFBOztBQUNiLFVBQU0sTUFBTSwyQ0FBMkMsS0FBSyxNQUFMLENBQVksS0FBWixFQUFtQixRQUE5RCxHQUF5RSxTQUF6RSxHQUFxRixLQUFLLE1BQUwsQ0FBWSxLQUFaLEVBQW1CLGdCQUFwSDtBQUNBLGFBQU8sYUFBYSxTQUFiLENBQXVCLEdBQXZCLEVBQTRCLElBQTVCLENBQWlDLFVBQUMsUUFBRCxFQUFjO0FBQ3BELGVBQU8sU0FBUyxJQUFULEdBQWdCLElBQWhCLENBQXFCLGtCQUFVO0FBQ3BDLGNBQUksQ0FBQyxPQUFLLE1BQUwsQ0FBWSxLQUFaLEVBQW1CLE1BQXhCLEVBQWdDLE9BQUssVUFBTCxDQUFnQixLQUFoQixFQUF1QixRQUF2QixFQUFpQyxJQUFqQztBQUNoQyxpQkFBSyxZQUFMLENBQWtCLEtBQWxCLEVBQXlCLE1BQXpCO0FBQ0QsU0FITSxDQUFQO0FBSUQsT0FMTSxFQUtKLEtBTEksQ0FLRSxpQkFBUztBQUNoQixlQUFPLE9BQUssY0FBTCxDQUFvQixLQUFwQixFQUEyQixLQUEzQixDQUFQO0FBQ0QsT0FQTSxDQUFQO0FBUUQ7OzttQ0FFYyxLLEVBQU8sRyxFQUFLO0FBQ3pCLFVBQUksS0FBSyxNQUFMLENBQVksS0FBWixFQUFtQixNQUF2QixFQUErQixLQUFLLFVBQUwsQ0FBZ0IsS0FBaEIsRUFBdUIsUUFBdkIsRUFBaUMsS0FBakM7QUFDL0IsV0FBSyxVQUFMLENBQWdCLEtBQWhCLEVBQXVCLFNBQXZCLEVBQWtDLGtCQUFsQztBQUNBLGNBQVEsS0FBUixDQUFjLHlDQUF5QyxHQUF2RCxFQUE0RCxLQUFLLE1BQUwsQ0FBWSxLQUFaLENBQTVEO0FBQ0Q7OztpQ0FFWSxLLEVBQU87QUFBQTs7QUFDbEIsb0JBQWMsS0FBSyxNQUFMLENBQVksS0FBWixFQUFtQixRQUFqQztBQUNBLFVBQUksS0FBSyxNQUFMLENBQVksS0FBWixFQUFtQixhQUFuQixJQUFvQyxLQUFLLE1BQUwsQ0FBWSxLQUFaLEVBQW1CLGNBQW5CLEdBQW9DLElBQTVFLEVBQWtGO0FBQ2hGLGFBQUssTUFBTCxDQUFZLEtBQVosRUFBbUIsUUFBbkIsR0FBOEIsWUFBWSxZQUFNO0FBQzlDLGlCQUFLLE9BQUwsQ0FBYSxLQUFiO0FBQ0QsU0FGNkIsRUFFM0IsS0FBSyxNQUFMLENBQVksS0FBWixFQUFtQixjQUZRLENBQTlCO0FBR0Q7QUFDRjs7OzZDQUV3QixLLEVBQU87QUFDOUIsVUFBSSxDQUFDLEtBQUssTUFBTCxDQUFZLEtBQVosRUFBbUIsV0FBeEIsRUFBcUM7QUFDbkMsWUFBSSxjQUFjLEtBQUssY0FBTCxDQUFvQixLQUFwQixDQUFsQjtBQUNBLFlBQUksV0FBSixFQUFpQjtBQUNmLGNBQUksWUFBWSxRQUFaLENBQXFCLENBQXJCLEVBQXdCLFNBQXhCLEtBQXNDLE9BQTFDLEVBQW1EO0FBQ2pELHdCQUFZLFdBQVosQ0FBd0IsWUFBWSxVQUFaLENBQXVCLENBQXZCLENBQXhCO0FBQ0Q7QUFDRCxjQUFJLGdCQUFnQixZQUFZLGFBQVosQ0FBMEIsb0JBQTFCLENBQXBCO0FBQ0EsY0FBSSxRQUFRLGNBQWMscUJBQWQsR0FBc0MsS0FBdEMsR0FBOEMsRUFBMUQ7QUFDQSxlQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksY0FBYyxVQUFkLENBQXlCLE1BQTdDLEVBQXFELEdBQXJELEVBQTBEO0FBQ3hELHFCQUFTLGNBQWMsVUFBZCxDQUF5QixDQUF6QixFQUE0QixxQkFBNUIsR0FBb0QsS0FBN0Q7QUFDRDtBQUNELGNBQUksUUFBUSxTQUFTLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBWjtBQUNBLGdCQUFNLFNBQU4sR0FBa0IseUJBQXlCLEtBQXpCLEdBQWlDLGlCQUFqQyxHQUFxRCxNQUFNLE9BQU4sQ0FBYyxDQUFkLENBQXJELEdBQXdFLE1BQTFGO0FBQ0Esc0JBQVksWUFBWixDQUF5QixLQUF6QixFQUFnQyxZQUFZLFFBQVosQ0FBcUIsQ0FBckIsQ0FBaEM7QUFDRDtBQUNGO0FBQ0Y7Ozt3Q0FFbUIsSyxFQUFPLEcsRUFBSyxLLEVBQU8sTSxFQUFRO0FBQzdDLFVBQUksUUFBUSxLQUFLLE1BQUwsQ0FBWSxLQUFaLENBQVo7QUFDQSxVQUFJLGNBQWMsS0FBSyxjQUFMLENBQW9CLEtBQXBCLENBQWxCO0FBQ0EsVUFBSSxXQUFKLEVBQWlCO0FBQ2YsWUFBSSxjQUFlLE1BQUQsR0FBVyxRQUFYLEdBQXNCLEVBQXhDO0FBQ0EsWUFBSSxRQUFRLE1BQVIsSUFBa0IsUUFBUSxVQUE5QixFQUEwQztBQUN4QyxjQUFJLFFBQVEsVUFBWixFQUF3QjtBQUN0QixnQkFBSSxZQUFZLFlBQVksZ0JBQVosQ0FBNkIsd0JBQTdCLENBQWhCO0FBQ0EsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxVQUFVLE1BQTlCLEVBQXNDLEdBQXRDLEVBQTJDO0FBQ3pDLHdCQUFVLENBQVYsRUFBYSxJQUFiLEdBQW9CLEtBQUssU0FBTCxDQUFlLEtBQWYsQ0FBcEI7QUFDRDtBQUNGO0FBQ0QsZUFBSyxRQUFMLENBQWMsS0FBZDtBQUNEO0FBQ0QsWUFBSSxRQUFRLFFBQVIsSUFBb0IsUUFBUSxTQUFoQyxFQUEyQztBQUN6QyxjQUFJLGlCQUFpQixZQUFZLGdCQUFaLENBQTZCLGtCQUE3QixDQUFyQjtBQUNBLGVBQUssSUFBSSxLQUFJLENBQWIsRUFBZ0IsS0FBSSxlQUFlLE1BQW5DLEVBQTJDLElBQTNDLEVBQWdEO0FBQzlDLDJCQUFlLEVBQWYsRUFBa0IsU0FBbEIsR0FBK0IsQ0FBQyxNQUFNLE1BQVIsR0FBa0IsS0FBSyx3QkFBTCxDQUE4QixLQUE5QixDQUFsQixHQUF5RCxLQUFLLHFCQUFMLENBQTJCLEtBQTNCLENBQXZGO0FBQ0Q7QUFDRixTQUxELE1BS087QUFDTCxjQUFJLGlCQUFpQixZQUFZLGdCQUFaLENBQTZCLE1BQU0sR0FBTixHQUFZLFdBQXpDLENBQXJCO0FBQ0EsZUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLGVBQWUsTUFBbkMsRUFBMkMsR0FBM0MsRUFBZ0Q7QUFDOUMsZ0JBQUksZ0JBQWdCLGVBQWUsQ0FBZixDQUFwQjtBQUNBLGdCQUFJLGNBQWMsU0FBZCxDQUF3QixRQUF4QixDQUFpQyxpQkFBakMsQ0FBSixFQUF5RDtBQUN2RCxrQkFBSSxZQUFhLFdBQVcsS0FBWCxJQUFvQixDQUFyQixHQUEwQixvQkFBMUIsR0FBbUQsV0FBVyxLQUFYLElBQW9CLENBQXJCLEdBQTBCLHNCQUExQixHQUFtRCx5QkFBckg7QUFDQSw0QkFBYyxTQUFkLENBQXdCLE1BQXhCLENBQStCLHNCQUEvQjtBQUNBLDRCQUFjLFNBQWQsQ0FBd0IsTUFBeEIsQ0FBK0Isb0JBQS9CO0FBQ0EsNEJBQWMsU0FBZCxDQUF3QixNQUF4QixDQUErQix5QkFBL0I7QUFDQSxrQkFBSSxVQUFVLFNBQWQsRUFBeUI7QUFDdkIsd0JBQVEsWUFBWSxTQUFwQjtBQUNELGVBRkQsTUFFTztBQUNMLDhCQUFjLFNBQWQsQ0FBd0IsR0FBeEIsQ0FBNEIsU0FBNUI7QUFDQSx3QkFBUyxRQUFRLGtCQUFULEdBQStCLE1BQU0sWUFBWSxLQUFaLENBQWtCLEtBQWxCLEVBQXlCLENBQXpCLENBQU4sR0FBb0MsSUFBbkUsR0FBMEUsWUFBWSxLQUFaLENBQWtCLEtBQWxCLEVBQXlCLENBQXpCLElBQThCLEdBQWhIO0FBQ0Q7QUFDRjtBQUNELGdCQUFJLGNBQWMsU0FBZCxDQUF3QixRQUF4QixDQUFpQyxxQkFBakMsS0FBMkQsQ0FBQyxNQUFNLHFCQUF0RSxFQUE2RjtBQUMzRixzQkFBUSxHQUFSO0FBQ0Q7QUFDRCxnQkFBSSxjQUFjLFNBQWQsQ0FBd0IsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBSixFQUFxRDtBQUNuRCw0QkFBYyxTQUFkLEdBQTBCLFlBQVksV0FBWixDQUF3QixLQUF4QixLQUFrQyxZQUFZLFNBQXhFO0FBQ0QsYUFGRCxNQUVPO0FBQ0wsNEJBQWMsU0FBZCxHQUEwQixTQUFTLFlBQVksU0FBL0M7QUFDRDtBQUNGO0FBQ0Y7QUFDRjtBQUNGOzs7K0JBRVUsSyxFQUFPLEcsRUFBSyxLLEVBQU8sTSxFQUFRO0FBQ3BDLFVBQUksTUFBSixFQUFZO0FBQ1YsYUFBSyxNQUFMLENBQVksS0FBWixFQUFtQixNQUFuQixDQUEwQixHQUExQixJQUFpQyxLQUFqQztBQUNELE9BRkQsTUFFTztBQUNMLGFBQUssTUFBTCxDQUFZLEtBQVosRUFBbUIsR0FBbkIsSUFBMEIsS0FBMUI7QUFDRDtBQUNELFVBQUksUUFBUSxVQUFaLEVBQXdCO0FBQ3RCLGFBQUssZUFBTCxDQUFxQixLQUFyQjtBQUNEO0FBQ0QsV0FBSyxtQkFBTCxDQUF5QixLQUF6QixFQUFnQyxHQUFoQyxFQUFxQyxLQUFyQyxFQUE0QyxNQUE1QztBQUNEOzs7NkNBRXdCLEksRUFBTSxJLEVBQU07QUFBQTs7QUFDbkMsV0FBSyxRQUFMLENBQWMsWUFBZCxDQUEyQixJQUEzQixJQUFtQyxJQUFuQzs7QUFEbUMsaUNBRTFCLENBRjBCO0FBR2pDLFlBQUksOEJBQThCLFFBQUssTUFBTCxDQUFZLENBQVosRUFBZSxtQkFBZixDQUFtQyxNQUFuQyxHQUE0QyxDQUE1QyxJQUFpRCxTQUFTLElBQTVGO0FBQ0EsWUFBSSxRQUFLLE1BQUwsQ0FBWSxDQUFaLEVBQWUsUUFBZixLQUE0QixJQUE1QixJQUFvQywyQkFBeEMsRUFBcUU7QUFBQTtBQUNuRSxnQkFBSSxjQUFjLFFBQUssTUFBTCxDQUFZLENBQVosRUFBZSxXQUFqQztBQUNBLGdCQUFJLG9CQUFvQixNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsWUFBWSxnQkFBWixDQUE2QixpQkFBN0IsQ0FBM0IsQ0FBeEI7O0FBRm1FLHlDQUcxRCxDQUgwRDtBQUlqRSxnQ0FBa0IsQ0FBbEIsRUFBcUIsU0FBckIsQ0FBK0IsT0FBL0IsQ0FBdUMsVUFBQyxTQUFELEVBQWU7QUFDcEQsb0JBQUksVUFBVSxNQUFWLENBQWlCLGNBQWpCLElBQW1DLENBQUMsQ0FBeEMsRUFBMkM7QUFDekMsc0JBQUksZUFBZSxVQUFVLE9BQVYsQ0FBa0IsY0FBbEIsRUFBa0MsRUFBbEMsQ0FBbkI7QUFDQSxzQkFBSSxpQkFBaUIsU0FBckIsRUFBZ0MsZUFBZSxRQUFLLE1BQUwsQ0FBWSxDQUFaLEVBQWUsT0FBOUI7QUFDaEMsc0JBQUksYUFBYSxRQUFLLE1BQUwsQ0FBWSxDQUFaLEVBQWUsbUJBQWYsQ0FBbUMsT0FBbkMsQ0FBMkMsWUFBM0MsQ0FBakI7QUFDQSxzQkFBSSxPQUFPLFFBQUssY0FBTCxDQUFvQixDQUFwQixFQUF1QixZQUF2QixDQUFYO0FBQ0Esc0JBQUksYUFBYSxDQUFDLENBQWQsSUFBbUIsSUFBdkIsRUFBNkI7QUFDM0IsNEJBQUssTUFBTCxDQUFZLENBQVosRUFBZSxtQkFBZixDQUFtQyxNQUFuQyxDQUEwQyxVQUExQyxFQUFzRCxDQUF0RDtBQUNEO0FBQ0Qsb0NBQWtCLENBQWxCLEVBQXFCLFNBQXJCLEdBQWlDLElBQWpDO0FBQ0Esc0JBQUksa0JBQWtCLENBQWxCLEVBQXFCLE9BQXJCLENBQTZCLG9CQUE3QixDQUFKLEVBQXdEO0FBQ3RELCtCQUFXO0FBQUEsNkJBQU0sUUFBSyx3QkFBTCxDQUE4QixDQUE5QixDQUFOO0FBQUEscUJBQVgsRUFBbUQsRUFBbkQ7QUFDRDtBQUNGO0FBQ0YsZUFkRDtBQUppRTs7QUFHbkUsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxrQkFBa0IsTUFBdEMsRUFBOEMsR0FBOUMsRUFBbUQ7QUFBQSxxQkFBMUMsQ0FBMEM7QUFnQmxEO0FBbkJrRTtBQW9CcEU7QUF4QmdDOztBQUVuQyxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxNQUFMLENBQVksTUFBaEMsRUFBd0MsR0FBeEMsRUFBNkM7QUFBQSxjQUFwQyxDQUFvQztBQXVCNUM7QUFDRjs7O2lDQUVZLEssRUFBTyxJLEVBQU07QUFDeEIsVUFBSSxXQUFXLE9BQU8sSUFBUCxDQUFZLElBQVosQ0FBZjtBQUNBLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxTQUFTLE1BQTdCLEVBQXFDLEdBQXJDLEVBQTBDO0FBQ3hDLGFBQUssVUFBTCxDQUFnQixLQUFoQixFQUF1QixTQUFTLENBQVQsQ0FBdkIsRUFBb0MsS0FBSyxTQUFTLENBQVQsQ0FBTCxDQUFwQyxFQUF1RCxJQUF2RDtBQUNEO0FBQ0Y7OztpQ0FFWTtBQUNYLFVBQUksS0FBSyxRQUFMLENBQWMsU0FBZCxLQUE0QixLQUFoQyxFQUF1QztBQUNyQyxZQUFJLE1BQU0sS0FBSyxRQUFMLENBQWMsU0FBZCxJQUEyQixLQUFLLFFBQUwsQ0FBYyxVQUFkLEdBQTJCLFFBQTNCLEdBQXNDLEtBQUssUUFBTCxDQUFjLFdBQXpGO0FBQ0EsWUFBSSxDQUFDLFNBQVMsSUFBVCxDQUFjLGFBQWQsQ0FBNEIsZ0JBQWdCLEdBQWhCLEdBQXNCLElBQWxELENBQUwsRUFBNkQ7QUFDM0QsaUJBQU8sYUFBYSxVQUFiLENBQXdCLEdBQXhCLENBQVA7QUFDRDtBQUNELGVBQU8sUUFBUSxPQUFSLEVBQVA7QUFDRDtBQUNELGFBQU8sUUFBUSxPQUFSLEVBQVA7QUFDRDs7O3NDQUVpQixLLEVBQU87QUFDdkIsVUFBSSxPQUFPLEtBQUssTUFBTCxDQUFZLEtBQVosQ0FBWDtBQUNBLGFBQU8sb0NBQ0wsY0FESyxHQUNZLGdDQURaLEdBQytDLEtBQUssUUFEcEQsR0FDK0QsSUFEL0QsR0FFTCxRQUZLLEdBR0wsUUFISyxHQUlMLCtCQUpLLElBS0gsS0FBSyxNQUFOLEdBQWdCLEtBQUsscUJBQUwsQ0FBMkIsS0FBM0IsQ0FBaEIsR0FBb0QsS0FBSyx3QkFBTCxDQUE4QixLQUE5QixDQUxoRCxJQU1MLFFBTkssR0FPTCxRQVBGO0FBUUQ7OzswQ0FFcUIsSyxFQUFPO0FBQzNCLFVBQUksT0FBTyxLQUFLLE1BQUwsQ0FBWSxLQUFaLENBQVg7QUFDQSxhQUFPLGtCQUFrQixLQUFLLFNBQUwsQ0FBZSxLQUFLLFFBQXBCLENBQWxCLEdBQWtELElBQWxELEdBQ0wsMkJBREssSUFDMEIsS0FBSyxNQUFMLENBQVksSUFBWixJQUFvQixZQUFZLFNBRDFELElBQ3VFLFNBRHZFLEdBRUwsNkJBRkssSUFFNEIsS0FBSyxNQUFMLENBQVksTUFBWixJQUFzQixZQUFZLFNBRjlELElBRTJFLFNBRjNFLEdBR0wsV0FISyxHQUlMLFVBSkssR0FLTCx3Q0FMSyxJQUt1QyxZQUFZLFdBQVosQ0FBd0IsS0FBSyxNQUFMLENBQVksS0FBcEMsS0FBOEMsWUFBWSxTQUxqRyxJQUs4RyxVQUw5RyxHQU1MLGdDQU5LLEdBTThCLEtBQUssZ0JBTm5DLEdBTXNELFVBTnRELEdBT0wsc0VBUEssSUFPc0UsS0FBSyxNQUFMLENBQVksZ0JBQVosR0FBK0IsQ0FBaEMsR0FBcUMsSUFBckMsR0FBOEMsS0FBSyxNQUFMLENBQVksZ0JBQVosR0FBK0IsQ0FBaEMsR0FBcUMsTUFBckMsR0FBOEMsU0FQaEssSUFPOEssS0FQOUssSUFPdUwsWUFBWSxLQUFaLENBQWtCLEtBQUssTUFBTCxDQUFZLGdCQUE5QixFQUFnRCxDQUFoRCxLQUFzRCxZQUFZLFVBUHpQLElBT3VRLFdBUHZRLEdBUUwsV0FSSyxHQVNMLG9GQVRLLEdBU2tGLEtBQUssY0FBTCxDQUFvQixLQUFwQixFQUEyQixNQUEzQixDQVRsRixHQVN1SCxtQ0FUdkgsSUFTOEosS0FBSyxNQUFMLENBQVksSUFBWixJQUFvQixZQUFZLFNBVDlMLElBUzJNLGdCQVRsTjtBQVVEOzs7NkNBRXdCLEssRUFBTztBQUM5QixVQUFJLFVBQVUsS0FBSyxNQUFMLENBQVksS0FBWixFQUFtQixPQUFqQztBQUNBLGFBQU8sNkVBQThFLEtBQUssY0FBTCxDQUFvQixLQUFwQixFQUEyQixPQUEzQixDQUE5RSxHQUFxSCxRQUE1SDtBQUNEOzs7K0NBRTBCLEssRUFBTztBQUNoQyxhQUFPLFFBQVEsT0FBUixDQUFpQixLQUFLLE1BQUwsQ0FBWSxLQUFaLEVBQW1CLE9BQW5CLENBQTJCLE9BQTNCLENBQW1DLGdCQUFuQyxJQUF1RCxDQUFDLENBQXpELEdBQThELHFDQUNuRixLQUFLLGdCQUFMLENBQXNCLEtBQXRCLENBRG1GLEdBRW5GLEtBQUssc0JBQUwsQ0FBNEIsS0FBNUIsQ0FGbUYsR0FHbkYsS0FBSyxzQkFBTCxDQUE0QixLQUE1QixDQUhtRixHQUluRixRQUpxQixHQUlWLEVBSk4sQ0FBUDtBQUtEOzs7cUNBRWdCLEssRUFBTztBQUN0QixhQUFPLFVBQ0wsZ0RBREssR0FDOEMsS0FBSyxjQUFMLENBQW9CLEtBQXBCLEVBQTJCLEtBQTNCLENBRDlDLEdBQ2tGLFVBRGxGLEdBRUwsT0FGSyxHQUdMLDRDQUhLLEdBRzBDLFlBQVksU0FIdEQsR0FHa0UsVUFIbEUsR0FJTCx3REFKSyxHQUtMLFFBTEssR0FNTCw2REFOSyxHQU0yRCxZQUFZLFNBTnZFLEdBTW1GLFNBTm5GLEdBT0wsUUFQRjtBQVFEOzs7MkNBRXNCLEssRUFBTztBQUM1QixhQUFPLFVBQ0wsdURBREssR0FDcUQsS0FBSyxjQUFMLENBQW9CLEtBQXBCLEVBQTJCLFlBQTNCLENBRHJELEdBQ2dHLFVBRGhHLEdBRUwsT0FGSyxHQUdMLDZDQUhLLEdBRzJDLFlBQVksU0FIdkQsR0FHbUUsVUFIbkUsR0FJTCx3REFKSyxHQUtMLFFBTEssR0FNTCw0REFOSyxHQU0wRCxZQUFZLFNBTnRFLEdBTWtGLFNBTmxGLEdBT0wsUUFQRjtBQVFEOzs7MkNBRXNCLEssRUFBTztBQUM1QixhQUFPLFVBQ0wsdURBREssR0FDcUQsS0FBSyxjQUFMLENBQW9CLEtBQXBCLEVBQTJCLFlBQTNCLENBRHJELEdBQ2dHLFVBRGhHLEdBRUwsT0FGSyxHQUdMLDZDQUhLLEdBRzJDLFlBQVksU0FIdkQsR0FHbUUsVUFIbkUsR0FJTCx3REFKSyxHQUtMLFFBTEssR0FNTCw0REFOSyxHQU0wRCxZQUFZLFNBTnRFLEdBTWtGLFNBTmxGLEdBT0wsUUFQRjtBQVFEOzs7dUNBRWtCLEssRUFBTztBQUN4QixhQUFPLFFBQVEsT0FBUiw2Q0FDc0MsS0FBSyxRQUFMLENBQWMsU0FEcEQscUJBQytFLEtBRC9FLG9CQUFQO0FBR0Q7Ozt3Q0FFbUIsSyxFQUFPLEssRUFBTTtBQUMvQixVQUFJLFVBQVUsRUFBZDtBQUNBLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLE1BQUwsQ0FBWSxLQUFaLEVBQW1CLFFBQU0sT0FBekIsRUFBa0MsTUFBdEQsRUFBOEQsR0FBOUQsRUFBa0U7QUFDaEUsWUFBSSxPQUFPLEtBQUssTUFBTCxDQUFZLEtBQVosRUFBbUIsUUFBTSxPQUF6QixFQUFrQyxDQUFsQyxDQUFYO0FBQ0EsbUJBQVcscUJBQXFCLEtBQUssV0FBTCxPQUF1QixLQUFLLE1BQUwsQ0FBWSxLQUFaLEVBQW1CLEtBQW5CLEVBQTBCLFdBQTFCLEVBQXhCLEdBQzNCLG1CQUQyQixHQUUzQixFQUZPLEtBRUMsVUFBVSxrQkFBWCxHQUFpQyxFQUFqQyxHQUFzQyxnQ0FBZ0MsS0FBSyxXQUFMLEVBRnRFLElBRTJGLGlCQUYzRixHQUU2RyxJQUY3RyxHQUVrSCxJQUZsSCxHQUV1SCxLQUFLLGNBQUwsQ0FBb0IsS0FBcEIsRUFBMkIsS0FBSyxXQUFMLEVBQTNCLENBRnZILEdBRXNLLFdBRmpMO0FBR0Q7QUFDRCxVQUFJLFVBQVUsT0FBZCxFQUF1QjtBQUN2QixVQUFJLFFBQVEsS0FBSyxjQUFMLENBQW9CLEtBQXBCLEVBQTJCLFNBQTNCLENBQVo7QUFDQSxhQUFPLHFCQUFtQixLQUFuQixHQUF5Qiw2QkFBekIsR0FDTCwyQ0FESyxHQUN3QyxLQUR4QyxHQUMrQyxJQUQvQyxHQUNvRCxLQURwRCxHQUMwRCxVQUQxRCxHQUVMLHlDQUZLLEdBR0wsMEJBSEssR0FHdUIsbURBSHZCLEdBRzZFLEtBQUssTUFBTCxDQUFZLEtBQVosRUFBbUIsS0FBbkIsRUFBMEIsV0FBMUIsRUFIN0UsR0FHc0gsSUFIdEgsR0FHNEgsS0FBSyxjQUFMLENBQW9CLEtBQXBCLEVBQTJCLEtBQUssTUFBTCxDQUFZLEtBQVosRUFBbUIsS0FBbkIsRUFBMEIsV0FBMUIsRUFBM0IsQ0FINUgsR0FHaU0sU0FIak0sR0FJTCwwQ0FKSyxHQUtMLE9BTEssR0FNTCxRQU5LLEdBT0wsUUFQSyxHQVFMLFFBUkY7QUFTRDs7O2lDQUVZLEssRUFBTztBQUNsQixVQUFJLFdBQVcsS0FBSyxNQUFMLENBQVksS0FBWixFQUFtQixRQUFsQztBQUNBLGFBQVEsQ0FBQyxLQUFLLE1BQUwsQ0FBWSxLQUFaLEVBQW1CLFdBQXJCLEdBQ0gsb0RBQW9ELEtBQXBELEdBQTRELElBQTVELEdBQ0Ysc0RBREUsR0FDdUQsS0FBSyxjQUFMLENBQW9CLEtBQXBCLEVBQTJCLFlBQTNCLENBRHZELEdBQ2tHLFVBRGxHLEdBRUYsZ0NBRkUsR0FFaUMsS0FBSyxjQUFMLEVBRmpDLEdBRXlELFlBRnpELEdBR0YsMkJBSEUsR0FHNEIsS0FBSyxTQUFMLENBQWUsUUFBZixDQUg1QixHQUd1RCx1QkFIdkQsR0FJRixNQUxLLEdBTUgsRUFOSjtBQU9EOzs7NkJBRVEsSyxFQUFPO0FBQUE7O0FBQ2QsVUFBSSxPQUFPLEtBQUssTUFBTCxDQUFZLEtBQVosQ0FBWDtBQUNBLFVBQUksZ0JBQWdCLEtBQUssV0FBTCxDQUFpQixzQkFBakIsQ0FBd0MsZ0JBQXhDLENBQXBCOztBQUZjLG1DQUdMLENBSEs7QUFJWixZQUFJLGVBQWUsY0FBYyxDQUFkLENBQW5CO0FBQ0EscUJBQWEsU0FBYixDQUF1QixHQUF2QixDQUEyQix3QkFBM0I7QUFDQSxZQUFJLE1BQU0sYUFBYSxhQUFiLENBQTJCLEtBQTNCLENBQVY7QUFDQSxZQUFJLFNBQVMsSUFBSSxLQUFKLEVBQWI7QUFDQSxlQUFPLE1BQVAsR0FBZ0IsWUFBTTtBQUNwQixjQUFJLEdBQUosR0FBVSxPQUFPLEdBQWpCO0FBQ0EsdUJBQWEsU0FBYixDQUF1QixNQUF2QixDQUE4Qix3QkFBOUI7QUFDRCxTQUhEO0FBSUEsZUFBTyxHQUFQLEdBQWEsUUFBSyxPQUFMLENBQWEsS0FBSyxRQUFsQixDQUFiO0FBWlk7O0FBR2QsV0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLGNBQWMsTUFBbEMsRUFBMEMsR0FBMUMsRUFBK0M7QUFBQSxlQUF0QyxDQUFzQztBQVU5QztBQUNGOzs7NEJBRU8sRSxFQUFJO0FBQ1YsYUFBTyxrQ0FBa0MsRUFBbEMsR0FBdUMsV0FBOUM7QUFDRDs7OzhCQUVTLEUsRUFBSTtBQUNaLGFBQU8sa0NBQWtDLEVBQXpDO0FBQ0Q7OztxQ0FFZ0I7QUFDZixhQUFPLEtBQUssUUFBTCxDQUFjLE9BQWQsSUFBeUIsS0FBSyxRQUFMLENBQWMsVUFBZCxHQUEyQiwyQkFBM0Q7QUFDRDs7O3VDQUVrQjtBQUNqQixhQUFPLFNBQVMsYUFBVCxDQUF1QixpQ0FBdkIsQ0FBUDtBQUNEOzs7bUNBRWMsSyxFQUFPLEssRUFBTztBQUMzQixVQUFJLE9BQVEsS0FBSyxRQUFMLENBQWMsWUFBZCxDQUEyQixLQUFLLE1BQUwsQ0FBWSxLQUFaLEVBQW1CLFFBQTlDLENBQUQsR0FBNEQsS0FBSyxRQUFMLENBQWMsWUFBZCxDQUEyQixLQUFLLE1BQUwsQ0FBWSxLQUFaLEVBQW1CLFFBQTlDLEVBQXdELEtBQXhELENBQTVELEdBQTZILElBQXhJO0FBQ0EsVUFBSSxDQUFDLElBQUQsSUFBUyxLQUFLLFFBQUwsQ0FBYyxZQUFkLENBQTJCLElBQTNCLENBQWIsRUFBK0M7QUFDN0MsZUFBTyxLQUFLLFFBQUwsQ0FBYyxZQUFkLENBQTJCLElBQTNCLEVBQWlDLEtBQWpDLENBQVA7QUFDRDtBQUNELFVBQUksQ0FBQyxJQUFMLEVBQVc7QUFDVCxlQUFPLEtBQUssMEJBQUwsQ0FBZ0MsS0FBaEMsRUFBdUMsS0FBdkMsQ0FBUDtBQUNELE9BRkQsTUFFTztBQUNMLGVBQU8sSUFBUDtBQUNEO0FBQ0Y7OzsrQ0FFMEIsSyxFQUFPLEssRUFBTztBQUN2QyxVQUFJLENBQUMsS0FBSyxRQUFMLENBQWMsWUFBZCxDQUEyQixJQUEzQixDQUFMLEVBQXVDLEtBQUssZUFBTCxDQUFxQixJQUFyQjtBQUN2QyxhQUFPLEtBQUssTUFBTCxDQUFZLEtBQVosRUFBbUIsbUJBQW5CLENBQXVDLElBQXZDLENBQTRDLEtBQTVDLENBQVA7QUFDRDs7O29DQUVlLEksRUFBTTtBQUFBOztBQUNwQixVQUFJLENBQUMsS0FBSyxRQUFMLENBQWMsWUFBZCxDQUEyQixJQUEzQixDQUFMLEVBQXVDO0FBQ3JDLFlBQUksTUFBTSxJQUFJLGNBQUosRUFBVjtBQUNBLFlBQUksTUFBTSxLQUFLLFFBQUwsQ0FBYyxRQUFkLElBQTBCLEtBQUssUUFBTCxDQUFjLFVBQWQsR0FBMkIsWUFBL0Q7QUFDQSxZQUFJLElBQUosQ0FBUyxLQUFULEVBQWdCLE1BQU0sR0FBTixHQUFZLElBQVosR0FBbUIsT0FBbkM7QUFDQSxZQUFJLE1BQUosR0FBYSxZQUFNO0FBQ2pCLGNBQUksSUFBSSxNQUFKLEtBQWUsR0FBbkIsRUFBd0I7QUFDdEIsb0JBQUssd0JBQUwsQ0FBOEIsSUFBOUIsRUFBb0MsS0FBSyxLQUFMLENBQVcsSUFBSSxZQUFmLENBQXBDO0FBQ0QsV0FGRCxNQUdLO0FBQ0gsb0JBQUssY0FBTCxDQUFvQixDQUFwQixFQUF1QixHQUF2QjtBQUNBLG9CQUFLLGVBQUwsQ0FBcUIsSUFBckI7QUFDQSxtQkFBTyxRQUFLLFFBQUwsQ0FBYyxZQUFkLENBQTJCLElBQTNCLENBQVA7QUFDRDtBQUNGLFNBVEQ7QUFVQSxZQUFJLE9BQUosR0FBYyxZQUFNO0FBQ2xCLGtCQUFLLGNBQUwsQ0FBb0IsQ0FBcEIsRUFBdUIsR0FBdkI7QUFDQSxrQkFBSyxlQUFMLENBQXFCLElBQXJCO0FBQ0EsaUJBQU8sUUFBSyxRQUFMLENBQWMsWUFBZCxDQUEyQixJQUEzQixDQUFQO0FBQ0QsU0FKRDtBQUtBLFlBQUksSUFBSjtBQUNBLGFBQUssUUFBTCxDQUFjLFlBQWQsQ0FBMkIsSUFBM0IsSUFBbUMsRUFBbkM7QUFDRDtBQUNGOzs7Ozs7SUFHRyxVO0FBQ0osc0JBQVksU0FBWixFQUF1QixLQUF2QixFQUE2QjtBQUFBOztBQUFBOztBQUMzQixRQUFJLENBQUMsU0FBTCxFQUFnQjtBQUNoQixTQUFLLEVBQUwsR0FBVSxVQUFVLEVBQXBCO0FBQ0EsU0FBSyw2QkFBTCxHQUFxQyxFQUFyQztBQUNBLFNBQUssS0FBTCxHQUFhLElBQWI7QUFDQSxTQUFLLFFBQUwsR0FBZ0IsTUFBTSxRQUF0QjtBQUNBLFNBQUssU0FBTCxHQUFpQixTQUFqQjtBQUNBLFNBQUssT0FBTCxHQUFlLEtBQUssVUFBTCxFQUFmO0FBQ0EsU0FBSyxZQUFMLEdBQW9CLE1BQU0sS0FBTixJQUFlLElBQW5DO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsU0FBSyxlQUFMLEdBQXVCLElBQXZCO0FBQ0EsU0FBSyxlQUFMLEdBQXVCLEtBQUssa0JBQUwsQ0FBd0IsVUFBVSxFQUFsQyxDQUF2QjtBQUNBLFNBQUssY0FBTCxHQUFzQjtBQUNwQixhQUFPO0FBQ0wsb0JBQVksS0FEUDtBQUVMLG1CQUFXLEVBRk47QUFHTCxlQUFPO0FBQ0wsc0JBQVk7QUFEUCxTQUhGO0FBTUwsZ0JBQVE7QUFDTixrQkFBUSxnQkFBQyxDQUFELEVBQU87QUFDYixnQkFBSSxFQUFFLE1BQUYsQ0FBUyxXQUFiLEVBQTBCO0FBQ3hCLGtCQUFJLFFBQVEsRUFBRSxNQUFGLENBQVMsV0FBVCxDQUFxQixLQUFqQztBQUNBLDBCQUFZLElBQVosQ0FBaUIsTUFBTSxXQUFOLENBQWtCLFFBQW5DLEVBQTZDLHNCQUFjO0FBQ3pELG9CQUFJLElBQUksTUFBTSxVQUFOLEdBQW1CLE1BQU0sT0FBekIsR0FBbUMsTUFBTSxPQUFOLENBQWMsQ0FBZCxDQUFuQyxHQUFzRCxDQUF0RCxJQUE0RCxRQUFLLHNCQUFMLENBQTRCLEtBQTVCLENBQUQsR0FBdUMsRUFBdkMsR0FBNEMsQ0FBdkcsQ0FBUjtBQUNBLDJCQUFXLE1BQVgsQ0FBa0IsRUFBQyxJQUFELEVBQWxCLEVBQXVCLElBQXZCO0FBQ0QsZUFIRDtBQUlEO0FBQ0Y7QUFUSztBQU5ILE9BRGE7QUFtQnBCLGlCQUFXO0FBQ1QsaUJBQVM7QUFEQSxPQW5CUztBQXNCcEIsMEJBQW9CO0FBQ2xCLHdCQUFnQjtBQURFLE9BdEJBO0FBeUJwQixxQkFBZTtBQUNiLGlCQUFTO0FBREksT0F6Qks7QUE0QnBCLG1CQUFhO0FBQ1gsY0FBTTtBQUNKLGtCQUFRO0FBQ04sb0JBQVE7QUFDTixxQkFBTztBQUNMLHlCQUFTO0FBREo7QUFERDtBQURGO0FBREosU0FESztBQVVYLGdCQUFRO0FBQ04sa0JBQVE7QUFDTiw2QkFBaUIseUJBQUMsS0FBRCxFQUFXO0FBQzFCLGtCQUFJLE1BQU0sWUFBTixDQUFtQixTQUF2QixFQUFpQztBQUMvQixvQkFBSSxRQUFLLDZCQUFMLENBQW1DLE9BQW5DLENBQTJDLE1BQU0sTUFBTixDQUFhLEtBQWIsQ0FBbUIsUUFBbkIsQ0FBNEIsRUFBdkUsSUFBNkUsQ0FBQyxDQUFsRixFQUFxRixRQUFLLHNCQUFMLENBQTRCLEtBQTVCO0FBQ3RGO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EscUJBQU8sTUFBTSxZQUFOLENBQW1CLFNBQTFCO0FBQ0Q7QUFUSztBQURGO0FBVkcsT0E1Qk87QUFvRHBCLGFBQU87QUFDTCxpQkFBUztBQURKO0FBcERhLEtBQXRCO0FBd0RBLFNBQUssZUFBTCxHQUF1QixVQUFDLElBQUQsRUFBTyxRQUFQLEVBQW9CO0FBQ3pDLFVBQUksZ0JBQWdCLE1BQU0sZ0JBQU4sQ0FBdUIsV0FBdkIsRUFBcEI7QUFDQSxhQUFPLEtBQUssQ0FBTCxDQUFQO0FBQ0EsVUFBSSxVQUFVO0FBQ1osY0FBTTtBQUNKLGlCQUFRLEtBQUssYUFBTCxDQUFELEdBQXdCLEtBQUssYUFBTCxDQUF4QixHQUE4QyxFQURqRDtBQUVKLGtCQUFRLEtBQUs7QUFGVDtBQURNLE9BQWQ7QUFNQSxhQUFPLFFBQVEsT0FBUixDQUFnQixPQUFoQixDQUFQO0FBQ0QsS0FWRDtBQVdBLFNBQUssY0FBTCxHQUFzQixLQUF0QjtBQUNBLFNBQUssZ0JBQUwsR0FBd0IsRUFBeEI7QUFDQSxTQUFLLFFBQUwsdUJBQW1DLE1BQU0sUUFBekM7QUFDQSxTQUFLLElBQUw7QUFDRDs7OztpQ0FFVztBQUNWLFVBQU0sZUFBZSxJQUFJLFVBQUosRUFBckI7QUFDQSxhQUFPO0FBQ0wsb0JBQVk7QUFDVixpQkFBTyxDQUNMO0FBQ0UsdUJBQVc7QUFDVCx3QkFBVTtBQURELGFBRGI7QUFJRSwwQkFBYztBQUNaLHNCQUFRO0FBQ04sdUJBQU8sT0FERDtBQUVOLCtCQUFlLFFBRlQ7QUFHTixtQkFBRyxFQUhHO0FBSU4sOEJBQWMsQ0FKUjtBQUtOLDhCQUFjLEVBTFI7QUFNTiwyQkFBVztBQUNULDRCQUFVO0FBREQ7QUFOTCxlQURJO0FBV1oscUJBQU87QUFDTCx3QkFBUSxHQURIO0FBRUwsMkJBQVcsRUFGTjtBQUdMLDhCQUFjLENBSFQ7QUFJTCw0QkFBWSxDQUpQO0FBS0wsK0JBQWU7QUFMVixlQVhLO0FBa0JaLHlCQUFXO0FBQ1Qsd0JBQVEsRUFEQztBQUVULHdCQUFRLEVBRkM7QUFHVCx5QkFBUztBQUNQLDBCQUFRLEVBREQ7QUFFUCx5QkFBTztBQUZBO0FBSEE7QUFsQkM7QUFKaEIsV0FESyxFQWlDTDtBQUNFLHVCQUFXO0FBQ1Qsd0JBQVU7QUFERCxhQURiO0FBSUUsMEJBQWM7QUFDWixxQkFBTztBQUNMLDJCQUFXLEVBRE47QUFFTCwwQkFBVSxNQUZMO0FBR0wsNEJBQVksRUFIUDtBQUlMLDZCQUFhLEVBSlI7QUFLTCx3QkFBUTtBQUxILGVBREs7QUFRWixxQkFBTyxDQUNMO0FBQ0UsdUJBQU8sQ0FEVDtBQUVFLDRCQUFZLENBRmQ7QUFHRSwyQkFBVyxDQUhiO0FBSUUsNEJBQVksQ0FKZDtBQUtFLDJCQUFXLENBTGI7QUFNRSx1QkFBTztBQUNMLDJCQUFTO0FBREosaUJBTlQ7QUFTRSx3QkFBUTtBQUNOLHlCQUFPLE1BREQ7QUFFTixxQkFBRyxDQUZHO0FBR04scUJBQUcsQ0FBQyxDQUhFO0FBSU4seUJBQU87QUFDTCwyQkFBTyxTQURGO0FBRUwsOEJBQVU7QUFGTDtBQUpEO0FBVFYsZUFESyxFQW9CTDtBQUNFLHVCQUFPLENBRFQ7QUFFRSw0QkFBWSxDQUZkO0FBR0UsMkJBQVcsQ0FIYjtBQUlFLDRCQUFZLENBSmQ7QUFLRSwyQkFBVyxDQUxiO0FBTUUsdUJBQU87QUFDTCwyQkFBUztBQURKLGlCQU5UO0FBU0Usd0JBQVE7QUFDTix5QkFBTyxPQUREO0FBRU4sNEJBQVUsU0FGSjtBQUdOLHFCQUFHLENBSEc7QUFJTixxQkFBRyxDQUFDLENBSkU7QUFLTix5QkFBTztBQUNMLDJCQUFPLFNBREY7QUFFTCw4QkFBVTtBQUZMO0FBTEQ7QUFUVixlQXBCSztBQVJLO0FBSmhCLFdBakNLLEVBd0ZMO0FBQ0UsdUJBQVc7QUFDVCx3QkFBVTtBQURELGFBRGI7QUFJRSwwQkFBYztBQUNaLHlCQUFXO0FBQ1Qsd0JBQVEsRUFEQztBQUVULHdCQUFRLEVBRkM7QUFHVCx5QkFBUztBQUNQLDBCQUFRO0FBREQ7QUFIQTtBQURDO0FBSmhCLFdBeEZLO0FBREcsU0FEUDtBQTBHTCxlQUFPO0FBQ0wsZ0JBQU07QUFERCxTQTFHRjtBQTZHTCxlQUFPO0FBQ0wsMkJBQWlCLE1BRFo7QUFFTCxxQkFBVyxFQUZOO0FBR0wsMkJBQWlCO0FBSFosU0E3R0Y7QUFrSEwsa0JBQVUsS0FsSEw7QUFtSEwsZ0JBQVEsQ0FDTixTQURNLEVBRU4sU0FGTSxFQUdOLFNBSE0sRUFJTixTQUpNLEVBS04sU0FMTSxDQW5ISDtBQTBITCxnQkFBUTtBQUNOLGtCQUFRLENBREY7QUFFTixtQkFBUyxJQUZIO0FBR04saUJBQU8sT0FIRDtBQUlOLHdCQUFjLENBSlI7QUFLTix3QkFBYyxFQUxSO0FBTU4scUJBQVc7QUFDVCx3QkFBWSxRQURIO0FBRVQsbUJBQU87QUFGRSxXQU5MO0FBVU4seUJBQWU7QUFWVCxTQTFISDtBQXNJTCxtQkFBVyxJQXRJTjtBQXVJTCxpQkFBUztBQUNQLGtCQUFRLElBREQ7QUFFUCxpQkFBTyxLQUZBO0FBR1AscUJBQVcsS0FISjtBQUlQLHVCQUFhLENBSk47QUFLUCxxQkFBVyxHQUxKO0FBTVAsa0JBQVEsS0FORDtBQU9QLDJCQUFpQixTQVBWO0FBUVAsaUJBQU87QUFDTCxtQkFBTyxTQURGO0FBRUwsc0JBQVU7QUFGTCxXQVJBO0FBWVAsbUJBQVMsSUFaRjtBQWFQLHFCQUFXLHFCQUFVO0FBQ25CLG1CQUFPLGFBQWEsZ0JBQWIsQ0FBOEIsSUFBOUIsQ0FBUDtBQUNEO0FBZk0sU0F2SUo7O0FBeUpMLG1CQUFXO0FBQ1QsbUJBQVM7QUFDUCwyQkFBZTtBQUNiLHVCQUFTO0FBREk7QUFEUjtBQURBLFNBekpOOztBQWlLTCxlQUFPO0FBQ0wscUJBQVcsU0FETjtBQUVMLHFCQUFXLFNBRk47QUFHTCxzQkFBWTtBQUhQLFNBaktGOztBQXVLTCxlQUFPLENBQUMsRUFBRTtBQUNSLHFCQUFXLENBREw7QUFFTixxQkFBVyxTQUZMO0FBR04scUJBQVcsQ0FITDtBQUlOLHNCQUFZLENBSk47QUFLTiw2QkFBbUIsTUFMYjtBQU1OLHlCQUFlLENBTlQ7QUFPTixpQkFBTyxDQVBEO0FBUU4sc0JBQVksQ0FSTjtBQVNOLG9CQUFVLEtBVEo7QUFVTixxQkFBVyxLQVZMO0FBV04seUJBQWUsS0FYVDtBQVlOLDBCQUFnQjtBQVpWLFNBQUQsRUFhSjtBQUNELHlCQUFlLFNBRGQ7QUFFRCw2QkFBbUIsTUFGbEI7QUFHRCxxQkFBVyxDQUhWO0FBSUQscUJBQVcsQ0FKVjtBQUtELHNCQUFZLENBTFg7QUFNRCxpQkFBTyxDQU5OO0FBT0Qsc0JBQVksQ0FQWDtBQVFELHFCQUFXLEtBUlY7QUFTRCxvQkFBVSxJQVRUO0FBVUQsc0JBQVksQ0FWWDtBQVdELHlCQUFlLEtBWGQ7QUFZRCwwQkFBZ0I7QUFaZixTQWJJLENBdktGOztBQW1NTCxnQkFBUSxDQUNOLEVBQUU7QUFDQSxpQkFBTyxTQURUO0FBRUUsZ0JBQU0sT0FGUjtBQUdFLGNBQUksT0FITjtBQUlFLGdCQUFNLEVBSlI7QUFLRSxnQkFBTSxNQUxSO0FBTUUsdUJBQWEsSUFOZjtBQU9FLHFCQUFXLENBUGI7QUFRRSxpQkFBTyxDQVJUO0FBU0Usa0JBQVEsQ0FUVjtBQVVFLG1CQUFTLElBVlg7QUFXRSxxQkFBVyxJQVhiO0FBWUUscUJBQVcsSUFaYjtBQWFFLG1CQUFTO0FBQ1AsMkJBQWU7QUFEUixXQWJYO0FBZ0JFLDJCQUFpQixJQWhCbkI7QUFpQkUsd0JBQWM7QUFqQmhCLFNBRE0sRUFvQk47QUFDRSxpQkFBTyxzQ0FEVDtBQUVFLGdCQUFNLFFBRlI7QUFHRSxjQUFJLFFBSE47QUFJRSxnQkFBTSxFQUpSO0FBS0UsZ0JBQU0sTUFMUjtBQU1FLHVCQUFhLEdBTmY7QUFPRSxxQkFBVyxDQVBiO0FBUUUsaUJBQU8sQ0FSVDtBQVNFLGtCQUFRLENBVFY7QUFVRSxtQkFBUyxJQVZYO0FBV0UscUJBQVcsSUFYYjtBQVlFLHFCQUFXLElBWmI7QUFhRSxtQkFBUztBQUNQLDJCQUFlO0FBRFIsV0FiWDtBQWdCRSwyQkFBaUI7QUFoQm5CLFNBcEJNO0FBbk1ILE9BQVA7QUEwT0Q7OzsyQkFFSztBQUFBOztBQUNKLFVBQUksVUFBVSxRQUFRLE9BQVIsRUFBZDtBQUNBLGdCQUFVLFFBQVEsSUFBUixDQUFhLFlBQU07QUFDM0IsZUFBTyxRQUFLLFlBQUwsQ0FBa0IsUUFBSyxPQUF2QixDQUFQO0FBQ0QsT0FGUyxDQUFWO0FBR0EsZ0JBQVUsUUFBUSxJQUFSLENBQWEsVUFBQyxPQUFELEVBQWE7QUFDbEMsZUFBUSxPQUFPLFVBQVIsR0FBc0IsV0FBVyxVQUFYLENBQXNCLFFBQUssU0FBTCxDQUFlLEVBQXJDLEVBQXlDLE9BQXpDLEVBQWtELFVBQUMsS0FBRDtBQUFBLGlCQUFXLFFBQUssSUFBTCxDQUFVLEtBQVYsQ0FBWDtBQUFBLFNBQWxELENBQXRCLEdBQXVHLElBQTlHO0FBQ0QsT0FGUyxDQUFWO0FBR0EsYUFBTyxPQUFQO0FBQ0Q7OztpQ0FFWSxPLEVBQVE7QUFBQTs7QUFDbkIsVUFBSSxVQUFVLFFBQVEsT0FBUixFQUFkO0FBQ0EsZ0JBQVUsUUFBUSxJQUFSLENBQWEsWUFBTTtBQUMzQixlQUFPLFlBQVksWUFBWixDQUF5QixRQUFLLGNBQTlCLEVBQThDLE9BQTlDLENBQVA7QUFDRCxPQUZTLENBQVY7QUFHQSxnQkFBVSxRQUFRLElBQVIsQ0FBYSxVQUFDLFVBQUQsRUFBZ0I7QUFDckMsZUFBTyxZQUFZLFlBQVosQ0FBeUIsUUFBSyxnQkFBTCxFQUF6QixFQUFrRCxVQUFsRCxDQUFQO0FBQ0QsT0FGUyxDQUFWO0FBR0EsZ0JBQVUsUUFBUSxJQUFSLENBQWEsVUFBQyxVQUFELEVBQWdCO0FBQ3JDLGVBQU8sUUFBSyxZQUFMLENBQWtCLFVBQWxCLENBQVA7QUFDRCxPQUZTLENBQVY7QUFHQSxnQkFBVSxRQUFRLElBQVIsQ0FBYSxVQUFDLFVBQUQsRUFBZ0I7QUFDckMsZUFBUSxXQUFXLE1BQVosR0FBc0IsUUFBSyxjQUFMLENBQW9CLFVBQXBCLENBQXRCLEdBQXdELFVBQS9EO0FBQ0QsT0FGUyxDQUFWO0FBR0EsZ0JBQVUsUUFBUSxJQUFSLENBQWEsVUFBQyxVQUFELEVBQWdCO0FBQ3JDLGVBQU8sVUFBUDtBQUNELE9BRlMsQ0FBVjtBQUdBLGFBQU8sT0FBUDtBQUNEOzs7eUJBRUksSyxFQUFNO0FBQUE7O0FBQ1QsVUFBSSxVQUFVLFFBQVEsT0FBUixFQUFkO0FBQ0EsZ0JBQVUsUUFBUSxJQUFSLENBQWEsWUFBTTtBQUMzQixlQUFPLFFBQUssS0FBTCxHQUFhLEtBQXBCO0FBQ0QsT0FGUyxDQUFWO0FBR0EsZ0JBQVUsUUFBUSxJQUFSLENBQWEsWUFBTTtBQUMzQixlQUFPLFFBQUssZ0JBQUwsRUFBUDtBQUNELE9BRlMsQ0FBVjtBQUdBLGdCQUFVLFFBQVEsSUFBUixDQUFhLFlBQU07QUFDM0IsZUFBTyxRQUFLLGdCQUFMLEVBQVA7QUFDRCxPQUZTLENBQVY7QUFHQSxnQkFBVSxRQUFRLElBQVIsQ0FBYSxZQUFNO0FBQzNCLGVBQVEsUUFBSyxRQUFOLEdBQWtCLFFBQUssUUFBTCxDQUFjLFFBQUssS0FBbkIsRUFBMEIsUUFBSyxZQUEvQixDQUFsQixHQUFpRSxJQUF4RTtBQUNELE9BRlMsQ0FBVjtBQUdBLGFBQU8sT0FBUDtBQUNEOzs7cUNBRWdCLE8sRUFBUyxPLEVBQVE7QUFBQTs7QUFDaEMsVUFBSSxpQkFBa0IsV0FBVyxPQUFqQztBQUNBLFVBQUksVUFBVSxRQUFRLE9BQVIsRUFBZDtBQUNBLGdCQUFVLFFBQVEsSUFBUixDQUFhLFlBQU07QUFDM0IsWUFBSSxRQUFLLE9BQUwsQ0FBYSxRQUFqQixFQUEwQjtBQUN4QixjQUFJLE1BQU8sY0FBRCxHQUFtQixRQUFLLHVCQUFMLENBQTZCLE9BQTdCLEVBQXNDLE9BQXRDLEVBQStDLFFBQS9DLENBQW5CLEdBQThFLFFBQUssa0JBQUwsQ0FBd0IsUUFBSyxFQUE3QixFQUFpQyxRQUFqQyxJQUE2QyxHQUE3QyxHQUFtRCxRQUFLLFFBQUwsRUFBbkQsR0FBcUUsR0FBN0o7QUFDQSxpQkFBUSxHQUFELEdBQVEsUUFBSyxTQUFMLENBQWUsR0FBZixFQUFvQixRQUFwQixFQUE4QixDQUFDLGNBQS9CLENBQVIsR0FBeUQsSUFBaEU7QUFDRDtBQUNELGVBQU8sSUFBUDtBQUNELE9BTlMsQ0FBVjtBQU9BLGdCQUFVLFFBQVEsSUFBUixDQUFhLFlBQU07QUFDM0IsWUFBSSxNQUFPLGNBQUQsR0FBbUIsUUFBSyx1QkFBTCxDQUE2QixPQUE3QixFQUFzQyxPQUF0QyxDQUFuQixHQUFvRSxRQUFLLFFBQUwsQ0FBYyxPQUFkLENBQXNCLFNBQXRCLEVBQWlDLFFBQUssUUFBTCxFQUFqQyxDQUE5RTtBQUNBLGVBQVEsR0FBRCxHQUFRLFFBQUssU0FBTCxDQUFlLEdBQWYsRUFBb0IsTUFBcEIsRUFBNEIsQ0FBQyxjQUE3QixDQUFSLEdBQXVELElBQTlEO0FBQ0QsT0FIUyxDQUFWO0FBSUEsZ0JBQVUsUUFBUSxJQUFSLENBQWEsWUFBTTtBQUMzQixlQUFPLFFBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsS0FBbEIsQ0FBUDtBQUNELE9BRlMsQ0FBVjtBQUdBLGdCQUFVLFFBQVEsSUFBUixDQUFhLFlBQU07QUFDM0IsZUFBUSxDQUFDLGNBQUYsR0FBb0IsUUFBSyxLQUFMLENBQVcsT0FBWCxFQUFwQixHQUEyQyxJQUFsRDtBQUNELE9BRlMsQ0FBVjtBQUdBLGdCQUFVLFFBQVEsSUFBUixDQUFhLFlBQU07QUFDM0IsZUFBTyxRQUFLLFFBQUwsR0FBZ0IsSUFBdkI7QUFDRCxPQUZTLENBQVY7QUFHQSxnQkFBVSxRQUFRLElBQVIsQ0FBYSxZQUFNO0FBQzNCLGVBQU8sUUFBSyxZQUFMLEVBQVA7QUFDRCxPQUZTLENBQVY7QUFHQSxhQUFPLE9BQVA7QUFDRDs7OzhCQUVTLEcsRUFBdUM7QUFBQTs7QUFBQSxVQUFsQyxRQUFrQyx1RUFBdkIsTUFBdUI7QUFBQSxVQUFmLE9BQWUsdUVBQUwsSUFBSzs7QUFDL0MsVUFBSSxVQUFVLFFBQVEsT0FBUixFQUFkO0FBQ0EsZ0JBQVUsUUFBUSxJQUFSLENBQWEsWUFBTTtBQUMzQixnQkFBSyxLQUFMLENBQVcsV0FBWDtBQUNBLGVBQU8sYUFBYSxjQUFiLENBQTRCLEdBQTVCLEVBQWlDLENBQUMsUUFBSyxRQUF2QyxDQUFQO0FBQ0QsT0FIUyxDQUFWO0FBSUEsZ0JBQVUsUUFBUSxJQUFSLENBQWEsVUFBQyxRQUFELEVBQWM7QUFDbkMsZ0JBQUssS0FBTCxDQUFXLFdBQVg7QUFDQSxZQUFJLFNBQVMsTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUMzQixpQkFBTyxRQUFRLEdBQVIsbURBQTRELFNBQVMsTUFBckUsQ0FBUDtBQUNEO0FBQ0QsZUFBTyxTQUFTLElBQVQsR0FBZ0IsSUFBaEIsQ0FBcUIsZ0JBQVE7QUFDbEMsY0FBSSxVQUFVLFFBQVEsT0FBUixFQUFkO0FBQ0Esb0JBQVUsUUFBUSxJQUFSLENBQWEsWUFBTTtBQUMzQixtQkFBTyxRQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsRUFBc0IsUUFBdEIsQ0FBUDtBQUNELFdBRlMsQ0FBVjtBQUdBLG9CQUFVLFFBQVEsSUFBUixDQUFhLFVBQUMsT0FBRCxFQUFhO0FBQ2xDLG1CQUFRLE9BQUQsR0FBWSxRQUFLLFdBQUwsQ0FBaUIsUUFBUSxJQUF6QixFQUErQixRQUEvQixDQUFaLEdBQXVELFFBQUssVUFBTCxDQUFnQixRQUFRLElBQXhCLEVBQThCLFFBQTlCLENBQTlEO0FBQ0QsV0FGUyxDQUFWO0FBR0EsaUJBQU8sT0FBUDtBQUNELFNBVE0sQ0FBUDtBQVVELE9BZlMsRUFlUCxLQWZPLENBZUQsVUFBQyxLQUFELEVBQVc7QUFDbEIsZ0JBQUssS0FBTCxDQUFXLFdBQVg7QUFDQSxlQUFPLFFBQVEsR0FBUixDQUFZLGFBQVosRUFBMkIsS0FBM0IsQ0FBUDtBQUNELE9BbEJTLENBQVY7QUFtQkEsYUFBTyxPQUFQO0FBQ0Q7Ozt1Q0FFaUI7QUFBQTs7QUFDaEIsZUFBUyxnQkFBVCxDQUE4QixLQUFLLEVBQW5DLG9CQUF1RCxVQUFDLEtBQUQsRUFBVztBQUNoRSxnQkFBSyxZQUFMLEdBQW9CLE1BQU0sTUFBTixDQUFhLElBQWpDO0FBQ0EsZUFBTyxRQUFLLGdCQUFMLEVBQVA7QUFDRCxPQUhEO0FBSUQ7OzsrQkFFUztBQUNSLGFBQU8sS0FBSyxZQUFMLElBQXFCLElBQTVCO0FBQ0Q7OzttQ0FFYTtBQUFBOztBQUNaLFVBQUksVUFBVSxRQUFRLE9BQVIsRUFBZDtBQUNBLFVBQUksS0FBSyxPQUFMLENBQWEsUUFBakIsRUFBMEI7QUFDeEIsa0JBQVUsUUFBUSxJQUFSLENBQWEsWUFBTTtBQUMzQixpQkFBTyxTQUFTLHNCQUFULENBQWdDLHVCQUFoQyxDQUFQO0FBQ0QsU0FGUyxDQUFWO0FBR0Esa0JBQVUsUUFBUSxJQUFSLENBQWEsVUFBQyxRQUFELEVBQWM7QUFDbkMsaUJBQU8sWUFBWSxJQUFaLENBQWlCLFFBQWpCLEVBQTJCLG1CQUFXO0FBQzNDLGdCQUFJLFFBQUssY0FBVCxFQUF3QjtBQUN0QixxQkFBUSxDQUFDLFFBQVEsU0FBUixDQUFrQixRQUFsQixDQUEyQiwrQkFBM0IsQ0FBRixHQUFpRSxRQUFRLFNBQVIsQ0FBa0IsR0FBbEIsQ0FBc0IsK0JBQXRCLENBQWpFLEdBQTBILElBQWpJO0FBQ0Q7QUFDRCxtQkFBUSxRQUFRLFNBQVIsQ0FBa0IsUUFBbEIsQ0FBMkIsK0JBQTNCLENBQUQsR0FBZ0UsUUFBUSxTQUFSLENBQWtCLE1BQWxCLENBQXlCLCtCQUF6QixDQUFoRSxHQUE0SCxJQUFuSTtBQUNELFdBTE0sQ0FBUDtBQU1ELFNBUFMsQ0FBVjtBQVFBLGtCQUFVLFFBQVEsSUFBUixDQUFhLFlBQU07QUFDM0IsaUJBQU8sU0FBUyxzQkFBVCxDQUFnQyxzQkFBaEMsQ0FBUDtBQUNELFNBRlMsQ0FBVjtBQUdBLGtCQUFVLFFBQVEsSUFBUixDQUFhLFVBQUMsUUFBRCxFQUFjO0FBQ25DLGlCQUFPLFlBQVksSUFBWixDQUFpQixRQUFqQixFQUEyQixtQkFBVztBQUMzQyxnQkFBSSxRQUFLLGNBQVQsRUFBd0I7QUFDdEIscUJBQVEsQ0FBQyxRQUFRLFNBQVIsQ0FBa0IsUUFBbEIsQ0FBMkIsOEJBQTNCLENBQUYsR0FBZ0UsUUFBUSxTQUFSLENBQWtCLEdBQWxCLENBQXNCLDhCQUF0QixDQUFoRSxHQUF3SCxJQUEvSDtBQUNEO0FBQ0QsbUJBQVEsUUFBUSxTQUFSLENBQWtCLFFBQWxCLENBQTJCLDhCQUEzQixDQUFELEdBQStELFFBQVEsU0FBUixDQUFrQixNQUFsQixDQUF5Qiw4QkFBekIsQ0FBL0QsR0FBMEgsSUFBakk7QUFDRCxXQUxNLENBQVA7QUFNRCxTQVBTLENBQVY7QUFRRDtBQUNELGFBQU8sT0FBUDtBQUNEOzs7K0JBRVUsSSxFQUF3QjtBQUFBOztBQUFBLFVBQWxCLFFBQWtCLHVFQUFQLE1BQU87O0FBQ2pDLGNBQVEsUUFBUjtBQUNFLGFBQUssTUFBTDtBQUNFLGNBQUksY0FBYyxRQUFRLE9BQVIsRUFBbEI7QUFDQSx3QkFBYyxZQUFZLElBQVosQ0FBaUIsWUFBTTtBQUNuQyxtQkFBUSxRQUFLLGVBQU4sR0FBeUIsUUFBSyxlQUFMLENBQXFCLElBQXJCLENBQXpCLEdBQXNEO0FBQzNELG9CQUFNLEtBQUssQ0FBTDtBQURxRCxhQUE3RDtBQUdELFdBSmEsQ0FBZDtBQUtBLGlCQUFPLFdBQVA7QUFDRixhQUFLLFFBQUw7QUFDRSxpQkFBTyxRQUFRLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNGO0FBQ0UsaUJBQU8sSUFBUDtBQVpKO0FBY0Q7OzsrQkFFVSxJLEVBQU0sUSxFQUFVO0FBQUE7O0FBQ3pCLFVBQUksZ0JBQUo7QUFDQSxVQUFJLFVBQVUsUUFBUSxPQUFSLEVBQWQ7QUFDQSxnQkFBVSxRQUFRLElBQVIsQ0FBYSxZQUFNO0FBQzNCLGdCQUFRLFFBQVI7QUFDRSxlQUFLLE1BQUw7QUFDRSxzQkFBVSxFQUFWO0FBQ0EsbUJBQU8sWUFBWSxJQUFaLENBQWlCLE9BQU8sT0FBUCxDQUFlLElBQWYsQ0FBakIsRUFBdUMsVUFBQyxLQUFELEVBQVc7QUFDdkQsa0JBQUksUUFBSyxVQUFMLENBQWdCLE1BQU0sQ0FBTixDQUFoQixDQUFKLEVBQStCO0FBQy9CLGtCQUFJLFVBQVUsUUFBSyxVQUFMLENBQWdCLFFBQWhCLEVBQTBCLE1BQU0sQ0FBTixDQUExQixDQUFkO0FBQ0Esc0JBQVEsTUFBTSxDQUFOLENBQVIsSUFBb0IsUUFDakIsTUFEaUIsQ0FDVixVQUFDLE9BQUQsRUFBYTtBQUNuQix1QkFBTyxNQUFNLENBQU4sRUFBUyxTQUFULENBQW1CO0FBQUEseUJBQWUsUUFBSyxnQkFBTCxDQUFzQixPQUF0QixFQUErQixXQUEvQixFQUE0QyxRQUE1QyxDQUFmO0FBQUEsaUJBQW5CLE1BQTZGLENBQUMsQ0FBckc7QUFDRCxlQUhpQixFQUlqQixNQUppQixDQUlWLE1BQU0sQ0FBTixDQUpVLEVBS2pCLElBTGlCLENBS1osVUFBQyxLQUFELEVBQVEsS0FBUjtBQUFBLHVCQUFrQixRQUFLLGFBQUwsQ0FBbUIsS0FBbkIsRUFBMEIsS0FBMUIsRUFBaUMsUUFBakMsQ0FBbEI7QUFBQSxlQUxZLENBQXBCO0FBTUQsYUFUTSxDQUFQO0FBVUYsZUFBSyxRQUFMO0FBQ0Usc0JBQVUsRUFBVjtBQUNBLGdCQUFJLFVBQVUsUUFBSyxVQUFMLENBQWdCLFFBQWhCLENBQWQ7QUFDQSxtQkFBTyxVQUFVLFFBQ2QsTUFEYyxDQUNQLFVBQUMsT0FBRCxFQUFhO0FBQ25CLG1CQUFLLFNBQUwsQ0FBZTtBQUFBLHVCQUFlLFFBQUssZ0JBQUwsQ0FBc0IsT0FBdEIsRUFBK0IsV0FBL0IsRUFBNEMsUUFBNUMsQ0FBZjtBQUFBLGVBQWYsTUFBeUYsQ0FBQyxDQUExRjtBQUNELGFBSGMsRUFJZCxNQUpjLENBSVAsSUFKTyxFQUtkLElBTGMsQ0FLVCxVQUFDLEtBQUQsRUFBUSxLQUFSO0FBQUEscUJBQWtCLFFBQUssYUFBTCxDQUFtQixLQUFuQixFQUEwQixLQUExQixFQUFpQyxRQUFqQyxDQUFsQjtBQUFBLGFBTFMsQ0FBakI7QUFNRjtBQUNFLG1CQUFPLEtBQVA7QUF2Qko7QUF5QkQsT0ExQlMsQ0FBVjtBQTJCQSxnQkFBVSxRQUFRLElBQVIsQ0FBYSxZQUFNO0FBQzNCLGVBQU8sUUFBSyxXQUFMLENBQWlCLE9BQWpCLEVBQTBCLFFBQTFCLENBQVA7QUFDRCxPQUZTLENBQVY7QUFHQSxhQUFPLE9BQVA7QUFDRDs7O3FDQUVnQixRLEVBQVUsUSxFQUFVLFEsRUFBUztBQUM1QyxjQUFRLFFBQVI7QUFDRSxhQUFLLE1BQUw7QUFDRSxpQkFBTyxTQUFTLENBQVQsTUFBZ0IsU0FBUyxDQUFULENBQXZCO0FBQ0YsYUFBSyxRQUFMO0FBQ0UsaUJBQU8sU0FBUyxFQUFULEtBQWdCLFNBQVMsRUFBaEM7QUFDRjtBQUNFLGlCQUFPLEtBQVA7QUFOSjtBQVFEOzs7a0NBRWEsUSxFQUFVLFEsRUFBVSxRLEVBQVM7QUFDekMsY0FBUSxRQUFSO0FBQ0UsYUFBSyxNQUFMO0FBQ0UsaUJBQU8sU0FBUyxDQUFULElBQWMsU0FBUyxDQUFULENBQXJCO0FBQ0YsYUFBSyxRQUFMO0FBQ0UsaUJBQU8sU0FBUyxFQUFULEdBQWMsU0FBUyxFQUE5QjtBQUNGO0FBQ0UsaUJBQU8sS0FBUDtBQU5KO0FBUUQ7OzsrQkFFVSxRLEVBQVM7QUFDbEIsYUFBTyxLQUFLLFdBQVMsU0FBUyxXQUFULEVBQWQsQ0FBUDtBQUNEOzs7Z0NBRVcsSSxFQUFNLFEsRUFBUztBQUFBOztBQUN6QixVQUFJLFVBQVUsUUFBUSxPQUFSLEVBQWQ7QUFDQSxnQkFBVSxRQUFRLElBQVIsQ0FBYSxZQUFNO0FBQzNCLGVBQU8sUUFBSyxXQUFTLFNBQVMsV0FBVCxFQUFkLElBQXdDLElBQS9DO0FBQ0QsT0FGUyxDQUFWO0FBR0EsZ0JBQVUsUUFBUSxJQUFSLENBQWEsWUFBTTtBQUMzQixlQUFPLFFBQUssZUFBTCxDQUFxQixJQUFyQixFQUEyQixRQUEzQixDQUFQO0FBQ0QsT0FGUyxDQUFWO0FBR0EsZ0JBQVUsUUFBUSxJQUFSLENBQWEsWUFBTTtBQUMzQixlQUFRLFFBQUssZUFBTixHQUF5QixRQUFLLGVBQUwsQ0FBcUIsUUFBSyxLQUExQixFQUFpQyxJQUFqQyxFQUF1QyxRQUFLLFFBQTVDLEVBQXNELFFBQXRELENBQXpCLEdBQTJGLElBQWxHO0FBQ0QsT0FGUyxDQUFWO0FBR0EsYUFBTyxPQUFQO0FBQ0Q7OztvQ0FFZSxJLEVBQU0sUSxFQUFTO0FBQUE7O0FBQzdCLGNBQVEsUUFBUjtBQUNFLGFBQUssTUFBTDtBQUNFLGNBQUksS0FBSyxRQUFULEVBQWtCO0FBQ2hCLHdCQUFZLElBQVosQ0FBaUIsQ0FBQyxhQUFELEVBQWdCLGNBQWhCLENBQWpCLEVBQWtELG9CQUFZO0FBQzVELGtCQUFJLFlBQVksU0FBUyxLQUFULENBQWUsR0FBZixFQUFvQixDQUFwQixDQUFoQjtBQUNBLGtCQUFJLFFBQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsUUFBckIsSUFBaUMsQ0FBQyxDQUFsQyxJQUF1QyxLQUFLLFNBQUwsQ0FBM0MsRUFBNEQ7QUFDMUQscUJBQUssU0FBTCxJQUFrQixFQUFsQjtBQUNBLDRCQUFZLElBQVosQ0FBaUIsUUFBSyxLQUFMLENBQVcsTUFBNUIsRUFBb0Msa0JBQVU7QUFDNUMsc0JBQUksT0FBTyxXQUFQLENBQW1CLEVBQW5CLEtBQTBCLFNBQTlCLEVBQXlDLE9BQU8sTUFBUCxDQUFjLEVBQUUsU0FBUyxLQUFYLEVBQWQ7QUFDMUMsaUJBRkQ7QUFHRDtBQUNGLGFBUkQ7QUFTRDtBQUNELGlCQUFPLFlBQVksSUFBWixDQUFpQixPQUFPLE9BQVAsQ0FBZSxJQUFmLENBQWpCLEVBQXVDLFVBQUMsS0FBRCxFQUFXO0FBQ3ZELGdCQUFJLFFBQUssVUFBTCxDQUFnQixNQUFNLENBQU4sQ0FBaEIsQ0FBSixFQUErQjtBQUMvQixtQkFBUSxRQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsTUFBTSxDQUFOLENBQWYsQ0FBRCxHQUE2QixRQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsTUFBTSxDQUFOLENBQWYsRUFBeUIsT0FBekIsQ0FBaUMsTUFBTSxDQUFOLENBQWpDLEVBQTJDLEtBQTNDLEVBQWtELEtBQWxELEVBQXlELEtBQXpELENBQTdCLEdBQStGLFFBQUssS0FBTCxDQUFXLFNBQVgsQ0FBcUIsRUFBQyxJQUFJLE1BQU0sQ0FBTixDQUFMLEVBQWUsTUFBTSxNQUFNLENBQU4sQ0FBckIsRUFBK0IsaUJBQWlCLElBQWhELEVBQXJCLENBQXRHO0FBQ0QsV0FITSxDQUFQO0FBSUYsYUFBSyxRQUFMO0FBQ0UsY0FBSSxVQUFVLFFBQVEsT0FBUixFQUFkO0FBQ0Esb0JBQVUsUUFBUSxJQUFSLENBQWEsWUFBTTtBQUMzQixtQkFBTyxZQUFZLElBQVosQ0FBaUIsUUFBSyxLQUFMLENBQVcsV0FBWCxDQUF1QixRQUF4QyxFQUFrRCxzQkFBYztBQUNyRSxxQkFBTyxXQUFXLE9BQVgsRUFBUDtBQUNELGFBRk0sQ0FBUDtBQUdELFdBSlMsQ0FBVjtBQUtBLG9CQUFVLFFBQVEsSUFBUixDQUFhLFlBQU07QUFDM0IsbUJBQU8sUUFBSyxxQkFBTCxDQUEyQixJQUEzQixDQUFQO0FBQ0QsV0FGUyxDQUFWO0FBR0EsaUJBQU8sT0FBUDtBQUNGO0FBQ0UsaUJBQU8sSUFBUDtBQTdCSjtBQStCRDs7OytCQUVVLEssRUFBTTtBQUNmLGFBQU8sS0FBSyxnQkFBTCxDQUFzQixPQUF0QixDQUE4QixLQUE5QixJQUF1QyxDQUFDLENBQS9DO0FBQ0Q7OztxQ0FFZ0IsTyxFQUE0QjtBQUFBLFVBQW5CLEtBQW1CLHVFQUFYLEVBQVc7QUFBQSxVQUFQLE1BQU87O0FBQzNDLFVBQUksQ0FBQyxNQUFMLEVBQWEsU0FBUyxLQUFUO0FBQ2IsVUFBTSxTQUFTLG1EQUFpRCxJQUFJLElBQUosQ0FBUyxRQUFRLENBQWpCLEVBQW9CLFdBQXBCLEVBQWpELEdBQW1GLGlCQUFsRztBQUNBLFVBQU0sU0FBUyxnQkFBZjtBQUNBLFVBQUksVUFBVSxFQUFkO0FBQ0EsY0FBUSxNQUFSLENBQWUsT0FBZixDQUF1QixpQkFBUztBQUM5QixtQkFBVyxTQUNULE1BRFMsR0FFVCx5RUFGUyxHQUVpRSxNQUFNLE1BQU4sQ0FBYSxLQUY5RSxHQUVvRixrQ0FGcEYsR0FHVCxNQUFNLE1BQU4sQ0FBYSxJQUhKLEdBR1csSUFIWCxHQUdrQixNQUFNLENBQU4sQ0FBUSxjQUFSLENBQXVCLE9BQXZCLEVBQWdDLEVBQUUsdUJBQXVCLENBQXpCLEVBQWhDLENBSGxCLEdBR2tGLEdBSGxGLElBRzBGLE1BQU0sTUFBTixDQUFhLElBQWIsQ0FBa0IsV0FBbEIsR0FBZ0MsTUFBaEMsQ0FBdUMsT0FBTyxXQUFQLEVBQXZDLElBQStELENBQUMsQ0FBakUsR0FBc0UsRUFBdEUsR0FBMkUsS0FIcEssSUFJVCxPQUpTLEdBS1QsT0FMRjtBQU1ELE9BUEQ7QUFRQSxhQUFPLFNBQVMsT0FBVCxHQUFtQixNQUExQjtBQUNEOzs7MENBRXFCLEksRUFBSztBQUFBOztBQUN6QixXQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLENBQWxCLEVBQXFCLEtBQXJCLENBQTJCLGNBQTNCO0FBQ0EsVUFBSSxZQUFZLEVBQWhCO0FBQ0EsVUFBSSxVQUFVLFFBQVEsT0FBUixFQUFkO0FBQ0EsZ0JBQVUsUUFBUSxJQUFSLENBQWEsWUFBTTtBQUMzQixlQUFPLEtBQUssSUFBTCxDQUFVLFVBQUMsS0FBRCxFQUFRLEtBQVIsRUFBa0I7QUFDakMsaUJBQU8sTUFBTSxFQUFOLEdBQVcsTUFBTSxFQUF4QjtBQUNELFNBRk0sQ0FBUDtBQUdELE9BSlMsQ0FBVjtBQUtBLGdCQUFVLFFBQVEsSUFBUixDQUFhLFlBQU07QUFDM0IsZUFBTyxZQUFZLElBQVosQ0FBaUIsSUFBakIsRUFBdUIsbUJBQVc7QUFDdkMsY0FBSSxVQUFVLFFBQVEsT0FBUixFQUFkO0FBQ0Esb0JBQVUsUUFBUSxJQUFSLENBQWEsWUFBTTtBQUMzQixtQkFBTyxVQUFVLElBQVYsQ0FBZTtBQUNwQixxQkFBTyxDQURhO0FBRXBCLHFCQUFPLFFBQVEsRUFGSztBQUdwQix5QkFBVyxPQUhTO0FBSXBCLHNCQUFRLENBSlk7QUFLcEIscUJBQU8sUUFBSyxpQkFBTCxHQUF5QjtBQUxaLGFBQWYsQ0FBUDtBQU9ELFdBUlMsQ0FBVjtBQVNBLG9CQUFVLFFBQVEsSUFBUixDQUFhLFlBQU07QUFDM0IsbUJBQU8sUUFBSyxLQUFMLENBQVcsYUFBWCxDQUF5QjtBQUM5QixzQkFBUSxRQUFRLEVBRGM7QUFFOUIsaUJBQUcsQ0FGMkI7QUFHOUIsd0ZBQXlFLFFBQUssaUJBQUwsQ0FBdUIsUUFBUSxHQUEvQixFQUFvQyxLQUE3RyxxRkFBb00sS0FBSyxTQUFMLENBQWUsT0FBZixDQUFwTSxZQUg4QjtBQUk5QixxQkFBTztBQUNMLHNCQUFNLFFBREQ7QUFFTCx3QkFBUTtBQUNOLHFCQUFHLEVBREc7QUFFTixzQkFBSSxDQUZFO0FBR04sc0JBQUksSUFIRTtBQUlOLGtDQUFnQixHQUpWO0FBS04sd0JBQU0sUUFBSyxpQkFBTCxHQUF5QjtBQUx6QjtBQUZILGVBSnVCO0FBYzlCLHNCQUFRO0FBQ04sMkJBQVcsbUJBQUMsS0FBRCxFQUFXO0FBQ3BCLHNCQUFJLGFBQWEsUUFBYixFQUFKLEVBQTZCO0FBQzdCLHNCQUFJLE9BQU8sUUFBSywrQkFBTCxDQUFxQyxLQUFyQyxDQUFYO0FBQ0EsMEJBQUssa0JBQUwsQ0FBd0IsSUFBeEIsRUFBOEIsS0FBOUI7QUFDRCxpQkFMSztBQU1OLDBCQUFVLG9CQUFNO0FBQ2Qsc0JBQUksYUFBYSxRQUFiLEVBQUosRUFBNkI7QUFDN0IsMEJBQUssbUJBQUwsQ0FBeUIsS0FBekI7QUFDRCxpQkFUSztBQVVOLHVCQUFPLGVBQUMsS0FBRCxFQUFXO0FBQ2hCLHNCQUFJLE9BQU8sUUFBSywrQkFBTCxDQUFxQyxLQUFyQyxDQUFYO0FBQ0Esc0JBQUksYUFBYSxRQUFiLEVBQUosRUFBNkI7QUFDM0IsNEJBQUssa0JBQUwsQ0FBd0IsSUFBeEIsRUFBOEIsS0FBOUI7QUFDRCxtQkFGRCxNQUVPO0FBQ0wsNEJBQUssYUFBTCxDQUFtQixJQUFuQjtBQUNEO0FBQ0Y7QUFqQks7QUFkc0IsYUFBekIsQ0FBUDtBQWtDRCxXQW5DUyxDQUFWO0FBb0NBLGlCQUFPLE9BQVA7QUFDRCxTQWhETSxDQUFQO0FBaURELE9BbERTLENBQVY7QUFtREEsZ0JBQVUsUUFBUSxJQUFSLENBQWEsWUFBTTtBQUMzQixlQUFPLFFBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsQ0FBbEIsRUFBcUIsS0FBckIsQ0FBMkIsTUFBM0IsQ0FBa0M7QUFDdkM7QUFEdUMsU0FBbEMsRUFFSixLQUZJLENBQVA7QUFHRCxPQUpTLENBQVY7QUFLQSxhQUFPLE9BQVA7QUFDRDs7O2lDQUVZLE8sRUFBUTtBQUFBOztBQUNuQixVQUFJLG1CQUFtQixFQUF2QjtBQUNBLFVBQUksVUFBVSxRQUFRLE9BQVIsRUFBZDtBQUNBLGdCQUFVLFFBQVEsSUFBUixDQUFhLFlBQU07QUFDM0IsWUFBSSxRQUFRLFNBQVIsS0FBc0IsSUFBMUIsRUFBK0I7QUFDN0IsNkJBQW1CO0FBQ2pCLHVCQUFXO0FBQ1Qsc0JBQVEsSUFEQztBQUVULHNCQUFRLEVBRkM7QUFHVCxzQkFBUTtBQUNOLDJCQUFXO0FBREwsZUFIQztBQU1ULHdCQUFVO0FBTkQsYUFETTtBQVNqQixtQkFBTztBQUNMLHdCQUFVO0FBREwsYUFUVTtBQVlqQixtQkFBTztBQUNMLHNCQUFRO0FBQ04sNkJBQWEscUJBQUMsQ0FBRCxFQUFPO0FBQ2xCLHNCQUFJLENBQUMsRUFBRSxPQUFGLEtBQWMsV0FBZCxJQUE2QixFQUFFLE9BQUYsS0FBYyxNQUE1QyxLQUF1RCxFQUFFLEdBQXpELElBQWdFLEVBQUUsR0FBdEUsRUFBMkU7QUFDekUsNkJBQVMsYUFBVCxDQUF1QixJQUFJLFdBQUosQ0FBZ0IsUUFBSyxFQUFMLEdBQVEsYUFBeEIsRUFBdUM7QUFDNUQsOEJBQVE7QUFDTixpQ0FBUyxFQUFFLEdBREw7QUFFTixpQ0FBUyxFQUFFLEdBRkw7QUFHTjtBQUhNO0FBRG9ELHFCQUF2QyxDQUF2QjtBQU9EO0FBQ0Y7QUFYSztBQURIO0FBWlUsV0FBbkI7QUE0QkEsa0JBQUsseUJBQUw7QUFDQSxrQkFBSyxrQkFBTDtBQUNELFNBL0JELE1BK0JPLElBQUksQ0FBQyxRQUFRLFNBQWIsRUFBd0I7QUFDN0IsNkJBQW1CO0FBQ2pCLHVCQUFXO0FBQ1QsdUJBQVM7QUFEQTtBQURNLFdBQW5CO0FBS0Q7QUFDRCxlQUFPLFlBQVksWUFBWixDQUF5QixPQUF6QixFQUFrQyxnQkFBbEMsQ0FBUDtBQUNELE9BeENTLENBQVY7QUF5Q0EsYUFBTyxPQUFQO0FBQ0Q7Ozt5Q0FFbUI7QUFBQTs7QUFDbEI7QUFDQSxVQUFJLFVBQVUsUUFBUSxPQUFSLEVBQWQ7QUFDQSxnQkFBVSxRQUFRLElBQVIsQ0FBYSxZQUFNO0FBQzNCLGVBQU8sUUFBSyxZQUFMLENBQWtCLFFBQUssRUFBdkIsRUFBMkIsV0FBM0IsRUFBd0MscUJBQXhDLEVBQStELFFBQS9ELENBQVA7QUFDRCxPQUZTLENBQVY7QUFHQSxnQkFBVSxRQUFRLElBQVIsQ0FBYSxZQUFNO0FBQzNCLGVBQU8sUUFBSyxZQUFMLENBQWtCLFdBQWxCLENBQVA7QUFDRCxPQUZTLENBQVY7QUFHQSxnQkFBVSxRQUFRLElBQVIsQ0FBYSxVQUFDLE9BQUQsRUFBYTtBQUNsQyxnQkFBUSxTQUFSLENBQWtCLEdBQWxCLENBQXNCLFdBQXRCO0FBQ0EsZ0JBQVEsU0FBUixHQUFvQixZQUFwQjtBQUNBLGVBQU8sUUFBUSxnQkFBUixDQUF5QixPQUF6QixFQUFrQyxZQUFNO0FBQzdDLGtCQUFLLEtBQUwsQ0FBVyxPQUFYO0FBQ0QsU0FGTSxDQUFQO0FBR0QsT0FOUyxDQUFWO0FBT0EsYUFBTyxPQUFQO0FBQ0Q7OztnREFFMkI7QUFBQTs7QUFDMUIsVUFBSSxVQUFVLFFBQVEsT0FBUixFQUFkO0FBQ0EsZ0JBQVUsUUFBUSxJQUFSLENBQWEsWUFBTTtBQUMzQixlQUFPLFNBQVMsZ0JBQVQsQ0FBMEIsUUFBSyxFQUFMLEdBQVUsYUFBcEMsRUFBbUQsVUFBQyxDQUFELEVBQU87QUFDL0QsY0FBSSxVQUFVLFlBQVksS0FBWixDQUFrQixFQUFFLE1BQUYsQ0FBUyxPQUFULEdBQW1CLElBQXJDLEVBQTJDLENBQTNDLENBQWQ7QUFDQSxjQUFJLFVBQVUsWUFBWSxLQUFaLENBQWtCLEVBQUUsTUFBRixDQUFTLE9BQVQsR0FBbUIsSUFBckMsRUFBMkMsQ0FBM0MsQ0FBZDtBQUNBLGNBQUksVUFBVSxRQUFRLE9BQVIsRUFBZDtBQUNBLG9CQUFVLFFBQVEsSUFBUixDQUFhLFlBQU07QUFDM0IsbUJBQU8sUUFBSyxnQkFBTCxDQUFzQixPQUF0QixFQUErQixPQUEvQixDQUFQO0FBQ0QsV0FGUyxDQUFWO0FBR0EsaUJBQU8sT0FBUDtBQUNELFNBUk0sQ0FBUDtBQVNELE9BVlMsQ0FBVjtBQVdBLGFBQU8sT0FBUDtBQUNEOzs7NENBRXVCLE8sRUFBUyxPLEVBQVMsUSxFQUFTO0FBQ2pELFVBQUksa0JBQW1CLFFBQUQsR0FBYSxLQUFLLGtCQUFMLENBQXdCLEtBQUssRUFBN0IsRUFBaUMsUUFBakMsQ0FBYixHQUEwRCxLQUFLLGVBQXJGO0FBQ0EsYUFBUSxXQUFXLE9BQVgsSUFBc0IsZUFBdkIsR0FBMEMsa0JBQWlCLFNBQWpCLEdBQTJCLE9BQTNCLEdBQW1DLEdBQW5DLEdBQXVDLE9BQXZDLEdBQStDLEdBQXpGLEdBQStGLElBQXRHO0FBQ0Q7OzttQ0FFYyxPLEVBQVE7QUFDckIsVUFBSSxnQkFBZ0IsRUFBcEI7QUFDQSxVQUFJLFVBQVUsUUFBUSxPQUFSLEVBQWQ7QUFDQSxnQkFBVSxRQUFRLElBQVIsQ0FBYSxZQUFNO0FBQzNCLHdCQUFnQjtBQUNkLGdCQUFNO0FBQ0osb0JBQVE7QUFESixXQURRO0FBSWQsa0JBQVE7QUFDTixtQkFBTztBQUNMLDBCQUFZLE9BRFA7QUFFTCx3QkFBVSxNQUZMO0FBR0wscUJBQU87QUFIRjtBQUREO0FBSk0sU0FBaEI7QUFZQSxlQUFPLFlBQVksWUFBWixDQUF5QixPQUF6QixFQUFrQyxhQUFsQyxDQUFQO0FBQ0QsT0FkUyxDQUFWO0FBZUEsYUFBTyxPQUFQO0FBQ0Q7OztpQ0FFWSxFLEVBQUksSyxFQUFPLFMsRUFBMkI7QUFBQSxVQUFoQixPQUFnQix1RUFBTixLQUFNOztBQUNqRCxVQUFJLFlBQVksU0FBUyxhQUFULENBQXVCLE9BQXZCLENBQWhCO0FBQ0EsVUFBSSxpQkFBaUIsU0FBUyxjQUFULENBQXdCLEVBQXhCLENBQXJCO0FBQ0EsZ0JBQVUsRUFBVixHQUFlLEtBQUssS0FBcEI7QUFDQSxnQkFBVSxTQUFWLENBQW9CLEdBQXBCLENBQXdCLFNBQXhCO0FBQ0EscUJBQWUsV0FBZixDQUEyQixTQUEzQjtBQUNEOzs7aUNBRVksSyxFQUFNO0FBQ2pCLGFBQU8sU0FBUyxjQUFULENBQXdCLEtBQUssRUFBTCxHQUFRLEtBQWhDLENBQVA7QUFDRDs7O3VDQUVrQixFLEVBQXNCO0FBQUEsVUFBbEIsUUFBa0IsdUVBQVAsTUFBTzs7QUFDdkMsYUFBTyxlQUFjLFFBQWQsR0FBd0IsR0FBeEIsR0FBNkIsS0FBSyxRQUF6QztBQUNEOzs7dUNBRWlCO0FBQ2hCLGFBQU87QUFDTCxjQUFNO0FBQ0osb0JBQVUsQ0FDUjtBQUNFLGtCQUFNLG1CQURSO0FBRUUsb0JBQVE7QUFDTixpQkFBRywyQkFERztBQUVOLHNCQUFRLFNBRkY7QUFHTixvQkFBTSxTQUhBO0FBSU4sMkJBQWE7QUFKUDtBQUZWLFdBRFEsRUFVUjtBQUNFLGtCQUFNLHlCQURSO0FBRUUsb0JBQVE7QUFDTixpQkFBRywyQkFERztBQUVOLHNCQUFRLFNBRkY7QUFHTixvQkFBTSxTQUhBO0FBSU4sMkJBQWE7QUFKUDtBQUZWLFdBVlE7QUFETjtBQURELE9BQVA7QUF3QkQ7Ozs7OztJQUdHLGM7QUFDSiw0QkFBYztBQUFBOztBQUNaLFNBQUssVUFBTCxHQUFrQixDQUFsQjtBQUNBLFNBQUssU0FBTCxHQUFpQixHQUFqQjtBQUNEOzs7O29DQUVlLFEsRUFBVTtBQUN4QixhQUFPLE1BQU0sU0FBTixDQUFnQixLQUFoQixDQUFzQixJQUF0QixDQUEyQixRQUEzQixDQUFQO0FBQ0Q7Ozt1Q0FFa0IsSyxFQUFPO0FBQ3hCLFVBQUksYUFBYSxFQUFqQjtBQUFBLFVBQXFCLGFBQWEsQ0FBbEM7QUFDQSxVQUFJLE1BQU0sTUFBTixDQUFhLEdBQWIsSUFBb0IsQ0FBQyxDQUF6QixFQUE0QjtBQUMxQixxQkFBYSxHQUFiO0FBQ0EscUJBQWEsSUFBYjtBQUNEO0FBQ0QsVUFBSSxNQUFNLE1BQU4sQ0FBYSxHQUFiLElBQW9CLENBQUMsQ0FBekIsRUFBNEI7QUFDMUIscUJBQWEsR0FBYjtBQUNBLHFCQUFhLEtBQUssSUFBbEI7QUFDRDtBQUNELFVBQUksTUFBTSxNQUFOLENBQWEsR0FBYixJQUFvQixDQUFDLENBQXpCLEVBQTRCO0FBQzFCLHFCQUFhLEdBQWI7QUFDQSxxQkFBYSxLQUFLLEVBQUwsR0FBVSxJQUF2QjtBQUNEO0FBQ0QsVUFBSSxNQUFNLE1BQU4sQ0FBYSxHQUFiLElBQW9CLENBQUMsQ0FBekIsRUFBNEI7QUFDMUIscUJBQWEsR0FBYjtBQUNBLHFCQUFhLEtBQUssRUFBTCxHQUFVLEVBQVYsR0FBZSxJQUE1QjtBQUNEO0FBQ0QsYUFBTyxXQUFXLE1BQU0sT0FBTixDQUFjLFVBQWQsRUFBMEIsRUFBMUIsQ0FBWCxJQUE0QyxVQUFuRDtBQUNEOzs7aUNBRVksRyxFQUFLLE0sRUFBUTtBQUFBOztBQUN4QixVQUFJLFNBQVMsR0FBYjtBQUNBLFVBQUksVUFBVSxRQUFRLE9BQVIsRUFBZDtBQUNBLGdCQUFVLFFBQVEsSUFBUixDQUFhLFlBQU07QUFDM0IsZUFBTyxZQUFZLElBQVosQ0FBaUIsT0FBTyxJQUFQLENBQVksTUFBWixDQUFqQixFQUFzQyxlQUFPO0FBQ2xELGNBQUksT0FBTyxjQUFQLENBQXNCLEdBQXRCLEtBQThCLFFBQU8sT0FBTyxHQUFQLENBQVAsTUFBdUIsUUFBekQsRUFBa0U7QUFDaEUsbUJBQU8sUUFBSyxZQUFMLENBQWtCLE9BQU8sR0FBUCxDQUFsQixFQUErQixPQUFPLEdBQVAsQ0FBL0IsRUFBNEMsSUFBNUMsQ0FBaUQsVUFBQyxZQUFELEVBQWtCO0FBQ3hFLHFCQUFPLEdBQVAsSUFBYyxZQUFkO0FBQ0QsYUFGTSxDQUFQO0FBR0Q7QUFDRCxpQkFBTyxPQUFPLEdBQVAsSUFBYyxPQUFPLEdBQVAsQ0FBckI7QUFDRCxTQVBNLENBQVA7QUFRRCxPQVRTLENBQVY7QUFVQSxnQkFBVSxRQUFRLElBQVIsQ0FBYSxZQUFNO0FBQzNCLGVBQU8sTUFBUDtBQUNELE9BRlMsQ0FBVjtBQUdBLGFBQU8sT0FBUDtBQUNEOzs7Z0NBRVcsTSxFQUFRO0FBQ2xCLFVBQUksQ0FBQyxNQUFELElBQVcsV0FBVyxDQUExQixFQUE2QixPQUFPLE1BQVA7QUFDN0IsVUFBSSxXQUFXLEtBQUssVUFBaEIsSUFBOEIsV0FBVyxLQUFLLFNBQWxELEVBQTZELE9BQU8sTUFBUDtBQUM3RCxlQUFTLFdBQVcsTUFBWCxDQUFUO0FBQ0EsVUFBSSxTQUFTLE1BQWIsRUFBcUI7QUFDbkIsWUFBSSxZQUFZLE9BQU8sT0FBUCxDQUFlLENBQWYsQ0FBaEI7QUFDQSxZQUFJLFlBQVksR0FBaEI7QUFBQSxZQUNFLFVBQVUsVUFBVSxLQUFWLENBQWdCLENBQWhCLEVBQW1CLFVBQVUsTUFBVixHQUFtQixDQUF0QyxDQURaO0FBRUEsWUFBSSxTQUFTLFVBQWIsRUFBeUI7QUFDdkIsb0JBQVUsVUFBVSxLQUFWLENBQWdCLENBQWhCLEVBQW1CLFVBQVUsTUFBVixHQUFtQixDQUF0QyxDQUFWO0FBQ0Esc0JBQVksR0FBWjtBQUNELFNBSEQsTUFHTyxJQUFJLFNBQVMsT0FBYixFQUFzQjtBQUMzQixvQkFBVSxVQUFVLEtBQVYsQ0FBZ0IsQ0FBaEIsRUFBbUIsVUFBVSxNQUFWLEdBQW1CLENBQXRDLENBQVY7QUFDQSxzQkFBWSxHQUFaO0FBQ0Q7QUFDRCxZQUFJLFVBQVUsUUFBUSxLQUFSLENBQWMsQ0FBZCxFQUFpQixRQUFRLE1BQVIsR0FBaUIsQ0FBbEMsQ0FBZDtBQUNBLFlBQUksVUFBVSxRQUFRLEtBQVIsQ0FBYyxRQUFRLE1BQVIsR0FBaUIsQ0FBL0IsQ0FBZDtBQUNBLGVBQU8sVUFBVSxHQUFWLEdBQWdCLE9BQWhCLEdBQTBCLEdBQTFCLEdBQWdDLFNBQXZDO0FBQ0QsT0FkRCxNQWNPO0FBQ0wsWUFBSSxZQUFhLFNBQVMsQ0FBVixHQUFlLENBQS9CO0FBQ0EsWUFBSSxTQUFKLEVBQWU7QUFDYixjQUFJLFlBQVksQ0FBaEI7QUFDQSxjQUFJLFNBQVMsQ0FBYixFQUFnQjtBQUNkLHdCQUFZLENBQVo7QUFDRCxXQUZELE1BRU8sSUFBSSxTQUFTLEVBQWIsRUFBaUI7QUFDdEIsd0JBQVksQ0FBWjtBQUNELFdBRk0sTUFFQSxJQUFJLFNBQVMsSUFBYixFQUFtQjtBQUN4Qix3QkFBWSxDQUFaO0FBQ0Q7QUFDRCxpQkFBTyxLQUFLLEtBQUwsQ0FBVyxNQUFYLEVBQW1CLFNBQW5CLENBQVA7QUFDRCxTQVZELE1BVU87QUFDTCxpQkFBTyxPQUFPLE9BQVAsQ0FBZSxDQUFmLENBQVA7QUFDRDtBQUNGO0FBQ0Y7OzswQkFFSyxNLEVBQVEsTyxFQUFTLFMsRUFBVztBQUNoQyxlQUFTLFdBQVcsTUFBWCxDQUFUO0FBQ0EsVUFBSSxDQUFDLE9BQUwsRUFBYyxVQUFVLENBQVY7QUFDZCxVQUFJLENBQUMsU0FBTCxFQUFnQixZQUFZLE9BQVo7QUFDaEIsZ0JBQVUsS0FBSyxHQUFMLENBQVMsRUFBVCxFQUFhLE9BQWIsQ0FBVjtBQUNBLGFBQU8sS0FBSyxTQUFMLEVBQWdCLFNBQVMsT0FBekIsSUFBb0MsT0FBM0M7QUFDRDs7O3lCQUVJLEcsRUFBSyxFLEVBQUksSSxFQUFNLEcsRUFBWTtBQUFBOztBQUFBLFVBQVAsQ0FBTyx1RUFBSCxDQUFHOztBQUM5QixVQUFNLE9BQU8sU0FBUCxJQUFPLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBWTtBQUN2QixZQUFJO0FBQ0YsY0FBTSxJQUFJLEdBQUcsSUFBSSxDQUFKLENBQUgsRUFBVyxDQUFYLEVBQWMsR0FBZCxDQUFWO0FBQ0EsZUFBSyxFQUFFLElBQVAsR0FBYyxFQUFFLElBQUYsQ0FBTyxFQUFQLEVBQVcsS0FBWCxDQUFpQixFQUFqQixDQUFkLEdBQXFDLEdBQUcsQ0FBSCxDQUFyQztBQUNELFNBSEQsQ0FJQSxPQUFPLENBQVAsRUFBVTtBQUNSLGFBQUcsQ0FBSDtBQUNEO0FBQ0YsT0FSRDtBQVNBLFVBQU0sT0FBTyxTQUFQLElBQU8sQ0FBQyxFQUFELEVBQUssRUFBTDtBQUFBLGVBQVk7QUFBQSxpQkFBTSxRQUFLLElBQUwsQ0FBVSxHQUFWLEVBQWUsRUFBZixFQUFtQixFQUFuQixFQUF1QixFQUF2QixFQUEyQixFQUFFLENBQTdCLENBQU47QUFBQSxTQUFaO0FBQUEsT0FBYjtBQUNBLFVBQU0sTUFBTSxTQUFOLEdBQU0sQ0FBQyxFQUFELEVBQUssRUFBTDtBQUFBLGVBQVksSUFBSSxJQUFJLE1BQVIsR0FBaUIsSUFBSSxPQUFKLENBQVksSUFBWixFQUFrQixJQUFsQixDQUF1QixLQUFLLEVBQUwsRUFBUyxFQUFULENBQXZCLEVBQXFDLEtBQXJDLENBQTJDLEVBQTNDLENBQWpCLEdBQWtFLElBQTlFO0FBQUEsT0FBWjtBQUNBLGFBQU8sT0FBTyxJQUFJLElBQUosRUFBVSxHQUFWLENBQVAsR0FBd0IsSUFBSSxPQUFKLENBQVksR0FBWixDQUEvQjtBQUNEOzs7Ozs7SUFHRyxVO0FBQ0osd0JBQWE7QUFBQTs7QUFDWCxTQUFLLEtBQUwsR0FBYSxFQUFiO0FBQ0Q7Ozs7Z0NBRVcsRyxFQUFLO0FBQUE7O0FBQ2YsVUFBSSxLQUFLLEtBQUwsQ0FBVyxHQUFYLENBQUosRUFBcUIsT0FBTyxRQUFRLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNyQixXQUFLLEtBQUwsQ0FBVyxHQUFYLElBQWtCLFNBQWxCO0FBQ0EsYUFBTyxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3RDLFlBQU0sU0FBUyxTQUFTLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBZjtBQUNBLGlCQUFTLElBQVQsQ0FBYyxXQUFkLENBQTBCLE1BQTFCO0FBQ0EsZUFBTyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxZQUFNO0FBQ3BDLGNBQUksUUFBSyxLQUFULEVBQWdCLFFBQUssS0FBTCxDQUFXLEdBQVgsSUFBa0IsWUFBbEI7QUFDaEI7QUFDRCxTQUhEO0FBSUEsZUFBTyxnQkFBUCxDQUF3QixPQUF4QixFQUFpQyxZQUFNO0FBQ3JDLGNBQUksUUFBSyxLQUFULEVBQWdCLE9BQU8sUUFBSyxLQUFMLENBQVcsR0FBWCxDQUFQO0FBQ2hCLGlCQUFPLElBQUksS0FBSixtQ0FBeUMsR0FBekMsQ0FBUDtBQUNELFNBSEQ7QUFJQSxlQUFPLEtBQVAsR0FBZSxJQUFmO0FBQ0EsZUFBTyxHQUFQLEdBQWEsR0FBYjtBQUNELE9BYk0sQ0FBUDtBQWNEOzs7K0JBRVUsRyxFQUFLO0FBQUE7O0FBQ2QsVUFBSSxLQUFLLEtBQUwsQ0FBVyxHQUFYLENBQUosRUFBcUIsT0FBTyxRQUFRLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNyQixXQUFLLEtBQUwsQ0FBVyxHQUFYLElBQWtCLFNBQWxCO0FBQ0EsYUFBTyxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3RDLFlBQU0sT0FBTyxTQUFTLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBYjtBQUNBLGFBQUssWUFBTCxDQUFrQixLQUFsQixFQUF5QixZQUF6QjtBQUNBLGlCQUFTLElBQVQsQ0FBYyxXQUFkLENBQTBCLElBQTFCO0FBQ0EsYUFBSyxZQUFMLENBQWtCLE1BQWxCLEVBQTBCLEdBQTFCO0FBQ0EsYUFBSyxnQkFBTCxDQUFzQixNQUF0QixFQUE4QixZQUFNO0FBQ2xDLGNBQUksUUFBSyxLQUFULEVBQWdCLFFBQUssS0FBTCxDQUFXLEdBQVgsSUFBa0IsWUFBbEI7QUFDaEI7QUFDRCxTQUhEO0FBSUEsYUFBSyxnQkFBTCxDQUFzQixPQUF0QixFQUErQixZQUFNO0FBQ25DLGNBQUksUUFBSyxLQUFULEVBQWdCLE9BQU8sUUFBSyxLQUFMLENBQVcsR0FBWCxDQUFQO0FBQ2hCLGlCQUFPLElBQUksS0FBSixnQ0FBdUMsR0FBdkMsQ0FBUDtBQUNELFNBSEQ7QUFJQSxhQUFLLElBQUwsR0FBWSxHQUFaO0FBQ0QsT0FkTSxDQUFQO0FBZUQ7OzttQ0FFYyxHLEVBQXVCO0FBQUEsVUFBbEIsU0FBa0IsdUVBQU4sS0FBTTs7QUFDcEMsVUFBTSxNQUFNLG1DQUFtQyxHQUEvQztBQUNBLGFBQU8sS0FBSyxTQUFMLENBQWUsR0FBZixFQUFvQixTQUFwQixDQUFQO0FBQ0Q7Ozs4QkFFUyxHLEVBQUssUyxFQUFVO0FBQUE7O0FBQ3ZCLFVBQUksVUFBVSxRQUFRLE9BQVIsRUFBZDtBQUNBLGdCQUFVLFFBQVEsSUFBUixDQUFhLFlBQU07QUFDM0IsWUFBSSxTQUFKLEVBQWM7QUFDWixjQUFJLFFBQUssS0FBTCxDQUFXLEdBQVgsTUFBb0IsU0FBeEIsRUFBa0M7QUFDaEMsZ0JBQUksaUJBQWlCLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDcEQseUJBQVcsWUFBTTtBQUNmLHdCQUFRLFFBQUssU0FBTCxDQUFlLEdBQWYsRUFBb0IsU0FBcEIsQ0FBUjtBQUNELGVBRkQsRUFFRyxHQUZIO0FBR0QsYUFKb0IsQ0FBckI7QUFLQSxtQkFBTyxjQUFQO0FBQ0Q7QUFDRCxjQUFJLENBQUMsQ0FBQyxRQUFLLEtBQUwsQ0FBVyxHQUFYLENBQU4sRUFBc0I7QUFDcEIsbUJBQU8sUUFBUSxPQUFSLENBQWdCLFFBQUssS0FBTCxDQUFXLEdBQVgsRUFBZ0IsS0FBaEIsRUFBaEIsQ0FBUDtBQUNEO0FBQ0Y7QUFDRCxZQUFJLGVBQWUsUUFBUSxPQUFSLEVBQW5CO0FBQ0EsdUJBQWUsYUFBYSxJQUFiLENBQWtCLFlBQU07QUFDckMsa0JBQUssS0FBTCxDQUFXLEdBQVgsSUFBa0IsU0FBbEI7QUFDQSxpQkFBTyxNQUFNLEdBQU4sQ0FBUDtBQUNELFNBSGMsQ0FBZjtBQUlBLHVCQUFlLGFBQWEsSUFBYixDQUFrQixVQUFDLFFBQUQsRUFBYztBQUM3QyxrQkFBSyxLQUFMLENBQVcsR0FBWCxJQUFrQixRQUFsQjtBQUNBLGlCQUFPLFNBQVMsS0FBVCxFQUFQO0FBQ0QsU0FIYyxDQUFmO0FBSUEsZUFBTyxZQUFQO0FBQ0QsT0F4QlMsQ0FBVjtBQXlCQSxhQUFPLE9BQVA7QUFDRDs7Ozs7O0FBR0gsSUFBSSxpQkFBSjtBQUNBLElBQU0sY0FBYyxJQUFJLGNBQUosRUFBcEI7QUFDQSxJQUFNLGVBQWUsSUFBSSxVQUFKLEVBQXJCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY2xhc3Mgd2lkZ2V0c0NvbnRyb2xsZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLndpZGdldHMgPSBuZXcgd2lkZ2V0c0NsYXNzKCk7XG4gICAgdGhpcy5iaW5kKCk7XG4gIH1cbiAgXG4gIGJpbmQoKXtcbiAgICB3aW5kb3dbdGhpcy53aWRnZXRzLmRlZmF1bHRzLm9iamVjdE5hbWVdID0ge307XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHRoaXMuaW5pdFdpZGdldHMoKSwgZmFsc2UpO1xuICAgIHdpbmRvd1t0aGlzLndpZGdldHMuZGVmYXVsdHMub2JqZWN0TmFtZV0uYmluZFdpZGdldCA9ICgpID0+IHtcbiAgICAgIHdpbmRvd1t0aGlzLndpZGdldHMuZGVmYXVsdHMub2JqZWN0TmFtZV0uaW5pdCA9IGZhbHNlO1xuICAgICAgdGhpcy5pbml0V2lkZ2V0cygpO1xuICAgIH07XG4gIH1cbiAgXG4gIGluaXRXaWRnZXRzKCl7XG4gICAgaWYgKCF3aW5kb3dbdGhpcy53aWRnZXRzLmRlZmF1bHRzLm9iamVjdE5hbWVdLmluaXQpe1xuICAgICAgd2luZG93W3RoaXMud2lkZ2V0cy5kZWZhdWx0cy5vYmplY3ROYW1lXS5pbml0ID0gdHJ1ZTtcbiAgICAgIGxldCBtYWluRWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMud2lkZ2V0cy5kZWZhdWx0cy5jbGFzc05hbWUpKTtcbiAgICAgIHRoaXMud2lkZ2V0cy5zZXRXaWRnZXRDbGFzcyhtYWluRWxlbWVudHMpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgICAgdGhpcy53aWRnZXRzLnNldFdpZGdldENsYXNzKG1haW5FbGVtZW50cyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFpbkVsZW1lbnRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICB0aGlzLndpZGdldHMuc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKGkpO1xuICAgICAgICB9XG4gICAgICB9LCBmYWxzZSk7XG4gICAgICBsZXQgc2NyaXB0RWxlbWVudCA9IHRoaXMud2lkZ2V0cy5nZXRTY3JpcHRFbGVtZW50KCk7XG4gICAgICBpZiAoc2NyaXB0RWxlbWVudCAmJiBzY3JpcHRFbGVtZW50LmRhdGFzZXQgJiYgc2NyaXB0RWxlbWVudC5kYXRhc2V0LmNwQ3VycmVuY3lXaWRnZXQpe1xuICAgICAgICBsZXQgZGF0YXNldCA9IEpTT04ucGFyc2Uoc2NyaXB0RWxlbWVudC5kYXRhc2V0LmNwQ3VycmVuY3lXaWRnZXQpO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoZGF0YXNldCkpe1xuICAgICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMoZGF0YXNldCk7XG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBrZXlzLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICAgIGxldCBrZXkgPSBrZXlzW2pdLnJlcGxhY2UoJy0nLCAnXycpO1xuICAgICAgICAgICAgdGhpcy53aWRnZXRzLmRlZmF1bHRzW2tleV0gPSBkYXRhc2V0W2tleXNbal1dO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMud2lkZ2V0cy5zdGF0ZXMgPSBbXTtcbiAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AobWFpbkVsZW1lbnRzLCAoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgICBsZXQgbmV3U2V0dGluZ3MgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMud2lkZ2V0cy5kZWZhdWx0cykpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLmlzV29yZHByZXNzID0gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3dvcmRwcmVzcycpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLm1haW5FbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgICB0aGlzLndpZGdldHMuc3RhdGVzLnB1c2gobmV3U2V0dGluZ3MpO1xuICAgICAgICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBsZXQgY2hhcnRTY3JpcHRzID0gW1xuICAgICAgICAgICAgICAnaHR0cDovL2NvZGUuaGlnaGNoYXJ0cy5jb20vc3RvY2svaGlnaHN0b2NrLmpzJyxcbiAgICAgICAgICAgICAgJ2h0dHBzOi8vY29kZS5oaWdoY2hhcnRzLmNvbS9tb2R1bGVzL2V4cG9ydGluZy5qcycsXG4gICAgICAgICAgICAgICdodHRwczovL2NvZGUuaGlnaGNoYXJ0cy5jb20vbW9kdWxlcy9uby1kYXRhLXRvLWRpc3BsYXkuanMnLFxuICAgICAgICAgICAgICAnaHR0cHM6Ly9jb2RlLmhpZ2hjaGFydHMuY29tL21vZHVsZXMvb2ZmbGluZS1leHBvcnRpbmcuanMnLFxuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIHJldHVybiAobmV3U2V0dGluZ3MubW9kdWxlcy5pbmRleE9mKCdjaGFydCcpID4gLTEgJiYgIXdpbmRvdy5IaWdoY2hhcnRzKVxuICAgICAgICAgICAgICA/IGNwQm9vdHN0cmFwLmxvb3AoY2hhcnRTY3JpcHRzLCBsaW5rID0+IHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmZXRjaFNlcnZpY2UuZmV0Y2hTY3JpcHQobGluayk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgOiBudWxsO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMud2lkZ2V0cy5pbml0KGluZGV4KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfSk7XG4gICAgICB9LCA1MCk7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIHdpZGdldHNDbGFzcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc3RhdGVzID0gW107XG4gICAgdGhpcy5kZWZhdWx0cyA9IHtcbiAgICAgIG9iamVjdE5hbWU6ICdjcEN1cnJlbmN5V2lkZ2V0cycsXG4gICAgICBjbGFzc05hbWU6ICdjb2lucGFwcmlrYS1jdXJyZW5jeS13aWRnZXQnLFxuICAgICAgY3NzRmlsZU5hbWU6ICd3aWRnZXQubWluLmNzcycsXG4gICAgICBjdXJyZW5jeTogJ2J0Yy1iaXRjb2luJyxcbiAgICAgIHByaW1hcnlfY3VycmVuY3k6ICdVU0QnLFxuICAgICAgcmFuZ2VfbGlzdDogWycyNGgnLCAnN2QnLCAnMzBkJywgJzFxJywgJzF5JywgJ3l0ZCcsICdhbGwnXSxcbiAgICAgIHJhbmdlOiAnN2QnLFxuICAgICAgbW9kdWxlczogWydjaGFydCcsICdtYXJrZXRfZGV0YWlscyddLFxuICAgICAgdXBkYXRlX2FjdGl2ZTogZmFsc2UsXG4gICAgICB1cGRhdGVfdGltZW91dDogJzMwcycsXG4gICAgICBsYW5ndWFnZTogJ2VuJyxcbiAgICAgIHN0eWxlX3NyYzogbnVsbCxcbiAgICAgIGltZ19zcmM6IG51bGwsXG4gICAgICBsYW5nX3NyYzogbnVsbCxcbiAgICAgIG9yaWdpbl9zcmM6ICdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL0Bjb2lucGFwcmlrYS93aWRnZXQtY3VycmVuY3knLFxuICAgICAgc2hvd19kZXRhaWxzX2N1cnJlbmN5OiBmYWxzZSxcbiAgICAgIHRpY2tlcjoge1xuICAgICAgICBuYW1lOiB1bmRlZmluZWQsXG4gICAgICAgIHN5bWJvbDogdW5kZWZpbmVkLFxuICAgICAgICBwcmljZTogdW5kZWZpbmVkLFxuICAgICAgICBwcmljZV9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgICAgIHJhbms6IHVuZGVmaW5lZCxcbiAgICAgICAgcHJpY2VfYXRoOiB1bmRlZmluZWQsXG4gICAgICAgIHZvbHVtZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgICAgbWFya2V0X2NhcDogdW5kZWZpbmVkLFxuICAgICAgICBwZXJjZW50X2Zyb21fcHJpY2VfYXRoOiB1bmRlZmluZWQsXG4gICAgICAgIHZvbHVtZV8yNGhfY2hhbmdlXzI0aDogdW5kZWZpbmVkLFxuICAgICAgICBtYXJrZXRfY2FwX2NoYW5nZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgICBpbnRlcnZhbDogbnVsbCxcbiAgICAgIGlzV29yZHByZXNzOiBmYWxzZSxcbiAgICAgIGlzRGF0YTogZmFsc2UsXG4gICAgICBtZXNzYWdlOiAnZGF0YV9sb2FkaW5nJyxcbiAgICAgIHRyYW5zbGF0aW9uczoge30sXG4gICAgICBtYWluRWxlbWVudDogbnVsbCxcbiAgICAgIG5vVHJhbnNsYXRpb25MYWJlbHM6IFtdLFxuICAgICAgc2NyaXB0c0Rvd25sb2FkZWQ6IHt9LFxuICAgICAgY2hhcnQ6IG51bGwsXG4gICAgICByd2Q6IHtcbiAgICAgICAgeHM6IDI4MCxcbiAgICAgICAgczogMzIwLFxuICAgICAgICBtOiAzNzAsXG4gICAgICB9LFxuICAgIH07XG4gIH1cbiAgXG4gIGluaXQoaW5kZXgpIHtcbiAgICBpZiAoIXRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5lcnJvcignQmluZCBmYWlsZWQsIG5vIGVsZW1lbnQgd2l0aCBjbGFzcyA9IFwiJyArIHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lICsgJ1wiJyk7XG4gICAgfVxuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5nZXREZWZhdWx0cyhpbmRleCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRPcmlnaW5MaW5rKGluZGV4KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgc2V0V2lkZ2V0Q2xhc3MoZWxlbWVudHMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgd2lkdGggPSBlbGVtZW50c1tpXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICAgIGxldCByd2RLZXlzID0gT2JqZWN0LmtleXModGhpcy5kZWZhdWx0cy5yd2QpO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCByd2RLZXlzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGxldCByd2RLZXkgPSByd2RLZXlzW2pdO1xuICAgICAgICBsZXQgcndkUGFyYW0gPSB0aGlzLmRlZmF1bHRzLnJ3ZFtyd2RLZXldO1xuICAgICAgICBsZXQgY2xhc3NOYW1lID0gdGhpcy5kZWZhdWx0cy5jbGFzc05hbWUgKyAnX18nICsgcndkS2V5O1xuICAgICAgICBpZiAod2lkdGggPD0gcndkUGFyYW0pIGVsZW1lbnRzW2ldLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgICAgaWYgKHdpZHRoID4gcndkUGFyYW0pIGVsZW1lbnRzW2ldLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIGdldE1haW5FbGVtZW50KGluZGV4KSB7XG4gICAgcmV0dXJuICh0aGlzLnN0YXRlc1tpbmRleF0pID8gdGhpcy5zdGF0ZXNbaW5kZXhdLm1haW5FbGVtZW50IDogbnVsbDtcbiAgfVxuICBcbiAgZ2V0RGVmYXVsdHMoaW5kZXgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBsZXQgbWFpbkVsZW1lbnQgPSB0aGlzLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICAgIGlmIChtYWluRWxlbWVudCAmJiBtYWluRWxlbWVudC5kYXRhc2V0KSB7XG4gICAgICAgIGlmICghbWFpbkVsZW1lbnQuZGF0YXNldC5tb2R1bGVzICYmIG1haW5FbGVtZW50LmRhdGFzZXQudmVyc2lvbiA9PT0gJ2V4dGVuZGVkJykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbW9kdWxlcycsIFsnbWFya2V0X2RldGFpbHMnXSk7XG4gICAgICAgIGlmICghbWFpbkVsZW1lbnQuZGF0YXNldC5tb2R1bGVzICYmIG1haW5FbGVtZW50LmRhdGFzZXQudmVyc2lvbiA9PT0gJ3N0YW5kYXJkJykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbW9kdWxlcycsIFtdKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubW9kdWxlcykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbW9kdWxlcycsIEpTT04ucGFyc2UobWFpbkVsZW1lbnQuZGF0YXNldC5tb2R1bGVzKSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnByaW1hcnlDdXJyZW5jeSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAncHJpbWFyeV9jdXJyZW5jeScsIG1haW5FbGVtZW50LmRhdGFzZXQucHJpbWFyeUN1cnJlbmN5KTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuY3VycmVuY3kpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2N1cnJlbmN5JywgbWFpbkVsZW1lbnQuZGF0YXNldC5jdXJyZW5jeSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnNob3dEZXRhaWxzQ3VycmVuY3kpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3Nob3dfZGV0YWlsc19jdXJyZW5jeScsIChtYWluRWxlbWVudC5kYXRhc2V0LnNob3dEZXRhaWxzQ3VycmVuY3kgPT09ICd0cnVlJykpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVBY3RpdmUpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ3VwZGF0ZV9hY3RpdmUnLCAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVBY3RpdmUgPT09ICd0cnVlJykpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVUaW1lb3V0KSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICd1cGRhdGVfdGltZW91dCcsIGNwQm9vdHN0cmFwLnBhcnNlSW50ZXJ2YWxWYWx1ZShtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZVRpbWVvdXQpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ3VhZ2UpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2xhbmd1YWdlJywgbWFpbkVsZW1lbnQuZGF0YXNldC5sYW5ndWFnZSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lm9yaWdpblNyYykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnb3JpZ2luX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQub3JpZ2luU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubm9kZU1vZHVsZXNTcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ25vZGVfbW9kdWxlc19zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0Lm5vZGVNb2R1bGVzU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuYm93ZXJTcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2Jvd2VyX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQuYm93ZXJTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5zdHlsZVNyYykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnc3R5bGVfc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5zdHlsZVNyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmxhbmdTcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2xvZ29fc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5sYW5nU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuaW1nU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdsb2dvX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQuaW1nU3JjKTtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgfSk7XG4gIH1cbiAgXG4gIHNldE9yaWdpbkxpbmsoaW5kZXgpIHtcbiAgICBpZiAoT2JqZWN0LmtleXModGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnMpLmxlbmd0aCA9PT0gMCkgdGhpcy5nZXRUcmFuc2xhdGlvbnModGhpcy5kZWZhdWx0cy5sYW5ndWFnZSk7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnN0eWxlc2hlZXQoKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmFkZFdpZGdldEVsZW1lbnQoaW5kZXgpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaW5pdEludGVydmFsKGluZGV4KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgYWRkV2lkZ2V0RWxlbWVudChpbmRleCkge1xuICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgIGxldCBtb2R1bGVzID0gJyc7XG4gICAgbGV0IGNoYXJ0Q29udGFpbmVyID0gbnVsbDtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AodGhpcy5zdGF0ZXNbaW5kZXhdLm1vZHVsZXMsIG1vZHVsZSA9PiB7XG4gICAgICAgIGxldCBsYWJlbCA9IG51bGw7XG4gICAgICAgIGlmIChtb2R1bGUgPT09ICdjaGFydCcpIGxhYmVsID0gJ0NoYXJ0JztcbiAgICAgICAgaWYgKG1vZHVsZSA9PT0gJ21hcmtldF9kZXRhaWxzJykgbGFiZWwgPSAnTWFya2V0RGV0YWlscyc7XG4gICAgICAgIHJldHVybiAobGFiZWwpID8gdGhpc1tgd2lkZ2V0JHsgbGFiZWwgfUVsZW1lbnRgXShpbmRleCkudGhlbihyZXN1bHQgPT4gbW9kdWxlcyArPSByZXN1bHQpIDogbnVsbDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIG1haW5FbGVtZW50LmlubmVySFRNTCA9IHRoaXMud2lkZ2V0TWFpbkVsZW1lbnQoaW5kZXgpICsgbW9kdWxlcyArIHRoaXMud2lkZ2V0Rm9vdGVyKGluZGV4KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGNoYXJ0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7IHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lIH0tcHJpY2UtY2hhcnQtJHsgaW5kZXggfWApO1xuICAgICAgcmV0dXJuIChjaGFydENvbnRhaW5lcikgPyBjaGFydENvbnRhaW5lci5wYXJlbnRFbGVtZW50Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgdGhpcy53aWRnZXRTZWxlY3RFbGVtZW50KGluZGV4LCAncmFuZ2UnKSkgOiBudWxsO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKGNoYXJ0Q29udGFpbmVyKXtcbiAgICAgICAgdGhpcy5zdGF0ZXNbaW5kZXhdLmNoYXJ0ID0gbmV3IGNoYXJ0Q2xhc3MoY2hhcnRDb250YWluZXIsIHRoaXMuc3RhdGVzW2luZGV4XSk7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0TGlzdGVuZXJzKGluZGV4KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuICAgIFxuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKGluZGV4KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmdldERhdGEoaW5kZXgpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBzZXRTZWxlY3RMaXN0ZW5lcnMoaW5kZXgpe1xuICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgIGxldCBzZWxlY3RFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXQtc2VsZWN0Jyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RFbGVtZW50cy5sZW5ndGg7IGkrKyl7XG4gICAgICBsZXQgYnV0dG9ucyA9IHNlbGVjdEVsZW1lbnRzW2ldLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXQtc2VsZWN0X19vcHRpb25zIGJ1dHRvbicpO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBidXR0b25zLmxlbmd0aDsgaisrKXtcbiAgICAgICAgYnV0dG9uc1tqXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0U2VsZWN0T3B0aW9uKGV2ZW50LCBpbmRleCk7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHNldFNlbGVjdE9wdGlvbihldmVudCwgaW5kZXgpe1xuICAgIGxldCBjbGFzc05hbWUgPSAnY3Atd2lkZ2V0LWFjdGl2ZSc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudC50YXJnZXQucGFyZW50Tm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGxldCBzaWJsaW5nID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuY2hpbGROb2Rlc1tpXTtcbiAgICAgIGlmIChzaWJsaW5nLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKSBzaWJsaW5nLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICB9XG4gICAgbGV0IHBhcmVudCA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcuY3Atd2lkZ2V0LXNlbGVjdCcpO1xuICAgIGxldCB0eXBlID0gcGFyZW50LmRhdGFzZXQudHlwZTtcbiAgICBsZXQgcGlja2VkVmFsdWVFbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5jcC13aWRnZXQtc2VsZWN0X19vcHRpb25zID4gc3BhbicpO1xuICAgIGxldCB2YWx1ZSA9IGV2ZW50LnRhcmdldC5kYXRhc2V0Lm9wdGlvbjtcbiAgICBwaWNrZWRWYWx1ZUVsZW1lbnQuaW5uZXJUZXh0ID0gdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgdmFsdWUudG9Mb3dlckNhc2UoKSk7XG4gICAgdGhpcy51cGRhdGVEYXRhKGluZGV4LCB0eXBlLCB2YWx1ZSk7XG4gICAgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB0aGlzLmRpc3BhdGNoRXZlbnQoaW5kZXgsICctc3dpdGNoLXJhbmdlJywgdmFsdWUpO1xuICB9XG4gIFxuICBkaXNwYXRjaEV2ZW50KGluZGV4LCBuYW1lLCBkYXRhKXtcbiAgICBsZXQgaWQgPSBgJHsgdGhpcy5kZWZhdWx0cy5jbGFzc05hbWUgfS1wcmljZS1jaGFydC0keyBpbmRleCB9YDtcbiAgICByZXR1cm4gZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoYCR7aWR9JHtuYW1lfWAsIHsgZGV0YWlsOiB7IGRhdGEgfSB9KSk7XG4gIH1cbiAgXG4gIGdldERhdGEoaW5kZXgpIHtcbiAgICBjb25zdCB1cmwgPSAnaHR0cHM6Ly9hcGkuY29pbnBhcHJpa2EuY29tL3YxL3dpZGdldC8nICsgdGhpcy5zdGF0ZXNbaW5kZXhdLmN1cnJlbmN5ICsgJz9xdW90ZT0nICsgdGhpcy5zdGF0ZXNbaW5kZXhdLnByaW1hcnlfY3VycmVuY3k7XG4gICAgcmV0dXJuIGZldGNoU2VydmljZS5mZXRjaERhdGEodXJsKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZXNbaW5kZXhdLmlzRGF0YSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnaXNEYXRhJywgdHJ1ZSk7XG4gICAgICAgIHRoaXMudXBkYXRlVGlja2VyKGluZGV4LCByZXN1bHQpO1xuICAgICAgfSlcbiAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5vbkVycm9yUmVxdWVzdChpbmRleCwgZXJyb3IpO1xuICAgIH0pO1xuICB9XG4gIFxuICBvbkVycm9yUmVxdWVzdChpbmRleCwgeGhyKSB7XG4gICAgaWYgKHRoaXMuc3RhdGVzW2luZGV4XS5pc0RhdGEpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2lzRGF0YScsIGZhbHNlKTtcbiAgICB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdtZXNzYWdlJywgJ2RhdGFfdW5hdmFpbGFibGUnKTtcbiAgICBjb25zb2xlLmVycm9yKCdSZXF1ZXN0IGZhaWxlZC4gIFJldHVybmVkIHN0YXR1cyBvZiAnICsgeGhyLCB0aGlzLnN0YXRlc1tpbmRleF0pO1xuICB9XG4gIFxuICBpbml0SW50ZXJ2YWwoaW5kZXgpIHtcbiAgICBjbGVhckludGVydmFsKHRoaXMuc3RhdGVzW2luZGV4XS5pbnRlcnZhbCk7XG4gICAgaWYgKHRoaXMuc3RhdGVzW2luZGV4XS51cGRhdGVfYWN0aXZlICYmIHRoaXMuc3RhdGVzW2luZGV4XS51cGRhdGVfdGltZW91dCA+IDEwMDApIHtcbiAgICAgIHRoaXMuc3RhdGVzW2luZGV4XS5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgdGhpcy5nZXREYXRhKGluZGV4KTtcbiAgICAgIH0sIHRoaXMuc3RhdGVzW2luZGV4XS51cGRhdGVfdGltZW91dCk7XG4gICAgfVxuICB9XG4gIFxuICBzZXRCZWZvcmVFbGVtZW50SW5Gb290ZXIoaW5kZXgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGVzW2luZGV4XS5pc1dvcmRwcmVzcykge1xuICAgICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgICBpZiAobWFpbkVsZW1lbnQpIHtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmNoaWxkcmVuWzBdLmxvY2FsTmFtZSA9PT0gJ3N0eWxlJykge1xuICAgICAgICAgIG1haW5FbGVtZW50LnJlbW92ZUNoaWxkKG1haW5FbGVtZW50LmNoaWxkTm9kZXNbMF0pO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmb290ZXJFbGVtZW50ID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNwLXdpZGdldF9fZm9vdGVyJyk7XG4gICAgICAgIGxldCB2YWx1ZSA9IGZvb3RlckVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLSA0MztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb290ZXJFbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YWx1ZSAtPSBmb290ZXJFbGVtZW50LmNoaWxkTm9kZXNbaV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgc3R5bGUuaW5uZXJIVE1MID0gJy5jcC13aWRnZXRfX2Zvb3Rlci0tJyArIGluZGV4ICsgJzo6YmVmb3Jle3dpZHRoOicgKyB2YWx1ZS50b0ZpeGVkKDApICsgJ3B4O30nO1xuICAgICAgICBtYWluRWxlbWVudC5pbnNlcnRCZWZvcmUoc3R5bGUsIG1haW5FbGVtZW50LmNoaWxkcmVuWzBdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHVwZGF0ZVdpZGdldEVsZW1lbnQoaW5kZXgsIGtleSwgdmFsdWUsIHRpY2tlcikge1xuICAgIGxldCBzdGF0ZSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcbiAgICBsZXQgbWFpbkVsZW1lbnQgPSB0aGlzLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICBpZiAobWFpbkVsZW1lbnQpIHtcbiAgICAgIGxldCB0aWNrZXJDbGFzcyA9ICh0aWNrZXIpID8gJ1RpY2tlcicgOiAnJztcbiAgICAgIGlmIChrZXkgPT09ICduYW1lJyB8fCBrZXkgPT09ICdjdXJyZW5jeScpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ2N1cnJlbmN5Jykge1xuICAgICAgICAgIGxldCBhRWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0X19mb290ZXIgPiBhJyk7XG4gICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBhRWxlbWVudHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgIGFFbGVtZW50c1trXS5ocmVmID0gdGhpcy5jb2luX2xpbmsodmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdldEltYWdlKGluZGV4KTtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09ICdpc0RhdGEnIHx8IGtleSA9PT0gJ21lc3NhZ2UnKSB7XG4gICAgICAgIGxldCBoZWFkZXJFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXRfX21haW4nKTtcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBoZWFkZXJFbGVtZW50cy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgIGhlYWRlckVsZW1lbnRzW2tdLmlubmVySFRNTCA9ICghc3RhdGUuaXNEYXRhKSA/IHRoaXMud2lkZ2V0TWFpbkVsZW1lbnRNZXNzYWdlKGluZGV4KSA6IHRoaXMud2lkZ2V0TWFpbkVsZW1lbnREYXRhKGluZGV4KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHVwZGF0ZUVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgKyBrZXkgKyB0aWNrZXJDbGFzcyk7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdXBkYXRlRWxlbWVudHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBsZXQgdXBkYXRlRWxlbWVudCA9IHVwZGF0ZUVsZW1lbnRzW2pdO1xuICAgICAgICAgIGlmICh1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY3Atd2lkZ2V0X19yYW5rJykpIHtcbiAgICAgICAgICAgIGxldCBjbGFzc05hbWUgPSAocGFyc2VGbG9hdCh2YWx1ZSkgPiAwKSA/IFwiY3Atd2lkZ2V0X19yYW5rLXVwXCIgOiAoKHBhcnNlRmxvYXQodmFsdWUpIDwgMCkgPyBcImNwLXdpZGdldF9fcmFuay1kb3duXCIgOiBcImNwLXdpZGdldF9fcmFuay1uZXV0cmFsXCIpO1xuICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX3JhbmstZG93bicpO1xuICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX3JhbmstdXAnKTtcbiAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLW5ldXRyYWwnKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHZhbHVlID0gY3BCb290c3RyYXAuZW1wdHlEYXRhO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgIHZhbHVlID0gKGtleSA9PT0gJ3ByaWNlX2NoYW5nZV8yNGgnKSA/ICcoJyArIGNwQm9vdHN0cmFwLnJvdW5kKHZhbHVlLCAyKSArICclKScgOiBjcEJvb3RzdHJhcC5yb3VuZCh2YWx1ZSwgMikgKyAnJSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvd0RldGFpbHNDdXJyZW5jeScpICYmICFzdGF0ZS5zaG93X2RldGFpbHNfY3VycmVuY3kpIHtcbiAgICAgICAgICAgIHZhbHVlID0gJyAnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BhcnNlTnVtYmVyJykpIHtcbiAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuaW5uZXJUZXh0ID0gY3BCb290c3RyYXAucGFyc2VOdW1iZXIodmFsdWUpIHx8IGNwQm9vdHN0cmFwLmVtcHR5RGF0YTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5pbm5lclRleHQgPSB2YWx1ZSB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICB1cGRhdGVEYXRhKGluZGV4LCBrZXksIHZhbHVlLCB0aWNrZXIpIHtcbiAgICBpZiAodGlja2VyKSB7XG4gICAgICB0aGlzLnN0YXRlc1tpbmRleF0udGlja2VyW2tleV0gPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGF0ZXNbaW5kZXhdW2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKGtleSA9PT0gJ2xhbmd1YWdlJykge1xuICAgICAgdGhpcy5nZXRUcmFuc2xhdGlvbnModmFsdWUpO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVdpZGdldEVsZW1lbnQoaW5kZXgsIGtleSwgdmFsdWUsIHRpY2tlcik7XG4gIH1cbiAgXG4gIHVwZGF0ZVdpZGdldFRyYW5zbGF0aW9ucyhsYW5nLCBkYXRhKSB7XG4gICAgdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ10gPSBkYXRhO1xuICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5zdGF0ZXMubGVuZ3RoOyB4KyspIHtcbiAgICAgIGxldCBpc05vVHJhbnNsYXRpb25MYWJlbHNVcGRhdGUgPSB0aGlzLnN0YXRlc1t4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLmxlbmd0aCA+IDAgJiYgbGFuZyA9PT0gJ2VuJztcbiAgICAgIGlmICh0aGlzLnN0YXRlc1t4XS5sYW5ndWFnZSA9PT0gbGFuZyB8fCBpc05vVHJhbnNsYXRpb25MYWJlbHNVcGRhdGUpIHtcbiAgICAgICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5zdGF0ZXNbeF0ubWFpbkVsZW1lbnQ7XG4gICAgICAgIGxldCB0cmFuc2FsdGVFbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC10cmFuc2xhdGlvbicpKTtcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0cmFuc2FsdGVFbGVtZW50cy5sZW5ndGg7IHkrKykge1xuICAgICAgICAgIHRyYW5zYWx0ZUVsZW1lbnRzW3ldLmNsYXNzTGlzdC5mb3JFYWNoKChjbGFzc05hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChjbGFzc05hbWUuc2VhcmNoKCd0cmFuc2xhdGlvbl8nKSA+IC0xKSB7XG4gICAgICAgICAgICAgIGxldCB0cmFuc2xhdGVLZXkgPSBjbGFzc05hbWUucmVwbGFjZSgndHJhbnNsYXRpb25fJywgJycpO1xuICAgICAgICAgICAgICBpZiAodHJhbnNsYXRlS2V5ID09PSAnbWVzc2FnZScpIHRyYW5zbGF0ZUtleSA9IHRoaXMuc3RhdGVzW3hdLm1lc3NhZ2U7XG4gICAgICAgICAgICAgIGxldCBsYWJlbEluZGV4ID0gdGhpcy5zdGF0ZXNbeF0ubm9UcmFuc2xhdGlvbkxhYmVscy5pbmRleE9mKHRyYW5zbGF0ZUtleSk7XG4gICAgICAgICAgICAgIGxldCB0ZXh0ID0gdGhpcy5nZXRUcmFuc2xhdGlvbih4LCB0cmFuc2xhdGVLZXkpO1xuICAgICAgICAgICAgICBpZiAobGFiZWxJbmRleCA+IC0xICYmIHRleHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1t4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLnNwbGljZShsYWJlbEluZGV4LCAxKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRyYW5zYWx0ZUVsZW1lbnRzW3ldLmlubmVyVGV4dCA9IHRleHQ7XG4gICAgICAgICAgICAgIGlmICh0cmFuc2FsdGVFbGVtZW50c1t5XS5jbG9zZXN0KCcuY3Atd2lkZ2V0X19mb290ZXInKSkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZXRCZWZvcmVFbGVtZW50SW5Gb290ZXIoeCksIDUwKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHVwZGF0ZVRpY2tlcihpbmRleCwgZGF0YSkge1xuICAgIGxldCBkYXRhS2V5cyA9IE9iamVjdC5rZXlzKGRhdGEpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMudXBkYXRlRGF0YShpbmRleCwgZGF0YUtleXNbaV0sIGRhdGFbZGF0YUtleXNbaV1dLCB0cnVlKTtcbiAgICB9XG4gIH1cbiAgXG4gIHN0eWxlc2hlZXQoKSB7XG4gICAgaWYgKHRoaXMuZGVmYXVsdHMuc3R5bGVfc3JjICE9PSBmYWxzZSkge1xuICAgICAgbGV0IHVybCA9IHRoaXMuZGVmYXVsdHMuc3R5bGVfc3JjIHx8IHRoaXMuZGVmYXVsdHMub3JpZ2luX3NyYyArICcvZGlzdC8nICsgdGhpcy5kZWZhdWx0cy5jc3NGaWxlTmFtZTtcbiAgICAgIGlmICghZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCdsaW5rW2hyZWY9XCInICsgdXJsICsgJ1wiXScpKXtcbiAgICAgICAgcmV0dXJuIGZldGNoU2VydmljZS5mZXRjaFN0eWxlKHVybCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuICBcbiAgd2lkZ2V0TWFpbkVsZW1lbnQoaW5kZXgpIHtcbiAgICBsZXQgZGF0YSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcbiAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX2hlYWRlclwiPicgK1xuICAgICAgJzxkaXYgY2xhc3M9XCInICsgJ2NwLXdpZGdldF9faW1nIGNwLXdpZGdldF9faW1nLScgKyBkYXRhLmN1cnJlbmN5ICsgJ1wiPicgK1xuICAgICAgJzxpbWcvPicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX21haW5cIj4nICtcbiAgICAgICgoZGF0YS5pc0RhdGEpID8gdGhpcy53aWRnZXRNYWluRWxlbWVudERhdGEoaW5kZXgpIDogdGhpcy53aWRnZXRNYWluRWxlbWVudE1lc3NhZ2UoaW5kZXgpKSArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+JztcbiAgfVxuICBcbiAgd2lkZ2V0TWFpbkVsZW1lbnREYXRhKGluZGV4KSB7XG4gICAgbGV0IGRhdGEgPSB0aGlzLnN0YXRlc1tpbmRleF07XG4gICAgcmV0dXJuICc8aDM+PGEgaHJlZj1cIicgKyB0aGlzLmNvaW5fbGluayhkYXRhLmN1cnJlbmN5KSArICdcIj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cIm5hbWVUaWNrZXJcIj4nICsgKGRhdGEudGlja2VyLm5hbWUgfHwgY3BCb290c3RyYXAuZW1wdHlEYXRhKSArICc8L3NwYW4+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzeW1ib2xUaWNrZXJcIj4nICsgKGRhdGEudGlja2VyLnN5bWJvbCB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGEpICsgJzwvc3Bhbj4nICtcbiAgICAgICc8L2E+PC9oMz4nICtcbiAgICAgICc8c3Ryb25nPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwicHJpY2VUaWNrZXIgcGFyc2VOdW1iZXJcIj4nICsgKGNwQm9vdHN0cmFwLnBhcnNlTnVtYmVyKGRhdGEudGlja2VyLnByaWNlKSB8fCBjcEJvb3RzdHJhcC5lbXB0eURhdGEpICsgJzwvc3Bhbj4gJyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJwcmltYXJ5Q3VycmVuY3lcIj4nICsgZGF0YS5wcmltYXJ5X2N1cnJlbmN5ICsgJyA8L3NwYW4+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJwcmljZV9jaGFuZ2VfMjRoVGlja2VyIGNwLXdpZGdldF9fcmFuayBjcC13aWRnZXRfX3JhbmstJyArICgoZGF0YS50aWNrZXIucHJpY2VfY2hhbmdlXzI0aCA+IDApID8gXCJ1cFwiIDogKChkYXRhLnRpY2tlci5wcmljZV9jaGFuZ2VfMjRoIDwgMCkgPyBcImRvd25cIiA6IFwibmV1dHJhbFwiKSkgKyAnXCI+KCcgKyAoY3BCb290c3RyYXAucm91bmQoZGF0YS50aWNrZXIucHJpY2VfY2hhbmdlXzI0aCwgMikgfHwgY3BCb290c3RyYXAuZW1wdHlWYWx1ZSkgKyAnJSk8L3NwYW4+JyArXG4gICAgICAnPC9zdHJvbmc+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJjcC13aWRnZXRfX3JhbmstbGFiZWxcIj48c3BhbiBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX3JhbmtcIj4nICsgdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJyYW5rXCIpICsgJzwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJyYW5rVGlja2VyXCI+JyArIChkYXRhLnRpY2tlci5yYW5rIHx8IGNwQm9vdHN0cmFwLmVtcHR5RGF0YSkgKyAnPC9zcGFuPjwvc3Bhbj4nO1xuICB9XG4gIFxuICB3aWRnZXRNYWluRWxlbWVudE1lc3NhZ2UoaW5kZXgpIHtcbiAgICBsZXQgbWVzc2FnZSA9IHRoaXMuc3RhdGVzW2luZGV4XS5tZXNzYWdlO1xuICAgIHJldHVybiAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9fbWFpbi1uby1kYXRhIGNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX21lc3NhZ2VcIj4nICsgKHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIG1lc3NhZ2UpKSArICc8L2Rpdj4nO1xuICB9XG4gIFxuICB3aWRnZXRNYXJrZXREZXRhaWxzRWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKHRoaXMuc3RhdGVzW2luZGV4XS5tb2R1bGVzLmluZGV4T2YoJ21hcmtldF9kZXRhaWxzJykgPiAtMSkgPyAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9fZGV0YWlsc1wiPicgK1xuICAgICAgdGhpcy53aWRnZXRBdGhFbGVtZW50KGluZGV4KSArXG4gICAgICB0aGlzLndpZGdldFZvbHVtZTI0aEVsZW1lbnQoaW5kZXgpICtcbiAgICAgIHRoaXMud2lkZ2V0TWFya2V0Q2FwRWxlbWVudChpbmRleCkgK1xuICAgICAgJzwvZGl2PicgOiAnJyk7XG4gIH1cbiAgXG4gIHdpZGdldEF0aEVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAnPHNtYWxsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fYXRoXCI+JyArIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwiYXRoXCIpICsgJzwvc21hbGw+JyArXG4gICAgICAnPGRpdj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInByaWNlX2F0aFRpY2tlciBwYXJzZU51bWJlclwiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlciBzaG93RGV0YWlsc0N1cnJlbmN5XCI+PC9zcGFuPicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwicGVyY2VudF9mcm9tX3ByaWNlX2F0aFRpY2tlciBjcC13aWRnZXRfX3JhbmtcIj4nICsgY3BCb290c3RyYXAuZW1wdHlEYXRhICsgJzwvc3Bhbj4nICtcbiAgICAgICc8L2Rpdj4nXG4gIH1cbiAgXG4gIHdpZGdldFZvbHVtZTI0aEVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAnPHNtYWxsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fdm9sdW1lXzI0aFwiPicgKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInZvbHVtZV8yNGhcIikgKyAnPC9zbWFsbD4nICtcbiAgICAgICc8ZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwidm9sdW1lXzI0aFRpY2tlciBwYXJzZU51bWJlclwiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlciBzaG93RGV0YWlsc0N1cnJlbmN5XCI+PC9zcGFuPicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwidm9sdW1lXzI0aF9jaGFuZ2VfMjRoVGlja2VyIGNwLXdpZGdldF9fcmFua1wiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnPC9zcGFuPicgK1xuICAgICAgJzwvZGl2Pic7XG4gIH1cbiAgXG4gIHdpZGdldE1hcmtldENhcEVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAnPHNtYWxsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fbWFya2V0X2NhcFwiPicgKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcIm1hcmtldF9jYXBcIikgKyAnPC9zbWFsbD4nICtcbiAgICAgICc8ZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwibWFya2V0X2NhcFRpY2tlciBwYXJzZU51bWJlclwiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlciBzaG93RGV0YWlsc0N1cnJlbmN5XCI+PC9zcGFuPicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwibWFya2V0X2NhcF9jaGFuZ2VfMjRoVGlja2VyIGNwLXdpZGdldF9fcmFua1wiPicgKyBjcEJvb3RzdHJhcC5lbXB0eURhdGEgKyAnPC9zcGFuPicgK1xuICAgICAgJzwvZGl2Pic7XG4gIH1cbiAgXG4gIHdpZGdldENoYXJ0RWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoXG4gICAgICBgPGRpdiBjbGFzcz1cImNwLXdpZGdldF9fY2hhcnRcIj48ZGl2IGlkPVwiJHsgdGhpcy5kZWZhdWx0cy5jbGFzc05hbWUgfS1wcmljZS1jaGFydC0keyBpbmRleCB9XCI+PC9kaXY+PC9kaXY+YFxuICAgICk7XG4gIH1cbiAgXG4gIHdpZGdldFNlbGVjdEVsZW1lbnQoaW5kZXgsIGxhYmVsKXtcbiAgICBsZXQgYnV0dG9ucyA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdGF0ZXNbaW5kZXhdW2xhYmVsKydfbGlzdCddLmxlbmd0aDsgaSsrKXtcbiAgICAgIGxldCBkYXRhID0gdGhpcy5zdGF0ZXNbaW5kZXhdW2xhYmVsKydfbGlzdCddW2ldO1xuICAgICAgYnV0dG9ucyArPSAnPGJ1dHRvbiBjbGFzcz1cIicrICgoZGF0YS50b0xvd2VyQ2FzZSgpID09PSB0aGlzLnN0YXRlc1tpbmRleF1bbGFiZWxdLnRvTG93ZXJDYXNlKCkpXG4gICAgICAgID8gJ2NwLXdpZGdldC1hY3RpdmUgJ1xuICAgICAgICA6ICcnKSArICgobGFiZWwgPT09ICdwcmltYXJ5X2N1cnJlbmN5JykgPyAnJyA6ICdjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl8nICsgZGF0YS50b0xvd2VyQ2FzZSgpKSArJ1wiIGRhdGEtb3B0aW9uPVwiJytkYXRhKydcIj4nK3RoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIGRhdGEudG9Mb3dlckNhc2UoKSkrJzwvYnV0dG9uPidcbiAgICB9XG4gICAgaWYgKGxhYmVsID09PSAncmFuZ2UnKSA7XG4gICAgbGV0IHRpdGxlID0gdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJ6b29tX2luXCIpO1xuICAgIHJldHVybiAnPGRpdiBkYXRhLXR5cGU9XCInK2xhYmVsKydcIiBjbGFzcz1cImNwLXdpZGdldC1zZWxlY3RcIj4nICtcbiAgICAgICc8bGFiZWwgY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl8nKyBsYWJlbCArJ1wiPicrdGl0bGUrJzwvbGFiZWw+JyArXG4gICAgICAnPGRpdiBjbGFzcz1cImNwLXdpZGdldC1zZWxlY3RfX29wdGlvbnNcIj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cImFycm93LWRvd24gJysgJ2NwLXdpZGdldF9fY2FwaXRhbGl6ZSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl8nICsgdGhpcy5zdGF0ZXNbaW5kZXhdW2xhYmVsXS50b0xvd2VyQ2FzZSgpICsnXCI+JysgdGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgdGhpcy5zdGF0ZXNbaW5kZXhdW2xhYmVsXS50b0xvd2VyQ2FzZSgpKSArJzwvc3Bhbj4nICtcbiAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0LXNlbGVjdF9fZHJvcGRvd25cIj4nICtcbiAgICAgIGJ1dHRvbnMgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzwvZGl2Pic7XG4gIH1cbiAgXG4gIHdpZGdldEZvb3RlcihpbmRleCkge1xuICAgIGxldCBjdXJyZW5jeSA9IHRoaXMuc3RhdGVzW2luZGV4XS5jdXJyZW5jeTtcbiAgICByZXR1cm4gKCF0aGlzLnN0YXRlc1tpbmRleF0uaXNXb3JkcHJlc3MpXG4gICAgICA/ICc8cCBjbGFzcz1cImNwLXdpZGdldF9fZm9vdGVyIGNwLXdpZGdldF9fZm9vdGVyLS0nICsgaW5kZXggKyAnXCI+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9wb3dlcmVkX2J5XCI+JyArIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwicG93ZXJlZF9ieVwiKSArICcgPC9zcGFuPicgK1xuICAgICAgJzxpbWcgc3R5bGU9XCJ3aWR0aDogMTZweFwiIHNyYz1cIicgKyB0aGlzLm1haW5fbG9nb19saW5rKCkgKyAnXCIgYWx0PVwiXCIvPicgK1xuICAgICAgJzxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCInICsgdGhpcy5jb2luX2xpbmsoY3VycmVuY3kpICsgJ1wiPmNvaW5wYXByaWthLmNvbTwvYT4nICtcbiAgICAgICc8L3A+J1xuICAgICAgOiAnJztcbiAgfVxuICBcbiAgZ2V0SW1hZ2UoaW5kZXgpIHtcbiAgICBsZXQgZGF0YSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcbiAgICBsZXQgaW1nQ29udGFpbmVycyA9IGRhdGEubWFpbkVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY3Atd2lkZ2V0X19pbWcnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGltZ0NvbnRhaW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBpbWdDb250YWluZXIgPSBpbWdDb250YWluZXJzW2ldO1xuICAgICAgaW1nQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NwLXdpZGdldF9faW1nLS1oaWRkZW4nKTtcbiAgICAgIGxldCBpbWcgPSBpbWdDb250YWluZXIucXVlcnlTZWxlY3RvcignaW1nJyk7XG4gICAgICBsZXQgbmV3SW1nID0gbmV3IEltYWdlO1xuICAgICAgbmV3SW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgaW1nLnNyYyA9IG5ld0ltZy5zcmM7XG4gICAgICAgIGltZ0NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX2ltZy0taGlkZGVuJyk7XG4gICAgICB9O1xuICAgICAgbmV3SW1nLnNyYyA9IHRoaXMuaW1nX3NyYyhkYXRhLmN1cnJlbmN5KTtcbiAgICB9XG4gIH1cbiAgXG4gIGltZ19zcmMoaWQpIHtcbiAgICByZXR1cm4gJ2h0dHBzOi8vY29pbnBhcHJpa2EuY29tL2NvaW4vJyArIGlkICsgJy9sb2dvLnBuZyc7XG4gIH1cbiAgXG4gIGNvaW5fbGluayhpZCkge1xuICAgIHJldHVybiAnaHR0cHM6Ly9jb2lucGFwcmlrYS5jb20vY29pbi8nICsgaWRcbiAgfVxuICBcbiAgbWFpbl9sb2dvX2xpbmsoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYXVsdHMuaW1nX3NyYyB8fCB0aGlzLmRlZmF1bHRzLm9yaWdpbl9zcmMgKyAnL2Rpc3QvaW1nL2xvZ29fd2lkZ2V0LnN2ZydcbiAgfVxuICBcbiAgZ2V0U2NyaXB0RWxlbWVudCgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0W2RhdGEtY3AtY3VycmVuY3ktd2lkZ2V0XScpO1xuICB9XG4gIFxuICBnZXRUcmFuc2xhdGlvbihpbmRleCwgbGFiZWwpIHtcbiAgICBsZXQgdGV4dCA9ICh0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1t0aGlzLnN0YXRlc1tpbmRleF0ubGFuZ3VhZ2VdKSA/IHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW3RoaXMuc3RhdGVzW2luZGV4XS5sYW5ndWFnZV1bbGFiZWxdIDogbnVsbDtcbiAgICBpZiAoIXRleHQgJiYgdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbJ2VuJ10pIHtcbiAgICAgIHRleHQgPSB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1snZW4nXVtsYWJlbF07XG4gICAgfVxuICAgIGlmICghdGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMuYWRkTGFiZWxXaXRob3V0VHJhbnNsYXRpb24oaW5kZXgsIGxhYmVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9XG4gIFxuICBhZGRMYWJlbFdpdGhvdXRUcmFuc2xhdGlvbihpbmRleCwgbGFiZWwpIHtcbiAgICBpZiAoIXRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zWydlbiddKSB0aGlzLmdldFRyYW5zbGF0aW9ucygnZW4nKTtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZXNbaW5kZXhdLm5vVHJhbnNsYXRpb25MYWJlbHMucHVzaChsYWJlbCk7XG4gIH1cbiAgXG4gIGdldFRyYW5zbGF0aW9ucyhsYW5nKSB7XG4gICAgaWYgKCF0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXSkge1xuICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgbGV0IHVybCA9IHRoaXMuZGVmYXVsdHMubGFuZ19zcmMgfHwgdGhpcy5kZWZhdWx0cy5vcmlnaW5fc3JjICsgJy9kaXN0L2xhbmcnO1xuICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCArICcvJyArIGxhbmcgKyAnLmpzb24nKTtcbiAgICAgIHhoci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVdpZGdldFRyYW5zbGF0aW9ucyhsYW5nLCBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9uRXJyb3JSZXF1ZXN0KDAsIHhocik7XG4gICAgICAgICAgdGhpcy5nZXRUcmFuc2xhdGlvbnMoJ2VuJyk7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgeGhyLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMub25FcnJvclJlcXVlc3QoMCwgeGhyKTtcbiAgICAgICAgdGhpcy5nZXRUcmFuc2xhdGlvbnMoJ2VuJyk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXTtcbiAgICAgIH07XG4gICAgICB4aHIuc2VuZCgpO1xuICAgICAgdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ10gPSB7fTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgY2hhcnRDbGFzcyB7XG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgc3RhdGUpe1xuICAgIGlmICghY29udGFpbmVyKSByZXR1cm47XG4gICAgdGhpcy5pZCA9IGNvbnRhaW5lci5pZDtcbiAgICB0aGlzLmNoYXJ0c1dpdGhBY3RpdmVTZXJpZXNDb29raWVzID0gW107XG4gICAgdGhpcy5jaGFydCA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW5jeSA9IHN0YXRlLmN1cnJlbmN5O1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucygpO1xuICAgIHRoaXMuZGVmYXVsdFJhbmdlID0gc3RhdGUucmFuZ2UgfHwgJzdkJztcbiAgICB0aGlzLmNhbGxiYWNrID0gbnVsbDtcbiAgICB0aGlzLnJlcGxhY2VDYWxsYmFjayA9IG51bGw7XG4gICAgdGhpcy5leHRyZW1lc0RhdGFVcmwgPSB0aGlzLmdldEV4dHJlbWVzRGF0YVVybChjb250YWluZXIuaWQpO1xuICAgIHRoaXMuZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICBjaGFydDoge1xuICAgICAgICBhbGlnblRpY2tzOiBmYWxzZSxcbiAgICAgICAgbWFyZ2luVG9wOiA1MCxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBmb250RmFtaWx5OiAnc2Fucy1zZXJpZicsXG4gICAgICAgIH0sXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgIHJlbmRlcjogKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC5hbm5vdGF0aW9ucykge1xuICAgICAgICAgICAgICBsZXQgY2hhcnQgPSBlLnRhcmdldC5hbm5vdGF0aW9ucy5jaGFydDtcbiAgICAgICAgICAgICAgY3BCb290c3RyYXAubG9vcChjaGFydC5hbm5vdGF0aW9ucy5hbGxJdGVtcywgYW5ub3RhdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHkgPSBjaGFydC5wbG90SGVpZ2h0ICsgY2hhcnQucGxvdFRvcCAtIGNoYXJ0LnNwYWNpbmdbMF0gLSAyIC0gKCh0aGlzLmlzUmVzcG9uc2l2ZU1vZGVBY3RpdmUoY2hhcnQpKSA/IDEwIDogMCk7XG4gICAgICAgICAgICAgICAgYW5ub3RhdGlvbi51cGRhdGUoe3l9LCB0cnVlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBzY3JvbGxiYXI6IHtcbiAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICB9LFxuICAgICAgYW5ub3RhdGlvbnNPcHRpb25zOiB7XG4gICAgICAgIGVuYWJsZWRCdXR0b25zOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICByYW5nZVNlbGVjdG9yOiB7XG4gICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHBsb3RPcHRpb25zOiB7XG4gICAgICAgIGxpbmU6IHtcbiAgICAgICAgICBzZXJpZXM6IHtcbiAgICAgICAgICAgIHN0YXRlczoge1xuICAgICAgICAgICAgICBob3Zlcjoge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBzZXJpZXM6IHtcbiAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgIGxlZ2VuZEl0ZW1DbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChldmVudC5icm93c2VyRXZlbnQuaXNUcnVzdGVkKXtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGFydHNXaXRoQWN0aXZlU2VyaWVzQ29va2llcy5pbmRleE9mKGV2ZW50LnRhcmdldC5jaGFydC5yZW5kZXJUby5pZCkgPiAtMSkgdGhpcy5zZXRWaXNpYmxlQ2hhcnRDb29raWVzKGV2ZW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyBPbiBpT1MgdG91Y2ggZXZlbnQgZmlyZXMgc2Vjb25kIGNhbGxiYWNrIGZyb20gSlMgKGlzVHJ1c3RlZDogZmFsc2UpIHdoaWNoXG4gICAgICAgICAgICAgIC8vIHJlc3VsdHMgd2l0aCB0b2dnbGUgYmFjayB0aGUgY2hhcnQgKHByb2JhYmx5IGl0cyBhIHByb2JsZW0gd2l0aCBVSUtpdCwgYnV0IG5vdCBzdXJlKVxuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbGVnZW5kSXRlbUNsaWNrJywge2V2ZW50LCBpc1RydXN0ZWQ6IGV2ZW50LmJyb3dzZXJFdmVudC5pc1RydXN0ZWR9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50LmJyb3dzZXJFdmVudC5pc1RydXN0ZWQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB4QXhpczoge1xuICAgICAgICBvcmRpbmFsOiBmYWxzZVxuICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5jaGFydERhdGFQYXJzZXIgPSAoZGF0YSwgZGF0YVR5cGUpID0+IHtcbiAgICAgIGxldCBwcmljZUN1cnJlbmN5ID0gc3RhdGUucHJpbWFyeV9jdXJyZW5jeS50b0xvd2VyQ2FzZSgpO1xuICAgICAgZGF0YSA9IGRhdGFbMF07XG4gICAgICBsZXQgbmV3RGF0YSA9IHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHByaWNlOiAoZGF0YVtwcmljZUN1cnJlbmN5XSkgPyBkYXRhW3ByaWNlQ3VycmVuY3ldIDogW10sXG4gICAgICAgICAgdm9sdW1lOiBkYXRhLnZvbHVtZSxcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3RGF0YSk7XG4gICAgfTtcbiAgICB0aGlzLmlzRXZlbnRzSGlkZGVuID0gZmFsc2U7XG4gICAgdGhpcy5leGNsdWRlU2VyaWVzSWRzID0gW107XG4gICAgdGhpcy5hc3luY1VybCA9IGAvY3VycmVuY3kvZGF0YS8keyBzdGF0ZS5jdXJyZW5jeSB9L19yYW5nZV8vYDtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuICBcbiAgc2V0T3B0aW9ucygpe1xuICAgIGNvbnN0IGNoYXJ0U2VydmljZSA9IG5ldyBjaGFydENsYXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3BvbnNpdmU6IHtcbiAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb25kaXRpb246IHtcbiAgICAgICAgICAgICAgbWF4V2lkdGg6IDc2OFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoYXJ0T3B0aW9uczoge1xuICAgICAgICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgICAgICBhbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJyxcbiAgICAgICAgICAgICAgICB5OiA5MixcbiAgICAgICAgICAgICAgICBzeW1ib2xSYWRpdXM6IDAsXG4gICAgICAgICAgICAgICAgaXRlbURpc3RhbmNlOiAyMCxcbiAgICAgICAgICAgICAgICBpdGVtU3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDQwMCxcbiAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IDM1LFxuICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogMCxcbiAgICAgICAgICAgICAgICBzcGFjaW5nVG9wOiAwLFxuICAgICAgICAgICAgICAgIHNwYWNpbmdCb3R0b206IDAsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG5hdmlnYXRvcjoge1xuICAgICAgICAgICAgICAgIGhlaWdodDogNTAsXG4gICAgICAgICAgICAgICAgbWFyZ2luOiA3MCxcbiAgICAgICAgICAgICAgICBoYW5kbGVzOiB7XG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6IDI1LFxuICAgICAgICAgICAgICAgICAgd2lkdGg6IDE3LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgIG1heFdpZHRoOiA2MDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGFydE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IDE1LFxuICAgICAgICAgICAgICAgIHpvb21UeXBlOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICBtYXJnaW5MZWZ0OiAxMCxcbiAgICAgICAgICAgICAgICBtYXJnaW5SaWdodDogMTAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzNTAsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHlBeGlzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgZmxvb3I6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrQW1vdW50OiA3LFxuICAgICAgICAgICAgICAgICAgdGlja1dpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGlja0xlbmd0aDogMCxcbiAgICAgICAgICAgICAgICAgIGxpbmVXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgICAgICAgICAgIGFsaWduOiBcImxlZnRcIixcbiAgICAgICAgICAgICAgICAgICAgeDogMSxcbiAgICAgICAgICAgICAgICAgICAgeTogLTIsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjOWU5ZTllJyxcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzlweCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgICAgICAgICAgIHRpY2tBbW91bnQ6IDcsXG4gICAgICAgICAgICAgICAgICB0aWNrV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICB0aWNrTGVuZ3RoOiAwLFxuICAgICAgICAgICAgICAgICAgbGluZVdpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgYWxpZ246IFwicmlnaHRcIixcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IFwianVzdGlmeVwiLFxuICAgICAgICAgICAgICAgICAgICB4OiAxLFxuICAgICAgICAgICAgICAgICAgICB5OiAtMixcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM1MDg1ZWMnLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnOXB4JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbmRpdGlvbjoge1xuICAgICAgICAgICAgICBtYXhXaWR0aDogMzc0XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hhcnRPcHRpb25zOiB7XG4gICAgICAgICAgICAgIG5hdmlnYXRvcjoge1xuICAgICAgICAgICAgICAgIG1hcmdpbjogOTAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA0MCxcbiAgICAgICAgICAgICAgICBoYW5kbGVzOiB7XG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6IDIwLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB0aXRsZToge1xuICAgICAgICB0ZXh0OiB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgICAgY2hhcnQ6IHtcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnbm9uZScsXG4gICAgICAgIG1hcmdpblRvcDogNTAsXG4gICAgICAgIHBsb3RCb3JkZXJXaWR0aDogMCxcbiAgICAgIH0sXG4gICAgICBjcEV2ZW50czogZmFsc2UsXG4gICAgICBjb2xvcnM6IFtcbiAgICAgICAgJyM1MDg1ZWMnLFxuICAgICAgICAnIzFmOTgwOScsXG4gICAgICAgICcjOTg1ZDY1JyxcbiAgICAgICAgJyNlZTk4M2InLFxuICAgICAgICAnIzRjNGM0YycsXG4gICAgICBdLFxuICAgICAgbGVnZW5kOiB7XG4gICAgICAgIG1hcmdpbjogMCxcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgYWxpZ246ICdyaWdodCcsXG4gICAgICAgIHN5bWJvbFJhZGl1czogMCxcbiAgICAgICAgaXRlbURpc3RhbmNlOiA0MCxcbiAgICAgICAgaXRlbVN0eWxlOiB7XG4gICAgICAgICAgZm9udFdlaWdodDogJ25vcm1hbCcsXG4gICAgICAgICAgY29sb3I6ICcjMDY0NWFkJ1xuICAgICAgICB9LFxuICAgICAgICBpdGVtTWFyZ2luVG9wOiA4LFxuICAgICAgfSxcbiAgICAgIG5hdmlnYXRvcjogdHJ1ZSxcbiAgICAgIHRvb2x0aXA6IHtcbiAgICAgICAgc2hhcmVkOiB0cnVlLFxuICAgICAgICBzcGxpdDogZmFsc2UsXG4gICAgICAgIGFuaW1hdGlvbjogZmFsc2UsXG4gICAgICAgIGJvcmRlcldpZHRoOiAwLFxuICAgICAgICBoaWRlRGVsYXk6IDEwMCxcbiAgICAgICAgc2hhZG93OiBmYWxzZSxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgY29sb3I6ICcjNGM0YzRjJyxcbiAgICAgICAgICBmb250U2l6ZTogJzEwcHgnXG4gICAgICAgIH0sXG4gICAgICAgIHVzZUhUTUw6IHRydWUsXG4gICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gY2hhcnRTZXJ2aWNlLnRvb2x0aXBGb3JtYXR0ZXIodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgXG4gICAgICBleHBvcnRpbmc6IHtcbiAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgIGNvbnRleHRCdXR0b246IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXG4gICAgICB4QXhpczoge1xuICAgICAgICBsaW5lQ29sb3I6ICcjNTA1MDUwJyxcbiAgICAgICAgdGlja0NvbG9yOiAnIzUwNTA1MCcsXG4gICAgICAgIHRpY2tMZW5ndGg6IDcsXG4gICAgICB9LFxuICAgICAgXG4gICAgICB5QXhpczogW3sgLy8gVm9sdW1lIHlBeGlzXG4gICAgICAgIGxpbmVXaWR0aDogMSxcbiAgICAgICAgbGluZUNvbG9yOiAnI2RlZGVkZScsXG4gICAgICAgIHRpY2tXaWR0aDogMSxcbiAgICAgICAgdGlja0xlbmd0aDogNCxcbiAgICAgICAgZ3JpZExpbmVEYXNoU3R5bGU6ICdkYXNoJyxcbiAgICAgICAgZ3JpZExpbmVXaWR0aDogMCxcbiAgICAgICAgZmxvb3I6IDAsXG4gICAgICAgIG1pblBhZGRpbmc6IDAsXG4gICAgICAgIG9wcG9zaXRlOiBmYWxzZSxcbiAgICAgICAgc2hvd0VtcHR5OiBmYWxzZSxcbiAgICAgICAgc2hvd0xhc3RMYWJlbDogZmFsc2UsXG4gICAgICAgIHNob3dGaXJzdExhYmVsOiBmYWxzZSxcbiAgICAgIH0sIHtcbiAgICAgICAgZ3JpZExpbmVDb2xvcjogJyM1MDUwNTAnLFxuICAgICAgICBncmlkTGluZURhc2hTdHlsZTogJ2Rhc2gnLFxuICAgICAgICBsaW5lV2lkdGg6IDEsXG4gICAgICAgIHRpY2tXaWR0aDogMSxcbiAgICAgICAgdGlja0xlbmd0aDogNCxcbiAgICAgICAgZmxvb3I6IDAsXG4gICAgICAgIG1pblBhZGRpbmc6IDAsXG4gICAgICAgIHNob3dFbXB0eTogZmFsc2UsXG4gICAgICAgIG9wcG9zaXRlOiB0cnVlLFxuICAgICAgICBncmlkWkluZGV4OiA0LFxuICAgICAgICBzaG93TGFzdExhYmVsOiBmYWxzZSxcbiAgICAgICAgc2hvd0ZpcnN0TGFiZWw6IGZhbHNlLFxuICAgICAgfV0sXG4gICAgICBcbiAgICAgIHNlcmllczogW1xuICAgICAgICB7IC8vb3JkZXIgb2YgdGhlIHNlcmllcyBtYXR0ZXJzXG4gICAgICAgICAgY29sb3I6ICcjNTA4NWVjJyxcbiAgICAgICAgICBuYW1lOiAnUHJpY2UnLFxuICAgICAgICAgIGlkOiAncHJpY2UnLFxuICAgICAgICAgIGRhdGE6IFtdLFxuICAgICAgICAgIHR5cGU6ICdhcmVhJyxcbiAgICAgICAgICBmaWxsT3BhY2l0eTogMC4xNSxcbiAgICAgICAgICBsaW5lV2lkdGg6IDIsXG4gICAgICAgICAgeUF4aXM6IDEsXG4gICAgICAgICAgekluZGV4OiAyLFxuICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgY2xpY2thYmxlOiB0cnVlLFxuICAgICAgICAgIHRocmVzaG9sZDogbnVsbCxcbiAgICAgICAgICB0b29sdGlwOiB7XG4gICAgICAgICAgICB2YWx1ZURlY2ltYWxzOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzaG93SW5OYXZpZ2F0b3I6IHRydWUsXG4gICAgICAgICAgc2hvd0luTGVnZW5kOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGNvbG9yOiAnIzgzODM4MycgfHwgYHVybCgjZmlsbC12b2x1bWUtY2hhcnQpYCxcbiAgICAgICAgICBuYW1lOiAnVm9sdW1lJyxcbiAgICAgICAgICBpZDogJ3ZvbHVtZScsXG4gICAgICAgICAgZGF0YTogW10sXG4gICAgICAgICAgdHlwZTogJ2FyZWEnLFxuICAgICAgICAgIGZpbGxPcGFjaXR5OiAwLjUsXG4gICAgICAgICAgbGluZVdpZHRoOiAwLFxuICAgICAgICAgIHlBeGlzOiAwLFxuICAgICAgICAgIHpJbmRleDogMCxcbiAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgIGNsaWNrYWJsZTogdHJ1ZSxcbiAgICAgICAgICB0aHJlc2hvbGQ6IG51bGwsXG4gICAgICAgICAgdG9vbHRpcDoge1xuICAgICAgICAgICAgdmFsdWVEZWNpbWFsczogMCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNob3dJbk5hdmlnYXRvcjogdHJ1ZSxcbiAgICAgICAgfV1cbiAgICB9XG4gIH1cbiAgXG4gIGluaXQoKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2VPcHRpb25zKHRoaXMub3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigob3B0aW9ucykgPT4ge1xuICAgICAgcmV0dXJuICh3aW5kb3cuSGlnaGNoYXJ0cykgPyBIaWdoY2hhcnRzLnN0b2NrQ2hhcnQodGhpcy5jb250YWluZXIuaWQsIG9wdGlvbnMsIChjaGFydCkgPT4gdGhpcy5iaW5kKGNoYXJ0KSkgOiBudWxsO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBwYXJzZU9wdGlvbnMob3B0aW9ucyl7XG4gICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC51cGRhdGVPYmplY3QodGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigobmV3T3B0aW9ucykgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLnVwZGF0ZU9iamVjdCh0aGlzLmdldFZvbHVtZVBhdHRlcm4oKSwgbmV3T3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigobmV3T3B0aW9ucykgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0TmF2aWdhdG9yKG5ld09wdGlvbnMpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKG5ld09wdGlvbnMpID0+IHtcbiAgICAgIHJldHVybiAobmV3T3B0aW9ucy5ub0RhdGEpID8gdGhpcy5zZXROb0RhdGFMYWJlbChuZXdPcHRpb25zKSA6IG5ld09wdGlvbnM7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigobmV3T3B0aW9ucykgPT4ge1xuICAgICAgcmV0dXJuIG5ld09wdGlvbnM7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIGJpbmQoY2hhcnQpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFydCA9IGNoYXJ0O1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hEYXRhUGFja2FnZSgpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0UmFuZ2VTd2l0Y2hlcigpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuICh0aGlzLmNhbGxiYWNrKSA/IHRoaXMuY2FsbGJhY2sodGhpcy5jaGFydCwgdGhpcy5kZWZhdWx0UmFuZ2UpIDogbnVsbDtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgZmV0Y2hEYXRhUGFja2FnZShtaW5EYXRlLCBtYXhEYXRlKXtcbiAgICBsZXQgaXNQcmVjaXNlUmFuZ2UgPSAobWluRGF0ZSAmJiBtYXhEYXRlKTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5jcEV2ZW50cyl7XG4gICAgICAgIGxldCB1cmwgPSAoaXNQcmVjaXNlUmFuZ2UpID8gdGhpcy5nZXROYXZpZ2F0b3JFeHRyZW1lc1VybChtaW5EYXRlLCBtYXhEYXRlLCAnZXZlbnRzJykgOiB0aGlzLmdldEV4dHJlbWVzRGF0YVVybCh0aGlzLmlkLCAnZXZlbnRzJykgKyAnLycgKyB0aGlzLmdldFJhbmdlKCkgKyAnLyc7XG4gICAgICAgIHJldHVybiAodXJsKSA/IHRoaXMuZmV0Y2hEYXRhKHVybCwgJ2V2ZW50cycsICFpc1ByZWNpc2VSYW5nZSkgOiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBsZXQgdXJsID0gKGlzUHJlY2lzZVJhbmdlKSA/IHRoaXMuZ2V0TmF2aWdhdG9yRXh0cmVtZXNVcmwobWluRGF0ZSwgbWF4RGF0ZSkgOiB0aGlzLmFzeW5jVXJsLnJlcGxhY2UoJ19yYW5nZV8nLCB0aGlzLmdldFJhbmdlKCkpO1xuICAgICAgcmV0dXJuICh1cmwpID8gdGhpcy5mZXRjaERhdGEodXJsLCAnZGF0YScsICFpc1ByZWNpc2VSYW5nZSkgOiBudWxsO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhcnQucmVkcmF3KGZhbHNlKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiAoIWlzUHJlY2lzZVJhbmdlKSA/IHRoaXMuY2hhcnQuem9vbU91dCgpIDogbnVsbDtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmlzTG9hZGVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnRvZ2dsZUV2ZW50cygpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBmZXRjaERhdGEodXJsLCBkYXRhVHlwZSA9ICdkYXRhJywgcmVwbGFjZSA9IHRydWUpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLmNoYXJ0LnNob3dMb2FkaW5nKCk7XG4gICAgICByZXR1cm4gZmV0Y2hTZXJ2aWNlLmZldGNoQ2hhcnREYXRhKHVybCwgIXRoaXMuaXNMb2FkZWQpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICB0aGlzLmNoYXJ0LmhpZGVMb2FkaW5nKCk7XG4gICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGBMb29rcyBsaWtlIHRoZXJlIHdhcyBhIHByb2JsZW0uIFN0YXR1cyBDb2RlOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihkYXRhID0+IHtcbiAgICAgICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVBhcnNlcihkYXRhLCBkYXRhVHlwZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChjb250ZW50KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChyZXBsYWNlKSA/IHRoaXMucmVwbGFjZURhdGEoY29udGVudC5kYXRhLCBkYXRhVHlwZSkgOiB0aGlzLnVwZGF0ZURhdGEoY29udGVudC5kYXRhLCBkYXRhVHlwZSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH0pO1xuICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgdGhpcy5jaGFydC5oaWRlTG9hZGluZygpO1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCdGZXRjaCBFcnJvcicsIGVycm9yKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgc2V0UmFuZ2VTd2l0Y2hlcigpe1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoYCR7IHRoaXMuaWQgfS1zd2l0Y2gtcmFuZ2VgLCAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuZGVmYXVsdFJhbmdlID0gZXZlbnQuZGV0YWlsLmRhdGE7XG4gICAgICByZXR1cm4gdGhpcy5mZXRjaERhdGFQYWNrYWdlKCk7XG4gICAgfSk7XG4gIH1cbiAgXG4gIGdldFJhbmdlKCl7XG4gICAgcmV0dXJuIHRoaXMuZGVmYXVsdFJhbmdlIHx8ICcxcSc7XG4gIH1cbiAgXG4gIHRvZ2dsZUV2ZW50cygpe1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5jcEV2ZW50cyl7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2hpZ2hjaGFydHMtYW5ub3RhdGlvbicpO1xuICAgICAgfSk7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChlbGVtZW50cykgPT4ge1xuICAgICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChlbGVtZW50cywgZWxlbWVudCA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNFdmVudHNIaWRkZW4pe1xuICAgICAgICAgICAgcmV0dXJuICghZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZ2hjaGFydHMtYW5ub3RhdGlvbl9faGlkZGVuJykpID8gZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWdoY2hhcnRzLWFubm90YXRpb25fX2hpZGRlbicpIDogbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaGlnaGNoYXJ0cy1hbm5vdGF0aW9uX19oaWRkZW4nKSkgPyBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hjaGFydHMtYW5ub3RhdGlvbl9faGlkZGVuJykgOiBudWxsO1xuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2hpZ2hjaGFydHMtcGxvdC1saW5lJyk7XG4gICAgICB9KTtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGVsZW1lbnRzKSA9PiB7XG4gICAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKGVsZW1lbnRzLCBlbGVtZW50ID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5pc0V2ZW50c0hpZGRlbil7XG4gICAgICAgICAgICByZXR1cm4gKCFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaGlnaGNoYXJ0cy1wbG90LWxpbmVfX2hpZGRlbicpKSA/IGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlnaGNoYXJ0cy1wbG90LWxpbmVfX2hpZGRlbicpIDogbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaGlnaGNoYXJ0cy1wbG90LWxpbmVfX2hpZGRlbicpKSA/IGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGNoYXJ0cy1wbG90LWxpbmVfX2hpZGRlbicpIDogbnVsbDtcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgZGF0YVBhcnNlcihkYXRhLCBkYXRhVHlwZSA9ICdkYXRhJyl7XG4gICAgc3dpdGNoIChkYXRhVHlwZSl7XG4gICAgICBjYXNlICdkYXRhJzpcbiAgICAgICAgbGV0IHByb21pc2VEYXRhID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2VEYXRhID0gcHJvbWlzZURhdGEudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuICh0aGlzLmNoYXJ0RGF0YVBhcnNlcikgPyB0aGlzLmNoYXJ0RGF0YVBhcnNlcihkYXRhKSA6IHtcbiAgICAgICAgICAgIGRhdGE6IGRhdGFbMF0sXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlRGF0YTtcbiAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZGF0YSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbiAgXG4gIHVwZGF0ZURhdGEoZGF0YSwgZGF0YVR5cGUpIHtcbiAgICBsZXQgbmV3RGF0YTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgc3dpdGNoIChkYXRhVHlwZSkge1xuICAgICAgICBjYXNlICdkYXRhJzpcbiAgICAgICAgICBuZXdEYXRhID0ge307XG4gICAgICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AoT2JqZWN0LmVudHJpZXMoZGF0YSksICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNFeGNsdWRlZCh2YWx1ZVswXSkpIHJldHVybjtcbiAgICAgICAgICAgIGxldCBvbGREYXRhID0gdGhpcy5nZXRPbGREYXRhKGRhdGFUeXBlKVt2YWx1ZVswXV07XG4gICAgICAgICAgICBuZXdEYXRhW3ZhbHVlWzBdXSA9IG9sZERhdGFcbiAgICAgICAgICAgICAgLmZpbHRlcigoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZVsxXS5maW5kSW5kZXgoZmluZEVsZW1lbnQgPT4gdGhpcy5pc1RoZVNhbWVFbGVtZW50KGVsZW1lbnQsIGZpbmRFbGVtZW50LCBkYXRhVHlwZSkpID09PSAtMTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmNvbmNhdCh2YWx1ZVsxXSlcbiAgICAgICAgICAgICAgLnNvcnQoKGRhdGExLCBkYXRhMikgPT4gdGhpcy5zb3J0Q29uZGl0aW9uKGRhdGExLCBkYXRhMiwgZGF0YVR5cGUpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgICBuZXdEYXRhID0gW107XG4gICAgICAgICAgbGV0IG9sZERhdGEgPSB0aGlzLmdldE9sZERhdGEoZGF0YVR5cGUpO1xuICAgICAgICAgIHJldHVybiBuZXdEYXRhID0gb2xkRGF0YVxuICAgICAgICAgICAgLmZpbHRlcigoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICBkYXRhLmZpbmRJbmRleChmaW5kRWxlbWVudCA9PiB0aGlzLmlzVGhlU2FtZUVsZW1lbnQoZWxlbWVudCwgZmluZEVsZW1lbnQsIGRhdGFUeXBlKSkgPT09IC0xO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jb25jYXQoZGF0YSlcbiAgICAgICAgICAgIC5zb3J0KChkYXRhMSwgZGF0YTIpID0+IHRoaXMuc29ydENvbmRpdGlvbihkYXRhMSwgZGF0YTIsIGRhdGFUeXBlKSk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZURhdGEobmV3RGF0YSwgZGF0YVR5cGUpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBpc1RoZVNhbWVFbGVtZW50KGVsZW1lbnRBLCBlbGVtZW50QiwgZGF0YVR5cGUpe1xuICAgIHN3aXRjaCAoZGF0YVR5cGUpe1xuICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgIHJldHVybiBlbGVtZW50QVswXSA9PT0gZWxlbWVudEJbMF07XG4gICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICByZXR1cm4gZWxlbWVudEEudHMgPT09IGVsZW1lbnRCLnRzO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICBcbiAgc29ydENvbmRpdGlvbihlbGVtZW50QSwgZWxlbWVudEIsIGRhdGFUeXBlKXtcbiAgICBzd2l0Y2ggKGRhdGFUeXBlKXtcbiAgICAgIGNhc2UgJ2RhdGEnOlxuICAgICAgICByZXR1cm4gZWxlbWVudEFbMF0gLSBlbGVtZW50QlswXTtcbiAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgIHJldHVybiBlbGVtZW50QS50cyAtIGVsZW1lbnRCLnRzO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICBcbiAgZ2V0T2xkRGF0YShkYXRhVHlwZSl7XG4gICAgcmV0dXJuIHRoaXNbJ2NoYXJ0XycrZGF0YVR5cGUudG9Mb3dlckNhc2UoKV07XG4gIH1cbiAgXG4gIHJlcGxhY2VEYXRhKGRhdGEsIGRhdGFUeXBlKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXNbJ2NoYXJ0XycrZGF0YVR5cGUudG9Mb3dlckNhc2UoKV0gPSBkYXRhO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZURhdGFUeXBlKGRhdGEsIGRhdGFUeXBlKTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiAodGhpcy5yZXBsYWNlQ2FsbGJhY2spID8gdGhpcy5yZXBsYWNlQ2FsbGJhY2sodGhpcy5jaGFydCwgZGF0YSwgdGhpcy5pc0xvYWRlZCwgZGF0YVR5cGUpIDogbnVsbDtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgcmVwbGFjZURhdGFUeXBlKGRhdGEsIGRhdGFUeXBlKXtcbiAgICBzd2l0Y2ggKGRhdGFUeXBlKXtcbiAgICAgIGNhc2UgJ2RhdGEnOlxuICAgICAgICBpZiAodGhpcy5hc3luY1VybCl7XG4gICAgICAgICAgY3BCb290c3RyYXAubG9vcChbJ2J0Yy1iaXRjb2luJywgJ2V0aC1ldGhlcmV1bSddLCBjb2luTmFtZSA9PiB7XG4gICAgICAgICAgICBsZXQgY29pblNob3J0ID0gY29pbk5hbWUuc3BsaXQoJy0nKVswXTtcbiAgICAgICAgICAgIGlmICh0aGlzLmFzeW5jVXJsLnNlYXJjaChjb2luTmFtZSkgPiAtMSAmJiBkYXRhW2NvaW5TaG9ydF0pIHtcbiAgICAgICAgICAgICAgZGF0YVtjb2luU2hvcnRdID0gW107XG4gICAgICAgICAgICAgIGNwQm9vdHN0cmFwLmxvb3AodGhpcy5jaGFydC5zZXJpZXMsIHNlcmllcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHNlcmllcy51c2VyT3B0aW9ucy5pZCA9PT0gY29pblNob3J0KSBzZXJpZXMudXBkYXRlKHsgdmlzaWJsZTogZmFsc2UgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjcEJvb3RzdHJhcC5sb29wKE9iamVjdC5lbnRyaWVzKGRhdGEpLCAodmFsdWUpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5pc0V4Y2x1ZGVkKHZhbHVlWzBdKSkgcmV0dXJuO1xuICAgICAgICAgIHJldHVybiAodGhpcy5jaGFydC5nZXQodmFsdWVbMF0pKSA/IHRoaXMuY2hhcnQuZ2V0KHZhbHVlWzBdKS5zZXREYXRhKHZhbHVlWzFdLCBmYWxzZSwgZmFsc2UsIGZhbHNlKSA6IHRoaXMuY2hhcnQuYWRkU2VyaWVzKHtpZDogdmFsdWVbMF0sIGRhdGE6IHZhbHVlWzFdLCBzaG93SW5OYXZpZ2F0b3I6IHRydWV9KTtcbiAgICAgICAgfSk7XG4gICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcCh0aGlzLmNoYXJ0LmFubm90YXRpb25zLmFsbEl0ZW1zLCBhbm5vdGF0aW9uID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhbm5vdGF0aW9uLmRlc3Ryb3koKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNldEFubm90YXRpb25zT2JqZWN0cyhkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIFxuICBpc0V4Y2x1ZGVkKGxhYmVsKXtcbiAgICByZXR1cm4gdGhpcy5leGNsdWRlU2VyaWVzSWRzLmluZGV4T2YobGFiZWwpID4gLTE7XG4gIH1cbiAgXG4gIHRvb2x0aXBGb3JtYXR0ZXIocG9pbnRlciwgbGFiZWwgPSAnJywgc2VhcmNoKXtcbiAgICBpZiAoIXNlYXJjaCkgc2VhcmNoID0gbGFiZWw7XG4gICAgY29uc3QgaGVhZGVyID0gJzxkaXYgY2xhc3M9XCJjcC1jaGFydC10b29sdGlwLWN1cnJlbmN5XCI+PHNtYWxsPicrbmV3IERhdGUocG9pbnRlci54KS50b1VUQ1N0cmluZygpKyc8L3NtYWxsPjx0YWJsZT4nO1xuICAgIGNvbnN0IGZvb3RlciA9ICc8L3RhYmxlPjwvZGl2Pic7XG4gICAgbGV0IGNvbnRlbnQgPSAnJztcbiAgICBwb2ludGVyLnBvaW50cy5mb3JFYWNoKHBvaW50ID0+IHtcbiAgICAgIGNvbnRlbnQgKz0gJzx0cj4nICtcbiAgICAgICAgJzx0ZD4nICtcbiAgICAgICAgJzxzdmcgd2lkdGg9XCI1XCIgaGVpZ2h0PVwiNVwiPjxyZWN0IHg9XCIwXCIgeT1cIjBcIiB3aWR0aD1cIjVcIiBoZWlnaHQ9XCI1XCIgZmlsbD1cIicrcG9pbnQuc2VyaWVzLmNvbG9yKydcIiBmaWxsLW9wYWNpdHk9XCIxXCI+PC9yZWN0Pjwvc3ZnPicgK1xuICAgICAgICBwb2ludC5zZXJpZXMubmFtZSArICc6ICcgKyBwb2ludC55LnRvTG9jYWxlU3RyaW5nKCdydS1SVScsIHsgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiA4IH0pICsgJyAnICsgKChwb2ludC5zZXJpZXMubmFtZS50b0xvd2VyQ2FzZSgpLnNlYXJjaChzZWFyY2gudG9Mb3dlckNhc2UoKSkgPiAtMSkgPyBcIlwiIDogbGFiZWwpICtcbiAgICAgICAgJzwvdGQ+JyArXG4gICAgICAgICc8L3RyPic7XG4gICAgfSk7XG4gICAgcmV0dXJuIGhlYWRlciArIGNvbnRlbnQgKyBmb290ZXI7XG4gIH1cbiAgXG4gIHNldEFubm90YXRpb25zT2JqZWN0cyhkYXRhKXtcbiAgICB0aGlzLmNoYXJ0LnNlcmllc1swXS54QXhpcy5yZW1vdmVQbG90TGluZSgpO1xuICAgIGxldCBwbG90TGluZXMgPSBbXTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGRhdGEuc29ydCgoZGF0YTEsIGRhdGEyKSA9PiB7XG4gICAgICAgIHJldHVybiBkYXRhMi50cyAtIGRhdGExLnRzO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gY3BCb290c3RyYXAubG9vcChkYXRhLCBlbGVtZW50ID0+IHtcbiAgICAgICAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHBsb3RMaW5lcy5wdXNoKHtcbiAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgdmFsdWU6IGVsZW1lbnQudHMsXG4gICAgICAgICAgICBkYXNoU3R5bGU6ICdzb2xpZCcsXG4gICAgICAgICAgICB6SW5kZXg6IDQsXG4gICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRFdmVudFRhZ1BhcmFtcygpLmNvbG9yLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY2hhcnQuYWRkQW5ub3RhdGlvbih7XG4gICAgICAgICAgICB4VmFsdWU6IGVsZW1lbnQudHMsXG4gICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgdGl0bGU6IGA8c3BhbiB0aXRsZT1cIkNsaWNrIHRvIG9wZW5cIiBjbGFzcz1cImNwLWNoYXJ0LWFubm90YXRpb25fX3RleHRcIj4keyB0aGlzLmdldEV2ZW50VGFnUGFyYW1zKGVsZW1lbnQudGFnKS5sYWJlbCB9PC9zcGFuPjxzcGFuIGNsYXNzPVwiY3AtY2hhcnQtYW5ub3RhdGlvbl9fZGF0YUVsZW1lbnRcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+JHsgSlNPTi5zdHJpbmdpZnkoZWxlbWVudCkgfTwvc3Bhbj5gLFxuICAgICAgICAgICAgc2hhcGU6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ2NpcmNsZScsXG4gICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIHI6IDExLFxuICAgICAgICAgICAgICAgIGN4OiA5LFxuICAgICAgICAgICAgICAgIGN5OiAxMC41LFxuICAgICAgICAgICAgICAgICdzdHJva2Utd2lkdGgnOiAxLjUsXG4gICAgICAgICAgICAgICAgZmlsbDogdGhpcy5nZXRFdmVudFRhZ1BhcmFtcygpLmNvbG9yLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICBtb3VzZW92ZXI6IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChNb2JpbGVEZXRlY3QuaXNNb2JpbGUoKSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gdGhpcy5nZXRFdmVudERhdGFGcm9tQW5ub3RhdGlvbkV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5FdmVudENvbnRhaW5lcihkYXRhLCBldmVudCk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG1vdXNlb3V0OiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKE1vYmlsZURldGVjdC5pc01vYmlsZSgpKSByZXR1cm47XG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZUV2ZW50Q29udGFpbmVyKGV2ZW50KTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gdGhpcy5nZXRFdmVudERhdGFGcm9tQW5ub3RhdGlvbkV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgICAgICBpZiAoTW9iaWxlRGV0ZWN0LmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMub3BlbkV2ZW50Q29udGFpbmVyKGRhdGEsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuRXZlbnRQYWdlKGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNoYXJ0LnNlcmllc1swXS54QXhpcy51cGRhdGUoe1xuICAgICAgICBwbG90TGluZXMsXG4gICAgICB9LCBmYWxzZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHNldE5hdmlnYXRvcihvcHRpb25zKXtcbiAgICBsZXQgbmF2aWdhdG9yT3B0aW9ucyA9IHt9O1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBpZiAob3B0aW9ucy5uYXZpZ2F0b3IgPT09IHRydWUpe1xuICAgICAgICBuYXZpZ2F0b3JPcHRpb25zID0ge1xuICAgICAgICAgIG5hdmlnYXRvcjoge1xuICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgbWFyZ2luOiAyMCxcbiAgICAgICAgICAgIHNlcmllczoge1xuICAgICAgICAgICAgICBsaW5lV2lkdGg6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWFza0ZpbGw6ICdyZ2JhKDEwMiwxMzMsMTk0LDAuMTUpJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgICB6b29tVHlwZTogJ3gnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgeEF4aXM6IHtcbiAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICBzZXRFeHRyZW1lczogKGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoKGUudHJpZ2dlciA9PT0gJ25hdmlnYXRvcicgfHwgZS50cmlnZ2VyID09PSAnem9vbScpICYmIGUubWluICYmIGUubWF4KSB7XG4gICAgICAgICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCh0aGlzLmlkKydTZXRFeHRyZW1lcycsIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgbWluRGF0ZTogZS5taW4sXG4gICAgICAgICAgICAgICAgICAgICAgbWF4RGF0ZTogZS5tYXgsXG4gICAgICAgICAgICAgICAgICAgICAgZSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5uYXZpZ2F0b3JFeHRyZW1lc0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuc2V0UmVzZXRab29tQnV0dG9uKCk7XG4gICAgICB9IGVsc2UgaWYgKCFvcHRpb25zLm5hdmlnYXRvcikge1xuICAgICAgICBuYXZpZ2F0b3JPcHRpb25zID0ge1xuICAgICAgICAgIG5hdmlnYXRvcjoge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjcEJvb3RzdHJhcC51cGRhdGVPYmplY3Qob3B0aW9ucywgbmF2aWdhdG9yT3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHNldFJlc2V0Wm9vbUJ1dHRvbigpe1xuICAgIC8vIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTsgLy8gY2FudCBiZSBwb3NpdGlvbmVkIHByb3Blcmx5IGluIHBsb3RCb3gsIHNvIGl0cyBkaXNhYmxlZFxuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5hZGRDb250YWluZXIodGhpcy5pZCwgJ1Jlc2V0Wm9vbScsICdjcC1jaGFydC1yZXNldC16b29tJywgJ2J1dHRvbicpXG4gICAgfSk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRDb250YWluZXIoJ1Jlc2V0Wm9vbScpO1xuICAgIH0pO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKGVsZW1lbnQpID0+IHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgndWstYnV0dG9uJyk7XG4gICAgICBlbGVtZW50LmlubmVyVGV4dCA9ICdSZXNldCB6b29tJztcbiAgICAgIHJldHVybiBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICB0aGlzLmNoYXJ0Lnpvb21PdXQoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG4gIFxuICBuYXZpZ2F0b3JFeHRyZW1lc0xpc3RlbmVyKCkge1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmlkICsgJ1NldEV4dHJlbWVzJywgKGUpID0+IHtcbiAgICAgICAgbGV0IG1pbkRhdGUgPSBjcEJvb3RzdHJhcC5yb3VuZChlLmRldGFpbC5taW5EYXRlIC8gMTAwMCwgMCk7XG4gICAgICAgIGxldCBtYXhEYXRlID0gY3BCb290c3RyYXAucm91bmQoZS5kZXRhaWwubWF4RGF0ZSAvIDEwMDAsIDApO1xuICAgICAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5mZXRjaERhdGFQYWNrYWdlKG1pbkRhdGUsIG1heERhdGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgZ2V0TmF2aWdhdG9yRXh0cmVtZXNVcmwobWluRGF0ZSwgbWF4RGF0ZSwgZGF0YVR5cGUpe1xuICAgIGxldCBleHRyZW1lc0RhdGFVcmwgPSAoZGF0YVR5cGUpID8gdGhpcy5nZXRFeHRyZW1lc0RhdGFVcmwodGhpcy5pZCwgZGF0YVR5cGUpIDogdGhpcy5leHRyZW1lc0RhdGFVcmw7XG4gICAgcmV0dXJuIChtaW5EYXRlICYmIG1heERhdGUgJiYgZXh0cmVtZXNEYXRhVXJsKSA/IGV4dHJlbWVzRGF0YVVybCArJy9kYXRlcy8nK21pbkRhdGUrJy8nK21heERhdGUrJy8nIDogbnVsbDtcbiAgfVxuICBcbiAgc2V0Tm9EYXRhTGFiZWwob3B0aW9ucyl7XG4gICAgbGV0IG5vRGF0YU9wdGlvbnMgPSB7fTtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgbm9EYXRhT3B0aW9ucyA9IHtcbiAgICAgICAgbGFuZzoge1xuICAgICAgICAgIG5vRGF0YTogJ1dlIGRvblxcJ3QgaGF2ZSBkYXRhIGZvciB0aGlzIHRpbWUgcGVyaW9kJ1xuICAgICAgICB9LFxuICAgICAgICBub0RhdGE6IHtcbiAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgZm9udEZhbWlseTogJ0FyaWFsJyxcbiAgICAgICAgICAgIGZvbnRTaXplOiAnMTRweCcsXG4gICAgICAgICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLnVwZGF0ZU9iamVjdChvcHRpb25zLCBub0RhdGFPcHRpb25zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgYWRkQ29udGFpbmVyKGlkLCBsYWJlbCwgY2xhc3NOYW1lLCB0YWdOYW1lID0gJ2Rpdicpe1xuICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xuICAgIGxldCBjaGFydENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICBjb250YWluZXIuaWQgPSBpZCArIGxhYmVsO1xuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgY2hhcnRDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgfVxuICBcbiAgZ2V0Q29udGFpbmVyKGxhYmVsKXtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCtsYWJlbCk7XG4gIH1cbiAgXG4gIGdldEV4dHJlbWVzRGF0YVVybChpZCwgZGF0YVR5cGUgPSAnZGF0YScpe1xuICAgIHJldHVybiAnL2N1cnJlbmN5LycrIGRhdGFUeXBlICsnLycrIHRoaXMuY3VycmVuY3k7XG4gIH1cbiAgXG4gIGdldFZvbHVtZVBhdHRlcm4oKXtcbiAgICByZXR1cm4ge1xuICAgICAgZGVmczoge1xuICAgICAgICBwYXR0ZXJuczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdpZCc6ICdmaWxsLXZvbHVtZS1jaGFydCcsXG4gICAgICAgICAgICAncGF0aCc6IHtcbiAgICAgICAgICAgICAgZDogJ00gMyAwIEwgMyAxMCBNIDggMCBMIDggMTAnLFxuICAgICAgICAgICAgICBzdHJva2U6IFwiI2UzZTNlM1wiLFxuICAgICAgICAgICAgICBmaWxsOiAnI2YxZjFmMScsXG4gICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdpZCc6ICdmaWxsLXZvbHVtZS1jaGFydC1uaWdodCcsXG4gICAgICAgICAgICAncGF0aCc6IHtcbiAgICAgICAgICAgICAgZDogJ00gMyAwIEwgMyAxMCBNIDggMCBMIDggMTAnLFxuICAgICAgICAgICAgICBzdHJva2U6IFwiIzliOWI5YlwiLFxuICAgICAgICAgICAgICBmaWxsOiAnIzM4MzgzOCcsXG4gICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG5cbmNsYXNzIGJvb3RzdHJhcENsYXNzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbXB0eVZhbHVlID0gMDtcbiAgICB0aGlzLmVtcHR5RGF0YSA9ICctJztcbiAgfVxuICBcbiAgbm9kZUxpc3RUb0FycmF5KG5vZGVMaXN0KSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG5vZGVMaXN0KTtcbiAgfVxuICBcbiAgcGFyc2VJbnRlcnZhbFZhbHVlKHZhbHVlKSB7XG4gICAgbGV0IHRpbWVTeW1ib2wgPSAnJywgbXVsdGlwbGllciA9IDE7XG4gICAgaWYgKHZhbHVlLnNlYXJjaCgncycpID4gLTEpIHtcbiAgICAgIHRpbWVTeW1ib2wgPSAncyc7XG4gICAgICBtdWx0aXBsaWVyID0gMTAwMDtcbiAgICB9XG4gICAgaWYgKHZhbHVlLnNlYXJjaCgnbScpID4gLTEpIHtcbiAgICAgIHRpbWVTeW1ib2wgPSAnbSc7XG4gICAgICBtdWx0aXBsaWVyID0gNjAgKiAxMDAwO1xuICAgIH1cbiAgICBpZiAodmFsdWUuc2VhcmNoKCdoJykgPiAtMSkge1xuICAgICAgdGltZVN5bWJvbCA9ICdoJztcbiAgICAgIG11bHRpcGxpZXIgPSA2MCAqIDYwICogMTAwMDtcbiAgICB9XG4gICAgaWYgKHZhbHVlLnNlYXJjaCgnZCcpID4gLTEpIHtcbiAgICAgIHRpbWVTeW1ib2wgPSAnZCc7XG4gICAgICBtdWx0aXBsaWVyID0gMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUucmVwbGFjZSh0aW1lU3ltYm9sLCAnJykpICogbXVsdGlwbGllcjtcbiAgfVxuICBcbiAgdXBkYXRlT2JqZWN0KG9iaiwgbmV3T2JqKSB7XG4gICAgbGV0IHJlc3VsdCA9IG9iajtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIGNwQm9vdHN0cmFwLmxvb3AoT2JqZWN0LmtleXMobmV3T2JqKSwga2V5ID0+IHtcbiAgICAgICAgaWYgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHR5cGVvZiByZXN1bHRba2V5XSA9PT0gJ29iamVjdCcpe1xuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZU9iamVjdChyZXN1bHRba2V5XSwgbmV3T2JqW2tleV0pLnRoZW4oKHVwZGF0ZVJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB1cGRhdGVSZXN1bHQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdFtrZXldID0gbmV3T2JqW2tleV07XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuICBcbiAgcGFyc2VOdW1iZXIobnVtYmVyKSB7XG4gICAgaWYgKCFudW1iZXIgJiYgbnVtYmVyICE9PSAwKSByZXR1cm4gbnVtYmVyO1xuICAgIGlmIChudW1iZXIgPT09IHRoaXMuZW1wdHlWYWx1ZSB8fCBudW1iZXIgPT09IHRoaXMuZW1wdHlEYXRhKSByZXR1cm4gbnVtYmVyO1xuICAgIG51bWJlciA9IHBhcnNlRmxvYXQobnVtYmVyKTtcbiAgICBpZiAobnVtYmVyID4gMTAwMDAwKSB7XG4gICAgICBsZXQgbnVtYmVyU3RyID0gbnVtYmVyLnRvRml4ZWQoMCk7XG4gICAgICBsZXQgcGFyYW1ldGVyID0gJ0snLFxuICAgICAgICBzcGxpY2VkID0gbnVtYmVyU3RyLnNsaWNlKDAsIG51bWJlclN0ci5sZW5ndGggLSAxKTtcbiAgICAgIGlmIChudW1iZXIgPiAxMDAwMDAwMDAwKSB7XG4gICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDcpO1xuICAgICAgICBwYXJhbWV0ZXIgPSAnQic7XG4gICAgICB9IGVsc2UgaWYgKG51bWJlciA+IDEwMDAwMDApIHtcbiAgICAgICAgc3BsaWNlZCA9IG51bWJlclN0ci5zbGljZSgwLCBudW1iZXJTdHIubGVuZ3RoIC0gNCk7XG4gICAgICAgIHBhcmFtZXRlciA9ICdNJztcbiAgICAgIH1cbiAgICAgIGxldCBuYXR1cmFsID0gc3BsaWNlZC5zbGljZSgwLCBzcGxpY2VkLmxlbmd0aCAtIDIpO1xuICAgICAgbGV0IGRlY2ltYWwgPSBzcGxpY2VkLnNsaWNlKHNwbGljZWQubGVuZ3RoIC0gMik7XG4gICAgICByZXR1cm4gbmF0dXJhbCArICcuJyArIGRlY2ltYWwgKyAnICcgKyBwYXJhbWV0ZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBpc0RlY2ltYWwgPSAobnVtYmVyICUgMSkgPiAwO1xuICAgICAgaWYgKGlzRGVjaW1hbCkge1xuICAgICAgICBsZXQgcHJlY2lzaW9uID0gMjtcbiAgICAgICAgaWYgKG51bWJlciA8IDEpIHtcbiAgICAgICAgICBwcmVjaXNpb24gPSA4O1xuICAgICAgICB9IGVsc2UgaWYgKG51bWJlciA8IDEwKSB7XG4gICAgICAgICAgcHJlY2lzaW9uID0gNjtcbiAgICAgICAgfSBlbHNlIGlmIChudW1iZXIgPCAxMDAwKSB7XG4gICAgICAgICAgcHJlY2lzaW9uID0gNDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5yb3VuZChudW1iZXIsIHByZWNpc2lvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVtYmVyLnRvRml4ZWQoMik7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICByb3VuZChhbW91bnQsIGRlY2ltYWwsIGRpcmVjdGlvbikge1xuICAgIGFtb3VudCA9IHBhcnNlRmxvYXQoYW1vdW50KTtcbiAgICBpZiAoIWRlY2ltYWwpIGRlY2ltYWwgPSA4O1xuICAgIGlmICghZGlyZWN0aW9uKSBkaXJlY3Rpb24gPSAncm91bmQnO1xuICAgIGRlY2ltYWwgPSBNYXRoLnBvdygxMCwgZGVjaW1hbCk7XG4gICAgcmV0dXJuIE1hdGhbZGlyZWN0aW9uXShhbW91bnQgKiBkZWNpbWFsKSAvIGRlY2ltYWw7XG4gIH1cbiAgXG4gIGxvb3AoYXJyLCBmbiwgYnVzeSwgZXJyLCBpID0gMCkge1xuICAgIGNvbnN0IGJvZHkgPSAob2ssIGVyKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByID0gZm4oYXJyW2ldLCBpLCBhcnIpO1xuICAgICAgICByICYmIHIudGhlbiA/IHIudGhlbihvaykuY2F0Y2goZXIpIDogb2socilcbiAgICAgIH1cbiAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGVyKGUpXG4gICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBuZXh0ID0gKG9rLCBlcikgPT4gKCkgPT4gdGhpcy5sb29wKGFyciwgZm4sIG9rLCBlciwgKytpKTtcbiAgICBjb25zdCBydW4gPSAob2ssIGVyKSA9PiBpIDwgYXJyLmxlbmd0aCA/IG5ldyBQcm9taXNlKGJvZHkpLnRoZW4obmV4dChvaywgZXIpKS5jYXRjaChlcikgOiBvaygpO1xuICAgIHJldHVybiBidXN5ID8gcnVuKGJ1c3ksIGVycikgOiBuZXcgUHJvbWlzZShydW4pXG4gIH1cbn1cblxuY2xhc3MgZmV0Y2hDbGFzcyB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5zdGF0ZSA9IHt9O1xuICB9XG4gIFxuICBmZXRjaFNjcmlwdCh1cmwpIHtcbiAgICBpZiAodGhpcy5zdGF0ZVt1cmxdKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgIHRoaXMuc3RhdGVbdXJsXSA9ICdwZW5kaW5nJztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUpIHRoaXMuc3RhdGVbdXJsXSA9ICdkb3dubG9hZGVkJztcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlKSBkZWxldGUgdGhpcy5zdGF0ZVt1cmxdO1xuICAgICAgICByZWplY3QobmV3IEVycm9yKGBGYWlsZWQgdG8gbG9hZCBpbWFnZSdzIFVSTDogJHt1cmx9YCkpO1xuICAgICAgfSk7XG4gICAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xuICAgICAgc2NyaXB0LnNyYyA9IHVybDtcbiAgICB9KTtcbiAgfVxuICBcbiAgZmV0Y2hTdHlsZSh1cmwpIHtcbiAgICBpZiAodGhpcy5zdGF0ZVt1cmxdKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgIHRoaXMuc3RhdGVbdXJsXSA9ICdwZW5kaW5nJztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdyZWwnLCAnc3R5bGVzaGVldCcpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgdXJsKTtcbiAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUpIHRoaXMuc3RhdGVbdXJsXSA9ICdkb3dubG9hZGVkJztcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSkgZGVsZXRlIHRoaXMuc3RhdGVbdXJsXTtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgRmFpbGVkIHRvIGxvYWQgc3R5bGUgVVJMOiAke3VybH1gKSk7XG4gICAgICB9KTtcbiAgICAgIGxpbmsuaHJlZiA9IHVybDtcbiAgICB9KTtcbiAgfVxuICBcbiAgZmV0Y2hDaGFydERhdGEodXJpLCBmcm9tU3RhdGUgPSBmYWxzZSl7XG4gICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vZ3JhcGhzLmNvaW5wYXByaWthLmNvbScgKyB1cmk7XG4gICAgcmV0dXJuIHRoaXMuZmV0Y2hEYXRhKHVybCwgZnJvbVN0YXRlKTtcbiAgfVxuICBcbiAgZmV0Y2hEYXRhKHVybCwgZnJvbVN0YXRlKXtcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKGZyb21TdGF0ZSl7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlW3VybF0gPT09ICdwZW5kaW5nJyl7XG4gICAgICAgICAgbGV0IHByb21pc2VUaW1lb3V0ID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIHJlc29sdmUodGhpcy5mZXRjaERhdGEodXJsLCBmcm9tU3RhdGUpKTtcbiAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHByb21pc2VUaW1lb3V0O1xuICAgICAgICB9XG4gICAgICAgIGlmICghIXRoaXMuc3RhdGVbdXJsXSl7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLnN0YXRlW3VybF0uY2xvbmUoKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBwcm9taXNlRmV0Y2ggPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIHByb21pc2VGZXRjaCA9IHByb21pc2VGZXRjaC50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5zdGF0ZVt1cmxdID0gJ3BlbmRpbmcnO1xuICAgICAgICByZXR1cm4gZmV0Y2godXJsKTtcbiAgICAgIH0pO1xuICAgICAgcHJvbWlzZUZldGNoID0gcHJvbWlzZUZldGNoLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIHRoaXMuc3RhdGVbdXJsXSA9IHJlc3BvbnNlO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuY2xvbmUoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHByb21pc2VGZXRjaDtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxufVxuXG5uZXcgd2lkZ2V0c0NvbnRyb2xsZXIoKTtcbmNvbnN0IGNwQm9vdHN0cmFwID0gbmV3IGJvb3RzdHJhcENsYXNzKCk7XG5jb25zdCBmZXRjaFNlcnZpY2UgPSBuZXcgZmV0Y2hDbGFzcygpOyJdfQ==
