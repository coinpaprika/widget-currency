(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function(){
  var widgetsStates = [];
  var widgetDefaults = {
    version: 'extended',
    primaryCurrency: 'USD',
    currencyId: 'btc-bitcoin',
    mainElement: null,
    updateActive: false,
    updateTimeout: '30s',
    showDetailsCurrency: false,
    language: 'en',
    node_modules_src: null,
    bower_src: null,
    style_src: null,
    logo_src: null,
    cdn_src: 'https://cdn.jsdelivr.net/npm/@coinpaprika/widget-currency',
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
      console.log(data);
      if (data.node_modules_src){
        widgetDefaults.origin_src = data.node_modules_src;
      } else if (data.bower_src){
        widgetDefaults.origin_src = data.bower_src;
      } else {
        widgetDefaults.origin_src = data.cdn_src;
      }
      widgetFunctions.stylesheet();
      widgetFunctions.addWidgetElement(index);
      widgetFunctions.initInterval(index);
    },
    getMainElement: function(index){
      return widgetsStates[index].mainElement;
    },
    getData: function(index){
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://api.coinpaprika.com/v1/widget/'+widgetsStates[index].currencyId+'?quote='+widgetsStates[index].primaryCurrency);
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
      if (widgetsStates[index].updateActive && widgetsStates[index].updateTimeout > 1000){
        widgetsStates[index].interval = setInterval(function(){
          widgetFunctions.getData(index);
        }, widgetsStates[index].updateTimeout);
      }
    },
    addWidgetElement: function(index){
      var mainElement = widgetFunctions.getMainElement(index);
      var details = (widgetsStates[index].version === 'extended') ? '<div class="cp-widget__details">' + widgetFunctions.widgetAthElement() + widgetFunctions.widgetVolume24hElement() + widgetFunctions.widgetMarketCapElement() + '</div>' : '';
      var widgetElement = widgetFunctions.widgetMainElement(index) + details + widgetFunctions.widgetFooter(index);
      mainElement.innerHTML = widgetElement;
      widgetFunctions.getData(index);
    },
    getDefaults: function(index){
      var mainElement = widgetFunctions.getMainElement(index);
      if (mainElement.dataset){
        if (mainElement.dataset.version) widgetFunctions.updateData(index, 'version', mainElement.dataset.version);
        if (mainElement.dataset.primaryCurrency) widgetFunctions.updateData(index, 'primaryCurrency', mainElement.dataset.primaryCurrency);
        if (mainElement.dataset.currency) widgetFunctions.updateData(index, 'currencyId', mainElement.dataset.currency);
        if (mainElement.dataset.showDetailsCurrency) widgetFunctions.updateData(index, 'showDetailsCurrency', (mainElement.dataset.showDetailsCurrency === 'true'));
        if (mainElement.dataset.updateActive) widgetFunctions.updateData(index, 'updateActive', (mainElement.dataset.updateActive === 'true'));
        if (mainElement.dataset.updateTimeout) widgetFunctions.updateData(index, 'updateTimeout', widgetFunctions.parseIntervalValue(mainElement.dataset.updateTimeout));
        if (mainElement.dataset.language) widgetFunctions.updateData(index, 'language', mainElement.dataset.language);
        if (mainElement.dataset.nodeModulesSrc) widgetFunctions.updateData(index, 'node_modules_src', mainElement.dataset.nodeModulesSrc);
        if (mainElement.dataset.bowerSrc) widgetFunctions.updateData(index, 'bower_src', mainElement.dataset.bowerSrc);
        if (mainElement.dataset.styleSrc) widgetFunctions.updateData(index, 'style_src', mainElement.dataset.styleSrc);
        if (mainElement.dataset.logoSrc) widgetFunctions.updateData(index, 'logo_src', mainElement.dataset.logoSrc);
        if (mainElement.dataset.showDetailsCurrency) widgetFunctions.updateData(index, 'showDetailsCurrency', mainElement.dataset.showDetailsCurrency);
      }
    },
    updateWidgetElement: function(index, key, value, ticker){
      var state = widgetsStates[index];
      var mainElement = widgetFunctions.getMainElement(index);
      if (mainElement){
        var tickerClass = (ticker) ? 'Ticker' : '';
        if (key === 'name' || key === 'currencyId'){
          if (key === 'currencyId'){
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
            if (updateElement.classList.contains('showDetailsCurrency') && !state.showDetailsCurrency) {
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
        '<div class="'+'cp-widget__img cp-widget__img-'+data.currencyId+'">' +
        '<img/>' +
        '</div>' +
        '<div class="cp-widget__main">' +
        ((data.isData) ? widgetFunctions.widgetMainElementData(index) : widgetFunctions.widgetMainElementMessage(index)) +
        '</div>'+
        '</div>';
    },
    widgetMainElementData: function(index){
      var data = widgetsStates[index];
      return '<h3><a href="'+ widgetFunctions.coin_link(data.currencyId) +'">' +
        '<span class="nameTicker">'+ (data.ticker.name || data.emptyData) +'</span>' +
        '<span class="symbolTicker">'+ (data.ticker.symbol || data.emptyData) +'</span>' +
        '</a></h3>' +
        '<strong>' +
        '<span class="priceTicker parseNumber">'+ (widgetFunctions.parseNumber(data.ticker.price) || data.emptyData) + '</span> ' +
        '<span class="primaryCurrency">'+ data.primaryCurrency + ' </span>' +
        '<span class="price_change_24hTicker cp-widget__rank cp-widget__rank-'+ ((data.ticker.price_change_24h > 0) ? "up" : ((data.ticker.price_change_24h < 0) ? "down" : "neutral")) +'">('+ (widgetFunctions.roundAmount(data.ticker.price_change_24h, 2) || data.emptyValue) +'%)</span>' +
        '</strong>' +
        '<span class="cp-widget__rank-label">Rank <span class="rankTicker">'+ (data.ticker.rank || data.emptyData) +'</span></span>';
    },
    widgetMainElementMessage: function(index){
      var message = widgetsStates[index].message;
      return '<div class="cp-widget__main-no-data">'+ (message) +'</div>';
    },
    widgetAthElement: function(){
      return '<div>' +
        '<small>ATH</small>' +
        '<div>' +
        '<span class="price_athTicker parseNumber">'+ widgetsStates[0].emptyData + ' </span>' +
        '<span class="symbolTicker showDetailsCurrency"></span>' +
        '</div>' +
        '<span class="percent_from_price_athTicker cp-widget__rank">'+ widgetsStates[0].emptyData + '</span>' +
        '</div>'
    },
    widgetVolume24hElement: function(){
      return '<div>' +
        '<small>Volume 24h</small>' +
        '<div>' +
        '<span class="volume_24hTicker parseNumber">'+ widgetsStates[0].emptyData + ' </span>' +
        '<span class="symbolTicker showDetailsCurrency"></span>' +
        '</div>' +
        '<span class="volume_24h_change_24hTicker cp-widget__rank">'+ widgetsStates[0].emptyData + '</span>' +
        '</div>';
    },
    widgetMarketCapElement: function(){
      return '<div>' +
        '<small>Market cap</small>' +
        '<div>' +
        '<span class="market_capTicker parseNumber">'+ widgetsStates[0].emptyData + ' </span>' +
        '<span class="symbolTicker showDetailsCurrency"></span>' +
        '</div>' +
        '<span class="market_cap_change_24hTicker cp-widget__rank">'+ widgetsStates[0].emptyData + '</span>' +
        '</div>';
    },
    widgetFooter: function(index){
      var currencyId = widgetsStates[index].currencyId;
      return '<p class="cp-widget__footer">' +
        'powered by ' +
        '<img style="width: 16px" src="'+ widgetFunctions.main_logo_link() +'" alt=""/>' +
        '<a target="_blank" href="'+ widgetFunctions.coin_link(currencyId) +'">coinpaprika.com</a>' +
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
        newImg.src = widgetFunctions.img_src(data.currencyId);
      }
    },
    img_src: function(id){
      return 'https://coinpaprika.com/coin/'+id+'/logo.png';
    },
    coin_link: function(id){
      return 'https://coinpaprika.com/coin/'+ id
    },
    main_logo_link: function(){
      return widgetDefaults.logo_src || widgetDefaults.origin_src +'/dist/img/logo_widget.svg'
    },
    getScriptElement: function(){
      return document.querySelector('script[data-cp-currency-widget]');
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
          console.log('widgetDefaults: ', widgetDefaults);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIihmdW5jdGlvbigpe1xuICB2YXIgd2lkZ2V0c1N0YXRlcyA9IFtdO1xuICB2YXIgd2lkZ2V0RGVmYXVsdHMgPSB7XG4gICAgdmVyc2lvbjogJ2V4dGVuZGVkJyxcbiAgICBwcmltYXJ5Q3VycmVuY3k6ICdVU0QnLFxuICAgIGN1cnJlbmN5SWQ6ICdidGMtYml0Y29pbicsXG4gICAgbWFpbkVsZW1lbnQ6IG51bGwsXG4gICAgdXBkYXRlQWN0aXZlOiBmYWxzZSxcbiAgICB1cGRhdGVUaW1lb3V0OiAnMzBzJyxcbiAgICBzaG93RGV0YWlsc0N1cnJlbmN5OiBmYWxzZSxcbiAgICBsYW5ndWFnZTogJ2VuJyxcbiAgICBub2RlX21vZHVsZXNfc3JjOiBudWxsLFxuICAgIGJvd2VyX3NyYzogbnVsbCxcbiAgICBzdHlsZV9zcmM6IG51bGwsXG4gICAgbG9nb19zcmM6IG51bGwsXG4gICAgY2RuX3NyYzogJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vQGNvaW5wYXByaWthL3dpZGdldC1jdXJyZW5jeScsXG4gICAgZW1wdHlEYXRhOiAnLScsXG4gICAgZW1wdHlWYWx1ZTogMCxcbiAgICB0aWNrZXI6IHtcbiAgICAgIG5hbWU6IHVuZGVmaW5lZCxcbiAgICAgIHN5bWJvbDogdW5kZWZpbmVkLFxuICAgICAgcHJpY2U6IHVuZGVmaW5lZCxcbiAgICAgIHByaWNlX2NoYW5nZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgIHJhbms6IHVuZGVmaW5lZCxcbiAgICAgIHByaWNlX2F0aDogdW5kZWZpbmVkLFxuICAgICAgdm9sdW1lXzI0aDogdW5kZWZpbmVkLFxuICAgICAgbWFya2V0X2NhcDogdW5kZWZpbmVkLFxuICAgICAgcGVyY2VudF9mcm9tX3ByaWNlX2F0aDogdW5kZWZpbmVkLFxuICAgICAgdm9sdW1lXzI0aF9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgICBtYXJrZXRfY2FwX2NoYW5nZV8yNGg6IHVuZGVmaW5lZCxcbiAgICB9LFxuICAgIGludGVydmFsOiBudWxsLFxuICAgIGlzRGF0YTogZmFsc2UsXG4gICAgbWVzc2FnZTogJ0RhdGEgaXMgbG9hZGluZy4uLicsXG4gICAgb3JpZ2luX3NyYzogbnVsbCxcbiAgICB0cmFuc2xhdGlvbnM6IHt9LFxuICB9O1xuICB2YXIgd2lkZ2V0RnVuY3Rpb25zID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIGlmICghd2lkZ2V0RnVuY3Rpb25zLmdldE1haW5FbGVtZW50KGluZGV4KSkge1xuICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcignQmluZCBmYWlsZWQsIG5vIGVsZW1lbnQgd2l0aCBjbGFzcyA9IFwiY29pbnBhcHJpa2EtY3VycmVuY3ktd2lkZ2V0XCInKTtcbiAgICAgIH1cbiAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXREZWZhdWx0cyhpbmRleCk7XG4gICAgICB3aWRnZXRGdW5jdGlvbnMuc2V0T3JpZ2luTGluayhpbmRleCk7XG4gICAgfSxcbiAgICBzZXRPcmlnaW5MaW5rOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgZGF0YSA9IHdpZGdldHNTdGF0ZXNbaW5kZXhdO1xuICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICBpZiAoZGF0YS5ub2RlX21vZHVsZXNfc3JjKXtcbiAgICAgICAgd2lkZ2V0RGVmYXVsdHMub3JpZ2luX3NyYyA9IGRhdGEubm9kZV9tb2R1bGVzX3NyYztcbiAgICAgIH0gZWxzZSBpZiAoZGF0YS5ib3dlcl9zcmMpe1xuICAgICAgICB3aWRnZXREZWZhdWx0cy5vcmlnaW5fc3JjID0gZGF0YS5ib3dlcl9zcmM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aWRnZXREZWZhdWx0cy5vcmlnaW5fc3JjID0gZGF0YS5jZG5fc3JjO1xuICAgICAgfVxuICAgICAgd2lkZ2V0RnVuY3Rpb25zLnN0eWxlc2hlZXQoKTtcbiAgICAgIHdpZGdldEZ1bmN0aW9ucy5hZGRXaWRnZXRFbGVtZW50KGluZGV4KTtcbiAgICAgIHdpZGdldEZ1bmN0aW9ucy5pbml0SW50ZXJ2YWwoaW5kZXgpO1xuICAgIH0sXG4gICAgZ2V0TWFpbkVsZW1lbnQ6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHJldHVybiB3aWRnZXRzU3RhdGVzW2luZGV4XS5tYWluRWxlbWVudDtcbiAgICB9LFxuICAgIGdldERhdGE6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHhoci5vcGVuKCdHRVQnLCAnaHR0cHM6Ly9hcGkuY29pbnBhcHJpa2EuY29tL3YxL3dpZGdldC8nK3dpZGdldHNTdGF0ZXNbaW5kZXhdLmN1cnJlbmN5SWQrJz9xdW90ZT0nK3dpZGdldHNTdGF0ZXNbaW5kZXhdLnByaW1hcnlDdXJyZW5jeSk7XG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICBpZiAoIXdpZGdldHNTdGF0ZXNbaW5kZXhdLmlzRGF0YSkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdpc0RhdGEnLCB0cnVlKTtcbiAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMudXBkYXRlVGlja2VyKGluZGV4LCBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMub25FcnJvclJlcXVlc3QoaW5kZXgsIHhocik7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHdpZGdldEZ1bmN0aW9ucy5vbkVycm9yUmVxdWVzdChpbmRleCwgeGhyKTtcbiAgICAgIH07XG4gICAgICB4aHIuc2VuZCgpO1xuICAgIH0sXG4gICAgb25FcnJvclJlcXVlc3Q6IGZ1bmN0aW9uKGluZGV4LCB4aHIpe1xuICAgICAgaWYgKHdpZGdldHNTdGF0ZXNbaW5kZXhdLmlzRGF0YSkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdpc0RhdGEnLCBmYWxzZSk7XG4gICAgICB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ21lc3NhZ2UnLCAnRGF0YSBpcyBjdXJyZW50bHkgdW5hdmFpbGFibGUnKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1JlcXVlc3QgZmFpbGVkLiAgUmV0dXJuZWQgc3RhdHVzIG9mICcgKyB4aHIsIHdpZGdldHNTdGF0ZXNbaW5kZXhdKTtcbiAgICB9LFxuICAgIGluaXRJbnRlcnZhbDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgY2xlYXJJbnRlcnZhbCh3aWRnZXRzU3RhdGVzW2luZGV4XS5pbnRlcnZhbCk7XG4gICAgICBpZiAod2lkZ2V0c1N0YXRlc1tpbmRleF0udXBkYXRlQWN0aXZlICYmIHdpZGdldHNTdGF0ZXNbaW5kZXhdLnVwZGF0ZVRpbWVvdXQgPiAxMDAwKXtcbiAgICAgICAgd2lkZ2V0c1N0YXRlc1tpbmRleF0uaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXREYXRhKGluZGV4KTtcbiAgICAgICAgfSwgd2lkZ2V0c1N0YXRlc1tpbmRleF0udXBkYXRlVGltZW91dCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGRXaWRnZXRFbGVtZW50OiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgbWFpbkVsZW1lbnQgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgdmFyIGRldGFpbHMgPSAod2lkZ2V0c1N0YXRlc1tpbmRleF0udmVyc2lvbiA9PT0gJ2V4dGVuZGVkJykgPyAnPGRpdiBjbGFzcz1cImNwLXdpZGdldF9fZGV0YWlsc1wiPicgKyB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0QXRoRWxlbWVudCgpICsgd2lkZ2V0RnVuY3Rpb25zLndpZGdldFZvbHVtZTI0aEVsZW1lbnQoKSArIHdpZGdldEZ1bmN0aW9ucy53aWRnZXRNYXJrZXRDYXBFbGVtZW50KCkgKyAnPC9kaXY+JyA6ICcnO1xuICAgICAgdmFyIHdpZGdldEVsZW1lbnQgPSB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0TWFpbkVsZW1lbnQoaW5kZXgpICsgZGV0YWlscyArIHdpZGdldEZ1bmN0aW9ucy53aWRnZXRGb290ZXIoaW5kZXgpO1xuICAgICAgbWFpbkVsZW1lbnQuaW5uZXJIVE1MID0gd2lkZ2V0RWxlbWVudDtcbiAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXREYXRhKGluZGV4KTtcbiAgICB9LFxuICAgIGdldERlZmF1bHRzOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgbWFpbkVsZW1lbnQgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQpe1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC52ZXJzaW9uKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3ZlcnNpb24nLCBtYWluRWxlbWVudC5kYXRhc2V0LnZlcnNpb24pO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5wcmltYXJ5Q3VycmVuY3kpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAncHJpbWFyeUN1cnJlbmN5JywgbWFpbkVsZW1lbnQuZGF0YXNldC5wcmltYXJ5Q3VycmVuY3kpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5jdXJyZW5jeSkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdjdXJyZW5jeUlkJywgbWFpbkVsZW1lbnQuZGF0YXNldC5jdXJyZW5jeSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnNob3dEZXRhaWxzQ3VycmVuY3kpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnc2hvd0RldGFpbHNDdXJyZW5jeScsIChtYWluRWxlbWVudC5kYXRhc2V0LnNob3dEZXRhaWxzQ3VycmVuY3kgPT09ICd0cnVlJykpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVBY3RpdmUpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAndXBkYXRlQWN0aXZlJywgKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlQWN0aXZlID09PSAndHJ1ZScpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlVGltZW91dCkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICd1cGRhdGVUaW1lb3V0Jywgd2lkZ2V0RnVuY3Rpb25zLnBhcnNlSW50ZXJ2YWxWYWx1ZShtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZVRpbWVvdXQpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ3VhZ2UpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnbGFuZ3VhZ2UnLCBtYWluRWxlbWVudC5kYXRhc2V0Lmxhbmd1YWdlKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubm9kZU1vZHVsZXNTcmMpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnbm9kZV9tb2R1bGVzX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQubm9kZU1vZHVsZXNTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5ib3dlclNyYykgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdib3dlcl9zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LmJvd2VyU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuc3R5bGVTcmMpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnc3R5bGVfc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5zdHlsZVNyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmxvZ29TcmMpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnbG9nb19zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LmxvZ29TcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5zaG93RGV0YWlsc0N1cnJlbmN5KSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3Nob3dEZXRhaWxzQ3VycmVuY3knLCBtYWluRWxlbWVudC5kYXRhc2V0LnNob3dEZXRhaWxzQ3VycmVuY3kpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlV2lkZ2V0RWxlbWVudDogZnVuY3Rpb24oaW5kZXgsIGtleSwgdmFsdWUsIHRpY2tlcil7XG4gICAgICB2YXIgc3RhdGUgPSB3aWRnZXRzU3RhdGVzW2luZGV4XTtcbiAgICAgIHZhciBtYWluRWxlbWVudCA9IHdpZGdldEZ1bmN0aW9ucy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgICBpZiAobWFpbkVsZW1lbnQpe1xuICAgICAgICB2YXIgdGlja2VyQ2xhc3MgPSAodGlja2VyKSA/ICdUaWNrZXInIDogJyc7XG4gICAgICAgIGlmIChrZXkgPT09ICduYW1lJyB8fCBrZXkgPT09ICdjdXJyZW5jeUlkJyl7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2N1cnJlbmN5SWQnKXtcbiAgICAgICAgICAgIHZhciBhRWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0X19mb290ZXIgPiBhJyk7XG4gICAgICAgICAgICBmb3IodmFyIGsgPSAwOyBrIDwgYUVsZW1lbnRzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgIGFFbGVtZW50c1trXS5ocmVmID0gd2lkZ2V0RnVuY3Rpb25zLmNvaW5fbGluayh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXRJbWFnZShpbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGtleSA9PT0gJ2lzRGF0YScgfHwga2V5ID09PSAnbWVzc2FnZScpe1xuICAgICAgICAgIHZhciBoZWFkZXJFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXRfX21haW4nKTtcbiAgICAgICAgICBmb3IodmFyIGsgPSAwOyBrIDwgaGVhZGVyRWxlbWVudHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgIGhlYWRlckVsZW1lbnRzW2tdLmlubmVySFRNTCA9ICghc3RhdGUuaXNEYXRhKSA/IHdpZGdldEZ1bmN0aW9ucy53aWRnZXRNYWluRWxlbWVudE1lc3NhZ2UoaW5kZXgpIDogd2lkZ2V0RnVuY3Rpb25zLndpZGdldE1haW5FbGVtZW50RGF0YShpbmRleCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciB1cGRhdGVFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nK2tleSt0aWNrZXJDbGFzcyk7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB1cGRhdGVFbGVtZW50cy5sZW5ndGg7IGorKyl7XG4gICAgICAgICAgICB2YXIgdXBkYXRlRWxlbWVudCA9IHVwZGF0ZUVsZW1lbnRzW2pdO1xuICAgICAgICAgICAgaWYgKHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjcC13aWRnZXRfX3JhbmsnKSl7XG4gICAgICAgICAgICAgIHZhciBjbGFzc05hbWUgPSAocGFyc2VGbG9hdCh2YWx1ZSkgPiAwKSA/IFwiY3Atd2lkZ2V0X19yYW5rLXVwXCIgOiAoKHBhcnNlRmxvYXQodmFsdWUpIDwgMCkgPyBcImNwLXdpZGdldF9fcmFuay1kb3duXCIgOiBcImNwLXdpZGdldF9fcmFuay1uZXV0cmFsXCIpO1xuICAgICAgICAgICAgICB1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9fcmFuay1kb3duJyk7XG4gICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLXVwJyk7XG4gICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLW5ldXRyYWwnKTtcbiAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgIHZhbHVlID0gc3RhdGUuZW1wdHlEYXRhO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gKGtleSA9PT0gJ3ByaWNlX2NoYW5nZV8yNGgnKSA/ICcoJyt3aWRnZXRGdW5jdGlvbnMucm91bmRBbW91bnQodmFsdWUsIDIpKyclKSc6IHdpZGdldEZ1bmN0aW9ucy5yb3VuZEFtb3VudCh2YWx1ZSwgMikrJyUnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3dEZXRhaWxzQ3VycmVuY3knKSAmJiAhc3RhdGUuc2hvd0RldGFpbHNDdXJyZW5jeSkge1xuICAgICAgICAgICAgICB2YWx1ZSA9ICcgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncGFyc2VOdW1iZXInKSl7XG4gICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuaW5uZXJUZXh0ID0gd2lkZ2V0RnVuY3Rpb25zLnBhcnNlTnVtYmVyKHZhbHVlKSB8fCBzdGF0ZS5lbXB0eURhdGE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB1cGRhdGVFbGVtZW50LmlubmVyVGV4dCA9IHZhbHVlIHx8IHN0YXRlLmVtcHR5RGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZURhdGE6IGZ1bmN0aW9uKGluZGV4LCBrZXksIHZhbHVlLCB0aWNrZXIpe1xuICAgICAgaWYgKHRpY2tlcil7XG4gICAgICAgIHdpZGdldHNTdGF0ZXNbaW5kZXhdLnRpY2tlcltrZXldID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aWRnZXRzU3RhdGVzW2luZGV4XVtrZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgICB3aWRnZXRGdW5jdGlvbnMudXBkYXRlV2lkZ2V0RWxlbWVudChpbmRleCwga2V5LCB2YWx1ZSwgdGlja2VyKTtcbiAgICB9LFxuICAgIHVwZGF0ZVRpY2tlcjogZnVuY3Rpb24oaW5kZXgsIGRhdGEpe1xuICAgICAgdmFyIGRhdGFLZXlzID0gT2JqZWN0LmtleXMoZGF0YSk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFLZXlzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsIGRhdGFLZXlzW2ldLCBkYXRhW2RhdGFLZXlzW2ldXSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBwYXJzZUludGVydmFsVmFsdWU6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIHZhciB0aW1lU3ltYm9sID0gJycsIG11bHRpcGxpZXIgPSAxO1xuICAgICAgaWYgKHZhbHVlLnNlYXJjaCgncycpID4gLTEpe1xuICAgICAgICB0aW1lU3ltYm9sID0gJ3MnO1xuICAgICAgICBtdWx0aXBsaWVyID0gMTAwMDtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZS5zZWFyY2goJ20nKSA+IC0xKXtcbiAgICAgICAgdGltZVN5bWJvbCA9ICdtJztcbiAgICAgICAgbXVsdGlwbGllciA9IDYwICogMTAwMDtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZS5zZWFyY2goJ2gnKSA+IC0xKXtcbiAgICAgICAgdGltZVN5bWJvbCA9ICdoJztcbiAgICAgICAgbXVsdGlwbGllciA9IDYwICogNjAgKiAxMDAwO1xuICAgICAgfVxuICAgICAgaWYgKHZhbHVlLnNlYXJjaCgnZCcpID4gLTEpe1xuICAgICAgICB0aW1lU3ltYm9sID0gJ2QnO1xuICAgICAgICBtdWx0aXBsaWVyID0gMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlLnJlcGxhY2UodGltZVN5bWJvbCwnJykpICogbXVsdGlwbGllcjtcbiAgICB9LFxuICAgIHBhcnNlTnVtYmVyOiBmdW5jdGlvbihudW1iZXIpe1xuICAgICAgaWYgKCFudW1iZXIgJiYgbnVtYmVyICE9PSAwKSByZXR1cm4gbnVtYmVyO1xuICAgICAgaWYgKG51bWJlciA9PT0gd2lkZ2V0c1N0YXRlc1swXS5lbXB0eVZhbHVlIHx8IG51bWJlciA9PT0gd2lkZ2V0c1N0YXRlc1swXS5lbXB0eURhdGEpIHJldHVybiBudW1iZXI7XG4gICAgICBudW1iZXIgPSBwYXJzZUZsb2F0KG51bWJlcik7XG4gICAgICB2YXIgbnVtYmVyU3RyID0gbnVtYmVyLnRvU3RyaW5nKCk7XG4gICAgICBpZiAobnVtYmVyID4gMTAwMDAwKXtcbiAgICAgICAgdmFyIHBhcmFtZXRlciA9ICdLJyxcbiAgICAgICAgICBzcGxpY2VkID0gbnVtYmVyU3RyLnNsaWNlKDAsIG51bWJlclN0ci5sZW5ndGggLSAxKTtcbiAgICAgICAgaWYgKG51bWJlciA+IDEwMDAwMDAwMDApe1xuICAgICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDcpO1xuICAgICAgICAgIHBhcmFtZXRlciA9ICdCJztcbiAgICAgICAgfSBlbHNlIGlmIChudW1iZXIgPiAxMDAwMDAwKXtcbiAgICAgICAgICBzcGxpY2VkID0gbnVtYmVyU3RyLnNsaWNlKDAsIG51bWJlclN0ci5sZW5ndGggLSA0KTtcbiAgICAgICAgICBwYXJhbWV0ZXIgPSAnTSc7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5hdHVyYWwgPSBzcGxpY2VkLnNsaWNlKDAsIHNwbGljZWQubGVuZ3RoIC0gMik7XG4gICAgICAgIHZhciBkZWNpbWFsID0gc3BsaWNlZC5zbGljZShzcGxpY2VkLmxlbmd0aCAtIDIpO1xuICAgICAgICByZXR1cm4gbmF0dXJhbCArICcuJyArIGRlY2ltYWwgKyAnICcgKyBwYXJhbWV0ZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgaXNEZWNpbWFsID0gKG51bWJlciAlIDEpID4gMDtcbiAgICAgICAgaWYgKGlzRGVjaW1hbCl7XG4gICAgICAgICAgdmFyIHByZWNpc2lvbiA9IDI7XG4gICAgICAgICAgaWYgKG51bWJlciA8IDEpe1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gODtcbiAgICAgICAgICB9IGVsc2UgaWYgKG51bWJlciA8IDEwKXtcbiAgICAgICAgICAgIHByZWNpc2lvbiA9IDY7XG4gICAgICAgICAgfSBlbHNlIGlmIChudW1iZXIgPCAxMDAwKXtcbiAgICAgICAgICAgIHByZWNpc2lvbiA9IDQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB3aWRnZXRGdW5jdGlvbnMucm91bmRBbW91bnQobnVtYmVyLCBwcmVjaXNpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBudW1iZXIudG9GaXhlZCgyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgcm91bmRBbW91bnQ6IGZ1bmN0aW9uKGFtb3VudCwgZGVjaW1hbCwgZGlyZWN0aW9uKXtcbiAgICAgIGFtb3VudCA9IHBhcnNlRmxvYXQoYW1vdW50KTtcbiAgICAgIGlmICghZGVjaW1hbCkgZGVjaW1hbCA9IDg7XG4gICAgICBpZiAoIWRpcmVjdGlvbikgZGlyZWN0aW9uID0gJ3JvdW5kJztcbiAgICAgIGRlY2ltYWwgPSBNYXRoLnBvdygxMCwgZGVjaW1hbCk7XG4gICAgICByZXR1cm4gTWF0aFtkaXJlY3Rpb25dKGFtb3VudCAqIGRlY2ltYWwpIC8gZGVjaW1hbDtcbiAgICB9LFxuICAgIHN0eWxlc2hlZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICBpZiAod2lkZ2V0RGVmYXVsdHMuc3R5bGVfc3JjICE9PSBmYWxzZSl7XG4gICAgICAgIHZhciB1cmwgPSB3aWRnZXREZWZhdWx0cy5zdHlsZV9zcmMgfHwgd2lkZ2V0RGVmYXVsdHMub3JpZ2luX3NyYyArJy9kaXN0L3dpZGdldC5taW4uY3NzJztcbiAgICAgICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG4gICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdyZWwnLCAnc3R5bGVzaGVldCcpO1xuICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnaHJlZicsIHVybCk7XG4gICAgICAgIHJldHVybiAoZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCdsaW5rW2hyZWY9XCInK3VybCsnXCJdJykpID8gJycgOiBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgfVxuICAgIH0sXG4gICAgd2lkZ2V0TWFpbkVsZW1lbnQ6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciBkYXRhID0gd2lkZ2V0c1N0YXRlc1tpbmRleF07XG4gICAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJjcC13aWRnZXRfX2hlYWRlclwiPicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cIicrJ2NwLXdpZGdldF9faW1nIGNwLXdpZGdldF9faW1nLScrZGF0YS5jdXJyZW5jeUlkKydcIj4nICtcbiAgICAgICAgJzxpbWcvPicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19tYWluXCI+JyArXG4gICAgICAgICgoZGF0YS5pc0RhdGEpID8gd2lkZ2V0RnVuY3Rpb25zLndpZGdldE1haW5FbGVtZW50RGF0YShpbmRleCkgOiB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0TWFpbkVsZW1lbnRNZXNzYWdlKGluZGV4KSkgK1xuICAgICAgICAnPC9kaXY+JytcbiAgICAgICAgJzwvZGl2Pic7XG4gICAgfSxcbiAgICB3aWRnZXRNYWluRWxlbWVudERhdGE6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciBkYXRhID0gd2lkZ2V0c1N0YXRlc1tpbmRleF07XG4gICAgICByZXR1cm4gJzxoMz48YSBocmVmPVwiJysgd2lkZ2V0RnVuY3Rpb25zLmNvaW5fbGluayhkYXRhLmN1cnJlbmN5SWQpICsnXCI+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cIm5hbWVUaWNrZXJcIj4nKyAoZGF0YS50aWNrZXIubmFtZSB8fCBkYXRhLmVtcHR5RGF0YSkgKyc8L3NwYW4+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlclwiPicrIChkYXRhLnRpY2tlci5zeW1ib2wgfHwgZGF0YS5lbXB0eURhdGEpICsnPC9zcGFuPicgK1xuICAgICAgICAnPC9hPjwvaDM+JyArXG4gICAgICAgICc8c3Ryb25nPicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJwcmljZVRpY2tlciBwYXJzZU51bWJlclwiPicrICh3aWRnZXRGdW5jdGlvbnMucGFyc2VOdW1iZXIoZGF0YS50aWNrZXIucHJpY2UpIHx8IGRhdGEuZW1wdHlEYXRhKSArICc8L3NwYW4+ICcgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJwcmltYXJ5Q3VycmVuY3lcIj4nKyBkYXRhLnByaW1hcnlDdXJyZW5jeSArICcgPC9zcGFuPicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJwcmljZV9jaGFuZ2VfMjRoVGlja2VyIGNwLXdpZGdldF9fcmFuayBjcC13aWRnZXRfX3JhbmstJysgKChkYXRhLnRpY2tlci5wcmljZV9jaGFuZ2VfMjRoID4gMCkgPyBcInVwXCIgOiAoKGRhdGEudGlja2VyLnByaWNlX2NoYW5nZV8yNGggPCAwKSA/IFwiZG93blwiIDogXCJuZXV0cmFsXCIpKSArJ1wiPignKyAod2lkZ2V0RnVuY3Rpb25zLnJvdW5kQW1vdW50KGRhdGEudGlja2VyLnByaWNlX2NoYW5nZV8yNGgsIDIpIHx8IGRhdGEuZW1wdHlWYWx1ZSkgKyclKTwvc3Bhbj4nICtcbiAgICAgICAgJzwvc3Ryb25nPicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJjcC13aWRnZXRfX3JhbmstbGFiZWxcIj5SYW5rIDxzcGFuIGNsYXNzPVwicmFua1RpY2tlclwiPicrIChkYXRhLnRpY2tlci5yYW5rIHx8IGRhdGEuZW1wdHlEYXRhKSArJzwvc3Bhbj48L3NwYW4+JztcbiAgICB9LFxuICAgIHdpZGdldE1haW5FbGVtZW50TWVzc2FnZTogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIG1lc3NhZ2UgPSB3aWRnZXRzU3RhdGVzW2luZGV4XS5tZXNzYWdlO1xuICAgICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0X19tYWluLW5vLWRhdGFcIj4nKyAobWVzc2FnZSkgKyc8L2Rpdj4nO1xuICAgIH0sXG4gICAgd2lkZ2V0QXRoRWxlbWVudDogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiAnPGRpdj4nICtcbiAgICAgICAgJzxzbWFsbD5BVEg8L3NtYWxsPicgK1xuICAgICAgICAnPGRpdj4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwicHJpY2VfYXRoVGlja2VyIHBhcnNlTnVtYmVyXCI+Jysgd2lkZ2V0c1N0YXRlc1swXS5lbXB0eURhdGEgKyAnIDwvc3Bhbj4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwic3ltYm9sVGlja2VyIHNob3dEZXRhaWxzQ3VycmVuY3lcIj48L3NwYW4+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwicGVyY2VudF9mcm9tX3ByaWNlX2F0aFRpY2tlciBjcC13aWRnZXRfX3JhbmtcIj4nKyB3aWRnZXRzU3RhdGVzWzBdLmVtcHR5RGF0YSArICc8L3NwYW4+JyArXG4gICAgICAgICc8L2Rpdj4nXG4gICAgfSxcbiAgICB3aWRnZXRWb2x1bWUyNGhFbGVtZW50OiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuICc8ZGl2PicgK1xuICAgICAgICAnPHNtYWxsPlZvbHVtZSAyNGg8L3NtYWxsPicgK1xuICAgICAgICAnPGRpdj4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwidm9sdW1lXzI0aFRpY2tlciBwYXJzZU51bWJlclwiPicrIHdpZGdldHNTdGF0ZXNbMF0uZW1wdHlEYXRhICsgJyA8L3NwYW4+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInN5bWJvbFRpY2tlciBzaG93RGV0YWlsc0N1cnJlbmN5XCI+PC9zcGFuPicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInZvbHVtZV8yNGhfY2hhbmdlXzI0aFRpY2tlciBjcC13aWRnZXRfX3JhbmtcIj4nKyB3aWRnZXRzU3RhdGVzWzBdLmVtcHR5RGF0YSArICc8L3NwYW4+JyArXG4gICAgICAgICc8L2Rpdj4nO1xuICAgIH0sXG4gICAgd2lkZ2V0TWFya2V0Q2FwRWxlbWVudDogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiAnPGRpdj4nICtcbiAgICAgICAgJzxzbWFsbD5NYXJrZXQgY2FwPC9zbWFsbD4nICtcbiAgICAgICAgJzxkaXY+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cIm1hcmtldF9jYXBUaWNrZXIgcGFyc2VOdW1iZXJcIj4nKyB3aWRnZXRzU3RhdGVzWzBdLmVtcHR5RGF0YSArICcgPC9zcGFuPicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJzeW1ib2xUaWNrZXIgc2hvd0RldGFpbHNDdXJyZW5jeVwiPjwvc3Bhbj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJtYXJrZXRfY2FwX2NoYW5nZV8yNGhUaWNrZXIgY3Atd2lkZ2V0X19yYW5rXCI+Jysgd2lkZ2V0c1N0YXRlc1swXS5lbXB0eURhdGEgKyAnPC9zcGFuPicgK1xuICAgICAgICAnPC9kaXY+JztcbiAgICB9LFxuICAgIHdpZGdldEZvb3RlcjogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIGN1cnJlbmN5SWQgPSB3aWRnZXRzU3RhdGVzW2luZGV4XS5jdXJyZW5jeUlkO1xuICAgICAgcmV0dXJuICc8cCBjbGFzcz1cImNwLXdpZGdldF9fZm9vdGVyXCI+JyArXG4gICAgICAgICdwb3dlcmVkIGJ5ICcgK1xuICAgICAgICAnPGltZyBzdHlsZT1cIndpZHRoOiAxNnB4XCIgc3JjPVwiJysgd2lkZ2V0RnVuY3Rpb25zLm1haW5fbG9nb19saW5rKCkgKydcIiBhbHQ9XCJcIi8+JyArXG4gICAgICAgICc8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJysgd2lkZ2V0RnVuY3Rpb25zLmNvaW5fbGluayhjdXJyZW5jeUlkKSArJ1wiPmNvaW5wYXByaWthLmNvbTwvYT4nICtcbiAgICAgICAgJzwvcD4nXG4gICAgfSxcbiAgICBnZXRJbWFnZTogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIGRhdGEgPSB3aWRnZXRzU3RhdGVzW2luZGV4XTtcbiAgICAgIHZhciBpbWdDb250YWluZXJzID0gZGF0YS5tYWluRWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjcC13aWRnZXRfX2ltZycpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbWdDb250YWluZXJzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIGltZ0NvbnRhaW5lciA9IGltZ0NvbnRhaW5lcnNbaV07XG4gICAgICAgIGltZ0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjcC13aWRnZXRfX2ltZy0taGlkZGVuJyk7XG4gICAgICAgIHZhciBpbWcgPSBpbWdDb250YWluZXIucXVlcnlTZWxlY3RvcignaW1nJyk7XG4gICAgICAgIHZhciBuZXdJbWcgPSBuZXcgSW1hZ2U7XG4gICAgICAgIG5ld0ltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpbWcuc3JjID0gdGhpcy5zcmM7XG4gICAgICAgICAgaW1nQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9faW1nLS1oaWRkZW4nKTtcbiAgICAgICAgfTtcbiAgICAgICAgbmV3SW1nLnNyYyA9IHdpZGdldEZ1bmN0aW9ucy5pbWdfc3JjKGRhdGEuY3VycmVuY3lJZCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBpbWdfc3JjOiBmdW5jdGlvbihpZCl7XG4gICAgICByZXR1cm4gJ2h0dHBzOi8vY29pbnBhcHJpa2EuY29tL2NvaW4vJytpZCsnL2xvZ28ucG5nJztcbiAgICB9LFxuICAgIGNvaW5fbGluazogZnVuY3Rpb24oaWQpe1xuICAgICAgcmV0dXJuICdodHRwczovL2NvaW5wYXByaWthLmNvbS9jb2luLycrIGlkXG4gICAgfSxcbiAgICBtYWluX2xvZ29fbGluazogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB3aWRnZXREZWZhdWx0cy5sb2dvX3NyYyB8fCB3aWRnZXREZWZhdWx0cy5vcmlnaW5fc3JjICsnL2Rpc3QvaW1nL2xvZ29fd2lkZ2V0LnN2ZydcbiAgICB9LFxuICAgIGdldFNjcmlwdEVsZW1lbnQ6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0W2RhdGEtY3AtY3VycmVuY3ktd2lkZ2V0XScpO1xuICAgIH0sXG4gIH07XG4gIFxuICBmdW5jdGlvbiBpbml0V2lkZ2V0cygpe1xuICAgIGlmICghd2luZG93LmNwQ3VycmVuY3lXaWRnZXRzSW5pdGlhbGl6ZWQpe1xuICAgICAgd2luZG93LmNwQ3VycmVuY3lXaWRnZXRzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgdmFyIG1haW5FbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NvaW5wYXByaWthLWN1cnJlbmN5LXdpZGdldCcpKTtcbiAgICAgIHZhciBzY3JpcHRFbGVtZW50ID0gd2lkZ2V0RnVuY3Rpb25zLmdldFNjcmlwdEVsZW1lbnQoKTtcbiAgICAgIGlmIChzY3JpcHRFbGVtZW50ICYmIHNjcmlwdEVsZW1lbnQuZGF0YXNldCAmJiBzY3JpcHRFbGVtZW50LmRhdGFzZXQuY3BDdXJyZW5jeVdpZGdldCl7XG4gICAgICAgIHZhciBkYXRhc2V0ID0gSlNPTi5wYXJzZShzY3JpcHRFbGVtZW50LmRhdGFzZXQuY3BDdXJyZW5jeVdpZGdldCk7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhkYXRhc2V0KSl7XG4gICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhkYXRhc2V0KTtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGtleXMubGVuZ3RoOyBqKyspe1xuICAgICAgICAgICAgdmFyIGtleSA9IGtleXNbal0ucmVwbGFjZSgnLScsICdfJyk7XG4gICAgICAgICAgICB3aWRnZXREZWZhdWx0c1trZXldID0gZGF0YXNldFtrZXlzW2pdXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgd2lkZ2V0c1N0YXRlcyA9IFtdO1xuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbWFpbkVsZW1lbnRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICB2YXIgbmV3U2V0dGluZ3MgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHdpZGdldERlZmF1bHRzKSk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3dpZGdldERlZmF1bHRzOiAnLCB3aWRnZXREZWZhdWx0cyk7XG4gICAgICAgICAgbmV3U2V0dGluZ3MubWFpbkVsZW1lbnQgPSBtYWluRWxlbWVudHNbaV07XG4gICAgICAgICAgd2lkZ2V0c1N0YXRlcy5wdXNoKG5ld1NldHRpbmdzKTtcbiAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMuaW5pdChpKTtcbiAgICAgICAgfVxuICAgICAgfSwgNTApO1xuICAgIH1cbiAgfVxuICBcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBpbml0V2lkZ2V0cywgZmFsc2UpO1xuICB3aW5kb3cuYmluZFdpZGdldCA9IGZ1bmN0aW9uKCl7XG4gICAgd2luZG93LmNwQ3VycmVuY3lXaWRnZXRzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICBpbml0V2lkZ2V0cygpO1xuICB9O1xufSkoKTsiXX0=
