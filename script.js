const TIMEOUT_DELAY = 500;
const SMILEY_EXPRESSIONS = {
  angry: '😠',
  disgusted: '🤢',
  fearful: '😨',
  happy: '😃',
  neutral: '😐',
  sad: '😔',
  surprised: '😲',
};
const EXPRESSION_POSITIONS = {
  angry: '0',
  disgusted: '-100px',
  fearful: '-200px',
  happy: '-300px',
  neutral: '-400px',
  sad: '-500px',
  surprised: '-600px',
};

const videoEl = document.getElementById('inputVideo');
const legoFace = document.getElementById('lego-face');
const loadingText = document.getElementById('loading');

async function loadFaceApi() {
  await faceapi.loadTinyFaceDetectorModel('assets/models');
  await faceapi.loadFaceExpressionModel('assets/models');

  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  videoEl.srcObject = stream;
  loadingText.style.display = 'none';
  legoFace.style.display = 'inline';
}
loadFaceApi();

async function onPlay() {
  if (videoEl.paused || videoEl.ended)
    return setTimeout(() => onPlay(), TIMEOUT_DELAY);

  const result = await faceapi
    .detectSingleFace(videoEl, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions();

  let expression = '';

  if (result) {
    expression = getExpression(result);
    legoFace.style.backgroundPositionX = EXPRESSION_POSITIONS[expression];
    // console.log(expression, SMILEY_EXPRESSIONS[expression]);
  }

  setTimeout(() => onPlay(), TIMEOUT_DELAY);
}

function getExpression(result) {
  const expressions = result.expressions;
  const Array = Object.entries(expressions);
  const scoresArray = Array.map((i) => i[1]);
  const expressionsArray = Array.map((i) => i[0]);
  const max = Math.max.apply(null, scoresArray);
  const index = scoresArray.findIndex((score) => score === max);
  const expression = expressionsArray[index];
  return expression;
}
