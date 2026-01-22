// game.js - рабочий вариант

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
    
    // Загружаем рекорд
    const savedScore = localStorage.getItem('slipperHighscore');
    highscore = savedScore ? parseFloat(savedScore) : 0;
    highscoreDisplay.textContent = highscore.toFixed(1);
    
    // Инициализация
    updateCharacterPosition();
    hideSlipper();
    
    // События
    setupEventListeners();
});

function setupEventListeners() {
    gameArea.addEventListener('mousemove', handleMouseMove);
    gameArea.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', togglePause);
    resetBtn.addEventListener('click', resetGame);
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
    
    gameRunning = true;
    gamePaused = false;
    time = 0;
    score = 0;
    slipperSpeed = 3;
    slipperDirectionX = 0;
    
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    pauseBtn.textContent = 'Пауза';
    
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
}

function togglePause() {
    if (!gameRunning) return;
    
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? 'Продолжить' : 'Пауза';
    
    if (gamePaused) {
        clearInterval(gameInterval);
        clearInterval(slipperInterval);
    } else {
        gameInterval = setInterval(updateGame, 100);
        slipperInterval = setInterval(moveSlipper, 20);
    }
}

function resetGame() {
    gameRunning = false;
    gamePaused = false;
    
    clearInterval(gameInterval);
    clearInterval(slipperInterval);
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Пауза';
    
    time = 0;
    score = 0;
    
    timeDisplay.textContent = '0.0';
    scoreDisplay.textContent = '0';
    
    hideSlipper();
    character.style.animation = '';
    
    // Сброс достижений
    setTimeout(() => {
        achievements.forEach(ach => ach.classList.remove('unlocked'));
    }, 300);
}

function updateGame() {
    time += 0.1;
    timeDisplay.textContent = time.toFixed(1);
    
    // Увеличиваем сложность каждые 10 секунд
    if (Math.floor(time) % 10 === 0 && Math.floor(time) > 0) {
        if (!slipper.dataset.difficultyIncreased) {
            slipperSpeed += 0.5;
            slipper.dataset.difficultyIncreased = 'true';
            setTimeout(() => {
                delete slipper.dataset.difficultyIncreased;
            }, 1000);
        }
    }
    
    // Проверяем достижения
    checkAchievements();
}

function createSlipper() {
    // Начальная позиция сверху
    const startX = Math.random() * 80 + 10;
    slipper.style.left = startX + '%';
    slipper.style.top = '-10%';
    
    // Случайное горизонтальное движение
    slipperDirectionX = (Math.random() - 0.5) * 2; // от -1 до 1
}

function moveSlipper() {
    if (!gameRunning || gamePaused) return;
    
    // Текущая позиция тапка
    let currentTop = parseFloat(slipper.style.top) || -10;
    let currentLeft = parseFloat(slipper.style.left) || 50;
    
    // Движение вниз и вбок
    currentTop += slipperSpeed;
    currentLeft += slipperDirectionX;
    
    // Обновляем позицию
    slipper.style.top = currentTop + '%';
    slipper.style.left = currentLeft + '%';
    
    // Отскок от боковых границ
    if (currentLeft < 0 || currentLeft > 95) {
        slipperDirectionX = -slipperDirectionX;
    }
    
    // Проверка попадания
    if (checkCollision()) {
        slipperHit();
        return;
    }
    
    // Если тапок улетел за нижнюю границу
    if (currentTop > 110) {
        score += 10;
        scoreDisplay.textContent = score;
        createSlipper();
    }
}

function checkCollision() {
    const slipperRect = slipper.getBoundingClientRect();
    const characterRect = character.getBoundingClientRect();
    
    // Более точная проверка с запасом
    const collision = !(slipperRect.right < characterRect.left + 20 || 
                       slipperRect.left > characterRect.right - 20 || 
                       slipperRect.bottom < characterRect.top + 20 || 
                       slipperRect.top > characterRect.bottom - 20);
    
    // Добавляем задержку между проверками
    if (collision && !slipper.dataset.collisionChecked) {
        slipper.dataset.collisionChecked = 'true';
        setTimeout(() => {
            delete slipper.dataset.collisionChecked;
        }, 500); // 500ms задержка между проверками
        return true;
    }
    
    return false;
}

function slipperHit() {
    // Анимация попадания
    slipper.style.animation = 'hit 0.3s ease';
    character.style.animation = 'characterHit 0.5s ease';
    
    // Конец игры
    setTimeout(() => {
        gameOver();
    }, 500);
}

function gameOver() {
    gameRunning = false;
    clearInterval(gameInterval);
    clearInterval(slipperInterval);
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    
    // Обновление рекорда
    if (time > highscore) {
        highscore = time;
        highscoreDisplay.textContent = highscore.toFixed(1);
        localStorage.setItem('slipperHighscore', highscore);
        
        // Сообщение о новом рекорде
        showMessage('🎉 НОВЫЙ РЕКОРД! 🎉', '#03b66b');
    } else {
        showMessage('Бабушка таки попала тапком!', '#ff6b00');
    }
    
    // Финальное сообщение
    setTimeout(() => {
        const comment = getFunnyComment(time);
        alert(`Игра окончена!\n\nВремя: ${time.toFixed(1)} сек\nТапков увернулся: ${score}\nРекорд: ${highscore.toFixed(1)} сек\n\n${comment}`);
    }, 1000);
}

function showMessage(text, color) {
    const message = document.createElement('div');
    message.textContent = text;
    message.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${color};
        color: white;
        padding: 20px 40px;
        border-radius: 15px;
        font-size: 24px;
        font-weight: bold;
        z-index: 100;
        animation: fadeIn 0.5s ease;
    `;
    
    gameArea.appendChild(message);
    
    setTimeout(() => {
        if (message.parentNode === gameArea) {
            gameArea.removeChild(message);
        }
    }, 2000);
}

function getFunnyComment(time) {
    if (time < 5) return 'Даже баба Люба из 3 подъезда держится дольше!';
    if (time < 15) return 'Неплохо! Но до бабушкиной меткости ещё далеко.';
    if (time < 30) return 'Отлично! Ты почти как молодой Евреев!';
    return 'ВОТ ЭТО ДА! Бабушка гордилась бы тобой!';
}

function checkAchievements() {
    achievements.forEach(achievement => {
        const targetTime = parseInt(achievement.dataset.target) || 0;
        if (time >= targetTime && !achievement.classList.contains('unlocked')) {
            achievement.classList.add('unlocked');
            
            // Мини-анимация разблокировки
            achievement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                achievement.style.transform = '';
            }, 300);
        }
    });
}