export default {
	apps: [
		{
			name: 'event-api', // Название процесса
			script: './src/index.js', // Стартовый файл
			instances: 1, // Количество инстансов (1 процесс)
			autorestart: true, // Автоматический рестарт при падении
			watch: false, // Не следить за изменениями файлов
			max_memory_restart: '300M', // Перезапуск при утечке памяти (>300МБ)
			env: {
				NODE_ENV: 'production', // Переменные окружения
			},
		},
	],
}
