var TfIdf = require("natural").TfIdf,
    Segment = require("segment").Segment,
    debug = require("debug")("keyword"),
    _ = require("lodash");

var count = function(doc, word) {
  if(!doc) {
    return 0;
  }
  var c = 0, i = 0, hit = true;
  while(hit && i<=doc.length) {
    if(doc.indexOf(word, i) > -1) {
      c++;
      i+= word.length;
    } else {
      break;
    }
  }
  return c;
};
    
exports.generate = function(document) {
  var segment = new Segment(),
      tfidf = new TfIdf(),
      words, freqs = {},
      rank = {};
  segment.useDefault();
  words = segment.doSegment(document).map(function(t) {
    return t.w;
  });
  debug("segmented words %s", words);
  tfidf.addDocument(words);
  // words.forEach(function(item) {
  //   freqs[item] = count(words, item);
  //   if(!rank[item]) {
  //     rank[item] = tfidf.tfidf(item, 0);
  //   }
  //   debug(tfidf.listTerms(0).map(function(t) {return t.term;}));
  //   debug("%s, df %s, idf %s", item, freqs[item], rank[item]);
  // });
  // return Object.keys(rank).map(function(k) {
  //   return {
  //     word: k,
  //     value: rank[k]
  //   };
  // }).sort(function(a, b) {
  //   return a.value - b.value;
  // });
  return _.uniq(tfidf.listTerms(0), true);
};