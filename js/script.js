'use strict';

const image = new Image();
image.src = 'img/image.svg';
const verticalPreview = document.querySelector('.vertical-preview');
const horizontalPreview = document.querySelector('.horizontal-preview');
const imagePreview = document.querySelector('.image-preview');
const verticalRadiusInput = document.getElementById('vertical-radius');
const verticalRadiusNumber = document.getElementById('vertical-radius-number');
const verticalFrequencyInput = document.getElementById('vertical-frequency');
const verticalFrequencyNumber = document.getElementById('vertical-frequency-number');
const verticalStartThetaInput = document.getElementById('vertical-start-theta');
const verticalStartThetaNumber = document.getElementById('vertical-start-theta-number');
const horizontalRadiusInput = document.getElementById('horizontal-radius');
const horizontalRadiusNumber = document.getElementById('horizontal-radius-number');
const horizontalFrequencyInput = document.getElementById('horizontal-frequency');
const horizontalFrequencyNumber = document.getElementById('horizontal-frequency-number');
const horizontalStartThetaInput = document.getElementById('horizontal-start-theta');
const horizontalStartThetaNumber = document.getElementById('horizontal-start-theta-number');
const shakeDurationInput = document.getElementById('shake-duration');
const shakeDurationNumber = document.getElementById('shake-duration-number');

const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 200;

verticalPreview.width = CANVAS_WIDTH;
verticalPreview.height = CANVAS_HEIGHT;
horizontalPreview.width = CANVAS_WIDTH;
horizontalPreview.height = CANVAS_HEIGHT;
imagePreview.width = CANVAS_WIDTH;
imagePreview.height = CANVAS_HEIGHT;

let _animationStartTime = Date.now();
let _animationStopTime = 0;
let _animationRunning = true;

verticalRadiusInput.addEventListener('input', () => updateValue(verticalRadiusInput, verticalRadiusNumber));
verticalRadiusNumber.addEventListener('input', () => updateValue(verticalRadiusNumber, verticalRadiusInput));
verticalFrequencyInput.addEventListener('input', () => updateValue(verticalFrequencyInput, verticalFrequencyNumber));
verticalFrequencyNumber.addEventListener('input', () => updateValue(verticalFrequencyNumber, verticalFrequencyInput));
verticalStartThetaInput.addEventListener('input', () => updateValue(verticalStartThetaInput, verticalStartThetaNumber));
verticalStartThetaNumber.addEventListener('input', () => updateValue(verticalStartThetaNumber, verticalStartThetaInput));
horizontalRadiusInput.addEventListener('input', () => updateValue(horizontalRadiusInput, horizontalRadiusNumber));
horizontalRadiusNumber.addEventListener('input', () => updateValue(horizontalRadiusNumber, horizontalRadiusInput));
horizontalFrequencyInput.addEventListener('input', () => updateValue(horizontalFrequencyInput, horizontalFrequencyNumber));
horizontalFrequencyNumber.addEventListener('input', () => updateValue(horizontalFrequencyNumber, horizontalFrequencyInput));
horizontalStartThetaInput.addEventListener('input', () => updateValue(horizontalStartThetaInput, horizontalStartThetaNumber));
horizontalStartThetaNumber.addEventListener('input', () => updateValue(horizontalStartThetaNumber, horizontalStartThetaInput));
shakeDurationInput.addEventListener('input', () => updateValue(shakeDurationInput, shakeDurationNumber));
shakeDurationNumber.addEventListener('input', () => updateValue(shakeDurationNumber, shakeDurationInput));
document.onreadystatechange = startAnimation()

function updateValue(source, target) {
    target.value = source.value;
    update();
}

/**
 * startShakingImage function animates the given image by shaking it horizontally and/or vertically
 * @param {number} verticalRadius - The radius of the vertical shake in pixels
 * @param {number} verticalFrequency - The frequency of the vertical shake in Hz
 * @param {number} verticalTheta - The theta of the vertical shake in 0:0rad 1:2πrad
 * @param {number} horizontalRadius - The radius of the horizontal shake in pixels
 * @param {number} horizontalFrequency - The frequency of the horizontal shake in Hz
 * @param {number} horizontalTheta - The theta of the horizontal shake in 0:0rad 1:2πrad
 * @param {number} shakeDuration - The duration of the shake animation in seconds. If set to zero or negative, the shake animation will run indefinitely
 * @returns {void}
 */
function startImageShakingAnimation(verticalRadius, verticalFrequency, verticalTheta, horizontalRadius, horizontalFrequency, horizontalTheta, shakeDuration) {
    verticalRadiusInput.value = verticalRadius;
    verticalRadiusNumber.value = verticalRadius;
    verticalFrequencyInput.value = verticalFrequency;
    verticalFrequencyNumber.value = verticalFrequency;
    verticalStartThetaInput.value = verticalTheta;
    verticalStartThetaNumber.value = verticalTheta;
    horizontalRadiusInput.value = horizontalRadius;
    horizontalRadiusNumber.value = horizontalRadius;
    horizontalFrequencyInput.value = horizontalFrequency;
    horizontalFrequencyNumber.value = horizontalFrequency;
    horizontalStartThetaInput.value = horizontalTheta;
    horizontalStartThetaNumber.value = horizontalTheta;
    shakeDurationInput.value = shakeDuration;
    shakeDurationNumber.value = shakeDuration;

    startAnimation();
}

function isAnimationRunning() {
    return _animationRunning;
}

function startAnimation() {
    _animationRunning = true;
    _animationStartTime = Date.now();
    _animationStopTime = 0.0
    requestAnimationFrame(animate);
}

function stopAnimation() {
    _animationRunning = false;
    _animationStopTime = Date.now();
}

function animate() {
    if (!isAnimationRunning())
        return;
    update();
    requestAnimationFrame(animate);
}

function getElapsedTime() {
    return isAnimationRunning() ? (Date.now() - _animationStartTime) / 1000 : (_animationStopTime - _animationStartTime) / 1000;
}

function update() {
    const verticalRadius = parseInt(verticalRadiusInput.value);
    const verticalFrequency = parseFloat(verticalFrequencyInput.value);
    const verticalStartTheta = parseFloat(verticalStartThetaInput.value) * 2 * Math.PI;
    const horizontalRadius = parseInt(horizontalRadiusInput.value);
    const horizontalFrequency = parseFloat(horizontalFrequencyInput.value);
    const horizontalStartTheta = parseFloat(horizontalStartThetaInput.value) * 2 * Math.PI;
    const shakeDuration = parseFloat(shakeDurationInput.value) <= 0 ? Infinity : parseFloat(shakeDurationInput.value);

    const elapsedTime = Math.min(shakeDuration, getElapsedTime());

    if (elapsedTime === shakeDuration) {
        stopAnimation();
    }

    drawPreview(verticalPreview, verticalRadius, verticalFrequency, verticalStartTheta, true, elapsedTime);
    drawPreview(horizontalPreview, horizontalRadius, horizontalFrequency, horizontalStartTheta, false, elapsedTime);
    drawImagePreview(imagePreview, verticalRadius, verticalFrequency, verticalStartTheta, horizontalRadius, horizontalFrequency, horizontalStartTheta, elapsedTime);
}

function drawPoint(ctx, x, y, color, radius = 5) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.closePath();
    ctx.fill();
}

function drawLineSegment(ctx, x1, y1, x2, y2, lineWidth = 1) {
    const defaultLineWidth = ctx.lineWidth;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.lineWidth = defaultLineWidth;
}

function drawCircleAndPoints(canvas, radius, coordinates) {
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();

    drawPoint(ctx, canvas.width / 2 + coordinates.x, canvas.height / 2 + coordinates.y, 'green');
}

function drawSubdivisionAndPoints(canvas, radius, coordinates, isVertical) {
    const ctx = canvas.getContext('2d');

    if (isVertical) {
        drawLineSegment(ctx, canvas.width / 2, canvas.height / 2 - radius, canvas.width / 2, canvas.height / 2 + radius);
        drawPoint(ctx, canvas.width / 2, canvas.height / 2 + coordinates.y, 'red');
    } else {
        drawLineSegment(ctx, canvas.width / 2 - radius, canvas.height / 2, canvas.width / 2 + radius, canvas.height / 2)
        drawPoint(ctx, canvas.width / 2 + coordinates.x, canvas.height / 2, 'blue');
    }
}

function drawPreview(canvas, radius, frequency, startTheta, isVertical, elapsedTime) {
    const ctx = canvas.getContext('2d');

    const defaultFillStyle = ctx.fillStyle;
    ctx.fillStyle = '#777';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = defaultFillStyle;

    const coordinates = getCalculatedCircularCoordinates(radius, frequency, startTheta, elapsedTime);

    drawCircleAndPoints(canvas, radius, coordinates);
    drawSubdivisionAndPoints(canvas, radius, coordinates, isVertical);

    const defaultStrokeStyle = ctx.strokeStyle;
    ctx.strokeStyle = isVertical ? 'orange' : 'cyan';
    if (isVertical) {
        drawLineSegment(ctx, canvas.width / 2, canvas.height / 2 + coordinates.y, canvas.width / 2 + coordinates.x, canvas.height / 2 + coordinates.y)
    }
    else {
        drawLineSegment(ctx, canvas.width / 2 + coordinates.x, canvas.height / 2, canvas.width / 2 + coordinates.x, canvas.height / 2 + coordinates.y)
    }
    ctx.strokeStyle = defaultStrokeStyle;
}

function drawImagePreview(canvas, verticalRadius, verticalFrequency, verticalStartTheta, horizontalRadius, horizontalFrequency, horizontalStartTheta, elapsedTime) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const verticalCoordinates = getCalculatedCircularCoordinates(verticalRadius, verticalFrequency, verticalStartTheta, elapsedTime);
    const horizontalCoordinates = getCalculatedCircularCoordinates(horizontalRadius, horizontalFrequency, horizontalStartTheta, elapsedTime);

    ctx.drawImage(image, canvas.width / 2 - image.width / 2 + horizontalCoordinates.x, canvas.height / 2 - image.height / 2 + verticalCoordinates.y);

    // Draw cross-shaped lines
    drawLineSegment(ctx, canvas.width / 2, canvas.height / 2 - verticalRadius, canvas.width / 2, canvas.height / 2 + verticalRadius);
    drawLineSegment(ctx, canvas.width / 2 - horizontalRadius, canvas.height / 2, canvas.width / 2 + horizontalRadius, canvas.height / 2);

    // Draw vertical, horizontal and comvined points
    drawPoint(ctx, canvas.width / 2, canvas.height / 2 + verticalCoordinates.y, 'red');
    drawPoint(ctx, canvas.width / 2 + horizontalCoordinates.x, canvas.height / 2, 'blue');
    drawPoint(ctx, canvas.width / 2 + horizontalCoordinates.x, canvas.height / 2 + verticalCoordinates.y, 'pink')

    // Draw vertical, horizontal and combined lines
    const defaultStrokeStyle = ctx.strokeStyle;
    ctx.strokeStyle = 'orange';
    drawLineSegment(ctx, canvas.width / 2, canvas.height / 2 + verticalCoordinates.y, canvas.width / 2 + horizontalCoordinates.x, canvas.height / 2 + verticalCoordinates.y)
    ctx.strokeStyle = 'cyan';
    drawLineSegment(ctx, canvas.width / 2 + horizontalCoordinates.x, canvas.height / 2, canvas.width / 2 + horizontalCoordinates.x, canvas.height / 2 + verticalCoordinates.y)
    ctx.strokeStyle = defaultStrokeStyle;
}

function getCalculatedCircularCoordinates(radius, frequency, startTheta, elapsedTime) {
    const theta = elapsedTime * 2 * Math.PI * frequency + startTheta;
    const x = radius * Math.cos(theta);
    const y = -radius * Math.sin(theta);

    return { x, y };
}
