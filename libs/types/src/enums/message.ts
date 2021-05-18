export enum Message {
  ErrorGeneric = 'Oops! There was an error.',
  ErrorControl = 'Error with controls server.',
  ErrorVideoAnswer = 'Failed to create answer.',
  ErrorVideoRemote = 'Failed to set the remote description.',
  ErrorVideo = 'Error with video server',
  WarningPing = 'Oh snap! Herbie is close to an object.',
  InfoCannotControl = 'Only one client can be connected at a time.',
  InfoCanControl = 'You can control Herbie!',
  SuccessControl = 'Connected to controls server.'
}
