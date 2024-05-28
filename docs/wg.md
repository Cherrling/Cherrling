
# WirdGuard速通

*感谢hyf先生撰写此文*

windows端下载wg客户端，linux端包管理装**wg-quick**

客户端配置文件
```
[Interface]
PrivateKey = [客户端私钥]
Address = 192.168.132.2/24

[Peer]
PublicKey = [服务器端公钥]
AllowedIPs = 192.168.132.0/24
Endpoint = [服务器ip]:[服务器端口]
PersistentKeepalive = 10
```
密钥在windows下新建空隧道自动生成，linux下命令详看下文。

服务端配置文件 文件名和服务名自动对应。举例：起名为wg0.conf

```
[Interface]
ListenPort = [服务器端口]
Address=192.168.132.1/24
PrivateKey = [服务端私钥]
PostUp   = iptables -I FORWARD -i %i -j ACCEPT; iptables -I FORWARD -o %i -j ACCEPT; iptables -t nat -I POSTROUTING -o eth0 -j MASQUERADE; ip route add 192.168.132.0/24 dev %i;
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE; ip route del 192.168.132.0/24 dev %i;

[Peer]
PublicKey = [客户端公钥]
AllowedIPs = 192.168.132.2/32

[Peer]
PublicKey = [客户端公钥]
AllowedIPs = 192.168.132.3/32

[Peer]
PublicKey = [客户端公钥]
AllowedIPs = 192.168.132.4/32

```

服务端(或linux客户端）生成密钥方法
root 用户 cd到 /etc/wireguard下 注意把/etc/wireguard的权限改成600
wg genkey > privatekey
wg pubkey < privatekey > publickey



服务端通常位置是/etc/wireguard,这个目录的权限通常是600，里边私钥的权限一般是600


比如你的配置文件名字是wg0.conf那么enable服务的命令是
```shell
systemctl enable --now wg-quick@wg0
```
enable后它会随着你的系统自动启动

然而实际上wg是不区分服务端和客户端的。