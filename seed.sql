-- ═══════════════════════════════════════════════════
-- SEED DATA — Alex Rivera Portfolio
-- Run this after supabase-schema.sql
-- ═══════════════════════════════════════════════════

-- Profile
INSERT INTO profiles (
  full_name, roles, location, availability, bio, email,
  github_url, linkedin_url, twitter_url, website_url,
  years_experience, projects_count, clients_count, accent_color
) VALUES (
  'Alex Rivera',
  ARRAY['Full-Stack Developer', 'UI/UX Designer', 'Creative Technologist'],
  'San Francisco, CA',
  true,
  'A passionate full-stack developer with 5+ years crafting digital experiences at the intersection of design and engineering. I believe in the power of clean code, thoughtful design, and seamless user experiences to transform ideas into impactful products.',
  'alex@portfolio.dev',
  'https://github.com/alexrivera',
  'https://linkedin.com/in/alexrivera',
  'https://twitter.com/alexrivera',
  'https://alexrivera.dev',
  5, 47, 12, '#00d4ff'
);

-- Projects
INSERT INTO projects (name, description, long_description, tags, featured, sort_order) VALUES
(
  'NexaFlow',
  'A next-generation SaaS analytics platform with real-time data visualization, AI-powered insights, and collaborative dashboards.',
  'NexaFlow revolutionizes how teams interact with their data. Built with a modern stack featuring Next.js, D3.js, and PostgreSQL, it processes millions of events in real-time and presents actionable insights through beautiful, interactive visualizations. The platform includes AI-powered anomaly detection, custom dashboard builder, and team collaboration features.',
  ARRAY['Next.js', 'TypeScript', 'D3.js', 'PostgreSQL', 'Redis', 'AI/ML'],
  true,
  0
),
(
  'Orbital',
  'A 3D product configurator enabling real-time customization of physical products with photorealistic rendering.',
  'Orbital brings e-commerce product customization to the next level. Using Three.js and WebGL, customers can rotate, zoom, and customize products in 3D with photorealistic materials and lighting. The configurator supports custom textures, colors, and component swapping with instant visual feedback.',
  ARRAY['Three.js', 'React', 'WebGL', 'Node.js', 'AWS'],
  false,
  1
),
(
  'Pulsify',
  'A real-time collaborative music creation platform where artists can compose, mix, and produce together from anywhere.',
  'Pulsify enables musicians to collaborate in real-time, regardless of location. Built on WebRTC and Web Audio API, it provides a professional-grade DAW experience in the browser with sub-10ms latency audio streaming, MIDI support, and a library of virtual instruments.',
  ARRAY['React', 'WebRTC', 'Web Audio API', 'Socket.io', 'MongoDB'],
  false,
  2
);

-- Experience
INSERT INTO experience (type, title, organization, location, start_date, end_date, is_current, description, tags, sort_order) VALUES
(
  'experience',
  'Senior Frontend Engineer',
  'Stripe',
  'San Francisco, CA',
  '2020-06-01',
  NULL,
  true,
  'Leading the development of Stripe''s next-generation payment dashboard. Architecting component systems, implementing complex data visualizations, and mentoring a team of 5 engineers. Reduced dashboard load time by 40% through strategic code splitting and caching.',
  ARRAY['React', 'TypeScript', 'GraphQL', 'D3.js'],
  0
),
(
  'formation',
  'M.Sc. Computer Science',
  'Stanford University',
  'Stanford, CA',
  '2018-09-01',
  '2020-06-01',
  false,
  'Specialized in Human-Computer Interaction and Machine Learning. Published research on adaptive user interfaces. Dean''s List with 3.9 GPA.',
  ARRAY['HCI', 'Machine Learning', 'Research'],
  1
),
(
  'formation',
  'Full-Stack Web Development Bootcamp',
  'Le Wagon',
  'Paris, France',
  '2017-01-15',
  '2017-04-15',
  false,
  'Intensive 12-week coding bootcamp covering Ruby on Rails, JavaScript, HTML/CSS, databases, and deployment. Built 3 full-stack applications including a marketplace and a booking platform.',
  ARRAY['Ruby on Rails', 'JavaScript', 'PostgreSQL'],
  2
);

-- Certifications
INSERT INTO certifications (name, issuer, issue_date, expiry_date, credential_id, verify_url, sort_order) VALUES
(
  'AWS Solutions Architect – Associate',
  'Amazon Web Services',
  '2023-03-15',
  '2026-03-15',
  'AWS-SAA-2023-XXXXX',
  'https://aws.amazon.com/verification',
  0
),
(
  'Google UX Design Professional Certificate',
  'Google',
  '2022-08-20',
  NULL,
  'GOOGLE-UX-2022-XXXXX',
  'https://www.credly.com/verify',
  1
),
(
  'Meta Frontend Developer Professional Certificate',
  'Meta',
  '2022-11-10',
  NULL,
  'META-FE-2022-XXXXX',
  'https://www.coursera.org/verify',
  2
);

-- Skills
INSERT INTO skills (name, category, level, sort_order) VALUES
('JavaScript', 'skill', 'Expert', 0),
('TypeScript', 'skill', 'Expert', 1),
('React', 'tech', 'Expert', 2),
('Vue.js', 'tech', 'Advanced', 3),
('Node.js', 'tech', 'Advanced', 4),
('Python', 'skill', 'Intermediate', 5),
('Figma', 'tech', 'Expert', 6),
('Docker', 'tech', 'Intermediate', 7);
