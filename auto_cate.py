import os
import re

def collect_categories(posts_dir):
    categories = set()

    # 遍历 _posts 目录下的所有文件
    for root, dirs, files in os.walk(posts_dir):
        for file in files:
            if file.endswith(".md"):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # 使用正则表达式匹配 category 或 categories
                    match = re.search(r'(category|categories):\s*([\w,]+)', content, re.IGNORECASE)
                    if match:
                        # 将匹配到的分类添加到集合中
                        categories.update(match.group(2).split(','))

    return categories

def create_category_files(category_dir, categories):
    # 创建 category 目录
    os.makedirs(category_dir, exist_ok=True)

    # 遍历每个分类，创建同名的 .html 文件
    for category in categories:
        file_path = os.path.join(category_dir, f"{category.lower()}.html")
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(f"---\nlayout: category\ntitle: {category}\ncategory: {category.lower()}\n---\n")

if __name__ == "__main__":
    # 指定 _posts 目录路径
    posts_directory = "_posts"

    # 获取所有分类
    all_categories = collect_categories(posts_directory)

    # 指定存放分类文件的目录路径
    category_directory = "category"

    # 创建分类文件
    create_category_files(category_directory, all_categories)

    print("分类文件创建完成。")
