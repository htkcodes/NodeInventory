
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
        let sure=confirm("Are you sure?");
        Materialize.toast('Working...',20000,'toast-custom');
        if(sure==true)
        {
            console.log()
             let item_ID=$(this).find("div").children().filter("input").val();
            let selectedRow=$(this).closest("li");
            let formDate={
                '_id':item_ID
            };
    
            $.ajax({
                type:'POST',
             url:'/inventory/item/delete',
             data:JSON.stringify(formDate),
             contentType:'application/json',
             success:function(data){
                selectedRow.remove();
                var toastElement = $('.toast').first()[0];
                var toastInstance = toastElement.M_Toast;
                toastInstance.remove();
                Materialize.toast('Deletion Successful',5000,'toast-custom');
             }
            
        }); 
        }
        else{
            var toastElement = $('.toast').first()[0];
            var toastInstance = toastElement.M_Toast;
            toastInstance.remove();
            Materialize.toast('Delete Cancelled',5000,'toast-custom')
        }
        
});

/*-------SELL AJAX FUNCTION ------*/

$(".sell").click(function(){

    let sure=confirm("Are you sure?");
    Materialize.toast('Working...',20000,'toast-custom');
    if(sure==true)
    {
        
        let parent=$(this).parent();
        let item_ID=parent.children("button.sell").find("input").val();
        let quantityOriginal=parent.children("p").find("span.quan");
        let soldOriginal=parent.children("p").find("span.sold");
        let totalOriginal=parent.children("p").find("span.total");
        let price=parent.children("span").filter("span.price").text();


        replacedTotalOriginal=totalOriginal.text().replace('$','');
        price=price.replace('$','');
        parsedTotalOriginal=parseInt(replacedTotalOriginal);
        parsedPrice=parseInt(price);
        parsedQuantityOriginal=parseInt(quantityOriginal.text());
        parsedSoldOriginal=parseInt(soldOriginal.text());
    
    
    let formData={
        '_id':item_ID,
    };
    
    
    $.ajax({
        type:'POST',
     url:'/inventory/item/sell',
     data:JSON.stringify(formData),
     contentType:'application/json',
     success:function(data){
    
    if(typeof data === "string"){
        Materialize.toast(data,5000,'toast-custom');
        setTimeout(function(){
            window.location.reload(1);
         }, 4000);
    }
    else if(data===true)
    {
        var toastElement = $('.toast').first()[0];
        var toastInstance = toastElement.M_Toast;
        toastInstance.remove();
        Materialize.toast('Sold',5000,'toast-custom'); 

    let newQuantity=parsedQuantityOriginal-1;
    let newTotal=parsedTotalOriginal+parsedPrice;
    let updateSold=parsedSoldOriginal+1;
    soldOriginal.text(updateSold);
    totalOriginal.text("$"+newTotal);
    quantityOriginal.text(newQuantity);
    }
    
     },
     error:function (jqXHR,exception) {
        var toastElement = $('.toast').first()[0];
        var toastInstance = toastElement.M_Toast;
        toastInstance.remove();
         console.log('err');
         Materialize.toast('An Error Occured',5000,'toast-custom');
     }
    });
    
    }
    else{
        Materialize.toast('Cancelled',5000,'toast-custom')
    }

   
})

/*-------add to card AJAX FUNCTION ------*/

$(".add-to-cart").click(function(){

    let sure=confirm("Are you sure?");
    Materialize.toast('Working...',20000,'toast-custom');
    if(sure==true)
    {
        
        let parent=$(this).parent();
        let item_ID=parent.children("button.add-to-cart").find("input").val();
        let quantity=parent.children("input").filter("input.addtoquantity").val();

        console.log(quantity);

    console.log(item_ID);
    let formData={
        '_id':item_ID,
    };
    
    /* $.ajax({
        type:'POST',
     url:'addtocart',
     data:JSON.stringify(formData),
     contentType:'application/json',
     success:function(data){
    
    if(typeof data === "string"){
        Materialize.toast(data,5000,'toast-custom');
        setTimeout(function(){
            window.location.reload(1);
         }, 4000);
    }
    else if(data===true)
    {
        var toastElement = $('.toast').first()[0];
        var toastInstance = toastElement.M_Toast;
        toastInstance.remove();
        Materialize.toast('Done',5000,'toast-custom'); 
    }
    
     },
     error:function (jqXHR,exception) {
        var toastElement = $('.toast').first()[0];
        var toastInstance = toastElement.M_Toast;
        toastInstance.remove();
         console.log('err');
         Materialize.toast('An Error Occured',5000,'toast-custom');
     }
    }); */
    
    }
})


/*-------UPdATE AJAX FUNCTION ------*/

if(top.location.name == "/inventory/item/create")
{
  
       $("button").click(function(){

        if($(".quantity").is(':invalid') || $(".price").is(':invalid') || $(".name").is(':invalid'))
        {
            console.log('first func');
      return;
        }
        else
        {
            console.log('inside function');
            console.log($(".login-text"));
     $(".login-text").addClass("hide")
     $(".login>.white-text").addClass("hide");
         $(this).addClass("loader");

         let itemname,quantity,price;
       
         console.log('clicked');
 price=$(".price").val();
 itemname=$(".name").val();
 quantity=$(".quantity").val(); 
 
 
     
     let formData={
         'quantity':quantity,
         'name':itemname,
         'price':price
     };
     
      $.ajax({
         type:'POST',
      url:'/inventory/item/create',
      data:JSON.stringify(formData),
      contentType:'application/json',
      success:function(data){
      if(data==true)
      {
         $(".login-text").removeClass("hide")
         $(".login>.white-text").removeClass("hide");
             $(".login").removeClass("loader");
             $("div.init").empty();
          $("div.init").append(`<p class="flash-error animated flash">The item you're trying to add already exists<i class="material-icons left highlight-color">error</i></p>`);
          $(".name").focus();
      }
      else  if(typeof data === "object"){
          $(".login-text").removeClass("hide")
         $(".login>.white-text").removeClass("hide");
             $(".login").removeClass("loader");
        Object.keys(data).forEach(function(key) {
            $("div.init").empty();
            $("div.init").append(` <p class="flash-error animated flash">`+data[key].msg+` <i class="material-icons left highlight-color">error</i></p><br>`);
    
          
          });
     
    }
 else{
    let isToggled = function() {
        var n = $( "input:checked" ).length;
        //If checked
        if(n===1)
        {

            $("p.flash-error").remove();
            $(".init").prepend(`<p class="flash-error animated flash green-text">Item was successfully added you'll be redirected in <span id="5" class="time" ></span> <i class="material-icons left highlight-color">done</i></p>`);
           
          
            function c(){
                var n=$('.time').attr('id');
                var c=n;
                $('.time').text(c);
                setInterval(function(){
                    c--;
                    if(c>=0){
                        $('.time').text(c);
                    }
                    if(c==1){
                        $(location).attr('href', window.location.protocol+'//'+window.location.host+'/inventory/items');
                    
                    }
                },1000);
            }
            // Start
            c();
            // Loop
            setInterval(function(){
                c();
            },5000);
        }
        else{
            $(".login-text").removeClass("hide")
            $(".login>.white-text").removeClass("hide");
                $(".login").removeClass("loader");
            $("p.flash-error").remove();
            $(".init").prepend(`<p class="flash-error animated flash green-text">Item was successfully added</span><i class="material-icons left highlight-color">done</i></p>`); 
        }
      };
      isToggled();
      $( "input[type=checkbox]" ).on( "click", isToggled );
 
 }  

      },
      error:function (jqXHR,exception) {
          console.log('err');
      }
     }); 
         
        }

   
    
    })
}


/*-------ADD ITEM AJAX FUNCTION ------*/
var locationn=top.location.pathname;
var isUpdatePage=locationn.includes("/inventory/item/update/")
if(isUpdatePage)
{
  console.log("in update function")
       $("button").click(function(){

        if($(".quantity").is(':invalid') || $(".price").is(':invalid') || $(".name").is(':invalid'))
        {
            console.log('first func');
      return;
        }
        else
        {
            console.log('inside function');
            console.log($(".login-text"));
     $(".login-text").addClass("hide")
     $(".login>.white-text").addClass("hide");
         $(this).addClass("loader");

         let itemname,quantity,price;
       
         console.log('clicked');
 price=$(".price").val();
 itemname=$(".name").val();
 quantity=$(".quantity").val(); 
 item_id=$(".hidden_id").val()
 
 
     
     let formData={
         'quantity':quantity,
         'name':itemname,
         'price':price,
         '_id':item_id
     };
     
      $.ajax({
         type:'POST',
      url:'/inventory/item/update',
      data:JSON.stringify(formData),
      contentType:'application/json',
      success:function(data){
      if(data==true)
      {
         $(".login-text").removeClass("hide")
         $(".login>.white-text").removeClass("hide");
             $(".login").removeClass("loader");
             $("div.init").empty();
      /*     $("div.init").append(`<p class="flash-error animated flash">Item successfully updated<i class="material-icons left highlight-color">error</i></p>`) */;
          let isToggled = function() {
            var n = $( "input:checked" ).length;
            //If checked
            if(n===1)
            {
    
                $("p.flash-error").remove();
                $(".init").prepend(`<p class="flash-error min-width-300 animated flash green-text">Item updated,you'll be redirected in <span id="5" class="time" ></span> <i class="material-icons left highlight-color">done</i></p>`);
               
              
                function c(){
                    var n=$('.time').attr('id');
                    var c=n;
                    $('.time').text(c);
                    setInterval(function(){
                        c--;
                        if(c>=0){
                            $('.time').text(c);
                        }
                        if(c==1){
                            $(location).attr('href', window.location.protocol+'//'+window.location.host+'/inventory/items');
                        
                        }
                    },1000);
                }
                // Start
                c();
                // Loop
                setInterval(function(){
                    c();
                },5000);
            }
            else{
                $(".login-text").removeClass("hide")
                $(".login>.white-text").removeClass("hide");
                    $(".login").removeClass("loader");
                $("p.flash-error").remove();
                $(".init").prepend(`<p class="flash-error animated flash green-text">Item was successfully updated</span><i class="material-icons left highlight-color">done</i></p>`); 
            }
          };
          $( "input[type=checkbox]" ).on( "click", isToggled );
          isToggled();

      }
      else  if(typeof data === "object"){
          $(".login-text").removeClass("hide")
         $(".login>.white-text").removeClass("hide");
             $(".login").removeClass("loader");
        Object.keys(data).forEach(function(key) {
            $("div.init").empty();
            $("div.init").append(` <p class="flash-error animated flash">`+data[key].msg+` <i class="material-icons left highlight-color">error</i></p><br>`);
          });
     
    }
      },
      error:function (jqXHR,exception) {
          console.log('err');
          Materialize.toast(exception,5000);
      }
     }); 
         
        }
    })
}


if(top.location.pathname=="/users/login")
{

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

}


  
     $('.tooltipped').tooltip({delay: 50});

     if(top.location.pathname==='/inventory/items')
     {

        $(".sell").attrchange({
            trackValues: true, 
            callback: function (e) {
              //event.attributeName - Attribute Name
              //event.oldValue - Prev Value
              //event.newValue - New Value

        
     $(this).addClass("ddisabled");
       
     //   $(this).addClass(e.oldValue);
            }
          });
     }

     
       if(top.location.pathname==='/users/profit')
     {
        /*  let date=moment("Fri Feb 02 2018 21:07:24 GMT-0500 (Eastern Standard Time)").format("MMM Do YY")
         console.log(date); */
         $(".week>span").each(function(i){
           var sd=  $(this).text();
           var fd=moment(sd).format("MMM Do YY");
           $(this).text(fd)
         });
           $(".gross>span.date").each(function(i){
            var sd=  $(this).text();
            var fd=moment(sd).format("MMM Do YY");
            $(this).text(fd+": ");
          });  

          window.chartColors = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)'
        };


          var barChartData = {
            labels: [],
            datasets: [{
                label: "Gross Profit",
                backgroundColor: window.chartColors.red,
               
                data: [
                  
                ],
              
            }, {
                label: "Expenses",
                borderColor: window.chartColors.blue,
                backgroundColor: window.chartColors.blue,
               
                data: [
                   
                ],
           
            }]
        };
       
    //Creates chart
    
            var ctx = document.getElementById("canvas").getContext("2d");
            var myBar = new Chart(ctx, {
                type: 'bar',
                data: barChartData,
                options: {
                    title:{
                        display:true,
                        text:"Profit and Expense for each week"
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false
                    },
                    responsive: true,
                    scales: {
                        xAxes: [{
                            stacked: true,
                        }],
                        yAxes: [{
                            stacked: true
                        }]
                    }
                }
            });
//Generate chart values
            $("div.gross").each(function(i){
              const expense=30000;
                
            let gp=$(this).children().filter("span.profit").eq(0).text().replace('$','');
           console.log(gp);
            myBar.data.datasets[0].data[i]=gp;
          myBar.data.labels[i]=  $(this).children().filter("span.date").text();
          myBar.data.datasets[1].data[i]=expense;
              myBar.update();
            }) 
            

$(".gross span.profit").each(function(){

let element=$(this).closest("div").children().filter("span.percentage");

let percentage=element.attr('data-badge-caption');



let profit=$(this).closest("div").children().filter("span.profit");
profit=profit.text().replace('$','');

if(profit < 0)
{
    console.log('in function');
    element.attr('data-badge-caption',percentage + '% LOSS');
    element.addClass('light-red');
}
else
{
    element.attr('data-badge-caption',percentage + '% PROFIT');
    element.addClass('light-green');
}


})
     }      
  if(top.location.pathname == "/inventory/items")
  {
      $(".bottom").addClass("hide");
      console.log("here path")
  }
  if(top.location.pathname=="/users/cleanup")
  {
    setTimeout(function(){ 
$(".progress").remove();
$(".msg").removeClass("hide");
     }, 5000);
  }

  function adjustMenu()
  {
 
  }

});