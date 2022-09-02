// called from page
function deleteDev(id){
    $.ajax({
        url: '/shop/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

