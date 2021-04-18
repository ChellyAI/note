更多内容可参考[这里](https://www.cnblogs.com/zhuzhenwei918/p/6124263.html)

### padding 和 margin 的百分比代表什么意思？为什么？

&emsp;&emsp;百分比代表的意义都是**相对于父元素宽度取值**。如果父元素没宽度，就继续往上找父辈元素，直到屏幕为止。W3C文档中的描述是：

```
Percentages: refer to logical width of containing block
```

&emsp;&emsp;那么问题来了，为什么百分比是相对于父元素宽度呢？

参考[这篇文章](https://www.hongkiat.com/blog/calculate-css-percentage-margins/)，可以总结两点：

- margin/padding 的计算都基于同一个值，父元素 width 进行计算，能够保证上下左右四个值的一致性
- 由于父元素高度是根据其所包含的子元素进行计算的，如果子元素的 margin/padding 基于父元素高度计算，就会引起高度计算的循环依赖

### 为什么第一个子元素设置 margin-top，父元素也跟着移动了？

例如：

```react
//	子元素并不会距离父元素的上边40px，而是父元素会有了外上边距40px
function test() {
    return (
    	<div>
        	<div
                style={{
					marginTop: 40,
                }}
            />
        </div>
    )
}
```

&emsp;&emsp;垂直外边距合并问题常见于第一个子元素的 margin-top 会顶开父元素与父元素相邻元素的间距。

&emsp;&emsp;根据规范，一个盒子如果没有上补白（padding-top）和上边框（border-top），那么这个盒子的上边距会和其内部文档流中的第一个子元素发生上边距重叠。

&emsp;&emsp;解决方法：

1. 父元素添加 padding-top
2. 父元素添加 border-top
3. 父元素设置 overflow: hidden/auto
4. 父元素或子元素浮动
5. 父元素或子元素 position: absolute

### padding 百分比的使用场景

&emsp;&emsp;可以实现元素高度为自身宽度的一半。
```css
padding: 25% 0;

//  或者top、bottom两者其一
padding-top: 50%;
```