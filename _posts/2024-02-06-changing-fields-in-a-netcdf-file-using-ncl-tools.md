---
layout: post
title: "Changing fields in a netCDF file using NCL tools"
author: Jianpu
categories: NCL
tags: [tools,code]
image: 34.jpg
date: 2024-02-06 21:12
comments: true
---



# Changing fields in a netCDF file using NCL tools

在原始的 NetCDF 文件中修改并保存更改，您可以简单地使用 "w" 模式打开该文件，并将修改后的变量重新写入该文件。


## Example 1：

```bash
a = addfile("./geo_em.d01.nc",”w”)
var= a->LANDUSE
var(:,63:64,83:84) = 7
var(:,62,84) = 7
a->LANDUSE = var
```

![image.png](https://s2.loli.net/2024/02/22/eHoXf3xQgRCuTzF.png)


## Example 2：


```bash
begin
    DATADir = "./"
    FILES = systemfunc (" ls -1 " + DATADir + "met_em.d01* ")
    numFILES = dimsizes(FILES)
    do i=0,numFILES-1
    a = addfile(FILES(i),"w")
    sst = a->SST ; read the field
    sst = sst + 1 ; change the entire field
    a->SST = sst ; write the field back to the file
    end do
end
```



## Example 3:
```bash
begin
    out = addfile("t2_dailymax_1993-08-20.nc","c") ; Create new netCDF file
    filedimdef(out,"Time",-1,True)                 ; Make Time unlimited
    a = addfile(”wrfout_d01_1993-08-20_00:00:00.nc","r”) ;File has 24 time steps
    fileattdef(out,a) ; Transfer attributes to new file
    t = a->T2-273.15
    landmask = a->LANDMASK(0,:,:)
    lat = a->XLAT(0,:,:)
    lon = a->XLONG(0,:,:)
    times = a->Times(0,0:9)
    tland = mask(t,landmask,1) ; Mask out the ocean
    tmax = dim_max_n(t,0) ; Daily max
    tlandmax = dim_max_n(tland,0) ; Daily max with ocean masked out
    ; Write attributes for the variable
    tlandmaxday!0 = "Time"
    tlandmaxday!1 = "south_north"
    tlandmaxday!2 = "west_east"
    tlandmaxday@units = "C"
    tlandmaxday@coordinates = "XLONG XLAT"
    tlandmaxday@description = "DAILY MAX TEMP at 2 M (masked)”
    ; Write out data
    out->XLAT = lat
    out->XLONG = lon
    out->LANDMASK = landmask
    out->T2MAX = tlandmaxday
```

---

代码解释：

```bash
out = addfile("t2_dailymax_1993-08-20.nc","c") ; Create new netCDF file
```
- 这一行代码创建了一个新的 NetCDF 文件对象 out，文件名为 "t2_dailymax_1993-08-20.nc"，模式为 "c"，表示创建新文件。
```bash
filedimdef(out,"Time",-1,True) ; Make Time unlimited
```
- 这一行代码将新文件 out 中的维度 "Time" 设置为无限维度，使得在该维度上可以存储可变数量的时间步长。
```bash
a = addfile("wrfout_d01_1993-08-20_00:00:00.nc","r") ;File has 24 time steps
```
- 这一行代码打开了一个现有的 NetCDF 文件对象 a，文件名为 "wrfout_d01_1993-08-20_00:00:00.nc"，模式为 "r"，表示只读。
```bash
fileattdef(out,a) ; Transfer attributes to new file
```
- 这一行代码将文件 a 中的所有属性转移到新创建的文件 out 中。
```bash
t = a->T2-273.15
```
- 这一行代码从文件 a 中获取变量 "T2"，然后将其转换为摄氏度（减去 273.15 度）并将结果赋值给变量 t。

```bash
landmask = a->LANDMASK(0,:,:)
```
- 这一行代码从文件 a 中获取变量 "LANDMASK"，并选择第一个时间步长的数据，然后将结果赋值给变量 landmask。

```bash
lat = a->XLAT(0,:,:)
lon = a->XLONG(0,:,:)
```
- 这两行代码分别从文件 a 中获取 "XLAT" 和 "XLONG" 变量的第一个时间步长的数据，并将结果赋值给变量 lat 和 lon。

```bash
times = a->Times(0,0:9)
```
- 这一行代码从文件 a 中获取变量 "Times" 的第一个时间步长的数据，并选择索引从 0 到 9 的字符，然后将结果赋值给变量 times。

```bash
tland = mask(t,landmask,1) ; Mask out the ocean
```
- 这一行代码将变量 t 中的数据根据 landmask 变量（陆地掩码）进行屏蔽，将海洋部分排除在外，并将结果赋值给变量 tland。

```bash
tmax = dim_max_n(t,0) ; Daily max
```
- 这一行代码计算变量 t 在第一个维度（时间维度）上的最大值，并将结果赋值给变量 tmax，表示每天的最高温度。

```bash
tlandmax = dim_max_n(tland,0) ; Daily max with ocean masked out
```
- 这一行代码计算变量 tland 在第一个维度（时间维度）上的最大值，并将结果赋值给变量 tlandmax，表示每天排除海洋后的最高温度。

```bash
; Write attributes for the variable
tlandmaxday!0 = "Time"
tlandmaxday!1 = "south_north"
tlandmaxday!2 = "west_east"
tlandmaxday@units = "C"
tlandmaxday@coordinates = "XLONG XLAT"
tlandmaxday@description = "DAILY MAX TEMP at 2 M (masked)”
```
- 这几行代码设置了变量 tlandmaxday 的属性，包括维度、单位、坐标和描述信息。


```bash
; Write out data
out->XLAT = lat
out->XLONG = lon
out->LANDMASK = landmask
out->T2MAX = tlandmaxday
```
- 这几行代码将经纬度数据 lat 和 lon、陆地掩码 landmask，以及每日最高温度数据 tlandmaxday 分别写入新创建的 NetCDF 文件 out 中的相应变量。






## Tips


其中，对于土地利用类型，需要注意的是：
```bash
num_land_cat                        = 21,      ! number of land categories in input data.
                                                  24 - for USGS (default); 20 for MODIS
                                                  28 - for USGS if including lake category
                                                  21 - for MODIS if including lake category (default since 3.8)
						  40 - for NCLD
```

在 MODIS 土地利用数据，对于这个数据集，17表示水体。

而在USGS 土地利用数据，对于这个数据集，16表示水体。

## Test for a netcdf file
以下是一个测试：

```bash

; 打开原始文件进行读写，使用 "w" 模式

a = addfile("./geo_em.d01.nc", "w")

; 从原始文件中获取 LU_INDEX 变量

var = a->LU_INDEX

; 将 LU_INDEX 变量的值修改为 17

var(:,:,:) = 17

; 将修改后的 LU_INDEX 变量写入原始的 NetCDF 文件中
a->LU_INDEX = var

; 关闭文件
delete(a)
```

![image.png](https://s2.loli.net/2024/02/22/6cUxInmVMX495ef.png)



---
引用

 > ncl 官网 ：http://www.ncl.ucar.edu

 > wrf-namelist.input： https://github.com/wrf-model/WRF/blob/master/run/README.namelist