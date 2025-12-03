-- Insert Items
INSERT INTO public.items (id, name, image_url, rarity, price) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Dragon Lore', 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvN0_IP75jy2v8k5j42yvj1016WdIGwU7d_lkta0l_XwI7rXwG0Iu8F0j-qQ8Y2s2Vfm-0M5Ym2iLY6WIVc4Z1iC_1C_lOa615W7u52Yn3V9-n8', 'legendary', 2000),
('d290f1ee-6c54-4b01-90e6-d701748f0852', 'Asiimov', 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvN0_IP75jy2v8k5j42yvj1016WdIGwU7d_lkta0l_XwI7rXwG0Iu8F0j-qQ8Y2s2Vfm-0M5Ym2iLY6WIVc4Z1iC_1C_lOa615W7u52Yn3V9-n8', 'epic', 500),
('d290f1ee-6c54-4b01-90e6-d701748f0853', 'Redline', 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvN0_IP75jy2v8k5j42yvj1016WdIGwU7d_lkta0l_XwI7rXwG0Iu8F0j-qQ8Y2s2Vfm-0M5Ym2iLY6WIVc4Z1iC_1C_lOa615W7u52Yn3V9-n8', 'rare', 50),
('d290f1ee-6c54-4b01-90e6-d701748f0854', 'Safari Mesh', 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvN0_IP75jy2v8k5j42yvj1016WdIGwU7d_lkta0l_XwI7rXwG0Iu8F0j-qQ8Y2s2Vfm-0M5Ym2iLY6WIVc4Z1iC_1C_lOa615W7u52Yn3V9-n8', 'common', 1);

-- Insert Cases
INSERT INTO public.cases (id, name, slug, price, image_url, description) VALUES
('c290f1ee-6c54-4b01-90e6-d701748f0851', 'Dragon Case', 'dragon-case', 10, 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvN0_IP75jy2v8k5j42yvj1016WdIGwU7d_lkta0l_XwI7rXwG0Iu8F0j-qQ8Y2s2Vfm-0M5Ym2iLY6WIVc4Z1iC_1C_lOa615W7u52Yn3V9-n8', 'Contains the legendary Dragon Lore.'),
('c290f1ee-6c54-4b01-90e6-d701748f0852', 'Budget Case', 'budget-case', 1, 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvN0_IP75jy2v8k5j42yvj1016WdIGwU7d_lkta0l_XwI7rXwG0Iu8F0j-qQ8Y2s2Vfm-0M5Ym2iLY6WIVc4Z1iC_1C_lOa615W7u52Yn3V9-n8', 'Cheap case for beginners.');

-- Link Items to Cases
INSERT INTO public.case_items (case_id, item_id, drop_chance) VALUES
('c290f1ee-6c54-4b01-90e6-d701748f0851', 'd290f1ee-6c54-4b01-90e6-d701748f0851', 0.5), -- Dragon Lore in Dragon Case
('c290f1ee-6c54-4b01-90e6-d701748f0851', 'd290f1ee-6c54-4b01-90e6-d701748f0852', 5),
('c290f1ee-6c54-4b01-90e6-d701748f0851', 'd290f1ee-6c54-4b01-90e6-d701748f0853', 20),
('c290f1ee-6c54-4b01-90e6-d701748f0851', 'd290f1ee-6c54-4b01-90e6-d701748f0854', 74.5),

('c290f1ee-6c54-4b01-90e6-d701748f0852', 'd290f1ee-6c54-4b01-90e6-d701748f0853', 1), -- Redline in Budget Case
('c290f1ee-6c54-4b01-90e6-d701748f0852', 'd290f1ee-6c54-4b01-90e6-d701748f0854', 99);
