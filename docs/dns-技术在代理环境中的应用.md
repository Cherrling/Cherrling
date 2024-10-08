# 漫谈各种黑科技式 DNS 技术在代理环境中的应用

这篇文章目的是以非技术性例举方式，谈一谈各种 DNS 技术在代理环境中如何工作，主要集中在对 V2Ray 的使用上。

因为最近 V2Ray 发布了一个 DNS 相关的功能：https://steemit.com/cn/@v2ray/dns  ，其用法很多，可以解决很多问题，但如果不理解其工作方式，就很难做出合理的配置。

本文所讨论的也不单纯是 DNS，还涉及 V2Ray 的部分工作原理，因为我们的讨论是依赖于使用 V2Ray 来对 DNS 流量做各种处理的。所以也希望读者看懂了文章中的例子后，可以举一反三，从而更好理解 V2Ray 的整体工作原理。

本文举例范围预计会包括桌面系统（Windows, macOS）、移动端（iOS, Android）、普通浏览器代理（系统代理）、全局代理（tun2socks），或许还会聊聊路由器上的透明代理。

## 桌面端环境

先从非常简单的例子说起，了解下大概的过程。

首先说一下不开任何代理软件，不做任何代理设置时，DNS 的工作方式：

```md
S1
1. 浏览器地址栏输入 www.bilibili.com，敲下 Enter
2. 浏览器发起针对 "www.bilibili.com" 这个域名的 DNS 请求
3. 假设系统 DNS 设置了 114.114.114.114
4. 承载 DNS 请求的 UDP 流量就会从你本机直接发到 114.114.114.114
5. 114.114.114.114 接收了这些 UDP 流量
6. 114.114.114.114 从这些 UDP 流量中解析出请求的域名 "www.bilibili.com"
7. 114.114.114.114 尝试从自己缓存里找结果，有的话返回结果
8. 114.114.114.114 如果没缓存，会向其它 DNS 服务器要结果，拿到后返回
9. 浏览器收到 114.114.114.114 返回的结果
10. 浏览器开始真正地对 Bilibili 的服务器发起 HTTP/HTTPS 连接
```
下面假设在系统或浏览器中设置了 SOCKS 5（注意是 SOCKS 5，版本 5）代理服务器地址为：127.0.0.1:1086

::: info
Windows 系统的用户需要注意，系统代理里直接设置 SOCKS 代理有可能用的不是 SOCKS 5，而是 SOCKS 4，SOCKS 4 是不支持远程 DNS 解析的，想要设置 SOCKS 5 的话要用 PAC 文件，PAC 文件内容可以这么写：

function FindProxyForURL(url, host) {
return "SOCKS5 127.0.0.1:1086; SOCKS 127.0.0.1:1086";
}
:::

然后在本地开启一个 V2Ray，配置大概如下：

```json
C1
{
    "dns": {
        "servers": [
            "223.5.5.5",
            "8.8.8.8"
        ]
    },
    "outbounds": [
        {
            "protocol": "freedom",
            "settings": {}
        }
    ],
    "inbounds": [
        {
            "domainOverride": [
                "http",
                "tls"
            ],
            "port": 1086,
            "listen": "127.0.0.1",
            "protocol": "socks",
            "settings": {
                "auth": "noauth",
                "udp": true,
                "ip": "127.0.0.1"
            }
        }
    ]
}
```

在这个基础上对比上面（S1）不设置代理的情况：

```md
S2
1. 浏览器地址栏输入 www.bilibili.com，敲下 Enter
2. 浏览器发现设置了 SOCKS 代理，因为 SOCKS 代理可以把域名传给服务器处理
3. 所以浏览器不需要做 DNS 请求，直接把域名放进 SOCKS 请求中发给代理服务器
4. 我们的代理服务器(V2Ray) 127.0.0.1:1086 收到了这个 SOCKS 代理请求
5. 代理服务器(V2Ray) 从 SOCKS 请求中解析出 "www.bilibili.com" 这个域名
6. 代理服务器(V2Ray) 要代理这个请求，但因为只有一个 Freedom outbound
7. 于是就用 Freedom outbound 向 www.bilibili.com 发起 TCP 连接
8. Freedom outbound 要向一个域名发 TCP 连接，得先解析域名
9. 承载 DNS 请求的 UDP 流量就会从你本机直接发到 114.114.114.114
10. 114.114.114.114 接收了这些 UDP 流量
11. 114.114.114.114 从这些 UDP 流量中解析出请求的域名 "www.bilibili.com"
12. 114.114.114.114 尝试从自己缓存里找结果，有的话返回结果
13. 114.114.114.114 如果没缓存，会向其它 DNS 服务器要结果，拿到后返回
14. 程序(V2Ray)收到 114.114.114.114 返回的结果
15. 程序(V2Ray)开始真正地对 Bilibili 的服务器发起 TCP 连接
16. 连接一旦建立，代理服务器(V2Ray) 就可以真正地代理客户端(浏览器)的请求流量
```
上面（S2）设置不涉及任何远程代理服务器，由本地的 V2Ray 充当代了理服务器，代理的 www.bilibili.com 请求是采用直连方式，也一样有向 114.114.114.114 发出了 DNS 请求。但可以看到在后一个例子发起 DNS 请求的是 V2Ray（而不是浏览器），而从 Bilibili 的服务器看来，跟它连接是 V2Ray（而不是浏览器）。

加了这么一层代理，看起来什么都没发生，只是换了角色，其实不然，角色这么一换，可做的事情就相当多了。拿 DNS 来说，原来是浏览器发起的 DNS 请求，我们没办法控制浏览器怎么去发这个 DNS 请求（你不可能去改浏览器的源代码自己编译一个来用吧？），但换成由 V2Ray 来发这个 DNS 请求后，我们就可以做很多事情。

比如稍微改一下上面（C1）的配置，在 `Freedom oubound` 中加入 `"domainStrategy": "UseIP"`

```json
C2
{
    "dns": {
        "servers": [
            "223.5.5.5",
            "8.8.8.8"
        ]
    },
    "outbounds": [
        {
            "protocol": "freedom",
            "settings": {
                "domainStrategy": "UseIP"
            }
        }
    ],
    "inbounds": [
        {
            "domainOverride": [
                "http",
                "tls"
            ],
            "port": 1086,
            "listen": "127.0.0.1",
            "protocol": "socks",
            "settings": {
                "auth": "noauth",
                "udp": true,
                "ip": "127.0.0.1"
            }
        }
    ]
}
```

[V2Ray](https://v2ray.com/chapter_02/protocols/freedom.html) 文档 中对 `domainStrategy` 的说明是这样的：

>在目标地址为域名时，Freedom 可以直接向此域名发出连接（"AsIs"），或者将域名解析为 IP 之后再建立连接（"UseIP"、"UseIPv4"、"UseIPv6"）。解析 IP 的步骤会使用 V2Ray 内建的 DNS。默认值为"AsIs"。

原本默认为 `AsIs` 的话，直接向域名发出连接就是说会用系统 DNS 来做 DNS 解析，但如果我们设置为 `UseIP` ，S2 中的步骤就会变成这样：

```md
S3
...
8. Freedom outbound 要向一个域名发 TCP 连接，得先解析域名
* Freedom outbound 用了 UseIP 策略，所以使用内置 DNS 来解析域名
* 内置 DNS 按顺序第一个是 223.5.5.5
* 内置 DNS 请求会按路由规则走，因为没有任何规则，且只有一个 Freedom outbound
* 内置 DNS 发到 223.5.5.5 的请求走 Freedom outbound
9. 承载 DNS 请求的 UDP 流量就会从你本机直接发到 223.5.5.5
10. 223.5.5.5 接收了这些 UDP 流量
11. 223.5.5.5 从这些 UDP 流量中解析出请求的域名 "www.bilibili.com"
12. 223.5.5.5 尝试从自己缓存里找结果，有的话返回结果
13. 223.5.5.5 如果没缓存，会向其它 DNS 服务器要结果，拿到后返回
14. 程序(V2Ray)收到 223.5.5.5 返回的结果
...
```

所以这里我们改了一个 `domainStrategy` 参数，就相当于覆盖了系统的 DNS，本来应该走 114.114.114.114（系统 DNS）的 DNS 请求现在走 223.5.5.5（V2Ray 内置 DNS）了。

上面例子都很简单，并没什么实际用处，但了解这些可以方便理解后续各种花式玩法。另外虽说简单，但也已经包括了几个需要关注的点。

比如在 S2 中是这么写的：

```md
浏览器发现设置了 SOCKS 代理
```
这里就得注意了，我们设置的 SOCKS 代理需要浏览器（应用程序）发现了，浏览器（应用程序）才会去使用它。如果应用程序没发现我们设置的系统代理呢？或者浏览器（应用程序）无视了我们设置的系统代理，按正常的流程去做请求呢？

这里的关键点是，一般桌面操作系统（Windows, macOS）中的系统代理设置只是一个 `可选` 的连接方式。

如果设置了系统代理，一般的浏览器程序（Chrome, Firefox, Safari）默认都会发现并遵从这个设置。其它的一些应用程序就不一定会遵从这个设置了，比如 QQ 这样的程序，它默认应该是不会遵从这个设置的（它有自己的设置项），再比如打开命令行，输入以下命令：

```shell
curl https://www.bilibili.com
```

`curl` 做的这个请求时是不会使用系统代理的。如果想让 `curl` 使用代理，可以这么设置一个环境变量， `curl` 会读取这个变量，从而得知代理的存在并使用它：

```shell
http_proxy=127.0.0.1:1086 curl https://www.bilibili.com
```

再比如上面场景中多次提到 DNS 请求相关内容时，用了 `DNS 请求` ，`承载 DNS 请求的 UDP 流量` 等多种说法，它们其实都是指同一个东西，只是在不同的上下文中用了不同的说法。

简单来说，从我们机器发出去的一个 DNS 请求会是这个样子的：

```md
F1
+------+-------+--------------------------+
| IP 头| UDP 头 | DNS 头 及 其 请 求 内 容  |
+------+-------+--------------------------+
```
重点：一般这种 DNS 请求都是纯文本（我们也只讨论这种 DNS），它们所流经的各种设备，各种程序都可以看到，可以修改里面的内容，发出的请求可以修改，返回的结果也可以修改，甚至修改过后毫无痕迹，就是说，对于发出的请求，DNS 服务器没办法知道它是否在中间链路被修改过，对于返回的结果，应用程序也没办法知道它是否在中间链路被修改过。

这是一个 IP 包，从某种角度来看可以说它是一个承载了 UDP 流量的 IP 包，其中 IP 头中包含了源地址（本机 IP）和目的地址（114.114.114.114），UDP 头中包含了源端口（随机）和目的端口（53），DNS 头及其请求内容中包含了请求要解析的域名（www.bilibili.com），要解析的 DNS 类型（A/AAAA）。

所谓在不同上下文用不同的说法，一般就是指在不同的时候我们关注不同信息，当表达流量从本机发送到 114.114.114.114，我们关注的是 IP 地址和端口，这时我们说承载 DNS 请求的 UDP 流量（因为 IP 地址和端口信息在 IP 头 和 UDP 头中），当我们只关注所要解析的域名 “www.bilibili.com” 时，会说 DNS 请求（因为这个信息在 DNS 头及其请求内容中）。更多的时候是混用，在这方面不会太严谨。

知道哪个信息包含在哪一部分的数据中，会对我们理解各种 DNS 技术的工作方式有很大帮助。

下面举一个实际使用中可能用上的例子，配置如下：

```json
C3
{
    "dns": {
        "servers": [
            "8.8.8.8",
            "localhost"
        ]
    },
    "outbounds": [
        {
            "protocol": "vmess",
            "settings": {
                "vnext": [
                    {
                        "users": [
                            {
                                "id": "xxx-x-x-x-xx-x-x-x-x"
                            }
                        ],
                        "address": "1.2.3.4",
                        "port": 10086
                    }
                ]
            },
            "streamSettings": {
                "network": "tcp"
            },
            "tag": "proxy"
        },
        {
            "tag": "direct",
            "protocol": "freedom",
            "settings": {}
        }
    ],
    "inbounds": [
        {
            "domainOverride": [
                "http",
                "tls"
            ],
            "port": 1086,
            "listen": "127.0.0.1",
            "protocol": "socks",
            "settings": {
                "auth": "noauth",
                "udp": true,
                "ip": "127.0.0.1"
            }
        }
    ],
    "routing": {
        "domainStrategy": "IPIfNonMatch",
        "rules": [
            {
                "type": "field",
                "ip": [
                    "8.8.8.8"
                ],
                "outboundTag": "proxy"
            },
            {
                "type": "field",
                "domain": [
                    "geosite:cn"
                ],
                "outboundTag": "direct"
            }
        ]
    }
}
```
简单描述下上面配置：内置 DNS 用 8.8.8.8 做首选服务器，localhost 作备用，路由中首先来一条规则让 8.8.8.8 的流量一定走 proxy，匹配了 geosite:cn 中的域名的请求走 direct，如果没匹配任何规则，则走主 outbound，也即 outbounds 中的第一个，也即 proxy。

同样设置系统代理至 V2Ray 的 SOCKS inbound 127.0.0.1:1086，再来考虑浏览器做请求的过程，经过上面几个例子，可以看到很多步骤其实是一样的，所以后续例子中会简化一些：

```md
S4
1. 假设浏览器请求 https://www.bilibili.com
2. 浏览器发 SOCKS 请求到 V2Ray
3. 请求来到 V2Ray 的 inbound，再到路由过程
4. 很明显 www.bilibili.com 这个域名包括在 geosite:cn 中，走 direct
5. Freedom outbound (direct) 对 www.bilibili.com 发起 TCP 连接
6. Freedom outbound 解析域名，因为这次没有用 UseIP，用的是系统 DNS
7. 直接发 DNS 请求到 114.114.114.114
8. 得到结果后可以跟 Bilibili 服务器建立连接，准备代理浏览器发过来的 HTTPS 流量

S5
1. 再假设浏览器请求 https://www.google.com
2. 浏览器发 SOCKS 请求到 V2Ray
3. 请求来到 V2Ray 的 inbound，再到路由过程
4. www.google.com 不在 gesoite:cn，也没匹配任何规则，本来应该直接走主 outbound: proxy，但因为我们用了 IPIfNonMatch 策略，V2Ray 会去尝试使用内置的 DNS 把 www.google.com 的 IP 解析出来
5. V2Ray 使用内置 DNS 向 8.8.8.8 发起针对 www.google.com 的 DNS 请求，这个请求的流量将会是 UDP 流量
6. 内置 DNS 发出的 DNS 请求会按路由规则走，因为 8.8.8.8 匹配了路由中的第一条规则，这个 DNS 请求的流量会走 proxy
7. proxy 向远端代理服务器发起 TCP 代理连接（因为 "network": "tcp"）
8. 建立起 TCP 连接后，proxy 向远端代理服务器发出 udp:8.8.8.8:53 这样的代理请求
9. 远端服务器表示接受这个代理请求后，proxy 用建立好的 TCP 连接向远端服务器发送承载了 DNS 请求的 UDP 流量（所以 V2Ray/VMess 目前是 UDP over TCP）
10. 远端代理服务器接收到这些承载 DNS 请求的 UDP 流量后，发送给最终目标 udp:8.8.8.8:53
11. 8.8.8.8 返回给远端代理服务器 DNS 结果后，远端代理服务器原路返回至本地 V2Ray 的内置 DNS，至此，从步骤 5 ~ 11，整个 DNS 解析过程完成。
12. 接上面步骤 4，V2Ray 得到 www.google.com 的 IP，再进行一次规则匹配，很明显路由规则中没有相关的 IP 规则，所以还是没匹配到任何规则，最终还是走了主 outbound: proxy
13. proxy 向远端代理服务器发起 TCP 代理连接（因为 "network": "tcp"）
14. 连接建立后，因为 proxy 中所用的 VMess 协议可以像 SOCKS 那样把域名交给代理服务器处理，所以本地的 V2Ray 不需要自己解析 www.google.com，把域名放进 VMess 协议的参数中一并交给代理服务器来处理
15. 远端的 V2Ray 代理服务器收到这个代理请求后，它可能自己做域名解析，也可能继续交给下一级代理处理，只要后续代理都支持类 SOCKS 的域名处理方式，这个 DNS 请求就可以一推再推，推给最后一个代理服务器来处理，这个超出本文范围不作讨论，反正这个域名不需要我们本地去解析
16. 远端代理服务器最后会发出针对 www.google.com 的 DNS 请求（至于究竟是如何发，发到哪个 DNS 服务器，我们不一定能知道，也不关心这个）
17. 远端代理服务器得到 DNS 结果后，可以真正地向 Google 的服务器建立 TCP 连接18. 远端的 V2Ray 做好准备后告诉本地 V2Ray 连接建立好了，可以传数据了
19. 本地 V2Ray 就告诉浏览器连接好了，可以传数据了，浏览器就可以把 HTTPS 流量顺着这个代理链发送至 Google 的服务器
```

在上面 S5 中，步骤 5 ~ 11 做了次 DNS 请求，采用代理转发 DNS 请求流量的方式，而在步骤 14 中，又说可以不解析域名，交给远端服务器来解析，这两者其实并不冲突。一般来说，前者的处理方式就是实实在在的 UDP 流量代理而已，后者一般叫作远程 DNS 解析。用了 `IPIfNonMatch` ，对域名做一次 DNS 解析要经过 5 ~ 11 这么多步骤，看起来效率很慢，但如果代理服务器不慢的话，这个过程一般是很快的，最重要的是 V2Ray 内置 DNS 对 DNS 结果有一个缓存，所以并不需要每次都去做 DNS 请求。不管怎么说，毕竟还是做了额外的事情，而且有可能涉及到一个 UDP over TCP 的代理请求，的确会相对地慢点。

另外要提到一点是，上面的配置中都在本地 SOCKS inbound 中用了：

```json
"domainOverride": [
   "http",
   "tls"
]
```

::: info
在新的配置格式中这个流量嗅探的配置有了新的写法，后续会用这个写法：
```json
"sniffing": {
 "enabled": true,
 "destOverride": ["http", "tls"]
}
```
:::

这个是对流量进行域名嗅探，如果配置了，V2Ray 就会做嗅探操作，但上面的例子没有把这个操作过程列出来，是因为目前我们的场景是桌面系统 + 浏览器，在这个环境中，这个嗅探功能不会起额外的作用，浏览器会把域名交给 V2Ray，不需要 V2Ray 去嗅探。

如果看明白上面的上面几个举例，相信读者已经对 V2Ray 的工作方式有了大致的了解。一般来说，流量从 inbound 进入到 V2Ray，再进入到路由匹配过程，找到匹配到的 outbound，然后流量就给到这个 outbound 处理。V2Ray 虽然有多种 inbound，多种 outbound，以及很灵活的路由匹配规则，有时候会让人眼花缭乱，但这条流量流经的路线是默认的，没有特殊配置，流量都会按这个顺序在 V2Ray 内部传递。



## V2Ray 内置 DNS
而 V2Ray 的内置 DNS 其实也只是一个很简单的功能模块，它为 V2Ray 内部其它模块提供 DNS 功能，它接受一个域名作为输入，返回一个 IP 列表作为输出。

::: info
直接拿 V2Ray 里面代码出来看，内置 DNS 功能对其它模块提供的接口是这样的，表示输入参数是域名，输出是 IP 列表以及一个错误信息，如果正常返回，错误信息会是空的，IP 列表可以同时有 IPv4 和 IPv6 地址：

`LookupIP(domain string) ([]net.IP, error)`
:::

这就是从其它 V2Ray 模块的角度来看 V2Ray 内置 DNS 功能，至于内置 DNS 内部是否做域名分流，内部向哪个 DNS 服务器发出 DNS 请求，用何种方式发这个 DNS 请求，其它模块是管不着的，也完全不知情的。这样看内置 DNS 功能就很简单，其它模块，比如上面提到路由模块用内置 DNS 来解析域名后用 IP 再次进行匹配（或者后面会提到的 DNS outbound 模块），其实就是这样调用了内置 DNS：

```md
路由模块：我有一个域名，给你（内置 DNS 模块），帮我查查它的 IP 地址是什么
内置 DNS 模块按照自己的配置，做了各种处理，最终得到 IP 地址
内置 DNS 模块：这就是它（域名）的 IP，给你（路由模块）
```
从其它模块（外部）看 V2Ray 的内置 DNS 就这么简单的，那从内部看它呢？从内部看也是比较简单的，只要分清楚外部和内部各自负责的事情，各自所能得到的信息，就很好理解。

比如内置 DNS 支持 hosts，这个功能是怎么做的呢？按上面的描述，外部只传入一个域名，其它的管不了，那内置 DNS 里面随便返回什么样的结果，外部都不能有任何疑问，比如路由模块要查 www.google.com 的 IP，传它给内置 DNS，但如果内置 DNS 根本就不发任何 DNS 请求，不做任何额外处理，直接就返回一个 127.0.0.1 给路由模块，这时路由模块也不得有任何异议，就算很显示 127.0.0.1 不可能是 www.google.com 真正的 IP 地址。那样在内置 DNS 中配置一个 `域名 -> IP` 的列表，只要传进来的域名匹配了列表中的域名，就直接返回相应 IP，这就等效于 hosts 了。

```json
"dns": {
  "hosts": {
    "www.google.com": "127.0.0.1"
  }
}
```

再看内置 DNS 的 servers 一项，如果内置 DNS 这样配置：

```json
"dns": {
  "servers": [
    "8.8.8.8",
    "223.5.5.5",
    "localhost"
  ]
}
```

路由模块传入 www.bilibili.com 这个域名，想要它的 IP 地址，内置 DNS 会从上至下按顺序，向 servers 里每个 DNS 服务器发 DNS 请求，一个一个地来，直到有结果返回，然后再把结果返回给路由模块。

从内置 DNS 向 servers 列表中的 DNS 服务器发出的 DNS 请求的流量，并不是从本机直接发到对应的服务器（localhost 除外），而是会通过 outbound 发出去，假如是 Freedom outbound，的确还是会从本机直接发到相应 DNS 服务器，但假如是一个 VMess outbound，DNS 请求的流量就会被代理到 VMess 代理服务器上，由代理服务器发到相应的 DNS 服务器。

内置 DNS 发出的请求的流量可能的流经线路：

```md
内置 DNS -> 通过路由功能选择了 Freedom outbound -> 8.8.8.8
内置 DNS -> 通过路由功能选择了 VMess outbound -> VMess 代理服务器 -> 8.8.8.8
```
使用哪个 outbound，取决于路由配置。

所以这里就很有趣了：

```md
1. 路由模块想要 www.bilibili.com 的域名，调用了内置 DNS 模块去查
2. 内置 DNS 模块内部需要发个 DNS 请求去查，但它不太确定要把流量发到哪个 outbound
3. 内置 DNS 模块于是调用路由模块，让路由来给它决定发到 udp:8.8.8.8:53 的流量究竟要交给哪个 outbound 比较合适
```
可是呢，考虑一下我们的配置以及要查询的这个域名，8.8.8.8 在列表第一项，要先用它来查，但我们要查的域名是 www.bilibili.com，一般来说是不太合适向 8.8.8.8 查这个域名。所以无论路由模块判断走 Freedom outbound 还是 VMess outbound，都不合适。因为走 Freedom outbound 发到 8.8.8.8，恐怕返回结果是假的，走 VMess outbound，恐怕返回结果是国外 CDN 的

::: info
这里必须再插一段话，要考虑返回结果如何如何，我们还得考虑这个返回结果是用来干什么的，如果是我们当前的例子，是用来给路由模块做 IP 规则匹配的，那返回结果是不是假的并不重要，重要的是它是否能匹配到 direct 规则；如果返回结果用作其它目的，比如后面会说到的 DNS outbound，就又是另一个故事了~
:::



回到主线，不管怎么，我们不想考虑太多东西，我们只想这个 DNS 请求能够合理地发出，很明显的一个选择就是让这个 www.bilibili.com 的 DNS 请求发到 223.5.5.5，且走 Freedom outbound。

那把 223.5.5.5 放到列表第一项如何？这是治标不治本，想想假如又有另一个 DNS 请求要发到 www.google.com 的，这个请求先发到 223.5.5.5 就又不太合适了。

V2Ray 当然已经考虑到这情况，有了所谓的 `DNS 分流` 功能：

```json
"dns": {
  "servers": [
    "8.8.8.8",
    {
      "address": "223.5.5.5",
      "port": 53,
      "domains": [
        "domain:www.bilibili.com"
      ]
    },
    "localhost"
  ]
}
```

这样配置内置 DNS，虽然 8.8.8.8 在第一，但因为要查询的域名 www.bilibili.com 匹配了第二项中的域名规则，内置 DNS 就会优先向第二个 DNS 服务器发出 DNS 请求。

这里有一个很容易忽略掉的过程，就是选择 outbound，我们用 DNS 分流功能选择了 DNS 服务器，还得在路由中配置合适的规则，来选合适的 outbound 向这个 DNS 服务器发出 DNS 请求流量。

```md
内置 DNS 查询 www.bilibili.com -> 内置 DNS 通过分流功能选择了 223.5.5.5 -> 通过路由功能选择了 Freedom outbound -> 223.5.5.5
内置 DNS 查询 www.bilibili.com -> 内置 DNS 通过分流功能选择了 223.5.5.5 -> 通过路由功能选择了 VMess outbound -> VMess 代理服务器 -> 223.5.5.5
```

就算 DNS 分流配置好了，如果路由规则配置不当，让 udp:223.5.5.5:53 的流量走了 proxy，就有可能发生上面第二个线路，返回的 IP 地址就有可能是 Bilibili 在国外 CDN 的 IP。（IP 结果是真的，只是…）

所以千万不能忘记，除了配置好 DNS 分流域名，还要为各个 DNS 服务器配置路由规则：

```json
"routing": {
    "domainStrategy": "IPIfNonMatch",
    "rules": [
        {
            "type": "field",
            "ip": [
                "8.8.8.8"
            ],
            "outboundTag": "proxy"
        },
        {
            "type": "field",
            "ip": [
                "223.5.5.5"
            ],
            "outboundTag": "direct"
        }
    ]
}
```

总结一下上面的，要正确配置 V2Ray 内置 DNS：

1. 正确配置 servers 列表及域名分流（用域名信息来选 DNS 服务器）

2. 正确为发出的 DNS 请求配置路由规则（用 DNS 服务器的地址信息以及流量的协议信息：IP，端口，tcp/udp）

V2Ray 内置 DNS 还有一个叫 `clientIp` 的项是什么用的？我个人不太建议去依赖这个选项，但如果你想知道它的作用，是这样的，假如上面例子中真的在路由规则上配置错了，出现了这个线路的情况：

```md
内置 DNS 查询 www.bilibili.com -> 内置 DNS 通过分流功能选择了 223.5.5.5 
-> 通过路由功能选择了 VMess outbound -> VMess 代理服务器 -> 223.5.5.5
```

那 `clientIP` 是 DNS 请求中可以带上的一个参数，它用来提示 DNS 服务器（223.5.5.5）你所在的地理位置，223.5.5.5 就知道你在哪，就 `有可能` 会返回一个合适你所在的地理位置的 CDN 的 IP（也即 Bilibili 国内 CDN 的 IP）。

关于内置 DNS，最后再说一说 `localhost` ，上面的描述不适用于 localhost，简单说，内置 DNS 在向 servers 列表中的 localhost 发 DNS 请求时，不会用任何 outbound 来发（甚至不用 Freedom outbound），而是直接从本机发出，就像任何其它程序做 DNS 请求那样，直接调用系统的 DNS API，用系统 DNS 中配置的 DNS 服务器。

## V2Ray DNS Outbound

接下来会说一说 V2Ray 的 DNS outbound。因为我们上面的例子中所说的都是路由模块去调用内置 DNS，但路由模块仅仅是用它的结果来做规则匹配，而且是当配置了 `IPIfNonMatch/IPOnDemand` ，而且没有匹配任何域名规则的情况下，才用得到它，当下各种域名列表盛行，它的应用范围实际上是很窄的。

DNS outbound 可以说是一个把内置 DNS 的功能真正地开放出来，让各种程序、各种模块可以更加方便地使用得上内置 DNS 的一个功能。为什么要把内置 DNS 开放出来呢？很明显啊，因为现在它支持 `DNS 分流` ，相信大部分读者都知道已经存在很多专门做 DNS 分流的工具，这已经说明 DNS 分流是一个很有用的功能，而 V2Ray 已经支持 DNS 分流了，可是外部用不了就等于没有，所以就得开放出来。

要说 DNS outbound 的配置，它目前就只有那么 3 （network, address, port）个配置项：

```json
"outbounds": [
    {
        "tag": "dns-out",
        "protocol": "dns",
        "settings": {
            "network": "tcp",
            "address": "1.1.1.1",
            "port": 53
        }
    }
]
```

而这 3 个配置项其实都不是本文想要关注的点，下文只会稍微提一下。DNS outbound 最重要的功能是它的默认行为：对进来的 DNS 流量进行拦截、解析，以及对 A, AAAA 类型的 DNS 查询做重新转发。

其中最难理解的，恐怕就是 “拦截”、“重新转发” 两个词的具体意思。

这里可以回看上面的 F1，是这么描述一般 DNS 请求的：

>一般这种 DNS 请求都是纯文本（我们也只讨论这种 DNS），它们所流经的各种设备，各种程序都可以看到，可以修改里面的内容，发出的请求可以修改，返回的结果也可以修改，甚至修改过后毫无痕迹，就是说，对于发出的请求，DNS 服务器没办法知道它是否在中间链路被修改过，对于返回的结果，应用程序也没办法知道它是否在中间链路被修改过。

对于进入到 DNS outbound 里面的流量，DNS outbound 会把这个流量当作是 DNS 请求，也就是说把它当作一块数据，这块数据里面包含了 DNS 请求相关的信息，包括但不限于：DNS 请求的域名，DNS 请求的记录类型；还有所有类型的 outbound 都能够得到的一些通常的信息，比如这个流量的目的地址，目的端口，所用传输协议等等，这些信息都是 DNS outbound 能够轻易得到的。

因为 DNS 请求里面的数据都是明文的，流经的中间设备、中间模块都看得到里面内容，那 DNS 请求的流量既然流经 DNS outbound，DNS outbound 理所当然也能看得到；而且返回数据的时候，就算 DNS outbound 把返回的数据删改了，或者索性自己凭空生成一个假的 DNS 回复返回给应用程序，应用程序也没办法知道真假。

这就是 DNS outbound 的工作原理。只不过它并不是凭空生成一个假的 DNS 回复，而是求助于内置 DNS 模块：

```md
1. 某个应用程序发了一个 DNS 查询
2. 这个 DNS 查询的流量通过某种方式进入了 DNS outbound（这里暂时不讨论究竟是通过什么方式进入 DNS outbound 的）
3. 如果这个流量是个明文 DNS 请求，DNS outbound 肯定看得到里面内容，可以拿出里面的域名
4. DNS outbound 调用内置 DNS 模块，把拿到的域名传进去
5. 内置 DNS 模块根据它的配置去查这个域名的 IP，具体怎么查的，DNS outbound 并不知道，它只管要结果
6. 内置 DNS 返回一些 IP 给 DNS outbound 后，DNS outbound 用这些 IP 生成了一个 DNS 回复
7. DNS outbound 把这个 DNS 回复若无其事地返回给应用程序
8. 应用程序当然不知道这个 DNS 回复具体是怎么来的，它没办法，只能相信中间链路，相信这个回复就是它想要的回复
```
DNS outbound 的这种行为，实质上相当于 DNS 劫持，但说它是 DNS 劫持也不太对，因为是我们配置的，自愿让它 “劫持” 的嘛。

DNS outbound 本身的工作原理相信已经比较清晰了，它只是劫持了进来的 DNS 请求的流量，然后找内置 DNS 模块帮忙解析 DNS，然后假装啥事没发生，返回结果而已。

::: info 
要应用它，重点在于要用什么样的方式，把 DNS 流量引导到 DNS outbound 里去。
:::

对于桌面系统，如果用浏览器来访问网站，那么，前面也说了，SOCKS5 协议可以带上域名给远端解析，根本不需要本地去解析域名。但假如不是用浏览器的情况呢？比如运行一个 nslookup 命令，默认它也不会用系统设置的代理，它是直接向系统设置的 DNS 服务器发 DNS 请求，怎么把这个请求的流量引导到 V2Ray 的 DNS outbound 呢？

考虑下以下配置：

```json
{
    "inbounds": [
        {
            "port": 53,
            "tag": "dns-in",
            "protocol": "dokodemo-door",
            "settings": {
                "address": "1.1.1.1",
                "port": 53,
                "network": "tcp,udp"
            }
        }
    ],
    "dns": {
        "hosts": {
            "domain:www.bilibili.com": "1.2.3.4"
        }
    },
    "outbounds": [
        {
            "protocol": "dns",
            "tag": "dns-out"
        },
        {
            "protocol": "freedom",
            "tag": "direct",
            "settings": {}
        }
    ],
    "routing": {
        "rules": [
            {
                "type": "field",
                "inboundTag": ["dns-in"],
                "outboundTag": "dns-out"
            }
        ],
        "strategy": "rules"
    }
}
```
这个配置让 V2Ray 的 dokodemo-door inbound 监听在本地 53 端口，对于任何进来的流量，会因为我们的路由规则，而被送到 DNS outbound 处理，然后我们把系统 DNS 设置为 127.0.0.1，相当于说 V2Ray 的 dokodemo-door inbound 就是一个 DNS 服务器。

```md
1. 命令行执行 nslookup www.bilibili.com
2. 因为系统 DNS 设置为 127.0.0.1
3. DNS 请求发到 dokodemo-door inbound
4. 因为 "dns-in" -> "dns-out" 路由规则，流量传给 DNS outbound
5. DNS outbound 识别到是个 DNS 请求，拿到域名 www.bilibili.com，调用内置 DNS
6. 这个域名匹配到内置 DNS 的一条 hosts 规则，返回结果 1.2.3.4
7. 于是 nslookup 查询 www.bilibili.com 的结果是 1.2.3.4
```

让 V2Ray 充当 DNS 服务器，设置系统 DNS 是其中一个把 DNS 流量引导到 DNS outbound 中的方式。但今天我们大部分的上网操作都是在浏览器上进行了，浏览器用了 SOCKS5 代理的话也不需要本地去解析 DNS，所以这个应用场景不常见。

::: info 
DNS outbound 开放出来后，最重要的应用场景，是在移动端和路由器上。
:::


在讨论移动端和路由器之前，先看看桌面系统上怎样可以做真正的全局代理。前面也说了，一般的浏览器代理，只代理浏览器的流量，要把 DNS 流量也代理了，就需要像上面那样更改系统 DNS 为 127.0.0.1，当我们需要真正的全局代理时（VPN 就是真正的全局代理），这种方便显然不合适，也不可能做得到真正全局代理。

## tun2socks

下面介绍一种通过 tun2socks，能够把所有本机应用程序发出的流量都交给 V2Ray/SOCKS/Shadowsocks，从而达到全局 TCP/UDP 代理（对，只是 TCP/UDP，ICMP 等等是不支持的，全局性还是不比真正的 VPN）。

为此我特意写了一篇关于在 Windows 上如何使用 tun2socks 实现全局 TCP/UDP 流量代理的教程：

https://medium.com/@TachyonDevel/%E6%95%99%E7%A8%8B-%E5%9C%A8-windows-%E4%B8%8A%E4%BD%BF%E7%94%A8-tun2socks-%E8%BF%9B%E8%A1%8C%E5%85%A8%E5%B1%80%E4%BB%A3%E7%90%86-aa51869dd0d?source=post_page-----62c50e58cbd0--------------------------------

tun2socks 就是这么一种可以把所有应用程序的 TCP/UDP 流量都交给 V2Ray 的方式，当然其中包括 DNS 的流量，所以用了 tun2socks 后，我们甚至不需要更改系统的 DNS 设置，所有 DNS 请求的流量都能够被引导到 V2Ray，然后我们可以在 V2Ray 里加一条路由规则，识别出 DNS 的流量，把这些流量转给 DNS outbound：

```json
{
    "dns": {
        "hosts": {
            "domain:www.bilibili.com": "1.2.3.4"
        }
    },
    "outbounds": [
        {
            "protocol": "dns",
            "tag": "dns-out"
        },
        {
            // VMess outbound
        }
    ],
    "routing": {
        "rules": [
            {
                "type": "field",
                "network": "udp",
                "port": 53,
                "outboundTag": "dns-out"
            }
        ],
        "strategy": "rules"
    }
}
```

配置做了简化，真拿来用的话要自己补上其它部分。配置中没有 inbound，因为我们所用的 tun2socks 软件：[go-tun2socks](https://github.com/eycorsican/go-tun2socks) 本身把 tun2socks 内置为 V2Ray 的一个 inbound 了。

>`go-tun2socks` 是一个命令行工具，要使用的话还要自己创建 TUN 接口，配置路由表等，比较繁琐，这里还有另一个应用叫 [Mellow](https://github.com/eycorsican/Mellow) ，对 `go-tun2socks` 进行了包装，可以自动完成这些繁琐的步骤，实际使用起来的效果就相当于 Proxifier、SSTap、Surge for Mac 等软件，可以把所有流量都代理了：

说白了，目的还是之前所说的，找到一种方法把 DNS 请求的流量引导到 DNS outbound 中。

## 移动端环境

上面提 tun2socks，是因为在移动端上，要代理所有 app 的流量，tun2socks 是一种必须的手段，它们跟桌面系统上用 tun2socks 很相似，都是要把所有的 TCP/UDP 流量引导进 V2Ray，但也有不一样的地方，*移动端系统一般都提供了特殊的方法，能够让指定的流量不受路由表基于 IP 地址的路由控制。*

在移动端系统方面，iOS 既可以像桌面系统用 tun2socks 那样把所有 TCP/UDP 流量引导到 V2Ray，也可以设置一个 HTTP 代理把 HTTP 请求代理到 V2Ray 的 HTTP inbound 里；而 Android，只能以 tun2socks 那样的方式把 TCP/UDP 流量引导进去。

iOS 的 HTTP/S 代理跟 SOCKS5 代理比较相似，应用程序不需要自己解析 DNS，可以把域名带上交给 V2Ray，然后如果请求匹配到代理的路由规则，这个域名就通过代理协议（VMess/Shadowsocks/SOCKS5）交给代理服务器自己去解析，所以本地不需要做任何 DNS 解析。问题是很明显这个只适用于 HTTP/S 请求（而且并不是所有的 HTTP/S 请求，貌似应用程序还必须要用 iOS 系统提供的 HTTP 库来做请求才会被代理到）。

再考虑到 Android 并不能很自然地支持 HTTP/S 或者 SOCKS5 代理，所以想要一个通用的解决方案，还是要从 TCP/UDP 流量入手。

假如你使用的 Android 客户端是 Kitsunebi，那大致上可以这么配置：

```json
{
    "dns": {
        "hosts": {
            "domain:www.bilibili.com": "1.2.3.4"
        },
        "servers": [
            "114.114.114.114",
            {
                "address": "8.8.8.8",
                "domains": [
                    "google"
                ],
                "port": 53
            }
        ]
    },
    "outbounds": [
        {
            "protocol": "vmess",
            "tag": "proxy"
        },
        {
            "protocol": "freedom",
            "settings": {},
            "tag": "direct"
        },
     {
         "protocol": "dns",
         "tag": "dns-out"
     }
    ],
    "routing": {
        "rules": [
            {
                "inboundTag": ["tun2socks"],
                "network": "udp",
                "port": 53,
                "outboundTag": "dns-out",
                "type": "field"
            },
            {
                "ip": [
                    "8.8.8.8/32"
                ],
                "outboundTag": "proxy",
                "type": "field"
            }
        ],
        "strategy": "rules"
    }
}
```


配置中的 inboundTag tun2socks 是必须的，虽然单凭 53 端口 和 network udp 大致达到识别出 UDP 流量的目的，但因为在 V2Ray 中 UDP 流量并不只从 tun2socks inbound 进来，还会从 内置 DNS 那边过来，如果不加上 inboundTag tun2socks 这个限制，内置 DNS 那边过来的流量就会被转到 DNS outbound，接着有可能又被转给 内置 DNS，造成环路。

通过前面桌面端上对 V2Ray 的 内置 DNS 和 DNS outbound 的说明，现在移动端也可以方便地拿到所有 TCP/UDP 流量，上面的方法都可以套用下来，就不继续说了。

大体上，从流量流向的角度来看，一般 DNS 处理方式也就 3 种：

* 直接从本机发出 DNS 请求到目的 DNS 服务器
* 通过代理把 DNS 请求发送到目的 DNS 服务器
* 本机不向互联网发出 DNS 请求流量（由远端代理服务器来解析或者直接本地伪造 DNS 答复返回）

## Fake DNS

虽然现在已经可以完全利用 V2Ray 的 DNS 功能模块对 DNS 的 UDP 流量做各种处理，可以对 DNS 请求按域名做分流，但仔细想想，分流时不管是发到 freedom outbound 直连还是发到 VMess outbound 代理，这些 DNS 请求终究是要以实际的流量形式从本地发送到互联网上，是否有方法可以在利用 tun2socks 获取所有 TCP/UDP 流量的同时，又可以像 HTTP/S 和 SOCKS5 代理那样，本地完全不发出 DNS 请求流量，只把域名交给代理服务器，让代理服务器自己去解析呢？

答案是有的，那就是 Fake DNS，Fake DNS 是有一个 [RFC](https://tools.ietf.org/html/rfc3089) 的，某些使用 iOS 的读者可能也并不陌生，Surge 中的 `force-remote-dns` 就是利用了这种技术。

大致工作原理如下：

```md
1. 手机上某个 app 想发出 https://www.google.com 请求
2. app 发出 www.google.com 的 DNS 查询
3. DNS 请求的 UDP 流量来到 tun2socks，被 tun2socks 交到 Fake DNS 模块
4. Fake DNS 模块选择一个伪造的 IP 地址，比如 244.0.0.3，并把这个地址跟 www.google.com 关联起来
5. Fake DNS 根据 DNS 请求，生成相应的 DNS 答复，并把 244.0.0.3 当作 DNS 结果放进答复中，通过 tun2socks 把这个伪造的 DNS 答复返回给 app
6. app 得到 www.google.com 的 DNS 查询结果是 244.0.0.3
7. app 向 244.0.0.3 发出 HTTP 请求流量
8. HTTP 请求流量来到 tun2socks，tun2socks 向 Fake DNS 模块查询目的地址 244.0.0.3 是否是一个伪造的 IP 地址，如果是，向 Fake DNS 查询这个 IP 所关联的 域名，也即 www.google.com
9. tun2socks 现在已经得到 HTTP 请求流量的域名，把流量以及域名一并交给 V2Ray
10. V2Ray 有了域名，接下来路由什么的该怎么处理就怎么处理了
```

上面过程中，虽然 app 是发出了 DNS 请求流量，但这个流量被拦截下来了，并没有真正地发到互联网上；最终 V2Ray 也拿到了域名，如果这个域名匹配到代理规则，就会交到代理服务器来解析，也就是所谓的 远程 DNS 解析。

上面过程中，Fake DNS 模块如果没有对域名做过滤，对任何域名都返回伪造的 IP 地址，则可能会引起一些问题，有一种做法是在 Fake DNS 模块里内置一个域名列表，只对匹配到列表的域名返回 伪造 DNS 答复。

Fake DNS 不管是原理上还是实现上都是非常简单的，如果有兴趣可以看一下 [这里的实现代码](https://github.com/eycorsican/leaf/blob/master/leaf/src/app/fake_dns.rs)。

## DNS Fallback

接下来再说说一种叫做 DNS fallback 的技术（这个名字可能不太对），在代理服务器不支持 UDP 的时候，单纯的全局 TCP/UDP 流量代理 就会出问题了，因为要解析 DNS 就需要 UDP，服务器不支持 UDP 就没办法处理 DNS ，也就没办法处理所有域名请求了，DNS fallback 是一种可以强制让应用程序把 DNS 请求以 TCP 流量发送出去的技术。

::: info 
需要说明的是，如果用了 V2Ray 的技术，或者 Fake DNS，那 DNS fallback 是没必要的，DNS fallback 也是一种处理 DNS 相关问题技术，这里只是想把这种技术也列举出来
:::

众所周知一般的 DNS 请求都是用 UDP 发的，但 DNS 的 UDP 报文的大小会被限制在大概 512 字节，如果某个 DNS 答复很长，超过了这个限制，就不能通过 UDP 来传输了，为此 DNS 规范中提出，对于这种超过限制大小的 DNS 请求，DNS 服务器可以在答复中设置一个 flag（truncated），来告诉客户端这个答复太长，你不能用 UDP 来做这个 DNS 请求，请用 TCP，于是客户端就会用 TCP 来重新请求 DNS。

DNS fallback 正是利用了这一点，在 tun2socks 给过来的 UDP 流量中识别出 DNS 请求，然后伪造一个设置了 truncated flag 的答复返回给客户端，客户端就会转用 TCP 来做 DNS 请求了。

DNS fallback 的实现也是非常简单的，有兴趣可以看一下 [这里的代码](https://github.com/eycorsican/go-tun2socks/blob/master/proxy/dnsfallback/udp.go)。