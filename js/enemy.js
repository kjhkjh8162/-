// 적군 클래스
class Enemy {
    constructor(id, type, path) {
        this.id = id;
        this.type = type;
        this.path = [...path]; // 경로 복사
        this.pathIndex = 0;
        
        const enemyData = CONFIG.ENEMIES[this.type];
        this.name = enemyData.name;
        this.baseHealth = enemyData.health;
        this.baseSpeed = enemyData.speed;
        this.goldReward = enemyData.goldReward;
        this.image = enemyData.image;
        
        this.health = this.baseHealth;
        this.speed = this.baseSpeed;
        this.width = CONFIG.CELL_SIZE * CONFIG.GRID_HEIGHT * 0.04;
        this.height = CONFIG.CELL_SIZE * CONFIG.GRID_HEIGHT * 0.04;
        
        // 시작점에서 시작
        if (this.path.length > 0) {
            this.x = this.path[0].x * CONFIG.CELL_SIZE * CONFIG.GRID_HEIGHT * 0.04;
            this.y = this.path[0].y * CONFIG.CELL_SIZE * CONFIG.GRID_HEIGHT * 0.04;
        }
        
        this.progress = 0; // 경로상 진행률 (0-1)
    }
    
    // 라운드에 따른 능력치 조정
    setRoundStats(round) {
        const healthMultiplier = Math.pow(1.2, round - 1);
        this.health = this.baseHealth * healthMultiplier;
        this.baseHealth = this.health;
        // 속도는 체력이 높을수록 느림
        this.speed = this.baseSpeed / (1 + (round - 1) * 0.15);
    }
    
    // 데미지 입기
    takeDamage(amount) {
        this.health -= amount;
    }
    
    // 죽었는지 확인
    isDead() {
        return this.health <= 0;
    }
    
    // 목적지 도착했는지 확인
    reachedEnd() {
        return this.pathIndex >= this.path.length - 1 && this.progress >= 1;
    }
    
    // 업데이트
    update() {
        if (this.path.length === 0) return;
        
        // 진행률 증가
        this.progress += this.speed * 0.016; // 약 60fps 기준
        
        // 다음 경로로 이동
        if (this.progress >= 1) {
            this.pathIndex++;
            this.progress = 0;
        }
        
        // 경로상 위치 계산
        if (this.pathIndex < this.path.length) {
            const current = this.path[this.pathIndex];
            if (this.pathIndex + 1 < this.path.length) {
                const next = this.path[this.pathIndex + 1];
                this.x = (current.x + (next.x - current.x) * this.progress) * CONFIG.CELL_SIZE * CONFIG.GRID_HEIGHT * 0.04;
                this.y = (current.y + (next.y - current.y) * this.progress) * CONFIG.CELL_SIZE * CONFIG.GRID_HEIGHT * 0.04;
            } else {
                this.x = current.x * CONFIG.CELL_SIZE * CONFIG.GRID_HEIGHT * 0.04;
                this.y = current.y * CONFIG.CELL_SIZE * CONFIG.GRID_HEIGHT * 0.04;
            }
        }
    }
    
    // 그리기
    draw(ctx) {
        if (this.image) {
            try {
                ctx.drawImage(this.image, this.x - this.width/2, this.y - this.height/2, this.width, this.height);
            } catch (e) {
                this.drawPlaceholder(ctx);
            }
        } else {
            this.drawPlaceholder(ctx);
        }
        
        // 체력바
        const barWidth = this.width;
        const barHeight = 4;
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(this.x - barWidth/2, this.y - this.height/2 - 8, barWidth, barHeight);
        ctx.fillStyle = '#44ff44';
        ctx.fillRect(this.x - barWidth/2, this.y - this.height/2 - 8, barWidth * (this.health / this.baseHealth), barHeight);
    }
    
    // 플레이스홀더 그리기
    drawPlaceholder(ctx) {
        const colors = ['#8b0000', '#d32f2f', '#f44336', '#e91e63', '#9c27b0', '#673ab7'];
        ctx.fillStyle = colors[this.type - 1];
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        ctx.fillStyle = '#fff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.type, this.x, this.y);
    }
}

// 적군 매니저
class EnemyManager {
    constructor() {
        this.enemies = [];
        this.nextId = 1;
        this.waveIndex = 0;
    }
    
    // 적군 추가
    addEnemy(type, path) {
        const enemy = new Enemy(this.nextId++, type, path);
        this.enemies.push(enemy);
        return enemy;
    }
    
    // 라운드에 맞게 웨이브 생성
    createWave(round, pathData) {
        const roundConfig = CONFIG.ROUND_CONFIG[round];
        if (!roundConfig) return;
        
        this.enemies = [];
        this.nextId = 1;
        this.waveIndex = 0;
        
        const delays = [];
        let delayCounter = 0;
        
        for (const enemySpawn of roundConfig.enemies) {
            for (let i = 0; i < enemySpawn.count; i++) {
                const enemy = this.addEnemy(enemySpawn.type, pathData);
                enemy.setRoundStats(round);
                delays.push(enemy);
            }
        }
        
        // 적군들을 일정 시간 간격으로 생성하도록 표시
        this.spawnQueue = delays;
        this.spawnDelay = 0;
    }
    
    // 죽은 적군 제거
    removeDeadEnemies() {
        return this.enemies.filter(enemy => !enemy.isDead());
    }
    
    // 목적지 도착한 적 제거
    removeReachedEnemies() {
        const reached = this.enemies.filter(enemy => enemy.reachedEnd());
        this.enemies = this.enemies.filter(enemy => !enemy.reachedEnd());
        return reached;
    }
    
    // 모든 적군 업데이트
    updateAll() {
        this.enemies.forEach(enemy => enemy.update());
        this.enemies = this.removeDeadEnemies();
    }
    
    // 모든 적군 그리기
    drawAll(ctx) {
        this.enemies.forEach(enemy => enemy.draw(ctx));
    }
    
    // 모든 적 제거
    clear() {
        this.enemies = [];
    }
    
    // 남은 적 수
    getRemainingCount() {
        return this.enemies.length;
    }
}

const enemyManager = new EnemyManager();