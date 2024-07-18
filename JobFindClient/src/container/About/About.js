import React from 'react'
import { Link } from 'react-router-dom'
const About = () => {
    return (
        <>
             {/* <div id="preloader-active">
        <div class="preloader d-flex align-items-center justify-content-center">
            <div class="preloader-inner position-relative">
                <div class="preloader-circle"></div>
                <div class="preloader-img pere-text">
                    <img src="assets/img/logo/logo.png" alt="">
                </div>
            </div>
        </div>
    </div> */}
 
    <main>

        {/* <!-- Hero Area Start--> */}
        <div class="slider-area ">
        <div class="single-slider section-overly slider-height2 d-flex align-items-center" style={{ 
                    backgroundImage: `url("assets/img/hero/about.jpg")` 
                  }}>
            <div class="container">
                <div class="row">
                    <div class="col-xl-12">
                        <div class="hero-cap text-center">
                            <h2>Thông tin về tôi</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
        {/* <!-- Hero Area End --> */}
        {/* <!-- Support Company Start--> */}
        <div class="support-company-area fix section-padding2">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-xl-6 col-lg-6">
                        <div class="right-caption">
                            {/* <!-- Section Tittle --> */}
                            <div class="section-tittle section-tittle2">
                                <span>Chúng tôi đang làm gì</span>
                                <h2>24k người đang được nhận việc làm</h2>
                            </div>
                            <div class="support-caption">
                                <p class="pera-top">Chào mừng bạn đến với [CT05PM], nơi kết nối hàng ngàn người tìm việc với các nhà tuyển dụng hàng đầu. Với hơn 24,000 người đang nhận được việc làm thông qua nền tảng của chúng tôi, chúng tôi tự hào là cầu nối giữa tài năng và cơ hội.</p>
                                <p><strong><h3>TẦM NHÌN & SỨ MỆNH</h3></strong></p>
                                <p><strong>Tầm Nhìn:</strong> Trở thành nền tảng việc làm hàng đầu, giúp mọi người tìm thấy công việc phù hợp và các nhà tuyển dụng tìm thấy những ứng viên xuất sắc</p>
                                <p><strong>Sứ Mệnh:</strong> Hỗ trợ người tìm việc bằng cách cung cấp các công cụ và tài nguyên hữu ích.
                                Giúp nhà tuyển dụng tìm kiếm và tuyển dụng nhân tài một cách nhanh chóng và hiệu quả.</p>
                                <Link to={'/login'} class="btn post-btn">Tham gia ngay</Link>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-6 col-lg-6">
                        <div class="support-location-img">
                            <img src="assets/img/NguyenThuVi.jpg" alt="" />
                            <div class="support-img-cap text-center">
                                <p>Since</p>
                                <span>2024</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* <!-- Support Company End--> */}
        {/* <!-- How  Apply Process Start--> */}
        <div class="apply-process-area apply-bg pt-150 pb-150" style={{ 
                    backgroundImage: `url("assets/img/gallery/how-applybg.png")` 
                  }}>
            <div class="container">
                {/* <!-- Section Tittle --> */}
                <div class="row">
                    <div class="col-lg-12">
                        <div class="section-tittle white-text text-center">
                            <span>QUY TRÌNH NỘP ĐƠN</span>
                            <h2> Cách thức hoạt động</h2>
                        </div>
                    </div>
                </div>
                {/* <!-- Apply Process Caption --> */}
                <div class="row">
                    <div class="col-lg-4 col-md-6">
                        <div class="single-process text-center mb-30">
                            <div class="process-ion">
                                <span class="flaticon-search"></span>
                            </div>
                            <div class="process-cap">
                                <h5>1. Tìm kiếm việc làm</h5>
                            <p>Sử dụng thanh tìm kiếm để nhập từ khóa liên quan đến công việc mà bạn quan tâm, ví dụ như "kế toán", "kỹ sư phần mềm", "nhân viên bán hàng", v.v.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <div class="single-process text-center mb-30">
                            <div class="process-ion">
                                <span class="flaticon-curriculum-vitae"></span>
                            </div>
                            <div class="process-cap">
                                <h5>2. Nộp đơn xin việc</h5>
                                <p> Nhấp vào nút "Nộp đơn" hoặc "Ứng tuyển ngay" trên trang chi tiết công việc, điền các thông tin cần thiết và đính kèm hồ sơ của bạn.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <div class="single-process text-center mb-30">
                            <div class="process-ion">
                                <span class="flaticon-tour"></span>
                            </div>
                            <div class="process-cap">
                                <h5>3. Nhận công việc của bạn </h5>
                            <p>Kiểm tra email và trang quản lý đơn xin việc thường xuyên để nhận phản hồi từ nhà tuyển dụng.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* <!-- How  Apply Process End--> */}
        {/* <!-- Testimonial Start --> */}
        <div class="testimonial-area testimonial-padding">
            <div class="container">
                {/* <!-- Testimonial contents --> */}
                <div class="row d-flex justify-content-center">
                    <div class="col-xl-8 col-lg-8 col-md-10">
                        <div class="h1-testimonial-active dot-style">
                            {/* <!-- Single Testimonial --> */}
                            <div class="single-testimonial text-center">
                                {/* <!-- Testimonial Content --> */}
                                <div class="testimonial-caption ">
                                    {/* <!-- founder --> */}
                                    <div class="testimonial-founder  ">
                                        <div class="founder-img mb-30">
                                            <img src="#" alt=""/>
                                            <span>Nguyễn Thư Vi</span>
                                            <p>Giám đốc sáng tạo</p>
                                        </div>
                                    </div>
                                    <div class="testimonial-top-cap">
                                        <p>"Tôi đang ở độ tuổi mà tôi chỉ muốn khỏe mạnh và cơ thể là trách nhiệm của chúng tôi! Vì vậy, hãy bắt đầu chăm sóc cơ thể của bạn và nó sẽ chăm sóc cho bạn. Ăn sạch sẽ nó sẽ chăm sóc bạn và tập luyện chăm chỉ."</p>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- Single Testimonial --> */}
                            <div class="single-testimonial text-center">
                                {/* <!-- Testimonial Content --> */}
                                <div class="testimonial-caption ">
                                    {/* <!-- founder --> */}
                                    <div class="testimonial-founder  ">
                                        <div class="founder-img mb-30">
                                            <img src="assets/img/testmonial/testimonial-founder.png" alt=""/>
                                            <span>Margaret Lawson</span>
                                            <p>Creative Director</p>
                                        </div>
                                    </div>
                                    <div class="testimonial-top-cap">
                                        <p>“I am at an age where I just want to be fit and healthy our bodies are our responsibility! So start caring for your body and it will care for you. Eat clean it will care for you and workout hard.”</p>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- Single Testimonial --> */}
                        
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* <!-- Testimonial End --> */}
        {/* <!-- Online CV Area Start --> */}
        <div class="online-cv cv-bg section-overly pt-90 pb-120" style={{ 
                    backgroundImage: `url("assets/img/gallery/cv_bg.jpg")` 
                  }}>
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-xl-10">
                        <div class="cv-caption text-center">
                            <p class="pera1">FEATURED TOURS Packages</p>
                            <p class="pera2"> Tạo sự khác biệt với sơ yếu lý lịch trực tuyến của bạn!</p>
                            <a href="#" class="border-btn2 border-btn4">Tải lên cv của bạn</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* <!-- Online CV Area End--> */}
    


    </main>

        </>
    )
}

export default About
