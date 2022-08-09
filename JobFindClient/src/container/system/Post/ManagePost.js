import React from 'react'
import { useEffect, useState } from 'react';
import { banPostService, getAllPostByAdminService, activePostService, getAllPostByRoleAdminService, acceptPostService } from '../../../service/userService';
import moment from 'moment';
import { PAGINATION } from '../../../util/constant';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ManagePost = () => {
    const [dataPost, setdataPost] = useState([])
    const [count, setCount] = useState('')
    const [numberPage, setnumberPage] = useState('')
    const [user, setUser] = useState({})
    useEffect(() => {
        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (userData) {
                let fetchData = async () => {
                    let arrData = []
                    if (userData.roleCode == 'ADMIN') {
                        arrData = await getAllPostByRoleAdminService({
                            limit: PAGINATION.pagerow,
                            offset: 0,
                        })
                    }
                    else {
                        arrData = await getAllPostByAdminService({
                            limit: PAGINATION.pagerow,
                            offset: 0,
                            companyId: userData.companyId
                        })
                    }
                    if (arrData && arrData.errCode === 0) {
                        setdataPost(arrData.data)
                        setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
                    }
                }
                fetchData();
                setUser(userData)
            }

        } catch (error) {
            console.log(error)
        }

    }, [])

    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
        let arrData = []
        if (user.roleCode == 'ADMIN') {
            arrData = await getAllPostByRoleAdminService({
                limit: PAGINATION.pagerow,
                offset: number.selected * PAGINATION.pagerow,
            })
        }
        else {
            arrData = await getAllPostByAdminService({
                limit: PAGINATION.pagerow,
                offset: number.selected * PAGINATION.pagerow,
                companyId: user.companyId
            })
        }
        if (arrData && arrData.errCode === 0) {
            setdataPost(arrData.data)
        }
    }
    let handleBanPost = async (id) => {
        let res = await banPostService(id)
        if (res && res.errCode === 0) {
            let arrData = []
            if (user.roleCode == 'ADMIN') {
                arrData = await getAllPostByRoleAdminService({
                    limit: PAGINATION.pagerow,
                    offset: numberPage * PAGINATION.pagerow,
                })
            }
            else {
                arrData = await getAllPostByAdminService({
                    limit: PAGINATION.pagerow,
                    offset: numberPage * PAGINATION.pagerow,
                    companyId: user.companyId
                })
            }
            if (arrData && arrData.errCode === 0) {
                setdataPost(arrData.data)
            }
            toast.success(res.errMessage)
        } else {
            toast.error(res.errMessage)
        }
    }
    let handleActivePost = async (id) => {
        let res = await activePostService({
            id: id
        })
        if (res && res.errCode === 0) {
            let arrData = []
            if (user.roleCode == 'ADMIN') {
                arrData = await getAllPostByRoleAdminService({
                    limit: PAGINATION.pagerow,
                    offset: numberPage * PAGINATION.pagerow,
                })
            }
            else {
                arrData = await getAllPostByAdminService({
                    limit: PAGINATION.pagerow,
                    offset: numberPage * PAGINATION.pagerow,
                    companyId: user.companyId
                })
            }
            if (arrData && arrData.errCode === 0) {
                setdataPost(arrData.data)
            }
            toast.success(res.errMessage)
        } else {
            toast.error(res.errMessage)
        }
    }
    let handleAccecptPost = async (id,statusCode) => {
        let res = await acceptPostService({
            id: id,
            statusCode: statusCode
        })
        if (res && res.errCode === 0) {
            let arrData = []
            if (user.roleCode == 'ADMIN') {
                arrData = await getAllPostByRoleAdminService({
                    limit: PAGINATION.pagerow,
                    offset: numberPage * PAGINATION.pagerow,
                })
            }
            else {
                arrData = await getAllPostByAdminService({
                    limit: PAGINATION.pagerow,
                    offset: numberPage * PAGINATION.pagerow,
                    companyId: user.companyId
                })
            }
            if (arrData && arrData.errCode === 0) {
                setdataPost(arrData.data)
            }
            toast.success(res.errMessage)
        } else {
            toast.error(res.errMessage)
        }
    }
    return (
        <div>
            <div className="col-12 grid-margin">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Danh sách bài đăng</h4>

                        <div className="table-responsive pt-2">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>
                                            STT
                                        </th>
                                        <th>
                                            Tên bài đăng
                                        </th>
                                        <th>
                                            Ngành
                                        </th>
                                        <th>
                                            Chức vụ
                                        </th>
                                        <th>
                                            Hình thức làm việc
                                        </th>
                                        <th>
                                            Ngày kết thúc
                                        </th>
                                        <th>
                                            Trạng thái
                                        </th>
                                        <th>
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataPost && dataPost.length > 0 &&
                                        dataPost.map((item, index) => {
                                            let date = moment.unix(item.timeEnd / 1000).format('DD/MM/YYYY')
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1 + numberPage * PAGINATION.pagerow}</td>
                                                    <td>{item.postDetailData.name}</td>
                                                    <td>{item.postDetailData.jobTypePostData.value}</td>
                                                    <td>{item.postDetailData.jobLevelPostData.value}</td>
                                                    <td>{item.postDetailData.workTypePostData.value}</td>
                                                    <td>{date}</td>
                                                    <td>{item.statusPostData.value}</td>
                                                    <td>
                                                        {(user.roleCode == 'COMPANY' || user.roleCode == 'EMPLOYER') &&
                                                            <>
                                                                <Link style={{ color: '#4B49AC' }} to={`/admin/list-cv/${item.id}/`}>Xem CV nộp</Link>
                                                                &nbsp; &nbsp;
                                                            </>
                                                        }
                                                        <Link style={{ color: '#4B49AC' }} to={`/admin/edit-post/${item.id}/`}>Sửa</Link>
                                                        &nbsp; &nbsp;
                                                        {user.roleCode == 'ADMIN' ? (item.statusCode == 'PS1' ? <>
                                                            <a style={{ color: '#4B49AC', cursor: 'pointer' }} onClick={() => handleBanPost(item.id)}  >Chặn</a>
                                                            &nbsp; &nbsp;
                                                        </>
                                                            : item.statusCode == 'PS4' ? <>
                                                                <a style={{ color: '#4B49AC', cursor: 'pointer' }} onClick={() => handleActivePost(item.id)}  >Mở lại</a>
                                                            </> :  <>
                                                                <a style={{ color: '#4B49AC', cursor: 'pointer' }} onClick={() => handleAccecptPost(item.id,'PS1')}  >Duyệt</a>
                                                                <a style={{ color: '#4B49AC', cursor: 'pointer', marginLeft:'10px' }} onClick={() => handleAccecptPost(item.id,'PS2')}  >Từ chối</a>
                                                            </> ) : <></>
                                                        }


                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }

                                </tbody>
                            </table>
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

        </div>
    )
}

export default ManagePost
