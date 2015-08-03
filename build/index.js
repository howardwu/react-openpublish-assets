'use strict';

var React = require('react');
var openpublishState = require('openpublish-state');
var xhr = require('xhr');
var LineChart = require("react-chartjs").Line;
var PieChart = require("react-chartjs").Pie;

var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var Panel = require('react-bootstrap/lib/Panel');
var Table = require('react-bootstrap/lib/Table');
var PageHeader = require('react-bootstrap/lib/PageHeader');

function datePosts(data, callback) {
  var dateLine = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  var counter = 0;
  var length = data.length - 1;
  data.forEach(function (data) {
    var n = new Date(data.date).getUTCMonth();
    dateLine[n] += data.tips;
    if (counter === length) {
      callback(dateLine);
    }
    counter++;
  });
}

function piePosts(data, callback) {
  var pieData = [];

  var colors = [["#f44336", "#e57373"], ["#E91E63", "#F06292"], ["#9C27B0", "#BA68C8"], ["#673AB7", "#9575CD"], ["#3F51B5", "#7986CB"], ["#2196F3", "#64B5F6"], ["#03A9F4", "#4FC3F7"], ["#00BCD4", "#4DD0E1"], ["#009688", "#4DB6AC"], ["#4CAF50", "#81C784"], ["#8BC34A", "#AED581"], ["#CDDC39", "#DCE775"], ["#FFEB3B", "#FFF176"], ["#FFC107", "#FFD54F"], ["#FFD54F", "#FFB74D"], ["#FF5722", "#FF8A65"]];
  var counter = 0;
  var length = data.length - 1;

  data.forEach(function (data) {
    pieData.push({
      value: data.tips,
      color: colors[counter % 16][0],
      highlight: colors[counter % 16][1],
      label: data.title
    });
    if (counter === length) {
      callback(pieData);
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

  renderPosts: function renderPosts() {
    var that = this;
    this.posts(function (posts) {
      var render = [];
      var data = [];
      if (posts.length > 0) {
        for (var i = 0; i < posts.length; i++) {
          var post = posts[i];
          data.push({
            date: post.datetime,
            title: post.title,
            tips: post.tips
          });
          render.push(React.createElement(
            'tr',
            { key: i },
            React.createElement(
              'td',
              null,
              React.createElement(
                'a',
                { href: "/permalink?sha1=" + post.sha1 },
                post.title
              )
            ),
            React.createElement(
              'td',
              null,
              post.tips
            ),
            React.createElement(
              'td',
              null,
              post.datetime
            ),
            React.createElement(
              'td',
              null,
              React.createElement(
                'a',
                { href: "/permalink?sha1=" + post.sha1 },
                post.sha1,
                ' '
              )
            ),
            React.createElement(
              'td',
              null,
              React.createElement(
                'a',
                { href: "https://bitstore-test.blockai.com/" + post.owner + "/sha1/" + post.sha1 },
                'View Content'
              )
            )
          ));
          if (i === posts.length - 1) {
            that.renderStatistics(data);
            that.renderGraphs(data);
            that.setState({ posts: render, loadPosts: false });
          }
        }
      }
    });
  },

  renderStatistics: function renderStatistics(data) {
    var numPosts = data.length;
    var numTips = 0;
    var maxTips = 0;

    var counter = 0;
    var length = data.length - 1;
    var that = this;
    data.forEach(function (data) {
      numTips += data.tips;
      if (data.tips > maxTips) {
        maxTips = data.tips;
      }
      if (counter === length) {
        that.setState({
          numPosts: numPosts,
          numTips: numTips,
          maxTips: maxTips,
          avgTips: numTips / numPosts
        });
      }
      counter++;
    });
  },

  renderGraphs: function renderGraphs(data) {
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
        piePosts(data, function (dataPie) {
          that.setState({
            tipLine: React.createElement(LineChart, { data: lineData, options: { responsive: true }, width: '750', height: '350' }),
            tipPie: React.createElement(PieChart, { data: dataPie, width: '250', height: '250' })
          });
        });
      });
    }
  },

  posts: function posts(callback) {
    var address = this.props.user_id;
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
        callback(posts);
      }
    });
    callback([]);
  },

  render: function render() {
    if (this.state.loadPosts) {
      this.renderPosts();
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
          this.props.user_id + "\'s Assets",
          ' '
        ),
        React.createElement('br', null),
        ' ',
        React.createElement('br', null),
        React.createElement(
          Panel,
          { className: 'assetStatsPanel' },
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
          Row,
          null,
          React.createElement(
            Col,
            { md: 6, lg: 6, xl: 6 },
            React.createElement(
              'center',
              null,
              this.state.tipLine
            )
          ),
          React.createElement(
            Col,
            { md: 6, lg: 6, xl: 6 },
            React.createElement(
              'center',
              null,
              this.state.tipPie
            )
          )
        ),
        React.createElement(
          Table,
          { responsive: true },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              React.createElement(
                'th',
                null,
                'Title'
              ),
              React.createElement(
                'th',
                null,
                'Tips'
              ),
              React.createElement(
                'th',
                null,
                'Date'
              ),
              React.createElement(
                'th',
                null,
                'SHA1'
              ),
              React.createElement(
                'th',
                null,
                'Bitstore'
              )
            )
          ),
          React.createElement(
            'tbody',
            null,
            this.state.posts
          )
        )
      )
    );
  }
});

module.exports = Assets;