export function a() {
  const d = c();
  const myVar = 23;
  console.log(myVar);

  return d;
}

export function b() {
  return 'Hello world';
}

function c() {
  return a;
}