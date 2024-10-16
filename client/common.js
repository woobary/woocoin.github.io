// common.js
function navigateTo(scene) {
    window.location.href = scene + ".html";
}

function updateUserInterface(wooCoin, baryCoin, energy) {
    document.getElementById('wooCoinDisplay').textContent = wooCoin;
    document.getElementById('baryCoinDisplay').textContent = baryCoin;
    document.getElementById('energyDisplay').textContent = energy;
}
