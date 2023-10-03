// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = []
  static #count = 0

  constructor(img, title, description, category, price, amount = 0,) {
    this.id = ++Product.#count // Генеруемо унікальний id для товару
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount 
  }

  static add = (...data ) => {
    const newProduct = new Product(...data)
    this.#list.push(newProduct)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
    // Фільтруе товари, щоб вилучити той, з яким порівнюємо id
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )

    // Відсортовуємо за допомогою math.random() та перемішуємо масив
    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )

    // Повертаємо перші 3 елементи з перемішаного масиву
    return shuffledList.slice(0, 3)
  }
}

Product.add(
  'https://picsum.photos/200/300',
  "Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel",
  "Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux",
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  27000,
  10,
)

Product.add(
  'https://picsum.photos/200/300',
  "Комп'ютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)",
  "Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС",
  [{ id: 2, text: 'Топ продажів' }],
  17000,
  10,
)

Product.add(
  'https://picsum.photos/200/300',
  "Комп'ютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)",
  "Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС",
  [{ id: 2, text: 'Топ продажів' }],
  24000,
  10,
)

Product.add(
  'https://picsum.photos/200/300',
  "Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/",
  "AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС",
  [{ id: 1, text: 'Готовий до відправки' }],
  40000,
  10,
)

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()
  
   static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonusAmount(price)

    const currentBalance = Purchase.getBonusBalance(email)

    const updatedBalance =
    currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updatedBalance)

    console.log(email, updatedBalance)

    return amount
  }

  constructor(data, product) {
    this.id = ++Purchase.#count

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email
    this.delivery = data.delivery

    this.comment = data.comment || null

    this.bonus = data.bonus || 0

    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount

    this.product = product
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)

    this.#list.push(newPurchase)

    newPurchase.product.amount -= newPurchase.amount

    return newPurchase
  }

  static getList = () => {
    return Purchase.#list.reverse().map((purchase) => ({
      id: purchase.id,
      product: purchase.product.title,
      totalPrice: purchase.totalPrice,
      bonus: Purchase.calcBonusAmount(purchase.totalPrice),
    }))
  }

  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id)
  }

  static updatedById = (id, data) => {
    const purchase = Purchase.getById(id);

    if (purchase) {
      if (data.firstname) purchase.firstname = data.firstname
      if (data.lastname) purchase.lastname = data.lastname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email
      if (data.delivery) purchase.delivery = data.delivery
      return true
    } else {
      return false
    }
  }
}

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromoCode = new Promocode(name, factor)

    Promocode.#list.push(newPromoCode)

    return newPromoCode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add('SUMMER2023', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-index',

    data: {
      list: Product.getList(),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/purchase-product', function (req, res) {
  const id = Number (req.query.id)
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-product', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-product',

    data: {
    list: Product.getRandomList(id),
    product: Product.getById(id),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ==============================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',

    data: {
      message: 'Успішне виконання дії',
      info: 'замовлення успішно було створено',
      link:'/test-path',
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/purchase-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',
 
      data: {
        message: 'Помилка',
        info: 'Некоректна кількість товару',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  const product = Product.getById(id)

  if (product.amount < 1) {
    return res.render('alert', {
      style: 'alert',

      data: {
        link: `/purchase-product?id=${id}`,
        message: 'Помилка',
        info: 'Такої кількості товару немає в намявнсисті',
      },
    })
  }

  console.log(product, amount)

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)
 
  res.render('purchase-create', {
    style: 'purchase-create',

    data: {
      id: product.id,
  
      card: [
        {
          text: `${product.title} (${amount} шт)`,
          price: product.price,
        },
        {
          text: 'Вартість доставки',
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      amount,
      bonus,
      deliveryPrice: Purchase.DELIVERY_PRICE,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ==============================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,
    comment,

    promocode,
    bonus,
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',

        data: {
        message: 'Помилка',
        info: 'Товар не знайдено',
        link: `/purchase-list`,
      },
    })
  }

  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Товару нема в потрібній кількості',
        link: `/purchase-list`,
      },
    })
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Некоректні дані',
        link: `/purchase-list`,
      },
    })
  }

  if (!firstname || !lastname || !email || !phone) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Заповніть обовязкові поля',
        info: 'Некоректні дані',
        link: `/purchase-list`,
      },
    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)

    console.log(bonusAmount)

    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)

    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if (totalPrice < 0) totalPrice = 0

  if (promocode) {
    promocode = Promocode.getByName(promocode)

    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,
     
      firstname,
      lastname,
      email,
      phone,

      promocode,
      comment,
    },
    product,
  )

  console.log(purchase)

  res.render('alert', {
    style: 'alert',

    data: {
      message: 'Успішно',
      info: 'Замовлення створено',
      link: `/purchase-list`,
    },
  })
})

// ==============================================================

router.get('/purchase-list', function (req, res) {
  const list = Purchase.getList()
  
  res.render('purchase-list', {
    style: 'purchase-list',
    title: 'Мої замовлення',

    data: {
      purchases: {
        list,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ==============================================================

router.get('/purchase-info', function (req, res) {
const id = Number(req.query.id)
const purchase = Purchase.getById(id)
const bonus = Purchase.calcBonusAmount(
  purchase.totalPrice,
)
 
  console.log('purchase:', purchase, bonus)
  
  res.render('purchase-info', {
    style: 'purchase-info',
    title: 'Інформація про замовлення',

    data: {
      id: purchase.id,
      firstname: purchase.firstname,
      lastname: purchase.lastname,
      phone: purchase.phone,
      email: purchase.email,
      comment: purchase.comment,
      delivery: purchase.delivery,
      product: purchase.product.title,
      productPrice: purchase.productPrice,
      deliveryPrice: purchase.deliveryPrice,
      totalPrice: purchase.totalPrice,
      bonus: bonus,
    },
  });
});

// ==============================================================

router.get('/purchase-edit', function (req, res) {
  const id = Number(req.query.id);

  const purchase = Purchase.getById(id);

  if (!purchase) {
    res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Замовлення з таким ID не знайдено',
        link: '/purchase-list',
      },
    });
  } else {
    res.render('purchase-edit', {
      style: 'purchase-edit',
      title: 'Зміна данних замовлення',
      data: {
        id: purchase.id,
        firstname: purchase.firstname,
        lastname: purchase.lastname,
        phone: purchase.phone,
        email: purchase.email,
        deliveryPrice: purchase.deliveryPrice,
        product: purchase.product.title,
      },
    });
  }
});

// ==============================================================

router.post('/purchase-edit', async function (req, res) {
  const id = Number(req.query.id);
  const { firstname, lastname, phone, email, delivery } = req.body;

  try {
    const purchase = await Purchase.getById(id);
    
    // перевіряємо чи існує товар з таким ID
    if (!purchase) {
      return res.status(404).render('alert', {
        style: 'alert',
        data: {
          message: 'Помилка',
          info: 'Замовлення не знайдено',
          link: '/purchase-list',
        },
      });
    }

    const updatedPurchase = await Purchase.updatedById(id, {
      firstname,
      lastname,
      phone,
      email,
      delivery,
    });

    // перевіряємо чи вдалося оновити дані
    if (updatedPurchase) {
      // якщо оновлення вдале, повертаємо повідомлення про успіх
      return res.status(200).render('alert', {
        style: 'alert',
        data: {
          message: 'Успішне виконання дії',
          info: 'Дані успішно оновлено',
          link: '/purchase-list',
        },
      });
    } else {
      // якщо оновлення не вдале, повертаємо повідомлення про помилку
      return res.status(500).render('alert', {
        style: 'alert',
        data: {
          message: 'Помилка',
          info: 'Не вдалося оновити дані',
          link: '/purchase-list',
        },
      });
    }
  } catch (error) {

    console.error(error);
    // повертаємо повідомлення про помилку яка виникає при оборобці запиту
    return res.status(500).render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Сталася помилка під час обробки запиту',
        link: '/purchase-list',
      },
    });
  }
});

// Підключаємо роутер до бек-енду
module.exports = router
