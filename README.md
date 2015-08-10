# react-openpublish-assets

[![Version](http://img.shields.io/npm/v/react-openpublish-assets.svg)](https://www.npmjs.org/package/react-openpublish-assets)

A React component for querying and rendering OpenPublish assets.

[Working demo](http://react-openpublish-assets.herokuapp.com)

## Install

Install react-openpublish-assets with the following command:
```
  npm install react-openpublish-assets
```

## Usage

To use react-openpublish-assets, require the module:
```javascript
  var Assets = require('react-openpublish-assets');
```
The module requires two parameters: ``` address ``` and ``` network ```.
The following is a sample JSX instantiation:
```javascript
  <Assets address='mjf6CRReqGSyvbgryjE3fbGjptRRfAL7cg' network='testnet' />
```
The ``` address ``` parameter is required. The ``` network ``` parameter is optional. If no ``` network ``` parameter is specified, ``` 'testnet' ``` will be used by default.

## Example

To run the example:
```
  npm start
```
and go to ```localhost:8000``` in your browser.

For a live, working demo on the web, [click here](http://react-openpublish-assets.herokuapp.com).