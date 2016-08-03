// Taken from https://davidwalsh.name/detect-scrollbar-width

const createScrollDiv = () => {
  const scrollDiv = document.createElement("div");

  scrollDiv.style.width = "100px";
  scrollDiv.style.height = "100px";
  scrollDiv.style.position = "absolute";
  scrollDiv.style.top = "-9999px";
  scrollDiv.style.overflow = "scroll";

  return scrollDiv;
};

const detectBrowserScrollbarWidth = () => {
  const scrollDiv = createScrollDiv();
  document.body.appendChild(scrollDiv);
  const scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollBarWidth;
};

export default detectBrowserScrollbarWidth;
