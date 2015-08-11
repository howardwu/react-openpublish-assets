# react-openpublish-assets

[![Version](http://img.shields.io/npm/v/react-openpublish-assets.svg)](https://www.npmjs.org/package/react-openpublish-assets)

A React component for querying and rendering OpenPublish assets. [OpenPublish](https://github.com/blockai/openpublish) is a publishing protocol for registering media as a digital asset on the Bitcoin blockchain. The OpenPublish protocol allows claiming ownership over a digital asset that can be used by other products to represent a limited and non-exclusive copyright of this document. Assets published through OpenPublish on [coinvote](http://coinvote.herokuapp.com) and [coinvote-testnet](http://coinvote-testnet.herokuapp.com) are available for view on react-openpublish-assets. 

[Working demo](http://react-openpublish-assets.herokuapp.com)

## Install

Install react-openpublish-assets with the following command:
```
  npm install react-openpublish-assets --save
```

## Usage

To use react-openpublish-assets, require the module:
```javascript
  var Assets = require('react-openpublish-assets');
```
The module requires two parameters: ``` address ``` and ``` network ```. The ``` address ``` parameter is required. The ``` network ``` parameter is optional. If no ``` network ``` parameter is specified, ``` 'testnet' ``` will be used by default. The following are sample JSX Instantiations:
```javascript
  // Mainnet: http://coinvote.herokuapp.com
  <Assets address='1HUTmSsFp9Rg4FYRftp85GGyZFEndZSoeq' network='mainnet' />
```
```javascript
  // Testnet: http://coinvote-testnet.herokuapp.com
  <Assets address='mjf6CRReqGSyvbgryjE3fbGjptRRfAL7cg' network='testnet' />
```

## Example

In ```./example/example.js```, the ```address``` and ```network``` can be changed to any valid coinvote or coinvote-testnet account.

To see the provided example, run the following command to install the dependencies:
```
  npm install
```
Then, run:
```
  npm start
```
and go to ```localhost:5000``` in your browser.

For a live, working demo on the web, [click here](http://react-openpublish-assets.herokuapp.com).

## Development

To develop on react-openpublish-assets, run the following command:
```
  npm start
```