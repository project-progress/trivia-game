class User{
  constructor(n){
    this.name = n;
    this.scores = 0;
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
      users.push(new User(value));
      let usersContainer = document.getElementById("usersContainer");
      let usersHTML = "";
      users.forEach(user => {
        usersHTML += `<div class="mb-3">
            <label>${user.name} - ${user.scores}</label>
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
            let info=data[Math.round(Math.random()*10)].title;
            document.getElementById(`r${i}`).nodeValue=info;
            document.getElementById(`l${i}`).innerHTML= info;
          }
      })
   })
   
}