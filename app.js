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

const wooCoinUpgrades = [
    { title: 'Office Cooler', benefit: '+600 WooCoin в час', price: '3000 WooCoin', image: "../images/upgrade-image.jpg" },
    { title: 'Decor', benefit: '+1350 WooCoin в час', price: '6000 WooCoin', image: "../images/upgrade-image.jpg" },
    { title: 'Lighting', benefit: '+2100 WooCoin в час', price: '10000 WooCoin', image: "../images/upgrade-image.jpg" },
    { title: 'Fan', benefit: '+2650 WooCoin в час', price: '13000 WooCoin', image: "../images/upgrade-image.jpg" },
    { title: 'Conditioner', benefit: '+2900 WooCoin в час', price: '15000 WooCoin', image: "../images/upgrade-image.jpg" },
    { title: 'Update Components', benefit: '+3550 WooCoin в час', price: '18000 WooCoin', image: "../images/upgrade-image.jpg" },
    { title: 'New Chairs', benefit: '+4100 WooCoin в час', price: '22000 WooCoin', image: "../images/upgrade-image.jpg" },
    { title: 'New Tables', benefit: '+4800 WooCoin в час', price: '24500 WooCoin', image: "../images/upgrade-image.jpg" },
    { title: 'New Computers', benefit: '+6800 WooCoin в час', price: '30000 WooCoin', image: "../images/upgrade-image.jpg" },
    { title: 'New Safe Deposit', benefit: '+7850 WooCoin в час', price: '33500 WooCoin', image: "../images/upgrade-image.jpg" },
    { title: 'Chill Room', benefit: '+8650 WooCoin в час', price: '35000 WooCoin', image: "../images/upgrade-image.jpg" },
    { title: 'Cafeteria', benefit: '+11500 WooCoin в час', price: '45000 WooCoin', image: "../images/upgrade-image.jpg" }
];

const baryCoinUpgrades = [
    { title: 'Ассистент', benefit: '+500 WooCoin в час', price: '200 BaryCoin', image: "../images/upgrade1-image.jpg" },
    { title: 'Бизнес-ассистент', benefit: '+1000 WooCoin в час', price: '400 BaryCoin', image: "../images/upgrade1-image.jpg" },
    { title: 'Практический ассистент', benefit: '+2000 WooCoin в час', price: '700 BaryCoin', image: "../images/upgrade1-image.jpg" },
    { title: 'Копирайтер', benefit: '+2800 WooCoin в час', price: '1000 BaryCoin', image: "../images/upgrade1-image.jpg" },
    { title: 'HR директор', benefit: '+3500 WooCoin в час', price: '1350 BaryCoin', image: "../images/upgrade1-image.jpg" },
    { title: 'IT специалист', benefit: '+4250 WooCoin в час', price: '1600 BaryCoin', image: "../images/upgrade1-image.jpg" },
    { title: 'Менеджер', benefit: '+5400 WooCoin в час', price: '2000 BaryCoin', image: "../images/upgrade1-image.jpg" },
    { title: 'Маркетолог', benefit: '+6200 WooCoin в час', price: '2400 BaryCoin', image: "../images/upgrade1-image.jpg" },
    { title: 'Менеджер по продажам', benefit: '+7800 WooCoin в час', price: '3000 BaryCoin', image: "../images/upgrade1-image.jpg" },
    { title: 'B2B менеджер', benefit: '+8700 WooCoin в час', price: '3500 BaryCoin', image: "../images/upgrade1-image.jpg" },
    { title: 'Финансовый менеджер', benefit: '+9800 WooCoin в час', price: '4000 BaryCoin', image: "../images/upgrade1-image.jpg" },
    { title: 'Главный директор', benefit: '+11700 WooCoin в час', price: '7000 BaryCoin', image: "../images/upgrade1-image.jpg" }
];

function loadUpgrades(containerId, upgrades) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container с ID "${containerId}" не найден.`);
        return;
    }

    container.innerHTML = ''; // Очистить контейнер перед добавлением новых карточек
    upgrades.forEach(upgrade => {
        console.log(`Добавляем карточку для ${upgrade.title}`); // Проверка добавления карточки
        const card = document.createElement('div');
        card.className = 'upgrade-card';
        card.innerHTML = `
            <img src="${upgrade.image}" alt="${upgrade.title}">
            <h3 class="upgrade-title">${upgrade.title}</h3>
            <p class="upgrade-benefit">${upgrade.benefit}</p>
            <div class="upgrade-price"><span>${upgrade.price}</span></div>
        `;
        container.appendChild(card);
    });
}


// Загрузка карточек улучшений за WooCoin и BaryCoin
window.onload = function() {
    loadUpgrades('wooCoinContainer', wooCoinUpgrades);
    loadUpgrades('baryCoinContainer', baryCoinUpgrades);
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
