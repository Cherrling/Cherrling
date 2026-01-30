
# IPv4 & IPv6 速查

https://zh.wikipedia.org/wiki/IPv4

https://zh.wikipedia.org/wiki/IPv6



## 保留的地址块

| CIDR 地址块 | 描述 | 参考资料 |
| --- | --- | --- |
| 0.0.0.0/8 | 本网络（仅作为源地址时合法） | [RFC 6890](https://datatracker.ietf.org/doc/html/rfc6890) |
| 10.0.0.0/8 | 专用网络 | [RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918) |
| 100.64.0.0/10 | 电信级 NAT | [RFC 6598](https://datatracker.ietf.org/doc/html/rfc6598) |
| 127.0.0.0/8 | 环回 | [RFC 5735](https://datatracker.ietf.org/doc/html/rfc5735) |
| 169.254.0.0/16 | 链路本地 | [RFC 3927](https://datatracker.ietf.org/doc/html/rfc3927) |
| 172.16.0.0/12 | 专用网络 | [RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918) |
| 192.0.0.0/24 | 保留（IANA） | [RFC 5735](https://datatracker.ietf.org/doc/html/rfc5735) |
| 192.0.2.0/24 | TEST-NET-1，文档和示例 | [RFC 5735](https://datatracker.ietf.org/doc/html/rfc5735) |
| 192.88.99.0/24 | 6to4 中继 | [RFC 3068](https://datatracker.ietf.org/doc/html/rfc3068) |
| 192.168.0.0/16 | 专用网络 | [RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918) |
| 198.18.0.0/15 | 网络基准测试 | [RFC 2544](https://datatracker.ietf.org/doc/html/rfc2544) |
| 198.51.100.0/24 | TEST-NET-2，文档和示例 | [RFC 5737](https://datatracker.ietf.org/doc/html/rfc5737) |
| 203.0.113.0/24 | TEST-NET-3，文档和示例 | [RFC 5737](https://datatracker.ietf.org/doc/html/rfc5737) |
| 224.0.0.0/4 | 多播（之前的 D 类网络） | [RFC 3171](https://datatracker.ietf.org/doc/html/rfc3171) |
| 240.0.0.0/4 | 保留（之前的 E 类网络） | [RFC 1700](https://datatracker.ietf.org/doc/html/rfc1700) |
| 255.255.255.255/32 | 受限广播 | [RFC 919](https://datatracker.ietf.org/doc/html/rfc919) |

## 专用网络

在 IPv4 所允许的大约四十亿地址中，三个地址块被保留作专用网络。这些地址块在专用网络之外不可路由，专用网络之内的主机也不能直接与公共网络通信。但通过网络地址转换（NAT），使用这些地址的主机可以像拥有公共地址的主机一样在互联网上通信。

下表展示了三个被保留作专用网络的地址块（[RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918)）：

| 名字 | 地址范围 | 地址数量 | 有类别的描述 | 最大的 CIDR 地址块 |
| --- | --- | ---: | --- | --- |
| 24 位块 | 10.0.0.0–10.255.255.255 | 16,777,216 | 一个 A 类 | 10.0.0.0/8 |
| 20 位块 | 172.16.0.0–172.31.255.255 | 1,048,576 | 连续的 16 个 B 类 | 172.16.0.0/12 |
| 16 位块 | 192.168.0.0–192.168.255.255 | 65,536 | 连续的 256 个 C 类 | 192.168.0.0/16 |
