import * as Session from '../services/session';

const api = `http://52.74.76.145:8084/v1`
const qs = require('query-string');
let token = Session.getToken()

const headers = {
  'Accept': 'application/json',
  'Authorization': token,
  'Content-Type': 'application/json'
}

// LOGIN

export const login = (body) => {
  const config= {}
  config.method = 'POST'
  config.route = `/users/login`
  config.body = body
  return queryService(config)
  // fetch(`${api}/users/login`, {
  //   method: 'POST',
  //   headers,
  //   body: JSON.stringify({
  //     username:body.username,
  //     password:body.password})
  // }).then(res => res.json(),err => console.log(err))
}

export const logout = () => {
  const config= {}
  config.method = 'POST'
  config.route = `/users/logout`
  return queryService(config)
}

// USERS

export const getUsers = ({params={}}) => {
  const config={}
  config.method = 'GET'
  config.route = `/users`
  config.params = params
  return queryService(config)
}

export const getUser = (id) => {
  const config={}
  config.method = 'GET'
  config.route = `/users/` + id
  return queryService(config)
}

export const createUser = (body) => {
  const config= {}
  config.method = 'POST'
  config.route = `/users`
  config.body = body
  return queryService(config)
}

export const updateUser = (body, uId, {params={}}) => {
  const config= {}
  config.method = 'PUT'
  config.route = `/users/${uId}`
  config.params = params
  config.body = body
  return queryService(config)
}

export const changePassword = (body, uId) => {
  const config= {}
  config.method = 'PUT'
  config.route = `/update-password/${uId}`
  config.body = body
  return queryService(config)
}

export const deleteUser = ({id}) => {
  const config= {}
  config.method = 'PUT'
  config.route = `/delete-user/${id}`
  return queryService(config)
}

// ROLES

export const getRoles = () => {
  const config={}
  config.method = 'GET'
  config.route = `/roles`
  return queryService(config)
}

export const createRole = (body) => {
  const config= {}
  config.method = 'POST'
  config.route = `/roles`
  config.body = body
  return queryService(config)
}

// PRODUCTS

export const getProducts = ({params={}}) => {
  const config={}
  config.method = 'GET'
  config.route = `/products`
  config.params = params
  return queryService(config)
}

export const getProduct = (id) => {
  const config={}
  config.method = 'GET'
  config.route = `/products/` + id
  return queryService(config)
}

export const createProduct = (body) => {
  return fetch(`${api}/products`, {
    method: 'POST',
    headers: {
      'Authorization': Session.getToken(),
    },
    body: body
  })
  .then(res => {
    if (res.ok)
      return res ? res.json() : {}
      else
      throw(res.json());
    }
  )
  .catch( (err={}) => {
    if (err.then)
      return err.then(function(data) {
          throw(data);
      })
    else {
        throw(
          {
              message: 'Error in Connection'
          }
        )
    }
  })
}

export const updateProduct = (body, uId) => {
  return fetch(`${api}/products/${uId}`, {
    method: 'PUT',
    headers: {
      'Authorization': Session.getToken(),
    },
    body: body
  })
  .then(res => {
    if (res.ok)
      return res ? res.json() : {}
      else
      throw(res.json());
    }
  )
  .catch( (err={}) => {
    if (err.then)
      return err.then(function(data) {
          throw(data);
      })
    else {
        throw(
          {
              message: 'Error in Connection'
          }
        )
    }
  })
}

export const deleteProduct = (body,id) => {
  const config= {}
  config.method = 'PUT'
  config.route = `/delete-product/${id}`
  config.body = body
  return queryService(config)
}

// ACTIVITIES
export const getActivities = ({params={}}) => {
  const config={}
  config.method = 'GET'
  config.route = `/activity`
  config.params = params
  return queryService(config)
}

// REPORTS

export const getReports = () => {
  const config={}
  config.method = 'GET'
  config.route = `/reports`
  return queryService(config)
}

export const getReport = (params, id) => {
  const config={}
  config.method = 'GET'
  config.route = `/reports/${id}`
  config.params = params
  return queryService(config)
}

export const getAverageReports = (params={}) => {
  const config={}
  config.method = 'GET'
  config.route = `/average/reports`
  config.params = params
  return queryService(config)
}

export const resetPassword = (body,token,id) =>
  fetch(`${api}/auth/forget_password/new_password?id=${id}&verify_token=${token}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'x-access-token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(res => res.json())
  .catch( (err={}) => {
    if (err.then)
      return err.then(function(data) {
          throw(data);
      })
    else {
        throw(
          {
              message: 'Error in Connection'
          }
        )
    }
  }
)

export const forgotPassword = (body) => {
  const config= {}
  config.method = 'POST'
  config.route = '/auth/forget_password'
  config.body = body
  return queryService(config)
}

export const queryService = ( { route, method, body, params } ) => {

  const new_headers = { 
      ...headers,
      'Authorization': Session.getToken()
    }
  
  const new_body = body ? JSON.stringify(body) : null

  for (let p in params) {
      params[p] = params[p] || undefined
  }
  const serializeParams = params ? ( '?' +qs.stringify(params, {sort: false})) : '';
  return fetch(`${api}${route}${serializeParams}`, {
      method,
      headers: {...new_headers},
      body: new_body
  }).then(res => {
      if (res.ok)
        return res ? res.json() : {}
        else
        throw(res.json());
      }
  ).catch( (err={}) => {
        if (err.then)
          return err.then(function(data) {
              throw(data);
          })
        else {
            throw(
              {
                  message: 'Error in Connection'
              }
            )
        }
      }
  )
}
