const express = require('express');
const router = express.Router();
const {uploadBird} = require("../controllers/creatbird");

// 定义GET请求路由和其对应的控制器函数


// 定义POST请求路由和其对应的控制器函数
router.post('/add', uploadBird);

module.exports = router;
