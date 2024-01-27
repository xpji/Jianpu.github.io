require 'rake'
require 'yaml'
require 'stringex'

SOURCE = "."
CONFIG = {
  'posts' => File.join(SOURCE, "_posts"),
  'post_ext' => "md",
}

# Usage: rake post title="A Title" image="13.jpg" category="WRF" tags="tag1, tag2"
desc "开始一个新的博文在 #{CONFIG['posts']}"
task :post do
  abort("rake 中止: '#{CONFIG['posts']}' 目录未找到.") unless FileTest.directory?(CONFIG['posts'])
  title = ENV["title"] || "新文章"
  slug = title.to_url
  filename = File.join(CONFIG['posts'], "#{Time.now.strftime('%Y-%m-%d')}-#{slug}.#{CONFIG['post_ext']}")
  if File.exist?(filename)
    abort("rake 中止!") if ask("#{filename} 已存在. 您想要覆盖吗?", ['y', 'n']) == 'n'
  end

  image = ENV["image"] || "默认图片.jpg"
  category = ENV["category"] || "未分类"
  creation_date = Time.now.strftime('%Y-%m-%d %H:%M')
  tags = ENV["tags"] || "标签1, 标签2"  # 设置默认标签或留空

  puts "创建新的博文: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "layout: post"
    post.puts "title: \"#{title}\""
    post.puts "author: Jianpu"
    post.puts "categories: #{category}"
    post.puts "tags: [#{tags}]"
    post.puts "image: #{image}"
    post.puts "date: #{creation_date}"
    post.puts "comments: true"
    post.puts "---"
  end
end # task :post
