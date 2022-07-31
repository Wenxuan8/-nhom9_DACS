import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {paymentOrderSuccessService} from '../../../service/userService'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useParams,
    useLocation
} from "react-router-dom";


function useQuery() {
    const { search } = useLocation();
    
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

function PaymentSuccess(props) {
    let query = useQuery();
    const {isDone, setIsDone} = useState(false)
    useEffect(() => {
        let orderData =  JSON.parse(localStorage.getItem("orderData"))
        if(orderData){
            orderData.paymentId = query.get("paymentId")
            orderData.token = query.get("token")
            orderData.PayerID = query.get("PayerID")
            createNewOrder(orderData)
        }
    }, [])
    let createNewOrder = async (data) =>{
        let res = await paymentOrderSuccessService(data)
        if(res && res.errCode == 0){
            toast.success(res.errMessage)
            localStorage.removeItem("orderData")
        }else{
            toast.error(res.errMessage)
        }
        console.log("Hello")
        setIsDone(true)
    }
    return (

        <div style={{height:'50vh',textAlign:'center'}}> 
            {isDone ? 'Bạn đã mua thành công' : 'Đang chờ xử lý'}
        </div>

    );
}

export default PaymentSuccess;
