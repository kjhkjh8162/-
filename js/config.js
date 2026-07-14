// 게임 설정
const CONFIG = {
    // 게임 화면 설정
    GRID_WIDTH: 20,
    GRID_HEIGHT: 10,
    CELL_SIZE: 40,
    
    // 게임 플레이
    MAX_ROUNDS: 5,
    INITIAL_HEALTH: 100,
    INITIAL_GOLD: 150,
    
    // 아군 설정 (기본값)
    ALLIES: {
        1: {
            name: '기본병사',
            cost: 50,
            attackPower: 10,
            attackSpeed: 1.0,
            range: 3,
            image: null
        },
        2: {
            name: '궁수',
            cost: 75,
            attackPower: 15,
            attackSpeed: 0.8,
            range: 5,
            image: null
        },
        3: {
            name: '마법사',
            cost: 100,
            attackPower: 20,
            attackSpeed: 0.6,
            range: 4,
            image: null
        },
        4: {
            name: '전사',
            cost: 120,
            attackPower: 25,
            attackSpeed: 0.9,
            range: 2,
            image: null
        },
        5: {
            name: '성직자',
            cost: 80,
            attackPower: 12,
            attackSpeed: 1.1,
            range: 3,
            image: null
        },
        6: {
            name: '암살자',
            cost: 95,
            attackPower: 30,
            attackSpeed: 0.5,
            range: 2,
            image: null
        }
    },
    
    // 적군 설정 (기본값)
    ENEMIES: {
        1: {
            name: '약한 몬스터',
            health: 20,
            speed: 1.5,
            goldReward: 10,
            image: null
        },
        2: {
            name: '일반 몬스터',
            health: 40,
            speed: 1.0,
            goldReward: 20,
            image: null
        },
        3: {
            name: '강한 몬스터',
            health: 60,
            speed: 0.8,
            goldReward: 30,
            image: null
        },
        4: {
            name: '거대 몬스터',
            health: 100,
            speed: 0.5,
            goldReward: 50,
            image: null
        },
        5: {
            name: '엘리트 몬스터',
            health: 80,
            speed: 0.9,
            goldReward: 40,
            image: null
        },
        6: {
            name: '보스 몬스터',
            health: 150,
            speed: 0.3,
            goldReward: 100,
            image: null
        }
    },
    
    // 라운드별 설정
    ROUND_CONFIG: {
        1: {
            message: '라운드 1 시작!',
            messageTime: 3,
            enemies: [
                { type: 1, count: 5 },
                { type: 2, count: 3 }
            ]
        },
        2: {
            message: '라운드 2 시작!',
            messageTime: 3,
            enemies: [
                { type: 2, count: 5 },
                { type: 3, count: 2 }
            ]
        },
        3: {
            message: '라운드 3 시작!',
            messageTime: 3,
            enemies: [
                { type: 2, count: 3 },
                { type: 3, count: 5 },
                { type: 4, count: 1 }
            ]
        },
        4: {
            message: '라운드 4 시작!',
            messageTime: 3,
            enemies: [
                { type: 3, count: 4 },
                { type: 4, count: 4 },
                { type: 5, count: 2 }
            ]
        },
        5: {
            message: '최종 라운드! 보스가 나타난다!',
            messageTime: 4,
            enemies: [
                { type: 4, count: 2 },
                { type: 5, count: 3 },
                { type: 6, count: 1 }
            ]
        }
    },
    
    // 경로 설정 (기본값)
    PATHS: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: []
    },
    
    // 기본 경로 생성
    DEFAULT_PATHS: {
        1: [
            {x: 0, y: 5, type: 'start'},
            {x: 1, y: 5, type: 'path'},
            {x: 2, y: 5, type: 'path'},
            {x: 3, y: 5, type: 'path'},
            {x: 4, y: 5, type: 'path'},
            {x: 5, y: 4, type: 'path'},
            {x: 6, y: 3, type: 'path'},
            {x: 7, y: 3, type: 'path'},
            {x: 8, y: 3, type: 'path'},
            {x: 9, y: 4, type: 'path'},
            {x: 10, y: 5, type: 'path'},
            {x: 11, y: 6, type: 'path'},
            {x: 12, y: 6, type: 'path'},
            {x: 13, y: 5, type: 'path'},
            {x: 14, y: 4, type: 'path'},
            {x: 15, y: 4, type: 'path'},
            {x: 16, y: 4, type: 'path'},
            {x: 17, y: 5, type: 'path'},
            {x: 18, y: 5, type: 'path'},
            {x: 19, y: 5, type: 'end'}
        ]
    }
};

// 기본 경로 모두 설정
for (let i = 1; i <= 5; i++) {
    CONFIG.PATHS[i] = JSON.parse(JSON.stringify(CONFIG.DEFAULT_PATHS[1]));
}