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
    origin_src: 'https://cdn.jsdelivr.net/npm/@coinpaprika/widget-currency@1.0.4',
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
      var numberStr = number.toString();
      if (number > 100000){
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
      var text = widgetDefaults.translations[widgetsStates[index].language][label];
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
            delete widgetDefaults.translations[lang];
          }
        };
        xhr.onerror = function(){
          widgetFunctions.onErrorRequest(0, xhr);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIihmdW5jdGlvbigpe1xuICB2YXIgd2lkZ2V0c1N0YXRlcyA9IFtdO1xuICB2YXIgd2lkZ2V0RGVmYXVsdHMgPSB7XG4gICAgY3VycmVuY3k6ICdidGMtYml0Y29pbicsXG4gICAgcHJpbWFyeV9jdXJyZW5jeTogJ1VTRCcsXG4gICAgdmVyc2lvbjogJ2V4dGVuZGVkJyxcbiAgICB1cGRhdGVfYWN0aXZlOiBmYWxzZSxcbiAgICB1cGRhdGVfdGltZW91dDogJzMwcycsXG4gICAgbGFuZ3VhZ2U6ICdlbicsXG4gICAgc3R5bGVfc3JjOiBudWxsLFxuICAgIGltZ19zcmM6IG51bGwsXG4gICAgbGFuZ19zcmM6IG51bGwsXG4gICAgb3JpZ2luX3NyYzogJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vQGNvaW5wYXByaWthL3dpZGdldC1jdXJyZW5jeUAxLjAuNCcsXG4gICAgc2hvd19kZXRhaWxzX2N1cnJlbmN5OiBmYWxzZSxcbiAgICBlbXB0eURhdGE6ICctJyxcbiAgICBlbXB0eVZhbHVlOiAwLFxuICAgIHRpY2tlcjoge1xuICAgICAgbmFtZTogdW5kZWZpbmVkLFxuICAgICAgc3ltYm9sOiB1bmRlZmluZWQsXG4gICAgICBwcmljZTogdW5kZWZpbmVkLFxuICAgICAgcHJpY2VfY2hhbmdlXzI0aDogdW5kZWZpbmVkLFxuICAgICAgcmFuazogdW5kZWZpbmVkLFxuICAgICAgcHJpY2VfYXRoOiB1bmRlZmluZWQsXG4gICAgICB2b2x1bWVfMjRoOiB1bmRlZmluZWQsXG4gICAgICBtYXJrZXRfY2FwOiB1bmRlZmluZWQsXG4gICAgICBwZXJjZW50X2Zyb21fcHJpY2VfYXRoOiB1bmRlZmluZWQsXG4gICAgICB2b2x1bWVfMjRoX2NoYW5nZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgIG1hcmtldF9jYXBfY2hhbmdlXzI0aDogdW5kZWZpbmVkLFxuICAgIH0sXG4gICAgaW50ZXJ2YWw6IG51bGwsXG4gICAgaXNEYXRhOiBmYWxzZSxcbiAgICBtZXNzYWdlOiAnZGF0YV9sb2FkaW5nJyxcbiAgICB0cmFuc2xhdGlvbnM6IHt9LFxuICAgIG1haW5FbGVtZW50OiBudWxsLFxuICAgIG5vVHJhbnNsYXRpb25MYWJlbHM6IFtdLFxuICB9O1xuICB2YXIgd2lkZ2V0RnVuY3Rpb25zID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIGlmICghd2lkZ2V0RnVuY3Rpb25zLmdldE1haW5FbGVtZW50KGluZGV4KSkge1xuICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcignQmluZCBmYWlsZWQsIG5vIGVsZW1lbnQgd2l0aCBjbGFzcyA9IFwiY29pbnBhcHJpa2EtY3VycmVuY3ktd2lkZ2V0XCInKTtcbiAgICAgIH1cbiAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXREZWZhdWx0cyhpbmRleCk7XG4gICAgICB3aWRnZXRGdW5jdGlvbnMuc2V0T3JpZ2luTGluayhpbmRleCk7XG4gICAgfSxcbiAgICBzZXRPcmlnaW5MaW5rOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICBpZiAoT2JqZWN0LmtleXMod2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zKS5sZW5ndGggPT09IDApIHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbnMod2lkZ2V0RGVmYXVsdHMubGFuZ3VhZ2UpO1xuICAgICAgd2lkZ2V0RnVuY3Rpb25zLnN0eWxlc2hlZXQoKTtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmFkZFdpZGdldEVsZW1lbnQoaW5kZXgpO1xuICAgICAgICB3aWRnZXRGdW5jdGlvbnMuaW5pdEludGVydmFsKGluZGV4KTtcbiAgICAgIH0sIDEwMCk7XG4gICAgfSxcbiAgICBnZXRNYWluRWxlbWVudDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgcmV0dXJuIHdpZGdldHNTdGF0ZXNbaW5kZXhdLm1haW5FbGVtZW50O1xuICAgIH0sXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgeGhyLm9wZW4oJ0dFVCcsICdodHRwczovL2FwaS5jb2lucGFwcmlrYS5jb20vdjEvd2lkZ2V0Lycrd2lkZ2V0c1N0YXRlc1tpbmRleF0uY3VycmVuY3krJz9xdW90ZT0nK3dpZGdldHNTdGF0ZXNbaW5kZXhdLnByaW1hcnlfY3VycmVuY3kpO1xuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgaWYgKCF3aWRnZXRzU3RhdGVzW2luZGV4XS5pc0RhdGEpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnaXNEYXRhJywgdHJ1ZSk7XG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZVRpY2tlcihpbmRleCwgSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLm9uRXJyb3JSZXF1ZXN0KGluZGV4LCB4aHIpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpe1xuICAgICAgICB3aWRnZXRGdW5jdGlvbnMub25FcnJvclJlcXVlc3QoaW5kZXgsIHhocik7XG4gICAgICB9O1xuICAgICAgeGhyLnNlbmQoKTtcbiAgICB9LFxuICAgIG9uRXJyb3JSZXF1ZXN0OiBmdW5jdGlvbihpbmRleCwgeGhyKXtcbiAgICAgIGlmICh3aWRnZXRzU3RhdGVzW2luZGV4XS5pc0RhdGEpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnaXNEYXRhJywgZmFsc2UpO1xuICAgICAgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdtZXNzYWdlJywgJ2RhdGFfdW5hdmFpbGFibGUnKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1JlcXVlc3QgZmFpbGVkLiAgUmV0dXJuZWQgc3RhdHVzIG9mICcgKyB4aHIsIHdpZGdldHNTdGF0ZXNbaW5kZXhdKTtcbiAgICB9LFxuICAgIGluaXRJbnRlcnZhbDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgY2xlYXJJbnRlcnZhbCh3aWRnZXRzU3RhdGVzW2luZGV4XS5pbnRlcnZhbCk7XG4gICAgICBpZiAod2lkZ2V0c1N0YXRlc1tpbmRleF0udXBkYXRlX2FjdGl2ZSAmJiB3aWRnZXRzU3RhdGVzW2luZGV4XS51cGRhdGVfdGltZW91dCA+IDEwMDApe1xuICAgICAgICB3aWRnZXRzU3RhdGVzW2luZGV4XS5pbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmdldERhdGEoaW5kZXgpO1xuICAgICAgICB9LCB3aWRnZXRzU3RhdGVzW2luZGV4XS51cGRhdGVfdGltZW91dCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGRXaWRnZXRFbGVtZW50OiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgbWFpbkVsZW1lbnQgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgdmFyIGRldGFpbHMgPSAod2lkZ2V0c1N0YXRlc1tpbmRleF0udmVyc2lvbiA9PT0gJ2V4dGVuZGVkJykgPyAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9fZGV0YWlsc1wiPicgKyB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0QXRoRWxlbWVudChpbmRleCkgKyB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0Vm9sdW1lMjRoRWxlbWVudChpbmRleCkgKyB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0TWFya2V0Q2FwRWxlbWVudChpbmRleCkgKyAnPC9kaXY+JyA6ICcnO1xuICAgICAgdmFyIHdpZGdldEVsZW1lbnQgPSB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0TWFpbkVsZW1lbnQoaW5kZXgpICsgZGV0YWlscyArIHdpZGdldEZ1bmN0aW9ucy53aWRnZXRGb290ZXIoaW5kZXgpO1xuICAgICAgbWFpbkVsZW1lbnQuaW5uZXJIVE1MID0gd2lkZ2V0RWxlbWVudDtcbiAgICAgIHdpZGdldEZ1bmN0aW9ucy5zZXRCZWZvcmVFbGVtZW50SW5Gb290ZXIoaW5kZXgpO1xuICAgICAgd2lkZ2V0RnVuY3Rpb25zLmdldERhdGEoaW5kZXgpO1xuICAgIH0sXG4gICAgc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgbWFpbkVsZW1lbnQgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgaWYgKG1haW5FbGVtZW50LmNoaWxkcmVuWzBdLmxvY2FsTmFtZSA9PT0gJ3N0eWxlJyl7XG4gICAgICAgIG1haW5FbGVtZW50LnJlbW92ZUNoaWxkKG1haW5FbGVtZW50LmNoaWxkTm9kZXNbMF0pO1xuICAgICAgfVxuICAgICAgdmFyIGZvb3RlckVsZW1lbnQgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuY3Atd2lkZ2V0X19mb290ZXInKTtcbiAgICAgIHZhciB2YWx1ZSA9IGZvb3RlckVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLSA0MztcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZm9vdGVyRWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFsdWUgLT0gZm9vdGVyRWxlbWVudC5jaGlsZE5vZGVzW2ldLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgfVxuICAgICAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIHN0eWxlLmlubmVySFRNTCA9ICcuY3Atd2lkZ2V0X19mb290ZXItLScraW5kZXgrJzo6YmVmb3Jle3dpZHRoOicrdmFsdWUudG9GaXhlZCgwKSsncHg7fSc7XG4gICAgICBtYWluRWxlbWVudC5pbnNlcnRCZWZvcmUoc3R5bGUsIG1haW5FbGVtZW50LmNoaWxkcmVuWzBdKTtcbiAgICB9LFxuICAgIGdldERlZmF1bHRzOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgbWFpbkVsZW1lbnQgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQpe1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC52ZXJzaW9uKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3ZlcnNpb24nLCBtYWluRWxlbWVudC5kYXRhc2V0LnZlcnNpb24pO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5wcmltYXJ5Q3VycmVuY3kpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAncHJpbWFyeV9jdXJyZW5jeScsIG1haW5FbGVtZW50LmRhdGFzZXQucHJpbWFyeUN1cnJlbmN5KTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuY3VycmVuY3kpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnY3VycmVuY3knLCBtYWluRWxlbWVudC5kYXRhc2V0LmN1cnJlbmN5KTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuc2hvd0RldGFpbHNDdXJyZW5jeSkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdzaG93X2RldGFpbHNfY3VycmVuY3knLCAobWFpbkVsZW1lbnQuZGF0YXNldC5zaG93RGV0YWlsc0N1cnJlbmN5ID09PSAndHJ1ZScpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlQWN0aXZlKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3VwZGF0ZV9hY3RpdmUnLCAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVBY3RpdmUgPT09ICd0cnVlJykpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVUaW1lb3V0KSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3VwZGF0ZV90aW1lb3V0Jywgd2lkZ2V0RnVuY3Rpb25zLnBhcnNlSW50ZXJ2YWxWYWx1ZShtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZVRpbWVvdXQpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ3VhZ2UpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnbGFuZ3VhZ2UnLCBtYWluRWxlbWVudC5kYXRhc2V0Lmxhbmd1YWdlKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQub3JpZ2luU3JjKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ29yaWdpbl9zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0Lm9yaWdpblNyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lm5vZGVNb2R1bGVzU3JjKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ25vZGVfbW9kdWxlc19zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0Lm5vZGVNb2R1bGVzU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuYm93ZXJTcmMpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnYm93ZXJfc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5ib3dlclNyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnN0eWxlU3JjKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3N0eWxlX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQuc3R5bGVTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5sYW5nU3JjKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ2xvZ29fc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5sYW5nU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuaW1nU3JjKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ2xvZ29fc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5pbWdTcmMpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlV2lkZ2V0RWxlbWVudDogZnVuY3Rpb24oaW5kZXgsIGtleSwgdmFsdWUsIHRpY2tlcil7XG4gICAgICB2YXIgc3RhdGUgPSB3aWRnZXRzU3RhdGVzW2luZGV4XTtcbiAgICAgIHZhciBtYWluRWxlbWVudCA9IHdpZGdldEZ1bmN0aW9ucy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgICBpZiAobWFpbkVsZW1lbnQpe1xuICAgICAgICB2YXIgdGlja2VyQ2xhc3MgPSAodGlja2VyKSA/ICdUaWNrZXInIDogJyc7XG4gICAgICAgIGlmIChrZXkgPT09ICduYW1lJyB8fCBrZXkgPT09ICdjdXJyZW5jeScpe1xuICAgICAgICAgIGlmIChrZXkgPT09ICdjdXJyZW5jeScpe1xuICAgICAgICAgICAgdmFyIGFFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXRfX2Zvb3RlciA+IGEnKTtcbiAgICAgICAgICAgIGZvcih2YXIgayA9IDA7IGsgPCBhRWxlbWVudHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgYUVsZW1lbnRzW2tdLmhyZWYgPSB3aWRnZXRGdW5jdGlvbnMuY29pbl9saW5rKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmdldEltYWdlKGluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoa2V5ID09PSAnaXNEYXRhJyB8fCBrZXkgPT09ICdtZXNzYWdlJyl7XG4gICAgICAgICAgdmFyIGhlYWRlckVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNwLXdpZGdldF9fbWFpbicpO1xuICAgICAgICAgIGZvcih2YXIgayA9IDA7IGsgPCBoZWFkZXJFbGVtZW50cy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgaGVhZGVyRWxlbWVudHNba10uaW5uZXJIVE1MID0gKCFzdGF0ZS5pc0RhdGEpID8gd2lkZ2V0RnVuY3Rpb25zLndpZGdldE1haW5FbGVtZW50TWVzc2FnZShpbmRleCkgOiB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0TWFpbkVsZW1lbnREYXRhKGluZGV4KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHVwZGF0ZUVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicra2V5K3RpY2tlckNsYXNzKTtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHVwZGF0ZUVsZW1lbnRzLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICAgIHZhciB1cGRhdGVFbGVtZW50ID0gdXBkYXRlRWxlbWVudHNbal07XG4gICAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NwLXdpZGdldF9fcmFuaycpKXtcbiAgICAgICAgICAgICAgdmFyIGNsYXNzTmFtZSA9IChwYXJzZUZsb2F0KHZhbHVlKSA+IDApID8gXCJjcC13aWRnZXRfX3JhbmstdXBcIiA6ICgocGFyc2VGbG9hdCh2YWx1ZSkgPCAwKSA/IFwiY3Atd2lkZ2V0X19yYW5rLWRvd25cIiA6IFwiY3Atd2lkZ2V0X19yYW5rLW5ldXRyYWxcIik7XG4gICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLWRvd24nKTtcbiAgICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX3JhbmstdXAnKTtcbiAgICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX3JhbmstbmV1dHJhbCcpO1xuICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBzdGF0ZS5lbXB0eURhdGE7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAoa2V5ID09PSAncHJpY2VfY2hhbmdlXzI0aCcpID8gJygnK3dpZGdldEZ1bmN0aW9ucy5yb3VuZEFtb3VudCh2YWx1ZSwgMikrJyUpJzogd2lkZ2V0RnVuY3Rpb25zLnJvdW5kQW1vdW50KHZhbHVlLCAyKSsnJSc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvd0RldGFpbHNDdXJyZW5jeScpICYmICFzdGF0ZS5zaG93X2RldGFpbHNfY3VycmVuY3kpIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSAnICc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BhcnNlTnVtYmVyJykpe1xuICAgICAgICAgICAgICB1cGRhdGVFbGVtZW50LmlubmVyVGV4dCA9IHdpZGdldEZ1bmN0aW9ucy5wYXJzZU51bWJlcih2YWx1ZSkgfHwgc3RhdGUuZW1wdHlEYXRhO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5pbm5lclRleHQgPSB2YWx1ZSB8fCBzdGF0ZS5lbXB0eURhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVEYXRhOiBmdW5jdGlvbihpbmRleCwga2V5LCB2YWx1ZSwgdGlja2VyKXtcbiAgICAgIGlmICh0aWNrZXIpe1xuICAgICAgICB3aWRnZXRzU3RhdGVzW2luZGV4XS50aWNrZXJba2V5XSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2lkZ2V0c1N0YXRlc1tpbmRleF1ba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKGtleSA9PT0gJ2xhbmd1YWdlJyl7XG4gICAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbnModmFsdWUpO1xuICAgICAgfVxuICAgICAgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZVdpZGdldEVsZW1lbnQoaW5kZXgsIGtleSwgdmFsdWUsIHRpY2tlcik7XG4gICAgfSxcbiAgICB1cGRhdGVXaWRnZXRUcmFuc2xhdGlvbnM6IGZ1bmN0aW9uKGxhbmcsIGRhdGEpe1xuICAgICAgd2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddID0gZGF0YTtcbiAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgd2lkZ2V0c1N0YXRlcy5sZW5ndGg7IHgrKyl7XG4gICAgICAgIHZhciBpc05vVHJhbnNsYXRpb25MYWJlbHNVcGRhdGUgPSB3aWRnZXRzU3RhdGVzW3hdLm5vVHJhbnNsYXRpb25MYWJlbHMubGVuZ3RoID4gMCAmJiBsYW5nID09PSAnZW4nO1xuICAgICAgICBpZiAod2lkZ2V0c1N0YXRlc1t4XS5sYW5ndWFnZSA9PT0gbGFuZyB8fCBpc05vVHJhbnNsYXRpb25MYWJlbHNVcGRhdGUpe1xuICAgICAgICAgIHZhciBtYWluRWxlbWVudCA9IHdpZGdldHNTdGF0ZXNbeF0ubWFpbkVsZW1lbnQ7XG4gICAgICAgICAgdmFyIHRyYW5zYWx0ZUVsZW1lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNwLXRyYW5zbGF0aW9uJykpO1xuICAgICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgdHJhbnNhbHRlRWxlbWVudHMubGVuZ3RoOyB5Kyspe1xuICAgICAgICAgICAgdHJhbnNhbHRlRWxlbWVudHNbeV0uY2xhc3NMaXN0LmZvckVhY2goZnVuY3Rpb24oY2xhc3NOYW1lKXtcbiAgICAgICAgICAgICAgaWYgKGNsYXNzTmFtZS5zZWFyY2goJ3RyYW5zbGF0aW9uXycpID4gLTEpe1xuICAgICAgICAgICAgICAgIHZhciB0cmFuc2xhdGVLZXkgPSBjbGFzc05hbWUucmVwbGFjZSgndHJhbnNsYXRpb25fJywgJycpO1xuICAgICAgICAgICAgICAgIGlmICh0cmFuc2xhdGVLZXkgPT09ICdtZXNzYWdlJykgdHJhbnNsYXRlS2V5ID0gd2lkZ2V0c1N0YXRlc1t4XS5tZXNzYWdlO1xuICAgICAgICAgICAgICAgIHZhciBsYWJlbEluZGV4ID0gd2lkZ2V0c1N0YXRlc1t4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLmluZGV4T2YodHJhbnNsYXRlS2V5KTtcbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbih4LCB0cmFuc2xhdGVLZXkpO1xuICAgICAgICAgICAgICAgIGlmIChsYWJlbEluZGV4ID4gLTEgJiYgdGV4dCl7XG4gICAgICAgICAgICAgICAgICB3aWRnZXRzU3RhdGVzW3hdLm5vVHJhbnNsYXRpb25MYWJlbHMuc3BsaWNlKGxhYmVsSW5kZXgsIDEpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRyYW5zYWx0ZUVsZW1lbnRzW3ldLmlubmVyVGV4dCA9IHRleHQ7XG4gICAgICAgICAgICAgICAgaWYgKHRyYW5zYWx0ZUVsZW1lbnRzW3ldLmNsb3Nlc3QoJy5jcC13aWRnZXRfX2Zvb3RlcicpKXtcbiAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQod2lkZ2V0RnVuY3Rpb25zLnNldEJlZm9yZUVsZW1lbnRJbkZvb3Rlci5iaW5kKG51bGwsIHgpLCA1MCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlVGlja2VyOiBmdW5jdGlvbihpbmRleCwgZGF0YSl7XG4gICAgICB2YXIgZGF0YUtleXMgPSBPYmplY3Qua2V5cyhkYXRhKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YUtleXMubGVuZ3RoOyBpKyspe1xuICAgICAgICB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgZGF0YUtleXNbaV0sIGRhdGFbZGF0YUtleXNbaV1dLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHBhcnNlSW50ZXJ2YWxWYWx1ZTogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgdmFyIHRpbWVTeW1ib2wgPSAnJywgbXVsdGlwbGllciA9IDE7XG4gICAgICBpZiAodmFsdWUuc2VhcmNoKCdzJykgPiAtMSl7XG4gICAgICAgIHRpbWVTeW1ib2wgPSAncyc7XG4gICAgICAgIG11bHRpcGxpZXIgPSAxMDAwO1xuICAgICAgfVxuICAgICAgaWYgKHZhbHVlLnNlYXJjaCgnbScpID4gLTEpe1xuICAgICAgICB0aW1lU3ltYm9sID0gJ20nO1xuICAgICAgICBtdWx0aXBsaWVyID0gNjAgKiAxMDAwO1xuICAgICAgfVxuICAgICAgaWYgKHZhbHVlLnNlYXJjaCgnaCcpID4gLTEpe1xuICAgICAgICB0aW1lU3ltYm9sID0gJ2gnO1xuICAgICAgICBtdWx0aXBsaWVyID0gNjAgKiA2MCAqIDEwMDA7XG4gICAgICB9XG4gICAgICBpZiAodmFsdWUuc2VhcmNoKCdkJykgPiAtMSl7XG4gICAgICAgIHRpbWVTeW1ib2wgPSAnZCc7XG4gICAgICAgIG11bHRpcGxpZXIgPSAyNCAqIDYwICogNjAgKiAxMDAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUucmVwbGFjZSh0aW1lU3ltYm9sLCcnKSkgKiBtdWx0aXBsaWVyO1xuICAgIH0sXG4gICAgcGFyc2VOdW1iZXI6IGZ1bmN0aW9uKG51bWJlcil7XG4gICAgICBpZiAoIW51bWJlciAmJiBudW1iZXIgIT09IDApIHJldHVybiBudW1iZXI7XG4gICAgICBpZiAobnVtYmVyID09PSB3aWRnZXRzU3RhdGVzWzBdLmVtcHR5VmFsdWUgfHwgbnVtYmVyID09PSB3aWRnZXRzU3RhdGVzWzBdLmVtcHR5RGF0YSkgcmV0dXJuIG51bWJlcjtcbiAgICAgIG51bWJlciA9IHBhcnNlRmxvYXQobnVtYmVyKTtcbiAgICAgIHZhciBudW1iZXJTdHIgPSBudW1iZXIudG9TdHJpbmcoKTtcbiAgICAgIGlmIChudW1iZXIgPiAxMDAwMDApe1xuICAgICAgICB2YXIgcGFyYW1ldGVyID0gJ0snLFxuICAgICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDEpO1xuICAgICAgICBpZiAobnVtYmVyID4gMTAwMDAwMDAwMCl7XG4gICAgICAgICAgc3BsaWNlZCA9IG51bWJlclN0ci5zbGljZSgwLCBudW1iZXJTdHIubGVuZ3RoIC0gNyk7XG4gICAgICAgICAgcGFyYW1ldGVyID0gJ0InO1xuICAgICAgICB9IGVsc2UgaWYgKG51bWJlciA+IDEwMDAwMDApe1xuICAgICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDQpO1xuICAgICAgICAgIHBhcmFtZXRlciA9ICdNJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgbmF0dXJhbCA9IHNwbGljZWQuc2xpY2UoMCwgc3BsaWNlZC5sZW5ndGggLSAyKTtcbiAgICAgICAgdmFyIGRlY2ltYWwgPSBzcGxpY2VkLnNsaWNlKHNwbGljZWQubGVuZ3RoIC0gMik7XG4gICAgICAgIHJldHVybiBuYXR1cmFsICsgJy4nICsgZGVjaW1hbCArICcgJyArIHBhcmFtZXRlcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBpc0RlY2ltYWwgPSAobnVtYmVyICUgMSkgPiAwO1xuICAgICAgICBpZiAoaXNEZWNpbWFsKXtcbiAgICAgICAgICB2YXIgcHJlY2lzaW9uID0gMjtcbiAgICAgICAgICBpZiAobnVtYmVyIDwgMSl7XG4gICAgICAgICAgICBwcmVjaXNpb24gPSA4O1xuICAgICAgICAgIH0gZWxzZSBpZiAobnVtYmVyIDwgMTApe1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gNjtcbiAgICAgICAgICB9IGVsc2UgaWYgKG51bWJlciA8IDEwMDApe1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gNDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHdpZGdldEZ1bmN0aW9ucy5yb3VuZEFtb3VudChudW1iZXIsIHByZWNpc2lvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG51bWJlci50b0ZpeGVkKDIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICByb3VuZEFtb3VudDogZnVuY3Rpb24oYW1vdW50LCBkZWNpbWFsLCBkaXJlY3Rpb24pe1xuICAgICAgYW1vdW50ID0gcGFyc2VGbG9hdChhbW91bnQpO1xuICAgICAgaWYgKCFkZWNpbWFsKSBkZWNpbWFsID0gODtcbiAgICAgIGlmICghZGlyZWN0aW9uKSBkaXJlY3Rpb24gPSAncm91bmQnO1xuICAgICAgZGVjaW1hbCA9IE1hdGgucG93KDEwLCBkZWNpbWFsKTtcbiAgICAgIHJldHVybiBNYXRoW2RpcmVjdGlvbl0oYW1vdW50ICogZGVjaW1hbCkgLyBkZWNpbWFsO1xuICAgIH0sXG4gICAgc3R5bGVzaGVldDogZnVuY3Rpb24oKXtcbiAgICAgIGlmICh3aWRnZXREZWZhdWx0cy5zdHlsZV9zcmMgIT09IGZhbHNlKXtcbiAgICAgICAgdmFyIHVybCA9IHdpZGdldERlZmF1bHRzLnN0eWxlX3NyYyB8fCB3aWRnZXREZWZhdWx0cy5vcmlnaW5fc3JjICsnL2Rpc3Qvd2lkZ2V0Lm1pbi5jc3MnO1xuICAgICAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ3JlbCcsICdzdHlsZXNoZWV0Jyk7XG4gICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgdXJsKTtcbiAgICAgICAgcmV0dXJuIChkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJ2xpbmtbaHJlZj1cIicrdXJsKydcIl0nKSkgPyAnJyA6IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgICB9XG4gICAgfSxcbiAgICB3aWRnZXRNYWluRWxlbWVudDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIGRhdGEgPSB3aWRnZXRzU3RhdGVzW2luZGV4XTtcbiAgICAgIHJldHVybiAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9faGVhZGVyXCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiJysnY3Atd2lkZ2V0X19pbWcgY3Atd2lkZ2V0X19pbWctJytkYXRhLmN1cnJlbmN5KydcIj4nICtcbiAgICAgICAgJzxpbWcvPicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19tYWluXCI+JyArXG4gICAgICAgICgoZGF0YS5pc0RhdGEpID8gd2lkZ2V0RnVuY3Rpb25zLndpZGdldE1haW5FbGVtZW50RGF0YShpbmRleCkgOiB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0TWFpbkVsZW1lbnRNZXNzYWdlKGluZGV4KSkgK1xuICAgICAgICAnPC9kaXY+JytcbiAgICAgICAgJzwvZGl2Pic7XG4gICAgfSxcbiAgICB3aWRnZXRNYWluRWxlbWVudERhdGE6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciBkYXRhID0gd2lkZ2V0c1N0YXRlc1tpbmRleF07XG4gICAgICByZXR1cm4gJzxoMz48YSBocmVmPVwiJysgd2lkZ2V0RnVuY3Rpb25zLmNvaW5fbGluayhkYXRhLmN1cnJlbmN5KSArJ1wiPicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJuYW1lVGlja2VyXCI+JysgKGRhdGEudGlja2VyLm5hbWUgfHwgZGF0YS5lbXB0eURhdGEpICsnPC9zcGFuPicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJzeW1ib2xUaWNrZXJcIj4nKyAoZGF0YS50aWNrZXIuc3ltYm9sIHx8IGRhdGEuZW1wdHlEYXRhKSArJzwvc3Bhbj4nICtcbiAgICAgICAgJzwvYT48L2gzPicgK1xuICAgICAgICAnPHN0cm9uZz4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwicHJpY2VUaWNrZXIgcGFyc2VOdW1iZXJcIj4nKyAod2lkZ2V0RnVuY3Rpb25zLnBhcnNlTnVtYmVyKGRhdGEudGlja2VyLnByaWNlKSB8fCBkYXRhLmVtcHR5RGF0YSkgKyAnPC9zcGFuPiAnICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwicHJpbWFyeUN1cnJlbmN5XCI+JysgZGF0YS5wcmltYXJ5X2N1cnJlbmN5ICsgJyA8L3NwYW4+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInByaWNlX2NoYW5nZV8yNGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rIGNwLXdpZGdldF9fcmFuay0nKyAoKGRhdGEudGlja2VyLnByaWNlX2NoYW5nZV8yNGggPiAwKSA/IFwidXBcIiA6ICgoZGF0YS50aWNrZXIucHJpY2VfY2hhbmdlXzI0aCA8IDApID8gXCJkb3duXCIgOiBcIm5ldXRyYWxcIikpICsnXCI+KCcrICh3aWRnZXRGdW5jdGlvbnMucm91bmRBbW91bnQoZGF0YS50aWNrZXIucHJpY2VfY2hhbmdlXzI0aCwgMikgfHwgZGF0YS5lbXB0eVZhbHVlKSArJyUpPC9zcGFuPicgK1xuICAgICAgICAnPC9zdHJvbmc+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldF9fcmFuay1sYWJlbFwiPjxzcGFuIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fcmFua1wiPicrd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInJhbmtcIikrJzwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJyYW5rVGlja2VyXCI+JysgKGRhdGEudGlja2VyLnJhbmsgfHwgZGF0YS5lbXB0eURhdGEpICsnPC9zcGFuPjwvc3Bhbj4nO1xuICAgIH0sXG4gICAgd2lkZ2V0TWFpbkVsZW1lbnRNZXNzYWdlOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgbWVzc2FnZSA9IHdpZGdldHNTdGF0ZXNbaW5kZXhdLm1lc3NhZ2U7XG4gICAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX21haW4tbm8tZGF0YSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9tZXNzYWdlXCI+JysgKHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbihpbmRleCwgbWVzc2FnZSkpICsnPC9kaXY+JztcbiAgICB9LFxuICAgIHdpZGdldEF0aEVsZW1lbnQ6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHJldHVybiAnPGRpdj4nICtcbiAgICAgICAgJzxzbWFsbCBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX2F0aFwiPicrd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcImF0aFwiKSsnPC9zbWFsbD4nICtcbiAgICAgICAgJzxkaXY+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInByaWNlX2F0aFRpY2tlciBwYXJzZU51bWJlclwiPicrIHdpZGdldHNTdGF0ZXNbMF0uZW1wdHlEYXRhICsgJyA8L3NwYW4+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlciBzaG93RGV0YWlsc0N1cnJlbmN5XCI+PC9zcGFuPicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInBlcmNlbnRfZnJvbV9wcmljZV9hdGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rXCI+Jysgd2lkZ2V0c1N0YXRlc1swXS5lbXB0eURhdGEgKyAnPC9zcGFuPicgK1xuICAgICAgICAnPC9kaXY+J1xuICAgIH0sXG4gICAgd2lkZ2V0Vm9sdW1lMjRoRWxlbWVudDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgcmV0dXJuICc8ZGl2PicgK1xuICAgICAgICAnPHNtYWxsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fdm9sdW1lXzI0aFwiPicrd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInZvbHVtZV8yNGhcIikrJzwvc21hbGw+JyArXG4gICAgICAgICc8ZGl2PicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJ2b2x1bWVfMjRoVGlja2VyIHBhcnNlTnVtYmVyXCI+Jysgd2lkZ2V0c1N0YXRlc1swXS5lbXB0eURhdGEgKyAnIDwvc3Bhbj4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwic3ltYm9sVGlja2VyIHNob3dEZXRhaWxzQ3VycmVuY3lcIj48L3NwYW4+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwidm9sdW1lXzI0aF9jaGFuZ2VfMjRoVGlja2VyIGNwLXdpZGdldF9fcmFua1wiPicrIHdpZGdldHNTdGF0ZXNbMF0uZW1wdHlEYXRhICsgJzwvc3Bhbj4nICtcbiAgICAgICAgJzwvZGl2Pic7XG4gICAgfSxcbiAgICB3aWRnZXRNYXJrZXRDYXBFbGVtZW50OiBmdW5jdGlvbihpbmRleCl7XG4gICAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAgICc8c21hbGwgY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9tYXJrZXRfY2FwXCI+Jyt3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwibWFya2V0X2NhcFwiKSsnPC9zbWFsbD4nICtcbiAgICAgICAgJzxkaXY+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cIm1hcmtldF9jYXBUaWNrZXIgcGFyc2VOdW1iZXJcIj4nKyB3aWRnZXRzU3RhdGVzWzBdLmVtcHR5RGF0YSArICcgPC9zcGFuPicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJzeW1ib2xUaWNrZXIgc2hvd0RldGFpbHNDdXJyZW5jeVwiPjwvc3Bhbj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJtYXJrZXRfY2FwX2NoYW5nZV8yNGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rXCI+Jysgd2lkZ2V0c1N0YXRlc1swXS5lbXB0eURhdGEgKyAnPC9zcGFuPicgK1xuICAgICAgICAnPC9kaXY+JztcbiAgICB9LFxuICAgIHdpZGdldEZvb3RlcjogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIGN1cnJlbmN5ID0gd2lkZ2V0c1N0YXRlc1tpbmRleF0uY3VycmVuY3k7XG4gICAgICByZXR1cm4gJzxwIGNsYXNzPVwiY3Atd2lkZ2V0X19mb290ZXIgY3Atd2lkZ2V0X19mb290ZXItLScraW5kZXgrJ1wiPicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9wb3dlcmVkX2J5XCI+Jyt3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwicG93ZXJlZF9ieVwiKSArICcgPC9zcGFuPicgK1xuICAgICAgICAnPGltZyBzdHlsZT1cIndpZHRoOiAxNnB4XCIgc3JjPVwiJysgd2lkZ2V0RnVuY3Rpb25zLm1haW5fbG9nb19saW5rKCkgKydcIiBhbHQ9XCJcIi8+JyArXG4gICAgICAgICc8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJysgd2lkZ2V0RnVuY3Rpb25zLmNvaW5fbGluayhjdXJyZW5jeSkgKydcIj5jb2lucGFwcmlrYS5jb208L2E+JyArXG4gICAgICAgICc8L3A+J1xuICAgIH0sXG4gICAgZ2V0SW1hZ2U6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciBkYXRhID0gd2lkZ2V0c1N0YXRlc1tpbmRleF07XG4gICAgICB2YXIgaW1nQ29udGFpbmVycyA9IGRhdGEubWFpbkVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY3Atd2lkZ2V0X19pbWcnKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW1nQ29udGFpbmVycy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhciBpbWdDb250YWluZXIgPSBpbWdDb250YWluZXJzW2ldO1xuICAgICAgICBpbWdDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY3Atd2lkZ2V0X19pbWctLWhpZGRlbicpO1xuICAgICAgICB2YXIgaW1nID0gaW1nQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpO1xuICAgICAgICB2YXIgbmV3SW1nID0gbmV3IEltYWdlO1xuICAgICAgICBuZXdJbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaW1nLnNyYyA9IHRoaXMuc3JjO1xuICAgICAgICAgIGltZ0NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX2ltZy0taGlkZGVuJyk7XG4gICAgICAgIH07XG4gICAgICAgIG5ld0ltZy5zcmMgPSB3aWRnZXRGdW5jdGlvbnMuaW1nX3NyYyhkYXRhLmN1cnJlbmN5KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGltZ19zcmM6IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHJldHVybiAnaHR0cHM6Ly9jb2lucGFwcmlrYS5jb20vY29pbi8nK2lkKycvbG9nby5wbmcnO1xuICAgIH0sXG4gICAgY29pbl9saW5rOiBmdW5jdGlvbihpZCl7XG4gICAgICByZXR1cm4gJ2h0dHBzOi8vY29pbnBhcHJpa2EuY29tL2NvaW4vJysgaWRcbiAgICB9LFxuICAgIG1haW5fbG9nb19saW5rOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIHdpZGdldERlZmF1bHRzLmltZ19zcmMgfHwgd2lkZ2V0RGVmYXVsdHMub3JpZ2luX3NyYyArJy9kaXN0L2ltZy9sb2dvX3dpZGdldC5zdmcnXG4gICAgfSxcbiAgICBnZXRTY3JpcHRFbGVtZW50OiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NjcmlwdFtkYXRhLWNwLWN1cnJlbmN5LXdpZGdldF0nKTtcbiAgICB9LFxuICAgIGdldFRyYW5zbGF0aW9uOiBmdW5jdGlvbihpbmRleCwgbGFiZWwpe1xuICAgICAgdmFyIHRleHQgPSB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbd2lkZ2V0c1N0YXRlc1tpbmRleF0ubGFuZ3VhZ2VdW2xhYmVsXTtcbiAgICAgIGlmICghdGV4dCAmJiB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbJ2VuJ10pIHtcbiAgICAgICAgdGV4dCA9IHdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9uc1snZW4nXVtsYWJlbF07XG4gICAgICB9XG4gICAgICBpZiAoIXRleHQpIHtcbiAgICAgICAgcmV0dXJuIHdpZGdldEZ1bmN0aW9ucy5hZGRMYWJlbFdpdGhvdXRUcmFuc2xhdGlvbihpbmRleCwgbGFiZWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGRMYWJlbFdpdGhvdXRUcmFuc2xhdGlvbjogZnVuY3Rpb24oaW5kZXgsIGxhYmVsKXtcbiAgICAgIGlmICghd2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zWydlbiddKSB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb25zKCdlbicpO1xuICAgICAgcmV0dXJuIHdpZGdldHNTdGF0ZXNbaW5kZXhdLm5vVHJhbnNsYXRpb25MYWJlbHMucHVzaChsYWJlbCk7XG4gICAgfSxcbiAgICBnZXRUcmFuc2xhdGlvbnM6IGZ1bmN0aW9uKGxhbmcpe1xuICAgICAgaWYgKCF3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ10pe1xuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHZhciB1cmwgPSB3aWRnZXREZWZhdWx0cy5sYW5nX3NyYyAgfHwgd2lkZ2V0RGVmYXVsdHMub3JpZ2luX3NyYyArICcvZGlzdC9sYW5nJztcbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCArICcvJyArIGxhbmcgKyAnLmpzb24nKTtcbiAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVXaWRnZXRUcmFuc2xhdGlvbnMobGFuZywgSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLm9uRXJyb3JSZXF1ZXN0KDAsIHhocik7XG4gICAgICAgICAgICBkZWxldGUgd2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpe1xuICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5vbkVycm9yUmVxdWVzdCgwLCB4aHIpO1xuICAgICAgICAgIGRlbGV0ZSB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ107XG4gICAgICAgIH07XG4gICAgICAgIHhoci5zZW5kKCk7XG4gICAgICAgIHdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXSA9IHt9O1xuICAgICAgfVxuICAgIH0sXG4gIH07XG4gIFxuICBmdW5jdGlvbiBpbml0V2lkZ2V0cygpe1xuICAgIGlmICghd2luZG93LmNwQ3VycmVuY3lXaWRnZXRzSW5pdGlhbGl6ZWQpe1xuICAgICAgd2luZG93LmNwQ3VycmVuY3lXaWRnZXRzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgdmFyIG1haW5FbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NvaW5wYXByaWthLWN1cnJlbmN5LXdpZGdldCcpKTtcbiAgICAgIHZhciBzY3JpcHRFbGVtZW50ID0gd2lkZ2V0RnVuY3Rpb25zLmdldFNjcmlwdEVsZW1lbnQoKTtcbiAgICAgIGlmIChzY3JpcHRFbGVtZW50ICYmIHNjcmlwdEVsZW1lbnQuZGF0YXNldCAmJiBzY3JpcHRFbGVtZW50LmRhdGFzZXQuY3BDdXJyZW5jeVdpZGdldCl7XG4gICAgICAgIHZhciBkYXRhc2V0ID0gSlNPTi5wYXJzZShzY3JpcHRFbGVtZW50LmRhdGFzZXQuY3BDdXJyZW5jeVdpZGdldCk7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhkYXRhc2V0KSl7XG4gICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhkYXRhc2V0KTtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGtleXMubGVuZ3RoOyBqKyspe1xuICAgICAgICAgICAgdmFyIGtleSA9IGtleXNbal0ucmVwbGFjZSgnLScsICdfJyk7XG4gICAgICAgICAgICB3aWRnZXREZWZhdWx0c1trZXldID0gZGF0YXNldFtrZXlzW2pdXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgd2lkZ2V0c1N0YXRlcyA9IFtdO1xuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbWFpbkVsZW1lbnRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICB2YXIgbmV3U2V0dGluZ3MgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHdpZGdldERlZmF1bHRzKSk7XG4gICAgICAgICAgbmV3U2V0dGluZ3MubWFpbkVsZW1lbnQgPSBtYWluRWxlbWVudHNbaV07XG4gICAgICAgICAgd2lkZ2V0c1N0YXRlcy5wdXNoKG5ld1NldHRpbmdzKTtcbiAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMuaW5pdChpKTtcbiAgICAgICAgfVxuICAgICAgfSwgNTApO1xuICAgIH1cbiAgfVxuICBcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBpbml0V2lkZ2V0cywgZmFsc2UpO1xuICB3aW5kb3cuYmluZFdpZGdldCA9IGZ1bmN0aW9uKCl7XG4gICAgd2luZG93LmNwQ3VycmVuY3lXaWRnZXRzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICBpbml0V2lkZ2V0cygpO1xuICB9O1xufSkoKTsiXX0=
