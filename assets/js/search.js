require(['lunr'], function(lunr) {
  $(document).ready(function () {

    $.getJSON('/index/players.json').done(function(data) {
      window.players = data.players;
      window.idx = lunr(function() {
        this.ref('id');
        this.field('name');

        var idx = this;
        $.each(data.players, function(i, player) {
          idx.add({"id": player.id, "name": player.name});
        });
      });
    });

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
  });
});
