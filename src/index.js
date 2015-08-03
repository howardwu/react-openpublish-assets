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

  var colors = [["#f44336", "#e57373"], ["#E91E63", "#F06292"], ["#9C27B0", "#BA68C8"], ["#673AB7", "#9575CD"], ["#3F51B5", "#7986CB"], ["#2196F3", "#64B5F6"], ["#03A9F4", "#4FC3F7"], ["#00BCD4","#4DD0E1"], ["#009688","#4DB6AC"], ["#4CAF50","#81C784"], ["#8BC34A","#AED581"], ["#CDDC39","#DCE775"], ["#FFEB3B","#FFF176"], ["#FFC107","#FFD54F"], ["#FFD54F","#FFB74D"], ["#FF5722","#FF8A65"]];
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
  getInitialState: function() {
    return {
      posts: [],
      loadPosts: true
    }
  },

  renderPosts: function() {
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
          render.push(
            <tr key={i}>
              <td><a href={"/permalink?sha1=" + post.sha1}>{post.title}</a></td>
              <td>{post.tips}</td>
              <td>{post.datetime}</td>
              <td><a href={"/permalink?sha1=" + post.sha1}>{post.sha1} </a></td>
              <td><a href={"https://bitstore-test.blockai.com/" + post.owner + "/sha1/" + post.sha1}>View Content</a></td>
            </tr>
          );
          if (i === posts.length - 1) {
            that.renderStatistics(data);
            that.renderGraphs(data);
            that.setState({posts: render, loadPosts: false});
          }
        }
      }
    });
  },

  renderStatistics: function (data) {
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
    })
  },

  renderGraphs: function (data) {
    if (data.length > 0) {
      var that = this;
      datePosts(data, function (dataLine) {
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
              data: dataLine
            }
          ]
        };
        piePosts(data, function (dataPie) {
          that.setState({
            tipLine: <LineChart data={lineData} options={{responsive: true}} width="750" height="350" />,
            tipPie: <PieChart data={dataPie} width="250" height="250" />
          });
        });
      });
    }
  },

  posts: function (callback) {
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

  render: function () {
    if (this.state.loadPosts) {
      this.renderPosts();
    }
    return (
      <div className="container">
        <Panel>
          <b style={{fontSize: "25px"}}> {this.props.user_id + "\'s Assets"} </b> 
          <br /> <br /> 
          <Panel className="assetStatsPanel">
            <div className="assetStats">
              <p>Total Posts: <b>{this.state.numPosts}</b></p>
              <p>Total Tips: <b>{this.state.numTips}</b></p>
            </div>
            <div className="assetStats">
              <p>Average Tips per Post: <b>{this.state.avgTips}</b></p>
              <p>Record Tips on a Post: <b>{this.state.maxTips}</b></p>
            </div>
            <div className="assetStats">
              <p>Total Revenue: <b>{(this.state.numTips * .00013).toFixed(5)}</b></p>
              <p>Total Bitstore Costs: <b>{(this.state.numPosts * .000001 + .0001).toFixed(5)}</b></p>
            </div>
          </Panel>
          <Row>
            <Col md={6} lg={6} xl={6}>
              <center>{this.state.tipLine}</center>
            </Col>
            <Col md={6} lg={6} xl={6}>
              <center>{this.state.tipPie}</center>
            </Col>
          </Row>
          <Table responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Tips</th>
                <th>Date</th>
                <th>SHA1</th>
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