const generateResetAction = (RESET) => {
  return () => {
    return { type: RESET };
  };
};

export default generateResetAction;
