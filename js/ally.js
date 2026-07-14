// 아군 클래스
class Ally {
    constructor(id, x, y, config) {
        this.id = id; // 고유 ID
        this.type = config.type; // 아군 종류 (1-6)
        this.x = x;
        this.y = y;
        this.width = CONFIG.CELL_SIZE * CONFIG.GRID_HEIGHT * 0.04;
        this.height = CONFIG.CELL_SIZE * CONFIG.GRID_HEIGHT * 0.04;
        
        const allyData = CONFIG.ALLIES[this.type];
        this.name = allyData.name;
        this.baseCost = allyData.cost;
        this.baseAttackPower = allyData.attackPower;
        this.baseAttackSpeed = allyData.attackSpeed;
        this.range = allyData.range;
        this.image = allyData.image;
        
        this.upgradeLevel = 0;
        this.attackPower = this.baseAttackPower;
        this.attackSpeed = this.baseAttackSpeed;
        
        this.targets = [];
        this.attackCooldown = 0;
    }
    
    // 강화 수행
    upgrade() {
        this.upgradeLevel++;
        this.attackPower = this.baseAttackPower * Math.pow(2, this.upgradeLevel);
        this.attackSpeed = this.baseAttackSpeed * Math.pow(1.25, this.upgradeLevel);
    }
    
    // 강화 비용 계산
    getUpgradeCost() {
        return this.baseCost * Math.pow(2, this.upgradeLevel);
    }
    
    // 업데이트
    update(enemies) {
        // 공격 쿨다운 감소
        if (this.attackCooldown > 0) {
            this.attackCooldown -= this.attackSpeed;
        }
        
        // 범위 내 적 찾기
        this.targets = enemies.filter(enemy => {
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance <= this.range * CONFIG.CELL_SIZE * CONFIG.GRID_HEIGHT * 0.04;
        });
        
        // 공격
        if (this.targets.length > 0 && this.attackCooldown <= 0) {
            const target = this.targets[0];
            target.takeDamage(this.attackPower);
            this.attackCooldown = 1;
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
    }
    
    // 플레이스홀더 그리기
    drawPlaceholder(ctx) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa07a', '#98d8c8', '#f7dc6f'];
        ctx.fillStyle = colors[this.type - 1];
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        ctx.fillStyle = '#fff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.type, this.x, this.y);
    }
    
    // 범위 표시
    drawRange(ctx) {
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range * CONFIG.CELL_SIZE * CONFIG.GRID_HEIGHT * 0.04, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // 정보 가져오기
    getInfo() {
        return {
            name: this.name,
            type: this.type,
            level: this.upgradeLevel,
            attackPower: Math.round(this.attackPower * 100) / 100,
            attackSpeed: Math.round(this.attackSpeed * 100) / 100,
            range: this.range,
            baseCost: this.baseCost,
            upgradeCost: this.getUpgradeCost()
        };
    }
}

// 아군 매니저
class AllyManager {
    constructor() {
        this.allies = [];
        this.nextId = 1;
    }
    
    // 아군 추가
    addAlly(x, y, type) {
        const config = { type };
        const ally = new Ally(this.nextId++, x, y, config);
        this.allies.push(ally);
        return ally;
    }
    
    // 아군 제거
    removeAlly(id) {
        const index = this.allies.findIndex(a => a.id === id);
        if (index !== -1) {
            const ally = this.allies[index];
            this.allies.splice(index, 1);
            return ally;
        }
        return null;
    }
    
    // ID로 아군 찾기
    getAllyById(id) {
        return this.allies.find(a => a.id === id);
    }
    
    // 위치로 아군 찾기
    getAllyAtPosition(x, y, radius = 15) {
        return this.allies.find(a => {
            const dx = a.x - x;
            const dy = a.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance <= radius;
        });
    }
    
    // 모든 아군 업데이트
    updateAll(enemies) {
        this.allies.forEach(ally => ally.update(enemies));
    }
    
    // 모든 아군 그리기
    drawAll(ctx) {
        this.allies.forEach(ally => ally.draw(ctx));
    }
    
    // 모든 아군 제거
    clear() {
        this.allies = [];
    }
    
    // 배치 위치 유효성 검사
    isValidPosition(x, y) {
        // 다른 아군과 겹치지 않는지 확인
        for (let ally of this.allies) {
            const dx = ally.x - x;
            const dy = ally.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < CONFIG.CELL_SIZE * CONFIG.GRID_HEIGHT * 0.08) {
                return false;
            }
        }
        return true;
    }
}

const allyManager = new AllyManager();