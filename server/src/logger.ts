import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.colorize({
      all: true
    }),
    winston.format.label({
      label: '[LOGGER]'
    }),
    winston.format.timestamp({
      format: 'MM-DD-YY HH:MM:SS'
    }),
    winston.format.printf((info) => ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`)
  ),
  transports: [new winston.transports.Console()]
});
