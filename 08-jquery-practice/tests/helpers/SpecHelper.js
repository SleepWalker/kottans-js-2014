// beforeEach(function () {
//   jasmine.addMatchers({
//     toBePlaying: function () {
//       return {
//         compare: function (actual, expected) {
//           var player = actual;

//           return {
//             pass: player.currentlyPlayingSong === expected && player.isPlaying
//           }
//         }
//       };
//     }
//   });
// });

function simpleResponse(code, data, contentType) {
    jasmine.Ajax.requests.mostRecent().respondWith({
        "status": code,
        "contentType": contentType || 'text/plain',
        "responseText": $.isPlainObject(data) ? JSON.stringify(data) : data
    });
}


function expectArgument(expected) {
    return function(actual) {
        expect(actual).toEqual(expected);
    };
}