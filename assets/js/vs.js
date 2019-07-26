var vsPlayers;

require(['jquery'], function() {
  $(document).ready(function () {
    vsPlayers = JSON.parse(localStorage.getItem('vsPlayers'));
    if(vsPlayers == null) {
      vsPlayers = [];
    }
    updateVs();

    $('#players, #team-players, h1').on('click', '.fe-user-plus', function() {
      if(vsPlayers.length == 2) {
        vsPlayers.pop();
      }
      vsPlayers.push($(this).data('name'));
      updateVs();
    });

    $('#vs-wrapper').on('click', '.fa-times', function(e) {
      e.stopPropagation();
      text = $(this).parent().text().trim();
      vsPlayers = $.grep(vsPlayers, function(value) {
        return value != text;
      });
      updateVs();
    });

    $('#vs-select').submit(function(e) {
      e.preventDefault();
      window.location.href = $('#vs-select select').val();
    });

    $('#pvp > div' + window.location.hash).removeClass('d-none');
  });
});

function updateVs() {
  localStorage.setItem('vsPlayers', JSON.stringify(vsPlayers));

  $('#vs-wrapper .vs, #vs-wrapper .vs-status').hide();
  if(vsPlayers.length == 0) {
    $('#vs-player1-default, #vs-player2-default, #vs-status-default').show();
    $('#vs-wrapper .avatar > span').attr('class', 'avatar-status');
  }
  else if(vsPlayers.length == 1) {
    $('#vs-player1-name').text(vsPlayers[0]);
    $('#vs-player1-selected, #vs-player2-default, #vs-status-default').show();
    $('#vs-wrapper .avatar > span').attr('class', 'avatar-status bg-yellow');
  }
  else {
    $('#vs-player1-name').text(vsPlayers[0]);
    $('#vs-player2-name').text(vsPlayers[1]);
    $('#vs-player1-selected, #vs-player2-selected').show();

    path = $.map(vsPlayers.sort(), function(value) {
      return value.toLowerCase().replace(', ', '-');
    });

    url = requirejs.toUrl('') + 'vs/' + path.join('#');
    $.ajax(url).done(
      function(data, status) {
        if(status == 'success' && data.indexOf('id="' + path[1] + '"') != -1) {
          $('#vs-wrapper .avatar > span').attr('class', 'avatar-status bg-green');
          $('#vs-status-view').show().find('a').attr('href', url);
        }
        else {
          $('#vs-wrapper .avatar > span').attr('class', 'avatar-status bg-red');
          $('#vs-status-fail').show();
        }
      }
    );
  }
}
