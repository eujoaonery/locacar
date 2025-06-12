
UPDATE categories SET 
  name = 'Econômico',
  description = 'Veículos compactos econômicos'
WHERE name = 'Economy';

UPDATE categories SET 
  name = 'Compacto',
  description = 'Veículos compactos com boa economia de combustível'
WHERE name = 'Compact';

UPDATE categories SET 
  name = 'Intermediário',
  description = 'Veículos de porte médio com mais espaço'
WHERE name = 'Intermediate';

UPDATE categories SET 
  name = 'Grande',
  description = 'Veículos maiores com mais conforto'
WHERE name = 'Full Size';

UPDATE categories SET 
  name = 'Premium',
  description = 'Veículos de luxo com todos os opcionais'
WHERE name = 'Premium';

UPDATE categories SET 
  name = 'SUV',
  description = 'Utilitários esportivos com mais espaço e praticidade'
WHERE name = 'SUV';

UPDATE statuses SET
  name = 'Disponível',
  description = 'Veículo disponível para locação'
WHERE name = 'Available';

UPDATE statuses SET
  name = 'Alugado',
  description = 'Veículo atualmente alugado'
WHERE name = 'Rented';

UPDATE statuses SET
  name = 'Em Manutenção',
  description = 'Veículo em manutenção'
WHERE name = 'In Maintenance';

UPDATE statuses SET
  name = 'Reservado',
  description = 'Veículo reservado para futura locação'
WHERE name = 'Reserved';