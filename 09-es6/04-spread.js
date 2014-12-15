var input = process.argv.slice(2);
var output = Math.min(...input);
console.log(`The minimum of [${input}] is ${output}`);