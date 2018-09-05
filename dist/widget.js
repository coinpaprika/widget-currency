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
    cdn_src: 'https://cdn.jsdelivr.net/npm/@coinpaprika/widget-currency',
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
    message: 'Data is loading...',
    origin_src: null,
    translations: {},
    mainElement: null,
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
      var data = widgetsStates[index];
      if (!data.origin_src){
        widgetDefaults.origin_src = data.cdn_src;
      }
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
      widgetFunctions.updateData(index, 'message', 'Data is currently unavailable');
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
      widgetFunctions.getData(index);
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
        '<span class="cp-widget__rank-label">'+widgetFunctions.getTranslation(index, "rank")+' <span class="rankTicker">'+ (data.ticker.rank || data.emptyData) +'</span></span>';
    },
    widgetMainElementMessage: function(index){
      var message = widgetsStates[index].message;
      return '<div class="cp-widget__main-no-data">'+ (message) +'</div>';
    },
    widgetAthElement: function(index){
      return '<div>' +
        '<small>'+widgetFunctions.getTranslation(index, "ath")+'</small>' +
        '<div>' +
        '<span class="price_athTicker parseNumber">'+ widgetsStates[0].emptyData + ' </span>' +
        '<span class="symbolTicker showDetailsCurrency"></span>' +
        '</div>' +
        '<span class="percent_from_price_athTicker cp-widget__rank">'+ widgetsStates[0].emptyData + '</span>' +
        '</div>'
    },
    widgetVolume24hElement: function(index){
      return '<div>' +
        '<small>'+widgetFunctions.getTranslation(index, "volume_24h")+'</small>' +
        '<div>' +
        '<span class="volume_24hTicker parseNumber">'+ widgetsStates[0].emptyData + ' </span>' +
        '<span class="symbolTicker showDetailsCurrency"></span>' +
        '</div>' +
        '<span class="volume_24h_change_24hTicker cp-widget__rank">'+ widgetsStates[0].emptyData + '</span>' +
        '</div>';
    },
    widgetMarketCapElement: function(index){
      return '<div>' +
        '<small>'+widgetFunctions.getTranslation(index, "market_cap")+'</small>' +
        '<div>' +
        '<span class="market_capTicker parseNumber">'+ widgetsStates[0].emptyData + ' </span>' +
        '<span class="symbolTicker showDetailsCurrency"></span>' +
        '</div>' +
        '<span class="market_cap_change_24hTicker cp-widget__rank">'+ widgetsStates[0].emptyData + '</span>' +
        '</div>';
    },
    widgetFooter: function(index){
      var currency = widgetsStates[index].currency;
      return '<p class="cp-widget__footer">' +
        '<span>'+widgetFunctions.getTranslation(index, "powered_by") + ' </span>' +
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
      return widgetDefaults.translations[widgetsStates[index].language][label];
    },
    getTranslations: function(lang){
      if (!widgetDefaults.translations[lang]){
        var xhr = new XMLHttpRequest();
        var url = widgetDefaults.lang_src  || widgetDefaults.origin_src + '/dist/lang';
        xhr.open('GET', url + '/' + lang + '.json');
        xhr.onload = function() {
          if (xhr.status === 200) {
            widgetDefaults.translations[lang] = JSON.parse(xhr.responseText);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiKGZ1bmN0aW9uKCl7XG4gIHZhciB3aWRnZXRzU3RhdGVzID0gW107XG4gIHZhciB3aWRnZXREZWZhdWx0cyA9IHtcbiAgICBjdXJyZW5jeTogJ2J0Yy1iaXRjb2luJyxcbiAgICBwcmltYXJ5X2N1cnJlbmN5OiAnVVNEJyxcbiAgICB2ZXJzaW9uOiAnZXh0ZW5kZWQnLFxuICAgIHVwZGF0ZV9hY3RpdmU6IGZhbHNlLFxuICAgIHVwZGF0ZV90aW1lb3V0OiAnMzBzJyxcbiAgICBsYW5ndWFnZTogJ2VuJyxcbiAgICBzdHlsZV9zcmM6IG51bGwsXG4gICAgaW1nX3NyYzogbnVsbCxcbiAgICBsYW5nX3NyYzogbnVsbCxcbiAgICBjZG5fc3JjOiAnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9AY29pbnBhcHJpa2Evd2lkZ2V0LWN1cnJlbmN5JyxcbiAgICBzaG93X2RldGFpbHNfY3VycmVuY3k6IGZhbHNlLFxuICAgIGVtcHR5RGF0YTogJy0nLFxuICAgIGVtcHR5VmFsdWU6IDAsXG4gICAgdGlja2VyOiB7XG4gICAgICBuYW1lOiB1bmRlZmluZWQsXG4gICAgICBzeW1ib2w6IHVuZGVmaW5lZCxcbiAgICAgIHByaWNlOiB1bmRlZmluZWQsXG4gICAgICBwcmljZV9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgICByYW5rOiB1bmRlZmluZWQsXG4gICAgICBwcmljZV9hdGg6IHVuZGVmaW5lZCxcbiAgICAgIHZvbHVtZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgIG1hcmtldF9jYXA6IHVuZGVmaW5lZCxcbiAgICAgIHBlcmNlbnRfZnJvbV9wcmljZV9hdGg6IHVuZGVmaW5lZCxcbiAgICAgIHZvbHVtZV8yNGhfY2hhbmdlXzI0aDogdW5kZWZpbmVkLFxuICAgICAgbWFya2V0X2NhcF9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgfSxcbiAgICBpbnRlcnZhbDogbnVsbCxcbiAgICBpc0RhdGE6IGZhbHNlLFxuICAgIG1lc3NhZ2U6ICdEYXRhIGlzIGxvYWRpbmcuLi4nLFxuICAgIG9yaWdpbl9zcmM6IG51bGwsXG4gICAgdHJhbnNsYXRpb25zOiB7fSxcbiAgICBtYWluRWxlbWVudDogbnVsbCxcbiAgfTtcbiAgdmFyIHdpZGdldEZ1bmN0aW9ucyA9IHtcbiAgICBpbml0OiBmdW5jdGlvbihpbmRleCl7XG4gICAgICBpZiAoIXdpZGdldEZ1bmN0aW9ucy5nZXRNYWluRWxlbWVudChpbmRleCkpIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ0JpbmQgZmFpbGVkLCBubyBlbGVtZW50IHdpdGggY2xhc3MgPSBcImNvaW5wYXByaWthLWN1cnJlbmN5LXdpZGdldFwiJyk7XG4gICAgICB9XG4gICAgICB3aWRnZXRGdW5jdGlvbnMuZ2V0RGVmYXVsdHMoaW5kZXgpO1xuICAgICAgd2lkZ2V0RnVuY3Rpb25zLnNldE9yaWdpbkxpbmsoaW5kZXgpO1xuICAgIH0sXG4gICAgc2V0T3JpZ2luTGluazogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIGRhdGEgPSB3aWRnZXRzU3RhdGVzW2luZGV4XTtcbiAgICAgIGlmICghZGF0YS5vcmlnaW5fc3JjKXtcbiAgICAgICAgd2lkZ2V0RGVmYXVsdHMub3JpZ2luX3NyYyA9IGRhdGEuY2RuX3NyYztcbiAgICAgIH1cbiAgICAgIGlmIChPYmplY3Qua2V5cyh3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnMpLmxlbmd0aCA9PT0gMCkgd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9ucyh3aWRnZXREZWZhdWx0cy5sYW5ndWFnZSk7XG4gICAgICB3aWRnZXRGdW5jdGlvbnMuc3R5bGVzaGVldCgpO1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICB3aWRnZXRGdW5jdGlvbnMuYWRkV2lkZ2V0RWxlbWVudChpbmRleCk7XG4gICAgICAgIHdpZGdldEZ1bmN0aW9ucy5pbml0SW50ZXJ2YWwoaW5kZXgpO1xuICAgICAgfSwgMTAwKTtcbiAgICB9LFxuICAgIGdldE1haW5FbGVtZW50OiBmdW5jdGlvbihpbmRleCl7XG4gICAgICByZXR1cm4gd2lkZ2V0c1N0YXRlc1tpbmRleF0ubWFpbkVsZW1lbnQ7XG4gICAgfSxcbiAgICBnZXREYXRhOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB4aHIub3BlbignR0VUJywgJ2h0dHBzOi8vYXBpLmNvaW5wYXByaWthLmNvbS92MS93aWRnZXQvJyt3aWRnZXRzU3RhdGVzW2luZGV4XS5jdXJyZW5jeSsnP3F1b3RlPScrd2lkZ2V0c1N0YXRlc1tpbmRleF0ucHJpbWFyeV9jdXJyZW5jeSk7XG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICBpZiAoIXdpZGdldHNTdGF0ZXNbaW5kZXhdLmlzRGF0YSkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdpc0RhdGEnLCB0cnVlKTtcbiAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMudXBkYXRlVGlja2VyKGluZGV4LCBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMub25FcnJvclJlcXVlc3QoaW5kZXgsIHhocik7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHdpZGdldEZ1bmN0aW9ucy5vbkVycm9yUmVxdWVzdChpbmRleCwgeGhyKTtcbiAgICAgIH07XG4gICAgICB4aHIuc2VuZCgpO1xuICAgIH0sXG4gICAgb25FcnJvclJlcXVlc3Q6IGZ1bmN0aW9uKGluZGV4LCB4aHIpe1xuICAgICAgaWYgKHdpZGdldHNTdGF0ZXNbaW5kZXhdLmlzRGF0YSkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdpc0RhdGEnLCBmYWxzZSk7XG4gICAgICB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ21lc3NhZ2UnLCAnRGF0YSBpcyBjdXJyZW50bHkgdW5hdmFpbGFibGUnKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1JlcXVlc3QgZmFpbGVkLiAgUmV0dXJuZWQgc3RhdHVzIG9mICcgKyB4aHIsIHdpZGdldHNTdGF0ZXNbaW5kZXhdKTtcbiAgICB9LFxuICAgIGluaXRJbnRlcnZhbDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgY2xlYXJJbnRlcnZhbCh3aWRnZXRzU3RhdGVzW2luZGV4XS5pbnRlcnZhbCk7XG4gICAgICBpZiAod2lkZ2V0c1N0YXRlc1tpbmRleF0udXBkYXRlX2FjdGl2ZSAmJiB3aWRnZXRzU3RhdGVzW2luZGV4XS51cGRhdGVfdGltZW91dCA+IDEwMDApe1xuICAgICAgICB3aWRnZXRzU3RhdGVzW2luZGV4XS5pbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmdldERhdGEoaW5kZXgpO1xuICAgICAgICB9LCB3aWRnZXRzU3RhdGVzW2luZGV4XS51cGRhdGVfdGltZW91dCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGRXaWRnZXRFbGVtZW50OiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgbWFpbkVsZW1lbnQgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgdmFyIGRldGFpbHMgPSAod2lkZ2V0c1N0YXRlc1tpbmRleF0udmVyc2lvbiA9PT0gJ2V4dGVuZGVkJykgPyAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9fZGV0YWlsc1wiPicgKyB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0QXRoRWxlbWVudChpbmRleCkgKyB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0Vm9sdW1lMjRoRWxlbWVudChpbmRleCkgKyB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0TWFya2V0Q2FwRWxlbWVudChpbmRleCkgKyAnPC9kaXY+JyA6ICcnO1xuICAgICAgdmFyIHdpZGdldEVsZW1lbnQgPSB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0TWFpbkVsZW1lbnQoaW5kZXgpICsgZGV0YWlscyArIHdpZGdldEZ1bmN0aW9ucy53aWRnZXRGb290ZXIoaW5kZXgpO1xuICAgICAgbWFpbkVsZW1lbnQuaW5uZXJIVE1MID0gd2lkZ2V0RWxlbWVudDtcbiAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXREYXRhKGluZGV4KTtcbiAgICB9LFxuICAgIGdldERlZmF1bHRzOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgbWFpbkVsZW1lbnQgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQpe1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC52ZXJzaW9uKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3ZlcnNpb24nLCBtYWluRWxlbWVudC5kYXRhc2V0LnZlcnNpb24pO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5wcmltYXJ5Q3VycmVuY3kpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAncHJpbWFyeV9jdXJyZW5jeScsIG1haW5FbGVtZW50LmRhdGFzZXQucHJpbWFyeUN1cnJlbmN5KTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuY3VycmVuY3kpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnY3VycmVuY3knLCBtYWluRWxlbWVudC5kYXRhc2V0LmN1cnJlbmN5KTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuc2hvd0RldGFpbHNDdXJyZW5jeSkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdzaG93X2RldGFpbHNfY3VycmVuY3knLCAobWFpbkVsZW1lbnQuZGF0YXNldC5zaG93RGV0YWlsc0N1cnJlbmN5ID09PSAndHJ1ZScpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlQWN0aXZlKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3VwZGF0ZV9hY3RpdmUnLCAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVBY3RpdmUgPT09ICd0cnVlJykpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVUaW1lb3V0KSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3VwZGF0ZV90aW1lb3V0Jywgd2lkZ2V0RnVuY3Rpb25zLnBhcnNlSW50ZXJ2YWxWYWx1ZShtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZVRpbWVvdXQpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ3VhZ2UpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnbGFuZ3VhZ2UnLCBtYWluRWxlbWVudC5kYXRhc2V0Lmxhbmd1YWdlKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQub3JpZ2luU3JjKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ29yaWdpbl9zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0Lm9yaWdpblNyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lm5vZGVNb2R1bGVzU3JjKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ25vZGVfbW9kdWxlc19zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0Lm5vZGVNb2R1bGVzU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuYm93ZXJTcmMpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnYm93ZXJfc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5ib3dlclNyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnN0eWxlU3JjKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3N0eWxlX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQuc3R5bGVTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5sYW5nU3JjKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ2xvZ29fc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5sYW5nU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuaW1nU3JjKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ2xvZ29fc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5pbWdTcmMpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlV2lkZ2V0RWxlbWVudDogZnVuY3Rpb24oaW5kZXgsIGtleSwgdmFsdWUsIHRpY2tlcil7XG4gICAgICB2YXIgc3RhdGUgPSB3aWRnZXRzU3RhdGVzW2luZGV4XTtcbiAgICAgIHZhciBtYWluRWxlbWVudCA9IHdpZGdldEZ1bmN0aW9ucy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgICBpZiAobWFpbkVsZW1lbnQpe1xuICAgICAgICB2YXIgdGlja2VyQ2xhc3MgPSAodGlja2VyKSA/ICdUaWNrZXInIDogJyc7XG4gICAgICAgIGlmIChrZXkgPT09ICduYW1lJyB8fCBrZXkgPT09ICdjdXJyZW5jeScpe1xuICAgICAgICAgIGlmIChrZXkgPT09ICdjdXJyZW5jeScpe1xuICAgICAgICAgICAgdmFyIGFFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXRfX2Zvb3RlciA+IGEnKTtcbiAgICAgICAgICAgIGZvcih2YXIgayA9IDA7IGsgPCBhRWxlbWVudHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgYUVsZW1lbnRzW2tdLmhyZWYgPSB3aWRnZXRGdW5jdGlvbnMuY29pbl9saW5rKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmdldEltYWdlKGluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoa2V5ID09PSAnaXNEYXRhJyB8fCBrZXkgPT09ICdtZXNzYWdlJyl7XG4gICAgICAgICAgdmFyIGhlYWRlckVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNwLXdpZGdldF9fbWFpbicpO1xuICAgICAgICAgIGZvcih2YXIgayA9IDA7IGsgPCBoZWFkZXJFbGVtZW50cy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgaGVhZGVyRWxlbWVudHNba10uaW5uZXJIVE1MID0gKCFzdGF0ZS5pc0RhdGEpID8gd2lkZ2V0RnVuY3Rpb25zLndpZGdldE1haW5FbGVtZW50TWVzc2FnZShpbmRleCkgOiB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0TWFpbkVsZW1lbnREYXRhKGluZGV4KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHVwZGF0ZUVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicra2V5K3RpY2tlckNsYXNzKTtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHVwZGF0ZUVsZW1lbnRzLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICAgIHZhciB1cGRhdGVFbGVtZW50ID0gdXBkYXRlRWxlbWVudHNbal07XG4gICAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NwLXdpZGdldF9fcmFuaycpKXtcbiAgICAgICAgICAgICAgdmFyIGNsYXNzTmFtZSA9IChwYXJzZUZsb2F0KHZhbHVlKSA+IDApID8gXCJjcC13aWRnZXRfX3JhbmstdXBcIiA6ICgocGFyc2VGbG9hdCh2YWx1ZSkgPCAwKSA/IFwiY3Atd2lkZ2V0X19yYW5rLWRvd25cIiA6IFwiY3Atd2lkZ2V0X19yYW5rLW5ldXRyYWxcIik7XG4gICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLWRvd24nKTtcbiAgICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX3JhbmstdXAnKTtcbiAgICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX3JhbmstbmV1dHJhbCcpO1xuICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBzdGF0ZS5lbXB0eURhdGE7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAoa2V5ID09PSAncHJpY2VfY2hhbmdlXzI0aCcpID8gJygnK3dpZGdldEZ1bmN0aW9ucy5yb3VuZEFtb3VudCh2YWx1ZSwgMikrJyUpJzogd2lkZ2V0RnVuY3Rpb25zLnJvdW5kQW1vdW50KHZhbHVlLCAyKSsnJSc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvd0RldGFpbHNDdXJyZW5jeScpICYmICFzdGF0ZS5zaG93X2RldGFpbHNfY3VycmVuY3kpIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSAnICc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BhcnNlTnVtYmVyJykpe1xuICAgICAgICAgICAgICB1cGRhdGVFbGVtZW50LmlubmVyVGV4dCA9IHdpZGdldEZ1bmN0aW9ucy5wYXJzZU51bWJlcih2YWx1ZSkgfHwgc3RhdGUuZW1wdHlEYXRhO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5pbm5lclRleHQgPSB2YWx1ZSB8fCBzdGF0ZS5lbXB0eURhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVEYXRhOiBmdW5jdGlvbihpbmRleCwga2V5LCB2YWx1ZSwgdGlja2VyKXtcbiAgICAgIGlmICh0aWNrZXIpe1xuICAgICAgICB3aWRnZXRzU3RhdGVzW2luZGV4XS50aWNrZXJba2V5XSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2lkZ2V0c1N0YXRlc1tpbmRleF1ba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKGtleSA9PT0gJ2xhbmd1YWdlJyl7XG4gICAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbnModmFsdWUpO1xuICAgICAgfVxuICAgICAgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZVdpZGdldEVsZW1lbnQoaW5kZXgsIGtleSwgdmFsdWUsIHRpY2tlcik7XG4gICAgfSxcbiAgICB1cGRhdGVUaWNrZXI6IGZ1bmN0aW9uKGluZGV4LCBkYXRhKXtcbiAgICAgIHZhciBkYXRhS2V5cyA9IE9iamVjdC5rZXlzKGRhdGEpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhS2V5cy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCBkYXRhS2V5c1tpXSwgZGF0YVtkYXRhS2V5c1tpXV0sIHRydWUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcGFyc2VJbnRlcnZhbFZhbHVlOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICB2YXIgdGltZVN5bWJvbCA9ICcnLCBtdWx0aXBsaWVyID0gMTtcbiAgICAgIGlmICh2YWx1ZS5zZWFyY2goJ3MnKSA+IC0xKXtcbiAgICAgICAgdGltZVN5bWJvbCA9ICdzJztcbiAgICAgICAgbXVsdGlwbGllciA9IDEwMDA7XG4gICAgICB9XG4gICAgICBpZiAodmFsdWUuc2VhcmNoKCdtJykgPiAtMSl7XG4gICAgICAgIHRpbWVTeW1ib2wgPSAnbSc7XG4gICAgICAgIG11bHRpcGxpZXIgPSA2MCAqIDEwMDA7XG4gICAgICB9XG4gICAgICBpZiAodmFsdWUuc2VhcmNoKCdoJykgPiAtMSl7XG4gICAgICAgIHRpbWVTeW1ib2wgPSAnaCc7XG4gICAgICAgIG11bHRpcGxpZXIgPSA2MCAqIDYwICogMTAwMDtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZS5zZWFyY2goJ2QnKSA+IC0xKXtcbiAgICAgICAgdGltZVN5bWJvbCA9ICdkJztcbiAgICAgICAgbXVsdGlwbGllciA9IDI0ICogNjAgKiA2MCAqIDEwMDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZS5yZXBsYWNlKHRpbWVTeW1ib2wsJycpKSAqIG11bHRpcGxpZXI7XG4gICAgfSxcbiAgICBwYXJzZU51bWJlcjogZnVuY3Rpb24obnVtYmVyKXtcbiAgICAgIGlmICghbnVtYmVyICYmIG51bWJlciAhPT0gMCkgcmV0dXJuIG51bWJlcjtcbiAgICAgIGlmIChudW1iZXIgPT09IHdpZGdldHNTdGF0ZXNbMF0uZW1wdHlWYWx1ZSB8fCBudW1iZXIgPT09IHdpZGdldHNTdGF0ZXNbMF0uZW1wdHlEYXRhKSByZXR1cm4gbnVtYmVyO1xuICAgICAgbnVtYmVyID0gcGFyc2VGbG9hdChudW1iZXIpO1xuICAgICAgdmFyIG51bWJlclN0ciA9IG51bWJlci50b1N0cmluZygpO1xuICAgICAgaWYgKG51bWJlciA+IDEwMDAwMCl7XG4gICAgICAgIHZhciBwYXJhbWV0ZXIgPSAnSycsXG4gICAgICAgICAgc3BsaWNlZCA9IG51bWJlclN0ci5zbGljZSgwLCBudW1iZXJTdHIubGVuZ3RoIC0gMSk7XG4gICAgICAgIGlmIChudW1iZXIgPiAxMDAwMDAwMDAwKXtcbiAgICAgICAgICBzcGxpY2VkID0gbnVtYmVyU3RyLnNsaWNlKDAsIG51bWJlclN0ci5sZW5ndGggLSA3KTtcbiAgICAgICAgICBwYXJhbWV0ZXIgPSAnQic7XG4gICAgICAgIH0gZWxzZSBpZiAobnVtYmVyID4gMTAwMDAwMCl7XG4gICAgICAgICAgc3BsaWNlZCA9IG51bWJlclN0ci5zbGljZSgwLCBudW1iZXJTdHIubGVuZ3RoIC0gNCk7XG4gICAgICAgICAgcGFyYW1ldGVyID0gJ00nO1xuICAgICAgICB9XG4gICAgICAgIHZhciBuYXR1cmFsID0gc3BsaWNlZC5zbGljZSgwLCBzcGxpY2VkLmxlbmd0aCAtIDIpO1xuICAgICAgICB2YXIgZGVjaW1hbCA9IHNwbGljZWQuc2xpY2Uoc3BsaWNlZC5sZW5ndGggLSAyKTtcbiAgICAgICAgcmV0dXJuIG5hdHVyYWwgKyAnLicgKyBkZWNpbWFsICsgJyAnICsgcGFyYW1ldGVyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGlzRGVjaW1hbCA9IChudW1iZXIgJSAxKSA+IDA7XG4gICAgICAgIGlmIChpc0RlY2ltYWwpe1xuICAgICAgICAgIHZhciBwcmVjaXNpb24gPSAyO1xuICAgICAgICAgIGlmIChudW1iZXIgPCAxKXtcbiAgICAgICAgICAgIHByZWNpc2lvbiA9IDg7XG4gICAgICAgICAgfSBlbHNlIGlmIChudW1iZXIgPCAxMCl7XG4gICAgICAgICAgICBwcmVjaXNpb24gPSA2O1xuICAgICAgICAgIH0gZWxzZSBpZiAobnVtYmVyIDwgMTAwMCl7XG4gICAgICAgICAgICBwcmVjaXNpb24gPSA0O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gd2lkZ2V0RnVuY3Rpb25zLnJvdW5kQW1vdW50KG51bWJlciwgcHJlY2lzaW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbnVtYmVyLnRvRml4ZWQoMik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHJvdW5kQW1vdW50OiBmdW5jdGlvbihhbW91bnQsIGRlY2ltYWwsIGRpcmVjdGlvbil7XG4gICAgICBhbW91bnQgPSBwYXJzZUZsb2F0KGFtb3VudCk7XG4gICAgICBpZiAoIWRlY2ltYWwpIGRlY2ltYWwgPSA4O1xuICAgICAgaWYgKCFkaXJlY3Rpb24pIGRpcmVjdGlvbiA9ICdyb3VuZCc7XG4gICAgICBkZWNpbWFsID0gTWF0aC5wb3coMTAsIGRlY2ltYWwpO1xuICAgICAgcmV0dXJuIE1hdGhbZGlyZWN0aW9uXShhbW91bnQgKiBkZWNpbWFsKSAvIGRlY2ltYWw7XG4gICAgfSxcbiAgICBzdHlsZXNoZWV0OiBmdW5jdGlvbigpe1xuICAgICAgaWYgKHdpZGdldERlZmF1bHRzLnN0eWxlX3NyYyAhPT0gZmFsc2Upe1xuICAgICAgICB2YXIgdXJsID0gd2lkZ2V0RGVmYXVsdHMuc3R5bGVfc3JjIHx8IHdpZGdldERlZmF1bHRzLm9yaWdpbl9zcmMgKycvZGlzdC93aWRnZXQubWluLmNzcyc7XG4gICAgICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZSgncmVsJywgJ3N0eWxlc2hlZXQnKTtcbiAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB1cmwpO1xuICAgICAgICByZXR1cm4gKGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignbGlua1tocmVmPVwiJyt1cmwrJ1wiXScpKSA/ICcnIDogZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHdpZGdldE1haW5FbGVtZW50OiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgZGF0YSA9IHdpZGdldHNTdGF0ZXNbaW5kZXhdO1xuICAgICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19oZWFkZXJcIj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCInKydjcC13aWRnZXRfX2ltZyBjcC13aWRnZXRfX2ltZy0nK2RhdGEuY3VycmVuY3krJ1wiPicgK1xuICAgICAgICAnPGltZy8+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX21haW5cIj4nICtcbiAgICAgICAgKChkYXRhLmlzRGF0YSkgPyB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0TWFpbkVsZW1lbnREYXRhKGluZGV4KSA6IHdpZGdldEZ1bmN0aW9ucy53aWRnZXRNYWluRWxlbWVudE1lc3NhZ2UoaW5kZXgpKSArXG4gICAgICAgICc8L2Rpdj4nK1xuICAgICAgICAnPC9kaXY+JztcbiAgICB9LFxuICAgIHdpZGdldE1haW5FbGVtZW50RGF0YTogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIGRhdGEgPSB3aWRnZXRzU3RhdGVzW2luZGV4XTtcbiAgICAgIHJldHVybiAnPGgzPjxhIGhyZWY9XCInKyB3aWRnZXRGdW5jdGlvbnMuY29pbl9saW5rKGRhdGEuY3VycmVuY3kpICsnXCI+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cIm5hbWVUaWNrZXJcIj4nKyAoZGF0YS50aWNrZXIubmFtZSB8fCBkYXRhLmVtcHR5RGF0YSkgKyc8L3NwYW4+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlclwiPicrIChkYXRhLnRpY2tlci5zeW1ib2wgfHwgZGF0YS5lbXB0eURhdGEpICsnPC9zcGFuPicgK1xuICAgICAgICAnPC9hPjwvaDM+JyArXG4gICAgICAgICc8c3Ryb25nPicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJwcmljZVRpY2tlciBwYXJzZU51bWJlclwiPicrICh3aWRnZXRGdW5jdGlvbnMucGFyc2VOdW1iZXIoZGF0YS50aWNrZXIucHJpY2UpIHx8IGRhdGEuZW1wdHlEYXRhKSArICc8L3NwYW4+ICcgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJwcmltYXJ5Q3VycmVuY3lcIj4nKyBkYXRhLnByaW1hcnlfY3VycmVuY3kgKyAnIDwvc3Bhbj4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwicHJpY2VfY2hhbmdlXzI0aFRpY2tlciBjcC13aWRnZXRfX3JhbmsgY3Atd2lkZ2V0X19yYW5rLScrICgoZGF0YS50aWNrZXIucHJpY2VfY2hhbmdlXzI0aCA+IDApID8gXCJ1cFwiIDogKChkYXRhLnRpY2tlci5wcmljZV9jaGFuZ2VfMjRoIDwgMCkgPyBcImRvd25cIiA6IFwibmV1dHJhbFwiKSkgKydcIj4oJysgKHdpZGdldEZ1bmN0aW9ucy5yb3VuZEFtb3VudChkYXRhLnRpY2tlci5wcmljZV9jaGFuZ2VfMjRoLCAyKSB8fCBkYXRhLmVtcHR5VmFsdWUpICsnJSk8L3NwYW4+JyArXG4gICAgICAgICc8L3N0cm9uZz4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0X19yYW5rLWxhYmVsXCI+Jyt3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwicmFua1wiKSsnIDxzcGFuIGNsYXNzPVwicmFua1RpY2tlclwiPicrIChkYXRhLnRpY2tlci5yYW5rIHx8IGRhdGEuZW1wdHlEYXRhKSArJzwvc3Bhbj48L3NwYW4+JztcbiAgICB9LFxuICAgIHdpZGdldE1haW5FbGVtZW50TWVzc2FnZTogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIG1lc3NhZ2UgPSB3aWRnZXRzU3RhdGVzW2luZGV4XS5tZXNzYWdlO1xuICAgICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19tYWluLW5vLWRhdGFcIj4nKyAobWVzc2FnZSkgKyc8L2Rpdj4nO1xuICAgIH0sXG4gICAgd2lkZ2V0QXRoRWxlbWVudDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgcmV0dXJuICc8ZGl2PicgK1xuICAgICAgICAnPHNtYWxsPicrd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcImF0aFwiKSsnPC9zbWFsbD4nICtcbiAgICAgICAgJzxkaXY+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInByaWNlX2F0aFRpY2tlciBwYXJzZU51bWJlclwiPicrIHdpZGdldHNTdGF0ZXNbMF0uZW1wdHlEYXRhICsgJyA8L3NwYW4+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlciBzaG93RGV0YWlsc0N1cnJlbmN5XCI+PC9zcGFuPicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInBlcmNlbnRfZnJvbV9wcmljZV9hdGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rXCI+Jysgd2lkZ2V0c1N0YXRlc1swXS5lbXB0eURhdGEgKyAnPC9zcGFuPicgK1xuICAgICAgICAnPC9kaXY+J1xuICAgIH0sXG4gICAgd2lkZ2V0Vm9sdW1lMjRoRWxlbWVudDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgcmV0dXJuICc8ZGl2PicgK1xuICAgICAgICAnPHNtYWxsPicrd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInZvbHVtZV8yNGhcIikrJzwvc21hbGw+JyArXG4gICAgICAgICc8ZGl2PicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJ2b2x1bWVfMjRoVGlja2VyIHBhcnNlTnVtYmVyXCI+Jysgd2lkZ2V0c1N0YXRlc1swXS5lbXB0eURhdGEgKyAnIDwvc3Bhbj4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwic3ltYm9sVGlja2VyIHNob3dEZXRhaWxzQ3VycmVuY3lcIj48L3NwYW4+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwidm9sdW1lXzI0aF9jaGFuZ2VfMjRoVGlja2VyIGNwLXdpZGdldF9fcmFua1wiPicrIHdpZGdldHNTdGF0ZXNbMF0uZW1wdHlEYXRhICsgJzwvc3Bhbj4nICtcbiAgICAgICAgJzwvZGl2Pic7XG4gICAgfSxcbiAgICB3aWRnZXRNYXJrZXRDYXBFbGVtZW50OiBmdW5jdGlvbihpbmRleCl7XG4gICAgICByZXR1cm4gJzxkaXY+JyArXG4gICAgICAgICc8c21hbGw+Jyt3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwibWFya2V0X2NhcFwiKSsnPC9zbWFsbD4nICtcbiAgICAgICAgJzxkaXY+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cIm1hcmtldF9jYXBUaWNrZXIgcGFyc2VOdW1iZXJcIj4nKyB3aWRnZXRzU3RhdGVzWzBdLmVtcHR5RGF0YSArICcgPC9zcGFuPicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJzeW1ib2xUaWNrZXIgc2hvd0RldGFpbHNDdXJyZW5jeVwiPjwvc3Bhbj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJtYXJrZXRfY2FwX2NoYW5nZV8yNGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rXCI+Jysgd2lkZ2V0c1N0YXRlc1swXS5lbXB0eURhdGEgKyAnPC9zcGFuPicgK1xuICAgICAgICAnPC9kaXY+JztcbiAgICB9LFxuICAgIHdpZGdldEZvb3RlcjogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIGN1cnJlbmN5ID0gd2lkZ2V0c1N0YXRlc1tpbmRleF0uY3VycmVuY3k7XG4gICAgICByZXR1cm4gJzxwIGNsYXNzPVwiY3Atd2lkZ2V0X19mb290ZXJcIj4nICtcbiAgICAgICAgJzxzcGFuPicrd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInBvd2VyZWRfYnlcIikgKyAnIDwvc3Bhbj4nICtcbiAgICAgICAgJzxpbWcgc3R5bGU9XCJ3aWR0aDogMTZweFwiIHNyYz1cIicrIHdpZGdldEZ1bmN0aW9ucy5tYWluX2xvZ29fbGluaygpICsnXCIgYWx0PVwiXCIvPicgK1xuICAgICAgICAnPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIicrIHdpZGdldEZ1bmN0aW9ucy5jb2luX2xpbmsoY3VycmVuY3kpICsnXCI+Y29pbnBhcHJpa2EuY29tPC9hPicgK1xuICAgICAgICAnPC9wPidcbiAgICB9LFxuICAgIGdldEltYWdlOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgZGF0YSA9IHdpZGdldHNTdGF0ZXNbaW5kZXhdO1xuICAgICAgdmFyIGltZ0NvbnRhaW5lcnMgPSBkYXRhLm1haW5FbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NwLXdpZGdldF9faW1nJyk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGltZ0NvbnRhaW5lcnMubGVuZ3RoOyBpKyspe1xuICAgICAgICB2YXIgaW1nQ29udGFpbmVyID0gaW1nQ29udGFpbmVyc1tpXTtcbiAgICAgICAgaW1nQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NwLXdpZGdldF9faW1nLS1oaWRkZW4nKTtcbiAgICAgICAgdmFyIGltZyA9IGltZ0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdpbWcnKTtcbiAgICAgICAgdmFyIG5ld0ltZyA9IG5ldyBJbWFnZTtcbiAgICAgICAgbmV3SW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGltZy5zcmMgPSB0aGlzLnNyYztcbiAgICAgICAgICBpbWdDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19pbWctLWhpZGRlbicpO1xuICAgICAgICB9O1xuICAgICAgICBuZXdJbWcuc3JjID0gd2lkZ2V0RnVuY3Rpb25zLmltZ19zcmMoZGF0YS5jdXJyZW5jeSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBpbWdfc3JjOiBmdW5jdGlvbihpZCl7XG4gICAgICByZXR1cm4gJ2h0dHBzOi8vY29pbnBhcHJpa2EuY29tL2NvaW4vJytpZCsnL2xvZ28ucG5nJztcbiAgICB9LFxuICAgIGNvaW5fbGluazogZnVuY3Rpb24oaWQpe1xuICAgICAgcmV0dXJuICdodHRwczovL2NvaW5wYXByaWthLmNvbS9jb2luLycrIGlkXG4gICAgfSxcbiAgICBtYWluX2xvZ29fbGluazogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB3aWRnZXREZWZhdWx0cy5pbWdfc3JjIHx8IHdpZGdldERlZmF1bHRzLm9yaWdpbl9zcmMgKycvZGlzdC9pbWcvbG9nb193aWRnZXQuc3ZnJ1xuICAgIH0sXG4gICAgZ2V0U2NyaXB0RWxlbWVudDogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzY3JpcHRbZGF0YS1jcC1jdXJyZW5jeS13aWRnZXRdJyk7XG4gICAgfSxcbiAgICBnZXRUcmFuc2xhdGlvbjogZnVuY3Rpb24oaW5kZXgsIGxhYmVsKXtcbiAgICAgIHJldHVybiB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbd2lkZ2V0c1N0YXRlc1tpbmRleF0ubGFuZ3VhZ2VdW2xhYmVsXTtcbiAgICB9LFxuICAgIGdldFRyYW5zbGF0aW9uczogZnVuY3Rpb24obGFuZyl7XG4gICAgICBpZiAoIXdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXSl7XG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdmFyIHVybCA9IHdpZGdldERlZmF1bHRzLmxhbmdfc3JjICB8fCB3aWRnZXREZWZhdWx0cy5vcmlnaW5fc3JjICsgJy9kaXN0L2xhbmcnO1xuICAgICAgICB4aHIub3BlbignR0VUJywgdXJsICsgJy8nICsgbGFuZyArICcuanNvbicpO1xuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgd2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMub25FcnJvclJlcXVlc3QoMCwgeGhyKTtcbiAgICAgICAgICAgIGRlbGV0ZSB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ107XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLm9uRXJyb3JSZXF1ZXN0KDAsIHhocik7XG4gICAgICAgICAgZGVsZXRlIHdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXTtcbiAgICAgICAgfTtcbiAgICAgICAgeGhyLnNlbmQoKTtcbiAgICAgICAgd2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddID0ge307XG4gICAgICB9XG4gICAgfSxcbiAgfTtcbiAgXG4gIGZ1bmN0aW9uIGluaXRXaWRnZXRzKCl7XG4gICAgaWYgKCF3aW5kb3cuY3BDdXJyZW5jeVdpZGdldHNJbml0aWFsaXplZCl7XG4gICAgICB3aW5kb3cuY3BDdXJyZW5jeVdpZGdldHNJbml0aWFsaXplZCA9IHRydWU7XG4gICAgICB2YXIgbWFpbkVsZW1lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY29pbnBhcHJpa2EtY3VycmVuY3ktd2lkZ2V0JykpO1xuICAgICAgdmFyIHNjcmlwdEVsZW1lbnQgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0U2NyaXB0RWxlbWVudCgpO1xuICAgICAgaWYgKHNjcmlwdEVsZW1lbnQgJiYgc2NyaXB0RWxlbWVudC5kYXRhc2V0ICYmIHNjcmlwdEVsZW1lbnQuZGF0YXNldC5jcEN1cnJlbmN5V2lkZ2V0KXtcbiAgICAgICAgdmFyIGRhdGFzZXQgPSBKU09OLnBhcnNlKHNjcmlwdEVsZW1lbnQuZGF0YXNldC5jcEN1cnJlbmN5V2lkZ2V0KTtcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGRhdGFzZXQpKXtcbiAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGRhdGFzZXQpO1xuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwga2V5cy5sZW5ndGg7IGorKyl7XG4gICAgICAgICAgICB2YXIga2V5ID0ga2V5c1tqXS5yZXBsYWNlKCctJywgJ18nKTtcbiAgICAgICAgICAgIHdpZGdldERlZmF1bHRzW2tleV0gPSBkYXRhc2V0W2tleXNbal1dO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICB3aWRnZXRzU3RhdGVzID0gW107XG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBtYWluRWxlbWVudHMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgIHZhciBuZXdTZXR0aW5ncyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkod2lkZ2V0RGVmYXVsdHMpKTtcbiAgICAgICAgICBuZXdTZXR0aW5ncy5tYWluRWxlbWVudCA9IG1haW5FbGVtZW50c1tpXTtcbiAgICAgICAgICB3aWRnZXRzU3RhdGVzLnB1c2gobmV3U2V0dGluZ3MpO1xuICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5pbml0KGkpO1xuICAgICAgICB9XG4gICAgICB9LCA1MCk7XG4gICAgfVxuICB9XG4gIFxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGluaXRXaWRnZXRzLCBmYWxzZSk7XG4gIHdpbmRvdy5iaW5kV2lkZ2V0ID0gZnVuY3Rpb24oKXtcbiAgICB3aW5kb3cuY3BDdXJyZW5jeVdpZGdldHNJbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIGluaXRXaWRnZXRzKCk7XG4gIH07XG59KSgpOyJdfQ==
