function getDependencies(tree) {
    'use strict';

    if (!tree.hasOwnProperty('dependencies')) {
        return [];
    }

    var dependencies = (function seekForDependencies(dependecyTree, dependencies) {
        Object.keys(dependecyTree).forEach(function(depName) {
            var dep = dependecyTree[depName];
            dependencies[depName + '@' + dep.version] = 1;

            if (dep.hasOwnProperty('dependencies')) {
                dependencies = seekForDependencies(dep.dependencies, dependencies);
            }
        });

        return dependencies;
    }(tree.dependencies, {}));

    dependencies = Object.keys(dependencies);

    dependencies.sort();

    return dependencies;
}

module.exports = getDependencies;
