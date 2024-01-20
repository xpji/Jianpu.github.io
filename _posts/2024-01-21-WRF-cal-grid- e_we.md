---
layout: post
title:  "WRF calculate e_sn/e_we/ i_parent_start/ j_parent_start!"
author: "Jianpu"
date:   2024-01-22 13:38
categories: WRF
tags: [WRF]
image: 13.jpg
views: 0
comments: true


---


# How to calculate the number of grid points of nested grids in wrf mode, that is, **e_sn / e_we**

wrf模式中如何计算嵌套网格的格点数，即**e_sn / e_we**

嵌套层数为3层，随便找个区域，图中嵌套分辨率依次是`36km，12km，4km`：

![image.png](https://s2.loli.net/2024/01/20/7hNKyMxqpFvTugd.png)




计算公式如下：

```python
格点数=经纬度数(°)x111(km)÷分辨率(dx或dy [km])
```


其中，赤道上每相差1°对应的弧长大约是**111km**。所以假设第一层网格范围是：`30°W~30°E`和 `10°S~30°N`，那么得出的第一层为36km的x、y方向的网格点数为：`e_we=60°x111km➗36km=185`，`e_sn=40°x111km➗36km=124`这样左右。这里需要注意的是`e_we及e_sn需满足 （e_**-1）/嵌套比例=整数`  ，可以根据比例做适当调整。

![image.png](https://s2.loli.net/2024/01/20/FsAqVoawIJBzRlE.png)


而 **i_parent_start/ j_parent_start**计算方式类似，如下图所示，因为一般第一层默认为1，所以计算第二层嵌套的方法就是在计算在第一层区域内，左下角起始点的网格数。举个例子，假设i=j=10°，那么`i_parent_start/ j_parent_start=10°x111km÷36km=31`左右.

![image.png](https://s2.loli.net/2024/01/20/IfTevYmgkAcZqt3.png)




对于第三层的`e_sn/e_we/ i_parent_start/ j_parent_start`，就是把`分辨率换成对应的dx、dy的值`即可。也就是将36km换成12km以及4km。
举个例子，假设第二层经度范围为50°，则：
`e_we=50°x111km➗12km=462`

