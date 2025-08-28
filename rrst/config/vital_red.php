<?php

return [
    /*
    |--------------------------------------------------------------------------
    | VITAL RED System Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration settings for the VITAL RED hospital referral system
    |
    */

    'ai_system' => [
        'base_url' => env('AI_SYSTEM_URL', 'http://localhost:3000'),
        'timeout' => env('AI_SYSTEM_TIMEOUT', 30),
        'retry_attempts' => env('AI_SYSTEM_RETRY', 3),
        'endpoints' => [
            'medical_cases' => '/api/medical-cases',
            'patient_data' => '/api/patient-data',
            'urgency_data' => '/api/urgency-data',
            'hospitalization_data' => '/api/hospitalization-data',
            'historical_data' => '/api/historical-data',
            'admin_data' => '/api/admin-data',
        ],
    ],

    'hospital' => [
        'name' => env('HOSPITAL_NAME', 'Hospital Universitaria ESE'),
        'address' => env('HOSPITAL_ADDRESS', 'Calle Principal #123, Ciudad, País'),
        'phone' => env('HOSPITAL_PHONE', '+57 (1) 234-5678'),
        'email' => env('HOSPITAL_EMAIL', 'contacto@hospital.com'),
    ],

    'system' => [
        'timezone' => env('SYSTEM_TIMEZONE', 'America/Bogota'),
        'language' => env('SYSTEM_LANGUAGE', 'es'),
        'session_timeout' => env('SESSION_TIMEOUT', 120), // minutes
        'maintenance_mode' => env('MAINTENANCE_MODE', false),
    ],

    'email' => [
        'smtp_host' => env('MAIL_HOST', 'smtp.gmail.com'),
        'smtp_port' => env('MAIL_PORT', 587),
        'smtp_username' => env('MAIL_USERNAME'),
        'smtp_password' => env('MAIL_PASSWORD'),
        'use_tls' => env('MAIL_ENCRYPTION', 'tls') === 'tls',
    ],

    'ai_processing' => [
        'auto_processing' => env('AI_AUTO_PROCESSING', true),
        'processing_interval' => env('AI_PROCESSING_INTERVAL', 5), // minutes
        'confidence_threshold' => env('AI_CONFIDENCE_THRESHOLD', 85), // percentage
        'notifications_enabled' => env('AI_NOTIFICATIONS', true),
    ],

    'security' => [
        'max_login_attempts' => env('MAX_LOGIN_ATTEMPTS', 5),
        'lockout_duration' => env('LOCKOUT_DURATION', 15), // minutes
        'min_password_length' => env('MIN_PASSWORD_LENGTH', 8),
        'two_factor_auth' => env('TWO_FACTOR_AUTH', false),
        'audit_logs' => env('AUDIT_LOGS', true),
    ],

    'backup' => [
        'auto_backup' => env('AUTO_BACKUP', true),
        'backup_frequency' => env('BACKUP_FREQUENCY', 'daily'), // daily, weekly, monthly
        'backup_time' => env('BACKUP_TIME', '02:00'),
        'retention_days' => env('BACKUP_RETENTION', 30),
        'compress_backups' => env('COMPRESS_BACKUPS', true),
        'cloud_storage' => env('CLOUD_STORAGE', false),
        'cloud_provider' => env('CLOUD_PROVIDER'), // aws, google, azure
    ],

    'monitoring' => [
        'system_health_check' => env('SYSTEM_HEALTH_CHECK', true),
        'performance_monitoring' => env('PERFORMANCE_MONITORING', true),
        'error_reporting' => env('ERROR_REPORTING', true),
        'uptime_monitoring' => env('UPTIME_MONITORING', true),
    ],

    'defaults' => [
        'medical_cases' => [
            'metadata' => [
                'generated_at' => null,
                'total_cases' => 0,
                'source' => 'Default Data',
                'version' => '1.0'
            ],
            'cases' => [],
            'statistics' => [
                'by_priority' => [],
                'by_specialty' => [],
                'by_status' => []
            ]
        ],
        'patient_data' => [
            'metadata' => [
                'generated_at' => null,
                'total_patients' => 0,
                'source' => 'Default Patient Data',
                'version' => '1.0'
            ],
            'patients' => [],
            'statistics' => []
        ],
        'urgency_data' => [
            'metadata' => [
                'generated_at' => null,
                'total_urgencies' => 0,
                'source' => 'Default Urgency Data',
                'version' => '1.0'
            ],
            'urgencies' => [],
            'statistics' => []
        ],
        'hospitalization_data' => [
            'metadata' => [
                'generated_at' => null,
                'total_admissions' => 0,
                'source' => 'Default Hospitalization Data',
                'version' => '1.0'
            ],
            'admissions' => [],
            'statistics' => []
        ],
        'historical_data' => [
            'metadata' => [
                'generated_at' => null,
                'total_records' => 0,
                'source' => 'Default Historical Data',
                'version' => '1.0'
            ],
            'records' => [],
            'statistics' => []
        ],
        'admin_data' => [
            'metadata' => [
                'generated_at' => null,
                'total_records' => 0,
                'source' => 'Default Admin Data',
                'version' => '1.0'
            ],
            'records' => [],
            'statistics' => [
                'total_users' => 0,
                'active_sessions' => 0,
                'system_health' => 'unknown',
                'last_backup' => null
            ]
        ]
    ]
];
