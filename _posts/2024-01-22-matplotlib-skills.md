---
layout: post
title: "matplotlib skills"
author: Jianpu
category: Python
tags: [matplotlib]
image: python.jpg
date: 2024-01-22 20:36
comments: true
---



# matplotlib.pyplot



## 设置全局字体

```python
plt.rcParams['font.family'] = 'Times New Roman',
```

## 用来正常显示中文标签


```python

plt.rcParams['font.sans-serif'] = ['SimHei']  

```


## 正常显示负号

```python

plt.rcParams['axes.unicode_minus'] = False  

```

## 设置画布大小,子图一行一列第一个

```python
fig=plt.figure(figsize=(10,6)

ax=fig.add_subplot(111)

```

## 设置左轴的颜色


```python

ax.spines['left'].set_color ('r')

```


## 设置y轴ticklabel颜色，外凸，字体大小，y轴标签颜色

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



## 设置y轴标签显示范围以及间隔

```python

ax.set_yticks(range(160, 320, 20))

```


## 共享x轴
```python

ax2 = ax.twinx()

```


## 反转y轴

```python

ax.invert_yaxis()

```

## 设置x轴的范围

```python

ax.set_xlim(20,32)


```


## 为图片添加标题,并设置标题字体大小，位置，离y轴的距离

```python

ax.set_title('units:mm/day',fontsize=14, loc='right',pad=12)

```

- 保存图片，设置分辨率，保存图片类型

```python

 fig.savefig('my-plot-name.png',format='png',dpi=150)


```



## 自定义x轴标签，并且使得x、y范围的lim，

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




## 使得图像右边和上边没有颜色

```python

ax.spines['right'].set_color('none')
ax.spines['top'].set_color('none')

```


## 使得colorbar放置在图片最下方，并且设置colorbar的字体大小以及放置方向、保存文件的格式

```python

ax=fig.add_axes([0.25,0.05,0.5,0.015])
cb=fig.colorbar(plot,cax=ax,shrink=0.9,orientation='horizontal',pad=0.04,aspect=10)
cb.ax.tick_params(labelsize=10)    
fig.savefig(r'sla_2017_month.png',format='png')
```


## 修改坐标刻度上的数字字体 -只有一幅图的情况

```python

plt.yticks(fontproperties='Times NewRoman',size=16)

```
## 修改坐标刻度上的数字 -有多幅图的情况

```python

ax.set_yticks(np.arange(lowlat+1,upperlat+1),crs=ccrs.PlateCarree())
ylabels=ax.get_yticks()
ax.set_yticklabels(labels=ylabels,fontdict={'family':'Times NewRoman','size':16})

```


## 设置colorbar的单位及字体大小\colorbar的一些细节操作，
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


## 设置子图之间的距离

```python

fig.tight_layout()
plt.subplots_adjust(wspace =0.4, hspace =0.05)

```

##  带横坐标为经度，带有经度单位

```python
ax.xaxis.set_major_formatter(LongitudeFormatter(zero_direction_label =False))
```

## 边框的设置

```python

import numpy as np
import matplotlib.pyplot as plt
y = np.arange(1,10,1)
x = np.arange(1,10,1)
plt.plot(x,y)
#matplotlin.pyplot.grid(b, which, axis, color, linestyle, linewidth， **kwargs)axis轴线、color颜色、linestyle的类型, linewidth的宽度，
plt.grid( color = 'black',linestyle='-.',linewidth = 2)

```

## 设置边框的粗细、颜色，网格线的颜色、线的类型，线的粗细


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

## 坐标轴消失

```python

ax.set_xticks([]) 

```

## 坐标轴的标签不显示

```python

ax.yaxis.set_ticklabels([]) 

```


## 坐标系设置-缩放、对数坐标



```python

#设置y轴坐标系的缩放比例为高度层的形式

ax.set_yscale("symlog")  

```





## 自定义colorbar



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











# proplot

## 1、创建画板，非投影转换

```bash
f, axs = pplt.subplots( ncols=1, nrows=1, 
                       yreverse=True,
                       share =1,
                       figsize=(8,6)
                       )
创建一个1x1的子图
ncols代表列
nrows代表行
yreverse=True 表示翻转y轴，与matplotlib.pyplot中的ax.invert_yaxis()作用相同
share=1,2,3,4,False  表示共享横轴、纵轴、colorbar、标题等信息，False表示不共享
figsize ：设置画板的大小，可以根据需要设置，不添加的话是系统默认的格式
```

## 2、创建画板，含投影

```bash
f, ax = pplt.subplots( ncols=1, nrows=1, 
                        axwidth=5,
                        refwidth=2,
                        suptitle='subplot ',
                       # figsize=(5,4),
                       proj='cyl',
                       proj_kw={'lon_0': 180}, lonlim=(100, 200), 
                             latlim=(-20, 20),
                       share=4,
                       )
与matplotlib.pyplot的创建方式的区别，投影可以直接在创建画板时设置。
axwidth ：调节画板的清晰度，可能，没怎么用过
refwidth： 各子图的长宽比
suptitle：各子图的总标题
 proj='cyl', 设置为等间距投影
 proj_kw={'lon_0': 180}, lonlim=(100, 200), 
                             latlim=(-20, 20),
                             表示设置中心经度为180°，地图的经度范围是：100E-200E，
                             纬度范围是：-20S-20N
```


## 3、填色图的命令

```bash
m=ax.contourf(lon,lat,pre,
            colorbar='l',
            cmap = cmap,
            extend='both',
            colors=[ 'blue9','blue6','blue4', 'blue2','blue0',
                        'white','white',
                        'yellow3','yellow6', 'orange7', 'red8','red9'
                        ],
             colorbar_kw={'label': '',
                             'lw':0.5},
            levels = np.linspace(-30,30,31)
            )
基本的命令和matplot.pyplot类似，多了一些额外的功能
colorbar='l' ：设置colorbar的显示位置，可以直接在contourf()里面设置了
extend='both'：设置色标两边的范围为延申形式，没有定死
lw=0.7  ：如果是绘制等值线的话，可以控制线的粗细
colors=[ 'blue9','blue6','blue4', 'blue2','blue0',
                        'white','white',
                        'yellow3','yellow6', 'orange7', 'red8','red9'
                        ],   可以自己构建cmap，用colors就不需要使用cmap了
 colorbar_kw={'label': '',
                             'lw':0.5},  设置colorbar的label以及线的宽度
```


## 4、带有投影的基本细节属性

```bash
ax.format(     title='TD-type disturbance structure ',
                titleloc='l',
                rtitle='Level:850(hPa)',
            
                xformatter=LongitudeFormatter(),
                xlim=(100,200),
                xlabel='lon',
                coast=True, 
                    labels=True,
                grid=True,
              gridlinewidth=0.5,gridalpha=0.2,
              lonlines=20,
              latlines=10,
              rc_kw={'tick.pad': 8}
                )
 title='TD-type disturbance structure ', 设置图的标题，标题的位置
 titleloc='l',
rtitle='Level:850(hPa)', ：设置图右边的标题，
ltitle='850(hPa)'  ：  左边的标题同理
xformatter=LongitudeFormatter(), ：设置x轴的ticklabel为经度的形式
xlim=(100,200),   设置x轴经度显示的范围
xlabel='lon',     设置x轴的标签，为：lon
coast=True,    打开海岸线
labels=True,   打开x轴和y轴的刻度
grid=True,     打开网格线
gridlinewidth=0.5, 设置网格线的宽度
gridalpha=0.2,     设置网格线的透明度
lonlines=20,       设置经度的显示间距
latlines=10,       设置纬度的显示间距
rc_kw={'tick.pad': 8}  设置ticklabel距离tick的间距，但是在投影的图里好像不起作用

```

## 5、没有投影的基本细节属性，普通绘图的基本属性

```bash
axs.format(     title='V(m/s) ',
                titleloc='l',
                rtitle='Level:950-200(hPa)',
                xformatter=LongitudeFormatter(),
                xlim=(100,210),
                xlabel='',
                yticks=pplt.arange(0,40,1),
                grid=True,
                xticks=10,  ## x 间隔
                  xtickminor=True, xgridminor=True,
                  ytickminor=False, ygridminor=True,
                  rc_kw={'geogrid.alpha':0.3},
                  xticks=pplt.arange(0,40,4),
                  fontsize=20,  
                  xlocator=1, xminorlocator=0.5,
                  xrotation=20,
                   yticks=[950, 800,600,500,400,300, 200],
        yscale='symlog',
)

与带投影的起始差不了太多，主要就是关于经纬度坐标的设置有些差别
xticks=10,  ## 设置x轴ticklabel的间隔
xtickminor=True, xgridminor=True,  打开x轴的ticklabel的最小值，以及网格线的最小值
ytickminor=False, ygridminor=True,  这个是设置y轴的
rc_kw={'geogrid.alpha':0.3}  设置网格线的透明度
xticks=pplt.arange(0,40,4),  设置x轴tick的具体范围
fontsize=20,    字体的大小   
 xrotation=20,     xticklabel的旋转的角度
  yticks=[]     设置yticks的具体显示数值
  yscale='symlog',   设置y轴的缩放形式，一般画垂向分布的时候用
```

## 6、绘制普通折线图plot

```bash
ax.plot(x,y,label='dpdy',legend='ur')

label='dpdy',  设置y轴的坐标
legend='ur'    设置图例在右上方，在绘图的时候可以直接设置，

```




## 7、一些其他小技巧

```bash
ax.axvline(x=18, color='grey', linewidth=1.5,linestyle='-.')  
绘制一条垂直线， 颜色为灰色，lw表示线的宽度，ls为线的风格
ax.axhline(y=0, color='grey', linewidth=1.5,linestyle='--') 
绘制一条水平线，
ox = ax.alty(color='blue8', linewidth=1)
lns2=ox.plot(x,dm2,color='blue8',
              label=r'$-V \cdot \nabla P$')
共用x轴，绘制一条折线
ox2 = ax.twinx( yloc=('axes', 1.05),  color='green4', linewidth=1)
lns3=ox2.plot(x,dm3*10**11,color='green4', 
              label=r'$-\omega \frac{\partial P}{\partial p}$',)
还是共享x轴绘制一条折线，但是这个y轴不在图上
lns = lns1+lns2+lns3+lns4
labs = [l.get_label() for l in lns]
ax.legend(lns, labs,loc='ul',ncols=2, center=False, frame=True)
将共享同一条x轴的折线的y轴的图例画在同一个框内，不然就是四个不同的图例了

ax.bar(x,datay.T*10**11,
       0.2,
       cycle=['c','blue','red6'],
        label=['MRG','TD','TC'],
        edgecolor='grey',
        legend='ul',
         colorbar_kw={'frameon': False}
  color=np.where(y>0,'tomato','tab:blue'), #判断大于0的为红色，负的为蓝色
          )
将三个不同的数据的柱形图画在同一个子图上，
三个柱形图的颜色不同，名称也不同，图例的位置为左上角


ax.text(9,0.85,'MRG',bbox=True,bordercolor='w',
        borderstyle='miter', 
        bboxcolor='w', 
        bboxstyle='square', bboxalpha=0.5, )
在图上添加text ，设置边缘颜色等

 axs[i,j].scatter(lon_center[i,j],875,marker='v',
                         markersize=150,
                         c='red9',
                         alpha=0.8,
                         zorder=2)
  绘制散度图的一些命令


ax.format()
可以用来设置全局的坐标属性等，如果存在子图的画，也可以指定某个子图设置属性
```
## 8、循环绘制多子图（带有投影）

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


# 快速绘图模板

## lon-lat & level quickly plots

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

# pandas库的一些使用教程

## 1、读取xlsx文件

- pd.read_excel(path)
  - 在次之前你需要按照pandas 、openpxl 、xlrd

## 2、去掉nan值

```python
df = pd.read_excel(path)
df = df.dropna()
```

## 3、取出符合条件的数据

```python
df = df[(df['TEMP'] > -50) & (df['TEMP'] < 50)]
```

## 4、将时间为object格式的数据转换为datatime64  

**2016-01-24 23:00:00**

- 下述命令还会生成一个新的columns名称为：datatime

```python
df['datetime'] = pd.to_datetime(df['TIME'])
```

## 5、计算两个数据的直接的差值

- **diff(-1)** : 使用当前时刻的值减去后一个时刻的值。

- 直接**diff()**，是计算当前时刻与前一个时刻的差

```python
df['temp_grad']=df['TEMP'].diff()
```

## 6、去掉某一列的所有值

```python
df = df.drop(columns='temp_gradient')
```

## 7、找到符合条件的数据，对应的索引

```python
index = np.where((df['TEMP'] < 4) & (df['temp_grad'] <=-10))
```

## 8、按照指定的一列进行分类

```python
for name, group in df.groupby(['STNM']):

     print(name,group)
```

# Ai 快捷键学习



## 1、Ait + 鼠标滚轮

实现页面的放大和缩小

## 2、空格+鼠标左键

抓手工具

## 3、ctrl + r

调出标尺，可以通过标尺来对其图片

## 4、ctrl + ； 

隐藏标尺

## 5、ctrl + ‘

调用网格标尺

再按一次就是取削

## 6、ctrl +shift+z

反向撤回

## 7、tab

快速全屏

## 8、ctsl+s / ctrl+shift+s

保存

