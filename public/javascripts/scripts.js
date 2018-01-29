

// A $( document ).ready() block.
$( document ).ready(function() {

  

    $('.modal').modal();
    console.log( "ready!" );
    $(".button-collapse").sideNav();

    $(".checkpass").mouseover(()=>{
        let pass=$(".pass").val();
        let pass2=$(".pass2").val();
        if(pass!=pass2){
            $("label[for = password2]").removeClass("hide");
            $("label[for = password2]").css("color","#FE3959").text('Passwords do not match');
           let valid = false;

           $(".pass2").focus();

         $("#reg").on('submit',(e)=>{
             e.preventDefault();
         });
        }
        else
        {
            $("#reg").on('submit',(e)=>{
                return true;
            });
            console.log('match')
        }
    })
    
    /*-------DELETE AJAX FUNCTION ----------*/
    $(".delete").click(function(){
        let item_ID=$(this).closest("div").children().filter("input").val();
        let selectedRow=$(this).closest("tr");
        let formDate={
            '_id':item_ID
        };
        console.log(JSON.stringify(formDate));

        $.ajax({
            type:'POST',
         url:'/inventory/item/delete',
         data:JSON.stringify(formDate),
         contentType:'application/json',
         success:function(data){
             console.log('done');
             Materialize.toast('Deletion Successful',5000,'toast-custom');
            selectedRow.remove();
         }
        
    });
});

/*-------SELL AJAX FUNCTION ------*/

$(".sell").click(function(){

    let itemname,quantity,price,_id,sold,total;
    let item_ID=$(this).closest("td").children().filter("input");
    var qOriginal=$(this).closest("tr").children().filter("td.quan");
    var quanOriginal=item_ID.eq(1);

   
    


    itemname=item_ID.eq(0).val();
    quantity=item_ID.eq(1).val();
    price=item_ID.eq(2).val();
    _id=item_ID.eq(3).val();
    sold=item_ID.eq(4).val();
    total=item_ID.eq(5).val();

let formDate={
    '_id':_id,
    'quantity':quantity,
    'sold':sold,
    'name':itemname,
    'total':total,
    'price':price
};


$.ajax({
    type:'POST',
 url:'/inventory/item/update',
 data:JSON.stringify(formDate),
 contentType:'application/json',
 success:function(data){

let temp=qOriginal.text().trim();
let newQuantity=(temp-1);
qOriginal.text(newQuantity);
quanOriginal.val((newQuantity)-1);
Materialize.toast('Sold',5000,'toast-custom');
 }
});

})

    $(".login").click(function(){
       // $(".login").empty();
       if($(".usrname").is(':invalid') || $(".pwd").is(':invalid'))
       {
     return;
       }
       else
       {
    $(".login-text").addClass("hide")
    $(".login>.white-text").addClass("hide");
        $(this).addClass("loader");
       }

       
    })
     console.log($(".sold").text().trim());
     $('.tooltipped').tooltip({delay: 50});
    
});