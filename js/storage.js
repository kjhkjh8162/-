// LocalStorage 저장 및 로드 관리
class StorageManager {
    constructor() {
        this.storageKey = 'inconvenientDefenseSettings';
    }

    // 설정 저장
    save(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            console.log('설정이 저장되었습니다.');
        } catch (error) {
            console.error('설정 저장 실패:', error);
        }
    }

    // 설정 로드
    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                console.log('저장된 설정을 불러왔습니다.');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('설정 로드 실패:', error);
        }
        return null;
    }

    // 설정 삭제
    clear() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('설정이 삭제되었습니다.');
        } catch (error) {
            console.error('설정 삭제 실패:', error);
        }
    }

    // 현재 저장된 모든 설정 가져오기
    getAllSettings() {
        const saved = this.load();
        if (saved) {
            return {
                allies: saved.allies || CONFIG.ALLIES,
                enemies: saved.enemies || CONFIG.ENEMIES,
                paths: saved.paths || CONFIG.PATHS,
                roundConfig: saved.roundConfig || CONFIG.ROUND_CONFIG,
                gameSettings: saved.gameSettings || {
                    message: '',
                    messageTime: 3
                }
            };
        }
        return {
            allies: CONFIG.ALLIES,
            enemies: CONFIG.ENEMIES,
            paths: CONFIG.PATHS,
            roundConfig: CONFIG.ROUND_CONFIG,
            gameSettings: {
                message: '',
                messageTime: 3
            }
        };
    }

    // 현재 설정으로 CONFIG 업데이트
    applyLoadedSettings() {
        const settings = this.getAllSettings();
        
        // 깊은 복사로 설정 적용
        Object.assign(CONFIG.ALLIES, settings.allies);
        Object.assign(CONFIG.ENEMIES, settings.enemies);
        Object.assign(CONFIG.PATHS, settings.paths);
        Object.assign(CONFIG.ROUND_CONFIG, settings.roundConfig);
        
        return settings.gameSettings;
    }
}

// 전역 StorageManager 인스턴스
const storageManager = new StorageManager();