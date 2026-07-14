// UI 관리
function showScreen(screenId) {
    console.log('화면 전환:', screenId);
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
    } else {
        console.error('화면을 찾을 수 없습니다:', screenId);
    }
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
    if (!container) {
        console.error('unitButtons 컨테이너를 찾을 수 없습니다!');
        return;
    }
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
    
    if (game && game.selectedAllyType === type) {
        game.selectedAllyType = null;
    } else if (game) {
        game.selectedAllyType = type;
        btnElement.classList.add('selected');
    }
}

function setupEventListeners() {
    console.log('이벤트 리스너 설정 중...');
    
    // 메인 화면 버튼들
    const startBtn = document.getElementById('startBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            console.log('게임 시작 클릭됨');
            try {
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
            } catch (error) {
                console.error('게임 시작 오류:', error);
                alert('게임 시작 중 오류가 발생했습니다: ' + error.message);
            }
        });
        console.log('startBtn 이벤트 추가됨');
    } else {
        console.error('startBtn을 찾을 수 없습니다!');
    }
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            console.log('설정 클릭됨');
            try {
                showScreen('settingsScreen');
            } catch (error) {
                console.error('설정 화면 전환 오류:', error);
            }
        });
        console.log('settingsBtn 이벤트 추가됨');
    } else {
        console.error('settingsBtn을 찾을 수 없습니다!');
    }
    
    // 게임 화면 버튼들
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            if (game) {
                game.isPaused = !game.isPaused;
                pauseBtn.textContent = game.isPaused ? '계속' : '일시정지';
            }
        });
    }
    
    const backToMainBtn = document.getElementById('backToMainBtn');
    if (backToMainBtn) {
        backToMainBtn.addEventListener('click', () => {
            if (game) game.isRunning = false;
            showScreen('mainScreen');
        });
    }
    
    const nextRoundBtn = document.getElementById('nextRoundBtn');
    if (nextRoundBtn) {
        nextRoundBtn.addEventListener('click', () => {
            console.log('다음 라운드');
        });
    }
    
    // 게임 오버 화면 버튼들
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            showScreen('mainScreen');
        });
    }
    
    const toMainMenuBtn = document.getElementById('toMainMenuBtn');
    if (toMainMenuBtn) {
        toMainMenuBtn.addEventListener('click', () => {
            showScreen('mainScreen');
        });
    }
    
    // 설정 화면 버튼들
    const backToMainFromSettingsBtn = document.getElementById('backToMainFromSettingsBtn');
    if (backToMainFromSettingsBtn) {
        backToMainFromSettingsBtn.addEventListener('click', () => {
            showScreen('mainScreen');
        });
    }
    
    console.log('이벤트 리스너 설정 완료');
}

function gameLoop() {
    if (game && game.isRunning) {
        game.update();
        game.draw();
    }
    requestAnimationFrame(gameLoop);
}