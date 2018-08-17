$(document).ready(function(){
  var config = {
      apiKey: "AIzaSyD2xSa6BNQRyT5tJFK6Hhf6RPJzGrN35BI",
      authDomain: "tact-masters-you-drive.firebaseapp.com",
      databaseURL: "https://tact-masters-you-drive.firebaseio.com",
      projectId: "tact-masters-you-drive",
      storageBucket: "tact-masters-you-drive.appspot.com",
      messagingSenderId: "479313795676"
  };

  firebase.initializeApp(config);

  var database = firebase.database();
  var visited = [];
  var geoCodedlat;
  var geoCodedlng;
  var name;

  $(document).on("click",".taxi",function() {
      var isHere = false;
      database.ref().push({
        entry: test
      });
      console.log("fire")
      for (i = 0; i < visited.length; i++){
          if (visited[i].name === name){
              var ID = visited[i].key;
              database.ref(ID).update({
                  count: visited[i].count +1
              })
          }
      }
      if (isHere === false) {
          database.ref().push({
              name: name,
              lat: geoCodedlat,
              lng: geoCodedlng,
              count: 0
          })
      }
      console.log(visited)
  })

  database.ref().on("child_added", function(snap){
      var sv = snap.val();
      sv.key = snap.key;
      visited.push(sv);

      var recBar = $("<a>");
      recBar.attr("href", "main.html");
      recBar.html(sv.name);
  })
})
