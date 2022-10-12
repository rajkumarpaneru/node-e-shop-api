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
    .populate({path: 'orderItems', populate: {path: 'product', populate: 'category'}});

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

    const totalPrices = await Promose.all(orderItemsIdsResolved.map(async (orderItemId)=>{
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
    }));

    const totalPrice = totalPrices.reduce((a,b) => a + b, 0)


    const order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })

    order = await order.save();

    if(!order)
        res.status(400).send('Error while creating order.');
    
    res.status(201).json(order);
});

router.put(`/:id`, async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status 
        },
        {new: true}
    )

    if(!order)
        res.status(500).send('Error while updating order status');
    
    res.status(201).json(order);
});

router.delete(`/:id`, async (req, res) => {
    Order.findByIdAndRemove(req.params.id)
    .then(async order => {
        if(order){
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success: true, message: 'Order is deleted.'});
        } else {
            return res.status(404).json({success: false, message: 'Order not found'})
        }
    })
    .catch(err => {
        return res.status(400).json({success:false, error: err});
    });
});

router.get(`/total-sales`, async (req, res) => {
    const totalSales = await Order.aggregate([
        {$group: { _id: null, totalsales: {$sum : '$totalPrice'}}}
    ])

    if(!totalSales){
        return res.status(400).send('The total sales amount cannot be generated.')
    }

    return res.send({totalSales: totalSales.pop().totalsales});
})

router.get(`/users/:userid/orders`, async (req, res) => {
    const userOrderList =await Order.find({user: req.params.userId})
    .populate({path: 'orderItems', populate: {path: 'product', populate: 'category'}})
    .sort({'dateOrdered': -1});

    if(!userOrderList){
        return res.status(500).json({success: false});
    }
    return res.send(userOrderList);
})

module.exports = router;