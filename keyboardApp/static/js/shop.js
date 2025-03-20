let checkoutInfoDetail = []
let checkoutTransactionDetial = []
let cartArr = [] // [1, 30]  [2, 35]
let cartRenderArr = []
let queryParameter = new URLSearchParams(window.location.search)
let item_price = 0

const getCSRFToken = () => {
    return document.querySelector('[name=csrfmiddlewaretoken]').value
}

// toggle checkout dialog
const toggleCheckoutDialog = (flag) => {
    // open the dialog
    let checkoutDialogEle = document.getElementById(
        'checkout-dialog-main-con-id'
    )
    let cartIconHover = document.getElementById('cart-hover-con-id')
    if (flag) {
        checkoutDialogEle.style.display = 'flex'
        cartIconHover.style.display = 'block'

        checkoutDialogEle.addEventListener('click', function closeDialog(e) {
            console.log(e.target) // current target we clicked on rn
            console.log(e.currentTarget) // the current target we attach to

            if (e.target === e.currentTarget) {
                let infoWrapperEle = document.getElementById(
                    'checkout-dialog-your-info-wrapper-id'
                )
                let cartWrapperEle = document.getElementById(
                    'checkout-dialog-cart-content-id'
                )
                checkoutDialogEle.style.display = 'none'
                cartIconHover.style.display = 'none'
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
        cartIconHover.style.display = 'none'
    }
}

// we make them accept discout value
const assignDynamicData = async (userInfo, discountVal, userBalance) => {
    let itemPrice = 0
    for (let i in cartArr) {
        itemPrice += cartArr[i][1]
    }

    // try {

    // }

    let discountAmount = itemPrice * (discountVal / 100)
    let totalBillUSD = itemPrice - discountAmount
    let totalBillKHR = totalBillUSD * 4050
    item_price = totalBillUSD
    checkoutInfoDetail.push(['Name:', userInfo.user_nickname])
    checkoutInfoDetail.push(['Current Balance:', userBalance + ' USD'])

    checkoutTransactionDetial.push(['Payer:', userInfo.user_nickname])
    checkoutTransactionDetial.push(['Total Item:', cartArr.length])
    checkoutTransactionDetial.push(['Price:', itemPrice])
    checkoutTransactionDetial.push(['Discount:', `${discountAmount}` + ' USD'])
    checkoutTransactionDetial.push(['Total Price:', `${totalBillUSD}` + ' USD'])
    checkoutTransactionDetial.push(['', `${totalBillKHR}` + ' KHR'])
}

// When we click on add to cart on card
const handleAddtoCart = (id, price) => {
    console.log('it triggered add to cart')
    console.log(id)
    console.log(price)
    let cartCounterEle = document.getElementById('cart-counter-id')
    let prepData = [id, price]
    cartArr.push(prepData)
    console.log(cartArr.length)
    cartCounterEle.innerText = cartArr.length
}

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

                <li class="box" id="${'box-id' + element.item_id}">
                        <div class="box-sub-con" id="${
                            'sub-box-id' + element.item_id
                        }">
                            <ul class="box-left-con">
                                <div class="shape-in-Grid">
                                    <img
                                        class="keyboard-pic"
                                        src="${
                                            staticImg +
                                            'keyboardImg/' +
                                            ('keyboard' + element.item_id)
                                        }.png"
                                        alt="${brand + 'img'}"
                                    />
                                </div>
                                <div class="detail-container">
                                    <h2 class="series-one-x-kuromi">
                                        ${element.item_name}
                                    </h2>
                                    <p class="long-ph">${
                                        element.item_description
                                    }</p>
                                    <div class="price-head">
                                        <div class="detail-price">
                                            <p class="price">Price:</p>
                                            <p class="price-dollars">
                                            ${element.item_price}$
                                            </p>
                                        </div>
                                        <div class="detail-color">
                                            <p class="rgb-color">Color:</p>
                                            <p class="rgb">${
                                                element.item_key_color
                                            }</p>
                                        </div>
                                    </div>

                                    <ul
                                        class="detail-bottom-section"
                                        style="list-style: none"
                                    >
                                        <li>
                                            <button
                                                class="detail-bottom-btn"
                                                onclick="handleDetailSwitchAnimate(${
                                                    element.item_id
                                                }, true)"
                                            >
                                                More Details
                                            </button>
                                        </li>
                                        <li>
                                            <button class="detail-bottom-btn" 
                                            onclick="handleAddtoCart(${
                                                element.item_id
                                            }, ${element.item_price})">
                                                Add to cart
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </ul>

                            <ul class="box-right-con">
                                <li class="box-right-title">
                                    ${element.item_name}
                                </li>
                                <ul class="box-right-description">
                                    <li>5-Pin Hot-swappable</li>
                                    <li>RGB Backlit</li>
                                    <li>
                                        Gaming Socket with up to 2000 Cycles
                                    </li>
                                </ul>
                                <li class="box-right-price">${
                                    element.item_price
                                }$</li>
                                <li class="box-right-color">
                                    Color:
                                    <span class="box-right-span"
                                        >${element.item_key_color}</span
                                    >
                                </li>
                                <li class="box-right-availability">
                                    Availability:
                                    <span class="box-right-availability-span">
                                        In Stock
                                    </span>
                                </li>
                                <li class="box-right-brand">
                                    <span class="box-right-span">${brand}</span>
                                    <span class="box-right-span">Keyboard</span>
                                </li>
                                <button
                                    class="box-right-back-btn"
                                    onclick="handleDetailSwitchAnimate(${
                                        element.item_id
                                    }, false)"
                                >
                                    Back
                                </button>
                            </ul>
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

// This function trigger when user click on cart
const handleCartCheckout = async () => {
    console.log('IT CLICK ON CART')
    let discountVal = 0

    // we add alert asking user the discount code
    // then we can assign discount values as we queried from database if not found we reject.
    // if it has then we retireve the values and calculate and assign them into
    // let discountFlag = alert('Any discount coupon? Please insert code below')

    let userDiscountInput = window.prompt('Type here')
    if (userDiscountInput !== '') {
        try {
            let queriedResp = await fetch(
                'http://127.0.0.1:8000/api/keyboardApp/retrieve-discount-code',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCSRFToken(),
                    },
                    body: JSON.stringify({ discountCode: userDiscountInput }),
                    credentials: 'same-origin',
                }
            )
            if (queriedResp.ok && queriedResp.status === 200) {
                let data = await queriedResp.json()
                console.log(data)
                discountVal = data.item_data.discount_percentage
            }
        } catch (e) {
            console.log(e)
        }
        // query discount code for validation then fetch their value
    }

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
        console.log('Cart here:')
        console.log(cartArr)
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

    // query user balance
    try {
        let queryBalance = await fetch(
            'http://127.0.0.1:8000/api/keyboardApp/retrieve-user-balance',
            {
                method: 'GET',
            }
        )
        let userBalance = await queryBalance.json()
        console.log(userBalance.item_data[0])
        assignDynamicData(userInfo, discountVal, userBalance.item_data[0])
    } catch (e) {
        window.alert('failed to query user balance')
        console.log(e)
    }

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
                    item_price: item_price,
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
        window.location.reload()
    } catch (err) {
        alert(
            'Transaction failed, Make sure your balance is met the requirement'
        )
        console.log(err)
    }
}

const handleDetailSwitchAnimate = (id, slideFlag) => {
    let subBoxEleScript = 'sub-box-id' + id
    let boxEleScript = 'box-id' + id
    console.log(subBoxEleScript)
    let subBoxEle = document.getElementById(subBoxEleScript)
    let boxEle = document.getElementById(boxEleScript)
    let allBoxEle = document.querySelectorAll('.box')
    let allSubBoxEle = document.querySelectorAll('.box-sub-con')
    console.log(subBoxEle)
    //toggle-scale-card-detail

    allBoxEle.forEach((element) => {
        element.classList.remove('toggle-scale-card-detail')
    })
    allSubBoxEle.forEach((element) => {
        element.classList.remove('toggle-slide-card-detail')
    })

    if (slideFlag) {
        boxEle.classList.add('toggle-scale-card-detail')
        subBoxEle.classList.add('toggle-slide-card-detail')
    } else {
        subBoxEle.classList.remove('toggle-slide-card-detail')
        boxEle.classList.remove('toggle-scale-card-detail')
    }
}

// we can use this to get user info of your cookie
// try {
//     console.log('ABOUT TO START')
//     const resp = await fetch(
//         'http://127.0.0.1:8000/api/keyboardApp/auth/validation',
//         {
//             method: 'GET',
//             credentials: 'same-origin',
//         }
//     )
//     if (resp.status !== 200) {
//         throw new Error('failed to validate the user')
//     }

//     userData = await resp.json()
