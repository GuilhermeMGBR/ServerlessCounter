export const selectIdSql = `
SELECT id
FROM Counter C
WHERE (ISNULL(C.deleted) OR C.deleted = FALSE)
  AND namespace = ? AND name = ?
`;

export const selectHitCountSql = `
SELECT COUNT(1) AS hits
FROM CounterHit CH
  INNER JOIN Counter C ON C.id = CH.counterId
WHERE (ISNULL(C.deleted) OR C.deleted = FALSE)
  AND (ISNULL(CH.deleted) OR CH.deleted = FALSE)
`;

export const insertCounterSql = `
INSERT INTO Counter (namespace, name, createdAt)
  VALUES (?, ?, UTC_TIMESTAMP())
`;

export const insertCounterHitSql = `
INSERT INTO CounterHit (counterId, hitAt)
  VALUES (?, UTC_TIMESTAMP())
`;
