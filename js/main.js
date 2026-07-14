// 메인 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== 게임 초기화 시작 ===');
    
    try {
        // LocalStorage에서 설정 로드
        console.log('1. 저장된 설정 로드 중...');
        const gameSettings = storageManager.applyLoadedSettings();
        console.log('1. 저장된 설정 로드 완료', gameSettings);
        
        // 설정 매니저 초기화
        console.log('2. 설정 매니저 초기화 중...');
        settingsManager = new SettingsManager();
        console.log('2. 설정 매니저 초기화 완료');
        
        // 이벤트 리스너 설정
        console.log('3. 이벤트 리스너 설정 중...');
        setupEventListeners();
        console.log('3. 이벤트 리스너 설정 완료');
        
        // 저장 버튼 이벤트
        const saveBtn = document.getElementById('saveSettingsBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                console.log('설정 저장 클릭');
                if (pathManager && pathManager.isPathValid()) {
                    CONFIG.PATHS[1] = pathManager.getPath();
                }
                settingsManager.saveSettings();
            });
        }
        
        console.log('=== 게임 초기화 완료 ===');
        console.log('F12 키를 눌러 콘솔에서 로그를 확인할 수 있습니다.');
        
    } catch (error) {
        console.error('초기화 오류:', error);
        console.error('스택 트레이스:', error.stack);
        alert('게임 초기화 중 오류가 발생했습니다.\n' + error.message + '\n콘솔(F12)을 확인하세요.');
    }
});