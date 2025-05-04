
# Linux 命令速查

## 脚本速查
https://blog.cmliussss.com/p/bash/
#### IP质量体检脚本
```shell
bash <(curl -Ls IP.Check.Place)
```
#### VPS融合怪服务器测评脚本
```shell
curl -L https://github.com/spiritLHLS/ecs/raw/main/ecs.sh -o ecs.sh && chmod +x ecs.sh && bash ecs.sh -m 1
```

```shell
curl -L https://ghproxy.cc/https://github.com/spiritLHLS/ecs/raw/main/ecs.sh -o ecs.sh && chmod +x ecs.sh && bash ecs.sh -m 1
```
#### 检测VPS内存是否超售的一键脚本
```shell
curl https://raw.githubusercontent.com/uselibrary/memoryCheck/main/memoryCheck.sh | bash
```

```shell
curl https://ghproxy.cc/https://raw.githubusercontent.com/uselibrary/memoryCheck/main/memoryCheck.sh | bash
```
## 新机器一键速装环境
  
是的，截至 2024.11.07 ，我只用 Debian 系。

```shell
sudo apt -y install git curl wget vim neofetch htop btop tmux zsh lsof net-tools mtr vnstat 
```

### NextTrace

https://github.com/nxtrace/NTrace-core

```shell
curl nxtrace.org/nt |bash
```

## Oh-My-Zsh

```shell
sudo apt update
sudo apt install zsh
```

```shell
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

```shell
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

如果是国内的机器，可以考虑使用 Cloudflare 加速：
```shell
wget https://ghproxy.cc/https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh
```

```shell
git clone https://ghproxy.cc/https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://ghproxy.cc/https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

在 .zshrc 中

```shell
plugins=(   git
            python
            z
            sudo
            copyfile
            copypath
            zsh-autosuggestions
            zsh-syntax-highlighting
)
```

```shell
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="ys"
plugins=(   git
            python
            z
            sudo
            copyfile
            copypath
            zsh-autosuggestions
            zsh-syntax-highlighting
)

source $ZSH/oh-my-zsh.sh
```


## Debian 解决输入法问题

https://zhuanlan.zhihu.com/p/691125259

Xwayland/X11下应用程序无法输入(Chromium系程序)/Gtk2程序(GIMP 2.10/pinentry-gtk-2(GPG Agent Pin输入对话框))无法输入
临时解决方案

Chromium:在 ~/.config/gtk-3.0/settings.ini 里写下 gtk-im-module=fcitx


## 流量消耗器

好 tm 有病的玩意，不过也是让我想起了一众被刷的镜像站

https://www.right.com.cn/forum/thread-8351068-1-1.html

```shell
wget -O /dev/null https://speed.cloudflare.com/__down?bytes=1000000000000
```

还有 web 版

https://shua.leyz.top/


## Linux新建用户，授予sudo权限

```shell
sudo useradd -m 用户名
```

```shell
sudo passwd 用户名
```

```shell
sudo usermod -aG sudo username
groups username
```

## Linux关闭ssh密码登录

```shell
sudo vim /etc/ssh/sshd_config
```

找到以下行：

`#PasswordAuthentication yes`

修改该行，去掉注释并将yes改为no：

`PasswordAuthentication no`

```shell
sudo vim .ssh/authorized_keys
```


## Ubuntu安装vsftpd

```shell
sudo apt-get update
sudo apt-get install vsftpd
vsftpd -v
```

```shell
sudo nano /etc/vsftpd.conf
```

```conf
# 示例配置文件，地址： /etc/vsftpd.conf

# 用来设置vsftpd是否以独立守护进程运行。
# 如果设置为"listen=YES"，则表示vsftpd将作为独立守护进程运行；
# 如果设置为"listen=NO"，则表示vsftpd将不会以独立守护进程运行，而是通过inetd或者initscript启动。
listen=NO
#
# 设置vsftpd是否启用IPv6监听。
# 如果设置为"listen_ipv6=YES"，则表示vsftpd将启用IPv6监听；
# 如果设置为"listen_ipv6=NO"，则表示vsftpd将不会启用IPv6监听。
# 默认情况下，IPv6监听地址为"::"，同时可以接受IPv6和IPv4客户端的连接。
# 如果你只需要监听IPv4或IPv6地址，则不需要同时启用两种监听，如果你需要同时监听特定的IPv4和IPv6地址，则需要运行两个vsftpd实例，并使用两个不同的配置文件来进行配置。
listen_ipv6=YES
#
# 设置是否允许匿名FTP登录。
anonymous_enable=NO
#
# 设置是否允许本地用户登录FTP服务器。
local_enable=YES
#
# 设置是否允许FTP用户执行写入操作。
write_enable=YES
#
# 设置本地用户的默认umask值。
# umask是一个三位八进制数，用来控制新建文件或目录的访问权限。
# 在FTP服务器中，local_umask选项用来设置本地用户上传文件或创建目录时的默认权限。
# 默认情况下，local_umask的值为077，表示新建的文件或目录权限为只有所有者可读、可写、可执行，其他用户无权访问。
# 如果你的用户希望默认权限为所有者可读、可写、可执行，其他用户可读、可执行，则可以将local_umask的值设置为022。
local_umask=022
# 这段配置文件是用来设置是否启用目录消息功能。
# 如果设置为YES，则表示启用目录消息功能。当远程用户进入某个目录时，会显示该目录的消息。
dirmessage_enable=YES
#
# 设置是否启用本地时间功能。
# 启用本地时间功能后，vsftpd将会在目录列表中显示本地时间而非GMT时间。
use_localtime=YES
#
# 启用上传和下载日志记录功能。
# 启用该功能后，vsftpd会记录每个用户的上传和下载操作，并将其记录到指定的日志文件中。
xferlog_enable=YES
#
# 设置数据传输的端口号。
# 将其值设置为YES，则表示数据传输使用的端口号为20。
connect_from_port_20=YES
# 设备限制本地用户仅访问其home目录。
# 如果启用，则本地用户将仅访问其home目录和其子目录，无法访问其他目录。
chroot_local_user=YES
#
# 是否允许本地用户，是否将本地用户限制在其主目录中，如果设置为YES，则不会将列在chroot_list_file中的用户限制在其主目录中。
# chroot_local_user=YES
# 是否启用chroot_list_file列表，用于指定哪些用户不应该被限制在主目录中。
chroot_list_enable=YES
# 指定了chroot_list_file列表的路径和名称。一行一个用户名。
chroot_list_file=/etc/vsftpd.chroot_list
allow_writeable_chroot=YES
#
# 指定vsftpd将使用的PAM服务的名称。
# 默认情况下，pam_service_name的值为“vsftpd”，这意味着vsftpd将使用名为“vsftpd”的PAM服务来进行认证。
# 如果需要使用其他的PAM服务，可以修改该选项的值。
pam_service_name=vsftpd

# 是否启用SSL加密连接。
ssl_enable=NO
```

```shell
sudo vim /etc/vsftpd.chroot_list
```

将刚刚创建的FTP用户添加进去.

```shell
sudo service vsftpd restart
```

使用`ps -aux | grep vsftpd` 查看服务是否启动

---

## Ubuntu安装JDK

```shell
sudo apt install openjdk-8-jdk
```
```shell
sudo apt install default-jdk
```
```shell
sudo apt install default-jre
```