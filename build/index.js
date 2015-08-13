'use strict';

var React = require('react');
var LineChart = require("react-chartjs").Line;

var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var Grid = require('react-bootstrap/lib/Grid');
var Panel = require('react-bootstrap/lib/Panel');
var Table = require('react-bootstrap/lib/Table');
var Button = require('react-bootstrap/lib/Button');
var TabPane = require('react-bootstrap/lib/TabPane');
var Glyphicon = require('react-bootstrap/lib/Glyphicon');
var TabbedArea = require('react-bootstrap/lib/TabbedArea');
var ButtonGroup = require('react-bootstrap/lib/ButtonGroup');

var BitstoreContent = require('./bitstore-content.js');

function initialize(posts, callback) {
  var i = 0;
  var j = 0;
  posts.forEach(function (post) {
    j += post.tipCount;
    if (++i === posts.length) callback(j);
  });
}

function buildGraph(posts, sort, callback) {
  var dateLine = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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
      data: dateLine
    }]
  };
  if (posts != undefined && posts.length > 0) {
    var i = 0;
    var thisYear = new Date().getUTCFullYear();
    if (sort === 'posts') {
      posts.forEach(function (post) {
        var postDate = new Date(post.created_at);
        if (postDate.getUTCFullYear() === thisYear) dateLine[postDate.getUTCMonth()] += 1;
        if (++i === posts.length) callback(lineData);
      });
    } else if (sort === 'tips') {
      posts.forEach(function (post) {
        if (post.tipCount > 0) {
          var j = 0;
          post.tips.forEach(function (tip) {
            var tipDate = new Date(tip.created_at);
            if (tipDate.getUTCFullYear() === thisYear) dateLine[tipDate.getUTCMonth()] += 1;
            if (++j === post.tipCount) i++;
            if (i === posts.length) callback(lineData);
          });
        } else if (++i === posts.length) callback(lineData);
      });
    } else if (sort === 'profit') {
      posts.forEach(function (post) {
        if (post.tipCount > 0) {
          var j = 0;
          var postDate = new Date(post.created_at);
          if (postDate.getUTCFullYear() === thisYear) dateLine[postDate.getUTCMonth()] -= 0.000001;
          post.tips.forEach(function (tip) {
            var tipDate = new Date(tip.created_at);
            if (tipDate.getUTCFullYear() === thisYear) dateLine[tipDate.getUTCMonth()] += 0.00013;
            if (++j === post.tipCount) i++;
            if (i === posts.length) callback(lineData);
          });
        } else if (++i === posts.length) callback(lineData);
      });
    }
  } else callback(lineData);
}

function postsStatistics(posts, callback) {
  var today = new Date();
  var sevenDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  var thirtyDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
  var ninetyDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90);

  var sevenCount = 0;
  var thirtyCount = 0;
  var ninetyCount = 0;
  var textCount = 0;
  var imageCount = 0;
  var audioCount = 0;
  var otherCount = 0;

  if (posts != undefined && posts.length > 0) {
    var i = 0;
    posts.forEach(function (post) {
      var postDay = new Date(post.created_at);
      var postType = post.type;
      if (postDay > sevenDays) sevenCount += 1;
      if (postDay > thirtyDays) thirtyCount += 1;
      if (postDay > ninetyDays) ninetyCount += 1;
      if (postType.substring(0, 4) === 'text') textCount += 1;else if (postType.substring(0, 5) === 'image') imageCount += 1;else if (postType.substring(0, 5) === 'audio') audioCount += 1;else otherCount += 1;
      if (++i === posts.length) callback(sevenCount, thirtyCount, ninetyCount, textCount, imageCount, audioCount, otherCount);
    });
  } else callback(sevenCount, thirtyCount, ninetyCount, textCount, imageCount, audioCount, otherCount);
}

function tipsStatistics(posts, numTips, callback) {
  var avgTips = 0;
  var maxTips = 0;
  var sevenCount = 0;
  var thirtyCount = 0;
  var ninetyCount = 0;
  var allCount = numTips;

  if (posts.length > 0) avgTips = numTips / posts.length;

  var today = new Date();
  var sevenDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  var thirtyDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
  var ninetyDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90);

  if (posts != undefined && posts.length > 0) {
    var i = 0;
    posts.forEach(function (post) {
      var j = 0;
      if (post.tipCount > maxTips) maxTips = post.tipCount;
      if (post.tipCount > 0) {
        post.tips.forEach(function (tip) {
          var tipDay = new Date(tip.created_at);
          if (tipDay > sevenDays) sevenCount += 1;
          if (tipDay > thirtyDays) thirtyCount += 1;
          if (tipDay > ninetyDays) ninetyCount += 1;
          if (++j === post.tipCount) i++;
          if (i === posts.length) callback(avgTips, maxTips, sevenCount, thirtyCount, ninetyCount, allCount);
        });
      } else if (++i === posts.length) callback(avgTips, maxTips, sevenCount, thirtyCount, ninetyCount, allCount);
    });
  } else callback(avgTips, maxTips, sevenCount, thirtyCount, ninetyCount, allCount);
}

function profitsStatistics(posts, numTips, callback) {
  var numPosts = posts.length;
  var revenues = (numTips * .00013).toFixed(5);
  var costs = (numPosts * .000001).toFixed(5);
  callback(revenues, costs);
}

function sortByTitle(posts, sort, callback) {
  if (posts !== undefined && posts.length > 0) {
    if (sort === "up") {
      callback(posts.sort(function (a, b) {
        var titleA = a.name.toUpperCase();
        var titleB = b.name.toUpperCase();
        return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
      }));
    } else if (sort === "down") {
      callback(posts.sort(function (a, b) {
        var titleA = a.name.toUpperCase();
        var titleB = b.name.toUpperCase();
        return titleA < titleB ? 1 : titleA > titleB ? -1 : 0;
      }));
    }
  } else callback([]);
}

function sortByTips(posts, sort, callback) {
  if (posts !== undefined && posts.length > 0) {
    if (sort === "up") {
      callback(posts.sort(function (a, b) {
        var tipsA = a.tipCount;
        var tipsB = b.tipCount;
        return tipsA < tipsB ? 1 : tipsA > tipsB ? -1 : 0;
      }));
    } else if (sort === "down") {
      callback(posts.sort(function (a, b) {
        var tipsA = a.tipCount;
        var tipsB = b.tipCount;
        return tipsA < tipsB ? -1 : tipsA > tipsB ? 1 : 0;
      }));
    }
  } else callback([]);
}

function sortByDate(posts, sort, callback) {
  if (posts !== undefined && posts.length > 0) {
    if (sort === "up") {
      callback(posts.sort(function (a, b) {
        var dateA = new Date(a.created_at).toLocaleString();
        var dateB = new Date(b.created_at).toLocaleString();
        return dateA < dateB ? 1 : dateA > dateB ? -1 : 0;
      }));
    } else if (sort === "down") {
      callback(posts.sort(function (a, b) {
        var dateA = new Date(a.created_at).toLocaleString();
        var dateB = new Date(b.created_at).toLocaleString();
        return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
      }));
    }
  } else callback([]);
}

function sortBySHA1(posts, sort, callback) {
  if (posts !== undefined && posts.length > 0) {
    if (sort === "up") {
      callback(posts.sort(function (a, b) {
        var sha1A = a.sha1;
        var sha1B = b.sha1;
        return sha1A < sha1B ? -1 : sha1A > sha1B ? 1 : 0;
      }));
    } else if (sort === "down") {
      callback(posts.sort(function (a, b) {
        var sha1A = a.sha1;
        var sha1B = b.sha1;
        return sha1A < sha1B ? 1 : sha1A > sha1B ? -1 : 0;
      }));
    }
  } else callback([]);
}

function buildTable(posts, callback) {
  var renderPosts = [];
  if (posts != undefined && posts.length > 0) {
    var i = 0;
    posts.forEach(function (post) {
      renderPosts.push(React.createElement(
        'tr',
        { key: i },
        React.createElement(
          'td',
          null,
          React.createElement(
            'center',
            null,
            React.createElement(BitstoreContent, { tips: post.tips, post: post, src: post.uri, href: post.uri, preview: true })
          )
        ),
        React.createElement(
          'td',
          null,
          React.createElement(BitstoreContent, { tips: post.tips, post: post, src: post.uri, href: post.uri, text: true })
        ),
        React.createElement(
          'td',
          null,
          React.createElement(
            'center',
            null,
            post.tipCount
          )
        ),
        React.createElement(
          'td',
          null,
          new Date(post.created_at).toLocaleString()
        ),
        React.createElement(
          'td',
          null,
          React.createElement(
            'a',
            { href: post.uri },
            post.sha1,
            ' '
          )
        )
      ));
      if (++i === posts.length) callback(renderPosts);
    });
  } else callback(renderPosts);
}

function buildVisual(posts, callback) {
  var visual = [];
  if (posts != undefined && posts.length > 0) {
    for (var i = 0; i < posts.length; i++) {
      var post = posts[i];
      visual.push(React.createElement(BitstoreContent, { key: i, tips: post.tips, post: post, src: post.uri, href: post.uri, visual: true }));
    }
    callback(visual);
  } else callback(visual);
}

var Assets = React.createClass({
  displayName: 'Assets',

  getInitialState: function getInitialState() {
    return {};
  },

  componentDidMount: function componentDidMount() {
    if (this.props.address === undefined) console.log('error: No address parameter is specified.');
    var openpublishState = require('openpublish-state')({
      network: this.props.network
    });
    var that = this;
    openpublishState.findDocsByUser({
      address: this.props.address,
      includeTips: true
    }, function (err, opendocs) {
      if (err) console.log("error: " + err);else {
        initialize(opendocs, function (numTips) {
          that.renderPosts(opendocs, function (sortedPosts) {
            that.renderVisual(opendocs, function (visual) {
              that.setState({
                title: React.createElement(
                  'th',
                  null,
                  'Title ',
                  React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "title-up") })
                ),
                tips: React.createElement(
                  'th',
                  null,
                  'Tips ',
                  React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "tips-up") })
                ),
                date: React.createElement(
                  'th',
                  null,
                  'Date ',
                  React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "date-up") })
                ),
                sha1: React.createElement(
                  'th',
                  null,
                  'SHA1 ',
                  React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "sha1-up") })
                ),
                visual: visual,
                posts: sortedPosts,
                rawPosts: opendocs,
                numTips: numTips
              });
              that.renderStatistics('tips');
            });
          });
        });
      }
    });
  },

  renderPosts: function renderPosts(posts, callback) {
    sortByDate(posts, 'up', function (sortedPosts) {
      buildTable(sortedPosts, function (renderPosts) {
        callback(renderPosts);
      });
    });
  },

  renderVisual: function renderVisual(posts, callback) {
    buildVisual(posts, function (visual) {
      callback(visual);
    });
  },

  renderStatistics: function renderStatistics(sort) {
    var posts = this.state.rawPosts;
    var numPosts = posts.length;
    var numTips = this.state.numTips;
    var numProfits = 0.0;
    if (numPosts > 0 || numTips > 0) numProfits = (numTips * .00013 - (numPosts * .000001 + .0001)).toFixed(5);
    var that = this;
    if (sort === 'posts') {
      buildGraph(posts, 'posts', function (lineData) {
        postsStatistics(posts, function (sevenCount, thirtyCount, ninetyCount, textCount, imageCount, audioCount, otherCount) {
          var statistics = React.createElement(
            'div',
            null,
            React.createElement(
              ButtonGroup,
              { className: 'assets-buttons' },
              React.createElement(
                Button,
                { onClick: that.renderStatistics.bind(null, 'posts'), active: true },
                React.createElement(
                  'center',
                  null,
                  React.createElement(
                    'p',
                    null,
                    'Total Posts'
                  ),
                  React.createElement(
                    'h1',
                    null,
                    numPosts
                  )
                )
              ),
              React.createElement(
                Button,
                { onClick: that.renderStatistics.bind(null, 'tips') },
                React.createElement(
                  'center',
                  null,
                  React.createElement(
                    'p',
                    null,
                    'Total Tips'
                  ),
                  React.createElement(
                    'h1',
                    null,
                    numTips
                  )
                )
              ),
              React.createElement(
                Button,
                { onClick: that.renderStatistics.bind(null, 'profit') },
                React.createElement(
                  'center',
                  null,
                  React.createElement(
                    'p',
                    null,
                    'Total Profit'
                  ),
                  React.createElement(
                    'h1',
                    null,
                    '~ ',
                    numProfits,
                    ' BTC'
                  )
                )
              )
            ),
            React.createElement('hr', null),
            React.createElement(
              'center',
              null,
              React.createElement(LineChart, { data: lineData, options: { responsive: true }, height: '100' })
            ),
            React.createElement('hr', null),
            React.createElement(
              Row,
              null,
              React.createElement(
                Col,
                { md: 3, lg: 3, xl: 3 },
                React.createElement(
                  'center',
                  null,
                  React.createElement(
                    'p',
                    null,
                    '7-Day Post Count: ',
                    React.createElement(
                      'b',
                      null,
                      sevenCount
                    )
                  ),
                  React.createElement(
                    'p',
                    null,
                    '30-Day Post Count: ',
                    React.createElement(
                      'b',
                      null,
                      thirtyCount
                    )
                  )
                )
              ),
              React.createElement(
                Col,
                { md: 3, lg: 3, xl: 3 },
                React.createElement(
                  'center',
                  null,
                  React.createElement(
                    'p',
                    null,
                    '90-Day Post Count: ',
                    React.createElement(
                      'b',
                      null,
                      ninetyCount
                    )
                  ),
                  React.createElement(
                    'p',
                    null,
                    'All-Time Post Count: ',
                    React.createElement(
                      'b',
                      null,
                      numPosts
                    )
                  )
                )
              ),
              React.createElement(
                Col,
                { md: 3, lg: 3, xl: 3 },
                React.createElement(
                  'center',
                  null,
                  React.createElement(
                    'p',
                    null,
                    'Text Posts: ',
                    React.createElement(
                      'b',
                      null,
                      textCount
                    )
                  ),
                  React.createElement(
                    'p',
                    null,
                    'Image Posts: ',
                    React.createElement(
                      'b',
                      null,
                      imageCount
                    )
                  )
                )
              ),
              React.createElement(
                Col,
                { md: 3, lg: 3, xl: 3 },
                React.createElement(
                  'center',
                  null,
                  React.createElement(
                    'p',
                    null,
                    'Audio Posts: ',
                    React.createElement(
                      'b',
                      null,
                      audioCount
                    )
                  ),
                  React.createElement(
                    'p',
                    null,
                    'Other Posts: ',
                    React.createElement(
                      'b',
                      null,
                      otherCount
                    )
                  )
                )
              )
            ),
            React.createElement('hr', null)
          );
          that.setState({
            statistics: statistics
          });
        });
      });
    } else if (sort === 'tips') {
      buildGraph(posts, 'tips', function (lineData) {
        tipsStatistics(posts, that.state.numTips, function (avgTips, maxTips, sevenCount, thirtyCount, ninetyCount, allCount) {
          var statistics = React.createElement(
            'div',
            null,
            React.createElement(
              ButtonGroup,
              { className: 'assets-buttons' },
              React.createElement(
                Button,
                { onClick: that.renderStatistics.bind(null, 'posts') },
                React.createElement(
                  'div',
                  { className: 'word-wrap' },
                  React.createElement(
                    'center',
                    null,
                    React.createElement(
                      'p',
                      null,
                      'Total Posts'
                    ),
                    React.createElement(
                      'h1',
                      null,
                      numPosts
                    )
                  )
                )
              ),
              React.createElement(
                Button,
                { onClick: that.renderStatistics.bind(null, 'tips'), active: true },
                React.createElement(
                  'div',
                  { className: 'word-wrap' },
                  React.createElement(
                    'center',
                    null,
                    React.createElement(
                      'p',
                      null,
                      'Total Tips'
                    ),
                    React.createElement(
                      'h1',
                      null,
                      numTips
                    )
                  )
                )
              ),
              React.createElement(
                Button,
                { onClick: that.renderStatistics.bind(null, 'profit') },
                React.createElement(
                  'div',
                  { className: 'word-wrap' },
                  React.createElement(
                    'center',
                    null,
                    React.createElement(
                      'p',
                      null,
                      'Total Profit'
                    ),
                    React.createElement(
                      'h1',
                      null,
                      '~ ',
                      numProfits,
                      ' BTC'
                    )
                  )
                )
              )
            ),
            React.createElement('hr', null),
            React.createElement(
              'center',
              null,
              React.createElement(LineChart, { data: lineData, options: { responsive: true }, height: '100' })
            ),
            React.createElement('hr', null),
            React.createElement(
              Row,
              null,
              React.createElement(
                Col,
                { md: 4, lg: 4, xl: 4 },
                React.createElement(
                  'center',
                  null,
                  React.createElement(
                    'p',
                    null,
                    '7-Day Tip Count: ',
                    React.createElement(
                      'b',
                      null,
                      sevenCount
                    )
                  ),
                  React.createElement(
                    'p',
                    null,
                    '30-Day Tip Count: ',
                    React.createElement(
                      'b',
                      null,
                      thirtyCount
                    )
                  )
                )
              ),
              React.createElement(
                Col,
                { md: 4, lg: 4, xl: 4 },
                React.createElement(
                  'center',
                  null,
                  React.createElement(
                    'p',
                    null,
                    '7-Day Tip Count: ',
                    React.createElement(
                      'b',
                      null,
                      ninetyCount
                    )
                  ),
                  React.createElement(
                    'p',
                    null,
                    '30-Day Tip Count: ',
                    React.createElement(
                      'b',
                      null,
                      allCount
                    )
                  )
                )
              ),
              React.createElement(
                Col,
                { md: 4, lg: 4, xl: 4 },
                React.createElement(
                  'center',
                  null,
                  React.createElement(
                    'p',
                    null,
                    'Average Number of Tips per Post: ',
                    React.createElement(
                      'b',
                      null,
                      avgTips
                    )
                  ),
                  React.createElement(
                    'p',
                    null,
                    'Record Number of Tips on a Post: ',
                    React.createElement(
                      'b',
                      null,
                      maxTips
                    )
                  )
                )
              )
            ),
            React.createElement('hr', null)
          );
          that.setState({
            statistics: statistics
          });
        });
      });
    } else if (sort === 'profit') {
      buildGraph(posts, 'profit', function (lineData) {
        profitsStatistics(posts, that.state.numTips, function (revenues, costs) {
          var statistics = React.createElement(
            'div',
            null,
            React.createElement(
              ButtonGroup,
              { className: 'assets-buttons' },
              React.createElement(
                Button,
                { onClick: that.renderStatistics.bind(null, 'posts') },
                React.createElement(
                  'center',
                  null,
                  React.createElement(
                    'p',
                    null,
                    'Total Posts'
                  ),
                  React.createElement(
                    'h1',
                    null,
                    numPosts
                  )
                )
              ),
              React.createElement(
                Button,
                { onClick: that.renderStatistics.bind(null, 'tips') },
                React.createElement(
                  'center',
                  null,
                  React.createElement(
                    'p',
                    null,
                    'Total Tips'
                  ),
                  React.createElement(
                    'h1',
                    null,
                    numTips
                  )
                )
              ),
              React.createElement(
                Button,
                { onClick: that.renderStatistics.bind(null, 'profit'), active: true },
                React.createElement(
                  'center',
                  null,
                  React.createElement(
                    'p',
                    null,
                    'Total Profit'
                  ),
                  React.createElement(
                    'h1',
                    null,
                    '~ ',
                    numProfits,
                    ' BTC'
                  )
                )
              )
            ),
            React.createElement('hr', null),
            React.createElement(
              'center',
              null,
              React.createElement(LineChart, { data: lineData, options: { responsive: true }, height: '100' })
            ),
            React.createElement('hr', null),
            React.createElement(
              Row,
              null,
              React.createElement(
                Col,
                { md: 3, lg: 3, xl: 3 },
                React.createElement(
                  'center',
                  null,
                  React.createElement(
                    'p',
                    null,
                    'Total Revenue: ',
                    React.createElement(
                      'b',
                      null,
                      revenues
                    )
                  ),
                  React.createElement(
                    'p',
                    null,
                    'Total Bitstore Costs: ',
                    React.createElement(
                      'b',
                      null,
                      costs
                    )
                  )
                )
              )
            ),
            React.createElement('hr', null)
          );
          that.setState({
            statistics: statistics
          });
        });
      });
    }
  },

  sortPosts: function sortPosts(sort) {
    var posts = this.state.rawPosts;
    var that = this;
    if (sort === 'title-up') {
      sortByTitle(posts, 'up', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({
            posts: renderPosts,
            title: React.createElement(
              'th',
              null,
              'Title ',
              React.createElement('img', { className: 'up-caret', onClick: that.sortPosts.bind(null, "title-down") })
            ),
            tips: React.createElement(
              'th',
              null,
              'Tips ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "tips-up") })
            ),
            date: React.createElement(
              'th',
              null,
              'Date ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "date-up") })
            ),
            sha1: React.createElement(
              'th',
              null,
              'SHA1 ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "sha1-up") })
            )
          });
        });
      });
    } else if (sort === 'title-down') {
      sortByTitle(posts, 'down', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({
            posts: renderPosts,
            title: React.createElement(
              'th',
              null,
              'Title ',
              React.createElement('img', { className: 'down-caret', onClick: that.sortPosts.bind(null, "title-up") })
            ),
            tips: React.createElement(
              'th',
              null,
              'Tips ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "tips-up") })
            ),
            date: React.createElement(
              'th',
              null,
              'Date ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "date-up") })
            ),
            sha1: React.createElement(
              'th',
              null,
              'SHA1 ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "sha1-up") })
            )
          });
        });
      });
    } else if (sort === 'tips-up') {
      sortByTips(posts, 'up', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({
            posts: renderPosts,
            title: React.createElement(
              'th',
              null,
              'Title ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "title-up") })
            ),
            tips: React.createElement(
              'th',
              null,
              'Tips ',
              React.createElement('img', { className: 'up-caret', onClick: that.sortPosts.bind(null, "tips-down") })
            ),
            date: React.createElement(
              'th',
              null,
              'Date ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "date-up") })
            ),
            sha1: React.createElement(
              'th',
              null,
              'SHA1 ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "sha1-up") })
            )
          });
        });
      });
    } else if (sort === 'tips-down') {
      sortByTips(posts, 'down', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({
            posts: renderPosts,
            title: React.createElement(
              'th',
              null,
              'Title ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "title-up") })
            ),
            tips: React.createElement(
              'th',
              null,
              'Tips ',
              React.createElement('img', { className: 'down-caret', onClick: that.sortPosts.bind(null, "tips-up") })
            ),
            date: React.createElement(
              'th',
              null,
              'Date ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "date-up") })
            ),
            sha1: React.createElement(
              'th',
              null,
              'SHA1 ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "sha1-up") })
            )
          });
        });
      });
    } else if (sort === 'date-up') {
      sortByDate(posts, 'up', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({
            posts: renderPosts,
            title: React.createElement(
              'th',
              null,
              'Title ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "title-up") })
            ),
            tips: React.createElement(
              'th',
              null,
              'Tips ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "tips-up") })
            ),
            date: React.createElement(
              'th',
              null,
              'Date ',
              React.createElement('img', { className: 'up-caret', onClick: that.sortPosts.bind(null, "date-down") })
            ),
            sha1: React.createElement(
              'th',
              null,
              'SHA1 ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "sha1-up") })
            )
          });
        });
      });
    } else if (sort === 'date-down') {
      sortByDate(posts, 'down', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({
            posts: renderPosts,
            title: React.createElement(
              'th',
              null,
              'Title ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "title-up") })
            ),
            tips: React.createElement(
              'th',
              null,
              'Tips ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "tips-up") })
            ),
            date: React.createElement(
              'th',
              null,
              'Date ',
              React.createElement('img', { className: 'down-caret', onClick: that.sortPosts.bind(null, "date-up") })
            ),
            sha1: React.createElement(
              'th',
              null,
              'SHA1 ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "sha1-up") })
            )
          });
        });
      });
    } else if (sort === 'sha1-up') {
      sortBySHA1(posts, 'up', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({
            posts: renderPosts,
            title: React.createElement(
              'th',
              null,
              'Title ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "title-up") })
            ),
            tips: React.createElement(
              'th',
              null,
              'Tips ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "tips-up") })
            ),
            date: React.createElement(
              'th',
              null,
              'Date ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "date-up") })
            ),
            sha1: React.createElement(
              'th',
              null,
              'SHA1 ',
              React.createElement('img', { className: 'up-caret', onClick: that.sortPosts.bind(null, "sha1-down") })
            )
          });
        });
      });
    } else if (sort === 'sha1-down') {
      sortBySHA1(posts, 'down', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({
            posts: renderPosts,
            title: React.createElement(
              'th',
              null,
              'Title ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "title-up") })
            ),
            tips: React.createElement(
              'th',
              null,
              'Tips ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "tips-up") })
            ),
            date: React.createElement(
              'th',
              null,
              'Date ',
              React.createElement('img', { className: 'both-caret', onClick: that.sortPosts.bind(null, "date-up") })
            ),
            sha1: React.createElement(
              'th',
              null,
              'SHA1 ',
              React.createElement('img', { className: 'down-caret', onClick: that.sortPosts.bind(null, "sha1-up") })
            )
          });
        });
      });
    }
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: 'container' },
      React.createElement(
        Panel,
        { header: React.createElement(
            'b',
            { style: { fontSize: "25px" } },
            ' ',
            this.props.address + "\'s Assets",
            ' '
          ) },
        React.createElement(
          TabbedArea,
          { defaultActiveKey: 1 },
          React.createElement(
            TabPane,
            { eventKey: 1, tab: 'Overview' },
            React.createElement('br', null),
            this.state.statistics
          ),
          React.createElement(
            TabPane,
            { eventKey: 2, tab: 'Line' },
            React.createElement(
              Table,
              { striped: true, hover: true, responsive: true },
              React.createElement(
                'thead',
                null,
                React.createElement(
                  'tr',
                  null,
                  React.createElement('th', null),
                  this.state.title,
                  this.state.tips,
                  this.state.date,
                  this.state.sha1
                )
              ),
              React.createElement(
                'tbody',
                null,
                this.state.posts
              )
            )
          ),
          React.createElement(
            TabPane,
            { eventKey: 3, tab: 'Visual' },
            React.createElement(
              'div',
              null,
              React.createElement('br', null),
              this.state.visual
            )
          )
        )
      )
    );
  }
});

module.exports = Assets;