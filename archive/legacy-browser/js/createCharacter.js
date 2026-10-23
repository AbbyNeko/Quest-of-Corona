  // Getting references to our form and input
  const startBtn = $("#startBtn");

//On Click event for Start button
startBtn.on("click", (event) => {

  event.preventDefault();

  let pathId = startBtn.attr("path");
  let userId = startBtn.attr("user");
  //console.log(`path id - ${pathId}`);
  //console.log(`user id - ${userId}`);

  //reset stats
  $.ajax({
    method: 'PUT',
    url: "/rpg-api/reset",
    data: {id: pathId}
  });

  //saving userId to localStorage
  localStorage.setItem("userId", userId);

  if(pathId === 'false') {
    console.log("creating character");
    console.log($("input[name='character-class']:checked").val());
    createCharacter(userId, $("input[name='character-class']:checked").val());
 
  } else {
    console.log("going straight to plot");

    //saving pathId
    localStorage.setItem("pathId", pathId);

    //sending request to plot
    window.location = "/plot/"+pathId;

  }
    
});

//Creates Character Path, updates user and sends back path ID
function createCharacter(userId, characterId) {
    $.post("/rpg-api/createCharacter", {
      userId: userId,
      characterClassId: characterId
    })
      .then((path) => {
       //saving pathId
        localStorage.setItem("pathId", path.id);

        window.location = "/plot/"+path.id;   
      })
      .catch(err => {
        console.log(err);
      });
  }



