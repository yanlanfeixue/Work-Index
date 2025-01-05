// imageLoader.js
/**
 * 加载图片函数
 * 
 * 该函数用于将一组图片加载到指定的容器中每个图片会被包裹在一个div.box中
 * 此函数在DOM内容完全加载后执行，确保了操作DOM元素时的安全性
 * 
 * @param {string} containerId - 图片容器的ID，用于指定图片应该加载到哪个HTML元素中
 * @param {Array<string>} imageList - 包含图片URL的数组，指定了需要加载的图片资源
 */

function loadImages(containerId, imageList) {
    // 确保DOM内容完全加载后执行回调函数
    document.addEventListener("DOMContentLoaded", function() {
        // 获取图片容器元素
        const container = document.getElementById(containerId);
        // 遍历图片URL数组
        imageList.forEach(imageSrc => {
            // 创建用于包裹图片的div元素
            const box = document.createElement('div');
            box.className = 'box';
            // 创建图片元素并设置其src属性和alt属性
            const img = document.createElement('img');
            img.src = imageSrc;
            // 提取文件名作为alt属性值
            img.alt = imageSrc.split('/').pop();
            // 将图片元素添加到div.box中
            box.appendChild(img);
            // 将div.box添加到图片容器中
            container.appendChild(box);
        });
    });
}