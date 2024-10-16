// Основные переменные игры
let wooCoin = parseInt(localStorage.getItem('wooCoin')) || 0;
let baryCoin = parseFloat(localStorage.getItem('baryCoin')) || 0;  // Используем parseFloat для работы с дробными значениями
let energy = parseInt(localStorage.getItem('energy')) || 2000;
let level = parseInt(localStorage.getItem('level')) || 1;
let hourlyEarnings = parseInt(localStorage.getItem('hourlyEarnings')) || 0;
let coinsPerClick = parseInt(localStorage.getItem('coinsPerClick')) || 1;
let totalClicks = parseInt(localStorage.getItem('totalClicks')) || 0;
let friendsCount = parseInt(localStorage.getItem('friendsCount')) || 0;
let walletConnected = localStorage.getItem('walletConnected') || 'no';
let prizeClaimed50000 = localStorage.getItem('prizeClaimed50000') === 'true';  // Приз за 50000 кликов
let prizeClaimed100000 = localStorage.getItem('prizeClaimed100000') === 'true';  // Приз за 100000 кликов

// Показ всплывающего сообщения
function showPopup(amount, x, y) {
    const popup = document.createElement('div');
    popup.textContent = `+${amount}`;
    popup.className = 'coin-popup';
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 1000);
}

// Обработка кликов по монете
document.querySelector('.coin-img').addEventListener('click', (event) => {
    const earnings = playerHasDoubleClickUpgrade ? 2 : playerHasTripleClickUpgrade ? 3 : 1;
    wooCoin += earnings;
    totalClicks += 1;
    saveData();
    updateUI();
    showPopup(earnings, event.clientX, event.clientY);
});

// Восстановление энергии
function restoreEnergy() {
    setInterval(() => {
        if (energy < 2000) {
            energy += 1;
            saveData();
            updateUI();
        }
    }, 1000);
}

// Функция для обработки покупки улучшения
function purchaseUpgrade(title, price, currency) {
    let sufficientFunds = false;
    if (currency === 'WooCoin' && wooCoin >= price) {
        wooCoin -= price;
        sufficientFunds = true;
    } else if (currency === 'BaryCoin' && baryCoin >= price) {
        baryCoin -= price;
        sufficientFunds = true;
    }

    if (sufficientFunds) {
        alert(`Улучшение "${title}" куплено!`);
        saveData();
        updateUI();
    } else {
        alert('Недостаточно средств для покупки!');
    }
}

// Привязка событий к статически добавленным карточкам
function bindCardEvents() {
    document.querySelectorAll('.upgrade-card').forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.upgrade-title').innerText;
            const priceText = card.querySelector('.upgrade-price span').innerText;
            const [price, currency] = priceText.split(' ');
            purchaseUpgrade(title, parseFloat(price), currency);
        });
    });
}

// Загрузка данных и привязка событий после загрузки страницы
window.onload = function() {
    loadData();
    calculateOfflineEarnings();
    updateUI();
    bindCardEvents(); // Привязка событий к карточкам

    if (localStorage.getItem('autoClickEnabled') === 'true') {
        startAutoClick();
    }

    if (localStorage.getItem('baryCoinFasterEnabled') === 'true') {
        startBaryCoinFaster();
    }

    restoreEnergy();
    autoEarnings();
};


// Покупка апгрейдов в магазине
function purchaseShopUpgrade(upgradeName, cost, currency) {

    if (currency === 'BaryCoin' && baryCoin >= cost) {
        baryCoin -= cost;
    } else if (currency === 'WooCoin' && wooCoin >= cost) {
        wooCoin -= cost;
    } else {
        alert('Недостаточно средств для покупки!');
        return;
    }

    switch (upgradeName) {
        case 'doubleClick':
            coinsPerClick += 1;
            break;
        case 'autoClick':
            if (!window.autoClickEnabled) {
                window.autoClickEnabled = true;
                setInterval(() => {
                    wooCoin += 1;
                    saveData();
                    updateUI();
                }, 1000);
            }
            break;
        case 'restoreEnergy':
            energy = 2000;
            break;
        case 'baryCoinFaster':
            startBaryCoinFaster();
            localStorage.setItem('baryCoinFasterEnabled', 'true');
            break;
        default:
            alert('Неизвестный апгрейд!');
    }

    saveData();
    updateUI();
}

// Начало начисления BaryCoin быстрее
function startBaryCoinFaster() {
    if (!window.baryCoinFasterEnabled) {
        window.baryCoinFasterEnabled = true;
        setInterval(() => {
            baryCoin += 0.01;
            saveData();
            updateUI();
        }, 1000);
    }
}

// Функция обновления интерфейса в сцене PRIZE
function updatePrizeUI() {
    document.getElementById('totalClicks').innerText = totalClicks;

    if (totalClicks >= 50000 && !prizeClaimed50000) {
        wooCoin += 100000;
        prizeClaimed50000 = true;
        localStorage.setItem('prizeClaimed50000', 'true');
        alert('Поздравляем! Вы заработали 100000 WooCoin за 50000 кликов!');
    }

    if (totalClicks >= 100000 && !prizeClaimed100000) {
        wooCoin += 300000;
        prizeClaimed100000 = true;
        localStorage.setItem('prizeClaimed100000', 'true');
        alert('Поздравляем! Вы заработали 300000 WooCoin за 100000 кликов!');
    }

    saveData();
}

// Генерация реферального кода
function generateReferralCode() {
    let code = localStorage.getItem('referralCode');
    if (!code) {
        code = 'USER_' + Math.random().toString(36).substr(2, 5);
        localStorage.setItem('referralCode', code);
    }
    return code;
}

// Отображение реферального кода и количества друзей
function displayReferralInfo() {
    const referralCode = generateReferralCode();
    document.getElementById('referralCode').innerText = referralCode;
    document.getElementById('friendsCount').innerText = friendsCount;
}

// Подключение кошелька
function connectWallet() {
    const walletAddress = prompt("Введите адрес вашего кошелька:");
    if (walletAddress) {
        localStorage.setItem('walletAddress', walletAddress);
        walletConnected = 'yes';
        document.getElementById('walletStatus').innerText = `Кошелек подключен: ${walletAddress}`;
        saveData();
    }
}

// Сохранение данных
function saveData() {
    localStorage.setItem('wooCoin', wooCoin);
    localStorage.setItem('baryCoin', baryCoin.toFixed(2));
    localStorage.setItem('energy', energy);
    localStorage.setItem('level', level);
    localStorage.setItem('hourlyEarnings', hourlyEarnings);
    localStorage.setItem('coinsPerClick', coinsPerClick);
    localStorage.setItem('totalClicks', totalClicks);
    localStorage.setItem('friendsCount', friendsCount);
    localStorage.setItem('walletConnected', walletConnected);
}

// Загрузка данных
function loadData() {
    wooCoin = parseInt(localStorage.getItem('wooCoin')) || 0;
    baryCoin = parseFloat(localStorage.getItem('baryCoin')) || 0;
    energy = parseInt(localStorage.getItem('energy')) || 2000;
    level = parseInt(localStorage.getItem('level')) || 1;
    hourlyEarnings = parseInt(localStorage.getItem('hourlyEarnings')) || 0;
    coinsPerClick = parseInt(localStorage.getItem('coinsPerClick')) || 1;
    totalClicks = parseInt(localStorage.getItem('totalClicks')) || 0;
    friendsCount = parseInt(localStorage.getItem('friendsCount')) || 0;
}

// Автоматическое начисление прибыли
function autoEarnings() {
    setInterval(() => {
        wooCoin += hourlyEarnings / 3600;
        saveData();
        updateUI();
    }, 1000);
}

// Рассчет доходов при загрузке
function calculateOfflineEarnings() {
    const lastExitTime = localStorage.getItem('lastExitTime');
    if (lastExitTime) {
        const currentTime = Date.now();
        const elapsedSeconds = Math.floor((currentTime - lastExitTime) / 1000);

        if (localStorage.getItem('autoClickEnabled') === 'true') {
            wooCoin += elapsedSeconds * coinsPerClick;
        }

        if (localStorage.getItem('baryCoinFasterEnabled') === 'true') {
            baryCoin += elapsedSeconds * 0.01;
        }

        energy = Math.min(energy + elapsedSeconds, 2000);
        saveData();
        updateUI();
    }
}

// Сохранение времени выхода
window.addEventListener('beforeunload', () => {
    localStorage.setItem('lastExitTime', Date.now());
});

// Обновление интерфейса
function updateUI() {
    if (document.getElementById('wooCoin')) document.getElementById('wooCoin').innerText = Math.floor(wooCoin);
    if (document.getElementById('baryCoin')) document.getElementById('baryCoin').innerText = baryCoin.toFixed(2);
    if (document.getElementById('energy')) document.getElementById('energy').innerText = `${energy}/2000`;
    if (document.getElementById('coinsPerClick')) document.getElementById('coinsPerClick').innerText = coinsPerClick;
    if (document.getElementById('totalClicks')) document.getElementById('totalClicks').innerText = totalClicks;
    if (document.getElementById('walletStatus')) document.getElementById('walletStatus').innerText = walletConnected === 'yes' ? 'Кошелек подключен!' : 'Кошелек не подключен';
}

// Обработчик загрузки страницы
window.onload = function() {
    loadData();
    calculateOfflineEarnings();
    displayReferralInfo();

    if (localStorage.getItem('autoClickEnabled') === 'true') {
        startAutoClick();
    }

    if (localStorage.getItem('baryCoinFasterEnabled') === 'true') {
        startBaryCoinFaster();
    }

    restoreEnergy();
    autoEarnings();
    updateUI();
};
