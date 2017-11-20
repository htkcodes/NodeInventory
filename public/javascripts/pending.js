



$( document ).ready(function() {




    $("table").on("click","tbody>tr",function(event){
        var listorder= $(this).attr('class');
        console.log(listorder)
      /*   $("."+listorder).find("button.sell").click(function(e){
            e.stopPropagation();
        }) */
       // $("table").unbind("mouseover");
        $("."+listorder).find("button.sell").click(function(e){
            
            e.stopPropagation();
            var itemname=$(this).parent().find("input:nth-child(1)").val();
            //let re=new RegExp(itemname,'gi');
            if(/\s/.test(itemname))
            {
                let split=itemname.split(" ");
               
                split.shift();
                console.log(split);

                for(let i of split)
                {
                    var itemid=$(".secondary > tr >td:contains('"+i+"')").parent();
                    var objectid=$(itemid).find("td>form>input[name=_id]").val();
                    console.log(objectid);
                    var quanup=$(itemid).find("td>form>input[name=quantity]").val();
                    console.log(quanup);
                    var nameof=$(itemid).find("td>form>input[name=itemname]").val();
                    console.log(nameof);
                    var price=$(itemid).find("td>form>input[name=price]").val();
                    console.log(price);
                    var soldup=$(itemid).find("td>form>input[name=sold]").val();
                    console.log(soldup);
                    var total=$(itemid).find("td>form>input[name=total]").val();
                    console.log(total);
                    var ask=true;
                    if(ask)
                    {
                        
                    console.log('reached')
                    e.preventDefault();
                    var name=$(this).parent().find("input:nth-child(2)").attr('class');
                    console.log(name);
                    var iName=$("."+name).val();
                    console.log(iName);
        
                    var updateForm={
                        'name':nameof,
                        'quantity':quanup,
                        'price':price,
                        '_id':objectid,
                        'sold':soldup,
                        'total':total,
                    }
                   
                     var formDate={
                        '_id':iName
                    };
             
                 console.log(JSON.stringify(formDate));
                 console.log(JSON.stringify(updateForm));
                 $.ajax({
                    type: "POST",
                    url: "/inventory/item/update",
                    data:JSON.stringify(updateForm),
                    contentType:'application/json',
                    success: function (response) {
                        Materialize.toast('Done',3000)
                        $.ajax({
                            type:'POST',
                            url:'/users/pending_confirm',
                            data:JSON.stringify(formDate),
                            contentType:'application/json',
                            success:function(data){
                           Materialize.toast('Successful',3000);
                           $("."+listorder).remove();
                            }
                        }) ;
                    },
                    error:function(e)
                    {
                        console.log(e)
                    }
                }); 
              
            }
            else if(!ask){
                Materialize.toast('Deletion Cancelled',3000);
            }
                }
            }
            else{
                var itemid=$(".secondary > tr >td:contains('"+itemname+"')").parent();
                console.log(itemid);
                var objectid=$(itemid).find("td>form>input[name=_id]").val();
                console.log(objectid);
                var quanup=$(itemid).find("td>form>input[name=quantity]").val();
                console.log(quanup);
                var nameof=$(itemid).find("td>form>input[name=itemname]").val();
                console.log(nameof);
                var price=$(itemid).find("td>form>input[name=price]").val();
                console.log(price);
                var soldup=$(itemid).find("td>form>input[name=sold]").val();
                console.log(soldup);
                var total=$(itemid).find("td>form>input[name=total]").val();
                console.log(total);
                 var ask=confirm('Are you sure you want to confirm?');
                 if(ask)
                 {
                 console.log('reached')
                 e.preventDefault();
                 var name=$(this).parent().find("input:nth-child(2)").attr('class');
                 console.log(name);
                 var iName=$("."+name).val();
                 console.log(iName);
     
                 var updateForm={
                     'name':nameof,
                     'quantity':quanup,
                     'price':price,
                     '_id':objectid,
                     'sold':soldup,
                     'total':total,
                 }
                
                  var formDate={
                     '_id':iName
                 };
          
              console.log(JSON.stringify(formDate));
              console.log(JSON.stringify(updateForm));
              $.ajax({
                 type: "POST",
                 url: "/inventory/item/update",
                 data:JSON.stringify(updateForm),
                 contentType:'application/json',
                 success: function (response) {
                     Materialize.toast('Done',3000)
                     $.ajax({
                         type:'POST',
                         url:'/users/pending_confirm',
                         data:JSON.stringify(formDate),
                         contentType:'application/json',
                         success:function(data){
                        Materialize.toast('Successful',3000);
                        $("."+listorder).remove();
                         }
                     }) ;
                 },
                 error:function(e)
                 {
                     console.log(e)
                 }
             }); 
           
         }
         else if(!ask){
             Materialize.toast('Deletion Cancelled',3000);
         }
         
            }
           
            
    });
    //$("."+listorder).find("button.sell").trigger('click');
    
     });
    
 
     (function updatePending(){
        $.ajax({
            type: "get",
            async:true,
            url: "/users/pending_confirm",
            success: function (response) {
              let result=$(response).find(".table-body>tr");
              console.log(result)
             $("tbody.table-body").html(result);
             setTimeout(updatePending,5000);
            },
            error:function(e)
            {
                console.log(e)
            }
        })
    })(); 

});







