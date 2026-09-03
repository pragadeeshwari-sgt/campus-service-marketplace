BEGIN;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS password_reset_tokens_user_id_idx
  ON password_reset_tokens (user_id);

CREATE INDEX IF NOT EXISTS password_reset_tokens_expires_at_idx
  ON password_reset_tokens (expires_at);

-- Provider records are inserted only when their email does not already exist.
-- The stored value is a bcrypt hash; no plaintext password is saved in the database.
INSERT INTO users (full_name, email, campus, password_hash)
SELECT provider.full_name, provider.email, provider.campus, provider.password_hash
FROM (
  VALUES
    ('Aanya Sharma', 'aanya.sharma@campusmarket.demo', 'Campus Community', '$2b$10$nSS/wmNXxFJcfynp1CTqeuXxHWiMwuYJE5puu4av4dLi4KAWxAXQW'),
    ('Rohan Mehta', 'rohan.mehta@campusmarket.demo', 'Campus Community', '$2b$10$nSS/wmNXxFJcfynp1CTqeuXxHWiMwuYJE5puu4av4dLi4KAWxAXQW'),
    ('Meera Iyer', 'meera.iyer@campusmarket.demo', 'Campus Community', '$2b$10$nSS/wmNXxFJcfynp1CTqeuXxHWiMwuYJE5puu4av4dLi4KAWxAXQW'),
    ('Kabir Singh', 'kabir.singh@campusmarket.demo', 'Campus Community', '$2b$10$nSS/wmNXxFJcfynp1CTqeuXxHWiMwuYJE5puu4av4dLi4KAWxAXQW')
) AS provider(full_name, email, campus, password_hash)
WHERE NOT EXISTS (SELECT 1 FROM users WHERE LOWER(users.email) = LOWER(provider.email));

INSERT INTO services (provider_id, title, description, category, price, status)
SELECT users.id, listing.title, listing.description, listing.category, listing.price, 'active'
FROM (
  VALUES
    ('aanya.sharma@campusmarket.demo', 'Python Tutoring', 'One-to-one help with Python fundamentals, assignments, and practical debugging.', 'Tutoring', 350),
    ('aanya.sharma@campusmarket.demo', 'Data Analysis with Excel', 'Clean spreadsheets, build useful summaries, and learn practical data analysis techniques.', 'Tutoring', 450),
    ('rohan.mehta@campusmarket.demo', 'Graphic Design', 'Polished posters, flyers, and event creatives tailored to your brief.', 'Graphic Design', 400),
    ('rohan.mehta@campusmarket.demo', 'Poster & Social Media Design', 'A coordinated set of social posts and a campaign poster for clubs and events.', 'Graphic Design', 500),
    ('rohan.mehta@campusmarket.demo', 'Presentation Design', 'Clear, professional slide design for class presentations, pitches, and workshops.', 'Graphic Design', 300),
    ('meera.iyer@campusmarket.demo', 'Event Photography', 'Natural event coverage with a curated set of edited campus photos.', 'Photography', 1200),
    ('meera.iyer@campusmarket.demo', 'Video Editing', 'Edit reels, interviews, and project videos with clean pacing and captions.', 'Video Editing', 650),
    ('meera.iyer@campusmarket.demo', 'Content Writing', 'Thoughtful copy for club announcements, blogs, captions, and student campaigns.', 'Writing', 300),
    ('kabir.singh@campusmarket.demo', 'Web Development', 'Build a responsive landing page or help improve an existing React project.', 'Technology', 900),
    ('kabir.singh@campusmarket.demo', 'Event Assistance', 'Reliable on-ground support for registrations, setup, coordination, and wrap-up.', 'Event Assistance', 250)
) AS listing(provider_email, title, description, category, price)
JOIN users ON LOWER(users.email) = LOWER(listing.provider_email)
WHERE NOT EXISTS (
  SELECT 1 FROM services
  WHERE services.provider_id = users.id AND services.title = listing.title
);

COMMIT;
