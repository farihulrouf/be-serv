const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();

const Bank = require('../model/Bank')
router.get("/", async (req, res) => {
	const banks = await Bank.find()
	res.send(banks)
})
router.post("/", async (req, res) => {
	const bank = new Bank({
        nameBank: req.body.nameBank,
        nomerRekening: req.body.nomerRekening,
        name: req.body.name,
	})
	await bank.save()
	res.send(bank)
})


router.get("/:id", async (req, res) => {
	try {
		const bank = await Bank.findOne({ _id: req.params.id })
		res.send(bank)
	} catch {
		res.status(404)
		res.send({ error: "Bank doesn't exist!" })
	}
})

router.put('/:id', async (req, res) => {

    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };
        const result = await Bank.findByIdAndUpdate(
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
		await Bank.deleteOne({ _id: req.params.id })
		res.status(204).send({ success: "Success deleted"})
	} catch {
		res.status(404)
		res.send({ error: "Bank doesn't exist!" })
	}
})


module.exports = router;
