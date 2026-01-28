// Глобальные переменные для игры
let filipcoins = 0;        // Количество монет
let clickForce = 1;        // Сила клика
let autoClick = 0;         // Автокликеры
let achievements = [];     // Достижения

let strongClickCost = 10;  // Стоимость улучшения клика (выносим в переменную)
let autoClickCost = 50; // Стоимость Атоклика
let autoClickInterval = null; // Переменная для хранения интервала автокликов

// Элементы DOM
const ClickPowerText = document.getElementById('ClickPower'); // сила клика текст
const EvreevCoinText = document.getElementById('EvreevCoin'); // текст филипкоинов количество
const AutoClickText =  document.getElementById('autoClickPower') // текст автокликов кол во

const ClikerCharacter = document.getElementById('ClickerCharacter'); // картинка для клика
const ButtonStrongUpgrater = document.getElementById('UpgradePowerClick'); // кнопка улучшения силы клика

const StrongClickCostText = document.getElementById('ClickerCostStrongClick'); // стоимость покупки усиленного клика
const AutoClickCostText = document.getElementById('ClickerCostAutoClick'); // стоимость покупки усиленного клика

const ButtonAutoClick = document.getElementById('UpgradeAutoClick'); // кнопка улучшения автоклика


// Функция обновления интерфейса
function updateUI() {
    EvreevCoinText.textContent = filipcoins;
    ClickPowerText.textContent = clickForce;
    StrongClickCostText.textContent = strongClickCost;
    AutoClickCostText.textContent = autoClickCost;
    AutoClickText.textContent = autoClick;
    
    // Меняем цвет текста с монетами при недостатке средств сила клика
    if (filipcoins < strongClickCost) {
        StrongClickCostText.style.color = "red";
        ButtonStrongUpgrater.disabled = true;
    } else {
        StrongClickCostText.style.color = "green";
        ButtonStrongUpgrater.disabled = false;
    }
    // Меняем цвет текста с монетами при недостатке средств Авто клики
    if (filipcoins < autoClickCost) {
        AutoClickCostText.style.color = "red";
        ButtonAutoClick.disabled = true;
    } else {
        AutoClickCostText.style.color = "green";
        ButtonAutoClick.disabled = false;
    }
}

// Клик по персонажу
ClikerCharacter.addEventListener('click', function() {
    filipcoins += clickForce;
    updateUI();
});


ButtonAutoClick.addEventListener('click', function() {
    if (filipcoins >= autoClickCost) {
        filipcoins -= autoClickCost; // списываем стоимость
        autoClick += 1; // увеличиваем силу клика
        autoClickCost = Math.floor(autoClickCost * 1.5); // увеличиваем стоимость на 50%
        updateUI();
        startAutoClick(); // Запускаем автоклик после покупки
        
        // Можно добавить визуальную обратную связь
        ButtonAutoClick.style.transform = "scale(0.95)";
        setTimeout(() => {
            ButtonAutoClick.style.transform = "scale(1)";
        }, 100);
    }
});

// Улучшение силы клика
ButtonStrongUpgrater.addEventListener('click', function() {
    if (filipcoins >= strongClickCost) {
        filipcoins -= strongClickCost; // списываем стоимость
        clickForce += 1; // увеличиваем силу клика
        strongClickCost = Math.floor(strongClickCost * 1.5); // увеличиваем стоимость на 50%
        updateUI();
        
        // Можно добавить визуальную обратную связь
        ButtonStrongUpgrater.style.transform = "scale(0.95)";
        setTimeout(() => {
            ButtonStrongUpgrater.style.transform = "scale(1)";
        }, 100);
    }
});

// Функция для автокликов
function startAutoClick() {
    // Очищаем предыдущий интервал, если он есть
    if (autoClickInterval) {
        clearInterval(autoClickInterval);
    }
    
    // Запускаем новый интервал только если есть автокликеры
    if (autoClick > 0) {
        autoClickInterval = setInterval(() => {
            filipcoins += autoClick;
            updateUI();
        }, 1000); // Каждую секунду
    }
}

// Проверка достижений (заготовка на будущее)
function checkAchievements() {
    // Проверяем различные достижения
    if (filipcoins >= 100 && !achievements.includes("Первая сотня")) {
        achievements.push("Первая сотня");
    }
    
    if (clickForce >= 10 && !achievements.includes("Силач")) {
        achievements.push("Силач");
    }
}

// Добавляем анимацию при клике
ClikerCharacter.addEventListener('mousedown', function() {
    this.style.transform = "scale(0.95)";
});

ClikerCharacter.addEventListener('mouseup', function() {
    this.style.transform = "scale(1)";
});

ClikerCharacter.addEventListener('mouseleave', function() {
    this.style.transform = "scale(1)";
});


// Инициализация при загрузке
window.addEventListener('DOMContentLoaded', function() {
    updateUI(); // Обновляем интерфейс при загрузке
    startAutoClick(); // Запускаем автокликеры если они есть
});

// Сохранение игры (дополнительная функция)
function saveGame() {
    const gameData = {
        filipcoins: filipcoins,
        clickForce: clickForce,
        autoClick: autoClick,
        achievements: achievements,
        strongClickCost: strongClickCost,
        autoClickCost: autoClickCost
    };
    localStorage.setItem('filipcoinGame', JSON.stringify(gameData));
}

// Загрузка игры (дополнительная функция)
function loadGame() {
    const savedData = localStorage.getItem('filipcoinGame');
    if (savedData) {
        const gameData = JSON.parse(savedData);
        filipcoins = gameData.filipcoins || 0;
        clickForce = gameData.clickForce || 1;
        autoClick = gameData.autoClick || 0;
        achievements = gameData.achievements || [];
        strongClickCost = gameData.strongClickCost || 10;
        autoClickCost = gameData.autoClickCost || 50;
        updateUI();
        startAutoClick(); // Запускаем автоклик после загрузки
    }
}

// Автосохранение каждые 5 секунд
setInterval(saveGame, 1000);

// Загружаем игру при запуске
loadGame();