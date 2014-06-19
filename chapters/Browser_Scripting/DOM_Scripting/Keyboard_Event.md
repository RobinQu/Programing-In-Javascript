# Keyboard Event

* char
* charCode
* code
* key
* keyCode
* which
* repeat

keydown 当一个按键被压下，如果一直保持压下状态，会持续触发
keypress 当一个字符因按键而产生时会触发该事件，也有可能因为持续按下而多次触发
keyup 当一个按键被释放时，并且默认行为被出发后，再触发该事件
textinput 当一个字符的确被产生后触发；假若按键的默认行为在`keydown`或`keypress`时被组织时，字符不会产生，这个事件也不会触发。


keydown、keyup事件上，总是有`keyCode`
charCode只在keypress
不论那种键盘事件都应该有`which`

ctrlKey
shiftKey
altKey
