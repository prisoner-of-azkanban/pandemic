import * as yup from 'yup'

export function randomNumGenerator() {
  return Math.floor(Math.random() * 1000000000 + 1)
}
