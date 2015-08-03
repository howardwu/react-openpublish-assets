var React = require('react');
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
    dateLine[n] += 1;
    if (counter === length) {
      callback(dateLine);
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

  getData: function (callback) {
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

        var data = [];
        for (var i = 0; i < posts.length; i++) {
          var post = posts[i];
          if (tips[post.sha1] != undefined && tips[post.sha1].length > 0) {
            tips[post.sha1].forEach(function (tip) {
              data.push({
                date: tip.datetime,
                title: post.title
              });
            });
          }
          if (i === posts.length - 1) {
            that.renderStatistics(data);
            that.renderGraph(data);
            that.renderPosts(posts);
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
      numTips += 1;
      if (1 > maxTips) {
        maxTips = 1;
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

  renderGraph: function (data) {
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
        that.setState({
          tipLine: <LineChart data={lineData} options={{responsive: true}} height="100" />
        });
      });
    }
  },

  renderPosts: function (posts) {
    var render = [];
    if (posts.length > 0) {
      for (var i = 0; i < posts.length; i++) {
        var post = posts[i];
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
          this.setState({posts: render, loadPosts: false});
        }
      }
    }
  },

  render: function () {
    if (this.state.loadPosts) {
      this.getData();
    }
    return (
      <div className="container">
        <Panel>
          <b style={{fontSize: "25px"}}> {this.props.address + "\'s Assets"} </b> 
          <br /> <br /> 
          <Panel>
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
          <Panel>
            <center>{this.state.tipLine}</center>
          </Panel>
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