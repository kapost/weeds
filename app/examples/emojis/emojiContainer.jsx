import { connect } from "react-redux";

import generateApiContainer from "shared/components/helpers/generateApiContainer";

import Emoji from "./components/emojis";
import { fetchIfNecessary } from "./ducks/emojisDuck";

const mapStateToProps = (state) => {
  return {
    emojis: state.emojis
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchIfNecessary: () => dispatch(fetchIfNecessary())
  };
};

const EmojiContainer = generateApiContainer(
  "weeds-emoji-container-component",
  { requiredApiKeys: ["emojis"] }
)(Emoji);

export default connect(mapStateToProps, mapDispatchToProps)(EmojiContainer);
