/**Prevents Selling of Item if there is no item left and warns users when quantity of an item is running out */

$(document).ready(function(){
    let quan=$(".quan").text().trim();
    let item_Name=$(".itemname").text().trim();

let quan_arr=quan.split(' ');
let item_arr=item_Name.split(' ');


for(let x=0;x<quan_arr.length;x++)
{
    if(quan_arr[x] < 10 && quan_arr[x]>1 )
    {
        var $toastContent=item_arr[x];
        Materialize.toast($toastContent + ' is running low', 6000,'toast-custom');
    }
    else if(quan_arr[x]<1)
    {
        $("tr>td.quan").eq(x).parent().find(".sell").addClass("ddisabled");
        let toastContent=$("tr>td.quan").eq(x).parent().find(".itemname").text();
        Materialize.toast(toastContent + ' is out of stock', 7000,'toast-custom')
        //console.log($(".quan").parent().find(item_arr[x]));
    }
}

$("td.sell__button").each(function(i) {
    $(this).children().filter(".sell").click(function(){
      let children=$(this).parent().children();

      let quantity=children.filter("input[name='quantity']").val();
      let item_Name=children.filter("input[name='itemname']").val();
      if(quantity<1)
      {
          $(this).addClass("ddisabled");
          let toastContent=item_Name;
          Materialize.toast(toastContent + ' is out of stock', 7000,'toast-custom');
      }
    })
})

    
  /*   else if($(".quan").text().trim()<1)
      {

        console.log('OUT')
        var $toastContent=$(".itemname").text().trim();
        $(".quan").parent().find(".sell").addClass("ddisabled");
        Materialize.toast($toastContent + ' is finished,you cannot sell', 6000)
      }
 */





















})