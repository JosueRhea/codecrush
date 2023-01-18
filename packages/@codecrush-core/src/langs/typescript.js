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
  "for",
  "var",
  "Math",
  "max",
  "min",
  "export",
  "default",
  "module",
  "exports",
  "import",
  "from",
  "async",
  "await"
];

export const findQuery = (query) => {
  const result = keyworks.filter((n) => n.startsWith(query));
  return result;
};
