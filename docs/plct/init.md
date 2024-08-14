
# 梦开始的地方

入职 plct 的 deepin 岗，通过了上机考试后，第一个 pre-task 是使用 qemu 构建一个虚拟的 risc-v 系统，并且成功在 rv 的 deepin 系统中从源码编译运行 neofetch 。本文将详细叙述完成该 pre-task 所需要的所有操作步骤 

首先我们要知道，想要运行起一个 linux 系统，必须要有两样东西： `编译好的内核文件` 和 `根文件系统(root file system)`

在本文中，使用 debian12 x86 作为宿主及系统，采用预编译好的 openeuler 的内核，并且通过 debootstrap 工具构建了 deepin 系统所必须的最小根文件系统，最终实现了 deepin 在 risc-v系统下的模拟运行

## qemu 的安装

> QEMU（Quick EMUlator）是一个开源的、通用的模拟器和虚拟化软件，由 Fabrice Bellard 创建。 它允许在一个平台上运行一个或多个操作系统，这些操作系统与宿主机（即运行QEMU的机器）的原生操作系统完全隔离。QEMU可以在没有硬件加速支持的情况下通过解释执行指令来模拟整个计算机系统，也可以在支持虚拟化技术的硬件上运行，提供接近原生的性能

首先，我们可能需要安装一系列的依赖工具，它们往往已经被预装在了你的系统中，但是保险起见还是再检查一次

```shell
sudo apt-get install git autoconf automake autotools-dev curl python3 libmpc-dev libmpfr-dev libgmp-dev gawk build-essential bison flex texinfo gperf patchutils bc libexpat-dev libglib2.0-dev ninja-build zlib1g-dev pkg-config libboost-all-dev libtool libssl-dev libpixman-1-dev libpython-dev virtualenv libmount-dev libsdl2-dev

```

然后，直接开始安装 qemu

```shell
sudo apt-get install qemu-system-riscv64
```
不过你也可以尝试从源码编译安装

```shell
wget https://download.qemu.org/qemu-7.1.0.tar.xz
tar xvJf qemu-7.1.0.tar.xz
cd qemu-7.1.0
./configure
make
```

## 使用qemu-img创建并挂载镜像

qemu-img 命令可以帮我们新建一个虚拟磁盘文件，后续我们可以将这个文件挂在到宿主机系统，以便向其内写入 rootfs 

如果你后续想在该虚拟机内进行 deepin 岗开发，你可以创建更大的（例如40G）的磁盘，这取决于你当前电脑磁盘的空余量

```shell
qemu-img create -f raw deepin.raw 8G
```

然后，我们可以通过本地回环设备挂载这个磁盘文件，有点类似于 windows 环境下的虚拟光驱

```shell
sudo losetup -P /dev/loop0 deepin.raw

```
这时，我们刚才创建的 deepin.raw 就已经被挂载到了 `/dev/loop0` ，我们可以将其视为一块真正的磁盘对其进行操作，你可以通过`fdisk -l`指令看到我们挂载的 `/dev/loop0` 磁盘

接下来，使用 fdisk 操作这块磁盘， fdisk 提供了一个交互式的界面让我们可以对其进行分区等操作

```shell
sudo fdisk /dev/loop0
```

在 fdisk 交互式操作界面中，先按 g 新建 gpt 表，再按 n 新建分区，其中要求的细节信息我们均选择默认即可

至此，我们就成功创建了一个可用的分区，然后我们将其中的第一个分区（我们刚刚创建的）格式化为 ext4 文件系统

```shell
sudo mkfs.ext4 /dev/loop0p1
```

最后，我们可以将其挂载到我们的宿主机系统上了
```shell
sudo mkdir /mnt/deepin
sudo mount /dev/loop0p1 /mnt/deepin
```

大功告成，这时我们向`/mnt/deepin`内写入文件，就相当于向这块虚拟磁盘内写入内容了


## 使用 debootstrap 构建根文件系统 rootfs

> debootstrap 是一个用于在Linux 系统中创建和安装基于 Debian 发行版的最小化根文件系统的工具。它可以用于构建自定义的 Debian 系统，或者用于创建 chroot 环境以供其他目的使用。

在本文中，我们使用 deepin 源创建了使用 deepin 的最小 rootfs ，并将其写入了我们上文中创建的虚拟磁盘

可以在宿主机使用 apt 等工具安装 debootstrap ，也可使用 deepin 官方提供的工具： https://github.com/deepin-community/debootstrap

通过 debootstrap 工具生成最小rootfs：

```shell
sudo debootstrap --arch riscv64 --foreign  --no-check-gpg \
  beige \
  /mnt/deepin/ \
  https://community-packages.deepin.com/beige \
  sid
```

其中有几个需要注意的参数，不过如果你现在不想了解技术细节也可以不看：

*  `--no-check-gpg` 让 debootstrap 工具不检查 gpg 密钥，因为正常情况下，debian 系统内没有 deepin 的 keyring ，如果不跳过的话 debootstrap 会拒绝构建 rootfs
* 最后的 `sid` 参数至关重要，因为正常的 debootstrap 参数应该接类似`stable`或`testing`等参数，但是目前 deepin V23 的代号 beige 并不在其中，`sid` 参数代表了，复用 `sid` 的脚本,但是`suite=beige`。这里如果不加 `sid` 参数就会报错找不到执行脚本
* `--foreign` 参数代表了正在构建 debootstrap 的宿主机系统和目标产出的 rootfs 系统的架构不同。因为要弄起来人能用的操作系统需要安装一些基础的软件包，比如 apt ，但是下载部分可以在宿主机系统内运行，安装过程就需要 risc-v 环境了，这是我们 x86 宿主机无法提供的，所以就需要`--foreign`参数告诉 debootstrap 工具，暂时不执行安装各软件包的一步

接下来，debootstrap 工具就会自动从 deepin 源拉取我们需要的最小软件包，并且构建好我们需要的最小 rootfs。要注意的是我们执行的命令中使用了上文挂载虚拟镜像的`/mnt/deepin`路径，这会让 debootstrap 工具直接将 rootfs 写入虚拟磁盘，如果你是在挂载虚拟磁盘前操作的本小节内容，你需要自己将命令中的`/mnt/deepin`路径替换为一个可用的路径

## 通过 qemu 运行 risc-v 环境下的 deepin 系统

首先，解除刚才镜像的挂载

```shell
sudo umount /dev/loop0p1
sudo losetup -D
```
我们刚才只是构建了一个 rootfs ，但是系统还需要一个内核才能启动，我们可以使用 oerv 项目中已经编译好的内核

```shell
wget https://repo.openeuler.org/openEuler-preview/RISC-V/Image/fw_payload_oe.elf
```
下载后可以将其重命名为`fw.elf`，然后使用一下命令启动 qemu-system

你需要将命令中的`fw.elf`和`deepin.raw`替换为你自己的内核和虚拟磁盘文件，如果一直按照本文默认下来的操作就无需修改

```shell
qemu-system-riscv64 \
  -nographic -machine virt \
  -smp 8 -m 8G \
  -device virtio-vga \
  -kernel fw.elf \
  -drive file=deepin.raw,if=none,id=hd0 \
  -object rng-random,filename=/dev/urandom,id=rng0 \
  -device virtio-rng-device,rng=rng0 \
  -device virtio-blk-device,drive=hd0 \
  -device virtio-net-device,netdev=usernet \
  -netdev user,id=usernet \
  -bios none \
  -device qemu-xhci -usb -device usb-kbd -device usb-tablet \
  -append "root=/dev/vda1 rw console=ttyS0"
```
建议你将上述内容保存到一个 .sh 文件里，这样每次运行虚拟机就只需要`./run.sh`就可以了

根据你宿主机的算力条件，你可以自定义虚拟机的配置，`-smp 8`代表虚拟机可以使用8个处理器核心，`-m 8G`代表虚拟机可以使用8G的内存。如果你后续要在 qemu 中编译一些大的软件包，可以尝试给虚拟机提供尽可能多的核心。

这时候，你的 qemu-system 应该就已经成功运行了，但是还有至关重要的一步，我们在上文的`--foreign`参数提到过，很多软件包我们仅是完成了下载，还未进行安装，所以还需要执行：

```shell
/debootstrap/debootstrap --second-stage
```

来完成这些软件包的安装过程

当这一步执行完，我们就拥有了一个可用的 risc-v架构下的 deepin 操作系统，虽然目前是在最小状态下运行的，不过它潜力无限

不过这时候往往还会出现一个问题，当你尝试用 apt 安装其他包时，你可能会发现，这玩意怎么连不上网？

## qemu 的网络配置

查看`./run.sh`文件里的内容，在 qemu-system 的启动参数中有这样两行

```shell
-device virtio-net-device,netdev=usernet \
-netdev user,id=usernet \
```
这代表了要求 qemu 使用 user 状态下的网络配置，这是最简单最易操作的一种网络配置，qemu 将为我们虚拟出网关，dns等我们需要的一切网络环境，网络拓扑图如下：

```
#感谢梓瑶老师倾情讲解
user                                                                                                                  │
                                                                                                                      │
        eth0    10.0.2.0/24                                                                                           │
                10.0.2.1        host    -> qemu-system-xxx -> localhost                                               │
                10.0.2.2        router  -> qemu-system-xxx -> external address                                        │
                10.0.2.3        dns     -> qemu-system-xxx -> host getnamexxx()
```
所以说，只要将虚拟机内的网络配置到`10.0.2.0/24`网段内的一个可用 ip 就能上网了

通过`ip a`命令可以看到当前各网卡情况，你应该能看到一个名为`eth0`的网卡，将这个网卡的ip改到`10.0.2.0/24`网段，比如`10.0.2.25`，虚拟机内就能上网了！你可以使用 apt 安装你想要的包，再编译打包一个 neofetch 即可完成 deepin 岗的 pre-task！

不过一般指令配置 ip 都是临时的，如果想要永久固定好本机网络配置，你可能需要修改具体的网络配置文件或使用 network-manager 等工具，笔者还未补充此部分内容




## 交叉编译器
