# Time To Arch

https://www.cnblogs.com/h-xl/p/18114235


# ATK Hub 失灵问题

https://www.reddit.com/r/linux_gaming/comments/1feizmm/atk_hub_not_working/

本质上的文件权限问题，在 Chrome 中打开 `chrome://device-log/`，可以看到 ATK Hub 的错误信息。

```log
HIDEvent[09:58:28] Failed to open '/dev/hidraw1': FILE_ERROR_ACCESS_DENIED
HIDEvent[09:58:28] Access denied opening device read-write, trying read-only.
```

先用 `lsusb` 命令查看 ATK Hub 的设备信息：

```bash
lsusb
```

可以看到类似以下输出：

```
Bus 003 Device 002: ID 3554:f58e Compx VXE Mouse 1K Dongle
```

这表明 ATK Hub 的设备 ID 是 `3554:f58e`。


解决方法是在 `/etc/udev/rules.d/` 目录下创建一个新的规则文件，例如 `99-atk-hub.rules`，内容如下：

注意替换`3554` 为你的设备的 `idVendor`，如果你看到的设备 ID 是 `3554:f58e`，那么 `idVendor` 就是 `3554`。

```bash
KERNEL=="hidraw*", ATTRS{idVendor}=="3554", MODE="0666"
```

然后执行以下命令以重新加载 udev 规则：

```bash
sudo udevadm control --reload-rules
sudo udevadm trigger
```