CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    roll_no VARCHAR(50) UNIQUE NOT NULL,
    branch VARCHAR(100),
    course VARCHAR(100),
    college VARCHAR(255),
    semester VARCHAR(20),
    graduation_year VARCHAR(10),
    career_path VARCHAR(100),
    about TEXT,
    followers INTEGER DEFAULT 0,
    following INTEGER DEFAULT 0,
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE interests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    image_url TEXT,
    visibility VARCHAR(20) DEFAULT 'public',
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    reposts INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE post_tags (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id),
    tag VARCHAR(50) NOT NULL
);

CREATE TABLE work_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50) NOT NULL, -- 'PROJECT', 'PAPER', 'INTERNSHIP', 'EXTRACURRICULAR'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50),
    level VARCHAR(50),
    verified BOOLEAN DEFAULT false,
    faculty VARCHAR(255),
    company VARCHAR(255), -- for internships
    duration VARCHAR(50), -- for internships
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 