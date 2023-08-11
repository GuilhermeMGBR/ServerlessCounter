import {
  replaceIsNullFunction,
  replaceUtcTimestamp,
} from '@shared/SqlTest.utils';

describe('SqlTest.utils', () => {
  it.each([
    [
      'one occurrence',
      'SELECT column1, column2, UTC_TIMESTAMP() FROM TableX;',
      "SELECT column1, column2, datetime('now') FROM TableX;",
    ],
    [
      'multiple occurrences',
      'INSERT INTO TableX (eventDate, lastEventDate) VALUES (UTC_TIMESTAMP(), UTC_TIMESTAMP())',
      "INSERT INTO TableX (eventDate, lastEventDate) VALUES (datetime('now'), datetime('now'))",
    ],
  ])(
    'Replaces UTC_TIMESTAMP() with SQLite`s compatible alternative (%s)',
    (_case: string, input: string, expectedResult: string) => {
      const result = replaceUtcTimestamp(input);

      expect(result).toBe(expectedResult);
    },
  );

  it.each([
    [
      'one occurrence',
      'SELECT * FROM TableX WHERE (ISNULL(deleted) OR deleted = FALSE)',
      'SELECT * FROM TableX WHERE (deleted IS NULL OR deleted = FALSE)',
    ],
    [
      'multiple occurrences',
      "INSERT INTO TableX (value1, value2) VALUES (ISNULL('ABCD'), ISNULL(2))",
      "INSERT INTO TableX (value1, value2) VALUES ('ABCD' IS NULL, 2 IS NULL)",
    ],
  ])(
    'Replaces ISNULL() with SQLite`s compatible alternative (%s)',
    (_case: string, input: string, expectedResult: string) => {
      const result = replaceIsNullFunction(input);

      expect(result).toBe(expectedResult);
    },
  );
});
