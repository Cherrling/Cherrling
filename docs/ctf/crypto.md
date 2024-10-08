
# Crypto 题目

## K-Cessation

ChllengeInfo

misc/crypto 进入无界之界

### 背景：
K-Cessation 密码是一种使用 K 位轮从明文位中挑选下一个密文位的古典密码。
当加密开始时，从轮子的最后一位开始。
当轮子到达终点时，它会从头开始循环。
对于每个明文位，轮子会旋转到轮子中与明文位匹配的下一个位，并将旋转的距离附加到密文中。

因此，如果不知道轮子，就不可能解密密文。
是这样吗？


### 例子：
要使用轮子 1100011011100011100110100011110110010110010100001011111011111010 将“youtu.be/dQw4w9WgXcQ”编码为 64-Cessation：
1. 将明文转换为比特： 01111001 01101111 01110101 01110100 01110101 00101110 01100010 01100101 00101111 01100100 01010001 01110111 0011 0100 01110111 00111001 01010111 01100111 01011000 01100011 01010001
2. 从wheel[-1]到轮子中的下一个“0”位，距离为3，当前轮位置为wheel[2]
3. 从wheel[2]到轮子中的下一个“1”位，距离为3，当前轮子位置为wheel[5]
4. 重复步骤直到所有位都被编码
5. 结果为3312121232111411211311221152515233123332223411313221112161142123243321244111111311111112111131113211132412111212112112321122115251142114213312132313311222111112


### 挑战：
一个野生Flag使用 64-Cessation 密码进行编码。
轮子内容是未知的，它是 64 位长。
密文在 ciphertext.txt 中给出。
该Flag已知是长度超过 64 个字符的 ASCII 字符串。
除此之外，该Flag的任何部分都是未知的，这意味着该Flag不是 WMCTF{} 或 FLAG{} 格式。
提交时，请将Flag改为WMCTF{}格式。
请注意，每个ASCII字节的最高有效位被随机翻转。
您需要从密文中提取Flag并提交。
为了您的方便，flag_hash.txt 中给出了该Flag的盐焗 SHA-256 哈希值。

ChllengeInfo-EN
misc/crypto Enter the realm of no realm
### Background:
K-Cessation cipher is a cipher that uses a K bit wheel to pick the next cipher bit from plaintext bit.
When encryption starts, the wheel starts at the last bit of the wheel.
The wheel loops around when it reaches the end.
For every plaintext bit, the wheel is rotated to the next bit in the wheel that matches the plaintext bit, and the distance rotated is appended to the ciphertext.

Therefore, if the wheel is not known, it is not possible to decrypt the ciphertext.
Or is it?


### Example:
To encode "youtu.be/dQw4w9WgXcQ" in 64-Cessation with the wheel 1100011011100011100110100011110110010110010100001011111011111010:
1. convert the plaintext to bits: 01111001 01101111 01110101 01110100 01110101 00101110 01100010 01100101 00101111 01100100 01010001 01110111 00110100 01110111 00111001 01010111 01100111 01011000 01100011 01010001
2. from wheel[-1] to the next "0" bit in the wheel, distance is 3, the current wheel position is wheel[2]
3. from wheel[2] to the next "1" bit in the wheel, distance is 3, the current wheel position is wheel[5]
4. repeat the steps until all bits is encoded
5. the result is 3312121232111411211311221152515233123332223411313221112161142123243321244111111311111112111131113211132412111212112112321122115251142114213312132313311222111112


### Challenge:
A flag is encoded with 64-Cessation cipher.
The wheel is not known except that it is 64 bits long.
The ciphertext is given in ciphertext.txt.
The flag is only known to be an ASCII string that is longer than 64 characters.
No part of the flag is known, which means the flag is NOT in WMCTF{} or FLAG{} format.
When submitting, please make the flag in WMCTF{} format.
Note that, The most significant bit of each ASCII byte is flipped with a random bit.
You need to extract the flag from the ciphertext and submit it.
For your convenience, a salted sha256 hash of the flag is given in flag_hash.txt.



```text
ciphertext
[2, 1, 1, 3, 1, 1, 3, 2, 1, 4, 1, 2, 3, 1, 1, 1, 2, 1, 1, 2, 2, 2, 1, 3, 1, 6, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 3, 3, 2, 1, 1, 3, 1, 1, 1, 3, 4, 1, 3, 1, 2, 2, 4, 2, 5, 1, 1, 1, 3, 2, 1, 4, 2, 2, 1, 2, 1, 3, 1, 1, 1, 1, 1, 2, 3, 1, 2, 1, 1, 1, 1, 3, 4, 1, 2, 2, 4, 2, 5, 1, 2, 1, 2, 2, 1, 4, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1, 4, 3, 1, 2, 1, 3, 1, 3, 3, 2, 1, 3, 1, 6, 2, 1, 1, 2, 1, 2, 1, 3, 1, 1, 2, 1, 2, 1, 1, 2, 1, 2, 2, 2, 3, 1, 1, 4, 1, 3, 1, 1, 1, 2, 1, 1, 2, 4, 1, 1, 5, 2, 4, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 3, 3, 1, 1, 1, 1, 1, 2, 1, 2, 3, 1, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 5, 1, 1, 1, 3, 1, 1, 2, 3, 1, 2, 2, 2, 1, 3, 3, 1, 1, 2, 1, 1, 4, 3, 1, 3, 4, 1, 1, 1, 2, 1, 3, 1, 6, 1, 2, 1, 1, 3, 2, 3, 1, 2, 2, 1, 3, 2, 1, 2, 2, 2, 3, 3, 3, 1, 1, 2, 4, 1, 1, 1, 1, 1, 4, 2, 1, 4, 1, 2, 3, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 3, 2, 1, 2, 1, 1, 1, 4, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 4, 2, 1, 4, 2, 4, 2, 2, 3, 1, 2, 2, 2, 1, 3, 3, 1, 2, 1, 1, 1, 1, 3, 3, 1, 3, 1, 1, 1, 1, 3, 1, 1, 4, 2, 5, 2, 1, 3, 1, 1, 2, 3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 3, 1, 2, 1, 3, 1, 2, 3, 4, 4, 3, 2, 4, 2, 1, 4, 2, 4, 1, 2, 1, 3, 1, 2, 1, 1, 1, 3, 2, 1, 2, 2, 2, 3, 3, 1, 2, 1, 3, 1, 1, 1, 2, 1, 3, 4, 2, 1, 4, 1, 2, 1, 2, 2, 2, 1, 1, 2, 1, 1, 2, 2, 2, 1, 4, 2, 1, 4, 1, 1, 1, 1, 2, 4, 4, 3, 2, 4, 2, 1, 1, 1, 1, 1, 1, 1, 4, 2, 2, 3, 1, 1, 1, 2, 1, 3, 1, 4, 1, 2, 4, 1, 2, 3, 4, 1, 3, 1, 1, 1, 2, 4, 1, 1, 1, 4, 1, 1, 4, 2, 1, 4, 2, 2, 1, 1, 1, 1, 1, 2, 3, 2, 1, 4, 3, 3, 4, 4, 3, 2, 4, 2, 1, 1, 3, 2, 4, 1, 1, 2, 3, 1, 1, 1, 2, 2, 1, 1, 1, 1, 3, 1, 1, 1, 4, 3, 3, 1, 1, 2, 1, 1, 1, 1, 3, 1, 1, 4, 2, 5, 1, 1, 4, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 2, 1, 2, 1, 2, 4, 3, 1, 1, 1, 1, 3, 4, 3, 1, 1, 4, 1, 6, 2, 1, 1, 1, 3, 1, 1, 3, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 4, 3, 1, 1, 5, 4, 1, 2, 2, 4, 1, 6, 1, 2, 1, 1, 3, 1, 4, 1, 2, 1, 2, 1, 1, 1, 1, 4, 2, 2, 3, 1, 2, 3, 1, 3, 4, 1, 1, 3, 4, 2, 5, 1, 1, 1, 3, 2, 2, 3, 2, 1, 2, 2, 2, 2, 3, 1, 2, 1, 3, 3, 3, 1, 1, 2, 1, 3, 3, 1, 1, 4, 2, 5, 2, 4, 1, 2, 4, 1, 2, 1, 2, 1, 1, 1, 2, 3, 1, 2, 4, 1, 1, 4, 4, 1, 1, 2, 3, 2, 4, 2, 5, 1, 2, 1, 2, 1, 1, 2, 3, 1, 2, 1, 2, 1, 1, 3, 1, 1, 2, 1, 2, 3, 1, 1, 1, 3, 4, 1, 1, 2, 1, 1, 1, 2, 4, 2, 1, 1, 3, 1, 2, 1, 2, 2, 2, 1, 2, 2, 1, 1, 1, 2, 1, 3, 1, 1, 2, 1, 2, 3, 1, 1, 1, 3, 4, 1, 1, 2, 3, 1, 2, 3, 1, 6, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 4, 2, 1, 4, 1, 2, 3, 1, 1, 2, 1]
```
```text
hash
d650078ae91d82ebd1d586110960a789c1a15e2cbc053b9daf8d8a4905950720:b840089ce93581869e9c02a7b5aefa7b
```
```python
# 题目附件源代码

from typing import List,Union,Literal
from Crypto.Util.number import long_to_bytes
import secrets
import random,string,re

class K_Cessation:
    '''
    ### Background:
    K-Cessation cipher is a cipher that uses a K bit wheel to pick the next cipher bit from plaintext bit.
    When encryption starts, the wheel starts at the last bit of the wheel.
    The wheel loops around when it reaches the end.
    For every plaintext bit, the wheel is rotated to the next bit in the wheel that matches the plaintext bit, and the distance rotated is appended to the ciphertext.

    Therefore, if the wheel is not known, it is not possible to decrypt the ciphertext. 
    Or is it?

    
    ### Example:
    To encode "youtu.be/dQw4w9WgXcQ" in 64-Cessation with the wheel 1100011011100011100110100011110110010110010100001011111011111010:
    1. convert the plaintext to bits: 01111001 01101111 01110101 01110100 01110101 00101110 01100010 01100101 00101111 01100100 01010001 01110111 00110100 01110111 00111001 01010111 01100111 01011000 01100011 01010001
    2. from wheel[-1] to the next "0" bit in the wheel, distance is 3, the current wheel position is wheel[2]
    3. from wheel[2] to the next "1" bit in the wheel, distance is 3, the current wheel position is wheel[5]
    4. repeat the steps until all bits is encoded
    5. the result is 3312121232111411211311221152515233123332223411313221112161142123243321244111111311111112111131113211132412111212112112321122115251142114213312132313311222111112


    ### Challenge:
    A flag is encoded with 64-Cessation cipher. 
    The wheel is not known. 
    The ciphertext is given in ciphertext.txt.
    The flag is only known to be an ascii string that is longer than 64 characters. 
    No part of the flag is known, which means the flag is NOT in WMCTF{} or FLAG{} format.
    When submitting, please make the flag in WMCTF{} format.
    The most significant bit of each byte is flipped with a random bit.
    You need to extract the flag from the ciphertext and submit it.
    For your convenience, a salted sha256 hash of the flag is given in flag_hash.txt.

    '''

    def __is_valid_wheel(self):
        hasZero = False
        hasOne = False
        for i in self.wheel:
            if not isinstance(i,int):
                raise ValueError("Wheel must be a list of int")
            if i == 0:
                hasZero = True
            elif i == 1:
                hasOne = True
            if i > 1 or i < 0:
                raise ValueError("Wheel must be a list of 0s and 1s")
        if not hasZero or not hasOne:
            raise ValueError("Wheel must contain at least one 0 and one 1")

    def __init__(self,wheel:List[int]):
        self.wheel = wheel
        self.__is_valid_wheel()
        self.state = -1
        self.finalized = False
    def __find_next_in_wheel(self,target:Literal[1,0]) -> List[int]:
        result = 1
        while True:
            ptr = self.state + result
            ptr = ptr % len(self.wheel)
            v = self.wheel[ptr]
            if v == target:
                self.state = ptr
                return [result]
            result+=1
    def __iter_bits(self,data:bytes):
        for b in data:
            for i in range(7,-1,-1):
                yield (b >> i) & 1
    def __check_finalized(self):
        if self.finalized:
            raise ValueError("This instance has already been finalized")
        self.finalized = True
    def encrypt(self,data:Union[str,bytes]) -> List[int]:
        self.__check_finalized()
        if isinstance(data,str):
            data = data.encode()
        out = []
        for bit in self.__iter_bits(data):
            rs = self.__find_next_in_wheel(bit)
            # print(f"bit={bit},rs={rs},state={self.state}")
            out.extend(rs)
        return out
    
    def decrypt(self,data:List[int]) -> bytes:
        self.__check_finalized()
        out = []
        for i in data:
            assert type(i) == int
            self.state = self.state + i
            self.state %= len(self.wheel)
            out.append(self.wheel[self.state])
        long = "".join(map(str,out))
        return long_to_bytes(int(long,2))

# generate a random wheel with k bits.
def random_wheel(k=64) -> List[int]:
    return [secrets.randbelow(2) for _ in range(k)]

# the most significant bit of each byte is flipped with a random bit.
def encode_ascii_with_random_msb(data:bytes) -> bytes:
    out = bytearray()
    for b in data:
        assert b < 128, "not ascii"
        b = b ^ (0b10000000 * secrets.randbelow(2))
        out.append(b)
    return bytes(out)

# for your convenience, here is the decoding function.
def decode_ascii_with_random_msb(data:bytes) -> bytes:
    out = bytearray()
    for b in data:
        b = b & 0b01111111
        out.append(b)
    return bytes(out)


if __name__ == "__main__":
    try:
        from flag import flag
        from flag import wheel
    except ImportError:
        print("flag.py not found, using test flag")
        flag = "THIS_IS_TEST_FLAG_WHEN_YOU_HEAR_THE_BUZZER_LOOK_AT_THE_FLAG_BEEEP"
        wheel = random_wheel(64)
    
    # wheel is wheel and 64 bits
    assert type(wheel) == list and len(wheel) == 64 and all((i in [0,1] for i in wheel))
    # flag is flag and string
    assert type(flag) == str
    # flag is ascii
    assert all((ord(c) < 128 for c in flag))
    # flag is long
    assert len(flag) > 64
    # flag does not start with wmctf{ nor does it end with }
    assert not flag.lower().startswith("wmctf{") and not flag.endswith("}")
    # flag also does not start with flag{
    assert not flag.lower().startswith("flag{")

    # the most significant bit of each byte is flipped with a random bit.
    # print(flag.encode())
    plaintext = encode_ascii_with_random_msb(flag.encode())
    # print(plaintext)

    c = K_Cessation(wheel)
    ct = c.encrypt(plaintext)
    with open("ciphertext.txt","w") as f:
        f.write(str(ct))

    import hashlib
    # for you can verify the correctness of your decryption.
    # or you can brute force the flag hash, it is just a >64 length string :)
    with open("flag_hash.txt","w") as f:
        salt = secrets.token_bytes(16).hex()
        h = hashlib.sha256((salt + flag).encode()).hexdigest()
        f.write(h + ":" + salt)

    # demostration that decryption works
    c = K_Cessation(wheel)
    pt = c.decrypt(ct)
    pt = decode_ascii_with_random_msb(pt)
    print(f"decode:{pt}")
    assert flag.encode() in pt
```


### 思路

有点像维吉尼亚密码？弄个码表那种

根据密文进行统计分析，看 wheel 上每一位选择 0/1 时，到达下一跳的距离。统计后每一位置到下一跳的距离差即为该位置到下一个 0/1 分界点的距离

其实还原 wheel 的时候可以只使用交界处的跳点，不过统计样本不够导致某些点只有一个距离数据，这时候就要猜目标点的下一个点时 0/1 了，感觉需要弄出来 2^3 或者 2^4 种可能情况，然后跑一下看哪个能过 assert 和 hash 就出来了

不过下面解题代码有点 bug ，没写多种情况的处理方式，跑出来的 flag 可以说是初具人形但是有几个位置不对。半夜懒得改了，反正思路是对的。

```python
# result
wheel_step=[[1, 2], [1, 2], [1, 2], [3, 1], [1, 2], [3, 1], [1, 2], [1, 4], [3, 1], [1, 2], [1, 2], [2, 1], [1, 2], [1, 2], [4, 1], [3, 1], [2, 1], [4, 1], [1, 3], [2, 1], [1, 4], [3, 1], [1, 2], [1, 5], [1, 4], [1, 3], [1, 2], [2, 1], [1, 4], [1, 3], [1, 2], [2, 1], [1, 3], [2, 1], [1, 3], [2, 1], [2, 1], [1, 4], [3, 1], [1, 0], [1, 0], [1, 2], [6, 1], [5, 1], [4, 1], [1, 3], [1, 0], [1, 0], [1, 2], [1, 2], [4, 1], [3, 1], [2, 1], [3, 0], [1, 2], [1, 2], [1, 2], [1, 4], [1, 3], [1, 2], [1, 2], [1, 2], [2, 1], [2, 1]]

wheel=[1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0]

# 正确 wheel
wheel=[1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0]

decode:b'DoubleUmCtF[S33K1NG_tru7h-7h3_w1s3-f1nd_1n57e4d-17s_pr0f0und-4b5ence_n0w-g0_s0lv3-th3_3y3s-1n_N0ita]'
```


```python
from typing import List,Union,Literal
from Crypto.Util.number import long_to_bytes
import secrets
import random,string,re

ori_cipher=[2, 1, 1, 3, 1, 1, 3, 2, 1, 4, 1, 2, 3, 1, 1, 1, 2, 1, 1, 2, 2, 2, 1, 3, 1, 6, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 3, 3, 2, 1, 1, 3, 1, 1, 1, 3, 4, 1, 3, 1, 2, 2, 4, 2, 5, 1, 1, 1, 3, 2, 1, 4, 2, 2, 1, 2, 1, 3, 1, 1, 1, 1, 1, 2, 3, 1, 2, 1, 1, 1, 1, 3, 4, 1, 2, 2, 4, 2, 5, 1, 2, 1, 2, 2, 1, 4, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1, 4, 3, 1, 2, 1, 3, 1, 3, 3, 2, 1, 3, 1, 6, 2, 1, 1, 2, 1, 2, 1, 3, 1, 1, 2, 1, 2, 1, 1, 2, 1, 2, 2, 2, 3, 1, 1, 4, 1, 3, 1, 1, 1, 2, 1, 1, 2, 4, 1, 1, 5, 2, 4, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 3, 3, 1, 1, 1, 1, 1, 2, 1, 2, 3, 1, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 5, 1, 1, 1, 3, 1, 1, 2, 3, 1, 2, 2, 2, 1, 3, 3, 1, 1, 2, 1, 1, 4, 3, 1, 3, 4, 1, 1, 1, 2, 1, 3, 1, 6, 1, 2, 1, 1, 3, 2, 3, 1, 2, 2, 1, 3, 2, 1, 2, 2, 2, 3, 3, 3, 1, 1, 2, 4, 1, 1, 1, 1, 1, 4, 2, 1, 4, 1, 2, 3, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 3, 2, 1, 2, 1, 1, 1, 4, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 4, 2, 1, 4, 2, 4, 2, 2, 3, 1, 2, 2, 2, 1, 3, 3, 1, 2, 1, 1, 1, 1, 3, 3, 1, 3, 1, 1, 1, 1, 3, 1, 1, 4, 2, 5, 2, 1, 3, 1, 1, 2, 3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 3, 1, 2, 1, 3, 1, 2, 3, 4, 4, 3, 2, 4, 2, 1, 4, 2, 4, 1, 2, 1, 3, 1, 2, 1, 1, 1, 3, 2, 1, 2, 2, 2, 3, 3, 1, 2, 1, 3, 1, 1, 1, 2, 1, 3, 4, 2, 1, 4, 1, 2, 1, 2, 2, 2, 1, 1, 2, 1, 1, 2, 2, 2, 1, 4, 2, 1, 4, 1, 1, 1, 1, 2, 4, 4, 3, 2, 4, 2, 1, 1, 1, 1, 1, 1, 1, 4, 2, 2, 3, 1, 1, 1, 2, 1, 3, 1, 4, 1, 2, 4, 1, 2, 3, 4, 1, 3, 1, 1, 1, 2, 4, 1, 1, 1, 4, 1, 1, 4, 2, 1, 4, 2, 2, 1, 1, 1, 1, 1, 2, 3, 2, 1, 4, 3, 3, 4, 4, 3, 2, 4, 2, 1, 1, 3, 2, 4, 1, 1, 2, 3, 1, 1, 1, 2, 2, 1, 1, 1, 1, 3, 1, 1, 1, 4, 3, 3, 1, 1, 2, 1, 1, 1, 1, 3, 1, 1, 4, 2, 5, 1, 1, 4, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 2, 1, 2, 1, 2, 4, 3, 1, 1, 1, 1, 3, 4, 3, 1, 1, 4, 1, 6, 2, 1, 1, 1, 3, 1, 1, 3, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 4, 3, 1, 1, 5, 4, 1, 2, 2, 4, 1, 6, 1, 2, 1, 1, 3, 1, 4, 1, 2, 1, 2, 1, 1, 1, 1, 4, 2, 2, 3, 1, 2, 3, 1, 3, 4, 1, 1, 3, 4, 2, 5, 1, 1, 1, 3, 2, 2, 3, 2, 1, 2, 2, 2, 2, 3, 1, 2, 1, 3, 3, 3, 1, 1, 2, 1, 3, 3, 1, 1, 4, 2, 5, 2, 4, 1, 2, 4, 1, 2, 1, 2, 1, 1, 1, 2, 3, 1, 2, 4, 1, 1, 4, 4, 1, 1, 2, 3, 2, 4, 2, 5, 1, 2, 1, 2, 1, 1, 2, 3, 1, 2, 1, 2, 1, 1, 3, 1, 1, 2, 1, 2, 3, 1, 1, 1, 3, 4, 1, 1, 2, 1, 1, 1, 2, 4, 2, 1, 1, 3, 1, 2, 1, 2, 2, 2, 1, 2, 2, 1, 1, 1, 2, 1, 3, 1, 1, 2, 1, 2, 3, 1, 1, 1, 3, 4, 1, 1, 2, 3, 1, 2, 3, 1, 6, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 4, 2, 1, 4, 1, 2, 3, 1, 1, 2, 1]
ori_hash='d650078ae91d82ebd1d586110960a789c1a15e2cbc053b9daf8d8a4905950720:b840089ce93581869e9c02a7b5aefa7b'
class K_Cessation:
    '''
    ### Background:
    K-Cessation cipher is a cipher that uses a K bit wheel to pick the next cipher bit from plaintext bit.
    When encryption starts, the wheel starts at the last bit of the wheel.
    The wheel loops around when it reaches the end.
    For every plaintext bit, the wheel is rotated to the next bit in the wheel that matches the plaintext bit, and the distance rotated is appended to the ciphertext.

    Therefore, if the wheel is not known, it is not possible to decrypt the ciphertext. 
    Or is it?

    
    ### Example:
    To encode "youtu.be/dQw4w9WgXcQ" in 64-Cessation with the wheel 1100011011100011100110100011110110010110010100001011111011111010:
    1. convert the plaintext to bits: 01111001 01101111 01110101 01110100 01110101 00101110 01100010 01100101 00101111 01100100 01010001 01110111 00110100 01110111 00111001 01010111 01100111 01011000 01100011 01010001
    2. from wheel[-1] to the next "0" bit in the wheel, distance is 3, the current wheel position is wheel[2]
    3. from wheel[2] to the next "1" bit in the wheel, distance is 3, the current wheel position is wheel[5]
    4. repeat the steps until all bits is encoded
    5. the result is 3312121232111411211311221152515233123332223411313221112161142123243321244111111311111112111131113211132412111212112112321122115251142114213312132313311222111112


    ### Challenge:
    A flag is encoded with 64-Cessation cipher. 
    The wheel is not known. 
    The ciphertext is given in ciphertext.txt.
    The flag is only known to be an ascii string that is longer than 64 characters. 
    No part of the flag is known, which means the flag is NOT in WMCTF{} or FLAG{} format.
    When submitting, please make the flag in WMCTF{} format.
    The most significant bit of each byte is flipped with a random bit.
    You need to extract the flag from the ciphertext and submit it.
    For your convenience, a salted sha256 hash of the flag is given in flag_hash.txt.

    '''

    def __is_valid_wheel(self):
        hasZero = False
        hasOne = False
        for i in self.wheel:
            if not isinstance(i,int):
                raise ValueError("Wheel must be a list of int")
            if i == 0:
                hasZero = True
            elif i == 1:
                hasOne = True
            if i > 1 or i < 0:
                raise ValueError("Wheel must be a list of 0s and 1s")
        if not hasZero or not hasOne:
            raise ValueError("Wheel must contain at least one 0 and one 1")

    def __init__(self,wheel:List[int]):
        self.wheel = wheel
        self.__is_valid_wheel()
        self.state = -1
        self.finalized = False
    def __find_next_in_wheel(self,target:Literal[1,0]) -> List[int]:
        result = 1
        while True:
            ptr = self.state + result
            ptr = ptr % len(self.wheel)
            v = self.wheel[ptr]
            if v == target:
                self.state = ptr
                return [result]
            result+=1
    def __iter_bits(self,data:bytes):
        for b in data:
            for i in range(7,-1,-1):
                yield (b >> i) & 1
    def __check_finalized(self):
        if self.finalized:
            raise ValueError("This instance has already been finalized")
        self.finalized = True
    def encrypt(self,data:Union[str,bytes]) -> List[int]:
        self.__check_finalized()
        if isinstance(data,str):
            data = data.encode()
        out = []
        for bit in self.__iter_bits(data):
            rs = self.__find_next_in_wheel(bit)
            # print(f"bit={bit},rs={rs},state={self.state}")
            out.extend(rs)
        return out
    
    def decrypt(self,data:List[int]) -> bytes:
        self.__check_finalized()
        out = []
        for i in data:
            assert type(i) == int
            self.state = self.state + i
            self.state %= len(self.wheel)
            out.append(self.wheel[self.state])
        long = "".join(map(str,out))
        return long_to_bytes(int(long,2))
    
    
# generate a random wheel with k bits.
def random_wheel(k=64) -> List[int]:
    return [secrets.randbelow(2) for _ in range(k)]

# the most significant bit of each byte is flipped with a random bit.
def encode_ascii_with_random_msb(data:bytes) -> bytes:
    out = bytearray()
    for b in data:
        assert b < 128, "not ascii"
        b = b ^ (0b10000000 * secrets.randbelow(2))
        out.append(b)
    return bytes(out)

# for your convenience, here is the decoding function.
def decode_ascii_with_random_msb(data:bytes) -> bytes:
    out = bytearray()
    for b in data:
        b = b & 0b01111111
        out.append(b)
    return bytes(out)
flag="THIS_IS_TEST_FLAG_WHEN_YOU_HEAR_THE_BUZZER_LOOK_AT_THE_FLAG_BEEEP"
wheel=[0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0]
test_cipher=[3, 3, 1, 2, 1, 2, 1, 2]
# 创建一个有64元素全为-1的数组
wheel_step = [[0,0]for _ in range(64)]
index=-1
for i in ori_cipher:
# for i in test_cipher:
    x=index%64
    index+=i
    if wheel_step[x][0]==0:
        wheel_step[x][0]=i
    elif wheel_step[x][0]!=i:
        wheel_step[x][1]=i

wheel_step
print(f'wheel_step={wheel_step}')
wheel=[1 for _ in range(64)]
i=0
print(f'wheel_len={len(wheel)}')
while True:
    num=abs(wheel_step[i][0]-wheel_step[i][1])
    # print(f'num={num}')
    if wheel_step[i][0]==0 or wheel_step[i][1]==0:
        i+=1
        if i>=64:
            break
        continue
    # 指定位置覆盖与wheel[i]相反的元素
    for j in range(num):
        if i+j+1>=64:
            break
        wheel[(i+j+1)%64]=1-wheel[i]
    i+=num
    if i>=64:
        break
print(f'wheel_len={len(wheel)}')

print(f'wheel={wheel}')
# wheel is wheel and 64 bits
assert type(wheel) == list and len(wheel) == 64 and all((i in [0,1] for i in wheel))
# flag is flag and string
assert type(flag) == str
# flag is ascii
assert all((ord(c) < 128 for c in flag))
# flag is long
assert len(flag) > 64
# flag does not start with wmctf{ nor does it end with }
assert not flag.lower().startswith("wmctf{") and not flag.endswith("}")
# flag also does not start with flag{
assert not flag.lower().startswith("flag{")

# the most significant bit of each byte is flipped with a random bit.
ct_list = []
wheel = random_wheel(64)
for i in range(0,200):
    
    plaintext = encode_ascii_with_random_msb(flag.encode())
    c = K_Cessation(wheel)
    ct = c.encrypt(plaintext)
    ct_list.append(ct)

# 比较ct_list中，有哪些位在所有元素中都相同
def get_same_bits(ct_list):
    location_bits = []
    for i in range(len(ct_list[0])):
        if all(ct[i] == ct_list[0][i] for ct in ct_list):
            location_bits.append(i)
    return location_bits
print(get_same_bits(ct_list))

wheel='1010110011101010001110001111011101100100011000001101110010111010'.replace('0','0 ').replace('1','1 ').split()
wheel=[int(i) for i in wheel]
print(f'wheel={wheel}')

# import hashlib
# # for you can verify the correctness of your decryption.
# # or you can brute force the flag hash, it is just a >64 length string :)
# salt = secrets.token_bytes(16).hex()
# h = hashlib.sha256((salt + flag).encode()).hexdigest()
# print(f"flag_hash:{h}:{salt}")

wheel=[0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1]
wheel=[0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1]

wheel=[1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0]
wheel=[1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0]
wheel=[1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1]
wheel=[1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0]

wheel=[1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0]
# demostration that decryption works
c = K_Cessation(wheel)
pt = c.decrypt(ori_cipher)
pt = decode_ascii_with_random_msb(pt)
print(f"decode:{pt}")
# assert flag.encode() in pt

flag='Dou`leUm\x03tF[C33K1NG_tru7h-\x17h3_W1s3\rf1nd_1n5\x17e4d-17sOpr0b0un`-4b\x15enca_n0w-g0_c0lv\x13-th3_3x3s-1f_N0hta]'
# flag="THIS_IS_TEST_FLAG_WHEN_YOU_HEAR_THE_BUZZER_LOOK_AT_THE_FLAG_BEEEP"

import hashlib
# for you can verify the correctness of your decryption.
# or you can brute force the flag hash, it is just a >64 length string :)
salt='b840089ce93581869e9c02a7b5aefa7b'
# salt='9f8b1644b867eb1ea96ba18c02e747d9'
print(salt)
h = hashlib.sha256((salt + flag).encode()).hexdigest()
h
```