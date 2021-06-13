class User{
  constructor(n,m){
    this.name = n;
    this.scores = m;
  }
  addScore(score){
    this.scores += score;
  }
  removeScore(score){
    this.scores -= score;
  }
}

let users = [];

if(window.localStorage.length){
  for(user in window.localStorage){
    let value = window.localStorage.getItem(user);
    //check for value, because for loop get also methods of local storage
    if(value){
      users.push(new User(JSON.parse(value).name,JSON.parse(value).scores));
      let usersContainer = document.getElementById("usersContainer");
      let usersHTML = "";
      users.forEach(user => {
        usersHTML += `<div class="mb-3">
            <label>${user.name} -${user.scores}</label>
            <input type="text" id="${user.name}"></input>
        </div>`;
      });
      usersContainer.innerHTML = usersHTML;
      
    }
}
}

function categories(){
   fetch("http://jservice.io/api/categories?count=100").then(function(resp){
    if (resp.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          resp.status);
        return;
      }
      resp.json().then(function (data){
        
          for(let i=1;i<=5;i++){
            let question=data[Math.round((Math.random()*20)+Math.random()*10)];
            let info=question.title;
            let id=question.id;
            document.getElementById(`r${i}`).value=id;
            document.getElementById(`l${i}`).innerHTML= `${info}`;
          }
      })
   })
   
}
//load the question
function bringquestion(){
  try {
    let category=document.querySelector("input[name='question']:checked").value;
    let value=document.querySelector("input[name='exampleRadios']:checked").value;
    console.log(category);
    console.log(value);
    fetch(`https://jservice.io/api/clues?category=${category}&value=${value}`).then(function(response){
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      response.json().then(function(data){
       if(data.length>0){
        document.getElementById("questionarea").style.padding="10px";
        document.getElementById("answerarea").style.padding="10px";
        document.getElementById("questionarea").innerHTML=data[0].question;
        document.getElementById("answerarea").innerHTML=`The answer is ${data[0].answer}`;
        console.log(data);
       }
        else {
          alert("change the vlaue");
        }
      })
    })
  }  
  catch {
    alert("the category or value was not choosen");
  }
 
    
}
//adding of question values to every player
function addResult()
{
   for(let i=1;i<users.length+1;i++){
     let user=JSON.parse(window.localStorage.getItem(`User${i}`));
     if(document.getElementById(`${user.name}`).value==""){
      user.scores+=0;
     }
     else{
      user.scores+=parseInt(document.getElementById(`${user.name}`).value);;
     }
     window.localStorage.setItem(`User${i}`,JSON.stringify(user));
   }
   location.reload();
}
