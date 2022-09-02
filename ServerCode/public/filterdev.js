// Called from page moves url to new page
function filterGameByDev(){
    var dev_id = document.getElementById('dev_filter').value
    console.log(dev_id);
    if( dev_id != 0){
    window.location = '/shop/filter/' + parseInt(dev_id);
    }else{
        window.location ='/shop';
    }
}
