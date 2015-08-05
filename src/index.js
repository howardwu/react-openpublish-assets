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
  if (sort === 'posts') {
    var counter = 0;
    posts.forEach(function (post) {
      var n = new Date(post.datetime).getUTCMonth();
      dateLine[n] += 1;
      if (counter === posts.length - 1) {
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
        callback(lineData);
      }
      counter++;
    });
  }
  else if (sort === 'tips') {
    var counter = 0;
    tips.forEach(function (tip) {
      var n = new Date(tip.date).getUTCMonth();
      dateLine[n] += 1;
      if (counter === tips.length - 1) {
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
        callback(lineData);
      }
      counter++;
    });
  }
  else if (sort === 'profit') {
    var i = 0;
    tips.forEach(function (tip) {
      var n = new Date(tip.date).getUTCMonth();
      dateLine[n] += 0.00013;
      if (i === tips.length - 1) {
        var j = 0;
        posts.forEach(function (post) {
          var n2 = new Date(post.datetime).getUTCMonth();
          dateLine[n2] -= 0.000001;
          if (j === posts.length - 1) {
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
      callback(avgTips, maxTips);
    }
    i++;
  });
}

function profitsStatistics(posts, tips, callback) {

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
  var i = 0;
  var renderPosts = [];
  sortedPosts.forEach(function (post) {
    renderPosts.push(
      <tr key={i}>
        <td><a href={"/permalink?sha1=" + post.sha1}>{post.title}</a></td>
        <td>{post.tips}</td>
        <td>{new Date(post.datetime).toLocaleString()}</td>
        <td><a href={"/permalink?sha1=" + post.sha1}>{post.sha1} </a></td>
        <td><a href={"https://bitstore-test.blockai.com/" + post.owner + "/sha1/" + post.sha1}>View Content</a></td>
      </tr>
    );
    if (i === sortedPosts.length - 1) {
      callback(renderPosts);
    }
    i++;
  });
}

var Assets = React.createClass({
  getInitialState: function() {
    return {
      posts: []
    }
  },

  componentDidMount: function() {
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
        initialize(JSON.parse(body).posts, JSON.parse(body).tips, function (posts, tips) {
          that.renderStatistics(posts, tips, function (statistics) {
            that.renderPosts(posts, function (sortedPosts) {
              that.setState({ 
                statistics: statistics,
                title: <th>Title <img className="both-caret" onClick={that.sortPosts.bind(null, "title-up")}></img></th>,
                tips: <th>Tips <img className="both-caret" onClick={that.sortPosts.bind(null, "tips-up")}></img></th>,
                date: <th>Date <img className="both-caret" onClick={that.sortPosts.bind(null, "date-up")}></img></th>,
                sha1: <th>SHA1 <img className="both-caret" onClick={that.sortPosts.bind(null, "sha1-up")}></img></th>,
                posts: sortedPosts,
                rawPosts: posts,
                rawTips: tips
              });
            });
          });
        });
      }
    });
  },

  renderStatistics: function (posts, tips, callback) {
    var numPosts = posts.length;
    var numTips = tips.length;
    var numProfits = ((numTips * .00013) - (numPosts * .000001 + .0001)).toFixed(5);
    var that = this;
    buildGraph(null, tips, 'tips', function (lineData) {
      tipsStatistics(posts, tips, function (avgTips, maxTips) {
        var statistics = (
          <Panel>
            <ButtonGroup className="assets-buttons">
              <Button onClick={that.sortStatistics.bind(null, 'posts')}>
                <center>
                  <p>Total Posts</p>
                  <h1>{numPosts}</h1>
                </center>
              </Button>
              <Button onClick={that.sortStatistics.bind(null, 'tips')} active>
                <center>
                  <p>Total Tips</p>
                  <h1>{numTips}</h1>
                </center>
              </Button>
              <Button onClick={that.sortStatistics.bind(null, 'profit')}>
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
            <Col md={4} lg={4} xl={4}>
              <p>Average Number of Tips per Post: <b>{avgTips}</b></p>
              <p>Record Number of Tips on a Post: <b>{maxTips}</b></p>
            </Col>
          </Panel>
        );
        callback(statistics);
      });
    });
  },

  sortStatistics: function (sort) {
    var numPosts = this.state.rawPosts.length;
    var numTips = this.state.rawTips.length;
    var numProfits = ((numTips * .00013) - (numPosts * .000001 + .0001)).toFixed(5);
    var posts = this.state.rawPosts;
    var tips = this.state.rawTips;
    var that = this;
    if (sort === 'posts') {
      buildGraph(posts, null, 'posts', function (lineData) {
        postsStatistics(posts, tips, function (sevenCount, thirtyCount, ninetyCount, textCount, imageCount, audioCount, otherCount) {
          var statistics = (
            <Panel>
              <ButtonGroup className="assets-buttons">
                <Button onClick={that.sortStatistics.bind(null, 'posts')} active>
                  <center>
                    <p>Total Posts</p>
                    <h1>{numPosts}</h1>
                  </center>
                </Button>
                <Button onClick={that.sortStatistics.bind(null, 'tips')}>
                  <center>
                    <p>Total Tips</p>
                    <h1>{numTips}</h1>
                  </center>
                </Button>
                <Button onClick={that.sortStatistics.bind(null, 'profit')}>
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
            </Panel>
          );
          that.setState({
            statistics: statistics
          });
        });
      });
    }
    else if (sort === 'tips') {
      buildGraph(null, tips, 'tips', function (lineData) {
        tipsStatistics(posts, tips, function (avgTips, maxTips) {
          var statistics = (
            <Panel>
              <ButtonGroup className="assets-buttons">
                <Button onClick={that.sortStatistics.bind(null, 'posts')}>
                  <center>
                    <p>Total Posts</p>
                    <h1>{numPosts}</h1>
                  </center>
                </Button>
                <Button onClick={that.sortStatistics.bind(null, 'tips')} active>
                  <center>
                    <p>Total Tips</p>
                    <h1>{numTips}</h1>
                  </center>
                </Button>
                <Button onClick={that.sortStatistics.bind(null, 'profit')}>
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
              <Col md={4} lg={4} xl={4}>
                <p>Average Number of Tips per Post: <b>{avgTips}</b></p>
                <p>Record Number of Tips on a Post: <b>{maxTips}</b></p>
              </Col>
            </Panel>
          );
          that.setState({
            statistics: statistics
          });
        });
      });
    }
    else if (sort === 'profit') {
      buildGraph(posts, tips, 'profit', function (lineData) {
        var statistics = (
          <Panel>
            <ButtonGroup className="assets-buttons">
              <Button onClick={that.sortStatistics.bind(null, 'posts')}>
                <center>
                  <p>Total Posts</p>
                  <h1>{numPosts}</h1>
                </center>
              </Button>
              <Button onClick={that.sortStatistics.bind(null, 'tips')}>
                <center>
                  <p>Total Tips</p>
                  <h1>{numTips}</h1>
                </center>
              </Button>
              <Button onClick={that.sortStatistics.bind(null, 'profit')} active>
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
            <Col md={4} lg={4} xl={4}>
              <p>Total Revenue: <b>{(numTips * .00013).toFixed(5)}</b></p>
              <p>Total Bitstore Costs: <b>{(numPosts * .000001).toFixed(5)}</b></p>
            </Col>
          </Panel>
        );
        that.setState({
          statistics: statistics
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
        <Panel>
          <b style={{fontSize: "25px"}}> {this.props.address + "\'s Assets"} </b> 
          <br /> <br />
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