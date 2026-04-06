import Utensil from '../models/Utensil.js';

export const getUtensils = async (req, res) => {
    try {
        const utensils = await Utensil.find({});
        res.json(utensils);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createUtensil = async (req, res) => {
    try {
        const { name, description, pricePerDay, availableQuantity, image, category } = req.body;
        const utensil = new Utensil({ name, description, pricePerDay, availableQuantity, image, category });
        const createdUtensil = await utensil.save();
        res.status(201).json(createdUtensil);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUtensil = async (req, res) => {
    try {
        const { name, description, pricePerDay, availableQuantity, image, category } = req.body;
        const utensil = await Utensil.findById(req.params.id);

        if (utensil) {
            utensil.name = name || utensil.name;
            utensil.description = description || utensil.description;
            utensil.pricePerDay = pricePerDay !== undefined ? pricePerDay : utensil.pricePerDay;
            utensil.availableQuantity = availableQuantity !== undefined ? availableQuantity : utensil.availableQuantity;
            utensil.image = image || utensil.image;
            utensil.category = category || utensil.category;

            const updatedUtensil = await utensil.save();
            res.json(updatedUtensil);
        } else {
            res.status(404).json({ message: 'Utensil not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUtensil = async (req, res) => {
    try {
        const utensil = await Utensil.findById(req.params.id);
        if (utensil) {
            await utensil.deleteOne();
            res.json({ message: 'Utensil removed' });
        } else {
            res.status(404).json({ message: 'Utensil not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
