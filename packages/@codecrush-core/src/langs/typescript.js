const keyworks = [
  "const",
  "function",
  "let",
  "map",
  "forEach",
  "filter",
  "slice",
  "splice",
];

export const findQuery = (query) => {
  const result = keyworks.filter((n) => n.startsWith(query));
  return result;
};
