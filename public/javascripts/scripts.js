

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
    
    /*-------DELETE FUNCTION ----------*/
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


     

     $(".llogin").on('click',function(){
        
       
       
        console.log('login button clicked');
    });

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

    
});