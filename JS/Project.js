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
       alert("the number of players is not enough");
   }
}