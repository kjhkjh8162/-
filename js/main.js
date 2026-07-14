// 메인 초기화
document.addEventListener('DOMContentLoaded', () => {
    // LocalStorage에서 설정 로드
    const gameSettings = storageManager.applyLoadedSettings();
    
    // 설정 매니저 초기화
    settingsManager = new SettingsManager();
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 저장 버튼 이벤트
    document.getElementById('saveSettingsBtn').addEventListener('click', () => {
        // 경로 저장
        if (pathManager && pathManager.isPathValid()) {
            CONFIG.PATHS[1] = pathManager.getPath();
        }
        settingsManager.saveSettings();
    });
    
    // 게임 루프 시작
    gameLoop();\n});