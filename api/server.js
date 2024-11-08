// BUILD YOUR SERVER HERE
const express = require("express");
const User = require("./users/model");

const server = express();
server.use(express.json());

console.log(User);

server.get("/", (req, res) => {
  res.send("Server Running");
  console.log("Server Running");
});

// POST: Create new User
server.post("/api/users", (req, res) => {
    
    if(!req.body.name || !req.body.bio){
        res.status(400).json({
            message: "provide name and bio"
        });
    } else{        
        User.insert(req.body)
            .then(createdUser => {
            console.log(createdUser);
            res.status(201).json(createdUser);
            })
            .catch((err) => {
            res.status(500).json({
                message: "error getting users",
                err: err.message,
                stack: err.stack,
            });
            });        
    }
});

// GET: Returns list of all users
server.get("/api/users", (req, res) => {
  User.find()
    .then((users) => {
      console.log(users);
      res.json(users);
    })
    .catch((err) => {
      res.status(500).json({
        message: "error getting users",
        err: err.message,
        stack: err.stack,
      });
    });
});

// GET: Returns one user by ID
server.get("/api/users/:id", async (req, res) => {
    const possibleUser = await User.findById(req.params.id)
    if(!possibleUser){
        res.status(404).json({
            message:"does not exist"
        });
    }else{
        User.findById(req.params.id)
            .then((user) => {
            console.log(user);
            res.status(200).json(user);
            })
            .catch((err) => {
            res.status(500).json({
                message: `error getting user id: ${req.params.id}`,
                err: err.message,
                stack: err.stack,
            });
            });
    }
    
});




// DELETE: Delete a user by id
server.delete("/api/users/:id", async (req, res) => {
    const possibleUser = await User.findById(req.params.id)
    if(!possibleUser){
        res.status(404).json({
            message:'does not exist'
        })
    } else{
        User.remove(req.params.id)
        .then((user) => {
          console.log(user);
          res.json(user);
        })
        .catch((err) => {
          res.status(500).json({
            message: "error removing user",
            err: err.message,
            stack: err.stack,
          });
        });
    }
});
   


// PUT: Make change to user of id
server.put("/api/users/:id", async (req, res) => {
    try{
        const possibleUser = await User.findById(req.params.id)
        if(!possibleUser) {
            res.status(404).json({
                message:"does not exist"
            })
        } else {
            if(!req.body.name || !req.body.bio ){                
                res.status(400).json({
                    message:"provide name and bio"
                })
            } else {
                const updatedUser = await User.update(req.params.id,req.body)       
                res.status(404).json(updatedUser)
            }
        }
    }
    catch(err) {
        res.status(500).json({
            message: "error changing user",
            err: err.message,
            stack: err.stack,
        });
    }
})


server.use("*", (req, res) => {
  res.status(404).json({
    message: "not found",
  });
});

module.exports = server;
