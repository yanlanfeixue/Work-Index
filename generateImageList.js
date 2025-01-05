const fs = require('fs');
const path = require('path');

// 指定要读取的文件夹路径

var folderName = 'ByeWorld';
const folderPath = './image/'+folderName;

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('无法扫描目录:', folderPath);
        return console.error('错误详情:', err);
    }

    console.log('成功读取文件夹内容:', files);

    // 过滤出jpg, png, gif文件
    const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ext === '.jpg' || ext === '.png' || ext === '.gif';
    });

    console.log('过滤后的图片文件:', imageFiles);

    // 构建imageList数组
    const imageList = imageFiles.map(file => './' + path.join(folderPath, file).replace(/\\/g, '/'));

    // 将imageList写入到image.js文件中
    const content = `const ${folderName}ImageList = [\n    "${imageList.join('",\n    "')}"\n];`;

    fs.writeFile(folderName + '.js', content, (err) => {
        if (err) {
            return console.error('写入文件时出错:', err);
        }
        console.log(folderName + '.js文件已成功创建');
    });
});