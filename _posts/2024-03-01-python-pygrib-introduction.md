---
layout: post
title: "Python - pygrib introduction"
author: Jianpu
categories: Python
tags: [code]
image: python.jpg
date: 2024-03-01 20:10
comments: true
---


# 前言

`希望修改grib中的变量，用作WRF中WPS前处理的初始场`

## `python对grib文件处理的packages`

`python中`对于`grib`文件的处理方式主要有以下两种库：

- `1、pygrib`
- `2、xarray+cfgrib`

优缺点对比

|                 | `优点`                                                       | `缺点`                           |
| --------------- | ------------------------------------------------------------ | -------------------------------- |
| `pygrib`        | 读取文件速度快``                                             | `查看文件信息相对于cfgrib较麻烦` |
| `xarray+cfgrib` | `直接将grib文件解析为常见的dataset格式，对于文件的信息一目了然` | `难以处理大文件`                 |

## `package install`

### `pygrib安装`

```python
pip install pygrib
```

```python
conda install -c conda-forge pygrib
```

### `cfgrib安装`

```
conda install -c conda-forge cfgrib
```

```
pip install cfgrib
```

## `cfgrib使用`

```python
>>> import xarray as xr
>>> ds = xr.open_dataset('era5-levels-members.grib', engine='cfgrib')
>>> ds
<xarray.Dataset>
Dimensions:        (number: 10, time: 4, isobaricInhPa: 2, latitude: 61, longitude: 120)
Coordinates:
  * number         (number) int64 0 1 2 3 4 5 6 7 8 9
  * time           (time) datetime64[ns] 2017-01-01 ... 2017-01-02T12:00:00
    step           timedelta64[ns] ...
  * isobaricInhPa  (isobaricInhPa) float64 850.0 500.0
  * latitude       (latitude) float64 90.0 87.0 84.0 81.0 ... -84.0 -87.0 -90.0
  * longitude      (longitude) float64 0.0 3.0 6.0 9.0 ... 351.0 354.0 357.0
    valid_time     (time) datetime64[ns] ...
Data variables:
    z              (number, time, isobaricInhPa, latitude, longitude) float32 ...
    t              (number, time, isobaricInhPa, latitude, longitude) float32 ...
Attributes:
    GRIB_edition:            1
    GRIB_centre:             ecmf
    GRIB_centreDescription:  European Centre for Medium-Range Weather Forecasts
    GRIB_subCentre:          0
    Conventions:             CF-1.7
    institution:             European Centre for Medium-Range Weather Forecasts
    history:                 ...
```

`或者直接：`

```python
import cfgrib
ds = cfgrib.open_dataset('era5-levels-members.grib')
```

`其他命令：`

- `将多个grib文件的内容合并到单个数据集中：`

```
xarray.open_mfdataset
```

- `对于大内存的文件，需要搭配dask使用`

- `读取任意grib 的keys`

  ```python
  >>> ds = xr.open_dataset('era5-levels-members.grib', engine='cfgrib',
  ...                      backend_kwargs={'read_keys': ['experimentVersionNumber']})
  >>> ds.t.attrs['GRIB_experimentVersionNumber']
  '0001'
  ```

- `转换为自定义的数据类型：cf2cdm`
  
  - `将cfgrib样式的Dataset转换为经典的ECMWF坐标命名的形式`

```python
>>> import cf2cdm
>>> ds = xr.open_dataset('era5-levels-members.grib', engine='cfgrib')
>>> cf2cdm.translate_coords(ds, cf2cdm.ECMWF)
<xarray.Dataset>
Dimensions:     (number: 10, time: 4, level: 2, latitude: 61, longitude: 120)
Coordinates:
  * number      (number) int64 0 1 2 3 4 5 6 7 8 9
  * time        (time) datetime64[ns] 2017-01-01 ... 2017-01-02T12:00:00
    step        timedelta64[ns] ...
  * level       (level) float64 850.0 500.0
  * latitude    (latitude) float64 90.0 87.0 84.0 81.0 ... -84.0 -87.0 -90.0
  * longitude   (longitude) float64 0.0 3.0 6.0 9.0 ... 348.0 351.0 354.0 357.0
    valid_time  (time) datetime64[ns] ...
Data variables:
    z           (number, time, level, latitude, longitude) float32 ...
    t           (number, time, level, latitude, longitude) float32 ...
Attributes:
    GRIB_edition:            1
    GRIB_centre:             ecmf
    GRIB_centreDescription:  European Centre for Medium-Range Weather Forecasts
    GRIB_subCentre:          0
    Conventions:             CF-1.7
    institution:             European Centre for Medium-Range Weather Forecasts
    history:                 ...
```

- `输出为grib文件`

```python
cfgrib.to_grib(data_name,'data_name.grb',）
```

`对于cfgrib的介绍大致如上，如果是用于查看一些小文件的信息，做简单的数据处理，上述命令足以。但是，对于本次我的需求，上述方式无法实现。特别是在保存为新的grib文件时，总是报错。`



`下面主要介绍第二种方式，使用pygrib读取grib文件`

## `pygrib使用`

`首先介绍一些基本的命令`

`pygrib提供了两种读取grib文件的命令（仅我所了解），分别是：`

### 1`pygrib.open()`

```python
data = pygrib.open('sampledata/flux.grb')
```

`使用open命令读取的文件可以有以下methods：`

#### `查看文件中有多少条数据`

```python
data.messages
```

#### `获取第二条信息`

```python
grb = data.message(2)
# same as grbs.seek(1); grb=grbs.readline()
```

#### `查看文件前20条数据`

```python
data.read(20)
Out[57]: 
[2:Relative humidity:% (instant):regular_ll:isobaricInhPa:level 1:fcst time 0 hrs:from 200406190000,
 3:Temperature:K (instant):regular_ll:isobaricInhPa:level 1:fcst time 0 hrs:from 200406190000,
 4:Specific humidity:kg kg**-1 (instant):regular_ll:isobaricInhPa:level 1:fcst time 0 hrs:from 200406190000,
 5:U component of wind:m s**-1 (instant):regular_ll:isobaricInhPa:level 1:fcst time 0 hrs:from 200406190000,
 6:V component of wind:m s**-1 (instant):regular_ll:isobaricInhPa:level 1:fcst time 0 hrs:from 200406190000,
 7:Vertical velocity:Pa s**-1 (instant):regular_ll:isobaricInhPa:level 1:fcst time 0 hrs:from 200406190000,
 8:Geopotential:m**2 s**-2 (instant):regular_ll:isobaricInhPa:level 2:fcst time 0 hrs:from 200406190000,
 9:Relative humidity:% (instant):regular_ll:isobaricInhPa:level 2:fcst time 0 hrs:from 200406190000,
 10:Temperature:K (instant):regular_ll:isobaricInhPa:level 2:fcst time 0 hrs:from 200406190000,
 11:Specific humidity:kg kg**-1 (instant):regular_ll:isobaricInhPa:level 2:fcst time 0 hrs:from 200406190000,
 12:U component of wind:m s**-1 (instant):regular_ll:isobaricInhPa:level 2:fcst time 0 hrs:from 200406190000,
 13:V component of wind:m s**-1 (instant):regular_ll:isobaricInhPa:level 2:fcst time 0 hrs:from 200406190000,
 14:Vertical velocity:Pa s**-1 (instant):regular_ll:isobaricInhPa:level 2:fcst time 0 hrs:from 200406190000,
 15:Geopotential:m**2 s**-2 (instant):regular_ll:isobaricInhPa:level 3:fcst time 0 hrs:from 200406190000,
 16:Relative humidity:% (instant):regular_ll:isobaricInhPa:level 3:fcst time 0 hrs:from 200406190000,
 17:Temperature:K (instant):regular_ll:isobaricInhPa:level 3:fcst time 0 hrs:from 200406190000,
 18:Specific humidity:kg kg**-1 (instant):regular_ll:isobaricInhPa:level 3:fcst time 0 hrs:from 200406190000,
 19:U component of wind:m s**-1 (instant):regular_ll:isobaricInhPa:level 3:fcst time 0 hrs:from 200406190000,
 20:V component of wind:m s**-1 (instant):regular_ll:isobaricInhPa:level 3:fcst time 0 hrs:from 200406190000,
 21:Vertical velocity:Pa s**-1 (instant):regular_ll:isobaricInhPa:level 3:fcst time 0 hrs:from 200406190000]
```

​	`再次使用此命令，会依次读取下面的20条数据`

#### `使用循环查看文件信息：`

```python
for grb in data[1:16]:
    print(grb)
    
1:Geopotential:m**2 s**-2 (instant):regular_ll:isobaricInhPa:level 1:fcst time 0 hrs:from 200406190000
2:Relative humidity:% (instant):regular_ll:isobaricInhPa:level 1:fcst time 0 hrs:from 200406190000
3:Temperature:K (instant):regular_ll:isobaricInhPa:level 1:fcst time 0 hrs:from 200406190000
4:Specific humidity:kg kg**-1 (instant):regular_ll:isobaricInhPa:level 1:fcst time 0 hrs:from 200406190000
5:U component of wind:m s**-1 (instant):regular_ll:isobaricInhPa:level 1:fcst time 0 hrs:from 200406190000
6:V component of wind:m s**-1 (instant):regular_ll:isobaricInhPa:level 1:fcst time 0 hrs:from 200406190000
7:Vertical velocity:Pa s**-1 (instant):regular_ll:isobaricInhPa:level 1:fcst time 0 hrs:from 200406190000
8:Geopotential:m**2 s**-2 (instant):regular_ll:isobaricInhPa:level 2:fcst time 0 hrs:from 200406190000
9:Relative humidity:% (instant):regular_ll:isobaricInhPa:level 2:fcst time 0 hrs:from 200406190000
10:Temperature:K (instant):regular_ll:isobaricInhPa:level 2:fcst time 0 hrs:from 200406190000
11:Specific humidity:kg kg**-1 (instant):regular_ll:isobaricInhPa:level 2:fcst time 0 hrs:from 200406190000
12:U component of wind:m s**-1 (instant):regular_ll:isobaricInhPa:level 2:fcst time 0 hrs:from 200406190000
13:V component of wind:m s**-1 (instant):regular_ll:isobaricInhPa:level 2:fcst time 0 hrs:from 200406190000
14:Vertical velocity:Pa s**-1 (instant):regular_ll:isobaricInhPa:level 2:fcst time 0 hrs:from 200406190000
15:Geopotential:m**2 s**-2 (instant):regular_ll:isobaricInhPa:level 3:fcst time 0 hrs:from 200406190000
```

#### `读取变量`

```
data.select(name='data name')
```

- `举个例子，通过上面的命令可以查看文件内具体有什么变量，变量的信息，下面读取风速U`

```python
grb = data.select(name='U component of wind')[0]
grb
Out[65]: 5:U component of wind:m s**-1 (instant):regular_ll:isobaricInhPa:level 1:fcst time 0 hrs:from 200406190000
```



#### `读取多个指定的变量`

```python
data = pygrib.open('sampledata/gfs.grb')
select1_data = data(shortName=['u','v'],typeOfLevel='isobaricInhPa',level=[10,50])
select2_data = data(name=['U component of wind','Temperature'],typeOfLevel='isobaricInhPa',level=[10,50])
select3_data = data(shortName='gh',level=lambda l: l < 500 and l >= 300)
```

#### `获取变量的具体数值，返回的是array格式`

```python
grb_value = grb.values
```

![image-20220918135947572](E:\picgo\imga_copy\0918)

#### `获取变量的经纬度网格数据`

```python
lats, lons = grb.latlons()
```

![image-20220918140125199](E:\picgo\imga_copy\00918-1)



#### `取出指定经纬度范围内的数据`

```python
data, lats, lons = grb.data(lat1=20,lat2=70,lon1=220,lon2=320)
```

#### `修改现有变量的数据为自己指定的数据`

```python
grb['forecastTime'] = 240
grb.dataDate = 20100101
```

#### `将数据转为grib文件需要的二进制字符串`

```python
msg = grb.tostring()
grbs.close() # close the grib file.
```

#### `将数据写入新的grib文件`

```python
grbout = open('test.grb','wb')
>>> grbout.write(msg)
>>> grbout.close()
>>> pygrib.open('test.grb').readline()
1:Surface pressure:Pa (instant):regular_gg:surface:level 0:fcst time 240 hrs:from 201001011200
```



关于`pygrib.open()`读取`grib`文件的相关命令简单介绍到这里，注意：

- `只有通过pygrib.open()命令读取文件才能使用以上的大部分命令，使用pygrib.index()读取文件的大部分命令是不可用的。`

- `同时，pygrib.open()相比于pygrib.index()读取大文件的速度要慢很多`



### `2pygrib.index()`

```python
data= pygrib.index('sampledata/gfs.grb','shortName','typeOfLevel','level')
```

这里的关键字是必须要加的，可以自己更换，`'shortName'`表示变量的缩写名称，`'typeOfLevel'`是压力层的类型，`'level'`是实际的压强，在下面读取变量中使用，`'name'`表示变量的全称， `'paramID'`表示变量的编号(没用过)

#### 查看关键字：

```python
grbindx.keys
['shortName', 'typeOfLevel','level']
```

上述关键字，在下面读取具体变量时需要用到，而且必须用到

#### 读取变量1

```python
selected_grbs=grbindx.select(shortName='u',typeOfLevel='isobaricInhPa',level=500)
```

#### 读取变量2

如果你在读取文件路径时，用的关键字是这样的，`pygrib.index(path,'name','typeOfLevel','level',)`，那么就需要修改一下：

```python
selected_grbs=grbindx.select(name='U component of wind',typeOfLevel='isobaricInhPa',level=500)
```

#### 通过循环查看数据信息，与上述一致

```python
for grb in selected_grbs:
    grb
```

`pygrib.index()`读取数据后，**不支持通过关键字读取指定的多个变量**





## 问题解决：将滤波后的数据替换原始`grib`中的数据再重新写为新的`grib`文件

`pygrib写grib文件的优势在于，写出的grib文件，基本上会保留原始grib文件中的信息，基本的Attributes等也不需要自己编辑，会直接将原始文件中的信息写入`



替换的大致思路如下：



```python
replace_data = np.array(data)  #你想替换的数据

with pygrib.open(grbfile) as grbs:

    grb = grbs.select.(indicatorOfParameter=199)[0] 
    #e.g., 199 - parameter I need; also name='...' could be used instead of indicatorOfParameter)
    
    grb.values = replace_data

    grbs_out = open('new_grib_file','wb')

    grbs_out.write(grb.tostring())

grbs_out.close()
```



附上完整的代码：

```python
# 导入基本的库
import  pygrib as pg
import numpy as np
import cfgrib
import xarray as xr

# 读取文件 
path = r'/Users/wrf_ear5/ERA5_pl.grib'
grbindx = pg.index(path,'name','typeOfLevel','level',)

# 读取850hpa的纬向风速
level = 850   
sel_u_850 = grbindx(name='U component of wind',typeOfLevel='isobaricInhPa',level=level)

# 将原始文件中的纬向风速存为array数组
u_850 = np.zeros((288,361,720))
for j in range(len(sel_u_850)):
    u_850[j] = sel_u_850[j].values
    
# 对原始文件中的数据进行高通滤波 
from scipy import signal
b, a = signal.butter(3, (2*1/2)/ (1/(1/24)), 'highpass')
band_u = signal.filtfilt(b, a, u_850,axis=0)   

# 新建一个grib文件，将滤波后的数据写入
grbout = open('./highpass_0918/highpass_out_pre_'+str(level)+'.grib','wb')
for i in range(len(sel_u_850)):  
    print(i)
    sel_u_850[i].values  = band_u[i]  #将原始文件中的纬向风数据替换为滤波后的数据
    msg_850 = sel_u_850[i].tostring()
    grbout.write(msg_850)
grbout.close()
```

## 参考链接：

`cfgrib：https://pypi.org/project/cfgrib/`

`dask：https://distributed.dask.org/en/stable/`

`pygrib：https://jswhit.github.io/pygrib/installing.html`

