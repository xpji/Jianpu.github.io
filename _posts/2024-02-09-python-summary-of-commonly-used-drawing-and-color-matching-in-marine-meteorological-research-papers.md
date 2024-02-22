---
layout: post
title: "python -- Summary of commonly used drawing and color matching in marine meteorological research papers"
author: Jianpu
categories: Python
tags: [tools,code]
image: python.jpg
date: 2024-02-09 22:21
comments: true
---

## [1、ColorBrewer 彩色地图，默认情况下包含在 matplotlib 中](https://colorbrewer2.org/#type=sequential&scheme=BuGn&n=3)

- 可以通过自定义选取不同颜色的rgb，通过自定义的方式构建colormap

![image.png](https://s2.loli.net/2024/02/22/JwImsLuDt3SHZhk.png)

## [2、proplot package 自带的色系](https://proplot.readthedocs.io/en/latest/colormaps.html#ug-perceptual)

需要安装这个库，和matplotlib.pyplot中的调用方式基本一致：

```python

conda install -c conda-forge proplot

```
![color.png](https://s2.loli.net/2024/02/22/kozfaTnbX23IB7Z.png)


## [3、Scientific colour maps](https://www.fabiocrameri.ch/colourmaps/)

使用方式在这里：

[使用教程](https://www.fabiocrameri.ch/colourmaps-userguide/)

**Install with pip:**

```python
pip install cmcrameri
```

**Install with conda:**

```python
conda config --add channels conda-forge
conda install cmcrameri
```

使用示例：
```python
from cmcrameri import cm
import matplotlib.pyplot as plt
import numpy as np
x = np.linspace(0, 100, 100)[None, :]
plt.imshow(x, aspect='auto', cmap=cm.batlow) # or any other colourmap
plt.axis('off')
plt.show()
```

![image.png](https://s2.loli.net/2024/02/22/A1RKpNS9lWG45EZ.png)

![image.png](https://s2.loli.net/2024/02/22/w5yZkBHfCipjPT2.png)

![image.png](https://s2.loli.net/2024/02/22/mnIVj7ofQSCpYva.png)


## [4、colorcet](https://colorcet.holoviz.org/)

- 安装：`conda install -c conda-forge colorcet`
- 调用示例：
- `cwr`为你所选取的`colormap`的缩写

```python
import colorcet as cc
ccmap = cc.cm.cwr
```

![color2.png](https://s2.loli.net/2024/02/22/wXt76J2d5Nm1raA.png)



## [5、NCL官网自带的colormap](https://www.ncl.ucar.edu/Document/Graphics/color_table_gallery.shtml)

- 可以通过下载**cmaps**这个库进行使用
- 安装：`conda install -c conda-forge cmaps`
- 调用示例：

`cosam`为你所选取的`colormap`的缩写

```python
import cmaps
ccmap = cmaps.cosam
```
![color3.png](https://s2.loli.net/2024/02/22/6K7pWSqeY4huOnX.png)
