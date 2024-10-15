Telegram.WebApp.ready();  // Инициализация Telegram Web App

let wooCoin = 0;
let energy = 2000;

function clickCoin() {
    if (energy > 0) {
        wooCoin += 1;
        energy -= 1;
        document.getElementById('wooCoin').innerText = wooCoin;
        document.getElementById('energy').innerText = `${energy}/2000`;

        // Отправляем данные на сервер
        fetch('/save-progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                wooCoin: wooCoin,
                energy: energy
            })
        });
    } else {
        alert('Энергия закончилась! Ждите восстановления.');
    }
}
