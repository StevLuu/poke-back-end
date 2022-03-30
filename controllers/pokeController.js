const express = require('express')
const router = express()
const Item = require ('../models/poke')

router.get('/', async (req, res)=>{
    try{
        const items = await Item.find()
        res.send({
            success: true,
            data: items
        })
    }catch(err){
        res.send({
            success: false,
            data: err.message
        })
    }
})

router.post('/', async (req, res)=>{
    console.log(req.body)
    try{
        const newItem = await Item.create(req.body)
        res.send({
            success: true,
            data: newItem
        })
    }catch(err){
        res.send({
            success: false,
            data: err.message
        })
    }
})

router.get('/:id', async (req, res)=>{
    try{
        const item = await Item.findById(req.params.id)
        if(!item){
            throw new Error("No item by that id here?!")
        }
        res.send({
            success: true,
            data: item
        })
    }catch(err){
        res.send({
            success: false,
            data: err.message
        })

    }
})

router.delete('/:id', async (req, res)=>{
    try{
        const item = await Item.findByIdAndDelete(req.params.id)
        res.send({
            success: true,
            data: item
        })
    }catch(err){
        res.send({
            success: false,
            data: err.message
        })

    }
})

router.put('/:id', async (req, res)=>{
    try{
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, {new: true} )
        res.send({
            success: true,
            data: item
        })
    }catch(err){
        res.send({
            success: false,
            data: err.message
        })

    }
})




module.exports = router