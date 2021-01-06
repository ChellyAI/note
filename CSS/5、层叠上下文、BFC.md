## **层叠上下文、BFC**

[点击这里看大佬讲解层叠上下文的好文](https://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/)
### **一、概念**

&emsp;&emsp;需要分清楚，**层叠上下文、层叠水平、层叠顺序**三者之间有什么区别。

1. **层叠上下文**

&emsp;&emsp;一个元素含有层叠上下文，就可以理解为这个元素在 z 轴上“高人一等”。

2. **层叠水平**

&emsp;&emsp;层叠水平决定了同一个层叠上下文中元素在 z 轴上的显示顺序。普通元素的层叠水平由层叠上下文决定，因此层叠水平的比较只有在当前层叠上下文元素中才有意义。

3. **层叠顺序**

&emsp;&emsp;层叠顺序表示元素发生层叠时有着特定的垂直显示顺序。**层叠上下文和层叠水平是概念，而层叠顺序是规则**。

注意：
- 位于最低水平的 `border/background` 指的是层叠上下文元素的边框和背景色。每一个层叠顺序规则适用于一个完整的层叠上下文元素。
- `inline-block` 和 `inline` 元素是同等级别的
- `z-index: 0` 实际上和 `z-index: auto` 单纯从层叠水平上看，可以看成一样的。实际上两者在层叠上下文领域有根本性的差异。

### **二、层叠上下文特性**

&emsp;&emsp;层叠上下文元素有如下特性：
1. 层叠上下文的层叠水平比普通元素高
2. 层叠上下文可以阻断元素的混合模式
3. 层叠上下文可以嵌套，内部层叠上下文及其子元素均受制于外部的层叠上下文
4. 每个层叠上下文和兄弟元素独立，也就是当进行层叠变化或渲染的时候，只考虑后代元素
5. 每个层叠上下文自成体系，当元素发生层叠的时候，整个元素被认为是在父层叠上下文的层叠顺序中

（大佬的描述）翻译成真实世界语言就是：

1. 当官的比老百姓更有机会面见圣上；
2. 领导下去考察，会被当地官员阻隔只看到繁荣看不到真实民情；
3. 一个家里，爸爸可以当官，孩子也是可以同时当官的。但是，孩子这个官要受爸爸控制。
4. 自己当官，兄弟不占光。有什么福利或者变故只会影响自己的孩子们。
5. 每个当官的都有属于自己的小团体，当家眷管家发生摩擦磕碰的时候（包括和其他官员的家眷管家），都是要优先看当官的也就是主子的脸色。

### **三、层叠上下文的创建**

&emsp;&emsp;层叠上下文是由一些特定的 CSS 属性创建的，总结如下：
1. 页面根元素天生具有层叠上下文，称之为“根层叠上下文”
2. z-index 值为数值的定位元素的传统层叠上下文
3. 其他 CSS3 属性




- 触发条件
    - 根层叠上下文（html）
    - position
    - css3属性
        - flex
        - transform
        - opacity
        - filter
        - will-change
        - -webkit-overflow-scrolling

- 有两条元素发生层叠时候的规则：
    - **谁大谁上**：当具有明显的层叠水平标示的时候，如识别z-index的值，在同一个层叠上下文领域，层叠水平值大的那一个覆盖小的那一个
    - **后来居上**：元素的层叠水平一致，层叠顺序相同时，在DOM流中处于后面的元素会覆盖前面的元素

![avatar](./img/stacking-order.png)

## **什么是BFC**

[BFC详解看这里](https://www.zhangxinxu.com/wordpress/2015/02/css-deep-understand-flow-bfc-column-two-auto-layout/)

&emsp;&emsp;W3C对BFC的定义如下：
- 浮动元素和绝对定位元素
- 非块级盒子的块级容器（inline-blocks,table-cells,table-captions)
- overflow值不为"visible"的块级盒子
都会为他们的内容创建新的BFC（Block Fromatting Context，即块级格式上下文）

## **触发条件**

&emsp;&emsp;一个HTML元素要创建BFC，满足下列任意一个或多个条件即可：
- 根元素
- 浮动元素（float不是none）
- 绝对定位元素（position为absolute或fixed）
- 行内块元素（display为inline-block）
- 表格单元格（display为table-cell，HTML表格单元格默认为该值）
- 表格标题（display为table-caption，HTML表格标题默认为该值）
- 匿名表格单元格元素（display为table、table-row、table-row-group、table-header-group、table-footer-group）
- overflow值不为visible的块元素、弹性元素（display为flex或inline-flex元素的直接子元素）
- 网格元素（display为grid或inline-grid元素的直接子元素）

## **BFC渲染规则**

1. BFC垂直方向边距重叠
2. BFC的区域不会与浮动元素的box重叠
3. BFC是一个独立的容器，外面的元素不会影响里面的元素
4. 计算BFC高度的时候浮动元素也会参与计算

## **应用场景**

1. 防止浮动导致父元素高度坍塌


2. 避免外边距折叠

