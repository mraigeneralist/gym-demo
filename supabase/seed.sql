-- ============================================================
-- GymDemo: Seed Data
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- TRAINERS (3 profiles)
-- ============================================================
insert into trainers (id, name, bio, photo_url, specialties) values
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Marcus Johnson', 'Former professional athlete with 10+ years of coaching experience. Specializes in high-intensity functional training and sports performance.', null, array['HIIT', 'Strength Training', 'Sports Performance']),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Sarah Chen', 'Certified yoga instructor and wellness coach. Passionate about mindfulness, flexibility, and holistic fitness approaches.', null, array['Yoga', 'Pilates', 'Meditation', 'Flexibility']),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'Diego Martinez', 'Professional boxing coach and certified personal trainer. Brings energy and discipline to every session.', null, array['Boxing', 'Kickboxing', 'Cardio', 'Spin']);

-- ============================================================
-- CLASSES (5 per week — recurring schedule)
-- ============================================================
insert into classes (id, name, type, instructor_id, day_of_week, start_time, end_time, capacity, description) values
  -- Monday
  ('b1b2c3d4-0001-4000-8000-000000000001', 'Spin Surge', 'Spin', 'a1b2c3d4-0003-4000-8000-000000000003', 1, '06:30', '07:15', 20, 'High-energy spin class with interval training. All fitness levels welcome.'),
  ('b1b2c3d4-0002-4000-8000-000000000002', 'HIIT Blast', 'HIIT', 'a1b2c3d4-0001-4000-8000-000000000001', 1, '17:30', '18:15', 25, 'Full-body high-intensity interval training. Burn calories and build strength.'),
  -- Tuesday
  ('b1b2c3d4-0003-4000-8000-000000000003', 'Yoga Flow', 'Yoga', 'a1b2c3d4-0002-4000-8000-000000000002', 2, '07:00', '08:00', 15, 'Vinyasa flow class focusing on breath, movement, and flexibility.'),
  ('b1b2c3d4-0004-4000-8000-000000000004', 'Boxing Fundamentals', 'Boxing', 'a1b2c3d4-0003-4000-8000-000000000003', 2, '18:00', '19:00', 20, 'Learn proper boxing technique while getting an incredible workout.'),
  -- Wednesday
  ('b1b2c3d4-0005-4000-8000-000000000005', 'Strength Lab', 'Strength', 'a1b2c3d4-0001-4000-8000-000000000001', 3, '06:00', '07:00', 15, 'Structured strength training with progressive overload principles.'),
  ('b1b2c3d4-0006-4000-8000-000000000006', 'Spin Surge', 'Spin', 'a1b2c3d4-0003-4000-8000-000000000003', 3, '17:30', '18:15', 20, 'High-energy spin class with interval training.'),
  -- Thursday
  ('b1b2c3d4-0007-4000-8000-000000000007', 'HIIT Blast', 'HIIT', 'a1b2c3d4-0001-4000-8000-000000000001', 4, '06:30', '07:15', 25, 'Full-body HIIT to start your day strong.'),
  ('b1b2c3d4-0008-4000-8000-000000000008', 'Yoga Flow', 'Yoga', 'a1b2c3d4-0002-4000-8000-000000000002', 4, '18:00', '19:00', 15, 'Evening vinyasa flow to unwind and stretch.'),
  -- Friday
  ('b1b2c3d4-0009-4000-8000-000000000009', 'Boxing Fundamentals', 'Boxing', 'a1b2c3d4-0003-4000-8000-000000000003', 5, '17:00', '18:00', 20, 'End the week with an intense boxing session.'),
  ('b1b2c3d4-0010-4000-8000-000000000010', 'Strength Lab', 'Strength', 'a1b2c3d4-0001-4000-8000-000000000001', 5, '07:00', '08:00', 15, 'Friday strength training — progressive overload focus.'),
  -- Saturday
  ('b1b2c3d4-0011-4000-8000-000000000011', 'Weekend Warrior HIIT', 'HIIT', 'a1b2c3d4-0001-4000-8000-000000000001', 6, '09:00', '10:00', 30, 'Big Saturday HIIT session. All levels, maximum effort.'),
  ('b1b2c3d4-0012-4000-8000-000000000012', 'Restorative Yoga', 'Yoga', 'a1b2c3d4-0002-4000-8000-000000000002', 6, '10:30', '11:30', 15, 'Gentle restorative yoga to recover and recharge.');

-- ============================================================
-- WORKOUTS OF THE DAY (2 weeks: Apr 2 - Apr 15, 2026)
-- ============================================================
insert into workouts_of_day (date, title, description, exercises) values
  ('2026-04-02', 'Full Body Burn', 'A balanced full-body workout to start the week.',
   '[{"name":"Barbell Squats","sets":4,"reps":"8-10","notes":"Focus on depth"},{"name":"Bench Press","sets":4,"reps":"8-10"},{"name":"Bent-Over Rows","sets":3,"reps":"10-12"},{"name":"Overhead Press","sets":3,"reps":"10"},{"name":"Plank","sets":3,"reps":"60 sec"}]'),
  ('2026-04-03', 'Cardio Crusher', 'High-intensity cardio circuit.',
   '[{"name":"Burpees","sets":4,"reps":"15"},{"name":"Mountain Climbers","sets":4,"reps":"20 each"},{"name":"Jump Squats","sets":3,"reps":"15"},{"name":"High Knees","sets":3,"reps":"30 sec"},{"name":"Box Jumps","sets":3,"reps":"12"}]'),
  ('2026-04-04', 'Upper Body Strength', 'Push and pull focused upper body day.',
   '[{"name":"Pull-Ups","sets":4,"reps":"8-10","notes":"Use bands if needed"},{"name":"Dumbbell Bench Press","sets":4,"reps":"10"},{"name":"Cable Rows","sets":3,"reps":"12"},{"name":"Lateral Raises","sets":3,"reps":"15"},{"name":"Tricep Dips","sets":3,"reps":"12"}]'),
  ('2026-04-05', 'Leg Day', 'Build strength and power in your lower body.',
   '[{"name":"Deadlifts","sets":4,"reps":"6-8","notes":"Heavy but controlled"},{"name":"Leg Press","sets":4,"reps":"10-12"},{"name":"Walking Lunges","sets":3,"reps":"12 each"},{"name":"Leg Curls","sets":3,"reps":"12"},{"name":"Calf Raises","sets":4,"reps":"15"}]'),
  ('2026-04-06', 'Core & Conditioning', 'Core stability and metabolic conditioning.',
   '[{"name":"Turkish Get-Ups","sets":3,"reps":"5 each"},{"name":"Russian Twists","sets":3,"reps":"20"},{"name":"Hanging Leg Raises","sets":3,"reps":"12"},{"name":"Kettlebell Swings","sets":4,"reps":"15"},{"name":"Dead Bugs","sets":3,"reps":"10 each"}]'),
  ('2026-04-07', 'Active Recovery', 'Light movement and mobility work.',
   '[{"name":"Foam Rolling","sets":1,"reps":"10 min"},{"name":"Hip Openers","sets":2,"reps":"10 each"},{"name":"Cat-Cow Stretches","sets":2,"reps":"10"},{"name":"Light Walk or Jog","sets":1,"reps":"20 min"}]'),
  ('2026-04-08', 'Push Day', 'Chest, shoulders, and triceps focus.',
   '[{"name":"Incline Bench Press","sets":4,"reps":"8-10"},{"name":"Dumbbell Shoulder Press","sets":4,"reps":"10"},{"name":"Cable Flyes","sets":3,"reps":"12"},{"name":"Skull Crushers","sets":3,"reps":"12"},{"name":"Push-Ups","sets":3,"reps":"To failure"}]'),
  ('2026-04-09', 'Pull Day', 'Back and biceps emphasis.',
   '[{"name":"Barbell Rows","sets":4,"reps":"8-10"},{"name":"Lat Pulldowns","sets":4,"reps":"10-12"},{"name":"Face Pulls","sets":3,"reps":"15"},{"name":"Barbell Curls","sets":3,"reps":"12"},{"name":"Hammer Curls","sets":3,"reps":"12"}]'),
  ('2026-04-10', 'AMRAP Challenge', 'As Many Rounds As Possible in 20 minutes.',
   '[{"name":"Thrusters","sets":1,"reps":"10","notes":"AMRAP 20 min"},{"name":"Pull-Ups","sets":1,"reps":"8"},{"name":"Box Jumps","sets":1,"reps":"12"},{"name":"Kettlebell Swings","sets":1,"reps":"15"}]'),
  ('2026-04-11', 'Lower Body Power', 'Explosive lower body training.',
   '[{"name":"Front Squats","sets":4,"reps":"6-8"},{"name":"Romanian Deadlifts","sets":4,"reps":"10"},{"name":"Bulgarian Split Squats","sets":3,"reps":"10 each"},{"name":"Box Jumps","sets":3,"reps":"8"},{"name":"Goblet Squats","sets":3,"reps":"12"}]'),
  ('2026-04-12', 'Full Body Circuit', 'Total body circuit training.',
   '[{"name":"Clean and Press","sets":4,"reps":"8"},{"name":"Renegade Rows","sets":3,"reps":"10 each"},{"name":"Step-Ups","sets":3,"reps":"12 each"},{"name":"Plank to Push-Up","sets":3,"reps":"10"},{"name":"Farmers Walk","sets":3,"reps":"40m"}]'),
  ('2026-04-13', 'Mobility & Stretch', 'Dedicated mobility session.',
   '[{"name":"World Greatest Stretch","sets":2,"reps":"5 each"},{"name":"Pigeon Pose","sets":2,"reps":"60 sec each"},{"name":"Thoracic Spine Rotation","sets":2,"reps":"10 each"},{"name":"Yoga Flow","sets":1,"reps":"15 min"}]'),
  ('2026-04-14', 'Strength Benchmark', 'Test your major lifts.',
   '[{"name":"Back Squat","sets":5,"reps":"5","notes":"Work up to heavy 5"},{"name":"Bench Press","sets":5,"reps":"5","notes":"Work up to heavy 5"},{"name":"Deadlift","sets":3,"reps":"3","notes":"Work up to heavy 3"},{"name":"Overhead Press","sets":4,"reps":"6"}]'),
  ('2026-04-15', 'Metabolic Mayhem', 'High-intensity metabolic conditioning.',
   '[{"name":"Battle Ropes","sets":4,"reps":"30 sec"},{"name":"Sled Push","sets":4,"reps":"20m"},{"name":"Wall Balls","sets":4,"reps":"15"},{"name":"Assault Bike","sets":4,"reps":"30 sec max effort"},{"name":"Burpee Box Jumps","sets":3,"reps":"10"}]');

-- ============================================================
-- NOTE: Member profiles, memberships, bookings, and progress
-- logs require real auth.users entries. These will be created
-- when users sign up through the app. For demo purposes,
-- you can create test users via Supabase Auth dashboard and
-- then run the following with their actual UUIDs.
-- ============================================================

-- Example: After creating test users, run something like:
-- update profiles set role = 'admin' where id = '<your-admin-user-uuid>';
