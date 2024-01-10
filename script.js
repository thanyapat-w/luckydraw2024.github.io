console.log("Script loaded");
document.addEventListener('DOMContentLoaded', function() {
    const nameListElement = document.getElementById('nameList');
    const addNameButton = document.getElementById('addName');
    const attendeesCountElement = document.getElementById('attendeesCount');
    const randomNumberSelector = document.getElementById('randomNumber');
    const removeAfterDrawCheckbox = document.getElementById('removeAfterDraw');
    const resultBoxElement = document.getElementById('resultBox');
    const shuffleButton = document.getElementById('shuffleButton');
    const fireworkContainer = document.querySelector('.firework-container');
    let names = [];
    let isLocked = false;
    function updateAttendeesCount() {
        attendeesCountElement.textContent = names.length;
    }
    addNameButton.addEventListener('click', function() {
        if (!isLocked) {
            const newNames = nameListElement.value.trim().split('\n').filter(name => name !== '');
            names = names.concat(newNames);
            updateAttendeesCount();
            nameListElement.setAttribute('readonly', true);
            addNameButton.setAttribute('disabled', true);
            isLocked = true;
        }
    });
    randomNumberSelector.addEventListener('change', function() {
        if (randomNumberSelector.value <= 10) {
            resultBoxElement.classList.remove('two-columns');
            resultBoxElement.style.alignItems = 'center';
        } else {
            resultBoxElement.classList.add('two-columns');
            resultBoxElement.style.alignItems = 'center';
        }
    });
    function startRolling() {
        const numWinners = parseInt(randomNumberSelector.value);
        const shuffledNames = names.slice().sort(() => Math.random() - 0.5);
        const winners = shuffledNames.slice(0, numWinners); // No sort
        // const winners = shuffledNames.slice(0, numWinners).sort(); // Sort the winners alphabetically
        resultBoxElement.textContent = '';
        let currentIndex = 0;
        const rollingInterval = setInterval(function() {
            resultBoxElement.textContent = shuffledNames[currentIndex];
            currentIndex = (currentIndex + 1) % shuffledNames.length;
        }, 20); //Rolling faster set this number bigger
        setTimeout(function() {
            clearInterval(rollingInterval);
            resultBoxElement.textContent = winners.join('\n');
            if (winners.length > 10) {
                const halfLength = Math.ceil(winners.length / 2);
                const firstHalf = winners.slice(0, halfLength);
                const secondHalf = winners.slice(halfLength);
            
                if (resultBoxElement.classList.contains('two-columns')) {
                    const firstColumn = document.createElement('div');
                    const secondColumn = document.createElement('div');
                    firstHalf.forEach(function(winner) {
                        const p = document.createElement('p');
                        p.textContent = winner;
                        firstColumn.appendChild(p);
                    });
                    secondHalf.forEach(function(winner) {
                        const p = document.createElement('p');
                        p.textContent = winner;
                        secondColumn.appendChild(p);
                    });
                    firstColumn.classList.add('column');
                    secondColumn.classList.add('column');
                    resultBoxElement.innerHTML = '';
                    resultBoxElement.appendChild(firstColumn);
                    resultBoxElement.appendChild(secondColumn);
                } else {
                    const winnersList = document.createElement('ul');
                    winners.forEach(function(winner) {
                        const li = document.createElement('li');
                        li.textContent = winner;
                        winnersList.appendChild(li);
                    });
                    resultBoxElement.innerHTML = '';
                    resultBoxElement.appendChild(winnersList);
                }
            } else {
                const winnersList = document.createElement('ul');
                winners.forEach(function(winner) {
                    const li = document.createElement('li');
                    li.textContent = winner;
                    winnersList.appendChild(li);
                });
                resultBoxElement.innerHTML = '';
                resultBoxElement.appendChild(winnersList);
            }           
            if (removeAfterDrawCheckbox.checked) {
                names = names.filter(name => !winners.includes(name));
                updateAttendeesCount();
            }
            fireworkContainer.style.display = 'flex';
            setTimeout(function() {
                fireworkContainer.style.display = 'none';
            }, 3000); //how long firework will show, larger number longer screentime
        }, 2000); // how long rolling will show, larger number longer rolling
    }
    shuffleButton.addEventListener('click', function() {
        if (resultBoxElement.innerHTML.trim() !== '') {
            resultBoxElement.innerHTML = '';
            return;
        }
        const numWinners = parseInt(randomNumberSelector.value);
        if (isNaN(numWinners) || numWinners <= 0) {
            resultBoxElement.textContent = 'Please select a valid number of winners.';
            return;
        }
        if (names.length < numWinners) {
            resultBoxElement.textContent = 'Not enough names to select that many winners.';
            return;
        }
        startRolling();
    });
});
