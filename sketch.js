let video;
let pg;

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 擷取攝影機影像
  video = createCapture(VIDEO);
  video.hide(); // 隱藏原始 HTML 影片元件

  // 初始 pg 為 null，待 video 尺寸確定後再建立
  pg = null;
}

function draw() {
  // 設定畫布顏色為 e7c6ff
  background('#e7c6ff');

  if (video.width > 0) {
    // 初始化與影片解析度相同的繪圖層
    if (pg === null || pg.width !== video.width || pg.height !== video.height) {
      pg = createGraphics(video.width, video.height);
    }

    // 計算 60% 的最大顯示寬高
    let maxWidth = width * 0.6;
    let maxHeight = height * 0.6;
    
    // 保持比例計算
    let videoRatio = video.width / video.height;
    let targetRatio = maxWidth / maxHeight;
    let videoW, videoH;

    if (videoRatio > targetRatio) {
      videoW = maxWidth;
      videoH = maxWidth / videoRatio;
    } else {
      videoH = maxHeight;
      videoW = maxHeight * videoRatio;
    }

    // 計算置中座標
    let x = (width - videoW) / 2;
    let y = (height - videoH) / 2;

    // 1. 繪製鏡像後的視訊畫面
    push();
    translate(x + videoW, y);
    scale(-1, 1); // 修正左右顛倒
    image(video, 0, 0, videoW, videoH);
    pop();

    // 2. 處理取樣邏輯並繪製到 pg 上
    video.loadPixels();
    pg.clear(); // 保持 pg 背景透明
    pg.textSize(8);
    pg.textAlign(CENTER, CENTER);

    let step = 20; // 20x20 為一個單位
    for (let row = 0; row < video.height; row += step) {
      for (let col = 0; col < video.width; col += step) {
        // 因為畫面在主畫布是鏡像的，取樣時要取對應鏡像位置的像素
        let mirroredCol = (video.width - 1) - col;
        let index = (mirroredCol + row * video.width) * 4;
        
        let r = video.pixels[index];
        let g = video.pixels[index + 1];
        let b = video.pixels[index + 2];
        let avg = Math.floor((r + g + b) / 3);

        // 設定文字顏色隨亮度變化（0為黑，255為白）
        pg.fill(avg);
        // 在 pg 的原始解析度座標上繪製文字
        pg.text(avg, col + step / 2, row + step / 2);
      }
    }

    // 3. 將 pg 顯示在視訊畫面的上方（維持相同縮放與位置）
    image(pg, x, y, videoW, videoH);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
