CREATE TABLE CounterHit(  
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    counterId int NOT NULL,
    hitAtUtc DATETIME NOT NULL COMMENT 'Hit Time',
    deletedAtUtc DATETIME NULL COMMENT 'Delete Time',
    deleted BOOLEAN NULL
) COMMENT '';

CREATE INDEX idx_counterId
ON CounterHit (counterId);
