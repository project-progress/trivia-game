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