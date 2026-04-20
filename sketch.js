let video;
let pg; // 宣告一個 p5.Graphics 物件

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 擷取攝影機影像
  video = createCapture(VIDEO);
  
  // 隱藏預設在畫布下方的 HTML 影片元件
  video.hide();

  // 初始化 pg 為 null，待 video 尺寸確定後再創建
  pg = null;
}

function draw() {
  // 設定背景顏色為 1b4332
  background('#1b4332');

  // 確保攝影機已啟動並取得畫面尺寸
  if (video.width > 0) {
    // 如果 pg 尚未創建或尺寸不符，則創建/重新創建
    // pg 的內部尺寸與原始視訊畫面相同
    if (pg === null || pg.width !== video.width || pg.height !== video.height) {
      pg = createGraphics(video.width, video.height);
    }

    // 設定最大顯示範圍（寬高的 60%）
    let maxWidth = width * 0.6;
    let maxHeight = height * 0.6;
    
    // 計算比例以維持長寬比
    let videoRatio = video.width / video.height;
    let targetRatio = maxWidth / maxHeight;

    let videoW, videoH;

    if (videoRatio > targetRatio) {
      // 如果影片較寬，則以 maxWidth 為基準
      videoW = maxWidth;
      videoH = maxWidth / videoRatio;
    } else {
      // 如果影片較高，則以 maxHeight 為基準
      videoH = maxHeight;
      videoW = maxHeight * videoRatio;
    }

    // 計算置中位置
    let x = (width - videoW) / 2;
    let y = (height - videoH) / 2;

    // 處理左右顛倒（水平鏡像）並繪製
    push();
    translate(x + videoW, y); 
    scale(-1, 1);             
    image(video, 0, 0, videoW, videoH); 
    pop();

    // 在 pg 上繪製一些內容，以便看到它疊加在視訊上方
    // 每次 draw 循環都會重新繪製 pg 的內容
    pg.clear(); // 清除 pg 之前的繪圖
    pg.fill(255, 0, 0, 100); // 半透明紅色
    pg.noStroke();
    pg.rect(pg.width * 0.1, pg.height * 0.1, pg.width * 0.8, pg.height * 0.8);
    pg.fill(0, 255, 0, 150); // 半透明綠色
    pg.ellipse(pg.width / 2, pg.height / 2, pg.width * 0.3, pg.height * 0.3);

    // 繪製 pg 到主畫布上，與視訊畫面相同的位置和縮放大小
    image(pg, x, y, videoW, videoH);
  }
}

// 當視窗大小改變時，自動調整畫布大小以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
