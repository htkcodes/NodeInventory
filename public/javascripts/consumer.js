// A $( document ).ready() block.
$( document ).ready(function() {
    var orderlist=[];
    let totaldue=0;
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
           }
           for(let i of orderlist)
           {
               console.log(i + ' array');
           }
           console.log("Current total"+ totaldue);
        })
    })
  
});