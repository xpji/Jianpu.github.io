---
layout: post
title: "Windows 11 installing the latest TensorFlow version with CUDA, cudNN, and GPU support"
author: Jianpu
categories: Python
tags: [tutorial]
image: study.jpeg
date: 2024-03-26 22:21
comments: true
---




# 前言


TensorFlow 是一个由 Google 建立的深度学习库，自从去年年初推出以来，它已经获得了很大的吸引力。主要功能包括自动微分、卷积神经网络(CNN)和回归神经网络(RNN)。它是用 C + + 和 Python 编写的，为了提高性能，它使用了一个名为“ Cloud TensorFlow”的服务器，该服务器运行在 Google Cloud Platform 上。它不需要 GPU，而 GPU 是它的主要功能之一。

Tensorflow 的最新版本也通过 matplotlib 支持数据可视化。这个可视化库非常流行，它经常用于数据科学课程，以及艺术家和工程师使用 MATLAB 或 Python/R/等进行数据可视化。



## 前期软件准备：

![image.png](https://s2.loli.net/2024/03/23/LwmYPoMbf4dqhyj.png)

- windows 7 或者更新 （我这里使用的是windows11）
- python 3.7-3.10  （我这里使用的是anaconda ，便于库的安装和环境管理）
- 合适的 Microsoft Visual Studio （但是我这里没有进行安装，可能系统已经提前自带了）
- python 编译器选择的是vscode


如果需要安装Microsoft Visual Studio的话可以在以下链接进行下载：

https://visualstudio.microsoft.com/zh-hans/vs/




# 具体安装步骤

## 1、检查显卡

首先，在windows上安装深度学习环境，需要先了解你的显卡型号。知道了显卡型号，以及适配的 cuda 和 cudnn 所对应的版本，再进行相关下载可以避免很多问题。


查看显卡型号的方法有两种：

- 查看任务管理器 - GPU


![image.png](https://s2.loli.net/2024/03/22/Y4uOiGogPtCjMw7.png)

-  开始 - 设备管理器 - 显示适配器


![image.png](https://s2.loli.net/2024/03/22/c3Lgfas7RvetIop.png)

---


查看cuda 支持的系统和对应的版本：

![image.png](https://s2.loli.net/2024/03/22/jnPEcdCkhOl2NgK.png)

---


这里，以我的显卡3060ti为例，安装tensorflow-gpu深度学习环境。

---

首先需要查看一些tensorflow支持的gpu加速对应的cuda 和 cudnn 版本以及 python版本

网址在这：
[点击这里查看更多信息](https://tensorflow.google.cn/install/source_windows?hl=en#gpu)


![image.png](https://s2.loli.net/2024/03/22/YMkDucKSbeEv7m9.png)


---

## 2、安装cuda

这里以安装cuda 11.2 和 cudnn 8.1 为例，为什么选择这两个版本下面会说明

[cuda下载网址](https://developer.nvidia.com/cuda-toolkit-archive)


![image.png](https://s2.loli.net/2024/03/22/Z8fSyhIFPznJ214.png)


点击想要安装的版本，屏幕将弹出，在那里你可以选择一些选项，按照下面的图片，并选择这些选项为 Windows。

![image.png](https://s2.loli.net/2024/03/22/KX5DjMPvJzgGhfR.png)

选择上述选项后，等待下载完成。

![image.png](https://s2.loli.net/2024/03/22/X6ZJhaB2msQOL7G.png)

使用 Express (推荐)选项安装它，（也可自己修改安装位置）在您的机器上安装需要一段时间。



---

## 3、安装cudnn

然后，安装cudnn

[cudnn下载网址](https://developer.nvidia.com/cudnn)


![image.png](https://s2.loli.net/2024/03/22/gz8BkdhXDqVsne4.png)

根据需要的版本进行安装，我这儿安装cudnn8.1，所以需要找到之前的版本

![image.png](https://s2.loli.net/2024/03/22/h4VFmWgKuZzOUna.png)

**Archive of Previous Releases** 查看安装之前的版本

![image.png](https://s2.loli.net/2024/03/22/XbpMi36ZUQE4Baz.png)


现在，检查 CUDA 和 cuDNN 的版本，然后单击下载您的操作系统。如果您找不到所需的版本，请单击 cuDNN Archive 并从那里下载。选择合适的平台下载，我这就选**for windows10**：

![image.png](https://s2.loli.net/2024/03/22/za6Ughk47TqScib.png)



下载完成后，解压缩文件。

![image.png](https://s2.loli.net/2024/03/23/KnTBMVqYixfwlpF.png)

复制这3个文件夹(**bin，include，lib**)。转到 C 盘 > Program Files，搜索 NVIDIA GPU Computing Toolkit。

![image.png](https://s2.loli.net/2024/03/22/a1cAGrMSNIX8vph.png)

复制到NVIDIA GPU Computing Toolkit的路径下：

![image.png](https://s2.loli.net/2024/03/22/2pH9uD1LUKnByac.png)


现在点击 bin 文件夹并复制路径，它应该像这样: **C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.2\bin**

## 4、配置cudnn环境

好了，现在就是最重要的一步，在你安装好cuda并且将cudnn复制替换到对应的文件夹后，需要告诉windows系统你的cudnn安装路径在哪。

打开此电脑 - 属性 - 高级系统设置 - 环境变量 - 系统变量 ， 新建一个变量名称为CUDNN ,变量值为以下文件夹所在的路径

- cuda
- lib
- include
- bin

![image.png](https://s2.loli.net/2024/03/23/26DTIhtgfCdFYRe.png)


就上面这样

```
C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.2;
C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.2\bin;
C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.2\include;
C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.2\lib;

```



注意: 确保将这些路径同时添加到 CUDNN 和 Path System 变量。

就是这样。我们已经成功地在我们的 Windows 系统上设置了 CUDA 和 cuDNN。



### ps notes
当然， 如果感觉不保险，我们可以在用户变量里面再添加一个Path (如果你害怕没有设置好的话)。

环境变量 - 用户变量 - Path

然后在

![image.png](https://s2.loli.net/2024/03/23/PZvVxju38M15gHJ.png)

就是这上的Path ，双击点开它，然后：新建 - 浏览 - 切换到你安装的C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.2\下面，进行添加，(或直接复制到里面)；然后依次将

- lib
- include
- cuda
- bin

的文件同样添加进来，添加完后大概就是这样：

![image.png](https://s2.loli.net/2024/03/23/BjQht8W9YpaAzNx.png)

虽然我感觉没必要这么干

## 5、检查cuda环境

如何检查你的cuda 和 cudnn 是否完成安装呢？

win + r 快捷键调出窗口输入cmd

![image.png](https://s2.loli.net/2024/03/23/7NHJpmTgyqAMIsB.png)

然后在命令行输入 `nvcc -- version` 

![image.png](https://s2.loli.net/2024/03/23/z6rdtS4kHGP9sNE.png)

如果CUDA已正确安装，则应该看到CUDA版本信息。如果未安装CUDA，您将收到相应的错误消息。


---

## 6、安装tensorflow-gpu

然后，我们需要查看tensorflow-gpu支持的cuda版本和python版本，网址在这：

[tensorflow-gpu support version](https://tensorflow.google.cn/install/source_windows?hl=en#gpu)



查表可得，当前最高支持的版本是cuda 11.2 和 cudnn 8.1

![image.png](https://s2.loli.net/2024/03/23/QKgBSkrqsuWoxij.png)

然后我们打开 Anaconda Prompt ， 建立一个新的tensorflow-gpu环境

```bash
conda create --name tf2.10 python==3.8
conda activate tf2.10 
```

如所示

![image.png](https://s2.loli.net/2024/03/23/MjqRcoa3J9GTQX5.png)


安装tensorflow-gpu版本，这里注意需要带上对应的版本号，不带上可能会导致安装的库无法正常使用！（血坑。。）

```bash
pip install tensorflow==2.10.0
```

![image.png](https://s2.loli.net/2024/03/23/4F2OlEt5hXcw8kf.png)

大概时间在几分钟内就可以安装完成，和网速有关


## 7、测试tensorflow-gpu安装是否成功，cuda环境是否成功

测试安装是否成功，一样是在命令行输入

输入 python

输入 from tensorflow.python.client import device_lib

输入 print(device_lib.list_local_devices())

![image.png](https://s2.loli.net/2024/03/23/wCi7Z28mbnRWT31.png)

``` python

python

from tensorflow.python.client import device_lib

print(device_lib.list_local_devices())

import tensorflow as tf
```
此时会看到是否有列出GPU的信息，若表示安裝成功



## 8、在vscode中.ipynb文件下运行tensorflow

发现，在vscode中除了必备的jupyter、conda等插件外，需要额外安装一个库，否则会报以下问题：

![image.png](https://s2.loli.net/2024/03/23/OkpQFaJ1sW4Sfbh.png)


虽然可以直接点击安装，但是我推荐直接在anaconda prompt里进行安装。！注意：环境要切换到你刚刚装好的tf2.10里面！

(因为我直接点击弹窗里面的安装还是没装上....)

``` python
conda install  ipykernel 
```

---
![image.png](https://s2.loli.net/2024/03/23/TuaJ9IbzKOdhyM2.png)



然后，再返回到vscode里面就可以正常导入库了：

![image.png](https://s2.loli.net/2024/03/23/8PBQHYjlz9bn6dk.png)

---






查看cuda 支持的系统和对应的版本：

> https://docs.nvidia.com/cuda/cuda-toolkit-release-notes/index.html

查看tensorflow支持的python版本：

> https://tensorflow.google.cn/install/source_windows?hl=en#gpu


安装参考：

> https://hackmd.io/@jerrychu/S1QvFG98h#%E5%85%88%E8%A9%A6%E8%91%97%E5%AE%89%E8%A3%9DCuda-118%E8%A9%A6%E8%A9%A6
> https://neptune.ai/blog/installing-tensorflow-2-gpu-guide
> https://medium.com/geekculture/install-cuda-and-cudnn-on-windows-linux-52d1501a8805