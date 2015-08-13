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
  if (posts != undefined && posts.length > 0) {
    var i = 0;
    var thisYear = new Date().getUTCFullYear();
    if (sort === 'posts') {
      posts.forEach(function (post) {
        var postDate = new Date(post.created_at);
        if (postDate.getUTCFullYear() === thisYear) dateLine[postDate.getUTCMonth()] += 1;
        if (++i === posts.length) callback(lineData);
      });
    }
    else if (sort === 'tips') {
      posts.forEach(function (post) {
        if (post.tipCount > 0) {
          var j = 0;
          post.tips.forEach(function (tip) {
            var tipDate = new Date(tip.created_at);
            if (tipDate.getUTCFullYear() === thisYear) dateLine[tipDate.getUTCMonth()] += 1;
            if (++j === post.tipCount) i++;
            if (i === posts.length) callback(lineData);
          });
        }
        else if (++i === posts.length) callback(lineData);
      });
    }
    else if (sort === 'profit') {
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
        }
        else if (++i === posts.length) callback(lineData); 
      });
    }
  }
  else callback(lineData);
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
      if (postType.substring(0, 4) === 'text') textCount += 1;
      else if (postType.substring(0, 5) === 'image') imageCount += 1;
      else if (postType.substring(0, 5) === 'audio') audioCount += 1;
      else otherCount += 1;
      if (++i === posts.length) callback(sevenCount, thirtyCount, ninetyCount, textCount, imageCount, audioCount, otherCount);
    });
  }
  else callback(sevenCount, thirtyCount, ninetyCount, textCount, imageCount, audioCount, otherCount);
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
          if (i === posts.length) callback (avgTips, maxTips, sevenCount, thirtyCount, ninetyCount, allCount);
        });
      }
      else if (++i === posts.length) callback (avgTips, maxTips, sevenCount, thirtyCount, ninetyCount, allCount);
    });
  }
  else callback (avgTips, maxTips, sevenCount, thirtyCount, ninetyCount, allCount);
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
        return (titleA < titleB) ? -1 : (titleA > titleB) ? 1 : 0;
      }));
    }
    else if (sort === "down") {
      callback(posts.sort(function (a, b) {
        var titleA = a.name.toUpperCase();
        var titleB = b.name.toUpperCase();
        return (titleA < titleB) ? 1 : (titleA > titleB) ? -1 : 0;
      }));
    }
  }
  else callback([]);
}

function sortByTips(posts, sort, callback) {
  if (posts !== undefined && posts.length > 0) {
    if (sort === "up") {
      callback(posts.sort(function (a, b) {
        var tipsA = a.tipCount;
        var tipsB = b.tipCount;
        return (tipsA < tipsB) ? 1 : (tipsA > tipsB) ? -1 : 0;
      }));
    }
    else if (sort === "down") {
      callback(posts.sort(function (a, b) {
        var tipsA = a.tipCount;
        var tipsB = b.tipCount;
        return (tipsA < tipsB) ? -1 : (tipsA > tipsB) ? 1 : 0;
      }));
    }
  }
  else callback([]);
}

function sortByDate(posts, sort, callback) {
  if (posts !== undefined && posts.length > 0){
    if (sort === "up") {
      callback(posts.sort(function (a, b) {
        var dateA = new Date(a.created_at).toLocaleString();
        var dateB = new Date(b.created_at).toLocaleString();
        return (dateA < dateB) ? 1 : (dateA > dateB) ? -1 : 0;
      }));
    }
    else if (sort === "down") {
      callback(posts.sort(function (a, b) {
        var dateA = new Date(a.created_at).toLocaleString();
        var dateB = new Date(b.created_at).toLocaleString();
        return (dateA < dateB) ? -1 : (dateA > dateB) ? 1 : 0;
      }));
    }
  }
  else callback([]);
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
  else callback([]);
}

function buildTable(posts, callback) {
  var renderPosts = [];
  if (posts != undefined && posts.length > 0) {
    var i = 0;
    posts.forEach(function (post) {
      renderPosts.push(
        <tr key={i}>
          <td><center><BitstoreContent tips={post.tips} post={post} src={post.uri} href={post.uri} preview={true} /></center></td>
          <td><BitstoreContent tips={post.tips} post={post} src={post.uri} href={post.uri} text={true} /></td>
          <td><center>{post.tipCount}</center></td>
          <td>{new Date(post.created_at).toLocaleString()}</td>
          <td><a href={post.uri}>{post.sha1} </a></td>
        </tr>
      );
      if (++i === posts.length) callback(renderPosts);
    });
  }
  else callback(renderPosts);
}

function buildVisual(posts, callback) {
  var visual = [];
  if (posts != undefined && posts.length > 0) {
    for (var i = 0; i < posts.length; i++) {
      var post = posts[i];
      visual.push(<BitstoreContent key={i} tips={post.tips} post={post} src={post.uri} href={post.uri} visual={true} />);
    }
    callback(visual);
  }
  else callback(visual);
}

var Assets = React.createClass({
  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
    if (this.props.address === undefined) console.log('error: No address parameter is specified.');
    var openpublishState = require('openpublish-state')({
      network: this.props.network
    });
    var that = this;
    openpublishState.findDocsByUser({
      address: this.props.address,
      includeTips: true
    }, function (err, opendocs) {
      if (err) console.log("error: " + err);
      else {
        initialize(opendocs, function (numTips) {
          that.renderPosts(opendocs, function (sortedPosts) {
            that.renderVisual(opendocs, function (visual) {
              that.setState({
                title: <th>Title <img className="both-caret" onClick={that.sortPosts.bind(null, "title-up")}></img></th>,
                tips: <th>Tips <img className="both-caret" onClick={that.sortPosts.bind(null, "tips-up")}></img></th>,
                date: <th>Date <img className="both-caret" onClick={that.sortPosts.bind(null, "date-up")}></img></th>,
                sha1: <th>SHA1 <img className="both-caret" onClick={that.sortPosts.bind(null, "sha1-up")}></img></th>,
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

  renderPosts: function (posts, callback) {
    sortByDate(posts, 'up', function (sortedPosts) {
      buildTable(sortedPosts, function (renderPosts) {
        callback(renderPosts);
      });
    });
  },
  
  renderVisual: function (posts, callback) {
    buildVisual(posts, function (visual) {
      callback(visual);
    });
  },

  renderStatistics: function (sort) {
    var posts = this.state.rawPosts;
    var numPosts = posts.length;
    var numTips = this.state.numTips;
    var numProfits = 0.0;
    if (numPosts > 0 || numTips > 0) numProfits = ((numTips * .00013) - (numPosts * .000001 + .0001)).toFixed(5);
    var that = this;
    if (sort === 'posts') {
      buildGraph(posts, 'posts', function (lineData) {
        postsStatistics(posts, function (sevenCount, thirtyCount, ninetyCount, textCount, imageCount, audioCount, otherCount) {
          var statistics = (
            <div>
              <ButtonGroup className="assets-buttons">
                <Button onClick={that.renderStatistics.bind(null, 'posts')} active>
                  <center><p>Total Posts</p><h1>{numPosts}</h1></center>
                </Button>
                <Button onClick={that.renderStatistics.bind(null, 'tips')}>
                  <center><p>Total Tips</p><h1>{numTips}</h1></center>
                </Button>
                <Button onClick={that.renderStatistics.bind(null, 'profit')}>
                  <center><p>Total Profit</p><h1>~ {numProfits} BTC</h1></center>
                </Button>
              </ButtonGroup>
              <hr />
              <center><LineChart data={lineData} options={{responsive: true}} height="100" /></center>
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
      buildGraph(posts, 'tips', function (lineData) {
        tipsStatistics(posts, that.state.numTips, function (avgTips, maxTips, sevenCount, thirtyCount, ninetyCount, allCount) {
          var statistics = (
            <div>
              <ButtonGroup className="assets-buttons">
                <Button onClick={that.renderStatistics.bind(null, 'posts')}>
                  <div className="word-wrap">
                    <center><p>Total Posts</p><h1>{numPosts}</h1></center>
                  </div>
                </Button>
                <Button onClick={that.renderStatistics.bind(null, 'tips')} active>
                  <div className="word-wrap">
                    <center><p>Total Tips</p><h1>{numTips}</h1></center>
                  </div>
                </Button>
                <Button onClick={that.renderStatistics.bind(null, 'profit')}>
                  <div className="word-wrap">
                    <center><p>Total Profit</p><h1>~ {numProfits} BTC</h1></center>
                  </div>
                </Button>
              </ButtonGroup>
              <hr />
              <center><LineChart data={lineData} options={{responsive: true}} height="100" /></center>
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
      buildGraph(posts, 'profit', function (lineData) {
        profitsStatistics(posts, that.state.numTips, function (revenues, costs) {
          var statistics = (
            <div>
              <ButtonGroup className="assets-buttons">
                <Button onClick={that.renderStatistics.bind(null, 'posts')}>
                  <center><p>Total Posts</p><h1>{numPosts}</h1></center>
                </Button>
                <Button onClick={that.renderStatistics.bind(null, 'tips')}>
                  <center><p>Total Tips</p><h1>{numTips}</h1></center>
                </Button>
                <Button onClick={that.renderStatistics.bind(null, 'profit')} active>
                  <center><p>Total Profit</p><h1>~ {numProfits} BTC</h1></center>
                </Button>
              </ButtonGroup>
              <hr />
              <center><LineChart data={lineData} options={{responsive: true}} height="100" /></center>
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
          <TabbedArea defaultActiveKey={1}>
            <TabPane eventKey={1} tab='Overview'>
              <br />
              {this.state.statistics}
            </TabPane>
            <TabPane eventKey={2} tab='Line'>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th></th>
                    {this.state.title}
                    {this.state.tips}
                    {this.state.date}
                    {this.state.sha1}
                  </tr>
                </thead>
                <tbody>
                  {this.state.posts}
                </tbody>
              </Table>
            </TabPane>
            <TabPane eventKey={3} tab='Visual'>
              <div>
                <br />
                {this.state.visual}
              </div>
            </TabPane>
          </TabbedArea>
        </Panel>
      </div>
    );
  }
});

module.exports = Assets;
