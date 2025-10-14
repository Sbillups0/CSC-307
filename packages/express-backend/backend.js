// backend.js
import express from "express";
import cors from "cors";
import userServices from "./user_services.js";

const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());

//List of all endpoints

//Create a new user
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userServices.addUser(userToAdd)
    .then((addedUser) => {
      res.status(201).send(addedUser);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send("Error adding user.");
    }
  );
});
//Get user by ID
app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  userServices.findUserById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error fetching user");
    });
});

//Delete user by ID
app.delete("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    userServices.findUserById(id)
        .then((user) => {
            if (!user) {
                res.status(404).send("Resource not found.");
                return;
            }
            //Delete the user if found
            return user.deleteOne();
        })
        .then(() => {
            res.status(200).send("User deleted successfully.");
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error deleting user");
        });
});



app.get("/", (req, res) => {
  res.send("Hello World!");
});

//Get user with optional filters
app.get("/users", (req, res) => {
    const {name, job} = req.query;
    let promise;
    if(name && job){
        promise = userServices.findUserByNameAndJob(name, job);
    }
    else{
        promise = userServices.getUsers(name, job);
    }

    promise
      .then((users) => {
        if(!users || users.length === 0){
            res.status(404).send("Resource not found.");
        }
        else{
            res.send({ users_list: users });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error fetching users");
      });
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});