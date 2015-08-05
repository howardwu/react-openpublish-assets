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

var BASE;

function initialize(posts, tips, callback) {
  var tipsData = [];
  if (posts != undefined && posts.length > 0) {
    var i = 0;
    posts.forEach(function (post) {
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
      i++;
    });
  }
  else {
    callback(posts, tipsData);
  }
}

function buildGraph(posts, tips, sort, callback) {
  var dateLine = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var lineData = {
    labels: labels,
    datasets: [
      {
        label: "Tips",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: dateLine
      }
    ]
  };
  var thisYear = new Date().getUTCFullYear();
  if (sort === 'posts') {
    if (posts != undefined && posts.length > 0) {
      var i = 0;
      posts.forEach(function (post) {
        var postYear = new Date(post.datetime).getUTCFullYear();
        if (postYear === thisYear) {
          var n = new Date(post.datetime).getUTCMonth();
          dateLine[n] += 1;
        }
        if (i === posts.length - 1) {
          callback(lineData);
        }
        i++;
      });
    }
    else {
      callback(lineData);
    }
  }
  else if (sort === 'tips') {
    if (tips != undefined && tips.length > 0) {
      var counter = 0;
      tips.forEach(function (tip) {
        var tipYear = new Date(tip.date).getUTCFullYear();
        if (tipYear === thisYear) {
          var n = new Date(tip.date).getUTCMonth();
          dateLine[n] += 1;
        }
        if (counter === tips.length - 1) {
          callback(lineData);
        }
        counter++;
      });
    }
    else {
      callback(lineData);
    }
  }
  else if (sort === 'profit') {
    if (tips != undefined && tips.length > 0) {
      var i = 0;
      tips.forEach(function (tip) {
        var tipYear = new Date(tip.date).getUTCFullYear();
        if (tipYear === thisYear) {
          var n = new Date(tip.date).getUTCMonth();
          dateLine[n] += 0.00013;
        }
        if (i === tips.length - 1) {
          if (posts != undefined && posts.length > 0) {
            var j = 0;
            posts.forEach(function (post) {
              var postYear = new Date(post.datetime).getUTCFullYear();
              if (postYear === thisYear) {
                var n2 = new Date(post.datetime).getUTCMonth();
                dateLine[n2] -= 0.000001;
              }
              if (j === posts.length - 1) {
                callback(lineData);
              }
              j++;
            });
          }
          else {
            callback(lineData);
          }
        }
        i++;
      });
    }
    else {
      callback(lineData);
    }
  }
}

function postsStatistics(posts, tips, callback) {
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
      }
      else if (postType.substring(0, 5) === 'image') {
        imageCount += 1;
      }
      else if (postType.substring(0, 5) === 'audio') {
        audioCount += 1;
      }
      else {
        otherCount += 1;
      }
      if (i === posts.length - 1) {
        callback(sevenCount, thirtyCount, ninetyCount, textCount, imageCount, audioCount, otherCount);
      }
      i++;
    });
  }
  else {
    callback(sevenCount, thirtyCount, ninetyCount, textCount, imageCount, audioCount, otherCount);
  }
}

function tipsStatistics(posts, tips, callback) {
  var avgTips = 0;
  var maxTips = 0;
  var sevenCount = 0;
  var thirtyCount = 0;
  var ninetyCount = 0;
  var allCount = tips.length;

  if (posts != undefined && posts.length > 0) {
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
        var today = new Date();
        var sevenDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        var thirtyDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
        var ninetyDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90);
        if (tips != undefined && tips.length > 0) {
          var j = 0;
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
              callback (avgTips, maxTips, sevenCount, thirtyCount, ninetyCount, allCount);
            }
            j++;
          });
        }
        else {
          callback (avgTips, maxTips, sevenCount, thirtyCount, ninetyCount, allCount);
        }
      }
      i++;
    });
  }
  else {
    callback (avgTips, maxTips, sevenCount, thirtyCount, ninetyCount, allCount);
  }
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
        return (titleA < titleB) ? -1 : (titleA > titleB) ? 1 : 0;
      }));
    }
    else if (sort === "down") {
      callback(posts.sort(function (a, b) {
        var titleA = a.title.toUpperCase();
        var titleB = b.title.toUpperCase();
        return (titleA < titleB) ? 1 : (titleA > titleB) ? -1 : 0;
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
        return (tipsA < tipsB) ? 1 : (tipsA > tipsB) ? -1 : 0;
      }));
    }
    else if (sort === "down") {
      callback(posts.sort(function (a, b) {
        var tipsA = a.tips;
        var tipsB = b.tips;
        return (tipsA < tipsB) ? -1 : (tipsA > tipsB) ? 1 : 0;
      }));
    }
  }
  else {
    callback([]);
  }
}

function sortByDate(posts, sort, callback) {
  if (posts !== undefined && posts.length > 0){
    if (sort === "up") {
      callback(posts.sort(function (a, b) {
        var dateA = new Date(a.datetime).toLocaleString();
        var dateB = new Date(b.datetime).toLocaleString();
        return (dateA < dateB) ? 1 : (dateA > dateB) ? -1 : 0;
      }));
    }
    else if (sort === "down") {
      callback(posts.sort(function (a, b) {
        var dateA = new Date(a.datetime).toLocaleString();
        var dateB = new Date(b.datetime).toLocaleString();
        return (dateA < dateB) ? -1 : (dateA > dateB) ? 1 : 0;
      }));
    }
  }
  else {
    callback([]);
  }
}

function sortBySHA1(posts, sort, callback) {
  if (posts !== undefined && posts.length > 0){
    if (sort === "up") {
      callback(posts.sort(function (a, b) {
        var sha1A = a.sha1;
        var sha1B = b.sha1;
        return (sha1A < sha1B) ? -1 : (sha1A > sha1B) ? 1 : 0;
      }));
    }
    else if (sort === "down") {
      callback(posts.sort(function (a, b) {
        var sha1A = a.sha1;
        var sha1B = b.sha1;
        return (sha1A < sha1B) ? 1 : (sha1A > sha1B) ? -1 : 0;
      }));
    }
  }
  else {
    callback([]);
  }
}

function buildTable(sortedPosts, callback) {
  var renderPosts = [];
  if (sortedPosts != undefined && sortedPosts.length > 0) {
    var i = 0;
    sortedPosts.forEach(function (post) {
      renderPosts.push(
        <tr key={i}>
          <td><a href={BASE + '/permalink?sha1=' + post.sha1}>{post.title}</a></td>
          <td>{post.tips}</td>
          <td>{new Date(post.datetime).toLocaleString()}</td>
          <td><a href={BASE + '/permalink?sha1=' + post.sha1}>{post.sha1} </a></td>
          <td><a href={"https://bitstore-test.blockai.com/" + post.owner + "/sha1/" + post.sha1}>View Content</a></td>
        </tr>
      );
      if (i === sortedPosts.length - 1) {
        callback(renderPosts);
      }
      i++;
    });
  }
  else {
    callback(renderPosts);
  }
}

var Assets = React.createClass({
  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
    if (this.props.address === undefined) {
      console.log('error: No address parameter is specified.');
    }
    var address = this.props.address;
    var BASE = 'http://coinvote-testnet.herokuapp.com';
    if (this.props.network === undefined) {
      console.log('No network parameter is specified, defaulting to testnet.');
    }
    if (this.props.network === 'mainnet') {
      BASE = 'http://coinvote.herokuapp.com';
    }
    var that = this;
    xhr({
      url: BASE + '/getPosts/user?address=' + address,
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
              title: <th>Title <img className="both-caret" onClick={that.sortPosts.bind(null, "title-up")}></img></th>,
              tips: <th>Tips <img className="both-caret" onClick={that.sortPosts.bind(null, "tips-up")}></img></th>,
              date: <th>Date <img className="both-caret" onClick={that.sortPosts.bind(null, "date-up")}></img></th>,
              sha1: <th>SHA1 <img className="both-caret" onClick={that.sortPosts.bind(null, "sha1-up")}></img></th>,
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

  renderStatistics: function (sort) {
    var numPosts = this.state.rawPosts.length;
    var numTips = this.state.rawTips.length;
    var numProfits = 0.0;
    if (numPosts > 0 || numTips > 0) {
      numProfits = ((numTips * .00013) - (numPosts * .000001 + .0001)).toFixed(5);
    }
    var posts = this.state.rawPosts;
    var tips = this.state.rawTips;
    var that = this;
    if (sort === 'posts') {
      buildGraph(posts, null, 'posts', function (lineData) {
        postsStatistics(posts, tips, function (sevenCount, thirtyCount, ninetyCount, textCount, imageCount, audioCount, otherCount) {
          var statistics = (
            <div>
              <ButtonGroup className="assets-buttons">
                <Button onClick={that.renderStatistics.bind(null, 'posts')} active>
                  <center>
                    <p>Total Posts</p>
                    <h1>{numPosts}</h1>
                  </center>
                </Button>
                <Button onClick={that.renderStatistics.bind(null, 'tips')}>
                  <center>
                    <p>Total Tips</p>
                    <h1>{numTips}</h1>
                  </center>
                </Button>
                <Button onClick={that.renderStatistics.bind(null, 'profit')}>
                  <center>
                    <p>Total Profit</p>
                    <h1>~ {numProfits} BTC</h1>
                  </center>
                </Button>
              </ButtonGroup>
              <hr />
              <center>
                <LineChart data={lineData} options={{responsive: true}} height="100" />
              </center>
              <hr />
              <Row>
                <Col md={3} lg={3} xl={3}>
                  <center>
                    <p>7-Day Post Count: <b>{sevenCount}</b></p>
                    <p>30-Day Post Count: <b>{thirtyCount}</b></p>
                  </center>
                </Col>
                <Col md={3} lg={3} xl={3}>
                  <center>
                    <p>90-Day Post Count: <b>{ninetyCount}</b></p>
                    <p>All-Time Post Count: <b>{numPosts}</b></p>
                  </center>
                </Col>
                <Col md={3} lg={3} xl={3}>
                  <center>
                    <p>Text Posts: <b>{textCount}</b></p>
                    <p>Image Posts: <b>{imageCount}</b></p>
                  </center>
                </Col>
                <Col md={3} lg={3} xl={3}>
                  <center>
                    <p>Audio Posts: <b>{audioCount}</b></p>
                    <p>Other Posts: <b>{otherCount}</b></p>
                  </center>
                </Col>
              </Row>
              <hr />
            </div>
          );
          that.setState({
            statistics: statistics
          });
        });
      });
    }
    else if (sort === 'tips') {
      buildGraph(null, tips, 'tips', function (lineData) {
        tipsStatistics(posts, tips, function (avgTips, maxTips, sevenCount, thirtyCount, ninetyCount, allCount) {
          var statistics = (
            <div>
              <ButtonGroup className="assets-buttons">
                <Button onClick={that.renderStatistics.bind(null, 'posts')}>
                  <div className="word-wrap">
                    <center>
                      <p>Total Posts</p>
                      <h1>{numPosts}</h1>
                    </center>
                  </div>
                </Button>
                <Button onClick={that.renderStatistics.bind(null, 'tips')} active>
                  <div className="word-wrap">
                    <center>
                      <p>Total Tips</p>
                      <h1>{numTips}</h1>
                    </center>
                  </div>
                </Button>
                <Button onClick={that.renderStatistics.bind(null, 'profit')}>
                  <div className="word-wrap">
                    <center>
                      <p>Total Profit</p>
                      <h1>~ {numProfits} BTC</h1>
                    </center>
                  </div>
                </Button>
              </ButtonGroup>
              <hr />
              <center>
                <LineChart data={lineData} options={{responsive: true}} height="100" />
              </center>
              <hr />
              <Row>
                <Col md={4} lg={4} xl={4}>
                  <center>
                    <p>7-Day Tip Count: <b>{sevenCount}</b></p>
                    <p>30-Day Tip Count: <b>{thirtyCount}</b></p>
                  </center>
                </Col>
                <Col md={4} lg={4} xl={4}>
                  <center>
                    <p>7-Day Tip Count: <b>{ninetyCount}</b></p>
                    <p>30-Day Tip Count: <b>{allCount}</b></p>
                  </center>
                </Col>
                <Col md={4} lg={4} xl={4}>
                  <center>
                    <p>Average Number of Tips per Post: <b>{avgTips}</b></p>
                    <p>Record Number of Tips on a Post: <b>{maxTips}</b></p>
                  </center>
                </Col>
              </Row>
              <hr />
            </div>
          );
          that.setState({
            statistics: statistics
          });
        });
      });
    }
    else if (sort === 'profit') {
      buildGraph(posts, tips, 'profit', function (lineData) {
        profitsStatistics(posts, tips, function (revenues, costs) {
          var statistics = (
            <div>
              <ButtonGroup className="assets-buttons">
                <Button onClick={that.renderStatistics.bind(null, 'posts')}>
                  <center>
                    <p>Total Posts</p>
                    <h1>{numPosts}</h1>
                  </center>
                </Button>
                <Button onClick={that.renderStatistics.bind(null, 'tips')}>
                  <center>
                    <p>Total Tips</p>
                    <h1>{numTips}</h1>
                  </center>
                </Button>
                <Button onClick={that.renderStatistics.bind(null, 'profit')} active>
                  <center>
                    <p>Total Profit</p>
                    <h1>~ {numProfits} BTC</h1>
                  </center>
                </Button>
              </ButtonGroup>
              <hr />
              <center>
                <LineChart data={lineData} options={{responsive: true}} height="100" />
              </center>
              <hr />
              <Row>
                <Col md={3} lg={3} xl={3}>
                  <center>
                    <p>Total Revenue: <b>{revenues}</b></p>
                    <p>Total Bitstore Costs: <b>{costs}</b></p>
                  </center>
                </Col>
              </Row>
              <hr />
            </div>
          );
          that.setState({
            statistics: statistics
          });
        });
      });
    }
  },

  renderPosts: function (posts, callback) {
    sortByDate(posts, 'up', function (sortedPosts) {
      buildTable(sortedPosts, function (renderPosts) {
        callback(renderPosts);
      });
    });
  },

  sortPosts: function (sort) {
    var posts = this.state.rawPosts;
    var that = this;
    if (sort === 'title-up') {
      sortByTitle(posts, 'up', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({
            posts: renderPosts,
            title: <th>Title <img className="up-caret" onClick={that.sortPosts.bind(null, "title-down")}></img></th>,
            tips: <th>Tips <img className="both-caret" onClick={that.sortPosts.bind(null, "tips-up")}></img></th>,
            date: <th>Date <img className="both-caret" onClick={that.sortPosts.bind(null, "date-up")}></img></th>,
            sha1: <th>SHA1 <img className="both-caret" onClick={that.sortPosts.bind(null, "sha1-up")}></img></th>
          });
        });
      });
    }
    else if (sort === 'title-down') {
      sortByTitle(posts, 'down', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({
            posts: renderPosts,
            title: <th>Title <img className="down-caret" onClick={that.sortPosts.bind(null, "title-up")}></img></th>,
            tips: <th>Tips <img className="both-caret" onClick={that.sortPosts.bind(null, "tips-up")}></img></th>,
            date: <th>Date <img className="both-caret" onClick={that.sortPosts.bind(null, "date-up")}></img></th>,
            sha1: <th>SHA1 <img className="both-caret" onClick={that.sortPosts.bind(null, "sha1-up")}></img></th>
          });
        });
      });
    }
    else if (sort === 'tips-up') {
      sortByTips(posts, 'up', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({
            posts: renderPosts,
            title: <th>Title <img className="both-caret" onClick={that.sortPosts.bind(null, "title-up")}></img></th>,
            tips: <th>Tips <img className="up-caret" onClick={that.sortPosts.bind(null, "tips-down")}></img></th>,
            date: <th>Date <img className="both-caret" onClick={that.sortPosts.bind(null, "date-up")}></img></th>,
            sha1: <th>SHA1 <img className="both-caret" onClick={that.sortPosts.bind(null, "sha1-up")}></img></th>
          });
        });
      });
    }
    else if (sort === 'tips-down') {
      sortByTips(posts, 'down', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({
            posts: renderPosts,
            title: <th>Title <img className="both-caret" onClick={that.sortPosts.bind(null, "title-up")}></img></th>,
            tips: <th>Tips <img className="down-caret" onClick={that.sortPosts.bind(null, "tips-up")}></img></th>,
            date: <th>Date <img className="both-caret" onClick={that.sortPosts.bind(null, "date-up")}></img></th>,
            sha1: <th>SHA1 <img className="both-caret" onClick={that.sortPosts.bind(null, "sha1-up")}></img></th>
          });
        });
      });
    }
    else if (sort === 'date-up') {
      sortByDate(posts, 'up', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({
            posts: renderPosts,
            title: <th>Title <img className="both-caret" onClick={that.sortPosts.bind(null, "title-up")}></img></th>,
            tips: <th>Tips <img className="both-caret" onClick={that.sortPosts.bind(null, "tips-up")}></img></th>,
            date: <th>Date <img className="up-caret" onClick={that.sortPosts.bind(null, "date-down")}></img></th>,
            sha1: <th>SHA1 <img className="both-caret" onClick={that.sortPosts.bind(null, "sha1-up")}></img></th>
          });
        });
      });
    }
    else if (sort === 'date-down') {
      sortByDate(posts, 'down', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({
            posts: renderPosts,
            title: <th>Title <img className="both-caret" onClick={that.sortPosts.bind(null, "title-up")}></img></th>,
            tips: <th>Tips <img className="both-caret" onClick={that.sortPosts.bind(null, "tips-up")}></img></th>,
            date: <th>Date <img className="down-caret" onClick={that.sortPosts.bind(null, "date-up")}></img></th>,
            sha1: <th>SHA1 <img className="both-caret" onClick={that.sortPosts.bind(null, "sha1-up")}></img></th>
          });
        });
      });
    }
    else if (sort === 'sha1-up') {
      sortBySHA1(posts, 'up', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({
            posts: renderPosts,
            title: <th>Title <img className="both-caret" onClick={that.sortPosts.bind(null, "title-up")}></img></th>,
            tips: <th>Tips <img className="both-caret" onClick={that.sortPosts.bind(null, "tips-up")}></img></th>,
            date: <th>Date <img className="both-caret" onClick={that.sortPosts.bind(null, "date-up")}></img></th>,
            sha1: <th>SHA1 <img className="up-caret" onClick={that.sortPosts.bind(null, "sha1-down")}></img></th>
          });
        });
      });
    }
    else if (sort === 'sha1-down') {
      sortBySHA1(posts, 'down', function (sortedPosts) {
        buildTable(sortedPosts, function (renderPosts) {
          that.setState({
            posts: renderPosts,
            title: <th>Title <img className="both-caret" onClick={that.sortPosts.bind(null, "title-up")}></img></th>,
            tips: <th>Tips <img className="both-caret" onClick={that.sortPosts.bind(null, "tips-up")}></img></th>,
            date: <th>Date <img className="both-caret" onClick={that.sortPosts.bind(null, "date-up")}></img></th>,
            sha1: <th>SHA1 <img className="down-caret" onClick={that.sortPosts.bind(null, "sha1-up")}></img></th>
          });
        });
      });
    }
  },

  render: function () {
    return (
      <div className="container">
        <Panel header=<b style={{fontSize: "25px"}}> {this.props.address + "\'s Assets"} </b>>
          {this.state.statistics}
          <Table striped hover responsive>
            <thead>
              <tr>
                {this.state.title}
                {this.state.tips}
                {this.state.date}
                {this.state.sha1}
                <th>Bitstore</th>
              </tr>
            </thead>
            <tbody>
              {this.state.posts}
            </tbody>
          </Table>
        </Panel>
      </div>
    );
  }
});

module.exports = Assets;