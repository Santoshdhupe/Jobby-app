import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {FaSuitcase} from 'react-icons/fa'
import './index.css'

const SimilarJobs = props => {
  const {eachSimilarJob} = props
  return (
    <li className="similar-job-container">
      <div className="similar-job-logo-title-container">
        <img
          src={eachSimilarJob.companyLogo}
          alt="similar job company logo"
          className="similar-job-logo"
        />
        <div className="similar-job-title-rating-container">
          <h1 className="similar-job-title">{eachSimilarJob.title}</h1>
          <div className="similar-job-rating-container">
            <AiFillStar className="similar-job-rating-icon" />
            <p className="similar-job-rating">{eachSimilarJob.rating}</p>
          </div>
        </div>
      </div>
      <h1 className="similar-job-description-heading">Description</h1>
      <p className="similar-job-description">{eachSimilarJob.jobDescription}</p>
      <div className="similar-job-location-container">
        <MdLocationOn className="similar-job-location-icon" />
        <p className="similar-job-location">{eachSimilarJob.location}</p>
        <FaSuitcase className="similar-job-type-icon" />
        <p className="similar-job-employment-type">
          {eachSimilarJob.employmentType}
        </p>
      </div>
    </li>
  )
}

export default SimilarJobs
