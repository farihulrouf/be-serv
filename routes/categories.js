const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();

const Category = require('../model/Category')
router.get("/", async (req, res) => {
	const categories = await Category.find()
	res.send(categories)
})
router.post("/", async (req, res) => {
	
    const data = {
        name: req.body.name,
    }

    const createdCategory =  await Category.create(data);
    return res.json({
        status: 'success',
        data: {
            id: createdCategory.id, 
            name: createdCategory.name,
        } 
    });
})


router.get("/:id", async (req, res) => {
	try {
		const category = await Category.findOne({ _id: req.params.id })
		res.send(category)
	} catch {
		res.status(404)
		res.send({ error: "Category doesn't exist!" })
	}
})

router.put('/:id', async (req, res) => {

    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };
        const result = await Category.findByIdAndUpdate(
            id, updatedData, options
        )
        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})



router.delete("/:id", async (req, res) => {
	try {
		await Category.deleteOne({ _id: req.params.id })
		res.status(204).send({ success: "Success deleted"})
	} catch {
		res.status(404)
		res.send({ error: "Category doesn't exist!" })
	}
})

module.exports = router;
