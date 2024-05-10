 
# CNAME记录与根域名

https://help.laoxuehost.com/domain-name/cname-record-conflicts-with-mx-and-txt-record.html


## CNAME 记录与 MX/TXT 记录冲突的解决方法

*17 10 月, 2021 | Michel | 8,716 views |*

很多朋友在部署域名邮箱的时候都会发现，DNS 服务商会提示根域名 MX、TXT 记录和 CNAME 记录有冲突，不能共存。今天，我就来介绍一下这种情况为什么会发生，且如何完美解决。

## CNAME 和 MX/TXT 记录冲突的成因

CNAME 记录和 MX、TXT 记录冲突的根本原因在于 CNAME (Canonical NAME) 记录的特殊性。根据 RFC 1034 的规定，根域名不能设置 CNAME 记录，这是由 DNS 服务本身的固有限制决定的。或许你可以在一些 DNS 服务商那里为根域名添加 CNAME 记录，但这些都是不符合 DNS 规范的。如果要将根域名设置为另一个域名的别名，需要设置 ALIAS 记录。在下一节我将具体介绍 ALIAS 记录。

如果根域名设置了 CNAME 记录，会和其他所有的记录相冲突，而最常见的冲突情形就是 MX 记录。对于同一个根域名，CNAME 记录和 A 记录、NS 记录、SOA 记录、TXT 记录等都会冲突，不过这些情形并不常见，所以一般不会造成太大的问题。

我们以同时在根域名设置 CNAME 记录和 MX 记录为例。向该域名的域名邮箱发信且使用 DNS 寻址时，如果先寻到了 CNAME 记录，就无法再获取到该域名对应的 MX 记录。这就会导致使用该域名搭建的域名邮箱在收件时会经常丢信漏信。同时，CNAME 记录不仅与 MX 记录冲突，也会与 TXT 记录冲突，这就会导致为根域名设置的 SPF-TXT 记录无法生效，因此发信时更容易进垃圾箱。

那么问题来了，如果我们要为网站开启 CDN，那么最常见的方式就是使用 CNAME 接入。如果还需要一并使用域名邮箱，那么就不得不造成 CNAME 记录和 MX 记录的冲突。有什么好办法呢？这里我们有三个办法，可以解决这个问题。

## 如何解决 CNAME 和 MX/TXT 记录冲突

解决 CNAME 和 MX、TXT 记录的冲突有三种可行的办法，分别是：

使用 www. 域名接入 CDN；
使用 A 记录轮询接入 CDN；
使用 ALIAS (CNAME Flattening) 记录代替 CNAME 记录。
接下来我将具体介绍这三种方法。

#### 使用 www. 域名接入 CDN
大家都知道，一般来说为根域名设置 CNAME 记录的情况都是由于网站需要接入 CDN。如果您可以接受网站采用 www.example.com 这样的网址而不是 example.com，那么您完全可以使用 www.example.com 域名接入 CDN。由于 www.example.com 不是根域名了，因此它的 CNAME 记录不会和根域名的 MX、TXT 记录冲突，这样就解决了网站的 CDN 接入与域名邮箱共存的问题。

这种方法的有点在于最为简单，但缺点是必须使用 www. 形式的域名。

#### 使用 A 记录接入 CDN
如果您无法接受网站采用 www. 域名，那么您也可以将根域名采用 A 记录的方式接入 CDN。使用 A 记录时，您还可以自行设定线路，或者设置轮询。根域名的 A 记录不会和 MX 记录冲突，这样就解决了网站的 CDN 接入与域名邮箱共存的问题。

一般来说，这种情况比较适用于网站使用自行搭建的 CDN 系统，因为商用 CDN 系统的 IP 地址有时会发生变动，造成 A 记录解析失效。

#### 使用 ALIAS (CNAME Flattening) 记录代替 CNAME 记录
使用 ALIAS 记录代替 CNAME 记录是目前国际上最主流的设置办法了，它能起到与 CNAME 记录完全一样的效果，又不会和其他记录产生冲突。

这里我们先介绍一下 ALIAS 记录。ALIAS 记录，又称 CNAME Flattening 记录，中文为“别名”记录，是一种 CNAME 记录的替代型记录。它能够起到和 CNAME 记录完全一样的效果，即将一个域名设置为另一个域名的别名，而唯一的差别就是 ALIAS 记录不会与其他记录发生冲突。

因此，我们只需要在 DNS 服务商那里为根域名设置 ALIAS 或者 CNAME Flattening 记录就可以了，它的设置方法与 CNAME 记录完全相同。通过设置 ALIAS 记录，我们就能够完美解决网站根域名的 CDN 接入与域名邮箱共存问题。如果您的 DNS 服务商目前不支持 ALIAS 记录，您可以使用市面上很多免费的 DNS 服务，比如 Cloudflare、he.net、dnsimple.com、Route53 (这个不免费)、cloudns.net 等等。这些 DNS 服务商都支持设置 ALIAS 记录。大部分国际域名注册商，比如 Godaddy、Porkbun、Namesilo、Namecheap、Gandi、Google Domains 等等，也都支持设置 ALIAS 记录。

综上所述，CNAME 记录具有特殊性，会和同域名下的所有其他记录发生冲突，导致无法同时配置根域名的 CDN 和 MX 域名邮箱。以上三种方法都可以解决 CNAME 记录与 MX 记录的冲突，我们推荐您使用一个支持 ALIAS 记录的 DNS 服务商，然后为您的根域名设置 ALIAS 记录，就可以完美解决这个问题。