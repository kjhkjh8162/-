// 메인 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('게임 초기화 시작...');
    
    try {
        // LocalStorage에서 설정 로드
        const gameSettings = storageManager.applyLoadedSettings();
        console.log('저장된 설정 로드 완료');
        
        // 설정 매니저 초기화
        settingsManager = new SettingsManager();
        console.log('설정 매니저 초기화 완료');
        
        // 이벤트 리스너 설정
        setupEventListeners();
        console.log('이벤트 리스너 설정 완료');
        
        // 저장 버튼 이벤트
        document.getElementById('saveSettingsBtn').addEventListener('click', () => {
            console.log('설정 저장 클릭');
            // 경로 저장
            if (pathManager && pathManager.isPathValid()) {
                CONFIG.PATHS[1] = pathManager.getPath();
            }
            settingsManager.saveSettings();
        });
        
        console.log('게임 초기화 완료!');\n    } catch (error) {
        console.error('초기화 오류:', error);
        alert('게임 초기화 중 오류가 발생했습니다. 콘솔을 확인하세요.');\n    }\n});