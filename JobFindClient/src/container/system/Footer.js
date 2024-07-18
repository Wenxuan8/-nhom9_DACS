import React from 'react'

const Footer = () => {
    return (
        <footer className="footer">
                <div className="footer-bottom-area footer-bg" style={{backgroundColor:'white'}}>
                    <div className="container">
                        <div className="footer-border">
                            <div className="row d-flex justify-content-between align-items-center">
                                <div className="col-xl-10 col-lg-10 ">
                                    <div className="footer-copy-right">
                                        <p>
                                            Copyright &copy;<script>document.write(new Date().getFullYear());</script><i className="fa fa-heart" aria-hidden="true"></i> từ <a href="https://www.linkedin.com/in/nguy%E1%BB%85n-th%C6%B0-vi-96781a255/" target="_blank">Thư Vi</a>
                                        </p>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-2">
                                    <div className="footer-social f-right">
                                        <a href="https://www.facebook.com/vi.nguyenthu.524"><i className="fab fa-facebook-f"></i></a>
                                        <a href="#"><i className="fab fa-twitter"></i></a>
                                        <a href="#"><i className="fas fa-globe"></i></a>
                                        <a href="#"><i className="fab fa-behance"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </footer>
    )
}

export default Footer
