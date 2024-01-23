---
layout: post
title:  "WRF install with Intel!"
author: "Jianpu"
date:   2024-01-20 13:38
category: WRF
tags: [WRF]
image: 11.jpg
views: 0
comments: true
---
**Add something similar to .bashrc
\*Note you will need to modify the paths for your specific environment.
\*Note this includes a setting to the path for “DIR.” This is just for the sake of simplifying installation.**

```
export PATH=.:/*full-path-to-netcdf-directory*/netcdf/bin:/*full-path-to-libs-directory/*bin:${PATH}
export LD_LIBRARY_PATH=/*full-path-to-libs-directory*/libs/lib:/*full-path-to-libs-directory*/libs/netcdf/lib:/*full-path-to-libs-directory*/libs/grib2/lib
export JASPERLIB=/*full-path-to-libs-directory*/libs/grib2/lib
export JASPERINC=/*full-path-to-libs-directory*/libs/grib2/include
export NETCDF=/*full-path-to-netcdf-directory*/netcdf

export DIR=/*full-path-to-libs-directory*/libs
export CC=icc
export CXX=icpc
export CFLAGS='-O3 -xHost -ip -no-prec-div -static-intel'
export CXXFLAGS='-O3 -xHost -ip -no-prec-div -static-intel'
export F77=ifort
export FC=ifort
export F90=ifort
export FFLAGS='-O3 -xHost -ip -no-prec-div -static-intel'
export CPP='icc -E'
export CXXCPP='icpc -E'
export LDFLAGS="-L/*full-path-to-libs-directory*/libs/lib -L/*full-path-to-libs-directory*/libs/netcdf/lib -L/*full-path-to-libs-directory*/libs/grib2/lib"
export CPPFLAGS="-I/*full-path-to-libs-directory*/libs/include -I/*full-path-to-libs-directory*/libs/netcdf/include -I/*full-path-to-libs-directory*/libs/grib2/include"
```

Source the .bashrc file

```
source .bashrc
```

Make a directory to install all the libraries.

```
mkdir libs
```

**mpich**





```
wget https://www2.mmm.ucar.edu/wrf/OnLineTutorial/compile_tutorial/tar_files/mpich-3.0.4.tar.gz
tar -xf mpich-3.0.4.tar.gz
cd mpich-3.0.4
./configure --prefix=$DIR
make 2>&1
make install
cd ..
rm -rf mpich*
```



**zlib**





```
wget https://www2.mmm.ucar.edu/people/duda/files/mpas/sources/zlib-1.2.11.tar.gz
tar xzvf zlib-1.2.11.tar.gz
cd zlib-1.2.11
./configure --prefix=$DIR/grib2
make -j 4
make install
cd ..
rm -rf zlib*
```



**HDF5**





```
wget https://www2.mmm.ucar.edu/people/duda/files/mpas/sources/hdf5-1.10.5.tar.bz2
tar -xf hdf5-1.10.5.tar.bz2
cd hdf5-1.10.5
./configure --prefix=$DIR --with-zlib=$DIR/grib2 --enable-fortran --enable-shared
make -j 4
make install
cd ..
rm -rf hdf5*
```



**NetCDF-c**





```
wget https://github.com/Unidata/netcdf-c/archive/v4.7.2.tar.gz
tar -xf v4.7.2.tar.gz
cd netcdf-c-4.7.2
./configure --enable-shared --enable-netcdf4 --disable-filter-testing --disable-dap --prefix=$DIR/netcdf
make -j 4
make install
cd ..
rm -rf v4.7.2.tar.gz netcdf-c*
```



**netcdf-fortran**





```
export LIBS=”-lnetcdf -lhdf5_hl -lhdf5 -lz”
wget https://github.com/Unidata/netcdf-fortran/archive/v4.5.2.tar.gz
tar -xf v4.5.2.tar.gz
cd netcdf-fortran-4.5.2
./configure --enable-shared --prefix=$DIR/netcdf
make -j 4
make install
cd ..
rm -rf netcdf-fortran* v4.5.2.tar.gz
```



**libpng**





```
wget https://www2.mmm.ucar.edu/wrf/OnLineTutorial/compile_tutorial/tar_files/libpng-1.2.50.tar.gz
tar xzvf libpng-1.2.50.tar.gz
cd libpng-1.2.50
./configure --prefix=$DIR/grib2
make -j 4
make install
cd ..
rm -rf libpng*
```


**jasper**





```
wget https://www2.mmm.ucar.edu/wrf/OnLineTutorial/compile_tutorial/tar_files/jasper-1.900.1.tar.gz
tar xzvf jasper-1.900.1.tar.gz
cd jasper-1.900.1
./configure --prefix=$DIR/grib2
make -j 4
make install
cd ..
rm -rf jasper*
```


**WRF**





```
git clone --recurse-submodule https://github.com/wrf-model/WRF.git
cd WRF
./configure (choose options 15 and 1)
./compile em_real -j 4 >& log.compile
```


**WPS**





```
git clone https://github.com/wrf-model/WPS.git
cd WPS
export WRF_DIR=path-to-WRF-top-level-directory/WRF
./configure (choose option 17)
./compile >& log.compile
```

---

https://forum.mmm.ucar.edu/threads/full-wrf-and-wps-installation-example-intel.15229/

