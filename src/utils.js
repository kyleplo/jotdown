export function indexOfWithInfinity(a, b){
  const index = a.indexOf(b);
  return index < 0 ? Infinity : index;
}

export function sanitize(a){
  return a.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}

export function setImmediate(a){
  return setTimeout(a, 0);
}

export function clearImmediate(a){
  clearTimeout(a);
}