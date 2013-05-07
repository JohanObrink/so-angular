
var rndStations = 3
  , rndGenres = 5
  , numSongs = 300;

var getColor = function(name) {
  var color = (name
    .split('')
    .map(function(ch) { return ch.charCodeAt(0); })
    .reduce(function(tot, cur) { return tot * cur; }) % 0xffffff)
    .toString(16);
  while(color.length < 6) { color = '0' + color; }
  return color;
};

var oppositeColor = function(hex) {
  var color = (0xffffff - parseInt(hex, 16)).toString(16);
  while(color.length < 6) { color = '0' + color; }
  return color;
};

var getSongs = function(name, color, len, startIndex) {
  var textColor = oppositeColor(color);
  name = name.replace(' ', '+');
  startIndex = startIndex || 1;
  var songs = [];
  for(var i=startIndex; i<startIndex+len; i++) {
    songs.push({
      thumb: 'http://placehold.it/97/' + color + '/' + textColor + '/&text=' + name + '+' + i,
      src: 'http://placehold.it/300/' + color + '/' + textColor + '/&text=' + name + '+' + i
    });
  }
  return songs;
}

var libraries = {};
var stations = [ 'Classics', 'Just Rock', 'Mellow', 'My Stuff', 'Party', 'Safe for work', 'MyList1', 'MyList2' ];
var genres = [ 'Pop', 'Rock', 'Soul', 'Metal', 'Punk', 'Goth', 'Electronic', 'Folk', 'Muzac', 'Hip Hop', 'Dance', 'RnB', 'Trance', 'Industrial' ];

exports.get = function(path) {
  if(libraries[path]) {
    return libraries[path];
  } else {

    var lib = { path: path, stations: {} };

    var numStations = 1 + Math.ceil(Math.random(new Date().getTime()) * rndStations);
    for(var s=0; s < numStations; s++) {

      var stationName;
      while(!stationName || lib.stations[stationName]) { stationName = stations[Math.floor(stations.length * Math.random())]; }
      var station = lib.stations[stationName] = { name: stationName, genres: [] };

      var numGenres = 1 + Math.ceil(Math.random(new Date().getTime()) * rndGenres);
      var usedGenres = [];

      for(var g=0; g<numGenres; g++) {
        var genreName;
        while(true) {
          genreName = genres[Math.floor(genres.length * Math.random())];
          if(usedGenres.indexOf(genreName) === -1) {
            usedGenres.push(genreName);
            break;
          }
        }
        var genre = {
          name: genreName,
          priority: Math.round(Math.random() * 100),
          songs: getSongs(genreName, getColor(genreName), numSongs)
        };
        station.genres.push(genre);
      }
    }
    
    libraries[path] = lib;

    return lib;
  }
}
