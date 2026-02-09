// game.js - УЛУЧШЕННАЯ ВЕРСИЯ

let gameArea, character, slipper;
let startBtn, pauseBtn, resetBtn;
let timeDisplay, scoreDisplay, highscoreDisplay;
let achievements;

let gameRunning = false;
let gamePaused = false;
let time = 0;
let score = 0;
let highscore = 0;
let gameInterval;
let slipperInterval;
let characterX = 50;
let characterY = 50;
let slipperSpeed = 3;
let slipperDirectionX = 0;

// Улучшенные флаги
let gameOverTriggered = false;
let collisionChecked = false;
let level = 1;
let totalSlippersDodged = 0;

// Звуки (бесплатные источники)
const sounds = {
    miss: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-retro-game-emergency-alarm-1000.mp3'),
    hit: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-cartoon-falling-whistle-392.mp3'),
    achievement: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'),
};

// Статистика
let stats = {
    games: 0,
    totalTime: 0,
    totalSlippers: 0
};

document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы
    gameArea = document.getElementById('gameArea');
    character = document.getElementById('character');
    slipper = document.getElementById('slipper');
    startBtn = document.getElementById('startBtn');
    pauseBtn = document.getElementById('pauseBtn');
    resetBtn = document.getElementById('resetBtn');
    timeDisplay = document.getElementById('time');
    scoreDisplay = document.getElementById('score');
    highscoreDisplay = document.getElementById('highscore');
    achievements = document.querySelectorAll('.achievement');
    
    // Загружаем рекорд и статистику
    const savedScore = localStorage.getItem('slipperHighscore');
    highscore = savedScore ? parseFloat(savedScore) : 0;
    highscoreDisplay.textContent = highscore.toFixed(1);
    
    const savedStats = localStorage.getItem('slipperStats');
    if (savedStats) stats = JSON.parse(savedStats);
    
    // Инициализация
    updateCharacterPosition();
    hideSlipper();
    
    // События
    setupEventListeners();
    
    // Предзагрузка звуков
    Object.values(sounds).forEach(sound => {
        sound.load();
        sound.volume = 0.3;
    });
});

function setupEventListeners() {
    gameArea.addEventListener('mousemove', handleMouseMove);
    gameArea.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', togglePause);
    resetBtn.addEventListener('click', resetGame);
    
    // Клавиатура
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') startGame();
        if (e.code === 'Escape') togglePause();
        if (e.code === 'KeyR') resetGame();
    });
}

function handleMouseMove(e) {
    if (!gameRunning || gamePaused) return;
    updateCharacterPositionFromEvent(e);
}

function handleTouchMove(e) {
    if (!gameRunning || gamePaused) return;
    e.preventDefault();
    const touch = e.touches[0];
    updateCharacterPositionFromEvent(touch);
}

function updateCharacterPositionFromEvent(event) {
    const rect = gameArea.getBoundingClientRect();
    characterX = ((event.clientX - rect.left) / rect.width) * 100;
    characterY = ((event.clientY - rect.top) / rect.height) * 100;
    
    // Ограничение
    characterX = Math.max(5, Math.min(95, characterX));
    characterY = Math.max(5, Math.min(95, characterY));
    
    updateCharacterPosition();
}

function updateCharacterPosition() {
    character.style.left = `calc(${characterX}% - 40px)`;
    character.style.top = `calc(${characterY}% - 40px)`;
}

function hideSlipper() {
    slipper.style.display = 'none';
}

function showSlipper() {
    slipper.style.display = 'flex';
}

function startGame() {
    if (gameRunning) return;
    
    // Сбрасываем всё
    gameOverTriggered = false;
    collisionChecked = false;
    level = 1;
    totalSlippersDodged = 0;
    
    gameRunning = true;
    gamePaused = false;
    time = 0;
    score = 0;
    slipperSpeed = 3;
    slipperDirectionX = 0;
    
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    pauseBtn.textContent = 'Пауза (Esc)';
    resetBtn.textContent = 'Сброс (R)';
    
    // Сброс достижений
    achievements.forEach(ach => ach.classList.remove('unlocked'));
    
    // Обновляем отображение
    timeDisplay.textContent = '0.0';
    scoreDisplay.textContent = '0';
    
    // Показываем тапок
    showSlipper();
    createSlipper();
    
    // Запускаем игровые интервалы
    gameInterval = setInterval(updateGame, 100);
    slipperInterval = setInterval(moveSlipper, 20);
    
    // Показываем подсказку
    showMessage('Уворачивайся!', '#4CAF50', 1000);
}

function togglePause() {
    if (!gameRunning) return;
    
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? 'Продолжить (Esc)' : 'Пауза (Esc)';
    
    if (gamePaused) {
        clearInterval(gameInterval);
        clearInterval(slipperInterval);
        showMessage('ПАУЗА', '#FF9800', 500);
    } else {
        gameInterval = setInterval(updateGame, 100);
        slipperInterval = setInterval(moveSlipper, 20);
    }
}

function resetGame() {
    gameRunning = false;
    gamePaused = false;
    gameOverTriggered = false;
    
    clearInterval(gameInterval);
    clearInterval(slipperInterval);
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Пауза';
    resetBtn.textContent = 'Сброс';
    
    time = 0;
    score = 0;
    
    timeDisplay.textContent = '0.0';
    scoreDisplay.textContent = '0';
    
    hideSlipper();
    character.style.animation = '';
    
    // Сброс достижений
    achievements.forEach(ach => ach.classList.remove('unlocked'));
}

function updateGame() {
    time += 0.1;
    timeDisplay.textContent = time.toFixed(1);
    
    // Увеличиваем сложность каждые 10 секунд
    const currentTime = Math.floor(time);
    if (currentTime > 0 && currentTime % 10 === 0) {
        if (!slipper.dataset.difficultyIncreased) {
            slipperSpeed += 0.5;
            level++;
            showMessage(`Уровень ${level}!`, '#4CAF50', 800);
            slipper.dataset.difficultyIncreased = 'true';
            setTimeout(() => {
                delete slipper.dataset.difficultyIncreased;
            }, 1000);
        }
    }
    
    // Проверяем достижения
    if (Math.floor(time) !== Math.floor(time - 0.1)) {
        checkAchievements();
    }
}

function createSlipper() {
    // Начальная позиция сверху
    const startX = Math.random() * 80 + 10;
    slipper.style.left = startX + '%';
    slipper.style.top = '-10%';
    
    // Случайное горизонтальное движение
    slipperDirectionX = (Math.random() - 0.5) * 2;
    
    // Разный внешний вид тапков
    const slippers = ['👟', '🥿', '👠', '👞', '🥾'];
    slipper.textContent = slippers[Math.floor(Math.random() * slippers.length)];
}

function moveSlipper() {
    if (!gameRunning || gamePaused || gameOverTriggered) return;
    
    // Текущая позиция тапка
    let currentTop = parseFloat(slipper.style.top) || -10;
    let currentLeft = parseFloat(slipper.style.left) || 50;
    
    // Движение вниз и вбок
    currentTop += slipperSpeed;
    currentLeft += slipperDirectionX * (level * 0.3); // Быстрее на высоких уровнях
    
    // Обновляем позицию
    slipper.style.top = currentTop + '%';
    slipper.style.left = currentLeft + '%';
    
    // Отскок от боковых границ
    if (currentLeft < 0 || currentLeft > 95) {
        slipperDirectionX = -slipperDirectionX;
    }
    
    // Проверка попадания
    if (checkCollision() && !collisionChecked) {
        collisionChecked = true;
        slipperHit();
        return;
    }
    
    // ⚠️ ЭТОГО БЛОКА НЕ БЫЛО! ДОБАВЬ ЕГО:
    // Если тапок улетел за нижнюю границу
    if (currentTop > 110) {
        totalSlippersDodged++;
        score += 10;
        scoreDisplay.textContent = score;
        
        // Звук промаха
        sounds.miss.currentTime = 0;
        sounds.miss.play();
        
        collisionChecked = false; // Сбрасываем флаг столкновения
        createSlipper(); // Создаём новый тапок
    }
}

function checkCollision() {
    const slipperRect = slipper.getBoundingClientRect();
    const characterRect = character.getBoundingClientRect();
    
    return !(slipperRect.right < characterRect.left + 20 || 
             slipperRect.left > characterRect.right - 20 || 
             slipperRect.bottom < characterRect.top + 20 || 
             slipperRect.top > characterRect.bottom - 20);
}

function slipperHit() {
    if (gameOverTriggered) return;
    gameOverTriggered = true;
    
    clearInterval(slipperInterval);
    
    // Звук попадания
    sounds.hit.currentTime = 0;
    sounds.hit.play();
    
    // Частицы
    createParticles(slipper.getBoundingClientRect());
    
    // Анимация попадания
    slipper.style.animation = 'hit 0.3s ease';
    character.style.animation = 'characterHit 0.5s ease';
    
    // Конец игры
    setTimeout(() => {
        gameOver();
    }, 500);
}

function gameOver() {
    if (!gameRunning) return;
    
    gameRunning = false;
    clearInterval(gameInterval);
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    
    // Обновление статистики
    stats.games++;
    stats.totalTime += time;
    stats.totalSlippers += totalSlippersDodged;
    localStorage.setItem('slipperStats', JSON.stringify(stats));
    
    // Обновление рекорда
    let isNewRecord = false;
    if (time > highscore) {
        isNewRecord = true;
        highscore = time;
        highscoreDisplay.textContent = highscore.toFixed(1);
        localStorage.setItem('slipperHighscore', highscore);
        highscoreDisplay.classList.add('new-record');
        setTimeout(() => highscoreDisplay.classList.remove('new-record'), 2000);
    }
    
    // Показываем сообщение
    const messageText = isNewRecord ? '🎉 НОВЫЙ РЕКОРД! 🎉' : 'Бабушка таки попала тапком!';
    const messageColor = isNewRecord ? '#03b66b' : '#ff6b00';
    showMessage(messageText, messageColor, 2000);
    
    // Финальное сообщение
    setTimeout(() => {
        const comment = getFunnyComment(time);
        showMessage(comment, '#666', 2000);
        
        // Статистика
        setTimeout(() => {
            const avgTime = (stats.totalTime / stats.games).toFixed(1);
            showMessage(`Всего игр: ${stats.games} | Среднее: ${avgTime}с`, '#2196F3', 2000);
        }, 2000);
    }, 2000);
}

function showMessage(text, color, duration = 2000) {
    const oldMessage = gameArea.querySelector('.game-message');
    if (oldMessage) oldMessage.remove();
    
    const message = document.createElement('div');
    message.className = 'game-message';
    message.textContent = text;
    message.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${color};
        color: white;
        padding: 15px 30px;
        border-radius: 15px;
        font-size: 24px;
        font-weight: bold;
        z-index: 100;
        animation: fadeIn 0.5s ease;
        pointer-events: none;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        max-width: 80%;
        word-wrap: break-word;
    `;
    
    gameArea.appendChild(message);
    
    setTimeout(() => {
        if (message.parentNode === gameArea) {
            message.style.opacity = '0';
            message.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                if (message.parentNode === gameArea) {
                    gameArea.removeChild(message);
                }
            }, 500);
        }
    }, duration);
}



function createParticles(rect) {
    const particles = ['👟', '💥', '✨', '🌟'];
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.cssText = `
            position: absolute;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top + rect.height/2}px;
            font-size: ${15 + Math.random() * 15}px;
            opacity: 1;
            z-index: 40;
            pointer-events: none;
        `;
        
        gameArea.appendChild(particle);
        
        // Анимация
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 100;
        const duration = 500 + Math.random() * 500;
        
        particle.animate([
            { 
                transform: 'translate(0, 0) scale(1) rotate(0deg)',
                opacity: 1 
            },
            { 
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0) rotate(${360}deg)`,
                opacity: 0 
            }
        ], {
            duration: duration,
            easing: 'ease-out'
        });
        
        setTimeout(() => {
            if (particle.parentNode === gameArea) {
                gameArea.removeChild(particle);
            }
        }, duration);
    }
}

function getFunnyComment(time) {
    if (time < 3) return 'Бабушка попала с первого раза!';
    if (time < 7) return 'Даже баба Люба из 3 подъезда держится дольше!';
    if (time < 12) return 'Неплохо! Но до бабушкиной меткости ещё далеко.';
    if (time < 20) return 'Хороший результат!';
    if (time < 30) return 'Отлично! Ты почти как молодой Евреев!';
    if (time < 45) return 'Великолепно! Бабушка в шоке!';
    return 'ВОТ ЭТО ДА! Бабушка гордилась бы тобой!';
}

function checkAchievements() {
    achievements.forEach(achievement => {
        const targetTime = parseInt(achievement.dataset.target) || 0;
        if (time >= targetTime && !achievement.classList.contains('unlocked')) {
            achievement.classList.add('unlocked');
            sounds.achievement.currentTime = 0;
            sounds.achievement.play();
            
            // Анимация
            achievement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                achievement.style.transform = '';
            }, 300);
        }
    });
}

// Добавить в конец HTML для статистики
function showStatsModal() {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:1000; display:flex; justify-content:center; align-items:center;">
            <div style="background:white; padding:30px; border-radius:15px; max-width:500px; width:90%;">
                <h2>📊 Статистика игры</h2>
                <p>Всего игр: ${stats.games}</p>
                <p>Общее время: ${stats.totalTime.toFixed(1)}с</p>
                <p>Среднее время: ${stats.games > 0 ? (stats.totalTime/stats.games).toFixed(1) : 0}с</p>
                <p>Всего увернулся: ${stats.totalSlippers} тапков</p>
                <p>Текущий рекорд: ${highscore.toFixed(1)}с</p>
                <button onclick="this.parentElement.parentElement.remove()" style="margin-top:20px; padding:10px 20px; background:#f44336; color:white; border:none; border-radius:5px; cursor:pointer;">
                    Закрыть
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Добавить кнопку статистики в HTML или вызвать showStatsModal()