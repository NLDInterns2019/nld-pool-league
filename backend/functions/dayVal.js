module.exports = {
    //shift values in an array
    dayValue: function (day) {
        day = day.substring(0,3);
        place = 0;

        switch(day) {
            case "Mon":
              place = 1;
              break;
            case "Tue":
              place = 2;
              break;
            case "Wed":
              place = 3;
              break;
            case "Thu":
              place = 4;
              break;
            case "Fri":
              place = 5;
              break;
            case "Sat":
              place = 6;
              break;
            case "Sun":
              place = 7;
              break;
          }
          return place;
      }
    

    
  };
  