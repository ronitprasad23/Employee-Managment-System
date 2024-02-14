CREATE TABLE user1 (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(60) UNIQUE NOT NULL,
    password VARCHAR(20) NOT NULL
);  

