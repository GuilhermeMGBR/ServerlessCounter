CREATE TABLE CounterHit(  
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    counterId int NOT NULL,
    hitAtUtc DATETIME NOT NULL,
    deletedAtUtc DATETIME NULL,
    deleted BOOLEAN NULL
);

CREATE INDEX idx_counterId
ON CounterHit (counterId);
