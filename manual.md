## 修改显示的封面：

在 Jianpu.github.io\_layouts\home.html 中可以修改，主要显示的图片

## 修改对应小标题如blog的页面显示内容

在 _layouts\blog.html 进行修改

## 本地预览博客
```bash
bundle exec jekyll serve

```
## 修改主页上research跳转后的封面显示
在_layouts\research.html 添加相关内容


## 创建一个新的分类

切记需要在文件夹内添加一个markdown的模板，如果你添加的子分类为research，markdown模块内容如下所示:


需要在menu 目录下新建对应的md文件，比如，这里新建一个category分栏，md文件内容如下所示：
```bash
---
layout: category
title: Categories
permalink: /category
---
```

此外，需要在layouts文件夹下新建对应的category.html




## 分支管理

拉取最新分支
```bash
git pull origin master

```

记得更好分支的名称为自己的想要拉取的

如果 Git 自动合并没有冲突，你将在本地仓库中看到最新的更改。如果有冲突，Git 将会提示你解决冲突。手动解决冲突后，使用以下命令继续合并：
```bash
git add .

git commit -m "解决合并冲突"

```
将本地更改推送到 GitHub：

```bash
git push origin master

```

如果你想要强制覆盖本地更改，可以使用以下命令：
```bash

git fetch origin
git reset --hard origin/master

```


那么，如果你想取削合并呢，使用以下命令：


```bash
git merge --abort

```

或者，如果你是使用 `git pull` 进行合并的，你可以尝试：


```bash
git pull --abort
```

执行以下命令，确保你的分支已回到正常状态：
```bash
git status

```

# 快速新建blog

```bash

rake post title="Your Title" image="your-image.jpg" category="Your Category" tags="tag1,tag2"


```
