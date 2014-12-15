module.exports = function average(...args) {
    return args.reduce((acc, curr) => acc+curr) / args.length;
};