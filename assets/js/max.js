require(['jquery'], function() {
  $(document).ready(function () {
    var i = 1;

    while (i < $('#player tbody tr:first-child td').length) {
      var ar = $('#player tbody tr').map(function() {
        return Number($(this).find('td:nth-child(' + (i + 3) + ')').text());
      });

      var max = Math.max.apply(null, ar);

      var ar = $('#player tbody tr').find('td:nth-child(' + (i + 3) + ')').each(function() {
        if (Number($(this).text()) == max) {
          $(this).addClass('font-weight-bold');
        }
      });

      i++;
    }
  });
});
