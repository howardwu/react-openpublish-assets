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

var LineChart = require("react-chartjs").Line;
var PieChart = require("react-chartjs").Pie;

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
    return {
      posts: [],
      loadPosts: true
    };
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
            that.renderStatistics(posts, tipsData, function (numPosts, numTips, maxTips, avgTips) {
              that.renderGraph(tipsData, function (lineChart) {
                that.renderPosts(posts, function (sortedPosts) {
                  that.setState({
                    numPosts: numPosts,
                    numTips: numTips,
                    maxTips: maxTips,
                    avgTips: avgTips,
                    tipLine: lineChart,
                    posts: sortedPosts,
                    title: React.createElement(
                      'th',
                      null,
                      'Title ',
                      React.createElement('img', { className: 'both-caret', onClick: that.updateHeaders.bind(null, "title-up") })
                    ),
                    tips: React.createElement(
                      'th',
                      null,
                      'Tips ',
                      React.createElement('img', { className: 'both-caret', onClick: that.updateHeaders.bind(null, "tips-up") })
                    ),
                    date: React.createElement(
                      'th',
                      null,
                      'Date ',
                      React.createElement('img', { className: 'both-caret', onClick: that.updateHeaders.bind(null, "date-up") })
                    ),
                    sha1: React.createElement(
                      'th',
                      null,
                      'SHA1 ',
                      React.createElement('img', { className: 'both-caret', onClick: that.updateHeaders.bind(null, "sha1-up") })
                    ),
                    rawPosts: posts
                  });
                });
              });
            });
          }
        }
      }
    });
  },

  renderStatistics: function renderStatistics(posts, tipsData, callback) {
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
            callback(numPosts, numTips, maxTips, avgTips);
          }
          i++;
        });
      }
      counter++;
    });
  },

  renderGraph: function renderGraph(data, callback) {
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
        callback(React.createElement(LineChart, { data: lineData, options: { responsive: true }, height: '100' }));
      });
    }
  },

  renderPosts: function renderPosts(posts, callback) {
    sortByTips(posts, 'up', function (sortedPosts) {
      buildTable(sortedPosts, function (renderPosts) {
        callback(renderPosts);
      });
    });
  },

  updateHeaders: function updateHeaders(param) {
    if (param === 'title-up') {
      this.sortPosts('title-up');
      this.setState({
        title: React.createElement(
          'th',
          null,
          'Title ',
          React.createElement('img', { className: 'up-caret', onClick: this.updateHeaders.bind(null, "title-down") })
        ),
        tips: React.createElement(
          'th',
          null,
          'Tips ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "tips-up") })
        ),
        date: React.createElement(
          'th',
          null,
          'Date ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "date-up") })
        ),
        sha1: React.createElement(
          'th',
          null,
          'SHA1 ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "sha1-up") })
        )
      });
    } else if (param === 'title-down') {
      this.sortPosts('title-down');
      this.setState({
        title: React.createElement(
          'th',
          null,
          'Title ',
          React.createElement('img', { className: 'down-caret', onClick: this.updateHeaders.bind(null, "title-up") })
        ),
        tips: React.createElement(
          'th',
          null,
          'Tips ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "tips-up") })
        ),
        date: React.createElement(
          'th',
          null,
          'Date ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "date-up") })
        ),
        sha1: React.createElement(
          'th',
          null,
          'SHA1 ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "sha1-up") })
        )
      });
    } else if (param === 'tips-up') {
      this.sortPosts('tips-up');
      this.setState({
        title: React.createElement(
          'th',
          null,
          'Title ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "title-up") })
        ),
        tips: React.createElement(
          'th',
          null,
          'Tips ',
          React.createElement('img', { className: 'up-caret', onClick: this.updateHeaders.bind(null, "tips-down") })
        ),
        date: React.createElement(
          'th',
          null,
          'Date ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "date-up") })
        ),
        sha1: React.createElement(
          'th',
          null,
          'SHA1 ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "sha1-up") })
        )
      });
    } else if (param === 'tips-down') {
      this.sortPosts('tips-down');
      this.setState({
        title: React.createElement(
          'th',
          null,
          'Title ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "title-up") })
        ),
        tips: React.createElement(
          'th',
          null,
          'Tips ',
          React.createElement('img', { className: 'down-caret', onClick: this.updateHeaders.bind(null, "tips-up") })
        ),
        date: React.createElement(
          'th',
          null,
          'Date ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "date-up") })
        ),
        sha1: React.createElement(
          'th',
          null,
          'SHA1 ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "sha1-up") })
        )
      });
    } else if (param === 'date-up') {
      this.sortPosts('date-up');
      this.setState({
        title: React.createElement(
          'th',
          null,
          'Title ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "title-up") })
        ),
        tips: React.createElement(
          'th',
          null,
          'Tips ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "tips-up") })
        ),
        date: React.createElement(
          'th',
          null,
          'Date ',
          React.createElement('img', { className: 'up-caret', onClick: this.updateHeaders.bind(null, "date-down") })
        ),
        sha1: React.createElement(
          'th',
          null,
          'SHA1 ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "sha1-up") })
        )
      });
    } else if (param === 'date-down') {
      this.sortPosts('date-down');
      this.setState({
        title: React.createElement(
          'th',
          null,
          'Title ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "title-up") })
        ),
        tips: React.createElement(
          'th',
          null,
          'Tips ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "tips-up") })
        ),
        date: React.createElement(
          'th',
          null,
          'Date ',
          React.createElement('img', { className: 'down-caret', onClick: this.updateHeaders.bind(null, "date-up") })
        ),
        sha1: React.createElement(
          'th',
          null,
          'SHA1 ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "sha1-up") })
        )
      });
    } else if (param === 'sha1-up') {
      this.sortPosts('sha1-up');
      this.setState({
        title: React.createElement(
          'th',
          null,
          'Title ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "title-up") })
        ),
        tips: React.createElement(
          'th',
          null,
          'Tips ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "tips-up") })
        ),
        date: React.createElement(
          'th',
          null,
          'Date ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "date-up") })
        ),
        sha1: React.createElement(
          'th',
          null,
          'SHA1 ',
          React.createElement('img', { className: 'up-caret', onClick: this.updateHeaders.bind(null, "sha1-down") })
        )
      });
    } else if (param === 'sha1-down') {
      this.sortPosts('sha1-down');
      this.setState({
        title: React.createElement(
          'th',
          null,
          'Title ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "title-up") })
        ),
        tips: React.createElement(
          'th',
          null,
          'Tips ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "tips-up") })
        ),
        date: React.createElement(
          'th',
          null,
          'Date ',
          React.createElement('img', { className: 'both-caret', onClick: this.updateHeaders.bind(null, "date-up") })
        ),
        sha1: React.createElement(
          'th',
          null,
          'SHA1 ',
          React.createElement('img', { className: 'down-caret', onClick: this.updateHeaders.bind(null, "sha1-up") })
        )
      });
    }
  },

  sortPosts: function sortPosts(sort) {
    var posts = this.state.rawPosts;
    var that = this;
    if (sort === 'title-up') {
      sortByTitle(posts, 'up', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({ posts: renderPosts });
        });
      });
    } else if (sort === 'title-down') {
      sortByTitle(posts, 'down', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({ posts: renderPosts });
        });
      });
    } else if (sort === 'tips-up') {
      sortByTips(posts, 'up', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({ posts: renderPosts });
        });
      });
    } else if (sort === 'tips-down') {
      sortByTips(posts, 'down', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({ posts: renderPosts });
        });
      });
    } else if (sort === 'date-up') {
      sortByDate(posts, 'up', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({ posts: renderPosts });
        });
      });
    } else if (sort === 'date-down') {
      sortByDate(posts, 'down', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({ posts: renderPosts });
        });
      });
    } else if (sort === 'sha1-up') {
      sortBySHA1(posts, 'up', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({ posts: renderPosts });
        });
      });
    } else if (sort === 'sha1-down') {
      sortBySHA1(posts, 'down', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({ posts: renderPosts });
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