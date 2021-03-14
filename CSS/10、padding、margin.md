### padding 和 margin 的百分比代表什么意思？

&emsp;&emsp;百分比代表的意义都是**相对于父元素宽度取值**。如果父元素没宽度，就继续往上找父辈元素，直到屏幕为止。

### padding 百分比的使用场景

&emsp;&emsp;可以实现元素高度为自身宽度的一半。
```css
padding: 25% 0;

//  或者top、bottom两者其一
padding-top: 50%;
```