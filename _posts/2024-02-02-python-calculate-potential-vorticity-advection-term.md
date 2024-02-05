---
layout: post
title: "python calculate potential vorticity advection term"
author: Jianpu
categories: Python
tags: [data calculation]
image: 27.jpg
date: 2024-02-02 17:37
comments: true
---

# 使用python 计算位涡水平平流项

使用数据：**potential vorticity**、水平风场分量：U、V
数据来源： 

- ERA5 
- hourly ：一天四次
- 空间分辨率：0.5x0.5
- 时间范围：2004-06
  使用的函数：
- `metpy.calc.advection(scalar, u=None, v=None, w=None, *, dx=None, dy=None, dz=None, x_dim=- 1, y_dim=- 2, vertical_dim=- 3)`
- [metpy.calc.advection官方介绍](https://unidata.github.io/MetPy/latest/api/generated/metpy.calc.advection.html)
  与我之前的一个计算水汽散度的帖子的方法差不多：[使用metpy计算水汽散度](https://blog.csdn.net/weixin_44237337/article/details/122601116)

编程需要注意的点：

- **metpy.calc.advection()**中传入的变量应该是二维的**（lonxlat）**，而我们下载的位涡数据是四维的（`time x level x lat x lon`），所以需要做循环计算
- 使用metpy时需要给予各项附上响应的单位，防止计算的量纲出错
- `metpy.calc.advection()`中的`x_dim=- 1, y_dim=- 2`，分别对应了你的经度和纬度的维度，默认是经度为最后一维，纬度是倒数第二维
- 虽然`metpy.calc.advection()`提供了三个方向的计算，但是第三维的计算不太完善，因此本文以下只计算水平项
- 需要计算出dx、dy，也就是网格点的实际距离，这里metpy也给出了对应的函数：`mpcalc.lat_lon_grid_deltas`

代码如下：



```python
import xarray as xr
import numpy as np
from metpy.units import units
import metpy.constants as constants
import metpy.calc as mpcalc
#########################文件路径##################################################
path=r'D:\PV\download_pv_hourly.nc'

path1=r'D:\PV\uv_0.5x0.5_2004-06.nc'
#########################读取pv############################################################
f_pv = xr.open_dataset(path)
pv   = f_pv.pv.sel(time=slice('2004-06-23','2004-06-30')).sortby('latitude')
pv_units=pv.units

lev  = pv.level

pressure = np.array(lev).reshape((1,37,1,1))*units.hPa
dpdl= np.gradient( pressure,axis=1)
##########################读取水平风场#########################################################
f = xr.open_dataset(path1).sortby('latitude').sel(time=slice('2004-06-23','2004-06-30'))

f = f.transpose('time','level','latitude','longitude')
f_u = f.u
f_v = f.v


lat =  f_u.latitude
lon =  f_u.longitude
time = f_u.time

dx, dy = mpcalc.lat_lon_grid_deltas(lon, lat)

pvadv=np.zeros((32,37,361,720))

for i in range(32):
    
    for j in range(37):
        
        print(i,j)  
        pvadv[i,j,:,:] = mpcalc.advection(pv[i,j,:,:],u=f_u[i,j,:,:],v=f_v[i,j,:,:],dx=dx,dy=dy,x_dim=-1,y_dim=-2)


pvadv=pvadv*units['K m**2 kg**-1 s**-1']/units.s
##########################计算平流垂向#####################################
# vertical
p_v=pv*units['K m**2 kg**-1 s**-1']
dpvdl=np.gradient( p_v,axis=1)

pvvdv = f_w*(units.Pa/units.s)*(dpvdl/dpdl)
#########################保存数据#############################################################
pvadv_nc=xr.Dataset({'pvadv':(('time','level','lat','lon'),pvadv)},
                    
                    coords = {
                        'time':time,
                        'level':lev.data,
                        'lat':lat.data,
                        'lon':lon.data,
                        
                        }
                    )
pvadv_nc.attrs['long_name']='potential vorticity advection'
pvadv_nc.to_netcdf('pvadv.nc')
###########################保存数据##########################################################
pvvdv_nc=xr.Dataset({'pvadv':(('time','level','lat','lon'),pvvdv.data)},
                    
                    coords = {
                        'time':time,
                        'level':lev.data,
                        'lat':lat.data,
                        'lon':lon.data,
                        
                        }
                    )
pvvdv_nc.attrs['long_name']='potential vorticity vertical advection'
pvvdv_nc.to_netcdf(r'pvvdv.nc')

```


Tips：

- 一般的计算结果显示的量级为10的-5次方到10的-8次方

- 虽然ERA5提供了位涡的数据，但是还是自己根据位涡的定义重新计算以下对比验证，如研究中高纬区域可能存在一些问题

  ​			    				