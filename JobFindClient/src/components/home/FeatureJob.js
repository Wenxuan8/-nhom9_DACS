import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment';
const FeatureJob = (props) => {
    const handleSplitTime = (time) => {
        return moment(time).fromNow();
    }
    return (
        <>
            <div class="single-job-items mb-30">
                <div class="job-items">
                    <div class="company-img">
                        <a href="job_details.html"><img src={props.data.company.thumbnail} alt="" style={{ width: "85px", height: "85px" }} /></a>
                    </div>
                    <div class="job-tittle">
                        <a href="job_details.html"><h4>{props.data.jobTypePostData.value}</h4></a>
                        <ul>
                            <li>{props.data.jobLevelPostData.value}</li>
                            <li><i class="fas fa-map-marker-alt"></i>{props.data.provincePostData.value}</li>
                            <li>{props.data.salaryTypePostData.value}</li>
                        </ul>
                    </div>
                </div>
                <div class="items-link items-link2 f-right">
                    <a href="job_details.html">{props.data.workTypePostData.value}</a>
                    <span style={{ position: 'absolute', right: '70px' }}>{handleSplitTime(props.data.createdAt)}</span>
                </div>
            </div>
        </>
    )
}

export default FeatureJob
