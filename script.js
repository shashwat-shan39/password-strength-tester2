const strengthMeter = document.getElementById('strength-meter');
const passwordInput = document.getElementById('password-input');
const reasonsContainer = document.getElementById('reasons');

passwordInput.addEventListener('input', updateStrengthMeter);

function updateStrengthMeter(){
    const weaknesses = calculatePasswordStrength(passwordInput.value);
    let strength = 100;
    reasonsContainer.innerHTML = '';
    weaknesses.forEach(weakness => {
        if(weakness == null) return;
        strength-=weakness.deduction;
        const messageElement = document.createElement('div');
        messageElement.innerText=weakness.message;
        reasonsContainer.appendChild(messageElement);

    })
    strengthMeter.style.setProperty('--strength', strength);
}

function calculatePasswordStrength(password){
    const weakness = [];
    weakness.push(lengthWeakness(password));
    weakness.push(lowercaseWeakness(password));
    weakness.push(uppercaseWeakness(password));
    weakness.push(numberWeakness(password));
    weakness.push(specialCharacterWeakness(password));
    weakness.push(repeatCharacterWeakness(password));
    return weakness;
}

function lengthWeakness(password){
    const length=password.length;
    if(length <= 5){
        return {
            message: 'Your password is too short.',
            deduction: 40
        }
    }
    if(length <= 9){
        return {
            message: 'Your password could be longer.',
            deduction: 15
        }
    }
}

function lowercaseWeakness(password){
    return characterTypeWeakness(password, /[a-z]/g, "lowercase characters")
}
function numberWeakness(password){
    return characterTypeWeakness(password, /[0-9]/g, "numbers")
}
function uppercaseWeakness(password){
    return characterTypeWeakness(password, /[A-Z]/g, "uppercase characters")
}
function specialCharacterWeakness(password){
    return characterTypeWeakness(password, /[^0-9a-zA-Z\s]/g, "special characters")
}

function characterTypeWeakness(password, regex, type){
    const matches = password.match(regex) || [];

    if(matches.length === 0){
        return {
            message: `Your password has no ${type}.`,
            deduction: 20
        }
    }
    if(matches.length <= 2){
        return {
            message: `Your password could use more ${type}.`,
            deduction: 5
        }
    }

}

function repeatCharacterWeakness(password){
    const matches = password.match(/(.)\1/g) || [];
    if(matches.length >0){
        return{
            message: 'Your password has repeated characters',
            deduction: matches.length * 10
        }
    }
}