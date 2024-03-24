import Menu from "./Menu";

interface Props {
    setIsLogged: (value: boolean) => void;
}

export function MenuTest({ setIsLogged }: Props) {

    return (
        <div className="sidebar" role="navigation" color="white">
            <div className="sidebar-container">
                <div className="sidebar-header">
                    <a className="sidebar-brand">Multi Level</a>
                    <a className="sidebar-toggler"><i className="fa fa-bars"></i></a>
                </div>
                <div className="sidebar-nav">
                    <div className="sidenav">
                        <a className="sidebar-item">
                            <div className="sidebar-item-content">
                                <i className="fa fa-th-large sidebar-icon sidebar-icon-lg"></i>
                                <span>Dashboard</span>
                            </div>
                        </a>
                        <a className="sidebar-item">
                            <div className="sidebar-item-content">
                                <i className="fa fa-sticky-note sidebar-icon"></i>
                                <span>Components</span>
                            </div>
                        </a>
                    </div>
                    <div className="sidebar-footer">
                        Sidebar Footer
                    </div>
                </div>
            </div>
        </div>
    )
}