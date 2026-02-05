require(['jquery'], function() {
    $.getJSON('/index/players.json').done(function(data) {
        window.players = data.players;

        // Search
        require(['lunr'], function(lunr) {
            window.idx = lunr(function() {
                this.ref('id');
                this.field('name');

                var idx = this;
                $.each(data.players, function(i, player) {
                    idx.add({"id": player.id, "name": player.name});
                });
            });
        });

        // Tables
        require(['datatables-bs4'], function() {
            $('.datatable#team-players, .datatable#player').DataTable();
            $('.datatable#players').DataTable({
                "data": data.players,
                "deferRender": true,
                "columns": [
                    {"data": function(row,type,val,meta){return 'aka' in row ? "" : '<i class="fe fe-user-plus" data-name="' + row['name-sort'] + '" title="Select this player for head-to-head comparison"></i>'}},
                    {"data": function(row,type,val,meta){return 'aka' in row ? row['name-sort'] + ' <button class="btn btn-info btn-sm" data-toggle="tooltip" data-placement="top" title="" data-original-title="See ' + row.aka + '">AKA</button>' : '<a href="/players/' + row.id + '">' + row['name-sort'] + '</a>'}},
                    {"data": function(row,type,val,meta){return 'aka' in row ? "" : row.event},
                     "render": function(data,type,row){
                        if('aka' in row && type === 'filter') {return window.players.filter(p => p['name-sort'] === row.aka).map(p => p.event).join('|')}
                        return data },
                    },
                    {"data": function(row,type,val,meta){return 'aka' in row ? "" : row.stats[0]}},
                    {"data": function(row,type,val,meta){return 'aka' in row ? "" : row.stats[1]}},
                    {"data": function(row,type,val,meta){return 'aka' in row ? "" : row.stats[2]}},
                    {"data": function(row,type,val,meta){return 'aka' in row ? "" : row.stats[3]}},
                    {"data": function(row,type,val,meta){return 'aka' in row ? "" : row.stats[4]}},
                    {"data": function(row,type,val,meta){return 'aka' in row ? "" : row.stats[5]}},
                    {"data": function(row,type,val,meta){return 'aka' in row ? "" : row.stats[6]}},
                    {"data": function(row,type,val,meta){return 'aka' in row ? "" : row.stats[7]}},
                    {"data": function(row,type,val,meta){return 'aka' in row ? "" : row.stats[8]}},
                    {"data": function(row,type,val,meta){return 'aka' in row ? "" : row.stats[9]}},
                    {"data": function(row,type,val,meta){return 'aka' in row ? "" : row.stats[10]}},
                    {"data": function(row,type,val,meta){return 'aka' in row ? "" : row.stats[11]}},
                    {"data": function(row,type,val,meta){return 'aka' in row ? "" : row.stats[12]}}
                ]
            });
        });
    });

    $(document).ready(function () {
        $('.header input[type=search]').keyup(function() {
            var query = $(this).val();
            var results = $('#search-results');
            if (query.length < 2) {
                results.hide();
                return;
            }
            results.show();
            results.children('a').remove();
            var players = window.idx.search(query);

            // if no results are found, and it's a simple query, try automatically adding a wildcard
            if(players.length == 0 && /^[a-zA-Z]+$/.test(query)) {
                query += '*';
                players = window.idx.search(query);
            }
            if(players.length > 0) {
                $('#search-results-none').hide();
                players.forEach(function(player) {
                    var id = player.ref;
                    results.append('<a class="dropdown-item" href="/players/' + id + '">' + window.players.find(p => p.id === id).name + '</a>');
                });
            }
            else {
                $('#search-results-none').show();
            }
        });

        $('#players').on('click', 'td button', function() {
            $(this).tooltip('hide');
            $('#players').DataTable().search($(this).data('original-title').replace('See ', '')).draw();
        });
    });
});
