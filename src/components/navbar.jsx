import React from 'react'
import { ConnectKitButton } from 'connectkit'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'

const Navbar = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">

                    <Link className="navbar-brand" to="/">Ashar DApp</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo03">

                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                            <li className="nav-item">
                                <Link className="nav-link " aria-current="page" to="/">Swap</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/erc721">Mint NFT</Link>
                            </li>


                        </ul>
                        <div className="d-flex">
                            <ConnectKitButton showBalance={true} />

                        </div>

                    </div>
                    

                </div>
            </nav>
        </>
    )
}

export default Navbar