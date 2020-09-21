import {Joi} from "celebrate";


describe('Joi validation', () => {
    it('Empty optional string does not validate', () => {
        expect(Joi.string().optional().validate('').error.message).toBe('\"value\" is not allowed to be empty');
        expect(Joi.string().optional().validate(null).error.message).toBe('\"value\" must be a string');
        expect(Joi.string().optional().validate(false).error.message).toBe('\"value\" must be a string');
        expect(Joi.string().optional().validate(undefined)).toStrictEqual({"value": undefined});
    });
    it('Too short optional string does not validate', () => {
        expect(Joi.string().min(12).optional().validate('abc').error.message).toBe('\"value\" length must be at least 12 characters long');
    });
});