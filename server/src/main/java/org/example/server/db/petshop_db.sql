-- Tạo và sử dụng database
CREATE DATABASE IF NOT EXISTS `petshop_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `petshop_db`;

-- 1. Bảng users
CREATE TABLE `users` (
                         `id` bigint AUTO_INCREMENT PRIMARY KEY,
                         `username` varchar(50) NOT NULL UNIQUE,
                         `password` varchar(255) NOT NULL,
                         `email` varchar(100) NOT NULL UNIQUE,
                         `full_name` varchar(100),
                         `phone` varchar(15),
                         `address` text,
                         `is_staff` tinyint(1) DEFAULT 0,
                         `created_at` timestamp DEFAULT current_timestamp()
);

-- 2. Bảng categories
CREATE TABLE `categories` (
                              `id` int AUTO_INCREMENT PRIMARY KEY,
                              `name` varchar(100) NOT NULL,
                              `description` text
);

-- 3. Bảng products (Phụ thuộc vào categories)
CREATE TABLE `products` (
                            `id` bigint AUTO_INCREMENT PRIMARY KEY,
                            `category_id` int NOT NULL,
                            `name` varchar(255) NOT NULL,
                            `price` decimal(10, 2) NOT NULL,
                            `stock_quantity` int DEFAULT 0,
                            `image_url` text,
                            `description` text,
                            `created_at` timestamp DEFAULT current_timestamp(),
                            FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 4. Bảng carts (Phụ thuộc vào users)
CREATE TABLE `carts` (
                         `id` bigint AUTO_INCREMENT PRIMARY KEY,
                         `user_id` bigint NOT NULL UNIQUE,
                         FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5. Bảng cart_items (Phụ thuộc vào carts và products)
CREATE TABLE `cart_items` (
                              `id` bigint AUTO_INCREMENT PRIMARY KEY,
                              `cart_id` bigint NOT NULL,
                              `product_id` bigint NOT NULL,
                              `quantity` int NOT NULL DEFAULT 1,
                              FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
                              FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. Bảng orders (Phụ thuộc vào users)
CREATE TABLE `orders` (
                          `id` bigint AUTO_INCREMENT PRIMARY KEY,
                          `user_id` bigint NOT NULL,
                          `total_amount` decimal(10, 2) NOT NULL,
                          `status` varchar(50) DEFAULT 'Pending',
                          `shipping_address` text NOT NULL,
                          `order_date` timestamp DEFAULT current_timestamp(),
                          FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 7. Bảng order_items (Phụ thuộc vào orders và products)
CREATE TABLE `order_items` (
                               `id` bigint AUTO_INCREMENT PRIMARY KEY,
                               `order_id` bigint NOT NULL,
                               `product_id` bigint NOT NULL,
                               `price` decimal(10, 2) NOT NULL,
                               `quantity` int NOT NULL,
                               FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
                               FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);