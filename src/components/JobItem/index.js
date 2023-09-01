import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {FaSuitcase} from 'react-icons/fa'
import './index.css'

const JobItem = props => {
  const {jobs} = props
  return (
    <Link className="job-link-item" to={`/jobs/${jobs.id}`}>
      <li className="job-list-item">
        <div className="logo-title-container">
          <img
            src={jobs.companyLogo}
            className="company-logo"
            alt="company logo"
          />
          <div className="title-rating-container">
            <h1 className="job-title">{jobs.title}</h1>
            <div className="rating-container">
              <AiFillStar className="rating-icon" />
              <p className="each-job-rating">{jobs.rating}</p>
            </div>
          </div>
        </div>
        <div className="location-package-container">
          <div className="location-type-container">
            <MdLocationOn className="location-icon" />
            <p className="each-job-location">{jobs.location}</p>
            <FaSuitcase className="type-icon" />
            <p className="each-job-employment-type">{jobs.employmentType}</p>
          </div>
          <p className="each-job-package">{jobs.package}</p>
        </div>
        <hr className="each-job-horizontal-line" />
        <h1 className="each-job-description-heading">Description</h1>
        <p className="each-job-description">{jobs.jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
