const content = document.getElementById('content');
const contentWrapper = document.getElementById('contentWrapper');

/**
 * 
 * @param {number} num The number to clamp
 * @param {number} min The lowest value the number can be
 * @param {number} max The highest value the number can be
 * @returns {number} The clamped number
 */
function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max)
}

/**
 * 
 * @param {HTMLElement=} el The element we are getting the translate data from. Defaults to content
 * @returns {{ x: number, y: number }} The x and y translations of the element
 */
function getElementTranslate(el = content) {
    return el.style.translate == '' ? { x: el.offsetWidth / -2, y: el.offsetHeight / -2} : Object.fromEntries(el.style.translate.split(' ').map((v, i) => [i - 1 ? 'x' : 'y', parseInt(v.split('px')[0])]));
}

/**
 * Uses lastMouseEvent to calculate a smooth translate for panning an element
 * @param {MouseEvent} ev The MouseEvent to convert to a smooth scroll/smooth translate
 * @param {HTMLElement} el Defaults to the content element, but can be changed. However, I haven't done that yet
 * 
 * @example window.addEventListener('mousemove', 
                ev => {
                    if (isMouseDown) smoothTranslate(ev);
                    lastMouseEvent = ev;
                }
            );
 */
function smoothTranslate(ev, el = content) {
    let [translateX, translateY] = el.style.translate == '' ? [el.offsetWidth / -2, el.offsetHeight / -2] : el.style.translate.split(' ').map(v => parseInt(v.split('px')[0]));
    let x = ev.type == "wheel" ? ev.deltaX : lastMouseEvent.clientX - ev.clientX;
    let y = ev.type == "wheel" ? ev.deltaY : lastMouseEvent.clientY - ev.clientY;
    translateX -= isNaN(x) ? 0 : x;
    translateY -= isNaN(y) ? 0 : y;

    /**
     * Clamp values for [min, max]. Had to do it this way because sometimes the values will flip which is higher and lower.
     */
    let clampsX = [(el.offsetWidth - innerWidth + el.offsetWidth * scale) / -2, (el.offsetWidth + innerWidth - content.offsetWidth * scale) / -2].sort((a, b) => a - b);
    let clampsY = [(el.offsetHeight - innerHeight + el.offsetHeight * scale) / -2, (el.offsetHeight + innerHeight - content.offsetHeight * scale) / -2].sort((a, b) => a - b);
    el.style.translate = `${clamp(translateX, ...clampsX)}px ${clamp(translateY, ...clampsY)}px`; // The juicy part.
};

/**
 * Returns the visibleWidth and the visibleHeight of a scaled element
 * @param {number} scale The scale factor given to the element through it's style property
 * @param {HTMLElement} el The element to which the sides will be scaled
 * 
 * @returns {{visibleWidth: number, visibleHeight: number}} The visibleWidth and the visibleHeight in an object
 */
function scalePerimeter(scale, el) {
    const sideScale = scale; // Simple equation to convert the scale property which affects area to a scale factor for the sides of the element.
    return {
        visibleWidth: el.offsetWidth * sideScale,
        visibleHeight: el.offsetHeight * sideScale
    };
}

let lastMouseEvent = new MouseEvent('mousedown');
let isMouseDown = false;

let scale = 1;
let zoomDelta = 0;

let { visibleWidth, visibleHeight } = scalePerimeter(scale, content); // Quickly assign visibleWidth and visibleHeight initially

window.addEventListener('mousemove', 
    /**
     * 
     * @param {MouseEvent} ev mousemove event to pass into smoothTranslate and lastMouseEvent
     */
    ev => {
        if (isMouseDown) smoothTranslate(ev);
        lastMouseEvent = ev;
        if (ev.shiftKey)
            console.log(ev);
    }
);

window.addEventListener('mousedown', () => isMouseDown = true);
window.addEventListener('mouseup', () => isMouseDown = false);

window.addEventListener('wheel', 
    /**
     * This is the zoom
     * @param {WheelEvent} ev The wheel event to use in the zoom calculation
     */
    ev => {
        ev.preventDefault();
        
        if (!ev.ctrlKey) {
            smoothTranslate(ev);
            return;
        };
        
        content.style.transformOrigin = `${content.offsetWidth - ev.offsetX}px ${content.offsetHeight - ev.offsetY}px`;
        scale = clamp(scale - ev.deltaY * 0.001, 0.01, 1.2); // 0.001 was a multiplier that I found was easy to use when zooming in and out
        content.style.scale = scale;
        ({ visibleWidth, visibleHeight } = scalePerimeter(scale, content)); // Reassign visibleWidth and visibleHeight to the rescaled content element

        if (ev.shiftKey) console.log(ev);
        let {x, y} = getElementTranslate();
        // content.style.translate = `${x - ev.deltaY}px ${y - ev.deltaY}px`;
    },
{ passive: false });

for (let i = 0; i < 100; i++) {
    const box = document.createElement('div');
    box.className = 'coupleWrapper';
    content.appendChild(box);

    const boxWidth = box.computedStyleMap().get('width').value;
    const boxHeight = box.computedStyleMap().get('height').value;

    box.style.left = Math.random() * (10000 - boxWidth);
    box.style.top = Math.random() * (10000 - boxHeight);
}