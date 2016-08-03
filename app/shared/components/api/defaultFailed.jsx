import React from "react";

const { func } = React.PropTypes;

const DefaultFailed = React.createClass({
  propTypes: {
    onRetryFetch: func.isRequired
  },

  render() {
    return (
      <div className="weeds-default-failed-component">
        <p className="progress-message">
          Failed to load data.
          {" "}
          <a href="#" onClick={this.handleRetryFetch}>Try again?</a>
        </p>
      </div>
    );
  },

  handleRetryFetch(event) {
    event.preventDefault();
    this.props.onRetryFetch();
  }
});

export default DefaultFailed;
