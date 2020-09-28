DOM-diff过程
- 用JavaScript模拟DOM（虚拟DOM）
- 把虚拟DOM转换为真实的DOM插入页面中（render）
- 如果有事件发生修改了虚拟DOM，则比较两个虚拟DOM树的差异，得到diff
- 将差异对象应用到真正的DOM上（patch）
