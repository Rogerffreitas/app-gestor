import axios from 'axios'
import { WorkWatermelonDbRepository } from '../../../../persistence/WorkWatermelonDbRepository'
import WorkEntity from '../../../../domin/entity/work/WorkEntity'

jest.mock('axios')

test('should fetch users', () => {
    const resp = { data: { data: 'data' } }
    axios.get.mockResolvedValue(resp)

    // or you could use the following depending on your use case:
    // axios.get.mockImplementation(() => Promise.resolve(resp))
})
