BEGIN;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(254) NOT NULL,
  campus VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  bio TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_full_name_not_blank CHECK (BTRIM(full_name) <> ''),
  CONSTRAINT users_campus_not_blank CHECK (BTRIM(campus) <> '')
);

CREATE UNIQUE INDEX users_email_lower_unique_idx
  ON users (LOWER(email));

CREATE TABLE services (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  provider_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT services_title_not_blank CHECK (BTRIM(title) <> ''),
  CONSTRAINT services_description_not_blank CHECK (BTRIM(description) <> ''),
  CONSTRAINT services_status_valid CHECK (
    status IN ('active', 'inactive', 'archived', 'flagged')
  )
);

CREATE INDEX services_status_created_at_idx
  ON services (status, created_at DESC);

CREATE INDEX services_provider_created_at_idx
  ON services (provider_id, created_at DESC);

CREATE INDEX services_category_status_created_at_idx
  ON services (category, status, created_at DESC);

CREATE TABLE service_requests (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  service_id BIGINT NOT NULL REFERENCES services(id),
  requester_id BIGINT NOT NULL REFERENCES users(id),
  provider_id BIGINT NOT NULL REFERENCES users(id),
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
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  service_request_id BIGINT NOT NULL UNIQUE REFERENCES service_requests(id),
  reviewer_id BIGINT NOT NULL REFERENCES users(id),
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX reviews_reviewer_created_at_idx
  ON reviews (reviewer_id, created_at DESC);

COMMIT;
