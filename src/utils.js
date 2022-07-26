export function indexOfWithInfinity(a, b){
  const index = a.indexOf(b);
  return index < 0 ? Infinity : index;
}

export function sanitize(a){
  return a.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}