## Coinpaprika Currency Widget

![Coinpaprika Currency Widget Image](https://i.imgur.com/Xwf3EKf.png)

### How to use


#### Parameters: 

**data-currency** - widget main currency represented by {shortName-fullName} ex. 'btc-bitcoin'
```text
default: 'BTC'
```

**data-primary-currency** - the currency to which the values ​​will be converted possible options 'USD', 'BTC' and 'ETH'
```text
default: 'USD'
```

**data-version** - 'standard' or 'extended'
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

#### Copy paste this code in your HTML, replacing data parameters

```html
<div class="coinpaprika-currency-widget-2546354" 
     data-primary-currency="USD" 
     data-currency="btc-bitcoin" 
     data-version="extended" 
     data-update-active="false" 
     data-update-timeout="30s"></div>
<script type="text/javascript" src="https://coinpaprika.com/widget/currency_widget.js"></script>
```

#### Via npm

`npm install coinpaprika-widget-currency`

Then add this to your HTML, replacing data parameters

```html
<div class="coinpaprika-currency-widget-2546354" 
     data-primary-currency="USD" 
     data-currency="btc-bitcoin" 
     data-version="extended" 
     data-update-active="false" 
     data-update-timeout="30s"></div>
<script src="../node_modules/github-card/dist/widget.js"></script>
```

#### Via bower

`bower install coinpaprika-widget-currency`

Then add this to your HTML, replacing data parameters

```html
<div class="coinpaprika-currency-widget-2546354" 
     data-primary-currency="USD" 
     data-currency="btc-bitcoin" 
     data-version="extended" 
     data-update-active="false" 
     data-update-timeout="30s"></div>
<script src="/bower_components/coinpaprika-widget-currency/dist/widget.js"></script>
```

#### Using multiple widgets in same page

```html
<div class="coinpaprika-currency-widget-2546354" 
     data-primary-currency="USD" 
     data-currency="btc-bitcoin" 
     data-version="extended" 
     data-update-active="false"></div>
<div class="coinpaprika-currency-widget-2546354" 
     data-primary-currency="USD" 
     data-currency="xrp-xrp" 
     data-version="standard" 
     data-update-active="true" 
     data-update-timeout="30s"></div>
<script type="text/javascript" src="https://coinpaprika.com/widget/currency_widget.js"></script>
```
