import React from "react";
import { Link } from "react-router";

import keys from "lodash/keys";
import map from "lodash/map";
import sampleSize from "lodash/sampleSize";

const { object } = React.PropTypes;

const Emojis = React.createClass({
  propTypes: {
    emojis: object.isRequired
  },

  getInitialState() {
    return {
      randomEmojis: []
    };
  },

  render() {
    return (
      <div className="weeds-example-emoji-component">
        <Link className="back" to="..">&#8592; Back</Link>
        <h2>Random github emojis!</h2>
        <p>
          A simple example to show how to fetch with generateApiContainer. The ApiContainer provides
          server fetching (and loading states when mounting without data).
        </p>
        {this.renderSixRandomEmojis()}
        <button onClick={this.handleRandomize}>Randomize</button>
      </div>
    );
  },

  renderSixRandomEmojis() {
    return map(this.state.randomEmojis, (emojiKey) => {
      const emoji = this.props.emojis[emojiKey];
      return <img className="emoji" src={emoji} title={emojiKey} alt={emojiKey} key={emojiKey} />;
    });
  },

  handleRandomize() {
    this.setState({ randomEmojis: this.getSixRandomEmojis() });
  },

  getSixRandomEmojis() {
    return sampleSize(keys(this.props.emojis), 6);
  }
});

export default Emojis;
