const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const Member = require('../model/Member')
router.get("/", async (req, res) => {
	const member = await Member.find()
	res.send(member)
})

router.post("/", async (req, res) => {
	
    const data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
    }

    const check_email = await Member.findOne({email: req.body.email})
    if(check_email){
        return res.status(409).json({
            status: 'error',
            message: 'Email Already Exist'
        });
    }
    else {
        const createdMember =  await Member.create(data);
        return res.json({
            status: 'success',
            data: {
                id: createdMember.id, 
                firstName: createdMember.firstName,
            } 
        });
    }
    
})

router.get("/:id", async (req, res) => {
	try {
		const member = await Member.findOne({ _id: req.params.id })
		res.send(member)
	} catch {
		res.status(404)
		res.send({ error: "Member doesn't exist!" })
	}
})

router.delete("/:id", async (req, res) => {
    const id = req.params.id
    Member.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Member with id=${id}. Maybe Member was not found!`
        });
      } else {
        res.send({
          message: "Tutorial was deleted successfully!"
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
