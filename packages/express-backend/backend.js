// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());
const users = {
    users_list: [
      {
        id: "xyz789",
        name: "Charlie",
        job: "Janitor"
      },
      {
        id: "abc123",
        name: "Mac",
        job: "Bouncer"
      },
      {
        id: "ppp222",
        name: "Mac",
        job: "Professor"
      },
      {
        id: "yat999",
        name: "Dee",
        job: "Aspring actress"
      },
      {
        id: "zap555",
        name: "Dennis",
        job: "Bartender"
      }
    ]
  };

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const findUserByJob = (job) =>
    users["users_list"].filter((user) => user["job"] === job);

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd);
  res.send(201);
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.get("/users/:name/:job", (req, res) => {
  const name = req.params["name"]; //or req.params.id  
  const job = req.params["job"];
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    let resultByJob = findUserByJob(job);
    resultByJob = { users_list: resultByJob };
    if (result["users_list"].length === 0 || resultByJob["users_list"].length === 0) {
        res.status(404).send("Resource not found.");
        return;
    }
    res.send(result);
  } else {
    res.send(users);
  }
});
app.delete("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    }
    else {
        users["users_list"] = users["users_list"].filter((user) => user["id"] !== id);
        res.send(`User with id ${id} deleted.`);
    }
})



app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
    res.send(users);
  });

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});