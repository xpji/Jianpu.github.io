---
layout: post
title: "python station interp"
author: Jianpu
categories: python
tags: [data process]
image: 25.jpg
date: 2024-01-31 17:32
comments: true
---
# 前言

使用python对站点数据进行插值

- 读取站点资料数据
- 对站点数据进行插值，插值到规则网格上
- 绘制EOF第一模态和第二模态的空间分布图
- 绘制PC序列

关于插值，这里主要提供了两个插值函数，一个是一般常用的规则网格插值:

- `griddata()`

另一个是metpy中的:

- `inverse_distance_to_grid()`

本来只是测验一下不同插值方法，但是发现两种插值方法的结果差别很大，由于对于站点数据处理较少，所以不太清楚具体原因。如果有知道的朋友可以告知一下，不甚感谢！

本次数据存储的文件格式为`.txt`，读取的方法是通过`pandas.read_csv()`

同时，之前一直尝试使用proplot进行绘图，较长时间不用matplotlib.pyplot绘图了，也当做是复习一下绘图过程。

绘图中的代码主要通过封装函数，这样做的好处是大大减少了代码量。

## 导入必要的库：

```python
from eofs.standard import Eof
import matplotlib.pyplot as plt
import numpy as np
from scipy.interpolate import griddata
import pandas as pd
import matplotlib.pyplot as plt
import cartopy.crs as ccrs
import cartopy.feature as cfeature
from cartopy.mpl.ticker import LongitudeFormatter, LatitudeFormatter
from metpy.interpolate import inverse_distance_to_grid
```

出现找不到库的报错，这里使用`conda install packagename` 安装一下就好

## 读取存储的数据：

```python
##################### read station  data   ##########################################
path = r'D:/data.txt'
file = pd.read_csv(path,sep= "\t",
                   header=None,
                   names=['station','lat','lon','year','data'],
                   na_values=-99.90)
data = file['data'].to_numpy()
lon  = file['lon'].to_numpy()
lat  = file['lat'].to_numpy()
year = file['year'].to_numpy()
station = file['station'].to_numpy()
year_max = np.max(year)
year_min = np.min(year)
year_range = np.arange(year_min,year_max+1,1)
data_all = data.reshape(70,53)
lon_all = lon.reshape(70,53)/100
lat_all = lat.reshape(70,53)/100   
lon_real = lon_all[:,0]
lat_real = lat_all[:,0]
```

这里将读取的数据全部转为`array`格式，方便查看以及后续处理。本来存储的文件中是没有相关的经度、纬度、站点、时间的名称的，这里我是自己加在上面方面数据读取的。
本次处理的数据包含`70个站点，53年`

## 插值

```python
#####################   interp data   ##########################################
### interp data to target grid
### set target grid
lon_target = np.arange(115,135.5,0.5)
lat_target = np.arange(38,55.5,0.5)
x_t, y_t = np.meshgrid(lon_target, lat_target)
z = np.zeros((len(year_range),lat_target.shape[0],lon_target.shape[0]))
for i in range(len(year_range)):
    print(i)
    # z[i] = inverse_distance_to_grid(lon_real,lat_real,
    #                                 data_all[:,i],
    #                                 x_t,y_t, r=15, min_neighbors=3)
    z[i] = griddata((lon_real,lat_real),
                                    data_all[:,i],
                                    (x_t,y_t),method='cubic')
```

这里显示了使用`griddata()`的插值过程，metpy的过程注释掉了，需要测试的同学之间取消注释即可。
注意点：插值过程需要先设置目标的插值网格。

## EOF处理：

```python
#计算纬度权重
lat_new = np.array(lat_target)
coslat=np.cos(np.deg2rad(lat_new))
wgts = np.sqrt(coslat)[..., np.newaxis]
#创建EOF分解器
solver=Eof(z,weights=wgts)
eof=solver.eofsAsCorrelation(neofs=2)
#此处的neofs的值是我们需要的空间模态数
pc=solver.pcs(npcs=2,pcscaling=1)#方差
var=solver.varianceFraction(neigs=2)
```

这里没啥好说的，需要几个模态自由选择即可

## 定义绘图函数并绘图：

```python
##################### def  plot function ##########################################
def contourf(ax,i,level,cmap):
    extents = [115,135,35,55]
    ax.set_extent(extents, crs=proj)
    ax.add_feature(cfeature.LAND, edgecolor='black',facecolor='silver',
                    )
    ax.add_feature(cfeature.LAKES, edgecolor='black',facecolor='w',
                    )
    ax.add_feature(cfeature.BORDERS)
    xtick = np.arange(extents[0], extents[1], 5)
    ytick = np.arange(extents[2], extents[3], 5)
    ax.coastlines()
    tick_proj = ccrs.PlateCarree()
    c = ax.contourf(lon_target,lat_target,eof[i], 
                    transform=ccrs.PlateCarree(),
                    levels=level,
                    extend='both',
                    cmap=cmap)
    ax.set_xticks(xtick, crs=tick_proj)
    ax.set_xticks(xtick,  crs=tick_proj)
    ax.set_yticks(ytick, crs=tick_proj)
    ax.set_yticks(ytick, crs=tick_proj)
    ax.xaxis.set_major_formatter(LongitudeFormatter())
    ax.yaxis.set_major_formatter(LatitudeFormatter())
    plt.yticks(fontproperties='Times New Roman',size=10)
    plt.xticks(fontproperties='Times New Roman',size=10)
    ax.tick_params(which='major', direction='out', 
                    length=4, width=0.5, 
                 pad=5, bottom=True, left=True, right=True, top=True)
    ax.tick_params(which='minor', direction='out', 
                    
                  bottom=True, left=True, right=True, top=True)
    ax.set_title( 'EOF'+str(i),loc='left',fontsize =15)
    
    return c

def p_line(ax,i):
    
    ax.set_title('pc'+str(i)+'',loc='left',fontsize = 15)
    # ax.set_ylim(-3.5,3.5)
    ax.axhline(0,linestyle="--")
    ax.plot(year_range,pc[:,i],color='blue')
    ax.set_ylim(-3,3)
    
#####################  plot ##########################################
fig = plt.figure(figsize=(8, 6), dpi=200) 
proj = ccrs.PlateCarree()
contourf_1 = fig.add_axes([0.02,0.63,0.5,0.3],projection=proj)

c1=contourf(contourf_1,0,np.arange(0.7,1,0.05),plt.cm.bwr)

plot_1 = fig.add_axes([0.45,0.63,0.5,0.3])
p_line(plot_1,0)

contourf_2 = fig.add_axes([0.02,0.15,0.5,0.3],projection=proj)

c2= contourf(contourf_2,1,np.arange(-0.5,0.6,0.1),plt.cm.bwr)

plot_2 = fig.add_axes([0.45,0.15,0.5,0.3],)
p_line(plot_2,1)

cbposition1 = fig.add_axes([0.16, 0.55, 0.22, 0.02])
cb = fig.colorbar(c1,cax=cbposition1,
             orientation='horizontal',format='%.1f')
cb.ax.tick_params(which='both',direction='in')
cbposition2=fig.add_axes([0.16, 0.08, 0.22, 0.02])
cb2 = fig.colorbar(c2,cax=cbposition2,
             orientation='horizontal',format='%.1f')
cb2.ax.tick_params(which='both',direction='in')
plt.show()
```

这里将大部分重复的绘图代码，进行了封装，通过封装好的函数进行调用，大大简洁了代码量。相关的封装过程之前也有讲过，可以翻看之前的记录。

## 展示结果

使用`griddata`的绘图结果：

![image.png](https://s2.loli.net/2024/01/27/xYZKum8aFWqJdgw.png)

使用`metpt插值函数`的结果：

![image.png](https://s2.loli.net/2024/01/27/OrWAzdTRLtHwbgo.png)

## 附上全部的绘图代码：

```python
# -*- coding: utf-8 -*-
"""
Created on Fri Sep 23 17:46:42 2022

@author: Administrator
"""
from eofs.standard import Eof
import matplotlib.pyplot as plt
import numpy as np
from scipy.interpolate import griddata
import pandas as pd
import matplotlib.pyplot as plt
import cartopy.crs as ccrs
import cartopy.feature as cfeature
from cartopy.mpl.ticker import LongitudeFormatter, LatitudeFormatter
from metpy.interpolate import inverse_distance_to_grid

##################### read station  data   ##########################################
path = r'D:/data.txt'
file = pd.read_csv(path,sep= "\t",
                   header=None,
                   names=['station','lat','lon','year','data'],
                   na_values=-99.90)
data = file['data'].to_numpy()
lon  = file['lon'].to_numpy()
lat  = file['lat'].to_numpy()
year = file['year'].to_numpy()
station = file['station'].to_numpy()
year_max = np.max(year)
year_min = np.min(year)
year_range = np.arange(year_min,year_max+1,1)
data_all = data.reshape(70,53)
lon_all = lon.reshape(70,53)/100
lat_all = lat.reshape(70,53)/100   
lon_real = lon_all[:,0]
lat_real = lat_all[:,0]


#####################   interp data   ##########################################
### interp data to target grid
### set target grid
lon_target = np.arange(115,135.5,0.5)
lat_target = np.arange(38,55.5,0.5)
x_t, y_t = np.meshgrid(lon_target, lat_target)
z = np.zeros((len(year_range),lat_target.shape[0],lon_target.shape[0]))
for i in range(len(year_range)):
    print(i)
    # z[i] = inverse_distance_to_grid(lon_real,lat_real,
    #                                 data_all[:,i],
    #                                 x_t,y_t, r=15, min_neighbors=3)
    z[i] = griddata((lon_real,lat_real),
                                    data_all[:,i],
                                    (x_t,y_t),method='cubic')

#计算纬度权重
lat_new = np.array(lat_target)
coslat=np.cos(np.deg2rad(lat_new))
wgts = np.sqrt(coslat)[..., np.newaxis]
#创建EOF分解器
solver=Eof(z,weights=wgts)
eof=solver.eofsAsCorrelation(neofs=2)
#此处的neofs的值是我们需要的空间模态数
pc=solver.pcs(npcs=2,pcscaling=1)#方差
var=solver.varianceFraction(neigs=2)
    
##################### def  plot function ##########################################
def contourf(ax,i,level,cmap):
    extents = [115,135,35,55]
    ax.set_extent(extents, crs=proj)
    ax.add_feature(cfeature.LAND, edgecolor='black',facecolor='silver',
                    )
    ax.add_feature(cfeature.LAKES, edgecolor='black',facecolor='w',
                    )
    ax.add_feature(cfeature.BORDERS)
    xtick = np.arange(extents[0], extents[1], 5)
    ytick = np.arange(extents[2], extents[3], 5)
    ax.coastlines()
    tick_proj = ccrs.PlateCarree()
    c = ax.contourf(lon_target,lat_target,eof[i], 
                    transform=ccrs.PlateCarree(),
                    levels=level,
                    extend='both',
                    cmap=cmap)
    ax.set_xticks(xtick, crs=tick_proj)
    ax.set_xticks(xtick,  crs=tick_proj)
    ax.set_yticks(ytick, crs=tick_proj)
    ax.set_yticks(ytick, crs=tick_proj)
    ax.xaxis.set_major_formatter(LongitudeFormatter())
    ax.yaxis.set_major_formatter(LatitudeFormatter())
    plt.yticks(fontproperties='Times New Roman',size=10)
    plt.xticks(fontproperties='Times New Roman',size=10)
    ax.tick_params(which='major', direction='out', 
                    length=4, width=0.5, 
                 pad=5, bottom=True, left=True, right=True, top=True)
    ax.tick_params(which='minor', direction='out', 
                    
                  bottom=True, left=True, right=True, top=True)
    ax.set_title( 'EOF'+str(i),loc='left',fontsize =15)
    
    return c

def p_line(ax,i):
    
    ax.set_title('pc'+str(i)+'',loc='left',fontsize = 15)
    # ax.set_ylim(-3.5,3.5)
    ax.axhline(0,linestyle="--")
    ax.plot(year_range,pc[:,i],color='blue')
    ax.set_ylim(-3,3)
    
#####################  plot ##########################################
fig = plt.figure(figsize=(8, 6), dpi=200) 
proj = ccrs.PlateCarree()
contourf_1 = fig.add_axes([0.02,0.63,0.5,0.3],projection=proj)

c1=contourf(contourf_1,0,np.arange(0.7,1,0.05),plt.cm.bwr)

plot_1 = fig.add_axes([0.45,0.63,0.5,0.3])
p_line(plot_1,0)

contourf_2 = fig.add_axes([0.02,0.15,0.5,0.3],projection=proj)

c2= contourf(contourf_2,1,np.arange(-0.5,0.6,0.1),plt.cm.bwr)

plot_2 = fig.add_axes([0.45,0.15,0.5,0.3],)
p_line(plot_2,1)

cbposition1 = fig.add_axes([0.16, 0.55, 0.22, 0.02])
cb = fig.colorbar(c1,cax=cbposition1,
             orientation='horizontal',format='%.1f')
cb.ax.tick_params(which='both',direction='in')
cbposition2=fig.add_axes([0.16, 0.08, 0.22, 0.02])
cb2 = fig.colorbar(c2,cax=cbposition2,
             orientation='horizontal',format='%.1f')
cb2.ax.tick_params(which='both',direction='in')
plt.show()
```

## 总结

`metpy的插值函数`好处在于可以自由填充整个绘图区域，但是感觉`griddata`函数的插值结果更加符合预期，虽然也有点怪怪的。
这两个插值函数造成的差异目前不太清楚，仅记录处理数据以及绘图的过程，有清楚原因的大佬记得在评论区补充一下！非常感谢啦！


需要数据的话可以发邮件给我：xianpuji@hhu.edu.cn