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
    const [message, setMessage] = useState(false)
    useEffect(() => {
        setMessage("Đang xử lý")
        let orderData =  JSON.parse(localStorage.getItem("orderData"))
        if(orderData){
            orderData.paymentId = query.get("paymentId")
            orderData.token = query.get("token")
            orderData.PayerID = query.get("PayerID")
            createNewOrder(orderData)
            setMessage("Chúc mừng bạn đã mua lượt đăng bài thành công")
        }
        else {
            setMessage("Thông tin đơn hàng không hợp lệ")
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
    }
    return (

        <div style={{height:'50vh',textAlign:'center'}}> 
           {message}
        </div>

    );
}

export default PaymentSuccess;
