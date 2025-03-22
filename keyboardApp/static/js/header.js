console.log(window.location.pathname)

let loginBtnEle = document.getElementById('login-btn-id')
let signupBtnEle = document.getElementById('signup-btn-id')
let logoutBtnEle = document.getElementById('logout-btn-id')
let dialogLoginBtnEle = document.getElementById('dialog-login-btn-id')
let dialogSignupBtnEle = document.getElementById('dialog-signup-btn-id')
let dialogLogoutBtnEle = document.getElementById('dialog-logout-btn-id')
let userNicknameTextEle = document.getElementById('usernickname-text-id')

switch (window.location.pathname) {
    case '/keyboardApp/home':
        let homeLabel = document.getElementById('navbar-home-label-id')
        let pizzaIcon = document.getElementById('pizza-icon-id')
        let headerCon = document.getElementById('header-navbar-main-con-id')
        headerCon.style.backgroundColor = 'transparent'
        pizzaIcon.style.width = '22px'
        homeLabel.style.backgroundColor = '#b1b1b161'
        break
    case '/keyboardApp/shop':
        let shopLabel = document.getElementById('navbar-shop-label-id')
        shopLabel.style.backgroundColor = '#b1b1b161'
        break
    case '/keyboardApp/about':
        let AboutLabel = document.getElementById('navbar-aboutus-label-id')
        AboutLabel.style.backgroundColor = '#b1b1b161'
        break
    default:
        break
}

dialogLoginBtnEle.onclick = () => {
    window.location.href = '/keyboardApp/login'
}

dialogSignupBtnEle.onclick = () => {
    window.location.href = '/keyboardApp/signup'
}

/**
 * This function make sure that when ever the dialog opened, user can just clicked anything outside the dialog to close it back,
 * But behind the scene the function has to make sure eventListener only triggered when it not equal to the element that triggered the eventListener and itself.
 * so the solution, we have to put a transparent box hover on the btn triggered dialog to avoid clicked again. to response to the triggered validation.
 *
 *  * Triggered Validation: the element you clicked must not equal `triggered-source` and inside of `dialog-itself`
 *
 *  NOTE: Because normally if we not strictly validate trigger to not triggered if user clicked on source
 * because it will just cause the whole loop which cause nothing to happen.
 *
 */
const handleToggleMenu = () => {
    console.log('THIS HAS BEEN TRIGGERED')
    let menuEle = document.getElementById('header-dialog-main-con-id')
    let menuHoverBoard = document.getElementById(
        'header-menu-icon-hoverboard-id'
    )
    let menuChildEle = document.querySelectorAll(
        '.header-navbar-custom-burger-icon-element'
    )
    console.log(menuChildEle[0].className)
    let pizzaIcon = document.getElementById('pizza-icon-id')
    menuHoverBoard.style.display = 'block' // Open up the block on main source
    menuEle.classList.add('open-menu-dialog') // Open dialog
    document.addEventListener('click', function handleCheckTarget(e) {
        if (
            !menuEle.contains(e.target) &&
            e.target !== pizzaIcon &&
            e.target.className != 'header-navbar-custom-burger-icon-element'
        ) {
            // Check to make sure it not source and inside dialog
            console.log('The the element u clicked is not contained in dialog')
            menuEle.classList.remove('open-menu-dialog')
            menuHoverBoard.style.display = 'none' // At this point since it triggered user clicked outside we disable the hoverboard
            this.removeEventListener('click', handleCheckTarget)
        }
    })
}

const handleQueryData = async () => {
    let userNicknameTextEle = document.getElementById('usernickname-text-id')
    let userDialogNicknameTextELe = document.getElementById(
        'dialog-usernickname-text-id'
    )
    let userDialogUsernameTextEle = document.getElementById(
        'dialog-username-text-id'
    )
    let userDialogBalanceTextEle = document.getElementById(
        'dialog-balance-text-id'
    )
    try {
        console.log('ABOUT TO START')
        const resp = await fetch(
            'http://127.0.0.1:8000/api/keyboardApp/auth/validation',
            {
                method: 'GET',
                credentials: 'same-origin',
            }
        )
        if (resp.status !== 200) {
            throw new Error('failed to validate the user')
        }

        const userBalanceResp = await fetch(
            'http://127.0.0.1:8000/api/keyboardApp/retrieve-user-balance'
        )
        let userBalance
        if (userBalanceResp.ok && userBalanceResp.status === 200) {
            userBalance = await userBalanceResp.json()
        }

        userData = await resp.json()

        userNicknameTextEle.innerText = userData.Data.user_nickname
        userDialogNicknameTextELe.innerText = userData.Data.user_nickname
        userDialogBalanceTextEle.innerText = userBalance.item_data[0] + ' $'
        userDialogUsernameTextEle.innerText = userData.Data.user_name
        logoutBtnEle.style.display = 'flex'
        loginBtnEle.style.display = 'none'
        signupBtnEle.style.display = 'none'
        dialogLogoutBtnEle.style.display = 'flex'
        dialogLoginBtnEle.style.display = 'none'
        dialogSignupBtnEle.style.display = 'none'
        return userData.Data
    } catch (err) {
        console.log('IT ERROR')
        // alert('Please login to use locked feature')
        console.log(err)
        loginBtnEle.style.display = 'flex'
        signupBtnEle.style.display = 'flex'
        logoutBtnEle.style.display = 'none'
        dialogLoginBtnEle.style.display = 'flex'
        dialogSignupBtnEle.style.display = 'flex'
        dialogLogoutBtnEle.style.display = 'none'
        return
    }
}
handleQueryData()

const handleLogout = async () => {
    try {
        let logoutResp = await fetch(
            'http://127.0.0.1:8000/api/keyboardApp/auth/logout',
            { credentials: 'same-origin' }
        )
        alert('log out successfully')
        window.location.href = '/keyboardApp/home'
    } catch (err) {
        console.log(err)
        alert('Failed to log out, Please try again')
    }
}

const handleRoute = async (route) => {
    if (route === 'history') {
        try {
            let fetchUserResp = await fetch(
                'http://127.0.0.1:8000/api/keyboardApp/auth/validation'
            )
            if (!fetchUserResp.ok || fetchUserResp.status !== 200) {
                throw new Error(
                    'Unable to open the page, Please login to use this feature'
                )
            }
        } catch (e) {
            alert('Unable to open the page, Please login to use this feature')
            return
        }
    }
    let prepRoute = './' + route
    console.log('Route triggered')
    window.location.href = prepRoute
}
