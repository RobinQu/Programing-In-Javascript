var keyword = require("../lib/keyword");

describe("keyword generator", function() {
  it("should do simple keyword generations", function() {
    var txt = "Nokia 之前推出的 Lumia 1520 的确是一部非常不错的手机，只是其 6 吋大小的萤幕虽然好看，却未必每个人都可以接受。想要一部更近似手机的装置的话，美国的使用者早前就多了 Lumia Icon 这个选择，只是此机乃 Verizon 限定，所以即使是在美国，也不是每个人都可以使用得到。然而这个困局今天将要打破，因为 Nokia 刚刚发表了可以说是 Lumia Icon 国际版的 Lumia 930。";
    var results = keyword.generate(txt), i, len;
    expect(results.length).toBeTruthy();
    for(i=0,len=results.length; i<len-1; i++) {
      expect(results[i].tfidf).not.toBeLessThan(results[i+1].tfidf);
    }
    
  });
});