module.exports = {
    //shift values in an array
    getMillis: function (time) {
      let hrs = time.split(':').slice(0,1)
      let mins = time.split(':').slice(1,2)
      let secs = 0
      if (time.length>5) {
        secs = time.split(':').slice(2,3)
      }
      let toDeduct = (parseInt(hrs) * 3600000) + (parseInt(mins) * 60000) + (parseInt(secs) * 1000)
      return toDeduct
      }
  };
  