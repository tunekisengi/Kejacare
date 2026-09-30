insert into public.profiles (id, role, name, phone, avatar_url, id_number, is_verified, rating, price_per_day, skills, location_lat, location_lng, is_online)
values
  ('11111111-1111-4111-8111-111111111111', 'fundi', 'Amina Wanjiku', '+254700000001', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', '23456789', true, 4.9, 800, ARRAY['cleaning'], -1.3733, 37.9709, true),
  ('22222222-2222-4222-8222-222222222222', 'fundi', 'James Kilonzo', '+254700000002', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', '23456790', true, 4.8, 1200, ARRAY['plumbing'], -1.3712, 37.9822, true),
  ('33333333-3333-4333-8333-333333333333', 'fundi', 'Salma Njeri', '+254700000003', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80', '23456791', true, 4.7, 900, ARRAY['cleaning', 'repair'], -1.3675, 37.9638, false),
  ('44444444-4444-4444-8444-444444444444', 'fundi', 'Daniel Mutua', '+254700000004', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80', '23456792', false, 4.6, 1300, ARRAY['electrical'], -1.3796, 37.9651, true),
  ('55555555-5555-4555-8555-555555555555', 'fundi', 'Miriam Kaluki', '+254700000005', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', '23456793', true, 5.0, 950, ARRAY['cleaning', 'moving'], -1.3759, 37.9685, true),
  ('66666666-6666-4666-8666-666666666666', 'fundi', 'Patrick Kiio', '+254700000006', 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=200&q=80', '23456794', true, 4.9, 1500, ARRAY['gas'], -1.3635, 37.9778, true),
  ('77777777-7777-4777-8777-777777777777', 'fundi', 'Rose Muthoni', '+254700000007', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80', '23456795', true, 4.7, 1100, ARRAY['repair', 'electrical'], -1.3818, 37.9789, true),
  ('88888888-8888-4888-8888-888888888888', 'fundi', 'Simon Nzioka', '+254700000008', 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=200&q=80', '23456796', false, 4.5, 1400, ARRAY['plumbing', 'gas'], -1.3703, 37.9558, false),
  ('99999999-9999-4999-8999-999999999999', 'fundi', 'Faith Kivuva', '+254700000009', 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=200&q=80', '23456797', true, 4.8, 1250, ARRAY['moving'], -1.3748, 37.9740, true),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'fundi', 'Martin Musyoki', '+254700000010', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', '23456798', true, 4.9, 1350, ARRAY['repair', 'electrical'], -1.3694, 37.9616, true);

insert into public.profiles (id, role, name, phone, avatar_url, is_verified, rating, is_online)
values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'client', 'Grace Mumo', '+254700000011', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', true, 4.8, true),
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'admin', 'KejaCare Admin', '+254700000012', null, true, 5.0, true);
