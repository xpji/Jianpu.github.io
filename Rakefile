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
