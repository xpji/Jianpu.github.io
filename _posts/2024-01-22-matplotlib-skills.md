---
layout: post
title: "matplotlib skills"
author: Jianpu
category: Python
tags: [matplotlib]
image: 16.jpg
date: 2024-01-22 20:36
comments: true
---



# matplotlib.pyplot的一些绘图命令技巧

- 设置全局字体

```python
plt.rcParams['font.family'] = 'Times New Roman',
```

- 用来正常显示中文标签


```python

plt.rcParams['font.sans-serif'] = ['SimHei']  

```


- 正常显示负号

```python

plt.rcParams['axes.unicode_minus'] = False  

```

- 设置画布大小,子图一行一列第一个

```python
fig=plt.figure(figsize=(10,6)

ax=fig.add_subplot(111)

```

- 设置左轴的颜色


```python

ax.spines['left'].set_color ('r')

```


- 设置y轴ticklabel颜色，外凸，字体大小，y轴标签颜色

```python

ax.tick_params( axis='y',direction='out', colors='red',
               which='major', 
                    direction='out', 
                    length=5,
                    width=0.59, 
                    pad=5, 
                    labelsize=14,
                    bottom=True, left=True, right=True, top=True
            labelcolor='r',   labelsize=10)
```



- 设置y轴标签显示范围以及间隔

```python

ax.set_yticks(range(160, 320, 20))

```


- 共享x轴
```python

ax2 = ax.twinx()

```


- 反转y轴

```python

ax.invert_yaxis()

```

- 设置x轴的范围

```python

ax.set_xlim(20,32)


```


- 为图片添加标题,并设置标题字体大小，位置，离y轴的距离

```python

ax.set_title('units:mm/day',fontsize=14, loc='right',pad=12)

```

- 保存图片，设置分辨率，保存图片类型

```python

 fig.savefig('my-plot-name.png',format='png',dpi=150)


```



- 自定义x轴标签，并且使得x、y范围的lim，

```python

mon=np.arange(1,13,1)
m=np.array(['01-01','03-01','05-01','07-01','09-01','11-01','12-31'])
fig=plt.figure(figsize=(10,8),dpi=150)
ax=fig.add_subplot(111)
ax.plot(mon,rmse2017*100)
ax.set_xlim(1,12)
ax.set_xticks(np.linspace(1, 12,7))
ax.set_ylim(-5,26)

m=np.array(['01-01','03-01','05-01','07-01','09-01','11-01','12-31'])
ax.set_xticklabels(m)
ax.tick_params(which='major',direction='in', pad=10,labelsize=15,axis='both',bottom=True, left=True, right=False, top=False)
ax.set_ylabel('Rmse/ cm',fontsize=20)
ax.set_xlabel('month/day',fontsize=20)
ax.set_ylim(0.1,0.31)

```




- 使得图像右边和上边没有颜色

```python

ax.spines['right'].set_color('none')
ax.spines['top'].set_color('none')

```


- 使得colorbar放置在图片最下方，并且设置colorbar的字体大小以及放置方向、保存文件的格式

```python

ax=fig.add_axes([0.25,0.05,0.5,0.015])
cb=fig.colorbar(plot,cax=ax,shrink=0.9,orientation='horizontal',pad=0.04,aspect=10)
cb.ax.tick_params(labelsize=10)    
fig.savefig(r'sla_2017_month.png',format='png')
```


- 修改坐标刻度上的数字字体 -只有一幅图的情况

```python

plt.yticks(fontproperties='Times NewRoman',size=16)

```
- 修改坐标刻度上的数字 -有多幅图的情况

```python

ax.set_yticks(np.arange(lowlat+1,upperlat+1),crs=ccrs.PlateCarree())
ylabels=ax.get_yticks()
ax.set_yticklabels(labels=ylabels,fontdict={'family':'Times NewRoman','size':16})

```


- 设置colorbar的单位及字体大小\colorbar的一些细节操作，
```python


cb.ax.tick_params(labelsize=16)  #设置色标刻度字体大小。
font = {'family' : 'serif',
        'color'  : 'darkred',
        'weight' : 'normal',
        'size'   : 16,
        }
cb.set_label('colorbar',fontdict=font) #设置colorbar的标签字体及其大小
cb=fig.colorbar(conf,shrink=1,pad=0.04,aspect=19,
                )
cb.ax.tick_params(which='both',  direction='in', labelsize=14)
cb.ax.set_title('$m/s$',fontsize=14)

```


- 设置子图之间的距离

```python

fig.tight_layout()
plt.subplots_adjust(wspace =0.4, hspace =0.05)

```

- 带横坐标为经度，带有经度单位

```python
ax.xaxis.set_major_formatter(LongitudeFormatter(zero_direction_label =False))
```

- 边框的设置

```python

import numpy as np
import matplotlib.pyplot as plt
y = np.arange(1,10,1)
x = np.arange(1,10,1)
plt.plot(x,y)
#matplotlin.pyplot.grid(b, which, axis, color, linestyle, linewidth， **kwargs)axis轴线、color颜色、linestyle的类型, linewidth的宽度，
plt.grid( color = 'black',linestyle='-.',linewidth = 2)

```

- 设置边框的粗细、颜色，网格线的颜色、线的类型，线的粗细


```python

import numpy as np
import matplotlib.pyplot as plt
y = np.arange(1,10,1)
x = np.arange(1,10,1)
bwith = 2 #边框宽度设置为2
ax = plt.gca()#获取边框
ax.spines['top'].set_color('red')  # 设置上‘脊梁’为红色
ax.spines['right'].set_color('none')  # 设置上‘脊梁’为无色
ax.spines['bottom'].set_linewidth(bwith)
ax.spines['left'].set_linewidth(bwith)
ax.spines['top'].set_linewidth(bwith)
ax.spines['right'].set_linewidth(bwith)
plt.grid( color = 'black',linestyle='-.',linewidth = 1)
plt.plot(x,y)

axs = plt.gca()
axs.spines['right'].set_linewidth(1)
axs.spines['left'].set_linewidth(1)
axs.spines['top'].set_linewidth(1)
axs.spines['bottom'].set_linewidth(1)
ax.set_xticks(np.arange(box[0],box[1]+xstep, xstep))
ax.xaxis.set_major_formatter(LongitudeFormatter(zero_direction_label =False))

ax.invert_yaxis()

ax.tick_params(which='major', 
                    direction='out', 
                    length=6,
                    width=0.99, 
                    pad=5, 
                    labelsize=14,
                    bottom=True, left=True, right=True, top=True)
ax.tick_params(which='minor', 
                    direction='out', 
                    
                    width=0.99, 
               
                    labelsize=14,
                    bottom=True, left=True, right=True, top=True)



# 设置四个边框轴的多个边，加粗

ax4.spines[['right','left','top','bottom']].set_linewidth(1) 

# 设置colorbar色条外面的框的粗细
cb.outline.set_linewidth(0.8)  

# 在有投影的情况下，改粗细
ax.spines[['right','left','top','bottom']].set_linewidth(1.5) 
ax.spines[['right','left','top','bottom']].set_visible(True)   

```

- 坐标轴消失

```python

ax.set_xticks([]) 

```

- 坐标轴的标签不显示

```python

ax.yaxis.set_ticklabels([]) 

```


- 坐标系设置-缩放、对数坐标



```python

#设置y轴坐标系的缩放比例为高度层的形式

ax.set_yscale("symlog")  

```





- 自定义colorbar



```python
import cmaps
from matplotlib.colors import ListedColormap 
import numpy as np
import matplotlib.pyplot as plt
import matplotlib as mpl  
import matplotlib.cm as cm
import matplotlib.colors as mcolors
# rgb=(
#         [ 43,67,255],
#         [ 91,130,255],       
#         [ 255,255,255], 
#         [ 255,255,255],
#         [ 255,190,190],
#         [ 255,142,142],
#         [ 255,122,122],
#         [ 255,97,97],
#         [ 255,49,49],
#         )

rgb=(
     [0,0,255],
     [39,39,255],
     [78,78,255],
     [91,118,255],
     [118,130,255],
     
     [ 255,255,255],
     [ 255,255,255],
     
     [ 255,190,190],
     [ 255,142,142],
     [ 255,122,122],
     [ 255,99,99],
     [ 255,58,58],
     [ 248,19,8],
     [ 153,33,20],
     )
rgb=np.array(rgb)/255.0
newcmap=ListedColormap(rgb) 
bins = [-600,-500,-400,-300,-200,-100,0,100,200,300,400,500,600,800,1000]
nbin = len(bins) - 1
cmap = cm.get_cmap('bwr', nbin)
norm4 = mcolors.BoundaryNorm(bins, nbin)
im4 = cm.ScalarMappable(norm=norm4, cmap=newcmap)

fig=plt.figure(figsize=(10,10),dpi=250)

ax=fig.add_axes()  
cbar4 = fig.colorbar(
    im4, cax=ax, orientation='horizontal',
   
)
ax2=cbar4.ax
ax2.xaxis.set_ticks_position('top')  #将数值刻度移动到上边

ax2.tick_params(which='major',direction='in',
                labelsize=10,top=True,width=1,length=28)

ax2.spines['top'].set_linewidth(5)

ax2.set_title('colormap',fontsize=15,
              fontname="Times New Roman",
              fontweight="bold" )


```











# proplot的一些绘图设置

```python
proj = pplt.Proj('cyl',lon_0=180,)
f, axs = pplt.subplots( ncols=2, nrows=tstep, 
                    figsize=(8,9),
                    # refwidth=1.5,
                       fontsize=14,
                       proj=proj,
                       fontname= 'Times New Roman',
                       )

step = 5
for i in range(tstep):
    

    for j in range(2):
    
        print(i,j)
        # norm = pplt.Norm('diverging')
        m=axs[i,j].contourf(lon, lat, pre[i,j], cmap=cmap,extend='both',
                            levels=np.arange(-30,31),
                            zorder=1,
                            labels=False)
        
        axs[i,j].format(title=time[i,j],titleloc='l',
                  coast=True, 
                     lonlim=(100, 199), 
                        latlim=(-16, 16),
                        # fontsize=14,
                      tickdir='in',
                      fontname= 'Times New Roman',
                      labelpad=7,   #调节xytick的与轴的距离
                      # gridalpha=0.15
                      metalinewidth=1, #设置轴的粗细
                        )
        c2=pplt.scale_luminance('grey', 1)
        axs[i,j].axhline(0, lw=1, ls='--', color=c2)
        
        qiv=axs[i,j].quiver(x_u[::step,::step],y_u[::step,::step],
                            u[i,j][::step,::step],v[i,j][::step,::step]
                            ,pivot='mid',\
                        width=0.002,scale=220,headlength=4,headwidth=4,
          )

axs[:,0].format(latlabels=True,
                # yformatter=LatitudeFormatter(),
                latlines=10,rc_kw={'tick.labelsize':14})
axs[4,:].format(lonlabels=True,
                # xformatter=LongitudeFormatter(zero_direction_label=True),
                lonlines=20,rc_kw={'tick.labelsize':14})
f.colorbar(m, 
           loc='b',
           label='',
           ticks=[-30,-20,-10,0,10,20,30],
           length=0.8,width=0.15,
           labelsize=14,
          

           )

plt.show()



```

# 合并打开多个nc文件的快速技巧

```python
import xarray as xr
ds = xr.open_mfdataset('D:/ERA-Interim/divergence/*divergence.nc')
ds.to_netcdf(r'D:/ERA-Interim/divergence/divergence.nc')
```


# 快速绘图

- lon-lat & level quickly plots

```python


fig = plt.figure(figsize=(10,10),dpi=400)
ax_1 = plt.axes([0.09,0.52,0.4,0.33],projection=projection)  # 左上
ax_2 = plt.axes([0.58,0.52,0.4,0.33],projection=projection)  # 右上 
ax_3 = plt.axes([0.09, 0.16, 0.4, 0.33],)  # 左下
ax_4 = plt.axes([0.58,0.16,0.4,0.33])  # 右下
# cax = plt.axes([0.35,0.06, 0.4,0.015])
set_line(ax_1)
set_line(ax_2)
set_line(ax_3)
set_line(ax_4)
########################################################################
########################################################################
ax_3.plot(cont, level, linewidth=2, c='lightskyblue', linestyle="-", marker='o', markersize=2)
ax_3.axvline(x=0, ymin=0, ymax=100, color="k", linestyle="--")
ax_3.set_xlim(-4, 4)
ax_3.set_ylim(100, 1000)
ax_3.set_yticks([1000, 500,300, 200, 100])
ax_3.set_yticklabels(['1000','500','300','200','100'])
ax_3.invert_yaxis()
ax_3.set_title('(c) Cont', loc='left', fontsize=20, pad=8)
ax_3.set_title('U', loc='right', fontsize=20)

########################################################################
ax_4.plot(band,level,linewidth=2,
          c='lightskyblue',linestyle="-",marker='o',markersize=2)
ax_4.set_ylim(1000,100)
ax_4.axvline(x=0,ymin=0,ymax=100, color="k", linestyle="--")
ax_4.invert_yaxis()
ax_4.set_xlim(-1,1)
ax_4.yaxis.set_ticklabels([])
ax_4.set_title('(d) No_BA',loc='left',fontsize=20,pad=8)
ax_4.set_title('U',loc='right',fontsize=20)
ax_4.yaxis.set_ticklabels([])
########################################################################
ax_1.contourf(lon,lat,cont_u[0],levels=17,cmap =cmaps.BlueWhiteOrangeRed,
              transform=ccrs.PlateCarree())
ax_1.quiver(x_cont[::step,::step],y_cont[::step,::step],
            cont_u[0][::step,::step],
            cont_v[0][::step,::step], transform=ccrs.PlateCarree())
ax_1.set_extent(box,crs=ccrs.PlateCarree())
ax_1.set_xticks(np.arange(box[0],box[1], xstep),crs=ccrs.PlateCarree())
ax_1.set_yticks(np.arange(box[2], box[3], ystep),crs=ccrs.PlateCarree())
lon_formatter = LongitudeFormatter(zero_direction_label=False)#True/False
lat_formatter = LatitudeFormatter()
ax_1.xaxis.set_major_formatter(lon_formatter)
ax_1.yaxis.set_major_formatter(lat_formatter)
ax_1.xaxis.set_major_formatter(LongitudeFormatter(zero_direction_label =False))
ax_1.set_title('(a) Cont',loc='left',fontsize=20)
ax_1.set_title('850hpa U&V',loc='right',fontsize=20)
ax_1.tick_params(which='major', 
                        direction='in', 
                        length=3,
                        width=1, 
                        pad=8, 
                        labelsize=16,
                        
                        bottom=True, left=True, right=True, top=True)
########################################################################
ax_2.contourf(lon,lat,band_u[0],levels=17,cmap =cmaps.BlueWhiteOrangeRed,
              transform=ccrs.PlateCarree())
ax_2.quiver(x_band[::step,::step],y_band[::step,::step],
            band_u[0][::step,::step],
            band_v[0][::step,::step], transform=ccrs.PlateCarree())
ax_2.set_extent(box,crs=ccrs.PlateCarree())
ax_2.set_xticks(np.arange(box[0],box[1], xstep),crs=ccrs.PlateCarree())
ax_2.set_yticks(np.arange(box[2], box[3], ystep),crs=ccrs.PlateCarree())
ax_2.xaxis.set_major_formatter(lon_formatter)
ax_2.yaxis.set_major_formatter(lat_formatter)
ax_2.xaxis.set_major_formatter(LongitudeFormatter(zero_direction_label =False))
ax_2.set_title('(b) No_BA',loc='left',fontsize=20)
ax_2.set_title('850hpa U&V',loc='right',fontsize=20)
ax_2.tick_params(which='major', 
                        direction='in', 
                        length=3,
                        width=1, 
                        pad=8, 
                        labelsize=16,
                        
                        bottom=True, left=True, right=True, top=True)
ax_2.yaxis.set_ticklabels([])


```

