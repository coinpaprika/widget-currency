# Coinpaprika Currency Widget
<img src="https://i.imgur.com/Xwf3EKf.png" alt="" data-canonical-src="https://i.imgur.com/Xwf3EKf.png"/>


## How to use

### Parameters: 

**data-currency** - Currency ID that you can get from [API](https://api.coinpaprika.com/#tag/coins) ex. 'btc-bitcoin'
```text
default: 'BTC'
```

**data-primary-currency** - the currency to which the values ​​will be converted possible options 'USD', 'BTC' and 'ETH'
```text
default: 'USD'
```

**data-version** - 'standard' or 'extended'

##### Standard widget:
<img src="https://i.imgur.com/Og4f6sN.png" alt="" data-canonical-src="https://i.imgur.com/Og4f6sN.png" height="80" />

##### Extended widget:
<img src="https://i.imgur.com/7JGiq0b.png" alt="" data-canonical-src="https://i.imgur.com/7JGiq0b.png" height="148" />

######
```text
default: 'extended'
```

**data-update-active** - bool value is live data updates active
```text
deafult: false
```

**data-update-timeout** - Update interval '30s', '1m', '5m', '10m', '30m'
```text
default: '30s'
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
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/coinpaprika/widget-currency/src/widget.min.js"></script>
```

### Via npm

`npm install coinpaprika-widget-currency`

Then add this to your HTML, replacing data parameters

```html
<div class="coinpaprika-currency-widget" 
     data-primary-currency="USD" 
     data-currency="btc-bitcoin" 
     data-version="extended" 
     data-update-active="false" 
     data-update-timeout="30s"></div>
<script src="../node_modules/coinpaprika-widget-currency/dist/widget.js"></script>
```

### Via bower

`bower install coinpaprika-widget-currency`

Then add this to your HTML, replacing data parameters

```html
<div class="coinpaprika-currency-widget" 
     data-primary-currency="USD" 
     data-currency="btc-bitcoin" 
     data-version="extended" 
     data-update-active="false" 
     data-update-timeout="30s"></div>
<script src="../bower_components/coinpaprika-widget-currency/dist/widget.js"></script>
```

### Using multiple widgets in same page

```html
<div class="coinpaprika-currency-widget"></div>
<div class="coinpaprika-currency-widget" 
     data-currency="xrp-xrp" 
     data-version="standard" 
     data-update-active="true"></div>
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/coinpaprika/widget-currency/src/widget.min.js"></script>
```
