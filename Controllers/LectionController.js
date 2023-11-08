var express = require('express');
const url = require('url');
const { Sequelize, DataTypes, Model } = require('sequelize');
const Lection = require('../Models/Lection');

exports.findLection = function(req, res) {
    const lection = Lection.findOne({ where: { id: req.body.params.id } })
    lection.then((result) => {
        return res.send({ error: false, data: result });
    });
    lection.catch((error) => {
        return res.send({ error: error, data: null, message: 'Empty query.' })
    })       
}