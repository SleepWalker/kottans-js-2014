console.log(
    process.argv.slice(2).reduce(function(acc, curr){
      return acc*1 + curr*1;
    })
);

