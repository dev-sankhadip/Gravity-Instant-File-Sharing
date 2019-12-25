var socket=io.connect('http://127.0.0.1:4000');
var add_btn=document.getElementsByClassName("add");
var remove_btn=document.getElementsByClassName("remove");

var suggestion_name=document.getElementsByClassName("suggestion_name");


for(let i=0;i<add_btn.length;i++)
{
    add_btn[i].addEventListener("click", function()
    {
        const parentElement=this.parentElement;
        const reciepientId=parentElement.id;
        socket.emit('add_friend',{reciepientId});
        const suggestion_friend_name=suggestion_name[i].innerHTML;

        var sent_request_ul=document.getElementById("sent-request-ul");

        var li_sent_request_name_tag=document.createElement("li");
        li_sent_request_name_tag.id=reciepientId;

        var div_sent_request_tag=document.createElement("div");
        var span_sent_request_tag=document.createElement("span");
        span_sent_request_tag.innerHTML=suggestion_friend_name;
        div_sent_request_tag.appendChild(span_sent_request_tag);

        var cancel_request_btn=document.createElement("button");
        cancel_request_btn.type="btn";
        cancel_request_btn.classList.add("btn");
        cancel_request_btn.classList.add("btn-sm");
        cancel_request_btn.classList.add("btn-warning");
        cancel_request_btn.classList.add("text-light");
        cancel_request_btn.style.borderRadius="0";
        cancel_request_btn.setAttribute("onclick","this.blur()");
        cancel_request_btn.innerHTML="Cancel Request";

        li_sent_request_name_tag.appendChild(div_sent_request_tag);
        li_sent_request_name_tag.appendChild(cancel_request_btn);

        sent_request_ul.appendChild(li_sent_request_name_tag);

        parentElement.remove();
    })
}

socket.on('friend_request',function(data)
{
    var request_ul=document.getElementById("request-ul");

    var li_tag=document.createElement("li");
    li_tag.id=data.result[0].userid;
    
    var div_requester_tag=document.createElement("div");
    var span_requester_tag=document.createElement("span");
    span_requester_tag.innerHTML=data.result[0].name;
    div_requester_tag.appendChild(span_requester_tag);

    var accept_btn=document.createElement("button");
    accept_btn.type="btn";
    accept_btn.classList.add("btn");
    accept_btn.classList.add("btn-sm");
    accept_btn.classList.add("btn-success");
    accept_btn.classList.add("accept");
    accept_btn.style.borderRadius='0';
    accept_btn.innerHTML="Accept";
    accept_btn.setAttribute("onclick","this.blur()");

    var reject_btn=document.createElement("button");
    reject_btn.type="btn";
    reject_btn.classList.add("btn");
    reject_btn.classList.add("btn-sm");
    reject_btn.classList.add("btn-danger");
    reject_btn.classList.add("reject");
    accept_btn.style.borderRadius='0';
    reject_btn.innerHTML="Reject";
    reject_btn.setAttribute("onclick","this.blur()");

    li_tag.appendChild(div_requester_tag);
    li_tag.appendChild(accept_btn);
    li_tag.appendChild(reject_btn);
    request_ul.appendChild(li_tag);

})

var accept_btn=document.getElementsByClassName("accept");
var reject_btn=document.getElementsByClassName("reject");

for(let i=0;i<accept_btn.length;i++)
{
    accept_btn[i].addEventListener("click", function()
    {
        const parentElement=this.parentElement;
        const requesterId=parentElement.id;
        console.log(requesterId);
        socket.emit('accept_request',{requesterId});
        parentElement.remove();
    })
}