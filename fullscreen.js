// 当DOM内容加载完成后，执行回调函数
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有类名为'box'的元素
    const boxes = document.querySelectorAll('.box');
    // 创建一个新的div元素，用于后续显示全屏图片
    const container = document.createElement('div');
    // 设置新创建的div元素的类名为'fullscreen'
    container.className = 'fullscreen';
    // 将新创建的div元素添加到body的子元素中
    document.body.appendChild(container);

    let currentIndex = -1; // 当前显示的图片索引
    let scale = 1; // 图片的缩放比例
    const minScale = 0.5; // 最小缩放比例
    const maxScale = 3; // 最大缩放比例

    let isDragging = false; // 标志是否正在拖拽
    let startX, startY; // 鼠标按下时的初始位置
    let imgOffsetX = 0, imgOffsetY = 0; // 图片相对于容器的偏移量
    let initialTransform; // 图片在鼠标按下时的初始变换矩阵

    // 为每个'box'元素添加点击事件监听器
    boxes.forEach((box, index) => {
        box.addEventListener('click', function() {
            currentIndex = index; // 记录当前点击的图片索引
            showFullscreenImage(currentIndex);
        });
    });

    // 显示全屏图片的函数
    function showFullscreenImage(index) {
        // 重置缩放比例
        currentScale = 1;
        initialScale = 1;
        // 重置平移偏移量
        imgTouchOffsetX = 0;
        imgTouchOffsetY = 0;
        
        if (index < 0 || index >= boxes.length) return;
        // 获取当前点击的'box'元素内部的img元素的src属性
        const imgSrc = boxes[index].querySelector('img').src;
        // 创建一个新的img元素
        const img = document.createElement('img');
        // 设置新创建的img元素的src属性为获取到的图片地址
        img.src = imgSrc;
        // 清空container元素的内部HTML，以移除之前的图片
        container.innerHTML = ''; // 清空之前的图片
        // 将新创建的img元素添加到container元素中
        container.appendChild(img);
        // 显示container元素，并使用flex布局
        container.style.display = 'flex';
        // 重置缩放比例
        scale = 1;
        img.style.transform = `scale(${scale})`;
        img.style.transformOrigin = 'center center';
        // 重置拖拽状态
        isDragging = false;
        startX = startY = 0;
        imgOffsetX = imgOffsetY = 0;
        initialTransform = null; // 重置初始变换矩阵
    }


    // 处理触摸功能
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiped = false; // 添加标志来跟踪是否已经处理过一次滑动
    let initialDistance = 0; // 初始触摸点之间的距离
    let currentScale = 1; // 当前缩放比例
    let initialScale = 1; // 初始缩放比例
    let touchStartTime = 0; // 触摸开始时间
    let touchEndTime = 0; // 触摸结束时间
    const tapThreshold = 300; // 单击时间阈值（毫秒）
    const swipeThreshold = 30; // 滑动距离阈值（像素）

    let imgTouchOffsetX = 0; // 图片的初始X轴偏移量
    let imgTouchOffsetY = 0; // 图片的初始Y轴偏移量
    let initialTouchOffsetX = 0; // 双指触摸开始时的X轴偏移量
    let initialTouchOffsetY = 0; // 双指触摸开始时的Y轴偏移量
    let initialTouchCenterX = 0; // 双指触摸开始时的中心点X坐标
    let initialTouchCenterY = 0; // 双指触摸开始时的中心点Y坐标
    let currentTouchCenterX = 0; // 当前触摸中心点X坐标
    let currentTouchCenterY = 0; // 当前触摸中心点Y坐标

    container.addEventListener('touchstart', function(event) {
        event.preventDefault(); // 阻止默认的触摸行为

        touchStartTime = Date.now(); // 记录触摸开始时间

        if (event.touches.length === 1) {
            // 单指触摸
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
            isSwiped = false; // 重置标志
        } else if (event.touches.length === 2) {
            // 双指触摸
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            initialDistance = calculateDistance(touch1, touch2);
            initialScale = currentScale;

            // 保存当前的偏移量
            initialTouchOffsetX = imgTouchOffsetX;
            initialTouchOffsetY = imgTouchOffsetY;

            // 记录双指触摸开始时的中心点位置
            initialTouchCenterX = (touch1.clientX + touch2.clientX) / 2;
            initialTouchCenterY = (touch1.clientY + touch2.clientY) / 2;
        }
    });

    container.addEventListener('touchmove', function(event) {
        event.preventDefault(); // 阻止默认的触摸行为

        if (event.touches.length === 1) {
            // 单指触摸，处理拖动
            if (isSwiped) return; // 如果已经处理过一次滑动，则直接返回

            const endX = event.touches[0].clientX;
            const endY = event.touches[0].clientY;
            const deltaX = endX - touchStartX;
            const deltaY = endY - touchStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) { // 水平滑动
                if (Math.abs(deltaX) >= swipeThreshold) { // 检查滑动距离是否大于阈值
                    if (deltaX < 0) { // 向右滑动
                        currentIndex = (currentIndex + 1) % boxes.length;
                    } else { // 向左滑动
                        currentIndex = (currentIndex - 1 + boxes.length) % boxes.length;
                    }
                    showFullscreenImage(currentIndex);
                    isSwiped = true; // 设置标志为已处理
                }
            }
        } else if (event.touches.length === 2) {
            // 双指触摸，处理缩放和平移
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            const currentDistance = calculateDistance(touch1, touch2);
            const deltaScale = currentDistance / initialDistance;
            currentScale = initialScale * deltaScale;

            // 限制缩放比例在合理范围内
            currentScale = Math.max(minScale, Math.min(maxScale, currentScale));

            // 计算新的触摸中心点位置
            currentTouchCenterX = (touch1.clientX + touch2.clientX) / 2;
            currentTouchCenterY = (touch1.clientY + touch2.clientY) / 2;

            // 计算新的平移偏移量，确保图片的中心点相对于触摸中心保持不变
            const newImgTouchOffsetX = initialTouchOffsetX + (currentTouchCenterX - initialTouchCenterX) * (currentScale / initialScale);
            const newImgTouchOffsetY = initialTouchOffsetY + (currentTouchCenterY - initialTouchCenterY) * (currentScale / initialScale);

            imgTouchOffsetX = newImgTouchOffsetX;
            imgTouchOffsetY = newImgTouchOffsetY;

            const img = container.querySelector('img');
            if (img) {
                img.style.transform = `scale(${currentScale}) translate(${imgTouchOffsetX}px, ${imgTouchOffsetY}px)`;
                img.style.transformOrigin = 'center center';
            }
        }
    });
    
    container.addEventListener('touchend', function(event) {
        touchEndTime = Date.now(); // 记录触摸结束时间

        if (event.touches.length === 0) {
            // 所有触摸点都离开
            const touchDuration = touchEndTime - touchStartTime;

            if (touchDuration < tapThreshold && !isSwiped) {
                // 如果触摸时间很短且没有发生滑动，则认为是单击操作
                container.style.display = 'none';
                console.log('关闭图片');
            } else {
                // 检查是否是多点触控结束
                if (event.changedTouches.length > 1) {
                    // 两根或更多手指离开屏幕
                    console.log('两根手指都离开屏幕');
                    // 在这里添加下一项功能的触发逻辑
                }
            }
        }
    });
    // 计算两个触摸点之间的距离
    function calculateDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }




    // 处理键盘事件
    document.addEventListener('keydown', function(event) {
        if (container.style.display === 'flex') {
            switch (event.key) {
                case 'w':
                case 'a':
                case 'ArrowLeft':
                case 'ArrowUp':
                    event.preventDefault(); // 阻止默认行为
                    event.stopPropagation(); // 停止事件冒泡
                    currentIndex = (currentIndex - 1 + boxes.length) % boxes.length;
                    showFullscreenImage(currentIndex);
                    break;
                case 's':
                case 'd':
                case 'ArrowRight':
                case ' ':
                case 'ArrowDown':
                    event.preventDefault(); // 阻止默认行为
                    event.stopPropagation(); // 停止事件冒泡
                    currentIndex = (currentIndex + 1) % boxes.length;
                    showFullscreenImage(currentIndex);
                    break;
            }
        }
    });

    // 处理鼠标滚轮事件
    container.addEventListener('wheel', function(event) {
        event.preventDefault(); // 阻止默认的滚动行为

        // 根据滚轮的滚动方向调整缩放比例
        if (event.deltaY < 0) { // 向上滚动，放大图片
            scale *= 1.1;
        } else { // 向下滚动，缩小图片
            scale /= 1.1;
        }

        // 限制缩放比例在合理范围内
        scale = Math.max(minScale, Math.min(maxScale, scale));

        // 应用缩放变换
        const img = container.querySelector('img');
        if (img) {
            img.style.transform = `scale(${scale}) translate(${imgOffsetX}px, ${imgOffsetY}px)`;
            img.style.transformOrigin = 'center center';
        }
    });

    // 处理鼠标按下事件
    container.addEventListener('mousedown', function(event) {
        // 检查目标元素是否为图片
        if (event.target.tagName.toLowerCase() === 'img') {
            event.preventDefault(); // 阻止默认的拖动行为
            isDragging = true; // 设置拖动状态为true
            startX = event.clientX; // 记录鼠标按下的初始X坐标
            startY = event.clientY; // 记录鼠标按下的初始Y坐标
            const img = container.querySelector('img'); // 获取容器中的图片元素
            if (img) {
                // 获取图片的当前样式
                const style = window.getComputedStyle(img);
                const transform = style.transform; // 获取图片的变换属性
                initialTransform = transform; // 记录初始变换矩阵
            }
        }
    });

    // 处理鼠标移动事件
    container.addEventListener('mousemove', function(event) {
        // 如果正在拖拽图片
        if (isDragging) {
            // 获取容器内的图片元素
            const img = container.querySelector('img');
            // 如果找到图片元素
            if (img) {
                // 计算鼠标移动的距离
                const deltaX = event.clientX - startX;
                const deltaY = event.clientY - startY;
                // 更新图片的偏移量
                imgOffsetX += deltaX;
                imgOffsetY += deltaY;
                // 更新图片的位置
                img.style.transform = `scale(${scale}) translate(${imgOffsetX}px, ${imgOffsetY}px)`;
                // 设置变换的中心点
                img.style.transformOrigin = 'center center';

                // 更新鼠标位置
                startX = event.clientX;
                startY = event.clientY;
            }
        }
    });

    // 为container元素添加点击事件监听器
    container.addEventListener('click', function(event) {
        // 检查点击事件的目标是否为图片
        const isImageClicked = event.target.tagName.toLowerCase() === 'img';

        // 如果点击的是图片，则不隐藏container
        if (isImageClicked) {
            // 获取图片的当前变换矩阵
            const img = container.querySelector('img');
            if (img) {
                const currentTransform = window.getComputedStyle(img).transform;
                // 解析初始变换矩阵和当前变换矩阵中的平移值
                const initialTranslate = parseTranslate(initialTransform);
                const currentTranslate = parseTranslate(currentTransform);

                // 计算图片的位移距离
                const deltaX = currentTranslate.x - initialTranslate.x;
                const deltaY = currentTranslate.y - initialTranslate.y;
                const totalDelta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                // 如果图片位移距离超过3px，则不隐藏container
                if (totalDelta > 3) {
                    console.log('图片被拖动超过3px，不关闭图片');
                    return; // 不隐藏container
                }
            }
        }

        // 隐藏container元素，以关闭全屏图片显示
        container.style.display = 'none';
        console.log('关闭图片');
        console.log(initialTransform);
    });

    // 解析变换矩阵中的平移值
    function parseTranslate(transform) {
        if (transform && transform !== 'none') {
            const matrix = new DOMMatrix(transform);
            return { x: matrix.m41, y: matrix.m42 };
        }
        return { x: 0, y: 0 };
    }

    // 处理鼠标释放事件
    // 当鼠标按钮释放时，停止拖拽操作
    container.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // 处理鼠标离开事件
    container.addEventListener('mouseleave', function() {
        isDragging = false;
    });
});