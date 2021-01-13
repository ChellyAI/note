# opacity、visibility、display三者区别

opacity 将元素变透明，如果其中某个透明的按钮有绑定事件，那么误触是可以触发事件的

visibility 相比 opacity 能够让事件不被触发

display:none 则直接将整个 DOM 结构去掉了

使用记录：

在实现实验室左侧菜单栏点击后改变内容区时，为了保证用户的实验报告编辑内容不被重置，就需要让 DOM 结构还存在与文档中，因此不能用 display:none。最开始用 visibility 配合高度变为 100% 或 0 ，但切换时会有不顺畅的问题，某些 antd 的 button、table的结构会有卡顿延迟才消失的现象，改用 opacity 就没这种问题了。
