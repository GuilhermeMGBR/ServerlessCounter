CREATE TABLE Counter(  
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    namespace VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    createdAtUtc DATETIME COMMENT 'Create Time',
    deletedAtUtc DATETIME COMMENT 'Delete Time',
    deleted BOOLEAN NULL
) COMMENT '';
