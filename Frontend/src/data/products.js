// src/data/products.js
export const categories = [
  { id: 'beef', name: 'Говядина', icon: '🥩' },
  { id: 'pork', name: 'Свинина', icon: '🐷' },
  { id: 'chicken', name: 'Курица', icon: '🍗' },
  { id: 'lamb', name: 'Баранина', icon: '🐑' },
  { id: 'minced', name: 'Фарш', icon: '🥩' },
  { id: 'sausages', name: 'Колбасы', icon: '🌭' },
  { id: 'steaks', name: 'Стейки', icon: '🔥' },
  { id: 'offal', name: 'Субпродукты', icon: '🍖' },
];

export const products = [
  // Говядина
  { 
    id: 1, 
    name: 'Стейк Рибай', 
    price: 1890, 
    category: 'beef', 
    image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&h=400&fit=crop',
    description: 'Нежный стейк из мраморной говядины с идеальной прослойкой жира. При приготовлении раскрывает богатый вкус и аромат. Рекомендуемая прожарка: медиум.',
    nutrition: { calories: 320, protein: 24, fat: 22, carbs: 0 },
    ingredients: 'Говядина (высший сорт), соль, перец черный'
  },
  { 
    id: 2, 
    name: 'Говяжья вырезка', 
    price: 2450, 
    category: 'beef', 
    image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=600&h=400&fit=crop',
    description: 'Самая нежная часть говяжьей туши. Практически не содержит жира, идеально подходит для стейков и запекания целиком.',
    nutrition: { calories: 280, protein: 26, fat: 18, carbs: 0 },
    ingredients: 'Говяжья вырезка, соль'
  },
  // Свинина
  { 
    id: 3, 
    name: 'Свиная корейка', 
    price: 890, 
    category: 'pork', 
    image: 'https://images.unsplash.com/photo-1534790566855-4c788f2a3c9b?w=600&h=400&fit=crop',
    description: 'Сочная свиная корейка на кости с прослойкой жира. Идеально для запекания в духовке или на гриле.',
    nutrition: { calories: 350, protein: 19, fat: 29, carbs: 0 },
    ingredients: 'Свинина, соль, специи'
  },
  { 
    id: 4, 
    name: 'Карбонад', 
    price: 750, 
    category: 'pork', 
    image: 'https://images.unsplash.com/photo-1529697216570-f48ef8f6b2dd?w=600&h=400&fit=crop',
    description: 'Постная свинина с минимальным содержанием жира. Отлично подходит для жарки, запекания и приготовления шашлыка.',
    nutrition: { calories: 290, protein: 21, fat: 22, carbs: 0 },
    ingredients: 'Свинина, соль'
  },
  // Курица
  { 
    id: 5, 
    name: 'Куриное филе', 
    price: 450, 
    category: 'chicken', 
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&h=400&fit=crop',
    description: 'Нежное куриное филе без кожи и костей. Диетический продукт, богатый белком. Идеально для здорового питания.',
    nutrition: { calories: 165, protein: 31, fat: 3.6, carbs: 0 },
    ingredients: 'Куриное филе охлажденное'
  },
  { 
    id: 6, 
    name: 'Куриные бедра', 
    price: 380, 
    category: 'chicken', 
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop',
    description: 'Сочные куриные бедра с кожей. Благодаря содержанию жира получаются особенно вкусными при запекании.',
    nutrition: { calories: 210, protein: 18, fat: 15, carbs: 0 },
    ingredients: 'Куриные бедра охлажденные'
  },
  // Баранина
  { 
    id: 7, 
    name: 'Баранья нога', 
    price: 2100, 
    category: 'lamb', 
    image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&h=400&fit=crop',
    description: 'Целая баранья нога для праздничного запекания. Мясо с характерным ароматом и нежным вкусом.',
    nutrition: { calories: 290, protein: 25, fat: 21, carbs: 0 },
    ingredients: 'Баранина, соль, розмарин, чеснок'
  },
  { 
    id: 8, 
    name: 'Ребрышки ягненка', 
    price: 1650, 
    category: 'lamb', 
    image: 'https://images.unsplash.com/photo-1529697216570-f48ef8f6b2dd?w=600&h=400&fit=crop',
    description: 'Нежные ребрышки молодого ягненка. Идеальны для томления с овощами или запекания на гриле.',
    nutrition: { calories: 310, protein: 20, fat: 25, carbs: 0 },
    ingredients: 'Ребрышки ягненка, соль, специи'
  },
  // Фарш
  { 
    id: 9, 
    name: 'Домашний фарш', 
    price: 520, 
    category: 'minced', 
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=400&fit=crop',
    description: 'Свежий домашний фарш из говядины и свинины. Идеален для котлет, пельменей и других блюд.',
    nutrition: { calories: 280, protein: 18, fat: 23, carbs: 0 },
    ingredients: 'Говядина 50%, свинина 50%, соль, перец'
  },
  { 
    id: 10, 
    name: 'Фарш говяжий', 
    price: 590, 
    category: 'minced', 
    image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=600&h=400&fit=crop',
    description: '100% говяжий фарш из вырезки. Диетический вариант для тех, кто следит за питанием.',
    nutrition: { calories: 250, protein: 20, fat: 18, carbs: 0 },
    ingredients: 'Говядина, соль'
  },
  // Колбасы
  { 
    id: 11, 
    name: 'Домашняя колбаса', 
    price: 680, 
    category: 'sausages', 
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=400&fit=crop',
    description: 'Домашняя колбаса по традиционному рецепту. Натуральная оболочка, отборное мясо и специи.',
    nutrition: { calories: 320, protein: 15, fat: 28, carbs: 2 },
    ingredients: 'Свинина, говядина, натуральная оболочка, чеснок, перец, соль'
  },
  { 
    id: 12, 
    name: 'Салями', 
    price: 890, 
    category: 'sausages', 
    image: 'https://images.unsplash.com/photo-1534790566855-4c788f2a3c9b?w=600&h=400&fit=crop',
    description: 'Домашняя салями с добавлением паприки и специй. Вяленая колбаса для нарезки.',
    nutrition: { calories: 380, protein: 20, fat: 32, carbs: 3 },
    ingredients: 'Свинина, говядина, паприка, перец, чеснок, соль'
  },
  // Стейки
  { 
    id: 13, 
    name: 'Стейк Нью-Йорк', 
    price: 1990, 
    category: 'steaks', 
    image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&h=400&fit=crop',
    description: 'Стейк из тонкого края говядины. Характеризуется интенсивным мясным вкусом и умеренной мраморностью.',
    nutrition: { calories: 310, protein: 25, fat: 22, carbs: 0 },
    ingredients: 'Говядина, соль, перец'
  },
  { 
    id: 14, 
    name: 'Стейк Т-Боун', 
    price: 2350, 
    category: 'steaks', 
    image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=600&h=400&fit=crop',
    description: 'Стейк на Т-образной кости, сочетающий в себе филе и стриплойн. Два вкуса в одном стейке.',
    nutrition: { calories: 325, protein: 24, fat: 24, carbs: 0 },
    ingredients: 'Говядина, соль, перец'
  },
  // Субпродукты
  { 
    id: 15, 
    name: 'Печень говяжья', 
    price: 320, 
    category: 'offal', 
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&h=400&fit=crop',
    description: 'Свежая говяжья печень. Богата железом и витаминами. Идеальна для паштетов и жарки.',
    nutrition: { calories: 135, protein: 20, fat: 5, carbs: 4 },
    ingredients: 'Печень говяжья охлажденная'
  },
  { 
    id: 16, 
    name: 'Сердце свиное', 
    price: 280, 
    category: 'offal', 
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop',
    description: 'Свиное сердце - источник легкоусвояемого белка. Используется для приготовления гуляша и начинок.',
    nutrition: { calories: 165, protein: 18, fat: 10, carbs: 0 },
    ingredients: 'Сердце свиное'
  },
];