const express=require('express')
const {creatPayment,verifyPayment}=require('../controllers/paymentController')

const router=express.Router()


router.route('/order').post(creatPayment)
router.route('/verify').post(verifyPayment)

module.exports=router