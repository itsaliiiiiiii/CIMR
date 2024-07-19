import logo from '../image/cimrLogo.png';

export default function NavBar() {
    return (
        <>
            <nav className="navbar navbar-expand bg-body py-3 ">
                <div className="container d-flex justify-content-center">
                    <div className="collapse navbar-collapse flex-grow-0 order-md-first" id="navcol-4">
                        <img src={logo} alt="logo CIMR" className="navbar-logo" />
                    </div>
                </div>
            </nav>
        </>
    )
}