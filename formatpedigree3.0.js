const content = document.getElementById('content');
const contentWrapper = document.getElementById('contentWrapper');

const clamp = (num, min, max) => {
    return Math.min(Math.max(num, min), max)
}

let lastMousePosition = new MouseEvent('mousedown');
let isMouseDown = false;
let contentTranslate = {
    x: content.offsetWidth / -2,
    y: content.offsetHeight / -2,
}

let scale = 1;
let zoomDelta = 0;

let contentWidth = content.offsetWidth * scale;
let contentHeight = content.offsetHeight * scale;

let minXTranslation = (content.offsetWidth - innerWidth + contentWidth) / -2;
let minYTranslation = (content.offsetHeight - innerHeight + contentHeight) / -2;
let maxXTranslation = (-content.offsetWidth - innerWidth + contentWidth) / 2;
let maxYTranslation = (-content.offsetHeight - innerHeight + contentHeight) / 2;

let smoothScroll = e => {
    let x = e.type == "wheel" ? e.deltaX : lastMousePosition.clientX - e.clientX;
    let y = e.type == "wheel" ? e.deltaY : lastMousePosition.clientY - e.clientY;
    x = isNaN(x) ? 0 : x;
    y = isNaN(y) ? 0 : y;
    

    contentTranslate.x -= x;
    contentTranslate.y -= y;
    console.log(contentTranslate);
    // contentTranslate.x = clamp(contentTranslate.x, (-content.offsetWidth - innerWidth + content.offsetWidth * scale) / 2, (content.offsetWidth - innerWidth + content.offsetWidth * scale) / -2)
    console.log(contentTranslate.x, clamp(contentTranslate.y, minYTranslation, maxYTranslation));
    content.style.translate = `${contentTranslate.x}px ${contentTranslate.y}px`
    lastMousePosition = e;
};

window.addEventListener('mousemove', (e = new MouseEvent('mousemove')) => {
    if (isMouseDown) smoothScroll(e);
    lastMousePosition = e;
});
window.addEventListener('mousedown', () => isMouseDown = true);
window.addEventListener('mouseup', () => isMouseDown = false);

window.addEventListener('wheel', (e = new WheelEvent('wheel')) => {
    e.preventDefault();
    
    if (!e.ctrlKey) {
        smoothScroll(e);
        return;
    };

    minXTranslation = (-content.offsetWidth - innerWidth + content.offsetHeight * scale) / 2;
    minYTranslation = (-content.offsetHeight - innerHeight + content.offsetHeight * scale) / 2;
    maxXTranslation = (content.offsetWidth - innerWidth + content.offsetWidth * scale) / 2;
    maxYTranslation = (content.offsetHeight - innerHeight + content.offsetHeight * scale) / 2;
    
    contentWidth = content.offsetWidth * scale;
    contentHeight = content.offsetHeight * scale;

    zoomDelta += e.deltaY;
    scale = clamp(scale - zoomDelta * 0.001, 0.01, 1.2);
    
    console.log(scale)

    content.style.scale = scale;
    scale = scale;
}, { passive: false });

for (let i = 0; i < 100; i++) {
    const box = document.createElement('div');
    box.className = 'coupleWrapper';
    content.appendChild(box);

    const boxWidth = box.computedStyleMap().get('width').value;
    const boxHeight = box.computedStyleMap().get('height').value;

    box.style.left = Math.random() * (10000 - boxWidth);
    box.style.top = Math.random() * (10000 - boxHeight);
}