var inputs = process.argv.slice(2);
var result = inputs.map((str) => str[0])
                   .reduce((acc, str) => acc+str);
console.log(`[${inputs}] becomes "${result}"`);
