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

export const selectStatusSummarySql = `
SELECT
  SUM(case when (ISNULL(C.deleted) OR C.deleted = FALSE) then 1 else 0 end) as active,
  SUM(case when (C.deleted = TRUE) then 1 else 0 end) as deleted
FROM Counter C
WHERE ISNULL(?) OR C.namespace = ?
  AND (ISNULL(?) OR C.name = ?);
`;

export const selectActiveCountersSql = `
SELECT
  C.namespace,
  C.name,
  COUNT(CH.id) AS hits,
  C.createdAt,
  MAX(CH.hitAt) as lastHit
FROM Counter C
  LEFT JOIN CounterHit CH ON C.id = CH.counterId
WHERE (ISNULL(C.deleted) OR C.deleted = FALSE)
  AND (ISNULL(CH.deleted) OR CH.deleted = FALSE)
  AND (
    ISNULL(?)
    OR (
      C.namespace = ?
      AND (ISNULL(?) OR C.name = ?)
    )
  )
GROUP BY C.id;
`;
