// Основные переменные игры
let wooCoin = parseInt(localStorage.getItem('wooCoin')) || 0;
let baryCoin = parseInt(localStorage.getItem('baryCoin')) || 0;
let energy = parseInt(localStorage.getItem('energy')) || 2000;
let level = parseInt(localStorage.getItem('level')) || 1;
let hourlyEarnings = parseInt(localStorage.getItem('hourlyEarnings')) || 0;
let coinsPerClick = parseInt(localStorage.getItem('coinsPerClick')) || 1;
let totalClicks = parseInt(localStorage.getItem('totalClicks')) || 0;
let friendsCount = parseInt(localStorage.getItem('friendsCount')) || 0;
let walletConnected = localStorage.getItem('walletConnected') || 'no';

function clickCoin() {
    if (energy > 0) {
        wooCoin += coinsPerClick;  // Прибавляем количество WooCoin за клик
        totalClicks++;  // Увеличиваем общее количество кликов
        energy -= 1;  // Уменьшаем энергию на 1 за каждый клик
        saveData();  // Сохраняем данные
        updateUI();  // Обновляем интерфейс
    } else {
        alert('Энергия закончилась! Ждите восстановления.');
    }
}


function purchaseShopUpgrade(upgrade, cost, currency) {
    if (currency === 'BaryCoin' && baryCoin >= cost) {
        baryCoin -= cost;
    } else if (currency === 'WooCoin' && wooCoin >= cost) {
        wooCoin -= cost;
    } else {
        alert('Недостаточно средств!');
        return;
    }

    if (upgrade === 'doubleClick') {
        coinsPerClick += 1;  // Увеличиваем количество WooCoin за клик
    } else if (upgrade === 'autoClick') {
        setInterval(() => {
            wooCoin += 1;
            saveData();
            updateUI();
        }, 1000);  // Автоматически добавляем 1 WooCoin каждую секунду
    } else if (upgrade === 'restoreEnergy') {
        energy = 2000;  // Полное восстановление энергии
    } else if (upgrade === 'baryCoinFaster') {
        setInterval(() => {
            baryCoin += 0.01;  // Автоматически добавляем 0.01 BaryCoin каждую секунду
            saveData();
            updateUI();
        }, 1000);  // Процесс начисления BaryCoin
    }

    saveData();
    updateUI();
}


// Функция для покупок в магазине
function purchaseShopUpgrade(upgrade, cost, currency) {
    if (currency === 'BaryCoin' && baryCoin >= cost) {
        baryCoin -= cost;
    } else if (currency === 'WooCoin' && wooCoin >= cost) {
        wooCoin -= cost;
    } else {
        alert('Недостаточно средств!');
        return;
    }

    if (upgrade === 'doubleClick') {
        coinsPerClick += 1;
    } else if (upgrade === 'autoClick') {
        setInterval(() => {
            wooCoin += 1;
            saveData();
            updateUI();
        }, 1000);
    } else if (upgrade === 'restoreEnergy') {
        energy = 2000;
    }

    saveData();
    updateUI();
}

function purchaseShopUpgrade(upgrade, cost, currency) {
    if (currency === 'BaryCoin' && baryCoin >= cost) {
        baryCoin -= cost;
    } else if (currency === 'WooCoin' && wooCoin >= cost) {
        wooCoin -= cost;
    } else {
        alert('Недостаточно средств!');
        return;
    }

    if (upgrade === 'doubleClick') {
        coinsPerClick += 1;
    } else if (upgrade === 'autoClick') {
        setInterval(() => {
            wooCoin += 1;
            saveData();
            updateUI();
        }, 1000);
    } else if (upgrade === 'restoreEnergy') {
        energy = 2000;
    } else if (upgrade === 'baryCoinFaster') {
        setInterval(() => {
            baryCoin += 0.01;
            saveData();
            updateUI();
        }, 1000); // Авто прибавление BaryCoin каждые 1 секунду
    }

    saveData();
    updateUI();
}


function connectWallet() {
    // Если используется Telegram WebApp API
    const walletAddress = prompt("Введите адрес вашего кошелька:");
    if (walletAddress) {
        localStorage.setItem('walletAddress', walletAddress);
        document.getElementById('walletStatus').innerText = `Кошелек подключен: ${walletAddress}`;
    }
}



function generateReferralCode() {
    let code = localStorage.getItem('referralCode');
    if (!code) {
        code = 'USER_' + Math.random().toString(36).substr(2, 5);
        localStorage.setItem('referralCode', code);
    }
    return code;
}

// Восстановление реферального кода
const referralCode = generateReferralCode();

// Отображение реферального кода
document.getElementById('referralCode').innerText = referralCode;


// Функция перехода между сценами
function goToScene(scene) {
    window.location.href = scene;
}

// Функция сохранения данных
function saveData() {
    localStorage.setItem('wooCoin', wooCoin);
    localStorage.setItem('baryCoin', baryCoin);
    localStorage.setItem('energy', energy);
    localStorage.setItem('level', level);
    localStorage.setItem('hourlyEarnings', hourlyEarnings);
    localStorage.setItem('coinsPerClick', coinsPerClick);
    localStorage.setItem('totalClicks', totalClicks);
    localStorage.setItem('friendsCount', friendsCount);
}

// Функция обновления интерфейса
function updateUI() {
    document.getElementById('wooCoin').innerText = wooCoin;
    document.getElementById('baryCoin').innerText = baryCoin;
    document.getElementById('energy').innerText = `${energy}/2000`;
    document.getElementById('level').innerText = level;
    document.getElementById('hourlyEarnings').innerText = hourlyEarnings;
    document.getElementById('coinsPerClick').innerText = coinsPerClick;
    document.getElementById('totalClicks').innerText = totalClicks;
    if (document.getElementById('totalClicks')) {
        document.getElementById('totalClicks').innerText = totalClicks; // Обновляем общее количество кликов
       (document.getElementById('walletStatus')) ;
        document.getElementById('walletStatus').innerText = walletConnected === 'yes' ? 'Кошелек подключен!' : 'Кошелек не подключен';
    }
}

// Восстановление данных при загрузке
window.onload = function() {
    updateUI();
    setInterval(() => {
        if (energy < 2000) {
            energy += 1;
            saveData();
            updateUI();
        }
    }, 1000); // Восстановление энергии каждую секунду
}
