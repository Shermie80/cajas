-- Remove seeded cases
DELETE FROM cases WHERE id IN (
  'c290f1ee-6c54-4b01-90e6-d701748f0851', -- Dragon Case
  'c290f1ee-6c54-4b01-90e6-d701748f0852'  -- Budget Case
);
