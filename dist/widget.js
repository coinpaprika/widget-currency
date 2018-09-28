(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bootstrapClass = function () {
  function bootstrapClass() {
    _classCallCheck(this, bootstrapClass);

    this.emptyValue = 0;
    this.emptyData = '-';
  }

  _createClass(bootstrapClass, [{
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
          return this.roundAmount(number, precision);
        } else {
          return number.toFixed(2);
        }
      }
    }
  }, {
    key: 'roundAmount',
    value: function roundAmount(amount, decimal, direction) {
      amount = parseFloat(amount);
      if (!decimal) decimal = 8;
      if (!direction) direction = 'round';
      decimal = Math.pow(10, decimal);
      return Math[direction](amount * decimal) / decimal;
    }
  }, {
    key: 'loop',
    value: function loop(arr, fn, busy, err) {
      var _this = this;

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
          return _this.loop(arr, fn, ok, er, ++i);
        };
      };
      var run = function run(ok, er) {
        return i < arr.length ? new Promise(body).then(next(ok, er)).catch(er) : ok();
      };
      return busy ? run(busy, err) : new Promise(run);
    }
  }, {
    key: 'getScript',
    value: function getScript(index, url, state) {
      if (state[url]) return;
      state[url] = 'pending';
      return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        document.body.appendChild(script);
        script.onload = function () {
          state[url] = 'downloaded';
          return resolve;
        };
        script.onerror = function () {
          delete state[url];
          return reject;
        };
        script.async = true;
        script.src = url;
      });
    }
  }]);

  return bootstrapClass;
}();

var widgetsClass = function () {
  function widgetsClass() {
    _classCallCheck(this, widgetsClass);

    this.bootstrap = new bootstrapClass();
    this.states = [];
    this.defaults = {
      objectName: 'cpCurrencyWidgets',
      className: 'coinpaprika-currency-widget',
      cssFileName: 'widget.min.css',
      currency: 'btc-bitcoin',
      primary_currency: 'USD',
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
      if (!this.getMainElement(index)) {
        return console.error('Bind failed, no element with class = "' + this.defaults.className + '"');
      }
      this.getDefaults(index);
      this.setOriginLink(index);
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
      var mainElement = this.getMainElement(index);
      if (mainElement && mainElement.dataset) {
        if (mainElement.dataset.modules) this.updateData(index, 'modules', JSON.parse(mainElement.dataset.modules));
        if (mainElement.dataset.primaryCurrency) this.updateData(index, 'primary_currency', mainElement.dataset.primaryCurrency);
        if (mainElement.dataset.currency) this.updateData(index, 'currency', mainElement.dataset.currency);
        if (mainElement.dataset.showDetailsCurrency) this.updateData(index, 'show_details_currency', mainElement.dataset.showDetailsCurrency === 'true');
        if (mainElement.dataset.updateActive) this.updateData(index, 'update_active', mainElement.dataset.updateActive === 'true');
        if (mainElement.dataset.updateTimeout) this.updateData(index, 'update_timeout', this.bootstrap.parseIntervalValue(mainElement.dataset.updateTimeout));
        if (mainElement.dataset.language) this.updateData(index, 'language', mainElement.dataset.language);
        if (mainElement.dataset.originSrc) this.updateData(index, 'origin_src', mainElement.dataset.originSrc);
        if (mainElement.dataset.nodeModulesSrc) this.updateData(index, 'node_modules_src', mainElement.dataset.nodeModulesSrc);
        if (mainElement.dataset.bowerSrc) this.updateData(index, 'bower_src', mainElement.dataset.bowerSrc);
        if (mainElement.dataset.styleSrc) this.updateData(index, 'style_src', mainElement.dataset.styleSrc);
        if (mainElement.dataset.langSrc) this.updateData(index, 'logo_src', mainElement.dataset.langSrc);
        if (mainElement.dataset.imgSrc) this.updateData(index, 'logo_src', mainElement.dataset.imgSrc);
      }
    }
  }, {
    key: 'setOriginLink',
    value: function setOriginLink(index) {
      var _this2 = this;

      if (Object.keys(this.defaults.translations).length === 0) this.getTranslations(this.defaults.language);
      this.stylesheet();
      setTimeout(function () {
        _this2.addWidgetElement(index);
        _this2.initInterval(index);
      }, 100);
    }
  }, {
    key: 'addWidgetElement',
    value: function addWidgetElement(index) {
      var mainElement = this.getMainElement(index);
      if (mainElement) {

        var modules = this.widgetChartElement(index) + this.widgetMarketDetailsElement(index);
        var widgetElement = this.widgetMainElement(index) + modules + this.widgetFooter(index);
        mainElement.innerHTML = widgetElement;
      }
      this.setBeforeElementInFooter(index);
      this.getData(index);
    }
  }, {
    key: 'getData',
    value: function getData(index) {
      var _this3 = this;

      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://api.coinpaprika.com/v1/widget/' + this.states[index].currency + '?quote=' + this.states[index].primary_currency);
      xhr.onload = function () {
        if (xhr.status === 200) {
          if (!_this3.states[index].isData) _this3.updateData(index, 'isData', true);
          _this3.updateTicker(index, JSON.parse(xhr.responseText));
        } else {
          _this3.onErrorRequest(index, xhr);
        }
      };
      xhr.onerror = function () {
        _this3.onErrorRequest(index, xhr);
      };
      xhr.send();
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
      var _this4 = this;

      clearInterval(this.states[index].interval);
      if (this.states[index].update_active && this.states[index].update_timeout > 1000) {
        this.states[index].interval = setInterval(function () {
          _this4.getData(index);
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
                value = this.bootstrap.emptyData;
              } else {
                updateElement.classList.add(className);
                value = key === 'price_change_24h' ? '(' + this.bootstrap.roundAmount(value, 2) + '%)' : this.bootstrap.roundAmount(value, 2) + '%';
              }
            }
            if (updateElement.classList.contains('showDetailsCurrency') && !state.show_details_currency) {
              value = ' ';
            }
            if (updateElement.classList.contains('parseNumber')) {
              updateElement.innerText = this.bootstrap.parseNumber(value) || this.bootstrap.emptyData;
            } else {
              updateElement.innerText = value || this.bootstrap.emptyData;
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
      var _this5 = this;

      this.defaults.translations[lang] = data;

      var _loop = function _loop(x) {
        var isNoTranslationLabelsUpdate = _this5.states[x].noTranslationLabels.length > 0 && lang === 'en';
        if (_this5.states[x].language === lang || isNoTranslationLabelsUpdate) {
          (function () {
            var mainElement = _this5.states[x].mainElement;
            var transalteElements = Array.prototype.slice.call(mainElement.querySelectorAll('.cp-translation'));

            var _loop2 = function _loop2(y) {
              transalteElements[y].classList.forEach(function (className) {
                if (className.search('translation_') > -1) {
                  var translateKey = className.replace('translation_', '');
                  if (translateKey === 'message') translateKey = _this5.states[x].message;
                  var labelIndex = _this5.states[x].noTranslationLabels.indexOf(translateKey);
                  var text = _this5.getTranslation(x, translateKey);
                  if (labelIndex > -1 && text) {
                    _this5.states[x].noTranslationLabels.splice(labelIndex, 1);
                  }
                  transalteElements[y].innerText = text;
                  if (transalteElements[y].closest('.cp-widget__footer')) {
                    setTimeout(_this5.setBeforeElementInFooter.bind(null, x), 50);
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
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', url);
        return document.body.querySelector('link[href="' + url + '"]') ? '' : document.body.appendChild(link);
      }
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
      return '<h3><a href="' + this.coin_link(data.currency) + '">' + '<span class="nameTicker">' + (data.ticker.name || this.bootstrap.emptyData) + '</span>' + '<span class="symbolTicker">' + (data.ticker.symbol || this.bootstrap.emptyData) + '</span>' + '</a></h3>' + '<strong>' + '<span class="priceTicker parseNumber">' + (this.bootstrap.parseNumber(data.ticker.price) || this.bootstrap.emptyData) + '</span> ' + '<span class="primaryCurrency">' + data.primary_currency + ' </span>' + '<span class="price_change_24hTicker cp-widget__rank cp-widget__rank-' + (data.ticker.price_change_24h > 0 ? "up" : data.ticker.price_change_24h < 0 ? "down" : "neutral") + '">(' + (this.bootstrap.roundAmount(data.ticker.price_change_24h, 2) || this.bootstrap.emptyValue) + '%)</span>' + '</strong>' + '<span class="cp-widget__rank-label"><span class="cp-translation translation_rank">' + this.getTranslation(index, "rank") + '</span> <span class="rankTicker">' + (data.ticker.rank || this.bootstrap.emptyData) + '</span></span>';
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
      return this.states[index].modules.indexOf('market_details') > -1 ? '<div class="cp-widget__details">' + this.widgetAthElement(index) + this.widgetVolume24hElement(index) + this.widgetMarketCapElement(index) + '</div>' : '';
    }
  }, {
    key: 'widgetAthElement',
    value: function widgetAthElement(index) {
      return '<div>' + '<small class="cp-translation translation_ath">' + this.getTranslation(index, "ath") + '</small>' + '<div>' + '<span class="price_athTicker parseNumber">' + this.bootstrap.emptyData + ' </span>' + '<span class="symbolTicker showDetailsCurrency"></span>' + '</div>' + '<span class="percent_from_price_athTicker cp-widget__rank">' + this.bootstrap.emptyData + '</span>' + '</div>';
    }
  }, {
    key: 'widgetVolume24hElement',
    value: function widgetVolume24hElement(index) {
      return '<div>' + '<small class="cp-translation translation_volume_24h">' + this.getTranslation(index, "volume_24h") + '</small>' + '<div>' + '<span class="volume_24hTicker parseNumber">' + this.bootstrap.emptyData + ' </span>' + '<span class="symbolTicker showDetailsCurrency"></span>' + '</div>' + '<span class="volume_24h_change_24hTicker cp-widget__rank">' + this.bootstrap.emptyData + '</span>' + '</div>';
    }
  }, {
    key: 'widgetMarketCapElement',
    value: function widgetMarketCapElement(index) {
      return '<div>' + '<small class="cp-translation translation_market_cap">' + this.getTranslation(index, "market_cap") + '</small>' + '<div>' + '<span class="market_capTicker parseNumber">' + this.bootstrap.emptyData + ' </span>' + '<span class="symbolTicker showDetailsCurrency"></span>' + '</div>' + '<span class="market_cap_change_24hTicker cp-widget__rank">' + this.bootstrap.emptyData + '</span>' + '</div>';
    }
  }, {
    key: 'widgetChartElement',
    value: function widgetChartElement(index) {
      var _this6 = this;

      var promise = Promise.resolve();
      promise = promise.then(function () {
        return !window.Highcharts ? _this6.bootstrap.getScript(index, 'https://code.highcharts.com/highcharts.js', _this6.defaults.scriptsDownloaded) : null;
      });
      promise = promise.then(function (result) {
        console.log('widgetChartElement', { result: result });
        return _this6.states[index].modules.indexOf('chart') > -1 ? '<div class="cp-widget__chart">' + 'CHART' + '</div>' : '';
      });
      return promise;
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
      var _this7 = this;

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
        newImg.src = _this7.img_src(data.currency);
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
      var _this8 = this;

      if (!this.defaults.translations[lang]) {
        var xhr = new XMLHttpRequest();
        var url = this.defaults.lang_src || this.defaults.origin_src + '/dist/lang';
        xhr.open('GET', url + '/' + lang + '.json');
        xhr.onload = function () {
          if (xhr.status === 200) {
            _this8.updateWidgetTranslations(lang, JSON.parse(xhr.responseText));
          } else {
            _this8.onErrorRequest(0, xhr);
            _this8.getTranslations('en');
            delete _this8.defaults.translations[lang];
          }
        };
        xhr.onerror = function () {
          _this8.onErrorRequest(0, xhr);
          _this8.getTranslations('en');
          delete _this8.defaults.translations[lang];
        };
        xhr.send();
        this.defaults.translations[lang] = {};
      }
    }
  }]);

  return widgetsClass;
}();

var widgetController = function () {
  function widgetController() {
    _classCallCheck(this, widgetController);

    this.widgets = new widgetsClass();
    this.bind();
  }

  _createClass(widgetController, [{
    key: 'bind',
    value: function bind() {
      var _this9 = this;

      window[this.widgets.defaults.objectName] = {};
      document.addEventListener('DOMContentLoaded', function () {
        return _this9.initWidgets();
      }, false);
      window[this.widgets.defaults.objectName].bindWidget = function () {
        window[_this9.widgets.defaults.objectName].init = false;
        _this9.initWidgets();
      };
    }
  }, {
    key: 'initWidgets',
    value: function initWidgets() {
      var _this10 = this;

      if (!window[this.widgets.defaults.objectName].init) {
        window[this.widgets.defaults.objectName].init = true;
        var mainElements = Array.prototype.slice.call(document.getElementsByClassName(this.widgets.defaults.className));
        this.widgets.setWidgetClass(mainElements);
        window.addEventListener('resize', function () {
          _this10.widgets.setWidgetClass(mainElements);
          for (var i = 0; i < mainElements.length; i++) {
            _this10.widgets.setBeforeElementInFooter(i);
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
          _this10.widgets.states = [];
          for (var i = 0; i < mainElements.length; i++) {
            var newSettings = JSON.parse(JSON.stringify(_this10.widgets.defaults));
            newSettings.isWordpress = mainElements[i].classList.contains('wordpress');
            newSettings.mainElement = mainElements[i];
            _this10.widgets.states.push(newSettings);
            _this10.widgets.init(i);
          }
        }, 50);
      }
    }
  }]);

  return widgetController;
}();

new widgetController();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0lDQU0sYztBQUNKLDRCQUFjO0FBQUE7O0FBQ1osU0FBSyxVQUFMLEdBQWtCLENBQWxCO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLEdBQWpCO0FBQ0Q7Ozs7dUNBRWtCLEssRUFBTztBQUN4QixVQUFJLGFBQWEsRUFBakI7QUFBQSxVQUFxQixhQUFhLENBQWxDO0FBQ0EsVUFBSSxNQUFNLE1BQU4sQ0FBYSxHQUFiLElBQW9CLENBQUMsQ0FBekIsRUFBNEI7QUFDMUIscUJBQWEsR0FBYjtBQUNBLHFCQUFhLElBQWI7QUFDRDtBQUNELFVBQUksTUFBTSxNQUFOLENBQWEsR0FBYixJQUFvQixDQUFDLENBQXpCLEVBQTRCO0FBQzFCLHFCQUFhLEdBQWI7QUFDQSxxQkFBYSxLQUFLLElBQWxCO0FBQ0Q7QUFDRCxVQUFJLE1BQU0sTUFBTixDQUFhLEdBQWIsSUFBb0IsQ0FBQyxDQUF6QixFQUE0QjtBQUMxQixxQkFBYSxHQUFiO0FBQ0EscUJBQWEsS0FBSyxFQUFMLEdBQVUsSUFBdkI7QUFDRDtBQUNELFVBQUksTUFBTSxNQUFOLENBQWEsR0FBYixJQUFvQixDQUFDLENBQXpCLEVBQTRCO0FBQzFCLHFCQUFhLEdBQWI7QUFDQSxxQkFBYSxLQUFLLEVBQUwsR0FBVSxFQUFWLEdBQWUsSUFBNUI7QUFDRDtBQUNELGFBQU8sV0FBVyxNQUFNLE9BQU4sQ0FBYyxVQUFkLEVBQTBCLEVBQTFCLENBQVgsSUFBNEMsVUFBbkQ7QUFDRDs7O2dDQUVXLE0sRUFBUTtBQUNsQixVQUFJLENBQUMsTUFBRCxJQUFXLFdBQVcsQ0FBMUIsRUFBNkIsT0FBTyxNQUFQO0FBQzdCLFVBQUksV0FBVyxLQUFLLFVBQWhCLElBQThCLFdBQVcsS0FBSyxTQUFsRCxFQUE2RCxPQUFPLE1BQVA7QUFDN0QsZUFBUyxXQUFXLE1BQVgsQ0FBVDtB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QjtBQUNBLG9CQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLENBQWxCO0FBQ0Q7QUFDRixTQVRELEVBU0csRUFUSDtBQVVEO0FBQ0Y7Ozs7OztBQUdILElBQUksZ0JBQUoiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjbGFzcyBib290c3RyYXBDbGFzcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1wdHlWYWx1ZSA9IDA7XG4gICAgdGhpcy5lbXB0eURhdGEgPSAnLSc7XG4gIH1cbiAgXG4gIHBhcnNlSW50ZXJ2YWxWYWx1ZSh2YWx1ZSkge1xuICAgIGxldCB0aW1lU3ltYm9sID0gJycsIG11bHRpcGxpZXIgPSAxO1xuICAgIGlmICh2YWx1ZS5zZWFyY2goJ3MnKSA+IC0xKSB7XG4gICAgICB0aW1lU3ltYm9sID0gJ3MnO1xuICAgICAgbXVsdGlwbGllciA9IDEwMDA7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5zZWFyY2goJ20nKSA+IC0xKSB7XG4gICAgICB0aW1lU3ltYm9sID0gJ20nO1xuICAgICAgbXVsdGlwbGllciA9IDYwICogMTAwMDtcbiAgICB9XG4gICAgaWYgKHZhbHVlLnNlYXJjaCgnaCcpID4gLTEpIHtcbiAgICAgIHRpbWVTeW1ib2wgPSAnaCc7XG4gICAgICBtdWx0aXBsaWVyID0gNjAgKiA2MCAqIDEwMDA7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5zZWFyY2goJ2QnKSA+IC0xKSB7XG4gICAgICB0aW1lU3ltYm9sID0gJ2QnO1xuICAgICAgbXVsdGlwbGllciA9IDI0ICogNjAgKiA2MCAqIDEwMDA7XG4gICAgfVxuICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlLnJlcGxhY2UodGltZVN5bWJvbCwgJycpKSAqIG11bHRpcGxpZXI7XG4gIH1cbiAgXG4gIHBhcnNlTnVtYmVyKG51bWJlcikge1xuICAgIGlmICghbnVtYmVyICYmIG51bWJlciAhPT0gMCkgcmV0dXJuIG51bWJlcjtcbiAgICBpZiAobnVtYmVyID09PSB0aGlzLmVtcHR5VmFsdWUgfHwgbnVtYmVyID09PSB0aGlzLmVtcHR5RGF0YSkgcmV0dXJuIG51bWJlcjtcbiAgICBudW1iZXIgPSBwYXJzZUZsb2F0KG51bWJlcik7XG4gICAgaWYgKG51bWJlciA+IDEwMDAwMCkge1xuICAgICAgbGV0IG51bWJlclN0ciA9IG51bWJlci50b0ZpeGVkKDApO1xuICAgICAgbGV0IHBhcmFtZXRlciA9ICdLJyxcbiAgICAgICAgc3BsaWNlZCA9IG51bWJlclN0ci5zbGljZSgwLCBudW1iZXJTdHIubGVuZ3RoIC0gMSk7XG4gICAgICBpZiAobnVtYmVyID4gMTAwMDAwMDAwMCkge1xuICAgICAgICBzcGxpY2VkID0gbnVtYmVyU3RyLnNsaWNlKDAsIG51bWJlclN0ci5sZW5ndGggLSA3KTtcbiAgICAgICAgcGFyYW1ldGVyID0gJ0InO1xuICAgICAgfSBlbHNlIGlmIChudW1iZXIgPiAxMDAwMDAwKSB7XG4gICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDQpO1xuICAgICAgICBwYXJhbWV0ZXIgPSAnTSc7XG4gICAgICB9XG4gICAgICBsZXQgbmF0dXJhbCA9IHNwbGljZWQuc2xpY2UoMCwgc3BsaWNlZC5sZW5ndGggLSAyKTtcbiAgICAgIGxldCBkZWNpbWFsID0gc3BsaWNlZC5zbGljZShzcGxpY2VkLmxlbmd0aCAtIDIpO1xuICAgICAgcmV0dXJuIG5hdHVyYWwgKyAnLicgKyBkZWNpbWFsICsgJyAnICsgcGFyYW1ldGVyO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgaXNEZWNpbWFsID0gKG51bWJlciAlIDEpID4gMDtcbiAgICAgIGlmIChpc0RlY2ltYWwpIHtcbiAgICAgICAgbGV0IHByZWNpc2lvbiA9IDI7XG4gICAgICAgIGlmIChudW1iZXIgPCAxKSB7XG4gICAgICAgICAgcHJlY2lzaW9uID0gODtcbiAgICAgICAgfSBlbHNlIGlmIChudW1iZXIgPCAxMCkge1xuICAgICAgICAgIHByZWNpc2lvbiA9IDY7XG4gICAgICAgIH0gZWxzZSBpZiAobnVtYmVyIDwgMTAwMCkge1xuICAgICAgICAgIHByZWNpc2lvbiA9IDQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucm91bmRBbW91bnQobnVtYmVyLCBwcmVjaXNpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bWJlci50b0ZpeGVkKDIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgcm91bmRBbW91bnQoYW1vdW50LCBkZWNpbWFsLCBkaXJlY3Rpb24pIHtcbiAgICBhbW91bnQgPSBwYXJzZUZsb2F0KGFtb3VudCk7XG4gICAgaWYgKCFkZWNpbWFsKSBkZWNpbWFsID0gODtcbiAgICBpZiAoIWRpcmVjdGlvbikgZGlyZWN0aW9uID0gJ3JvdW5kJztcbiAgICBkZWNpbWFsID0gTWF0aC5wb3coMTAsIGRlY2ltYWwpO1xuICAgIHJldHVybiBNYXRoW2RpcmVjdGlvbl0oYW1vdW50ICogZGVjaW1hbCkgLyBkZWNpbWFsO1xuICB9XG4gIFxuICBsb29wKGFyciwgZm4sIGJ1c3ksIGVyciwgaSA9IDApIHtcbiAgICBjb25zdCBib2R5ID0gKG9rLCBlcikgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgciA9IGZuKGFycltpXSwgaSwgYXJyKTtcbiAgICAgICAgciAmJiByLnRoZW4gPyByLnRoZW4ob2spLmNhdGNoKGVyKSA6IG9rKHIpXG4gICAgICB9XG4gICAgICBjYXRjaCAoZSkge1xuICAgICAgICBlcihlKVxuICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgbmV4dCA9IChvaywgZXIpID0+ICgpID0+IHRoaXMubG9vcChhcnIsIGZuLCBvaywgZXIsICsraSk7XG4gICAgY29uc3QgcnVuID0gKG9rLCBlcikgPT4gaSA8IGFyci5sZW5ndGggPyBuZXcgUHJvbWlzZShib2R5KS50aGVuKG5leHQob2ssIGVyKSkuY2F0Y2goZXIpIDogb2soKTtcbiAgICByZXR1cm4gYnVzeSA/IHJ1bihidXN5LCBlcnIpIDogbmV3IFByb21pc2UocnVuKVxuICB9XG4gIFxuICBnZXRTY3JpcHQoaW5kZXgsIHVybCwgc3RhdGUpIHtcbiAgICBpZiAoc3RhdGVbdXJsXSkgcmV0dXJuO1xuICAgIHN0YXRlW3VybF0gPSAncGVuZGluZyc7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgc2NyaXB0Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgc3RhdGVbdXJsXSA9ICdkb3dubG9hZGVkJztcbiAgICAgICAgcmV0dXJuIHJlc29sdmU7XG4gICAgICB9O1xuICAgICAgc2NyaXB0Lm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgIGRlbGV0ZSBzdGF0ZVt1cmxdO1xuICAgICAgICByZXR1cm4gcmVqZWN0O1xuICAgICAgfTtcbiAgICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XG4gICAgICBzY3JpcHQuc3JjID0gdXJsO1xuICAgIH0pO1xuICB9XG59XG5cbmNsYXNzIHdpZGdldHNDbGFzcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYm9vdHN0cmFwID0gbmV3IGJvb3RzdHJhcENsYXNzKCk7XG4gICAgdGhpcy5zdGF0ZXMgPSBbXTtcbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgb2JqZWN0TmFtZTogJ2NwQ3VycmVuY3lXaWRnZXRzJyxcbiAgICAgIGNsYXNzTmFtZTogJ2NvaW5wYXByaWthLWN1cnJlbmN5LXdpZGdldCcsXG4gICAgICBjc3NGaWxlTmFtZTogJ3dpZGdldC5taW4uY3NzJyxcbiAgICAgIGN1cnJlbmN5OiAnYnRjLWJpdGNvaW4nLFxuICAgICAgcHJpbWFyeV9jdXJyZW5jeTogJ1VTRCcsXG4gICAgICBtb2R1bGVzOiBbJ2NoYXJ0JywgJ21hcmtldF9kZXRhaWxzJ10sXG4gICAgICB1cGRhdGVfYWN0aXZlOiBmYWxzZSxcbiAgICAgIHVwZGF0ZV90aW1lb3V0OiAnMzBzJyxcbiAgICAgIGxhbmd1YWdlOiAnZW4nLFxuICAgICAgc3R5bGVfc3JjOiBudWxsLFxuICAgICAgaW1nX3NyYzogbnVsbCxcbiAgICAgIGxhbmdfc3JjOiBudWxsLFxuICAgICAgb3JpZ2luX3NyYzogJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vQGNvaW5wYXByaWthL3dpZGdldC1jdXJyZW5jeScsXG4gICAgICBzaG93X2RldGFpbHNfY3VycmVuY3k6IGZhbHNlLFxuICAgICAgdGlja2VyOiB7XG4gICAgICAgIG5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgc3ltYm9sOiB1bmRlZmluZWQsXG4gICAgICAgIHByaWNlOiB1bmRlZmluZWQsXG4gICAgICAgIHByaWNlX2NoYW5nZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgICAgcmFuazogdW5kZWZpbmVkLFxuICAgICAgICBwcmljZV9hdGg6IHVuZGVmaW5lZCxcbiAgICAgICAgdm9sdW1lXzI0aDogdW5kZWZpbmVkLFxuICAgICAgICBtYXJrZXRfY2FwOiB1bmRlZmluZWQsXG4gICAgICAgIHBlcmNlbnRfZnJvbV9wcmljZV9hdGg6IHVuZGVmaW5lZCxcbiAgICAgICAgdm9sdW1lXzI0aF9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgICAgIG1hcmtldF9jYXBfY2hhbmdlXzI0aDogdW5kZWZpbmVkLFxuICAgICAgfSxcbiAgICAgIGludGVydmFsOiBudWxsLFxuICAgICAgaXNXb3JkcHJlc3M6IGZhbHNlLFxuICAgICAgaXNEYXRhOiBmYWxzZSxcbiAgICAgIG1lc3NhZ2U6ICdkYXRhX2xvYWRpbmcnLFxuICAgICAgdHJhbnNsYXRpb25zOiB7fSxcbiAgICAgIG1haW5FbGVtZW50OiBudWxsLFxuICAgICAgbm9UcmFuc2xhdGlvbkxhYmVsczogW10sXG4gICAgICBzY3JpcHRzRG93bmxvYWRlZDoge30sXG4gICAgICByd2Q6IHtcbiAgICAgICAgeHM6IDI4MCxcbiAgICAgICAgczogMzIwLFxuICAgICAgICBtOiAzNzAsXG4gICAgICB9LFxuICAgIH07XG4gIH1cbiAgXG4gIGluaXQoaW5kZXgpIHtcbiAgICBpZiAoIXRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5lcnJvcignQmluZCBmYWlsZWQsIG5vIGVsZW1lbnQgd2l0aCBjbGFzcyA9IFwiJyArIHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lICsgJ1wiJyk7XG4gICAgfVxuICAgIHRoaXMuZ2V0RGVmYXVsdHMoaW5kZXgpO1xuICAgIHRoaXMuc2V0T3JpZ2luTGluayhpbmRleCk7XG4gIH1cbiAgXG4gIHNldFdpZGdldENsYXNzKGVsZW1lbnRzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHdpZHRoID0gZWxlbWVudHNbaV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgICBsZXQgcndkS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuZGVmYXVsdHMucndkKTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcndkS2V5cy5sZW5ndGg7IGorKykge1xuICAgICAgICBsZXQgcndkS2V5ID0gcndkS2V5c1tqXTtcbiAgICAgICAgbGV0IHJ3ZFBhcmFtID0gdGhpcy5kZWZhdWx0cy5yd2RbcndkS2V5XTtcbiAgICAgICAgbGV0IGNsYXNzTmFtZSA9IHRoaXMuZGVmYXVsdHMuY2xhc3NOYW1lICsgJ19fJyArIHJ3ZEtleTtcbiAgICAgICAgaWYgKHdpZHRoIDw9IHJ3ZFBhcmFtKSBlbGVtZW50c1tpXS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICAgIGlmICh3aWR0aCA+IHJ3ZFBhcmFtKSBlbGVtZW50c1tpXS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICBnZXRNYWluRWxlbWVudChpbmRleCkge1xuICAgIHJldHVybiAodGhpcy5zdGF0ZXNbaW5kZXhdKSA/IHRoaXMuc3RhdGVzW2luZGV4XS5tYWluRWxlbWVudCA6IG51bGw7XG4gIH1cbiAgXG4gIGdldERlZmF1bHRzKGluZGV4KSB7XG4gICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgaWYgKG1haW5FbGVtZW50ICYmIG1haW5FbGVtZW50LmRhdGFzZXQpIHtcbiAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lm1vZHVsZXMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ21vZHVsZXMnLCBKU09OLnBhcnNlKG1haW5FbGVtZW50LmRhdGFzZXQubW9kdWxlcykpO1xuICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQucHJpbWFyeUN1cnJlbmN5KSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdwcmltYXJ5X2N1cnJlbmN5JywgbWFpbkVsZW1lbnQuZGF0YXNldC5wcmltYXJ5Q3VycmVuY3kpO1xuICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuY3VycmVuY3kpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2N1cnJlbmN5JywgbWFpbkVsZW1lbnQuZGF0YXNldC5jdXJyZW5jeSk7XG4gICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5zaG93RGV0YWlsc0N1cnJlbmN5KSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdzaG93X2RldGFpbHNfY3VycmVuY3knLCAobWFpbkVsZW1lbnQuZGF0YXNldC5zaG93RGV0YWlsc0N1cnJlbmN5ID09PSAndHJ1ZScpKTtcbiAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZUFjdGl2ZSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAndXBkYXRlX2FjdGl2ZScsIChtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZUFjdGl2ZSA9PT0gJ3RydWUnKSk7XG4gICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVUaW1lb3V0KSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICd1cGRhdGVfdGltZW91dCcsIHRoaXMuYm9vdHN0cmFwLnBhcnNlSW50ZXJ2YWxWYWx1ZShtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZVRpbWVvdXQpKTtcbiAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lmxhbmd1YWdlKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdsYW5ndWFnZScsIG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ3VhZ2UpO1xuICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQub3JpZ2luU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdvcmlnaW5fc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5vcmlnaW5TcmMpO1xuICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubm9kZU1vZHVsZXNTcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ25vZGVfbW9kdWxlc19zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0Lm5vZGVNb2R1bGVzU3JjKTtcbiAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmJvd2VyU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdib3dlcl9zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LmJvd2VyU3JjKTtcbiAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnN0eWxlU3JjKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdzdHlsZV9zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LnN0eWxlU3JjKTtcbiAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmxhbmdTcmMpIHRoaXMudXBkYXRlRGF0YShpbmRleCwgJ2xvZ29fc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5sYW5nU3JjKTtcbiAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmltZ1NyYykgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbG9nb19zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LmltZ1NyYyk7XG4gICAgfVxuICB9XG4gIFxuICBzZXRPcmlnaW5MaW5rKGluZGV4KSB7XG4gICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zKS5sZW5ndGggPT09IDApIHRoaXMuZ2V0VHJhbnNsYXRpb25zKHRoaXMuZGVmYXVsdHMubGFuZ3VhZ2UpO1xuICAgIHRoaXMuc3R5bGVzaGVldCgpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5hZGRXaWRnZXRFbGVtZW50KGluZGV4KTtcbiAgICAgIHRoaXMuaW5pdEludGVydmFsKGluZGV4KTtcbiAgICB9LCAxMDApO1xuICB9XG4gIFxuICBhZGRXaWRnZXRFbGVtZW50KGluZGV4KSB7XG4gICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgaWYgKG1haW5FbGVtZW50KSB7XG4gICAgICBcbiAgICAgIGxldCBtb2R1bGVzID0gdGhpcy53aWRnZXRDaGFydEVsZW1lbnQoaW5kZXgpICsgdGhpcy53aWRnZXRNYXJrZXREZXRhaWxzRWxlbWVudChpbmRleCk7XG4gICAgICBsZXQgd2lkZ2V0RWxlbWVudCA9IHRoaXMud2lkZ2V0TWFpbkVsZW1lbnQoaW5kZXgpICsgbW9kdWxlcyArIHRoaXMud2lkZ2V0Rm9vdGVyKGluZGV4KTtcbiAgICAgIG1haW5FbGVtZW50LmlubmVySFRNTCA9IHdpZGdldEVsZW1lbnQ7XG4gICAgfVxuICAgIHRoaXMuc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKGluZGV4KTtcbiAgICB0aGlzLmdldERhdGEoaW5kZXgpO1xuICB9XG4gIFxuICBnZXREYXRhKGluZGV4KSB7XG4gICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKCdHRVQnLCAnaHR0cHM6Ly9hcGkuY29pbnBhcHJpa2EuY29tL3YxL3dpZGdldC8nICsgdGhpcy5zdGF0ZXNbaW5kZXhdLmN1cnJlbmN5ICsgJz9xdW90ZT0nICsgdGhpcy5zdGF0ZXNbaW5kZXhdLnByaW1hcnlfY3VycmVuY3kpO1xuICAgIHhoci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZXNbaW5kZXhdLmlzRGF0YSkgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnaXNEYXRhJywgdHJ1ZSk7XG4gICAgICAgIHRoaXMudXBkYXRlVGlja2VyKGluZGV4LCBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLm9uRXJyb3JSZXF1ZXN0KGluZGV4LCB4aHIpO1xuICAgICAgfVxuICAgIH07XG4gICAgeGhyLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICB0aGlzLm9uRXJyb3JSZXF1ZXN0KGluZGV4LCB4aHIpO1xuICAgIH07XG4gICAgeGhyLnNlbmQoKTtcbiAgfVxuICBcbiAgb25FcnJvclJlcXVlc3QoaW5kZXgsIHhocikge1xuICAgIGlmICh0aGlzLnN0YXRlc1tpbmRleF0uaXNEYXRhKSB0aGlzLnVwZGF0ZURhdGEoaW5kZXgsICdpc0RhdGEnLCBmYWxzZSk7XG4gICAgdGhpcy51cGRhdGVEYXRhKGluZGV4LCAnbWVzc2FnZScsICdkYXRhX3VuYXZhaWxhYmxlJyk7XG4gICAgY29uc29sZS5lcnJvcignUmVxdWVzdCBmYWlsZWQuICBSZXR1cm5lZCBzdGF0dXMgb2YgJyArIHhociwgdGhpcy5zdGF0ZXNbaW5kZXhdKTtcbiAgfVxuICBcbiAgaW5pdEludGVydmFsKGluZGV4KSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLnN0YXRlc1tpbmRleF0uaW50ZXJ2YWwpO1xuICAgIGlmICh0aGlzLnN0YXRlc1tpbmRleF0udXBkYXRlX2FjdGl2ZSAmJiB0aGlzLnN0YXRlc1tpbmRleF0udXBkYXRlX3RpbWVvdXQgPiAxMDAwKSB7XG4gICAgICB0aGlzLnN0YXRlc1tpbmRleF0uaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIHRoaXMuZ2V0RGF0YShpbmRleCk7XG4gICAgICB9LCB0aGlzLnN0YXRlc1tpbmRleF0udXBkYXRlX3RpbWVvdXQpO1xuICAgIH1cbiAgfVxuICBcbiAgc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKGluZGV4KSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlc1tpbmRleF0uaXNXb3JkcHJlc3MpIHtcbiAgICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgaWYgKG1haW5FbGVtZW50KSB7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5jaGlsZHJlblswXS5sb2NhbE5hbWUgPT09ICdzdHlsZScpIHtcbiAgICAgICAgICBtYWluRWxlbWVudC5yZW1vdmVDaGlsZChtYWluRWxlbWVudC5jaGlsZE5vZGVzWzBdKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZm9vdGVyRWxlbWVudCA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jcC13aWRnZXRfX2Zvb3RlcicpO1xuICAgICAgICBsZXQgdmFsdWUgPSBmb290ZXJFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gNDM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZm9vdGVyRWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFsdWUgLT0gZm9vdGVyRWxlbWVudC5jaGlsZE5vZGVzW2ldLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHN0eWxlLmlubmVySFRNTCA9ICcuY3Atd2lkZ2V0X19mb290ZXItLScgKyBpbmRleCArICc6OmJlZm9yZXt3aWR0aDonICsgdmFsdWUudG9GaXhlZCgwKSArICdweDt9JztcbiAgICAgICAgbWFpbkVsZW1lbnQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBtYWluRWxlbWVudC5jaGlsZHJlblswXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICB1cGRhdGVXaWRnZXRFbGVtZW50KGluZGV4LCBrZXksIHZhbHVlLCB0aWNrZXIpIHtcbiAgICBsZXQgc3RhdGUgPSB0aGlzLnN0YXRlc1tpbmRleF07XG4gICAgbGV0IG1haW5FbGVtZW50ID0gdGhpcy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgaWYgKG1haW5FbGVtZW50KSB7XG4gICAgICBsZXQgdGlja2VyQ2xhc3MgPSAodGlja2VyKSA/ICdUaWNrZXInIDogJyc7XG4gICAgICBpZiAoa2V5ID09PSAnbmFtZScgfHwga2V5ID09PSAnY3VycmVuY3knKSB7XG4gICAgICAgIGlmIChrZXkgPT09ICdjdXJyZW5jeScpIHtcbiAgICAgICAgICBsZXQgYUVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNwLXdpZGdldF9fZm9vdGVyID4gYScpO1xuICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYUVsZW1lbnRzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICBhRWxlbWVudHNba10uaHJlZiA9IHRoaXMuY29pbl9saW5rKHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nZXRJbWFnZShpbmRleCk7XG4gICAgICB9XG4gICAgICBpZiAoa2V5ID09PSAnaXNEYXRhJyB8fCBrZXkgPT09ICdtZXNzYWdlJykge1xuICAgICAgICBsZXQgaGVhZGVyRWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0X19tYWluJyk7XG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgaGVhZGVyRWxlbWVudHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICBoZWFkZXJFbGVtZW50c1trXS5pbm5lckhUTUwgPSAoIXN0YXRlLmlzRGF0YSkgPyB0aGlzLndpZGdldE1haW5FbGVtZW50TWVzc2FnZShpbmRleCkgOiB0aGlzLndpZGdldE1haW5FbGVtZW50RGF0YShpbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB1cGRhdGVFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsga2V5ICsgdGlja2VyQ2xhc3MpO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHVwZGF0ZUVsZW1lbnRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgbGV0IHVwZGF0ZUVsZW1lbnQgPSB1cGRhdGVFbGVtZW50c1tqXTtcbiAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NwLXdpZGdldF9fcmFuaycpKSB7XG4gICAgICAgICAgICBsZXQgY2xhc3NOYW1lID0gKHBhcnNlRmxvYXQodmFsdWUpID4gMCkgPyBcImNwLXdpZGdldF9fcmFuay11cFwiIDogKChwYXJzZUZsb2F0KHZhbHVlKSA8IDApID8gXCJjcC13aWRnZXRfX3JhbmstZG93blwiIDogXCJjcC13aWRnZXRfX3JhbmstbmV1dHJhbFwiKTtcbiAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLWRvd24nKTtcbiAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLXVwJyk7XG4gICAgICAgICAgICB1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9fcmFuay1uZXV0cmFsJyk7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuYm9vdHN0cmFwLmVtcHR5RGF0YTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICAgICAgICB2YWx1ZSA9IChrZXkgPT09ICdwcmljZV9jaGFuZ2VfMjRoJykgPyAnKCcgKyB0aGlzLmJvb3RzdHJhcC5yb3VuZEFtb3VudCh2YWx1ZSwgMikgKyAnJSknIDogdGhpcy5ib290c3RyYXAucm91bmRBbW91bnQodmFsdWUsIDIpICsgJyUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3dEZXRhaWxzQ3VycmVuY3knKSAmJiAhc3RhdGUuc2hvd19kZXRhaWxzX2N1cnJlbmN5KSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICcgJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwYXJzZU51bWJlcicpKSB7XG4gICAgICAgICAgICB1cGRhdGVFbGVtZW50LmlubmVyVGV4dCA9IHRoaXMuYm9vdHN0cmFwLnBhcnNlTnVtYmVyKHZhbHVlKSB8fCB0aGlzLmJvb3RzdHJhcC5lbXB0eURhdGE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuaW5uZXJUZXh0ID0gdmFsdWUgfHwgdGhpcy5ib290c3RyYXAuZW1wdHlEYXRhO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgdXBkYXRlRGF0YShpbmRleCwga2V5LCB2YWx1ZSwgdGlja2VyKSB7XG4gICAgaWYgKHRpY2tlcikge1xuICAgICAgdGhpcy5zdGF0ZXNbaW5kZXhdLnRpY2tlcltrZXldID0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdGVzW2luZGV4XVtrZXldID0gdmFsdWU7XG4gICAgfVxuICAgIGlmIChrZXkgPT09ICdsYW5ndWFnZScpIHtcbiAgICAgIHRoaXMuZ2V0VHJhbnNsYXRpb25zKHZhbHVlKTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVXaWRnZXRFbGVtZW50KGluZGV4LCBrZXksIHZhbHVlLCB0aWNrZXIpO1xuICB9XG4gIFxuICB1cGRhdGVXaWRnZXRUcmFuc2xhdGlvbnMobGFuZywgZGF0YSkge1xuICAgIHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddID0gZGF0YTtcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuc3RhdGVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICBsZXQgaXNOb1RyYW5zbGF0aW9uTGFiZWxzVXBkYXRlID0gdGhpcy5zdGF0ZXNbeF0ubm9UcmFuc2xhdGlvbkxhYmVscy5sZW5ndGggPiAwICYmIGxhbmcgPT09ICdlbic7XG4gICAgICBpZiAodGhpcy5zdGF0ZXNbeF0ubGFuZ3VhZ2UgPT09IGxhbmcgfHwgaXNOb1RyYW5zbGF0aW9uTGFiZWxzVXBkYXRlKSB7XG4gICAgICAgIGxldCBtYWluRWxlbWVudCA9IHRoaXMuc3RhdGVzW3hdLm1haW5FbGVtZW50O1xuICAgICAgICBsZXQgdHJhbnNhbHRlRWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3AtdHJhbnNsYXRpb24nKSk7XG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdHJhbnNhbHRlRWxlbWVudHMubGVuZ3RoOyB5KyspIHtcbiAgICAgICAgICB0cmFuc2FsdGVFbGVtZW50c1t5XS5jbGFzc0xpc3QuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoY2xhc3NOYW1lLnNlYXJjaCgndHJhbnNsYXRpb25fJykgPiAtMSkge1xuICAgICAgICAgICAgICBsZXQgdHJhbnNsYXRlS2V5ID0gY2xhc3NOYW1lLnJlcGxhY2UoJ3RyYW5zbGF0aW9uXycsICcnKTtcbiAgICAgICAgICAgICAgaWYgKHRyYW5zbGF0ZUtleSA9PT0gJ21lc3NhZ2UnKSB0cmFuc2xhdGVLZXkgPSB0aGlzLnN0YXRlc1t4XS5tZXNzYWdlO1xuICAgICAgICAgICAgICBsZXQgbGFiZWxJbmRleCA9IHRoaXMuc3RhdGVzW3hdLm5vVHJhbnNsYXRpb25MYWJlbHMuaW5kZXhPZih0cmFuc2xhdGVLZXkpO1xuICAgICAgICAgICAgICBsZXQgdGV4dCA9IHRoaXMuZ2V0VHJhbnNsYXRpb24oeCwgdHJhbnNsYXRlS2V5KTtcbiAgICAgICAgICAgICAgaWYgKGxhYmVsSW5kZXggPiAtMSAmJiB0ZXh0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZXNbeF0ubm9UcmFuc2xhdGlvbkxhYmVscy5zcGxpY2UobGFiZWxJbmRleCwgMSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0cmFuc2FsdGVFbGVtZW50c1t5XS5pbm5lclRleHQgPSB0ZXh0O1xuICAgICAgICAgICAgICBpZiAodHJhbnNhbHRlRWxlbWVudHNbeV0uY2xvc2VzdCgnLmNwLXdpZGdldF9fZm9vdGVyJykpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyLmJpbmQobnVsbCwgeCksIDUwKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHVwZGF0ZVRpY2tlcihpbmRleCwgZGF0YSkge1xuICAgIGxldCBkYXRhS2V5cyA9IE9iamVjdC5rZXlzKGRhdGEpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMudXBkYXRlRGF0YShpbmRleCwgZGF0YUtleXNbaV0sIGRhdGFbZGF0YUtleXNbaV1dLCB0cnVlKTtcbiAgICB9XG4gIH1cbiAgXG4gIHN0eWxlc2hlZXQoKSB7XG4gICAgaWYgKHRoaXMuZGVmYXVsdHMuc3R5bGVfc3JjICE9PSBmYWxzZSkge1xuICAgICAgbGV0IHVybCA9IHRoaXMuZGVmYXVsdHMuc3R5bGVfc3JjIHx8IHRoaXMuZGVmYXVsdHMub3JpZ2luX3NyYyArICcvZGlzdC8nICsgdGhpcy5kZWZhdWx0cy5jc3NGaWxlTmFtZTtcbiAgICAgIGxldCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ3JlbCcsICdzdHlsZXNoZWV0Jyk7XG4gICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnaHJlZicsIHVybCk7XG4gICAgICByZXR1cm4gKGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignbGlua1tocmVmPVwiJyArIHVybCArICdcIl0nKSkgPyAnJyA6IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgfVxuICB9XG4gIFxuICB3aWRnZXRNYWluRWxlbWVudChpbmRleCkge1xuICAgIGxldCBkYXRhID0gdGhpcy5zdGF0ZXNbaW5kZXhdO1xuICAgIHJldHVybiAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9faGVhZGVyXCI+JyArXG4gICAgICAnPGRpdiBjbGFzcz1cIicgKyAnY3Atd2lkZ2V0X19pbWcgY3Atd2lkZ2V0X19pbWctJyArIGRhdGEuY3VycmVuY3kgKyAnXCI+JyArXG4gICAgICAnPGltZy8+JyArXG4gICAgICAnPC9kaXY+JyArXG4gICAgICAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9fbWFpblwiPicgK1xuICAgICAgKChkYXRhLmlzRGF0YSkgPyB0aGlzLndpZGdldE1haW5FbGVtZW50RGF0YShpbmRleCkgOiB0aGlzLndpZGdldE1haW5FbGVtZW50TWVzc2FnZShpbmRleCkpICtcbiAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nO1xuICB9XG4gIFxuICB3aWRnZXRNYWluRWxlbWVudERhdGEoaW5kZXgpIHtcbiAgICBsZXQgZGF0YSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcbiAgICByZXR1cm4gJzxoMz48YSBocmVmPVwiJyArIHRoaXMuY29pbl9saW5rKGRhdGEuY3VycmVuY3kpICsgJ1wiPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwibmFtZVRpY2tlclwiPicgKyAoZGF0YS50aWNrZXIubmFtZSB8fCB0aGlzLmJvb3RzdHJhcC5lbXB0eURhdGEpICsgJzwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlclwiPicgKyAoZGF0YS50aWNrZXIuc3ltYm9sIHx8IHRoaXMuYm9vdHN0cmFwLmVtcHR5RGF0YSkgKyAnPC9zcGFuPicgK1xuICAgICAgJzwvYT48L2gzPicgK1xuICAgICAgJzxzdHJvbmc+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJwcmljZVRpY2tlciBwYXJzZU51bWJlclwiPicgKyAodGhpcy5ib290c3RyYXAucGFyc2VOdW1iZXIoZGF0YS50aWNrZXIucHJpY2UpIHx8IHRoaXMuYm9vdHN0cmFwLmVtcHR5RGF0YSkgKyAnPC9zcGFuPiAnICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInByaW1hcnlDdXJyZW5jeVwiPicgKyBkYXRhLnByaW1hcnlfY3VycmVuY3kgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInByaWNlX2NoYW5nZV8yNGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rIGNwLXdpZGdldF9fcmFuay0nICsgKChkYXRhLnRpY2tlci5wcmljZV9jaGFuZ2VfMjRoID4gMCkgPyBcInVwXCIgOiAoKGRhdGEudGlja2VyLnByaWNlX2NoYW5nZV8yNGggPCAwKSA/IFwiZG93blwiIDogXCJuZXV0cmFsXCIpKSArICdcIj4oJyArICh0aGlzLmJvb3RzdHJhcC5yb3VuZEFtb3VudChkYXRhLnRpY2tlci5wcmljZV9jaGFuZ2VfMjRoLCAyKSB8fCB0aGlzLmJvb3RzdHJhcC5lbXB0eVZhbHVlKSArICclKTwvc3Bhbj4nICtcbiAgICAgICc8L3N0cm9uZz4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldF9fcmFuay1sYWJlbFwiPjxzcGFuIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fcmFua1wiPicgKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInJhbmtcIikgKyAnPC9zcGFuPiA8c3BhbiBjbGFzcz1cInJhbmtUaWNrZXJcIj4nICsgKGRhdGEudGlja2VyLnJhbmsgfHwgdGhpcy5ib290c3RyYXAuZW1wdHlEYXRhKSArICc8L3NwYW4+PC9zcGFuPic7XG4gIH1cbiAgXG4gIHdpZGdldE1haW5FbGVtZW50TWVzc2FnZShpbmRleCkge1xuICAgIGxldCBtZXNzYWdlID0gdGhpcy5zdGF0ZXNbaW5kZXhdLm1lc3NhZ2U7XG4gICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19tYWluLW5vLWRhdGEgY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fbWVzc2FnZVwiPicgKyAodGhpcy5nZXRUcmFuc2xhdGlvbihpbmRleCwgbWVzc2FnZSkpICsgJzwvZGl2Pic7XG4gIH1cbiAgXG4gIHdpZGdldE1hcmtldERldGFpbHNFbGVtZW50KGluZGV4KSB7XG4gICAgcmV0dXJuICh0aGlzLnN0YXRlc1tpbmRleF0ubW9kdWxlcy5pbmRleE9mKCdtYXJrZXRfZGV0YWlscycpID4gLTEpID8gJzxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX2RldGFpbHNcIj4nICtcbiAgICAgIHRoaXMud2lkZ2V0QXRoRWxlbWVudChpbmRleCkgK1xuICAgICAgdGhpcy53aWRnZXRWb2x1bWUyNGhFbGVtZW50KGluZGV4KSArXG4gICAgICB0aGlzLndpZGdldE1hcmtldENhcEVsZW1lbnQoaW5kZXgpICtcbiAgICAgICc8L2Rpdj4nIDogJyc7XG4gIH1cbiAgXG4gIHdpZGdldEF0aEVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAnPHNtYWxsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fYXRoXCI+JyArIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwiYXRoXCIpICsgJzwvc21hbGw+JyArXG4gICAgICAnPGRpdj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInByaWNlX2F0aFRpY2tlciBwYXJzZU51bWJlclwiPicgKyB0aGlzLmJvb3RzdHJhcC5lbXB0eURhdGEgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlciBzaG93RGV0YWlsc0N1cnJlbmN5XCI+PC9zcGFuPicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwicGVyY2VudF9mcm9tX3ByaWNlX2F0aFRpY2tlciBjcC13aWRnZXRfX3JhbmtcIj4nICsgdGhpcy5ib290c3RyYXAuZW1wdHlEYXRhICsgJzwvc3Bhbj4nICtcbiAgICAgICc8L2Rpdj4nXG4gIH1cbiAgXG4gIHdpZGdldFZvbHVtZTI0aEVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAnPHNtYWxsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fdm9sdW1lXzI0aFwiPicgKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInZvbHVtZV8yNGhcIikgKyAnPC9zbWFsbD4nICtcbiAgICAgICc8ZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwidm9sdW1lXzI0aFRpY2tlciBwYXJzZU51bWJlclwiPicgKyB0aGlzLmJvb3RzdHJhcC5lbXB0eURhdGEgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlciBzaG93RGV0YWlsc0N1cnJlbmN5XCI+PC9zcGFuPicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwidm9sdW1lXzI0aF9jaGFuZ2VfMjRoVGlja2VyIGNwLXdpZGdldF9fcmFua1wiPicgKyB0aGlzLmJvb3RzdHJhcC5lbXB0eURhdGEgKyAnPC9zcGFuPicgK1xuICAgICAgJzwvZGl2Pic7XG4gIH1cbiAgXG4gIHdpZGdldE1hcmtldENhcEVsZW1lbnQoaW5kZXgpIHtcbiAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAnPHNtYWxsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fbWFya2V0X2NhcFwiPicgKyB0aGlzLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcIm1hcmtldF9jYXBcIikgKyAnPC9zbWFsbD4nICtcbiAgICAgICc8ZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwibWFya2V0X2NhcFRpY2tlciBwYXJzZU51bWJlclwiPicgKyB0aGlzLmJvb3RzdHJhcC5lbXB0eURhdGEgKyAnIDwvc3Bhbj4nICtcbiAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlciBzaG93RGV0YWlsc0N1cnJlbmN5XCI+PC9zcGFuPicgK1xuICAgICAgJzwvZGl2PicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwibWFya2V0X2NhcF9jaGFuZ2VfMjRoVGlja2VyIGNwLXdpZGdldF9fcmFua1wiPicgKyB0aGlzLmJvb3RzdHJhcC5lbXB0eURhdGEgKyAnPC9zcGFuPicgK1xuICAgICAgJzwvZGl2Pic7XG4gIH1cbiAgXG4gIHdpZGdldENoYXJ0RWxlbWVudChpbmRleCkge1xuICAgIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gKCF3aW5kb3cuSGlnaGNoYXJ0cykgPyB0aGlzLmJvb3RzdHJhcC5nZXRTY3JpcHQoaW5kZXgsICdodHRwczovL2NvZGUuaGlnaGNoYXJ0cy5jb20vaGlnaGNoYXJ0cy5qcycsIHRoaXMuZGVmYXVsdHMuc2NyaXB0c0Rvd25sb2FkZWQpIDogbnVsbDtcbiAgICB9KTtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCd3aWRnZXRDaGFydEVsZW1lbnQnLCB7cmVzdWx0fSk7XG4gICAgICByZXR1cm4gKHRoaXMuc3RhdGVzW2luZGV4XS5tb2R1bGVzLmluZGV4T2YoJ2NoYXJ0JykgPiAtMSlcbiAgICAgICAgPyAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9fY2hhcnRcIj4nICtcbiAgICAgICAgJ0NIQVJUJyArXG4gICAgICAgICc8L2Rpdj4nXG4gICAgICAgIDogJyc7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgXG4gIHdpZGdldEZvb3RlcihpbmRleCkge1xuICAgIGxldCBjdXJyZW5jeSA9IHRoaXMuc3RhdGVzW2luZGV4XS5jdXJyZW5jeTtcbiAgICByZXR1cm4gKCF0aGlzLnN0YXRlc1tpbmRleF0uaXNXb3JkcHJlc3MpXG4gICAgICA/ICc8cCBjbGFzcz1cImNwLXdpZGdldF9fZm9vdGVyIGNwLXdpZGdldF9fZm9vdGVyLS0nICsgaW5kZXggKyAnXCI+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9wb3dlcmVkX2J5XCI+JyArIHRoaXMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwicG93ZXJlZF9ieVwiKSArICcgPC9zcGFuPicgK1xuICAgICAgJzxpbWcgc3R5bGU9XCJ3aWR0aDogMTZweFwiIHNyYz1cIicgKyB0aGlzLm1haW5fbG9nb19saW5rKCkgKyAnXCIgYWx0PVwiXCIvPicgK1xuICAgICAgJzxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCInICsgdGhpcy5jb2luX2xpbmsoY3VycmVuY3kpICsgJ1wiPmNvaW5wYXByaWthLmNvbTwvYT4nICtcbiAgICAgICc8L3A+J1xuICAgICAgOiAnJztcbiAgfVxuICBcbiAgZ2V0SW1hZ2UoaW5kZXgpIHtcbiAgICBsZXQgZGF0YSA9IHRoaXMuc3RhdGVzW2luZGV4XTtcbiAgICBsZXQgaW1nQ29udGFpbmVycyA9IGRhdGEubWFpbkVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY3Atd2lkZ2V0X19pbWcnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGltZ0NvbnRhaW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBpbWdDb250YWluZXIgPSBpbWdDb250YWluZXJzW2ldO1xuICAgICAgaW1nQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NwLXdpZGdldF9faW1nLS1oaWRkZW4nKTtcbiAgICAgIGxldCBpbWcgPSBpbWdDb250YWluZXIucXVlcnlTZWxlY3RvcignaW1nJyk7XG4gICAgICBsZXQgbmV3SW1nID0gbmV3IEltYWdlO1xuICAgICAgbmV3SW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgaW1nLnNyYyA9IG5ld0ltZy5zcmM7XG4gICAgICAgIGltZ0NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX2ltZy0taGlkZGVuJyk7XG4gICAgICB9O1xuICAgICAgbmV3SW1nLnNyYyA9IHRoaXMuaW1nX3NyYyhkYXRhLmN1cnJlbmN5KTtcbiAgICB9XG4gIH1cbiAgXG4gIGltZ19zcmMoaWQpIHtcbiAgICByZXR1cm4gJ2h0dHBzOi8vY29pbnBhcHJpa2EuY29tL2NvaW4vJyArIGlkICsgJy9sb2dvLnBuZyc7XG4gIH1cbiAgXG4gIGNvaW5fbGluayhpZCkge1xuICAgIHJldHVybiAnaHR0cHM6Ly9jb2lucGFwcmlrYS5jb20vY29pbi8nICsgaWRcbiAgfVxuICBcbiAgbWFpbl9sb2dvX2xpbmsoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYXVsdHMuaW1nX3NyYyB8fCB0aGlzLmRlZmF1bHRzLm9yaWdpbl9zcmMgKyAnL2Rpc3QvaW1nL2xvZ29fd2lkZ2V0LnN2ZydcbiAgfVxuICBcbiAgZ2V0U2NyaXB0RWxlbWVudCgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0W2RhdGEtY3AtY3VycmVuY3ktd2lkZ2V0XScpO1xuICB9XG4gIFxuICBnZXRUcmFuc2xhdGlvbihpbmRleCwgbGFiZWwpIHtcbiAgICBsZXQgdGV4dCA9ICh0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1t0aGlzLnN0YXRlc1tpbmRleF0ubGFuZ3VhZ2VdKSA/IHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW3RoaXMuc3RhdGVzW2luZGV4XS5sYW5ndWFnZV1bbGFiZWxdIDogbnVsbDtcbiAgICBpZiAoIXRleHQgJiYgdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbJ2VuJ10pIHtcbiAgICAgIHRleHQgPSB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1snZW4nXVtsYWJlbF07XG4gICAgfVxuICAgIGlmICghdGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMuYWRkTGFiZWxXaXRob3V0VHJhbnNsYXRpb24oaW5kZXgsIGxhYmVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9XG4gIFxuICBhZGRMYWJlbFdpdGhvdXRUcmFuc2xhdGlvbihpbmRleCwgbGFiZWwpIHtcbiAgICBpZiAoIXRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zWydlbiddKSB0aGlzLmdldFRyYW5zbGF0aW9ucygnZW4nKTtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZXNbaW5kZXhdLm5vVHJhbnNsYXRpb25MYWJlbHMucHVzaChsYWJlbCk7XG4gIH1cbiAgXG4gIGdldFRyYW5zbGF0aW9ucyhsYW5nKSB7XG4gICAgaWYgKCF0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXSkge1xuICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgbGV0IHVybCA9IHRoaXMuZGVmYXVsdHMubGFuZ19zcmMgfHwgdGhpcy5kZWZhdWx0cy5vcmlnaW5fc3JjICsgJy9kaXN0L2xhbmcnO1xuICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCArICcvJyArIGxhbmcgKyAnLmpzb24nKTtcbiAgICAgIHhoci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVdpZGdldFRyYW5zbGF0aW9ucyhsYW5nLCBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9uRXJyb3JSZXF1ZXN0KDAsIHhocik7XG4gICAgICAgICAgdGhpcy5nZXRUcmFuc2xhdGlvbnMoJ2VuJyk7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuZGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgeGhyLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMub25FcnJvclJlcXVlc3QoMCwgeGhyKTtcbiAgICAgICAgdGhpcy5nZXRUcmFuc2xhdGlvbnMoJ2VuJyk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmRlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXTtcbiAgICAgIH07XG4gICAgICB4aHIuc2VuZCgpO1xuICAgICAgdGhpcy5kZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ10gPSB7fTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3Mgd2lkZ2V0Q29udHJvbGxlciB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy53aWRnZXRzID0gbmV3IHdpZGdldHNDbGFzcygpO1xuICAgIHRoaXMuYmluZCgpO1xuICB9XG4gIFxuICBiaW5kKCl7XG4gICAgd2luZG93W3RoaXMud2lkZ2V0cy5kZWZhdWx0cy5vYmplY3ROYW1lXSA9IHt9O1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB0aGlzLmluaXRXaWRnZXRzKCksIGZhbHNlKTtcbiAgICB3aW5kb3dbdGhpcy53aWRnZXRzLmRlZmF1bHRzLm9iamVjdE5hbWVdLmJpbmRXaWRnZXQgPSAoKSA9PiB7XG4gICAgICB3aW5kb3dbdGhpcy53aWRnZXRzLmRlZmF1bHRzLm9iamVjdE5hbWVdLmluaXQgPSBmYWxzZTtcbiAgICAgIHRoaXMuaW5pdFdpZGdldHMoKTtcbiAgICB9O1xuICB9XG4gIFxuICBpbml0V2lkZ2V0cygpe1xuICAgIGlmICghd2luZG93W3RoaXMud2lkZ2V0cy5kZWZhdWx0cy5vYmplY3ROYW1lXS5pbml0KXtcbiAgICAgIHdpbmRvd1t0aGlzLndpZGdldHMuZGVmYXVsdHMub2JqZWN0TmFtZV0uaW5pdCA9IHRydWU7XG4gICAgICBsZXQgbWFpbkVsZW1lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0aGlzLndpZGdldHMuZGVmYXVsdHMuY2xhc3NOYW1lKSk7XG4gICAgICB0aGlzLndpZGdldHMuc2V0V2lkZ2V0Q2xhc3MobWFpbkVsZW1lbnRzKTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMud2lkZ2V0cy5zZXRXaWRnZXRDbGFzcyhtYWluRWxlbWVudHMpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1haW5FbGVtZW50cy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgdGhpcy53aWRnZXRzLnNldEJlZm9yZUVsZW1lbnRJbkZvb3RlcihpKTtcbiAgICAgICAgfVxuICAgICAgfSwgZmFsc2UpO1xuICAgICAgbGV0IHNjcmlwdEVsZW1lbnQgPSB0aGlzLndpZGdldHMuZ2V0U2NyaXB0RWxlbWVudCgpO1xuICAgICAgaWYgKHNjcmlwdEVsZW1lbnQgJiYgc2NyaXB0RWxlbWVudC5kYXRhc2V0ICYmIHNjcmlwdEVsZW1lbnQuZGF0YXNldC5jcEN1cnJlbmN5V2lkZ2V0KXtcbiAgICAgICAgbGV0IGRhdGFzZXQgPSBKU09OLnBhcnNlKHNjcmlwdEVsZW1lbnQuZGF0YXNldC5jcEN1cnJlbmN5V2lkZ2V0KTtcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGRhdGFzZXQpKXtcbiAgICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKGRhdGFzZXQpO1xuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwga2V5cy5sZW5ndGg7IGorKyl7XG4gICAgICAgICAgICBsZXQga2V5ID0ga2V5c1tqXS5yZXBsYWNlKCctJywgJ18nKTtcbiAgICAgICAgICAgIHRoaXMud2lkZ2V0cy5kZWZhdWx0c1trZXldID0gZGF0YXNldFtrZXlzW2pdXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLndpZGdldHMuc3RhdGVzID0gW107XG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBtYWluRWxlbWVudHMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgIGxldCBuZXdTZXR0aW5ncyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy53aWRnZXRzLmRlZmF1bHRzKSk7XG4gICAgICAgICAgbmV3U2V0dGluZ3MuaXNXb3JkcHJlc3MgPSBtYWluRWxlbWVudHNbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKCd3b3JkcHJlc3MnKTtcbiAgICAgICAgICBuZXdTZXR0aW5ncy5tYWluRWxlbWVudCA9IG1haW5FbGVtZW50c1tpXTtcbiAgICAgICAgICB0aGlzLndpZGdldHMuc3RhdGVzLnB1c2gobmV3U2V0dGluZ3MpO1xuICAgICAgICAgIHRoaXMud2lkZ2V0cy5pbml0KGkpO1xuICAgICAgICB9XG4gICAgICB9LCA1MCk7XG4gICAgfVxuICB9XG59XG5cbm5ldyB3aWRnZXRDb250cm9sbGVyKCk7Il19
