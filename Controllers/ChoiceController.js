const Choice = require('../Models/Choice');

exports.delete = function(req, res) {
    try {
        Choice.update(
            { inactive: new Date() },
            { where: { id: req.body.id } }
        ).then(data => {
            res.json({ok:true});
        }) 
    } catch(error) {
        res.status(404).send(error.message)
    }
}