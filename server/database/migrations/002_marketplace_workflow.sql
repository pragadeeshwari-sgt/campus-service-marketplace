BEGIN;

-- Upgrade the existing user table without changing its keys or stored rows.
ALTER TABLE users
  ADD COLUMN bio TEXT,
  ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD CONSTRAINT users_full_name_not_blank CHECK (BTRIM(full_name) <> ''),
  ADD CONSTRAINT users_email_not_blank CHECK (BTRIM(email) <> ''),
  ADD CONSTRAINT users_campus_not_blank CHECK (BTRIM(campus) <> '');

CREATE UNIQUE INDEX users_email_lower_unique_idx
  ON users (LOWER(email));

-- The existing services table already has its integer primary key and
-- provider foreign key. Preserve both while adding the missing safeguards.
ALTER TABLE services
  ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ALTER COLUMN status SET NOT NULL,
  ADD CONSTRAINT services_title_not_blank CHECK (BTRIM(title) <> ''),
  ADD CONSTRAINT services_description_not_blank CHECK (BTRIM(description) <> ''),
  ADD CONSTRAINT services_category_not_blank CHECK (BTRIM(category) <> ''),
  ADD CONSTRAINT services_price_non_negative CHECK (price >= 0),
  ADD CONSTRAINT services_status_valid CHECK (
    status IN ('active', 'inactive', 'archived', 'flagged')
  );

CREATE INDEX services_status_created_at_idx
  ON services (status, created_at DESC);

CREATE INDEX services_provider_created_at_idx
  ON services (provider_id, created_at DESC);

CREATE INDEX services_category_status_created_at_idx
  ON services (category, status, created_at DESC);

-- Use INTEGER keys here to match the existing users and services primary keys.
CREATE TABLE service_requests (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  service_id INTEGER NOT NULL REFERENCES services(id),
  requester_id INTEGER NOT NULL REFERENCES users(id),
  provider_id INTEGER NOT NULL REFERENCES users(id),
  status VARCHAR(20) NOT NULL DEFAULT 'REQUESTED',
  notes TEXT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  in_progress_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT service_requests_requester_not_provider CHECK (
    requester_id <> provider_id
  ),
  CONSTRAINT service_requests_status_valid CHECK (
    status IN (
      'REQUESTED',
      'ACCEPTED',
      'IN_PROGRESS',
      'COMPLETED',
      'REVIEWED',
      'REJECTED',
      'CANCELLED'
    )
  )
);

CREATE INDEX service_requests_requester_requested_at_idx
  ON service_requests (requester_id, requested_at DESC);

CREATE INDEX service_requests_provider_status_requested_at_idx
  ON service_requests (provider_id, status, requested_at DESC);

CREATE INDEX service_requests_service_requested_at_idx
  ON service_requests (service_id, requested_at DESC);

CREATE TABLE reviews (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  service_request_id INTEGER NOT NULL UNIQUE REFERENCES service_requests(id),
  reviewer_id INTEGER NOT NULL REFERENCES users(id),
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX reviews_reviewer_created_at_idx
  ON reviews (reviewer_id, created_at DESC);

COMMIT;
