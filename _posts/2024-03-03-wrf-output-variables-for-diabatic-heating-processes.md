---
layout: post
title: "WRF - Output variables for diabatic heating processes"
author: Jianpu
categories: WRF
tags: [notes]
image: wrf.jpg
date: 2024-03-03 20:19
comments: true
---


# 引言：
- 如果想要研究非绝热加热过程对于涡旋生成发展传播过程中的影响，可以通过位涡（PV）方程来进行诊断。位涡方程相比于传统的EKE诊断方程的优势在于其不守恒性可以直接归因于非绝热加热过程（Hoskins et al., 1985）。
- 也就是说，PV方程中将非绝热加热这一项在方程单独分开，而不是像EKE方程那样将斜压项和非绝热加热项放在了同一个源项中，便于计算非绝热加热过程对于PV发展传播的贡献。
## 为什么要通过WRF输出非绝热加热项

一般的非绝热加热数据，需要通过WRF输出，原因如下两点：
- 	现有的再分析资料中对于非绝热加热数据的缺失；
- 	基于参数化计算的已有的非绝热加热资料不够准确 (Luo & Yanai, 1984)。


## Q:How do I estimate the heating profile?
Answer:
- You need to add up RTHCUTEN (from cumulus), RTHRATEN (from radiation), RTHBLTEN (from PBL parameterization), RTHNDGDTEN (if nudging is applied), and H_DIABATIC (from microphysics).
- 也就是说，你要将`RTHCUTEN (from cumulus), RTHRATEN (from radiation), RTHBLTEN (from PBL parameterization), RTHNDGDTEN (if nudging is applied), and H_DIABATIC`
在WRF中先输出，然后将这几个变量相加，得到的就是`总的非绝热加热率`

这里简单表达为：

$$
Q=Q_{\mathrm{microphysics}}+Q_{\mathrm{boundary _layer}}+Q_{\mathrm{radiation}}+Q_{\mathrm{cumulus}}
$$
分别表示由云微物理过程、边界层通量交换、辐射过程和积云对流过程产生的非绝热加热过程。

对于多层嵌套网格，如果两层的话，使用d02需要去掉积云对流参数化过程的那一项，只使用前三项






> 		[1] Luo, H., & Yanai, M. (1984). The Large-Scale Circulation and Heat Sources over the Tibetan Plateau and Surrounding Areas during the Early Summer of 1979. Part II: Heat and Moisture Budgets, Monthly Weather Review, 112(5), 966-989.
> 		[2] Hoskins, B. J., McIntyre, M., & Robertson, A. W. (1985). On the use and significance of isentropic potential vorticity maps. Quarterly Journal of the Royal Meteorological Society, 111(470), 877–946.
>
> 	https://forum.mmm.ucar.edu/threads/adding-diabatic-heating-rates-to-wrf-arw-real-outputs.5423/
> 	https://forum.mmm.ucar.edu/threads/latent-heating-from-cumulus-parameterization.8797/
> 	https://forum.mmm.ucar.edu/threads/microphysics-heating-tendency-and-relationship-with-cumulus-scheme.9738/#p19094