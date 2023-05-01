import Joi from 'joi'

export const fundInfoSchema = Joi.object({
  currentFund: Joi.object({
    id: Joi.number().required(),
    name: Joi.string()
      .pattern(/^Fund\d+$/)
      .required(),
    registrationStart: Joi.date().required(),
    registrationEnd: Joi.date().greater(Joi.ref('registrationStart')).required(),
    votingStart: Joi.date().greater(Joi.ref('registrationEnd')).required(),
    votingEnd: Joi.date().greater(Joi.ref('votingStart')).required(),
    votingPowerThreshold: Joi.string().pattern(/^\d+$/).required(),
  }),
})
