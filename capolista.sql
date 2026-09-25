-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 24, 2026 at 02:54 PM
-- Server version: 10.11.10-MariaDB-log
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `capolista`
--

-- --------------------------------------------------------

--
-- Table structure for table `absensi`
--

CREATE TABLE `absensi` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `karyawan_id` bigint(20) UNSIGNED NOT NULL,
  `tanggal` date NOT NULL,
  `status_hadir` enum('hadir','izin','sakit','alpha') NOT NULL DEFAULT 'hadir',
  `jam_lembur` decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Jam lembur hari ini',
  `dicatat_oleh` bigint(20) UNSIGNED NOT NULL,
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `absensi`
--

INSERT INTO `absensi` (`id`, `karyawan_id`, `tanggal`, `status_hadir`, `jam_lembur`, `dicatat_oleh`, `keterangan`, `created_at`, `updated_at`) VALUES
(3, 29, '2026-09-19', 'hadir', 0.00, 1, NULL, '2026-09-19 05:55:39', '2026-09-19 05:55:39');

-- --------------------------------------------------------

--
-- Table structure for table `activity_log`
--

CREATE TABLE `activity_log` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `log_name` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `subject_type` varchar(255) DEFAULT NULL,
  `event` varchar(255) DEFAULT NULL,
  `subject_id` bigint(20) UNSIGNED DEFAULT NULL,
  `causer_type` varchar(255) DEFAULT NULL,
  `causer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `properties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`properties`)),
  `batch_uuid` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('capolista-system-cache-andricapolista@gmail.com|162.158.189.153', 'i:2;', 1790128465),
('capolista-system-cache-andricapolista@gmail.com|162.158.189.153:timer', 'i:1790128465;', 1790128465),
('capolista-system-cache-azharcapolista@gmail.com|162.158.88.2', 'i:1;', 1790219147),
('capolista-system-cache-azharcapolista@gmail.com|162.158.88.2:timer', 'i:1790219147;', 1790219147),
('capolista-system-cache-novicapolista@gmail.com|172.71.215.130', 'i:3;', 1790087660),
('capolista-system-cache-novicapolista@gmail.com|172.71.215.130:timer', 'i:1790087660;', 1790087660),
('capolista-system-cache-superadmin@capolista.com|162.158.186.219', 'i:1;', 1790087253),
('capolista-system-cache-superadmin@capolista.com|162.158.186.219:timer', 'i:1790087253;', 1790087253),
('capolista-system-cache-superadmin@capolista.com|162.158.187.73', 'i:1;', 1790087267),
('capolista-system-cache-superadmin@capolista.com|162.158.187.73:timer', 'i:1790087267;', 1790087267),
('capolista-system-cache-superadmin@gmail.com|172.71.124.10', 'i:1;', 1790168510),
('capolista-system-cache-superadmin@gmail.com|172.71.124.10:timer', 'i:1790168510;', 1790168510),
('capolista-system-cache-superadmin@gmail.com|172.71.81.175', 'i:1;', 1790168562),
('capolista-system-cache-superadmin@gmail.com|172.71.81.175:timer', 'i:1790168562;', 1790168562),
('capolista-system-cache-system_settings', 'a:8:{s:26:\"produksi.threshold.cutting\";s:1:\"2\";s:24:\"produksi.threshold.jahit\";s:1:\"7\";s:27:\"produksi.threshold.printing\";s:1:\"7\";s:29:\"produksi.threshold.pemasangan\";s:1:\"2\";s:12:\"company.name\";s:17:\"CAPOLISTA APPAREL\";s:15:\"company.address\";s:95:\"Jl. Jendral Sudirman No.105-140, Kota Kulon, Kec. Garut Kota, Kabupaten Garut, Jawa Barat 44112\";s:12:\"company.logo\";s:53:\"settings/iofgMyf218vT8bcHQvB8cDguFNg6D8nRc21OTGPE.png\";s:20:\"company.bank_account\";s:89:\"BCA: 1481509641 a.n. Andrie Achmad Gumilar/ BSI: 7189566039 BSI a.n Andrie Achmad Gumilar\";}', 1790231321),
('capolista-system-cache-zann1847@gmail.com|104.23.175.242', 'i:1;', 1790150704),
('capolista-system-cache-zann1847@gmail.com|104.23.175.242:timer', 'i:1790150704;', 1790150704);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama` varchar(255) NOT NULL,
  `kontak` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `catatan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `nama`, `kontak`, `email`, `alamat`, `catatan`, `created_at`, `updated_at`) VALUES
(1, 'CIPICUNG FC', '-', NULL, NULL, NULL, '2026-09-07 04:18:44', '2026-09-07 04:18:44'),
(2, 'ONTOHOD NEW', '087741756410', NULL, NULL, NULL, '2026-09-08 12:38:42', '2026-09-08 12:38:42'),
(3, 'PASUNDAN UNITED', '-', NULL, NULL, NULL, '2026-09-16 08:50:56', '2026-09-16 08:50:56'),
(4, 'AL KOHAR', '-', NULL, NULL, NULL, '2026-09-16 09:54:49', '2026-09-16 09:54:49'),
(5, 'DULAS FUTSAL', '-', NULL, NULL, NULL, '2026-09-16 09:54:49', '2026-09-16 09:54:49'),
(6, 'DULAS OFFICIAL', '-', NULL, NULL, NULL, '2026-09-16 09:54:49', '2026-09-16 09:54:49'),
(7, 'QURROTA AYYUN', '-', NULL, NULL, NULL, '2026-09-16 09:54:49', '2026-09-16 09:54:49'),
(8, 'SMAN 20 GARUT', '-', NULL, NULL, NULL, '2026-09-16 09:54:49', '2026-09-16 09:54:49'),
(9, 'LEKMONG DOEGA', '-', NULL, NULL, NULL, '2026-09-16 09:54:49', '2026-09-16 09:54:49'),
(10, 'ASF BANG FAHMI', '-', NULL, NULL, NULL, '2026-09-16 09:54:49', '2026-09-16 09:54:49'),
(11, 'JAKET KOBE BAH EDI', '-', NULL, NULL, NULL, '2026-09-16 09:54:49', '2026-09-16 09:54:49'),
(12, 'BOMA FA', '-', NULL, NULL, NULL, '2026-09-16 09:54:49', '2026-09-16 09:54:49'),
(13, 'LIGAR', '-', NULL, NULL, NULL, '2026-09-16 09:54:49', '2026-09-16 09:54:49'),
(14, 'TITARKID', '-', NULL, NULL, NULL, '2026-09-16 09:54:49', '2026-09-16 09:54:49'),
(15, 'SDN 6 REGOL', '-', NULL, NULL, NULL, '2026-09-16 09:54:49', '2026-09-16 09:54:49'),
(16, 'BRATA', '-', NULL, NULL, NULL, '2026-09-16 09:54:49', '2026-09-16 09:54:49'),
(17, 'TFC', '-', NULL, NULL, NULL, '2026-09-16 09:54:49', '2026-09-16 09:54:49'),
(18, 'JAKET IMF', '-', NULL, NULL, NULL, '2026-09-16 09:54:49', '2026-09-16 09:54:49'),
(19, '37B BAH ATE', '-', NULL, NULL, NULL, '2026-09-16 09:54:49', '2026-09-16 09:54:49'),
(20, 'SMAN 19 GARUT', '-', NULL, NULL, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(21, 'HARAVI SAKILA', '-', NULL, NULL, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(22, 'SAS KOPRASI', '-', NULL, NULL, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(23, 'PORSETA FC', '-', NULL, NULL, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(24, 'DOEGA LIGA', '-', NULL, NULL, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(25, 'MTS IKBAL', '-', NULL, NULL, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(26, 'SMPIT AL WASILAH', '-', NULL, NULL, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(27, 'SSB LIWET', '-', NULL, NULL, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(28, 'PERSIS 183', '-', NULL, NULL, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(29, 'PB SMAN 18 GARUT SISWA', '-', NULL, NULL, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(30, 'FUTSAL SMAN 14 GARUT', '-', NULL, NULL, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(31, 'SPPG SAMARANG', '-', NULL, NULL, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(32, 'GLORY MY SPORT', '-', NULL, NULL, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(33, 'SUKAJAYA MY SPORT KLOT. 2', '-', NULL, NULL, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(34, 'SMAN 22 GARUT', '', NULL, '', NULL, '2026-09-18 03:58:31', '2026-09-18 03:58:31'),
(35, 'PERSISTA GURU', '', NULL, '', NULL, '2026-09-21 04:55:13', '2026-09-21 04:55:13'),
(36, 'CIBIUK', '', NULL, '', NULL, '2026-09-21 05:05:41', '2026-09-21 05:05:41'),
(37, 'ALAKSA FC', '-', NULL, NULL, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(38, 'PJOK TAMBAHAN', '-', NULL, NULL, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(39, 'SSB PATRIOT LATIHAN TMB.', '-', NULL, NULL, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(40, 'AKHOIRIYYAH 4', '-', NULL, NULL, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(41, 'SMANDA MY SPORT', '-', NULL, NULL, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(42, 'PB. SMAN 6 GARUT GURU', '-', NULL, NULL, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(43, 'KANCIL FC', '-', NULL, NULL, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(44, 'AL-QASAM TAMBAHAN', '-', NULL, NULL, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(45, 'FUTSAL SMPN 4 GARUT', '-', NULL, NULL, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(46, 'KORMI PAMEUNGPEUK', '-', NULL, NULL, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(47, 'BRIGART TAMBAHAN', '-', NULL, NULL, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(48, 'STM FUTSAL AXIS', '-', NULL, NULL, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(49, 'FUTSAL DUSA NEW KELAS 7', '-', NULL, NULL, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(50, 'FARMACHY', '-', NULL, NULL, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(51, 'SMP DUKAR NEW', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(52, 'PB SMKN 2 GARUT', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(53, 'PRIMA ORANG TUA', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(54, 'SSB PRIMA TAMBAHAN', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(55, 'WEARPACK PAPUA', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(56, 'LPK JAPAN', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(57, 'OLAHRAGA SMK 14 GARUT', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(58, 'SDIT-ALPADHIL', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(59, 'SMP 6 GARUT', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(60, 'FUTSAL DUTA', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(61, 'ELEVENFIVE', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(62, 'SAS TAMBAHAN', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(63, 'SMPN 4 BYB', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(64, 'CSH FC', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(65, 'VOLLY INDOMARCO', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(66, 'SMKN 6 GARUT', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(67, 'AMJ FC MY SPORT', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(68, 'SMPIT MY SPORT', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(69, 'SEKAYU MY SPORT', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(70, 'ATHEREAL MY SPORT', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(71, 'SSB MAUNG GARUT', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(72, 'SDN PAMEUNGPEUK', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(73, 'GURU SD PAMEUNGPEUK', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(74, 'B TEAM MAYORA TNG', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(75, 'MAN 1 MUBA MY SPORT', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(76, 'SDIT AL AMIN', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(77, 'JEDAK TIHANG FC ALUMNI SMA 14 GARUT', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(78, 'OLAHRAGA SMAN 18 GARUT', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(79, 'FUTSAL DOEGA KELAS 7', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(80, 'FUTSAL STM', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(81, 'SMPN 1 CIGEDUG PREMIUM', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(82, 'SDIT INTAN PERMATA', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(83, 'SMP PLUS SUKARAJA', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(84, 'VIPER SNACK FC', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(85, 'PERSIS 76', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(86, 'PP STOK', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(87, 'OLAHRAGA SMAN 14 GARUT', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(88, 'BATIK SMAN 14 GARUT', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(89, 'FAMIGLA TAMBAHAN', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(90, 'MAKLUN DTF', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(91, 'SDIT UWAIS ALQORNI', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(92, 'NAURA FC', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(93, 'DARUL ABROR NEW', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(94, 'AL MALIK', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(95, 'BRB FC', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(96, 'POLO ALVIN JEPANG', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(97, 'KAHUTLA', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(98, 'KORMI WANARAJA', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(99, 'PRAMUKA AL ASDARIYYAH', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(100, 'PML MY SPORT TMB.', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(101, 'PERSIS 113', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(102, 'SSB TRANSAMA TAMBAHAN', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(103, 'INSAN CENDEKIA', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(104, 'BUNGO UNITED', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(105, 'PB. BHAKTI KENCANA', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(106, 'SMAN 26 GARUT', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(107, 'SSB PRIMA CRYSTALIN', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(108, 'PRAMUKA SMAN 6 GARUT', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(109, 'SSB GIRILAYA TAMBAHAN', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(110, 'NESACIG', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(111, 'PEMDA GARUT', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(112, 'SPENTWELVE', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(113, 'SPENTAKID', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(114, 'JAKET SOG PUTRA', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(115, 'TEAM SENYAP FC', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(116, 'TRUST FC', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(117, 'RAETAZZ FC', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(118, 'JOY ELVE', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(119, 'JEEP ADVENTURE', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(120, 'PEMDES MY SPORT TAMBAHAN', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(121, 'SDIT ALAM GARUT', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(122, 'LEVIANS 04', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(123, 'SMPN 1 WANARAJA', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(124, 'SAMPLE BILLIARD', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(125, 'SSB LIWET TAMBAHAN', '-', NULL, NULL, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(126, 'SD 2 PASIRWANGI', '', NULL, '', NULL, '2026-09-21 10:50:15', '2026-09-21 10:50:15'),
(127, 'DOEGA KELAS 89', '', NULL, '', NULL, '2026-09-21 11:49:38', '2026-09-21 11:49:38'),
(128, 'DOEGA PUTRI', '', NULL, '', NULL, '2026-09-21 11:58:10', '2026-09-21 11:58:10'),
(129, 'MIN 4 TANGGERANG PUTRA', '', NULL, '', NULL, '2026-09-22 05:44:37', '2026-09-22 05:44:37'),
(130, 'SAS SILIWANGI RENANG', '', NULL, '', NULL, '2026-09-22 06:55:17', '2026-09-22 06:55:17'),
(131, 'ATIMU SWIMMING', '', NULL, '', NULL, '2026-09-22 07:24:24', '2026-09-22 07:24:24'),
(132, 'ONE WAY', '', NULL, '', NULL, '2026-09-22 07:25:40', '2026-09-22 07:25:40'),
(133, 'SSB PUTRA CILAWU', '', NULL, '', NULL, '2026-09-22 07:27:47', '2026-09-22 07:27:47'),
(134, 'IRMIFFA', '', NULL, '', NULL, '2026-09-22 07:31:09', '2026-09-22 07:31:09'),
(135, 'FUTSAL SPENSA', '', NULL, '', NULL, '2026-09-22 07:39:00', '2026-09-22 07:39:00'),
(136, 'ssssssss', '21321312', NULL, 'asdasd', NULL, '2026-09-22 07:59:40', '2026-09-22 07:59:40'),
(137, 'FUTSAL NAMGAR KLOT. 2', '', NULL, '', NULL, '2026-09-22 08:36:23', '2026-09-22 08:36:23'),
(138, 'SSB LIWET TAMBAHAN 2', '-', NULL, '', NULL, '2026-09-22 08:50:20', '2026-09-22 08:50:20'),
(139, 'SSB GIRILAYA TAMBAHAN 2', '-', NULL, '', NULL, '2026-09-22 08:52:34', '2026-09-22 08:52:34'),
(140, 'BRIGART TAMBAHAN 2', '-', NULL, '', NULL, '2026-09-22 08:54:50', '2026-09-22 08:54:50'),
(141, 'PRAMUKA SPENDAKAR', '', NULL, '', NULL, '2026-09-22 09:02:34', '2026-09-22 09:02:34'),
(142, 'FUTSAL SMAN 11 GARUT', '', NULL, '', NULL, '2026-09-22 10:52:45', '2026-09-22 10:52:45'),
(143, 'SDIT PERSIS GARKOT', '', NULL, '', NULL, '2026-09-23 04:54:05', '2026-09-23 04:54:05'),
(144, 'FUTSAL 4G', '', NULL, '', NULL, '2026-09-23 06:57:30', '2026-09-23 06:57:30'),
(145, 'TWEENTY SEVEN', '', NULL, '', NULL, '2026-09-23 08:00:00', '2026-09-23 08:00:00'),
(146, 'SSB FAMILY TAMBAHAN', '', NULL, '', NULL, '2026-09-23 08:16:33', '2026-09-23 08:16:33'),
(147, 'SDN DOETA', '', NULL, '', NULL, '2026-09-23 08:22:26', '2026-09-23 08:22:26'),
(148, 'OLAHRAGA SMP 3 TARKID', '', NULL, '', NULL, '2026-09-23 08:35:36', '2026-09-23 08:35:36'),
(149, 'OASIS FC', '', NULL, '', NULL, '2026-09-24 06:47:51', '2026-09-24 06:47:51');

-- --------------------------------------------------------

--
-- Table structure for table `desains`
--

CREATE TABLE `desains` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `versi` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `file_mockup` varchar(255) DEFAULT NULL,
  `catatan_revisi` text DEFAULT NULL,
  `status` enum('menunggu','dikerjakan','revisi','disetujui') NOT NULL DEFAULT 'menunggu',
  `desain_dikerjakan_oleh` bigint(20) UNSIGNED DEFAULT NULL,
  `desain_disetujui_oleh` bigint(20) UNSIGNED DEFAULT NULL,
  `disetujui_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_08_31_053827_create_permission_tables', 1),
(5, '2026_08_31_053829_create_activity_log_table', 1),
(6, '2026_08_31_053830_add_event_column_to_activity_log_table', 1),
(7, '2026_08_31_053831_add_batch_uuid_column_to_activity_log_table', 1),
(8, '2026_08_31_054350_add_divisi_level_to_users_table', 1),
(9, '2026_08_31_060000_create_customers_table', 1),
(10, '2026_08_31_060100_create_orders_table', 1),
(11, '2026_08_31_060200_create_order_files_table', 1),
(12, '2026_08_31_060300_create_order_logs_table', 1),
(13, '2026_08_31_060400_create_desains_table', 1),
(14, '2026_08_31_060500_create_printings_table', 1),
(15, '2026_08_31_060600_create_pemasangans_table', 1),
(16, '2026_08_31_060700_create_stok_bahan_table', 1),
(17, '2026_08_31_060800_create_stok_mutasi_table', 1),
(18, '2026_08_31_060900_create_packings_table', 1),
(19, '2026_09_01_063716_create_pembayarans_table', 1),
(20, '2026_09_01_063717_create_pengeluarans_table', 1),
(21, '2026_09_01_064619_create_suppliers_table', 1),
(22, '2026_09_01_064620_create_purchase_orders_table', 1),
(23, '2026_09_01_064621_create_purchase_order_items_table', 1),
(24, '2026_09_01_065130_create_stok_opnames_table', 1),
(25, '2026_09_01_065131_create_stok_opname_items_table', 1),
(26, '2026_09_04_100000_add_hr_fields_to_users_table', 1),
(27, '2026_09_04_100100_create_produksi_cuttings_table', 1),
(28, '2026_09_04_100200_create_produksi_jahit_tables', 1),
(29, '2026_09_04_100300_create_hr_tables', 1),
(30, '2026_09_04_165954_create_order_items_table', 1),
(31, '2026_09_04_170645_create_notifications_table', 1),
(32, '2026_09_04_172445_change_status_column_on_orders_table', 1),
(33, '2026_09_05_034006_add_rincian_ukuran_to_produksi_jahit_outputs', 1),
(34, '2026_09_05_041152_drop_unique_from_produksi_jahit_outputs', 1),
(35, '2026_09_05_110730_create_produksi_jahit_qc_rejects_table', 1),
(36, '2026_09_06_040000_create_produksi_targets_table', 1),
(37, '2026_09_06_050000_create_system_settings_table', 1),
(38, '2026_09_06_122314_add_company_settings_to_system_settings', 1),
(39, '2026_09_06_123330_add_bank_account_to_system_settings', 1),
(40, '2026_09_12_141612_create_produksi_cutting_assign_tables', 2),
(41, '2026_09_12_151805_add_harga_satuan_to_order_items_table', 2),
(42, '2026_09_13_134004_add_indexes_to_frequently_queried_columns', 3);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Models\\User', 1),
(2, 'App\\Models\\User', 32),
(2, 'App\\Models\\User', 35),
(4, 'App\\Models\\User', 29),
(4, 'App\\Models\\User', 30),
(5, 'App\\Models\\User', 31),
(5, 'App\\Models\\User', 33),
(5, 'App\\Models\\User', 34);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `notifiable_type` varchar(255) NOT NULL,
  `notifiable_id` bigint(20) UNSIGNED NOT NULL,
  `data` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES
('014c80de-c23a-4a51-bc04-821730f44ce1', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":82,\"no_order\":\"CPL-202609-0027\",\"message\":\"Status order CPL-202609-0027 berubah dari selesai menjadi jahit\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/82\"}', NULL, '2026-09-18 03:31:21', '2026-09-18 03:31:21'),
('06c3fa77-6a11-4084-80f5-d6177ad3ec89', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":204,\"no_order\":\"CPL-202609-0146\",\"message\":\"Status order CPL-202609-0146 berubah dari draft menjadi printing\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/204\"}', NULL, '2026-09-22 09:02:45', '2026-09-22 09:02:45'),
('142df353-5e4d-4deb-b782-5266b88b980c', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":203,\"no_order\":\"CPL-202609-0145\",\"message\":\"Status order CPL-202609-0145 berubah dari draft menjadi printing\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/203\"}', NULL, '2026-09-22 08:55:34', '2026-09-22 08:55:34'),
('15a55f26-efd9-40f0-acb6-590a2d9f6987', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 2, '{\"order_id\":2,\"no_order\":\"CPL-202609-0002\",\"message\":\"Status order CPL-202609-0002 berubah dari cutting menjadi printing\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/2\"}', NULL, '2026-09-08 12:44:30', '2026-09-08 12:44:30'),
('16e2e120-d885-484b-8a01-226855bf5d3b', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":2,\"no_order\":\"CPL-202609-0002\",\"message\":\"Status order CPL-202609-0002 berubah dari cutting menjadi printing\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/2\"}', NULL, '2026-09-08 12:44:30', '2026-09-08 12:44:30'),
('239865d7-1094-407a-9019-c2e358e18c1e', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":205,\"no_order\":\"CPL-202609-0147\",\"message\":\"Status order CPL-202609-0147 berubah dari selesai menjadi dikirim\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/205\"}', NULL, '2026-09-22 10:53:47', '2026-09-22 10:53:47'),
('2ea7b15f-8e05-44e1-a5a6-7cebde408589', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":191,\"no_order\":\"CPL-202609-0134\",\"message\":\"Status order CPL-202609-0134 berubah dari draft menjadi jahit\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/191\"}', NULL, '2026-09-22 05:45:16', '2026-09-22 05:45:16'),
('380fc8e3-b6ab-496e-a262-0f22be3ec7e0', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":2,\"no_order\":\"CPL-202609-0002\",\"message\":\"Status order CPL-202609-0002 berubah dari printing menjadi jahit\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/2\"}', NULL, '2026-09-08 12:46:07', '2026-09-08 12:46:07'),
('3ec5012e-dfba-459d-828b-83fe54a4d378', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":89,\"no_order\":\"CPL-202609-0034\",\"message\":\"Status order CPL-202609-0034 berubah dari draft menjadi jahit\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/89\"}', NULL, '2026-09-18 03:58:39', '2026-09-18 03:58:39'),
('43d1c066-e998-4aca-b570-0545ad09e6ce', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":187,\"no_order\":\"CPL-202609-0131\",\"message\":\"Status order CPL-202609-0131 berubah dari draft menjadi printing\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/187\"}', NULL, '2026-09-21 11:52:58', '2026-09-21 11:52:58'),
('4d95389b-480a-4365-8a06-108e8fea50f9', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":79,\"no_order\":\"CPL-202609-0024\",\"message\":\"Status order CPL-202609-0024 berubah dari selesai menjadi printing\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/79\"}', NULL, '2026-09-18 03:28:27', '2026-09-18 03:28:27'),
('4f7a7a5b-1730-40e1-94dc-87d88770c3c2', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":197,\"no_order\":\"CPL-202609-0140\",\"message\":\"Status order CPL-202609-0140 berubah dari draft menjadi printing\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/197\"}', NULL, '2026-09-22 07:36:16', '2026-09-22 07:36:16'),
('54149d76-d78c-48d3-9b52-baf9b563f456', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":86,\"no_order\":\"CPL-202609-0031\",\"message\":\"Status order CPL-202609-0031 berubah dari selesai menjadi jahit\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/86\"}', NULL, '2026-09-18 04:12:30', '2026-09-18 04:12:30'),
('597d27f0-be43-4d7a-bb35-94b5e41052b8', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":92,\"no_order\":\"CPL-202609-0036\",\"message\":\"Status order CPL-202609-0036 berubah dari draft menjadi selesai\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/92\"}', NULL, '2026-09-21 05:05:48', '2026-09-21 05:05:48'),
('5c260c3b-517f-4340-a5f6-fd0568db24d0', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":192,\"no_order\":\"CPL-202609-0135\",\"message\":\"Status order CPL-202609-0135 berubah dari draft menjadi printing\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/192\"}', NULL, '2026-09-22 06:55:26', '2026-09-22 06:55:26'),
('5c85949d-a713-4dff-9d75-1c3e3157492d', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":91,\"no_order\":\"CPL-202609-0035\",\"message\":\"Status order CPL-202609-0035 berubah dari draft menjadi selesai\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/91\"}', NULL, '2026-09-21 05:01:09', '2026-09-21 05:01:09'),
('66ab2b1e-2557-4fd9-8aa0-b3c0e165d643', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 2, '{\"order_id\":1,\"no_order\":\"CPL-202609-0001\",\"message\":\"Status order CPL-202609-0001 berubah dari produksi menjadi cutting\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/1\"}', NULL, '2026-09-07 04:24:10', '2026-09-07 04:24:10'),
('66c722ca-bae4-44a4-8564-1105bdf96138', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 32, '{\"order_id\":209,\"no_order\":\"CPL-202609-0151\",\"message\":\"Status order CPL-202609-0151 berubah dari draft menjadi selesai\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/209\"}', NULL, '2026-09-23 08:16:39', '2026-09-23 08:16:39'),
('701fbe52-ed5f-49b0-8aa1-0792e17e4482', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":189,\"no_order\":\"CPL-202609-0132\",\"message\":\"Status order CPL-202609-0132 berubah dari draft menjadi printing\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/189\"}', NULL, '2026-09-21 11:59:15', '2026-09-21 11:59:15'),
('7296d110-4634-4710-925f-dd3d430d7bb3', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":4,\"no_order\":\"CPL-202609-0002\",\"message\":\"Status order CPL-202609-0002 berubah dari draft menjadi selesai\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/4\"}', NULL, '2026-09-17 04:44:57', '2026-09-17 04:44:57'),
('76fab4c7-1b63-4e2c-8208-a3a17cb20cb2', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":77,\"no_order\":\"CPL-202609-0022\",\"message\":\"Status order CPL-202609-0022 berubah dari selesai menjadi jahit\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/77\"}', NULL, '2026-09-18 03:27:52', '2026-09-18 03:27:52'),
('771fdf5e-3360-4d2b-b89b-a1fda596c5a4', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":195,\"no_order\":\"CPL-202609-0138\",\"message\":\"Status order CPL-202609-0138 berubah dari draft menjadi printing\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/195\"}', NULL, '2026-09-22 07:27:56', '2026-09-22 07:27:56'),
('83086405-b795-4e37-b081-4fe43b7371f7', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":108,\"no_order\":\"CPL-202609-0052\",\"message\":\"Status order CPL-202609-0052 berubah dari draft menjadi printing\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/108\"}', NULL, '2026-09-22 04:03:12', '2026-09-22 04:03:12'),
('84546320-6bee-4d9f-8e3d-22c2bdc39d1f', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":190,\"no_order\":\"CPL-202609-0133\",\"message\":\"Status order CPL-202609-0133 berubah dari draft menjadi printing\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/190\"}', NULL, '2026-09-21 12:02:12', '2026-09-21 12:02:12'),
('877c0abb-18a2-4608-aa19-32cfc2a2daea', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":4,\"no_order\":\"CPL-202609-0002\",\"message\":\"Status order CPL-202609-0002 berubah dari procurement menjadi printing\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/4\"}', NULL, '2026-09-17 04:53:16', '2026-09-17 04:53:16'),
('90f38e51-ba20-481d-b9be-99cc16ff6984', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":88,\"no_order\":\"CPL-202609-0033\",\"message\":\"Status order CPL-202609-0033 berubah dari selesai menjadi jahit\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/88\"}', NULL, '2026-09-18 04:14:30', '2026-09-18 04:14:30'),
('9f211dd0-e94c-4e72-ba6e-7f451a462bdc', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":3,\"no_order\":\"CPL-202609-0001\",\"message\":\"Status order CPL-202609-0001 berubah dari selesai menjadi dikirim\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/3\"}', NULL, '2026-09-16 08:51:43', '2026-09-16 08:51:43'),
('b38c8ca9-e91e-4839-951a-2b4294661a03', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":209,\"no_order\":\"CPL-202609-0151\",\"message\":\"Status order CPL-202609-0151 berubah dari draft menjadi selesai\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/209\"}', NULL, '2026-09-23 08:16:39', '2026-09-23 08:16:39'),
('b97b7498-d5d1-4edb-ad1d-ac653bbf522f', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":198,\"no_order\":\"CPL-202609-0141\",\"message\":\"Status order CPL-202609-0141 berubah dari draft menjadi printing\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/198\"}', NULL, '2026-09-22 07:39:08', '2026-09-22 07:39:08'),
('ba536cb0-2ee4-45ac-b792-730a2eefd2bc', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":201,\"no_order\":\"CPL-202609-0143\",\"message\":\"Status order CPL-202609-0143 berubah dari draft menjadi printing\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/201\"}', NULL, '2026-09-22 08:50:35', '2026-09-22 08:50:35'),
('bafa5645-ad9a-4589-bc52-4bf5442fba10', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":194,\"no_order\":\"CPL-202609-0137\",\"message\":\"Status order CPL-202609-0137 berubah dari draft menjadi jahit\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/194\"}', NULL, '2026-09-22 07:25:50', '2026-09-22 07:25:50'),
('bbb4174e-4ffa-439b-9bdf-8abff0cea86c', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":4,\"no_order\":\"CPL-202609-0002\",\"message\":\"Status order CPL-202609-0002 berubah dari pemasangan menjadi jahit\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/4\"}', NULL, '2026-09-17 04:56:18', '2026-09-17 04:56:18'),
('ca589b51-6a13-42f0-bad6-919b53a5e542', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":85,\"no_order\":\"CPL-202609-0030\",\"message\":\"Status order CPL-202609-0030 berubah dari selesai menjadi jahit\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/85\"}', NULL, '2026-09-18 04:11:20', '2026-09-18 04:11:20'),
('cd278adc-9831-4a7c-98d4-201905adbe96', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":205,\"no_order\":\"CPL-202609-0147\",\"message\":\"Status order CPL-202609-0147 berubah dari draft menjadi selesai\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/205\"}', NULL, '2026-09-22 10:52:52', '2026-09-22 10:52:52'),
('cea5e1a8-4782-4ef5-bf11-f1d3e2ab960d', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":1,\"no_order\":\"CPL-202609-0001\",\"message\":\"Status order CPL-202609-0001 berubah dari draft menjadi desain\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/1\"}', NULL, '2026-09-07 04:20:09', '2026-09-07 04:20:09'),
('ced48d80-b759-4363-a229-64bfcec68f26', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":87,\"no_order\":\"CPL-202609-0032\",\"message\":\"Status order CPL-202609-0032 berubah dari selesai menjadi jahit\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/87\"}', NULL, '2026-09-18 04:14:00', '2026-09-18 04:14:00'),
('d0c89dba-b7d2-4006-a3f5-de5a52523a6c', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":2,\"no_order\":\"CPL-202609-0002\",\"message\":\"Status order CPL-202609-0002 berubah dari draft menjadi cutting\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/2\"}', NULL, '2026-09-08 12:44:00', '2026-09-08 12:44:00'),
('d42e6b3f-0db6-4353-9b37-73941a536d35', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":202,\"no_order\":\"CPL-202609-0144\",\"message\":\"Status order CPL-202609-0144 berubah dari draft menjadi printing\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/202\"}', NULL, '2026-09-22 08:56:37', '2026-09-22 08:56:37'),
('d42ebb5f-6304-4b99-adef-17db1b27aa69', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":200,\"no_order\":\"CPL-202609-0142\",\"message\":\"Status order CPL-202609-0142 berubah dari draft menjadi printing\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/200\"}', NULL, '2026-09-22 08:39:02', '2026-09-22 08:39:02'),
('d6142919-c706-4858-a07d-07b3859ffe26', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":120,\"no_order\":\"CPL-202609-0064\",\"message\":\"Status order CPL-202609-0064 berubah dari draft menjadi selesai\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/120\"}', NULL, '2026-09-22 04:04:20', '2026-09-22 04:04:20'),
('d78f5cbc-d923-40fd-83e8-477286c4eeb3', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":3,\"no_order\":\"CPL-202609-0001\",\"message\":\"Status order CPL-202609-0001 berubah dari dikirim menjadi selesai\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/3\"}', NULL, '2026-09-16 08:53:59', '2026-09-16 08:53:59'),
('d8230414-af58-4fbc-ad3c-c53420b87814', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":73,\"no_order\":\"CPL-202609-0018\",\"message\":\"Status order CPL-202609-0018 berubah dari selesai menjadi jahit\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/73\"}', NULL, '2026-09-18 03:21:11', '2026-09-18 03:21:11'),
('db1a7a4f-8238-45d1-831d-80640cc6f708', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":4,\"no_order\":\"CPL-202609-0002\",\"message\":\"Status order CPL-202609-0002 berubah dari selesai menjadi desain\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/4\"}', NULL, '2026-09-17 04:52:12', '2026-09-17 04:52:12'),
('dfa0056c-2016-410e-b00b-76a4cb2c90d5', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":75,\"no_order\":\"CPL-202609-0020\",\"message\":\"Status order CPL-202609-0020 berubah dari selesai menjadi draft\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/75\"}', NULL, '2026-09-18 03:25:42', '2026-09-18 03:25:42'),
('e668cf79-027d-448d-9138-78d2b5d6ea4a', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":76,\"no_order\":\"CPL-202609-0021\",\"message\":\"Status order CPL-202609-0021 berubah dari selesai menjadi dikirim\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/76\"}', NULL, '2026-09-18 03:27:28', '2026-09-18 03:27:28'),
('e6bae5a9-aba7-4fa6-a256-8ec04c1e0efd', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 2, '{\"order_id\":2,\"no_order\":\"CPL-202609-0002\",\"message\":\"Status order CPL-202609-0002 berubah dari draft menjadi cutting\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/2\"}', NULL, '2026-09-08 12:44:00', '2026-09-08 12:44:00'),
('e6c474dd-5736-42c0-8278-54bb6597900c', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":83,\"no_order\":\"CPL-202609-0028\",\"message\":\"Status order CPL-202609-0028 berubah dari selesai menjadi jahit\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/83\"}', NULL, '2026-09-18 04:10:45', '2026-09-18 04:10:45'),
('e799e35e-08c5-4348-a30b-a163d1035be1', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":1,\"no_order\":\"CPL-202609-0001\",\"message\":\"Status order CPL-202609-0001 berubah dari produksi menjadi cutting\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/1\"}', NULL, '2026-09-07 04:24:10', '2026-09-07 04:24:10'),
('ecffb388-f211-4645-ae28-e3add4123603', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":193,\"no_order\":\"CPL-202609-0136\",\"message\":\"Status order CPL-202609-0136 berubah dari draft menjadi printing\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/193\"}', NULL, '2026-09-22 07:24:38', '2026-09-22 07:24:38'),
('f1676116-b9b9-4e49-acca-932ef176f9b1', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 2, '{\"order_id\":1,\"no_order\":\"CPL-202609-0001\",\"message\":\"Status order CPL-202609-0001 berubah dari draft menjadi desain\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/1\"}', NULL, '2026-09-07 04:20:09', '2026-09-07 04:20:09'),
('f395ca5e-06ad-40c5-890c-2a334883421e', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":3,\"no_order\":\"CPL-202609-0001\",\"message\":\"Status order CPL-202609-0001 berubah dari draft menjadi selesai\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/3\"}', NULL, '2026-09-16 08:51:38', '2026-09-16 08:51:38'),
('f6b391fb-cbc8-4eb1-9fe2-071643822dc2', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 1, '{\"order_id\":80,\"no_order\":\"CPL-202609-0025\",\"message\":\"Status order CPL-202609-0025 berubah dari selesai menjadi jahit\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/80\"}', NULL, '2026-09-18 03:30:56', '2026-09-18 03:30:56'),
('fd3ce518-128b-43f3-9bb9-eb91bb65943a', 'App\\Notifications\\OrderStatusChanged', 'App\\Models\\User', 2, '{\"order_id\":2,\"no_order\":\"CPL-202609-0002\",\"message\":\"Status order CPL-202609-0002 berubah dari printing menjadi jahit\",\"url\":\"https:\\/\\/cp.nadirlabs.net\\/orders\\/2\"}', NULL, '2026-09-08 12:46:07', '2026-09-08 12:46:07');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `no_order` varchar(255) NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `tanggal_order` date NOT NULL,
  `deadline` date NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'draft',
  `jenis_produk` varchar(255) NOT NULL,
  `jumlah` int(10) UNSIGNED NOT NULL,
  `catatan_desain` text DEFAULT NULL,
  `catatan_produksi` text DEFAULT NULL,
  `total_harga` decimal(12,2) NOT NULL DEFAULT 0.00,
  `dp` decimal(12,2) NOT NULL DEFAULT 0.00,
  `sisa_bayar` decimal(12,2) NOT NULL DEFAULT 0.00,
  `catatan` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `no_order`, `customer_id`, `tanggal_order`, `deadline`, `status`, `jenis_produk`, `jumlah`, `catatan_desain`, `catatan_produksi`, `total_harga`, `dp`, `sisa_bayar`, `catatan`, `created_by`, `created_at`, `updated_at`) VALUES
(56, 'CPL-202609-0001', 3, '2026-03-07', '2026-03-21', 'selesai', 'J. SPECIAL', 43, NULL, 'Bahan: THUNDER\nTenggat Waktu Excel: 2 MINGGU\nPenjahit: AHMAD', 6880000.00, 6700000.00, 180000.00, 'No Resi Excel: INV-12345', 1, '2026-09-17 12:35:50', '2026-09-17 13:57:58'),
(57, 'CPL-202609-0002', 4, '2026-03-11', '2026-03-25', 'selesai', 'MANUAL', 27, NULL, 'Bahan: COTTON 30S\nTenggat Waktu Excel: 2 MINGGU\nPenjahit: NCANG', 1485000.00, 500000.00, 985000.00, '', 1, '2026-09-17 12:35:50', '2026-09-17 13:57:58'),
(58, 'CPL-202609-0003', 5, '2026-03-18', '2026-04-01', 'selesai', 'J. PRINT STELAN', 69, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU\nPenjahit: NCANG\n---\nBahan: MILANO\nTenggat Waktu Excel: 2 MINGGU\nPenjahit: NCANG', 8450000.00, 7800000.00, 650000.00, '', 1, '2026-09-17 12:35:50', '2026-09-17 13:57:58'),
(60, 'CPL-202609-0005', 7, '2026-04-06', '2026-04-20', 'selesai', 'J. PRINT STELAN', 19, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU\nPenjahit: AHMAD', 2375000.00, 1875000.00, 500000.00, '', 1, '2026-09-17 12:35:50', '2026-09-17 13:57:58'),
(61, 'CPL-202609-0006', 8, '2026-05-02', '2026-05-16', 'selesai', 'J. PRINT OLAHRAGA', 50, NULL, 'Bahan: MILANO+LOTTO\nTenggat Waktu Excel: 3 MINGGU\nPenjahit: NCANG', 5000000.00, 4000000.00, 1000000.00, '', 1, '2026-09-17 12:35:50', '2026-09-17 13:57:58'),
(62, 'CPL-202609-0007', 9, '2026-05-02', '2026-05-16', 'selesai', 'LEKMONG', 28, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU\nPenjahit: NCANG', 980000.00, 650000.00, 330000.00, '', 1, '2026-09-17 12:35:50', '2026-09-17 13:57:58'),
(63, 'CPL-202609-0008', 10, '2025-05-02', '2025-05-16', 'selesai', 'J. PRINT STELAN', 20, NULL, 'Bahan: EMBOSH\nTenggat Waktu Excel: 2 MINGGU\nPenjahit: AHMAD', 2400000.00, 2100000.00, 300000.00, '', 1, '2026-09-17 12:35:50', '2026-09-17 13:57:58'),
(64, 'CPL-202609-0009', 11, '2026-05-04', '2026-05-18', 'selesai', 'JAKET MANUAL', 45, NULL, 'Bahan: DIODORA\nTenggat Waktu Excel: 3 MINGGU\nPenjahit: ISAN', 6750000.00, 5800000.00, 950000.00, '', 1, '2026-09-17 12:35:50', '2026-09-17 13:57:58'),
(65, 'CPL-202609-0010', 12, '2026-05-11', '2026-05-25', 'selesai', 'J. PRINT STELAN', 33, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU\nPenjahit: AHMAD\n---\nBahan: MILANO\nTenggat Waktu Excel: 2 MINGGU\nPenjahit: AHMAD\n---\nBahan: MILANO\nTenggat Waktu Excel: 2 MINGGU\nPenjahit: AHMAD', 3480000.00, 1400000.00, 2080000.00, '', 1, '2026-09-17 12:35:50', '2026-09-17 13:57:58'),
(66, 'CPL-202609-0011', 13, '2026-05-20', '2026-06-03', 'selesai', 'J. PRINT STELAN+K.KAKI', 31, NULL, 'Bahan: EMBOSH\nTenggat Waktu Excel: 2 MINGGU\nPenjahit: NCANG', 4650000.00, 1000000.00, 3650000.00, '', 1, '2026-09-17 12:35:50', '2026-09-17 13:57:58'),
(67, 'CPL-202609-0012', 14, '2026-05-30', '2026-06-13', 'selesai', 'J. PRINT STELAN', 61, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU\nPenjahit: AHMAD\n---\nBahan: MILANO\nTenggat Waktu Excel: 2 MINGGU\nPenjahit: AHMAD\n---\nBahan: MILANO\nTenggat Waktu Excel: 2 MINGGU\nPenjahit: AHMAD', 6780000.00, 6100000.00, 680000.00, '', 1, '2026-09-17 12:35:50', '2026-09-17 13:57:59'),
(68, 'CPL-202609-0013', 15, '2026-06-19', '2026-07-03', 'jahit', 'OLAHRAGA MANUAL ANAK', 50, NULL, 'Bahan: JERUK\nPenjahit: ASUL', 3500000.00, 500000.00, 3000000.00, '', 1, '2026-09-17 12:35:50', '2026-09-22 06:41:47'),
(69, 'CPL-202609-0014', 16, '2026-06-26', '2026-07-10', 'selesai', 'MANUAL', 46, NULL, 'Bahan: COTTON 24S\nTenggat Waktu Excel: 2 MINGGU\nPenjahit: NCANG', 3450000.00, 2500000.00, 950000.00, NULL, 1, '2026-09-17 12:35:50', '2026-09-21 02:07:20'),
(70, 'CPL-202609-0015', 17, '2026-07-01', '2026-07-15', 'selesai', 'J. PRINT STELAN', 22, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU\nPenjahit: NCANG', 2640000.00, 2430000.00, 210000.00, '', 1, '2026-09-17 12:35:50', '2026-09-17 13:57:59'),
(71, 'CPL-202609-0016', 18, '2026-07-22', '2026-08-05', 'selesai', 'JAKET PRINT', 12, NULL, 'Bahan: DESPO\nTenggat Waktu Excel: 2 MINGGU\nPenjahit: PAK ILYAS', 1800000.00, 740000.00, 1060000.00, '', 1, '2026-09-17 12:35:50', '2026-09-17 13:57:59'),
(72, 'CPL-202609-0017', 19, '2026-07-31', '2026-08-14', 'selesai', 'J. PRINT STELAN', 12, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU\nPenjahit: AHMAD', 1320000.00, 600000.00, 720000.00, NULL, 1, '2026-09-17 12:35:50', '2026-09-22 07:32:50'),
(73, 'CPL-202609-0018', 20, '2026-08-03', '2026-08-17', 'jahit', 'J. PRINT STELAN OLAHRAGA', 405, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU', 40500000.00, 20000000.00, 20500000.00, '', 1, '2026-09-17 12:35:50', '2026-09-18 03:21:11'),
(74, 'CPL-202609-0019', 21, '2026-08-05', '2026-08-19', 'selesai', 'J. PRINT STELAN', 20, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU', 2200000.00, 1600000.00, 600000.00, '', 1, '2026-09-17 12:35:50', '2026-09-17 13:58:09'),
(75, 'CPL-202609-0020', 22, '2026-08-06', '2026-10-03', 'printing', 'JAKET, COTTON', 37, NULL, 'Bahan: COTTON,DIODORA', 10360000.00, 6500000.00, 3860000.00, NULL, 1, '2026-09-17 12:35:50', '2026-09-22 04:15:26'),
(76, 'CPL-202609-0021', 23, '2026-08-10', '2026-08-24', 'dikirim', 'J. PRINT STELAN', 43, NULL, 'Bahan: MILANO\nPenjahit: ISAN\n---\nBahan: MILANO\nPenjahit: ISAN', 4900000.00, 3000000.00, 1900000.00, '', 1, '2026-09-17 12:35:50', '2026-09-18 03:27:28'),
(78, 'CPL-202609-0023', 24, '2026-08-15', '2026-08-29', 'selesai', 'J. PRINT STELAN', 20, NULL, 'Bahan: MILANO', 2200000.00, 1750000.00, 0.00, '', 1, '2026-09-17 12:35:50', '2026-09-21 08:28:53'),
(79, 'CPL-202609-0024', 25, '2026-08-18', '2026-09-01', 'pemasangan', 'J. PRINT STELAN', 59, NULL, 'Bahan: MILANO', 6490000.00, 3350000.00, 3140000.00, '', 1, '2026-09-17 12:35:50', '2026-09-21 02:55:23'),
(80, 'CPL-202609-0025', 26, '2026-08-22', '2026-09-05', 'jahit', 'J. PRINT STELAN', 67, NULL, 'Bahan: MILANO', 7705000.00, 7000000.00, 705000.00, '', 1, '2026-09-17 12:35:50', '2026-09-18 03:30:56'),
(81, 'CPL-202609-0026', 27, '2026-08-22', '2026-09-05', 'selesai', 'J. PRINT STELAN', 11, NULL, 'Bahan: MILANO', 880000.00, 500000.00, 380000.00, '', 1, '2026-09-17 12:35:50', '2026-09-17 13:58:09'),
(82, 'CPL-202609-0027', 28, '2026-08-24', '2026-09-07', 'jahit', 'J. PRINT ANAK', 22, NULL, 'Bahan: MILANO', 2420000.00, 1200000.00, 1220000.00, '', 1, '2026-09-17 12:35:50', '2026-09-18 03:31:21'),
(83, 'CPL-202609-0028', 8, '2026-08-25', '2026-09-08', 'jahit', 'J. PRINT STELAN OLAHRAGA', 200, NULL, 'Bahan: MILANO+LOTTO', 20000000.00, 3000000.00, 5000000.00, '', 1, '2026-09-17 12:35:50', '2026-09-22 03:27:45'),
(84, 'CPL-202609-0029', 29, '2026-08-27', '2026-09-10', 'selesai', 'J. PRINT ATASAN', 52, NULL, 'Bahan: MILANO', 4940000.00, 4750000.00, 190000.00, NULL, 1, '2026-09-17 12:35:50', '2026-09-18 03:20:08'),
(85, 'CPL-202609-0030', 30, '2026-08-27', '2026-09-10', 'jahit', 'J. PRINT STELAN', 78, NULL, 'Bahan: MILANO', 14430000.00, 10000000.00, 4430000.00, '', 1, '2026-09-17 12:35:50', '2026-09-18 04:11:20'),
(86, 'CPL-202609-0031', 31, '2026-08-31', '2026-09-14', 'jahit', 'J. SPECIAL', 24, NULL, 'Bahan: THUNDER\nPenjahit: NCANG\n---\nBahan: THUNDER\nPenjahit: NCANG', 3645000.00, 1500000.00, 2145000.00, '', 1, '2026-09-17 12:35:50', '2026-09-18 04:12:30'),
(87, 'CPL-202609-0032', 32, '2026-08-31', '2026-09-14', 'jahit', 'J. FULL PRINT', 16, NULL, 'Bahan: EMBOSH', 2000000.00, 500000.00, 0.00, '', 1, '2026-09-17 12:35:50', '2026-09-23 08:07:41'),
(88, 'CPL-202609-0033', 33, '2026-08-31', '2026-09-14', 'jahit', 'J. PRINT STELAN', 19, NULL, 'Bahan: EMBOSH\nPenjahit: AHMAD', 1995000.00, 1000000.00, 0.00, '', 1, '2026-09-17 12:35:50', '2026-09-23 08:06:15'),
(89, 'CPL-202609-0034', 34, '2026-09-18', '2026-09-19', 'jahit', 'Lainnya', 370, NULL, NULL, 37000000.00, 10000000.00, 17000000.00, NULL, 1, '2026-09-18 03:58:31', '2026-09-22 03:23:19'),
(91, 'CPL-202609-0035', 35, '2026-09-21', '2026-09-21', 'selesai', 'J. PRINT L. PANJANG, J. PRINT L. PENDEK', 63, NULL, NULL, 5890000.00, 0.00, 5890000.00, NULL, 1, '2026-09-21 05:00:57', '2026-09-22 04:51:18'),
(92, 'CPL-202609-0036', 36, '2026-09-21', '2026-09-21', 'selesai', 'KAOS KAKI', 50, NULL, NULL, 1650000.00, 0.00, 0.00, NULL, 1, '2026-09-21 05:05:41', '2026-09-23 08:05:39'),
(93, 'CPL-202609-0037', 37, '2026-09-01', '2026-09-15', 'selesai', 'J. FULL PRINT', 12, NULL, 'Bahan: TRIANGLE\nTenggat Waktu Excel: 2 MINGGU', 1920000.00, 1920000.00, 0.00, 'No Resi Excel: INV-12345', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(94, 'CPL-202609-0038', 38, '2026-09-01', '2026-09-15', 'selesai', 'J. PRINT ATASAN', 10, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU', 900000.00, 900000.00, 0.00, '', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(95, 'CPL-202609-0039', 39, '2026-09-02', '2026-09-16', 'selesai', 'J. PRINT STELAN', 10, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU', 1000000.00, 1000000.00, 0.00, '', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(96, 'CPL-202609-0040', 40, '2026-09-02', '2026-09-16', 'selesai', 'J. PRINT STELAN', 12, NULL, 'Bahan: EMBOSH\nTenggat Waktu Excel: 2 MINGGU', 1320000.00, 1320000.00, 0.00, '', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(97, 'CPL-202609-0041', 1, '2026-09-02', '2026-09-16', 'jahit', 'J. PRINT STELAN', 20, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU', 2700000.00, 1640000.00, 1060000.00, NULL, 1, '2026-09-21 09:34:19', '2026-09-23 10:00:39'),
(98, 'CPL-202609-0042', 41, '2026-09-02', '2026-09-16', 'jahit', 'J. FULL PRINT', 29, NULL, 'Bahan: EMBOSH\nTenggat Waktu Excel: 2 MINGGU', 3625000.00, 2500000.00, 0.00, '', 1, '2026-09-21 09:34:19', '2026-09-23 08:06:37'),
(99, 'CPL-202609-0043', 42, '2026-09-02', '2026-09-16', 'selesai', 'J. PRINT ATASAN', 25, NULL, 'Bahan: THUNDER\nTenggat Waktu Excel: 2 MINGGU\n---\nBahan: THUNDER\nTenggat Waktu Excel: 2 MINGGU', 2520000.00, 2520000.00, 0.00, '', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(100, 'CPL-202609-0044', 43, '2026-09-02', '2026-09-16', 'jahit', 'J. PRINT SPECIAL', 35, NULL, 'Bahan: THUNDER\nTenggat Waktu Excel: 3 MINGGU', 5250000.00, 2250000.00, 3000000.00, '', 1, '2026-09-21 09:34:19', '2026-09-22 06:40:50'),
(101, 'CPL-202609-0045', 44, '2026-09-02', '2026-09-16', 'jahit', 'J. PRINT+K.KAKI', 8, NULL, 'Bahan: THUNDER\nTenggat Waktu Excel: 3 MINGGU\n---\nBahan: THUNDER\nTenggat Waktu Excel: 3 MINGGU', 1090000.00, 800000.00, 290000.00, '', 1, '2026-09-21 09:34:19', '2026-09-22 06:40:50'),
(102, 'CPL-202609-0046', 45, '2026-09-02', '2026-09-16', 'jahit', 'J. PRINT STELAN', 21, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 3 MINGGU', 2520000.00, 1550000.00, 970000.00, '', 1, '2026-09-21 09:34:19', '2026-09-22 06:40:50'),
(103, 'CPL-202609-0047', 46, '2026-09-02', '2026-09-16', 'selesai', 'J. PRINT L. PANJANG', 21, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2  MINGGU\n---\nBahan: MILANO\nTenggat Waktu Excel: 2  MINGGU', 2040000.00, 2040000.00, 0.00, '', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(104, 'CPL-202609-0048', 47, '2026-09-02', '2026-09-16', 'selesai', 'J. SPECIAL', 16, NULL, 'Bahan: THUNDER\nTenggat Waktu Excel: 3 MINGGU\n---\nBahan: THUNDER\nTenggat Waktu Excel: 3 MINGGU\n---\nBahan: THUNDER\nTenggat Waktu Excel: 3 MINGGU', 2610000.00, 2610000.00, 0.00, '', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(105, 'CPL-202609-0049', 48, '2026-09-02', '2026-09-16', 'selesai', 'J. PRINT STELAN', 28, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU', 2800000.00, 2800000.00, 0.00, '', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(106, 'CPL-202609-0050', 49, '2026-09-02', '2026-09-16', 'selesai', 'J. PRINT STELAN', 44, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU', 5060000.00, 5060000.00, 0.00, '', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(107, 'CPL-202609-0051', 50, '2026-09-02', '2026-09-16', 'selesai', 'J. PRINT STELAN', 30, NULL, 'Bahan: DROPNIDLE\nTenggat Waktu Excel: 2 MINGGU', 3600000.00, 3600000.00, 0.00, '', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(108, 'CPL-202609-0052', 51, '2026-09-03', '2026-09-17', 'pemasangan', 'J. PRINT STELAN', 140, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU', 15400000.00, 7400000.00, 4550000.00, '', 1, '2026-09-21 09:34:20', '2026-09-23 10:16:58'),
(109, 'CPL-202609-0053', 52, '2026-09-03', '2026-09-17', 'packing', 'J. PRINT ATASAN', 45, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 3 MINGGU', 5400000.00, 3500000.00, 1900000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 05:02:04'),
(110, 'CPL-202609-0054', 53, '2026-09-03', '2026-09-17', 'selesai', 'J. PRINT ATASAN', 34, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU', 3060000.00, 3060000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(111, 'CPL-202609-0055', 54, '2026-09-03', '2026-09-17', 'selesai', 'J. PRINT STELAN', 6, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU', 540000.00, 540000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(112, 'CPL-202609-0056', 55, '2026-09-03', '2026-09-17', 'jahit', 'WERPACK', 32, NULL, 'Tenggat Waktu Excel: 2 MINGGU', 8000000.00, 6000000.00, 2000000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 06:28:35'),
(113, 'CPL-202609-0057', 56, '2026-09-03', '2026-09-17', 'selesai', 'J. PRINT ATASAN', 6, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU', 480000.00, 480000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(114, 'CPL-202609-0058', 57, '2026-09-03', '2026-09-17', 'jahit', 'J. PRINT OLAHRAGA', 273, NULL, 'Bahan: MILANO+LOTTO\nTenggat Waktu Excel: 4 MINGGU', 27300000.00, 15000000.00, 12300000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 06:28:54'),
(115, 'CPL-202609-0059', 58, '2026-09-03', '2026-09-17', 'jahit', 'J. PRINT STELAN+K.KAKI', 18, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 3 MINGGU', 2160000.00, 1800000.00, 360000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 06:28:54'),
(116, 'CPL-202609-0060', 59, '2026-09-04', '2026-09-18', 'selesai', 'J. PRINT STELAN', 24, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU', 2640000.00, 2640000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(117, 'CPL-202609-0061', 60, '2026-09-04', '2026-09-18', 'jahit', 'J. PRINT STELAN', 105, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU\n---\nBahan: MILANO\nTenggat Waktu Excel: 2 MINGGU', 8490000.00, 3000000.00, 5490000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 06:29:04'),
(118, 'CPL-202609-0062', 61, '2026-09-04', '2026-09-18', 'selesai', 'J. PRINT STELAN', 14, NULL, 'Bahan: EMBOSH\nTenggat Waktu Excel: 2 MINGGU', 1820000.00, 1820000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(119, 'CPL-202609-0063', 62, '2026-09-04', '2026-09-18', 'selesai', 'J. PRINT STELAN', 5, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU', 600000.00, 600000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(120, 'CPL-202609-0064', 63, '2026-09-04', '2026-09-18', 'selesai', 'J. PRINT STELAN', 80, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 4 MINGGU', 8800000.00, 5400000.00, 3400000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 04:04:19'),
(121, 'CPL-202609-0065', 64, '2026-09-04', '2026-09-18', 'selesai', 'J. PRINT ATASAN', 21, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 1 MINGGU\n---\nBahan: MILANO\nTenggat Waktu Excel: 1 MINGGU', 2380000.00, 2380000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(122, 'CPL-202609-0066', 65, '2026-09-05', '2026-09-19', 'selesai', 'J. PRINT STELAN', 15, NULL, 'Bahan: EMBOSH\nTenggat Waktu Excel: 1 MINGGU', 2025000.00, 2025000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(123, 'CPL-202609-0067', 66, '2026-09-05', '2026-09-19', 'selesai', 'J. PRINT OLAHRAGA', 481, NULL, 'Bahan: MILANO+LOTTO\nTenggat Waktu Excel: 4 MINGGU', 48100000.00, 48100000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(124, 'CPL-202609-0068', 67, '2026-09-05', '2026-09-19', 'selesai', 'J. FULL PRINT', 52, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU\n---\nBahan: NYLON\nTenggat Waktu Excel: 2 MINGGU', 3740000.00, 3740000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(125, 'CPL-202609-0069', 68, '2026-09-05', '2026-09-19', 'selesai', 'J. FULL PRINT', 15, NULL, 'Bahan: EMBOSH\nTenggat Waktu Excel: 2  MINGGU', 1875000.00, 1875000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(126, 'CPL-202609-0070', 69, '2026-09-05', '2026-09-19', 'selesai', 'J. FULL PRINT', 10, NULL, 'Bahan: EMBOSH\nTenggat Waktu Excel: 2  MINGGU', 1250000.00, 1250000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(127, 'CPL-202609-0071', 70, '2026-09-05', '2026-09-19', 'selesai', 'J. FULL PRINT STELAN', 29, NULL, 'Bahan: EMBOSH\nTenggat Waktu Excel: 2 MINGGU\n---\nBahan: EMBOSH\nTenggat Waktu Excel: 2 MINGGU', 3185000.00, 3185000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(128, 'CPL-202609-0072', 71, '2026-09-07', '2026-09-21', 'printing', 'J. PRINT STELAN ANAK', 68, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 3 MINGGU', 8160000.00, 1800000.00, 6360000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 04:06:23'),
(129, 'CPL-202609-0073', 72, '2026-09-07', '2026-09-21', 'selesai', 'OLAHRAGA MANUAL', 91, NULL, 'Bahan: PE\nTenggat Waktu Excel: 3 MINGGU', 6825000.00, 6825000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(130, 'CPL-202609-0074', 73, '2026-09-07', '2026-09-21', 'selesai', 'J. PRINT ATASAN', 15, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU', 1500000.00, 1500000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(131, 'CPL-202609-0075', 74, '2026-09-07', '2026-09-21', 'selesai', 'J. SPECIAL', 33, NULL, 'Bahan: THUNDER\nTenggat Waktu Excel: 3 MINGGU\n---\nBahan: THUNDER\nTenggat Waktu Excel: 3 MINGGU', 5785000.00, 5785000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(132, 'CPL-202609-0076', 75, '2026-09-07', '2026-09-21', 'jahit', 'J. PRINT ATASAN', 47, NULL, 'Bahan: BENZEMA\nTenggat Waktu Excel: 3 MINGGU', 3995000.00, 1500000.00, 2495000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 06:30:22'),
(133, 'CPL-202609-0077', 2, '2026-09-08', '2026-09-22', 'selesai', 'J. PRINT STELAN', 15, NULL, 'Bahan: DROPNIDLE\nTenggat Waktu Excel: 3 MINGGU', 2100000.00, 2100000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(134, 'CPL-202609-0078', 76, '2026-09-08', '2026-09-22', 'selesai', 'J. PRINT STELAN ANAK', 41, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 3 MINGGU', 4305000.00, 4305000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(135, 'CPL-202609-0079', 77, '2026-09-08', '2026-09-22', 'printing', 'J. PRINT STELAN', 70, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 3 MINGGU\n---\nBahan: NYLON\nTenggat Waktu Excel: 3 MINGGU', 5100000.00, 1900000.00, 3200000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 04:08:14'),
(136, 'CPL-202609-0080', 78, '2026-09-08', '2026-09-22', 'selesai', 'J. PRINT OLAHRAGA', 518, NULL, 'Bahan: MILANO+LOTTO\nTenggat Waktu Excel: 4 MINGGU', 51800000.00, 51800000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(137, 'CPL-202609-0081', 79, '2026-09-08', '2026-09-22', 'pemasangan', 'J. PRINT STELAN', 77, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 4 MINGGU', 8470000.00, 7550000.00, 920000.00, '', 1, '2026-09-21 09:34:20', '2026-09-23 19:45:21'),
(138, 'CPL-202609-0082', 80, '2026-09-08', '2026-09-22', 'printing', 'J. PRINT STELAN', 81, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 4 MINGGU', 8100000.00, 8000000.00, 100000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 04:08:15'),
(139, 'CPL-202609-0083', 81, '2026-09-08', '2026-09-22', 'printing', 'J. SPECIAL, J. OFFICIAL, K. KAKI', 38, 'BAHAN THUNDER LOGO,NOMOR DEPAN,NOMOR BELAKANG PAKE PLASTISOL PECAH POLA TANGAN DAN SAMPING BADAN', 'Bahan: THUNDER\nTenggat Waktu Excel: 3 MINGGU\n---\nBahan: THUNDER\nTenggat Waktu Excel: 3 MINGGU\n---\nBahan: NYLON\nTenggat Waktu Excel: 3 MINGGU', 3620000.00, 3620000.00, 0.00, NULL, 1, '2026-09-21 09:34:20', '2026-09-22 07:08:34'),
(140, 'CPL-202609-0084', 82, '2026-09-08', '2026-09-22', 'printing', 'J. PRINT STELAN', 18, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 3 MINGGU', 1800000.00, 1300000.00, 500000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 04:08:15'),
(141, 'CPL-202609-0085', 83, '2026-09-09', '2026-09-23', 'printing', 'J. PRINT STELAN', 30, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 3 MINGGU', 4050000.00, 2900000.00, 1150000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 04:08:15'),
(142, 'CPL-202609-0086', 84, '2026-09-09', '2026-09-23', 'printing', 'J. FULL PRINT STELAN', 16, NULL, 'Bahan: THUNDER\nTenggat Waktu Excel: 3 MINGGU', 2400000.00, 740000.00, 1660000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 04:08:15'),
(143, 'CPL-202609-0087', 85, '2026-09-09', '2026-09-23', 'jahit', 'J. MANUAL', 98, NULL, 'Bahan: AIRWALK\nTenggat Waktu Excel: 3 MINGGU', 9800000.00, 8000000.00, 1800000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 06:34:26'),
(144, 'CPL-202609-0088', 86, '2026-09-10', '2026-09-24', 'selesai', 'J. PRINT STELAN ANAK', 100, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 3 MINGGU', 7000000.00, 7000000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(145, 'CPL-202609-0089', 87, '2026-09-10', '2026-09-24', 'packing', 'MANUAL L. PENDEK', 100, NULL, 'Bahan: PE+LOTTO\nTenggat Waktu Excel: 3 MINGGU\n---\nBahan: PE+LOTTO\nTenggat Waktu Excel: 3 MINGGU', 8390000.00, 2950000.00, 5440000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 06:36:01'),
(146, 'CPL-202609-0090', 88, '2026-09-10', '2026-09-24', 'selesai', 'MANUAL L. PENDEK', 100, NULL, 'Bahan: POLYMICRO\nTenggat Waktu Excel: 3 MINGGU\n---\nBahan: POLYMICRO\nTenggat Waktu Excel: 3 MINGGU', 8200000.00, 3000000.00, 5200000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 06:35:49'),
(147, 'CPL-202609-0091', 89, '2026-09-11', '2026-09-25', 'selesai', 'J. PRINT STELAN', 1, NULL, 'Bahan: THUNDER', 120000.00, 120000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(148, 'CPL-202609-0092', 90, '2026-09-11', '2026-09-25', 'selesai', 'DTF', 14, NULL, 'Bahan: DTF', 98000.00, 98000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(149, 'CPL-202609-0093', 91, '2026-09-12', '2026-09-26', 'selesai', 'J. PRINT L. PENDEK', 16, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 3 MINGGU\n---\nBahan: MILANO\nTenggat Waktu Excel: 3 MINGGU', 1690000.00, 1690000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(150, 'CPL-202609-0094', 92, '2026-09-12', '2026-09-26', 'selesai', 'J. PRINT STELAN', 24, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU\n---\nBahan: MILANO\nTenggat Waktu Excel: 2 MINGGU', 2320000.00, 2320000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(151, 'CPL-202609-0095', 93, '2026-09-12', '2026-09-26', 'printing', 'J. SPECIAL', 24, NULL, 'Bahan: THUNDER\nTenggat Waktu Excel: 2 MINGGU', 3840000.00, 2000000.00, 1840000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 04:09:56'),
(152, 'CPL-202609-0096', 94, '2026-09-12', '2026-09-26', 'selesai', 'J. FULL PRINT', 14, NULL, 'Bahan: THUNDER\nTenggat Waktu Excel: 2 MINGGU', 2240000.00, 1000000.00, 1240000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 06:36:17'),
(153, 'CPL-202609-0097', 95, '2026-09-12', '2026-09-26', 'selesai', 'J. SPECIAL', 25, NULL, 'Bahan: STRAW\nTenggat Waktu Excel: 2 MINGGU', 4150000.00, 4150000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(154, 'CPL-202609-0098', 96, '2026-09-12', '2026-09-26', 'selesai', 'MANUAL', 40, NULL, 'Bahan: LACOST\nTenggat Waktu Excel: 3 MINGGU', 4000000.00, 4000000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(155, 'CPL-202609-0099', 97, '2026-09-12', '2026-09-26', 'printing', 'J. PRINT ATASAN', 210, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 3 MINGGU', 16800000.00, 7000000.00, 9800000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 04:09:56'),
(156, 'CPL-202609-0100', 98, '2026-09-12', '2026-09-26', 'selesai', 'J. PRINT L. PENDEK', 25, NULL, 'Bahan: MILANO\n---\nBahan: MILANO', 2760000.00, 2760000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(157, 'CPL-202609-0101', 99, '2026-09-12', '2026-09-26', 'selesai', 'J. PRINT ATASAN', 26, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 3 MINGGU', 2730000.00, 2730000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(158, 'CPL-202609-0102', 100, '2026-09-12', '2026-09-26', 'printing', 'J. PRINT STELAN', 8, NULL, 'Bahan: EMBOSH\nTenggat Waktu Excel: 2 MINGGU', 680000.00, 680000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 06:36:36'),
(159, 'CPL-202609-0103', 101, '2026-09-14', '2026-09-28', 'printing', 'J. PRINT STELAN', 37, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 3 MINGGU', 4995000.00, 3000000.00, 1995000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 04:09:56'),
(160, 'CPL-202609-0104', 102, '2026-09-14', '2026-09-28', 'jahit', 'J. PRINT STELAN', 8, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU', 800000.00, 250000.00, 550000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 06:37:11'),
(161, 'CPL-202609-0105', 103, '2026-09-14', '2026-09-28', 'printing', 'J. PRINT DEWASA', 68, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 3 MINGGU\n---\nBahan: MILANO\nTenggat Waktu Excel: 3 MINGGU', 8345000.00, 3000000.00, 5345000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 04:09:56'),
(162, 'CPL-202609-0106', 104, '2026-09-14', '2026-09-28', 'selesai', 'J. PRINT STELAN', 18, NULL, 'Bahan: AIRWALK\nTenggat Waktu Excel: 3 MINGGU', 2700000.00, 2700000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(163, 'CPL-202609-0107', 105, '2026-09-14', '2026-09-28', 'selesai', 'J. PRINT STELAN', 19, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 3 MINGGU', 2185000.00, 1800000.00, 385000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 06:37:33'),
(164, 'CPL-202609-0108', 106, '2026-09-15', '2026-09-29', 'selesai', 'J. PRINT STELAN', 37, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 3 MINGGU', 4070000.00, 4070000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(165, 'CPL-202609-0109', 107, '2026-09-15', '2026-09-29', 'printing', 'J. PRINT STELAN', 21, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 3 MINGGU', 1890000.00, 500000.00, 1390000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 04:10:49'),
(166, 'CPL-202609-0110', 108, '2026-09-15', '2026-09-29', 'selesai', 'J. PRINT ATASAN', 57, NULL, 'Bahan: THUNDER\nTenggat Waktu Excel: 3 MINGGU', 6270000.00, 6270000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(167, 'CPL-202609-0111', 109, '2026-09-15', '2026-09-29', 'selesai', 'J. PRINT STELAN', 8, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 3 MINGGU', 800000.00, 800000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(168, 'CPL-202609-0112', 110, '2026-09-15', '2026-09-29', 'selesai', 'J. PRINT STELAN', 57, NULL, 'Bahan: AIRWALK\nTenggat Waktu Excel: 3 MINGGU\n---\nBahan: AIRWALK\nTenggat Waktu Excel: 3 MINGGU', 7380000.00, 7380000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(169, 'CPL-202609-0113', 111, '2026-09-15', '2026-09-29', 'selesai', 'J. PRINT+K.KAKI', 24, NULL, 'Bahan: THUNDER\nTenggat Waktu Excel: 2 MINGGU\n---\nBahan: THUNDER\nTenggat Waktu Excel: 2 MINGGU', 4005000.00, 2000000.00, 2005000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 06:39:08'),
(170, 'CPL-202609-0114', 112, '2026-09-15', '2026-09-29', 'printing', 'J. PRINT STELAN', 12, NULL, 'Bahan: THUNDER\nTenggat Waktu Excel: 3 MINGGU', 1680000.00, 840000.00, 840000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 04:10:49'),
(171, 'CPL-202609-0115', 39, '2026-09-16', '2026-09-30', 'selesai', 'J. PRINT STELAN', 5, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU', 500000.00, 500000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(172, 'CPL-202609-0116', 113, '2026-09-16', '2026-09-30', 'printing', 'J. PRINT STELAN', 83, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 3 MINGGU', 9130000.00, 1000000.00, 8130000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 04:10:49'),
(173, 'CPL-202609-0117', 114, '2026-09-16', '2026-09-30', 'printing', 'JAKET FULL PRINT', 8, NULL, 'Bahan: SCUBA\nTenggat Waktu Excel: 3 MINGGU', 2000000.00, 1000000.00, 1000000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 04:10:49'),
(174, 'CPL-202609-0118', 115, '2026-09-16', '2026-09-30', 'printing', 'J. PRINT STELAN', 13, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 3 MINGGU', 1560000.00, 500000.00, 1060000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 04:10:49'),
(175, 'CPL-202609-0119', 116, '2026-09-16', '2026-09-30', 'selesai', 'J. PRINT STELAN', 11, NULL, 'Bahan: EMBOSH\nTenggat Waktu Excel: 2 MINGGU', 1815000.00, 1815000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(176, 'CPL-202609-0120', 29, '2026-09-17', '2026-10-01', 'selesai', 'J. PRINT ATASAN', 52, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU', 4940000.00, 4750000.00, 190000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 06:39:08'),
(177, 'CPL-202609-0121', 117, '2026-09-17', '2026-10-01', 'printing', 'J. PRINT STELAN', 7, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU', 840000.00, 600000.00, 240000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 04:10:49'),
(178, 'CPL-202609-0122', 118, '2026-09-17', '2026-10-01', 'selesai', 'J. PRINT ATASAN', 43, NULL, 'Bahan: AIRWALK\nTenggat Waktu Excel: 2 MINGGU', 6020000.00, 6020000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(179, 'CPL-202609-0123', 119, '2026-09-17', '2026-10-01', 'printing', 'J. PRINT ATASAN', 30, NULL, 'Bahan: BRAZIL\nTenggat Waktu Excel: 3 MINGGU', 3000000.00, 1200000.00, 1800000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 04:10:49'),
(180, 'CPL-202609-0124', 120, '2026-09-17', '2026-10-01', 'printing', 'J. FULL PRINT', 8, NULL, 'Bahan: EMBOSH\nTenggat Waktu Excel: 1 MINGGU\n---\nBahan: EMBOSH\nTenggat Waktu Excel: 1 MINGGU', 960000.00, 600000.00, 360000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 04:11:44'),
(181, 'CPL-202609-0125', 121, '2026-09-17', '2026-10-01', 'printing', 'J. PRINT STELAN', 14, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 2 MINGGU', 1400000.00, 1400000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 04:11:45'),
(182, 'CPL-202609-0126', 122, '2026-09-18', '2026-10-02', 'selesai', 'J. PRINT STELAN', 16, NULL, 'Bahan: MILANO', 1600000.00, 1600000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(183, 'CPL-202609-0127', 123, '2026-09-18', '2026-10-02', 'printing', 'J. PRINT STELAN', 66, NULL, 'Bahan: MILANO\nTenggat Waktu Excel: 3 MINGGU', 7590000.00, 3750000.00, 3840000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 04:11:45'),
(184, 'CPL-202609-0128', 124, '2026-09-18', '2026-10-02', 'printing', 'J. PRINT ATASAN', 1, NULL, 'Bahan: HARMONI\nTenggat Waktu Excel: 2 MINGGU', 120000.00, 100000.00, 20000.00, '', 1, '2026-09-21 09:34:20', '2026-09-22 04:11:45'),
(185, 'CPL-202609-0129', 125, '2026-09-19', '2026-10-03', 'selesai', 'J. PRINT STELAN', 10, NULL, 'Bahan: MILANO', 850000.00, 850000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(186, 'CPL-202609-0130', 39, '2026-09-19', '2026-10-03', 'selesai', 'J. PRINT STELAN', 5, NULL, 'Bahan: MILANO', 500000.00, 500000.00, 0.00, '', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(187, 'CPL-202609-0131', 126, '2026-09-22', '2026-10-05', 'printing', 'J. PRINT+TRENING', 8, NULL, NULL, 1360000.00, 500000.00, 860000.00, NULL, 1, '2026-09-21 10:50:15', '2026-09-21 11:52:56'),
(189, 'CPL-202609-0132', 128, '2026-09-22', '2026-10-05', 'printing', 'J. PRINT STELAN, J. MANUAL, KAOS KAKI', 87, NULL, NULL, 5510000.00, 2000000.00, 3510000.00, NULL, 1, '2026-09-21 11:58:10', '2026-09-21 11:59:15'),
(190, 'CPL-202609-0133', 127, '2026-09-22', '2026-10-05', 'printing', 'J. PRINT STELAN', 69, NULL, NULL, 7590000.00, 4740000.00, 2850000.00, NULL, 1, '2026-09-21 12:01:56', '2026-09-21 12:02:11'),
(191, 'CPL-202609-0134', 129, '2026-09-22', '2026-09-30', 'jahit', '2 J. PRINT STELAN', 40, NULL, NULL, 8000000.00, 0.00, 8000000.00, NULL, 1, '2026-09-22 05:44:37', '2026-09-22 05:45:16'),
(192, 'CPL-202609-0135', 130, '2026-09-22', '2026-09-27', 'pemasangan', 'J. PRINT ATASAN L. PENDEK ANAK, J. PRINT ATASAN L. PANJANG ANAK, J. PRINT ATASAN L. PENDEK DEWASA, J. PRINT ATASAN L. PANJANG', 47, NULL, NULL, 4335000.00, 0.00, 4335000.00, NULL, 1, '2026-09-22 06:55:17', '2026-09-22 08:11:44'),
(193, 'CPL-202609-0136', 131, '2026-09-22', '2026-09-27', 'pemasangan', 'JAKET ANAK, J. PRINT ANAK, J. PRINT DEWASA', 92, NULL, NULL, 9080000.00, 0.00, 9080000.00, NULL, 1, '2026-09-22 07:24:24', '2026-09-22 08:08:46'),
(194, 'CPL-202609-0137', 132, '2026-09-22', '2026-09-26', 'jahit', 'J. PRINT STELAN', 19, NULL, NULL, 2280000.00, 0.00, 2280000.00, NULL, 1, '2026-09-22 07:25:40', '2026-09-22 07:25:50'),
(195, 'CPL-202609-0138', 133, '2026-09-22', '2026-09-26', 'printing', 'J. PRINT ANAK', 30, NULL, NULL, 2400000.00, 0.00, 2400000.00, NULL, 1, '2026-09-22 07:27:47', '2026-09-22 07:27:56'),
(196, 'CPL-202609-0139', 134, '2026-09-22', '2026-10-05', 'printing', 'J.  EMBOSH PRINT STELAN', 18, NULL, NULL, 2250000.00, 0.00, 2250000.00, NULL, 1, '2026-09-22 07:31:09', '2026-09-23 08:28:28'),
(197, 'CPL-202609-0140', 86, '2026-09-22', '2026-10-06', 'printing', 'J. PRINT ANAK', 50, NULL, NULL, 3500000.00, 0.00, 3500000.00, NULL, 1, '2026-09-22 07:36:05', '2026-09-22 07:36:16'),
(198, 'CPL-202609-0141', 135, '2026-09-22', '2026-09-25', 'pemasangan', 'J. PRINT STELAN', 56, NULL, NULL, 6160000.00, 0.00, 6160000.00, NULL, 1, '2026-09-22 07:39:00', '2026-09-23 11:07:57'),
(200, 'CPL-202609-0142', 137, '2026-09-22', '2026-09-29', 'printing', 'J. PRINT STELAN', 14, NULL, NULL, 1540000.00, 0.00, 1540000.00, NULL, 1, '2026-09-22 08:36:23', '2026-09-22 08:39:01'),
(201, 'CPL-202609-0143', 138, '2026-09-22', '2026-09-26', 'printing', 'J. PRINT STELAN', 5, NULL, NULL, 425000.00, 0.00, 425000.00, NULL, 1, '2026-09-22 08:50:20', '2026-09-22 08:50:35'),
(202, 'CPL-202609-0144', 139, '2026-09-22', '2026-09-29', 'printing', 'J. PRINT STELAN', 4, NULL, NULL, 380000.00, 0.00, 380000.00, NULL, 1, '2026-09-22 08:52:34', '2026-09-22 08:56:34'),
(203, 'CPL-202609-0145', 140, '2026-09-22', '2026-09-29', 'printing', 'J. SPECIAL, K. KAKI', 2, NULL, NULL, 190000.00, 0.00, 190000.00, NULL, 1, '2026-09-22 08:54:50', '2026-09-22 08:55:33'),
(204, 'CPL-202609-0146', 141, '2026-09-22', '2026-10-06', 'printing', 'J.  AIRWALK PRINT ATASAN', 17, 'BAHAN AIRWALK YA GES YA', NULL, 1700000.00, 920000.00, 780000.00, NULL, 1, '2026-09-22 09:02:34', '2026-09-23 08:28:01'),
(205, 'CPL-202609-0147', 142, '2026-09-23', '2026-09-23', 'dikirim', 'J. PRINT STELAN', 25, NULL, NULL, 2750000.00, 0.00, 2750000.00, NULL, 1, '2026-09-22 10:52:45', '2026-09-22 10:53:47'),
(206, 'CPL-202609-0148', 143, '2026-09-23', '2026-10-14', 'draft', 'J. MILANO PRINT STELAN ANAK', 27, 'BAHAN MILANO CELANA MANUAL YA GES YA', NULL, 2700000.00, 1000000.00, 1700000.00, 'OMAT IEU MH', 1, '2026-09-23 04:54:05', '2026-09-23 08:27:28'),
(207, 'CPL-202609-0149', 144, '2026-09-23', '2026-10-03', 'draft', 'J. MILANO PRINT STELAN KELAS 10, 2 J. MILANO PRINT STELAN  KELAS 11', 37, NULL, NULL, 4700000.00, 3700000.00, 1000000.00, NULL, 1, '2026-09-23 06:57:30', '2026-09-23 08:27:03'),
(208, 'CPL-202609-0150', 145, '2026-09-23', '2026-10-14', 'draft', 'J. EMBOSH FULL PRINT', 31, NULL, NULL, 4650000.00, 2400000.00, 2250000.00, NULL, 1, '2026-09-23 08:00:00', '2026-09-23 08:00:00'),
(209, 'CPL-202609-0151', 146, '2026-09-23', '2026-09-23', 'selesai', 'J. PRINT STELAN', 11, NULL, NULL, 1100000.00, 1100000.00, 0.00, NULL, 1, '2026-09-23 08:16:33', '2026-09-23 08:16:38'),
(210, 'CPL-202609-0152', 147, '2026-09-23', '2026-10-14', 'draft', 'J. MILANO PRINT STELAN', 18, NULL, NULL, 1800000.00, 0.00, 1800000.00, NULL, 1, '2026-09-23 08:22:26', '2026-09-23 08:26:37'),
(211, 'CPL-202609-0153', 148, '2026-09-23', '2026-10-23', 'draft', 'J. PRINT OLAHRAGA', 200, NULL, NULL, 20000000.00, 10000000.00, 10000000.00, NULL, 1, '2026-09-23 08:35:36', '2026-09-23 08:35:36'),
(212, 'CPL-202609-0154', 149, '2026-09-24', '2026-10-15', 'draft', 'J. EMBOSH PRINT STELAN', 14, NULL, NULL, 1820000.00, 900000.00, 920000.00, NULL, 1, '2026-09-24 06:47:51', '2026-09-24 06:47:51');

-- --------------------------------------------------------

--
-- Table structure for table `order_files`
--

CREATE TABLE `order_files` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `tipe` enum('desain','referensi','bukti_bayar','qc','lainnya') NOT NULL,
  `nama_file` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `uploaded_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `jenis_produk` varchar(255) NOT NULL,
  `ukuran` varchar(255) DEFAULT NULL,
  `jumlah_pcs` int(11) NOT NULL,
  `harga_satuan` decimal(12,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `jenis_produk`, `ukuran`, `jumlah_pcs`, `harga_satuan`, `created_at`, `updated_at`) VALUES
(59, 56, 'J. SPECIAL', NULL, 43, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(60, 57, 'MANUAL', NULL, 27, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(61, 58, 'J. PRINT STELAN', NULL, 64, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(62, 58, 'J. PRINT ATASAN', NULL, 5, NULL, '2026-09-17 12:35:50', '2026-09-17 12:54:22'),
(63, 60, 'J. PRINT STELAN', NULL, 19, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(64, 61, 'J. PRINT OLAHRAGA', NULL, 50, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(65, 62, 'LEKMONG', NULL, 28, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(66, 63, 'J. PRINT STELAN', NULL, 20, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(67, 64, 'JAKET MANUAL', NULL, 45, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(68, 65, 'J. PRINT STELAN', NULL, 11, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(69, 65, 'J. PRINT STELAN LEKMONG', NULL, 20, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(70, 65, 'J. PRINT ATASAN LEKMONG', NULL, 2, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(71, 66, 'J. PRINT STELAN+K.KAKI', NULL, 31, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(72, 67, 'J. PRINT STELAN', NULL, 45, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(73, 67, 'J. PRINT ATASAN', NULL, 10, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(74, 67, 'J. PRINT ATASAN DEWASA', NULL, 6, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(75, 68, 'OLAHRAGA MANUAL ANAK', NULL, 50, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(77, 70, 'J. PRINT STELAN', NULL, 22, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(78, 71, 'JAKET PRINT', NULL, 12, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(80, 73, 'J. PRINT STELAN OLAHRAGA', NULL, 405, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(81, 74, 'J. PRINT STELAN', NULL, 20, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(83, 76, 'J. PRINT STELAN', NULL, 40, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(84, 76, 'J. PRINT STELAN ANAK', NULL, 3, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(86, 78, 'J. PRINT STELAN', NULL, 20, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(87, 79, 'J. PRINT STELAN', NULL, 59, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(88, 80, 'J. PRINT STELAN', NULL, 67, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(89, 81, 'J. PRINT STELAN', NULL, 11, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(90, 82, 'J. PRINT ANAK', NULL, 22, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(91, 83, 'J. PRINT STELAN OLAHRAGA', NULL, 200, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(93, 85, 'J. PRINT STELAN', NULL, 78, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(94, 86, 'J. SPECIAL', NULL, 23, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(95, 86, 'J. SPECIAL ANAK', NULL, 1, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(96, 87, 'J. FULL PRINT', NULL, 16, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(97, 88, 'J. PRINT STELAN', NULL, 19, NULL, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(98, 84, 'J. PRINT ATASAN', NULL, 52, NULL, '2026-09-18 03:20:08', '2026-09-18 03:20:08'),
(99, 75, 'JAKET, COTTON', NULL, 37, NULL, '2026-09-18 03:24:37', '2026-09-18 03:24:37'),
(100, 89, 'Lainnya', 'S', 1, NULL, '2026-09-18 03:58:31', '2026-09-18 03:58:31'),
(101, 89, 'Lainnya', 'M', 19, NULL, '2026-09-18 03:58:31', '2026-09-18 03:58:31'),
(102, 89, 'Lainnya', 'L', 230, NULL, '2026-09-18 03:58:31', '2026-09-18 03:58:31'),
(103, 89, 'Lainnya', 'XL', 102, NULL, '2026-09-18 03:58:31', '2026-09-18 03:58:31'),
(104, 89, 'Lainnya', 'XXL', 18, NULL, '2026-09-18 03:58:31', '2026-09-18 03:58:31'),
(105, 69, 'MANUAL', NULL, 46, NULL, '2026-09-21 02:07:20', '2026-09-21 02:07:20'),
(122, 92, 'KAOS KAKI', 'S', 50, NULL, '2026-09-21 05:05:41', '2026-09-21 05:05:41'),
(123, 93, 'J. FULL PRINT', NULL, 12, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(124, 94, 'J. PRINT ATASAN', NULL, 10, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(125, 95, 'J. PRINT STELAN', NULL, 10, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(126, 96, 'J. PRINT STELAN', NULL, 12, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(128, 98, 'J. FULL PRINT', NULL, 29, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(129, 99, 'J. PRINT ATASAN', NULL, 24, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(130, 99, 'J. PRINT ATASAN DOUBLE SIZE', NULL, 1, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(131, 100, 'J. PRINT SPECIAL', NULL, 35, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(132, 101, 'J. PRINT+K.KAKI', NULL, 7, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(133, 101, 'J. PRINT+K.KAKI', NULL, 1, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(134, 102, 'J. PRINT STELAN', NULL, 21, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(135, 103, 'J. PRINT L. PANJANG', NULL, 15, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(136, 103, 'J. PRINT L. PANJANG', NULL, 6, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(137, 104, 'J. SPECIAL', NULL, 11, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(138, 104, 'J. SPECIAL ATASAN', NULL, 1, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(139, 104, 'J. SPECIAL ANAK', NULL, 4, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(140, 105, 'J. PRINT STELAN', NULL, 28, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(141, 106, 'J. PRINT STELAN', NULL, 44, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(142, 107, 'J. PRINT STELAN', NULL, 30, NULL, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(143, 108, 'J. PRINT STELAN', NULL, 140, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(144, 109, 'J. PRINT ATASAN', NULL, 45, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(145, 110, 'J. PRINT ATASAN', NULL, 34, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(146, 111, 'J. PRINT STELAN', NULL, 6, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(147, 112, 'WERPACK', NULL, 32, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(148, 113, 'J. PRINT ATASAN', NULL, 6, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(149, 114, 'J. PRINT OLAHRAGA', NULL, 273, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(150, 115, 'J. PRINT STELAN+K.KAKI', NULL, 18, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(151, 116, 'J. PRINT STELAN', NULL, 24, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(152, 117, 'J. PRINT STELAN', NULL, 54, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(153, 117, 'LEKMONG MANUAL', NULL, 51, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(154, 118, 'J. PRINT STELAN', NULL, 14, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(155, 119, 'J. PRINT STELAN', NULL, 5, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(156, 120, 'J. PRINT STELAN', NULL, 80, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(157, 121, 'J. PRINT ATASAN', NULL, 14, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(158, 121, 'J. PRINT ATASAN', NULL, 7, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(159, 122, 'J. PRINT STELAN', NULL, 15, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(160, 123, 'J. PRINT OLAHRAGA', NULL, 481, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(161, 124, 'J. FULL PRINT', NULL, 27, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(162, 124, 'K. KAKI', NULL, 25, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(163, 125, 'J. FULL PRINT', NULL, 15, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(164, 126, 'J. FULL PRINT', NULL, 10, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(165, 127, 'J. FULL PRINT STELAN', NULL, 18, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(166, 127, 'J. FULL PRINT ATASAN', NULL, 11, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(167, 128, 'J. PRINT STELAN ANAK', NULL, 68, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(168, 129, 'OLAHRAGA MANUAL', NULL, 91, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(169, 130, 'J. PRINT ATASAN', NULL, 15, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(170, 131, 'J. SPECIAL', NULL, 32, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(171, 131, 'J. SPECIAL L. PJG', NULL, 1, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(172, 132, 'J. PRINT ATASAN', NULL, 47, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(173, 133, 'J. PRINT STELAN', NULL, 15, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(174, 134, 'J. PRINT STELAN ANAK', NULL, 41, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(175, 135, 'J. PRINT STELAN', NULL, 37, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(176, 135, 'K. KAKI', NULL, 33, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(177, 136, 'J. PRINT OLAHRAGA', NULL, 518, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(178, 137, 'J. PRINT STELAN', NULL, 77, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(179, 138, 'J. PRINT STELAN', NULL, 81, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(183, 140, 'J. PRINT STELAN', NULL, 18, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(184, 141, 'J. PRINT STELAN', NULL, 30, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(185, 142, 'J. FULL PRINT STELAN', NULL, 16, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(186, 143, 'J. MANUAL', NULL, 98, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(187, 144, 'J. PRINT STELAN ANAK', NULL, 100, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(188, 145, 'MANUAL L. PENDEK', NULL, 22, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(189, 145, 'MANUAL L. PANJANG', NULL, 78, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(190, 146, 'MANUAL L. PENDEK', NULL, 30, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(191, 146, 'MANUAL L. PANJANG', NULL, 70, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(192, 147, 'J. PRINT STELAN', NULL, 1, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(193, 148, 'DTF', NULL, 14, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(194, 149, 'J. PRINT L. PENDEK', NULL, 9, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(195, 149, 'J. PRINT L. PANJANG', NULL, 7, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(196, 150, 'J. PRINT STELAN', NULL, 20, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(197, 150, 'J. PRINT ATASAN', NULL, 4, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(198, 151, 'J. SPECIAL', NULL, 24, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(199, 152, 'J. FULL PRINT', NULL, 14, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(200, 153, 'J. SPECIAL', NULL, 25, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(201, 154, 'MANUAL', NULL, 40, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(202, 155, 'J. PRINT ATASAN', NULL, 210, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(203, 156, 'J. PRINT L. PENDEK', NULL, 24, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(204, 156, 'J. PRINT ATASAN L. PANJANG', NULL, 1, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(205, 157, 'J. PRINT ATASAN', NULL, 26, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(206, 158, 'J. PRINT STELAN', NULL, 8, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(207, 159, 'J. PRINT STELAN', NULL, 37, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(208, 160, 'J. PRINT STELAN', NULL, 8, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(209, 161, 'J. PRINT DEWASA', NULL, 35, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(210, 161, 'J. PRINT ANAK', NULL, 33, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(211, 162, 'J. PRINT STELAN', NULL, 18, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(212, 163, 'J. PRINT STELAN', NULL, 19, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(213, 164, 'J. PRINT STELAN', NULL, 37, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(214, 165, 'J. PRINT STELAN', NULL, 21, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(215, 166, 'J. PRINT ATASAN', NULL, 57, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(216, 167, 'J. PRINT STELAN', NULL, 8, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(217, 168, 'J. PRINT STELAN', NULL, 56, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(218, 168, 'J. PRINT STELAN ANAK', NULL, 1, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(219, 169, 'J. PRINT+K.KAKI', NULL, 21, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(220, 169, 'J. PRINT ATASAN', NULL, 3, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(221, 170, 'J. PRINT STELAN', NULL, 12, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(222, 171, 'J. PRINT STELAN', NULL, 5, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(223, 172, 'J. PRINT STELAN', NULL, 83, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(224, 173, 'JAKET FULL PRINT', NULL, 8, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(225, 174, 'J. PRINT STELAN', NULL, 13, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(226, 175, 'J. PRINT STELAN', NULL, 11, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(227, 176, 'J. PRINT ATASAN', NULL, 52, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(228, 177, 'J. PRINT STELAN', NULL, 7, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(229, 178, 'J. PRINT ATASAN', NULL, 43, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(230, 179, 'J. PRINT ATASAN', NULL, 30, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(231, 180, 'J. FULL PRINT', NULL, 6, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(232, 180, 'J. FULL PRINT ANAK', NULL, 2, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(233, 181, 'J. PRINT STELAN', NULL, 14, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(234, 182, 'J. PRINT STELAN', NULL, 16, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(235, 183, 'J. PRINT STELAN', NULL, 66, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(236, 184, 'J. PRINT ATASAN', NULL, 1, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(237, 185, 'J. PRINT STELAN', NULL, 10, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(238, 186, 'J. PRINT STELAN', NULL, 5, NULL, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(239, 187, 'J. PRINT+TRENING', 'M', 4, NULL, '2026-09-21 10:50:15', '2026-09-21 10:50:15'),
(240, 187, 'J. PRINT+TRENING', 'S', 1, NULL, '2026-09-21 10:50:15', '2026-09-21 10:50:15'),
(241, 187, 'J. PRINT+TRENING', 'XL', 1, NULL, '2026-09-21 10:50:15', '2026-09-21 10:50:15'),
(242, 187, 'J. PRINT+TRENING', 'XXL', 1, NULL, '2026-09-21 10:50:15', '2026-09-21 10:50:15'),
(243, 187, 'J. PRINT+TRENING', '3XL', 1, NULL, '2026-09-21 10:50:15', '2026-09-21 10:50:15'),
(268, 189, 'J. PRINT STELAN', 'S', 13, NULL, '2026-09-21 11:58:10', '2026-09-21 11:58:10'),
(269, 189, 'J. PRINT STELAN', 'M', 6, NULL, '2026-09-21 11:58:10', '2026-09-21 11:58:10'),
(270, 189, 'J. PRINT STELAN', 'L', 7, NULL, '2026-09-21 11:58:10', '2026-09-21 11:58:10'),
(271, 189, 'J. PRINT STELAN', '8XL', 3, NULL, '2026-09-21 11:58:10', '2026-09-21 11:58:10'),
(272, 189, 'J. MANUAL', 'S', 13, NULL, '2026-09-21 11:58:10', '2026-09-21 11:58:10'),
(273, 189, 'J. MANUAL', 'M', 6, NULL, '2026-09-21 11:58:10', '2026-09-21 11:58:10'),
(274, 189, 'J. MANUAL', 'L', 7, NULL, '2026-09-21 11:58:10', '2026-09-21 11:58:10'),
(275, 189, 'J. MANUAL', '8XL', 3, NULL, '2026-09-21 11:58:10', '2026-09-21 11:58:10'),
(276, 189, 'KAOS KAKI', 'S', 13, NULL, '2026-09-21 11:58:10', '2026-09-21 11:58:10'),
(277, 189, 'KAOS KAKI', 'M', 6, NULL, '2026-09-21 11:58:10', '2026-09-21 11:58:10'),
(278, 189, 'KAOS KAKI', 'L', 7, NULL, '2026-09-21 11:58:10', '2026-09-21 11:58:10'),
(279, 189, 'KAOS KAKI', '8XL', 3, NULL, '2026-09-21 11:58:10', '2026-09-21 11:58:10'),
(280, 190, 'J. PRINT STELAN', 'S', 30, NULL, '2026-09-21 12:01:56', '2026-09-21 12:01:56'),
(281, 190, 'J. PRINT STELAN', 'M', 30, NULL, '2026-09-21 12:01:56', '2026-09-21 12:01:56'),
(282, 190, 'J. PRINT STELAN', 'L', 9, NULL, '2026-09-21 12:01:56', '2026-09-21 12:01:56'),
(311, 91, 'J. PRINT L. PANJANG', 'XS Panjang', 44, NULL, '2026-09-22 04:51:59', '2026-09-22 04:51:59'),
(312, 91, 'J. PRINT L. PENDEK', 'XS', 19, NULL, '2026-09-22 04:51:59', '2026-09-22 04:51:59'),
(313, 191, '2 J. PRINT STELAN', 'XS', 40, NULL, '2026-09-22 05:44:37', '2026-09-22 05:44:37'),
(314, 192, 'J. PRINT ATASAN L. PENDEK ANAK', 'S', 6, NULL, '2026-09-22 06:55:17', '2026-09-22 06:55:17'),
(315, 192, 'J. PRINT ATASAN L. PENDEK ANAK', 'M', 6, NULL, '2026-09-22 06:55:17', '2026-09-22 06:55:17'),
(316, 192, 'J. PRINT ATASAN L. PANJANG ANAK', 'XS Panjang', 1, NULL, '2026-09-22 06:55:17', '2026-09-22 06:55:17'),
(317, 192, 'J. PRINT ATASAN L. PANJANG ANAK', 'S Panjang', 1, NULL, '2026-09-22 06:55:17', '2026-09-22 06:55:17'),
(318, 192, 'J. PRINT ATASAN L. PENDEK DEWASA', 'S', 11, NULL, '2026-09-22 06:55:17', '2026-09-22 06:55:17'),
(319, 192, 'J. PRINT ATASAN L. PENDEK DEWASA', 'M', 9, NULL, '2026-09-22 06:55:17', '2026-09-22 06:55:17'),
(320, 192, 'J. PRINT ATASAN L. PENDEK DEWASA', 'XL', 3, NULL, '2026-09-22 06:55:17', '2026-09-22 06:55:17'),
(321, 192, 'J. PRINT ATASAN L. PENDEK DEWASA', 'XXL', 1, NULL, '2026-09-22 06:55:17', '2026-09-22 06:55:17'),
(322, 192, 'J. PRINT ATASAN L. PENDEK DEWASA', 'XS', 3, NULL, '2026-09-22 06:55:17', '2026-09-22 06:55:17'),
(323, 192, 'J. PRINT ATASAN L. PANJANG', 'XS Panjang', 2, NULL, '2026-09-22 06:55:17', '2026-09-22 06:55:17'),
(324, 192, 'J. PRINT ATASAN L. PANJANG', 'S Panjang', 3, NULL, '2026-09-22 06:55:17', '2026-09-22 06:55:17'),
(325, 192, 'J. PRINT ATASAN L. PANJANG', 'M Panjang', 1, NULL, '2026-09-22 06:55:17', '2026-09-22 06:55:17'),
(326, 139, 'J. SPECIAL', NULL, 18, NULL, '2026-09-22 07:08:34', '2026-09-22 07:08:34'),
(327, 139, 'J. OFFICIAL', NULL, 2, NULL, '2026-09-22 07:08:34', '2026-09-22 07:08:34'),
(328, 139, 'K. KAKI', NULL, 18, NULL, '2026-09-22 07:08:34', '2026-09-22 07:08:34'),
(329, 193, 'JAKET ANAK', 'XS', 32, NULL, '2026-09-22 07:24:24', '2026-09-22 07:24:24'),
(330, 193, 'J. PRINT ANAK', 'XS', 56, NULL, '2026-09-22 07:24:24', '2026-09-22 07:24:24'),
(331, 193, 'J. PRINT DEWASA', 'XS', 4, NULL, '2026-09-22 07:24:24', '2026-09-22 07:24:24'),
(332, 194, 'J. PRINT STELAN', 'XS', 19, NULL, '2026-09-22 07:25:40', '2026-09-22 07:25:40'),
(333, 195, 'J. PRINT ANAK', 'XS', 30, NULL, '2026-09-22 07:27:47', '2026-09-22 07:27:47'),
(335, 72, 'J. PRINT STELAN', 'XS', 12, NULL, '2026-09-22 07:32:50', '2026-09-22 07:32:50'),
(336, 197, 'J. PRINT ANAK', 'XS', 50, NULL, '2026-09-22 07:36:05', '2026-09-22 07:36:05'),
(337, 198, 'J. PRINT STELAN', 'XS', 56, NULL, '2026-09-22 07:39:00', '2026-09-22 07:39:00'),
(340, 200, 'J. PRINT STELAN', 'XS', 14, 110000.00, '2026-09-22 08:38:47', '2026-09-22 08:38:47'),
(341, 201, 'J. PRINT STELAN', 'XS', 5, 85000.00, '2026-09-22 08:50:20', '2026-09-22 08:50:20'),
(342, 202, 'J. PRINT STELAN', 'XS', 4, 95000.00, '2026-09-22 08:52:34', '2026-09-22 08:52:34'),
(343, 203, 'J. SPECIAL', 'XS', 1, 170000.00, '2026-09-22 08:54:50', '2026-09-22 08:54:50'),
(344, 203, 'K. KAKI', 'XS', 1, 20000.00, '2026-09-22 08:54:50', '2026-09-22 08:54:50'),
(346, 205, 'J. PRINT STELAN', 'XS', 25, 110000.00, '2026-09-22 10:52:45', '2026-09-22 10:52:45'),
(351, 208, 'J. EMBOSH FULL PRINT', 'XS', 31, 150000.00, '2026-09-23 08:00:00', '2026-09-23 08:00:00'),
(352, 209, 'J. PRINT STELAN', 'XS', 11, 100000.00, '2026-09-23 08:16:33', '2026-09-23 08:16:33'),
(354, 210, 'J. MILANO PRINT STELAN', 'XS', 18, 100000.00, '2026-09-23 08:26:37', '2026-09-23 08:26:37'),
(355, 207, 'J. MILANO PRINT STELAN KELAS 10', 'XS', 30, 110000.00, '2026-09-23 08:27:03', '2026-09-23 08:27:03'),
(356, 207, '2 J. MILANO PRINT STELAN  KELAS 11', 'XS', 7, 200000.00, '2026-09-23 08:27:03', '2026-09-23 08:27:03'),
(357, 206, 'J. MILANO PRINT STELAN ANAK', 'XS', 27, 100000.00, '2026-09-23 08:27:28', '2026-09-23 08:27:28'),
(358, 204, 'J.  AIRWALK PRINT ATASAN', 'XS Panjang', 17, 100000.00, '2026-09-23 08:28:01', '2026-09-23 08:28:01'),
(359, 196, 'J.  EMBOSH PRINT STELAN', 'XS', 18, NULL, '2026-09-23 08:28:28', '2026-09-23 08:28:28'),
(367, 211, 'J. PRINT OLAHRAGA', 'S', 2, 100000.00, '2026-09-23 08:37:29', '2026-09-23 08:37:29'),
(368, 211, 'J. PRINT OLAHRAGA', 'M', 20, 100000.00, '2026-09-23 08:37:29', '2026-09-23 08:37:29'),
(369, 211, 'J. PRINT OLAHRAGA', 'L', 50, 100000.00, '2026-09-23 08:37:29', '2026-09-23 08:37:29'),
(370, 211, 'J. PRINT OLAHRAGA', 'XL', 20, 100000.00, '2026-09-23 08:37:29', '2026-09-23 08:37:29'),
(371, 211, 'J. PRINT OLAHRAGA', 'XXL', 8, 100000.00, '2026-09-23 08:37:29', '2026-09-23 08:37:29'),
(372, 211, 'J. PRINT OLAHRAGA', '3XL', 2, 100000.00, '2026-09-23 08:37:29', '2026-09-23 08:37:29'),
(373, 211, 'J. PRINT OLAHRAGA', '4XL', 2, 100000.00, '2026-09-23 08:37:29', '2026-09-23 08:37:29'),
(374, 211, 'J. PRINT OLAHRAGA', 'S Panjang', 2, 100000.00, '2026-09-23 08:37:29', '2026-09-23 08:37:29'),
(375, 211, 'J. PRINT OLAHRAGA', 'M Panjang', 18, 100000.00, '2026-09-23 08:37:29', '2026-09-23 08:37:29'),
(376, 211, 'J. PRINT OLAHRAGA', 'L Panjang', 50, 100000.00, '2026-09-23 08:37:29', '2026-09-23 08:37:29'),
(377, 211, 'J. PRINT OLAHRAGA', 'XL Panjang', 16, 100000.00, '2026-09-23 08:37:29', '2026-09-23 08:37:29'),
(378, 211, 'J. PRINT OLAHRAGA', 'XXL Panjang', 6, 100000.00, '2026-09-23 08:37:29', '2026-09-23 08:37:29'),
(379, 211, 'J. PRINT OLAHRAGA', '3XL Panjang', 2, 100000.00, '2026-09-23 08:37:29', '2026-09-23 08:37:29'),
(380, 211, 'J. PRINT OLAHRAGA', '4XL Panjang', 2, 100000.00, '2026-09-23 08:37:29', '2026-09-23 08:37:29'),
(381, 97, 'J. PRINT STELAN', 'XS', 20, 135000.00, '2026-09-23 10:00:39', '2026-09-23 10:00:39'),
(382, 212, 'J. EMBOSH PRINT STELAN', 'XS', 14, 130000.00, '2026-09-24 06:47:51', '2026-09-24 06:47:51');

-- --------------------------------------------------------

--
-- Table structure for table `order_logs`
--

CREATE TABLE `order_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status_lama` varchar(255) DEFAULT NULL,
  `status_baru` varchar(255) NOT NULL,
  `catatan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_logs`
--

INSERT INTO `order_logs` (`id`, `order_id`, `user_id`, `status_lama`, `status_baru`, `catatan`, `created_at`, `updated_at`) VALUES
(94, 56, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(95, 57, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(96, 58, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(98, 60, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(99, 61, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(100, 62, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(101, 63, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(102, 64, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(103, 65, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(104, 66, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(105, 67, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(106, 68, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(107, 69, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(108, 70, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(109, 71, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(110, 72, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(111, 73, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(112, 74, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(113, 75, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(114, 76, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(116, 78, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(117, 79, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(118, 80, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(119, 81, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(120, 82, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(121, 83, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(122, 84, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(123, 85, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(124, 86, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(125, 87, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(126, 88, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(127, 58, 1, 'draft', 'draft', 'Order digabungkan dari ID lama: 59', '2026-09-17 12:54:22', '2026-09-17 12:54:22'),
(128, 56, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:57:58', '2026-09-17 13:57:58'),
(129, 57, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:57:58', '2026-09-17 13:57:58'),
(130, 58, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:57:58', '2026-09-17 13:57:58'),
(131, 60, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:57:58', '2026-09-17 13:57:58'),
(132, 61, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:57:58', '2026-09-17 13:57:58'),
(133, 62, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:57:58', '2026-09-17 13:57:58'),
(134, 63, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:57:58', '2026-09-17 13:57:58'),
(135, 64, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:57:58', '2026-09-17 13:57:58'),
(136, 65, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:57:58', '2026-09-17 13:57:58'),
(137, 66, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:57:58', '2026-09-17 13:57:58'),
(138, 67, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:57:59', '2026-09-17 13:57:59'),
(139, 68, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:57:59', '2026-09-17 13:57:59'),
(140, 69, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:57:59', '2026-09-17 13:57:59'),
(141, 70, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:57:59', '2026-09-17 13:57:59'),
(142, 71, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:57:59', '2026-09-17 13:57:59'),
(143, 72, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:58:09', '2026-09-17 13:58:09'),
(144, 73, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:58:09', '2026-09-17 13:58:09'),
(145, 74, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:58:09', '2026-09-17 13:58:09'),
(146, 75, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:58:09', '2026-09-17 13:58:09'),
(147, 76, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:58:09', '2026-09-17 13:58:09'),
(149, 78, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:58:09', '2026-09-17 13:58:09'),
(150, 79, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:58:09', '2026-09-17 13:58:09'),
(151, 80, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:58:09', '2026-09-17 13:58:09'),
(152, 81, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:58:09', '2026-09-17 13:58:09'),
(153, 82, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:58:09', '2026-09-17 13:58:09'),
(154, 83, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:58:09', '2026-09-17 13:58:09'),
(155, 84, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:58:09', '2026-09-17 13:58:09'),
(156, 85, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:58:09', '2026-09-17 13:58:09'),
(157, 86, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:58:09', '2026-09-17 13:58:09'),
(158, 87, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:58:20', '2026-09-17 13:58:20'),
(159, 88, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-17 13:58:20', '2026-09-17 13:58:20'),
(160, 73, 1, 'selesai', 'jahit', NULL, '2026-09-18 03:21:11', '2026-09-18 03:21:11'),
(161, 75, 1, 'selesai', 'draft', NULL, '2026-09-18 03:25:42', '2026-09-18 03:25:42'),
(162, 76, 1, 'selesai', 'dikirim', NULL, '2026-09-18 03:27:28', '2026-09-18 03:27:28'),
(164, 79, 1, 'selesai', 'printing', NULL, '2026-09-18 03:28:27', '2026-09-18 03:28:27'),
(165, 80, 1, 'selesai', 'jahit', NULL, '2026-09-18 03:30:56', '2026-09-18 03:30:56'),
(166, 82, 1, 'selesai', 'jahit', NULL, '2026-09-18 03:31:21', '2026-09-18 03:31:21'),
(167, 89, 1, NULL, 'draft', 'Order dibuat', '2026-09-18 03:58:31', '2026-09-18 03:58:31'),
(168, 89, 1, 'draft', 'jahit', NULL, '2026-09-18 03:58:39', '2026-09-18 03:58:39'),
(169, 83, 1, 'selesai', 'jahit', NULL, '2026-09-18 04:10:45', '2026-09-18 04:10:45'),
(170, 85, 1, 'selesai', 'jahit', NULL, '2026-09-18 04:11:20', '2026-09-18 04:11:20'),
(171, 86, 1, 'selesai', 'jahit', NULL, '2026-09-18 04:12:30', '2026-09-18 04:12:30'),
(172, 87, 1, 'selesai', 'jahit', NULL, '2026-09-18 04:14:00', '2026-09-18 04:14:00'),
(173, 88, 1, 'selesai', 'jahit', NULL, '2026-09-18 04:14:30', '2026-09-18 04:14:30'),
(174, 79, 1, 'printing', 'pemasangan', 'QC Printing lulus. Lanjut ke Pemasangan.', '2026-09-21 02:55:23', '2026-09-21 02:55:23'),
(176, 91, 1, NULL, 'draft', 'Order dibuat', '2026-09-21 05:00:57', '2026-09-21 05:00:57'),
(177, 91, 1, 'draft', 'selesai', NULL, '2026-09-21 05:01:09', '2026-09-21 05:01:09'),
(178, 92, 1, NULL, 'draft', 'Order dibuat', '2026-09-21 05:05:41', '2026-09-21 05:05:41'),
(179, 92, 1, 'draft', 'selesai', NULL, '2026-09-21 05:05:48', '2026-09-21 05:05:48'),
(180, 93, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(181, 94, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(182, 95, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(183, 96, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(184, 97, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(185, 98, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(186, 99, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(187, 100, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(188, 101, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(189, 102, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(190, 103, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(191, 104, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(192, 105, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(193, 106, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(194, 107, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(195, 108, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(196, 109, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(197, 110, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(198, 111, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(199, 112, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(200, 113, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(201, 114, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(202, 115, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(203, 116, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(204, 117, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(205, 118, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(206, 119, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(207, 120, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(208, 121, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(209, 122, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(210, 123, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(211, 124, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(212, 125, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(213, 126, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(214, 127, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(215, 128, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(216, 129, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(217, 130, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(218, 131, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(219, 132, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(220, 133, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(221, 134, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(222, 135, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(223, 136, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(224, 137, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(225, 138, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(226, 139, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(227, 140, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(228, 141, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(229, 142, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(230, 143, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(231, 144, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(232, 145, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(233, 146, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(234, 147, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(235, 148, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(236, 149, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(237, 150, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(238, 151, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(239, 152, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(240, 153, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(241, 154, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(242, 155, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(243, 156, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(244, 157, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(245, 158, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(246, 159, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(247, 160, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(248, 161, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(249, 162, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(250, 163, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(251, 164, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(252, 165, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(253, 166, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(254, 167, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(255, 168, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(256, 169, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(257, 170, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(258, 171, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(259, 172, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(260, 173, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(261, 174, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(262, 175, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(263, 176, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(264, 177, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(265, 178, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(266, 179, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(267, 180, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(268, 181, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(269, 182, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(270, 183, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(271, 184, 1, NULL, 'draft', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(272, 185, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(273, 186, 1, NULL, 'selesai', 'Order diimpor dari Excel', '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(274, 187, 1, NULL, 'draft', 'Order dibuat', '2026-09-21 10:50:15', '2026-09-21 10:50:15'),
(276, 187, 1, 'draft', 'printing', NULL, '2026-09-21 11:52:56', '2026-09-21 11:52:56'),
(277, 189, 1, NULL, 'draft', 'Order dibuat', '2026-09-21 11:58:10', '2026-09-21 11:58:10'),
(278, 189, 1, 'draft', 'printing', NULL, '2026-09-21 11:59:15', '2026-09-21 11:59:15'),
(279, 190, 1, NULL, 'draft', 'Order dibuat', '2026-09-21 12:01:56', '2026-09-21 12:01:56'),
(280, 190, 1, 'draft', 'printing', NULL, '2026-09-21 12:02:11', '2026-09-21 12:02:11'),
(281, 108, 1, 'draft', 'printing', NULL, '2026-09-22 04:03:12', '2026-09-22 04:03:12'),
(282, 120, 1, 'draft', 'selesai', NULL, '2026-09-22 04:04:20', '2026-09-22 04:04:20'),
(283, 128, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 04:06:23', '2026-09-22 04:06:23'),
(284, 135, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 04:08:14', '2026-09-22 04:08:14'),
(285, 137, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 04:08:15', '2026-09-22 04:08:15'),
(286, 138, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 04:08:15', '2026-09-22 04:08:15'),
(287, 139, 1, 'selesai', 'printing', 'Bulk update status', '2026-09-22 04:08:15', '2026-09-22 04:08:15'),
(288, 140, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 04:08:15', '2026-09-22 04:08:15'),
(289, 141, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 04:08:15', '2026-09-22 04:08:15'),
(290, 142, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 04:08:15', '2026-09-22 04:08:15'),
(291, 151, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 04:09:56', '2026-09-22 04:09:56'),
(292, 155, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 04:09:56', '2026-09-22 04:09:56'),
(293, 159, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 04:09:56', '2026-09-22 04:09:56'),
(294, 161, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 04:09:56', '2026-09-22 04:09:56'),
(295, 165, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 04:10:49', '2026-09-22 04:10:49'),
(296, 170, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 04:10:49', '2026-09-22 04:10:49'),
(297, 172, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 04:10:49', '2026-09-22 04:10:49'),
(298, 173, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 04:10:49', '2026-09-22 04:10:49'),
(299, 174, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 04:10:49', '2026-09-22 04:10:49'),
(300, 177, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 04:10:49', '2026-09-22 04:10:49'),
(301, 179, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 04:10:49', '2026-09-22 04:10:49'),
(302, 180, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 04:11:45', '2026-09-22 04:11:45'),
(303, 181, 1, 'selesai', 'printing', 'Bulk update status', '2026-09-22 04:11:45', '2026-09-22 04:11:45'),
(304, 183, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 04:11:45', '2026-09-22 04:11:45'),
(305, 184, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 04:11:45', '2026-09-22 04:11:45'),
(306, 75, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 04:15:26', '2026-09-22 04:15:26'),
(307, 109, 1, 'draft', 'packing', 'Bulk update status', '2026-09-22 05:02:05', '2026-09-22 05:02:05'),
(308, 191, 1, NULL, 'draft', 'Order dibuat', '2026-09-22 05:44:37', '2026-09-22 05:44:37'),
(309, 191, 1, 'draft', 'jahit', NULL, '2026-09-22 05:45:16', '2026-09-22 05:45:16'),
(310, 112, 1, 'draft', 'jahit', 'Bulk update status', '2026-09-22 06:28:35', '2026-09-22 06:28:35'),
(311, 114, 1, 'draft', 'jahit', 'Bulk update status', '2026-09-22 06:28:54', '2026-09-22 06:28:54'),
(312, 115, 1, 'draft', 'jahit', 'Bulk update status', '2026-09-22 06:28:54', '2026-09-22 06:28:54'),
(313, 117, 1, 'draft', 'jahit', 'Bulk update status', '2026-09-22 06:29:04', '2026-09-22 06:29:04'),
(314, 132, 1, 'draft', 'jahit', 'Bulk update status', '2026-09-22 06:30:22', '2026-09-22 06:30:22'),
(315, 143, 1, 'draft', 'jahit', 'Bulk update status', '2026-09-22 06:34:26', '2026-09-22 06:34:26'),
(316, 146, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-22 06:35:49', '2026-09-22 06:35:49'),
(317, 145, 1, 'draft', 'packing', 'Bulk update status', '2026-09-22 06:36:01', '2026-09-22 06:36:01'),
(318, 152, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-22 06:36:17', '2026-09-22 06:36:17'),
(319, 158, 1, 'selesai', 'printing', 'Bulk update status', '2026-09-22 06:36:36', '2026-09-22 06:36:36'),
(320, 160, 1, 'draft', 'jahit', 'Bulk update status', '2026-09-22 06:37:11', '2026-09-22 06:37:11'),
(321, 163, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-22 06:37:33', '2026-09-22 06:37:33'),
(322, 169, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-22 06:39:08', '2026-09-22 06:39:08'),
(323, 176, 1, 'draft', 'selesai', 'Bulk update status', '2026-09-22 06:39:08', '2026-09-22 06:39:08'),
(324, 97, 1, 'draft', 'jahit', 'Bulk update status', '2026-09-22 06:39:44', '2026-09-22 06:39:44'),
(325, 98, 1, 'draft', 'jahit', 'Bulk update status', '2026-09-22 06:39:44', '2026-09-22 06:39:44'),
(326, 100, 1, 'draft', 'jahit', 'Bulk update status', '2026-09-22 06:40:50', '2026-09-22 06:40:50'),
(327, 101, 1, 'draft', 'jahit', 'Bulk update status', '2026-09-22 06:40:50', '2026-09-22 06:40:50'),
(328, 102, 1, 'draft', 'jahit', 'Bulk update status', '2026-09-22 06:40:50', '2026-09-22 06:40:50'),
(329, 68, 1, 'selesai', 'jahit', 'Bulk update status', '2026-09-22 06:41:47', '2026-09-22 06:41:47'),
(330, 192, 1, NULL, 'draft', 'Order dibuat', '2026-09-22 06:55:17', '2026-09-22 06:55:17'),
(331, 192, 1, 'draft', 'printing', NULL, '2026-09-22 06:55:26', '2026-09-22 06:55:26'),
(332, 193, 1, NULL, 'draft', 'Order dibuat', '2026-09-22 07:24:24', '2026-09-22 07:24:24'),
(333, 193, 1, 'draft', 'printing', NULL, '2026-09-22 07:24:38', '2026-09-22 07:24:38'),
(334, 194, 1, NULL, 'draft', 'Order dibuat', '2026-09-22 07:25:40', '2026-09-22 07:25:40'),
(335, 194, 1, 'draft', 'jahit', NULL, '2026-09-22 07:25:50', '2026-09-22 07:25:50'),
(336, 195, 1, NULL, 'draft', 'Order dibuat', '2026-09-22 07:27:47', '2026-09-22 07:27:47'),
(337, 195, 1, 'draft', 'printing', NULL, '2026-09-22 07:27:56', '2026-09-22 07:27:56'),
(338, 196, 1, NULL, 'draft', 'Order dibuat', '2026-09-22 07:31:09', '2026-09-22 07:31:09'),
(339, 197, 1, NULL, 'draft', 'Order dibuat', '2026-09-22 07:36:05', '2026-09-22 07:36:05'),
(340, 197, 1, 'draft', 'printing', NULL, '2026-09-22 07:36:16', '2026-09-22 07:36:16'),
(341, 196, 1, 'draft', 'printing', 'Bulk update status', '2026-09-22 07:36:34', '2026-09-22 07:36:34'),
(342, 198, 1, NULL, 'draft', 'Order dibuat', '2026-09-22 07:39:00', '2026-09-22 07:39:00'),
(343, 198, 1, 'draft', 'printing', NULL, '2026-09-22 07:39:08', '2026-09-22 07:39:08'),
(345, 193, 29, 'printing', 'pemasangan', 'QC Printing lulus. Lanjut ke Pemasangan.', '2026-09-22 08:08:46', '2026-09-22 08:08:46'),
(346, 192, 29, 'printing', 'pemasangan', 'QC Printing lulus. Lanjut ke Pemasangan.', '2026-09-22 08:11:44', '2026-09-22 08:11:44'),
(347, 200, 1, NULL, 'draft', 'Order dibuat', '2026-09-22 08:36:23', '2026-09-22 08:36:23'),
(348, 200, 1, 'draft', 'printing', NULL, '2026-09-22 08:39:02', '2026-09-22 08:39:02'),
(349, 201, 1, NULL, 'draft', 'Order dibuat', '2026-09-22 08:50:20', '2026-09-22 08:50:20'),
(350, 201, 1, 'draft', 'printing', NULL, '2026-09-22 08:50:35', '2026-09-22 08:50:35'),
(351, 202, 1, NULL, 'draft', 'Order dibuat', '2026-09-22 08:52:34', '2026-09-22 08:52:34'),
(352, 203, 1, NULL, 'draft', 'Order dibuat', '2026-09-22 08:54:50', '2026-09-22 08:54:50'),
(353, 203, 1, 'draft', 'printing', NULL, '2026-09-22 08:55:34', '2026-09-22 08:55:34'),
(354, 202, 1, 'draft', 'printing', NULL, '2026-09-22 08:56:37', '2026-09-22 08:56:37'),
(355, 204, 1, NULL, 'draft', 'Order dibuat', '2026-09-22 09:02:34', '2026-09-22 09:02:34'),
(356, 204, 1, 'draft', 'printing', NULL, '2026-09-22 09:02:45', '2026-09-22 09:02:45'),
(357, 205, 1, NULL, 'draft', 'Order dibuat', '2026-09-22 10:52:45', '2026-09-22 10:52:45'),
(358, 205, 1, 'draft', 'selesai', NULL, '2026-09-22 10:52:52', '2026-09-22 10:52:52'),
(359, 205, 1, 'selesai', 'dikirim', NULL, '2026-09-22 10:53:47', '2026-09-22 10:53:47'),
(360, 206, 1, NULL, 'draft', 'Order dibuat', '2026-09-23 04:54:05', '2026-09-23 04:54:05'),
(361, 207, 1, NULL, 'draft', 'Order dibuat', '2026-09-23 06:57:30', '2026-09-23 06:57:30'),
(362, 208, 1, NULL, 'draft', 'Order dibuat', '2026-09-23 08:00:00', '2026-09-23 08:00:00'),
(363, 209, 1, NULL, 'draft', 'Order dibuat', '2026-09-23 08:16:33', '2026-09-23 08:16:33'),
(364, 209, 1, 'draft', 'selesai', NULL, '2026-09-23 08:16:38', '2026-09-23 08:16:38'),
(365, 210, 1, NULL, 'draft', 'Order dibuat', '2026-09-23 08:22:26', '2026-09-23 08:22:26'),
(366, 211, 1, NULL, 'draft', 'Order dibuat', '2026-09-23 08:35:36', '2026-09-23 08:35:36'),
(367, 108, 29, 'printing', 'pemasangan', 'QC Printing lulus. Lanjut ke Pemasangan.', '2026-09-23 10:16:58', '2026-09-23 10:16:58'),
(368, 198, 29, 'printing', 'pemasangan', 'QC Printing lulus. Lanjut ke Pemasangan.', '2026-09-23 11:07:57', '2026-09-23 11:07:57'),
(369, 137, 29, 'printing', 'pemasangan', 'QC Printing lulus. Lanjut ke Pemasangan.', '2026-09-23 19:45:21', '2026-09-23 19:45:21'),
(370, 212, 1, NULL, 'draft', 'Order dibuat', '2026-09-24 06:47:51', '2026-09-24 06:47:51');

-- --------------------------------------------------------

--
-- Table structure for table `packings`
--

CREATE TABLE `packings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `checklist_packing` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`checklist_packing`)),
  `kurir` varchar(255) DEFAULT NULL,
  `no_resi` varchar(255) DEFAULT NULL,
  `tanggal_kirim` date DEFAULT NULL,
  `status` enum('packing','siap_kirim','dikirim') NOT NULL DEFAULT 'packing',
  `catatan` text DEFAULT NULL,
  `packing_dikerjakan_oleh` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `packings`
--

INSERT INTO `packings` (`id`, `order_id`, `checklist_packing`, `kurir`, `no_resi`, `tanggal_kirim`, `status`, `catatan`, `packing_dikerjakan_oleh`, `created_at`, `updated_at`) VALUES
(2, 109, NULL, NULL, NULL, NULL, 'packing', NULL, NULL, '2026-09-22 05:02:05', '2026-09-22 05:02:05'),
(3, 145, NULL, NULL, NULL, NULL, 'packing', NULL, NULL, '2026-09-22 06:36:01', '2026-09-22 06:36:01');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pemasangans`
--

CREATE TABLE `pemasangans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `suhu_heat_press` varchar(255) DEFAULT NULL,
  `waktu_curing` varchar(255) DEFAULT NULL,
  `checklist_qc` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`checklist_qc`)),
  `status` enum('menunggu','proses','selesai') NOT NULL DEFAULT 'menunggu',
  `status_qc` enum('lulus','gagal') DEFAULT NULL,
  `catatan` text DEFAULT NULL,
  `foto_qc` varchar(255) DEFAULT NULL,
  `pemasangan_dikerjakan_oleh` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pemasangans`
--

INSERT INTO `pemasangans` (`id`, `order_id`, `suhu_heat_press`, `waktu_curing`, `checklist_qc`, `status`, `status_qc`, `catatan`, `foto_qc`, `pemasangan_dikerjakan_oleh`, `created_at`, `updated_at`) VALUES
(2, 79, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-21 02:55:23', '2026-09-21 02:55:23'),
(3, 193, '250', '30 menit', NULL, 'proses', NULL, NULL, NULL, NULL, '2026-09-22 08:08:46', '2026-09-23 13:31:59'),
(4, 192, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 08:11:44', '2026-09-22 08:11:44'),
(5, 108, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-23 10:16:58', '2026-09-23 10:16:58'),
(6, 198, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-23 11:07:57', '2026-09-23 11:07:57'),
(7, 137, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-23 19:45:21', '2026-09-23 19:45:21');

-- --------------------------------------------------------

--
-- Table structure for table `pembayarans`
--

CREATE TABLE `pembayarans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `jumlah` decimal(15,2) NOT NULL,
  `tanggal` date NOT NULL,
  `metode` varchar(255) NOT NULL DEFAULT 'transfer',
  `tipe` varchar(255) NOT NULL DEFAULT 'dp',
  `catatan` text DEFAULT NULL,
  `dicatat_oleh` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pembayarans`
--

INSERT INTO `pembayarans` (`id`, `order_id`, `jumlah`, `tanggal`, `metode`, `tipe`, `catatan`, `dicatat_oleh`, `created_at`, `updated_at`) VALUES
(117, 56, 2400000.00, '2026-03-07', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(118, 56, 2500000.00, '2026-03-07', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(119, 56, 1800000.00, '2026-03-07', 'transfer', 'dp', 'DP3 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(120, 57, 500000.00, '2026-03-11', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(121, 58, 1300000.00, '2026-03-18', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(122, 58, 1000000.00, '2026-03-18', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(123, 58, 2500000.00, '2026-03-18', 'transfer', 'dp', 'DP3 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(124, 58, 1000000.00, '2026-03-18', 'transfer', 'dp', 'DP4 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(125, 58, 2000000.00, '2026-03-18', 'transfer', 'dp', 'DP5 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(126, 60, 800000.00, '2026-04-06', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(127, 60, 350000.00, '2026-04-06', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(128, 60, 200000.00, '2026-04-06', 'transfer', 'dp', 'DP3 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(129, 60, 325000.00, '2026-04-06', 'transfer', 'dp', 'DP4 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(130, 60, 200000.00, '2026-04-06', 'transfer', 'dp', 'DP5 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(131, 61, 3000000.00, '2026-05-02', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(132, 61, 1000000.00, '2026-05-02', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(133, 62, 100000.00, '2026-05-02', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(134, 62, 500000.00, '2026-05-02', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(135, 62, 50000.00, '2026-05-02', 'transfer', 'dp', 'DP3 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(136, 63, 600000.00, '2025-05-02', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(137, 63, 1000000.00, '2025-05-02', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(138, 63, 500000.00, '2025-05-02', 'transfer', 'dp', 'DP3 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(139, 64, 1000000.00, '2026-05-04', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(140, 64, 500000.00, '2026-05-04', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(141, 64, 1000000.00, '2026-05-04', 'transfer', 'dp', 'DP3 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(142, 64, 500000.00, '2026-05-04', 'transfer', 'dp', 'DP4 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(143, 64, 2800000.00, '2026-05-04', 'transfer', 'dp', 'DP5 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(144, 65, 1400000.00, '2026-05-11', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(145, 66, 1000000.00, '2026-05-20', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(146, 67, 4000000.00, '2026-05-30', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(147, 67, 900000.00, '2026-05-30', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(148, 67, 300000.00, '2026-05-30', 'transfer', 'dp', 'DP3 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(149, 67, 700000.00, '2026-05-30', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(150, 67, 200000.00, '2026-05-30', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(151, 68, 500000.00, '2026-06-19', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(152, 69, 2000000.00, '2026-06-26', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(153, 70, 600000.00, '2026-07-01', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(154, 70, 700000.00, '2026-07-01', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(155, 70, 670000.00, '2026-07-01', 'transfer', 'dp', 'DP3 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(156, 70, 460000.00, '2026-07-01', 'transfer', 'dp', 'DP4 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(157, 71, 740000.00, '2026-07-22', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(158, 72, 600000.00, '2026-07-31', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(159, 73, 20000000.00, '2026-08-03', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(160, 74, 1600000.00, '2026-08-05', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(161, 75, 6500000.00, '2026-08-06', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(162, 76, 1500000.00, '2026-08-10', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(163, 76, 1500000.00, '2026-08-10', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(165, 78, 1350000.00, '2026-08-15', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(166, 78, 400000.00, '2026-08-15', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(167, 79, 1150000.00, '2026-08-18', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(168, 79, 2200000.00, '2026-08-18', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(169, 80, 7000000.00, '2026-08-22', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(170, 81, 500000.00, '2026-08-22', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(171, 82, 1200000.00, '2026-08-24', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(172, 83, 3000000.00, '2026-08-25', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(173, 84, 1500000.00, '2026-08-27', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(174, 85, 10000000.00, '2026-08-27', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(175, 86, 1500000.00, '2026-08-31', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(176, 87, 500000.00, '2026-08-31', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(177, 88, 1000000.00, '2026-08-31', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-17 12:35:50', '2026-09-17 12:35:50'),
(178, 78, 450000.00, '2026-09-21', 'transfer', 'dp', 'PELUNASAN', 1, '2026-09-21 08:28:53', '2026-09-21 08:28:53'),
(179, 93, 900000.00, '2026-09-01', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(180, 93, 1020000.00, '2026-09-01', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(181, 94, 900000.00, '2026-09-01', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(182, 95, 1000000.00, '2026-09-02', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(183, 96, 500000.00, '2026-09-02', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(184, 96, 250000.00, '2026-09-02', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(185, 96, 400000.00, '2026-09-02', 'transfer', 'dp', 'DP3 (Import)', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(186, 96, 170000.00, '2026-09-02', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(187, 97, 1640000.00, '2026-09-02', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(188, 98, 2500000.00, '2026-09-02', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(189, 99, 2400000.00, '2026-09-02', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(190, 99, 120000.00, '2026-09-02', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(191, 100, 2250000.00, '2026-09-02', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(192, 101, 800000.00, '2026-09-02', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(193, 102, 1550000.00, '2026-09-02', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(194, 103, 1500000.00, '2026-09-02', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(195, 103, 540000.00, '2026-09-02', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(196, 104, 2090000.00, '2026-09-02', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(197, 104, 120000.00, '2026-09-02', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(198, 104, 400000.00, '2026-09-02', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(199, 105, 2800000.00, '2026-09-02', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(200, 106, 5060000.00, '2026-09-02', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:19', '2026-09-21 09:34:19'),
(201, 107, 1500000.00, '2026-09-02', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(202, 107, 2100000.00, '2026-09-02', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(203, 108, 5000000.00, '2026-09-03', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(204, 108, 2400000.00, '2026-09-03', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(205, 109, 3500000.00, '2026-09-03', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(206, 110, 930000.00, '2026-09-03', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(207, 110, 1000000.00, '2026-09-03', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(208, 110, 1130000.00, '2026-09-03', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(209, 111, 220000.00, '2026-09-03', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(210, 111, 320000.00, '2026-09-03', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(211, 112, 6000000.00, '2026-09-03', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(212, 113, 480000.00, '2026-09-03', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(213, 114, 15000000.00, '2026-09-03', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(214, 115, 1650000.00, '2026-09-03', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(215, 115, 150000.00, '2026-09-03', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(216, 116, 2640000.00, '2026-09-04', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(217, 117, 2000000.00, '2026-09-04', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(218, 117, 1000000.00, '2026-09-04', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(219, 118, 910000.00, '2026-09-04', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(220, 118, 400000.00, '2026-09-04', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(221, 118, 510000.00, '2026-09-04', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(222, 119, 200000.00, '2026-09-04', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(223, 119, 400000.00, '2026-09-04', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(224, 120, 1000000.00, '2026-09-04', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(225, 120, 500000.00, '2026-09-04', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(226, 120, 1400000.00, '2026-09-04', 'transfer', 'dp', 'DP3 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(227, 120, 1200000.00, '2026-09-04', 'transfer', 'dp', 'DP4 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(228, 120, 1300000.00, '2026-09-04', 'transfer', 'dp', 'DP5 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(229, 121, 1540000.00, '2026-09-04', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(230, 121, 840000.00, '2026-09-04', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(231, 122, 400000.00, '2026-09-05', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(232, 122, 1625000.00, '2026-09-05', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(233, 123, 40000000.00, '2026-09-05', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(234, 123, 8100000.00, '2026-09-05', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(235, 124, 3240000.00, '2026-09-05', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(236, 124, 500000.00, '2026-09-05', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(237, 125, 1350000.00, '2026-09-05', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(238, 125, 525000.00, '2026-09-05', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(239, 126, 1000000.00, '2026-09-05', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(240, 126, 250000.00, '2026-09-05', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(241, 127, 2250000.00, '2026-09-05', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(242, 127, 935000.00, '2026-09-05', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(243, 128, 1300000.00, '2026-09-07', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(244, 128, 500000.00, '2026-09-07', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(245, 129, 3000000.00, '2026-09-07', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(246, 129, 3000000.00, '2026-09-07', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(247, 129, 825000.00, '2026-09-07', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(248, 130, 1500000.00, '2026-09-07', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(249, 131, 5600000.00, '2026-09-07', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(250, 131, 185000.00, '2026-09-07', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(251, 132, 1500000.00, '2026-09-07', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(252, 133, 1000000.00, '2026-09-08', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(253, 133, 1100000.00, '2026-09-08', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(254, 134, 1000000.00, '2026-09-08', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(255, 134, 1000000.00, '2026-09-08', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(256, 134, 1000000.00, '2026-09-08', 'transfer', 'dp', 'DP3 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(257, 134, 1305000.00, '2026-09-08', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(258, 135, 1900000.00, '2026-09-08', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(259, 136, 10000000.00, '2026-09-08', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(260, 136, 20000000.00, '2026-09-08', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(261, 136, 10000000.00, '2026-09-08', 'transfer', 'dp', 'DP3 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(262, 136, 11800000.00, '2026-09-08', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(263, 137, 7550000.00, '2026-09-08', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(264, 138, 8000000.00, '2026-09-08', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(265, 139, 3060000.00, '2026-09-08', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(266, 139, 200000.00, '2026-09-08', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(267, 139, 360000.00, '2026-09-08', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(268, 140, 600000.00, '2026-09-08', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(269, 140, 700000.00, '2026-09-08', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(270, 141, 1200000.00, '2026-09-09', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(271, 141, 1200000.00, '2026-09-09', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(272, 141, 500000.00, '2026-09-09', 'transfer', 'dp', 'DP3 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(273, 142, 600000.00, '2026-09-09', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(274, 142, 140000.00, '2026-09-09', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(275, 143, 8000000.00, '2026-09-09', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(276, 144, 7000000.00, '2026-09-10', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(277, 145, 450000.00, '2026-09-10', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(278, 145, 2500000.00, '2026-09-10', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(279, 146, 500000.00, '2026-09-10', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(280, 146, 2500000.00, '2026-09-10', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(281, 147, 120000.00, '2026-09-11', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(282, 148, 98000.00, '2026-09-11', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(283, 149, 990000.00, '2026-09-12', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(284, 149, 700000.00, '2026-09-12', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(285, 150, 2000000.00, '2026-09-12', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(286, 150, 320000.00, '2026-09-12', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(287, 151, 2000000.00, '2026-09-12', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(288, 152, 1000000.00, '2026-09-12', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(289, 153, 1700000.00, '2026-09-12', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(290, 153, 2450000.00, '2026-09-12', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(291, 154, 1500000.00, '2026-09-12', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(292, 154, 2500000.00, '2026-09-12', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(293, 155, 6000000.00, '2026-09-12', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(294, 155, 1000000.00, '2026-09-12', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(295, 156, 2640000.00, '2026-09-12', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(296, 156, 120000.00, '2026-09-12', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(297, 157, 800000.00, '2026-09-12', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(298, 157, 1930000.00, '2026-09-12', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(299, 158, 595000.00, '2026-09-12', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(300, 158, 85000.00, '2026-09-12', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(301, 159, 3000000.00, '2026-09-14', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(302, 160, 250000.00, '2026-09-14', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(303, 161, 1500000.00, '2026-09-14', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(304, 161, 1500000.00, '2026-09-14', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(305, 162, 1000000.00, '2026-09-14', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(306, 162, 1700000.00, '2026-09-14', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(307, 163, 1000000.00, '2026-09-14', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(308, 163, 800000.00, '2026-09-14', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(309, 164, 4070000.00, '2026-09-15', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(310, 165, 500000.00, '2026-09-15', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(311, 166, 6270000.00, '2026-09-15', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(312, 167, 800000.00, '2026-09-15', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(313, 168, 2500000.00, '2026-09-15', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(314, 168, 4780000.00, '2026-09-15', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(315, 168, 100000.00, '2026-09-15', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(316, 169, 2000000.00, '2026-09-15', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(317, 170, 840000.00, '2026-09-15', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(318, 171, 500000.00, '2026-09-16', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(319, 172, 1000000.00, '2026-09-16', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(320, 173, 1000000.00, '2026-09-16', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(321, 174, 300000.00, '2026-09-16', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(322, 174, 200000.00, '2026-09-16', 'transfer', 'dp', 'DP2 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(323, 175, 907500.00, '2026-09-16', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(324, 175, 907500.00, '2026-09-16', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(325, 176, 1500000.00, '2026-09-17', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(326, 176, 3250000.00, '2026-09-17', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(327, 177, 600000.00, '2026-09-17', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(328, 178, 3000000.00, '2026-09-17', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(329, 178, 3020000.00, '2026-09-17', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(330, 179, 1200000.00, '2026-09-17', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(331, 180, 600000.00, '2026-09-17', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(332, 181, 1400000.00, '2026-09-17', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(333, 182, 1600000.00, '2026-09-18', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(334, 183, 3750000.00, '2026-09-18', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(335, 184, 100000.00, '2026-09-18', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(336, 185, 500000.00, '2026-09-19', 'transfer', 'dp', 'DP1 (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(337, 185, 350000.00, '2026-09-19', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(338, 186, 500000.00, '2026-09-19', 'transfer', 'pelunasan', 'PELUNASAN (Import)', 1, '2026-09-21 09:34:20', '2026-09-21 09:34:20'),
(339, 89, 10000000.00, '2026-09-22', 'transfer', 'dp', 'DP 2', 1, '2026-09-22 03:23:19', '2026-09-22 03:23:19'),
(340, 83, 12000000.00, '2026-09-22', 'transfer', 'dp', 'DP 2', 1, '2026-09-22 03:27:45', '2026-09-22 03:27:45'),
(341, 108, 3450000.00, '2026-09-22', 'tunai', 'dp', 'DP 3', 1, '2026-09-22 04:36:13', '2026-09-22 04:36:13'),
(342, 92, 1650000.00, '2026-09-23', 'transfer', 'pelunasan', NULL, 1, '2026-09-23 08:05:39', '2026-09-23 08:05:39'),
(343, 88, 995000.00, '2026-09-23', 'transfer', 'pelunasan', NULL, 1, '2026-09-23 08:06:15', '2026-09-23 08:06:15'),
(344, 98, 1125000.00, '2026-09-23', 'transfer', 'pelunasan', NULL, 1, '2026-09-23 08:06:37', '2026-09-23 08:06:37'),
(345, 87, 1500000.00, '2026-09-23', 'transfer', 'pelunasan', NULL, 1, '2026-09-23 08:07:41', '2026-09-23 08:07:41');

-- --------------------------------------------------------

--
-- Table structure for table `pengeluarans`
--

CREATE TABLE `pengeluarans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tanggal` date NOT NULL,
  `kategori` varchar(255) NOT NULL DEFAULT 'operasional',
  `deskripsi` text NOT NULL,
  `jumlah` decimal(15,2) NOT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `dicatat_oleh` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pengeluarans`
--

INSERT INTO `pengeluarans` (`id`, `tanggal`, `kategori`, `deskripsi`, `jumlah`, `order_id`, `dicatat_oleh`, `created_at`, `updated_at`) VALUES
(1, '2026-09-21', 'lainnya', 'PAKET BUNDA', 83000.00, NULL, 1, '2026-09-21 12:03:21', '2026-09-21 12:03:21'),
(2, '2026-09-21', 'operasional', 'AHMAD BON', 500000.00, NULL, 1, '2026-09-21 12:03:47', '2026-09-21 12:03:47'),
(3, '2026-09-22', 'operasional', 'BENSIN', 10000.00, NULL, 1, '2026-09-21 12:04:17', '2026-09-21 12:04:17'),
(4, '2026-09-22', 'operasional', 'PAKET SAMUDRA', 13000.00, NULL, 1, '2026-09-21 12:05:28', '2026-09-21 12:05:28'),
(5, '2026-09-22', 'operasional', 'BENSIN MIO Z FULL', 40000.00, NULL, 1, '2026-09-21 12:05:43', '2026-09-21 12:05:43'),
(6, '2026-09-22', 'lainnya', 'JAJAN KENZI JAZUO', 20000.00, NULL, 1, '2026-09-21 12:05:59', '2026-09-21 12:05:59'),
(7, '2026-09-22', 'operasional', 'PARKIR', 4000.00, NULL, 1, '2026-09-21 12:06:15', '2026-09-21 12:06:15'),
(8, '2026-09-22', 'lainnya', 'BELI ROKOK A ANDRI', 66500.00, NULL, 1, '2026-09-21 12:07:01', '2026-09-21 12:07:01'),
(9, '2026-09-22', 'operasional', 'UM', 142000.00, NULL, 1, '2026-09-21 12:07:18', '2026-09-21 12:07:18'),
(10, '2026-09-22', 'lainnya', 'CEMEN BON', 105000.00, NULL, 1, '2026-09-21 12:07:36', '2026-09-21 12:07:36'),
(11, '2026-09-22', 'lainnya', 'PAKET BUNDA', 195500.00, NULL, 1, '2026-09-21 12:08:00', '2026-09-21 12:08:00'),
(12, '2026-09-22', 'lainnya', 'BAYAR WARUNG SUDIRMAN', 25000.00, NULL, 1, '2026-09-21 12:08:15', '2026-09-21 12:08:15'),
(13, '2026-09-22', 'lainnya', 'BAYARAN A NOVI MINGGU KEMAREN', 170000.00, NULL, 1, '2026-09-23 08:41:39', '2026-09-23 08:41:39'),
(14, '2026-09-22', 'operasional', 'UANG MAKAN TIM', 156000.00, NULL, 1, '2026-09-23 08:42:03', '2026-09-23 08:42:03'),
(15, '2026-09-22', 'operasional', 'OBRAS PUTIH,KSR MERAH 1 PACK+PARKIR', 744500.00, NULL, 1, '2026-09-23 08:55:07', '2026-09-23 08:55:07'),
(16, '2026-09-22', 'operasional', 'SUNLIGHT', 5000.00, NULL, 1, '2026-09-23 08:55:51', '2026-09-23 08:55:51'),
(17, '2026-09-22', 'lainnya', 'JAJAN KENZI KAZUO', 33000.00, NULL, 1, '2026-09-23 08:58:12', '2026-09-23 08:58:12'),
(18, '2026-09-23', 'lainnya', 'BENANG TAMBANG', 25500.00, NULL, 1, '2026-09-23 08:59:53', '2026-09-23 08:59:53'),
(19, '2026-09-23', 'operasional', 'UV CLAIM GAJI 2 HARI', 160000.00, NULL, 1, '2026-09-23 11:19:25', '2026-09-23 11:19:25'),
(20, '2026-09-23', 'bahan_baku', 'TASLAN MANGO', 97000.00, NULL, 1, '2026-09-23 11:19:55', '2026-09-23 11:19:55'),
(21, '2026-09-23', 'lainnya', 'PAKET BUNDA', 118500.00, NULL, 1, '2026-09-23 11:20:14', '2026-09-23 11:20:14'),
(22, '2026-09-23', 'lainnya', 'IKI BON', 3000.00, NULL, 1, '2026-09-23 11:20:26', '2026-09-23 11:20:26'),
(23, '2026-09-24', 'lainnya', 'A ANDRI AMBIL CASH', 10000.00, NULL, 1, '2026-09-23 11:20:54', '2026-09-23 11:20:54'),
(24, '2026-09-24', 'operasional', 'UANG MAKAN TIM', 147000.00, NULL, 1, '2026-09-23 11:21:13', '2026-09-23 11:21:13'),
(25, '2026-09-24', 'lainnya', 'PAKET BUNDA', 39000.00, NULL, 1, '2026-09-23 11:21:28', '2026-09-23 11:21:28'),
(26, '2026-09-24', 'lainnya', 'PAKET BUNDA', 269000.00, NULL, 1, '2026-09-23 11:21:40', '2026-09-23 11:21:40'),
(27, '2026-09-24', 'operasional', 'BENSIN INVENTARIS', 15000.00, NULL, 1, '2026-09-23 11:22:00', '2026-09-23 11:22:00'),
(28, '2026-09-24', 'lainnya', 'MAKAN MALAM KEMAREN', 239000.00, NULL, 1, '2026-09-23 11:22:27', '2026-09-23 11:22:27'),
(29, '2026-09-24', 'bahan_baku', 'DRIL 36M', 1188000.00, NULL, 1, '2026-09-23 11:35:09', '2026-09-23 11:35:09'),
(30, '2026-09-24', 'bahan_baku', 'STRIP', 83000.00, NULL, 1, '2026-09-23 11:35:29', '2026-09-23 11:35:29'),
(31, '2026-09-24', 'operasional', 'KUNCI MIO Z', 110000.00, NULL, 1, '2026-09-23 11:35:49', '2026-09-23 11:35:49'),
(32, '2026-09-24', 'bahan_baku', 'BENANG JAHIT 1 LUSIN', 26000.00, NULL, 1, '2026-09-23 11:36:08', '2026-09-23 11:36:08'),
(33, '2026-09-24', 'lainnya', 'GANTUNGAN BAJU', 16000.00, NULL, 1, '2026-09-23 11:36:22', '2026-09-23 11:36:22'),
(34, '2026-09-24', 'lainnya', 'JAJAN KENZI KAZUO', 16000.00, NULL, 1, '2026-09-23 11:36:38', '2026-09-23 11:36:38'),
(35, '2026-09-24', 'operasional', 'PARKIR BELANJA', 4000.00, NULL, 1, '2026-09-23 11:36:58', '2026-09-23 11:36:58');

-- --------------------------------------------------------

--
-- Table structure for table `penggajians`
--

CREATE TABLE `penggajians` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `karyawan_id` bigint(20) UNSIGNED NOT NULL,
  `periode_mulai` date NOT NULL,
  `periode_selesai` date NOT NULL,
  `tipe_gaji` enum('borongan','harian','bulanan') NOT NULL,
  `total_hari_hadir` int(11) NOT NULL DEFAULT 0,
  `total_hari_izin` int(11) NOT NULL DEFAULT 0,
  `total_hari_sakit` int(11) NOT NULL DEFAULT 0,
  `total_hari_alpha` int(11) NOT NULL DEFAULT 0,
  `total_jam_lembur` decimal(8,2) NOT NULL DEFAULT 0.00,
  `total_pcs_approved` int(11) NOT NULL DEFAULT 0 COMMENT 'Total pcs borongan disetujui dalam periode',
  `upah_pokok` decimal(12,2) NOT NULL DEFAULT 0.00,
  `upah_lembur` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tunjangan` decimal(12,2) NOT NULL DEFAULT 0.00,
  `potongan` decimal(12,2) NOT NULL DEFAULT 0.00,
  `catatan_potongan` text DEFAULT NULL,
  `total_upah_kotor` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_upah_bersih` decimal(12,2) NOT NULL DEFAULT 0.00,
  `status_bayar` enum('draft','disetujui','dibayar') NOT NULL DEFAULT 'draft',
  `dibuat_oleh` bigint(20) UNSIGNED NOT NULL,
  `disetujui_oleh` bigint(20) UNSIGNED DEFAULT NULL,
  `disetujui_at` timestamp NULL DEFAULT NULL,
  `dibayar_at` timestamp NULL DEFAULT NULL,
  `catatan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `penggajians`
--

INSERT INTO `penggajians` (`id`, `karyawan_id`, `periode_mulai`, `periode_selesai`, `tipe_gaji`, `total_hari_hadir`, `total_hari_izin`, `total_hari_sakit`, `total_hari_alpha`, `total_jam_lembur`, `total_pcs_approved`, `upah_pokok`, `upah_lembur`, `tunjangan`, `potongan`, `catatan_potongan`, `total_upah_kotor`, `total_upah_bersih`, `status_bayar`, `dibuat_oleh`, `disetujui_oleh`, `disetujui_at`, `dibayar_at`, `catatan`, `created_at`, `updated_at`) VALUES
(1, 29, '2026-09-01', '2026-09-19', 'harian', 0, 0, 0, 0, 0.00, 0, 0.00, 0.00, 0.00, 0.00, NULL, 0.00, 0.00, 'draft', 1, NULL, NULL, NULL, NULL, '2026-09-19 05:54:18', '2026-09-19 05:54:18');

-- --------------------------------------------------------

--
-- Table structure for table `penggajian_items`
--

CREATE TABLE `penggajian_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `penggajian_id` bigint(20) UNSIGNED NOT NULL,
  `tipe_item` enum('borongan','harian','lembur','tunjangan','potongan') NOT NULL,
  `tanggal` date DEFAULT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `jenis_produk` varchar(255) DEFAULT NULL,
  `pcs` int(11) DEFAULT NULL COMMENT 'Untuk item borongan: pcs approved',
  `tarif` decimal(12,2) NOT NULL DEFAULT 0.00,
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `keterangan` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'view dashboard owner', 'web', '2026-09-06 16:10:00', '2026-09-06 16:10:00'),
(2, 'view dashboard admin', 'web', '2026-09-06 16:10:00', '2026-09-06 16:10:00'),
(3, 'view dashboard divisi', 'web', '2026-09-06 16:10:00', '2026-09-06 16:10:00'),
(4, 'manage users', 'web', '2026-09-06 16:10:00', '2026-09-06 16:10:00'),
(5, 'manage roles', 'web', '2026-09-06 16:10:00', '2026-09-06 16:10:00'),
(6, 'view users', 'web', '2026-09-06 16:10:00', '2026-09-06 16:10:00'),
(7, 'create order', 'web', '2026-09-06 16:10:00', '2026-09-06 16:10:00'),
(8, 'edit order', 'web', '2026-09-06 16:10:00', '2026-09-06 16:10:00'),
(9, 'delete order', 'web', '2026-09-06 16:10:00', '2026-09-06 16:10:00'),
(10, 'view all orders', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(11, 'view own division orders', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(12, 'update order status', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(13, 'manage desain', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(14, 'upload mockup', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(15, 'approve desain', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(16, 'manage printing', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(17, 'update printing status', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(18, 'manage pemasangan', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(19, 'update pemasangan status', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(20, 'manage cutting', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(21, 'update cutting status', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(22, 'manage jahit', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(23, 'update jahit status', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(24, 'manage tarif borongan', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(25, 'approve jahit output', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(26, 'manage hr', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(27, 'manage absensi', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(28, 'manage penggajian', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(29, 'approve penggajian', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(30, 'manage produksi', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(31, 'view all production progress', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(32, 'manage gudang', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(33, 'manage stok', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(34, 'manage stok opname', 'web', '2026-09-06 16:10:01', '2026-09-06 16:10:01'),
(35, 'manage pengiriman', 'web', '2026-09-06 16:10:02', '2026-09-06 16:10:02'),
(36, 'manage procurement', 'web', '2026-09-06 16:10:02', '2026-09-06 16:10:02'),
(37, 'manage suppliers', 'web', '2026-09-06 16:10:02', '2026-09-06 16:10:02'),
(38, 'create purchase order', 'web', '2026-09-06 16:10:02', '2026-09-06 16:10:02'),
(39, 'manage keuangan', 'web', '2026-09-06 16:10:02', '2026-09-06 16:10:02'),
(40, 'view financial reports', 'web', '2026-09-06 16:10:02', '2026-09-06 16:10:02'),
(41, 'create invoice', 'web', '2026-09-06 16:10:02', '2026-09-06 16:10:02'),
(42, 'view reports', 'web', '2026-09-06 16:10:02', '2026-09-06 16:10:02'),
(43, 'export reports', 'web', '2026-09-06 16:10:02', '2026-09-06 16:10:02'),
(44, 'manage notifications', 'web', '2026-09-06 16:10:02', '2026-09-06 16:10:02'),
(45, 'manage system config', 'web', '2026-09-06 16:10:02', '2026-09-06 16:10:02'),
(46, 'manage integrations', 'web', '2026-09-06 16:10:02', '2026-09-06 16:10:02');

-- --------------------------------------------------------

--
-- Table structure for table `printings`
--

CREATE TABLE `printings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `metode_cetak` enum('sablon','dtf','dtg') DEFAULT NULL,
  `jumlah_warna` tinyint(3) UNSIGNED DEFAULT NULL,
  `estimasi_selesai` date DEFAULT NULL,
  `tanggal_mulai` date DEFAULT NULL,
  `tanggal_selesai` date DEFAULT NULL,
  `status` enum('menunggu','proses','selesai') NOT NULL DEFAULT 'menunggu',
  `status_qc` enum('lulus','gagal') DEFAULT NULL,
  `catatan_qc` text DEFAULT NULL,
  `foto_qc` varchar(255) DEFAULT NULL,
  `printing_dikerjakan_oleh` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `printings`
--

INSERT INTO `printings` (`id`, `order_id`, `metode_cetak`, `jumlah_warna`, `estimasi_selesai`, `tanggal_mulai`, `tanggal_selesai`, `status`, `status_qc`, `catatan_qc`, `foto_qc`, `printing_dikerjakan_oleh`, `created_at`, `updated_at`) VALUES
(3, 79, NULL, NULL, NULL, NULL, '2026-09-21', 'selesai', 'lulus', NULL, NULL, NULL, '2026-09-18 03:28:27', '2026-09-21 02:55:23'),
(4, 187, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-21 11:52:56', '2026-09-21 11:52:56'),
(5, 189, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-21 11:59:15', '2026-09-21 11:59:15'),
(6, 190, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-21 12:02:11', '2026-09-21 12:02:11'),
(7, 108, 'dtg', 8, '2026-06-23', '2026-09-20', '2026-09-23', 'selesai', 'lulus', 'ada naik kertas di catat aja kekuranganya', NULL, NULL, '2026-09-22 04:03:12', '2026-09-23 10:16:58'),
(8, 128, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:06:23', '2026-09-22 04:06:23'),
(9, 135, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:08:15', '2026-09-22 04:08:15'),
(10, 137, NULL, NULL, NULL, NULL, '2026-09-23', 'selesai', 'lulus', NULL, NULL, NULL, '2026-09-22 04:08:15', '2026-09-23 19:45:21'),
(11, 138, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:08:15', '2026-09-22 04:08:15'),
(12, 139, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:08:15', '2026-09-22 04:08:15'),
(13, 140, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:08:15', '2026-09-22 04:08:15'),
(14, 141, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:08:15', '2026-09-22 04:08:15'),
(15, 142, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:08:15', '2026-09-22 04:08:15'),
(16, 151, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:09:56', '2026-09-22 04:09:56'),
(17, 155, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:09:56', '2026-09-22 04:09:56'),
(18, 159, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:09:56', '2026-09-22 04:09:56'),
(19, 161, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:09:56', '2026-09-22 04:09:56'),
(20, 165, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:10:49', '2026-09-22 04:10:49'),
(21, 170, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:10:49', '2026-09-22 04:10:49'),
(22, 172, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:10:49', '2026-09-22 04:10:49'),
(23, 173, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:10:49', '2026-09-22 04:10:49'),
(24, 174, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:10:49', '2026-09-22 04:10:49'),
(25, 177, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:10:49', '2026-09-22 04:10:49'),
(26, 179, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:10:49', '2026-09-22 04:10:49'),
(27, 180, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:11:45', '2026-09-22 04:11:45'),
(28, 181, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:11:45', '2026-09-22 04:11:45'),
(29, 183, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:11:45', '2026-09-22 04:11:45'),
(30, 184, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:11:45', '2026-09-22 04:11:45'),
(31, 75, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 04:15:26', '2026-09-22 04:15:26'),
(32, 158, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 06:36:37', '2026-09-22 06:36:37'),
(33, 192, NULL, NULL, NULL, NULL, '2026-09-22', 'selesai', 'lulus', 'SIZE ANAK DAN DEWASA', NULL, NULL, '2026-09-22 06:55:26', '2026-09-22 08:11:44'),
(34, 193, NULL, NULL, NULL, NULL, '2026-09-22', 'selesai', 'lulus', '2 UKURAN ANAK DAN DEWASA \n* JERSEY \nWARNA WARNI ANAK DAN ORANG TUA\nWARNA NAVY COACH\n* JAKET \nWARNA WARNI ANAK DAN ORANG TUA\nWARNA NAVY COACH', NULL, NULL, '2026-09-22 07:24:38', '2026-09-22 08:08:46'),
(35, 195, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 07:27:56', '2026-09-22 07:27:56'),
(36, 197, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 07:36:16', '2026-09-22 07:36:16'),
(37, 196, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 07:36:34', '2026-09-22 07:36:34'),
(38, 198, NULL, NULL, NULL, NULL, '2026-09-23', 'selesai', 'lulus', 'PRINT AMAN TINGGAL CEK NAMA PUNGGUNG DAN NO TAKUT ADA YANG TYPO ATAU SALAH', NULL, NULL, '2026-09-22 07:39:08', '2026-09-23 11:07:57'),
(39, 200, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 08:39:02', '2026-09-22 08:39:02'),
(40, 201, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 08:50:35', '2026-09-22 08:50:35'),
(41, 203, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 08:55:34', '2026-09-22 08:55:34'),
(42, 202, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 08:56:37', '2026-09-22 08:56:37'),
(43, 204, NULL, NULL, NULL, NULL, NULL, 'menunggu', NULL, NULL, NULL, NULL, '2026-09-22 09:02:45', '2026-09-22 09:02:45');

-- --------------------------------------------------------

--
-- Table structure for table `produksi_cuttings`
--

CREATE TABLE `produksi_cuttings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `operator_id` bigint(20) UNSIGNED DEFAULT NULL,
  `dikerjakan_oleh` bigint(20) UNSIGNED DEFAULT NULL,
  `tanggal` date DEFAULT NULL,
  `pcs_per_ukuran` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Pcs yang selesai dipotong per ukuran' CHECK (json_valid(`pcs_per_ukuran`)),
  `total_pcs` int(11) NOT NULL DEFAULT 0,
  `qc_akurasi_ukuran` tinyint(1) NOT NULL DEFAULT 0,
  `qc_arah_kain` tinyint(1) NOT NULL DEFAULT 0,
  `qc_tidak_cacat` tinyint(1) NOT NULL DEFAULT 0,
  `catatan_qc` text DEFAULT NULL,
  `status` enum('menunggu','dikerjakan','selesai') NOT NULL DEFAULT 'menunggu',
  `selesai_at` timestamp NULL DEFAULT NULL,
  `catatan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `produksi_cutting_assigns`
--

CREATE TABLE `produksi_cutting_assigns` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `operator_id` bigint(20) UNSIGNED NOT NULL,
  `tarif_per_pcs` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tanggal_assign` date NOT NULL,
  `dibuat_oleh` bigint(20) UNSIGNED NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `catatan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `produksi_cutting_outputs`
--

CREATE TABLE `produksi_cutting_outputs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `assign_id` bigint(20) UNSIGNED NOT NULL,
  `operator_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `tanggal` date NOT NULL,
  `pcs_klaim` int(11) NOT NULL DEFAULT 0,
  `pcs_approved` int(11) DEFAULT NULL,
  `rincian_ukuran` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`rincian_ukuran`)),
  `tarif_per_pcs_snapshot` decimal(12,2) NOT NULL DEFAULT 0.00,
  `upah_kotor` decimal(12,2) NOT NULL DEFAULT 0.00,
  `status` enum('draft','menunggu_approval','approved','rejected') NOT NULL DEFAULT 'draft',
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `catatan_mandor` text DEFAULT NULL,
  `catatan_operator` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `produksi_cutting_qc_rejects`
--

CREATE TABLE `produksi_cutting_qc_rejects` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `operator_id` bigint(20) UNSIGNED NOT NULL,
  `assign_id` bigint(20) UNSIGNED NOT NULL,
  `jumlah` int(11) NOT NULL DEFAULT 0,
  `alasan` text DEFAULT NULL,
  `status` enum('pending','resolved') NOT NULL DEFAULT 'pending',
  `dibuat_oleh` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `produksi_jahit_assigns`
--

CREATE TABLE `produksi_jahit_assigns` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `operator_id` bigint(20) UNSIGNED NOT NULL,
  `jenis_produk` varchar(255) NOT NULL COMMENT 'Jenis produk dalam order ini (kaus, celana, dll)',
  `tarif_per_pcs` decimal(12,2) NOT NULL DEFAULT 0.00 COMMENT 'Tarif borongan per pcs untuk kombinasi ini',
  `tanggal_assign` date NOT NULL,
  `dibuat_oleh` bigint(20) UNSIGNED NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `catatan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `produksi_jahit_outputs`
--

CREATE TABLE `produksi_jahit_outputs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `assign_id` bigint(20) UNSIGNED NOT NULL,
  `operator_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `jenis_produk` varchar(255) NOT NULL,
  `tanggal` date NOT NULL,
  `pcs_klaim` int(11) NOT NULL DEFAULT 0 COMMENT 'Pcs yang diklaim operator',
  `rincian_ukuran` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`rincian_ukuran`)),
  `pcs_approved` int(11) DEFAULT NULL COMMENT 'Pcs yang disetujui mandor',
  `tarif_per_pcs_snapshot` decimal(12,2) NOT NULL DEFAULT 0.00 COMMENT 'Snapshot tarif saat output dicatat (immutable)',
  `upah_kotor` decimal(12,2) NOT NULL DEFAULT 0.00 COMMENT 'pcs_approved * tarif_per_pcs_snapshot',
  `status` enum('draft','menunggu_approval','approved','rejected') NOT NULL DEFAULT 'draft',
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `catatan_mandor` text DEFAULT NULL,
  `catatan_operator` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `produksi_jahit_qc_rejects`
--

CREATE TABLE `produksi_jahit_qc_rejects` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `operator_id` bigint(20) UNSIGNED NOT NULL,
  `assign_id` bigint(20) UNSIGNED NOT NULL,
  `jumlah` int(11) NOT NULL DEFAULT 0 COMMENT 'Jumlah pcs reject final QC',
  `alasan` text DEFAULT NULL,
  `status` enum('pending','resolved') NOT NULL DEFAULT 'pending' COMMENT 'pending = perlu dijahit ulang, resolved = sudah beres',
  `dibuat_oleh` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `produksi_targets`
--

CREATE TABLE `produksi_targets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `divisi` enum('cutting','jahit','printing','pemasangan') NOT NULL,
  `periode` enum('daily','weekly') NOT NULL DEFAULT 'daily',
  `target_pcs` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `berlaku_mulai` date NOT NULL,
  `dibuat_oleh` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_orders`
--

CREATE TABLE `purchase_orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `no_po` varchar(255) NOT NULL,
  `supplier_id` bigint(20) UNSIGNED NOT NULL,
  `tanggal_po` date NOT NULL,
  `status` enum('draft','dikirim','diterima','dibatalkan') NOT NULL DEFAULT 'draft',
  `total_harga` decimal(15,2) NOT NULL DEFAULT 0.00,
  `catatan` text DEFAULT NULL,
  `dibuat_oleh` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order_items`
--

CREATE TABLE `purchase_order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `purchase_order_id` bigint(20) UNSIGNED NOT NULL,
  `bahan_id` bigint(20) UNSIGNED DEFAULT NULL,
  `nama_bahan` varchar(255) NOT NULL,
  `jumlah` decimal(10,2) NOT NULL,
  `satuan` varchar(255) NOT NULL,
  `harga_satuan` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'superadmin', 'web', '2026-09-06 16:10:02', '2026-09-06 16:10:02'),
(2, 'owner', 'web', '2026-09-06 16:10:02', '2026-09-06 16:10:02'),
(3, 'admin', 'web', '2026-09-06 16:10:02', '2026-09-06 16:10:02'),
(4, 'kepala divisi', 'web', '2026-09-06 16:10:02', '2026-09-06 16:10:02'),
(5, 'staf', 'web', '2026-09-06 16:10:02', '2026-09-06 16:10:02'),
(6, 'customer', 'web', '2026-09-06 16:10:02', '2026-09-06 16:10:02');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 3),
(3, 1),
(3, 4),
(3, 5),
(4, 1),
(4, 3),
(5, 1),
(6, 1),
(6, 2),
(7, 1),
(7, 3),
(8, 1),
(8, 3),
(9, 1),
(9, 3),
(10, 1),
(10, 2),
(10, 3),
(11, 1),
(11, 4),
(11, 5),
(11, 6),
(12, 1),
(12, 3),
(12, 4),
(12, 5),
(13, 1),
(13, 4),
(14, 1),
(14, 5),
(15, 1),
(15, 2),
(15, 3),
(15, 4),
(16, 1),
(16, 4),
(17, 1),
(17, 5),
(18, 1),
(18, 4),
(19, 1),
(19, 5),
(20, 1),
(20, 4),
(21, 1),
(21, 5),
(22, 1),
(22, 4),
(23, 1),
(23, 5),
(24, 1),
(24, 4),
(25, 1),
(25, 4),
(26, 1),
(26, 4),
(27, 1),
(27, 4),
(28, 1),
(28, 4),
(29, 1),
(29, 4),
(30, 1),
(30, 4),
(31, 1),
(31, 2),
(31, 3),
(32, 1),
(32, 4),
(33, 1),
(33, 4),
(34, 1),
(34, 4),
(34, 5),
(35, 1),
(35, 4),
(36, 1),
(36, 4),
(37, 1),
(37, 4),
(38, 1),
(38, 4),
(39, 1),
(39, 4),
(40, 1),
(40, 2),
(40, 4),
(41, 1),
(41, 4),
(42, 1),
(42, 2),
(42, 3),
(43, 1),
(43, 2),
(43, 3),
(44, 1),
(44, 3),
(45, 1),
(46, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('3SKPCbrkcEnj528dUgA9QSs5QvMLZpWJ1UHM9oTl', 1, '172.69.176.131', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36 Edg/153.0.0.0', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiQk1LTmtPVlp0YVhJdmlFdWpDYXNpNmFjUWVRZExZd3p3djFuOFZKdCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vY3AubmFkaXJsYWJzLm5ldC9vcmRlcnMvODkvaW52b2ljZSI7czo1OiJyb3V0ZSI7czoxNDoib3JkZXJzLmludm9pY2UiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjM6InVybCI7YTowOnt9czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTt9', 1790232602),
('6TuqJvwn0uHJ0OG5ml7AuZYEVFhmveqOC2jpOI61', NULL, '172.70.208.124', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.6 Mobile/15E148 Safari/604.1', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiOU00SW9pdW51SzRpd1BIc0NwQzRJMHR1alVLM0ZoVW5Ib241a0tmaCI7czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czozODoiaHR0cHM6Ly9jcC5uYWRpcmxhYnMubmV0L29yZGVycz9wYWdlPTIiO31zOjk6Il9wcmV2aW91cyI7YToyOntzOjM6InVybCI7czozMDoiaHR0cHM6Ly9jcC5uYWRpcmxhYnMubmV0L2xvZ2luIjtzOjU6InJvdXRlIjtzOjU6ImxvZ2luIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1790226517),
('eMJtE61DGoC64Qti8kBlbnj4rLWnQY9FXE6BpwXV', 1, '162.158.88.2', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Mobile Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiV0xCcUUzeHNDNzVyRXY2RlpnWUhJQ1ZJQTBqNUNOa0JNc2w3bDJheSI7czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjI6e3M6MzoidXJsIjtzOjQyOiJodHRwczovL2NwLm5hZGlybGFicy5uZXQvb3JkZXJzLzg5L2ludm9pY2UiO3M6NToicm91dGUiO3M6MTQ6Im9yZGVycy5pbnZvaWNlIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTt9', 1790230155),
('KLTu36YmYGwWHRAPJhnhWDTx8M2p5CEvo1kN845x', 1, '172.69.176.131', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiMTZOUmllbVFhQWprNVEzaDhWclJOMkhoNVVoSFdHOU5Gc2lVck9jdiI7czozOiJ1cmwiO2E6MDp7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHBzOi8vY3AubmFkaXJsYWJzLm5ldC9vcmRlcnMvMjEyL2ludm9pY2UiO3M6NToicm91dGUiO3M6MTQ6Im9yZGVycy5pbnZvaWNlIjt9fQ==', 1790232775),
('lElBtY7un8SW1R0AkKRBUopXqJSQEwfvrKHz04xZ', 29, '162.158.163.138', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiaGFENW5ST05uaUhoS2xtRkNHUUwwU0NmdUpGMW9TWG1zOGZHaDQ3diI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vY3AubmFkaXJsYWJzLm5ldC9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6MzoidXJsIjthOjA6e31zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToyOTt9', 1790232592),
('vchNTagIdhVSb7CJRet8m5RNLOrXrqZ5fPMd532l', NULL, '172.71.81.176', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 OPR/135.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiOGJRWnplNndEZ2lxUll4bG1rd0Y2MUFJVUg5cTVkZjk1d2ZJWmtURCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1790232774),
('VvulPWGllpqOe4P7UJGIvowF1jGTiowKshrI2Grj', NULL, '162.158.107.82', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoibllQWVZDVFF2eUg4SHZndEJGdVZ5SDhNUkJrOU5MQ2RyckdzaWN4RCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vY3AubmFkaXJsYWJzLm5ldC9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6MzoidXJsIjthOjE6e3M6ODoiaW50ZW5kZWQiO3M6MzQ6Imh0dHBzOi8vY3AubmFkaXJsYWJzLm5ldC9kYXNoYm9hcmQiO319', 1790226470);

-- --------------------------------------------------------

--
-- Table structure for table `stok_bahan`
--

CREATE TABLE `stok_bahan` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_bahan` varchar(255) NOT NULL,
  `satuan` varchar(255) NOT NULL,
  `jumlah_stok` decimal(10,2) NOT NULL DEFAULT 0.00,
  `minimum_stok` decimal(10,2) NOT NULL DEFAULT 0.00,
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stok_bahan`
--

INSERT INTO `stok_bahan` (`id`, `nama_bahan`, `satuan`, `jumlah_stok`, `minimum_stok`, `keterangan`, `created_at`, `updated_at`) VALUES
(1, 'MILANO', 'KG', 5.00, 10.00, NULL, '2026-09-19 05:43:30', '2026-09-22 14:36:07');

-- --------------------------------------------------------

--
-- Table structure for table `stok_mutasi`
--

CREATE TABLE `stok_mutasi` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `bahan_id` bigint(20) UNSIGNED NOT NULL,
  `tipe` enum('masuk','keluar') NOT NULL,
  `jumlah` decimal(10,2) NOT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `mutasi_order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `mutasi_created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stok_mutasi`
--

INSERT INTO `stok_mutasi` (`id`, `bahan_id`, `tipe`, `jumlah`, `keterangan`, `mutasi_order_id`, `mutasi_created_by`, `created_at`, `updated_at`) VALUES
(1, 1, 'masuk', 25.00, 'Stok awal', NULL, 1, '2026-09-19 05:43:30', '2026-09-19 05:43:30'),
(2, 1, 'keluar', 5.00, NULL, NULL, 1, '2026-09-22 14:35:52', '2026-09-22 14:35:52'),
(3, 1, 'keluar', 15.00, NULL, NULL, 1, '2026-09-22 14:36:07', '2026-09-22 14:36:07');

-- --------------------------------------------------------

--
-- Table structure for table `stok_opnames`
--

CREATE TABLE `stok_opnames` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tanggal` date NOT NULL,
  `catatan` text DEFAULT NULL,
  `status` enum('draft','menunggu_approval','disetujui','ditolak') NOT NULL DEFAULT 'draft',
  `dibuat_oleh` bigint(20) UNSIGNED NOT NULL,
  `disetujui_oleh` bigint(20) UNSIGNED DEFAULT NULL,
  `disetujui_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stok_opname_items`
--

CREATE TABLE `stok_opname_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `stok_opname_id` bigint(20) UNSIGNED NOT NULL,
  `bahan_id` bigint(20) UNSIGNED NOT NULL,
  `nama_bahan` varchar(255) NOT NULL,
  `satuan` varchar(255) NOT NULL,
  `stok_sistem` decimal(10,2) NOT NULL,
  `stok_fisik` decimal(10,2) DEFAULT NULL,
  `selisih` decimal(10,2) DEFAULT NULL,
  `keterangan_selisih` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama` varchar(255) NOT NULL,
  `kontak` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `catatan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `group` varchar(255) NOT NULL DEFAULT 'umum',
  `label` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'text',
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`id`, `key`, `value`, `group`, `label`, `description`, `type`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'produksi.threshold.cutting', '2', 'produksi', 'Threshold Bottleneck: Cutting (hari)', 'Jumlah hari maksimal sebuah order berada di status Cutting sebelum dianggap bottleneck.', 'number', 1, '2026-09-06 16:10:00', '2026-09-22 05:00:16'),
(2, 'produksi.threshold.jahit', '7', 'produksi', 'Threshold Bottleneck: Jahit (hari)', 'Jumlah hari maksimal sebuah order berada di status Jahit sebelum dianggap bottleneck.', 'number', 1, '2026-09-06 16:10:00', '2026-09-22 05:00:16'),
(3, 'produksi.threshold.printing', '7', 'produksi', 'Threshold Bottleneck: Printing (hari)', 'Jumlah hari maksimal sebuah order berada di status Printing sebelum dianggap bottleneck.', 'number', 1, '2026-09-06 16:10:00', '2026-09-22 05:00:16'),
(4, 'produksi.threshold.pemasangan', '2', 'produksi', 'Threshold Bottleneck: Pemasangan (hari)', 'Jumlah hari maksimal sebuah order berada di status Pemasangan sebelum dianggap bottleneck.', 'number', 1, '2026-09-06 16:10:00', '2026-09-22 05:00:16'),
(5, 'company.name', 'CAPOLISTA APPAREL', 'company', 'Nama Perusahaan', 'Nama perusahaan yang akan ditampilkan pada sistem dan invoice.', 'text', 1, '2026-09-06 16:10:00', '2026-09-22 05:00:16'),
(6, 'company.address', 'Jl. Jendral Sudirman No.105-140, Kota Kulon, Kec. Garut Kota, Kabupaten Garut, Jawa Barat 44112', 'company', 'Alamat Perusahaan', 'Alamat lengkap perusahaan untuk invoice.', 'text', 1, '2026-09-06 16:10:00', '2026-09-22 05:00:16'),
(7, 'company.logo', 'settings/iofgMyf218vT8bcHQvB8cDguFNg6D8nRc21OTGPE.png', 'company', 'Logo Perusahaan', 'Upload logo (PNG/JPG).', 'image', 1, '2026-09-06 16:10:00', '2026-09-22 05:00:16'),
(8, 'company.bank_account', 'BCA: 1481509641 a.n. Andrie Achmad Gumilar/ BSI: 7189566039 BSI a.n Andrie Achmad Gumilar', 'company', 'Informasi Rekening', 'Informasi rekening bank untuk pembayaran pada Invoice.', 'text', 1, '2026-09-06 16:10:00', '2026-09-22 05:00:16');

-- --------------------------------------------------------

--
-- Table structure for table `tarif_borongan_histories`
--

CREATE TABLE `tarif_borongan_histories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `assign_id` bigint(20) UNSIGNED NOT NULL,
  `operator_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `jenis_produk` varchar(255) NOT NULL,
  `tarif_per_pcs_lama` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tarif_per_pcs_baru` decimal(12,2) NOT NULL DEFAULT 0.00,
  `berlaku_mulai` timestamp NOT NULL,
  `berlaku_sampai` timestamp NULL DEFAULT NULL,
  `diubah_oleh` bigint(20) UNSIGNED NOT NULL,
  `alasan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tarif_cutting_histories`
--

CREATE TABLE `tarif_cutting_histories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `assign_id` bigint(20) UNSIGNED NOT NULL,
  `operator_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `tarif_per_pcs_lama` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tarif_per_pcs_baru` decimal(12,2) NOT NULL DEFAULT 0.00,
  `berlaku_mulai` timestamp NOT NULL,
  `berlaku_sampai` timestamp NULL DEFAULT NULL,
  `diubah_oleh` bigint(20) UNSIGNED NOT NULL,
  `alasan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `level_akses` tinyint(4) NOT NULL DEFAULT 4,
  `divisi` varchar(255) DEFAULT NULL,
  `nik` varchar(255) DEFAULT NULL,
  `jabatan` varchar(255) DEFAULT NULL,
  `tanggal_masuk` date DEFAULT NULL,
  `tipe_gaji` enum('borongan','harian','bulanan') DEFAULT NULL,
  `tarif_default` decimal(12,2) DEFAULT NULL COMMENT 'Tarif harian untuk karyawan harian / gaji pokok untuk bulanan',
  `tarif_lembur` decimal(12,2) DEFAULT NULL COMMENT 'Tarif per jam lembur',
  `no_hp` varchar(255) DEFAULT NULL,
  `alamat` varchar(255) DEFAULT NULL,
  `mesin_pos` varchar(255) DEFAULT NULL COMMENT 'Nomor mesin / pos kerja untuk operator jahit & cutting',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `level_akses`, `divisi`, `nik`, `jabatan`, `tanggal_masuk`, `tipe_gaji`, `tarif_default`, `tarif_lembur`, `no_hp`, `alamat`, `mesin_pos`, `is_active`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Superadmin', 'superadmin@capolista.com', NULL, '$2y$12$QGSIQHoyFhxbV4i1JLapoeLmYTwOW2q4q5b2hHTAB6QkBDJos/v5u', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-09-06 16:10:03', '2026-09-06 16:10:03'),
(29, 'RIZKI FADILAH', 'rizkicapolista@gmail.com', NULL, '$2y$12$NGbxj7sbwzWj8OYyAo9tUODiVIZbistLVtU.btL/VzH2pBAC8burO', 3, 'printing', NULL, 'DESIGN PRINTING', '2020-04-17', 'harian', 80000.00, 10000.00, NULL, NULL, 'MESIN PRINT 1', 1, NULL, '2026-09-17 07:51:09', '2026-09-17 07:51:44'),
(30, 'JEFRI', 'jefricapolista@gmail.com', NULL, '$2y$12$7izvr9OeNYO9guNEtCZwlOHNzklt.2IBZJ0xGgEwCANVsZ38g.ixC', 3, 'pemasangan', NULL, 'PEMASANGAN/PRESS', NULL, 'harian', 80000.00, 10000.00, NULL, NULL, NULL, 1, 'dE6VdhJ46jclgSXBRbVGTEBXYWV0xGiMar0veDNWuTub8XkmY0wbbKQ9fmJO', '2026-09-22 12:17:14', '2026-09-22 12:17:14'),
(31, 'CAHYA SUHENDAR', 'cahyacapolista@gmail.com', NULL, '$2y$12$H3EWxEY3mluB.RSghnQ6qOyeLjfOWuCVrydOWS1RoBKfVCjLfxf3y', 4, 'jahit', NULL, NULL, NULL, 'borongan', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-09-22 12:18:27', '2026-09-22 12:21:56'),
(32, 'Andrie Achmad Gumilar', 'andriecapolista@gmail.com', NULL, '$2y$12$Wamh/I1sD1UtXrRkkL7ENORLRAXvxq0YX6TNL/8ELSgs4VqebUThu', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'IyrVhXNlRfi7M56NjoUFwNnux5D4X81e1PquF1tlY0BaWIeqtbXxn1dT2G4U', '2026-09-22 12:19:08', '2026-09-22 12:19:08'),
(33, 'SUPRIADI', 'uvcapolista@gmail.com', NULL, '$2y$12$e..qkRQbnRXr8bRU0qFnLua4AHTdXKq8.j831UoRuV9LOxihyMkla', 4, 'pembelian', NULL, NULL, NULL, 'harian', 80000.00, 10000.00, NULL, NULL, NULL, 1, NULL, '2026-09-22 12:21:30', '2026-09-22 12:21:30'),
(34, 'NOVIYANTO', 'novicapolista@gmail.com', NULL, '$2y$12$gHwBqgztYAcnkV71/JMoz.KPYR5cn/vqVoKNv7CXewGP7nYe/Nute', 4, 'gudang', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-09-22 14:32:47', '2026-09-22 14:32:47'),
(35, 'Agung Deco', 'agungcapolista@gmail.com', NULL, '$2y$12$zYXQl1Ik2ApwnL9vNXdJt.1ptCut/oxMAYvc1.6ubnuZJg0G6sibu', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'Jv7yIzaWGtasvKvh8uiUUTLZZGrWoE7f9io4gARJtU5Nqqp3kZ1I7K2Wof1v', '2026-09-23 13:03:19', '2026-09-23 13:03:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `absensi`
--
ALTER TABLE `absensi`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_absensi_harian` (`karyawan_id`,`tanggal`),
  ADD KEY `absensi_dicatat_oleh_foreign` (`dicatat_oleh`);

--
-- Indexes for table `activity_log`
--
ALTER TABLE `activity_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subject` (`subject_type`,`subject_id`),
  ADD KEY `causer` (`causer_type`,`causer_id`),
  ADD KEY `activity_log_log_name_index` (`log_name`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customers_nama_index` (`nama`);

--
-- Indexes for table `desains`
--
ALTER TABLE `desains`
  ADD PRIMARY KEY (`id`),
  ADD KEY `desains_order_id_foreign` (`order_id`),
  ADD KEY `desains_desain_dikerjakan_oleh_foreign` (`desain_dikerjakan_oleh`),
  ADD KEY `desains_desain_disetujui_oleh_foreign` (`desain_disetujui_oleh`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orders_no_order_unique` (`no_order`),
  ADD KEY `orders_customer_id_foreign` (`customer_id`),
  ADD KEY `orders_created_by_foreign` (`created_by`),
  ADD KEY `orders_status_index` (`status`),
  ADD KEY `orders_deadline_index` (`deadline`),
  ADD KEY `orders_tanggal_order_index` (`tanggal_order`);

--
-- Indexes for table `order_files`
--
ALTER TABLE `order_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_files_order_id_foreign` (`order_id`),
  ADD KEY `order_files_uploaded_by_foreign` (`uploaded_by`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_order_id_foreign` (`order_id`);

--
-- Indexes for table `order_logs`
--
ALTER TABLE `order_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_logs_order_id_foreign` (`order_id`),
  ADD KEY `order_logs_user_id_foreign` (`user_id`);

--
-- Indexes for table `packings`
--
ALTER TABLE `packings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `packings_order_id_unique` (`order_id`),
  ADD KEY `packings_packing_dikerjakan_oleh_foreign` (`packing_dikerjakan_oleh`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `pemasangans`
--
ALTER TABLE `pemasangans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pemasangans_order_id_foreign` (`order_id`),
  ADD KEY `pemasangans_pemasangan_dikerjakan_oleh_foreign` (`pemasangan_dikerjakan_oleh`);

--
-- Indexes for table `pembayarans`
--
ALTER TABLE `pembayarans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pembayarans_order_id_foreign` (`order_id`),
  ADD KEY `pembayarans_dicatat_oleh_foreign` (`dicatat_oleh`);

--
-- Indexes for table `pengeluarans`
--
ALTER TABLE `pengeluarans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pengeluarans_order_id_foreign` (`order_id`),
  ADD KEY `pengeluarans_dicatat_oleh_foreign` (`dicatat_oleh`);

--
-- Indexes for table `penggajians`
--
ALTER TABLE `penggajians`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_penggajian_periode` (`karyawan_id`,`periode_mulai`,`periode_selesai`),
  ADD KEY `penggajians_dibuat_oleh_foreign` (`dibuat_oleh`),
  ADD KEY `penggajians_disetujui_oleh_foreign` (`disetujui_oleh`);

--
-- Indexes for table `penggajian_items`
--
ALTER TABLE `penggajian_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `penggajian_items_penggajian_id_foreign` (`penggajian_id`),
  ADD KEY `penggajian_items_order_id_foreign` (`order_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `printings`
--
ALTER TABLE `printings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `printings_order_id_foreign` (`order_id`),
  ADD KEY `printings_printing_dikerjakan_oleh_foreign` (`printing_dikerjakan_oleh`);

--
-- Indexes for table `produksi_cuttings`
--
ALTER TABLE `produksi_cuttings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `produksi_cuttings_order_id_foreign` (`order_id`),
  ADD KEY `produksi_cuttings_operator_id_foreign` (`operator_id`),
  ADD KEY `produksi_cuttings_dikerjakan_oleh_foreign` (`dikerjakan_oleh`);

--
-- Indexes for table `produksi_cutting_assigns`
--
ALTER TABLE `produksi_cutting_assigns`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_cutting_assign_aktif` (`order_id`,`operator_id`),
  ADD KEY `produksi_cutting_assigns_operator_id_foreign` (`operator_id`),
  ADD KEY `produksi_cutting_assigns_dibuat_oleh_foreign` (`dibuat_oleh`);

--
-- Indexes for table `produksi_cutting_outputs`
--
ALTER TABLE `produksi_cutting_outputs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `produksi_cutting_outputs_assign_id_foreign` (`assign_id`),
  ADD KEY `produksi_cutting_outputs_operator_id_foreign` (`operator_id`),
  ADD KEY `produksi_cutting_outputs_order_id_foreign` (`order_id`),
  ADD KEY `produksi_cutting_outputs_approved_by_foreign` (`approved_by`);

--
-- Indexes for table `produksi_cutting_qc_rejects`
--
ALTER TABLE `produksi_cutting_qc_rejects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `produksi_cutting_qc_rejects_order_id_foreign` (`order_id`),
  ADD KEY `produksi_cutting_qc_rejects_operator_id_foreign` (`operator_id`),
  ADD KEY `produksi_cutting_qc_rejects_assign_id_foreign` (`assign_id`),
  ADD KEY `produksi_cutting_qc_rejects_dibuat_oleh_foreign` (`dibuat_oleh`);

--
-- Indexes for table `produksi_jahit_assigns`
--
ALTER TABLE `produksi_jahit_assigns`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_assign_aktif` (`order_id`,`operator_id`,`jenis_produk`),
  ADD KEY `produksi_jahit_assigns_operator_id_foreign` (`operator_id`),
  ADD KEY `produksi_jahit_assigns_dibuat_oleh_foreign` (`dibuat_oleh`);

--
-- Indexes for table `produksi_jahit_outputs`
--
ALTER TABLE `produksi_jahit_outputs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `produksi_jahit_outputs_assign_id_foreign` (`assign_id`),
  ADD KEY `produksi_jahit_outputs_order_id_foreign` (`order_id`),
  ADD KEY `produksi_jahit_outputs_approved_by_foreign` (`approved_by`),
  ADD KEY `produksi_jahit_outputs_operator_id_foreign` (`operator_id`);

--
-- Indexes for table `produksi_jahit_qc_rejects`
--
ALTER TABLE `produksi_jahit_qc_rejects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `produksi_jahit_qc_rejects_order_id_foreign` (`order_id`),
  ADD KEY `produksi_jahit_qc_rejects_operator_id_foreign` (`operator_id`),
  ADD KEY `produksi_jahit_qc_rejects_assign_id_foreign` (`assign_id`),
  ADD KEY `produksi_jahit_qc_rejects_dibuat_oleh_foreign` (`dibuat_oleh`);

--
-- Indexes for table `produksi_targets`
--
ALTER TABLE `produksi_targets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `produksi_targets_divisi_periode_berlaku_mulai_unique` (`divisi`,`periode`,`berlaku_mulai`),
  ADD KEY `produksi_targets_dibuat_oleh_foreign` (`dibuat_oleh`);

--
-- Indexes for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `purchase_orders_no_po_unique` (`no_po`),
  ADD KEY `purchase_orders_supplier_id_foreign` (`supplier_id`),
  ADD KEY `purchase_orders_dibuat_oleh_foreign` (`dibuat_oleh`);

--
-- Indexes for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_order_items_purchase_order_id_foreign` (`purchase_order_id`),
  ADD KEY `purchase_order_items_bahan_id_foreign` (`bahan_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `stok_bahan`
--
ALTER TABLE `stok_bahan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stok_mutasi`
--
ALTER TABLE `stok_mutasi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stok_mutasi_bahan_id_foreign` (`bahan_id`),
  ADD KEY `stok_mutasi_mutasi_order_id_foreign` (`mutasi_order_id`),
  ADD KEY `stok_mutasi_mutasi_created_by_foreign` (`mutasi_created_by`);

--
-- Indexes for table `stok_opnames`
--
ALTER TABLE `stok_opnames`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stok_opnames_dibuat_oleh_foreign` (`dibuat_oleh`),
  ADD KEY `stok_opnames_disetujui_oleh_foreign` (`disetujui_oleh`);

--
-- Indexes for table `stok_opname_items`
--
ALTER TABLE `stok_opname_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stok_opname_items_stok_opname_id_foreign` (`stok_opname_id`),
  ADD KEY `stok_opname_items_bahan_id_foreign` (`bahan_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `system_settings_key_unique` (`key`),
  ADD KEY `system_settings_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `tarif_borongan_histories`
--
ALTER TABLE `tarif_borongan_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tarif_borongan_histories_assign_id_foreign` (`assign_id`),
  ADD KEY `tarif_borongan_histories_operator_id_foreign` (`operator_id`),
  ADD KEY `tarif_borongan_histories_order_id_foreign` (`order_id`),
  ADD KEY `tarif_borongan_histories_diubah_oleh_foreign` (`diubah_oleh`);

--
-- Indexes for table `tarif_cutting_histories`
--
ALTER TABLE `tarif_cutting_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tarif_cutting_histories_assign_id_foreign` (`assign_id`),
  ADD KEY `tarif_cutting_histories_operator_id_foreign` (`operator_id`),
  ADD KEY `tarif_cutting_histories_order_id_foreign` (`order_id`),
  ADD KEY `tarif_cutting_histories_diubah_oleh_foreign` (`diubah_oleh`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_level_akses_index` (`level_akses`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `absensi`
--
ALTER TABLE `absensi`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `activity_log`
--
ALTER TABLE `activity_log`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=150;

--
-- AUTO_INCREMENT for table `desains`
--
ALTER TABLE `desains`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=213;

--
-- AUTO_INCREMENT for table `order_files`
--
ALTER TABLE `order_files`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=383;

--
-- AUTO_INCREMENT for table `order_logs`
--
ALTER TABLE `order_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=371;

--
-- AUTO_INCREMENT for table `packings`
--
ALTER TABLE `packings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pemasangans`
--
ALTER TABLE `pemasangans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `pembayarans`
--
ALTER TABLE `pembayarans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=346;

--
-- AUTO_INCREMENT for table `pengeluarans`
--
ALTER TABLE `pengeluarans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `penggajians`
--
ALTER TABLE `penggajians`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `penggajian_items`
--
ALTER TABLE `penggajian_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `printings`
--
ALTER TABLE `printings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `produksi_cuttings`
--
ALTER TABLE `produksi_cuttings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `produksi_cutting_assigns`
--
ALTER TABLE `produksi_cutting_assigns`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `produksi_cutting_outputs`
--
ALTER TABLE `produksi_cutting_outputs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `produksi_cutting_qc_rejects`
--
ALTER TABLE `produksi_cutting_qc_rejects`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `produksi_jahit_assigns`
--
ALTER TABLE `produksi_jahit_assigns`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `produksi_jahit_outputs`
--
ALTER TABLE `produksi_jahit_outputs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `produksi_jahit_qc_rejects`
--
ALTER TABLE `produksi_jahit_qc_rejects`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `produksi_targets`
--
ALTER TABLE `produksi_targets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `stok_bahan`
--
ALTER TABLE `stok_bahan`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `stok_mutasi`
--
ALTER TABLE `stok_mutasi`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `stok_opnames`
--
ALTER TABLE `stok_opnames`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stok_opname_items`
--
ALTER TABLE `stok_opname_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tarif_borongan_histories`
--
ALTER TABLE `tarif_borongan_histories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tarif_cutting_histories`
--
ALTER TABLE `tarif_cutting_histories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `absensi`
--
ALTER TABLE `absensi`
  ADD CONSTRAINT `absensi_dicatat_oleh_foreign` FOREIGN KEY (`dicatat_oleh`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `absensi_karyawan_id_foreign` FOREIGN KEY (`karyawan_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `desains`
--
ALTER TABLE `desains`
  ADD CONSTRAINT `desains_desain_dikerjakan_oleh_foreign` FOREIGN KEY (`desain_dikerjakan_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `desains_desain_disetujui_oleh_foreign` FOREIGN KEY (`desain_disetujui_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `desains_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_files`
--
ALTER TABLE `order_files`
  ADD CONSTRAINT `order_files_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_files_uploaded_by_foreign` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_logs`
--
ALTER TABLE `order_logs`
  ADD CONSTRAINT `order_logs_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `packings`
--
ALTER TABLE `packings`
  ADD CONSTRAINT `packings_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `packings_packing_dikerjakan_oleh_foreign` FOREIGN KEY (`packing_dikerjakan_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `pemasangans`
--
ALTER TABLE `pemasangans`
  ADD CONSTRAINT `pemasangans_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pemasangans_pemasangan_dikerjakan_oleh_foreign` FOREIGN KEY (`pemasangan_dikerjakan_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `pembayarans`
--
ALTER TABLE `pembayarans`
  ADD CONSTRAINT `pembayarans_dicatat_oleh_foreign` FOREIGN KEY (`dicatat_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pembayarans_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pengeluarans`
--
ALTER TABLE `pengeluarans`
  ADD CONSTRAINT `pengeluarans_dicatat_oleh_foreign` FOREIGN KEY (`dicatat_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pengeluarans_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `penggajians`
--
ALTER TABLE `penggajians`
  ADD CONSTRAINT `penggajians_dibuat_oleh_foreign` FOREIGN KEY (`dibuat_oleh`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `penggajians_disetujui_oleh_foreign` FOREIGN KEY (`disetujui_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `penggajians_karyawan_id_foreign` FOREIGN KEY (`karyawan_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `penggajian_items`
--
ALTER TABLE `penggajian_items`
  ADD CONSTRAINT `penggajian_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `penggajian_items_penggajian_id_foreign` FOREIGN KEY (`penggajian_id`) REFERENCES `penggajians` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `printings`
--
ALTER TABLE `printings`
  ADD CONSTRAINT `printings_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `printings_printing_dikerjakan_oleh_foreign` FOREIGN KEY (`printing_dikerjakan_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `produksi_cuttings`
--
ALTER TABLE `produksi_cuttings`
  ADD CONSTRAINT `produksi_cuttings_dikerjakan_oleh_foreign` FOREIGN KEY (`dikerjakan_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `produksi_cuttings_operator_id_foreign` FOREIGN KEY (`operator_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `produksi_cuttings_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `produksi_cutting_assigns`
--
ALTER TABLE `produksi_cutting_assigns`
  ADD CONSTRAINT `produksi_cutting_assigns_dibuat_oleh_foreign` FOREIGN KEY (`dibuat_oleh`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `produksi_cutting_assigns_operator_id_foreign` FOREIGN KEY (`operator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `produksi_cutting_assigns_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `produksi_cutting_outputs`
--
ALTER TABLE `produksi_cutting_outputs`
  ADD CONSTRAINT `produksi_cutting_outputs_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `produksi_cutting_outputs_assign_id_foreign` FOREIGN KEY (`assign_id`) REFERENCES `produksi_cutting_assigns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `produksi_cutting_outputs_operator_id_foreign` FOREIGN KEY (`operator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `produksi_cutting_outputs_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `produksi_cutting_qc_rejects`
--
ALTER TABLE `produksi_cutting_qc_rejects`
  ADD CONSTRAINT `produksi_cutting_qc_rejects_assign_id_foreign` FOREIGN KEY (`assign_id`) REFERENCES `produksi_cutting_assigns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `produksi_cutting_qc_rejects_dibuat_oleh_foreign` FOREIGN KEY (`dibuat_oleh`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `produksi_cutting_qc_rejects_operator_id_foreign` FOREIGN KEY (`operator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `produksi_cutting_qc_rejects_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `produksi_jahit_assigns`
--
ALTER TABLE `produksi_jahit_assigns`
  ADD CONSTRAINT `produksi_jahit_assigns_dibuat_oleh_foreign` FOREIGN KEY (`dibuat_oleh`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `produksi_jahit_assigns_operator_id_foreign` FOREIGN KEY (`operator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `produksi_jahit_assigns_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `produksi_jahit_outputs`
--
ALTER TABLE `produksi_jahit_outputs`
  ADD CONSTRAINT `produksi_jahit_outputs_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `produksi_jahit_outputs_assign_id_foreign` FOREIGN KEY (`assign_id`) REFERENCES `produksi_jahit_assigns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `produksi_jahit_outputs_operator_id_foreign` FOREIGN KEY (`operator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `produksi_jahit_outputs_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `produksi_jahit_qc_rejects`
--
ALTER TABLE `produksi_jahit_qc_rejects`
  ADD CONSTRAINT `produksi_jahit_qc_rejects_assign_id_foreign` FOREIGN KEY (`assign_id`) REFERENCES `produksi_jahit_assigns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `produksi_jahit_qc_rejects_dibuat_oleh_foreign` FOREIGN KEY (`dibuat_oleh`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `produksi_jahit_qc_rejects_operator_id_foreign` FOREIGN KEY (`operator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `produksi_jahit_qc_rejects_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `produksi_targets`
--
ALTER TABLE `produksi_targets`
  ADD CONSTRAINT `produksi_targets_dibuat_oleh_foreign` FOREIGN KEY (`dibuat_oleh`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD CONSTRAINT `purchase_orders_dibuat_oleh_foreign` FOREIGN KEY (`dibuat_oleh`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_orders_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  ADD CONSTRAINT `purchase_order_items_bahan_id_foreign` FOREIGN KEY (`bahan_id`) REFERENCES `stok_bahan` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `purchase_order_items_purchase_order_id_foreign` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stok_mutasi`
--
ALTER TABLE `stok_mutasi`
  ADD CONSTRAINT `stok_mutasi_bahan_id_foreign` FOREIGN KEY (`bahan_id`) REFERENCES `stok_bahan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stok_mutasi_mutasi_created_by_foreign` FOREIGN KEY (`mutasi_created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stok_mutasi_mutasi_order_id_foreign` FOREIGN KEY (`mutasi_order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `stok_opnames`
--
ALTER TABLE `stok_opnames`
  ADD CONSTRAINT `stok_opnames_dibuat_oleh_foreign` FOREIGN KEY (`dibuat_oleh`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `stok_opnames_disetujui_oleh_foreign` FOREIGN KEY (`disetujui_oleh`) REFERENCES `users` (`id`);

--
-- Constraints for table `stok_opname_items`
--
ALTER TABLE `stok_opname_items`
  ADD CONSTRAINT `stok_opname_items_bahan_id_foreign` FOREIGN KEY (`bahan_id`) REFERENCES `stok_bahan` (`id`),
  ADD CONSTRAINT `stok_opname_items_stok_opname_id_foreign` FOREIGN KEY (`stok_opname_id`) REFERENCES `stok_opnames` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD CONSTRAINT `system_settings_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `tarif_borongan_histories`
--
ALTER TABLE `tarif_borongan_histories`
  ADD CONSTRAINT `tarif_borongan_histories_assign_id_foreign` FOREIGN KEY (`assign_id`) REFERENCES `produksi_jahit_assigns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tarif_borongan_histories_diubah_oleh_foreign` FOREIGN KEY (`diubah_oleh`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tarif_borongan_histories_operator_id_foreign` FOREIGN KEY (`operator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tarif_borongan_histories_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tarif_cutting_histories`
--
ALTER TABLE `tarif_cutting_histories`
  ADD CONSTRAINT `tarif_cutting_histories_assign_id_foreign` FOREIGN KEY (`assign_id`) REFERENCES `produksi_cutting_assigns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tarif_cutting_histories_diubah_oleh_foreign` FOREIGN KEY (`diubah_oleh`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tarif_cutting_histories_operator_id_foreign` FOREIGN KEY (`operator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tarif_cutting_histories_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
