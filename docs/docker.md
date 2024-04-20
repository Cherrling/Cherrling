## Docker安装

### 安装
首先，您需要添加Docker官方仓库以获取最新的Docker软件包。在终端中执行以下命令：
```
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```
随后，更新包列表并安装Docker Community Edition（CE）。执行以下命令完成安装：

```
sudo apt update
sudo apt install docker-ce
```

安装完成后，Docker服务将自动启动。您可以使用以下命令检查Docker服务的状态：
```
sudo systemctl status docker
```

如果显示active (running)则表示Docker服务已成功启动。


为了验证安装是否成功，您可以运行以下命令来检查Docker版本：
```
docker --version
```
如果显示Docker版本号，则表示安装成功。



### 管理容器

您可以使用以下命令来管理容器的生命周期和状态：

`docker ps`：列出正在运行的容器。

`docker stop container_id`：停止某个容器。

`docker start container_id`：启动某个容器。

`docker restart container_id`：重新启动某个容器。

### 清理容器和镜像

您可以使用以下命令来清理无用的容器和镜像：

`docker container prune`：清理处于停止状态的容器。

`docker image prune`：清理无用的镜像。


## Portainer安装
```
docker run -d -p 9000:9000 --name portainer --restart always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce
```



## latest标签或unstable标签
```
docker run -dit \
  -v /root/qbittorrent:/data `# 冒号左边请修改为你想在本地保存的路径，这个路径用来保存你个人的配置文件` \
  -e PUID="1000"        `# 输入id -u可查询，群晖必须改` \
  -e PGID="100"         `# 输入id -g可查询，群晖必须改` \
  -e WEBUI_PORT="8080"  `# WEBUI控制端口，可自定义` \
  -e BT_PORT="34567"    `# BT监听端口，可自定义` \
  -e QB_USERNAME="admin"    `#用户名` \
  -e QB_PASSWORD="passwd"    `#密码` \
  -p 8080:8080          `# 冒号左右一样，要和WEBUI_PORT一致，命令中的3个8080要改一起改` \
  -p 34567:34567/tcp    `# 冒号左右一样，要和BT_PORT一致，命令中的5个34567要改一起改` \
  -p 34567:34567/udp    `# 冒号左右一样，要和BT_PORT一致，命令中的5个34567要改一起改` \
  --tmpfs /tmp \
  --restart always \
  --name qbittorrent \
  --hostname qbittorrent \
  nevinee/qbittorrent:4.6.2   `# 如想参与qbittorrent测试工作，可以指定测试标签nevinee/qbittorrent:unstable`
```