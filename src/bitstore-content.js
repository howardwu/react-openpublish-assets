var React = require('react');
var LineChart = require("react-chartjs").Line;

var Modal = require('react-bootstrap/lib/Modal');
var Panel = require('react-bootstrap/lib/Panel');
var Button = require('react-bootstrap/lib/Button');
var Glyphicon = require('react-bootstrap/lib/Glyphicon');

var BitstoreContent = React.createClass({
  getInitialState: function (){
    return { showModal: false };
  },

  close: function (){
    this.setState({ showModal: false });
  },

  open: function (){
    this.setState({ showModal: true });
  },

  render: function () {
    var src = this.props.src;
    var href = this.props.href;
    var post = this.props.post;
    var type = post.type;
    if (type) {
      type = type.split('/')[0];
    }

    var modalImage = <Glyphicon style={{"fontSize": "25px"}} glyph='text-background' onClick={this.open} />;
    if (type === "image") modalImage = <img width="25px" height="25px" src={src} onClick={this.open} />;
    var dateLine = [0, 1, 2, 1, 3, 5, 5, 6, 2, 3, 2, 1];
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
    var modal = (
      <Modal show={this.state.showModal} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>{modalImage}{"  " + post.title + "\'s Statistics"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <LineChart data={lineData} options={{responsive: true}} height="150" />
          </div>

          <hr />

          <p>Publish Date: <b>{new Date(post.datetime).toLocaleString()}</b></p>
          <p>Tips: <b>{post.tips}</b></p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.close}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
    
    if (this.props.preview) {
      if (type === "image") {
        return (
          <a href={href}>
            <img height="25px" width="25px" src={src} />
          </a>
        );
      }
      else if (type === "audio") {
        return (
          <a href={href}>
            <Glyphicon style={{"fontSize": "25px",}} glyph='play' />
          </a>
        );
      }
      else {
        return (
          <a href={href}>
            <Glyphicon style={{"fontSize": "25px",}} glyph='text-background' />
          </a>
        );
      }
    }
    else if (this.props.visual) {
      if (type === "image") {
        return (
          <div>
            <div className="bitstore-image">
              <img src={src} onClick={this.open} />
            </div>
            {modal}
          </div>
        );
      }
      else if (type === "audio") {
        return (
          <div>
            <center>
              <div className="bitstore-image">
                <img src="http://cdn2.thefullsignal.com/sites/knowyourcell/files/images/329855.jpg" onClick={this.open} />
              </div>
            </center>
            {modal}
          </div>
        );
      }
      else {
        return (
          <div>
            <center>
              <div className="bitstore-image">
                <img src="http://www.1wallpaperhd.com/wp-content/uploads/Colorful/FTP1/1280x720/Solid%20color%20wallpapers%2002%201280x720.jpg" onClick={this.open} />
              </div>
            </center>
            {modal}
          </div>
        );
      }       
    }
    else if (this.props.text) {
      var title = post.title;
      return (
        <div>
          <a onClick={this.open}>{title}</a>
          {modal}
        </div>
      );
    }
  }
});

module.exports = BitstoreContent;