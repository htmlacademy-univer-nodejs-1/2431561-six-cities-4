export const CreateUserMessages = {
  email: {
    invalidFormat: 'email must be a valid address',
  },
  avatar: {
    invalidFormat: 'avatar value must be string',
    invalidExtension: 'avatar must be .jpg or .png format',
  },
  name: {
    invalidFormat: 'name value must be string',
    lengthField: 'min length is 1, max is 15',
  },
  type: {
    invalidType: 'type must be "обычный" or "pro" only',
  },
  password: {
    invalidFormat: 'password is required and must be string',
    lengthField: 'min length is 6, max is 12',
  },
} as const;
