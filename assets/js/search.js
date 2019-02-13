require(['lunr'], function(lunr) {
  $(document).ready(function () {

    $.getJSON('/players.json').done(function(data) {
      window.players = data;
      window.idx = lunr(function() {
        this.ref('id');
        this.field('name');

        var idx = this;
        $.each(data, function(key, value) {
          idx.add($.extend({"id": key}, value));
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
      if(players.length > 0) {
        $('#search-results-none').hide();
        players.forEach(function(player) {
          var id = player.ref;
          results.append('<a class="dropdown-item" href="/players/' + id + '">' + window.players[id].name + '</a>');
        });
      }
      else {
        $('#search-results-none').show();
      }
    });
  });
});
