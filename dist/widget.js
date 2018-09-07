(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function(){
  var widgetsStates = [];
  var widgetDefaults = {
    currency: 'btc-bitcoin',
    primary_currency: 'USD',
    version: 'extended',
    update_active: false,
    update_timeout: '30s',
    language: 'en',
    style_src: null,
    img_src: null,
    lang_src: null,
    origin_src: 'https://cdn.jsdelivr.net/npm/@coinpaprika/widget-currency@1.0.8',
    show_details_currency: false,
    emptyData: '-',
    emptyValue: 0,
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
    isData: false,
    message: 'data_loading',
    translations: {},
    mainElement: null,
    noTranslationLabels: [],
  };
  var widgetFunctions = {
    init: function(index){
      if (!widgetFunctions.getMainElement(index)) {
        return console.error('Bind failed, no element with class = "coinpaprika-currency-widget"');
      }
      widgetFunctions.getDefaults(index);
      widgetFunctions.setOriginLink(index);
    },
    setOriginLink: function(index){
      if (Object.keys(widgetDefaults.translations).length === 0) widgetFunctions.getTranslations(widgetDefaults.language);
      widgetFunctions.stylesheet();
      setTimeout(function(){
        widgetFunctions.addWidgetElement(index);
        widgetFunctions.initInterval(index);
      }, 100);
    },
    getMainElement: function(index){
      return widgetsStates[index].mainElement;
    },
    getData: function(index){
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://api.coinpaprika.com/v1/widget/'+widgetsStates[index].currency+'?quote='+widgetsStates[index].primary_currency);
      xhr.onload = function() {
        if (xhr.status === 200) {
          if (!widgetsStates[index].isData) widgetFunctions.updateData(index, 'isData', true);
          widgetFunctions.updateTicker(index, JSON.parse(xhr.responseText));
        }
        else {
          widgetFunctions.onErrorRequest(index, xhr);
        }
      };
      xhr.onerror = function(){
        widgetFunctions.onErrorRequest(index, xhr);
      };
      xhr.send();
    },
    onErrorRequest: function(index, xhr){
      if (widgetsStates[index].isData) widgetFunctions.updateData(index, 'isData', false);
      widgetFunctions.updateData(index, 'message', 'data_unavailable');
      console.error('Request failed.  Returned status of ' + xhr, widgetsStates[index]);
    },
    initInterval: function(index){
      clearInterval(widgetsStates[index].interval);
      if (widgetsStates[index].update_active && widgetsStates[index].update_timeout > 1000){
        widgetsStates[index].interval = setInterval(function(){
          widgetFunctions.getData(index);
        }, widgetsStates[index].update_timeout);
      }
    },
    addWidgetElement: function(index){
      var mainElement = widgetFunctions.getMainElement(index);
      var details = (widgetsStates[index].version === 'extended') ? '<div class="cp-widget__details">' + widgetFunctions.widgetAthElement(index) + widgetFunctions.widgetVolume24hElement(index) + widgetFunctions.widgetMarketCapElement(index) + '</div>' : '';
      var widgetElement = widgetFunctions.widgetMainElement(index) + details + widgetFunctions.widgetFooter(index);
      mainElement.innerHTML = widgetElement;
      widgetFunctions.setBeforeElementInFooter(index);
      widgetFunctions.getData(index);
    },
    setBeforeElementInFooter: function(index){
      var mainElement = widgetFunctions.getMainElement(index);
      if (mainElement.children[0].localName === 'style'){
        mainElement.removeChild(mainElement.childNodes[0]);
      }
      var footerElement = mainElement.querySelector('.cp-widget__footer');
      var value = footerElement.getBoundingClientRect().width - 43;
      for (var i = 0; i < footerElement.childNodes.length; i++){
        value -= footerElement.childNodes[i].getBoundingClientRect().width;
      }
      var style = document.createElement('style');
      style.innerHTML = '.cp-widget__footer--'+index+'::before{width:'+value.toFixed(0)+'px;}';
      mainElement.insertBefore(style, mainElement.children[0]);
    },
    getDefaults: function(index){
      var mainElement = widgetFunctions.getMainElement(index);
      if (mainElement.dataset){
        if (mainElement.dataset.version) widgetFunctions.updateData(index, 'version', mainElement.dataset.version);
        if (mainElement.dataset.primaryCurrency) widgetFunctions.updateData(index, 'primary_currency', mainElement.dataset.primaryCurrency);
        if (mainElement.dataset.currency) widgetFunctions.updateData(index, 'currency', mainElement.dataset.currency);
        if (mainElement.dataset.showDetailsCurrency) widgetFunctions.updateData(index, 'show_details_currency', (mainElement.dataset.showDetailsCurrency === 'true'));
        if (mainElement.dataset.updateActive) widgetFunctions.updateData(index, 'update_active', (mainElement.dataset.updateActive === 'true'));
        if (mainElement.dataset.updateTimeout) widgetFunctions.updateData(index, 'update_timeout', widgetFunctions.parseIntervalValue(mainElement.dataset.updateTimeout));
        if (mainElement.dataset.language) widgetFunctions.updateData(index, 'language', mainElement.dataset.language);
        if (mainElement.dataset.originSrc) widgetFunctions.updateData(index, 'origin_src', mainElement.dataset.originSrc);
        if (mainElement.dataset.nodeModulesSrc) widgetFunctions.updateData(index, 'node_modules_src', mainElement.dataset.nodeModulesSrc);
        if (mainElement.dataset.bowerSrc) widgetFunctions.updateData(index, 'bower_src', mainElement.dataset.bowerSrc);
        if (mainElement.dataset.styleSrc) widgetFunctions.updateData(index, 'style_src', mainElement.dataset.styleSrc);
        if (mainElement.dataset.langSrc) widgetFunctions.updateData(index, 'logo_src', mainElement.dataset.langSrc);
        if (mainElement.dataset.imgSrc) widgetFunctions.updateData(index, 'logo_src', mainElement.dataset.imgSrc);
      }
    },
    updateWidgetElement: function(index, key, value, ticker){
      var state = widgetsStates[index];
      var mainElement = widgetFunctions.getMainElement(index);
      if (mainElement){
        var tickerClass = (ticker) ? 'Ticker' : '';
        if (key === 'name' || key === 'currency'){
          if (key === 'currency'){
            var aElements = mainElement.querySelectorAll('.cp-widget__footer > a');
            for(var k = 0; k < aElements.length; k++) {
              aElements[k].href = widgetFunctions.coin_link(value);
            }
          }
          widgetFunctions.getImage(index);
        }
        if (key === 'isData' || key === 'message'){
          var headerElements = mainElement.querySelectorAll('.cp-widget__main');
          for(var k = 0; k < headerElements.length; k++) {
            headerElements[k].innerHTML = (!state.isData) ? widgetFunctions.widgetMainElementMessage(index) : widgetFunctions.widgetMainElementData(index);
          }
        } else {
          var updateElements = mainElement.querySelectorAll('.'+key+tickerClass);
          for (var j = 0; j < updateElements.length; j++){
            var updateElement = updateElements[j];
            if (updateElement.classList.contains('cp-widget__rank')){
              var className = (parseFloat(value) > 0) ? "cp-widget__rank-up" : ((parseFloat(value) < 0) ? "cp-widget__rank-down" : "cp-widget__rank-neutral");
              updateElement.classList.remove('cp-widget__rank-down');
              updateElement.classList.remove('cp-widget__rank-up');
              updateElement.classList.remove('cp-widget__rank-neutral');
              if (value === undefined){
                value = state.emptyData;
              } else {
                updateElement.classList.add(className);
                value = (key === 'price_change_24h') ? '('+widgetFunctions.roundAmount(value, 2)+'%)': widgetFunctions.roundAmount(value, 2)+'%';
              }
            }
            if (updateElement.classList.contains('showDetailsCurrency') && !state.show_details_currency) {
              value = ' ';
            }
            if (updateElement.classList.contains('parseNumber')){
              updateElement.innerText = widgetFunctions.parseNumber(value) || state.emptyData;
            } else {
              updateElement.innerText = value || state.emptyData;
            }
          }
        }
      }
    },
    updateData: function(index, key, value, ticker){
      if (ticker){
        widgetsStates[index].ticker[key] = value;
      } else {
        widgetsStates[index][key] = value;
      }
      if (key === 'language'){
        widgetFunctions.getTranslations(value);
      }
      widgetFunctions.updateWidgetElement(index, key, value, ticker);
    },
    updateWidgetTranslations: function(lang, data){
      widgetDefaults.translations[lang] = data;
      for (var x = 0; x < widgetsStates.length; x++){
        var isNoTranslationLabelsUpdate = widgetsStates[x].noTranslationLabels.length > 0 && lang === 'en';
        if (widgetsStates[x].language === lang || isNoTranslationLabelsUpdate){
          var mainElement = widgetsStates[x].mainElement;
          var transalteElements = Array.prototype.slice.call(mainElement.querySelectorAll('.cp-translation'));
          for (var y = 0; y < transalteElements.length; y++){
            transalteElements[y].classList.forEach(function(className){
              if (className.search('translation_') > -1){
                var translateKey = className.replace('translation_', '');
                if (translateKey === 'message') translateKey = widgetsStates[x].message;
                var labelIndex = widgetsStates[x].noTranslationLabels.indexOf(translateKey);
                var text = widgetFunctions.getTranslation(x, translateKey);
                if (labelIndex > -1 && text){
                  widgetsStates[x].noTranslationLabels.splice(labelIndex, 1)
                }
                transalteElements[y].innerText = text;
                if (transalteElements[y].closest('.cp-widget__footer')){
                  setTimeout(widgetFunctions.setBeforeElementInFooter.bind(null, x), 50);
                }
              }
            })
          }
        }
      }
    },
    updateTicker: function(index, data){
      var dataKeys = Object.keys(data);
      for (var i = 0; i < dataKeys.length; i++){
        widgetFunctions.updateData(index, dataKeys[i], data[dataKeys[i]], true);
      }
    },
    parseIntervalValue: function(value){
      var timeSymbol = '', multiplier = 1;
      if (value.search('s') > -1){
        timeSymbol = 's';
        multiplier = 1000;
      }
      if (value.search('m') > -1){
        timeSymbol = 'm';
        multiplier = 60 * 1000;
      }
      if (value.search('h') > -1){
        timeSymbol = 'h';
        multiplier = 60 * 60 * 1000;
      }
      if (value.search('d') > -1){
        timeSymbol = 'd';
        multiplier = 24 * 60 * 60 * 1000;
      }
      return parseFloat(value.replace(timeSymbol,'')) * multiplier;
    },
    parseNumber: function(number){
      if (!number && number !== 0) return number;
      if (number === widgetsStates[0].emptyValue || number === widgetsStates[0].emptyData) return number;
      number = parseFloat(number);
      if (number > 100000){
        var numberStr = number.toFixed(0);
        var parameter = 'K',
          spliced = numberStr.slice(0, numberStr.length - 1);
        if (number > 1000000000){
          spliced = numberStr.slice(0, numberStr.length - 7);
          parameter = 'B';
        } else if (number > 1000000){
          spliced = numberStr.slice(0, numberStr.length - 4);
          parameter = 'M';
        }
        var natural = spliced.slice(0, spliced.length - 2);
        var decimal = spliced.slice(spliced.length - 2);
        return natural + '.' + decimal + ' ' + parameter;
      } else {
        var isDecimal = (number % 1) > 0;
        if (isDecimal){
          var precision = 2;
          if (number < 1){
            precision = 8;
          } else if (number < 10){
            precision = 6;
          } else if (number < 1000){
            precision = 4;
          }
          return widgetFunctions.roundAmount(number, precision);
        } else {
          return number.toFixed(2);
        }
      }
    },
    roundAmount: function(amount, decimal, direction){
      amount = parseFloat(amount);
      if (!decimal) decimal = 8;
      if (!direction) direction = 'round';
      decimal = Math.pow(10, decimal);
      return Math[direction](amount * decimal) / decimal;
    },
    stylesheet: function(){
      if (widgetDefaults.style_src !== false){
        var url = widgetDefaults.style_src || widgetDefaults.origin_src +'/dist/widget.min.css';
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', url);
        return (document.body.querySelector('link[href="'+url+'"]')) ? '' : document.body.appendChild(link);
      }
    },
    widgetMainElement: function(index){
      var data = widgetsStates[index];
      return '<div class="cp-widget__header">' +
        '<div class="'+'cp-widget__img cp-widget__img-'+data.currency+'">' +
        '<img/>' +
        '</div>' +
        '<div class="cp-widget__main">' +
        ((data.isData) ? widgetFunctions.widgetMainElementData(index) : widgetFunctions.widgetMainElementMessage(index)) +
        '</div>'+
        '</div>';
    },
    widgetMainElementData: function(index){
      var data = widgetsStates[index];
      return '<h3><a href="'+ widgetFunctions.coin_link(data.currency) +'">' +
        '<span class="nameTicker">'+ (data.ticker.name || data.emptyData) +'</span>' +
        '<span class="symbolTicker">'+ (data.ticker.symbol || data.emptyData) +'</span>' +
        '</a></h3>' +
        '<strong>' +
        '<span class="priceTicker parseNumber">'+ (widgetFunctions.parseNumber(data.ticker.price) || data.emptyData) + '</span> ' +
        '<span class="primaryCurrency">'+ data.primary_currency + ' </span>' +
        '<span class="price_change_24hTicker cp-widget__rank cp-widget__rank-'+ ((data.ticker.price_change_24h > 0) ? "up" : ((data.ticker.price_change_24h < 0) ? "down" : "neutral")) +'">('+ (widgetFunctions.roundAmount(data.ticker.price_change_24h, 2) || data.emptyValue) +'%)</span>' +
        '</strong>' +
        '<span class="cp-widget__rank-label"><span class="cp-translation translation_rank">'+widgetFunctions.getTranslation(index, "rank")+'</span> <span class="rankTicker">'+ (data.ticker.rank || data.emptyData) +'</span></span>';
    },
    widgetMainElementMessage: function(index){
      var message = widgetsStates[index].message;
      return '<div class="cp-widget__main-no-data cp-translation translation_message">'+ (widgetFunctions.getTranslation(index, message)) +'</div>';
    },
    widgetAthElement: function(index){
      return '<div>' +
        '<small class="cp-translation translation_ath">'+widgetFunctions.getTranslation(index, "ath")+'</small>' +
        '<div>' +
        '<span class="price_athTicker parseNumber">'+ widgetsStates[0].emptyData + ' </span>' +
        '<span class="symbolTicker showDetailsCurrency"></span>' +
        '</div>' +
        '<span class="percent_from_price_athTicker cp-widget__rank">'+ widgetsStates[0].emptyData + '</span>' +
        '</div>'
    },
    widgetVolume24hElement: function(index){
      return '<div>' +
        '<small class="cp-translation translation_volume_24h">'+widgetFunctions.getTranslation(index, "volume_24h")+'</small>' +
        '<div>' +
        '<span class="volume_24hTicker parseNumber">'+ widgetsStates[0].emptyData + ' </span>' +
        '<span class="symbolTicker showDetailsCurrency"></span>' +
        '</div>' +
        '<span class="volume_24h_change_24hTicker cp-widget__rank">'+ widgetsStates[0].emptyData + '</span>' +
        '</div>';
    },
    widgetMarketCapElement: function(index){
      return '<div>' +
        '<small class="cp-translation translation_market_cap">'+widgetFunctions.getTranslation(index, "market_cap")+'</small>' +
        '<div>' +
        '<span class="market_capTicker parseNumber">'+ widgetsStates[0].emptyData + ' </span>' +
        '<span class="symbolTicker showDetailsCurrency"></span>' +
        '</div>' +
        '<span class="market_cap_change_24hTicker cp-widget__rank">'+ widgetsStates[0].emptyData + '</span>' +
        '</div>';
    },
    widgetFooter: function(index){
      var currency = widgetsStates[index].currency;
      return '<p class="cp-widget__footer cp-widget__footer--'+index+'">' +
        '<span class="cp-translation translation_powered_by">'+widgetFunctions.getTranslation(index, "powered_by") + ' </span>' +
        '<img style="width: 16px" src="'+ widgetFunctions.main_logo_link() +'" alt=""/>' +
        '<a target="_blank" href="'+ widgetFunctions.coin_link(currency) +'">coinpaprika.com</a>' +
        '</p>'
    },
    getImage: function(index){
      var data = widgetsStates[index];
      var imgContainers = data.mainElement.getElementsByClassName('cp-widget__img');
      for (var i = 0; i < imgContainers.length; i++){
        var imgContainer = imgContainers[i];
        imgContainer.classList.add('cp-widget__img--hidden');
        var img = imgContainer.querySelector('img');
        var newImg = new Image;
        newImg.onload = function() {
          img.src = this.src;
          imgContainer.classList.remove('cp-widget__img--hidden');
        };
        newImg.src = widgetFunctions.img_src(data.currency);
      }
    },
    img_src: function(id){
      return 'https://coinpaprika.com/coin/'+id+'/logo.png';
    },
    coin_link: function(id){
      return 'https://coinpaprika.com/coin/'+ id
    },
    main_logo_link: function(){
      return widgetDefaults.img_src || widgetDefaults.origin_src +'/dist/img/logo_widget.svg'
    },
    getScriptElement: function(){
      return document.querySelector('script[data-cp-currency-widget]');
    },
    getTranslation: function(index, label){
      var text = (widgetDefaults.translations[widgetsStates[index].language]) ? widgetDefaults.translations[widgetsStates[index].language][label] : null;
      if (!text && widgetDefaults.translations['en']) {
        text = widgetDefaults.translations['en'][label];
      }
      if (!text) {
        return widgetFunctions.addLabelWithoutTranslation(index, label);
      } else {
        return text;
      }
    },
    addLabelWithoutTranslation: function(index, label){
      if (!widgetDefaults.translations['en']) widgetFunctions.getTranslations('en');
      return widgetsStates[index].noTranslationLabels.push(label);
    },
    getTranslations: function(lang){
      if (!widgetDefaults.translations[lang]){
        var xhr = new XMLHttpRequest();
        var url = widgetDefaults.lang_src  || widgetDefaults.origin_src + '/dist/lang';
        xhr.open('GET', url + '/' + lang + '.json');
        xhr.onload = function() {
          if (xhr.status === 200) {
            widgetFunctions.updateWidgetTranslations(lang, JSON.parse(xhr.responseText));
          }
          else {
            widgetFunctions.onErrorRequest(0, xhr);
            widgetFunctions.getTranslations('en');
            delete widgetDefaults.translations[lang];
          }
        };
        xhr.onerror = function(){
          widgetFunctions.onErrorRequest(0, xhr);
          widgetFunctions.getTranslations('en');
          delete widgetDefaults.translations[lang];
        };
        xhr.send();
        widgetDefaults.translations[lang] = {};
      }
    },
  };
  
  function initWidgets(){
    if (!window.cpCurrencyWidgetsInitialized){
      window.cpCurrencyWidgetsInitialized = true;
      var mainElements = Array.prototype.slice.call(document.getElementsByClassName('coinpaprika-currency-widget'));
      var scriptElement = widgetFunctions.getScriptElement();
      if (scriptElement && scriptElement.dataset && scriptElement.dataset.cpCurrencyWidget){
        var dataset = JSON.parse(scriptElement.dataset.cpCurrencyWidget);
        if (Object.keys(dataset)){
          var keys = Object.keys(dataset);
          for (var j = 0; j < keys.length; j++){
            var key = keys[j].replace('-', '_');
            widgetDefaults[key] = dataset[keys[j]];
          }
        }
      }
      setTimeout(function(){
        widgetsStates = [];
        for(var i = 0; i < mainElements.length; i++){
          var newSettings = JSON.parse(JSON.stringify(widgetDefaults));
          newSettings.mainElement = mainElements[i];
          widgetsStates.push(newSettings);
          widgetFunctions.init(i);
        }
      }, 50);
    }
  }
  
  window.addEventListener('load', initWidgets, false);
  window.bindWidget = function(){
    window.cpCurrencyWidgetsInitialized = false;
    initWidgets();
  };
})();
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIoZnVuY3Rpb24oKXtcbiAgdmFyIHdpZGdldHNTdGF0ZXMgPSBbXTtcbiAgdmFyIHdpZGdldERlZmF1bHRzID0ge1xuICAgIGN1cnJlbmN5OiAnYnRjLWJpdGNvaW4nLFxuICAgIHByaW1hcnlfY3VycmVuY3k6ICdVU0QnLFxuICAgIHZlcnNpb246ICdleHRlbmRlZCcsXG4gICAgdXBkYXRlX2FjdGl2ZTogZmFsc2UsXG4gICAgdXBkYXRlX3RpbWVvdXQ6ICczMHMnLFxuICAgIGxhbmd1YWdlOiAnZW4nLFxuICAgIHN0eWxlX3NyYzogbnVsbCxcbiAgICBpbWdfc3JjOiBudWxsLFxuICAgIGxhbmdfc3JjOiBudWxsLFxuICAgIG9yaWdpbl9zcmM6ICdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL0Bjb2lucGFwcmlrYS93aWRnZXQtY3VycmVuY3lAMS4wLjgnLFxuICAgIHNob3dfZGV0YWlsc19jdXJyZW5jeTogZmFsc2UsXG4gICAgZW1wdHlEYXRhOiAnLScsXG4gICAgZW1wdHlWYWx1ZTogMCxcbiAgICB0aWNrZXI6IHtcbiAgICAgIG5hbWU6IHVuZGVmaW5lZCxcbiAgICAgIHN5bWJvbDogdW5kZWZpbmVkLFxuICAgICAgcHJpY2U6IHVuZGVmaW5lZCxcbiAgICAgIHByaWNlX2NoYW5nZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgIHJhbms6IHVuZGVmaW5lZCxcbiAgICAgIHByaWNlX2F0aDogdW5kZWZpbmVkLFxuICAgICAgdm9sdW1lXzI0aDogdW5kZWZpbmVkLFxuICAgICAgbWFya2V0X2NhcDogdW5kZWZpbmVkLFxuICAgICAgcGVyY2VudF9mcm9tX3ByaWNlX2F0aDogdW5kZWZpbmVkLFxuICAgICAgdm9sdW1lXzI0aF9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgICBtYXJrZXRfY2FwX2NoYW5nZV8yNGg6IHVuZGVmaW5lZCxcbiAgICB9LFxuICAgIGludGVydmFsOiBudWxsLFxuICAgIGlzRGF0YTogZmFsc2UsXG4gICAgbWVzc2FnZTogJ2RhdGFfbG9hZGluZycsXG4gICAgdHJhbnNsYXRpb25zOiB7fSxcbiAgICBtYWluRWxlbWVudDogbnVsbCxcbiAgICBub1RyYW5zbGF0aW9uTGFiZWxzOiBbXSxcbiAgfTtcbiAgdmFyIHdpZGdldEZ1bmN0aW9ucyA9IHtcbiAgICBpbml0OiBmdW5jdGlvbihpbmRleCl7XG4gICAgICBpZiAoIXdpZGdldEZ1bmN0aW9ucy5nZXRNYWluRWxlbWVudChpbmRleCkpIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ0JpbmQgZmFpbGVkLCBubyBlbGVtZW50IHdpdGggY2xhc3MgPSBcImNvaW5wYXByaWthLWN1cnJlbmN5LXdpZGdldFwiJyk7XG4gICAgICB9XG4gICAgICB3aWRnZXRGdW5jdGlvbnMuZ2V0RGVmYXVsdHMoaW5kZXgpO1xuICAgICAgd2lkZ2V0RnVuY3Rpb25zLnNldE9yaWdpbkxpbmsoaW5kZXgpO1xuICAgIH0sXG4gICAgc2V0T3JpZ2luTGluazogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgaWYgKE9iamVjdC5rZXlzKHdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9ucykubGVuZ3RoID09PSAwKSB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb25zKHdpZGdldERlZmF1bHRzLmxhbmd1YWdlKTtcbiAgICAgIHdpZGdldEZ1bmN0aW9ucy5zdHlsZXNoZWV0KCk7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgIHdpZGdldEZ1bmN0aW9ucy5hZGRXaWRnZXRFbGVtZW50KGluZGV4KTtcbiAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmluaXRJbnRlcnZhbChpbmRleCk7XG4gICAgICB9LCAxMDApO1xuICAgIH0sXG4gICAgZ2V0TWFpbkVsZW1lbnQ6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHJldHVybiB3aWRnZXRzU3RhdGVzW2luZGV4XS5tYWluRWxlbWVudDtcbiAgICB9LFxuICAgIGdldERhdGE6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHhoci5vcGVuKCdHRVQnLCAnaHR0cHM6Ly9hcGkuY29pbnBhcHJpa2EuY29tL3YxL3dpZGdldC8nK3dpZGdldHNTdGF0ZXNbaW5kZXhdLmN1cnJlbmN5Kyc/cXVvdGU9Jyt3aWRnZXRzU3RhdGVzW2luZGV4XS5wcmltYXJ5X2N1cnJlbmN5KTtcbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIGlmICghd2lkZ2V0c1N0YXRlc1tpbmRleF0uaXNEYXRhKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ2lzRGF0YScsIHRydWUpO1xuICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVUaWNrZXIoaW5kZXgsIEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5vbkVycm9yUmVxdWVzdChpbmRleCwgeGhyKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKXtcbiAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLm9uRXJyb3JSZXF1ZXN0KGluZGV4LCB4aHIpO1xuICAgICAgfTtcbiAgICAgIHhoci5zZW5kKCk7XG4gICAgfSxcbiAgICBvbkVycm9yUmVxdWVzdDogZnVuY3Rpb24oaW5kZXgsIHhocil7XG4gICAgICBpZiAod2lkZ2V0c1N0YXRlc1tpbmRleF0uaXNEYXRhKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ2lzRGF0YScsIGZhbHNlKTtcbiAgICAgIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnbWVzc2FnZScsICdkYXRhX3VuYXZhaWxhYmxlJyk7XG4gICAgICBjb25zb2xlLmVycm9yKCdSZXF1ZXN0IGZhaWxlZC4gIFJldHVybmVkIHN0YXR1cyBvZiAnICsgeGhyLCB3aWRnZXRzU3RhdGVzW2luZGV4XSk7XG4gICAgfSxcbiAgICBpbml0SW50ZXJ2YWw6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIGNsZWFySW50ZXJ2YWwod2lkZ2V0c1N0YXRlc1tpbmRleF0uaW50ZXJ2YWwpO1xuICAgICAgaWYgKHdpZGdldHNTdGF0ZXNbaW5kZXhdLnVwZGF0ZV9hY3RpdmUgJiYgd2lkZ2V0c1N0YXRlc1tpbmRleF0udXBkYXRlX3RpbWVvdXQgPiAxMDAwKXtcbiAgICAgICAgd2lkZ2V0c1N0YXRlc1tpbmRleF0uaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXREYXRhKGluZGV4KTtcbiAgICAgICAgfSwgd2lkZ2V0c1N0YXRlc1tpbmRleF0udXBkYXRlX3RpbWVvdXQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgYWRkV2lkZ2V0RWxlbWVudDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIG1haW5FbGVtZW50ID0gd2lkZ2V0RnVuY3Rpb25zLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICAgIHZhciBkZXRhaWxzID0gKHdpZGdldHNTdGF0ZXNbaW5kZXhdLnZlcnNpb24gPT09ICdleHRlbmRlZCcpID8gJzxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX2RldGFpbHNcIj4nICsgd2lkZ2V0RnVuY3Rpb25zLndpZGdldEF0aEVsZW1lbnQoaW5kZXgpICsgd2lkZ2V0RnVuY3Rpb25zLndpZGdldFZvbHVtZTI0aEVsZW1lbnQoaW5kZXgpICsgd2lkZ2V0RnVuY3Rpb25zLndpZGdldE1hcmtldENhcEVsZW1lbnQoaW5kZXgpICsgJzwvZGl2PicgOiAnJztcbiAgICAgIHZhciB3aWRnZXRFbGVtZW50ID0gd2lkZ2V0RnVuY3Rpb25zLndpZGdldE1haW5FbGVtZW50KGluZGV4KSArIGRldGFpbHMgKyB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0Rm9vdGVyKGluZGV4KTtcbiAgICAgIG1haW5FbGVtZW50LmlubmVySFRNTCA9IHdpZGdldEVsZW1lbnQ7XG4gICAgICB3aWRnZXRGdW5jdGlvbnMuc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKGluZGV4KTtcbiAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXREYXRhKGluZGV4KTtcbiAgICB9LFxuICAgIHNldEJlZm9yZUVsZW1lbnRJbkZvb3RlcjogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIG1haW5FbGVtZW50ID0gd2lkZ2V0RnVuY3Rpb25zLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICAgIGlmIChtYWluRWxlbWVudC5jaGlsZHJlblswXS5sb2NhbE5hbWUgPT09ICdzdHlsZScpe1xuICAgICAgICBtYWluRWxlbWVudC5yZW1vdmVDaGlsZChtYWluRWxlbWVudC5jaGlsZE5vZGVzWzBdKTtcbiAgICAgIH1cbiAgICAgIHZhciBmb290ZXJFbGVtZW50ID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNwLXdpZGdldF9fZm9vdGVyJyk7XG4gICAgICB2YXIgdmFsdWUgPSBmb290ZXJFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gNDM7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZvb3RlckVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhbHVlIC09IGZvb3RlckVsZW1lbnQuY2hpbGROb2Rlc1tpXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICAgIH1cbiAgICAgIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICBzdHlsZS5pbm5lckhUTUwgPSAnLmNwLXdpZGdldF9fZm9vdGVyLS0nK2luZGV4Kyc6OmJlZm9yZXt3aWR0aDonK3ZhbHVlLnRvRml4ZWQoMCkrJ3B4O30nO1xuICAgICAgbWFpbkVsZW1lbnQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBtYWluRWxlbWVudC5jaGlsZHJlblswXSk7XG4gICAgfSxcbiAgICBnZXREZWZhdWx0czogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIG1haW5FbGVtZW50ID0gd2lkZ2V0RnVuY3Rpb25zLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0KXtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQudmVyc2lvbikgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICd2ZXJzaW9uJywgbWFpbkVsZW1lbnQuZGF0YXNldC52ZXJzaW9uKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQucHJpbWFyeUN1cnJlbmN5KSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3ByaW1hcnlfY3VycmVuY3knLCBtYWluRWxlbWVudC5kYXRhc2V0LnByaW1hcnlDdXJyZW5jeSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmN1cnJlbmN5KSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ2N1cnJlbmN5JywgbWFpbkVsZW1lbnQuZGF0YXNldC5jdXJyZW5jeSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnNob3dEZXRhaWxzQ3VycmVuY3kpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnc2hvd19kZXRhaWxzX2N1cnJlbmN5JywgKG1haW5FbGVtZW50LmRhdGFzZXQuc2hvd0RldGFpbHNDdXJyZW5jeSA9PT0gJ3RydWUnKSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZUFjdGl2ZSkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICd1cGRhdGVfYWN0aXZlJywgKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlQWN0aXZlID09PSAndHJ1ZScpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlVGltZW91dCkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICd1cGRhdGVfdGltZW91dCcsIHdpZGdldEZ1bmN0aW9ucy5wYXJzZUludGVydmFsVmFsdWUobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVUaW1lb3V0KSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lmxhbmd1YWdlKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ2xhbmd1YWdlJywgbWFpbkVsZW1lbnQuZGF0YXNldC5sYW5ndWFnZSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lm9yaWdpblNyYykgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdvcmlnaW5fc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5vcmlnaW5TcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5ub2RlTW9kdWxlc1NyYykgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdub2RlX21vZHVsZXNfc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5ub2RlTW9kdWxlc1NyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmJvd2VyU3JjKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ2Jvd2VyX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQuYm93ZXJTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5zdHlsZVNyYykgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdzdHlsZV9zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LnN0eWxlU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ1NyYykgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdsb2dvX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ1NyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmltZ1NyYykgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdsb2dvX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQuaW1nU3JjKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZVdpZGdldEVsZW1lbnQ6IGZ1bmN0aW9uKGluZGV4LCBrZXksIHZhbHVlLCB0aWNrZXIpe1xuICAgICAgdmFyIHN0YXRlID0gd2lkZ2V0c1N0YXRlc1tpbmRleF07XG4gICAgICB2YXIgbWFpbkVsZW1lbnQgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgaWYgKG1haW5FbGVtZW50KXtcbiAgICAgICAgdmFyIHRpY2tlckNsYXNzID0gKHRpY2tlcikgPyAnVGlja2VyJyA6ICcnO1xuICAgICAgICBpZiAoa2V5ID09PSAnbmFtZScgfHwga2V5ID09PSAnY3VycmVuY3knKXtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnY3VycmVuY3knKXtcbiAgICAgICAgICAgIHZhciBhRWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0X19mb290ZXIgPiBhJyk7XG4gICAgICAgICAgICBmb3IodmFyIGsgPSAwOyBrIDwgYUVsZW1lbnRzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgIGFFbGVtZW50c1trXS5ocmVmID0gd2lkZ2V0RnVuY3Rpb25zLmNvaW5fbGluayh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXRJbWFnZShpbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGtleSA9PT0gJ2lzRGF0YScgfHwga2V5ID09PSAnbWVzc2FnZScpe1xuICAgICAgICAgIHZhciBoZWFkZXJFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXRfX21haW4nKTtcbiAgICAgICAgICBmb3IodmFyIGsgPSAwOyBrIDwgaGVhZGVyRWxlbWVudHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgIGhlYWRlckVsZW1lbnRzW2tdLmlubmVySFRNTCA9ICghc3RhdGUuaXNEYXRhKSA/IHdpZGdldEZ1bmN0aW9ucy53aWRnZXRNYWluRWxlbWVudE1lc3NhZ2UoaW5kZXgpIDogd2lkZ2V0RnVuY3Rpb25zLndpZGdldE1haW5FbGVtZW50RGF0YShpbmRleCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciB1cGRhdGVFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nK2tleSt0aWNrZXJDbGFzcyk7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB1cGRhdGVFbGVtZW50cy5sZW5ndGg7IGorKyl7XG4gICAgICAgICAgICB2YXIgdXBkYXRlRWxlbWVudCA9IHVwZGF0ZUVsZW1lbnRzW2pdO1xuICAgICAgICAgICAgaWYgKHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjcC13aWRnZXRfX3JhbmsnKSl7XG4gICAgICAgICAgICAgIHZhciBjbGFzc05hbWUgPSAocGFyc2VGbG9hdCh2YWx1ZSkgPiAwKSA/IFwiY3Atd2lkZ2V0X19yYW5rLXVwXCIgOiAoKHBhcnNlRmxvYXQodmFsdWUpIDwgMCkgPyBcImNwLXdpZGdldF9fcmFuay1kb3duXCIgOiBcImNwLXdpZGdldF9fcmFuay1uZXV0cmFsXCIpO1xuICAgICAgICAgICAgICB1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9fcmFuay1kb3duJyk7XG4gICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLXVwJyk7XG4gICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLW5ldXRyYWwnKTtcbiAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgIHZhbHVlID0gc3RhdGUuZW1wdHlEYXRhO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gKGtleSA9PT0gJ3ByaWNlX2NoYW5nZV8yNGgnKSA/ICcoJyt3aWRnZXRGdW5jdGlvbnMucm91bmRBbW91bnQodmFsdWUsIDIpKyclKSc6IHdpZGdldEZ1bmN0aW9ucy5yb3VuZEFtb3VudCh2YWx1ZSwgMikrJyUnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3dEZXRhaWxzQ3VycmVuY3knKSAmJiAhc3RhdGUuc2hvd19kZXRhaWxzX2N1cnJlbmN5KSB7XG4gICAgICAgICAgICAgIHZhbHVlID0gJyAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwYXJzZU51bWJlcicpKXtcbiAgICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5pbm5lclRleHQgPSB3aWRnZXRGdW5jdGlvbnMucGFyc2VOdW1iZXIodmFsdWUpIHx8IHN0YXRlLmVtcHR5RGF0YTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuaW5uZXJUZXh0ID0gdmFsdWUgfHwgc3RhdGUuZW1wdHlEYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlRGF0YTogZnVuY3Rpb24oaW5kZXgsIGtleSwgdmFsdWUsIHRpY2tlcil7XG4gICAgICBpZiAodGlja2VyKXtcbiAgICAgICAgd2lkZ2V0c1N0YXRlc1tpbmRleF0udGlja2VyW2tleV0gPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpZGdldHNTdGF0ZXNbaW5kZXhdW2tleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09ICdsYW5ndWFnZScpe1xuICAgICAgICB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb25zKHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVXaWRnZXRFbGVtZW50KGluZGV4LCBrZXksIHZhbHVlLCB0aWNrZXIpO1xuICAgIH0sXG4gICAgdXBkYXRlV2lkZ2V0VHJhbnNsYXRpb25zOiBmdW5jdGlvbihsYW5nLCBkYXRhKXtcbiAgICAgIHdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXSA9IGRhdGE7XG4gICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHdpZGdldHNTdGF0ZXMubGVuZ3RoOyB4Kyspe1xuICAgICAgICB2YXIgaXNOb1RyYW5zbGF0aW9uTGFiZWxzVXBkYXRlID0gd2lkZ2V0c1N0YXRlc1t4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLmxlbmd0aCA+IDAgJiYgbGFuZyA9PT0gJ2VuJztcbiAgICAgICAgaWYgKHdpZGdldHNTdGF0ZXNbeF0ubGFuZ3VhZ2UgPT09IGxhbmcgfHwgaXNOb1RyYW5zbGF0aW9uTGFiZWxzVXBkYXRlKXtcbiAgICAgICAgICB2YXIgbWFpbkVsZW1lbnQgPSB3aWRnZXRzU3RhdGVzW3hdLm1haW5FbGVtZW50O1xuICAgICAgICAgIHZhciB0cmFuc2FsdGVFbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC10cmFuc2xhdGlvbicpKTtcbiAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IHRyYW5zYWx0ZUVsZW1lbnRzLmxlbmd0aDsgeSsrKXtcbiAgICAgICAgICAgIHRyYW5zYWx0ZUVsZW1lbnRzW3ldLmNsYXNzTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGNsYXNzTmFtZSl7XG4gICAgICAgICAgICAgIGlmIChjbGFzc05hbWUuc2VhcmNoKCd0cmFuc2xhdGlvbl8nKSA+IC0xKXtcbiAgICAgICAgICAgICAgICB2YXIgdHJhbnNsYXRlS2V5ID0gY2xhc3NOYW1lLnJlcGxhY2UoJ3RyYW5zbGF0aW9uXycsICcnKTtcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNsYXRlS2V5ID09PSAnbWVzc2FnZScpIHRyYW5zbGF0ZUtleSA9IHdpZGdldHNTdGF0ZXNbeF0ubWVzc2FnZTtcbiAgICAgICAgICAgICAgICB2YXIgbGFiZWxJbmRleCA9IHdpZGdldHNTdGF0ZXNbeF0ubm9UcmFuc2xhdGlvbkxhYmVscy5pbmRleE9mKHRyYW5zbGF0ZUtleSk7XG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oeCwgdHJhbnNsYXRlS2V5KTtcbiAgICAgICAgICAgICAgICBpZiAobGFiZWxJbmRleCA+IC0xICYmIHRleHQpe1xuICAgICAgICAgICAgICAgICAgd2lkZ2V0c1N0YXRlc1t4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLnNwbGljZShsYWJlbEluZGV4LCAxKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0cmFuc2FsdGVFbGVtZW50c1t5XS5pbm5lclRleHQgPSB0ZXh0O1xuICAgICAgICAgICAgICAgIGlmICh0cmFuc2FsdGVFbGVtZW50c1t5XS5jbG9zZXN0KCcuY3Atd2lkZ2V0X19mb290ZXInKSl7XG4gICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHdpZGdldEZ1bmN0aW9ucy5zZXRCZWZvcmVFbGVtZW50SW5Gb290ZXIuYmluZChudWxsLCB4KSwgNTApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZVRpY2tlcjogZnVuY3Rpb24oaW5kZXgsIGRhdGEpe1xuICAgICAgdmFyIGRhdGFLZXlzID0gT2JqZWN0LmtleXMoZGF0YSk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFLZXlzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsIGRhdGFLZXlzW2ldLCBkYXRhW2RhdGFLZXlzW2ldXSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBwYXJzZUludGVydmFsVmFsdWU6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIHZhciB0aW1lU3ltYm9sID0gJycsIG11bHRpcGxpZXIgPSAxO1xuICAgICAgaWYgKHZhbHVlLnNlYXJjaCgncycpID4gLTEpe1xuICAgICAgICB0aW1lU3ltYm9sID0gJ3MnO1xuICAgICAgICBtdWx0aXBsaWVyID0gMTAwMDtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZS5zZWFyY2goJ20nKSA+IC0xKXtcbiAgICAgICAgdGltZVN5bWJvbCA9ICdtJztcbiAgICAgICAgbXVsdGlwbGllciA9IDYwICogMTAwMDtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZS5zZWFyY2goJ2gnKSA+IC0xKXtcbiAgICAgICAgdGltZVN5bWJvbCA9ICdoJztcbiAgICAgICAgbXVsdGlwbGllciA9IDYwICogNjAgKiAxMDAwO1xuICAgICAgfVxuICAgICAgaWYgKHZhbHVlLnNlYXJjaCgnZCcpID4gLTEpe1xuICAgICAgICB0aW1lU3ltYm9sID0gJ2QnO1xuICAgICAgICBtdWx0aXBsaWVyID0gMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlLnJlcGxhY2UodGltZVN5bWJvbCwnJykpICogbXVsdGlwbGllcjtcbiAgICB9LFxuICAgIHBhcnNlTnVtYmVyOiBmdW5jdGlvbihudW1iZXIpe1xuICAgICAgaWYgKCFudW1iZXIgJiYgbnVtYmVyICE9PSAwKSByZXR1cm4gbnVtYmVyO1xuICAgICAgaWYgKG51bWJlciA9PT0gd2lkZ2V0c1N0YXRlc1swXS5lbXB0eVZhbHVlIHx8IG51bWJlciA9PT0gd2lkZ2V0c1N0YXRlc1swXS5lbXB0eURhdGEpIHJldHVybiBudW1iZXI7XG4gICAgICBudW1iZXIgPSBwYXJzZUZsb2F0KG51bWJlcik7XG4gICAgICBpZiAobnVtYmVyID4gMTAwMDAwKXtcbiAgICAgICAgdmFyIG51bWJlclN0ciA9IG51bWJlci50b0ZpeGVkKDApO1xuICAgICAgICB2YXIgcGFyYW1ldGVyID0gJ0snLFxuICAgICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDEpO1xuICAgICAgICBpZiAobnVtYmVyID4gMTAwMDAwMDAwMCl7XG4gICAgICAgICAgc3BsaWNlZCA9IG51bWJlclN0ci5zbGljZSgwLCBudW1iZXJTdHIubGVuZ3RoIC0gNyk7XG4gICAgICAgICAgcGFyYW1ldGVyID0gJ0InO1xuICAgICAgICB9IGVsc2UgaWYgKG51bWJlciA+IDEwMDAwMDApe1xuICAgICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDQpO1xuICAgICAgICAgIHBhcmFtZXRlciA9ICdNJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgbmF0dXJhbCA9IHNwbGljZWQuc2xpY2UoMCwgc3BsaWNlZC5sZW5ndGggLSAyKTtcbiAgICAgICAgdmFyIGRlY2ltYWwgPSBzcGxpY2VkLnNsaWNlKHNwbGljZWQubGVuZ3RoIC0gMik7XG4gICAgICAgIHJldHVybiBuYXR1cmFsICsgJy4nICsgZGVjaW1hbCArICcgJyArIHBhcmFtZXRlcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBpc0RlY2ltYWwgPSAobnVtYmVyICUgMSkgPiAwO1xuICAgICAgICBpZiAoaXNEZWNpbWFsKXtcbiAgICAgICAgICB2YXIgcHJlY2lzaW9uID0gMjtcbiAgICAgICAgICBpZiAobnVtYmVyIDwgMSl7XG4gICAgICAgICAgICBwcmVjaXNpb24gPSA4O1xuICAgICAgICAgIH0gZWxzZSBpZiAobnVtYmVyIDwgMTApe1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gNjtcbiAgICAgICAgICB9IGVsc2UgaWYgKG51bWJlciA8IDEwMDApe1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gNDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHdpZGdldEZ1bmN0aW9ucy5yb3VuZEFtb3VudChudW1iZXIsIHByZWNpc2lvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG51bWJlci50b0ZpeGVkKDIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICByb3VuZEFtb3VudDogZnVuY3Rpb24oYW1vdW50LCBkZWNpbWFsLCBkaXJlY3Rpb24pe1xuICAgICAgYW1vdW50ID0gcGFyc2VGbG9hdChhbW91bnQpO1xuICAgICAgaWYgKCFkZWNpbWFsKSBkZWNpbWFsID0gODtcbiAgICAgIGlmICghZGlyZWN0aW9uKSBkaXJlY3Rpb24gPSAncm91bmQnO1xuICAgICAgZGVjaW1hbCA9IE1hdGgucG93KDEwLCBkZWNpbWFsKTtcbiAgICAgIHJldHVybiBNYXRoW2RpcmVjdGlvbl0oYW1vdW50ICogZGVjaW1hbCkgLyBkZWNpbWFsO1xuICAgIH0sXG4gICAgc3R5bGVzaGVldDogZnVuY3Rpb24oKXtcbiAgICAgIGlmICh3aWRnZXREZWZhdWx0cy5zdHlsZV9zcmMgIT09IGZhbHNlKXtcbiAgICAgICAgdmFyIHVybCA9IHdpZGdldERlZmF1bHRzLnN0eWxlX3NyYyB8fCB3aWRnZXREZWZhdWx0cy5vcmlnaW5fc3JjICsnL2Rpc3Qvd2lkZ2V0Lm1pbi5jc3MnO1xuICAgICAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ3JlbCcsICdzdHlsZXNoZWV0Jyk7XG4gICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgdXJsKTtcbiAgICAgICAgcmV0dXJuIChkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJ2xpbmtbaHJlZj1cIicrdXJsKydcIl0nKSkgPyAnJyA6IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgICB9XG4gICAgfSxcbiAgICB3aWRnZXRNYWluRWxlbWVudDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIGRhdGEgPSB3aWRnZXRzU3RhdGVzW2luZGV4XTtcbiAgICAgIHJldHVybiAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9faGVhZGVyXCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiJysnY3Atd2lkZ2V0X19pbWcgY3Atd2lkZ2V0X19pbWctJytkYXRhLmN1cnJlbmN5KydcIj4nICtcbiAgICAgICAgJzxpbWcvPicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19tYWluXCI+JyArXG4gICAgICAgICgoZGF0YS5pc0RhdGEpID8gd2lkZ2V0RnVuY3Rpb25zLndpZGdldE1haW5FbGVtZW50RGF0YShpbmRleCkgOiB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0TWFpbkVsZW1lbnRNZXNzYWdlKGluZGV4KSkgK1xuICAgICAgICAnPC9kaXY+JytcbiAgICAgICAgJzwvZGl2Pic7XG4gICAgfSxcbiAgICB3aWRnZXRNYWluRWxlbWVudERhdGE6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciBkYXRhID0gd2lkZ2V0c1N0YXRlc1tpbmRleF07XG4gICAgICByZXR1cm4gJzxoMz48YSBocmVmPVwiJysgd2lkZ2V0RnVuY3Rpb25zLmNvaW5fbGluayhkYXRhLmN1cnJlbmN5KSArJ1wiPicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJuYW1lVGlja2VyXCI+JysgKGRhdGEudGlja2VyLm5hbWUgfHwgZGF0YS5lbXB0eURhdGEpICsnPC9zcGFuPicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJzeW1ib2xUaWNrZXJcIj4nKyAoZGF0YS50aWNrZXIuc3ltYm9sIHx8IGRhdGEuZW1wdHlEYXRhKSArJzwvc3Bhbj4nICtcbiAgICAgICAgJzwvYT48L2gzPicgK1xuICAgICAgICAnPHN0cm9uZz4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwicHJpY2VUaWNrZXIgcGFyc2VOdW1iZXJcIj4nKyAod2lkZ2V0RnVuY3Rpb25zLnBhcnNlTnVtYmVyKGRhdGEudGlja2VyLnByaWNlKSB8fCBkYXRhLmVtcHR5RGF0YSkgKyAnPC9zcGFuPiAnICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwicHJpbWFyeUN1cnJlbmN5XCI+JysgZGF0YS5wcmltYXJ5X2N1cnJlbmN5ICsgJyA8L3NwYW4+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInByaWNlX2NoYW5nZV8yNGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rIGNwLXdpZGdldF9fcmFuay0nKyAoKGRhdGEudGlja2VyLnByaWNlX2NoYW5nZV8yNGggPiAwKSA/IFwidXBcIiA6ICgoZGF0YS50aWNrZXIucHJpY2VfY2hhbmdlXzI0aCA8IDApID8gXCJkb3duXCIgOiBcIm5ldXRyYWxcIikpICsnXCI+KCcrICh3aWRnZXRGdW5jdGlvbnMucm91bmRBbW91bnQoZGF0YS50aWNrZXIucHJpY2VfY2hhbmdlXzI0aCwgMikgfHwgZGF0YS5lbXB0eVZhbHVlKSArJyUpPC9zcGFuPicgK1xuICAgICAgICAnPC9zdHJvbmc+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldF9fcmFuay1sYWJlbFwiPjxzcGFuIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fcmFua1wiPicrd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInJhbmtcIikrJzwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJyYW5rVGlja2VyXCI+JysgKGRhdGEudGlja2VyLnJhbmsgfHwgZGF0YS5lbXB0eURhdGEpICsnPC9zcGFuPjwvc3Bhbj4nO1xuICAgIH0sXG4gICAgd2lkZ2V0TWFpbkVsZW1lbnRNZXNzYWdlOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgbWVzc2FnZSA9IHdpZGdldHNTdGF0ZXNbaW5kZXhdLm1lc3NhZ2U7XG4gICAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX21haW4tbm8tZGF0YSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9tZXNzYWdlXCI+JysgKHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbihpbmRleCwgbWVzc2FnZSkpICsnPC9kaXY+JztcbiAgICB9LFxuICAgIHdpZGdldEF0aEVsZW1lbnQ6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHJldHVybiAnPGRpdj4nICtcbiAgICAgICAgJzxzbWFsbCBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX2F0aFwiPicrd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcImF0aFwiKSsnPC9zbWFsbD4nICtcbiAgICAgICAgJzxkaXY+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInByaWNlX2F0aFRpY2tlciBwYXJzZU51bWJlclwiPicrIHdpZGdldHNTdGF0ZXNbMF0uZW1wdHlEYXRhICsgJyA8L3NwYW4+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlciBzaG93RGV0YWlsc0N1cnJlbmN5XCI+PC9zcGFuPicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInBlcmNlbnRfZnJvbV9wcmljZV9hdGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rXCI+Jysgd2lkZ2V0c1N0YXRlc1swXS5lbXB0eURhdGEgKyAnPC9zcGFuPicgK1xuICAgICAgICAnPC9kaXY+J1xuICAgIH0sXG4gICAgd2lkZ2V0Vm9sdW1lMjRoRWxlbWVudDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgcmV0dXJuICc8ZGl2PicgK1xuICAgICAgICAnPHNtYWxsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fdm9sdW1lXzI0aFwiPicrd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInZvbHVtZV8yNGhcIikrJzwvc21hbGw+JyArXG4gICAgICAgICc8ZGl2PicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJ2b2x1bWVfMjRoVGlja2VyIHBhcnNlTnVtYmVyXCI+Jysgd2lkZ2V0c1N0YXRlc1swXS5lbXB0eURhdGEgKyAnIDwvc3Bhbj4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwic3ltYm9sVGlja2VyIHNob3dEZXRhaWxzQ3VycmVuY3lcIj48L3NwYW4+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwidm9sdW1lXzI0aF9jaGFuZ2VfMjRoVGlja2VyIGNwLXdpZGdldF9fcmFua1wiPicrIHdpZGdldHNTdGF0ZXNbMF0uZW1wdHlEYXRhICsgJzwvc3Bhbj4nICtcbiAgICAgICAgJzwvZGl2Pic7XG4gICAgfSxcbiAgICB3aWRnZXRNYXJrZXRDYXBFbGVtZW50OiBmdW5jdGlvbihpbmRleCl7XG4gICAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAgICc8c21hbGwgY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9tYXJrZXRfY2FwXCI+Jyt3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwibWFya2V0X2NhcFwiKSsnPC9zbWFsbD4nICtcbiAgICAgICAgJzxkaXY+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cIm1hcmtldF9jYXBUaWNrZXIgcGFyc2VOdW1iZXJcIj4nKyB3aWRnZXRzU3RhdGVzWzBdLmVtcHR5RGF0YSArICcgPC9zcGFuPicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJzeW1ib2xUaWNrZXIgc2hvd0RldGFpbHNDdXJyZW5jeVwiPjwvc3Bhbj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJtYXJrZXRfY2FwX2NoYW5nZV8yNGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rXCI+Jysgd2lkZ2V0c1N0YXRlc1swXS5lbXB0eURhdGEgKyAnPC9zcGFuPicgK1xuICAgICAgICAnPC9kaXY+JztcbiAgICB9LFxuICAgIHdpZGdldEZvb3RlcjogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIGN1cnJlbmN5ID0gd2lkZ2V0c1N0YXRlc1tpbmRleF0uY3VycmVuY3k7XG4gICAgICByZXR1cm4gJzxwIGNsYXNzPVwiY3Atd2lkZ2V0X19mb290ZXIgY3Atd2lkZ2V0X19mb290ZXItLScraW5kZXgrJ1wiPicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9wb3dlcmVkX2J5XCI+Jyt3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwicG93ZXJlZF9ieVwiKSArICcgPC9zcGFuPicgK1xuICAgICAgICAnPGltZyBzdHlsZT1cIndpZHRoOiAxNnB4XCIgc3JjPVwiJysgd2lkZ2V0RnVuY3Rpb25zLm1haW5fbG9nb19saW5rKCkgKydcIiBhbHQ9XCJcIi8+JyArXG4gICAgICAgICc8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJysgd2lkZ2V0RnVuY3Rpb25zLmNvaW5fbGluayhjdXJyZW5jeSkgKydcIj5jb2lucGFwcmlrYS5jb208L2E+JyArXG4gICAgICAgICc8L3A+J1xuICAgIH0sXG4gICAgZ2V0SW1hZ2U6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciBkYXRhID0gd2lkZ2V0c1N0YXRlc1tpbmRleF07XG4gICAgICB2YXIgaW1nQ29udGFpbmVycyA9IGRhdGEubWFpbkVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY3Atd2lkZ2V0X19pbWcnKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW1nQ29udGFpbmVycy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhciBpbWdDb250YWluZXIgPSBpbWdDb250YWluZXJzW2ldO1xuICAgICAgICBpbWdDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY3Atd2lkZ2V0X19pbWctLWhpZGRlbicpO1xuICAgICAgICB2YXIgaW1nID0gaW1nQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpO1xuICAgICAgICB2YXIgbmV3SW1nID0gbmV3IEltYWdlO1xuICAgICAgICBuZXdJbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaW1nLnNyYyA9IHRoaXMuc3JjO1xuICAgICAgICAgIGltZ0NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX2ltZy0taGlkZGVuJyk7XG4gICAgICAgIH07XG4gICAgICAgIG5ld0ltZy5zcmMgPSB3aWRnZXRGdW5jdGlvbnMuaW1nX3NyYyhkYXRhLmN1cnJlbmN5KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGltZ19zcmM6IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHJldHVybiAnaHR0cHM6Ly9jb2lucGFwcmlrYS5jb20vY29pbi8nK2lkKycvbG9nby5wbmcnO1xuICAgIH0sXG4gICAgY29pbl9saW5rOiBmdW5jdGlvbihpZCl7XG4gICAgICByZXR1cm4gJ2h0dHBzOi8vY29pbnBhcHJpa2EuY29tL2NvaW4vJysgaWRcbiAgICB9LFxuICAgIG1haW5fbG9nb19saW5rOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIHdpZGdldERlZmF1bHRzLmltZ19zcmMgfHwgd2lkZ2V0RGVmYXVsdHMub3JpZ2luX3NyYyArJy9kaXN0L2ltZy9sb2dvX3dpZGdldC5zdmcnXG4gICAgfSxcbiAgICBnZXRTY3JpcHRFbGVtZW50OiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NjcmlwdFtkYXRhLWNwLWN1cnJlbmN5LXdpZGdldF0nKTtcbiAgICB9LFxuICAgIGdldFRyYW5zbGF0aW9uOiBmdW5jdGlvbihpbmRleCwgbGFiZWwpe1xuICAgICAgdmFyIHRleHQgPSAod2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zW3dpZGdldHNTdGF0ZXNbaW5kZXhdLmxhbmd1YWdlXSkgPyB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbd2lkZ2V0c1N0YXRlc1tpbmRleF0ubGFuZ3VhZ2VdW2xhYmVsXSA6IG51bGw7XG4gICAgICBpZiAoIXRleHQgJiYgd2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zWydlbiddKSB7XG4gICAgICAgIHRleHQgPSB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbJ2VuJ11bbGFiZWxdO1xuICAgICAgfVxuICAgICAgaWYgKCF0ZXh0KSB7XG4gICAgICAgIHJldHVybiB3aWRnZXRGdW5jdGlvbnMuYWRkTGFiZWxXaXRob3V0VHJhbnNsYXRpb24oaW5kZXgsIGxhYmVsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgfVxuICAgIH0sXG4gICAgYWRkTGFiZWxXaXRob3V0VHJhbnNsYXRpb246IGZ1bmN0aW9uKGluZGV4LCBsYWJlbCl7XG4gICAgICBpZiAoIXdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9uc1snZW4nXSkgd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9ucygnZW4nKTtcbiAgICAgIHJldHVybiB3aWRnZXRzU3RhdGVzW2luZGV4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLnB1c2gobGFiZWwpO1xuICAgIH0sXG4gICAgZ2V0VHJhbnNsYXRpb25zOiBmdW5jdGlvbihsYW5nKXtcbiAgICAgIGlmICghd2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddKXtcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB2YXIgdXJsID0gd2lkZ2V0RGVmYXVsdHMubGFuZ19zcmMgIHx8IHdpZGdldERlZmF1bHRzLm9yaWdpbl9zcmMgKyAnL2Rpc3QvbGFuZyc7XG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwgKyAnLycgKyBsYW5nICsgJy5qc29uJyk7XG4gICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMudXBkYXRlV2lkZ2V0VHJhbnNsYXRpb25zKGxhbmcsIEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5vbkVycm9yUmVxdWVzdCgwLCB4aHIpO1xuICAgICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9ucygnZW4nKTtcbiAgICAgICAgICAgIGRlbGV0ZSB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ107XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLm9uRXJyb3JSZXF1ZXN0KDAsIHhocik7XG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9ucygnZW4nKTtcbiAgICAgICAgICBkZWxldGUgd2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddO1xuICAgICAgICB9O1xuICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ10gPSB7fTtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xuICBcbiAgZnVuY3Rpb24gaW5pdFdpZGdldHMoKXtcbiAgICBpZiAoIXdpbmRvdy5jcEN1cnJlbmN5V2lkZ2V0c0luaXRpYWxpemVkKXtcbiAgICAgIHdpbmRvdy5jcEN1cnJlbmN5V2lkZ2V0c0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgIHZhciBtYWluRWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjb2lucGFwcmlrYS1jdXJyZW5jeS13aWRnZXQnKSk7XG4gICAgICB2YXIgc2NyaXB0RWxlbWVudCA9IHdpZGdldEZ1bmN0aW9ucy5nZXRTY3JpcHRFbGVtZW50KCk7XG4gICAgICBpZiAoc2NyaXB0RWxlbWVudCAmJiBzY3JpcHRFbGVtZW50LmRhdGFzZXQgJiYgc2NyaXB0RWxlbWVudC5kYXRhc2V0LmNwQ3VycmVuY3lXaWRnZXQpe1xuICAgICAgICB2YXIgZGF0YXNldCA9IEpTT04ucGFyc2Uoc2NyaXB0RWxlbWVudC5kYXRhc2V0LmNwQ3VycmVuY3lXaWRnZXQpO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoZGF0YXNldCkpe1xuICAgICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZGF0YXNldCk7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBrZXlzLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICAgIHZhciBrZXkgPSBrZXlzW2pdLnJlcGxhY2UoJy0nLCAnXycpO1xuICAgICAgICAgICAgd2lkZ2V0RGVmYXVsdHNba2V5XSA9IGRhdGFzZXRba2V5c1tqXV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgIHdpZGdldHNTdGF0ZXMgPSBbXTtcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IG1haW5FbGVtZW50cy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgdmFyIG5ld1NldHRpbmdzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh3aWRnZXREZWZhdWx0cykpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLm1haW5FbGVtZW50ID0gbWFpbkVsZW1lbnRzW2ldO1xuICAgICAgICAgIHdpZGdldHNTdGF0ZXMucHVzaChuZXdTZXR0aW5ncyk7XG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmluaXQoaSk7XG4gICAgICAgIH1cbiAgICAgIH0sIDUwKTtcbiAgICB9XG4gIH1cbiAgXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgaW5pdFdpZGdldHMsIGZhbHNlKTtcbiAgd2luZG93LmJpbmRXaWRnZXQgPSBmdW5jdGlvbigpe1xuICAgIHdpbmRvdy5jcEN1cnJlbmN5V2lkZ2V0c0luaXRpYWxpemVkID0gZmFsc2U7XG4gICAgaW5pdFdpZGdldHMoKTtcbiAgfTtcbn0pKCk7Il19
