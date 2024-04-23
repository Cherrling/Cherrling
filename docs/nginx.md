# Nginx 安装

```
sudo apt-get update
sudo apt-get install nginx
nginx -v

```



```# 查看nginx帮助文档
nginx -h

# 在Linux系统中，可以使用man命令查看nginx详细帮助文档
man nginx

# 检测nginx配置文件语法是否正确
nginx -t

# 检测nginx配置文件语法是否正确，并把nginx配置文件信息输出到屏幕
nginx -T

# 设置nginx使用的配置文件（默认使用：/usr/local/etc/nginx/nginx.conf）
nginx -c nginx_file.conf

# 向nginx主进程发送信号，stop, quit, reopen, reload
nginx -s stop # 停止Nginx进程

nginx -s quit # 快速停止Nginx进程，但允许完成已经接受的连接请求

nginx -s reopen # 重新打开日志文件

# 与stop不同，reload不会完全停止Nginx进程，而是平滑地重新加载配置文件，并在新的工作进程中对已有的连接进行服务，可在不停止服务的情况下实现动态更新配置
nginx -s reload ```