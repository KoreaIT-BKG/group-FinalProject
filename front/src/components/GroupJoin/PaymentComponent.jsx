import React from 'react';


const PaymentComponent = () => {
    const go = () => {
        window.location.href="/GroupJoin"
        alert("신청완료")
    }

    return (
        <div>
            <button onClick={()=>go()}>결제하기</button>
        </div>
    );
};

export default PaymentComponent;