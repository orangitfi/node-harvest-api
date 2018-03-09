Node implementation for the Harvest rest API v2 using async/await.

[More info on the Harvest Rest API](https://help.getharvest.com/api-v2/)

## Table of Contents

- [Installation](#installation)
- [Initializing](#initializing)
- [Resources](#resources)
  - [Users](#users)
  - [User Project Assignments](#user-project-assignments)
  - [Clients](#clients)
  - [Contacts](#contacts)
  - [Invoices](#invoices)
  - [Invoices Messages](#invoices-messages)
  - [Invoices Payments](#invoices-payments)
  - [Invoice Item Categories](#invoice-item-categories)
  - [Estimates](#estimates)
  - [Estimate Messages](#estimate-messages)
  - [Estimate Item Categories](#estimate-item-categories)
  - [Expenses](#expenses)
  - [Expense Categories](#expense-categories)
  - [Tasks](#tasks)
  - [Time Entries](#time-entries)
  - [Projects](#projects)
  - [Project User Assignments](#project-user-assignments)
  - [Project Task Assignments](#project-task-assignments)
- [Pagination](#pagination)

## Installation

```
$ npm install node-harvest-api
```  

## Initializing

Create a Personal Access Token in Harvest [here](https://id.getharvest.com/developers).

```javascript
const Harvest = require('node-harvest-api')

const account_id = 12345
const token = 'Your Access Token'
const app_name = 'Your Application Name'

const harvest = new Harvest(account_id, token, app_name)
```

## Resources

All resources are then available on the 'harvest' instance with getters.

Almost every resource has the following methods:

- **all()**  
  Will fetch all records. Same as get() without arguments.

- **get(args)**  
  Fetches records by query arguments. Check out the API docs for the correct arguments.
  [Check out how to paginate.](#pagination)

- **raw(args)**  
  Same as get() but returns the entire response object instead of only the relevant records.
  This will only return the first page of a request. Subsequent pages (if any) are to be
  retrieved using the 'next_page' property of the response.

- **find(id)**  
  Retrieves one record by id.

- **create(args)**  
  Creates a new record.

- **udpate(id, args)**  
  Updates a record by id.

- **delete(id)**  
  Removes a record.

See below for examples.

The company resource is a special case. It is a method on its own.

```javascript
let settings = await harvest.company()
```

---

### Users

```javascript
let user_id = 123

harvest.users.all()
harvest.users.get({ is_active: true })
harvest.users.find(user_id)
harvest.users.create({ first_name: 'John', last_name: 'Doe', email: 'john.doe@mail.com' })
harvest.users.update(user_id, { first_name: 'Jane' })
harvest.users.delete(user_id)
```

Special method to retrieve the currently authenticated user:

```javascript
harvest.users.me()
```

**[API Docs](https://help.getharvest.com/api-v2/users-api/users/users/)**

---

### User Project Assignments

```javascript
let user_id = 123

harvest.users.pipe(user_id).project_assignments.all()
harvest.users.pipe(user_id).project_assignments.get({ updated_since: '2018-01-01T22:32:52Z' })
```

Pass 'me' to the `pipe()` method to get all project assignments for the currently authenticated user:

```javascript
harvest.users.pipe('me').project_assignments.all()
```

**[API Docs](https://help.getharvest.com/api-v2/users-api/users/project-assignments/)**

---

### Clients

```javascript
let client_id = 123

harvest.clients.all()
harvest.clients.get({ is_active: true })
harvest.clients.find(client_id)
harvest.clients.create({ name: 'ACME' })
harvest.clients.update(client_id, { is_active: false })
harvest.clients.delete(client_id)
```

**[API Docs](https://help.getharvest.com/api-v2/clients-api/clients/clients/)**

---

### Contacts

```javascript
let contact_id = 123

harvest.contacts.all()
harvest.contacts.get({ is_active: true })
harvest.contacts.find(contact_id)
harvest.contacts.create({ client_id: 12345, first_name: 'John' })
harvest.contacts.update(contact_id, { first_name: 'Jane' })
harvest.contacts.delete(contact_id)
```

**[API Docs](https://help.getharvest.com/api-v2/clients-api/clients/contacts/)**

---

### Invoices

```javascript
let invoice_id = 1234

harvest.invoices.all()
harvest.invoices.get({ project_id: 9999 })
harvest.invoices.find(invoice_id)
harvest.invoices.create({ client_id: 12345 })
harvest.invoices.update(invoice_id, { client_id: 12345 })
harvest.invoices.delete(invoice_id)
```

Some shortcuts are available to change the status of an invoice:

```javascript
let invoice_id = 1234

harvest.invoices.sent(invoice_id)
harvest.invoices.close(invoice_id)
harvest.invoices.reopen(invoice_id)
harvest.invoices.draft(invoice_id)
```

**[API Docs](https://help.getharvest.com/api-v2/invoices-api/invoices/invoices/)**

---

### Invoices Messages

```javascript
let invoice_id = 1234

harvest.invoices.pipe(invoice_id).messages.all()
harvest.invoices.pipe(invoice_id).messages.get({ limit: 2 })
harvest.invoices.pipe(invoice_id).messages.create({ recipients: [
  name: 'John Doe',
  email: 'mail@example.com'
]})
harvest.invoices.pipe(invoice_id).messages.delete(123)
```

**[API Docs](https://help.getharvest.com/api-v2/invoices-api/invoices/invoice-messages/)**

---

### Invoices Payments

```javascript
let invoice_id = 1234

harvest.invoices.pipe(invoice_id).payments.all()
harvest.invoices.pipe(invoice_id).payments.get({ limit: 2 })
harvest.invoices.pipe(invoice_id).payments.create({ amount: 1000 })
harvest.invoices.pipe(invoice_id).payments.delete(123)
```

**[API Docs](https://help.getharvest.com/api-v2/invoices-api/invoices/invoice-payments/)**

---

### Invoice Item Categories

```javascript
let invoice_item_category_id = 1234

harvest.invoice_item_categories.all()
harvest.invoice_item_categories.get({ limit: 2 })
harvest.invoice_item_categories.find(invoice_item_category_id)
harvest.invoice_item_categories.create({ name: 'Service' })
harvest.invoice_item_categories.update(invoice_item_category_id, { name: 'Product' })
harvest.invoice_item_categories.delete(invoice_item_category_id)
```

**[API Docs](https://help.getharvest.com/api-v2/invoices-api/invoices/invoice-item-categories/)**

---

### Estimates

```javascript
let estimate_id = 1234

harvest.estimates.all()
harvest.estimates.get({ client_id: 1 })
harvest.estimates.find(estimate_id)
harvest.estimates.create({ client_id: 1 })
harvest.estimates.update(estimate_id, { client_id: 1 })
harvest.estimates.delete(estimate_id)
```

Some shortcuts are available to change the status of an estimate:

```javascript
let estimate_id = 1234

harvest.estimates.accept(estimate_id)
harvest.estimates.send(estimate_id)
harvest.estimates.reopen(estimate_id)
harvest.estimates.decline(estimate_id)
```

**[API Docs](https://help.getharvest.com/api-v2/estimates-api/estimates/estimates/)**

---

### Estimate Messages

```javascript
let estimate_id = 1234

harvest.estimates.pipe(estimate_id).messages.all()
harvest.estimates.pipe(estimate_id).messages.get({ limit: 2 })
harvest.estimates.pipe(estimate_id).messages.create({ recipients: [
  name: 'John Doe',
  email: 'mail@example.com'
]})
harvest.estimates.pipe(estimate_id).messages.delete(123)
```

**[API Docs](https://help.getharvest.com/api-v2/estimates-api/estimates/estimate-messages/)**

---

### Estimate Item Categories

```javascript
let estimate_item_category_id = 1234

harvest.estimate_item_categories.all()
harvest.estimate_item_categories.get({ limit: 2 })
harvest.estimate_item_categories.find(estimate_item_category_id)
harvest.estimate_item_categories.create({ name: 'Service' })
harvest.estimate_item_categories.update(estimate_item_category_id, { name: 'Product' })
harvest.estimate_item_categories.delete(estimate_item_category_id)
```

**[API Docs](https://help.getharvest.com/api-v2/estimates-api/estimates/estimate-item-categories/)**

---

### Expenses

```javascript
let expense_id = 123

harvest.expenses.all()
harvest.expenses.get({ is_active: true })
harvest.expenses.find(expense_id)
harvest.expenses.create({ project_id: 1, expense_category_id: 2, spent_date: '2018-01-01' })
harvest.expenses.update(expense_id, { total_cost: 100 })
harvest.expenses.delete(expense_id)
```

**[API Docs](https://help.getharvest.com/api-v2/expenses-api/expenses/expenses/)**

---

### Expense Categories

```javascript
let expense_category_id = 1234

harvest.expense_categories.all()
harvest.expense_categories.get({ limit: 2 })
harvest.expense_categories.find(expense_category_id)
harvest.expense_categories.create({ name: 'Service' })
harvest.expense_categories.update(expense_category_id, { name: 'Product' })
harvest.expense_categories.delete(expense_category_id)
```

**[API Docs](https://help.getharvest.com/api-v2/expenses-api/expenses/expense-categories/)**

---

### Tasks

```javascript
let task_id = 1234

harvest.tasks.all()
harvest.tasks.get({ is_active: true })
harvest.tasks.find(task_id)
harvest.tasks.create({ name: 'Development' })
harvest.tasks.update(task_id, { name: 'Design' })
harvest.tasks.delete(task_id)
```

**[API Docs](https://help.getharvest.com/api-v2/tasks-api/tasks/tasks/)**

---

### Time Entries

```javascript
let time_entry_id = 1234

harvest.time_entries.all()
harvest.time_entries.get({ is_active: true })
harvest.time_entries.find(time_entry_id)
harvest.time_entries.create({ name: 'Development' })
harvest.time_entries.update(time_entry_id, { name: 'Design' })
harvest.time_entries.delete(time_entry_id)
```

Extra methods to start and stop timers:

```javascript
harvest.time_entries.stop(time_entry_id)
harvest.time_entries.restart(time_entry_id)
```

**[API Docs](https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/)**

### Projects

```javascript
let project_id = 1234

harvest.projects.all()
harvest.projects.get({ is_active: true })
harvest.projects.find(project_id)
harvest.projects.create({
  client_id: 1,
  name: 'Project Name',
  is_billable: true,
  bill_by: 'People',
  budget_by: 'project'
})
harvest.projects.update(project_id, { client_id: 2 })
harvest.projects.delete(project_id)
```

**[API Docs](https://help.getharvest.com/api-v2/projects-api/projects/projects/)**

---

### Project User Assignments

```javascript
let project_id = 123

harvest.projects.pipe(project_id).user_assignments.all()
harvest.projects.pipe(project_id).user_assignments.get({ is_active: true })
harvest.projects.pipe(project_id).user_assignments.find(1)
harvest.projects.pipe(project_id).user_assignments.create({ user_id: 1234 })
harvest.projects.pipe(project_id).user_assignments.update(1, { is_active: false })
harvest.projects.pipe(project_id).user_assignments.delete(1)
```

**[API Docs](https://help.getharvest.com/api-v2/projects-api/projects/user-assignments/)**

---

### Project Task Assignments

```javascript
let project_id = 123

harvest.projects.pipe(project_id).task_assignments.all()
harvest.projects.pipe(project_id).task_assignments.get({ is_active: true })
harvest.projects.pipe(project_id).task_assignments.find(1)
harvest.projects.pipe(project_id).task_assignments.create({ task_id: 1234 })
harvest.projects.pipe(project_id).task_assignments.update(1, { is_active: false })
harvest.projects.pipe(project_id).task_assignments.delete(1)
```

**[API Docs](https://help.getharvest.com/api-v2/projects-api/projects/task-assignments/)**

---

## Pagination

You can get a limited set of records when using the `get()` method by passing the 'page' and 'per_page' parameters.

```javascript
let tasks = await harvest.tasks.get({ page: 1, per_page: 5 })
```

The max amount of records per page is 100 as set by the Harvest API.

There's a little helper you can use to shorten this:

```javascript
let tasks = await harvest.tasks.get({ limit: 5 })
```
