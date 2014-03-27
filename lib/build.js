var cheerio = require("cheerio"),
    context = require("./template/context"),
    localization = require("./template/localization");

exports.postCompile = function(html, data) {
  var $ = cheerio.load(html), title,
      mdSuffix = /\.md$/i;
  
  //update title
  title = [$("h1").eq(0).text(), context.title].join(" - ");
  data.title = title;
  
  //update links
  $("a").each(function(i) {
    var $this = $(this);
    if($this.attr("href")) {
      $this.attr("href", $this.attr("href").replace(mdSuffix, ".html"));
    }
  });
  
  //update breadcrumbs
  var breadcrumbs = data.filepath.split("/");
  breadcrumbs.shift();
  // breadcrumbs.push(breadcrumbs.pop().replace(mdSuffix, ""));
  breadcrumbs.pop();
  data.breadcrumbs = breadcrumbs.filter(function(item) {
    return item !== "index";
  }).reduce(function(prev, cur) {
    prev.push({
      localized: localization[cur] || cur + "(Unlocalized)",
      original: cur,
      link: prev.length ? prev[prev.length-1] + cur + "/" : "/" +  cur + "/"
    });
    return prev;
  }, []);
  return $.html();
};