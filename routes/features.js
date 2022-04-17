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
const Feature = require('../model/Feature');
router.get("/", async (req, res) => {
	const features = await Feature.find()
	res.send(features)
})
router.post("/", upload.single('imageUrl'), async (req, res) => {

	const data = {
        name: req.body.name,
        qty: req.body.qty,
        imageUrl: req.file.path
	}

	
	const createFeature = await Feature.create(data);
	    return res.json({
			status: "sucess",
			data: data
	})
	

})


router.get("/:id", async (req, res) => {
	try {
		const feature = await Feature.findOne({ _id: req.params.id })
		res.send(feature)
	} catch {
		res.status(404)
		res.send({ error: "Feature doesn't exist!" })
	}
})

router.put('/:id', async (req, res) => {

    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };
        const result = await Feature.findByIdAndUpdate(
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
    Feature.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Feature with id=${id}. Maybe Member was not found!`
        });
      } else {
        res.send({
          message: "Feature was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Feature with id=" + id
      });
    });
})


module.exports = router;
