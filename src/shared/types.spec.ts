import {
  unwrapInvalidData,
  zodNonEmptyStringWithUpto255LettersOrNumbers,
  zodNullOrUndefined,
  zodStringWithLettersOrNumbers,
} from './types';

const stringWith254Characters =
  'LoremipsumdolorsitametconsectetueradipiscingelitAeneancommodoligulaegetdolorAeneanmassaCumsociisnatoquepenatibusetmagnisdisparturientmontesnasceturridiculusmusDonecquamfelisultriciesnecpellentesqueeupretiumquissemNullaconsequatmasjshdueoldhadwiurfmfkvius';

describe('types', () => {
  describe('zodStringWithLettersOrNumbers', () => {
    it.each(['', 'string'])(
      'unwraps %p as valid string',
      async (params: unknown) => {
        const hasInvalidParams = unwrapInvalidData(
          zodStringWithLettersOrNumbers,
        )(params);

        expect(hasInvalidParams).toBe(false);
      },
    );

    it.each([
      ['string#'],
      ['_string'],
      ['string:'],
      [';string'],
      ['string@'],
      ['string with spaces'],
    ])('unwraps %p as invalid string', (params: unknown) => {
      const hasInvalidParams = unwrapInvalidData(zodStringWithLettersOrNumbers)(
        params,
      );

      expect(hasInvalidParams).toBe(true);
    });
  });

  describe('nonEmptyStringWithUpto255LettersOrNumbers', () => {
    it.each([
      [
        'unwraps `more than 255 characters` as invalid string',
        stringWith254Characters + 'abcdef',
        false,
      ],
      [
        'unwraps `less than 255 characters` as valid string',
        stringWith254Characters,
        true,
      ],
    ])('%s', (_case: string, params: unknown, valid: boolean) => {
      const hasInvalidParams = unwrapInvalidData(
        zodNonEmptyStringWithUpto255LettersOrNumbers,
      )(params);

      expect(hasInvalidParams).toBe(!valid);
    });
  });

  describe('zodNullOrUndefined', () => {
    it.each([
      ['null', null],
      ['undefined', undefined],
    ])('accepts %p', (_case: string, value?: null) => {
      const hasInvalidParams = unwrapInvalidData(zodNullOrUndefined)(value);

      expect(hasInvalidParams).toBe(false);
    });

    it.each([
      ['object', {}],
      ['string', 'randomString'],
      ['number', 12348763546],
    ])(
      'rejects non null or undefined %p (%p)',
      (_case: string, value: unknown) => {
        const hasInvalidParams = unwrapInvalidData(zodNullOrUndefined)(value);

        expect(hasInvalidParams).toBe(true);
      },
    );
  });
});
