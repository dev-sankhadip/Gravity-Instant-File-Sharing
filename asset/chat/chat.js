var socket=io.connect('http://127.0.0.1:4000');
var chatBox=document.getElementById("chat-box");
var chat_box=document.getElementById("chat-box");
socket.on('connect', function()
{
    var email=localStorage.getItem("email");
    socket.emit('join',{
        email:email
    })
})

window.onbeforeunload=function()
{
    var email=localStorage.getItem("email");
    socket.emit("user_leave",{ email });
}

socket.on('disconnect', function()
{
    var data="here";
    socket.emit('disconnected_user',{ data });
})

function createChatBox(recieverEmail)
{
    var senderEmail=localStorage.getItem("email");
    axios.post('/messenger/chat',{userid:senderEmail, s_id:recieverEmail})
    .then((res)=>
    {
        for(var l=0;l<res.data.chat1.length;l++)
        {
            var nrml_div_tag=document.createElement("div");
            nrml_div_tag.style.width="100%";
            nrml_div_tag.style.float="left";
            nrml_div_tag.style.marginTop="5px";
            if(res.data.chat1[l].sid==senderEmail)
            {
                var chat_div_tag=document.createElement('div');
                chat_div_tag.style.width="238px";
                chat_div_tag.style.height="auto";
                chat_div_tag.style.borderRadius="10px";
                chat_div_tag.style.float="right";
                chat_div_tag.style.padding=0;
                chat_div_tag.classList.add("shadow");
                chat_div_tag.classList.add("bg-white");
                chat_div_tag.classList.add("pl-2");
                chat_div_tag.classList.add("pt-2");
                var chatBoxPTag=document.createElement("P");
                var chatBoxPTagText=document.createTextNode(res.data.chat1[l].message);
                chatBoxPTag.append(chatBoxPTagText);
                chat_div_tag.appendChild(chatBoxPTag);
                nrml_div_tag.appendChild(chat_div_tag);
                chat_box.appendChild(nrml_div_tag);
            }
            else
            {
                var chat_div_tag=document.createElement('div');
                chat_div_tag.style.width="238px";
                chat_div_tag.style.height="auto";
                chat_div_tag.style.borderRadius="10px";
                chat_div_tag.style.float="left";
                chat_div_tag.style.padding=0;
                chat_div_tag.classList.add("shadow");
                chat_div_tag.classList.add("bg-white");
                chat_div_tag.classList.add("pl-2");
                chat_div_tag.classList.add("pt-2");
                var chatBoxPTag=document.createElement("P");
                var chatBoxPTagText=document.createTextNode(res.data.chat1[l].message);
                chatBoxPTag.append(chatBoxPTagText);
                chat_div_tag.appendChild(chatBoxPTag);
                nrml_div_tag.appendChild(chat_div_tag);
                chat_box.appendChild(nrml_div_tag);
            }
        }
    })
    .catch((err)=>
    {
        console.log(err);
    })
}

function makeChatBoxOpen(recieverEmail)
{
    chatBox.setAttribute("isopen",true);
    chatBox.setAttribute("isopenid",recieverEmail);
    chatBox.innerHTML="";
}

function createChatList(email)
{
    var chatListLiTag=document.getElementsByClassName("chatListLiTag");
    var f=0;
    for(var i=0;i<chatListLiTag.length;i++)
    {
        if(chatListLiTag[i].id==email)
        {
            f=1;
            break;
        }
    }
    if(f==0)
    {
        var chatListUl=document.getElementById("chat-list-ul");
        var chatListLi=document.createElement("LI");
        chatListLi.className="chatListLiTag";
        chatListLi.id=email;
        var chatMessageP=document.createElement("P");
        var chatMessageText=document.createTextNode(email);
        chatMessageP.append(chatMessageText);
        chatListLi.append(chatMessageP);
        chatListLi.addEventListener("click", function()
        {
            var recieverEmail=this.id;
            makeChatBoxOpen(recieverEmail);
            createChatBox(recieverEmail);
        })
        chatListUl.appendChild(chatListLi);
    }
}


window.onload=function()
{
    var email=localStorage.getItem("email");
    // console.log(email);
    fetch('/messenger/getAllMsg',{
        method:'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        body:JSON.stringify({
            email:email
        })
    })
    .then((res)=>
    {
        return res.json();
    })
    .then((res)=>
    {
        var arr=[];
        var i=0;
        var friendList=[];
        var chatListUltag=this.document.getElementById("chat-list-ul");
        for(var j=0;j<res.result3.length;j++)
        {
            friendList[res.result3[j].friendid]=res.result3[j].friendname;
        }
        var new_msg_check1=[];
        var new_msg_check2=[];
        for(const msg of res.result1)
        {
            const { rid, sid, message, new_msg }=msg;
            if(arr.includes(rid)!=true)
            {
                var userIdLiTag=document.createElement("LI");
                var userIdPTag=document.createElement("SPAN");
                var userIdText=document.createTextNode(friendList[rid]);
                userIdPTag.append(userIdText);
                userIdLiTag.append(userIdPTag);
                userIdLiTag.classList.add("chatListLiTag");
                userIdLiTag.classList.add("list-group-item");
                userIdLiTag.id=rid;
                userIdLiTag.addEventListener("click", function()
                {
                    document.getElementById("recieverId").value=this.id;
                    document.getElementById("chat-title").innerHTML=this.children[0].innerHTML;
                    document.getElementById("header").classList.remove("d-none");
                    document.getElementById("footer").classList.remove("d-none");
                    var recieverEmail=this.id;
                    // socket.emit('make_seen',{ recieverEmail });
                    makeChatBoxOpen(recieverEmail);
                    createChatBox(recieverEmail);
                })
                chatListUltag.appendChild(userIdLiTag);
                arr[i]=rid;
                i++;
            }
            // if(new_msg==="true")
            // {
            //     new_msg_check1[rid]=true;
            // }
            // else
            // {
            //     new_msg_check1[rid]=false;
            // }
        }

        function labelNewMessage(chatid)
        {
            userNewMessageNotificationTag=document.createElement("small");
            userNewMessageNotificationTag.style.fontWeight="bold";
            userNewMessageNotificationTag.style.marginLeft="8px";
            userNewMessageNotificationTag.style.color="green";
            userNewMessageNotificationTag.innerHTML=new_msg="New Message";
            document.getElementById(chatid).appendChild(userNewMessageNotificationTag);
        }

        // for(let i=0;i<new_msg_check1.length;i++)
        // {
        //     if(new_msg_check1[i]===true)
        //     {
        //         labelNewMessage(i);
        //     }
        // }

        for(const msg1 of res.result2)
        {
            const { rid, sid, message,new_msg }=msg1;
            if(arr.includes(sid)!=true)
            {
                var userIdLiTag1=this.document.createElement("LI");
                var userIdPTag1=this.document.createElement("SPAN");
                var userIdText1=this.document.createTextNode(sid);
                userIdPTag1.append(userIdText1);
                userIdLiTag1.append(userIdPTag1);
                userIdLiTag1.classList.add("chatListLiTag");
                userIdLiTag1.classList.add("list-group-item");
                userIdLiTag1.id=sid;
                userIdLiTag1.addEventListener("click", function()
                {
                    document.getElementById("recieverId").value=this.id;
                    document.getElementById("chat-title").innerHTML=this.id;
                    document.getElementById("header").classList.remove("d-none");
                    document.getElementById("footer").classList.remove("d-none");
                    var recieverEmail=this.id;
                    // socket.emit('make_seen',{ recieverEmail });
                    makeChatBoxOpen(recieverEmail);
                    createChatBox(recieverEmail);
                })
                chatListUltag.appendChild(userIdLiTag1);
                arr[i]=sid
                i++;
            }
            // if(new_msg==="true")
            // {
            //     new_msg_check2[sid]=true;
            // }
            // else
            // {
            //     new_msg_check2[sid]=false;
            // }
        }

        // for(let i=0;i<new_msg_check2.length;i++)
        // {
        //     if(new_msg_check2[i]===true)
        //     {
        //         labelNewMessage(i);
        //     }
        // }

    })
    .catch((err)=>
    {
        console.log(err);
    })
}

var submit=document.getElementById("message-btn");
submit.onclick=function()
{
    //require all the value
    var message=document.getElementById("message").value;
    var rEmail=document.getElementById("recieverId").value;
    var sEmail=localStorage.getItem("email");

    //print message into chatbox if chatbox is open
    const isopenValue=chatBox.getAttribute("isopen");
    const isopenidValue=chatBox.getAttribute("isopenid");
    if(isopenValue=="true" && isopenidValue==rEmail)
    {
        // console.log(isopenidValue);
        // console.log(rEmail);
        var nrml_div_tag=document.createElement("div");
        nrml_div_tag.style.width="100%";
        nrml_div_tag.style.float="left";
        nrml_div_tag.style.marginTop="5px";
        var chat_div_tag=document.createElement('div');
        chat_div_tag.style.width="238px";
        chat_div_tag.style.height="auto";
        chat_div_tag.style.borderRadius="10px";
        chat_div_tag.style.float="right";
        chat_div_tag.style.padding=0;
        chat_div_tag.classList.add("shadow");
        chat_div_tag.classList.add("bg-white");
        chat_div_tag.classList.add("pl-2");
        chat_div_tag.classList.add("pt-2");
        var chatBoxPTag=document.createElement("P");
        var chatBoxPTagText=document.createTextNode(message);
        chatBoxPTag.append(chatBoxPTagText);
        chat_div_tag.appendChild(chatBoxPTag);
        nrml_div_tag.appendChild(chat_div_tag);
        chat_box.appendChild(nrml_div_tag);
    }

    //print message into chatlist
    var chatListLiTag=document.getElementsByClassName("chatListLiTag");
    if(chatListLiTag.length==0)
    {
        // console.log('empty chat list');
        var chatListUl=document.getElementById("chat-list-ul");
        var chatListLi=document.createElement("LI");
        chatListLi.className="chatListLiTag";
        chatListLi.id=rEmail;
        var chatMessageP=document.createElement("SPAN");
        var chatMessageText=document.createTextNode(rEmail);
        chatMessageP.append(chatMessageText);
        chatListLi.append(chatMessageP);
        chatListLi.addEventListener("click", function()
        {
            var recieverEmail=this.id;
            makeChatBoxOpen(recieverEmail);
            createChatBox(recieverEmail);
        })
        chatListUl.append(chatListLi);
    }
    else
    {
        createChatList(rEmail);
    }
    //send message
    socket.emit("new",{
        msg:message,
        email:rEmail,
        sEmail:sEmail,
        time:new Date().toLocaleTimeString()

    })
    document.getElementById("message").value="";
}
socket.on('new_msg', function(data)
{
    console.log(data);
    var chatListLiTag=document.getElementsByClassName("chatListLiTag");

    //print nessage into chatbox if chatbox is open
    const isopenValue=chatBox.getAttribute("isopen");
    const isopenidValue=chatBox.getAttribute("isopenid");
    if(isopenValue=="true" && isopenidValue==data.sEmail)
    {
        var nrml_div_tag=document.createElement("div");
        nrml_div_tag.style.width="100%";
        nrml_div_tag.style.float="left";
        nrml_div_tag.style.marginTop="5px";
        var chat_div_tag=document.createElement('div');
        chat_div_tag.style.width="238px";
        chat_div_tag.style.height="auto";
        chat_div_tag.style.borderRadius="10px";
        chat_div_tag.style.float="left";
        chat_div_tag.style.padding=0;
        chat_div_tag.classList.add("shadow");
        chat_div_tag.classList.add("bg-white");
        chat_div_tag.classList.add("pl-2");
        chat_div_tag.classList.add("pt-2");
        var chatBoxPTag=document.createElement("P");
        var chatBoxPTagText=document.createTextNode(data.msg);
        chatBoxPTag.append(chatBoxPTagText);
        chat_div_tag.appendChild(chatBoxPTag);
        nrml_div_tag.appendChild(chat_div_tag);
        chat_box.appendChild(nrml_div_tag);
    }

    //if chatlist is empty
    //then add the message
    if(chatListLiTag.length==0)
    {
        var chatListUl=document.getElementById("chat-list-ul");
        var chatListLi=document.createElement("LI");
        chatListLi.className="chatListLiTag";
        chatListLi.id=data.sEmail;
        chatListLi.addEventListener("click", function()
        {
            var s_id=this.id;
            makeChatBoxOpen(s_id);
            var userid=localStorage.getItem("email");
            axios.post('/messenger/chat',{userid, s_id})
            .then((res)=>
            {
                for(var i=0;i<res.data.chat1.length;i++)
                {
                    console.log(res.data.chat1[i].rid);
                    console.log(res.data.chat1[i].sid);
                    console.log(res.data.chat1[i].message);
                    var chatBoxPTag=document.createElement("P");
                    var chatBoxPTagText=document.createTextNode(res.data.chat1[i].message);
                    chatBoxPTag.append(chatBoxPTagText);
                    chat_box.append(chatBoxPTag);
                }
            })
            .catch((err)=>
            {
                console.log(err);
            })
        })
        var chatMessageP=document.createElement("P");
        var chatMessageText=document.createTextNode(data.sEmail);
        chatMessageP.append(chatMessageText);
        chatListLi.append(chatMessageP);
        chatListUl.append(chatListLi);
    }
    else
    {
        createChatList(data.sEmail);
    }
})





//friend request configuration
// var socket=io.connect('http://127.0.0.1:4000');
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
        cancel_request_btn.addEventListener("click", function()
        {
            const parentElement=this.parentElement;
            const reciepientId=parentElement.id;
            console.log(reciepientId);
            socket.emit('cancel_request',{ reciepientId })
            parentElement.remove();
        })
        cancel_request_btn.innerHTML="Cancel Request";

        li_sent_request_name_tag.appendChild(div_sent_request_tag);
        li_sent_request_name_tag.appendChild(cancel_request_btn);

        sent_request_ul.appendChild(li_sent_request_name_tag);

        parentElement.remove();
    })
}


// recieve friend request code
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
    accept_btn.addEventListener("click", function()
    {
        const parentElement=this.parentElement;
        const requesterId=parentElement.id;
        console.log(requesterId);
        socket.emit('accept_request',{ requesterId });
        parentElement.remove();
    })
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

    var request_count=document.getElementById("request_count");
    request_count.innerHTML=parseInt(request_count.innerHTML)+1;

})


// request accept button code

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

socket.on('remove_request', function(data)
{
    console.log(data);
})


var cancel_btn=document.getElementsByClassName("cancel");
for(let i=0;i<cancel_btn.length;i++)
{
    cancel_btn[i].addEventListener("click", function()
    {
        const parentElement=this.parentElement;
        const reciepientId=parentElement.id;
        console.log(reciepientId);
        socket.emit('cancel_request',{ reciepientId })
        parentElement.remove();
    })
}

var reject_request_btn=document.getElementsByClassName("reject");
for(let i=0;i<reject_request_btn.length;i++)
{
    reject_request_btn[i].addEventListener("click", function()
    {
        const parentElement=this.parentElement;
        const requesterId=parentElement.id;
        socket.emit('reject_request',{ requesterId });
        parentElement.remove();
    })
}


// // friend search code
// const friendSearchInput=document.getElementById("friend-search-input");
// const friendBox=document.getElementById("friend-box");
// const friendSearchResultDiv=document.getElementById("friend-search-result-div");
// const friendSearchResultUl=document.getElementById("friend-search-list");

// let friendBoxHTML=friendBox.innerHTML;
// friendSearchInput.oninput=function(e)
// {
//     const name=e.target.value;
//     if(name.length>0)
//     {
//         fetch(`/messenger/user/${name}`,{
//             method:"GET"
//         })
//         .then((res)=>
//         {
//             return res.json();
//         })
//         .then((res)=>
//         {
//             console.log(res);
//             friendBox.innerHTML="";
//             const { users, friend }=res;
//             users.length>0 ? users.map(function(user)
//             {
//                 console.log(user);
//             }) : friendBox.innerHTML="No user found";
//         })
//         .catch((err)=>
//         {
//             console.log(err);
//         })
//     }
//     else
//     {
//         friendBox.innerHTML=friendBoxHTML;
//     }
// }



///all public file configuration

//image configuration
var select_btn=document.getElementsByClassName("select-image-btn");
for(let i=0;i<select_btn.length;i++)
{
    select_btn[i].addEventListener("click", function()
    {
        const imageid=this.id;
        fetch(`/image/generate/${imageid}`,{
            method:"GET"
        })
        .then((res)=>
        {
            return res.json();
        })
        .then((res)=>
        {
            document.querySelector("#message").value=res.link;
            document.getElementById("close-modal").click();
        })
        .catch((err)=>
        {
            console.log(err);
        })
    })
}


//audio configuration
var select_audio_btn=document.getElementsByClassName("select-audio-btn");
for(let i=0;i<select_audio_btn.length;i++)
{
    select_audio_btn[i].addEventListener("click", function()
    {
        const parentElement=this.parentElement;
        const audioid=parentElement.id;
        fetch(`/audio/generate/${audioid}`,{
            method:"GET"
        })
        .then((res)=>
        {
            return res.json();
        })
        .then((res)=>
        {
            document.querySelector("#message").value=res.link;
            document.getElementById("close-modal").click();
        })
        .catch((err)=>
        {
            console.log(err);
        })
    })
}

var public_audio_play_btn=document.getElementsByClassName("play-audio-btn");
for(let i=0;i<public_audio_play_btn.length;i++)
{
    public_audio_play_btn[i].addEventListener("click", function()
    {
        const parentElement=this.parentElement;
        const audioid=parentElement.id;
        console.log(audioid);
        document.getElementById(`${audioid}a`).play();
    })
}


var public_audio_pause_btn=document.getElementsByClassName("pause-audio-btn");
for(let i=0;i<public_audio_pause_btn.length;i++)
{
    public_audio_pause_btn[i].addEventListener("click", function()
    {
        const parentElement=this.parentElement;
        const audioid=parentElement.id;
        console.log(audioid);
        document.getElementById(`${audioid}a`).pause();
    })
}


//video configuration
var select_video_btn=document.getElementsByClassName("select-video-btn");
for(let i=0;i<select_video_btn.length;i++)
{
    select_video_btn[i].addEventListener("click", function()
    {
        const parentElement=this.parentElement;
        const videoid=parentElement.id;
        fetch(`/video/generate/${videoid}`,{
            method:"GET"
        })
        .then((res)=>
        {
            return res.json();
        })
        .then((res)=>
        {
            document.querySelector("#message").value=res.link;
            document.getElementById("close-modal").click();
        })
        .catch((err)=>
        {
            console.log(err);
        })
    })
}

var public_video_play_btn=document.getElementsByClassName("play-video-btn");
for(let i=0;i<public_video_play_btn.length;i++)
{
    public_video_play_btn[i].addEventListener("click", function()
    {
        const parentElement=this.parentElement;
        const videoid=parentElement.id;
        // console.log(videoid);
        document.getElementById(`${videoid}v`).play();
    })
}


var public_video_pause_btn=document.getElementsByClassName("pause-video-btn");
for(let i=0;i<public_video_pause_btn.length;i++)
{
    public_video_pause_btn[i].addEventListener("click", function()
    {
        const parentElement=this.parentElement;
        const videoid=parentElement.id;
        // console.log(videoid);
        document.getElementById(`${videoid}v`).pause();
    })
}



//profile view option
var suggestion_name_view=document.getElementsByClassName("suggestion_name");
for(let i=0;i<suggestion_name_view.length;i++)
{
    suggestion_name_view[i].addEventListener("click", function()
    {
        const parentElement1=this.parentElement;
        const parentElement2=parentElement1.parentElement;
        const userid=parentElement2.id;
        fetch(`/messenger/details/${userid}`,{
            method:"GET"
        })
        .then((res)=>
        {
            return res.json();
        })
        .then((res)=>
        {
            // console.log(res);
            // const imgBase64=res.result[0].img;
            // const profileImg=document.getElementById("profile-image");
            // profileImg.style.width="100px";
            // profileImg.style.height="100px";
            // profileImg.style.marginLeft="42%";
            // imgBase64==null ? profileImg.src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png" : profileImg.src=imgBase64
            document.getElementById("profile-email").value=res.result[0].email;
            document.getElementById("profile-phone-no").value=res.result[0].number;
        })
        .catch((err)=>
        {
            console.log(err);
        })
    })
}