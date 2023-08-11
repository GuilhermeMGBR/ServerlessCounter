CREATE TABLE Counter(  
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    namespace VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    createdAtUtc DATETIME COMMENT 'Create Time',
    deletedAtUtc DATETIME COMMENT 'Delete Time',
    deleted BOOLEAN NULL
);
