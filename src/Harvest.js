'use strict'

const Wrapper = require('./Wrapper.js')

module.exports = class Harvest {

  constructor(account_id, token, app_name, subdomain = 'api') {
    this.account_id = account_id
    this.token = token
    this.app_name = app_name
    this.url = `https://${subdomain}.harvestapp.com/api/v2/`

    this.wrappers = []
  }

  get headers() {
    return {
      'Harvest-Account-ID': this.account_id,
      'Authorization': 'Bearer ' + this.token,
      'User-Agent': this.app_name
    }
  }

  get invoices() {
    let wrapper = this._getWrapper('invoices')

    wrapper.addPipe('messages', this._getWrapper('messages'))
    wrapper.addPipe('payments', this._getWrapper('payments'))

    wrapper.addMethod('sent', '${id}/messages', 'post', { event_type: 'send' })
    wrapper.addMethod('close', '${id}/messages', 'post', { event_type: 'close' })
    wrapper.addMethod('reopen', '${id}/messages', 'post', { event_type: 're-open' })
    wrapper.addMethod('draft', '${id}/messages', 'post', { event_type: 'draft' })

    return wrapper
  }

  get invoice_item_categories() {
    return this._getWrapper('invoice_item_categories')
  }

  get estimates() {
    let wrapper = this._getWrapper('estimates')

    wrapper.addPipe('messages', this._getWrapper('messages'))

    wrapper.addMethod('accept', '${id}/messages', 'post', { event_type: 'accept' })
    wrapper.addMethod('send', '${id}/messages', 'post', { event_type: 'send' })
    wrapper.addMethod('decline', '${id}/messages', 'post', { event_type: 'decline' })
    wrapper.addMethod('reopen', '${id}/messages', 'post', { event_type: 'reopen' })

    return wrapper
  }

  get estimate_item_categories() {
    return this._getWrapper('estimate_item_categories')
  }

  get tasks() {
    return this._getWrapper('tasks')
  }

  get clients() {
    return this._getWrapper('clients')
  }

  get contacts() {
    return this._getWrapper('contacts')
  }

  get expenses() {
    return this._getWrapper('expenses')
  }

  get expense_categories() {
    return this._getWrapper('expense_categories')
  }

  get projects() {
    let wrapper = this._getWrapper('projects')

    wrapper.addPipe('user_assignments', this._getWrapper('user_assignments'))
    wrapper.addPipe('task_assignments', this._getWrapper('task_assignments'))

    return wrapper
  }

  get roles() {
    return this._getWrapper('roles')
  }

  get users() {
    let wrapper = this._getWrapper('users')

    wrapper.addMethod('me', 'me', 'get')

    wrapper.addPipe('project_assignments', this._getWrapper('project_assignments'))

    return wrapper
  }

  get company() {
    let wrapper = this._getWrapper('company')
    return () => {
      return wrapper._make_get_request('company')
    }
  }

  get time_entries() {
    let wrapper = this._getWrapper('time_entries')

    wrapper.addMethod('stop', '${id}/stop', 'patch')
    wrapper.addMethod('restart', '${id}/restart', 'patch')

    return wrapper
  }

  get reports() {
    return this._getWrapper('reports/time/team')
  }


  _getWrapper(name) {
    if (!this.wrappers[name]) {
      this.wrappers[name] = new Wrapper(this.url, name, {
        headers: this.headers
      })
    }

    return this.wrappers[name]
  }

}
