// Данные о радиостанциях Татарстана
const stations = [
    {
        id: 0,
        name: "Татар радиосы",
        description: "Государственная радиостанция на татарском языке. Транслирует новости, культурные программы, татарскую музыку и народные песни.",
        frequency: "100.5 FM",
        language: "Татарский",
        genre: "Татарская эстрада и народная музыка"
    },
    {
        id: 1,
        name: 'Радио ENERGY',
        description: "Современная татарская музыка, интервью с артистами, культурные обзоры. Популярно среди молодежи.",
        frequency: "92.3 FM",
        language: "Татарский/Русский",
        genre: "Поп-музыка, татарская эстрада"
    },
    {
        id: 2,
        name: "Болгар радиосы",
        description: "Религиозно-просветительские программы, духовная музыка, культурные передачи о татарских традициях.",
        frequency: "91.5 FM",
        language: "Татарский",
        genre: "Духовная и народная музыка"
    },
    {
        id: 3,
        name: 'БИМ радио',
        description: "Популярная музыка, развлекательные шоу, новости. Одна из самых популярных радиостанций в регионе.",
        frequency: "102.8 FM",
        language: "Русский",
        genre: "Поп-музыка, танцевальная"
    },
    {
        id: 4,
        name: "Европа Плюс Казань",
        description: "Международные хиты, новости музыки, развлекательные программы.",
        frequency: "106.8 FM",
        language: "Русский",
        genre: "Поп-музыка, танцевальная"
    },
    {
        id: 5,
        name: "Авторадио Казань",
        description: "Русские хиты, автомобильная тематика, новости дорожного движения.",
        frequency: "103.3 FM",
        language: "Русский",
        genre: "Русская поп-музыка, шлягеры"
    },
    {
        id: 6,
        name: "Ретро FM Казань",
        description: "Музыка 70-х, 80-х, 90-х годов. Ностальгические хиты.",
        frequency: "102.4 FM",
        language: "Русский",
        genre: "Ретро, шлягеры"
    },
    {
        id: 7,
        name: "Наше Радио Казань",
        description: "Русский рок, авторская песня, альтернативная музыка.",
        frequency: "96.8 FM",
        language: "Русский",
        genre: "Рок музыка"
    }
];

// Упрощенная модель рекомендаций (без TensorFlow.js для надежности)
class SimpleRecommendationModel {
    constructor() {
        this.isReady = true;
    }

    // Простая логика рекомендаций на основе правил
    getRecommendation(answers) {
        const [genre, frequency, language, age, news] = answers;
        
        // Правила для рекомендаций:
        if (genre === 1 || genre === 2) { // Татарская эстрада или народные песни
            if (language <= 1) { // Только или в основном татарский
                return stations[0]; // Татар радиосы
            }
            return stations[1]; // ТатАрт
        }
        
        if (genre === 0 && age <= 2) { // Поп-музыка и молодой возраст
            return stations[4]; // Европа Плюс
        }
        
        if (genre === 3) { // Шлягеры и ретро
            return stations[6]; // Ретро FM
        }
        
        if (genre === 4) { // Рок музыка
            return stations[7]; // Наше Радио
        }
        
        if (genre === 5) { // Танцевальная музыка
            return stations[3]; // Радио "Ваня"
        }
        
        if (news === 0 || news === 1) { // Любит новости
            return stations[5]; // Авторадио
        }
        
        // По умолчанию - самая популярная станция
        return stations[3]; // Радио "Ваня"
    }
}


class TensorFlowModel {
    constructor() {
        this.model = null;
        this.isTrained = false;
    }

    async initialize() {
        try {

            this.model = tf.sequential();
            
            this.model.add(tf.layers.dense({
                units: 8,
                activation: 'sigmoid',
                inputShape: [5]
            }));
            
            this.model.add(tf.layers.dense({
                units: stations.length,
                activation: 'softmax'
            }));

            // Компилируем модель с простыми настройками
            this.model.compile({
                optimizer: 'sgd',
                loss: 'categoricalCrossentropy',
                metrics: ['accuracy']
            });

            // Быстрое обучение на минимальных данных
            const xs = tf.tensor2d([
                [0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1],
                [2, 2, 2, 2, 2],
                [3, 3, 3, 3, 3],
                [4, 4, 4, 4, 4],
                [5, 0, 3, 2, 1]
            ]);
            
            const ys = tf.oneHot(tf.tensor1d([0, 1, 2, 3, 4, 5], 'int32'), stations.length);

            await this.model.fit(xs, ys, {
                epochs: 10,
                batchSize: 6,
                verbose: 0
            });

            this.isTrained = true;
            console.log("TensorFlow модель обучена");
            
            xs.dispose();
            ys.dispose();
            
        } catch (error) {
            console.error("Ошибка инициализации TensorFlow:", error);
            this.model = null;
        }
    }

    async getRecommendation(answers) {
        if (!this.model || !this.isTrained) {
            throw new Error("Модель не готова");
        }

        try {
            const input = tf.tensor2d([answers]);
            const predictions = this.model.predict(input);
            const predictionData = await predictions.data();
            
            let maxIndex = 0;
            let maxValue = predictionData[0];
            
            for (let i = 1; i < predictionData.length; i++) {
                if (predictionData[i] > maxValue) {
                    maxValue = predictionData[i];
                    maxIndex = i;
                }
            }

            // Очищаем тензоры
            input.dispose();
            predictions.dispose();

            return stations[maxIndex];
        } catch (error) {
            console.error("Ошибка предсказания:", error);
            throw error;
        }
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', async () => {
    const submitBtn = document.getElementById('submitBtn');
    const restartBtn = document.getElementById('restartBtn');
    const questionnaire = document.getElementById('questionnaire');
    const resultSection = document.getElementById('result');
    const loading = document.getElementById('loading');
    const stationInfo = document.getElementById('stationInfo');

    // Используем простую модель для надежности
    const simpleModel = new SimpleRecommendationModel();
    let tensorflowModel = null;
    let useTensorFlow = false; // Флаг для выбора модели

    async function initializeTensorFlow() {
        try {

            if (typeof tf !== 'undefined' && tf.ready) {
                await tf.ready();
                tensorflowModel = new TensorFlowModel();
                await tensorflowModel.initialize();
                useTensorFlow = true;
                console.log("Используется TensorFlow модель");
            }
        } catch (error) {
            console.log("Используется простая модель:", error.message);
            useTensorFlow = false;
        }
    }

    // Инициализируем модели
    initializeTensorFlow();

    // Обработчик отправки анкеты
    submitBtn.addEventListener('click', async () => {
        try {
            // Собираем ответы
            const answers = [
                parseInt(document.getElementById('genre').value),
                parseInt(document.getElementById('frequency').value),
                parseInt(document.getElementById('language').value),
                parseInt(document.getElementById('age').value),
                parseInt(document.getElementById('news').value)
            ];

            // Проверяем, что все ответы валидны
            if (answers.some(answer => isNaN(answer))) {
                alert("Пожалуйста, ответьте на все вопросы!");
                return;
            }

            // Показываем загрузку
            questionnaire.style.display = 'none';
            loading.style.display = 'block';
            resultSection.style.display = 'none';

            
            setTimeout(async () => {
                try {
                    let recommendation;
                    
                    if (useTensorFlow && tensorflowModel && tensorflowModel.isTrained) {
                        try {
                            recommendation = await tensorflowModel.getRecommendation(answers);
                        } catch (tfError) {
                            console.log("Ошибка TensorFlow, используем простую модель");
                            recommendation = simpleModel.getRecommendation(answers);
                        }
                    } else {
                        recommendation = simpleModel.getRecommendation(answers);
                    }

                    // Показываем результат
                    loading.style.display = 'none';
                    resultSection.style.display = 'block';

                    // Отображаем информацию о станции
                    stationInfo.innerHTML = `
                        <div class="station-card">
                            <h3 class="station-name">${recommendation.name}</h3>
                            <p class="station-description">${recommendation.description}</p>
                            <div class="station-details">
                                <p><strong>Частота:</strong> ${recommendation.frequency}</p>
                                <p><strong>Язык вещания:</strong> ${recommendation.language}</p>
                                <p><strong>Основной жанр:</strong> ${recommendation.genre}</p>
                            </div>
                        </div>
                        <p style="text-align: center; color: #6699cc; margin-top: 20px;">
                            Наслаждайтесь прослушиванием! 🎧
                        </p>
                    `;
                    
                    // Прокручиваем к результату
                    resultSection.scrollIntoView({ behavior: 'smooth' });
                    
                } catch (error) {
                    console.error("Ошибка при получении рекомендации:", error);
                    
                    // Показываем ошибку пользователю
                    loading.style.display = 'none';
                    questionnaire.style.display = 'block';
                    
                    stationInfo.innerHTML = `
                        <div class="station-card" style="border-left-color: #ff6b6b;">
                            <h3 class="station-name" style="color: #ff6b6b;">Ошибка</h3>
                            <p class="station-description">Произошла ошибка при обработке ваших ответов. Пожалуйста, попробуйте еще раз.</p>
                        </div>
                    `;
                }
            }, 1000); 
            
        } catch (error) {
            console.error("Ошибка в обработчике кнопки:", error);
            loading.style.display = 'none';
            questionnaire.style.display = 'block';
            alert("Произошла ошибка. Пожалуйста, обновите страницу и попробуйте еще раз.");
        }
    });

    // Обработчик кнопки "Пройти еще раз"
    restartBtn.addEventListener('click', () => {
        resultSection.style.display = 'none';
        questionnaire.style.display = 'block';
        
        // Прокручиваем к анкете
        questionnaire.scrollIntoView({ behavior: 'smooth' });
        
        // Сбрасываем значения (опционально)
        document.getElementById('genre').selectedIndex = 0;
        document.getElementById('frequency').selectedIndex = 0;
        document.getElementById('language').selectedIndex = 0;
        document.getElementById('age').selectedIndex = 0;
        document.getElementById('news').selectedIndex = 0;
    });

    // Добавляем обработку нажатия Enter в селектах
    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        });
    });
});