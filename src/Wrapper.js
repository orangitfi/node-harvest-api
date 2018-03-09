'use strict'

const { Client } = require('node-rest-client')

module.exports = class Wrapper {

  constructor(base_url, endpoint, options = {}) {
    this.base_url = base_url
    this.endpoint = endpoint

    if (options.headers) {
      this.headers = {'headers': options.headers}
    } else {
      this.headers = {}
    }

    this.last_page = 0
    this.last_per_page = 0
    this.pipe_id = null
    this.pipe_path = ''
    this.rest_client = new Client()
  }

  all() {
    return this.get()
  }

  raw(args = {}) {
    return this.get(args, true)
  }

  async get(args = {}, raw = false) {

    this.last_page = 0
    this.last_per_page = 0

    if (args.limit) {
      args.per_page = Math.min(args.limit, 100)
      args.page = 1

      if (args.limit > 100) {
        this.last_page = Math.ceil(args.limit / 100)
        this.last_per_page = args.limit - Math.floor(args.limit / 100) * 100
      }

      delete args.limit
    }

    if ((args.page && !this.last_page) || raw) {
      let result = await this._make_get_request(this.endpoint, args)

      if (raw) return result

      let key = Object.keys(result)[0]
      return result[key]
    } else {
      return this._make_paged_get_request(this.endpoint, args)
    }
  }

  find(id) {
    return this._make_get_request(this.endpoint + '/' + id)
  }

  create(data) {
    return this._make_post_request(this.endpoint, { data })
  }

  update(id, data) {
    return this._make_patch_request(this.endpoint + '/' + id, { data })
  }

  delete(id) {
    return this._make_delete_request(this.endpoint + '/' + id)
  }

  addMethod(name, endpoint, method = 'get', fixed_args = {}) {
    let params = endpoint.match(/[^{\}]+(?=})/g)
    let func = '_make_' + method + '_request'

    if (!this[func]) {
      throw new Error(func + ' does not exist. Method is wrong. Only valid options are get, post, patch or delete')
    }
    
    this[name] = (...args) => {

      // Create path arguments for replacement.
      let pathArgs = {}
      for (let i in params) {
        pathArgs[params[i]] = args[i]
      }

      endpoint = this.endpoint + '/' + endpoint

      return this[func](endpoint, { path: pathArgs, data: fixed_args })
    }
  }

  addPipe(name, wrapper) {

    // Create pipe method.
    // Temporary store the given id.
    this.pipe = function(id) {
      this.pipe_id = id
      return this
    }

    // Create getter that creates the path.
    Object.defineProperty(this, name, {
      get: () => {
        wrapper.pipe_path = this.endpoint + '/' + this.pipe_id
        this.pipe_id = null

        return wrapper
      }
    })
  }

  async _make_get_request(endpoint, args = {}) {
    if (!args.parameters) {
      args = { parameters: args }
    }

    Object.assign(args, this.headers)

    endpoint = this.pipe_path + '/' + endpoint

    return new Promise((resolve, reject) => {
      this.rest_client.get(this.base_url + endpoint, args, (data, response) => {
        resolve(data)
      })
    })
  }


  async _make_paged_get_request(endpoint, args = {}) {
    let list = []
    let data = null
    
    if (!args.parameters) {
      args = { parameters: args }
    }

    if (!args.parameters.page) {
      args.parameters.page = 1
    }
  
    do {
      data = await this._make_get_request(endpoint, args)
      let key = Object.keys(data)[0]

      args.parameters.page = data.next_page

      list = list.concat(data[key])

      if (this.last_page) {
        if (data.next_page == this.last_page && this.last_per_page) {
          args.parameters.per_page = this.last_per_page
        }

        if (data.next_page > this.last_page) {
          break;
        }      
      }

    } while (data.next_page)

    return list
  }

  async _make_post_request(endpoint, args = {}) {
    Object.assign(this.headers.headers, {'Content-Type': 'application/json'})
    args = Object.assign({}, args, this.headers)

    endpoint = this.pipe_path + '/' + endpoint

    return new Promise((resolve, reject) => {
      this.rest_client.post(this.base_url + endpoint, args, (data, response) => {
        resolve(data)
      })
    })
  }

  async _make_patch_request(endpoint, args = {}) {
    Object.assign(this.headers.headers, {'Content-Type': 'application/json'})
    args = Object.assign({}, args, this.headers)

    endpoint = this.pipe_path + '/' + endpoint

    return new Promise((resolve, reject) => {
      this.rest_client.patch(this.base_url + endpoint, args, (data, response) => {
        resolve(data)
      })
    })
  }

  async _make_delete_request(endpoint) {
    endpoint = this.pipe_path + '/' + endpoint

    return new Promise((resolve, reject) => {
      this.rest_client.delete(this.base_url + endpoint, (data, response) => {
        resolve(data)
      })
    })
  }
}