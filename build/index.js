'use strict';

var React = require('react');
var xhr = require('xhr');

var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var Panel = require('react-bootstrap/lib/Panel');
var PageHeader = require('react-bootstrap/lib/PageHeader');

var LineChart = require("react-chartjs").Line;
var PieChart = require("react-chartjs").Pie;

var ReactBsTable = require("react-bootstrap-table");
var Table = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;

function datePosts(data, callback) {
  var dateLine = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  var counter = 0;
  var length = data.length - 1;
  data.forEach(function (data) {
    var n = new Date(data.date).getUTCMonth();
    dateLine[n] += 1;
    if (counter === length) {
      callback(dateLine);
    }
    counter++;
  });
}

var Assets = React.createClass({
  displayName: 'Assets',

  getInitialState: function getInitialState() {
    return {
      posts: [],
      loadPosts: true
    };
  },

  getData: function getData(callback) {
    var address = this.props.address;
    var that = this;
    xhr({
      url: 'http://coinvote-testnet.herokuapp.com/getPosts/user?address=' + address,
      headers: {
        "Content-Type": "application/json"
      },
      method: 'GET'
    }, function (err, resp, body) {
      console.log("Received response from server");
      if (!err) {
        var posts = JSON.parse(body).posts;
        var tips = JSON.parse(body).tips;

        var tipsData = [];
        for (var i = 0; i < posts.length; i++) {
          var post = posts[i];
          if (tips[post.sha1] != undefined && tips[post.sha1].length > 0) {
            tips[post.sha1].forEach(function (tip) {
              tipsData.push({
                date: tip.datetime,
                title: post.title
              });
            });
          }
          if (i === posts.length - 1) {
            that.renderStatistics(posts, tipsData);
            that.renderGraph(tipsData);
            that.renderPosts(posts);
            that.setState({ loadPosts: false });
          }
        }
      }
    });
  },

  renderStatistics: function renderStatistics(posts, tipsData) {
    var numPosts = posts.length;
    var numTips = 0;
    var maxTips = 0;

    var counter = 0;
    var that = this;
    tipsData.forEach(function (tips) {
      numTips += 1;
      if (counter === tipsData.length - 1) {
        var i = 0;
        posts.forEach(function (post) {
          if (post.tips > maxTips) {
            maxTips = post.tips;
          }
          if (i === posts.length - 1) {
            var avgTips = 0;
            if (numPosts > 0) {
              avgTips = numTips / numPosts;
            }
            that.setState({
              numPosts: numPosts,
              numTips: numTips,
              maxTips: maxTips,
              avgTips: avgTips
            });
          }
          i++;
        });
      }
      counter++;
    });
  },

  renderGraph: function renderGraph(data) {
    if (data.length > 0) {
      var that = this;
      datePosts(data, function (dataLine) {
        var lineData = {
          labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          datasets: [{
            label: "Tips",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: dataLine
          }]
        };
        that.setState({
          tipLine: React.createElement(LineChart, { data: lineData, options: { responsive: true }, height: '100' })
        });
      });
    }
  },

  renderPosts: function renderPosts(posts) {
    var render = [];
    if (posts.length > 0) {
      for (var i = 0; i < posts.length; i++) {
        var post = posts[i];
        // Be careful how datetime is displayed, table sorts on alphanumerical order.
        var date = new Date(post.datetime).toLocaleString();
        render.push({
          title: post.title,
          tips: post.tips,
          date: date,
          sha1: React.createElement(
            'a',
            { href: "/permalink?sha1=" + post.sha1 },
            React.createElement(
              'div',
              { className: 'table-sha1' },
              post.sha1
            )
          ),
          bitstore: React.createElement(
            'a',
            { href: "https://bitstore-test.blockai.com/" + post.owner + "/sha1/" + post.sha1 },
            'View Content'
          )
        });
        if (i === posts.length - 1) {
          this.setState({
            posts: React.createElement(
              Table,
              { data: render, striped: true, hover: true },
              React.createElement(
                TableHeaderColumn,
                { dataField: 'title', dataSort: true },
                'Title'
              ),
              React.createElement(
                TableHeaderColumn,
                { dataField: 'tips', isKey: true, dataSort: true },
                'Tips'
              ),
              React.createElement(
                TableHeaderColumn,
                { dataField: 'date', dataSort: true },
                'Date'
              ),
              React.createElement(
                TableHeaderColumn,
                { dataField: 'sha1' },
                'SHA1'
              ),
              React.createElement(
                TableHeaderColumn,
                { dataField: 'bitstore' },
                'Bitstore'
              )
            )
          });
        }
      }
    }
  },

  render: function render() {
    if (this.state.loadPosts) {
      this.getData();
    }
    return React.createElement(
      'div',
      { className: 'container' },
      React.createElement(
        Panel,
        null,
        React.createElement(
          'b',
          { style: { fontSize: "25px" } },
          ' ',
          this.props.address + "\'s Assets",
          ' '
        ),
        React.createElement('br', null),
        ' ',
        React.createElement('br', null),
        React.createElement(
          Panel,
          null,
          React.createElement(
            'div',
            { className: 'assetStats' },
            React.createElement(
              'p',
              null,
              'Total Posts: ',
              React.createElement(
                'b',
                null,
                this.state.numPosts
              )
            ),
            React.createElement(
              'p',
              null,
              'Total Tips: ',
              React.createElement(
                'b',
                null,
                this.state.numTips
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'assetStats' },
            React.createElement(
              'p',
              null,
              'Average Tips per Post: ',
              React.createElement(
                'b',
                null,
                this.state.avgTips
              )
            ),
            React.createElement(
              'p',
              null,
              'Record Tips on a Post: ',
              React.createElement(
                'b',
                null,
                this.state.maxTips
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'assetStats' },
            React.createElement(
              'p',
              null,
              'Total Revenue: ',
              React.createElement(
                'b',
                null,
                (this.state.numTips * .00013).toFixed(5)
              )
            ),
            React.createElement(
              'p',
              null,
              'Total Bitstore Costs: ',
              React.createElement(
                'b',
                null,
                (this.state.numPosts * .000001 + .0001).toFixed(5)
              )
            )
          )
        ),
        React.createElement(
          Panel,
          null,
          React.createElement(
            'center',
            null,
            this.state.tipLine
          )
        ),
        this.state.posts
      )
    );
  }
});

module.exports = Assets;