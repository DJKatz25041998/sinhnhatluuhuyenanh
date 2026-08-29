/* ================= CẤU HÌNH DANH SÁCH 21 ẢNH ================= */
// Các ảnh đuôi .jpg: anh5, anh6, anh7, anh19. Còn lại toàn bộ là .jpeg
const jpgList = [5, 6, 7, 19];

const heartPhotos = Array.from({ length: 21 }, (_, i) => {
  const num = i + 1;
  const ext = jpgList.includes(num) ? 'jpg' : 'jpeg';
  return `anh${num}.${ext}`;
});

const CONFIG = {
  name: "LƯU HUYỀN ANH",
  heartPhotos: heartPhotos
};

// Chuyển màn hình mượt mà
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
    "3",
    "2",
    "1",
    "HAPPY",
    "BIRTHDAY",
    "BON",
    "TUỔI 18",
    "LẦN THỨ 5",
    "❤️"
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

    // Ký tự màu hồng rơi xuống
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

    // Chữ đổi ở giữa màn hình
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

// Màn 4 -> Màn 5: Xếp 21 ảnh khổ lớn thành hình Trái Tim rộng
function goToHeart() {
  switchScreen('album-screen', 'heart-screen');
  const stage = document.getElementById('heart-stage');
  stage.innerHTML = '';

  const photos = CONFIG.heartPhotos;
  const total = photos.length;
  
  // Tăng bán kính trái tim: Điện thoại là 12, Máy tính là 23 (để vừa khung ảnh to gấp đôi)
  const isMobile = window.innerWidth < 600;
  const scaleR = isMobile ? 12 : 23;

  photos.forEach((src, i) => {
    const img = document.createElement('img');
    img.className = 'heart-img';
    img.src = src;
    
    // Phương trình đường cong trái tim Parametric
    const t = (Math.PI * 2 * i) / total;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    const posX = `${x * scaleR}px`;
    const posY = `${y * scaleR}px`;

    // Lưu tọa độ vào CSS variables
    img.style.setProperty('--tx', posX);
    img.style.setProperty('--ty', posY);

    // CLICK ĐỂ PHÓNG TO TOÀN MÀN HÌNH
    img.onclick = function(e) {
      e.stopPropagation();
      openModal(src);
    };

    stage.appendChild(img);

    // Kích hoạt hiệu ứng bung ảnh ra ngoài
    setTimeout(() => {
      img.style.opacity = '1';
      img.style.transform = `translate(calc(-50% + ${posX}), calc(-50% + ${posY})) scale(1)`;
    }, 150 + i * 65);
  });
}

/* ================= XỬ LÝ POPUP PHÓNG TO ẢNH (MODAL) ================= */
function openModal(imageSrc) {
  const modal = document.getElementById('photo-modal');
  const modalImg = document.getElementById('modal-img');
  if (modal && modalImg) {
    modalImg.src = imageSrc;
    modal.classList.add('open');
  }
}

function closeModal() {
  const modal = document.getElementById('photo-modal');
  if (modal) {
    modal.classList.remove('open');
  }
}
