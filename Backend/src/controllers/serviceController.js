// src/controllers/serviceController.js

// Get all services
export const getServices = async (req, res) => {
  try {
    const services = await getAllServices();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single service
export const getService = async (req, res) => {
  try {
    const service = await getServiceById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create service
export const addService = async (req, res) => {
  try {
    const { title, description, price, duration, thumbnail_url } = req.body;
    const newService = await createService({
      title,
      description,
      price,
      duration,
      thumbnail_url,
    });
    res.status(201).json(newService);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update service
export const editService = async (req, res) => {
  try {
    const updated = await updateService(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete service
export const removeService = async (req, res) => {
  try {
    await deleteService(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
