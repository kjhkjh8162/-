// UI 관리
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function showGameOverScreen(won) {
    showScreen('gameOverScreen');
    const title = document.getElementById('gameOverTitle');
    const message = document.getElementById('gameOverMessage');
    
    if (won) {
        title.textContent = '승리!';
        message.textContent = `축하합니다! 모든 라운드를 클리어했습니다!`;
    } else {
        title.textContent = '게임 오버';
        message.textContent = `체력이 0이 되었습니다.`;
    }
}

function initializeUnitButtons() {
    const container = document.getElementById('unitButtons');
    container.innerHTML = '';
    
    for (let i = 1; i <= 6; i++) {
        const btn = document.createElement('button');
        btn.className = 'unit-btn';
        btn.textContent = CONFIG.ALLIES[i].name;
        btn.id = `unit-btn-${i}`;
        btn.onclick = () => selectUnit(i, btn);
        container.appendChild(btn);
    }
}

function selectUnit(type, btnElement) {
    // 이전 선택 해제
    document.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('selected'));
    
    if (game.selectedAllyType === type) {
        game.selectedAllyType = null;
    } else {
        game.selectedAllyType = type;
        btnElement.classList.add('selected');
    }
}

function setupEventListeners() {
    // 메인 화면
    document.getElementById('startBtn').addEventListener('click', () => {
        game = new Game('gameCanvas');
        allyManager.clear();
        enemyManager.clear();
        game.health = CONFIG.INITIAL_HEALTH;
        game.gold = CONFIG.INITIAL_GOLD;
        game.round = 1;
        initializeUnitButtons();
        showScreen('gameScreen');
        game.updateUI();
        game.startRound();
        gameLoop();
    });
    
    document.getElementById('settingsBtn').addEventListener('click', () => {
        showScreen('settingsScreen');
    });
    
    // 게임 화면
    document.getElementById('pauseBtn').addEventListener('click', () => {
        if (game) {
            game.isPaused = !game.isPaused;
            document.getElementById('pauseBtn').textContent = game.isPaused ? '계속' : '일시정지';
        }
    });
    
    document.getElementById('backToMainBtn').addEventListener('click', () => {
        if (game) game.isRunning = false;
        showScreen('mainScreen');
    });
    
    document.getElementById('nextRoundBtn').addEventListener('click', () => {
        // 라운드 진행
    });
    
    // 게임 오버
    document.getElementById('restartBtn').addEventListener('click', () => {
        showScreen('mainScreen');
    });
    
    document.getElementById('toMainMenuBtn').addEventListener('click', () => {
        showScreen('mainScreen');
    });
    
    // 설정
    document.getElementById('backToMainFromSettingsBtn').addEventListener('click', () => {
        showScreen('mainScreen');
    });
}

function gameLoop() {
    if (game && game.isRunning) {
        game.update();
        game.draw();
    }
    requestAnimationFrame(gameLoop);
}