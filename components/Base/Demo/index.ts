import usersData from './Users/users.json'
import contactsData from './Contacts/contacts.json'
import productsData from './Products/products.json'
import customersData from './Customers/customers.json'

export const demo = {
  users: usersData,
  contacts: contactsData,
  products: productsData,
  customers: customersData,
}

export const demoApi = {
  users: '/api/demo/users',
  contacts: '/api/demo/contacts',
  products: '/api/demo/products',
  customers: '/api/demo/customers',
}

export { default as users } from './Users/users.json'
export { default as contacts } from './Contacts/contacts.json'
export { default as products } from './Products/products.json'
export { default as customers } from './Customers/customers.json'
