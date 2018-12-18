require(['jquery'], function() {
  $(document).ready(function () {    
    $('#search').keyup(function() {
      alert($(this).val());
    });
  });
});
