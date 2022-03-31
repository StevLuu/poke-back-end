const express = require('express')
const router = express()
const Poke = require ('../models/poke')

router.get('/', async (req, res)=>{
    try{
        const poke = await Poke.find()
        res.send({
            success: true,
            data: poke
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
        const newPoke = await Poke.create(req.body)
        res.send({
            success: true,
            data: newPoke
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
        const poke = await Poke.findById(req.params.id)
        if(!poke){
            throw new Error("No poke by that id here?!")
        }
        res.send({
            success: true,
            data: poke
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
        const poke = await Poke.findByIdAndDelete(req.params.id)
        res.send({
            success: true,
            data: poke
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
        const poke = await Poke.findByIdAndUpdate(req.params.id, req.body, {new: true} )
        res.send({
            success: true,
            data: poke
        })
    }catch(err){
        res.send({
            success: false,
            data: err.message
        })

    }
})




module.exports = router