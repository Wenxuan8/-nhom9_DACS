import React from 'react'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DatePicker from '../../../components/input/DatePicker';
import { createPostService, updatePostService, getDetailPostByIdService } from '../../../service/userService';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { useFetchAllcode } from '../../../util/fetch';
import { useParams } from "react-router-dom";
import { Spinner, Modal } from 'reactstrap'
import localization from 'moment/locale/vi';
import moment from 'moment';
import '../../../components/modal/modal.css'
const AddPost = () => {
    const mdParser = new MarkdownIt();
    const [user, setUser] = useState({})
    const [timeEnd, settimeEnd] = useState('');
    const [isChangeDate, setisChangeDate] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { id } = useParams();
    const [inputValues, setInputValues] = useState({
        name: '', categoryJobCode: '', addressCode: '', salaryJobCode: '', amount: '', timeEnd: '', categoryJoblevelCode: '', categoryWorktypeCode: '', experienceJobCode: '',
        genderCode: '', descriptionHTML: '', descriptionMarkdown: '', isActionADD: true, id: ''
    });
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (id) {
            fetchPost(id)
        }
        setUser(userData)
    }, [])
    let fetchPost = async (id) => {
        let res = await getDetailPostByIdService(id)
        if (res && res.errCode === 0) {
            setStatePost(res.data)
        }
    }
    let setStatePost = (data) => {
        setInputValues({
            ...inputValues,
            ["name"]: data.postDetailData.name,
            ["categoryJobCode"]: data.postDetailData.jobTypePostData.code,
            ["addressCode"]: data.postDetailData.provincePostData.code,
            ["salaryJobCode"]: data.postDetailData.salaryTypePostData.code,
            ["amount"]: data.postDetailData.amount,
            ["timeEnd"]: data.timeEnd,
            ["categoryJoblevelCode"]: data.postDetailData.jobLevelPostData.code,
            ["categoryWorktypeCode"]: data.postDetailData.workTypePostData.code,
            ["experienceJobCode"]: data.postDetailData.expTypePostData.code,
            ["genderCode"]: data.postDetailData.genderPostData.code,
            ["descriptionHTML"]: data.postDetailData.descriptionHTML,
            ["descriptionMarkdown"]: data.postDetailData.descriptionMarkdown,
            ["isActionADD"]: false,
            ["id"]: data.id

        })
        document.querySelector('[name="categoryJobCode"]').value = data.postDetailData.jobTypePostData.code
        document.querySelector('[name="addressCode"]').value = data.postDetailData.provincePostData.code
        document.querySelector('[name="salaryJobCode"]').value = data.postDetailData.salaryTypePostData.code
        document.querySelector('[name="categoryJoblevelCode"]').value = data.postDetailData.jobLevelPostData.code
        document.querySelector('[name="categoryWorktypeCode"]').value = data.postDetailData.workTypePostData.code
        document.querySelector('[name="experienceJobCode"]').value = data.postDetailData.expTypePostData.code
        document.querySelector('[name="genderCode"]').value = data.postDetailData.genderPostData.code
        settimeEnd(moment.unix(+data.timeEnd / 1000).locale('vi').format('DD/MM/YYYY'))
    }


    const { data: dataGenderPost } = useFetchAllcode('GENDERPOST');
    const { data: dataJobType } = useFetchAllcode('JOBTYPE');
    const { data: dataJobLevel } = useFetchAllcode('JOBLEVEL');
    const { data: dataSalaryType } = useFetchAllcode('SALARYTYPE');
    const { data: dataExpType } = useFetchAllcode('EXPTYPE');
    const { data: dataWorkType } = useFetchAllcode('WORKTYPE');
    const { data: dataProvince } = useFetchAllcode('PROVINCE');

    if (dataGenderPost && dataGenderPost.length > 0 && inputValues.genderCode === '' && dataJobType && dataJobType.length > 0 && inputValues.categoryJobCode === '' && dataJobLevel && dataJobLevel.length > 0 && inputValues.categoryJoblevelCode === '' &&
        dataSalaryType && dataSalaryType.length > 0 && inputValues.salaryJobCode === '' && dataExpType && dataExpType.length > 0 && inputValues.experienceJobCode === '' &&
        dataWorkType && dataWorkType.length > 0 && inputValues.categoryWorktypeCode === '' && dataProvince && dataProvince.length > 0 && inputValues.addressCode === ''
    ) {

        setInputValues({
            ...inputValues, ["genderCode"]: dataGenderPost[0].code, ["categoryJobCode"]: dataJobType[0].code,
            ["categoryJoblevelCode"]: dataJobLevel[0].code, ["salaryJobCode"]: dataSalaryType[0].code, ["experienceJobCode"]: dataExpType[0].code,
            ["categoryWorktypeCode"]: dataWorkType[0].code
        })
    }
    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });

    };


    let handleEditorChange = ({ html, text }) => {
        setInputValues({
            ...inputValues,
            ["descriptionMarkdown"]: text,
            ["descriptionHTML"]: html
        })
    }
    let handleOnChangeDatePicker = (date) => {
        settimeEnd(date[0])
        setisChangeDate(true)

    }
    let handleSavePost = async () => {
        setIsLoading(true)
        if (inputValues.isActionADD === true) {
            let res = await createPostService({
                name: inputValues.name,
                descriptionHTML: inputValues.descriptionHTML,
                descriptionMarkdown: inputValues.descriptionMarkdown,
                categoryJobCode: inputValues.categoryJobCode,
                addressCode: inputValues.addressCode,
                salaryJobCode: inputValues.salaryJobCode,
                amount: inputValues.amount,
                timeEnd: new Date(timeEnd).getTime(),
                categoryJoblevelCode: inputValues.categoryJoblevelCode,
                categoryWorktypeCode: inputValues.categoryWorktypeCode,
                experienceJobCode: inputValues.experienceJobCode,
                genderCode: inputValues.genderCode,
                companyId: user.companyId,

            })
            setTimeout(() => {
                setIsLoading(false)
                if (res && res.errCode === 0) {
                    toast.success("Thêm mới bài đăng thành công")
                    setInputValues({
                        ...inputValues,
                        ["name"]: '',
                        ["descriptionHTML"]: '',
                        ["descriptionMarkdown"]: '',
                        ["categoryJobCode"]: '',
                        ["addressCode"]: '',
                        ["salaryJobCode"]: '',
                        ["amount"]: '',
                        ["timeEnd"]: '',
                        ["categoryJoblevelCode"]: '',
                        ["categoryWorktypeCode"]: '',
                        ["experienceJobCode"]: '',
                        ["genderCode"]: '',

                    })
                    settimeEnd('')
                } else {
                    toast.error(res.errMessage)
                }
            }, 1000);
        } else {
            let res = await updatePostService({
                name: inputValues.name,
                descriptionHTML: inputValues.descriptionHTML,
                descriptionMarkdown: inputValues.descriptionMarkdown,
                categoryJobCode: inputValues.categoryJobCode,
                addressCode: inputValues.addressCode,
                salaryJobCode: inputValues.salaryJobCode,
                amount: inputValues.amount,
                timeEnd: isChangeDate === false ? inputValues.timeEnd : new Date(timeEnd).getTime(),
                categoryJoblevelCode: inputValues.categoryJoblevelCode,
                categoryWorktypeCode: inputValues.categoryWorktypeCode,
                experienceJobCode: inputValues.experienceJobCode,
                genderPostCode: inputValues.genderCode,
                id: inputValues.id,
                userId: JSON.parse(localStorage.getItem('userData')).id
            })
            setTimeout(() => {
                setIsLoading(false)
                if (res && res.errCode === 0) {
                    toast.success("Cập nhật bài đăng thành công")

                } else {
                    toast.error(res.errMessage)
                }
            }, 1000);
        }
    }
    return (
        <>
            <div className=''>
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">{inputValues.isActionADD === true ? 'Thêm mới bài đăng' : 'Cập nhật bài đăng'}</h4>
                            <br></br>
                            <form className="form-sample">

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Tên bài đăng</label>
                                            <div className="col-sm-9">
                                                <input value={inputValues.name} name="name" onChange={(event) => handleOnChange(event)} type="text" className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Địa chỉ</label>
                                            <div className="col-sm-9">
                                                <select style={{color: "black"}} className="form-control" value={inputValues.addressCode} name="addressCode" onChange={(event) => handleOnChange(event)}>
                                                    {dataProvince && dataProvince.length > 0 &&
                                                        dataProvince.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.code}>{item.value}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">SL nhân viên</label>
                                            <div className="col-sm-9">
                                                <input value={inputValues.amount} name="amount" onChange={(event) => handleOnChange(event)} type="number" className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Thời gian KT</label>
                                            <div className="col-sm-9">
                                                <DatePicker className="form-control" onChange={handleOnChangeDatePicker}
                                                    value={timeEnd}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Giới tính</label>
                                            <div className="col-sm-9">
                                                <select style={{color: "black"}} className="form-control" value={inputValues.genderCode} name="genderCode" onChange={(event) => handleOnChange(event)}>
                                                    {dataGenderPost && dataGenderPost.length > 0 &&
                                                        dataGenderPost.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.code}>{item.value}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Kinh nghiệm</label>
                                            <div className="col-sm-9">
                                                <select style={{color: "black"}} className="form-control" value={inputValues.experienceJobCode} name="experienceJobCode" onChange={(event) => handleOnChange(event)}>
                                                    {dataExpType && dataExpType.length > 0 &&
                                                        dataExpType.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.code}>{item.value}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Ngành</label>
                                            <div className="col-sm-9">
                                                <select style={{color: "black"}} className="form-control" value={inputValues.categoryJobCode} name="categoryJobCode" onChange={(event) => handleOnChange(event)}>
                                                    {dataJobType && dataJobType.length > 0 &&
                                                        dataJobType.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.code}>{item.value}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Chức vụ</label>
                                            <div className="col-sm-9">
                                                <select style={{color: "black"}} className="form-control" value={inputValues.categoryJoblevelCode} name="categoryJoblevelCode" onChange={(event) => handleOnChange(event)}>
                                                    {dataJobLevel && dataJobLevel.length > 0 &&
                                                        dataJobLevel.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.code}>{item.value}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Lương</label>
                                            <div className="col-sm-9">
                                                <select style={{color: "black"}} className="form-control" value={inputValues.salaryJobCode} name="salaryJobCode" onChange={(event) => handleOnChange(event)}>
                                                    {dataSalaryType && dataSalaryType.length > 0 &&
                                                        dataSalaryType.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.code}>{item.value}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Hình thức LV</label>
                                            <div className="col-sm-9">
                                                <select style={{color: "black"}} className="form-control" value={inputValues.categoryWorktypeCode} name="categoryWorktypeCode" onChange={(event) => handleOnChange(event)}>
                                                    {dataWorkType && dataWorkType.length > 0 &&
                                                        dataWorkType.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.code}>{item.value}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <label className="form-label">Mô tả công việc</label>
                                        <div className="form-group">

                                            <MdEditor
                                                style={{ height: '500px' }}
                                                renderHTML={text => mdParser.render(text)}
                                                onChange={handleEditorChange}
                                                value={inputValues.descriptionMarkdown}
                                            />
                                        </div>
                                    </div>

                                </div>
                                <button onClick={() => handleSavePost()} type="button" className="btn1 btn1-primary1 btn1-icon-text">
                                    <i class="ti-file btn1-icon-prepend"></i>
                                    Lưu
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {isLoading &&
                <Modal isOpen='true' centered contentClassName='closeBorder' >

                    <div style={{
                        position: 'absolute', right: '50%',
                        justifyContent: 'center', alignItems: 'center'
                    }}>
                        <Spinner animation="border"  ></Spinner>
                    </div>

                </Modal>
            }
        </>
    )
}

export default AddPost
