import { createError, defineEventHandler, readBody } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { accessToken, stationId } = body

  try {
    const response = await axios.post('https://globalapi.solarmanpv.com/station/v1.0/realTime', {
      stationId
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (error) {
    throw createError({
      statusCode: error.response.status,
      statusMessage: error.response.data.message,
    })
  }
})
