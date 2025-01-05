const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// 图片文件夹路径
const imageFolderPath = './image';

// 提供静态文件（如index.html和image文件夹中的图片）
app.use(express.static(path.join(__dirname, '.')));

// 获取图片文件名列表的API
app.get('/api/images', (req, res) => {
    fs.readdir(imageFolderPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: '无法读取文件夹' });
        }

        // 过滤出图片文件（假设图片文件扩展名为.jpg）
        const imageFiles = files.filter(file => path.extname(file).toLowerCase() === '.jpg');
        res.json(imageFiles);
    });
});

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});