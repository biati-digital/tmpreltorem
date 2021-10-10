module.exports = (opts = {}) => {
    console.log('process 1');
  console.log('unwanted line from pull request 5');
  console.log("this should throw an error");
};
