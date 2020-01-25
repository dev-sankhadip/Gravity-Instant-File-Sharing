const socket=io.connect('http://127.0.0.1:4000');


const message_input_field=document.getElementById("message");
const message_send_btn=document.getElementById("send");
const name_input_field=document.getElementById("username");
const name_set_btn=document.getElementById("setname");

name_set_btn.addEventListener("click", function()
{
    const username=name_input_field.value;
    if(username.length>0)
    {
        localStorage.setItem("group-username", username);
        name_input_field.value="";
    }
    else
    {
        alert("set your username");
    }
})

message_send_btn.addEventListener("click", function(e)
{
    const username=localStorage.getItem("group-username");
    const message=message_input_field.value;
    if(username)
    {
        if(message.length>0)
        {

            socket.emit('group_message',{ message, username })
        }
        else
        {
            alert("Write some message");
        }
    }
    else
    {
        alert("set your username");
    }
})