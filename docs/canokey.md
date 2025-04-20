# Canokey 探索 & 使用指南

下单了 Canokey

比较好用的一个功能是 Discoverable Credential（Resident Key）

驻留密钥，实际上就是直接把你私钥写进 Canokey 里，然后可以在本地生成一个假私钥，这个假私钥实际上是一个指针，指向 Canokey 里的私钥

而且你不需要一直保存这个假私钥，即使是在新电脑上，你也可以通过 

```shell
ssh-keygen -K
```
来生成指向 Canokey 里的私钥的假私钥

导出的时候还会让你填一个 passphrase ，这个 passphrase 是用来加密你 Canokey 刚刚生成的假私钥的，和你 Canokey 里的私钥没有关系

主要在于我们可以通过创建密钥的时候制定一些参数，来控制 Canokey 生成假私钥的文件名，这样即使你在 Canokey 里存了很多个密钥，你也可以通过文件名来区分它们

```shell

 ssh-keygen -t ed25519-sk -O resident -O application=ssh:name_you_want -C "comment" -O user="xxx@xxx.com"
```

主要有用的是 `-O application=ssh:name_you_want` 这个参数，指定了假私钥的文件名，导出时就会是: `id_ed25519_sk_rk_name_you_want_deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef.pub`

