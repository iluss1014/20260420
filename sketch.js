let video;

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 擷取攝影機影像
  video = createCapture(VIDEO);
  
  // 隱藏預設在畫布下方的 HTML 影片元件
  video.hide();
}

function draw() {
  // 設定背景顏色為 1b4332
  background('#1b4332');

  // 計算影像顯示的寬高（全螢幕寬高的 60%）
  let videoW = width * 0.6;
  let videoH = height * 0.6;

  // 計算置中位置
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;

  // 處理左右顛倒（水平鏡像）
  push();
  translate(x + videoW, y); // 先移動到影像顯示區域的右上角
  scale(-1, 1);             // 水平翻轉座標系
  image(video, 0, 0, videoW, videoH); // 在翻轉後的座標系中從 0,0 開始繪製
  pop();
}

// 當視窗大小改變時，自動調整畫布大小以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
