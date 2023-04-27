const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
// Add your resource-specific routes here

module.exports = router;
router.post("/", authenticate, async (req, res) => {
    const { name, price } = req.body;
    try {
      const order = await Order.create({ name, price });
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: "Error creating order", error });
    }
  });
  
  // Get all baskets, including associated items
  router.get("/", async (req, res) => {
    try {
      const orders = await Order.findAll(); // how can we include the ITEMS associated with the baskets in this response?
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving orders", error });
    }
  });
  
  // Get a specific basket by ID, including associated items
  router.get("/:id", async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id); // how can we include the ITEMS associated with the baskets in this response?
  
      if (!order) {
        res.status(404).json({ message: "Order not found" });
      } else {
        res.json(order);
      }
    } catch (error) {
      res.status(500).json({ message: "Error retrieving order", error });
    }
  });
  
  // Update a basket by ID
  router.put("/:id", authenticate, async (req, res) => {
    const { name, price } = req.body;
  
    try {
      const newOrder = {};
      if (name !== undefined) {
        newOrder.name = name;
      }
      if (price !== undefined) {
        newOrder.price = price;
      }
      const [updated] = await Order.update(newOrder, {
        where: { id: req.params.id },
      });
  
      if (updated) {
        const updatedOrder = await Order.findByPk(req.params.id);
        res.json(updatedOrder);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating order", error });
    }
  });
  
  // Delete a basket by ID
  router.delete("/:id", authenticate, async (req, res) => {
    try {
      const deleted = await Order.destroy({
        where: { id: req.params.id },
      });
  
      if (deleted) {
        res.status(204).json({ message: "Order deleted" });
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting order", error });
    }
  });

  
  