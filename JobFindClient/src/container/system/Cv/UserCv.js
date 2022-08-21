import React from 'react'
import { useEffect, useState } from 'react';
import { getDetailCvService } from '../../../service/cvService';


import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";


const UserCv = () => {
    console.log("Hello")
    const { id } = useParams();
    const [dataCV, setdataCV] = useState({
        userCvData: {
            firstName: '',
            lastName: ''
        },
        file: {
            data: ''
        }
    });
    useEffect(() => {
        if (id) {

            let fetchCV = async () => {
                let res = await getDetailCvService(id)
                if (res && res.errCode === 0) {
                    setdataCV(res.data)
                }
            }
            fetchCV()

        }


    }, [])



    return (

        <div>

            <div className="col-12 grid-margin">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Giới thiệu bản thân</h4>
                        <blockquote class="blockquote blockquote-primary">
                            <p>{dataCV.description}</p>
                            <footer class="blockquote-footer"><cite title="Source Title">{dataCV.userCvData.firstName + " " + dataCV.userCvData.lastName}</cite></footer>
                        </blockquote>

                    </div>
                    <div className="card-body">
                        <h4 className="card-title">FILE CV</h4>
                        <iframe width={'100%'} height={'700px'} src={dataCV.file}></iframe>
                    </div>
                </div>

            </div>



        </div>
    )
}

export default UserCv
