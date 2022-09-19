const express = require("express")
const router = express.Router()

const { createIntern } = require("../controllers/internController")
const { createCollege, functionupInterns } = require("../controllers/collegeController")



router.post("/functionup/colleges", createCollege)
router.post("/functionup/interns", createIntern)
router.get("/functionup/collegeDetails", functionupInterns)



module.exports = router