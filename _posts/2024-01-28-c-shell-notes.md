---
layout: post
title: "c shell notes"
author: Jianpu
categories: linux
tags: [c-shell]
image: 31.jpg
date: 2024-01-28 15:34
comments: true
---
​	
# 	基础总结

## 1）定义变量

- 1、通过set来定义局部变量x，通过$x或者${x}来使用，$%x 表示变量的值的长度，$?x来判断变量x是否设置，如果设置则为1，否则为0

```shell
set x = 5
echo $x
echo ${x}kg
echo $%x 
```

- 全局变量的定义setenv v value 该变量将被此shell派生的所有子shell继承。

- $$表示当前进程的PID， $status 或 $? 表示退出状态。

## 2）定义数组



- 定义数组myarr, 通过$myarr[index]来访问数组中的值，注意index是从1开始的。通过$myarr或$myarr[*]来访问数组所有的元素。通过$#myarr来查看元素的个数。
- （）中加空格，索引myarr[2]的时候就是一个，不然就是两个

```shell
set myarr = (str1, str2,str3)
echo $myarr[2]
echo $myarr
echo $myarr[*]
```

## **3）命令替换**

通过set x = `cmd`来执行命令，且结果赋值给变量。

```shell
set d = `date`
echo $d
echo $d[6]-$d[2]-$d[3]
```




## **4)命令行参数**

通过$argv[1],$argv[2]或$1,$2来访问命令行参数。命令行参数的个数为$#argv。

## **5）文件名扩展的元字符**

只能使用?,*,[abc],[a-c]。

## **6）IO重定向和管道**

将命令的输出重定向到文件为>。
将命令的输出重定向并追加到文件为>>。
将命令的输入重定向到文件为<。
将命令的报错信息重定向到一个文件(cmd>/dev/tty)>&errors。
将命令的输出和错误输出分别重定向(cmd > goodstuff) >& badstuff。

将命令的输出和报错信息重定向到一个文件cmd>&file。
将命令的输出经管道发往另一个命令cmd|cmd.
将命令的输出和报错信息经管道发往另一个命令cmd|&cmd。
条件语句为 cmd && cmd 或 cmd || cmd。
command<<WORD 表示将command的输入重定向为从第一个WORD处开始，到下一个WORD处之间的内容（即here文档）。



## **7）从键盘读取并保存到变量中**

```shell
set var = $<
```



## **8)算术**

```shell
@ var = 5 + 5
echo $var
@ v2 = $var + 3
echo $v2
```



## **9) label 和 goto**

csh中没有函数的概念，使用类似windows批处理中的label和goto。

```shell
goto label
......
label:
....

```



## **10) if/else/switch/case**

```shell
if(expression)then
 commands
endif
 

if {(command)} then
 commands
endif
 

if(expression) then
 commands
else if(expression) then
 commands
else
 commands
endif
 

switch("$value")
case pattern1:
 commands
 breaksw
case pattern2:
 commands
 breaksw
default:
 commands
 breaksw
endsw
```

## 11）**while/foreach**

```shell
while(expression)
 commands
 continue
 break
end

foreach var (wordlist)
 commands
end
```

## 12）repeat

repeat表示重复执行后面的命令。

```shell
repeat 3 echo "helloworld"
```

## 13）**csh中设置环境变量PATH的方法**

csh中使用path代替PATH，设置类似于数组的使用。

```shell
set path = ($path /home)
echo $path
echo $PATH
```

## 14)用`可以将一条命令包裹起来

```shell
set ret=`pwd` 

echo ${ret}
```



# 条件语句





#  cshell 命令语法

## 1.if / then / else

```shell
   if (expr) then 
        commands 
     else if (expr2) then 
        commands 
     else 
        commands 
     endif
     
     Example:

     #!/bin/csh
     if ($#argv == 0) then  
        echo "No number to classify"  
     else if ($#argv > 0) then  
        set number = $argv[1]  
        if ($number < 0) then  
           @ class = 0  
        else if (0 <= $number && $number < 100) then  
           @ class = 1  
        else if (100 <= $number && $number < 200) then  
           @ class = 2  
        else  
           @ class = 3  
        endif
        echo The number $number is in class $class
     endif  
     
```

## 2.foreach / end

- Syntax:

- ```shell
      foreach name (wordlist)
          commands
      end
      
  ```

- Example:

- ```shell
      #!/bin/csh
      foreach color (red orange yellow green blue)
         echo $color
      end
  ```

## 3.while / end

- Syntax:

- ```shell
      while (expression)
          commands
      end
      
  ```

- Example:

- ```shell
      #!/bin/csh
      set word = "anything"
      while ($word != "")
        echo -n "Enter a word to check (Return to exit): "
        set word = $<
        if ($word != "") grep $word /usr/share/dict/words
      end
  ```

## 4.break

- Syntax:

- ```shell
      break
      
  ```

- Example:

- ```shell
      #!/bin/csh
      foreach number (one two three exit four)
        if ($number == exit) then
          echo reached an exit
          break
        endif
        echo $number
      end
  ```



- Syntax:

- ```
      continue
      
  ```

- Example:

- ```shell
      #!/bin/csh
      foreach number (one two three exit four)
        if ($number == exit) then
          echo reached an exit
          continue
        endif
        echo $number
      end
      
  ```

5.goto

### Goto 语句将控制权转移到以 label 开头的语句:

- Syntax:

- ```
      goto label
      
  ```

- Example:

- ```shell
      #!/bin/csh
      if ($#argv != 1) goto error1
      if ($argv[1] < 6) goto error2
      goto OK
    
      error1:
        echo "Invalid - wrong number or no arguments"
        echo "Quitting"
        exit 1
    
      error2:
        echo "Invalid argument - must be greater than 5"
        echo "Quitting"
        exit 1
    
      OK:
        echo "Argument = $argv[1]"
        exit 1
  ```



## 6.单引号与双引号表示不同的作用

单引号: 

- 允许包含空格，

- 防止变量替换，

- 允许生成文件名

双引号: 

- 允许包含空格

- 允许变量替换

- 允许生成文件名

- ```shell
      #!/bin/csh
      set opt=-l
      set x1='ls $opt'
      echo $x1
      set x2="ls $opt"
      echo $x2
    
  Will produce the output:
       ls $opt
       ls -l
       
  ```

## 7.存储命令的输出

- 通过反引号（ESC下面那个）进行特殊命令的存储，并且通过索引进行调用

- Syntax:

- ```
      set variable = `command` 
      
  ```

- Example:

- ```shell
      #!/bin/csh
      set date_fields=`date`
      echo $date_fields
      echo $date_fields[1]
      echo $date_fields[2]
      foreach field(`date`)
        echo $field
      end
    
  Sample output:
       Thu Mar 9 22:25:45 HST 1995
       Thu
       Mar
       Thu
       Mar
       9
       22:25:45
       HST
       1995
  ```

### 8.读取用户输入

```shell
 set variable = $<
          - or -
 set variable = `head -1`
```

然后就需要用户自己在命令行输入对应的数组

- ```shell
  #!/bin/csh
      echo -n Input your value: 
      set input = $<
      echo You entered: $input
    
              - or -
    
   #!/bin/csh
      echo -n Input your value: 
      set input = `head -1`
      echo You entered: $input
      
  ```









## 设置一个数组名为ages，赋予变量(0 0 0 0 0)

```shell
$ set ages = (0 0 0 0 0) 
```

## 将ages中的第二个数值定义为15

```shell
$ @ ages[2] = 15
```

## 将ages中的第三个数值定义为第二个数值加上4

```shell
 $ @ ages[3] = ( $ages[2] + 4 ) 
```

## 输出这个数组第三个数值

```shell
$ echo $ages[3] 
```

## 输出数组的所有结果

```shell
$ echo $ages
```

## c shell 循环语句:If语句

```shell
If Example: 
#!/bin/csh -f 
# Set class depending on argument value 
set number = $argv[1] 
if ($number < 0) then 
	@ class = 0 else 
if ($number >= 0 && $number < 100) then 
	@ class = 1 
else if ($number >= 100 && $number < 200) then 
	@ class = 2 
else 
	@ class = 3 
endif 
echo The number $number is in class $class 
```

## c shell 循环语句:switch语句	

```shell
#!/bin/csh -f 
switch (string variable) 
	case pattern: 
		commands
		breaksw
	case pattern: 
		commands
		breaksw
	:
	default:
		commands
		breaksw
endsw
```

## c shell 循环语句:while语句	

```shell
@ limit = $argv[1] 

@ index = 1 

@ sum = 0 

while ($index <= $limit) 

	@ sum += $index 

	@ index++ 

end 

echo The sum is $sum  
```

-------------------------

定义一个变量，使用命令：

```shell
set var1=a3 		#sets var1's value to a3.
set var2=(a b c) 	# sets the array variable var2 to a b, and c.
```

通过在变量名前面键入美元符号($)来使用变量。如果变量是一个数组，则可以使用括号[]指定下标，并且可以使用 $# var2格式获取元素的数量

要分配计算值，使用@命令如下:

```shell
@var = $a + $x * $z
```

## 对比bash&cshell

Bourne shell

```bash
#!/bin/sh
i=2
j=1
while [ $j -le 10 ]
do
   echo '2 **' $j = $i
   i=`expr $i '*' 2`
   j=`expr $j + 1`
done
#!/bin/sh
if [ $days -gt 365 ]
then
   echo This is over a year.
fi
#!/bin/sh
for i in d*
do
   case $i in
      d?) echo $i is short ;;
      *) echo $i is long ;;
   esac
done
```

C shell

```shell
#!/bin/csh
set i = 2
set j = 1
while ( $j <= 10 )
   echo '2 **' $j = $i
   @ i *= 2
   @ j++
end
#!/bin/csh
if ( $days > 365 ) then
   echo This is over a year.
endif
#!/bin/csh
foreach i ( d* )
   switch ( $i )
      case d?:
         echo $i is short
         breaksw
      default:
         echo $i is long
   endsw
end
```