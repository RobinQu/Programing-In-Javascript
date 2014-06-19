## inline style

```
el.style.fontSize = "24pt";
```


## Computed style

```
var title = document.getElementById("title");
var styles = window.getComputedStyle(title, null);
```

For IE8 band below:

```
var styles = el.currentStyle;
```

// Finding stylesheet

```
var ss = document.styleSheets[0];

var rules = ss.cssRules ? ss.cssRules : ss.rules;

var selector = rule.selectorText;
var ruleText = rule.style.cssText;
```

Adding rule

```
// W3C
ss.insertRule("h2 {padding: 10px}", 0);
// IE
ss.addRule("h2", "padding: 10px", 0);

```

Delete rule
```
// W3C
ss.deleteRule(0);
// IE
ss.removeRule(0);

```

Create new stylesheet

```
// IE
var stylesheet = document.createStyleSheet();
```

```
//W3C
var head = document.getElementsByTagName("head")[0],
    styleEl = document.createElement("style");
head.appendChild(styleEl);
// last one is new newly created stylesheet
var styleSheet = document.styleSheets[document.styleSheets.length-1]
```


Insert css content

```
// IE
styleSheet.cssText = stylesText;
```

```
styleEl.innerHTML = stylesText;
```
