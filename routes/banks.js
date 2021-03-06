const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/images');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype ==='image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
 }
const upload = multer({storage: storage, limits: {
  fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})
const Bank = require('../model/Bank');
router.get("/", async (req, res) => {
	const banks = await Bank.find()
	res.send(banks)
})
router.post("/", upload.single('bankImage'), async (req, res) => {

	const data = {
        nameBank: req.body.nameBank,
        nomerRekening: req.body.nomerRekening,
        name: req.body.name,
        bankImage: req.file.path
	}

	const checkRek = await Bank.findOne({nomerRekening: req.body.nomerRekening})
	if(checkRek) {
		return res.status(409).json({
			status: "error",
			message: "Account Number Bank Already Exist"
		})
	}
	else {
		const createBank = await Bank.create(data);
		return res.json({
			status: "sucess",
			data: data
		})
	}

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
    const id = req.params.id
    Bank.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Member with id=${id}. Maybe Member was not found!`
        });
      } else {
        res.send({
          message: "Bank was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Membber with id=" + id
      });
    });
})


module.exports = router;
