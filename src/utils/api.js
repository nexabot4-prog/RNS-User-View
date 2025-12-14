export const projectsAPI = {
    getFeatured: async (limit = 6) => {
        // Mock data based on requirements
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        title: 'Arduino Starter Kit',
                        description: 'Complete kit for beginners to learn electronics.',
                        price: 2500,
                        image: 'https://images.unsplash.com/photo-1555664424-778a69d25679?auto=format&fit=crop&q=80',
                        features: ['UNO R3', 'Sensors', 'Jumper Wires'],
                        components: ['Audrino', 'Breadboard'],
                        priority: 'medium',
                        category: 'hardware'
                    },
                    {
                        id: 2,
                        title: 'IoT Weather Station',
                        description: 'Monitor temperature and humidity remotely.',
                        price: 3500,
                        image: 'https://images.unsplash.com/photo-1561557944-6e7860d5aebb?auto=format&fit=crop&q=80',
                        features: ['WiFi', 'DHT11', 'OLED'],
                        components: ['ESP8266', 'Sensors'],
                        priority: 'high',
                        category: 'integration'
                    },
                    {
                        id: 3,
                        title: 'Obstacle Avoiding Robot',
                        description: 'Robot that navigates autonomously.',
                        price: 4500,
                        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80',
                        features: ['Motors', 'Ultrasonic', 'Chassis'],
                        components: ['Arduino', 'Servo'],
                        priority: 'medium',
                        category: 'integration'
                    },
                    {
                        id: 4,
                        title: 'Home Automation App',
                        description: 'Control your smart home devices from anywhere.',
                        price: 5000,
                        image: 'https://images.unsplash.com/photo-1558002038-109177381795?auto=format&fit=crop&q=80',
                        features: ['Cloud Sync', 'Voice Control', 'Scheduling'],
                        components: ['Mobile App', 'Dashboard'],
                        priority: 'high',
                        category: 'software'
                    },
                    {
                        id: 5,
                        title: 'Bluetooth Controlled Car',
                        description: 'Drive your car using a mobile app.',
                        price: 3200,
                        image: 'https://images.unsplash.com/photo-1535376472810-5d229c6594d2?auto=format&fit=crop&q=80',
                        features: ['Bluetooth', 'Motor Driver', 'Wheels'],
                        components: ['HC-05', 'L298N'],
                        priority: 'medium',
                        category: 'integration'
                    },
                    {
                        id: 6,
                        title: 'Robotic Arm Kit',
                        description: 'Mechanical arm structure for robotics projects.',
                        price: 6000,
                        image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80',
                        features: ['Aluminum Parts', 'Servo Brackets', 'Base'],
                        components: ['Metal Chassis', 'Screws'],
                        priority: 'low',
                        category: 'hardware'
                    }
                ]);
            }, 1000); // Simulate network delay
        });
    },
    getProjectById: async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const projects = [
                    {
                        id: 1,
                        title: 'Arduino Starter Kit',
                        description: 'Complete kit for beginners to learn electronics.',
                        price: 2500,
                        image: 'https://images.unsplash.com/photo-1555664424-778a69d25679?auto=format&fit=crop&q=80',
                        features: ['UNO R3', 'Sensors', 'Jumper Wires'],
                        components: ['Audrino', 'Breadboard'],
                        priority: 'medium',
                        category: 'hardware'
                    },
                    {
                        id: 2,
                        title: 'IoT Weather Station',
                        description: 'Monitor temperature and humidity remotely.',
                        price: 3500,
                        image: 'https://images.unsplash.com/photo-1561557944-6e7860d5aebb?auto=format&fit=crop&q=80',
                        features: ['WiFi', 'DHT11', 'OLED'],
                        components: ['ESP8266', 'Sensors'],
                        priority: 'high',
                        category: 'integration'
                    },
                    {
                        id: 3,
                        title: 'Obstacle Avoiding Robot',
                        description: 'Robot that navigates autonomously.',
                        price: 4500,
                        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80',
                        features: ['Motors', 'Ultrasonic', 'Chassis'],
                        components: ['Arduino', 'Servo'],
                        priority: 'medium',
                        category: 'integration'
                    },
                    {
                        id: 4,
                        title: 'Home Automation App',
                        description: 'Control your smart home devices from anywhere.',
                        price: 5000,
                        image: 'https://images.unsplash.com/photo-1558002038-109177381795?auto=format&fit=crop&q=80',
                        features: ['Cloud Sync', 'Voice Control', 'Scheduling'],
                        components: ['Mobile App', 'Dashboard'],
                        priority: 'high',
                        category: 'software'
                    },
                    {
                        id: 5,
                        title: 'Bluetooth Controlled Car',
                        description: 'Drive your car using a mobile app.',
                        price: 3200,
                        image: 'https://images.unsplash.com/photo-1535376472810-5d229c6594d2?auto=format&fit=crop&q=80',
                        features: ['Bluetooth', 'Motor Driver', 'Wheels'],
                        components: ['HC-05', 'L298N'],
                        priority: 'medium',
                        category: 'integration'
                    },
                    {
                        id: 6,
                        title: 'Robotic Arm Kit',
                        description: 'Mechanical arm structure for robotics projects.',
                        price: 6000,
                        image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80',
                        features: ['Aluminum Parts', 'Servo Brackets', 'Base'],
                        components: ['Metal Chassis', 'Screws'],
                        priority: 'low',
                        category: 'hardware'
                    }
                ];
                const project = projects.find(p => p.id === parseInt(id));
                resolve(project);
            }, 500);
        });
    }
};
