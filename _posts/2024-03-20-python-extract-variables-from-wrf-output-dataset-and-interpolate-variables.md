---
layout: post
title: "Python - Extract variables from WRF output dataset and interpolate variables."
author: Jianpu
categories: Python
tags: [code]
image: python.jpg
date: 2024-03-06 15:18
comments: true
---

The provided code is a Python script designed to extract variables from WRF (Weather Research and Forecasting) output files, interpolate them to specific pressure levels, and save them to a NetCDF file.


```bash
Function Definitions:

open_dataset: Opens a WRF output dataset using the netCDF4.Dataset class.

extract_variables: Extracts variables from the WRF output dataset based on the provided list of variable names. It uses the getvar function from the wrf module to extract variables like U-wind, V-wind, specific humidity, temperature, etc.

interpolate_variables: Interpolates the extracted variables to specific pressure levels using the interplevel function from the wrf module.

cal_dxdy: Calculates grid deltas (dx and dy) and retrieves latitude, longitude, and pressure levels from the WRF output file.

save_netcdf: Saves the extracted and interpolated variables to a NetCDF file. It accepts the path to save the file, variable names, time stamps, interpolated variable lists, latitude, and longitude coordinates.

```

Main Program:

- Defines paths for input data and the output NetCDF file.

- Initializes lists for time stamps and variable lists.

- Calls cal_dxdy to retrieve latitude, longitude, and pressure levels.

- Iterates through WRF output files, extracts and interpolates variables, and appends them to the 
respective lists.

- Calls save_netcdf to save the variables to a NetCDF file.


---
Code as following :

```python

# -*- coding: utf-8 -*-
"""
Created on %(date)s

@author: %(Jianpu)s

Email: Xianpu_JI2024@outlook.com

introduction : keep learning althongh walk slowly
"""

import xarray as xr
import numpy as np
import pandas as pd
import glob 
import os  
from netCDF4 import Dataset
from wrf import getvar, interplevel, latlon_coords
import metpy.calc as mpcalc




def open_dataset(path):
    """
    Open a WRF output dataset.

    Args:
    path (str): Path to WRF output file.

    Returns:
    xr.Dataset: WRF output dataset.
    """
    return Dataset(path)

def extract_variables(ncfile, variables_to_extract):
    """
    Extract variables from WRF output dataset.

    Args:
    ncfile (xr.Dataset): WRF output dataset.
    variables_to_extract (list): List of variable names to extract.

    Returns:
    tuple: Tuple containing time stamp and extracted variables.
    """
    time = str(getvar(ncfile, "times").data)[:19]
    extracted_vars = []
    for var_name in variables_to_extract:
        if var_name == "ua":
            extracted_vars.append(getvar(ncfile, "ua", units="m s-1"))
        elif var_name == "va":
            extracted_vars.append(getvar(ncfile, "va", units="m s-1"))
        elif var_name == "wa":
            extracted_vars.append(getvar(ncfile, "wa", units="m s-1"))
        elif var_name == "sh":
            extracted_vars.append(mpcalc.specific_humidity_from_mixing_ratio(getvar(ncfile, 'QVAPOR')))
        elif var_name == "tem":
            extracted_vars.append(getvar(ncfile, 'temp'))
        else:
            # Add more conditions for additional variables
            extracted_vars.append(getvar(ncfile, var_name))
        
        
    return time, extracted_vars


def interpolate_variables(variables, p):
    """
    Interpolate variables.

    Args:
    variables (list): List of extracted variables.
    p (xr.DataArray): Pressure levels.

    Returns:
    list: List containing interpolated variables.
    """
    interpolated_vars = []
    level = np.array([100,125,150,175,200,225,250,300,350,400,450,500,550,600,650,700,750,
                        775,800,825,850,875,900,925,950,975,1000])
    plevs = level[::-1]
    for var in variables:
        lats, lons = latlon_coords(var)
        lon = lons.data
        lon[lon < 0] += 360
      
        interpolated_var = interplevel(var, p, plevs).data
        interpolated_vars.append(interpolated_var)
    
    return interpolated_vars


def  cal_dxdy(file):
    """
    Calculate grid deltas (dx and dy) and retrieve latitude, longitude, and pressure levels.

    Args:
    file (str): Path to WRF output file.

    Returns:
    tuple: Tuple containing latitude, longitude, dx, dy, and pressure levels.
    """
    ncfile = Dataset(file)
    P = getvar(ncfile, "pressure")
    lats, lons = latlon_coords(P)
    lon = lons[0]
    lon[lon<=0]=lon[lon<=0]+360
    lat = lats[:,0]
    dx, dy = mpcalc.lat_lon_grid_deltas(lon.data, lat.data)
    return lon,lat,dx,dy,P


def save_netcdf(save_nc_path, variable_names   ,time_list, variable_lists, lat, lon):
    """
    Save variables to a NetCDF file.

    Args:
    save_nc_path (str): Path to save the NetCDF file.
    time_list (list): List of time stamps.
    variable_lists (list): List of lists containing extracted and interpolated variables.
    lat (xr.DataArray): Latitude coordinates.
    lon (xr.DataArray): Longitude coordinates.
    """
  # Add more variable names as needed
    
    data_vars = {}
    for i, var_name in enumerate(variable_names):
        data_vars[var_name] = (['time', 'level', 'lat', 'lon'], variable_lists[i])

    da_nc = xr.Dataset(
        data_vars=data_vars,
        coords={
            'time': time_list,
            'level': np.flip(np.array([100,125,150,175,200,225,250,300,350,400,450,500,550,600,
                                        650,700,750,775,800,825,850,875,900,925,950,975,1000])),
            'lat': lat.data,
            'lon': lon.data,
        },
        attrs=dict(
            description="Extracted and interpolated variables from WRF output",
            units='m/s, K, gram/kilogram',   # modify as needed
        ),
    )
    da_nc.to_netcdf(save_nc_path)
    print('NetCDF has been output')
    return da_nc
###################################################################################
##
##               main program
##
###################################################################################
input_data_path = ''
save_nc_path  = ''  

files = sorted(glob.glob(os.path.join(input_data_path, 'wrfout*'))) 

variables_to_extract    = ["ua", "va", "wa", "QVAPOR", "temp"]  # Add more variable names as needed
variable_names          = ["ua", "va", "wa", "sh", "tem"]       # Add suitable names compare with variable as needed

time_list, variable_lists = [], [[] for _ in range(len(variables_to_extract))]

lon, lat, _, _,p = cal_dxdy(files[0])

for file in files[0:3]:
    print(file)
    ncfile = open_dataset(file)
    time, extracted_vars = extract_variables(ncfile, variables_to_extract)
    
    interpolated_vars = interpolate_variables(extracted_vars, p)
    time_list.append(pd.to_datetime(time))
    for i, var_data in enumerate(interpolated_vars):
        variable_lists[i].append(var_data)
    
save_netcdf(save_nc_path, variable_names , time_list, variable_lists, lat, lon)
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
```