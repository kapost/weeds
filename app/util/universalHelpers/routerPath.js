const routerPath = (path) => {
  const root = (__RELATIVE_ROOT__.length > 0) ? "/" : "";
  return `/${__RELATIVE_ROOT__}${root}${path}`;
};

export default routerPath;
