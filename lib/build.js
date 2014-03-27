var cheerio = require("cheerio"),
    context = require("./template/context");

exports.postCompile = function(html, data) {
  var $ = cheerio.load(html), title;
  
  //update title
  title = [$("h1").eq(0).text(), context.title].join(" - ");
  data.title = title;
  
  //update links
  $("a").each(function(i) {
    var $this = $(this);
    if($this.attr("href")) {
      $this.attr("href", $this.attr("href").replace(/\.md$/i, ".html"));
    }
  });
  
  
  return $.html();
};