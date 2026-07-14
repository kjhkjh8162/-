// 경로 에디터 및 렌더러
class PathManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.path = [];
        this.mode = null; // 'start', 'draw', 'end'
        this.startPoint = null;
        this.endPoint = null;
        this.pathCells = [];
        this.currentRound = 1;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        
        document.getElementById('pathStartBtn')?.addEventListener('click', () => this.setMode('start'));
        document.getElementById('pathDrawBtn')?.addEventListener('click', () => this.setMode('draw'));
        document.getElementById('pathEndBtn')?.addEventListener('click', () => this.setMode('end'));
        document.getElementById('pathClearBtn')?.addEventListener('click', () => this.clearPath());
    }
    
    setMode(mode) {
        this.mode = mode;
        this.canvas.style.cursor = mode ? 'crosshair' : 'default';
    }
    
    handleCanvasClick(e) {
        if (!this.mode) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / (this.canvas.width / CONFIG.GRID_WIDTH));
        const y = Math.floor((e.clientY - rect.top) / (this.canvas.height / CONFIG.GRID_HEIGHT));
        
        if (x < 0 || x >= CONFIG.GRID_WIDTH || y < 0 || y >= CONFIG.GRID_HEIGHT) return;
        
        if (this.mode === 'start') {
            if (!this.startPoint) {
                this.startPoint = {x, y, type: 'start'};
                this.pathCells = [{x, y, type: 'start'}];
                this.mode = null;
                this.draw();
            }
        } else if (this.mode === 'draw') {
            if (this.startPoint) {
                const cell = {x, y, type: 'path'};
                if (!this.pathCells.some(c => c.x === x && c.y === y)) {
                    this.pathCells.push(cell);
                    this.draw();
                }
            }
        } else if (this.mode === 'end') {
            if (!this.endPoint && this.pathCells.length > 1) {
                this.endPoint = {x, y, type: 'end'};
                this.pathCells.push(this.endPoint);
                this.mode = null;
                this.draw();
            }
        }
    }
    
    clearPath() {
        this.path = [];
        this.pathCells = [];
        this.startPoint = null;
        this.endPoint = null;
        this.mode = null;
        this.draw();
    }
    
    draw() {
        const cellWidth = this.canvas.width / CONFIG.GRID_WIDTH;
        const cellHeight = this.canvas.height / CONFIG.GRID_HEIGHT;
        
        // 배경
        this.ctx.fillStyle = '#2d2d2d';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 그리드
        this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
        this.ctx.lineWidth = 1;
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
        
        // 경로 셀 그리기
        for (const cell of this.pathCells) {
            let color;
            if (cell.type === 'start') color = '#2ecc71';
            else if (cell.type === 'end') color = '#e74c3c';
            else color = '#3498db';
            
            this.ctx.fillStyle = color;
            this.ctx.fillRect(cell.x * cellWidth + 1, cell.y * cellHeight + 1, cellWidth - 2, cellHeight - 2);
        }
    }
    
    getPath() {
        return this.pathCells;
    }
    
    setPath(pathCells) {
        this.pathCells = pathCells;
        this.startPoint = pathCells.find(c => c.type === 'start');
        this.endPoint = pathCells.find(c => c.type === 'end');
        this.draw();
    }
    
    isPathValid() {
        return this.startPoint && this.endPoint && this.pathCells.length > 2;
    }
}

// 게임에서 경로 렌더링
class PathRenderer {
    static draw(ctx, pathData) {
        if (!pathData || pathData.length === 0) return;
        
        for (const cell of pathData) {
            let color;
            if (cell.type === 'start') color = '#2ecc71';
            else if (cell.type === 'end') color = '#e74c3c';
            else color = '#3498db';
            
            const x = cell.x * CONFIG.CELL_SIZE * CONFIG.GRID_HEIGHT * 0.04;
            const y = cell.y * CONFIG.CELL_SIZE * CONFIG.GRID_HEIGHT * 0.04;
            const size = CONFIG.CELL_SIZE * CONFIG.GRID_HEIGHT * 0.04;
            
            ctx.fillStyle = color;
            ctx.fillRect(x - size/2, y - size/2, size, size);
        }
    }
}

let pathManager = null;