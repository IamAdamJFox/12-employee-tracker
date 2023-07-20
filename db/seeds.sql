INSERT INTO department(department_name)
VALUES 
('Healer'),
('Tank'),
('Damage'),
('Caster'),
('Flanker'),
('Moral Support');

INSERT INTO role(title, salary, department_id)
VALUES 
('Cleric', 100000.00, 1),
('Paladin', 120000.00, 2),
('Wizard', 180000.00, 4),
('Bard', 45000.00, 6),
('Barbarian', 200000.00, 2),
('Fighter', 12000.00, 3),
('Rogue', 70000.00, 6),
('Sorcerer', 170000.00, 4),
('Ranger', 90000.00, 5),
('Monk', 105000.00, 5);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
('Ezekiel', 'Swampstride', 1, 1),
('Rogal', 'Dorn', 2, 2),
('Teclis', 'Cothiquean', 3, 3),
('Bruce', 'Explosion', 4, 4),
('Strakov', 'Ivanov', 5, 5),
('Randalf', 'Oakenson', 6, 6),
('Sarah', 'White', 7, 7),
('Therius', 'Foothead', 8, 8),
('Tod', 'Becker', 9, 9),
('Dwarven', 'Mcdwarvefist', 10, 10);