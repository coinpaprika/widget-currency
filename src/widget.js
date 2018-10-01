class widgetsController {
  constructor() {
    this.widgets = new widgetsClass();
    this.bind();
  }
  
  bind(){
    window[this.widgets.defaults.objectName] = {};
    document.addEventListener('DOMContentLoaded', () => this.initWidgets(), false);
    window[this.widgets.defaults.objectName].bindWidget = () => {
      window[this.widgets.defaults.objectName].init = false;
      this.initWidgets();
    };
  }
  
  initWidgets(){
    if (!window[this.widgets.defaults.objectName].init){
      window[this.widgets.defaults.objectName].init = true;
      let mainElements = Array.prototype.slice.call(document.getElementsByClassName(this.widgets.defaults.className));
      this.widgets.setWidgetClass(mainElements);
      window.addEventListener('resize', () => {
        this.widgets.setWidgetClass(mainElements);
        for (let i = 0; i < mainElements.length; i++){
          this.widgets.setBeforeElementInFooter(i);
        }
      }, false);
      let scriptElement = this.widgets.getScriptElement();
      if (scriptElement && scriptElement.dataset && scriptElement.dataset.cpCurrencyWidget){
        let dataset = JSON.parse(scriptElement.dataset.cpCurrencyWidget);
        if (Object.keys(dataset)){
          let keys = Object.keys(dataset);
          for (let j = 0; j < keys.length; j++){
            let key = keys[j].replace('-', '_');
            this.widgets.defaults[key] = dataset[keys[j]];
          }
        }
      }
      setTimeout(() => {
        this.widgets.states = [];
        return cpBootstrap.loop(mainElements, (element, index) => {
          let newSettings = JSON.parse(JSON.stringify(this.widgets.defaults));
          newSettings.isWordpress = element.classList.contains('wordpress');
          newSettings.mainElement = element;
          this.widgets.states.push(newSettings);
          let promise = Promise.resolve();
          promise = promise.then(() => {
            let chartScripts = [
              'http://code.highcharts.com/stock/highstock.js',
              'https://code.highcharts.com/modules/exporting.js',
              'https://code.highcharts.com/modules/no-data-to-display.js',
              'https://code.highcharts.com/modules/offline-exporting.js',
            ];
            return (newSettings.modules.indexOf('chart') > -1 && !window.Highcharts)
              ? cpBootstrap.loop(chartScripts, link => {
                  return fetchService.fetchScript(link);
                })
              : null;
          });
          promise = promise.then(() => {
            return this.widgets.init(index);
          });
          return promise;
        });
      }, 50);
    }
  }
}

class widgetsClass {
  constructor() {
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
        market_cap_change_24h: undefined,
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
        m: 370,
      },
    };
  }
  
  init(index) {
    if (!this.getMainElement(index)) {
      return console.error('Bind failed, no element with class = "' + this.defaults.className + '"');
    }
    this.getDefaults(index);
    this.setOriginLink(index);
  }
  
  setWidgetClass(elements) {
    for (let i = 0; i < elements.length; i++) {
      let width = elements[i].getBoundingClientRect().width;
      let rwdKeys = Object.keys(this.defaults.rwd);
      for (let j = 0; j < rwdKeys.length; j++) {
        let rwdKey = rwdKeys[j];
        let rwdParam = this.defaults.rwd[rwdKey];
        let className = this.defaults.className + '__' + rwdKey;
        if (width <= rwdParam) elements[i].classList.add(className);
        if (width > rwdParam) elements[i].classList.remove(className);
      }
    }
  }
  
  getMainElement(index) {
    return (this.states[index]) ? this.states[index].mainElement : null;
  }
  
  getDefaults(index) {
    let mainElement = this.getMainElement(index);
    if (mainElement && mainElement.dataset) {
      if (!mainElement.dataset.modules && mainElement.dataset.version === 'extended') this.updateData(index, 'modules', ['market_details']);
      if (!mainElement.dataset.modules && mainElement.dataset.version === 'standard') this.updateData(index, 'modules', []);
      if (mainElement.dataset.modules) this.updateData(index, 'modules', JSON.parse(mainElement.dataset.modules));
      if (mainElement.dataset.primaryCurrency) this.updateData(index, 'primary_currency', mainElement.dataset.primaryCurrency);
      if (mainElement.dataset.currency) this.updateData(index, 'currency', mainElement.dataset.currency);
      if (mainElement.dataset.showDetailsCurrency) this.updateData(index, 'show_details_currency', (mainElement.dataset.showDetailsCurrency === 'true'));
      if (mainElement.dataset.updateActive) this.updateData(index, 'update_active', (mainElement.dataset.updateActive === 'true'));
      if (mainElement.dataset.updateTimeout) this.updateData(index, 'update_timeout', cpBootstrap.parseIntervalValue(mainElement.dataset.updateTimeout));
      if (mainElement.dataset.language) this.updateData(index, 'language', mainElement.dataset.language);
      if (mainElement.dataset.originSrc) this.updateData(index, 'origin_src', mainElement.dataset.originSrc);
      if (mainElement.dataset.nodeModulesSrc) this.updateData(index, 'node_modules_src', mainElement.dataset.nodeModulesSrc);
      if (mainElement.dataset.bowerSrc) this.updateData(index, 'bower_src', mainElement.dataset.bowerSrc);
      if (mainElement.dataset.styleSrc) this.updateData(index, 'style_src', mainElement.dataset.styleSrc);
      if (mainElement.dataset.langSrc) this.updateData(index, 'logo_src', mainElement.dataset.langSrc);
      if (mainElement.dataset.imgSrc) this.updateData(index, 'logo_src', mainElement.dataset.imgSrc);
    }
  }
  
  setOriginLink(index) {
    if (Object.keys(this.defaults.translations).length === 0) this.getTranslations(this.defaults.language);
    this.stylesheet();
    setTimeout(() => {
      this.addWidgetElement(index);
      this.initInterval(index);
    }, 100);
  }
  
  addWidgetElement(index) {
    let mainElement = this.getMainElement(index);
    let modules = '';
    let chartContainer = null;
    let promise = Promise.resolve();
    promise = promise.then(() => {
      return cpBootstrap.loop(this.states[index].modules, module => {
        let label = null;
        if (module === 'chart') label = 'Chart';
        if (module === 'market_details') label = 'MarketDetails';
        return (label) ? this[`widget${ label }Element`](index).then(result => modules += result) : null;
      });
    });
    promise = promise.then(() => {
      return mainElement.innerHTML = this.widgetMainElement(index) + modules + this.widgetFooter(index);
    });
    promise = promise.then(() => {
      chartContainer = document.getElementById(`${ this.defaults.className }-price-chart-${ index }`);
      console.log(chartContainer);
      return (chartContainer) ? chartContainer.parentElement.insertAdjacentHTML('beforeend', this.widgetSelectElement(index, 'range')) : null;
    });
    promise = promise.then(() => {
      if (chartContainer){
        this.states[index].chart = new chartClass(chartContainer, this.states[index]);
        this.setSelectListeners(index);
      }
      return null;
    });
    
    promise = promise.then(() => {
      return this.setBeforeElementInFooter(index);
    });
    promise = promise.then(() => {
      return this.getData(index);
    });
    return promise;
  }
  
  setSelectListeners(index){
    let mainElement = this.getMainElement(index);
    let selectElements = mainElement.querySelectorAll('.cp-widget-select');
    for (let i = 0; i < selectElements.length; i++){
      let buttons = selectElements[i].querySelectorAll('.cp-widget-select__options button');
      for (let j = 0; j < buttons.length; j++){
        buttons[j].addEventListener('click', (event) => {
          this.setSelectOption(event, index);
        }, false);
      }
    }
  }
  
  setSelectOption(event, index){
    let className = 'cp-widget-active';
    for (let i = 0; i < event.target.parentNode.childNodes.length; i++){
      let sibling = event.target.parentNode.childNodes[i];
      if (sibling.classList.contains(className)) sibling.classList.remove(className);
    }
    let parent = event.target.closest('.cp-widget-select');
    let type = parent.dataset.type;
    let pickedValueElement = parent.querySelector('.cp-widget-select__options > span');
    let value = event.target.dataset.option;
    pickedValueElement.innerText = this.getTranslation(index, value.toLowerCase());
    this.updateData(index, type, value);
    event.target.classList.add(className);
    this.dispatchEvent(index, '-switch-range', value);
  }
  
  dispatchEvent(index, name, data){
    let id = `${ this.defaults.className }-price-chart-${ index }`;
    return document.dispatchEvent(new CustomEvent(`${id}${name}`, { detail: { data } }));
  }
  
  getData(index) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.coinpaprika.com/v1/widget/' + this.states[index].currency + '?quote=' + this.states[index].primary_currency);
    xhr.onload = () => {
      if (xhr.status === 200) {
        if (!this.states[index].isData) this.updateData(index, 'isData', true);
        this.updateTicker(index, JSON.parse(xhr.responseText));
      }
      else {
        this.onErrorRequest(index, xhr);
      }
    };
    xhr.onerror = () => {
      this.onErrorRequest(index, xhr);
    };
    xhr.send();
  }
  
  onErrorRequest(index, xhr) {
    if (this.states[index].isData) this.updateData(index, 'isData', false);
    this.updateData(index, 'message', 'data_unavailable');
    console.error('Request failed.  Returned status of ' + xhr, this.states[index]);
  }
  
  initInterval(index) {
    clearInterval(this.states[index].interval);
    if (this.states[index].update_active && this.states[index].update_timeout > 1000) {
      this.states[index].interval = setInterval(() => {
        this.getData(index);
      }, this.states[index].update_timeout);
    }
  }
  
  setBeforeElementInFooter(index) {
    if (!this.states[index].isWordpress) {
      let mainElement = this.getMainElement(index);
      if (mainElement) {
        if (mainElement.children[0].localName === 'style') {
          mainElement.removeChild(mainElement.childNodes[0]);
        }
        let footerElement = mainElement.querySelector('.cp-widget__footer');
        let value = footerElement.getBoundingClientRect().width - 43;
        for (let i = 0; i < footerElement.childNodes.length; i++) {
          value -= footerElement.childNodes[i].getBoundingClientRect().width;
        }
        let style = document.createElement('style');
        style.innerHTML = '.cp-widget__footer--' + index + '::before{width:' + value.toFixed(0) + 'px;}';
        mainElement.insertBefore(style, mainElement.children[0]);
      }
    }
  }
  
  updateWidgetElement(index, key, value, ticker) {
    let state = this.states[index];
    let mainElement = this.getMainElement(index);
    if (mainElement) {
      let tickerClass = (ticker) ? 'Ticker' : '';
      if (key === 'name' || key === 'currency') {
        if (key === 'currency') {
          let aElements = mainElement.querySelectorAll('.cp-widget__footer > a');
          for (let k = 0; k < aElements.length; k++) {
            aElements[k].href = this.coin_link(value);
          }
        }
        this.getImage(index);
      }
      if (key === 'isData' || key === 'message') {
        let headerElements = mainElement.querySelectorAll('.cp-widget__main');
        for (let k = 0; k < headerElements.length; k++) {
          headerElements[k].innerHTML = (!state.isData) ? this.widgetMainElementMessage(index) : this.widgetMainElementData(index);
        }
      } else {
        let updateElements = mainElement.querySelectorAll('.' + key + tickerClass);
        for (let j = 0; j < updateElements.length; j++) {
          let updateElement = updateElements[j];
          if (updateElement.classList.contains('cp-widget__rank')) {
            let className = (parseFloat(value) > 0) ? "cp-widget__rank-up" : ((parseFloat(value) < 0) ? "cp-widget__rank-down" : "cp-widget__rank-neutral");
            updateElement.classList.remove('cp-widget__rank-down');
            updateElement.classList.remove('cp-widget__rank-up');
            updateElement.classList.remove('cp-widget__rank-neutral');
            if (value === undefined) {
              value = cpBootstrap.emptyData;
            } else {
              updateElement.classList.add(className);
              value = (key === 'price_change_24h') ? '(' + cpBootstrap.round(value, 2) + '%)' : cpBootstrap.round(value, 2) + '%';
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
  
  updateData(index, key, value, ticker) {
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
  
  updateWidgetTranslations(lang, data) {
    this.defaults.translations[lang] = data;
    for (let x = 0; x < this.states.length; x++) {
      let isNoTranslationLabelsUpdate = this.states[x].noTranslationLabels.length > 0 && lang === 'en';
      if (this.states[x].language === lang || isNoTranslationLabelsUpdate) {
        let mainElement = this.states[x].mainElement;
        let transalteElements = Array.prototype.slice.call(mainElement.querySelectorAll('.cp-translation'));
        for (let y = 0; y < transalteElements.length; y++) {
          transalteElements[y].classList.forEach((className) => {
            if (className.search('translation_') > -1) {
              let translateKey = className.replace('translation_', '');
              if (translateKey === 'message') translateKey = this.states[x].message;
              let labelIndex = this.states[x].noTranslationLabels.indexOf(translateKey);
              let text = this.getTranslation(x, translateKey);
              if (labelIndex > -1 && text) {
                this.states[x].noTranslationLabels.splice(labelIndex, 1)
              }
              transalteElements[y].innerText = text;
              if (transalteElements[y].closest('.cp-widget__footer')) {
                setTimeout(() => this.setBeforeElementInFooter(x), 50);
              }
            }
          })
        }
      }
    }
  }
  
  updateTicker(index, data) {
    let dataKeys = Object.keys(data);
    for (let i = 0; i < dataKeys.length; i++) {
      this.updateData(index, dataKeys[i], data[dataKeys[i]], true);
    }
  }
  
  stylesheet() {
    if (this.defaults.style_src !== false) {
      let url = this.defaults.style_src || this.defaults.origin_src + '/dist/' + this.defaults.cssFileName;
      let link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', url);
      return (document.body.querySelector('link[href="' + url + '"]')) ? '' : document.body.appendChild(link);
    }
  }
  
  widgetMainElement(index) {
    let data = this.states[index];
    return '<div class="cp-widget__header">' +
      '<div class="' + 'cp-widget__img cp-widget__img-' + data.currency + '">' +
      '<img/>' +
      '</div>' +
      '<div class="cp-widget__main">' +
      ((data.isData) ? this.widgetMainElementData(index) : this.widgetMainElementMessage(index)) +
      '</div>' +
      '</div>';
  }
  
  widgetMainElementData(index) {
    let data = this.states[index];
    return '<h3><a href="' + this.coin_link(data.currency) + '">' +
      '<span class="nameTicker">' + (data.ticker.name || cpBootstrap.emptyData) + '</span>' +
      '<span class="symbolTicker">' + (data.ticker.symbol || cpBootstrap.emptyData) + '</span>' +
      '</a></h3>' +
      '<strong>' +
      '<span class="priceTicker parseNumber">' + (cpBootstrap.parseNumber(data.ticker.price) || cpBootstrap.emptyData) + '</span> ' +
      '<span class="primaryCurrency">' + data.primary_currency + ' </span>' +
      '<span class="price_change_24hTicker cp-widget__rank cp-widget__rank-' + ((data.ticker.price_change_24h > 0) ? "up" : ((data.ticker.price_change_24h < 0) ? "down" : "neutral")) + '">(' + (cpBootstrap.round(data.ticker.price_change_24h, 2) || cpBootstrap.emptyValue) + '%)</span>' +
      '</strong>' +
      '<span class="cp-widget__rank-label"><span class="cp-translation translation_rank">' + this.getTranslation(index, "rank") + '</span> <span class="rankTicker">' + (data.ticker.rank || cpBootstrap.emptyData) + '</span></span>';
  }
  
  widgetMainElementMessage(index) {
    let message = this.states[index].message;
    return '<div class="cp-widget__main-no-data cp-translation translation_message">' + (this.getTranslation(index, message)) + '</div>';
  }
  
  widgetMarketDetailsElement(index) {
    return Promise.resolve((this.states[index].modules.indexOf('market_details') > -1) ? '<div class="cp-widget__details">' +
      this.widgetAthElement(index) +
      this.widgetVolume24hElement(index) +
      this.widgetMarketCapElement(index) +
      '</div>' : '');
  }
  
  widgetAthElement(index) {
    return '<div>' +
      '<small class="cp-translation translation_ath">' + this.getTranslation(index, "ath") + '</small>' +
      '<div>' +
      '<span class="price_athTicker parseNumber">' + cpBootstrap.emptyData + ' </span>' +
      '<span class="symbolTicker showDetailsCurrency"></span>' +
      '</div>' +
      '<span class="percent_from_price_athTicker cp-widget__rank">' + cpBootstrap.emptyData + '</span>' +
      '</div>'
  }
  
  widgetVolume24hElement(index) {
    return '<div>' +
      '<small class="cp-translation translation_volume_24h">' + this.getTranslation(index, "volume_24h") + '</small>' +
      '<div>' +
      '<span class="volume_24hTicker parseNumber">' + cpBootstrap.emptyData + ' </span>' +
      '<span class="symbolTicker showDetailsCurrency"></span>' +
      '</div>' +
      '<span class="volume_24h_change_24hTicker cp-widget__rank">' + cpBootstrap.emptyData + '</span>' +
      '</div>';
  }
  
  widgetMarketCapElement(index) {
    return '<div>' +
      '<small class="cp-translation translation_market_cap">' + this.getTranslation(index, "market_cap") + '</small>' +
      '<div>' +
      '<span class="market_capTicker parseNumber">' + cpBootstrap.emptyData + ' </span>' +
      '<span class="symbolTicker showDetailsCurrency"></span>' +
      '</div>' +
      '<span class="market_cap_change_24hTicker cp-widget__rank">' + cpBootstrap.emptyData + '</span>' +
      '</div>';
  }
  
  widgetChartElement(index) {
    return Promise.resolve(
      `<div class="cp-widget__chart"><div id="${ this.defaults.className }-price-chart-${ index }"></div></div>`
    );
  }
  
  widgetSelectElement(index, label){
    let buttons = '';
    for (let i = 0; i < this.states[index][label+'_list'].length; i++){
      let data = this.states[index][label+'_list'][i];
      buttons += '<button class="'+ ((data.toLowerCase() === this.states[index][label].toLowerCase())
        ? 'cp-widget-active '
        : '') + ((label === 'primary_currency') ? '' : 'cp-translation translation_' + data.toLowerCase()) +'" data-option="'+data+'">'+this.getTranslation(index, data.toLowerCase())+'</button>'
    }
    if (label === 'range') ;
    let title = this.getTranslation(index, "zoom_in");
    return '<div data-type="'+label+'" class="cp-widget-select">' +
      '<label class="cp-translation translation_'+ label +'">'+title+'</label>' +
      '<div class="cp-widget-select__options">' +
      '<span class="arrow-down '+ 'cp-widget__capitalize cp-translation translation_' + this.states[index][label].toLowerCase() +'">'+ this.getTranslation(index, this.states[index][label].toLowerCase()) +'</span>' +
      '<div class="cp-widget-select__dropdown">' +
      buttons +
      '</div>' +
      '</div>' +
      '</div>';
  }
  
  widgetFooter(index) {
    let currency = this.states[index].currency;
    return (!this.states[index].isWordpress)
      ? '<p class="cp-widget__footer cp-widget__footer--' + index + '">' +
      '<span class="cp-translation translation_powered_by">' + this.getTranslation(index, "powered_by") + ' </span>' +
      '<img style="width: 16px" src="' + this.main_logo_link() + '" alt=""/>' +
      '<a target="_blank" href="' + this.coin_link(currency) + '">coinpaprika.com</a>' +
      '</p>'
      : '';
  }
  
  getImage(index) {
    let data = this.states[index];
    let imgContainers = data.mainElement.getElementsByClassName('cp-widget__img');
    for (let i = 0; i < imgContainers.length; i++) {
      let imgContainer = imgContainers[i];
      imgContainer.classList.add('cp-widget__img--hidden');
      let img = imgContainer.querySelector('img');
      let newImg = new Image;
      newImg.onload = () => {
        img.src = newImg.src;
        imgContainer.classList.remove('cp-widget__img--hidden');
      };
      newImg.src = this.img_src(data.currency);
    }
  }
  
  img_src(id) {
    return 'https://coinpaprika.com/coin/' + id + '/logo.png';
  }
  
  coin_link(id) {
    return 'https://coinpaprika.com/coin/' + id
  }
  
  main_logo_link() {
    return this.defaults.img_src || this.defaults.origin_src + '/dist/img/logo_widget.svg'
  }
  
  getScriptElement() {
    return document.querySelector('script[data-cp-currency-widget]');
  }
  
  getTranslation(index, label) {
    let text = (this.defaults.translations[this.states[index].language]) ? this.defaults.translations[this.states[index].language][label] : null;
    if (!text && this.defaults.translations['en']) {
      text = this.defaults.translations['en'][label];
    }
    if (!text) {
      return this.addLabelWithoutTranslation(index, label);
    } else {
      return text;
    }
  }
  
  addLabelWithoutTranslation(index, label) {
    if (!this.defaults.translations['en']) this.getTranslations('en');
    return this.states[index].noTranslationLabels.push(label);
  }
  
  getTranslations(lang) {
    if (!this.defaults.translations[lang]) {
      let xhr = new XMLHttpRequest();
      let url = this.defaults.lang_src || this.defaults.origin_src + '/dist/lang';
      xhr.open('GET', url + '/' + lang + '.json');
      xhr.onload = () => {
        if (xhr.status === 200) {
          this.updateWidgetTranslations(lang, JSON.parse(xhr.responseText));
        }
        else {
          this.onErrorRequest(0, xhr);
          this.getTranslations('en');
          delete this.defaults.translations[lang];
        }
      };
      xhr.onerror = () => {
        this.onErrorRequest(0, xhr);
        this.getTranslations('en');
        delete this.defaults.translations[lang];
      };
      xhr.send();
      this.defaults.translations[lang] = {};
    }
  }
}

class chartClass {
  constructor(container, state){
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
          fontFamily: 'sans-serif',
        },
        events: {
          render: (e) => {
            if (e.target.annotations) {
              let chart = e.target.annotations.chart;
              cpBootstrap.loop(chart.annotations.allItems, annotation => {
                let y = chart.plotHeight + chart.plotTop - chart.spacing[0] - 2 - ((this.isResponsiveModeActive(chart)) ? 10 : 0);
                annotation.update({y}, true);
              });
            }
          },
        },
      },
      scrollbar: {
        enabled: false,
      },
      annotationsOptions: {
        enabledButtons: false,
      },
      rangeSelector: {
        enabled: false,
      },
      plotOptions: {
        line: {
          series: {
            states: {
              hover: {
                enabled: false,
              },
            },
          },
        },
        series: {
          events: {
            legendItemClick: (event) => {
              if (event.browserEvent.isTrusted){
                if (this.chartsWithActiveSeriesCookies.indexOf(event.target.chart.renderTo.id) > -1) this.setVisibleChartCookies(event);
              }
              // On iOS touch event fires second callback from JS (isTrusted: false) which
              // results with toggle back the chart (probably its a problem with UIKit, but not sure)
              // console.log('legendItemClick', {event, isTrusted: event.browserEvent.isTrusted});
              return event.browserEvent.isTrusted;
            },
          }
        },
      },
      xAxis: {
        ordinal: false
      }
    };
    this.chartDataParser = (data, dataType) => {
      let priceCurrency = state.primary_currency.toLowerCase();
      data = data[0];
      let newData = {
        data: {
          price: (data[priceCurrency]) ? data[priceCurrency] : [],
          volume: data.volume,
        }
      };
      console.log({data, dataType, state, priceCurrency, newData});
      return Promise.resolve(newData);
    };
    this.isEventsHidden = false;
    this.excludeSeriesIds = [];
    this.asyncUrl = `/currency/data/${ state.currency }/_range_/`;
    this.init();
  }
  
  setOptions(){
    const chartService = new chartClass();
    return {
      responsive: {
        rules: [
          {
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
                spacingBottom: 0,
              },
              navigator: {
                height: 50,
                margin: 70,
                handles: {
                  height: 25,
                  width: 17,
                }
              }
            }
          },
          {
            condition: {
              maxWidth: 600
            },
            chartOptions: {
              chart: {
                marginTop: 15,
                zoomType: "none",
                marginLeft: 10,
                marginRight: 10,
                height: 350,
              },
              yAxis: [
                {
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
                      fontSize: '9px',
                    },
                  }
                },
                {
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
                      fontSize: '9px',
                    },
                  }
                },
              ],
            },
          },
          {
            condition: {
              maxWidth: 374
            },
            chartOptions: {
              navigator: {
                margin: 90,
                height: 40,
                handles: {
                  height: 20,
                }
              }
            },
          }
        ]
      },
      title: {
        text: undefined,
      },
      chart: {
        backgroundColor: 'none',
        marginTop: 50,
        plotBorderWidth: 0,
      },
      cpEvents: false,
      colors: [
        '#5085ec',
        '#1f9809',
        '#985d65',
        '#ee983b',
        '#4c4c4c',
      ],
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
        itemMarginTop: 8,
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
        formatter: function(){
          return chartService.tooltipFormatter(this);
        },
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
        tickLength: 7,
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
        showFirstLabel: false,
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
        showFirstLabel: false,
      }],
      
      series: [
        { //order of the series matters
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
          showInLegend: false,
        },
        {
          color: '#838383' || `url(#fill-volume-chart)`,
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
            valueDecimals: 0,
          },
          showInNavigator: true,
        }]
    }
  }
  
  init(){
    let promise = Promise.resolve();
    promise = promise.then(() => {
      return this.parseOptions(this.options);
    });
    promise = promise.then((options) => {
      console.log({options});
      return (window.Highcharts) ? Highcharts.stockChart(this.container.id, options, (chart) => this.bind(chart)) : null;
    });
    return promise;
  }
  
  parseOptions(options){
    let promise = Promise.resolve();
    promise = promise.then(() => {
      return cpBootstrap.updateObject(this.defaultOptions, options);
    });
    promise = promise.then((newOptions) => {
      return cpBootstrap.updateObject(this.getVolumePattern(), newOptions);
    });
    promise = promise.then((newOptions) => {
      return this.setNavigator(newOptions);
    });
    promise = promise.then((newOptions) => {
      return (newOptions.noData) ? this.setNoDataLabel(newOptions) : newOptions;
    });
    promise = promise.then((newOptions) => {
      return newOptions;
    });
    return promise;
  }
  
  bind(chart){
    let promise = Promise.resolve();
    promise = promise.then(() => {
      return this.chart = chart;
    });
    promise = promise.then(() => {
      return this.fetchDataPackage();
    });
    promise = promise.then(() => {
      return this.setRangeSwitcher();
    });
    promise = promise.then(() => {
      return (this.callback) ? this.callback(this.chart, this.defaultRange) : null;
    });
    return promise;
  }
  
  fetchDataPackage(minDate, maxDate){
    let isPreciseRange = (minDate && maxDate);
    let promise = Promise.resolve();
    promise = promise.then(() => {
      if (this.options.cpEvents){
        let url = (isPreciseRange) ? this.getNavigatorExtremesUrl(minDate, maxDate, 'events') : this.getExtremesDataUrl(this.id, 'events') + '/' + this.getRange() + '/';
        return (url) ? this.fetchData(url, 'events', !isPreciseRange) : null;
      }
      return null;
    });
    promise = promise.then(() => {
      let url = (isPreciseRange) ? this.getNavigatorExtremesUrl(minDate, maxDate) : this.asyncUrl.replace('_range_', this.getRange());
      return (url) ? this.fetchData(url, 'data', !isPreciseRange) : null;
    });
    promise = promise.then(() => {
      return this.chart.redraw(false);
    });
    promise = promise.then(() => {
      return (!isPreciseRange) ? this.chart.zoomOut() : null;
    });
    promise = promise.then(() => {
      return this.isLoaded = true;
    });
    promise = promise.then(() => {
      return this.toggleEvents();
    });
    return promise;
  }
  
  fetchData(url, dataType = 'data', replace = true){
    let promise = Promise.resolve();
    promise = promise.then(() => {
      this.chart.showLoading();
      return fetchService.fetchChartData(url, !this.isLoaded);
    });
    promise = promise.then((response) => {
      this.chart.hideLoading();
      if (response.status !== 200) {
        return console.log(`Looks like there was a problem. Status Code: ${response.status}`);
      }
      return response.json().then(data => {
        let promise = Promise.resolve();
        promise = promise.then(() => {
          return this.dataParser(data, dataType);
        });
        promise = promise.then((content) => {
          return (replace) ? this.replaceData(content.data, dataType) : this.updateData(content.data, dataType);
        });
        return promise;
      });
    }).catch((error) => {
      this.chart.hideLoading();
      return console.log('Fetch Error', error);
    });
    return promise;
  }
  
  setRangeSwitcher(){
    document.addEventListener(`${ this.id }-switch-range`, (event) => {
      console.log(event);
      this.defaultRange = event.detail.data;
      return this.fetchDataPackage();
    });
  }
  
  getRange(){
    return this.defaultRange || '1q';
  }
  
  toggleEvents(){
    let promise = Promise.resolve();
    if (this.options.cpEvents){
      promise = promise.then(() => {
        return document.getElementsByClassName('highcharts-annotation');
      });
      promise = promise.then((elements) => {
        return cpBootstrap.loop(elements, element => {
          if (this.isEventsHidden){
            return (!element.classList.contains('highcharts-annotation__hidden')) ? element.classList.add('highcharts-annotation__hidden') : null;
          }
          return (element.classList.contains('highcharts-annotation__hidden')) ? element.classList.remove('highcharts-annotation__hidden') : null;
        })
      });
      promise = promise.then(() => {
        return document.getElementsByClassName('highcharts-plot-line');
      });
      promise = promise.then((elements) => {
        return cpBootstrap.loop(elements, element => {
          if (this.isEventsHidden){
            return (!element.classList.contains('highcharts-plot-line__hidden')) ? element.classList.add('highcharts-plot-line__hidden') : null;
          }
          return (element.classList.contains('highcharts-plot-line__hidden')) ? element.classList.remove('highcharts-plot-line__hidden') : null;
        })
      });
    }
    return promise;
  }
  
  dataParser(data, dataType = 'data'){
    switch (dataType){
      case 'data':
        let promiseData = Promise.resolve();
        promiseData = promiseData.then(() => {
          return (this.chartDataParser) ? this.chartDataParser(data) : {
            data: data[0],
          };
        });
        return promiseData;
      case 'events':
        return Promise.resolve(data);
      default:
        return null;
    }
  }
  
  updateData(data, dataType) {
    // console.log('-----------updateChartData', {data});
    let newData;
    let promise = Promise.resolve();
    promise = promise.then(() => {
      switch (dataType) {
        case 'data':
          newData = {};
          return cpBootstrap.loop(Object.entries(data), (value) => {
            if (this.isExcluded(value[0])) return;
            let oldData = this.getOldData(dataType)[value[0]];
            // console.log({oldData, value: value[0]});
            // value[1] = value[1].map(element => {
            //   element[2] = 'new';
            //   return element;
            // });
            newData[value[0]] = oldData
              .filter((element) => {
                return value[1].findIndex(findElement => this.isTheSameElement(element, findElement, dataType)) === -1;
              })
              .concat(value[1])
              .sort((data1, data2) => this.sortCondition(data1, data2, dataType));
          });
        case 'events':
          newData = [];
          let oldData = this.getOldData(dataType);
          return newData = oldData
            .filter((element) => {
              data.findIndex(findElement => this.isTheSameElement(element, findElement, dataType)) === -1;
            })
            .concat(data)
            .sort((data1, data2) => this.sortCondition(data1, data2, dataType));
        default:
          return false;
      }
    });
    promise = promise.then(() => {
      // console.log({newData});
      // console.log();
      return this.replaceData(newData, dataType);
    });
    return promise;
  }
  
  isTheSameElement(elementA, elementB, dataType){
    switch (dataType){
      case 'data':
        return elementA[0] === elementB[0];
      case 'events':
        return elementA.ts === elementB.ts;
      default:
        return false;
    }
  }
  
  sortCondition(elementA, elementB, dataType){
    switch (dataType){
      case 'data':
        return elementA[0] - elementB[0];
      case 'events':
        return elementA.ts - elementB.ts;
      default:
        return false;
    }
  }
  
  getOldData(dataType){
    return this['chart_'+dataType.toLowerCase()];
  }
  
  replaceData(data, dataType){
    let promise = Promise.resolve();
    promise = promise.then(() => {
      return this['chart_'+dataType.toLowerCase()] = data;
    });
    promise = promise.then(() => {
      return this.replaceDataType(data, dataType);
    });
    promise = promise.then(() => {
      return (this.replaceCallback) ? this.replaceCallback(this.chart, data, this.isLoaded, dataType) : null;
    });
    return promise;
  }
  
  replaceDataType(data, dataType){
    switch (dataType){
      case 'data':
        if (this.asyncUrl){
          cpBootstrap.loop(['btc-bitcoin', 'eth-ethereum'], coinName => {
            let coinShort = coinName.split('-')[0];
            if (this.asyncUrl.search(coinName) > -1 && data[coinShort]) {
              data[coinShort] = [];
              cpBootstrap.loop(this.chart.series, series => {
                if (series.userOptions.id === coinShort) series.update({ visible: false });
              });
            }
          });
        }
        return cpBootstrap.loop(Object.entries(data), (value) => {
          if (this.isExcluded(value[0])) return;
          return (this.chart.get(value[0])) ? this.chart.get(value[0]).setData(value[1], false, false, false) : this.chart.addSeries({id: value[0], data: value[1], showInNavigator: true});
        });
      case 'events':
        let promise = Promise.resolve();
        promise = promise.then(() => {
          return cpBootstrap.loop(this.chart.annotations.allItems, annotation => {
            return annotation.destroy();
          });
        });
        promise = promise.then(() => {
          return this.setAnnotationsObjects(data);
        });
        return promise;
      default:
        return null;
    }
  }
  
  isExcluded(label){
    return this.excludeSeriesIds.indexOf(label) > -1;
  }
  
  tooltipFormatter(pointer, label = '', search){
    if (!search) search = label;
    const header = '<div class="cp-chart-tooltip-currency"><small>'+new Date(pointer.x).toUTCString()+'</small><table>';
    const footer = '</table></div>';
    let content = '';
    pointer.points.forEach(point => {
      content += '<tr>' +
        '<td>' +
        '<svg width="5" height="5"><rect x="0" y="0" width="5" height="5" fill="'+point.series.color+'" fill-opacity="1"></rect></svg>' +
        point.series.name + ': ' + point.y.toLocaleString('ru-RU', { maximumFractionDigits: 8 }) + ' ' + ((point.series.name.toLowerCase().search(search.toLowerCase()) > -1) ? "" : label) +
        '</td>' +
        '</tr>';
    });
    return header + content + footer;
  }
  
  setAnnotationsObjects(data){
    this.chart.series[0].xAxis.removePlotLine();
    let plotLines = [];
    let promise = Promise.resolve();
    promise = promise.then(() => {
      return data.sort((data1, data2) => {
        return data2.ts - data1.ts;
      });
    });
    promise = promise.then(() => {
      return cpBootstrap.loop(data, element => {
        let promise = Promise.resolve();
        promise = promise.then(() => {
          return plotLines.push({
            width: 1,
            value: element.ts,
            dashStyle: 'solid',
            zIndex: 4,
            color: this.getEventTagParams().color,
          });
        });
        promise = promise.then(() => {
          return this.chart.addAnnotation({
            xValue: element.ts,
            y: 0,
            title: `<span title="Click to open" class="cp-chart-annotation__text">${ this.getEventTagParams(element.tag).label }</span><span class="cp-chart-annotation__dataElement" style="display: none;">${ JSON.stringify(element) }</span>`,
            shape: {
              type: 'circle',
              params: {
                r: 11,
                cx: 9,
                cy: 10.5,
                'stroke-width': 1.5,
                fill: this.getEventTagParams().color,
              },
            },
            events: {
              mouseover: (event) => {
                if (MobileDetect.isMobile()) return;
                let data = this.getEventDataFromAnnotationEvent(event);
                this.openEventContainer(data, event);
              },
              mouseout: () => {
                if (MobileDetect.isMobile()) return;
                this.closeEventContainer(event);
              },
              click: (event) => {
                let data = this.getEventDataFromAnnotationEvent(event);
                if (MobileDetect.isMobile()) {
                  this.openEventContainer(data, event);
                } else {
                  this.openEventPage(data);
                }
              }
            }
          });
        });
        return promise;
      });
    });
    promise = promise.then(() => {
      return this.chart.series[0].xAxis.update({
        plotLines,
      }, false);
    });
    return promise;
  }
  
  setNavigator(options){
    let navigatorOptions = {};
    let promise = Promise.resolve();
    promise = promise.then(() => {
      if (options.navigator === true){
        navigatorOptions = {
          navigator: {
            enable: true,
            margin: 20,
            series: {
              lineWidth: 1,
            },
            maskFill: 'rgba(102,133,194,0.15)',
          },
          chart: {
            zoomType: 'x',
          },
          xAxis: {
            events: {
              setExtremes: (e) => {
                // console.log({e, xthis: this});
                if ((e.trigger === 'navigator' || e.trigger === 'zoom') && e.min && e.max) {
                  document.dispatchEvent(new CustomEvent(this.id+'SetExtremes', {
                    detail: {
                      minDate: e.min,
                      maxDate: e.max,
                      e,
                    }
                  }));
                }
              },
            },
          },
        };
        this.navigatorExtremesListener();
        this.setResetZoomButton();
      } else if (!options.navigator) {
        navigatorOptions = {
          navigator: {
            enabled: false,
          },
        };
      }
      return cpBootstrap.updateObject(options, navigatorOptions);
    });
    return promise;
  }
  
  setResetZoomButton(){
    // return Promise.resolve(); // cant be positioned properly in plotBox, so its disabled
    let promise = Promise.resolve();
    promise = promise.then(() => {
      return this.addContainer(this.id, 'ResetZoom', 'cp-chart-reset-zoom', 'button')
    });
    promise = promise.then(() => {
      return this.getContainer('ResetZoom');
    });
    promise = promise.then((element) => {
      element.classList.add('uk-button');
      element.innerText = 'Reset zoom';
      return element.addEventListener('click', () => {
        this.chart.zoomOut();
      });
    });
    return promise;
  }
  
  navigatorExtremesListener() {
    let promise = Promise.resolve();
    promise = promise.then(() => {
      return document.addEventListener(this.id + 'SetExtremes', (e) => {
        let minDate = cpBootstrap.round(e.detail.minDate / 1000, 0);
        let maxDate = cpBootstrap.round(e.detail.maxDate / 1000, 0);
        let promise = Promise.resolve();
        promise = promise.then(() => {
          return this.fetchDataPackage(minDate, maxDate);
        });
        return promise;
      });
    });
    return promise;
  }
  
  getNavigatorExtremesUrl(minDate, maxDate, dataType){
    let extremesDataUrl = (dataType) ? this.getExtremesDataUrl(this.id, dataType) : this.extremesDataUrl;
    return (minDate && maxDate && extremesDataUrl) ? extremesDataUrl +'/dates/'+minDate+'/'+maxDate+'/' : null;
  }
  
  setNoDataLabel(options){
    let noDataOptions = {};
    let promise = Promise.resolve();
    promise = promise.then(() => {
      noDataOptions = {
        lang: {
          noData: 'We don\'t have data for this time period'
        },
        noData: {
          style: {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#000000',
          },
        },
      };
      return cpBootstrap.updateObject(options, noDataOptions);
    });
    return promise;
  }
  
  addContainer(id, label, className, tagName = 'div'){
    let container = document.createElement(tagName);
    let chartContainer = document.getElementById(id);
    container.id = id + label;
    container.classList.add(className);
    console.log('addContainer', {id, label, className, tagName, container, chartContainer});
    chartContainer.appendChild(container);
  }
  
  getContainer(label){
    return document.getElementById(this.id+label);
  }
  
  getExtremesDataUrl(id, dataType = 'data'){
    return '/currency/'+ dataType +'/'+ this.currency;
  }
  
  getVolumePattern(){
    return {
      defs: {
        patterns: [
          {
            'id': 'fill-volume-chart',
            'path': {
              d: 'M 3 0 L 3 10 M 8 0 L 8 10',
              stroke: "#e3e3e3",
              fill: '#f1f1f1',
              strokeWidth: 2,
            },
          },
          {
            'id': 'fill-volume-chart-night',
            'path': {
              d: 'M 3 0 L 3 10 M 8 0 L 8 10',
              stroke: "#9b9b9b",
              fill: '#383838',
              strokeWidth: 2,
            },
          },
        ],
      },
    };
  }
}

class bootstrapClass {
  constructor() {
    this.emptyValue = 0;
    this.emptyData = '-';
  }
  
  nodeListToArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
  }
  
  parseIntervalValue(value) {
    let timeSymbol = '', multiplier = 1;
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
  
  updateObject(obj, newObj) {
    // console.log({obj, newObj});
    
    let result = obj;
    let promise = Promise.resolve();
    promise = promise.then(() => {
      return cpBootstrap.loop(Object.keys(newObj), key => {
        if (result.hasOwnProperty(key) && typeof result[key] === 'object'){
          return this.updateObject(result[key], newObj[key]).then((updateResult) => {
            result[key] = updateResult;
          });
        }
        return result[key] = newObj[key];
      });
    });
    promise = promise.then(() => {
      // console.log({result});
      return result
    });
    return promise;
  }
  
  parseNumber(number) {
    if (!number && number !== 0) return number;
    if (number === this.emptyValue || number === this.emptyData) return number;
    number = parseFloat(number);
    if (number > 100000) {
      let numberStr = number.toFixed(0);
      let parameter = 'K',
        spliced = numberStr.slice(0, numberStr.length - 1);
      if (number > 1000000000) {
        spliced = numberStr.slice(0, numberStr.length - 7);
        parameter = 'B';
      } else if (number > 1000000) {
        spliced = numberStr.slice(0, numberStr.length - 4);
        parameter = 'M';
      }
      let natural = spliced.slice(0, spliced.length - 2);
      let decimal = spliced.slice(spliced.length - 2);
      return natural + '.' + decimal + ' ' + parameter;
    } else {
      let isDecimal = (number % 1) > 0;
      if (isDecimal) {
        let precision = 2;
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
  
  round(amount, decimal, direction) {
    amount = parseFloat(amount);
    if (!decimal) decimal = 8;
    if (!direction) direction = 'round';
    decimal = Math.pow(10, decimal);
    return Math[direction](amount * decimal) / decimal;
  }
  
  loop(arr, fn, busy, err, i = 0) {
    const body = (ok, er) => {
      try {
        const r = fn(arr[i], i, arr);
        r && r.then ? r.then(ok).catch(er) : ok(r)
      }
      catch (e) {
        er(e)
      }
    };
    const next = (ok, er) => () => this.loop(arr, fn, ok, er, ++i);
    const run = (ok, er) => i < arr.length ? new Promise(body).then(next(ok, er)).catch(er) : ok();
    return busy ? run(busy, err) : new Promise(run)
  }
}

class fetchClass {
  constructor(){
    this.state = {};
  }
  
  fetchScript(url) {
    if (this.state[url]) return Promise.resolve(null);
    this.state[url] = 'pending';
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      document.body.appendChild(script);
      script.addEventListener('load', () => {
        if (this.state) this.state[url] = 'downloaded';
        resolve();
      });
      script.addEventListener('error', () => {
        if (this.state) delete this.state[url];
        reject(new Error(`Failed to load image's URL: ${url}`));
      });
      script.async = true;
      script.src = url;
    });
  }
  
  fetchChartData(uri, fromState = false){
    const url = 'https://graphs.coinpaprika.com' + uri;
    console.log('fetchChartData', {url});
    return this.fetchData(url, fromState);
  }
  
  fetchData(url, fromState){
    let promise = Promise.resolve();
    promise = promise.then(() => {
      if (fromState){
        if (this.state[url] === 'pending'){
          let promiseTimeout = new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(this.fetchData(url, fromState));
            }, 100);
          });
          return promiseTimeout;
        }
        if (!!this.state[url]){
          return Promise.resolve(this.state[url].clone());
        }
      }
      let promiseFetch = Promise.resolve();
      promiseFetch = promiseFetch.then(() => {
        this.state[url] = 'pending';
        return fetch(url);
      });
      promiseFetch = promiseFetch.then((response) => {
        this.state[url] = response;
        return response.clone();
      });
      return promiseFetch;
    });
    return promise;
  }
}

new widgetsController();
const cpBootstrap = new bootstrapClass();
const fetchService = new fetchClass();