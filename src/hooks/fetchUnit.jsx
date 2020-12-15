import axios from '../axios'
import { setUnits, setError, setLoading } from '../store/actions'


export default function fetchUnit(accessToken) {
  return dispatch => {
    axios({
      url: '/units',
      method: 'GET',
      headers: { 'access_token': accessToken }
    })
    .then(({ data }) => {
      dispatch(setUnits(data))
    })
    .catch(err => {
      dispatch(setError(err))
    })
    .finally(() => {
      dispatch(setLoading(false))
    })
  }
}