var express = require('express');
var router = express.Router();

//GET handler for /api/8ball_fixtures
router.get('/', (req,res) => {
    res.send("/api/8ball_fixture")
})
module.exports = router;
