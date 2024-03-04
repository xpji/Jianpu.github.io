---
layout: post
title: "WRF - add variables in wrfoutput files"
author: Jianpu
categories: WRF
tags: [code]
image: wrf.jpg
date: 2024-03-02 20:15
comments: true
---


# 引言
近日，需要在WRF实际模拟的输出文件中加入/删除绝热加热率项，那么需要如何实现呢？


# 增/删变量

如果是需要删除某些变量，这里提供了以下两个方案：

- 方案1：打开 WRF/Registry/Registry.EM_COMMON file文件，找到你希望删除的变量。通过去掉I/O那一列的 "h",就可以将你不想要的变量去除了。然后保存该文件，返回到WRF的目录下，使用命令：clean -a，然后重新配置和编译。


- 方案2：使用Runtime I/O选项。也就是说在你的namelist.input文件中，先提前创建一个.txt文件，然后在namelist.input文件中调用这个txt文件。具体示例如下所示：

创建两个文件为my_file_d01.txt、my_file_d02.txt,文件内容为如下，如果你要


删除变量则写入：`-:h:0:RAINC,RAINNC`
新增变量则写入：`+:h:0:RAINC,RAINNC`
注意不能由任何的空格。


上述命令解释如下：

```bash
+/- ：添加或者删除变量
0-24 ：整型
i/h ：输入或者历史记录
RAINC ：Registry中的名称（方法1中的文件）
```


在namelist.input中的文件如下所示：
```bash
&time_control
iofields_filename = "my_file_d01.txt", "my_file_d02.txt"
ignore_iofields_warning = .true.,

/
```
一般建议使用第二种方法，避免了重新编译配置的时间浪费。


# 例子
给出一个例子，创建的`my_file_d01.txt`文件中的新增变量：


```bash
+:h:0:RTHCUTEN,RTHRATEN,RTHBLTEN,RTHNDGDTEN,H_DIABATIC
```

