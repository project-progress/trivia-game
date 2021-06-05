//If Users aare in the local storage - load them.
if(window.localStorage.length){
    for(user in window.localStorage){
        let value = window.localStorage.getItem(user);
        //check for value, because for loop get also methods of local storage
        if(value){
            let el = document.getElementById(user);
            el.querySelector("input[type=checkbox]").checked = true;
            let textBox = el.querySelector("input[type=text]");
            textBox.disabled = null;
            textBox.value = value;
        }
    }
}

function checkbox(number){
    if(document.getElementById(`checkbox${number}`).checked){
        document.getElementById(`input${number}`).disabled=false;
    }
    else {
        document.getElementById(`input${number}`).disabled=true;
    }
}
function button()
{
    let checkboxarray=document.querySelectorAll("input[type=checkbox]");
    let indicator=0;
    for(let i=0;i<checkboxarray.length;i++){
    if(checkboxarray[i].checked){
        indicator++;
    }
   }
   if(indicator>=2){
    for(let i=1;i<=indicator;i++){
        localStorage.setItem(`User${i}`,document.getElementById(`input${i}`).value);
    }     
    window.location='./GamePage.html';
   }
   else {
       alert("The number of players is not enough");
   }
}