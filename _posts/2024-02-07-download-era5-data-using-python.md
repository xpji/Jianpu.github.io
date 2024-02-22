---
layout: post
title: "download ERA5 data using python"
author: Jianpu
categories: Python
tags: [tools,code]
image: python.jpg
date: 2024-02-07 21:45
comments: true
---



- Share a commonly used script for downloading ERA5 single-layer data. Multi-layer data can be implemented by simply modifying it.

- The time resolution of the downloaded data is hourly

The advantages of this script are: 

- Custom download variables (note that there are differences in the names of single-layer and pressure-layer data variables, you need to check them by yourself against the official website)
- Customize download start-end year and month
- Custom download area
- Customize the spatial resolution of downloaded data
- Customize the height of downloaded data
- Customize the location and name of data storage according to different data

```python

import cdsapi
import calendar as cal
import os
import numpy as np


varnames = ['10m_u_component_of_neutral_wind', 
            '10m_u_component_of_wind', 
            '10m_v_component_of_neutral_wind',
            '10m_v_component_of_wind',]

varshorts = ["u10","v10","u10_neutral","v10_neutral",]

startYear = 2019
endYear = 2020
startMonth = 1
endMonth = 12

latN = 40
latS = -40
lonW = -180
lonE = 180

grid = ['0.5','0.5']

time=[
            '00:00', '01:00', '02:00',
            '03:00', '04:00', '05:00',
            '06:00', '07:00', '08:00',
            '09:00', '10:00', '11:00',
            '12:00', '13:00', '14:00',
            '15:00', '16:00', '17:00',
            '18:00', '19:00', '20:00',
            '21:00', '22:00', '23:00',
        ] # hourly data is available

datadir = "I:/ERA5/"

if  not os.path.exists(datadir):
    print('path not exist')
    
    os.makedirs(datadir)
    print('path create')
    
os.chdir(datadir)


area=[latN,lonW,latS,lonE] # North, West, South, East. Default: global
years= np.arange(startYear,endYear+1)
months= np.arange(startMonth,endMonth+1)

c = cdsapi.Client()



dataInfoDict={
    'product_type':'reanalysis',
    'format':'netcdf',
    # 'pressure_level':'',
    'variable':'',
    'year':'',
    'month':'',
    'day':'',
    'area':'',
    'grid':'',
    'time':''
    }


for i in np.arange(0,4,1):
    varname = varnames[i]
    varshort = varshorts[i]

    pp = './'+(varshort)+'/'
    
    if  os.path.exists(pp):
        
        print('yes')
         
        for year in years:
            for month in months:
                month = int(month)
                year  = int(year )
                weekday, daysInMonth= cal.monthrange(year,month)
                days= np.arange(1,daysInMonth+1)
                dayStr = ','.join(str(days[i]).zfill(2) for i in days-1)
                dayList=dayStr.split(',')
                filename = pp+varshort+"_"+str(year)+str(month).zfill(2)+".nc"
                print(filename)
                if not os.path.isfile(filename):
                    dataInfoDict["year"]=int(year)
                    dataInfoDict["month"]=int(month) # convert np.int64 to regular int type
                    # dataInfoDict["pressure_level"]=level # convert np.int64 to regular int type
                    dataInfoDict["variable"]=varname # convert np.int64 to regular int type
                    dataInfoDict["day"] =dayList
                    dataInfoDict["area"]=area
                    dataInfoDict["grid"]=grid
                    dataInfoDict["time"]=time
    
                    print(dataInfoDict)
    
                    c.retrieve(
                      'reanalysis-era5-single-levels',dataInfoDict,filename)
                del days
                del dayList
    else:
       
       os.makedirs(pp)
       
       print(pp+'have created')   
       for year in years:
            for month in months:
                month = int(month)
                year  = int(year )
                weekday, daysInMonth= cal.monthrange(year,month)
                days= np.arange(1,daysInMonth+1)
                dayStr = ','.join(str(days[i]).zfill(2) for i in days-1)
                dayList=dayStr.split(',')
                filename = pp+varshort+"."+str(year)+str(month).zfill(2)+".nc"
                print(filename)
                if not os.path.isfile(filename):
                    dataInfoDict["year"]=int(year)
                    dataInfoDict["month"]=int(month) # convert np.int64 to regular int type
                    # dataInfoDict["pressure_level"]=level # convert np.int64 to regular int type
                    dataInfoDict["variable"]=varname # convert np.int64 to regular int type
                    dataInfoDict["day"] =dayList
                    dataInfoDict["area"]=area
                    dataInfoDict["grid"]=grid
                    dataInfoDict["time"]=time
    
                    print(dataInfoDict)
    
                    c.retrieve(
                       'reanalysis-era5-single-levels',dataInfoDict,filename)
                del days
                del dayList
        
        
quit() 
```