const Store = require('../models/storeModel');

// Create a new store (Protected)
const createStore = async (req, res) => {
  try {
    const { name, description, address, contact } = req.body;

    if (!name || !description || !address || !contact) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newStore = new Store({
      name,
      description,
      owner: req.user._id, // auto from auth
      address,
      contact,
    });

    const savedStore = await newStore.save();
    res.status(201).json(savedStore);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all stores (with optional search)
const getAllStores = async (req, res) => {
  try {
    const { keyword } = req.query;

    const filter = keyword
      ? { name: { $regex: keyword, $options: 'i' } }
      : {};

    const stores = await Store.find(filter).populate('owner', 'name email');
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single store by ID
const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).populate('owner', 'name email');

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a store (Protected)
const updateStore = async (req, res) => {
  try {
    const { name, description, address, contact } = req.body;

    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Optional: Allow only owner to update
    // if (store.owner.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: 'Unauthorized' });
    // }

    store.name = name || store.name;
    store.description = description || store.description;
    store.address = address || store.address;
    store.contact = contact || store.contact;

    const updatedStore = await store.save();
    res.status(200).json(updatedStore);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a store (Protected)
const deleteStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    await store.remove();
    res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  deleteStore,
};
