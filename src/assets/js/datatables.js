require(['datatables-bs4'], function() {
    $(document).ready(function () {
        $('.datatable').DataTable();

        $('#players').on('click', 'td button', function() {
          $(this).tooltip('hide');
          $('#players').DataTable().search($(this).data('original-title').replace('See ', '')).draw();
        });
    });
});
