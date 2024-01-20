---
layout: post
title:  "WRF errors!"
author: "Jianpu"
date:   2024-01-18 13:38
categories: WRF
tags: [WRF]
image: 9.jpg
views: 0
comments: true
---
# 



# WRF errors summary



## error1：**Mismatch Landmask ivgtyp**

![image-20240118133535070.png](https://s2.loli.net/2024/01/20/8PTVzIWXamnoU3G.png)

Symptoms:

- Real.exe crashed, giving error message: 

-------------- FATAL CALLED ---------------
FATAL CALLED FROM FILE: LINE: 3299
mismatch_landmask_ivgtyp
\-------------------------------------------

Causes:

- By far, only occurred while using ECMWF Era-Interim dataset. The reason is unknown. It's documented on [WRF-ARW website](http://www2.mmm.ucar.edu/wrf/users/wrfv3.8/known-prob-3.8.1.html). 

Solutions:

- Change the value of 'surface_input_source' on &physics parameter of namelist.input from '3' to '1'

```
surface_input_source                = 3,	! where landuse and soil category data come from:
                                                  1 = WPS/geogrid but with dominant categories recomputed
                                                  2 = GRIB data from another model (only possible
                                                      (VEGCAT/SOILCAT are in met_em files from WPS)
                                                  3 = use dominant land and soil categories from WPS/geogrid (default since 3.8)
```



选1是指土地利用类型和土壤类型数据的来源格式是WPS/geogrid,但在real里土地利用类型会重新计算得到；

选2是其它模式产生的grib格式数据；

选3是完全来自前处理WPS/geogrid。

## error2：**Ungrib.exe Segmentation Fault (End Date)**

Symptoms:

- Ungrib.exe crashes at the ungribbing process at the end date, giving error message: "Segmentation fault ..."

Causes:

- Probably, it has something with computer memory, because when I set ulimit to unlimited, the problem was solved.

Solution:

- ulimit -s unlimited 



## error3：**Metgrid.exe error in ext_pkg_write_field**

Symptoms:

- Metgrid.exe crashes at the beginning of the process with messages: 'ERROR: Error in ext_pkg_write_field'.

Causes:

- This will happen when new NCEP GFS data (Version 15.1 or higher) was process using old version of ungrib.exe (< Ver. 4).

Solution:

- Install Ungrib from WPS Ver.4. (the old geogrid/metgrid still could be used). 

## error4：**WRF Simulation Sudden Death**

Symptoms:

- Model crashed. Real.exe and Wrf.exe are abruptly stopped, without any error messages in log files. It just stop.

Causes:

- I hate this error because it might caused by many factors, but mostly because of the conflicts within the model configuration. For example, I was using WSM-3 MP parameterization schemes, with RRTM schemes for LW and SW, with domain over high latitude and complex terrain, 10 km resolution, using several computation nodes, then many strange things happened: the model crashed many times, could only stable while running on single node, etc. 
- On several cases, it's also caused by too large time-step similar with CFL error.
- Sometimes, it also occurs if the domain is too large, in particular when grid size < 10 km with complex terrain.

 Solutions:

- Change the model configuration. For my case, I used Lin MP scheme with new RRTM schemes, and the error was gone.
- Reduce the time-step in the factor of 2 (half of time-step first, if still not works, try 0.25 of the original time-step, and so on).
- Reduce the domain size. 



## error5： **Real.exe Error : Interpolation Order Error**


Symptoms:

- While running real.exe, the process is stopped at certain point, indicating that there are to few data for the interpolation order with Real.exe

Causes:

- I'm not so sure about this, but I think that was caused when real.exe finds that the data for vertical interpolation is inadequate for model run. This was happened when I use GFS FNL ds083.2 for simulation over Russia, and I got so many warnings about missing level data, before this error occurred.

Solutions:

- Change the data. I used ECMWF Era-Interim and the errors were gone.



## error6：**No WRF Simulation Log (rsl.out or rsl.error) Generated**

Symptoms:

- While running real.exe or wrf.exe, there are no logs of simulation. Instead of log file, the steps are shown on the screen (stdout).

Causes:

- Well ... while it's quite strange and stupid (which I experienced), but this is absolutely not an error. It happens when you compiled WRF binaries for serial computation, instead of parallel ones (dmpar or smpar).

Solutions:

- Recompile the model using dmpar or smpar or both, then you'll get your logs back.

## error7：**Flerchinger Messages**

Symptoms:

- WRF generates messages such as: "*Flerchinger USEd in NEW version. Iterations= x*"
- Simulation still runs but the speed degrades.
- WRF restart files are not generated.

Causes:

- It's basically not an error, but a message generates by Noah LSM (namelist.input > &physics > sf_surface_physics), when the model output soil temperature which is super low/negative soil moisture. I experienced this while running simulation over Russia, with lon and lat > 55 degree. 

Solutions:

- Change the surface physics to other options
- Change the input data. I changed from GFS FNL ds083.2 into ECMWF ERA-Interim, and I've never met such messages ever again, even if I still use Noah LSM.

## error8：**CFL Error**

Symptoms: 

- WRF generates messages such as : "*x points exceeded cfl=x in domain d0x at time ...*" 
- Simulation speed degrades or simulation completely stops.

Causes:

- Model becomes unstable, mostly because the time-step used is too large for stable solution, especially while using high-res simulation grids.
- Conflicts among model physics/dynamics/domains configuration.

Solutions:

- Decrease the time-step (namelist.input > &domain > time_step). The most common used convention is 6*DX in kilometers. That means, if the grid resolution is 10 km, then use at least 60 seconds time step. If the messages still appear, decrease the time step to 30 or 10 seconds.
- Check the parameterization/configuration used in namelist.input which could potentially cause conflicts or model crash. I usually discard some parameterization schemes, and check them individually to see if I they are the causes of the crash.    



## error9：**num_metgrid_levels   mismatch**

Symptoms：

-  While running real.exe generates messages such as :  SIZE MISMATCH: namelist ide,jde,num_metgrid_levels=      74      61      32 ; input data ide,jde,num_metgrid_levels=      74      61      22

Causes:

-  the **num_metgrid_levels** in your namelist.input  is mismathc with the num_metgrid_levels in  met**.nc data

Solutions:

- Check the value of num_metgrid_levels in your met*.nc file. If there is no problem, modify the parameters of num_metgrid_levels in namelist.input to be consistent with those in met*.nc; otherwise, regenerate your met*.nc to ensure the num_metgrid_levels is 32





## error10： Mismatch between namelist and global attribute NUM_METGRID_SOIL_LEVELS

Symptoms：

![image-20240118135041462.png](https://s2.loli.net/2024/01/20/uQqZUPJRgKpdXsf.png)

- While running real.exe generates messages such as : namelist  : num_metgrid_soil_levels =      2. input files : NUM_METGRID_SOIL_LEVELS =      0 (from met_em files). Mismatch between namelist and global attribute NUM_METGRID_SOIL_LEVELS

Causes:

- The number of soil layers is inconsistent, the number of soil levels in the input file(met*.nc) is 0.

Solutions:

- Check the value of NUM_METGRID_SOIL_LEVELS in your met*.nc file. If there is no problem, modify the parameters of NUM_METGRID_SOIL_LEVELS in namelist.input to be consistent with those in met*.nc; otherwise, regenerate your met*.nc to ensure the NUM_METGRID_SOIL_LEVELS is 2



## error11: Missing values encountered in interpolated fields. Stopping.

Symptoms：

![image-20240118135335542.png](https://s2.loli.net/2024/01/20/rcyYLBGQ1OtzVpk.png)

- While running ./metgrid.exe generates messages such as : **Missing values encountered in interpolated fields. Stopping.**



Causes:

- Missing values occurred during interpolation
- The downloaded data is missing or not linked succeed



Solutions:

- 1、When linking driver files, there are several files that need to be linked several times. 
- 2、Re-download the driver data to ensure complete coverage of your research area
- Check your initial field data carefully to make sure nothing is missing and the data range is covered properly.









## error12：**segmentation fault** 

Symptoms：

![538fbc8a62e297ad34f42a965533cfd1.jpg](https://s2.loli.net/2024/01/20/UJKxE7Ta2QhRIgN.jpg)



- While running wrf.exe generates messages such as : **segmentation fault **

Causes:

- The model becomes unstable, usually caused by steep terrain or very strong convection
- This can sometimes be the result of insufficient disk space
- May be due to memory issue



Solutions:

- 1. **Reduce the time step**

- 2. add  **smooth_cg_topo = .true** in your namelist.input below: & domains
- 3. set  **epssm = 0.2** in your namelist.input below: &dynamics

- 4. set **w_damping = 1**  in your namelist.input below :&dynamics

- 5. Try typing in the terminal: setenv MP_STACK_SIZE64000000 (OMP_STACKSIZE)

- If you are using csh or tcsh, try the following: **limit stacksizeunlimited**
- If you use sh or bash, use the following command: **ulimit -s unlimited**
- It may be that your domain settings are too far away. After checking that everything was OK, I tried changing the nested grid design, and it ran normally.

