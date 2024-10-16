async function checkReferralBonuses(user) {
    const bonusThresholds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const bonusAmounts = [10000, 30000, 50000, 100000, 150000, 200000, 400000, 500000, 700000, 1000000];

    for (let i = 0; i < bonusThresholds.length; i++) {
        if (user.referralCount === bonusThresholds[i]) {
            user.wooCoin += bonusAmounts[i];
            await user.save();
            return `Поздравляем! Вы получили ${bonusAmounts[i]} WooCoin за приглашение ${bonusThresholds[i]} друзей!`;
        }
    }
    return null;
}

module.exports = checkReferralBonuses;
