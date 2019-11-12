
function Submit()
{
    console.log("Sending request.");
    var name = document.getElementById("inp_name").value;
    var email = document.getElementById("inp_email").value;
    var message = document.getElementById("inp_message").value;
    const Http = new XMLHttpRequest();
    const url = "http://100.16.230.232:5017/submit";
    Http.open("POST", url);
    Http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    Http.send(JSON.stringify({"name":""+name, "email":""+email, "message":""+message}));
    
    Http.onreadystatechange = (e) => {
        console.log(Http.responseText);
        
        if (Http.responseText == "1")
        {
            console.log("Request successful, moving.");
            window.location.href = 'ty.html';
        }
        else
        {
            console.log("An error ocurred with request.");
        }
    };
}
