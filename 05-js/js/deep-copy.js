/**
 * Задача №1.
 * Реализация функции deepCopy - для копирования объекта с учетом вложенных объектов:
 * var a = {b: ‘c’, d: {e: ‘f’}},
 * b = deepCopy(a);
 * a.d = 12;
 * b.d // {e: ‘f’}
 * тесты: http://plnkr.co/edit/jhc1oSkWg7g87W2gjfiq?p=preview
 */

var deepCopy = (function() {
    'use strict';

    function deepCopy() {
        var destination;
        var sources;

        if (arguments.length < 1) {
            throw new Error('Need at least one argument to do deep copy');
        }

        if (!isEnumerable(arguments[0])) {
            return arguments[0];
        }

        if (arguments.length == 1) {
            destination = {};
            sources = [arguments[0]];
        } else {
            destination = arguments[0];
            sources = [].slice.call(arguments, 1);
        }

        for (var i = 0; i < sources.length; i++) {
            copyOwnProperties(destination, sources[i]);
        }

        return destination;
    }

    function copyOwnProperties(destination, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                destination[key] = filterValue(source[key]);
            }
        }

        return destination;
    }

    function filterValue(value) {
        if (isArray(value)) {
            return copyOwnProperties([], value);
        } else if (isObject(value)) {
            return copyOwnProperties({}, value);
        } else {
            return value;
        }
    }

    function isEnumerable(value) {
        return (isObject(value) || isArray(value)) && value;
    }

    function isObject(value) {
        return typeof value === 'object';
    }

    function isArray(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    }

    return deepCopy;
}());
