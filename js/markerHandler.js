var tableNumber=null;
AFRAME.registerComponent("markerhandler", {
  init: async function () {
    if(tableNumber===null){
      this.askTableNumber();
    }
    
    //get the dishes collection from firestore database
    var dishes = await this.getDishes();

    //markerFound event
    this.el.addEventListener("markerFound", () => {
      var markerId = this.el.id;      
      this.handleMarkerFound(dishes, markerId);
    });

    //markerLost event
    this.el.addEventListener("markerLost", () => {
      this.handleMarkerLost();
    });

  },

  askTableNumber:function(){
    var iconUrl="https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png";
    swal({
      title:"Welcome to The restraunt",
      icon: iconUrl,
      content:{
        element:"input",
        attributes:{
          placeHolder:"Enter Table No.",
          type:"Number",
          min:1
        }
      },
      closeOnClickOutside:false,

    }).then (inputValue=>{
      tableNumber=inputValue
    })
  },

  handleMarkerFound: function (dishes, markerId) {
    var todaysDate=new Date();
    var todaysDay=todaysDate.getDay();
    var days=[
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    ];
    var dish=dishes.filter(dish=>dish.id===markerId)[0];

    if(dish.unavailable_days.includes(days[todaysDay])){
      swal({
        icon: "warning",
        title: dish.dish_name,
        text: "Dish not available today",
        timer: 5000,
        buttons: false 
      })
    }else{
    
    // Changing button div visibility
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "flex";

    var ratingButton = document.getElementById("rating-button");
    var orderButtton = document.getElementById("order-button");

    // Handling Click Events
    ratingButton.addEventListener("click", function () {
      swal({
        icon: "warning",
        title: "Rate Dish",
        text: "Work In Progress"
      });
    });

    orderButtton.addEventListener("click", () => {
      swal({
        icon: "https://i.imgur.com/4NZ6uLY.jpg",
        title: "Thanks For Order !",
        text: "Your order will serve soon on your table!"
      });
    });

    // Changing Model scale to initial scale
    var dish = dishes.filter(dish => dish.id === markerId)[0];

    var model = document.querySelector(`#model-${dish.id}`);
    model.setAttribute("position", dish.model_geometry.position);
    model.setAttribute("rotation", dish.model_geometry.rotation);
    model.setAttribute("scale", dish.model_geometry.scale);
  }
  },
  handleMarkerLost: function () {
    // Changing button div visibility
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "none";
  },
  //get the dishes collection from firestore database
  getDishes: async function () {
    return await firebase
      .firestore()
      .collection("dishes")
      .get()
      .then(snap => {
        return snap.docs.map(doc => doc.data());
      });
  }
});
