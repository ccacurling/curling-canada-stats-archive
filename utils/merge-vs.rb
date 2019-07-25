#!/usr/bin/env ruby
require 'yaml'
require 'fileutils'

if ARGV.length != 1
  puts "USAGE: merge-vs.rb /path/to/new/vs/"
  exit
end

local_vs = File.expand_path('../_vs/', __dir__)

puts 'Reading ' + ARGV[0] + ':'
Dir.glob(ARGV[0] + '**/*.md') do |new_file|
  filename = new_file.sub(ARGV[0], '')
  puts filename
  new_yaml = YAML.load_file(new_file)

  local_file = local_vs + '/' + filename
  local_dir = File.dirname(local_file)
  unless File.directory?(local_dir)
    FileUtils.mkdir_p(local_dir)
  end

  if File.file?(local_file)
    local_yaml = YAML.load_file(local_file)

    # games
    for new_game in new_yaml['games']
      replaced = false
      local_yaml['games'].each_with_index {
        |local_game, index|
        if local_game['event'] == new_game['event'] && local_game['year'] == new_game['year'] && local_game['draw'] == new_game['draw']
          local_yaml['games'][index] = new_game
          replaced = true
        end
      }
      if !replaced
        local_yaml['games'].push(new_game)
      end
    end

    File.write(local_file, local_yaml.to_yaml + '---')
  else
    FileUtils.cp(new_file, local_file)
  end
end
