# [Express-Intl](https://github.com/framled/express-intl)

This library provides Express 4 middleware and helpers for internationalization. The helpers provide a declarative way to format dates, numbers, and string messages with pluralization support.

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install express-intl
```

## Features

* Display numbers with separators.
* Display dates and times correctly.
* Display dates relative to "now".
* Pluralize labels in strings.
* Support for 200+ languages.
* Runs in the browser and Node.js.
* Built on standards.
* compatible with [app-localize-behavior](https://github.com/PolymerElements/app-localize-behavior)

## API

In your express app.js, add the following code

```js
const intl = require('express-intl');
```

### Configure

Create a dictionarie(s) with this estructure

```js
const dictionaries = {
	'en': {
		'hello': 'hello',
		'world': 'world',
		'hello_to_you': 'hello {name}',
	},
	'es': {
		'hello': 'hello',
		'world': 'world',
		'hello_to_you': 'hola {name}'
	}
}

```

and added to the options object

```js
const options = {
  defaultLocale: 'es',
  availableLocales: ['en', 'es'] || Object.keys(dictionaries),
  messages: dictionaries,
  formats: {
    number: {
      EUR: {style: 'currency', currency: 'EUR'},
      USD: {style: 'currency', currency: 'USD'},
    }
  },
};

// Initiate intl on middleware
intl.configure(intlOptions.availableLocales);
app.use(intl(intlOptions));
```


## Usage

```js
// get current locale (eg: 'en' or 'es')
let locale = res.locals.intl.currentLocale;
// get dictionaries
let messages = res.locals.intl.messages[locale];
// access to helpers functions
req.res.locals.intl
intl.get('hello')
```


