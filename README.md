# Coinpaprika Currency Widget
<img src="https://i.imgur.com/Xwf3EKf.png" alt="" data-canonical-src="https://i.imgur.com/Xwf3EKf.png"/>

## How to use

### Parameters: 

#### In div element: data-/parameter/="/value/"
example:
```html
<div class="coinpaprika-currency-widget" 
     data-primary-currency="USD" 
     data-currency="btc-bitcoin" 
     data-modules='["chart", "market_details"]'  
     data-update-active="false" 
     data-update-timeout="30s"></div>
```

#### In script element: "data-cp-currency-widget='{ "/parameter/": /value/ }'"
##### this parameters is set to all widgets on page
example:
```html
<div class="coinpaprika-currency-widget"></div>
<script src="./src/widget.js"
        data-cp-currency-widget='{
            "language": "pl",
            "primary-currency": "ETH",
            "origin-src": "."
        }'>
</script>
```
###
### API:
**currency** - Currency ID that you can get from [API](https://api.coinpaprika.com/#tag/coins) ex. 'btc-bitcoin'
```text
default: 'btc-bitcoin'
```

**primary-currency** - the currency to which the values ​​will be converted possible options 'USD', 'PLN', 'BTC' and 'ETH'
```text
default: 'USD'
```

**modules** - 'market_details' and 'chart' (you can combine all modules)

##### Chart module:
<img src="https://i.imgur.com/bAcjxIk.png" alt="" data-canonical-src="https://i.imgur.com/bAcjxIk.png" width="320" />

##### Market details module:
<img src="https://i.imgur.com/LJyxE5u.png" alt="" data-canonical-src="https://i.imgur.com/LJyxE5u.png" width="320" />

##### All modules:
<img src="https://i.imgur.com/MVmyXeV.png" alt="" data-canonical-src="https://i.imgur.com/MVmyXeV.png" width="320" />

######
```text
default: ['market_details', 'chart']
```

**range** - initial chart range '24h', '7d', '30d', '1q', '1y', 'ytd', 'all'
```text
default: '7d'
```

**update-active** - bool value is live data updates active
```text
deafult: false
```

**update-timeout** - Update interval '30s', '1m', '5m', '10m', '30m'
```text
default: '30s'
```

**language** - text translation from files in dist/lang/
```text
default: 'en'
```

**origin-src** - custom link to `/dist` directory
```text
default: 'https://unpkg.com/@coinpaprika/widget-currency'
```

**style-src** - custom link to css file, if you don't want to fetch styles from js set as `false`
```text
default: null
```

**img-src** - custom link to img folder
```text
default: null
```

**lang-src** - custom link to lang folder
```text
default: null
```

### Night Mode: 

<img src="https://i.imgur.com/umLLWUz.png" alt="" data-canonical-src="https://i.imgur.com/umLLWUz.png" height="148" />

######

Enable styling for dark backgrounds by adding `cp-widget__night-mode` class to widget element


```html
<div class="coinpaprika-currency-widget cp-widget__night-mode"></div>
```


### Copy paste this code in your HTML, replacing data parameters

```html
<div class="coinpaprika-currency-widget" 
     data-primary-currency="USD" 
     data-currency="btc-bitcoin"
     data-update-active="false" 
     data-update-timeout="30s"></div>
<script src="https://unpkg.com/@coinpaprika/widget-currency/dist/widget.min.js"></script>
```

### Via npm

`npm i @coinpaprika/widget-currency --save`

Then add this to your HTML, replacing data parameters

```html
<div class="coinpaprika-currency-widget"></div>
<script src="../node_modules/@coinpaprika/widget-currency/dist/widget.min.js" 
        data-cp-currency-widget='{
            "origin-src": "../node_modules/@coinpaprika/widget-currency"
        }'></script>
```

### Via bower

`bower install coinpaprika-widget-currency --save`

Then add this to your HTML, replacing data parameters

```html
<div class="coinpaprika-currency-widget"></div>
<script src="../bower_components/coinpaprika-widget-currency/dist/widget.min.js" 
        data-cp-currency-widget='{
            "origin-src": "../bower_components/coinpaprika-widget-currency"
        }'></script>
```

### Using multiple widgets in same page

```html
<div class="coinpaprika-currency-widget"></div>
<div class="coinpaprika-currency-widget" 
     data-currency="xrp-xrp" 
     data-version="standard" 
     data-update-active="true"></div>
<script src="https://unpkg.com/@coinpaprika/widget-currency/dist/widget.min.js"></script>
```

## Live Demo

[https://jsfiddle.net/xrz46ajs](https://jsfiddle.net/xrz46ajs/18/)