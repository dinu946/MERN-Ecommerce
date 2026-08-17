const express = require('express')
const {getAdminState}=require('../controllers/AnalaticsControllers')
const {protect,admin}=require('../middleware/authMiddleware')
const router = express.Router()

router.get('/',protect,admin,getAdminState)


module.exports=router