import { createError, defineEventHandler, readBody } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { appSecret, email, password } = body

  try {
    const response = await axios.post('https://globalapi.solarmanpv.com/account/v1.0/token?appId=3023092648151336', {
      appSecret,
      email,
      password
    })
    return response.data
  } catch (error) {
    throw createError({
      statusCode: error.response.status,
      statusMessage: error.response.data.message,
    })
  }
})