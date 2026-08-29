/* ================= CẤU HÌNH DỮ LIỆU ================= */
const CONFIG = {
  name: "BON",
  totalPhotos: 21
};

// Khởi tạo tên hiển thị
const personNameEl = document.getElementById('person-name');
if (personNameEl) {
  personNameEl.innerText = CONFIG.name;
}

// Hàm tải ảnh trực tiếp: Tự động đổi đuôi .jpeg <-> .jpg để không bao giờ bị lỗi
function setupImageFallback(img, index) {
  const extensions = ['jpeg', 'jpg', 'JPEG', 'JPG', 'png', 'PNG'];
  let currentExtIndex = 0;

  img.onerror = function() {
    currentExtIndex++;
    if (currentExtIndex < extensions.length) {
      this.src = `anh${index}.${extensions[currentExtIndex]}`;
    } else {
      console.warn(`Không tìm thấy file ảnh: anh${index}`);
    }
  };

  // Thử đuôi mặc định đầu tiên
  img.src = `anh${index}.${extensions[0]}`;
}

// Chuyển màn hình
function switchScreen(fromId, toId) {
  const fromScreen = document.getElementById(fromId);
  const toScreen = document.getElementById(toId);
  if (fromScreen) fromScreen.classList.remove('active');
  setTimeout(() => {
    if (toScreen) toScreen.classList.add('active');
  }, 300);
}

// Màn 1 -> Màn 2: Bật nhạc & Bắt đầu
function startExperience() {
  const music = document.getElementById('bg-music');
  if (music) {
    music.currentTime = 0;
    music.play().then(() => {
      console.log("Phát nhạc thành công!");
    }).catch(e => {
      console.warn("Trình duyệt chặn phát âm thanh:", e);
    });
  }

  // Tự động gán link chống lỗi cho ảnh trong Album Swiper
  const albumImgs = document.querySelectorAll('.swiper-slide .img-container img');
  albumImgs.forEach((img, idx) => {
    setupImageFallback(img, idx + 1);
  });

  switchScreen('start-screen', 'matrix-screen');
  startMatrixCountdown();
}

// Màn 2: Matrix Rain & Đếm ngược chúc mừng sinh nhật
function startMatrixCountdown() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const letters = "01010101HAPPYBIRTHDAYBON♥18";
  const fontSize = 16;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);

  let currentText = "3";
  const sequence = [
    "3", "2", "1", "HAPPY", "BIRTHDAY", CONFIG.name, "TUỔI 18", "LẦN THỨ 5", "❤️"
  ];
  let seqIndex = 0;

  const seqTimer = setInterval(() => {
    seqIndex++;
    if (seqIndex < sequence.length) {
      currentText = sequence[seqIndex];
    } else {
      clearInterval(seqTimer);
      clearInterval(renderTimer);
      switchScreen('matrix-screen', 'letter-screen');
    }
  }, 1000);

  function draw() {
    ctx.fillStyle = "rgba(5, 5, 10, 0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ký tự màu hồng rơi
    ctx.fillStyle = "#ff69b4";
    ctx.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
      const char = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    // Chữ đếm ngược ở giữa màn hình
    ctx.save();
    ctx.fillStyle = "#ff1493";
    ctx.shadowColor = "#ff69b4";
    ctx.shadowBlur = 20;
    ctx.font = "bold 55px 'Poppins', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(currentText, canvas.width / 2, canvas.height / 2);
    ctx.restore();
  }

  const renderTimer = setInterval(draw, 33);
}

// Màn 3 -> Màn 4: Mở album ảnh 3D
let swiperInstance = null;
function goToAlbum() {
  switchScreen('letter-screen', 'album-screen');
  if (!swiperInstance) {
    swiperInstance = new Swiper('.swiper', {
      effect: 'cards',
      grabCursor: true,
      cardsEffect: {
        slideShadows: true,
        rotate: true,
        perSlideRotate: 4,
        perSlideOffset: 8
      }
    });
  }
}

// Màn 4 -> Màn 5: Xếp 21 ảnh thành Trái Tim
function goToHeart() {
  switchScreen('album-screen', 'heart-screen');
  const stage = document.getElementById('heart-stage');
  stage.innerHTML = '';

  const total = CONFIG.totalPhotos;
  const isMobile = window.innerWidth < 600;
  const scaleR = isMobile ? 9 : 15;

  for (let i = 0; i < total; i++) {
    const num = i + 1;
    const img = document.createElement('img');
    img.className = 'heart-img';
    setupImageFallback(img, num);
    stage.appendChild(img);

    // Tọa độ hình trái tim
    const t = (Math.PI * 2 * i) / total;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    setTimeout(() => {
      img.style.opacity = '1';
      img.style.transform = `translate(calc(-50% + ${x * scaleR}px), calc(-50% + ${y * scaleR}px)) scale(1)`;
    }, 100 + i * 70);
  }
}