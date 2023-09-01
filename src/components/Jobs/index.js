import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const profileApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const jobsApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    profileApiStatus: profileApiStatusConstants.initial,
    jobsList: {},
    jobsApiStatus: jobsApiStatusConstants.initial,
    searchInput: '',
    checkBoxInputs: [],
    radioInput: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  getJobs = async () => {
    const {checkBoxInputs, radioInput, searchInput} = this.state
    this.setState({jobsApiStatus: jobsApiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const jobApiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkBoxInputs}&minimum_package=${radioInput}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobApiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedJobsData = data.jobs.map(eachJob => ({
        companyLogo: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        package: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsList: updatedJobsData,
        jobsApiStatus: jobsApiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: jobsApiStatusConstants.failure})
    }
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: profileApiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(profileApiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedProfileData = {
        name: data.profile_details.name,
        profileImgUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedProfileData,
        profileApiStatus: profileApiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: profileApiStatusConstants.failure})
    }
  }

  onchangeCheckBoxInput = event => {
    const {checkBoxInputs} = this.state
    const inputsNotSelected = checkBoxInputs.filter(
      each => each === event.target.id,
    )
    if (inputsNotSelected.length === 0) {
      this.setState(
        prevState => ({
          checkBoxInputs: [...prevState.checkBoxInputs, event.target.id],
        }),
        this.getJobs,
      )
    } else {
      const filteredInputs = checkBoxInputs.filter(
        each => each !== event.target.id,
      )
      this.setState({checkBoxInputs: filteredInputs}, this.getJobs)
    }
  }

  onchangeRadioInput = event => {
    this.setState({radioInput: event.target.id}, this.getJobs)
  }

  onchangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onPressEnterKey = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  onclickSearchButton = () => {
    this.getJobs()
  }

  renderJobsList = () => {
    const {jobsList} = this.state
    return jobsList.length !== 0 ? (
      <ul className="all-jobs-list-container">
        {jobsList.map(each => (
          <JobItem key={each.id} jobs={each} />
        ))}
      </ul>
    ) : (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-image"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">
          We could not find any jobs. Try other filters
        </p>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onclickJobsRetry = () => {
    this.getJobs()
  }

  onclickProfileRetry = () => {
    this.getProfileDetails()
  }

  renderJobsFailureView = () => (
    <div className="jobs-failure-container">
      <img
        className="jobs-failure-image"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="jobs-failure-heading">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-description">
        we cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={() => this.onclickJobsRetry()}
      >
        Retry
      </button>
    </div>
  )

  renderProfileFailureView = () => (
    <div className="profile-failure-container">
      <button
        type="button"
        className="retry-button"
        onClick={() => this.onclickProfileRetry()}
      >
        Retry
      </button>
    </div>
  )

  renderProfile = () => {
    const {profileDetails} = this.state
    return (
      <div className="profile-container">
        <img
          src={profileDetails.profileImgUrl}
          alt="profile"
          className="profile-image"
        />
        <h1 className="user-name">{profileDetails.name}</h1>
        <p className="user-bio">{profileDetails.shortBio}</p>
      </div>
    )
  }

  renderProfileFinalView = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case profileApiStatusConstants.success:
        return this.renderProfile()
      case profileApiStatusConstants.inProgress:
        return this.renderLoadingView()
      case profileApiStatusConstants.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  renderJobsFinalView = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case jobsApiStatusConstants.success:
        return this.renderJobsList()
      case jobsApiStatusConstants.inProgress:
        return this.renderLoadingView()
      case jobsApiStatusConstants.failure:
        return this.renderJobsFailureView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <div className="jobs-bg-container">
        <Header />
        <div className="user-and-jobs-container">
          <div className="user-filters-container">
            {this.renderProfileFinalView()}
            <hr className="line" />
            <h1 className="filter-headings">Type of Employment</h1>
            <ul className="filters-list-container">
              {employmentTypesList.map(each => (
                <li className="filters-list-item" key={each.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={each.employmentTypeId}
                    className="filters-inputs"
                    onChange={this.onchangeCheckBoxInput}
                  />
                  <label
                    className="filters-labels"
                    htmlFor={each.employmentTypeId}
                  >
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr className="line" />
            <h1 className="filter-headings">Salary Range</h1>
            <ul className="filters-list-container">
              {salaryRangesList.map(each => (
                <li className="filters-list-item" key={each.salaryRangeId}>
                  <input
                    type="radio"
                    id={each.salaryRangeId}
                    className="filters-inputs"
                    name="salary"
                    onChange={this.onchangeRadioInput}
                  />
                  <label
                    className="filters-labels"
                    htmlFor={each.salaryRangeId}
                  >
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="search-jobs-container">
            <div className="jobs-search-input-container">
              <input
                className="jobs-search-input"
                type="search"
                onChange={this.onchangeSearchInput}
                value={searchInput}
                onKeyDown={this.onPressEnterKey}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.onclickSearchButton}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsFinalView()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
