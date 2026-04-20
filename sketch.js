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

    // 載入視訊像素資料
    video.loadPixels();
    pg.clear(); // 清除上一幀的文字
    
    // 設定文字樣式
    pg.noStroke();
    pg.fill(255); // 白色文字
    pg.textSize(8);
    pg.textAlign(CENTER, CENTER);

    // 以 20x20 為單位進行取樣
    let step = 20;
    for (let y = 0; y < video.height; y += step) {
      for (let x = 0; x < video.width; x += step) {
        // 因為視訊在畫面上是鏡像顯示的 (scale -1)，
        // 為了讓文字對應到正確的位置，我們取像素時也要取鏡像位置的值
        let mirroredX = (video.width - 1) - x;
        let index = (mirroredX + y * video.width) * 4;
        
        let r = video.pixels[index];
        let g = video.pixels[index + 1];
        let b = video.pixels[index + 2];
        let avg = Math.floor((r + g + b) / 3);

        // 在該單位的中心顯示數值
        pg.text(avg, x + step / 2, y + step / 2);
      }
    }

    // 繪製 pg 到主畫布上，與視訊畫面相同的位置和縮放大小
    image(pg, x, y, videoW, videoH);
  }
}

// 當視窗大小改變時，自動調整畫布大小以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
