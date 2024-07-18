const express = require('express');
const router = express.Router();

//  routes
router.get('/', (req, res) => {
    res.send('Hello from the API!');
});

router.get('/users', (req, res) => {
    res.json([{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }]);
});

module.exports = router;