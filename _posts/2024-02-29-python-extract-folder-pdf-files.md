---
layout: post
title: "Python-Extract folder pdf files~"
author: Jianpu
categories: Python
tags: [code,tools]
image: python.jpg
date: 2024-02-29 21:06
comments: true
---


- 将目标文件夹内所有pdf文件移动到另一个文件夹下


```python

# -*- coding: utf-8 -*-
"""
Created on %(date)s

@author: %(Jianpu)s

Email: Xianpu_JI2024@outlook.com

introduction : keep learning althongh walk slowly
"""

import xarray as xr
import os,glob
import numpy as np
import cartopy.feature as cfeature
from cartopy.mpl.ticker import LongitudeFormatter,LatitudeFormatter
import cmaps
import matplotlib.pyplot as plt
import cartopy.crs as ccrs
import matplotlib.ticker as mticker
import shutil



def find_and_move_pdfs(source_dir, dest_dir):
    # 创建目标文件夹
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)

    # 遍历源文件夹及其子目录
    for root, dirs, files in os.walk(source_dir):
        for file in files:
            if file.endswith('.pdf'):
                # 源文件的完整路径
                source_file_path = os.path.join(root, file)
                # 目标文件的完整路径
                dest_file_path = os.path.join(dest_dir, file)

                # 将文件移动到目标文件夹
                shutil.move(source_file_path, dest_file_path)
                print(f"Moved {source_file_path} to {dest_file_path}")

if __name__ == "__main__":
    # 源目录
    source_directory = "M:/paper/files"
    # 目标目录
    destination_directory = "M:/paper_for_academic/"

    find_and_move_pdfs(source_directory, destination_directory)


```