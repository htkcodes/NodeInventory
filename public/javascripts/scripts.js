

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
     $('.tooltipped').tooltip({delay: 50});


     console.log(
      
        moment().weekday(5)
     );
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

            $("div.gross").each(function(i){
              const expense=30000;
                $(this).children().filter("span.profit").text();
            let gross=$(this).children().filter("span.profit").text();
            gross=Number(gross)+expense;
            myBar.data.datasets[0].data[i]=gross;
          myBar.data.labels[i]=  $(this).children().filter("span.date").text();
          myBar.data.datasets[1].data[i]=expense;
              myBar.update();
            }) 
            

$(".gross span.profit").each(function(){

let element=$(this).closest("div").children().filter("span.percentage");

let percentage=element.attr('data-badge-caption');

percentage=Math.abs(percentage);

let profit=$(this).closest("div").children().filter("span.profit").text();

if(profit < 0)
{
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
 
     
       
    
});