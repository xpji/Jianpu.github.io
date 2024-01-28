---
layout: post
title: "WRF&WPS:namelist notes"
author: Jianpu
categories: WRF
tags: [命令参数说明]
image: 29.jpg
date: 2024-02-03 13:54
comments: true
---


#  WPS

## & share

 采用ARW方式进行模拟，除了ARW还有NMM,不过科研上常用ARW:

```bash
wrf_core = ‘ARW’
```

 最大的嵌套层数为3层，初学者一般是从一层开始逐步加多:

```bash
max_dom = 3
# max_dom = 2
```

 设置模式开始和结束 的时间，从左到右依次是第一层第二层和第三层；刚安装好WRF时候，里边只有两层，如果您需要转三层的模式，需要自行添加）

```bash
start_date = 2012-07-21_00:00:00,2012-07-21_00:00:00,2012-07-21_00:00:00,
start_date = 2012-07-21_00:00:00,2012-07-21_00:00:00

end_date = 2012-07-22_00:00:00,2012-07-22_00:00:00,2012-07-22_00:00:00,
end_date = 2012-07-22_00:00:00,2012-07-22_00:00:00


# 设置输出文件的位置。

opt_output_from_geogrid_path='/WPS/'
```

 前处理的两次分析时间之间的时间间隔（在WRF运行过程中会发现具体的情况，以秒为单位。也就是模式实际输入数据的时间间隔，一般为输入边界条件的文件的时间间隔。没有默认值；输入数据的时间间隔）

```bash
interval_seconds = 21600 
```

 这里是一个输出格式的选项，默认为2；当输入1时为binary，后缀是.int文件，当输入2时为NetCDF，后缀为.nc文件，当输入3时为GRIB1，后缀为.gr1文件。

```bash
io_form_geogrid = 2, 
```

## & geogrid


嵌套区域的母区域的标号。模式本身没有母区域，因为此项第一列一般设为1，第二列必须等于1。总列数必须等于NUM_DOMAINS

```bash
parent_id = 0, 1, 2,
# parent_id = 1 , 1
```

嵌套时母网格与子网格之间的比例，没有默认值，例如这里就是1：3：9的比例，最外层为27公里，中间层为9公里，最里层为3公里

```bash
parent_grid_ratio = 1, 3, 3,
# parent_grid_ratio = 1, 3 ,
```

水平网格各层之间的开始的隔点数，从网格左下角开始

```bash
i_parent_start = 1, 31, 35,
```

各层网格的结束点，因为起始点从1开始，所以也是总隔点数

```bash
e_we = 101, 109, 109, 

e_sn = 91, 109, 109,
```

（区域所对应选择的地表面静态数据）

```bash
geog_data_res = 10m,2m,2m, 
```

（xy方向最外层网格的格距，与输入数据保持格距一致）

```bash
dx = 27000,
dy = 27000,
```

选择的投影方式`lambert, polar, mercator, and lat-lon`

```bash
map_proj = lambert, 
```

中心纬度，也就是模式定最外层所确定的中心位置

```bash
ref_lat = 39.9, 
```

中心经度，也就是模式定最外层所确定的中心位置

```bash
ref_lon = 116.3,  
```

投影的标准纬

```bash
truelat1 = 30.0, 
truelat2 = 60.0,
```

标准经度，实际中图形以这条轴展开

```bash
stand_lon = 116.3,  
```

设置地表静态数据的路径

```bash
geog_data_path = '/WPS/geog' ，
```

文件输出路径：

```bash
opt_geogrid_tbl_path = '/domain/output/'，
```




## & ungrib

输出文件的形式，有==`MM5，WPS和SI`==三种形式

```bash
out_format = WPS, 
```

输出文件的前缀，默认为`FILE`形式

```bash
prefix = 'FILE', 
```





## & metgrid

```bash
fg_name = 'FILE'
io_form_metgrid = 2,
```

输出路径：

```bash
opt_output_from_metgrid_path = '/metgrid/output',
```



#  WRF

根据namelist.wps来设置namelist.input，对于domain,time要和namelist.wps保持一致。

##  &time_control

时间是累计加起来的。

```bash
 运行时间天、时、分、秒
 run_days                            = 2,
 run_hours                           = 48,
 run_minutes                         = 0,
 run_seconds                         = 0,

# 起始/结束 年份、月份、日期、小时、分钟、秒钟 这里的每一列需要根据你选取的嵌套层进行设置，与WPS一致

 start_year                          = 2016,2016,   
 start_month                         = 10,10,
 start_day                           = 06,06,
 start_hour                          = 00,00,
 end_year                            = 2016,2016,
 end_month                           = 10,10,
 end_day                             = 08,08,
 end_hour                            = 00,00,
 #前处理程序的两次分析时间的时间间隔
 interval_seconds                    = 21600,
 #嵌套初始场输入选项。嵌套时，指定嵌套网格是否使用不同的初始场文件
 input_from_file                     = .true.,.true.,
 #指定模式结果输出的时间间隔，以分钟为单位。默认单位是分钟，如果在变量名后面加入'_s'或者 '_h'(例如, history_interval_s)，可以将它换成秒或者小时。这个值在不同区域可以不同。
 history_interval                    = 180, 180, 
 #每一个wrfout文件包含多少帧文件，每个wrfout里面记录多少个时次的数据
 frames_per_outfile                  = 1,1,
 #是否重新启动，仅在有restart文件(wrfrst*，之前运行时生成) 时使用。
 restart                             = .false.,
 #重启时间间隔
 restart_interval                    = 1440,
 #指定模式断电重启输出的格式，2为nc文件；1为二进制文件，4为phd5格式，5为grib1格式，
 io_form_history                     = 2
 #restart文件(wrfrst_d0*)将会写入的格式
 io_form_restart                     = 2
 #输入文件 (met_em_d0*) 的格式.
 io_form_input                       = 2
 # 边界文件 (wrfbdy_d01)写入格式.
 io_form_boundary                    = 2
 #输出运行记录的级别，数值越大，输出的信息越详细
 debug_level  =0
```

 /

需要与wps中一致

```bash
 start_year                          = 2016,2016,   
 start_month                         = 10,10,
 start_day                           = 06,06,
 start_hour                          = 00,00,
 end_year                            = 2016,2016,
 end_month                           = 10,10,
 end_day                             = 08,08,
 end_hour                            = 00,00,
 interval_seconds                    = 21600,
 input_from_file                     = .true.,.true.,
 history_interval                    = 180, 180, 
```



##  &domains

```bash
#积分的时间步长，整数型，单位为秒
 time_step                           = 150,
 最大区域层数
 max_dom                             = 2,
 e_we                                = 91,91,
 e_sn                                = 100,100,
 e_vert                              = 45,45,
 s_vert                              = 1,1,
# 模型中要使用的气压上限（单位：Pa）。在传入的WPS数据中必须要有这个层次的数据。默认值和建议值为5000 Pa，不建议气压顶使用低于值（在大气中）。
 p_top_requested                     = 5000,
# 传入（来自WPS输入数据）垂直层次的数量。这由您使用的输入数据决定。
 num_metgrid_levels                  = 32,
 num_metgrid_soil_levels             = 4,
# x和y方向的格距，与WPS不同（在WPS中，嵌套值是基于parent_grid_ratio计算的），必须指定这些值，但必须根据parent_grid_ratio保持准确。
 dx                                  = 27000,
 dy                                  = 27000,
# 计算区域的编号，一般从1开始
 grid_id                             = 1,     1,
# 嵌套网格的上一级网格（母网格）的编号，一般从0开始
 parent_id                           = 1,     3,
 
 i_parent_start                      = 1,         30,
 j_parent_start                      = 1,         30,
# 相对于域父级的嵌套比率。对于最粗糙的域，父网格比率应设置为1。这些值应与您在namelist.wps中使用的值相同。
 parent_grid_ratio                   = 1,     3,  
# 这就是模型为嵌套域定义时间步长的方式。对于最粗糙的域，该值应设置为1。
 parent_time_step_ratio              = 1,     3,    
# 这将确定在使用嵌套时是否使用feedback，并应用于是单向嵌套运行还是双向嵌套运行。
 feedback                            = 1,
# 确定如果启用反馈（feedback=1），是否对嵌套区域中的父域使用平滑。有三种选择：
	0=无平滑
	1=1-2-1平滑
	2=平滑去光滑。通常建议将此选项设置为0。
 smooth_option                       = 0
 /
```

栅格空间示例：

```bash
s_we: x方向（西-东）方向的起始格点值，通常为1
e_we:x方向（西-东）方向的终止格点值，通常为x方向上的格点数
s_sn:y方向的起始点值
e_sn：y方向的终止格点值
s_vert:z方向的起始格点值
e_vert:z方向的终止格点值，即全垂直eta层的总层数，该层数在各嵌套网格中必须一致



e_we = 201, 304,
e_sn = 188, 289,
```

![image.png](https://s2.loli.net/2024/01/28/sTlR49capqODNo3.png)

e_sn=度数（经纬度）×111（km）➗分辨率（36km）

e_we同理

i_parent_start=1，最外层的度数×111km除以这一层的分辨率（12km)

```bash
grid_id:域名。
```

最粗糙的栅格应设置为1。在下面的示例中，我们展示了一个更复杂的示例，其中我们有4个域（如图所示编号-注意，我们可以对它们进行不同的编号）。对于此示例：

![image.png](https://s2.loli.net/2024/01/28/t9fj5E1Az3LcQ64.png)

```bash
parent_id:嵌套父级的域号。
```

最粗糙的域应设置为1。在下面的示例中，我们展示了一个更复杂的示例，其中我们有4个域（如图所示编号-注意，我们可以对它们进行不同的编号）。例如

```bash
grid_id = 1, 2, 3, 4
parent_id = 1, 1, 2, 1
```

可以看到d02和d04将d01作为父级，而d03将d02作为父级:





**i_parent_start**
**j_parent_start**:

父域中嵌套左下角的x和y坐标。对于最粗糙的域，应为i和j指定值1。这些值与您在WPS中指定的值相同。

```bash

i_parent_start = 1, 31,
j_parent_start = 1, 17,

```

![image.png](https://s2.loli.net/2024/01/28/tdyXlQ9HGPv4fsO.png)

**需要与wps中一致**

```bash
 e_we                                = 91,91,
 e_sn                                = 100,100,
 e_vert                              = 45,45,
 s_vert                              = 1,1,
  grid_id                             = 1,     1,
 parent_id                           = 1,     3,
 i_parent_start                      = 1,         30,
 j_parent_start                      = 1,         30,
 parent_grid_ratio                   = 1,     3,    
 parent_time_step_ratio              = 1,     3, 
```





##  &physics

```bash
 physics_suite                       = 'CONUS'
 mp_physics                          = -1,    -1,    -1,
 cu_physics                          = -1,    -1,     0,
 ra_lw_physics                       = -1,    -1,    -1,
 ra_sw_physics                       = -1,    -1,    -1,
 bl_pbl_physics                      = -1,    -1,    -1,
 sf_sfclay_physics                   = -1,    -1,    -1,
 sf_surface_physics                  = -1,    -1,    -1,
 radt                                = 30,    30,    30,
 bldt                                = 0,     0,     0,
 cudt                                = 5,     5,     5,
 icloud                              = 1,
 num_land_cat                        = 21,
 sf_urban_physics                    = 0,     0,     0,
 /
```


##  &fdda

```
 /
```



##  &dynamics

```bash
 hybrid_opt                          = 2, 
 w_damping                           = 0,
 diff_opt                            = 1,      1,      1,
 km_opt                              = 4,      4,      4,
 diff_6th_opt                        = 0,      0,      0,
 diff_6th_factor                     = 0.12,   0.12,   0.12,
 base_temp                           = 290.
 damp_opt                            = 3,
 zdamp                               = 5000.,  5000.,  5000.,
 dampcoef                            = 0.2,    0.2,    0.2
 khdif                               = 0,      0,      0,
 kvdif                               = 0,      0,      0,
 non_hydrostatic                     = .true., .true., .true.,
 moist_adv_opt                       = 1,      1,      1,     
 scalar_adv_opt                      = 1,      1,      1,     
 gwd_opt                             = 1,
 /
```



##  &bdy_control

```bash
 spec_bdy_width                      = 5,
 specified                           = .true.
 /
```



##  &grib2



##  &namelist_quilt

```bash
nio_tasks_per_group = 0,
nio_groups = 1,
 /
```

./real.exe 运行成功会出现：

![image.png](https://s2.loli.net/2024/01/28/ZU2xE6P7DKqFATo.png)

# 常用linux 命令

## cd 命令

```bash
cd directory 改变工作目录
cd .. 退到上一层目录
```



## ② ls 命令

```bash
-a 显示目录下所有子目录与文件(包括隐藏文件)
-l 显示文件的详细信息
```



## ③ cp命令

```bash
cp –r default OnlineTut
-r 递归复制源目录下所有的子目录和文件
```



## ④ vi 命令

```bash
vi file_name 开始编辑或者创建一个文件
编辑命令： <Esc> 模式切换
x 删除光标所在文字
dd 删除光标所在行
a 在光标后新增文字
i 在光标前新增文字
o 在光标下方新增一行
O 在光标上方新增一行
:wq 以原档案名保存并退出
:q! 不保存文档强制退出
```

## ⑤ rm命令

```bash
rm file_name 删除文件
rm –r deirectory_name 递归删除全部目录和子目录
```



## ⑥ mkdir命令

```bash
mkdir directory_name 创建新目录
```



## ⑦ rmdir 命令

```bash
rmdir directory_name 删除空目录
```



## ⑧ gunzip命令

```bash
gunzip xxxxx.tar.gz 解压缩。
```



## ⑨ tar命令

```bash
tar –xvf xxxxx.tar 解压文件
x 从档案文件中释放文件
v 详细报告tar处理的文件信息
f 使用档案文件或设备，这个选项通常是必选的
可以和上面的⑧合写成 tar xvfz xxxxx.tar.gz
```

## ⑫ pwd 命令

```bash
pwd 显示出当前工作目录的绝对路径
```



## ⑬  Ctrl  + C

```bash
强制放弃正在执行的任务
```

## ⑭ exit 命令

```bash
退出UNIX系统（包括退出SSH）
```



