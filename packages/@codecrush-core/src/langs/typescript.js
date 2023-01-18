const keyworks = [
  "const",
  "function",
  "let",
  "map",
  "forEach",
  "filter",
  "slice",
  "splice",
  "new",
  "if",
  "else",
];

export const findQuery = (query) => {
  const result = keyworks.filter((n) => n.startsWith(query));
  return result;
};
