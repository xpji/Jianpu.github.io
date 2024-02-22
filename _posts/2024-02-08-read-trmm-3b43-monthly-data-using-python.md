---
layout: post
title: "read TRMM-3B43 monthly data using python"
author: Jianpu
categories: Python
tags: [tools,code]
image: python.jpg
date: 2024-02-08 22:05
comments: true
---

# python--读取TRMM-3B43月平均降水

绘制气候态空间分布图（陆地区域做掩膜）


![image.png](https://s2.loli.net/2024/02/22/K8ZmVMhyO9wISpn.png)


## TRMM降水数据介绍

热带降雨测量任务`(The Tropical Rainfall Measuring Mission，TRMM)`是美国国家航空航天局(`NASA`)和日本国家太空发展署(`National Space Development Agency`)的一项联合太空任务，旨在`监测和研究热带和亚热带降雨及其相关的能量释放`。该任务使用5种仪器: 降水雷达(Precipitation Radar，PR)、 TRMM 微波成像仪(TRMM Microwave Imager，TMI)、可见红外扫描仪(Visible Infrared Scanner，VIRS)、云与地球辐射能量系统(Clouds & Earths Radiant Energy System，CERES)和闪电成像传感器(Lightning Imaging Sensor，LSI)。TMI 和 PR 是用于降水的主要仪器。这些仪器被用于形成 TRMM 多卫星降水分析(TRMM Multi-satellite Precipitation Analysis，TMPA)的 TRMM 组合仪器(TRMM Combined Instrument ，TCI)校准数据集(TRMM 2B31)的算法中，其 `TMPA 3B43月平均降水量`和 `TMPA 3B42日平均和次日(3小时)平均`是最相关的 TRMM 相关气候研究的产品。`3B42和3B43`的空间分辨率为0.25 ° ，1998年至今覆盖北纬50 ° 至南纬50 ° 。

-------

**本文中用到的数据主要为TRMM-3B43月平均产品，用于绘制降水的气候态空间分布图**

TRMM-3B43产品如下所示：

- 空间分辨率：0.25°
- 时间覆盖范围：1999.01 - 2020.01
- 经纬度范围： 经度：0-360°，纬度：-50°S-50°N
- 单位为：mm/hour
- 降水类型 ： 累计降水

这里使用的python系统环境：**linux系统**，因为windows上好多库都不好用

![image.png](https://s2.loli.net/2024/02/22/BJvqucPa7tRehCm.png)



![image.png](https://s2.loli.net/2024/02/22/kvif41UxAmr8MIB.png)

[官网数据下载链接](https://disc.gsfc.nasa.gov/datasets/TRMM_3B43_7/summary)

## 数据处理

- 这里所使用的3B43降水资料数据为`.HDF`格式，因此需要使用`pyhdf`这个库来读取，不习惯的可以下载`netcdf`的数据格式
- 由于数据中缺少经纬度信息（也可能是我没有找到），为了实现区域切片，这里手动造了一个dataarray的数据，从而实现切片的过程
- 数据中读取的变量为`precipitation`，读取完之后是个二维的数组，为了给他加上时间纬度，所以手动给他进行了扩维，之后实现多年的气候态平均计算
- 使用`global_land_mask`实现对于陆地区域的掩膜处理
- 使用`cnmaps` 实现中国的区域绘制，这里的cnmaps的库在windows上可能不好安装，也直接使用cartopy`ax.coastlines('50m')`自带的海岸线
- 将原始数据单位转化为 mm/year，这里只是简单的转换`*24*365`

## 代码实现

1、首先读取10年的数据路径

```python
import xarray as xr
import os,glob
import numpy as np
from pyhdf.SD import SD
path = '/Datadisk/TRMM/3B43/'
file_list = []
for year in range(2009,2019):
    folder = os.path.join(path, str(year))
    file_name = glob.glob(folder+'/3B43.'+str(year)+'*.HDF')
    file_name.sort()
    file_list.extend(file_name) 
file_list.sort()

```


2、封装数据读取函数，并对需要的区域进行切片，我选择的区域为经度：[90.0, 145]，纬度：[-10, 55]，并将循环读取的10年月平均数组创建为dataarray的格式方面后续掩膜，这里的时间可以通过pandas自己创建时间序列，我这里偷懒直接读取了之前处理过的月平均gpcp的time了

```python
dt = xr.open_dataset("/gpcp_monthly_mask.nc")
precip = dt.sel(time=slice('2009','2018'),lat =slice(-10,55),lon = slice(90,145)).precip
time_num = precip.time.values
def get_data(path,time):
    da = SD(path)
    pre = da.select('precipitation')[:]
    pre = np.expand_dims(pre,axis=0)
    lon = np.arange(-180,180.,0.25)
    lat = np.arange(-50,50.,0.25)
    time = time
#   time = datetime.datetime.utcfromtimestamp(tim).strftime('%Y-%m-%d %H:%M:%S')
    da = xr.DataArray(pre, 
                          dims=['time','lon','lat'],
                          coords=dict(
                              lon=(['lon'], lon),
                              lat=(['lat'], lat),
                              time=(['time'],[time])),
                              )
    ##############################################################################
    lon_range = [90.0, 145]
    lat_range = [-10, 55]
    da = da.sel(lon=slice(*lon_range), lat=slice(*lat_range))
    x ,y = da.lon,da.lat   
    return da,x,y
rain = np.zeros((len(file_list),221,240))            
for i in range(len(file_list)):
    print(i)
    da,x,y =  get_data(file_list[i], time_num[i])
    rain[i] = da
ds = xr.DataArray(rain, 
                      dims=['time','lon','lat'],
                      coords=dict(
                          lon=(['lon'], x.data),
                          lat=(['lat'], y.data),
                          time=(['time'],time_num)),
                          )
```

3、对数据的陆地部分进行掩膜，并计算气候态平均，转换单位为`mm/year`

```python
from global_land_mask import globe
def mask_land(ds, label='land', lonname='lon'):
    if lonname == 'lon':
        lat = ds.lat.data
        lon = ds.lon.data
        if np.any(lon > 180):
            lon = lon - 180
            lons, lats = np.meshgrid(lon, lat)
            mask = globe.is_ocean(lats, lons)
            temp = []
            temp = mask[:, 0:(len(lon) // 2)].copy()
            mask[:, 0:(len(lon) // 2)] = mask[:, (len(lon) // 2):]
            mask[:, (len(lon) // 2):] = temp
        else:
            lons, lats = np.meshgrid(lon, lat)# Make a grid
            mask = globe.is_ocean(lats, lons)# Get whether the points are on ocean.
        ds.coords['mask'] = (('lat', 'lon'), mask)
    elif lonname == 'longitude':
        lat = ds.latitude.data
        lon = ds.longitude.data
        if np.any(lon > 180):
            lon = lon - 180
            lons, lats = np.meshgrid(lon, lat)
            mask = globe.is_ocean(lats, lons)
            temp = []
            temp = mask[:, 0:(len(lon) // 2)].copy()
            mask[:, 0:(len(lon) // 2)] = mask[:, (len(lon) // 2):]
            mask[:, (len(lon) // 2):] = temp
        else:
            lons, lats = np.meshgrid(lon, lat)
            mask = globe.is_ocean(lats, lons)
        lons, lats = np.meshgrid(lon, lat)
        mask = globe.is_ocean(lats, lons)
        ds.coords['mask'] = (('latitude', 'longitude'), mask)
    if label == 'land':
        ds = ds.where(ds.mask == True)
    elif label == 'ocean':
        ds = ds.where(ds.mask == False)
    return ds
data =  mask_land(ds,'land')
precip_mean = np.nanmean(data,axis=0)*24*365
```

4、绘图，保存图片

```python
import cartopy.feature as cfeature
from cartopy.mpl.ticker import LongitudeFormatter,LatitudeFormatter
import cmaps
import matplotlib.pyplot as plt
import cartopy.crs as ccrs
import matplotlib.ticker as mticker
from cartopy.mpl.gridliner import LONGITUDE_FORMATTER, LATITUDE_FORMATTER
from cnmaps import get_adm_maps, draw_maps
box = [100,140,0,50]
xstep,ystep = 10,10
proj = ccrs.PlateCarree(central_longitude=180)
plt.rcParams['font.family'] = 'Times New Roman',
fig = plt.figure(figsize=(8,7),dpi=200)
fig.tight_layout()
ax = fig.add_axes([0.1,0.2,0.8,0.7],projection = proj)
ax.set_extent(box,crs=ccrs.PlateCarree())
draw_maps(get_adm_maps(level='国')) #这里如果库不好安装的话可以使用下面注释的代码，cartopy自带的海岸线
# ax.coastlines('50m')
ax.set_xticks(np.arange(box[0],box[1]+xstep, xstep),crs=ccrs.PlateCarree())
ax.set_yticks(np.arange(box[2], box[3]+1, ystep),crs=ccrs.PlateCarree())
lon_formatter = LongitudeFormatter(zero_direction_label=False)#True/False
lat_formatter = LatitudeFormatter()
ax.xaxis.set_major_formatter(lon_formatter)
ax.yaxis.set_major_formatter(lat_formatter)
ax.set_title('TRMM(mm/year)',fontsize=16,pad=8,loc='left')
ax.tick_params(    which='both',direction='in',
                width=0.7,
                    pad=8, 
                    labelsize=14,
                    bottom=True, left=True, right=True, top=True)

c = ax.contourf(x,y,precip_mean.T,
                levels=np.arange(200,3300,100),
                extend='both',
        transform=ccrs.PlateCarree(),
          cmap=cmaps.NCV_jet)
cb=plt.colorbar(c,
                shrink=0.98,
                orientation='vertical',
                aspect=28,
                )
cb.ax.tick_params(labelsize=10,which='both',direction='in',)
plt.show()
fig.savefig('./TRMM_10year_monthly.png',dpi=500)


```

## 全部代码

```python
# -*- coding: utf-8 -*-
"""
@author: %(jixianpu)s

Email : 211311040008@hhu.edu.cn

introduction : keep learning althongh walk slowly
"""
import xarray as xr
import os,glob
import numpy as np
from pyhdf.SD import SD
path = '/Datadisk/TRMM/3B43/'
file_list = []
for year in range(2009,2019):
    
    folder = os.path.join(path, str(year))
    
    file_name = glob.glob(folder+'/3B43.'+str(year)+'*.HDF')
    file_name.sort()
    file_list.extend(file_name)
    
file_list.sort()
dt = xr.open_dataset("/gpcp_monthly_mask.nc")
precip = dt.sel(time=slice('2009','2018'),lat =slice(-10,55),lon = slice(90,145)).precip
time_num = precip.time.values

def get_data(path,time):
    da = SD(path)
    pre = da.select('precipitation')[:]
    pre = np.expand_dims(pre,axis=0)
    lon = np.arange(-180,180.,0.25)
    lat = np.arange(-50,50.,0.25)
    time = time
#   time = datetime.datetime.utcfromtimestamp(tim).strftime('%Y-%m-%d %H:%M:%S')
    da = xr.DataArray(pre, 
                          dims=['time','lon','lat'],
                          coords=dict(
                              lon=(['lon'], lon),
                              lat=(['lat'], lat),
                              time=(['time'],[time])),
                              )
##############################################################################
    lon_range = [90.0, 145]
    lat_range = [-10, 55]
    da = da.sel(lon=slice(*lon_range), lat=slice(*lat_range))
    x ,y = da.lon,da.lat    
    return da,x,y

rain = np.zeros((len(file_list),221,240))          
for i in range(len(file_list)):
    print(i)
    da,x,y =  get_data(file_list[i], time_num[i])
    rain[i] = da
ds = xr.DataArray(rain, 
                      dims=['time','lon','lat'],
                      coords=dict(
                          lon=(['lon'], x.data),
                          lat=(['lat'], y.data),
                          time=(['time'],time_num)),
                          )
from global_land_mask import globe
def mask_land(ds, label='land', lonname='lon'):
    if lonname == 'lon':
        lat = ds.lat.data
        lon = ds.lon.data
        if np.any(lon > 180):
            lon = lon - 180
            lons, lats = np.meshgrid(lon, lat)
            mask = globe.is_ocean(lats, lons)
            temp = []
            temp = mask[:, 0:(len(lon) // 2)].copy()
            mask[:, 0:(len(lon) // 2)] = mask[:, (len(lon) // 2):]
            mask[:, (len(lon) // 2):] = temp
        else:
            lons, lats = np.meshgrid(lon, lat)# Make a grid
            mask = globe.is_ocean(lats, lons)# Get whether the points are on ocean.
        ds.coords['mask'] = (('lat', 'lon'), mask)
    elif lonname == 'longitude':
        lat = ds.latitude.data
        lon = ds.longitude.data
        if np.any(lon > 180):
            lon = lon - 180
            lons, lats = np.meshgrid(lon, lat)
            mask = globe.is_ocean(lats, lons)
            temp = []
            temp = mask[:, 0:(len(lon) // 2)].copy()
            mask[:, 0:(len(lon) // 2)] = mask[:, (len(lon) // 2):]
            mask[:, (len(lon) // 2):] = temp
        else:
            lons, lats = np.meshgrid(lon, lat)
            mask = globe.is_ocean(lats, lons)
        lons, lats = np.meshgrid(lon, lat)
        mask = globe.is_ocean(lats, lons)
        ds.coords['mask'] = (('latitude', 'longitude'), mask)
    if label == 'land':
        ds = ds.where(ds.mask == True)
    elif label == 'ocean':
        ds = ds.where(ds.mask == False)
    return ds
data =  mask_land(ds,'land')
precip_mean = np.nanmean(data,axis=0)*24*365
import cartopy.feature as cfeature
from cartopy.mpl.ticker import LongitudeFormatter,LatitudeFormatter
import cmaps
import matplotlib.pyplot as plt
import cartopy.crs as ccrs
import matplotlib.ticker as mticker
from cartopy.mpl.gridliner import LONGITUDE_FORMATTER, LATITUDE_FORMATTER
from cnmaps import get_adm_maps, draw_maps
box = [100,140,0,50]
xstep,ystep = 10,10
proj = ccrs.PlateCarree(central_longitude=180)
plt.rcParams['font.family'] = 'Times New Roman',
fig = plt.figure(figsize=(8,7),dpi=200)
fig.tight_layout()
ax = fig.add_axes([0.1,0.2,0.8,0.7],projection = proj)
ax.set_extent(box,crs=ccrs.PlateCarree())
draw_maps(get_adm_maps(level='国'))
# ax.coastlines('50m')
ax.set_xticks(np.arange(box[0],box[1]+xstep, xstep),crs=ccrs.PlateCarree())
ax.set_yticks(np.arange(box[2], box[3]+1, ystep),crs=ccrs.PlateCarree())
lon_formatter = LongitudeFormatter(zero_direction_label=False)#True/False
lat_formatter = LatitudeFormatter()
ax.xaxis.set_major_formatter(lon_formatter)
ax.yaxis.set_major_formatter(lat_formatter)
ax.set_title('TRMM(mm/year)',fontsize=16,pad=8,loc='left')
ax.tick_params(    which='both',direction='in',
                width=0.7,
                    pad=8, 
                    labelsize=14,
                    bottom=True, left=True, right=True, top=True)

c = ax.contourf(x,y,precip_mean.T,
                levels=np.arange(200,3300,100),
                extend='both',
        transform=ccrs.PlateCarree(),
          cmap=cmaps.NCV_jet)
cb=plt.colorbar(c,
                shrink=0.98,
                orientation='vertical',
                aspect=28,
                )
cb.ax.tick_params(labelsize=10,which='both',direction='in',)
plt.show()
fig.savefig('./TRMM_10year_monthly.png',dpi=500)
```


## 引用参考


> TRMM: Tropical Rainfall Measuring Mission
https://climatedataguide.ucar.edu/climate-data/trmm-tropical-rainfall-measuring-mission

![image.png](https://s2.loli.net/2024/02/22/2toJhiIVTpcUdg9.png)

> Monthly 0.25° x 0.25° TRMM multi-satellite and Other Sources Rainfall (3B43)
http://apdrc.soest.hawaii.edu/datadoc/trmm_3b43.php  

![image.png](https://s2.loli.net/2024/02/22/8YabzxEJtjZOGoN.png)

> TRMM 3B43: Monthly Precipitation Estimates
https://developers.google.com/earth-engine/datasets/catalog/TRMM_3B43V7

![image.png](https://s2.loli.net/2024/02/22/9pKPgYRyB3QNOko.png)



> 中巴经济走廊TRMM_3B43月降水数据（1998-2017年）：http://www.ncdc.ac.cn/portal/metadata/4b9504fa-0e34-47c9-a755-91d3f3253312

![image.png](https://s2.loli.net/2024/02/22/TuWKJbH3EaGQOiP.png)

> TRMM (TMPA/3B43) Rainfall Estimate L3 1 month 0.25 degree x 0.25 degree V7 (TRMM_3B43)（GES 官网介绍）：https://disc.gsfc.nasa.gov/datasets/TRMM_3B43_7/summary

![image.png](https://s2.loli.net/2024/02/22/duLIh7Pv5EfTwWN.png)

> 国家海洋遥感在线分析平台 https://www.satco2.com/index.php?m=content&c=index&a=show&catid=317&id=217


![image.png](https://s2.loli.net/2024/02/22/3JyPX2fIDShB1KF.png)