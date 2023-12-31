---
layout: post
title: "WRF--修改geo_em.d01.nc中的变量"
categories: [WRF,Tutorial]
image: 'blog/img/WRF.png'
url: 'Modify_geo_em'
---


- WRF--修改geo_em.d01.nc中的变量，保持其他信息不变

首先呢，找到编译WRF过程中自带的读取nc的一个fortran函数：`read_wrf_nc.f90`

可以使用Linux命令：
`find / -name 'read_wrf_nc.f90'`  

找到之后，修改这个文件，拉到代码最下面，你会看到这样的界面，是`USER_CODE`这个子函数：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/f19b20e1d2444685a071df392b79ae65.png)
然后在下面if条件语句下，更改你希望修改的变量。比如我这里将原始文件中变量名为"LANDMASK"的数据，全部修改为0.保存修改后，重新将其编译为`.exe`格式进行调用，我这里使用的是gfortran

```python
 gfortran read_wrf_nc.f90 -o read_wrf_nc.exe  
```
然后，将你现在的geo_em.d01.nc复制到和该函数相同的目录下，使用命令：

```python
./read_wrf_nc -EditData LANDMASK geo_em.d01.nc   
```
运行完成后，得到的geo_em.d01.nc   其中的 LANDMASK这个变量已经全部是0啦

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/7b545776f56d44889584476dfe60bf37.png)
