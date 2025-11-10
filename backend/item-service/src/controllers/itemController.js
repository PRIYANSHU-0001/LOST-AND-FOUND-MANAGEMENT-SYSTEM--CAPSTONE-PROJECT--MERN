const Item = require('../models/Item');

// Create Item with image upload support
exports.createItem = async (req, res) => {
  try {
    const { title, description, location, category, status } = req.body;
    const user = req.user.id;
    // multer se file upload hua toh imageURL set karo
    let imageURL = '';

    if (req.file) {
      imageURL = `/uploads/${req.file.filename}`;
    }

    const newItem = new Item({
      title,
      description,
      imageURL,
      location,
      category,
      status,
      user,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Items (with optional filters)
exports.getAllItems = async (req, res) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.category) query.category = req.query.category;
    if (req.query.location) query.location = req.query.location;

    const items = await Item.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Single Item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Item (owner only)
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    Object.assign(item, req.body);
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Item (owner only)
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await item.deleteOne();
    res.json({ message: "Item deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
