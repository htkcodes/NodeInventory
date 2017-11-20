



$( document ).ready(function() {




    $("table").on("click","tbody>tr",function(event){
        var listorder= $(this).attr('class');
        console.log(listorder)
       
       // $("table").unbind("mouseover");
        $("."+listorder).find("button.sell").click(function(e){
           
            var ask=confirm('Are you sure you want to confirm?');
            if(ask)
            {
            console.log('reached')
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
         url:'/users/pending_confirm',
         data:JSON.stringify(formDate),
         contentType:'application/json',
         success:function(data){
        Materialize.toast('Successful',3000);
        $("."+listorder).remove();
         }
     })
    }
    else if(!ask){
        Materialize.toast('Deletion Cancelled',3000);
    }
    
    });
    
     });
    
 
     (function updatePending(){
        $.ajax({
            type: "get",
            async:true,
            url: "/users/pending_confirm",
            success: function (response) {
              let result=$(response).find(".lul>tr");
              console.log(result)
             $("tbody").html(result);
             setTimeout(updatePending,5000);
            },
            error:function(e)
            {
                console.log(e)
            }
        })
    })(); 

});







