const express = require("express");
const router = express.Router();
const collum = require("../../shema/collum");
const task = require("../../shema/tasks");
const todo = require("../../shema/todo");

/*------------------------------------ C O L U M N------------------------------------*/

//GET request
router.get("/collums", (req, res) => {
  collum
    .find()
    .populate("tasks")
    .then(function (prod) {
      res.send(prod);
    });
});

//POST request
router.post("/collums", (req, res) => {
  const collums = new collum(req.body);
  collums.save().then((item) => {
    todo.findByIdAndUpdate(
      { _id: "5ead280542fb1815bdb738a3" },
      { $push: { collums: item._id } },
      { new: true },
      (err, todo) => {
        if (err) return res.status(500).send(err);
        res.send("todo changed");
      }
    );
  });
});

//PUT request
router.put("/collums", (req, res) => {
  console.log(req.body);
  collum.findByIdAndUpdate(
    req.body._id,
    req.body,
    { new: true },
    (err, todo) => {
      if (err) return res.status(500).send(err);
      res.send("column changed");
    }
  );
});

//PATCH request
router.patch("/collums", (req, res) => {
  collum.findByIdAndUpdate(
    req.body.sourceColumn._id,
    req.body.sourceColumn,
    { new: true },
    (err, todo) => {
      if (err) return res.status(500).send(err);
    }
  );
  collum.findByIdAndUpdate(
    req.body.destColumn._id,
    req.body.destColumn,
    { new: true },
    (err, todo) => {
      if (err) return res.status(500).send(err);
    }
  );
  res.send("column patched");
});

//DELETE request
router.delete("/collums", (req, res) => {
  collum.deleteOne({ _id: req.body.id }).then((item) => {
    todo.findByIdAndUpdate(
      { _id: "5ead280542fb1815bdb738a3" },
      { $pull: { collums: { $in: [req.body.id] } } },
      { new: true },
      (err, todo) => {
        if (err) return res.status(500).send(err);
        res.send("todo changed");
      }
    );
  });
});

/*------------------------------------ T A S K ------------------------------------*/

//GET request
router.get("/tasks", (req, res) => {
  task.find({}, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

//POST request
router.post("/tasks", (req, res) => {
  const tasks = new task(req.body);
  tasks.save().then((item) => {
    collum.findById(item.owner).then((column) => {
      console.log(column);
      collum.findByIdAndUpdate(
        column._id,
        { $push: { tasks: item._id } },
        { new: true },
        (err, todo) => {
          if (err) return res.status(500).send(err);
          res.send("task changed");
        }
      );
    });
  });
});

//PUT request
router.put("/tasks", (req, res) => {
  task.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, todo) => {
    if (err) return res.status(500).send(err);
    res.send("task changed");
  });
});
//DELETE request
router.delete("/tasks", (req, res) => {
  task.deleteOne({ _id: req.body.id }).then(res.send());
});
module.exports = router;

/*------------------------------------ T O D O ------------------------------------*/

//GET request
router.get("/todo", (req, res) => {
  todo
    .find({ _id: "5ead280542fb1815bdb738a3" })
    .populate({ path: "collums", populate: { path: "tasks" } })
    .then(function (prod) {
      res.send(prod);
    });
});

//PATCH request
router.patch("/todo", (req, res) => {
  todo.findByIdAndUpdate(
    { _id: "5ead280542fb1815bdb738a3" },
    { collums: req.body },
    { new: true },
    (err, todo) => {
      if (err) return res.status(500).send(err);
      res.send("column changed");
    }
  );
});
