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

function simpleResponse(code, data) {
    jasmine.Ajax.requests.mostRecent().respondWith({
        "status": code,
        "contentType": 'text/plain',
        "responseText": JSON.stringify(data)
    });
}


function expectArgument(expected) {
    return function(actual) {
        expect(actual).toEqual(expected);
    };
}