-- ==============================================================================
-- Schema Database untuk Sistem Absensi & Payroll (Geofencing Dinamis)
-- ==============================================================================

-- 1. Tabel Pengaturan Sistem (Panel Admin)
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL, -- Contoh: 'late_penalty_per_minute', 'overtime_rate_per_hour'
    setting_value VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Tabel Master Lokasi (Cabang/Pabrik/Kantor)
CREATE TABLE locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    radius_meters INT DEFAULT 100, -- Radius cakupan absen dalam meter
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Tabel Master Shift Kerja
CREATE TABLE shifts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- Contoh: 'Shift Pagi'
    start_time TIME NOT NULL,  -- '07:00:00'
    end_time TIME NOT NULL,    -- '15:00:00'
    late_tolerance_minutes INT DEFAULT 0, -- Toleransi telat (misal 15 menit)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Tabel Karyawan
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    shift_id INT,
    base_salary DECIMAL(15, 2) NOT NULL DEFAULT 0,
    daily_allowance DECIMAL(15, 2) NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE SET NULL
);

-- 5. Tabel Transaksi Absensi
CREATE TABLE attendances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    work_date DATE NOT NULL,
    
    -- Check In
    check_in_time DATETIME NULL,
    check_in_location_id INT NULL,
    check_in_photo_url VARCHAR(255) NULL,
    
    -- Check Out
    check_out_time DATETIME NULL,
    check_out_location_id INT NULL,
    check_out_photo_url VARCHAR(255) NULL,
    
    -- Kalkulasi Payroll (Telat & Lembur)
    late_minutes INT DEFAULT 0,
    overtime_minutes INT DEFAULT 0,
    is_overtime_approved BOOLEAN DEFAULT FALSE,
    
    status VARCHAR(50) DEFAULT 'Belum Absen', -- 'Tepat Waktu', 'Telat', 'Alpha'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (check_in_location_id) REFERENCES locations(id) ON DELETE SET NULL,
    FOREIGN KEY (check_out_location_id) REFERENCES locations(id) ON DELETE SET NULL,
    
    UNIQUE(employee_id, work_date) -- 1 Karyawan hanya punya 1 record absensi per hari
);

-- 6. Tabel Rekap Payroll Bulanan/Mingguan
CREATE TABLE payrolls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    base_salary_total DECIMAL(15, 2) NOT NULL DEFAULT 0,
    allowance_total DECIMAL(15, 2) NOT NULL DEFAULT 0,
    overtime_pay DECIMAL(15, 2) NOT NULL DEFAULT 0,
    deduction_total DECIMAL(15, 2) NOT NULL DEFAULT 0,
    net_salary DECIMAL(15, 2) NOT NULL DEFAULT 0,
    
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- ==============================================================================
-- Seeder (Data Awal)
-- ==============================================================================
INSERT INTO settings (setting_key, setting_value, description) VALUES
('late_penalty_per_minute', '1000', 'Potongan Rp 1.000 setiap telat 1 menit'),
('overtime_rate_per_hour', '25000', 'Uang lembur Rp 25.000 per jam');

INSERT INTO locations (name, latitude, longitude, radius_meters) VALUES
('Kantor Pusat', -6.200000, 106.816666, 100),
('Pabrik Cabang', -6.300000, 106.820000, 150);

INSERT INTO shifts (name, start_time, end_time, late_tolerance_minutes) VALUES
('Shift Pagi', '07:00:00', '15:00:00', 0);
