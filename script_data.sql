INSERT INTO login (name, email, password, role) VALUES
('admin', 'admin@foodjet.com', 'admin123', 'admin'),
('Usuario Demo', 'demo@foodjet.com', 'demo123', 'customer'),
('Juan Perez', 'juan.perez@gmail.com', 'juan123', 'customer'),
('Maria Gomez', 'maria.gomez@gmail.com', 'maria123', 'customer'),
('Carlos Rodriguez', 'carlos.rod@foodjet.com', 'carlos123', 'customer');

INSERT INTO products (id, name, description, price, image, category) VALUES
(1, 'Hamburguesa Clásica', 'Jugosa hamburguesa con queso, lechuga, tomate y salsa especial', 18.90, 'https://images.unsplash.com/photo-1651843465180-5965076f7368?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500', 'Hamburguesas'),
(2, 'Pizza Napolitana', 'Pizza tradicional con salsa de tomate, mozzarella y albahaca fresca', 32.90, 'https://images.unsplash.com/photo-1678443238947-e58d71bf2e23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500', 'Pizzas'),
(3, 'Ramen Picante', 'Deliciosos fideos japoneses en caldo picante con cerdo y huevo', 25.90, 'https://images.unsplash.com/photo-1652937916838-09b9c2ff8b45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500', 'Asiática'),
(4, 'Sushi Mix', 'Variedad de sushi fresco con salmón, atún y vegetales', 45.90, 'https://images.unsplash.com/photo-1625937751876-4515cd8e78bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500', 'Asiática'),
(5, 'Alitas BBQ', 'Alitas de pollo crujientes con salsa BBQ casera', 22.90, 'https://images.unsplash.com/photo-1618416682145-2fe1aaa6bd40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500', 'Pollo'),
(6, 'Cheesecake de Fresa', 'Delicioso cheesecake con topping de fresas frescas', 15.90, 'https://images.unsplash.com/photo-1759426016293-1b8be5849a72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500', 'Postres'),
(7, 'Ensalada César', 'Ensalada fresca con pollo, crutones y aderezo césar', 18.90, 'https://images.unsplash.com/photo-1654458804670-2f4f26ab3154?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500', 'Saludable'),
(8, 'Tacos al Pastor', 'Tres tacos mexicanos con carne al pastor y piña', 19.90, 'https://www.elfinanciero.com.mx/resizer/v2/PI7RTVF57RBAVEASTTWNJTW4OU.jpg?smart=true&auth=6e8833568df9cf61a4935c3c8f1a6c7139315e31d037857dfe33c09c68b59eb9&width=1440&height=810', 'Mexicana');
