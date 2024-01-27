---
layout: post
title: "Rakefile with post"
author: Jianpu
categories: jekyll
tags: [rake]
image: 17.jpg
date: 2024-01-23 19:22
comments: true
---


#  快捷编写博客blog 模板

基于jekyll 使用Ruby语言编写Rake任务，用于创建新的博客文章。

## 安装Rake Gem

如果你没有安装Rake gem，使用以下命令进行安装：
```bash

gem install rake

```


## 创建Rakefile文件

```bash

require 'rake'
require 'yaml'

SOURCE = "."
CONFIG = {
  'posts' => File.join(SOURCE, "_posts"),
  'post_ext' => "md",
}

# Usage: rake post title="A Title" image="13.jpg" category="WRF" tags="tag1, tag2"
desc "Begin a new post in #{CONFIG['posts']}"
task :post do
  abort("rake aborted: '#{CONFIG['posts']}' directory not found.") unless FileTest.directory?(CONFIG['posts'])
  title = ENV["title"] || "new-post"
  slug = title.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')
  filename = File.join(CONFIG['posts'], "#{Time.now.strftime('%Y-%m-%d')}-#{slug}.#{CONFIG['post_ext']}")
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end

  image = ENV["image"] || "default-image.jpg"
  category = ENV["category"] || "uncategorized"
  creation_date = Time.now.strftime('%Y-%m-%d %H:%M')
  tags = ENV["tags"] || "tag1, tag2"  # Set default tags or leave it empty

  puts "Creating new post: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "layout: post"
    post.puts "title: \"#{title.gsub(/-/,' ')}\""
    post.puts "author: Jianpu"
    post.puts "categories: #{category}"
    post.puts "tags: [#{tags}]"
    post.puts "image: #{image}"
    post.puts "date: #{creation_date}"
    post.puts "comments: true"
    post.puts "---"
  end
end # task :post


```

将以上提供的代码保存到一个名为 Rakefile 的文件中。确保文件名为大写的 "Rakefile"，以便 Rake 正确识别它。



## 设置博客文章信息

打开终端或命令提示符，并导航到包含 Rakefile 的目录。然后，运行以下命令来创建一个新的博客文章：

```bash

rake post title="Your Title" image="your-image.jpg" category="Your Category" tags="rake"

```

运行上述命令后，会在_posts 文件夹下新建对应的文件，以日期和标题为文件名。


这里文章的layout大致如下所示，可以根据自己需要自行更改：

```bash
---
layout: post
title: "Rakefile with post"
author: Jianpu
categories: jekyll
tags: [tag1, tag2]
image: 17.jpg
date: 2024-01-23 19:22
comments: true
---
```

其中，image对应的图片存储在\assets\img 下

# 给网站添加访客地图

## 输入网站

打开 clustrmaps.com 输入你的网站

![image.png](E:/picgo/imga_copy/N9MOdToY8IyEhbx.png)


## 注册账户

如果没有注册过的，需要注册账户

![image.png](E:/picgo/imga_copy/EXd1HKYLvicWP34.png)

## 选择需要的地图类型


![image.png](E:/picgo/imga_copy/SAzFsK3X8iGceNp.png)


根据喜好自由选择上述地图类型



## 部署地图到你的网页

如果你选择的是第一种 Map widget，会得到如下代码，选择你的footer.html 进行放置。也可以自定义放置在任意位置

![image.png](E:/picgo/imga_copy/MBZNTV4hbtfOgJX.png)



## 查看部署情况

部署后，再次点开clustrmaps.com ，可以检查自己的部署情况

![image.png](E:/picgo/imga_copy/PDsy7qwkQCO2Fxi.png)