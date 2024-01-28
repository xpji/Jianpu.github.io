---
layout: post
title: "Netcdf install"
author: Jianpu
categories: linux
tags: [netcdf install]
image: 28.jpg
date: 2024-02-04 13:46
comments: true
---


## 前言

新的netcdf版本，将netcdf分为两部分：

- `netcdf-c`
- `netcdf-fortran`

最近，在学院服务器集群上尝试了netcdf4.2.1.1版本的编译过程，在此分享记录一下编译安装过程。

## 编译环境

根据学院集群安装的编译器，通过which 命令查看是否安装`icc、ifort` 

如果成功安装，则需要将下面的代码需要提前写在根目录下的`.bashrc` 文件中

```python
export CC=icc
export CXX=icpc
export FC=ifort
```

## 安装包

安装netcdf 需要有一些依赖的包，所以需要先提前准备


！需要注意的是！
不同版本的不同依赖的包，可能会导致netcdf编译的失败，下面给出经过我测试可以成功编译的各个包的版本
！

需要准备的安装包以及版本如下：

```python
1) zlib-1.2.8
2) hdf5-1.8.9
3) netcdf-4.2.1.1
4) netcdf-fortran-4.2

下面几个是安装WRF需要的依赖
# 5) libpng-1.6.34
# 6) jasper-1.900.1
# 7) mpich-3.2
```

将上述几个安装文件上传到服务器上，下面进行编译过程：

## 编译

如图所示，我将在根目录下建立了一个名为`Libraries`的文件夹，里面放了所有的压缩包：

```bash
/home/Libraries/
```

![image.png](https://s2.loli.net/2024/01/28/Kdny8mcqhTX1C7O.png)

使用cd命令，切换到`Libraries`文件夹下，进行各个包的编译过程

## zlib

 - 解压包

```bash
tar -zxvf zlib-1.2.8.tar.gz
```

- 切换路径到解压后的文件夹下：

```bash
cd zlib-1.2.8/
```

- 进行编译准备，通过prefix指定安装路径，以及文件夹名称：

```bash
./configure --prefix=/home/Libraries/zlib_1.2.8/  
```

需要注意到是指定的安装路径的名称与解压的名称并不同：

- 解压后的路径是：`zlib-1.2.8/`
- 指定安装的路径是：`zlib_1.2.8/`  
- 下面其他的编译过程同理


下面开始编译：

```bash
make > Make.log                                                                     # The log files are useful for debugging if any compilation errors arise.
make check > Make_Check.log
make install > Make_Install.log
```

如果没有显示明显的报错的话表示编译成功！下面就进行其他包的安装编译：

## HDF5

下面步骤类似，不再赘述

```bash
cd ..
tar -zxvf hdf5-1.8.9.tar.gz
cd hdf5-1.8.9/
./configure --with-zlib=/home/Libraries/Libraries/zlib_1.2.8/ --prefix=/home/Libraries/Libraries/hdf5_1.8.9/ 
make > Make.log
make check > Make_Check.log
make install > Make_Install.log
```

- 需要注意的是hdf5的`./configure、make、make check、make install`这几个过程比较就，可能好几分钟，需要耐心等待。
- 在`./configure、make、make check、make install`这几个步骤中，只要最后没有出现`Error`，就表明成功，如果出现`Error`则说明有问题，需要检测问题，重新运行这几个步骤！

##  LIBPNG

```bash
cd ..
tar -zxvf libpng-1.6.34.tar.gz
cd libpng-1.6.34/
./configure --prefix=/home/Libraries/libpng_1.6.34/
make > Make.log
make check > Make_Check.log
make install > Make_Install.log
```

## NETCDF

```bash
cd ..
tar -zxvf netcdf-4.2.1.1.tar.gz
cd netcdf-4.2.1.1/
./configure --prefix=/home/Libraries/netcdf_4.2.1.1/ --enable-netcdf-4 --enable-largefile --disable-dap
make > Make.log
make check > Make_Check.log
make install > Make_Install.log
```

## NETCDF-FORTRAN

```bash
cd ..
tar -zxvf netcdf-fortran-4.2.tar.gz
cd netcdf-fortran-4.2
./configure --prefix=/home/Libraries/netcdf_4.2.1.1/ --disable-fortran-type-check 
make > Make.log
make check > Make_Check.log
make install > Make_Install.log
```

- 上述过程安装成功后，输入
- nc-config --all 命令，可以查看netcdf是否安装成功

![image.png](https://s2.loli.net/2024/01/28/JSva2Z3xy4rpGun.png)

## JASPER

```bash
cd ..
tar -zxvf jasper-1.900.1.tar.gz 
cd jasper-1.900.1/
./configure --prefix=/home/Libraries/jasper_1.900.1/
make > Make.log
make check > Make_Check.log
make install > Make_Install.log
```

## MPICH

```bash
cd ..
tar -zxvf mpich-3.2.1.tar.gz
cd mpich-3.2.1/
./configure --prefix=/home/Libraries/mpich_3.2.1/
make > Make.log
make check > Make_Check.log
make install > Make_Install.log
```

- 这一步编译过程也比较长


## 配置环境变量

在netcdf安装完成后，为了在之后的WRF编译过程，使得WRF能够找到netcdf的位置，需要在`.bashrc`中进行环境设置，这样每次登录服务器就能自动定位了。

在`.bashrc`中加入以下代码：

```bash
## NETCDF
export NETCDF=/gpfs/home/xialu/Libraries/netcdf_4.2.1.1/
export PATH=$NETCDF/bin:$PATH
export LD_LIBRARY_PATH=$NETCDF/lib:$LD_LIBRARY_PATH

## MPI
export MPI=/gpfs/home/xialu/Libraries/mpich_3.2.1/
export PATH=$MPI/bin:$PATH
export LD_LIBRARY_PATH=$MPI/lib:$LD_LIBRARY_PATH

## JASPER
export JASPERLIB=/gpfs/home/xialu/Libraries/jasper_1.900.1/lib/
export JASPERINC=/gpfs/home/xialu/Libraries/jasper_1.900.1/include/

## WRF
export WRFIO_NCD_LARGE_FILE_SUPPORT=1
ulimit -s unlimited
```

保存退出之后，使用`source ~/.bashrc`命令，自此全部过程完成！



安装包下载链接如下：

https://density.lanzouj.com/b01800mjg

密码:f8f4