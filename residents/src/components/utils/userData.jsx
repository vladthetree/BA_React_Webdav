export function userData() {
  const value = ("; " + document.cookie)
    .split("; userData=")
    .pop()
    .split(";")[0];
  let userData = undefined;
  if (userData !== undefined) {
    userData = JSON.parse(value);
    return userData;
  }
  return userData;
}
