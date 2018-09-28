class bootstrapClass {
  constructor() {
    this.emptyValue = 0;
    this.emptyData = '-';
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
        return this.roundAmount(number, precision);
      } else {
        return number.toFixed(2);
      }
    }
  }
  
  roundAmount(amount, decimal, direction) {
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
  
  getScript(index, url, state) {
    if (state[url]) return;
    state[url] = 'pending';
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      document.body.appendChild(script);
      script.onload = () => {
        state[url] = 'downloaded';
        return resolve;
      };
      script.onerror = () => {
        delete state[url];
        return reject;
      };
      script.async = true;
      script.src = url;
    });
  }
}

class widgetsClass {
  constructor() {
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
      if (mainElement.dataset.modules) this.updateData(index, 'modules', JSON.parse(mainElement.dataset.modules));
      if (mainElement.dataset.primaryCurrency) this.updateData(index, 'primary_currency', mainElement.dataset.primaryCurrency);
      if (mainElement.dataset.currency) this.updateData(index, 'currency', mainElement.dataset.currency);
      if (mainElement.dataset.showDetailsCurrency) this.updateData(index, 'show_details_currency', (mainElement.dataset.showDetailsCurrency === 'true'));
      if (mainElement.dataset.updateActive) this.updateData(index, 'update_active', (mainElement.dataset.updateActive === 'true'));
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
    if (mainElement) {
      
      let modules = this.widgetChartElement(index) + this.widgetMarketDetailsElement(index);
      let widgetElement = this.widgetMainElement(index) + modules + this.widgetFooter(index);
      mainElement.innerHTML = widgetElement;
    }
    this.setBeforeElementInFooter(index);
    this.getData(index);
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
              value = this.bootstrap.emptyData;
            } else {
              updateElement.classList.add(className);
              value = (key === 'price_change_24h') ? '(' + this.bootstrap.roundAmount(value, 2) + '%)' : this.bootstrap.roundAmount(value, 2) + '%';
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
                setTimeout(this.setBeforeElementInFooter.bind(null, x), 50);
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
      '<span class="nameTicker">' + (data.ticker.name || this.bootstrap.emptyData) + '</span>' +
      '<span class="symbolTicker">' + (data.ticker.symbol || this.bootstrap.emptyData) + '</span>' +
      '</a></h3>' +
      '<strong>' +
      '<span class="priceTicker parseNumber">' + (this.bootstrap.parseNumber(data.ticker.price) || this.bootstrap.emptyData) + '</span> ' +
      '<span class="primaryCurrency">' + data.primary_currency + ' </span>' +
      '<span class="price_change_24hTicker cp-widget__rank cp-widget__rank-' + ((data.ticker.price_change_24h > 0) ? "up" : ((data.ticker.price_change_24h < 0) ? "down" : "neutral")) + '">(' + (this.bootstrap.roundAmount(data.ticker.price_change_24h, 2) || this.bootstrap.emptyValue) + '%)</span>' +
      '</strong>' +
      '<span class="cp-widget__rank-label"><span class="cp-translation translation_rank">' + this.getTranslation(index, "rank") + '</span> <span class="rankTicker">' + (data.ticker.rank || this.bootstrap.emptyData) + '</span></span>';
  }
  
  widgetMainElementMessage(index) {
    let message = this.states[index].message;
    return '<div class="cp-widget__main-no-data cp-translation translation_message">' + (this.getTranslation(index, message)) + '</div>';
  }
  
  widgetMarketDetailsElement(index) {
    return (this.states[index].modules.indexOf('market_details') > -1) ? '<div class="cp-widget__details">' +
      this.widgetAthElement(index) +
      this.widgetVolume24hElement(index) +
      this.widgetMarketCapElement(index) +
      '</div>' : '';
  }
  
  widgetAthElement(index) {
    return '<div>' +
      '<small class="cp-translation translation_ath">' + this.getTranslation(index, "ath") + '</small>' +
      '<div>' +
      '<span class="price_athTicker parseNumber">' + this.bootstrap.emptyData + ' </span>' +
      '<span class="symbolTicker showDetailsCurrency"></span>' +
      '</div>' +
      '<span class="percent_from_price_athTicker cp-widget__rank">' + this.bootstrap.emptyData + '</span>' +
      '</div>'
  }
  
  widgetVolume24hElement(index) {
    return '<div>' +
      '<small class="cp-translation translation_volume_24h">' + this.getTranslation(index, "volume_24h") + '</small>' +
      '<div>' +
      '<span class="volume_24hTicker parseNumber">' + this.bootstrap.emptyData + ' </span>' +
      '<span class="symbolTicker showDetailsCurrency"></span>' +
      '</div>' +
      '<span class="volume_24h_change_24hTicker cp-widget__rank">' + this.bootstrap.emptyData + '</span>' +
      '</div>';
  }
  
  widgetMarketCapElement(index) {
    return '<div>' +
      '<small class="cp-translation translation_market_cap">' + this.getTranslation(index, "market_cap") + '</small>' +
      '<div>' +
      '<span class="market_capTicker parseNumber">' + this.bootstrap.emptyData + ' </span>' +
      '<span class="symbolTicker showDetailsCurrency"></span>' +
      '</div>' +
      '<span class="market_cap_change_24hTicker cp-widget__rank">' + this.bootstrap.emptyData + '</span>' +
      '</div>';
  }
  
  widgetChartElement(index) {
    let promise = Promise.resolve();
    promise = promise.then(() => {
      return (!window.Highcharts) ? this.bootstrap.getScript(index, 'https://code.highcharts.com/highcharts.js', this.defaults.scriptsDownloaded) : null;
    });
    promise = promise.then((result) => {
      console.log('widgetChartElement', {result});
      return (this.states[index].modules.indexOf('chart') > -1)
        ? '<div class="cp-widget__chart">' +
        'CHART' +
        '</div>'
        : '';
    });
    return promise;
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

class widgetController {
  constructor(){
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
        for(let i = 0; i < mainElements.length; i++){
          let newSettings = JSON.parse(JSON.stringify(this.widgets.defaults));
          newSettings.isWordpress = mainElements[i].classList.contains('wordpress');
          newSettings.mainElement = mainElements[i];
          this.widgets.states.push(newSettings);
          this.widgets.init(i);
        }
      }, 50);
    }
  }
}

new widgetController();