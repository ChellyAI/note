优点：

1.cd时选择有明确位置提示

2.可以通过颜色知道是否有这个库、命令

3.自动提醒你在哪个分支

4.自动提示你之前写过的命令

5.方便、快捷、开箱即用，几乎零配置




1.下载fish

官网https://fishshell.com/ 提供了4种下载的方法，推荐是直接下载pkg的包后打开安装




2.重启查看是否可用

重启终端，进入敲入fish，查看是否成功切换到fish shell




3.fish使用nvm问题

fish默认是不支持nvm的，如果不想进行配置可以暂时先切换到其他shell，然后再使用nvm。




4.fish解决使用nvm使用问题（已安装nvm情况下）

1）下载oh-my-fish: curl -L https://get.oh-my.fish | fish，记得给终端设上代理

2）下载Bass：omf  install bass

3）配置config.fish：

（1）cd ~/.config/fish/

（2）vim config.fish

（3）在文件里添加以下代码：

function nvm

    bass source /usr/local/opt/nvm/nvm.sh ';' nvm $argv // 这里的执行路径修改成自己的.nvm的位置

end

（4）保存退(按esc、输入:wq、按enter)




5.完成

退出终端后再打开执行nvm list




6.其他

不推荐将fish设成默认shell，不推荐将fish设成默认shell，不推荐将fish设成默认shell；推荐方法是进入终端后输入fish切换成fish，将fish设成默认shell会造成一些命令无法使用，这可能与shell的默认path有关。（和默认配置的路径有关系）




7.终端推荐（iTerm）

Mac自带的终端在command+D时，并不能实现真正的同窗不同终端窗口，只能用command+T多窗口，但是在切换的时候较为麻烦，有时候一个项目需要启动多个命令，所以推荐iTerm，好用！




8.自定义函数

下面的nn就是使用自定义函数，$argv是传进来的参数列表，可以通过$argv[1]来获取第一个参数（fish的数组是从1开始的）。





