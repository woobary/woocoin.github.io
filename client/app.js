// Основные переменные игры
let wooCoin = parseInt(localStorage.getItem('wooCoin')) || 0;
let baryCoin = parseFloat(localStorage.getItem('baryCoin')) || 0;
let energy = parseInt(localStorage.getItem('energy')) || 2000;
let level = parseInt(localStorage.getItem('level')) || 1;
let hourlyEarnings = parseInt(localStorage.getItem('hourlyEarnings')) || 0;
let coinsPerClick = parseInt(localStorage.getItem('coinsPerClick')) || 1;
let totalClicks = parseInt(localStorage.getItem('totalClicks')) || 0;
let friendsCount = parseInt(localStorage.getItem('friendsCount')) || 0;
let walletConnected = localStorage.getItem('walletConnected') || 'no';
let prizeClaimed50000 = localStorage.getItem('prizeClaimed50000') === 'true';
let prizeClaimed100000 = localStorage.getItem('prizeClaimed100000') === 'true';

// Показ всплывающего сообщения
function showPopup(amount, x, y) {
    const popup = document.createElement('div');
    popup.textContent = `+${amount}`;
    popup.className = 'coin-popup';
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
}

// Обработка кликов по монете
document.querySelector('.coin-img').addEventListener('click', (event) => {
    const earnings = (localStorage.getItem('doubleClickEnabled') === 'true') ? 2 : 1;
    wooCoin += earnings;
    totalClicks++;
    saveData();
    updateUI();
    showPopup(earnings, event.clientX, event.clientY);
});

// В функции обработки кликов в app.js
document.querySelector('.coin-img').addEventListener('click', (event) => {
    const earnings = playerHasDoubleClickUpgrade ? 2 : playerHasTripleClickUpgrade ? 3 : 1;
    wooCoin += earnings;
    totalClicks += 1;
    saveData();
    updateUI();
    showAnimatedPopup(`+${earnings} WooCoin`, event.clientX, event.clientY);
  
    // Проверяем достижения после обновления данных
    if (totalClicks === 1000) {
      fetch('/award-achievement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ criteria: 'clicks_1000' })
      });
    }
  });
  

// Восстановление энергии
function restoreEnergy() {
    setInterval(() => {
        if (energy < 2000) {
            energy++;
            saveData();
            updateUI();
        }
    }, 1000);
}

// Функция для покупки улучшения
function purchaseUpgrade(title, price, currency) {
    if ((currency === 'WooCoin' && wooCoin >= price) || (currency === 'BaryCoin' && baryCoin >= price)) {
        if (currency === 'WooCoin') wooCoin -= price;
        if (currency === 'BaryCoin') baryCoin -= price;
        alert(`Улучшение "${title}" куплено!`);
        saveData();
        updateUI();
    } else {
        alert('Недостаточно средств для покупки!');
    }
}

// Привязка событий к апгрейдам
function bindCardEvents() {
    document.querySelectorAll('.upgrade-card').forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.upgrade-title').innerText;
            const [price, currency] = card.querySelector('.upgrade-price span').innerText.split(' ');
            purchaseUpgrade(title, parseFloat(price), currency);
        });
    });
}

// Загрузка данных и установка событий
window.onload = function() {
    loadData();
    calculateOfflineEarnings();
    updateUI();
    bindCardEvents();

    if (localStorage.getItem('autoClickEnabled') === 'true') {
        startAutoClick();
    }

    if (localStorage.getItem('baryCoinFasterEnabled') === 'true') {
        startBaryCoinFaster();
    }

    restoreEnergy();
    autoEarnings();
};

// Обновление интерфейса
function updateUI() {
    if (document.getElementById('wooCoin')) document.getElementById('wooCoin').innerText = Math.floor(wooCoin);
    if (document.getElementById('baryCoin')) document.getElementById('baryCoin').innerText = baryCoin.toFixed(2);
    if (document.getElementById('energy')) document.getElementById('energy').innerText = `${energy}/2000`;
    if (document.getElementById('coinsPerClick')) document.getElementById('coinsPerClick').innerText = coinsPerClick;
    if (document.getElementById('totalClicks')) document.getElementById('totalClicks').innerText = totalClicks;
    if (document.getElementById('walletStatus')) document.getElementById('walletStatus').innerText = walletConnected === 'yes' ? 'Кошелек подключен!' : 'Кошелек не подключен';
}

function goToScene(scene) {
    const container = document.querySelector('.container');
    container.classList.add('fade-out'); // Анимация исчезновения
  
    setTimeout(() => {
      window.location.href = scene;
    }, 500); // Переход после завершения анимации
  }

  function showLevelUpAnimation(level) {
    const levelUpMessage = document.createElement('div');
    levelUpMessage.textContent = `🎉 Новый уровень: ${level}! 🎉`;
    levelUpMessage.className = 'level-up animated';
    document.body.appendChild(levelUpMessage);
  
    setTimeout(() => {
      levelUpMessage.classList.add('fade-out');
    }, 2000);
  
    setTimeout(() => {
      levelUpMessage.remove();
    }, 2500);
  }
  
// Функция для показа анимации всплывающего сообщения
function showAnimatedPopup(message, x, y) {
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.className = 'coin-popup animated'; // Добавляем класс анимации
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
  
    document.body.appendChild(popup);
  
    setTimeout(() => {
      popup.classList.add('fade-out'); // Добавляем класс для эффекта исчезновения
    }, 1000);
  
    setTimeout(() => {
      popup.remove();
    }, 1500);
  }
  
// Функции для сохранения и загрузки данных
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

// Функция для сохранения данных на сервер
function saveDataToServer() {
    const userData = {
        wooCoin,
        baryCoin,
        energy,
        level,
        hourlyEarnings,
        coinsPerClick,
        totalClicks,
        friendsCount,
    };

    fetch('/api/users/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Данные успешно сохранены на сервере');
        } else {
            console.error('Ошибка при сохранении данных на сервере');
        }
    })
    .catch(error => {
        console.error('Ошибка сети:', error);
    });
}


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
