$(document).ready(function()
{
    $(".nav-icon").click(function()
    {
        $("#mobile-menu").collapse('toggle');
        $("#mobile-menu").addClass("animated slideInRight faster")
    })
})
if ( window.history.replaceState ) {
    window.history.replaceState( null, null, window.location.href );
  }


$(document).ready(function()
{
    var string="THE GRAVITY";
    var i=0;
    if(i<string.length)
    {
        setInterval(()=>
        {
            document.querySelector(".add-header").innerHTML+=string.charAt(i);
            i++;
        },150)
    }
})
