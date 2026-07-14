// 게임 메인 클래스
class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // 캔버스 크기 설정
        this.updateCanvasSize();
        window.addEventListener('resize', () => this.updateCanvasSize());
        
        this.round = 1;
        this.health = CONFIG.INITIAL_HEALTH;
        this.gold = CONFIG.INITIAL_GOLD;
        this.isRunning = false;
        this.isPaused = false;
        this.selectedAllyType = null;
        this.roundEnded = false;
        this.showingRoundMessage = false;
        this.roundMessageTime = 0;
        this.deleteMode = false;
        this.lastClickTime = 0;
        this.lastClickedAllyId = null;
        
        this.gameSettings = storageManager.applyLoadedSettings();
        
        this.setupEventListeners();
    }
    
    updateCanvasSize() {
        const scale = 0.5;
        this.canvas.width = CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE * scale;
        this.canvas.height = CONFIG.GRID_HEIGHT * CONFIG.CELL_SIZE * scale;
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }
    
    handleCanvasClick(e) {
        if (!this.isRunning || this.showingRoundMessage || this.roundEnded) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 경로 위치 확인
        const cellX = Math.floor(x / (this.canvas.width / CONFIG.GRID_WIDTH));
        const cellY = Math.floor(y / (this.canvas.height / CONFIG.GRID_HEIGHT));
        const isOnPath = CONFIG.PATHS[this.round].some(p => p.x === cellX && p.y === cellY);
        
        if (this.deleteMode) {
            const ally = allyManager.getAllyAtPosition(x, y);
            if (ally) {
                const refund = Math.floor(ally.baseCost * 0.5);
                this.gold += refund;
                allyManager.removeAlly(ally.id);
                this.updateUI();
            }
        } else if (this.selectedAllyType) {
            if (!isOnPath && allyManager.isValidPosition(x, y)) {
                const cost = CONFIG.ALLIES[this.selectedAllyType].cost;
                if (this.gold >= cost) {
                    this.gold -= cost;
                    allyManager.addAlly(x, y, this.selectedAllyType);
                    this.updateUI();
                } else {
                    alert('골드가 부족합니다!');
                }
            }
        } else {
            // 아군 정보 보기 및 강화
            const ally = allyManager.getAllyAtPosition(x, y);
            if (ally) {
                const now = Date.now();
                if (this.lastClickedAllyId === ally.id && now - this.lastClickTime < 1000) {
                    // 더블 클릭 - 선택 취소
                    this.selectedAllyType = null;
                    this.updateUI();
                } else {
                    // 싱글 클릭 - 정보 표시
                    this.showAllyInfo(ally);
                    this.lastClickedAllyId = ally.id;
                }
                this.lastClickTime = now;
            }
        }
    }
    
    handleKeyDown(e) {
        if (e.key.toLowerCase() === 'f') {
            this.selectedAllyType = null;
            this.updateUI();
        } else if (e.key.toLowerCase() === 'g') {
            this.deleteMode = !this.deleteMode;
            this.updateUI();
        }
    }
    
    showAllyInfo(ally) {
        const panel = document.getElementById('unitInfoPanel');
        const content = document.getElementById('unitInfoContent');
        const info = ally.getInfo();
        
        let html = `
            <div class="unit-stat">
                <span class="label">이름:</span>
                <span>${info.name}</span>
            </div>
            <div class="unit-stat">
                <span class="label">레벨:</span>
                <span>${info.level}</span>
            </div>
            <div class="unit-stat">
                <span class="label">공격력:</span>
                <span>${info.attackPower}</span>
            </div>
            <div class="unit-stat">
                <span class="label">공격속도:</span>
                <span>${info.attackSpeed}</span>
            </div>
            <div class="unit-stat">
                <span class="label">사거리:</span>
                <span>${info.range}</span>
            </div>
            <div class="upgrade-info">
                <button class="upgrade-btn" onclick="game.upgradeAlly(${ally.id})" 
                    ${this.gold < info.upgradeCost ? 'disabled' : ''}>
                    강화 (${info.upgradeCost}G)
                </button>
            </div>
        `;
        
        content.innerHTML = html;
        panel.classList.remove('hidden');
    }
    
    upgradeAlly(allyId) {
        const ally = allyManager.getAllyById(allyId);
        if (ally) {
            const cost = ally.getUpgradeCost();
            if (this.gold >= cost) {
                this.gold -= cost;
                ally.upgrade();
                this.updateUI();
                this.showAllyInfo(ally);
            } else {
                alert('골드가 부족합니다!');
            }
        }
    }
    
    startRound() {
        this.round = Math.min(this.round, CONFIG.MAX_ROUNDS);
        this.isRunning = true;
        this.roundEnded = false;
        this.showRoundMessage();
    }
    
    showRoundMessage() {
        const roundConfig = CONFIG.ROUND_CONFIG[this.round];
        const message = roundConfig.message || `라운드 ${this.round} 시작!`;
        
        const container = document.getElementById('roundMessageContainer');
        const messageEl = document.getElementById('roundMessage');
        messageEl.textContent = message;
        container.classList.add('active');
        this.showingRoundMessage = true;
        this.roundMessageTime = roundConfig.messageTime * 1000;
        
        setTimeout(() => {
            container.classList.remove('active');
            this.showingRoundMessage = false;
            enemyManager.createWave(this.round, CONFIG.PATHS[this.round]);
        }, this.roundMessageTime);
    }
    
    update() {
        if (!this.isRunning || this.isPaused || this.showingRoundMessage) return;
        
        // 적군 업데이트
        enemyManager.updateAll();
        
        // 아군 업데이트
        allyManager.updateAll(enemyManager.enemies);
        
        // 도착한 적 처리
        const reachedEnemies = enemyManager.removeReachedEnemies();
        for (const enemy of reachedEnemies) {
            this.health -= 1;
        }
        
        // 죽은 적 처리
        for (const enemy of enemyManager.enemies) {
            if (enemy.isDead()) {
                this.gold += enemy.goldReward;
            }
        }
        
        // 게임 오버 확인
        if (this.health <= 0) {
            this.gameOver(false);
            return;
        }
        
        // 라운드 클리어 확인
        if (enemyManager.getRemainingCount() === 0 && enemyManager.spawnQueue && enemyManager.spawnQueue.length === 0) {
            if (!this.roundEnded) {
                this.roundEnded = true;
                this.onRoundClear();
            }
        }
        
        this.updateUI();
    }
    
    onRoundClear() {
        if (this.round >= CONFIG.MAX_ROUNDS) {
            this.gameOver(true);
        } else {
            this.showRoundClearUI();
        }
    }
    
    showRoundClearUI() {
        const panel = document.getElementById('roundEndPanel');
        const redeployContainer = document.getElementById('redeployUnits');
        
        redeployContainer.innerHTML = '';
        for (const ally of allyManager.allies) {
            const btn = document.createElement('button');
            btn.className = 'redeploy-unit-btn';
            btn.textContent = ally.name;
            btn.id = `redeploy-${ally.id}`;
            btn.onclick = () => this.selectRedeployUnit(ally.id);
            redeployContainer.appendChild(btn);
        }
        
        panel.classList.remove('hidden');
        setTimeout(() => {
            this.round++;
            panel.classList.add('hidden');
            this.roundEnded = false;
            allyManager.clear();
            this.startRound();
        }, 2000);
    }
    
    selectRedeployUnit(allyId) {
        // 재배치 선택 처리
        const ally = allyManager.getAllyById(allyId);
        if (ally) {
            this.selectedAllyType = ally.type;
            this.updateUI();
        }
    }
    
    gameOver(won) {
        this.isRunning = false;
        showGameOverScreen(won);
    }
    
    draw() {
        // 배경
        this.ctx.fillStyle = '#2d2d2d';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 그리드 (선택사항)
        this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
        this.ctx.lineWidth = 1;
        const cellWidth = this.canvas.width / CONFIG.GRID_WIDTH;
        const cellHeight = this.canvas.height / CONFIG.GRID_HEIGHT;
        
        for (let x = 0; x <= CONFIG.GRID_WIDTH; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * cellWidth, 0);
            this.ctx.lineTo(x * cellWidth, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y <= CONFIG.GRID_HEIGHT; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * cellHeight);
            this.ctx.lineTo(this.canvas.width, y * cellHeight);
            this.ctx.stroke();
        }
        
        // 경로 그리기
        PathRenderer.draw(this.ctx, CONFIG.PATHS[this.round]);
        
        // 아군 그리기
        allyManager.drawAll(this.ctx);
        
        // 적군 그리기
        enemyManager.drawAll(this.ctx);
    }
    
    updateUI() {
        document.getElementById('roundDisplay').textContent = `${this.round}/${CONFIG.MAX_ROUNDS}`;
        document.getElementById('healthDisplay').textContent = this.health;
        document.getElementById('goldDisplay').textContent = this.gold;
    }
}

let game = null;