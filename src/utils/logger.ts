/**
 * Logging utility that respects environment settings
 * In development: Shows all logs
 * In production: Only shows errors and warnings
 */

/* eslint-disable no-console */

interface Logger {
  log: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
  info: (...args: unknown[]) => void
}

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger: Logger = {
  log: isDevelopment ? console.log : () => {},
  warn: isDevelopment ? console.warn : () => {},
  error: console.error, // Always keep errors in production
  info: isDevelopment ? console.info : () => {},
}

/**
 * Educational logging for tutorial examples
 * These logs are intentionally kept for educational purposes
 */
export const tutorialLogger = {
  log: console.log, // Educational logs should always show
  warn: console.warn,
  error: console.error,
  info: console.info,
}

export default logger
