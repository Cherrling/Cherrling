
# 梦开始的地方

入职 plct 的 deepin 岗，通过了上机考试后，第一个 pre-task 是使用 qemu 构建一个虚拟的 risc-v 系统，并且成功在 rv 的 deepin 系统中从源码编译运行 neofetch 

本文将详细叙述完成该 pre-task 所需要的所有操作步骤 

首先我们要知道，想要运行起一个 linux 系统，必须要有两样东西： `编译好的内核文件` 和 `根文件系统(root file system)`

在本文中，我们采用了预编译好的 openeuler 的内核，并且通过 debootstrap 工具构建了 deepin 系统所必须的最小根文件系统

## qemu 的安装

QEMU（Quick EMUlator）是一个开源的、通用的模拟器和虚拟化软件，由 Fabrice Bellard 创建。 它允许在一个平台上运行一个或多个操作系统，这些操作系统与宿主机（即运行QEMU的机器）的原生操作系统完全隔离。QEMU可以在没有硬件加速支持的情况下通过解释执行指令来模拟整个计算机系统，也可以在支持虚拟化技术的硬件上运行，提供接近原生的性能

首先，我们可能需要安装一系列的依赖工具，它们往往已经被预装在了你的系统中，但是保险起见还是再检查一次

```shell
sudo apt-get install git autoconf automake autotools-dev curl python3 libmpc-dev libmpfr-dev libgmp-dev gawk build-essential bison flex texinfo gperf patchutils bc libexpat-dev libglib2.0-dev ninja-build zlib1g-dev pkg-config libboost-all-dev libtool libssl-dev libpixman-1-dev libpython-dev virtualenv libmount-dev libsdl2-dev

```

然后，直接开始安装 qemu

```shell
sudo apt-get install qemu-system-arm
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

大功告成，这时我们就可以向`/mnt/deepin`内写入文件，就相当于向这块虚拟磁盘内写入内容了


## debootstrap


## qemu 网络配置






## 交叉编译器
