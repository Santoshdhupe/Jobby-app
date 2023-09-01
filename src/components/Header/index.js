import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onclickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="nav-header">
      <ul className="header-list-container">
        <li className="header-lists">
          <Link to="/" className="link-item">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="header-image"
            />
          </Link>
        </li>
        <li className="header-lists">
          <div className="header-center-container">
            <Link to="/" className="link-item">
              <p className="header-elements">Home</p>
            </Link>
            <Link to="/jobs" className="link-item">
              <p className="header-elements">Jobs</p>
            </Link>
          </div>
        </li>
        <li className="header-lists">
          <button
            type="button"
            className="logout-button"
            onClick={onclickLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

export default withRouter(Header)
