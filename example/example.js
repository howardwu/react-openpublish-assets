var React = require('react');

var OpenPublishAssets = require('../src');

// var address = 'mjf6CRReqGSyvbgryjE3fbGjptRRfAL7cg';
var address = 'mzWsmPCEx1SSmCkxzJXYG5GNUCPUMhT2vC';

if (window.location.search.split("?address=") && window.location.search.split("?address=")[1]) {
  address = window.location.search.split("?address=")[1];
}

React.render(
  React.createElement(OpenPublishAssets, { address: address }),
  document.getElementById('example')
);
