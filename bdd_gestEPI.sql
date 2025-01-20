-- Création de la table userTypes
CREATE TABLE userTypes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    typeName VARCHAR(50) NOT NULL
);

-- Création de la table users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    userTypeId INT NOT NULL,
    FOREIGN KEY (userTypeId) REFERENCES userTypes(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Création de la table epiTypes
CREATE TABLE epiTypes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    typeName VARCHAR(50) NOT NULL,
    isTextile BOOLEAN NOT NULL
);

-- Création de la table epiStatus
CREATE TABLE epiStatus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    statusName VARCHAR(50) NOT NULL
);

-- Création de la table epi
CREATE TABLE epi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    serialNumber VARCHAR(100) UNIQUE NOT NULL,
    size VARCHAR(10),
    color VARCHAR(20),
    purchaseDate DATE NOT NULL,
    manufactureDate DATE NOT NULL,
    serviceStartDate DATE NOT NULL,
    periodicity INT NOT NULL,
    epiTypeId INT NOT NULL,
    statusId INT NOT NULL,
    endOfLifeDate DATE,
    FOREIGN KEY (epiTypeId) REFERENCES epiTypes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (statusId) REFERENCES epiStatus(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Création de la table epi_Check
CREATE TABLE epi_Check (
    id INT AUTO_INCREMENT PRIMARY KEY,
    checkDate DATE NOT NULL,
    userId INT NOT NULL,
    epiId INT NOT NULL,
    statusId INT NOT NULL,
    remarks TEXT,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (epiId) REFERENCES epi(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (statusId) REFERENCES epiStatus(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insertion des données initiales pour epiStatus
INSERT INTO epiStatus (statusName) VALUES 
('Opérationnel'),
('À réparer'),
('Mis au rebut');

-- Insertion des données initiales pour epiTypes
INSERT INTO epiTypes (typeName, isTextile) VALUES 
('Corde', TRUE),
('Casque', FALSE),
('Baudrier', TRUE),
('Sangle', TRUE),
('Mousqueton', FALSE);
