import React from 'react'
import { useEffect, useState } from 'react';
import { getAllCompany, accecptCompanyService } from '../../../service/userService';
import moment from 'moment';
import { PAGINATION } from '../../../util/constant';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import NoteModal from '../../../components/modal/NoteModal';

const ManageCompany = () => {
    const [dataCompany, setdataCompany] = useState([])
    const [count, setCount] = useState('')
    const [numberPage, setnumberPage] = useState('')
    const [user, setUser] = useState({})
    const [propsModal, setPropsModal] = useState({
        isActive: false,
        handleCompany: () => { },
        id: ''
    })
    useEffect(() => {
        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (userData) {
                let fetchData = async () => {
                    let arrData = []
                    arrData = await getAllCompany({
                        limit: PAGINATION.pagerow,
                        offset: 0,
                    })
                    if (arrData && arrData.errCode === 0) {
                        setdataCompany(arrData.data)
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
        let arrData = await getAllCompany({
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow,
        })
        if (arrData && arrData.errCode === 0) {
            setdataCompany(arrData.data)
        }
    }
    let handleAccecptCompany = async (id, note = 'null') => {
        let res = await accecptCompanyService({
            companyId: id,
            note: note,
        })
        if (res && res.errCode === 0) {
            let arrData = await getAllCompany({
                limit: PAGINATION.pagerow,
                offset: numberPage * PAGINATION.pagerow,
            })
            if (arrData && arrData.errCode === 0) {
                setdataCompany(arrData.data)
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
                                            Mã công ty
                                        </th>
                                        <th>
                                            Tên công ty
                                        </th>
                                        <th>
                                            Số điện thoại
                                        </th>
                                        <th>
                                            Mã số thuế
                                        </th>
                                        <th>
                                            Trạng thái
                                        </th>
                                        <th>
                                            Ngày khởi tạo
                                        </th>
                                        <th>
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataCompany && dataCompany.length > 0 &&
                                        dataCompany.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{item.id}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.phonenumber}</td>
                                                    <td>{item.taxnumber}</td>
                                                    <td>{item.censorData.value}</td>
                                                    <td>{moment(item.createdAt).format('DD-MM-YYYY')}</td>
                                                    <td>
                                                        <Link style={{ color: '#4B49AC' }} to={`/admin/edit-company-admin/${item.id}`}>Sửa</Link>
                                                        &nbsp; &nbsp;
                                                        {item.censorData.code === 'CS3' &&
                                                            <>
                                                                <a style={{ color: '#4B49AC', cursor: 'pointer' }} onClick={() => handleAccecptCompany(item.id)} >Duyệt</a>
                                                                &nbsp; &nbsp;
                                                            </>
                                                        }
                                                        {
                                                            item.censorData.code === 'CS1' &&
                                                            <>
                                                                <a style={{ color: '#4B49AC', cursor: 'pointer' }} onClick={() => setPropsModal({
                                                                    isActive: true,
                                                                    handleCompany: handleAccecptCompany,
                                                                    id: item.id
                                                                })}  >Quay lại trạng thái chờ</a>
                                                                &nbsp; &nbsp;
                                                            </>
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
                handleCompany: () => { },
                id: ''
            })} id={propsModal.id} handleFunc={propsModal.handleCompany} />
        </div >
    )
}

export default ManageCompany
