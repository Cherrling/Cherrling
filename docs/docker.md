## Docker安装

### 安装
首先，您需要添加Docker官方仓库以获取最新的Docker软件包。在终端中执行以下命令：
```shell
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```
随后，更新包列表并安装Docker Community Edition（CE）。执行以下命令完成安装：

```shell
sudo apt update
sudo apt install docker-ce
```

安装完成后，Docker服务将自动启动。您可以使用以下命令检查Docker服务的状态：
```shell
sudo systemctl status docker
```

如果显示active (running)则表示Docker服务已成功启动。


为了验证安装是否成功，您可以运行以下命令来检查Docker版本：
```shell
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



##  Qbittorrent： latest标签或unstable标签
```shell
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

## Teamspeak Docker

https://www.cnblogs.com/CodeAndMoe/p/18087680

```shell
sudo docker pull teamspeak
sudo docker run --restart=always -d -p 9987:9987/udp -p 10011:10011 -p 30033:30033 -e TS3SERVER_LICENSE=accept teamspeak
sudo docker ps
sudo docker logs {容器ID}
```
防火墙打开 9987 UDP 端口，10011 和 30033 TCP端口

9987 端口：语音服务端口

30033 端口：文件传输

10011 端口：服务器查询