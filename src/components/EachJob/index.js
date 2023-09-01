import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {FaSuitcase} from 'react-icons/fa'
import {FiExternalLink} from 'react-icons/fi'
import Loader from 'react-loader-spinner'
import SimilarJobs from '../SimilarJobs'
import Header from '../Header'
import './index.css'

const jobApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class EachJob extends Component {
  state = {
    jobDetails: {},
    skillsList: [],
    lifeAtCompany: '',
    similarJobs: [],
    jobApiStatus: jobApiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({jobApiStatus: jobApiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedJobData = {
        companyLogo: data.job_details.company_logo_url,
        companyWebsite: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        package: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }
      const updatedSkillsData = data.job_details.skills.map(each => ({
        imageUrl: each.image_url,
        name: each.name,
      }))
      const updatedLifeAtCompanyData = {
        lifeAtCompanyDescription: data.job_details.life_at_company.description,
        lifeAtCompanyImageUrl: data.job_details.life_at_company.image_url,
      }
      const updatedSimilarJobsData = data.similar_jobs.map(each => ({
        companyLogo: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobDetails: updatedJobData,
        skillsList: updatedSkillsData,
        lifeAtCompany: updatedLifeAtCompanyData,
        similarJobs: updatedSimilarJobsData,
        jobApiStatus: jobApiStatusConstants.success,
      })
    } else {
      this.setState({jobApiStatus: jobApiStatusConstants.failure})
    }
  }

  onclickRetry = () => {
    this.getJobDetails()
  }

  renderLoadingView = () => (
    <div className="job-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobFailureView = () => (
    <div className="job-failure-container">
      <img
        className="job-failure-image"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="job-failure-heading">Oops! Something Went Wrong</h1>
      <p className="job-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="job-retry-button"
        onClick={() => this.onclickRetry()}
      >
        Retry
      </button>
    </div>
  )

  renderJobView = () => {
    const {jobDetails, skillsList, lifeAtCompany, similarJobs} = this.state
    return (
      <div className="job-details-main-container">
        <div className="job-details-container">
          <div className="job-details-logo-title-container">
            <img
              className="job-details-company-logo"
              src={jobDetails.companyLogo}
              alt="job details company logo"
            />
            <div className="job-details-title-rating-container">
              <h1 className="job-details-title">{jobDetails.title}</h1>
              <div className="job-details-rating-container">
                <AiFillStar className="job-details-rating-icon" />
                <p className="job-details-rating">{jobDetails.rating}</p>
              </div>
            </div>
          </div>
          <div className="job-details-location-package-container">
            <div className="job-details-location-type-container">
              <MdLocationOn className="job-details-location-icon" />
              <p className="job-details-location">{jobDetails.location}</p>
              <FaSuitcase className="job-details-type-icon" />
              <p className="job-details-employment-type">
                {jobDetails.employmentType}
              </p>
            </div>
            <p className="job-details-package">{jobDetails.package}</p>
          </div>
          <hr className="job-details-line" />
          <div className="job-details-heading-anchor-container">
            <h1 className="job-details-description-heading">Description</h1>
            <a
              href={jobDetails.companyWebsite}
              className="job-details-company-link"
            >
              Visit
              <FiExternalLink className="job-details-link-icon" />
            </a>
          </div>
          <p className="job-details-description">{jobDetails.jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-list-container">
            {skillsList.map(each => (
              <li className="skills-list-item" key={each.name}>
                <img
                  src={each.imageUrl}
                  alt={each.name}
                  className="skill-image"
                />
                <p className="skill-name">{each.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="life-at-company-heading">Life at Company</h1>
          <div className="life-at-company-description-image-container">
            <p className="life-at-company-description">
              {lifeAtCompany.lifeAtCompanyDescription}
            </p>
            <img
              src={lifeAtCompany.lifeAtCompanyImageUrl}
              alt="life at company"
            />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list-container">
          {similarJobs.map(each => (
            <SimilarJobs key={each.id} eachSimilarJob={each} />
          ))}
        </ul>
      </div>
    )
  }

  renderJobFinalView = () => {
    const {jobApiStatus} = this.state
    switch (jobApiStatus) {
      case jobApiStatusConstants.success:
        return this.renderJobView()
      case jobApiStatusConstants.inProgress:
        return this.renderLoadingView()
      case jobApiStatusConstants.failure:
        return this.renderJobFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-details-bg-container">
        <Header />
        {this.renderJobFinalView()}
      </div>
    )
  }
}

export default EachJob
