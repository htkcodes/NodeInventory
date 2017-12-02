// A $( document ).ready() block.
/* jshint esversion: 6 */
$( document ).ready(function() {

    
  $('.tap-target').tapTarget('open');
  $('.tap-target').tapTarget('close');

    var orderlist=[];
    let totaldue=0;
    var counter=0;
    var ordercombined="";
    $("tbody > tr").on("mouseover",function(){
        var listorder= $(this).attr('class');
        console.log(listorder + 'consumer');
        $(this).unbind('mouseover');
        $("."+listorder).find("button.add").click(function(){
            var name=$("."+listorder).find("td.itemname").text();
          
            console.log(name);
           if(orderlist.indexOf(name)!==-1)
           {
               console.log("already there");  
           }
           else
           {
            
             orderlist.push(name);
             var tot=$("."+listorder).find("td.price").text();
             tot=tot.replace('$','');
             tot=Number(tot);
            // console.log(tot);
             totaldue+=tot;
             let list=$(".orders");
             let parent=list.parent();
             list.empty().each(function(){
              for(let x of orderlist)
              {
              
                  $(this).append('<li>'+x+'</li>');
                  if(x===orderlist.length-1){
                      $(this).appendTo(parent);
                  }
              }
              console.log(orderlist);
             })
            
           }
           for(let i of orderlist)
           {
             ordercombined+=i;
           }
           ordercombined=ordercombined.split(' ').filter(function(item,i,allItems){
            return i===allItems.indexOf(item);
        }).join(' ');
         
           console.log("Current total" + totaldue);
           $(".tot").html(totaldue);
           console.log(ordercombined + "Combined");
           $(".ordernames").val(ordercombined);
           $(".tot").val(totaldue);
        })
        
    })
  
});