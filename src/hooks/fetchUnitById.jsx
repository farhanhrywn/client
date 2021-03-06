import axios from '../axios'
import { setUnit, setError, setLoading } from '../store/actions'

export default function fetchUnitById(id) {
  const accessToken = localStorage.getItem('vendor_access_token')
  return dispatch => {
    axios({
      url: `/units/${id}`,
      method: 'GET',
      headers: { 'vendor_access_token': accessToken }
    })
    .then(({ data }) => {
      dispatch(setUnit(data))
    })
    .catch(err => {
      dispatch(setError(err))
    })
    .finally(() => {
      dispatch(setLoading(false))
    })
  }
}