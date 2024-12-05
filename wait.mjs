// wait.mjs
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  await sleep(2000); // Sleep for 2 seconds
})();
