import React from 'react'
import { useEffect, useState } from 'react';
import { banPostService, getAllPostByAdminService, activePostService, getAllPostByRoleAdminService, acceptPostService } from '../../../service/userService';
import moment from 'moment';
import { PAGINATION } from '../../../util/constant';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import NoteModal from '../../../components/modal/NoteModal';

const ManagePost = () => {
    const [dataPost, setdataPost] = useState([])
    const [count, setCount] = useState('')
    const [numberPage, setnumberPage] = useState('')
    const [user, setUser] = useState({})
    const [propsModal, setPropsModal] = useState({
        isActive: false,
        handlePost: () => { },
        postId: ''
    })
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
    let handleBanPost = async (id, note) => {
        let res = await banPostService({
            postId: id,
            userId: user.id,
            note: note
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
    let handleActivePost = async (id, note) => {
        let res = await activePostService({
            id: id,
            userId: user.id,
            note: note
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
    let handleAccecptPost = async (id, note = null, statusCode = 'PS2') => {
        let res = await acceptPostService({
            id: id,
            statusCode: statusCode,
            note: note,
            userId: user.id
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
                                                        <Link style={{color:'#4B49AC'}} to={`/admin/note/${item.id}`}>Chú thích</Link>
                                                        &nbsp; &nbsp;
                                                        {(user.roleCode == 'COMPANY' || user.roleCode == 'EMPLOYER') &&
                                                            <>
                                                                <Link style={{ color: '#4B49AC' }} to={`/admin/list-cv/${item.id}/`}>Xem CV nộp</Link>
                                                                &nbsp; &nbsp;
                                                            </>
                                                        }
                                                        { 
                                                        item.statusCode.code !== 'PS4' &&
                                                        <Link style={{ color: '#4B49AC' }} to={`/admin/edit-post/${item.id}/`}>Sửa</Link>
                                                        }
                                                        &nbsp; &nbsp;
                                                        {user.roleCode == 'ADMIN' ? (item.statusCode == 'PS1' ? <>
                                                            <a style={{ color: '#4B49AC', cursor: 'pointer' }} onClick={() => setPropsModal({
                                                                isActive: true,
                                                                handlePost: handleBanPost,
                                                                postId: item.id
                                                            })}  >Chặn</a>
                                                            &nbsp; &nbsp;
                                                        </>
                                                            : item.statusCode == 'PS4' ? <>
                                                                <a style={{ color: '#4B49AC', cursor: 'pointer' }} onClick={() => setPropsModal({
                                                                    isActive: true,
                                                                    handlePost: handleActivePost,
                                                                    postId: item.id
                                                                })}  >Mở lại</a>
                                                            </> : <>
                                                                <a style={{ color: '#4B49AC', cursor: 'pointer' }} onClick={() => handleAccecptPost(item.id, '', 'PS1')}  >Duyệt</a>
                                                                {
                                                                    item.statusCode !== 'PS2' &&
                                                                    <a style={{ color: '#4B49AC', cursor: 'pointer', marginLeft: '10px' }} onClick={() => setPropsModal({
                                                                        isActive: true,
                                                                        handlePost: handleAccecptPost,
                                                                        postId: item.id
                                                                    })}  >Từ chối</a>
                                                                }
                                                            </>) : <></>
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
            <NoteModal isOpen={propsModal.isActive} onHide={() => setPropsModal({
                isActive: false,
                handlePost: () => { },
                id: ''
            })} id={propsModal.postId} handleFunc={propsModal.handlePost} />
        </div>
    )
}

export default ManagePost
