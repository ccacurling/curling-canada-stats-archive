#!/usr/bin/env ruby
require 'yaml'
require 'fileutils'

if ARGV.length != 1
  puts "USAGE: merge-vs.rb /path/to/new/vs/"
  exit
end

local_vs = File.expand_path('../_vs/', __dir__)

puts 'Reading ' + ARGV[0] + ':'
Dir.glob(ARGV[0] + '*.md') do |new_file|
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

    for new_vs in new_yaml['vs']
      vs_found = false
      local_yaml['vs'].each_with_index {
        |local_vs, vs_index|
        if new_vs['name'] == local_vs['name']
          vs_found = true

          # vs record found
          # loop through totals
          for new_total in new_vs['totals']
            replaced = false
            local_vs['totals'].each_with_index {
              |local_total, total_index|
              if local_total['event'] == new_total['event'] && local_total['year'] == new_total['year']
                local_vs['totals'][total_index] = new_total
                replaced = true
              end
            }
            if !replaced
              local_vs['totals'].push(new_total)
            end
          end

          # loop through games
          for new_game in new_vs['games']
            replaced = false
            local_vs['games'].each_with_index {
              |local_game, game_index|
              if local_game['event'] == new_game['event'] && local_game['year'] == new_game['year'] && local_game['draw'] == new_game['draw']
                local_vs['games'][game_index] = new_game
                replaced = true
              end
            }
            if !replaced
              local_vs['games'].push(new_game)
            end
          end

        end
      }
      if vs_found == false
        local_yaml['vs'].push(new_vs)
      end
    end

    File.write(local_file, local_yaml.to_yaml + '---')
  else
    FileUtils.cp(new_file, local_file)
  end
end
