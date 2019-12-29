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


//folder upload code

class FolderUploadData{
    constructor()
    {
        this.filesData=[];
    }

    setFilesData(data)
    {
        this.filesData.push(data);
    }
    
    getFilesData()
    {
        return this.filesData;
    }
}



const folderUploadData=new FolderUploadData();
const folderUploadInput=document.getElementById("customFolder");
const folderUploadBtn=document.getElementById("folder-upload-btn");
folderUploadInput.onchange=function(e)
{
    const mainFolder=e.target.files[0].webkitRelativePath.split('/');
    // console.log(mainFolder)
    console.log(e.target.files)
    for(let i=0;i<e.target.files.length;i++)
    {
        folderUploadData.setFilesData(e.target.files[i]);
    }
}

folderUploadBtn.addEventListener("click", function(e)
{
    let filesDataArray=folderUploadData.getFilesData();
    const formData=new FormData();
    for(let i=0;i<filesDataArray.length;i++)
    {
        formData.append("file", filesDataArray[i]);
        formData.append("path",filesDataArray[i].webkitRelativePath);
    }
    axios.post('/image/upload/folder',formData,{
        headers:{
            'Content-Type':'multipart/form-data',
        }
    }).then((res)=>{
        console.log(res);
    }).catch((err)=>{
        console.log(err)
    })
})