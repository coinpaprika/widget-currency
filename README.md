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
     data-version="extended" 
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

**primary-currency** - the currency to which the values ​​will be converted possible options 'USD', 'BTC' and 'ETH'
```text
default: 'USD'
```

**version** - 'standard' or 'extended'

##### Standard widget:
<img src="https://i.imgur.com/Og4f6sN.png" alt="" data-canonical-src="https://i.imgur.com/Og4f6sN.png" height="80" />

##### Extended widget:
<img src="https://i.imgur.com/7JGiq0b.png" alt="" data-canonical-src="https://i.imgur.com/7JGiq0b.png" height="148" />

######
```text
default: 'extended'
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
default: 'https://cdn.jsdelivr.net/npm/@coinpaprika/widget-currency@1.0.7'
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
     data-version="extended" 
     data-update-active="false" 
     data-update-timeout="30s"></div>
<script src="https://cdn.jsdelivr.net/npm/@coinpaprika/widget-currency@1.0.7/dist/widget.min.js"></script>
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
<script src="https://cdn.jsdelivr.net/npm/@coinpaprika/widget-currency@1.0.7/dist/widget.min.js"></script>
```

## Live Demo

[https://jsfiddle.net/xrz46ajs/10/](https://jsfiddle.net/xrz46ajs/10/)