// gallery-simple.js - супер простой вариант

document.addEventListener('DOMContentLoaded', function() {
const allImages = [
    'FILIP_motorchik1.jpg',
    'BolshoyFilip.jpg',
    'FilipAbama.jpg',
    'FilipBiutiful.jpg',
    'FilipBlack.jpg',
    'FilipBlue.jpg',
    'FilipFunny.jpg',
    'filipevteev.jpg',
    'FilipGlupy.jpg',
    'FilipGreen.jpg',
    'FilipNoob.jpg',
    'FilippDacha.jpg',
    'FilipRastaga.jpg',
    'FilipRed.jpg',
    'FilipSigma.jpg',
    'FilipSkin.jpg',
    'Monkey.jpg',
    'OkakImperator.png',
    'FilipBlue2.jpg',
    'FilipDisko.jpg',
    'FilipGanster.jpg',
    'FilipITtech.jpg',
    'FilipSit.jpg',
    'filip1.jpg',
    'FilipWatch.jpg',
    'FilipAndArtemghoul.jpg',
    'filipNIger.gif',
    'photo_1_2026-01-22_23-07-31.jpg',
    'photo_2_2026-01-22_23-07-31.jpg',
    'photo_3_2026-01-22_23-07-31.jpg',
    'photo_4_2026-01-22_23-07-31.jpg',
    'photo_5_2026-01-22_23-07-31.jpg',
    'photo_6_2026-01-22_23-07-31.jpg',
    'photo_7_2026-01-22_23-07-31.jpg',
    'photo_8_2026-01-22_23-07-31.jpg',
    'photo_9_2026-01-22_23-07-31.jpg',
    'photo_10_2026-01-22_23-07-31.jpg',
    'photo_11_2026-01-22_23-07-31.jpg',
    'photo_12_2026-01-22_23-07-31.jpg',
    'photo_13_2026-01-22_23-07-31.jpg',
    'photo_14_2026-01-22_23-07-31.jpg',
    'photo_15_2026-01-22_23-07-31.jpg',
    'photo_16_2026-01-22_23-07-31.jpg',
    'photo_17_2026-01-22_23-07-31.jpg',
    'photo_18_2026-01-22_23-07-31.jpg',
    'photo_19_2026-01-22_23-07-31.jpg',
    'photo_20_2026-01-22_23-07-31.jpg',
    'photo_21_2026-01-22_23-07-31.jpg',
    'photo_22_2026-01-22_23-07-31.jpg',
    'photo_23_2026-01-22_23-07-31.jpg',
    'photo_23_2026-01-22_23-07-31.jpg',
    'photo_24_2026-01-22_23-07-31.jpg',
    'photo_25_2026-01-22_23-07-31.jpg',
    'photo_26_2026-01-22_23-07-31.jpg',
    'photo_27_2026-01-22_23-07-31.jpg',
];

    const leftColumn = document.getElementById('leftColumn');
    const rightColumn = document.getElementById('rightColumn');
    
    // Перемешиваем картинки
    const shuffled = [...allImages].sort(() => Math.random() - 0.5);
    
    // Заполняем левую колонку - много картинок
    for (let i = 0; i < 30; i++) { // 30 картинок в левой колонке
        const imgIndex = i % shuffled.length;
        const img = createImage(shuffled[imgIndex]);
        leftColumn.appendChild(img);
    }
    
    // Заполняем правую колонку - много картинок
    for (let i = 0; i < 30; i++) {
        const imgIndex = (i + 15) % shuffled.length; // Смещение для разнообразия
        const img = createImage(shuffled[imgIndex]);
        rightColumn.appendChild(img);
    }
    
    function createImage(filename) {
        const img = document.createElement('img');
        img.className = 'gallery-img';
        img.src = 'Picture/' + filename;
        img.alt = 'Филипп Евреев';
        img.style.width = '100%';
        img.style.marginBottom = '15px';
        img.style.borderRadius = '10px';
        img.style.display = 'block';
        
        // Случайная высота
        const heights = [200, 250, 300, 350];
        img.style.height = heights[Math.floor(Math.random() * heights.length)] + 'px';
        img.style.objectFit = 'cover';
        
        return img;
    }
});