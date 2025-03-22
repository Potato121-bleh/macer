// api: "http://127.0.0.1:8000/api/keyboardApp/retrieve-transaction"

const getCSRFToken = () => {
    return document.querySelector('[name=csrfmiddlewaretoken]').value
}

const handleSubmitReview = async (itemId, transactionCounter) => {
    let selectedUserId = 0
    let selectedEleId = `select_review_rate-id-${transactionCounter}`
    let selectedRate = document.getElementById(selectedEleId)
    let selectedRateTem = selectedRate?.value
    let userReview = window.prompt('Write your Review here', 'N/A')

    try {
        let fetchUserResp = await fetch(
            'http://127.0.0.1:8000/api/keyboardApp/auth/validation'
        )
        if (fetchUserResp.ok && fetchUserResp.status === 200) {
            let respData = await fetchUserResp.json()
            console.log(respData)
            selectedUserId = respData.Data['user_id']
        }

        console.log(selectedUserId)
        console.log(selectedRateTem)

        let submitReview = await fetch(
            'http://127.0.0.1:8000/api/keyboardApp/submit_review',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify({
                    userId: selectedUserId,
                    storeItemId: itemId,
                    rating: selectedRateTem,
                    reviewText: userReview,
                }),
            }
        )
        if (submitReview.ok && submitReview.status === 200) {
            let respMessage = await submitReview.json()
            alert(respMessage['Message'])
        }
    } catch (e) {
        alert('failed to submit review, Please check the console for Error')
        console.log(e)
    }
}

const renderHistory = async () => {
    let historyCon = document.getElementById('history-container-id')
    let queriedTransaction
    try {
        let userTransactionResp = await fetch(
            'http://127.0.0.1:8000/api/keyboardApp/retrieve-transaction'
        )
        if (userTransactionResp.ok && userTransactionResp.status === 200) {
            let data = await userTransactionResp.json()
            queriedTransaction = data.item_data
        }
    } catch (e) {
        alert('failed to retrieve user history transaction')
        console.log(e)
        return
    }
    let transactionCounter = 0
    let dynamicTransactionRender = queriedTransaction
        .map((element) => {
            transactionCounter++
            return `<li class="history-box">
                    <ul class="ul-one">
                        <li class="keyboard-name-one-main">
                            <h4 class="keyboard-name-one-con">
                                ${element.item.item_name}
                            </h4>
                        </li>
                        <li class="date-of-buy-main">
                            <p class="date-of-buy-con">${element.transaction_date}</p>
                        </li>
                    </ul>
                    <div class="below-keyboard-name">
                        <div class="price-element-one">
                            <ul class="ul-two">
                                <li class="price-li">
                                    <p class="price-text">Price:</p>
                                </li>
                                <li class="dollar-number">
                                    <p class="dollar">${element.item.item_price}$</p>
                                </li>
                            </ul>
                        </div>
                        <ul class="ul-three">
                        <li class="rating-text" >Rate Us</li>
                            <li class="select-li">
                                <select
                                    class="select-items"
                                    id="select_review_rate-id-${transactionCounter}"
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </li>
                            <li class="submit-li">
                                <button
                                    class="btn-submit"
                                    onclick="
                                    handleSubmitReview(${element.item.item_id}, ${transactionCounter})"
                                    style="cursor: pointer"
                                >
                                    Submit
                                </button>
                            </li>
                        </ul>
                    </div>
                </li>`
        })
        .join('')
    historyCon.innerHTML = dynamicTransactionRender
}
renderHistory()

{
    /* <div class="history-box">
                    <ul class="ul-one">
                        <li class="keyboard-name-one-main">
                            <h4 class="keyboard-name-one-con">
                                Keyboard name 1
                            </h4>
                        </li>
                        <li class="date-of-buy-main">
                            <p class="date-of-buy-con">20/12/2025</p>
                        </li>
                    </ul>
                    <div class="below-keyboard-name">
                        <div class="price-element-one">
                            <ul class="ul-two">
                                <li class="price-li">
                                    <p class="price-text">Price:</p>
                                </li>
                                <li class="dollar-number">
                                    <p class="dollar">35$</p>
                                </li>
                            </ul>
                        </div>
                        <ul class="ul-three">
                            <li class="select-li">
                                <select
                                    class="select-items"
                                    id="select_review_rate-id"
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </li>
                            <li class="submit-li">
                                <button
                                    class="btn-submit"
                                    onclick="handleSubmitReview()"
                                    style="cursor: pointer"
                                >
                                    Submit
                                </button>
                            </li>
                        </ul>
                    </div>
                </div> */
}

// #  jwtPayload = {
//     #             "user_id": queried_user.user_id,
//     #             "user_name": queried_user.user_name,
//     #             "user_nickname": queried_user.user_nickname,
//     #             "user_balance": float(queried_user.user_balance),
//     #             "exp": (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)).timestamp()
//     #         }
