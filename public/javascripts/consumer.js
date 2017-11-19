// A $( document ).ready() block.
$( document ).ready(function() {
    'use strict';
    var orderlist=[];
   $(".add").on("click",function(){
       let name=$(".itemname").text().trim();
       let totaldue=0;
       orderlist.push(name);
   })
});