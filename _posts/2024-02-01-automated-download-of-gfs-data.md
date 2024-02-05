---
layout: post
title: "Automated download of GFS data~"
author: Jianpu
categories: linux
tags: [data download]
image: 26.jpg
date: 2024-02-01 17:35
comments: true
---

# 在linux环境下使用脚本实现对于WRF模式的初始场强迫场资料--GFS数据进行自动化下载

## GFS(Global Forecast System--全球预报系统)

GFS(Global Forecast System--全球预报系统)是WRF模式中常用的预报场资料，一般应用于业务预报。

##  Final Reanalysis Data再分析数据集

- FNL是由美国气象环境预报中心（NCEP）和美国国家大气研究中心（NCAR）联合制作的，他们采用了当今最先进的全球资料同化系统和完善的数据库，对各种来源（地面、船舶、无线电探空、测风气球、飞机、卫星等）的观测资料进行质量控制和同化处理，获得了一套完整的再分析资料集，它不仅包含的要素多，范围广，而且延伸的时段长，是一个综合的数据集
  与GFS相比，FNL中加入了同化技术，预报结果更准确，但是更新时间要落后GFS一定时间，6h左右的时间，所以FNL一般用于数据反演。

- 数据是在全球按照一定的度数划分的数据网格，有1度的、0.5度和0.25度，数据更新的时间是每6小时，时间是以格里尼治时间为标准。

- 环境：linux
- 脚本：csh
- 功能：实现指定时间范围内的GFS气象数据下载


## 使用csh脚本下载GFS资料

```bash
#!/bin/csh -xf
#-----------------------------------------------------------------------
#set debug
set cmd = $0
set cmd = $cmd:t
#-----------------------------------------------------------------------
# get args
#-----------------------------------------------------------------------
if ( $#argv >= "1" ) then
  set date    = $1  # start time 
  set res     = $2  # resolution :0p25\0p50\1p00
  set inter   = $3  # time interp:1\3\6
  set end     = $4  # end data
else
   echo "  "
   echo "  Usage: $cmd Initime"
   echo "  "
   exit 1
endif
 
  set SY4     = `echo $date | cut -c 1-4`  #year
  set SMM     = `echo $date | cut -c 5-6`  #month
  set SDD     = `echo $date | cut -c 7-8`  #day
  set SHH     = `echo $date | cut -c 9-10` #forrest start time
 
#-----------------------------------------------------------------------
# Ftp Server information
#-----------------------------------------------------------------------
  if ( ! $?ftpserver ) set  ftpserver = "https://ftp.ncep.noaa.gov/data/nccf/com/gfs/prod/"
#-----------------------------------------------------------------------
  mkdir $date
  cd $date
  set gfsdata = "${ftpserver}/gfs.${SY4}${SMM}${SDD}/${SHH}/atmos"
  set i=0
  while ( $i <= $end )
    set HH3 = `/Users/gfsdown/cvtno.pl 3 $i`
    wget  ${gfsdata}/gfs.t${SHH}z.pgrb2.${res}.f${HH3}
    @ i = $i + $inter
  end
  echo 'download gfs finish'
#-----------------------------------------------------------------------
exit 0


```

上述脚本中的`cvtno.pl`文件如下所示：

```bash
#!/usr/bin/perl -w

($#ARGV == 1) || die "Error ";
($len,$no)=@ARGV;
printf "%${len}.${len}d\n",$no;

exit;

```


[FNL官网数据介绍](https://rda.ucar.edu/datasets/ds083.2/#!)

## 使用python下载FNL

```python
import requests
import datetime
import xarray as xr
def builtSession():
    email = "xxxx"    #此处改为注册邮箱
    passwd = "xxxx"   #此处为登陆密码
    loginurl = "https://rda.ucar.edu/cgi-bin/login"
    params = {"email":email, "password":passwd, "action":"login"}
    sess = requests.session()
    sess.post(loginurl,data=params)
    return sess
def download(sess, dt):
    g1 = datetime.datetime(1999,7,30,18)
    g2 = datetime.datetime(2007,12,6,12)
    if dt >= g2:
        suffix = "grib2"
    elif dt >= g1 and dt <g2:
        suffix = "grib1"
    else:
        raise StandardError("DateTime excess limit")
    url = "http://rda.ucar.edu/data/ds083.2"
    folder = "{}/{}/{}.{:0>2d}".format(suffix, dt.year, dt.year, dt.month)
    filename = "fnl_{}.{}".format(dt.strftime('%Y%m%d_%H_00'), suffix)
    fullurl = "/".join([url, folder, filename])
    r = sess.get(fullurl)
    with open(filename, "wb") as fw:
        fw.write(r.content)
    print(filename + " downloaded")
if __name__ == '__main__':
    print("downloading...")
    s = builtSession()
    for i in range(2):                               #共下载多少个时次
        startdt = datetime.datetime(2018, 5, 16, 0)  #开始时次
        interval = datetime.timedelta(hours = i * 6)
        dt = startdt + interval
        download(s,dt)
    print("download completed!")
```

读取FNL资料：

```python
ds = xr.open_dataset('/home/mw/project/fnl_20180516_00_00.grib2',engine='pynio')
ds
```


> 引用参考
>
> - https://www.heywhale.com/mw/project/6199a9657d74800017253023
> - https://psl.noaa.gov/data/gridded/reanalysis/
> - https://ftp.ncep.noaa.gov/data/nccf/com/gfs/prod/
> - http://www.ihamodel.com/?p=17426
> - https://zhuanlan.zhihu.com/p/368000766
> - http://bbs.06climate.com/forum.php?mod=viewthread&tid=20582
> - https://www.cnblogs.com/tiandi/p/11045602.html