import React from 'react'
import { useEffect, useState } from 'react';
import { getFilterCv } from '../../../service/cvService';
import { getAllSkillByJobCode, getDetailCompanyByUserId } from '../../../service/userService';
import { useFetchAllcode } from '../../../util/fetch';
import { PAGINATION } from '../../../util/constant';
import ReactPaginate from 'react-paginate';
import { Link, useHistory } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { Col, Row, Select, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const {confirm} = Modal


const FilterCv = () => {
    const [dataCv, setdataCv] = useState([])
    const [count, setCount] = useState('')
    const [numberPage, setnumberPage] = useState('')
    const [inputValue, setInputValue] = useState({
        categoryJobCode: '', experienceJobCode: '', listSkills: []
    })
    const [listSkills, setListSkills] = useState([])
    const [isHiddenPercent, setIsHiddenPercent] = useState(true)
    const [companySeeAllow,setCompanySeeAllow] = useState({
        free:0,
        notFree: 0
    })
    let fetchCompany = async (userId, companyId = null) => {
        let res = await getDetailCompanyByUserId(userId, companyId)
        if (res && res.errCode === 0) {
            setCompanySeeAllow({
                free: res.data.allowCvFree,
                notFree: res.data.allowCv
            })
        }
    }
    let history = useHistory()
    const confirmSeeCandiate = (id) => {
        confirm({
            title: 'Khi xem bạn sẽ mất 1 lần xem thông tin ứng viên',
            icon: <ExclamationCircleOutlined />,    
            onOk() {
                history.push(`/admin/candiate/${id}/`)
            },
        
            onCancel() {
            },
          });
    }
    useEffect(() => {
        try {
            let fetchData = async () => {
                let listSkills = []
                let otherSkills = [] 
                inputValue.listSkills.forEach(item=> {
                    if (typeof item === 'number') {
                        listSkills.push(item)
                    }else {
                        otherSkills.push(item)
                    }
                })
                let arrData = await getFilterCv({
                    limit: PAGINATION.pagerow,
                    offset: 0,
                    categoryJobCode: inputValue.categoryJobCode,
                    experienceJobCode: inputValue.experienceJobCode,
                    listSkills: listSkills,
                    otherSkills: otherSkills
                })
                if (arrData && arrData.errCode === 0) {
                    setdataCv(arrData.data)
                    setIsHiddenPercent(arrData.isHiddenPercent)
                    setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
                }
            }
            let userData = JSON.parse(localStorage.getItem("userData"))
            fetchData();
            fetchCompany(userData.id,userData.companyId)
        } catch (error) {
            console.log(error)
        }
    }, [inputValue])

    let { data: dataExp } = useFetchAllcode('EXPTYPE')
    let { data: dataJobType } = useFetchAllcode('JOBTYPE')

    dataExp = dataExp.map(item => ({
        value: item.code,
        label: item.value,
        type: 'experienceJobCode'
    }))


    dataJobType = dataJobType.map(item => ({
        value: item.code,
        label: item.value,
        type: 'categoryJobCode'
    }))

    const handleChange = async (value, detail) => {
        if (Array.isArray(detail)) {
            setInputValue({
                ...inputValue,
                listSkills: value
            })
        }
        else {
            if (detail.type === 'categoryJobCode') {
                let res = await getAllSkillByJobCode(value)
                let listSkills = res.data.map(item => ({
                    value: item.id,
                    label: item.name
                }))
                setListSkills(listSkills)
                setInputValue({
                    ...inputValue,
                    [detail.type]: value,
                    listSkills: []
                })
            }
            else {
                setInputValue({
                    ...inputValue,
                    [detail.type]: value,
                })
            }
        }
    };

    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
        let arrData = await getFilterCv({
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow,
            categoryJobCode: inputValue.categoryJobCode,
            experienceJobCode: inputValue.experienceJobCode,
            listSkills: inputValue.listSkills
        })
        if (arrData && arrData.errCode === 0) {
            setdataCv(arrData.data)

        }
    }
    return (

        <div>

            <div className="col-12 grid-margin">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Danh sách ứng viên</h4>
                        <div>
                            
                            <p>{`Số lượt xem miễn phí: ${companySeeAllow.free}`}</p>
                            <p>{`Số lượt xem: ${companySeeAllow.notFree}`}</p>
                        </div>
                        <Row justify='space-around' className='mt-5 mb-5 ml-3'>
                            <Col xs={12} xxl={12}>
                                <label className='mr-2'>Lĩnh vực: </label>
                                <Select
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    showSearch
                                    style={{ width: '70%' }} size='default' onChange={handleChange} value={inputValue.categoryJobCode} options={dataJobType}>
                                </Select>
                            </Col>
                            <Col xs={12} xxl={12}>
                                <label className='mr-2'>Kinh nghiệm: </label>
                                <Select
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    showSearch
                                    style={{ width: '70%' }} size='default' onChange={handleChange} value={inputValue.experienceJobCode} options={dataExp}>

                                </Select>
                            </Col>
                        </Row>
                        <Row justify='space-around' className='mt-5 mb-5 ml-3'>
                            <Col xs={24} xxl={24}>
                                <label className='mr-2'>Kỹ năng: </label>
                                <Select
                                    disabled={!inputValue.categoryJobCode}
                                    mode="tags"
                                    allowClear
                                    style={{
                                        width: '89%',
                                    }}
                                    placeholder="Chọn kĩ năng của bạn"
                                    onChange={handleChange}
                                    options={listSkills}
                                    value={inputValue.listSkills}
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    showSearch
                                >
                                </Select>
                            </Col>
                        </Row>
                        <div className="table-responsive pt-2">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>
                                            STT
                                        </th>
                                        <th>
                                            Tên ứng viên
                                        </th>
                                        <th>
                                            Lĩnh vực
                                        </th>
                                        <th>
                                            Kinh nghiệm
                                        </th>
                                        {
                                            !isHiddenPercent &&
                                            <th>
                                                Tỉ lệ phù hợp
                                            </th>
                                        }
                                        <th>
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataCv && dataCv.length > 0 &&
                                        dataCv.map((item, index) => {

                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1 + numberPage * PAGINATION.pagerow}</td>
                                                    <td>{item.userSettingData.firstName + " " + item.userSettingData.lastName}</td>
                                                    <td>{item.jobTypeSettingData.value}</td>
                                                    <td>{item.expTypeSettingData.value}</td>
                                                    {
                                                        !isHiddenPercent &&
                                                        <td>{item.file}</td>
                                                    }
                                                    <td>
                                                        <span style={{ color: '#4B49AC', cursor: 'pointer' }} onClick={()=>confirmSeeCandiate(item.userId)}>Xem chi tiết ứng viên</span>
                                                        &nbsp; &nbsp;
                                                    </td>
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



        </div>
    )
}

export default FilterCv
