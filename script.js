const display_text = document.querySelector('#text-display');
const buttons = document.querySelectorAll(".btn");

const state = {
    display_text: "0",
    currentInput: "0",
    previousValue: null,
    operator: null,
    overwrite: false,
}

function initCalculator() {
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const type = btn.dataset.type;
            const value = btn.dataset.value ?? btn.textContent.trim();

            switch (type) {
                case "digit": inputDigit(state, value); break;
                case "decimal": inputDecimal(state); break;
                case "operator": setOperator(state, value); break;
                case "equal": evaluate(state); break;
                case "clear-all": clearAll(state); break;
                case "clear-entry": clearEntry(state); break;
                case "percent": percentage(state);
                default: return;
            }
            display_text.textContent = state.display_text;
        });
    });

}

function inputDigit(state, d) {
    if (state.overwrite || state.currentInput === "0") state.currentInput = String(d);
    else state.currentInput += String(d);
    state.display_text = state.currentInput;
    state.overwrite = false;
}

function inputDecimal(state) {
    if (state.overwrite) {
        state.currentInput = "0.";
        state.overwrite = false;
    } else if (!state.currentInput.includes(".")) {
        state.currentInput += "."
    }
    state.display_text = state.currentInput;
}

function setOperator(state, operator) {
    if (state.operator && state.previousValue !== null && !state.overwrite) {
        evaluate(state);
    }

    state.previousValue = state.currentInput;
    state.operator = operator;
    state.overwrite = true;
}

function evaluate(state) {
    if (!state.operator || state.previousValue === null) return;
    const a = Number(state.previousValue);
    const b = Number(state.currentInput);
    let result;

    switch (state.operator) {
        case '+':
            result = a + b;
            break;
        case '-':
            result = a - b;
            break;
        case '*':
            result = a * b;
            break;
        case '/':
            if (b === 0) {
                state.display_text = "Error";
                return 0;
            }
            result = a / b;
            break;
    }

    const roundedResult = parseFloat(result.toFixed(10));
    state.currentInput = String(roundedResult);
    state.display_text = state.currentInput;
    state.previousValue = null;
    state.operator = null
    state.overwrite = true;
}

function clearAll(state) {
    state.display_text = "0";
    state.currentInput = "0";
    state.previousValue = null;
    state.operator = null;
    state.overwrite = false;
}

function clearEntry(state) {
    state.currentInput = "0";
    state.display_text = "0";
}

function percentage(state) {
    state.currentInput = String(Number(state.currentInput) / 100);
    state.display_text = state.currentInput;
}

initCalculator();
