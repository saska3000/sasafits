// Рецепты из меню Насти Мироновой (порция на одного). Файл создан скриптом scripts/import-nastya.mjs
import type { MenuRecipe } from '../lib/types';

export const NASTYA_RECIPES: MenuRecipe[] = [
  {
    "id": "n-ovsyanoblin",
    "name": "Сырный овсяноблин",
    "emoji": "🥞",
    "meals": [
      "breakfast"
    ],
    "kinds": [],
    "timeMin": 10,
    "servings": 1,
    "ingredients": [
      {
        "name": "Яйцо",
        "grams": 110,
        "foodId": "s-egg",
        "amountText": "2 шт"
      },
      {
        "name": "Овсяные хлопья",
        "grams": 60,
        "foodId": "s-oat-flakes",
        "amountText": "60 г"
      },
      {
        "name": "Сыр твёрдый",
        "grams": 20,
        "foodId": "s-cheese-hard",
        "amountText": "20 г"
      },
      {
        "name": "Вода",
        "grams": 50,
        "amountText": "50 мл",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Соль",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Взбить яйца блендером, влить воду, всыпать овсяные хлопья и посолить.",
      "Вылить массу на разогретую сковороду, убавить огонь и довести до готовности под крышкой.",
      "Перед подачей посыпать тёртым сыром."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-tvorog_mousse_blackberry",
    "name": "Творожный мусс с ежевикой и мятой",
    "emoji": "🫐",
    "meals": [
      "snack"
    ],
    "kinds": [
      "sweet"
    ],
    "timeMin": 10,
    "servings": 1,
    "ingredients": [
      {
        "name": "Творог мягкий",
        "grams": 100,
        "foodId": "s-tvorog-5",
        "amountText": "100 г"
      },
      {
        "name": "Йогурт натуральный",
        "grams": 50,
        "foodId": "s-yogurt-natural",
        "amountText": "50 г"
      },
      {
        "name": "Ежевика (свежая или замороженная)",
        "grams": 150,
        "amountText": "150 г",
        "per100": {
          "kcal": 34,
          "p": 1.5,
          "f": 0.5,
          "c": 4.4
        }
      },
      {
        "name": "Мёд",
        "grams": 5,
        "foodId": "s-honey",
        "amountText": "5 г"
      },
      {
        "name": "Мята",
        "grams": 0,
        "amountText": "2 листочка",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Взбить творог с йогуртом до однородности.",
      "Вмешать ежевику (замороженную можно слегка разморозить).",
      "Перед подачей полить мёдом и украсить листиками мяты."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-chicken_ezhiki_yogurt",
    "name": "Куриные ёжики под йогуртовой заправкой",
    "emoji": "🍗",
    "meals": [
      "lunch",
      "dinner"
    ],
    "kinds": [
      "meat"
    ],
    "timeMin": 40,
    "servings": 1,
    "ingredients": [
      {
        "name": "Куриная грудка",
        "grams": 100,
        "foodId": "s-chicken-breast-raw",
        "amountText": "100 г"
      },
      {
        "name": "Бурый рис",
        "grams": 60,
        "foodId": "s-rice-brown-dry",
        "amountText": "60 г"
      },
      {
        "name": "Перец болгарский",
        "grams": 100,
        "foodId": "s-bell-pepper",
        "amountText": "100 г"
      },
      {
        "name": "Яйцо",
        "grams": 55,
        "foodId": "s-egg",
        "amountText": "1 шт"
      },
      {
        "name": "Йогурт натуральный",
        "grams": 50,
        "foodId": "s-yogurt-natural",
        "amountText": "50 мл"
      },
      {
        "name": "Укроп",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Соль, перец",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Заранее отварить рис в подсоленной воде до полной готовности.",
      "Куриное филе промыть, обсушить и прокрутить в фарш.",
      "Смешать тёплый рис с фаршем и рубленым укропом, посолить, поперчить, вбить яйцо и хорошо перемешать.",
      "Выкладывать массу столовой ложкой на сковороду и обжаривать на слабом огне до золотистой корочки с двух сторон.",
      "Полить ёжики йогуртом и подать с нарезанным соломкой болгарским перцем."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-fish_cutlets_broccoli",
    "name": "Рыбные котлеты с брокколи",
    "emoji": "🐟",
    "meals": [
      "dinner",
      "lunch"
    ],
    "kinds": [],
    "timeMin": 45,
    "servings": 1,
    "ingredients": [
      {
        "name": "Минтай (филе), сырой",
        "grams": 140,
        "amountText": "140 г",
        "per100": {
          "kcal": 72,
          "p": 15.9,
          "f": 0.9,
          "c": 0
        }
      },
      {
        "name": "Кабачок",
        "grams": 100,
        "foodId": "s-zucchini",
        "amountText": "100 г"
      },
      {
        "name": "Лук репчатый",
        "grams": 50,
        "foodId": "s-onion",
        "amountText": "50 г"
      },
      {
        "name": "Брокколи",
        "grams": 150,
        "foodId": "s-broccoli",
        "amountText": "150 г"
      },
      {
        "name": "Масло оливковое",
        "grams": 5,
        "foodId": "s-oil-olive",
        "amountText": "1 ч. л."
      },
      {
        "name": "Укроп, петрушка",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Соль, перец, тимьян",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Измельчить рыбное филе блендером или пропустить через мясорубку.",
      "Добавить к фаршу мелко нарезанные лук и зелень и натёртый на крупной тёрке кабачок, посолить, поперчить, приправить тимьяном и тщательно перемешать.",
      "Сформировать небольшие котлетки и выложить в смазанную маслом форму или глубокую сковороду.",
      "Запекать в разогретой до 180 °C духовке 20–30 минут.",
      "Отварить брокколи и подать как гарнир."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-bruschetta_goat_pear",
    "name": "Брускетта с козьим сыром и грушей",
    "emoji": "🍐",
    "meals": [
      "breakfast"
    ],
    "kinds": [],
    "timeMin": 10,
    "servings": 1,
    "ingredients": [
      {
        "name": "Хлеб цельнозерновой",
        "grams": 100,
        "foodId": "s-bread-whole-grain",
        "amountText": "100 г"
      },
      {
        "name": "Козий сыр мягкий",
        "grams": 30,
        "amountText": "30 г",
        "per100": {
          "kcal": 264,
          "p": 18.5,
          "f": 21.1,
          "c": 0.9
        }
      },
      {
        "name": "Груша",
        "grams": 150,
        "foodId": "s-pear",
        "amountText": "150 г"
      }
    ],
    "steps": [
      "Нарезать хлеб ломтиками, а грушу — тонкими слайсами.",
      "Распределить козий сыр по кусочкам хлеба.",
      "Сверху выложить слайсы груши."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-bean_salad_bryndza",
    "name": "Тёплый фасолевый салат с брынзой и петрушкой",
    "emoji": "🫘",
    "meals": [
      "snack"
    ],
    "kinds": [],
    "timeMin": 10,
    "servings": 1,
    "ingredients": [
      {
        "name": "Фасоль консервированная",
        "grams": 150,
        "foodId": "s-beans-red-canned",
        "amountText": "150 г"
      },
      {
        "name": "Петрушка",
        "grams": 30,
        "foodId": "s-herbs",
        "amountText": "30 г"
      },
      {
        "name": "Брынза",
        "grams": 30,
        "foodId": "s-bryndza",
        "amountText": "30 г"
      },
      {
        "name": "Соль, перец",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Слить жидкость с фасоли и прогреть её на сковороде 5–10 минут.",
      "Переложить фасоль в миску и добавить рубленую петрушку.",
      "Посыпать раскрошенной брынзой, посолить и поперчить по вкусу."
    ],
    "note": "Грецкие орехи заменены мягкой брынзой — из-за брекетов. Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-veal_buckwheat_stew",
    "name": "Жаркое из телятины с гречкой и овощами",
    "emoji": "🥘",
    "meals": [
      "lunch",
      "dinner"
    ],
    "kinds": [
      "meat"
    ],
    "timeMin": 30,
    "servings": 1,
    "ingredients": [
      {
        "name": "Телятина, сырая",
        "grams": 100,
        "amountText": "100 г",
        "per100": {
          "kcal": 97,
          "p": 19.7,
          "f": 2,
          "c": 0
        }
      },
      {
        "name": "Лук репчатый",
        "grams": 50,
        "foodId": "s-onion",
        "amountText": "50 г"
      },
      {
        "name": "Помидор",
        "grams": 100,
        "foodId": "s-tomato",
        "amountText": "100 г"
      },
      {
        "name": "Морковь",
        "grams": 100,
        "foodId": "s-carrot",
        "amountText": "100 г"
      },
      {
        "name": "Оливковое масло",
        "grams": 5,
        "foodId": "s-oil-olive",
        "amountText": "1 ч. л."
      },
      {
        "name": "Гречка (ядрица), сухая",
        "grams": 60,
        "amountText": "60 г",
        "per100": {
          "kcal": 313,
          "p": 12.6,
          "f": 3.3,
          "c": 62.1
        }
      },
      {
        "name": "Соль, перец, чеснок",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Зелень",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Мясо промыть, нарезать небольшими кусочками, посолить и поперчить.",
      "Обжарить на масле лук, затем добавить нарезанный помидор, немного чеснока и тёртую морковь.",
      "Положить мясо и тушить под крышкой на слабом огне до готовности.",
      "Отварить гречку.",
      "Смешать гречку с жарким и при подаче посыпать зеленью."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-tuna_veg_salad",
    "name": "Овощной салат с тунцом",
    "emoji": "🥗",
    "meals": [
      "dinner",
      "lunch"
    ],
    "kinds": [],
    "timeMin": 10,
    "servings": 1,
    "ingredients": [
      {
        "name": "Тунец консервированный",
        "grams": 140,
        "foodId": "s-tuna-canned-own-juice",
        "amountText": "140 г"
      },
      {
        "name": "Помидор",
        "grams": 100,
        "foodId": "s-tomato",
        "amountText": "100 г"
      },
      {
        "name": "Огурец",
        "grams": 100,
        "foodId": "s-cucumber",
        "amountText": "100 г"
      },
      {
        "name": "Масло оливковое",
        "grams": 5,
        "foodId": "s-oil-olive",
        "amountText": "1 ч. л."
      },
      {
        "name": "Зелёный лук, укроп",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Соль, перец",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Нарезать помидор и огурец и сложить в салатник.",
      "Добавить тунец и рубленую зелень.",
      "Посолить, поперчить и заправить оливковым маслом."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-bulgur_plum_milk",
    "name": "Булгур на молоке со сливой и мёдом",
    "emoji": "🥣",
    "meals": [
      "breakfast"
    ],
    "kinds": [
      "sweet"
    ],
    "timeMin": 15,
    "servings": 1,
    "ingredients": [
      {
        "name": "Слива",
        "grams": 150,
        "amountText": "150 г",
        "per100": {
          "kcal": 49,
          "p": 0.8,
          "f": 0.3,
          "c": 9.6
        }
      },
      {
        "name": "Булгур",
        "grams": 60,
        "foodId": "s-bulgur-dry",
        "amountText": "60 г"
      },
      {
        "name": "Молоко",
        "grams": 150,
        "foodId": "s-milk-2-5",
        "amountText": "150 мл"
      },
      {
        "name": "Мёд",
        "grams": 5,
        "foodId": "s-honey",
        "amountText": "5 г"
      }
    ],
    "steps": [
      "Сварить булгур на молоке до мягкости.",
      "Нарезать сливу и вмешать в готовую кашу.",
      "Перед подачей полить мёдом."
    ],
    "note": "Миндальные лепестки убраны — из-за брекетов. Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-yelli_lentil_tomato_soup",
    "name": "Суп «Yelli» с чечевицей и томатами",
    "emoji": "🍲",
    "meals": [
      "lunch",
      "dinner"
    ],
    "kinds": [],
    "timeMin": 45,
    "servings": 1,
    "ingredients": [
      {
        "name": "Смесь Yelli «Чечевица с томатами», сухая",
        "grams": 100,
        "amountText": "100 г",
        "per100": {
          "kcal": 310,
          "p": 22,
          "f": 2,
          "c": 50
        }
      },
      {
        "name": "Вода",
        "grams": 150,
        "amountText": "150 мл",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Оливковое масло",
        "grams": 10,
        "foodId": "s-oil-olive",
        "amountText": "2 ч. л."
      },
      {
        "name": "Соль, перец",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Зелень",
        "grams": 0,
        "amountText": "для украшения",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Залить смесь водой и варить до готовности.",
      "Количество воды менять по вкусу: больше — суп жиже, меньше — гуще.",
      "В готовый суп добавить оливковое масло, посолить, поперчить и посыпать зеленью."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-raspberry_tvorog",
    "name": "Малиновый творожок",
    "emoji": "🍓",
    "meals": [
      "snack"
    ],
    "kinds": [
      "sweet"
    ],
    "timeMin": 10,
    "servings": 1,
    "ingredients": [
      {
        "name": "Творог 5%",
        "grams": 100,
        "foodId": "s-tvorog-5",
        "amountText": "100 г"
      },
      {
        "name": "Малина",
        "grams": 150,
        "foodId": "s-raspberry",
        "amountText": "150 г"
      },
      {
        "name": "Мёд",
        "grams": 5,
        "foodId": "s-honey",
        "amountText": "1 ч. л."
      }
    ],
    "steps": [
      "Взбить творог с малиной блендером.",
      "Перед подачей полить мёдом."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-chicken_roll_peas_sprouts",
    "name": "Куриный рулет с горошком и брюссельской капустой",
    "emoji": "🍗",
    "meals": [
      "dinner",
      "lunch"
    ],
    "kinds": [
      "meat"
    ],
    "timeMin": 45,
    "servings": 1,
    "ingredients": [
      {
        "name": "Куриное филе",
        "grams": 140,
        "foodId": "s-chicken-breast-raw",
        "amountText": "140 г"
      },
      {
        "name": "Зелёный горошек замороженный",
        "grams": 50,
        "amountText": "50 г",
        "per100": {
          "kcal": 73,
          "p": 5,
          "f": 0.2,
          "c": 12.8
        }
      },
      {
        "name": "Сыр твёрдый",
        "grams": 10,
        "foodId": "s-cheese-hard",
        "amountText": "10 г"
      },
      {
        "name": "Брюссельская капуста",
        "grams": 150,
        "amountText": "150 г",
        "per100": {
          "kcal": 43,
          "p": 4.8,
          "f": 0,
          "c": 5.9
        }
      },
      {
        "name": "Оливковое масло",
        "grams": 5,
        "foodId": "s-oil-olive",
        "amountText": "1 ч. л."
      },
      {
        "name": "Соль, перец",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Нарезать филе пластами толщиной около 1 см и отбить.",
      "Выложить на пергамент, посолить и поперчить.",
      "Разложить сверху горошек и тёртый сыр, свернуть рулетами и плотно завернуть в фольгу.",
      "Запекать в духовке при 180 °C около 40 минут.",
      "На гарнир отварить брюссельскую капусту и полить маслом."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-strawberry_tvorog_oats",
    "name": "Клубничный творожок с мёдом и овсянкой",
    "emoji": "🍓",
    "meals": [
      "breakfast"
    ],
    "kinds": [
      "sweet"
    ],
    "timeMin": 10,
    "servings": 1,
    "ingredients": [
      {
        "name": "Творог 5%",
        "grams": 150,
        "foodId": "s-tvorog-5",
        "amountText": "150 г"
      },
      {
        "name": "Йогурт натуральный",
        "grams": 50,
        "foodId": "s-yogurt-natural",
        "amountText": "50 мл"
      },
      {
        "name": "Овсяные хлопья",
        "grams": 60,
        "foodId": "s-oat-flakes",
        "amountText": "60 г"
      },
      {
        "name": "Клубника",
        "grams": 100,
        "foodId": "s-strawberry",
        "amountText": "100 г"
      },
      {
        "name": "Мёд",
        "grams": 5,
        "foodId": "s-honey",
        "amountText": "5 г"
      }
    ],
    "steps": [
      "Взбить творог с йогуртом.",
      "Добавить нарезанную клубнику и овсяные хлопья и оставить ненадолго, чтобы хлопья размякли.",
      "Перед подачей полить мёдом."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-shrimp_fried_rice",
    "name": "Жареный рис с креветками по-азиатски",
    "emoji": "🍤",
    "meals": [
      "lunch",
      "dinner"
    ],
    "kinds": [],
    "timeMin": 30,
    "servings": 1,
    "ingredients": [
      {
        "name": "Бурый рис",
        "grams": 60,
        "foodId": "s-rice-brown-dry",
        "amountText": "60 г"
      },
      {
        "name": "Соевый соус",
        "grams": 15,
        "foodId": "s-soy-sauce",
        "amountText": "1 ст. л."
      },
      {
        "name": "Креветки очищенные",
        "grams": 100,
        "foodId": "s-shrimp-boiled",
        "amountText": "100 г"
      },
      {
        "name": "Болгарский перец",
        "grams": 150,
        "foodId": "s-bell-pepper",
        "amountText": "150 г"
      },
      {
        "name": "Имбирь (корень)",
        "grams": 5,
        "amountText": "1 см",
        "per100": {
          "kcal": 80,
          "p": 1.8,
          "f": 0.8,
          "c": 15.8
        }
      },
      {
        "name": "Зелёный лук",
        "grams": 10,
        "amountText": "несколько перьев",
        "per100": {
          "kcal": 20,
          "p": 1.3,
          "f": 0.1,
          "c": 3.2
        }
      },
      {
        "name": "Чеснок",
        "grams": 2,
        "amountText": "1/2 зубчика",
        "per100": {
          "kcal": 149,
          "p": 6.5,
          "f": 0.5,
          "c": 29.9
        }
      },
      {
        "name": "Яйцо",
        "grams": 55,
        "foodId": "s-egg",
        "amountText": "1 шт"
      },
      {
        "name": "Растительное масло",
        "grams": 5,
        "foodId": "s-oil-sunflower",
        "amountText": "1 ч. л."
      },
      {
        "name": "Петрушка или кинза",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Соль, острый красный перец",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Отварить рис, болгарский перец нарезать кубиками.",
      "Обжарить чеснок в масле до румяности и вынуть из сковороды.",
      "В том же масле обжарить перец на среднем огне, затем добавить рубленый зелёный лук и натёртый имбирь.",
      "Вбить яйцо и жарить ещё 1–2 минуты, помешивая.",
      "Добавить рис, полить соевым соусом, приправить острым перцем и перемешать.",
      "Добавить очищенные креветки, прогреть 1–2 минуты и посыпать зеленью."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-fruit_salad_yogurt_grapes",
    "name": "Фруктовый салат с йогуртом и виноградом",
    "emoji": "🍇",
    "meals": [
      "snack"
    ],
    "kinds": [
      "sweet"
    ],
    "timeMin": 10,
    "servings": 1,
    "ingredients": [
      {
        "name": "Яблоко",
        "grams": 50,
        "foodId": "s-apple",
        "amountText": "50 г"
      },
      {
        "name": "Йогурт натуральный",
        "grams": 50,
        "foodId": "s-yogurt-natural",
        "amountText": "50 мл"
      },
      {
        "name": "Груша",
        "grams": 50,
        "foodId": "s-pear",
        "amountText": "50 г"
      },
      {
        "name": "Черника",
        "grams": 50,
        "foodId": "s-bilberry",
        "amountText": "50 г"
      },
      {
        "name": "Виноград",
        "grams": 20,
        "foodId": "s-grapes",
        "amountText": "20 г"
      },
      {
        "name": "Мёд",
        "grams": 5,
        "foodId": "s-honey",
        "amountText": "5 г"
      }
    ],
    "steps": [
      "Нарезать яблоко и грушу небольшими кубиками.",
      "Добавить чернику, разрезанный пополам виноград и йогурт, перемешать.",
      "Перед подачей полить мёдом."
    ],
    "note": "Изюм заменён свежим виноградом, миндаль убран — из-за брекетов. Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-chicken_shashlik_zucchini",
    "name": "Куриный шашлык в духовке с кабачком",
    "emoji": "🍢",
    "meals": [
      "dinner",
      "lunch"
    ],
    "kinds": [
      "meat"
    ],
    "timeMin": 40,
    "servings": 1,
    "ingredients": [
      {
        "name": "Куриное филе",
        "grams": 140,
        "foodId": "s-chicken-breast-raw",
        "amountText": "140 г"
      },
      {
        "name": "Кабачки",
        "grams": 200,
        "foodId": "s-zucchini",
        "amountText": "200 г"
      },
      {
        "name": "Соевый соус",
        "grams": 15,
        "foodId": "s-soy-sauce",
        "amountText": "1 ст. л."
      },
      {
        "name": "Чеснок",
        "grams": 2,
        "amountText": "1/2 зубчика",
        "per100": {
          "kcal": 149,
          "p": 6.5,
          "f": 0.5,
          "c": 29.9
        }
      },
      {
        "name": "Растительное масло",
        "grams": 5,
        "foodId": "s-oil-sunflower",
        "amountText": "1 ч. л."
      },
      {
        "name": "Сок лимона",
        "grams": 5,
        "amountText": "1 ч. л.",
        "per100": {
          "kcal": 16,
          "p": 0.9,
          "f": 0.1,
          "c": 3
        }
      },
      {
        "name": "Соль, перец",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Чёрный кунжут, орегано или другие специи",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Нарезать филе одинаковыми кусочками, посолить, поперчить и посыпать специями.",
      "Добавить измельчённый чеснок, лимонный сок, соевый соус и масло, перемешать и убрать мариноваться минимум на 2–3 часа.",
      "Нарезать кабачки длинными тонкими лентами, посолить и оставить на 10 минут.",
      "Нанизать на шпажки кусочки курицы вперемешку со свёрнутыми в рулетики лентами кабачка.",
      "Запекать на противне в разогретой до 210 °C духовке 20–25 минут, не пересушивая филе."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-veg_scramble_bread",
    "name": "Скрэмбл с овощами и цельнозерновым хлебом",
    "emoji": "🍳",
    "meals": [
      "breakfast"
    ],
    "kinds": [],
    "timeMin": 20,
    "servings": 1,
    "ingredients": [
      {
        "name": "Яйцо",
        "grams": 110,
        "foodId": "s-egg",
        "amountText": "2 шт"
      },
      {
        "name": "Лук",
        "grams": 50,
        "foodId": "s-onion",
        "amountText": "50 г"
      },
      {
        "name": "Помидор",
        "grams": 100,
        "foodId": "s-tomato",
        "amountText": "100 г"
      },
      {
        "name": "Болгарский перец",
        "grams": 100,
        "foodId": "s-bell-pepper",
        "amountText": "100 г"
      },
      {
        "name": "Вода",
        "grams": 50,
        "amountText": "50 мл",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Цельнозерновой хлеб",
        "grams": 100,
        "foodId": "s-bread-whole-grain",
        "amountText": "100 г"
      },
      {
        "name": "Соль",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Нарезать лук, помидор и перец и обжарить на сковороде.",
      "Взбить яйца блендером с водой и солью.",
      "Влить яйца к овощам, убавить огонь и довести до готовности под крышкой.",
      "Подать с цельнозерновым хлебом."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-squid_bulgur",
    "name": "Кальмары с булгуром, луком и морковью",
    "emoji": "🦑",
    "meals": [
      "lunch",
      "dinner"
    ],
    "kinds": [],
    "timeMin": 30,
    "servings": 1,
    "ingredients": [
      {
        "name": "Кальмар",
        "grams": 100,
        "foodId": "s-squid-raw",
        "amountText": "100 г"
      },
      {
        "name": "Перец болгарский",
        "grams": 100,
        "foodId": "s-bell-pepper",
        "amountText": "100 г"
      },
      {
        "name": "Морковь",
        "grams": 100,
        "foodId": "s-carrot",
        "amountText": "100 г"
      },
      {
        "name": "Лук репчатый",
        "grams": 50,
        "foodId": "s-onion",
        "amountText": "50 г"
      },
      {
        "name": "Булгур",
        "grams": 60,
        "foodId": "s-bulgur-dry",
        "amountText": "60 г"
      },
      {
        "name": "Оливковое масло",
        "grams": 3,
        "foodId": "s-oil-olive",
        "amountText": "2/3 ч. л."
      },
      {
        "name": "Петрушка",
        "grams": 5,
        "foodId": "s-herbs",
        "amountText": "5 г"
      },
      {
        "name": "Соль, перец",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Отварить булгур до готовности.",
      "Нарезать морковь, лук и перец, обжарить на сковороде до мягкости.",
      "Добавить нарезанного кальмара и перемешать.",
      "Всыпать булгур и тушить всё вместе на слабом огне 5 минут.",
      "При подаче полить маслом и посыпать рубленой петрушкой."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-chicken_sesame_salad",
    "name": "Куриный салат с овощами и кунжутом",
    "emoji": "🥗",
    "meals": [
      "snack"
    ],
    "kinds": [
      "meat"
    ],
    "timeMin": 10,
    "servings": 1,
    "ingredients": [
      {
        "name": "Куриное филе",
        "grams": 80,
        "foodId": "s-chicken-breast-raw",
        "amountText": "80 г"
      },
      {
        "name": "Перец болгарский",
        "grams": 100,
        "foodId": "s-bell-pepper",
        "amountText": "100 г"
      },
      {
        "name": "Помидоры",
        "grams": 100,
        "foodId": "s-tomato",
        "amountText": "100 г"
      },
      {
        "name": "Огурцы",
        "grams": 100,
        "foodId": "s-cucumber",
        "amountText": "100 г"
      },
      {
        "name": "Кунжут",
        "grams": 5,
        "amountText": "5 г",
        "per100": {
          "kcal": 565,
          "p": 19.4,
          "f": 48.7,
          "c": 12.2
        }
      },
      {
        "name": "Соль, перец, специи",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Отварить куриное филе, остудить и нарезать.",
      "Нарезать перец, помидоры и огурцы.",
      "Соединить всё в миске, приправить специями по вкусу и посыпать кунжутом."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-salmon_broccoli",
    "name": "Запечённый лосось с пряной брокколи",
    "emoji": "🐟",
    "meals": [
      "dinner",
      "lunch"
    ],
    "kinds": [],
    "timeMin": 30,
    "servings": 1,
    "ingredients": [
      {
        "name": "Лосось",
        "grams": 140,
        "foodId": "s-salmon-raw",
        "amountText": "140 г"
      },
      {
        "name": "Брокколи",
        "grams": 200,
        "foodId": "s-broccoli",
        "amountText": "200 г"
      },
      {
        "name": "Орегано, розмарин",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Соль, перец",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Разогреть духовку до 200 °C и запечь лосось до готовности.",
      "Пока рыба запекается, обжарить брокколи на сковороде с орегано и розмарином.",
      "Подать лосось с брокколи, посолить и поперчить."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-syrniki_banana_honey",
    "name": "Сырники с бананом под медово-йогуртовым соусом",
    "emoji": "🥞",
    "meals": [
      "breakfast"
    ],
    "kinds": [
      "sweet"
    ],
    "timeMin": 20,
    "servings": 1,
    "ingredients": [
      {
        "name": "Творог 5%",
        "grams": 120,
        "foodId": "s-tvorog-5",
        "amountText": "120 г"
      },
      {
        "name": "Банан",
        "grams": 50,
        "foodId": "s-banana",
        "amountText": "50 г"
      },
      {
        "name": "Яйцо",
        "grams": 55,
        "foodId": "s-egg",
        "amountText": "1 шт"
      },
      {
        "name": "Мука овсяная",
        "grams": 30,
        "amountText": "30 г",
        "per100": {
          "kcal": 369,
          "p": 13,
          "f": 6.8,
          "c": 64.9
        }
      },
      {
        "name": "Йогурт натуральный",
        "grams": 70,
        "foodId": "s-yogurt-natural",
        "amountText": "70 мл"
      },
      {
        "name": "Мёд",
        "grams": 5,
        "foodId": "s-honey",
        "amountText": "5 г"
      }
    ],
    "steps": [
      "Смешать творог с яйцом и овсяной мукой.",
      "Банан нарезать мелкими кубиками и вмешать в творожную массу.",
      "Разогреть сковороду, при желании слегка смазав её маслом.",
      "Сформировать сырники и обжарить с обеих сторон до готовности.",
      "Смешать йогурт с мёдом и полить этим соусом готовые сырники."
    ],
    "note": "Курагу заменили свежим бананом — сухофрукты липнут к брекетам. Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-carrot_cabbage_apple_salad",
    "name": "Морковно-капустный салат с яблоком под лимонной заправкой",
    "emoji": "🥕",
    "meals": [
      "snack"
    ],
    "kinds": [],
    "timeMin": 10,
    "servings": 1,
    "ingredients": [
      {
        "name": "Капуста белокочанная",
        "grams": 100,
        "foodId": "s-cabbage-white",
        "amountText": "100 г"
      },
      {
        "name": "Морковь",
        "grams": 100,
        "foodId": "s-carrot",
        "amountText": "100 г"
      },
      {
        "name": "Яблоко",
        "grams": 100,
        "foodId": "s-apple",
        "amountText": "100 г"
      },
      {
        "name": "Лимонный сок",
        "grams": 5,
        "amountText": "1 ч. л.",
        "per100": {
          "kcal": 16,
          "p": 0.9,
          "f": 0.1,
          "c": 3
        }
      },
      {
        "name": "Оливковое масло",
        "grams": 5,
        "foodId": "s-oil-olive",
        "amountText": "1 ч. л."
      },
      {
        "name": "Соль",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Капусту тонко нашинковать, морковь и яблоко натереть на тёрке.",
      "Соединить всё, заправить лимонным соком и маслом, посолить и перемешать."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-brown_rice_turkey_zucchini",
    "name": "Бурый рис с индейкой, кабачком и стручковой фасолью",
    "emoji": "🍚",
    "meals": [
      "lunch",
      "dinner"
    ],
    "kinds": [
      "meat"
    ],
    "timeMin": 40,
    "servings": 1,
    "ingredients": [
      {
        "name": "Филе индейки",
        "grams": 100,
        "foodId": "s-turkey-fillet-raw",
        "amountText": "100 г"
      },
      {
        "name": "Рис нешлифованный (бурый)",
        "grams": 60,
        "foodId": "s-rice-brown-dry",
        "amountText": "60 г"
      },
      {
        "name": "Морковь",
        "grams": 50,
        "foodId": "s-carrot",
        "amountText": "50 г"
      },
      {
        "name": "Лук репчатый",
        "grams": 50,
        "foodId": "s-onion",
        "amountText": "50 г"
      },
      {
        "name": "Кабачок",
        "grams": 100,
        "foodId": "s-zucchini",
        "amountText": "100 г"
      },
      {
        "name": "Стручковая фасоль",
        "grams": 100,
        "foodId": "s-green-beans",
        "amountText": "100 г"
      },
      {
        "name": "Оливковое масло",
        "grams": 5,
        "foodId": "s-oil-olive",
        "amountText": "1 ч. л."
      },
      {
        "name": "Укроп",
        "grams": 7,
        "foodId": "s-herbs",
        "amountText": "5–10 г"
      },
      {
        "name": "Соль, перец",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Отварить рис.",
      "Мелко нарезать лук и обжарить, затем добавить мелко нарезанное филе индейки.",
      "Добавить морковь соломкой и жарить на слабом огне 3–4 минуты, помешивая.",
      "Кабачок нарезать кубиками, слегка обжарить и соединить с индейкой, овощами и рисом; посолить, поперчить и прогреть 5 минут.",
      "Добавить стручковую фасоль и тушить под крышкой 5–7 минут.",
      "Перед подачей полить маслом и посыпать укропом."
    ],
    "note": "Шампиньоны заменили кабачком той же граммовки — грибы под запретом. Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-nicoise_tuna",
    "name": "Салат «Нисуаз» с тунцом",
    "emoji": "🫒",
    "meals": [
      "dinner",
      "lunch"
    ],
    "kinds": [],
    "timeMin": 20,
    "servings": 1,
    "ingredients": [
      {
        "name": "Листовой салат",
        "grams": 100,
        "foodId": "s-lettuce",
        "amountText": "100 г"
      },
      {
        "name": "Помидор",
        "grams": 100,
        "foodId": "s-tomato",
        "amountText": "100 г"
      },
      {
        "name": "Яйцо отварное",
        "grams": 55,
        "foodId": "s-egg",
        "amountText": "1 шт"
      },
      {
        "name": "Лук репчатый",
        "grams": 50,
        "foodId": "s-onion",
        "amountText": "50 г"
      },
      {
        "name": "Болгарский перец",
        "grams": 50,
        "foodId": "s-bell-pepper",
        "amountText": "50 г"
      },
      {
        "name": "Стручковая фасоль",
        "grams": 100,
        "foodId": "s-green-beans",
        "amountText": "100 г"
      },
      {
        "name": "Маслины",
        "grams": 20,
        "amountText": "20 г",
        "per100": {
          "kcal": 166,
          "p": 1.6,
          "f": 15,
          "c": 6.3
        }
      },
      {
        "name": "Тунец консервированный",
        "grams": 140,
        "foodId": "s-tuna-canned-own-juice",
        "amountText": "140 г"
      },
      {
        "name": "Лимонный сок",
        "grams": 5,
        "amountText": "1 ч. л.",
        "per100": {
          "kcal": 16,
          "p": 0.9,
          "f": 0.1,
          "c": 3
        }
      },
      {
        "name": "Оливковое масло",
        "grams": 10,
        "foodId": "s-oil-olive",
        "amountText": "2 ч. л."
      },
      {
        "name": "Соль",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Отварить стручковую фасоль и яйцо.",
      "Выложить на тарелку листья салата, сверху лук, перец, помидоры и фасоль.",
      "Тунец разобрать вилкой на волокна и выложить сверху вместе с маслинами и нарезанным яйцом.",
      "Посолить, сбрызнуть лимонным соком и заправить маслом."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-lazy_oats_cocoa_cherry",
    "name": "Ленивая овсянка с какао, вишней и бананом",
    "emoji": "🍒",
    "meals": [
      "breakfast"
    ],
    "kinds": [
      "sweet"
    ],
    "timeMin": 10,
    "servings": 1,
    "ingredients": [
      {
        "name": "Вишня (можно замороженную)",
        "grams": 100,
        "amountText": "100 г",
        "per100": {
          "kcal": 52,
          "p": 0.8,
          "f": 0.5,
          "c": 10.6
        }
      },
      {
        "name": "Банан",
        "grams": 60,
        "foodId": "s-banana",
        "amountText": "60 г"
      },
      {
        "name": "Какао-порошок",
        "grams": 5,
        "amountText": "5 г",
        "per100": {
          "kcal": 289,
          "p": 24.2,
          "f": 15,
          "c": 10.2
        }
      },
      {
        "name": "Овсяные хлопья",
        "grams": 50,
        "foodId": "s-oat-flakes",
        "amountText": "50 г"
      },
      {
        "name": "Йогурт натуральный",
        "grams": 200,
        "foodId": "s-yogurt-natural",
        "amountText": "200 мл"
      },
      {
        "name": "Мёд",
        "grams": 5,
        "foodId": "s-honey",
        "amountText": "5 г"
      }
    ],
    "steps": [
      "Смешать йогурт с овсяными хлопьями.",
      "Добавить вишню без косточек, кусочки банана, какао и мёд, перемешать.",
      "Убрать в холодильник на ночь и съесть утром."
    ],
    "note": "Без миндаля — из-за брекетов. Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-napa_cabbage_grape_salad",
    "name": "Салат с пекинской капустой и виноградом",
    "emoji": "🥬",
    "meals": [
      "snack"
    ],
    "kinds": [],
    "timeMin": 10,
    "servings": 1,
    "ingredients": [
      {
        "name": "Пекинская капуста",
        "grams": 100,
        "foodId": "s-cabbage-napa",
        "amountText": "100 г"
      },
      {
        "name": "Салат листовой",
        "grams": 50,
        "foodId": "s-lettuce",
        "amountText": "50 г"
      },
      {
        "name": "Огурец свежий",
        "grams": 100,
        "foodId": "s-cucumber",
        "amountText": "100 г"
      },
      {
        "name": "Болгарский перец",
        "grams": 100,
        "foodId": "s-bell-pepper",
        "amountText": "100 г"
      },
      {
        "name": "Редис",
        "grams": 30,
        "amountText": "30 г",
        "per100": {
          "kcal": 20,
          "p": 1.2,
          "f": 0.1,
          "c": 3.4
        }
      },
      {
        "name": "Сельдерей стеблевой",
        "grams": 50,
        "amountText": "50 г",
        "per100": {
          "kcal": 13,
          "p": 0.9,
          "f": 0.1,
          "c": 2.1
        }
      },
      {
        "name": "Виноград",
        "grams": 40,
        "foodId": "s-grapes",
        "amountText": "40 г"
      },
      {
        "name": "Масло оливковое",
        "grams": 5,
        "foodId": "s-oil-olive",
        "amountText": "1 ч. л."
      }
    ],
    "steps": [
      "Нашинковать пекинскую капусту.",
      "Нарезать огурец, перец, редис и сельдерей, порвать руками листья салата.",
      "Виноград разрезать пополам.",
      "Соединить всё в миске и заправить маслом."
    ],
    "note": "Изюм заменили свежим виноградом — сухофрукты липнут к брекетам. Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-chicken_cheese_schnitzel_rice",
    "name": "Куриный шницель с сыром и бурым рисом",
    "emoji": "🍗",
    "meals": [
      "lunch",
      "dinner"
    ],
    "kinds": [
      "meat"
    ],
    "timeMin": 30,
    "servings": 1,
    "ingredients": [
      {
        "name": "Куриная грудка",
        "grams": 100,
        "foodId": "s-chicken-breast-raw",
        "amountText": "100 г"
      },
      {
        "name": "Сыр твёрдый",
        "grams": 10,
        "foodId": "s-cheese-hard",
        "amountText": "10 г"
      },
      {
        "name": "Яйцо",
        "grams": 55,
        "foodId": "s-egg",
        "amountText": "1 шт"
      },
      {
        "name": "Мука овсяная",
        "grams": 30,
        "amountText": "30 г",
        "per100": {
          "kcal": 369,
          "p": 13,
          "f": 6.8,
          "c": 64.9
        }
      },
      {
        "name": "Рис бурый",
        "grams": 60,
        "foodId": "s-rice-brown-dry",
        "amountText": "60 г"
      },
      {
        "name": "Перец болгарский",
        "grams": 200,
        "foodId": "s-bell-pepper",
        "amountText": "200 г"
      },
      {
        "name": "Соль, перец",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Натереть сыр на крупной тёрке.",
      "Курицу мелко нарубить и смешать с сыром, яйцом, мукой, солью и перцем, хорошо вымесить.",
      "Сформировать плоские котлеты и обжарить на слабом огне по 3–5 минут с каждой стороны.",
      "Отварить рис на гарнир.",
      "Подать с болгарским перцем, нарезанным соломкой."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-eggs_stuffed_tuna",
    "name": "Яйца, фаршированные тунцом и зеленью",
    "emoji": "🥚",
    "meals": [
      "snack",
      "breakfast"
    ],
    "kinds": [],
    "timeMin": 20,
    "servings": 1,
    "ingredients": [
      {
        "name": "Тунец в собственном соку",
        "grams": 50,
        "foodId": "s-tuna-canned-own-juice",
        "amountText": "50 г"
      },
      {
        "name": "Яйцо отварное",
        "grams": 55,
        "foodId": "s-egg",
        "amountText": "1 шт"
      },
      {
        "name": "Зелень",
        "grams": 5,
        "foodId": "s-herbs",
        "amountText": "5 г"
      },
      {
        "name": "Лимонный сок",
        "grams": 5,
        "amountText": "1 ч. л.",
        "per100": {
          "kcal": 16,
          "p": 0.9,
          "f": 0.1,
          "c": 3
        }
      },
      {
        "name": "Соль, специи",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Сварить яйцо вкрутую, разрезать пополам и вынуть желток.",
      "Размять тунец вилкой вместе с желтком.",
      "Добавить рубленую зелень, лимонный сок, соль и специи, тщательно перемешать.",
      "Наполнить начинкой половинки белка."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-veal_spinach_roll",
    "name": "Мясной рулет из телятины со шпинатом",
    "emoji": "🥩",
    "meals": [
      "dinner",
      "lunch"
    ],
    "kinds": [
      "meat"
    ],
    "timeMin": 80,
    "servings": 1,
    "ingredients": [
      {
        "name": "Фарш телячий",
        "grams": 140,
        "amountText": "140 г",
        "per100": {
          "kcal": 140,
          "p": 19.5,
          "f": 6.8,
          "c": 0
        }
      },
      {
        "name": "Лук репчатый",
        "grams": 50,
        "foodId": "s-onion",
        "amountText": "50 г"
      },
      {
        "name": "Чеснок",
        "grams": 3,
        "amountText": "1/2 зубчика",
        "per100": {
          "kcal": 149,
          "p": 6.5,
          "f": 0.5,
          "c": 29.9
        }
      },
      {
        "name": "Шпинат",
        "grams": 100,
        "foodId": "s-spinach",
        "amountText": "100 г"
      },
      {
        "name": "Йогурт натуральный",
        "grams": 50,
        "foodId": "s-yogurt-natural",
        "amountText": "50 г"
      },
      {
        "name": "Оливковое масло",
        "grams": 5,
        "foodId": "s-oil-olive",
        "amountText": "1 ч. л."
      },
      {
        "name": "Паприка копчёная, соль, перец",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Фарш посолить, поперчить, добавить паприку и тёртый чеснок, хорошо вымесить руками и оставить под плёнкой на 15 минут.",
      "Мелко нарезать лук и обжарить вместе со шпинатом до мягкости, посолить.",
      "Снять с огня и вмешать йогурт.",
      "Разровнять фарш пластом на пищевой плёнке и выложить сверху начинку ровным слоем.",
      "С помощью плёнки свернуть рулет, переложить на фольгу (плёнку убрать) и плотно завернуть.",
      "Запекать в разогретой до 190 °C духовке 1 час.",
      "Готовый рулет сбрызнуть оливковым маслом."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-vanilla_banana_cheesecake",
    "name": "Ванильно-банановый чизкейк",
    "emoji": "🍰",
    "meals": [
      "breakfast"
    ],
    "kinds": [
      "sweet"
    ],
    "timeMin": 20,
    "servings": 1,
    "ingredients": [
      {
        "name": "Творог 5%",
        "grams": 100,
        "foodId": "s-tvorog-5",
        "amountText": "100 г"
      },
      {
        "name": "Банан",
        "grams": 70,
        "foodId": "s-banana",
        "amountText": "70 г"
      },
      {
        "name": "Яйцо",
        "grams": 55,
        "foodId": "s-egg",
        "amountText": "1 шт"
      },
      {
        "name": "Молоко",
        "grams": 50,
        "foodId": "s-milk-2-5",
        "amountText": "50 мл"
      },
      {
        "name": "Мука овсяная",
        "grams": 20,
        "amountText": "20 г",
        "per100": {
          "kcal": 369,
          "p": 13,
          "f": 6.8,
          "c": 64.9
        }
      },
      {
        "name": "Ваниль",
        "grams": 0,
        "amountText": "1 стручок",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Йогурт натуральный",
        "grams": 70,
        "foodId": "s-yogurt-natural",
        "amountText": "70 мл"
      },
      {
        "name": "Мёд",
        "grams": 5,
        "foodId": "s-honey",
        "amountText": "5 г"
      }
    ],
    "steps": [
      "Смешать творог с яйцом.",
      "Подогреть молоко с ванилью, влить в творожную массу и добавить муку.",
      "Половину банана размять в пюре, добавить к массе и хорошо взбить.",
      "Вылить в смазанную маслом форму и выпекать в разогретой до 180 °C духовке до готовности.",
      "Подать, украсив оставшимся бананом, йогуртом и мёдом."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-chicken_herb_lavash_roll",
    "name": "Рулет из курицы и зелени в лаваше",
    "emoji": "🌯",
    "meals": [
      "snack"
    ],
    "kinds": [
      "meat"
    ],
    "timeMin": 10,
    "servings": 1,
    "ingredients": [
      {
        "name": "Куриная грудка",
        "grams": 50,
        "foodId": "s-chicken-breast-raw",
        "amountText": "50 г"
      },
      {
        "name": "Лаваш",
        "grams": 30,
        "foodId": "s-lavash-thin",
        "amountText": "30 г"
      },
      {
        "name": "Петрушка",
        "grams": 5,
        "foodId": "s-herbs",
        "amountText": "5 г"
      },
      {
        "name": "Йогурт натуральный",
        "grams": 50,
        "foodId": "s-yogurt-natural",
        "amountText": "50 мл"
      },
      {
        "name": "Соль, перец",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Отварить куриную грудку и нарезать или разобрать на волокна.",
      "Расстелить лаваш, смазать йогуртом, посолить и поперчить.",
      "Выложить курицу и петрушку, свернуть рулет и нарезать на порционные кусочки."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-stuffed_peppers_chicken",
    "name": "Перец, фаршированный курицей, рисом и овощами",
    "emoji": "🫑",
    "meals": [
      "lunch",
      "dinner"
    ],
    "kinds": [
      "meat"
    ],
    "timeMin": 40,
    "servings": 1,
    "ingredients": [
      {
        "name": "Перец болгарский",
        "grams": 280,
        "foodId": "s-bell-pepper",
        "amountText": "2 шт"
      },
      {
        "name": "Лук репчатый",
        "grams": 50,
        "foodId": "s-onion",
        "amountText": "50 г"
      },
      {
        "name": "Морковь",
        "grams": 50,
        "foodId": "s-carrot",
        "amountText": "50 г"
      },
      {
        "name": "Кабачок",
        "grams": 50,
        "foodId": "s-zucchini",
        "amountText": "50 г"
      },
      {
        "name": "Рис нешлифованный (бурый)",
        "grams": 60,
        "foodId": "s-rice-brown-dry",
        "amountText": "60 г"
      },
      {
        "name": "Помидоры",
        "grams": 100,
        "foodId": "s-tomato",
        "amountText": "100 г"
      },
      {
        "name": "Фарш из куриной грудки",
        "grams": 100,
        "foodId": "s-chicken-breast-raw",
        "amountText": "100 г"
      },
      {
        "name": "Йогурт натуральный",
        "grams": 100,
        "foodId": "s-yogurt-natural",
        "amountText": "100 г"
      },
      {
        "name": "Оливковое масло",
        "grams": 5,
        "foodId": "s-oil-olive",
        "amountText": "1 ч. л."
      },
      {
        "name": "Укроп",
        "grams": 5,
        "foodId": "s-herbs",
        "amountText": "5 г"
      },
      {
        "name": "Соль, перец, орегано",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Мелко нарезать лук и морковь, обжарить на сковороде, добавить мелко нарезанный кабачок и жарить ещё пару минут.",
      "Всыпать рис и обжарить вместе с овощами пару минут, влить около полстакана воды, приправить и готовить до испарения жидкости и полуготовности риса.",
      "Перцы вымыть, обсушить и очистить от сердцевины.",
      "Помидоры измельчить в блендере, добавить немного воды и специи.",
      "Наполнить перцы фаршем и рисовой смесью, уложить в кастрюлю и залить томатным пюре.",
      "Довести до кипения и тушить под крышкой до готовности.",
      "Подавать с йогуртом и укропом."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-zander_french_style",
    "name": "Судак по-французски с помидором и сыром",
    "emoji": "🐟",
    "meals": [
      "dinner",
      "lunch"
    ],
    "kinds": [],
    "timeMin": 30,
    "servings": 1,
    "ingredients": [
      {
        "name": "Судак",
        "grams": 140,
        "amountText": "140 г",
        "per100": {
          "kcal": 84,
          "p": 18.4,
          "f": 1.1,
          "c": 0
        }
      },
      {
        "name": "Сыр твёрдый",
        "grams": 10,
        "foodId": "s-cheese-hard",
        "amountText": "10 г"
      },
      {
        "name": "Помидор",
        "grams": 100,
        "foodId": "s-tomato",
        "amountText": "100 г"
      },
      {
        "name": "Йогурт натуральный",
        "grams": 50,
        "foodId": "s-yogurt-natural",
        "amountText": "50 г"
      },
      {
        "name": "Стручковая фасоль",
        "grams": 100,
        "foodId": "s-green-beans",
        "amountText": "100 г"
      },
      {
        "name": "Оливковое масло",
        "grams": 5,
        "foodId": "s-oil-olive",
        "amountText": "1 ч. л."
      },
      {
        "name": "Соль, перец",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Разделать судака на филе.",
      "Смазать форму для запекания маслом, выложить филе, посолить и поперчить.",
      "Сверху разложить ломтики помидора, смазать йогуртом и посыпать тёртым сыром.",
      "Запекать 20 минут при 200 °C.",
      "Отварить стручковую фасоль на гарнир."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-pshennaya_kasha_tykva",
    "name": "Пшённая каша на молоке с тыквой и мёдом",
    "emoji": "🎃",
    "meals": [
      "breakfast"
    ],
    "kinds": [
      "sweet"
    ],
    "timeMin": 35,
    "servings": 1,
    "ingredients": [
      {
        "name": "Пшено",
        "grams": 60,
        "foodId": "s-millet-dry",
        "amountText": "60 г"
      },
      {
        "name": "Молоко 2,5%",
        "grams": 200,
        "foodId": "s-milk-2-5",
        "amountText": "200 мл"
      },
      {
        "name": "Тыква",
        "grams": 150,
        "foodId": "s-pumpkin",
        "amountText": "150 г"
      },
      {
        "name": "Мёд",
        "grams": 5,
        "foodId": "s-honey",
        "amountText": "1 ч. л. (5 г)"
      }
    ],
    "steps": [
      "Пшено промыть холодной водой, тыкву нарезать кубиками.",
      "Тыкву залить небольшим количеством воды, сварить до мягкости и размять в пюре; отвар не выливать.",
      "В тыквенный отвар влить молоко, всыпать пшено и варить около 30 минут.",
      "Вмешать тыквенное пюре в почти готовую кашу.",
      "Добавить мёд, перемешать, снять с огня и дать постоять под крышкой 10 минут."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-buterbrod_avokado_tvorog",
    "name": "Бутерброд с авокадо, творогом и кунжутом",
    "emoji": "🥑",
    "meals": [
      "snack",
      "breakfast"
    ],
    "kinds": [],
    "timeMin": 5,
    "servings": 1,
    "ingredients": [
      {
        "name": "Хлеб цельнозерновой",
        "grams": 30,
        "foodId": "s-bread-whole-grain",
        "amountText": "1 ломтик (30 г)"
      },
      {
        "name": "Авокадо",
        "grams": 50,
        "foodId": "s-avocado",
        "amountText": "50 г"
      },
      {
        "name": "Творог 5%",
        "grams": 30,
        "foodId": "s-tvorog-5",
        "amountText": "30 г"
      },
      {
        "name": "Кунжут",
        "grams": 10,
        "amountText": "10 г",
        "per100": {
          "kcal": 565,
          "p": 19.4,
          "f": 48.7,
          "c": 12.2
        }
      }
    ],
    "steps": [
      "Размять авокадо вилкой вместе с творогом до однородной пасты.",
      "Намазать пасту на ломтик цельнозернового хлеба.",
      "Посыпать сверху кунжутом."
    ],
    "note": "Хрустящие хлебцы заменены мягким цельнозерновым хлебом — из-за брекетов. Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-plov_krasnyi_ris_bedro",
    "name": "Плов из красного риса с куриным бедром",
    "emoji": "🍛",
    "meals": [
      "lunch",
      "dinner"
    ],
    "kinds": [
      "meat"
    ],
    "timeMin": 90,
    "servings": 1,
    "ingredients": [
      {
        "name": "Куриное бедро (филе)",
        "grams": 120,
        "foodId": "s-chicken-thigh-skinless-raw",
        "amountText": "120 г"
      },
      {
        "name": "Рис красный «Рубин», сухой",
        "grams": 60,
        "amountText": "60 г",
        "per100": {
          "kcal": 335,
          "p": 7.5,
          "f": 2.2,
          "c": 71
        }
      },
      {
        "name": "Лук репчатый",
        "grams": 40,
        "foodId": "s-onion",
        "amountText": "40 г"
      },
      {
        "name": "Морковь",
        "grams": 80,
        "foodId": "s-carrot",
        "amountText": "80 г"
      },
      {
        "name": "Перец болгарский",
        "grams": 100,
        "foodId": "s-bell-pepper",
        "amountText": "100 г"
      },
      {
        "name": "Масло оливковое",
        "grams": 5,
        "foodId": "s-oil-olive",
        "amountText": "1 ч. л. (5 г)"
      },
      {
        "name": "Чеснок",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Соль и специи",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Красный рис несколько раз промыть и оставить в воде.",
      "Мясо нарезать кубиками и обжаривать на огне чуть ниже среднего 10–15 минут, помешивая.",
      "Морковь и перец нарезать мелким кубиком, лук и чеснок измельчить; добавить к мясу, посолить, поперчить и тушить 7–10 минут.",
      "Добавить промытый рис и воду (в 2 раза больше объёма риса), накрыть крышкой и томить на очень слабом огне около часа.",
      "Когда вода впитается, снять с огня и укутать полотенцем.",
      "Перед подачей заправить оливковым маслом."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-zhele_klubnika_agar",
    "name": "Клубничное желе на агар-агаре",
    "emoji": "🍓",
    "meals": [
      "snack"
    ],
    "kinds": [
      "sweet"
    ],
    "timeMin": 20,
    "servings": 1,
    "ingredients": [
      {
        "name": "Клубника",
        "grams": 200,
        "foodId": "s-strawberry",
        "amountText": "200 г"
      },
      {
        "name": "Мёд",
        "grams": 5,
        "foodId": "s-honey",
        "amountText": "1 ч. л. (5 г)"
      },
      {
        "name": "Агар-агар (порошок)",
        "grams": 1,
        "amountText": "1 г",
        "per100": {
          "kcal": 301,
          "p": 6.2,
          "f": 0.3,
          "c": 75.6
        }
      },
      {
        "name": "Вода питьевая",
        "grams": 120,
        "amountText": "120 мл",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Кокосовое молоко 2%",
        "grams": 100,
        "amountText": "100 мл",
        "per100": {
          "kcal": 25,
          "p": 0.2,
          "f": 2,
          "c": 1.5
        }
      }
    ],
    "steps": [
      "Клубнику вымыть, обсушить и пробить блендером в пюре.",
      "Смешать воду, кокосовое молоко и мёд, дождаться, пока мёд разойдётся, всыпать агар-агар.",
      "Прогреть смесь на минимальном огне 2 минуты, не давая бурно кипеть.",
      "Аккуратно влить клубничное пюре и перемешать, стараясь не взбивать пузырьки.",
      "Разлить по стаканам или формочкам и убрать в холодильник на несколько часов до застывания."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-treska_v_travah",
    "name": "Треска, запечённая в травах",
    "emoji": "🐟",
    "meals": [
      "dinner",
      "lunch"
    ],
    "kinds": [],
    "timeMin": 35,
    "servings": 1,
    "ingredients": [
      {
        "name": "Филе трески, сырое",
        "grams": 140,
        "amountText": "140 г",
        "per100": {
          "kcal": 78,
          "p": 17.7,
          "f": 0.7,
          "c": 0
        }
      },
      {
        "name": "Мята свежая",
        "grams": 5,
        "foodId": "s-herbs",
        "amountText": "несколько веточек (5 г)"
      },
      {
        "name": "Тимьян свежий",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Тархун сушёный",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Лимон",
        "grams": 30,
        "amountText": "30 г",
        "per100": {
          "kcal": 34,
          "p": 0.9,
          "f": 0.1,
          "c": 3
        }
      },
      {
        "name": "Яичный белок",
        "grams": 66,
        "foodId": "s-egg-white",
        "amountText": "2 шт"
      },
      {
        "name": "Перец болгарский",
        "grams": 200,
        "foodId": "s-bell-pepper",
        "amountText": "200 г"
      }
    ],
    "steps": [
      "Филе трески промыть, обсушить, удалить кости; посыпать перцем и тимьяном.",
      "На лист пергамента выложить половину трав и кружки лимона, сверху положить рыбу и посыпать сушёным тархуном.",
      "Белки взбить с несколькими каплями лимонного сока и выложить на рыбу.",
      "Накрыть оставшимися травами и плотно завернуть пергамент.",
      "Запекать 20–25 минут при 180 °C.",
      "Подавать с болгарским перцем, нарезанным кольцами."
    ],
    "note": "Грецкие орехи убраны — из-за брекетов. Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-yaichnye_maffiny_zelen",
    "name": "Яичные маффины с зеленью и цельнозерновым хлебом",
    "emoji": "🧁",
    "meals": [
      "breakfast"
    ],
    "kinds": [],
    "timeMin": 20,
    "servings": 1,
    "ingredients": [
      {
        "name": "Лук зелёный",
        "grams": 20,
        "amountText": "20 г",
        "per100": {
          "kcal": 20,
          "p": 1.3,
          "f": 0.1,
          "c": 3.2
        }
      },
      {
        "name": "Петрушка",
        "grams": 20,
        "foodId": "s-herbs",
        "amountText": "20 г"
      },
      {
        "name": "Яйцо",
        "grams": 110,
        "foodId": "s-egg",
        "amountText": "2 шт"
      },
      {
        "name": "Молоко 2,5%",
        "grams": 50,
        "foodId": "s-milk-2-5",
        "amountText": "50 г"
      },
      {
        "name": "Хлеб цельнозерновой",
        "grams": 100,
        "foodId": "s-bread-whole-grain",
        "amountText": "100 г"
      },
      {
        "name": "Соль, орегано",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Разогреть духовку до 180 °C.",
      "Взбить яйца с молоком, солью и орегано.",
      "Мелко нарезать зелёный лук и петрушку и вмешать в яичную смесь.",
      "Смазать силиконовые формочки маслом и заполнить смесью на 3/4 — маффины поднимутся при выпекании.",
      "Выпекать до готовности и подавать с цельнозерновым хлебом."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-raznocvetnyi_salat",
    "name": "Разноцветный салат со свёклой и авокадо",
    "emoji": "🥗",
    "meals": [
      "snack"
    ],
    "kinds": [],
    "timeMin": 10,
    "servings": 1,
    "ingredients": [
      {
        "name": "Свёкла варёная",
        "grams": 100,
        "foodId": "s-beet-boiled",
        "amountText": "100 г"
      },
      {
        "name": "Морковь",
        "grams": 100,
        "foodId": "s-carrot",
        "amountText": "100 г"
      },
      {
        "name": "Огурец свежий",
        "grams": 100,
        "foodId": "s-cucumber",
        "amountText": "100 г"
      },
      {
        "name": "Йогурт натуральный",
        "grams": 50,
        "foodId": "s-yogurt-natural",
        "amountText": "50 мл"
      },
      {
        "name": "Черника свежая",
        "grams": 40,
        "foodId": "s-bilberry",
        "amountText": "40 г"
      },
      {
        "name": "Авокадо",
        "grams": 50,
        "foodId": "s-avocado",
        "amountText": "50 г"
      },
      {
        "name": "Соль",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Свёклу и морковь натереть на тёрке.",
      "Огурец и авокадо нарезать небольшими кубиками.",
      "Соединить овощи в миске, посолить и заправить йогуртом.",
      "Сверху посыпать черникой."
    ],
    "note": "Без грецких орехов, а сушёные ягоды годжи заменены свежей черникой — из-за брекетов. Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-kurinye_tefteli_grechka",
    "name": "Куриные тефтели в томатном соусе с гречкой",
    "emoji": "🧆",
    "meals": [
      "lunch",
      "dinner"
    ],
    "kinds": [
      "meat"
    ],
    "timeMin": 30,
    "servings": 1,
    "ingredients": [
      {
        "name": "Куриное филе",
        "grams": 100,
        "foodId": "s-chicken-breast-raw",
        "amountText": "100 г"
      },
      {
        "name": "Капуста белокочанная",
        "grams": 100,
        "foodId": "s-cabbage-white",
        "amountText": "100 г"
      },
      {
        "name": "Лук репчатый",
        "grams": 50,
        "foodId": "s-onion",
        "amountText": "50 г"
      },
      {
        "name": "Помидор",
        "grams": 100,
        "foodId": "s-tomato",
        "amountText": "100 г"
      },
      {
        "name": "Йогурт натуральный",
        "grams": 30,
        "foodId": "s-yogurt-natural",
        "amountText": "30 г"
      },
      {
        "name": "Гречка (ядрица), сухая",
        "grams": 60,
        "amountText": "60 г",
        "per100": {
          "kcal": 313,
          "p": 12.6,
          "f": 3.3,
          "c": 62.1
        }
      },
      {
        "name": "Масло оливковое",
        "grams": 5,
        "foodId": "s-oil-olive",
        "amountText": "1 ч. л. (5 г)"
      },
      {
        "name": "Соль, перец, чеснок, специи",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Куриное филе промыть, обсушить и измельчить в фарш в мясорубке или блендере.",
      "Капусту мелко нашинковать или измельчить блендером и смешать с фаршем; слепить тефтели среднего размера.",
      "Помидор натереть на тёрке и потушить с мелко нарезанным луком на оливковом масле, посолить и добавить йогурт.",
      "Выложить тефтели в соус и тушить под крышкой на среднем огне до готовности; в конце добавить сушёный чеснок, итальянские травы и лавровый лист.",
      "Гречку отварить и подавать вместе с тефтелями."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-krevetki_perec_brokkoli",
    "name": "Креветки с болгарским перцем и брокколи",
    "emoji": "🍤",
    "meals": [
      "dinner",
      "lunch"
    ],
    "kinds": [],
    "timeMin": 15,
    "servings": 1,
    "ingredients": [
      {
        "name": "Креветки очищенные, сырые",
        "grams": 140,
        "amountText": "140 г",
        "per100": {
          "kcal": 87,
          "p": 18.9,
          "f": 1.1,
          "c": 0
        }
      },
      {
        "name": "Лук репчатый",
        "grams": 50,
        "foodId": "s-onion",
        "amountText": "50 г"
      },
      {
        "name": "Перец болгарский",
        "grams": 50,
        "foodId": "s-bell-pepper",
        "amountText": "50 г"
      },
      {
        "name": "Масло оливковое",
        "grams": 10,
        "foodId": "s-oil-olive",
        "amountText": "2 ч. л. (10 г)"
      },
      {
        "name": "Брокколи",
        "grams": 150,
        "foodId": "s-broccoli",
        "amountText": "150 г"
      },
      {
        "name": "Соль, перец, сушёный чеснок, тмин",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Креветки сложить в миску, посыпать тмином и сушёным чесноком и оставить на 10 минут.",
      "Обжарить креветки по минуте с каждой стороны.",
      "Добавить нарезанные лук и болгарский перец, посолить, поперчить и готовить на среднем огне 3–4 минуты, помешивая.",
      "Полить оливковым маслом.",
      "Брокколи отварить или приготовить на пару и подавать вместе с креветками."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-syrniki_zapechennye_malina",
    "name": "Запечённые сырники с малиной",
    "emoji": "🥞",
    "meals": [
      "breakfast",
      "snack"
    ],
    "kinds": [
      "sweet"
    ],
    "timeMin": 25,
    "servings": 1,
    "ingredients": [
      {
        "name": "Творог 5%",
        "grams": 100,
        "foodId": "s-tvorog-5",
        "amountText": "100 г"
      },
      {
        "name": "Яйцо",
        "grams": 55,
        "foodId": "s-egg",
        "amountText": "1 шт"
      },
      {
        "name": "Мука цельнозерновая",
        "grams": 10,
        "amountText": "10 г",
        "per100": {
          "kcal": 320,
          "p": 13,
          "f": 2.5,
          "c": 61
        }
      },
      {
        "name": "Цедра апельсина",
        "grams": 0,
        "amountText": "½ апельсина, по желанию",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Малина",
        "grams": 150,
        "foodId": "s-raspberry",
        "amountText": "150 г"
      }
    ],
    "steps": [
      "Разогреть духовку до 180 °C, застелить противень пергаментом.",
      "Творог протереть через сито, яйцо отдельно взбить венчиком около минуты.",
      "Бережно соединить творог с яйцом, всыпать просеянную муку и цедру и аккуратно перемешать.",
      "Скатать несколько одинаковых шариков, выложить на противень и слегка приплюснуть ладонью.",
      "Выпекать около 20 минут и подавать с малиной."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-indeyka_greypfrut_psheno",
    "name": "Индейка с грейпфрутом и пшеном",
    "emoji": "🦃",
    "meals": [
      "lunch",
      "dinner"
    ],
    "kinds": [
      "meat"
    ],
    "timeMin": 25,
    "servings": 1,
    "ingredients": [
      {
        "name": "Филе индейки",
        "grams": 140,
        "foodId": "s-turkey-fillet-raw",
        "amountText": "140 г"
      },
      {
        "name": "Грейпфрут",
        "grams": 100,
        "foodId": "s-grapefruit",
        "amountText": "100 г"
      },
      {
        "name": "Тимьян свежий",
        "grams": 0,
        "amountText": "1–2 веточки",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Масло оливковое",
        "grams": 5,
        "foodId": "s-oil-olive",
        "amountText": "1 ч. л. (5 г)"
      },
      {
        "name": "Соль, перец",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Пшено",
        "grams": 60,
        "foodId": "s-millet-dry",
        "amountText": "60 г"
      }
    ],
    "steps": [
      "Пшено промыть и отварить.",
      "Филе индейки нарезать ломтиками и обжаривать на сухой сковороде 10–12 минут, переворачивая; посолить в конце.",
      "Грейпфрут очистить, разобрать на дольки и снять все белые плёнки.",
      "Выложить на тарелку индейку, грейпфрут и пшено, поперчить, сбрызнуть оливковым маслом и украсить тимьяном."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-vrap_avokado_klubnika",
    "name": "Салатный врап с авокадо и клубникой",
    "emoji": "🌯",
    "meals": [
      "snack"
    ],
    "kinds": [],
    "timeMin": 10,
    "servings": 1,
    "ingredients": [
      {
        "name": "Салат латук",
        "grams": 60,
        "foodId": "s-lettuce",
        "amountText": "60 г"
      },
      {
        "name": "Клубника",
        "grams": 100,
        "foodId": "s-strawberry",
        "amountText": "100 г"
      },
      {
        "name": "Авокадо",
        "grams": 50,
        "foodId": "s-avocado",
        "amountText": "50 г"
      },
      {
        "name": "Мята свежая",
        "grams": 0,
        "amountText": "несколько веточек",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Перец чёрный молотый",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      }
    ],
    "steps": [
      "Клубнику нарезать кружочками, авокадо — ломтиками.",
      "Разложить авокадо и клубнику на листьях салата и поперчить.",
      "Добавить листики мяты, свернуть листья рулетом и подавать."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-shashlychki_semga_kabachok",
    "name": "Шашлычки из сёмги с кабачком и помидорами",
    "emoji": "🍢",
    "meals": [
      "dinner",
      "lunch"
    ],
    "kinds": [],
    "timeMin": 60,
    "servings": 1,
    "ingredients": [
      {
        "name": "Филе сёмги",
        "grams": 140,
        "foodId": "s-salmon-raw",
        "amountText": "140 г"
      },
      {
        "name": "Кабачок",
        "grams": 150,
        "foodId": "s-zucchini",
        "amountText": "150 г"
      },
      {
        "name": "Помидоры",
        "grams": 150,
        "foodId": "s-tomato",
        "amountText": "150 г"
      },
      {
        "name": "Укроп сушёный, майоран, имбирь молотый",
        "grams": 0,
        "amountText": "щепотка",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Перец чёрный молотый, лимонный сок",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Масло оливковое",
        "grams": 5,
        "foodId": "s-oil-olive",
        "amountText": "1 ч. л. (5 г)"
      }
    ],
    "steps": [
      "Сёмгу вымыть, обсушить и нарезать одинаковыми кусочками; сбрызнуть лимонным соком и частью масла, приправить майораном, укропом, имбирём и перцем, перемешать и убрать в холодильник на 30 минут.",
      "Кабачок нарезать кружками и сбрызнуть маслом; помидоры нарезать кружками, удалив плодоножку.",
      "Смазать шпажки маслом и нанизать рыбу, чередуя с кабачком и помидорами.",
      "Сбрызнуть шашлычки остатками масла, завернуть в фольгу и запекать 20 минут при 200 °C.",
      "Подавать горячими."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-kokosovaya_kasha_kinoa",
    "name": "Кокосовая каша из киноа с малиной и бананом",
    "emoji": "🥣",
    "meals": [
      "breakfast"
    ],
    "kinds": [
      "sweet"
    ],
    "timeMin": 20,
    "servings": 1,
    "ingredients": [
      {
        "name": "Киноа",
        "grams": 60,
        "foodId": "s-quinoa-dry",
        "amountText": "60 г"
      },
      {
        "name": "Кокосовое молоко 2%",
        "grams": 200,
        "amountText": "200 мл",
        "per100": {
          "kcal": 25,
          "p": 0.2,
          "f": 2,
          "c": 1.5
        }
      },
      {
        "name": "Малина (свежая или замороженная)",
        "grams": 100,
        "foodId": "s-raspberry",
        "amountText": "100 г"
      },
      {
        "name": "Банан",
        "grams": 50,
        "foodId": "s-banana",
        "amountText": "50 г"
      },
      {
        "name": "Мёд",
        "grams": 5,
        "foodId": "s-honey",
        "amountText": "5 г"
      }
    ],
    "steps": [
      "Киноа промыть и сварить на кокосовом молоке до мягкости.",
      "Вмешать в готовую кашу малину и нарезанный банан.",
      "При подаче полить мёдом."
    ],
    "note": "Тыквенные семечки убраны — из-за брекетов. Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-pepperonata_kurica_perlovka",
    "name": "Пеппероната с курицей и перловкой",
    "emoji": "🫑",
    "meals": [
      "lunch",
      "dinner"
    ],
    "kinds": [
      "meat"
    ],
    "timeMin": 20,
    "servings": 1,
    "ingredients": [
      {
        "name": "Куриное филе",
        "grams": 100,
        "foodId": "s-chicken-breast-raw",
        "amountText": "100 г"
      },
      {
        "name": "Мука овсяная",
        "grams": 20,
        "amountText": "20 г",
        "per100": {
          "kcal": 369,
          "p": 13,
          "f": 6.8,
          "c": 64.9
        }
      },
      {
        "name": "Соль, перец, чеснок",
        "grams": 0,
        "amountText": "по вкусу",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Лук репчатый",
        "grams": 50,
        "foodId": "s-onion",
        "amountText": "50 г"
      },
      {
        "name": "Перец болгарский",
        "grams": 100,
        "foodId": "s-bell-pepper",
        "amountText": "100 г"
      },
      {
        "name": "Томаты",
        "grams": 100,
        "foodId": "s-tomato",
        "amountText": "100 г"
      },
      {
        "name": "Масло оливковое",
        "grams": 5,
        "foodId": "s-oil-olive",
        "amountText": "1 ч. л. (5 г)"
      },
      {
        "name": "Перловка",
        "grams": 60,
        "foodId": "s-pearl-barley-dry",
        "amountText": "60 г"
      }
    ],
    "steps": [
      "Перловку отварить.",
      "Куриное филе нарезать небольшими кусочками, посолить, поперчить и обвалять в овсяной муке; обжарить на оливковом масле 5–7 минут и переложить в миску.",
      "Томаты очистить от кожицы и пробить блендером в пюре; лук нарезать полукольцами, перец — соломкой, чеснок измельчить.",
      "На той же сковороде обжарить лук с чесноком 4–5 минут, добавить перец и жарить ещё 5 минут.",
      "Вернуть курицу, влить томатное пюре, довести до кипения и тушить 20–25 минут.",
      "Подавать с перловкой, по желанию посыпав зеленью."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-humus_ovoshchi",
    "name": "Хумус с овощными палочками",
    "emoji": "🥕",
    "meals": [
      "snack"
    ],
    "kinds": [],
    "timeMin": 7,
    "servings": 1,
    "ingredients": [
      {
        "name": "Морковь",
        "grams": 100,
        "foodId": "s-carrot",
        "amountText": "100 г"
      },
      {
        "name": "Сельдерей черешковый",
        "grams": 100,
        "amountText": "100 г",
        "per100": {
          "kcal": 13,
          "p": 0.9,
          "f": 0.1,
          "c": 2.1
        }
      },
      {
        "name": "Перец болгарский",
        "grams": 100,
        "foodId": "s-bell-pepper",
        "amountText": "100 г"
      },
      {
        "name": "Хумус нутовый (готовый)",
        "grams": 50,
        "amountText": "50 г",
        "per100": {
          "kcal": 290,
          "p": 7.5,
          "f": 24,
          "c": 11
        }
      }
    ],
    "steps": [
      "Морковь, сельдерей и болгарский перец нарезать тонкими брусочками.",
      "Подавать с хумусом и есть, обмакивая овощи в него."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  },
  {
    "id": "n-govyadina_zelenyi_luk",
    "name": "Маринованная говядина с зелёным луком и стручковой фасолью",
    "emoji": "🥩",
    "meals": [
      "dinner",
      "lunch"
    ],
    "kinds": [
      "meat"
    ],
    "timeMin": 30,
    "servings": 1,
    "ingredients": [
      {
        "name": "Говяжья вырезка",
        "grams": 140,
        "foodId": "s-beef-lean-raw",
        "amountText": "140 г"
      },
      {
        "name": "Лук зелёный",
        "grams": 50,
        "amountText": "50 г",
        "per100": {
          "kcal": 20,
          "p": 1.3,
          "f": 0.1,
          "c": 3.2
        }
      },
      {
        "name": "Горчица сухая, перец чёрный, тмин, соль",
        "grams": 0,
        "amountText": "щепотка",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Цедра лимона",
        "grams": 0,
        "amountText": "¼ лимона",
        "per100": {
          "kcal": 0,
          "p": 0,
          "f": 0,
          "c": 0
        }
      },
      {
        "name": "Лимонный сок",
        "grams": 20,
        "amountText": "сок ½ лимона",
        "per100": {
          "kcal": 16,
          "p": 0.9,
          "f": 0.1,
          "c": 3
        }
      },
      {
        "name": "Фасоль стручковая",
        "grams": 150,
        "foodId": "s-green-beans",
        "amountText": "150 г"
      }
    ],
    "steps": [
      "Говяжью вырезку нарезать полосками и сложить в миску.",
      "Нарезать зелёный лук, смешать часть со специями, лимонным соком и цедрой и выложить на мясо.",
      "Накрыть плёнкой и мариновать при комнатной температуре около 40 минут.",
      "Снять лук с мяса, посолить полоски с обеих сторон и обжарить на сковороде-гриль.",
      "Стручковую фасоль отварить или приготовить на пару.",
      "Подавать мясо с фасолью и оставшимся зелёным луком, обжаренным на гриле 1 минуту."
    ],
    "note": "Рецепт из меню Насти Мироновой, переписан для нас."
  }
];
