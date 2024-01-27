---
layout: post
title: "translate .adf to .tiff or .shp"
author: Jianpu
categories: tools
tags: [gdal]
image: 18.jpg
date: 2024-01-26 10:52
comments: true
---


# How to convert .adf format files into .tiff format or .shp format 

- 如何将后缀为adf的文件转换为.tiff格式或者.shp格式文件

- 以下过程建议是在linux系统或者WSL子系统上进行

## install gdal packages  - 安装gdal包

具体安装方法详情请见links：[how to install gdal](https://mothergeo-py.readthedocs.io/en/latest/development/how-to/gdal-ubuntu-pkg.html)

这里以在conda 下安装为例，确保已经安装好了conda后，使用以下命令：

```bash

conda install conda-forge::gdal


```

## convert adf to tif  - 将 adf 格式转换为 tif 格式

gdal安装完成后，在命令行输入gdal ，然后双击两次`tab`按键，会得到相关的命令

通过以下命令进行adf向tiff的转换

```bash

gdal_translate -projwin 113 22.5 113.5 21.85 -of GTiff  "inputfile.adf"   "outputfile.tif"


```

- `projwin 113 22.5 113.5 21.85`: 这个参数指定了裁剪窗口的地理坐标范围。具体来说，这里的坐标是经度（Longitude）和纬度（Latitude）的值，表示裁剪窗口的左上角和右下角的位置。在这个例子中，左上角的经度为113，纬度为22.5，右下角的经度为113.5，纬度为21.85。去掉该参数表示对整个数据进行转换。

- `-of GTiff`: 这个参数指定了输出文件的格式。在这里，GTiff 表示输出文件将使用GeoTIFF格式

- `inputfile.adf`: 这是输入文件的路径和文件名

- `outputfile.tif`:这是输出文件的路径和文件名。


## convert tif to shp  - 将tif格式转换为shp格式


   
```bash

gdal_polygonize.py "input.tif" -f "ESRI Shapefile" "output.shp"


```

该命令用于将栅格数据转换为矢量形式。



`input.tif`: 这是输入文件的路径和文件名。在这个例子中，输入文件是名为 input.tif 的GeoTIFF文件，它包含栅格数据。

`-f "ESRI Shapefile"`: 这个参数指定了输出文件的格式。在这里，ESRI Shapefile 表示输出文件将使用ESRI Shapefile格式保存。

`"output.shp"`: 这是输出文件的路径和文件名。在这个例子中，输出文件将被命名为 output.shp，它将是一个Shapefile文件，包含了栅格数据转换后的矢量多边形。




## Use shell script for batch conversion  - 使用shell 脚本进行批量转换

```bash
#!/bin/bash

for file in /gd2/*.adf; do
    output=$(basename "$file" .adf)_out.tif
    output2=$(basename "$file" .adf)_out.shp
    gdal_translate -projwin 113 22.5 113.5 21.85 -of GTiff  "$file"   "/gd2/slice_region/$output"
    gdal_polygonize.py "/gd2/slice_region/$output" -f "ESRI Shapefile" "/gd2/slice_region/$output2"
done


```
-  转换为shp可能需要等待比较长的时间，转换出的文件也会比较大。


![image.png](https://s2.loli.net/2024/01/27/dKzqomQP4NsujV5.png)


# how to convert netcdf format to tif format  - 如何将 netcdf  转换为 tif 格式


```bash

gdalwarp -of netcdf -t_srs EPSG:4326 input.tif output.nc


```

将输入的栅格数据文件 input.tif 进行投影变换，将其投影到经纬度坐标系（WGS84），并将重投影后的数据保存为NetCDF格式的文件 output.nc。\



# Extracts specified variables from an input NetCDF file and exports it as a single-layer GeoTIFF file

从一个输入的NetCDF文件中提取指定的变量，并将其导出为单层的GeoTIFF文件。同时，它还通过使用NetCDF文件中的经度和纬度数组生成地理控制点（GCPs），然后利用这些GCPs对图像进行重投影，最终输出一个经纬度（WGS84投影）的GeoTIFF文件。

```python
"""
Create a single layer tif in WGS84 projection from
NEODAAS (https://www.neodaas.ac.uk/) netCDF files in mercator projection.
Converts the location array to GCPs and uses these to warp the image with
GDAL.
Dan Clewley (dac@pml.ac.uk).
2018-11-12
"""

import argparse
import os
import shutil
import tempfile

import netCDF4
from osgeo import gdal

# The geolocation grid in the netCDF file contains a location for
# each pixel. This is often more than GDAL will handle as GCPs so set
# a resampling factor to reduce.
GEOLOCATION_GRID_RESAMPLING = 50

def create_single_var_tiff(input_netcdf, output_tif, variable):
    """
    Export netCDF as a single variable GeoTiff
    """
    # Create single variable tif from input netCDF
    in_ds = gdal.Open('NETCDF:"{}":{}'.format(input_netcdf, variable), gdal.GA_ReadOnly)
    gdal.Translate(output_tif, in_ds)
    in_ds = None

if __name__ == "__main__":

    parser = argparse.ArgumentParser(description="Reproject NetCDF")
    parser.add_argument("innetcdf", nargs=1, type=str,
                        help="Input netCDF file")
    parser.add_argument("outfile", nargs=1, type=str,
                        help="Output file (.tif)")
    parser.add_argument("--variable", required=True,
                        help="Variable from netCDF to extract (e.g., CHL_OC4ME)")
    args = parser.parse_args()

    # Make temporary directory
    temp_dir = tempfile.mkdtemp(prefix="netcdf_convert_")
    temp_tif = os.path.join(temp_dir, os.path.basename(args.innetcdf[0]))

    # Export a single layer as a geotiff
    create_single_var_tiff(args.innetcdf[0], temp_tif, args.variable)

    # Open new geotiff to add GCPs to
    data = gdal.Open(temp_tif, gdal.GA_Update)

    # Open input netCDF
    data_nc = netCDF4.Dataset(args.innetcdf[0])

    gcp_list = []

    # Go through longitude and latitude arrays and convert to GCPs
    for x in range(1, data_nc.variables['longitude'].size, GEOLOCATION_GRID_RESAMPLING):
        for y in range(1, data_nc.variables['latitude'].size, GEOLOCATION_GRID_RESAMPLING):
            gcp_list.append(gdal.GCP(float(data_nc.variables['longitude'][x]),
                                     float(data_nc.variables['latitude'][y]), 0,
                                     x, y))

    # Add GCPs to tif. Set projection is None to ignore it
    data.SetGCPs(gcp_list, None)

    # Warp file based on GCPs
    gdal.Warp(args.outfile[0], data, dstSRS='EPSG:4326', format='GTiff')

    # Close files
    data = None
    data_nc = None

    # Remove temporary directory
    shutil.rmtree(temp_dir)

```

- 导入所需的库：代码使用了`argparse、os、shutil、tempfile、netCDF4`和`gdal`库，用于命令行参数解析、文件操作、临时文件处理、NetCDF文件处理和地理数据处理等。

- 1GEOLOCATION_GRID_RESAMPLING1：这是一个常量，用于指定从NetCDF文件中提取地理坐标数据时的采样率。在循环中，每隔一定间隔采样地理坐标点。

- `1`create_single_var_tiff`1` 函数：这个函数负责从给定的NetCDF文件中提取指定变量，并将其保存为GeoTIFF格式的文件。

- `if __name__ == "__main__":`：这是Python代码的入口点，用于检查脚本是否直接运行。

- `argparse`` 解析命令行参数，包括输入NetCDF文件、输出文件名、以及要提取的变量名称。

- 创建临时目录，用于存储临时生成的GeoTIFF文件。

- `create_single_var_tiff` 函数被调用，将输入的NetCDF文件中指定的变量提取出来，并保存为GeoTIFF格式的文件。

- 打开新生成的`1`GeoTIFF`文件，并将NetCDF文件中的经度和纬度数组转换为地理控制点（GCPs）。

- 使用 `gdal.Warp`函数，基于生成的GCPs对图像进行重投影，输出一个经纬度（WGS84投影）的GeoTIFF文件。

- 清理临时文件和临时目录。




---
Reference
>  Converts the location array to GCPs and uses these to warp the image with
GDAL.: https://gist.github.com/danclewley/018584ea4283c4fdb1cae70fb58a56b5

> GDAL data model: https://headfirst-gdal.readthedocs.io/en/latest/gdal-data-model.html


