const questions = [
    {
        q: "Твоя тактика в миду, если всё идет плохо?",
        options: [
            { text: "Купить Hand of Midas и верить в чудо", score: 10 },
            { text: "Написать 'GG' и встать в амулет", score: 5 },
            { text: "Сказать, что это стратегия 'Feed to Win'", score: 15 }
        ]
    },
    {
        q: "Сколько репортов ты получил за последнюю неделю?",
        options: [
            { text: "0-2 (ты точно не Филипп)", score: 0 },
            { text: "Достаточно, чтобы скрыться от системы", score: 10 },
            { text: "Я сам на себя кидаю репорты для профилактики", score: 20 }
        ]
    },
    {
        q: "Что ты сделаешь, если увидишь бабушкин тапок?",
        options: [
            { text: "Увернусь как в той самой игре на сайте", score: 15 },
            { text: "Приму удар достойно", score: 5 },
            { text: "Попробую забайтить тапок на Рошана", score: 10 }
        ]
    },

    {
    q: "Твой любимый напиток во время катки?",
    options: [
        { text: "Святая вода (чтобы не гореть)", score: 5 },
        { text: "Энергетик 'Ярость Евреева'", score: 20 },
        { text: "Чай (я слишком спокоен для этого мира)", score: 0 }
    ]
    },

    {
        q: "Филипп зовет тебя в пати, но ты уже в катке. Твои действия?",
        options: [
            { text: "Ливнуть и пойти к легенде", score: 25 },
            { text: "Доиграть и заставить его ждать (опасно!)", score: 5 },
            { text: "Притвориться, что у меня выключили свет", score: 10 }
        ]
    }

];

let currentQuestion = 0;
let totalScore = 0;

function nextQuestion(step) {
    const container = document.getElementById('test-container');
    const questionText = document.getElementById('question-text');
    const optionsDiv = document.getElementById('options');

    if (currentQuestion < questions.length) {
        const qData = questions[currentQuestion];
        questionText.innerText = qData.q;
        optionsDiv.innerHTML = ''; // Очищаем кнопки

        qData.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'test-btn';
            btn.innerText = opt.text;
            btn.onclick = () => {
                totalScore += opt.score;
                currentQuestion++;
                nextQuestion();
            };
            optionsDiv.appendChild(btn);
        });
    } else {
        showResult();
    }
}
function showResult() {
    document.getElementById('test-container').style.display = 'none';
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    
    // Максимально возможный балл теперь 100 (15+20+15+20+25 если сложить всё самое «евреевское»)
    // Делим на 100, чтобы получить верный процент
    let percent = Math.min(Math.round((totalScore / 100) * 100), 100);
    document.getElementById('percent').innerText = percent;

    let comment = "";
    if (percent >= 90) comment = "Ты — реинкарнация Филиппа! Иди катай в Доту.";
    else if (percent > 50) comment = "В тебе есть дух Евреева, но тапок тебя всё же догонит.";
    else if (percent > 20) comment = "Ты на пути к просветлению, но пока слабовато.";
    else comment = "Ты слишком адекватен. Филипп тобой разочарован.";
    
    document.getElementById('result-comment').innerText = comment;
}

function resetTest() {
    currentQuestion = 0;
    totalScore = 0;
    document.getElementById('test-container').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    document.getElementById('question-text').innerText = "Готов узнать, насколько ты Евреев?";
    document.getElementById('options').innerHTML = '<button class="test-btn" onclick="nextQuestion(1)">Начать тест</button>';
}
