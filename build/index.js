'use strict';

var React = require('react');
var xhr = require('xhr');

var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var Panel = require('react-bootstrap/lib/Panel');
var Table = require('react-bootstrap/lib/Table');
var Button = require('react-bootstrap/lib/Button');
var Glyphicon = require('react-bootstrap/lib/Glyphicon');
var PageHeader = require('react-bootstrap/lib/PageHeader');
var ButtonGroup = require('react-bootstrap/lib/ButtonGroup');

var LineChart = require("react-chartjs").Line;

function initialize(posts, tips, callback) {
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
      callback(posts, tipsData);
    }
  }
}

function buildGraph(posts, tips, sort, callback) {
  var dateLine = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var thisYear = new Date().getUTCFullYear();
  if (sort === 'posts') {
    var i = 0;
    posts.forEach(function (post) {
      var postYear = new Date(post.datetime).getUTCFullYear();
      if (postYear === thisYear) {
        var n = new Date(post.datetime).getUTCMonth();
        dateLine[n] += 1;
      }
      if (i === posts.length - 1) {
        var lineData = {
          labels: labels,
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
        callback(lineData);
      }
      i++;
    });
  } else if (sort === 'tips') {
    var counter = 0;
    tips.forEach(function (tip) {
      var tipYear = new Date(tip.date).getUTCFullYear();
      if (tipYear === thisYear) {
        var n = new Date(tip.date).getUTCMonth();
        dateLine[n] += 1;
      }
      if (counter === tips.length - 1) {
        var lineData = {
          labels: labels,
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
        callback(lineData);
      }
      counter++;
    });
  } else if (sort === 'profit') {
    var i = 0;
    tips.forEach(function (tip) {
      var tipYear = new Date(tip.date).getUTCFullYear();
      if (tipYear === thisYear) {
        var n = new Date(tip.date).getUTCMonth();
        dateLine[n] += 0.00013;
      }
      if (i === tips.length - 1) {
        var j = 0;
        posts.forEach(function (post) {
          var postYear = new Date(post.datetime).getUTCFullYear();
          if (postYear === thisYear) {
            var n2 = new Date(post.datetime).getUTCMonth();
            dateLine[n2] -= 0.000001;
          }
          if (j === posts.length - 1) {
            var lineData = {
              labels: labels,
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
            callback(lineData);
          }
          j++;
        });
      }
      i++;
    });
  }
}

function postsStatistics(posts, tips, callback) {
  var today = new Date();
  var sevenDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  var thirtyDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
  var ninetyDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90);

  var i = 0;
  var sevenCount = 0;
  var thirtyCount = 0;
  var ninetyCount = 0;
  var textCount = 0;
  var imageCount = 0;
  var audioCount = 0;
  var otherCount = 0;

  posts.forEach(function (post) {
    var postDay = new Date(post.datetime);
    var postType = post.type;
    if (postDay > sevenDays) {
      sevenCount += 1;
    }
    if (postDay > thirtyDays) {
      thirtyCount += 1;
    }
    if (postDay > ninetyDays) {
      ninetyCount += 1;
    }
    if (postType.substring(0, 4) === 'text') {
      textCount += 1;
    } else if (postType.substring(0, 5) === 'image') {
      imageCount += 1;
    } else if (postType.substring(0, 5) === 'audio') {
      audioCount += 1;
    } else {
      otherCount += 1;
    }
    if (i === posts.length - 1) {
      callback(sevenCount, thirtyCount, ninetyCount, textCount, imageCount, audioCount, otherCount);
    }
    i++;
  });
}

function tipsStatistics(posts, tips, callback) {
  var avgTips = 0;
  var maxTips = 0;
  var i = 0;
  posts.forEach(function (post) {
    if (post.tips > maxTips) {
      maxTips = post.tips;
    }
    if (i === posts.length - 1) {
      var avgTips = 0;
      if (posts.length > 0) {
        avgTips = tips.length / posts.length;
      }
      var j = 0;
      var sevenCount = 0;
      var thirtyCount = 0;
      var ninetyCount = 0;
      var allCount = tips.length;
      var today = new Date();
      var sevenDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
      var thirtyDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
      var ninetyDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90);
      tips.forEach(function (tip) {
        var tipDay = new Date(tip.date);
        if (tipDay > sevenDays) {
          sevenCount += 1;
        }
        if (tipDay > thirtyDays) {
          thirtyCount += 1;
        }
        if (tipDay > ninetyDays) {
          ninetyCount += 1;
        }
        if (j === tips.length - 1) {
          callback(avgTips, maxTips, sevenCount, thirtyCount, ninetyCount, allCount);
        }
        j++;
      });
    }
    i++;
  });
}

function profitsStatistics(posts, tips, callback) {
  var numPosts = posts.length;
  var numTips = tips.length;
  var revenues = (numTips * .00013).toFixed(5);
  var costs = (numPosts * .000001).toFixed(5);
  callback(revenues, costs);
}

function sortByTitle(posts, sort, callback) {
  if (posts !== undefined && posts.length > 0) {
    if (sort === "up") {
      callback(posts.sort(function (a, b) {
        var titleA = a.title.toUpperCase();
        var titleB = b.title.toUpperCase();
        return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
      }));
    } else if (sort === "down") {
      callback(posts.sort(function (a, b) {
        var titleA = a.title.toUpperCase();
        var titleB = b.title.toUpperCase();
        return titleA < titleB ? 1 : titleA > titleB ? -1 : 0;
      }));
    }
  }
  callback([]);
}

function sortByTips(posts, sort, callback) {
  if (posts !== undefined && posts.length > 0) {
    if (sort === "up") {
      callback(posts.sort(function (a, b) {
        var tipsA = a.tips;
        var tipsB = b.tips;
        return tipsA < tipsB ? 1 : tipsA > tipsB ? -1 : 0;
      }));
    } else if (sort === "down") {
      callback(posts.sort(function (a, b) {
        var tipsA = a.tips;
        var tipsB = b.tips;
        return tipsA < tipsB ? -1 : tipsA > tipsB ? 1 : 0;
      }));
    }
  } else {
    callback([]);
  }
}

function sortByDate(posts, sort, callback) {
  if (posts !== undefined && posts.length > 0) {
    if (sort === "up") {
      callback(posts.sort(function (a, b) {
        var dateA = new Date(a.datetime).toLocaleString();
        var dateB = new Date(b.datetime).toLocaleString();
        return dateA < dateB ? 1 : dateA > dateB ? -1 : 0;
      }));
    } else if (sort === "down") {
      callback(posts.sort(function (a, b) {
        var dateA = new Date(a.datetime).toLocaleString();
        var dateB = new Date(b.datetime).toLocaleString();
        return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
      }));
    }
  } else {
    callback([]);
  }
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
  } else {
    callback([]);
  }
}

function buildTable(sortedPosts, callback) {
  var i = 0;
  var renderPosts = [];
  sortedPosts.forEach(function (post) {
    renderPosts.push(React.createElement(
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
        new Date(post.datetime).toLocaleString()
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
    if (i === sortedPosts.length - 1) {
      callback(renderPosts);
    }
    i++;
  });
}

var Assets = React.createClass({
  displayName: 'Assets',

  getInitialState: function getInitialState() {
    return {};
  },

  componentDidMount: function componentDidMount() {
    var address = this.props.address;
    var that = this;
    xhr({
      url: 'http://coinvote-testnet.herokuapp.com/getPosts/user?address=' + address,
      headers: {
        "Content-Type": "application/json"
      },
      method: 'GET'
    }, function (err, resp, body) {
      if (err) {
        console.log("error: " + err);
      }
      if (resp.statusCode === 200) {
        console.log("Received response from server");
        initialize(JSON.parse(body).posts, JSON.parse(body).tips, function (posts, tips) {
          that.renderPosts(posts, function (sortedPosts) {
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
              posts: sortedPosts,
              rawPosts: posts,
              rawTips: tips
            });
            that.renderStatistics('tips');
          });
        });
      }
    });
  },

  renderStatistics: function renderStatistics(sort) {
    var numPosts = this.state.rawPosts.length;
    var numTips = this.state.rawTips.length;
    var numProfits = (numTips * .00013 - (numPosts * .000001 + .0001)).toFixed(5);
    var posts = this.state.rawPosts;
    var tips = this.state.rawTips;
    var that = this;
    if (sort === 'posts') {
      buildGraph(posts, null, 'posts', function (lineData) {
        postsStatistics(posts, tips, function (sevenCount, thirtyCount, ninetyCount, textCount, imageCount, audioCount, otherCount) {
          var statistics = React.createElement(
            Panel,
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
          );
          that.setState({
            statistics: statistics
          });
        });
      });
    } else if (sort === 'tips') {
      buildGraph(null, tips, 'tips', function (lineData) {
        tipsStatistics(posts, tips, function (avgTips, maxTips, sevenCount, thirtyCount, ninetyCount, allCount) {
          var statistics = React.createElement(
            Panel,
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
                { onClick: that.renderStatistics.bind(null, 'tips'), active: true },
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
          );
          that.setState({
            statistics: statistics
          });
        });
      });
    } else if (sort === 'profit') {
      buildGraph(posts, tips, 'profit', function (lineData) {
        profitsStatistics(posts, tips, function (revenues, costs) {
          var statistics = React.createElement(
            Panel,
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
          );
          that.setState({
            statistics: statistics
          });
        });
      });
    }
  },

  renderPosts: function renderPosts(posts, callback) {
    sortByDate(posts, 'up', function (sortedPosts) {
      buildTable(sortedPosts, function (renderPosts) {
        callback(renderPosts);
      });
    });
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
        this.state.statistics,
        React.createElement(
          Table,
          { striped: true, hover: true, responsive: true },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              this.state.title,
              this.state.tips,
              this.state.date,
              this.state.sha1,
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