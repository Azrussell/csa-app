const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");

// Add your resource-specific routes here

module.exports = router;
router.post("/", authenticate, async (req, res) => {
    const { name, price } = req.body;
    try {
      const item = await Item.create({ name, price });
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ message: "Error creating item", error });
    }
  });
  
  // Get all items, including associated items
  router.get("/", async (req, res) => {
    try {
      const orders = await Item.findAll(); // how can we include the ITEMS associated with the orders in this response?
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving items", error });
    }
  });
  
  // Get a specific item by ID, including associated items
  router.get("/:id", async (req, res) => {
    try {
      const item = await Item.findByPk(req.params.id); // how can we include the ITEMS associated with the items in this response?
  
      if (!item) {
        res.status(404).json({ message: "Item not found" });
      } else {
        res.json(item);
      }
    } catch (error) {
      res.status(500).json({ message: "Error retrieving item", error });
    }
  });
  
  // Update a item by ID
  router.put("/:id", authenticate, async (req, res) => {
    const { name, price } = req.body;
  
    try {
      const newItem = {};
      if (name !== undefined) {
        newItem.name = name;
      }
      if (price !== undefined) {
        newItem.price = price;
      }
      const [updated] = await Item.update(newItem, {
        where: { id: req.params.id },
      });
  
      if (updated) {
        const updatedBasket = await Item.findByPk(req.params.id);
        res.json(updatedBasket);
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating item", error });
    }
  });
  
  // Delete a item by ID
  router.delete("/:id", authenticate, async (req, res) => {
    try {
      const deleted = await Item.destroy({
        where: { id: req.params.id },
      });
  
      if (deleted) {
        res.status(204).json({ message: "Item deleted" });
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting item", error });
    }
  });

  
  