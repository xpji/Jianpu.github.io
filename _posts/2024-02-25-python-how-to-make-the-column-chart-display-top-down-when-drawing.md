---
layout: post
title: "Python - How to make the column chart display top down when drawing"
author: Jianpu
categories: Python
tags: [code]
image: python.jpg
date: 2024-02-25 20:50
comments: true
---



![image.png](https://s2.loli.net/2024/03/04/zdCKtVGoTwl7ex6.png)

```python

# -*- coding: utf-8 -*-
"""
@author: Jianpu

@email: Xianpu_JI2024@outlook.com

introduction : keep learning althongh walk slowly
"""


import numpy as np
import matplotlib.ticker as mticker
import matplotlib.pyplot as plt
###########################################################################
plt.rcParams['font.sans-serif']=['SimHei']#中文 
plt.rcParams['axes.unicode_minus']=False  #显示负号
# ####################################data#################################
n=6
y  = np.linspace(10,70,n)
y1 = np.linspace(10,60,n)
y2 = np.linspace(10,50,n)
x=np.linspace(2000,2020,n)

data = np.array([y,y1,y2])
width = 0.6
# ####################################draw#################################
fig=plt.figure(figsize=(5,7),dpi=500)#添加画布等
ax=fig.add_axes([0,0,1,0.3])
ax.set(xlim=(2000,2021),ylim=(0,100)) 
bar1=ax.bar(x - width,data[0],
            # color=np.where(y>0,'r','b'), #判断大于0的为红色，负的为蓝色
            width=0.5,   #柱形宽度
            align='center', #柱形的位置edge/center 
            alpha=0.8,    #柱形透明度
            hatch='*',    #柱形表明的形状样式
            edgecolor='k',#柱形边缘颜色
            bottom=0.01   #柱形离底部的距离
          )
bar2=ax.bar(x + width,data[1],
            # color=np.where(y>0,'r','b'), #判断大于0的为红色，负的为蓝色
            width=0.5,   #柱形宽度
            align='center', #柱形的位置edge/center 
            alpha=0.8,    #柱形透明度
            hatch='*',    #柱形表明的形状样式
            edgecolor='k',#柱形边缘颜色
            bottom=0.01   #柱形离底部的距离
          )
bar3=ax.bar(x ,data[2],
            # color=np.where(y>0,'r','b'), #判断大于0的为红色，负的为蓝色
            width=0.5,   #柱形宽度
            align='center', #柱形的位置edge/center 
            alpha=0.8,    #柱形透明度
            hatch='*',    #柱形表明的形状样式
            edgecolor='k',#柱形边缘颜色
            bottom=0.01   #柱形离底部的距离
          )
##########################################################################
ax.set(xlim=(1999,2021),ylim=(0,100))   #设置x、y轴的最大最小范围
ax.set_xticks(np.linspace(2000, 2020, n)) #设置x轴显示的标签         #添加注释
ax.axhline(y=0,c='k',ls=':',lw=1)    #添加水平线，设置颜色，位置，水平线的style
#设置轴的参数，间隔
ax.tick_params(axis='both',which='both',direction='in')
ax.yaxis.set_minor_locator(mticker.MultipleLocator(5))
ax.xaxis.set_minor_locator(mticker.MultipleLocator(5))
# 设置label
ax.set_xlabel('年份 (Year)')
ax.set_ylabel('数值 (%) ')
ax.set_title('柱状图',fontsize=10)
  #添加图例
ax2 = ax.twinx()
ax2.invert_yaxis()
ax2.set(xlim=(1999,2021),ylim=(100)) 
ax2.set_yticklabels(['0','20','40','60','80','100'][::-1])
bar4 = ax2.bar(x,np.linspace(4,6,n),
        width=0.5,   #柱形宽度
        align='center', #柱形的位置edge/center 
        alpha=0.8,    #柱形透明度
        hatch='*',    #柱形表明的形状样式
        edgecolor='k',#柱形边缘颜色
        bottom=0.01  , #柱形离底部的距离
        color='r'
        )
ax2.yaxis.set_minor_locator(mticker.MultipleLocator(5))
ax2.tick_params(axis='both',tickdir='in')
ax2.tick_params(which='minor',tickdir='in')
ax.legend([bar1,bar2,bar3,bar4],['柱形1','柱形2','柱形3','柱形4'])
plt.show()
```