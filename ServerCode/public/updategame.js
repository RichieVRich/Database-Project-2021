
// Send data to server to use for sql
function updatevg(id){
    $.ajax({
        url: '/game/' + id,
        type: 'PUT',
        data: $('#update-games').serialize(),
        success: function(result){
            window.location.replace("./");
        }



    })
};
