// DFA State Machine
class VendingMachineDFA {
    constructor() {
        this.states = ['q0', 'q1', 'q2', 'q3', 'q4', 'q5'];
        this.currentState = 'q0';
        this.totalAmount = 0;
        this.transactionHistory = [];
        this.acceptState = 'q5';
        
        // Transition function δ
        this.transitions = {
            'q0': { 1: 'q1', 2: 'q2' },
            'q1': { 1: 'q2', 2: 'q3' },
            'q2': { 1: 'q3', 2: 'q4' },
            'q3': { 1: 'q4', 2: 'q5' },
            'q4': { 1: 'q5', 2: 'q5' },
            'q5': { 1: 'q5', 2: 'q5' }
        };
    }
    
    // Transition to next state based on input
    insertCoin(coinValue) {
        const previousState = this.currentState;
        this.currentState = this.transitions[this.currentState][coinValue];
        this.totalAmount += coinValue;
        
        const logEntry = {
            from: previousState,
            to: this.currentState,
            input: coinValue,
            total: this.totalAmount,
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.transactionHistory.push(logEntry);
        
        return {
            previousState,
            currentState: this.currentState,
            totalAmount: this.totalAmount,
            isAccepted: this.currentState === this.acceptState
        };
    }
    
    // Check if in accepting state
    isInAcceptState() {
        return this.currentState === this.acceptState;
    }
    
    // Reset machine to initial state
    reset() {
        this.currentState = 'q0';
        this.totalAmount = 0;
        this.transactionHistory = [];
    }
    
    // Get current state info
    getStateInfo() {
        return {
            currentState: this.currentState,
            totalAmount: this.totalAmount,
            isAccepted: this.isInAcceptState()
        };
    }
}

// Initialize DFA
const vendingMachine = new VendingMachineDFA();

// UI Update Functions
function updateUI() {
    const stateInfo = vendingMachine.getStateInfo();
    
    // Update current state display
    document.getElementById('current-state-display').textContent = stateInfo.currentState;
    document.getElementById('total-amount').textContent = `₹${stateInfo.totalAmount}`;
    
    // Update status message
    const statusElement = document.getElementById('status');
    if (stateInfo.isAccepted) {
        statusElement.textContent = '✅ Item Dispensed!';
        statusElement.style.color = '#28a745';
    } else {
        statusElement.textContent = `Insert ₹${5 - stateInfo.totalAmount} more`;
        statusElement.style.color = '#667eea';
    }
    
    // Highlight active state
    document.querySelectorAll('.state-circle').forEach(circle => {
        circle.classList.remove('active');
    });
    document.querySelector(`#state-${stateInfo.currentState} .state-circle`).classList.add('active');
    
    // Update transaction log
    updateTransactionLog();
}

function updateTransactionLog() {
    const logContent = document.getElementById('log-content');
    const history = vendingMachine.transactionHistory;
    
    if (history.length === 0) {
        logContent.innerHTML = '<p style="color: #999;">No transactions yet</p>';
        return;
    }
    
    logContent.innerHTML = history.slice().reverse().map(entry => `
        <div class="log-entry">
            <strong>${entry.timestamp}</strong>: 
            ${entry.from} → ${entry.to} 
            [₹${entry.input} inserted, Total: ₹${entry.total}]
        </div>
    `).join('');
}

// Insert coin function
function insertCoin(coinValue) {
    const result = vendingMachine.insertCoin(coinValue);
    updateUI();
    
    // If reached accepting state, show dispensing animation
    if (result.isAccepted && result.previousState !== 'q5') {
        showDispensingAnimation();
    }
    
    // Add animation to button
    const button = event.target.closest('.coin-btn');
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 100);
}

// Show dispensing animation
function showDispensingAnimation() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 999;
    `;
    
    const dispensingBox = document.createElement('div');
    dispensingBox.className = 'dispensing';
    dispensingBox.innerHTML = `
        <h2>🎉 Product Dispensed!</h2>
        <p>Enjoy your item!</p>
        <p style="font-size: 0.9em; color: #999; margin-top: 10px;">
            Total Paid: ₹${vendingMachine.totalAmount}
        </p>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(dispensingBox);
    
    setTimeout(() => {
        overlay.remove();
        dispensingBox.remove();
    }, 2000);
}

// Reset machine
function resetMachine() {
    vendingMachine.reset();
    updateUI();
    
    // Add reset animation
    document.querySelectorAll('.state-circle').forEach(circle => {
        circle.style.transition = 'all 0.5s ease';
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
});
