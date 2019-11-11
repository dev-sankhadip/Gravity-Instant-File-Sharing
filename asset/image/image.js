function emailShare(imageid)
{
    fetch(`/image/generate/${imageid}`,{
        method:"GET"
    })
    .then((res)=>
    {
        return res.json();
    })
    .then((res)=>
    {
        document.querySelector("#link").value=res.link;
    })
    .catch((err)=>
    {
        console.log(err);
    })
}

var file_name_check=document.getElementById("file-name-input");
var upload_btn=document.getElementById("upload-btn");
var check_tag=document.getElementById("check-tag");
file_name_check.oninput=function(e)
{
    check_tag.innerHTML="<i class='fa fa-spinner fa-spin text-primary'></i>"
    const filename=e.target.value;
    fetch('/image/check',{
        method:"POST",
        headers:{
            Accept:'aplication/json',
            'Content-Type':'application/json'
        },
        body:JSON.stringify({ filename })
    })
    .then((res)=>
    {
        return res.json();
    })
    .then((res)=>
    {
        console.log(res);
        if(res.code===12)
        {
            upload_btn.setAttribute("disabled", true);
            upload_btn.style.cursor="not-allowed";
            upload_btn.classList.remove("btn-success");
            upload_btn.classList.add("btn-danger");
            check_tag.innerHTML='<i class="fa fa-exclamation-triangle text-danger" aria-hidden="true"></i>'
        }
        else if(res.code==10)
        {
            upload_btn.removeAttribute("disabled");
            upload_btn.style.cursor="pointer";
            upload_btn.classList.remove("btn-danger");
            upload_btn.classList.add("btn-success");
            check_tag.innerHTML="<i class='fa fa-check text-success' aria-hidden='true'></i>"
        }
    })
    .catch((err)=>
    {
        console.log(err);
    })
}




var imageContent=document.getElementById("image-content");
var file=document.getElementById("customFile");
var fileNameDiv=document.getElementById("file-name-input-div");
var extension;
file.onchange=function(e)
{
    extension=e.target.value.split(".")[1];
    fileNameDiv.classList.remove("d-none");
    document.getElementById("fileName").innerHTML=e.target.value.substr(12,e.target.value.length-1);
}
$('#fileUploadForm').submit(function(e){
    e.preventDefault();
    console.log(extension);
    var file_name=document.getElementById("file-name-input").value;
    var uploadedSizeText=document.getElementById("uploadedSize");
    var totalSizeText=document.getElementById("totalSize");
    var fileUploadProgress=document.getElementById("file-upload-progress");
    $(this).ajaxSubmit({
        uploadProgress:function(event, position, total, complete)
        {
            fileUploadProgress.style.width=complete+"%";
            fileUploadProgress.innerHTML=complete+"%";
            uploadedSizeText.innerHTML=(position/1024/1024).toFixed(2)+"Mb";
            totalSizeText.innerHTML=(total/1024/1024).toFixed(2)+"Mb";
        },
        success: function(response){
            var tr_tag=document.createElement("tr");
            tr_tag.id=`${file_name}.${extension}`;

            var td_name_tag=document.createElement("td");
            var td_name_text=document.createTextNode(file_name);
            td_name_tag.appendChild(td_name_text);

            var td_date_tag=document.createElement("td");
            var td_date_text=document.createTextNode(new Date().toLocaleDateString()+" "+new Date().toLocaleTimeString());
            td_date_tag.appendChild(td_date_text);

            var td_watch_tag=document.createElement("td");
            var i_watch_tag=document.createElement("i");
            i_watch_tag.className="fa fa-eye";
            i_watch_tag.style.color="blue";
            i_watch_tag.id=`${response.imageid}`;
            i_watch_tag.addEventListener("click", function()
            {
                const imageid=this.id;
                const parentTdElement=this.parentElement;
                const parentTrElement=parentTdElement.parentElement;
                const imagename=parentTrElement.id;
                document.querySelector("#select-image").src=`/${imageid}/image/${imagename}`;
                document.querySelector("#btn").click();
            })
            td_watch_tag.appendChild(i_watch_tag);

            var td_download_tag=document.createElement("td");
            var a_download_tag=document.createElement("a");
            a_download_tag.href=`/image/download/${response.imageid}`;
            var i_download_tag=document.createElement("i");
            i_download_tag.className="fa fa-cloud-download";
            i_download_tag.style.color="green";
            a_download_tag.appendChild(i_download_tag);
            td_download_tag.appendChild(a_download_tag);

            var td_delete_tag=document.createElement("td");
            var i_delete_tag=document.createElement("i");
            i_delete_tag.className="fa fa-trash";
            i_delete_tag.style.color="red";
            i_delete_tag.id=`${response.imageid}`;
            i_delete_tag.addEventListener("click", function()
            {
                const imageid=this.id;
                const parentTdDeleteElement=this.parentElement;
                const parentTrElement=parentTdDeleteElement.parentElement;
                parentTrElement.remove();
                fetch(`image/delete/${imageid}`,{
                    method:"DELETE"
                })
                .then((res)=>
                {
                    return res.json();
                })
                .then((res)=>
                {
                    console.log(res);
                })
                .catch((err)=>
                {
                    console.log(err);
                })
            })
            td_delete_tag.appendChild(i_delete_tag);

            td_share_tag=document.createElement("td");
            var div_tag_share=document.createElement("div");
            div_tag_share.classList.add("custom-control");
            div_tag_share.classList.add("custom-checkbox");
            var input_share_tag=document.createElement("input");
            input_share_tag.type="checkbox";
            input_share_tag.classList.add("custom-control-input");
            input_share_tag.classList.add("link-select");
            input_share_tag.id=`link-select${response.imageid}`;
            input_share_tag.value=`${response.imageid}`;
            var label_share_tag=document.createElement("label");
            label_share_tag.classList.add("custom-control-label");
            label_share_tag.setAttribute("for",`link-select${response.imageid}`);
            label_share_tag.innerHTML="select";

            div_tag_share.appendChild(input_share_tag);
            div_tag_share.appendChild(label_share_tag);

            td_share_tag.appendChild(div_tag_share);
            
            tr_tag.appendChild(td_name_tag);
            tr_tag.appendChild(td_date_tag);
            tr_tag.appendChild(td_watch_tag);
            tr_tag.appendChild(td_download_tag);
            tr_tag.appendChild(td_delete_tag);
            tr_tag.appendChild(td_share_tag);

            imageContent.appendChild(tr_tag);
        },
        error:function(error)
        {
            console.log(error);
        }
    });
    return false;
});


var trash_icon=document.getElementsByClassName("fa-trash");
for(let i=0;i<trash_icon.length;i++)
{
    trash_icon[i].addEventListener("click", function()
    {
        const imageid=this.id;
        const parentTdDeleteElement=this.parentElement;
        const parentTrElement=parentTdDeleteElement.parentElement;
        parentTrElement.remove();
        fetch(`/image/delete/${imageid}`,{
            method:"DELETE"
        })
        .then((res)=>
        {
            return res.json();
        })
        .then((res)=>
        {
            console.log(res);
        })
        .catch((err)=>
        {
            console.log(err);
        })
    })
}


var eye_icon=document.getElementsByClassName("fa-eye");
for(let i=0;i<eye_icon.length;i++)
{
    eye_icon[i].addEventListener("click", function()
    {
        const imageid=this.id;
        const parentTdElement=this.parentElement;
        const parentTrElement=parentTdElement.parentElement;
        const imagename=parentTrElement.id;
        document.querySelector("#select-image").src=`/${imageid}/image/${imagename}`;
        document.querySelector("#btn").click();
    })
}

var share_icon=document.getElementsByClassName("fa-share-alt");
for(let i=0;i<share_icon.length;i++)
{
    share_icon[i].addEventListener("click", function()
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
            document.querySelector("#link").value=res.link;
            // document.querySelector("#number-share-link").value=res.link;
            // document.querySelector("#whatsapp-share-link").value=res.link;
        })
        .catch((err)=>
        {
            console.log(err);
        })
    })
}

document.querySelector("#send-link-btn").addEventListener("click", function()
{
    var email=document.getElementsByClassName("share-email");
    var link=document.querySelector("#link").value;
    var arrOfEmail=[];
    var j=0;
    for(let i=0;i<email.length;i++)
    {
        arrOfEmail[j]=email[i].value;
        j++;
    }

        fetch('/share',{
            method:"POST",
            body:JSON.stringify({
                arrOfEmail,link
            }),
            headers:{
                Accept:"application/json",
                'Content-Type':"application/json"
            }
        })
        .then((res)=>
        {
            return res.json();
        })
        .then((res)=>
        {
            console.log(res);
        })
        .catch((err)=>
        {
            console.log(err);
        })
})

document.getElementById("generate-multiple").addEventListener("click", function()
{
    var f=0;
    var linkGenerateIdArray=[];
    var linkSelect=document.getElementsByClassName("link-select");
    for(let i=0;i<linkSelect.length;i++)
    {
        if(linkSelect[i].checked===true)
        {
            f=1;
            linkGenerateIdArray.push(linkSelect[i].value);
        }
    }
    if(f==0)
    {
        alert("select at least one media");
    }
    else
    {
        fetch('/image/generatemultiple',{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                Accept:'application/json'
            },
            body:JSON.stringify({ linkGenerateIdArray })
        })
        .then((res)=>
        {
            return res.json();
        })
        .then((res)=>
        {
            document.getElementById("open-modal").click();
            document.querySelector("#link").value=res.link;
        })
        .catch((err)=>
        {
            console.log(err);
        })
    }
})


// document.querySelector("#send-link-no-btn").addEventListener("click", function()
// {
//     var link=document.getElementById("number-share-link").value;
//     var ph_no=document.getElementById("share-number").value;

//     fetch('/no',{
//         method:"POST",
//         body:JSON.stringify({ ph_no, link }),
//         headers:{
//             Accept:'application/json',
//             'Content-Type':'application/json'
//         }
//     })
//     .then((res)=>
//     {
//         return res.json();
//     })
//     .then((res)=>
//     {
//         console.log(res);
//     })
//     .catch((err)=>
//     {
//         console.log(err);
//     })
// })


var add_reciepient=document.getElementById("add-reciepient");
add_reciepient.addEventListener("click", function()
{
    var main_input_div=document.createElement("div");
    main_input_div.classList.add("input-group");
    main_input_div.classList.add("flex-nowrap");

    var input_div=document.createElement("div");
    input_div.classList.add("input-group-prepend");
    var addon_text=document.createElement("span");
    addon_text.classList.add("input-group-text");
    addon_text.classList.add("bg-success");
    addon_text.classList.add("text-light");
    addon_text.id="addon-wrapping";
    addon_text.innerHTML="To:";
    input_div.appendChild(addon_text);

    var input_field=document.createElement("input");
    input_field.type="email";
    input_field.classList.add("form-control");
    input_field.classList.add("share-email");
    input_field.placeholder="Enter Email Here";

    main_input_div.appendChild(input_div);
    main_input_div.appendChild(input_field);

    document.getElementById("first-email-input-div").insertAdjacentElement("afterend",main_input_div);
})


// var uploadform=document.getElementById("upload-form");
// var file=document.getElementById("customFile");
// var filename=document.getElementById("file-name");
// var fileNameDiv=document.getElementById("file-name-input-div");

// var formdata
// file.onchange=(e)=>
// {
//     // console.log(e.target.files[0])
//     formdata=new FormData();
//     formdata.append('file', e.target.files[0]);
//     fileNameDiv.classList.remove("d-none");
//     document.getElementById("file-name").innerHTML=e.target.files[0].name;
// }

// uploadform.onsubmit=(e)=>
// {
//     e.preventDefault();
//     fileNameDiv.classList.add('d-none');
//     document.getElementById("file-name").innerHTML="Choose file";
//     var fileName=document.getElementById("file-name-input").value;
//     //formdata.append("filename",fileName);
//     var token=localStorage.getItem("token");
//     var date=new Date();
//     axios.post("/imageupload",formdata,{
//         headers:{
//             'Content-Type':'multipart/form-data',
//             'filename':fileName,
//             'x-access-token':token
//         },
//         onUploadProgress:ProgressEvent=>{
//             var fileUploadProgress=document.getElementById("file-upload-progress");
//             var uploadPercentage=parseInt(Math.round((ProgressEvent.loaded*100) / ProgressEvent.total))
//             fileUploadProgress.style.width=uploadPercentage+"%";
//             fileUploadProgress.innerHTML=uploadPercentage+"%";
//             //clear percentage
//             // setTimeout(() => {
//             //     fileUploadProgress.style.width=0+"%";
//             //     fileUploadProgress.innerHTML=0+"%";
//             // }, 10000);
//         }
//     })
//     .then((response)=>
//     {
//         // console.log(response);
//         if(response.data.code==200)
//         {
//             // var len=response.data.result.length;
//             // console.log(len);
//             for(var i=0;i<1;i++)
//             {
//                 // console.log(response.data.result[i].name);
//                 console.log(fileName);
//                 allImage.push(response.data.result[i]);

//                 var imageContent=document.getElementById("image-content");

//                 var tr=document.createElement("TR");
//                 tr.scope="row";

//                 var th_name=document.createElement("TH");
//                 var th_name_text=document.createTextNode(fileName);
//                 th_name.appendChild(th_name_text);
//                 tr.appendChild(th_name);

//                 var th_date=document.createElement("TH");
//                 var th_date_text=document.createTextNode(new Date().toDateString());
//                 th_date.appendChild(th_date_text);
//                 tr.appendChild(th_date);

//                 var th_view=document.createElement("TH");
//                 var fa_icon_view=document.createElement("I");
//                 fa_icon_view.className="fa fa-eye";
//                 fa_icon_view.classList.add("text-primary");
//                 th_view.appendChild(fa_icon_view);
//                 tr.appendChild(th_view);

//                 var th_download=document.createElement("TH");
//                 var fa_icon_download=document.createElement("I");
//                 fa_icon_download.className="fa fa-cloud-download";
//                 fa_icon_download.classList.add("text-success");
//                 th_download.appendChild(fa_icon_download);
//                 tr.appendChild(th_download);

//                 var th_delete=document.createElement("TH");
//                 var fa_icon_delete=document.createElement("I");
//                 th_delete.appendChild(fa_icon_delete);
//                 fa_icon_delete.className="fa fa-trash";
//                 fa_icon_delete.classList.add("text-danger");
//                 fa_icon_delete.id=response.data.result[i].name;
//                 fa_icon_delete.addEventListener('click',function()
//                 {
//                     var parent_element_1=this.parentElement;
//                     var parent_element_2=parent_element_1.parentElement;
//                     parent_element_2.remove();
//                     var token=localStorage.getItem("token");
//                     axios.delete(`/deleteimage/${this.id}`,{
//                         headers:{
//                             'x-access-token':token
//                         }
//                     })
//                     .then((response)=>
//                     {
//                         console.log(response);
//                     })
//                 })
//                 tr.appendChild(th_delete);

//                 imageContent.appendChild(tr);
//             }
//         }
//     })
// }








// $(document).ready(function()
// {
//     $(".nav-icon").click(function()
//     {
//         $("#mobile-menu").collapse('toggle');
//         $("#mobile-menu").addClass("animated slideInRight faster")
//     })
// })