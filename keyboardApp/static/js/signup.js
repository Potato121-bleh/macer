// let usernameInput = document.getElementById('username-input-id')
// let nicknameInput = document.getElementById('nickname-input-id')
// let passwordInput = document.getElementById('password-input-id')
const getCSRFToken = () => {
    return document.querySelector('[name=csrfmiddlewaretoken]').value
}

const handleRoute = (route) => {
    let prepRoute = './' + route
    window.location.href = prepRoute
}

const handleSignup = async () => {
    let usernameInput = document.getElementById('username-input-id')
    let nicknameInput = document.getElementById('nickname-input-id')
    let passwordInput = document.getElementById('password-input-id')

    let userNameTem = usernameInput?.value.trim()
    let nickNameTem = nicknameInput?.value.trim()
    let passwordTem = passwordInput?.value.trim()
    if (!userNameTem || !nickNameTem || !passwordTem) {
        alert('Please fill all required field to continue')
        return
    }
    try {
        console.log(userNameTem)
        let signUpResp = await fetch(
            'http://127.0.0.1:8000/api/keyboardApp/auth/signup',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify({
                    username: userNameTem,
                    nickname: nickNameTem,
                    password: passwordTem,
                }),
            }
        )
        if (signUpResp.ok && signUpResp.status !== 200) {
            throw new Error('unexpected response status')
        }
        let data = await signUpResp.json()
        alert(data['Message'])
        handleRoute('home')
    } catch (e) {
        console.log(e)
        alert('Failed to sign up new user: ' + e)
    }
}
