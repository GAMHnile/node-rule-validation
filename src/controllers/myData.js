const myDataHandler = (req, res)=>{
    //replace with your details
    res.status(200).json({
        message: "My Rule-Validation API",
        status: "success",
        data: {
          name: "Amos Burton",//replace with your details
          github: "@amosburton",//replace with your details
          email: "amosburton@rocinantecrew.com",//replace with your details
          mobile: "08069920011",//replace with your details
          twitter: "@amosb"//replace with your details
        }
      })
}

module.exports = {myDataHandler};