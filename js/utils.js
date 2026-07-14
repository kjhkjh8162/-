// 유틸리티 함수
function getScaledSize(baseSize) {
    return baseSize * 0.5;
}

function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
    });
}