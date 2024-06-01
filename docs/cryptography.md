
# 密码学中问题

*2024.5.30*


学完密码学了，简单记一下涉及的小问题。

### 零知识证明ZKP

![alt text](assets/cryptography/image.png)

涉及的问题是，如果alice要向bob证明自己知道咒语，为什么alice不直接从a路进去b路出来

因为零知识证明要求即使不知道咒语的人也有几率蒙混过关。原方法的过程中多次重复实验就是为了减小这个概率，但是这个概率始终不为零（1/2^n）

![alt text](assets/cryptography/image-1.png)