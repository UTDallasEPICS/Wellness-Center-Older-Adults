// wait.mjs
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log('Sleeping for 2 seconds...');
  await sleep(2000);  // Sleep for 2 seconds
  console.log('Awoke after 2 seconds!');
})();
