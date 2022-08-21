import React from 'react'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getStatisticalTypePost, getStatisticalPackagePost } from '../../service/userService';
import { getStatisticalCv } from '../../service/cvService';
import { PAGINATION } from '../../util/constant';
import { PieChart } from 'react-minimal-pie-chart';
import ReactPaginate from 'react-paginate';
import moment from 'moment';
import { DatePicker } from 'antd';

const Home = () => {
    const { RangePicker } = DatePicker;
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const formattedToday = yyyy + '-' + mm + '-' + dd;
    const [user, setUser] = useState({})
    const [dataStatisticalTypePost, setDataStatisticalTypePost] = useState([])
    const [dataStatisticalPackagePost, setDataStatisticalPackagePost] = useState([])
    const [dataSum,setDataSum] = useState(0)
    const [dataCv, setDataCv] = useState([])
    const [count, setCount] = useState('')
    const [numberPage, setnumberPage] = useState('')
    let sendParams = {
        limit: PAGINATION.pagerow,
        offset: 0,
        fromDate: formattedToday,
        toDate: formattedToday,
        companyId: user.companyId
    }

    let onDatePicker = async (values) => {
        let fromDate = formattedToday
        let toDate = formattedToday
        if (values) {
            fromDate = values[0].format('YYYY-MM-DD')
            toDate = values[1].format('YYYY-MM-DD')
        }
        if (user.roleCode !== "ADMIN") {
            let arrData = await getStatisticalCv({
                ...sendParams,
                fromDate,
                toDate,
                offset: 0
            })
            if (arrData && arrData.errCode === 0) {
                setDataCv(arrData.data)
                setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
            }
        }
        else {
            let arrData = await getStatisticalPackagePost({
                fromDate,
                toDate,
                limit: PAGINATION.pagerow,
                offset: 0,
            })
            if (arrData && arrData.errCode === 0) {
                setDataStatisticalPackagePost(arrData.data)
                setDataSum(arrData.sum)
                setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
            }
        }
    }
    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
        if (user.roleCode !== "ADMIN") {
            let arrData = await getStatisticalCv({
                ...sendParams,
                limit: PAGINATION.pagerow,
                offset: number.selected * PAGINATION.pagerow
            })
            if (arrData && arrData.errCode === 0) {
                setDataCv(arrData.data)
            }
        }
        else {
            let arrData = await getStatisticalPackagePost({
                fromDate: formattedToday,
                toDate: formattedToday,
                limit: PAGINATION.pagerow,
                offset: number.selected * PAGINATION.pagerow
            })
            if (arrData && arrData.errCode === 0) {
                setDataStatisticalPackagePost(arrData.data)
                setDataSum(arrData.sum)

                setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
            }
        }
    }


    const getData = async (limit) => {
        let res = await getStatisticalTypePost(limit)
        let other = res.totalPost
        let otherPercent = 100
        let color = ['red', 'yellow', 'green', 'blue', 'orange']
        if (res.errCode === 0) {
            let newdata = res.data.map((item, index) => {
                other -= item.amount
                otherPercent -= Math.round((item.amount / res.totalPost * 100) * 100) / 100
                return {
                    title: item.postDetailData.jobTypePostData.value,
                    value: Math.round((item.amount / res.totalPost * 100) * 100) / 100,
                    color: color[index],
                    amount: item.amount
                }
            })
            if (other > 0) {
                newdata.push({ title: "Lĩnh vực khác", value: Math.round(otherPercent * 100) / 100, color: color[4], amount: other })
            }
            setDataStatisticalTypePost(newdata)
        }
        else toast.error(res.message)
    }
    useEffect(async () => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        setUser(userData)
        getData(4)
    }, [])

    useEffect(() => {
        try {
            let fetchData = async () => {
                const userData = JSON.parse(localStorage.getItem('userData'));
                if (userData.roleCode !== "ADMIN") {
                    let arrData = await getStatisticalCv({
                        ...sendParams,
                        companyId: userData.companyId
                    })
                    if (arrData && arrData.errCode === 0) {
                        setDataCv(arrData.data)
                        setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
                    }
                }
                else {
                    let arrData = await getStatisticalPackagePost({
                        fromDate: formattedToday,
                        toDate: formattedToday,
                        limit: PAGINATION.pagerow,
                        offset: 0,
                    })
                    if (arrData && arrData.errCode === 0) {
                        setDataStatisticalPackagePost(arrData.data)
                setDataSum(arrData.sum)

                        setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
                    }
                }
            }
            fetchData();
        } catch (error) {
            console.log(error)
        }

    }, [])
    return (
        <>
            <div className="row">
                <div className="col-md-12 grid-margin">
                    <div className="row">
                        <div className="col-12 col-xl-8 mb-4 mb-xl-0">
                            <h3 className="font-weight-bold">Xin chào {user.firstName + " " + user.lastName}</h3>
                            <h3 style={{ textTransform: "uppercase" }} className="font-weight-normal mb-0">Biểu đồ thống kê top lĩnh vực</h3>
                        </div>

                    </div>
                </div>
            </div>
            <div className='row'>
                <div className="col-md-4">
                    {

                        dataStatisticalTypePost.map((item, index) => {
                            return (

                                <div style={{ marginBottom: "10px" }}>
                                    <div style={{ width: "50px", backgroundColor: item.color, height: "20px" }}></div>
                                    <span>{item.title}: {item.amount} bài</span>
                                </div>

                            )
                        })
                    }
                </div>
                <div style={{ width: "300px", height: "300px" }} className="col-md-8">
                    <PieChart
                        label={({ x, y, dx, dy, dataEntry }) => (
                            <text
                                x={x - 5}
                                y={y}
                                dx={dx}
                                dy={dy}
                                dominant-baseline="central"
                                text-anchor="center"
                                style={{ fontSize: '4px' }}
                            >
                                {`${dataEntry.value}%`}

                            </text>
                        )}
                        data={dataStatisticalTypePost}

                    />;
                </div>
            </div>
            {
                user.companyId &&
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Bảng thông kê số lượng CV</h4>
                            <RangePicker onChange={onDatePicker}></RangePicker>
                            <div className="table-responsive pt-2">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>
                                                STT
                                            </th>
                                            <th>
                                                Tên bài viết
                                            </th>
                                            <th>
                                                Mã bài viết
                                            </th>
                                            <th>
                                                Người viết
                                            </th>
                                            <th>
                                                Số lượng CV
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataCv && dataCv.length > 0 &&
                                            dataCv.map((item, index) => {

                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1 + numberPage * PAGINATION.pagerow}</td>
                                                        <td>{item.postDetailData.name}</td>
                                                        <td>{item.postDetailData.id}</td>
                                                        <td>{item.userPostData.firstName + " " + item.userPostData.lastName}</td>
                                                        <td>{item.total}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                        {
                                            dataCv && dataCv.length == 0 && (
                                                <div style={{ textAlign: 'center' }}>

                                                    Không có dữ liệu

                                                </div>
                                            )
                                        }
                            </div>
                        </div>
                        <ReactPaginate
                            previousLabel={'Quay lại'}
                            nextLabel={'Tiếp'}
                            breakLabel={'...'}
                            pageCount={count}
                            marginPagesDisplayed={3}
                            containerClassName={"pagination justify-content-center pb-3"}
                            pageClassName={"page-item"}
                            pageLinkClassName={"page-link"}
                            previousLinkClassName={"page-link"}
                            previousClassName={"page-item"}
                            nextClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            breakLinkClassName={"page-link"}
                            breakClassName={"page-item"}
                            activeClassName={"active"}
                            onPageChange={handleChangePage}
                        />
                    </div>

                </div>
            }
            {
                user.roleCode === 'ADMIN' &&
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Bảng thống kê doanh thu các gói</h4>

                            <RangePicker onChange={onDatePicker}
                                format={'DD/MM/YYYY'}
                            ></RangePicker>


                            <div className="table-responsive pt-2">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>
                                                STT
                                            </th>
                                            <th>
                                                Tên gói
                                            </th>
                                            <th>
                                                Mã gói
                                            </th>
                                            <th>
                                                Loại gói
                                            </th>
                                            <th>
                                                Doanh thu
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataStatisticalPackagePost && dataStatisticalPackagePost.length > 0 &&
                                            dataStatisticalPackagePost.map((item, index) => {

                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1 + numberPage * PAGINATION.pagerow}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.id}</td>
                                                        <td>{item.isHot == 0 ? "Loại bình thường" : "Loại nổi bật"}</td>
                                                        <td style={{ textAlign: 'right' }}>{item.total} USD</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                        {
                                            dataStatisticalPackagePost && dataStatisticalPackagePost.length == 0 && (
                                                <div style={{ textAlign: 'center'}}>

                                                    Không có dữ liệu

                                                </div>
                                            )
                                        }
                            </div>
                        </div>
                        {
                        dataStatisticalPackagePost && dataStatisticalPackagePost.length > 0 &&
                        <div class='mr-4' style={{display:'flex', justifyContent:'end'}}>Tổng doanh thu: {dataSum} USD</div>
                        }
                        <ReactPaginate
                            previousLabel={'Quay lại'}
                            nextLabel={'Tiếp'}
                            breakLabel={'...'}
                            pageCount={count}
                            marginPagesDisplayed={3}
                            containerClassName={"pagination justify-content-center pb-3"}
                            pageClassName={"page-item"}
                            pageLinkClassName={"page-link"}
                            previousLinkClassName={"page-link"}
                            previousClassName={"page-item"}
                            nextClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            breakLinkClassName={"page-link"}
                            breakClassName={"page-item"}
                            activeClassName={"active"}
                            onPageChange={handleChangePage}
                        />
                    </div>

                </div>
            }
        </>
    )
}

export default Home
