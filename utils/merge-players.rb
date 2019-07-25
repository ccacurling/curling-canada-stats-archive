#!/usr/bin/env ruby
require 'yaml'
require 'fileutils'

if ARGV.length != 1
  puts "USAGE: merge-players.rb /path/to/new/players/"
  exit
end

local_players = File.expand_path('../_players/', __dir__)

puts 'Reading ' + ARGV[0] + ':'
Dir.glob(ARGV[0] + '*.md') do |new_file|
  filename = File.basename(new_file)
  puts filename
  new_yaml = YAML.load_file(new_file)

  local_file = local_players + '/' + filename
  local_yaml = nil
  if File.file?(local_file)
    local_yaml = YAML.load_file(local_file)
  end

  # Merge regular records
  if local_yaml != nil && local_yaml['aka'] == nil && new_yaml['aka'] == nil
    # totals
    for new_total in new_yaml['totals']
      replaced = false
      local_yaml['totals'].each_with_index {
        |local_total, index|
        if local_total['event'] == new_total['event']
          local_yaml['totals'][index] = new_total
          replaced = true
        end
      }
      if !replaced
        local_yaml['totals'].push(new_total)
      end
    end

    # years
    for new_year in new_yaml['years']
      replaced = false
      local_yaml['years'].each_with_index {
        |local_year, index|
        if local_year['event'] == new_year['event'] && local_year['year'] == new_year['year'] && local_year['poisition'] == new_year['position']
          local_yaml['years'][index] = new_year
          replaced = true
        end
      }
      if !replaced
        local_yaml['years'].push(new_year)
      end
    end

    # vs
    if new_yaml['vs'] != nil
      if local_yaml['vs'] == nil
        local_yaml['vs'] = new_yaml['vs']
      else
        local_yaml['vs'] = (local_yaml['vs'] + new_yaml['vs']).uniq
      end
    end

    File.write(local_file, local_yaml.to_yaml + '---')
  # Copy new file, or update AKA record
  elsif local_yaml == nil || (local_yaml['aka'] != nil && new_yaml['aka'] != nil)
    FileUtils.cp(new_file, local_file)
  else
    puts '[ERROR] attempting to merge AKA record with a regular record'
    exit
  end
end
