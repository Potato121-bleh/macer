let checkoutInfoDetail = []
let checkoutTransactionDetial = []
let cartArr = [] // [1, 30]  [2, 35]
let cartRenderArr = []
let userNicknameTextEle = document.getElementById('usernickname-text-id')
let loginBtnEle = document.getElementById('login-btn-id')
let signupBtnEle = document.getElementById('signup-btn-id')
let logoutBtnEle = document.getElementById('logout-btn-id')
let queryParameter = new URLSearchParams(window.location.search)

const getCSRFToken = () => {
    return document.querySelector('[name=csrfmiddlewaretoken]').value
}

// toggle checkout dialog
const toggleCheckoutDialog = (flag) => {
    // open the dialog
    let checkoutDialogEle = document.getElementById(
        'checkout-dialog-main-con-id'
    )
    if (flag) {
        checkoutDialogEle.style.display = 'flex'
        checkoutDialogEle.addEventListener('click', function closeDialog(e) {
            console.log(e.target)
            console.log(e.currentTarget)
            if (e.target === e.currentTarget) {
                let infoWrapperEle = document.getElementById(
                    'checkout-dialog-your-info-wrapper-id'
                )
                let cartWrapperEle = document.getElementById(
                    'checkout-dialog-cart-content-id'
                )
                checkoutDialogEle.style.display = 'none'
                infoWrapperEle.innerHTML = ''
                cartWrapperEle.innerHTML = ''
                checkoutInfoDetail = []
                checkoutTransactionDetial = []
                cartRenderArr = []
                this.removeEventListener('click', closeDialog)
            }
        })
    } else {
        checkoutDialogEle.style.display = 'none'
    }
}

const assignDynamicData = (userInfo) => {
    let itemPrice = 0
    let discountVal = 0
    for (let i in cartArr) {
        itemPrice += cartArr[i][1]
    }
    let totalBillUSD = itemPrice - discountVal
    let totalBillKHR = totalBillUSD * 4050
    checkoutInfoDetail.push(['Name:', userInfo.user_nickname])
    checkoutInfoDetail.push([
        'Current Balance:',
        userInfo.user_balance + ' USD',
    ])

    checkoutTransactionDetial.push(['Payer:', userInfo.user_nickname])
    checkoutTransactionDetial.push(['Total Item:', cartArr.length])
    checkoutTransactionDetial.push(['Price:', itemPrice])
    checkoutTransactionDetial.push(['Discount:', `${discountVal}` + ' USD'])
    checkoutTransactionDetial.push(['Total Price:', `${totalBillUSD}` + ' USD'])
    checkoutTransactionDetial.push(['', `${totalBillKHR}` + ' KHR'])
}

// When we click on add to cart on card
const handleAddtoCart = (id, price) => {
    let cartCounterEle = document.getElementById('cart-counter-id')
    let prepData = [id, price]
    cartArr.push(prepData)
    cartCounterEle.innerText = cartArr.length
}

//logo-img-con-id
//   <img class="brand-img" src="{% static 'img/brand.webp' %}" alt="" />

const handleItemData = async (brand) => {
    console.log('it trigger item_data')
    console.log(brand)
    if (!brand) {
        brand = 'alpha'
    }
    let mainBoxContainerEle = document.getElementById('main-box-id')
    let brandImgContainerEle = document.getElementById('logo-img-con-id')
    try {
        const itemDataResp = await fetch(
            'http://127.0.0.1:8000/api/keyboardApp/retrieve_item_with_brand',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify({
                    brandName: brand,
                }),
            }
        )
        queriedData = await itemDataResp.json()
        //console.log(dynamicBoxHTMLEle)

        brandImgContainerEle.innerHTML = `<img class="brand-img" src="${
            staticImg + 'companylogo/' + brand + 'Logo.png'
        }" alt="${brand + 'Logo.png'}" />`

        console.log(queriedData.item_data.length)
        if (!queriedData.item_data.length) {
            mainBoxContainerEle.innerHTML =
                '<h1 style="margin-top: 20px" >No Keyboard Instock<h1/>'
            return
        }

        let dynamicBoxHTMLEle = queriedData.item_data
            .map(
                (element) => `
                      <li class="box">
                          <div class="shape-in-Grid">
                            <img
                                class="keyboard-pic"
                                src="${
                                    staticImg +
                                    'keyboardImg/' +
                                    ('keyboard' + element.item_id)
                                }.png"
                                alt=""
                            />
                          </div>
                          <div class="detail-container">
                            <h2 class="series-one-x-kuromi">${
                                element.item_name
                            }</h2>
                            <p class="long-ph">
                                ${element.item_description}
                            </p>
                            <div class="price-head">
                                <div class="detail-price">
                                    <p class="price">Price:</p>
                                    <p class="price-dollars">${
                                        element.item_price
                                    }$</p>
                                </div>
                                <div class="detail-color">
                                    <p class="rgb-color">Color:</p>
                                    <p class="rgb">${element.item_key_color}</p>
                                </div>
                            </div>
                            
                            <ul class="detail-bottom-section" style="list-style: none" >
                                <li class="brand-logo">
                                    <img src="${
                                        staticImg +
                                        'companylogo/' +
                                        brand +
                                        'Logo.png'
                                    }" alt="${brand + 'Logo.png'}" />
                                </li>
                                <li class="icon-connection">
                                    <div class="icon-one">
                                        <img
                                            class="icon-bluetooth"
                                            src="${staticImg + 'bluetooth.png'}"
                                            alt=""
                                        />
                                    </div>
                                    <div class="icon-two">
                                        <img
                                            class="icon-usb"
                                            src="${staticImg + 'usb.png'}"
                                            alt=""
                                        />
                                    </div>
                                </li>
                                <li class="btn-addcart">
                                    <button class="add-cart" onclick="handleAddtoCart(${
                                        element.item_id
                                    }, ${
                    element.item_price
                })" >Add To Cart</button>
                                </li>
                            <ul/>
                          </div>
                      </li>
                    `
            )
            .join('')
        mainBoxContainerEle.innerHTML = dynamicBoxHTMLEle
    } catch (err) {
        console.log(err)
    }
}
handleItemData('alpha')

const handleQueryData = async () => {
    let userNicknameTextEle = document.getElementById('usernickname-text-id')
    try {
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

        userData = await resp.json()

        userNicknameTextEle.innerText = userData.Data.user_nickname
        logoutBtnEle.style.display = 'flex'
        loginBtnEle.style.display = 'none'
        signupBtnEle.style.display = 'none'
        return userData.Data
    } catch (err) {
        alert('Please login to use locked feature')
        console.log(err)
        loginBtnEle.style.display = 'flex'
        signupBtnEle.style.display = 'flex'
        logoutBtnEle.style.display = 'none'
        return
    }
}
handleQueryData()

// This function trigger when user click on cart
const handleCartCheckout = async () => {
    console.log('IT CLICK')
    try {
        userInfo = await handleQueryData()
        const itemDataResp = await fetch(
            'http://127.0.0.1:8000/api/keyboardApp/retrieve_item_with_brand',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify({
                    brandName: 'alpha',
                }),
            }
        )
        queriedData = await itemDataResp.json()
        for (let i = 0; i < cartArr.length; i++) {
            for (let j = 0; j < queriedData.item_data.length; j++) {
                if (cartArr[i][0] == queriedData.item_data[j].item_id) {
                    cartRenderArr.push([
                        queriedData.item_data[j].item_name,
                        queriedData.item_data[j].item_price,
                    ])
                    break
                }
            }
        }
    } catch (err) {
        alert('Something weng wrong, Please try again')
        console.log(err)
        return
    }

    let cartInfoEle = document.getElementById('checkout-dialog-cart-content-id')
    let dynamicCartInfo = cartRenderArr
        .map(
            (element) => `<ul class="checkout-dialog-cart-element" >
                            <li>${element[0]}</li>
                            <li>${element[1]}</li>
                        </ul>`
        )
        .join('')
    cartInfoEle.innerHTML = dynamicCartInfo

    assignDynamicData(userInfo)

    let transactionInfoEle = document.getElementById(
        'checkout-dialog-transaction-wrapper-id'
    )
    let yourInfoEle = document.getElementById(
        'checkout-dialog-your-info-wrapper-id'
    )

    let dynamicInfoEle = checkoutInfoDetail
        .map(
            (element) => `<ul class="checkout-dialog-info">
                                <li>
                                    <p>${element[0]}</p>
                                </li>
                                <li>
                                    <p>${element[1]}</p>
                                </li>
                            </ul>`
        )
        .join('')

    let dynamicTransactionEle = checkoutTransactionDetial
        .map(
            (element) => `<ul class="checkout-dialog-info">
                                <li>
                                    <p>${element[0]}</p>
                                </li>
                                <li>
                                    <p>${element[1]}</p>
                                </li>
                            </ul>`
        )
        .join('')

    yourInfoEle.innerHTML = dynamicInfoEle
    transactionInfoEle.innerHTML = dynamicTransactionEle
    toggleCheckoutDialog(true)
}

const handleLogout = async () => {
    try {
        let logoutResp = await fetch(
            'http://127.0.0.1:8000/api/keyboardApp/auth/logout',
            { credentials: 'same-origin' }
        )
        alert('log out successfully')
    } catch (err) {
        alert('Failed to log out, Please try again')
        console.log(err)
    }
}

const handleTransaction = async () => {
    try {
        console.log("HERE I'M ABOUT TO SEND TO TRANSACTION")
        console.log(cartArr)
        let transactionResp = await fetch(
            'http://127.0.0.1:8000/api/keyboardApp/perform-transaction',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify({
                    item_data: cartArr,
                }),
                credentials: 'same-origin',
            }
        )
        let data = await transactionResp.json()
        if (transactionResp.status != 200) {
            console.log(data.Error_Message)
            throw new Error(data.Error_Message)
        }

        alert('Transaction complete')
    } catch (err) {
        alert(
            'Transaction failed, Make sure your balance is met the requirement'
        )
        console.log(err)
    }
}

const renderItemAdapter = (brand) => {
    console.log(brand)
}
