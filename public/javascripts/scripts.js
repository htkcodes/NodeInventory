

// A $( document ).ready() block.
$( document ).ready(function() {
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

    $(".biglist > div").on("mouseover",function(){
        var listorder= $(this).attr('class');
        $("."+listorder).find("button").click(function(e){
            e.preventDefault();
            var name=$(this).parent().find("input").attr('class');
            console.log(name);
            var iName=$("."+name).val();
            console.log(iName);
     
            var formDate={
             '_id':iName
         };
         console.log(JSON.stringify(formDate));
        $.ajax({
         type:'POST',
         url:'http://localhost:3000/inventory/item/delete',
         data:JSON.stringify(formDate),
         contentType:'application/json',
         success:function(data){
           // $(iName).parent().remove();
            console.log('here');
         }
     })
    })
     })

});