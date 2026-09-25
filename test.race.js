console.time("loop-timer");
const url =
  "http://localhost:3000/api/v1/product/6ab4eabcb52fbd5212487e63/purchase";

const request1 = fetch(url, {
  method: "PATCH",
});

const request2 = fetch(url, {
  method: "PATCH",
});

const [res1, res2] = await Promise.all([request1, request2]);

console.log("Request 1:", res1.status, await res1.text());
console.log("Request 2:", res2.status, await res2.text());

console.timeEnd("loop-timer");
