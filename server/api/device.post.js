import { createError, defineEventHandler, readBody } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { accessToken, deviceType, page, size, stationId } = body

  try {
    const response = await axios.post('https://globalapi.solarmanpv.com/station/v1.0/device', {
      deviceType,
      page,
      size,
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
