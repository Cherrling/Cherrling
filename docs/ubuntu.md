
## Ubuntu安装vsftpd

```
sudo apt-get update
sudo apt-get install vsftpd
vsftpd -v
```
```
sudo nano /etc/vsftpd.conf
```

``` 
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

```
sudo nano /etc/vsftpd.chroot_list
```

将刚刚创建的FTP用户添加进去.

```
sudo service vsftpd restart
```

使用`ps -aux | grep vsftpd` 查看服务是否启动

---

## Ubuntu安装JDK

```
sudo apt install openjdk-8-jdk
```
```
sudo apt install default-jdk
```
```
sudo apt install default-jre
```