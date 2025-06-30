class PomodoroTimer {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentTime = 25 * 60; // 25分を秒に変換
        this.sessionType = 'work'; // 'work', 'shortBreak', 'longBreak'
        this.sessionCount = 0;
        this.timerInterval = null;
        
        // 設定値
        this.workDuration = 25;
        this.shortBreakDuration = 5;
        this.longBreakDuration = 15;
        
        // 統計データ
        this.stats = {
            completedSessions: 0,
            totalFocusTime: 0,
            currentStreak: 0
        };
        
        // DOM要素
        this.timerDisplay = document.getElementById('timerDisplay') || document.querySelector('.timer-display');
        this.timerLabel = document.querySelector('.timer-label');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.progressCircle = document.querySelector('.progress-ring-circle');
        
        // 設定要素
        this.workSlider = document.getElementById('workDuration');
        this.shortBreakSlider = document.getElementById('shortBreak');
        this.longBreakSlider = document.getElementById('longBreak');
        this.workValue = document.getElementById('workValue');
        this.shortValue = document.getElementById('shortValue');
        this.longValue = document.getElementById('longValue');
        
        // ペット要素
        this.petAvatar = document.getElementById('petAvatar');
        this.petMessage = document.getElementById('petMessage');
        
        // 統計要素
        this.completedSessionsEl = document.getElementById('completedSessions');
        this.totalFocusTimeEl = document.getElementById('totalFocusTime');
        this.currentStreakEl = document.getElementById('currentStreak');
        
        // 背景アニメーション
        this.backgroundAnimation = document.getElementById('backgroundAnimation');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadStats();
        this.updateDisplay();
        this.updateProgressCircle();
        this.updatePetMessage();
        this.createBackgroundParticles();
    }
    
    bindEvents() {
        // ボタンイベント
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // スライダーイベント
        this.workSlider.addEventListener('input', (e) => {
            this.workDuration = parseInt(e.target.value);
            this.workValue.textContent = this.workDuration;
            if (this.sessionType === 'work' && !this.isRunning) {
                this.currentTime = this.workDuration * 60;
                this.updateDisplay();
                this.updateProgressCircle();
            }
        });
        
        this.shortBreakSlider.addEventListener('input', (e) => {
            this.shortBreakDuration = parseInt(e.target.value);
            this.shortValue.textContent = this.shortBreakDuration;
            if (this.sessionType === 'shortBreak' && !this.isRunning) {
                this.currentTime = this.shortBreakDuration * 60;
                this.updateDisplay();
                this.updateProgressCircle();
            }
        });
        
        this.longBreakSlider.addEventListener('input', (e) => {
            this.longBreakDuration = parseInt(e.target.value);
            this.longValue.textContent = this.longBreakDuration;
            if (this.sessionType === 'longBreak' && !this.isRunning) {
                this.currentTime = this.longBreakDuration * 60;
                this.updateDisplay();
                this.updateProgressCircle();
            }
        });
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.isPaused = false;
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            
            this.timerInterval = setInterval(() => {
                this.currentTime--;
                this.updateDisplay();
                this.updateProgressCircle();
                
                if (this.currentTime <= 0) {
                    this.completeSession();
                }
            }, 1000);
            
            this.updatePetMessage('頑張ってね！応援してるよ 🌸');
            this.playStartSound();
        }
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.isPaused = true;
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            
            clearInterval(this.timerInterval);
            this.updatePetMessage('少し休憩ですね。また一緒に頑張りましょう 😊');
        }
    }
    
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        clearInterval(this.timerInterval);
        
        // 現在のセッションタイプに応じて時間をリセット
        switch (this.sessionType) {
            case 'work':
                this.currentTime = this.workDuration * 60;
                break;
            case 'shortBreak':
                this.currentTime = this.shortBreakDuration * 60;
                break;
            case 'longBreak':
                this.currentTime = this.longBreakDuration * 60;
                break;
        }
        
        this.updateDisplay();
        this.updateProgressCircle();
        this.updatePetMessage('リセットしました。いつでも準備OKです！');
    }
    
    completeSession() {
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        clearInterval(this.timerInterval);
        
        if (this.sessionType === 'work') {
            this.sessionCount++;
            this.stats.completedSessions++;
            this.stats.totalFocusTime += this.workDuration;
            this.stats.currentStreak++;
            
            // 4回目のポモドーロ後は長い休憩
            if (this.sessionCount % 4 === 0) {
                this.sessionType = 'longBreak';
                this.currentTime = this.longBreakDuration * 60;
                this.updatePetMessage('お疲れ様！長い休憩を取りましょう 🌺');
                this.updateTimerLabel('長い休憩');
            } else {
                this.sessionType = 'shortBreak';
                this.currentTime = this.shortBreakDuration * 60;
                this.updatePetMessage('作業完了！少し休憩しましょう ☕');
                this.updateTimerLabel('短い休憩');
            }
            
            this.celebrateCompletion();
        } else {
            // 休憩終了
            this.sessionType = 'work';
            this.currentTime = this.workDuration * 60;
            this.updatePetMessage('休憩終了！また一緒に頑張りましょう 💪');
            this.updateTimerLabel('作業時間');
        }
        
        this.updateDisplay();
        this.updateProgressCircle();
        this.updateStats();
        this.saveStats();
        this.playCompleteSound();
        this.changePetExpression();
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        this.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateProgressCircle() {
        const totalTime = this.getTotalTimeForCurrentSession();
        const progress = (totalTime - this.currentTime) / totalTime;
        const circumference = 2 * Math.PI * 110;
        const offset = circumference - (progress * circumference);
        this.progressCircle.style.strokeDashoffset = offset;
        
        // セッションタイプに応じて色を変更
        switch (this.sessionType) {
            case 'work':
                this.progressCircle.style.stroke = '#ffb3d1';
                break;
            case 'shortBreak':
                this.progressCircle.style.stroke = '#b3ffcc';
                break;
            case 'longBreak':
                this.progressCircle.style.stroke = '#d4b3ff';
                break;
        }
    }
    
    getTotalTimeForCurrentSession() {
        switch (this.sessionType) {
            case 'work':
                return this.workDuration * 60;
            case 'shortBreak':
                return this.shortBreakDuration * 60;
            case 'longBreak':
                return this.longBreakDuration * 60;
            default:
                return this.workDuration * 60;
        }
    }
    
    updateTimerLabel(label) {
        this.timerLabel.textContent = label;
    }
    
    updatePetMessage(message) {
        this.petMessage.textContent = message;
        this.petMessage.style.animation = 'none';
        setTimeout(() => {
            this.petMessage.style.animation = 'fadeIn 0.5s ease-in';
        }, 10);
    }
    
    changePetExpression() {
        const pets = ['🐱', '🐶', '🐰', '🐦', '🐸', '🦄'];
        const currentPet = this.petAvatar.textContent;
        let newPet = pets[Math.floor(Math.random() * pets.length)];
        
        // 同じペットが連続しないようにする
        while (newPet === currentPet) {
            newPet = pets[Math.floor(Math.random() * pets.length)];
        }
        
        this.petAvatar.textContent = newPet;
        this.petAvatar.style.animation = 'none';
        setTimeout(() => {
            this.petAvatar.style.animation = 'petBreathe 3s ease-in-out infinite';
        }, 10);
    }
    
    celebrateCompletion() {
        // 完了時のアニメーション
        this.createCelebrationParticles();
        
        // タイマー円を点滅させる
        this.progressCircle.style.animation = 'pulse 0.5s ease-in-out 3';
        
        setTimeout(() => {
            this.progressCircle.style.animation = '';
        }, 1500);
    }
    
    updateStats() {
        this.completedSessionsEl.textContent = this.stats.completedSessions;
        this.totalFocusTimeEl.textContent = this.stats.totalFocusTime;
        this.currentStreakEl.textContent = this.stats.currentStreak;
    }
    
    saveStats() {
        const today = new Date().toDateString();
        const savedStats = JSON.parse(localStorage.getItem('pomodoroStats') || '{}');
        savedStats[today] = this.stats;
        localStorage.setItem('pomodoroStats', JSON.stringify(savedStats));
    }
    
    loadStats() {
        const today = new Date().toDateString();
        const savedStats = JSON.parse(localStorage.getItem('pomodoroStats') || '{}');
        this.stats = savedStats[today] || {
            completedSessions: 0,
            totalFocusTime: 0,
            currentStreak: 0
        };
        this.updateStats();
    }
    
    createBackgroundParticles() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createParticle();
            }, i * 1000);
        }
        
        // 定期的に新しいパーティクルを生成
        setInterval(() => {
            this.createParticle();
        }, 3000);
    }
    
    createParticle() {
        const particle = document.createElement('div');
        const symbols = ['🌸', '🌺', '🍃', '✨', '🦋', '☁️'];
        
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        particle.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 20 + 15}px;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            pointer-events: none;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            opacity: ${Math.random() * 0.5 + 0.3};
            z-index: 0;
        `;
        
        this.backgroundAnimation.appendChild(particle);
        
        // 一定時間後にパーティクルを削除
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 20000);
    }
    
    createCelebrationParticles() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.textContent = '✨';
                particle.style.cssText = `
                    position: fixed;
                    font-size: 30px;
                    left: 50%;
                    top: 50%;
                    pointer-events: none;
                    animation: celebration 2s ease-out forwards;
                    z-index: 1000;
                `;
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 2000);
            }, i * 100);
        }
    }
    
    playStartSound() {
        // Web Audio APIで優しい音を再生（実装は簡略化）
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Audio playback not supported');
        }
    }
    
    playCompleteSound() {
        // 完了音の再生
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.4); // C6
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.8);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.8);
        } catch (error) {
            console.log('Audio playback not supported');
        }
    }
}

// CSSアニメーションの定義を動的に追加
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes float {
        0% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-20px) rotate(90deg); }
        50% { transform: translateY(0px) rotate(180deg); }
        75% { transform: translateY(-10px) rotate(270deg); }
        100% { transform: translateY(0px) rotate(360deg); }
    }
    
    @keyframes celebration {
        0% { 
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
        }
        100% { 
            transform: translate(-50%, -50%) translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0.5) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(style);

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});

// サービスワーカーの登録（PWA対応）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}