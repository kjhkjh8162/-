// 설정 관리
class SettingsManager {
    constructor() {
        this.setupTabs();
        this.initializeSettings();
    }
    
    setupTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.getAttribute('data-tab')));
        });
    }
    
    switchTab(tabName) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        
        document.getElementById(tabName + 'Tab').classList.add('active');
        event.target.classList.add('active');
    }
    
    initializeSettings() {
        this.createAllySettings();
        this.createEnemySettings();
        this.createPathSettings();
        this.createRoundSettings();
        this.createGameSettings();
    }
    
    createAllySettings() {
        const container = document.getElementById('alliesSettings');
        container.innerHTML = '';
        
        for (let i = 1; i <= 6; i++) {
            const allyData = CONFIG.ALLIES[i];
            const div = document.createElement('div');
            div.className = 'unit-settings';
            div.innerHTML = `
                <h3>${allyData.name}</h3>
                <div class="image-upload">
                    <div class="image-preview" id="ally-preview-${i}">
                        <span>이미지 없음</span>
                    </div>
                    <input type="file" accept="image/*" onchange="settingsManager.uploadAllyImage(${i}, event)">
                </div>
                <div class="stats-grid">
                    <div class="stat-input">
                        <label>공격력</label>
                        <input type="number" value="${allyData.attackPower}" onchange="CONFIG.ALLIES[${i}].attackPower = parseInt(this.value)">
                    </div>
                    <div class="stat-input">
                        <label>공격속도</label>
                        <input type="number" step="0.1" value="${allyData.attackSpeed}" onchange="CONFIG.ALLIES[${i}].attackSpeed = parseFloat(this.value)">
                    </div>
                    <div class="stat-input">
                        <label>사거리</label>
                        <input type="number" value="${allyData.range}" onchange="CONFIG.ALLIES[${i}].range = parseInt(this.value)">
                    </div>
                    <div class="stat-input">
                        <label>가격</label>
                        <input type="number" value="${allyData.cost}" onchange="CONFIG.ALLIES[${i}].cost = parseInt(this.value)">
                    </div>
                </div>
            `;
            container.appendChild(div);
        }
    }
    
    createEnemySettings() {
        const container = document.getElementById('enemiesSettings');
        container.innerHTML = '';
        
        for (let i = 1; i <= 6; i++) {
            const enemyData = CONFIG.ENEMIES[i];
            const div = document.createElement('div');
            div.className = 'unit-settings';
            div.innerHTML = `
                <h3>${enemyData.name}</h3>
                <div class="image-upload">
                    <div class="image-preview" id="enemy-preview-${i}">
                        <span>이미지 없음</span>
                    </div>
                    <input type="file" accept="image/*" onchange="settingsManager.uploadEnemyImage(${i}, event)">
                </div>
                <div class="stats-grid">
                    <div class="stat-input">
                        <label>체력</label>
                        <input type="number" value="${enemyData.health}" onchange="CONFIG.ENEMIES[${i}].health = parseInt(this.value)">
                    </div>
                    <div class="stat-input">
                        <label>속도</label>
                        <input type="number" step="0.1" value="${enemyData.speed}" onchange="CONFIG.ENEMIES[${i}].speed = parseFloat(this.value)">
                    </div>
                    <div class="stat-input">
                        <label>골드 보상</label>
                        <input type="number" value="${enemyData.goldReward}" onchange="CONFIG.ENEMIES[${i}].goldReward = parseInt(this.value)">
                    </div>
                </div>
            `;
            container.appendChild(div);
        }
    }
    
    createPathSettings() {
        const container = document.getElementById('pathSettings');
        if (!pathManager) {
            pathManager = new PathManager('pathCanvas');
            pathManager.setPath(CONFIG.PATHS[1]);
        }
    }
    
    createRoundSettings() {
        const container = document.getElementById('roundSettings');
        container.innerHTML = '';
        
        for (let round = 1; round <= CONFIG.MAX_ROUNDS; round++) {
            const config = CONFIG.ROUND_CONFIG[round];
            const div = document.createElement('div');
            div.className = 'round-config';
            div.innerHTML = `<h3>라운드 ${round}</h3>`;
            
            if (config.enemies) {
                for (let i = 0; i < config.enemies.length; i++) {
                    const enemy = config.enemies[i];
                    div.innerHTML += `
                        <div class="enemy-config">
                            <label>적 종류 ${i + 1}</label>
                            <input type="number" min="1" max="6" value="${enemy.type}" onchange="CONFIG.ROUND_CONFIG[${round}].enemies[${i}].type = parseInt(this.value)">
                            <label>수량</label>
                            <input type="number" min="1" value="${enemy.count}" onchange="CONFIG.ROUND_CONFIG[${round}].enemies[${i}].count = parseInt(this.value)">
                        </div>
                    `;
                }
            }
            
            container.appendChild(div);
        }
    }
    
    createGameSettings() {
        const settings = storageManager.getAllSettings().gameSettings;
        document.getElementById('roundStartMessage').value = settings.message || '';
        document.getElementById('messageDisplayTime').value = settings.messageTime || 3;
    }
    
    uploadAllyImage(type, event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                CONFIG.ALLIES[type].image = img;
                this.updateImagePreview(`ally-preview-${type}`, img);
            };
            reader.readAsDataURL(file);
        }
    }
    
    uploadEnemyImage(type, event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                CONFIG.ENEMIES[type].image = img;
                this.updateImagePreview(`enemy-preview-${type}`, img);
            };
            reader.readAsDataURL(file);
        }
    }
    
    updateImagePreview(previewId, img) {
        const preview = document.getElementById(previewId);
        preview.innerHTML = '';
        preview.appendChild(img);
    }
    
    saveSettings() {
        const settings = {
            allies: CONFIG.ALLIES,
            enemies: CONFIG.ENEMIES,
            paths: CONFIG.PATHS,
            roundConfig: CONFIG.ROUND_CONFIG,
            gameSettings: {
                message: document.getElementById('roundStartMessage').value,
                messageTime: parseInt(document.getElementById('messageDisplayTime').value)
            }
        };
        
        storageManager.save(settings);
        alert('설정이 저장되었습니다!');
    }
}

let settingsManager = null;