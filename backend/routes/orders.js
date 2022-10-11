const {Order} = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const orderList =await Order.find().populate('user', 'name').sort({'dateOrdered': -1});

    if(!orderList){
        return res.status(500).json({success: false});
    }
    return res.send(orderList);
})

router.get(`/:id`, async(req, res) => {
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({path: 'orderItems', populate: 'product'});

    if(!order){
        res.status(500).json({success: false});
    };
    res.send(order);
})


router.post(`/`, async (req, res) =>{

    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }));

    const orderItemsIdsResolved = await orderItemsIds;

    const order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.user,
    })

    order = await order.save();

    if(!order)
        res.status(400).send('Error while creating order.');
    
    res.status(201).json(order);
});

module.exports = router;