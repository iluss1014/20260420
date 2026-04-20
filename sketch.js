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

  // 確保攝影機已啟動並取得畫面尺寸
  if (video.width > 0) {
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
  }
}

// 當視窗大小改變時，自動調整畫布大小以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
