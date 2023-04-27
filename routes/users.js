var express = require('express');
var router = express.Router();
const { authenticate } = require("../middlewares/auth");

module.exports = router;
/* GET users listing. */
router.get('/', authenticate, (req, res, next) => {
  res.send('respond with a resource');
});

router.post("/", authenticate, async (req, res) => {
    const { name, price } = req.body;
    try {
      const user = await User.create({ name, price });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
  });
  
  // Get all users, including associated items
  router.get("/", async (req, res) => {
    try {
      const users = await User.findAll(); // how can we include the ITEMS associated with the users in this response?
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving users", error });
    }
  });
  
  // Get a specific user by ID, including associated items
  router.get("/:id", async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id); // how can we include the ITEMS associated with the users in this response?
  
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.json(user);
      }
    } catch (error) {
      res.status(500).json({ message: "Error retrieving user", error });
    }
  });
  
  // Update a user by ID
  router.put("/:id", authenticate, async (req, res) => {
    const { name, price } = req.body;
  
    try {
      const newUser = {};
      if (name !== undefined) {
        newUser.name = name;
      }
      if (price !== undefined) {
        newUser.price = price;
      }
      const [updated] = await User.update(newUser, {
        where: { id: req.params.id },
      });
  
      if (updated) {
        const updatedItem = await User.findByPk(req.params.id);
        res.json(updatedItem);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating user", error });
    }
  });
  
  // Delete a user by ID
  router.delete("/:id", authenticate, async (req, res) => {
    try {
      const deleted = await User.destroy({
        where: { id: req.params.id },
      });
  
      if (deleted) {
        res.status(204).json({ message: "User deleted" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error });
    }
  });
