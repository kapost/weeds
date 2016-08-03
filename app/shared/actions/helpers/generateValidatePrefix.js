import { devError } from "util/universalHelpers/devWarn";

const generateValidatePrefix = () => {
  const prefixes = [];

  return (prefix) => {
    if (prefixes.indexOf(prefix) > -1) {
      devError(
        `The prefix "${prefix}" has already been used. Check your
        \`generateFetchActions\` and \`generateWriteAction\` calls`);
    }

    prefixes.push(prefix);
  };
};

export default generateValidatePrefix;
